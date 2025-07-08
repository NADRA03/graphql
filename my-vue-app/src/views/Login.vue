<template>
  <div class="login-wrapper">
        <h2 class="logo" >Login to your Reboot account.</h2>
    <div class="login-box">
      <h1 class="login-title">Login</h1>
      <form class="login-form" @submit.prevent="handleSubmit">
        <input v-model="username" type="text" placeholder="Username or Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogin } from './Login'
const { username, password, handleSubmit } = useLogin()

localStorage.removeItem("authToken")
</script>

<style scoped src="./login.css" />