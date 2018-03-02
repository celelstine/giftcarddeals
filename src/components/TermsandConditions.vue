 /* eslint-disable */
<template>
 <div class="w3-container">
   <div
      class="w3-modal-content w3-card-4 w3-animate-zoom"
      style="max-width:600px">
      <div class="w3-center">
        <p class=" w3-block w3-padding w3-pink">
          *********TERMS OF TRADE*********
          <span
            class="spanLink"
            title="return to previous page"
            v-on:click="gotoPreviousPage">
            « Back
          </span>
        </p>
      </div>

      <p class=" w3-block w3-padding">
        Upload the full picture of your itunes gift cards showing its denomination
        or attach the receipt if the denomination isn't visible.
      </p>
       <p class=" w3-block w3-padding">
      We accept only PHYSICAL Itunes Gift Card denominations of $5, $10, $15,
      $25, $50, & $100 or Pounds(£) or AUD or CAD are accepted.
       </p>
       <p class=" w3-block w3-padding">
      Itunes Gift Card denominations of $101 & £101 above are not accepted.
        For AUD & CAD, maximum denomination accepted is $500.
        These Giftcards usually start with "X"
      </p>
      <p class=" w3-block w3-padding">
      We won't credit your account if you upload ECODES, USED or UNACTIVATED or
      INVALID Cards or Card Denominations greater than $100 or £100 or 500AUD or
      500CAD Itunes Gift Card.
       </p>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'TermsandConditions',
  methods: {
    gotoPreviousPage(event) {
      event.preventDefault();
      this.$router.go(-1);
    },
  },
};
</script>
<style>
  .spanLink {
    float: left;
    font-size: x-small;
    padding-top: 4px;
    text-decoration: underline;
    cursor: pointer;
  }
</style>

