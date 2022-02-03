import { createApp, h } from 'vue'
import App from './App.vue'
import store from '@/store/'
import router from './router'
import './ui/tailwind.css'
import '/node_modules/bootstrap-icons/font/bootstrap-icons.css'
import { apolloProvider } from './gql/Apollo'

const app = createApp({
    render: () => h(App),
});

app.use(store);
app.use(router);
app.use(apolloProvider);
app.mount('#app');
