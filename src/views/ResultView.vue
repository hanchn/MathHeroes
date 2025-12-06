<template>
  <div class="result-container">
    <div class="no-print">
      <h1>🎉 挑战完成！</h1>
      
      <div class="score-card">
        <div class="score-circle">
          <span class="score-value">{{ score }}</span>
          <span class="score-total">/ 100</span>
        </div>
        <p class="comment">{{ getComment(score) }}</p>
      </div>

      <div class="actions">
        <button class="primary-btn" @click="router.push('/')">🏠 返回主页</button>
        <button class="secondary-btn" @click="printResults" v-if="wrongAnswers.length > 0">🖨️ 打印错题</button>
      </div>
    </div>

    <!-- 错题列表 (屏幕显示 & 打印用) -->
    <div class="mistakes-section" v-if="wrongAnswers.length > 0">
      <h2>📝 错题本</h2>
      <div class="mistake-list">
        <div v-for="(item, index) in wrongAnswers" :key="index" class="mistake-item">
          <span class="question">
            {{ formatQuestion(item.problem) }}
          </span>
          <span class="user-ans">你的答案: {{ item.userAnswer }}</span>
          <span class="correct-ans">正确答案: {{ getCorrectAnswer(item.problem) }}</span>
        </div>
      </div>
    </div>
    <div v-else class="perfect-score">
      <h2>🌟 太棒了！全对！🌟</h2>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 从 sessionStorage 获取数据
let totalQuestions = 10
let correctCount = 0
let wrongAnswers = []

try {
  const data = JSON.parse(sessionStorage.getItem('gameResult') || '{}')
  totalQuestions = data.totalQuestions || 10
  correctCount = data.correctCount || 0
  wrongAnswers = data.wrongAnswers || []
} catch (e) {
  console.error('Parse result error', e)
}

const score = computed(() => {
  if (totalQuestions === 0) return 0
  return Math.round((correctCount / totalQuestions) * 100)
})

const getComment = (s) => {
  if (s === 100) return "完美！你是数学小天才！🏆"
  if (s >= 80) return "很棒！继续加油！🌟"
  if (s >= 60) return "及格啦，多加练习会更好！💪"
  return "别灰心，下次一定行！🌱"
}

const getCorrectAnswer = (p) => {
  if (p.type === 'complex') return p.result
  if (p.blankIndex === 0) return p.num1
  if (p.blankIndex === 1) return p.num2
  return p.result
}

const formatQuestion = (p) => {
  if (p.type === 'complex') {
    return `${p.num1} ${p.operator1} ${p.num2} ${p.operator2} ${p.num3} = ${p.result}`
  }
  // 还原题目字符串，例如 3 + ? = 5
  let p1 = p.blankIndex === 0 ? '___' : p.num1
  let p2 = p.blankIndex === 1 ? '___' : p.num2
  let res = p.blankIndex === 2 ? '___' : p.result
  return `${p1} ${p.operator} ${p2} = ${res}`
}

const printResults = () => {
  window.print()
}
</script>

<style scoped>
.result-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  background: white;
  min-height: 100vh;
  color: #2c3e50;
}

h1 {
  color: #42b983;
  font-size: 2.5rem;
  margin-bottom: 30px;
}

.score-card {
  background: #f8f9fa;
  padding: 40px;
  border-radius: 20px;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: #42b983;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 5px 15px rgba(66, 185, 131, 0.4);
}

.score-value {
  font-size: 3.5rem;
  font-weight: bold;
  line-height: 1;
}

.score-total {
  font-size: 1rem;
  opacity: 0.8;
}

.comment {
  font-size: 1.5rem;
  font-weight: bold;
  color: #666;
}

.actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 50px;
}

button {
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

button:hover {
  transform: translateY(-2px);
}

.primary-btn {
  background: #42b983;
  color: white;
  box-shadow: 0 5px 15px rgba(66, 185, 131, 0.3);
}

.secondary-btn {
  background: #ffc107;
  color: #333;
  box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
}

.mistakes-section {
  text-align: left;
  border-top: 2px dashed #eee;
  padding-top: 30px;
}

.mistake-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #eee;
  font-size: 1.2rem;
}

.question {
  font-weight: bold;
  flex: 1;
}

.user-ans {
  color: #f44336;
  margin-right: 20px;
}

.correct-ans {
  color: #42b983;
  font-weight: bold;
}

@media print {
  .no-print {
    display: none !important;
  }
  .result-container {
    padding: 0;
    box-shadow: none;
    margin: 0;
    max-width: 100%;
  }
  .mistakes-section {
    border: none;
    padding-top: 0;
  }
  .mistake-item {
    border-bottom: 1px solid #000;
    page-break-inside: avoid;
  }
  body {
    background: white;
  }
  /* 确保打印时文字颜色为黑色 */
  * {
    color: black !important;
  }
}
</style>
