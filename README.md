# FurCDN 狀態頁

[FurCDN](https://www.furcdn.us) 官方狀態頁原始碼 —— 部署在 [status.furcdn.us](https://status.furcdn.us)。

以 [Next.js 16](https://nextjs.org) + [Tailwind CSS v4](https://tailwindcss.com) + [Radix UI](https://www.radix-ui.com) 建構,資料來自 [UptimeRobot](https://uptimerobot.com) Free Plan API。

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

從 [UptimeRobot Integrations](https://dashboard.uptimerobot.com/integrations) 取得。Key 只會在 Server Component / Server Function 內使用(`lib/uptimerobot.ts` 標記 `server-only`),不會打包進 client bundle。

## 專案結構

```
app/
├── layout.tsx              # 字體 (Geist + Noto Sans TC/JP) + metadata + favicon
├── page.tsx                # SSR 狀態頁主體 (Server Component)
└── globals.css             # Tailwind v4 + 全域樣式 / Radix 展開動畫
components/
├── auto-refresh.tsx        # 每 60s 觸發 router.refresh()
├── monitor-list.tsx        # 監控清單 (Radix Accordion 分組 + 緊湊列)
├── uptime-bars.tsx         # 每日狀態條 (Radix Tooltip)
├── event-list.tsx          # 事件時間軸 (Radix Collapsible 展開更多)
├── language-switcher.tsx   # 語言切換
└── updated-time.tsx        # 相對時間 (date-fns)
lib/
├── uptimerobot.ts          # UptimeRobot v2 API client + 分組邏輯 (server-only)
├── i18n.ts                 # 繁中 / 粵語 / English / 日本語 字典
├── events.ts               # 事件記錄 (多語)
├── status-styles.ts        # 狀態配色
└── date-locales.ts         # date-fns locale 對應
```

## 特色

- Server Components SSR,`revalidate: 30` 走 Next.js Data Cache
- 響應式版面:手機單欄、iPad 兩欄起、桌機監控 + 事件左右分欄
- 狀態條依螢幕寬度顯示 30 / 60 / 90 天(純 CSS,無 JS 判斷)
- 監控名稱有共同前綴時自動分組,可折疊;有異常的分組自動排在最前
- 事件時間軸預設只顯示最近 4 則,其餘收合
- UI 互動元件一律使用 Radix UI(Accordion / Collapsible / Tooltip),不自造輪子
- 30d / 90d uptime ratio 透過 `custom_uptime_ratios` 取得
- 暗色極簡,Geist Sans + Noto Sans TC,系統字 fallback
- `server-only` 確保 API key 不會洩漏到 client bundle
- Dark Reader 等擴充功能不會觸發 hydration mismatch

## 部署

Push 至 `main` 後由 Vercel 自動部署。記得在 Vercel 專案 → Settings → Environment Variables 設定 `UPTIMEROBOT_API_KEY`。

## License

MIT
