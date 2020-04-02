/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
(function(){"use strict";sap.ui.controller("sap.apf.ui.reuse.controller.layout",{onInit:function(){this.oCoreApi=this.getView().getViewData().oCoreApi;this.oUiApi=this.getView().getViewData().uiApi;this.oNavigationHandler=this.getView().getViewData().oNavigationHandler;var a;this.oCoreApi.getApplicationConfigProperties().done(function(b){if(b){a=b.appName;}this.applicationTitle=this.oCoreApi.getTextNotHtmlEncoded(a);this.getView().byId("applicationPage").setTitle(this.applicationTitle);this.loadLayout();}.bind(this));},loadLayout:function(){this.oCoreApi.getSmartFilterBarConfigurationAsPromise().done(function(s){if(sap.ui.Device.system.desktop){this.getView().addStyleClass("sapUiSizeCompact");}var c=this.oUiApi.getStepContainer();var a=this.oUiApi.getAnalysisPath();this.getView().byId("applicationPage").setTitle(this.applicationTitle);var o=90;if(s){o=165;}var w=jQuery(window).height()+50-o;jQuery('.layoutView').css({"height":w});this.getView().setHeight(w+"px");if(a.oCarousel){a.oCarousel.getContent()[0].setHeight(w-115+"px");}this.getView().byId("stepContainer").addContent(c);this.getView().byId("analysisPath").addContent(a);this.addOpenInButton();}.bind(this));},onAfterRendering:function(){var s=this;if(this.byId("detailFooter").getContentLeft().length===0){var S=new sap.m.Button({text:this.oCoreApi.getTextNotHtmlEncoded("showAnalyticalPath"),press:function(){s.getView().byId("applicationView").showMaster();},type:"Transparent"});this.getView().byId("applicationView").attachAfterMasterClose(function(){s.getView().byId("detailFooter").removeContentLeft(S);if(s.getView().byId("detailFooter").getContentLeft().length===0){s.addDetailFooterContentLeft(S);}});this.getView().byId("applicationView").attachAfterMasterOpen(function(){if(s.getView().byId('detailFooter')){s.getView().byId("detailFooter").removeAllContentLeft();}});if(this.getView().byId("applicationView").isMasterShown()===false){this.addDetailFooterContentLeft(S);}}},hideMaster:function(){if(sap.ui.Device.system.phone||sap.ui.Device.system.tablet){this.getView().byId("applicationView").hideMaster();if(sap.ui.Device.system.phone){this.getView().byId("applicationView").toDetail(this.getView().byId("stepContainer").getId());}}},showMaster:function(){this.getView().byId("applicationView").showMaster();},addMasterFooterContentLeft:function(c){this.getView().byId("masterFooter").addContentLeft(c);},addMasterFooterContentRight:function(c){if(this.getView().byId("masterFooter").getContentRight().length===0){this.getView().byId("masterFooter").insertContentRight(c);}else{this.addMasterFooterContent(c);}},addMasterFooterContent:function(c){var s=this;if(this.oActionListPopover===undefined){this.oActionListPopover=new sap.m.Popover({showHeader:false,placement:sap.m.PlacementType.Top});}if(typeof c.getWidth==="function"){c.setWidth("100%");}if(this.footerContentButton===undefined){this.getView().byId("masterFooter").getContentRight()[0].setWidth("71%");this.footerContentButton=new sap.m.Button({icon:"sap-icon://overflow",press:function(e){s.oActionListPopover.openBy(e.getSource());},type:"Transparent",tooltip:this.oCoreApi.getTextNotHtmlEncoded("moreIcon")});}this.oActionListPopover.addContent(c);this.getView().byId("masterFooter").insertContentRight(this.footerContentButton,1);},addDetailFooterContentLeft:function(c){this.getView().byId("detailFooter").addContentLeft(c);},addFacetFilter:function(f){this.getView().byId("subHeader").addContent(f);},enableDisableOpenIn:function(){var s=this;if(!s.openInBtn){return;}var r=false;var n=this.oNavigationHandler.getNavigationTargets();n.then(function(a){if(a.global.length===0&&a.stepSpecific.length===0){if(s.openInBtn.getEnabled()){r=true;s.openInBtn.setEnabled(false);}}else{if(!s.openInBtn.getEnabled()){r=true;s.openInBtn.setEnabled(true);}}if(r){s.openInBtn.rerender();}});},addOpenInButton:function(){var s=this;if(this.oNavListPopover===undefined){this.oNavListPopover=new sap.m.Popover({showHeader:false,placement:sap.m.PlacementType.Top});}this.openInBtn=new sap.m.Button({id:this.createId("idOpenInButton"),text:this.oCoreApi.getTextNotHtmlEncoded("openIn"),type:"Transparent",enabled:false,press:function(e){s.oNavTargetsView=sap.ui.view({viewName:"sap.apf.ui.reuse.view.navigationTarget",type:sap.ui.core.mvc.ViewType.JS,viewData:{oNavigationHandler:s.oNavigationHandler,oNavListPopover:s.oNavListPopover,oOpenInButtonEventSource:e.getSource(),oUiApi:s.oUiApi,oCoreApi:s.oCoreApi}});}});this.getView().byId("detailFooter").insertContentRight(this.openInBtn,1);this.enableDisableOpenIn();},doOkOnNavAnalysisPath:function(){var s=this;var t=this.oUiApi.getAnalysisPath().getToolbar();this.oCoreApi.readPaths(function(r,m,a){var S=true;var p=r.paths;if(m!==undefined){t.maxNumberOfSteps=m.getEntityTypeMetadata().maximumNumberOfSteps;t.maxNumberOfPaths=m.getEntityTypeMetadata().maxOccurs;}if(a===undefined&&(typeof r==="object")){t.getController().getSaveDialog(S,function(){window.history.go(-1);},p);}else{var M=s.oCoreApi.createMessageObject({code:"6005",aParameters:[]});M.setPrevious(a);s.oCoreApi.putMessage(M);}});},handleNavBack:function(){var s=this;if(s.oUiApi.getAnalysisPath().oSavedPathName.getTitle().slice(0,1)==="*"&&s.oCoreApi.getSteps().length!==0){var n=new sap.ui.jsfragment("sap.apf.ui.reuse.fragment.newMessageDialog",this);s.getView().byId("idYesButton").attachPress(function(){n.close();s.doOkOnNavAnalysisPath();});s.getView().byId("idNoButton").attachPress(function(){n.close();window.history.go(-1);});var c=new sap.m.Button(s.createId("idCancelButton"),{text:s.oCoreApi.getTextNotHtmlEncoded("cancel"),press:function(){n.close();}});n.addButton(c);if(sap.ui.Device.system.desktop){n.addStyleClass("sapUiSizeCompact");}n.setInitialFocus(n);n.open();}else{window.history.go(-1);}}});}());
