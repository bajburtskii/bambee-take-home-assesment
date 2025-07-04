# Project README

## 1. Approach

The project is split into two parts: a backend and a frontend.

* The **backend** is built with **Node.js**, **TypeScript**, and **Express**, using **SQLite** as the database to keep things simple and avoid external dependencies like Docker or DBs.
* The **frontend** uses **React** with **TypeScript**.
* Authentication is handled via **JWT**.
* Node version is 22.14
---

## 2. Assumptions

* Two users to test with: 1. alice@example.com/password 2. bob@example.com/password
* I intentionally kept the frontend simple (even naive), with minimal styling.
* If the team hits OpenAI API quotas, I added a fallback service that generates sample tasks locally. See: a line in the `GET /tasks/generated` endpoint.

---

## 3. Anything unfinished or out of scope

* **Testing:** I wrote one integration and one unit test to show the testing setup. With more time, I’d do more of those.
* **Error handling:** Very simple. In production ready code it should be more sophisticated
* **Validation:** Currently happens in the route definitions using `express-validator`. Ideally, this would be in a dedicated validation layer.
* **Filtering:** Tasks are filtered on the frontend simply because it was faster
* **API improvements:** I’d include pagination, versioning (e.g. `/api/v1/...`), and Swagger/OpenAPI documentation.
* **Frontend:**

    * API url shouldn't be hardcoded (I remembered about it in 5 mins before the time was over, sorry :)
    * I've also noticed a bug with "edit task form" that appears at the top of the list (noticed it in 2 mins before the timer)
    * Add ESLint and Prettier config
    * Add tests
    * Improve typing across components

---

## 4. How to Run It

### Backend

```bash
cd backend
cp .env.example .env
# Add your OPENAI_API_KEY to the .env file

npm install
npm run test     # Run tests
npm run dev      # Start the development server
```

### Frontend

```bash
cd frontend
npm install
npm start        # Starts on http://localhost:3000
```

---

## 5. Architecture Overview

* The **frontend** talks to the **backend** via REST APIs.
* The **backend** handles auth, persistence, and (optionally) communication with OpenAI.
* The database is local **SQLite**, chosen to minimize setup.

No Docker to keep the environment light.
