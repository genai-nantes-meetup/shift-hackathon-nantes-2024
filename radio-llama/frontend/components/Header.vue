<template>
    <header class="flex items-center justify-between w-full p-10">
        <div class="flex flex-row items-center gap-2 cursor-pointer"  @click="$router.push({ name: 'index' })">
            <img src="/logo.png" alt="" width="56" height="56">
            <span class="text-2xl"> 
                RADIOLLAMA
            </span>
        </div>
        <div class="flex ml-auto mr-10 gap-4">
            <i class="pi pi-facebook cursor-pointer" style="font-size: 2rem"></i>
            <i class="pi pi-twitter cursor-pointer" style="font-size: 2rem"></i>
            <i class="pi pi-linkedin cursor-pointer" style="font-size: 2rem"></i>
        </div>
        <div class="flex">
            <Button v-if="visible" label="LOG IN" rounded severity="help" @click="$router.push('/login')"/>
        </div>
    </header>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
const router = useRouter();
const visible = router.currentRoute.value.name !== 'login';
</script>