import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales/ru.js';

const init = async () => {

  // Перенести сюда сокеты !!! 

  const i18nextInstance = i18n.createInstance();
  await i18nextInstance
    .use(initReactI18next)
    .init({
      lng: 'ru',
      debug: true,
      resources,
    })
};

export default init;
