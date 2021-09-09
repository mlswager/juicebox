//this is saying that we are importing pg and assigning it to client
const {Client} = require ('pg')
//this is connecting the database name and the location of the database
const client = new Client('postgres://localhost:5432/juicebox-dev')


/*--------------------users--------------------*/
//helperfunction: selects all rows from the users table
async function getAllUsers(){
    try{
        const {rows} = await client.query(
        `SELECT id, username, name, location FROM users;`
    )
    return rows
    }
    catch(error){
        throw error
    }
}

//helperfunction: function that takes input of usernameinput and passwordinput and puts them into an array which is instererd into the users table
async function createUser({usernameinput, passwordinput, nameinput, locationinput}){
    try{
        const result = await client.query(`
        INSERT INTO users(username, password, name, location) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
        `, [usernameinput,passwordinput,nameinput,locationinput])
        return result
    }
    catch(error){
        throw error
    }
}

//helperfunction: function to update user
async function updateUser(id,fields = {}){
    const setString = Object.keys(fields).map(
        (key,index) => `"${key}"=$${index+1}`
        ).join(',');

        //console.log("setString: ",setString)

    if(setString.length === 0){
        return;
    }
    try{
        const {rows: [user]} = await client.query(`
        UPDATE users
        SET ${setString}
        WHERE id=${id}
        RETURNING *;`
        ,Object.values(fields))

        return user
    }
    catch(error){
        throw error
    }
}

async function getUserById (userId){
    try{
        const {rows} = await client.query(
            //I wasn't sure how to delete the password key so I just never grabbed it. seemed simpler
            `
            SELECT id, username, name, location 
            FROM users
            WHERE id = ${userId}
            `)
            if (rows.length>0){
                const thePostsPart = await getPostsByUser(userId)
                rows.posts=thePostsPart
                return rows
            }
            else{
                return null
            }
    }
    catch(error){
        throw error
    }
}

/*--------------------posts--------------------*/


//helperfunction: create a post
async function createPost({authorId, title, content}){
    try{
        const result = await client.query(`
        INSERT INTO posts("authorId", title, content) 
        VALUES ($1, $2, $3) 
        RETURNING *;
        `, [authorId,title,content])
        return result
    }
    catch(error){
        throw error
    }
}

async function updatePost(id,fields = {}){
    const setString = Object.keys(fields).map(
        (key,index) => `"${key}"=$${index+1}`
        ).join(',');


    if(setString.length === 0){
        return;
    }
    try{
        const {rows: [post]} = await client.query(`
        UPDATE posts
        SET ${setString}
        WHERE id=${id}
        RETURNING *;`
        ,Object.values(fields))

        return post
    }
    catch(error){
        throw error
    }
}

async function getAllPosts(){
    try{
        const {rows} = await client.query(
        `SELECT "authorId", title, content FROM posts;`
    )
    return rows
    }
    catch(error){
        throw error
    }
}

async function getPostsByUser (userId){
    try{
        const {rows} = await client.query(
        `
        SELECT "authorId", title, content FROM posts
        Where "authorId"=${userId};
        `
    )
    return rows
    }
    catch(error){
        throw error
    }
}

/*--------------------tags--------------------*/
async function createTags(taglist){
    const setValues = taglist.map(
        (value,index) => `($${index+1})`
        ).join(',');


    try{
        const result = await client.query(`
        INSERT INTO tags(name) 
        VALUES ${setValues}
        ON CONFLICT (name) DO NOTHING;;
        `, [])
        return result
    }
    catch(error){
        throw error
    }
}



/*--------------------export--------------------*/

//exporting the database name so we can use it in seed.js
//exporting the helper functions we want to use in seed.js
module.exports = {
    client,
    getAllUsers,
    createUser,
    updateUser,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser,
    getUserById

}