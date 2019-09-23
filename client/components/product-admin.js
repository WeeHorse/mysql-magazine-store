const ProductAdminComponent = {
  template: `
    <div class="card-body row">
      <h2>Skapa en ny produkt</h2>
      <form @submit.prevent="submit">
        <label class="col-3">Produktnamn</label>
        <input class="col-7" type="text" v-model="name" :disabled="loading" required />
        <label class="col-3">Beskrivning</label>
        <textarea class="col-7" v-model="description" :disabled="loading" />
        <label class="col-3">Pris</label>
        <input class="col-7" type="text" v-model="price" :disabled="loading" />
        <label class="col-3">Moms</label>
        <input class="col-7" type="text" v-model="vat" :disabled="loading" />
        <label class="col-3">Artikelnummer</label>
        <input class="col-7" type="text" v-model="artnr" :disabled="loading" />
        <button class="offset-3 col-7" type="submit" :disabled="loading">Spara</button>
        <br/>
        <span class="col-10" v-if="message">{{message}}</span>
      </form>
    </div>
  `,
  data() {
    return {
      name: '',
      description: '',
      price: 0,
      vat: 0.25,
      artnr: '',
      loading: false,
      message: ''
    };
  },

  methods: {
    submit() { // create a product
      this.loading = true;
      http.post('/rest/products', {
        name: this.name,
        description: this.description,
        price: this.price,
        vat: this.vat,
        artnr: this.artnr
      }).then(response => {
        console.log(response);
        this.loading = false;
        if(response.data.artnr) {
          this.message = 'Produkten sparades';
        } else {
          this.message = 'Produkten kunde inte sparas';
        }
      }).catch(error => {
        this.loading = false;
        this.message = 'Produkten kunde inte sparas';
      });
    }
  }
}


