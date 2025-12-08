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
  max-width: 1200px;
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

.back-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 rgba(0,0,0,0.05);
}

h1 {
  color: var(--primary-color);
  margin: 0;
  flex: 1;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 900;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.05);
  transform: translateX(-40px);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* 增加最小宽度防止挤压 */
  gap: 30px;
}

.card {
  position: relative;
  background: var(--bg-card);
  border-radius: 24px;
  padding: 40px 30px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  border-color: var(--primary-color);
}

/* 装饰背景圆优化 */
.card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, var(--primary-color) 0%, transparent 70%);
  opacity: 0.1;
  pointer-events: none;
  transition: opacity 0.3s;
}

.card:hover::before {
  opacity: 0.2;
}

.icon {
  width: 90px;
  height: 90px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin-bottom: 20px;
  transition: transform 0.3s;
}

/* 使用半透明背景色代替渐变，更清爽 */
.icon-green { background: rgba(29, 209, 161, 0.15); color: var(--success-color); }
.icon-blue { background: rgba(72, 219, 251, 0.15); color: var(--info-color); }
.icon-orange { background: rgba(255, 159, 67, 0.15); color: var(--primary-color); }
.icon-purple { background: rgba(156, 39, 176, 0.15); color: #9c27b0; }
.icon-red { background: rgba(255, 107, 107, 0.15); color: var(--danger-color); }
.icon-teal { background: rgba(0, 150, 136, 0.15); color: #009688; }

.card:hover .icon {
  transform: rotate(15deg) scale(1.1);
}

h3 {
  margin: 10px 0;
  font-size: 1.5rem;
  color: var(--text-main);
  font-weight: 800;
}

p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
  text-align: center; /* 确保文字居中 */
  line-height: 1.4;
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
