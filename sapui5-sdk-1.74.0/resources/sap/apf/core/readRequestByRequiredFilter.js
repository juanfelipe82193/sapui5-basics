/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(['sap/apf/core/request'],function(R){'use strict';var a=function(i,r,s,e){var c=i.instances.coreApi;var m=i.instances.messageHandler;this.type="readRequestByRequiredFilter";this.send=function(f,C,o){var b;var p;var d=function(g,n){var M;var E;var D=[];if(g&&g.type&&g.type==="messageObject"){m.putMessage(g);M=g;}else{D=g.data;E=g.metadata;}C(D,E,M);};c.getMetadata(s).done(function(M){var P=M.getParameterEntitySetKeyProperties(e);var g="";var E=M.getEntityTypeAnnotations(e);if(E.requiresFilter!==undefined&&E.requiresFilter==="true"){if(E.requiredProperties!==undefined){g=E.requiredProperties;}}var h=g.split(',');P.forEach(function(j){h.push(j.name);});c.getCumulativeFilter().done(function(j){p=j.restrictToProperties(h);if(f){b=f.getInternalFilter();b.addAnd(p);}else{b=p;}r.sendGetInBatch(b,d,o);});});};this.getMetadataFacade=function(){return c.getMetadataFacade(s);};};sap.apf.core.readRequestByRequiredFilter=a;return a;},true);
