# HighTableGroup / 高桌会议集团

HighTableGroup 集团集成站，纯静态 HTML / CSS / JavaScript，无构建步骤。默认英文，可切换中文与法文。

## 本地预览

在本目录运行：

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

打开 <http://127.0.0.1:8080/>。也可以直接双击 `index.html`，但 Service Worker 与 PWA 安装只在 HTTP / HTTPS 下生效。

## 内容结构

- 集团介绍与共同标准
- 三大旗舰：CS 实验室、招聘研究院、文法研究中心
- 单独列出的实验室子项目：科研发展司
- 实验室模块中再次展示科研发展司与 CS 实验室的从属关系
- 持续更新承诺与当前状态
- 四个产品入口、三语切换、PWA 与离线缓存

默认语言为 English。右上角 `EN / 中 / FR` 可切换；选择会保存在本机浏览器中，也可以通过 `?lang=zh` 或 `?lang=fr` 直接分享指定语言版本。

## 文件说明

```text
index.html                 首页与全部静态内容
404.html                   GitHub Pages 自定义 404
assets/css/style.css       全站设计、响应式与动效
assets/js/i18n.js          英文 / 中文 / 法文文案
assets/js/main.js          语言切换、导航、滚动动效、PWA 注册
assets/previews/           四个产品的横向与竖版真实界面截图
assets/brand/              圆形 HTG 徽标、研究窗景背景与 PWA 图标
assets/fonts/              自托管字体与授权文件
manifest.webmanifest       PWA 清单
sw.js                      网络优先 Service Worker
```

修改文案时，在 `assets/js/i18n.js` 中同步三个语言版本的同一个键。产品链接直接写在 `index.html` 中；如果产品域名变化，可在文件里搜索 `imseo-joon.github.io` 统一替换。

## 推到 GitHub Pages

1. 在 GitHub 新建公开仓库。
2. 把本目录里的**全部内容**放到仓库根目录，确保 `index.html` 在根目录。
3. 推送到 `main` 分支。
4. 打开仓库 **Settings → Pages**。
5. **Build and deployment** 选择 **Deploy from a branch**。
6. 分支选 `main`，目录选 `/ (root)`，保存。

站点所有资源均使用相对路径，因此可以部署在 `https://<用户名>.github.io/<仓库名>/` 子路径下。

## 产品地址

- CS 实验室：<https://imseo-joon.github.io/HTcsLab/>
- 招聘研究院：<https://imseo-joon.github.io/HTrecruitmentInstitute/>
- 文法研究中心：<https://imseo-joon.github.io/HTgrammaticalResearch/>
- 科研发展司：<https://imseo-joon.github.io/HTresearchDepartment/>

当前状态：三大旗舰处于内测阶段，科研发展司已正式上线，并作为 CS 实验室的子项目呈现。
