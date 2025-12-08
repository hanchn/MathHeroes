<template>
  <div class="home">
    <div class="title-section">
      <h1>🚀 数学小英雄</h1>
      <p class="subtitle">开启你的趣味数学冒险之旅！</p>
    </div>
    
    <div class="menu">
      <div class="card number-learning" @click="selectMode('number-learning')">
        <div class="card-bg"></div>
        <div class="icon">🎓</div>
        <h2>认识数字</h2>
        <p>从 0 到 1000，探索数字奥秘</p>
      </div>

      <div class="card number-composition" @click="selectMode('number-composition')">
        <div class="card-bg"></div>
        <div class="icon">🧩</div>
        <h2>数字组合</h2>
        <p>探索数字的组成与拆解</p>
      </div>

      <div class="card add-sub" @click="selectMode('add_sub')">
        <div class="card-bg"></div>
        <div class="icon">➕➖</div>
        <h2>加减法挑战</h2>
        <p>练习加法和减法运算</p>
      </div>
      
      <div class="card multiply" @click="selectMode('multiply')">
        <div class="card-bg"></div>
        <div class="icon">✖️</div>
        <h2>乘法大师</h2>
        <p>九九乘法表与进阶乘法</p>
        <button class="table-link" @click.stop="router.push({ name: 'multiplication-table' })">
          📅 乘法表
        </button>
      </div>
      
      <div class="card divide" @click="selectMode('divide')">
        <div class="card-bg"></div>
        <div class="icon">➗</div>
        <h2>除法探险</h2>
        <p>挑战除法运算</p>
      </div>

      <div class="card complex" @click="selectMode('complex')">
        <div class="card-bg"></div>
        <div class="icon">🧮</div>
        <h2>复杂运算</h2>
        <p>加减乘除混合挑战</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const selectMode = (type) => {
  if (type === 'number-learning') {
    router.push({ name: 'number-learning' })
  } else if (type === 'number-composition') {
    router.push({ name: 'number-composition' })
  } else {
    router.push({ name: 'settings', params: { type } })
  }
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
}

.title-section {
  margin-bottom: 60px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

h1 {
  font-size: 4rem;
  margin: 0;
  /* 使用新的渐变色 */
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 3px 3px 6px rgba(0,0,0,0.1);
  font-weight: 900;
}

.subtitle {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-top: 10px;
  font-weight: 600;
}

.menu {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  width: 100%;
  max-width: 1200px;
}

.card {
  position: relative;
  background: var(--bg-card);
  border-radius: 24px;
  padding: 40px 30px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  background-size: cover;
  background-position: center;
  z-index: 0;
  transition: opacity 0.3s;
}

.card:hover .card-bg {
  opacity: 0.2;
}

.card > * {
  position: relative; /* 确保内容在背景之上 */
  z-index: 1;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  border-color: var(--primary-color);
}

/* 卡片底部条改用伪元素实现更柔和的效果 */
.card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: #ddd;
  transition: height 0.3s;
}

.card:hover::after {
  height: 8px;
}

/* 移除之前的 border-bottom，改用伪元素背景色 */
.number-learning::after { background: var(--info-color); }
.number-composition::after { background: #e056fd; }
.add-sub::after { background: var(--success-color); }
.multiply::after { background: var(--primary-color); }
.divide::after { background: #9c27b0; }
.complex::after { background: var(--danger-color); }

.number-learning { border-bottom: none; }
.number-composition { border-bottom: none; }
.add-sub { border-bottom: none; }
.multiply { border-bottom: none; }
.divide { border-bottom: none; }
.complex { border-bottom: none; }

/* 图标渐变优化 */
.number-learning .icon { background: rgba(72, 219, 251, 0.15); color: var(--info-color); }
.number-composition .icon { background: rgba(224, 86, 253, 0.15); color: #e056fd; }
.add-sub .icon { background: rgba(29, 209, 161, 0.15); color: var(--success-color); }
.multiply .icon { background: rgba(255, 159, 67, 0.15); color: var(--primary-color); }
.divide .icon { background: rgba(156, 39, 176, 0.15); color: #9c27b0; }
.complex .icon { background: rgba(255, 107, 107, 0.15); color: var(--danger-color); }

.icon {
  width: 90px;
  height: 90px;
  border-radius: 24px; /* 方圆形图标更现代 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.card:hover .icon {
  transform: rotate(15deg) scale(1.1);
}

h2 {
  font-size: 1.8rem;
  margin: 10px 0;
  color: var(--text-main);
  font-weight: 800;
}

p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-weight: 500;
}

.table-link {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 10px rgba(255, 159, 67, 0.3);
}

.table-link:hover {
  background: #f39c12;
  transform: translateY(-2px);
}
</style>
