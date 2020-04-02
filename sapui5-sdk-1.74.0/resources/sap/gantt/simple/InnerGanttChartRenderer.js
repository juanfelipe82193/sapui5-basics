/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/Device","sap/ui/core/Core","./BaseLine","./RenderUtils","./GanttExtension"],function(D,C,B,R,G){"use strict";var I={};I.render=function(r,c){var g=c.getParent();this.renderGanttChart(r,g);g.getSyncedControl().scrollContentIfNecessary();};I.renderGanttChart=function(r,g){r.write("<div id='"+g.getId()+"-cnt'");r.addClass("sapGanttChartCnt");r.writeClasses();r.addStyle("height","100%");r.addStyle("width","100%");r.write(">");this.rerenderAllShapes(r,g);r.write("</div>");};I.renderImmediately=function(g){var r=C.createRenderManager();this.renderGanttChart(r,g);var o=window.document.getElementById(g.getId()+"-cnt");r.flush(o,true,false);this.renderRelationships(r,g);g._updateShapeSelections(g.getSelectedShapeUid(),[]);G.attachEvents(g);r.destroy();};I.rerenderAllShapes=function(r,g){var a=g.getSyncedControl().getRowStates();if(a.length===0){return;}g.getAggregation("_header").renderElement();var A=a.reduce(function(h,b){return h+b.height;},0);r.write("<svg id='"+g.getId()+"-svg'");r.addClass("sapGanttChartSvg");r.writeClasses();r.writeAttribute("height",A+"px");var i=R.getGanttRenderWidth(g);r.writeAttribute("width",i+"px");r.write(">");this.renderHelperDefs(r,g.getId());this.renderGanttBackgrounds(r,g,a);this.renderCalendarPattern(r,g);this.renderCalendarShapes(r,g);this.renderExpandedRowBackground(r,g);this.renderVerticalLines(r,g);this.renderNowLineBody(r,g);var f=[this.renderRlsContainer,this.renderAllShapesInRows,this.renderAssistedContainer];if(g.getEnableAdhocLine()){var l=g.getAdhocLineLayer();if(l===sap.gantt.AdhocLineLayer.Bottom){f.splice(0,0,this.renderAdhocLines);}else{f.push(this.renderAdhocLines);}}f.forEach(function(b){b.apply(I,[r,g]);});r.write("</svg>");if(!g._bPreventInitialRender){g._bPreventInitialRender=true;}};I.renderHelperDefs=function(r,i){r.write("<defs>");var l=i+"-helperDef-linePattern";r.write("<pattern id='"+l+"' width='2' height='2' x='0' y='0' patternUnits='userSpaceOnUse'>");r.write("<line x1='1' x2='1' y1='0' y2='2' stroke-width='1' stroke='white' shape-rendering='crispEdges' />");r.write("</pattern>");r.write("</defs>");};I.renderGanttBackgrounds=function(r,g,a){r.write("<g");r.writeAttribute("id",g.getId()+"-bg");r.write(">");this.renderRowBackgrounds(r,g,a);this.renderRowBorders(r,g,a);r.write("</g>");};I.renderRowBackgrounds=function(r,g,a){var n=0;r.write("<g class='rowBackgrounds'");r.write(">");a.forEach(function(o,i){r.write("<rect");r.writeAttribute("y",n);r.writeAttribute("width","100%");r.writeAttribute("height",o.height);r.writeAttribute("data-sap-ui-index",i);r.addClass("sapGanttBackgroundSVGRow");if(o.selected){r.addClass("sapGanttBackgroundSVGRowSelected");}if(o.hovered){r.addClass("sapGanttBackgroundSVGRowHovered");}r.writeClasses();r.write("/>");n+=o.height;});r.write("</g>");};I.renderRowBorders=function(r,g,a){r.write("<g class='rowBorders'");r.write(">");var n=0;a.forEach(function(o,i){var b=(n+o.height)-0.5;r.write("<line");r.writeAttribute("x1",0);r.writeAttribute("x2","100%");r.writeAttribute("y1",b);r.writeAttribute("y2",b);r.writeAttribute("style","pointer-events:none");r.addClass("sapGanttBackgroundSVGRowBorder");r.writeClasses();r.write("/>");n+=o.height;});r.write("</g>");};I.renderAdhocLines=function(r,g){var a=g.getAdhocLines();var t=g.getRenderedTimeRange(),m=t[0],M=t[1];a=a.filter(function(v){var d=sap.gantt.misc.Format.abapTimestampToDate(v.getTimeStamp());return d>=m&&d<=M;});if(a.length===0){return;}r.write("<g");r.writeAttribute("class","sapGanttChartAdhocLine");r.write(">");var A=g.getAxisTime();a.map(function(o){var x=A.timeToView(sap.gantt.misc.Format.abapTimestampToDate(o.getTimeStamp()));return new B({x1:x,y1:0,x2:x,y2:"100%",stroke:o.getStroke(),strokeWidth:o.getStrokeWidth(),strokeDasharray:o.getStrokeDasharray(),strokeOpacity:o.getStrokeOpacity(),tooltip:o.getDescription()}).setProperty("childElement",true);}).forEach(function(l){l.renderElement(r,l);});r.write("</g>");};I.renderVerticalLines=function(r,g){if(g.getEnableVerticalLine()){var a=R.getGanttRenderWidth(g),c=jQuery.sap.byId(g.getId()).height(),A=g.getAxisTime();var z=A.getZoomStrategy();var t=A.getTickTimeIntervalLabel(z.getTimeLineOption(),null,[0,a]);var T=t[1];var p="";for(var i=0;i<T.length;i++){p+=" M"+" "+(T[i].value-1/2)+" 0"+" v "+c;}if(p){r.write("<path");r.addClass("sapGanttChartVerticalLine");r.writeClasses();r.writeAttribute("d",p);r.write("/>");}}};I.renderAssistedContainer=function(r,g){r.write("<g");r.writeAttribute("class","sapGanttChartSelection");r.write(">");r.write("</g>");r.write("<g");r.writeAttribute("class","sapGanttChartShapeConnect");r.write(">");r.write("</g>");};I.renderNowLineBody=function(r,g){var n=g.getAxisTime().getNowLabel(g.getNowLineInUTC())[0].value;if(g.getEnableNowLine()===false||isNaN(n)){return;}r.write("<g class='sapGanttNowLineBodySvgLine'");r.write(">");var s=new B({x1:n,y1:0,x2:n,y2:"100%",strokeWidth:1}).setProperty("childElement",true);s.renderElement(r,s);r.write("</g>");};I.renderRlsContainer=function(r,g){r.write("<g");r.writeAttribute("class","sapGanttChartRls");r.write(">");r.write("</g>");};I.renderAllShapesInRows=function(r,g){if(!jQuery.sap.byId(g.getId()+"-gantt")){return;}r.write("<g");r.writeAttribute("class","sapGanttChartShapes");r.write(">");this._eachVisibleRowSettings(g,function(o){o.renderElement(r,g);});r.write("</g>");};I._eachVisibleRowSettings=function(g,c){var a=g.getTable().getRows();var b=g.getTable().getBindingInfo("rows"),m=b&&b.model;for(var i=0;i<a.length;i++){var r=a[i];var o=r.getBindingContext(m);if(o&&r.getIndex()!==-1){var d=r.getAggregation("_settings");if(c){c(d);}}}};I.renderRelationships=function(r,g){var o=jQuery.sap.domById(g.getId()+"-svg");var a=jQuery(o).children("g.sapGanttChartRls").get(0);if(o==null||a==null){return;}var f={};var c=function(b){b.getRelationships().forEach(function(d){var s=d.getShapeId();var S=b.getShapeUid(d);if(!f.hasOwnProperty(s)){f[s]=true;d.setProperty("shapeUid",S,true);d.renderElement(r,d,g.getId());}});};if(D.browser.msie){var t=jQuery("<div>").attr("id",g.getId()+"-rls").get(0);var T=jQuery.sap.domById("sap-ui-preserve").appendChild(t);r.write("<svg>");this._eachVisibleRowSettings(g,c);r.write("</svg>");r.flush(T,true,false);jQuery(a).append(jQuery(T).children());jQuery(T).remove();}else{this._eachVisibleRowSettings(g,c);r.flush(a,true,false);}};I.renderSvgDefs=function(r,g){var s=g.getSvgDefs();if(s){r.write("<svg");r.writeAttribute("id",g.getId()+"-svg-psdef");r.writeAttribute("aria-hidden","true");r.addStyle("float","left");r.addStyle("width","0px");r.addStyle("height","0px");r.writeStyles();r.write(">");r.write(s.getDefString());r.write("</svg>");}};I.renderCalendarPattern=function(r,g){var p=g.getCalendarDef(),s=g.getId(),i=g.iGanttRenderedWidth;if(p&&p.getDefNode()&&p.getDefNode().defNodes&&i>0){var d=p.getDefNode();var a=s+"-calendardefs";r.write("<defs");r.writeAttribute("id",a);r.write(">");for(var b=0;b<d.defNodes.length;b++){var n=d.defNodes[b];r.write("<pattern");r.writeAttribute("id",n.id);r.addClass("calendarPattern");r.writeClasses();r.writeAttribute("patternUnits","userSpaceOnUse");r.writeAttribute("x",0);r.writeAttribute("y",0);r.writeAttribute("width",i);r.writeAttribute("height",32);r.write(">");for(var c=0;c<n.timeIntervals.length;c++){var t=n.timeIntervals[c];r.write("<rect");r.writeAttribute("x",t.x);r.writeAttribute("y",t.y);r.writeAttribute("width",t.width);r.writeAttribute("height",32);r.writeAttribute("fill",t.fill);r.write("/>");}r.write("</pattern>");}r.write("</defs>");}};I.renderCalendarShapes=function(r,g){r.write("<g");r.addClass("sapGanttChartCalendar");r.writeClasses();r.write(">");var a=g.getSyncedControl().getRowStates();this._eachVisibleRowSettings(g,function(o){var p=R.calcRowDomPosition(o,a);o.getCalendars().forEach(function(c){c.setProperty("rowYCenter",p.rowYCenter,true);c._iBaseRowHeight=p.rowHeight;c.renderElement(r,c);});});r.write("</g>");};I.renderExpandedRowBackground=function(r,g){var a=g.getExpandedBackgroundData();if(jQuery.isEmptyObject(a)){return;}g._oExpandModel.refreshRowYAxis(g.getTable());var e=Array.prototype.concat.apply([],a);var w=g.iGanttRenderedWidth;r.write("<g");r.addClass("sapGanttChartRowBackground");r.writeClasses();r.write(">");for(var i=0;i<e.length;i++){var d=e[i];r.write("<g");r.addClass("expandedRow");r.writeClasses();r.write(">");r.write("<rect");r.writeAttribute("x",d.x);r.writeAttribute("y",d.y);r.writeAttribute("height",d.rowHeight-1);r.writeAttribute("width","100%");r.writeAttribute("class","sapGanttExpandChartCntBG");r.write(">");r.write("</rect>");r.write("<path");r.addClass("sapGanttExpandChartLine");r.writeClasses();r.writeAttribute("d","M0 "+(d.y-1)+" H"+(w-1));r.write("/>");r.write("</g>");}r.write("</g>");};return I;},true);
