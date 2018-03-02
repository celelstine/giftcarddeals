<template>
  <div class=" w3-modal-content w3-responsive">
    <p
      v-if="message"
      class=" w3-block w3-padding w3-centerw3-blue-grey">
      {{ message }}
    </p>
    <form class="w3-container">
      <div class="w3-section">
        <p class="w3-blue w3-center">
          Register new email that orders would be sent to
        </p>
        <label><b>Email</b></label>
        <input
          class="w3-input w3-round-large w3-animate-input"
          type="text"
          placeholder="Enter your email"
          name="email"
          v-model="email"
          v-bind:style="customBorder.email"
          required>
        <button
          class="w3-button w3-block w3-green w3-section w3-padding"
          type="submit"
          v-bind:disabled="inValidForm"
          v-on:click="registerEmail">
          Register
          </button>
      </div>
    </form>
    <div v-if="emails.length" class="w3-responsive  w3-center">
      <table
        class="w3-table-all w3-card-4 w3-hoverable"
        style="font-size: 12px;">
        <thead>
          <tr class="w3-blue-grey">
            <th>Mail</th>
            <th> Action </th>
          </tr>
        </thead>
        <tr
          v-for="email in emails"
          v-bind:key="email">
          <td>{{ email}}</td>
          <td>
            <i
            class="fa fa-trash"
            style="cursor: pointer"
            v-on:click="removeEmail(email)">
            </i>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {
  isValidEmail,
} from '../../api/controllers/validators';

export default {
  name: 'Emails',
  mounted() {
    if (this.$store.state.auth.userCategory !== 'admin') {
      
      this.$router.push('Home');
    }
    this.getEmails();
  },
  methods: {
    getEmails() {
      this.$store.dispatch('staffEmail/getEmails');
    },
    registerEmail(event) {
      event.preventDefault();
      const credentails = {
        email: this.email,
      };
      this.$store.dispatch('staffEmail/addEmail', credentails);
    },
    removeEmail(email) {
      const credentails = {
        email,
      };
      this.$store.dispatch('staffEmail/removeEmail', credentails);
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
      if (validInputs.length === 1) {
        this.inValidForm = false;
      } else {
        this.inValidForm = true;
      }
    },
  },
  computed: {
    ...mapState('staffEmail', {
      emails: state => state.emails,
      message: state => state.message,
    }),
  },
  data() {
    return {
      email: '',
      inValidForm: true,
      validInputs: [],
      customBorder: {
        email: {
          border: '1px solid #ccc',
        },
      },
    };
  },
  watch: {
    email(val) {
      if (!isValidEmail(val)) {
        this.checkForm('email', 'remove');
      } else {
        this.checkForm('email', 'add');
      }
    },
  },
};
</script>
<style>
.activePage{
  color: #164254;
}
.otherPage {
  color: blue;
}
</style>
