<template>
  <section>
    <Form
      v-slot="{ errors, meta, initialValues}"
      :validation-schema="formSchema"
      :initial-values="initialValues"
      @submit="submitEdit"
    >
      <span v-if="$store.state.AccountModule.profileLoadingStatus">
        <div class="w-full text-center md:text-left dark:text-white">
          <div class="pb-4 pt-8">
            <h2 class="dark:text-white font-bold text-5xl">
              Welcome back, <span class="text-brand">{{ $store.state.AccountModule.profile.dtag }}</span>
            </h2>
          </div>

          <div class="font-bold text-xl px-4 md:px-0">
            <div class="py-2">
              <label
                for="nickname"
                class="text-gray-700 dark:text-white py-9"
              >
                Nickname
              </label>
              <Field
                id="nickname"
                v-model="inputNickname"
                type="text"
                class=" rounded-lg flex-1 appearance-none border w-full py-2 px-4 my-1 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
                :class="{'border-red-700 dark:border-red-700': errors.nickname,
                         'focus:border-brand dark:focus:border-brand border-gray-300 dark:border-gray-900': !errors.nickname }"
                name="nickname"
                placeholder="Nickname"
              />
              <span
                v-if="errors.nickname"
                class="text-red-700 text-sm"
              >Invalid Nickname</span>
            </div>
            <div class="py-2">
              <label
                for="profilePic"
                class="text-gray-700 dark:text-white"
              >
                Profile picture
              </label>
              <Field
                id="profilePic"
                v-model="inputProfilePic"
                type="text"
                class=" rounded-lg flex-1 appearance-none border w-full py-2 px-4 my-1 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
                :class="{'border-red-700 dark:border-red-700': errors.profilePic,
                         'focus:border-brand dark:focus:border-brand border-gray-300 dark:border-gray-900': !errors.profilePic }"
                name="profilePic"
                placeholder="https://profile-picture.com/image.png"
              />
              <span
                v-if="errors.profilePic"
                class="text-red-700 text-sm"
              >Invalid image Url</span>
            </div>
            <div class="py-2">
              <label
                for="profileCover"
                class="text-gray-700 dark:text-white"
              >
                Cover
              </label>
              <Field
                id="profileCover"
                v-model="inputProfileCover"
                type="text"
                class=" rounded-lg flex-1 appearance-none border w-full py-2 px-4 my-1 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
                :class="{'border-red-700 dark:border-red-700': errors.profileCover,
                         'focus:border-brand dark:focus:border-brand border-gray-300 dark:border-gray-900': !errors.profileCover }"
                name="profileCover"
                placeholder="https://profile-cover.com/image.png"
              />
              <span
                v-if="errors.profileCover"
                class="text-red-700 text-sm"
              >Invalid image Url</span>
            </div>
            <div class="py-2">
              <label
                for="bio"
                class="text-gray-700 dark:text-white"
              >
                Bio
              </label>
              <Field
                id="bio"
                v-model="inputBio"
                class=" rounded-lg flex-1 appearance-none border w-full py-2 px-4 my-1 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
                :class="{'border-red-700 dark:border-red-700': errors.bio,
                         'focus:border-brand dark:focus:border-brand border-gray-300 dark:border-gray-900': !errors.bio }"
                placeholder="Your incredible bio"
                as="textarea"
                name="bio"
                rows="3"
                cols="40"
              />
              <span
                v-if="errors.bio"
                class="text-red-700 text-sm"
              >Invalid Bio</span>

            </div>
            <div class="grid grid-cols-12 items-center justify-between gap-4 my-6">
              <button
                v-if="$store.state.TransactionModule.transactionStatus!==1&&(meta.valid&&meta.touched&&meta.dirty)"
                type="submit"
                :disabled="$store.state.TransactionModule.transactionStatus===1"
                class="py-2 px-4 col-span-9 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
              >
                Save changes
              </button>
              <button
                v-if="$store.state.TransactionModule.transactionStatus!==1&&(meta.touched&&meta.dirty)"
                type="button"
                :class="{'col-start-10':!meta.valid}"
                class="py-2 px-4 col-span-3 bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                @click="handleResetForm()"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      </span>
      <span v-else>
        <div class="w-full text-center md:text-left dark:text-white py-4">
          <!-- Loading -->
          <SkeletonLoader
            shape="rectangle"
            class="py-1 text-left w-full md:w-1/2 h-12 px-4"
          />
          <SkeletonLoader
            shape="rectangle"
            class="py-1 text-left w-full md:w-2/5 h-10 px-4"
          />
          <SkeletonLoader
            shape="rectangle"
            class="py-1 text-left w-full md:w-5/6 h-10 px-4"
          />
          <SkeletonLoader
            shape="rectangle"
            class="py-1 text-left w-full md:w-5/6 h-10 px-4"
          />
          <SkeletonLoader
            shape="rectangle"
            class="py-1 text-left w-full md:w-4/6 h-24 px-4"
          />

        </div>
      </span>
    </Form>
  </section>
</template>

<script lang="ts" src="./AccountProfileEdit.ts"/>