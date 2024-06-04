<template>
  <div class="flex items-center justify-center md:justify-start w-full p-10 bg-black bg-opacity-75 rounded-lg">
    <div class="flex flex-col md:flex-row items-center gap-10">
      <div class="relative">
        <div class="absolute z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black rounded-full"></div>
        <img src="~/assets/img/radiollama.jpg" alt="RadioLlama" class="rounded-full" :class="{rotating : playing}" width="200" height="200"/>
      </div>
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl font-bold">RadioLlama</h1>
        <p class="text-sm">by Amine Saboni</p>
        <div class="flex items-center gap-4">
          <Button 
            :icon="playing ? 'pi pi-pause' : 'pi pi-play'" 
            :label="playing ? 'PAUSE' : 'TRY IT OUT'" rounded  
            @click="launchAudioTest"/>
        </div>
      </div>
    </div>  
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';

const playing = ref(false);
let audio: HTMLAudioElement | null = null;

// Get the path to the audio file
const audioPath = new URL('~/assets/audio/test-2.wav', import.meta.url).href;

const launchAudioTest = () => {
  if (playing.value) {
    // Stop the audio
    audio?.pause();
    audio = null;
    playing.value = false;
  } else {
    // Play the audio
    audio = new Audio(audioPath);
    audio.play();
    playing.value = true;

    // Reset playing state when audio ends
    audio.onended = () => {
      playing.value = false;
      audio = null;
    };
  }
};
</script>

<style>
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.rotating {
  animation: rotate 10s linear infinite;
}
</style>