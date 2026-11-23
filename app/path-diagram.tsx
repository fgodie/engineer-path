import { useState } from 'react';
import { Laptop, Network, Server, ArrowRight } from 'lucide-react';

const stops = [
  {
    label: 'Laptop', zh: '电脑', icon: Laptop,
    en: 'The browser sends a request for a page.',
    note: '浏览器发出请求，索取一个网页。',
  },
  {
    label: 'Gateway', zh: '网关', icon: Network,
    en: 'The gateway forwards the packet towards the server’s network.',
    note: '网关查找路由，把数据包转向服务器所在的网络。',
  },
  {
    label: 'Server', zh: '服务器', icon: Server,
    en: 'The web service receives the request and returns the page.',
    note: '网页服务接收请求，再把页面发回给浏览器。',
  },
] as const;

export function PathDiagram() {
  const [selected, setSelected] = useState(0);
  return <figure className="path-diagram">
    <figcaption><span lang="en">Trace a web request</span><span lang="zh-CN">跟踪一次网页请求</span></figcaption>
    <div className="path-nodes">
      {stops.map(({label, zh, icon: Icon}, index) => <div className="path-stop" key={label}>
        <button type="button" aria-pressed={index === selected} onClick={() => setSelected(index)}>
          <Icon aria-hidden="true" size={29} strokeWidth={1.4}/>
          <span lang="en">{label}</span><small>{zh}</small>
        </button>
        {index < stops.length - 1 && <ArrowRight aria-hidden="true" className="path-wire"/>}
      </div>)}
    </div>
    <p aria-live="polite"><span lang="en">{stops[selected].en}</span><span lang="zh-CN">{stops[selected].note}</span></p>
  </figure>;
}
