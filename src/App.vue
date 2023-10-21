<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Sidebar from './components/SidebarComponent.vue';

import { useCardStore } from '@/stores/cards'
import { useUserStore } from '@/stores/user'

const store = useCardStore()
store.fetchCards()
store.fetchTags()
// store.fetchUpgrades()
store.fetchEvents()

const userStore = useUserStore()
userStore.fetchUser()
</script>

<template>
  <header>
    <img alt="BSD Logo" class="logo" src="@/assets/logo.svg" />
      <nav class="wrapper">
        <RouterLink to="/">Accueil</RouterLink>
        <RouterLink to="/cards">Liste des Cartes</RouterLink>
        <RouterLink to="/upgrades">Upgrades</RouterLink>
        <RouterLink to="/events">Evènements</RouterLink>
        <RouterLink to="/ranking">Classement</RouterLink>
        <RouterLink v-if="userStore.adminMode" to="/tags">Tags</RouterLink>
        <RouterLink to="/about">A propos</RouterLink>
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
  grid-area: nav;
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

footer {
  display: none;
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
  footer {
    display: inline;
  }
}
@media (max-width: 1024px){
  header{ 
    display: none;
  }
}
</style>