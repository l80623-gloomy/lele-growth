# 樂樂的成長牆 ✨

專屬成長紀錄網站：時間軸、相簿、里程碑、家人祝福。

## 本機預覽

在 `lele-growth` 資料夾內，用瀏覽器直接開啟 `index.html`，或使用簡易伺服器：

```bash
cd lele-growth
npx --yes serve .
```

然後在瀏覽器開啟終端機顯示的網址。

## 加入照片與影片

### 時間軸 (`images/timeline/`)

| 檔名 | 說明 |
|------|------|
| `01-birth.jpg` | 出生 |
| `02-fullmoon.jpg` | 滿月 |
| `03-crawl.jpg` | 爬行 |
| `04-first-words.jpg` | 第一次叫爸媽 |
| `05-age-2.jpg` | 兩歲 |
| `06-age-3.jpg` | 三歲 |

可在 `index.html` 的時間軸區塊修改日期、標題與內文，並增減 `<article class="timeline-item">` 項目。

### 相簿 (`images/gallery/`)

- `01.jpg` ~ `05.jpg`：相簿縮圖
- `sample.mp4`：影片（請改成你的檔名，並同步修改 `index.html` 中 `data-src`）

建議單張照片寬度 1200px 左右、壓縮後上傳，以加快 GitHub Pages 載入速度。

## 自訂內容

1. **里程碑**：編輯 `#milestones` 內的 `.milestone-card`
2. **留言板**：家人在網頁上填寫稱謂與祝福即可（需先完成下方 Firebase 設定）
3. **樂樂的生日等**：修改時間軸中的 `<time datetime="...">` 與文字

## 留言板 Firebase 設定（約 10 分鐘）

留言會儲存在 [Firebase Firestore](https://firebase.google.com/) 免費方案，家人在不同裝置都能看到彼此留言，時間由伺服器自動記錄。

### 1. 建立 Firebase 專案

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. **新增專案**（例如 `lele-growth`）
3. 依指示完成建立（Google Analytics 可關閉）

### 2. 註冊 Web 應用程式

1. 專案總覽 → 點 **Web** 圖示 `</>`
2. 應用程式暱稱填 `樂樂成長牆` → 註冊
3. 複製 `firebaseConfig` 裡的各項數值

### 3. 填入設定檔

編輯 `js/firebase-config.js`，把 `YOUR_...` 全部換成剛才複製的值：

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "你的專案.firebaseapp.com",
  projectId: "你的專案-id",
  // ...
};
```

### 4. 啟用 Firestore

1. 左側 **Build → Firestore Database**
2. **建立資料庫** → 選離台灣較近的區域（例如 `asia-east1`）→ **以測試模式啟動**（稍後會改規則）

### 5. 設定安全規則

1. Firestore → **規則** 分頁
2. 將本專案 `firestore.rules` 的內容貼上並**發布**

規則說明：任何人可讀取留言；僅能新增（稱謂 ≤ 20 字、內容 ≤ 500 字）；不可修改或刪除。

### 6. 測試

```bash
cd lele-growth
npx --yes serve .
```

用瀏覽器開啟本機網址（勿用 `file://` 直接開檔案），到「給樂樂的話」送出測試留言。Firebase Console → Firestore 應會出現 `guestbook_messages` 集合。

### 常見問題

| 狀況 | 處理方式 |
|------|----------|
| 頁面顯示「留言板尚未連線」 | 確認 `firebase-config.js` 已填入真實金鑰 |
| 送出失敗 / permission denied | 檢查 Firestore 規則是否已發布 |
| 時間顯示「剛剛」一下才變正常 | 正常現象，伺服器時間寫入後會自動更新 |

## 部署到 GitHub Pages（免費）

### 方式 A：整個 repo 只放此網站（最簡單）

1. 在 GitHub 建立新 repository（例如 `lele-growth`）
2. 將 **`lele-growth` 資料夾內的所有檔案**（含 `index.html`、`css`、`js`、`images`）推送到 repo **根目錄**
3. 到 repo → **Settings** → **Pages**
4. **Source** 選 **Deploy from a branch**
5. **Branch** 選 `main`，資料夾選 **`/ (root)`**
6. 儲存後約 1～3 分鐘，網址會是：  
   `https://<你的帳號>.github.io/lele-growth/`

### 方式 B：放在現有 repo 的子資料夾

若 Cursor 專案整包都是一個 git repo：

1. 推送後到 **Settings → Pages**
2. **Branch** 選 `main`，資料夾選 **`/lele-growth`**
3. 網址會是：  
   `https://<你的帳號>.github.io/<repo名稱>/`

### 首次推送範例

```bash
cd "c:\Users\User\OneDrive\文件\Cursor專案\lele-growth"
git init
git add .
git commit -m "Add Lele growth wall website"
git branch -M main
git remote add origin https://github.com/<你的帳號>/lele-growth.git
git push -u origin main
```

---


Made with ❤️ for 樂樂
