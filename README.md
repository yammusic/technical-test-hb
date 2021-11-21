This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Cloning project
```bash
git clone https://github.com/yammusic/technical-test-hb.git
```

## Setup

First install all dependencies:
```bash
npm install
# or
yarn install
```

Next you must run the database migration for create a SQLite db (necessary in API side):
```bash
npm run db:migrate
# or
yarn db:migrate
```

And finally run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Screenshots

### Home page
![alt text](public/example/home-page.png)

### Login page
![alt text](public/example/login-page.png)

### Register page
![alt text](public/example/register-page.png)

### Profile page
![alt text](public/example/profile-page.png)

## API endpoints

* POST `/api/auth/login` -> Use for authenticate login
* POST `/api/auth/register` -> Use for register an user
* GET `/api/user/{userId}` -> Use for getting an user by id
* PATCH `/api/user/{userId}` -> Use for edit user data
* GET `/api/user/{userId}/favorites` -> Use for getting favorites of an user
* POST `/api/user/{userId}/favorite` -> Use for add a favorite to an user
* DELETE `/api/user/{userId}/favorite/{favoriteId}` -> Use for remove a favorite of an user
