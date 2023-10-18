<script setup lang="ts">
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
</script>

<template>
  <div id="sidebar" class="">
    <div id="sidebarContent">
      <div class="avatar" @click="$router.push(`/user/${userStore.user?.id}`)">
      <img v-if="userStore.user !== undefined" :src="userStore.user.avatar_url" />
      <span>{{ userStore.user?.global_name }}</span>
      <button v-if="userStore.user?.isAdmin" @click.stop="userStore.adminMode = !userStore.adminMode">{{
        userStore.adminMode ? 'Admin' : 'User' }}</button>
    </div>
    <div class="leaderboard">Weekly leaderboard</div>
    <div class="leaderboard">Global leaderboard</div>
    </div>
  </div>
</template>

<style scoped>
#sidebar {
 	text-align: left;
	margin-left: 1rem;
	font-size: 1rem;
	padding: 5rem 0;
  grid-area: sidebar;
}

#sidebarContent{
  position:sticky;
  top:1em;
}
#sidebarContent > * {
  margin-top: 1rem;
}

.leaderboard {
  background: gray;
}

.avatar,
.avatar * {
  align-items: center;
  display: flex;
  flex-direction: row;
  max-height: 40px;
  margin-left: 10px;
}

.avatar img {
  border-radius: 50%;
}

@media (max-width: 1024px) {
  #sidebar{
    position:absolute;
    width:200px;
    right:-200px;
    margin-left: 0;
    transition: right 0.2s cubic-bezier(.13,.61,.39,1.03);
    z-index: 3;
    grid-template-columns: min-content min-content;
    grid-template-areas: 
    "nav"
    "user"
    ;
  }
  #sidebar.open{
    right:0;
  }
  .leaderboard {
    display:none;
  }
}
</style>
