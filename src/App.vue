<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import { useCardStore } from '@/stores/cards'

const store = useCardStore()
store.fetchCards()
store.fetchTags()
// store.fetchUpgrades()
store.fetchEvents()

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
