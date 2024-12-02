# node-postgres
Node JS APIs written using Postgres with CRUD, CTE, JSON Fields, Procedure

## After successfully cloning the Repo from GitHub follow these commands to make sure you have installed node js on your system with version (18.x)


### Step 1: Install Node.js

Install Node.js using the following command:

```bash
sudo apt-get install -y nodejs
```
### Step 2: Install Packages

Run the following command to install the package for repositories:

```bash
npm install
```

### Step 3: Install Nodemon

Install Nodemon globally to manage your Node.js application:

```bash
sudo npm i -g nodemon
```
### Step 4: Start Your Node.js Application with nodemon (Optional)

If you need to start your Node.js application managed by Nodemon, you can use the following command:

```bash
nodemon index.js or

npm start (mentioned in the package.json)
```

### Step 5: Set up the DB for Sequelize in Your Node.js Application
1. Install Sequelize CLI
```
npm install --save-dev sequelize-cli or npm install -g sequelize-cli
```

2. Verify Your Database Configuration
Check the database settings in your Sequelize config/config.json (or config.js if you are using .js):

3. Ensure that:
The database name (database) is correct.
The username, password, host, and dialect match your PostgreSQL setup.

4. Run Migrations
After creating the database, you can run your migration:
```
npx sequelize-cli db:migrate
```

### Step 6: Run the following APi's route to perform operations on DB

Run the following url to check the api's document created using swagger
```
### http://localhost:5000/api-docs/
```
