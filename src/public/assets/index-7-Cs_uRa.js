import{an as t}from"./index-ewVy9M9d.js";import{A as s}from"./index-_ABOHdS1.js";import{D as l}from"./ErpApp-7Wu0aHhn.js";import{aH as n}from"./IdurarOs-eHlzvnv3.js";import"./index-Rolmm9vx.js";import"./index-_E_Oz9gG.js";import"./infocard-1l-rLQd8.js";import"./index-VpG7vA6I.js";import"./Skeleton-a_sn-oBg.js";import"./index-_ks-rlOi.js";const a={Member:{type:"avatar"},project:{type:"asyncbudget",label:"project number",entity:"project",required:!0,redirectLabel:"Add New Project",withRedirect:!0,urlToRedirect:"/project",displayLabels:["projectnumber","lastname"],searchFields:"projectnumber,lastname",dataIndex:["project","projectnumber"],hasFeedback:!0,feedback:"project"},task:{label:"task",type:"taskname",required:!0},totalTimeRange:{label:"working time",type:"timeformat"},percentage:{label:"percentage",type:"editable"},billabletime:{label:"billable time",type:"editable"},totalBillableTime:{label:"billable time",type:"timeformat"},totalSpent:{label:"total spent",type:"timeformat"},totalBudget:{label:"total budget",type:"timeformatwithhour"},totalBillableTime:{label:"total billable time",type:"timeformat"},averageActivity:{label:"activity",type:"percentage"},productivity:{label:"productivity",type:"percentage"},created:{label:"created on",type:"date",required:!0,disableForTable:!0}};function A(){const e=n(),r="weeklytime",i={displayLabels:["Weekly Time"],searchFields:["firstname","lastname","initials"]},o=["name"],m={PANEL_TITLE:e("Weekly Time"),DATATABLE_TITLE:e("weekly_list"),ENTITY_NAME:e("Weekly")},p={...{entity:r,...m},fields:a,searchConfig:i,deleteModalLabels:o};return t.jsx(s,{createForm:t.jsx(l,{fields:a}),updateForm:t.jsx(l,{fields:a}),config:p})}export{A as default};
