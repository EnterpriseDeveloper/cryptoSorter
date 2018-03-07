// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDVDV2RbMXIH7ztLvTNCP0R_jI8EBsuGUk",
    authDomain: "cryptosorter.firebaseapp.com",
    databaseURL: "https://cryptosorter.firebaseio.com",
    projectId: "cryptosorter",
    storageBucket: "",
    messagingSenderId: "219154312948"
  }
};
