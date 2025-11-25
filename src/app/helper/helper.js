 export const formatDate = (date, locale = 'en-US', options = {}) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;


  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return d.toLocaleDateString(locale, { ...defaultOptions, ...options });
}