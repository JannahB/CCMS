// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: "http://localhost:8080",                // LOCAL
  // apiUrl: "https://criminal-dev-oj.ttlawcourts.org/CCMS3",     // TEST
  mockUrl: "assets/mockData/",
  trafficApiUrl: 'https://trafapi.ttlawcourts.org:10443',


  allowDeleteLookupItems: false,
  allowResetPasswordFeature: true,
  allowAdminWorkflowFeature: true,
  allowAdminCalendarFeature: true,
  allowJudgeAssignMgmtFeature: true,

  VERSION: require('../../package.json').version
};
