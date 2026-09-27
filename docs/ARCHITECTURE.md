# Architecture

## Overview

MMM-FintrafficCameras is a MagicMirror² module for displaying Finnish road
weather camera images together with related road weather observations.

The module uses Fintraffic's Digitraffic APIs as its data source.

The initial implementation is designed around a user-configured list of
Fintraffic road weather camera station IDs.

## Data flow

The basic data flow is:

    Configured camera station ID
            |
            v
    Camera station metadata
            |
            +----> Camera presets
            |          |
            |          v
            |      JPEG image
            |
            v
    nearestWeatherStationId
            |
            v
    Road weather station
            |
            +----> Current observations
            |
            +----> Sensor-specific history

A camera station can contain multiple presets representing different views or
directions. The module should therefore treat the camera station and individual
camera presets as separate concepts.

## Verified API behaviour

The initial API prototype verified the following behaviour against the live
Digitraffic service.

### Camera stations

Camera station metadata provides:

- station ID
- station name
- coordinates
- collection status
- camera presets
- nearest road weather station ID

Each active camera preset can provide:

- preset ID
- presentation name
- collection status
- image resolution
- direction
- JPEG image URL

A single camera station may contain multiple presets.

### Road weather stations

The camera station metadata provides `nearestWeatherStationId`.

This allows the module to retrieve related road weather observations without
having to calculate the nearest road weather station itself.

Road weather station metadata provides information including:

- station ID
- station name
- coordinates
- collection status
- collection interval
- available sensor IDs

### Current observations

Current road weather data contains individual sensor observations with
information including:

- sensor ID
- sensor name
- measurement time
- measurement unit
- value

The module must not assume that every road weather station provides every
desired measurement. Missing measurements should be omitted gracefully from
the user interface.

### Historical observations

Sensor-specific road weather history is available for a requested time range.

The prototype verified a 24-hour query for a single sensor. The tested station
returned approximately five-minute measurement intervals.

Historical values contain:

- sensor ID
- station ID
- measurement time
- value

Historical values do not contain the full sensor metadata available in the
current observation response. Sensor IDs therefore need to be associated with
their corresponding sensor metadata when historical data is used.

## Initial module components

The first implementation is expected to contain:

- `MMM-FintrafficCameras.js`
  - MagicMirror² module definition
  - UI state
  - camera and preset selection
  - rendering

- `node_helper.js`
  - communication with Digitraffic APIs
  - data retrieval and normalization
  - error handling

- `MMM-FintrafficCameras.css`
  - module button
  - overlay
  - camera view
  - road weather panel

The exact internal structure may be expanded as implementation progresses.

## Configuration

The initial configuration model will use camera station IDs.

Example:

    {
        module: "MMM-FintrafficCameras",
        position: "bottom_right",
        config: {
            cameras: [
                "C01503"
            ]
        }
    }

The module will retrieve the available presets and related road weather station
from the configured camera station metadata.

## Design principles

- Use official Fintraffic/Digitraffic data sources.
- Keep the initial configuration simple.
- Do not require users to configure road weather station IDs manually.
- Do not assume identical sensor availability between stations.
- Avoid unnecessary local data storage.
- Keep API retrieval separate from UI rendering.
- Handle unavailable API data without breaking the MagicMirror interface.
- Design the data layer so historical graphs can be added later without a
  major architectural change.

## Future extensions

The architecture should allow later support for:

- 24-hour road weather graphs
- historical camera images
- additional road weather measurements
- map-based camera discovery
- larger camera directories