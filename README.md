# forecast plus

https://github.com/hangorazvan/forecast_plus (under development)

Modified MagicMirror2 weatherforecast with hourly forecast falls back and onecall enpoint option

https://forum.magicmirror.builders/topic/12201/snow-amount-on-weather-forecast

<img src=https://github.com/hangorazvan/forecast_plus/blob/master/preview.png>
Do not make modification and do not replace the default, just add <i>disable: true</i> in config.js and use this one as 3rd party, then put in config.js

<br>hourly forecast (3 hours)

	{
		module: "weatherforecast_plus",
		position: "top_right",
		config: {
			locationID: "",				// set locationID to false when use onecall endpoint
			forecastEndpoint: "/forecast",		// forecast, forecast/daily or onecall
			fallBack: false,			// force to use fallback endpoint
			fullday: "HH [h]", 			// "ddd" in case of onecall & daily forecast, falls back of using free API or "HH [h]" for hourly forecast
			showRainAmount: true, 			// snow show only in winter months
			extra: false,
								// See weatherforeast default module 'Configuration options' for more information.
		}
	}


daily forecast without fallback (5 days for free API, 16 days for registered API)

	{
		module: "weatherforecast_plus",
		position: "top_right",
		config: {
			locationID: "",				// set locationID to false when use onecall endpoint
			forecastEndpoint: "/forecast/daily",	// forecast, forecast/daily or onecall
			fallBack: false,			// force to use fallback endpoint
			fullday: "ddd", 			// "ddd" in case of onecall & daily forecast, falls back of using free API or "HH [h]" for hourly forecast
			showRainAmount: true, 			// snow show only in winter months
			extra: false,
								// See weatherforeast default module 'Configuration options' for more information.
		}
	}

daily forecast with fallback (5 days)

	{
		module: "weatherforecast_plus",
		position: "top_right",
		config: {
			lat: "",				// set latitude when use onecall endpoint
			lon: "",				// set longitude when use onecall endpoint
			locationID: false,			// set locationID to false when use onecall endpoint
			forecastEndpoint: "/forecast",		// forecast, forecast/daily or onecall
			fallBack: true,				// force to use fallback endpoint
			fullday: "ddd", 			// "ddd" in case of onecall & daily forecast, falls back of using free API or "HH [h]" for hourly forecast
			showRainAmount: true, 			// snow show only in winter months
			extra: false,
								// See weatherforeast default module 'Configuration options' for more information.
		}
	}

	daily forecast with onecall (7 days)

	{
		module: "weatherforecast_plus",
		position: "top_right",
		config: {
			lat: "",				// set latitude when use onecall endpoint
			lon: "",				// set longitude when use onecall endpoint
			locationID: false,			// set locationID to false when use onecall endpoint
			forecastEndpoint: "/onecall",		// forecast, forecast/daily or onecall
			fallBack: true,				// force to use fallback endpoint
			fullday: "ddd", 			// "ddd" in case of onecall & daily forecast, falls back of using free API or "HH [h]" for hourly forecast
			showRainAmount: true, 			// snow show only in winter months
			extra: true,
								// See weatherforeast default module 'Configuration options' for more information.
		}
	}
