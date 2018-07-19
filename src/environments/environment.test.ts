// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: "https://testcms.ttlawcourts.org/CCMS3",  // TEST
  mockUrl: "assets/mockData/",

  allowDeleteLookupItems: false,
  allowResetPasswordFeature: false,
  allowAdminWorkflowFeature: true,
  allowAdminCalendarFeature: false,


  VERSION: require('../../package.json').version
};
