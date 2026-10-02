# SARAA Backend (Stage 4 — real AI connected, 100% FREE via Google Gemini)

## Setup

1. Install Node.js (LTS, version 18 or newer) from https://nodejs.org if not
   already installed. (Node 18+ has built-in `fetch`, which this backend uses —
   no extra AI library needed.)
2. Get a FREE Gemini API key (no credit card required):
   - Go to https://aistudio.google.com and sign in with your Google account.
   - Click **"Get API key"** → **"Create API key"**.
   - Copy it.
3. Open a terminal in this `backend` folder.
4. Run: `npm install`
5. Copy `.env.example` to a new file named `.env` in this same folder.
6. Open `.env` and paste your key:
   ```
   GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
7. Run: `npm start`
8. You should see: `SARAA backend listening on http://localhost:3000`

## Free tier limits (as of this writing)
- Gemini 2.5 Flash: ~10 requests/minute, ~250/day — plenty for personal testing.
- If you hit a rate-limit error, switch `AI_MODEL` in `.env` to
  `gemini-3.8-flash-lite`, which has a higher free quota (lower quality, still good).
- No credit card is required at any point on the free tier.

## Test it directly (optional)
Open a browser to http://localhost:3000/api/health — you should see a JSON success message.

You can also test the real AI directly with this command (replace the message):
```
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d "{\"messages\":[{\"role\":\"user\",\"content\":\"Hello SARAA, who are you?\"}]}"
```

## Connecting your phone (USB) to this backend
Your phone can't reach "localhost" on your laptop directly — `adb reverse`
tunnels it through the USB cable. With the backend running AND phone
connected via USB, run in a terminal:

    adb reverse tcp:3000 tcp:3000

Now the Android app's `http://127.0.0.1:3000` calls actually reach this
backend. Run this command again every time you reconnect the phone.

## Changing the AI model
Edit `AI_MODEL` in `.env` to any model name listed at
https://ai.google.dev/gemini-api/docs/models — no code changes needed.
