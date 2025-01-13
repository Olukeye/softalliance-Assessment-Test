# softalliance-Assessment-Tes

# Description
This application is a TypeScript-based platform that handles user authentication, inventory management, and payments, with additional functionalities such as password recovery and webhook-based purchase status updates.

## Features
- User Authentication:
- Register User
- Allows users to sign up and create an account.
- Login User
- Authenticate users to access the application.
- Forgot Password
- Provides a method for users to request a password reset.
- Recover Password
- Users can reset their password using a provided link or token.
- Resend Auth Code with Expiration
- Resend authentication codes with an expiration time for security.
- User Management:
- Get User (Authenticated Request)
- Retrieve user details (only accessible to authenticated users).
- Inventory Management:
- CRUD API for Inventory Management
- Manage inventory items through authenticated Create, Read, Update, and Delete operations.
- - Payments:
- Payments API Integration
- Integration with payment gateways like Paystack or Flutterwave (FLW) to handle transactions.
- Easy account creation and access to keys.
- Payment processing for goods and services.
- - Webhook:
- Purchase Status Update Webhook
- Create a webhook to automatically mark purchases as paid upon successful payment.
## Tech Stack
Language: TypeScript
Database: (MongoDB)
## Tools & Frameworks: 
- Node.js
- Express
- Docker
## Payment Gateway: 
- Paystack


## Setup Instructions
# Prerequisites
- Node.js (v19+)
- Docker (optional but recommended)
- Git
# # Installation
- Clone the repository:
- git clone https://github.com/username/repository-name.git
- cd repository-name
- Install dependencies:
# bash
- Copy code
- npm install
- Environment Variables
* Create a .env file in the project root and include the following variables:
* Copy code
* PORT=<Application Port>
* DB_URI=<MongoDB Connection URI>
* JWT_SECRET=<Your JWT Secret>
* PAYSTACK_SECRET_KEY=<Your Paystack Secret Key>
* AUTH_CODE_EXPIRY=<Auth Code Expiration Time>
* HOST= <amtp provider>
* SERVICE= <gmail>
* GMAIL_PORT= <Your port>
* EMAIL_USERNAME= <Your email>
* EMAIL_PASSWORD= <password>
* Running the Application using nodemon

## Using Docker
# Build the Docker image:
```bash
Copy code
docker build -t application-name .
Run the Docker container:
bash
Copy code
docker run -p 3000:3000 --env-file .env application-name
```



## Code Repository
The application source code is available at:
GitHub Repository

Contributions
Contributions are not welcome welcome! This is a test assessment projrct.

