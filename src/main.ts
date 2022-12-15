import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import './ui/tailwind.css'
import '/node_modules/bootstrap-icons/font/bootstrap-icons.css'
import { createPinia } from 'pinia';
import { apolloProviderDesmos } from './gql/ApolloDesmos'

const app = createApp({
    render: () => h(App),
});
app.use(createPinia())

app.use(router);
app.use(apolloProviderDesmos);
app.mount('#app');
