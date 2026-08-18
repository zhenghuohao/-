# Netlify 部署指南

## 自动部署（推荐）

### 方式一：通过 Git 仓库部署（最推荐）

1. **将代码推送到 Git 仓库**（GitHub/GitLab/CodeSignal）
   ```bash
   cd d:\竞赛\个人简历\portfolio
   git init
   git add .
   git commit -m "Initial commit"
   # 添加远程仓库并推送
   git remote add origin <你的仓库地址>
   git push -u origin main
   ```

2. **连接 Netlify**
   - 访问 https://app.netlify.com
   - 点击 "Add new site" → "Import an existing project"
   - 选择你的 Git 提供商（GitHub/GitLab等）
   - 选择刚才推送的仓库
   - Netlify 会自动读取 `netlify.toml` 配置
   - 点击 "Deploy"

3. **部署成功后**
   - 你会获得一个随机域名（如 `xxx.netlify.app`）
   - 可以在 Settings → Domain 设置自定义域名

### 方式二：手动拖拽部署

1. **本地构建**
   ```bash
   cd d:\竞赛\个人简历\portfolio
   npm install
   npm run build
   ```

2. **上传到 Netlify**
   - 访问 https://app.netlify.com
   - 点击 "Add new site" → "Manual deploy"
   - 将 `dist` 文件夹直接拖拽到页面中
   - 等待部署完成

## 部署配置说明

本项目已包含以下优化配置：

- ✅ **netlify.toml**: 配置了 SPA 路由重定向，确保所有路由都指向 index.html
- ✅ **vite.config.ts**: 使用 `base: './'` 相对路径，适配 Netlify 部署
- ✅ **assetsInclude**: 支持 `.glb` 3D 模型文件
- ✅ **所有公共资源**: 在 `public/` 目录下，构建时自动复制到 dist

## 部署验证

部署完成后，访问网站并检查：

1. ✅ 首页视频背景正常显示
2. ✅ 日夜交替天空主题正常
3. ✅ 滚动动画（GSAP + ScrollTrigger）正常工作
4. ✅ 精选作品轮播正常
5. ✅ 能力墙 3D 效果正常
6. ✅ 可拖拽卡片交互正常
7. ✅ 移动端菜单正常
8. ✅ 所有链接跳转正常

## 常见问题

### Q: 刷新页面出现 404？
A: 已配置 `netlify.toml` 中的 SPA 重定向，不会出现此问题。

### Q: 图片/视频不显示？
A: 确认资源在 `public/` 目录下，且使用 `/文件名` 的方式引用。

### Q: 自定义域名如何配置？
A: Netlify → Settings → Domain Management → Add custom domain

## 性能提示

当前构建输出约 1.1 MB（gzip 后），主要体积来自：
- Three.js（DanceCard 组件）: ~164 KB gzip
- Draco 编解码器: ~154 KB gzip
- 主应用代码: ~117 KB gzip

如需优化，可以考虑：
- 延迟加载 Three.js（已通过 lazy() 实现）
- 压缩视频文件
- 使用更小的 3D 模型
