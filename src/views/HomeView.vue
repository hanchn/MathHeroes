<template>
  <div class="home">
    <h1>➕➖ 儿童趣味算术 ✖️➗</h1>
    <div class="menu">
      <div class="card add-sub" @click="selectMode('add_sub')">
        <div class="icon">➕➖</div>
        <h2>加减法挑战</h2>
        <p>练习加法和减法运算</p>
      </div>
      
      <div class="card multiply" @click="selectMode('multiply')">
        <div class="icon">✖️</div>
        <h2>乘法大师</h2>
        <p>99乘法表与进阶乘法</p>
        <button class="table-link" @click.stop="router.push({ name: 'multiplication-table' })">
          📅 乘法表
        </button>
      </div>
      
      <div class="card divide" @click="selectMode('divide')">
        <div class="icon">➗</div>
        <h2>除法探险</h2>
        <p>除法练习</p>
      </div>

      <div class="card complex" @click="selectMode('complex')">
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
  router.push({ name: 'settings', params: { type } })
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
}

h1 {
  margin-bottom: 40px;
  color: #42b983;
}

.menu {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 900px;
}

.card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 30px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid #e9ecef;
  color: #2c3e50;
  position: relative; /* 允许绝对定位 */
}

@media (prefers-color-scheme: dark) {
  .card {
    background: #2c3e50;
    border-color: #34495e;
    color: #ecf0f1;
  }
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  border-color: #42b983;
}

.icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

h2 {
  margin: 10px 0;
}

p {
  opacity: 0.8;
}

.table-link {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 0.8rem;
  cursor: pointer;
  z-index: 10;
}

.table-link:hover {
  background: #3aa876;
}
</style>
