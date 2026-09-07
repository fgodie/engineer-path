'use client';

export const dynamic = 'force-static';

import { useState } from 'react';
import { Network, Server, ArrowUpRight, ArrowRight, BookOpen, Terminal, Layers, ChevronLeft, Check, Circle, Route, GraduationCap, FlaskConical, Languages, Images, Clock3, Sparkles } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { lessons, stages, type Lesson } from './lessons';
import { english } from './english';
import { LessonFigure } from './lesson-figure';
import { lessonDiagrams } from './lesson-diagrams';
import { commandTranslations, stageEnglish, stageNames, sourceChinese } from './interface-translations';

function B({en,zh}:{en:string;zh:string}){return <span className="bi"><span lang="en" className="bi-en">{en}</span><span lang="zh-CN" className="bi-zh">{zh}</span></span>}
function commandText(text:string){return text.split('\n').map(line=>commandTranslations[line] ? commandTranslations[line]+' / '+line.replace(/^[#!] /,'') : line).join('\n')}

export default function Home(){return <SidebarProvider style={{'--sidebar-width':'246px'} as React.CSSProperties}><LearningSpace/></SidebarProvider>}
function LearningSpace(){
 const {setOpenMobile}=useSidebar();
 const [track,setTrack]=useState<'network'|'system'>('network');
 const [selected,setSelected]=useState<Lesson|null>(null);
 const [view,setView]=useState('courses');
 function navigate(v:string){setView(v);setSelected(null);setOpenMobile(false);window.scrollTo({top:0});}
 const list=lessons.filter(l=>l.track===track);
 return <>
 <Sidebar className="site-sidebar"><SidebarHeader className="brand"><div className="brand-mark"><Network size={23}/></div><div>Engineer<span>PATH / 学习手册</span></div></SidebarHeader>
 <SidebarContent className="side-content"><p className="overline side-label"><B en="YOUR LEARNING SPACE" zh="你的学习空间"/></p><SidebarMenu>{[["courses","学习路径",Route],["compare","岗位对照",Layers],["resources","参考资料",BookOpen]].map(([id,label,Icon])=><SidebarMenuItem key={String(id)}><SidebarMenuButton className="nav-item" isActive={view===id} onClick={()=>navigate(String(id))}>{typeof Icon!=='string'&&<Icon/>}<B en={id==='courses'?'Learning path':id==='compare'?'Role comparison':'References'} zh={String(label)}/>{view===id&&<span className="nav-dot"/>}</SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu>
 <div className="side-divider"/><p className="overline side-label"><B en="LEARNING TRACKS" zh="学习方向"/></p><button className={`track-nav ${track==='network'?'chosen':''}`} onClick={()=>{setTrack('network');navigate('courses')}}><Network size={18}/><B en="Network Engineer" zh="网络工程师"/></button><button className={`track-nav ${track==='system'?'chosen':''}`} onClick={()=>{setTrack('system');navigate('courses')}}><Server size={18}/><B en="System Engineer" zh="系统工程师"/></button>
 </SidebarContent><SidebarFooter><div className="side-note"><Terminal size={21}/><strong><B en="Understand it. Then build it." zh="理解原理，然后动手。"/></strong><p><B en="Every lesson starts with a practical question." zh="每一课，都从一个实际问题开始。"/></p><span>LEARN → BUILD → REVIEW</span></div><div className="side-bottom"><span className="avatar">学</span><div><B en="My engineering journey" zh="我的工程师之路"/><small><B en="Personal learning space" zh="个人学习空间"/></small></div></div></SidebarFooter></Sidebar>
 <main className="main"><header className="topbar"><div><SidebarTrigger aria-label="Toggle navigation / 展开或收起导航"/><span><B en="Workspace" zh="学习空间"/></span><span className="slash">/</span><b><B en={view==='courses'?'Learning path':view==='compare'?'Role comparison':'References'} zh={view==='courses'?'学习路径':view==='compare'?'岗位对照':'参考资料'}/></b></div><span className="language" lang="en">EN <span> + 中文</span></span></header>
 <div className="workspace">{selected?<LessonView key={selected.id} lesson={selected} onBack={()=>setSelected(null)} onNext={()=>{const i=list.findIndex(l=>l.id===selected.id);setSelected(list[i+1]||null);window.scrollTo({top:0})}}/>:view==='courses'?<>
 <div className="page-heading"><div><p className="overline"><Sparkles size={14}/>THE ENGINEER’S FIELD GUIDE</p><h1><B en="Build the skills behind every reliable system." zh="掌握可靠系统背后的工程能力。"/></h1><p className="intro"><B en="Learn the concept, see it visually, then prove it in a hands-on lab." zh="理解原理、看懂图解，再通过动手实验真正掌握。"/></p></div><span className="edition">SELF-STUDY GUIDE<br/><b>English + 中文</b></span></div>
 <Tabs value={track} onValueChange={v=>setTrack(v as 'network'|'system')}><TabsList className="track-tabs"><TabsTrigger value="network"><Network/><B en="Network Engineer" zh="网络工程师"/></TabsTrigger><TabsTrigger value="system"><Server/><B en="System Engineer" zh="系统工程师"/></TabsTrigger></TabsList><TabsContent value={track}>
 <section className="start-panel"><div className="hero-grid" aria-hidden="true"/><div className="start-copy"><span className="pill"><span className="live-dot"/>START HERE · 从这里开始</span><h2><B en={track==='network'?"A packet’s first journey":'Keep your first server running'} zh={track==='network'?'数据包的第一段旅程':'让第一台服务器稳定运行'}/></h2><p><B en={track==='network'?'Start with devices, protocols and IP addresses to understand how networks connect everything.':'Start with operating systems, services and permissions to understand reliable service delivery.'} zh={track==='network'?'从设备、协议与 IP 地址开始，理解网络如何把一切连接起来。':'从操作系统、服务与权限开始，理解系统如何可靠地提供服务。'}/></p><button className="primary-button" onClick={()=>setSelected(list[0])}><B en="Start lesson one" zh="开始第一课"/><ArrowRight size={17}/></button><div className="hero-stats"><span><BookOpen/> <b>{list.length}</b><small>TOPICS / 主题</small></span><span><FlaskConical/> <b>{list.length}</b><small>LABS / 实验</small></span><span><Languages/> <b>EN + 中</b><small>TOGETHER / 对照</small></span></div></div><div className="network-diagram" aria-label={track==='network'?'Host → Switch → Router → Server / 终端 → 交换机 → 路由器 → 服务器':'User → Identity → Service / 用户 → 身份 → 服务'}><div className="diagram-label">LIVE PATH / 实时路径</div>{(track==='network'?[[Terminal,'终端','HOST'],[Network,'交换机','SWITCH'],[Route,'路由器','ROUTER'],[Server,'服务器','SERVER']]:[[Terminal,'用户','USER'],[Layers,'身份','IDENTITY'],[Server,'服务','SERVICE']]).map(([Icon,name,en],i)=><div className="diagram-node" key={String(en)}>{i>0&&<span className="connector"/>}<div>{typeof Icon!=='string'&&<Icon size={26}/>}</div><b>{String(name)}</b><small>{String(en)}</small></div>)}</div></section>
 <div className="curriculum-title"><h2><B en="Your learning path" zh="你的学习路径"/></h2><span><B en={`${list.length} topics · ${track==='network'?4:2} stages`} zh={`${list.length} 个主题 · ${track==='network'?4:2} 个阶段`}/></span></div>
 <div className="curriculum">{stages.filter(s=>s.track===track).map((stage,i)=><section className={`stage stage-${i+1}`} key={stage.key}><div className="stage-index">{String(i+1).padStart(2,'0')}</div><div className="stage-body"><div className="stage-heading"><div><h3><B en={stageNames[stage.key]} zh={stage.name}/></h3><p><B en={stageEnglish[stage.key].description} zh={stage.description}/></p></div><span className="week-tag"><B en={stageEnglish[stage.key].weeks} zh={stage.weeks}/></span></div><div className="lesson-grid">{list.filter(l=>l.stage===stage.key).map(l=><button className="lesson-card" key={l.id} onClick={()=>{setSelected(l);window.scrollTo({top:0})}}><div className="lesson-card-top"><span className="lesson-number">{l.id.toUpperCase()}</span>{lessonDiagrams[l.id]&&<span className="visual-badge"><Images size={13}/>VISUAL / 图解</span>}<ArrowUpRight size={17}/></div><h4><B en={l.en} zh={l.title}/></h4><div className="lesson-tags"><span><Clock3 size={13}/>{l.minutes} min</span><span><FlaskConical size={13}/>LAB</span></div><footer><BookOpen size={14}/><span>Read · Lab · Quiz<br/>讲解 · 实验 · 自测</span></footer></button>)}</div></div></section>)}</div>
 </TabsContent></Tabs><div className="bottom-note"><GraduationCap size={20}/><p><B en="Learn at your own pace. Complete the labs and explain the principles rather than racing through the schedule." zh="学习节奏因人而异。完成实验、解释原理，比赶进度更重要。"/></p></div>
 </>:view==='compare'?<Compare/>:<Resources/>}</div><footer className="page-footer"><span>ENGINEER PATH</span><span><B en="Build knowledge and the confidence to solve problems." zh="建立知识，也建立解决问题的信心。"/></span></footer></main></>
}
function LessonView({lesson:l,onBack,onNext}:{lesson:Lesson,onBack:()=>void,onNext:()=>void}){
 const [answer,setAnswer]=useState<number|null>(null);
 const e=english[l.id];
 return <article className="reader">
  <button className="back" onClick={onBack}><ChevronLeft size={16}/><B en="Back to learning path" zh="返回学习路径"/></button>
  <div className="reader-cover"><div className="reader-orbit" aria-hidden="true"/><p className="overline">{l.id.toUpperCase()} / ENGLISH + 中文</p><h1><B en={l.en} zh={l.title}/></h1><p className="reader-summary"><B en={e.summary} zh={l.summary}/></p><div className="reader-meta"><span><Clock3 size={15}/>{l.minutes} MIN</span><span><FlaskConical size={15}/>HANDS-ON LAB / 动手实验</span>{lessonDiagrams[l.id]&&<span><Images size={15}/>VISUAL GUIDE / 图解</span>}</div></div>
  <Tabs defaultValue="read">
   <TabsList className="reader-tabs">
    <TabsTrigger value="read"><B en="Concepts" zh="知识讲解"/></TabsTrigger>
    <TabsTrigger value="lab"><B en="Hands-on lab" zh="动手实验"/></TabsTrigger>
    <TabsTrigger value="quiz"><B en="Knowledge check" zh="课后自测"/></TabsTrigger>
   </TabsList>
   <TabsContent value="read">
    <div className="objective"><span><B en="By the end of this lesson, you can" zh="学完这一课，你能够"/></span><p><B en={e.objective} zh={l.objective}/></p></div>
    {l.sections.map((section,i)=><section className="lesson-section" key={section.heading}><h2><B en={e.sections[i].heading} zh={section.heading}/></h2><p><B en={e.sections[i].body} zh={section.body}/></p><LessonFigure lessonId={l.id} section={i}/></section>)}
    <div className="takeaway"><b><B en="Key takeaway" zh="记住这一点"/></b><p><B en={e.takeaway} zh={l.takeaway}/></p></div>
    <h2 className="reference-heading"><B en="Further reading" zh="继续阅读"/></h2>
    <a className="resource-link" href={l.source.url} target="_blank" rel="noreferrer"><B en={l.source.title} zh={sourceChinese[l.source.title]}/><ArrowUpRight size={17}/></a>
   </TabsContent>
   <TabsContent value="lab"><section className="lesson-section">
    <h2><B en={e.lab.title} zh={l.lab.title}/></h2>
    <p className="lab-env"><B en={'Environment: '+e.lab.environment} zh={'实验环境：'+l.lab.environment}/></p>
    <ol className="lab-steps">{l.lab.steps.map((step,i)=><li key={step}><B en={e.lab.steps[i]} zh={step}/></li>)}</ol>
    <pre><code>{commandText(l.lab.command)}</code></pre>
    <div className="objective"><span><B en="Acceptance criteria" zh="验收标准"/></span><p><B en={e.lab.verify} zh={l.lab.verify}/></p></div>
   </section></TabsContent>
   <TabsContent value="quiz"><section className="quiz">
    <p className="overline"><B en="Check your understanding" zh="检查你的理解"/></p>
    <h2><B en={e.quiz.question} zh={l.quiz.question}/></h2>
    <div className="options">{l.quiz.options.map((option,i)=><button key={option} aria-pressed={answer===i} className={answer===i?'selected':''} onClick={()=>setAnswer(i)}>{answer===i?<Check size={18}/>:<Circle size={18}/>}<B en={e.quiz.options[i]} zh={option}/></button>)}</div>
    {answer!==null&&<div role="status" className={`feedback ${answer===l.quiz.correct?'correct':''}`}><b><B en={answer===l.quiz.correct?'Correct':'Try again'} zh={answer===l.quiz.correct?'回答正确':'再想一想'}/></b><p><B en={e.quiz.explanation} zh={l.quiz.explanation}/></p></div>}
   </section></TabsContent>
  </Tabs>
  <div className="reader-end"><button className="back" onClick={onBack}><B en="Contents" zh="回到目录"/></button><button className="primary-button" onClick={onNext}><B en="Continue learning" zh="继续学习"/><ArrowRight size={17}/></button></div>
 </article>
}
function Compare(){return <article className="reader"><p className="overline">TWO ROLES, ONE FOUNDATION</p><h1><B en="Two roles, one shared foundation." zh="两种方向，一套共同基础。"/></h1><p className="reader-summary"><B en="Network engineers make connectivity reliable. Systems engineers make compute, identity and services reliable. Responsibilities vary by company and team." zh="Network Engineer 让连接可靠；System Engineer 让计算、身份与服务可靠。具体职责会随公司与团队而变化。"/></p><div className="compare-grid"><section><Network/><h2><B en="Network Engineer" zh="网络工程师"/></h2><p><B en="Focus on how data reaches its destination." zh="关注数据如何抵达目标。"/></p><ul><li><B en="Switching, routing, wireless and WANs" zh="交换、路由、无线与广域网"/></li><li><B en="Network segmentation, perimeter security and VPNs" zh="网络分段、边界安全、VPN"/></li><li><B en="Troubleshooting packet loss, latency, routing and links" zh="丢包、延迟、路由与链路排障"/></li><li><B en="Network automation and architecture" zh="网络自动化与架构设计"/></li></ul></section><section><Server/><h2><B en="System Engineer" zh="系统工程师"/></h2><p><B en="Focus on how services keep running." zh="关注服务如何持续运行。"/></p><ul><li><B en="Windows / Linux and patch management" zh="Windows / Linux 与补丁管理"/></li><li><B en="AD, permissions, virtualization and storage" zh="AD、权限、虚拟化与存储"/></li><li><B en="Backup, monitoring, high availability and disaster recovery" zh="备份、监控、高可用与灾难恢复"/></li><li><B en="Scripting, configuration management and infrastructure as code" zh="脚本、配置管理与基础设施即代码"/></li></ul></section></div><div className="objective"><span><B en="Shared foundations" zh="共同基础"/></span><p><B en="TCP/IP, DNS, DHCP, security fundamentals, log analysis, scripting, change management and layered troubleshooting. Start with networking fundamentals before choosing a primary track." zh="TCP/IP、DNS、DHCP、基础安全、日志分析、脚本、变更管理与分层排障。建议先学完网络基础，再选择主要方向。"/></p></div><h2><B en="How do both roles investigate an inaccessible website?" zh="遇到“网站打不开”，如何协作？"/></h2><p className="body-copy"><B en="The network team checks routes, links, firewalls and port connectivity. The systems team checks DNS records, service listeners, certificates, application logs and resources. Both use a shared timeline and packet-capture evidence instead of drawing conclusions from ping alone." zh="网络侧检查路由、链路、防火墙与端口连通性；系统侧检查 DNS 记录、服务监听、证书、应用日志与资源。两边用同一时间线和抓包证据定位故障，避免只凭 ping 结果下结论。"/></p></article>}
function Resources(){const sources=Array.from(new Map(lessons.map(l=>[l.source.url,l.source])).values());return <article className="reader"><p className="overline">GO TO THE SOURCE</p><h1><B en="Learn from verifiable sources." zh="让知识有据可查。"/></h1><p className="reader-summary"><B en="These lessons were rewritten from the original conversation’s outline and are presented in English and Chinese. The original PDFs have not been imported. Use the official references below for further study and verification." zh="课程按原对话的学习目录重新编写，以中英全文对照呈现。原 PDF 附件未导入；下面是进一步学习与核对细节的官方资料。"/></p>{sources.map(s=><a className="resource-row" key={s.url} href={s.url} target="_blank" rel="noreferrer"><BookOpen size={20}/><div><b><B en={s.title} zh={sourceChinese[s.title]}/></b><small>{new URL(s.url).hostname}</small></div><ArrowUpRight size={18}/></a>)}<p className="body-copy"><B en="Examples are for isolated lab environments. Commands vary by vendor, model and version; check the applicable documentation before starting." zh="示例仅用于隔离实验环境。设备命令随厂商、型号和版本而变化，实验前应核对适用文档。"/></p></article>}
