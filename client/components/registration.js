const RegistrationComponent = {
  template: `
    <div class="card-body">
      <h2>Registrera dig</h2>
      <form @submit.prevent="submit">
        <label>First name
          <input type="text" v-model="firstname" :disabled="loading" />
        </label>
        <label>Last name
          <input type="text" v-model="lastname" :disabled="loading" />
        </label>
        <label>Email
          <input type="text" v-model="email" :disabled="loading" />
        </label>
        <label>Password
          <input type="password" v-model="password" :disabled="loading" />
        </label>
        <button type="submit" :disabled="loading">Register</button>
        <br/>
        <span v-if="message">{{message}}</span>
      </form>
    </div>
  `,
  data() {
    return {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      message: '',
      loading: false,
    };
  },
  methods: {
    submit() { // register
      this.loading = true;
      http.post('/rest/users', {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        password: this.password,
      }).then(response => {
        console.log(response);
        this.loading = false;
        if(response.data.affectedRows == 1) {
          this.message = 'Registration underway';
          http.post('/rest/usersXroles', {
            user:response.data.insertId,
            role:2
          }).then(response => {
            if(response.data.affectedRows == 1) {
              this.message = 'Registration complete';
            } else {
              this.message = 'Failed registration';
            }
          });
        } else {
          this.message = 'Failed registration';
        }
      }).catch(error => {
        this.loading = false;
        this.message = 'Failed registration';
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


