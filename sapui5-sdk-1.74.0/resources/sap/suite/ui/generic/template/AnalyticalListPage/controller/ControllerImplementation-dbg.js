/* global window sap */
sap.ui.define(["sap/ui/generic/app/navigation/service/SelectionVariant",
	"sap/suite/ui/generic/template/AnalyticalListPage/extensionAPI/ExtensionAPI",
	"sap/suite/ui/generic/template/AnalyticalListPage/controller/FilterBarController",
	"sap/suite/ui/generic/template/AnalyticalListPage/controller/ToolbarController",
	"sap/suite/ui/generic/template/AnalyticalListPage/controller/VisualFilterBarController",
	"sap/suite/ui/generic/template/AnalyticalListPage/controller/VisualFilterDialogController","sap/suite/ui/generic/template/AnalyticalListPage/controller/AnalyticGridController",
	"sap/ui/table/AnalyticalTable",
	"sap/ui/model/odata/AnnotationHelper",
	"sap/ui/model/analytics/odata4analytics",
	"sap/suite/ui/generic/template/AnalyticalListPage/controller/ContentAreaController",
	"sap/suite/ui/generic/template/AnalyticalListPage/controller/IappStateHandler",
	"sap/ui/Device",
	"sap/m/SegmentedButtonItem",
	"sap/m/SegmentedButton",
	"sap/m/OverflowToolbar",
	"sap/m/ToolbarSpacer",
	"sap/m/library",
	"sap/ui/model/Context",
	"sap/suite/ui/generic/template/AnalyticalListPage/util/AnnotationHelper",
	"sap/base/Log",
	"sap/suite/ui/generic/template/AnalyticalListPage/util/FilterUtil",
	"sap/base/util/ObjectPath",
	"sap/suite/ui/generic/template/lib/ShareUtils",
	"sap/base/util/merge",
	"sap/base/util/deepExtend"
], function(SelectionVariant, ExtensionAPI,
			FilterBarController, ToolbarController, VisualFilterBarController, VisualFilterDialogController, AnalyticGridController, AnalyticalTable,
			ODataAnnotationHelper, Analytics, ContentAreaController, IappStateHandler, Device, SegmentedButtonItem, SegmentedButton,
			OverflowToolbar, ToolbarSpacer, SapMLibrary, Context, ALPHelper, Log, FilterUtil, ObjectPath, ShareUtils, merge, deepExtend) {
		"use strict";

		// Constants which are used as property names for storing custom filter data and generic filter data
		var CONTAINER_VIEW_CHART	= "chart",
			FILTER_MODE_VISUAL      = "visual",
			FILTER_MODE_COMPACT     = "compact",
			COZY_MIN_RESOLUTION     = 900;//in px
		return {
			getMethods: function(oViewProxy, oTemplateUtils, oController) {
				var oState = {};// contains attributes oSmartFilterbar and oSmartTable. Initialized in onInit.
				oState.bVisualFilterInitialised = false;
				oState._bIsStartingUp = true;
				// -- Begin of methods that are used in onInit only
				function fnSetIsLeaf() {
					var oComponent = oController.getOwnerComponent();
					var oTemplatePrivateModel = oComponent.getModel("_templPriv");
					oTemplatePrivateModel.setProperty("/listReport/isLeaf", oComponent.getIsLeaf());
				}
				// -- End of used in onInit only

				function determineDefaultValues(oEntityType, sTerm) {
					var aProperties = oEntityType && oEntityType.property;
					return aProperties.filter(function(property) {
						return typeof property[sTerm] !== "undefined";
					});
				}

				//create SV object
				function createSVObject (oSelectionVariantFromAnnotation) { //TODO: Revisit this and discuss with the FilterBar the possibility of setting UIState with SV that you get from annotation
					var oSelectOptions = oSelectionVariantFromAnnotation.SelectOptions, oParameters = ALPHelper.resolveParameterStringValue(oSelectionVariantFromAnnotation.Parameters);
					var oDummyContext = new Context(null, "/");
					var oDefaultSV = {};

					if (oSelectOptions) {
						oSelectOptions.forEach(function(selectOption) {
							selectOption.PropertyName = selectOption.PropertyName.PropertyPath;
							selectOption.Ranges.forEach(function(range) {
								range.Sign = range.Sign.EnumMember.split("/")[1];
								range.Option = range.Option.EnumMember.split("/")[1];
								// AnnotationHelper can do the conversion
								range.Low = FilterUtil.resolveSelectOptionValue(oDummyContext, range.Low);
								range.High = FilterUtil.resolveSelectOptionValue(oDummyContext, range.High);
							});
						});
						oDefaultSV.SelectOptions = oSelectOptions;
					}
					if (oParameters) {
						oParameters.forEach(function(parameter) {
							parameter.PropertyName = parameter.PropertyName.PropertyPath;
							parameter.PropertyValue = ODataAnnotationHelper.format(oDummyContext, parameter.PropertyValue) || null;
						});
						oDefaultSV.Parameters = oParameters;
					}
					return new SelectionVariant(oDefaultSV);
				}

				function createDefaultFilter(oSmartFilterbar) {
					var oModel = oSmartFilterbar.getModel(),
						oMetaModel = oModel && oModel.getMetaModel(),
						oResultEntityType = oMetaModel && oMetaModel.getODataEntityType(oSmartFilterbar.getEntityType()),
						oDataSuiteFormat,
						sResultEntityType = oMetaModel && oMetaModel.getODataEntityType(oSmartFilterbar.getEntityType(), true),
						oSV = ALPHelper.createSVAnnotation(oResultEntityType, oMetaModel, oState.oController.getOwnerComponent().getQualifier());
					if (oState.oController.getOwnerComponent().getFilterDefaultsFromSelectionVariant() && oSV) {
						//if there is SV, then create the object
						oDataSuiteFormat = createSVObject(merge({}, oSV));
					} else {
						if (oState.oController.getOwnerComponent().getFilterDefaultsFromSelectionVariant() && !oSV) {//Log warning only if filterDefaultsFromSelectionVarian setting is true but there is no SV in the annotations
							Log.warning("No SelectionVariant found in the annotation : No default values filled in FilterBar", "", "ALPSmartFilterBar");
						}
						var aResultDefaultProperties = oResultEntityType && determineDefaultValues(oResultEntityType, "com.sap.vocabularies.Common.v1.FilterDefaultValue"),
							o4AnaModel, oParameterization, oParameterEntitySet, oParameterEntityType,
							oQueryResult, aParameterDefaultProperties = [];

						try {
							//Find the parameter set and check the properties
							o4AnaModel = new Analytics.Model(new Analytics.Model.ReferenceByModel(oModel));
							oQueryResult = o4AnaModel && o4AnaModel.findQueryResultByName(oSmartFilterbar.getEntitySet());
							oParameterization = oQueryResult && oQueryResult.getParameterization();
							oParameterEntitySet = oParameterization && oMetaModel.getODataEntitySet(oParameterization.getEntitySet().getQName());
							oParameterEntityType = oParameterEntitySet && oMetaModel.getODataEntityType(oParameterEntitySet.entityType);
							aParameterDefaultProperties = oParameterEntityType ? determineDefaultValues(oParameterEntityType, "defaultValue") : [];
						} catch (e) {
							Log.error(e);
						}
						if (aResultDefaultProperties.length > 0 || aParameterDefaultProperties.length > 0) {
							oDataSuiteFormat = new SelectionVariant();
							aResultDefaultProperties.forEach(function (property) {
								var oContext = oMetaModel.createBindingContext(sResultEntityType + "/property/[${path:'name'}===\'" + property.name + "']/com.sap.vocabularies.Common.v1.FilterDefaultValue");
								oDataSuiteFormat.addSelectOption(property.name, "I", "EQ", ODataAnnotationHelper.format(oContext));
							});
							aParameterDefaultProperties.forEach(function (property) {
								oDataSuiteFormat.addParameter(property.name, property.defaultValue);
							});
						}
					}
					return oDataSuiteFormat;
				}

				function onSmartFilterBarInitialise(oEvent){
					var oSmartFilterbar = oEvent.getSource(),
						oDefaultFilterSuiteFormat = createDefaultFilter(oSmartFilterbar); //TODO: Refactor the code so that this is done only in the case of initial load + Standard Variant.
					//Set default values if available
					if (oDefaultFilterSuiteFormat) {
						oState.oIappStateHandler.fnSetFiltersUsingUIState(oDefaultFilterSuiteFormat.toJSONObject(), true, false);
					}
					oState.oIappStateHandler.onSmartFilterBarInitialise();
					oController.onInitSmartFilterBarExtension(oEvent);
					oController.templateBaseExtension.onInitSmartFilterBar(oEvent);
				}
				function onSmartFilterBarInitialized(){
					var oAppStatePromise = oState.oIappStateHandler.onSmartFilterBarInitialized();
					oAppStatePromise.then(function(){
						oState._bIsStartingUp = false;
						//visual filter config and bindings must be updated after vf has been initialised
						if (oState.bVisualFilterInitialised) {
							oState.oIappStateHandler.fnUpdateVisualFilterBar();
						}

					}, function(oError){ // improve?
						if (oError instanceof Error) {
							oError.showMessageBox(); // improve?
						}
						oState.oIappStateHandler.fnOnError();
						oState._bIsStartingUp = false;

					}).finally(function(){
						if (oState.oSmartFilterableKPI) {
							var oContent = oState.oSmartFilterableKPI.getContent();
							oContent.forEach(function(oItem) {
								if (oItem.getSmartFilterId) {
									oItem._bStopDataLoad  = false;
									oItem._updateKpiList(true);
								}
							});
						}
					});
				}

				// selectionChange for MultiSelectionPlugin
				function fnOnMultiSelectionChange(oEvent) {
					var oPlugin = oEvent.getSource(),
						bLimitReached = oEvent.getParameters().limitReached,
						iIndices = oPlugin.getSelectedIndices(),
						sMessage, oTable;

					if (iIndices.length > 0) {
						if (bLimitReached) {
							//sMessage = oTemplateUtils.oCommonUtils.getText("ST_SELECTION_LIMIT_REACHED", [oPlugin.getLimit()]);
							sMessage = "Your last selection was limited to the maximum of " + oPlugin.getLimit() + " items."; //TODO i18n
							oTemplateUtils.oServices.oApplication.showMessageToast(sMessage);
							//oPopoverDialog = new sap.m.Popover("", {	}); //TODO
						}
					}
					oTable = oPlugin.getParent();
					oTemplateUtils.oCommonUtils.setEnabledToolbarButtons(oTable);
				}

				function fnOnSemanticObjectLinkNavigationPressed(oEvent){
					var oEventParameters = oEvent.getParameters();
					var oEventSource = oEvent.getSource();
					oTemplateUtils.oCommonEventHandlers.onSemanticObjectLinkNavigationPressed(oEventSource, oEventParameters);
				}

				function fnOnSemanticObjectLinkNavigationTargetObtained(oEvent) {
					var oEventParameters, oEventSource;
					oEventParameters = oEvent.getParameters();
					oEventSource = oEvent.getSource();	//set on semanticObjectController
					oTemplateUtils.oCommonEventHandlers.onSemanticObjectLinkNavigationTargetObtained(oEventSource, oEventParameters, oState, undefined, undefined);
				}
				function onShareListReportActionButtonPressImpl(oButton) {
					var oFragmentController = {
						shareEmailPressed: function() {
							var sSubject = oTemplateUtils.oCommonUtils.getText("EMAIL_HEADER", [ oTemplateUtils.oServices.oApplication.getAppTitle() ]);

							sap.m.URLHelper.triggerEmail(null, sSubject, document.URL);
						},

						shareJamPressed: function() {
							ShareUtils.openJamShareDialog(oTemplateUtils.oServices.oApplication.getAppTitle());
						},

						getDownloadUrl: function() {
							var oTable = oState.oSmartTable.getTable();
							var oBinding = oTable.getBinding("rows") || oTable.getBinding("items");

							return oBinding && oBinding.getDownloadUrl() || "";
						},

						getServiceUrl: function() {
							var sServiceUrl = oFragmentController.getDownloadUrl();
							if (sServiceUrl) {
								sServiceUrl += "&$top=0&$inlinecount=allpages";
							}

							var oShareInfo = {
								serviceUrl: sServiceUrl
							};

							if (oController.onSaveAsTileExtension) {
								oController.onSaveAsTileExtension(oShareInfo);
							}

							return oShareInfo.serviceUrl;
						},

						getModelData: function() {
							var fnGetUser = ObjectPath.get("sap.ushell.Container.getUser");
							var oOwnerComponent = oController.getOwnerComponent();
							var oAppComponent = oOwnerComponent.getAppComponent();
							var oMetadata = oAppComponent.getMetadata();

							var oUIManifest = oMetadata.getManifestEntry("sap.ui");
							var sIcon = (oUIManifest && oUIManifest.icons && oUIManifest.icons.icon) || "";
							var oAppManifest = oMetadata.getManifestEntry("sap.app");
							var sTitle = (oAppManifest && oAppManifest.title) || "";

							return {
								serviceUrl: oFragmentController.getServiceUrl(),
								icon: sIcon,
								title: sTitle,
								isShareInJamActive: !!fnGetUser && fnGetUser().isJamActive(),
								customUrl: ShareUtils.getCustomUrl()
							};
						}
					};

					ShareUtils.openSharePopup(oTemplateUtils.oCommonUtils, oButton, oFragmentController);
					var oBookmarkButton = this.getView().byId("bookmarkButton");
					oBookmarkButton.setBeforePressHandler(function() {
						// set the focus to share button
						oButton.focus();
					});
				}
				// Generation of Event Handlers
				return {
					onInit: function() {
						var oComponent = oController.getOwnerComponent();
						//By default the log level is set to ERROR and warning messages dont appear in the console. Lowering the level only for the case where warning is logged due to undefined SV
						Log.setLevel(Log.Level.WARNING, "ALPSmartFilterBar");
						var oTemplatePrivateModel = oComponent.getModel("_templPriv");
						oTemplatePrivateModel.setProperty("/alp", {
							filterMode: oComponent.getHideVisualFilter() ? FILTER_MODE_COMPACT : oComponent.getDefaultFilterMode(),
							contentView: oComponent.getDefaultContentView(),
							autoHide: oComponent.getAutoHide(),
							visibility: {
								hybridView: (Device.system.phone || Device.system.tablet && !Device.system.desktop) ? false : true
							},
							filterChanged : false
						});
						oState.hideVisualFilter = oComponent.getHideVisualFilter();
						oState.hideVisualFilter = (oState.hideVisualFilter === undefined || oState.hideVisualFilter !== true) ? false : true;

						oState.oSmartFilterbar = oController.byId("template::SmartFilterBar");
						oState.oSmartTable = oController.byId("table");
						oState.oSmartFilterableKPI = oController.byId("template::KPITagContainer::filterableKPIs");
						oState.oPage = oController.byId("template::Page");
						oState.oSmartChart = oController.byId("chart");
						if (oController.getOwnerComponent().getProperty("dshQueryName")) {
							oState.oAnalyticGridContainer = oController.byId("template::AnalyticGridContainer");
							oState.oAnalyticGridController = new AnalyticGridController();
							oState.oAnalyticGridController.setState(oState);
						}
						oState.alr_compactFilterContainer = oController.byId("template::CompactFilterContainer");
						oState.alr_visualFilterContainer = oController.byId("template::VisualFilterContainer");
						oState.alr_filterContainer = oController.byId("template::FilterContainer");
						oState.alr_visualFilterBar = oController.byId("template::VisualFilterBar");
						oState.alp_ColumnListItem = oController.byId("template::responsiveHightlightCol");

						if (oState.alr_visualFilterBar) {
							oState.alr_visualFilterBar.setSmartFilterId(oState.oSmartFilterbar.getId());
							oState.alr_visualFilterBar.attachOnFilterItemAdded(function(oEvent) {
								var oFilterItem = oEvent.getParameters();
								oFilterItem.attachBeforeRebindVisualFilter(function(oEvt) {
									var mParams = oEvt.getParameters();
									var sEntityType = mParams.sEntityType;
									var sDimension = mParams.sDimension;
									var sMeasure = mParams.sMeasure;
									var oContext = mParams.oContext;

									var oExtController = oState.oController;
									oExtController.onBeforeRebindVisualFilterExtension(sEntityType, sDimension, sMeasure, oContext);
								});
							});
						}
						oState.oKpiTagContainer = oController.byId("template::KPITagContainer::globalKPIs");
						oState.oFilterableKpiTagContainer = oController.byId("template::KPITagContainer::filterableKPIs");
						if (oState.oKpiTagContainer || oState.oFilterableKpiTagContainer) {
							sap.ui.require(["sap/suite/ui/generic/template/AnalyticalListPage/controller/KpiTagController"], function (oKpiTagController) {
								oKpiTagController.init(oState);
							});
						}
						oState.oContentArea = new ContentAreaController();
						oState.oTemplateUtils = oTemplateUtils;
						oState.toolbarController = new ToolbarController();
						oState.oController = oController;
						oState.filterBarController = new FilterBarController();
						oState.filterBarController.init(oState);
						oState.oContentArea.createAndSetCustomModel(oState);
						oState.oContentArea.setState(oState);

						if (!oState.hideVisualFilter) {
							oState.visualFilterBarContainer = new VisualFilterBarController();
							oState.visualFilterBarContainer.init(oState);
						}
						// adding custom filter value after rendering of visual filter values.
						// BCP: 1980291471
						if (oState.alr_visualFilterBar) {
							oState.alr_visualFilterBar.addEventDelegate({
								onAfterRendering : function () {
									if (oState.oSmartFilterbar.isInitialised()) {
										oState.oSmartFilterbar.setFilterData({
											_CUSTOM : oState.oIappStateHandler.getFilterState()
										});
									}
								}
							});
						}

						oState.oIappStateHandler = new IappStateHandler(oState, oController, oTemplateUtils.oCommonUtils.getNavigationHandler());
						fnSetIsLeaf();

						oController.byId("template::FilterText").attachBrowserEvent("click", function () {
							oController.byId("template::Page").setHeaderExpanded(true);
						});

						oTemplatePrivateModel.setProperty("/listReport/isHeaderExpanded", true);

						//Making Condense is the default mode in ALP,but in List Report Compact is the default
						//compare the following logic with Application.js->getContentDensityClass:
						if (oState.oSmartTable) {
							var oTable = oState.oSmartTable.getTable();
						}
						var sCozyClass = "sapUiSizeCozy", sCompactClass = "sapUiSizeCompact", sCondensedClass = "sapUiSizeCondensed";
						if (oTemplateUtils.oCommonUtils.isUiTable(oTable) || oTable instanceof AnalyticalTable) {
							var oView = oController.getView();
							var oBody = document.body;
							if (oBody.classList.contains(sCozyClass) || oView.hasStyleClass(sCozyClass)){
								oState.oSmartTable.addStyleClass(sCozyClass);
							} else if (oBody.classList.contains(sCompactClass) || oView.hasStyleClass(sCompactClass)) {
								var bCondensedTableLayout = oComponent.getComponentContainer().getSettings().condensedTableLayout;
								if (bCondensedTableLayout === false) {
									oState.oSmartTable.addStyleClass(sCompactClass);
								} else {
									oState.oSmartTable.addStyleClass(sCondensedClass);
								}
							}
						}

						//to attach onBeforeRebindFilterableKPIExtension and also assign the _templPriv model to FilterableKPITag container
						if (oState.oSmartFilterableKPI) {
							oState.oSmartFilterableKPI.setModel(oComponent.getModel("_templPriv"), "_templPriv");
							var oContent = oState.oSmartFilterableKPI.getContent(),
								oExtController = oState.oController;
							oContent.forEach(function(oItem) {
								if (oItem.getSmartFilterId) {
									oItem.attachBeforeRebindFilterableKPI(function(oEvent) {
										var oParams = oEvent.getParameters(),
											oSelectionVariant = oParams.selectionVariant,
											sEntityType = oParams.entityType,
											sKPIId = oEvent.getSource().getId();
										oExtController.onBeforeRebindFilterableKPIExtension(oSelectionVariant, sEntityType, sKPIId);
									}, oExtController);
								}
							});
						}

						/**
						 * This function return the URL parameter info
						 * @return {promise}
						 */
						oViewProxy.getUrlParameterInfo = function(){
							return oState.oIappStateHandler.getUrlParameterInfo();
						};

						// Give component access to below methods via oViewProxy
						oViewProxy.onComponentActivate = function(){
							//TODO Need to implements this as ListReport has implemented.
							//require to implements IappStateHandler to be implemented in ALP.
							/*if (!oState._bIsStartingUp){
								oIappStateHandler.parseUrlAndApplyAppState();
							}*/
						};
						//
						oViewProxy.refreshBinding = function(){
							//Update Binding in chart Items in Smart Filter Bar
							if (oState.alr_visualFilterBar && oState.alr_visualFilterBar.updateVisualFilterBindings) {
								oState.alr_visualFilterBar.updateVisualFilterBindings();
							}
							// Rebind chart
							if (oState.oSmartChart && oState.oSmartChart.rebindChart) {
								oState.oSmartChart.rebindChart();
							}
							// Rebind table
							if (oState.oSmartTable) {
								oTemplateUtils.oCommonUtils.refreshSmartTable(oState.oSmartTable);
							}
							//Refresh Global Kpi
							if (oState.oKpiTagContainer) {
								var aContent = oState.oKpiTagContainer.mAggregations.content;
								for (var i in aContent){
									if (aContent[i]._createGlobalKpi) {
										aContent[i]._createGlobalKpi();
									}
								}
							}
							//Refresh Filterable Kpi
							if (oState.oFilterableKpiTagContainer) {
								var aContent = oState.oFilterableKpiTagContainer.mAggregations.content;
								for (var i in aContent){
									if (aContent[i]._createFilterableKpi) {
										aContent[i]._createFilterableKpi();
									}
								}
							}

						};
						if (oState.alr_visualFilterBar) {
							oState.alr_visualFilterBar.attachInitialized(function(oEvent) {
								oState.bVisualFilterInitialised = true;
								if (!oState._bIsStartingUp) {
									oState.oIappStateHandler.fnUpdateVisualFilterBar(true);
								}
							});
						}
						//Update filter model so that UI can adapt on each filter change
						oState.oSmartFilterbar.attachFilterChange(function(oEvent) {
							var oTemplatePrivateModel = oComponent.getModel("_templPriv");
							// check if search can be performed or not after filter change
							oState.oIappStateHandler.fnCheckMandatory();	//Check and update searchable property
							var bIsDialogOpen = oState.oSmartFilterbar.isDialogOpen();
							var sfb  = oEvent.getSource(), oAllFilterData; //, filterbarModel, filterDialogModel;
							// get filter data for all fields so that model change via two-way binding does not
							// re-trigger set dimension filter in visual filter
							oAllFilterData = deepExtend({}, sfb.getFilterData(true));
							if (bIsDialogOpen && oState.visualFilterDialogContainer) {//check for presence of vf dialog as it is absent in case of hideVisualfilter=true
								var filterDialogModel = oState.visualFilterDialogContainer.oVerticalBox.getModel("_dialogFilter");
								filterDialogModel.setData(oAllFilterData);
							} else {
								var filterbarModel = oState.oController.getOwnerComponent().getModel("_filter");
								filterbarModel.setData(oAllFilterData);
							}
							if (oEvent.getParameters().filterItem) { // call changeVisibility() only if a filterItem is added or deleted
								if (!oState.hideVisualFilter) {
									oState.filterBarController.changeVisibility(oEvent);
								}
								// BCP: 1770556353 - When visibility of filter item is changed in dialog, search is triggered.
								//chart rebind is prevented; however table is rebound. In this case chart selection must be applied to table.
								oTemplatePrivateModel.setProperty('/alp/_ignoreChartSelections', false);
							}
							oState.filterBarController._updateFilterLink();
							if (!oState.oSmartFilterbar.isLiveMode() && !oState.oSmartFilterbar.isDialogOpen()) {
								if (oState.oSmartFilterableKPI && oState.oSmartFilterableKPI.getEnabled()) {
									oTemplatePrivateModel.setProperty('/alp/filterChanged', true);
								}
							}
						});

						var oView = oController.getView();
						var oBody = document.body;
						var bIsCozyMode, defaultView;
						if (oBody.classList.contains(sCozyClass) || oView.hasStyleClass(sCozyClass)){
							bIsCozyMode = true;
						}
						if (bIsCozyMode && oComponent.getTableType() !== "ResponsiveTable") {
							var templPrivModel = oComponent.getModel("_templPriv");
							if (Device.resize.height <= COZY_MIN_RESOLUTION) {
								defaultView = templPrivModel.getProperty('/alp/contentView');
								templPrivModel.setProperty('/alp/enableHybridMode', false);
								templPrivModel.setProperty('/alp/contentView', defaultView === "charttable" ? "chart" : defaultView);
							}
							oState.resizeHandler = function(mParams) {
								var windowHeight = mParams.height;
								if (windowHeight <= COZY_MIN_RESOLUTION) {
									defaultView = templPrivModel.getProperty('/alp/contentView');
									templPrivModel.setProperty('/alp/enableHybridMode', false);
									templPrivModel.setProperty('/alp/contentView', defaultView === "charttable" ? "chart" : defaultView);
								} else {
									templPrivModel.setProperty('/alp/enableHybridMode', true);
								}
							};
							Device.resize.attachHandler(oState.resizeHandler);
						}
					},

					onExit: function() {
						if (oState.resizeHandler) {
							Device.resize.detachHandler(oState.resizeHandler);
						}
					},

					handlers: {
						onBack: function() {
							oTemplateUtils.oServices.oNavigationController.navigateBack();
						},
						addEntry: function(oEvent) {
							var oEventSource = oEvent.getSource();
							oTemplateUtils.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){
								oTemplateUtils.oCommonEventHandlers.addEntry(oEventSource, false, oState.oSmartFilterbar);
							}, Function.prototype, oState);
						},
						deleteEntries: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.deleteEntries(oEvent);
						},
						onSelectionChange: function(oEvent) {
							var oTable = oEvent.getSource(),
								oModel = oTable.getModel(),
								oPrivModel = oTable.getModel("_templPriv");

							var oMetaModel = oModel.getMetaModel(),
								oEntitySet = oMetaModel.getODataEntitySet(this.getOwnerComponent().getEntitySet()),
								oDeleteRestrictions = oEntitySet["Org.OData.Capabilities.V1.DeleteRestrictions"];

							var sDeletablePath = (oDeleteRestrictions && oDeleteRestrictions.Deletable && oDeleteRestrictions.Deletable.Path) ? oDeleteRestrictions.Deletable.Path : "";
							var bDeleteEnabled = false;

							var bAllLocked = true;
							var bAllNotDeletable = (sDeletablePath && sDeletablePath !== ""); // if Deletable-Path is undefined, then the items are deletable.

							var aContexts = oTemplateUtils.oCommonUtils.getSelectedContexts(oTable);
							if (aContexts.length > 0) {
								for (var i = 0; i < aContexts.length; i++) {
									var oObject = oModel.getObject(aContexts[i].getPath());

									// check if item is locked
									if (!(oObject.IsActiveEntity && oObject.HasDraftEntity && oObject.DraftAdministrativeData && oObject.DraftAdministrativeData.InProcessByUser)) {
										bAllLocked = false;
									}
									// check if item is deletable
									if (bAllNotDeletable) {
										if (oModel.getProperty(sDeletablePath, aContexts[i])) {
											bAllNotDeletable = false;
										}
									}
									if (!bAllLocked && !bAllNotDeletable) {
										bDeleteEnabled = true;
										break;
									}
								}
							}
							oPrivModel.setProperty("/listReport/deleteEnabled", bDeleteEnabled);

						},
						onMultiSelectionChange: fnOnMultiSelectionChange,

						onChange: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onChange(oEvent);
						},
						onSmartFieldUrlPressed: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onSmartFieldUrlPressed(oEvent, oState);
						},
						onContactDetails: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onContactDetails(oEvent);
						},
						onSmartFilterBarInitialise: onSmartFilterBarInitialise,
						onSmartFilterBarInitialized: onSmartFilterBarInitialized,

						onEditStateFilterChanged: function(oEvent) {
							oEvent.getSource().fireChange();
						},
						onFilterPress: function(oEvent){
							oState.filterBarController.showDialog.call(oState.filterBarController);
						},
						onClearPress: function(oEvent){
							oState.filterBarController.clearFilters();
							oController.onClearFilterExtension(oEvent);
						},
						//Event handler for go button press
						onGoPress: function(oEvent){
							oState.filterBarController.onGoFilter();
						},

						onBeforeSFBVariantSave: function() {
							/*
							 * When the app is started, the VariantManagement of the SmartFilterBar saves the initial state in the
							 * STANDARD (=default) variant and therefore this event handler is called. So, even though the name of
							 * the event handler is confusing, we need to provide the initial state to allow the SmartFilterBar to
							 * restore it when needed (i.e. when the user clicks on restore). Thus, no check against STANDARD
							 * context is needed!
							 */
							if (oState.oSmartFilterbar.isDialogOpen() && !oState.hideVisualFilter) { //on click of save in the dialog, update the filterbar as well without waiting for the user to confirm/cancel by clicking go/cancel
								oState.visualFilterDialogContainer._updateFilterBarFromDialog.call(oState.visualFilterDialogContainer);
							}
							var oCurrentAppState = oState.oIappStateHandler.getCurrentAppState();
							if (!this.getOwnerComponent().getProperty('smartVariantManagement')) {
								delete oCurrentAppState.customData["sap.suite.ui.generic.template.genericData"].contentView;
							}

							var oFilterData = oState.oSmartFilterbar.getFilterData(true); //to include empty/invisible fields filter data
							// workaround since getFilterData() does not provide the content of the search field:
							var sSearchFieldValue, oBasicSearchField = oState.oSmartFilterbar.getBasicSearchControl();
							if (oBasicSearchField && oBasicSearchField.getValue) {
								sSearchFieldValue = oBasicSearchField.getValue();
							}
							oFilterData._CUSTOM = oCurrentAppState.customData;
							oState.oSmartFilterbar.setFilterData(oFilterData, true);
							if (sSearchFieldValue) { // the previous statement has blanked the content of the search field -> reset it to the stored value
								oState.oSmartFilterbar.getBasicSearchControl().setValue(sSearchFieldValue);
							}
							oState.oSmartFilterbar.fireFilterChange();
						},
						onAfterSFBVariantLoad: function(oEvent) {
							if (!oState.oSmartFilterbar.isDialogOpen()) {
								oState.filterBarController._afterSFBVariantLoad();
								if (oState.oSmartFilterableKPI && !oState.oSmartFilterbar.isLiveMode()) {
									var oContent = oState.oSmartFilterableKPI.getContent();
									oContent.forEach(function(oItem) {
										if (oItem.getSmartFilterId) {
											if (oEvent.getParameter("executeOnSelect")) {
												oItem.bSearchTriggred = true;
											}
										}
									});
								}
							}
						},
						onBeforeRebindTable: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onBeforeRebindTable(oEvent);
							oController.onBeforeRebindTableExtension(oEvent);
						},
						onBeforeRebindChart: function(oEvent) {
							//oState.oSmartChart.oModels = oState.oSmartChart.getChart().oPropagatedProperties.oModels;
						},
						onListNavigate: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onListNavigate(oEvent, oState, oController.onListNavigationExtension.bind(oController));
						},
						onCallActionFromToolBar: function(oEvent) {
							// Since our content toolbar is detached from the SmartTable, the standard util function getParentTable
							// would not work in our case.  We need to override this function when this action is triggered from our table

							var getParentTable_orig = oTemplateUtils.oCommonUtils.getParentTable;
							oTemplateUtils.oCommonUtils.getParentTable = function(){return oState.oSmartTable;};
							oTemplateUtils.oCommonEventHandlers.onCallActionFromToolBar(oEvent, oState);
							oTemplateUtils.oCommonUtils.getParentTable = getParentTable_orig;
							getParentTable_orig = null;
						},
						onCallActionFromList: function(oEvent) {

						},
						onDataFieldForIntentBasedNavigation: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onDataFieldForIntentBasedNavigation(oEvent, oState);
						},
						onDataFieldWithIntentBasedNavigation: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onDataFieldWithIntentBasedNavigation(oEvent, oState);
						},
						onBeforeSemanticObjectLinkPopoverOpens: function(oEvent) {

							var oEventParameters = oEvent.getParameters();

							oTemplateUtils.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){
								//Success function
								var sSelectionVariant = oState.oSmartFilterbar.getUiState({
									allFilters : false
								}).getSelectionVariant();
								oTemplateUtils.oCommonUtils.semanticObjectLinkNavigation(oEventParameters, sSelectionVariant, oController);
							}, Function.prototype, oState, Function.prototype);
						},
						onAssignedFiltersChanged: function(oEvent) {
							if (oEvent && oEvent.getSource()) {
								if (oState && oState.oSmartFilterbar && oState.filterBarController) {
									oController.byId("template::FilterText").setText(oState.oSmartFilterbar.retrieveFiltersWithValuesAsText());
								}
							}
						},
						onToggleFiltersPressed: function() {
							var oComponent = oController.getOwnerComponent();
							var oTemplatePrivateModel = oComponent.getModel("_templPriv");
							oTemplatePrivateModel.setProperty("/listReport/isHeaderExpanded", (oTemplatePrivateModel.getProperty("/listReport/isHeaderExpanded") === true) ? false : true);
						},

						// ---------------------------------------------
						// store navigation context
						// note: function itself is handled by the corresponding control
						// ---------------------------------------------
						onSearchButtonPressed: function() {
							if (Device.system.phone && oState.oPage.getHeaderExpanded()) { //Check if isHeaderExpanded = true. If yes, collapse the header (on press of Go) (only for phone)
								oState.oPage.setHeaderExpanded(false);
							}
							var oModel = oController.getOwnerComponent().getModel();
							if (oState.oSmartFilterableKPI && !oState.oSmartFilterableKPI.getEnabled()) {
								oState.oController.getOwnerComponent().getModel("_templPriv").setProperty('/alp/filterChanged', false);
							}
							oModel.attachEventOnce("requestSent", function() {
									if (!oState._bIsStartingUp) {
										oState.oIappStateHandler.fnStoreCurrentAppStateAndAdjustURL();
									} else {
										// resolve starup promise
										oState.oIappStateHandler.fnResolveStartUpPromise();
									}
								});
							//chart selection needn't be retained for filter bar search / table personalisation
							oState.oController.getOwnerComponent().getModel("_templPriv").setProperty('/alp/_ignoreChartSelections', true);
							oTemplateUtils.oCommonUtils.refreshModel(oState.oSmartTable);
						},
						onSemanticObjectLinkPopoverLinkPressed: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onSemanticObjectLinkPopoverLinkPressed(oEvent, oState);
						},
						onSemanticObjectLinkNavigationPressed: fnOnSemanticObjectLinkNavigationPressed,
						onSemanticObjectLinkNavigationTargetObtained: fnOnSemanticObjectLinkNavigationTargetObtained,
						onAfterTableVariantSave: function() {
							oState.oIappStateHandler.fnStoreCurrentAppStateAndAdjustURL();
						},
						onAfterApplyTableVariant: function() {
							oState.oIappStateHandler.fnStoreCurrentAppStateAndAdjustURL();
						},
						onAfterChartVariantSave: function(ev) {
							oState.oIappStateHandler.fnStoreCurrentAppStateAndAdjustURL();
							oTemplateUtils.oCommonUtils.setEnabledToolbarButtons(ev.getSource());
						},
						onAfterApplyChartVariant: function() {
							oState.oIappStateHandler.fnStoreCurrentAppStateAndAdjustURL();
						},
						onFilterModeSegmentedButtonChange: function(oEvent) {
							oState.filterBarController.handleFilterSwitch(oEvent.getParameter("key"), oEvent.oSource._bApplyingVariant);
							oState.oController._templateEventHandlers.onSegmentButtonPressed();
						},
						onContentViewSegmentButtonPressed: function(oEvent){
							//todo: check if DSH loads if the default filter mode is crosstable
							//ideally we can init DSH post GO button press
							if (oEvent.getParameter("key") === "crosstable" && !oState.oAnalyticGrid) {
								oState.oAnalyticGridController.initAnalyticGrid();
							}
							if (!oState.oSmartFilterableKPI && !oState.oController.getOwnerComponent().getContentTitle()) {
								var oContentView = oState.oController.getView(),
									sToolbarId;
								if (oEvent.getSource().getSelectedKey() === "customview1") {
									sToolbarId = "template::contentViewExtensionToolbar";
								} else if (oEvent.getSource().getSelectedKey() === "customview2") {
									sToolbarId = "template::contentViewExtension2Toolbar";
								} else if (oEvent.getSource().getSelectedKey() === "chart" || oEvent.getSource().getSelectedKey() === "charttable") {
									sToolbarId = oContentView.byId("template::masterViewExtensionToolbar") ? "template::masterViewExtensionToolbar" : "template::ChartToolbar";
								} else if (oEvent.getSource().getSelectedKey() === "table") {
									sToolbarId = "template::TableToolbar";
								}
								oState.oController._templateEventHandlers.setFocusOnContentViewSegmentedButtonItem(oContentView, sToolbarId);
							}
							oState.oController._templateEventHandlers.onSegmentButtonPressed(!oState.oController.getOwnerComponent().getProperty('smartVariantManagement'));
						},
						setFocusOnContentViewSegmentedButtonItem: function(oContentView, sToolbarId) {
							var oToolbar = oContentView.byId(sToolbarId);
							if (oToolbar) {
								var iToolbarContentLength = oToolbar.getContent().length,
									oSegmentButton = oToolbar.getContent()[iToolbarContentLength - 1 ];
								if (oSegmentButton) {
									oSegmentButton.addEventDelegate({
										onAfterRendering : function(oEvent) {
											oEvent.srcControl.focus();
										}
									});
								}
							}
						},
						/**
						* Called from Segmented Button to update the selected key to the variant and adjust the app state
						* @param {boolean} bIgnoreVariant - if true then do not store the selected key in variant
						**/
						onSegmentButtonPressed: function(bIgnoreVariant){
							if (!bIgnoreVariant) {
									oState.oController.byId('template::PageVariant').currentVariantSetModified(true);
									oState.oSmartFilterbar.setFilterData({
										_CUSTOM : oState.oIappStateHandler.getFilterState()
									});
							}
							oState.oIappStateHandler.fnStoreCurrentAppStateAndAdjustURL();
						},
						// ---------------------------------------------
						// END store navigation context
						// ---------------------------------------------
						onShareListReportActionButtonPress: function (oEvent) {
							oTemplateUtils.oCommonUtils.executeIfControlReady(onShareListReportActionButtonPressImpl, "template::Share");
						},

						/**
						 * Called from Determining Button belonging to Table's Annotation of type DataFieldForAction
						 * @param  {object} oEvent
						 */
						onDeterminingDataFieldForAction: function(oEvent) {
							var oTemplatePrivate = oState.oController.getOwnerComponent().getModel("_templPriv");
							var oContainerView = oTemplatePrivate.getProperty('/alp/contentView');
							var oContextContainer = (oContainerView === CONTAINER_VIEW_CHART) ? oState.oSmartChart : oState.oSmartTable;
							oTemplateUtils.oCommonEventHandlers.onDeterminingDataFieldForAction(oEvent, oContextContainer);
						},
						/**
						 * Called from Determining Button belonging to Table and Chart Annotation of type DataFieldForIntentBasedNavigation
						 * @param  {object} oEvent
						 */
						onDeterminingDataFieldForIntentBasedNavigation: function(oEvent) {
							var oButton = oEvent.getSource();
							var oTemplatePrivate = oState.oController.getOwnerComponent().getModel("_templPriv");
							var oContainerView = oTemplatePrivate.getProperty('/alp/contentView');
							var oContextContainer = (oContainerView === CONTAINER_VIEW_CHART) ? oState.oSmartChart : oState.oSmartTable.getTable();
							oTemplateUtils.oCommonEventHandlers.onDeterminingDataFieldForIntentBasedNavigation(oButton, oContextContainer, oState);
						},
						/**
						* onInlineDataFieldForAction Trigger the action as specified in the inline buttons
						* @param  {Object} oEvent Event object
						*/
						onInlineDataFieldForAction: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onInlineDataFieldForAction(oEvent, oState);
						},
						/**
						* onInlineDataFieldForIntentBasedNavigation Trigger the navigation as specified in the inline buttons
						* @param  {Object} oEvent Event object
						*/
						onInlineDataFieldForIntentBasedNavigation: function(oEvent) {
							oTemplateUtils.oCommonEventHandlers.onInlineDataFieldForIntentBasedNavigation(oEvent.getSource(), oState);
						},
						/**
						 * Select handler for Auto Hide Segment Button
						 * @param  {Object} oEvent object
						 */
						onAutoHideToggle: function() {
							// eyeModeSwitch to highlightMode needs table rebind
							oState.oSmartTable.getModel("_tableHighlight").setProperty("/highlightMode", "eyeModeSwitch");
							oState.chartController && oState.chartController._updateTable();
							oState.oIappStateHandler.fnStoreCurrentAppStateAndAdjustURL();
						},
						/**
						 * Event handler when SmartControl full screen mode is changed
						 * @param  {sap.ui.base.Event} oEvent object
						 */
						onFullScreenToggled: function(oEvent) {
							var fullScreen = oEvent.getParameter("fullScreen");
							var oTemplatePrivate = oEvent.getSource().getModel("_templPriv");
							oTemplatePrivate.setProperty("/alp/fullScreen", fullScreen);
						},
						onDialogClosed: function(oEvent) {
							oState.visualFilterDialogContainer._closeDialog.call(oState.visualFilterDialogContainer);
						},
						/**
						 * Event handler when Filter Dialog is launched
						 * @param  {Object} oEvent object
						 */
						onDialogOpened: function(oEvent) {
							//If VF are not used, none of this is needed
							//getFilterDialogContent() returns dialog contents as an array
							var aContent = oState.oSmartFilterbar.getFilterDialogContent();

							if (!oState.visualFilterDialogContainer) {
								oState.visualFilterDialogContainer = new VisualFilterDialogController();
								oState.visualFilterDialogContainer.init(oState);
							}
							//Make sure only CF contents is present and then add segmented button and VF contents.
							if (aContent.length < 2) {

								//it is necessary in the case where custom filter value is being filled by extension controller method in a async call
								// it sets the flag alpSearchable to true which enables the visual filter switch button in adapt filter dialog.
								//BCP: 1970253332
								oState.filterBarController.fnCheckMandatory();

								var filterSwitchItems = [
									new SegmentedButtonItem({icon:"sap-icon://filter-fields", width:"inherit", key:FILTER_MODE_COMPACT, tooltip:"{i18n>FILTER_COMPACT}"}),
									new SegmentedButtonItem({icon:"sap-icon://filter-analytics", width:"inherit", key:FILTER_MODE_VISUAL, tooltip:"{i18n>FILTER_VISUAL}", enabled: "{_templPriv>/alp/searchable}"})
								];

								var filterSwitch = new SegmentedButton({
									width:"inherit",
									selectedKey:FILTER_MODE_COMPACT,
									items: filterSwitchItems,
									select: function(oEvent) {
										var oSwitch = oEvent.getSource();
										//Keep the selected key as compact on this content
										oSwitch.setSelectedKey(FILTER_MODE_COMPACT);
										oState.visualFilterDialogContainer._toggle.call(oState.visualFilterDialogContainer);
									}
								}).addEventDelegate({
									onAfterRendering : function(oEvent) {
										if (oEvent.srcControl.getCustomData()[0] && oEvent.srcControl.getCustomData()[0].getValue()) {
											oEvent.srcControl.focus();
											oEvent.srcControl.removeAllCustomData();
										}
									}
								});

								var oForm = oState.visualFilterDialogContainer._createForm();

								oState.oSmartFilterbar.addFilterDialogContent(oForm);

								var oToolbar = new OverflowToolbar({
									design: SapMLibrary.ToolbarDesign.Transparent,
									content: [
										new ToolbarSpacer(),
										filterSwitch
									]
								}).addStyleClass("sapSmartTemplatesAnalyticalListPageFilterDialogToolbar");

								//Add segmented buttons to Compact filter form.
								aContent[0].setToolbar(oToolbar);

								filterSwitch.setModel(oState.oController.getView().getModel("_templPriv"), "_templPriv");
							}
							//filter dialog content should be decided based on current filterMode and bSearchable
							//If bSearchable then which mode is on that content should be active
							//if bSearchable is false then compact should come up first
							var oTemplatePrivate = oState.oController.getView().getModel("_templPriv");
							if (oTemplatePrivate.getProperty("/alp/searchable")) { //if searchable
								if (oTemplatePrivate.getProperty("/alp/filterMode") === FILTER_MODE_VISUAL) {
									oState.oSmartFilterbar.addFilterDialogContent(aContent[1]);
									//Set content width and content height while adding custom content.
									//Hardcoding the values as the Height and width of the FilterDialog is not available at this instance.
									//The following check is to  set content width only if the system is identified as desktop. (In desktop-touch devices, Device.system.desktop = true and Device.system.tablet = true)
									if (Device.system.desktop && (!Device.system.phone || !Device.system.tablet)) {
										oState.oSmartFilterbar.setContentWidth(790);
										oState.oSmartFilterbar.setContentHeight(685);
									} else if (Device.system.tablet) {
										if (Device.orientation.portrait) {
											oState.oSmartFilterbar.setContentWidth(400);
											oState.oSmartFilterbar.setContentHeight(720);
										} else if (Device.orientation.landscape) {
											oState.oSmartFilterbar.setContentWidth(512);
											oState.oSmartFilterbar.setContentHeight(861);
										}
									}
								} else {
									oState.oSmartFilterbar.addFilterDialogContent(aContent[0]);
								}
							} else { //else always launch compact dialog
								oState.oSmartFilterbar.addFilterDialogContent(aContent[0]);
							}
						},
						//Event handling for dialog buttons
						onSearchForFilters: function(oEvent) {
							oState.visualFilterDialogContainer._triggerSearchInFilterDialog.call(oState.visualFilterDialogContainer, oEvent);
						},
						onDialogSearch: function(oEvent) {
							oState.visualFilterDialogContainer._searchDialog.call(oState.visualFilterDialogContainer);
						},
						onDialogClear: function(oEvent) {
							oController.onClearFilterExtension(oEvent);
						},
						onRestore: function(oEvent) {
							oState.visualFilterDialogContainer._restoreDialog.call(oState.visualFilterDialogContainer);
						},
						onDialogCancel: function(oEvent) {
							oState.visualFilterDialogContainer._cancelDialog.call(oState.visualFilterDialogContainer);
						},
						//Enable/Disable toolbar butttons on data receive - currently only SmartTable
						onDataReceived: function(oEvent) {
							//enable toolbar before enabling the buttons.
							oState.oContentArea.enableToolbar();
							oTemplateUtils.oCommonEventHandlers.onDataReceived(oEvent);
						},
						//Enable/Disable toolbar buttons on row selection in table
						onRowSelectionChange: function(oEvent) {
							var oTable = oEvent.getSource();
							oTemplateUtils.oCommonUtils.setEnabledToolbarButtons(oTable);
						}
					},
					extensionAPI: new ExtensionAPI(oTemplateUtils, oController, oState)
				};
			}
		};
	});
