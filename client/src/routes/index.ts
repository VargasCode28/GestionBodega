import AdminLayout from '@/layouts/AdminLayout.vue'
import DashboardView from '@/views/admin/DashboardView.vue'
import LoginView from '@/views/auth/LoginView.vue'
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

      children: [

        {
        path: '',
        name: 'admin',
        component: DashboardView,

        }
      ]
    }

  



  
  ],
})

export default router
