const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');


const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res){

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

   const data = {
        members:  [
            {
                email_address: email, 
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName 
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us1.api.mailchimp.com/3.0/lists/a7172461cf";

    const options = {
        method: "POST", 
        auth: "Jamie1:4e233f1d4741a14f197034f1079039ae-us1"
    }

    const request = https.request(url, options, function(response){
        response.on('data', function(data){
            console.log(JSON.parse(data));
            console.log(response.statusCode);

            if (response.statusCode === 200){

                res.sendFile(__dirname + "/success.html");
            } else{
                res.sendFile(__dirname + "/failure.html");
            }
        })
        
    })

    request.write(jsonData);
    request.end();
});
 
app.post("/failure", function( req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
    console.log('Hey Boss im running on port 3000');
});

// API Key 
// 4e233f1d4741a14f197034f1079039ae-us1

//List Id
//a7172461cf