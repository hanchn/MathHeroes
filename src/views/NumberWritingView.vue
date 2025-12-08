<template>
  <div class="writing-container">
    <div class="header">
      <button class="back-btn" @click="router.back()">← 返回</button>
      <h2>✍️ 学写数字: {{ currentNumber }}</h2>
    </div>

    <div class="canvas-area">
      <!-- 左右切换 -->
      <button class="nav-btn prev" @click="prevNumber" :disabled="currentNumber === 0">◀</button>

      <div class="canvas-wrapper">
        <!-- 背景字模 -->
        <div class="template-number">{{ currentNumber }}</div>
        
        <!-- 绘图画布 -->
        <canvas 
          ref="canvasRef"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          @touchstart="startDrawing"
          @touchmove="draw"
          @touchend="stopDrawing"
        ></canvas>
      </div>

      <button class="nav-btn next" @click="nextNumber" :disabled="currentNumber === 9">▶</button>
    </div>

    <div class="controls">
      <button class="action-btn clear" @click="clearCanvas">🗑️ 清空重写</button>
      <!-- 这里未来可以加“笔顺动画”按钮 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentNumber = ref(0)
const canvasRef = ref(null)
let ctx = null
let isDrawing = false
let lastX = 0
let lastY = 0

const initCanvas = () => {
  const canvas = canvasRef.value
  const wrapper = canvas.parentElement
  canvas.width = wrapper.clientWidth
  canvas.height = wrapper.clientHeight
  
  ctx = canvas.getContext('2d')
  ctx.strokeStyle = '#2c3e50' // 笔迹颜色
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.lineWidth = 20 // 笔迹粗细
}

const getPos = (e) => {
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  let clientX, clientY
  
  if (e.touches) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else {
    clientX = e.clientX
    clientY = e.clientY
  }
  
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  }
}

const startDrawing = (e) => {
  isDrawing = true
  const { x, y } = getPos(e)
  lastX = x
  lastY = y
  // 画一个点
  draw(e)
}

const draw = (e) => {
  if (!isDrawing) return
  e.preventDefault() // 防止触摸滚动
  
  const { x, y } = getPos(e)
  
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(x, y)
  ctx.stroke()
  
  lastX = x
  lastY = y
}

const stopDrawing = () => {
  isDrawing = false
}

const clearCanvas = () => {
  const canvas = canvasRef.value
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const prevNumber = () => {
  if (currentNumber.value > 0) {
    currentNumber.value--
    clearCanvas()
  }
}

const nextNumber = () => {
  if (currentNumber.value < 9) {
    currentNumber.value++
    clearCanvas()
  }
}

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', initCanvas)
})

watch(currentNumber, () => {
  nextTick(clearCanvas)
})
</script>

<style scoped>
.writing-container {
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

.canvas-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
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
}

.nav-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.canvas-wrapper {
  width: 400px;
  height: 400px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
  border: 4px dashed #ddd; /* 田字格效果可以用css画，这里先简单虚线框 */
}

/* 田字格辅助线 */
.canvas-wrapper::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background: #eee;
}
.canvas-wrapper::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  width: 1px;
  height: 100%;
  background: #eee;
}

.template-number {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 300px;
  font-family: 'Courier New', Courier, monospace; /* 找个像一点的字体 */
  color: #f0f0f0;
  pointer-events: none;
  z-index: 1;
  user-select: none;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  cursor: crosshair;
}

.controls {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.action-btn {
  padding: 15px 30px;
  border-radius: 30px;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  background: #ffc107;
  color: #333;
}
</style>
