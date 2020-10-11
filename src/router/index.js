// import Vue from 'vue'
// import VueRouter from 'vue-router'
import HomeMain from '../pages/home-main'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home-main',
    component: HomeMain,
    children: [
      {
        path: '/news-list',
        component: () => import(/* webpackChunkName: "contributor" */'../pages/contributor/news-list.vue')
      },
      {
        path: '/section-list',
        component: () => import(/* webpackChunkName: "editor" */'../pages/editor/section-list.vue')
      },
      {
        path: '/section-info',
        name: 'section-info',
        component: () => import(/* webpackChunkName: "editor" */'../pages/editor/section-info.vue')
      },
      {
        path: '/preview-section',
        name: 'preview-section',
        component: () => import(/* webpackChunkName: "editor" */'../pages/editor/preview-section.vue')
      },
      {
        path: '/approval-section',
        name: 'approval-section',
        component: () => import(/* webpackChunkName: "editor" */'../pages/editor/approval-section.vue')
      },
      {
        path: '/add-manuscript',
        name: 'add-manuscript',
        component: () => import(/* webpackChunkName: "contributor" */'../pages/contributor/add-manuscript')
      },
      {
        path: '/edit-manuscript',
        name: 'edit-manuscript',
        component: () => import(/* webpackChunkName: "contributor" */'../pages/contributor/edit-manuscript')
      },
      {
        path: '/state-info',
        name: 'state-info',
        component: () => import(/* webpackChunkName: "contributor" */'../pages/contributor/state-info')
      },
      {
        path: '/doc-list',
        component: () => import(/* webpackChunkName: "approve" */'../pages/approve/doc-list')
      },
      {
        path: '/approve-state-info',
        name: 'approve-state-info',
        component: () => import(/* webpackChunkName: "approve" */'../pages/approve/approve-state-info')
      },
      {
        path: '/approve-suggestion/:id',
        name: 'approve-suggestion',
        component: () => import(/* webpackChunkName: "approve" */'../pages/approve/approve-suggestion')
      },
      {
        path: '/approve-perview-news',
        component: () => import(/* webpackChunkName: "approve" */'../pages/approve/approve-perview-news')
      },
      {
        path: '/user-list/:userType',
        component: () => import(/* webpackChunkName: "admin" */'../pages/admin/userList.vue')
      },
      {
        path: '/add-user/:userType',
        component: () => import(/* webpackChunkName: "admin" */'../pages/admin/addUser.vue')
      }
    ]
  },
  {
    path: '/person-info',
    component: () => import('../pages/person-info')
  },
  {
    path: '/improve-info',
    component: () => import('../pages/improve-info')
  },
  {
    path: '/login',
    component: () => import('../pages/login.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
