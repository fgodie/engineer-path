import { ArrowUpRight } from 'lucide-react';
import { lessonDiagrams } from './lesson-diagrams';

export function LessonFigure({lessonId,section}:{lessonId:string;section:number}){
 const d=lessonDiagrams[lessonId];
 if(!d||d.afterSection!==section)return null;
 const basePath=process.env.NEXT_PUBLIC_BASE_PATH ?? '';
 const path=`${basePath}/diagrams/${d.file}.svg`;
 return <figure className="lesson-figure">
  <header><div><span lang="en" className="figure-kicker">VISUAL EXAMPLE</span><span lang="zh-CN" className="figure-kicker">图解示例</span></div><a href={path} target="_blank" rel="noreferrer"><span lang="en">Open full size</span><span lang="zh-CN">查看原图</span><ArrowUpRight size={16}/></a></header>
  <h3><span lang="en">{d.title.en}</span><span lang="zh-CN">{d.title.zh}</span></h3>
  <div className="figure-scroll" tabIndex={0} role="region" aria-label="Illustration; scroll horizontally on small screens / 示意图，小屏幕可左右滚动">
   <img src={path} alt={`${d.title.en}. ${d.caption.en} ${d.title.zh}。${d.caption.zh}`} width={920} height={d.file==='encapsulation'?480:d.file==='subnet'?470:d.file==='vlan'?540:d.file==='route-lookup'?476:d.file==='evpn'?560:535} loading="lazy" decoding="async"/>
  </div>
  <figcaption><span lang="en">{d.caption.en}</span><span lang="zh-CN">{d.caption.zh}</span></figcaption>
 </figure>
}
