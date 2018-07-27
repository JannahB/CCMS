# CCMS

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.2. 
Sample change.

## Installation

- cd to dir on local machine where you want the project
- `git clone https://<yourusername>@bitbucket.org/reurgency/ccms-fe2.git`
- cd into the project dir
- `npm intall` to install dependencies
- `npm start` to run app locally and API resolves to the remote DEV server
- `npm run start:local` to run the app locally and API resolves locally on http://127.0.0.1:8080

Run `ng serve` for a DEV server. Navigate to `http://localhost:4800/`. The app will automatically reload if you change any of the source files.


## Development server

Run `npm start` for a DEV server. Navigate to `http://localhost:4800/`. The app will automatically reload if you change any of the source files.
By default, API calls will be made on the `apiUrl` found in `environment.dev.ts`. 

### CORS Avoidance Hack in DEV ENV
#### Disable Security in Chrome Canary on Mac
`open /Applications/Google\ Chrome\ Canary.app --args --user-data-dir="/var/tmp/Chrome dev session" --disable-web-security`

#### Disable Security in Chrome on Mac
`open /Applications/Google\ Chrome.app --args --user-data-dir="/var/tmp/Chrome dev session" --disable-web-security`

#### Disable Security in Chrome on Window:
`"C:\Users\[USER_NAME]\AppData\Local\Google\Chrome SxS\Application\chrome.exe" --disable-web-security --user-data-dir`


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Release
Versioning
Bump Release as major minor or patch (see standard-version)
`npm run release -- --release-as [patch/minor/major]`
*--Or as a specific build--*
`npm run release -- --release-as 1.1.0`
Push Sprint branch to repo


## Build

Run `ng build:test` to build the project for the TEST env. 
Run `ng build:training` to build the project for the TRAIN env. 
Run `ng build:aot` to build the project for the PROD env. 
Build artifacts will be stored in the `dist/` directory for all builds.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
