<template>
  <div class="settings-container">
    <div class="header">
      <button class="back-btn" @click="router.back()">← 返回</button>
      <h1>⚙️ 游戏设置</h1>
    </div>
    
    <div class="settings-card">
      <div class="setting-section">
        <h3>📊 难度选择（数字范围）</h3>
        <div class="options-grid">
          <button 
            v-for="range in ranges" 
            :key="range.value"
            class="option-btn"
            :class="{ active: selectedRange === range.value }"
            @click="selectedRange = range.value"
          >
            {{ range.label }}
          </button>
        </div>
      </div>

      <div class="setting-section">
        <h3>🔢 题目数量</h3>
        <div class="options-row">
          <button 
            v-for="count in [3, 5, 10, 20, 30, 50]"
            :key="count"
            class="option-btn"
            :class="{ active: questionCount === count }"
            @click="questionCount = count"
          >
            {{ count }} 题
          </button>
        </div>
      </div>

      <div class="setting-section">
        <h3>🎮 模式选择</h3>
        <div class="options-row">
          <button 
            class="option-btn mode-btn"
            :class="{ active: mode === 'normal' }"
            @click="mode = 'normal'"
          >
            <span class="btn-icon">🎨</span>
            图形模式 (Emoji)
          </button>
          <button 
            class="option-btn mode-btn"
            :class="{ active: mode === 'mental' }"
            @click="mode = 'mental'"
          >
            <span class="btn-icon">🧠</span>
            心算模式
          </button>
        </div>
      </div>

      <button class="start-btn" @click="startGame">
        开始挑战 🚀
      </button>
    </div>
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
.settings-container {
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

.settings-card {
  background: var(--bg-card);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.02);
}

.setting-section {
  margin-bottom: 40px;
}

.setting-section:last-child {
  margin-bottom: 0;
}

h3 {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
}

.options-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.option-btn {
  padding: 12px 20px;
  border: 2px solid #eee;
  background: #f8f9fa;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  color: var(--text-main);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.option-btn:hover {
  transform: translateY(-2px);
  border-color: var(--secondary-color);
  background: white;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.option-btn.active {
  border-color: var(--success-color);
  background: rgba(29, 209, 161, 0.1);
  color: var(--success-color);
  font-weight: 800;
  box-shadow: 0 0 0 3px rgba(29, 209, 161, 0.2);
}

.mode-btn {
  padding: 15px 30px;
  font-size: 1.1rem;
}

.btn-icon {
  font-size: 1.4rem;
}

.start-btn {
  display: block;
  width: 100%;
  padding: 20px;
  font-size: 1.5rem;
  font-weight: 900;
  background: var(--gradient-orange);
  color: white;
  border: none;
  border-radius: 20px;
  margin-top: 40px;
  box-shadow: 0 10px 20px rgba(255, 159, 67, 0.3);
  transition: all 0.3s;
}

.start-btn:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 15px 30px rgba(255, 159, 67, 0.4);
}

.start-btn:active {
  transform: translateY(2px);
}

@media (max-width: 600px) {
  .settings-card {
    padding: 20px;
  }
  
  .option-btn {
    padding: 10px 15px;
    font-size: 0.9rem;
  }
}
</style>
