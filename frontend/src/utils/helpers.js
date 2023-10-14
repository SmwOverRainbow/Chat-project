import axios from 'axios';
import * as filter from 'leo-profanity';

filter.loadDictionary('ru');
filter.add('какашка');

export const getData = async (token) => {
  try {
    const response = await axios.get('/api/v1/data', { headers: { 'Authorization': `Bearer ${token}` }});
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

export const isProfanity = (str) => filter.check(str);

export const getCensoredMessage = (message) => isProfanity(message) ? filter.clean(message) : message;
