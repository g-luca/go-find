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
      <LinkBlockSample :username="inputUsername" />

      <!-- Username -->
      <div>
        <label
          class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl"
          for="inputUsername"
        >Choose your <span class="text-brand">username</span></label>

        <div class="mt-1 relative rounded-md shadow-sm">
          <input
            id="inputUsername"
            v-model="inputUsername"
            :class="{'border-red-700 dark:border-red-700': !isValidUsername&&isTouched||(!isUsernameAvailable&&isValidUsername),
                     'border-green-700 dark:border-green-700': isValidUsername&&isUsernameAvailable&&!isVerifyingUsernameAvailability, 
                     'focus:border-brand dark:border-gray-700': !isTouched}"
            type="text"
            required="required"
            class="relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-300 
                text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 text-sm md:text-xl
                dark:bg-denim-900 dark:placeholder-gray-600 dark:text-white"
            placeholder="Username"
            @input="validateUsername()"
          >
          <div
            v-if="isValidUsername"
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <div v-if="isVerifyingUsernameAvailability">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-brand"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <div v-if="isUsernameAvailable&&!isVerifyingUsernameAvailability">
              <i class="bi bi-check-circle text-green-700" />
            </div>
            <div v-else-if="!isVerifyingUsernameAvailability">
              <!-- Username already taken-->
              <i class="bi bi-x-circle text-red-700" />
            </div>
          </div>
        </div>
        <div
          v-if="!isValidUsername&&isTouched"
          class="text-red-700 text-sm px-2 pt-2 font-light"
        >
          <p>Usernames must be 3-30 characters, can contains numbers and underscores.</p>
        </div>
        <div
          v-if="isValidUsername&&!isUsernameAvailable"
          class="text-red-700 text-sm px-2 pt-2 font-light"
        >
          <p>This username is already taken.</p>
        </div>
      </div>
      <!-- ePassword -->
      <div>
        <label
          class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl"
          for="inputEPassword"
        >Password</label>
        <input
          id="inputEPassword"
          :key="validatePassword()"
          v-model="inputEPassword"
          :class="{'border-red-700': !isValidEPassword&&isTouched,'border-green-700': isValidEPassword, 'focus:border-brand dark:border-gray-700': !isTouched}"
          type="password"
          required="required"
          class="relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-300 
                text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 text-sm md:text-xl
                dark:bg-denim-900 dark:placeholder-gray-600 dark:text-white"
          placeholder="Password"
        >
        <div
          v-if="!isValidEPassword&&isTouched"
          class="text-red-700 text-sm px-2 pt-2 font-light"
        >
          <p>Password must be at least 10 characters, contains a special character and an uppercase letter.</p>
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

      <!-- ePassword Confirm -->
      <div>
        <label
          class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl"
          for="inputEPasswordConfirm"
        >Confirm password</label>
        <input
          id="inputEPasswordConfirm"
          :key="validatePasswordConfirm()"
          v-model="inputEPasswordConfirm"
          :class="{'border-red-700': !isEPasswordEqual&&isTouched,'border-green-700': isEPasswordEqual, 'focus:border-brand dark:border-gray-700': !isTouched}"
          type="password"
          required="required"
          class="relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-300 
                text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 text-sm md:text-xl
                dark:bg-denim-900 dark:placeholder-gray-600 dark:text-white"
          placeholder="Confirm password"
        >
        <div
          v-if="!isEPasswordEqual&&isTouched"
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
          @click="setUserInfo()"
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
        
<script lang="tsx" src="./RegisterFormUser.ts"/>
