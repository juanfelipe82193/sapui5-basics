/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/documentation/sdk/controller/BaseController","sap/ui/model/json/JSONModel","sap/ui/documentation/sdk/controller/util/XML2JSONUtils","sap/ui/Device","sap/ui/documentation/sdk/util/ToggleFullScreenHandler"],function(q,B,J,X,D,T){"use strict";return B.extend("sap.ui.documentation.sdk.controller.TopicDetail",{onInit:function(){this.oPage=this.byId("topicDetailPage");this.oPage.addStyleClass('docuPage');if(!window.prettyPrint){q.sap.require("sap.ui.documentation.sdk.thirdparty.google-code-prettify.prettify");}this.getRouter().getRoute("topicId").attachPatternMatched(this._onTopicMatched,this);this._oConfig=this.getConfig();this.jsonDefModel=new J();this.getView().setModel(this.jsonDefModel);},onBeforeRendering:function(){D.orientation.detachHandler(this._onOrientationChange,this);},onAfterRendering:function(){D.orientation.attachHandler(this._onOrientationChange,this);},onExit:function(){D.orientation.detachHandler(this._onOrientationChange,this);},_onTopicMatched:function(e){var t=e.getParameter("arguments").id,a=this._oConfig.docuPath+t+(t.match(/\.html/)?"":".html"),h=q.sap.syncGetText(a).data,j;if(!h){setTimeout(function(){this.getRouter().myNavToWithoutHash("sap.ui.documentation.sdk.view.NotFound","XML",false);}.bind(this),0);return;}j=X.XML2JSON(h,this._oConfig);j.topicURL=a;j.iframeAttribute=D.os.name===D.os.OS.IOS?' scrolling="no" ':"";j.bIsPhone=D.system.phone;if(j.shortdesc){j.shortdesc=j.shortdesc.trim().replace(/(\r\n|\n|\r)/gm,' ');}this.jsonDefModel.setData(j);this._scrollContentToTop();setTimeout(window.prettyPrint,0);this.searchResultsButtonVisibilitySwitch(this.byId("topicDetailBackToSearch"));if(this.extHookonTopicMatched){this.extHookonTopicMatched(t);}},_scrollContentToTop:function(){if(this.oPage&&this.oPage.$().length>0){this.oPage.getScrollDelegate().scrollTo(0,1);}},_formatHTML:function(h){return'<div>'+h+'</div>';},backToSearch:function(t){this.onNavBack();},onToggleFullScreen:function(e){T.updateMode(e,this.getView(),this);}});});
