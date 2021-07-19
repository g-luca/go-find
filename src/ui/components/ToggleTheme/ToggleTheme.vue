<template>
  <div
    class="text-md mx-2 my-1 rounded-xl"
    :class="[active ? 'bg-gray-100 dark:bg-denim-900 ' : 'text-gray-700 dark:text-gray-100', 'block text-md']"
  >
    <button
      type="button"
      aria-label="Theme Mode"
      class=" px-4 py-2 w-full text-left"
      @click="toggleTheme()"
    >
      <span class="h-auto align-middle justify-items-center">
        <span
          v-if="$store.state.ThemeModule.activeTheme === 'light'"
          :class="[active ? 'text-denim-700':'']"
        >
          <i class="bi bi-moon-fill" />
          Dark Theme
        </span>
        <span
          v-else
          :class="[active ? 'text-yellow-300':'']"
        >
          <i class="bi bi-sun-fill" />
          Light Theme
        </span>
      </span>
    </button>
  </div>
</template>

<script lang="ts" src="./ToggleTheme.ts"/>

<style></style>