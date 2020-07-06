export const contentNameConverter = (originName: string): string => {
  const datePattern = new Date().toISOString();
  const datePrefix = datePattern.substr(0, 10);
  const datePostfix = datePattern
    .substr(11, 8)
    .split(':')
    .join('-');
  return `${datePrefix}-${datePostfix}_${originName
    .split(/[ !@#$%^&*()-=+]/gmu)
    .join('_')}`;
};
