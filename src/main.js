import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import vuetify from '@/plugins/vuetify';
import router from './router';
import store from './store';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(VueClipboard);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
