
//importing the database name and the functons we want to use from index.js
const {client,getAllUsers,createUser,updateUser,createPost,updatePost,getAllPosts,getUserById,getPostsByUser} = require("./index")

//use getAllUsers to look at what is in the database
async function testDB(){
    try{
        const users = await getAllUsers()
        console.log("getAllUsers: ",users)

        const updateUserResult = await updateUser(users[0].id,{
            name: "Bart Simpson",
            location: "Springfield",
            password: "3at-mY-5h0rt5"
        })
        console.log("user updated to: ",updateUserResult)

        const getAllPostsResult = await getAllPosts()
        console.log("getAllPosts: ",getAllPostsResult)

        //console.log(`####${getAllPostsResult[0].authorId}`)

        const updatePostResult = await updatePost(getAllPostsResult[0].authorId,{
            title:"user1 updated post title",
            content:"user1 updated post content. I should probably take a break"
        })
        console.log("post updated to: ",updatePostResult)

        const getUser1Result = await getUserById(1)
        console.log("getUser1ByIdResult: ",getUser1Result)
        
    }
    catch(error){
        console.log(error)
    }
}

//drop the users table and post table if it is in the database
async function dropTables(){
    try{
        await client.query(`
            DROP TABLE IF EXISTS posts;
            DROP TABLE IF EXISTS users;`
        );
        console.log("tables dropped");

    }
    catch(error){
        throw error
    }
    
}

//create the users table and posts table that we just dropped
async function createTables(){
    try{
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                active BOOLEAN DEFAULT true
            );
            CREATE TABLE posts (
                id SERIAL PRIMARY KEY,
                "authorId" INTEGER REFERENCES users(id) NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                active BOOLEAN DEFAULT true
            );
            `)
        console.log("tables created")

    }
    catch(error){
        throw error
    }
}

//user createUsers to create an initial set of users. we pass in an object with 2 elements that is inserted into the users table
async function createInitialUsers(){
    try{
        await createUser({usernameinput: "albert", passwordinput: "bertie99", nameinput: "albertname", locationinput: "albertlocation"})
        await createUser({usernameinput: "sandra", passwordinput: "2sandy4me", nameinput: "sandyname", locationinput: "sandylocation"})  
        await createUser({usernameinput: "glamgal", passwordinput: "soglam", nameinput: "glamgalname", locationinput: "glamgallocation"})

        console.log("users created")
    }
    catch(error){
        console.log("error creating users")
        throw(error)
    }
}

/*-------------------------------------Post-------------------------------------*/


async function createInitialPosts(){
    try{
        //this runs getAllUsers 3 times and assigns the results to the elements in the array
        const[user1,user2,user3] = await getAllUsers();

        await createPost({
            authorId: user1.id,
            title:"user1 first port",
            content: "this is the first post for user1. I couldn't think of a username for Bart Simpson"
        })
        console.log("posts created")
    }
    catch(error){
        throw error
    }
}





/*-------------------------------------Rebuild-------------------------------------*/

//a function that calls the drop and create functions that we can call
async function rebuildTables(){
    try{
        client.connect()
        await dropTables()
        await createTables()
        await createInitialUsers()
        await createInitialPosts()
    }
    catch(error){
        throw error
    }
}
rebuildTables()
    .then(testDB)
    .finally(()=>client.end())
