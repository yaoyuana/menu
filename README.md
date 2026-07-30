# 遥远的私厨

单页私厨菜单：浏览菜品，点击「随机菜单」时视角会跟随扫描跳动，最终锁定并放大展示。菜品数据来自 `menu.json`。

## 本地预览

任意静态服务器即可，例如：

```bash
python3 -m http.server 8080
```

打开 http://localhost:8080

也可直接用浏览器打开 `index.html`（部分浏览器对本地模块无影响，本页为纯静态）。

## 线上访问（GitHub Pages）

仓库：https://github.com/yaoyuana/menu

合并到 `main` 后，Actions 工作流会自动部署。首次需在仓库设置中开启 Pages：

1. 打开 **Settings → Pages**
2. **Source** 选择 **GitHub Actions**
3. 等待 workflow 成功后访问：

**https://yaoyuana.github.io/menu/**

也可在 Actions 里手动运行 **Deploy GitHub Pages**。

## 其他免费上线方式

| 方案 | 说明 |
|------|------|
| **GitHub Pages**（已配置） | 推送 `main` 即部署，适合本仓库 |
| [Cloudflare Pages](https://pages.cloudflare.com/) | 连接 GitHub，构建命令留空，输出目录 `/` |
| [Netlify Drop](https://app.netlify.com/drop) | 把本目录拖上去，立刻得到链接 |
| [Surge.sh](https://surge.sh/) | `npx surge .` 一键发布 |

无需构建步骤：纯 HTML / CSS / JS，任意静态托管都能用。
