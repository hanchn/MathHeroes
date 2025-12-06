<template>
  <div class="emoji-group" :style="{ opacity: isHidden ? 0 : 1 }">
    <span v-for="n in count" :key="n" class="emoji">{{ emoji }}</span>
  </div>
</template>

<script setup>
defineProps({
  count: Number,
  emoji: String,
  isHidden: Boolean
})
</script>

<style scoped>
.emoji-group {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  min-height: 40px;
  transition: opacity 0.3s;
  justify-content: center;
}

.emoji {
  font-size: 1.5rem;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
