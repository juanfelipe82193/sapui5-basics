/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor","sap/ui/base/BindingParser"],function(B,a){"use strict";var S=B.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.stringEditor.StringEditor",{xmlFragment:"sap.ui.integration.designtime.baseEditor.propertyEditor.stringEditor.StringEditor",_onLiveChange:function(){var i=this.getContent();if(this._validate()){this.firePropertyChange(i.getValue());}},_validate:function(){var i=this.getContent();var v=i.getValue();var I=false;try{a.complexParser(v);}catch(e){I=true;}finally{if(I){i.setValueState("Error");i.setValueStateText(this.getI18nProperty("BASE_EDITOR.STRING.INVALID_BINDING"));return false;}else{i.setValueState("None");return true;}}},renderer:B.getMetadata().getRenderer().render});return S;});
