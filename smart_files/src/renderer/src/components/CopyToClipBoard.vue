<script setup>
import { ref } from 'vue'

const mypath = ''
const filePath = ref(mypath)

// const copyToClipboard = () => {
//   window.api.copyFileToClipboard(filePath.value)
// }
</script>

<template>
  <!-- <button @click="copyToClipboard">Copy File</button> -->

  <p>{{ filePath }}</p>
</template>
