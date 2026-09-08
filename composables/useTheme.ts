export const useTheme = () => {
  const theme = useState<'dark' | 'light'>('theme', () => 'dark');

  const initTheme = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('bds_theme') as 'dark' | 'light';
      if (saved) {
        theme.value = saved;
      }
      document.documentElement.setAttribute('data-theme', theme.value);
    }
  };

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    if (import.meta.client) {
      localStorage.setItem('bds_theme', theme.value);
      document.documentElement.setAttribute('data-theme', theme.value);
    }
  };

  return {
    theme,
    initTheme,
    toggleTheme,
  };
};
