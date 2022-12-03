import Vue from 'vue'
import VueRouter from 'vue-router'

import Auth from '@/layouts/Auth'
import Main from '@/layouts/Main'
import CardsList from '@/views/CardsList'
import NotFoundPage from '@/layouts/NotFoundPage'
import GiftCard from '@/layouts/GiftCard'
import GiftCardEditing from '@/views/GiftCardEditing'

const ifNotAuthenticated = (to, from, next) => {
  if (!localStorage.token) return next()
  next(`/`)
}

const ifAuthenticated = (to, from, next) => {
  if (localStorage.token) return next()
  next(`/auth`)
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
    path: '/form-gift-card/:giftCardId',
    name: 'formGiftCard',
    component: GiftCardEditing,
  },
  {
    path: '/:giftCardId',
    name: 'giftCard',
    component: GiftCard,
  },
  {
    path: '/not-found',
    name: 'notFoundPage',
    component: NotFoundPage,
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
        path: 'create-gift-card/:giftCardId',
        name: 'createGiftCard',
        component: GiftCardEditing,
        props: true
      },
      {
        path: '*',
        name: 'notFoundPage',
        component: NotFoundPage,
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
