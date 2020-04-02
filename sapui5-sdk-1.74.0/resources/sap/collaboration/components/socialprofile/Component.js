/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['sap/collaboration/components/utils/CommonUtil','sap/ui/core/UIComponent','sap/m/library','jquery.sap.global','sap/ui/core/mvc/View','sap/ui/core/library','sap/m/Bar','sap/m/Text','sap/m/ResponsivePopover','sap/m/Button'],function(C,U,m,q,V,c,B,T,R,a){"use strict";var b=c.mvc.ViewType;var P=m.PlacementType;var d=U.extend("sap.collaboration.components.socialprofile.Component",{metadata:{version:"1.0",includes:["../resources/css/SocialProfile.css"],aggregations:{},properties:{placement:{type:"sap.m.PlacementType",group:"Misc",defaultValue:P.Auto},memberId:{type:"string",group:"Misc"},memberInfo:{type:"object",group:"Misc"},openingControl:{type:"object",group:"Misc"},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"380px"},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"300px"}}},_defaultAttributes:{collaborationHostServiceUrl:"/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData",smiServiceUrl:"/sap/opu/odata/sap/SM_INTEGRATION_V2_SRV"},init:function(){this._oCommonUtil=new C();this._oLangBundle=this._oCommonUtil.getLanguageBundle();this._sUserProfileURL;this._sCurrentUserEmail;},exit:function(){},onBeforeRendering:function(){},onAfterRendering:function(){},open:function(){try{this._logComponentProperties();this._validateInputParameters();this._createView();this._createSocialPopover();this._oPopover.openBy(this.getOpeningControl());}catch(e){q.sap.log.error(e.stack);this._oCommonUtil.displayError();}},setSettings:function(s){try{if(s){this.setPlacement(s.placement);this.setMemberId(s.memberId);this.setMemberInfo(s.memberInfo);this.setOpeningControl(s.openingControl);this.setHeight(s.height);this.setWidth(s.width);}else{throw new Error("Settings object is undefined");}}catch(e){q.sap.log.error(e.stack);this._oCommonUtil.displayError();}},_createView:function(){var t=this;if(!this._oPopoverView){this._oPopoverView=new sap.ui.view({id:this.getId()+"_PopoverView",viewData:{collaborationHostServiceUrl:this._defaultAttributes.collaborationHostServiceUrl,smiServiceUrl:this._defaultAttributes.smiServiceUrl,langBundle:this._oLangBundle,memberId:this.getMemberId(),memberInfo:this.getMemberInfo(),popoverPrefix:this.getId(),afterUserInfoRetrieved:function(u){if(u){t._sUserProfileURL=u.WebURL;var j=sap.ui.getCore().byId(t.getId()+"_JamButton");j.setEnabled(true);j.rerender();j.focus();}}},type:b.JS,viewName:"sap.collaboration.components.socialprofile.SocialProfile"});}else{this._oPopoverView.getViewData().memberId=this.getMemberId();this._oPopoverView.getViewData().memberInfo=this.getMemberInfo();}},_createSocialPopover:function(){var t=this;if(!this._oPopover){var h=new B(this.getId()+"_HeaderBar",{contentMiddle:new T({text:this._oLangBundle.getText("SP_TITLE")}).addStyleClass("popoverheader")});this._oPopover=new R(this.getId()+"_Popover",{placement:this.getPlacement(),showCloseButton:true,contentHeight:this.getHeight(),contentWidth:this.getWidth(),content:[this._oPopoverView],customHeader:h,beginButton:new a(this.getId()+"_JamButton",{text:this._oLangBundle.getText("SP_OPEN_JAM_BUTTON"),enabled:false,press:function(){window.open(t._sUserProfileURL,"_blank");}}),beforeOpen:function(){if(t._sCurrentUserEmail!==t.getMemberId()){sap.ui.getCore().byId(t.getId()+"_JamButton").setEnabled(false);}t._sCurrentUserEmail=t.getMemberId();}}).addStyleClass("popover");}if(this._oPopover.getPlacement()!==this.getPlacement()){this._oPopover.setPlacement(this.getPlacement());}if(this._oPopover.getContentHeight()!==this.getHeight()){this._oPopover.setContentHeight(this.getHeight());}if(this._oPopover.getContentWidth()!==this.getWidth()){this._oPopover.setContentWidth(this.getWidth());}},_logComponentProperties:function(){q.sap.log.debug("Social Profile Component properties:","","sap.collaboration.components.socialprofile.Component._logComponentProperties()");q.sap.log.debug("placement: "+this.getPlacement());q.sap.log.debug("memberId: "+this.getMemberId());q.sap.log.debug("openingControl: "+this.getOpeningControl());q.sap.log.debug("height: "+this.getHeight());q.sap.log.debug("width: "+this.getWidth());},_validateInputParameters:function(){if(!this.getMemberId()){throw new Error("MemberId is undefined");}if(!this.getOpeningControl()){throw new Error("Opening control is undefined");}}});return d;});
