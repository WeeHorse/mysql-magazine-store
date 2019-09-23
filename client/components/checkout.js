const CheckoutComponent = {
  template: `
    <div class="card-body">
      <h1>{{title}}</h1>
      <table>
        <tr>
          <th>vara</th>
          <th>pris</th>
          <th>moms</th>
          <th>antal</th>
        </tr>
        <cart-item v-if="!loading"
          v-for="item in items"
          v-bind:item="item"
          v-bind:key="item._id">
        </cart-item>
      </table>
      <button v-on:click="pay" class="mt-2 btn btn-secondary btn-sm" :disabled="paying">Betala</button>
      <div class="alert alert-info" v-if="message">
        {{message}}
      </div>
    </div>
  `,
  created(){
    // ladda in litta data
    this.loading = true;
    http.get('/rest/cart').then(response => {
      console.log('items', response.data.items)
      this.items = response.data.items;
      this.loading = false;
    }).catch(e => {
      console.error(e);
      this.loading = false;
    });
  },
  data(){
    return{
      loading: false,
      paying: false,
      items: [],
      title: "Kassa",
      message: ''
    }
  },
  methods: {
    pay() {
      this.paying = true;
      http.post('/rest/pay', {}).then(response => {
        this.paying = false;
        this.message = response.data.outcome.seller_message;
      }).catch(error => {
        this.paying = false;
        this.message = 'Failed payment';
      });
    }
  }
}