sap.ui.define(["jquery.sap.global", "sap/ui/core/UIComponent", "sap/ui/model/analytics/odata4analytics",
		"sap/ui/core/format/NumberFormat", "sap/ui/core/LocaleData"], function(jQuery, UIComponent, odata4analytics,
		oNumberFormat) {
	"use strict";

	function stringify(json) {
		if (typeof json !== "object")
			return JSON.stringify(json);
		var result = "";
		if (jQuery.isArray(json)) {
			jQuery.each(json, function() {
				if (result)
					result += ",";
				result += stringify(this);
			});
			return "[" + result + "]";
		}
		jQuery.each(json, function(name, value) {
			if (result)
				result += ",";
			result += name + ":" + stringify(value);
		});
		return "{" + result + "}";
	}

	var comp = UIComponent.extend("ssuite.smartbusiness.tiles.lib.Util", {

		getCdmTileConfig : function(oComponent) {
			var oComponentData,
				oProperties,
				oStartUpProperties,
				oConfig = {},
				sSmartBusinessTileConfig,
				oSmartBusinessTileConfig;

			if (oComponent.__oConfig) {
				// just return a copy of the cache, as it may be modified by the caller
				return jQuery.extend(true, {}, oComponent.__oConfig);
			}

			oComponentData = oComponent.getComponentData() || {};
			oProperties = oComponentData.properties || {};
			oStartUpProperties = oComponentData.startupParameters || {};

			// fill config as expected by dynamic tile
			oConfig.Title = oProperties.title || "";
			oConfig.SubTitle = oProperties.subtitle || "";
			oConfig.icon = oProperties.icon || "";
			oConfig.navigation_target_url = oProperties.targetURL || "";

			// sap-system is coming from the Start Up Parameters (like for every Fiori app)
			if (oStartUpProperties["sap-system"]) {
				oConfig.sap_system = oStartUpProperties["sap-system"];
			}

			// read additional SSB-specific data from manifest
			// quick & dirty
			sSmartBusinessTileConfig = oComponent.getManifestEntry("/sap.ui.smartbusiness.app/tileConfiguration");
			oSmartBusinessTileConfig = JSON.parse(sSmartBusinessTileConfig);
			oSmartBusinessTileConfig.tileProperties = JSON.parse(oSmartBusinessTileConfig.TILE_PROPERTIES);
			delete oSmartBusinessTileConfig.TILE_PROPERTIES;
			oSmartBusinessTileConfig.evaluation = JSON.parse(oSmartBusinessTileConfig.EVALUATION);
			delete oSmartBusinessTileConfig.EVALUATION;
			oSmartBusinessTileConfig.additionalAppParameters = JSON.parse(oSmartBusinessTileConfig.ADDITIONAL_APP_PARAMETERS);
			delete oSmartBusinessTileConfig.ADDITIONAL_APP_PARAMETERS;
			oSmartBusinessTileConfig.tags = JSON.parse(oSmartBusinessTileConfig.TAGS);
			delete oSmartBusinessTileConfig.TAGS;
			jQuery.extend(true, oConfig, oSmartBusinessTileConfig);

			// cache it for the next call
			oComponent.__oConfig = oConfig;

			//  return a copy as it may be modified by the caller
			return jQuery.extend(true, {}, oConfig);
		},

		/**
		 * fetches the chip Tile and Subtitle from the Chip Configuration
		 */
		getTitleSubtitle : function(oComponent) {
			return this.getCdmTileConfig(oComponent);
		},

		/**
		 * fetches the filters configured in the personalized tile
		 */
		getPersFilters : function(oComponent) {
			var oFiltersMap = {},
				oConfig;
			try {
				/*
				TODO we did not understand ...
				oConfig = this.getCdmTileConfig(oComponent);
					var allProperties = chipBags.getPropertyNames();
					if (allProperties && allProperties instanceof Array && allProperties.length) {
						jQuery.each(allProperties, function(index, sProperty) {
							if (sProperty != "isSSBPersonalizedTile" && sProperty != "SSBDDView"
									&& sProperty != "isDataStoredAsAppState" && sProperty != "personalizationAppStateKey") {
								var currentPropertyFilters = chipBags.getProperty(sProperty);
								oFiltersMap[sProperty] = JSON.parse(currentPropertyFilters);
							}
						});
					}
				}
				*/
			} catch (exception) {
				jQuery.sap.log.error("ssuite.smartbusiness.tiles.lib.Util - getPersFilters",
						"failed to fetch personalized filters from chip bag " + exception.message);
				return null;
			}
			return oFiltersMap;
		},

		// start-up parameters for the app, not the tile!
		fetchStartupParameters : function(oComponent, params, tileProperties) {
			var oCdmTileConfig = ssuite.smartbusiness.tiles.lib.Util.prototype.getCdmTileConfig(oComponent);
			var oStartUpParameters = oCdmTileConfig.startupParameters || {};
			var oTileProperties = oCdmTileConfig.tileProperties || {};
			var allProperties = Object.keys(oTileProperties);
			var appStatePayload = {};
			var selectOptions = [];

			jQuery.each(allProperties, function(index, sProperty) {
				// check for personalized Tile
				if (sProperty == "isSSBPersonalizedTile") {
					appStatePayload.SSBPersonalizedTile = ["true"];
				} else if (sProperty == "SSBDDView") {
					appStatePayload.DDView = oTileProperties[sProperty];
				} else {
					var appStateFilterObject = {};
					appStateFilterObject.PropertyName = sProperty;
					appStateFilterObject.Ranges = [];
					var currentPropertyFilters = oTileProperties[sProperty];
					try {
						var oFilters = JSON.parse(currentPropertyFilters);
						if (oFilters && oFilters instanceof Array && oFilters.length) {
							jQuery.each(oFilters, function (index, sValue) {
								var appStateRangeObject = {};
								appStateRangeObject.Sign = 'I';
								appStateRangeObject.Option = 'EQ';
								appStateRangeObject.Low = sValue;
								appStateFilterObject.Ranges.push(appStateRangeObject);
							});
							selectOptions.push(appStateFilterObject);
						}
					} catch (e) {
						//igrnore as PoC only
					}
				}
			});
			if (selectOptions.length > 0)
				appStatePayload.SelectOptions = selectOptions;
			// check for personalized thresholds
			if (tileProperties && tileProperties.thresholds) {
				var thresholds = JSON.parse(tileProperties.thresholds);
				if (thresholds && (thresholds.WL || thresholds.CL || thresholds.WH || thresholds.CH || thresholds.TA)) {
					appStatePayload.Thresholds = {};
					if (thresholds.WL)
						appStatePayload.Thresholds.WL = [thresholds.WL];
					if (thresholds.CL)
						appStatePayload.Thresholds.CL = [thresholds.CL];
					if (thresholds.WH)
						appStatePayload.Thresholds.WH = [thresholds.WH];
					if (thresholds.CH)
						appStatePayload.Thresholds.CH = [thresholds.CH];
					if (thresholds.TA)
						appStatePayload.Thresholds.TA = [thresholds.TA];
				}
			}

			// Fetch the extra context evaluation data created from customdata of singleton and place in
			// appstate
			jQuery.proxy(ssuite.smartbusiness.tiles.lib.Util.prototype.attachContextInfoToAppStatePayload, this)(
					appStatePayload);
			return appStatePayload;
		},

		/**
		 * Fetch the extra context evaluation data created from customdata of singleton and place in appstate. For context
		 * URLs : get main odata model. create odata4analytics object for it. Get selected entitytype from evaluationdata.
		 * Get the corresponding entity set object and find if parameter entitytype exists for it. Form URLs as
		 * <odata_url>/$metadata#<entityType>
		 */
		attachContextInfoToAppStatePayload : function(appStatePayload) {
			var evalData = this.getView().getContent()[0].data('evaluationData');
			if(evalData){
			// Add parameters, variantid, text from eval data
				appStatePayload.Parameters = evalData.parameters;
				if (!appStatePayload.SSBPersonalizedTile)
					appStatePayload.SelectOptions = evalData.selectOptions;
				appStatePayload.SelectionVariantID = evalData.evaluationId;
				appStatePayload.Text = evalData.tileTitle;

				// calculate the context urls and add to appstatepayload
				var odataModel = null;
				// If data is cached, odatamodel is not set on the view. It is then taken from localdata.
				// If it not cached, as usual odatamodel can be taken from the view
				var componentLocalData = this.getView().getModel('component')._localData;
				if (!componentLocalData.noCache && !componentLocalData.bNoCachingEnabled) {
					odataModel = componentLocalData.oDataModel;
				} else {
					odataModel = this.getView().getModel();
				}
				var oDataURL = odataModel.sServiceUrl;
				var oDataAnalyticsModel = new sap.ui.model.analytics.odata4analytics.Model(
						sap.ui.model.analytics.odata4analytics.Model.ReferenceByModel(odataModel));
				for ( var entitySetName in oDataAnalyticsModel.getAllQueryResults()) {
					var entitySet = oDataAnalyticsModel.getAllQueryResults()[entitySetName];
					var entityTypeQName = entitySet.getEntityType().getQName();
					var entityTypeName = entityTypeQName.split('.')[entityTypeQName.split('.').length - 1];
					if (entityTypeName == evalData.selectedEntitySet) {
						if (entitySet.getParameterization()) {
							var parametersTypeQName = entitySet.getParameterization().getEntityType().getQName();
							var parametersTypeName = parametersTypeQName.split('.')[parametersTypeQName.split('.').length - 1];
							appStatePayload.ParameterContextUrl = oDataURL + '/$metadata#' + parametersTypeName;
						}
						appStatePayload.FilterContextUrl = oDataURL + '/$metadata#' + entityTypeName;
						break;
					}
				}
			} else {
				jQuery.sap.log.error("attachContextInfoToAppStatePayload", "no evaluation context found to attach to app state");
			}
		},

		/**
		 * include an OData model in the iContext.getSetting("analyticalModels") of the preprocessor. Needed by
		 * formatDataBinding below.
		 */
		addODataModelForPreprocessing : function(preprocessor, model) {
			preprocessor.xml.analyticalModels = preprocessor.xml.analyticalModels || [];
			preprocessor.xml.analyticalModels.push({
				metaModel : model.getMetaModel(),
				analyticalModel : new odata4analytics.Model(odata4analytics.Model.ReferenceByModel(model))
			});
		},

		/**
		 * returns the all the evaluation data to store as custom data in the view. can be used for various purposes.
		 * currently created for constructing the properties in app state
		 */
		formatEvaluationData : function(iContext, entityType, selVar, tileTitle, bNoStringification) {
			var evaluationData = {};
			evaluationData.selectedEntitySet = entityType.name;
			evaluationData.tileTitle = tileTitle;
			evaluationData.evaluationId = selVar.ID.String;
			if (selVar.Parameters && selVar.Parameters instanceof Array && selVar.Parameters.length) {
				evaluationData.parameters = [];
				for ( var index in selVar.Parameters) {
					var paramObjectFromSelVar = selVar.Parameters[index];
					var paramObjectForAppState = {};
					paramObjectForAppState.PropertyName = paramObjectFromSelVar.PropertyName.PropertyPath;
					paramObjectForAppState.PropertyValue = paramObjectFromSelVar.PropertyValue.String;
					evaluationData.parameters.push(paramObjectForAppState);
				}
			}
			if (selVar.SelectOptions && selVar.SelectOptions instanceof Array && selVar.SelectOptions.length) {
				evaluationData.selectOptions = [];
				for ( var index in selVar.SelectOptions) {
					var selectOption = {};
					selectOption.PropertyName = selVar.SelectOptions[index].PropertyName.PropertyPath;
					selectOption.Ranges = [];
					for ( var rangeIndex in selVar.SelectOptions[index].Ranges) {
						var selVarRangeObject = selVar.SelectOptions[index].Ranges[rangeIndex];
						var rangeObject = {};
						rangeObject.Low = selVarRangeObject.Low.String;
						rangeObject.Option = selVarRangeObject.Option.EnumMember.split('/')[1];
						rangeObject.Sign = selVarRangeObject.Sign.EnumMember.split('/')[1];
						if (selVarRangeObject.High)
							rangeObject.High = selVarRangeObject.High.String;
						selectOption.Ranges.push(rangeObject);
					}
					evaluationData.selectOptions.push(selectOption);
				}
			}
			if(bNoStringification)
				return evaluationData;
			else
				return stringify(evaluationData);
		},

		/**
		 * decides the binding path which considers the selection variant(input parameter and filters), sorting information,
		 * data limit, Evaluation Measure and TileSpecific configurations | resulting binding path is the aggregation
		 * binding path in XML View | format is "{path:'<entityset-with-parameters>',parameters:{select:"col1,col2",filters:[],sorter:[]},length:3}"
		 */
		formatDataBinding : function(iContext, meta, entityType, selvar, sort, maxItems, dataPoint, tileSpecific,
				personalizedFilters, bFromCache) {

			var sel = [];
			var sorter = [];
			var r = "";

			function addMeasure(measure) {
				var fm, unit;
				if (measure) {
					if (jQuery.inArray(measure.getName(), sel) === -1)
						sel.push(measure.getName());
					if ((unit = measure.getUnitProperty()) && jQuery.inArray(unit.name, sel) === -1)
						sel.push(unit.name);
				}
			}

			function addDimension(dim) {
				if (jQuery.inArray(dim.getName(), sel) === -1)
					sel.push(dim.getName());
				if (dim.getTextProperty() && jQuery.inArray(dim.getTextProperty().name, sel) === -1)
					sel.push(dim.getTextProperty().name);
			}

			function addDisplayFormat(dim) {
				if(dim.getKeyProperty().type === "Edm.DateTime"){
					var extendedProperties = dim.getKeyProperty().extensions;
					for (var key in extendedProperties)
						if(extendedProperties[key].name == "display-format" && extendedProperties[key].value == "Date") {
							tileSpecific.dimension.displayFormat = extendedProperties[key].value;
							break;
					}
				}
			}

			// adds the leading measure into the selection list | along with that it checks whether the
			// CriticalityCalculation which gives the threshold values are configured as Measures
			// and adds them into the select list | Target value if present is also added
			function addDataPoint(dp) {
				addMeasure(r.getQueryResult().getAllMeasures()[dp.Value.Path]);
				jQuery.each(dp.CriticalityCalculation || [], function() {
					if (this.Path)
						addMeasure(r.getQueryResult().getAllMeasures()[this.Path]);
				});
				if (dp.TargetValue && dp.TargetValue.Path)
					addMeasure(r.getQueryResult().getAllMeasures()[dp.TargetValue.Path]);
			}

			// sorting specific for Contribution Tile case
			function addSortOrderForContributionTile(sSortOrder, dimension, measure) {
				if (sSortOrder == "MA") {
					sorter.push({
						path : measure.Path,
						descending : false
					});
				} else if (sSortOrder == "MD") {
					sorter.push({
						path : measure.Path,
						descending : true
					});
				} else if (sSortOrder == "DA") {
					sorter.push({
						path : dimension.Path,
						descending : false
					});
				} else if (sSortOrder == "DD") {
					sorter.push({
						path : dimension.Path,
						descending : true
					});
				}
			}

			if (!bFromCache) {
				jQuery.each(iContext.getSetting("analyticalModels"), function() {
					if (this.metaModel.getProperty("/") === meta) {
						var m = this.analyticalModel;
						jQuery.each(m.getAllQueryResultNames(), function() {
							var q = m.getAllQueryResults()[this];
							if (q.getEntityType().getQName() === entityType.namespace + "." + entityType.name) {
								r = new odata4analytics.QueryResultRequest(q);
								if (q.getParameterization())
									r.setParameterizationRequest(new odata4analytics.ParameterizationRequest(q.getParameterization()));
								return false;
							}
						});
						return false;
					}
				});

				// populate input parameters configured in the evaluation
				if (selvar && selvar.Parameters) {
					jQuery.each(selvar.Parameters, function() {
						if (this.RecordType === "com.sap.vocabularies.UI.v1.IntervalParameter")
							r.getParameterizationRequest().setParameterValue(this.PropertyName.PropertyPath,
									this.PropertyValueFrom.String, this.PropertyValueTo.String);
						else
							r.getParameterizationRequest().setParameterValue(this.PropertyName.PropertyPath,
									this.PropertyValue.String);
					});
				}

				// populating additional filters configured in the evaluation
				var filters = [];
				if (selvar && selvar.SelectOptions) {
					jQuery.each(selvar.SelectOptions, function() {
						var prop = this.PropertyName.PropertyPath;
						jQuery.each(this.Ranges, function() {
							if (this.Sign.EnumMember === "com.sap.vocabularies.UI.v1.SelectionRangeSignType/I") {
								var filter = {
									path : prop,
									operator : this.Option.EnumMember.split("/")[1],
									value1 : this.Low.String
								};
								if (this.High)
									filter.value2 = this.High.String;
								filters.push(filter);
							}
						});
					});
				}

				// if personalized Tile filters are available add them
				if (personalizedFilters) {
					jQuery.each(personalizedFilters, function(sDim, oFilters) {
						if (oFilters && oFilters instanceof Array && oFilters.length) {
							jQuery.each(oFilters, function(index, sValue) {
								var filter = {
									path : sDim,
									operator : "EQ",
									value1 : sValue
								};
								filters.push(filter);
							});
						}
					});
				}

				// if datapoint is provided (default measure) add it in the select list
				if (dataPoint) {
					addDataPoint(dataPoint);
				}

				// sort options configured in DDView charts are added
				jQuery.each(sort || [], function() {
					if (jQuery.inArray(this.Property.PropertyPath, sel) === -1)
						sel.push(this.Property.PropertyPath);
					sorter.push({
						path : this.Property.PropertyPath,
						descending : this.Descending.Bool === "true"
					});
				});

				// based on the chip to load handle specific addition of measures and dimensions in the
				// selection list
				if (tileSpecific) {
					if (tileSpecific.isContributionTile || tileSpecific.isTrendTile) {
						addDimension(r.getQueryResult().getAllDimensions()[tileSpecific.dimension.Path]);
						addDisplayFormat(r.getQueryResult().getAllDimensions()[tileSpecific.dimension.Path]);
						if (tileSpecific.dimension.sortOrder) {
							var contributionDim = tileSpecific.dimension;
							addSortOrderForContributionTile(contributionDim.sortOrder, contributionDim, dataPoint.Value);
						}
					} else if (tileSpecific.isComparisonMMTile) {
						if (tileSpecific.measures && tileSpecific.measures instanceof Array && tileSpecific.measures.length) {
							jQuery.each(tileSpecific.measures, function(index, oMeasure) {
								addMeasure(r.getQueryResult().getAllMeasures()[oMeasure.COLUMN_NAME]);
							});
						}
					}
				}

				var result = {
					parameters : {
						select : sel.join(",")
					},
					filters : filters,
					sorter : sorter
				};

				try {
					result.path = r.getURIToQueryResultEntitySet();
				} catch (exception) {
					var queryResult = r.getQueryResult();
					result.path = "/" + queryResult.getEntitySet().getQName();
					jQuery.sap.log.error("formatDataBinding", "binding path with parameters failed - " + exception
							|| exception.message);
				}

				if (maxItems)
					result.length = maxItems;

				if (tileSpecific && tileSpecific.isContributionTile) {
					// this event triggers check for no data and the request for caching the data in SSB cache persistence
					result.events = {
						dataReceived : ".checkForNoDataAndCacheKPIData"
					};
				}
				if (tileSpecific && tileSpecific.isTrendTile) {
					var dimension = {};
					dimension.Name = tileSpecific.dimension.Path;
					dimension.Type = r.getQueryResult().getAllDimensions()[tileSpecific.dimension.Path].getKeyProperty().type;
					if (r.getQueryResult().getAllDimensions()[tileSpecific.dimension.Path].getTextProperty())
						dimension.Text = r.getQueryResult().getAllDimensions()[tileSpecific.dimension.Path].getTextProperty().name;
					result.dimension = dimension;
					return result;
				}

				return stringify(result);

			} else {
				// in case data is received from SSB Cache binding is received from the local json model | determined by flag
				// bFromCache
				var result = {};
				result.path = "";
				if (tileSpecific && tileSpecific.isTrendTile) {
					jQuery.each(iContext.getSetting("analyticalModels"), function() {
						if (this.metaModel.getProperty("/") === meta) {
							var m = this.analyticalModel;
							jQuery.each(m.getAllQueryResultNames(), function() {
								var q = m.getAllQueryResults()[this];
								if (q.getEntityType().getQName() === entityType.namespace + "." + entityType.name) {
									r = new odata4analytics.QueryResultRequest(q);
									return false;
								}
							});
							return false;
						}
					});
					var dimension = {};
					dimension.Name = tileSpecific.dimension.Path;
					dimension.Type = r.getQueryResult().getAllDimensions()[tileSpecific.dimension.Path].getKeyProperty().type;
					if (r.getQueryResult().getAllDimensions()[tileSpecific.dimension.Path].getTextProperty())
						dimension.Text = r.getQueryResult().getAllDimensions()[tileSpecific.dimension.Path].getTextProperty().name;
					result.dimension = dimension;
					return result;
				}
				return stringify(result);
			}
		},

		formatDataBindingForTrendTile : function(iContext, meta, entityType, selvar, sort, maxItems, dataPoint,
				tileSpecific, personalizedFilters, personalizedThresholds, bFromCache) {
			var result = ssuite.smartbusiness.tiles.lib.Util.prototype.formatDataBinding(iContext, meta, entityType, selvar,
					sort, maxItems, dataPoint, tileSpecific, personalizedFilters, bFromCache);
			result.dataPoint = dataPoint;
			// result.dimension = tileSpecific.dimension.Path;
			result.personalizedFilters = personalizedFilters;
			if(tileSpecific.dimension.displayFormat)
				result.dimensionDisplayFormat = tileSpecific.dimension.displayFormat;
			result.personalizedThresholds = personalizedThresholds;
			var encodedResult = encodeURIComponent(JSON.stringify(result));
			return encodedResult;
		},

		decideNumberFormatForTrendTile : function(oFormatting, isCurrency, oMeasureUnit) {
			var result = {
				currency : "",
				oFormatting : oFormatting
			};

			if (isCurrency && isCurrency.Path)
				result.currency = isCurrency.Path;

			if (oMeasureUnit && oMeasureUnit.Path)
				result.unit = oMeasureUnit.Path;

			var encodedResult = encodeURIComponent(JSON.stringify(result));
			return encodedResult;
		},

		getBindingContextFromFragment : function(model, fragment) {
			var path;
			if (fragment) {
				fragment = fragment.split("/@");
				var target = fragment[0].split(".");
				var type = target.pop();
				var namespace = target.join(".");
				jQuery.each(model.getProperty("/dataServices/schema"), function() {
					if (this.namespace === namespace) {
						jQuery.each(this.entityType, function() {
							if (this.name === type) {
								path = this.$path;
								if (fragment[1])
									path += "/" + fragment[1];
								return false;
							}
						});
						return false;
					}
				});
			}
			return path && model.createBindingContext(path);
		},

		resolveMetaModelRoot : function(c) {
			return c.getModel().createBindingContext("/");
		},

		resolveEntityType : function(c) {
			var path = c.getPath().split("/");
			if (path[4] === "entityType")
				return c.getModel().createBindingContext(path.slice(0, 6).join("/"));
			else if (path[6] === "entitySet")
				return ssuite.smartbusiness.tiles.lib.Util.prototype.getBindingContextFromFragment(c.getModel(), c.getModel()
						.getProperty(path.slice(0, 8).join("/") + "/entityType"));
		},

		/*in case of deviation tile time formatting, unit is not shown
		 * whereas in numeric tile time formatting, unit is converted (days/min/hr/sec) and shown
		*/
		decideUnitBindingPath : function(sCurrency, oMeasure, oMeasureUnit, isDeviation) {
			if(sCurrency){
				var bindingPath = "parts: [{path:'" + oMeasure.Path + "'}" + ", {path:'" + sCurrency.Path + "'}]";

				return "{" + bindingPath
						+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.decideUnitBinding'}";

			}else if (oMeasure && oMeasureUnit) {
				if(isDeviation){
					var bindingPath = "parts: [ {path:'" + oMeasure.Path + "'}" + ", {path:'" + oMeasureUnit.Path + "'}" + ", {path:'" + oMeasure.Path + "'}]";

					return "{" + bindingPath
							+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.decideUnitBinding'}";
				}
				var bindingPath = "parts: [ {path:'" + oMeasure.Path + "'}" + ", {path:'" + oMeasureUnit.Path + "'}]";

				return "{" + bindingPath
						+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.decideUnitBinding'}";
			}
		},

		decideUnitBinding : function(oValue, oUnitValue, isDeviation) {

			if (oUnitValue && oUnitValue == "SEC") {
				if(!isNaN(isDeviation)){
					return "";
				}else{
					var i18nModel = this.getModel("i18n");
					oUnitValue = (parseInt(oValue / 86400) > 1 && oValue != 0) ? i18nModel.getProperty("TIME_DAYS") :
						(parseInt(oValue / 86400) > 0 && oValue != 0) ? i18nModel.getProperty("TIME_DAY") :
						(parseInt(oValue / 3600) > 0 && oValue != 0) ? i18nModel.getProperty("TIME_HR") :
						(parseInt(oValue / 60) > 0 && oValue != 0) ? i18nModel.getProperty("TIME_MIN") : i18nModel.getProperty("TIME_SEC");
				}
			}
			return oUnitValue;
		},

		/**
		 * EVALUATION MEASURE AGGREGATION WITH THRESHOLD CONSIDERATIONS MODULE | decides based on the Scaling factor and
		 * Decimal precision the kind of formatter to use to format the Measure Aggregate value
		 */
		decideEvaluationMeasureBindPath : function(oMeasure, oFormatting, isCurrency, oMeasureUnit, isNumeric, isDeviation) {

			var bindingPath = "{path:'" + oMeasure.Path + "'}";
			if(isNumeric && !isDeviation){
				/*both isNumeric and isDeviation field is checked for numeric tile. In case of Numeric Tile isDeviation is empty
				 * if the function is called from numeric tile, measure value is passed as the second attribute, this is only to differentiate if its numeric or not,
				 * as in case of numeric tile, if time formatting is applied, the value need not have the unit but everywhere else it needs to be in the format '5 Days'
				*/
				bindingPath = bindingPath + ", {path:'" + oMeasure.Path + "'}";
			} else if (isNumeric === true && isDeviation === true && oMeasureUnit && oMeasureUnit.Path) { // Tooltip
				bindingPath = bindingPath + ", {path:'" + oMeasureUnit.Path + "'}";
			} else {
				bindingPath = bindingPath + ", {path:''}";
			}
			if(isCurrency && isCurrency.Path){
				bindingPath = bindingPath + ", {path:'"+isCurrency.Path+"'}";
			} else if (oMeasureUnit && oMeasureUnit.Path) {
				bindingPath = bindingPath + ", {path:'" + oMeasureUnit.Path + "'}";
			}
			//if Numeric Tile
			bindingPath = "parts: [ " + bindingPath + "]";
			if (oFormatting && oFormatting.ScaleFactor && oFormatting.ScaleFactor.Decimal == "0.01") {
				// percentage Evaluation Measure
				if (oFormatting && oFormatting.NumberOfFractionalDigits) {
					switch (oFormatting.NumberOfFractionalDigits.Int) {
						case "1" :
							if (isDeviation) {
								return "{" + bindingPath
										+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.formatValueNoScaleNoDecimalP'}";
							} else {
								return "{" + bindingPath
										+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.formatValueNoDecimalP'}";
							}
						case "2" :
							if (isDeviation) {
								return "{" + bindingPath
										+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.formatValueNoScaleOneDecimalP'}";
							} else {
								return "{" + bindingPath
										+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.formatValueOneDecimalP'}";
							}
						case "3" :
							if (isDeviation) {
								return "{" + bindingPath
										+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.formatValueNoScaleTwoDecimalP'}";
							} else {
								return "{" + bindingPath
										+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.formatValueTwoDecimalP'}";
							}
						case "4" :
							if (isDeviation) {
								return "{" + bindingPath
										+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.formatValueNoScaleThreeDecimalP'}";
							} else {
								return "{" + bindingPath
										+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.formatValueThreeDecimalP'}";
							}
					}
				}
				if (isDeviation) {
					return "{" + bindingPath
							+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.formatValueNoScaleDefaultP'}";
				} else {
					return "{" + bindingPath
							+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.formatMeasureAggregateValueP'}";
				}
			} else {
				// absolute Evaluation Measure
				if (oFormatting && oFormatting.NumberOfFractionalDigits) {
					switch (oFormatting.NumberOfFractionalDigits.Int) {
						case "1" :
							return "{	" + bindingPath
									+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.formatValueNoDecimal'}";
						case "2" :
							return "{" + bindingPath
									+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.formatValueOneDecimal'}";
						case "3" :
							return "{" + bindingPath
									+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.formatValueTwoDecimal'}";
						case "4" :
							return "{	" + bindingPath
									+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.formatValueThreeDecimal'}";
					}
				}
				return "{" + bindingPath
						+ ", formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.formatMeasureAggregateValue'}";
			}
		},

		/**
		 * formatter function for absolute value formatting
		 */
		formatValueNoDecimal : function(oValue, isNumeric, sCurrency) {
			return jQuery.proxy(ssuite.smartbusiness.tiles.lib.Util.prototype.formatMeasureAggregateValue, this)(oValue,isNumeric, sCurrency, 0);
		},

		formatValueOneDecimal : function(oValue, isNumeric, sCurrency) {
			return jQuery.proxy(ssuite.smartbusiness.tiles.lib.Util.prototype.formatMeasureAggregateValue, this)(oValue, isNumeric, sCurrency, 1);
		},

		formatValueTwoDecimal : function(oValue, isNumeric, sCurrency) {
			return jQuery.proxy(ssuite.smartbusiness.tiles.lib.Util.prototype.formatMeasureAggregateValue, this)(oValue, isNumeric, sCurrency, 2);
		},

		formatValueThreeDecimal : function(oValue, isNumeric, sCurrency) {
			return jQuery.proxy(ssuite.smartbusiness.tiles.lib.Util.prototype.formatMeasureAggregateValue, this)(oValue, isNumeric, sCurrency, 3);
		},

		/**
		 * formatter function for Percentage value Formatting
		 */
		formatValueNoDecimalP : function(oValue, isNumeric, sCurrency) {
			return jQuery.proxy(ssuite.smartbusiness.tiles.lib.Util.prototype.formatMeasureAggregateValue, this)(oValue, isNumeric, sCurrency, 0,true);
		},

		formatValueOneDecimalP : function(oValue, isNumeric, sCurrency) {
			return jQuery.proxy(ssuite.smartbusiness.tiles.lib.Util.prototype.formatMeasureAggregateValue, this)(oValue, isNumeric, sCurrency, 1,true);
		},

		formatValueTwoDecimalP : function(oValue, isNumeric, sCurrency) {
			return jQuery.proxy(ssuite.smartbusiness.tiles.lib.Util.prototype.formatMeasureAggregateValue, this)(oValue, isNumeric, sCurrency, 2,true);
		},

		formatValueThreeDecimalP : function(oValue, isNumeric, sCurrency) {
			return jQuery.proxy(ssuite.smartbusiness.tiles.lib.Util.prototype.formatMeasureAggregateValue, this)(oValue, isNumeric, sCurrency, 3,true);
		},

		formatMeasureAggregateValueP : function(oValue, isNumeric, sCurrency) {
			return jQuery.proxy(ssuite.smartbusiness.tiles.lib.Util.prototype.formatMeasureAggregateValue, this)(oValue, isNumeric, sCurrency, null,true);
		},

		/**
		 * formatter function for Percentage value Formatting - Deviation Tile without Scale
		 */
		formatValueNoScaleNoDecimalP : function(oValue, isNumeric, sCurrency) {
			return jQuery.proxy(ssuite.smartbusiness.tiles.lib.Util.prototype
					.formatMeasureAggregateValue, this)(oValue, isNumeric, sCurrency, 0, true, true);
		},

		formatValueNoScaleOneDecimalP : function(oValue, isNumeric, sCurrency) {
			return jQuery.proxy(ssuite.smartbusiness.tiles.lib.Util.prototype
					.formatMeasureAggregateValue, this)(oValue, isNumeric, sCurrency, 1, true, true);
		},

		formatValueNoScaleTwoDecimalP : function(oValue, isNumeric, sCurrency) {
			return jQuery.proxy(ssuite.smartbusiness.tiles.lib.Util.prototype
					.formatMeasureAggregateValue, this)(oValue, isNumeric, sCurrency, 2, true, true);
		},

		formatValueNoScaleThreeDecimalP : function(oValue, isNumeric, sCurrency) {
			return jQuery.proxy(ssuite.smartbusiness.tiles.lib.Util.prototype
					.formatMeasureAggregateValue, this)(oValue, isNumeric, sCurrency, 3, true, true);
		},

		formatValueNoScaleDefaultP : function(oValue, isNumeric, sCurrency) {
			return jQuery.proxy(ssuite.smartbusiness.tiles.lib.Util.prototype.formatMeasureAggregateValue, this)(oValue, isNumeric, sCurrency, null, true,
					true);
		},

		/**
		 * Calculates the aggregate value by applying decimal precision, scaling, unit formatting as well as time formatting
		 *
		 * @param oValue :
		 *		  measure aggregate value
		 * @param isNumeric :
		 * 			a differentiater to check if the function is called from trend tile or elsewhere,only useful in case of time formatting.
		 *		  contains number if the function is called from numeric tile, else is either undefined or has string value when called from trend tile.
		 * @param sCurrency :
		 *		  contains
		 * @param decimalPrcs :
		 * 			number of decimal places
		 * @param bPercent
		 * 			boolean value true if percent formatting needs to be applied else boolean value false
		 * @param bNoScale
		 * 			boolean value true if percent scaling is to be removed else boolean value false
		 */
		formatMeasureAggregateValue : function(oValue, isNumeric, sCurrency, decimalPrcs, bPercent, bNoScale) {

			if (oValue) {
				oValue = parseFloat(oValue, 10);
				var decimals = 2;
				if (sCurrency
						&& (sCurrency.toUpperCase() == "EUR" || sCurrency.toUpperCase() == "USD"
								|| sCurrency.toUpperCase() == "JPY" || sCurrency.toUpperCase() == "KWD")) {
					sCurrency = sCurrency.toUpperCase();
					decimals = (sCurrency == "EUR" || sCurrency == "USD") ? 2 : (sCurrency == "JPY") ? 0 : 3;
				} else if (sCurrency && sCurrency.toUpperCase() == "SEC") {
					var i18nModel = (isNumeric == "isTrend")? this.getView().getModel("i18n"): this.getModel("i18n");

					/*this check is done so that to know if the formatting should be done for numeric tile or other tiles.
					 * from numeric tile numeric value is passed, everywhere else either empty value or string is passed.
					*/
					if(!isNaN(isNumeric)){
						//if isNumeric is a number, time formatting is done without the time unit as the suffix (only for numeric tile)
						var dateTimeValue = ssuite.smartbusiness.tiles.lib.Util.prototype.getFormattedTime(oValue, decimalPrcs, false, false, i18nModel);
						if (dateTimeValue != undefined)
							return dateTimeValue;
					} else if (isNumeric == "SEC") { // Tooltip
						var dateTimeValue = ssuite.smartbusiness.tiles.lib.Util.prototype.getFormattedTime(oValue, 2, true, true, i18nModel);
						if (dateTimeValue != undefined)
							return dateTimeValue;
					} else {
						//if isNumeric is not a number, time formatting is done with the time unit as the suffix
						var dateTimeValue = ssuite.smartbusiness.tiles.lib.Util.prototype.getFormattedTime(oValue, decimalPrcs, true, false, i18nModel);
						if (dateTimeValue != undefined)
							return dateTimeValue;
					}
				}else if (decimalPrcs === 0 || decimalPrcs === 1 || decimalPrcs === 2 || decimalPrcs === 3) {
					decimals = decimalPrcs;
				}

				var oSettings = {
					minFractionDigits : 0,
					maxFractionDigits : decimals,
					style : "short",
					groupingEnabled : false
				};
				var oLocale = sap.ui.getCore().getConfiguration().getLocale();
				var oFormatter = "";

				if (bPercent) {
					oFormatter = sap.ui.core.format.NumberFormat.getPercentInstance(oSettings);
				} else {
					oFormatter = sap.ui.core.format.NumberFormat.getFloatInstance(oSettings);
				}

				if (bNoScale) {
					var formattedValue = oFormatter.format(oValue);
					var valueNoScale = ssuite.smartbusiness.tiles.lib.Util.prototype.removePercentSign(formattedValue);
					return valueNoScale;
				} else {
					var formattedValue = oFormatter.format(oValue);
					return formattedValue;
				}
			} else
				return 0;
		},

		removePercentSign : function(sValue) {
			var percentSign = "%";
			try {
				var oLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
				var oLocaleData = sap.ui.core.LocaleData.getInstance(oLocale);
				var localePercent = oLocaleData.getNumberSymbol("percentSign");
				if (localePercent) {
					percentSign = localePercent;
				}
			} catch (exception) {
				jQuery.sap.log.error("removePercentSign", "removing percent sign failed " + exception.message);
			}
			return sValue.replace(percentSign, "").trim();
		},

		/**
		 * checks if the given measure(sCurrentMeasure) is either Evaluation Measure / Additional measure
		 */
		_checkForEvalOrAddMeasure : function(sCurrentMeasure, oEvalMeasure, oAdditionalMeasure){
			var isEvalOrAddMsr = false;
			var evalMeasure = oEvalMeasure && oEvalMeasure.Value && oEvalMeasure.Value.Path;
			if(sCurrentMeasure == evalMeasure){
				isEvalOrAddMsr = true;
			}else{
				//check if the given measure is an additional measure
				if(oAdditionalMeasure && oAdditionalMeasure instanceof Array && oAdditionalMeasure.length){
					jQuery.each(oAdditionalMeasure,function(index, oAddMsr){
						if(oAddMsr && oAddMsr.name && oAddMsr.name == sCurrentMeasure){
							isEvalOrAddMsr = true;
							return false;
						}
					});
				}
			}
			return isEvalOrAddMsr;
		},

		/**
		 * simple wrapper function for formatting Comparison Multi measure value |
		 * ssuite.smartbusiness.tiles.lib.Util.prototype.decideEvaluationMeasureBindPath requires measure to be in the
		 * format {Path:'sMeasure'}
		 */
		decideMsrAggrCompMM : function(iContext, meta, entityType, sMeasure, oDataPoint, additionalMeasures) {
			if (sMeasure){
				var r = "";
				try {
					jQuery.each(iContext.getSetting("analyticalModels"), function() {
						if (this.metaModel.getProperty("/") === meta) {
							var m = this.analyticalModel;
							jQuery.each(m.getAllQueryResultNames(), function() {
								var q = m.getAllQueryResults()[this];
								if (q.getEntityType().getQName() === entityType.namespace + "." + entityType.name) {
									r = new odata4analytics.QueryResultRequest(q);
									if (q.getParameterization())
										r.setParameterizationRequest(new odata4analytics.ParameterizationRequest(q.getParameterization()));
									return false;
								}
							});
							return false;
						}
					});
					var bPercentMsr = false;
					var oFormatting = oDataPoint && oDataPoint.ValueFormat;
					//check if the evaluation is configured as Percentage Scale Factor
					if (oFormatting && oFormatting.ScaleFactor && oFormatting.ScaleFactor.Decimal == "0.01") {
							bPercentMsr = ssuite.smartbusiness.tiles.lib.Util.prototype._checkForEvalOrAddMeasure(sMeasure,oDataPoint,additionalMeasures);
					}
					if(bPercentMsr){
						return ssuite.smartbusiness.tiles.lib.Util.prototype.decideEvaluationMeasureBindPath({
							Path : sMeasure
						},oFormatting, false, false, false, false);
					}else{
						if(r.getQueryResult().getAllMeasures()[sMeasure] && r.getQueryResult().getAllMeasures()[sMeasure].getUnitProperty()){
							var sUnit = r.getQueryResult().getAllMeasures()[sMeasure].getUnitProperty();
							sUnit = sUnit.name;
							return ssuite.smartbusiness.tiles.lib.Util.prototype.decideEvaluationMeasureBindPath({
								Path : sMeasure
							},false,{Path : sUnit}, false, false, false);
						}
						return ssuite.smartbusiness.tiles.lib.Util.prototype.decideEvaluationMeasureBindPath({
							Path : sMeasure
						},false, false, false, false, false);
					}
				} catch (exception) {
					jQuery.sap.log.error("decideMsrAggrCompMM", "comparison MM tile - measure value determination failed - "
							+ exception.message);
				}
			}	else
				return "";

		},

		/**
		 * determines the Measure label in case of Comparison Multi measure Tile
		 */
		decideMsrLabelCompMM : function(iContext, meta, entityType, measure) {
			var r = "";
			try {
				jQuery.each(iContext.getSetting("analyticalModels"), function() {
					if (this.metaModel.getProperty("/") === meta) {
						var m = this.analyticalModel;
						jQuery.each(m.getAllQueryResultNames(), function() {
							var q = m.getAllQueryResults()[this];
							if (q.getEntityType().getQName() === entityType.namespace + "." + entityType.name) {
								r = new odata4analytics.QueryResultRequest(q);
								if (q.getParameterization())
									r.setParameterizationRequest(new odata4analytics.ParameterizationRequest(q.getParameterization()));
								return false;
							}
						});
						return false;
					}
				});
				var allMeasures = r.getQueryResult().getAllMeasures();
				var currentMeasure = allMeasures[measure];
				if (currentMeasure && currentMeasure.getLabelText && currentMeasure.getLabelText()) {
					return currentMeasure.getLabelText();
				}
			} catch (exception) {
				jQuery.sap.log.error("decideMsrLabelCompMM", "comparison MM tile - measure label determination failed - "
						+ exception.message);
			}
			return measure;
		},

		formatMeasureColor : function(oValue){
			if(oValue == "Critical")
				return "Error";
			else if(oValue == "Warning")
				return "Critical";
			return oValue;
		},

		/**
		 * decides the binding path for the ValueColor of the Tile | the SemanticColor is decided for the measure aggregate
		 * based on the thresholds configured | if the evaluation measure is a percentage measure all the values are
		 * multiplied by 100
		 */
		formatCriticality : function(dataPoint, personalizedThresholds, personalizedFilters) {
			function format(anno) {
				return anno && (anno.Path ? "parseFloat(${" + anno.Path + "},10)" : parseFloat(anno.Decimal, 10));
			}

			var evalMeasure = dataPoint.Value;
			var crit = dataPoint.CriticalityCalculation;
			var oFormatting = dataPoint.ValueFormat;
			var targetValue = dataPoint.TargetValue;

			if (crit && crit.ImprovementDirection && crit.ImprovementDirection.EnumMember) {

				var warningLow = null;
				var criticalLow = null;
				var warningHigh = null;
				var criticalHigh = null;

				// check if user personalized thresholds are present in case of Personalized Tile
				if (personalizedThresholds
						&& (personalizedThresholds.WL || personalizedThresholds.CL || personalizedThresholds.WH
								|| personalizedThresholds.CH || personalizedThresholds.TA)) {
					warningLow = {
						Decimal : personalizedThresholds.WL
					};
					criticalLow = {
						Decimal : personalizedThresholds.CL
					};
					warningHigh = {
						Decimal : personalizedThresholds.WH
					};
					criticalHigh = {
						Decimal : personalizedThresholds.CH
					};
					targetValue = personalizedThresholds.TA;
				} else {
					// if personalized filters are present with no new thresholds then the current thresholds will
					// not be
					// considered
					if (personalizedFilters && !(jQuery.isEmptyObject(personalizedFilters)))
						return "Neutral";
					warningLow = crit.ToleranceRangeLowValue;
					criticalLow = crit.DeviationRangeLowValue;
					warningHigh = crit.ToleranceRangeHighValue;
					criticalHigh = crit.DeviationRangeHighValue;
				}

				var bWL = !(warningLow && (warningLow.Decimal || warningLow.Path));
				var bCL = !(criticalLow && (criticalLow.Decimal || criticalLow.Path));
				var bWH = !(warningHigh && (warningHigh.Decimal || warningHigh.Path));
				var bCH = !(criticalHigh && (criticalHigh.Decimal || criticalHigh.Path));

				// checking for mandatory data availability based on the Criticality ImprovementDirection
				if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
						&& (bWL || bCL)) {
					return "Neutral";
				}
				if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize"
						&& (bWH || bCH)) {
					return "Neutral";
				}
				if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target"
						&& (bWL || bCL || bWH || bCH)) {
					return "Neutral";
				}

				var measureValue = format(evalMeasure);

				// check for Relative To Threshold case | warningLow case
				if (targetValue && targetValue.Path && crit.ToleranceRangeLowValue && crit.ToleranceRangeLowValue.Decimal) {
					warningLow = "(parseFloat(${" + targetValue.Path + "},10) * "
							+ ((parseFloat(crit.ToleranceRangeLowValue.Decimal, 10)) / 100) + ")";
				} else
					warningLow = format(warningLow);

				// check for Relative To Threshold case | criticalLow case
				if (targetValue && targetValue.Path && crit.DeviationRangeLowValue && crit.DeviationRangeLowValue.Decimal) {
					criticalLow = "(parseFloat(${" + targetValue.Path + "},10) * "
							+ ((parseFloat(crit.DeviationRangeLowValue.Decimal, 10)) / 100) + ")";
				} else
					criticalLow = format(criticalLow);

				// check for Relative To Threshold case | warningHigh case
				if (targetValue && targetValue.Path && crit.ToleranceRangeHighValue && crit.ToleranceRangeHighValue.Decimal) {
					warningHigh = "(parseFloat(${" + targetValue.Path + "},10) * "
							+ ((parseFloat(crit.ToleranceRangeHighValue.Decimal, 10)) / 100) + ")";
				} else
					warningHigh = format(warningHigh);

				// check for Relative To Threshold case | criticalHigh case
				if (targetValue && targetValue.Path && crit.DeviationRangeHighValue && crit.DeviationRangeHighValue.Decimal) {
					criticalHigh = "(parseFloat(${" + targetValue.Path + "},10) * "
							+ ((parseFloat(crit.DeviationRangeHighValue.Decimal, 10)) / 100) + ")";
				} else
					criticalHigh = format(criticalHigh);

				var isPercentageMsr = false;
				// check whether evaluation measure is configured as a percentage measure
				if (oFormatting && oFormatting.ScaleFactor && oFormatting.ScaleFactor.Decimal == "0.01") {
					isPercentageMsr = true;
				}

				var isPercentageMsr = false;
				// check whether evaluation measure is configured as a percentage measure
				if (oFormatting && oFormatting.ScaleFactor && oFormatting.ScaleFactor.Decimal == "0.01") {
					isPercentageMsr = true;
				}
				switch (crit.ImprovementDirection.EnumMember) {
					case "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize" :
						if (isPercentageMsr) {
							return "{= (" + measureValue + " * 100) >= (" + warningLow + " * 100)  ? 'Good' : (" + measureValue
									+ " * 100) >= (" + criticalLow + " * 100) ? 'Critical' : 'Error' }";
						} else {
							return "{= " + measureValue + " >= " + warningLow + " ? 'Good' : " + measureValue + " >= " + criticalLow
									+ " ? 'Critical' : 'Error' }";
						}
					case "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize" :
						if (isPercentageMsr) {
							return "{= (" + measureValue + " * 100) <= (" + warningHigh + " * 100) ? 'Good' : (" + measureValue
									+ " * 100) <= (" + criticalHigh + " * 100) ? 'Critical' : 'Error' }";
						} else {
							return "{= " + measureValue + " <= " + warningHigh + " ? 'Good' : " + measureValue + " <= "
									+ criticalHigh + " ? 'Critical' : 'Error' }";
						}
					case "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target" :
						if (isPercentageMsr) {
							return "{= ((" + measureValue + " * 100) >= (" + warningLow + " * 100) && (" + measureValue
									+ " * 100) <= (" + warningHigh + " * 100)) ? 'Good' : ((" + measureValue + " * 100) < ("
									+ criticalLow + " * 100) || (" + measureValue + " * 100) > (" + criticalHigh
									+ " * 100) ) ? 'Error' : 'Critical' }";
						} else {
							return "{= (" + measureValue + " >= " + warningLow + " && " + measureValue + " <= " + warningHigh
									+ ") ? 'Good' : (" + measureValue + " < " + criticalLow + " || " + measureValue + " > "
									+ criticalHigh + ") ? 'Error' : 'Critical' }";
						}
				}
			} else {
				return "Neutral";
			}
		},

		/**
		 * decides whether the evaluation measure is configured as Percentage Measure | used in Deviation Tile
		 */
		decideScaleForDeviationTile : function(dataPoint) {
			var sScale = "";
			var oFormatting = dataPoint.ValueFormat;
			// check whether evaluation measure is configured as a percentage measure
			if (oFormatting && oFormatting.ScaleFactor && oFormatting.ScaleFactor.Decimal == "0.01") {
				sScale = "%";
			}
			return sScale;
		},

		/**
		 * in case of deviation tile the actual value is multiplied by 100 if evaluation measure is configured as Percentage
		 */
		formatMeasurePathWithIntConversionForDeviation : function(oPath, dataPoint) {
			var oFormatting = dataPoint.ValueFormat;
			// check whether evaluation measure is configured as a percentage measure
			if (oFormatting && oFormatting.ScaleFactor && oFormatting.ScaleFactor.Decimal == "0.01") {
				return "{	path : '" + oPath
						+ "', formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.convertToNumberWithPercentageConversion'}";
			}
			return "{	path : '" + oPath + "', formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.convertToNumber'}";
		},

		convertToNumberWithPercentageConversion : function(sValue) {
			if (sValue) {
				return (parseFloat(sValue, 10) * 100);
			} else
				return "";
		},

		/**
		 * checks whether threshold critical is configured and returns a boolean value accordingly | used in deviation tile
		 */
		checkForThresholdCritical : function(dataPoint, personalizedThresholds, personalizedFilters) {
			var crit = dataPoint.CriticalityCalculation;
			if (crit && crit.ImprovementDirection && crit.ImprovementDirection.EnumMember) {
				var criticalLow = null;
				var criticalHigh = null;
				// check if user personalized thresholds are present in case of Personalized Tile
				if (personalizedThresholds
						&& (personalizedThresholds.WL || personalizedThresholds.CL || personalizedThresholds.WH
								|| personalizedThresholds.CH || personalizedThresholds.TA)) {
					criticalLow = {
						Decimal : personalizedThresholds.CL
					};
					criticalHigh = {
						Decimal : personalizedThresholds.CH
					};
				} else {
					// if personalized filters are present with no new thresholds then the current thresholds will
					// not be
					// considered
					if (personalizedFilters && !(jQuery.isEmptyObject(personalizedFilters)))
						return false;
					criticalLow = crit.DeviationRangeLowValue;
					criticalHigh = crit.DeviationRangeHighValue;
				}

				var bCL = !(criticalLow && (criticalLow.Decimal || criticalLow.Path));
				var bCH = !(criticalHigh && (criticalHigh.Decimal || criticalHigh.Path));

				// checking for mandatory data availability based on the Criticality ImprovementDirection
				if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
						&& (bCL)) {
					return false;
				}
				if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize"
						&& (bCH)) {
					return false;
				}
				if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target") {
					return false;
				}
				return true;
			} else
				return false;
		},

		/**
		 * decides the binding path for the Threshold critical case | it can be an absolute value or the aggregate of a
		 * measure | used in Deviation Tile
		 */
		formatThresholdCritical : function(dataPoint, personalizedThresholds) {
			function format(anno) {
				return anno && (anno.Path ? "parseFloat(${" + anno.Path + "},10)" : parseFloat(anno.Decimal, 10));
			}

			var crit = dataPoint.CriticalityCalculation;
			var oFormatting = dataPoint.ValueFormat;
			var targetValue = dataPoint.TargetValue;

			if (crit && crit.ImprovementDirection && crit.ImprovementDirection.EnumMember) {

				var criticalLow = null;
				var criticalHigh = null;

				// check if user personalized thresholds are present in case of Personalized Tile
				if (personalizedThresholds
						&& (personalizedThresholds.WL || personalizedThresholds.CL || personalizedThresholds.WH
								|| personalizedThresholds.CH || personalizedThresholds.TA)) {
					criticalLow = {
						Decimal : personalizedThresholds.CL
					};
					criticalHigh = {
						Decimal : personalizedThresholds.CH
					};
					targetValue = personalizedThresholds.TA;
				} else {
					criticalLow = crit.DeviationRangeLowValue;
					criticalHigh = crit.DeviationRangeHighValue;
				}

				var bCL = !(criticalLow && (criticalLow.Decimal || criticalLow.Path));
				var bCH = !(criticalHigh && (criticalHigh.Decimal || criticalHigh.Path));

				// checking for mandatory data availability based on the Criticality ImprovementDirection
				if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
						&& (bCL)) {
					return 0;
				}
				if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize"
						&& (bCH)) {
					return 0;
				}

				var isPercentageMsr = false;
				// check whether evaluation measure is configured as a percentage measure
				if (oFormatting && oFormatting.ScaleFactor && oFormatting.ScaleFactor.Decimal == "0.01") {
					isPercentageMsr = true;
				}

				// check for Relative To Threshold case | criticalLow case
				if (targetValue && targetValue.Path && crit.DeviationRangeLowValue && crit.DeviationRangeLowValue.Decimal) {
					criticalLow = "(parseFloat(${" + targetValue.Path + "},10) * "
							+ ((parseFloat(crit.DeviationRangeLowValue.Decimal, 10)) / 100) + ")";
				} else
					criticalLow = format(criticalLow);

				// check for Relative To Threshold case | criticalHigh case
				if (targetValue && targetValue.Path && crit.DeviationRangeHighValue && crit.DeviationRangeHighValue.Decimal) {
					criticalHigh = "(parseFloat(${" + targetValue.Path + "},10) * "
							+ ((parseFloat(crit.DeviationRangeHighValue.Decimal, 10)) / 100) + ")";
				} else
					criticalHigh = format(criticalHigh);

				switch (crit.ImprovementDirection.EnumMember) {
					case "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize" :
						if (isPercentageMsr)
							return "{= " + criticalLow + " * 100 }";
						else
							return "{= " + criticalLow + "}";
					case "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize" :
						if (isPercentageMsr)
							return "{= " + criticalHigh + " * 100 }";
						else
							return "{= " + criticalHigh + "}";
					default :
						return 0;
				}
			} else {
				return 0;
			}
		},

		/**
		 * checks whether threshold warning is configured and returns a boolean value accordingly | used in deviation tile
		 */
		checkForThresholdWarning : function(dataPoint, personalizedThresholds, personalizedFilters) {
			var crit = dataPoint.CriticalityCalculation;
			if (crit && crit.ImprovementDirection && crit.ImprovementDirection.EnumMember) {
				var warningLow = null;
				var warningHigh = null;
				// check if user personalized thresholds are present in case of Personalized Tile
				if (personalizedThresholds
						&& (personalizedThresholds.WL || personalizedThresholds.CL || personalizedThresholds.WH
								|| personalizedThresholds.CH || personalizedThresholds.TA)) {
					warningLow = {
						Decimal : personalizedThresholds.WL
					};
					warningHigh = {
						Decimal : personalizedThresholds.WH
					};
				} else {
					// if personalized filters are present with no new thresholds then the current thresholds will
					// not be
					// considered
					if (personalizedFilters && !(jQuery.isEmptyObject(personalizedFilters)))
						return false;
					warningLow = crit.ToleranceRangeLowValue;
					warningHigh = crit.ToleranceRangeHighValue;
				}

				var bWL = !(warningLow && (warningLow.Decimal || warningLow.Path));
				var bWH = !(warningHigh && (warningHigh.Decimal || warningHigh.Path));

				// checking for mandatory data availability based on the Criticality ImprovementDirection
				if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
						&& (bWL)) {
					return false;
				}
				if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize"
						&& (bWH)) {
					return false;
				}
				if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target") {
					return false;
				}
				return true;
			} else
				return false;
		},

		/**
		 * decides the binding path for the Threshold Critical case | it can be an absolute value or the aggregate of a
		 * measure | used in Deviation Tile
		 */
		formatThresholdWarning : function(dataPoint, personalizedThresholds) {
			function format(anno) {
				return anno && (anno.Path ? "parseFloat(${" + anno.Path + "},10)" : parseFloat(anno.Decimal, 10));
			}

			var crit = dataPoint.CriticalityCalculation;
			var oFormatting = dataPoint.ValueFormat;
			var targetValue = dataPoint.TargetValue;

			if (crit && crit.ImprovementDirection && crit.ImprovementDirection.EnumMember) {

				var warningLow = null;
				var warningHigh = null;

				// check if user personalized thresholds are present in case of Personalized Tile
				if (personalizedThresholds
						&& (personalizedThresholds.WL || personalizedThresholds.CL || personalizedThresholds.WH
								|| personalizedThresholds.CH || personalizedThresholds.TA)) {
					warningLow = {
						Decimal : personalizedThresholds.WL
					};
					warningHigh = {
						Decimal : personalizedThresholds.WH
					};
					targetValue = personalizedThresholds.TA;
				} else {
					warningLow = crit.ToleranceRangeLowValue;
					warningHigh = crit.ToleranceRangeHighValue;
				}

				var bWL = !(warningLow && (warningLow.Decimal || warningLow.Path));
				var bWH = !(warningHigh && (warningHigh.Decimal || warningHigh.Path));

				// checking for mandatory data availability based on the Criticality ImprovementDirection
				if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
						&& (bWL)) {
					return 0;
				}
				if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize"
						&& (bWH)) {
					return 0;
				}

				var isPercentageMsr = false;
				// check whether evaluation measure is configured as a percentage measure
				if (oFormatting && oFormatting.ScaleFactor && oFormatting.ScaleFactor.Decimal == "0.01") {
					isPercentageMsr = true;
				}

				// check for Relative To Threshold case | warningLow case
				if (targetValue && targetValue.Path && crit.ToleranceRangeLowValue && crit.ToleranceRangeLowValue.Decimal) {
					warningLow = "(parseFloat(${" + targetValue.Path + "},10) * "
							+ ((parseFloat(crit.ToleranceRangeLowValue.Decimal, 10)) / 100) + ")";
				} else
					warningLow = format(warningLow);

				// check for Relative To Threshold case | warningHigh case
				if (targetValue && targetValue.Path && crit.ToleranceRangeHighValue && crit.ToleranceRangeHighValue.Decimal) {
					warningHigh = "(parseFloat(${" + targetValue.Path + "},10) * "
							+ ((parseFloat(crit.ToleranceRangeHighValue.Decimal, 10)) / 100) + ")";
				} else
					warningHigh = format(warningHigh);

				switch (crit.ImprovementDirection.EnumMember) {
					case "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize" :
						if (isPercentageMsr)
							return "{= " + warningLow + " * 100 }";
						else
							return "{= " + warningLow + "}";
					case "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize" :
						if (isPercentageMsr)
							return "{= " + warningHigh + " * 100 }";
						else
							return "{= " + warningHigh + "}";
					default :
						return 0;
				}
			} else {
				return 0;
			}
		},

		decideDeviationTargetFormatting : function(datap, oFormatting, personalizedThresholds, personalizedFilters, oMeasureUnit, metadata) {

			if (oMeasureUnit && oMeasureUnit.Path) {
				var sBindingPath = "{= ${" + oMeasureUnit.Path + "}.toUpperCase() === 'SEC' ? ";
				var target = null;

				var isPercentageMsr = false;
				// check whether evaluation measure is configured as a percentage measure
				if (oFormatting && oFormatting.ScaleFactor && oFormatting.ScaleFactor.Decimal == "0.01")
					isPercentageMsr = true;

				if (personalizedThresholds
						&& (personalizedThresholds.WL || personalizedThresholds.CL || personalizedThresholds.WH
								|| personalizedThresholds.CH || personalizedThresholds.TA)) {
					if (personalizedThresholds.TA) {
						sBindingPath = sBindingPath + "'"
							+ ssuite.smartbusiness.tiles.lib.Util.prototype.getFormattedTime(personalizedThresholds.TA, 2, false, false, true)
							+ "' : '" + parseFloat(personalizedThresholds.TA) + "' }";
						sBindingPath = sBindingPath + " {= ${" + oMeasureUnit.Path + "}.toUpperCase() === 'SEC' ? ${i18n>"
							+ ssuite.smartbusiness.tiles.lib.Util.prototype.getFormattedTimeUnit(personalizedThresholds.TA)
							+ "} : ''}";
					} else
						return 0;
				} else {
					// if personalized filters are present with no new thresholds then the current thresholds will
					// not be
					// considered
					if (personalizedFilters && !(jQuery.isEmptyObject(personalizedFilters)))
						return 0;
					else {
						if (datap && datap.TargetValue && datap.TargetValue.Decimal) {
							target = ssuite.smartbusiness.tiles.lib.Util.prototype.getFormattedTime(datap.TargetValue.Decimal, 2, false, false, true);

							sBindingPath = sBindingPath + "'" + target + "'";

							target = parseFloat(datap.TargetValue.Decimal);
							sBindingPath = sBindingPath + " : '" + ((isPercentageMsr)? target * 100 : target) + "' }";
							sBindingPath = sBindingPath + " {= ${" + oMeasureUnit.Path + "}.toUpperCase() === 'SEC' ? ${i18n>"
								+ ssuite.smartbusiness.tiles.lib.Util.prototype.getFormattedTimeUnit(datap.TargetValue.Decimal)
								+ "} : ''}";
						} else if (datap && datap.TargetValue && datap.TargetValue.Path) {
							var columns = metadata.dataServices.schema[0].entityType[0].property;
							var unitOfMeasure = {
									Path: ""
							};
							jQuery.each(columns, function(index, oColumn) {
								if (oColumn["sap:aggregation-role"] == "measure" && oColumn["name"] == datap.TargetValue.Path
										&& oColumn["sap:unit"]) {
									unitOfMeasure = oColumn["Org.OData.Measures.V1.Unit"];
									return false;
								}
							});

							return ssuite.smartbusiness.tiles.lib.Util.prototype.decideEvaluationMeasureBindPath(datap.TargetValue,
									oFormatting, null, unitOfMeasure, null, true);
						} else {
							return '';
						}
					}
				}
				return sBindingPath;
			} else
				return ssuite.smartbusiness.tiles.lib.Util.prototype.formatTargetValue(datap, oFormatting, personalizedThresholds, personalizedFilters);
		},

		/**
		 * decides the binding path for the Target Value | it can be an absolute value or the aggregate of a measure | used
		 * in Deviation Tile
		 */
		formatTargetValue : function(datap, oFormatting, personalizedThresholds, personalizedFilters) {

			function format(anno) {
				return anno && (anno.Path ? "parseFloat(${" + anno.Path + "},10)" : parseFloat(anno.Decimal, 10));
			}
			if ((datap && datap.TargetValue) || (personalizedThresholds)) {
				var isPercentageMsr = false;
				// check whether evaluation measure is configured as a percentage measure
				if (oFormatting && oFormatting.ScaleFactor && oFormatting.ScaleFactor.Decimal == "0.01") {
					isPercentageMsr = true;
				}

				var target = null;
				// check if user personalized thresholds are present in case of Personalized Tile
				if (personalizedThresholds
						&& (personalizedThresholds.WL || personalizedThresholds.CL || personalizedThresholds.WH
								|| personalizedThresholds.CH || personalizedThresholds.TA)) {
					if (personalizedThresholds.TA)
						target = format({
							Decimal : personalizedThresholds.TA
						});
					else
						return 0;
				} else {
					// if personalized filters are present with no new thresholds then the current thresholds will
					// not be
					// considered
					if (personalizedFilters && !(jQuery.isEmptyObject(personalizedFilters)))
						return 0;
					target = format(datap.TargetValue);
				}
				if (isPercentageMsr)
					return "{= " + target + " * 100 }";
				else
					return "{= " + target + "}";
			} else {
				return 0;
			}
		},

		formatTrendIndicator : function(value, trend, oFormatting, crit, personalizedFilters) {
			function format(anno) {
				return anno && (anno.Path ? "parseFloat(${" + anno.Path + "},10)" : parseFloat(anno.Decimal, 10));
			}
			if (trend && trend.ReferenceValue) {
				if (personalizedFilters && !(jQuery.isEmptyObject(personalizedFilters)))
					return "None";
				var measureValue = format(value);
				var trendValue = format(trend.ReferenceValue);
				var isPercentageMsr = false;
				// check whether evaluation measure is configured as a percentage measure
				if (oFormatting && oFormatting.ScaleFactor && oFormatting.ScaleFactor.Decimal == "0.01") {
					isPercentageMsr = true;
				}
				switch (crit.ImprovementDirection.EnumMember) {
					case "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize" :
						if (isPercentageMsr) {
							return "{= (" + measureValue + " * 100) > (" + trendValue + " * 100) ? 'Up' : (" + measureValue
									+ " * 100) < (" + trendValue + " * 100) ? 'Down' : 'None' }";
						} else {
							return "{= " + measureValue + " > " + trendValue + " ? 'Up' : " + measureValue + " < " + trendValue
									+ " ? 'Down' : 'None' }";
						}
					case "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize" :
						if (isPercentageMsr) {
							return "{= (" + measureValue + " * 100) < (" + trendValue + " * 100) ? 'Up' : (" + measureValue
									+ " * 100) > (" + trendValue + " * 100) ? 'Down' : 'None' }";
						} else {
							return "{= " + measureValue + " < " + trendValue + " ? 'Up' : " + measureValue + " > " + trendValue
									+ " ? 'Down' : 'None' }";
						}
					default :
						return "None";
				}
			} else {
				return "None";
			}
		},

		formatDimensionPath : function(iContext, meta, entityType, oPath) {
			var r = "";

			jQuery.each(iContext.getSetting("analyticalModels"), function() {
				if (this.metaModel.getProperty("/") === meta) {
					var m = this.analyticalModel;
					jQuery.each(m.getAllQueryResultNames(), function() {
						var q = m.getAllQueryResults()[this];
						if (q.getEntityType().getQName() === entityType.namespace + "." + entityType.name) {
							r = new odata4analytics.QueryResultRequest(q);
							if (q.getParameterization())
								r.setParameterizationRequest(new odata4analytics.ParameterizationRequest(q.getParameterization()));
							return false;
						}
					});
					return false;
				}
			});

			var allDimensions = r.getQueryResult().getAllDimensions();
			var currentDimension = allDimensions[oPath.Path];

			if (currentDimension.getTextProperty() && currentDimension.getTextProperty().name){
				return "{	path : '" + currentDimension.getTextProperty().name + "'}";
			} else {
				if(currentDimension.getKeyProperty().type == "Edm.DateTime"){
					var extendedProperties = currentDimension.getKeyProperty().extensions;
					for (var key in extendedProperties)
						if(extendedProperties[key].name == "display-format" && extendedProperties[key].value == "Date") {
							return "{	path : '" + oPath.Path + "', type: 'sap.ui.model.odata.type.DateTime', constraints:{displayFormat:'Date'}}";
					}
				}else if(currentDimension.getKeyProperty().type == "Edm.DateTimeOffset"){
					 return "{	path : '" + oPath.Path + "', type: 'sap.ui.model.odata.type.DateTimeOffset'}";
				}else if(currentDimension.getKeyProperty().type == "Edm.Time"){
					 return "{	path : '" + oPath.Path + "', type: 'sap.ui.model.odata.type.Time'}";
				}
				return "{	path : '" + oPath.Path + "'}";
			}
		},

		formatMeasurePathWithIntConversion : function(oPath) {
			return "{	path : '" + oPath + "', formatter:'ssuite.smartbusiness.tiles.lib.Util.prototype.convertToNumber'}";
		},

		convertToNumber : function(sValue) {
			if (sValue)
				return parseFloat(sValue, 10);
			else
				return "";
		},

		formatminXValueForTrend : function(datap) {

		},

		/**
		 * handler for data received of the tile | set the loaded state for the tile | if no data is available sets the "no
		 * data available" in the tile
		 */
		onDataLoaded : function(oData, oTile, tileContentPosition) {
			// set loaded state
			if (oData) {
				if (oTile && oTile instanceof sap.suite.ui.commons.GenericTile && oTile.setState) {
					oTile.setState("Loaded");
				}
			}
			// check for no data available
			if (oData && oData && oData.results && oData.results instanceof Array && oData.results.length === 0) {
				if (oTile && oTile instanceof sap.suite.ui.commons.GenericTile) {
					// in case of dual tile tileContentPosition will give info about whether left or right tile is considered
					var position = 0;
					if (tileContentPosition === 1) {
						position = 1;
					}
					var tileContent = oTile.getTileContent() && oTile.getTileContent()[position];
					// hide the tile-specific content
					if (tileContent && tileContent.getContent && tileContent.getContent instanceof Function) {
						var tileSpecificContent = tileContent.getContent();
						if (tileSpecificContent && tileSpecificContent.setVisible
								&& tileSpecificContent.setVisible instanceof Function) {
							tileSpecificContent.setVisible(false);
						}
					}
					// set no data available text
					if (tileContent && tileContent.setFooter && tileContent.setFooter instanceof Function) {
						try {
							var i18nModel = tileContent.getModel("i18n");
							if (i18nModel && i18nModel.getProperty && i18nModel.getProperty instanceof Function) {
								var noDataText = i18nModel.getProperty("NO_DATA_AVAILABLE_KEY");
								if (noDataText != "NO_DATA_AVAILABLE_KEY") {
									tileContent.setFooter(noDataText);
								} else {
									tileContent.setFooter("No data available");
								}
							}
						} catch (exception) {
							tileContent.setFooter("No data available");
						}
					}
				}
			} else {
				if (oTile && oTile instanceof sap.suite.ui.commons.GenericTile) {
					// in case of dual tile tileContentPosition will give info about whether left or right tile is considered
					var position = 0;
					if (tileContentPosition === 1) {
						position = 1;
					}
					var tileContent = oTile.getTileContent() && oTile.getTileContent()[position];
					// make the tile specific content visible
					if (tileContent && tileContent.getContent && tileContent.getContent instanceof Function) {
						var tileSpecificContent = tileContent.getContent();
						if (tileSpecificContent && tileSpecificContent.setVisible
								&& tileSpecificContent.setVisible instanceof Function) {
							tileSpecificContent.setVisible(true);
						}
					}
					// reset the no data available text
					if (tileContent && tileContent.setFooter && tileContent.setFooter instanceof Function)
						tileContent.setFooter("");
				}
			}
		},

		/**
		 * ================================================================================================================
		 * CACHE FOR KPI TILES MODULE
		 * ================================================================================================================
		 * initializes the Loader class once if atleast one KPI chip is enabled for caching | puts the chips in Loader Queue
		 * for analyzing after cached data is loaded from SSB Persistency
		 */
		checkForCachedData : function(oComponent) {
			try {
				jQuery.sap.log.info("Smart Business Tile - checkForCachedData", "chip has asked for cache check");
				// fetch chip details
				var chipDetails = ssuite.smartbusiness.tiles.lib.Util.prototype.getCdmTileConfig(oComponent).tileProperties || {};
				// loader class will be initialized if atleast one chip in the launchpad is enabled for caching
				if (chipDetails && chipDetails.instanceId && chipDetails.cacheMaxAge && chipDetails.cacheMaxAge > 0) {
					jQuery.sap.log.info("Smart Business Tile - checkForCachedData", "tile " + (chipDetails && chipDetails.instanceId)
							+ " is enabled for caching");
					if (!ssuite.smartbusiness.tiles.lib.Util.Loader) {
						jQuery.sap.log.info("Smart Business Tile - checkForCachedData", "tile "
								+ (chipDetails && chipDetails.instanceId) + " is instantiating the Loader");
						ssuite.smartbusiness.tiles.lib.Util.Loader = {
							loaderInitializeComp : oComponent,
							chipsQueue : {},
							consideredTiles : {}
						};
						ssuite.smartbusiness.tiles.lib.Util.prototype.putCurrentChipInLoaderQueue(chipDetails, oComponent, false,
								false);
						ssuite.smartbusiness.tiles.lib.Util.prototype.determineKPITiles(oComponent);
					} else {
						jQuery.sap.log.info("Smart Business Tile - checkForCachedData", "chip "
								+ (chipDetails && chipDetails.instanceId) + " is trying to register itself in Loader Queue");
						ssuite.smartbusiness.tiles.lib.Util.prototype.checkCacheStatusAndPushToQueue(chipDetails, oComponent);
					}
				} else {
					jQuery.sap.log.info("Smart Business Tile - checkForCachedData", "chip " + (chipDetails && chipDetails.instanceId)
							+ " is not enabled for caching");
					oComponent._localData.bNoCachingEnabled = true;
					oComponent._initializeContent();
				}
			} catch (exception) {
				jQuery.sap.log.error("Smart Business Tile - checkForCachedData", "exception happened - "
						+ (exception && exception.message));
				jQuery.sap.log.info("Smart Business Tile - checkForCachedData", "normal load of chip will happen");
				oComponent._localData.bNoCachingEnabled = true;
				oComponent._initializeContent();
			}
		},

		/**
		 * fetches the chip details - chipId, cacheMaxAge, cacheMaxAgeUnit and systemAlias configured | systemAlias "" means
		 * no sap-system alias is configured
		 */
		fetchChipDetails : function(tileConfigString) {
			try {
				jQuery.sap.log.info("Smart Business Tile - fetchChipDetails", "chip details fetch has started");
				var chipDetails = {
					systemAlias : ""
				};
				var tileConfigObject = JSON.parse(tileConfigString);
				var tileProperties = JSON.parse(tileConfigObject.TILE_PROPERTIES);
				chipDetails.chipId = tileProperties.instanceId;
				chipDetails.cacheMaxAge = tileProperties.cacheMaxAge;
				chipDetails.cacheMaxAgeUnit = tileProperties.cacheMaxAgeUnit;
				var additionalParams = JSON.parse(tileConfigObject.ADDITIONAL_APP_PARAMETERS);
				if (additionalParams && additionalParams instanceof Object) {
					jQuery.each(additionalParams, jQuery.proxy(function(sProperty, sValue) {
						if (sProperty === "sap-system") {
							chipDetails.systemAlias = sValue;
							return false;
						}
					}, this));
				}
				jQuery.sap.log.info("Smart Business Tile - fetchChipDetails", "chip Details : " + chipDetails
						&& chipDetails.chipId);
				return chipDetails;
			} catch (exception) {
				jQuery.sap.log.error("Smart Business Tile - fetchChipDetails", "exception happened - "
						+ (exception && exception.message));
				throw exception;
			}
		},

		/**
		 * puts the KPI chips in Loader's Chips Queue which will be processed by the Loader once the cache data per
		 * sap-system is loaded
		 */
		putCurrentChipInLoaderQueue : function(chipDetails, oComponent, bSystemIndividualLoad, bChipIndividualLoad) {
			try {
				var oLoader = ssuite.smartbusiness.tiles.lib.Util.Loader;
				if (!oLoader.chipsQueue[chipDetails.systemAlias]) {
					oLoader.chipsQueue[chipDetails.systemAlias] = {
						bInidividualLoad : bSystemIndividualLoad,
						chips : {}
					};
				}
				oLoader.chipsQueue[chipDetails.systemAlias].chips[chipDetails.chipId] = {
					bInidividualLoad : bSystemIndividualLoad,
					bCacheAnalyzeDone : false,
					cacheAvailable : false,
					oComponent : oComponent
				};
			} catch (exception) {
				jQuery.sap.log.error("Smart Business Tile - putCurrentChipInLoaderQueue", "exception happened - "
						+ (exception && exception.message));
				throw exception;
			}
		},

		/**
		 * pushes the chips in loader's consideredTiles queue with flag indicating whether the chips is part of one time
		 * initial cache load or individual cache load
		 */
		putCurrentChipInLoaderConsiderTilesQueue : function(chipDetails, bSystemIndividualLoad, bChipIndividualLoad) {
			try {
				var oLoader = ssuite.smartbusiness.tiles.lib.Util.Loader;
				if (!oLoader.consideredTiles[chipDetails.systemAlias]) {
					oLoader.consideredTiles[chipDetails.systemAlias] = {
						oneTimeLoadStatus : 1,
						chips : {},
						cachedData : [],
						bInidividualLoad : bSystemIndividualLoad
					};
				}
				oLoader.consideredTiles[chipDetails.systemAlias].chips[chipDetails.chipId] = {
					bInidividualLoad : bChipIndividualLoad,
					bcacheLoadTriggered : false
				};
			} catch (exception) {
				jQuery.sap.log.error("Smart Business Tile - putCurrentChipInLoaderConsiderTilesQueue", "exception happened - "
						+ (exception && exception.message));
				throw exception;
			}
		},

		/**
		 * using ushell API's determines the KPI tiles loaded in the launchpad | adds them in the Loader's consideredTiles
		 * queue for checking if the chips has valid data in SSB Cache Persistence
		 */
		determineKPITiles : function(oComponent) {
			// Deactivate caching for CDM POC
			var oLoader = ssuite.smartbusiness.tiles.lib.Util.Loader;
			var oComponent = oLoader.loaderInitializeComp;
			oComponent._localData.bNoCachingEnabled = true;
			oComponent._initializeContent();
//			try {
//				var launchPage = sap.ushell.Container.getService("LaunchPage");
//				launchPage.getGroups().done(function(oGroups) {
//					try {
//						var validSSBTiles = [];
//						// TODO, dirt
//						validSSBTiles.push("X-SAP-UI2-CHIP:SSB_NUMERIC");
//						validSSBTiles.push("X-SAP-UI2-CHIP:SSB_DEVIATION");
//						validSSBTiles.push("X-SAP-UI2-CHIP:SSB_CONTRIBUTION");
//						validSSBTiles.push("X-SAP-UI2-CHIP:SSB_COMPARISON");
//						validSSBTiles.push("X-SAP-UI2-CHIP:SSB_TREND");
//						validSSBTiles.push("X-SAP-UI2-CHIP:SSB_DUAL");
//						if (oGroups && oGroups instanceof Array && oGroups.length) {
//							jQuery.each(oGroups, function(index, oGroup) {
//								var oChipInstances = oGroup.getChipInstances();
//								if (oChipInstances && oChipInstances instanceof Array && oChipInstances.length) {
//									jQuery.each(oChipInstances, function(index, oChipInstance) {
//										var baseChip = oChipInstance.getChip();
//										var baseChipId = baseChip.getBaseChipId();
//										// handle for all chip types
//										if (validSSBTiles.indexOf(baseChipId) >= 0) {
//											var tileConfigString = oChipInstance.getConfigurationParameter("tileConfiguration");
//											var oUtil = ssuite.smartbusiness.tiles.lib.Util;
//											var chipDetails = oUtil.prototype.fetchChipDetails(tileConfigString);
//											// the chip will be considered by the Loader only if Caching is enabled
//											if (chipDetails && chipDetails.chipId && chipDetails.cacheMaxAge && chipDetails.cacheMaxAge > 0) {
//												var oUtil = ssuite.smartbusiness.tiles.lib.Util;
//												oUtil.prototype.putCurrentChipInLoaderConsiderTilesQueue(chipDetails, false, false);
//											}
//										}
//									});
//								}
//							});
//						}
//						ssuite.smartbusiness.tiles.lib.Util.prototype.triggerKPICacheLoad();
//					} catch (exception) {
//						jQuery.sap.log.error("Smart Business Tile - determineKPITiles", "exception - " + exception.message);
//						jQuery.sap.log.info("Smart Business Tile - determineKPITiles", "normal load of chip will happen");
//						var oLoader = ssuite.smartbusiness.tiles.lib.Util.Loader;
//						var oComponent = oLoader.loaderInitializeComp;
//						oComponent._localData.bNoCachingEnabled = true;
//						oComponent._initializeContent();
//					}
//				}).fail(function() {
//					jQuery.sap.log.error("Smart Business Tile - determineKPITiles", "load groups failed");
//					jQuery.sap.log.info("Smart Business Tile - determineKPITiles", "normal load of chip will happen");
//					var oLoader = ssuite.smartbusiness.tiles.lib.Util.Loader;
//					var oComponent = oLoader.loaderInitializeComp;
//					oComponent._localData.bNoCachingEnabled = true;
//					oComponent._initializeContent();
//				});
//			} catch (exception) {
//				jQuery.sap.log.error("Smart Business Tile - determineKPITiles", "exception happened - "
//						+ (exception && exception.message));
//				throw exception;
//			}
		},

		/**
		 * except for first KPI tile which instantiates the Loader all other tiles checkForCache should go through this
		 * process | it checks whether the kpi chip is part of the initial one time load determined by loader's
		 * consideredTiles. if so it is pushed to the queue or checked against the already loaded cached data for this chip |
		 * if it is not in loader's consideredTiles a separate request is made for fetching the cache for this tile
		 */
		checkCacheStatusAndPushToQueue : function(chipDetails, oComponent) {
			// checks whether the current chip needs to be put in the Loader queue
			// 1. determine sap-system alias for chip and check whether loader has created a chips Queue for the same
			var oLoader = ssuite.smartbusiness.tiles.lib.Util.Loader;
			if (!oLoader.consideredTiles[chipDetails.systemAlias]) {
				// one time cache load did not consider this tile and sap-system alias - tile is added from tile catalog later -
				// trigger cache load separately for this tile
				jQuery.sap.log.info("Smart Business Tile - checkCacheStatusAndPushToQueue", "neither chip "
						+ (chipDetails && chipDetails.chipId) + " nor sap-system " + chipDetails.systemAlias
						+ " considered in one time load. Triggering cache load separately");
				ssuite.smartbusiness.tiles.lib.Util.prototype.triggerCacheLoadForSingleChip(chipDetails, oComponent);
				return;
			}
			// 2. check whether tile is considered by loader in the given sap-system alias
			jQuery.sap.log.info("Smart Business Tile - checkCacheStatusAndPushToQueue", "sap-system "
					+ chipDetails.systemAlias + " considered in one time load");
			var consideredTiles = oLoader.consideredTiles[chipDetails.systemAlias];
			if (consideredTiles && consideredTiles.chips && consideredTiles.chips[chipDetails.chipId]) {
				// this tile was considered by loader for the given sap-system alias
				jQuery.sap.log.info("Smart Business Tile - checkCacheStatusAndPushToQueue", "chip "
						+ (chipDetails && chipDetails.chipId) + " was considered in one time load");
				if (consideredTiles.oneTimeLoadStatus === 1) {
					// cache load is in progress so push it to the loaders' chips queue
					jQuery.sap.log.info("Smart Business Tile - checkCacheStatusAndPushToQueue", "cache load for system-alias "
							+ chipDetails.systemAlias + " is in progress. so adding chip " + (chipDetails && chipDetails.chipId)
							+ " to loader's chip Queue");
					ssuite.smartbusiness.tiles.lib.Util.prototype.putCurrentChipInLoaderQueue(chipDetails, oComponent, false,
							false);
					return;
				} else if (consideredTiles.oneTimeLoadStatus === 2) {
					// cache has been loaded previously for the tile, but a fresh load is triggered for correct cache data age
					// If cached data of the chip already exists, removing it from oLoader
					var alreadyExistingData = oLoader.consideredTiles[chipDetails.systemAlias].cachedData;
					if (alreadyExistingData && alreadyExistingData instanceof Array && alreadyExistingData.length) {
						var indexToBeRemoved = -1;
						jQuery.each(alreadyExistingData, function(index, cachedObject) {
							if (cachedObject.ChipId == chipDetails.chipId) {
								indexToBeRemoved = index;
								return;
							}
						});
						if (indexToBeRemoved > -1)
							alreadyExistingData.splice(indexToBeRemoved, 1);
					}
					// NOTE migration to CDM done without testing!
					var currentChip = oLoader.chipsQueue[chipDetails.systemAlias].chips[chipDetails.chipId];
					var currentChipLocalData = currentChip.oComponent._localData;
					// Clearing schedulers set for the same chip previously
					if (currentChipLocalData.delayedCallMethodIdentifier)
						jQuery.sap.clearDelayedCall(currentChipLocalData.delayedCallMethodIdentifier);
					if (currentChipLocalData.delayedUpdateCacheIdentifier)
						jQuery.sap.clearDelayedCall(currentChipLocalData.delayedUpdateCacheIdentifier);
					// Removing the chip details that were previously stored
					delete consideredTiles.chips[chipDetails.chipId];
					jQuery.sap.log.info("Smart Business Tile - checkCacheStatusAndPushToQueue", "chip "
							+ (chipDetails && chipDetails.chipId) + " was already considered in one time load of sap-system "
							+ chipDetails.systemAlias + ". Cached data age maybe old, triggering cache load separately again"
							+ "for tile.");
					ssuite.smartbusiness.tiles.lib.Util.prototype.triggerCacheLoadForSingleChip(chipDetails, oComponent);
					return;
				} else {
					// cache load has failed - trigger cache load separately for this tile
					jQuery.sap.log.info("Smart Business Tile - checkCacheStatusAndPushToQueue", "cache load for system-alias "
							+ chipDetails.systemAlias + " has failed . Triggering cache load separately for chip "
							+ (chipDetails && chipDetails.chipId));
					ssuite.smartbusiness.tiles.lib.Util.prototype.triggerCacheLoadForSingleChip(chipDetails, oComponent);
					return;
				}
			} else {
				// one time cache load did not consider this tile though it loaded the cache for the given sap-system alias for
				// other tiles - tile is added from tile catalog later - trigger cache load separately for this tile
				jQuery.sap.log.info("Smart Business Tile - checkCacheStatusAndPushToQueue", "chip "
						+ (chipDetails && chipDetails.chipId) + " was not considered in one time load. sap-system "
						+ chipDetails.systemAlias + " was considered without this chip. Triggering cache load separately");
				ssuite.smartbusiness.tiles.lib.Util.prototype.triggerCacheLoadForSingleChip(chipDetails, oComponent);
				return;
			}
		},

		/**
		 * triggers the cache load for a single chip if it was not part of the initial one load Cache load by the Loader
		 */
		triggerCacheLoadForSingleChip : function(chipDetails, oComponent) {
			var oUtil = ssuite.smartbusiness.tiles.lib.Util;
			oUtil.prototype.putCurrentChipInLoaderQueue(chipDetails, oComponent, true, true);
			oUtil.prototype.putCurrentChipInLoaderConsiderTilesQueue(chipDetails, true, true);
			oUtil.prototype.triggerKPICacheLoad();
		},

		/**
		 * once the KPI chips which are enabled for caching is determined the request to fetch the cache from SSB
		 * Persistence per sap-system alias is triggered | Loader's consideredTiles is the source
		 */
		triggerKPICacheLoad : function() {
			var launchpadTiles = ssuite.smartbusiness.tiles.lib.Util.Loader.consideredTiles;
			jQuery.each(launchpadTiles, function(system, oSystemData) {
				var filterString = "";
				if (oSystemData && oSystemData.chips) {
					jQuery.each(oSystemData.chips, function(sChipId, oChipData) {
						if (oChipData.bcacheLoadTriggered == false) {
							oChipData.bcacheLoadTriggered = true;
							if (filterString)
								filterString = filterString + " or ";
							filterString = filterString + "ChipId eq '" + sChipId + "'";
						}
					});
					if (filterString) {
						var url = "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV";
						if (system !== "")
							url = url + ";o=" + system;
						url = url + "/CacheParameters(P_CacheType=2)/Results?$filter=" + filterString;
						// loads the kpi cahced data from SSB cache tables asynchronously
						var cacheDataModel = new sap.ui.model.json.JSONModel();
						cacheDataModel.attachRequestCompleted(jQuery.proxy(function(oCachedData) {
							var oLoader = ssuite.smartbusiness.tiles.lib.Util.Loader;
							var currentSystem = this.currentSystem;
							ssuite.smartbusiness.tiles.lib.Util.prototype.maintainCacheLoadStatus(currentSystem, 2);
							ssuite.smartbusiness.tiles.lib.Util.prototype.formatCachedDataFromServer(currentSystem, oCachedData);
							ssuite.smartbusiness.tiles.lib.Util.prototype.analyzeKPICacheData(oLoader.chipsQueue[currentSystem],
									currentSystem);
						}, {
							currentSystem : system
						}));
						cacheDataModel.attachRequestFailed(jQuery.proxy(function(e) {
							var oLoader = ssuite.smartbusiness.tiles.lib.Util.Loader;
							var currentSystem = this.currentSystem;
							ssuite.smartbusiness.tiles.Util.prototype.maintainCacheLoadStatus(currentSystem, 3);
							ssuite.smartbusiness.tiles.Util.prototype.loadKPITilesWithNoCache(oLoader.chipsQueue[currentSystem]);
						}, {
							currentSystem : system
						}));
						cacheDataModel.loadData(url, null, true, "GET");
					}
				} else {
					// no chips found in given sap-system alias - mark the oneTimeloadStatus for this system as failed
					ssuite.smartbusiness.tiles.Util.prototype.maintainCacheLoadStatus(system, 3);
				}
			});
		},

		/**
		 * maintains the status for cache load per sap-system alias | status 2 - Successfully loaded | status 3 - Load
		 * failed
		 */
		maintainCacheLoadStatus : function(currentSystem, status) {
			// maintain the status of the oneTimeLoadStatus for the considered Tiles - for individual tile cache load
			// this flag won't be affected
			var oLoader = ssuite.smartbusiness.tiles.lib.Util.Loader;
			if (oLoader.consideredTiles[currentSystem].oneTimeLoadStatus == 1) {
				oLoader.consideredTiles[currentSystem].oneTimeLoadStatus = status;
			}
		},

		/**
		 * fetches the data from the json model and stores it in the Loader's consideredTiles storage | if the cache request
		 * is triggered for an individual tile the result will be merged with already existing results of the same system
		 */
		formatCachedDataFromServer : function(currentSystem, oCachedData) {
			var oLoader = ssuite.smartbusiness.tiles.lib.Util.Loader;
			var currentCacheData = oCachedData && oCachedData.getSource && oCachedData.getSource()
					&& oCachedData.getSource().getData && oCachedData.getSource().getData().d
					&& oCachedData.getSource().getData().d.results;
			var alreadyExistingData = oLoader.consideredTiles[currentSystem].cachedData;
			var mergedData = [];
			if (alreadyExistingData && alreadyExistingData instanceof Array && alreadyExistingData.length) {
				if (currentCacheData && currentCacheData instanceof Array && currentCacheData.length) {
					jQuery.each(alreadyExistingData, function(index, cachedObject) {
						var matchFound = 0;
						jQuery.each(currentCacheData, function(i, currentCacheObject) {
							if (cachedObject.ChipId == currentCacheObject.ChipId)
								matchFound++;
						});
						if (!matchFound)
							mergedData.push(cachedObject);
					});
					mergedData = mergedData.concat(currentCacheData);
					oLoader.consideredTiles[currentSystem].cachedData = mergedData;
				}
			} else
				oLoader.consideredTiles[currentSystem].cachedData = currentCacheData;
		},

		/**
		 * triggers the cache load for a single chip if it was not part of the initial one load Cache load by the Loader
		 */
		analyzeCacheForSingleChip : function(chipDetails, oComponent) {
			try {
				var oLoader = ssuite.smartbusiness.tiles.lib.Util.Loader;
				var consideredTiles = oLoader.consideredTiles[chipDetails.systemAlias];
				ssuite.smartbusiness.tiles.lib.Util.prototype.putCurrentChipInLoaderQueue(chipDetails, oComponent, true, true);
				ssuite.smartbusiness.tiles.lib.Util.prototype.analyzeKPICacheData(oLoader.chipsQueue[chipDetails.systemAlias],
						chipDetails.systemAlias);
			} catch (exception) {
				jQuery.sap.log.error("Smart Business Tile - analyzeCacheForSingleChip", "exception happened - "
						+ (exception && exception.message));
				jQuery.sap.log.info("Smart Business Tile - analyzeCacheForSingleChip", "normal load of chip will happen");
				oComponent._localData.noCache = true;
				oComponent._initializeContent();
			}
		},

		/**
		 * analyzes the Cached data fetched from the SSB Persistence against each chip in Loader's chipsQueue for the given
		 * sap-system alias
		 */
		analyzeKPICacheData : function(oKPITileInstances, currentSystem) {
			// NOTE method migration to CDM done without testing!
			var oLoader = ssuite.smartbusiness.tiles.lib.Util.Loader;
			var oCachedData = oLoader.consideredTiles[currentSystem].cachedData;
			if (oCachedData && oCachedData instanceof Array && oCachedData.length) {
				jQuery.each(oCachedData, function(index, oData) {
					var cachedChipId = oData.ChipId;
					if (oKPITileInstances && oKPITileInstances.chips && oKPITileInstances.chips[cachedChipId]) {
						var oChip = oKPITileInstances.chips[cachedChipId];
						if (oChip.bCacheAnalyzeDone == false && oData.Iscacheinvalid == 0) {
							oChip.bCacheAnalyzeDone = true;
							oChip.cacheAvailable = true;
							oChip.oComponent.setCachedData(oData);
						}
					}
				});
			}
			ssuite.smartbusiness.tiles.lib.Util.prototype.loadKPITilesWithNoCache(oKPITileInstances);
		},

		/**
		 * for KPI tiles which does not have their aggregated cached in SSB cache a fresh data load is triggered
		 */
		loadKPITilesWithNoCache : function(oKPITileInstances) {
			// NOTE method migration to CDM done without testing!
			// check for KPI tiles for which cached data is not available
			if (oKPITileInstances && oKPITileInstances.chips) {
				jQuery.each(oKPITileInstances.chips, function(sChipId, oChip) {
					if (!oChip.cacheAvailable && oChip.bCacheAnalyzeDone == false) {
						oChip.bCacheAnalyzeDone = true;
						oChip.oComponent._localData.noCache = true;
						oChip.oComponent._initializeContent();
					}
				});
			}
		},

		/**
		 * ================================================================================================================
		 * CACHE TILE DATA IN SSB PERSISTENCE MODULE
		 * ================================================================================================================
		 */
		checkForCachingEnabled : function(oComponent) {
			var bCachingEnabled = true;
			if (oComponent && oComponent._localData && oComponent._localData.bNoCachingEnabled) {
				bCachingEnabled = false;
			}
			return bCachingEnabled;
		},

		/**
		 * extracts the data in the format that needs to be stored in SSB Tile cache | for trend tile (flag bFromTrendTile)
		 * only top 3 records are stored in SSB Cache
		 */
		extractDataInCacheFormat : function(kpiData, bFromTrendTile) {
			var oData = [];
			jQuery.each(kpiData, function(index) {
				// For trend tile limit the number of cached data sets to 3
				if (bFromTrendTile && index > 2)
					return false;
				oData.push({});
				jQuery.each(kpiData[index], function(data) {
					if (data.indexOf("metadata") == -1)
						oData[index][data] = kpiData[index][data];
				});
			});
			return oData;
		},

		/**
		 * Analyzes whether the tile is configured for caching data and proceeds for caching data | oEvent binding
		 * dataReceived oEvent contains the data received | oControl available in the view from which the component instance
		 * can be fetched | flag indicating the process is triggered for trend tile
		 */
		checkAndStoreCache : function(oEvent, oControl, bFromTrendTile) {
			var oComponent = oControl.getModel("component");
			var bCachingEnabled = ssuite.smartbusiness.tiles.lib.Util.prototype.checkForCachingEnabled(oComponent);
			if (bCachingEnabled) {
				// Since actual data was just received from the backend and is being written into cache tables, cache age is
				// maintained as 0 at this point before calling the scheduler for updating data age.
				oComponent._localData.cacheAge = 0;
				oComponent._localData.updateSecondsForScheduler = 0;
				if (oComponent._localData.delayedCallMethodIdentifier) {
					jQuery.sap.clearDelayedCall(oComponent._localData.delayedCallMethodIdentifier);
					oComponent._localData.delayedCallMethodIdentifier = null;
				}
				oComponent.analyzeAndUpdateTime();
				if (bFromTrendTile)
					var kpiData = oEvent;
				else
					var kpiData = oEvent.getParameter("data");
				kpiData = kpiData && kpiData.results;
				if (kpiData) {
					var oData = ssuite.smartbusiness.tiles.lib.Util.prototype.extractDataInCacheFormat(kpiData, bFromTrendTile);
					var chipData = oComponent.getComponentData().chip;
					var systemAlias = oComponent && oComponent._localData && oComponent._localData.systemAlias;
					ssuite.smartbusiness.tiles.lib.Util.prototype
							.prepareKPICachePayload(oData, chipData, systemAlias, oComponent);
				}
			}
		},

		/**
		 * Analyzes whether the tile is configured for caching data and proceeds for caching data for a dual tile | two data
		 * requests happens in case of dual tile | so cache will be written only when both the tiles in a Dual tile has
		 * loaded its data
		 */
		checkAndStoreCacheForDualTile : function(oEvent, oControl, bFromTrendTile) {
			var oComponent = oControl.getModel("component");
			var bCachingEnabled = ssuite.smartbusiness.tiles.lib.Util.prototype.checkForCachingEnabled(oComponent);
			if (bCachingEnabled) {
				// Since actual data was just received from the backend and is being written into cache tables, cache age is
				// maintained as 0 at this point before calling the scheduler for updating data age.
				oComponent._localData.cacheAge = 0;
				oComponent._localData.updateSecondsForScheduler = 0;
				if (oComponent._localData.delayedCallMethodIdentifier) {
					jQuery.sap.clearDelayedCall(oComponent._localData.delayedCallMethodIdentifier);
					oComponent._localData.delayedCallMethodIdentifier = null;
				}
				oComponent.analyzeAndUpdateTime();
				// check what is the position of the current tile
				var tilePosition = "left";
				var tileType = "NT";
				if (oControl && oControl.data && oControl.data instanceof Function) {
					var currentTilePos = oControl.data("tilePosition");
					if (currentTilePos == "1")
						tilePosition = "right";
					var currentTileType = oControl.data("tileType");
					if (currentTileType != "NT")
						tileType = currentTileType;
				}
				// store the data of this tile in component's localData
				var kpiData = null;
				if (bFromTrendTile) {
					kpiData = oEvent;
				} else {
					kpiData = oEvent.getParameter("data");
				}
				kpiData = kpiData && kpiData.results;
				if (kpiData) {
					if (!oComponent._localData.dualLocalCacheStore)
						oComponent._localData.dualLocalCacheStore = {};
					oComponent._localData.dualLocalCacheStore[tilePosition] = {
						tileType : tileType,
						data : ssuite.smartbusiness.tiles.lib.Util.prototype.extractDataInCacheFormat(kpiData, bFromTrendTile)
					};
					// check if the other tile has loaded its data and trigger kpi cache storage
					var toCheck = "right";
					if (tilePosition == "right")
						toCheck = "left";
					if (oComponent._localData.dualLocalCacheStore && oComponent._localData.dualLocalCacheStore[toCheck]
							&& oComponent._localData.dualLocalCacheStore[toCheck].tileType
							&& oComponent._localData.dualLocalCacheStore[toCheck].data) {
						var chipData = oComponent.getComponentData().chip;
						var systemAlias = oComponent && oComponent._localData && oComponent._localData.systemAlias;
						ssuite.smartbusiness.tiles.lib.Util.prototype.prepareKPICachePayload(
								oComponent._localData.dualLocalCacheStore, chipData, systemAlias, oComponent);
					}
				}
			}
		},

		/**
		 * fetches the kpi data to be cahced in SSB Cache
		 */
		prepareKPICachePayload : function(oKPIData, oChip, systemAlias, oComponent) {
			// NOTE method migration to CDM done without testing!
			var tileProperties = ssuite.smartbusiness.tiles.lib.Util.prototype.getCdmTileConfig(oComponent)
					.tileProperties || {};
			var evaluationId = tileProperties.evaluationId;
			var chipId = tileProperties.instanceId;
			var payload = {
				ChipId : chipId,
				EvaluationId : evaluationId,
				Data : JSON.stringify(oKPIData),
				CacheMaxAge : tileProperties.cacheMaxAge,
				CacheMaxAgeUnit : tileProperties.cacheMaxAgeUnit,
				CacheType : 2
			};
			ssuite.smartbusiness.tiles.lib.Util.prototype.persistKPIDataInSSBCache(payload, systemAlias, oComponent);
		},

		/**
		 * initializes oDataModel for persisting the kpi cache data | systemAlias is considered here | cache for tiles
		 * created for a particular systemAlias will be stored in that particular system
		 */
		persistKPIDataInSSBCache : function(oPayload, systemAlias, oComponent) {
			if (!systemAlias)
				systemAlias = "";
			if (!ssuite.smartbusiness.tiles.lib.Util.cacheServiceModel
					|| !ssuite.smartbusiness.tiles.lib.Util.cacheServiceModel[systemAlias]) {
				var url = "/sap/opu/odata/SSB/SMART_BUSINESS_RUNTIME_SRV";
				if (systemAlias)
					url = url + ";o=" + systemAlias;
				var oDataModel = new sap.ui.model.odata.ODataModel(url, {
					loadMetadataAsync : true
				});
				// handler for metadata successfully loaded
				oDataModel.attachMetadataLoaded(jQuery.proxy(function(oEvent) {
					var currentSystem = this.currentSystem;
					if (!ssuite.smartbusiness.tiles.lib.Util.cacheServiceModel)
						ssuite.smartbusiness.tiles.lib.Util.cacheServiceModel = {};
					ssuite.smartbusiness.tiles.lib.Util.cacheServiceModel[currentSystem] = oEvent.getSource();
					ssuite.smartbusiness.tiles.lib.Util.prototype.sendCreateRequest(oPayload, currentSystem, oComponent);
				}, {
					currentSystem : systemAlias
				}));
			} else
				ssuite.smartbusiness.tiles.lib.Util.prototype.sendCreateRequest(oPayload, systemAlias, oComponent);
		},

		/**
		 * sends the POST request to persist the loaded kpi data in the SSB Cache
		 */
		sendCreateRequest : function(oPayload, currentSystem, oComponent) {
			var oDataModel = ssuite.smartbusiness.tiles.lib.Util.cacheServiceModel[currentSystem];
			oDataModel.create("CacheData", oPayload, {
				async : true,
				success : jQuery.proxy(function(oData, response) {
					this.cacheDataInServerSuccess(oData, response, oComponent);
				}, this),
				error : jQuery.proxy(function(oError) {
					this.cacheDataInServerFailure(oError, oComponent);
				}, this)
			});
		},

		/**
		 * Initializes the schedulers for updating the cached data when cache gets invalidated.
		 */
		cacheDataInServerSuccess : function(oData, response, oComponent) {
			oComponent._localData.cacheMaxAge = parseInt(oData.CacheMaxAge);
			oComponent._localData.cacheMaxAgeUnit = oData.CacheMaxAgeUnit;
			// If a scheduler had already been set for the tile, it is removed before setting the new scheduler
			if (oComponent._localData.delayedUpdateCacheIdentifier) {
				jQuery.sap.clearDelayedCall(oComponent._localData.delayedUpdateCacheIdentifier);
				oComponent._localData.delayedUpdateCacheIdentifier = null;
			}
			oComponent.initializeAutoCacheUpdateScheduler();
		},

		cacheDataInServerFailure : function(oError, oComponent) {
			jQuery.sap.log.error("sendCreateRequest", "Caching of data in server failed- " + oError.message);
		},

		/**
		 * Returns measure value with time formatting, example: 4000 will become 1 h(if bUnitType is true)  or 1(if bUnitType is false)
		 * bFullFormat - gives complete value
		 */
	getFormattedTime : function(oValue, decimalPrcs, bUnitType, bFullFormat, oResourceBundle) {
		var dateTimeValue, sDays, sDay, sHours, sMinutes, sSeconds;
		if (oResourceBundle) {
			sDays = (bFullFormat || bUnitType == true)? (' ' + oResourceBundle.getProperty('TIME_DAYS') + ' ') : '';
			sDay = (bFullFormat || bUnitType == true)? (' ' + oResourceBundle.getProperty('TIME_DAY') + ' ') : '';
			sHours = (bFullFormat || bUnitType == true)? (' ' + oResourceBundle.getProperty('TIME_HR') + ' ') : '';
			sMinutes = (bFullFormat || bUnitType == true)? (' ' + oResourceBundle.getProperty('TIME_MIN') + ' ') : '';
			sSeconds = (bFullFormat || bUnitType == true)? (' ' + oResourceBundle.getProperty('TIME_SEC') + ' ') : '';
		} else
			return "";
		if (oValue) {
			var oSettings = {
				maxFractionDigits : decimalPrcs,
				style : "standard",
				groupingEnabled : true
			};
			var oFormatter = sap.ui.core.format.NumberFormat.getFloatInstance(oSettings);

			if (bFullFormat) {
				if (parseInt(oValue / 86400) > 0) {
					dateTimeValue = parseInt(oValue / 86400) > 1 ?
							oFormatter.format(parseInt(oValue / 86400)).replace(/(.*?)[^+-.,\d]*$/g, "$1").trim() + sDays
							: oFormatter.format(parseInt(oValue / 86400)).replace(/(.*?)[^+-.,\d]*$/g, "$1").trim()	+ sDay;
					if (oValue % 86400 != 0) {
						// check for hours
						if (parseInt((oValue % 86400) / 3600) > 0) {
							dateTimeValue = dateTimeValue + parseInt((oValue % 86400) / 3600) + sHours;
							if (parseInt((oValue % 86400) % 3600) != 0) {
								// check for mins
								if (parseInt(((oValue % 86400) % 3600) / 60) > 0) {
									dateTimeValue = dateTimeValue + parseInt(((oValue % 86400) % 3600) / 60) + sMinutes;
									if (((oValue % 86400) % 3600) % 60 != 0)
										dateTimeValue = dateTimeValue + oFormatter.format(((oValue % 86400) % 3600) % 60) + sSeconds;
								} else
									dateTimeValue = dateTimeValue + oFormatter.format((oValue % 86400) % 3600) + sSeconds;
							}
						} else if (parseInt((oValue % 86400) / 60) > 0) {	// mins
							dateTimeValue = dateTimeValue + parseInt((oValue % 86400) / 60) + sMinutes;
							if ((oValue % 86400) % 60 != 0)
								dateTimeValue = dateTimeValue + oFormatter.format((oValue % 86400) % 60) + sSeconds;
						}
					}
				} else if (parseInt(oValue / 3600) > 0) {	// hours
					dateTimeValue = parseInt(oValue / 3600) + sHours;
					if (oValue % 3600 != 0) {
						if (parseInt((oValue % 3600) / 60) > 0) {
							dateTimeValue = dateTimeValue + parseInt((oValue % 3600) / 60) + sMinutes;
							if ((oValue % 3600) % 60 != 0)
								dateTimeValue = dateTimeValue + oFormatter.format((oValue % 3600) % 60) + sSeconds;
						}
					}
				} else if (parseInt(oValue / 60) > 0) {		// minutes
					dateTimeValue = parseInt(oValue / 60) + sMinutes;
					if (oValue % 60 != 0)
						dateTimeValue = dateTimeValue + oFormatter.format(oValue % 60) + sSeconds;
				} else
					dateTimeValue = oFormatter.format(oValue) + sSeconds;
				return dateTimeValue;
			} else {
				dateTimeValue = parseInt(oValue / 86400) ? (parseInt(oValue / 86400) > 1 ? oFormatter.format(parseInt(oValue / 86400)) + sDays : oFormatter.format(parseInt(oValue / 86400)) + sDay) :
					parseInt(oValue / 3600) ? oFormatter.format(parseInt(oValue / 3600)) + sHours :
						parseInt(oValue / 60) ? oFormatter.format(parseInt(oValue / 60)) + sMinutes : oFormatter.format(oValue) + sSeconds;
			}
			return dateTimeValue;
		}
		return "";
	},

		/**
		 * Used in Deviation Tile case for thresholds
		 */
		getFormattedTimeUnit : function(oValue) {
			var dateTimeUnit;
			if (oValue) {
				dateTimeUnit = parseInt(oValue / 86400) ? ( parseInt(oValue / 86400) > 1 ? 'TIME_DAYS' : 'TIME_DAY') :
					parseInt(oValue / 3600) ? 'TIME_HR' :
						parseInt(oValue / 60) ? 'TIME_MIN' : 'TIME_SEC';
			}
			return dateTimeUnit;
		},

		/**
		 * Calculates the number of seconds remaining to reach the next time limit to update the displayed cache time
		 */
		decideTimeToSchedule : function(seconds, timeToSchedule) {
			var numMonths = seconds / 2628000;
			var numWeeks = seconds / 604800;
			var numDays = seconds / 86400;
			var numHours = seconds / 3600;
			var numMinutes = seconds / 60;
			if (numMonths >= 1) {
				var secondsToSchedule = 2628000 - (seconds % 2628000);
				if (!timeToSchedule || secondsToSchedule < timeToSchedule)
					return secondsToSchedule;
			} else if (numWeeks >= 1) {
				var secondsToSchedule = 604800 - (seconds % 604800);
				if (!timeToSchedule || secondsToSchedule < timeToSchedule)
					return secondsToSchedule;
			} else if (numDays >= 1) {
				var secondsToSchedule = 86400 - (seconds % 86400);
				if (!timeToSchedule || secondsToSchedule < timeToSchedule)
					return secondsToSchedule;
			} else if (numHours >= 1) {
				var secondsToSchedule = 3600 - (seconds % 3600);
				if (!timeToSchedule || secondsToSchedule < timeToSchedule)
					return secondsToSchedule;
			} else {
				var minutes = parseInt(numMinutes);
				var secondsToSchedule = 0;
				// For 0 - 5 minutes, the next update should happen at the 5th minute
				if (minutes < 5)
					secondsToSchedule = 300 - seconds;
				// For 5 - 10 minutes, the next update should happen at the 10th minute
				else if (minutes < 10)
					secondsToSchedule = 600 - seconds;
				// For 10 - 15 minutes, the next update should happen at the 15th minute
				else if (minutes < 15)
					secondsToSchedule = 900 - seconds;
				// For 15 - 20 minutes, the next update should happen at the 20th minute
				else if (minutes < 20)
					secondsToSchedule = 1200 - seconds;
				// For 20 - 60 minutes, the updates should happen on the 20th, 30th, 40th and 50th minutes
				else
					return (10 - (numMinutes % 10)) * 60;
				if (!timeToSchedule || secondsToSchedule < timeToSchedule)
					return secondsToSchedule;
			}
			return timeToSchedule;
		},

		/**
		 * Formatter used to display the cache age on the tile
		 */
		decideTimeToDisplay : function(seconds) {
			// For 0 - 20 minutes, the time displayed should be multiples of 5
			if (seconds < 1200)
				seconds = (parseInt((seconds / 60) / 5) * 5) * 60;
			// For 20 - 60 minutes, the time displayed should be multiples of 10
			else if (seconds >= 1200 && seconds < 3600)
				seconds = (parseInt((seconds / 60) / 10) * 10) * 60;
			var oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				relative : true,
				relativeSource : "auto",
				relativeStyle : "narrow"
			});
			var oDate = new Date(Date.now() - (1000 * seconds));
			return oFormat.format(oDate);
		},

		getCriticalityText : function(dataPoint, personalizedThresholds, personalizedFilters) {
			function format(anno) {
				return anno && (anno.Path ? "parseFloat(${" + anno.Path + "},10)" : parseFloat(anno.Decimal, 10));
			}

			var evalMeasure = dataPoint.Value;
			var crit = dataPoint.CriticalityCalculation;
			var oFormatting = dataPoint.ValueFormat;
			var targetValue = dataPoint.TargetValue;

			if (crit && crit.ImprovementDirection && crit.ImprovementDirection.EnumMember) {

				var warningLow = null;
				var criticalLow = null;
				var warningHigh = null;
				var criticalHigh = null;

				// check if user personalized thresholds are present in case of Personalized Tile
				if (personalizedThresholds
						&& (personalizedThresholds.WL || personalizedThresholds.CL || personalizedThresholds.WH
								|| personalizedThresholds.CH || personalizedThresholds.TA)) {
					warningLow = {
						Decimal : personalizedThresholds.WL
					};
					criticalLow = {
						Decimal : personalizedThresholds.CL
					};
					warningHigh = {
						Decimal : personalizedThresholds.WH
					};
					criticalHigh = {
						Decimal : personalizedThresholds.CH
					};
					targetValue = personalizedThresholds.TA;
				} else {
					// if personalized filters are present with no new thresholds then the current thresholds will
					// not be
					// considered
					if (personalizedFilters && !(jQuery.isEmptyObject(personalizedFilters)))
						return "{i18n>NEUTRAL}";
					warningLow = crit.ToleranceRangeLowValue;
					criticalLow = crit.DeviationRangeLowValue;
					warningHigh = crit.ToleranceRangeHighValue;
					criticalHigh = crit.DeviationRangeHighValue;
				}

				var bWL = !(warningLow && (warningLow.Decimal || warningLow.Path));
				var bCL = !(criticalLow && (criticalLow.Decimal || criticalLow.Path));
				var bWH = !(warningHigh && (warningHigh.Decimal || warningHigh.Path));
				var bCH = !(criticalHigh && (criticalHigh.Decimal || criticalHigh.Path));

				// checking for mandatory data availability based on the Criticality ImprovementDirection
				if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
						&& (bWL || bCL)) {
					return "{i18n>NEUTRAL}";
				}
				if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize"
						&& (bWH || bCH)) {
					return "{i18n>NEUTRAL}";
				}
				if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target"
						&& (bWL || bCL || bWH || bCH)) {
					return "{i18n>NEUTRAL}";
				}

				var measureValue = format(evalMeasure);

				// check for Relative To Threshold case | warningLow case
				if (targetValue && targetValue.Path && crit.ToleranceRangeLowValue && crit.ToleranceRangeLowValue.Decimal) {
					warningLow = "(parseFloat(${" + targetValue.Path + "},10) * "
							+ ((parseFloat(crit.ToleranceRangeLowValue.Decimal, 10)) / 100) + ")";
				} else
					warningLow = format(warningLow);

				// check for Relative To Threshold case | criticalLow case
				if (targetValue && targetValue.Path && crit.DeviationRangeLowValue && crit.DeviationRangeLowValue.Decimal) {
					criticalLow = "(parseFloat(${" + targetValue.Path + "},10) * "
							+ ((parseFloat(crit.DeviationRangeLowValue.Decimal, 10)) / 100) + ")";
				} else
					criticalLow = format(criticalLow);

				// check for Relative To Threshold case | warningHigh case
				if (targetValue && targetValue.Path && crit.ToleranceRangeHighValue && crit.ToleranceRangeHighValue.Decimal) {
					warningHigh = "(parseFloat(${" + targetValue.Path + "},10) * "
							+ ((parseFloat(crit.ToleranceRangeHighValue.Decimal, 10)) / 100) + ")";
				} else
					warningHigh = format(warningHigh);

				// check for Relative To Threshold case | criticalHigh case
				if (targetValue && targetValue.Path && crit.DeviationRangeHighValue && crit.DeviationRangeHighValue.Decimal) {
					criticalHigh = "(parseFloat(${" + targetValue.Path + "},10) * "
							+ ((parseFloat(crit.DeviationRangeHighValue.Decimal, 10)) / 100) + ")";
				} else
					criticalHigh = format(criticalHigh);

				var isPercentageMsr = false;
				// check whether evaluation measure is configured as a percentage measure
				if (oFormatting && oFormatting.ScaleFactor && oFormatting.ScaleFactor.Decimal == "0.01") {
					isPercentageMsr = true;
				}

				var isPercentageMsr = false;
				// check whether evaluation measure is configured as a percentage measure
				if (oFormatting && oFormatting.ScaleFactor && oFormatting.ScaleFactor.Decimal == "0.01") {
					isPercentageMsr = true;
				}
				switch (crit.ImprovementDirection.EnumMember) {
					case "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize" :
						if (isPercentageMsr) {
							return "{= (" + measureValue + " * 100) >= (" + warningLow + " * 100)  ? ${i18n>GOOD} : (" + measureValue
									+ " * 100) >= (" + criticalLow + " * 100) ? ${i18n>CRITICAL} : ${i18n>ERROR} }";
						} else {
							return "{= " + measureValue + " >= " + warningLow + " ? ${i18n>GOOD} : " + measureValue + " >= " + criticalLow
									+ " ? ${i18n>CRITICAL} : ${i18n>ERROR} }";
						}
					case "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize" :
						if (isPercentageMsr) {
							return "{= (" + measureValue + " * 100) <= (" + warningHigh + " * 100) ? ${i18n>GOOD} : (" + measureValue
									+ " * 100) <= (" + criticalHigh + " * 100) ? ${i18n>CRITICAL} : ${i18n>ERROR} }";
						} else {
							return "{= " + measureValue + " <= " + warningHigh + " ? ${i18n>GOOD} : " + measureValue + " <= "
									+ criticalHigh + " ? ${i18n>CRITICAL} : ${i18n>ERROR} }";
						}
					case "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target" :
						if (isPercentageMsr) {
							return "{= ((" + measureValue + " * 100) >= (" + warningLow + " * 100) && (" + measureValue
									+ " * 100) <= (" + warningHigh + " * 100)) ? ${i18n>GOOD} : ((" + measureValue + " * 100) < ("
									+ criticalLow + " * 100) || (" + measureValue + " * 100) > (" + criticalHigh
									+ " * 100) ) ? ${i18n>ERROR} : ${i18n>CRITICAL} }";
						} else {
							return "{= (" + measureValue + " >= " + warningLow + " && " + measureValue + " <= " + warningHigh
									+ ") ? ${i18n>GOOD} : (" + measureValue + " < " + criticalLow + " || " + measureValue + " > "
									+ criticalHigh + ") ? ${i18n>ERROR} : ${i18n>CRITICAL} }";
						}
				}
			} else {
				return "{i18n>NEUTRAL}";
			}
		},

		/**
		 * Formats Deviation Tile thresholds with time formatting
		 */
		decideDeviationThresholdFormatting : function(datap, oFormatting, personalizedThresholds, personalizedFilters, oMeasureUnit, iThreshold, columns) {

			if (oMeasureUnit && oMeasureUnit.Path) {
				var sBindingPath = "{= ${" + oMeasureUnit.Path + "}.toUpperCase() === 'SEC' ? ";
				var target = null;
				var bFullFormat = (iThreshold === 1 || iThreshold === 2)? true : false;
				var isPercentageMsr = false;
				// check whether evaluation measure is configured as a percentage measure
				if (oFormatting && oFormatting.ScaleFactor && oFormatting.ScaleFactor.Decimal == "0.01")
					isPercentageMsr = true;

				if (iThreshold) {
					var crit = datap.CriticalityCalculation;
					if (crit && crit.ImprovementDirection && crit.ImprovementDirection.EnumMember) {
						var low = null;
						var high = null;
						// check if user personalized thresholds are present in case of Personalized Tile
						if (personalizedThresholds
								&& (personalizedThresholds.WL || personalizedThresholds.CL || personalizedThresholds.WH
										|| personalizedThresholds.CH || personalizedThresholds.TA)) {
							low = {
								Decimal : (iThreshold == 1)? personalizedThresholds.WL: personalizedThresholds.CL
							};
							high = {
								Decimal : (iThreshold == 1)? personalizedThresholds.WH: personalizedThresholds.CH
							};
						} else {
							low = (iThreshold == 1)? crit.ToleranceRangeLowValue : crit.DeviationRangeLowValue;
							high = (iThreshold == 1)? crit.ToleranceRangeHighValue : crit.DeviationRangeHighValue;
						}

						// checking for mandatory data availability based on the Criticality ImprovementDirection
						if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
								&& !(low.Decimal || low.Path))
							return 0;
						if (crit.ImprovementDirection.EnumMember == "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize"
								&& !(high.Decimal || high.Path))
							return 0;

						switch (crit.ImprovementDirection.EnumMember) {
							case "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize" :
								target = (low && low.Decimal)? low.Decimal: low;
								break;
							case "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize" :
								target = (high && high.Decimal)? high.Decimal: high;
								break;
							default :
								return 0;
						}
					} else
						return 0;
				} else if (personalizedThresholds && personalizedThresholds.TA) {
					target = personalizedThresholds.TA;
				}

				if (target != null && !(target.Path)) {
						sBindingPath = sBindingPath + " "
							+ ssuite.smartbusiness.tiles.lib.Util.prototype.getFormattedTime(target, 2, false, false, true)
							+ " : '" + parseFloat(target) + "' }";

						sBindingPath = sBindingPath + " {= ${" + oMeasureUnit.Path + "}.toUpperCase() === 'SEC' ? ${i18n>"
							+ ssuite.smartbusiness.tiles.lib.Util.prototype.getFormattedTimeUnit(target)
							+ "} : ''}";
				} else {
					// if personalized filters are present with no new thresholds then the current thresholds will
					// not be
					// considered
					if (personalizedFilters && !(jQuery.isEmptyObject(personalizedFilters)))
						return 0;
					else {
						if (datap && datap.TargetValue && datap.TargetValue.Decimal) {
							target = ssuite.smartbusiness.tiles.lib.Util.prototype.getFormattedTime(datap.TargetValue.Decimal, 2, false, false, true);

							sBindingPath = sBindingPath + target;

							target = parseFloat(datap.TargetValue.Decimal);
							sBindingPath = sBindingPath + " : '" + ((isPercentageMsr)? target * 100 : target) + "' }";

							sBindingPath = sBindingPath + " {= ${" + oMeasureUnit.Path + "}.toUpperCase() === 'SEC' ? ${i18n>"
								+ ssuite.smartbusiness.tiles.lib.Util.prototype.getFormattedTimeUnit(datap.TargetValue.Decimal)
								+ "} : ''}";

						} else if ((datap && datap.TargetValue && datap.TargetValue.Path) || (target && target.Path)) {
							var pathObject = target || datap.TargetValue;
							var unitOfMeasure = {
									Path: ""
							};
							jQuery.each(columns, function(index, oColumn) {
								if (oColumn["sap:aggregation-role"] == "measure" && oColumn["name"] == pathObject.Path
										&& oColumn["sap:unit"]) {
									unitOfMeasure = oColumn["Org.OData.Measures.V1.Unit"];
									return false;
								}
							});
							return ssuite.smartbusiness.tiles.lib.Util.prototype.decideEvaluationMeasureBindPath(pathObject,
									oFormatting, null, unitOfMeasure, true, true);
						} else {
							return '';
						}
					}
				}
				return sBindingPath;
			} else
				return ssuite.smartbusiness.tiles.lib.Util.prototype.formatTargetValue(datap, oFormatting, personalizedThresholds, personalizedFilters);
		},

		/**
		 * Sets the tooltip for numeric tiles along with time formatting
		 */
		setTooltipForNumericTile : function(dataPoint, currency, unit, personalizedThresholds, personalizedFilters) {
			var sBindingPath = "";
			if (dataPoint && dataPoint.Value) {
				// value
				sBindingPath = ssuite.smartbusiness.tiles.lib.Util.prototype.decideEvaluationMeasureBindPath(dataPoint.Value,
						dataPoint.ValueFormat, currency, unit, true, true);

				// criticality
				sBindingPath = sBindingPath + "\n" +
					ssuite.smartbusiness.tiles.lib.Util.prototype.getCriticalityText(dataPoint, personalizedThresholds, personalizedFilters);

				// unit
				if ((currency && currency.Path) || (unit && unit.Path)) {
					var path = (currency && currency.Path)? currency.Path : (unit && unit.Path)? unit.Path : '';
					sBindingPath = sBindingPath + "\n" + "{= ${" + path + "}.toUpperCase() === 'SEC'? '' : " +
							" ${" + path + "}}";
				}
			}

			return sBindingPath;
		},

		/**
		 * Sets the tooltip for deviation tiles along with time formatting
		 * in case of varying thresholds(measures), we get the entire metadata to check the threshold measure's unit.
		 */
		setTooltipForDeviationTile : function(dataPoint, currency, unit, personalizedThresholds, personalizedFilters, metadata) {
			var sBindingPath = "";
			if (dataPoint && dataPoint.Value) {
				// value
				sBindingPath = "{i18n>ACTUAL}  " + ssuite.smartbusiness.tiles.lib.Util.prototype.decideEvaluationMeasureBindPath(dataPoint.Value,
						dataPoint.ValueFormat, currency, unit, true, true) + "  " +
						ssuite.smartbusiness.tiles.lib.Util.prototype.getCriticalityText(dataPoint, personalizedThresholds, personalizedFilters);

				// target
				sBindingPath = sBindingPath + "\n" + "{i18n>TARGET}  "
					+ ssuite.smartbusiness.tiles.lib.Util.prototype.decideDeviationThresholdFormatting(dataPoint,
						dataPoint.ValueFormat, personalizedThresholds, personalizedFilters, unit, null,
						metadata.dataServices.schema[0].entityType[0].property);

				// critical
				if (ssuite.smartbusiness.tiles.lib.Util.prototype.checkForThresholdCritical
						(dataPoint, personalizedThresholds, personalizedFilters)) {

					sBindingPath = sBindingPath + "\n" + "{i18n>THRESHOLD}  "
						+ ssuite.smartbusiness.tiles.lib.Util.prototype.decideDeviationThresholdFormatting(dataPoint,
								dataPoint.ValueFormat, personalizedThresholds, personalizedFilters, unit, 2,
								metadata.dataServices.schema[0].entityType[0].property)
						+ "  {i18n>CRITICAL}" ;
				}

				// warning
				if (ssuite.smartbusiness.tiles.lib.Util.prototype.checkForThresholdWarning
						(dataPoint, personalizedThresholds, personalizedFilters)) {

					sBindingPath = sBindingPath + "\n" + "{i18n>THRESHOLD}  "
						+ ssuite.smartbusiness.tiles.lib.Util.prototype.decideDeviationThresholdFormatting(dataPoint,
								dataPoint.ValueFormat, personalizedThresholds, personalizedFilters, unit, 1,
								metadata.dataServices.schema[0].entityType[0].property)
						+ "  {i18n>WARNING}" ;
				}

				// unit
				if ((currency && currency.Path) || (unit && unit.Path)) {
					var path = (currency && currency.Path)? currency.Path : (unit && unit.Path)? unit.Path : '';
					sBindingPath = sBindingPath + "\n" + "{= ${" + path + "}.toUpperCase() === 'SEC'? '' : " +
							" ${" + path + "}}";
				}
			}
			return sBindingPath;
		},

	});

	comp.prototype.formatDataBinding.requiresIContext = true;
	comp.prototype.formatEvaluationData.requiresIContext = true;
	comp.prototype.formatDataBindingForTrendTile.requiresIContext = true;
	comp.prototype.formatDimensionPath.requiresIContext = true;
	comp.prototype.decideMsrLabelCompMM.requiresIContext = true;
	comp.prototype.decideMsrAggrCompMM.requiresIContext = true;

	return comp;

}, true);
