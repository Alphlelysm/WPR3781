# Assignment Checklist Validation and Gap Analysis

Source document: `WPR371 Project 2026.pdf`

Validation date: 2026-05-12

## Validation Summary

The team checklist covers all major assignment categories at planning level:
authentication, event management, booking, dashboards, contact management,
search/filtering, MVC structure, MongoDB/Mongoose, middleware security, GitHub
collaboration, documentation, and presentation readiness.

The current repository still has implementation gaps that should be closed
before submission and demo.

## Assignment Requirements Checklist

| Requirement | Assignment expectation | Team checklist coverage | Current repo evidence | Status |
| --- | --- | --- | --- | --- |
| Authentication | Registration, login, hashed passwords, role-based access | Covered by Jaden | `AuthController.js`, `AuthRoutes.js`, `AuthMiddleware.js`, `RoleMiddleware.js`, `Users.js` | Partial |
| Event management | Admin-only create, read, update, delete events | Covered by Agobakwe, Jaden, Nokwanda | `EventController.js`, `EventRoutes.js`, `Events.js`, dashboard UI | Partial |
| Ticket booking | Capacity control and booking validation | Covered by Agobakwe and Aphiwe | `BookingsController.js`, `Bookings.js`, event capacity fields | Partial |
| Dashboards | Admin analytics and user booking history | Covered by Ethan, Agobakwe, Nokwanda | `AdminController.js`, `dashBoardServices.js`, `dashboard.html` | Partial |
| Contact management | Store and retrieve user enquiries | Covered by Agobakwe, Aphiwe, Nokwanda | `EnquiryController.js`, `EnquiryRoutes.js`, `Enquiry.js`, `contact.html` | Partial |
| Search and filtering | Event discovery by date, category, availability | Covered by Agobakwe and Nokwanda | `index.html`, `script.js` category/name filtering | Partial |
| Five mandatory pages | Home/events, auth, admin event management, booking/dashboard, contact/enquiries | Covered by Nokwanda and Ethan | `index.html`, `login.html`, `event.html`, `dashboard.html`, `contact.html` | Partial |
| MVC architecture | Clear Models, Views, Controllers separation | Covered by Ethan and Agobakwe | `Models`, `Controllers`, `routes`, `Views` folders | Partial |
| Middleware | Authentication, authorization, error handling | Covered by Jaden | `AuthMiddleware.js`, `RoleMiddleware.js`, `ErrorMiddleware.js` | Partial |
| MongoDB/Mongoose | Data persistence, validation, relationships | Covered by Aphiwe | User, Event, Booking, Enquiry models and `config/db.js` | Partial |
| GitHub collaboration | Meaningful commits and balanced contribution | Covered by Jaden and Ethan | Git history is present | Partial |
| Documentation | Comprehensive README and setup clarity | Covered by Ethan | `README.md` | Covered |
| Presentation | Demo flow, speaking parts, screenshots, QA | Covered by Ethan and all members | README demo flow and planned speaking parts | In progress |

## Validated Team Responsibility Checklist

### Ethan Ogle

- Turn the assignment document into a final requirements checklist.
- Check that every required feature is covered.
- Check that the project follows MVC structure.
- Check that pages match the assignment requirements.
- Check that authentication and role-based access are implemented.
- Check that MongoDB/Mongoose integration is working.
- Check that GitHub commits show fair contribution.
- Prepare presentation content.
- Create demo flow.
- Assign speaking parts.
- Collect screenshots for slides/README.
- Run final testing before submission.

Validation: Ethan's checklist directly matches the rubric areas for
documentation, final QA, presentation cohesion, assignment alignment, and
collaboration evidence.

### Jaden Van der Lely

- Maintain GitHub repo structure.
- Manage branches and pull requests.
- Resolve merge conflicts where needed.
- Build user registration.
- Hash passwords with bcrypt.
- Build login/logout.
- Store logged-in user sessions/JWT.
- Add admin/user roles.
- Create authentication middleware.
- Create admin authorization middleware.
- Protect booking/dashboard routes.
- Protect admin/event management routes.
- Test valid login, invalid login, and restricted pages.

Validation: Jaden's checklist covers the PDF authentication and security
requirements. Remaining repo gaps are listed below, especially the missing
`bcrypt` dependency and route protection inconsistencies.

### Aphiwe Shabalala

- Finish MongoDB connection.
- Create/finalize User model.
- Create/finalize Event model.
- Create/finalize Booking model.
- Create/finalize Enquiry model.
- Add schema validation.
- Add model relationships/references.
- Add sample/seed data if needed.
- Support capacity fields for bookings.
- Support enquiry storage.
- Test database reads/writes.
- Help Agobakwe connect Express controllers to the database.

Validation: Aphiwe's checklist maps to the PDF database design, validation,
relationship, capacity, and persistence requirements.

### Nokwanda Legoabe

- Complete frontend routing/navigation.
- Create/finish base EJS layout.
- Build navbar and footer.
- Style home/event listing page.
- Style login/register pages.
- Style event details page.
- Style booking page.
- Style user dashboard page.
- Style admin event management pages.
- Style contact/enquiry page.
- Add search/filter form UI.
- Make pages responsive.
- Polish final interface for demo.

Validation: Nokwanda's checklist covers the five mandatory pages and UI/UX
rubric. The key remaining gap is converting the static HTML pages to EJS and
connecting them to server-rendered data.

### Agobakwe Sedikwe

- Build Express route files.
- Build controllers for main features.
- Connect frontend routes to backend logic.
- Implement event listing logic.
- Implement event search/filter logic.
- Implement admin event CRUD logic.
- Implement booking logic.
- Prevent overbooking.
- Implement user booking history logic.
- Implement contact/enquiry submission logic.
- Implement admin enquiry management logic.
- Work with Jaden to apply auth middleware to protected routes.
- Work with Aphiwe to use Mongoose models correctly.

Validation: Agobakwe's checklist covers the PDF backend, controller, route, and
business logic requirements. Remaining repo gaps are mainly route mounting,
controller-field consistency, admin CRUD completeness, and dashboard/enquiry
management.

## Critical Submission Gaps

| Gap | Evidence | Required action |
| --- | --- | --- |
| EJS is required, but current views are static HTML | `Views/public/*.html`; no view engine setup in `server.js` | Add EJS, configure `app.set("view engine", "ejs")`, move pages into EJS templates, and render DB-backed data |
| `bcrypt` is used but not installed | `AuthController.js` requires `bcrypt`; `package.json` does not list it | Install and save `bcrypt` or switch to an installed secure hashing library |
| Login route mismatch | Frontend calls `/api/auth/login`; route defines `/api/auth/Views/public/login` | Change route to `router.post("/login", authController.loginUser)` |
| Event, booking, and enquiry routes are not mounted | `server.js` mounts only `/api/auth` and `/api/admin` | Mount `/api/events`, `/api/bookings`, and `/api/enquiries` |
| JWT and session logic are mixed | Auth middleware expects JWT; booking/enquiry controllers use `req.session.user` | Standardize on JWT or add `express-session` consistently |
| Event schema field names do not match controller usage | Model uses `Title`, `Price`, `Capacity`, `BookedSeats`; controllers use lower-case names | Standardize schema and controller field names |
| Admin dashboard service call is broken | `AdminController.js` calls `getCapacityStats`; service exports `getdashBoardStats` | Rename/export the expected function and align returned data |
| Admin event CRUD is incomplete and not fully protected | Event routes expose create/get/delete only; create route is not admin-protected; no update route | Add update, protect admin routes, and connect admin UI |
| Booking route is not protected and may not run | Booking controller uses session data that is not configured | Protect route and read the authenticated user from the chosen auth method |
| Enquiry retrieval/admin management is missing | Enquiry submit exists; no admin list/update/delete route | Add admin enquiry management route and view |

## Functional Gaps

| Gap | Assignment impact | Required action |
| --- | --- | --- |
| Home events are loaded from `localStorage`, not MongoDB | Event listing is not fully integrated with Mongoose | Render or fetch events from the database |
| Search/filter is only name/category in frontend storage | PDF requires filtering by date, category, and availability | Add server/database filtering for all required fields |
| User booking history is not implemented end-to-end | Dashboard requirement incomplete | Add user booking history route/controller/view |
| Admin analytics are incomplete | Dashboard rubric risk | Show total bookings, popular events, and capacity usage from MongoDB |
| Contact form is not fully connected to backend enquiry storage | Contact management requirement risk | Post contact form to backend and store in `Enquiry` collection |
| Logout is frontend-only | Auth requirement partial | Confirm token/session cleanup and route access after logout |
| No seed/admin account strategy is documented | Demo risk | Add seed data or document how to create the first admin user |

## Repository and Submission Gaps

| Gap | Evidence | Required action |
| --- | --- | --- |
| `node_modules` is tracked in git | `git ls-files node_modules` returns tracked files | Remove `node_modules` from git and add a real `.gitignore` |
| Ignore file is not active | File is named `GitHub.gitignore` and is empty | Rename/create `.gitignore` with `node_modules/`, `.env`, and logs |
| Git history does not show all five members locally | `git shortlog -sne --all` shows Alphlelysm, Aphiwe, and Nokwanda only | Use GitHub Insights/commits to confirm all five members contributed, or add missing contribution evidence |
| `npm run dev` is not available | `package.json` only defines `start` and placeholder `test` | Add a dev script if required by the submission/demo instructions |
| No automated tests are defined | `npm test` exits with an error placeholder | Add at least focused manual test evidence or replace with useful smoke tests |

## Screenshots to Capture

Screenshots are optional in the assignment but recommended for the README and
presentation slides.

- Home/event listing page with filters.
- User registration and login page.
- Event details and booking page.
- User dashboard with booking history.
- Admin dashboard with analytics.
- Admin event management page.
- Contact/enquiry page.
- MongoDB Compass collections showing users, events, bookings, and enquiries.

## Suggested Speaking Parts

| Speaker | Focus |
| --- | --- |
| Ethan | Assignment alignment, final checklist, QA summary, demo coordination |
| Jaden | Authentication, JWT/session approach, password hashing, role protection |
| Aphiwe | MongoDB connection, Mongoose models, relationships, validation |
| Nokwanda | Page structure, EJS layout, responsive UI, navigation |
| Agobakwe | Express routes, controllers, business logic, booking and admin workflows |

## Final QA Checklist Before Submission

- Confirm MongoDB starts and connects successfully.
- Confirm `npm install` restores all required dependencies.
- Confirm the app starts without runtime errors.
- Confirm registration hashes passwords.
- Confirm valid login succeeds.
- Confirm invalid login fails safely.
- Confirm protected user pages reject unauthenticated access.
- Confirm admin pages reject standard users.
- Confirm event CRUD works from the admin page.
- Confirm bookings cannot exceed event capacity.
- Confirm user booking history is correct.
- Confirm admin analytics use database records.
- Confirm contact enquiries are stored and manageable.
- Confirm all five mandatory pages are navigable and responsive.
- Confirm `node_modules` is excluded from the final ZIP.
- Confirm GitHub contribution evidence is ready for presentation.
