<template>
  <div class="">
    <div class="mt-8 space-y-6 w-11/12 xl:w-1/2 mx-auto">
      <div class="text-gray-500 text-sm">
        <router-link
          to="/"
          tag="button"
        >
          <i class="bi bi-arrow-left" /> Cancel
        </router-link>
      </div>
      <LinkBlockSample :username="inputUsername" />

      <!-- Username -->
      <div class="rounded-md shadow-sm ">
        <div>
          <label class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl">Choose your <span class="text-brand">username</span></label>
          <input
            :key="validateUsername()"
            v-model="inputUsername"
            :class="{'border-red-700': !isValidUsername&&isTouched,'border-green-700': isValidUsername, 'focus:border-brand dark:border-gray-700': !isTouched}"
            type="text"
            required="required"
            class="relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 
                text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 text-sm md:text-xl
                dark:bg-denim-900 dark:placeholder-gray-300 dark:text-white"
            placeholder="Username"
          >
        </div>
        <div
          v-if="!isValidUsername&&isTouched"
          class="text-red-700 text-sm px-2 pt-2 font-light"
        >
          <p>Usernames must be 3-30 characters, can contains numbers and underscores.</p>
        </div>
      </div>

      <!-- Password -->
      <div class="rounded-md shadow-sm ">
        <div>
          <label class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl">Password</label>
          <input
            :key="validatePassword()"
            v-model="inputPassword"
            :class="{'border-red-700': !isValidPassword&&isTouched,'border-green-700': isValidPassword, 'focus:border-brand dark:border-gray-700': !isTouched}"
            type="password"
            required="required"
            class="relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 
                text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 text-sm md:text-xl
                dark:bg-denim-900 dark:placeholder-gray-300 dark:text-white"
            placeholder="Password"
          >
        </div>
        <div
          v-if="!isValidPassword&&isTouched"
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

      <!-- Password Confirm -->
      <div class="rounded-md shadow-sm ">
        <div>
          <label class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl">Confirm password</label>
          <input
            :key="validatePasswordConfirm()"
            v-model="inputPasswordConfirm"
            :class="{'border-red-700': !isPasswordEqual&&isTouched,'border-green-700': isPasswordEqual, 'focus:border-brand dark:border-gray-700': !isTouched}"
            type="password"
            required="required"
            class="relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 
                text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 text-sm md:text-xl
                dark:bg-denim-900 dark:placeholder-gray-300 dark:text-white"
            placeholder="Confirm password"
          >
        </div>
        <div
          v-if="!isPasswordEqual&&isTouched"
          class="text-red-700 text-sm px-2 pt-2 font-light"
        >
          <p>Passwords are not equals.</p>
        </div>
      </div>

      <div>
        <button
          type="button"
          class="relative block w-full justify-center py-2 px-4 border border-transparent text-md rounded-md font-extrabold
               text-white bg-brand opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
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
