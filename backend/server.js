const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const allowedOrigin = 'https://minihack-class-24.onrender.com';

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Serve frontend from same backend
    if (req.url === '/' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'index.html');

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading index.html');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
        return;
    }

    // Check login status
    if (req.url === '/httponly-cookie/check' && req.method === 'GET') {
        const cookie = req.headers.cookie;

        if (cookie && cookie.includes('token=R99R')) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Logged in' }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Not logged in' }));
        }
    }

    // Login
    else if (req.url === '/httponly-cookie/login' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const { username, password } = JSON.parse(body);

                if (username === 'admin' && password === '4444') {
                    res.writeHead(200, {
                        'Set-Cookie': 'token=R99R; HttpOnly; Path=/; SameSite=None; Secure',
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({ message: 'Logged in successfully' }));
                    console.log('Logged in');
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid credentials' }));
                }
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid request body' }));
            }
        });
    }

    // Protected route
    else if (req.url === '/httponly-cookie/something' && req.method === 'GET') {
        const cookie = req.headers.cookie;

        if (cookie && cookie.includes('token=R99R')) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'GOLDEN LAPTOP!' }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Unauthorized' }));
        }
    }

    // Logout
    else if (req.url === '/httponly-cookie/logout' && req.method === 'POST') {
        res.writeHead(200, {
            'Set-Cookie': 'token=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure',
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({ message: 'Logged out successfully' }));
    }

    // 404
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on https://minihack-class-24.onrender.com`);
});