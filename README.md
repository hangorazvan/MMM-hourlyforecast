# hourlyforecast

Modified MagicMirror2 weatherforecast including snow amount only for winter mounths

https://forum.magicmirror.builders/topic/12201/snow-amount-on-weather-forecast

<img src=https://github.com/hangorazvan/hourlyforecast/blob/master/preview.png>
Do not make modification and do not replace the default, just add <i>disable: true</i> in config.js and use this one as 3rd party,

Then put in config.js


	{
		module: "hourlyforecast",
		position: "top_right",
		config: {
			forecastEndpoint: "forecast",
			fullday: "HH [h]", 	// "ddd" in case of daily forecast falls back of using free API or "HH [h]" for hourly forecast
			showRain_Snow: true, 	// snow show only in winter months
						// See weatherforeast default module 'Configuration options' for more information.
		}
	}