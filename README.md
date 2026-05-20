# FurCDN 狀態頁

[FurCDN](https://www.furcdn.us) 官方狀態頁原始碼 —— 部署在 [status.furcdn.us](https://status.furcdn.us)。

以 [Next.js 16](https://nextjs.org) + [Tailwind CSS v4](https://tailwindcss.com) 建構,資料來自 [UptimeRobot](https://uptimerobot.com) Free Plan API。

## 本地開發

```bash
npm install
cp .env.example .env       # 填入自己的 UPTIMEROBOT_API_KEY
npm run dev
```

開啟 http://localhost:3000 即可預覽。

其他指令:

```bash
npm run build      # 正式建置
npm start          # 啟動生產環境伺服器
```

## 環境變數

| 變數 | 必填 | 說明 |
| ---- | ---- | ---- |
| `UPTIMEROBOT_API_KEY` | ✓ | UptimeRobot 的 Main / Read-only API key |

從 [UptimeRobot Integrations](https://dashboard.uptimerobot.com/integrations) 取得。Key 只會在 Server Component / Server Function 內使用(`lib/uptimerobot.js` 標記 `server-only`),不會打包進 client bundle。

## 專案結構

```
app/
├── layout.jsx              # 字體 (Geist + Noto Sans TC) + metadata + favicon
├── page.jsx                # SSR 狀態頁主體 (Server Component)
└── globals.css             # Tailwind v4 + 全域樣式
components/
├── auto-refresh.jsx        # 每 60s 觸發 router.refresh()
├── uptime-bars.jsx         # 90 天每日狀態條 + hover tooltip
└── updated-time.jsx        # 相對時間 (just now / Xs ago / ...)
lib/
└── uptimerobot.js          # UptimeRobot v2 API client (server-only)
```

## 特色

- Server Components SSR,`revalidate: 30` 走 Next.js Data Cache
- 90 天每日狀態條,hover 顯示日期 / 狀態 / 中斷時長 (由 logs 推算)
- 30d / 90d uptime ratio 透過 `custom_uptime_ratios` 取得
- 暗色極簡,Geist Sans + Noto Sans TC,系統字 fallback
- `server-only` 確保 API key 不會洩漏到 client bundle
- 響應式,手機 / 桌面通用
- Dark Reader 等擴充功能不會觸發 hydration mismatch

## 部署

Push 至 `main` 後由 Vercel 自動部署。記得在 Vercel 專案 → Settings → Environment Variables 設定 `UPTIMEROBOT_API_KEY`。

## License

MIT
