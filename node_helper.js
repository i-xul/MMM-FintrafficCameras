const Log = require("logger");
const NodeHelper = require("node_helper");

const CAMERA_API_BASE_URL = "https://tie.digitraffic.fi/api/weathercam/v1/stations";
const WEATHER_API_BASE_URL = "https://tie.digitraffic.fi/api/weather/v1/stations";
const SENSOR_API_URL = "https://tie.digitraffic.fi/api/weather/v1/sensors";
const DIGITRAFFIC_USER = "i-xul/MMM-FintrafficCameras";

/**
 * Node helper for MMM-FintrafficCameras.
 *
 * Handles server-side communication with Fintraffic's Digitraffic APIs.
 */
module.exports = NodeHelper.create({
	start () {
		Log.info("Starting node helper for MMM-FintrafficCameras");
	},

	async socketNotificationReceived (notification, payload) {
		if (notification !== "FINTRAFFIC_GET_CAMERAS") {
			return;
		}

		const cameraConfigs = Array.isArray(payload.cameras)
			? payload.cameras
			: [];

		const cameraIds = cameraConfigs
			.map((camera) => (
				typeof camera === "string"
					? camera
					: camera?.id
			))
			.filter(Boolean);

		Log.info(
			`MMM-FintrafficCameras: camera data requested for ${cameraIds.length} station(s)`
		);

		try {
			const precipitationTypes = await this.fetchPrecipitationTypes();

			const cameras = await Promise.all(
				cameraIds.map(async (cameraId) => {
					const camera = await this.fetchCamera(cameraId);

					if (camera.nearestWeatherStationId) {
						camera.weather = await this.fetchWeather(
							camera.nearestWeatherStationId,
							precipitationTypes
						);
					}

					return camera;
				})
			);

			this.sendSocketNotification("FINTRAFFIC_CAMERAS", {
				cameras
			});
		} catch (error) {
			Log.error(
				`MMM-FintrafficCameras: failed to retrieve camera data: ${error.message}`
			);

			this.sendSocketNotification("FINTRAFFIC_CAMERAS_ERROR", {
				message: error.message
			});
		}
	},

	async fetchJson (url) {
		const response = await fetch(url, {
			headers: {
				"Digitraffic-User": DIGITRAFFIC_USER
			}
		});

		if (!response.ok) {
			throw new Error(`Request failed with HTTP ${response.status}: ${url}`);
		}

		return response.json();
	},

	async fetchCamera (cameraId) {
		const data = await this.fetchJson(`${CAMERA_API_BASE_URL}/${cameraId}`);

		return {
			id: data.properties.id,
			name: data.properties.names?.fi ?? data.properties.name,
			municipality: data.properties.municipality,
			nearestWeatherStationId: data.properties.nearestWeatherStationId,
			presets: data.properties.presets
				.filter((preset) => preset.inCollection)
				.map((preset) => ({
					id: preset.id,
					name: preset.presentationName,
					imageUrl: preset.imageUrl,
					resolution: preset.resolution,
					direction: preset.direction
				}))
		};
	},

	async fetchPrecipitationTypes () {
		const data = await this.fetchJson(SENSOR_API_URL);
		const sensor = data.sensors.find((item) => item.id === 25);

		if (!sensor) {
			return {};
		}

		return Object.fromEntries(
			sensor.sensorValueDescriptions.map((description) => [
				Number(description.sensorValue),
				description.descriptionFi
			])
		);
	},

	async fetchWeather (stationId, precipitationTypes) {
		const data = await this.fetchJson(
			`${WEATHER_API_BASE_URL}/${stationId}/data`
		);

		const values = new Map(
			data.sensorValues.map((sensor) => [sensor.id, sensor])
		);

		const getValue = (sensorId) => values.get(sensorId)?.value ?? null;

		const precipitationTypeValue = getValue(25);

		return {
			stationId,
			dataUpdatedTime: data.dataUpdatedTime,
			airTemperature: getValue(1),
			roadTemperature: getValue(3),
			windSpeed: getValue(16),
			windGust: getValue(17),
			windDirection: getValue(18),
			precipitationIntensity: getValue(23),
			precipitationType:
				precipitationTypeValue === null
					? null
					: precipitationTypes[Number(precipitationTypeValue)] ?? null,
			visibility: getValue(26),
			precipitation24h: getValue(215)
		};
	}
});
