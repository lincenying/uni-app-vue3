import { createSSRApp } from 'vue'

import { createPinia } from 'pinia'

import App from './App.vue'

export function createApp() {
    const app = createSSRApp(App)
    const store = createPinia()
    app.use(store)
    return {
        app,
    }
}
