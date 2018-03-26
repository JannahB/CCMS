export class Permission {

  courtOID: number;
  permissionID: number;
  permissionName: string;
  permissionOID: number;

  public static readonly CASE_DETAILS_MAIN: number = 1001;
  public static readonly ADD_CASE_PARTY: number = 1002;
  public static readonly VIEW_CASE_PARTY: number = 1003;
  public static readonly CREATE_CASE: number = 2000;
  public static readonly UPDATE_CASE: number = 2001;
  public static readonly CREATE_PARTY: number = 3000;
  public static readonly UPDATE_PARTY: number = 3001;
  public static readonly CREATE_JUDICIAL_ASSIGNMENT: number = 4000;
  public static readonly UPDATE_JUDICIAL_ASSIGNMENT: number = 4001;
  public static readonly CREATE_CASE_HEARING: number = 4050;
  public static readonly UPDATE_CASE_HEARING: number = 4051;
  public static readonly CREATE_TASK: number = 4100;
  public static readonly UPDATE_TASK: number = 4101;

}
