import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'

import Aura from '@primeuix/themes/aura'; 

import './assets/main.css'
import router from './router/index'
import { createPinia } from 'pinia'
import i18n from './i18n'
import ToastService from 'primevue/toastservice';
import ConfirmService from 'primevue/confirmationservice'; 



const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.use(PrimeVue, {
  theme: {
    preset: Aura, 
    options: {
      darkModeSelector: '.dark', 
      cssLayer: true 
    }
  }
})

app.use(i18n)
app.use(ToastService); 
app.use(ConfirmService);

app.mount('#app')