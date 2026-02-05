//import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// --- IMPORTA BOOTSTRAP AQUÍ ---
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// --



import App from './App.vue'
import router from './routes'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
