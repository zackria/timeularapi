/**
 * `timeularapi` module that provides functions to connect to a Timeular device and receive position updates.
 * @author Zack Dawood
 * @date 14-Dec-2024
 * @version 1.0
 */

// Import the noble library for Bluetooth communication
const noble = require("@abandonware/noble");

// Configuration constants
const DEVICE_NAME_FILTER = "Timeular"; // Filter for Timeular devices
const INDICATE_PROPERTY = "indicate"; // Property to filter for characteristics that can indicate
let initialPosition = null; // Variable to store the initial position
let currentPosition = null; // Variable to store the current position

/**
 * Start scanning for Bluetooth devices.
 * @returns {Promise} Resolves when scanning starts successfully, rejects otherwise.
 */
async function startScanning() {
  return new Promise((resolve, reject) => {
    if (!noble.listenerCount("stateChange")) {
      noble.on("stateChange", async (state) => {
        if (state === "poweredOn") {
          console.log("Bluetooth powered on. Starting scanning...");
          try {
            await noble.startScanningAsync([], true); // Enable duplicate scanning
            resolve();
          } catch (err) {
            reject(err);
          }
        } else {
          console.log("Bluetooth not powered on. Stopping scanning...");
          noble.stopScanning();
          reject(new Error("Bluetooth not powered on"));
        }
      });
    }

    if (noble.state === "poweredOn") {
      console.log("Starting scanning...");
      noble.startScanningAsync([], true).then(resolve).catch(reject);
    }
  });
}

// Add stopScanningAsync method to noble if it doesn't exist
noble.stopScanningAsync =
  noble.stopScanningAsync ||
  function () {
    return new Promise((resolve) => {
      noble.stopScanning();
      resolve();
    });
  };

/**
 * Discover a specific device by name.
 * @param {string} deviceNameFilter - The name filter to match devices.
 * @returns {Promise} Resolves with the discovered peripheral.
 */
function discoverDevice(deviceNameFilter) {
  return new Promise((resolve) => {
    noble.on("discover", (peripheral) => {
      const deviceName = peripheral.advertisement.localName;
      if (deviceName && deviceName.includes(deviceNameFilter)) {
        console.log(`Discovered device: ${deviceName}`);
        noble.stopScanning();
        resolve(peripheral);
      }
    });
  });
}

/**
 * Connect to the device.
 * @param {Object} peripheral - The peripheral to connect to.
 * @param {Function} onPositionUpdate - Callback function for position updates.
 * @returns {Promise} Resolves when connected successfully.
 */
function connectToDevice(peripheral, onPositionUpdate) {
  return new Promise((resolve, reject) => {
    peripheral.connect((err) => {
      if (err) {
        reject(err);
      } else {
        console.log(`Connected to ${peripheral.advertisement.localName}`);
        resolve();
      }
    });

    peripheral.once("disconnect", async () => {
      console.log("Disconnected from device");
      console.log("Attempting to restart scanning...");
      try {
        await noble.stopScanningAsync();
        await initializeConnection(onPositionUpdate);
        console.log("Scanning restarted successfully");
      } catch (err) {
        console.error("Error restarting scan:", err);
      }
    });
  });
}

/**
 * Initialize the connection to the Timeular device and set up position updates.
 * @param {Function} onPositionUpdate - Callback function for position updates.
 */
async function initializeConnection(onPositionUpdate) {
  try {
    // Step 1: Start scanning for devices
    await startScanning();
    console.log("Scanning started...");

    // Step 2: Discover a device with "Timeular" in its name
    const device = await discoverDevice(DEVICE_NAME_FILTER);
    console.log(`Discovered device: ${device.advertisement.localName}`);

    // Step 3: Connect to the discovered device
    await connectToDevice(device, onPositionUpdate);
    console.log(`Connected to device: ${device.advertisement.localName}`);

    // Step 4: Discover services and characteristics
    const { services, characteristics } =
      await discoverServicesAndCharacteristics(device);

    const indicateUUIDs = [];
    services.forEach((service) => {
      service.characteristics.forEach((char) => {
        if (char.properties.includes(INDICATE_PROPERTY)) {
          indicateUUIDs.push(char.uuid);
        }
      });
    });

    // Step 5: Find the characteristic for position updates
    const positionCharacteristicUUID = indicateUUIDs[0];
    const positionCharacteristic = findCharacteristic(
      characteristics,
      positionCharacteristicUUID
    );

    if (!positionCharacteristic) {
      console.error("Position characteristic not found!");
      return;
    }

    // Step 6: Read the initial position
    const initialData = await readCharacteristic(positionCharacteristic);
    initialPosition = parsePositionData(initialData);
    console.log(`Initial Position: ${initialPosition}`);

    if (typeof onPositionUpdate === "function") {
      onPositionUpdate(initialPosition);
    }

    // Step 7: Subscribe to updates
    subscribeToCharacteristic(positionCharacteristic, (data) => {
      currentPosition = parsePositionData(data);
      console.log(`Position Update: ${currentPosition}`);
      if (typeof onPositionUpdate === "function") {
        onPositionUpdate(currentPosition);
      }
    });

    console.log("Subscribed to position updates. Waiting for data...");
  } catch (error) {
    console.error("Error:", error);
  }
}

/**
 * Discover services and characteristics of a peripheral.
 * @param {Object} peripheral - The peripheral to discover services and characteristics for.
 * @returns {Promise} Resolves with an object containing services and characteristics.
 */
function discoverServicesAndCharacteristics(peripheral) {
  return new Promise((resolve, reject) => {
    peripheral.discoverAllServicesAndCharacteristics(
      (err, services, characteristics) => {
        if (err) {
          reject(err);
        } else {
          console.log("Discovered Services and Characteristics");
          resolve({ services, characteristics });
        }
      }
    );
  });
}

/**
 * Find a characteristic by UUID.
 * @param {Array} characteristics - The list of characteristics.
 * @param {string} uuid - The UUID of the characteristic to find.
 * @returns {Object|null} The characteristic if found, null otherwise.
 */
function findCharacteristic(characteristics, uuid) {
  if (!uuid) {
    console.error("UUID not provided");
    return null;
  }
  const characteristic = characteristics.find((c) => c.uuid === uuid);
  if (!characteristic) {
    console.error(`Characteristic with UUID ${uuid} not found`);
  }
  return characteristic;
}

/**
 * Automatically find a characteristic by properties.
 * @param {Array} characteristics - The list of characteristics.
 * @param {string} property - The property to filter by.
 * @returns {Object|null} The characteristic if found, null otherwise.
 */
function findCharacteristicByProperties(characteristics, property) {
  return characteristics.find((c) => c.properties.includes(property));
}

/**
 * Read data from a characteristic.
 * @param {Object} characteristic - The characteristic to read from.
 * @returns {Promise} Resolves with the data read from the characteristic.
 */
function readCharacteristic(characteristic) {
  return new Promise((resolve, reject) => {
    characteristic.read((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * Subscribe to characteristic updates.
 * @param {Object} characteristic - The characteristic to subscribe to.
 * @param {Function} onDataCallback - Callback function for data updates.
 */
function subscribeToCharacteristic(characteristic, onDataCallback) {
  characteristic.subscribe((err) => {
    if (err) {
      console.error("Subscription error:", err);
    } else {
      console.log("Subscribed to characteristic updates");
      characteristic.on("data", onDataCallback);
    }
  });
}

/**
 * Parse position data from a buffer.
 * @param {Buffer} data - The data buffer to parse.
 * @returns {string} The parsed position data as a hex string.
 */
function parsePositionData(data) {
  return data.toString("hex");
}

// Library interface
module.exports = {
  initializeConnection,
  startScanning,
  discoverDevice,
  connectToDevice,
  discoverServicesAndCharacteristics,
  findCharacteristic,
  findCharacteristicByProperties,
  readCharacteristic,
  subscribeToCharacteristic,
  parsePositionData,
};