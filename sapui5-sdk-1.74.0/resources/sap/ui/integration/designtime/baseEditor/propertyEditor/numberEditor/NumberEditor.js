/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor","sap/ui/base/BindingParser","sap/ui/core/format/NumberFormat"],function(B,a,N){"use strict";var b=B.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.numberEditor.NumberEditor",{xmlFragment:"sap.ui.integration.designtime.baseEditor.propertyEditor.numberEditor.NumberEditor",_onLiveChange:function(){var i=this.getContent();var I=this._validate(i.getValue());if(I!==null){this.firePropertyChange(I);}},_validate:function(v){var i=this.getContent();try{var p=a.complexParser(v);var n=N.getFloatInstance().parse(v);if(!p&&v&&isNaN(n)){throw"NaN";}i.setValueState("None");return p||!v?v:n;}catch(e){i.setValueState("Error");i.setValueStateText(this.getI18nProperty("BASE_EDITOR.NUMBER.INVALID_BINDING_OR_NUMBER"));return null;}},renderer:B.getMetadata().getRenderer().render});return b;});
