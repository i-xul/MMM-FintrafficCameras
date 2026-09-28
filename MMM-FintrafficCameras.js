/* global Log, Module */

/**
 * MMM-FintrafficCameras
 *
 * MagicMirror² module for displaying Fintraffic road weather cameras
 * and related road weather observations.
 */

Module.register("MMM-FintrafficCameras", {
	defaults: {
		cameras: []
	},

	start () {
		Log.info(`Starting module: ${this.name}`);

		this.overlayOpen = false;
		this.cameraData = null;
		this.selectedCameraId = null;
		this.selectedPresetId = null;
		this.errorMessage = null;
	},

	getStyles () {
		return ["MMM-FintrafficCameras.css"];
	},

	getDom () {
		const wrapper = document.createElement("div");
		wrapper.className = "mmm-fintraffic-cameras";

		const button = document.createElement("button");
		button.className = "mmm-fintraffic-cameras__button";
		button.type = "button";
		button.textContent = "Kelikamerat";

		button.addEventListener("click", () => {
			this.openOverlay();
		});

		wrapper.appendChild(button);

		if (this.overlayOpen) {
			wrapper.appendChild(this.createOverlay());
		}

		return wrapper;
	},

	openOverlay () {
		this.overlayOpen = true;
		this.cameraData = null;
		this.selectedCameraId = null;
		this.selectedPresetId = null;
		this.errorMessage = null;

		this.sendSocketNotification("FINTRAFFIC_GET_CAMERAS", {
			cameras: this.config.cameras
		});

		this.updateDom();
	},

	closeOverlay () {
		this.overlayOpen = false;
		this.updateDom();
	},

	createOverlay () {
		const overlay = document.createElement("div");
		overlay.className = "mmm-fintraffic-cameras__overlay";

		const panel = document.createElement("div");
		panel.className = "mmm-fintraffic-cameras__panel";

		const closeButton = document.createElement("button");
		closeButton.className = "mmm-fintraffic-cameras__close";
		closeButton.type = "button";
		closeButton.textContent = "×";

		closeButton.addEventListener("click", () => {
			this.closeOverlay();
		});

		const title = document.createElement("div");
		title.className = "mmm-fintraffic-cameras__title";
		title.textContent = "Kelikamerat";

		const content = document.createElement("div");
		content.className = "mmm-fintraffic-cameras__content";

		if (this.errorMessage) {
			content.textContent = this.errorMessage;
		} else if (!this.cameraData) {
			content.textContent = "Ladataan kameratietoja…";
		} else {
			content.appendChild(this.createCameraView());
		}

		panel.appendChild(closeButton);
		panel.appendChild(title);
		panel.appendChild(content);
		overlay.appendChild(panel);

		return overlay;
	},

	getCameraConfig (cameraId) {
		return this.config.cameras.find((camera) => (
			typeof camera === "string"
				? camera === cameraId
				: camera.id === cameraId
		));
	},

	createCameraSelector (cameras) {
		const selector = document.createElement("div");
		selector.className = "mmm-fintraffic-cameras__camera-selector";

		cameras.forEach((camera) => {
			const cameraButton = document.createElement("button");
			cameraButton.type = "button";
			cameraButton.className = "mmm-fintraffic-cameras__camera-button";

			const cameraConfig = this.getCameraConfig(camera.id);
			cameraButton.textContent =
				typeof cameraConfig === "object" && cameraConfig?.label
					? cameraConfig.label
					: camera.name;

			if (camera.id === this.selectedCameraId) {
				cameraButton.classList.add(
					"mmm-fintraffic-cameras__camera-button--active"
				);
			}

			cameraButton.addEventListener("click", () => {
				if (camera.id === this.selectedCameraId) {
					return;
				}

				this.selectedCameraId = camera.id;
				this.selectedPresetId = null;
				this.updateDom();
			});

			selector.appendChild(cameraButton);
		});

		return selector;
	},

	createCameraView () {
		const cameras = this.cameraData.cameras;
		const container = document.createElement("div");

		if (!cameras.length) {
			container.textContent = "Kameroita ei löytynyt.";
			return container;
		}

		if (
			!this.selectedCameraId ||
			!cameras.some((camera) => camera.id === this.selectedCameraId)
		) {
			this.selectedCameraId = cameras[0].id;
			this.selectedPresetId = null;
		}

		if (cameras.length > 1) {
			container.appendChild(this.createCameraSelector(cameras));
		}

		const camera = cameras.find(
			(item) => item.id === this.selectedCameraId
		);

		if (!camera) {
			container.textContent = "Valittua kameraa ei löytynyt.";
			return container;
		}

		const cameraName = document.createElement("div");
		cameraName.className = "mmm-fintraffic-cameras__camera-name";
		cameraName.textContent = camera.name;
		container.appendChild(cameraName);

		if (!camera.presets.length) {
			const noPresets = document.createElement("div");
			noPresets.textContent =
				"Kameralla ei ole käytettävissä olevia kuvakulmia.";
			container.appendChild(noPresets);

			if (camera.weather) {
				container.appendChild(this.createWeatherPanel(camera.weather));
			}

			return container;
		}

		if (
			!this.selectedPresetId ||
			!camera.presets.some(
				(preset) => preset.id === this.selectedPresetId
			)
		) {
			this.selectedPresetId = camera.presets[0].id;
		}

		const presetButtons = document.createElement("div");
		presetButtons.className = "mmm-fintraffic-cameras__presets";

		camera.presets.forEach((preset) => {
			const presetButton = document.createElement("button");
			presetButton.type = "button";
			presetButton.className = "mmm-fintraffic-cameras__preset-button";
			presetButton.textContent = preset.name;

			if (preset.id === this.selectedPresetId) {
				presetButton.classList.add(
					"mmm-fintraffic-cameras__preset-button--active"
				);
			}

			presetButton.addEventListener("click", () => {
				this.selectedPresetId = preset.id;
				this.updateDom();
			});

			presetButtons.appendChild(presetButton);
		});

		container.appendChild(presetButtons);

		const selectedPreset = camera.presets.find(
			(preset) => preset.id === this.selectedPresetId
		);

		if (selectedPreset) {
			const image = document.createElement("img");
			image.className = "mmm-fintraffic-cameras__image";
			image.src = `${selectedPreset.imageUrl}?t=${Date.now()}`;
			image.alt = `${camera.name} – ${selectedPreset.name}`;

			container.appendChild(image);
		}

		if (camera.weather) {
			container.appendChild(this.createWeatherPanel(camera.weather));
		}

		return container;
	},

	formatWeatherValue (value) {
		if (typeof value !== "number") {
			return value;
		}

		return value.toLocaleString("fi-FI", {
			maximumFractionDigits: 1
		});
	},

	formatWindDirection (degrees) {
		if (degrees === null || degrees === undefined) {
			return null;
		}

		const directions = [
			"N",
			"NE",
			"E",
			"SE",
			"S",
			"SW",
			"W",
			"NW"
		];

		const normalizedDegrees = ((degrees % 360) + 360) % 360;
		const index = Math.round(normalizedDegrees / 45) % directions.length;

		return `${this.formatWeatherValue(degrees)}° (${directions[index]})`;
	},

	createWeatherPanel (weather) {
		const panel = document.createElement("div");
		panel.className = "mmm-fintraffic-cameras__weather";

		const title = document.createElement("div");
		title.className = "mmm-fintraffic-cameras__weather-title";
		title.textContent = "Tiesää";
		panel.appendChild(title);

		const grid = document.createElement("div");
		grid.className = "mmm-fintraffic-cameras__weather-grid";

		const measurements = [
			["Ilma", weather.airTemperature, "°C"],
			["Tienpinta", weather.roadTemperature, "°C"],
			["Tuuli", weather.windSpeed, "m/s"],
			["Puuska", weather.windGust, "m/s"],
			["Tuulensuunta", this.formatWindDirection(weather.windDirection), ""],
			["Sade", weather.precipitationIntensity, "mm/h"],
			["Sateen olomuoto", weather.precipitationType, ""],
			["Näkyvyys", weather.visibility, "km"],
			["Sade 24 h", weather.precipitation24h, "mm"]
		];

		measurements.forEach(([label, value, unit]) => {
			if (value === null || value === undefined) {
				return;
			}

			const item = document.createElement("div");
			item.className = "mmm-fintraffic-cameras__weather-item";

			const labelElement = document.createElement("div");
			labelElement.className = "mmm-fintraffic-cameras__weather-label";
			labelElement.textContent = label;

			const valueElement = document.createElement("div");
			valueElement.className = "mmm-fintraffic-cameras__weather-value";
			const formattedValue = this.formatWeatherValue(value);
			valueElement.textContent = unit
				? `${formattedValue} ${unit}`
				: formattedValue;

			item.appendChild(labelElement);
			item.appendChild(valueElement);
			grid.appendChild(item);
		});

		panel.appendChild(grid);

		if (weather.dataUpdatedTime) {
			const updated = document.createElement("div");
			updated.className = "mmm-fintraffic-cameras__weather-updated";

			const updatedTime = new Date(weather.dataUpdatedTime);

			updated.textContent = `Päivitetty ${updatedTime.toLocaleString("fi-FI", {
				day: "2-digit",
				month: "2-digit",
				hour: "2-digit",
				minute: "2-digit"
			})}`;

			panel.appendChild(updated);
		}

		return panel;
	},

	socketNotificationReceived (notification, payload) {
		if (notification === "FINTRAFFIC_CAMERAS") {
			this.cameraData = payload;
			this.errorMessage = null;
			this.updateDom();
		}

		if (notification === "FINTRAFFIC_CAMERAS_ERROR") {
			this.cameraData = null;
			this.errorMessage =
				`Kameratietojen lataaminen epäonnistui: ${payload.message}`;
			this.updateDom();
		}
	}
});
