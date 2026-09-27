# MMM-FintrafficCameras

A MagicMirror² module for displaying Finnish road weather camera images and
related road weather observations using Fintraffic's Digitraffic APIs.

## Project status

Early development.

The initial API prototype has verified access to:

- Fintraffic road weather camera stations
- camera presets and JPEG images
- the nearest road weather station associated with a camera station
- current road weather observations
- sensor-specific road weather history

## Planned v0.1

The first version will provide:

- a configurable list of road weather camera stations
- a button for opening the camera view
- camera station selection
- selection between available camera presets
- a large view of the selected camera image
- related observations from the camera's nearest road weather station
- graceful handling of unavailable sensors or camera presets
- Fintraffic data attribution

The initial road weather panel is planned to include available values such as:

- air temperature
- road surface temperature
- road condition
- precipitation type and intensity
- wind speed
- wind gust
- visibility

## Future development

Possible later features include:

- 24-hour road weather history graphs
- historical road weather camera images
- additional road weather measurements
- map-based camera selection
- larger camera directories

See [ROADMAP.md](docs/ROADMAP.md) for the planned development stages.

## Data source

Road weather camera images and road weather data are provided by Fintraffic
through the Digitraffic service.

## License

This project is licensed under the MIT License.