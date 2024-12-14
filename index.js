/**
 * This client script initializes a connection to the Timeular API and listens for new positions.
 * @author Zack Dawood 
 * @date 14-Dec-2024
 * @version 1.0
 */

//Imports the `initializeConnection` function from the `timeularapi` module.
const {
  initializeConnection,
} = require('./timeularapi');

// Asynchronous Immediately Invoked Function Expression (IIFE)
(async () => {
  try {
    /**
     * Calls the `initializeConnection` function and provides a callback.
     * The callback is invoked when a new position is received.
     *
     * @param {Function} newPosition - Callback that receives the new position.
     */
    await initializeConnection((newPosition) => {
      // Logs the new position received to the console.
      console.log("Parent received new position:", newPosition);
    });

  } catch (error) {
    // Handles and logs any errors that occur during the connection initialization.
    console.error(error);
  }
})();
