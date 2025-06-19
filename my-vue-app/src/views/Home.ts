import { ref, reactive, onMounted, computed, watch } from 'vue'
import { fetchUserData } from '../api/QLQueries'
import type { UserData } from '../api/QLQueries'
import { showToast } from './toast'
import { useRouter } from 'vue-router'


export function useHome() {
const router = useRouter()
const data = reactive<UserData>({
  id: 0,
  firstName: '',
  lastName: '',
  login: '',
  email: '',
  level: 0,
  auditRatio: 0,
  xp: 0,
  passCount: 0,
  failCount: 0,
  totalUp: 0,
  totalDown: 0,
  dateOfBirth: '',
  skills: [],
  projects: []
})

  const pass = computed(() => data.passCount ?? 0)
  const fail = computed(() => data.failCount ?? 0)
  const total = computed(() => pass.value + fail.value)
  const dashOffset = computed(() =>
    total.value > 0 ? 502 - (pass.value / total.value) * 502 : 502
  )

  const animatedXp = ref(0)
  watch(() => data.xp, xp => {
    if (xp == null) return 
    
    const duration = 1000, fps = 60
    const steps = Math.floor((duration / 1000) * fps)
    let current = 0
    const inc = xp / steps
    const timer = setInterval(() => {
      current += inc
      animatedXp.value = current >= xp ? xp : Math.floor(current)
      if (current >= xp) clearInterval(timer)
    }, duration / steps)
  })

  const skillMax = computed(() => Math.max(...data.skills.map(s => s.amount || 0), 1))
  const skillBarWidth = (amount: number) => (amount / skillMax.value) * 500

  const projMax = computed(() => Math.max(...data.projects.map(p => p.amount || 0), 1))
  const projX = (i: number) => (i / (data.projects.length - 1)) * 580 + 10
  const projY = (amount: number) => 290 - (amount / projMax.value) * 250
  const projectPoints = computed(() =>
    data.projects.map((p, i) => `${projX(i)},${projY(p.amount)}`).join(' ')
  )

  onMounted(async () => {
    const token = JSON.parse(localStorage.getItem('authToken') || 'null')
    if (!token) {
    console.warn("Unauthorized: No token found")
    localStorage.setItem("errorCode", "401")
    router.push("/login")
    return
    }
    const res = await fetchUserData(token)
    if ('error' in res) showToast(res.error)
    else Object.assign(data, res)
  })

  return {
    data,
    pass, fail, total, dashOffset,
    animatedXp,
    skillBarWidth,
    projX, projY, projectPoints
  }
}




export function handleLogout() {
  const router = useRouter()

  return () => {
    localStorage.removeItem("authToken")
    router.push("/login")
  }
}