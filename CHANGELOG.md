# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.9.4"></a>
## [1.9.4](https://bitbucket.org/natcenterstatecourts/acts-fe/compare/v1.9.3...v1.9.4) (2018-10-15)


### Bug Fixes

* **scheduling:** fix for save hearing failing validation ([e1c82d8](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/e1c82d8))
* **scheduling:** one more fix for save hearing ([e42e9f0](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/e42e9f0))



<a name="1.9.3"></a>
## [1.9.3](https://bitbucket.org/natcenterstatecourts/acts-fe/compare/v1.9.2...v1.9.3) (2018-10-09)


### Bug Fixes

* **Hearings:** fix hearing time blocks ([b784170](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/b784170))


### Features

* **Hearings:** 0 id == post ([867f13e](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/867f13e))
* **Hearings:** new time block  properties ([f39e0a9](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/f39e0a9))



<a name="1.9.2"></a>
## [1.9.2](https://bitbucket.org/natcenterstatecourts/acts-fe/compare/v1.9.1...v1.9.2) (2018-10-07)


### Bug Fixes

* **Judicial Assignment:** add name prop and use new EP ([4cb3553](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/4cb3553))


### Features

* **app:** add childrens logo ([7f62430](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/7f62430))
* **Hearing:** display other hearings time blocks ([5d4a9db](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/5d4a9db))
* **Hearings:** add hearing location to list items ([292cbe5](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/292cbe5))
* **Hearings:** show all case hearings in cal, use calendar format ([6619b04](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/6619b04))
* **Hearings:** show holiday blocks in hearings schedule ([e355ca5](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/e355ca5))



<a name="1.9.1"></a>
## [1.9.1](https://bitbucket.org/natcenterstatecourts/acts-fe/compare/v1.9.0...v1.9.1) (2018-09-21)


### Bug Fixes

* **Calendar:** remove max-height on p-datatable ([74b3650](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/74b3650))
* **Hearing:** new heaings showing 2x in list AC-338, AC-339 ([bc988dd](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/bc988dd))


### Features

* **Hearing:** delete hearing support ([ee3b7c9](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/ee3b7c9))



<a name="1.9.0"></a>
# [1.9.0](https://bitbucket.org/natcenterstatecourts/acts-fe/compare/v1.5.2...v1.9.0) (2018-09-18)


### Bug Fixes

* **app:** remove unused routes ([0a4c7ad](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/0a4c7ad))
* **Calendar:** remove more instances of pesky gray selection box ([7634df7](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/7634df7))
* **Calendar:** replace direct timeblock delete with save parent object ([04e43a1](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/04e43a1))
* **Calendar:** save parent item on delete time block ([1562ec0](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/1562ec0))
* **CourtManager:** add route guard to app module imports ([c98fc4c](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/c98fc4c))
* **env:** change comment tag to javascript valid tag ([fc1f127](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/fc1f127))
* **Hearing:** replace Date with DayPilot.Date to neutralize time zone issues ([0c3394b](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/0c3394b))
* **Hearing:** save parent item on time block delete ([fab8413](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/fab8413))
* **Hearings:** remove direct time block delete ([eda0acf](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/eda0acf))
* **Hearings:** remove pesky gray selection box ([303e7e9](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/303e7e9))
* **Menu:** dynamic menu duplicating admin menu ([adedbfa](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/adedbfa))
* **Security:** AC-333 attempt to suppress excessive 500s after a 401 is thrown ([cfd93c4](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/cfd93c4))


### Features

* environment variables set at release time ([ceb4b7f](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/ceb4b7f))
* **app:** cast generic <T> to put and post ([2cd4e42](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/2cd4e42))
* **app:** simplify Table Data menu item ([0374ae4](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/0374ae4))
* **app:** zero-out environment.ts ([dcf594b](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/dcf594b))
* **Assignment:** add allowJudgeAssignMgmtFeature flag ([3db5ab5](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/3db5ab5))
* **AssignmentMgr:** add assignment manager component, routes and menu item ([bfda192](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/bfda192))
* **Calendar:** add text search for cal facilities ([23b07c7](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/23b07c7))
* **Calendar:** add text search for cal resources ([2f5ea9b](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/2f5ea9b))
* **Calendar:** calUtils used by cal-facilities, cal-resources, and hearings ([7a700f4](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/7a700f4))
* **Calendar:** factor out calendar util methods ([5c1b049](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/5c1b049))
* **Calendar:** refactor Facilities to use CourtLocation ([aa45b0a](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/aa45b0a))
* **Calendar:** show saturday on facility calendar ([797cd80](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/797cd80))
* **Calendar:** type cast start/end dates as any to support DayPilot.Date ([c4090c0](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/c4090c0))
* **CaseCounts:** add breadcrumb ([4be98ff](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/4be98ff))
* **CourtManager:** add support for court manager user role ([47ee0c3](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/47ee0c3))
* **CourtManager:** dynamic menu for admin or court manager ([2773e28](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/2773e28))
* **Hearings:** add `tags` property to BaseTimeBlock ([b3941fc](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/b3941fc))
* **Hearings:** add hearing service ([af55d4d](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/af55d4d))
* **Hearings:** bind controls to selectedHearing ([6fd5394](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/6fd5394))
* **Hearings:** facility unavailable layer ([821c8b4](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/821c8b4))
* **Hearings:** format blocked hour cells for location and judge ([ffcaa98](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/ffcaa98))
* **Hearings:** got baseline enities and service working w legacy EPs. ([4101a30](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/4101a30))
* **Hearings:** hearings component to support new lookups and hearing entity ([21209fa](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/21209fa))
* **Hearings:** initialize caseHearing data on instantiation ([e5047f8](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/e5047f8))
* **Hearings:** make name field settable to support first/last name concat ([cdd8503](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/cdd8503))
* **Hearings:** refactor entities to support new proper definitions ([bcdd66f](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/bcdd66f))
* **Hearings:** refactor unavailableBlocks EP ([47f00fd](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/47f00fd))
* **Hearings:** save caseHearing sans time blocks ([3f4cbdf](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/3f4cbdf))
* **Hearings:** serialize outbound dates as Zulu ([989f9d5](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/989f9d5))
* **Hearings:** set instantiation defaults on casehearing entity ([5014516](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/5014516))
* **Hearings:** setup getUnavailableBlocks() ([da5424d](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/da5424d))
* **Hearings:** support post & put with single save() service method ([3f46867](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/3f46867))
* **lookups:** Changing mockup calls to actual EPs ([38b2e3e](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/38b2e3e))
* **PdfViewer:** add placeholder for pdfViewer pages ([d1cfd81](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/d1cfd81))
* **Pipeline:** exit on empty config object to allow ENVs to work during development ([6cd37ce](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/6cd37ce))
* **Schedule:** add legend ([cb01063](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/cb01063))
* **Schedule:** ligter style ([eec0854](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/eec0854))
* **Schedule:** save hearing on all time block edits ([7096488](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/7096488))
* **Scheduling:** initial hearings page controls layout ([7eb1b3a](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/7eb1b3a))
* **Scheduling:** initial wiring of hearings component ([15dbf95](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/15dbf95))



<a name="1.5.2"></a>
## [1.5.2](https://bitbucket.org/natcenterstatecourts/acts-fe/compare/v1.5.1...v1.5.2) (2018-08-07)


### Bug Fixes

* **Ftab:** remove ref to CaseCount entity ([4e3a900](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/4e3a900))



<a name="1.5.1"></a>
## [1.5.1](https://bitbucket.org/natcenterstatecourts/acts-fe/compare/v1.5.0...v1.5.1) (2018-08-07)


### Bug Fixes

* **Docs:** fix text version of doc url ([6d17319](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/6d17319))
* **Ftab:** fix casesClosedYear empty values ([3f61be3](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/3f61be3))


### Features

* **Ftab:** add Case Counts Report ([7d49a9b](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/7d49a9b))
* **Ftab:** add chart to case counts report ([db17692](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/db17692))
* **Ftab:** add year selector ([bf45c4f](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/bf45c4f))



<a name="1.5.0"></a>
# [1.5.0](https://bitbucket.org/natcenterstatecourts/acts-fe/compare/v1.4.6...v1.5.0) (2018-07-27)



<a name="1.4.6"></a>
## [1.4.6](https://bitbucket.org/natcenterstatecourts/acts-fe/compare/v1.4.5...v1.4.6) (2018-07-27)


### Bug Fixes

* **Calendar:** fix error when multiday is false ([1e0222b](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/1e0222b))
* **Holiday:** refresh list when adding or deleting ([cb8d28a](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/cb8d28a))


### Features

* **Holiday:** holiday name filter ([0446ef3](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/0446ef3))
* **Holiday:** holidays are a single day by default and only multiple if users choose.  ability to filter holidays by year ([106e15a](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/106e15a))
* **Holidays:** crud operations for holidays ([f47c88a](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/f47c88a))



<a name="1.4.5"></a>
## [1.4.5](https://bitbucket.org/natcenterstatecourts/acts-fe/compare/v1.4.3...v1.4.5) (2018-07-23)


### Bug Fixes

* merge conflicts ([b6d76e1](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/b6d76e1))
* standardize apiUrl; turn on feature flags; ([88722ec](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/88722ec))
* **Case:** fix doc upload URL ([a9efe55](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/a9efe55))
* **ENV:** add testcrim domain ([028f1b3](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/028f1b3))
* **Workflow:** clarify labels ([094d321](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/094d321))


### Features

* add crim-test ENV ([409b50f](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/409b50f))
* do not require login on 500 error ([bf396a0](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/bf396a0))
* **Calendar:** add cal resources and holidays pages ([ecaff9f](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/ecaff9f))
* **Calendar:** allow time block ID to persist all the way to the database ([e7982e4](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/e7982e4))
* **Calendar:** apply template to facility week ([dfdbd3c](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/dfdbd3c))
* **Calendar:** apply this week to next week functionality; autosave time blocks ([7433273](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/7433273))
* **Calendar:** auto label new time blocks; rename time block; updateList assignment ([cd1ffc7](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/cd1ffc7))
* **Calendar:** calendar section setup ([e6200d9](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/e6200d9))
* **Calendar:** Calendar Template features ([bf5b5d9](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/bf5b5d9))
* **Calendar:** complete Calendar feature ([7b11e48](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/7b11e48))
* **Calendar:** custom calendar theme ([943ae50](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/943ae50))
* **Calendar:** facility hours page 80% complete ([fa8407e](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/fa8407e))
* **Calendar:** formatting ([2869a69](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/2869a69))
* **Calendar:** handle delete template and fix double time block issue ([24b8bf4](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/24b8bf4))
* **Calendar:** move POST/PUT logic and  serialization service ([6710d61](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/6710d61))
* **Calendar:** prevent block overlap ([1425a16](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/1425a16))
* **Calendar:** propagate cal-template code changes to cal-facility ([133234c](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/133234c))
* **Calendar:** remove duration label from time block ([818c887](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/818c887))
* **Calendar:** resource calendar section ([5e102d7](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/5e102d7))
* **FullName:** sample change for AC-280 ([bcc1bb0](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/bcc1bb0))
* **Organization:** fullname/org support for party search, party detail, case search and case detail ([256199e](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/256199e))
* **Organization Party:** Modify UI to allow Organization and Party Full Name ([8741778](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/8741778))
* **Organization Party:** timezone modification ([91fe8d0](https://bitbucket.org/natcenterstatecourts/acts-fe/commits/91fe8d0))



# Change Log


## [1.4.3](https://bitbucket.org/reurgency/ccms-fe2/compare/v1.4.2...v1.4.3) (2018-05-18)

* **Workflow:** integrate workflow with new Java Endpoints


## [1.4.2](https://bitbucket.org/reurgency/ccms-fe2/compare/v1.4.1...v1.4.2) (2018-05-18)

### Features

* **Workflow:** turn on workflow feature flag


## [1.4.1](https://bitbucket.org/reurgency/ccms-fe2/compare/v1.4.0...v1.4.1) (2018-05-18)


### Bug Fixes

* **Workflow:** first last name pipe on parties.id ([b603629](https://bitbucket.org/reurgency/ccms-fe2/commits/b603629))


### Features

* **Workflow:** slim party and staffpool calls ([e70fd49](https://bitbucket.org/reurgency/ccms-fe2/commits/e70fd49))



# [1.4.0](https://bitbucket.org/reurgency/ccms-fe2/compare/v1.3.2...v1.4.0) (2018-05-11)


### Bug Fixes

* **Workflow:** fix a few minor glitches ([505cae5](https://bitbucket.org/reurgency/ccms-fe2/commits/505cae5))
* **Workflow:** fix auto-complete implementation ([3ad851b](https://bitbucket.org/reurgency/ccms-fe2/commits/3ad851b))


### Features

* **Workflow:** add new task type and assign resource pool ([3279533](https://bitbucket.org/reurgency/ccms-fe2/commits/3279533))
* **Workflow:** replace document dd with autocomplete ([bd514b6](https://bitbucket.org/reurgency/ccms-fe2/commits/bd514b6))
* **Workflow:** save of workflow ([442b4c0](https://bitbucket.org/reurgency/ccms-fe2/commits/442b4c0))
* **Workflow:** sort by time delay ([b3bd8b3](https://bitbucket.org/reurgency/ccms-fe2/commits/b3bd8b3))



## [1.3.2](https://bitbucket.org/reurgency/ccms-fe2/compare/v1.3.1...v1.3.2) (2018-05-04)


### Features

* **Admin Workflow:** add feature flag for Workflow feature ([3bd9b4b](https://bitbucket.org/reurgency/ccms-fe2/commits/3bd9b4b))
* **Event Workflow:** saving workflow ([a97b18a](https://bitbucket.org/reurgency/ccms-fe2/commits/a97b18a))
* **Reset Pwd:** add feature flag for reset password feature ([21f467d](https://bitbucket.org/reurgency/ccms-fe2/commits/21f467d))
* **Users:** style improvements to request reset pwd page ([2577974](https://bitbucket.org/reurgency/ccms-fe2/commits/2577974))
* **Users:** style improvements to submit new pwd page ([06d3449](https://bitbucket.org/reurgency/ccms-fe2/commits/06d3449))
* **Workflow:**  implement get calls and some UI functionality ([88f2081](https://bitbucket.org/reurgency/ccms-fe2/commits/88f2081))
* **Workflow:** add workflow navigation ([c5dfe0c](https://bitbucket.org/reurgency/ccms-fe2/commits/c5dfe0c))



## [1.3.1](https://bitbucket.org/reurgency/ccms-fe2/compare/v1.3.0...v1.3.1) (2018-04-25)


### Bug Fixes

* **Component:** stabilize autocomplete display label ([7d990a5](https://bitbucket.org/reurgency/ccms-fe2/commits/7d990a5))
* **custom select:** line 1 is invisible when no data in line 2 ([e898168](https://bitbucket.org/reurgency/ccms-fe2/commits/e898168))


### Features

* **Reset Password:** reset password functionality ([27490ea](https://bitbucket.org/reurgency/ccms-fe2/commits/27490ea))



# [1.3.0](https://bitbucket.org/reurgency/ccms-fe2/compare/v1.2.3...v1.3.0) (2018-04-18)


### Features

* **autocomplete:** create two lines in the custom-autocomplete option list ([28e7292](https://bitbucket.org/reurgency/ccms-fe2/commits/28e7292))
* **Case Charge:** allow users to select only the local charge and auto-populate all of the other iccs codes based on the local charge ([b90e1aa](https://bitbucket.org/reurgency/ccms-fe2/commits/b90e1aa))
* **Components:** update auto-complete so that it accepts an item renderer template and custom filter function ([26a80fe](https://bitbucket.org/reurgency/ccms-fe2/commits/26a80fe))



# Change Log

All notable changes to this project will be documented in this file. 


## [1.2.3](https://bitbucket.org/reurgency/ccms-fe2/compare/v1.2.2...v1.2.3) (2018-03-28)


### Features

* **app:** add version to footer ([ce44723](https://bitbucket.org/reurgency/ccms-fe2/commits/ce44723))
* **app:** app versioning ([75a8a9c](https://bitbucket.org/reurgency/ccms-fe2/commits/75a8a9c))




## [1.2.2](https://bitbucket.org/reurgency/ccms-fe2/compare/v1.2.1...v1.2.2) (2018-03-27)


### Bug Fixes

* **Security:** adjust permissions ([c6c13e3](https://bitbucket.org/reurgency/ccms-fe2/commits/c6c13e3))




## [1.2.1](https://bitbucket.org/reurgency/ccms-fe2/compare/v1.2.0...v1.2.1) (2018-03-27)


### Bug Fixes

* **Security:** user with full permission could not create new case ([3d2f2d3](https://bitbucket.org/reurgency/ccms-fe2/commits/3d2f2d3))


### Features

* **app:** persist selected court thru browser refresh ([4a20718](https://bitbucket.org/reurgency/ccms-fe2/commits/4a20718))
* **Security:** apply permissions to Party pages AC-206 ([7edb5ac](https://bitbucket.org/reurgency/ccms-fe2/commits/7edb5ac))




# [1.2.0](https://bitbucket.org/reurgency/ccms-fe2/compare/v1.1.0...v1.2.0) (2018-03-26)


### Features

* **Security:** add static permission types ([bba76d5](https://bitbucket.org/reurgency/ccms-fe2/commits/bba76d5))
* **Security:** apply permissions to Case page AC-123 ([3eb6f2f](https://bitbucket.org/reurgency/ccms-fe2/commits/3eb6f2f))
* **Security:** mod user security to take courtOID as arg ([c4abf93](https://bitbucket.org/reurgency/ccms-fe2/commits/c4abf93))



# [1.1.0](https://bitbucket.org/reurgency/ccms-fe2/compare/v1.0.7...v1.1.0) (2018-03-26)


### Features

* **app:** make all datatables scrollable ([d50f6f4](https://bitbucket.org/reurgency/ccms-fe2/commits/d50f6f4))
* **Case:** stage delete hearing support (NOTE: waiting on EP) ([cfe2969](https://bitbucket.org/reurgency/ccms-fe2/commits/cfe2969))
* **Security:** add permission types in prep for applying permissions ([74b14f6](https://bitbucket.org/reurgency/ccms-fe2/commits/74b14f6))
* **Security:** send user to login page on 500 ([623ceec](https://bitbucket.org/reurgency/ccms-fe2/commits/623ceec))



## [1.0.7](https://bitbucket.org/reurgency/ccms-fe2/compare/v1.1.0...v1.0.7) (2018-03-21)


### Bug Fixes

* **Case:** add caseCaption to serializer ([e125098](https://bitbucket.org/reurgency/ccms-fe2/commits/e125098))


### Features

* **app:** gracefully handle 403 & 500 errors ([1feeb84](https://bitbucket.org/reurgency/ccms-fe2/commits/1feeb84))



## [1.0.6](https://bitbucket.org/reurgency/ccms-fe2/compare/v1.1.0...v1.0.6) (2018-03-21)

### Features

* **Case:** add caseCaption field ([1d91cb2](https://bitbucket.org/reurgency/ccms-fe2/commits/1d91cb2))
* **Files:** increase file size to 20MB ([68cd3d0](https://bitbucket.org/reurgency/ccms-fe2/commits/68cd3d0))
