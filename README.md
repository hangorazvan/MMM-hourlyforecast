# hourlyforecast

Modified MagicMirror2 weatherforecast including snow amount only for winter mounths

<img src=https://github.com/hangorazvan/hourlyforecast/blob/master/preview.png>

After duplicate weatherforecast from module/default folder to module folder, 

change <i>weatherforecast.js</i> to <i>hourlyforecast.js,</i>

same for the css file, 

change inside js file <i>Module.register("weatherforecast",</i> to <i>Module.register("hourlyforecast",</i>

<i>forecastEndpoint: "forecast/daily"</i> to <i>forecastEndpoint: "forecast",</i>

<i>day = moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss").format("ddd");</i> to <i>day = moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss").format("HH:mm");</i>

and if exist comment the line <i>params += "&cnt=" + (((this.config.maxNumberOfDays < 1) || (this.config.maxNumberOfDays > 121)) ? 40 : this.config.maxNumberOfDays);</i>
