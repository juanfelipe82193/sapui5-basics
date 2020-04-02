//@ui5-bundle Component-h2-preload.js
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/applications/SpaceDesigner/Component.js":["sap/ui/core/UIComponent.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/SpaceDesigner/controller/ErrorDialog.js","sap/ushell/applications/SpaceDesigner/util/SpacePersistence.js"],
"sap/ushell/applications/SpaceDesigner/controller/App.controller.js":["sap/ushell/applications/SpaceDesigner/controller/BaseController.js"],
"sap/ushell/applications/SpaceDesigner/controller/BaseController.js":["sap/base/Log.js","sap/m/MessageBox.js","sap/m/library.js","sap/ui/core/UIComponent.js","sap/ui/core/mvc/Controller.js","sap/ushell/applications/SpaceDesigner/util/Transport.js"],
"sap/ushell/applications/SpaceDesigner/controller/BaseDialog.controller.js":["sap/base/util/merge.js","sap/ui/core/Fragment.js","sap/ui/core/library.js","sap/ushell/applications/SpaceDesigner/controller/BaseController.js"],
"sap/ushell/applications/SpaceDesigner/controller/CopySpaceDialog.controller.js":["sap/base/util/merge.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/SpaceDesigner/controller/BaseDialog.controller.js"],
"sap/ushell/applications/SpaceDesigner/controller/CreateSpaceDialog.controller.js":["sap/base/util/merge.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/SpaceDesigner/controller/BaseDialog.controller.js"],
"sap/ushell/applications/SpaceDesigner/controller/CustomString.js":["sap/ui/model/SimpleType.js"],
"sap/ushell/applications/SpaceDesigner/controller/DeleteDialog.controller.js":["sap/base/strings/formatMessage.js","sap/ui/core/Fragment.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/SpaceDesigner/controller/BaseDialog.controller.js"],
"sap/ushell/applications/SpaceDesigner/controller/EditDialog.controller.js":["sap/base/strings/formatMessage.js","sap/ui/core/Fragment.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/SpaceDesigner/controller/BaseDialog.controller.js"],
"sap/ushell/applications/SpaceDesigner/controller/ErrorDialog.js":["sap/m/MessageToast.js","sap/ui/core/Fragment.js","sap/ui/model/json/JSONModel.js"],
"sap/ushell/applications/SpaceDesigner/controller/ErrorPage.controller.js":["sap/ushell/applications/SpaceDesigner/controller/BaseController.js"],
"sap/ushell/applications/SpaceDesigner/controller/SpaceDetail.controller.js":["sap/base/Log.js","sap/base/strings/formatMessage.js","sap/m/MessageToast.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/SpaceDesigner/controller/BaseController.js"],
"sap/ushell/applications/SpaceDesigner/controller/SpaceOverview.controller.js":["sap/m/MessageToast.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/SpaceDesigner/controller/BaseController.js"],
"sap/ushell/applications/SpaceDesigner/localService/mockserver.js":["sap/ui/core/util/MockServer.js"],
"sap/ushell/applications/SpaceDesigner/test/initMockServer.js":["sap/m/Shell.js","sap/ui/model/json/JSONModel.js","sap/ushell/Config.js","sap/ushell/applications/SpaceDesigner/localService/mockserver.js","sap/ushell/bootstrap/common/common.boot.task.js","sap/ushell/bootstrap/common/common.create.configcontract.core.js"],
"sap/ushell/applications/SpaceDesigner/view/App.view.xml":["sap/m/NavContainer.js","sap/ui/core/mvc/XMLView.js","sap/ushell/applications/SpaceDesigner/controller/App.controller.js"],
"sap/ushell/applications/SpaceDesigner/view/CopySpaceDialog.fragment.xml":["sap/base/strings/formatMessage.js","sap/m/Button.js","sap/m/Dialog.js","sap/m/Input.js","sap/m/Label.js","sap/m/Text.js","sap/ui/core/ComponentContainer.js","sap/ui/core/Fragment.js","sap/ui/layout/form/SimpleForm.js","sap/ui/model/type/String.js","sap/ushell/applications/SpaceDesigner/controller/CustomString.js"],
"sap/ushell/applications/SpaceDesigner/view/CreateSpaceDialog.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/Input.js","sap/m/Label.js","sap/ui/core/ComponentContainer.js","sap/ui/core/Fragment.js","sap/ui/layout/form/SimpleForm.js","sap/ui/model/type/String.js","sap/ushell/applications/SpaceDesigner/controller/CustomString.js"],
"sap/ushell/applications/SpaceDesigner/view/DeleteDialog.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/Text.js","sap/ui/core/ComponentContainer.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/SpaceDesigner/view/EditDialog.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/Text.js","sap/ui/core/ComponentContainer.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/SpaceDesigner/view/ErrorDialog.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/Link.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/SpaceDesigner/view/ErrorPage.view.xml":["sap/m/Link.js","sap/m/MessagePage.js","sap/ui/core/mvc/XMLView.js","sap/ushell/applications/SpaceDesigner/controller/ErrorPage.controller.js"],
"sap/ushell/applications/SpaceDesigner/view/SpaceDetail.view.xml":["sap/f/DynamicPage.js","sap/f/DynamicPageHeader.js","sap/f/DynamicPageTitle.js","sap/m/Button.js","sap/m/HBox.js","sap/m/ObjectAttribute.js","sap/m/OverflowToolbar.js","sap/m/Panel.js","sap/m/Title.js","sap/m/ToolbarSpacer.js","sap/ui/core/CustomData.js","sap/ui/core/Fragment.js","sap/ui/core/mvc/XMLView.js","sap/ushell/applications/SpaceDesigner/controller/SpaceDetail.controller.js","sap/ushell/applications/SpaceDesigner/view/SpaceInfo.fragment.xml"],
"sap/ushell/applications/SpaceDesigner/view/SpaceInfo.fragment.xml":["sap/m/HeaderContainer.js","sap/m/ObjectAttribute.js","sap/m/VBox.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/SpaceDesigner/view/SpaceOverview.view.xml":["sap/m/Bar.js","sap/m/Button.js","sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/ObjectIdentifier.js","sap/m/OverflowToolbar.js","sap/m/Page.js","sap/m/SearchField.js","sap/m/Table.js","sap/m/Text.js","sap/m/Title.js","sap/m/ToolbarSpacer.js","sap/ui/core/CustomData.js","sap/ui/core/mvc/XMLView.js","sap/ushell/applications/SpaceDesigner/controller/SpaceOverview.controller.js"]
}});
