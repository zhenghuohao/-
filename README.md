# 本地预览方法（二选一）

## 方法 1：使用开发服务器（推荐）

```bash
npm run dev
```
然后在浏览器打开 http://localhost:5174

## 方法 2：使用 Python 快速启动服务器

如果你安装了 Python，可以在 dist 目录运行：
```bash
cd dist
python -m http.server 8080
```
然后打开 http://localhost:8080

---

**重要提示：** 你看到的空白页是因为用文件管理器直接打开 HTML 文件，这在实际部署后不会出现。
