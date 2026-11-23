import { useState } from 'react';
import { Activity, ArrowRight, Cable, Cpu, Globe, Laptop, Network, Server } from 'lucide-react';

const diagrams = {
  network: {
    title: ['Trace a web request', '跟踪一次网页请求'],
    stops: [
      { label: 'Laptop', zh: '电脑', icon: Laptop, reading: 'SRC  192.0.2.20', en: 'The browser sends a request for a page.', note: '浏览器发出请求，索取一个网页。' },
      { label: 'Gateway', zh: '网关', icon: Network, reading: 'NEXT HOP  192.0.2.1', en: 'The gateway forwards the packet towards the server’s network.', note: '网关查找路由，把数据包转向服务器所在的网络。' },
      { label: 'Server', zh: '服务器', icon: Server, reading: 'DST  198.51.100.8', en: 'The web service receives the request and returns the page.', note: '网页服务接收请求，再把页面发回给浏览器。' },
    ],
  },
  system: {
    title: ['Check a web service', '逐层检查网页服务'],
    stops: [
      { label: 'Process', zh: '进程', icon: Cpu, reading: 'PROCESS  web · running', en: 'The operating system sees a running web process. Next, check where it listens.', note: '系统看到网页进程正在运行。下一步，检查它在哪个地址等待请求。' },
      { label: 'Listener', zh: '监听', icon: Cable, reading: 'LISTEN  127.0.0.1:8080', en: 'The listener accepts local connections on port 8080. Test from this host first.', note: '该进程在 8080 端口接受本机连接。先在服务器本机验证。' },
      { label: 'Response', zh: '响应', icon: Globe, reading: 'HTTP/1.1  200 OK', en: 'The local request returned a page. Remote access needs a separate check.', note: '本机请求成功返回页面。远程用户能否访问，还需要单独检查。' },
    ],
  },
} as const;

export function PathDiagram({track}: {track: keyof typeof diagrams}) {
  const [selected, setSelected] = useState(0);
  const diagram = diagrams[track];
  const current = diagram.stops[selected];
  return <figure className="path-diagram">
    <figcaption><Activity size={17} aria-hidden="true"/><span lang="en">{diagram.title[0]}</span><span lang="zh-CN">{diagram.title[1]}</span></figcaption>
    <div className="path-nodes">
      {diagram.stops.map(({label, zh, icon: Icon}, index) => <div className="path-stop" key={label}>
        <button type="button" aria-pressed={index === selected} onClick={() => setSelected(index)}>
          {track === 'network'
            ? <span className={`device-drawing device-${label.toLowerCase()}`} aria-hidden="true"><i/><i/><i/></span>
            : <span className="system-drawing"><Icon aria-hidden="true" size={26} strokeWidth={1.5}/></span>}
          <span lang="en">{label}</span><small>{zh}</small>
        </button>
        {index < diagram.stops.length - 1 && <span className="signal-wire" aria-hidden="true"><ArrowRight size={14}/></span>}
      </div>)}
    </div>
    <div className="signal-reading" aria-live="polite">
      <code>{current.reading}</code>
      <p><span lang="en">{current.en}</span><span lang="zh-CN">{current.note}</span></p>
    </div>
  </figure>;
}
