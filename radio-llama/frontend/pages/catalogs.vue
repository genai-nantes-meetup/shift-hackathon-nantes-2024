<template>
    <div class="mb-20">
      <div class="grid grid-cols-12">
        <div class="flex flex-col col-span-10 col-start-2 gap-5">
          <!-- New Radio Creation Progress Bar -->
          <div v-if="creatingRadio" class="flex flex-col items-start gap-8 justify-between w-full p-10 bg-card rounded-lg">
            <div class="flex flex-col md:flex-row items-center gap-10">
              <div class="relative w-full">
                <p class="text-2xl font-bold">Creating New Radio...</p>
                <div class="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    class="bg-blue-500 h-4 rounded-full" 
                    :style="{ width: creationProgress + '%' }"
                  ></div>
                </div>
                <p>{{ creationProgress.toFixed(2) }}%</p>
              </div>
            </div>
          </div>
  
          <!-- Existing Radios -->
          <div 
            v-for="(radio, index) in radios" 
            :key="index" 
            class="flex flex-col items-start gap-8 justify-between w-full p-10 bg-card rounded-lg"
            @click="selectRadio(radio)"
          >
            <div class="flex flex-col md:flex-row items-center gap-10">
              <div class="relative">
                <img 
                  v-if="radio.thumbnail"
                  :src="radio.thumbnail" 
                  alt="Radio Thumbnail" 
                  class="rounded-full" 
                  :class="{rotating: selectedRadio && selectedRadio.title === radio.title && playing}" 
                  width="100" 
                  height="100"
                />
                <div v-else class="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  <span>Loading...</span>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <h1 class="text-2xl font-bold">{{ radio.title || 'New Radio' }}</h1>
                <p class="text-sm">{{ radio.artist || 'Loading artist...' }}</p>
                <div class="flex items-center gap-4">
                  <Button 
                    v-if="radio.audioPath"
                    :label="(selectedRadio?.title === radio.title && playing) ? 'Pause' : 'Play'"
                    :icon="(selectedRadio?.title === radio.title && playing) ? 'pi pi-pause' : 'pi pi-play'"
                    @click.stop="playPauseRadio(radio)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import Button from 'primevue/button';
  
  interface Radio {
    title: string;
    artist: string;
    thumbnail: string;
    audioPath: string;
  }

  const radios = ref<Radio[]>([
    {
      title: 'Radio Pop & Rock',
      artist: 'Amine Saboni',
      thumbnail: new URL('~/assets/img/radiollama.jpg', import.meta.url).href,
      audioPath: new URL('~/assets/audio/pop&rock.mp3', import.meta.url).href
    },
  ]);
  
  const selectedRadio = ref<Radio | null>(null);
  const playing = ref(false);
  const creatingRadio = ref(false);
  const creationProgress = ref(0);
  let audio: HTMLAudioElement | null = null;
  
  const playPauseRadio = (radio: Radio) => {
    if (selectedRadio.value?.title === radio.title && playing.value) {
      // Pause the current playing radio
      audio?.pause();
      playing.value = false;
    } else {
      // Play the selected radio
      if (audio) {
        audio.pause();
      }
      audio = new Audio(radio.audioPath);
      audio.play();
      selectedRadio.value = radio;
      playing.value = true;
  
      // Handle audio end event
      audio.onended = () => {
        playing.value = false;
        audio = null;
      };
    }
  };
  
  const selectRadio = (radio: Radio) => {
    if (selectedRadio.value?.title !== radio.title) {
      selectedRadio.value = radio;
      playing.value = false;
      if (audio) {
        audio.pause();
        audio = null;
      }
    }
  };
  
  const createNewRadio = () => {
    creatingRadio.value = true;
    creationProgress.value = 0;
  
    const creationInterval = setInterval(() => {
      creationProgress.value += (100 / 90); // 100% over 1 minute 30
      if (creationProgress.value >= 100) {
        clearInterval(creationInterval);
        creatingRadio.value = false;
        // Once creation is complete, fill the new radio details
        radios.value.push({
          title: 'Radio Jazz & Classical',
          artist: 'Amine Saboni',
          thumbnail: new URL('~/assets/img/radiollama.jpg', import.meta.url).href,
          audioPath: new URL('~/assets/audio/jazz&class.mp3', import.meta.url).href
        });
      }
    }, 1000 ); // Update every second
  };
  
  onMounted(async () => {
    try {
        const response = await fetch('https://your-api-base-url.com/path/to/your/api/radios');
        if (response.ok) {
            radios.value = await response.json();
            radios.value.forEach(radio => {
                radio.thumbnail = new URL('~/assets/img/radiollama.jpg', import.meta.url).href;
            });
        }
    } catch (error) {
        console.error('Error fetching radios:', error);
    }
    createNewRadio();
  });
  </script>
  
  <style>
  .rotating {
    animation: rotate 10s linear infinite;
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  </style>
  