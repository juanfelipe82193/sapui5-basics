//@ui5-bundle sap/uiext/inbox/library-h2-preload.js
/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.predefine('sap/uiext/inbox/library',["sap/ui/core/library","sap/ui/commons/library","sap/ui/ux3/library","sap/ui/core/Core"],function(){sap.ui.getCore().initLibrary({name:"sap.uiext.inbox",dependencies:["sap.ui.core","sap.ui.commons","sap.ui.ux3"],types:[],interfaces:[],controls:["sap.uiext.inbox.Inbox","sap.uiext.inbox.InboxLaunchPad","sap.uiext.inbox.InboxSplitApp","sap.uiext.inbox.SubstitutionRulesManager","sap.uiext.inbox.composite.InboxAddAttachmentTile","sap.uiext.inbox.composite.InboxAttachmentTile","sap.uiext.inbox.composite.InboxAttachmentsTileContainer","sap.uiext.inbox.composite.InboxBusyIndicator","sap.uiext.inbox.composite.InboxComment","sap.uiext.inbox.composite.InboxTaskComments","sap.uiext.inbox.composite.InboxTaskTitleControl","sap.uiext.inbox.composite.InboxUploadAttachmentTile"],elements:[],version:"1.74.0"});return sap.uiext.inbox;});
sap.ui.require.preload({
	"sap/uiext/inbox/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"sap.uiext.inbox","type":"library","embeds":[],"applicationVersion":{"version":"1.74.0"},"title":"The Unified Inbox control","description":"The Unified Inbox control","ach":"CA-UI5-INB","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":["base","sap_bluecrystal","sap_hcb"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.74","libs":{"sap.ui.core":{"minVersion":"1.74.0"},"sap.ui.commons":{"minVersion":"1.74.0"},"sap.ui.ux3":{"minVersion":"1.74.0"},"sap.m":{"minVersion":"1.74.0","lazy":true}}},"library":{"i18n":"messagebundle.properties","content":{"controls":["sap.uiext.inbox.Inbox","sap.uiext.inbox.InboxLaunchPad","sap.uiext.inbox.InboxSplitApp","sap.uiext.inbox.SubstitutionRulesManager","sap.uiext.inbox.composite.InboxAddAttachmentTile","sap.uiext.inbox.composite.InboxAttachmentTile","sap.uiext.inbox.composite.InboxAttachmentsTileContainer","sap.uiext.inbox.composite.InboxBusyIndicator","sap.uiext.inbox.composite.InboxComment","sap.uiext.inbox.composite.InboxTaskComments","sap.uiext.inbox.composite.InboxTaskTitleControl","sap.uiext.inbox.composite.InboxUploadAttachmentTile"],"elements":[],"types":[],"interfaces":[]}}}}'
},"sap/uiext/inbox/library-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/uiext/inbox/Inbox.js":["sap/ui/commons/Button.js","sap/ui/commons/Dialog.js","sap/ui/commons/DropdownBox.js","sap/ui/commons/Image.js","sap/ui/commons/Label.js","sap/ui/commons/Link.js","sap/ui/commons/RadioButtonGroup.js","sap/ui/commons/SearchField.js","sap/ui/commons/TextField.js","sap/ui/commons/TextView.js","sap/ui/commons/ToggleButton.js","sap/ui/commons/Toolbar.js","sap/ui/commons/ToolbarSeparator.js","sap/ui/commons/layout/BorderLayout.js","sap/ui/commons/layout/HorizontalLayout.js","sap/ui/commons/layout/MatrixLayout.js","sap/ui/commons/layout/VerticalLayout.js","sap/ui/core/Control.js","sap/ui/core/HTML.js","sap/ui/core/Icon.js","sap/ui/core/IconPool.js","sap/ui/core/ListItem.js","sap/ui/core/Locale.js","sap/ui/core/format/DateFormat.js","sap/ui/model/Filter.js","sap/ui/model/Sorter.js","sap/ui/table/Table.js","sap/ui/ux3/FacetFilter.js","sap/ui/ux3/FacetFilterList.js","sap/ui/ux3/OverlayContainer.js","sap/uiext/inbox/InboxConstants.js","sap/uiext/inbox/InboxDataManager.js","sap/uiext/inbox/InboxFilters.js","sap/uiext/inbox/InboxFormattedTextView.js","sap/uiext/inbox/InboxLink.js","sap/uiext/inbox/InboxTaskCategoryFilterList.js","sap/uiext/inbox/InboxToggleTextView.js","sap/uiext/inbox/InboxUtils.js","sap/uiext/inbox/SubstitutionRulesManager.js","sap/uiext/inbox/TCMMetadata.js","sap/uiext/inbox/TaskInitialFilters.js","sap/uiext/inbox/controller/InboxControllerFactory.js","sap/uiext/inbox/library.js","sap/uiext/inbox/tcm/TCMModel.js"],
"sap/uiext/inbox/InboxConstants.js":["sap/ui/core/IconPool.js"],
"sap/uiext/inbox/InboxFilters.js":["sap/uiext/inbox/InboxPrimaryFilters.js","sap/uiext/inbox/InboxSecondaryFilters.js","sap/uiext/inbox/InboxUtils.js"],
"sap/uiext/inbox/InboxLaunchPad.js":["sap/ui/core/Control.js","sap/ui/core/IconPool.js","sap/uiext/inbox/InboxTile.js","sap/uiext/inbox/library.js"],
"sap/uiext/inbox/InboxLink.js":["sap/uiext/inbox/InboxConstants.js"],
"sap/uiext/inbox/InboxPrimaryFilters.js":["sap/uiext/inbox/InboxPrimaryFilterEnum.js","sap/uiext/inbox/InboxUtils.js"],
"sap/uiext/inbox/InboxSecondaryFilterPathEnum.js":["sap/uiext/inbox/InboxSecondaryFilterValuesEnum.js"],
"sap/uiext/inbox/InboxSecondaryFilters.js":["sap/uiext/inbox/InboxSecondaryFilterPathEnum.js","sap/uiext/inbox/InboxSecondaryFilterValuesEnum.js","sap/uiext/inbox/InboxUtils.js","sap/uiext/inbox/TaskInitialFilters.js"],
"sap/uiext/inbox/InboxSplitApp.js":["sap/ui/core/Control.js","sap/uiext/inbox/library.js","sap/uiext/inbox/splitapp/DetailViewPage.js","sap/uiext/inbox/splitapp/MasterPage.js"],
"sap/uiext/inbox/InboxUtils.js":["sap/ui/model/odata/Filter.js","sap/uiext/inbox/InboxConstants.js"],
"sap/uiext/inbox/SubstitutionRulesManager.js":["sap/ui/core/Control.js","sap/ui/core/IconPool.js","sap/uiext/inbox/InboxConstants.js","sap/uiext/inbox/InboxUtils.js","sap/uiext/inbox/SubstitutionRulesManagerConstants.js","sap/uiext/inbox/SubstitutionRulesManagerUtils.js","sap/uiext/inbox/TCMMetadata.js","sap/uiext/inbox/library.js"],
"sap/uiext/inbox/TaskInitialFilters.js":["sap/uiext/inbox/InboxUtils.js"],
"sap/uiext/inbox/composite/InboxAddAttachmentTile.js":["sap/ui/core/Control.js","sap/uiext/inbox/library.js"],
"sap/uiext/inbox/composite/InboxAttachmentTile.js":["sap/ui/core/Control.js","sap/uiext/inbox/library.js"],
"sap/uiext/inbox/composite/InboxAttachmentsTileContainer.js":["sap/ui/commons/MessageBox.js","sap/ui/core/Control.js","sap/uiext/inbox/InboxUtils.js","sap/uiext/inbox/composite/InboxAttachmentFileUploader.js","sap/uiext/inbox/library.js"],
"sap/uiext/inbox/composite/InboxBusyIndicator.js":["sap/ui/core/Control.js","sap/uiext/inbox/library.js"],
"sap/uiext/inbox/composite/InboxComment.js":["sap/ui/core/Control.js","sap/uiext/inbox/library.js"],
"sap/uiext/inbox/composite/InboxCommentRenderer.js":["sap/uiext/inbox/InboxUtils.js"],
"sap/uiext/inbox/composite/InboxTaskComments.js":["sap/ui/core/Control.js","sap/ui/core/theming/Parameters.js","sap/ui/ux3/Feeder.js","sap/uiext/inbox/composite/InboxBusyIndicator.js","sap/uiext/inbox/library.js"],
"sap/uiext/inbox/composite/InboxTaskTitleControl.js":["sap/ui/core/Control.js","sap/ui/core/IconPool.js","sap/uiext/inbox/library.js"],
"sap/uiext/inbox/composite/InboxUploadAttachmentTile.js":["sap/ui/core/Control.js","sap/uiext/inbox/library.js"],
"sap/uiext/inbox/controller/InboxControllerAsync.js":["sap/ui/model/json/JSONModel.js","sap/uiext/inbox/controller/InboxController.js"],
"sap/uiext/inbox/controller/InboxControllerFactory.js":["sap/uiext/inbox/controller/InboxController.js","sap/uiext/inbox/controller/InboxControllerAsync.js"],
"sap/uiext/inbox/library.js":["sap/ui/commons/library.js","sap/ui/core/Core.js","sap/ui/core/library.js","sap/ui/ux3/library.js"],
"sap/uiext/inbox/splitapp/DetailViewPage.js":["sap/m/MessageToast.js","sap/m/SelectDialog.js","sap/uiext/inbox/InboxConstants.js","sap/uiext/inbox/InboxUtils.js"],
"sap/uiext/inbox/splitapp/MasterPage.js":["sap/uiext/inbox/InboxUtils.js"],
"sap/uiext/inbox/splitapp/TaskExecutionUIPage.js":["sap/m/MessageToast.js"],
"sap/uiext/inbox/tcm/TCMModel.js":["sap/uiext/inbox/tcm/fI/TCMFunctionImport.js"],
"sap/uiext/inbox/tcm/fI/TCMFunctionImport.js":["sap/uiext/inbox/tcm/fI/TCMFunctionImportMetaData.js"]
}});
//# sourceMappingURL=library-h2-preload.js.map