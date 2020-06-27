# hourlyforecast

Modified MagicMirror2 weatherforecast including snow amount only for winter mounths

https://forum.magicmirror.builders/topic/12201/snow-amount-on-weather-forecast

<img src=https://github.com/hangorazvan/hourlyforecast/blob/master/preview.png>

Use this module or modify yourself the default module.
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
			forecastEndpoint: "forecast",
			showSnowAmount: true, // only for winter months
			// See weatherforeast default module 'Configuration options' for more information.
		}
	}

Weather Forecast Snow Amounts

after the rain amount in getDom put this code 

		var winter = moment().format("MM");
		if ((winter >= "01" && winter <= "03") || (winter >= "11" && winter <= "12")) {
			if (this.config.showSnowAmount) {
				var snowCell = document.createElement("td");
				if (isNaN(forecast.snow)) {
					snowCell.innerHTML = "<span>no snow</span>";
				} else {
					if(config.units !== "imperial") {
						snowCell.innerHTML = parseFloat(forecast.snow).toFixed(1).replace(".", this.config.decimalSymbol) + " mm";
					} else {
						snowCell.innerHTML = (parseFloat(forecast.snow) / 25.4).toFixed(2).replace(".", this.config.decimalSymbol) + " in";
					}
				}
				snowCell.className = "align-right xsmall snow";
				row.appendChild(snowCell);
			}
		}

on processWeather you add:

	snow: this.processSnow(forecast, data.list) // snow amount

then after processRain you add processSnow:

	processSnow: function(forecast, allForecasts) {
		//If the amount of snow actually is a number, return it
		if (!isNaN(forecast.snow)) {
			return forecast.snow;
		}

		//Find all forecasts that is for the same day
		var checkDateTime = (!!forecast.dt_txt) ? moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss") : moment(forecast.dt, "X");
		var daysForecasts = allForecasts.filter(function(item) {
			var itemDateTime = (!!item.dt_txt) ? moment(item.dt_txt, "YYYY-MM-DD hh:mm:ss") : moment(item.dt, "X");
			return itemDateTime.isSame(checkDateTime, "day") && item.snow instanceof Object;
		});

		//If no snow this day return undefined so it wont be displayed for this day
		if (daysForecasts.length === 0) {
			return undefined;
		}

		//Summarize all the snow from the matching days
		return daysForecasts.map(function(item) {
			return Object.values(item.snow)[0];
		}).reduce(function(a, b) {
			return a + b;
		}, 0);
	}
