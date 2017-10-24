# BookwormApp

This repo represents the API that serves the React application.

### TECHNOLOGIES/NPM MODULES
1. Node.js
2. Express.js (used for routing, middleware)
3. MongoDB (database)
4. JWT Token authentication (used to restrict API endpoints)
5. bcrypt (used for encrypting password)
6. request (used for AJAX requests)
7. xml2js (used to convert XML to JSON)

### API
1. Goodreads: https://www.goodreads.com/api

### DOCUMENTATION
1. Request: https://github.com/request/request
2. Bcrypt: https://github.com/shaneGirish/bcrypt-nodejs
3. xml2js: https://github.com/Leonidas-from-XIV/node-xml2js
4. JWT: https://github.com/auth0/node-jsonwebtoken

### WHAT I LEARNED
1. More practice writing custom express middleware (authenticating routes)
2. More practice using JWT authentication (verifying and signing tokens)
3. Practice with sending emails from a server (nodemailer)
    * Password reset email
    * Welcome email for user
    * Activate user account email
4. How to create instance methods using mongoose. These are functions that are ran before or after submitting some type of database query.
5. { parseString } from xml2js
6. Overall how to architect and build a production quality application 