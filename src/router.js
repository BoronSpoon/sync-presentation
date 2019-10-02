import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Selecter from './views/Selecter.vue';
import Login from './views/Login.vue';
import Viewer from './views/Viewer.vue';
import Presenter from './views/Presenter.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/viewer/:id',
      name: 'viewer',
      component: Viewer,
    },
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/selecter',
      name: 'selecter',
      component: Selecter,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/presenter',
      name: 'presenter',
      component: Presenter,
    },
  ],
});
