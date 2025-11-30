export const formatText = (value: string) =>
  value.trim().replace(/\s+/g, " ");

export const toTitleCase = (value: string) =>
  formatText(value).replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );

export const normalizeCategory = (value: string) =>
  formatText(value).toLowerCase();
