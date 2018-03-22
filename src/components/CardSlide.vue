<template>
 <div class="w3-container">
    <p
      v-if="messageForGetProducts"
      class="w3-pink w3-center"
      autofocus>
      {{ message }}
    </p>
    <div class="w3-row-padding w3-margin-top" v-if="product">
      <h3 class="productName">
          {{ product.name }}
      </h3>
       <img v-if="product.image_url" v-bind:src="product.image_url" style="width:100%"> 
      <button
        style=" margin-bottom: 2px"
        class="rating w3-button w3-block">
          Normal Card &#8358; {{ product.rate }} per {{ product.cardCurrency }}
      </button>
      <button
        class="rating w3-button w3-block"
      >
        Higher Denomination Rate &#8358; {{ product.highDenominationRate }} per
        {{ product.cardCurrency }}
      </button>
      <div class="w3-center">
        <button
          class="w3-button" v-on:click="moveSlide(-1)"
          v-if="currentIndex>0"
          >
          &#10094; Prev
        </button>
        <button class="w3-button" v-on:click="moveSlide(1)"
          v-if="currentIndex<productCount"
        >
          Next &#10095;
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CardSlide',
  computed: {
    ...mapState({
      products: state => state.products,
      productCount: state => state.products.length - 1,
      message: state => state.message,
      messageForGetProducts: state => state.messageForGetProducts,
    }),
  },
  data() {
    return {
      product: null,
      currentIndex: 0,
      time: null,
      autoSlide: true,
    };
  },
  methods: {
    startSlide() {
      let currentIndex = this.currentIndex;
      let direction = 1;
      if (currentIndex === this.productCount) {
        direction = -1;
      }
      currentIndex += direction;
      const currentProduct = this.products[currentIndex];
      this.product = currentProduct;
      this.currentIndex = currentIndex;
      this.time = setTimeout(() => {
        if (this.autoSlide) {
          this.startSlide();
        }
      }, 2000);
    },
    moveSlide(direction) {
      const currentIndex = this.currentIndex + direction;
      this.currentIndex = currentIndex;
      this.product = this.products[currentIndex];
      this.autoSlide = false;
    },
  },
  watch: {
    products(val) {
      this.product = val[this.currentIndex];
      this.startSlide();
    },
  },
};
</script>
<style scoped>
.productName {
  color:darkblue;
  text-align: center;
  margin-top: -20px;
}
.rate {
  font-size: larger;
}
.rating {
  background-color: #134255;
  color: #fff;
  font-family: 'IBM Plex Sans Condensed', sans-serif;
  font-size: 14px;
}
</style>
