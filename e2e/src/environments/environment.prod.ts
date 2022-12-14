export const environment = {
  production: true,
  apiUrl: "https://cms.ttlawcourts.org/CCMS3",       // PROD
  mockUrl: "assets/mockData/",

  allowDeleteLookupItems: false,
  allowResetPasswordFeature: true,
  allowAdminWorkflowFeature: true,
  allowAdminCalendarFeature: false,
  allowJudgeAssignMgmtFeature: false,
  trafficApiUrl: "{{build.trafapiurl}}",

  VERSION: require('../../package.json').version
};
