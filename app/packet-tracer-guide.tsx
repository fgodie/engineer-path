'use client';

import { useEffect, useState } from 'react';
import { ArrowDownToLine, ArrowRight, ArrowUpRight, Check, Circle, Clock3, FlaskConical, RotateCcw } from 'lucide-react';
import { packetTracerLabs, type Pair } from './packet-tracer-labs';
import { PacketStepVisual, PacketTopology, SimulationVisual } from './packet-tracer-visuals';

function B({ value }: { value: Pair }) {
  return <span className="bi"><span lang="en" className="bi-en">{value.en}</span><span lang="zh-CN" className="bi-zh">{value.zh}</span></span>;
}

const storageKey = 'engineer-path-packet-tracer-progress-v1';
const assetBase = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/packet-tracer`;

type Screenshot = { file: string; caption: Pair };
const labScreenshots: Record<string, { topology: Screenshot; steps: Record<number, Screenshot[]> }> = {
  lan: {
    topology: { file: 'lan-topology-success.png', caption: { en: 'Finished LAN in Packet Tracer: PC0 → Switch0 → PC1, with green link lights.', zh: 'Packet Tracer 完成画面：PC0 → Switch0 → PC1，链路指示灯均为绿色。' } },
    steps: {
      1: [{ file: 'lan-ip-config.png', caption: { en: 'PC1 · Desktop → IP Configuration: 192.168.10.11/24; 0.0.0.0 means no gateway is set.', zh: 'PC1 的 Desktop → IP Configuration：192.168.10.11/24；0.0.0.0 表示未设置网关。' } }],
      2: [{ file: 'lan-ping-success.png', caption: { en: 'PC0 command prompt: four replies from 192.168.10.11, 0% packet loss.', zh: 'PC0 命令提示符：收到 192.168.10.11 的四次响应，丢包率 0%。' } }],
    },
  },
  routing: {
    topology: { file: 'routing-topology-success.png', caption: { en: 'Finished route: PC0 → Switch0 → Router0 → Switch1 → PC1; all links are green.', zh: '完成后的路径：PC0 → Switch0 → Router0 → Switch1 → PC1；所有链路均为绿色。' } },
    steps: {
      1: [
        { file: 'routing-pc-config.png', caption: { en: 'PC0 address and default gateway in the real IP Configuration window.', zh: '真实 IP Configuration 窗口中的 PC0 地址和默认网关。' } },
        { file: 'routing-router-config.png', caption: { en: 'Router0 G0/1 address 192.168.20.1/24 with the interface enabled.', zh: 'Router0 的 G0/1 配为 192.168.20.1/24，接口已开启。' } },
      ],
      2: [{ file: 'routing-ping-success.png', caption: { en: 'The first ping loses one packet while ARP resolves; the next run receives four replies.', zh: '首次 ping 在 ARP 解析时丢失一包；再次运行收到四次响应。' } }],
    },
  },
  vlan: {
    topology: { file: 'vlan-topology-success.png', caption: { en: 'Finished router-on-a-stick topology: PC0 and PC1 reach Router0 through Switch0.', zh: '完成后的单臂路由拓扑：PC0 和 PC1 经 Switch0 连接 Router0。' } },
    steps: {
      1: [
        { file: 'vlan-created.png', caption: { en: 'VLAN 10 USERS and VLAN 20 LAB created on Switch0.', zh: 'Switch0 上建立了 VLAN 10 USERS 和 VLAN 20 LAB。' } },
        { file: 'vlan-port-verify.png', caption: { en: 'show vlan brief: F0/1 belongs to VLAN 10; F0/2 belongs to VLAN 20.', zh: 'show vlan brief：F0/1 属于 VLAN 10，F0/2 属于 VLAN 20。' } },
        { file: 'vlan-trunk-verify.png', caption: { en: 'show interfaces trunk: G0/1 is trunking and allows VLANs 10 and 20.', zh: 'show interfaces trunk：G0/1 正在以 Trunk 模式工作，允许 VLAN 10、20。' } },
      ],
      2: [
        { file: 'vlan-router-verify.png', caption: { en: 'Router0 subinterfaces G0/0.10 and G0/0.20 are both up/up.', zh: 'Router0 子接口 G0/0.10 和 G0/0.20 均为 up/up。' } },
        { file: 'vlan-ping-success.png', caption: { en: 'Cross-VLAN ping: the first run waits for ARP; the second gets four replies from PC1.', zh: '跨 VLAN ping：首次运行等待 ARP，第二次收到 PC1 的四次响应。' } },
      ],
    },
  },
};

function RealScreenshot({ shot }: { shot: Screenshot }) {
  const src = `${assetBase}/${shot.file}`;
  // Keep the original Packet Tracer screenshot intact and serve it from the static Pages path.
  // oxlint-disable-next-line next/no-img-element
  return <figure className="pt-real-shot"><a href={src} target="_blank" rel="noreferrer" aria-label={`Open full-size screenshot: ${shot.caption.en}`}><img src={src} alt={shot.caption.en} loading="lazy" /></a><figcaption><B value={shot.caption} /><span className="pt-fullsize"><B value={{ en: 'Open full-size image ↗', zh: '点击查看原图 ↗' }} /></span></figcaption></figure>;
}

export function PacketTracerGuide({ initialLabId, onOpenLesson }: { initialLabId?: string; onOpenLesson: (id: string) => void }) {
  const [labId, setLabId] = useState(initialLabId || packetTracerLabs[0].id);
  const [progress, setProgress] = useState<Record<string, number[]>>({});
  const lab = packetTracerLabs.find((item) => item.id === labId) || packetTracerLabs[0];
  const done = progress[lab.id] || [];

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || '{}');
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) setProgress(saved);
    } catch { /* Local storage is optional. */ }
  }, []);

  function save(next: Record<string, number[]>) {
    setProgress(next);
    try { window.localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* The guide still works without storage. */ }
  }

  function toggleStep(index: number) {
    const current = Array.isArray(progress[lab.id]) ? progress[lab.id] : [];
    save({ ...progress, [lab.id]: current.includes(index) ? current.filter((item) => item !== index) : [...current, index] });
  }

  return <article className="pt-guide">
    <header className="pt-intro">
      <p className="overline">PACKET TRACER / 动手学习</p>
      <h1><B value={{ en: 'See the packet. Build the network.', zh: '看见数据包，亲手搭建网络。' }} /></h1>
      <p><B value={{ en: 'Three guided labs connect the ideas in this site to Cisco Packet Tracer. Build each topology in the desktop app, observe the traffic, then explain the result.', zh: '三个循序渐进的实验，把本站原理讲解与 Cisco Packet Tracer 连接起来。在电脑软件中搭建拓扑、观察流量，再解释结果。' }} /></p>
      <a href="https://www.netacad.com/courses/getting-started-cisco-packet-tracer/1000" target="_blank" rel="noreferrer" className="pt-official"><B value={{ en: 'Get Packet Tracer from Cisco Networking Academy', zh: '通过 Cisco Networking Academy 获取 Packet Tracer' }} /><ArrowUpRight size={17} /></a>
      <small><B value={{ en: 'The screenshots and finished .pkt files were made in Packet Tracer 9.0.1. The page saves checklist progress in this browser only and does not control your Packet Tracer app.', zh: '下方真实截图和完成版 .pkt 文件来自 Packet Tracer 9.0.1。网页只在当前浏览器保存勾选进度，不会控制你的 Packet Tracer 软件。' }} /></small>
    </header>

    <nav className="pt-lab-picker" aria-label="Packet Tracer labs / Packet Tracer 实验">
      {packetTracerLabs.map((item) => {
        const count = Array.isArray(progress[item.id]) ? progress[item.id].length : 0;
        return <button type="button" key={item.id} className={item.id === lab.id ? 'active' : ''} aria-current={item.id === lab.id ? 'step' : undefined} onClick={() => { setLabId(item.id); window.scrollTo({ top: 0 }); }}>
          <span className="pt-lab-picker-top"><FlaskConical size={18} /><span>{count}/{item.steps.length}</span></span>
          <B value={item.title} />
          <small>{item.minutes} MIN</small>
        </button>;
      })}
    </nav>

    <section className="pt-panel">
      <div className="pt-panel-heading"><div><p className="overline">GUIDED LAB / 引导实验</p><h2><B value={lab.title} /></h2><p><B value={lab.question} /></p></div><span><Clock3 size={15} /> {lab.minutes} MIN</span></div>
      <div className="pt-principle"><strong><B value={{ en: 'Why it works', zh: '背后的原理' }} /></strong><p><B value={lab.principle} /></p><button type="button" onClick={() => onOpenLesson(lab.lessonId)}><B value={{ en: 'Read the related lesson', zh: '阅读对应课程' }} /><ArrowRight size={16} /></button></div>

      <h3><B value={{ en: '1. Prepare the topology', zh: '1. 准备拓扑' }} /></h3>
      <p className="pt-muted"><B value={lab.devices} /></p>
      <PacketTopology lab={lab} />
      <RealScreenshot shot={labScreenshots[lab.id].topology} />
      <p className="pt-sample-note"><B value={lab.id === 'lan' ? { en: 'Packet Tracer’s default names PC0, PC1 and Switch0 correspond to PC-A, PC-B and S1 in the guide.', zh: 'Packet Tracer 默认名称 PC0、PC1、Switch0，分别对应教程中的 PC-A、PC-B、S1。' } : lab.id === 'routing' ? { en: 'PC0/PC1, Switch0/Switch1 and Router0 correspond to PC-A/PC-B, S1/S2 and R1. Router links turn green after you enable the interfaces.', zh: 'PC0/PC1、Switch0/Switch1、Router0 分别对应教程中的 PC-A/PC-B、S1/S2、R1。开启路由器接口后链路才会变绿。' } : { en: 'PC0/PC1, Switch0 and Router0 correspond to PC-A/PC-B, S1 and R1. The router link turns green after you enable G0/0.', zh: 'PC0/PC1、Switch0、Router0 分别对应教程中的 PC-A/PC-B、S1、R1。开启路由器 G0/0 后链路才会变绿。' }} /></p>
      <a className="pt-download" href={`${assetBase}/${lab.id}-guided-lab.pkt`} download><ArrowDownToLine size={18} /><span><B value={{ en: 'Download the finished Packet Tracer lab (.pkt)', zh: '下载已完成的 Packet Tracer 实验（.pkt）' }} /><small><B value={{ en: 'Open it when you need to compare your work with a working example.', zh: '遇到问题时打开完成版，对照自己的配置。' }} /></small></span></a>
      <div className="pt-table-wrap"><table><caption><B value={{ en: 'Cable and port map', zh: '连线与端口表' }} /></caption><thead><tr><th><B value={{ en: 'From', zh: '起点' }} /></th><th><B value={{ en: 'To', zh: '终点' }} /></th></tr></thead><tbody>{lab.links.map((link) => <tr key={link.from}><td>{link.from}</td><td>{link.to}</td></tr>)}</tbody></table></div>
      <div className="pt-table-wrap"><table><caption><B value={{ en: 'Address plan', zh: '地址规划表' }} /></caption><thead><tr><th><B value={{ en: 'Device', zh: '设备' }} /></th><th>IP</th><th><B value={{ en: 'Mask', zh: '掩码' }} /></th><th><B value={{ en: 'Gateway', zh: '网关' }} /></th></tr></thead><tbody>{lab.addresses.map((row) => <tr key={row.device}><td>{row.device}</td><td>{row.ip}</td><td>{row.mask}</td><td>{row.gateway}</td></tr>)}</tbody></table></div>

      <h3><B value={{ en: '2. Follow each step', zh: '2. 跟着步骤操作' }} /></h3>
      <p className="pt-muted"><B value={{ en: 'Mark a step after you have checked its result in Packet Tracer.', zh: '在 Packet Tracer 中核对结果后，再勾选步骤。' }} /></p>
      <div className="pt-steps">{lab.steps.map((step, index) => <div className={`pt-step-card ${done.includes(index) ? 'done' : ''}`} key={step.title.en}>
        <div className="pt-step-number">{String(index + 1).padStart(2, '0')}</div>
        <div className="pt-step-content"><h4><B value={step.title} /></h4><p><B value={step.detail} /></p>
          {labScreenshots[lab.id].steps[index]?.length ? <div className="pt-real-gallery">{labScreenshots[lab.id].steps[index].map((shot) => <RealScreenshot key={shot.file} shot={shot} />)}</div> : <PacketStepVisual lab={lab} index={index} />}
          {lab.configs.filter((config) => config.step === index).map((config) => <div className="pt-config" key={config.device}><h5>{config.device}</h5><pre><code>{config.code}</code></pre></div>)}
          <div className="pt-step-expect"><strong><B value={{ en: 'What you should see', zh: '这一步应该看到' }} /></strong><p><B value={step.expect} /></p></div>
          <button type="button" className="pt-step-check" aria-pressed={done.includes(index)} onClick={() => toggleStep(index)}>{done.includes(index) ? <Check size={18} /> : <Circle size={18} />}<B value={done.includes(index) ? { en: 'Checked · click to undo', zh: '已完成 · 点击撤销' } : { en: 'I checked this result', zh: '已核对，完成这一步' }} /></button>
        </div>
      </div>)}</div>

      <h3><B value={{ en: '3. Watch the packet', zh: '3. 观察数据包' }} /></h3>
      {lab.id === 'vlan' && <SimulationVisual lab={lab} />}
      <ul className="pt-list">{lab.observe.map((item) => <li key={item.en}><B value={item} /></li>)}</ul>
      <div className="pt-result-grid"><section><h3><B value={{ en: 'Success looks like', zh: '成功标准' }} /></h3><ul>{lab.success.map((item) => <li key={item.en}><B value={item} /></li>)}</ul></section><section><h3><B value={{ en: 'If it fails', zh: '失败时检查' }} /></h3><ul>{lab.troubleshoot.map((item) => <li key={item.en}><B value={item} /></li>)}</ul></section></div>
      <div className="pt-challenge"><strong><B value={{ en: 'Explain before you test', zh: '先预测，再动手' }} /></strong><p><B value={lab.challenge} /></p></div>
      <div className="pt-finish"><span>{done.length === lab.steps.length ? <B value={{ en: 'Build complete. Explain the result to confirm you understand it.', zh: '搭建完成。试着解释结果，确认自己真正理解。' }} /> : <B value={{ en: `${done.length} of ${lab.steps.length} steps checked`, zh: `已勾选 ${done.length} / ${lab.steps.length} 个步骤` }} />}</span><button type="button" onClick={() => save({ ...progress, [lab.id]: [] })}><RotateCcw size={15} /><B value={{ en: 'Reset this lab', zh: '重置本实验' }} /></button></div>
    </section>
  </article>;
}
