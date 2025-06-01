import { defineStore } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  const isDark = useDark({
    selector: 'html', 
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
  })
  const toggleDark = useToggle(isDark)

  const toggleTheme = () => {
    toggleDark()
  }

  return {
    isDark,
    toggleTheme,
  }
})