<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const route = useRoute()

const layoutMap = {
  default: DefaultLayout,
  auth: AuthLayout,
}

const layoutComponent = computed(() => {
  const layout = route.meta?.layout || 'default'
  return layoutMap[layout] || DefaultLayout
})
</script>

<template>
  <component :is="layoutComponent" />
</template>
