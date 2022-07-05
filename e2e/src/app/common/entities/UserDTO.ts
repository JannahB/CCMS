export class UserDTO {

  partyOID = '';
  firstName = '';
  lastName = '';
  password = '';
  userName = '';
  emails: any[] = [];          // [{emailAddress:"foo@bar.com"}]
  authorizedCourts: any[]; // [{ "courtOID":"5", "roles":[ {"staffRoleOID":"1"} ]} ]}

}
