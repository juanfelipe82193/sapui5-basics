//@ui5-bundle sap/ui/integration/library-h2-preload.js
/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine('sap/ui/integration/library',["sap/ui/base/DataType","sap/ui/Global","sap/ui/core/library","sap/m/library","sap/f/library"],function(D){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.integration",version:"1.74.0",dependencies:["sap.ui.core","sap.f","sap.m"],types:["sap.ui.integration.CardActionType","sap.ui.integration.CardDataMode"],controls:["sap.ui.integration.widgets.Card","sap.ui.integration.Widget","sap.ui.integration.host.HostConfiguration"],elements:[],customElements:{"card":"sap/ui/integration/customElements/CustomElementCard","widget":"sap/ui/integration/customElements/CustomElementWidget","host-configuration":"sap/ui/integration/customElements/CustomElementHostConfiguration"}});var t=sap.ui.integration;t.CardActionType={Navigation:"Navigation",Submit:"Submit"};t.CardDataMode={Active:"Active",Inactive:"Inactive"};return t;});
sap.ui.require.preload({
	"sap/ui/integration/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"sap.ui.integration","type":"library","embeds":[],"applicationVersion":{"version":"1.74.0"},"title":"SAPUI5 library with integration-related controls.","description":"SAPUI5 library with integration-related controls.","ach":"CA-UI5-CTR","resources":"resources.json","offline":true,"openSourceComponents":[{"name":"webcomponentsjs","packagedWithMySelf":true,"version":"0.0.0"},{"name":"custom-event-polyfill","packagedWithMySelf":true,"version":"0.0.0"},{"name":"adaptive-cards","packagedWithMySelf":true,"version":"0.0.0"},{"name":"ui5-web-components","packagedWithMySelf":true,"version":"0.0.0"}]},"sap.ui":{"technology":"UI5","supportedThemes":["base"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.74","libs":{"sap.ui.core":{"minVersion":"1.74.0"},"sap.f":{"minVersion":"1.74.0"}}},"library":{"i18n":"messagebundle.properties","content":{"controls":["sap.ui.integration.widgets.Card","sap.ui.integration.Widget","sap.ui.integration.host.HostConfiguration"],"elements":[],"types":["sap.ui.integration.CardActionType","sap.ui.integration.CardDataMode"]}}}}'
},"sap/ui/integration/library-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ui/integration/Widget.js":["sap/base/Log.js","sap/base/util/LoaderExtensions.js","sap/ui/core/ComponentContainer.js","sap/ui/core/Control.js","sap/ui/integration/WidgetRenderer.js","sap/ui/integration/util/Manifest.js","sap/ui/thirdparty/jquery.js"],
"sap/ui/integration/WidgetComponent.js":["sap/ui/core/UIComponent.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/integration/customElements/CustomElementBase.js":["sap/base/Log.js","sap/base/strings/camelize.js","sap/base/strings/hyphenate.js","sap/ui/integration/thirdparty/customElements.js","sap/ui/integration/thirdparty/customEvent.js","sap/ui/integration/util/Utils.js"],
"sap/ui/integration/customElements/CustomElementCard.js":["sap/ui/integration/customElements/CustomElementBase.js","sap/ui/integration/customElements/CustomElementHostConfiguration.js","sap/ui/integration/widgets/Card.js"],
"sap/ui/integration/customElements/CustomElementHostConfiguration.js":["sap/ui/integration/customElements/CustomElementBase.js","sap/ui/integration/host/HostConfiguration.js"],
"sap/ui/integration/customElements/CustomElementWidget.js":["sap/ui/integration/Widget.js","sap/ui/integration/customElements/CustomElementBase.js"],
"sap/ui/integration/designtime/baseEditor/BaseEditor.js":["sap/base/Log.js","sap/base/i18n/ResourceBundle.js","sap/base/util/ObjectPath.js","sap/base/util/isPlainObject.js","sap/base/util/merge.js","sap/base/util/restricted/_merge.js","sap/ui/core/Control.js","sap/ui/integration/designtime/baseEditor/util/createPromise.js","sap/ui/model/json/JSONModel.js","sap/ui/model/resource/ResourceModel.js"],
"sap/ui/integration/designtime/baseEditor/PropertyEditor.js":["sap/base/util/isPlainObject.js","sap/ui/core/Control.js","sap/ui/integration/designtime/baseEditor/util/createPromise.js","sap/ui/integration/designtime/baseEditor/util/escapeParameter.js","sap/ui/integration/designtime/baseEditor/util/findClosestInstance.js"],
"sap/ui/integration/designtime/baseEditor/PropertyEditors.js":["sap/ui/core/Control.js","sap/ui/integration/designtime/baseEditor/util/createPromise.js","sap/ui/integration/designtime/baseEditor/util/findClosestInstance.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor.js":["sap/base/util/restricted/_merge.js","sap/m/Label.js","sap/ui/core/Control.js","sap/ui/core/Fragment.js","sap/ui/integration/designtime/baseEditor/util/ObjectBinding.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/arrayEditor/ArrayEditor.fragment.xml":["sap/m/Bar.js","sap/m/Button.js","sap/m/Label.js","sap/m/VBox.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js","sap/ui/integration/designtime/baseEditor/PropertyEditors.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/arrayEditor/ArrayEditor.js":["sap/base/util/ObjectPath.js","sap/base/util/deepClone.js","sap/base/util/restricted/_merge.js","sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/booleanEditor/BooleanEditor.fragment.xml":["sap/m/ComboBox.js","sap/ui/core/Fragment.js","sap/ui/core/Item.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/booleanEditor/BooleanEditor.js":["sap/ui/base/BindingParser.js","sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/enumStringEditor/EnumStringEditor.fragment.xml":["sap/m/ComboBox.js","sap/ui/core/Fragment.js","sap/ui/core/Item.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/enumStringEditor/EnumStringEditor.js":["sap/ui/base/BindingParser.js","sap/ui/core/Item.js","sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/iconEditor/IconEditor.fragment.xml":["sap/m/Input.js","sap/ui/core/Fragment.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/iconEditor/IconEditor.js":["sap/ui/base/BindingParser.js","sap/ui/core/Fragment.js","sap/ui/core/IconPool.js","sap/ui/core/ListItem.js","sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/iconEditor/IconEditorDialog.fragment.xml":["sap/m/SelectDialog.js","sap/m/StandardListItem.js","sap/ui/core/Fragment.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/jsonEditor/JsonEditor.fragment.xml":["sap/m/Input.js","sap/ui/core/Fragment.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/jsonEditor/JsonEditor.js":["sap/ui/core/Fragment.js","sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/jsonEditor/JsonEditorDialog.fragment.xml":["sap/m/Bar.js","sap/m/Button.js","sap/m/Dialog.js","sap/m/MessageStrip.js","sap/m/Title.js","sap/ui/core/Fragment.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/mapEditor/MapEditor.fragment.xml":["sap/m/Button.js","sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/Input.js","sap/m/Table.js","sap/m/Text.js","sap/ui/core/Fragment.js","sap/ui/integration/designtime/baseEditor/PropertyEditors.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/mapEditor/MapEditor.js":["sap/base/util/ObjectPath.js","sap/base/util/deepClone.js","sap/base/util/isPlainObject.js","sap/base/util/restricted/_merge.js","sap/base/util/restricted/_omit.js","sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor.js","sap/ui/model/json/JSONModel.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/numberEditor/NumberEditor.fragment.xml":["sap/m/Input.js","sap/ui/core/Fragment.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/numberEditor/NumberEditor.js":["sap/ui/base/BindingParser.js","sap/ui/core/format/NumberFormat.js","sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/parametersEditor/ParametersEditor.js":["sap/base/util/deepClone.js","sap/base/util/isPlainObject.js","sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor.js","sap/ui/integration/designtime/baseEditor/propertyEditor/mapEditor/MapEditor.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/stringEditor/StringEditor.fragment.xml":["sap/m/Input.js","sap/ui/core/Fragment.js"],
"sap/ui/integration/designtime/baseEditor/propertyEditor/stringEditor/StringEditor.js":["sap/ui/base/BindingParser.js","sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor.js"],
"sap/ui/integration/designtime/baseEditor/util/ObjectBinding.js":["sap/base/util/ObjectPath.js","sap/base/util/deepClone.js","sap/ui/base/BindingParser.js","sap/ui/base/ManagedObject.js"],
"sap/ui/integration/designtime/baseEditor/util/escapeParameter.js":["sap/base/util/isPlainObject.js"],
"sap/ui/integration/designtime/cardEditor/CardEditor.js":["sap/ui/integration/designtime/baseEditor/BaseEditor.js","sap/ui/integration/designtime/cardEditor/config/index.js"],
"sap/ui/integration/designtime/cardEditor/PropertyEditor.js":["sap/ui/integration/designtime/baseEditor/PropertyEditor.js"],
"sap/ui/integration/designtime/cardEditor/PropertyEditors.js":["sap/ui/integration/designtime/baseEditor/PropertyEditors.js"],
"sap/ui/integration/designtime/cardEditor/config/HeaderConfig.js":["sap/ui/integration/designtime/cardEditor/config/generateActionConfig.js"],
"sap/ui/integration/designtime/cardEditor/config/ListCardConfig.js":["sap/ui/integration/designtime/cardEditor/config/generateActionConfig.js"],
"sap/ui/integration/designtime/cardEditor/config/ObjectCardConfig.js":["sap/ui/integration/designtime/cardEditor/config/generateActionConfig.js"],
"sap/ui/integration/designtime/cardEditor/config/TableCardConfig.js":["sap/ui/integration/designtime/cardEditor/config/generateActionConfig.js"],
"sap/ui/integration/designtime/cardEditor/config/generateActionConfig.js":["sap/base/util/restricted/_merge.js"],
"sap/ui/integration/designtime/cardEditor/config/index.js":["sap/ui/integration/designtime/cardEditor/config/HeaderConfig.js","sap/ui/integration/designtime/cardEditor/config/ListCardConfig.js","sap/ui/integration/designtime/cardEditor/config/ObjectCardConfig.js","sap/ui/integration/designtime/cardEditor/config/TableCardConfig.js","sap/ui/integration/designtime/cardEditor/config/generateDataConfig.js"],
"sap/ui/integration/host/HostConfiguration.js":["sap/ui/core/Control.js","sap/ui/integration/host/HostConfigurationCompiler.js"],
"sap/ui/integration/host/HostConfigurationCompiler.js":["sap/base/Log.js","sap/ui/thirdparty/less.js"],
"sap/ui/integration/library.js":["sap/f/library.js","sap/m/library.js","sap/ui/Global.js","sap/ui/base/DataType.js","sap/ui/core/library.js"],
"sap/ui/integration/sap-ui-integration-define-nojQuery.js":["ui5loader-autoconfig.js"],
"sap/ui/integration/services/Data.js":["sap/ui/integration/services/Service.js"],
"sap/ui/integration/services/Navigation.js":["sap/ui/integration/services/Service.js"],
"sap/ui/integration/util/Manifest.js":["sap/base/Log.js","sap/base/util/deepClone.js","sap/base/util/isPlainObject.js","sap/ui/base/Object.js","sap/ui/core/Manifest.js","sap/ui/integration/util/ParameterMap.js"],
"sap/ui/integration/util/ParameterMap.js":["sap/ui/core/Core.js"],
"sap/ui/integration/util/ServiceManager.js":["sap/base/Log.js","sap/ui/base/EventProvider.js"],
"sap/ui/integration/widgets/Card.js":["sap/base/Log.js","sap/base/util/LoaderExtensions.js","sap/f/CardRenderer.js","sap/f/cards/BaseContent.js","sap/f/cards/DataProviderFactory.js","sap/f/cards/Header.js","sap/f/cards/NumericHeader.js","sap/f/library.js","sap/m/HBox.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Control.js","sap/ui/core/Core.js","sap/ui/core/Icon.js","sap/ui/core/InvisibleText.js","sap/ui/integration/library.js","sap/ui/integration/util/Manifest.js","sap/ui/integration/util/ServiceManager.js","sap/ui/model/json/JSONModel.js","sap/ui/model/resource/ResourceModel.js","sap/ui/thirdparty/jquery.js"]
}});
//# sourceMappingURL=library-h2-preload.js.map