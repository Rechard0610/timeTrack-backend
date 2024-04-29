import{an as e,a as o,ao as y,aC as _,aS as A}from"./index-ewVy9M9d.js";import{s as E,M as L,y as $}from"./ErpApp-7Wu0aHhn.js";import{aM as M,B as f,aP as I}from"./IdurarOs-eHlzvnv3.js";import{E as R}from"./index-IjoPjNv1.js";function i({name:x,range:n,type:m,onClick:p}){return e.jsxs("div",{className:"grid rounded-lg items-center p-1 border-2 gap-x-3 mt-2 cursor-pointer",style:{gridTemplateColumns:"20px 1fr"},onClick:p,children:[e.jsx("div",{className:"text-[12px] flex items-center justify-center w-[20px] h-[20px] rounded-full text-white",style:m===null?{background:"grey"}:{background:m==="Productivity"?"green":"red"},children:x.at(0)}),e.jsxs("div",{className:"justify-between grid",style:{gridTemplateColumns:"auto auto"},children:[e.jsx("span",{className:"text-[11px]",children:x}),e.jsx("span",{className:"text-[11px]",children:n})]}),e.jsx("div",{})]})}function G({config:x,conditions:n,isEdit:m=!0}){console.log(n);const{entity:p}=x,[C,g]=o.useState(!1),[b,D]=o.useState(!1),[w,U]=o.useState(""),u=y(M),{result:v,isLoading:P}=y(E),[a,T]=o.useState([]),N=_();o.useEffect(()=>{b&&T(v.items)},[v]);const j=()=>{let r;console.log(u),u.role==="owner"?r={page:1,items:1e3,id:u._id,inviteId:u._id,project:n.project,user:n.user,startDay:n.startDay,endDay:n.endDay}:r={page:1,items:1e3,id:u._id,project:n.project,user:n.user,startDay:n.startDay,endDay:n.endDay},console.log(r),N(I.list({entity:p,options:r})),D(!0)};o.useEffect(()=>{console.log("-------------------------"),j();const r=setInterval(j,3e5);return()=>clearInterval(r)},[p,n]);const d=r=>{const t=Math.floor(r/3600),s=Math.floor(r%3600/60),l=r%60;return t>0?`${t}h ${s}m`:s>0?`${s}m ${l}s`:`${l}s`},c=r=>{m&&(g(!0),U(r))},h=r=>{const t={name:w,type:r};N(I.update({entity:p,jsonData:t})),j(),g(!1)},S=()=>{g(!1)};return e.jsxs("div",{children:[e.jsxs(L,{open:C,title:"Manage App & URL",onCancel:S,className:"justify-between grid",footer:[],children:[e.jsx(f,{onClick:()=>h("Productivity"),className:"mr-5 my-3 text-[green]",children:"Productive"},"productivity"),e.jsx(f,{onClick:()=>h("Unproductivity"),className:"mx-5 my-3 text-[red]",children:"Unproductive"},"unproductivity"),e.jsx(f,{onClick:()=>h(null),className:"ml-5 my-3 text-[grey]",children:"Neutral"},"neutral")]}),Object.keys(a).map(r=>(console.log("========================================="),e.jsxs("div",{className:"mt-2",children:[r==0&&e.jsx("p",{className:"text-[15px] text-slate-500",children:a[r].date}),r!==0&&a[r-1]&&a[r-1].date!=a[r].date&&e.jsx("p",{className:"text-[15px] text-slate-500",children:a[r].date}),e.jsx("div",{className:"border-l-2 border-l-green-400",children:e.jsxs("div",{className:"p-4 m-4 rounded-md border-2 mt-4",children:[e.jsxs("div",{className:"grid justify-between gap-4",style:{gridTemplateColumns:"auto auto"},children:[e.jsxs("div",{className:"user-select-item",children:[e.jsx("div",{children:e.jsx($,{src:"https://api.dicebear.com/7.x/miniavs/svg?seed=1",style:{verticalAlign:"middle"},size:"middle"})}),e.jsx("span",{className:"sc-JrDLc bmdBHG",children:`${a[r].userDetails&&a[r].userDetails.firstname} ${a[r].userDetails&&a[r].userDetails.lastname}`})]}),e.jsx("div",{className:"grid",style:{gridTemplateColumns:"auto auto auto"},children:e.jsxs("div",{className:"grid gap-2 align-center rounded-md px-3 py-5",children:[e.jsx("p",{className:"text-center",children:d(a[r].sumValue)}),e.jsx("p",{children:"Total Time"})]})})]}),e.jsxs("div",{className:"grid justify-between",style:{gridTemplateColumns:"47% 47%"},children:[e.jsxs("div",{className:"",children:[e.jsx("p",{className:"font-bold",children:"Apps"}),e.jsxs("div",{className:"grid gap-3 pt-3",style:{gridTemplateColumns:"32% 32% 32%"},children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flow-root",children:[e.jsx("p",{className:"text-[green] float-left",children:"Productive"}),e.jsx("p",{className:"text-[green] float-right mr-2",children:a[r].docs&&a[r].docs.map(t=>{if(t.typeId==="Productivity"){let s=0;return t.docs.map(l=>l.app!==""&&(s+=l.range)),d(s)}})})]}),a[r].docs&&a[r].docs.map(t=>t.typeId==="Productivity"&&t.docs.map(s=>s.app!==""?e.jsx(i,{name:s.app,range:d(s.range),type:s.typeId,onClick:()=>c(s.app)},s._id):null))]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flow-root",children:[e.jsx("p",{className:"text-[red] float-left",children:"Unproductive"}),e.jsx("p",{className:"text-[red] float-right mr-2",children:a[r].docs&&a[r].docs.map(t=>{if(t.typeId==="Unproductivity"){let s=0;return t.docs.map(l=>l.app!==""&&(s+=l.range)),d(s)}})})]}),a[r].docs&&a[r].docs.map(t=>t.typeId==="Unproductivity"&&t.docs.map(s=>s.app!==""?e.jsx(i,{name:s.app,range:d(s.range),type:s.typeId,onClick:()=>c(s.app)},s._id):null))]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flow-root",children:[e.jsx("p",{className:"text-[grey] float-left",children:"Neutral"}),e.jsx("p",{className:"text-[grey] float-right mr-2",children:a[r].docs&&a[r].docs.map(t=>{if(t.typeId===null){let s=0;return t.docs.map(l=>l.app!==""&&(s+=l.range)),d(s)}})})]}),a[r].docs&&a[r].docs.map(t=>t.typeId===null&&t.docs.map(s=>s.app!==""?e.jsx(i,{name:s.app,range:d(s.range),type:s.typeId,onClick:()=>c(s.app)},s._id):null))]})]})]}),e.jsxs("div",{className:"",children:[e.jsx("p",{children:"URLs"}),e.jsxs("div",{className:"grid gap-3 pt-3",style:{gridTemplateColumns:"32% 32% 32%"},children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flow-root",children:[e.jsx("p",{className:"text-[green] float-left",children:"Productive"}),e.jsx("p",{className:"text-[green] float-right mr-2",children:a[r].docs&&a[r].docs.map(t=>{if(t.typeId==="Productivity"){let s=0;return t.docs.map(l=>l.url!==""&&(s+=l.range)),d(s)}})})]}),a[r].docs&&a[r].docs.map(t=>t.typeId==="Productivity"&&t.docs.map(s=>s.url!==""?e.jsx(i,{name:s.url,range:d(s.range),type:s.typeId,onClick:()=>c(s.url)},s._id):null))]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flow-root",children:[e.jsx("p",{className:"text-[red] float-left",children:"Unproductive"}),e.jsx("p",{className:"text-[red] float-right mr-2",children:a[r].docs&&a[r].docs.map(t=>{if(t.typeId==="Unproductivity"){let s=0;return t.docs.map(l=>l.url!==""&&(s+=l.range)),d(s)}})})]}),a[r].docs&&a[r].docs.map(t=>t.typeId==="Unproductivity"&&t.docs.map(s=>s.url!==""?e.jsx(i,{name:s.url,range:d(s.range),type:s.typeId,onClick:()=>c(s.url)},s._id):null))]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flow-root",children:[e.jsx("p",{className:"text-[grey] float-left",children:"Neutral"}),e.jsx("p",{className:"text-[grey] float-right mr-2",children:a[r].docs&&a[r].docs.map(t=>{if(t.typeId===null){let s=0;return t.docs.map(l=>l.url!==""&&(s+=l.range)),d(s)}})})]}),a[r].docs&&a[r].docs.map(t=>t.typeId===null&&t.docs.map(s=>s.url!==""?e.jsx(i,{name:s.url,range:d(s.range),type:s.typeId,onClick:()=>c(s.url)},s._id):null))]})]})]})]})]})})]},r))),P&&e.jsx(R,{children:e.jsx(A,{})})]})}export{G as U};
