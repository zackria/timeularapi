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
