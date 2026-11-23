import { useState } from 'react';

const packets = [
  { time: '0.000', protocol: 'DNS', from: 'Client', to: 'Resolver', detail: 'A lab.example?' },
  { time: '0.014', protocol: 'DNS', from: 'Resolver', to: 'Client', detail: 'A 192.0.2.80' },
  { time: '0.020', protocol: 'TCP', from: 'Client:51514', to: 'Server:443', detail: 'SYN' },
  { time: '0.030', protocol: 'TCP', from: 'Server:443', to: 'Client:51514', detail: 'SYN, ACK' },
  { time: '0.031', protocol: 'TCP', from: 'Client:51514', to: 'Server:443', detail: 'ACK' },
] as const;

const filters = ['All', 'DNS', 'TCP'] as const;

export function hasFoundationVisual(lessonId: string) {
  return ['n13', 'n14', 'n15'].includes(lessonId);
}

function PacketTable() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const visible = packets.filter(packet => filter === 'All' || packet.protocol === filter);
  return <figure className="foundation-visual">
    <figcaption><strong>Simulated packet capture / 模拟抓包</strong></figcaption>
    <div className="packet-filters" role="group" aria-label="Display filter / 显示过滤器">
      {filters.map(value => <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>
        {value === 'All' ? 'All / 全部' : value}
      </button>)}
      <span role="status">{visible.length} / {packets.length} packets · 报文</span>
    </div>
    <div className="packet-table-scroll" role="region" aria-label="Packet table / 报文表" tabIndex={0}>
      <table>
        <thead><tr>
          <th scope="col">Time / 秒</th><th scope="col">Protocol / 协议</th><th scope="col">Source / 源</th>
          <th scope="col">Destination / 目的</th><th scope="col">Info / 摘要</th>
        </tr></thead>
        <tbody>{visible.map(packet => <tr key={packet.time}>
          <td>{packet.time}</td><td>{packet.protocol}</td><td>{packet.from}</td><td>{packet.to}</td><td>{packet.detail}</td>
        </tr>)}</tbody>
      </table>
    </div>
  </figure>;
}

export function FoundationVisual({ lessonId, section, lab = false }: { lessonId: string; section?: number; lab?: boolean }) {
  if (lessonId === 'n14' && (lab || section === 1)) return <PacketTable />;
  if (lab) return null;

  if (lessonId === 'n13' && section === 2) return <figure className="foundation-visual">
    <figcaption><strong>The first frame on the wire / 链路上的第一个数据帧</strong></figcaption>
    <div className="arp-example">
      <div><span>Host / 主机</span><code>192.168.10.10</code></div>
      <div><span>Next-hop gateway / 下一跳网关</span><code>192.168.10.1</code></div>
      <div><span>Remote server / 远端服务器</span><code>192.0.2.80</code></div>
    </div>
    <dl className="frame-fields">
      <div><dt>Destination MAC / 目的 MAC</dt><dd>Gateway’s MAC / 网关的 MAC</dd></div>
      <div><dt>Destination IP / 目的 IP</dt><dd><code>192.0.2.80</code></dd></div>
    </dl>
  </figure>;

  if (lessonId === 'n15' && section === 0) return <figure className="foundation-visual">
    <figcaption><strong>A new HTTP/1.1 or HTTP/2 connection / 新建 HTTP/1.1 或 HTTP/2 连接</strong></figcaption>
    <ol className="https-example">
      <li><strong>DNS</strong><span>Resolve the name / 解析域名</span></li>
      <li><strong>TCP</strong><span>Connect to the port / 连接端口</span></li>
      <li><strong>TLS</strong><span>Verify identity / 验证身份</span></li>
      <li><strong>HTTP</strong><span>Read the response / 读取响应</span></li>
    </ol>
  </figure>;

  return null;
}
