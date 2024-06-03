<script setup>
import { ref } from 'vue'
import Versions from './components/Versions.vue'
import LandingVue from './components/LandingVue.vue'
import HomeVue from './components/HomeVue.vue'
import SettingsVue from './components/SettingsVue.vue'
import TopBar from './components/TopBarComponent.vue'
const currentpage = ref('landing')

const switchToHome = () => {
  currentpage.value = 'home'
}

const switchToSettings = () => {
  currentpage.value = 'settings'
}

const searchResults = ref(null)
const userPrompt = ref('')
const onLandingSearchCompleted = (results, prompt) => {
  currentpage.value = 'home'
  searchResults.value = results
  userPrompt.value = prompt
}
</script>

<template>
  <TopBar
    v-if="currentpage !== 'landing'"
    :currentpage="currentpage"
    @switchToHome="switchToHome"
    @switchToSettings="switchToSettings"
  />
  <LandingVue v-if="currentpage === 'landing'" @search-completed="onLandingSearchCompleted" />
  <div class="content" v-if="currentpage !== 'landing'">
    <HomeVue v-if="currentpage === 'home'" :initial-results="searchResults" :prompt="userPrompt" />
    <SettingsVue v-else-if="currentpage === 'settings'" />
    <!-- <div class="creator">Smart Files Team</div>
    <Versions /> -->
  </div>
</template>

<style>
.content {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
