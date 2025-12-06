<template>
  <div class="table-container">
    <div class="header no-print">
      <button class="back-btn" @click="router.back()">← 返回</button>
      <button class="print-btn" @click="printTable">🖨️ 打印乘法表</button>
    </div>

    <div class="multiplication-content">
      <h1 class="title">✨ 九九乘法表 ✨</h1>
      
      <div class="table-grid">
        <div v-for="i in 9" :key="i" class="row" :class="`row-${i}`">
          <div v-for="j in i" :key="j" class="cell">
            <span class="formula">{{ j }} × {{ i }} =</span>
            <span class="result">{{ i * j }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const printTable = () => {
  window.print()
}
</script>

<style scoped>
.table-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  color: #2c3e50;
  font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

button {
  padding: 12px 25px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.back-btn {
  background: white;
  color: #333;
  border: 2px solid #eee;
}

.print-btn {
  background: #42b983;
  color: white;
}

.title {
  text-align: center;
  margin-bottom: 50px;
  font-size: 3rem;
  color: #42b983;
  text-shadow: 2px 2px 0px rgba(66, 185, 131, 0.2);
}

.table-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
  margin-left: auto;
  margin-right: auto;
  width: 100%; /* 确保宽度不超出 */
  max-width: 100%;
  overflow-x: auto; /* 允许横向滚动 */
  padding-bottom: 20px; /* 滚动条留白 */
}

.row {
  display: flex;
  gap: 15px;
  padding: 10px;
  border-radius: 15px;
  transition: transform 0.2s;
  min-width: max-content; /* 确保内容不换行，保持阶梯状 */
}

.row:hover {
  transform: scale(1.02);
  background: rgba(255,255,255,0.5);
}

.cell {
  background: white;
  padding: 12px 15px;
  border-radius: 12px;
  width: 110px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1);
  font-weight: bold;
  font-size: 1.1rem;
  border: 2px solid transparent;
}

.result {
  font-weight: 900;
  color: #e74c3c;
  font-size: 1.2rem;
}

/* 每一行的配色 */
.row-1 .cell { border-color: #ffadad; background: #fff0f0; }
.row-2 .cell { border-color: #ffd6a5; background: #fff5e6; }
.row-3 .cell { border-color: #fdffb6; background: #ffffed; }
.row-4 .cell { border-color: #caffbf; background: #f0fff4; }
.row-5 .cell { border-color: #9bf6ff; background: #e0fbff; }
.row-6 .cell { border-color: #a0c4ff; background: #e6f0ff; }
.row-7 .cell { border-color: #bdb2ff; background: #f2f0ff; }
.row-8 .cell { border-color: #ffc6ff; background: #ffe6ff; }
.row-9 .cell { border-color: #fffffc; background: #fff; border: 2px solid #ddd; }

@media print {
  .no-print {
    display: none;
  }
  .table-container {
    padding: 20px;
    margin: 0;
    background: white;
  }
  .title {
    margin: 20px 0;
    font-size: 2rem;
    color: black;
    text-shadow: none;
  }
  .table-grid {
    gap: 10px;
    align-items: flex-start;
  }
  .row {
    padding: 0;
    gap: 10px;
  }
  .cell {
    border: 1px solid #000 !important;
    background: white !important;
    box-shadow: none;
    width: 90px;
    padding: 5px;
    font-size: 10pt;
  }
  .result {
    color: black;
  }
  /* 强制横向打印优化 */
  @page {
    size: landscape;
  }
}

@media (max-width: 768px) {
  .table-container {
    padding: 20px 10px;
  }
  
  .title {
    font-size: 2rem;
    margin-bottom: 30px;
  }

  .table-grid {
    align-items: flex-start; /* 移动端保持左对齐阶梯状，通过滚动查看 */
  }

  .row {
    gap: 8px;
    padding: 5px;
  }
  
  .cell {
    width: auto;
    min-width: 90px;
    padding: 8px 10px;
    font-size: 0.9rem;
    flex-direction: column; /* 竖向排列更省空间 */
    justify-content: center;
    gap: 2px;
    text-align: center;
  }
  
  .result {
    font-size: 1rem;
  }
}
</style>
