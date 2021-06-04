<template>
  <div class="">
    <div class="mt-8 space-y-6 w-11/12 xl:w-1/2 mx-auto">
      <div class="text-gray-500 text-sm">
        <button @click="goBack()">
          <i class="bi bi-arrow-left" /> Change username
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
      <div>
        <label
          class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl"
          for="inputMPassword"
        >Password</label>
        <input
          id="inputMPassword"
          :key="validateMPassword()"
          v-model="inputMPassword"
          :class="{'border-red-700': !isValidMPassword&&isTouched,'border-green-700': isValidMPassword, 'focus:border-brand dark:border-gray-700': !isTouched}"
          type="password"
          required="required"
          class="relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-300 
                text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 text-sm md:text-xl
                dark:bg-denim-900 dark:placeholder-gray-600 dark:text-white"
          placeholder="Password"
        >
        <div
          v-if="!isValidMPassword&&isTouched"
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
      <div>
        <label
          class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl"
          for="inputMPasswordConfirm"
        >Confirm password</label>
        <input
          id="inputMPasswordConfirm"
          :key="validateMPasswordConfirm()"
          v-model="inputMPasswordConfirm"
          :class="{'border-red-700': !isMPasswordEqual&&isTouched,'border-green-700': isMPasswordEqual, 'focus:border-brand dark:border-gray-700': !isTouched}"
          type="password"
          required="required"
          class="relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-300 
                text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 text-sm md:text-xl
                dark:bg-denim-900 dark:placeholder-gray-600 dark:text-white"
          placeholder="Confirm password"
        >
        <div
          v-if="!isMPasswordEqual&&isTouched"
          class="text-red-700 text-sm px-2 pt-2 font-light"
        >
          <p>Passwords are not equals.</p>
        </div>
      </div>

      <div>
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
    </div>
  </div>
</template>
        
<script lang="tsx" src="./RegisterFormMPassword.ts"/>
