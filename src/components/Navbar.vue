<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
    <nav class="navbar navbar-expand-lg bg-primary">
    <div class="container">
        <RouterLink class="navbar-brand text-white fw-bold" to="/tasks">Taskly</RouterLink>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
            <li class="nav-item">
            <RouterLink class="nav-link active" aria-current="page" to="/tasks">Home</RouterLink>
            </li>
            <li class="nav-item">
            <RouterLink class="nav-link" to="/tasks">Tasks</RouterLink>
            </li>
        </ul>
        </div>
    </div>
    </nav>
</template>

<style scoped>
    .nav-link, .nav-link.active{
        color: white;
    }
</style>