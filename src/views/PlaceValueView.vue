<template>
  <div class="pv-container">
    <div class="header">
      <button class="back-btn" @click="router.back()">← 返回</button>
      <h2>📊 认识数位</h2>
    </div>

    <div class="main-display">
      <!-- 计数器显示 -->
      <div class="counter-box">
        <div class="number-row">
          <span class="digit">{{ displayDigits.亿 || 0 }}</span>
          <span class="unit">亿</span>
        </div>
        <div class="number-row">
          <span class="digit">{{ displayDigits.万 || 0 }}</span>
          <span class="unit">万</span>
        </div>
        <div class="number-row">
          <span class="digit">{{ displayDigits.千 || 0 }}</span>
          <span class="unit">千</span>
        </div>
        <div class="number-row">
          <span class="digit">{{ displayDigits.百 || 0 }}</span>
          <span class="unit">百</span>
        </div>
        <div class="number-row">
          <span class="digit">{{ displayDigits.十 || 0 }}</span>
          <span class="unit">十</span>
        </div>
        <div class="number-row active">
          <span class="digit">{{ displayDigits.个 || 0 }}</span>
          <span class="unit">个</span>
        </div>
      </div>
      
      <div class="big-number">
        {{ currentNumber }}
      </div>
      
      <div class="chinese-read">
        读作: {{ numberToChinese(currentNumber) }}
      </div>
    </div>

    <div class="controls">
      <div class="btn-group">
        <button @click="add(1)">+1 (个)</button>
        <button @click="add(10)">+10 (十)</button>
        <button @click="add(100)">+100 (百)</button>
        <button @click="add(1000)">+1000 (千)</button>
        <button @click="add(10000)">+1万</button>
      </div>
      
      <div class="btn-group secondary">
        <button @click="currentNumber = 0">归零</button>
        <button @click="randomNum">随机数</button>
      </div>
    </div>

    <div class="explanation">
      <p>👇 试着点点上面的按钮，看看数字是怎么变化的！</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentNumber = ref(0)

const displayDigits = computed(() => {
  let n = currentNumber.value
  const digits = {}
  
  digits.个 = n % 10
  n = Math.floor(n / 10)
  
  digits.十 = n % 10
  n = Math.floor(n / 10)
  
  digits.百 = n % 10
  n = Math.floor(n / 10)
  
  digits.千 = n % 10
  n = Math.floor(n / 10)
  
  digits.万 = n % 10000 // 简化处理，万位可能有多位
  n = Math.floor(n / 10000)
  
  if (n > 0) digits.亿 = n
  
  return digits
})

const add = (val) => {
  currentNumber.value += val
}

const randomNum = () => {
  currentNumber.value = Math.floor(Math.random() * 99999)
}

// 复用转中文逻辑
const numberToChinese = (num) => {
  if (num === 0) return "零"
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
</script>

<style scoped>
.pv-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.back-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: #f0f0f0;
  cursor: pointer;
  margin-right: 20px;
}

.main-display {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.counter-box {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.number-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 10px;
  min-width: 60px;
  border: 2px solid #eee;
}

.number-row.active {
  border-color: #42b983;
  background: #e8f5e9;
}

.digit {
  font-size: 3rem;
  font-weight: bold;
  color: #2c3e50;
}

.unit {
  font-size: 1rem;
  color: #888;
  margin-top: 5px;
}

.big-number {
  font-size: 4rem;
  font-weight: bold;
  color: #42b983;
  text-align: center;
  margin: 20px 0;
}

.chinese-read {
  text-align: center;
  font-size: 1.5rem;
  color: #666;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.btn-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

button {
  padding: 15px 20px;
  border-radius: 15px;
  border: none;
  background: #42b983;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.1s;
}

button:active {
  transform: scale(0.95);
}

.secondary button {
  background: #ffc107;
  color: #333;
}

.explanation {
  text-align: center;
  margin-top: 40px;
  color: #888;
}
</style>
