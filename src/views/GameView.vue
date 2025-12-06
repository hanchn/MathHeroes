<template>
  <div class="game-container">
    <div class="header">
      <button @click="router.back()">退出</button>
      <div class="score">得分: {{ score }}</div>
    </div>

    <div class="main-content" :class="{ 'mental-mode': isMentalMode }">
      <!-- 左侧：Emoji 展示区 (仅普通模式) -->
      <div v-if="!isMentalMode" class="visual-area">
        <div class="visual-row">
          <!-- 第一组 Emoji -->
          <EmojiGroup 
            :count="visualData.group1.count" 
            :emoji="currentEmoji" 
            :isHidden="visualData.group1.hidden && !showHint"
          />
        </div>
        <div class="operator-visual" v-if="visualData.operator">
          {{ visualData.operator }}
        </div>
        <div class="visual-row">
          <!-- 第二组 Emoji -->
          <EmojiGroup 
            :count="visualData.group2.count" 
            :emoji="currentEmoji" 
            :isHidden="visualData.group2.hidden && !showHint"
          />
        </div>
        
        <!-- 提示按钮 -->
        <button class="hint-btn" @click="triggerHint" :disabled="showHint">
          💡 提示
        </button>
      </div>

      <!-- 右侧：算式区 -->
      <div class="equation-area">
        <div class="equation">
          <!-- 数字1 -->
          <span v-if="problem.blankIndex !== 0">{{ problem.num1 }}</span>
          <input 
            v-else 
            type="number" 
            v-model="userAnswer" 
            ref="inputRef"
            @keyup.enter="checkAnswer"
            placeholder="?"
          />

          <span class="op">{{ problem.operator }}</span>

          <!-- 数字2 -->
          <span v-if="problem.blankIndex !== 1">{{ problem.num2 }}</span>
          <input 
            v-else 
            type="number" 
            v-model="userAnswer" 
            ref="inputRef"
            @keyup.enter="checkAnswer"
            placeholder="?"
          />

          <span class="eq">=</span>

          <!-- 结果 -->
          <span v-if="problem.blankIndex !== 2">{{ problem.result }}</span>
          <input 
            v-else 
            type="number" 
            v-model="userAnswer" 
            ref="inputRef"
            @keyup.enter="checkAnswer"
            placeholder="?"
          />
        </div>

        <div class="feedback" :class="feedbackClass">
          {{ feedbackMessage }}
        </div>

        <button class="submit-btn" @click="checkAnswer">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { generateProblem, getRandomEmoji } from '@/utils/mathGenerator'
import EmojiGroup from '@/components/EmojiGroup.vue'

const router = useRouter()
const route = useRoute()

const range = route.query.range || 10
const mode = route.query.mode || 'normal'
const isMentalMode = computed(() => mode === 'mental')

const score = ref(0)
const problem = ref({})
const userAnswer = ref('')
const currentEmoji = ref('🍎')
const showHint = ref(false)
const inputRef = ref(null)
const feedbackMessage = ref('')
const feedbackClass = ref('')

// 计算 Emoji 显示逻辑
// 目标是：根据题目类型和填空位置，决定显示哪些 Emoji
// 简单策略：始终显示已知数字的 Emoji。
// 如果是填空位置，默认隐藏（count=答案），提示时显示。
const visualData = computed(() => {
  const p = problem.value
  if (!p.num1 && p.num1 !== 0) return { group1: {}, group2: {} } // 初始化防空

  // 默认显示 num1 和 num2 的逻辑 (对应加法)
  // 但如果是减法 A - B = C，显示 A 和 B 吗？
  // 用户需求例子: "10 = 5 + ?" -> 左边显示 10 和 5
  // 这意味着显示的是“等式左边的数”和“等式右边的已知数”？或者“大数”和“小数”？
  // 让我们统一逻辑：显示题目中出现的两个数字对应的 Emoji。
  // 比如 3 + 2 = ? -> 显示 3 和 2
  // 比如 3 + ? = 5 -> 显示 3 和 5 (用户可以对比看出差是2)
  // 比如 ? - 2 = 3 -> 显示 2 和 3 (加起来是5)
  
  // 为了简化并符合直觉：
  // 如果是加法 A + B = C
  //   若 C 未知：显示 A 和 B
  //   若 A 未知：显示 C 和 B (提示时显示 A) -> 这样用户可以看 C 和 B 的差
  //   若 B 未知：显示 C 和 A
  
  // 如果是减法 A - B = C
  //   若 C 未知：显示 A 和 B (提示时显示 C?) 或者显示 A，划掉 B？
  //   为了简单，我们统一显示“已知项”。
  
  let g1 = { count: 0, hidden: false }
  let g2 = { count: 0, hidden: false }
  let op = ''

  if (p.operator === '+') {
    // 加法
    if (p.blankIndex === 2) { // ? 是结果
      g1 = { count: p.num1, hidden: false }
      g2 = { count: p.num2, hidden: false }
      op = '+'
    } else if (p.blankIndex === 0) { // ? + B = C
      g1 = { count: p.result, hidden: false } // 显示总数
      g2 = { count: p.num2, hidden: false }   // 显示已知部分
      // 提示时，或许可以高亮差异？这里简单处理：提示按钮不补全，而是高亮
      // 等等，需求说“提示模式会补全emoji”。
      // 这可能意味着：初始只显示已知，提示时显示未知。
      // 那我们修改策略：
      // 始终准备好所有相关的 Emoji 组。
      // 比如 A + B = C。我们始终渲染 A, B, C 三组？太乱了。
      
      // 回归用户例子：10 = 5 + ?
      // 显示 10 和 5。
      // 我们可以理解为：显示等式两边已知的最大数和另一个已知数。
      op = '?' // 关系比较复杂，不显示符号可能更好，或者显示对应关系
    } else { // A + ? = C
      g1 = { count: p.result, hidden: false }
      g2 = { count: p.num1, hidden: false }
    }
  } else {
    // 减法 A - B = C
    if (p.blankIndex === 2) { // A - B = ?
      g1 = { count: p.num1, hidden: false }
      g2 = { count: p.num2, hidden: false }
      op = '-'
    } else if (p.blankIndex === 0) { // ? - B = C
      g1 = { count: p.result, hidden: false }
      g2 = { count: p.num2, hidden: false }
    } else { // A - ? = C
      g1 = { count: p.num1, hidden: false }
      g2 = { count: p.result, hidden: false }
    }
  }
  
  // 提示逻辑：
  // 需求说提示补全 Emoji。
  // 如果上面的逻辑已经显示了两个已知数，那用户其实已经能算出来了。
  // 也许用户的意思是：题目本身只显示一部分，提示才显示另一部分？
  // 比如 5 + ? = 8。
  // 初始：只显示 5。
  // 提示：显示另外 3 个（补全成 8）。
  // 这样更符合“补全”的概念。
  
  // 让我们尝试这种“补全”逻辑：
  // 1. 找出最大的数（Result in +, Num1 in -）。
  // 2. 显示已知的部分。
  // 3. 缺失的部分设为 hidden=true，点击提示后显示。
  
  // 重置逻辑：
  let targetCount = 0
  let knownCount = 0
  let missingCount = 0
  
  if (p.operator === '+') { // A + B = C
     targetCount = p.result
     if (p.blankIndex === 2) { // A + B = ?
       // 这里没有“补全”概念，因为结果未知。
       // 这里应该显示 A 和 B。
       return {
         group1: { count: p.num1, hidden: false },
         group2: { count: p.num2, hidden: false },
         operator: '+'
       }
     } else if (p.blankIndex === 0) { // ? + B = C
       knownCount = p.num2
       missingCount = p.num1
     } else { // A + ? = C
       knownCount = p.num1
       missingCount = p.num2
     }
  } else { // A - B = C
    // 减法比较抽象。
    // 如果是 A - B = ?。显示 A，划掉 B？
    // 如果是 A - ? = C。显示 A，剩下 C，求划掉的？
    // 鉴于用户是儿童，加法补全比较好理解。
    // 减法我们就显示被减数和减数吧。
     return {
         group1: { count: p.num1, hidden: false },
         group2: { count: p.num2, hidden: false },
         operator: '-'
       }
  }
  
  // 针对加法填空的特殊“补全”视图
  return {
    group1: { count: knownCount, hidden: false }, // 上面：已知的
    group2: { count: missingCount, hidden: true }, // 下面：未知的（待补全）
    operator: '...' // 表示未完待续
  }
})

const initProblem = () => {
  problem.value = generateProblem('add_sub', range)
  userAnswer.value = ''
  currentEmoji.value = getRandomEmoji()
  showHint.value = false
  feedbackMessage.value = ''
  feedbackClass.value = ''
  
  nextTick(() => {
    if (inputRef.value) inputRef.value.focus()
  })
}

const triggerHint = () => {
  showHint.value = true
  setTimeout(() => {
    showHint.value = false
  }, 1000)
}

const checkAnswer = () => {
  if (userAnswer.value === '') return
  
  const val = parseInt(userAnswer.value)
  let correctVal
  const p = problem.value
  
  if (p.blankIndex === 0) correctVal = p.num1
  else if (p.blankIndex === 1) correctVal = p.num2
  else correctVal = p.result
  
  if (val === correctVal) {
    score.value += 10
    feedbackMessage.value = '🎉 正确！'
    feedbackClass.value = 'success'
    setTimeout(initProblem, 1000)
  } else {
    feedbackMessage.value = '❌ 再试一次'
    feedbackClass.value = 'error'
    userAnswer.value = ''
  }
}

onMounted(initProblem)

// 监听路由变化（如果需要在同组件内切换）
watch(() => route.query, initProblem)
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.score {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff9800;
}

.main-content {
  display: flex;
  flex: 1;
  gap: 40px;
  align-items: center;
  justify-content: center;
}

.main-content.mental-mode .visual-area {
  display: none;
}

.visual-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background: #f0f4f8;
  padding: 30px;
  border-radius: 20px;
  min-height: 300px;
  justify-content: center;
}

@media (prefers-color-scheme: dark) {
  .visual-area {
    background: #2c3e50;
  }
}

.visual-row {
  min-height: 60px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.operator-visual {
  font-size: 2rem;
  color: #aaa;
}

.equation-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.equation {
  font-size: 3rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

input {
  font-size: 2.5rem;
  width: 120px;
  text-align: center;
  border: 3px solid #42b983;
  border-radius: 10px;
  padding: 5px;
  background: transparent;
  color: inherit;
}

input:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(66, 185, 131, 0.3);
}

.op, .eq {
  color: #666;
}

.hint-btn {
  margin-top: 20px;
  background: #ffc107;
  color: #333;
  border: none;
}

.hint-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-btn {
  font-size: 1.5rem;
  padding: 15px 40px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 50px;
}

.feedback {
  height: 40px;
  font-size: 1.5rem;
  font-weight: bold;
}

.feedback.success { color: #42b983; }
.feedback.error { color: #f44336; }

/* 移动端适配 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .visual-area, .equation-area {
    width: 100%;
  }
  
  .equation {
    font-size: 2rem;
  }
  
  input {
    font-size: 1.8rem;
    width: 80px;
  }
}
</style>
