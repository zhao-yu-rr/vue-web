import { ref, computed } from 'vue'

/**
 * 提供本地计数逻辑的组合式函数
 * @param {number} initialValue - 初始计数值
 * @returns {{ count, doubleCount, increment, decrement, reset }}
 */
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = initialValue
  }

  return { count, doubleCount, increment, decrement, reset }
}
