const ProductComponent = {

  props: ['item'],

  template: `
    <div class="product card-body">
      <div class="image">
        <img class="card-img-top img-fluid" :src="'images/' + item.image"/>
      </div>
      <p class="product-cart">
        <i v-on:click="addToCart" :title="'Lägg ' + item.name + ' i varukorgen'" class="fas large-icon float-right fa-cart-arrow-down"></i>
        <span v-html="'<b>' + item.name + '</b>' + ' – ' + item.description + ' <em>' + item.price + 'kr</em>'"></span>
      </p>
    </div>
  `,

  data() {
    return {
      id: '',
      message: '',
      loading: false,
    };
  },
  methods: {
    addToCart() { // register
      this.loading = true;
      http.post('/rest/cart', {
        product: this.item.id,
        amount: 1
      }).then(response => {
        console.log(response);
        this.loading = false;
        if(response.data.affectedRows == 1) {
          this.message = 'Lade till i varukorgen';
        } else {
          this.message = 'Error 1';
        }
      }).catch(error => {
        this.loading = false;
        this.message = 'Error 2';
      });
    }
  },

}
