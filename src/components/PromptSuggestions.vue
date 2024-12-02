<template>
    <div class="mt-4 space-y-2" v-if="suggestions.length">
      
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(suggestion, index) in suggestions"
          :key="index"
          class="px-3 py-1 text-sm text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200"
          @click="$emit('suggestionClick', suggestion)"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    lastBotMessage: {
      type: String,
      required: true
    }
  })
  
  const suggestions = computed(() => {
    if (!props.lastBotMessage) return []
    
    const suggestions = []

    // Check for numbers or statistics
    if (props.lastBotMessage.match(/\d+/)) {
      suggestions.push("Can you explain these numbers in more detail?")
      suggestions.push("How does this compare to industry standards?")
    }
    
    // Check for technical terms or concepts
    if (props.lastBotMessage.match(/\b(api|function|component|service|database|interface)\b/i)) {
      suggestions.push("Could you provide an example of how this works?")
      suggestions.push("What are the best practices for implementing this?")
    }
    
    // Check for recommendations or solutions
    if (props.lastBotMessage.match(/\b(should|could|recommend|suggest|try|consider)\b/i)) {
      suggestions.push("What are the potential drawbacks to this approach?")
      suggestions.push("Are there any alternatives we should consider?")
    }
    
    // Check for error-related content
    if (props.lastBotMessage.match(/\b(error|bug|issue|problem|fix)\b/i)) {
      suggestions.push("How can we prevent this issue in the future?")
      suggestions.push("What are the common causes of this problem?")
    }
    
    // Add general follow-up questions if we have few suggestions
    if (suggestions.length < 2) {
      suggestions.push("Can you provide more details about this?")
      suggestions.push("What are the next steps we should take?")
    }
    
    return [...new Set(suggestions)].slice(0, 3)
  })
  
  defineEmits(['suggestionClick'])
  </script>