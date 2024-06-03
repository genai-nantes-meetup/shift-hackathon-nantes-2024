<script setup>
import Button from '../components/ui/button/Button.vue'
import SearchResults from './SearchResultsComponent.vue'
import NavBar from './NavBarComponent.vue'
import { ref } from 'vue'

const props = defineProps({
  initialResults: Array,
  prompt: String
})

const files = ref(props.initialResults)

const onSearchCompleted = (response) => {
  files.value = response
}
</script>

<template>
  <NavBar :prompt="prompt" @search-completed="onSearchCompleted" />
  <!-- <Button variant="secondary">Copier</Button> -->
  <SearchResults :files="files" />
</template>

<style></style>
