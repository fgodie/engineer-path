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
  return ['n13', 'n14', 'n15', 'n16', 's11'].includes(lessonId);
}

function PacketTable() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const visible = packets.filter(packet => filter === 'All' || packet.protocol === filter);
  return <figure className="foundation-visual">
    <figcaption><strong>Simulated packet capture / 模拟抓包</strong></figcaption>
    <fieldset className="packet-filters" aria-label="Display filter / 显示过滤器">
      {filters.map(value => <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>
        {value === 'All' ? 'All / 全部' : value}
      </button>)}
      <output>{visible.length} / {packets.length} packets · 报文</output>
    </fieldset>
    <section className="packet-table-scroll" aria-label="Packet table / 报文表">
      <table>
        <thead><tr>
          <th scope="col">Time / 秒</th><th scope="col">Protocol / 协议</th><th scope="col">Source / 源</th>
          <th scope="col">Destination / 目的</th><th scope="col">Info / 摘要</th>
        </tr></thead>
        <tbody>{visible.map(packet => <tr key={packet.time}>
          <td>{packet.time}</td><td>{packet.protocol}</td><td>{packet.from}</td><td>{packet.to}</td><td>{packet.detail}</td>
        </tr>)}</tbody>
      </table>
    </section>
  </figure>;
}

function TransferTime() {
  const [rate, setRate] = useState(20);
  const seconds = 80 / rate;
  return <figure className="foundation-visual measurement">
    <figcaption><strong>Send the same 10 MB file / 传送同一个 10 MB 文件</strong></figcaption>
    <fieldset className="packet-filters" aria-label="Payload rate / 有效速率">
      {[10, 20, 40].map(value => <button type="button" key={value} aria-pressed={value === rate} onClick={() => setRate(value)}>{value} Mb/s</button>)}
    </fieldset>
    <div className="time-ruler" aria-hidden="true"><span style={{width: `${seconds / 8 * 100}%`}}/></div>
    <div className="ruler-scale" aria-hidden="true"><span>0 s</span><span>4 s</span><span>8 s</span></div>
    <output>80 Mb ÷ {rate} Mb/s = <strong>{seconds} seconds / 秒</strong></output>
  </figure>;
}

function ErrorBudget() {
  const [failed, setFailed] = useState(6);
  const remaining = 10 - failed;
  return <figure className="foundation-visual measurement">
    <figcaption><strong>10,000 requests · Target 99.9% / 一万次请求，成功率目标 99.9%</strong></figcaption>
    <fieldset className="packet-filters" aria-label="Select failed requests / 选择失败次数">
      {[6, 10, 11].map(value => <button type="button" key={value} aria-pressed={value === failed} onClick={() => setFailed(value)}>{value} failed / {value} 次失败</button>)}
    </fieldset>
    <div className="budget-cells" aria-hidden="true">{Array.from({length: 10}, (_, i) => <span key={i} className={i < failed ? 'used' : ''}>{i < failed ? '×' : '·'}</span>)}</div>
    <output>{((10000 - failed) / 100).toFixed(2)}% success / 成功率 · <strong>{remaining >= 0 ? `${remaining} of 10 left / 剩余 ${remaining} 次` : 'Over budget by 1 / 超出预算 1 次'}</strong></output>
  </figure>;
}

export function FoundationVisual({ lessonId, section, lab = false }: { lessonId: string; section?: number; lab?: boolean }) {
  if (lessonId === 'n14' && (lab || section === 1)) return <PacketTable />;
  if (lab) return null;
  if (lessonId === 'n16' && section === 0) return <TransferTime />;
  if (lessonId === 's11' && section === 2) return <ErrorBudget />;

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
