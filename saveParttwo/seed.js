const {
    client,
    getAllUsers,
    createUser,
    updateUser
  } = require('./index');
  
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
            password varchar(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            Location VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true
        );
        CREATE TABLE posts (
            id SERIAL PRIMARY KEY
            "authorId" INTEGER REFERENCES users(id) NOT NULL
            title VARCHAR(255) NOT NULL
            content TEXT NOT NULL
            active BOOLEAN DEFAULT true
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
  
      await createUser({ username: 'albert', password: 'bertie99', name: 'Al Bert', location: 'Sydney, Australia' });
      await createUser({ username: 'sandra', password: '2sandy4me', name: 'Sand Ra', location: 'Okonomowoc, Wisconsin' });
      await createUser({ username: 'glamgal', password: 'soglam', name: 'Glam Gal', location: 'Africa, Ohio' });
  
      console.log("Finished creating users!");
    } catch (error) {
      console.error("Error creating users!");
      throw error;
    }
  }
  
  async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
    } catch (error) {
      throw error;
    }
  }
  //old testDB
//   async function testDB() {
//     try {
//       console.log("Starting to test database...");
  
//       const users = await getAllUsers();
//       console.log("getAllUsers:", users);
  
//       console.log("Finished database tests!");
//     } catch (error) {
//       console.error("Error testing database!");
//       throw error;
//     }
//   }

  async function testDB(){
      try{
        console.log("Starting to test database...")
        const users = await getAllUsers()
        console.log("Result:", users)
        console.log("Calling updateUser on users[0]")
        const updateUserResult = await updateUser(users[0].id, {
            name: "nametest01",
            location: "loctest01"
        });
        console.log("Result: ", updateUserResult)
        console.log("Finished database tests!")

      }
      catch(error){
          console.error
          throw error;
      }
  }

  
  
  rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());