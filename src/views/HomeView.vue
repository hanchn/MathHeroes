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
  background: linear-gradient(45deg, #42b983, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 3px 3px 6px rgba(0,0,0,0.1);
}

.subtitle {
  font-size: 1.5rem;
  color: #666;
  margin-top: 10px;
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
  background: rgba(255, 255, 255, 0.9); /* 增加透明度 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  border-radius: 24px;
  padding: 40px 30px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.5); /* 细微边框 */
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
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
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  background: rgba(255, 255, 255, 0.95);
}

/* 各个卡片的个性化颜色 */
.number-learning { border-bottom: 6px solid #00bcd4; }
.add-sub { border-bottom: 6px solid #4caf50; }
.multiply { border-bottom: 6px solid #ff9800; }
.divide { border-bottom: 6px solid #9c27b0; }
.complex { border-bottom: 6px solid #f44336; }

.number-learning .icon { background: linear-gradient(135deg, #e0f7fa, #b2ebf2); color: #00838f; }
.add-sub .icon { background: linear-gradient(135deg, #e8f5e9, #c8e6c9); color: #2e7d32; }
.multiply .icon { background: linear-gradient(135deg, #fff3e0, #ffe0b2); color: #ef6c00; }
.divide .icon { background: linear-gradient(135deg, #f3e5f5, #e1bee7); color: #6a1b9a; }
.complex .icon { background: linear-gradient(135deg, #ffebee, #ffcdd2); color: #c62828; }

.icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.card:hover .icon {
  transform: rotate(15deg) scale(1.1);
}

h2 {
  font-size: 1.8rem;
  margin: 10px 0;
  color: #2c3e50;
}

p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.table-link {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(255, 152, 0, 0.3);
}

.table-link:hover {
  background: #f57c00;
  transform: translateY(-2px);
}
</style>
