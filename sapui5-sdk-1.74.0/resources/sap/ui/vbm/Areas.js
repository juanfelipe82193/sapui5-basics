/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.define(['./VoAggregation','./library'],function(V,l){"use strict";var A=V.extend("sap.ui.vbm.Areas",{metadata:{library:"sap.ui.vbm",properties:{posChangeable:{type:"boolean",group:"Misc",defaultValue:true}},defaultAggregation:"items",aggregations:{items:{type:"sap.ui.vbm.Area",multiple:true,singularName:"item"}},events:{edgeClick:{parameters:{instance:{type:"sap.ui.vbm.Area"},edge:{type:"int"}}},edgeContextMenu:{parameters:{instance:{type:"sap.ui.vbm.Area"},edge:{type:"int"}}}}}});A.prototype.getBindInfo=function(){var b=V.prototype.getBindInfo.apply(this,arguments);var t=this.getTemplateBindingInfo();b.C=(t)?t.hasOwnProperty("color"):true;b.CB=(t)?t.hasOwnProperty("colorBorder"):true;b.BD=(t)?t.hasOwnProperty("borderDash"):true;return b;};A.prototype.getTemplateObject=function(){var t=V.prototype.getTemplateObject.apply(this,arguments);var b=this.mBindInfo=this.getBindInfo();var v=(b.hasTemplate)?this.getBindingInfo("items").template:null;t["type"]="{00100000-2012-0004-B001-F311DE491C77}";if(b.C){t["color.bind"]=t.id+".C";}else{t.color=v.getColor();}if(b.CB){t["colorBorder.bind"]=t.id+".CB";}else{t.colorBorder=v.getColorBorder();}if(b.BD){t["borderDash.bind"]=t.id+".BD";}else{t.borderDash=v.getBorderDash();}var a=this.getItems();if(a.length){if(a[0].getPosition().substring(0,1)==="["){t["posarraymulti.bind"]=t.id+".PM";}else{t["posarray.bind"]=t.id+".P";}}else{jQuery.sap.log.warning("sap.ui.vbm.Areas: items aggregation must not be empty!");}return t;};A.prototype.getTypeObject=function(){var t=V.prototype.getTypeObject.apply(this,arguments);var b=this.mBindInfo;var p=this.getPosChangeable().toString();t.A=t.A.concat([{"changeable":p,"name":"P","alias":"P","type":"vectorarray"},{"changeable":p,"name":"PM","alias":"PM","type":"vectorarraymulti"}]);if(b.C){t.A.push({"name":"C","alias":"C","type":"color"});}if(b.CB){t.A.push({"name":"CB","alias":"CB","type":"string"});}if(b.BD){t.A.push({"name":"BD","alias":"BD","type":"string"});}return t;};A.prototype.getActionArray=function(){var a=V.prototype.getActionArray.apply(this,arguments);var i=this.getId();if(this.mEventRegistry["click"]||this.isEventRegistered("click")){a.push({"id":i+"1","name":"click","refScene":"MainScene","refVO":i,"refEvent":"Click","AddActionProperty":[{"name":"pos"}]});}if(this.mEventRegistry["contextMenu"]||this.isEventRegistered("contextMenu")){a.push({"id":i+"2","name":"contextMenu","refScene":"MainScene","refVO":i,"refEvent":"ContextMenu"});}if(this.mEventRegistry["drop"]||this.isEventRegistered("drop")){a.push({"id":i+"3","name":"drop","refScene":"MainScene","refVO":i,"refEvent":"Drop"});}if(this.mEventRegistry["edgeClick"]||this.isEventRegistered("edgeClick")){a.push({"id":i+"7","name":"edgeClick","refScene":"MainScene","refVO":i,"refEvent":"EdgeClick"});}if(this.mEventRegistry["edgeContextMenu"]||this.isEventRegistered("edgeContextMenu")){a.push({"id":i+"8","name":"edgeContextMenu","refScene":"MainScene","refVO":i,"refEvent":"EdgeContextMenu"});}return a;};A.prototype.handleEvent=function(e){var s=e.Action.name;if(s=="edgeContextMenu"||s=="edgeClick"){var f="fire"+s[0].toUpperCase()+s.slice(1);var a;if((a=this.findInstance(e.Action.instance))){var b={data:e,edge:parseInt(e.Action.Params.Param['2']['#'],10)};if(s=="edgeContextMenu"){a.mClickPos=[e.Action.Params.Param[0]['#'],e.Action.Params.Param[1]['#']];sap.ui.getCore().loadLibrary("sap.ui.unified");if(this.oParent.mVBIContext.m_Menus){this.oParent.mVBIContext.m_Menus.deleteMenu("DynContextMenu");}var m=new sap.ui.unified.Menu();m.vbi_data={};m.vbi_data.menuRef="CTM";m.vbi_data.VBIName="DynContextMenu";b.menu=m;}if(a.mEventRegistry[s]){a[f](b);}if(this.mEventRegistry[s]){b.instance=a;this[f](b);}}else{jQuery.sap.log.error("Instance for event not found");}}else{V.prototype.handleEvent.apply(this,arguments);}};return A;});
