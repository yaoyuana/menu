# LUMEN 私厨 · 今日菜单

单页私厨菜单：浏览菜品，点击「随机菜单」会以扫描动画抽选一道，并放大展示。

## 本地预览

任意静态服务器即可，例如：

```bash
python3 -m http.server 8080
```

打开 http://localhost:8080

也可直接用浏览器打开 `index.html`（部分浏览器对本地模块无影响，本页为纯静态）。

## 线上访问

### 立刻可打开（无需配置）

代码已在 `main`，可用 CDN 镜像直接打开：

**https://raw.githack.com/yaoyuana/menu/main/index.html**

（备选：https://cdn.jsdelivr.net/gh/yaoyuana/menu@main/index.html）

### GitHub Pages（推荐固定域名）

仓库：https://github.com/yaoyuana/menu  
目标地址：**https://yaoyuana.github.io/menu/**

若打开显示 **404**，通常是 Pages 尚未开启（Actions 无法代你点这一下）。按下面做一次即可：

1. 打开 [Settings → Pages](https://github.com/yaoyuana/menu/settings/pages)
2. **Build and deployment → Source** 选 **GitHub Actions**
3. 打开 [Actions](https://github.com/yaoyuana/menu/actions) → 失败的 **Deploy GitHub Pages** → **Re-run all jobs**  
   （或再 push 一次 / 手动 Run workflow）
4. 等绿灯后访问 https://yaoyuana.github.io/menu/

## 其他免费上线方式

| 方案 | 说明 |
|------|------|
| **raw.githack / jsDelivr** | 上面即时链接，零配置 |
| **GitHub Pages**（已配 workflow） | 固定 `*.github.io` 域名 |
| [Cloudflare Pages](https://pages.cloudflare.com/) | 连 GitHub，构建留空，目录 `/` |
| [Netlify Drop](https://app.netlify.com/drop) | 把本目录拖上去即得链接 |
| [Surge.sh](https://surge.sh/) | `npx surge .` |

无需构建：纯 HTML / CSS / JS。
