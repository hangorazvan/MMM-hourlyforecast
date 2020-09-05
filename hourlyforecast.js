Module.register("hourlyforecast",{

	defaults: {
		location: config.location,
		locationID: config.locationID,
		lat: false,
		lon: false,
		appid: "...",
		units: config.units,
		maxNumberOfDays: 7,
		showRain_Snow: true, // snow show only in winter months
		updateInterval: 10 * 60 * 1000, // every 10 minutes
		animationSpeed: 1000,
		timeFormat: config.timeFormat,
		lang: config.language,
		decimalSymbol: config.decimal,
		fade: false,
		fadePoint: 0.25, // Start on 1/4th of the list.
		colored: true,
		scale: true,

		initialLoadDelay: 2500, // 2.5 seconds delay. This delay is used to keep the OpenWeather API happy.
		retryDelay: 2500,

		apiVersion: "2.5",
		apiBase: "https://api.openweathermap.org/data/",
		forecastEndpoint: "forecast",
		excludes: false,

		fullday: "HH [h]" // "ddd" for forecast/daily

		appendLocationNameToHeader: false,
		calendarClass: "calendar",
		tableClass: "xsmall",

		roundTemp: false,

		iconTable: {
			"01d": "wi-day-sunny",
			"02d": "wi-day-cloudy",
			"03d": "wi-cloudy",
			"04d": "wi-cloudy-windy",
			"09d": "wi-showers",
			"10d": "wi-rain",
			"11d": "wi-thunderstorm",
			"13d": "wi-snow",
			"50d": "wi-fog",
			"01n": "wi-night-clear",
			"02n": "wi-night-cloudy",
			"03n": "wi-night-cloudy",
			"04n": "wi-night-cloudy",
			"09n": "wi-night-showers",
			"10n": "wi-night-rain",
			"11n": "wi-night-thunderstorm",
			"13n": "wi-night-snow",
			"50n": "wi-night-alt-cloudy-windy"
		},
	},

	firstEvent: true,
	fetchedLocationName: config.location,

	getTranslations: function() {
		return {
			en: "en.json",
			ro: "ro.json",
		};
	},

	start: function() {
		Log.info("Starting module: " + this.name);
		moment.locale(config.language);
		this.forecast = [];
		this.loaded = false;
		this.scheduleUpdate(this.config.initialLoadDelay);
		this.updateTimer = null;
	},

	getDom: function() {
		var wrapper = document.createElement("div");

		if (this.config.appid === "" || this.config.appid === "YOUR_OPENWEATHER_API_KEY") {
			wrapper.innerHTML = "Please set the correct openweather <i>appid</i> in the config for module: " + this.name + ".";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		if (!this.loaded) {
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "dimmed light";
			return wrapper;
		}

		var table = document.createElement("table");
		table.className = this.config.tableClass;

		for (var f in this.forecast) {
			var forecast = this.forecast[f];

			var row = document.createElement("tr");
			if (this.config.colored) {
				row.className = "colored";
			}
			table.appendChild(row);

			var dayCell = document.createElement("td");
			dayCell.className = "day";
			dayCell.innerHTML = forecast.day;
			row.appendChild(dayCell);

			var iconCell = document.createElement("td");
			iconCell.className = "weather-icon";
			row.appendChild(iconCell);

			var icon = document.createElement("div");
			icon.className = "wi weathericon " + forecast.icon;
			iconCell.appendChild(icon);

			var degreeLabel = "";
			if (this.config.units === "metric" || this.config.units === "imperial") {
				degreeLabel += "&deg;";
			}
			if(this.config.scale) {
				switch(this.config.units) {
				case "metric":
					degreeLabel += "C";
					break;
				case "imperial":
					degreeLabel += "F";
					break;
				case "default":
					degreeLabel = "K";
					break;
				}
			}

			if (this.config.decimalSymbol === "" || this.config.decimalSymbol === " ") {
				this.config.decimalSymbol = ".";
			}

			var maxTempCell = document.createElement("td");
			maxTempCell.innerHTML = forecast.maxTemp.replace(".", this.config.decimalSymbol) + degreeLabel;
			maxTempCell.className = "align-right max-temp";
			row.appendChild(maxTempCell);

			var minTempCell = document.createElement("td");
			minTempCell.innerHTML = forecast.minTemp.replace(".", this.config.decimalSymbol) + degreeLabel;
			minTempCell.className = "align-right min-temp";
			row.appendChild(minTempCell);

			if (this.config.showRain_Snow) {
				var rainCell = document.createElement("td");
				if (isNaN(forecast.rain)) {
					rainCell.className = "align-right shade";
					rainCell.innerHTML = this.translate("No rain");
				} else {
					rainCell.className = "align-right rain";
					if(config.units !== "imperial") {
						rainCell.innerHTML = parseFloat(forecast.rain).toFixed(1).replace(".", this.config.decimalSymbol) + " l/m&sup3;";
					} else {
						rainCell.innerHTML = (parseFloat(forecast.rain) / 25.4).toFixed(2).replace(".", this.config.decimalSymbol) + " in";
					}
				}
				row.appendChild(rainCell);

				var winter = moment().format("MM");
    	    	if ((winter >= "01" && winter <= "03") || (winter >= "11" && winter <= "12")) {
					var snowCell = document.createElement("td");
					if (isNaN(forecast.snow)) {
						snowCell.className = "align-right shade";
						snowCell.innerHTML = this.translate("No snow");
					} else {
						snowCell.className = "align-right snow";
						if(config.units !== "imperial") {
							snowCell.innerHTML = parseFloat(forecast.snow).toFixed(1).replace(".", this.config.decimalSymbol) + " mm";
						} else {
							snowCell.innerHTML = (parseFloat(forecast.snow) / 25.4).toFixed(2).replace(".", this.config.decimalSymbol) + " in";
						}
					}
					row.appendChild(snowCell);
				}
			}

			if (this.config.fade && this.config.fadePoint < 1) {
				if (this.config.fadePoint < 0) {
					this.config.fadePoint = 0;
				}
				var startingPoint = this.forecast.length * this.config.fadePoint;
				var steps = this.forecast.length - startingPoint;
				if (f >= startingPoint) {
					var currentStep = f - startingPoint;
					row.style.opacity = 1 - (1 / steps * currentStep);
				}
			}
		}

		return table;
	},

	getHeader: function () {
		if (this.config.appendLocationNameToHeader) {
			if (this.data.header) return this.data.header + " " + this.fetchedLocationName;
			else return this.fetchedLocationName;
		}

		return this.data.header ? this.data.header : "";
	},

	notificationReceived: function(notification, payload, sender) {
		if (notification === "Document Object Model created") {
			if (this.config.appendLocationNameToHeader) {
				this.hide(0, {lockString: this.identifier});
			}
		}
		if (notification === "CALENDAR_EVENTS") {
			var senderClasses = sender.data.classes.toLowerCase().split(" ");
			if (senderClasses.indexOf(this.config.calendarClass.toLowerCase()) !== -1) {
				this.firstEvent = false;

				for (var e in payload) {
					var event = payload[e];
					if (event.location || event.geo) {
						this.firstEvent = event;
						//Log.log("First upcoming event with location: ", event);
						break;
					}
				}
			}
		}
	},

	updateWeather: function() {
		if (this.config.appid === "") {
			Log.error("WeatherForecast: APPID not set!");
			return;
		}

		var url = this.config.apiBase + this.config.apiVersion + "/" + this.config.forecastEndpoint + this.getParams();
		var self = this;
		var retry = true;

		var weatherRequest = new XMLHttpRequest();
		weatherRequest.open("GET", url, true);
		weatherRequest.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.processWeather(JSON.parse(this.response));
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);

					if (self.config.forecastEndpoint === "forecast/daily") {
						self.config.forecastEndpoint = "forecast";
						Log.warn(self.name + ": Your AppID does not support long term forecasts. Switching to fallback endpoint.");
					}
					retry = true;
				} else {
					Log.error(self.name + ": Could not load weather.");
				}

				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		weatherRequest.send();
	},

	getParams: function() {
		var params = "?";
		if (this.config.locationID) {
			params += "id=" + this.config.locationID;
		} else if (this.config.lat && this.config.lon) {
			params += "lat=" + this.config.lat + "&lon=" + this.config.lon;
		} else if (this.config.location) {
			params += "q=" + this.config.location;
		} else if (this.firstEvent && this.firstEvent.geo) {
			params += "lat=" + this.firstEvent.geo.lat + "&lon=" + this.firstEvent.geo.lon;
		} else if (this.firstEvent && this.firstEvent.location) {
			params += "q=" + this.firstEvent.location;
		} else {
			this.hide(this.config.animationSpeed, { lockString: this.identifier });
			return;
		}

		var numberOfDays;
		if (this.config.forecastEndpoint === "forecast") {
			numberOfDays = this.config.maxNumberOfDays < 1 || this.config.maxNumberOfDays > 5 ? 5 : this.config.maxNumberOfDays;
			numberOfDays = numberOfDays * 8 - (Math.round(new Date().getHours() / 3) % 8);
		} else {
			numberOfDays = this.config.maxNumberOfDays < 1 || this.config.maxNumberOfDays > 17 ? 7 : this.config.maxNumberOfDays;
		}
		params += "&cnt=" + numberOfDays;
		params += "&exclude=" + this.config.excludes;
		params += "&units=" + this.config.units;
		params += "&lang=" + this.config.lang;
		params += "&APPID=" + this.config.appid;

		return params;
	},

	parserDataWeather: function(data) {
		if (data.hasOwnProperty("main")) {
			data["temp"] = {"min": data.main.temp_min, "max": data.main.temp_max};
		}
		return data;
	},

	processWeather: function (data) {
		if (data.city) {
			this.fetchedLocationName = data.city.name + ", " + data.city.country;
		} else if (this.config.location) {
			this.fetchedLocationName = this.config.location;
		} else {
			this.fetchedLocationName = "Unknown";
		}

		this.forecast = [];
		var lastDay = null;
		var forecastData = {};
		var forecastList = null;
		if (data.list) {
			forecastList = data.list;
		} else if (data.daily) {
			forecastList = data.daily;
		} else {
			Log.error("Unexpected forecast data");
			return undefined;
		}

		for (var i = 0, count = forecastList.length; i < count; i++) {
			var forecast = forecastList[i];
			forecast = this.parserDataWeather(forecast); // hack issue #1017

			var day;
			var hour;
			if (forecast.dt_txt) {
				day = moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss").format(this.config.fullday);
				hour = moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss").format("H");
			} else {
				day = moment(forecast.dt, "X").format("ddd");
				hour = moment(forecast.dt, "X").format("H");
			}

			if (day !== lastDay) {
				forecastData = {
					day: day,
					icon: this.config.iconTable[forecast.weather[0].icon],
					maxTemp: this.roundValue(forecast.temp.max),
					minTemp: this.roundValue(forecast.temp.min),
					rain: this.processRain(forecast, forecastList),
					snow: this.processSnow(forecast, forecastList),
				};

				this.forecast.push(forecastData);
				lastDay = day;

				if (this.forecast.length === this.config.maxNumberOfDays) {
					break;
				}
			} else {
				forecastData.maxTemp = forecast.temp.max > parseFloat(forecastData.maxTemp) ? this.roundValue(forecast.temp.max) : forecastData.maxTemp;
				forecastData.minTemp = forecast.temp.min < parseFloat(forecastData.minTemp) ? this.roundValue(forecast.temp.min) : forecastData.minTemp;
				if (hour >= 6 && hour <= 18) {
					forecastData.icon = this.config.iconTable[forecast.weather[0].icon];
				}
			}
		}

		this.show(this.config.animationSpeed, { lockString: this.identifier });
		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
	},

	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		clearTimeout(this.updateTimer);
		this.updateTimer = setTimeout(function() {
			self.updateWeather();
		}, nextLoad);
	},

	ms2Beaufort: function(ms) {
		var kmh = ms * 60 * 60 / 1000;
		var speeds = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117, 1000];
		for (var beaufort in speeds) {
			var speed = speeds[beaufort];
			if (speed > kmh) {
				return beaufort;
			}
		}
		return 12;
	},

	roundValue: function(temperature) {
		var decimals = this.config.roundTemp ? 0 : 1;
		return parseFloat(temperature).toFixed(decimals);
	},

	processRain: function(forecast, allForecasts) {
		if (!isNaN(forecast.rain)) {
			return forecast.rain;
		}

		var checkDateTime = forecast.dt_txt ? moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss") : moment(forecast.dt, "X");
		var daysForecasts = allForecasts.filter(function (item) {
			var itemDateTime = item.dt_txt ? moment(item.dt_txt, "YYYY-MM-DD hh:mm:ss") : moment(item.dt, "X");
			return itemDateTime.isSame(checkDateTime, "day") && item.rain instanceof Object;
		});

		//If no rain this day return undefined so it wont be displayed for this day
		if (daysForecasts.length === 0) {
			return undefined;
		}

		//Summarize all the rain from the matching days
		return daysForecasts
			.map(function (item) {
				return Object.values(item.rain)[0];
			})
			.reduce(function (a, b) {
				return a + b;
			}, 0);
	},

	processSnow: function(forecast, allForecasts) {
		if (!isNaN(forecast.snow)) {
			return forecast.snow;
		}

		var checkDateTime = forecast.dt_txt ? moment(forecast.dt_txt, "YYYY-MM-DD hh:mm:ss") : moment(forecast.dt, "X");
		var daysForecasts = allForecasts.filter(function (item) {
			var itemDateTime = item.dt_txt ? moment(item.dt_txt, "YYYY-MM-DD hh:mm:ss") : moment(item.dt, "X");
			return itemDateTime.isSame(checkDateTime, "day") && item.snow instanceof Object;
		});

		//If no rain this day return undefined so it wont be displayed for this day
		if (daysForecasts.length === 0) {
			return undefined;
		}

		//Summarize all the rain from the matching days
		return daysForecasts
			.map(function (item) {
				return Object.values(item.snow)[0];
			})
			.reduce(function (a, b) {
				return a + b;
			}, 0);
	}
});