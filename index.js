/*
This is the rest api using express js.
*/

const express = require("express");
const users = require("./MOCK_DATA.json");

const app = express();
const fs = require("fs");
const PORT = 4000;

// Using middleware to get the form data from postman : x-www-form-urlencoded
app.use(express.urlencoded({extended : false}));

app.get("/api/users" , (req,res) => {
    console.log("User request accepted")
    return res.json(users);
});

app.post("/api/users",(req,res) => {
    // create a new user with data in request object
    const data = req.body;
    users.push({id : users.length + 1 , ...data});

    fs.writeFile("./MOCK_DATA.json" , JSON.stringify(users) , (err,data) => {
        return res.json({status : "User created" , id : users.length});
    })
});

/*
if the request contains the same route but different method then we can use
route to write efficient code

e.g. URL = /api/users/:id   

app.get(url) , app.post(url) , app.delete(url) ...  instead we can use 

app.route(url).get(func).delete(func). and so on
*/

app.route("/api/users/:id")
.get((req,res) => {
    const id = req.params.id;
    const user = users.find((u) => u.id == id);

    if(user != null)
        return res.json(user);
    else
        return res.json({status : "not able to find user"});
})
.delete((req,res) => {
    const id = req.params.id;
    const user = users.find( (u) => u.id == id)

    if(user == null)
    {
        return res.json({status : "No user exits with id" , id : id});
    }

    const index = users.indexOf(user);
    users.splice(index,1);
    
    fs.writeFile("./MOCK_DATA.json" , JSON.stringify(users) , (err,data) => {
        return res.json({status : "User deleted Successfully"});
    })

});

app.patch("/api/users",(req,res) => {
    const body = req.body;
    const user = users.find((u) => u.id == body?.id);

    console.log("Body" , body);
    console.log("User : " , user);

    if(user == null)
        return res.json({status : "Patch answer No user exits with id" , id : body.id});

    users.map( (u) => {

        if(u.id == body.id)
        {
            u = body
        }
    });

    fs.writeFile("./MOCK_DATA.json" , JSON.stringify(users) , (err,data) => {
        return res.json({status : "User Updated Successfully"});
    })
});


app.listen(PORT,()=> {
    console.log("Server started at port 4000");
})