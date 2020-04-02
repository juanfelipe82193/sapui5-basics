/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor","sap/ui/base/BindingParser"],function(B,a){"use strict";var b=B.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.booleanEditor.BooleanEditor",{xmlFragment:"sap.ui.integration.designtime.baseEditor.propertyEditor.booleanEditor.BooleanEditor",_onChange:function(){var i=this._validate();if(i!==null){this.firePropertyChange(i);}},_validate:function(){var c=this.getContent();var s=c.getSelectedKey();var v=c.getValue();try{var p=a.complexParser(v);if(!p&&!s&&v){throw"Not a boolean";}c.setValueState("None");if(s){return s==="true";}return v;}catch(e){c.setValueState("Error");c.setValueStateText(this.getI18nProperty("BASE_EDITOR.BOOLEAN.INVALID_BINDING_OR_BOOLEAN"));return null;}},renderer:B.getMetadata().getRenderer().render});return b;});
