# Roadmap

## v0.1 - Initial MVP

Goal: provide a simple and reliable MagicMirror² interface for selected
Fintraffic road weather cameras and their related road weather observations.

### Project foundation

- [x] Verify access to Fintraffic camera station data
- [x] Verify camera preset metadata
- [x] Verify direct JPEG camera image access
- [x] Verify `nearestWeatherStationId`
- [x] Verify current road weather observations
- [x] Verify sensor-specific road weather history
- [x] Define initial architecture
- [ ] Create initial MagicMirror² module files
- [ ] Add development configuration and tooling

### Camera data

- [ ] Read configured camera station IDs
- [ ] Fetch camera station metadata
- [ ] Filter unavailable camera presets
- [ ] Support multiple presets per camera station
- [ ] Display the selected camera image
- [ ] Handle unavailable camera images gracefully

### Road weather data

- [ ] Use `nearestWeatherStationId` from camera metadata
- [ ] Fetch current road weather observations
- [ ] Normalize relevant sensor values
- [ ] Display available air temperature
- [ ] Display available road surface temperature
- [ ] Display available road condition
- [ ] Display available precipitation type and intensity
- [ ] Display available wind speed and gust
- [ ] Display available visibility
- [ ] Omit unavailable measurements gracefully

### User interface

- [ ] Add a button for opening the camera interface
- [ ] Add camera station selection
- [ ] Add preset selection
- [ ] Add camera overlay
- [ ] Add road weather information panel
- [ ] Add close/back controls
- [ ] Ensure the interface works on a typical MagicMirror display

### API behaviour

- [ ] Add appropriate Digitraffic request headers
- [ ] Avoid unnecessary API requests
- [ ] Respect camera and weather data update intervals
- [ ] Add API error handling
- [ ] Add loading states
- [ ] Add Fintraffic data attribution

### Documentation

- [ ] Document installation
- [ ] Document configuration
- [ ] Add example configuration
- [ ] Document supported road weather values
- [ ] Add screenshots after the UI is stable

## v0.2 - Historical road weather graphs

- [ ] Fetch configurable sensor-specific history
- [ ] Add 24-hour air temperature graph
- [ ] Add 24-hour road surface temperature graph
- [ ] Add precipitation history
- [ ] Handle gaps in historical measurements
- [ ] Keep historical API requests separate from current observations

## Later development

Possible future features:

- historical road weather camera images
- additional road weather measurements
- configurable weather panel fields
- map-based camera discovery
- larger camera directories
- improved camera browsing and filtering
- localization