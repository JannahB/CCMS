export const environment = {
  production: true,
  // apiUrl: "https://childcms.ttlawcourts.org/CCMS3",       // PROD
  // apiUrl: "http://tt-qa.eastus2.cloudapp.azure.com/CCMS3",       // QA
  apiUrl: "http://tt-dev.eastus2.cloudapp.azure.com/CCMS3",       // DEV
  mockUrl: "assets/mockData/",

  allowDeleteLookupItems: false,
  allowResetPasswordFeature: true,
  allowAdminWorkflowFeature: true,
  allowAdminCalendarFeature: false,
  allowJudgeAssignMgmtFeature: false,

  VERSION: require('../../package.json').version
};
