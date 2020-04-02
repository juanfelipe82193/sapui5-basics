/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define(["sap/apf/modeler/ui/utils/nullObjectChecker"],function(n){'use strict';var D=500;var o={};o.prepareModel=function(a,l){var m;if(!n.checkIsNotNullOrUndefined(l)){l=D;}m=new sap.ui.model.json.JSONModel();m.setSizeLimit(l);m.setData({Objects:a});return m;};o.convert=function(a,l){var b=[],c;if(!n.checkIsNotNullOrUndefinedOrBlank(a)){return undefined;}a.forEach(function(v){if(!n.checkIsNotNullOrUndefined(v)){return;}c={};c.key=v instanceof Object?v.key:v;c.name=v instanceof Object?v.name:v;b.push(c);});return o.prepareModel(b,l);};return o;},true);
