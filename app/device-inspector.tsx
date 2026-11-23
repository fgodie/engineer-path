import { useId, useState } from 'react';
import { Box, Layers3, Route } from 'lucide-react';

const devices = {
  network: {
    title: 'Ethernet switch / 以太网交换机',
    parts: [
      { label: 'RJ45', name: 'Ethernet ports / 以太网端口', x: 31, y: 58, en: 'Frames enter and leave the switch through these ports.', zh: '以太网帧通过这些端口进出交换机。' },
      { label: 'ASIC', name: 'Switching chip / 交换芯片', x: 58, y: 42, en: 'The chip looks up forwarding information and directs frames to outgoing ports.', zh: '芯片查询转发信息，将帧送往相应的出端口。' },
    ],
    route: [[31,58], [39,54], [45,54], [58,42], [65,46], [61,53], [68,59], [61,67]],
    routeLabel: 'Frame path / 帧转发路径',
    routeNote: ['A frame enters one port. The switching chip chooses an outgoing port and forwards it.', '一帧从一个端口进入，交换芯片选出端口，再将它转发出去。'],
    bench: ['Patch cables connect devices to the switch’s front ports.', '跳线将设备连接到交换机前面板的端口。'],
  },
  system: {
    title: 'Server board / 服务器主板',
    parts: [
      { label: 'CPU', name: 'Processor / 处理器', x: 37, y: 49, en: 'The CPU runs instructions. The heat sink above carries heat away.', zh: 'CPU 执行指令，上方的散热器帮助带走热量。' },
      { label: 'DIMM', name: 'Memory modules / 内存条', x: 64, y: 40, en: 'These modules hold data and instructions that running programs need.', zh: '内存条暂存正在运行的程序所需的数据和指令。' },
    ],
    route: [[37,49], [44,54], [51,52], [64,40], [66,43], [53,56], [46,58], [37,49]],
    routeLabel: 'Memory read / 内存读取路径',
    routeNote: ['In this simplified example, a CPU request reaches memory and the requested data returns.', '在这个简化示例中，CPU 的请求到达内存，所需数据再返回。'],
    bench: ['Look for the heat-sink fins beside the server’s memory slots.', '观察服务器内存插槽旁排列整齐的散热鳍片。'],
  },
} as const;

function SignalTrace({ points }: { points: readonly (readonly [number, number])[] }) {
  return <div className="signal-overlay" aria-hidden="true">{points.slice(1).map(([x, y], index) => {
    const [left, top] = points[index];
    const dx = x - left;
    const dy = (y - top) * 2 / 3; // Image space is 3:2.
    return <i key={index} style={{
      left: `${left}%`, top: `${top}%`, width: `${Math.hypot(dx, dy)}%`,
      transform: `rotate(${Math.atan2(dy, dx)}rad)`, animationDelay: `${index * 150}ms`,
    }}/>;
  })}</div>;
}

export function DeviceInspector({ track }: { track: keyof typeof devices }) {
  const [view, setView] = useState<'cutaway' | 'bench'>('cutaway');
  const [partIndex, setPartIndex] = useState(0);
  const [showTrace, setShowTrace] = useState(false);
  const captionId = useId();
  const device = devices[track];
  const part = device.parts[partIndex];
  const cutaway = view === 'cutaway';
  const detail = showTrace
    ? { name: device.routeLabel, text: device.routeNote }
    : { name: part.name, text: [part.en, part.zh] };
  const caption = cutaway ? detail : { name: device.title, text: device.bench };
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  return <figure className="device-inspector" aria-label={device.title}>
    <div className="inspector-modes" role="group" aria-label="Device view / 设备视图">
      <button type="button" aria-pressed={cutaway} onClick={() => setView('cutaway')}><Layers3 size={13} aria-hidden="true"/>Cutaway / 结构</button>
      <button type="button" aria-pressed={!cutaway} onClick={() => setView('bench')}><Box size={13} aria-hidden="true"/>Bench / 台面</button>
    </div>
    <div className="inspector-scene" key={view}>
      <img className="inspector-image" src={`${base}/hardware/${track}-${view}.jpg`} alt={device.title} width={1200} height={800} fetchPriority="high" />
      {cutaway && showTrace && <SignalTrace points={device.route}/>}
      {cutaway && device.parts.map((item, i) => <button type="button" key={item.label}
        className={`part-pin part-pin-${i}`} style={{left: `${item.x}%`, top: `${item.y}%`}}
        aria-pressed={!showTrace && i === partIndex} aria-label={`${item.label} · ${item.name}`} aria-controls={captionId}
        onClick={() => { setPartIndex(i); setShowTrace(false); }}><span className="pin-target" aria-hidden="true"/><span className="pin-label">{item.label}</span></button>)}
    </div>
    <figcaption id={captionId} className="inspector-caption" aria-live="polite" aria-atomic="true">
      <strong>{caption.name}</strong>
      <span lang="en">{caption.text[0]}</span>
      <span lang="zh-CN">{caption.text[1]}</span>
    </figcaption>
    {cutaway && <button className="trace-control" type="button" aria-pressed={showTrace} aria-controls={captionId} onClick={() => setShowTrace(!showTrace)}>
      <Route size={14} aria-hidden="true"/>{device.routeLabel}
    </button>}
  </figure>;
}
