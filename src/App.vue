<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import { useCardStore } from '@/stores/cards'
import {useUserStore} from '@/stores/user'

const store = useCardStore()
store.fetchCards()
store.fetchTags()
// store.fetchUpgrades()
store.fetchEvents()

const userStore = useUserStore()
userStore.fetchUser()

function login(){
  window.location.href = "https://discord.com/api/oauth2/authorize?client_id=460020057867681792&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Flogin&response_type=code&scope=identify"
}
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="25" height="25" />

    <div class="wrapper">
      <nav>
        <RouterLink to="/cards">Cards</RouterLink>
        <RouterLink to="/tags">Tags</RouterLink>
        <RouterLink to="/events">Events</RouterLink>
        <RouterLink to="/upgrades">Upgrades</RouterLink>
      </nav>
    </div>
    <button v-if="userStore.user === undefined" @click="login">login</button>
    <div class="avatar">
      <img v-if="userStore.user !== undefined" :src="userStore.user.avatar_url"/>
      <span>{{ userStore.user?.global_name }}</span>
    </div>
    
  </header>

  <RouterView />
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.avatar, .avatar *{
  align-items: center;
  display:flex;
  flex-direction: row;
  max-height: 40px;
  margin-left: 10px;
}

.avatar img{
  border-radius: 50%;
}
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
    width:100%;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
