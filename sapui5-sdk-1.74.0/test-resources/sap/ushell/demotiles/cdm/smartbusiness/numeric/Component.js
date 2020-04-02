jQuery.sap.registerModulePath("ssuite.smartbusiness.tiles.lib", jQuery.sap
		.getModulePath("sap.ushell.demotiles.cdm.smartbusiness.numeric")
		+ "/../lib");

sap.ui.define(["jquery.sap.global", "sap/ui/core/UIComponent", "ssuite/smartbusiness/tiles/lib/Util",
		"ssuite/smartbusiness/tiles/lib/TimeStampControl", "sap/m/VBox", "sap/ui/model/odata/AnnotationHelper",
		"sap/suite/ui/commons/GenericTile", "sap/suite/ui/commons/TileContent", "sap/suite/ui/commons/NumericContent"],
		function(jQuery, UIComponent, Util, timeStampControl, VBox, oAnno, oGenTile, oTileContent, oNumericContent) {
			"use strict";

			return UIComponent.extend("sap.ushell.demotiles.cdm.smartbusiness.numeric.Component", {

				metadata : {
					manifest : "json"
				},

				/**
				 * tile data in case of preview mode
				 */
				_intializeNumericTileForPreviewMode : function() {
					var oGenericTile = this.content.getItems()[0];
					var numericTileContent = new sap.ui.xmlfragment("sap.ushell.demotiles.cdm.smartbusiness.numeric.NumericContent", this);
					oGenericTile.addTileContent(numericTileContent);
					oGenericTile.attachPress(jQuery.proxy(
							function (){
								this.onPressPreview();
							}, this)
					);
				},

				/**
				 * create a json model to store the title and subtitle of the chip from the chip bag
				 */
				_getTileConfigModel : function() {
					var oTileConfigModel = new sap.ui.model.json.JSONModel();
					var oData = ssuite.smartbusiness.tiles.lib.Util.prototype.getTitleSubtitle(this);
					// check for existence of thresholds in case of user personalized Tile
					if (this._localData && this._localData.tileProperties && this._localData.tileProperties.thresholds) {
						oData.personalizedThresholds = JSON.parse(this._localData.tileProperties.thresholds);
					}
					// populate filters added in personalized Tile if any exists
					var oFilters = ssuite.smartbusiness.tiles.lib.Util.prototype.getPersFilters(this);
					if (oFilters) {
						oData.personalizedFilters = oFilters;
					}
					if (!this._localData.noCache && !this._localData.bNoCachingEnabled)
						oData.loadFromCache = true;
					oData.cacheEnabled = !this._localData.bNoCachingEnabled;
					oData.displayCachedTime = this._localData.displayCachedTime;
					oTileConfigModel.setData(oData);
					return oTileConfigModel;
				},

				/**
				 * assign title and subtitle of the chip from chip bag and set the load state of the chip accordingly
				 */
				_assignTileSubtitleForChip : function(sLoadState) {
					var oData = ssuite.smartbusiness.tiles.lib.Util.prototype.getTitleSubtitle(this);
					var oGenericTile = new sap.suite.ui.commons.GenericTile({
						state : sLoadState,
						header : oData.Title,
						subheader : oData.SubTitle
					});
					this.content.removeAllItems();
					this.content.addItem(oGenericTile);
				},

				/**
				 * local data using in the context of this component
				 */
				_initializeLocalVariables : function() {
					this._localData = {
						loadStatus : {
							meta : false,
							anno : false
						},
						oneTimeLoad : false,
						ssbProperties : {

						}
					};
				},

				/**
				 * checks whether the mandatory data required to load chip is available
				 */
				_checkForTileConfigMandatoryData : function() {
					var status = {
						failed : false
					};
					try {
						var tileProperties = ssuite.smartbusiness.tiles.lib.Util.prototype.getCdmTileConfig(this).tileProperties || {};
						if (!tileProperties || !tileProperties.evaluationId) {
							jQuery.sap.log.error("_checkForTileConfigMandatoryData", "mandatory data (evaluationId) not available");
							status.failed = true;
						} else {
							this._localData.tileProperties = tileProperties;
						}
					} catch (exception) {
						jQuery.sap.log.error("_checkForTileConfigMandatoryData", "check for mandatory data failed - "
								+ exception.message);
						status.failed = true;
					}
					return status;
				},

				/**
				 * create content module | checks for visibility contract availability and based on whether the tile is visible
				 * triggers the initialize Content module
				 */
				createContent : function() {
					this.content = new VBox();
					this._initializeLocalVariables();

					this._assignTileSubtitleForChip("Loading");
					ssuite.smartbusiness.tiles.lib.Util.prototype.checkForCachedData(this);

					return this.content;
				},

				// new API
	            tileSetVisible : function(bVisible) {
                    if (bVisible) {
                        this._localData.visible = bVisible;
                        // cacheRefreshRequired flag is set to true when the user goes into the drilldown for the tile,
                        // or when tile is not visible and the data age reaches the maximum cache age allowed.
                        // When the tile becomes visible, according to the cacheRefreshRequired flag a data load is
                        // triggered.
                        if (this._localData.cacheRefreshRequired) {
                            this._localData.cacheRefreshRequired = false;
                            if (this._localData.delayedUpdateCacheIdentifier)
                                jQuery.sap.clearDelayedCall(this._localData.delayedUpdateCacheIdentifier);
                            this.updateCacheDataFromBackend(true);
                        }
                    }
                    this._localData.tileVisible = bVisible;
                    this._initializeContent();
	            },

	            // new API
	            tileRefresh : function() {
	                //TODO
	            },

	            // new API
	            tileSetVisualProperties : function(oNewVisualProperties) {
	                var bSomethingChanged = false;

	                if (!this.__oConfig) {
	                    ssuite.smartbusiness.tiles.lib.Util.prototype.getCdmTileConfig(this);
	                }

	                if (oNewVisualProperties.title) {
	                    this.__oConfig.Title = oNewVisualProperties.title;
	                    bSomethingChanged = true;
	                }
	                if (oNewVisualProperties.subtitle) {
	                    this.__oConfig.SubTitle = oNewVisualProperties.subtitle;
	                    bSomethingChanged = true;
	                }
	                if (bSomethingChanged) {
	                    this._assignTileSubtitleForChip();
	                }
	            },


				/**
				 * create a dummy GenericTile with title and subtitle in loading state | after the actual app descriptor and
				 * annotation xml has loaded this content will be replaced with tile specific content
				 */
				_initializeContent : function() {
					if (this._localData && this._localData.visible
							&& (this._localData.noCache || this._localData.bNoCachingEnabled) && !this._localData.oneTimeLoad) {
						var mandatoryDataStatus = this._checkForTileConfigMandatoryData();
						this._localData.oneTimeLoad = true;
						if (mandatoryDataStatus.failed) {
							this._assignTileSubtitleForChip("Failed");
						} else {
							this._assignTileSubtitleForChip("Loading");
							this._triggerContentLoadAsynchronously();
						}
					}
				},

				/**
				 * if the KPI Aggregate is cached the cached value is displayed in the tile
				 */
				setCachedData : function(oData) {
					if (oData) {
						this._tileCachedDataModel = new sap.ui.model.json.JSONModel();
						var parseData = jQuery.parseJSON(oData.Data);
						this._tileCachedDataModel.setData(parseData);
						this._localData.CachedTime = oData.CachedTime;
						this._localData.displayCachedTime = ssuite.smartbusiness.tiles.lib.Util.prototype.decideTimeToDisplay(Number(oData.CacheAge));
						this._localData.cacheAge = oData.CacheAge;
						if (oData.Iscacheinvalid == 1)
							this._localData.noCache = true;
						else {
							this._localData.cacheMaxAge = parseInt(oData.CacheMaxAge);
							this._localData.cacheMaxAgeUnit = oData.CacheMaxAgeUnit;
						}
						var mandatoryDataStatus = this._checkForTileConfigMandatoryData();
						if (mandatoryDataStatus.failed) {
							this._assignTileSubtitleForChip("Failed");
						} else {
							this._triggerContentLoadAsynchronously();
						}
					} else {
						// has to be handled
					}
				},

				/**
				 * triggers the load of the AppDescriptor and annotation document asynchronously | is systemAlias is configured
				 * it will be considered
				 */
				_triggerContentLoadAsynchronously : function() {
					var evalId = this._localData.tileProperties.evaluationId;
					var oCdmTileConfig = ssuite.smartbusiness.tiles.lib.Util.prototype.getCdmTileConfig(this);
					var additionalParams = oCdmTileConfig.additionalAppParameters || {};

					if (oCdmTileConfig.sap_system && oCdmTileConfig.sap_system.length) {
						// sap_system is an array of string, see <wiki>: Common+data+model+alignment+-+custom+tiles
						this._localData.systemAlias = oCdmTileConfig.sap_system[0];
					}
					var url = "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV";
					if (this._localData && this._localData.systemAlias)
						url = url + ";o=" + this._localData.systemAlias;
					url = url + "/AppDescriptors(EvaluationId='" + evalId + "')/$value";

					// load the dynamic app descriptor asynchronously
					$.ajax({
						dataType : "json",
						url : url,
						async : true,
						success : jQuery.proxy(function(oAppDescriptor) {
							this._fetchOdataUrlAndAnnotationUrl(oAppDescriptor);
						}, this),
						error : jQuery.proxy(function(e) {
							var message = typeof e !== "object" || jQuery.isEmptyObject(e) ? e.toString() : JSON.stringify(e);
							jQuery.sap.log.error("_triggerContentLoadAsynchronously", "failed to load dynamic app descriptor "
									+ message);
							this._assignTileSubtitleForChip("Failed");
						}, this)
					});
				},

				/**
				 * fetches the oData uri along with the name of the annotationDoc
				 */
				_fetchODataUri : function(oJson) {
					var parseStatus = {
						found : false,
						uri : "",
						annoName : ""
					};
					jQuery.each(oJson, function(sProp, oValue) {
						if (oValue.type && oValue.type == "OData" && oValue.uri && oValue.settings) {
							parseStatus.found = true;
							parseStatus.uri = oValue.uri;
							parseStatus.annoName = oValue.settings.annotations[0];
							return false;
						}
					});
					return parseStatus;
				},

				/**
				 * finds the given property sProperty in the given json object
				 */
				_findProperty : function(sProperty, oJson) {
					var parseStatus = {
						found : false,
						oData : ""
					};
					jQuery.each(oJson, function(sProp, oValue) {
						if (sProp == sProperty) {
							parseStatus.found = true;
							parseStatus.oData = oValue;
							return false;
						}
					});
					return parseStatus;
				},

				_fetchOdataUrlAndAnnotationUrl : function(oAppDescriptor) {
					// parse the json and find the odata service and annotation uri
					if (!oAppDescriptor) {
						jQuery.sap.log.error("_fetchOdataUrlAndAnnotationUrl", "app descriptor not found");
						this._assignTileSubtitleForChip("Failed");
						return;
					}
					// check for the existence of sap.app property in the appdescriptor
					var sapAppStatus = this._findProperty("sap.app", oAppDescriptor);
					if (!sapAppStatus || !sapAppStatus.found || !sapAppStatus.oData) {
						jQuery.sap.log.error("_fetchOdataUrlAndAnnotationUrl", "sap.app property not found in appdescriptor");
						this._assignTileSubtitleForChip("Failed");
						return;
					}
					// check for the existence of dataSource property inside sap.app in the appdescriptor
					var dataSourceStatus = this._findProperty("dataSources", sapAppStatus.oData);
					if (!dataSourceStatus || !dataSourceStatus.found || !dataSourceStatus.oData) {
						jQuery.sap.log.error("_fetchOdataUrlAndAnnotationUrl", "dataSources property not found in appdescriptor");
						this._assignTileSubtitleForChip("Failed");
						return;
					}
					// check for the existence of odata url with annotation doc name inside datasources in the appdescriptor
					var oDataUrlStatus = this._fetchODataUri(dataSourceStatus.oData);
					if (!oDataUrlStatus || !oDataUrlStatus.found || !oDataUrlStatus.uri || !oDataUrlStatus.annoName) {
						jQuery.sap.log.error("_fetchOdataUrlAndAnnotationUrl",
								"odata service uri with anno name not found in the appdesciptor");
						this._assignTileSubtitleForChip("Failed");
						return;
					}
					// check for the existence of annotation document url inside datasources in the appdescriptor
					var annoUrlStatus = this._findProperty(oDataUrlStatus.annoName, dataSourceStatus.oData);
					if (!annoUrlStatus || !annoUrlStatus.found || !annoUrlStatus.oData || !annoUrlStatus.oData.uri) {
						jQuery.sap.log.error("_fetchOdataUrlAndAnnotationUrl", "annotation document uri not found - "
								+ oDataUrlStatus.annoName);
						this._assignTileSubtitleForChip("Failed");
						return;
					}
					// check for the existence of SSB specific property sap.ui.smartbusiness.app in the appdescriptor
					var ssbDescriptorStatus = this._findProperty("sap.ui.smartbusiness.app", oAppDescriptor);
					if (!ssbDescriptorStatus || !ssbDescriptorStatus.found || !ssbDescriptorStatus.oData) {
						jQuery.sap.log.error("_fetchOdataUrlAndAnnotationUrl",
								"SSB specific property not found in the appdescriptor");
						this._assignTileSubtitleForChip("Failed");
						return;
					} else {
						this._localData.ssbProperties = ssbDescriptorStatus.oData;
						var oDataUrl = oDataUrlStatus.uri;
						var annoDocUrl = annoUrlStatus.oData.uri;
						this._loadOdataWithAnnotations(oDataUrl, annoDocUrl);
					}
				},

				/**
				 * load the odata metadata along with annotations | on successful load of both trigger the data load
				 */
				_loadOdataWithAnnotations : function(sServiceUri, sAnnotationUri) {
					if (this._localData && this._localData.systemAlias) {
						sServiceUri = sServiceUri + ";o=" + this._localData.systemAlias;
						sAnnotationUri = sAnnotationUri.replace(";v=2", ";v=2;o=" + this._localData.systemAlias);
					}
					var oDataModel = new sap.ui.model.odata.ODataModel(sServiceUri, {
						annotationURI : [sAnnotationUri],
						loadMetadataAsync : true,
						skipMetadataAnnotationParsing : true,
						loadAnnotationsJoined : true,
						defaultCountMode : "Inline",
						json : true
					});
					// Stored for use in updateCacheDataFromBackend method
					this._localData.oDataModelForChipDataLoad = oDataModel;
					// handler for metadata successfully loaded
					oDataModel.attachMetadataLoaded(jQuery.proxy(function(oEvent) {
						this._localData.loadStatus.meta = true;
						this._localData.loadStatus.metaRequestComplete = true;
						this._checkAndTriggerDataLoad(oEvent.getSource());
					}, this));
					// handler for metadata load failed
					oDataModel.attachMetadataFailed(jQuery.proxy(function(oError) {
						this._localData.loadStatus.meta = false;
						this._localData.loadStatus.metaRequestComplete = true;
						this._checkAndTriggerDataLoad();
					}, this));
					// handler for annotations successfully loaded
					oDataModel.attachAnnotationsLoaded(jQuery.proxy(function(oEvent) {
						this._localData.loadStatus.anno = true;
						this._localData.loadStatus.annoRequestComplete = true;
						this._checkAndTriggerDataLoad(oEvent.getSource());
					}, this));
					// handler for annotations load failed
					oDataModel.attachAnnotationsFailed(jQuery.proxy(function(oError) {
						this._localData.loadStatus.anno = false;
						this._localData.loadStatus.annoRequestComplete = true;
						this._checkAndTriggerDataLoad();
					}, this));
					// handler for data load failed
					oDataModel.attachRequestFailed(jQuery.proxy(function(err) {
						var oErrLog = err.getParameters();
						var message = typeof oErrLog !== "object" || jQuery.isEmptyObject(oErrLog) ? oErrLog.toString() : JSON
								.stringify(oErrLog);
						jQuery.sap.log.error("Data load failed ", message);
						this._assignTileSubtitleForChip("Failed");
					}, this));
				},

				/**
				 * check whether both annotations and metadata are loaded
				 */
				_checkAndTriggerDataLoad : function(oDataModel) {
					if (this._localData.loadStatus.meta && this._localData.loadStatus.anno) {
						this._initializeChipDataLoad(oDataModel);
					} else {
						if ((this._localData.loadStatus.annoRequestComplete && this._localData.loadStatus.anno == false)
								|| (this._localData.loadStatus.metaRequestComplete && this._localData.loadStatus.meta == false)) {
							jQuery.sap.log.error("_checkAndTriggerDataLoad", "Metadata or annotation document load failed");
							this._assignTileSubtitleForChip("Failed");
						}
					}
				},

				/**
				 * ================================================================================================================
				 * SCHEDULERS FOR UPDATING CACHE DATA AND CACHE AGE TO BE DISPLAYED
				 * ================================================================================================================
				 */

				/**
				 * Schedules the update job for the tile when the cache gets invalidated
				 */
				initializeAutoCacheUpdateScheduler : function() {
					// If cacheAge is not maintained, scheduler should not be initalized for the tile
					if (this._localData.cacheAge >= 0 && this._localData.cacheMaxAge > 0) {
						var secondsToScheduleUpdate = 0;
						switch (this._localData.cacheMaxAgeUnit) {
							case "MIN" :
								secondsToScheduleUpdate = this._localData.cacheMaxAge * 60 - this._localData.cacheAge;
								break;
							case "HUR" :
								secondsToScheduleUpdate = this._localData.cacheMaxAge * 3600 - this._localData.cacheAge;
								break;
							case "DAY" :
								secondsToScheduleUpdate = this._localData.cacheMaxAge * 86400 - this._localData.cacheAge;
								break;
							default :
								secondsToScheduleUpdate = -1;
								break;
						};
						// delayTimeLimit is the maximum accepted delay in milliseconds. When the required delay is more than that,
						// scheduleUpdateForExceedingDelayTimeLimit() is called to break the delay into acceptable limits.
						var delayTimeLimit = 2147483647;
						if (secondsToScheduleUpdate >= 0) {
							jQuery.sap.log.info("Cache to be updated in : ", secondsToScheduleUpdate + " seconds");
							if ((secondsToScheduleUpdate * 1000) > delayTimeLimit) {
								this._localData.exceedingPeriods = parseInt((secondsToScheduleUpdate * 1000) / delayTimeLimit);
								this._localData.remainingTime = ((secondsToScheduleUpdate * 1000) % delayTimeLimit);
								jQuery.proxy(this.scheduleUpdateForExceedingDelayTimeLimit(), this);
							} else {
								this._localData.delayedUpdateCacheIdentifier = jQuery.sap.delayedCall((secondsToScheduleUpdate * 1000),
										null, jQuery.proxy(this.updateCacheDataFromBackend, this));
							}
						}
					}
				},

				/**
				 * Creates acceptable time segments for a delay exceeding the maximum value. If acceptable time limit is X, and
				 * secondsToScheduleUpdate is Y, a delay of X seconds is generated for [integer value of (Y/X)] times which is
				 * stored in exceedingPeriods. The remainder of (Y/X) is stored in remainingTime, which is used to create the
				 * last segment of delay - after which the update function is called.
				 */
				scheduleUpdateForExceedingDelayTimeLimit : function() {
					var delayTimeLimit = 2147483647;
					if (this._localData.exceedingPeriods == -1) {
						jQuery.proxy(this.updateCacheDataFromBackend(this._localData.tileVisible), this);
					} else if (this._localData.exceedingPeriods == 0) {
						this._localData.exceedingPeriods--;
						jQuery.sap.delayedCall(this._localData.remainingTime, null, jQuery.proxy(
								this.scheduleUpdateForExceedingDelayTimeLimit, this));
					} else if (this._localData.exceedingPeriods > 0) {
						this._localData.exceedingPeriods--;
						jQuery.sap.delayedCall(delayTimeLimit, null, jQuery.proxy(this.scheduleUpdateForExceedingDelayTimeLimit,
								this));
					}
				},

				/**
				 * This method is called when the cache gets invalidated. Resets the flags used for checking whether the
				 * annotation and metadata are loaded, and triggers a new load of data from backend and rewriting of cached
				 * data.
				 */
				updateCacheDataFromBackend : function(tileVisible) {
					if (tileVisible == undefined)
						tileVisible = this._localData.tileVisible;
					if (tileVisible) {
						this._localData.noCache = true;
						this._assignTileSubtitleForChip("Loading");
						this._initializeChipDataLoad(this._localData.oDataModelForChipDataLoad);
					} else
						this._localData.cacheRefreshRequired = true;
				},

				/**
				 * Initializes the scheduler for updating the displayed cache age. Obtains the time to be displayed currently
				 * and sets it as the timestamp for the tile
				 */
				analyzeAndUpdateTime : function() {
					// If cacheAge is not maintained, scheduler should not be initalized for the tile
					if (this._localData.cacheAge >= 0) {
						this.initializeAutoTimeUpdater();
						var oGenericTile = this.content.getItems()[0];
						var seconds = Number(this._localData.cacheAge);
						var time = ssuite.smartbusiness.tiles.lib.Util.prototype.decideTimeToDisplay(seconds);
						this._localData.displayCachedTime = time;
						if (oGenericTile && oGenericTile.getContent && oGenericTile.getContent()[0]
								&& oGenericTile.getContent()[0] instanceof ssuite.smartbusiness.tiles.lib.Singleton) {
							oGenericTile.getContent()[0].getContent().getTileContent()[0].setTimestamp(time);
						}
					}
				},

				/**
				 * Schedules the update job for the tile when the cache gets invalidated
				 */
				initializeAutoTimeUpdater : function() {
					var timeToSchedule = 0;
					if (this._localData.updateSecondsForScheduler)
						this._localData.cacheAge = parseInt(this._localData.cacheAge) + this._localData.updateSecondsForScheduler;
					var seconds = Number(this._localData.cacheAge);
					timeToSchedule = ssuite.smartbusiness.tiles.lib.Util.prototype.decideTimeToSchedule(seconds, timeToSchedule);
					this._localData.updateSecondsForScheduler = timeToSchedule;
					jQuery.sap.log.info("Time to be updated in : ", timeToSchedule + " seconds");
					this._localData.delayedCallMethodIdentifier = jQuery.sap.delayedCall((timeToSchedule * 1000), null, jQuery
							.proxy(this.analyzeAndUpdateTime, this));

				},

				/**
				 * initialize the XML Templating
				 */
				_initializeChipDataLoad : function(oDataModel) {
					try {
						oDataModel.getMetaModel().loaded().then(
								jQuery.proxy(function() {
									try {
										var tileConfig = this._getTileConfigModel();
										var preprocessor = {
											xml : {
												models : {
													selectionVariant : oDataModel.getMetaModel(),
													dataPoint : oDataModel.getMetaModel(),
													tileConfig : tileConfig
												},
												bindingContexts : {
													selectionVariant : ssuite.smartbusiness.tiles.lib.Util.prototype
															.getBindingContextFromFragment(oDataModel.getMetaModel(),
																	this._localData.ssbProperties.annotationFragments.selectionVariant),
													dataPoint : ssuite.smartbusiness.tiles.lib.Util.prototype.getBindingContextFromFragment(
															oDataModel.getMetaModel(), this._localData.ssbProperties.annotationFragments.dataPoint),
													tileConfig : tileConfig.createBindingContext("/")
												}
											}
										};
										// The OData model(s) must be made known to the preprocessor.
										ssuite.smartbusiness.tiles.lib.Util.prototype.addODataModelForPreprocessing(preprocessor,
												oDataModel);
										var view = sap.ui.view({
											models : {
												component : this
											},
											component : this,
											preprocessors : preprocessor,
											type : sap.ui.core.mvc.ViewType.XML,
											viewName : "sap.ushell.demotiles.cdm.smartbusiness.numeric.NumericTile",
											viewData : this.getComponentData()
										});

										// only case where the preprocessing should happen based on the cached data is - Caching is enabled
										// (decided by flag bNoCachingEnabled) and Cache is available(decided by flag noCache)
										if (!this._localData.noCache && !this._localData.bNoCachingEnabled) {
											// Clear any previously set schedulers
											if (this._localData.delayedUpdateCacheIdentifier) {
												jQuery.sap.clearDelayedCall(this._localData.delayedUpdateCacheIdentifier);
												this._localData.delayedUpdateCacheIdentifier = null;
											}
											if (this._localData.delayedCallMethodIdentifier) {
												jQuery.sap.clearDelayedCall(this._localData.delayedCallMethodIdentifier);
												this._localData.delayedCallMethodIdentifier = null;
											}
											// Initialize schedulers to update the displayed cached age and update the cached data
											this.initializeAutoCacheUpdateScheduler();
											this.analyzeAndUpdateTime();
											this.content.setModel(this._tileCachedDataModel);
											var cachedDataBindingContext = new sap.ui.model.Context(this._tileCachedDataModel, "/0");
											this.content.setBindingContext(cachedDataBindingContext);
											this._localData.oDataModel = oDataModel;
											var oData = this._tileCachedDataModel.getData();
											var tileInstance = view.getContent()[0];
											var oTile = tileInstance.getContent();
											ssuite.smartbusiness.tiles.lib.Util.prototype.onDataLoaded(oData, oTile);
										} else
											this.content.setModel(oDataModel);
										this.content.removeAllItems();
										this.content.addItem(view);

									} catch (err) {
										var message = typeof err !== "object" || jQuery.isEmptyObject(err) ? err.toString() : JSON
												.stringify(err);
										jQuery.sap.log.error("_initializeChipDataLoad", "preprocessing step failed - " + message);
										this._assignTileSubtitleForChip("Failed");
									}
								}, this));
					} catch (err) {
						var message = typeof err !== "object" || jQuery.isEmptyObject(err) ? err.toString() : JSON.stringify(err);
						jQuery.sap.log.error("_initializeChipDataLoad", "preprocessing step failed - " + message);
						this._assignTileSubtitleForChip("Failed");
					}
				},

				/**
				 * exit handler for component - clear any delayedcalls associated with this component
				 */
				exit : function() {
					// Clear any previously set schedulers
					if (this && this._localData && this._localData.delayedUpdateCacheIdentifier) {
						jQuery.sap.clearDelayedCall(this._localData.delayedUpdateCacheIdentifier);
						this._localData.delayedUpdateCacheIdentifier = null;
					}
					if (this && this._localData && this._localData.delayedCallMethodIdentifier) {
						jQuery.sap.clearDelayedCall(this._localData.delayedCallMethodIdentifier);
						this._localData.delayedCallMethodIdentifier = null;
					}
				},

				onPressPreview : function() {
					jQuery.sap.log.error("On Preview Mode - Press Event - How to prevent??");
				}

			});
		}, true);
