const Log = require("logger");
const NodeHelper = require("node_helper");

/**
 * Node helper for MMM-FintrafficCameras.
 *
 * Handles server-side communication with Fintraffic's Digitraffic APIs.
 */
module.exports = NodeHelper.create({
	start () {
		Log.info("Starting node helper for MMM-FintrafficCameras");
	}
});