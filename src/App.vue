<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Sidebar from './components/PlayerSidebar.vue';

import { useCardStore } from '@/stores/cards'
import { useUserStore } from '@/stores/user'

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
    <img alt="BSD Logo" class="logo" src="@/assets/logo.svg" />
      <nav class="wrapper">
        <RouterLink to="/">Accueil</RouterLink>
        <RouterLink to="/cards">Liste des Cartes</RouterLink>
        <RouterLink to="/upgrades">Upgrades</RouterLink>
        <RouterLink to="/events">Evènements</RouterLink>
        <RouterLink v-if="userStore.adminMode" to="/tags">Tags</RouterLink>
        <RouterLink to="/about">A propos</RouterLink>
        <button v-if="userStore.user === undefined" @click="login">login</button>
      </nav>
    
  </header>

  <RouterView />
  <Sidebar />
  <footer>Footer</footer>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  margin-top: 1rem;
}

.logo {
  display: block;
  height: 5em;
  margin: 0 auto 2rem;
}


nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
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
    place-items: center;
    /* padding-right: calc(var(--section-gap) / 2); */
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header, .wrapper {
    display: flex;
    flex-wrap: wrap;
    width:100%;
    grid-area: header;
    align-content: flex-start;
    justify-content: space-evenly;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    align-items: stretch;
    padding-top: 1rem;
    /* margin-top: 1rem; */
  }
  nav a {
    flex:1;
  }
}
</style>