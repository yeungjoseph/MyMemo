# MyMemo
"MyMemo" is a web application that helps keep track of a user's tasks by organizing tasks into different lists depending on whether or not a given task is in progress.

## Getting Started
1. Clone the master branch to your computer
2. In the project directory, run:
   ```
   npm install
   ```
   Note: Testcafe and sequelize must be installed globally to run on the command line: 
   ```
   npm install testcafe -g 
   npm install sequelize-cli -g
   npm install nodemon -g
   ```
3. Download and install Postgres at https://www.postgresql.org/ (For Windows)
4. Open up a new terminal and run:
   ```
   psql -U postgres
   ```
   (The terminal may prompt you for the password for the superuser)
5. Create a development and testing database by running:
   ```
   CREATE DATABASE "mymemo_dev";
   ```
   ```
   CREATE DATABASE "mymemo_test";
   ```
6. Create your database user by running:
   ```
   CREATE USER "tempuser" WITH PASSWORD 'temppass';
   ```
7. Give the new user permissions on both databases by running:
   ```
   ALTER USER tempuser WITH SUPERUSER;
   ```
8. Back in the projects directory, run the migrations: 
   ```
   sequelize db:migrate
   ```
   ```
   npm run test-migrations
   ```
9. Start the server by running:
   ```
   nodemon
   ```
10. In your web browser, navigate to http:/localhost:3000 to see the home page
11. To begin backend Mocha testing, run:
   ```
   npm run test-back
   ```
12. To begin frontend TestCafe testing, run the following three commands:
   ```
   npm run test-seeders
   ```
   ```
   npm run test-front-server
   ```
   And open up a new terminal, go to the project directory and run:
   ```
   npm run test-front
   ```

## Features
Home Page:
- Directs users to authentication page
- Directs users to task list page

Authentication Page:
- Allow new users to create an account with unique email and password
- Authenticate existing users and redirect them to task list page

Task List Page:
- Display a complete list of all tasks that the user has added
- Separate tasks into two tables depending on whether or not the task is in progress
- Allow users to move tasks in between the two lists
- Allow users to add, delete, and edit tasks on both lists
- Allow users to search for tasks by title, description, and due date

Tasks:
-Consists of a title (required), description (optional), and due date (optional)

## Technologies
Front-end:
-HTML/CSS
-Javascript/jQuery
-EJS Templating

Back-end:
-Node.js
-Express
-Postgres
-Sequelize

Additional Dependencies:
-Client sessions
-Bcrypt

Testing:
-Mocha
-Chai
-Test Cafe