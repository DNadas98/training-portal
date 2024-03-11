## Application progress, To-Do

The backend is mostly finished, currently I am in the process of building the frontend site using
React and Material UI.

#### Unless specified otherwise:

- <strong><big> Backend implementation is already done </big></strong>
- The endpoints are callable from the <a href="https://www.postman.com/cc-tasx/workspace/dnadas98-public/documentation/30693601-1e1610fc-717c-41b5-a3f8-d830165f4325"><strong>Postman collection »</strong></a>
- <strong><big> Frontend infrastructure, logic (contexts, authentication handling, data flow) is
  already
  done </big></strong>
- Only the frontend site building / design is missing for the unchecked items

#### /

- [x] {`public`} view welcome page
- [x] {`public`} sign up
- [x] {`public`} sign in: local
- [x] {`public`} sign in: socials (OAuth2)
- [ ] {`public`} reset password with e-mail
  - Missing from the backend
  - Could work like the existing solution for local registration verification (e.g PasswordResetToken from the abstract VerificationToken)
  - Also needs a redirect page on the frontend like registration verification and oauth2

#### /user

- [x] {`GlobalRole.USER`} view profile details
- [x] {`GlobalRole.USER`} sign out
- [ ] {`GlobalRole.USER`} update username
- [ ] {`GlobalRole.USER`} update password
  - Missing from the backend (simple copy of update username endpoint)
- [ ] {`GlobalRole.USER`} update e-mail address
  - Missing from the backend
  - Should probably only be allowed if a local account is present
  - Old OAuth2 linked accounts should be removed after an e-mail change
- [x] {`GlobalRole.USER`} view list of their UserAccounts (local, google, ...)
- [x] {`GlobalRole.USER`} remove a UserAccount
- [x] {`GlobalRole.USER`} remove all user data (all UserAccounts and ApplicationUser)

#### /companies

- [x] {`GlobalRole.USER`} view list of companies they are member of
- [x] {`GlobalRole.USER`} view list of companies they can request to join
- [x] {`GlobalRole.USER`} add new userGroup
- [x] {`GlobalRole.USER`} request to join userGroup

#### /companies/`:companyId`

- [ ] {`GlobalRole.USER && PermissionType.COMPANY_EMPLOYEE`} view userGroup details
- [ ] {`GlobalRole.USER && PermissionType.COMPANY_ADMIN`} update userGroup details
  - should maybe be userGroup editor (userGroup name and description update)
- [ ] {`GlobalRole.USER && PermissionType.COMPANY_ADMIN`} remove userGroup

#### /companies/`:companyId`/employees

- [ ] {`GlobalRole.USER && PermissionType.COMPANY_ADMIN`} view list of employees
- [ ] {`GlobalRole.USER && PermissionType.COMPANY_ADMIN`} add employee
- [ ] {`GlobalRole.USER && PermissionType.COMPANY_ADMIN`} remove employee

#### /companies/`:companyId`/editors

- [ ] {`GlobalRole.USER && PermissionType.COMPANY_ADMIN`} view list of userGroup editors
- [ ] {`GlobalRole.USER && PermissionType.COMPANY_ADMIN`} add userGroup editor
- [ ] {`GlobalRole.USER && PermissionType.COMPANY_ADMIN`} remove userGroup editor

#### /companies/`:companyId`/admins

- [ ] {`GlobalRole.USER && PermissionType.COMPANY_ADMIN`} view list of userGroup admins
- [ ] {`GlobalRole.USER && PermissionType.COMPANY_ADMIN`} add userGroup admin
- [ ] {`GlobalRole.USER && PermissionType.COMPANY_ADMIN`} remove userGroup admin

#### /companies/`:companyId`/requests

- [ ] {`GlobalRole.USER && PermissionType.COMPANY_ADMIN`} view list of join requests for
  userGroup
- [ ] {`GlobalRole.USER && PermissionType.COMPANY_ADMIN`} accept or decline join request for
  userGroup

#### /companies/`:companyId`/projects

- [ ] {`GlobalRole.USER && PermissionType.COMPANY_EMPLOYEE`} view projects they are assigned to
- [ ] {`GlobalRole.USER && PermissionType.COMPANY_EMPLOYEE`} view projects they can request to join
- [ ] {`GlobalRole.USER && PermissionType.COMPANY_EMPLOYEE`} add new project

#### /companies/`:companyId`/projects/`:projectId`

- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ASSIGNED_EMPLOYEE`} view project details
- [ ] {`GlobalRole.USER && PermissionType.PROJECT_EDITOR`} update project details
- [ ] {`GlobalRole.USER && PermissionType.PROJECT_EDITOR`} delete project

#### /companies/`:companyId`/projects/`:projectId`/employees

- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ADMIN`} view list of assigned employees
- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ADMIN`} assign employee to project
- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ADMIN`} remove employee from project

#### /companies/`:companyId`/projects/`:projectId`/editors

- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ADMIN`} view list of project editors
- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ADMIN`} add project editor
- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ADMIN`} remove project editor

#### /companies/`:companyId`/projects/`:projectId`/admins

- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ADMIN`} view list of project admins
- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ADMIN`} add project admin
- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ADMIN`} remove project admin

#### /companies/`:companyId`/projects/`:projectId`/requests

- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ASSIGNED_EMPLOYEE`} view list of join requests for
  project
- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ASSIGNED_EMPLOYEE`} accept or decline a join
  request for project

#### /companies/`:companyId`/projects/`:projectId`/expenses

- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ASSIGNED_EMPLOYEE`} get sum of all expenses in
  project
- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ASSIGNED_EMPLOYEE`} get sum of paid expenses in
  project
- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ASSIGNED_EMPLOYEE`} get sum of unpaid expenses in
  project

#### /companies/`:companyId`/projects/`:projectId`/tasks

- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ASSIGNED_EMPLOYEE`} view list of all tasks in the
  project
- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ASSIGNED_EMPLOYEE`} view list of tasks by task
  status (in progress,
  done etc)
- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ASSIGNED_EMPLOYEE`} add new task
- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ASSIGNED_EMPLOYEE`} assign self to a task
- [ ] {`GlobalRole.USER && PermissionType.PROJECT_ASSIGNED_EMPLOYEE`} remove self from a task

#### /companies/`:companyId`/projects/`:projectId`/tasks/`:taskId`

- [ ] {`GlobalRole.USER && PermissionType.TASK_ASSIGNED_EMPLOYEE`} view task details
- [ ] {`GlobalRole.USER && PermissionType.TASK_ASSIGNED_EMPLOYEE`} update task details
- [ ] {`GlobalRole.USER && PermissionType.TASK_ASSIGNED_EMPLOYEE`} delete task

#### /companies/`:companyId`/projects/`:projectId`/tasks/`:taskId`/expenses

- [ ] {`GlobalRole.USER && PermissionType.TASK_ASSIGNED_EMPLOYEE`} view all expenses
- [ ] {`GlobalRole.USER && PermissionType.TASK_ASSIGNED_EMPLOYEE`} add new expense
- [ ] {`GlobalRole.USER && PermissionType.TASK_ASSIGNED_EMPLOYEE`} get sum of all expenses in task
- [ ] {`GlobalRole.USER && PermissionType.TASK_ASSIGNED_EMPLOYEE`} get sum of paid expenses in task
- [ ] {`GlobalRole.USER && PermissionType.TASK_ASSIGNED_EMPLOYEE`} get sum of unpaid expenses in
  task

#### /companies/`:companyId`/projects/`:projectId`/tasks/`:taskId`/expenses/`:expenseId`

- [ ] {`GlobalRole.USER && PermissionType.TASK_ASSIGNED_EMPLOYEE`} view expense details
- [ ] {`GlobalRole.USER && PermissionType.TASK_ASSIGNED_EMPLOYEE`} update expense
- [ ] {`GlobalRole.USER && PermissionType.TASK_ASSIGNED_EMPLOYEE`} delete expense

#### /admin/users

- [x] {`GlobalRole.ADMIN`} view list of all users
- [x] {`GlobalRole.ADMIN`} view user details of a user
- [ ] {`GlobalRole.ADMIN`} delete a user

#### /admin/companies

- [x] {`GlobalRole.ADMIN`} view list of all companies
- [ ] {`GlobalRole.ADMIN`} remove a userGroup