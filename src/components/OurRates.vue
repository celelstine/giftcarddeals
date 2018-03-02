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
          <img v-else src="../assets/images/gift_card_blue.png" style="width:100%">
          <div class="w3-container">
            <button class="w3-button w3-block w3-dark-grey">
              {{ product.name }} - &#8358; {{ product.rate }} per {{ product.cardCurrency }}
            </button>
            <button style="margin-bottom: 8px" class="w3-button w3-block w3-light-blue">
              Bulk Rate &#8358; {{ product.bulkrate }} per {{ product.cardCurrency }}
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
