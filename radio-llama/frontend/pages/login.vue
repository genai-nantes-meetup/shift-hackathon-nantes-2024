<template>
    <div class="grid grid-cols-12 gap-4 p-10">
        <div class="flex flex-col col-start-2 col-span-10 gap-10">
            <div class="flex flex-col items-start gap-8 justify-between w-full p-10 bg-black bg-opacity-75 rounded-lg">
                <div class="flex flex-col gap-4">
                    <h1 class="text-2xl font-bold">Upload your Spotify playlist</h1>
                    <small>Start by uploading your playlist, we will take care of the rest</small>
                </div>

                <form class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label for="text">Playlist</label>
                        <InputText id="text" type="text" v-model="value" rounded />
                    </div>

                    <div class="flex justify-end">
                        <Button label="Upload" rounded severity="help" @click="$router.push('/create')"/>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
const value = ref('');

</script>