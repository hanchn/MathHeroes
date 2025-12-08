import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SettingsView from '../views/SettingsView.vue'
import GameView from '../views/GameView.vue'
import ResultView from '../views/ResultView.vue'
import MultiplicationTableView from '../views/MultiplicationTableView.vue'
import NumberLearningMenu from '../views/NumberLearningMenu.vue'
import NumberDetailView from '../views/NumberDetailView.vue'
import NumberWritingView from '../views/NumberWritingView.vue'
import PlaceValueView from '../views/PlaceValueView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/number-learning',
      name: 'number-learning',
      component: NumberLearningMenu
    },
    {
      path: '/number-learning/recognize/:range',
      name: 'number-detail',
      component: NumberDetailView
    },
    {
      path: '/number-learning/write',
      name: 'number-writing',
      component: NumberWritingView
    },
    {
      path: '/number-learning/place-value',
      name: 'place-value',
      component: PlaceValueView
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
      props: true
    },
    {
      path: '/multiplication-table',
      name: 'multiplication-table',
      component: MultiplicationTableView
    }
  ]
})

export default router
