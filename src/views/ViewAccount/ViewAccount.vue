<template>
  <div>
    <AppHeader />
    <div class="md:pt-3 w-full dark:bg-denim-900 bg-gray-50">
      <span v-if="$store.state.AccountModule.userLoadingStatus>=0">
        <!-- Profile Heading -->
        <section>
          <div class="grid grid-cols-12 pt-8">
            <!-- Profile Pic -->
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
            <div class="md:col-start-5 md:col-span-7 col-span-12 my-auto pt-8 md:pl-8">
              <div class="w-full text-center md:text-left dark:text-white">
                <span v-if="$store.state.AccountModule.userLoadingStatus">
                  <div class="py-1">
                    <h2 class="text-brand font-bold text-4xl">
                      @{{ $store.state.AccountModule._user.username }}
                    </h2>
                  </div>

                  <form id="edit">
                    <div class="font-bold text-xl px-4 md:px-0">
                      <div class="py-2">
                        <label
                          for="nickname"
                          class="text-gray-700 dark:text-white py-9"
                        >
                          Nickname
                        </label>
                        <input
                          id="nickname"
                          v-model="inputNickname"
                          type="text"
                          :disabled="isExecutingTransaction"
                          :class="{'border-red-700 dark:border-red-700': !isInputNicknameValid&&isInputNicknameEdited,
                                   'border-green-700 dark:border-green-700': isInputNicknameValid&&isInputNicknameEdited, 
                                   'focus:border-brand dark:border-gray-700': !isInputNicknameEdited}"
                          class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 dark:border-gray-900 w-full py-2 px-4 my-1 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                          name="nickname"
                          placeholder="Nickname"
                          @input="validateInputNickname()"
                        >
                      </div>
                      <div class="py-2">
                        <label
                          for="profilePic"
                          class="text-gray-700 dark:text-white"
                        >
                          Profile picture
                        </label>
                        <input
                          id="profilePic"
                          v-model="inputProfilePic"
                          type="text"
                          :disabled="isExecutingTransaction"
                          :class="{'border-red-700 dark:border-red-700': !isInputProfilePicValid&&isInputProfilePicEdited,
                                   'border-green-700 dark:border-green-700': isInputProfilePicValid&&isInputProfilePicEdited, 
                                   'focus:border-brand dark:border-gray-700': !isInputProfilePicEdited}"
                          class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 dark:border-gray-900 w-full py-2 px-4 my-1 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                          name="profilePic"
                          placeholder="https://profile-picture.com/image.png"
                          @input="validateInputProfilePic()"
                        >
                      </div>
                      <div class="py-2">
                        <label
                          for="profileCover"
                          class="text-gray-700 dark:text-white"
                        >
                          Cover
                        </label>
                        <input
                          id="profileCover"
                          v-model="inputProfileCover"
                          type="text"
                          :disabled="isExecutingTransaction"
                          :class="{'border-red-700 dark:border-red-700': !isInputProfileCoverValid&&isInputProfileCoverEdited,
                                   'border-green-700 dark:border-green-700': isInputProfileCoverValid&&isInputProfileCoverEdited, 
                                   'focus:border-brand dark:border-gray-700': !isInputProfileCoverEdited}"
                          class=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 dark:border-gray-900 w-full py-2 px-4 my-1 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                          name="profileCover"
                          placeholder="https://profile-cover.com/image.png"
                          @input="validateInputProfileCover()"
                        >
                      </div>
                      <div class="py-2">
                        <label
                          for="bio"
                          class="text-gray-700 dark:text-white"
                        >
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          v-model="inputBio"
                          :disabled="isExecutingTransaction"
                          class="flex-1 appearance-none border border-gray-300 dark:border-gray-900 w-full py-2 px-4 my-1 bg-white dark:bg-gray-800 dark:text-gray-200 text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                          placeholder="Your incredible bio"
                          name="bio"
                          rows="3"
                          cols="40"
                          @input="validateInputBio()"
                        />

                      </div>

                      <div
                        v-if="!isExecutingTransaction&&((isInputNicknameEdited&&isInputNicknameValid)||(isInputProfilePicEdited&&isInputProfilePicValid)||(isInputProfileCoverEdited&&isInputProfileCoverValid)||(isInputBioEdited&&isInputBioValid))"
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
                          type="button"
                          class="py-2 px-4 w-3/12 bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                          @click="cancelEdit()"
                        >
                          Cancel
                        </button>
                      </div>

                    </div>
                  </form>
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
            </div>
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