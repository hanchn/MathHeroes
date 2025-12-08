<template>
  <div class="menu-container">
    <div class="header">
      <button class="back-btn" @click="router.back()">← 返回</button>
      <h1>🎓 认识数字</h1>
    </div>

    <div class="menu-grid">
      <div class="card" @click="navigateTo('recognize', '0-9')">
        <div class="icon icon-green">0️⃣ ~ 9️⃣</div>
        <h3>认识 0 ~ 9</h3>
        <p>基础数字认知</p>
      </div>

      <div class="card" @click="navigateTo('write')">
        <div class="icon icon-blue">✍️</div>
        <h3>学写 0 ~ 9</h3>
        <p>数字书写练习</p>
      </div>

      <div class="card" @click="navigateTo('recognize', '10-19')">
        <div class="icon icon-orange">🔟 ~ 1️⃣9️⃣</div>
        <h3>认识 10 ~ 19</h3>
        <p>进阶数字认知</p>
      </div>

      <div class="card" @click="navigateTo('recognize', '20-99')">
        <div class="icon icon-purple">🔢</div>
        <h3>认识 20 ~ 99</h3>
        <p>两位数认知</p>
      </div>

      <div class="card" @click="navigateTo('recognize', '100-999')">
        <div class="icon icon-red">💯</div>
        <h3>认识 100 ~ 999</h3>
        <p>三位数认知</p>
      </div>

      <div class="card" @click="navigateTo('place-value')">
        <div class="icon icon-teal">📊</div>
        <h3>认识数位</h3>
        <p>个、十、百、千、万</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (mode, range) => {
  if (mode === 'recognize') {
    router.push({ name: 'number-detail', params: { range } })
  } else if (mode === 'write') {
    router.push({ name: 'number-writing' })
  } else if (mode === 'place-value') {
    router.push({ name: 'place-value' })
  }
}
</script>

<style scoped>
.menu-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 50px;
  position: relative;
}

.back-btn {
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: white;
  font-size: 1rem;
  font-weight: bold;
  margin-right: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
}

h1 {
  color: #42b983;
  margin: 0;
  flex: 1;
  text-align: center;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(66, 185, 131, 0.2);
  transform: translateX(-40px);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.card {
  background: white;
  border-radius: 24px;
  padding: 30px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.icon-green { background: #e8f5e9; color: #4caf50; }
.icon-blue { background: #e3f2fd; color: #2196f3; }
.icon-orange { background: #fff3e0; color: #ff9800; }
.icon-purple { background: #f3e5f5; color: #9c27b0; }
.icon-red { background: #ffebee; color: #f44336; }
.icon-teal { background: #e0f2f1; color: #009688; }

.card:hover .icon {
  transform: rotate(15deg) scale(1.1);
}

h3 {
  margin: 10px 0;
  font-size: 1.6rem;
  color: #2c3e50;
}

p {
  margin: 0;
  color: #95a5a6;
  font-size: 1rem;
}

@media (prefers-color-scheme: dark) {
  .card {
    background: #2c3e50;
    color: #ecf0f1;
  }
  .back-btn {
    background: #333;
    color: white;
  }
}
</style>
