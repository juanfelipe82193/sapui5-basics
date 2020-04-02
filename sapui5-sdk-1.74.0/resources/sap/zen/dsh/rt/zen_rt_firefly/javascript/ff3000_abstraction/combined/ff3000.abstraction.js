(function(oFF) {
	oFF.AbstractionMessageCodes = {
		NO_SYSTEM_NAME : 1,
		NO_CONNECTION_POOL : 2,
		NO_MATCHING_SYSTEM : 3,
		QUERY_FORMULA_ERROR : 4
	};
	oFF.ResponseUtil = {
		MESSAGE : "message",
		CODE : "code",
		EXTENDED_INFO : "extendedInfo",
		addMessage : function(messages, messageCode, message) {
			var jsonMessage = messages.addNewStructure();
			jsonMessage.putString(oFF.ResponseUtil.MESSAGE, message);
			jsonMessage.putInteger(oFF.ResponseUtil.CODE, messageCode);
		},
		addMessageExtended : function(messages, messageCode, message,
				extendedInfo) {
			var jsonMessage = messages.addNewStructure();
			jsonMessage.putString(oFF.ResponseUtil.MESSAGE, message);
			jsonMessage.putInteger(oFF.ResponseUtil.CODE, messageCode);
			jsonMessage.putString(oFF.ResponseUtil.EXTENDED_INFO, extendedInfo);
		},
		setSupported : function(structure, name, isSupported) {
			var supported = structure.putNewStructure(name);
			supported.putBoolean("supported", isSupported);
			return supported;
		}
	};
	oFF.FormulaSupportHandler = function() {
	};
	oFF.FormulaSupportHandler.prototype = new oFF.SyncAction();
	oFF.FormulaSupportHandler.create = function(featureListener,
			featureIdentifier) {
		var formulaHandler = new oFF.FormulaSupportHandler();
		formulaHandler.setupSynchronizingObject(null);
		formulaHandler.m_featureListener = featureListener;
		formulaHandler.m_featuerIdentifier = featureIdentifier;
		return formulaHandler;
	};
	oFF.FormulaSupportHandler.prototype.m_formulaListener = null;
	oFF.FormulaSupportHandler.prototype.m_featureListener = null;
	oFF.FormulaSupportHandler.prototype.m_featuerIdentifier = null;
	oFF.FormulaSupportHandler.prototype.processFormulaSupport = function(
			connection, syncType, formulaListener) {
		var systemType = connection.getSystemDescription().getSystemType();
		var _function;
		var formulaRequest;
		var formulas;
		var supportsVarianceOperator;
		var result;
		if (systemType.isTypeOf(oFF.SystemType.HANA)
				|| systemType.isTypeOf(oFF.SystemType.ABAP)) {
			this.m_formulaListener = formulaListener;
			_function = connection.newRpcFunction(systemType.getInAPath());
			formulaRequest = this._createFormulaRequest(connection);
			_function.getRequest().setRequestStructure(formulaRequest);
			_function.processFunctionExecution(syncType, this, systemType);
			return this;
		}
		formulas = oFF.PrFactory.createStructure();
		if (systemType.isTypeOf(oFF.SystemType.UNV)
				|| systemType.isTypeOf(oFF.SystemType.UQAS)) {
			this._setFormulaSupported(formulas, "abs", true);
			this._setFormulaSupported(formulas, "and", true);
			this._setFormulaSupported(formulas, "decfloat", true);
			this._setFormulaSupported(formulas, "double", true);
			this._setFormulaSupported(formulas, "float", true);
			this._setFormulaSupported(formulas, "if", true);
			this._setFormulaSupported(formulas, "int", true);
			this._setFormulaSupported(formulas, "isNull", true);
			this._setFormulaSupported(formulas, "length", true);
			this._setFormulaSupported(formulas, "like", true);
			this._setFormulaSupported(formulas, "log", true);
			this._setFormulaSupported(formulas, "log10", true);
			this._setFormulaSupported(formulas, "not", true);
			this._setFormulaSupported(formulas, "or", true);
			this._setFormulaSupported(formulas, "substring", true);
			this._setFormulaSupported(formulas, "-", true);
			this._setFormulaSupported(formulas, "/", true);
			this._setFormulaSupported(formulas, "+", true);
			this._setFormulaSupported(formulas, "*", true);
			this._setFormulaSupported(formulas, "**", true);
			this._setFormulaSupported(formulas, "==", true);
			this._setFormulaSupported(formulas, "!=", true);
			this._setFormulaSupported(formulas, ">=", true);
			this._setFormulaSupported(formulas, ">", true);
			this._setFormulaSupported(formulas, "<=", true);
			this._setFormulaSupported(formulas, "<", true);
		}
		supportsVarianceOperator = connection
				.supportsAnalyticCapability("SupportsOperatorVariance");
		this._setFormulaSupported(formulas, "operatorVariance",
				supportsVarianceOperator);
		this.setData(formulas);
		if (oFF.notNull(formulaListener)) {
			result = oFF.ExtResult.create(formulas, null);
			formulaListener.onFormulaSupport(result, this.m_featureListener,
					this.m_featuerIdentifier);
		}
		return this;
	};
	oFF.FormulaSupportHandler.prototype._setFormulaSupported = function(
			formulas, formulaName, isSupported) {
		oFF.ResponseUtil.setSupported(formulas, oFF.XString
				.toLowerCase(formulaName), isSupported);
	};
	oFF.FormulaSupportHandler.prototype._createFormulaRequest = function(
			connection) {
		var request = oFF.PrFactory.createStructure();
		var analytics = request.putNewStructure("Analytics");
		var definition = analytics.putNewStructure("Definition");
		var dataSource = definition.putNewStructure("DataSource");
		var systemType = connection.getSystemDescription().getSystemType();
		var dimensions;
		var dimension;
		var attributes;
		var attributeKey;
		var rsFeatureRequest;
		var capabilities;
		var returnedDataSelection;
		var capabilitiesbw;
		if (systemType.isTypeOf(oFF.SystemType.HANA)) {
			dataSource.putString("ObjectName", "$$FormulaFunctions$$");
		} else {
			if (systemType.isTypeOf(oFF.SystemType.ABAP)) {
				dataSource.putString("ObjectName", "$$DataSource$$");
				dataSource.putString("Type", "FormulaOperators");
			}
		}
		dimensions = definition.putNewList("Dimensions");
		dimension = dimensions.addNewStructure();
		dimension.putString("Axis", "Rows");
		dimension.putString("Name", "FunctionName");
		dimension.putInteger("SortOrder", 1);
		if (systemType.isTypeOf(oFF.SystemType.ABAP)) {
			dimension.putString("Name", "FormulaOperators");
			attributes = dimension.putNewList("Attributes");
			attributeKey = oFF.PrFactory.createStructure();
			attributeKey.putString("Name", "FormulaOperators.KEY");
			attributeKey.putString("Obtainability", "Always");
			attributes.add(attributeKey);
		}
		rsFeatureRequest = definition
				.putNewStructure("ResultSetFeatureRequest");
		rsFeatureRequest.putBoolean("IncludePerformanceData", false);
		rsFeatureRequest.putString("ResultEncoding", "None");
		rsFeatureRequest.putString("ResultFormat", "Version2");
		if (connection.supportsAnalyticCapability("ReturnedDataSelection")) {
			capabilities = analytics.putNewList("Capabilities");
			capabilities.addString("ReturnedDataSelection");
			returnedDataSelection = rsFeatureRequest
					.putNewStructure("ReturnedDataSelection");
			returnedDataSelection.putBoolean("Actions", false);
			returnedDataSelection.putBoolean("Exceptions", false);
			returnedDataSelection.putBoolean("InputEnabled", false);
			returnedDataSelection.putBoolean("UnitDescriptions", false);
			returnedDataSelection.putBoolean("UnitTypes", false);
			returnedDataSelection.putBoolean("Units", false);
			returnedDataSelection.putBoolean("TupleDisplayLevel", false);
			returnedDataSelection.putBoolean("TupleDrillState", false);
			returnedDataSelection.putBoolean("TupleParentIndexes", false);
			returnedDataSelection.putBoolean("Values", false);
			returnedDataSelection.putBoolean("ValuesFormatted", false);
		}
		if (connection
				.supportsAnalyticCapability("SupportsFormulaOperatorsCatalog")) {
			capabilitiesbw = analytics.putNewList("Capabilities");
			capabilitiesbw.addString("SupportsFormulaOperatorsCatalog");
		}
		return request;
	};
	oFF.FormulaSupportHandler.prototype.onFunctionExecuted = function(
			extResult, response, customIdentifier) {
		var formulas = null;
		var rootElement;
		var systemType;
		this.copyAllMessages(extResult);
		if (extResult.isValid()) {
			rootElement = response.getRootElement();
			oFF.InAHelper.importMessages(response.getRootElement(), this);
			systemType = customIdentifier;
			if (this.isValid()
					&& (systemType.isTypeOf(oFF.SystemType.HANA) || systemType
							.isTypeOf(oFF.SystemType.ABAP))) {
				formulas = this._readFormulaResponse(rootElement);
			}
		}
		this.setData(formulas);
		if (oFF.notNull(this.m_formulaListener)) {
			this.m_formulaListener.onFormulaSupport(oFF.ExtResult.create(
					formulas, extResult), this.m_featureListener,
					this.m_featuerIdentifier);
		}
	};
	oFF.FormulaSupportHandler.prototype._readFormulaResponse = function(
			rootElement) {
		var formulas = oFF.PrFactory.createStructure();
		var grids = rootElement.getListByKey("Grids");
		var grid = grids.getStructureAt(0);
		var axes = grid.getListByKey("Axes");
		var axis = axes.getStructureAt(0);
		var dimensions = axis.getListByKey("Dimensions");
		var dimension = dimensions.getStructureAt(0);
		var attributes = dimension.getListByKey("Attributes");
		var attribute = attributes.getStructureAt(0);
		var values = attribute.getListByKey("Values");
		var size = values.size();
		var i;
		for (i = 0; i < size; i++) {
			this._setFormulaSupported(formulas, values.getStringAt(i), true);
		}
		return formulas;
	};
	oFF.XAbstractionSystem = function() {
	};
	oFF.XAbstractionSystem.prototype = new oFF.SyncAction();
	oFF.XAbstractionSystem.FEATURES = "features";
	oFF.XAbstractionSystem.FORMULAS = "formulas";
	oFF.XAbstractionSystem.MESSAGES = "messages";
	oFF.XAbstractionSystem.createWithApplication = function(application) {
		var abstraction = new oFF.XAbstractionSystem();
		if (oFF.notNull(application)) {
			abstraction.m_connectionPool = application.getConnectionPool();
		}
		abstraction.setupSynchronizingObject(application);
		return abstraction;
	};
	oFF.XAbstractionSystem.prototype.m_connectionPool = null;
	oFF.XAbstractionSystem.prototype.releaseObject = function() {
		this.m_connectionPool = null;
		oFF.SyncAction.prototype.releaseObject.call(this);
	};
	oFF.XAbstractionSystem.prototype.processSupportedFeatures = function(
			systemName, syncType, featureListener, identifier) {
		var support = oFF.PrFactory.createStructure();
		var messages;
		var connection;
		this.setData(support);
		messages = support.putNewList(oFF.XAbstractionSystem.MESSAGES);
		if (oFF.XStringUtils.isNullOrEmpty(systemName)) {
			oFF.ResponseUtil.addMessage(messages,
					oFF.AbstractionMessageCodes.NO_SYSTEM_NAME,
					"No system name provided");
		}
		if (oFF.isNull(this.m_connectionPool)) {
			oFF.ResponseUtil.addMessage(messages,
					oFF.AbstractionMessageCodes.NO_CONNECTION_POOL,
					"No connection pool available. Set the application");
		} else {
			if (!this.m_connectionPool.getSystemLandscape().getSystemNames()
					.contains(systemName)) {
				oFF.ResponseUtil.addMessage(messages,
						oFF.AbstractionMessageCodes.NO_MATCHING_SYSTEM,
						"No matching system found");
			} else {
				connection = this.m_connectionPool.getConnection(systemName);
				this._supportedFeatures(support, connection);
				oFF.FormulaSupportHandler.create(featureListener, identifier)
						.processFormulaSupport(connection, syncType, this);
			}
		}
		return this;
	};
	oFF.XAbstractionSystem.prototype._supportedFeatures = function(support,
			connection) {
		var systemType = connection.getSystemDescription().getSystemType();
		var features = support.putNewStructure(oFF.XAbstractionSystem.FEATURES);
		var exceptionCapabilities = oFF.XListOfString.create();
		var supportsExceptions;
		var thresholds;
		var supportsScalingFactorRs;
		var supportsPaging;
		var pagingCapabilities;
		var windowing;
		exceptionCapabilities.add("Exceptions");
		exceptionCapabilities.add("ExceptionsV2");
		exceptionCapabilities.add("ExceptionSettings");
		supportsExceptions = this._supportsAnyCapability(connection,
				exceptionCapabilities);
		thresholds = oFF.ResponseUtil.setSupported(features, "thresholds",
				supportsExceptions);
		oFF.ResponseUtil.setSupported(thresholds, "constant",
				supportsExceptions);
		oFF.ResponseUtil
				.setSupported(thresholds, "measure", supportsExceptions);
		supportsScalingFactorRs = connection
				.supportsAnalyticCapability("UnifiedDataCells");
		oFF.ResponseUtil.setSupported(features, "scalingFactorResultset",
				supportsScalingFactorRs);
		if (systemType.isTypeOf(oFF.SystemType.HANA)
				|| systemType.isTypeOf(oFF.SystemType.UNV)
				|| systemType.isTypeOf(oFF.SystemType.UQAS)) {
			supportsPaging = true;
		} else {
			pagingCapabilities = oFF.XListOfString.create();
			pagingCapabilities.add("Paging");
			pagingCapabilities.add("PagingTupleCountTotal");
			pagingCapabilities.add("MDSLikePaging");
			supportsPaging = this._supportsAnyCapability(connection,
					pagingCapabilities);
		}
		windowing = oFF.ResponseUtil.setSupported(features, "windowing",
				supportsPaging);
		oFF.ResponseUtil.setSupported(windowing, "1Axis", supportsPaging);
		oFF.ResponseUtil.setSupported(windowing, "2Axis", supportsPaging);
		oFF.ResponseUtil.setSupported(windowing, "NAxes", false);
	};
	oFF.XAbstractionSystem.prototype._supportsAnyCapability = function(
			connection, capabilities) {
		var size = capabilities.size();
		var i;
		for (i = 0; i < size; i++) {
			if (connection.supportsAnalyticCapability(capabilities.get(i))) {
				return true;
			}
		}
		return false;
	};
	oFF.XAbstractionSystem.prototype.onFormulaSupport = function(extResult,
			featureListener, featureIdentifier) {
		var supports = this.getData();
		if (extResult.hasErrors()) {
			oFF.ResponseUtil
					.addMessageExtended(supports
							.getListByKey(oFF.XAbstractionSystem.MESSAGES),
							oFF.AbstractionMessageCodes.QUERY_FORMULA_ERROR,
							"Couldn't fetch available formulas", extResult
									.getSummary());
		} else {
			supports.put(oFF.XAbstractionSystem.FORMULAS, extResult.getData());
		}
		this.copyAllMessages(extResult);
		if (oFF.notNull(featureListener)) {
			featureListener.onFeatureSupport(extResult, supports,
					featureIdentifier);
		}
	};
	oFF.AbstractionModule = function() {
	};
	oFF.AbstractionModule.prototype = new oFF.DfModule();
	oFF.AbstractionModule.s_module = null;
	oFF.AbstractionModule.getInstance = function() {
		return oFF.AbstractionModule.initVersion(oFF.XVersion.API_DEFAULT);
	};
	oFF.AbstractionModule.initVersion = function(version) {
		var timestamp;
		if (oFF.isNull(oFF.AbstractionModule.s_module)) {
			oFF.DfModule.checkInitialized(oFF.RuntimeModule
					.initVersion(version));
			timestamp = oFF.DfModule.start("AbstractionModule...");
			oFF.AbstractionModule.s_module = new oFF.AbstractionModule();
			oFF.DfModule.stop(timestamp);
		}
		return oFF.AbstractionModule.s_module;
	};
	oFF.AbstractionModule.getInstance();
})(sap.firefly);