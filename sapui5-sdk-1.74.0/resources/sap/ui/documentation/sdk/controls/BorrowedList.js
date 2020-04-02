/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control'],function(C){"use strict";return C.extend("sap.ui.documentation.sdk.controls.BorrowedList",{metadata:{library:"sap.ui.documentation",properties:{list:{type:"array"}}},renderer:{apiVersion:2,render:function(r,c){var l=c.getList(),I,L,i;r.openStart("div",c);r.openEnd();for(i=0,L=l.length;i<L;i++){I=l[i];r.openStart("a");r.attr("href",I.link).attr("role","link").attr("tabindex","0").class("sapMLnk").class("sapMLnkMaxWidth").class("sapUiTinyMargin").openEnd().text(I.name).close("a");}r.close("div");}}});});
