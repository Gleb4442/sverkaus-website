// Vercel Serverless Function: routes minimalist contact & partnership inquiries to Sverkaus Telegram bot

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function cleanField(value, maxLen) {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, maxLen);
}

module.exports = async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ ok: false, error: 'method_not_allowed' });
        return;
    }

    let body = req.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch {
            res.status(400).json({ ok: false, error: 'invalid_json' });
            return;
        }
    }

    if (!body || typeof body !== 'object') {
        res.status(400).json({ ok: false, error: 'invalid_payload' });
        return;
    }

    // Honeypot anti-spam trap: silently succeed without forwarding to Telegram
    if (cleanField(body.website, 120)) {
        res.status(200).json({ ok: true });
        return;
    }

    const name = cleanField(body.name || body.company, 160);
    const email = cleanField(body.email || body.contact, 160);
    const message = cleanField(body.message || body.notes, 1500);
    const lang = cleanField(body.lang, 16) || 'en';

    if (!name || !email || !message) {
        res.status(400).json({ ok: false, error: 'missing_required_fields' });
        return;
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        res.status(503).json({ ok: false, error: 'telegram_not_configured' });
        return;
    }

    const text = [
        '<b>Sverkaus · New Message</b>',
        '',
        `<b>Name:</b> ${escapeHtml(name)}`,
        `<b>Email:</b> ${escapeHtml(email)}`,
        `<b>Language:</b> ${escapeHtml(lang.toUpperCase())}`,
        '',
        `<b>Question:</b>\n${escapeHtml(message)}`
    ].join('\n');

    try {
        const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        });

        if (!tgRes.ok) {
            const errText = await tgRes.text().catch(() => '');
            console.error('Telegram API error:', tgRes.status, errText);
            res.status(502).json({ ok: false, error: 'telegram_send_failed' });
            return;
        }

        res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Telegram webhook exception:', err);
        res.status(502).json({ ok: false, error: 'telegram_network_error' });
    }
};
