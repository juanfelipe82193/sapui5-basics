/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/core/Core','sap/ui/Device','./NotificationListBase','sap/ui/core/InvisibleText','sap/ui/core/IconPool','sap/ui/core/Icon','sap/ui/core/ResizeHandler','sap/ui/core/library','sap/m/Link','sap/m/Avatar',"sap/ui/events/KeyCodes",'./NotificationListItemRenderer'],function(l,C,D,N,I,a,b,R,c,L,A,K,d){'use strict';var e=C.getLibraryResourceBundle('sap.m'),E=e.getText('NOTIFICATION_LIST_ITEM_SHOW_MORE'),f=e.getText('NOTIFICATION_LIST_ITEM_SHOW_LESS'),g=e.getText('NOTIFICATION_LIST_ITEM_READ'),U=e.getText('NOTIFICATION_LIST_ITEM_UNREAD');var m=44;var h=l.AvatarSize;var i=l.AvatarColor;var P=c.Priority;var j=N.extend('sap.m.NotificationListItem',{metadata:{library:'sap.m',properties:{description:{type:'string',group:'Appearance',defaultValue:''},authorInitials:{type:"string",group:"Data",defaultValue:null},truncate:{type:'boolean',group:'Appearance',defaultValue:true},hideShowMoreButton:{type:'boolean',group:'Appearance',defaultValue:false},authorAvatarColor:{type:"sap.m.AvatarColor",group:"Appearance",defaultValue:i.Accent6}},aggregations:{processingMessage:{type:'sap.m.MessageStrip',multiple:false},_showMoreButton:{type:'sap.m.Link',multiple:false,visibility:"hidden"}}}});j.prototype.init=function(){this.setType('Active');this._footerIvisibleText=new I({id:this.getId()+"-invisibleFooterText"});};j.prototype._getAuthorAvatar=function(){if(this.getAuthorInitials()||this.getAuthorPicture()){if(!this._avatar){this._avatar=new A({displaySize:h.XS});}this._avatar.setInitials(this.getAuthorInitials());this._avatar.setSrc(this.getAuthorPicture());this._avatar.setBackgroundColor(this.getAuthorAvatarColor());return this._avatar;}};j.prototype.onBeforeRendering=function(){N.prototype.onBeforeRendering.call(this);if(this._resizeListenerId){R.deregister(this._resizeListenerId);this._resizeListenerId=null;}};j.prototype.onAfterRendering=function(){if(this.getHideShowMoreButton()){return;}this._updateShowMoreButtonVisibility();if(this.getDomRef()){this._resizeListenerId=R.register(this.getDomRef(),this._onResize.bind(this));}};j.prototype.onfocusin=function(k){N.prototype.onfocusin.apply(this,arguments);if(!D.browser.msie){return;}var t=k.target;if(t!==this.getDomRef()&&!t.classList.contains('sapMBtn')&&!t.classList.contains('sapMLnk')){k.preventDefault();k.stopImmediatePropagation();this.focus();}};j.prototype.onkeydown=function(k){if(k.target!==this.getDomRef()){return;}var n=this.getParent(),v,o;if(!n||!n.isA('sap.m.NotificationListGroup')){return;}v=n.getVisibleItems();o=v.indexOf(this);switch(k.which){case K.ARROW_UP:if(o===0){return;}var p=o-1;v[p].focus();break;case K.ARROW_DOWN:var q=o+1;if(q===v.length){return;}v[q].focus();break;}};j.prototype.exit=function(){if(this._resizeListenerId){R.deregister(this._resizeListenerId);this._resizeListenerId=null;}if(this._footerIvisibleText){this._footerIvisibleText.destroy();this._footerIvisibleText=null;}if(this._avatar){this._avatar.destroy();this._avatar=null;}};j.prototype._onResize=function(){this._updateShowMoreButtonVisibility();};j.prototype._updateShowMoreButtonVisibility=function(){var $=this.$(),t=$.find('.sapMNLITitleText')[0],k=$.find('.sapMNLIDescription')[0],n;if($.length>0){n=t.scrollHeight>m||k.scrollHeight>m;}this._getShowMoreButton().setVisible(n);};j.prototype._getShowMoreButton=function(){var s=this.getAggregation('_showMoreButton');if(!s){s=new L(this.getId()+'-showMoreButton',{text:this.getTruncate()?E:f,press:function(){var t=!this.getTruncate();this._getShowMoreButton().setText(t?E:f);this.setTruncate(t);}.bind(this)});this.setAggregation("_showMoreButton",s,true);}return s;};j.prototype._getFooterInvisibleText=function(){var r=this.getUnread()?U:g,k=this.getAuthorName(),n=this.getDatetime(),p=this.getPriority(),o=[r];if(k){k=e.getText('NOTIFICATION_LIST_ITEM_CREATED_BY');o.push(k);o.push(this.getAuthorName());}if(n){o.push(e.getText('NOTIFICATION_LIST_ITEM_DATETIME',[n]));}if(p!==P.None){o.push(e.getText('NOTIFICATION_LIST_ITEM_PRIORITY',[p]));}return this._footerIvisibleText.setText(o.join(' '));};return j;});
