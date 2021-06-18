<template>
  <div class="">
    <span v-if="shape=='rectangle'">
      <div class="animate-pulse bg-gray-200 dark:bg-gray-500 shadow rounded-xl w-full h-full" />
    </span>

    <span v-if="shape=='circle'">
      <div class="animate-pulse rounded-full bg-gray-200 dark:bg-gray-500 h-full" />
    </span>
  </div>
</template>


<script lang="ts" src="./SkeletonLoader.ts"></script>