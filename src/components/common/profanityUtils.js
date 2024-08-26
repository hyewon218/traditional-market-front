export const PROFANITY_LIST = [
  '비속어',

  // 추가 비속어를 여기에 추가
];

export function containsProfanity(text) {
  const regex = new RegExp(PROFANITY_LIST.join('|'), 'i');
  return regex.test(text);
}