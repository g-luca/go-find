<template>
  <div>
    <button
      type="button"
      aria-label="Color Mode"
      class="text-red-50 mr-4 focus:outline-none align-middle"
      @click="toggleTheme()"
    >
      <span class="text-gray-400 h-auto align-middle justify-items-center">
        <i
          v-if="$store.state.ThemeModule.activeTheme === 'light'"
          class="bi bi-moon-fill w-6 hover:text-gray-900"
        />

        <i
          v-else
          class="bi bi-sun-fill w-6 hover:text-yellow-200"
        />
      </span>
    </button>
  </div>
</template>

<script lang="ts" src="./ToggleTheme.ts"/>

<style></style>