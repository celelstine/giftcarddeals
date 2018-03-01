<template>
 <div class="w3-container">
    <p
      v-if="messageForGetProducts"
      class="w3-pink w3-center"
      autofocus>
      {{ message }}
    </p>
    <div class="w3-row-padding w3-margin-top">

      <div
        class="w3-quarter"
        v-for="product in products"
        v-bind:key="product.id"
      >
        <div class="w3-card">

          <img v-if="product.image_url" v-bind:src="product.image_url" style="width:100%">
          <img v-else src="/gift_card_blue.png" style="width:100%">
          <div class="w3-container">
            <h4> {{ product.name }} - &#8358; {{ product.rate }} per {{ product.cardCurrency }}</h4>
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
