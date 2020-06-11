# hourlyforecast

Modified MagicMirror2 weatherforecast including snow amount only for winter mounths

https://forum.magicmirror.builders/topic/12201/snow-amount-on-weather-forecast

<img src=https://github.com/hangorazvan/hourlyforecast/blob/master/preview.png>

After duplicate weatherforecast from <i>module/default</i> folder to <i>module</i> folder, 

change <i>weatherforecast.js</i> to <i>hourlyforecast.js,</i>

same for the css file, 

change inside js file <i>Module.register("weatherforecast",</i> to <i>Module.register("hourlyforecast",</i>

<i>forecastEndpoint: "forecast/daily"</i> to <i>forecastEndpoint: "forecast",</i>

<i>day = moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss").format("ddd");</i> to <i>day = moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss").format("HH:mm");</i>

Then put in config.js


	{
		module: "hourlyforecast",
		position: "top_right",
		config: {
			// See weatherforeast default module 'Configuration options' for more information.
		}
	}

