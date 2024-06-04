<template>
    <div>    
      <div class="grid grid-cols-12 gap-4 p-10">
        <div class="flex flex-col col-start-2 col-span-10 gap-10">
          <CardIntro></CardIntro>

          <div class="flex justify-end">
            <Button label="BUILD MY OWN" rounded severity="help" @click="$router.push('/create')"/>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
    import CardIntro from '~/components/CardIntro.vue';
    import Button from 'primevue/button';
  </script>
  
  <style>
  @import url("~/assets/css/base.css");
  </style>