const http = require('http');

const server = http.createServer((req, res) => {
    // ✅ CORS (IMPORTANT for frontend)
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    // ✅ Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // ✅ CHECK LOGIN STATUS
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

    // ✅ LOGIN
    else if (req.url === '/httponly-cookie/login' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => body += chunk);

        req.on('end', () => {
            const { username, password } = JSON.parse(body);

            if (username === 'admin' && password === '4444') {
                res.writeHead(200, {
                    // 🔥 Removed Secure for local testing
                    'Set-Cookie': 'token=R99R; HttpOnly; Path=/',
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({ message: 'Logged in' }));
                console.log("✅ Logged in");
            } else {
                res.writeHead(401);
                res.end();
            }
        });
    }

    // ✅ PROTECTED ROUTE
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

    // ✅ LOGOUT
    else if (req.url === '/httponly-cookie/logout' && req.method === 'POST') {
        res.writeHead(200, {
            'Set-Cookie': 'token=; HttpOnly; Path=/; Max-Age=0'
        });
        res.end();
    }

    // ❌ NOT FOUND
    else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});