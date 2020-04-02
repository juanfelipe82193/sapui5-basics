/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['./InvalidAttachmentConstructorArgumentsException','./InvalidAttachmentParameterException','sap/ui/base/Object'],function(I,a,B){"use strict";var A=B.extend("sap.collaboration.components.fiori.sharing.attachment.Attachment",{constructor:function(n,m,u){if(arguments.length===3&&Object.prototype.toString.call(n)==="[object String]"&&Object.prototype.toString.call(m)==="[object String]"&&Object.prototype.toString.call(u)==="[object String]"){this.name=n;this.mimeType=m;this.url=u;}else{throw new I();}},getName:function(){return this.name;},getMimeType:function(){return this.mimeType;},getUrl:function(){return this.url;},setName:function(n){if(arguments.length===1&&Object.prototype.toString.call(n)==="[object String]"){this.name=n;}else{throw new a("name");}},setMimeType:function(m){if(arguments.length===1&&Object.prototype.toString.call(m)==="[object String]"){this.mimeType=m;}else{throw new a("mimeType");}},setUrl:function(u){if(arguments.length===1&&Object.prototype.toString.call(u)==="[object String]"){this.url=u;}else{throw new a("url");}}});return A;});
