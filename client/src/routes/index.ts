import AdminLayout from '@/layouts/AdminLayout.vue'
import WorkerLayout from '@/layouts/WorkerLayout.vue'
import DashboardView from '@/views/admin/DashboardView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import WorkerView from '@/views/worker/WorkerView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',           //PADRE
      name: 'login',
      component: LoginView,
    },


    {
      path: '/admin',
      component: AdminLayout,
      meta: {requiresAuth: true, role: 'ADMIN'},

      children: [

      {
        path: '',
        name: 'admin',
        component: DashboardView,

      },


      {
        path: 'HerramientasView',
        name: 'herramientas',
        component: () => import('@/views/admin/HerramientasView.vue'),
      },


      {
        path: 'seguimientoview',
        name: 'seguimiento',
        component: () => import('@/views/admin/SeguimientoView.vue'),
        
      }

    
      ]
    },





      {
      path: '/worker',
      component: WorkerLayout,
      meta: { requiresAuth: true, role: 'WORKER' },

      children: [

        {
          path: '',
          name: 'worker',
          component: WorkerView
        }

      ]
    }

  ]

    

  });


//GUARDADO GLOBAL 



router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (to.meta.requiresAuth && !token) {
    return next('/')
  }


  if (to.meta.role && user.role !== to.meta.role) {
    return next('/')
  }

  next()
})










export default router
