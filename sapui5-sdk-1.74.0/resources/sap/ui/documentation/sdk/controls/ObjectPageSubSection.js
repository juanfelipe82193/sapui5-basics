/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control','sap/uxap/ObjectPageSubSection'],function(C,O){"use strict";var S=O.extend("sap.ui.documentation.sdk.controls.ObjectPageSubSection",{metadata:{library:"sap.ui.documentation"},renderer:"sap.uxap.ObjectPageSubSectionRenderer"});var a=new C.extend("Container",{metadata:{aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"}}},renderer:{apiVersion:2,render:function(r,c){var b=c.getContent(),l,i;r.openStart("div").openEnd();for(i=0,l=b.length;i<l;i++){r.renderControl(b[i]);}r.close("div");}}});S.prototype._getGrid=function(){if(!this.getAggregation("_grid")){this.setAggregation("_grid",new a({id:this.getId()+"-innerGrid"}),true);}return this.getAggregation("_grid");};return S;});
