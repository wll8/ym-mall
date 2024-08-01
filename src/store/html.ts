import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHtmlStore = defineStore(
  'html',
  () => {
    const base = () => ({
      title: ``,
      content: ``,
    })
    const html = ref(base())
    const setHtml = (value) => {
      html.value = value
    }
    const reset = () => {
      html.value = base()
    }
    const getHtml = () => {
      return html.value
    }
    return {
      html,
      getHtml,
      reset,
      setHtml,
    }
  },
  {
    persist: true,
  },
)
