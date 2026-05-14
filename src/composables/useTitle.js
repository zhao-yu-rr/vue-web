import { watch } from 'vue'

/**
 * 动态设置页面标题的组合式函数
 * @param {import('vue').Ref<string> | string} title - 页面标题
 */
export function useTitle(title) {
  const setTitle = (val) => {
    document.title = val ? `${val} - Vue Web` : 'Vue Web'
  }

  if (typeof title === 'string') {
    setTitle(title)
  } else {
    setTitle(title.value)
    watch(title, setTitle, { immediate: true })
  }
}
