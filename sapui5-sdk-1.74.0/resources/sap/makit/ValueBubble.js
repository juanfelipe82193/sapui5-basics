/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(["./library","sap/ui/core/Element"],function(m,E){"use strict";var V=m.ValueBubbleStyle;var a=m.ValueBubblePosition;var b=E.extend("sap.makit.ValueBubble",{metadata:{deprecated:true,library:"sap.makit",properties:{showCategoryText:{type:"boolean",group:"Misc",defaultValue:true},showCategoryDisplayName:{type:"boolean",group:"Misc",defaultValue:true},showValueDisplayName:{type:"boolean",group:"Misc",defaultValue:true},showValueOnPieChart:{type:"boolean",group:"Misc",defaultValue:false},showLegendLabel:{type:"boolean",group:"Misc",defaultValue:true},showNullValue:{type:"boolean",group:"Misc",defaultValue:true},position:{type:"sap.makit.ValueBubblePosition",group:"Misc",defaultValue:a.Top},style:{type:"sap.makit.ValueBubbleStyle",group:"Misc",defaultValue:V.Top},visible:{type:"boolean",group:"Appearance",defaultValue:true}}}});b.prototype.toObject=function(){var o={};o.showCategoryText=this.getShowCategoryText();o.showCategoryDisplayName=this.getShowCategoryDisplayName();o.showValueDisplayName=this.getShowValueDisplayName();o.showValueOnPieChart=this.getShowValueOnPieChart();o.showLegendLabel=this.getShowLegendLabel();o.showNullValue=this.getShowNullValue();o.style=this.getStyle().toLowerCase();o.position=this.getPosition().toLowerCase();o.visible=this.getVisible();return o;};return b;});
