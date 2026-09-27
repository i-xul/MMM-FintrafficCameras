const Log = require("logger");
const NodeHelper = require("node_helper");

const API_BASE_URL = "https://tie.digitraffic.fi/api/weathercam/v1/stations";
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

		const cameraIds = payload.cameras;

		Log.info(
			`MMM-FintrafficCameras: camera data requested for ${cameraIds.length} station(s)`
		);

		try {
			const cameras = await Promise.all(
				cameraIds.map((cameraId) => this.fetchCamera(cameraId))
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

	async fetchCamera (cameraId) {
		const response = await fetch(`${API_BASE_URL}/${cameraId}`, {
			headers: {
				"Digitraffic-User": DIGITRAFFIC_USER
			}
		});

		if (!response.ok) {
			throw new Error(
				`Camera ${cameraId} request failed with HTTP ${response.status}`
			);
		}

		const data = await response.json();

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
	}
});