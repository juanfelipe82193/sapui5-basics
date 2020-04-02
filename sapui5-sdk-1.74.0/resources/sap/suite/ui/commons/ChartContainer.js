/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery",'./library','sap/m/library','sap/viz/library','sap/ui/base/ManagedObject','sap/m/Button','sap/m/ButtonType','sap/m/OverflowToolbar','sap/m/OverflowToolbarButton','sap/m/SegmentedButton','sap/m/Title','sap/m/ToolbarSpacer','sap/ui/Device','sap/ui/core/Control','sap/ui/core/CustomData','sap/ui/core/Popup','sap/ui/core/ResizeHandler','sap/ui/core/delegate/ScrollEnablement','sap/m/ToggleButton',"sap/base/util/uid","sap/base/Log","./ChartContainerRenderer"],function(q,l,M,V,a,B,b,O,c,S,T,d,D,C,e,P,R,f,g,u,L,h){"use strict";var j=C.extend("sap.suite.ui.commons.ChartContainer",{metadata:{library:"sap.suite.ui.commons",properties:{showPersonalization:{type:"boolean",group:"Misc",defaultValue:false},showFullScreen:{type:"boolean",group:"Misc",defaultValue:false},fullScreen:{type:"boolean",group:"Misc",defaultValue:false},showLegend:{type:"boolean",group:"Misc",defaultValue:true},title:{type:"string",group:"Misc",defaultValue:''},selectorGroupLabel:{type:"string",group:"Misc",defaultValue:null,deprecated:true},autoAdjustHeight:{type:"boolean",group:"Misc",defaultValue:false},showZoom:{type:"boolean",group:"Misc",defaultValue:true},showLegendButton:{type:"boolean",group:"Misc",defaultValue:true},showSelectionDetails:{type:"boolean",group:"Behavior",defaultValue:false},wrapLabels:{type:"boolean",group:"Misc",defaultValue:false},enableScroll:{type:"boolean",group:"Misc",defaultValue:true},width:{type:"sap.ui.core.CSSSize",defaultValue:"100%"}},defaultAggregation:"content",aggregations:{dimensionSelectors:{type:"sap.ui.core.Control",multiple:true,singularName:"dimensionSelector"},content:{type:"sap.suite.ui.commons.ChartContainerContent",multiple:true,singularName:"content"},toolbar:{type:"sap.m.OverflowToolbar",multiple:false},customIcons:{type:"sap.ui.core.Icon",multiple:true,singularName:"customIcon"}},events:{personalizationPress:{},contentChange:{parameters:{selectedItemId:{type:"string"}}},customZoomInPress:{},customZoomOutPress:{}}}});j.prototype.init=function(){this._aUsedContentIcons=[];this._aCustomIcons=[];this._oToolBar=null;this._aDimensionSelectors=[];this._bChartContentHasChanged=false;this._bControlNotRendered=true;this._bSegmentedButtonSaveSelectState=false;this._mOriginalVizFrameHeights={};this._oActiveChartButton=null;this._oSelectedContent=null;this._sResizeListenerId=null;this._bHasApplicationToolbar=false;this._iPlaceholderPosition=0;this._oResBundle=sap.ui.getCore().getLibraryResourceBundle("sap.suite.ui.commons");this._oFullScreenButton=new g({icon:"sap-icon://full-screen",type:b.Transparent,tooltip:this._oResBundle.getText("CHARTCONTAINER_FULLSCREEN"),press:this._onFullScreenButtonPress.bind(this)});this._oPopup=new P({modal:true,shadow:false,autoClose:false});this._oShowLegendButton=new g({icon:"sap-icon://legend",type:b.Transparent,tooltip:this._oResBundle.getText("CHARTCONTAINER_LEGEND"),press:this._onShowLegendButtonPress.bind(this),pressed:this.getShowLegend()});this._oPersonalizationButton=new c({icon:"sap-icon://action-settings",type:b.Transparent,text:this._oResBundle.getText("CHARTCONTAINER_PERSONALIZE"),tooltip:this._oResBundle.getText("CHARTCONTAINER_PERSONALIZE"),press:this._onPersonalizationButtonPress.bind(this)});this._oZoomInButton=new c({icon:"sap-icon://zoom-in",type:b.Transparent,text:this._oResBundle.getText("CHARTCONTAINER_ZOOMIN"),tooltip:this._oResBundle.getText("CHARTCONTAINER_ZOOMIN"),press:this._zoom.bind(this,true)});this._oZoomOutButton=new c({icon:"sap-icon://zoom-out",type:b.Transparent,text:this._oResBundle.getText("CHARTCONTAINER_ZOOMOUT"),tooltip:this._oResBundle.getText("CHARTCONTAINER_ZOOMOUT"),press:this._zoom.bind(this,false)});this._oChartSegmentedButton=new S({select:this._onChartSegmentButtonSelect.bind(this),width:"auto"});this._oChartTitle=new T();};j.prototype.onAfterRendering=function(){this._sResizeListenerId=R.register(this,this._performHeightChanges.bind(this));if(!D.system.desktop){D.resize.attachHandler(this._performHeightChanges,this);}if(this.getAutoAdjustHeight()||this.getFullScreen()){setTimeout(function(){var m=this._performHeightChanges.bind(this);if(typeof m==="string"||m instanceof String){m=this[m];}m.apply(this,[]);}.bind(this),500);}var s=this.getSelectedContent(),v=false,i;if(s){i=s.getContent();v=i&&i.getMetadata().getName()==="sap.viz.ui5.controls.VizFrame";}if(this.getEnableScroll()){this._oScrollEnablement=new f(this,this.getId()+"-wrapper",{horizontal:!v,vertical:!v});}this._bControlNotRendered=false;};j.prototype.onBeforeRendering=function(){if(this._sResizeListenerId){R.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}if(!D.system.desktop){D.resize.detachHandler(this._performHeightChanges,this);}if(this._bChartContentHasChanged||this._bControlNotRendered){this._chartChange();}var k=this._aCustomIcons;this._aCustomIcons=[];var m=this.getAggregation("customIcons");if(m&&m.length>0){for(var i=0;i<m.length;i++){this._addButtonToCustomIcons(m[i]);}}if(this._bControlNotRendered){if(!this.getToolbar()){this.setAggregation("toolbar",new O({design:"Transparent"}));}}this._adjustDisplay();this._destroyButtons(k);var s=this.getSelectedContent();if(s){var o=s.getContent();if(o&&o.attachRenderComplete){o.detachRenderComplete(this._checkZoomIcons,this);o.attachRenderComplete(this._checkZoomIcons,this);}}};j.prototype.exit=function(){if(this._oFullScreenButton){this._oFullScreenButton.destroy();this._oFullScreenButton=undefined;}if(this._oPopup){this._oPopup.destroy();this._oPopup=undefined;}if(this._oShowLegendButton){this._oShowLegendButton.destroy();this._oShowLegendButton=undefined;}if(this._oPersonalizationButton){this._oPersonalizationButton.destroy();this._oPersonalizationButton=undefined;}if(this._oActiveChartButton){this._oActiveChartButton.destroy();this._oActiveChartButton=undefined;}if(this._oChartSegmentedButton){this._oChartSegmentedButton.destroy();this._oChartSegmentedButton=undefined;}if(this._oSelectedContent){this._oSelectedContent.destroy();this._oSelectedContent=undefined;}if(this._oToolBar){this._oToolBar.destroy();this._oToolBar=undefined;}if(this._oToolbarSpacer){this._oToolbarSpacer.destroy();this._oToolbarSpacer=undefined;}if(this._aDimensionSelectors){for(var i=0;i<this._aDimensionSelectors.length;i++){if(this._aDimensionSelectors[i]){this._aDimensionSelectors[i].destroy();}}this._aDimensionSelectors=undefined;}if(this._oScrollEnablement){this._oScrollEnablement.destroy();this._oScrollEnablement=undefined;}if(this._sResizeListenerId){R.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}if(!D.system.desktop){D.resize.detachHandler(this._performHeightChanges,this);}if(this._oZoomInButton){this._oZoomInButton.destroy();this._oZoomInButton=undefined;}if(this._oZoomOutButton){this._oZoomOutButton.destroy();this._oZoomOutButton=undefined;}};j.prototype._onButtonIconPress=function(E){var s=E.getSource().getCustomData()[0].getValue();this._switchChart(s);};j.prototype._onFullScreenButtonPress=function(E){if(E.getParameter("pressed")===true){this._oFullScreenButton.setTooltip(this._oResBundle.getText("CHARTCONTAINER_FULLSCREEN_CLOSE"));this._oFullScreenButton.setIcon("sap-icon://exit-full-screen");}else{this._oFullScreenButton.setTooltip(this._oResBundle.getText("CHARTCONTAINER_FULLSCREEN"));this._oFullScreenButton.setIcon("sap-icon://full-screen");}this._bSegmentedButtonSaveSelectState=true;this._toggleFullScreen();this._oFullScreenButton.focus();};j.prototype._onShowLegendButtonPress=function(E){this._bSegmentedButtonSaveSelectState=true;this._onLegendButtonPress();};j.prototype._onChartSegmentButtonSelect=function(E){var s=E.getParameter("button").getCustomData()[0].getValue();this._bSegmentedButtonSaveSelectState=true;this._switchChart(s);};j.prototype._onOverflowToolbarButtonPress=function(E,i){i.icon.firePress({controlReference:E.getSource()});};j.prototype._onLegendButtonPress=function(){var s=this.getSelectedContent();if(s){var i=s.getContent();if(q.isFunction(i.getLegendVisible)){var k=i.getLegendVisible();i.setLegendVisible(!k);this.setShowLegend(!k);}else{this.setShowLegend(!this.getShowLegend());}}else{this.setShowLegend(!this.getShowLegend());}};j.prototype._checkZoomIcons=function(E){if(E.getSource()._getZoomInfo){var z=E.getSource()._getZoomInfo();if(z){this._manageZoomIcons(z.currentZoomLevel);}}};j.prototype._onPersonalizationButtonPress=function(){this.firePersonalizationPress();};j.prototype._setSelectedContent=function(s){var i;if(this.getSelectedContent()===s){return this;}if(s===null){this._oShowLegendButton.setVisible(false);return this;}var o=s.getContent();this._toggleShowLegendButtons(o);i=o&&o.getMetadata&&o.getMetadata().getName()==="sap.viz.ui5.controls.VizFrame";var k=i||q.isFunction(o.setLegendVisible);if(this.getShowLegendButton()){this._oShowLegendButton.setVisible(k);}var m=this.getShowZoom()&&D.system.desktop&&i;this._oZoomInButton.setVisible(m);this._oZoomOutButton.setVisible(m);this._oSelectedContent=s;return this;};j.prototype._getSelectionDetails=function(){var o=this.getSelectedContent();return o&&o._getSelectionDetails();};j.prototype._toggleShowLegendButtons=function(k){var s=k.getId();var r=null;for(var i=0;!r&&i<this._aUsedContentIcons.length;i++){if(this._aUsedContentIcons[i].getCustomData()[0].getValue()===s&&k.getVisible()===true){r=this._aUsedContentIcons[i];this._oChartSegmentedButton.setSelectedButton(r);break;}}};j.prototype._setDefaultOnSegmentedButton=function(){if(!this._bSegmentedButtonSaveSelectState){this._oChartSegmentedButton.setSelectedButton(null);}this._bSegmentedButtonSaveSelectState=false;};j.prototype._toggleFullScreen=function(){var F=this.getProperty("fullScreen");if(F){var k=this.getAggregation("content");this._closeFullScreen();this.setProperty("fullScreen",false,true);this._oFullScreenButton.setIcon("sap-icon://full-screen");this._oFullScreenButton.setTooltip(this._oResBundle.getText("CHARTCONTAINER_FULLSCREEN"));this._oFullScreenButton.setPressed(false);var o;var H;for(var i=0;i<k.length;i++){o=k[i].getContent();o.setWidth("100%");H=this._mOriginalVizFrameHeights[o.getId()];if(H){o.setHeight(H);}}this.invalidate();}else{this._openFullScreen();this.setProperty("fullScreen",true,true);this._oFullScreenButton.setIcon("sap-icon://exit-full-screen");this._oFullScreenButton.setTooltip(this._oResBundle.getText("CHARTCONTAINER_FULLSCREEN_CLOSE"));this._oFullScreenButton.setPressed(true);}};j.prototype._openFullScreen=function(){var i=P.Dock;this.$content=this.$();if(this.$content){this.$tempNode=q("<div></div>");this.$content.before(this.$tempNode);this._$overlay=q("<div id='"+u()+"'></div>");this._$overlay.addClass("sapSuiteUiCommonsChartContainerOverlay");this._$overlay.addClass("sapSuiteUiCommonsChartContainerChartArea");this._$overlay.append(this.$content);this._oPopup.setContent(this._$overlay);}else{q.sap.log.warn("Overlay: content does not exist or contains more than one child");}this._oPopup.open(200,i.BeginTop,i.BeginTop,q("body"));if(!D.system.desktop){setTimeout(function(){var m=this._performHeightChanges.bind(this);if(typeof m==="string"||m instanceof String){m=this[m];}m.apply(this,[]);}.bind(this),500);}};j.prototype._closeFullScreen=function(){if(this._oScrollEnablement){this._oScrollEnablement.destroy();this._oScrollEnablement=null;}this.$tempNode.replaceWith(this.$content);this._oToolBar.setDesign(M.ToolbarDesign.Auto);this._oPopup.close();this._$overlay.remove();};j.prototype._performHeightChanges=function(){var t,v;if(this.getAutoAdjustHeight()||this.getFullScreen()){var $=this.$(),s,i,I;t=$.find(".sapSuiteUiCommonsChartContainerToolBarArea :first");v=$.find(".sapSuiteUiCommonsChartContainerChartArea :first");s=this.getSelectedContent();if(t[0]&&v[0]&&s){var k=$.height();var m=t.height();var n=Math.round(parseFloat(t.css("borderBottomWidth")));var N=k-m-n;var E=v.height();i=s.getContent();if(i){I=i.getMetadata().getName();if(I==="sap.viz.ui5.controls.VizFrame"||I==="sap.chart.Chart"){if(N>0&&N!==E){this._rememberOriginalHeight(i);i.setHeight(N+"px");}}else if(i.$().innerWidth()!==this.$("chartArea").innerWidth()){this.rerender();}}}}};j.prototype._rememberOriginalHeight=function(i){var H;if(q.isFunction(i.getHeight)){H=i.getHeight();}else{H=0;}this._mOriginalVizFrameHeights[i.getId()]=H;};j.prototype._switchChart=function(i){var o=this._findChartById(i);this._setSelectedContent(o);this.fireContentChange({selectedItemId:i});this.rerender();};j.prototype._chartChange=function(){var k=this.getContent();this._destroyButtons(this._aUsedContentIcons);this._aUsedContentIcons=[];if(this.getContent().length===0){this._oChartSegmentedButton.removeAllButtons();this._setDefaultOnSegmentedButton();this.switchChart(null);}if(k){var s=this.getShowLegend();var I;var o;for(var i=0;i<k.length;i++){if(!k[i].getVisible()){continue;}I=k[i].getContent();if(q.isFunction(I.setVizProperties)){I.setVizProperties({legend:{visible:s},sizeLegend:{visible:s}});}if(q.isFunction(I.setWidth)){I.setWidth("100%");}if(q.isFunction(I.setHeight)&&this._mOriginalVizFrameHeights[I.getId()]){I.setHeight(this._mOriginalVizFrameHeights[I.getId()]);}o=new B({icon:k[i].getIcon(),type:b.Transparent,tooltip:k[i].getTitle(),customData:[new e({key:'chartId',value:I.getId()})],press:this._onButtonIconPress.bind(this)});this._aUsedContentIcons.push(o);if(i===0){this._setSelectedContent(k[i]);this._oActiveChartButton=o;}}}this._bChartContentHasChanged=false;};j.prototype._findChartById=function(k){var o=this.getAggregation("content");if(o){for(var i=0;i<o.length;i++){if(o[i].getContent().getId()===k){return o[i];}}}return null;};j.prototype._getToolbarPlaceHolderPosition=function(t){var o;for(var i=0;i<t.getContent().length;i++){o=t.getContent()[i];if(o.getMetadata&&o.getMetadata().getName()==="sap.suite.ui.commons.ChartContainerToolbarPlaceholder"){return i;}}return-1;};j.prototype._addContentToolbar=function(i,p){if(!this._bHasApplicationToolbar){if(!p){this._oToolBar.addContent(i);}else{this._oToolBar.insertContent(i,p);}}else{if(i instanceof d){this._iPlaceholderPosition=this._getToolbarPlaceHolderPosition(this._oToolBar);return;}if(p){this._iPlaceholderPosition=this._iPlaceholderPosition+p;}this._oToolBar.insertAggregation("content",i,this._iPlaceholderPosition,true);this._iPlaceholderPosition=this._iPlaceholderPosition+1;}};j.prototype._rearrangeToolbar=function(){var t=this._aToolbarContent.length;for(var i=0;i<t;i++){this._oToolBar.insertContent(this._aToolbarContent[i],i);}};j.prototype._adjustIconsDisplay=function(){if(this.getShowSelectionDetails()){this._addContentToolbar(this._getSelectionDetails());}if(this.getShowLegendButton()){this._addContentToolbar(this._oShowLegendButton);}if(this.getShowZoom()&&D.system.desktop){this._addContentToolbar(this._oZoomInButton);this._addContentToolbar(this._oZoomOutButton);}if(this.getShowPersonalization()){this._addContentToolbar(this._oPersonalizationButton);}if(this.getShowFullScreen()){this._addContentToolbar(this._oFullScreenButton);}var i=0;for(i;i<this._aCustomIcons.length;i++){this._addContentToolbar(this._aCustomIcons[i]);}if(!this._bControlNotRendered){this._oChartSegmentedButton.removeAllButtons();}var I=this._aUsedContentIcons.length;if(I>1){for(i=0;i<I;i++){this._oChartSegmentedButton.addButton(this._aUsedContentIcons[i]);}this._addContentToolbar(this._oChartSegmentedButton);}};j.prototype._adjustSelectorDisplay=function(){if(this._aDimensionSelectors.length===0){this._oChartTitle.setVisible(true);this._addContentToolbar(this._oChartTitle);return;}for(var i=0;i<this._aDimensionSelectors.length;i++){if(q.isFunction(this._aDimensionSelectors[i].setAutoAdjustWidth)){this._aDimensionSelectors[i].setAutoAdjustWidth(true);}this._addContentToolbar(this._aDimensionSelectors[i]);}};j.prototype._adjustDisplay=function(){this._oToolBar=this.getToolbar();if(this._oToolbarSpacer){this._oToolBar.removeContent(this._oToolbarSpacer);this._oToolbarSpacer.destroy();}this._oToolBar.removeAllContent();this._oToolBar.setProperty("height","3rem",true);if(this._bHasApplicationToolbar){this._rearrangeToolbar();this._iPlaceholderPosition=0;}this._adjustSelectorDisplay();this._oToolbarSpacer=new d();this._addContentToolbar(this._oToolbarSpacer);this._adjustIconsDisplay();};j.prototype._addButtonToCustomIcons=function(i){var I=i;var s=I.getTooltip();var o=new c({icon:I.getSrc(),text:s,tooltip:s,type:b.Transparent,visible:I.getVisible(),press:[{icon:I},this._onOverflowToolbarButtonPress.bind(this)]});this._aCustomIcons.push(o);};j.prototype._zoom=function(z){var o=this.getSelectedContent().getContent();if(o.getMetadata().getName()==="sap.viz.ui5.controls.VizFrame"){if(z){o.zoom({"direction":"in"});}else{o.zoom({"direction":"out"});}}if(z){this.fireCustomZoomInPress();}else{this.fireCustomZoomOutPress();}this._manageZoomIcons(o._getZoomInfo().currentZoomLevel);};j.prototype._manageZoomIcons=function(z){if(z===undefined){return;}else if(z===null){this._oZoomOutButton.setEnabled(false);this._oZoomInButton.setEnabled(false);}else if(z===0){this._oZoomOutButton.setEnabled(false);this._oZoomInButton.setEnabled(true);}else if(z===1){this._oZoomInButton.setEnabled(false);this._oZoomOutButton.setEnabled(true);}else{if(this._oZoomOutButton.getEnabled()==false){this._oZoomOutButton.setEnabled(true);}if(this._oZoomInButton.getEnabled()==false){this._oZoomInButton.setEnabled(true);}}};j.prototype._destroyButtons=function(k){for(var i=0;i<k.length;i++){k[i].destroy();}};j.prototype._setShowLegendForAllCharts=function(s){var k=this.getContent();var I;for(var i=0;i<k.length;i++){I=k[i].getContent();if(q.isFunction(I.setLegendVisible)){I.setLegendVisible(s);}else{L.info("ChartContainer: chart with id "+I.getId()+" is missing the setVizProperties property");}}};j.prototype.setFullScreen=function(i){if(this._bControlNotRendered){return this;}if(this.getFullScreen()===i){return this;}if(this.getProperty("fullScreen")!==i){this._toggleFullScreen();}return this;};j.prototype.setTitle=function(t){if(this.getTitle()===t){return this;}this._oChartTitle.setText(t);this.setProperty("title",t,true);return this;};j.prototype.setShowLegendButton=function(s){if(this.getShowLegendButton()===s){return this;}this.setProperty("showLegendButton",s,true);if(!this.getShowLegendButton()){this.setShowLegend(false);}return this;};j.prototype.setSelectorGroupLabel=function(s){if(this.getSelectorGroupLabel()===s){return this;}this.setProperty("selectorGroupLabel",s,true);return this;};j.prototype.setShowLegend=function(s){if(this.getShowLegend()===s){return this;}this.setProperty("showLegend",s,true);this._setShowLegendForAllCharts(s);return this;};j.prototype.setWrapLabels=function(i){var s;if(this.getWrapLabels()!==i){this.setProperty("wrapLabels",i);s=this._getSelectionDetails();if(s){s.setWrapLabels(i);}}return this;};j.prototype.setToolbar=function(t){if(!t||this._getToolbarPlaceHolderPosition(t)===-1){L.info("A placeholder of type 'sap.suite.ui.commons.ChartContainerToolbarPlaceholder' needs to be provided. Otherwise, the toolbar will be ignored");return this;}if(this.getToolbar()!==t){this.setAggregation("toolbar",t);}if(this.getToolbar()){this._aToolbarContent=this.getToolbar().getContent();this._bHasApplicationToolbar=true;}else{this._aToolbarContent=null;this._bHasApplicationToolbar=false;}this.invalidate();return this;};j.prototype.getDimensionSelectors=function(){return this._aDimensionSelectors;};j.prototype.indexOfDimensionSelector=function(k){for(var i=0;i<this._aDimensionSelectors.length;i++){if(this._aDimensionSelectors[i]===k){return i;}}return-1;};j.prototype.addDimensionSelector=function(i){this._aDimensionSelectors.push(i);return this;};j.prototype.insertDimensionSelector=function(k,m){if(!k){return this;}var i;if(m<0){i=0;}else if(m>this._aDimensionSelectors.length){i=this._aDimensionSelectors.length;}else{i=m;}if(i!==m){L.warning("ManagedObject.insertAggregation: index '"+m+"' out of range [0,"+this._aDimensionSelectors.length+"], forced to "+i);}this._aDimensionSelectors.splice(i,0,k);return this;};j.prototype.destroyDimensionSelectors=function(){if(this._oToolBar){for(var i=0;i<this._aDimensionSelectors.length;i++){if(this._aDimensionSelectors[i]){this._oToolBar.removeContent(this._aDimensionSelectors[i]);this._aDimensionSelectors[i].destroy();}}}this._aDimensionSelectors=[];return this;};j.prototype.removeDimensionSelector=function(i){if(!i){return null;}if(this._oToolBar){this._oToolBar.removeContent(i);}var k=this.indexOfDimensionSelector(i);if(k===-1){return null;}else{return this._aDimensionSelectors.splice(k,1)[0];}};j.prototype.removeAllDimensionSelectors=function(){var k=this._aDimensionSelectors.slice();if(this._oToolBar){for(var i=0;i<this._aDimensionSelectors.length;i++){if(this._aDimensionSelectors[i]){this._oToolBar.removeContent(this._aDimensionSelectors[i]);}}}this._aDimensionSelectors=[];return k;};j.prototype.addContent=function(i){this.addAggregation("content",i);this._bChartContentHasChanged=true;return this;};j.prototype.insertContent=function(i,k){this.insertAggregation("content",i,k);this._bChartContentHasChanged=true;return this;};j.prototype.updateContent=function(){this.updateAggregation("content");this._bChartContentHasChanged=true;};j.prototype.addAggregation=function(i,o,s){if(i==="dimensionSelectors"){return this.addDimensionSelector(o);}else{return a.prototype.addAggregation.apply(this,arguments);}};j.prototype.getAggregation=function(i,k){if(i==="dimensionSelectors"){return this.getDimensionSelectors();}else{return a.prototype.getAggregation.apply(this,arguments);}};j.prototype.indexOfAggregation=function(i,o){if(i==="dimensionSelectors"){return this.indexOfDimensionSelector(o);}else{return a.prototype.indexOfAggregation.apply(this,arguments);}};j.prototype.insertAggregation=function(i,o,k,s){if(i==="dimensionSelectors"){return this.insertDimensionSelector(o,k);}else{return a.prototype.insertAggregation.apply(this,arguments);}};j.prototype.destroyAggregation=function(i,s){if(i==="dimensionSelectors"){return this.destroyDimensionSelectors();}else{return a.prototype.destroyAggregation.apply(this,arguments);}};j.prototype.removeAggregation=function(i,o,s){if(i==="dimensionSelectors"){return this.removeDimensionSelector(o);}else{return a.prototype.removeAggregation.apply(this,arguments);}};j.prototype.removeAllAggregation=function(i,s){if(i==="dimensionSelectors"){return this.removeAllDimensionSelectors();}else{return a.prototype.removeAllAggregation.apply(this,arguments);}};j.prototype.getSelectedContent=function(){return this._oSelectedContent;};j.prototype.getScrollDelegate=function(){return this._oScrollEnablement;};j.prototype.switchChart=function(i){this._setSelectedContent(i);this.rerender();};j.prototype.updateChartContainer=function(){this._bChartContentHasChanged=true;this.rerender();return this;};j.prototype.setWidth=function(v){this.setProperty("width",v,true);this.$().css("width",this.getWidth());return this;};return j;});
