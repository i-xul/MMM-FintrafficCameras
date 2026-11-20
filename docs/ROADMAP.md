
# Roadmap

## v0.1 - Initial MVP

Goal: provide a simple and reliable MagicMirror² interface for selected
Fintraffic road weather cameras and their related road weather observations.

The core functionality has been implemented and tested with MagicMirror².
The remaining work focuses on reliability, documentation, and release readiness.

### Project foundation

- [x] Verify access to Fintraffic camera station data
- [x] Verify camera preset metadata
- [x] Verify direct JPEG camera image access
- [x] Verify `nearestWeatherStationId`
- [x] Verify current road weather observations
- [x] Verify sensor-specific road weather history
- [x] Define initial architecture
- [x] Create initial MagicMirror² module files
- [ ] Add development configuration and tooling

### Camera data

- [x] Read configured camera station IDs
- [x] Fetch camera station metadata
- [x] Filter unavailable camera presets
- [x] Support multiple presets per camera station
- [x] Display the selected camera image
- [x] Handle unavailable camera images gracefully

### Road weather data

- [x] Use `nearestWeatherStationId` from camera metadata
- [x] Fetch current road weather observations
- [x] Normalize relevant sensor values
- [x] Display available air temperature
- [x] Display available road surface temperature
- [ ] Investigate and implement available road condition data
- [x] Display available precipitation type and intensity
- [x] Display available wind speed and gust
- [x] Display available visibility
- [x] Omit unavailable measurements gracefully
- [x] Display available wind direction
- [x] Display available 24-hour precipitation total

### User interface

- [x] Add a button for opening the camera interface
- [x] Add camera station selection
- [x] Add preset selection
- [x] Add camera overlay
- [x] Add road weather information panel
- [x] Add close controls
- [x] Verify the interface in a desktop browser
- [x] Verify the interface on an 800x1280 MagicMirror touchscreen
- [ ] Improve overlay overflow handling for smaller displays

### API behaviour

- [x] Add appropriate Digitraffic request headers
- [x] Avoid continuous API requests while the overlay is closed
- [x] Add configurable image refresh interval (default: 60 seconds)
- [x] Add configurable camera and weather refresh interval (default: 5 minutes)
- [x] Add basic API error handling
- [x] Add loading states
- [x] Preserve previously loaded data when a refresh fails
- [x] Add Fintraffic data attribution to the interface

### Documentation

- [ ] Document installation
- [ ] Document configuration
- [ ] Add example configuration
- [ ] Document supported road weather values
- [ ] Update architecture documentation to reflect the implementation
- [ ] Add screenshots after the UI is stable
- [ ] Prepare v0.1 release notes

## v0.2 - Historical road weather graphs

- [ ] Fetch configurable sensor-specific history
- [ ] Add 24-hour air temperature graph
- [ ] Add 24-hour road surface temperature graph
- [ ] Add precipitation history
- [ ] Handle gaps in historical measurements
- [ ] Keep historical API requests separate from current observations

## Later development

### Reliability and optimization

- [ ] Consider caching precipitation sensor value descriptions
- [ ] Consider handling individual camera failures independently
- [ ] Avoid unnecessary JPEG reloads during weather data updates
- [ ] Make the overlay independent of its MagicMirror region
- [ ] Improve defensive handling of incomplete API responses

### Possible future features

- Historical road weather camera images
- Additional road weather measurements
- Configurable weather panel fields
- Map-based camera discovery
- Larger camera directories
- Improved camera browsing and filtering
- Localization
