export class UserDTO {

  partyOID: string = "";
  firstName:string = "";
  lastName: string = "";
  password: string = "";
  userName: string = "";
  emails: any[] = [];          // [{emailAddress:"foo@bar.com"}]
  authorizedCourts:any[] // [{ "courtOID":"5", "roles":[ {"staffRoleOID":"1"} ]} ]}

}
