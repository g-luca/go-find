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

      <div class="pb-4 w-full text-center font-semibold">
        <h6
          class="dark:text-white cursor-pointer select-none"
          @click="setSignupWithDesmosProfile(!$store.state.RegisterModule.hasDesmosProfile)"
        >
          <span v-if="!$store.state.RegisterModule.hasDesmosProfile">
            Already have a <span class="text-brand">Desmos Profile</span>?
          </span>
          <span v-else>
            Don't have a <span class="text-brand">Desmos Profile</span>?
          </span>
        </h6>
      </div>

      <Form
        v-slot="{ errors, meta }"
        :validation-schema="formSchema"
      >
        <!-- Dtag -->
        <div>
          <label
            class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl"
            for="dtag"
          > <span v-if="!$store.state.RegisterModule.hasDesmosProfile">
              Choose your
            </span>
            <span v-else>
              Your Desmos profile
            </span>
            <span class="text-brand">dtag</span>
          </label>

          <div class="mt-1 relative rounded-md shadow-sm">
            <Field
              id="dtag"
              v-model="inputDtag"
              :class="{'border-red-700 dark:border-red-700': meta.dirty && (errors.dtag || !isDtagAvailable),
                       'focus:border-brand dark:border-gray-700 ': !errors.dtag}"
              type="text"
              name="dtag"
              class=" rounded-lg border w-full py-2 px-4 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
              placeholder="Dtag"
              @input="validateDtag()"
            />
            <div
              v-if="isValidDtag"
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10"
            >
              <div v-if="isVerifyingDtagAvailability">
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
              <div v-if="isDtagAvailable&&!isVerifyingDtagAvailability">
                <i class="bi bi-check-circle text-green-700" />
              </div>
              <div v-else-if="!isVerifyingDtagAvailability">
                <!-- Dtag already taken-->
                <i class="bi bi-x-circle text-red-700" />
              </div>
            </div>
          </div>
          <div
            v-if="errors.dtag"
            class="text-red-700 text-sm px-2 pt-2 font-light"
          >
            <p>Dtags must be 3-30 characters, can contains numbers and underscores.</p>
          </div>
          <div
            v-if="isValidDtag&&!isDtagAvailable"
            class="text-red-700 text-sm px-2 pt-2 font-light"
          >
            <p>This dtag is already taken.</p>
          </div>
        </div>

        <!-- ePassword -->
        <div class="py-3">
          <label
            class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl"
            for="ePassword"
          >Password</label>
          <Field
            id="ePassword"
            v-model="inputEPassword"
            name="ePassword"
            :class="{'border-red-700 dark:border-red-700': meta.dirty && errors.ePassword,
                     'focus:border-brand dark:border-gray-700 ': !errors.ePassword}"
            type="password"
            class=" rounded-lg border w-full py-2 px-4 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
            placeholder="Password"
          />
          <div
            v-if="errors.ePassword"
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
        <div class="py-3">
          <label
            class="dark:text-gray-50 text-gray-800 pb-2 font-medium text-xl"
            for="ePasswordConfirm"
          >Confirm password</label>
          <Field
            id="ePasswordConfirm"
            v-model="inputEPasswordConfirm"
            name="ePasswordConfirm"
            :class="{'border-red-700 dark:border-red-700': meta.dirty && errors.ePasswordConfirm,
                     'focus:border-brand dark:border-gray-700 ': !errors.ePasswordConfirm}"
            type="password"
            class=" rounded-lg border w-full py-2 px-4 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
            placeholder="Confirm password"
          />
          <div
            v-if="errors.ePasswordConfirm"
            class="text-red-700 text-sm px-2 pt-2 font-light"
          >
            <p>Passwords are not equals.</p>
          </div>
        </div>

        <div
          v-if="meta.valid&&isDtagAvailable"
          class="py-3"
        >
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
      </Form>
    </div>
  </div>
</template>
        
<script lang="tsx" src="./RegisterFormUser.ts"/>
