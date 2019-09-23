const LogoutComponent = {
  template: `<p>Loggar ut</p>`,
  data(){
    return {
      loggedOut: false
    }
  },
  created(){
    app.drawMenu = false;
    http.post('/rest/logout').then(response => {
      console.log(response);
      app.drawMenu = true;
      this.loggedOut = true;
      this.$router.push('/');
    }).catch(error => {
      console.error(error);
    });
    // no idea why it is inconsequent
    setTimeout(()=>{
      if(!this.loggedOut){
        app.drawMenu = true;
        this.$router.push('/');
      }
    },1000);
  }
}