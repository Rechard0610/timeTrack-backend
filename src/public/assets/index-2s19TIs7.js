import{ao as L,aC as v,a as m,an as e}from"./index-ewVy9M9d.js";import{aH as C,aP as I,T as A,aV as $}from"./IdurarOs-eHlzvnv3.js";import{s as E,y as M,p as N,T as _,S as P,w as F,x as W,f as R,q as O}from"./ErpApp-7Wu0aHhn.js";import{S as Y}from"./index-L8Tawj6w.js";import"./transform-hO0TreJf.js";function q({config:o,selectedDays:x,conditions:u,extra:T=[]}){let{entity:r,dataTableColumns:c,fields:f,searchConfig:w}=o;const y=C(),{result:D,isLoading:S}=L(E),{pagination:b,items:j}=D,p=v(),a=t=>["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][t&&t.getDay()],i=t=>{if(t){const s=t.getDate();return String(s).padStart(2,"0")}},h=t=>{let s=Math.floor(t),n=Math.floor(s/3600),g=Math.floor(s%3600/60),k=s%60;return`${n.toString().padStart(2,"0")}:${g.toString().padStart(2,"0")}:${k.toString().padStart(2,"0")}`};m.useEffect(()=>{p(I.resetState())},[]),m.useEffect(()=>{const t=u;u.startDay!=""&&u.endDay!=""&&p(I.list({entity:r,options:t}))},[u]);const l=(t,s)=>{const n=t.days&&t.days[i(s)];return n?e.jsx(N,{className:"p-3",color:"blue",children:h(n)},s):e.jsx(N,{className:"p-3",children:h(0)},s)};c=[{title:y("member"),dataIndex:"avatar",width:40,fixed:"left",render:(t,s)=>{const n=s.userId&&`${s.userId.firstname} ${s.userId.lastname}`;if(s.userId)return e.jsx(A,{title:n,placement:"top",children:e.jsx(M,{style:{backgroundColor:"#1677ff"},src:`https://api.dicebear.com/7.x/miniavs/svg?seed=${3*2}`})},s.userId._id)}},...x.map((t,s)=>({title:e.jsxs("div",{className:"justify-center items-center text-center grid",children:[e.jsx("div",{className:"items-center mr-2 mb-1 text-[blue]",children:a(t)}),e.jsx("div",{className:"flex h-[40px] w-[40px] border-2 justify-center items-center rounded-md text-center mr-2",children:i(t)})]}),className:"text-center",key:s.toString(),render:(n,g)=>l(g,t)})),{title:y("total hours"),dataIndex:"hour",fixed:"right",width:200,render:(t,s)=>(console.log(s),e.jsx(N,{bordered:!1,color:t,children:h(s.totalSpentTime)},s.userId&&s.userId._id))}];const d=m.useCallback(t=>{const s={page:t.current||1,items:t.pageSize||10};p(I.list({entity:r,options:s}))},[]);return console.log(j),e.jsx(_,{columns:c,rowKey:t=>t._id,dataSource:j,pagination:b,loading:S,onChange:d,scroll:{x:!0}})}const V=({config:o,createForm:x,updateForm:u,withUpload:T=!1})=>{const[r,c]=m.useState({userId:"",projectId:"",taskId:"",startDay:"",endDay:""});m.useEffect(()=>{const a=new Date,i=new Date(a);i.setDate(a.getDate()-a.getDay()+(a.getDay()===0?-6:1)),new Date(a).setDate(i.getDate()+7);const l=[];for(let n=0;n<7;n++){const g=new Date(i);g.setDate(i.getDate()+n),l.push(g)}const d=n=>n<10?`0${n}`:n,t=`${l[0].getFullYear()}-${d(l[0].getMonth()+1)}-${d(l[0].getDate())}`,s=`${l[6].getFullYear()}-${d(l[6].getMonth()+1)}-${d(l[6].getDate())}`;D(l),c({...r,startDay:t,endDay:s})},[]);const[f,w]=m.useState(""),[y,D]=m.useState([]),S=a=>{w(a),c({...r,projectId:a})},b=a=>{a!=null&&(console.log(a),r.taskId=a,c({...r,taskId:a}))},j=(a,i)=>{if(a){if(a.length===2){const h=a[0],l=a[1],d=[];let t=new Date(h);for(;t<=l;)d.push(new Date(t)),t.setDate(t.getDate()+1);D(d)}c({...r,startDay:i[0],endDay:i[1]})}else console.log("Clear")},p=a=>{c({...r,userId:a})};return e.jsxs(e.Fragment,{children:[e.jsx("div",{children:e.jsxs("div",{className:"grid gap-x-5 justify-start ",style:{gridTemplateColumns:"auto auto auto auto minmax(auto, 140px)"},children:[e.jsxs("div",{className:"grid gap-y-1.5",children:[e.jsx("p",{children:"Project"}),e.jsx(P,{className:"min-w-48	outline-blue-500 min-h-10",entity:"project",showAll:"true",displayLabels:["projectnumber"],onChange:S})]}),e.jsxs("div",{className:"grid gap-y-1.5",children:[e.jsx("p",{children:"Task"}),e.jsx(Y,{className:"min-w-48	outline-blue-500 min-h-10",entity:"task",showAll:"true",displayLabels:["name","lastname"],parentId:f,onChange:b})]}),e.jsxs("div",{className:"grid gap-y-1.5",children:[e.jsx("p",{children:"Assigne"}),e.jsx("div",{className:"w-[40px]",children:e.jsx("div",{className:"relative assign-btn",children:e.jsx(F,{onChange:p,showAll:"true"})})})]}),e.jsxs("div",{className:"grid gap-y-1.5",children:[e.jsx("p",{children:"Date Range"}),e.jsx(W,{onRangeChange:j})]})]})}),e.jsx($,{span:24,children:e.jsx("div",{className:"line"})}),e.jsxs(R,{config:o,children:[e.jsx(q,{config:o,selectedDays:y,conditions:r}),e.jsx(O,{config:o})]})]})},z=V,B={Member:{type:"string",required:!0},totalhours:{label:"total hours",type:"string"}};function Q(){const o=C(),x="timeSheet",u={displayLabels:["avatar"],searchFields:"name",outputValue:"_id"},T=["name"],r={PANEL_TITLE:o("timesheets"),DATATABLE_TITLE:o("timesheets_list"),ADD_NEW_ENTITY:o("add_new_timesheet"),ENTITY_NAME:o("timesheets")},f={...{entity:x,...r},fields:B,searchConfig:u,deleteModalLabels:T};return e.jsx(z,{config:f})}export{Q as default};
