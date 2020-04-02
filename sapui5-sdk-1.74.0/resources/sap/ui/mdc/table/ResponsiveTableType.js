/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["./TableTypeBase","../library"],function(T,l){"use strict";var I,a,b;var G=l.GrowingMode;var R=l.RowAction;var c=T.extend("sap.ui.mdc.table.ResponsiveTableType",{metadata:{properties:{growingMode:{type:"sap.ui.mdc.GrowingMode",defaultValue:G.Basic}}}});c.prototype.updateRelevantTableProperty=function(t,p,v){if(t&&t.isA("sap.m.Table")&&p==="growingMode"){t.setGrowingScrollToLoad(v===G.Scroll);}};c.updateDefault=function(t){if(t){t.setGrowing(true);t.setGrowingScrollToLoad(false);}};c.loadTableModules=function(){if(!I){return new Promise(function(r,d){sap.ui.require(["sap/m/Table","sap/m/Column","sap/m/ColumnListItem"],function(e,f,C){I=e;a=f;b=C;r();},function(){d("Failed to load some modules");});});}else{return Promise.resolve();}};c.createTable=function(i,s){return new I(i,s);};c.createColumn=function(i,s){return new a(i,s);};c.createTemplate=function(i,s){return new b(i,s);};c.updateSelection=function(t){t._oTable.setMode(T.getSelectionMode(t));};c.updateNavigation=function(t){t._oTemplate.setType(R.Navigation);};c.updateRowAction=function(t,n){t._oTemplate.setType("Active");if(n){this.updateNavigation(t);}};return c;});
