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

	createCameraView () {
		const camera = this.cameraData.cameras[0];
		const container = document.createElement("div");

		if (!camera) {
			container.textContent = "Kameroita ei löytynyt.";
			return container;
		}

		const cameraName = document.createElement("div");
		cameraName.className = "mmm-fintraffic-cameras__camera-name";
		cameraName.textContent = camera.name;
		container.appendChild(cameraName);

		if (!camera.presets.length) {
			const noPresets = document.createElement("div");
			noPresets.textContent = "Kameralla ei ole käytettävissä olevia kuvakulmia.";
			container.appendChild(noPresets);
			return container;
		}

		if (!this.selectedPresetId) {
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
				presetButton.classList.add("mmm-fintraffic-cameras__preset-button--active");
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

		return container;
	},

	socketNotificationReceived (notification, payload) {
		if (notification === "FINTRAFFIC_CAMERAS") {
			this.cameraData = payload;
			this.errorMessage = null;
			this.updateDom();
		}

		if (notification === "FINTRAFFIC_CAMERAS_ERROR") {
			this.cameraData = null;
			this.errorMessage = `Kameratietojen lataaminen epäonnistui: ${payload.message}`;
			this.updateDom();
		}
	}
});