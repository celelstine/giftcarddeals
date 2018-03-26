<template>
  <div class="w3-container">
   <div
      class="w3-modal-content w3-card-4 w3-animate-zoom">
      <div class="w3-center">
        <p class=" w3-block w3-padding w3-pink">
          Spend Actionable Specific and kind feedback to Client
        </p>
      </div>
       <form class="w3-container">
        <div class="w3-section">
          <label><b>Feedback Category</b></label>
          <select
            class="w3-input w3-margin-bottom"
            v-model="feedbackCategory"
            v-bind:style="customBorder.feedbackCategory">
            <option value=0> Select the feedback category</option>
            <option value="goodCard"> Good Cards(s)</option>
            <option value="usedCard"> Used Cards(s)</option>
            <option value="nonActivatedCard"> Non Activated Cards(s)</option>
            <option value="blurryCard"> Blurry Cards(s)</option>
            <option value="others"> Others</option>
          </select>
          <label><b>Attachments</b></label>
          <input
            type="file"
            multiple
            accept="image/*"
            class="w3-input"
            v-on:change="filesChange"
            required> <br />
          <label><b>OrderId</b></label>
          <input
            class="w3-input  w3-margin-bottom" type="text"
            placeholder="Enter the orderId" name="orderId"
            v-model="orderId"
            v-bind:style="customBorder.orderId"
            required>
          <label><b>Contact Email</b></label>
          <input
            class="w3-input  w3-margin-bottom" type="text"
            placeholder="Enter your email" name="email"
            v-model="email"
            v-bind:style="customBorder.email"
            required>
          <textarea
            placeholder="Write your Feedback here...
            Not more than 800 characters"
            class="w3-input w3-margin-bottom"
             v-bind:style="customBorder.extraText"
            v-model="extraText">
          </textarea>
          <p
            v-if="messageForAdminFeedback"
            class="w3-pink w3-center" autofocus>
            {{ message }}
          </p>
          <button
            class="w3-button w3-block w3-green w3-section w3-padding"
            type="submit"
            v-bind:disabled="inValidForm"
            v-on:click="sendFeedBack"
            >
            Send Feedback
           </button>
        </div>
      </form>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {
  isOrderID,
  isValidEmail,
} from '../../api/controllers/validators';

export default {
  name: 'AdminFeedback',
  computed: {
    ...mapState({
      message: state => state.message,
      messageForAdminFeedback: state => state.messageForAdminFeedback,
    }),
  },
  data() {
    return {
      orderId: null,
      extraText: null,
      email: null,
      inValidForm: true,
      validInputs: [],
      attachments: [],
      feedbackCategory: 0,
      customBorder: {
        orderId: {
          border: '1px solid #ccc',
        },
        feedbackCategory: {
          border: '1px solid #ccc',
        },
        email: {
          border: '1px solid #ccc',
        },
      },
    };
  },
  mounted() {
    const orderID = this.$route.params.orderId;
    const email = this.$route.params.email;
    if (orderID) {
      this.orderId = orderID;
    }
    if (email) {
      this.email = email;
    }
  },
  methods: {
    sendFeedBack(event) {
      event.preventDefault();
      const formData = new FormData();
      // add user input to form data
      formData.append('email', this.email);
      formData.append('extraText', this.extraText);
      formData.append('orderId', this.orderId);
      formData.append('feedbackCategory', this.feedbackCategory);
      let curFile = null;
      /* eslint-disable no-unused-vars  */
      Object.entries(this.attachments).forEach((key, file) => {
        curFile = key[1];
        formData.append('attachments[]', curFile, curFile.name);
      });
      this.$store.dispatch('sendAdminFeedback', {
        formData,
      });
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
    filesChange(event) {
      this.attachments = event.target.files;
    },
  },
  watch: {
    orderId(val) {
      if (!isOrderID(val)) {
        this.checkForm('orderId', 'remove');
      } else {
        this.checkForm('orderId', 'add');
      }
    },
    email(val) {
      if (!isValidEmail(val)) {
        this.checkForm('email', 'remove');
      } else {
        this.checkForm('email', 'add');
      }
    },
    feedbackCategory(val) {
      if (val !== 0 || val !== '0') {
        this.checkForm('feedbackCategory', 'add');
      } else {
        this.checkForm('feedbackCategory', 'remove');
      }
    },
    message(val) {
      if (val.toString().includes('success')) {
        this.orderId = null;
        this.extraText = null;
        this.email = null;
        this.customBorder = {
          orderId: {
            border: '1px solid #ccc',
          },
          extraText: {
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

</style>
