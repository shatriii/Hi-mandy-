import {useState,useEffect,useRef,useMemo} from 'react';
import {LETTER} from './letter';
import {HERO,GALLERY} from './photos';

function Floaters({n=22}){
  const items=useMemo(()=>Array.from({length:n},(_,i)=>({l:Math.random()*100,d:9+Math.random()*10,de:-Math.random()*16,s:9+Math.random()*13,c:['🌸','✨','♡','✦'][i%4]})),[n]);
  return <div className="floaters" aria-hidden="true">{items.map((p,i)=><span key={i} style={{left:p.l+'%',animationDuration:p.d+'s',animationDelay:p.de+'s',fontSize:p.s}}>{p.c}</span>)}</div>;
}
function Reveal({children,className=''}){
  const r=useRef();
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){e.target.classList.add('in');o.disconnect();}},{threshold:.15});o.observe(r.current);return()=>o.disconnect();},[]);
  return <div ref={r} className={'reveal '+className}>{children}</div>;
}
function Cursor(){
  const r=useRef();
  useEffect(()=>{if(!matchMedia('(pointer:fine)').matches)return;const m=e=>{r.current.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;r.current.style.opacity=1;};addEventListener('mousemove',m);return()=>removeEventListener('mousemove',m);},[]);
  return <div ref={r} className="cursor" aria-hidden="true"/>;
}
function Music(){
  const a=useRef();const [on,setOn]=useState(false);const [bad,setBad]=useState(false);
  const toggle=()=>{if(on){a.current.pause();setOn(false);}else a.current.play().then(()=>setOn(true)).catch(()=>setBad(true));};
  return <>
    <audio ref={a} src="/music.mp3" loop preload="none" onError={()=>setBad(true)}/>
    <button className="fab music" onClick={toggle} aria-pressed={on} disabled={bad} title={bad?'Add public/music.mp3 to enable music':'Background music'}>{bad?'♪ unavailable':on?'♪ Music on':'♪ Music off'}</button>
  </>;
}
function Welcome({onOpen}){
  return <section className="welcome" aria-label="Welcome"><Floaters/>
    <div className="welcome-inner"><h1 className="script">A Little Surprise for you</h1>
    <p>Made with love, especially for your special day.</p>
    <button className="btn" onClick={onOpen}>Open Your Surprise</button></div></section>;
}
function Hero(){
  return <header className="hero" id="top"><Floaters n={26}/>
    <div className="frame"><span className="glow" aria-hidden="true"/><img src={HERO.src} alt={HERO.alt} fetchPriority="high"/></div>
    <div className="hero-text"><h1 className="script">Happy 18th Birthday, Mandyy! ♡</h1>
    <p>A new chapter, a thousand dreams, and a lifetime of beautiful possibilities.</p></div></header>;
}
function Letter(){
  const [open,setOpen]=useState(false);
  return <section className="letter-sec" id="letter"><Reveal>
    <h2 className="script">A letter just for you.</h2>
    <div className={'envelope'+(open?' open':'')} aria-hidden={open}><div className="flap"/><div className="env-front"><span>♡</span></div></div>
    {!open&&<button className="btn" onClick={()=>setOpen(true)}>Read Your Letter</button>}
    <article className={'paper'+(open?' show':'')} aria-hidden={!open} aria-label="Birthday letter"><p>{LETTER}</p></article>
  </Reveal></section>;
}
function Gallery(){
  return <section className="gallery" id="gallery"><Reveal>
    <div className="grid">{GALLERY.map((g,i)=><figure key={i} className={g.wide?'wide':''}><img src={g.src} alt={g.alt} loading="lazy"/></figure>)}</div>
    <p className="caption script">Today, we celebrate your birthday. ♡</p></Reveal></section>;
}
function Wishes(){
  return <section className="wishes"><Reveal><div className="bloom" aria-hidden="true">❀ ✿ ❀</div>
    <p className="serif-big">May this new chapter bring you genuine happiness, beautiful memories, unexpected blessings, and countless reasons to smile. Never stop dreaming, growing, and becoming the person you wish to be. You deserve all the beautiful things life has to offer. ♡</p></Reveal></section>;
}
function Final(){
  return <footer className="final"><Floaters n={14}/><Reveal>
    <h2 className="script">Here's to 18 and everything beautiful waiting for you. ♡</h2>
    <button className="btn" onClick={()=>document.getElementById('top').scrollIntoView({behavior:'smooth'})}>Back to the Beginning</button></Reveal>
    <div className="fadeout" aria-hidden="true"/></footer>;
}
export default function App(){
  const [stage,setStage]=useState('loading');
  useEffect(()=>{const t=setTimeout(()=>setStage('welcome'),1600);return()=>clearTimeout(t);},[]);
  const open=()=>{setStage('main');scrollTo(0,0);};
  const replay=()=>{setStage('welcome');scrollTo(0,0);};
  return <>
    <Cursor/><Music/>
    {stage==='loading'&&<div className="loading" role="status"><span className="script">♡</span><span className="sr">Loading</span></div>}
    {stage==='welcome'&&<Welcome onOpen={open}/>}
    {stage==='main'&&<main className="fade-in"><Hero/><Letter/><Gallery/><Wishes/><Final/>
      <button className="fab replay" onClick={replay}>↺ Replay opening</button></main>}
  </>;
}
