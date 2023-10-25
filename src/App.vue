<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <h1>tehcn.dev</h1>

    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
h1 {
  color: white;
  font-size: 2.5em;
}

header {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  grid-template-rows: 1fr;

  border-bottom-color: black;
  border-bottom-width: 2px;
}

header nav {
  display: flex;
}

header nav a {}
</style>
