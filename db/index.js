//import pg Client
const {Client} = require('pg')

//connect to db server
//5432 is the standard port for postgres

const client = new Client('postgres://localhost:5432/juicebox-dev')

//helper function to SELECT users
async function getAllUsers() {
    const {rows} = await client.query(`SELECT * FROM users;`)
    return rows;
}

async function createUser({ username, password }) {
  try {
    const result = await client.query(`
      INSERT INTO users(username, password)
      VALUES ($1, $2);
    `, [username, password]);

    return result;
  } catch (error) {
    throw error;
  }
}
  

module.exports = {
    client,
    getAllUsers,
    createUser
}