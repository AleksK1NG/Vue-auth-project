<template>
  <div id="signup">
    <div class="signup-form">
      <form @submit.prevent="onSubmit">
        <div class="input" :class="{invalid: $v.email.$error}">
          <label for="email">Mail</label>
          <input
            @blur="$v.email.$touch()"
            type="email"
            id="email"
            v-model="email">
          <p v-if="!$v.email.email">Please enter correct email</p>
        </div>
        <div class="input" :class="{invalid: $v.age.$error}">
          <label for="age">Your Age</label>
          <input
            @blur="$v.age.$touch()"
            type="number"
            id="age"
            v-model.number="age">
          <p v-if="!$v.age.minValue">Min age is {{ $v.age.$params.minValue.min }}</p>
        </div>
        <div class="input" :class="{invalid: $v.password.$error}">
          <label for="password">Password</label>
          <input
            @blur="$v.password.$touch()"
            type="password"
            id="password"
            v-model="password">
        </div>
        <div class="input" :class="{invalid: $v.confirmPassword.$error}">
          <label for="confirm-password">Confirm Password</label>
          <input
            @blur="$v.confirmPassword.$touch()"
            type="password"
            id="confirm-password"
            v-model="confirmPassword">
        </div>
        <div class="input">
          <label for="country">Country</label>
          <select id="country" v-model="country">
            <option value="usa">Russia</option>
            <option value="india">USA</option>
            <option value="uk">UK</option>
            <option value="germany">Germany</option>
          </select>
        </div>
        <div class="hobbies">
          <h3>Add some Hobbies</h3>
          <button @click="onAddHobby" type="button">Add Hobby</button>
          <div class="hobby-list">
            <div
              :class="{invalid: $v.hobbyInputs.$each[index].$error}"
              class="input"
              v-for="(hobbyInput, index) in hobbyInputs"
              :key="hobbyInput.id">
              <label :for="hobbyInput.id">Hobby #{{ index }}</label>
              <input
                @blur="$v.hobbyInputs.$each[index].value.$touch()"
                type="text"
                :id="hobbyInput.id"
                v-model="hobbyInput.value">
              <button @click="onDeleteHobby(hobbyInput.id)" type="button">X</button>
              <p v-if="!$v.hobbyInputs.minLength">You have {{$v.hobbyInputs.$params.minLength.min}} hobbies, min 1 need</p>
            </div>
          </div>
        </div>
        <div class="input inline" :class="{invalid: $v.terms.$invalid}">
          <input
            @change="$v.terms.$touch()"
            type="checkbox"
            id="terms"
            v-model="terms">
          <label for="terms">Accept Terms of Use</label>
        </div>
        <div class="submit">
          <button type="submit" :disabled="$v.$invalid">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

import { required, email, numeric, minValue, minLength, sameAs, requiredUnless } from 'vuelidate/lib/validators'
  import axios from 'axios'
  export default {
    data: () => {
      return {
        email: '',
        age: null,
        password: '',
        confirmPassword: '',
        country: 'Russia',
        hobbyInputs: [],
        terms: false
      }
    },
    validations: {
      email: {
        required: required,
        email: email,
        unique: (value) => {
          if (value === '') return true
          return axios.get('/user.json?orderBy="email"&equalTo="' + value + '"')
            .then(res => {
              console.log(res);
              return Object.keys(res.data).length === 0
            })
        },
      },
      age: {
        required,
        numeric,
        minValue: minValue(18),
      },
      password: {
        required: required,
        minLength: minLength(6),
      },
      confirmPassword: {
        sameAs: sameAs('password')
      },
      terms: {
        required: requiredUnless(vm => {
          return vm.country === 'Russia'
        }),
      },
      hobbyInputs: {
        minLength: minLength(1),
        $each: {
          value: {
            required,
            minLength: minLength(4)
          }
        }
      },
    },
    methods: {
      onAddHobby () {
        const newHobby = {
          id: Math.random() * Math.random() * 1000,
          value: ''
        };
        this.hobbyInputs.push(newHobby)
      },
      onDeleteHobby (id) {
        this.hobbyInputs = this.hobbyInputs.filter(hobby => hobby.id !== id)
      },
      onSubmit () {
        const formData = {
          email: this.email,
          age: this.age,
          password: this.password,
          confirmPassword: this.confirmPassword,
          country: this.country,
          hobbies: this.hobbyInputs.map(hobby => hobby.value),
          terms: this.terms
        };
        console.log(formData);
        this.$store.dispatch('signUp', formData)
      }
    }
  }
</script>

<style scoped>
  .signup-form {
    width: 400px;
    margin: 30px auto;
    border: 1px solid #eee;
    padding: 20px;
    box-shadow: 0 2px 3px #ccc;
  }

  .input {
    margin: 10px auto;
  }

  .input label {
    display: block;
    color: #4e4e4e;
    margin-bottom: 6px;
  }

  .input.inline label {
    display: inline;
  }

  .input input {
    font: inherit;
    width: 100%;
    padding: 6px 12px;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }

  .input.inline input {
    width: auto;
  }

  .input input:focus {
    outline: none;
    border: 1px solid #521751;
    background-color: #eee;
  }

  .input.invalid label {
   color: red;
  }

  .input.invalid input {
    border: 1px solid red;
    background-color: #ffc9aa;
  }

  .input select {
    border: 1px solid #ccc;
    font: inherit;
  }

  .hobbies button {
    border: 1px solid #521751;
    background: #521751;
    color: white;
    padding: 6px;
    font: inherit;
    cursor: pointer;
  }

  .hobbies button:hover,
  .hobbies button:active {
    background-color: #8d4288;
  }

  .hobbies input {
    width: 90%;
  }

  .submit button {
    border: 1px solid #521751;
    color: #521751;
    padding: 10px 20px;
    font: inherit;
    cursor: pointer;
  }

  .submit button:hover,
  .submit button:active {
    background-color: #521751;
    color: white;
  }

  .submit button[disabled],
  .submit button[disabled]:hover,
  .submit button[disabled]:active {
    border: 1px solid #ccc;
    background-color: transparent;
    color: #ccc;
    cursor: not-allowed;
  }

</style>