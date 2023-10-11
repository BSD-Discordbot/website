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

export const useUserStore = defineStore('user', () => {
  const apiPath = import.meta.env.VITE_API_PATH

  const user = ref<User>()
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

  return {
    user,
    adminMode,
    fetchUser
  }
})
