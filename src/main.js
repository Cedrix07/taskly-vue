import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle';
import './assets/main.css'
import 'primeicons/primeicons.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(Toast); 
app.provide('bootstrap', bootstrap)
app.mount('#app')
