<template>
  <div class="">
    <div class="mt-8 space-y-6 w-11/12 xl:w-1/2 mx-auto">
      <div class="text-gray-500 text-sm">
        <button @click="goBack()">
          <i class="bi bi-arrow-left" /> Change dtag
        </button>
      </div>

      <!-- mPassword -->
      <div class="pb-2">
        <h2 class="font-bold text-2xl text-brand">
          Wallet Password
        </h2>
        <p class="text-lg pt-1 dark:text-white font-semibold">
          This password is used to provide another layer of encryption to ensure your wallet safety.
        </p>
        <p class="pt-1 dark:text-white">
          In this way no one will have access to your keys, even us! <a
            target="_blank"
            href=""
            class="text-blue-400"
          >Learn more</a>
        </p>
      </div>

      <Form
        v-slot="{ errors, meta }"
        :validation-schema="formSchema"
      >
        <div class="py-3">
          <label
            class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl"
            for="mPassword"
          >Password</label>
          <Field
            id="mPassword"
            v-model="inputMPassword"
            name="mPassword"
            :class="{'border-red-700 dark:border-red-700': meta.dirty && (errors.mPassword||!isValidMPassword),
                     'focus:border-brand dark:border-gray-700 ': !errors.mPassword}"
            type="password"
            class=" rounded-lg border w-full py-2 px-4 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
            placeholder="Wallet Password"
            @input="validateMPassword()"
          />
          <div
            v-if="errors.mPassword||!isValidMPassword"
            class="text-red-700 text-sm px-2 pt-2 font-light"
          >
            <p>Password must be at least 10 characters, contains a special character and an uppercase letter. <span class="underline">Must be different from the other password.</span></p>
            <p>
              Why this requirements? Check it
              <a
                href="https://howsecureismypassword.net/"
                target="_blank"
                class="text-denim-500"
              >here.</a>
            </p>
          </div>
        </div>

        <!-- mPassword Confirm -->
        <div class="py-3">
          <label
            class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl"
            for="mPasswordConfirm"
          >Confirm password</label>
          <Field
            id="mPasswordConfirm"
            v-model="inputMPasswordConfirm"
            name="mPasswordConfirm"
            :class="{'border-red-700 dark:border-red-700': meta.dirty && errors.mPasswordConfirm,
                     'focus:border-brand dark:border-gray-700 ': !errors.mPasswordConfirm}"
            type="password"
            class=" rounded-lg border w-full py-2 px-4 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
            placeholder="Confirm password"
          />
          <div
            v-if="errors.mPasswordConfirm"
            class="text-red-700 text-sm px-2 pt-2 font-light"
          >
            <p>Passwords are not equals.</p>
          </div>
        </div>

        <div
          v-if="meta.valid&&isValidMPassword"
          class="py-3"
        >
          <button
            type="button"
            class="relative block w-full justify-center py-2 px-4 border border-transparent text-md rounded-md font-extrabold
               text-white bg-brand opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 dark:ring-offset-denim-900 focus:ring-offset-2 focus:ring-brand"
            @click="setMPassword()"
          >
            Continue
            <span class="absolute right-0 inset-y-0 flex items-center pr-3">
              <i class="bi bi-arrow-right" />
            </span>
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>
        
<script lang="tsx" src="./RegisterFormMPassword.ts"/>
