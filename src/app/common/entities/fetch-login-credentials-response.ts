export class FetchLoginCredentialsResponse{
    //Lots of other properties are returned here.  For the purpose of login, all I care about is "roles"
    //in which each role will have a couortOID property
    public roles:any[];
}