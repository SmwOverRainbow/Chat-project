import axios from 'axios';
import * as filter from 'leo-profanity';

const apiPath = '/api/v1';
export const pathTo = {
  login: () => [apiPath, 'login'].join('/'),
  signup: () => [apiPath, 'signup'].join('/'),
  getData: () => [apiPath, 'data'].join('/'),
};

export const loadDictionaries = () => {
  filter.loadDictionary('ru');
  filter.loadDictionary('en');
};

export const getData = async (token) => {
  const response = await axios.get(pathTo.getData(), { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
};

export const isProfanity = (str) => filter.check(str);

export const getCensoredMessage = (message) => (
  isProfanity(message) ? filter.clean(message) : message
);
