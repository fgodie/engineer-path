# Engineer Path · 工程师学习手册

英文在前、中文紧随的双语学习网站，含 15 个网络工程主题和 10 个系统工程主题。每课提供讲解、实验步骤、验收标准和自测。基础课程提供 ARP 与 HTTPS 图解，以及一个可切换显示过滤器的模拟抓包表。

课程依据用户引用的对话目录重新编写。原对话 PDF 附件无法读取，因此本站并非原 PDF 的逐页转换。每课列有官方参考资料。实验以隔离环境为目标，命令需按设备平台与版本核对。

## 本地开发

使用 Node.js 22.13 或更高版本：

```sh
npm ci
npm run dev
```

## 检查与构建

```sh
npx tsc --noEmit
npm run build
```

## GitHub Pages

推送到 `main` 后，GitHub Actions 会生成静态版本并部署到 GitHub Pages。仓库名为 `engineer-path`，因此发布构建使用 `/engineer-path` 作为资源路径：

```sh
npm run build:pages
```

`app/lessons.ts` 保留中文课程，`app/english.ts` 提供按课程 ID 对应的完整英文翻译，`app/interface-translations.ts` 提供界面及命令注释翻译。每个段落、实验步骤、题目、选项和解释同时显示两种语言。`app/lesson-diagrams.ts` 管理图解与课程段落的对应关系，`scripts/create-diagrams.py` 可重新生成 `public/diagrams` 中的 SVG 文件。

`app/foundations.ts` 保存新增的双语基础课程及官方资料链接。`app/page.tsx` 提供中英搜索、未完成筛选和学习进度。已完成课程与各方向上次打开的课程保存在当前浏览器，自测选项随页面会话重置。

## Cisco Packet Tracer 引导实验

学习路径和相关课程可以打开三项引导实验：同网段通信、跨网段路由、VLAN 间通信。`app/packet-tracer-labs.ts` 保存中英双语的端口、地址、配置、每步预期结果与排错内容，`app/packet-tracer-guide.tsx` 显示拓扑示意、真实截图、实验清单和完成版 `.pkt` 下载链接。清单进度保存在当前浏览器，下载的实验文件需要在电脑上的 Cisco Packet Tracer 中打开。

`npm run build:pages` 可在 Windows、macOS 和 Linux 上执行。GitHub Actions 推送 `main` 后仍按现有流程部署 GitHub Pages。
