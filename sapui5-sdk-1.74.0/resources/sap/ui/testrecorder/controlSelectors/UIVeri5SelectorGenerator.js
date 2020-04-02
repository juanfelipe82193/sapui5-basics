/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/test/RecordReplay"],function(B,R){"use strict";var s=[];var S=100;var U=B.extend("sap.ui.testrecorder.controlSelectors.UIVeri5SelectorGenerator",{});U.prototype.getSelector=function(d){var D=_(d);var c={domElementId:D.id};var C=this._findCached(c);if(C){return Promise.resolve(C);}return R.findControlSelectorByDOMElement({domElement:D}).then(function(m){this._cache(c,m);return m;}.bind(this));};U.prototype._findCached=function(d){var m;s.forEach(function(p){if(p.key===d.domElementId){m=p.value;}});return m;};U.prototype._cache=function(d,m){if(s.length===S){s.shift();}s.push({key:d.domElementId,value:m});};U.prototype.emptyCache=function(){s=[];};function _(d){if(d.domElement&&typeof d.domElement==="string"){return document.getElementById(d.domElement);}else if(d.controlId){return sap.ui.getCore().byId(d.controlId).getFocusDomRef();}}return new U();});
