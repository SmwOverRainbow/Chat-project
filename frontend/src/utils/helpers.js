import * as filter from 'leo-profanity';

const apiPath = '/api/v1';
export const pathTo = {
  login: () => [apiPath, 'login'].join('/'),
  signup: () => [apiPath, 'signup'].join('/'),
  getData: () => [apiPath, 'data'].join('/'),
};

export const isProfanity = (str) => filter.check(str);
