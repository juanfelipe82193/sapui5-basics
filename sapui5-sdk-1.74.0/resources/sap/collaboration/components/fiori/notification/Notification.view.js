/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['./NotificationContainer','sap/collaboration/library','sap/ui/core/mvc/JSView','sap/m/Image','sap/m/Text','sap/m/VBox','sap/ui/core/library'],function(N,l,J,I,T,V,c){"use strict";var a=c.TextAlign;sap.ui.jsview("sap.collaboration.components.fiori.notification.Notification",{getControllerName:function(){return"sap.collaboration.components.fiori.notification.Notification";},createContent:function(C){this.sPrefixId=this.getViewData().controlId;this.oLangBundle=this.getViewData().langBundle;this.sStyleClassPrefix=this.getViewData().styleClassPrefix;this.iNumberOfNotifications=this.getViewData().numberOfNotifications;this.sNotificationsTargetURL=this.getViewData().notificationsTargetUrl;var o=this.createContainerBox();return o;},createContainerBox:function(){var s=this;this.aProfilePhotos=this.createProfilePhotos();this.oNotificationTypeText=this.createNotificationTypeText();this.oNotificationMessageText=this.createNotificationMessageText();var n=this.createNotificationUnreadCountVBox();var A=this.createNotificationAgeAndGroupVBox();var C=new N(this.sPrefixId+"_ContainerBox");for(var i=0;i<this.aProfilePhotos.length;++i){C.addContent(this.aProfilePhotos[i]);}C.addContent(this.oNotificationTypeText);C.addContent(this.oNotificationMessageText);C.addContent(n);C.addContent(A);return C;},createProfilePhotos:function(){var p=[];for(var i=0;i<this.iNumberOfNotifications;++i){p.push(new I(this.sPrefixId+"_ProfileImage"+i,{densityAware:false,decorative:true}).addStyleClass(this.sStyleClassPrefix+"ProfileImage").addStyleClass(this.sStyleClassPrefix+"ProfileImageHidden").addStyleClass(this.sStyleClassPrefix+"CursorPointer"));}return p;},createNotificationTypeText:function(){return new T(this.sPrefixId+"_NotificationType").addStyleClass(this.sStyleClassPrefix+"NotificationTypeText").addStyleClass(this.sStyleClassPrefix+"CursorPointer");},createNotificationMessageText:function(){return new T(this.sPrefixId+"_NotificationMessage").addStyleClass(this.sStyleClassPrefix+"NotificationMessageText").addStyleClass(this.sStyleClassPrefix+"CursorPointer");},createNotificationUnreadCountText:function(){return new T(this.sPrefixId+"_NotificationUnreadCount").addStyleClass(this.sStyleClassPrefix+"NotificationUnreadCountText").addStyleClass(this.sStyleClassPrefix+"CursorPointer");},createNotificationNewNotificationOrErrorText:function(){return new T(this.sPrefixId+"_NewNotificationOrErrorText").addStyleClass(this.sStyleClassPrefix+"CursorPointer");},createNotificationUnreadCountVBox:function(){this.oNotificationUnreadCountText=this.createNotificationUnreadCountText();this.oNotificationNewNotificationOrErrorText=this.createNotificationNewNotificationOrErrorText();var n=new V(this.sPrefixId+"_UnreadCountVBox",{items:[this.oNotificationUnreadCountText,this.oNotificationNewNotificationOrErrorText]}).addStyleClass(this.sStyleClassPrefix+"NotificationUnreadContainer");return n;},createNotificationAgeAndGroupVBox:function(){this.oNotificationAgeText=new T(this.sPrefixId+"_NotificationAge",{textAlign:a.Right,}).addStyleClass(this.sStyleClassPrefix+"NotificationAgeAndGroupText").addStyleClass(this.sStyleClassPrefix+"CursorPointer");this.oNotificationGroupText=new T(this.sPrefixId+"_NotificationGroup",{textAlign:a.Right,}).addStyleClass(this.sStyleClassPrefix+"NotificationAgeAndGroupText").addStyleClass(this.sStyleClassPrefix+"CursorPointer");var A=new V(this.sPrefixId+"_AgeAndGroupVBox",{items:[this.oNotificationAgeText,this.oNotificationGroupText]}).addStyleClass(this.sStyleClassPrefix+"NotificationAgeAndGroupContainer");return A;},ontap:function(){window.open(this.sNotificationsTargetURL,window.name);}});});
