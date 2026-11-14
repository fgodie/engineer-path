# Engineer Path · 工程师学习手册

英文在前、中文紧随的全文双语个人学习网站，含 12 个网络工程主题和 8 个系统工程主题，每课提供讲解、实验步骤、验收标准和自测解释。重点课程还配有 8 张原创双语 SVG 图解，覆盖封装、子网、VLAN、路由查表、EVPN-VXLAN、AD/DNS、虚拟化和 RPO/RTO。

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

`app/page.tsx` 提供学习路径、课程阅读、实验、自测、岗位对照和参考资料。课程选择和自测答案为本次页面会话状态，刷新后重置。本站不收集学习者信息。

## Cisco Packet Tracer 引导实验

学习路径和课程 n01、n02、n04 现在可以进入三项递进实验：同网段通信、跨网段路由、VLAN 间通信。`app/packet-tracer-labs.ts` 保存中英双语的拓扑、端口、地址、配置、验证与排错内容；`app/packet-tracer-guide.tsx` 呈现步骤清单。勾选进度仅写入学习者当前浏览器的 localStorage。Packet Tracer 需从 Cisco Networking Academy 单独获取并在电脑上运行；网站不会打开、读取或修改 `.pkt` 文件。

`npm run build:pages` 可在 Windows、macOS 和 Linux 上执行。GitHub Actions 推送 `main` 后仍按现有流程部署 GitHub Pages。
