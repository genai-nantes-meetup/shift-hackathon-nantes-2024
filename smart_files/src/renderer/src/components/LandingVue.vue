<script setup>
import Prompt from './Prompt.vue'
import UseCase from './UseCaseComponent.vue'
import { ref } from 'vue'

const emit = defineEmits(['searchCompleted', 'selectUseCase'])

const onSearchCompleted = (response, userPrompt) => {
  emit('searchCompleted', response, userPrompt)
}

const searchValue = ref('')

const useCases = [
  {
    title: 'Événements à Nantes',
    description: 'Je recherche un événement culturel à Nantes',
    userPrompt: 'Trouver des événements à Nantes'
  },
  {
    title: 'Code example',
    description: 'Déployer une application web avec Docker',
    userPrompt: 'Déployer une application web avec Docker'
  },
  {
    title: 'Postuler au Stereolux',
    description: 'À qui envoyer un CV pour postuler au stereolux ?',
    userPrompt: 'À qui envoyer un CV pour postuler au stereolux ?'
  }
]
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="flex flex-col mx-auto gap-2 w-2/3">
      <div class="flex justify-center">
        <img src="../assets/smtitle.png" width="200" alt="Title Image" />
      </div>
      <div class="flex flex-row flex-nowrap justify-between w-full">
        <Prompt :prompt="searchValue" :autofocus="true" @search-completed="onSearchCompleted" />
      </div>
      <div class="rounded-md border p-4">
        <p class="font-bold my-2">Suggestions</p>
        <hr class="my-4" />
        <div class="flex flex-col gap-2">
          <UseCase
            v-for="useCase in useCases"
            @click="searchValue = useCase.userPrompt"
            :key="useCase.title"
            :title="useCase.title"
            :description="useCase.description"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
