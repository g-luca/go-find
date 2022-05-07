<template>
  <div class="rounded-2xl bg-denim-900 dark:bg-gray-900 my-8 w-auto">
    <span class="flex pt-3 pb-3">
      <img
        src="public/assets/brands/go-find/logo.svg"
        class="object-cover h-10 w-10 ml-4"
      >
      <p class="h-auto align-middle text-white font-mono text-2xl pl-4 pt-1 ital break-all truncate">
        <span class="hidden lg:inline">go-find.me/</span><span class="text-brand">{{ username }}</span>/{{
          link
        }}
      </p>
    </span>
  </div>
</template>

<script lang="ts" src="./LinkBlockSample"/>