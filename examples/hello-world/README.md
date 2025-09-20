# Hello World Web Application

A simple Node.js web application that displays "Hello, World!" with a nice blue background, built following the Anvil capability-driven framework.

## Features

- **Web Server**: Express.js-based Node.js web server running on port 4443
- **Hello World Display**: Beautiful HTML page with styled "Hello, World!" message
- **Event Logging**: Comprehensive logging system that tracks application lifecycle and user interactions
- **Blue Background**: Visually appealing blue background as specified in requirements
- **Graceful Shutdown**: Proper handling of server shutdown signals

## Quick Start

### Option 1: Use Launch Scripts
```bash
# Windows
launch.bat

# Linux/Mac
chmod +x launch.sh
./launch.sh
```

### Option 2: Manual Start
```bash
# Install dependencies
npm install

# Start the application
npm start
```

## Access the Application

Once started, visit: http://localhost:4443

## Capabilities Implemented

### CAP-997490: Logging
- **ENB-507753**: Event Logging
  - Logs stored in `./logs/app.log`
  - Format: `timestamp:event`
  - Auto-creates log directory

### CAP-230875: Web Application
- **ENB-678403**: Javascript Node Application
  - Express.js web server
  - Static file serving
  - Graceful shutdown handling
  - Launch scripts for easy deployment
- **ENB-212431**: Application Lifecycle Logging
  - Logs application start/stop events
  - Logs server events and errors

### CAP-176180: Display Hello World
- **ENB-670075**: Display Hello World
  - HTML page with "Hello, World!" message
  - CSS styling with blue background
  - Display event logging

## Project Structure

```
hello-world/
├── app.js              # Main application file
├── logger.js           # Logging module
├── package.json        # Node.js dependencies
├── launch.bat          # Windows launch script
├── launch.sh           # Linux/Mac launch script
├── public/             # Static files
│   └── style.css       # Application styles
├── logs/               # Generated log files
│   └── app.log         # Application logs
└── specifications/     # Anvil specifications
    ├── 997490-capability.md  # Logging capability
    ├── 230875-capability.md  # Web Application capability
    ├── 176180-capability.md  # Display Hello World capability
    ├── 507753-enabler.md     # Event Logging enabler
    ├── 678403-enabler.md     # Javascript Node Application enabler
    ├── 212431-enabler.md     # Application Lifecycle Logging enabler
    └── 670075-enabler.md     # Display Hello World enabler
```

## Dependencies

- Node.js (v14 or higher)
- Express.js (^4.18.2)

## Development

This application was developed following the Anvil Software Development Plan with:
- Capability-driven architecture
- Structured requirements and design phases
- Complete traceability from capabilities to implementation
- Comprehensive logging and monitoring

All capabilities and enablers have been implemented and tested successfully.