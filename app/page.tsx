'use client';

export const dynamic = 'force-static';

import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Check, ChevronLeft, Circle, Clock3, FlaskConical, Images, Layers, Network, Route, Search, Server } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { lessons as originalLessons, stages, type Lesson } from './lessons';
import { english as originalEnglish } from './english';
import { addFoundations, foundationEnglish, resources } from './foundations';
import { LessonFigure } from './lesson-figure';
import { FoundationVisual, hasFoundationVisual } from './foundation-visual';
import { lessonDiagrams } from './lesson-diagrams';
import { commandTranslations, stageEnglish, stageNames, sourceChinese } from './interface-translations';
import { PacketTracerGuide } from './packet-tracer-guide';
import { packetTracerLabForLesson, packetTracerLabs } from './packet-tracer-labs';

function B({ en, zh }: { en: string; zh: string }) {
  return <span className="bi"><span lang="en" className="bi-en">{en}</span><span lang="zh-CN" className="bi-zh">{zh}</span></span>;
}

function commandText(text: string) {
  return text.split('\n').map(line => commandTranslations[line] ? commandTranslations[line] + ' / ' + line.replace(/^[#!] /, '') : line).join('\n');
}

const lessons = addFoundations(originalLessons);
const english = { ...originalEnglish, ...foundationEnglish };
const referenceTitles = {
  ...sourceChinese,
  ...Object.fromEntries(Object.values(resources).map(({ title }) => [title.en, title.zh])),
};

const views = {
  courses: { en: 'Learning path', zh: '学习路径', Icon: Route },
  packet: { en: 'Packet Tracer labs', zh: 'Packet Tracer 实验', Icon: FlaskConical },
  compare: { en: 'Role comparison', zh: '岗位对照', Icon: Layers },
  resources: { en: 'References', zh: '参考资料', Icon: BookOpen },
} as const;

const tracks = {
  network: { en: 'Network Engineer', zh: '网络工程师', Icon: Network },
  system: { en: 'System Engineer', zh: '系统工程师', Icon: Server },
} as const;

type View = keyof typeof views;
type Track = keyof typeof tracks;
type Progress = { completed: string[]; lastOpened: Partial<Record<Track, string>> };

const emptyProgress: Progress = { completed: [], lastOpened: {} };
const progressKey = 'engineer-path-progress-v1';

function searchText(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase('en');
}

const searchable = new Map(lessons.map(lesson => {
  const translation = english[lesson.id];
  const terms = [
    lesson.id, lesson.title, lesson.en, lesson.summary, translation.summary,
    lesson.lab.command,
    ...lesson.sections.flatMap(({ heading, body }) => [heading, body]),
    ...translation.sections.flatMap(({ heading, body }) => [heading, body]),
  ];
  return [lesson.id, searchText(terms.join(' '))];
}));

function readProgress(): Progress {
  try {
    const stored = localStorage.getItem(progressKey);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        completed: Array.isArray(data?.completed) ? lessons.filter(lesson => data.completed.includes(lesson.id)).map(lesson => lesson.id) : [],
        lastOpened: {
          network: lessons.find(lesson => lesson.track === 'network' && lesson.id === data?.lastOpened?.network)?.id,
          system: lessons.find(lesson => lesson.track === 'system' && lesson.id === data?.lastOpened?.system)?.id,
        },
      };
    }
  } catch {
    // A blocked or invalid storage entry should leave the site usable.
  }
  return emptyProgress;
}

export default function Home() {
  return <SidebarProvider style={{ '--sidebar-width': '246px' } as React.CSSProperties}>
    <LearningSpace />
  </SidebarProvider>;
}

function LearningSpace() {
  const { setOpenMobile } = useSidebar();
  const [track, setTrack] = useState<Track>('network');
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [view, setView] = useState<View>('courses');
  const [packetLabId, setPacketLabId] = useState<string>();
  const [query, setQuery] = useState('');
  const [unfinished, setUnfinished] = useState(false);
  const [progress, setProgress] = useState<Progress>(emptyProgress);

  useEffect(() => {
    setProgress(readProgress());
  }, []);

  function saveProgress(next: Progress) {
    setProgress(next);
    try {
      localStorage.setItem(progressKey, JSON.stringify(next));
    } catch {
      // Keep progress available for the current visit if storage is blocked.
    }
  }

  function navigate(nextView: View) {
    setView(nextView);
    setSelected(null);
    setOpenMobile(false);
    window.scrollTo({ top: 0 });
  }

  function chooseTrack(nextTrack: Track) {
    setTrack(nextTrack);
    setQuery('');
    navigate('courses');
  }

  function openPacketLab(id: string) {
    setPacketLabId(id);
    navigate('packet');
  }

  function openLesson(lesson: Lesson) {
    saveProgress({ ...progress, lastOpened: { ...progress.lastOpened, [lesson.track]: lesson.id } });
    if (view === 'courses') setTrack(lesson.track);
    setSelected(lesson);
    window.scrollTo({ top: 0 });
  }

  function toggleCompleted() {
    if (!selected) return;
    const completed = progress.completed.includes(selected.id)
      ? progress.completed.filter(id => id !== selected.id)
      : [...progress.completed, selected.id];
    saveProgress({ ...progress, completed });
  }

  const trackLessons = lessons.filter(lesson => lesson.track === track);
  const doneCount = trackLessons.filter(lesson => progress.completed.includes(lesson.id)).length;
  const resumeLesson = trackLessons.find(lesson => lesson.id === progress.lastOpened[track] && !progress.completed.includes(lesson.id))
    ?? trackLessons.find(lesson => !progress.completed.includes(lesson.id));
  const terms = searchText(query.trim()).split(/\s+/).filter(Boolean);
  const results = (terms.length ? lessons : trackLessons).filter(lesson =>
    (!unfinished || !progress.completed.includes(lesson.id)) &&
    terms.every(term => searchable.get(lesson.id)?.includes(term)),
  );
  const visibleStages = stages.filter(stage => results.some(lesson => lesson.stage === stage.key));
  const selectedTrack = selected && lessons.filter(lesson => lesson.track === selected.track);
  const nextLesson = selected && selectedTrack
    ? selectedTrack[selectedTrack.findIndex(lesson => lesson.id === selected.id) + 1]
    : undefined;

  return <>
    <Sidebar className="site-sidebar">
      <SidebarHeader className="brand">
        <div className="brand-mark"><Network size={23} /></div>
        <div>Engineer<span>PATH / 学习手册</span></div>
      </SidebarHeader>
      <SidebarContent className="side-content">
        <SidebarMenu>
          {(Object.keys(views) as View[]).map(id => {
            const { Icon, en, zh } = views[id];
            return <SidebarMenuItem key={id}>
              <SidebarMenuButton className="nav-item" isActive={view === id} onClick={() => navigate(id)}>
                <Icon aria-hidden="true" /><B en={en} zh={zh} />
              </SidebarMenuButton>
            </SidebarMenuItem>;
          })}
        </SidebarMenu>
        <div className="side-divider" />
        <p className="overline side-label"><B en="Learning tracks" zh="学习方向" /></p>
        {(Object.keys(tracks) as Track[]).map(id => {
          const { Icon, en, zh } = tracks[id];
          return <button type="button" key={id} className={`track-nav ${view === 'courses' && track === id ? 'chosen' : ''}`} onClick={() => chooseTrack(id)}>
            <Icon size={18} aria-hidden="true" /><B en={en} zh={zh} />
          </button>;
        })}
      </SidebarContent>
    </Sidebar>
    <main className="main">
      <header className="topbar">
        <div><SidebarTrigger aria-label="Toggle navigation / 展开或收起导航" /><b><B en={views[view].en} zh={views[view].zh} /></b></div>
        <span className="language">EN + 中文</span>
      </header>
      <div className="workspace">
        {selected ? <LessonView key={selected.id} lesson={selected} onBack={() => navigate(view)} backToPacket={view === 'packet'} onPacketTracer={openPacketLab}
          completed={progress.completed.includes(selected.id)} onToggleCompleted={toggleCompleted}
          onNext={nextLesson ? () => openLesson(nextLesson) : undefined} />
          : view === 'courses' ? <>
            <div className="page-heading">
              <div>
                <h1><B en="Network & systems engineering" zh="网络与系统工程学习手册" /></h1>
                <p className="intro"><B en={`${lessons.length} bilingual lessons with practical labs and quick checks`} zh={`${lessons.length} 节中英对照课程，配有动手实验和自测`} /></p>
              </div>
            </div>
            <Tabs value={track} onValueChange={value => chooseTrack(value as Track)}>
              <TabsList className="track-tabs">
                {(Object.keys(tracks) as Track[]).map(id => {
                  const { Icon, en, zh } = tracks[id];
                  return <TabsTrigger value={id} key={id}><Icon aria-hidden="true" /><B en={en} zh={zh} /></TabsTrigger>;
                })}
              </TabsList>
              <TabsContent value={track}>
                <section className="study-dashboard" aria-label="Your progress / 学习进度">
                  <div className="study-next">
                    <div className="study-icon"><BookOpen size={24} aria-hidden="true" /></div>
                    <div>
                      <p className="study-label"><B en={doneCount || progress.lastOpened[track] ? 'Continue learning' : 'Start here'} zh={doneCount || progress.lastOpened[track] ? '继续学习' : '从这里开始'} /></p>
                      <h2><B en={resumeLesson?.en ?? 'All lessons completed'} zh={resumeLesson?.title ?? '已完成全部课程'} /></h2>
                    </div>
                    <button className="primary-button" onClick={() => openLesson(resumeLesson ?? trackLessons[0])}>
                      {resumeLesson ? <B en="Open lesson" zh="打开课程" /> : <B en="Review from the start" zh="从头复习" />}
                    </button>
                  </div>
                  <div className="study-progress">
                    <label htmlFor="track-progress"><B en="Track progress" zh="本方向进度" /></label>
                    <strong>{doneCount} / {trackLessons.length}</strong>
                    <progress id="track-progress" value={doneCount} max={trackLessons.length} />
                    <p><B en="Saved in this browser" zh="进度保存在当前浏览器" /></p>
                  </div>
                </section>
              </TabsContent>
            </Tabs>
            {track === 'network' && <div className="study-lab">
              <FlaskConical size={21} aria-hidden="true" />
              <div><strong><B en="Packet Tracer lab files" zh="Packet Tracer 实验文件" /></strong>
                <p><B en="Three guided labs with screenshots and downloadable .pkt files." zh="三套引导实验，包含截图和可下载的 .pkt 文件。" /></p></div>
              <button className="study-button" onClick={() => openPacketLab(packetTracerLabs[0].id)}><B en="Open guided labs" zh="打开引导实验" /></button>
            </div>}
            <section className="course-catalog" aria-labelledby="catalog-title">
              <div className="catalog-heading">
                <h2 id="catalog-title"><B en="Course catalog" zh="课程目录" /></h2>
                <p role="status"><B en={`${results.length} lessons${terms.length ? ' across both tracks' : ''}`} zh={`${results.length} 节课程${terms.length ? ' · 搜索两个方向' : ''}`} /></p>
              </div>
              <div className="catalog-controls">
                <div>
                  <label className="sr-only" htmlFor="lesson-search">Search all lessons / 搜索所有课程</label>
                  <div className="catalog-search">
                    <Search size={18} aria-hidden="true" />
                    <input id="lesson-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search all lessons / 搜索所有课程" />
                  </div>
                </div>
                <label className="catalog-filter"><input type="checkbox" checked={unfinished} onChange={event => setUnfinished(event.target.checked)} /><B en="Unfinished only" zh="只看未完成" /></label>
              </div>
              {results.length ? visibleStages.map(stage => <section key={stage.key} className="catalog-stage">
                <div className="catalog-stage-heading">
                  <h3><B en={stageNames[stage.key]} zh={stage.name} /></h3>
                  <p><B en={stageEnglish[stage.key].description} zh={stage.description} /></p>
                </div>
                <div className="lesson-grid">
                  {results.filter(lesson => lesson.stage === stage.key).map(lesson => <button type="button" className="lesson-card catalog-card" key={lesson.id} onClick={() => openLesson(lesson)}>
                    <div className="catalog-card-meta">
                      <span className="lesson-number">{lesson.id.toUpperCase()}</span>
                      {(lessonDiagrams[lesson.id] || hasFoundationVisual(lesson.id)) && <Images size={16} aria-label="Visual example / 图解示例" />}
                    </div>
                    <h4><B en={lesson.en} zh={lesson.title} /></h4>
                    <footer>
                      <span><Clock3 size={14} aria-hidden="true" /> {lesson.minutes} min</span>
                      {progress.completed.includes(lesson.id) && <span className="completed-label"><Check size={15} aria-hidden="true" /> Done / 已完成</span>}
                    </footer>
                  </button>)}
                </div>
              </section>) : <div className="catalog-empty">
                <p><B en="No lessons match. Try a different term or clear the filters." zh="没有符合条件的课程。可以换个关键词或清除筛选。" /></p>
                <button className="study-button" onClick={() => { setQuery(''); setUnfinished(false); }}><B en="Clear filters" zh="清除筛选" /></button>
              </div>}
            </section>
          </> : view === 'packet' ? <PacketTracerGuide key={packetLabId ?? 'default'} initialLabId={packetLabId}
            onOpenLesson={id => { const lesson = lessons.find(item => item.id === id); if (lesson) openLesson(lesson); }} />
            : view === 'compare' ? <Compare /> : <Resources />}
      </div>
      <footer className="page-footer"><span>ENGINEER PATH</span></footer>
    </main>
  </>;
}
function LessonView({ lesson: l, onBack, backToPacket, onNext, onPacketTracer, completed, onToggleCompleted }: {
  lesson: Lesson;
  onBack: () => void;
  backToPacket: boolean;
  onNext?: () => void;
  onPacketTracer: (id: string) => void;
  completed: boolean;
  onToggleCompleted: () => void;
}) {
 const [answer,setAnswer]=useState<number|null>(null);
 const e=english[l.id];
 const packetLab=packetTracerLabForLesson(l.id === 'n13' ? 'n01' : l.id);
 return <article className="reader">
  <button className="back" onClick={onBack}><ChevronLeft size={16}/><B en={backToPacket ? 'Back to Packet Tracer labs' : 'Back to learning path'} zh={backToPacket ? '返回 Packet Tracer 实验' : '返回学习路径'}/></button>
  <div className="reader-cover"><div className="reader-orbit" aria-hidden="true"/><p className="overline">{l.id.toUpperCase()} / ENGLISH + 中文</p><h1><B en={l.en} zh={l.title}/></h1><p className="reader-summary"><B en={e.summary} zh={l.summary}/></p><div className="reader-meta"><span><Clock3 size={15}/>{l.minutes} MIN</span><span><FlaskConical size={15}/>HANDS-ON LAB / 动手实验</span>{(lessonDiagrams[l.id] || hasFoundationVisual(l.id)) && <span><Images size={15}/>VISUAL GUIDE / 图解</span>}</div></div>
  <Tabs defaultValue="read">
   <TabsList className="reader-tabs">
    <TabsTrigger value="read"><B en="Concepts" zh="知识讲解"/></TabsTrigger>
    <TabsTrigger value="lab"><B en="Hands-on lab" zh="动手实验"/></TabsTrigger>
    <TabsTrigger value="quiz"><B en="Knowledge check" zh="课后自测"/></TabsTrigger>
   </TabsList>
   <TabsContent value="read">
    <div className="objective"><span><B en="By the end of this lesson, you can" zh="学完这一课，你能够"/></span><p><B en={e.objective} zh={l.objective}/></p></div>
    {l.sections.map((section,i)=><section className="lesson-section" key={section.heading}><h2><B en={e.sections[i].heading} zh={section.heading}/></h2><p><B en={e.sections[i].body} zh={section.body}/></p><LessonFigure lessonId={l.id} section={i}/><FoundationVisual lessonId={l.id} section={i}/></section>)}
    <div className="takeaway"><b><B en="Key takeaway" zh="记住这一点"/></b><p><B en={e.takeaway} zh={l.takeaway}/></p></div>
    <h2 className="reference-heading"><B en="Further reading" zh="继续阅读"/></h2>
    <a className="resource-link" href={l.source.url} target="_blank" rel="noreferrer"><B en={l.source.title} zh={referenceTitles[l.source.title]}/></a>
   </TabsContent>
   <TabsContent value="lab"><section className="lesson-section">
    <h2><B en={e.lab.title} zh={l.lab.title}/></h2>
    <p className="lab-env"><B en={'Environment: '+e.lab.environment} zh={'实验环境：'+l.lab.environment}/></p>
    <ol className="lab-steps">{l.lab.steps.map((step,i)=><li key={step}><B en={e.lab.steps[i]} zh={step}/></li>)}</ol>
    <FoundationVisual lessonId={l.id} lab />
    <pre><code>{commandText(l.lab.command)}</code></pre>
    <div className="objective"><span><B en="Acceptance criteria" zh="验收标准"/></span><p><B en={e.lab.verify} zh={l.lab.verify}/></p></div>
    {packetLab&&<div className="pt-lesson-link"><div><strong><B en="Build this in Packet Tracer" zh="在 Packet Tracer 中完成本课"/></strong><p><B en="Use the guided topology, exact ports and addresses, verification steps, and troubleshooting tips." zh="按引导查看拓扑、端口、地址、验收步骤和排错提示。"/></p></div><button className="primary-button" onClick={()=>onPacketTracer(packetLab.id)}><B en="Open guided lab" zh="打开引导实验"/><ArrowRight size={17}/></button></div>}
   </section></TabsContent>
   <TabsContent value="quiz"><section className="quiz">
    <p className="overline"><B en="Check your understanding" zh="检查你的理解"/></p>
    <h2><B en={e.quiz.question} zh={l.quiz.question}/></h2>
    <div className="options">{l.quiz.options.map((option,i)=><button key={option} aria-pressed={answer===i} className={answer===i?'selected':''} onClick={()=>setAnswer(i)}>{answer===i?<Check size={18}/>:<Circle size={18}/>}<B en={e.quiz.options[i]} zh={option}/></button>)}</div>
    {answer!==null&&<div role="status" className={`feedback ${answer===l.quiz.correct?'correct':''}`}><b><B en={answer===l.quiz.correct?'Correct':'Try again'} zh={answer===l.quiz.correct?'回答正确':'再想一想'}/></b><p><B en={e.quiz.explanation} zh={l.quiz.explanation}/></p></div>}
   </section></TabsContent>
  </Tabs>
  <div className="reader-end study-actions">
    <button type="button" className="study-button" aria-pressed={completed} onClick={onToggleCompleted}>
      <Check size={17} aria-hidden="true" />
      <B en={completed ? 'Completed · Undo' : 'Mark as complete'} zh={completed ? '已完成 · 撤销' : '标记为已完成'}/>
    </button>
    {onNext && <button className="primary-button" onClick={onNext}><B en="Next lesson" zh="下一课"/></button>}
  </div>
 </article>
}
function Compare(){return <article className="reader"><p className="overline">TWO ROLES, ONE FOUNDATION</p><h1><B en="Two roles, one shared foundation." zh="两种方向，一套共同基础。"/></h1><p className="reader-summary"><B en="Network engineers make connectivity reliable. Systems engineers make compute, identity and services reliable. Responsibilities vary by company and team." zh="Network Engineer 让连接可靠；System Engineer 让计算、身份与服务可靠。具体职责会随公司与团队而变化。"/></p><div className="compare-grid"><section><Network/><h2><B en="Network Engineer" zh="网络工程师"/></h2><p><B en="Focus on how data reaches its destination." zh="关注数据如何抵达目标。"/></p><ul><li><B en="Switching, routing, wireless and WANs" zh="交换、路由、无线与广域网"/></li><li><B en="Network segmentation, perimeter security and VPNs" zh="网络分段、边界安全、VPN"/></li><li><B en="Troubleshooting packet loss, latency, routing and links" zh="丢包、延迟、路由与链路排障"/></li><li><B en="Network automation and architecture" zh="网络自动化与架构设计"/></li></ul></section><section><Server/><h2><B en="System Engineer" zh="系统工程师"/></h2><p><B en="Focus on how services keep running." zh="关注服务如何持续运行。"/></p><ul><li><B en="Windows / Linux and patch management" zh="Windows / Linux 与补丁管理"/></li><li><B en="AD, permissions, virtualization and storage" zh="AD、权限、虚拟化与存储"/></li><li><B en="Backup, monitoring, high availability and disaster recovery" zh="备份、监控、高可用与灾难恢复"/></li><li><B en="Scripting, configuration management and infrastructure as code" zh="脚本、配置管理与基础设施即代码"/></li></ul></section></div><div className="objective"><span><B en="Shared foundations" zh="共同基础"/></span><p><B en="TCP/IP, DNS, DHCP, security fundamentals, log analysis, scripting, change management and layered troubleshooting. Start with networking fundamentals before choosing a primary track." zh="TCP/IP、DNS、DHCP、基础安全、日志分析、脚本、变更管理与分层排障。建议先学完网络基础，再选择主要方向。"/></p></div><h2><B en="How do both roles investigate an inaccessible website?" zh="遇到“网站打不开”，如何协作？"/></h2><p className="body-copy"><B en="The network team checks routes, links, firewalls and port connectivity. The systems team checks DNS records, service listeners, certificates, application logs and resources. Both use a shared timeline and packet-capture evidence instead of drawing conclusions from ping alone." zh="网络侧检查路由、链路、防火墙与端口连通性；系统侧检查 DNS 记录、服务监听、证书、应用日志与资源。两边用同一时间线和抓包证据定位故障，避免只凭 ping 结果下结论。"/></p></article>}
function Resources() {
  const curated = Object.values(resources);
  const readings = Array.from(new Map(lessons.map(lesson => [lesson.source.url, lesson.source])).values())
    .filter(source => !curated.some(resource => resource.url === source.url));
  return <article className="reader reference-library">
    <h1><B en="Reference library" zh="学习资料库" /></h1>
    <h2><B en="Start with these guides" zh="推荐先读" /></h2>
    <div className="reference-grid">
      {curated.map(resource => <a className="reference-card" key={resource.url} href={resource.url} target="_blank" rel="noreferrer">
        <BookOpen size={20} aria-hidden="true" />
        <h3><B {...resource.title} /></h3>
        <p><B {...resource.description} /></p>
      </a>)}
    </div>
    <h2><B en="Further reading by topic" zh="按主题继续阅读" /></h2>
    {readings.map(source => <a className="resource-row" key={source.url} href={source.url} target="_blank" rel="noreferrer">
      <BookOpen size={20} aria-hidden="true" />
      <div><B en={source.title} zh={referenceTitles[source.title]} /><small>{new URL(source.url).hostname}</small></div>
    </a>)}
  </article>;
}
