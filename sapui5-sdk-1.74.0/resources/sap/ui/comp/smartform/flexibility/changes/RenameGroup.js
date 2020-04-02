/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/fl/changeHandler/BaseRename","sap/base/Log"],function(B,L){"use strict";var P="label";var C="groupLabel";var T="XFLD";var R=B.createRenameChangeHandler({propertyName:P,changePropertyName:C,translationTextType:T});R.applyChange=function(c,o,p){var a=c.getDefinition();var t=a.texts[C];var v=t.value;if(a.texts&&t&&typeof(v)==="string"){var O=this.setLabelOrTitleOnControl(o,v,p.modifier,P);c.setRevertData(O);return true;}else{L.error("Change does not contain sufficient information to be applied: ["+a.layer+"]"+a.namespace+"/"+a.fileName+"."+a.fileType);}};R.revertChange=function(c,o,p){var O=c.getRevertData();if(O||O===""){this.setLabelOrTitleOnControl(o,O,p.modifier,P);c.resetRevertData();return true;}else{L.error("Change doesn't contain sufficient information to be reverted. Most Likely the Change didn't go through applyChange.");}};R.setLabelOrTitleOnControl=function(c,v,m,p){var l=m.getProperty(c,p);var t=m.getAggregation(c,"title");if(!l&&t){if(typeof t==="string"){p="title";}else{p="text";c=t;}}var o=m.getPropertyBindingOrProperty(c,p);m.setPropertyBindingOrProperty(c,p,v);return o;};return R;},true);
