
const routes = [
  {
    path: '/login',
    component: () => import('pages/Login.vue')
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/task/Index.vue') },
      { path: '/task-category', component: () => import('pages/task/Category.vue') },
      { path: '/sheet', component: () => import('pages/sheet/Index.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
