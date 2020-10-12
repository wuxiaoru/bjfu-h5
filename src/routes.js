// export default {
//   '/': 'HOME',
//   '/about': 'About'
// }


// import Vue from 'vue'
// import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../src/pages/login.vue')
  },
  {
    path: '/approve',
    component: () => import('../src/pages/approve/doc-list.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
