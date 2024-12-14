# index.js functionality & documentation

## Purpose

- This script serves as an example of how to interact with the timeularapi module's initializeConnection function, providing a callback mechanism to handle incoming data (new positions) dynamically.

## Functionality

### Import Statement:

- Destructures and imports the initializeConnection function from the timeularapi module.

### Asynchronous IIFE:

- Wraps the logic in an immediately invoked asynchronous function to allow await usage and scoped execution.

### Callback Function:

- Passes a callback to the initializeConnection function.
The callback logs the received newPosition to the console.

### Error Handling:

- Catches and logs any errors encountered during the asynchronous operation.

```javascript
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
```
