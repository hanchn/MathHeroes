<template>
  <div class="game-container">
    <!-- 顶部导航与进度 -->
    <div class="header">
      <button class="nav-btn" @click="router.back()">✖️ 退出</button>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        <span class="progress-text">{{ currentIndex + 1 }} / {{ totalQuestions }}</span>
      </div>
      <div class="score-badge">得分: {{ score }}</div>
    </div>

    <div class="main-content" :class="{ 'mental-mode': isMentalMode }">
      <!-- 左侧：Emoji 展示区 (仅普通模式) -->
      <div v-if="!isMentalMode" class="visual-area">
        <div class="visual-row">
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
          <EmojiGroup 
            :count="visualData.group2.count" 
            :emoji="currentEmoji" 
            :isHidden="visualData.group2.hidden && !showHint"
          />
        </div>
        
        <button class="hint-btn" @click="triggerHint" :disabled="showHint">
          💡 提示一下
        </button>
      </div>

      <!-- 右侧：算式区 -->
      <div class="equation-area">
        <div class="equation">
          <span :class="{ 'blank-placeholder': problem.blankIndex === 0 }">
            {{ problem.blankIndex === 0 && !userAnswer ? '?' : (problem.blankIndex === 0 ? userAnswer : problem.num1) }}
          </span>
          
          <span class="op">{{ problem.operator }}</span>
          
          <span :class="{ 'blank-placeholder': problem.blankIndex === 1 }">
            {{ problem.blankIndex === 1 && !userAnswer ? '?' : (problem.blankIndex === 1 ? userAnswer : problem.num2) }}
          </span>
          
          <span class="eq">=</span>
          
          <span :class="{ 'blank-placeholder': problem.blankIndex === 2 }">
            {{ problem.blankIndex === 2 && !userAnswer ? '?' : (problem.blankIndex === 2 ? userAnswer : problem.result) }}
          </span>
        </div>

        <!-- 输入控制区 -->
        <div class="input-controls">
          <input 
            type="number" 
            v-model="userAnswer" 
            ref="inputRef"
            @keyup.enter="checkAnswer"
            placeholder="输入答案"
            :disabled="isProcessing"
          />
          
          <button 
            class="voice-btn" 
            :class="{ listening: isListening }" 
            @click="startVoiceInput"
            :disabled="isProcessing"
          >
            {{ isListening ? '👂 听写中...' : '🎤 语音回答' }}
          </button>
        </div>

        <div class="feedback" :class="feedbackClass">
          {{ feedbackMessage }}
        </div>

        <div class="action-buttons">
          <button class="pass-btn" @click="passQuestion" :disabled="isProcessing">Pass (跳过)</button>
          <button class="submit-btn" @click="checkAnswer" :disabled="isProcessing">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { generateProblem, getRandomEmoji } from '@/utils/mathGenerator'
import EmojiGroup from '@/components/EmojiGroup.vue'

const router = useRouter()
const route = useRoute()

// 参数获取
const range = route.query.range || 10
const mode = route.query.mode || 'normal'
const totalQuestions = parseInt(route.query.count) || 10
const isMentalMode = computed(() => mode === 'mental')

// 状态
const questions = ref([])
const currentIndex = ref(0)
const score = ref(0)
const correctCount = ref(0)
const wrongAnswers = ref([]) // { problem, userAnswer }

const userAnswer = ref('')
const currentEmoji = ref('🍎')
const showHint = ref(false)
const inputRef = ref(null)
const feedbackMessage = ref('')
const feedbackClass = ref('')
const isProcessing = ref(false) // 防止重复提交

// 语音识别相关
const isListening = ref(false)
let recognition = null

// 当前题目
const problem = computed(() => questions.value[currentIndex.value] || {})

// 进度百分比
const progressPercentage = computed(() => {
  return ((currentIndex.value) / totalQuestions) * 100
})

// 初始化题目集
const initGame = () => {
  const qList = []
  for (let i = 0; i < totalQuestions; i++) {
    qList.push(generateProblem('add_sub', range))
  }
  questions.value = qList
  loadQuestion()
  
  // 初始化语音识别
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition = new SpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.continuous = false
    recognition.interimResults = false
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      console.log('Voice result:', transcript)
      // 尝试提取数字
      const match = transcript.match(/\d+/)
      if (match) {
        userAnswer.value = match[0]
        checkAnswer() // 自动提交
      } else {
        feedbackMessage.value = `没听清，你说的是 "${transcript}" 吗？`
        feedbackClass.value = 'info'
      }
      isListening.value = false
    }

    recognition.onerror = (event) => {
      console.error('Voice error:', event.error)
      isListening.value = false
      feedbackMessage.value = '语音识别失败，请重试'
      feedbackClass.value = 'error'
    }
    
    recognition.onend = () => {
      isListening.value = false
    }
  }
}

const loadQuestion = () => {
  userAnswer.value = ''
  currentEmoji.value = getRandomEmoji()
  showHint.value = false
  feedbackMessage.value = ''
  feedbackClass.value = ''
  isProcessing.value = false
  
  nextTick(() => {
    if (inputRef.value) inputRef.value.focus()
  })
}

// 视觉展示逻辑 (复用之前的逻辑)
const visualData = computed(() => {
  const p = problem.value
  if (!p.num1 && p.num1 !== 0) return { group1: {}, group2: {} }

  let knownCount = 0
  let missingCount = 0
  let op = ''

  if (p.operator === '+') {
     if (p.blankIndex === 2) { // A + B = ?
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
     op = '...'
  } else { // A - B = C
     return {
         group1: { count: p.num1, hidden: false },
         group2: { count: p.num2, hidden: false },
         operator: '-'
       }
  }
  
  return {
    group1: { count: knownCount, hidden: false },
    group2: { count: missingCount, hidden: true },
    operator: op
  }
})

const triggerHint = () => {
  showHint.value = true
  setTimeout(() => {
    showHint.value = false
  }, 1000)
}

const startVoiceInput = () => {
  if (!recognition) {
    alert('您的浏览器不支持语音识别，请使用 Chrome 浏览器。')
    return
  }
  if (isListening.value) return
  
  isListening.value = true
  feedbackMessage.value = '请说话...'
  feedbackClass.value = 'info'
  recognition.start()
  
  // 3秒后如果没有结果自动停止 (虽然 recognition.onend 会处理，但加个保险)
  setTimeout(() => {
    if (isListening.value) {
      recognition.stop()
    }
  }, 3000)
}

const getCorrectVal = (p) => {
  if (p.blankIndex === 0) return p.num1
  else if (p.blankIndex === 1) return p.num2
  else return p.result
}

const checkAnswer = () => {
  if (userAnswer.value === '' || isProcessing.value) return
  isProcessing.value = true
  
  const val = parseInt(userAnswer.value)
  const p = problem.value
  const correctVal = getCorrectVal(p)
  
  if (val === correctVal) {
    // 正确
    score.value += (100 / totalQuestions) // 简单分数计算
    correctCount.value++
    feedbackMessage.value = '🎉 太棒了！正确！'
    feedbackClass.value = 'success'
    
    // 自动进入下一题
    setTimeout(nextQuestion, 1000)
  } else {
    // 错误
    feedbackMessage.value = '❌ 哎呀，不对哦'
    feedbackClass.value = 'error'
    isProcessing.value = false // 允许重试？
    // 需求说：要给结果页面 打分 错题 打印
    // 这意味着错误也应该被记录，然后进入下一题？或者允许重试？
    // 通常 Pass 才是跳过。错误可以重试，也可以算错直接下一题。
    // 为了简单起见，我们允许用户重试，如果用户点 Pass 或者一直错到最后，才算错。
    // 但为了“错题打印”，我们需要记录用户做错过的题。
    // 策略：如果答错了，记录到错题本（如果不重复记录），并提示错误。用户可以继续尝试。
    
    // 检查是否已经记录过
    const alreadyRecorded = wrongAnswers.value.some(w => w.problem.id === p.id)
    if (!alreadyRecorded) {
      wrongAnswers.value.push({
        problem: p,
        userAnswer: val
      })
    }
  }
}

const passQuestion = () => {
  if (isProcessing.value) return
  isProcessing.value = true
  
  // Pass 算错
  const p = problem.value
  const alreadyRecorded = wrongAnswers.value.some(w => w.problem.id === p.id)
  if (!alreadyRecorded) {
    wrongAnswers.value.push({
      problem: p,
      userAnswer: 'Pass'
    })
  }
  
  feedbackMessage.value = '⏭️ 已跳过'
  feedbackClass.value = 'info'
  setTimeout(nextQuestion, 500)
}

const nextQuestion = () => {
  if (currentIndex.value < totalQuestions - 1) {
    currentIndex.value++
    loadQuestion()
  } else {
    finishGame()
  }
}

const finishGame = () => {
  // 跳转到结果页
  // 使用 name 跳转并传递 params 需要在路由配置 props: true
  // 这里我们使用 state 或者 query 传递复杂对象有点麻烦，
  // 推荐使用 pinia，但这里没装。
  // 简单起见，我们通过 params 传参（Vue Router 4 params 在刷新后会丢失，除非 history state）
  // 或者直接把数据放在 query 里（如果是简单的）
  // wrongAnswers 可能是个数组，JSON.stringify 放 query 吧
  
  // 注意：路由需要支持 params 传递对象不太行，最好用 query 传 JSON
  // 但 wrongAnswers 可能很长。
  // 让我们试试 history.state
  
  router.push({
    name: 'result',
    state: {
      totalQuestions,
      correctCount: correctCount.value,
      wrongAnswers: JSON.parse(JSON.stringify(wrongAnswers.value))
    }
  })
}

onMounted(initGame)
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.nav-btn {
  background: #eee;
  color: #666;
  padding: 8px 16px;
  font-size: 1rem;
}

.progress-bar {
  flex: 1;
  height: 20px;
  background: #f0f0f0;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #42b983;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  color: #333;
  font-weight: bold;
}

.score-badge {
  background: #fff3cd;
  color: #856404;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
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

/* 视觉区域样式 */
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

.hint-btn {
  background: #ffc107;
  color: #333;
  border: none;
  font-size: 1.1rem;
}

/* 算式区域样式 */
.equation-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
}

.equation {
  font-size: 3.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
}

.blank-placeholder {
  color: #42b983;
  text-decoration: underline;
}

.input-controls {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  max-width: 400px;
}

input {
  flex: 1;
  font-size: 2rem;
  padding: 10px;
  text-align: center;
  border: 3px solid #ddd;
  border-radius: 15px;
  outline: none;
}

input:focus {
  border-color: #42b983;
}

.voice-btn {
  font-size: 1.5rem;
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
}

.voice-btn.listening {
  background: #e74c3c;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.action-buttons {
  display: flex;
  gap: 20px;
  width: 100%;
  max-width: 400px;
}

.submit-btn {
  flex: 2;
  font-size: 1.5rem;
  padding: 15px;
  background: #42b983;
  color: white;
  border: none;
}

.pass-btn {
  flex: 1;
  font-size: 1.2rem;
  padding: 15px;
  background: #95a5a6;
  color: white;
  border: none;
}

.feedback {
  height: 30px;
  font-size: 1.2rem;
  font-weight: bold;
}

.feedback.success { color: #42b983; }
.feedback.error { color: #f44336; }
.feedback.info { color: #3498db; }

/* 移动端适配 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .visual-area, .equation-area {
    width: 100%;
  }
  
  .equation {
    font-size: 2.5rem;
  }
  
  .input-controls {
    flex-direction: column;
  }
  
  input {
    width: 100%;
  }
  
  .voice-btn {
    width: 100%;
  }
}
</style>
