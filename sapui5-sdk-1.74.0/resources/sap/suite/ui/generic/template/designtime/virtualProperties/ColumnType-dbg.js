sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
	"sap/base/util/extend",
	"sap/base/util/deepExtend",
	"sap/base/util/isEmptyObject"
], function (AnnotationChangeUtils, ChangeHandlerUtils, DesigntimeUtils, extend, deepExtend, isEmptyObject) {
	"use strict";

	var ColumnType = {},

		COLUMNTYPE_DATAFIELD = "DataField",
		COLUMNTYPE_CONNECTEDFIELDS = "ConnectedFields",
		COLUMNTYPE_CHART = "Chart",
		COLUMNTYPE_RATING = "RatingIndicator",
		COLUMNTYPE_PROGRESS = "ProgressIndicator",
		COLUMNTYPE_CONTACT = "Contact",
		COLUMNTYPE_INTENTBASEDNAV = "DataFieldWithIntentBasedNavigation",
		COLUMNTYPE_FORINTENTBASEDNAV = "DataFieldForIntentBasedNavigation",
		COLUMNTYPE_DATAFIELDWITHNAVPATH = "DataFieldWithNavigationPath",
		COLUMNTYPE_DATAFIELDFORACTION = "DataFieldForAction",
		COLUMNTYPE_DATAFIELDWITHURL = "DataFieldWithUrl",
		COLUMNTYPE_TOOLBARBUTTON = "ToolbarButton",

		LINEITEM = "com.sap.vocabularies.UI.v1.LineItem",
		DATAPOINT = "com.sap.vocabularies.UI.v1.DataPoint",
		DATAFIELD = "com.sap.vocabularies.UI.v1.DataField",
		CHART = "com.sap.vocabularies.UI.v1.Chart",
		FIELDGROUP = "com.sap.vocabularies.UI.v1.FieldGroup",
		CONTACT = "com.sap.vocabularies.Communication.v1.Contact",
		DATAFIELDWITHURL = "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
		DATAFIELDWITHNAVPATH = "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath",
		DATAFIELDFORANNOTATION = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
		DATAFIELDFORACTION = "com.sap.vocabularies.UI.v1.DataFieldForAction",
		FORINTENTBASEDNAV = "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation",
		INTENTBASEDNAV = "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation";

	/**
	 * Create a new column object.
	 *
	 * @param {string} sRecordType The type of the collection record
	 * @param {object} oOldRecord Old record of the collection with its content
	 * @returns {object} The new collection record
	 * @public
	 */
	ColumnType.createNewColumn = function (sRecordType, oOldRecord) {

		var sProperty,
			oAbstractRecordTemplate = {
				Label: {},
				Criticality: {},
				CriticalityRepresentation: {},
				IconUrl: {}
			},
			oRecordTemplate = {};
		oRecordTemplate[DATAFIELD] = extend({}, oAbstractRecordTemplate,
			{
				Value: { Path: "" }
			});
		oRecordTemplate[DATAFIELDWITHURL] = extend({}, oAbstractRecordTemplate,
			{
				Value: { Path: "" },
				Url: { String: "" }
			});
		oRecordTemplate[DATAFIELDWITHNAVPATH] = extend({}, oAbstractRecordTemplate,
			{
				Value: { Path: "" },
				Target: { NavigationPropertyPath: "" }
			});
		oRecordTemplate[DATAFIELDFORANNOTATION] = extend({}, oAbstractRecordTemplate,
			{
				Target: { AnnotationPath: "" }
			});
		oRecordTemplate[DATAFIELDFORACTION] = extend({}, oAbstractRecordTemplate,
			{
				Inline: { Bool: "true" },
				Determining: { Bool: "false" },
				Action: { String: "" },
				InvocationGrouping: {}
			});
		oRecordTemplate[INTENTBASEDNAV] = extend({}, oAbstractRecordTemplate,
			{
				Action: { String: "" },
				SemanticObject: { String: "" },
				Value: { Path: "" }
			});
		oRecordTemplate[FORINTENTBASEDNAV] = extend({}, oAbstractRecordTemplate,
			{
				Inline: { Bool: "true" },
				Determining: { Bool: "false" },
				Action: { String: "" },
				SemanticObject: { String: "" }
			});

		var oNewRecord = {
			"com.sap.vocabularies.UI.v1.Importance": {
				"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
			},
			"RecordType": sRecordType
		};
		deepExtend(oNewRecord, oRecordTemplate[sRecordType]);

		// Take over values from old record. If there is no such content, eliminate the empty property
		for (sProperty in oNewRecord) {
			if (sProperty !== "RecordType" && oOldRecord && oOldRecord[sProperty]) {
				extend(oNewRecord[sProperty], oOldRecord[sProperty]);
			}
			if (isEmptyObject(oNewRecord[sProperty])) {
				delete oNewRecord[sProperty];
			}
		}

		return oNewRecord;
	};

	/**
	 * Creates the basic annotation data  for a new DataPoint at a column, for rating or progress indicator
	 *
	 * @param {sap.m.Column} oColumn The given table column
	 * @param {string} sQualifier The qualifier of the new datapoint
	 * @param {string} sTargetValue The target value for the DataPoint
	 * @returns {object} The new data point
	 * @public
	 */
	ColumnType.createNewDataPointForColumn = function (oColumn, sQualifier, sTargetValue) {
		var sVisualization = "com.sap.vocabularies.UI.v1.VisualizationType/" + sQualifier,
			oRecord = ChangeHandlerUtils.getLineItemRecordForColumn(oColumn);

		var oNewDataPoint = {
			TargetValue: { String: sTargetValue },
			Visualization: { EnumMember: sVisualization },
			RecordType: DATAPOINT + "Type",
			Title: { String: sQualifier }
		};

		if (oRecord && oRecord.Value && oRecord.Value.Path && (oRecord.RecordType === DATAFIELD ||
			oRecord.RecordType === INTENTBASEDNAV || oRecord.RecordType === DATAFIELDWITHURL)) {
			oNewDataPoint.Value = {
				Path: oRecord.Value.Path
			};
		}

		return oNewDataPoint;
	};

	/**
	 * Determines the "right" (i.e. the first non-existing) qualifier for a term.
	 * This means in detail: check if a valid target already exists, and if it is not used in a different column,
	 * auto-populate it into the target field; else create a new target
	 *
	 * @param {sap.m.Column} oColumn The column element (in overlay mode)
	 * @param {string} sTerm Annotation term name
	 * @param {string} sBasicQualifier Default qualifier like "Rating"
	 * @returns {string} Full qualifier for the annotation term
	 */
	ColumnType.fixQualifierForNewColumn = function (oColumn, sTerm, sBasicQualifier) {

		var aLineItems = ChangeHandlerUtils.getLineItems(oColumn),
			iCurrentIndex = ChangeHandlerUtils.getLineItemRecordIndex(oColumn, aLineItems),
			sFullTerm = DesigntimeUtils.fixQualifierForAnnotationPath(aLineItems, sTerm, sBasicQualifier, iCurrentIndex);
		return sFullTerm;

	};

	/**
	 * Retrieves a list of possible values of the column type property, e.g. for filling a drop-down in the UI.
	 * @param {sap.m.Column} oColumn The column element (in overlay mode)
	 *
	 * @returns {object} An object comprising the values (as a technical key) and their labels (displayName)
	 * @public
	 */
	ColumnType.getColumnTypeValues = function (oColumn) {
		// oElement.getParent().getMetadata().loadDesignTime(oElement).then(function(oParentDesignTimeMetadata) {
		// var sTableType = oParentDesignTimeMetadata.properties.tableType.get();   // deactivated as late feature
		var oValues = {
			DataField: {
				displayName: "Data Field"
			},
			DataFieldWithUrl: {
				displayName: "Data Field with URL"
			},
			Contact: {
				displayName: "Contact"
			},
			DataFieldForAction: {
				displayName: "Inline Action"
			},
			DataFieldWithIntentBasedNavigation: {
				displayName: "Navigation Field"
			},
			DataFieldWithNavigationPath: {
				displayName: "Data Field with Nav Path"
			},
			DataFieldForIntentBasedNavigation: {
				displayName: "Navigation Button"
			},
			ConnectedFields: {
				displayName: "Connected Fields"
			},
			RatingIndicator: {
				displayName: "Rating Indicator"
			},
			ProgressIndicator: {
				displayName: "Progress Indicator"
			},
			Chart: {
				displayName: "Chart"
			}
		};

		return oValues;
	};

	/**
	 * Retrieves the current value of the column type property for a given column from
	 * various annotations.
	 *
	 * @param {object} oElement The UI5 element (in overlay mode)
	 * @returns {string} The technical key of the column type property, as comprised in the list of possible values
	 * @public
	 */
	ColumnType.getColumnType = function (oElement) {
		var oRecord = ChangeHandlerUtils.getLineItemRecordForColumn(oElement),
			sColumnType;

		if (!oRecord) {
			return sColumnType;
		}
		switch (oRecord.RecordType) {
			case DATAFIELDFORACTION:
				if (oRecord.Inline && oRecord.Determining !== true) {
					sColumnType = COLUMNTYPE_DATAFIELDFORACTION;
				} else {
					sColumnType = COLUMNTYPE_TOOLBARBUTTON;
				}
				break;
			case DATAFIELDFORANNOTATION:
				var sAnnotationPath = oRecord.Target.AnnotationPath;
				if (sAnnotationPath) {
					if (sAnnotationPath.indexOf(DATAPOINT) >= 0) {
						var oEntityType = ChangeHandlerUtils.getEntityTypeFromAnnotationPath(oElement, sAnnotationPath);
						var iQualifierIndex = sAnnotationPath.search("#");
						var sQualifier = sAnnotationPath.substring(iQualifierIndex);
						var sDataPoint = sQualifier ? DATAPOINT + sQualifier : DATAPOINT;
						var oDataPoint = oEntityType[sDataPoint];
						if (oDataPoint) {
							if (oDataPoint.Visualization.EnumMember === "com.sap.vocabularies.UI.v1.VisualizationType/Rating") {
								sColumnType = COLUMNTYPE_RATING;
							}
							if (oDataPoint.Visualization.EnumMember === "com.sap.vocabularies.UI.v1.VisualizationType/Progress") {
								sColumnType = COLUMNTYPE_PROGRESS;
							}
						}
					} else if (oRecord.Target.AnnotationPath.indexOf(CONTACT) >= 0) {
						sColumnType = COLUMNTYPE_CONTACT;
					} else if (oRecord.Target.AnnotationPath.indexOf(CHART) >= 0) {
						sColumnType = COLUMNTYPE_CHART;
					} else if (oRecord.Target.AnnotationPath.indexOf(FIELDGROUP) >= 0) {
						sColumnType = COLUMNTYPE_CONNECTEDFIELDS;
					}
				}
				break;
			case INTENTBASEDNAV:
				sColumnType = COLUMNTYPE_INTENTBASEDNAV;
				break;
			case FORINTENTBASEDNAV:
				if (oRecord.Inline && oRecord.Determining !== true) {
					sColumnType = COLUMNTYPE_FORINTENTBASEDNAV;
				} else {
					sColumnType = COLUMNTYPE_TOOLBARBUTTON;
				}
				break;
			case DATAFIELD:
				sColumnType = COLUMNTYPE_DATAFIELD;
				break;
			case DATAFIELDWITHURL:
				sColumnType = COLUMNTYPE_DATAFIELDWITHURL;
				break;
			case DATAFIELDWITHNAVPATH:
				sColumnType = COLUMNTYPE_DATAFIELDWITHNAVPATH;
				break;
			default:
				break;
		}
		return sColumnType;
	};

	/**
	 * Updates the value of the column type property for a given column by updating
	 * different annotations
	 *
	 * @param {sap.m.Column} oColumn The column element (in overlay mode)
	 * @param {string} sNewColumnType The new value for the columnType
	 * @param {object} oChange The UI Change (of Run-Time Adaptation)
	 *
	 * @returns{object} The change content, comprising old an new values of the columnType but also
	 *                  the implicitly changed annotations.
	 * @public
	 */
	ColumnType.setColumnType = function (oColumn, sNewColumnType, oChange) {

		oChange.noRefreshOnChange = true;
		oChange.delayRefresh = false;

		var sOldValue = ColumnType.getColumnType(oColumn);
		if (sOldValue === sNewColumnType) {
			return;
		}

		oChange.refreshPropertiesPane = true;

		var aCustomChanges = [],
			oCustomChange = {},
			oEntityType = {},
			sRecordType,
			sFullTerm,
			oDataPoint = {},
			sTarget = ChangeHandlerUtils.getEntityType(ChangeHandlerUtils.getComponent(oColumn));

		switch (sNewColumnType) {
			case COLUMNTYPE_DATAFIELD:
				sRecordType = DATAFIELD;
				break;
			case COLUMNTYPE_DATAFIELDWITHURL:
				sRecordType = DATAFIELDWITHURL;
				break;
			case COLUMNTYPE_DATAFIELDFORACTION:
				sRecordType = DATAFIELDFORACTION;
				break;
			case COLUMNTYPE_INTENTBASEDNAV:
				sRecordType = INTENTBASEDNAV;
				break;
			case COLUMNTYPE_FORINTENTBASEDNAV:
				sRecordType = FORINTENTBASEDNAV;
				break;
			case COLUMNTYPE_DATAFIELDWITHNAVPATH:
				sRecordType = DATAFIELDWITHNAVPATH;
				break;
			case COLUMNTYPE_CONNECTEDFIELDS:
				aOldLineItems = ChangeHandlerUtils.getLineItems(oColumn);
				iLineItemRecordIndex = ChangeHandlerUtils.getLineItemRecordIndex(oColumn, aOldLineItems);
				oOldLineItemRecord = aOldLineItems[iLineItemRecordIndex] ? aOldLineItems[iLineItemRecordIndex] : {};
				sFullTerm = ColumnType.fixQualifierForNewColumn(oColumn, FIELDGROUP, "FE", oEntityType);
				var oFieldGroup = ChangeHandlerUtils.createNewFieldGroup(oOldLineItemRecord);
				oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sTarget, oFieldGroup, {}, sFullTerm);
				aCustomChanges.push(oCustomChange);
				sRecordType = DATAFIELDFORANNOTATION;
				break;
			case COLUMNTYPE_CHART:
				sFullTerm = ColumnType.fixQualifierForNewColumn(oColumn, CHART, "FE", oEntityType);
				var oChart = DesigntimeUtils.createNewChart();
				oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sTarget, oChart, {}, sFullTerm);
				aCustomChanges.push(oCustomChange);
				sRecordType = DATAFIELDFORANNOTATION;
				break;
			case COLUMNTYPE_CONTACT:
				sFullTerm = ColumnType.fixQualifierForNewColumn(oColumn, CONTACT, "FE", oEntityType);
				var oContact = DesigntimeUtils.createNewContact();
				oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sTarget, oContact, {}, sFullTerm);
				aCustomChanges.push(oCustomChange);
				sRecordType = DATAFIELDFORANNOTATION;
				break;
			case COLUMNTYPE_RATING:
				sFullTerm = ColumnType.fixQualifierForNewColumn(oColumn, DATAPOINT, "FE", oEntityType);
				oDataPoint = ColumnType.createNewDataPointForColumn(oColumn, "Rating", "4");
				oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sTarget, oDataPoint, {}, sFullTerm);
				aCustomChanges.push(oCustomChange);
				sRecordType = DATAFIELDFORANNOTATION;
				break;
			case COLUMNTYPE_PROGRESS:
				sFullTerm = ColumnType.fixQualifierForNewColumn(oColumn, DATAPOINT, "FE", oEntityType);
				oDataPoint = ColumnType.createNewDataPointForColumn(oColumn, "Progress", "100");
				oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sTarget, oDataPoint, {}, sFullTerm);
				aCustomChanges.push(oCustomChange);
				sRecordType = DATAFIELDFORANNOTATION;
				break;
			default:
				break;
		}

		if (!sRecordType) {
			return;
		}

		var aOldLineItems = ChangeHandlerUtils.getLineItems(oColumn);
		var iLineItemRecordIndex = ChangeHandlerUtils.getLineItemRecordIndex(oColumn, aOldLineItems);
		if (iLineItemRecordIndex === -1) {
			throw "invalid index for old column";
		}
		var oOldLineItemRecord = aOldLineItems[iLineItemRecordIndex];
		var aNewLineItems = [];
		aNewLineItems.push.apply(aNewLineItems, aOldLineItems);

		var oNewColumn = ColumnType.createNewColumn(sRecordType, oOldLineItemRecord);
		switch (sNewColumnType) {
			case COLUMNTYPE_RATING:
			case COLUMNTYPE_PROGRESS:
			case COLUMNTYPE_CHART:
			case COLUMNTYPE_CONNECTEDFIELDS:
				oNewColumn.Target = { AnnotationPath: "@" + sFullTerm };
				break;
			case COLUMNTYPE_CONTACT:
				oNewColumn.Target = { AnnotationPath: "@" + sFullTerm };
				if (!oNewColumn.Label) {
					oNewColumn.Label = {
						"String": "New Contact"
					};
				}
				break;
			default:
				break;
		}
		// set instance-specific metadata so that the adjusted column can be found again
		DesigntimeUtils._setP13nData(oColumn, oNewColumn);

		// Prepare annotation term change
		aNewLineItems.splice(iLineItemRecordIndex, 1, oNewColumn);
		oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(sTarget, aNewLineItems, aOldLineItems, LINEITEM);
		aCustomChanges.push(oCustomChange);

		return aCustomChanges;
	};

	return ColumnType;
});
