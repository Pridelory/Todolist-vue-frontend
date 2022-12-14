import Vue from 'vue';
import Router from 'vue-router';

import TodoListPage from '../home/TodoListPage'
import LoginPage from '../login/LoginPage'
import RegisterPage from '../register/RegisterPage'

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', component: TodoListPage },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },

    // otherwise redirect to home
    { path: '*', redirect: '/' }
  ]
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');
  // console.log(loggedIn)
  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
})