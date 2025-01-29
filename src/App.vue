<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <Navbar />
  <main class="container my-5">
    <RouterView />
  </main>
 
</template>

<style scoped>
  main{
    min-height: 100vh;
  }
</style>
