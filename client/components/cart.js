const CartComponent = {
  template: `
    <div>
      <div class="cart-background"></div>
      <div class="cart card-body">
        <table>
          <cart-item v-if="!loading"
            v-for="item in items"
            v-bind:item="item"
            v-bind:key="item._id">
          </cart-item>
        </table>
        <button v-on:click="toggleCart" class="mt-2 btn btn-secondary btn-sm">Fortsätt handla</button>
        <router-link class="mt-2 float-right btn btn-secondary btn-sm" to="/checkout">Gå till kassan</router-link>
      </div>
    </div>
  `,
  created(){
    // ladda in litta data
    this.loading = true;
    http.get('/rest/cart').then(response => {
      if(!response.data.items){
        response.data.items = [];
      }
      console.log('items', response.data)
      this.items = response.data;
      this.loading = false;
    }).catch(e => {
      console.error(e);
      this.loading = false;
    });
  },
  props: ['toggleCart'],
  data(){
    return{
      loading: false,
      items: [],
      title: "Varukorg"
    }
  }
}