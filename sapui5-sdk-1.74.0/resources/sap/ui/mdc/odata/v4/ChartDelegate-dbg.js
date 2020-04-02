/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/mdc/library",
	"sap/ui/mdc/ChartDelegate",
	"./ODataMetaModelUtil",
	"sap/base/util/merge"
], function(
	MDCLib,
	BaseChartDelegate,
	MetaModelUtil,
	merge
) {
	"use strict";

	/**
	 * @readonly
	 * @const {string}
	 */
	var AGGREGATION_ANNO = "@Org.OData.Aggregation.V1";

	function fillHeadData(aHeadData) {
		this.name = aHeadData[0];
		this.label = aHeadData[1] || this.name;
		this.textProperty = aHeadData[2];
		this.type = MetaModelUtil.getType(aHeadData[3]);

		if (aHeadData[4] || aHeadData[5]) {
			var sCalendarTag = aHeadData[4], sFiscalTag = aHeadData[5];

			if (sFiscalTag) {

				//fiscal tag is stronger than calendarTag
				switch (sFiscalTag) {

					case "year":
						this.timeUnit = "fiscalyear";
						break;

					case "yearPeriod":
						this.timeUnit = "fiscalyearperiod";
						break;

					default:
						this.timeUnit = undefined;
						break;
				}
			}

			if (sCalendarTag && !this.timeUnit) {

				switch (sCalendarTag) {

					case "yearMonth":
						this.timeUnit = "yearmonth";
						break;

					case "date":
						this.timeUnit = "yearmonthday";
						break;

					case "yearQuarter":
						this.timeUnit = "yearquarter";
						break;

					case "yearWeek":
						this.timeUnit = "yearweek";
						break;

					default:
						this.timeUnit = undefined;
						break;
				}
			}

		}

		this.criticality = aHeadData[6];
		return this;
	}

	function handleProperty(aResults) {
		var bGroupable = aResults[0], bAggregatable = aResults[1];
		var oHeadItem = {}, oProperty = {}, oItem;

		oProperty.inChart = bGroupable || bAggregatable || false;

		if (oProperty.inChart) {
			oProperty.chartItems = [];

			if (bGroupable) {
				oHeadItem.kind = MDCLib.ChartItemType.Dimension;
				oHeadItem.role = MDCLib.ChartItemRoleType.category;
				oItem = merge({}, oHeadItem);
				oProperty.chartItems.push(oItem);
			}

			if (bAggregatable) {
				oHeadItem.kind = MDCLib.ChartItemType.Measure;
				oHeadItem.role = MDCLib.ChartItemRoleType.axis1;
				oHeadItem.contextDefiningProperties = aResults[4] || [];

				var aSupportedAggregationMethods = aResults[2] || [],
					sDefaultAggregationMethod = aResults[3];

				for (var i = 0; i < aSupportedAggregationMethods.length; i++) {
					oItem = merge({}, oHeadItem);
					oItem.aggregationMethod = aSupportedAggregationMethods[i];
					oItem.default = oItem.aggregationMethod == sDefaultAggregationMethod;
					oProperty.chartItems.push(oItem);
				}
			}
		}

		var oMetaModel = this.getModel();

		return Promise.all([
			oMetaModel.requestObject("@sapui.name", this),
			oMetaModel.requestObject("@com.sap.vocabularies.Common.v1.Label", this),
			oMetaModel.requestObject("@com.sap.vocabularies.Common.v1.Text/$Path", this),
			oMetaModel.requestObject("$Type", this),
			MetaModelUtil.fetchCalendarTag(oMetaModel,this),
			MetaModelUtil.fetchFiscalTag(oMetaModel, this),
			MetaModelUtil.fetchCriticality(oMetaModel, this)
		]).then(fillHeadData.bind(oProperty));
	}

	function retrieveItems(oEntity, sPath, oMetaModel, mAnnos) {
		var sKey, oProperty, aPropertyPromise = [], aItems = [], sPrefix, aProperties = [], bSetFilterable,
			bSetSortable,  mKnownAggregatableProps = {};

		var mCustomAggregates = MetaModelUtil.getAllCustomAggregates(mAnnos);

		// collect custom aggregates
		for (var sCustom in mCustomAggregates) {

			aItems.push(merge({}, mCustomAggregates[sCustom], {
				propertyPath: sCustom,
				kind: MDCLib.ChartItemType.Measure,
				role: MDCLib.ChartItemRoleType.axis1,
				sortable: mCustomAggregates[sCustom].sortable,
				filterable: mCustomAggregates[sCustom].filterable
			}));
		}

		var mTypeAggregatableProps = MetaModelUtil.getAllAggregatableProperties(mAnnos);

		for (var sAggregatable in mTypeAggregatableProps) {
			sKey = mTypeAggregatableProps[sAggregatable].propertyPath;
			mKnownAggregatableProps[sKey] = mKnownAggregatableProps[sKey] || {};

			mKnownAggregatableProps[sKey][mTypeAggregatableProps[sAggregatable].aggregationMethod] = {
				name: mTypeAggregatableProps[sAggregatable].name,
				label: mTypeAggregatableProps[sAggregatable].label
			};
		}

		var oSortRestrictionsInfo = MetaModelUtil.getSortRestrictionsInfo(mAnnos["@Org.OData.Capabilities.V1.SortRestrictions"]),
			oFilterRestrictionsInfo = MetaModelUtil.getFilterRestrictionsInfo(mAnnos["@Org.OData.Capabilities.V1.FilterRestrictions"]);

		function push(oProperty) {
			aProperties.push(oProperty);

			// calculate sortable/filterable
			MetaModelUtil.addSortInfoForProperty(oProperty, oSortRestrictionsInfo);
			MetaModelUtil.addFilterInfoForProperty(oProperty, oFilterRestrictionsInfo);

			if (oProperty.inChart) {

				for (var i = 0; i < oProperty.chartItems.length; i++) {
					var oItem = oProperty.chartItems[i];
					oItem.propertyPath  = oProperty.name;
					oItem.type = oProperty.type;
					oItem.timeUnit = oProperty.timeUnit;
					oItem.criticality = oProperty.criticality;

					if (oItem.kind == MDCLib.ChartItemType.Measure) {

						if (mKnownAggregatableProps[oItem.propertyPath] && mKnownAggregatableProps[oItem.propertyPath][oItem.aggregationMethod]) {
							oItem.name 	= mKnownAggregatableProps[oItem.propertyPath][oItem.aggregationMethod].name;
							oItem.label = mKnownAggregatableProps[oItem.propertyPath][oItem.aggregationMethod].label;
						} else {
							oItem.name = oItem.aggregationMethod + oItem.propertyPath;
							oItem.label = oProperty.label + " (" + oItem.aggregationMethod + ")";
						}

						oItem.customAggregate = false;

						// in the first wave let us only sort by used items
						oItem.sortable = true;
						oItem.sortDirection = "both";
						oItem.filterable = true;
					} else {
						oItem.name = oProperty.name;
						oItem.textProperty = oProperty.textProperty;
						oItem.label = oProperty.label;

						// in the first wave let us only sort by used items
						oItem.sortable = oProperty.sortable;
						oItem.sortDirection = oProperty.sortDirection;

						// allow filtering on each possible dimension
						oItem.filterable = oProperty.filterable;
						oItem.allowedExpressions = oProperty.allowedExpressions;
					}

					aItems.push(oItem);
				}
			}
		}

		for (sKey in oEntity) {

			if (sKey[0] !== "$") {// no special annotation
				oProperty = oEntity[sKey];

				if (oProperty && oProperty.$kind && (oProperty.$kind == "Property")) {
					sPrefix = sPath + sKey + AGGREGATION_ANNO;

					aPropertyPromise.push(
						Promise.all([
							oMetaModel.requestObject(sPrefix + ".Groupable"),
							oMetaModel.requestObject(sPrefix + ".Aggregatable"),
							oMetaModel.requestObject(sPrefix + ".SupportedAggregationMethods"),
							oMetaModel.requestObject(sPrefix + ".RecommendedAggregationMethod"),
							oMetaModel.requestObject(sPrefix + ".ContextDefiningProperties")
						])
						.then(handleProperty.bind(oMetaModel.getMetaContext(sPath + sKey)))
						.then(push)
					);
				}
			}
		}

		return Promise.all(aPropertyPromise).then(function() {
			return [bSetSortable, bSetFilterable, aProperties, aItems];
		});
	}

	/**
	 * OData V4 delegate module for the <code>sap.ui.mdc.Chart</code> control.
	 *
	 * This module interpret service metadata that represents entity-relationship
	 * models, service capabilities, and annotations to automatically create
	 * some chart's inner controls, for example, dimension and measure items.
	 *
	 * <b>Note:</b> The module is experimental and is not finalized, hence it should not be used
	 * productively.
	 *
	 * @private
	 * @experimental
	 * @alias module:sap/ui/mdc/odata/v4/ChartDelegate
	 * @since 1.62
	 * @author SAP SE
	 */
	var ChartDelegate = Object.assign({}, BaseChartDelegate);

	/**
	 * @inheritdoc
	 */
	ChartDelegate.MetadataProperty = {
		kind: "Measure",
		role: "axis1",
		contextDefiningProperties: [],
		className: "sap.ui.mcd.chart.MeasureItem",
		aggregationMethod: "sum",
		"default": true,
		custom: false,
		name: "sumSalesAmount",
		propertyPath: "SalesAmount",
		label: "Total Sales Amount",
		textProperty: "",
		sortable: true,
		sortDirection: "both",
		filterable: true,
		allowedExpressions: []
	};

	/**
	 * @inheritdoc
	 */
	ChartDelegate.fetchProperties = function(oChart) {
		return this.retrieveAllMetadata(oChart).then(function(oMetadata) {
			return oMetadata.properties;
		});
	};

	/**
	 * @inheritdoc
	 */
	ChartDelegate.retrieveAggregationItem = function(sAggregationName, oMetadata) {
		var oSettings;
		var oAggregation = {
			className: "",
			settings: {
				key: oMetadata.name,
				label: oMetadata.label || oMetadata.name,
				type: oMetadata.type
			}
		};

		switch (oMetadata.kind) {

			case MDCLib.ChartItemType.Dimension:
				oAggregation.className = "sap.ui.mdc.chart.DimensionItem";

				oSettings = {
					textProperty: oMetadata.textProperty,
					timeUnit: oMetadata.timeUnit,
					displayText: true,
					criticality: oMetadata.criticality
				};

				break;

			case MDCLib.ChartItemType.Measure:
				oAggregation.className = "sap.ui.mdc.chart.MeasureItem";

				oSettings = {
					propertyPath: oMetadata.propertyPath,
					aggregationMethod: oMetadata.aggregationMethod
				};

				break;

			// no default
		}

		oAggregation.settings = Object.assign(oAggregation.settings, oSettings);
		return oAggregation;
	};

	/**
	 * @inheritdoc
	 */
	ChartDelegate.retrieveAllMetadata = function(oChart) {
		var oDelegate = oChart.getDelegate(),
			oModel = oChart.getModel(oDelegate.model),
			sPath = "/" + oDelegate.payload.collectionName,
			oMetaModel = oModel.getMetaModel();

		if (sPath.endsWith("/")) {
			throw new Error("The leading path for metadata calculation is the entity set not the path");
		}

		var sSetPath = sPath,
			sTypePath = sPath + "/";

		function resolve(aResult) {
			var oMetadata = {
				sortable: aResult[0],
				filterable: aResult[1],
				attributes: aResult[2],
				properties: aResult[3]
			};

			return oMetadata;
		}

		var aSetAndTypePromise = [
			oMetaModel.requestObject(sTypePath),
			oMetaModel.requestObject(sSetPath)
		];

		return Promise.all(aSetAndTypePromise).then(function(aTypeAndSet) {
			var oEntity = aTypeAndSet[0];
			var aAnnotationsPromises = [
				MetaModelUtil.fetchAllAnnotations(oMetaModel, sTypePath),
				MetaModelUtil.fetchAllAnnotations(oMetaModel, sSetPath)
			];

			return Promise.all(aAnnotationsPromises).then(function(aAnnotations) {

				// merge the annotations of set and type and let set overrule
				var oAnnotations = Object.assign(aAnnotations[0], aAnnotations[1]);
				return retrieveItems(oEntity, sTypePath, oMetaModel, oAnnotations);
			});

		}).then(resolve);
	};

	return ChartDelegate;
});
