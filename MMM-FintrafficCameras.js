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

	getStyles () {
		return ["MMM-FintrafficCameras.css"];
	},

	start () {
		Log.info(`Starting module: ${this.name}`);
	},

	getDom () {
		const wrapper = document.createElement("div");
		wrapper.className = "mmm-fintraffic-cameras";

		const button = document.createElement("button");
		button.className = "mmm-fintraffic-cameras__button";
		button.type = "button";
		button.textContent = "Kelikamerat";

		wrapper.appendChild(button);

		return wrapper;
	}
});