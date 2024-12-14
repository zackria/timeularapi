# timeularapi.js functionality & documentation 

## Code Overview:
This code uses the @abandonware/noble library to interact with Bluetooth Low Energy (BLE) devices, specifically targeting a device named "Timeular." It includes functions to scan for devices, connect to them, and handle data updates from specific BLE characteristics.


## Code Documentation:
### Imports

```javascript 
const noble = require("@abandonware/noble");
```

- Imports the `@abandonware/noble` library for BLE device interaction.


### Constants

```javascript 
const DEVICE_NAME_FILTER = "Timeular";
const INDICATE_PROPERTY = "indicate";

let initialPosition = null;
let currentPosition = null;
```

- `DEVICE_NAME_FILTER`: Filters discovered devices to only match those containing "Timeular" in their name.
- `INDICATE_PROPERTY`: Used to identify characteristics that support "indicate" property.
- `initialPosition` and `currentPosition`: Store initial and current position data from the BLE device.

### 1. Start Scanning for Bluetooth Devices

```javascript 
async function startScanning() { ... }
```
- Starts scanning for BLE devices.
- Resolves if the Bluetooth adapter is powered on; otherwise, stops scanning and rejects.

### 2. Discover a Specific Device
```javascript 
function discoverDevice(deviceNameFilter) { ... }
```

- Listens for device discovery events.
- Filters devices based on the DEVICE_NAME_FILTER and resolves with the matching device.

###  3. Connect to the Device
```javascript 
function connectToDevice(peripheral, onPositionUpdate) { ... }
```

- Establishes a connection to a specific BLE device (`peripheral`).
- Automatically handles device disconnection by restarting scanning and attempting reconnection.

### 4. Discover Services and Characteristics
```javascript 
function discoverServicesAndCharacteristics(peripheral) { ... }
```

- Discovers all services and characteristics of the connected BLE device.
- Resolves with the discovered services and characteristics.

### 5. Find Specific Characteristics
```javascript 
function findCharacteristic(characteristics, uuid) { ... }
```

- Finds a characteristic by its UUID.
- Returns the characteristic object if found; otherwise, logs an error.

```javascript 
function findCharacteristicByProperties(characteristics, property) { ... }
```

- Finds a characteristic by its property (e.g., "indicate" or "notify").

### 6. Read and Parse Data
```javascript 
function readCharacteristic(characteristic) { ... }
```
- Reads data from a specified characteristic and resolves with the data.
```javascript 
function parsePositionData(data) { ... }
```
- Parses position data received from the BLE characteristic and converts it into a hexadecimal string.

### 7. Subscribe to Characteristic Updates
```javascript 
function subscribeToCharacteristic(characteristic, onDataCallback) { ... }
```
- Subscribes to a characteristic for receiving updates.
- Calls onDataCallback whenever new data is received.

### 8. Initialize Connection
```javascript 
async function initializeConnection(onPositionUpdate) { ... }
```

- Orchestrates the entire BLE connection flow:
    1. Scans for devices.
    2. Filters for the "Timeular" device.
    3. Connects to the device.
    4. Discovers services and characteristics.
    5. Reads initial position data.
    6. Subscribes to updates and invokes onPositionUpdate callback with position data.

### Library Interface
```javascript 
module.exports = { ... }
```
- Exports all major functions, enabling them to be used in other modules.

## Key Features:
1. Error Handling: Logs errors during device scanning, connection, or data operations.
2. Dynamic Reconnection: Automatically restarts scanning when the device disconnects.
3. Custom Callbacks: Allows users to provide custom logic for position updates through the onPositionUpdate parameter.

### Usage Example:
```javascript 
const { initializeConnection } = require("./timeularapi.js");

function handlePositionUpdate(position) {
  console.log("New Position Update:", position);
}

initializeConnection(handlePositionUpdate);

```

This would connect to a Timeular device, read its initial position, and log updates dynamically.

---

# Feel free to enhance or update or ask for further clarification!

---