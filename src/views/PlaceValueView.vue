<template>
  <div class="pv-container">
    <div class="header">
      <button class="back-btn" @click="router.back()">← 返回</button>
      <h1>📊 认识数位</h1>
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
        <button class="control-btn" @click="add(1)">+1 (个)</button>
        <button class="control-btn" @click="add(10)">+10 (十)</button>
        <button class="control-btn" @click="add(100)">+100 (百)</button>
        <button class="control-btn" @click="add(1000)">+1000 (千)</button>
        <button class="control-btn" @click="add(10000)">+1万</button>
      </div>
      
      <div class="btn-group secondary">
        <button class="action-btn warning" @click="currentNumber = 0">归零</button>
        <button class="action-btn success" @click="randomNum">随机数</button>
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
  padding: 40px 20px;
  min-height: 100vh;
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

h1 {
  color: var(--text-main);
  margin: 0;
  flex: 1;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 900;
  transform: translateX(-40px);
}

.main-display {
  background: var(--bg-card);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.counter-box {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.number-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 16px;
  min-width: 70px;
  border: 2px solid #eee;
  transition: all 0.3s;
}

.number-row:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.number-row.active {
  border-color: var(--info-color);
  background: rgba(72, 219, 251, 0.1);
}

.digit {
  font-size: 3rem;
  font-weight: 900;
  color: var(--text-main);
}

.unit {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-top: 5px;
  font-weight: 600;
}

.big-number {
  font-size: 5rem;
  font-weight: 900;
  background: linear-gradient(45deg, var(--info-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin: 20px 0;
  text-shadow: 3px 3px 6px rgba(0,0,0,0.1);
}

.chinese-read {
  text-align: center;
  font-size: 1.8rem;
  color: var(--text-secondary);
  font-weight: 600;
  background: #f1f2f6;
  padding: 10px 20px;
  border-radius: 12px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.btn-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

.control-btn {
  padding: 15px 25px;
  border-radius: 16px;
  border: none;
  background: white;
  color: var(--text-main);
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 0 rgba(0,0,0,0.05);
  border: 1px solid #eee;
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 rgba(0,0,0,0.05);
  border-color: var(--info-color);
  color: var(--info-color);
}

.control-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 rgba(0,0,0,0.05);
}

.action-btn {
  padding: 15px 40px;
  border-radius: 20px;
  border: none;
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.action-btn.warning {
  background: var(--gradient-orange);
  box-shadow: 0 10px 20px rgba(255, 159, 67, 0.3);
}

.action-btn.success {
  background: var(--gradient-green);
  box-shadow: 0 10px 20px rgba(29, 209, 161, 0.3);
}

.action-btn:hover {
  transform: translateY(-3px);
  filter: brightness(1.1);
}

.explanation {
  text-align: center;
  margin-top: 40px;
  color: var(--text-secondary);
  font-size: 1.1rem;
}
</style>
