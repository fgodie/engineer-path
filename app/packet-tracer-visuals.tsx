import { Cable, Laptop, Network, Router, Send } from 'lucide-react';
import type { PacketTracerLab, Pair } from './packet-tracer-labs';

function B({ value }: { value: Pair }) {
  return <span className="bi"><span lang="en" className="bi-en">{value.en}</span><span lang="zh-CN" className="bi-zh">{value.zh}</span></span>;
}

type Node = { x: number; y: number; label: string; kind: 'pc' | 'switch' | 'router'; detail: string; color?: string };
type Wire = { from: [number, number]; to: [number, number]; label: string; color?: string; labelY?: number };

function Device({ node }: { node: Node }) {
  const color = node.color || '#139b80';
  return <g transform={`translate(${node.x}, ${node.y})`}>
    <rect x="-62" y="-48" width="124" height="94" rx="14" fill="#fff" stroke={color} strokeWidth="2" />
    <circle cx="0" cy="-14" r="20" fill={color} opacity=".12" />
    {node.kind === 'pc' ? <g stroke={color} strokeWidth="2.5" fill="none"><rect x="-13" y="-24" width="26" height="18" rx="2"/><path d="M-9 0h18M0-6v6"/></g> : node.kind === 'switch' ? <g stroke={color} strokeWidth="2.5" fill="none"><rect x="-17" y="-25" width="34" height="22" rx="3"/><path d="M-12-14h4m4 0h4m4 0h4m-24 6h4m4 0h4m4 0h4"/></g> : <g stroke={color} strokeWidth="2.5" fill="none"><circle cx="0" cy="-15" r="17"/><path d="M-13-15h26m-13-13v26m-8-21 16 16m0-16-16 16"/></g>}
    <text x="0" y="18" textAnchor="middle" fontSize="15" fontWeight="700" fill="#173a3d">{node.label}</text>
    <text x="0" y="37" textAnchor="middle" fontSize="11" fill="#617d78">{node.detail}</text>
  </g>;
}

export function PacketTopology({ lab }: { lab: PacketTracerLab }) {
  let nodes: Node[];
  let wires: Wire[];
  let note: Pair;
  if (lab.id === 'lan') {
    nodes = [
      { x: 110, y: 150, label: 'PC-A', kind: 'pc', detail: '192.168.10.10' },
      { x: 460, y: 150, label: 'S1 · 2960', kind: 'switch', detail: 'VLAN 1' },
      { x: 810, y: 150, label: 'PC-B', kind: 'pc', detail: '192.168.10.11' },
    ];
    wires = [
      { from: [172, 150], to: [398, 150], label: 'Fa0 ↔ Fa0/1' },
      { from: [522, 150], to: [748, 150], label: 'Fa0/2 ↔ Fa0' },
    ];
    note = { en: 'One subnet · no router or default gateway needed', zh: '同一子网 · 无需路由器或默认网关' };
  } else if (lab.id === 'routing') {
    nodes = [
      { x: 80, y: 150, label: 'PC-A', kind: 'pc', detail: '10.10', color: '#139b80' },
      { x: 270, y: 150, label: 'S1', kind: 'switch', detail: '2960', color: '#139b80' },
      { x: 460, y: 150, label: 'R1', kind: 'router', detail: '2911', color: '#7257b7' },
      { x: 650, y: 150, label: 'S2', kind: 'switch', detail: '2960', color: '#2689ba' },
      { x: 840, y: 150, label: 'PC-B', kind: 'pc', detail: '20.10', color: '#2689ba' },
    ];
    wires = [
      { from: [142, 150], to: [208, 150], label: 'Fa0/1', color: '#139b80' },
      { from: [332, 150], to: [398, 150], label: 'G0/1 ↔ G0/0', color: '#139b80' },
      { from: [522, 150], to: [588, 150], label: 'G0/1 ↔ G0/1', color: '#2689ba' },
      { from: [712, 150], to: [778, 150], label: 'Fa0/1', color: '#2689ba' },
    ];
    note = { en: 'Green: 192.168.10.0/24 · Blue: 192.168.20.0/24 · R1 connects them', zh: '绿色：192.168.10.0/24 · 蓝色：192.168.20.0/24 · R1 连接两侧' };
  } else {
    nodes = [
      { x: 115, y: 85, label: 'PC-A', kind: 'pc', detail: 'VLAN 10', color: '#139b80' },
      { x: 115, y: 225, label: 'PC-B', kind: 'pc', detail: 'VLAN 20', color: '#2689ba' },
      { x: 460, y: 155, label: 'S1 · 2960', kind: 'switch', detail: 'Fa0/1 · Fa0/2', color: '#7257b7' },
      { x: 805, y: 155, label: 'R1 · 2911', kind: 'router', detail: 'G0/0.10 · G0/0.20', color: '#7257b7' },
    ];
    wires = [
      { from: [177, 85], to: [398, 135], label: 'Fa0 ↔ Fa0/1', color: '#139b80', labelY: 72 },
      { from: [177, 225], to: [398, 175], label: 'Fa0 ↔ Fa0/2', color: '#2689ba', labelY: 240 },
      { from: [522, 155], to: [743, 155], label: '802.1Q trunk · G0/1 ↔ G0/0', color: '#7257b7', labelY: 115 },
    ];
    note = { en: 'Two VLANs stay separate at S1; one trunk reaches both router gateways', zh: '两个 VLAN 在 S1 隔离；一条 Trunk 连接路由器上的两个网关' };
  }
  return <figure className="pt-topology-figure">
    <div className="pt-visual-scroll" tabIndex={0} aria-label="Topology diagram / 拓扑示意图，可横向滚动">
      <svg viewBox="0 0 920 310" role="img" aria-labelledby={`pt-topology-title-${lab.id} pt-topology-desc-${lab.id}`}>
        <title id={`pt-topology-title-${lab.id}`}>{lab.title.en} / {lab.title.zh}</title>
        <desc id={`pt-topology-desc-${lab.id}`}>{lab.links.map((link) => `${link.from} to ${link.to}`).join('; ')}</desc>
        <rect x="1" y="1" width="918" height="308" rx="17" fill="#f5faf9" stroke="#cde2dd" />
        <text x="26" y="34" fontSize="12" fontWeight="700" letterSpacing="1.5" fill="#528377">LOGICAL TOPOLOGY / 逻辑拓扑</text>
        {wires.map((wire, index) => <g key={index}>
          <path d={`M${wire.from[0]} ${wire.from[1]}L${wire.to[0]} ${wire.to[1]}`} stroke={wire.color || '#37aa8a'} strokeWidth="4" strokeLinecap="round" />
          <rect x={(wire.from[0] + wire.to[0]) / 2 - (wire.label.length > 20 ? 110 : 64)} y={(wire.labelY || 114) - 17} width={wire.label.length > 20 ? 220 : 128} height="28" rx="7" fill="#fff" stroke="#d8e8e3" />
          <text x={(wire.from[0] + wire.to[0]) / 2} y={(wire.labelY || 114) + 2} textAnchor="middle" fontSize="12" fontWeight="600" fill="#3d6961">{wire.label}</text>
        </g>)}
        {nodes.map((node) => <Device key={node.label} node={node} />)}
        <text x="460" y="290" textAnchor="middle" fontSize="13" fontWeight="600" fill="#54756f">{note.en}</text>
      </svg>
    </div>
    <figcaption><B value={note} /><span className="pt-diagram-note"><B value={{ en: 'Diagram · port names match the tables below · swipe sideways on a small screen', zh: '示意图 · 具体端口以表格为准 · 小屏幕可横向滑动' }} /></span></figcaption>
  </figure>;
}

function MockWindow({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="pt-mock"><div className="pt-mock-title"><span className="pt-mock-dots"><i/><i/><i/></span><strong>{title}</strong><span>UI GUIDE / 界面示意</span></div>{children}</div>;
}

function PaletteVisual({ lab }: { lab: PacketTracerLab }) {
  return <MockWindow title="Cisco Packet Tracer · Logical">
    {lab.id === 'vlan' ? <div className="pt-mock-canvas"><span><Laptop size={25}/>PC-A</span><span><Laptop size={25}/>PC-B</span><span><Network size={25}/>S1</span><span><Router size={25}/>R1</span></div> : <div className="pt-mock-canvas"><span><Laptop size={25}/>PC-A</span><i>━━</i><span><Network size={25}/>S1</span>{lab.id === 'routing' && <><i>━━</i><span><Router size={25}/>R1</span><i>━━</i><span><Network size={25}/>S2</span></>}<i>━━</i><span><Laptop size={25}/>PC-B</span></div>}
    <div className="pt-mock-palette"><span><b>1</b><Laptop size={18}/>End Devices<small>PC-PT</small></span><span><b>2</b><Network size={18}/>Network Devices<small>2960 / 2911</small></span><span><b>3</b><Cable size={18}/>Connections<small>Copper Straight-Through</small></span></div>
  </MockWindow>;
}

function IpVisual({ lab }: { lab: PacketTracerLab }) {
  const pc = lab.addresses.find((row) => row.device.startsWith('PC-A'))!;
  return <MockWindow title="PC-A"><div className="pt-mock-tabs"><span>Physical</span><span>Config</span><strong>Desktop</strong><span>Programming</span></div><div className="pt-mock-form"><div className="pt-mock-selected">IP Configuration</div><div className="pt-mock-field">IPv4 Address <strong>{pc.ip}</strong></div><div className="pt-mock-field">Subnet Mask <strong>{pc.mask}</strong></div><div className="pt-mock-field">Default Gateway <strong>{pc.gateway === '—' ? '(empty / 留空)' : pc.gateway}</strong></div></div></MockWindow>;
}

function CliVisual({ lab, device }: { lab: PacketTracerLab; device: 'S1' | 'R1' }) {
  const config = lab.configs.find((item) => item.device.startsWith(device));
  const lines = config?.code.split('\n').filter((line) => /^(interface|vlan |switchport|encapsulation|ip address|no shutdown|show )/.test(line)).slice(0, 6) || [];
  return <MockWindow title={`${device} · ${device === 'S1' ? '2960' : '2911'}`}><div className="pt-mock-tabs"><span>Physical</span><span>Config</span><strong>CLI</strong></div><div className="pt-mock-cli"><span>Switch / Router Console</span>{lines.map((line, index) => <code key={`${line}-${index}`}><em>›</em> {line}</code>)}</div></MockWindow>;
}

export function SimulationVisual({ lab }: { lab: PacketTracerLab }) {
  return <div className="pt-simulation-visual"><MockWindow title="Cisco Packet Tracer · Simulation"><div className="pt-mock-simulation"><div className="pt-mock-workspace"><span>PC-A</span><i>➜</i><span>{lab.id === 'lan' ? 'S1' : 'Gateway / 网关'}</span><i>➜</i><span>PC-B</span><p><Send size={15}/> Add Simple PDU: click PC-A, then PC-B</p></div><div className="pt-mock-events"><strong>Event List</strong><span><b>1</b> ARP <small>Who has the next-hop IP?</small></span><span><b>2</b> ICMP <small>Echo request / reply</small></span><div>◀ &nbsp; ▶ &nbsp; <b>Capture / Forward</b></div></div></div><div className="pt-mock-footer"><span>Realtime</span><strong>Simulation</strong><span>Filters: ARP · ICMP</span></div></MockWindow><p><B value={{ en: 'Switch to Simulation at the lower right. Select ARP and ICMP in the event filters, then use Add Simple PDU (envelope icon) and Capture / Forward.', zh: '右下角切换到 Simulation，在事件过滤器选 ARP 与 ICMP。点击信封图标 Add Simple PDU，依次选源与目标，再用 Capture / Forward 逐步查看。' }} /></p></div>;
}

export function PacketStepVisual({ lab, index }: { lab: PacketTracerLab; index: number }) {
  let visual: React.ReactNode;
  let caption: Pair;
  if (index === 0 && lab.id !== 'vlan') {
    visual = <PaletteVisual lab={lab} />;
    caption = { en: 'Bottom palette: End Devices → PC-PT; Network Devices → 2960 / 2911; Connections → Copper Straight-Through. Select each device and its exact port from the map above.', zh: '在底部设备栏依次找到 End Devices → PC-PT、Network Devices → 2960 / 2911、Connections → Copper Straight-Through。连线时按上方端口表逐一选择接口。' };
  } else if ((index === 1 && lab.id === 'lan') || (index === 0 && lab.id === 'vlan')) {
    visual = lab.id === 'vlan' ? <><PaletteVisual lab={lab} /><IpVisual lab={lab} /></> : <IpVisual lab={lab} />;
    caption = lab.id === 'vlan' ? { en: 'Choose devices and cables from the bottom palette, then click each PC → Desktop → IP Configuration. Enter the values from the address plan.', zh: '先在底部设备栏选设备与线缆，再点击每台电脑 → Desktop → IP Configuration，按地址表填写。' } : { en: 'Click a PC → Desktop → IP Configuration. Enter the values from the address plan, then repeat on PC-B.', zh: '点击电脑 → Desktop → IP Configuration，按地址表填写。随后在 PC-B 重复操作。' };
  } else if (index === 1 && lab.id === 'routing') {
    visual = <><IpVisual lab={lab} /><CliVisual lab={lab} device="R1" /></>;
    caption = { en: 'Enter PC values under Desktop → IP Configuration. Then click R1 → CLI and apply the full R1 command block below.', zh: '先在 Desktop → IP Configuration 填电脑地址，再点击 R1 → CLI 输入下方完整命令。' };
  } else if (index === 1 && lab.id === 'vlan') {
    visual = <CliVisual lab={lab} device="S1" />;
    caption = { en: 'Click S1 → CLI. Create the two VLANs, assign access ports, and configure the trunk using the full command block below.', zh: '点击 S1 → CLI，按下方完整命令建立 VLAN、分配接入口并配置 Trunk。' };
  } else if (index === 2 && lab.id === 'vlan') {
    visual = <CliVisual lab={lab} device="R1" />;
    caption = { en: 'Click R1 → CLI. Configure G0/0.10 and G0/0.20 after enabling the physical G0/0 interface.', zh: '点击 R1 → CLI。先启用物理 G0/0，再配置 G0/0.10 与 G0/0.20。' };
  } else {
    visual = <SimulationVisual lab={lab} />;
    caption = { en: 'Simulation reveals each event. The full observation prompts appear below.', zh: 'Simulation 会展示每个事件；下方还有具体观察问题。' };
  }
  return <figure className="pt-step-figure">{visual}<figcaption><B value={caption} /></figcaption></figure>;
}
