export const toWords = (input: string): string[] => {
  return input
    .trim()
    .replace(/\s{2,}/g, ' ')
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([0-9])([a-zA-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])([0-9])/g, '$1 $2')
    .split(' ');
};

export const toSentence = (input: string): string =>
  input[0].toUpperCase() + input.slice(1);

export const toTitle = (input: string): string =>
  toWords(input).map(toSentence).join(' ');

export const toDuration = (durationMs: number): string => {
  const duration = Math.floor(durationMs / 1000);
  if (duration < 1) {
    return '0s';
  }

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);

  const fragments = [
    hours > 0 ? `${hours}h` : null,
    minutes > 0 ? `${minutes}m` : null,
    seconds > 0 ? `${seconds}s` : null,
  ];

  return fragments.filter(Boolean).join(' ');
};
