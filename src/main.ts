import { createApp, h } from 'vue'
import App from './App.vue'
import store from '@/store/'
import router from './router'
import './ui/tailwind.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { apolloProviderDesmos } from './gql/ApolloDesmos'

const app = createApp({
    render: () => h(App),
});

app.use(store);
app.use(router);
app.use(apolloProviderDesmos);
app.mount('#app');
