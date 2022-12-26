import Vue from 'vue'
import VueRouter from 'vue-router'

import Auth from '@/layouts/Auth'
import Main from '@/layouts/Main'
import CardsList from '@/views/CardsList'
import NotFoundPage from '@/layouts/NotFoundPage'
import Success from '@/layouts/Success'
import GiftCard from '@/layouts/GiftCard'
import GiftCardEditing from '@/views/GiftCardEditing'

const ifNotAuthenticated = (to, from, next) => {
  if (!localStorage.token) return next()
  next('/cards-list')
}

const ifAuthenticated = (to, from, next) => {
  if (localStorage.token) return next()
  next(`/form-gift-card`)
}

Vue.use(VueRouter)
const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: Auth,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/form-gift-card',
    name: 'formGiftCard',
    component: GiftCardEditing,
    beforeEnter: ifNotAuthenticated,
    props: true
  },
  {
    path: '/gift-card/:giftCardId',
    name: 'giftCard',
    component: GiftCard,
    props: true
  },
  {
    path: '/',
    name: 'home',
    component: Main,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: 'cards-list',
        name: 'cardsList',
        component: CardsList,
        props: true
      }, {
        path: 'create-gift-card',
        name: 'createGiftCard',
        component: GiftCardEditing,
        props: true
      }, {
        path: 'gift-card-editing/:giftCardId',
        name: 'editGiftCard',
        component: GiftCardEditing,
        props: true
      }
      // {
      //   path: '*',
      //   name: 'notFoundPage',
      //   component: NotFoundPage,
      // },
    ]
  },
  {
    path: '/success',
    name: 'success',
    component: Success,
    props: true
  }
  // {
  //   path: '/not-found',
  //   name: 'notFoundPage',
  //   component: NotFoundPage,
  // },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
