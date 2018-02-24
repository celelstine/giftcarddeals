<template>
  <!-- Image Header -->
  <div class="w3-row w3-animate-opacity">
    <div class="w3-half w3-padding">
      <h6
        class="non_margin_top w3-container w3-deep-orange w3-center">
        We buy ITUNES giftcards at awesome Rate
      </h6>
       <img
        src="../assets/images/itunes-gift-card-pile.png"
        alt="boat"
        style="width:90%; height:100%">
    </div>
    <div class="w3-half w3-padding">
      <div class="w3-row">
        <div class="w3-card-4">
          <header class="w3-container w3-deep-orange">
            <Signup v-if="notlogin"></Signup>
            <h6
              class="signup"
              v-else
              >
                Welcome, Life can only get better with us!!!
            </h6>
          </header>
          <div class="w3-container">
            <div class="w3-row">
              <div  v-if="notlogin" class="w3-half">
                <Login></Login>
              </div>
              <div  v-if="notlogin" class="w3-half">
                <fb:login-button
                  scope="public_profile,email"
                  name="fbLogin"
                  style="margin-top: 10px"
                  onlogin="checkLoginState">
                </fb:login-button>
              </div>
            </div>
            <ul class="companyAttribute">
              <li>
                Our rate are awesome, available on our
                <router-link
                  class="inlineLinks"
                  to="/ourRates">
                  product page
                </router-link>
              </li>
              <li> Our transactions are completed within 10 minutes (maximal) </li>
               <li> We respond to feedback within few minutes</li>
            </ul>
            <div class="row">
              <div class="w3-quarter w3-center">
                <img
                  src="../assets/images/itunes-100.png"
                  alt="$100 itunes card"
                  class="cards">
                <br />
                <span
                  class="ituneTitle">
                  $100 itunes card
                </span>
              </div>
              <div class="w3-quarter w3-center">
                <img
                  src="../assets/images/itunes-50.png"
                  alt="$50 itunes card"
                  class="cards">
                  <br />
                  <span
                  class="ituneTitle">
                  $50 itunes card
                </span>
              </div>
              <div class="w3-quarter w3-center">
                <img
                  src="../assets/images/itunes-25.jpeg"
                  alt="$25 itunes card"
                  class="cards">
                  <br />
                <span
                  class="ituneTitle">
                  $25 itunes card
                </span>
              </div>
              <div class="w3-quarter w3-center">
                <img
                  src="../assets/images/itunes-gift-card-15.png"
                  alt="$15 itunes card"
                  class="cards">
                  <br />
                <span
                  class="ituneTitle">
                  $15 itunes card
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Login from './Login';
import Signup from './Signup';

export default {
  name: 'Home',
  components: {
    Login,
    Signup,
  },
  computed: {
    ...mapState('auth', {
      notlogin: state => (!state.jwtToken),
    }),
  },
  methods: {
    checkLoginState() {
      /* eslint-disable no-undef */
      FB.getLoginStatus((response) => {
        const { status } = response;
        if (status === 'connected' &&
        !(localStorage.getItem('32snksnsknskn'))) {
          this.$store.dispatch('auth/signwithThirdParty', {});
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

a {
  color: #42b983;
  float:none;
}
.companyAttribute ul {
  background: #cce5ff !important;
  padding: 5px;
}
.companyAttribute > li {
  padding: 5px;
}

.inlineLinks {
  display: inline;
  color: #292929;
}
.non_margin_top{
  margin-top: 0px;
  padding: 10px 0px;
}
.ituneTitle{
  margin-left: 13px;
  padding-bottom: 10px;
}
.cards {
  width:100%;
  height:100%;
  max-width:200px;
}
</style>
