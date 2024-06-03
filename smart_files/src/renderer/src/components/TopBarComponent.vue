<script setup>
import { defineProps, defineEmits } from 'vue'
import { ArrowLeftIcon, FolderOpenIcon } from '@heroicons/vue/24/outline'
import Button from '../components/ui/button/Button.vue'

const props = defineProps({
  currentpage: String
})

const emits = defineEmits(['switchToHome', 'switchToSettings'])
</script>

<template>
  <div class="navbar">
    <div class="spacer"></div>
    <Button variant="secondary" v-if="currentpage === 'home'" @click="$emit('switchToSettings')">
      <FolderOpenIcon class="h-5 w-5" />
    </Button>
    <Button variant="secondary" v-else @click="$emit('switchToHome')">
      <ArrowLeftIcon class="h-5 w-5" />
    </Button>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 20px;
  background-color: #fff;
}

.input {
  margin-left: 50px;
  margin-right: 20px;
}
</style>
