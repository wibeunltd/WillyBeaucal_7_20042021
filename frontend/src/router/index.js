import { createRouter, createWebHistory } from 'vue-router'
import Login from "../views/Login.vue";
import Profile from "../views/Profile.vue";
import Error404 from '../views/Error404.vue';

const routes = [
  { 
    name: 'login',
    path: '/', 
    component: Login,
    meta: {
      title: 'Authentification | Moments from Groupomania',
    }
  },
  { 
    name: 'profile',
    path: '/profile', 
    component: Profile,
    meta: {
      title: 'Mon profil | Moments from Groupomania',
    },
    props:true 
  },
  {
    path: '/:pathMatch(.*)',
    name: 'Erreur 404',
    component: Error404,
    meta: {
      title: 'Oups, cette page n\'existe pas',
    }
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach((to, from) => {
  console.log(from, to);
  document.title = to.meta.title;
});

export default router
