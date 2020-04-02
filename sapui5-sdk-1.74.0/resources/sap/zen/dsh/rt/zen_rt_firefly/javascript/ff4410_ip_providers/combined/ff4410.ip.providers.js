(function(oFF) {
	oFF.PlanningStateHandlerImpl = function() {
	};
	oFF.PlanningStateHandlerImpl.prototype = new oFF.XObject();
	oFF.PlanningStateHandlerImpl.prototype.update = function(application,
			systemName, response, messageCollector) {
		oFF.PlanningState.update(application, systemName, response,
				messageCollector);
	};
	oFF.PlanningStateHandlerImpl.prototype.updateFromResponse = function(
			application, systemName, request, response, messageCollector) {
		oFF.PlanningState.updateFromResponse(application, systemName, request,
				response, messageCollector);
	};
	oFF.PlanningStateHandlerImpl.prototype.getDataAreaStateByName = function(
			application, systemName, dataArea) {
		return oFF.DataAreaState.getDataAreaStateByName(application,
				systemName, dataArea);
	};
	oFF.PlanningVariableProcessorProviderFactory = function() {
	};
	oFF.PlanningVariableProcessorProviderFactory.prototype = new oFF.XObject();
	oFF.PlanningVariableProcessorProviderFactory.staticSetup = function() {
		oFF.PlanningCommandWithId.s_variableProcessorProviderFactory = new oFF.PlanningVariableProcessorProviderFactory();
	};
	oFF.PlanningVariableProcessorProviderFactory.prototype.createProvider = function(
			variableRequestor, requestorProvider) {
		return oFF.InAPlanningVarProcessorProvider
				.createInAVariableProcessorProvider(variableRequestor,
						requestorProvider);
	};
	oFF.InAPlanningCapabilitiesProviderFactory = function() {
	};
	oFF.InAPlanningCapabilitiesProviderFactory.prototype = new oFF.XObject();
	oFF.InAPlanningCapabilitiesProviderFactory.staticSetup = function() {
		oFF.PlanningService.s_capabilitiesProviderFactory = new oFF.InAPlanningCapabilitiesProviderFactory();
	};
	oFF.InAPlanningCapabilitiesProviderFactory.prototype.create = function(
			serverMetadata, providerType) {
		return oFF.InAQMgrCapabilities.create(serverMetadata, providerType);
	};
	oFF.InAPlanningVarProvider = function() {
	};
	oFF.InAPlanningVarProvider.prototype = new oFF.DfOlapEnvContext();
	oFF.InAPlanningVarProvider.prototype.m_connection = null;
	oFF.InAPlanningVarProvider.prototype.m_activeMainCapabilities = null;
	oFF.InAPlanningVarProvider.prototype.m_importVariables = null;
	oFF.InAPlanningVarProvider.prototype.m_export = null;
	oFF.InAPlanningVarProvider.prototype.m_isVariableSubmitNeeded = false;
	oFF.InAPlanningVarProvider.prototype.m_isReInitVariablesSupported = false;
	oFF.InAPlanningVarProvider.prototype.m_directVariableTransfer = false;
	oFF.InAPlanningVarProvider.prototype.m_isCheckVariablesSupported = false;
	oFF.InAPlanningVarProvider.prototype.setupVariablesProvider = function(
			application, connection, activeMainCapabilities) {
		this.setupOlapApplicationContext(application.getOlapEnvironment());
		this.m_connection = connection;
		this.m_activeMainCapabilities = activeMainCapabilities;
		this.m_export = oFF.QInAExportFactory.createForData(application,
				this.m_activeMainCapabilities);
		this.m_importVariables = oFF.QInAImportFactory.createForMetadata(
				application, this.m_activeMainCapabilities);
		this.m_isVariableSubmitNeeded = true;
		this.m_isCheckVariablesSupported = true;
		this.m_isReInitVariablesSupported = false;
		if (oFF.notNull(this.m_connection)) {
			this.m_isReInitVariablesSupported = this.m_connection
					.supportsAnalyticCapability(oFF.InACapabilities.VARIABLE_RE_SUBMIT);
		}
	};
	oFF.InAPlanningVarProvider.prototype.releaseObject = function() {
		this.m_connection = null;
		this.m_activeMainCapabilities = null;
		this.m_export = oFF.XObjectExt.release(this.m_export);
		this.m_importVariables = oFF.XObjectExt.release(this.m_importVariables);
		oFF.DfOlapEnvContext.prototype.releaseObject.call(this);
	};
	oFF.InAPlanningVarProvider.prototype.getConnection = function() {
		return this.m_connection;
	};
	oFF.InAPlanningVarProvider.prototype.getSystemDescription = function() {
		return this.m_connection.getSystemDescription();
	};
	oFF.InAPlanningVarProvider.prototype.getSystemName = function() {
		var systemDescription = this.getSystemDescription();
		if (oFF.isNull(systemDescription)) {
			return null;
		}
		return systemDescription.getSystemName();
	};
	oFF.InAPlanningVarProvider.prototype.getSystemType = function() {
		return this.getSystemDescription().getSystemType();
	};
	oFF.InAPlanningVarProvider.prototype.getRequestPath = function() {
		var connection = this.getConnection();
		var systemDescription = connection.getSystemDescription();
		var fastPathCap = this.m_activeMainCapabilities
				.getByKey(oFF.InACapabilities.FAST_PATH);
		if (oFF.notNull(fastPathCap) && fastPathCap.getValue() !== null) {
			return fastPathCap.getValue();
		}
		return systemDescription.getSystemType().getInAPath();
	};
	oFF.InAPlanningVarProvider.prototype.createFunction = function() {
		var connection = this.getConnection();
		var path = this.getRequestPath();
		var ocpFunction = connection.newRpcFunction(path);
		var request = ocpFunction.getRequest();
		request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
		return ocpFunction;
	};
	oFF.InAPlanningVarProvider.prototype.getVariablesExporter = function() {
		return this.m_export;
	};
	oFF.InAPlanningVarProvider.prototype.getVariablesImporter = function() {
		return this.m_importVariables;
	};
	oFF.InAPlanningVarProvider.prototype.isVariableValuesRuntimeNeeded = function() {
		return this.getSystemType().isTypeOf(oFF.SystemType.BW);
	};
	oFF.InAPlanningVarProvider.prototype.isVariableSubmitNeeded = function() {
		return this.m_isVariableSubmitNeeded;
	};
	oFF.InAPlanningVarProvider.prototype.setIsVariableSubmitNeeded = function(
			submit) {
		this.m_isVariableSubmitNeeded = submit;
	};
	oFF.InAPlanningVarProvider.prototype.supportsReInitVariables = function() {
		return this.m_isReInitVariablesSupported;
	};
	oFF.InAPlanningVarProvider.prototype.processRetrieveVariableRuntimeInformation = oFF.noSupport;
	oFF.InAPlanningVarProvider.prototype.processSetGetVariableValues = oFF.noSupport;
	oFF.InAPlanningVarProvider.prototype.processVariableSubmit = oFF.noSupport;
	oFF.InAPlanningVarProvider.prototype.processReInitVariableAfterSubmit = oFF.noSupport;
	oFF.InAPlanningVarProvider.prototype.processVariableCancel = oFF.noSupport;
	oFF.InAPlanningVarProvider.prototype.importVariables = oFF.noSupport;
	oFF.InAPlanningVarProvider.prototype.exportVariables = oFF.noSupport;
	oFF.InAPlanningVarProvider.prototype.setDirectVariableTransfer = function(
			directVariableTransfer) {
		this.m_directVariableTransfer = directVariableTransfer;
	};
	oFF.InAPlanningVarProvider.prototype.isDirectVariableTransfer = function() {
		return this.m_directVariableTransfer;
	};
	oFF.InAPlanningVarProvider.prototype.supportsCheckVariables = function() {
		return this.m_isCheckVariablesSupported
				&& this.isDirectVariableTransfer();
	};
	oFF.InAPlanningVarProvider.prototype.processCheckVariables = oFF.noSupport;
	oFF.InAPlanningVarProvider.prototype.supportsDirectVariableTransfer = oFF.noSupport;
	oFF.InAPlanningVarProvider.prototype.processActivateVariableVariant = oFF.noSupport;
	oFF.InAPlanningVarProvider.prototype.processEmptyVariableDefinition = oFF.noSupport;
	oFF.InAPlanningVarProvider.prototype.processUpdateDynamicVariables = oFF.noSupport;
	oFF.InAPlanningVarProcessorProvider = function() {
	};
	oFF.InAPlanningVarProcessorProvider.prototype = new oFF.InAPlanningVarProvider();
	oFF.InAPlanningVarProcessorProvider.createInAVariableProcessorProvider = function(
			variableRequestor, requestorProvider) {
		var provider = new oFF.InAPlanningVarProcessorProvider();
		provider.setupInAVariableProcessorProvider(variableRequestor,
				requestorProvider);
		return provider;
	};
	oFF.InAPlanningVarProcessorProvider.prototype.m_processor = null;
	oFF.InAPlanningVarProcessorProvider.prototype.m_requestorProvider = null;
	oFF.InAPlanningVarProcessorProvider.prototype.m_variableRequestorBase = null;
	oFF.InAPlanningVarProcessorProvider.prototype.setupInAVariableProcessorProvider = function(
			variableRequestorBase, requestorProvider) {
		var application = variableRequestorBase.getApplication();
		var systemName = variableRequestorBase.getSystemName();
		var connection = application.getConnection(systemName);
		var serverMetadata = connection.getServerMetadata();
		var capabilities = serverMetadata
				.getMetadataForService(oFF.ServerService.ANALYTIC);
		this.setupVariablesProvider(application, connection, capabilities);
		this.m_requestorProvider = requestorProvider;
		this.m_variableRequestorBase = variableRequestorBase;
		this.bindVariableRequestor();
	};
	oFF.InAPlanningVarProcessorProvider.prototype.releaseObject = function() {
		this.m_processor = oFF.XObjectExt.release(this.m_processor);
		this.m_requestorProvider = null;
		this.m_variableRequestorBase = null;
		oFF.InAPlanningVarProvider.prototype.releaseObject.call(this);
	};
	oFF.InAPlanningVarProcessorProvider.prototype.bindVariableRequestor = function() {
		var processor = oFF.QVariableProcessor.createVariableProcessor(this
				.getOlapEnv().getContext(), this, this.m_variableRequestorBase);
		this.m_processor = processor;
		this.m_variableRequestorBase.setVariableProcessorBase(processor);
	};
	oFF.InAPlanningVarProcessorProvider.prototype.importVariables = function(
			variablesList, variableContext) {
		var wrapper = oFF.PrFactory.createStructure();
		wrapper.put("Variables", variablesList);
		this.m_importVariables.importVariables(wrapper, variableContext);
	};
	oFF.InAPlanningVarProcessorProvider.prototype.exportVariables = function(
			variablesContext, parentStructure) {
		this.m_export.exportVariables(variablesContext, parentStructure);
	};
	oFF.InAPlanningVarProcessorProvider.prototype.processRetrieveVariableRuntimeInformation = function(
			syncType, listener, customIdentifier) {
		return oFF.InAPlanningVarGetRuntimeInfoAction.createAndRun(this,
				syncType, listener, customIdentifier);
	};
	oFF.InAPlanningVarProcessorProvider.prototype.processSetGetVariableValues = function(
			syncType, listener, customIdentifier) {
		return oFF.InAPlanningVarSetGetValuesAction.createAndRun(this,
				syncType, listener, customIdentifier);
	};
	oFF.InAPlanningVarProcessorProvider.prototype.processVariableSubmit = function(
			syncType, listener, customIdentifier) {
		return oFF.InAPlanningVarSubmitAction.createAndRun(this, syncType,
				listener, customIdentifier);
	};
	oFF.InAPlanningVarProcessorProvider.prototype.processReInitVariableAfterSubmit = function(
			syncType, listener, customIdentifier) {
		return oFF.InAPlanningVarReInitAfterSubmitAction.createAndRun(this,
				syncType, listener, customIdentifier);
	};
	oFF.InAPlanningVarProcessorProvider.prototype.processVariableCancel = function(
			syncType, listener, customIdentifier) {
		return oFF.InAPlanningVarCancelAction.createAndRun(this, syncType,
				listener, customIdentifier);
	};
	oFF.InAPlanningVarProcessorProvider.prototype.processCheckVariables = function(
			syncType, listener, customIdentifier) {
		return oFF.InAPlanningVarCheckVariablesAction.createAndRun(this,
				syncType, listener, customIdentifier);
	};
	oFF.InAPlanningVarProcessorProvider.prototype.getRequestorProvider = function() {
		return this.m_requestorProvider;
	};
	oFF.InAPlanningVarProcessorProvider.prototype.getVariableProcessor = function() {
		return this.m_processor;
	};
	oFF.InAPlanningVarProcessorProvider.prototype.getContext = function() {
		return null;
	};
	oFF.InAPlanningVarAction = function() {
	};
	oFF.InAPlanningVarAction.prototype = new oFF.QOlapSyncAction();
	oFF.InAPlanningVarAction.prototype.doStrictVariableProcessing = function() {
		var parent = this.getActionContext();
		var application;
		if (oFF.isNull(parent)) {
			return false;
		}
		application = parent.getApplication();
		return oFF.notNull(application);
	};
	oFF.InAPlanningVarAction.prototype.getProcessor = function() {
		return this.getActionContext().getVariableProcessor();
	};
	oFF.InAPlanningVarAction.prototype.checkDirectValueTransfer = function() {
		var variableProcessor;
		if (!this.doStrictVariableProcessing()) {
			return;
		}
		variableProcessor = this.getActionContext().getVariableProcessor();
		if (oFF.isNull(variableProcessor)) {
			return;
		}
		if (variableProcessor.isDirectVariableTransferEnabled()) {
			throw oFF.XException
					.createIllegalStateException("stateful variable handling cannot be mixed with direct variable transfer");
		}
	};
	oFF.InAPlanningVarAction.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		listener.onVariableProcessorExecuted(extResult, data, customIdentifier);
	};
	oFF.InAPlanningVarAction.prototype.createFunction = function() {
		return this.getActionContext().createFunction();
	};
	oFF.InAPlanningVarAction.prototype.getComponentName = function() {
		return "InAVariableAction";
	};
	oFF.InAPlanningVarAction.prototype.setVariablesStructure = function(
			rootElement) {
		var deepCopy;
		var provider;
		var cubeStructure;
		var message2;
		var importer;
		var processor;
		if (oFF.notNull(rootElement)) {
			deepCopy = oFF.PrStructure.createDeepCopy(rootElement);
			provider = this.getActionContext();
			oFF.PlanningState.update(provider.getApplication(), provider
					.getSystemName(), deepCopy, this);
			if (!oFF.InAHelper.importMessages(deepCopy, this)) {
				cubeStructure = deepCopy.getStructureByKey("Cube");
				if (oFF.isNull(cubeStructure)) {
					message2 = deepCopy.toString();
					this.addError(oFF.ErrorCodes.PARSER_ERROR, message2);
					return false;
				}
				importer = this.getImporter();
				processor = this.getProcessor();
				importer.importVariables(cubeStructure, processor
						.getVariableContainerBase());
				return true;
			}
		}
		return false;
	};
	oFF.InAPlanningVarAction.prototype.setStructure = function(rootElement) {
		var deepCopy;
		var provider;
		if (oFF.notNull(rootElement)) {
			deepCopy = oFF.PrStructure.createDeepCopy(rootElement);
			provider = this.getActionContext();
			oFF.PlanningState.update(provider.getApplication(), provider
					.getSystemName(), deepCopy, this);
			return !oFF.InAHelper.importMessages(deepCopy, this);
		}
		return false;
	};
	oFF.InAPlanningVarAction.prototype.getImporter = function() {
		return this.getActionContext().getVariablesImporter();
	};
	oFF.InAPlanningVarAction.prototype.getExporter = function() {
		return this.getActionContext().getVariablesExporter();
	};
	oFF.InAPlanningVarAction.prototype.isSuccessfullyProcessed = function() {
		return this.isValid();
	};
	oFF.InAPlanningVarAction.prototype.getRequestorProvider = function() {
		return this.getActionContext().getRequestorProvider();
	};
	oFF.InAPlanningVarCancelAction = function() {
	};
	oFF.InAPlanningVarCancelAction.prototype = new oFF.InAPlanningVarAction();
	oFF.InAPlanningVarCancelAction.createAndRun = function(parent, syncType,
			listener, customIdentifier) {
		var newObject = new oFF.InAPlanningVarCancelAction();
		newObject.setupActionAndRun(syncType, parent, listener,
				customIdentifier);
		return newObject;
	};
	oFF.InAPlanningVarCancelAction.prototype.getComponentName = function() {
		return "InAVariableCancelAction";
	};
	oFF.InAPlanningVarCancelAction.prototype.processSynchronization = function(
			syncType) {
		return false;
	};
	oFF.InAPlanningVarCancelAction.prototype.onFunctionExecuted = function(
			extResult, response, customIdentifier) {
		this.addAllMessages(extResult);
		if (extResult.isValid() && oFF.notNull(response)) {
			this.getQueryManagerBase().setVariableProcessorState(
					oFF.VariableProcessorState.SUBMITTED);
		}
		this.setData(this);
		this.endSync();
	};
	oFF.InAPlanningVarCheckVariablesAction = function() {
	};
	oFF.InAPlanningVarCheckVariablesAction.prototype = new oFF.InAPlanningVarAction();
	oFF.InAPlanningVarCheckVariablesAction.createAndRun = function(parent,
			syncType, listener, customIdentifier) {
		var newObject = new oFF.InAPlanningVarCheckVariablesAction();
		newObject.setupActionAndRun(syncType, parent, listener,
				customIdentifier);
		return newObject;
	};
	oFF.InAPlanningVarCheckVariablesAction.prototype.getComponentName = function() {
		return "InAVariableCheckVariablesAction";
	};
	oFF.InAPlanningVarCheckVariablesAction.prototype.processSynchronization = function(
			syncType) {
		return false;
	};
	oFF.InAPlanningVarCheckVariablesAction.prototype.onFunctionExecuted = function(
			extResult, response, customIdentifier) {
		var rootElement;
		this.addAllMessages(extResult);
		if (extResult.isValid() && oFF.notNull(response)) {
			rootElement = response.getRootElement();
			this.setStructure(rootElement);
		}
		this.setData(this);
		this.endSync();
	};
	oFF.InAPlanningVarGetRuntimeInfoAction = function() {
	};
	oFF.InAPlanningVarGetRuntimeInfoAction.prototype = new oFF.InAPlanningVarAction();
	oFF.InAPlanningVarGetRuntimeInfoAction.createAndRun = function(parent,
			syncType, listener, customIdentifier) {
		var newObject = new oFF.InAPlanningVarGetRuntimeInfoAction();
		newObject.setupActionAndRun(syncType, parent, listener,
				customIdentifier);
		return newObject;
	};
	oFF.InAPlanningVarGetRuntimeInfoAction.prototype.getComponentName = function() {
		return "InAVariableGetRuntimeInfoAction";
	};
	oFF.InAPlanningVarGetRuntimeInfoAction.prototype.processSynchronization = function(
			syncType) {
		var ocpFunction;
		var requestStructure;
		var requestorProvider;
		this.checkDirectValueTransfer();
		ocpFunction = this.createFunction();
		requestStructure = oFF.PrStructure.create();
		requestorProvider = this.getRequestorProvider();
		requestorProvider.fillVariableRequestorDataRequestContext(
				requestStructure, false, "VariableDefinition", null);
		this.getProcessor().setVariableProcessorState(
				oFF.VariableProcessorState.PROCESSING_UPDATE_VALUES);
		ocpFunction.getRequest().setRequestStructure(requestStructure);
		ocpFunction.processFunctionExecution(syncType, this, null);
		return true;
	};
	oFF.InAPlanningVarGetRuntimeInfoAction.prototype.onFunctionExecuted = function(
			extResult, response, customIdentifier) {
		var rootElement;
		var successfullyProcessed;
		this.addAllMessages(extResult);
		if (extResult.isValid() && oFF.notNull(response)) {
			rootElement = response.getRootElement();
			successfullyProcessed = this.setVariablesStructure(rootElement);
			if (successfullyProcessed) {
				this.getProcessor().setVariableProcessorState(
						oFF.VariableProcessorState.CHANGEABLE_REINIT);
			} else {
				this.addError(oFF.ErrorCodes.OTHER_ERROR,
						"Error when setting variable structure");
			}
		}
		this.setData(this);
		this.endSync();
	};
	oFF.InAPlanningVarReInitAfterSubmitAction = function() {
	};
	oFF.InAPlanningVarReInitAfterSubmitAction.prototype = new oFF.InAPlanningVarAction();
	oFF.InAPlanningVarReInitAfterSubmitAction.createAndRun = function(parent,
			syncType, listener, customIdentifier) {
		var newObject = new oFF.InAPlanningVarReInitAfterSubmitAction();
		newObject.setupActionAndRun(syncType, parent, listener,
				customIdentifier);
		return newObject;
	};
	oFF.InAPlanningVarReInitAfterSubmitAction.prototype.getComponentName = function() {
		return "InAVariableReInitAfterSubmitAction";
	};
	oFF.InAPlanningVarReInitAfterSubmitAction.prototype.processSynchronization = function(
			syncType) {
		return false;
	};
	oFF.InAPlanningVarReInitAfterSubmitAction.prototype.onVariableProcessorExecuted = function(
			extResult, result, customIdentifier) {
		this.addAllMessages(extResult);
		this.setData(this);
		this.endSync();
	};
	oFF.InAPlanningVarSetGetValuesAction = function() {
	};
	oFF.InAPlanningVarSetGetValuesAction.prototype = new oFF.InAPlanningVarAction();
	oFF.InAPlanningVarSetGetValuesAction.createAndRun = function(parent,
			syncType, listener, customIdentifier) {
		var newObject = new oFF.InAPlanningVarSetGetValuesAction();
		newObject.setupActionAndRun(syncType, parent, listener,
				customIdentifier);
		return newObject;
	};
	oFF.InAPlanningVarSetGetValuesAction.prototype.getComponentName = function() {
		return "InAVariableSetGetValuesAction";
	};
	oFF.InAPlanningVarSetGetValuesAction.prototype.processSynchronization = function(
			syncType) {
		return false;
	};
	oFF.InAPlanningVarSetGetValuesAction.prototype.onFunctionExecuted = function(
			extResult, response, customIdentifier) {
		var rootElement;
		var successfullyProcessed;
		this.addAllMessages(extResult);
		if (extResult.isValid() && oFF.notNull(response)) {
			rootElement = response.getRootElement();
			successfullyProcessed = this.setVariablesStructure(rootElement);
			if (successfullyProcessed) {
				this.getQueryManagerBase().returnToPreviousProcessorState();
			} else {
				this.addError(oFF.ErrorCodes.OTHER_ERROR,
						"Error when setting variable structure");
			}
		}
		this.setData(this);
		this.endSync();
	};
	oFF.InAPlanningVarSubmitAction = function() {
	};
	oFF.InAPlanningVarSubmitAction.prototype = new oFF.InAPlanningVarAction();
	oFF.InAPlanningVarSubmitAction.createAndRun = function(parent, syncType,
			listener, customIdentifier) {
		var newObject = new oFF.InAPlanningVarSubmitAction();
		newObject.setupActionAndRun(syncType, parent, listener,
				customIdentifier);
		return newObject;
	};
	oFF.InAPlanningVarSubmitAction.prototype.getComponentName = function() {
		return "InAVariableSubmitAction";
	};
	oFF.InAPlanningVarSubmitAction.prototype.processSynchronization = function(
			syncType) {
		var ocpFunction;
		var requestStructure;
		var requestorProvider;
		var inaDefinition;
		this.checkDirectValueTransfer();
		if (!this.getActionContext().isVariableSubmitNeeded()) {
			this.setData(this);
			return false;
		}
		ocpFunction = this.createFunction();
		requestStructure = oFF.PrStructure.create();
		requestorProvider = this.getRequestorProvider();
		inaDefinition = requestorProvider
				.fillVariableRequestorDataRequestContext(requestStructure,
						false, "VariableSubmit", null);
		this.getExporter().exportVariables(
				this.getProcessor().getVariableContainer(), inaDefinition);
		ocpFunction.getRequest().setRequestStructure(requestStructure);
		ocpFunction.processFunctionExecution(syncType, this, null);
		return true;
	};
	oFF.InAPlanningVarSubmitAction.prototype.onFunctionExecuted = function(
			extResult, response, customIdentifier) {
		var rootElement;
		var successfullyProcessed;
		this.addAllMessages(extResult);
		if (extResult.isValid() && oFF.notNull(response)) {
			rootElement = response.getRootElement();
			successfullyProcessed = this.setStructure(rootElement);
			this.getProcessor().setVariableProcessorState(
					oFF.VariableProcessorState.SUBMITTED);
			if (!successfullyProcessed) {
				this.addError(oFF.ErrorCodes.OTHER_ERROR,
						"Error when setting variable structure");
			}
		}
		this.setData(this);
		this.endSync();
	};
	oFF.IpProviderModule = function() {
	};
	oFF.IpProviderModule.prototype = new oFF.DfModule();
	oFF.IpProviderModule.s_module = null;
	oFF.IpProviderModule.getInstance = function() {
		return oFF.IpProviderModule.initVersion(oFF.XVersion.API_DEFAULT);
	};
	oFF.IpProviderModule.initVersion = function(version) {
		var timestamp;
		if (oFF.isNull(oFF.IpProviderModule.s_module)) {
			oFF.DfModule
					.checkInitialized(oFF.IpImplModule.initVersion(version));
			oFF.DfModule.checkInitialized(oFF.ProviderModule
					.initVersion(version));
			timestamp = oFF.DfModule.start("IpProviderModule...");
			oFF.IpProviderModule.s_module = new oFF.IpProviderModule();
			oFF.InAPlanningCapabilitiesProviderFactory.staticSetup();
			oFF.PlanningVariableProcessorProviderFactory.staticSetup();
			oFF.PlanningStateHandler
					.setInstance(new oFF.PlanningStateHandlerImpl());
			oFF.DfModule.stop(timestamp);
		}
		return oFF.IpProviderModule.s_module;
	};
	oFF.IpProviderModule.getInstance();
})(sap.firefly);