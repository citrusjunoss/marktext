import i18next from 'i18next';
import i18nBackend from 'i18next-electron-fs-backend';
 import whitelist from './whitelist.js';

// On Mac, the folder for resources isn't
// in the same directory as Linux/Windows;
// https://www.electron.build/configuration/contents#extrafiles
const isMac = window.api.i18nextElectronBackend.clientOptions.platform === "darwin";
const isDev = window.api.i18nextElectronBackend.clientOptions.environment === "development";
const prependPath = isMac && !isDev ? window.api.i18nextElectronBackend.clientOptions.resourcesPath : ".";

i18next
  .use(i18nBackend)
  .init({
    backend: {
      loadPath: prependPath + "/app/localization/locales/{{lng}}/{{ns}}.json",
      addPath: prependPath + "/app/localization/locales/{{lng}}/{{ns}}.missing.json",
      contextBridgeApiKey: "api" // needs to match first parameter of contextBridge.exposeInMainWorld in preload file; defaults to "api"
    },
    debug: false,
    namespace: "translation",
    saveMissing: true,
    saveMissingTo: "current",
    lng: "en",
    fallbackLng: false, // set to false when generating translation files locally
    supportedLngs: whitelist.langs
  });

window.api.i18nextElectronBackend.onLanguageChange((args) => {
  i18n.changeLanguage(args.lng, (error, _t) => {
    if (error) {
      console.error(error);
    }
  });
});

export default function (app) {
  app.use(I18NextVue, { i18next });
  return app
}
