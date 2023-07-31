const http= require("http");
const fs=require ("fs");
var requests = require('requests');

const homeFile=fs.readFileSync("home.html","UTF-8");

const replaceVal=(tempVal,orgVal) =>{
    // console.log("hello")
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;
}

const server=http.createServer((req,res)=>{

    if(req.url=="/"){
        console.log('called')
        requests("https://api.openweathermap.org/data/2.5/weather?q=Bhopal&appid=cbb82444e0c8d5c219bc625c17259de7"
        )
        .on("data",(chunk) => {
              const objData=JSON.parse(chunk);
              const arrData=[objData];
              // arrData[0].main.temp  values call from Api

          console.log(arrData[0].main.temp);
            
            //convert this arraydata into string  .join("")
            const realTimeData=arrData.map((val) => replaceVal(homeFile,val)).join("");

            res.write(realTimeData);
            })
        .on("end",(err)=>{
            if(err) return console.log("connection cLosed due to errors ", err)
            res.end();
        });
    }
});

server.listen(8000,"127.0.0.1");