import { Schema } from 'mongoose';

const subSet = (a, b) => new Set([...a].filter(x => !b.has(x)));

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

export const calcLinkAndUnlinkTags = (
  old: Schema.Types.ObjectId[],
  current: Schema.Types.ObjectId[],
): [Schema.Types.ObjectId[], Schema.Types.ObjectId[]] => {
  const OLD = new Set(old.map(item => item.toString()));
  const CURRENT = new Set(current.map(item => item.toString()));

  const UNLINK_TAGS = subSet(OLD, CURRENT);
  const LINK_TAGS = subSet(CURRENT, OLD);
  return [Array.from(UNLINK_TAGS), Array.from(LINK_TAGS)];
};
