// page components (whole views)
Vue.component('home-page', HomePageComponent);
Vue.component('product-page', ProductPageComponent);
Vue.component('registration-page', RegistrationPageComponent);
Vue.component('checkout-page', CheckoutPageComponent);

// "normal" components (partials)
Vue.component('nav-menu', MenuComponent);
Vue.component('product', ProductComponent);
Vue.component('hello', HelloComponent);
Vue.component('registration', RegistrationComponent);
Vue.component('login', LoginComponent);
Vue.component('logout', LogoutComponent);
Vue.component('cart-item', CartItemComponent);
Vue.component('cart', CartComponent);
Vue.component('checkout', CheckoutComponent);
Vue.component('product-admin', ProductAdminComponent);
Vue.component('category', CategoryComponent);

const http = axios; // using axios 3rd party XHR/REST lib

// Configure the router:
// about the VueRouter: https://www.liquidlight.co.uk/blog/article/building-a-vue-v2-js-app-using-vue-router/
const router = new VueRouter({
  mode: 'history', // html5 popstate, alternatively: 'hash'
  base: '/', // set the correct base
  routes: [ // our frontend routes
    { path: '/', component: ProductPageComponent },
    { path: '/products/:category?', component: ProductPageComponent },
    { path: '/register', component: RegistrationPageComponent },
    { path: '/login', component: LoginPageComponent},
    { path: '/logout', component: LogoutComponent},
    { path: '/checkout', component: CheckoutPageComponent},
    { path: '/admin', component: AdminPageComponent}
  ]
});

// the app
let app = new Vue({
  el: "#app",
  router, // add the router to the app
  data(){
    return{
      drawMenu: true,
      drawMain: true,
      drawCart: true
    }
  }
});
