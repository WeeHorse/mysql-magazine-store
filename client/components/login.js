const LoginComponent = {
  template: `
    <div class="card-body">
      <h2>Login</h2>
      <div v-if="user.email">
        <h1>Welcome {{user.firstname}}!</h1>
        <button v-on:click="logout" :disabled="loading">Logout</button>
      </div>
      <form v-else @submit.prevent="submit">
        <label>Email
          <input type="text" v-model="email" :disabled="loading" />
        </label>
        <label>Password
          <input type="password" v-model="password" :disabled="loading" />
        </label>
        <button type="submit" :disabled="loading">Login</button>
        <br/>
        <span v-if="message">{{message}}</span>
      </form>
    </div>
  `,
  data() {
    return {
      email: '',
      password: '',
      message: '',
      loading: false,
      user: {}
    };
  },
  created(){
    http.get('/rest/login').then(response => {
      console.log('/rest/login', response);
      this.user = response.data;
    }).catch(e => {
      // not logged in
    });
  },
  methods: {
    submit() { // login
      this.loading = true;
      app.drawMenu = false;
      http.post('/rest/login', {
        email: this.email,
        password: this.password,
      }).then(response => {
        console.log('/rest/login', response);
        this.loading = false;
        app.drawMenu = true;
        if(response.data.email) {
          this.message = 'Logged in';
          this.user = response.data;
        } else {
          this.message = 'Incorrect email/password';
        }
      }).catch(error => {
        console.log('/rest/login error', error);
        this.loading = false;
        app.drawMenu = true;
        this.message = 'Already logged in';
      });
    },
    logout() {
      this.loading = true;
      app.drawMenu = false;
      http.delete('/rest/login').then(response => {
        console.log(response);
        this.loading = false;
        app.drawMenu = true;
        this.message = response.data.message;
        this.user = {};
      }).catch(error => {
        this.loading = false;
        app.drawMenu = true;
        this.message = 'Already logged out';
      });
    }
  },
  watch: {
    email() {
      this.message = '';
    },
    password() {
      this.message = '';
    }
  }
}


