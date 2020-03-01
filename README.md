# hourlyforecast

Modified MagicMirror2 weatherforecast including snow amount only for winter mounths

<img src=https://github.com/hangorazvan/hourlyforecast/blob/master/preview.png>

After duplicate weatherforecast from module/default folder to module folder, 

"change weatherforecast.js to hourlyforecast.js,"

same for the  css file, 

change inside js file Module.register("weatherforecast", to Module.register("hourlyforecast",

forecastEndpoint: "forecast/daily" to forecastEndpoint: "forecast", 

day = moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss").format("ddd"); to day = moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss").format("HH:mm"); 

and if exist comment the line params += "&cnt=" + (((this.config.maxNumberOfDays < 1) || (this.config.maxNumberOfDays > 121)) ? 40 : this.config.maxNumberOfDays);
