import{ah as e}from"./index-WozvSfaz.js";import{ax as x,aE as s,as as f,q as d,C as r}from"./IdurarOs-2Q7XqIs7.js";import{I as C,z as i,q as I}from"./ErpApp-AJk95zmD.js";function u({isUpdateForm:a=!1}){const n=x();return e.jsxs(e.Fragment,{children:[e.jsx(s.Item,{label:n("name"),name:"taxName",rules:[{required:!0}],children:e.jsx(f,{})}),e.jsx(s.Item,{label:n("Value"),name:"taxValue",rules:[{required:!0,message:"Please input tax value!",type:"number",min:0,max:100}],children:e.jsx(C,{min:0,max:100,suffix:"%",style:{width:"100%"}})}),e.jsx(s.Item,{label:n("enabled"),name:"enabled",style:{display:"inline-block",width:"calc(50%)",paddingRight:"5px"},valuePropName:"checked",initialValue:!0,children:e.jsx(i,{checkedChildren:e.jsx(d,{}),unCheckedChildren:e.jsx(r,{})})}),e.jsx(s.Item,{label:n("Default"),name:"isDefault",style:{display:"inline-block",width:"calc(50%)",paddingLeft:"5px"},valuePropName:"checked",children:e.jsx(i,{checkedChildren:e.jsx(d,{}),unCheckedChildren:e.jsx(r,{})})})]})}function T(){const a=x(),n="taxes",c={displayLabels:["name"],searchFields:"name",outputValue:"_id"},o=["name"],m=[{title:a("Name"),dataIndex:"taxName"},{title:a("Value"),dataIndex:"taxValue"},{title:a("Default"),dataIndex:"isDefault"},{title:a("enabled"),dataIndex:"enabled"}],h=[{title:a("Name"),dataIndex:"taxName"},{title:a("Value"),dataIndex:"taxValue",render:(l,t)=>e.jsx(e.Fragment,{children:t.taxValue+"%"})},{title:a("Default"),dataIndex:"isDefault",key:"isDefault",onCell:(l,t)=>({props:{style:{width:"60px"}}}),render:(l,t)=>e.jsx(i,{checked:t.isDefault,checkedChildren:e.jsx(d,{}),unCheckedChildren:e.jsx(r,{})})},{title:a("enabled"),dataIndex:"enabled",key:"enabled",onCell:(l,t)=>({props:{style:{width:"60px"}}}),render:(l,t)=>e.jsx(i,{checked:t.enabled,checkedChildren:e.jsx(d,{}),unCheckedChildren:e.jsx(r,{})})}],p={PANEL_TITLE:a("taxes"),DATATABLE_TITLE:a("taxes_list"),ADD_NEW_ENTITY:a("add_new_tax"),ENTITY_NAME:a("taxes")},j={...{entity:n,...p},readColumns:m,dataTableColumns:h,searchConfig:c,deleteModalLabels:o};return e.jsx(I,{createForm:e.jsx(u,{}),updateForm:e.jsx(u,{isUpdateForm:!0}),config:j})}export{T as default};
