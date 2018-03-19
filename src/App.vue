<template>
  <div id="app">
    <NavBar></NavBar>
    <br/>
    <router-view id="pageContent"/>
    <br />
    <footer class="w3-container w3-theme-d2">
      <p>
        &copy; Copyright 2017
        <span class="spanLink1" v-on:click="gotoTermsPage">
          Terms and Conditions
        </span>
        <i class="fa fa-phone w3-right">
          09095113492
           whatsapp only » 08149677155</i>
        <a
          className="w3-xlarge w3-right"
          href="mailto:sales@exchangezone9ja.com?Subject=User's%20Feedback"
          target="_top"
          title="sales@exchangezone9ja.com"
        >
          Send us a mail <i class="fa fa-envelope"></i>
        </a>
      </p>
    </footer>
  </div>
</template>

<script>
import NavBar from './components/NavBar';

export default {
  name: 'App',
  components: {
    NavBar,
  },
  methods: {
    gotoTermsPage(event) {
      event.preventDefault();
      this.$router.push('TermsandConditions');
    },
  },
};
</script>

<style scoped>
.spanLink1 {
  text-decoration: underline;
  cursor: pointer;
  font-family: Georgia, serif;
}
#app {
  font-family: 'Karma', Georgia, 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height:100vh;
  margin: 0px;
  top: 0px;
  font-size: 14px;
}
#toTop{
  float: right;
}
#pageContent{
  padding-top: 10px;
  min-height: 82vh;
}
.checkitemn{
  color: indigo;
}
a{
  float: right;
  margin-right: 10px;
}
footer {
  bottom: 0px;
  width: 100%;
  position: relative;
}
</style>
<style>
.w3-modal {
  padding-top: 20px;
}
.w3-check, .w3-radio {
  width: 14px;
  height: 14px;
  position: relative;
  top: 0px;
}
.w3-modal-content{
  font-size: small;
  max-width: 450px;
}
</style>
