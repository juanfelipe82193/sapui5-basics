/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/fl/changeHandler/BaseRename","sap/base/Log"],function(B,L){"use strict";var P="label";var C="fieldLabel";var T="XFLD";var R=B.createRenameChangeHandler({changePropertyName:C,translationTextType:T});R.applyChange=function(c,o,p){var a=c.getDefinition();var t=a.texts[C];var v=t.value;if(a.texts&&t&&typeof(v)==="string"){var O=this.setLabelPropertyOnControl(o,v,p.modifier,P);c.setRevertData(O);return true;}else{L.error("Change does not contain sufficient information to be applied: ["+a.layer+"]"+a.namespace+"/"+a.fileName+"."+a.fileType);}};R.revertChange=function(c,o,p){var O=c.getRevertData();if(O||O===""){if(O==="$$Handled_Internally$$"){O=undefined;}this.setLabelPropertyOnControl(o,O,p.modifier,P);c.resetRevertData();return true;}else{L.error("Change doesn't contain sufficient information to be reverted. Most Likely the Change didn't go through applyChange.");}};R.setLabelPropertyOnControl=function(c,v,m,p){var l=m.getProperty(c,p);if(l&&(typeof l!=="string")){p="text";c=l;}var o=m.getPropertyBindingOrProperty(c,p);m.setPropertyBindingOrProperty(c,p,v);return o||"$$Handled_Internally$$";};return R;},true);
