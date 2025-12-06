<template>
  <div class="settings">
    <button class="back-btn" @click="router.back()">← 返回</button>
    
    <h1>⚙️ 游戏设置</h1>
    
    <div class="setting-section">
      <h3>选择难度（数字范围）</h3>
      <div class="options-grid">
        <button 
          v-for="range in ranges" 
          :key="range.value"
          :class="{ active: selectedRange === range.value }"
          @click="selectedRange = range.value"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <div class="setting-section">
      <h3>题目数量</h3>
      <div class="options-row">
        <button 
          v-for="count in [10, 20, 30, 50]"
          :key="count"
          :class="{ active: questionCount === count }"
          @click="questionCount = count"
        >
          {{ count }} 题
        </button>
      </div>
    </div>

    <div class="setting-section">
      <h3>选择模式</h3>
      <div class="options-row">
        <button 
          :class="{ active: mode === 'normal' }"
          @click="mode = 'normal'"
        >
          🎨 图形模式 (Emoji)
        </button>
        <button 
          :class="{ active: mode === 'mental' }"
          @click="mode = 'mental'"
        >
          🧠 心算模式
        </button>
      </div>
    </div>

    <button class="start-btn" @click="startGame">开始挑战 🚀</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 只有加减法才需要选择范围，乘法以后再说
const type = route.params.type

const ranges = [
  { label: '5以内', value: 5 },
  { label: '10以内', value: 10 },
  { label: '15以内', value: 15 },
  { label: '20以内', value: 20 },
  { label: '30以内', value: 30 },
  { label: '50以内', value: 50 },
  { label: '100以内', value: 100 },
  { label: '1000以内', value: 1000 },
  { label: '随机范围', value: 'random' },
]

const selectedRange = ref(10)
const questionCount = ref(10)
const mode = ref('normal') // normal, mental

const startGame = () => {
  router.push({
    name: 'game',
    query: {
      type,
      range: selectedRange.value,
      count: questionCount.value,
      mode: mode.value
    }
  })
}
</script>

<style scoped>
.settings {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: left;
}

.back-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 20px;
  color: #666;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
}

.setting-section {
  margin-bottom: 40px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
}

@media (prefers-color-scheme: dark) {
  .setting-section {
    background: #2c3e50;
  }
  .back-btn {
    color: #aaa;
  }
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.options-row {
  display: flex;
  gap: 20px;
}

button {
  padding: 10px 20px;
  border: 2px solid #ddd;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

button.active {
  border-color: #42b983;
  background-color: #42b983;
  color: white;
}

.start-btn {
  display: block;
  width: 100%;
  padding: 20px;
  font-size: 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 15px;
  margin-top: 40px;
}

.start-btn:hover {
  background-color: #3aa876;
  transform: scale(1.02);
}
</style>
