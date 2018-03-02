<template>
<div >
  <h6 onclick="document.getElementById('login').style.display='block'">
      I have an account? <span class="login">Login</span>
  </h6>
 <div>
  <div id="login" class="w3-modal">
    <div
      class="w3-modal-content w3-card-4 w3-animate-zoom">

      <div class="w3-center">
        <p v-if="hasMessage" class="w3-pink">{{ message }}</p>
        <img
          src="../assets/images/login_avatar.png" alt="Login Avatar"
          style="width:30%" class="w3-circle w3-margin-top">
      </div>

      <form class="w3-container" style="color: black">
        <div class="w3-section">
          <label><b>Email</b></label>
          <input
            class="w3-input w3-round-large w3-animate-input"
            type="text"
            placeholder="Enter your email"
            name="email"
            v-model="email"
            v-bind:style="customBorder.email"
            required>
          <label><b>Password</b></label>
          <input
            class="w3-input w3-round-large w3-animate-input"
            type="password"
            v-model="password"
            placeholder="Enter Password"
            name="password"
            v-bind:style="customBorder.password"
            required>
          <button
            class="w3-button w3-block w3-green w3-section w3-padding"
            type="submit"
            v-bind:disabled="inValidForm"
            v-on:click="handleLogin">
            Login
           </button>
           <p class="checkitemn">
            <input
              class="w3-check w3-margin-top"
              type="checkbox"
              v-model="rememberMe"
              id="rememberMe"> Remember Me
            </p>
        </div>
      </form>

      <div class="w3-container w3-border-top w3-padding-16 w3-light-grey">
        <button onclick="document.getElementById('login').style.display='none'"
          type="button" class="w3-button w3-red">
          Cancel
        </button>
      </div>

    </div>
  </div>
</div>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import {
  isValidatePassword,
  isValidEmail,
} from '../../api/controllers/validators';

export default {
  name: 'Login',
  computed: {
    ...mapState('auth', {
      message: state => state.message,
      hasMessage: state => state.fromLogin,
      jwtToken: state => state.jwtToken,
    }),
  },
  methods: {
    handleLogin(event) {
      event.preventDefault();
      const credentails = {
        email: this.email,
        password: this.password,
        rememberMe: this.rememberMe,
        is3rdParty: false,
      };
      this.$store.dispatch('auth/login', credentails);
    },
    // we are not using the mapping below yet
    ...mapActions('auth', [
      'login',
    ]),
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
  data() {
    return {
      email: '',
      password: '',
      rememberMe: true,
      inValidForm: true,
      validInputs: [],
      customBorder: {
        password: {
          border: '1px solid #ccc',
        },
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
    password(val) {
      if (!isValidatePassword(val)) {
        this.checkForm('password', 'remove');
      } else {
        this.checkForm('password', 'add');
      }
    },
    jwtToken(val) {
      if (val) {
        document.getElementById('login').style.display = 'none';
      }
    },
  },
};
</script>

<style>
.login{
  color: #292929;
  cursor: pointer;
  text-decoration: underline;
}
</style>

