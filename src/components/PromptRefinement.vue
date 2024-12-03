<template>
  <div v-if="refinedPrompts.length > 0" class="prompt-refinement mt-2">
    <p class="text-sm text-gray-600 mb-2">Suggested improvements:</p>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="(prompt, index) in refinedPrompts"
        :key="index"
        @click="$emit('select-prompt', prompt)"
        class="text-sm px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
      >
        {{ prompt }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  refinedPrompts: {
    type: Array,
    default: () => []
  }
});

defineEmits(['select-prompt']);
</script> 