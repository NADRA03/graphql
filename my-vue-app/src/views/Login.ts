import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api/auth'
import { showToast } from './toast.ts'
import "./login.css"; 

export function useLogin() {
  const username = ref('')
  const password = ref('')
  const router = useRouter()

  async function handleSubmit() {
    try {
      const token = await login(username.value, password.value)
      localStorage.setItem('authToken', JSON.stringify(token))
      router.push('/')
    } catch (err: any) {
      showToast(err?.message ?? 'Login failed.')
    }
  }

  return {
    username,
    password,
    handleSubmit
  }
}