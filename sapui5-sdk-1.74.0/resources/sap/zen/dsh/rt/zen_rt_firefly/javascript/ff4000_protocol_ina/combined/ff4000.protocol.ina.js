(function(oFF) {
	oFF.CsnConstants = {
		DEFINITIONS : "definitions",
		ELEMENTS : "elements",
		KEY : "key",
		KEYS : "keys",
		ENUM : "#",
		REFERENCE : "=",
		LENGTH : "length",
		PRECISION : "precision",
		SCALE : "scale",
		DATA_CATEGORY_DIMENSION : "DIMENSION",
		ON : "on",
		REF : "ref",
		TARGET : "target",
		PARAMETERS : "parameters",
		NAME : "name",
		TYPE : "type",
		TYPE_STRING : "cds.String",
		TYPE_LARGE_STRING : "cds.LargeString",
		TYPE_INTEGER : "cds.Integer",
		TYPE_INTEGER64 : "cds.Integer64",
		TYPE_BOOLEAN : "cds.Boolean",
		TYPE_DECIMAL : "cds.Decimal",
		TYPE_DECIMAL_FLOAT : "cds.DecimalFloat",
		TYPE_DOUBLE : "cds.Double",
		TYPE_DATE : "cds.Date",
		TYPE_LOCAL_DATE : "cds.LocalDate",
		TYPE_TIME : "cds.Time",
		TYPE_LOCAL_TIME : "cds.LocalTime",
		TYPE_DATE_TIME : "cds.DateTime",
		TYPE_LOCAL_DATE_TIME : "cds.UTCDateTime",
		TYPE_TIMESTAMP : "cds.Timestamp",
		TYPE_UTC_TIMESTAMP : "cds.UTCTimestamp",
		TYPE_ASSOCIATION : "cds.association",
		KIND : "kind",
		KIND_ENTITY : "entity",
		AXIS_FREE : "FREE",
		AXIS_ROWS : "ROWS",
		AXIS_COLUMNS : "COLUMNS",
		DISPLAY_KEY : "KEY",
		DISPLAY_TEXT : "TEXT",
		TOTALS_SHOW : "SHOW",
		TOTALS_HIDE : "HIDE",
		A_COMMON_LABEL : "@Common.Label",
		A_QUERY_AXIS : "@AnalyticsDetails.query.axis",
		A_QUERY_DISPLAY : "@AnalyticsDetails.query.display",
		A_QUERY_TOTALS : "@AnalyticsDetails.query.totals",
		A_DEFAULT_AGGREGATION : "@DefaultAggregation",
		A_DIMENSION : "@Analytics.Dimension",
		A_MEASURE : "@Analytics.Measure",
		A_OBJECTMODEL_ASSOCIATION : "@ObjectModel.foreignKey.association",
		A_DATA_CATEGORY : "@Analytics.dataCategory",
		A_REPRESENTATIVE_KEY : "@ObjectModel.representativeKey",
		A_TEXT_ATTRIBUTE : "@Common.Text",
		A_TEXT_FOR : "@Common.TextFor",
		A_DECIMALS : "@AnalyticsDetails.query.decimals",
		A_ISO_CURRENCY : "@Measures.ISOCurrency",
		A_MEASURES_UNIT : "@Measures.Unit",
		A_UI_HIDDEN : "@UI.Hidden",
		A_FILTERABLE : "@Capabilities.FilterRestrictions.Filterable"
	};
	oFF.GoogleConstants = {
		K_ANIMATION : "animation",
		K_ALIGNMENT : "alignment",
		K_BAR : "bar",
		K_BOLD : "bold",
		K_BASELINE : "baseline",
		K_C : "c",
		K_CALC : "calc",
		V_CALC_STRINGIFY : "stringify",
		K_CHART_AREA : "chartArea",
		K_COLOR : "color",
		K_COLS : "cols",
		V_CENTER : "center",
		K_CHART_TYPE : "chartType",
		K_COUNT : "count",
		K_DATA : "data",
		K_DURATION : "duration",
		K_EASING : "easing",
		V_EASING_LINEAR : "linear",
		K_FONT_SIZE : "fontSize",
		K_FONT_NAME : "fontName",
		K_GROUP_WIDTH : "groupWidth",
		K_GRID_LINES : "gridlines",
		K_HEIGHT : "height",
		K_HIGH_CONTRAST : "highContrast",
		K_HORIZONTAL_AXIS : "hAxis",
		K_LABEL : "label",
		K_LEGEND : "legend",
		K_LENGTH : "length",
		K_METADATA : "metadata",
		K_MAX_LINES : "maxLines",
		K_NUMBER : "number",
		K_OPTIONS : "options",
		K_POSITION : "position",
		V_POSITION_NONE : "none",
		K_POINT_SIZE : "pointSize",
		K_ROLE : "role",
		V_ROLE_ANNOTATION : "annotation",
		K_ROLE_ANNOTATIONS : "annotations",
		K_ROWS : "rows",
		K_SOURCE_COLUMN : "sourceColumn",
		K_STACKED : "isStacked",
		K_STARTUP : "startup",
		K_STEM : "stem",
		K_SERIES : "series",
		K_TITLE : "title",
		K_TEXT_STYLE : "textStyle",
		K_TYPE : "type",
		V_TYPE_STRING : "string",
		V_TYPE_NUMBER : "number",
		K_TOOLTIP : "tooltip",
		K_TEXT_POSITION : "textPosition",
		K_TICKS : "ticks",
		K_V : "v",
		K_VERTICAL_AXIS : "vAxis",
		K_WIDTH : "width"
	};
	oFF.HiChartConstants = {
		K_CHART : "chart"
	};
	oFF.InACapabilities = {
		EXT_KEYFIGURE_PROPERTIES : "ExtendedKeyfigureProperties",
		CUSTOM_MEASURE_SORTORDER : "CustomMeasureSortOrder",
		DATA_REFRESH_AND_DATA_TOPICALITY : "SupportsDataRefreshAndDataTopicality",
		METADATA_DATASOURCE_DEFINITION_VALIDATION : "MetadataDataSourceDefinitionValidation",
		MD_DS_DEF_VAL_EXPOSE_DS : "MetadataDataSourceDefinitionValidationExposeDataSource",
		EXTENDED_VARIABLE_DEFINITION : "ExtendedVariableDefinition",
		RESULTSET_CELL_VALUE_TYPES : "RsCellValueTypes",
		QUERY_DATA_CELLS : "QDataCells",
		METADATA_SERVICE : "MetadataService",
		RESPONSE_FIXED_ATTRIBUTE_SEQUENCE : "ResponseFixedAttributeSequence",
		UNIFIED_REQUEST_SYNTAX : "UnifiedRequestSyntax",
		STATEFUL_SERVER : "StatefulServer",
		STATEFUL_DATA_PROVIDER : "StatefulDataProvider",
		SET_OPERAND : "SupportsSetOperand",
		HIERARCHY_SELECTION_AS_FLAT_SELECTION : "SupportsHierarchySelectionAsFlatSelection",
		READ_MODE : "ReadMode",
		SERVER_STRUCTURE_NAMES : "ServerStructureNames",
		ENCODED_RESULTSET : "SupportsEncodedResultSet",
		OBTAINABILITY : "Obtainability",
		COMPLEX_FILTERS : "SupportsComplexFilters",
		DATASOURCE_AT_SERVICE : "DatasourceAtService",
		NEW_VALUES_IMPLICIT_UNLOCK : "NewValuesImplicitUnlock",
		NEW_VALUES_EXTENDED_FORMAT : "NewValuesExtendedFormat",
		HIERARCHY_NAME_VARIABLE : "HierarchyNameVariable",
		ATTRIBUTE_HIERARCHY : "AttributeHierarchy",
		CLIENT_CAPABILITIES : "ClientCapabilities",
		VARIABLE_RE_SUBMIT : "VariableReSubmit",
		HIERARCHY_CATALOG : "HierarchyCatalog",
		EXT_HIERARCHY : "ExtHierarchy",
		RESULTSET_CELL_FORMAT_STRING : "ResultSetCellFormatString",
		SAP_DATE : "SAPDate",
		CUMMULATIVE : "SupportsCummulative",
		EXCEPTIONS : "Exceptions",
		EXCEPTIONS_V2 : "ExceptionsV2",
		EXCEPTION_SETTINGS : "ExceptionSettings",
		SUPPLEMENTS : "Supplements",
		RUN_AS_USER : "RunAsUser",
		UNIQUE_ATTRIBUTE_NAMES : "UniqueAttributeNames",
		RESULTSET_INTERVAL : "ResultSetInterval",
		ATTRIBUTE_HIERARCHY_UNIQUE_FIELDS : "AttributeHierarchyUniqueFields",
		PAGING : "Paging",
		METADATA_IS_DISPLAY_ATTRIBUTE : "MetadataIsDisplayAttribute",
		CANCEL_RUNNING_REQUESTS : "CancelRunningRequests",
		EPM_RESPONSE_LIST_SHARED_VERSIONS : "EPMResponseListSharedVersions",
		TOTALS_AFTER_VISIBILITY_FILTER : "TotalsAfterVisibilityFilter",
		EXTENDED_DIMENSION_TYPES : "ExtendedDimensionTypes",
		SEMANTICAL_ERROR_TYPE : "SemanticalErrorType",
		FAST_PATH : "FastPath",
		METADATA_DIMENSION_GROUP : "MetadataDimensionGroup",
		USE_EPM_VERSION : "UseEPMVersion",
		DIMENSION_KIND_EPM_VERSION : "DimensionKindEPMVersion",
		DIMENSION_KIND_CHART_OF_ACCOUNTS : "DimensionKindChartOfAccounts",
		HIERARCHY_KEY_TEXT_NAME : "HierarchyKeyTextName",
		RETURN_RESTRICTED_AND_CALCULATED_MEMBERS_IN_READ_MODE_BOOKED : "ReturnRestrictedAndCalculatedMembersInReadmodeBooked",
		SP9 : "SP9",
		INA_MODEL : "inamodel",
		HIERARCHY_NAVIGATION_COUNTER : "HierarchyNavigationCounter",
		ATTRIBUTE_HIERARCHY_HIERARCHY_FIELDS : "AttributeHierarchyHierarchyFields",
		TECHNICAL_AXIS : "TechnicalAxis",
		DIMENSION_VALUEHELP_PROPERTY : "DimensionValuehelpProperty",
		PAGING_TUPLE_COUNT_TOTAL : "PagingTupleCountTotal",
		SORT_TYPE : "SupportsSortType",
		HIERARCHY_PATH : "HierarchyPath",
		ZERO_SUPPRESSION : "ZeroSuppression",
		MANUAL_INPUT : "ManualInput",
		MULTI_SOURCE : "MultiSource",
		METADATA_DATA_CATEGORY : "MetadataDataCategory",
		METADATA_HIERARCHY_STRUCTURE : "MetadataHierarchyStructure",
		METADATA_HIERARCHY_LEVELS : "MetadataHierarchyLevels",
		DIMENSION_HIERARCHY_LEVELS : "DimensionHierarchyLevels",
		EXTENDED_SORT : "SupportsExtendedSort",
		REPORT_REPORT_INTERFACE : "RRI",
		METADATA_SEMANTIC_TYPE : "MetadataSemanticType",
		METADATA_DIMENSION_OTHERS : "MetadataDimensionOthers",
		METADATA_DIMENSION_IS_MODELED : "MetadataDimensionIsModeled",
		RESULTSET_CELL_MEASURE : "ResultSetCellMeasure",
		RESULTSET_HIERARCHY_LEVEL : "ResultSetHierarchyLevel",
		VALUES_ROUNDED : "ValuesRounded",
		SET_OPERAND_CURRENT_MEMBER_SINGLE_NAVIGATION : "SetOperandCurrentMemberSingleNavigation",
		CUSTOM_DIMENSION_MEMBER_EXECUTION_STEP : "CustomDimensionMemberExecutionStep",
		HIERARCHY_PATH_UNIQUE_NAME : "HierarchyPathUniqueName",
		HIERARCHY_DATA_AND_EXCLUDING_FILTERS : "HierarchyDataAndExcludingFilters",
		VISIBILITY_FILTER : "VisibilityFilter",
		SPATIAL_FILTER : "SupportsSpatialFilter",
		SPATIAL_FILTER_WITH_SRID : "SpatialFilterSRID",
		SPATIAL_TRANSFORMATIONS : "SupportsSpatialTransformations",
		SPATIAL_CLUSTERING : "SpatialClustering",
		MEMBER_VISIBILITY : "SupportsMemberVisibility",
		SUBMIT_RETURNS_VARIABLE_VALUES : "SubmitReturnsVariableValues",
		DEFINITION_RETURNS_VARIABLE_VALUES : "DefinitionReturnsVariableValues",
		HIERARCHY_TRAPEZOID_FILTER : "HierarchyTrapezoidFilter",
		IS_DISPLAY_ATTRIBUTE : "IsDisplayAttribute",
		EXECUTION_STEP : "ExecutionStep",
		CELL_DATA_TYPE : "CellDataType",
		EXTENDED_DIMENSIONS : "ExtendedDimensions",
		EXTENDED_DIMENSIONS_FIELD_MAPPING : "ExtendedDimensionsFieldMapping",
		EXTENDED_DIMENSIONS_JOIN_COLUMNS : "ExtendedDimensionsJoinColumns",
		EXTENDED_DIMENSIONS_OUTER_JOIN : "ExtendedDimensionsOuterJoin",
		EXTENDED_DIMENSIONS_SKIP : "ExtendedDimensionsSkip",
		METADATA_DEFAULT_RESULT_ALIGNMENT_BOTTOM : "MetadataDefaultResultStructureResultAlignmentBottom",
		IGNORE_EXTERNAL_DIMENSIONS : "SupportsIgnoreExternalDimensions",
		PERSIST_RESULTSET : "PersistResultSet",
		RESTRICTED_MEMBERS_CONVERT_TO_FLAT_SELECTION : "RestrictedMembersConvertToFlatSelection",
		VARIABLES : "Variables",
		TOTALS : "Totals",
		ENCODED_RESULTSET_2 : "SupportsEncodedResultSet2",
		RESULTSET_STATE : "ResultSetState",
		RESULTSET_CELL_NUMERIC_SHIFT : "ResultSetCellNumericShift",
		RESULTSET_CELL_DATA_TYPE : "ResultSetCellDataType",
		ORDER_BY : "OrderBy",
		METADATA_REPOSITORY_SUFFIX : "MetadataRepositorySuffix",
		METADATA_CUBE_QUERY : "MetadataCubeQuery",
		MAX_RESULT_RECORDS : "MaxResultRecords",
		IGNORE_UNIT_OF_NULL_IN_AGGREGATION : "IgnoreUnitOfNullValueInAggregation",
		SET_NULL_CELLS_UNIT_TYPE : "SetNullCellsUnitType",
		DIMENSION_FILTER : "SupportsDimensionFilterCapability",
		DIMENSION_F4_SELECTION_WITH_COMPOUNDMENT : "DimF4SelectionWithCompoundment",
		CUBE_BLENDING : "CubeBlending",
		CUBE_BLENDING_AGGREGATION : "SupportsCubeBlendingAggregation",
		CUBE_BLENDING_CUSTOM_MEMBERS : "CubeBlendingCustomMembers",
		CUBE_BLENDING_MEMBER_SORTING : "CubeBlendingMemberSorting",
		CUBE_BLENDING_OUT_OF_CONTEXT : "CubeBlendingOutOfContext",
		CUBE_BLENDING_PROPERTIES : "CubeBlendingProperties",
		CUBE_BLENDING_READ_MODE : "CubeBlendingReadMode",
		REMOTE_BLENDING : "RemoteBlending",
		CUBE_CACHE : "CubeCache",
		CELL_VALUE_OPERAND : "CellValueOperand",
		EXPAND_BOTTOM_UP : "ExpandHierarchyBottomUp",
		CONDITIONS : "Conditions",
		AGGREGATION_NOP_NULL : "AggregationNOPNULL",
		AGGREGATION_NOP_NULL_ZERO : "AggregationNOPNULLZERO",
		EXCEPTION_AGGREGATION_DIMENSIONS_AND_FORMULAS : "ExceptionAggregationDimsAndFormulas",
		MDS_EXPRESSION : "MdsExpression",
		HIERARCHY_NAVIGATION_DELTA_MODE : "HierarchyNavigationDeltaMode",
		CURRENT_MEMBER_FILTER_EXTENSION : "CurrentMemberFilterExtension",
		FLAT_KEY_ON_HIERARCHY_DISPLAY : "FlatKeyOnHierarchicalDisplay",
		DATA_CELL_MIXED_VALUES : "SupportsDataCellMixedValues",
		ATTRIBUTE_VALUE_LOOKUP : "AttributeValueLookup",
		METADATA_HIERARCHY_UNIQUE_NAME : "MetadataHierarchyUniqueName",
		CALCULATED_KEYFIGURES : "SupportsCalculatedKeyFigures",
		RESTRICTED_KEYFIGURES : "SupportsRestrictedKeyFigures",
		RETURN_ERROR_FOR_INVALID_QUERYMODEL : "ReturnErrorForInvalidQueryModel",
		CUSTOM_DIMENSION_2 : "CustomDimension2",
		EXTENDED_VARIABLE_STEPS : "SupportsExtVarSteps",
		ORIGINAL_TEXTS : "SupportsOriginalTexts",
		CUSTOM_DIMENSION_FILTER : "CustomDimensionFilterCapabilities",
		MDS_LIKE_PAGING : "MDSLikePaging",
		AVERAGE_COUNT_IGNORE_NULL_ZERO : "AverageCountIgnoreNullZero",
		UNIFIED_DATA_CELLS : "UnifiedDataCells",
		HIERARCHY_LEVEL_OFFSET_FILTER : "HierarchyLevelOffsetFilter",
		LOCALE_SORTING : "LocaleSorting",
		CE_SCENARIO_PARAMS : "CEScenarioParams",
		METADATA_DIMENSION_CAN_BE_AGGREGATED : "MetadataDimensionCanBeAggregated",
		MEMBER_VALUE_EXCEPTIONS : "SupportsMemberValueExceptions",
		INITIAL_DRILL_LEVEL_RELATIVE : "InitialDrillLevelRelative",
		MDM_HIERARCHY_WITH_DRILL_LEVEL : "MDMHierarchyWithDrillLevel",
		CARTESIAN_FILTER_INTERSECT : "CartesianFilterIntersect",
		NO_HIERARCHY_PATH_ON_FLAT_DIMENSIONS : "NoHierarchyPathOnFlatDimensions",
		RETURNED_DATA_SELECTION : "ReturnedDataSelection",
		KEYFIGURE_HIERARCHIES : "SupportsKeyfigureHierarchies",
		DATA_REFRESH : "SupportsDataRefresh",
		RESULTSET_AXIS_TYPE : "ResultSetAxisType",
		VARIABLE_VARIANTS : "SupportsVariableVariants",
		CALCULATED_DIMENSION : "CalculatedDimension",
		PLANNING_ON_CALCULATED_DIMENSION : "PlanningOnCalculatedDimension",
		INPUT_READINESS_STATES : "InputReadinessStates",
		READ_MODES_V2 : "ReadModesV2",
		VISUAL_AGGREGATION : "VisualAggregation",
		LIST_REPORTING : "ListReporting",
		SORT_NEW_VALUES : "SortNewValues",
		IGNORE_UNIT_OF_ZERO_VALUE_IN_AGGREGATION : "IgnoreUnitOfZeroValueInAggregation",
		DIMENSION_TYPE_TIME : "SupportsDimensionTypeTime",
		EXTENDED_DIMENSION_CHANGE_DEFAULT_RENAMING_AND_DESCRIPTION : "ExtendedDimensionsChangeDefaultRenamingAndDescription",
		EXTENDED_DIMENSION_COPY_ALL_HIERARCHIES : "ExtendedDimensionsCopyAllHierarchies",
		FIX_METADATA_HIERARCHY_ATTRIBUTES : "FixMetaDataHierarchyAttributes",
		UNIVERSAL_DISPLAY_HIERARCHIES : "SupportsUniversalDisplayHierarchies",
		UNIVERSAL_DISPLAY_HIERARCHY_ZERO_BASED : "UniversalDisplayHierarchyZeroBased",
		VARIABLE_MASKING : "VariableMasking",
		EXTENDED_DIMENSIONS_JOIN_CARDINALITY : "ExtendedDimensionsJoinCardinality",
		CATALOG_SERVICE_V20 : "CatalogServiceV20",
		METADATA_BASE_MEASURE_NAME : "MetadataBaseMeasureName",
		MDM_HIERARCHY_DRILL_LEVEL : "MDMHierarchyDrillLevel",
		CUSTOM_SORT : "CustomMemberSortOrder",
		EXCEPTION_AGGREGATION_AVGNULL_SELECTION_MEMBER : "ExceptionAggregationAverageNullInSelectionMember",
		EXCEPTION_AGGREGATION_COUNTNULL_SELECTION_MEMBER : "ExceptionAggregationCountNullInSelectionMember",
		STATISTICAL_AGGREGATIONS : "StatisticalAggregations",
		PRESENTATION_LENGTH : "PresentationLength",
		SUPPRESS_KEYFIGURE_CALCULATION : "SuppressKeyfigureCalculation",
		VARIANCE_OPERATOR : "SupportsOperatorVariance",
		NUMBER_AS_STRING : "SimpleNumericVariableAsString",
		CLIENT_INFO : "ClientInfo",
		SPATIAL_CHOROPLETH : "SpatialChoropleth",
		INA_CURRENT_MEMBER : "INACurrentMember",
		RESULTSETV2_METADATA_EXTENSION1 : "ResultSetV2MetadataExtension1",
		QDATA_CELL_MODEL_DEFAULTS : "QDataCellModelDefaults",
		QUERY_CURRENCY_TRANSLATION : "QueryCurrencyTranslation",
		STRUCTURE_RESTRICTIONS_IN_VALUE_HELP : "StructureRestrictionsInValueHelp",
		ASYNC_METADATA_BATCH_REQUEST : "AsyncMetadataBatchRequest",
		HIERARCHY_VIRTUAL_ROOT_NODE : "HierarchyVirtualRootNode",
		HIERARCHY_REST_NODE : "MetadataHierarchyRestNode",
		FORMULA_OPERATORS_CATALOG : "SupportsFormulaOperatorsCatalog"
	};
	oFF.InACapabilitiesProvider = function() {
	};
	oFF.InACapabilitiesProvider.prototype = new oFF.XObject();
	oFF.InACapabilitiesProvider.createMainCapabilities = function(apiVersion) {
		var supportedCapabilities = oFF.CapabilityContainer.create("main");
		var inaPlusCapability;
		var plusCap;
		var plusIterator;
		var inaMinusCapability;
		var minusCap;
		var minusIterator;
		supportedCapabilities
				.addCapability(oFF.InACapabilities.ATTRIBUTE_HIERARCHY);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.DATASOURCE_AT_SERVICE);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.VARIABLE_RE_SUBMIT);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CLIENT_CAPABILITIES);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.METADATA_SERVICE);
		supportedCapabilities.addCapability(oFF.InACapabilities.OBTAINABILITY);
		supportedCapabilities.addCapability(oFF.InACapabilities.READ_MODE);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.RESPONSE_FIXED_ATTRIBUTE_SEQUENCE);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.SERVER_STRUCTURE_NAMES);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.STATEFUL_SERVER);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.STATEFUL_DATA_PROVIDER);
		supportedCapabilities.addCapability(oFF.InACapabilities.SET_OPERAND);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.ENCODED_RESULTSET);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.COMPLEX_FILTERS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.UNIFIED_REQUEST_SYNTAX);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.SEMANTICAL_ERROR_TYPE);
		supportedCapabilities.addCapability(oFF.InACapabilities.EXT_HIERARCHY);
		supportedCapabilities.addCapability(oFF.InACapabilities.SAP_DATE);
		supportedCapabilities.addCapability(oFF.InACapabilities.CUMMULATIVE);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.EXTENDED_DIMENSION_TYPES);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.NEW_VALUES_IMPLICIT_UNLOCK);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.NEW_VALUES_EXTENDED_FORMAT);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.HIERARCHY_NAME_VARIABLE);
		supportedCapabilities.addCapability(oFF.InACapabilities.EXCEPTIONS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.EXCEPTION_SETTINGS);
		supportedCapabilities.addCapability(oFF.InACapabilities.RUN_AS_USER);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.QUERY_DATA_CELLS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.RESULTSET_CELL_VALUE_TYPES);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.METADATA_DIMENSION_GROUP);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.RESULTSET_CELL_FORMAT_STRING);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.UNIQUE_ATTRIBUTE_NAMES);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.METADATA_IS_DISPLAY_ATTRIBUTE);
		supportedCapabilities.addCapability(oFF.InACapabilities.FAST_PATH);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.ATTRIBUTE_HIERARCHY_UNIQUE_FIELDS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.HIERARCHY_KEY_TEXT_NAME);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.HIERARCHY_NAVIGATION_COUNTER);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.ATTRIBUTE_HIERARCHY_HIERARCHY_FIELDS);
		supportedCapabilities.addCapability(oFF.InACapabilities.SUPPLEMENTS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.USE_EPM_VERSION);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.DIMENSION_KIND_EPM_VERSION);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.DIMENSION_KIND_CHART_OF_ACCOUNTS);
		supportedCapabilities.addCapability(oFF.InACapabilities.SP9);
		supportedCapabilities.addCapability(oFF.InACapabilities.TECHNICAL_AXIS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.DIMENSION_VALUEHELP_PROPERTY);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.PAGING_TUPLE_COUNT_TOTAL);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.ZERO_SUPPRESSION);
		supportedCapabilities.addCapability(oFF.InACapabilities.MANUAL_INPUT);
		supportedCapabilities.addCapability(oFF.InACapabilities.MULTI_SOURCE);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.MEMBER_VISIBILITY);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.RESULTSET_INTERVAL);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.REPORT_REPORT_INTERFACE);
		supportedCapabilities.addCapability(oFF.InACapabilities.HIERARCHY_PATH);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.METADATA_HIERARCHY_STRUCTURE);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.METADATA_HIERARCHY_LEVELS);
		supportedCapabilities.addCapability(oFF.InACapabilities.EXTENDED_SORT);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CUSTOM_DIMENSION_MEMBER_EXECUTION_STEP);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.HIERARCHY_PATH_UNIQUE_NAME);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.HIERARCHY_DATA_AND_EXCLUDING_FILTERS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.HIERARCHY_SELECTION_AS_FLAT_SELECTION);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.VISIBILITY_FILTER);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CELL_VALUE_OPERAND);
		supportedCapabilities.addCapability(oFF.InACapabilities.SPATIAL_FILTER);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.SPATIAL_FILTER_WITH_SRID);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.SPATIAL_TRANSFORMATIONS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.SPATIAL_CLUSTERING);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.HIERARCHY_TRAPEZOID_FILTER);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.SUBMIT_RETURNS_VARIABLE_VALUES);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.EXTENDED_DIMENSIONS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.EXTENDED_DIMENSIONS_FIELD_MAPPING);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.EXTENDED_DIMENSIONS_JOIN_COLUMNS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.EXTENDED_DIMENSIONS_OUTER_JOIN);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.EXTENDED_DIMENSIONS_SKIP);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.METADATA_DEFAULT_RESULT_ALIGNMENT_BOTTOM);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.IGNORE_EXTERNAL_DIMENSIONS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.RETURN_RESTRICTED_AND_CALCULATED_MEMBERS_IN_READ_MODE_BOOKED);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.PERSIST_RESULTSET);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.RESTRICTED_MEMBERS_CONVERT_TO_FLAT_SELECTION);
		supportedCapabilities.addCapability(oFF.InACapabilities.VARIABLES);
		supportedCapabilities.addCapability(oFF.InACapabilities.TOTALS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.ENCODED_RESULTSET_2);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.RESULTSET_STATE);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.RESULTSET_CELL_NUMERIC_SHIFT);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.RESULTSET_CELL_DATA_TYPE);
		supportedCapabilities.addCapability(oFF.InACapabilities.ORDER_BY);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.METADATA_REPOSITORY_SUFFIX);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.METADATA_CUBE_QUERY);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.MAX_RESULT_RECORDS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.IGNORE_UNIT_OF_NULL_IN_AGGREGATION);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.SET_NULL_CELLS_UNIT_TYPE);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.DIMENSION_FILTER);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.DIMENSION_F4_SELECTION_WITH_COMPOUNDMENT);
		supportedCapabilities.addCapability(oFF.InACapabilities.CUBE_BLENDING);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CUBE_BLENDING_AGGREGATION);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.REMOTE_BLENDING);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CUBE_BLENDING_CUSTOM_MEMBERS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CUBE_BLENDING_MEMBER_SORTING);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CUBE_BLENDING_OUT_OF_CONTEXT);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CUBE_BLENDING_PROPERTIES);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CUBE_BLENDING_READ_MODE);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CUBE_BLENDING_CUSTOM_MEMBERS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.METADATA_DATA_CATEGORY);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.EXPAND_BOTTOM_UP);
		supportedCapabilities.addCapability(oFF.InACapabilities.CONDITIONS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.AGGREGATION_NOP_NULL);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.AGGREGATION_NOP_NULL_ZERO);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.EXCEPTION_AGGREGATION_DIMENSIONS_AND_FORMULAS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.EXCEPTION_AGGREGATION_AVGNULL_SELECTION_MEMBER);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.EXCEPTION_AGGREGATION_COUNTNULL_SELECTION_MEMBER);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.STATISTICAL_AGGREGATIONS);
		supportedCapabilities.addCapability(oFF.InACapabilities.MDS_EXPRESSION);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.TOTALS_AFTER_VISIBILITY_FILTER);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.DEFINITION_RETURNS_VARIABLE_VALUES);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.HIERARCHY_NAVIGATION_DELTA_MODE);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.FLAT_KEY_ON_HIERARCHY_DISPLAY);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.DATA_CELL_MIXED_VALUES);
		supportedCapabilities.addCapability(oFF.InACapabilities.VALUES_ROUNDED);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.ATTRIBUTE_VALUE_LOOKUP);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.METADATA_HIERARCHY_UNIQUE_NAME);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CANCEL_RUNNING_REQUESTS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CALCULATED_KEYFIGURES);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.RESTRICTED_KEYFIGURES);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CURRENT_MEMBER_FILTER_EXTENSION);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.RETURN_ERROR_FOR_INVALID_QUERYMODEL);
		supportedCapabilities.addCapability(oFF.InACapabilities.ORIGINAL_TEXTS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CUSTOM_DIMENSION_FILTER);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.AVERAGE_COUNT_IGNORE_NULL_ZERO);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.MDS_LIKE_PAGING);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.HIERARCHY_LEVEL_OFFSET_FILTER);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CE_SCENARIO_PARAMS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.METADATA_DIMENSION_CAN_BE_AGGREGATED);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.INITIAL_DRILL_LEVEL_RELATIVE);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.MDM_HIERARCHY_WITH_DRILL_LEVEL);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.NO_HIERARCHY_PATH_ON_FLAT_DIMENSIONS);
		supportedCapabilities.addCapability(oFF.InACapabilities.DATA_REFRESH);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.RESULTSET_AXIS_TYPE);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.EPM_RESPONSE_LIST_SHARED_VERSIONS);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.VARIABLE_VARIANTS);
		supportedCapabilities.addCapability(oFF.InACapabilities.READ_MODES_V2);
		supportedCapabilities.addCapability(oFF.InACapabilities.LIST_REPORTING);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.DIMENSION_TYPE_TIME);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.UNIVERSAL_DISPLAY_HIERARCHIES);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CATALOG_SERVICE_V20);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.RETURNED_DATA_SELECTION);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.KEYFIGURE_HIERARCHIES);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.EXTENDED_DIMENSIONS_JOIN_CARDINALITY);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.METADATA_DATASOURCE_DEFINITION_VALIDATION);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.DATA_REFRESH_AND_DATA_TOPICALITY);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.EXTENDED_VARIABLE_DEFINITION);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.INPUT_READINESS_STATES);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CUSTOM_MEASURE_SORTORDER);
		supportedCapabilities.addCapability(oFF.InACapabilities.CUSTOM_SORT);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.CARTESIAN_FILTER_INTERSECT);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.SUPPRESS_KEYFIGURE_CALCULATION);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.IGNORE_UNIT_OF_ZERO_VALUE_IN_AGGREGATION);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.VARIANCE_OPERATOR);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.MD_DS_DEF_VAL_EXPOSE_DS);
		supportedCapabilities.addCapability(oFF.InACapabilities.CLIENT_INFO);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.EXTENDED_DIMENSION_CHANGE_DEFAULT_RENAMING_AND_DESCRIPTION);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.EXTENDED_DIMENSION_COPY_ALL_HIERARCHIES);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.FIX_METADATA_HIERARCHY_ATTRIBUTES);
		supportedCapabilities.addCapability(oFF.InACapabilities.EXCEPTIONS_V2);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.QUERY_CURRENCY_TRANSLATION);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.STRUCTURE_RESTRICTIONS_IN_VALUE_HELP);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.ASYNC_METADATA_BATCH_REQUEST);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.HIERARCHY_VIRTUAL_ROOT_NODE);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.HIERARCHY_REST_NODE);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.SPATIAL_CHOROPLETH);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.INA_CURRENT_MEMBER);
		supportedCapabilities
				.addCapability(oFF.InACapabilities.FORMULA_OPERATORS_CATALOG);
		if (apiVersion >= oFF.XVersion.V89_DIMENSION_HIERARCHY_LEVELS_BW) {
			supportedCapabilities
					.addCapability(oFF.InACapabilities.DIMENSION_HIERARCHY_LEVELS);
			supportedCapabilities
					.addCapability(oFF.InACapabilities.MDM_HIERARCHY_DRILL_LEVEL);
		}
		if (apiVersion >= oFF.XVersion.V90_CALCULATED_DIMENSIONS_REL) {
			supportedCapabilities
					.addCapability(oFF.InACapabilities.CALCULATED_DIMENSION);
			supportedCapabilities
					.addCapability(oFF.InACapabilities.PLANNING_ON_CALCULATED_DIMENSION);
		}
		if (apiVersion >= oFF.XVersion.V91_MEASURE_BASENAME) {
			supportedCapabilities
					.addCapability(oFF.InACapabilities.METADATA_BASE_MEASURE_NAME);
		}
		if (apiVersion >= oFF.XVersion.V93_PRESENTATION_LENGTH) {
			supportedCapabilities
					.addCapability(oFF.InACapabilities.PRESENTATION_LENGTH);
		}
		if (apiVersion >= oFF.XVersion.V94_VISUAL_AGGREGATION) {
			supportedCapabilities
					.addCapability(oFF.InACapabilities.VISUAL_AGGREGATION);
		}
		if (apiVersion >= oFF.XVersion.V100_HIERARCHY_LEVEL) {
			supportedCapabilities
					.addCapability(oFF.InACapabilities.RESULTSET_HIERARCHY_LEVEL);
		}
		if (apiVersion >= oFF.XVersion.V102_UNIVERSAL_DISPLAY_HIERARCHY_ZERO_BASED) {
			supportedCapabilities
					.addCapability(oFF.InACapabilities.UNIVERSAL_DISPLAY_HIERARCHY_ZERO_BASED);
		}
		if (apiVersion >= oFF.XVersion.V106_CUBE_CACHE) {
			supportedCapabilities.addCapability(oFF.InACapabilities.CUBE_CACHE);
		}
		if (apiVersion >= oFF.XVersion.V107_EXT_KEYFIGURE_PROPERTIES) {
			supportedCapabilities
					.addCapability(oFF.InACapabilities.EXT_KEYFIGURE_PROPERTIES);
		}
		if (apiVersion >= oFF.XVersion.V109_NUMBER_AS_STRING) {
			supportedCapabilities
					.addCapability(oFF.InACapabilities.NUMBER_AS_STRING);
		}
		if (apiVersion >= oFF.XVersion.V110_ABSOLUTE_HIERARCHY_LEVEL) {
			supportedCapabilities
					.addCapability(oFF.InACapabilities.RESULTSET_HIERARCHY_LEVEL);
		}
		if (apiVersion >= oFF.XVersion.V111_QDATA_CELL_MODEL_DEFAULTS) {
			supportedCapabilities
					.addCapability(oFF.InACapabilities.QDATA_CELL_MODEL_DEFAULTS);
		}
		inaPlusCapability = oFF.XEnvironment.getInstance().getVariable(
				"com.oFF.ina.inacapplus");
		if (oFF.notNull(inaPlusCapability)) {
			plusCap = oFF.XStringTokenizer.splitString(inaPlusCapability, ",");
			plusIterator = plusCap.getIterator();
			while (plusIterator.hasNext()) {
				supportedCapabilities.addCapability(plusIterator.next());
			}
		}
		inaMinusCapability = oFF.XEnvironment.getInstance().getVariable(
				"com.oFF.ina.inacapminus");
		if (oFF.notNull(inaMinusCapability)) {
			minusCap = oFF.XStringTokenizer
					.splitString(inaMinusCapability, ",");
			minusIterator = minusCap.getIterator();
			while (minusIterator.hasNext()) {
				supportedCapabilities.remove(minusIterator.next());
			}
		}
		return supportedCapabilities;
	};
	oFF.InACapabilitiesProvider.prototype.m_clientMainCapabilities = null;
	oFF.InACapabilitiesProvider.prototype.m_serverMainCapabilities = null;
	oFF.InACapabilitiesProvider.prototype.m_serverBetaCapabilities = null;
	oFF.InACapabilitiesProvider.prototype.m_activeMainCapabilities = null;
	oFF.InACapabilitiesProvider.prototype.getClientMainCapabilities = function() {
		return this.m_clientMainCapabilities;
	};
	oFF.InACapabilitiesProvider.prototype.getServerBetaCapabilities = function() {
		return this.m_serverBetaCapabilities;
	};
	oFF.InACapabilitiesProvider.prototype.getServerMainCapabilities = function() {
		return this.m_serverMainCapabilities;
	};
	oFF.InACapabilitiesProvider.prototype.getActiveMainCapabilities = function() {
		var clientCapabilities;
		var serverCapabilities;
		if (oFF.isNull(this.m_activeMainCapabilities)) {
			clientCapabilities = this.getClientMainCapabilities();
			serverCapabilities = this.getServerMainCapabilities();
			if (oFF.notNull(clientCapabilities)
					&& oFF.notNull(serverCapabilities)) {
				this.m_activeMainCapabilities = serverCapabilities
						.intersect(clientCapabilities);
			}
		}
		return this.m_activeMainCapabilities;
	};
	oFF.InACapabilitiesProvider.prototype.getServerMainCapability = function(
			capabilityName) {
		return this.getServerMainCapabilities().getByKey(capabilityName);
	};
	oFF.InACapabilitiesProvider.prototype.exportActiveMainCapabilities = function(
			requestStructure) {
		var list = this.exportActiveMainCapabilitiesAsList();
		if (oFF.notNull(list)) {
			requestStructure.put("Capabilities", list);
		}
		return list;
	};
	oFF.InACapabilitiesProvider.prototype.exportActiveMainCapabilitiesAsList = function() {
		var activeMainCapabilities = this.getActiveMainCapabilities();
		var sortedCapabilityNames;
		var intersectCapabilities;
		if (oFF.isNull(activeMainCapabilities)) {
			return null;
		}
		if (!activeMainCapabilities
				.containsKey(oFF.InACapabilities.CLIENT_CAPABILITIES)) {
			return null;
		}
		sortedCapabilityNames = activeMainCapabilities
				.getSortedCapabilityNames();
		intersectCapabilities = oFF.PrFactory.createList();
		intersectCapabilities.addAllStrings(sortedCapabilityNames);
		return intersectCapabilities;
	};
	oFF.InACapabilitiesProvider.prototype.releaseObject = function() {
		this.m_clientMainCapabilities = oFF.XObjectExt
				.release(this.m_clientMainCapabilities);
		this.m_serverBetaCapabilities = oFF.XObjectExt
				.release(this.m_serverBetaCapabilities);
		this.m_serverMainCapabilities = oFF.XObjectExt
				.release(this.m_serverMainCapabilities);
		this.m_activeMainCapabilities = oFF.XObjectExt
				.release(this.m_activeMainCapabilities);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.InACapabilitiesProvider.prototype.toString = function() {
		var buffer = oFF.XStringBuffer.create();
		if (oFF.notNull(this.m_serverMainCapabilities)) {
			buffer.appendLine("=== Server Main Capabilities ===");
			buffer.appendLine(this.m_serverMainCapabilities.toString());
		}
		if (oFF.notNull(this.m_clientMainCapabilities)) {
			buffer.appendLine("=== Client Main Capabilities ===");
			buffer.appendLine(this.m_clientMainCapabilities.toString());
		}
		if (oFF.notNull(this.m_activeMainCapabilities)) {
			buffer.appendLine("=== Active Main Capabilities ===");
			buffer.appendLine(this.m_activeMainCapabilities.toString());
		}
		return buffer.toString();
	};
	oFF.InAConstants = {
		QY_INFO_OBJ_TYPE : "InfoobjType",
		QY_1ROWCOUNT : "1ROWCOUNT",
		VA_ABAP_TRUE : "X",
		VA_ABAP_FALSE : "",
		VA_ABAP_UNKNOWN : "U",
		QY_ACTIONS : "Actions",
		QY_ACTIVE : "Active",
		QY_ACTIVITIES : "Activities",
		QY_ACTION : "Action",
		VA_ACTION_SAVE_LINE : "SaveLine",
		VA_ACTION_ACTIVATE_LINE : "ActivateLine",
		VA_ACTION_NEW_LINE : "NewLine",
		VA_ACTION_DELETE_LINE : "DeleteLine",
		VA_ACTION_NEW_VALUES : "NewValues",
		VA_ACTION_CHECK_DUPLICATES : "CheckDuplicates",
		QY_ACTION_ID : "ActionId",
		QY_ACTION_DESCRIPTION : "ActionDescription",
		QY_ACTION_PARAMETERS : "ActionParameters",
		QY_ALERTLEVEL : "AlertLevel",
		QY_ALIAS : "Alias",
		QY_ALIAS_NAME : "AliasName",
		QY_ALIAS_MAPPING : "AliasMapping",
		QY_AUDIT : "Audit",
		QY_AUTHORIZATION : "Authorization",
		QY_AUTHORIZATIONS : "Authorizations",
		QY_AUTO_GROUP : "AutoGroup",
		QY_AGGREGATION : "Aggregation",
		QY_AGGREGATION_GROUPS : "AggregationGroups",
		QY_AGGREGATION_MAP : "AggregationMap",
		QY_AGGREGATION_TYPES : "AggregationTypes",
		VA_AGG_AVERAGE : "AVERAGE",
		VA_AGG_COUNT : "COUNT",
		VA_AGG_COUNT_DISTINCT : "COUNT_DISTINCT",
		VA_AGG_FIRST : "FIRST",
		VA_AGG_LAST : "LAST",
		VA_AGG_MAX : "MAX",
		VA_AGG_MIN : "MIN",
		VA_AGG_RANK : "RANK",
		VA_AGG_RANK_DENSE : "RANK_DENSE",
		VA_AGG_RANK_OLYMPIC : "RANK_OLYMPIC",
		VA_AGG_RANK_PERCENTILE : "RANK_PERCENTILE",
		VA_AGG_RANK_PERCENT : "RANK_PERCENT",
		VA_AGG_SUM : "SUM",
		VA_AGG_STANDARD_DEVIATION : "STANDARD_DEVIATION",
		VA_AGG_VARIANCE : "VARIANCE",
		VA_AGG_NOP_NULL : "NOPNULL",
		VA_AGG_NOP_NULL_ZERO : "NOPNULLZERO",
		VA_AGG_AVERAGE_NULL : "AVERAGENULL",
		VA_AGG_AVERAGE_NULL_ZERO : "AVERAGENULLZERO",
		VA_AGG_COUNT_NULL : "COUNTNULL",
		VA_AGG_COUNT_NULL_ZERO : "COUNTNULLZERO",
		VA_AGG_MEDIAN : "MEDIAN",
		VA_AGG_MEDIAN_NULL : "MEDIANNULL",
		VA_AGG_MEDIAN_NULL_ZERO : "MEDIANNULLZERO",
		VA_AGG_FIRST_QUARTILE : "1STQUARTILE",
		VA_AGG_FIRST_QUARTILE_NULL : "1STQUARTILENULL",
		VA_AGG_FIRST_QUARTILE_NULL_ZERO : "1STQUARTILENULLZERO",
		VA_AGG_THIRD_QUARTILE : "3RDQUARTILE",
		VA_AGG_THIRD_QUARTILE_NULL : "3RDQUARTILENULL",
		VA_AGG_THIRD_QUARTILE_NULL_ZERO : "3RDQUARTILENULLZERO",
		VA_AGG_OUTLIERS : "OUTLIERS",
		VA_AGG_OUTLIERS_NULL : "OUTLIERSNULL",
		VA_AGG_OUTLIERS_NULL_ZERO : "OUTLIERSNULLZERO",
		QY_AGGREGATION_DIMENSION : "AggregationDimension",
		QY_AGGREGATION_LEVEL : "AggregationLevel",
		QY_AGGREGATION_LEVEL_CAT : "AggregationLevelCat",
		QY_AGLV_NAME : "AglvName",
		QY_AGGR_LEVEL_NAME : "AggrLevelName",
		QY_AGGR_LEVEL_TECH_NAME : "AggrLevelTechName",
		QY_AGGR_LEVEL_TYPE : "AggrLevelType",
		QY_AGGR_LEVEL_ACTIVE_FLAG : "AggrLevelActiveFlag",
		QY_AGGR_LEVEL_OBJ_STAT : "AggrLevelObjStat",
		QY_ANALYTICAL_INDEX : "AnalyticalIndex",
		QY_ANALYTICS : "Analytics",
		QY_ATTRIBUTE : "Attribute",
		QY_ATTRIBUTE_HIERARCHY : "AttributeHierarchy",
		QY_ATTRIBUTE_MAPPINGS : "AttributeMappings",
		QY_ATTRIBUTE_NAME : "AttributeName",
		QY_ATTRIBUTE_NAMES : "AttributeNames",
		QY_ATTRIBUTE_SETTINGS : "AttributeSettings",
		QY_ATTRIBUTE_TYPE : "AttributeType",
		QY_ATTRIBUTE_VALUE : "AttributeValue",
		QY_ATTRIBUTES : "Attributes",
		QY_ATTRIBUTES_MD : "AttributesMd",
		QY_AXIS : "Axis",
		QY_AXIS_DEFAULT : "AxisDefault",
		QY_AXIS_CONSTRAINTS : "AxisConstraints",
		VA_AXIS_ROWS : "Rows",
		VA_AXIS_COLS : "Columns",
		VA_AXIS_FREE : "Free",
		VA_AXIS_DYNAMIC : "Dynamic",
		VA_AXIS_FILTER : "Filter",
		VA_AXIS_NONE : "None",
		VA_AXIS_REPOSITORY : "Repository",
		VA_AXIS_TECHNICAL : "Technical",
		VA_AXIS_VIRTUAL : "Virtual",
		QY_AXES : "Axes",
		QY_AXES_LAYOUT : "AxesLayout",
		QY_BACKEND_CELL_LOCKING : "BackendCellLocking",
		QY_BASE_DATA_SOURCE : "BaseDataSource",
		QY_BASE_DIMENSION : "BaseDimension",
		QY_BASIC_MEMBERS : "BasicMembers",
		QY_BW_MASTER_DATA : "BWMasterData",
		QY_BREAK_GROUP : "BreakGroup",
		QY_BREAK_GROUP_LIST : "BreakGroupList",
		QY_COMPONENT_TAGS : "ComponentTags",
		QY_COMPONENT_TAGS_KEY : "KEY",
		QY_COMPONENT_TAGS_VALUE : "VALUE",
		QY_CALLS : "Calls",
		QY_CAN_BE_AGGREGATED : "CanBeAggregated",
		QY_CAPABILITY : "Capability",
		QY_CAPABILITIES : "Capabilities",
		QY_CAPABILITIES_DEV : "CapabilitiesDev",
		QY_CELL_LOCKING : "CellLocking",
		QY_CELL_DATA_TYPE : "CellDataType",
		QY_CELL_DIMENSION_REFERENCE : "CellDimensionReference",
		QY_CELL_VALUE_OPERAND : "CellValueOperand",
		QY_CELL_VALUE_TYPE : "CellValueType",
		QY_CELL_VALUE_TYPES : "CellValueTypes",
		QA_CELL_VALUE_TYPE_DOUBLE : 0,
		QA_CELL_VALUE_TYPE_PERCENT : 1,
		QA_CELL_VALUE_TYPE_DATE : 2,
		QA_CELL_VALUE_TYPE_TIME : 3,
		QA_CELL_VALUE_TYPE_STRING : 4,
		QA_CELL_VALUE_TYPE_AMOUNT : 5,
		QA_CELL_VALUE_TYPE_QUANTITY : 6,
		QA_CELL_VALUE_TYPE_PRICE : 7,
		QA_CELL_VALUE_TYPE_DIMENSION_MEMBER : 8,
		QA_CELL_VALUE_TYPE_INTEGER : 9,
		QA_CELL_VALUE_TYPE_DEC_FLOAT : 10,
		QA_CELL_VALUE_TYPE_DATE_TIME : 11,
		QA_CELL_VALUE_TYPE_TIMESTAMP : 12,
		QA_CELL_VALUE_TYPE_BOOL : 13,
		QA_CELL_VALUE_TYPE_GEOMETRY : 14,
		QY_CHANGE_COUNTER : "ChangeCounter",
		QY_CHECK_MASTER_DATA : "CheckMasterData",
		QY_CLEANSING : "Cleansing",
		QY_CLEANSING_PERFORMED_ACTIONS : "PerformedActions",
		QY_CLEANSING_ACTIONS : "Actions",
		QY_CLEANSING_ACTION : "Action",
		QY_CLEANSING_VALUE : "Value",
		QY_CLEANSING_VALUE_TO_BE_REPLACED : "ValueToBeReplaced",
		QY_CLIENT : "Client",
		QY_CLIENT_TRACES : "ClientTraces",
		QY_COMMAND : "Command",
		QY_COMMAND_RESULTS : "CommandResults",
		QY_COMMANDS : "Commands",
		QY_CONDITIONS : "Conditions",
		VA_CONDITIONS_ACTIVE : "Active",
		VA_CONDITIONS_IS_USED : "IsUsed",
		VA_CONDITIONS_REPO_IS_BACKEND_CONDITION : "IsBackendCondition",
		VA_CONDITIONS_DESCRIPTION : "Description",
		VA_CONDITIONS_NAME : "Name",
		QY_CONDITIONS_ON_DISABLED : "OnDisabled",
		VA_CONDITIONS_ON_DISABLED_WARNING : "Warning",
		VA_CONDITIONS_ON_DISABLED_ERROR : "Error",
		VA_CONDITIONS_EVALUATE_ON_DIMENSIONS : "EvaluateOnDimensions",
		QY_CONDITIONS_EVALUATE_ON_DIMENSIONS_LIST : "EvaluateOnDimensionsList",
		QY_CONDITIONS_THRESHOLD : "Threshold",
		QY_CONDITIONS_MEASURE_COORDINATE : "MeasureCoordinate",
		VA_CONDITIONS_DIMENSION_NAME : "DimensionName",
		VA_CONDITIONS_MEMBER_NAME : "MemberName",
		VA_CONDITIONS_COMPARISON : "Comparison",
		VA_CONDITIONS_LOW : "Low",
		VA_CONDITIONS_LOW_IS : "LowIs",
		VA_CONDITIONS_HIGH : "High",
		VA_CONDITIONS_HIGH_IS : "HighIs",
		QY_COLLATOR : "Collator",
		QY_CONSTANT : "Constant",
		QY_CONTENT : "Content",
		QY_CONTENT_DESCRPTION : "ContentDescription",
		QY_CONTENT_LOCATION : "ContentLocation",
		QY_CONTENT_TYPE : "ContentType",
		QY_CONTEXT : "Context",
		QY_CONV_EXIT : "ConvExit",
		VA_CONTEXT_ANALYTICS : "Analytics",
		VA_CONTEXT_LIST_REPORTING : "ListReporting",
		VA_CONTEXT_PLANNING : "Planning",
		QY_CONVERSION : "Conversion",
		QY_CONVERSION_ROUTINE : "ConversionRoutine",
		QY_CASE_SENSITIVE : "CaseSensitive",
		QY_CTYPE : "CType",
		VA_CTYPE_AXIS : "Axis",
		VA_CTYPE_CONDITION : "Condition",
		VA_CTYPE_QUERY_MODEL : "QueryModel",
		VA_CTYPE_FILTER : "Filter",
		VA_CTYPE_FILTER_EXPRESSION : "FilterExpression",
		VA_CTYPE_FILTER_CARTESIAN_PRODUCT : "FilterCartesianProduct",
		VA_CTYPE_FILTER_CARTESIAN_LIST : "FilterCartesianList",
		VA_CTYPE_FILTER_OPERATION : "FilterOperation",
		VA_CTYPE_FILTER_ALGEBRA : "FilterAlgebra",
		VA_CTYPE_MEMBER_RESTRICTED : "MemberRestricted",
		VA_CTYPE_DIMENSION_MEMBER_VARIABLE : "DimensionMemberVariable",
		VA_CTYPE_HIERARCHY_NODE_VARIABLE : "HierarchyNodeVariable",
		VA_CTYPE_CELL_VALUE_OPERAND : "CellValueOperand",
		VA_CTYPE_SORTING : "Sorting",
		VA_CTYPE_SORT_OPERATION : "SortOperation",
		VA_CTYPE_TOTALS : "Totals",
		VA_CTYPE_FIELD : "Field",
		VA_CTYPE_DIMENSION_MGR : "DimensionManager",
		VA_CTYPE_DIMENSION : "Dimension",
		VA_CTYPE_BASIC_MEASURE : "BasicMeasure",
		VA_CTYPE_MEMBERS : "Members",
		VA_CTYPE_FORMULA : "Formula",
		VA_CTYPE_DRILL_MANAGER : "DrillManager",
		QY_COMPARISON : "Comparison",
		VA_COMPARISON_EQUAL : "=",
		VA_COMPARISON_EQUAL2 : "EQ",
		VA_COMPARISON_EQUAL3 : "EQUAL",
		VA_COMPARISON_EQUAL4 : "EQUALS",
		VA_COMPARISON_NOT_EQUAL : "<>",
		VA_COMPARISON_GREATER : ">",
		VA_COMPARISON_LESS : "<",
		VA_COMPARISON_GREATER_EQUAL : ">=",
		VA_COMPARISON_LESS_EQUAL : "<=",
		VA_COMPARISON_MATCH : "MATCH",
		VA_COMPARISON_NOT_MATCH : "NOT_MATCH",
		VA_COMPARISON_SEARCH : "SEARCH",
		VA_COMPARISON_LIKE : "LIKE",
		VA_COMPARISON_IS_NULL : "IS_NULL",
		VA_COMPARISON_IS_NULL2 : "IS NULL",
		VA_COMPARISON_BETWEEN : "BETWEEN",
		VA_COMPARISON_NOTBETWEEN : "NOTBETWEEN",
		VA_COMPARISON_NOT_BETWEEN : "NOT_BETWEEN",
		VA_COMPARISON_BETWEEN_EXCLUDING : "BETWEEN_EXCLUDING",
		VA_COMPARISON_NOT_BETWEEN_EXCLUDING : "NOT_BETWEEN_EXCLUDING",
		VA_COMPARISON_FUZZY : "FUZZY",
		VA_COMPARISON_ALL : "ALL",
		VA_COMPARISON_AGGREGATED : "AGGREGATED",
		VA_COMPARISON_NON_AGGREGATED : "NON-AGGREGATED",
		VA_COMPARISON_SPATIAL_CONTAINS : "CONTAINS",
		VA_COMPARISON_SPATIAL_COVERS : "COVERS",
		VA_COMPARISON_SPATIAL_CROSSES : "CROSSES",
		VA_COMPARISON_SPATIAL_DISJOINT : "DISJOINT",
		VA_COMPARISON_SPATIAL_OVERLAPS : "OVERLAPS",
		VA_COMPARISON_SPATIAL_TOUCHES : "TOUCHES",
		VA_COMPARISON_SPATIAL_INTERSECTS : "INTERSECTS",
		VA_COMPARISON_SPATIAL_INTERSECT_RECT : "INTERSECT_RECT",
		VA_COMPARISON_SPATIAL_INTERSECTS_RECT : "INTERSECTS_RECT",
		VA_COMPARISON_SPATIAL_WITHIN : "WITHIN",
		VA_COMPARISON_SPATIAL_WITHIN_DISTANCE : "WITHIN_DISTANCE",
		QY_CELL_ARRAY_SIZES : "CellArraySizes",
		QY_CELL_FORMAT : "CellFormat",
		QY_COLUMN : "Column",
		QY_COLUMN_FROM : "ColumnFrom",
		QY_COLUMN_TO : "ColumnTo",
		VA_CURRENT_MEMBER : "CurrentMember",
		QY_CODE : "Code",
		VA_CODE_AND : "And",
		VA_CODE_OR : "Or",
		VA_CODE_NOT : "Not",
		QY_CUBE : "Cube",
		QY_VIEW : "View",
		QY_CELLS : "Cells",
		QY_CELL_VALUES : "CellValues",
		QY_COMPOUNDING : "Compounding",
		QY_CONDITIONAL_TOTALS : "ConditionalTotals",
		QY_CONDITIONAL_TOTALS_LIST : "ConditionalTotalsList",
		QY_CONDITIONAL_VISIBILITY : "ConditionalVisibility",
		QY_CONFIG_LEVEL : "ConfigLevel",
		VA_CONFIG_LEVEL_NONE : "None",
		VA_CONFIG_LEVEL_QUERY : "Query",
		VA_CONFIG_LEVEL_AXIS : "Axis",
		VA_CONFIG_LEVEL_DIMENSION : "Dimension",
		QY_COORDINATES : "Coordinates",
		QY_CHANGEABLE : "Changegable",
		QY_CREATED_BY : "CreatedBy",
		QY_CREATED_ON : "CreatedOn",
		QY_CAPABILITY_EXCLUDING : "Excluding",
		QY_CAPABILITY_INCLUDING : "Including",
		QY_CAPABILITY_COMPARISON_GROUP : "ComparisonGroup",
		VA_CAPABILITY_COMPARISON_GROUP_SINGLE_VALUE : "SingleValue",
		VA_CAPABILITY_COMPARISON_GROUP_INTERVAL : "Interval",
		VA_CAPABILITY_COMPARISON_GROUP_RANGE : "Range",
		QY_CHILDREN : "Children",
		QY_CONVERT_TO_FLAT_SELECTION : "ConvertToFlatSelection",
		QY_CURRENCY : "Currency",
		QY_CURRENCY_REFERENCE : "CurrencyReference",
		QY_CUSTOM_PROPERTIES : "CustomProperties",
		QY_CUSTOM_DIMENSIONS : "CustomDimensions",
		QY_IS_BLENDING_SUBQUERY : "IsCubeBlendingSubquery",
		QY_IS_HIERARCHY_MANDATORY : "IsHierarchyMandatory",
		QY_CUBE_CACHE_WITH_ID : "cube_cache_with_id",
		QY_DATA_SOURCE : "DataSource",
		QY_DATA_SOURCES : "DataSources",
		QY_DATA : "Data",
		QY_DATA_PROVIDER : "DataProvider",
		QY_DATA_ENTRIES : "DataEntries",
		QY_DATA_ENTRY_ENABLED : "DataEntryEnabled",
		QY_DATA_ENTRY_MASK : "DataEntryMask",
		QY_DATA_LENGTH : "DataLength",
		QY_DATA_TYPE : "DataType",
		QY_DATA_AREA : "DataArea",
		QY_DATA_AREAS : "DataAreas",
		QY_DATA_AREA_DEFAULT : "DEFAULT",
		VA_DATA_TYPE_STRING : "String",
		VA_DATA_TYPE_INT : "Int",
		VA_DATA_TYPE_LONG : "Long",
		VA_DATA_TYPE_DOUBLE : "Double",
		VA_DATA_TYPE_NUMC : "Numc",
		VA_DATA_TYPE_CHAR : "Char",
		VA_DATA_TYPE_DATE : "Date",
		VA_DATA_TYPE_TIME : "Time",
		VA_DATA_TYPE_TIMESTAMP : "Timestamp",
		VA_DATA_TYPE_TIMESPAN : "Timespan",
		VA_DATA_TYPE_BOOL : "Bool",
		VA_DATA_TYPE_AMOUNT : "Amount",
		VA_DATA_TYPE_PROPERTIES : "Properties",
		VA_DATA_TYPE_STRUCTURE : "Structure",
		VA_DATA_TYPE_STRUCTURE_LIST : "StructureList",
		VA_DATA_TYPE_POINT : "Point",
		VA_DATA_TYPE_GEOMETRY : "Geometry",
		VA_DATA_TYPE_LANGUAGE : "Language",
		VA_DATA_TYPE_LINE_STRING : "LineString",
		VA_DATA_TYPE_DECIMAL_FLOAT : "DecimalFloat",
		VA_DATA_TYPE_VARIABLE : "Variable",
		VA_DATA_TYPE_CURRENT_MEMBER : "CurrentMember",
		VA_DATA_TYPE_UNIT : "Unit",
		VA_DATA_TYPE_CUKY : "Cuky",
		QY_DATE_FORMAT : "DateFormat",
		QY_0DATE_FROM : "0DATEFROM",
		QY_DATE_TO : "DateTo",
		QY_DECIMALS : "Decimals",
		QY_DECIMAL_DELIMITER : "DecimalDelimiter",
		QY_DEPENDENT_ATTRIBUTES : "DependentAttributes",
		QY_DELTA_ROW_COUNT : "DeltaRowCount",
		QY_DEFAULT_RESULT_SET_READ_MODE : "DefaultResultSetReadMode",
		QY_DEFAULT_SELECTOR_READ_MODE : "DefaultSelectorReadMode",
		QY_DEFAULT_VARIABLE_READ_MODE : "DefaultVariableReadMode",
		QY_DEFAULT_DISPLAY_KEY_ATTRIBUTE : "DefaultDisplayKeyAttribute",
		QY_DEFAULT_KEY_ATTRIBUTE : "DefaultKeyAttribute",
		QY_DEFAULT_RESULT_SET_ATTRIBUTES : "DefaultResultSetAttributes",
		QY_DEFAULT_RESULT_SET_ATTRIBUTES_MD : "DefaultResultSetAttributesMd",
		QY_DEFAULT_RESULT_SET_ATTRIBUTE_NODES : "DefaultResultSetAttributeNodes",
		QY_DEFAULT_RESULT_SET_ATTRIBUTE_NODES_MD : "DefaultResultSetAttributeNodesMd",
		QY_DEFAULT_SELECTED_DIMENSIONS : "DefaultSelectedDimensions",
		QY_DEFAULT_TEXT_ATTRIBUTE : "DefaultTextAttribute",
		QY_DETAILS : "Details",
		QY_DEPTH : "Depth",
		QY_DIGITS : "Digits",
		QY_DIMENSION_TYPE : "DimensionType",
		QY_DIMENSION_CONTEXT : "DimensionContext",
		QY_DIMENSION_GROUPS : "DimensionGroups",
		QY_DIMENSION_SETS : "DimensionSets",
		QY_DIMENSION_VISIBILITY : "Visibility",
		QY_DIMENSION_DEFAULT_MEMBER : "DefaultMember",
		VA_DIMENSION_TYPE_TIME : 1,
		VA_DIMENSION_TYPE_MEASURE_STRUCT : 2,
		VA_DIMENSION_TYPE_NON_STRUCT_C : 3,
		VA_DIMENSION_TYPE_CURRENCY : 4,
		VA_DIMENSION_TYPE_UNIT : 5,
		VA_DIMENSION_TYPE_SECONDARY_STRUCT : 6,
		VA_DIMENSION_TYPE_DATE : 7,
		VA_DIMENSION_TYPE_HIERARCHY_VERSION : 8,
		VA_DIMENSION_TYPE_HIERARCHY_NAME : 9,
		VA_DIMENSION_TYPE_GEO : 10,
		VA_DIMENSION_TYPE_VERSION : 11,
		VA_DIMENSION_TYPE_ACCOUNTS : 12,
		QY_DIMENSIONS : "Dimensions",
		QY_DIMENSION : "Dimension",
		QY_DIMENSION_NAME : "DimensionName",
		QY_DIMENSION_REFERENCE : "DimensionReference",
		QY_DIMENSION_MEMBERS_REFERENCES : "DimensionMemberReferences",
		QY_DEFAULT_HIERARCHY : "DefaultHierarchy",
		QY_DEFAULT_INPUT_MODE : "DefaultInputMode",
		QY_DESCRIPTION : "Description",
		QY_DEFINITION : "Definition",
		QY_DEFINING_CONTEXT : "DefiningContext",
		QY_DYNAMIC_FILTER : "DynamicFilter",
		QY_DIRECTION : "Direction",
		VA_DIRECTION_ASCENDING : "Asc",
		VA_DIRECTION_DESCENDING : "Desc",
		VA_DIRECTION_NONE : "None",
		QY_DISPLAY_LEVEL : "DisplayLevel",
		QY_DRILL_MEMBER : "DrillMember",
		QY_DRILL_CONTEXT_MEMBERS : "DrillContextMembers",
		QY_DRILL_LEVEL : "DrillLevel",
		QY_DRILL_STATE : "DrillState",
		QY_CHILD_COUNT : "ChildCount",
		VA_DRILL_STATE_LEAF : 1,
		VA_DRILL_STATE_COLLAPSED : 2,
		VA_DRILL_STATE_EXPANDED : 3,
		VA_DRILL_STATE_DRILLED : 4,
		VA_DRILL_STATE_LEAF_DRILLDOWN_ALLOWED : 100,
		VA_DRILL_STATE_LEAF_UDH_EXPAND_ALLOWED : 101,
		VA_DRILL_STATE_LEAF_UDH : 102,
		VA_DRILL_STATE_NODE_EXPAND_DRILLDOWN_ALLOWED : 103,
		QY_UNIVERSAL_DISPLAY_HIERARCHIES : "UniversalDisplayHierarchies",
		QY_DEFINED_HIERARCHIES : "DefinedHierarchies",
		QY_DIMENSION_NAMES : "DimensionNames",
		VA_DRILL_STATE_OP_COLLAPSED : "Collapsed",
		VA_DRILL_STATE_OP_EXPANDED : "Expanded",
		VA_DRILL_STATE_OP_DRILLED : "Drilled",
		QY_DEFAULT_RESULT_STRUCTURE : "DefaultResultStructure",
		QY_DIMENSION_IS_HIERARCHICAL : "isHierarchical",
		QY_DEPENDENT_OF_VARIABLE : "DependentOfVariable",
		QY_DUE_DATE : "DueDate",
		QY_DUE_DATE_IS : "DueDateIs",
		VA_DUE_TO_IS_VARIABLE : "Variable",
		QY_DISPLAY_KEY_ATTRIBUTE : "DisplayKeyAttribute",
		QY_DISPLAY_FORMAT : "DisplayFormat",
		VA_DISPLAY_FORMAT_DATE : "Date",
		VA_DISPLAY_FORMAT_TIME : "Time",
		VA_DISPLAY_FORMAT_DATETIME : "DateTime",
		QY_ENVIRONMENT : "Environment",
		QY_ELEMENTS : "Elements",
		QY_ENCODING : "Encoding",
		QY_ENABLED : "Enabled",
		QY_EXPAND_BOTTOM_UP : "ExpandBottomUp",
		QY_EXPERIMENTAL_FEATURES : "ExperimentalFeatures",
		QY_EXACTNESS : "Exactness",
		QY_EXECUTE_REQUEST_ON_OLD_RESULT_SET : "ExecuteRequestOnOldResultSet",
		QY_EXECUTED : "Executed",
		QY_EXPAND : "Expand",
		VA_EXPAND_CUBE : "Cube",
		VA_EXPAND_COMMAND : "Command",
		QY_EXCEPTION_AGGREGATION : "ExceptionAggregation",
		QY_EXCEPTION_AGGREGATIONS : "ExceptionAggregations",
		QY_EXCEPTION_AGGREGATION_DIMENSIONS : "ExceptionAggregationDimensions",
		QY_EXCEPTION : "Exception",
		QY_EXCEPTIONS : "Exceptions",
		QY_EXCEPTION_HEADER_SETTING : "ApplySettingsToHeader",
		QY_EXCEPTION_SETTING_INDEX : "ExceptionSettingIndex",
		QY_EVALUATE : "Evaluate",
		QY_EVALUATE_BEFORE_POST_AGGREGATION : "EvaluateBeforePostAggregation",
		QY_EVALUATE_DEFAULT : "EvaluateDefault",
		QY_EVALUATE_ON : "EvaluateOn",
		QY_EVALUATE_ALL_MEMBERS : "EvaluateAllMembers",
		QY_STRUCTURE_CONTEXT : "StructureContext",
		QY_DISPLAY_ON_OTHER_MEMBER : "DisplayOnOtherMember",
		VA_EXCEPTION_NORMAL : 0,
		VA_EXCEPTION_NULL : 1,
		VA_EXCEPTION_ZERO : 2,
		VA_EXCEPTION_UNDEFINED : 3,
		VA_EXCEPTION_OVERFLOW : 4,
		VA_EXCEPTION_NO_PRESENTATION : 5,
		VA_EXCEPTION_DIFF0 : 6,
		VA_EXCEPTION_ERROR : 7,
		VA_EXCEPTION_NO_AUTHORITY : 8,
		VA_EXCEPTION_MIXED_CURRENCIES_OR_UNITS : 9,
		VA_EXCEPTION_UNDEFINED_NOP : 10,
		QY_EXCEPTION_NAME : "ExceptionName",
		QY_EXCEPTION_ALERT_LEVEL : "ExceptionAlertLevel",
		QY_EXTENDED_SORT_TYPES : "ExtendedSortTypes",
		QY_EXTENDED_DIMENSIONS : "ExtendedDimensions",
		QY_EXECUTION_STEP : "ExecutionStep",
		VA_EXECUTION_STEP_CALCULATION_BEFORE_AGGREGATION : "CalculationBeforeAggregation",
		QY_EXPONENT : "Exp",
		QY_FIELD : "Field",
		QY_FIELDS : "Fields",
		QY_FIELD_DELIMITER : "FieldDelimiter",
		QY_FIELD_DEFAULTS : "FieldDefaults",
		VA_FIELD_DELIMITER_QUOTATION_MARK : '"',
		QY_FIELD_LAYOUT_TYPE : "FieldLayoutType",
		VA_FIELD_LAYOUT_TYPE_FIELD_BASED : "FieldBased",
		VA_FIELD_LAYOUT_TYPE_ATTRIBUTE_BASED : "AttributeBased",
		VA_FIELD_LAYOUT_TYPE_ATTRIBUTES_AND_PRESENTATIONS : "AttributesAndPresentations",
		QY_FIELD_LITERAL_VALUE : "FieldLiteralValue",
		QY_FIELD_RENAMING_MODE : "FieldRenamingMode",
		QY_FIELD_SETTINGS : "FieldSettings",
		QY_FILE_PATH : "FilePath",
		QY_FIRST_DATA_ROW : "FirstDataRow",
		QY_FIXED_FILTER : "FixedFilter",
		QY_FILTER : "Filter",
		QY_FILTER_ROOT : "FilterRoot",
		QY_FILTER_REPO : "FilterRepo",
		QY_FIELD_MAPPINGS : "FieldMappings",
		QY_FIELD_NAME : "FieldName",
		QY_FIELD_NAME_IN_REFERENCED_DATA : "FieldNameInReferencedData",
		QY_FIELD_VALUE_TYPE : "CalculatedDimensionFieldValueType",
		QY_FUNCTION : "Function",
		QY_FORMULA : "Formula",
		QY_FUNCTION_PARAM_LEVEL : "Level",
		QY_FUNCTION_PARAM_CONSTANT : "Constant",
		QY_FUNCTION_PARAM_MEMBER : "Member",
		QY_FUNCTION_PARAM_NO_VALUES_ABOVE_LEVEL : "NoValuesAboveLevel",
		QY_FUNCTION_PARAM_OFFSET_LOW : "OffsetLow",
		QY_FUNCTION_PARAM_OFFSET_HIGH : "OffsetHigh",
		QY_FUNCTION_PARAM_SHIFT : "Shift",
		QY_FUNCTION_PARAM_RANGE : "Range",
		QY_FORMULA_MEASURE : "FormulaMeasure",
		QY_FRACT_DIGITS : "FractDigits",
		QY_FILTER_CAPABILITY : "FilterCapability",
		QY_GENERATION_OF_SID_ALLOWED : "GenerationOfSIDAllowed",
		QY_GEOMETRY_OPERAND : "GeometryOperand",
		QY_GRIDS : "Grids",
		QY_GENERIC_SERVICE_DESCRIPTION : "GenericServiceDescription",
		QY_GEO_SHAPE_ATTRIBUTE : "GeoShapeAttribute",
		QY_GEO_POINT_ATTRIBUTE : "GeoPointAttribute",
		QY_GEO_LEVEL_ATTRIBUTE : "GeoLevelAttribute",
		QY_GEO_AREA_NAME_ATTRIBUTE : "TextAttribute",
		QY_HAS_CHANGED_DATA : "HasChangedData",
		QY_HAS_LEVEL_OFFSET : "HasLevelOffset",
		QY_HAS_DEPTH : "HasDepth",
		QY_HAS_OWNER : "HasOwner",
		QY_HEADER_ROW : "HeaderRow",
		QY_HIGH : "High",
		QY_HIGH_IS : "HighIs",
		QY_HIGH_SUPPLEMENTS : "HighSupplements",
		QY_HIERARCHIES : "Hierarchies",
		QY_HIERARCHIES_POSSIBLE : "HierarchiesPossible",
		QY_NUMBER_OF_HIERARCHIES : "NumberOfHierarchies",
		QY_HIERARCHY : "Hierarchy",
		QY_HIERACHY_BASE_DIMENSION : "HierachyBaseDimension",
		QY_HIERARCHY_BASE_DIMENSION : "HierarchyBaseDimension",
		QY_HIERARCHY_ACTIVE : "HierarchyActive",
		QY_HIERARCHY_DESCRIPTION : "HierarchyDescription",
		QY_HIERARCHY_MEMBER : "HierarchyMember",
		QY_HIERARCHY_NAVIGATION_DELTA_MODE : "HierarchyNavigationDeltaMode",
		QY_HIERARCHY_INTERVAL : "HierarchyInterval",
		QY_HIERARCHY_LIST : "HierarchyList",
		QY_HIERARCHY_NAME : "HierarchyName",
		QY_HIERARCHY_NAV_COUNTER : "HierarchyNavigationCounter",
		QY_HIERARCHY_NAVIGATIONS : "HierarchyNavigations",
		QY_HIERARCHY_PATH_ATTRIBUTE : "HierarchyPathAttribute",
		QY_HINTS : "Hints",
		VA_HIERARCHY_LEVEL_TYPE_REGULAR : 0,
		VA_HIERARCHY_LEVEL_TYPE_ALL : 1,
		VA_HIERARCHY_LEVEL_TYPE_TIME_YEAR : 20,
		VA_HIERARCHY_LEVEL_TYPE_TIME_HALFYEAR : 36,
		VA_HIERARCHY_LEVEL_TYPE_TIME_QUARTER : 68,
		VA_HIERARCHY_LEVEL_TYPE_TIME_MONTH : 132,
		VA_HIERARCHY_LEVEL_TYPE_TIME_WEEK : 260,
		VA_HIERARCHY_LEVEL_TYPE_TIME_DAY : 516,
		VA_HIERARCHY_LEVEL_TYPE_TIME_HOUR : 772,
		VA_HIERARCHY_LEVEL_TYPE_TIME_MINUTES : 1028,
		VA_HIERARCHY_LEVEL_TYPE_TIME_SECONDS : 2052,
		QY_HIERARCHY_PROPERTIES : "HierarchyProperties",
		QY_HIERARCHY_MAINTENANCE : "HierarchyMaintenance",
		QY_HIERARCHY_CREATION : "HierarchyCreation",
		QY_HIERARCHY_CREATION_BY_REFERENCE : "HierarchyCreationByReference",
		QY_HIERARCHY_UPDATE : "HierarchyUpdate",
		QY_HIERARCHY_COPY : "HierarchyCopy",
		QY_HIERARCHY_DELETION : "HierarchyDeletion",
		QY_HIERARCHY_SAVING : "HierarchySaving",
		QY_HIERARCHY_ACTIVATION : "HierarchyActivation",
		QY_HIERARCHY_INTERVALS : "HierarchyIntervals",
		QY_HIERARCHY_REVERSE_SIGN : "HierarchyReverseSign",
		QY_HIERARCHY_STRUCTURE_TIME_DEP : "HierarchyStructureTimeDep",
		QY_HIERARCHY_TIME_DEP : "HierarchyTimeDep",
		QY_HIERARCHY_VERSION_DEP : "HierarchyVersionDep",
		QY_HIERARCHY_EXTERNAL_DIMENSION : "HierarchyExternalDimension",
		QY_HIERARCHY_LOCAL_MAINTENANCE : "HierarchyLocalMaintenance",
		QY_HIERARCHY_LOCAL_CREATION : "HierarchyLocalCreation",
		QY_HIERARCHY_LOCAL_CREATION_BY_REFERENCE : "HierarchyLocalCreationByReference",
		QY_HIERARCHY_LOCAL_UPDATE : "HierarchyLocalUpdate",
		QY_HIERARCHY_LOCAL_COPY : "HierarchyLocalCopy",
		QY_HIERARCHY_LOCAL_DELETION : "HierarchyLocalDeletion",
		QY_HIERARCHY_LOCAL_SAVING : "HierarchyLocalSaving",
		QY_HIERARCHY_LOCAL_ACTIVATION : "HierarchyLocalActivation",
		QY_HIERARCHY_LOCAL_INTERVALS : "HierarchyLocalIntervals",
		QY_HIERARCHY_LOCAL_REVERSE_SIGN : "HierarchyLocalReverseSign",
		QY_HIERARCHY_LOCAL_STRUCTURE_TIME_DEP : "HierarchyLocalStructureTimeDep",
		QY_HIERARCHY_LOCAL_TIME_DEP : "HierarchyLocalTimeDep",
		QY_HIERARCHY_LOCAL_VERSION_DEP : "HierarchyLocalVersionDep",
		QY_HIERARCHY_LOCAL_EXTERNAL_DIMENSION : "HierarchyLocalExternalDimension",
		QY_HIERARCHY_KEY_ATTRIBUTE : "HierarchyKeyAttribute",
		QY_HIERARCHY_DISPLAY_KEY_ATTRIBUTE : "HierarchyDisplayKeyAttribute",
		QY_HIERARCHY_TEXT_ATTRIBUTE : "HierarchyTextAttribute",
		QY_HIERARCHY_MAINTAIN : "HierarchyMaintain",
		QY_HIERARCHY_AUTH : "HierarchyAuth",
		VA_HIERARCHY_TYPE_MD_IO : "1",
		VA_HIERARCHY_TYPE_LH : "8",
		QY_HIERARCHY_NAVIGATION_ATTRIBUTE : "HierarchyNavigationAttribute",
		QY_ID : "Id",
		QY_IGNORE_EXTERNAL_DIMENSIONS : "IgnoreExternalDimensions",
		VA_IGNORE_EXTERNAL_DIMENSIONS_ALL : "All",
		QY_IOBJ_NAME : "Iobjnm",
		QY_INCLUDE_PERFORMANCE_DATA : "IncludePerformanceData",
		QY_INPUT_SUPPORTED : "InputSupported",
		QY_ONLY_INTERVAL : "Interval",
		QY_IS_ACTIVE : "IsActive",
		QY_IS_COMPOUNDING : "IsCompounding",
		QY_IS_DIMENSION_GROUP : "IsDimensionGroup",
		QY_IS_MODELED : "IsModeled",
		QY_IS_DISPLAY_ATTRIBUTE : "IsDisplayAttribute",
		QY_IS_ENABLED : "IsEnabled",
		QY_IS_EXCLUDING : "IsExcluding",
		QY_IS_FILTERABLE : "IsFilterable",
		QY_IS_INPUT_ENABLED_AND_EXIT : "IsInputEnabledAndExit",
		QY_IS_KEY : "IsKey",
		QY_IS_KYF : "IsKyf",
		QY_IS_LINK_KEY : "IsLinkKey",
		QY_IS_OWNER_DIMENSION : "IsOwnerDimension",
		QY_MIME_TYPE : "MIMEType",
		QY_IS_REFERENCE : "IsReference",
		QY_IS_SELECTION_CANDIDATE : "IsSelectionCandidate",
		QY_IS_SUPPRESSING_NULLS : "IsSuppressingNulls",
		QY_IS_WORK_STATUS_ACTIVE : "IsWorkStatusActive",
		QY_INITIAL_DRILL_LEVEL : "InitialDrillLevel",
		QY_INITIAL_VALUE : "InitialValue",
		QY_HIERARCHY_REST_NODE : "RestNode",
		QY_HIERARCHY_VIRTUAL_ROOT_NODE : "VirtualRootNode",
		QY_IS_CUMMULATIVE : "IsCummulative",
		QY_INDEX : "Index",
		QY_INSTANCE_ID : "InstanceId",
		QY_INPUT_ENABLED : "InputEnabled",
		QY_INPUT_READINESS_FLAG : "Flag",
		QY_INPUT_READINESS_INDEX : "InputReadinessIndex",
		QY_INPUT_READINESS_STATES : "InputReadinessStates",
		QY_INPUT_TYPE : "InputType",
		VA_INPUT_TYPE_MANDATORY : "Mandatory",
		VA_INPUT_TYPE_OPTIONAL : "Optional",
		VA_INPUT_TYPE_MANDATORY_NOT_INITIAL : "MandatoryNotInitial",
		VA_INFO_OBJ_TYPE_CHA : "CHA",
		VA_INFO_OBJ_TYPE_KYF : "KYF",
		VA_INFO_OBJ_TYPE_TIM : "TIM",
		VA_INFO_OBJ_TYPE_UNI : "UNI",
		VA_INFO_OBJ_TYPE_DPA : "DPA",
		VA_INFO_OBJ_TYPE_ATR : "ATR",
		VA_INFO_OBJ_TYPE_MTA : "MTA",
		VA_INFO_OBJ_TYPE_XXL : "XXL",
		VA_INFO_OBJ_TYPE_ALL : "ALL",
		QY_JOIN_FIELDS : "JoinFields",
		QY_JOIN_FIELD_NAME : "JoinFieldName",
		QY_JOIN_FIELD_NAME_IN_EXTENDED_DIMENSION : "JoinFieldNameInExtendedDimension",
		QY_JOIN_FIELD_NAME_IN_REFERENCED_DATA : "JoinFieldNameInReferencedData",
		QY_JOIN_TYPE : "JoinType",
		QY_JOIN_PARAMETERS : "JoinParameters",
		QY_JOIN_CARDINALITY : "JoinCardinality",
		QY_KEEP_VALUE : "KeepValue",
		QY_KEY : "Key",
		QY_KEYS : "Keys",
		QY_KEY_ATTRIBUTE : "KeyAttribute",
		QY_LAYOUT : "Layout",
		QY_LANGUAGE : "Language",
		QY_LINE_ID : "LineId",
		QY_LINK_TYPE : "LinkType",
		QY_LOCATION : "Location",
		QY_LOCALE : "Locale",
		QY_LOW : "Low",
		QY_LOW_IS : "LowIs",
		QY_LOWER_BOUND : "LowerBound",
		QY_LOGICAL_OPERATOR : "Operator",
		QY_LAST_UPDATE : "LastDataUpdate",
		QY_DATA_LAST_REFRESH : "DataLastRefresh",
		QY_DATA_ROLL_UP_MAX : "DataRollupMax",
		QY_DATA_ROLL_UP_MIN : "DataRollupMin",
		QY_LAST_UPDATE_BY : "LastDataUpdateBy",
		QY_LAST_DATA_UPDATE_ON : "LastDataUpdateOn",
		QY_LEAVES_ONLY : "LeavesOnly",
		QY_LENGTH : "Length",
		QY_LEVEL : "Level",
		QY_LEVELS : "Levels",
		QY_LEVEL_NAME : "LevelName",
		QY_LEVEL_CAPTION : "LevelCaption",
		QY_LEVEL_UNIQUE_NAME : "LevelUniqueName",
		QY_LEVEL_TYPE : "LevelType",
		QY_LEVEL_OFFSET : "LevelOffset",
		QY_LOCKED_CELL : "LockedCell",
		QY_LOCKED_VALUE : "LockedValue",
		QY_LOCAL_PROVIDER_PREFIX : "@3",
		QY_LOCAL_DIMENSION_PROVIDER : "LocalDimension",
		QY_LOCAL_HIERARCHY_PROVIDER : "LocalHierarchy",
		QY_LOWER_CASE_ENABLED : "LowerCaseEnabled",
		QY_LOWERCASE_SUPPORTED : "LowercaseSupported",
		QY_LOW_NAVIGATIONS : "LowNavigations",
		QY_LOW_SUPPLEMENTS : "LowSupplements",
		QY_LEVEL_HIERARCHIES : "LevelHierarchies",
		QY_LEVEL_HIERARCHY_NAME : "LevelHierarchyName",
		QY_MAPPED_COLUMN : "MappedColumn",
		QY_MAPPING : "Mapping",
		QY_MAPPING_DEFINITION : "MappingDefinition",
		QY_MAPPINGS : "Mappings",
		QY_MAX_TUPLE_COUNT : "MaxTupleCount",
		QY_MAX_RESULT_RECORDS : "MaxResultRecords",
		QY_MAX_NUMBER_OF_DIMENSIONS : "MaxNumberOfDimensions",
		QY_MBR_LEVEL : "MBR_LEVEL",
		QY_MEASURE : "Measure",
		QY_MEASUREMENTS : "Measurements",
		QY_MEASURE_NAME : "MeasureName",
		QY_MEASURES : "Measures",
		QY_MEASURES_AGGREGATION : "[Measures].[Aggregation]",
		QY_MEASURES_DIGITS : "[Measures].[Digits]",
		QY_MEASURES_FRACT_DIGITS : "[Measures].[FractDigits]",
		QY_MEASURES_MEASURES : "[Measures].[Measures]",
		QY_MEMBER : "Member",
		QY_MEMBERS_CODE : "MembersCode",
		QY_MEMBER_INDEXES : "MemberIndexes",
		QY_MEMBER_DESCRIPTION : "MemberDescription",
		QY_MEMBER_NAME : "MemberName",
		QY_MEMBER_OF_POSTED_NODE_VISIBILITY : "MemberOfPostedNodeVisibility",
		QY_MEMBER_OPERAND : "MemberOperand",
		QY_MEMBER_TYPE : "MemberType",
		QY_MEMBER_TYPES : "MemberTypes",
		QY_MEMBER_UNIQUE_NAME : "MemberUniqueName",
		QY_MEMBERS : "Members",
		QY_MEMBERS_REPO : "MembersRepo",
		QY_METADATA : "Metadata",
		QY_MASTERDATA : "Masterdata",
		QY_MASTER_DATA_PROPERTIES : "MasterDataProperties",
		QY_MASTER_DATA_MAINTENANCE : "MasterDataMaintenance",
		QY_MEASURE_OPERAND : "MeasureOperand",
		QY_MESSAGES : "Messages",
		QY_MESSAGE_TYPE : "MessageType",
		QY_MESSAGE_CLASS : "MessageClass",
		VA_SEVERITY_INFO : 0,
		VA_SEVERITY_WARNING : 1,
		VA_SEVERITY_ERROR : 2,
		VA_SEVERITY_SEMANTICAL_ERROR : 3,
		QY_MIN_VERSION : "MinVersion",
		QY_MAX_VERSION : "MaxVersion",
		QY_MODEL : "Model",
		QY_MULTIPLE_VALUES : "MultipleValues",
		QY_NAV_ATTRIBUTE : "NavAttribute",
		QY_NAVIGATIONS : "Navigations",
		QY_NOT : "Not",
		QY_NON_EMPTY : "NonEmpty",
		QY_NAME : "Name",
		QY_NAME_IS : "NameIs",
		QY_NAME_EXTERNAL : "NameExternal",
		QY_NAMESPACE : "Namespace",
		VA_NAMESPACE_BW : "http://com.sap/bw",
		VA_NAMESPACE_BPC : "http://com.sap/bpc",
		QY_NUMBER : "Number",
		QY_NUMERIC_PRECISION : "NumericPrecision",
		QY_NUMERIC_ROUNDING : "NumericRounding",
		QY_NUMERIC_SCALE : "NumericScale",
		QY_NUMERIC_SHIFT : "NumericShift",
		QY_NEW_VALUE : "NewValue",
		QY_NEW_VALUE_AS_STRING : "NewValueAsString",
		QY_NEW_VALUE_EXTERNAL : "NewValueExternal",
		QY_NEW_VALUES : "NewValues",
		QY_NODE_CONDENSATION : "NodeCondensation",
		QY_LOWER_LEVEL_NODE_ALIGNMENT : "LowerLevelNodeAlignment",
		VA_ALIGNMENT_BELOW : "Below",
		VA_ALIGNMENT_ABOVE : "Above",
		VA_ALIGNMENT_DEFAULT : "Default",
		QY_OFFSET : "Offset",
		QY_OLAP_MESSAGE_CLASS : "OlapMessageClass",
		QY_OPERATOR : "Operator",
		QY_ORDER : "Order",
		QY_ORDER_ID : "OrderId",
		QY_OBJECT_NAME : "ObjectName",
		QY_ORDERED_DIMENSION_NAMES : "OrderedDimensionNames",
		QY_ORDERED_STRUCTURE_MEMBER_NAMES : "OrderedStructureMemberNames",
		QY_OPTIONS : "Options",
		VA_OPTIONS_STATEFUL_SERVER : "StatefulServer",
		VA_OPTIONS_SYNCHRONOUS_RUN : "SynchronousRun",
		QY_OPTION : "Option",
		QY_OPTION_VALUES : "OptionValues",
		QY_OPTION_LIST_VARIABLE : "OptionListVariable",
		VA_OBJVERS_MOST_RECENT : "$",
		VA_OBJVERS_ACTIVE : "A",
		QY_OWNER : "Owner",
		QY_OBTAINABILITY : "Obtainability",
		VA_OBTAINABILITY_ALWAYS : "Always",
		VA_OBTAINABILITY_USER_INTERFACE : "UserInterface",
		QY_OPTIONLIST_OPTIONS : "Options",
		QY_PATH : "Path",
		QY_PARAMETERS : "Parameters",
		QY_PARENT_INDEXES : "ParentIndexes",
		QY_PACKAGE_NAME : "PackageName",
		QY_PRESENTATION_TYPE : "PresentationType",
		QY_PRESENTATION_SIGN_REVERSAL : "PresentationSignReversal",
		QY_PRESERVE_GROUPING : "PreserveGrouping",
		QY_PRESERVE_MEMBERS : "PreserveMembers",
		QY_PRE_QUERY_NAMES : "PreQueryNames",
		QY_PRE_QUERIES : "PreQueries",
		QY_POST_AGGREGATION : "PostAggregation",
		QY_POST_AGGREGATION_DIMENSIONS : "PostAggregationDimensions",
		QY_POST_AGGREGATION_IGNORE_HIERARCHY : "PostAggregationIgnoreHierarchy",
		QY_PREFIX : "Prefix",
		QY_PRIVATE : "Private",
		VA_PRESENTATION_TYPE_UNDEFINED : "Undefined",
		VA_PRESENTATION_TYPE_ID : "Id",
		VA_PRESENTATION_TYPE_KEY : "Key",
		VA_PRESENTATION_TYPE_KEY_NOT_COMPOUND : "KeyNotCompound",
		VA_PRESENTATION_TYPE_DISPLAY_KEY : "DisplayKey",
		VA_PRESENTATION_TYPE_DISPLAY_KEY_MIXED_COMPOUNDMENT : "DisplayKeyMixedCompoundment",
		VA_PRESENTATION_TYPE_DISPLAY_KEY_NOT_COMPOUND : "DisplayKeyNotCompound",
		VA_PRESENTATION_TYPE_HIERARCHY_KEY : "HierarchyKey",
		VA_PRESENTATION_TYPE_HIERARCHY_TEXT : "HierarchyText",
		VA_PRESENTATION_TYPE_HIERARCHY_DISPLAY_KEY : "HierarchyDisplayKey",
		VA_PRESENTATION_TYPE_TEXT : "Text",
		VA_PRESENTATION_TYPE_SHORT_TEXT : "ShortText",
		VA_PRESENTATION_TYPE_MEDIUM_TEXT : "MediumText",
		VA_PRESENTATION_TYPE_LONG_TEXT : "LongText",
		VA_PRESENTATION_TYPE_XL_LONG_TEXT : "XLLongText",
		VA_PRESENTATION_TYPE_WHY_FOUND : "WhyFound",
		VA_PRESENTATION_TYPE_RELATED_ACTIONS : "RelatedActions",
		VA_PRESENTATION_TYPE_URL : "URL",
		VA_PRESENTATION_TYPE_BLOB : "XXL",
		QY_PRIORITY : "Priority",
		QY_PROCESSING_DIRECTIVES : "ProcessingDirectives",
		QY_PROCESSING_STEP : "ProcessingStep",
		VA_PROCESSING_STEP_SUBMIT : "VariableSubmit",
		VA_PROCESSING_STEP_CANCEL : "VariableCancel",
		VA_PROCESSING_STEP_DEFINITION : "VariableDefinition",
		QY_PROVIDERS : "Providers",
		QY_POSITION : "Position",
		QY_PROCESSING_TYPE : "ProcessingType",
		QY_PLANNING : "Planning",
		QY_PLANNING_EXTENSIONS : "PlanningExtensions",
		QY_PLANNING_MODE : "PlanningMode",
		QY_PLANNING_VERSION_RESTRICTION : "RestrictToPrivateVersions",
		QY_QUERY : "Query",
		QY_QUERY_MD : "QueryMd",
		QY_QUERIES : "Queries",
		QY_QUERY_CELL_NAMES : "QueryCellNames",
		QY_QUERY_NAME : "QueryName",
		QY_QUEUE_TYPE : "QueueType",
		QY_QUERY_DATA_CELL : "QueryDataCell",
		QY_QUERY_DATA_CELLS : "QueryDataCells",
		QY_QUERY_DATA_CELL_REFERENCES : "QueryDataCellReferences",
		QY_SIGN_REVERSAL : "SignReversal",
		QY_SRID : "SRID",
		QY_DISAGGREGATION_MODE : "DisaggregationMode",
		QY_DISAGGREGATION_REF_CELL_NAME : "DisaggregationReferenceCellName",
		QY_EMPHASIZED : "Emphasized",
		QY_CUMULATION : "Cumulation",
		QY_SCALING_FACTOR : "ScalingFactor",
		QY_SUPPRESS_KEYFIGURE_CALCULATION : "SuppressKeyfigureCalculation",
		QY_SEQUENCE_ID : "SequenceId",
		QY_SERVER_INFO : "ServerInfo",
		QY_SERVER_TYPE : "ServerType",
		QY_SERVICE : "Service",
		QY_SERVICES : "Services",
		QY_READ_MODE : "ReadMode",
		VA_RM_UNDEFINED : "Undefined",
		VA_RM_DEFAULT : "Default",
		VA_RM_MASTER : "Master",
		VA_RM_NONE : "None",
		VA_RM_MASTER_AND_SPACE : "MasterAndSpace",
		VA_RM_MASTER_AND_SPACE_AND_STATE : "MasterAndSpaceAndState",
		VA_RM_REL_MASTER : "RelatedMaster",
		VA_RM_REL_MASTER_AND_SPACE : "RelatedMasterAndSpace",
		VA_RM_REL_MASTER_AND_SPACE_AND_STATE : "RelatedMasterAndSpaceAndState",
		VA_RM_BOOKED : "Booked",
		VA_RM_BOOKED_AND_SPACE : "BookedAndSpace",
		VA_RM_BOOKED_AND_SPACE_AND_STATE : "BookedAndSpaceAndState",
		VA_RM_REL_BOOKED : "RelatedBooked",
		VA_RM_REL_BOOKED_AND_SPACE : "RelatedBookedAndSpace",
		VA_RM_REL_BOOKED_AND_SPACE_AND_STATE : "RelatedBookedAndSpaceAndState",
		QY_REFRESH : "Refresh",
		QY_REFRESH_VERSION_STATES : "RefreshVersionStates",
		QY_REFERENCE : "Reference",
		QY_REFERENCE_ID : "ReferenceId",
		QY_REFERENCES : "References",
		QY_RETURN_ORIGIN_KEYS : "ReturnOriginKeys",
		QY_RETURNED_DATA_SELECTION : "ReturnedDataSelection",
		QY_RETURN_EMPTY_JSON_RESULTSET : "ReturnEmptyJsonResultSet",
		QY_RS_READ_MODE : "ResultSetReadMode",
		QY_RS_DEFAULT_READ_MODE : "ResultSetDefaultReadMode",
		QY_RUN_AS_USER : "RunAsUser",
		QY_RUNTIME : "Runtime",
		QY_REQUEST_MAX_TUPLE_COUNT : "RequestMaxTupleCount",
		QY_REORDERING : "Reordering",
		QY_RRI_LOGICAL_DESTINATION : "LogicalDestination",
		QY_RRI_PROPERTIES : "Properties",
		QY_RRI_P_QUERY : "QUERY",
		QY_RRI_P_PARAMETER_NAME : "RRI_PARAMETER_NAME",
		QY_RRI_P_PARAMETER_VALUE : "RRI_PARAMETER_VALUE",
		QY_RRI_RECEIVER_APPLICATION_TYPE : "ReceiverApplicationType",
		QY_RRI_T_RECEIVER_APPLICATION_QURY : "QURY",
		QY_REPORT_REPORT_TARGETS : "RRITargets",
		QY_REPORT_REPORT_CONTEXT : "RRIContext",
		QY_ROW : "Row",
		QY_ROW_FROM : "RowFrom",
		QY_ROW_TO : "RowTo",
		QY_RESULT_SET_MEMBER_DEFAULT_READ_MODE : "ResultSetMemberDefaultReadMode",
		QY_RESULT_SET_MEMBER_READ_MODE : "ResultSetMemberReadMode",
		QY_RESULT_SET_READ_MODE : "ResultSetReadMode",
		QY_RESULT_SET_STATE : "ResultSetState",
		VA_RESULT_SET_STATE_DATA_AVAILABLE : 0,
		VA_RESULT_SET_STATE_NO_DATA_AVAILABLE_A : 1,
		VA_RESULT_SET_STATE_NO_DATA_AVAILABLE_B : 2,
		VA_RESULT_SET_STATE_ERROR : 3,
		VA_RESULT_SET_STATE_LIMIT_EXCEEDED : 4,
		VA_RESULT_SET_STATE_SUCCESSFUL_PERSISTED : 5,
		VA_RESULT_SET_STATE_EMPTY_JSON : 6,
		QY_RESULT_SET_FEATURE_CAPABILITIES : "ResultSetFeatureCapabilities",
		QY_RS_ALIGNMENT : "ResultAlignment",
		VA_RS_ALIGNMENT_TOP : "Top",
		VA_RS_ALIGNMENT_BOTTOM : "Bottom",
		VA_RS_ALIGNMENT_TOP_BOTTOM : "TopBottom",
		VA_RS_ALIGNMENT_NONE : "None",
		VA_RS_ALIGNMENT_STRUCTURE : "Structure",
		VA_RS_ALIGNMENT_ON_DEFAULT : "Default",
		QY_RS_FIXED_ATTRIBUTES : "ResultSetFixedAttributes",
		QY_RS_FEATURE_REQUEST : "ResultSetFeatureRequest",
		QY_RS_RESULT_SET_PERSISTENCE_SCHEMA : "ResultSetPersistanceSchema",
		QY_RS_RESULT_SET_PERSISTENCE_TABLE : "ResultSetPersistanceTable",
		QY_RS_RESULT_SET_PERSISTENCE_IDENTIFIER : "ResultSetPersistanceIdentifier",
		QY_REPOSITORY_TYPE : "RepositoryType",
		QY_RESULT_FORMAT : "ResultFormat",
		VA_RS_FORMAT_V2 : "Version2",
		VA_RS_FORMAT_SERIALIZED_DATA : "SerializedData",
		QY_RESULT_ENCODING : "ResultEncoding",
		VA_RS_ENCODING_NONE : "None",
		VA_RS_ENCODING_AUTO : "Auto",
		VA_RS_ENCODING_DELTA_RUN_LENGTH : "DeltaRunLength",
		QY_RESULT_KEEP_ORIGINAL_TEXTS : "ResultKeepOriginalTexts",
		VA_IS_VARIABLE : "Variable",
		VA_IS_MANUAL_INPUT : "ManualInput",
		QY_RESULT_STRUCTURE : "ResultStructure",
		QY_RESULT_STRUCTURE_BAG : "ResultStructureBag",
		QY_RESULT_STRUCTURE_REPO : "ResultStructureRepo",
		QY_RESULT : "Result",
		VA_RESULT_TOTAL : "Total",
		VA_RESULT_MEMBERS : "Members",
		VA_RESULT_TOTAL_INCLUDED_MEMBERS : "TotalIncludedMembers",
		VA_RESULT_TOTAL_REMAINING_MEMBERS : "TotalRemainingMembers",
		QY_RESULT_SET_FIELDS : "ResultSetFields",
		QY_RESULT_SET_ATTRIBUTE_NODES : "ResultSetAttributeNodes",
		QY_RESULT_SET_ATTRIBUTE_FIELDS : "ResultSetAttributeFields",
		QY_RESULT_STRUCTURE_FEATURE : "ResultStructureFeature",
		QY_RESULT_ALIGNMENT_LIST : "ResultAlignmentList",
		QY_RESULT_ALIGNMENT : "ResultAlignment",
		VA_REORDERING_FULL : "Full",
		VA_REORDERING_RESTRICTED : "Restricted",
		VA_REORDERING_NONE : "None",
		QY_ROOT_TUPLE : "RootTuple",
		QY_RESULTCALCULATION : "ResultCalculation",
		VA_RS_VISIBILITY_VISIBLE : "Visible",
		VA_RS_VISIBILITY_HIDDEN : "Hidden",
		VA_RS_VISIBILITY_CONDITIONAL : "Conditional",
		VA_RS_VISIBILITY_ALWAYS : "Always",
		QY_SCREEN_ORDER : "ScreenOrder",
		QY_SECTION : "Section",
		QY_SET_OPERAND : "SetOperand",
		QY_SETTING_NAME : "SettingName",
		QY_SETTINGS : "Settings",
		QY_SYSTEM : "System",
		QY_SYSTEM_ID : "SystemId",
		QY_SELECTION_OBJECT : "SelectionObject",
		QY_SINGLE_VALUE_CALCULATION : "SingleValueCalculation",
		QY_VALUE_HELP_FILTER : "ValueHelpFilter",
		QY_SORT_TYPES_BREAKING_GROUP : "SortTypesBreakGrouping",
		QY_SORT : "Sort",
		QY_SORT_REPO : "SortRepo",
		QY_SORT_ORDER : "SortOrder",
		QY_SOLVE_ORDER : "SolveOrder",
		VA_SORTING_DEFAULT : 0,
		VA_SORTING_ASCENDING : 1,
		VA_SORTING_DESCENDING : 2,
		VA_SORTING_NONE : 3,
		QY_SORT_TYPE : "SortType",
		VA_SORT_TYPE_MEMBER : "Member",
		VA_SORT_TYPE_MEMBER_KEY : "MemberKey",
		VA_SORT_TYPE_MEMBER_TEXT : "MemberText",
		VA_SORT_TYPE_FIELD : "Field",
		VA_SORT_TYPE_MEASURE : "Measure",
		VA_SORT_TYPE_COMPLEX : "Complex",
		VA_SORT_TYPE_FILTER : "Filter",
		VA_SORT_TYPE_SELECTION : "Selection",
		VA_SORT_TYPE_DATA_CELL : "Datacell",
		VA_SORT_TYPE_HIERARCHY : "Hierarchy",
		QY_SORT_TUPLE : "SortTuple",
		QY_SORT_CUSTOM_SORT : "CustomSort",
		QY_SORT_CUSTOM_SORT_POSITION : "CustomSortPosition",
		QY_SCOPE : "Scope",
		QY_SCHEMA_NAME : "SchemaName",
		QY_SELECTOR_READ_MODE : "SelectorReadMode",
		QY_SELECTOR_DEFAULT_READ_MODE : "SelectorDefaultReadMode",
		QY_SEARCH_OPERAND : "SearchOperand",
		QY_SELECTION : "Selection",
		QY_SELECTION_REPO : "SelectionRepo",
		QY_SELECTION_MEASURE : "SelectionMeasure",
		QY_SIGN : "Sign",
		QY_SIGNATURE : "Signature",
		QY_SIMPLE_NUMERIC_VALUES : "SimpleNumericValues",
		QY_SIMPLE_STRING_VALUES : "SimpleStringValues",
		QY_SKIP : "Skip",
		QY_STATISTICS : "Statistics",
		QY_STRUCTURE : "Structure",
		QY_STRUCTURE_NAME : "StructureName",
		QY_CODE_TUPLE : "Tuple",
		QY_TUPLES_TUPLES : "Tuples",
		QY_TUPLES_FIELDNAMES : "FieldNames",
		QY_TUPLES_OPERAND : "TuplesOperand",
		QY_SUB_SELECTIONS : "SubSelections",
		QY_SUPPORTS_RESULTSET_FACETS : "SupportsResultsetFacets",
		QY_SUBSET_DESCRIPTION : "SubSetDescription",
		QY_SUPPORTED_RESULT_SET_READ_MODES : "SupportedResultSetReadModes",
		QY_SUPPORTED_SELECTOR_READ_MODES : "SupportedSelectorReadModes",
		QY_SUPPORTED_VARIABLE_READ_MODES : "SupportedVariableReadModes",
		QY_SUPPORTS_HIERARCHY_NAV_COUNTER : "SupportsHierNavCounter",
		QY_SUPPORTS_EXTENDED_SORT : "SupportsExtendedSort",
		QY_SUPPORTS_SELECTION : "SupportsSelection",
		QY_SUPPORTS_VALUE_HELP : "SupportsValueHelp",
		QY_SUPPORTS_LCHA_GEN : "SupportsLChaGen",
		QY_SUPPORTS_DATA_CELLS : "SupportsDataCells",
		QY_SUPPORTS_DATA_ENTRY_READ_ONLY : "SupportsDataEntryReadOnly",
		QY_SUPPORTS_CONDITIONS : "SupportsConditions",
		QY_SUPPORTS_EXCEPTION_AGGREGATION_DIMS_FORMULAS : "ExceptionAggregationDimsAndFormulas",
		QY_SUPPORTED_DIMENSIONS : "SupportedDimensions",
		QY_SIZE : "Size",
		QY_SCALE : "Scale",
		QY_SEPARATOR : "Separator",
		VA_SEPARATOR_SEMICOLON : ";",
		QY_SQL_TYPE : "SQLType",
		QY_SUB_ACTION_COPY : "COPY",
		QY_SUB_ACTION_EDIT : "EDIT",
		QY_SUB_ACTION_ACTIVATE : "ACTIVATE",
		QY_SUB_ACTION_NEW_VERSION : "NEW_VERSION",
		QY_SUB_ACTION_DELETE_VERSION : "DELETE_VERSION",
		QY_SUB_ACTION_UNLOCK : "UNLOCK",
		QY_SUB_ACTION_UPDATE_VERSION : "UPDATE_VERSION",
		QY_SUB_ACTION_VALIDATE : "VALIDATE",
		QY_SUB_USER_DETAIL : "USERDETAIL",
		QY_SUPPORTED_RESULT_SET_MEMBER_READ_MODES : "SupportedResultSetMemberReadModes",
		QY_STEP_TYPE : "StepType",
		QY_STEP_NUMBER : "StepNumber",
		QY_STEPS : "Steps",
		QY_SEMANTIC_TYPE : "SemanticType",
		VA_SEMANTIC_TYPE_HIER_NODE_VAR : "HierarchyNodeVariable",
		VA_SEMANTIC_TYPE_HIER_NAME_VAR : "HierarchyNameVariable",
		VA_SEMANTIC_TYPE_HIERARCHY_VARIABLE : "HierarchyVariable",
		VA_SEMANTIC_TYPE_OPTION_LIST_VARIABLE : "OptionListVariable",
		VA_SEMANTIC_TYPE_FORMULA_VARIABLE : "FormulaVariable",
		VA_SEMANTIC_TYPE_TEXT_VARIABLE : "TextVariable",
		VA_SEMANTIC_TYPE_VALUE_VARIABLE : "ValueVariable",
		VA_SEMANTIC_TYPE_DIM_MEMBER_VAR : "DimensionMemberVariable",
		QY_SUPPORTS_CUMMULATIVE : "SupportsCummulative",
		QY_SUPPLEMENTS_FIELD_NAMES : "SupplementsFieldNames",
		QY_SOURCES : "Sources",
		QY_TARGET_VERSION_ID : "TargetVersionId",
		QY_TEXT_TRANSFORMATION : "TextTransformation",
		VA_TEXT_TRANSFORMATION_STRING_TRANSFORMATION : "StringTransformation",
		VA_TEXT_TRANSFORMATION_UPPERCASE : "Uppercase",
		VA_TEXT_TRANSFORMATION_LOWERCASE : "Lowercase",
		VA_TEXT_TRANSFORMATION_CAPITALIZE : "Capitalize",
		VA_TEXT_TRANSFORMATION_SPATIAL_AS_BINARY : "SpatialAsBinary",
		VA_TEXT_TRANSFORMATION_SPATIAL_AS_EWKB : "SpatialAsEWKB",
		VA_TEXT_TRANSFORMATION_SPATIAL_AS_EWKT : "SpatialAsEWKT",
		VA_TEXT_TRANSFORMATION_SPATIAL_AS_GEOJSON : "SpatialAsGeoJSON",
		VA_TEXT_TRANSFORMATION_SPATIAL_AS_TEXT : "SpatialAsText",
		VA_TEXT_TRANSFORMATION_SPATIAL_AS_WKB : "SpatialAsWKB",
		VA_TEXT_TRANSFORMATION_SPATIAL_AS_WKT : "SpatialAsWKT",
		VA_TEXT_TRANSFORMATION_SPATIAL_AS_SVG : "SpatialAsSVG",
		QY_TRACE_LEVEL : "TraceLevel",
		QY_THRESHOLD : "Threshold",
		QY_TYPE : "Type",
		VA_TYPE_CLOSE : "Close",
		VA_TYPE_CLEAR_CACHE : "ClearCache",
		VA_TYPE_DATA_AREA_CMD : "DataAreaCommand",
		VA_TYPE_PLANNING_FUNCTION : "PlanningFunction",
		VA_TYPE_PLANNING_SEQUENCE : "PlanningSequence",
		VA_TYPE_STRING : "String",
		QY_TYPES : "Types",
		QY_TLOGO : "TLOGO",
		QY_TLOGO_TXT : "TLOGOText",
		QY_TUPLES : "Tuples",
		QY_TUPLE_COUNT : "TupleCount",
		QY_TUPLE_COUNT_TOTAL : "TupleCountTotal",
		QY_TOP : "Top",
		QY_TEXT : "Text",
		QY_TEXT_ATTRIBUTE : "TextAttribute",
		QY_TOTAL : "Total",
		QY_TOTAL_INCLUDING : "Total Including",
		QY_TOTAL_REMAINING : "Total Remaining",
		VA_TOTAL_INCLUDED_MEMBERS : "TotalIncludedMembers",
		VA_TOTAL_REMAINING_MEMBERS : "TotalRemainingMembers",
		QY_TUPLE_ELEMENT_IDS : "TupleElementIds",
		QY_UNIT : "Unit",
		QY_UNITS : "Units",
		QY_UNIT_INDEX : "UnitIndex",
		QY_UPPER_BOUND : "UpperBound",
		QY_UNIT_TYPE : "UnitType",
		VA_UNIT_TYPE_CURRENCY : "CUR",
		VA_UNIT_TYPE_UNIT : "UNI",
		VA_UNIT_TYPE_UNDEFINED : "UDF",
		QY_UNIT_FIXED : "UnitFixed",
		QY_UNIT_NAME : "UnitName",
		QY_UNIT_TEXT_NAME : "UnitTextName",
		QY_UNIT_TYPES : "UnitTypes",
		VA_UNIT_TYPES_IS_MIXED : -1,
		VA_UNIT_TYPES_NONE : 0,
		VA_UNIT_TYPES_IS_CURRENCY : 1,
		VA_UNIT_TYPES_IS_UNIT : 2,
		VA_UNIT_TYPES_IS_CURRENCY_UNIT : 3,
		QY_UNIT_POSITIONS : "UnitPositions",
		VA_UNIT_POSITIONS_NOT_DEFINED : 0,
		VA_UNIT_POSITIONS_AFTER_UNIT : 1,
		VA_UNIT_POSITIONS_BEFORE_UNIT : 2,
		QY_USAGE_TYPE : "UsageType",
		QY_UNIT_DESCRIPTIONS : "UnitDescriptions",
		QY_UNIT_REFERENCE : "UnitReference",
		QY_UNIT_CURRENCY : "UnitCurrency",
		VA_UNIT_CURRENCY_U : "U",
		VA_UNIT_CURRENCY_C : "C",
		QY_UNIQUE_NAME : "UniqueName",
		QY_USE_CONV_EXIT : "UseConvExit",
		QY_USER_LANGUAGE_CODE : "UserLanguageCode",
		QY_USE_DEFAULT_ATTRIBUTE_KEY : "UseDefaultAttributeKey",
		QY_USE_EXTERNAL_VIEW : "UseExternalView",
		QY_VALUE : "Value",
		QY_VALUE_IS : "ValueIs",
		QY_VALUES : "Values",
		QY_VALUE1 : "Value1",
		QY_VALUE2 : "Value2",
		QY_VALUE3 : "Value3",
		QY_VALUE3_IS : "Value3Is",
		QY_VALUE_EXCEPTION : "ValuesException",
		QY_VALUES_FORMATTED : "ValuesFormatted",
		QY_VALUEHELP_FOR_VARIABLE : "ValuehelpForVariable",
		QY_VALUES_ROUNDED : "ValuesRounded",
		QY_VALUE_TYPE : "ValueType",
		VA_VALUE_TYPE_NUMBER : "Number",
		VA_VALUE_TYPE_STRING : "String",
		VA_VALUE_TYPE_BOOL : "Bool",
		VA_VALUE_TYPE_DATE : "Date",
		VA_VALUE_TYPE_DATE_TIME : "DateTime",
		VA_VALUE_TYPE_VARIABLE : "Variable",
		QY_VERSION : "Version",
		QY_VERSIONS : "Versions",
		QY_VIEW_ATTRIBUTES : "ViewAttributes",
		QY_VISIBILITY_FILTER : "VisibilityFilter",
		QY_VARIABLE_READ_MODE : "VariableReadMode",
		QY_VARIABLE_VARIANT : "VariableVariant",
		QY_VARIABLE_VARIANTS : "VariableVariants",
		QY_VARIABLES : "Variables",
		QY_VARIABLES_MD : "VariablesMd",
		QY_VARIABLE_TYPE : "VariableType",
		VA_VAR_TYPE_DIM_MEMBER_VARIABLE : "DimensionMemberVariable",
		VA_VAR_TYPE_OPTION_LIST_VARIABLE : "OptionListVariable",
		VA_VAR_TYPE_SIMPLE_TYPE_VARIABLE : "SimpleTypeVariable",
		QY_VISIBILITY_SETTINGS : "VisibilitySettings",
		QY_VISIBILITY : "Visibility",
		VA_VISIBILITY_VISIBLE : "Visible",
		VA_VISIBILITY_ON_DEFAULT : "Default",
		QY_VISIBILITY_TYPE : "VisibilityType",
		VA_VISIBILITY_TYPE_CENTRAL : "C",
		VA_VISIBILITY_TYPE_CENTRAL_NOT_VISIBLE : "C/I",
		VA_VISIBILITY_TYPE_CENTRAL_DISPLAY_ONLY : "C/D",
		VA_VISIBILITY_TYPE_CENTRAL_CHANGE_TO_EXISTING : "C/C",
		VA_VISIBILITY_TYPE_CENTRAL_ADD_NEW : "C/A",
		VA_VISIBILITY_TYPE_LOCAL : "L",
		VA_VISIBILITY_TYPE_LOCAL_NOT_VISIBLE : "L/I",
		VA_VISIBILITY_TYPE_LOCAL_DISPLAY_ONLY : "L/D",
		VA_VISIBILITY_TYPE_LOCAL_CHANGE_TO_EXISTING : "L/C",
		VA_VISIBILITY_TYPE_LOCAL_ADD_NEW : "L/A",
		QY_WORKSPACE : "Workspace",
		QY_WORKSTATUS_TATTRIBUTE_CANCEL : "$$CANCEL$$",
		QY_WORKSTATUS_TATTRIBUTE_STATUS : "$$STATUS$$",
		QY_WORKSTATUS_TATTRIBUTE_AVAILABLE_STATUS : "$$AVAILABLE_STATUS$$",
		QY_WORKSTATUS_TATTRIBUTE_INCLUDE_CHILDREN : "$$INCLUDE_CHILDREN$$",
		QY_WORKSTATUS_TATTRIBUTE_EXPAND_TO_BASE : "$$EXPAND_TO_BASE$$",
		QY_WORKSTATUS_TATTRIBUTE_INCLUDE_AVAILABLE_STATUS : "$$INCLUDE_AVAILABLE_STATUS$$",
		QY_ZERO_SUPPRESSION_TYPE : "ZeroSuppressionType",
		VA_ZERO_SUPPRESSION_TYPE_NONE : 0,
		VA_ZERO_SUPPRESSION_TYPE_TOTAL_IS_ZERO : 1,
		VA_ZERO_SUPPRESSION_TYPE_ALL_CELLS_ARE_ZERO : 2,
		LC_ACTION : "action",
		LC_ACTIVE : "active",
		LC_ACTIONS : "actions",
		LC_ACTION_ID : "action_id",
		LC_ACTION_STATE : "action_state",
		LC_ACTION_ACTIVE : "action_active",
		LC_ACTION_END_TIME : "action_end_time",
		LC_ACTION_START_TIME : "action_start_time",
		LC_AVAILABLE_REDO : "available_redo",
		LC_AVAILABLE_UNDO : "available_undo",
		LC_BACKUP : "backup",
		LC_BACKUP_TIME : "backup_time",
		LC_CHANGES : "changes",
		LC_CLOSE : "close",
		LC_COMMAND : "command",
		LC_COMMANDS : "commands",
		LC_COUNT : "count",
		LC_CREATE_TIME : "create_time",
		VC_COMMAND_GET_MODELS : "get_models",
		VC_COMMAND_CLEANUP : "cleanup",
		VC_COMMAND_GET_ACTION_PARAMETERS : "get_action_parameters",
		VC_COMMAND_SHOW_VERSION_PRIVILEGES : "show_version_privileges",
		LC_DEFAULT : "default",
		LC_DEFAULT_OPTIONS : "defaultOptions",
		LC_DESCRIPTION : "description",
		LC_PRIMARY : "primary",
		LC_END_TIME : "end_time",
		LC_EPM_POPULATE_FROM_VERSION : "epmPopulate.fromVersion",
		LC_EXCEPTION_TEXT : "exception_text",
		LC_GET_QUERY_SOURCES : "get_query_sources",
		LC_GET_ACTIONS : "get_actions",
		LC_DELETE_ALL_VERSIONS : "delete_all_versions",
		LC_GET_PARAMETERS : "get_parameters",
		LC_GET_ACTION_PARAMETERS : "get_action_parameters",
		LC_GET_VERSIONS : "get_versions",
		LC_GET_VERSION_STATE : "get_version_state",
		LC_GRANTEE : "grantee",
		LC_HAS_VALUE : "hasValue",
		LC_ID : "id",
		LC_INIT : "init",
		LC_MESSAGE : "message",
		LC_MODE : "mode",
		LC_MODELS : "models",
		LC_MODEL : "model",
		LC_NAME : "name",
		LC_NUM_UNDO_REDO_STEPS : "num_undo_redo_steps",
		LC_OPTIONS : "options",
		LC_OPTION_OCCURENCE : "optionOccurrence",
		VC_OPTION_OCCURENCE_EXACTLY_ONE : "exactly-one",
		LC_OWNER : "owner",
		LC_PARAMETERS : "parameters",
		LC_PERSISTENT_PDCS : "persistent_pdcs",
		LC_POPULATE_SINGLE_VERSION : "populate_single_version",
		LC_PRIVILEGE : "privilege",
		LC_PUBLIC : "public",
		LC_PUBLISH : "publish",
		LC_QUERY_SOURCE_SCHEMA : "query_source_schema",
		LC_QUERY_SOURCE : "query_source",
		LC_QUERY_SOURCES : "query_sources",
		LC_RESTORE_BACKUP : "restore_backup",
		LC_RETURN_CODE : "return_code",
		LC_SCHEMA : "schema",
		LC_SAVE : "save",
		LC_SHOW_AS_PUBLIC_VERSION : "showAsPublicVersion",
		LC_START : "start",
		LC_START_TIME : "start_time",
		LC_STATE : "state",
		LC_STATES : "states",
		LC_SEQUENCE_ID : "sequence_id",
		LC_SEQUENCE_ACTIVE : "sequence_active",
		LC_SEQUENCE_CREATE_TIME : "sequence_create_time",
		LC_SOURCE_VERSION : "source version",
		LC_TIMEOUT_VALUE : "timeout_value",
		LC_TYPE : "type",
		LC_UNDO_CHANGES : "undo_changes",
		LC_USER_NAME : "user_name",
		LC_VALUE : "value",
		LC_VALUE_ALLOWED : "valueAllowed",
		LC_VERSION_ID : "version_id",
		LC_VERSION_STATE : "version_state",
		LC_VERSION_STATE_DESCRIPTIONS : "version_state_descriptions",
		LC_VERSIONS : "versions",
		LC_VERSION_PRIVILEGES : "version_privileges",
		QY_USED_IN_DYNAMIC_FILTER : "UsedInDynamicFilter",
		QY_USED_IN_FIXED_FILTER : "UsedInFixedFilter",
		QY_COMMAND_TYPE : "CommandType",
		QY_FILTER_NAME : "FilterName",
		QY_LOW_VALUE : "LowValue",
		QY_LOW_VALUE_TYPE : "LowValueType",
		QY_HIGH_VALUE : "HighValue",
		QY_HIGH_VALUE_TYPE : "HighValueType",
		QY_FROM : "From",
		QY_TO : "To",
		QY_PLANNING_FUNCTION_NAME : "PlanningFunctionName",
		QY_ALTERNATIVE_FIELD_VALUES : "AlternativeFieldValues",
		QY_MEMBER_KEY : "MemberKey",
		QY_HIERARCHY_KEY : "HierarchyKey",
		QY_NAVIGATIONAL_ATTRIBUTE_DESCRIPTION : "NavigationalAttributeDescription",
		QY_ENVIRONMENT_DESCRIPTION : "EnvDescription",
		QY_MODEL_DESCRIPTION : "ModelDescription",
		QY_DIMENSION_SETTING : "DimensionSetting",
		QY_ADDITIONAL_DIMENSIONS : "AdditionalDimensions",
		QY_ADDITIONAL_MEASURES : "AdditionalMeasures",
		QY_ENABLE_COMMENT : "EnableComment",
		QY_ENFORCE_DYNAMIC_VALUE : "EnforceDynamicValue",
		QY_USED_LOCAL : "UsedLocal",
		QY_DIM_TYPE : "DimType",
		QY_SIMPLE_MODEL : "SimpleModel",
		QY_KEY_FIGURE_U : "KeyFigure",
		QY_PREFERRED_ALVL : "PreferredALVL",
		QY_LOCAL_PROVIDER : "LocalProvider",
		QY_DIMENSION_SCOPE : "DimensionScope",
		QY_ENTRY_TYPE : "EntryType",
		QY_SELECTION_OPTION : "SelectionOption",
		QY_PREFERRED_QUERY : "PreferredQuery",
		QY_LOW_VALUE_EXT : "LowValueExt",
		QY_HIGH_VALUE_EXT : "HighValueExt",
		QY_SUPPLEMENTS : "Supplements",
		QY_DIMENSION_SKIP_MDVALIDATION : "SkipMetadataValidationOnRepoImport",
		QY_VALIDATION_HASH : "ValidationHash",
		QY_DATASOURCE_VALIDATION : "DataSourceValidation",
		EXPORTING_EACH_MEASURE : "ExportingEachMeasure",
		EXPORTING_FIXED_FILTER : "ExportingFixedFilter",
		EXPORTING_VARIABLES : "ExportingVariables",
		IS_DYNAMIC_VALUE : "IsDynamicValue",
		QY_CURRENCY_TRANSLATION_ENABLED : "CurrencyTranslationEnabled",
		QY_CURRENCY_TRANSLATION : "CurrencyTranslation",
		QY_CURRENCY_TRANSLATION_TARGET : "Target",
		QY_CURRENCY_TRANSLATION_OPERATION : "Operation"
	};
	oFF.StoryConstants = {
		K_ARGUMENTS : "arguments",
		K_ANSWERS : "answers",
		K_AST : "ast",
		K_CALCULATIONS : "calculations",
		K_EXCLUDE : "exclude",
		K_ENTITY_ID : "entityId",
		K_FUNCTION : "function",
		K_FUNCTION2 : "Function",
		K_FORMULA : "formula",
		K_ID : "id",
		K_IDS : "ids",
		K_MEASURE_INFO : "measureInfo",
		K_MEMBER : "member",
		K_MEMBER2 : "Member",
		K_NAME : "name",
		K_PARENT_KEY : "parentKey",
		K_PARAMETERS : "Parameters",
		K_SELECTIONS : "selections",
		K_TYPE : "type",
		V_TYPE_CALC_RESTRICTED_MEASURE : "restrictedMeasure",
		V_TYPE_CALC_CALCULATION : "calculation"
	};
	oFF.VizDefConstants = {
		K_AXIS_LINE : "axisLine",
		K_AXIS_TICK : "axisTick",
		K_ARGUMENTS : "arguments",
		K_ANSWERS : "answers",
		K_AREA : "area",
		K_BUBBLE_STYLE : "BubbleStyle",
		K_BUBBLE_STYLING : "bubbleStyling",
		K_BELLCURVE : "bellcurve",
		K_BINDINGS : "bindings",
		K_BAR : "bar",
		K_BUBBLE : "bubble",
		K_BACKGROUND : "background",
		K_BOXPLOT : "boxplot",
		K_CALC_DEF : "def",
		K_CHART : "chart",
		K_COLUMN : "column",
		K_COLOR : "color",
		K_CATEGORY_AXIS : "categoryAxis",
		K_COLLISION_DETECTION : "collisionDetection",
		K_CATEGORIES : "categories",
		K_DATA : "data",
		K_DIMENSION : "dimension",
		K_DATA_LABEL : "dataLabel",
		K_DIRECTION : "direction",
		V_DIRECTION_ASC : "ascending",
		V_DIRECTION_DESC : "descending",
		K_ENTITY_ID : "entityId",
		K_EXCLUDE : "exclude",
		K_ENABLED : "enabled",
		K_ENTITY_FORMAT_INFO : "entityFormatInfos",
		K_FEED : "feed",
		V_FEED_DATA_CONTEXT : "dataContext",
		V_FEED_VALUE_AXIS : "valueAxis",
		V_FEED_VALUE_AXIS2 : "valueAxis2",
		V_FEED_CATEGORY_AXIS : "categoryAxis",
		V_FEED_CATEGORY_AXIS2 : "categoryAxis2",
		V_FEED_COLOR : "color",
		V_FEED_PATTERN2 : "pattern2",
		V_FEED_TRELLIS : "trellis",
		V_FEED_TOOLTIP_VALUE_AXIS : "tooltipValueAxis",
		V_FEED_TOOLTIP_CATEGORY_AXIS : "tooltipCategoryAxis",
		V_FEED_SIZE : "size",
		V_FEED_WEIGHT : "weight",
		V_FEED_TITLE : "title",
		V_FEED_BUBBLE_WEIGHT : "bubbleWidth",
		V_FEED_TIME_AXIS : "timeAxis",
		K_FILL : "fill",
		K_FILTERS : "filters",
		K_FONT_FAMILY : "fontFamily",
		K_FONT_SIZE : "fontSize",
		K_FONT_WEIGHT : "fontWeight",
		V_FONT_WEIGHT_NORMAL : "normal",
		V_FONT_WEIGHT_BOLD : "bold",
		K_FORMAT : "format",
		K_FORMAT_STRING : "formatString",
		K_GAP : "gap",
		K_GRIDLINE : "gridline",
		K_GRIDLINE_WIDTH : "gridLineWidth",
		K_GENERAL : "general",
		K_GROUP : "group",
		K_HEATMAP : "heatmap",
		K_HIDE_WHEN_OVERLAP : "hideWhenOverlap",
		K_ID : "id",
		V_ID : "id",
		V_ID_AND_DESCRIPTION : "idAndDescription",
		K_INCOMPLETE_DATA_INFO : "incompleteDataInfo",
		K_INVERTED : "inverted",
		K_INNER_GROUP_SPACING : "innerGroupSpacing",
		K_IS_AUTO_TOP_N : "isAutoTopN",
		K_IS_INCOMPLETE : "isIncomplete",
		K_LABELS : "labels",
		K_LAYOUT : "layout",
		K_LABEL : "label",
		K_LEGEND : "legend",
		K_LEGEND_GROUP : "legendGroup",
		K_LINE_WIDTH : "lineWidth",
		K_LEVEL : "level",
		K_LIMIT : "limit",
		K_LINE : "line",
		K_LINE_COLOR : "lineColor",
		K_ORIGINAL_BINDINGS : "originalBindings",
		K_POSITION : "position",
		K_PATTERN : "pattern",
		V_POSITION_TOP : "top",
		K_PARENT_KEY : "parentKey",
		K_PROPERTIES : "properties",
		K_PLOT_AREA : "plotArea",
		K_PADDING_BOTTOM : "paddingBottom",
		K_PLOT_OPTIONS : "plotOptions",
		K_PIE : "pie",
		K_ROW_LIMIT : "rowLimit",
		K_RESPONSIVE : "responsive",
		K_RANK : "ranking",
		K_SERIES : "series",
		K_SOURCE : "source",
		K_SHOW_FULL_LABEL : "showFullLabel",
		K_STYLE : "style",
		K_SIZE : "size",
		K_SHOW_LABEL_GRIDS : "showLabelGrids",
		K_SUGGESTED_TITLE : "suggestedTitle",
		K_SUB_TITLE : "subTitle",
		K_SUGGESTED_SUB_TITLE : "suggestedSubTitle",
		K_STACK_COLUMN_LABEL : "stackColumnLabel",
		K_SHOW_LABEL_NAMES : "showLabelNames",
		K_SCATTER : "scatter",
		K_SPLINE : "spline",
		K_SORT : "sort",
		K_SORT_BY : "sortBy",
		V_STACKED_BAR : "stackedbar",
		V_STACKED_COLUMN : "stackedcolumn",
		K_TREEMAP : "treemap",
		K_TYPE : "type",
		K_TITLE : "title",
		K_TICK_COLOR : "tickColor",
		K_TICK_WIDTH : "tickWidth",
		V_TYPE_AXIS_MEMBER_DIM : "dimension",
		V_TYPE_AXIS_MEMBER_MEMBER : "member",
		V_TYPE_AXIS_MEMBER_RESTRICTED : "restrictedMeasure",
		V_TYPE_AXIS_MEMBER_CALCULATION : "calculation",
		V_TYPE_BARCOLUMN : "barcolumn",
		V_TYPE_CHART_DONUT : "donut",
		V_TYPE_CHART_PIE : "pie",
		V_TYPE_DATASET : "dataset",
		V_TYPE_DIMENSION : "dimension",
		V_TYPE_FILTER_FILTER : "filter",
		V_TYPE_FILTER_MEMBER : "member",
		V_TYPE_HIERCHY_PCH : "hierarchy.pch",
		V_TYPE_MEMBER : "member",
		V_TYPE_SORT_DIMENSION : "dimension",
		K_VALUE_AXIS : "valueAxis",
		K_VALUE_AXIS2 : "valueAxis2",
		K_VALUE : "value",
		K_VARIANCE_CHART : "varianceChart",
		K_VARIANCE_LABEL : "varianceLabel",
		K_VISIBLE : "visible",
		K_VARIPIE : "variablepie",
		K_VARIWIDE : "variwide",
		K_WORDCLOUD : "wordcloud",
		K_REFERENCELINES : "referenceLines",
		K_MARKERS : "markers",
		K_ERRORBARS : "errorbars",
		K_ANALYTIC_OBJECTS : "analyticObjects",
		K_STACKING : "stacking",
		K_PLOT_LINES : "plotLines",
		K_POLAR : "polar",
		K_MARGIN_TOP : "marginTop",
		K_TEXT : "text",
		K_DATA_LABELS : "dataLabels",
		K_NAME : "name",
		K_X_AXIS : "xAxis",
		K_Y_AXIS : "yAxis",
		K_Y : "y"
	};
	oFF.CommonsModule = function() {
	};
	oFF.CommonsModule.prototype = new oFF.DfModule();
	oFF.CommonsModule.s_module = null;
	oFF.CommonsModule.getInstance = function() {
		return oFF.CommonsModule.initVersion(oFF.XVersion.API_DEFAULT);
	};
	oFF.CommonsModule.initVersion = function(version) {
		var timestamp;
		if (oFF.isNull(oFF.CommonsModule.s_module)) {
			oFF.DfModule.checkInitialized(oFF.RuntimeModule
					.initVersion(version));
			timestamp = oFF.DfModule.start("CommonsModule...");
			oFF.CommonsModule.s_module = new oFF.CommonsModule();
			oFF.DfModule.stop(timestamp);
		}
		return oFF.CommonsModule.s_module;
	};
	oFF.CommonsModule.getInstance();
})(sap.firefly);