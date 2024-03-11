<p align="center">
  <!-- <a href="https://github.com/DNadas98/spring-project-manager/actions/workflows/nodejs.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/DNadas98/spring-project-manager/nodejs.yml?style=for-the-badge" alt="Build">
  </a> -->
  <a href="https://github.com/DNadas98/spring-project-manager/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/DNadas98/spring-project-manager.svg?style=for-the-badge" alt="Contributors">
  </a>
  <a href="https://github.com/DNadas98/spring-project-manager/issues">
    <img src="https://img.shields.io/github/issues/DNadas98/spring-project-manager.svg?style=for-the-badge" alt="Issues">
  </a>
  <a href="https://github.com/DNadas98/spring-project-manager/blob/master/LICENSE.txt">
    <img src="https://img.shields.io/github/license/DNadas98/spring-project-manager.svg?style=for-the-badge" alt="License">
  </a>
  <a href="https://linkedin.com/in/daniel-nadas">
    <img src="https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555" alt="LinkedIn">
  </a>
</p>

<br xmlns="http://www.w3.org/1999/html"/>
<div align="center">
  <a href="https://github.com/DNadas98/spring-project-manager">
    <img src="https://avatars.githubusercontent.com/u/125133206?v=4" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Spring Project Manager</h3>
  <p align="center">
    Created by <a href="https://github.com/DNadas98">DNadas98 (Dániel Nádas)</a>
    <br />
    <a href="https://github.com/users/DNadas98/projects/4"><strong>View the Project Board »</strong></a>
    <br />
    <a href="https://www.postman.com/cc-tasx/workspace/dnadas98-public/documentation/30693601-1e1610fc-717c-41b5-a3f8-d830165f4325"><strong>Read the API Documentation »</strong></a>
    <br />
    <br />
    <a href="https://github.com/DNadas98/spring-project-manager/issues">Report Bug</a>
    ·
    <a href="https://github.com/DNadas98/spring-project-manager/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#tech-stack">Tech Stack</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#deployment">Deployment</a></li>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#setup--run">Setup and run</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#configuration-of-default-api-security-middlewares">Configuration of default API security middlewares</a></li>
        <li><a href="#authentication-authorization">Authentication, authorization</a></li>
        <li><a href="#api-documentation">API Documentation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#images">Images</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

The application allows users to create local accounts or sign in via Google, Facebook or GitHub
accounts. (OAuth 2.0)<br>
Authenticated users can join companies, create, and manage projects. Projects include tasks with
start dates, deadlines,
expenses, and varying levels of importance and difficulty. Employees request to be assigned to
projects and receive rewards for completed tasks, incorporating a gamification aspect with a scoring
system.

## Tech Stack

### Frontend

[![React JS](https://img.shields.io/badge/-React_JS-60D9FA?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Material UI](https://img.shields.io/badge/-Material_UI-003a75?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/material-ui/getting-started/)

### Backend

[![Java](https://img.shields.io/badge/-Java-ED8B00?style=for-the-badge)](https://www.java.com/en/)
[![Spring Boot](https://img.shields.io/badge/-Spring_Boot-589133?style=for-the-badge&logo=spring&logoColor=black)](https://spring.io/projects/spring-boot)  
[![Spring Security](https://img.shields.io/badge/-Spring_Security-589133?style=for-the-badge&logo=spring&logoColor=black)](https://spring.io/projects/spring-security)
[![Spring OAuth 2.0 Client](https://img.shields.io/badge/-Spring_OAuth_2.0_Client-589133?style=for-the-badge&logo=spring&logoColor=black)](https://docs.spring.io/spring-security/reference/reactive/oauth2/client/index.html)
[![Java JWT](https://img.shields.io/badge/-Java_JWT-CCCCCC?style=for-the-badge&logo=jsonwebtoken&logoColor=black)](https://github.com/jwtk/jjwt)

### Database, ORM

[![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4479A1?style=for-the-badge&logo=postgresql&logoColor=black)](https://www.postgresql.org/)
[![Hibernate ORM](https://img.shields.io/badge/-Hibernate_ORM-CCCCCC?style=for-the-badge&logo=hibernate&logoColor=black)](https://hibernate.org/orm/)
[![Spring Data JPA](https://img.shields.io/badge/-Spring_Data_JPA-589133?style=for-the-badge&logo=spring&logoColor=black)](https://spring.io/projects/spring-data-jpa)

### Integration and Deployment

[![Docker](https://img.shields.io/badge/-Docker-1d63ed?style=for-the-badge&logo=docker&logoColor=black)](https://www.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=black)](https://github.com/features/actions)
[![Nginx](https://img.shields.io/badge/-Nginx-227722?style=for-the-badge&logo=nginx&logoColor=black)](https://www.nginx.com/)

## Getting Started

### Deployment

The Dockerfiles for the different modules use multiple stage builds. The built Docker images are
collected by a Docker Compose configuration. The database is also built here from the official
PostgreSQL image.
The project uses Nginx as reverse-proxy and static file server.

### Prerequisites

- [Docker](https://www.docker.com/) for the Docker Compose setup
  - The project builds and starts with Docker Compose. Java, Node, Vite JS are only required
    for development
- Optional: [Java JDK](https://www.oracle.com/java/technologies/downloads/#java21)
  - The project uses Java 21 and Java Spring 3.2.0
- Optional: [Node.js, NPM](https://nodejs.org/en/download)
  - The frontend is developed using the latest Node and NPM versions currently available
  - The frontend project is set up using [Vite JS](https://vitejs.dev/)
- Optional: Obtain OAuth 2.0 client credentials for Google, Facebook and Github to test the OAuth
  2.0 Sign-in features
  - [Google Cloud Console OAuth 2.0 Credentials](https://developers.google.com/identity/protocols/oauth2)
  - [Facebook OAuth 2.0 Credentials](https://developers.facebook.com/docs/development/create-an-app/facebook-login-use-case)
  - [GitHub OAuth 2.0 Credentials](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
  - <strong>The app can start without this and provides local registration and login option
    too.</strong> If left out,
    only the OAuth 2.0 Sing-In options will not work.
  - To test the OAuth 2.0 Sign-in options, the app requires a valid client ID and client
    secret. Use the linked guides to add the application as client, then copy the client ID and
    secret. Paste these to their respective lines in the `.env` file

### Setup & Run

- <strong>If no real SSL certs are supplied, run the project in development mode</strong>

- Copy `env.txt` template and rename to `.env`, modify values (see details in the
  template)
- Copy `frontend/env.txt` template and rename to `.env`, values can be left as is, this one contains
  no secrets, only configuration options
- Optional: SSL Certificates
  - Replace `ssl/fake-ssl-cert` and `ssl/fake-ssl-key` with real certificates
  - Modify SSL copy lines in `nginx/Dockerfile`
  - Modify SSL configuration in `nginx/nginx.conf`
    <br><br>
- Run `docker compose up -d` in the project root to start the project with Docker Compose,
- OR for <strong> development mode</strong>
  - Run the development database in the `docker-compose.dev.yml`
  - Start the spring boot application in "dev" profile (the default Spring profile)
  - From the frontend folder, start the javascript application using `npm run dev`
    <br><br>
- Access the application at [`https://localhost:4430`](https://localhost:4430) (by default)
  <br><br>
- Run `docker compose logs -f` in the project root to view the logs
  - The backend API has different logging level for "dev" and "prod" profiles.  
    A more verbose setting is useful during development.
- See `backend/Dockerfile` and `nginx/Dockerfile` for build details

## Usage

### Configuration

- ENVs: `.env` files in the root folder and in `frontend` folder
- API configuration: `backend/src/main/resources/application.yml`
- Frontend configuration: `frontend/vite.config.js`
- Nginx reverse proxy configuration: `nginx/nginx.conf`

### Authentication, authorization

- <strong>If no real OAuth2 and/or SMTP credentials are provided, sign-in is still possible using
  the default admin e-mail and password found in the `.env` file</strong>

The application supports OAuth2 for login, allowing users to sign in with external accounts like
Google, GitHub, and Facebook. This method simplifies login procedures by using existing social media
profiles, enhancing user convenience and security.

For local sign-ups, the application requires email verification. Users must verify their email
through a sent link to activate their accounts, ensuring authenticity and reducing unauthorized
access.

Additionally, the application employs a flexible user management system where a single
ApplicationUser can have multiple UserAccounts, accommodating both local and OAuth2-linked accounts.
This design allows users to link multiple external identities to their application profile,
facilitating easy switching between different login methods while maintaining a unified profile.
This model streamlines account management and strengthens security and user experience.

The API uses JWTs (JSON Web Tokens) for authentication. After a successful login at the
Login endpoint, the user receives a Bearer Token in the response body, and a Refresh Token
as a cookie named `jwt`. This cookie is HTTPOnly, SameSite = "strict", Secure)<br><br>
Secured endpoints can be accessed by supplying the Bearer Token in the Authorization
header as "Bearer ".
If the access token has expired, a new access token can be requested using the Refresh
endpoint, as long as the Refresh Token is still valid and available as a cookie.<br><br>
The Spring API's security has advanced from a basic RBAC system to a more complex model, integrating
global Spring Security roles and specific permission types with custom security at the method level.
This approach enables detailed access control based on the application's unique needs.

Security for endpoints is managed by global roles, such as "USER" and "ADMIN". For example, only
users with the ADMIN role can access /api/v1/admin endpoints,
while /api/v1/user and similar paths are open to users with the USER role, safeguarding
administrative functions.

A custom permission evaluation system has also been developed, utilizing PermissionType to
dynamically determine access rights based on the request's context, targeted objects, and user
permissions. This system allows setting specific access rules for actions on entities like
companies, projects, and tasks, based on the authenticated user's permissions.

For instance, access to or modification of a company, project, or task depends not only on a user's
global role but also on permissions such as COMPANY_ADMIN, PROJECT_EDITOR, or
TASK_ASSIGNED_EMPLOYEE, reflecting the user's specific relationship with the entity.

This enhanced security model improves the API's flexibility and security, enabling the definition of
complex access control policies to meet the application's varied requirements, forming a strong
basis for authentication and authorization management.

### API Documentation

See
the [API Documentation](https://www.postman.com/cc-tasx/workspace/dnadas98-public/documentation/30693601-1e1610fc-717c-41b5-a3f8-d830165f4325)
for available endpoints and API usage guide

## Roadmap

- See the [Project board](https://github.com/users/DNadas98/projects/4) to track the
  progress of this project
- See the [open issues](https://github.com/DNadas98/spring-project-manager/issues) for a
  full list of proposed features (and known issues).

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Images

The frontend is still work in progress.
The project uses Material UI.

[View all images](https://github.com/DNadas98/spring-project-manager/tree/master/images)

### Home page

<img src="https://raw.githubusercontent.com/DNadas98/spring-project-manager/master/images/01-home.png" alt="Home page">

### Sign-up form

<img src="https://raw.githubusercontent.com/DNadas98/spring-project-manager/master/images/03-sign-up.png" alt="Sign-up form">

### User profile page

<img src="https://raw.githubusercontent.com/DNadas98/spring-project-manager/master/images/05-user.png" alt="Profile page">

### Light versus dark mode

<img src="https://raw.githubusercontent.com/DNadas98/spring-project-manager/master/images/08-light-dark-mode.png" alt="Light vs dark mode">

### Add new task form

<img src="https://raw.githubusercontent.com/DNadas98/spring-project-manager/master/images/07-task-form.png" alt="Add new task form">

### Project list

<img src="https://raw.githubusercontent.com/DNadas98/spring-project-manager/master/images/09-project-list.png" alt="Project list">

## Contact

Dániel Nádas

- My GitHub profile: [DNadas98](https://github.com/DNadas98)
- My webpage: [dnadas.net](https://dnadas.net)
- E-mail: [daniel.nadas@dnadas.net](mailto:daniel.nadas@dnadas.net)
- LinkedIn: [Dániel Nádas](https://www.linkedin.com/in/daniel-nadas)

Project
Link: [https://github.com/DNadas98/spring-project-manager](https://github.com/DNadas98/spring-project-manager)
