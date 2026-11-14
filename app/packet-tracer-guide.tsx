'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Circle, Clock3, FlaskConical, Network, RotateCcw } from 'lucide-react';
import { packetTracerLabs, type Pair } from './packet-tracer-labs';

function B({ value }: { value: Pair }) {
  return <span className="bi"><span lang="en" className="bi-en">{value.en}</span><span lang="zh-CN" className="bi-zh">{value.zh}</span></span>;
}

const storageKey = 'engineer-path-packet-tracer-progress-v1';

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
      <small><B value={{ en: 'Packet Tracer runs separately on your computer. This page provides instructions and saves checklist progress in this browser only; it does not control or read your .pkt files.', zh: 'Packet Tracer 是独立的电脑软件。本页提供指导，勾选进度只保存在当前浏览器；网页不会控制或读取你的 .pkt 文件。' }} /></small>
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
      <div className="pt-topology" role="img" aria-label={lab.links.map((link) => `${link.from} to ${link.to}`).join('; ')}>
        {(lab.id === 'lan' ? ['PC-A', 'S1', 'PC-B'] : lab.id === 'routing' ? ['PC-A', 'S1', 'R1', 'S2', 'PC-B'] : ['PC-A · VLAN 10', 'S1', 'R1', 'S1', 'PC-B · VLAN 20']).map((node, index, array) => <span className="pt-topology-part" key={`${node}-${index}`}><span>{node}</span>{index < array.length - 1 && <i aria-hidden="true">→</i>}</span>)}
      </div>
      <div className="pt-table-wrap"><table><caption><B value={{ en: 'Cable and port map', zh: '连线与端口表' }} /></caption><thead><tr><th><B value={{ en: 'From', zh: '起点' }} /></th><th><B value={{ en: 'To', zh: '终点' }} /></th></tr></thead><tbody>{lab.links.map((link) => <tr key={link.from}><td>{link.from}</td><td>{link.to}</td></tr>)}</tbody></table></div>
      <div className="pt-table-wrap"><table><caption><B value={{ en: 'Address plan', zh: '地址规划表' }} /></caption><thead><tr><th><B value={{ en: 'Device', zh: '设备' }} /></th><th>IP</th><th><B value={{ en: 'Mask', zh: '掩码' }} /></th><th><B value={{ en: 'Gateway', zh: '网关' }} /></th></tr></thead><tbody>{lab.addresses.map((row) => <tr key={row.device}><td>{row.device}</td><td>{row.ip}</td><td>{row.mask}</td><td>{row.gateway}</td></tr>)}</tbody></table></div>

      <h3><B value={{ en: '2. Build and verify', zh: '2. 搭建并验证' }} /></h3>
      <p className="pt-muted"><B value={{ en: 'Mark a step after you have checked its result in Packet Tracer.', zh: '在 Packet Tracer 中核对结果后，再勾选步骤。' }} /></p>
      <div className="pt-steps">{lab.steps.map((step, index) => <button type="button" key={step.title.en} className={done.includes(index) ? 'done' : ''} aria-pressed={done.includes(index)} onClick={() => toggleStep(index)}>{done.includes(index) ? <Check size={20} /> : <Circle size={20} />}<span><strong><B value={step.title} /></strong><B value={step.detail} /></span></button>)}</div>
      {lab.configs.map((config) => <div className="pt-config" key={config.device}><h4>{config.device}</h4><pre><code>{config.code}</code></pre></div>)}

      <h3><B value={{ en: '3. Watch the packet', zh: '3. 观察数据包' }} /></h3>
      <ul className="pt-list">{lab.observe.map((item) => <li key={item.en}><B value={item} /></li>)}</ul>
      <div className="pt-result-grid"><section><h3><B value={{ en: 'Success looks like', zh: '成功标准' }} /></h3><ul>{lab.success.map((item) => <li key={item.en}><B value={item} /></li>)}</ul></section><section><h3><B value={{ en: 'If it fails', zh: '失败时检查' }} /></h3><ul>{lab.troubleshoot.map((item) => <li key={item.en}><B value={item} /></li>)}</ul></section></div>
      <div className="pt-challenge"><strong><B value={{ en: 'Explain before you test', zh: '先预测，再动手' }} /></strong><p><B value={lab.challenge} /></p></div>
      <div className="pt-finish"><span>{done.length === lab.steps.length ? <B value={{ en: 'Build complete. Explain the result to confirm you understand it.', zh: '搭建完成。试着解释结果，确认自己真正理解。' }} /> : <B value={{ en: `${done.length} of ${lab.steps.length} steps checked`, zh: `已勾选 ${done.length} / ${lab.steps.length} 个步骤` }} />}</span><button type="button" onClick={() => save({ ...progress, [lab.id]: [] })}><RotateCcw size={15} /><B value={{ en: 'Reset this lab', zh: '重置本实验' }} /></button></div>
    </section>
  </article>;
}
