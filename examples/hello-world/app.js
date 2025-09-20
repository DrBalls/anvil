const express = require('express');
const path = require('path');
const Logger = require('./logger');

class WebApplication {
    constructor() {
        this.port = 4443;
        this.app = express();
        this.logger = new Logger();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupGracefulShutdown();
    }

    setupMiddleware() {
        // Serve static files from public directory
        this.app.use('/static', express.static(path.join(__dirname, 'public')));
    }

    setupRoutes() {
        // Root route - serve Hello World page
        this.app.get('/', (req, res) => {
            this.logger.logEvent('Request received for /');
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Hello World</title>
                    <link rel="stylesheet" href="/static/style.css">
                </head>
                <body>
                    <div class="container">
                        <h1>Hello, World!</h1>
                        <p>Welcome to our simple Node.js web application!</p>
                    </div>
                </body>
                </html>
            `);
            this.logger.logEvent('Response sent for /');
        });

        // Health check endpoint
        this.app.get('/health', (req, res) => {
            this.logger.logEvent('Health check requested');
            res.json({ status: 'ok', timestamp: new Date().toISOString() });
        });
    }

    setupGracefulShutdown() {
        process.on('SIGTERM', () => {
            this.logger.logEvent('SIGTERM received, shutting down gracefully');
            this.server.close(() => {
                this.logger.logEvent('Server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            this.logger.logEvent('SIGINT received, shutting down gracefully');
            this.server.close(() => {
                this.logger.logEvent('Server closed');
                process.exit(0);
            });
        });
    }

    startServer() {
        this.server = this.app.listen(this.port, () => {
            this.logger.logEvent(`Server started on port ${this.port}`);
            console.log(`Hello World app listening at http://localhost:${this.port}`);
        });

        this.server.on('error', (error) => {
            this.logger.logEvent(`Server error: ${error.message}`);
            console.error('Server error:', error);
        });
    }
}

// Create and start the application
const webApp = new WebApplication();
webApp.startServer();