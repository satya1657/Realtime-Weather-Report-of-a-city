const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
var request = require('request');
const app = express();
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
const htmlpath = path.join(__dirname+"/public");

app.use(express.static(htmlpath));

const file = fs.readFileSync("public/index.html" , "utf-8");

app.get("/msg", (req,res)=>{
    res.send("My name is kapil kumar hellow how are you");  
});

let city_name="";

app.post('/example', (req, res) => {
    
    city_name=req.body.cname;
    res.redirect("/weather");
    
});


var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var d = new Date();
app.get("/weather", (req, res) => {
     
   // console.log("city name is : "+city_name);
    request.get(`http://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=4696f036ec88019f3d3c9e430d4e15b6`, (err, response, body) => {
        
        const p =  JSON.parse(body);
      // console.log(p);
        const file = fs.readFileSync("public/index.html" , "utf-8");

        const updated = file.replace("{%cname%}",city_name).replace("{%temp%}",(p.main.temp-273.15).toFixed(2)).replace("{%maxtemp%}",(p.main.temp_max-273.15).toFixed(2))
        .replace("{%mintemp%}",(p.main.temp_min-273.15).toFixed(2)).replace("{%hum%}",p.main.humidity).replace("{%press%}",p.main.pressure).replace("{%vis%}",p.visibility/1000)
        .replace("{%wind%}",p.wind.speed).replace("{%sunr%}",p.sys.sunrise).replace("{%suns%}",p.sys.sunset).replace("{%seal%}",p.main.sea_level)
        .replace("{%main%}",p.weather[0].main).replace("{%desc%}",p.weather[0].description).replace("{%tempstatus%}",p.weather[0].main);
       
        res.send(updated);
});  
});

app.listen(8000,()=>{
    console.log("listening... at 8000");
});