<script setup>
import { Input } from './ui/input'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { Button } from './ui/button'
import { ref, watch } from 'vue'
import { Loader2 } from 'lucide-vue-next'

const emit = defineEmits(['searchCompleted'])

const props = defineProps({
  prompt: String,
  autofocus: { type: Boolean, required: false, default: false }
})

const searchValue = ref(props.prompt)
const searching = ref(false)

watch(
  () => props.prompt,
  (newValue) => {
    searchValue.value = newValue
  }
)

const performSearch = () => {
  if (searching.value || !searchValue.value) return

  searching.value = true
  window.api.runSearchPrompt(searchValue.value, (response) => {
    searching.value = false
    emit('searchCompleted', response, searchValue.value)
  })
}
</script>

<template>
  <Input
    v-model="searchValue"
    @keyup.enter="performSearch"
    type="text"
    placeholder="Saisissez votre recherche"
    class="mr-2"
    :autofocus="autofocus"
  />
  <Button :disabled="searching || !searchValue" @click="performSearch" variant="secondary">
    <Loader2 v-if="searching" class="w-4 h-4 mr-2 animate-spin" />
    <MagnifyingGlassIcon v-if="!searching" class="h-5 w-5 mr-1" /> Recherche
  </Button>
</template>

<style scoped></style>
