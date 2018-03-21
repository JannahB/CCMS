// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  // apiUrl: "http://209.10.74.232/CCMS3/",                // DEV
  apiUrl: "http://68.169.61.22/CCMS3/",                // DEV
  mockUrl: "assets/mockData/",

  allowDeleteLookupItems: false
};
