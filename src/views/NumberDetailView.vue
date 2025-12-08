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
            <span v-for="n in currentNumber" :key="n">🍎</span>
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
    // 随机取一些，还是全部？全部太多了，取间隔或者随机20个
    // 为了学习，我们可以按 20, 21...30, 40, 50... 这样展示典型数字
    const list = []
    // 20-29
    for(let i=20; i<=29; i++) list.push(i)
    // 整十
    for(let i=30; i<=90; i+=10) list.push(i)
    // 随机几个 30-99 的非整十
    for(let i=0; i<10; i++) {
      const n = Math.floor(Math.random() * 70) + 30
      if (!list.includes(n)) list.push(n)
    }
    numberList.value = list.sort((a,b) => a-b)
  } else {
    // 100-999
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

// 简单的数字转中文 (仅用于辅助显示)
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
  
  // 处理“一十”开头读作“十”的习惯
  if (chnStr.startsWith('一十')) {
    chnStr = chnStr.substring(1)
  }
  
  return chnStr
}

onMounted(() => {
  initList()
  // 自动朗读第一个
  setTimeout(speakNumber, 500)
})

// 监听键盘左右键
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prevNumber()
  if (e.key === 'ArrowRight') nextNumber()
})
</script>

<style scoped>
.detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.back-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: #f0f0f0;
  cursor: pointer;
  margin-right: 20px;
}

.content-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.nav-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: #42b983;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.number-display {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
}

.number-card {
  background: white;
  padding: 40px;
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
  min-width: 200px;
}

.number-card:active {
  transform: scale(0.95);
}

.big-number {
  font-size: 8rem;
  font-weight: bold;
  color: #2c3e50;
  line-height: 1;
}

.speak-btn {
  margin-top: 10px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0.5;
}

.visual-aid {
  background: rgba(255,255,255,0.5);
  padding: 20px;
  border-radius: 15px;
}

.emoji-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  max-width: 300px;
}

.emoji-grid span {
  font-size: 2rem;
}

.text-aid {
  font-size: 2rem;
  color: #666;
  font-weight: bold;
}

.progress {
  text-align: center;
  margin-top: 20px;
  color: #999;
}
</style>
