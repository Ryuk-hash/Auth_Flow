<h2 align="center">Book REST API 🚀</h2>

## 🔄 Built with

- Node.js + Express.js
- MongoDB Atlas
- Nodemailer + Heroku deployment

## 🚩 How to install API

#### Fork and clone this repository using

   ```bash
   git clone https://github.com/sandip2224/Auth_Flow.git
   cd Auth_Flow
   ```   
#### Install dependencies and dev dependency using

   ```bash
   yarn
   ```  

#### Create a _.env_ file inside the root directory and include the following:

   ```bash
   MONGO_URI=<Your_Unique_MongoDB_Cluster_URI>a
   JWT_KEY=<Unique_256-bit_Secret>
   EMAIL=<Valid_Sender_Email>
   PASS=<App_Password_Sender_Email>
   BASE_URL=http://localhost:3000
   ```  
   > Note: Get the following URL from MongoDB official website. You need to configure the `username`, `password` and `dbname` accordingly.
   ```bash
   mongodb+srv://<username>:<password>@cluster0.x1ccn.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

 #### Start the server locally at _localhost:3000_ using

   ```bash
   yarn dev
   ```

## 🔱 API Endpoints

|  API Endpoints | HTTP Method | Description |
|:-|:-|:-|
|/api/v1/user/register|POST|Register as new user|
|/api/v1/user/login|POST|Login as existing user|
|/api/v1/user/verify/:userId/:token|GET|Verify user email address for new registration|
|/api/v1/user/password-reset|POST|Send password reset link to registered email address|
|/api/v1/user/password-reset/:userId/:token|POST|Reset account password with new password|

> P.S: Import the collection (Auth_Flow_REST_API.postman_collection.json) in Postman for detailed documentation

### 👩‍💻 Project Created & Maintained By - [Sandipan Das](https://linkedin.com/in/sandipan0164)
