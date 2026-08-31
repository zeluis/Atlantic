window.SVRouteMap=(()=>{
 const NS='http://www.w3.org/2000/svg';
 function project(lon,lat,w,h){return [(lon+180)/360*w,(90-lat)/180*h]}
 function draw(el,routes,geo){
  el.innerHTML=''; const w=el.clientWidth||900,h=el.clientHeight||420;
  const svg=document.createElementNS(NS,'svg'); svg.setAttribute('viewBox',`0 0 ${w} ${h}`); svg.setAttribute('role','img'); svg.setAttribute('aria-label','Atlantic voyage route map');
  const bg=document.createElementNS(NS,'rect'); bg.setAttribute('width',w); bg.setAttribute('height',h); bg.setAttribute('fill','#e8e3d8'); svg.appendChild(bg);
  const land=document.createElementNS(NS,'path'); land.setAttribute('d',`M ${.05*w} ${.42*h} C ${.10*w} ${.18*h},${.28*w} ${.18*h},${.38*w} ${.43*h} C ${.32*w} ${.61*h},${.20*w} ${.78*h},${.11*w} ${.68*h} Z M ${.43*w} ${.48*h} C ${.51*w} ${.34*h},${.64*w} ${.34*h},${.71*w} ${.49*h} C ${.65*w} ${.63*h},${.53*w} ${.67*h},${.45*w} ${.59*h} Z M ${.75*w} ${.20*h} C ${.89*w} ${.13*h},${.97*w} ${.28*h},${.91*w} ${.42*h} C ${.84*w} ${.48*h},${.76*w} ${.43*h},${.73*w} ${.34*h} Z`); land.setAttribute('fill','#d1ccbf'); land.setAttribute('stroke','#a79f91'); svg.appendChild(land);
  const ports=new Map((geo.ports||[]).map(p=>[p.id,p]));
  for(const r of routes){const a=ports.get(r.origin_id),b=ports.get(r.destination_id);if(!a||!b)continue;const [x1,y1]=project(a.lon,a.lat,w,h),[x2,y2]=project(b.lon,b.lat,w,h),curve=Math.max(25,Math.abs(x2-x1)*.18);const path=document.createElementNS(NS,'path');path.setAttribute('d',`M${x1},${y1} Q${(x1+x2)/2},${Math.min(y1,y2)-curve} ${x2},${y2}`);path.setAttribute('fill','none');path.setAttribute('stroke','#725b46');path.setAttribute('stroke-width',Math.max(1.5,Math.sqrt(r.embarked||1)/7));path.setAttribute('opacity','.72');const title=document.createElementNS(NS,'title');title.textContent=`${r.origin} → ${r.destination}: ${(r.embarked||0).toLocaleString()} embarked; ${r.voyages||0} voyages`;path.appendChild(title);svg.appendChild(path);for(const [x,y] of [[x1,y1],[x2,y2]]){const c=document.createElementNS(NS,'circle');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r','4');c.setAttribute('fill','#202a24');svg.appendChild(c)}}el.appendChild(svg)
 }
 return {draw}
})();
