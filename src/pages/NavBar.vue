/* eslint-disable max-len */
<template>
<div id="navDiv">
  <!-- Navbar -->
  <div class="w3-top" id="top">
    <div class="w3-bar w3-theme-d2 w3-left-align w3-large">
      <a
        class="w3-bar-item w3-button w3-hide-medium w3-hide-large w3-right
        w3-padding w3-hover-white w3-large w3-theme-d2"
        href="javascript:void(0);"
        v-on:click="openNav">
          <i class="fa fa-bars"></i>
      </a>
      <a
        href="/#/"
        class="w3-bar-item w3-button w3-padding w3-theme-d4">
        <i class="fa fa-home w3-margin-right"></i>
        Exchange Zone 9ja
      </a>
      <div>
        <router-link
          to="/ourRates"
          class="w3-bar-item w3-button w3-padding w3-hide-small w3-theme-d4 w3-right">
          Our Rates
        </router-link>
        <router-link
          to="/feedback"
          class="w3-bar-item w3-button w3-padding w3-theme-d4 w3-hide-small w3-right">
          Send Feedback
        </router-link>
        <router-link
          to="/sellCard"
          class="w3-bar-item w3-button w3-padding w3-theme-d4 w3-hide-small w3-right">
          Sell Card
        </router-link>
        <div v-if="isAdmin">
          <router-link
            to="/adminFeedback"
            class="w3-bar-item w3-button w3-padding w3-theme-d4 w3-hide-small w3-right">
            Sales Feedback
          </router-link>
          <router-link
            to="/ClientOrders"
            class="w3-bar-item w3-button w3-padding w3-theme-d4 w3-hide-small w3-right">
            View Orders
          </router-link>
          <router-link
            to="/emails"
            class="w3-bar-item w3-button w3-padding w3-theme-d4 w3-hide-small w3-right">
            Manage Emails
          </router-link>
          <router-link
            to="/products"
            class="w3-bar-item w3-button w3-padding w3-theme-d4 w3-hide-small w3-right">
            Manage Card
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <!-- Navbar on small screens -->
  <div
    id="MobileNav"
    class="w3-bar-block w3-theme-d2 w3-show w3-hide-large w3-hide-medium w3-large">
    <span href="#"
      class="w3-bar-item w3-button w3-padding">
      ---------------
    </span>
    <div>
      <div v-if="isAdmin">
        <router-link
          to="/products"
          class="w3-bar-item w3-button w3-padding">
          Manage Card
        </router-link>
        <router-link
          to="/emails"
          class="w3-bar-item w3-button w3-padding">
          Manage Emails
        </router-link>
        <router-link
          to="/orders"
          class="w3-bar-item w3-button w3-padding">
          View Orders
        </router-link>
        <router-link
          to="/adminFeedback"
          class="w3-bar-item w3-button w3-padding">
          Sales Feedback
        </router-link>
      </div>
      <router-link
        to="/sellCard"
        class="w3-bar-item w3-button w3-padding">
        Sell Card
      </router-link>
      <router-link
        to="/feedback"
        class="w3-bar-item w3-button w3-padding">
        Send Feedback
      </router-link>
      <router-link
        to="/ourRates"
        class="w3-bar-item w3-button w3-padding">
        Our Rates
      </router-link>
    </div>
  </div>
  <!-- product alert modal -->
    <div
      v-bind:style="productAlertDiv"
      class="w3-modal"
      >
      <div
        class="w3-modal-content w3-card-4 w3-animate-zoom"
        style="max-width:600px">
        <div class="w3-center">
          <p class=" w3-block w3-padding w3-pink">
            Alert!!!
            <span
              v-on:click="closeproductAlertDiv"
              class="w3-button w3-display-topright w3-hover-grey">
              &times;
            </span>
          </p>
        </div>
        <div class="w3-section w3-center">
          <label>
            <b>
              {{productUpdateAlert}}
            </b>
            </label>
          <button
            v-on:click="gotoOurRatePage"
            class="w3-button w3-block w3-padding w3-indigo">
            Please check our Rates page now
          </button>
        </div>
      </div>
   </div>
</div>
</template>

<script>
import io from 'socket.io-client';
import { mapState } from 'vuex';
import * as types from '../store/mutation-types';

export default {
  name: 'NavBar',
  data() {
    return {
      productAlertDiv: { display: 'none' },
    };
  },
  computed: {
    ...mapState('auth', {
      isAdmin: state => (state.userCategory === 'admin'),
    }),
    ...mapState({
      productUpdateAlert: state => state.productUpdateAlert,
    }),
  },
  methods: {
    openNav() {
      const x = document.getElementById('MobileNav');
      if (x.className.indexOf('w3-show') === -1) {
        x.className = x.className.replace(' w3-hide', ' w3-show');
      } else {
        x.className = x.className.replace(' w3-show', ' w3-hide');
      }
    },
    closeproductAlertDiv(event) {
      event.preventDefault();
      this.productAlertDiv = { display: 'none' };
    },
    gotoOurRatePage(event) {
      event.preventDefault();
      this.productAlertDiv = { display: 'none' };
      this.$router.push('OurRates');
    },
  },
  mounted() {
    const socket = io('/');
    socket.on('ProductUpdate', (data) => {
      this.$store.commit(types.UPDATE_PRODUCT_SUCCESS, { ...data });
      this.$store.commit(types.PRODUCT_UPDATE_ALERT, {});
      this.$store.dispatch('getProducts');
      this.productAlertDiv = { display: 'block' };
    });
    socket.on('newProduct', (data) => {
      this.$store.commit(types.NEW_PRODUCT_ALERT, { ...data });
      this.$store.dispatch('getProducts');
      this.productAlertDiv = { display: 'block' };
    });
  },
};
</script>

<style>
  #navDiv {
    margin-bottom: 20px;
  }
  a {
    float: left;
    width: auto;
    border: none;
    display: block;
    outline: 0;
    white-space: normal;
  }
  .router-link-exact-active  {
    background-color: #4D636E !important;
    border-bottom: 5px solid #4688F1 !important;
  }
  #fbnavBtn {
    background-color: #425EA7;
  }
  .username {
    color: #4688F1 !important;
    text-transform: capitalize;
  }
  .w3-bar-item {
    font-size: 14px;
  }
  .w3-button {
    padding: 0px 6px;
  }
  .w3-bar {
    overflow: hidden;
  }
</style>
