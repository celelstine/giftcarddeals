<template>
  <div style="display:inline">
    <h6
      class="signup"
      onclick="document.getElementById('signup').style.display='block'"
      >
        Join Us and make more CASH
        <span class="signupText">
          Click Here
        </span>
    </h6>
    <div>
     <div id="signup" class="w3-modal">
        <div
          class="w3-modal-content w3-card-4 w3-animate-zoom">
          <div class="w3-center">
            <p class="w3-blue">
              Please fill every field with valid data
            </p>
            <p class="w3-pink" v-if="hasMessage">{{ message }}</p>
            <img src="../assets/images/login_avatar.png" alt="Login Avatar"
              style="width:20%" class="w3-circle w3-margin-top">
          </div>
          <form class="w3-container" style="color: black">
            <div class="w3-section">
                <label><b>Full Name</b></label>
                <input
                  class="w3-input  w3-round-large"
                  type="text" v-model="fullName"
                  v-bind:style="customBorder.fullName"
                  placeholder="Please Use the format -> firstname middlename lastname"
                  required>
              <!-- <p>
                <label>Last Name</label>
                <input
                  class="w3-input w3-round-large w3-animate-input"
                  type="text" v-model="lastName"
                  v-bind:style="customBorder.lastName" required>
              </p>
              <p>
                <label>Others Names</label>
                <input
                  class="w3-input w3-round-large w3-animate-input"
                  type="text" v-model="otherNames"
                  v-bind:style="customBorder.otherNames">
              </p> -->
                <label><b>Email</b></label>
                <input
                  class="w3-input w3-round-large w3-animate-input"
                  type="text" v-model="email"
                  v-bind:style="customBorder.email"
                  placeholder="Enter your email address"
                  required>
              <!-- <p>
                <label>Username</label>
                <input
                  class="w3-input w3-round-large w3-animate-input"
                  type="text" v-model="username"
                  v-bind:style="customBorder.username"
                  placeholder="Enter a username"
                  required>
              </p> -->
                <label><b>Password</b></label>
                <input
                  class="w3-input w3-round-large w3-animate-input"
                  type="password" v-model="password"
                  v-bind:style="customBorder.password"
                  placeholder="Enter a special password"
                  required>
                  <!-- <password v-model="password"></password> -->
                <label><b>Confirm Password</b></label>
                <input
                  class="w3-input  w3-round-large w3-animate-input"
                  type="password"  v-model="confirmPassword"
                  v-bind:style="customBorder.confirmPassword"
                  placeholder="Enter your password again"
                  required>
                <input
                  class="w3-check"
                  type="checkbox" v-model="TCagree"
                  > Do you agree with our
                  <router-link
                  to="/TermsandConditions"
                  target="_blank"
                  >
                  Terms and Conditions
                  </router-link> &nbsp;&nbsp;&nbsp;
                <input
                  class="w3-check w3-margin-top"
                  type="checkbox" v-model="rememberMe"
                  >Remember me
                <button
                  class="w3-button w3-block w3-green w3-section w3-padding"
                  type="submit"
                  v-on:click="handleSignup"
                  v-bind:disabled="inValidForm">
                  Create Account
                </button>
                <button
                  onclick="document.getElementById('signup').style.display='none'"
                  type="button"
                  class="w3-button w3-block w3-section w3-grey w3-padding">
                  Cancel
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Password from 'vue-password-strength-meter';
import {
  isValidEmail,
  isValidFullName,
  isValidatePassword,
} from '../../api/controllers/validators';

export default {
  name: 'Signup',
  components: { Password },
  data() {
    return {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      TCagree: false,
      rememberMe: true,
      inValidForm: true,
      validInputs: [],
      customBorder: {
        fullName: {
          border: '1px solid #ccc',
        },
        email: {
          border: '1px solid #ccc',
        },
        password: {
          border: '1px solid #ccc',
        },
        confirmPassword: {
          border: '1px solid #ccc',
        },
      },
    };
  },
  computed: {
    ...mapState('auth', {
      message: state => state.message,
      hasMessage: state => state.fromSignup,
      jwtToken: state => state.jwtToken,
    }),
  },
  methods: {
    handleSignup(event) {
      event.preventDefault();
      const names = this.fullName.trim().split(' ');

      const credentails = {
        firstname: names[0],
        lastname: (names[2]) ? names[2] : names[1],
        othernames: (names[2]) ? names[1] : '',
        email: this.email,
        password: this.password,
        rememberMe: this.rememberMe,
      };
      this.$store.dispatch('auth/signup', credentails);
    },
    // we are not using the mapping below yet
    ...mapActions('auth', [
      'signup',
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

      // // handle the cases when othername is empty
      // if (field !== 'otherNames') {
      //   const othernameIndex = validInputs.indexOf('otherNames');
      //   if (othernameIndex === -1) {
      //     validInputs.push('otherNames');
      //   }
      // }
      this.validInputs = validInputs;

      // disable the submit button when every field are not valid
      if (validInputs.length === 5) {
        this.inValidForm = false;
      } else {
        this.inValidForm = true;
      }
    },
  },
  watch: {
    fullName(val) {
      if (!isValidFullName(val)) {
        this.checkForm('fullName', 'remove');
      } else {
        this.checkForm('fullName', 'add');
      }
    },
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
    confirmPassword(val) {
      if (val !== this.password) {
        this.checkForm('confirmPassword', 'remove');
      } else {
        this.checkForm('confirmPassword', 'add');
      }
    },
    jwtToken(val) {
      if (val) {
        document.getElementById('login').style.display = 'none';
      }
    },
    TCagree(val) {
      /* eslint-disable no-console */
      console.log('val', val);
      if (val) {
        this.checkForm('TCagree', 'add');
      } else {
        this.checkForm('TCagree', 'remove');
      }
    },
  },
};
</script>

<style scoped>
.Password {
  max-width: 100% !important;
  margin: 0 auto;
}
a {
  display: inline;
  color: #2C98F0;
  font-size: larger;
  float: none;
}
.signup{
  cursor: pointer;
}
.signupText {
  font-size: smaller;
  float:right;
  margin-right: 0px;
  padding: 5px;
  text-decoration: underline;
}
.signupText:hover {
  font-size: larger;
}
</style>
