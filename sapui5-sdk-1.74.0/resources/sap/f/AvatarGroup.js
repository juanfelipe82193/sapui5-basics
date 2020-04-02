/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/delegate/ItemNavigation","sap/ui/dom/units/Rem","./AvatarGroupRenderer","sap/m/Button","sap/m/library","sap/ui/core/ResizeHandler","sap/ui/events/KeyCodes","sap/ui/core/Core"],function(l,C,I,R,A,B,L,a,K,b){"use strict";var c=l.AvatarGroupType;var d=L.AvatarColor;var e=L.AvatarSize;var f={XS:2,S:3,M:4,L:5,XL:7};var g={XS:0.75,S:1.25,M:1.625,L:2,XL:2.75};var h={XS:0.0625,S:0.125,M:0.125,L:0.125,XL:0.25};var i=C.extend("sap.f.AvatarGroup",{metadata:{library:"sap.f",properties:{groupType:{type:"sap.f.AvatarGroupType",group:"Appearance",defaultValue:c.Group},avatarDisplaySize:{type:"sap.m.AvatarSize",group:"Appearance",defaultValue:e.S}},defaultAggregation:"items",aggregations:{items:{type:'sap.f.AvatarGroupItem',multiple:true}},events:{press:{parameters:{groupType:{type:"string"},overflowButtonPressed:{type:"boolean"},avatarsDisplayed:{type:"int"}}}}}});i.prototype.init=function(){this._oShowMoreButton=new B({});this._oShowMoreButton.addStyleClass("sapFAvatarGroupMoreButton");this._bFirstRendering=true;this._onResizeRef=this._onResize.bind(this);this._iCurrentAvatarColorNumber=1;this._bShowMoreButton=false;};i.prototype.exit=function(){this._detachResizeHandlers();if(this._oItemNavigation){this.removeEventDelegate(this._oItemNavigation);this._oItemNavigation.destroy();this._oItemNavigation=null;}this._oShowMoreButton.destroy();this._oShowMoreButton=null;};i.prototype.onBeforeRendering=function(){if(this._bFirstRendering){this._iAvatarsToShow=this.getItems().length;this._bFirstRendering=false;}};i.prototype.onAfterRendering=function(){var D,j=[];if(!this._oItemNavigation){this._oItemNavigation=new I(null,null);this._oItemNavigation.setDisabledModifiers({sapnext:["alt","meta"],sapprevious:["alt","meta"]});this.addEventDelegate(this._oItemNavigation);}D=this.getDomRef();this._oItemNavigation.setRootDomRef(D);if(this.getGroupType()===c.Individual){this.getItems().forEach(function(o){j.push(o.getDomRef());});this._oItemNavigation.setItemDomRefs(j);}this._detachResizeHandlers();this._attachResizeHandlers();if(b.isThemeApplied()){this._onResize();}if(this._shouldShowMoreButton()){this._oShowMoreButton.$().attr("role","button");if(this.getGroupType()===c.Group){this._oShowMoreButton.$().attr("tabindex","-1");}else{this._oShowMoreButton.$().attr("aria-label",this._getResourceBundle().getText("AVATARGROUP_POPUP"));}}this._updateAccState();};i.prototype.onThemeChanged=function(){this._onResize();};i.prototype._getResourceBundle=function(){return sap.ui.getCore().getLibraryResourceBundle("sap.f");};i.prototype._updateAccState=function(){var r=this._getResourceBundle(),s=r.getText("AVATARGROUP_NUMBER_OF_AVATARS",[this._iAvatarsToShow,(this.getItems().length-this._iAvatarsToShow)]),p=r.getText("AVATARGROUP_POPUP");if(this.getGroupType()===c.Group){this.$().attr("aria-label",p+" "+s);}};i.prototype._attachResizeHandlers=function(){this._iResizeHandlerId=a.register(this,this._onResizeRef);};i.prototype._detachResizeHandlers=function(){if(this._iResizeHandlerId){a.deregister(this._iResizeHandlerId);this._iResizeHandlerId=null;}};i.prototype.setGroupType=function(v){this.getItems().forEach(function(o){o._setGroupType(v);});return this.setProperty("groupType",v);};i.prototype.addItem=function(o){o._setDisplaySize(this.getAvatarDisplaySize());o._setAvatarColor(d["Accent"+this._iCurrentAvatarColorNumber]);o._setGroupType(this.getGroupType());this._iAvatarsToShow=this.getItems().length;this._iCurrentAvatarColorNumber++;if(this._iCurrentAvatarColorNumber>10){this._iCurrentAvatarColorNumber=1;}return this.addAggregation("items",o);};i.prototype.setAvatarDisplaySize=function(v){var o=this.getAvatarDisplaySize();this._oShowMoreButton.removeStyleClass("sapFAvatarGroupMoreButton"+o);this._oShowMoreButton.addStyleClass("sapFAvatarGroupMoreButton"+v);if(o===v){return this;}this.getItems().forEach(function(j){j._setDisplaySize(v);});return this.setProperty("avatarDisplaySize",v);};i.prototype.ontap=function(E){var o=E.srcControl;this.firePress({groupType:this.getGroupType(),eventSource:o,overflowButtonPressed:o===this._oShowMoreButton,avatarsDisplayed:this._iAvatarsToShow});};i.prototype.onsapspace=function(E){this.ontap(E);};i.prototype.onsapenter=function(E){this.ontap(E);};i.prototype.onkeyup=function(E){if(E.shiftKey&&E.keyCode==K.ENTER||E.shiftKey&&E.keyCode==K.SPACE){E.preventDefault();}};i.prototype._getAvatarMargin=function(s){var G=this.getGroupType();if(G===c.Group){return g[s];}else{return h[s];}};i.prototype._getAvatarNetWidth=function(j,k){var G=this.getGroupType();if(G===c.Group){return j-k;}else{return j+k;}};i.prototype._getAvatarsToShow=function(w,j,k){var r=R.toPx(1),m=w-(j*r),n=Math.floor(m/(k*r));return n+1;};i.prototype._adjustAvatarsToShow=function(j){if(j-this._iAvatarsToShow>99){this._iAvatarsToShow-=2;}else{this._iAvatarsToShow--;}};i.prototype._getWidth=function(){return this.$().width();};i.prototype._onResize=function(){var w=this._getWidth(),j=this.getItems(),k=j.length,s=this.getAvatarDisplaySize(),m=f[s],n=this._getAvatarMargin(s),o=this._getAvatarNetWidth(m,n),r=this.$().children(".sapFAvatarGroupItem").length;this._iAvatarsToShow=this._getAvatarsToShow(w,m,o);if(k>this._iAvatarsToShow&&k>0){this._bShowMoreButton=true;this._bAutoWidth=false;this._adjustAvatarsToShow(k);if(r!=this._iAvatarsToShow){this._oShowMoreButton.setText("+"+(k-this._iAvatarsToShow));this.invalidate();}}else{this._bAutoWidth=true;this.getDomRef().style.width="auto";if(this._bShowMoreButton){this._bShowMoreButton=false;this.invalidate();}}};i.prototype._shouldShowMoreButton=function(){return this._bShowMoreButton;};return i;});
