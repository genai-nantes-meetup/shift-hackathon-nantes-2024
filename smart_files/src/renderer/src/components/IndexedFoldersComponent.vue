<script setup>
import { ref } from 'vue'
import Button from '../components/ui/button/Button.vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { FolderIcon } from '@heroicons/vue/24/outline'
import { Loader2 } from 'lucide-vue-next'

const folderPaths = ref(
  new Set(
    localStorage.getItem('folderPaths') ? JSON.parse(localStorage.getItem('folderPaths')) : []
  )
)

const changed = ref(false)
const populating = ref(false)

function triggerFileInput() {
  window.api.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] }, (results) => {
    for (const result of results) {
      changed.value = true
      folderPaths.value.add(result)
    }
  })
}

function populateDatabase() {
  console.log('Populating database')
  populating.value = true
  window.api.populateDatabase(Array.from(folderPaths.value), {
    onProgress: (progress) => {
      console.log('Progress', progress)
    },
    onFinish: (result) => {
      populating.value = false
      console.log('Finished', result)
      if ('success' in result) {
        localStorage.setItem('folderPaths', JSON.stringify(Array.from(folderPaths.value)))
        changed.value = false
      }
    }
  })
}

function removeFolder(path) {
  folderPaths.value.delete(path)
}
</script>

<template>
  <div class="flex flex-col">
    <div class="w-full flex flex-col justify-between items-center my-8 gap-4">
      <img class="w-15" src="../assets/folder.svg" alt="Logo" />
      <p v-if="folderPaths.size === 0" class="font-bold">Ajouter vos premiers dossiers</p>
      <Button v-if="folderPaths.size === 0" variant="secondary" @click="triggerFileInput">Séléctioner</Button>
      <ul v-if="folderPaths.size" class="flex flex-col gap-2">
        <li class="flex items-center gap-2" v-for="(path, index) in folderPaths" :key="index">
          <FolderIcon class="h-5 w-5" />&nbsp;&nbsp;{{ path }}
          <Button variant="ghost" size="xs" @click="removeFolder(path)">
            <XMarkIcon class="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </div>
    <div class="w-full flex flex-row gap-2 justify-end">
      <Button variant="ghost">Fermer</Button>
      <Button v-if="folderPaths.size !== 0" variant="secondary" @click="triggerFileInput">Séléctioner</Button>
      <Button :disabled="!changed || folderPaths.size === 0" variant="default" @click="populateDatabase()">
        <Loader2 v-if="populating" class="w-4 h-4 mr-2 animate-spin" />
        Appliquer
      </Button>
    </div>
  </div>
</template>
