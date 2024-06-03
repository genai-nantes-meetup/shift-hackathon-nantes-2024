<script setup>
import { defineProps, defineEmits } from 'vue'
import Prompt from './Prompt.vue'

const emits = defineEmits(['switchToHome', 'switchToSettings', 'searchCompleted'])

const onSearchCompleted = (response) => {
  emits('searchCompleted', response)
}

defineProps({
  prompt: String
})
</script>

<template>
  <div class="navbar">
    <div class="spacer"></div>
    <Prompt :prompt="prompt" @search-completed="onSearchCompleted" />
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  margin-bottom: 10px;
}

.logo {
  height: 40px;
}

/* .input {
  margin-left: 50px;
  margin-right: 20px;
} */
</style>
