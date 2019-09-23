const MenuComponent = {

  template: `
    <div>
      <cart class="cart" v-bind:toggleCart="toggleCart" v-if="!loading && showCart"></cart>
      <ul class="nav">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Hem</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/register">Registrera dig</router-link>
        </li>
        <li class="nav-item" v-if="!loading && anonymous">
          <router-link class="nav-link" to="/login">Logga in</router-link>
        </li>
        <li class="nav-item" v-if="!loading && user.email">
          <router-link class="nav-link" to="/logout">Logga ut</router-link>
        </li>
        <li class="nav-item" v-if="!loading && user && user.roles && user.roles.includes('admin')">
          <router-link class="nav-link" to="/admin">Admin</router-link>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Categories</a>
          <div class="dropdown-menu">
            <router-link class="dropdown-item" to="/products">All</router-link>
            <category class="dropdown-item"
              v-for="item in categories"
              v-bind:item="item"
              v-bind:key="item._id">
            </category>
          </div>
        </li>
        <li class="nav-item menu-cart" v-on:click="toggleCart">
          <i class="fas float-right fa-shopping-cart med-icon"></i>
        </li>
      </ul>
    </div>
  `,
  data() {
    return {
      loading: false,
      showCart: false,
      anonymous: true,
      user: {},
      categories:[]
    };
  },
  methods:{
    toggleCart(){
      this.showCart = !this.showCart;
    }
  },
  async created(){
    this.loading = true;

    // promise syntax
    http.get('/rest/login').then(response => {
      console.log('/rest/login', response);
      this.user = response.data;
      this.loading = false;
      if(this.user.roles && this.user.roles.includes('user')){
        this.anonymous = false;
      }
    }).catch(e => {
      this.anonymous = true;
      this.loading = false;
    });

    // async await syntax
    let categories = await http.get('/rest/categories');
    if(categories.data){
      this.categories = categories.data;
    }
  }
}