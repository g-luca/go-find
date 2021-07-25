<template>
  <footer class="bg-white dark:bg-gray-900 py-8 px-5 dark:text-white">
    <div class="grid grid-cols-12">
      <div class="col-span-4 md:col-span-2 my-auto text-center py-2">
        <a
          class="px-4 font-medium hover:underline hover:cursor-pointer text-lg"
          href="https://github.com/g-luca/go-find/issues/new"
          target="_blank"
        >Support</a>
      </div>

      <div class="col-span-4 md:col-span-2 my-auto text-center py-2">
        <a class="px-4 font-medium hover:underline hover:cursor-pointer text-lg">F.A.Q.</a>
      </div>

      <div class="col-span-12 md:col-span-4 text-center my-auto hidden md:inline">
        <img
          src="@/assets/brands/go-find/logo.svg"
          class="mx-auto object-cover h-10 w-10 rounded-md"
        >
      </div>

      <div class="col-span-4 md:col-span-2 my-auto text-center py-2">
        <a
          class="px-4 font-medium hover:underline hover:cursor-pointer text-lg"
          href="https://github.com/g-luca/go-find"
          target="_blank"
        >Contribute</a>
      </div>

      <div class="col-span-12 md:col-span-2 my-auto text-center py-2">
        <a
          class="px-4 font-medium hover:underline hover:cursor-pointer text-lg"
          href="https://morpheus.desmos.network/validators/desmosvaloper16c60y8t8vra27zjg2arlcd58dck9cwn7lhp6pl"
          target="_blank"
        >Staking</a>
      </div>
    </div>

    <div class="grid grid-cols-12 mt-8 pt-6 border-t-2 dark:border-gray-800">
      <div class="col-span-12 md:col-span-4 my-auto text-center py-1">
        <h5 class="px-4">
          © 2021 Go-find.me
        </h5>
      </div>
      <div class="col-span-12 md:col-span-4 text-center text-gray-400 my-auto py-1">
        <h5>
          Because we
          <i class="bi bi-heart-fill w-5 h-5 text-red-600 inline pb-1" />
          Open Source
        </h5>
        <h4>We do not use cookies 🍪</h4>
      </div>

      <div class="col-span-12 md:col-span-4 text-center py-1 my-auto">
        <div class="px-4">
          <ToggleLanguage />
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" src="./AppFooter.ts"/>