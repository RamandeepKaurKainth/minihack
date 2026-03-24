const http = require('http');

const server = http.createServer((req, res) => {
    // Put your FRONTEND URL here
    res.setHeader('Access-Control-Allow-Origin', 'https://minihackclass.onrender.com');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/httponly-cookie/check' && req.method === 'GET') {
        const cookie = req.headers.cookie;

        if (cookie && cookie.includes('token=R99R')) {
            res.writeHead(200);
            res.end();
        } else {
            res.writeHead(401);
            res.end();
        }
    }

    else if (req.url === '/httponly-cookie/login' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => body += chunk);

        req.on('end', () => {
            const { username, password } = JSON.parse(body);

            if (username === 'admin' && password === '4444') {
                res.writeHead(200, {
                    'Set-Cookie': 'token=R99R; HttpOnly; Path=/; SameSite=None; Secure',
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({ message: 'Logged in' }));
                console.log('Logged in');
            } else {
                res.writeHead(401);
                res.end();
            }
        });
    }

    else if (req.url === '/httponly-cookie/something' && req.method === 'GET') {
        const cookie = req.headers.cookie;

        if (cookie && cookie.includes('token=R99R')) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'GOLDEN LAPTOP!' }));
        } else {
            res.writeHead(401);
            res.end();
        }
    }

    else if (req.url === '/httponly-cookie/logout' && req.method === 'POST') {
        res.writeHead(200, {
            'Set-Cookie': 'token=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure'
        });
        res.end();
    }

    else {
        res.writeHead(404);
        res.end();
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});