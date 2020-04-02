/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control',"sap/base/security/sanitizeHTML"],function(C,s){"use strict";return C.extend("sap.ui.documentation.sdk.controls.JSDocText",{metadata:{library:"sap.ui.documentation",properties:{text:{type:"string",defaultValue:""},sanitizeContent:{type:"boolean",group:"Misc",defaultValue:true}}},renderer:{apiVersion:2,render:function(r,c){var t=c.getText();if(c.getSanitizeContent()){t=s(t);}r.openStart("div",c);r.class("sapUiJSD");r.openEnd();r.unsafeHtml(t);r.close("div");}}});});
