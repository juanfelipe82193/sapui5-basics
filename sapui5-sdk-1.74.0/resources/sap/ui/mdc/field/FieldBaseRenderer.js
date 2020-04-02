/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/Renderer','sap/ui/core/IconPool'],function(R,I){"use strict";I.insertFontFaceStyle();var F=R.extend("sap.ui.mdc.field.FieldBaseRenderer");F.render=function(r,f){var c=f._getContent();var w=f.getWidth();r.write("<div");r.writeControlData(f);r.addClass("sapUiMdcBaseField");if(c.length>1){r.addClass("sapUiMdcBaseFieldMoreFields");}if(w){r.addStyle("width",w);}r.writeStyles();r.writeClasses();r.write(">");for(var i=0;i<c.length;i++){var C=c[i];r.renderControl(C);}r.write("</div>");};return F;},true);
