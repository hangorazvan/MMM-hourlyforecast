# forecast plus

Modified MagicMirror2 weatherforecast with hourly forecast falls back and onecall enpoint option, including snow amount only for winter mounths

https://forum.magicmirror.builders/topic/12201/snow-amount-on-weather-forecast

<img src=https://github.com/hangorazvan/forecast_plus/blob/master/preview.png>
Do not make modification and do not replace the default, just add <i>disable: true</i> in config.js and use this one as 3rd party,

Then put in config.js


	{
		module: "forecast_plus",
		position: "top_right",
		config: {
			locationID: false,		// set locationID to false when use onecall endpoint
			forecastEndpoint: "onecall",	// forecast/daily or onecall
			fullday: "HH [h]", 		// "ddd" in case of onecall & daily forecast, falls back of using free API or "HH [h]" for hourly forecast
			showRain_Snow: true, 		// snow show only in winter months
							// See weatherforeast default module 'Configuration options' for more information.
		}
	}
