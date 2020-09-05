/*jshint esversion:6*/

const  bodyParser = require('body-parser');
const  express = require('express');
const  request = require('request');
const https = require('https');
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  // console.log(firstName, lastName, email);
  const data = {
    members:
     [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
     ]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us10.api.mailchimp.com/";

  const options = {
    method: "POST",
    auth: "apiKey"
  };


  const request = https.request(url, options, function(response){
    if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
        // console.log("Successfully subscribed!");
    }
    else{
        res.sendFile(__dirname + "/failure.html");
        console.log("Error to signup");
    }
    response.on("data", function(data){
      // console.log(JSON.parse(data));
    });

  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
