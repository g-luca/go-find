<template>
  <div>
    <AppHeader />
    <div class="md:pt-3 w-full dark:bg-denim-900 bg-gray-50">
      <span v-if="$store.state.AccountModule.userLoadingStatus>=0">
        <section>
          <!-- Profile Heading -->
          <div class="grid grid-cols-12 pt-8">
            <div class="md:col-start-1 md:col-span-4 col-span-12 my-auto md:pl-8">
              <span v-if="$store.state.AccountModule.userLoadingStatus">
                <img
                  alt="cover"
                  :src="$store.state.AccountModule._user.profileCover || 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='"
                  class="mx-auto object-cover w-full max-h-80 md:rounded-t-2xl pointer-events-none select-none"
                >
                <img
                  alt="avatar"
                  :src="$store.state.AccountModule._user.profilePic || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'"
                  class="mx-auto object-cover rounded-full h-44 w-44 md:h-56 md:w-56 pointer-events-none select-none -mt-32"
                >
              </span>

              <span v-else>
                <SkeletonLoader
                  shape="circle"
                  class="mx-auto object-cover rounded-full h-36 md:h-48 w-36 md:w-48 pointer-events-none select-none"
                />
              </span>
            </div>

            <!-- edit account -->
            <Form
              v-slot="{ errors, meta }"
              class="md:col-start-5 md:col-span-7 col-span-12 my-auto pt-8 md:pl-8"
              :validation-schema="formSchema"
            >
              <div class="w-full text-center md:text-left dark:text-white">
                <span v-if="$store.state.AccountModule.userLoadingStatus">
                  <div class="py-1">
                    <h2 class="text-brand font-bold text-4xl">
                      @{{ $store.state.AccountModule._user.username }}
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
                        :disabled="isExecutingTransaction"
                        class=" rounded-lg flex-1 appearance-none border w-full py-2 px-4 my-1 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
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
                        :disabled="isExecutingTransaction"
                        class=" rounded-lg flex-1 appearance-none border w-full py-2 px-4 my-1 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
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
                        :disabled="isExecutingTransaction"
                        class=" rounded-lg flex-1 appearance-none border w-full py-2 px-4 my-1 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
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
                        :disabled="isExecutingTransaction"
                        class=" rounded-lg flex-1 appearance-none border w-full py-2 px-4 my-1 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base border focus:outline-none"
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
                    <div
                      v-if="!isExecutingTransaction&&(meta.valid&&meta.touched&&meta.dirty)"
                      class="flex items-center justify-between gap-4 mt-6"
                    >
                      <button
                        type="button"
                        :disabled="isExecutingTransaction"
                        class="py-2 px-4 w-9/12 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                        @click="submitEdit()"
                      >
                        Save changes
                      </button>
                      <button
                        type="reset"
                        class="py-2 px-4 w-3/12 bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                      >
                        Cancel
                      </button>
                    </div>

                  </div>
                </span>
                <span v-else>
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

                </span>
              </div>
            </Form>
          </div>
        </section>

        <section>
          <div class="pt-8" />
        </section>
      </span>
      <span v-else>
        <Error404 :message="'Ops, someething went wrong'" />
      </span>
      <AppFooter />
    </div>
    <ModalTransaction
      :is-open="isExecutingTransaction"
      :tx="tx"
      @tx-response="handleTxResponse"
    />
  </div>
</template>

<script lang="ts" src="./ViewAccount.ts"/>