<template>
  <div class="detail-container">
    <div class="header">
      <button class="back-btn" @click="router.back()">← 返回</button>
      <h2>认识数字: {{ rangeTitle }}</h2>
    </div>

    <div class="content-area">
      <!-- 左右切换按钮 -->
      <button class="nav-btn prev" @click="prevNumber" :disabled="currentIndex === 0">◀</button>
      
      <div class="number-display">
        <div class="number-card" @click="speakNumber">
          <span class="big-number">{{ currentNumber }}</span>
          <button class="speak-btn">🔊</button>
        </div>

        <!-- 只有 0-19 显示 Emoji 辅助 -->
        <div class="visual-aid" v-if="currentNumber <= 20 && currentNumber > 0">
          <div class="emoji-grid">
            <span v-for="n in currentNumber" :key="n" class="emoji-item">🍎</span>
          </div>
        </div>

        <!-- 大数字显示中文读法 -->
        <div class="text-aid" v-else>
          {{ numberToChinese(currentNumber) }}
        </div>
      </div>

      <button class="nav-btn next" @click="nextNumber" :disabled="currentIndex === numberList.length - 1">▶</button>
    </div>
    
    <div class="progress">
      {{ currentIndex + 1 }} / {{ numberList.length }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const range = route.params.range

const numberList = ref([])
const currentIndex = ref(0)
const currentNumber = computed(() => numberList.value[currentIndex.value])

const rangeTitle = computed(() => {
  if (range === '0-9') return '0 ~ 9'
  if (range === '10-19') return '10 ~ 19'
  if (range === '20-99') return '20 ~ 99'
  return '100 ~ 999'
})

// 初始化数字列表
const initList = () => {
  if (range === '0-9') {
    numberList.value = Array.from({ length: 10 }, (_, i) => i)
  } else if (range === '10-19') {
    numberList.value = Array.from({ length: 10 }, (_, i) => i + 10)
  } else if (range === '20-99') {
    const list = []
    for(let i=20; i<=29; i++) list.push(i)
    for(let i=30; i<=90; i+=10) list.push(i)
    for(let i=0; i<10; i++) {
      const n = Math.floor(Math.random() * 70) + 30
      if (!list.includes(n)) list.push(n)
    }
    numberList.value = list.sort((a,b) => a-b)
  } else {
    const list = [100, 200, 300, 400, 500, 600, 700, 800, 900, 999]
    for(let i=0; i<10; i++) {
      const n = Math.floor(Math.random() * 900) + 100
      if (!list.includes(n)) list.push(n)
    }
    numberList.value = list.sort((a,b) => a-b)
  }
}

const prevNumber = () => {
  if (currentIndex.value > 0) currentIndex.value--
  speakNumber()
}

const nextNumber = () => {
  if (currentIndex.value < numberList.value.length - 1) currentIndex.value++
  speakNumber()
}

const speakNumber = () => {
  const utterance = new SpeechSynthesisUtterance(currentNumber.value.toString())
  utterance.lang = 'zh-CN'
  window.speechSynthesis.speak(utterance)
}

const numberToChinese = (num) => {
  const chnNumChar = ["零","一","二","三","四","五","六","七","八","九"]
  const chnUnitSection = ["","万","亿","万亿","亿亿"]
  const chnUnitChar = ["","十","百","千"]
  
  const sectionToChinese = (section) => {
    let strIns = '', chnStr = ''
    let unitPos = 0
    let zero = true
    while(section > 0){
      let v = section % 10
      if(v === 0){
        if(!zero){
          zero = true
          chnStr = chnNumChar[v] + chnStr
        }
      }else{
        zero = false
        strIns = chnNumChar[v]
        strIns += chnUnitChar[unitPos]
        chnStr = strIns + chnStr
      }
      unitPos++
      section = Math.floor(section / 10)
    }
    return chnStr
  }

  if (num === 0) return chnNumChar[0]
  
  let unitPos = 0
  let strIns = '', chnStr = ''
  let needZero = false
  
  while(num > 0){
    let section = num % 10000
    if(needZero){
      chnStr = chnNumChar[0] + chnStr
    }
    strIns = sectionToChinese(section)
    strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0]
    chnStr = strIns + chnStr
    needZero = (section < 1000) && (section > 0)
    num = Math.floor(num / 10000)
    unitPos++
  }
  
  if (chnStr.startsWith('一十')) {
    chnStr = chnStr.substring(1)
  }
  
  return chnStr
}

onMounted(() => {
  initList()
  setTimeout(speakNumber, 500)
})

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prevNumber()
  if (e.key === 'ArrowRight') nextNumber()
})
</script>

<style scoped>
.detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
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

h2 {
  color: var(--text-main);
  margin: 0;
  flex: 1;
  text-align: center;
  font-size: 2rem;
  font-weight: 900;
  transform: translateX(-40px);
}

.content-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.nav-btn {
  width: 60px;
  height: 60px;
  border-radius: 20px;
  border: none;
  background: var(--bg-card);
  color: var(--primary-color);
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.1);
  background: var(--primary-color);
  color: white;
  box-shadow: 0 15px 30px rgba(255, 159, 67, 0.3);
}

.nav-btn:disabled {
  background: #f0f0f0;
  color: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.number-display {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
}

.number-card {
  background: var(--bg-card);
  padding: 60px;
  border-radius: 40px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 260px;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.number-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 30px 60px rgba(0,0,0,0.12);
  border-color: var(--info-color);
}

.big-number {
  font-size: 10rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--info-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  filter: drop-shadow(0 4px 0 rgba(0,0,0,0.1));
}

.speak-btn {
  margin-top: 20px;
  background: rgba(72, 219, 251, 0.1);
  border: none;
  font-size: 2rem;
  cursor: pointer;
  padding: 15px;
  border-radius: 50%;
  transition: all 0.3s;
  color: var(--info-color);
}

.speak-btn:hover {
  transform: scale(1.1);
  background: var(--info-color);
  color: white;
}

.visual-aid {
  background: rgba(255,255,255,0.6);
  padding: 30px;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.5);
}

.emoji-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  max-width: 400px;
}

.emoji-item {
  font-size: 2.5rem;
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.text-aid {
  font-size: 3rem;
  color: var(--text-secondary);
  font-weight: 900;
  background: white;
  padding: 20px 40px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.progress {
  text-align: center;
  margin-top: 30px;
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 1.1rem;
  background: rgba(255,255,255,0.5);
  padding: 8px 20px;
  border-radius: 20px;
  align-self: center;
}
</style>
