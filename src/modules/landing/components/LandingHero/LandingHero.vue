<template>
  <div class="dark:bg-denim-900 bg-royalblue-50">
    <section class="px-2 lg:px-0 flex w-full container mx-auto py-16">
      <div class="w-full dark:text-white flex justify-center md:justify-start text-center md:text-left">
        <div class="md:w-1/2 w-full">
          <h2 class="leading-none font-bold text-4xl xs:text-2x1 md:text-7xl lg:6x1 uppercase md:pt-20">
            One username <span class="text-brand">for everything.</span>
          </h2>
          <h5 class="leading text-gray-500 text-2xl">
            One username to rule them all.
          </h5>

          <div class="py-8">
            <LinkBlockSample
              class="xl:w-9/12"
              :username="'user'"
            />
          </div>

          <div class="container">
            <div class="py-4">
              <router-link
                to="/register"
                class="bg-brand rounded-3xl py-4 px-8 text-3xl font-bold uppercase focus:outline-none text-white"
              >
                get started
              </router-link>
            </div>
            <div class="pt-1">
              <router-link
                to="/login"
                class="dark:text-white text-black text pl-2 font-bold focus:outline-none"
              >
                Already registered? <span class="text-brand">Login</span>
              </router-link>
            </div>
          </div>
        </div>
        <div class="md:w-1/2 md:justify-center md:flex hidden">
          <img
            src="@/assets/illustrations/landing/landing-link.svg"
            alt="Link Background"
          >
        </div>
      </div>
    </section>

    <section class="bg-gray-900 py-4">
      <div class="container mx-auto sm:flex-row flex-col flex text-center">
        <div class="sm:w-1/2 w-full py-4">
          <img
            src="@/assets/brands/github/logo.svg"
            fillColor="yellow"
            class="w-24 h-24 mx-auto mb-2"
          >
          <a
            class="italic text-white hover:underline cursor-pointer text-center mt-3 font-semibold text-2xl"
            href="https://github.com/g-luca/go-find"
            target="_blank"
          >Open Source</a>
          <p class="italic text-gray-500 text-center mb-3 mt-1">
            All the code is public, no secrets.<br>Open to anyone who wants to contribute.
          </p>
        </div>

        <div class="sm:w-1/2 w-full py-4">
          <img
            src="@/assets/brands/desmos/logo.svg"
            class="w-24 h-24 mx-auto mb-2"
          >
          <a
            class="italic text-white hover:underline cursor-pointer text-center mt-3 font-semibold text-2xl"
            href="https://desmos.network"
            target="_blank"
          >Desmos Blockchain</a>
          <p class="italic text-gray-500 text-center mb-3 mt-1">
            Running on decentralized social networks blockchain.<br>Trusted, Secure, Privacy
            first.
          </p>
        </div>
      </div>
    </section>

    <!--  <section class="bg-gray-800 py-32">
      <div class="container mx-auto">
        <h1 class="text-5xl font-bold uppercase text-center text-gray-300">Features</h1>
        <div class="flex justify-center">
          <p class="w-1/2 text-center text-gray-300">This template was designed based on input from personal development coaches and popular trainers so it offers all</p>
        </div>
      </div>
    </section> -->
  </div>
</template>

<script lang="ts" src="./LandingHero.ts" />