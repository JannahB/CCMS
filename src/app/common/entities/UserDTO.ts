export class UserDTO {

  partyOID: string = "";
  firstName:string = "";
  lastName: string = "";
  password: string = "";
  userName: string = "";
  email: string = "";
  authorizedCourts:any[] // [{ "courtOID":"5", "roles":[ {"staffRoleOID":"1"} ]} ]}

}
