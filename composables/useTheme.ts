import { computed, onMounted } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'cookbook-theme'
const LIGHT_THEME_COLOR = '#FAFAF7'
const DARK_THEME_COLOR = '#111312'

export function useTheme() {
  const theme = useState<Theme>('cookbook-theme', () => 'light')
  const initialized = useState('cookbook-theme-initialized', () => false)
  const isDark = computed(() => theme.value === 'dark')

  function applyTheme(nextTheme: Theme, persist: boolean) {
    theme.value = nextTheme

    if (!import.meta.client) return

    const root = document.documentElement
    root.classList.toggle('dark', nextTheme === 'dark')
    root.style.colorScheme = nextTheme

    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    themeColor?.setAttribute(
      'content',
      nextTheme === 'dark' ? DARK_THEME_COLOR : LIGHT_THEME_COLOR
    )

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, nextTheme)
      } catch {
        // The selected theme still applies for this page when storage is unavailable.
      }
    }
  }

  function initialize() {
    if (!import.meta.client || initialized.value) return

    applyTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light', false)
    initialized.value = true
  }

  function toggleTheme() {
    initialize()
    applyTheme(isDark.value ? 'light' : 'dark', true)
  }

  onMounted(initialize)

  return {
    theme,
    isDark,
    toggleTheme,
  }
}
