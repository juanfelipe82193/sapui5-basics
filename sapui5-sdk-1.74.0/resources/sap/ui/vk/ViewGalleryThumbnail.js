/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/m/Image"],function(I){"use strict";var V=I.extend("sap.ui.vk.ViewGalleryThumbnail",{metadata:{associations:{viewGallery:{type:"sap.ui.vk.ViewGallery"}},properties:{enabled:{type:"boolean",defaultValue:true},thumbnailWidth:{type:"sap.ui.core.CSSSize",defaultValue:"5rem"},thumbnailHeight:{type:"sap.ui.core.CSSSize",defaultValue:"5rem"},source:{type:"string",defaultValue:""},tooltip:{type:"string",defaultValue:""},selected:{type:"boolean",defaultValue:false},processing:{type:"boolean",defaultValue:false},animated:{type:"boolean",defaultValue:false}}}});V.prototype.init=function(){};V.prototype.getViewGallery=function(){var v=sap.ui.getCore().byId(this.getAssociation("viewGallery"));if(v instanceof sap.ui.vk.ViewGallery){return v;}};V.prototype._getIndex=function(){var v=this.getViewGallery();var i=v._viewItems.indexOf(this);return i;};return V;});
