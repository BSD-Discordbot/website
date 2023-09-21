<script setup lang="ts">

function login(){
  window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=460020057867681792&redirect_uri=http%3A%2F%2F127.0.0.1%3A5173%2Flogin&response_type=code&scope=identify'
}
</script>

<template>
  <main>
    <button @click="login">Login</button>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
