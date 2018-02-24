<template>
   <div class="w3-container">
   <div
      class="w3-modal-content w3-card-4 w3-animate-zoom">
      <div class="w3-center">
        <p class=" w3-block w3-padding w3-pink">
          We all need people who will give us feedback. That's how we improve.
        </p>
        <img
          src="../assets/images/feedback.png" alt="sell Cards"
          style="width:40%" class=" w3-margin-top">
      </div>
       <form class="w3-container">
        <div class="w3-section">
          <label><b>OrderId</b></label>
          <input
            class="w3-input  w3-margin-bottom" type="text"
            placeholder="Enter the orderId" name="orderId"
            v-model="orderId"
            v-bind:style="customBorder.orderId"
            required>
          <textarea
            placeholder="Write Feedback here..."
            class="w3-input w3-margin-bottom"
             v-bind:style="customBorder.content"
            v-model="content">
          </textarea>
          <p
            v-if="messageForFeedback"
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
} from '../../api/controllers/validators';

export default {
  name: 'Feedback',
  computed: {
    ...mapState('auth', {
      email: state => state.email,
    }),
    ...mapState({
      message: state => state.message,
      messageForFeedback: state => state.messageForFeedback,
    }),
  },
  data() {
    return {
      orderId: null,
      content: null,
      inValidForm: true,
      validInputs: [],
      customBorder: {
        orderId: {
          border: '1px solid #ccc',
        },
        content: {
          border: '1px solid #ccc',
        },
      },
    };
  },
  mounted() {
    const orderID = this.$route.params.orderId;
    if (orderID) {
      this.orderId = orderID;
    }
  },
  methods: {
    sendFeedBack(event) {
      event.preventDefault();
      const credentails = {
        content: this.content,
        orderId: this.orderId,
        from: this.email,
        isclient: true,
      };
      this.$store.dispatch('sendFeedback', credentails);
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
      if (validInputs.length === 2) {
        this.inValidForm = false;
      } else {
        this.inValidForm = true;
      }
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
    content(val) {
      if (val) {
        this.checkForm('content', 'add');
      } else {
        this.checkForm('content', 'remove');
      }
    },
    message(val) {
      if (val.toString().includes('success')) {
        this.orderId = null;
        this.content = null;
        this.customBorder = {
          orderId: {
            border: '1px solid #ccc',
          },
          content: {
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
