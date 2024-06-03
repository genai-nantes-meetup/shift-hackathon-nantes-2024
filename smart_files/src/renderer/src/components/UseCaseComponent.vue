<script setup>
defineProps({
  title: String,
  description: String
})
</script>

<template>
  <div class="flex flex-col p-2 cursor-pointer rounded-md hover:bg-secondary">
    <span class="font-bold">{{ title }}</span>
    <span class="text-muted-foreground">{{ description }}</span>
  </div>
</template>
