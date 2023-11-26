import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface UserBase {
  id: string
  global_name: string
  avatar: string
  isAdmin: boolean
}

export class User implements UserBase {
  id: string
  global_name: string
  avatar: string
  isAdmin: boolean
  constructor(data: UserBase){
    this.id = data.id
    this.global_name = data.global_name
    this.avatar = data.avatar
    this.isAdmin = data.isAdmin
  }
  
  public get avatar_url() : string {
    return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.webp`
  }
  
}

interface OwnedCard {
  card_name: string
  amount: number
}

export interface PlayerBase {
  discord_id: string
  balance: number
  last_daily: string
  daily_streak: number
  card_ownership: Array<OwnedCard>
}

export class Player implements PlayerBase {
  discord_id: string
  balance: number
  last_daily: string
  daily_streak: number
  card_ownership: Array<OwnedCard>
  constructor(data: PlayerBase){
    this.discord_id = data.discord_id
    this.balance = data.balance
    this.last_daily = data.last_daily
    this.daily_streak = data.daily_streak
    this.card_ownership = data.card_ownership
  }
}

export const useUserStore = defineStore('user', () => {
  const apiPath = import.meta.env.VITE_API_PATH

  const user = ref<User>()
  const player = ref<Player>()
  const adminMode = ref<boolean>(false)

  async function fetchUser(){
    const response = await fetch(`${apiPath}/me`, {
      method: 'GET',
      credentials: 'include'
    })
    if(response.ok){
      user.value = new User(await response.json())
    }
  }

  async function fetchPlayer(){
    const response = await fetch(`${apiPath}/players/${user.value?.id}`, {
      method: 'GET',
      credentials: 'include'
    })
    if(response.ok){
      player.value = new Player(await response.json())
    }
  }

  return {
    user,
    adminMode,
    player,
    fetchUser,
    fetchPlayer
  }
})
