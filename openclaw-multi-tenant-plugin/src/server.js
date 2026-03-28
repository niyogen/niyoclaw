import * as http from 'http';
import { handleIncomingWebhook } from './entrypoint/whatsapp-webhook.js';
const PORT = process.env.PORT || 3000;
// Minimal, zero-dependency HTTP server for catching Meta Webhooks securely
const server = http.createServer((req, res) => {
    // 1. Handle incoming WhatsApp Chat Messages
    if (req.method === 'POST' && req.url === '/webhook') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const payload = JSON.parse(body);
                const result = await handleIncomingWebhook(payload);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'success', result }));
            }
            catch (error) {
                console.error("Webhook Error:", error.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: error.message }));
            }
        });
        // 2. Handle Meta Webhook Subscription Verification (Initial Setup)
    }
    else if (req.method === 'GET' && req.url?.startsWith('/webhook')) {
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const mode = urlParams.get('hub.mode');
        const token = urlParams.get('hub.verify_token');
        const challenge = urlParams.get('hub.challenge');
        const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "niyoclaw_secure_token";
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED by Meta.');
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(challenge);
        }
        else {
            res.writeHead(403);
            res.end('Forbidden');
        }
    }
    else if (req.method === 'GET' && req.url === '/health') {
        import('./database/postgres-client.js').then(async ({ pingDatabase }) => {
            const dbStatus = await pingDatabase();
            const envStatus = process.env.META_ACCESS_TOKEN && process.env.DATABASE_URL ? 'configured' : 'missing';
            const health = {
                system: dbStatus && envStatus === 'configured' ? 'healthy' : 'degraded',
                database_rds: dbStatus ? 'connected' : 'disconnected',
                api_keys: envStatus,
                uptime_seconds: Math.floor(process.uptime()),
                timestamp: new Date().toISOString()
            };
            res.writeHead(dbStatus && envStatus === 'configured' ? 200 : 503, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(health, null, 2));
        });
    }
    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});
server.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 OpenClaw Multi-Tenant Webhook Server running on port ${PORT}`);
    console.log(`========================================\n`);
});
//# sourceMappingURL=server.js.map