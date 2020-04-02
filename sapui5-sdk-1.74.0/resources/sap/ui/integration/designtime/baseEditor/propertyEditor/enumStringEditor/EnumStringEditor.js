/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor","sap/ui/core/Item","sap/ui/base/BindingParser"],function(B,I,a){"use strict";var E=B.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.enumStringEditor.EnumStringEditor",{xmlFragment:"sap.ui.integration.designtime.baseEditor.propertyEditor.enumStringEditor.EnumStringEditor",_onChange:function(){var c=this.getContent();if(this._validate()){this.firePropertyChange(c.getSelectedKey()||c.getValue());}},_validate:function(){var c=this.getContent();var s=c.getSelectedKey();var v=c.getValue();if(!s&&v){var p;try{p=a.complexParser(v);}finally{if(!p){c.setValueState("Error");c.setValueStateText(this.getI18nProperty("BASE_EDITOR.ENUM.INVALID_SELECTION_OR_BINDING"));return false;}else{c.setValueState("None");return true;}}}else{c.setValueState("None");return true;}},renderer:B.getMetadata().getRenderer().render});return E;});
