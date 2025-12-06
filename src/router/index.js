import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SettingsView from '../views/SettingsView.vue'
import GameView from '../views/GameView.vue'
import ResultView from '../views/ResultView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/settings/:type', // type: add_sub, multiply, divide
      name: 'settings',
      component: SettingsView
    },
    {
      path: '/game',
      name: 'game',
      component: GameView,
      props: route => ({ query: route.query })
    },
    {
      path: '/result',
      name: 'result',
      component: ResultView,
      props: true // 允许通过 params 传递结果数据
    }
  ]
})

export default router
