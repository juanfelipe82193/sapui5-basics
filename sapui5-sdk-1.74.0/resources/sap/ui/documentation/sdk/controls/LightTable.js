/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control'],function(C){"use strict";return C.extend("sap.ui.documentation.sdk.controls.LightTable",{metadata:{library:"sap.ui.documentation",properties:{columnTitles:{type:"string[]"},columnCount:{type:"int"}},defaultAggregation:"rows",aggregations:{rows:{type:"sap.ui.documentation.sdk.controls.Row",multiple:true}}},renderer:{apiVersion:2,render:function(r,c){var R=c.getRows(),b,d=c.getColumnTitles(),l,a,L,i;r.openStart("div",c);r.class("sapUiDocLightTable");r.class("columns-"+c.getColumnCount());r.openEnd();r.openStart("div").class("head").openEnd();for(i=0,L=d.length;i<L;i++){r.openStart("div").class("cell").openEnd();r.text(d[i]).close("div");}r.close("div");for(i=0,L=R.length;i<L;i++){r.openStart("div").class("row").openEnd();b=R[i].getContent();for(a=0,l=b.length;a<l;a++){r.openStart("div").class("cell").openEnd();if(a>0){r.openStart("div").class("inTitle").openEnd().text(d[a]+":").close("div");}r.renderControl(b[a]);r.close("div");}r.close("div");}r.close("div");}}});});
