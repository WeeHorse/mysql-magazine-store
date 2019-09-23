const ProductPageComponent = {

  template: `
    <div class="row">
      <hello class="col-12"></hello>
      <div class="col-12">
        <input class="form-control" type="search" v-model="searchString" placeholder="Skriv för att söka">
      </div>
      <!-- here be items -->
      <product class="col-12 col-sm-6 col-md-4"
            v-for="item in categoryFilteredProducts"
            v-bind:item="item"
            v-bind:key="item.id">
      </product>
    </div>
  `,
  created(){
    // ladda in litta data
    http.get('/rest/products/').then(response => {
      console.log('products', response.data)
      this.products = response.data;
    }).catch(e => {
      console.error(e);
    });
  },
  data(){
    return {
      products: [],
      searchString: ''
    }
  },
  computed:{
    filteredProducts: function(){
      let f = [];
      for(let product of this.products){
        if(product.name.toLowerCase().includes(this.searchString.toLowerCase()) || (product.description && product.description.toLowerCase().includes(this.searchString.toLowerCase()))){
          f.push(product);
        }
      }
      return f;
    },
    // filtering filtered products with incomming category
    categoryFilteredProducts: function(){
      return this.filteredProducts.filter((product)=>{
        if(!this.$route.params.category){
          return true; // if no category selected, do not filter
        }
        for(let category of product.categories){
          if(category.name == this.$route.params.category){
            return true; // found matching category
          }
        }
      });
    }
  }
}