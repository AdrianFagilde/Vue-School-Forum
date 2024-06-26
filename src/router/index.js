/* eslint-disable */
import Home from "@/pages/Home.vue";
import ThreadShow from "@/pages/ThreadShow.vue";
import NotFound from "@/pages/NotFound.vue";
import Forum from "@/pages/Forum.vue";
import Category from "@/pages/Category.vue";
import Profile from "@/pages/Profile";
import ThreadCreate from "@/pages/ThreadCreate";
import ThreadEdit from "@/pages/ThreadEdit";
import SignIn from "@/pages/SignIn.vue";
import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import Register from "@/pages/Register";
import { findById } from '@/helpers'

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/me",
    name: "Profile",
    component: Profile,
    meta: { toTop: true, smoothScroll: true , requiresAuth: true},
  },
  {
    path: "/me/edit",
    name: "ProfileEdit",
    component: Profile,
    props: { edit: true },
    meta: { requiresAuth: true}
  },
  {
    path:'/signIn',
    name:'SignIn',
    component: SignIn,
    meta: { requiresGuest: true}
  },
  {
    path:'/logout',
    name:'SignOut',
    async beforeEnter(to, from ){
      await store.dispatch('auth/signOut')
      return {name: 'Home'}
    }
  },
  {
    path:'/register',
    name:'Register',
    component: Register,
    meta: { requiresGuest: true}
  },
  {
    path: "/forum/:forumId/thread/create",
    name: "ThreadCreate",
    component: ThreadCreate,
    props: true,
    meta: { requiresAuth: true}
  },
  {
    path: "/thread/:id/edit",
    name: "ThreadEdit",
    component: ThreadEdit,
    props: true,
    meta: { requiresAuth: true}
  },
  {
    path: "/category/:id",
    name: "Category",
    component: Category,
    props: true,
  },
  {
    path: "/forum/:id",
    name: "Forum",
    component: Forum,
    props: true,
  },
  {
    path: "/thread/:id",
    name: "ThreadShow",
    component: ThreadShow,
    props: true,
    async beforeEnter(to, from, next) {
      await store.dispatch('threads/fetchThread', { id: to.params.id, once:true })
      // check if thread exists
      const threadExists = findById(store.state.threads.items, to.params.id);
      // if exists continue
      if (threadExists) {
        return next();
      } else {
        next({
          name: "NotFound",
          params: { pathMatch: to.path.substring(1).split("/") },
          // preserve existing query and hash
          query: to.query,
          hash: to.hash,
        });
      }
      // if doesnt exist redirect to not found
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router =  createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    const scroll = {};
    if (to.meta.toTop) scroll.top = 0;
    if (to.meta.smoothScroll) scroll.behavider = "smooth";

    return scroll;
  },
});

router.afterEach(() => {
  store.dispatch('clearItems', { modules: ['categories', 'forums', 'posts', 'threads'] })
})

router.beforeEach( async (to,from) => {
  await store.dispatch('auth/initAuthentication')

  store.dispatch('unsubscribeAllSnapshots')
  if( to.meta.requiresAuth && !store.state.auth.authId){
    return { name:'SignIn' , query:{ redirectTo: to.path }}
  }
  if(to.meta.requiresGuest && store.state.auth.authId){
    return { name: 'Home'}
  }
})

export default router