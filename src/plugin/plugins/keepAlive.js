const http = require('http');
const fs = require('fs');
const path = require('path');

const keepAlive = {
    name: 'KeepAlive Plugin',
    version: '1.0.0',
    author: 'Blacky',
    initialize: (client) => {
        if (client.config.keepAlive) {
            const server = http.createServer((req, res) => {
                if (req.url === '/') {
                    // Leer el archivo HTML
                    fs.readFile(path.join(__dirname, 'index.html'), 'utf-8', (err, data) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Error loading the HTML file.');
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(data);
                    });
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(`I'm alive! Currently serving ${client.guilds.cache.size} guilds.`);
                }
            });

            server.listen(3000, () => {
                client.logger.info('Keep-Alive server is running on port 3000');
            });
        }
    },
};

module.exports = keepAlive;
