import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import HomeView from '../views/Home.vue'
import BadView from '../views/badRequest.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginView,   },
  { path: '/', name: 'Home', component: HomeView },
    { path: '/400', name: 'BadRequest', component: BadView },
  { path: '/:pathMatch(.*)*', redirect: '/400' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    localStorage.removeItem('authToken')
  }
  next()
})

export default router