import{aC as m,aK as p,aB as c,a as o,ao as d,an as e,aS as E}from"./index-ewVy9M9d.js";import{b3 as L,aH as l}from"./IdurarOs-eHlzvnv3.js";import"./ErpApp-7Wu0aHhn.js";import{E as i}from"./index-IjoPjNv1.js";import{U as T}from"./UpdateItem-ln8ptH6e.js";import{O as x}from"./OfferForm-p5MQzGFp.js";import{e as f}from"./actions-cTR2S2ig.js";import{s as y}from"./selectors-c3wjZmkY.js";import"./calculate-2yTKWIus.js";import"./statusTagColor-sG5xH6CK.js";import"./CloseCircleOutlined-QfALGiz_.js";import"./index-bmJgfT8D.js";function _({config:t}){const s=m(),{id:r}=p();c(),o.useLayoutEffect(()=>{s(f.read({entity:t.entity,id:r}))},[r]);const{result:a,isSuccess:n,isLoading:u=!0}=d(y);return o.useLayoutEffect(()=>{a&&s(f.currentAction({actionType:"update",data:a}))},[a]),u?e.jsx(i,{children:e.jsx(E,{})}):e.jsx(i,{children:n?e.jsx(T,{config:t,UpdateForm:x}):e.jsx(L,{entity:t.entity})})}function S(){const t=l(),s="offer",r={PANEL_TITLE:t("Offer Leads"),DATATABLE_TITLE:t("offer_list"),ADD_NEW_ENTITY:t("add_new_offer"),ENTITY_NAME:t("Offer Leads")},a={entity:s,...r};return e.jsx(_,{config:a})}export{S as default};
