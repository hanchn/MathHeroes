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
        <!-- 三角形布局 -->
        <div class="triangle-container">
          <!-- 顶部：总数 -->
          <div class="triangle-top">
            <EmojiGroup 
              :count="visualData.top.count" 
              :emoji="currentEmoji" 
              :isHidden="visualData.top.hidden && !showHint"
              class="emoji-node"
            />
          </div>
          
          <!-- 连接线 -->
          <div class="triangle-lines">
            <div class="line-left"></div>
            <div class="line-right"></div>
          </div>

          <!-- 底部：两个部分 -->
          <div class="triangle-bottom">
            <div class="bottom-node">
              <EmojiGroup 
                :count="visualData.left.count" 
                :emoji="currentEmoji" 
                :isHidden="visualData.left.hidden && !showHint"
                class="emoji-node"
              />
            </div>
            <div class="bottom-node">
              <EmojiGroup 
                :count="visualData.right.count" 
                :emoji="currentEmoji" 
                :isHidden="visualData.right.hidden && !showHint"
                class="emoji-node"
              />
            </div>
          </div>
        </div>
        
        <button class="hint-btn" @click="triggerHint" :disabled="showHint">
          💡 提示一下
        </button>
      </div>

      <!-- 右侧：算式区 -->
      <div class="equation-area">
        <div class="equation">
          <!-- 复杂运算模式 -->
          <template v-if="problem.type === 'complex'">
             <span>{{ problem.num1 }}</span>
             <span class="op">{{ problem.operator1 }}</span>
             <span>{{ problem.num2 }}</span>
             <span class="op">{{ problem.operator2 }}</span>
             <span>{{ problem.num3 }}</span>
             <span class="eq">=</span>
             <span class="blank-placeholder">{{ userAnswer || '?' }}</span>
          </template>

          <!-- 普通模式 -->
          <template v-else>
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
          </template>
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
            :class="{ listening: isListening, disabled: !hasSpeechSupport }" 
            @click="startVoiceInput"
            :disabled="isProcessing || !hasSpeechSupport"
          >
            {{ hasSpeechSupport ? (isListening ? '👂 听写中...' : '🎤 语音回答') : '🚫 不支持语音' }}
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
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { generateProblem, generateComplexProblem, getRandomEmoji } from '@/utils/mathGenerator'
import { parseVoiceInput } from '@/utils/voiceUtils'
import EmojiGroup from '@/components/EmojiGroup.vue'

const router = useRouter()
const route = useRoute()

// 参数获取
const type = route.query.type || 'add_sub'
const range = route.query.range || 10
const mode = route.query.mode || 'normal'
const totalQuestions = parseInt(route.query.count) || 10
const isMentalMode = computed(() => mode === 'mental' || type === 'complex') // 复杂运算强制心算模式

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
const hasErrorInCurrent = ref(false) // 当前题目是否出错过

// 语音识别相关
const isListening = ref(false)
const hasSpeechSupport = ref(false)
let recognition = null

// 当前题目
const problem = computed(() => questions.value[currentIndex.value] || {})

// 进度百分比
const progressPercentage = computed(() => {
  return ((currentIndex.value) / totalQuestions) * 100
})

// 初始化题目集
const initGame = async () => {
  const qList = []
  
  // 尝试从本地题库加载 (仅限 add_sub)
  if (type === 'add_sub') {
    try {
      // 假设题库文件名按 range 命名，例如 5.json, 10.json
      // 注意：在生产环境或没有对应文件时，fetch 可能会 404
      const response = await fetch(`/question_bank/${range}.json`)
      if (response.ok) {
        const bank = await response.json()
        // 随机抽取指定数量的题目
        // 如果题库数量不够，则全部取用，剩下的自动生成
        const shuffled = bank.sort(() => 0.5 - Math.random())
        const selected = shuffled.slice(0, totalQuestions)
        
        // 添加到列表（需确保格式一致）
        selected.forEach(q => {
          // 确保 id 唯一，避免 key 冲突
          qList.push({ ...q, id: `bank_${q.id}_${Date.now()}` })
        })
        
        console.log(`从题库加载了 ${selected.length} 题`)
      }
    } catch (e) {
      console.log('加载本地题库失败或不存在，将使用自动生成', e)
    }
  }
  
  // 如果题目不够，自动生成补齐
  while (qList.length < totalQuestions) {
    if (type === 'complex') {
      qList.push(generateComplexProblem(range))
    } else {
      qList.push(generateProblem('add_sub', range))
    }
  }
  
  questions.value = qList
  
  // 重置状态
  currentIndex.value = 0
  score.value = 0
  correctCount.value = 0
  wrongAnswers.value = []
  
  loadQuestion()
  
  // 初始化语音识别
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    hasSpeechSupport.value = true
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition = new SpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.continuous = false
    recognition.interimResults = false
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      console.log('Voice result:', transcript)
      
      // 使用新的解析逻辑
      const num = parseVoiceInput(transcript)
      
      if (num !== null) {
        userAnswer.value = num
        feedbackMessage.value = `识别为: ${num}`
        feedbackClass.value = 'info'
        // 稍微延迟一下提交，让用户看到识别结果
        setTimeout(() => checkAnswer(), 500)
      } else {
        feedbackMessage.value = `没听清 "${transcript}"`
        feedbackClass.value = 'info'
      }
      isListening.value = false
    }

    recognition.onerror = (event) => {
      console.error('Voice error:', event.error)
      isListening.value = false
      if (event.error === 'not-allowed') {
        feedbackMessage.value = '请允许麦克风权限'
      } else if (event.error === 'no-speech') {
        feedbackMessage.value = '没听到声音，请重试'
      } else if (event.error === 'network') {
        feedbackMessage.value = '网络错误(Chrome需连接Google服务)'
        // 提示用户尝试 Safari
        if (navigator.userAgent.includes('Chrome')) {
           setTimeout(() => alert('Chrome 语音识别需要连接 Google 服务器。国内用户请尝试使用 Safari 浏览器或检查网络代理。'), 500)
        }
      } else {
        feedbackMessage.value = `出错: ${event.error}`
      }
      feedbackClass.value = 'error'
    }
    
    recognition.onend = () => {
      isListening.value = false
    }
  }
}

onUnmounted(() => {
  if (recognition) {
    recognition.abort()
  }
})

const loadQuestion = () => {
  userAnswer.value = ''
  currentEmoji.value = getRandomEmoji()
  showHint.value = false
  feedbackMessage.value = ''
  feedbackClass.value = ''
  isProcessing.value = false
  hasErrorInCurrent.value = false // 重置错误标记
  
  nextTick(() => {
    if (inputRef.value) inputRef.value.focus()
  })
}

// 视觉展示逻辑 (三角结构：Top=总数, Left/Right=部分)
const visualData = computed(() => {
  const p = problem.value
  if (!p.num1 && p.num1 !== 0) return { top: {}, left: {}, right: {} }

  let top = { count: 0, hidden: false }
  let left = { count: 0, hidden: false }
  let right = { count: 0, hidden: false }

  // 统一映射：
  // 加法 A + B = C  => Top=C, Left=A, Right=B
  // 减法 A - B = C  => Top=A, Left=B, Right=C (A是被减数，即总数)

  if (p.operator === '+') {
    // 加法: num1 + num2 = result
    top.count = p.result
    left.count = p.num1
    right.count = p.num2

    // 隐藏逻辑：未知的数字隐藏
    if (p.blankIndex === 2) top.hidden = true // 结果未知
    else if (p.blankIndex === 0) left.hidden = true // num1未知
    else if (p.blankIndex === 1) right.hidden = true // num2未知

  } else {
    // 减法: num1 - num2 = result
    top.count = p.num1 // 被减数是总数
    left.count = p.num2 // 减数
    right.count = p.result // 差

    // 隐藏逻辑
    if (p.blankIndex === 0) top.hidden = true // 被减数未知
    else if (p.blankIndex === 1) left.hidden = true // 减数未知
    else if (p.blankIndex === 2) right.hidden = true // 差未知
  }
  
  return { top, left, right }
})

const triggerHint = () => {
  // 检查是否有隐藏的 Emoji
  const hasHidden = visualData.value.top.hidden || visualData.value.left.hidden || visualData.value.right.hidden
  
  if (!hasHidden) {
    feedbackMessage.value = '数一数图中有多少个？'
    feedbackClass.value = 'info'
    setTimeout(() => {
      feedbackMessage.value = ''
    }, 1500)
    return
  }

  showHint.value = true
  setTimeout(() => {
    showHint.value = false
  }, 1000)
}

const startVoiceInput = () => {
  if (!hasSpeechSupport.value) return
  
  // 如果正在监听，再次点击则停止
  if (isListening.value) {
    recognition.stop()
    isListening.value = false
    return
  }
  
  isListening.value = true
  feedbackMessage.value = '请说话...'
  feedbackClass.value = 'info'
  try {
    recognition.start()
  } catch (e) {
    console.error('Start recognition failed', e)
    isListening.value = false
  }
  
  // 延长超时时间到 8 秒
  setTimeout(() => {
    if (isListening.value) {
      recognition.stop()
      // 如果超时还没结果，给个提示
      if (feedbackMessage.value === '请说话...') {
        feedbackMessage.value = '超时未检测到语音'
        feedbackClass.value = 'info'
      }
    }
  }, 8000)
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
    // 只有未曾出错才加分
    if (!hasErrorInCurrent.value) {
      score.value += (100 / totalQuestions)
      correctCount.value++
    }
    
    feedbackMessage.value = '🎉 太棒了！正确！'
    feedbackClass.value = 'success'
    
    // 自动进入下一题
    setTimeout(nextQuestion, 1000)
  } else {
    // 错误
    hasErrorInCurrent.value = true // 标记当前题目出错过
    feedbackMessage.value = '❌ 哎呀，不对哦'
    feedbackClass.value = 'error'
    isProcessing.value = false // 允许重试
    
    // 记录错题（去重）
    const alreadyRecorded = wrongAnswers.value.some(w => w.problem.id === p.id)
    if (!alreadyRecorded) {
      wrongAnswers.value.push({
        problem: JSON.parse(JSON.stringify(p)), // 深度复制防止引用问题
        userAnswer: val
      })
    }
  }
}

const passQuestion = () => {
  if (isProcessing.value) return
  isProcessing.value = true
  hasErrorInCurrent.value = true // Pass 也算错
  
  // Pass 算错
  const p = problem.value
  const alreadyRecorded = wrongAnswers.value.some(w => w.problem.id === p.id)
  if (!alreadyRecorded) {
    wrongAnswers.value.push({
      problem: JSON.parse(JSON.stringify(p)), // 深度复制
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
  // 使用 sessionStorage 传递数据，避免 router state 丢失问题
  const resultData = {
    totalQuestions,
    correctCount: correctCount.value,
    wrongAnswers: JSON.parse(JSON.stringify(wrongAnswers.value))
  }
  sessionStorage.setItem('gameResult', JSON.stringify(resultData))
  
  router.push({ name: 'result' })
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
  min-height: 400px; /* 增加高度 */
  justify-content: center;
}

.triangle-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.triangle-top {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.triangle-lines {
  display: flex;
  justify-content: center;
  gap: 80px; /* 增加间距 */
  width: 240px; /* 增加宽度 */
  height: 60px; /* 增加高度 */
  position: relative;
  margin: 10px 0; /* 上下增加留白 */
}

.line-left, .line-right {
  width: 3px; /* 加粗线条 */
  height: 70px; /* 增加长度 */
  background-color: #ccc; /* 颜色更柔和 */
  position: absolute;
  top: -20px;
  border-radius: 2px;
}

.line-left {
  left: 50%;
  transform: translateX(-50%) rotate(35deg); /* 调整角度 */
  transform-origin: top center;
}

.line-right {
  left: 50%;
  transform: translateX(-50%) rotate(-35deg); /* 调整角度 */
  transform-origin: top center;
}

.triangle-bottom {
  display: flex;
  justify-content: center;
  gap: 60px; /* 增加底部两个节点的间距 */
  width: 100%;
}

.bottom-node {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 200px;
}

.emoji-node {
  border: 2px dashed rgba(0,0,0,0.1); /* 增加边框方便看范围 */
  min-width: 60px;
  min-height: 60px;
}

@media (prefers-color-scheme: dark) {
  .visual-area {
    background: #2c3e50;
  }
  .emoji-node {
    border-color: rgba(255,255,255,0.1);
  }
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

.voice-btn.disabled {
  background: #ccc;
  cursor: not-allowed;
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
