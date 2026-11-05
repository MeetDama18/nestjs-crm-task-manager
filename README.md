# CRM Task Manager API

A production-ready Enterprise CRM & Task Management REST API built with NestJS, TypeORM, MySQL, and Docker. Features robust JWT-based authentication, Role-Based Access Control (RBAC), multi-tenant relationship mapping, dynamic query filtering, interactive Swagger documentation, and complete containerization.

---

## 🛠 Tech Stack

- **Runtime & Framework:** Node.js, NestJS (TypeScript)
- **Database & ORM:** MySQL 8.0, TypeORM
- **Authentication:** JWT (JSON Web Tokens), Passport.js, Bcrypt
- **API Documentation:** OpenAPI 3.0 / Swagger UI
- **Testing:** Jest, ts-jest
- **DevOps & Containerization:** Docker, Docker Compose

---

## 📂 Project Architecture & Modules

```text
src/
├── common/             # Enums, custom decorators, and global guards (Roles, JWT)
├── config/             # TypeORM and database connection configurations
├── modules/
│   ├── auth/           # Registration, login, password hashing, and token issuance
│   ├── users/          # User management, role scoping (ADMIN vs USER)
│   ├── customers/      # CRM client entities and customer tracking
│   └── tasks/          # Task management with multi-filtering and RBAC scoping
└── main.ts             # Application bootstrapping, global validation pipes, Swagger

## 📸 Deliverables & Proof of Execution

| Requirement / Metric | Screenshot |
| :--- | :--- |
| **01. User Registration** | ![Registration](screenshots/01-auth-register.png) |
| **02. JWT Authentication** | ![Login](screenshots/02-auth-login.png) |
| **03. Profile Verification** | ![Profile](screenshots/03-auth-profile.png) |
| **04. Unauthorized Access Check** | ![Unauthorized](screenshots/04-unauthorized-access.png) |
| **05. RBAC Admin Verification** | ![Admin Route](screenshots/05-rbac-admin-allowed.png) |
| **06. Task Creation (Relational)** | ![Create Task](screenshots/06-task-create.png) |
| **07. Task Relational View** | ![Task Relation](screenshots/07-task-relation-view.png) |
| **08. Dynamic Query Filters** | ![Filters](screenshots/08-task-filters.png) |
| **09a. Task Scoping (User View)** | ![User Scoping](screenshots/09a-user-scoping.png) |
| **09b. Task Scoping (Admin View)** | ![Admin Scoping](screenshots/09b-admin-scoping.png) |
| **10. Task Mutation (PATCH)** | ![Update Task](screenshots/10-task-update.png) |
| **11. Task Deletion (DELETE)** | ![Delete Task](screenshots/11-task-delete.png) |
| **12. Unit Tests Passed (Jest)** | ![Unit Tests](screenshots/12-unit-tests-passed.png) |
| **13. Swagger API Docs** | ![Swagger UI](screenshots/13-swagger-docs.png) |
| **14. Docker Multi-Container** | ![Docker Compose](screenshots/14-docker-compose.png) |
| **15. E2E Tests Passed** | ![E2E Tests](screenshots/15-e2e-tests-passed.png) |