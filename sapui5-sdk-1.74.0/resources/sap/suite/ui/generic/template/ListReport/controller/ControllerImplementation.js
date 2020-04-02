sap.ui.define(["sap/suite/ui/generic/template/ListReport/extensionAPI/ExtensionAPI","sap/suite/ui/generic/template/listTemplates/listUtils","sap/suite/ui/generic/template/ListReport/controller/IappStateHandler","sap/suite/ui/generic/template/ListReport/controller/MultipleViewsHandler","sap/suite/ui/generic/template/ListReport/controller/WorklistHandler","sap/suite/ui/generic/template/lib/ShareUtils","sap/base/Log","sap/base/util/ObjectPath","sap/suite/ui/generic/template/js/StableIdHelper","sap/base/util/deepExtend"],function(E,l,I,M,W,S,L,O,a,d){"use strict";return{getMethods:function(v,t,c){var s={};s.oWorklistData={};s.oWorklistData.bWorkListEnabled=false;s.oWorklistData.bVariantDirty=true;var b=true;var f;var w=null;function e(){var C=c.getOwnerComponent();var T=t.oComponentUtils.getTemplatePrivateModel();T.setProperty("/listReport/isLeaf",C.getIsLeaf());}function o(i){c.onInitSmartFilterBarExtension(i);c.templateBaseExtension.onInitSmartFilterBar(i);s.oIappStateHandler.onSmartFilterBarInitialise();}function g(){var A=s.oIappStateHandler.parseUrlAndApplyAppState();A.then(function(){b=false;},function(i){if(i instanceof Error){i.showMessageBox();}});}function h(){if(!b){s.oIappStateHandler.changeIappState(true,false);}}function u(C){t.oCommonUtils.setEnabledToolbarButtons(C);if(!t.oCommonUtils.isSmartChart(C)){t.oCommonUtils.setEnabledFooterButtons(C);}}function r(i){var z;z=i.getSource();z.getChartAsync().then(function(C){C.attachSelectData(u.bind(null,z));C.attachDeselectData(u.bind(null,z));});}function j(i){var z=i.getParameters();var A=i.getSource();t.oCommonEventHandlers.onSemanticObjectLinkNavigationPressed(A,z);}function k(i){var z,A;z=i.getParameters();A=i.getSource();t.oCommonEventHandlers.onSemanticObjectLinkNavigationTargetObtained(A,z,s,undefined,undefined);}function m(i){var z,T,C,A,B,F;z=i.getParameters().mainNavigation;B=i.getParameters();F=i.getSource();if(z){T=F.getText&&F.getText();C=t.oCommonUtils.getCustomData(i);if(C&&C["LinkDescr"]){A=C["LinkDescr"];z.setDescription(A);}}F=F.getParent().getParent().getParent().getParent();t.oCommonEventHandlers.onSemanticObjectLinkNavigationTargetObtained(F,B,s,T,z);}function n(C){var z=v.getItems();for(var i=0;i<z.length;i++){if(!C||z[i].getBindingContextPath()===C){return z[i];}}}function N(i){t.oCommonEventHandlers.onListNavigate(i,s,c.onListNavigationExtension.bind(c),undefined,true);}function p(P,B){t.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){t.oCommonEventHandlers.addEntry(B,false,s.oSmartFilterbar,P);},Function.prototype,s);}function q(V){var i=a.getStableId({type:"ListReportAction",subType:"Create",sQuickVariantKey:V});t.oCommonUtils.executeIfControlReady(p.bind(null,undefined),i);}function x(i){var C=c.getOwnerComponent().getCreateWithFilters();var z=C.strategy||"extension";var P;switch(z){case"extension":P=c.getPredefinedValuesForCreateExtension(s.oSmartFilterbar);break;default:L.error(z+" is not a valid strategy to extract values from the SmartFilterBar");return;}p(P,i.getSource());}function D(i){var T=t.oComponentUtils.getTemplatePrivateModel();var z=T.getProperty("/listReport/deleteEnabled");if(z){t.oCommonEventHandlers.deleteEntries(i);}}function y(B){var F={shareEmailPressed:function(){var A=t.oCommonUtils.getText("EMAIL_HEADER",[t.oServices.oApplication.getAppTitle()]);sap.m.URLHelper.triggerEmail(null,A,document.URL);},shareJamPressed:function(){S.openJamShareDialog(t.oServices.oApplication.getAppTitle());},getDownloadUrl:function(){var T=s.oSmartTable.getTable();var A=T.getBinding("rows")||T.getBinding("items");return A&&A.getDownloadUrl()||"";},getServiceUrl:function(){var A=F.getDownloadUrl();if(A){A+="&$top=0&$inlinecount=allpages";}var C={serviceUrl:A};if(c.onSaveAsTileExtension){c.onSaveAsTileExtension(C);}return C.serviceUrl;},getModelData:function(){var G=O.get("sap.ushell.Container.getUser");var A=c.getOwnerComponent();var C=A.getAppComponent();var H=C.getMetadata();var U=H.getManifestEntry("sap.ui");var J=(U&&U.icons&&U.icons.icon)||"";var K=H.getManifestEntry("sap.app");var T=(K&&K.title)||"";return{serviceUrl:F.getServiceUrl(),icon:J,title:T,isShareInJamActive:!!G&&G().isJamActive(),customUrl:S.getCustomUrl()};}};S.openSharePopup(t.oCommonUtils,B,F);var i=this.getView().byId("template::Share");var z=this.getView().byId("bookmarkButton");z.setBeforePressHandler(function(){i.focus();});}return{onInit:function(){var A=c.getOwnerComponent().getAppComponent();var i=A.getConfig();s.oWorklistData.bWorkListEnabled=!!i.pages[0].component.settings&&i.pages[0].component.settings.isWorklist;s.oSmartFilterbar=c.byId("listReportFilter");s.oSmartTable=c.byId("listReport");s.updateControlOnSelectionChange=u;f=t.oComponentUtils.getFclProxy();s.bLoadListAndFirstEntryOnStartup=f.isListAndFirstEntryLoadedOnStartup();s.oMultipleViewsHandler=new M(s,c,t);s.oWorklistHandler=new W(s,c,t);s.oIappStateHandler=new I(s,c,t);if(s.oWorklistData.bWorkListEnabled){s.oWorklistHandler.fetchAndSaveWorklistSearchField();}var T=t.oComponentUtils.getTemplatePrivateModel();T.setProperty("/generic/bDataAreShownInTable",false);T.setProperty("/listReport/isHeaderExpanded",true);T.setProperty("/listReport/deleteEnabled",false);T.setProperty("/listReport/activeObjectEnabled",false);T.setProperty("/listReport/vDraftState","0");T.setProperty("/listReport/multipleViews/msgVisibility",false);t.oServices.oApplication.registerStateChanger({isStateChange:s.oIappStateHandler.isStateChange});v.getUrlParameterInfo=s.oIappStateHandler.getUrlParameterInfo;v.getItems=function(){var z=s.oSmartTable.getTable();if(t.oCommonUtils.isUiTable(z)){return z.getRows();}return z.getItems();};v.displayNextObject=function(z){return new Promise(function(B,C){w={aWaitingObjects:z,resolve:B,reject:C};});};v.onComponentActivate=function(){if(!b){s.oIappStateHandler.parseUrlAndApplyAppState();}};v.refreshBinding=function(U,z){if(s.oIappStateHandler.areDataShownInTable()){if(s.oMultipleViewsHandler.refreshOperation(2,null,!U&&z)){return;}if(U||z[s.oSmartTable.getEntitySet()]){t.oCommonUtils.refreshModel(s.oSmartTable);t.oCommonUtils.refreshSmartTable(s.oSmartTable);}}};e();c.byId("template::FilterText").attachBrowserEvent("click",function(){c.byId("page").setHeaderExpanded(true);});},handlers:{addEntry:q,addEntryWithFilters:x,deleteEntries:D,updateTableTabCounts:function(){s.oMultipleViewsHandler.fnUpdateTableTabCounts();},onSelectionChange:function(i){var T=i.getSource();u(T);},onMultiSelectionChange:function(i){t.oCommonEventHandlers.onMultiSelectionChange(i);},onSmartFieldUrlPressed:function(i){t.oCommonEventHandlers.onSmartFieldUrlPressed(i,s);},onContactDetails:function(i){t.oCommonEventHandlers.onContactDetails(i);},onSmartFilterBarInitialise:o,onSmartFilterBarInitialized:g,onBeforeSFBVariantFetch:function(){s.oIappStateHandler.onBeforeSFBVariantFetch();},onAfterSFBVariantSave:function(){s.oIappStateHandler.onAfterSFBVariantSave();},onAfterSFBVariantLoad:function(i){s.oIappStateHandler.onAfterSFBVariantLoad(i);},onDataRequested:function(){s.oMultipleViewsHandler.onDataRequested();},onDataReceived:function(z){t.oCommonEventHandlers.onDataReceived(z);if(w){var A;var B=false;for(var i=0;i<w.aWaitingObjects.length&&!B;i++){A=n(w.aWaitingObjects[i]);if(A){N(A);w.resolve();B=true;}}if(!B){A=n();if(A){N(A);w.resolve();}else{w.reject();}}w=null;return;}var T=z.getSource().getTable();f.handleDataReceived(T,N);},onSmartChartDataReceived:function(){s.oMultipleViewsHandler.onDataRequested();},onBeforeRebindTable:function(i){var B=i.getParameters().bindingParams;s.oMultipleViewsHandler.aTableFilters=d({},B.filters);var F=B.filters.slice(0);t.oCommonEventHandlers.onBeforeRebindTable(i,{determineSortOrder:s.oMultipleViewsHandler.determineSortOrder,ensureExtensionFields:c.templateBaseExtension.ensureFieldsForSelect,addExtensionFilters:c.templateBaseExtension.addFilters,resolveParamaterizedEntitySet:s.oMultipleViewsHandler.fnResolveParameterizedEntitySet});c.onBeforeRebindTableExtension(i);s.oMultipleViewsHandler.onRebindContentControl(B,F);l.handleErrorsOnTableOrChart(t,i);},onListNavigate:function(i){t.oCommonEventHandlers.onListNavigate(i,s,c.onListNavigationExtension.bind(c));},onCallActionFromToolBar:function(i){t.oCommonEventHandlers.onCallActionFromToolBar(i,s);},onDataFieldForIntentBasedNavigation:function(i){t.oCommonEventHandlers.onDataFieldForIntentBasedNavigation(i,s);},onDataFieldWithIntentBasedNavigation:function(i){t.oCommonEventHandlers.onDataFieldWithIntentBasedNavigation(i,s);},onBeforeSemanticObjectLinkPopoverOpens:function(i){var z=i.getParameters();t.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){var A=JSON.stringify(s.oSmartFilterbar.getUiState().getSelectionVariant());t.oCommonUtils.semanticObjectLinkNavigation(z,A,c);},Function.prototype,s,Function.prototype);},onSemanticObjectLinkNavigationPressed:j,onSemanticObjectLinkNavigationTargetObtained:k,onSemanticObjectLinkNavigationTargetObtainedSmartLink:m,onDraftLinkPressed:function(i){var B=i.getSource();var z=B.getBindingContext();t.oCommonUtils.showDraftPopover(z,B);},onAssignedFiltersChanged:function(i){if(i.getSource()){c.byId("template::FilterText").setText(i.getSource().retrieveFiltersWithValuesAsText());}},onFilterChange:h,onToggleFiltersPressed:function(){var T=t.oComponentUtils.getTemplatePrivateModel();T.setProperty("/listReport/isHeaderExpanded",!T.getProperty("/listReport/isHeaderExpanded"));},onSearchButtonPressed:function(){t.oCommonUtils.refreshModel(s.oSmartTable);s.oIappStateHandler.changeIappState(false,true);},onSemanticObjectLinkPopoverLinkPressed:function(i){t.oCommonEventHandlers.onSemanticObjectLinkPopoverLinkPressed(i,s);},onAfterTableVariantSave:function(){s.oIappStateHandler.onAfterTableVariantSave();},onAfterApplyTableVariant:function(){if(!b){s.oIappStateHandler.onAfterApplyTableVariant();}},onAfterChartVariantSave:function(i){s.oIappStateHandler.onAfterTableVariantSave();},onAfterApplyChartVariant:function(i){if(!b){s.oIappStateHandler.onAfterApplyTableVariant();}},onBeforeRebindChart:function(i){var B=i.getParameters().bindingParams;s.oMultipleViewsHandler.aTableFilters=d({},B.filters);var F=B.filters.slice(0);var z=i.getSource();var C={setBindingPath:z.setChartBindingPath.bind(z),ensureExtensionFields:Function.prototype,addExtensionFilters:c.templateBaseExtension.addFilters,resolveParamaterizedEntitySet:s.oMultipleViewsHandler.fnResolveParameterizedEntitySet,isFieldControlRequired:false};t.oCommonUtils.onBeforeRebindTableOrChart(i,C,s.oSmartFilterbar);c.onBeforeRebindChartExtension(i);s.oMultipleViewsHandler.onRebindContentControl(B,F);l.handleErrorsOnTableOrChart(t,i);},onChartInitialized:function(i){r(i);t.oCommonUtils.checkToolbarIntentsSupported(i.getSource());},onSelectionDetailsActionPress:function(i){s.oMultipleViewsHandler.onDetailsActionPress(i);},onShareListReportActionButtonPress:function(i){t.oCommonUtils.executeIfControlReady(y,"template::Share");},onInlineDataFieldForAction:function(i){t.oCommonEventHandlers.onInlineDataFieldForAction(i,s);},onInlineDataFieldForIntentBasedNavigation:function(i){t.oCommonEventHandlers.onInlineDataFieldForIntentBasedNavigation(i.getSource(),s);},onDeterminingDataFieldForAction:function(i){t.oCommonEventHandlers.onDeterminingDataFieldForAction(i,s.oSmartTable);},onDeterminingDataFieldForIntentBasedNavigation:function(i){var B=i.getSource();t.oCommonEventHandlers.onDeterminingDataFieldForIntentBasedNavigation(B,s.oSmartTable.getTable(),s);},onTableInit:function(i){var z=i.getSource();t.oCommonUtils.checkToolbarIntentsSupported(z);},onSearchWorkList:function(i){s.oWorklistHandler.performWorklistSearch(i);},onWorkListTableSettings:function(i){s.oWorklistHandler.openWorklistPersonalisation(i);},onActiveButtonPress:function(i){var P=c.byId("template::PageVariant");var T=t.oComponentUtils.getTemplatePrivateModel();var A=T.getProperty("/listReport/activeObjectEnabled");T.setProperty("/listReport/activeObjectEnabled",!A);P.currentVariantSetModified(true);s.oSmartFilterbar.search();s.oIappStateHandler.changeIappState(true,true);},onStateFilterChange:function(i){var T=t.oComponentUtils.getTemplatePrivateModel();var z=i.getSource().getSelectedKey();T.setProperty("/listReport/vDraftState",z);}},formatters:{formatDraftType:function(i,z,H){if(i&&i.DraftUUID){if(!z){return sap.m.ObjectMarkerType.Draft;}else if(H){return i.InProcessByUser?sap.m.ObjectMarkerType.Locked:sap.m.ObjectMarkerType.Unsaved;}}return sap.m.ObjectMarkerType.Flagged;},formatDraftVisibility:function(i,z){if(i&&i.DraftUUID){if(!z){return sap.m.ObjectMarkerVisibility.TextOnly;}}return sap.m.ObjectMarkerVisibility.IconAndText;},formatDraftLineItemVisible:function(i,A,z){if(i&&i.DraftUUID){if(z==="0"&&A){return false;}return true;}return false;},formatDraftOwner:function(i,H){var z="";if(i&&i.DraftUUID&&H){var U=i.InProcessByUserDescription||i.InProcessByUser||i.LastChangedByUserDescription||i.LastChangedByUser;if(U){z=t.oCommonUtils.getText("ST_DRAFT_OWNER",[U]);}else{z=t.oCommonUtils.getText("ST_DRAFT_ANOTHER_USER");}}return z;},formatItemTextForMultipleView:function(i){return s.oMultipleViewsHandler?s.oMultipleViewsHandler.formatItemTextForMultipleView(i):"";},formatMessageStrip:function(i,z){return s.oMultipleViewsHandler?s.oMultipleViewsHandler.formatMessageStrip(i,z):"";}},extensionAPI:new E(t,c,s)};}};});
