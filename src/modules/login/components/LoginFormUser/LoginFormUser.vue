<template>
  <div class="">
    <div class="mt-8 space-y-6 w-11/12 xl:w-1/2 mx-auto">
      <div class="text-gray-500 text-sm">
        <router-link
          to="/"
          tag="button"
        >
          <i class="bi bi-arrow-left" /> Home
        </router-link>
      </div>

      <!-- DTag -->
      <div>
        <span>
          <label
            class="dark:text-gray-50 text-gray-800 pb-4 font-medium text-xl"
            for="dtag"
          >Your <span class="text-brand">dtag</span></label>
          <input
            id="dtag"
            v-model="inputDtag"
            :class="{'border-red-700 dark:border-red-700 ': hasLoginError, 'focus:border-brand dark:border-gray-700': !isTouched}"
            type="text"
            required="required"
            class="relative block w-full px-3 py-2 mt-2 border border-gray-300 dark:border-gray-500 placeholder-gray-300 
                text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 text-sm md:text-xl
                dark:bg-denim-900 dark:placeholder-gray-600 dark:text-white"
            placeholder="Dtag"
          >
        </span>
        <span v-if="isLoginWithAddress">
          <label
            class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl mt-10"
            for="address"
          >Address</label>
          <input
            id="address"
            v-model="inputAddress"
            :class="{'border-red-700 dark:border-red-700 ': hasLoginError, 'focus:border-brand dark:border-gray-700': !isTouched}"
            type="text"
            required="required"
            class="relative block w-full px-3 py-2 mt-2 border border-gray-300 dark:border-gray-500 placeholder-gray-300 
                text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 text-sm md:text-xl
                dark:bg-denim-900 dark:placeholder-gray-600 dark:text-white"
            placeholder="Address"
          >
        </span>

        <p
          v-if="!isLoginWithAddress"
          class="dark:text-gray-200"
        >
          If you still haven't created a Desmos Profile, <span
            class="text-brand cursor-pointer"
            @click="toggleAddressLogin()"
          >
            <u> Sign In with your address</u>
          </span>
        </p>
        <p
          v-else
          class="dark:text-gray-200"
        >
          I already have created a Desmos Profile, <span
            class="text-brand cursor-pointer"
            @click="toggleAddressLogin()"
          >
            <u> Sign In with your dtag</u>
          </span>
        </p>
      </div>

      <!-- Password -->
      <div>
        <label
          class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl"
          for="ePassword"
        >Password</label>
        <input
          id="ePassword"
          v-model="inputEPassword"
          :class="{'border-red-700 dark:border-red-700': hasLoginError, 'focus:border-brand dark:border-gray-700': !isTouched}"
          type="password"
          required="required"
          class="relative block w-full px-3 py-2 mt-2 border border-gray-300 dark:border-gray-500 placeholder-gray-300 
                text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 text-sm md:text-xl
                dark:bg-denim-900 dark:placeholder-gray-600 dark:text-white"
          placeholder="Password"
        >
      </div>

      <div>
        <button
          v-if="inputEPassword.length>3&&inputDtag.length>3&&(!isLoginWithAddress||(isLoginWithAddress&&inputAddress.length>10))"
          :disabled="isLoading===0"
          type="button"
          class="relative block w-full justify-center py-2 px-4 border border-transparent text-md rounded-md font-extrabold
               text-white bg-brand opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-denim-900 focus:ring-brand"
          @click="signin()"
        >
          <span v-if="isLoading!==0">
            Continue
          </span>
          <span v-else>
            Loading...
          </span>
          <span class="absolute right-0 inset-y-0 flex items-center pr-3">
            <i class="bi bi-arrow-right" />
          </span>
        </button>

        <span v-if="isLoading===-1">
          <p class="font-semibold text-lg pt-2 dark:text-white">
            <i class="bi bi-exclamation-circle-fill text-red-500" /> Wrong dtag or password.
          </p>
        </span>
      </div>
    </div>
  </div>
</template>
        
<script lang="tsx" src="./LoginFormUser.ts"/>
