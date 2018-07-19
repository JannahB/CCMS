export const environment = {
  production: true,
  apiUrl: "https://cms.ttlawcourts.org/CCMS3",       // PROD
  mockUrl: "assets/mockData/",

  allowDeleteLookupItems: false,
  allowResetPasswordFeature: false,
  allowAdminWorkflowFeature: true,
  allowAdminCalendarFeature: false,


  VERSION: require('../../package.json').version
};
