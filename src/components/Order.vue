<template>
 <div class="w3-container">
   <div
      class="w3-modal-content w3-card-4 w3-animate-zoom">
      <div class="w3-center">
        <p class=" w3-block w3-padding w3-pink">
          Endeavour to review your application,this transaction
          can not be altered after submission. Please review our
          <span v-on:click="gotoTermsPage" class="linkspan">
            Terms and Conditions
          </span>
        </p>
        <img
          src="../assets/images/sell-gift-cards.jpg" alt="sell Cards"
          style="width:40%" class=" w3-margin-top">
      </div>
       <form class="w3-container"  enctype="multipart/form-data">
          <div class="w3-section">
          <label><b>Gift Cards Type</b></label>
          <select
            class="w3-input w3-margin-bottom"
            v-model="product"
            v-bind:style="customBorder.product">
            <option value=0> Select the category of Card </option>
            <option
              v-for="product in products"
              v-bind:key="product.id"
              v-bind:value="product.id"
            >
              {{ product.name }} - &#8358; {{ product.rate }} / {{ product.bulkrate}}
              per {{ product.cardCurrency }}
            </option>
          </select>
          <label><b>Upload Gift Cards</b></label>
          <div class="dropbox">
            <input
              type="file"
              multiple
              accept="image/*"
              class="input-file1"
              v-on:change="filesChange"
              required>
              <p v-if="isInitial">
                Drag your gift cards(s) here to begin<br> or click to browse
              </p>
              <h3 v-if="isSaving" style="color: indigo" class="w3-center">
                You uploaded {{ fileCount }} gift card(s)...
              </h3>
          </div>
          <label><b>Bank Name</b></label>
          <input
            class="w3-input  w3-margin-bottom" type="text"
            placeholder="Enter your bank name" name="bankName"
            v-model="bankName"
            v-bind:style="customBorder.bankName"
            list="banks"
            required>
            <datalist id="banks">
              <option
                v-for="bank in banks"
                v-bind:value="bank"
                v-bind:key="bank"
              >
                {{ bank }}
              </option>
            </datalist>
          <label><b>Account Name</b></label>
          <input
            class="w3-input  w3-margin-bottom" type="text"
            placeholder="Enter your account name" name="bankAccountName"
            v-model="bankAccountName"
            v-bind:style="customBorder.bankAccountName"
            required>
          <label><b>Account Number</b></label>
          <input
            class="w3-input  w3-margin-bottom" type="text"
            placeholder="Enter your account name" name="bankAccountNumber"
            v-model="bankAccountNumber"
            v-bind:style="customBorder.bankAccountNumber"
            required>
            <label><b>Email</b></label>
            <input
              class="w3-input w3-margin-bottome"
              type="text" v-model="email"
              v-bind:style="customBorder.email"
              placeholder="Enter your email address"
              required>
          <textarea
            placeholder="Write additonal note..."
            class="w3-input w3-margin-bottom"
            v-model="extra">
          </textarea>
          <p v-if="message" class="w3-pink w3-center" autofocus>{{ message }}</p>
          <button
            class="w3-button w3-block w3-green w3-section w3-padding"
            type="submit"
            v-bind:disabled="inValidForm"
            v-on:click="placeOrder"
            title="Endeavour to review your application,this transaction
          can not be altered after submission"
            >
            Sell it
           </button>
        </div>
      </form>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {
  isValidEmail,
  isValidAccountNumber,
  isValidFullName,
} from '../../api/controllers/validators';

export default {
  name: 'Order',
  computed: {
    ...mapState('auth', {
      jwtToken: state => state.jwtToken,
      userFullname: state => state.userFullname,
      userEmail: state => state.email,
    }),
    ...mapState('order', {
      message: state => state.message,
    }),
    ...mapState({
      products: state => state.products,
    }),
  },
  mounted() {
    this.$store.dispatch('getProducts');
    // autofill the email and bank account name with the auth object
    this.bankAccountName = this.userFullname;
    this.email = this.userEmail;
  },
  methods: {
    gotoTermsPage(event) {
      event.preventDefault();
      this.$router.push('TermsandConditions');
    },
    placeOrder(event) {
      event.preventDefault();
      // get the selected product
      const selectProduct = this.products
        .find(product => product.id === this.product);
      const formData = new FormData();
      // add user input to form data
      formData.append('bankName', this.bankName);
      formData.append('bankAccountName', this.bankAccountName);
      formData.append('bankAccountNumber', this.bankAccountNumber);
      formData.append('email', this.email);
      formData.append('extra', this.extra);
      const productRate = `&#8358; ${selectProduct.rate} per ${selectProduct.cardCurrency}`;
      const bulkrate = `&#8358; ${selectProduct.bulkrate} per ${selectProduct.cardCurrency}`;
      formData.append('bulkrate', bulkrate);
      formData.append('rate', productRate);
      formData.append('productName', selectProduct.name);
      formData.append('cardCurrency', selectProduct.cardCurrency);
      let curFile = null;
      /* eslint-disable no-unused-vars  */
      Object.entries(this.uploadedCards).forEach((key, file) => {
        curFile = key[1];
        formData.append('uploadedCards[]', curFile, curFile.name);
      });
      this.$store.dispatch('order/placeOrder', {
        formData,
      });
    },
    filesChange(event) {
      const uploadedFiles = event.target.files;
      if (uploadedFiles.length) {
        this.uploadedCards = uploadedFiles;
        this.fileCount = uploadedFiles.length;
        this.isInitial = false;
        this.isSaving = true;
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
      if (validInputs.length === 6) {
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
      isSaving: false,
      bankName: null,
      bankAccountName: null,
      bankAccountNumber: null,
      email: '',
      extra: '',
      fileCount: 0,
      product: 0,
      uploadedCards: null,
      uploadedCardsPreview: [],
      validInputs: [],
      inValidForm: true,
      customBorder: {
        bankName: {
          border: '1px solid #ccc',
        },
        bankAccountName: {
          border: '1px solid #ccc',
        },
        bankAccountNumber: {
          border: '1px solid #ccc',
        },
        email: {
          border: '1px solid #ccc',
        },
        product: {
          border: '1px solid #ccc',
        },
      },
      banks: [
        'Access Bank',
        'Citibank',
        'Diamond Bank',
        'Ecobank Nigeria',
        'Enterprise Bank Limited',
        'Fidelity Bank Nigeria',
        'First Bank of Nigeria',
        'First City Monument Bank',
        'FSDH Merchant Bank',
        'Guaranty Trust Bank',
        'Heritage Bank Plc.',
        'Keystone Bank Limited',
        'Mainstreet Bank Limited',
        'Rand Merchant Bank',
        'Savannah Bank',
        'Skye Bank',
        'Stanbic IBTC Bank Nigeria Limited',
        'Standard Chartered Bank',
        'Sterling Bank',
        'Union Bank of Nigeria',
        'United Bank for Africa',
        'Unity Bank Plc.',
        'Wema Bank',
        'Zenith Bank',
      ],
    };
  },
  watch: {
    bankName(val) {
      if (val.trim()) {
        this.checkForm('bankName', 'add');
      } else {
        this.checkForm('bankName', 'remove');
      }
    },
    bankAccountName(val) {
      if (isValidFullName(val)) {
        this.checkForm('bankAccountName', 'add');
      } else {
        this.checkForm('bankAccountName', 'remove');
      }
    },
    bankAccountNumber(val) {
      if (isValidAccountNumber(val)) {
        this.checkForm('bankAccountNumber', 'add');
      } else {
        this.checkForm('bankAccountNumber', 'remove');
      }
    },
    email(val) {
      if (!isValidEmail(val)) {
        this.checkForm('email', 'remove');
      } else {
        this.checkForm('email', 'add');
      }
    },
    uploadedCards(val) {
      if (val.length) {
        this.checkForm('uploadedCards', 'add');
      } else {
        this.checkForm('uploadedCards', 'remove');
      }
    },
    message(val) {
      if (val.toString().includes('success')) {
        this.bankName = '';
        this.bankAccountName = '';
        this.bankAccountNumber = '';
        this.email = '';
        this.uploadedCards = [];
        this.fileCount = null;
        this.isSaving = null;
        this.isInitial = true;
        this.product = 0;
        this.customBorder = {
          bankName: {
            border: '1px solid #ccc',
          },
          bankAccountName: {
            border: '1px solid #ccc',
          },
          bankAccountNumber: {
            border: '1px solid #ccc',
          },
          email: {
            border: '1px solid #ccc',
          },
        };
      }
    },
    product(val) {
      if (val !== 0) {
        this.checkForm('product', 'add');
      } else {
        this.checkForm('product', 'remove');
      }
    },
  },
};
</script>

<!-- SASS styling -->
<style>
.linkspan{
  text-decoration: underline;
  cursor: pointer;
  font-family: Georgia, serif;
}
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
