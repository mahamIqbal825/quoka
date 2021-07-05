import i18n from "i18n-js";
import memoize from "lodash.memoize";
import { I18nManager } from 'react-native';
import * as RNLocalize from "react-native-localize";

export const translationGetters = {
  'en': () => require('../translations/en.json'),
  'ta': () => require('../translations/ta.json'),
};

export const translate = memoize(
  (key, config) =>
    i18n.t(key, config).includes('missing') ? key : i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export const setI18nConfig = (lang) => {
    // fallback if no available language fits
    const fallback = { languageTag: "en", isRTL: false };
  
    const { languageTag, isRTL } =
      RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
      fallback;
    translate.cache.clear();
    I18nManager.forceRTL(isRTL);
    i18n.translations = { [lang || languageTag]: translationGetters[lang || languageTag]() };
    i18n.locale = lang || languageTag;
};