<template>
 <div class="w3-container">
   <div class="w3-container" v-if="isProductDetails">
    <div
      id="CurrentProductDiv"
      class="w3-modal-content w3-card-4 w3-animate-zoom"
      v-bind:style="CurrentProductDiv"
      style="max-width:600px">
      <div class="w3-center">
        <p class=" w3-block w3-padding w3-pink">
          Ensure that this card does not exist already, existing cards listed below the form.
          <span v-on:click="closeCurrentProductDiv"
            class="w3-button w3-display-topright w3-hover-grey">&times;</span>
        </p>
      </div>
       <form class="w3-container"  enctype="multipart/form-data">
          <div class="w3-section">
          <label><b>Gift Cards Image</b></label>
          <div class="dropbox">
            <input
              type="file"
              accept="image/*"
              class="input-file1"
              v-on:change="filesChange"
              required>
              <p v-if="isInitial">
                Drag the image (s) here to begin<br> or click to browse
              </p>
              <h3 v-if="isSaving" style="color: indigo" class="w3-center">
                The image has been uploaded, you can proceed with other fields
              </h3>
              <img v-if="image_url" v-bind:src="image_url" />
          </div>
          <label><b>Card Title</b></label>
          <input
            class="w3-input  w3-margin-bottom" type="text"
            placeholder="Enter the card title" name="name"
            v-model="name"
            v-bind:style="customBorder.name"
            required>
          <label><b>Buy Rate in &#8358;</b></label>
          <input
            class="w3-input  w3-margin-bottom" type="text"
            placeholder="Enter the buying rate" name="rate"
            v-model="rate"
            v-bind:style="customBorder.rate"
            required>
          <label><b>Base Currency</b></label>
          <input
            class="w3-input  w3-margin-bottom" type="text"
            placeholder="Enter card's base currency" name="cardCurrency"
            v-model="cardCurrency"
            v-bind:style="customBorder.cardCurrency"
            required>
          <textarea
            placeholder="Write additonal note..."
            class="w3-input w3-margin-bottom"
            v-model="extra">
          </textarea>
          <p v-if="messageForProducts" class="w3-pink w3-center" autofocus>{{ message }}</p>
          <button
            class="w3-button w3-block w3-green w3-section w3-padding"
            type="submit"
            v-bind:disabled="inValidForm"
            v-on:click="registerProduct"
            >
             {{ submitBtnText }}
           </button>
            <button
              v-on:click="closeCurrentProductDiv"
              class="w3-button w3-block w3-grey w3-hover-red">
              Close
            </button>
                <br/>
        </div>
      </form>
    </div>
   </div>
    <!-- display existing products -->
    <div class="w3-container">
      <div class="w3-row">
        <div class="w3-threequarter">
          <p
            v-if="products.length"
            class="w3-pink w3-center">
            List of cards and thier prices, to edit click the edit button
          </p>
        </div>
        <div class="w3-quarter">
          <button
            v-on:click="showProductDetails($event)"
            title="Create a new card"
            type="submit"
            class="w3-button w3-xlarge w3-circle w3-teal w3-hover-green">
          +</button>
        </div>
      </div>
      <div class="w3-row-padding w3-margin-top">
        <div
          class="w3-quarter"
          v-for="product in products"
          v-bind:key="product.id"
        >
          <div class="w3-card">

            <img
              v-if="product.image_url"
              v-bind:src="product.image_url"
              alt="Card image"
              style="width:100%">
            <img
            v-else src="/gift_card_blue.png"
            alt="Card image"
            style="width:100%">
            <button
              class="w3-button w3-block w3-grey"
              >
              {{ product.name }} - &#8358; {{ product.rate }} per {{ product.cardCurrency }}
            </button>
            <button
              class="w3-button w3-block w3-light-blue"
              type="submit"
              v-on:click="showProductDetails($event, product.id)"
              title="Edit the card"
              >
              Edit this card
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
  /* eslint-disable no-console */
  name: 'Products',
  mounted() {
    if (this.$store.state.auth.userCategory !== 'admin') {
      this.$router.push('Home');
    }
    this.$store.dispatch('getProducts');
  },
  computed: {
    ...mapState('auth', {
      jwtToken: state => state.jwtToken,
    }),
    ...mapState({
      products: state => state.products,
      message: state => state.message,
      messageForProducts: state => state.messageForProducts,
    }),
  },
  methods: {
    closeCurrentProductDiv(event) {
      event.preventDefault();
      this.isProductDetails = false;
      this.CurrentProductDiv = { display: 'none' };
    },
    showProductDetails(event, id = null) {
      this.isProductDetails = true;
      if (id) {
        /* eslint-disable no-console */
        console.log('cam here with', id);
        const currentProduct = this.products
          .filter(product => product.id === id)[0];
        this.productId = currentProduct.id;
        this.name = currentProduct.name;
        this.cardCurrency = currentProduct.cardCurrency;
        this.rate = currentProduct.rate;
        this.image_url = currentProduct.image_url;
        this.extra = currentProduct.extra;
        this.submitBtnText = 'Update Card';
      } else {
        this.productId = null;
        this.name = null;
        this.cardCurrency = null;
        this.rate = null;
        this.image_url = null;
        this.extra = null;
        this.submitBtnText = 'Register card';
      }
      this.CurrentProductDiv = { display: 'block' };
    },
    registerProduct(event) {
      event.preventDefault();
      const formData = new FormData();
      // add user input to form data
      formData.append('name', this.name);
      formData.append('rate', this.rate);
      formData.append('cardCurrency', this.cardCurrency);
      formData.append('extra', this.extra);
      let curFile = null;
      /* eslint-disable no-unused-vars  */
      if (this.uploadedCard) {
        Object.entries(this.uploadedCard).forEach((key, file) => {
          curFile = key[1];
          formData.append('uploadedCard', curFile, curFile.name);
        });
      }
      if (this.productId) {
        this.$store.dispatch('updateProduct', {
          formData,
          productId: this.productId,
        });
      } else {
        this.$store.dispatch('registerProduct', { formData });
      }
    },
    filesChange(event) {
      const uploadedFiles = event.target.files;
      if (uploadedFiles.length) {
        this.uploadedCard = uploadedFiles;
        this.isInitial = false;
        this.isSaving = true;
        this.image_url = null;
      }
    },
    checkForm(field, operation) {
      let validInputs = this.validInputs;
      const fieldIndex = validInputs.indexOf(field);
      if (operation === 'add') {
        this.customBorder[field] = {
          border: '1px solid #ccc',
        };
        if (fieldIndex === -1) {
          validInputs.push(field);
        }
      } else if (operation === 'remove') {
        this.customBorder[field] = {
          borderStyle: 'solid',
          borderColor: 'coral',
        };
        if (fieldIndex !== -1) {
          validInputs = validInputs
            .filter((item, index) => index !== fieldIndex);
        }
      }
      this.validInputs = validInputs;

      // disable the submit button when every field are not valid
      if (validInputs.length === 3) {
        this.inValidForm = false;
      } else {
        this.inValidForm = true;
      }
    },
  },
  data() {
    return {
      additonalNote: null,
      isInitial: true,
      isProductDetails: false,
      isSaving: false,
      name: null,
      rate: null,
      cardCurrency: null,
      extra: '',
      image_url: null,
      productId: null,
      uploadedCard: null,
      validInputs: [],
      inValidForm: true,
      submitBtnText: 'Register card',
      CurrentProductDiv: { display: 'none' },
      customBorder: {
        name: {
          border: '1px solid #ccc',
        },
        rate: {
          border: '1px solid #ccc',
        },
        cardCurrency: {
          border: '1px solid #ccc',
        },
      },
    };
  },
  watch: {
    name(val) {
      if (val.trim()) {
        this.checkForm('name', 'add');
      } else {
        this.checkForm('name', 'remove');
      }
    },
    rate(val) {
      if (val.toString().trim()) {
        this.checkForm('rate', 'add');
      } else {
        this.checkForm('rate', 'remove');
      }
    },
    cardCurrency(val) {
      if (val.toString().trim()) {
        this.checkForm('cardCurrency', 'add');
      } else {
        this.checkForm('cardCurrency', 'remove');
      }
    },
    message(val) {
      if (val.toString().includes('success')) {
        this.name = '';
        this.rate = '';
        this.cardCurrency = '';
        this.isSaving = null;
        this.isInitial = true;
        this.CurrentProductDiv = { display: 'none' };
        this.customBorder = {
          name: {
            border: '1px solid #ccc',
          },
          rate: {
            border: '1px solid #ccc',
          },
          cardCurrency: {
            border: '1px solid #ccc',
          },
        };
      }
    },
  },
};
</script>

<!-- SASS styling -->
<style>
.dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
  }

  .input-file1 {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
</style>
