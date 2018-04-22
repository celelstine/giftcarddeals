<template>
  <!-- Image Header -->
  <div class="w3-row w3-animate-opacity">
    <div class="w3-half w3-padding">
      <h1
        class="non_margin_top w3-container w3-deep-orange w3-center">
        We buy <em>ITUNES</em> Gift Cards at awesome Rate
      </h1>
      
      <CardSlide> </CardSlide>
    </div>
    <div class="w3-half w3-padding">
      <div class="w3-row">
        <div class="w3-card-4">
          <header class="w3-container w3-deep-orange">
            <h1 class="signup">
                Welcome, Life can only get better with us!!!
                <router-link
                  class="sellit"
                  to="/sellcard">
                <i class="fas fa-hand-point-right">
                  Sell Your Gift Card here
                </i>
                </router-link>
            </h1>
          </header>
          <div class="w3-container">
            <ul class="companyAttribute">
              <li>
                Our rate are awesome, they are proudly displayed on our
                <router-link
                  class="actionLinks"
                  to="/ourRates">
                  product page
                </router-link>
              </li>
              <li>
                Our transactions are completed within 10 minutes (maximal)
              </li>
              <li>
                We respond to feedback within few minutes
              </li>
              <li>
                Please read our
                <router-link
                  class="actionLinks"
                  to="/TermsandConditions">
                  Terms and Conditions
                </router-link> before you make any transaction.
              </li>
            </ul>
            <fieldset>
              <legend class="actionLinks"> How to Sell your Gift Cards </legend>
              <ol>
                Please ensure that your browser is updated
                <li>
                  Go to the
                  <router-link
                    class="actionLinks"
                    to="/sellcard">
                    Sell card page.
                  </router-link>
                </li>
                <li>
                  Select your card Category, then the Card Denomination.
                </li>
                <li>
                  Upload your Cards, we accept at most 10 cards at once.
                </li>
                <li>
                  Enter your correct bank Account Details.
                </li>
                <li>
                  Enter a valid email, we would contact you via this email.
                </li>
                <li>
                  Click the <i> Sell it </i> Button
                </li>
              </ol>
            </fieldset>
            <br />
          </div>
        </div>
      </div>
    </div>
    <OurRates> </OurRates>
  </div>
</template>

<script>
import OurRates from './OurRates';
import CardSlide from './CardSlide';

export default {
  name: 'Home',
  components: {
    OurRates,
    CardSlide,
  },
  methods: {
    gotoOurRatePage(event) {
      event.preventDefault();
      this.$router.push('/sellcard');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  font-size: 16px;
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

.actionLinks {
  display: inline;
  color: #FC5830;
  cursor: pointer;
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
.sellit {
  float: right;
  /* text-decoration: underline; */
  color: white;
  cursor: pointer;
}
.sellitList {
  color:#292929;
  text-decoration: underline;
  cursor: pointer;
}
</style>
