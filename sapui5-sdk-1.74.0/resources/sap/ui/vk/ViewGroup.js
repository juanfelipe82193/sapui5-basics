/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/ManagedObject","./findIndexInArray"],function(M,f){"use strict";var V=M.extend("sap.ui.vk.ViewGroup",{metadata:{properties:{viewGroupId:{type:"string"},name:{type:"string"},description:{type:"string"}},associations:{}}});V.prototype.init=function(){this._views=[];};V.prototype.exit=function(){this._views=null;};V.prototype.getViews=function(){return this._views;};V.prototype.addView=function(v){this._views.push(v);return this;};V.prototype.insertView=function(v,i){if(i<0){i=0;}else if(i!==0&&i>=this._views.length){i=this._views.length;}this._views.splice(i,0,v);return this;};V.prototype.indexOfView=function(v){return f(this._views,function(i){return i==v;});};V.prototype.removeView=function(v){var i=this.indexOfView(v);if(i>=0){this._views.splice(i,1);}return this;};V.prototype.removeViews=function(){if(this._views){this._views.splice(0);}return this;};return V;});
