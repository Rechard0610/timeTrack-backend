import{an as a}from"./index-ewVy9M9d.js";import{a as u,D as l}from"./ErpApp-7Wu0aHhn.js";import{aH as p}from"./IdurarOs-eHlzvnv3.js";const t={email:{label:"invite e-mail",type:"email",required:!0},role:{label:"user group",type:"select",required:!0,defaultValue:"user",options:[{value:"admin",label:"Admin"},{value:"projectmanager",label:"Project Manager"},{value:"user",label:"User"},{value:"guest",label:"Guest"}]},created:{label:"created on",type:"date",required:!0,disableForForm:!0},status:{type:"boolean",disableForForm:!0}};function g(){const e=p(),r="people",o={displayLabels:["name"],searchFields:"email"},s=["name"],n={PANEL_TITLE:e("invitepeople"),DATATABLE_TITLE:e("invite_people_list"),ADD_NEW_ENTITY:e("add_new_person"),ENTITY_NAME:e("invitepeople")},i={...{entity:r,...n},fields:t,searchConfig:o,deleteModalLabels:s};return a.jsx(u,{createForm:a.jsx(l,{fields:t}),updateForm:a.jsx(l,{fields:t}),config:i})}export{g as default};
