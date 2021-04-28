<template>
  <div>
    <div class="inline">
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium bg-gray-300 rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        @click="openModal"
      >
        󠁧󠁢󠁥󠁮🇬🇧 &nbsp; English
      </button>
    </div>
    <Dialog
      :open="isOpen"
      @close="closeModal"
    >
      <div class="fixed inset-0 z-10 overflow-y-auto bg-opacity-50 bg-gray-500">
        <div class="min-h-screen px-4 text-center">
          <span class="inline-block h-screen align-middle"> &#8203; </span>

          <div class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
            <DialogTitle class="text-2xl font-medium leading-6 text-gray-900 dark:text-white">
              <span class="flex">
                <div class="flex-1">Select Language</div>
                <div class="flex-auto text-right">
                  <button>
                    <i
                      class="bi bi-x h-7 w-7"
                      @click="closeModal()"
                    />
                  </button>
                </div>
              </span>
            </DialogTitle>
            <RadioGroup v-model="language">
              <RadioGroupOption
                v-for="lang in langs"
                :key="lang"
                v-slot="{}"
                value="english"
                class="my-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg"
                :class="{ 'ring-2 ring-offset-blue-400': lang.isSelected }"
              >
                <div class="w-full flex my-auto">
                  <span class="flex-1 px-4 dark:text-white my-auto font-bold">{{ lang.name }}</span>
                  <span
                    v-if="lang.isSelected"
                    class="flex-end px-4 dark:text-white inline"
                  >
                    <i class="bi bi-check-circle w-10 h-10 text-seagreen-500" />
                  </span>
                </div>
              </RadioGroupOption>
            </RadioGroup>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" src="./ToggleLanguage.ts"/>
