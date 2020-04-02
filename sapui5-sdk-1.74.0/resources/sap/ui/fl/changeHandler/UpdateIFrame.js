/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var U={};var u=["width","height","url"];function g(m,i){var s={};u.forEach(function(p){var v=m.getProperty(i,p);if(v!==undefined){s[p]=v;}});return s;}U.applyChange=function(c,C,p){var m=p.modifier;var o=c.getDefinition();var a=m.getControlMetadata(C);if(a.getName()!=="sap.ui.fl.util.IFrame"){throw new Error("UpdateIFrame only for sap.ui.fl.util.IFrame");}c.setRevertData({originalSettings:g(m,C)});m.applySettings(C,o.settings);};U.revertChange=function(c,C,p){var r=c.getRevertData();if(r){p.modifier.applySettings(C,r.originalSettings);c.resetRevertData();}else{throw new Error("Attempt to revert an unapplied change.");}};U.completeChangeContent=function(c,s){var C=c.getDefinition();if(!s.content||!Object.keys(s.content).some(function(p){return u.indexOf(p)!==-1;})){throw new Error("oSpecificChangeInfo attribute required");}C.settings=s.content;};return U;},true);
