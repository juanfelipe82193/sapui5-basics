/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define(['sap/apf/ui/utils/helper','sap/apf/core/constants','sap/ui/core/mvc/Controller','sap/apf/ui/utils/constants','sap/suite/ui/commons/ChartContainerContent','sap/suite/ui/commons/ChartContainerToolbarPlaceholder','sap/ui/core/Icon','sap/ui/core/CustomData','sap/m/Link','sap/m/ToggleButton','sap/m/Label','sap/m/Button','sap/m/ToolbarSpacer','sap/m/List','sap/m/ListMode','sap/m/ListSeparators','sap/m/StandardListItem','sap/m/Popover','sap/m/PlacementType','sap/apf/utils/trace'],function(H,C,B,a,b,c,I,d,L,T,e,f,g,h,k,l,S,P,m,t){"use strict";var o,u,A,r=false;function _(){var i=A.getSelectedRepresentation();return(i.type===a.representationTypes.TABLE_REPRESENTATION);}function n(){var i=A.getSelectedRepresentation();return(i.type===a.representationTypes.TREE_TABLE_REPRESENTATION);}function p(){if(A.getSelectedRepresentation().bIsAlternateView===undefined||A.getSelectedRepresentation().bIsAlternateView===false){return false;}return true;}function q(i){var j=i.getCurrentRepresentation();var U=j.getParameter().requiredFilters;if(U===undefined||U.length===0){return undefined;}return U[0];}function s(i,j){var U=i.byId("idChartContainer");var V="0";var W=jQuery(window).width();var X=U.getId();if(jQuery("#"+X).length!==0){V=jQuery("#"+X+" > div:first-child > div:nth-child(2)").offset().top;W=jQuery("#"+X+" > div:first-child > div:nth-child(2)").width();}var Y=(jQuery(window).height()-V)-jQuery(".applicationFooter").height();var Z=W;j.setHeight(Y+"px");j.setWidth(Z+"px");}function v(i){t.logCall("StepContainer._setChartContainerContent");var j=i.byId("idChartContainer");var U=i.getCurrentRepresentation();var V=A.longTitle&&!o.isInitialTextKey(A.longTitle.key)?A.longTitle:A.title;var W=o.getTextNotHtmlEncoded(V);t.log("_setChartContainerContent"," title=",W);var X=U.getMainContent(W);var Y={onBeforeRendering:function(){s(i,X);}};X.addEventDelegate(Y);j.removeAllContent();var Z=new b({content:X});j.addContent(Z);t.logReturn("_setChartContainerContent");}function w(i,j){var U=i.byId("idSelectedText");var V=i.getCurrentRepresentation();var W=O(i);var X=V.getSelectionFilterLabel();var Y=X+" ("+W+") ";var Z=i.byId("idSelPropertyAndCount");if(!Z){Z=new L({id:i.createId("idSelPropertyAndCount"),press:i.handlePressSelectedPropertyCountLink.bind(i)});Z.addAriaLabelledBy(U.getId());}else{if(Z&&(V.chart!==undefined)&&(V.chart!==null&&V.chart.setFocusOnSelectLink)){V.chart.detachEvent("setFocusOnSelectedLinkEvent",V.chart.setFocusOnSelectLink);}}if(Z&&(V.chart!==undefined)&&(V.chart!==null)){V.chart.setFocusOnSelectLink=function(){Z.focus();};}Z.setVisible(true);Z.setText(Y);j.addContent(Z);j.onAfterRendering=function(){if(Z&&(V.chart!==undefined)&&(V.chart!==null)){V.chart.fireEvent("setFocusOnSelectedLinkEvent");V.chart.detachEvent("setFocusOnSelectedLinkEvent",V.chart.setFocusOnSelectLink);}};}function x(i){var j=i.byId("idChartContainer");j.removeAllCustomIcons();y(i);z(i);D(i);}function y(j){var U=j.byId("idChartContainer");var V=A.getSelectedRepresentationInfo();var W;if(V.parameter&&V.parameter.orderby){var X=V.parameter.orderby;new H(o).getRepresentationSortInfo(V).done(function($){for(var i=0;i<$.length;i++){W=X[0].property;}var a1=(X[0].ascending==true)?"Sort Order: Ascending":"Sort Order: Descending";var Y=o.getTextNotHtmlEncoded(V.label)+"\n"+((W!==undefined)?o.getTextNotHtmlEncoded("sortBy")+": "+W:"")+"\n"+a1;var Z=new I({src:V.picture,tooltip:Y,press:function(b1){j.handlePressChartIcon(b1);}});U.addCustomIcon(Z);});}else{var Y=o.getTextNotHtmlEncoded(V.label)+"\n"+((W!==undefined)?o.getTextNotHtmlEncoded("sortBy")+": "+W:"");var Z=new I({src:V.picture,tooltip:Y,press:function(i){j.handlePressChartIcon(i);}});U.addCustomIcon(Z);}}function z(i){var j=i.byId("idChartContainer");var U=o.getTextNotHtmlEncoded("listView");var V=new sap.ui.core.Icon({src:"sap-icon://table-view",tooltip:U,press:i.handlePressAlternateRepIcon.bind(i)});var W=i.getCurrentRepresentation();var X=W.type;if(_()||n()||X=="TableRepresentation"){j.removeCustomIcon(V);return;}j.addCustomIcon(V);}function D(i){if((i.getCurrentRepresentation().topN!==undefined)||(!p()&&!_())||(n())){return;}var j=i.byId("idChartContainer");var U=o.getTextNotHtmlEncoded("view-Settings-Button");var V=new I({src:"sap-icon://drop-down-list",tooltip:U,press:function(){i.getCurrentRepresentation().getViewSettingDialog().open();}});j.addCustomIcon(V);}function E(i,j){var U=i.byId("idSelectedText");if(!U){U=new e({id:i.createId("idSelectedText"),text:o.getTextNotHtmlEncoded("selectedValue")});}U.setVisible(true);j.addContent(U);}function F(i,j){var U=i.byId("idReset");if(!U){U=new f({text:o.getTextNotHtmlEncoded("reset"),id:i.createId("idReset"),type:"Transparent",press:i.handlePressResetButton.bind(i)}).addStyleClass("chartContainerResetStyle");}U.setVisible(true);j.addContent(U);}function G(i,j){var U=O(i);if(U>0&&q(i)!==undefined){E(i,j);w(i,j);F(i,j);}}function J(i,j){var U=i.byId("idPathFilterDisplayButton");if(!U){U=new f({text:o.getTextNotHtmlEncoded("pathFilterDisplayButton"),id:i.createId("idPathFilterDisplayButton"),icon:"sap-icon://message-information",type:"Transparent",press:function(){if(i.byId("idStepLayout").getBusy()===false){o.getPathFilterInformation().then(function(V){var W=new sap.ui.xmlview({viewName:"sap.apf.ui.reuse.view.pathFilterDisplay",viewData:{pathFilterInformation:V,oCoreApi:o,oUiApi:u},id:i.createId("pathFilterDisplay")});W.setParent(i.getView());W.getContent()[0].open();});}}});}j.addContent(U);}function K(i,j){var U=i.getCurrentRepresentation();var V=U.type;var W=undefined;var X=false;if(V!=="TableRepresentation"&&V!=="listView"&&V!=="TreeTableRepresentation"){if(U.chart!==undefined){if(Object.getOwnPropertyNames(U.chart).length!==0){W=U.chart.vizSelection();X=U.chart.getVizProperties().plotArea.dataLabel.visible;}}if(U!==undefined){if(U.aDataResponse!==0){var Y=i.byId("idToggleDisplayButton");if(!Y){Y=new sap.m.ToggleButton({id:i.createId("idToggleDisplayButton"),pressed:false,text:o.getTextNotHtmlEncoded("values"),tooltip:o.getTextNotHtmlEncoded("displayValues"),press:i.handleToggleDisplay.bind(i)});}else{U=i.getCurrentRepresentation();Y.setPressed(X);}if(W!==undefined){i.getCurrentRepresentation().chart.vizSelection(W,{clearSelection:false});}j.addContent(Y);}}}}function M(i){var j=i.byId("idChartContainer");var U=j.getToolbar();U.removeAllContent();var V=new e({text:o.getTextNotHtmlEncoded("currentStep")});U.addContent(V);var W=new g();U.addContent(W);K(i,U);G(i,U);J(i,U);U.addContent(new c());j.setToolbar(U);}function N(i,A,j){t.logCall("StepContainer._drawChartContainer",", isActiveStep=",j,", oActiveStep=",A);if(A!==undefined){v(i);x(i);M(i);}t.logReturn("_drawChartContainer");}function O(i){var j=i.getCurrentRepresentation();var U=j.getSelections().length;return U;}function Q(U,V){var W=new h({mode:k.SingleSelectMaster,showSeparators:l.None,includeItemInSelection:true,selectionChange:U.handleSelectionChartSwitchIcon.bind(U)});var X;var Y;for(var j=0;j<A.getRepresentationInfo().length;j++){Y=A.getRepresentationInfo()[j];X=undefined;if(Y.parameter&&Y.parameter.orderby){new H(o).getRepresentationSortInfo(Y).done(function(b1){var c1=[];for(var i=0;i<b1.length;i++){b1[i].done(function(d1){c1.push(d1);});}X=c1.join(", ");var Z=X!==undefined?o.getTextNotHtmlEncoded("sortBy")+": "+X:"";var $=new S({description:Z,icon:Y.picture,title:o.getTextNotHtmlEncoded(Y.label),customData:[new d({key:'data',value:{oRepresentationType:Y,icon:Y.picture}})]});W.addItem($);});}else{var Z=X!==undefined?o.getTextNotHtmlEncoded("sortBy")+": "+X:"";var $=new S({description:Z,icon:Y.picture,title:o.getTextNotHtmlEncoded(Y.label),customData:[new d({key:'data',value:{oRepresentationType:Y,icon:Y.picture}})]});W.addItem($);}}if(!U.byId("idAllChartPopover")){var a1=new P({id:U.createId("idAllChartPopover"),placement:m.Bottom,showHeader:false,content:[W],afterClose:function(){a1.destroy();}});}U.byId("idAllChartPopover").openBy(V);}function R(i,j){i.byId("idReset").setVisible(j);i.byId("idSelPropertyAndCount").setVisible(j);i.byId("idSelectedText").setVisible(j);}return B.extend("sap.apf.ui.reuse.controller.stepContainer",{onInit:function(){var i=this;o=i.getView().getViewData().oCoreApi;u=i.getView().getViewData().uiApi;A=o.getActiveStep();this.initialText=new e({id:this.createId("idInitialText")}).addStyleClass('initialText');this.initialText.setText(o.getTextNotHtmlEncoded('initialText'));},onAfterRendering:function(){var i=this;jQuery(window).resize(function(){var j=90;o.getSmartFilterBarConfigurationAsPromise().done(function(U){if(U){j=165;}var V=jQuery(window).height()-j;jQuery('.layoutView').css({"height":V});i.drawStepContent();});});jQuery(u.getStepContainer().getDomRef()).hide();if(jQuery("#"+this.initialText.getId()).length===0&&o.getSteps().length===0){jQuery('#'+u.getStepContainer().getId()).parent().append(sap.ui.getCore().getRenderManager().getHTML(this.initialText));}else if(o.getSteps().length>0){jQuery(u.getStepContainer().getDomRef()).show();}if(u.getAnalysisPath().getController().isOpenPath){jQuery(".initialText").remove();}},getCurrentRepresentation:function(){var i=A.getSelectedRepresentation();if(p()){i=A.getSelectedRepresentation().toggleInstance;}return i;},handlePressSelectedPropertyCountLink:function(){var i=this;i.oCoreApi=o;var j=new sap.ui.jsfragment("idSelectionDisplayFragment","sap.apf.ui.reuse.fragment.selectionDisplay",i);j.open();},handleToggleDisplay:function(){var i=this;i.oCoreApi=o;var j=i.getCurrentRepresentation();var U=i.byId("idToggleDisplayButton");if(j.measures!==undefined){var V=j.getFormatStringForMeasure(j.measures[0]);if(j.type==="PieChart"){j.chart.setVizProperties({plotArea:{dataLabel:{visible:U.getPressed(),type:"percentage"}}});}else{j.chart.setVizProperties({plotArea:{dataLabel:{visible:U.getPressed(),formatString:V}}});}return j.chart.getVizProperties().plotArea.dataLabel.visible;}var W=j.chartPlotArea.plotArea.dataLabel.visible;W=U.getPressed();return W;},handlePressResetButton:function(){var i=this;if(p()){i.getCurrentRepresentation().removeAllSelection();}i.getCurrentRepresentation().removeAllSelection();R(i,false);},createToggleRepresentationInstance:function(j,U){var V={};function W($){var a1=$.dimensions;var Z=j.getMetaData();$.isAlternateRepresentation=true;if(Z===undefined){return $;}var i,b1;for(i=0;i<a1.length;i++){var c1=Z.getPropertyMetadata(a1[i].fieldName).hasOwnProperty('text');if(c1&&a1[i].labelDisplayOption===C.representationMetadata.labelDisplayOptions.KEY_AND_TEXT){b1={};b1.fieldName=Z.getPropertyMetadata(a1[i].fieldName).text;$.dimensions.splice(i+1,0,b1);}else if(c1&&a1[i].labelDisplayOption===C.representationMetadata.labelDisplayOptions.TEXT){b1={};b1.fieldName=Z.getPropertyMetadata(a1[i].fieldName).text;$.dimensions.splice(i,1,b1);}}return $;}var X=jQuery.extend(true,{},j.getParameter());delete X.alternateRepresentationTypeId;delete X.alternateRepresentationType;X=W(X);if(U){X.orderby=U;}V=o.createRepresentation(j.getParameter().alternateRepresentationType.constructor,X);var Y=j.getData(),Z=j.getMetaData();if(Y!==undefined&&Z!==undefined){V.setData(Y,Z);}return V;},handlePressAlternateRepIcon:function(){var i=this;var j=A.getSelectedRepresentation();j.bIsAlternateView=true;if(p()){j.toggleInstance=i.createToggleRepresentationInstance(j);}r=true;i.getView().getViewData().uiApi.selectionChanged(true);},handlePressChartIcon:function(i){var j=this;var U=A.getSelectedRepresentation();var V=o.getSteps().indexOf(A);var W=null;if(A.getRepresentationInfo().length>1){W=i.getParameter("controlReference");Q(j,W);}else{U.bIsAlternateView=false;r=true;U.createDataset();j.drawStepContent();u.getAnalysisPath().getController().updateCustomListView(A,V,false);}},handleSelectionChartSwitchIcon:function(i){this.byId("idAllChartPopover").close();var j=A.getSelectedRepresentation();var U=i.getParameter("listItem").getCustomData()[0].getValue();var V=A.getSelectedRepresentationInfo().representationId;var W=U.oRepresentationType.representationId;if(V===W&&j.bIsAlternateView===false){return;}r=true;j.bIsAlternateView=false;A.setSelectedRepresentation(U.oRepresentationType.representationId);u.getAnalysisPath().getController().refresh(U.nActiveStepIndex);o.updatePath(u.getAnalysisPath().getController().callBackForUpdatePath.bind(u.getAnalysisPath().getController()));j.createDataset();},drawStepContent:function(i,j){t.logCall("StepContainer.drawStepContent"," bStepUpdated="+i);var U=this;var V=false;var W=A;A=o.getActiveStep();if(A===undefined){t.logReturn("drawStepContent",", the active step === undefined");return;}if(W!==A){V=true;}if(i||r||V){N(U,A,j);}else{M(U);}r=false;U.byId("idStepLayout").setBusy(false);t.logReturn("drawStepContent",", bIsActiveStepChanged",V);}});},true);
