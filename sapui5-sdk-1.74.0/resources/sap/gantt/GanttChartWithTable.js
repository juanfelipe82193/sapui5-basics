/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/Device","./GanttChartBase","sap/ui/table/Column","sap/ui/table/Table","sap/ui/table/TreeTable","sap/ui/table/utils/TableUtils","sap/ui/layout/Splitter","sap/ui/layout/SplitterLayoutData","./GanttChart","./control/Cell","./control/Toolbar","./control/AssociateContainer","./drawer/SelectionPanel","./eventHandler/MouseWheelHandler","sap/ui/thirdparty/d3"],function(D,G,C,T,a,b,S,c,d,e,f,A,g,M){"use strict";var h=G.extend("sap.gantt.GanttChartWithTable",{metadata:{designtime:"sap/gantt/designtime/GanttChartWithTable.designtime",properties:{cellCallback:{type:"object"},fixedColumnCount:{type:"int"}},aggregations:{customToolbarItems:{type:"sap.ui.core.Control",multiple:true,visibility:"public",singularName:"customToolbarItem",bindable:"bindable"},columns:{type:"sap.ui.table.Column",multiple:true,visibility:"public",singularName:"column"},_selectionPanel:{type:"sap.ui.table.TreeTable",multiple:false,visibility:"hidden"},_chart:{type:"sap.gantt.GanttChart",multiple:false,visibility:"hidden"}}}});h.prototype.init=function(){G.prototype.init.apply(this,arguments);jQuery.sap.measure.start("GanttChartWithTable Init","GanttPerf:GanttChartWithTable Init function");this._oGanttChart=new d();this.setAggregation("_chart",this._oGanttChart);this._oGanttChartCnt=new A({enableRootDiv:true,content:this._oGanttChart});this._oTC=this._oGanttChart._oTT;var t=this;this._oTT=new a({visibleRowCountMode:"Auto",minAutoRowCount:1});jQuery.extend(this.mDefaultTableProperties,{fixedColumnCount:0,showColumnVisibilityMenu:false,selectionBehavior:sap.ui.table.SelectionBehavior.Row});this.setTableProperties(jQuery.extend({},this.mDefaultTableProperties));this._oTT._bVariableRowHeightEnabled=true;this._oTT._collectRowHeights=function(H){var j=a.prototype._collectRowHeights.apply(this,arguments);if(H){return j;}t._aHeights=j;var B=t._aHeights[0];var F=t._getTTFirstRenderingRowIndex();var r=t._aHeights.length;var m=B;var s=t._oGanttChart._getDrawingData([F,F+r-1]);if(s&&s.length>0){m=s[0].rowSpan*B;}for(var i=0;i<r;i++){var o=this.getContextByIndex(F+i);if(o){var k=o.getObject();var u=k?k.uid:undefined;if(u&&t._oGanttChart._oRowStatusMap[u]){t._aHeights[i]=t._oGanttChart._oRowStatusMap[u].visibleRowSpan*B;}else{t._aHeights[i]=m;}}else{t._aHeights[i]=B;}}return t._aHeights;};this._oTT._updateRowState=function(s){a.prototype._updateRowState.apply(this,arguments);var r=this.getRows(),R=t._getRowHeights();if(!R){return;}var $=this.$().find(".sapUiTableCtrlFixed > tbody > tr.sapUiTableTr");var i=this.$().find(".sapUiTableRowHdr");for(var I=0;I<r.length;I++){var j=r[I].$(),k=$.filter(":eq("+I+")"),l=i.filter(":eq("+I+")"),H=R[I]||0;var B=t._oGanttChart.getBaseRowHeight();var m=H/B>1;j.toggleClass('sapGanttExpandedRow',m);k.toggleClass('sapGanttExpandedRow',m);l.toggleClass('sapGanttExpandedRow',m);}};this._oTT.addEventDelegate({onAfterRendering:this._bindVerticalScrollForTT},this);this._oTT.attachToggleOpenState(function(E){t.fireTreeTableToggleEvent({rowIndex:E.getParameter("rowIndex"),rowContext:E.getParameter("rowContext"),expanded:E.getParameter("expanded")});});this._oTT.attachEvent("_rowsUpdated",this._onTTRowUpdate.bind(this));this.setAggregation("_selectionPanel",this._oTT);this._oToolbar=new f({type:sap.gantt.control.ToolbarType.Local,sourceId:sap.gantt.config.DEFAULT_HIERARCHY_KEY});this._oToolbar.data("holder",this);this._oToolbar.attachSourceChange(this._onToolbarSourceChange,this);this._oToolbar.attachExpandChartChange(this._onToolbarExpandChartChange,this);this._oToolbar.attachExpandTreeChange(this._onToolbarExpandTreeChange,this);this._oToolbar.attachModeChange(this._onToolbarModeChange,this);this._oToolbar.attachBirdEye(this._onToolbarBirdEye,this);this._oTT.addExtension(this._oToolbar);this._oSelectionPanelCnt=new A({enableRootDiv:true,content:this._oTT,layoutData:new c({size:"30%"})});this._oSplitter=new S({width:"100%",height:"100%",orientation:sap.ui.core.Orientation.Horizontal,contentAreas:[this._oSelectionPanelCnt,this._oGanttChartCnt]}).addStyleClass("sapGanttViewSplitterH");this._oSplitter.attachResize(this._onSplitterResize,this);this._oGanttChart.attachHorizontalScroll(this._onChartHSbScroll,this);this._oGanttChart.attachVerticalScroll(this._onChartVSbScroll,this);this._oGanttChart.attachRowSelectionChange(this._onRowSelectionChange,this);this._oGanttChart.attachShapeSelectionChange(this._onShapeSelectionChange,this);this._oGanttChart.attachChartMouseOver(this._onChartMouseOver,this);this._oGanttChart.attachRelationshipSelectionChange(this._onRelationshipSelectionChange,this);this._oGanttChart.attachChartClick(this._onClick,this);this._oGanttChart.attachChartDoubleClick(this._onDoubleClick,this);this._oGanttChart.attachChartRightClick(this._onRightClick,this);this._oGanttChart.attachEvent("_zoomInfoUpdated",this._onZoomInfoUpdated,this);this._oGanttChart.attachEvent("_shapesUpdated",this._onShapesUpdated,this);this._oGanttChart.attachChartDragEnter(this._onChartDragEnter,this);this._oGanttChart.attachChartDragLeave(this._onChartDragLeave,this);this._oGanttChart.attachShapeDragEnd(this._onShapeDragEnd,this);this._oGanttChart.attachEvent("_visibleHorizonUpdate",this._onGanttChartVisibleHorizonUpdate,this);this._oGanttChart.attachEvent("_timePeriodZoomStatusChange",this._onGanttChartTimePeriodZoomStatusChange,this);this._oGanttChart.attachEvent("_timePeriodZoomOperation",this._onGanttChartTimePeriodZoomOperation,this);this._oGanttChart.attachShapeResizeEnd(this._onShapeResizeEnd,this);this._oGanttChart.attachShapeMouseEnter(this._onShapeMouseEnter,this);this._oGanttChart.attachShapeMouseLeave(this._onShapeMouseLeave,this);this._oModesConfigMap={};this._oModesConfigMap[sap.gantt.config.DEFAULT_MODE_KEY]=sap.gantt.config.DEFAULT_MODE;this._oToolbarSchemeConfigMap={};this._oToolbarSchemeConfigMap[sap.gantt.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME_KEY]=sap.gantt.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME;this._oToolbarSchemeConfigMap[sap.gantt.config.EMPTY_TOOLBAR_SCHEME_KEY]=sap.gantt.config.EMPTY_TOOLBAR_SCHEME;this._oHierarchyConfigMap={};this._oHierarchyConfigMap[sap.gantt.config.DEFAULT_HIERARCHY_KEY]=sap.gantt.config.DEFAULT_HIERARCHY;this._oSelectionPanelDrawer=new g();this._oGanttChartSchemesConfigMap={};this._oGanttChartSchemesConfigMap[sap.gantt.config.DEFAULT_CHART_SCHEME_KEY]=sap.gantt.config.DEFAULT_CHART_SCHEME;this._oObjectTypesConfigMap={};this._oObjectTypesConfigMap[sap.gantt.config.DEFAULT_OBJECT_TYPE_KEY]=sap.gantt.config.DEFAULT_OBJECT_TYPE;this._oShapesConfigMap={};this._oMouseWheelHandler=new M(this);jQuery.sap.measure.end("GanttChartWithTable Init");};h.prototype.setNowLineInUTC=function(v){G.prototype.setNowLineInUTC.call(this,v);this._oGanttChart.setNowLineInUTC(v);};h.prototype.setFixedColumnCount=function(F){this.setTableProperties({fixedColumnCount:F});return this;};h.prototype.getFixedColumnCount=function(){return this.getTableProperties().fixedColumnCount;};h.prototype.setTimeAxis=function(t){this.setProperty("timeAxis",t,true);this._oGanttChart.setTimeAxis(t);return this;};h.prototype.setMode=function(m){this.setProperty("mode",m);this._oGanttChart.setMode(m);this._oToolbar.setMode(m);return this;};h.prototype.setModes=function(m){this.setProperty("modes",m);this._oToolbar.setModes(m);this._oGanttChart.setModes(m);this._oModesConfigMap={};if(m){for(var i=0;i<m.length;i++){this._oModesConfigMap[m[i].getKey()]=m[i];}}return this;};h.prototype.setSelectionMode=function(s){this.setProperty("selectionMode",s);switch(s){case sap.gantt.SelectionMode.Multiple:case sap.gantt.SelectionMode.MultiWithKeyboard:this.setTableProperties({selectionMode:sap.ui.table.SelectionMode.MultiToggle,selectionBehavior:sap.ui.table.SelectionBehavior.Row});break;case sap.gantt.SelectionMode.Single:this.setTableProperties({selectionMode:sap.ui.table.SelectionMode.Single,selectionBehavior:sap.ui.table.SelectionBehavior.Row});break;case sap.gantt.SelectionMode.None:this.setTableProperties({selectionMode:sap.ui.table.SelectionMode.None,selectionBehavior:sap.ui.table.SelectionBehavior.RowOnly});break;}this._oGanttChart.setSelectionMode(s);return this;};h.prototype.setShapeSelectionMode=function(s){this.setProperty("shapeSelectionMode",s);this._oGanttChart.setShapeSelectionMode(s);return this;};h.prototype.setToolbarSchemes=function(t){this.setProperty("toolbarSchemes",t);this._oToolbar.setToolbarSchemes(t);this._oToolbarSchemeConfigMap={};if(t){for(var i=0;i<t.length;i++){this._oToolbarSchemeConfigMap[t[i].getKey()]=t[i];}}return this;};h.prototype.setHierarchyKey=function(H){this.setProperty("hierarchyKey",H);this._oGanttChart.setProperty("hierarchyKey",H);this._oToolbar.setSourceId(H);this._hierarchyChange();return this;};h.prototype.setHierarchies=function(H){this.setProperty("hierarchies",H);this._oToolbar.setHierarchies(H);this._oGanttChart.setHierarchies(H);this._oHierarchyConfigMap={};if(H){for(var i=0;i<H.length;i++){this._oHierarchyConfigMap[H[i].getKey()]=H[i];}}this._hierarchyChange();return this;};h.prototype.setCalendarDef=function(o){this.setAggregation("calendarDef",o);var p=o.getBindingInfo("defs");if(p){p.templateShareable=true;}this._oGanttChart.setCalendarDef(o.clone());return this;};h.prototype.setAdhocLineLayer=function(l){this.setProperty("adhocLineLayer",l);this._oGanttChart.setAdhocLineLayer(l);return this;};h.prototype.addAdhocLine=function(o){this._oGanttChart.addAdhocLine(o);return this;};h.prototype.insertAdhocLine=function(o,i){this._oGanttChart.insertAdhocLine(o,i);return this;};h.prototype.removeAdhocLine=function(o){return this._oGanttChart.removeAdhocLine(o);};h.prototype.getAdhocLines=function(){return this._oGanttChart.getAdhocLines();};h.prototype.removeAllAdhocLines=function(){return this._oGanttChart.removeAllAdhocLines();};h.prototype.setUseFlatMode=function(F){this._oTT.setUseFlatMode(F);return this;};h.prototype._hierarchyChange=function(o){var H=this.getHierarchyKey();if(H&&this._oHierarchyConfigMap[H]){if(this._oHierarchyConfigMap[H].getColumns()&&this._oHierarchyConfigMap[H].getColumns().length>0){this._buildColumnFromCellCallback();}var m=this.getMode();if(m===sap.gantt.config.DEFAULT_MODE_KEY&&this._oHierarchyConfigMap[this.getHierarchyKey()]){m=this._oHierarchyConfigMap[this.getHierarchyKey()].getActiveModeKey();}this.setMode(m);}};h.prototype._buildColumnFromCellCallback=function(){this._oTT.removeAllColumns();var H,j;H=this._oHierarchyConfigMap[this.getHierarchyKey()];if(H){j=H.getColumns();}if(j){for(var i=0;i<j.length;i++){var o=new C({label:j[i].getTitle(),sortProperty:j[i].getSortAttribute(),filterProperty:j[i].getFilterAttribute(),width:j[i].getWidth(),template:new e({cellCallback:this.getCellCallback(),columnConfig:j[i]}).data("rowTypeName",this.getRowTypeName())});this._oTT.addColumn(o);this._oTT.addAriaLabelledBy(o.getLabel());}}};h.prototype.setObjectTypes=function(o){this.setProperty("objectTypes",o,true);this._oGanttChart.setObjectTypes(o);this._oObjectTypesConfigMap={};if(o){for(var i=0;i<o.length;i++){this._oObjectTypesConfigMap[o[i].getKey()]=o[i];}}return this;};h.prototype.setChartSchemes=function(j){this.setProperty("chartSchemes",j,true);this._oGanttChart.setChartSchemes(j);this._oGanttChartSchemesConfigMap={};if(j){for(var i=0;i<j.length;i++){this._oGanttChartSchemesConfigMap[j[i].getKey()]=j[i];}}return this;};h.prototype.setShapeDataNames=function(s){this.setProperty("shapeDataNames",s);this._oGanttChart.setShapeDataNames(s);return this;};h.prototype.setLocale=function(l){this.setProperty("locale",l,true);this._oGanttChart.setLocale(l);return this;};h.prototype.setShapes=function(s){this.setProperty("shapes",s,true);this._oGanttChart.setShapes(s);this._oShapesConfigMap={};if(s){for(var i=0;i<s.length;i++){this._oShapesConfigMap[s[i].getKey()]=s[i];}}return this;};h.prototype.setSvgDefs=function(s){this.setProperty("svgDefs",s);this._oGanttChart.setSvgDefs(s);return this;};h.prototype.setEnableCursorLine=function(E){this.setProperty("enableCursorLine",E);this._oGanttChart.setEnableCursorLine(E);this._oToolbar.setEnableCursorLine(E);return this;};h.prototype.setEnableNowLine=function(E){this.setProperty("enableNowLine",E);this._oGanttChart.setEnableNowLine(E);this._oToolbar.setEnableNowLine(E);return this;};h.prototype.setEnableVerticalLine=function(E){this.setProperty("enableVerticalLine",E);this._oGanttChart.setEnableVerticalLine(E);this._oToolbar.setEnableVerticalLine(E);return this;};h.prototype.setEnableAdhocLine=function(E){this.setProperty("enableAdhocLine",E);this._oGanttChart.setEnableAdhocLine(E);this._oToolbar.setEnableAdhocLine(E);return this;};h.prototype.setEnableShapeTimeDisplay=function(E){this.setProperty("enableShapeTimeDisplay",E);this._oGanttChart.setEnableShapeTimeDisplay(E);return this;};h.prototype.setTimeZoomRate=function(t){this.setProperty("timeZoomRate",t,true);this._oGanttChart.setTimeZoomRate(t);return this;};h.prototype.setAxisTimeStrategy=function(o){this._oGanttChart.setAxisTimeStrategy(o);return this;};h.prototype.getAxisTimeStrategy=function(){return this._oGanttChart.getAxisTimeStrategy();};h.prototype.addRelationship=function(r){this._oGanttChart.addRelationship(r);};h.prototype.insertRelationship=function(i,r){this._oGanttChart.insertRelationship(i,r);};h.prototype.removeRelationship=function(r){this._oGanttChart.removeRelationship(r);};h.prototype.getRelationships=function(){this._oGanttChart.getRelationships();};h.prototype.destroyRelationships=function(){this._oGanttChart.destroyRelationships();};h.prototype.indexOfRelationship=function(r){this._oGanttChart.indexOfRelationship(r);};h.prototype.removeAllRelationships=function(){this._oGanttChart.removeAllRelationships();};h.prototype.updateRelationships=function(r){this._oGanttChart.updateRelationships(r);};h.prototype.setSelectionPanelSize=function(s,i){this.setProperty("selectionPanelSize",s,i);this._oSelectionPanelCnt.setLayoutData(new c({size:s}));return this;};h.prototype.addColumn=function(o){this._oTT.addColumn(o);};h.prototype.insertColumn=function(o,i){this._oTT.insertColumn(o,i);};h.prototype.removeColumn=function(o){this._oTT.removeColumn(o);};h.prototype.removeAllColumns=function(){this._oTT.removeAllColumns();};h.prototype.getColumns=function(){return this._oTT.getColumns();};h.prototype.setGhostAlignment=function(s){this.setProperty("ghostAlignment",s);this._oGanttChart.setGhostAlignment(s);return this;};h.prototype._bindAggregation=function(n,B){var m,o;if(n==="rows"&&B){m=this.getModel(B.model);o=this.getBindingContext(B.model);if(o&&m){B.path=m.resolve(B.path,o);}this._oTT.bindRows(B);this._oGanttChart.bindRows(B);this._oTC.updateRows=this._updateRows.bind(this);this._oTT._oSelectionPlugin=this._oTC._oSelectionPlugin;}else if(n==="relationships"&&B){m=this.getModel(B.model);o=this.getBindingContext(B.model);if(o&&m){B.path=m.resolve(B.path,o);}this._oGanttChart.bindRelationships(B);}else if(n==="columns"&&B){m=this.getModel(B.model);o=this.getBindingContext(B.model);if(o&&m){B.path=m.resolve(B.path,o);}this._oTT.bindColumns(B);}else{return G.prototype._bindAggregation.apply(this,arguments);}};h.prototype.setTableProperties=function(p){G.prototype.setTableProperties.apply(this,arguments);this._oGanttChart.setTableProperties(p);return this;};h.prototype._updateRows=function(r){if(r!=="VerticalScroll"&&(this._oTC.getFirstVisibleRow()===this._oTT.getFirstVisibleRow()||r===sap.ui.model.ChangeReason.Filter||r===sap.ui.model.ChangeReason.Sort)){T.prototype.updateRows.apply(this._oTT,arguments);}T.prototype.updateRows.apply(this._oTC,arguments);};h.prototype._detachToolbarEvents=function(){this._oToolbar.detachSourceChange(this._onToolbarSourceChange,this);this._oToolbar.detachExpandChartChange(this._onToolbarExpandChartChange,this);this._oToolbar.detachExpandTreeChange(this._onToolbarExpandTreeChange,this);this._oToolbar.detachBirdEye(this._onToolbarBirdEye,this);};h.prototype._onToolbarBirdEye=function(E){this._oGanttChart._doBirdEye(E.getParameter("birdEyeRange"));};h.prototype.doBirdEyeOnRow=function(r){this._oGanttChart.doBirdEyeOnRow(r);};h.prototype.getVisibleWidth=function(){return this._oGanttChart.getVisibleWidth();};h.prototype.onAfterRendering=function(){this._attachEvents();};h.prototype.onBeforeRendering=function(){if(this._oToolbar.getAllToolbarItems().length===0){this._oTT.removeExtension(this._oToolbar);}else if(this._oTT.getExtension().length===0){this._oTT.addExtension(this._oToolbar);}};h.prototype._attachEvents=function(){var o={onAfterRendering:this._syncGanttTablesDomEvents};this._oTT.removeEventDelegate(o);this._oTT.addEventDelegate(o,this);this._oTC.removeEventDelegate(o);this._oTC.addEventDelegate(o,this);this._appendMaskSvg();var $=this.$().find(this.getDomSelectorById("spm-svg-table"));if(D.browser.firefox){$.unbind("MozMousePixelScroll.sapUiTableMouseWheel",this._onMouseWheel.bind(this));$.bind("MozMousePixelScroll.sapUiTableMouseWheel",this._onMouseWheel.bind(this));}else{$.unbind("wheel.sapUiTableMouseWheel",this._onMouseWheel.bind(this));$.bind("wheel.sapUiTableMouseWheel",this._onMouseWheel.bind(this));}};h.prototype._onMouseWheel=function(E){this._oMouseWheelHandler.handleEvent(E);};h.prototype._onRowSelectionChange=function(E){var s=this._getSelectionHandler().getSelectedIndices();this._oToolbar.toggleExpandTreeButton(s.length>0);this.fireRowSelectionChange({originEvent:E.getParameter("originEvent")});this._oTT._updateSelection();};h.prototype._onChartMouseOver=function(E){var p=E.getParameters();this.fireChartMouseOver({objectInfo:p.objectInfo,leadingRowInfo:p.leadingRowInfo,timestamp:p.timestamp,svgId:p.svgId,svgCoordinate:p.svgCoordinate,effectingMode:p.effectingMode,originEvent:p.originEvent});};h.prototype._onShapeSelectionChange=function(E){this.fireShapeSelectionChange({originEvent:E.getParameter("originEvent")});};h.prototype._onRelationshipSelectionChange=function(E){this.fireRelationshipSelectionChange({originEvent:E.getParameter("originEvent")});};h.prototype._onClick=function(E){var p=E.getParameters();this.fireChartClick({objectInfo:p.objectInfo,leadingRowInfo:p.leadingRowInfo,timestamp:p.timestamp,svgId:p.svgId,svgCoordinate:p.svgCoordinate,effectingMode:p.effectingMode,originEvent:p.originEvent});};h.prototype._onDoubleClick=function(E){var p=E.getParameters();this.fireChartDoubleClick({objectInfo:p.objectInfo,leadingRowInfo:p.leadingRowInfo,timestamp:p.timestamp,svgId:p.svgId,svgCoordinate:p.svgCoordinate,effectingMode:p.effectingMode,originEvent:p.originEvent});};h.prototype._onRightClick=function(E){var p=E.getParameters();this.fireChartRightClick({objectInfo:p.objectInfo,leadingRowInfo:p.leadingRowInfo,timestamp:p.timestamp,svgId:p.svgId,svgCoordinate:p.svgCoordinate,effectingMode:p.effectingMode,originEvent:p.originEvent});};h.prototype._onChartDragEnter=function(E){this.fireChartDragEnter({originEvent:E.getParameter("originEvent")});};h.prototype._onChartDragLeave=function(E){this.fireChartDragLeave({originEvent:E.getParameter("originEvent"),draggingSource:E.getParameter("draggingSource"),timePopoverData:E.getParameter("timePopoverData")});};h.prototype._onShapeDragEnd=function(E){var p=E.getParameters();this.fireShapeDragEnd({originEvent:p.originEvent,sourceShapeData:p.sourceShapeData,targetData:p.targetData,sourceSvgId:p.sourceSvgId,targetSvgId:p.targetSvgId});};h.prototype._onShapeResizeEnd=function(E){var p=E.getParameters();this.fireShapeResizeEnd({shapeUid:p.shapeUid,rowObject:p.rowObject,oldTime:p.oldTime,newTime:p.newTime});};h.prototype._onShapeMouseEnter=function(E){var p=E.getParameters();this.fireShapeMouseEnter({shapeData:p.shapeData,pageX:p.pageX,pageY:p.pageY,originEvent:p.originEvent});};h.prototype._onShapeMouseLeave=function(E){var p=E.getParameters();this.fireShapeMouseLeave({shapeData:p.shapeData,originEvent:p.originEvent});};h.prototype._onGanttChartVisibleHorizonUpdate=function(E){this.fireEvent("_visibleHorizonUpdate",E.getParameters());};h.prototype._onGanttChartTimePeriodZoomStatusChange=function(E){this.fireEvent("_timePeriodZoomStatusChange",E.getParameters());};h.prototype._onGanttChartTimePeriodZoomOperation=function(E){this.fireEvent("_timePeriodZoomOperation",E.getParameters());};h.prototype.syncTimePeriodZoomStatus=function(i){this._oGanttChart.syncTimePeriodZoomStatus(i);};h.prototype.syncTimePeriodZoomOperation=function(E,t,o){this._oGanttChart.syncTimePeriodZoomOperation(E,t,o);};h.prototype.syncMouseWheelZoom=function(E){this._oGanttChart.syncMouseWheelZoom(E);};h.prototype._onChartHSbScroll=function(E){this.fireHorizontalScroll(E.getParameters());};h.prototype.syncVisibleHorizon=function(t,v,k){this._oGanttChart.syncVisibleHorizon(t,v,k);};h.prototype._onChartVSbScroll=function(E){var $=jQuery(this.getTTVsbDom());var i=jQuery(this.getTCVsbDom());if(this.sScrollSource===null||this.sScrollSource!=="GanttChartWithTable"){this.sScrollSource="GanttChart";window.requestAnimationFrame(function(){$.scrollTop(i.scrollTop());});}else{this.sScrollSource=null;}this.fireVerticalScroll({scrollSteps:this._oTC.getFirstVisibleRow(),scrollPosition:jQuery(this.getTCVsbDom()).scrollTop()});};h.prototype._drawSvg=function(){this._appendMaskSvg();this._updateMaskSvg();this._updateTableRowHeights();this._drawSelectionPanel();};h.prototype._onZoomInfoUpdated=function(E){var p=E.getParameters();if(p.axisTimeChanged){this.setProperty("timeZoomRate",this._oGanttChart.getAxisTime().getZoomRate(),true);}this.fireEvent("_zoomInfoUpdated",p);};h.prototype._onShapesUpdated=function(E){this.fireEvent("_shapesUpdated",{aSvg:E.getParameter("aSvg")});};h.prototype._bindVerticalScrollForTT=function(){var $=jQuery(this.getTTVsbDom());$.unbind("scroll.sapUiTableVScrollForGanttChartWithTable",this._onSelectionPanelVSbScroll);$.bind("scroll.sapUiTableVScrollForGanttChartWithTable",jQuery.proxy(this._onSelectionPanelVSbScroll,this));};h.prototype._onSelectionPanelVSbScroll=function(){var $=jQuery(this.getTTVsbDom());var i=jQuery(this.getTCVsbDom());if(this.sScrollSource===null||this.sScrollSource!=="GanttChart"){this.sScrollSource="GanttChartWithTable";window.requestAnimationFrame(function(){i.scrollTop($.scrollTop());});}else{this.sScrollSource=null;}this._applyTransform();};h.prototype._applyTransform=function(){this.$().find(this.getDomSelectorById("spm-svg-table")).css("transform","translateY("+(-this._oTT.$().find(".sapUiTableCCnt").scrollTop())+"px)");};h.prototype._onSplitterResize=function(E){var p=E.getParameters();this._oGanttChart._draw();this.fireSplitterResize(p);};h.prototype._onToolbarSourceChange=function(E){var o=this.getHierarchyKey();var i=this.getMode();this.setHierarchyKey(E.getParameter("id"));this.notifySourceChange();this.fireGanttChartSwitchRequested({hierarchyKey:E.getParameter("id"),oldHierarchyKey:o,oldMode:i});};h.prototype._onToolbarExpandChartChange=function(E){var i=E.getParameter("isExpand"),j=E.getParameter("expandedChartSchemes");this.handleExpandChartChange(i,j,null);};h.prototype._onToolbarExpandTreeChange=function(E){var s=E.getParameter("action");if(s){var i=this._getSelectionHandler().getSelectedIndices();this._oTT[s](i);}};h.prototype._onToolbarModeChange=function(E){var B=this.getBinding("mode");if(B){B.setValue(E.getParameter("mode"));}this.setMode(E.getParameter("mode"));};h.prototype.handleExpandChartChange=function(E,i,s){s=s?s:this._getSelectionHandler().getSelectedIndices();this._oGanttChart.handleExpandChartChange(E,i,s);};h.prototype.invertRowExpandStatus=function(s,i){if(s&&s.length>0&&i){this._oGanttChart.invertRowExpandStatus(s,i);}};h.prototype._updateTableRowHeights=function(){var t=this._oTT;var H=this._getRowHeights();if(!H){return;}t._updateRowHeights(H,false);};h.prototype._getRowHeights=function(){return this._aHeights;};h.prototype.setBaseRowHeight=function(n){this.setProperty("baseRowHeight",n);this._oTT.setRowHeight(n);return this._oGanttChart.setBaseRowHeight(n);};h.prototype.getBaseRowHeight=function(){return this._oGanttChart.getBaseRowHeight();};h.prototype._onTTRowUpdate=function(){var $=this.$().find(this.getDomSelectorById("spm-svg-table-ctn"));if(this._oGanttChart.isRowExpanded()){var i=this._oTT.$();$.height(i.find(".sapUiTableCCnt").height());$.show();var j=$.find(".sapGanttSPMaskSvg");j.height(i.find(".sapUiTableCtrlCnt").height());this._drawSvg();}else{$.hide();}this._adjustGanttInferredRowHeight();b.Grouping.updateGroups(this._oTT);this._adjustChartHeaderHeight();};h.prototype._adjustChartHeaderHeight=function(){var $=this._oTT.$().find(".sapUiTableExt");var i=this._oTT.$().find(".sapUiTableColHdrCnt");var j=($?$.outerHeight():0)+i.height()+1;if(D.browser.firefox){var k=this._oTT.$().find(".sapUiTableCCnt");j=parseInt(k[0].getBoundingClientRect().top-this._oTT.$()[0].getBoundingClientRect().top,10);}var l=this._oGanttChart.$().find(".sapGanttChartHeader");l.height(j);l.css("min-height",j);var m=this._oGanttChart.$().find(".sapGanttChartHeaderSvg");m.height(j);m.css("min-height",j);};h.prototype._adjustGanttInferredRowHeight=function(){var H=this._getRowHeights();var F=this._getTTFirstRenderingRowIndex();var s=this._oGanttChart._getDrawingData([F,F]);if(H&&H.length>0&&s&&s.length>0){var B=H[0]/s[0].visibleRowSpan;var p=this._oGanttChart._iInferedBaseRowHeight;if(B!==p){this._oGanttChart._setInferedBaseRowHeight(B);if(p===undefined){this._oTC.updateRows();}}}};h.prototype._syncGanttTablesDomEvents=function(E){var s=E.srcControl,t=s.getId()===this._oTT.getId()?this._oTC:this._oTT;s.$().find(".sapUiTableRowHdr, .sapUiTableTr").hover(function(E){var i=jQuery(E.currentTarget).data("sapUiRowindex");t.$().find(".sapUiTableCtrlFixed > tbody > tr.sapUiTableTr").filter(":eq("+i+")").addClass("sapUiTableRowHvr");t.$().find(".sapUiTableCtrlScroll > tbody > tr.sapUiTableTr").filter(":eq("+i+")").addClass("sapUiTableRowHvr");t.$().find(".sapUiTableRowHdr").filter(":eq("+i+")").addClass("sapUiTableRowHvr");},function(E){t.$().find(".sapUiTableCtrlFixed > tbody > tr.sapUiTableTr").removeClass("sapUiTableRowHvr");t.$().find(".sapUiTableCtrlScroll > tbody > tr.sapUiTableTr").removeClass("sapUiTableRowHvr");t.$().find(".sapUiTableRowHdr").removeClass("sapUiTableRowHvr");});};h.prototype._setLargeDataScrolling=function(l){if(this._oTT._setLargeDataScrolling){this._oTT._setLargeDataScrolling(!!l);}if(this._oTC._setLargeDataScrolling){this._oTC._setLargeDataScrolling(!!l);}};h.prototype.getToolbarSchemeKey=function(){return this._oToolbar.getToolbarSchemeKey();};h.prototype.jumpToPosition=function(o){this._oGanttChart.jumpToPosition(o);};h.prototype.selectShapes=function(i,j){return this._oGanttChart.selectShapes(i,j);};h.prototype.deselectShapes=function(i){return this._oGanttChart.deselectShapes(i);};h.prototype.selectRelationships=function(i,j){return this._oGanttChart.selectRelationships(i,j);};h.prototype.deselectRelationships=function(i){return this._oGanttChart.deselectRelationships(i);};h.prototype.selectRows=function(i,j){return this._oGanttChart.selectRows(i,j);};h.prototype.deselectRows=function(i){return this._oGanttChart.deselectRows(i);};h.prototype.selectRowsAndShapes=function(i,I){return this._oGanttChart.selectRowsAndShapes(i,I);};h.prototype.getAllSelections=function(){return this._oGanttChart.getAllSelections();};h.prototype.getSelectedShapes=function(){var s=this._oGanttChart.getSelectedShapes();return s;};h.prototype.getSelectedRows=function(){var s=this._oGanttChart.getSelectedRows();return s;};h.prototype.getSelectedRelationships=function(){var s=this._oGanttChart.getSelectedRelationships();return s;};h.prototype.setDraggingData=function(o){this._oGanttChart.setDraggingData(o);};h.prototype.setTimePopoverData=function(o){this._oGanttChart.setTimePopoverData(o);};h.prototype.getRowByShapeUid=function(s){return this._oGanttChart.getRowByShapeUid(s);};h.prototype._drawSelectionPanel=function(){var t=this._oTT.$().find(".sapUiTableRowHdrScr").width();var v=this._getVisibleRowData();if(v!==undefined){this._oSelectionPanelDrawer.drawSvg(d3.select(this.getDomSelectorById("spm-svg-table")),v,t,this);this.$().find(this.getDomSelectorById("spm-svg-table")).css("transform","translateY("+(-this._oTT.$().find(".sapUiTableCCnt").scrollTop())+"px)");}};h.prototype._getVisibleRowData=function(){var F=this._getTTFirstRenderingRowIndex();var v=this.getVisibleRowCount()+1;var V=this._oGanttChart._getDrawingData([F,F+v-1]);var B=this._oGanttChart.getBaseRowHeight();var p=0;for(var i=0;i<V.length;i++){var s=V[i];s.rowHeight=s.rowSpan*B;s.y=p;p+=s.rowHeight;}return V;};h.prototype._appendMaskSvg=function(){var $=this.$().find(this.getDomSelectorById("spm-svg-table-ctn"));var i=this._oTT.$();if($.length==0&&this._oGanttChart.isRowExpanded()){$=jQuery("<div id='"+this.getId()+"-spm-svg-table-ctn' class='sapGanttChartSPMSvgCtn' >"+"<svg id='"+this.getId()+"-spm-svg-table' class='sapGanttSPMaskSvg'>"+"</svg>"+"</div>");i.parent().append($);}};h.prototype._updateMaskSvg=function(){var $=this.$().find(this.getDomSelectorById("spm-svg-table-ctn"));var i=this._oTT.$();$.height(i.find(".sapUiTableCCnt").height());$.width(jQuery(document).width());$.css("top",this._oGanttChart.$().find(".sapGanttChartHeader").height()+1);$.css("min-width",i.find("table").css("min-width"));var j=$.find(".sapGanttSPMaskSvg");j.width($.width());j.height(i.find(".sapUiTableCtrlCnt").height());};h.prototype.getAxisOrdinal=function(){return this._oGanttChart.getAxisOrdinal();};h.prototype.getAxisTime=function(){return this._oGanttChart.getAxisTime();};h.prototype.expandToLevel=function(l){this._oTT.expandToLevel(l);return this;};h.prototype.expand=function(r){this._oTT.expand(r);return this;};h.prototype.collapse=function(r){this._oTT.collapse(r);return this;};h.prototype.getVisibleRowCount=function(){return this._oTT.getVisibleRowCount();};h.prototype.getLargestHorizonByDataRange=function(B,r,i){return this._oGanttChart.getLargestHorizonByDataRange(B,r,i);};h.prototype.setSelectedIndex=function(r){this._getSelectionHandler().setSelectedIndex(r);return this;};h.prototype.getSelectedIndex=function(){return this._getSelectionHandler().getSelectedIndex();};h.prototype.getFirstVisibleRow=function(){return this.getTableProperties().firstVisibleRow;};h.prototype.setFirstVisibleRow=function(r){this.setTableProperties({firstVisibleRow:r});return this;};h.prototype.getRows=function(){return this._oTT.getRows();};h.prototype.exit=function(){this._detachToolbarEvents();this._oSplitter.destroy();};h.prototype.notifySourceChange=function(){this._oTT.setFirstVisibleRow(0);this._oGanttChart.notifySourceChange();};h.prototype.autoResizeColumn=function(j){if(j>=0&&jQuery.isNumeric(j)){this._oTT.autoResizeColumn(j);}else{for(var i=this._oTT.getColumns().length;i>=0;i--){this._oTT.autoResizeColumn(i);}}};h.prototype._autoResizeColumn=function(){if(this._oHierarchyConfigMap[this.getHierarchyKey()].getAutoResizeColumn()){this.autoResizeColumn();}};h.prototype.redraw=function(H){this._oGanttChart.redraw(H);};h.prototype.selectByUid=function(u){this._oGanttChart.selectByUid(u);};h.prototype.getTTHsbDom=function(){return this._oTT.getDomRef(sap.ui.table.SharedDomRef.HorizontalScrollBar);};h.prototype.getTTVsbDom=function(){return this._oTT.getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar);};h.prototype.getTCVsbDom=function(){return this._oGanttChart.getTTVsbDom();};h.prototype._getTTFirstRenderingRowIndex=function(){if(this._oTT.getRows().length>0){return this._oTT.getRows()[0].getIndex();}return this._oTT.getFirstVisibleRow();};["addCustomToolbarItem","insertCustomToolbarItem","removeCustomToolbarItem","indexOfCustomToolbarItem","removeAllCustomToolbarItems","destroyCustomToolbarItems","getCustomToolbarItems"].forEach(function(m){h.prototype[m]=function(){return this._oToolbar[m].apply(this._oToolbar,arguments);};});return h;},true);
