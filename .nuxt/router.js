import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _0aea4672 = () => import('../src/pages/NavBar.vue' /* webpackChunkName: "pages/NavBar" */).then(m => m.default || m)
const _30947d4a = () => import('../src/pages/TermsandConditions.vue' /* webpackChunkName: "pages/TermsandConditions" */).then(m => m.default || m)
const _6a5d4766 = () => import('../src/pages/Products.vue' /* webpackChunkName: "pages/Products" */).then(m => m.default || m)
const _22283992 = () => import('../src/pages/ClientOrders.vue' /* webpackChunkName: "pages/ClientOrders" */).then(m => m.default || m)
const _da3c2d3c = () => import('../src/pages/AdminFeedback.vue' /* webpackChunkName: "pages/AdminFeedback" */).then(m => m.default || m)
const _450007ae = () => import('../src/pages/OurRates.vue' /* webpackChunkName: "pages/OurRates" */).then(m => m.default || m)
const _0f71d5bc = () => import('../src/pages/Order.vue' /* webpackChunkName: "pages/Order" */).then(m => m.default || m)
const _7f628f52 = () => import('../src/pages/Login.vue' /* webpackChunkName: "pages/Login" */).then(m => m.default || m)
const _74092df2 = () => import('../src/pages/Feedback.vue' /* webpackChunkName: "pages/Feedback" */).then(m => m.default || m)
const _26457a61 = () => import('../src/pages/Home.vue' /* webpackChunkName: "pages/Home" */).then(m => m.default || m)
const _d43b80cc = () => import('../src/pages/Signup.vue' /* webpackChunkName: "pages/Signup" */).then(m => m.default || m)
const _cc794322 = () => import('../src/pages/CardSlide.vue' /* webpackChunkName: "pages/CardSlide" */).then(m => m.default || m)
const _03f83f59 = () => import('../src/pages/Emails.vue' /* webpackChunkName: "pages/Emails" */).then(m => m.default || m)



if (process.client) {
  window.history.scrollRestoration = 'manual'
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected
  if (to.matched.length < 2) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise(resolve => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,
    routes: [
		{
			path: "/NavBar",
			component: _0aea4672,
			name: "NavBar"
		},
		{
			path: "/TermsandConditions",
			component: _30947d4a,
			name: "TermsandConditions"
		},
		{
			path: "/Products",
			component: _6a5d4766,
			name: "Products"
		},
		{
			path: "/ClientOrders",
			component: _22283992,
			name: "ClientOrders"
		},
		{
			path: "/AdminFeedback",
			component: _da3c2d3c,
			name: "AdminFeedback"
		},
		{
			path: "/OurRates",
			component: _450007ae,
			name: "OurRates"
		},
		{
			path: "/Order",
			component: _0f71d5bc,
			name: "Order"
		},
		{
			path: "/Login",
			component: _7f628f52,
			name: "Login"
		},
		{
			path: "/Feedback",
			component: _74092df2,
			name: "Feedback"
		},
		{
			path: "/Home",
			component: _26457a61,
			name: "Home"
		},
		{
			path: "/Signup",
			component: _d43b80cc,
			name: "Signup"
		},
		{
			path: "/CardSlide",
			component: _cc794322,
			name: "CardSlide"
		},
		{
			path: "/Emails",
			component: _03f83f59,
			name: "Emails"
		}
    ],
    
    
    fallback: false
  })
}
