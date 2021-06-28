// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  // apiUrl: "http://206.189.224.74:8080/CCMS3",       // DEV DO
  // apiUrl: "https://testcms.ttlawcourts.org/CCMS3",     // TEST
  apiUrl: "http://localhost:8080",
  mockUrl: "assets/mockData/",
  trafficApiUrl: 'https://trafapi.ttlawcourts.org:10443',

  allowDeleteLookupItems: false,
  allowResetPasswordFeature: true,
  allowAdminWorkflowFeature: true,
  allowAdminCalendarFeature: true,
  allowJudgeAssignMgmtFeature: true,

  VERSION: require('../../package.json').version
};
