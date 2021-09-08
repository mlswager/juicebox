/*

const{client, getAllUsers,createUser} = require ("./index")

//we want to 1. drop the exisint gusers table, 2. recreate the users table, 3. re-add the data to the users table
//droptables function
async function dropTables() {
    try {
      await client.query(`
  
      `);
    } catch (error) {
      throw error; // we pass the error up to the function that calls dropTables
    }
  }

  async function dropTables() {
    try {
      console.log("Starting to drop tables...");
  
      await client.query(`
        DROP TABLE IF EXISTS users;
      `);
  
      console.log("Finished dropping tables!");
    } catch (error) {
      console.error("Error dropping tables!");
      throw error;
    }
  }

  async function createTables() {
    try {
      console.log("Starting to build tables...");
  
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username varchar(255) UNIQUE NOT NULL,
          password varchar(255) NOT NULL
        );
      `);
  
      console.log("Finished building tables!");
    } catch (error) {
      console.error("Error building tables!");
      throw error;
    }
  }

async function createInitialUsers() {
    try {
      console.log("Starting to create users...");
  
        let user1 = { username: 'albert', password: 'bertie99' }
        let user2 = { username: 'sandra', password: '2sandy4me' }
        let user3 = { username: 'glamgal', password: 'soglam' };

        const result1 = await createUser(user1)
        const result2 = await createUser(user2)
        const result3 = await createUser(user3)
  
      console.log("Finished creating users!");
    } catch(error) {
      console.error("Error creating users!");
      throw error;
    }
  }



  async function rebuildDB() {
      await dropTables();
      await createTables();
      await createInitialUsers();
  }

//all connections to the database have to be async so all requests will need await
async function testDB(){
    //this is the helper function we build in index.js
    const users = await getAllUsers()
    console.log('rows',users)
}

async function run(){
    try{
        client.connect()
        await rebuildDB()
        await testDB()
    }
    catch(error){
        console.error(error)
    }
    finally{
        client.end()
    }
}

run()
//testDB()

*/