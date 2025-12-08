<template>
  <div class="composition-container">
    <div class="header">
      <button class="back-btn" @click="router.back()">← 返回</button>
      <h1>🔢 数字组合</h1>
    </div>

    <div class="game-area">
      <div class="number-bond">
        <!-- Top Circle (Total) -->
        <div class="bond-node total-node">
          <div class="number-circle total">{{ currentNumber }}</div>
          <div class="label">是由什么组成的？</div>
        </div>

        <!-- Connection Lines -->
        <div class="lines">
          <div class="line left-line"></div>
          <div class="line right-line"></div>
        </div>

        <!-- Bottom Circles (Parts) -->
        <div class="parts-container">
          <div class="bond-node part-node">
            <input 
              type="number" 
              v-model="userTens" 
              class="number-input" 
              placeholder="?"
              :class="{ 'correct': isCorrect && checkMode, 'error': !isCorrect && checkMode && !tensCorrect }"
              @keyup.enter="checkAnswer"
            />
            <div class="label">整十</div>
          </div>
          <div class="plus-sign">+</div>
          <div class="bond-node part-node">
            <input 
              type="number" 
              v-model="userOnes" 
              class="number-input" 
              placeholder="?"
              :class="{ 'correct': isCorrect && checkMode, 'error': !isCorrect && checkMode && !onesCorrect }"
              @keyup.enter="checkAnswer"
            />
            <div class="label">个位</div>
          </div>
        </div>
      </div>

      <div class="controls">
        <div v-if="feedback" class="feedback" :class="feedbackType">
          {{ feedback }}
        </div>
        
        <button v-if="!isCorrect" class="action-btn check-btn" @click="checkAnswer">
          检查
        </button>
        <button v-else class="action-btn next-btn" @click="nextQuestion">
          下一题
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentNumber = ref(0)
const userTens = ref('')
const userOnes = ref('')
const checkMode = ref(false)
const feedback = ref('')
const feedbackType = ref('')

const correctTens = computed(() => Math.floor(currentNumber.value / 10) * 10)
const correctOnes = computed(() => currentNumber.value % 10)

const tensCorrect = computed(() => parseInt(userTens.value) === correctTens.value)
const onesCorrect = computed(() => parseInt(userOnes.value) === correctOnes.value)
const isCorrect = computed(() => tensCorrect.value && onesCorrect.value)

const generateNumber = () => {
  // Generate number between 10 and 99
  currentNumber.value = Math.floor(Math.random() * 90) + 10
  userTens.value = ''
  userOnes.value = ''
  checkMode.value = false
  feedback.value = ''
  feedbackType.value = ''
}

const checkAnswer = () => {
  if (!userTens.value || !userOnes.value) {
    feedback.value = '请填入两个数字'
    feedbackType.value = 'warning'
    return
  }

  checkMode.value = true
  
  if (isCorrect.value) {
    feedback.value = '🎉 太棒了！回答正确！'
    feedbackType.value = 'success'
    playAudio('correct')
  } else {
    feedback.value = '🤔 再试一次哦'
    feedbackType.value = 'error'
    playAudio('wrong')
  }
}

const nextQuestion = () => {
  generateNumber()
}

// Simple audio feedback (placeholder)
const playAudio = (type) => {
  // Implement audio feedback if needed
}

onMounted(() => {
  generateNumber()
})
</script>

<style scoped>
.composition-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
}

.back-btn {
  padding: 12px 24px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  background: white;
  color: var(--text-main);
  font-size: 1rem;
  font-weight: 700;
  margin-right: 20px;
  box-shadow: 0 4px 0 rgba(0,0,0,0.05);
  transition: all 0.2s;
  border: 1px solid #eee;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 rgba(0,0,0,0.05);
}

h1 {
  color: var(--text-main);
  margin: 0;
  flex: 1;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 900;
  transform: translateX(-40px);
}

.game-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
}

/* Background decoration */
.game-area::before {
  content: '';
  position: absolute;
  top: -50px;
  left: -50px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(255, 159, 243, 0.1);
}

.game-area::after {
  content: '';
  position: absolute;
  bottom: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(84, 160, 255, 0.1);
}

.number-bond {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin-bottom: 40px;
}

.bond-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.number-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--gradient-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: 800;
  box-shadow: 0 10px 20px rgba(84, 160, 255, 0.3);
  margin-bottom: 10px;
}

.number-input {
  width: 100px;
  height: 100px;
  border-radius: 24px;
  border: 3px solid #eee;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-main);
  background: #f8f9fa;
  outline: none;
  transition: all 0.3s;
  margin-bottom: 10px;
}

.number-input:focus {
  border-color: var(--secondary-color);
  background: white;
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.number-input.correct {
  border-color: var(--success-color);
  background: rgba(29, 209, 161, 0.1);
  color: var(--success-color);
}

.number-input.error {
  border-color: var(--danger-color);
  background: rgba(255, 107, 107, 0.1);
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.label {
  font-size: 1.2rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.lines {
  position: relative;
  width: 200px;
  height: 80px;
  margin: 10px 0;
}

.line {
  position: absolute;
  top: 0;
  width: 4px;
  height: 100px;
  background: #dfe6e9;
  border-radius: 2px;
  transform-origin: top center;
}

.left-line {
  left: 50%;
  transform: rotate(30deg);
}

.right-line {
  right: 50%;
  transform: rotate(-30deg);
}

.parts-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  align-items: flex-start;
}

.plus-sign {
  font-size: 3rem;
  color: #dfe6e9;
  font-weight: 900;
  margin-top: 20px;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.action-btn {
  padding: 15px 50px;
  font-size: 1.5rem;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-weight: 800;
  color: white;
  transition: all 0.3s;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.check-btn {
  background: var(--gradient-blue);
  box-shadow: 0 10px 20px rgba(84, 160, 255, 0.3);
}

.check-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(84, 160, 255, 0.4);
}

.next-btn {
  background: var(--gradient-green);
  box-shadow: 0 10px 20px rgba(29, 209, 161, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.feedback {
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 12px;
}

.feedback.success {
  color: var(--success-color);
  background: rgba(29, 209, 161, 0.1);
}

.feedback.error {
  color: var(--danger-color);
  background: rgba(255, 107, 107, 0.1);
}

.feedback.warning {
  color: var(--primary-color);
  background: rgba(255, 159, 67, 0.1);
}
</style>
