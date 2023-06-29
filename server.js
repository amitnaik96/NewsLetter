const express = require("express");
const app = express();
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));

// to hide API key dotenv package
require('dotenv').config();

// console.log(process.env);  will give you all environment variables(with API_KEY added)
// now you get api key by process.env.API_KEY
//have .gitignore file to ignore .env and node_modules
//now deploy it in cyclic won't give error or Api won't get disabled


// app.listen(3000,()=>{
app.listen( process.env.port || 3000,()=>{    //process.env.port --> for cyclic and 3000 for out local testing
    console.log("Server is running on port 3000");
});

app.get("/",(req,res)=>
{
    res.sendFile(__dirname + "/signup.html");
});

app.post('/',(req,res)=>
{
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    console.log(firstName + " " + lastName + " " + email);



    const subscribingUser = {
        firstName : firstName,
        lastName : lastName,
        email : email
    };

    const client = require("@mailchimp/mailchimp_marketing");
    client.setConfig({
      apiKey: process.env.API_KEY,  //here
      server: "us21",
    });
    
    // adding member(sending data) to mailchimp with hadling error using try caych block
    const run = async() => {
        try
        {
            const response = await client.lists.addListMember("4bd3ca770a",{
                email_address : subscribingUser.email,
                status : "subscribed",
                merge_fields : {
                    FNAME : subscribingUser.firstName,
                    LNAME : subscribingUser.lastName
                }
            });
            console.log(response);


            res.sendFile(__dirname + "/success.html");
        }
        catch(err)
        {

            res.sendFile(__dirname + "/failure.html");
        }
    }
    run();  
});


app.post('/failure',(req,res)=>
{
    res.redirect("/");
})

