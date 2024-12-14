# Timeular Node.js Electron App

### Getting Started 

- Step 1: Checkout the code 
- Step 2: Install Node.js 
- Step 3: npm install
- Step 4: Run the app 

### Runnning the app 

`node index.js`


### Runnning the via npm  

`node start`

### API Documentation
[timeularapi.md](./timeularapi.md)

### Sample client code documentation

[index.md](./index.md)

### Library used
[https://www.npmjs.com/package/@abandonware/noble](https://www.npmjs.com/package/@abandonware/noble)

#### Initial Setup if you are building ground up 

`npm init`

`npm install @abandonware/noble`


#### If you still face issues, ensure you have the necessary tools to compile native bindings:

- On macOS:

```bash
xcode-select --install
```

- On Linux:

```bash
sudo apt-get install build-essential
```

- On Windows: Install Windows Build Tools:
```shell
npm install --global windows-build-tools
```

#### Rebuild Native Modules

```bash
npm rebuild
```

#### Check Dependencies and Update
```bash
rm -rf node_modules package-lock.json
npm install
```

### Upcoming Integration Releases 
1. Hackaru [https://github.com/hackaru-app](https://github.com/hackaru-app)
2. Clockify [https://app.clockify.me/tracker](https://app.clockify.me/tracker)
3. Traggo [https://github.com/traggo/](https://github.com/traggo/)
4. toggl [https://toggl.com/](https://toggl.com/)