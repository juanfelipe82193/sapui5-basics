/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/util/IFrame"],function(){"use strict";return function(c,p,i){var m=p.modifier;var C=c.getDefinition();var v=p.view;var o=p.appComponent;var I={};["url","width","height"].forEach(function(s){I[s]=C.content[s];});var a=m.createControl("sap.ui.fl.util.IFrame",o,v,i,I,false);return a;};});
