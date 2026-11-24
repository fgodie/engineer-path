'use client';

export const dynamic = 'force-static';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Cable, Clock, HardDrive, Radio, Check, ChevronLeft, Circle, Clock3, FlaskConical, Images, Layers, Network, Route, Search, Server } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { lessons as originalLessons, stages, type Lesson } from './lessons';
import { english as originalEnglish } from './english';
import { addFoundations, foundationEnglish, resources } from './foundations';
import { fieldCases } from './field-cases';
import { NightBackdrop } from './night-backdrop';
import { DeviceInspector } from './device-inspector';
import { PathDiagram } from './path-diagram';
import { LessonFigure } from './lesson-figure';
import { FoundationVisual, hasFoundationVisual } from './foundation-visual';
import { lessonDiagrams } from './lesson-diagrams';
import { commandTranslations, stageEnglish, stageNames, sourceChinese } from './interface-translations';
import { PacketTracerGuide } from './packet-tracer-guide';
import { packetTracerLabForLesson, packetTracerLabs } from './packet-tracer-labs';

function B({ en, zh }: { en: string; zh: string }) {
  return <span className="bi"><span lang="en" className="bi-en">{en}</span><span lang="zh-CN" className="bi-zh">{zh}</span></span>;
}

function HardwareBackdrop({ track }: { track: 'network' | 'system' }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return <img className="hardware-backdrop" src={`${base}/hardware/${track}-cutaway.jpg`} alt="" fetchPriority="high" />;
}

function commandText(text: string) {
  return text.split('\n').map(line => commandTranslations[line] ? commandTranslations[line] + ' / ' + line.replace(/^[#!] /, '') : line).join('\n');
}

const lessons = addFoundations(originalLessons);
const english = { ...originalEnglish, ...foundationEnglish };
const workTopics = [
  { id: 'n17', Icon: Cable }, { id: 'n18', Icon: Radio },
  { id: 'n19', Icon: HardDrive }, { id: 's12', Icon: Clock },
];
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

const compactDestinations = {
  courses: ['Courses', '课程'],
  packet: ['Labs', '实验'],
  compare: ['Roles', '岗位'],
  resources: ['Library', '资料库'],
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
    lesson.lab.command, ...fieldCases[lesson.id].question, ...fieldCases[lesson.id].evidence, ...fieldCases[lesson.id].reasoning,
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
  const [track, setTrack] = useState<Track>('network');
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [reviewTrail, setReviewTrail] = useState<Lesson[]>([]);
  const [view, setView] = useState<View>('courses');
  const [packetLabId, setPacketLabId] = useState<string>();
  const [query, setQuery] = useState('');
  const [unfinished, setUnfinished] = useState(false);
  const [progress, setProgress] = useState<Progress>(emptyProgress);

  useEffect(() => {
    // Browser-only storage becomes available after the static page hydrates.
    // oxlint-disable-next-line react/react-compiler
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
    setReviewTrail([]);
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

  function openLesson(lesson: Lesson, trail: Lesson[] = []) {
    setReviewTrail(trail);
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

  return <div className="observatory">
    <header className="global-header">
      <button type="button" className="wordmark" onClick={() => navigate('courses')} aria-label="Engineer Path · 学习首页"><Network aria-hidden="true"/>Engineer Path</button>
      <nav aria-label="Site navigation / 网站导航" className="global-sections">
        {(Object.keys(views) as View[]).map(id => {
          const { Icon, en, zh } = views[id];
          return <button type="button" className="destination" key={id} aria-current={view === id ? 'page' : undefined} onClick={() => navigate(id)}>
            <Icon aria-hidden="true"/><span className="full-destination"><B en={en} zh={zh}/></span>
            <span className="compact-destination"><B en={compactDestinations[id][0]} zh={compactDestinations[id][1]}/></span>
          </button>;
        })}
      </nav>
    </header>
    <main className="main" data-surface={selected ? 'lesson' : view} data-theme-track={selected?.track ?? (view === 'packet' ? 'network' : track)}>
      {selected ? <LessonView view={view} key={selected.id} lesson={selected} parentLesson={reviewTrail.at(-1)}
          onBack={() => {
            const parent = reviewTrail.at(-1);
            if (parent) openLesson(parent, reviewTrail.slice(0, -1));
            else navigate(view);
          }} backToPacket={view === 'packet'} onPacketTracer={openPacketLab}
          onOpenLesson={lesson => openLesson(lesson, [...reviewTrail, selected])} completed={progress.completed.includes(selected.id)} onToggleCompleted={toggleCompleted}
          onNext={nextLesson ? () => openLesson(nextLesson) : undefined} />
          : <>

            <div className="workspace">
            {view === 'courses' ? <>
            <Tabs className="track-studio" value={track} onValueChange={value => chooseTrack(value as Track)}>
              <TabsList aria-label="Learning tracks / 学习方向" id="track-selector" className="track-tabs">
                {(Object.keys(tracks) as Track[]).map(id => {
                  const { Icon, en, zh } = tracks[id];
                  return <TabsTrigger value={id} key={id} data-direction={id}>
                    <Icon aria-hidden="true" /><B en={en} zh={zh} />
                    <Check className="direction-check" aria-hidden="true" />
                  </TabsTrigger>;
                })}
              </TabsList>
              <TabsContent value={track}>
                <header className="atlas-cover night-cover">
                  <NightBackdrop track={track} scene="orbit"/>
                  <div className="atlas-title">
                    <h1><span lang="en" className="bi-en orbital-title">{track === 'network' ? 'Network' : 'Systems'} <em>Engineering</em></span>
                      <span lang="zh-CN" className="bi-zh">{track === 'network' ? '网络工程学习台' : '系统工程学习台'}</span></h1>
                    <p>{track === 'network'
                      ? <B en="Follow a packet from an office laptop to its destination. Learn what to check at each hop." zh="跟随一个数据包从办公电脑走到目的地，逐站学习该检查什么。"/>
                      : <B en="Follow a service from its running process to a working response. Learn how to tell where it stopped." zh="从进程启动一路跟到服务响应，学会判断问题发生在哪一步。"/>}</p>
                    <div className="study-next launch-lesson">
                      <button className="primary-button" onClick={() => openLesson(resumeLesson ?? trackLessons[0])}>
                        <BookOpen aria-hidden="true" size={18}/>
                        <B en={resumeLesson ? (progress.lastOpened[track] ? 'Continue learning' : 'Start learning') : 'Review lessons'}
                          zh={resumeLesson ? (progress.lastOpened[track] ? '继续学习' : '开始学习') : '复习课程'}/>
                        <ArrowRight aria-hidden="true" size={16}/>
                      </button>
                      <span className="launch-topic"><B en={resumeLesson?.en ?? trackLessons[0].en} zh={resumeLesson?.title ?? trackLessons[0].title}/></span>
                    </div>
                    <div className="atlas-shortcuts">
                      <a className="atlas-inspect" href="#inspect-device"><span lang="en">Inspect hardware</span><span lang="zh-CN">设备透视</span><ArrowRight size={14} aria-hidden="true"/></a>
                      <a className="atlas-browse" href="#catalog-title"><span lang="en">Browse {trackLessons.length} lessons</span><span lang="zh-CN">浏览 {trackLessons.length} 节课</span><ArrowRight size={14} aria-hidden="true"/></a>
                      <a className="atlas-questions" href="#work-questions"><span lang="en">Work questions</span><span lang="zh-CN">按问题选课</span><ArrowRight size={14} aria-hidden="true"/></a>
                    </div>
                  </div>
                  <div className="study-progress">
                    <label htmlFor="track-progress"><B en="Track progress" zh="本方向进度" /></label>
                    <strong>{doneCount} / {trackLessons.length}</strong>
                    <progress id="track-progress" value={doneCount} max={trackLessons.length} />
                    <p><B en="Saved in this browser" zh="进度保存在当前浏览器" /></p>
                  </div>
                </header>
              </TabsContent>
            </Tabs>
            <section className="course-catalog" aria-labelledby="catalog-title">
              <div className="catalog-heading">
                <h2 id="catalog-title"><B en="Course catalog" zh="课程目录" /></h2>
                <output><B en={`${results.length} lessons${terms.length ? ' across both tracks' : ''}`} zh={`${results.length} 节课程${terms.length ? ' · 搜索两个方向' : ''}`} /></output>
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
              {!terms.length && visibleStages.length > 1 && <nav className="stage-jumps" aria-label="Jump to stage / 跳到学习阶段">
                {visibleStages.map(stage => {
                  const scope = trackLessons.filter(lesson => lesson.stage === stage.key);
                  const completed = scope.filter(lesson => progress.completed.includes(lesson.id)).length;
                  return <a key={stage.key} href={`#stage-${stage.key}`}>
                    <span className="route-icon" aria-hidden="true">{stage === visibleStages[0] ? <Route/> : stage === visibleStages.at(-1) ? <Layers/> : <Cable/>}</span>
                    <span className="stage-link-title"><B en={stageNames[stage.key]} zh={stage.name}/><ArrowRight size={15} aria-hidden="true"/></span>
                    <span className="stage-completion">{completed} / {scope.length} <span>done · 已完成</span></span>
                    <span className="stage-segments" aria-hidden="true">{scope.map(lesson => <i key={lesson.id} data-complete={progress.completed.includes(lesson.id)}/>)}</span>
                  </a>;
                })}
              </nav>}
              {results.length ? visibleStages.map(stage => <section key={stage.key} id={`stage-${stage.key}`} className="catalog-stage">
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
            <div key={track} className="practice-grid inspection-bay">
            <DeviceInspector track={track}/>
            <PathDiagram track={track}/>
            <section className="field-index" aria-labelledby="work-questions">
              <h2 id="work-questions"><B en="Troubleshoot by question" zh="从工作中的问题开始"/></h2>
              <div className="field-links">{workTopics.map(({id, Icon}) => {
                const lesson = trackLessons.find(item => item.id === id);
                if (!lesson) return null;
                const [en, zh] = fieldCases[id].question;
                return <button type="button" key={id} onClick={() => openLesson(lesson)}>
                  <Icon className="field-topic-icon" size={22} aria-hidden="true"/><B en={en} zh={zh}/><ArrowRight size={16} aria-hidden="true"/>
                </button>;
              })}</div>
            </section>
            </div>
            {track === 'network' && <div className="study-lab">
              <FlaskConical size={21} aria-hidden="true" />
              <div><strong><B en="Packet Tracer lab files" zh="Packet Tracer 实验文件" /></strong>
                <p><B en="Three guided labs with screenshots and downloadable .pkt files." zh="三套引导实验，包含截图和可下载的 .pkt 文件。" /></p></div>
              <button className="study-button" onClick={() => openPacketLab(packetTracerLabs[0].id)}><B en="Open guided labs" zh="打开引导实验" /></button>
            </div>}
          </> : view === 'packet' ? <PacketTracerGuide key={packetLabId ?? 'default'} initialLabId={packetLabId}
            onOpenLesson={id => { const lesson = lessons.find(item => item.id === id); if (lesson) openLesson(lesson); }} />
            : view === 'compare' ? <Compare /> : <Resources />}
            </div>
          </>}
      <footer className="page-footer"><span>ENGINEER PATH</span></footer>
    </main>
  </div>;
}
function Topbar({ view, children, headerRef }: {
  view: View;
  children?: React.ReactNode;
  headerRef?: React.Ref<HTMLElement>;
}) {
  return <header ref={headerRef} className={children ? 'topbar lesson-topbar' : 'topbar'}>
    <div className="topbar-location"><BookOpen size={18}/><b><B en={views[view].en} zh={views[view].zh}/></b></div>
    {children}
    <span className="language">EN + 中文</span>
  </header>;
}

function LessonView({ view, lesson: l, parentLesson, onOpenLesson, onBack, backToPacket, onNext, onPacketTracer, completed, onToggleCompleted }: {
  view: View;
  lesson: Lesson;
  parentLesson?: Lesson;
  onOpenLesson: (lesson: Lesson) => void;
  onBack: () => void;
  backToPacket: boolean;
  onNext?: () => void;
  onPacketTracer: (id: string) => void;
  completed: boolean;
  onToggleCompleted: () => void;
}) {
 const [answer,setAnswer]=useState<number|null>(null);
 const e=english[l.id];
 const example=fieldCases[l.id];
 const review=lessons.find(item => item.id === example.review);
 const packetLab=packetTracerLabForLesson(l.id === 'n13' ? 'n01' : l.id);
 const headerRef = useRef<HTMLElement>(null);
 const panelsRef = useRef<HTMLDivElement>(null);

 function revealSection() {
   requestAnimationFrame(() => {
     const header = headerRef.current;
     const panels = panelsRef.current;
     if (!header || !panels) return;
     const top = window.scrollY + panels.getBoundingClientRect().top - header.offsetHeight - 12;
     window.scrollTo({ top, behavior: 'instant' });
   });
 }

 return <Tabs className="lesson-layout" defaultValue="read" onValueChange={revealSection}>
  <Topbar view={view} headerRef={headerRef}>
    <TabsList className="lesson-nav" aria-label="Lesson sections / 课程栏目">
      <TabsTrigger value="read"><BookOpen aria-hidden="true"/><B en="Concepts" zh="知识讲解"/></TabsTrigger>
      <TabsTrigger value="lab"><FlaskConical aria-hidden="true"/><B en="Hands-on lab" zh="动手实验"/></TabsTrigger>
      <TabsTrigger value="quiz"><Check aria-hidden="true"/><B en="Knowledge check" zh="课后自测"/></TabsTrigger>
    </TabsList>
  </Topbar>
  <div className="workspace"><article className="reader">
  <button className="back" onClick={onBack}><ChevronLeft size={16}/><B en={parentLesson ? 'Return to '+parentLesson.en : backToPacket ? 'Back to Packet Tracer labs' : 'Back to learning path'} zh={parentLesson ? '返回原课 · '+parentLesson.title : backToPacket ? '返回 Packet Tracer 实验' : '返回学习路径'}/></button>
  <div className="reader-cover night-cover"><NightBackdrop track={l.track} scene="orbit"/><p className="reader-domain">{l.track === 'network' ? <Network size={17} aria-hidden="true"/> : <Server size={17} aria-hidden="true"/>}<span>{l.id.toUpperCase()}</span><B en={stageNames[l.stage]} zh={stages.find(stage => stage.key === l.stage)?.name ?? l.stage}/></p><h1><B en={l.en} zh={l.title}/></h1><p className="reader-summary"><B en={e.summary} zh={l.summary}/></p><div className="reader-meta"><span><Clock3 size={15}/>{l.minutes} MIN</span><span><FlaskConical size={15}/>HANDS-ON LAB / 动手实验</span>{(lessonDiagrams[l.id] || hasFoundationVisual(l.id)) && <span><Images size={15}/>VISUAL GUIDE / 图解</span>}</div></div>
  <div ref={panelsRef} className="lesson-panels">
   <TabsContent value="read" className="reading-spread">
    <nav className="chapter-index" aria-label="On this page / 本课目录">
      <strong><B en="In this lesson" zh="本课目录"/></strong>
      {l.sections.map((section,i)=><a key={section.heading} href={`#chapter-${i}`}><B en={e.sections[i].heading} zh={section.heading}/></a>)}
    </nav>
    <div className="chapter-text">
    <section className="field-case">
      <p className="case-label"><FlaskConical size={16} aria-hidden="true" /><B en="Worked example" zh="先看一个例子"/></p>
      <h2><B en={example.question[0]} zh={example.question[1]}/></h2>
      <p className="case-evidence"><B en={example.evidence[0]} zh={example.evidence[1]}/></p>
      <details><summary><B en="Walk through the answer" zh="展开看推理过程"/></summary>
        <p><B en={example.reasoning[0]} zh={example.reasoning[1]}/></p>
      </details>
      {review && <button type="button" className="case-review" onClick={() => onOpenLesson(review)}>
        <BookOpen size={16} aria-hidden="true"/><B en={'Review first · '+review.en} zh={'先修回顾 · '+review.title}/>
      </button>}
    </section>
    <div className="objective"><span><B en="By the end of this lesson, you can" zh="学完这一课，你能够"/></span><p><B en={e.objective} zh={l.objective}/></p></div>
    {l.sections.map((section,i)=><section className="lesson-section" id={`chapter-${i}`} key={section.heading}><h2><B en={e.sections[i].heading} zh={section.heading}/></h2><p><B en={e.sections[i].body} zh={section.body}/></p><LessonFigure lessonId={l.id} section={i}/><FoundationVisual lessonId={l.id} section={i}/></section>)}
    <div className="takeaway"><b><B en="Key takeaway" zh="记住这一点"/></b><p><B en={e.takeaway} zh={l.takeaway}/></p></div>
    <h2 className="reference-heading"><B en="Further reading" zh="继续阅读"/></h2>
    <a className="resource-link" href={l.source.url} target="_blank" rel="noreferrer"><B en={l.source.title} zh={referenceTitles[l.source.title]}/></a>
    </div>
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
    {answer!==null&&<div aria-live="polite" className={`feedback ${answer===l.quiz.correct?'correct':''}`}><b><B en={answer===l.quiz.correct?'Correct':'Try again'} zh={answer===l.quiz.correct?'回答正确':'再想一想'}/></b><p><B en={e.quiz.explanation} zh={l.quiz.explanation}/></p></div>}
   </section></TabsContent>
  </div>
  <div className="reader-end study-actions">
    <button type="button" className="study-button" aria-pressed={completed} onClick={onToggleCompleted}>
      <Check size={17} aria-hidden="true" />
      <B en={completed ? 'Completed · Undo' : 'Mark as complete'} zh={completed ? '已完成 · 撤销' : '标记为已完成'}/>
    </button>
    {onNext && <button className="primary-button" onClick={onNext}><B en="Next lesson" zh="下一课"/></button>}
  </div>
  </article></div>
 </Tabs>;
}
function Compare(){return <article className="reader role-comparison"><header className="section-cover role-cover"><NightBackdrop track="network" scene="orbit"/><h1><B en="Two roles, one shared foundation." zh="两种方向，一套共同基础。"/></h1><p className="reader-summary"><B en="Network engineers make connectivity reliable. Systems engineers make compute, identity and services reliable. Responsibilities vary by company and team." zh="Network Engineer 让连接可靠；System Engineer 让计算、身份与服务可靠。具体职责会随公司与团队而变化。"/></p></header><div className="compare-grid"><section><div className="role-hardware"><HardwareBackdrop track="network"/></div><Network/><h2><B en="Network Engineer" zh="网络工程师"/></h2><p><B en="Focus on how data reaches its destination." zh="关注数据如何抵达目标。"/></p><ul><li><B en="Switching, routing, wireless and WANs" zh="交换、路由、无线与广域网"/></li><li><B en="Network segmentation, perimeter security and VPNs" zh="网络分段、边界安全、VPN"/></li><li><B en="Troubleshooting packet loss, latency, routing and links" zh="丢包、延迟、路由与链路排障"/></li><li><B en="Network automation and architecture" zh="网络自动化与架构设计"/></li></ul></section><section><div className="role-hardware"><HardwareBackdrop track="system"/></div><Server/><h2><B en="System Engineer" zh="系统工程师"/></h2><p><B en="Focus on how services keep running." zh="关注服务如何持续运行。"/></p><ul><li><B en="Windows / Linux and patch management" zh="Windows / Linux 与补丁管理"/></li><li><B en="AD, permissions, virtualization and storage" zh="AD、权限、虚拟化与存储"/></li><li><B en="Backup, monitoring, high availability and disaster recovery" zh="备份、监控、高可用与灾难恢复"/></li><li><B en="Scripting, configuration management and infrastructure as code" zh="脚本、配置管理与基础设施即代码"/></li></ul></section></div><div className="objective"><span><B en="Shared foundations" zh="共同基础"/></span><p><B en="TCP/IP, DNS, DHCP, security fundamentals, log analysis, scripting, change management and layered troubleshooting. Start with networking fundamentals before choosing a primary track." zh="TCP/IP、DNS、DHCP、基础安全、日志分析、脚本、变更管理与分层排障。建议先学完网络基础，再选择主要方向。"/></p></div><h2><B en="How do both roles investigate an inaccessible website?" zh="遇到“网站打不开”，如何协作？"/></h2><p className="body-copy"><B en="The network team checks routes, links, firewalls and port connectivity. The systems team checks DNS records, service listeners, certificates, application logs and resources. Both use a shared timeline and packet-capture evidence instead of drawing conclusions from ping alone." zh="网络侧检查路由、链路、防火墙与端口连通性；系统侧检查 DNS 记录、服务监听、证书、应用日志与资源。两边用同一时间线和抓包证据定位故障，避免只凭 ping 结果下结论。"/></p></article>}
function Resources() {
  const [filter,setFilter] = useState('');
  const matches = (parts: string[]) => searchText(parts.join(' ')).includes(searchText(filter.trim()));
  const curated = Object.values(resources);
  const guides = curated.filter(r => matches([r.title.en, r.title.zh, r.description.en, r.description.zh, r.url]));
  const readings = Array.from(new Map(lessons.map(lesson => [lesson.source.url, lesson.source])).values())
    .filter(source => !curated.some(resource => resource.url === source.url))
    .filter(source => matches([source.title, referenceTitles[source.title], source.url]));
  return <article className="reader reference-library">
    <header className="section-cover library-cover"><NightBackdrop track="system" scene="orbit"/><h1><B en="Reference library" zh="学习资料库" /></h1></header>
    <label className="library-search"><Search size={18}/><span className="sr-only">Find a reference / 查找资料</span><input type="search" placeholder="Find a reference / 查找资料" value={filter} onChange={event=>setFilter(event.target.value)}/></label>
    {!guides.length && !readings.length && <p role="status"><B en="No references match this search." zh="没有找到匹配的资料。"/></p>}
    {guides.length > 0 && <h2><B en="Start with these guides" zh="推荐先读" /></h2>}
    <div className="reference-grid">
      {guides.map(resource => <a className="reference-card" key={resource.url} href={resource.url} target="_blank" rel="noreferrer">
        <div className="reference-source"><BookOpen size={16} aria-hidden="true" /><span>{new URL(resource.url).hostname}</span><ArrowUpRight size={16} aria-hidden="true" /></div>
        <h3><B {...resource.title} /></h3>
        <p><B {...resource.description} /></p>
      </a>)}
    </div>
    {readings.length > 0 && <h2><B en="Further reading by topic" zh="按主题继续阅读" /></h2>}
    {readings.map(source => <a className="resource-row" key={source.url} href={source.url} target="_blank" rel="noreferrer">
      <BookOpen size={20} aria-hidden="true" />
      <div><B en={source.title} zh={referenceTitles[source.title]} /><small>{new URL(source.url).hostname}</small></div>
    </a>)}
  </article>;
}
