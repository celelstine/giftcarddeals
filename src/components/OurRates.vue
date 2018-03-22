<template>
 <div class="w3-container">
    <p
      v-if="messageForGetProducts"
      class="w3-pink w3-center"
      autofocus>
      {{ message }}
    </p>
    <div class="w3-row-padding">

      <div
        class="w3-quarter"
        v-for="product in products"
        v-bind:key="product.id"
      >
        <div class="w3-card">

          <img v-if="product.image_url" v-bind:src="product.image_url" style="width:100%">
          <img v-else src="../assets/images/gift_card_blue.png" style="width:100%">
          <div class="w3-container">
            <button
              style=" margin-bottom: 2px"
              class="rating w3-button w3-block">
              {{ product.name }} - &#8358; {{ product.rate }} per {{ product.cardCurrency }}
            </button>
            <button style="margin-bottom: 8px"
            class="rating w3-button w3-block">
              Higher Denomination Rate &#8358; {{ product.highDenominationRate }} per
              {{ product.cardCurrency }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'OurRates',
  mounted() {
    this.$store.dispatch('getProducts');
  },
  computed: {
    ...mapState({
      products: state => state.products,
      message: state => state.message,
      messageForGetProducts: state => state.messageForGetProducts,
    }),
  },
};
</script>
<style scoped>
.w3-quarter {
    padding: 8px 8px !important;
    font-family: 'IBM Plex Sans Condensed', sans-serif;
    font-size: 12px;
}
.rating {
  background-color: #134255;
  color: #fff
}
</style>
