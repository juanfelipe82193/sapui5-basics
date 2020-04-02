(function(oFF) {
	oFF.CommandSpaceFactoryImpl = function() {
	};
	oFF.CommandSpaceFactoryImpl.prototype = new oFF.XObject();
	oFF.CommandSpaceFactoryImpl.prototype.createCommandSpaceWithSelection = function(
			application, sigSelExpression) {
		return oFF.QCmdSpace.createBySelection(application, sigSelExpression);
	};
	oFF.CommandSpaceFactoryImpl.prototype.createCommandSpaceWithElement = function(
			application, modelComponent) {
		return oFF.QCmdSpace.createWithElement(application, modelComponent);
	};
	oFF.CommandSpaceFactoryImpl.prototype.newSpacer = function(session) {
		return oFF.QCmdSpace.createWithElement(null, null);
	};
	oFF.XCommandUtil = {
		updateExtendedDimensionPackages : function(extendedDimensions,
				extendedDimensionsInfo) {
			var extDimSize;
			var i;
			var extendedDimension;
			var extendedDimensionInfo;
			var newPackageName;
			var dataSource;
			if (!oFF.XCollectionUtils.hasElements(extendedDimensions)
					|| !oFF.XCollectionUtils
							.hasElements(extendedDimensionsInfo)) {
				return;
			}
			extDimSize = extendedDimensions.size();
			for (i = 0; i < extDimSize; i++) {
				extendedDimension = extendedDimensions.get(i);
				extendedDimensionInfo = oFF.XCommandUtil.getExtDimInfoByName(
						extendedDimension.getName(), extendedDimensionsInfo);
				if (oFF.notNull(extendedDimensionInfo)) {
					newPackageName = extendedDimensionInfo.getStructureByKey(
							"dataSource").getStringByKey("packageName");
					dataSource = extendedDimensions.get(i).getDataSource();
					dataSource.setPackageName(newPackageName);
				}
			}
		},
		getExtDimInfoByName : function(extDimName, extendedDimensionInfo) {
			var size = extendedDimensionInfo.size();
			var i;
			var extendedDimension;
			for (i = 0; i < size; i++) {
				extendedDimension = extendedDimensionInfo.getStructureAt(i);
				if (oFF.XString.isEqual(extDimName, extendedDimension
						.getStringByKey("name"))) {
					return extendedDimension;
				}
			}
			return null;
		},
		handleInactiveCapabilities : function(serviceConfig,
				experimentalFeatures, capabilitiesToSwitch) {
			var iterator;
			var capabilityName;
			var isActive;
			var inactiveCapabilities;
			var experimentalFeatureSet;
			oFF.XCommandUtil.activateExperimentalFeatures(serviceConfig,
					experimentalFeatures);
			if (oFF.notNull(capabilitiesToSwitch)) {
				iterator = capabilitiesToSwitch.getKeysAsIteratorOfString();
				while (iterator.hasNext()) {
					capabilityName = iterator.next();
					isActive = capabilitiesToSwitch.getByKey(capabilityName)
							.getBoolean();
					inactiveCapabilities = oFF.InactiveCapabilities
							.getCapabilityByName(capabilityName);
					if (isActive) {
						oFF.XCommandUtil.activate(serviceConfig,
								inactiveCapabilities);
					} else {
						experimentalFeatureSet = serviceConfig
								.getExperimentalFeatureSet();
						if (oFF.notNull(experimentalFeatureSet)) {
							experimentalFeatureSet
									.removeElement(inactiveCapabilities);
						}
					}
				}
			}
		},
		activateExperimentalFeatures : function(serviceConfig,
				experimentalFeatures) {
			var listOfExperimentalFeatures;
			var size;
			var i;
			if (oFF.XStringUtils.isNotNullAndNotEmpty(experimentalFeatures)) {
				if (oFF.XString.containsString(experimentalFeatures, ",")) {
					listOfExperimentalFeatures = oFF.XStringTokenizer
							.splitString(experimentalFeatures, ",");
					size = listOfExperimentalFeatures.size();
					for (i = 0; i < size; i++) {
						oFF.XCommandUtil
								.activate(
										serviceConfig,
										oFF.InactiveCapabilities
												.getCapabilityByName(listOfExperimentalFeatures
														.get(i)));
					}
				} else {
					oFF.XCommandUtil.activate(serviceConfig,
							oFF.InactiveCapabilities
									.getCapabilityByName(experimentalFeatures));
				}
			}
		},
		activate : function(serviceConfig, capability) {
			var maxXVersion;
			if (oFF.isNull(capability)) {
				return;
			}
			maxXVersion = capability.getMaxXVersion();
			if (maxXVersion >= 0
					&& maxXVersion <= serviceConfig.getApplication()
							.getVersion()) {
				return;
			}
			serviceConfig.activateExperimentalFeature(capability);
		}
	};
	oFF.QCmdContextFactory = function() {
	};
	oFF.QCmdContextFactory.prototype = new oFF.XObject();
	oFF.QCmdContextFactory.s_cmdFactoryList = null;
	oFF.QCmdContextFactory.staticSetup = function() {
		oFF.QCmdContextFactory.s_cmdFactoryList = oFF.XList.create();
	};
	oFF.QCmdContextFactory.register = function(factory) {
		oFF.QCmdContextFactory.s_cmdFactoryList.add(factory);
	};
	oFF.QCmdContextFactory.createCmdContext = function(olapApplication,
			component) {
		var size;
		var i;
		var factory;
		var cmdContext;
		if (oFF.notNull(component)) {
			size = oFF.QCmdContextFactory.s_cmdFactoryList.size();
			for (i = 0; i < size; i++) {
				factory = oFF.QCmdContextFactory.s_cmdFactoryList.get(i);
				cmdContext = factory.newCmdContext(olapApplication, component);
				if (oFF.notNull(cmdContext)) {
					return cmdContext;
				}
			}
		}
		return null;
	};
	oFF.XCommand = function() {
	};
	oFF.XCommand.prototype = new oFF.XObject();
	oFF.XCommand.prototype.m_commandContext = null;
	oFF.XCommand.prototype.m_final = false;
	oFF.XCommand.prototype.m_parameters = null;
	oFF.XCommand.prototype.m_followUpCommands = null;
	oFF.XCommand.prototype.m_followUpCommandParameterMappings = null;
	oFF.XCommand.prototype.getCommandContext = function() {
		return this.m_commandContext;
	};
	oFF.XCommand.prototype.setupCommand = function(commandContext) {
		this.m_commandContext = commandContext;
		this.m_final = false;
		this.m_parameters = oFF.XHashMapByString.create();
		this.m_followUpCommands = oFF.XHashMapByString.create();
		this.m_followUpCommandParameterMappings = oFF.XHashMapByString.create();
	};
	oFF.XCommand.prototype.releaseObject = function() {
		this.m_parameters = oFF.XObjectExt.release(this.m_parameters);
		this.m_followUpCommands = oFF.XObjectExt
				.release(this.m_followUpCommands);
		this.m_followUpCommandParameterMappings = oFF.XObjectExt
				.release(this.m_followUpCommandParameterMappings);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XCommand.prototype.addParameter = function(parameterName,
			parameterValue) {
		this.assertFinal(false);
		oFF.XStringUtils.checkStringNotEmpty(parameterName,
				"illegal parameter name");
		this.m_parameters.put(parameterName, parameterValue);
		return this;
	};
	oFF.XCommand.prototype.getParameter = function(parameterName) {
		oFF.XStringUtils.checkStringNotEmpty(parameterName,
				"illegal parameter name");
		return this.m_parameters.getByKey(parameterName);
	};
	oFF.XCommand.prototype.addParameterString = function(parameterName,
			parameterValue) {
		return this.addParameter(parameterName, oFF.XStringValue
				.create(parameterValue));
	};
	oFF.XCommand.prototype.addParameterBoolean = function(parameterName,
			parameterValue) {
		return this.addParameter(parameterName, oFF.XBooleanValue
				.create(parameterValue));
	};
	oFF.XCommand.prototype.addParameterInteger = function(parameterName,
			parameterValue) {
		return this.addParameter(parameterName, oFF.XIntegerValue
				.create(parameterValue));
	};
	oFF.XCommand.prototype.assertFinal = function(shouldBeFinal) {
		if (this.m_final !== shouldBeFinal) {
			throw oFF.XException.createIllegalStateException("final");
		}
	};
	oFF.XCommand.prototype.setFollowUpCommand = function(followUpType, command) {
		this.assertFinal(false);
		if (oFF.isNull(command)) {
			this.m_followUpCommands.remove(followUpType.getName());
		} else {
			this.m_followUpCommands.put(followUpType.getName(), command);
		}
		return this;
	};
	oFF.XCommand.prototype.getFollowUpCommand = function(followUpType) {
		return this.m_followUpCommands.getByKey(followUpType.getName());
	};
	oFF.XCommand.prototype.setFollowUpCommandParameterMapping = function(
			followUpType, followUpParameterName, resultParameterName) {
		var deleteParameter;
		var parameterMappings;
		this.assertFinal(false);
		oFF.XStringUtils.checkStringNotEmpty(followUpParameterName,
				"illegal parameter name");
		deleteParameter = oFF.XStringUtils.isNullOrEmpty(resultParameterName);
		parameterMappings = this.m_followUpCommandParameterMappings
				.getByKey(followUpType.getName());
		if (oFF.isNull(parameterMappings)) {
			if (!deleteParameter) {
				parameterMappings = oFF.XHashMapOfStringByString.create();
				this.m_followUpCommandParameterMappings.put(followUpType
						.getName(), parameterMappings);
				parameterMappings.put(followUpParameterName,
						resultParameterName);
			}
		} else {
			if (deleteParameter) {
				parameterMappings.remove(followUpParameterName);
				if (parameterMappings.isEmpty()) {
					this.m_followUpCommandParameterMappings.remove(followUpType
							.getName());
				}
			} else {
				parameterMappings.put(followUpParameterName,
						resultParameterName);
			}
		}
		return this;
	};
	oFF.XCommand.prototype.getFollowUpParameterMappings = function(followUpType) {
		this.assertFinal(true);
		return this.m_followUpCommandParameterMappings.getByKey(followUpType
				.getName());
	};
	oFF.XCommand.prototype.processCommand = function(syncType, commandListener,
			customIdentifier) {
		var commandResultClass;
		var newInstance;
		var commandResult;
		this.m_final = true;
		commandResultClass = this.getCommandResultClass();
		newInstance = commandResultClass.newInstance(this);
		commandResult = newInstance;
		return commandResult.processCommand(this, syncType, commandListener,
				customIdentifier);
	};
	oFF.XCommandResult = function() {
	};
	oFF.XCommandResult.prototype = new oFF.XObject();
	oFF.XCommandResult.prototype.m_command = null;
	oFF.XCommandResult.prototype.m_syncType = null;
	oFF.XCommandResult.prototype.m_commandListener = null;
	oFF.XCommandResult.prototype.m_customIdentifier = null;
	oFF.XCommandResult.prototype.m_messageManager = null;
	oFF.XCommandResult.prototype.m_extResult = null;
	oFF.XCommandResult.prototype.m_resultParameters = null;
	oFF.XCommandResult.prototype.m_processFinished = false;
	oFF.XCommandResult.prototype.m_followUpFinished = false;
	oFF.XCommandResult.prototype.m_followUpCommandsSize = 0;
	oFF.XCommandResult.prototype.m_followUpCommandsProcessed = 0;
	oFF.XCommandResult.prototype.m_followUpCommandResults = null;
	oFF.XCommandResult.prototype.getCommand = function() {
		return this.m_command;
	};
	oFF.XCommandResult.prototype.getCommandBase = function() {
		return this.m_command;
	};
	oFF.XCommandResult.prototype.getMessageManager = function() {
		return this.m_messageManager;
	};
	oFF.XCommandResult.prototype.getSyncType = function() {
		return this.m_syncType;
	};
	oFF.XCommandResult.prototype.processCommand = function(command, syncType,
			commandListener, customIdentifier) {
		this.m_command = command;
		this.m_syncType = syncType;
		this.m_commandListener = commandListener;
		this.m_customIdentifier = customIdentifier;
		this.m_messageManager = oFF.MessageManager.createMessageManager();
		this.m_extResult = oFF.ExtResult.createWithExternalMessages(this,
				this.m_messageManager);
		this.m_resultParameters = oFF.XHashMapByString.create();
		this.m_followUpCommandResults = oFF.XHashMapByString.create();
		this.m_processFinished = false;
		this.m_followUpFinished = false;
		this.m_followUpCommandsSize = 0;
		this.m_followUpCommandsProcessed = 0;
		this.process();
		return this.m_extResult;
	};
	oFF.XCommandResult.prototype.releaseObject = function() {
		this.m_command = null;
		this.m_syncType = null;
		this.m_commandListener = null;
		this.m_customIdentifier = null;
		this.m_messageManager = oFF.XObjectExt.release(this.m_messageManager);
		this.m_extResult = oFF.XObjectExt.release(this.m_extResult);
		this.m_resultParameters = oFF.XObjectExt
				.release(this.m_resultParameters);
		this.m_followUpCommandResults = oFF.XObjectExt
				.release(this.m_followUpCommandResults);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XCommandResult.prototype.onProcessFinished = function() {
		var followUpTypesToProcess;
		this.m_processFinished = true;
		followUpTypesToProcess = this.getFollowUpTypesToProcess();
		this.m_followUpCommandsSize = followUpTypesToProcess.size();
		if (this.m_followUpCommandsSize > 0) {
			this.processFollowUpCommands(followUpTypesToProcess);
		} else {
			this.m_followUpFinished = true;
			this.onNotifyListener();
		}
	};
	oFF.XCommandResult.prototype.getFollowUpTypesToProcess = function() {
		var followUpTypes;
		this.assertProcessFinished(true);
		this.assertFollowUpFinished(false);
		followUpTypes = oFF.XList.create();
		if (this.getFollowUpCommand(oFF.XCommandFollowUpType.ALWAYS) !== null) {
			followUpTypes.add(oFF.XCommandFollowUpType.ALWAYS);
		}
		if (this.getMessageManager().hasErrors()) {
			if (this.getFollowUpCommand(oFF.XCommandFollowUpType.ERROR) !== null) {
				followUpTypes.add(oFF.XCommandFollowUpType.ERROR);
			}
		} else {
			if (this.getFollowUpCommand(oFF.XCommandFollowUpType.SUCCESS) !== null) {
				followUpTypes.add(oFF.XCommandFollowUpType.SUCCESS);
			}
		}
		return followUpTypes;
	};
	oFF.XCommandResult.prototype.processFollowUpCommands = function(
			followUpTypesToProcess) {
		var typesIndex;
		var followUpType;
		var followUpCommand;
		var parameterValuesEffective;
		var parameterNames;
		var namesIndex;
		var parameterName;
		var parameterValue;
		for (typesIndex = 0; typesIndex < followUpTypesToProcess.size(); typesIndex++) {
			followUpType = followUpTypesToProcess.get(typesIndex);
			followUpCommand = this.getFollowUpCommand(followUpType);
			parameterValuesEffective = this
					.getFollowUpParameterValuesEffective(followUpType);
			if (oFF.notNull(parameterValuesEffective)) {
				parameterNames = parameterValuesEffective
						.getKeysAsReadOnlyListOfString();
				for (namesIndex = 0; namesIndex < parameterNames.size(); namesIndex++) {
					parameterName = parameterNames.get(namesIndex);
					parameterValue = parameterValuesEffective
							.getByKey(parameterName);
					followUpCommand.addParameter(parameterName, parameterValue);
				}
			}
			followUpCommand.processCommand(this.getSyncType(), this,
					followUpType);
		}
	};
	oFF.XCommandResult.prototype.onNotifyListener = function() {
		if (oFF.notNull(this.m_commandListener)) {
			this.m_commandListener.onCommandProcessed(this.m_extResult, this,
					this.m_customIdentifier);
		}
	};
	oFF.XCommandResult.prototype.assertProcessFinished = function(
			shouldBeFinished) {
		if (this.m_processFinished !== shouldBeFinished) {
			throw oFF.XException
					.createIllegalStateException("Processing state is not as expected");
		}
	};
	oFF.XCommandResult.prototype.assertFollowUpFinished = function(
			shouldBeFinished) {
		if (this.m_followUpFinished !== shouldBeFinished) {
			throw oFF.XException
					.createIllegalStateException("FollowUp state is not as expected");
		}
	};
	oFF.XCommandResult.prototype.addResultParameter = function(parameterName,
			parameterValue) {
		this.assertProcessFinished(false);
		oFF.XStringUtils.checkStringNotEmpty(parameterName,
				"illegal parameter name");
		this.m_resultParameters.put(parameterName, parameterValue);
		return this;
	};
	oFF.XCommandResult.prototype.getResultParameter = function(parameterName) {
		this.assertProcessFinished(true);
		oFF.XStringUtils.checkStringNotEmpty(parameterName,
				"illegal parameter name");
		return this.m_resultParameters.getByKey(parameterName);
	};
	oFF.XCommandResult.prototype.addFollowUpCommandResult = function(
			followUpType, commandResult) {
		this.assertFollowUpFinished(false);
		if (oFF.isNull(commandResult)) {
			this.m_followUpCommandResults.remove(followUpType.getName());
		} else {
			this.m_followUpCommandResults.put(followUpType.getName(),
					commandResult);
		}
	};
	oFF.XCommandResult.prototype.getFollowUpCommandResult = function(
			followUpType) {
		this.assertFollowUpFinished(true);
		return this.m_followUpCommandResults.getByKey(followUpType.getName());
	};
	oFF.XCommandResult.prototype.getParameterStrict = function(parameterName) {
		var parameterValue = this.getCommandBase().getParameter(parameterName);
		oFF.XObjectExt.checkNotNull(parameterValue, "parameter null");
		return parameterValue;
	};
	oFF.XCommandResult.prototype.getParameter = function(parameterName) {
		var parameterValue = this.getCommandBase().getParameter(parameterName);
		if (oFF.isNull(parameterValue)) {
			return null;
		}
		return parameterValue;
	};
	oFF.XCommandResult.prototype.getParameterStringStrict = function(
			parameterName) {
		var parameterValue = this.getCommandBase().getParameter(parameterName);
		oFF.XObjectExt.checkNotNull(parameterValue, "parameter null");
		return parameterValue.getString();
	};
	oFF.XCommandResult.prototype.getParameterString = function(parameterName) {
		var parameterValue = this.getCommandBase().getParameter(parameterName);
		if (oFF.isNull(parameterValue)) {
			return null;
		}
		return parameterValue.getString();
	};
	oFF.XCommandResult.prototype.getFollowUpCommand = function(followUpType) {
		return this.getCommandBase().getFollowUpCommand(followUpType);
	};
	oFF.XCommandResult.prototype.getFollowUpParameterValuesEffective = function(
			followUpType) {
		var resultParameterValues;
		var parameterMappings;
		var mappingKeys;
		var mappingIndex;
		var targetParameterName;
		var sourceParameterName;
		var sourceResultValue;
		this.assertProcessFinished(true);
		resultParameterValues = null;
		parameterMappings = this.getCommandBase().getFollowUpParameterMappings(
				followUpType);
		if (oFF.notNull(parameterMappings)) {
			mappingKeys = parameterMappings.getKeysAsReadOnlyListOfString();
			for (mappingIndex = 0; mappingIndex < mappingKeys.size(); mappingIndex++) {
				targetParameterName = mappingKeys.get(mappingIndex);
				sourceParameterName = parameterMappings
						.getByKey(targetParameterName);
				sourceResultValue = this
						.getResultParameter(sourceParameterName);
				if (oFF.notNull(sourceResultValue)) {
					if (oFF.isNull(resultParameterValues)) {
						resultParameterValues = oFF.XHashMapByString.create();
					}
					resultParameterValues.put(targetParameterName,
							sourceResultValue);
				}
			}
		}
		return resultParameterValues;
	};
	oFF.XCommandResult.prototype.onCommandProcessed = function(extResult,
			commandResult, customIdentifier) {
		var followUpType;
		this.assertFollowUpFinished(false);
		if (this.m_followUpCommandsProcessed >= this.m_followUpCommandsSize) {
			throw oFF.XException.createIllegalStateException("internal error");
		}
		oFF.MessageUtil.checkNoError(extResult);
		followUpType = customIdentifier;
		this.addFollowUpCommandResult(followUpType, commandResult);
		this.m_followUpCommandsProcessed++;
		if (this.m_followUpCommandsProcessed === this.m_followUpCommandsSize) {
			this.m_followUpFinished = true;
			this.onNotifyListener();
		}
	};
	oFF.QCmdContextOlapFactory = function() {
	};
	oFF.QCmdContextOlapFactory.prototype = new oFF.QCmdContextFactory();
	oFF.QCmdContextOlapFactory.staticSetupOlapFactory = function() {
		var factory = new oFF.QCmdContextOlapFactory();
		oFF.QCmdContextFactory.register(factory);
	};
	oFF.QCmdContextOlapFactory.prototype.newCmdContext = function(
			olapApplication, component) {
		var olapComponentType = component.getComponentType();
		if (olapComponentType === oFF.OlapComponentType.QUERY_MODEL
				|| olapComponentType === oFF.OlapComponentType.QUERY_MANAGER
				|| olapComponentType === oFF.OlapComponentType.OLAP_DATA_PROVIDER) {
			return oFF.QConvenienceCommands.create(olapApplication, component);
		}
		return null;
	};
	oFF.XCmdCreateQueryManager = function() {
	};
	oFF.XCmdCreateQueryManager.prototype = new oFF.XCommand();
	oFF.XCmdCreateQueryManager.CLAZZ = null;
	oFF.XCmdCreateQueryManager.staticSetup = function() {
		oFF.XCmdCreateQueryManager.CLAZZ = oFF.XClass
				.create(oFF.XCmdCreateQueryManager);
	};
	oFF.XCmdCreateQueryManager.prototype.getCommandResultClass = function() {
		return oFF.XCmdCreateQueryManagerResult.CLAZZ;
	};
	oFF.XCmdCreateQueryManagerResult = function() {
	};
	oFF.XCmdCreateQueryManagerResult.prototype = new oFF.XCommandResult();
	oFF.XCmdCreateQueryManagerResult.CLAZZ = null;
	oFF.XCmdCreateQueryManagerResult.staticSetup = function() {
		oFF.XCmdCreateQueryManagerResult.CLAZZ = oFF.XClass
				.create(oFF.XCmdCreateQueryManagerResult);
	};
	oFF.XCmdCreateQueryManagerResult.prototype.process = function() {
		var application = this
				.getParameter(oFF.CmdCreateQueryManager.PARAM_I_APPLICATION);
		var system = this
				.getParameterString(oFF.CmdCreateQueryManager.PARAM_I_SYSTEM);
		var dataSource = this
				.getParameterString(oFF.CmdCreateQueryManager.PARAM_I_DATA_SOURCE);
		var inaQueryModel = this
				.getParameter(oFF.CmdCreateQueryManager.PARAM_I_QUERY_MODEL_STRUCTURE_INA_REPOSITORY);
		var serviceConfig = oFF.QueryServiceConfig.create(application);
		var experimentalFeatures;
		var capabilitiesToSwitch;
		serviceConfig.setSystemName(system);
		serviceConfig.setDataSource(this.createDataSource(dataSource,
				inaQueryModel, serviceConfig));
		if (oFF.notNull(inaQueryModel)) {
			serviceConfig.setDefinitionByStructure(
					oFF.QModelFormat.INA_REPOSITORY, inaQueryModel);
			experimentalFeatures = inaQueryModel.getStringByKeyExt(
					"ExperimentalFeatures", null);
			capabilitiesToSwitch = this
					.getParameter(oFF.CmdCreateQueryManager.PARAM_I_ENFORCE_INACTIVE_CAPABILITIES);
			oFF.XCommandUtil.handleInactiveCapabilities(serviceConfig,
					experimentalFeatures, capabilitiesToSwitch);
		}
		serviceConfig.processQueryManagerCreation(this.getSyncType(), this,
				null);
	};
	oFF.XCmdCreateQueryManagerResult.prototype.createDataSource = function(
			dataSourceName, inaQueryModel, queryServiceConfig) {
		var dataSource = oFF.QFactory.newDataSourceExt(queryServiceConfig);
		var inaDataSource;
		var importer;
		var extendedDimensionsInfo;
		dataSource.setFullQualifiedName(dataSourceName);
		if (oFF.notNull(inaQueryModel)) {
			inaDataSource = inaQueryModel.getStructureByKey("DataSource");
			if (oFF.notNull(inaDataSource)) {
				importer = oFF.QInAImportFactory.createForMetadata(
						queryServiceConfig.getApplication(), null);
				importer.importDataSourceExternalDimensions(inaDataSource,
						dataSource);
				extendedDimensionsInfo = this
						.getParameter(oFF.CmdCreateQueryManager.PARAM_I_EXT_DIMS_INFO);
				oFF.XCommandUtil.updateExtendedDimensionPackages(dataSource
						.getExtendedDimensionsBase(), extendedDimensionsInfo);
			}
		}
		return dataSource;
	};
	oFF.XCmdCreateQueryManagerResult.prototype.onQueryManagerCreated = function(
			extResult, queryManager, customIdentifier) {
		this.getMessageManager().addAllMessages(extResult);
		if (extResult.isValid()) {
			this.addResultParameter(
					oFF.CmdCreateQueryManager.PARAM_E_QUERY_MANAGER,
					queryManager);
		}
		this.onProcessFinished();
	};
	oFF.XCmdDeserializeBlending = function() {
	};
	oFF.XCmdDeserializeBlending.prototype = new oFF.XCommand();
	oFF.XCmdDeserializeBlending.CLAZZ = null;
	oFF.XCmdDeserializeBlending.staticSetup = function() {
		oFF.XCmdDeserializeBlending.CLAZZ = oFF.XClass
				.create(oFF.XCmdDeserializeBlending);
	};
	oFF.XCmdDeserializeBlending.prototype.getCommandResultClass = function() {
		return oFF.XCmdDeserializeBlendingResult.CLAZZ;
	};
	oFF.XCmdDeserializeBlendingResultBase = function() {
	};
	oFF.XCmdDeserializeBlendingResultBase.prototype = new oFF.XCommandResult();
	oFF.XCmdDeserializeBlendingResultBase.prototype.m_queryManagers = null;
	oFF.XCmdDeserializeBlendingResultBase.prototype.m_aliases = null;
	oFF.XCmdDeserializeBlendingResultBase.prototype.m_sourceCount = 0;
	oFF.XCmdDeserializeBlendingResultBase.prototype.m_importedSourcesCount = 0;
	oFF.XCmdDeserializeBlendingResultBase.prototype.m_rootElement = null;
	oFF.XCmdDeserializeBlendingResultBase.prototype.releaseObject = function() {
		oFF.XCommandResult.prototype.releaseObject.call(this);
		this.m_queryManagers = oFF.XObjectExt.release(this.m_queryManagers);
		this.m_aliases = oFF.XObjectExt.release(this.m_aliases);
		this.m_rootElement = oFF.XObjectExt.release(this.m_rootElement);
	};
	oFF.XCmdDeserializeBlendingResultBase.prototype.process = function() {
		var strQueryModel = this
				.getParameterStringStrict(oFF.CmdDeserializeBlending.PARAM_I_QUERY_MODEL_STRING_INA_REPOSITORY);
		var application = this
				.getParameterStrict(oFF.CmdDeserializeBlending.PARAM_I_APPLICATION);
		var jsonParser = oFF.JsonParserFactory.newInstance();
		var inaDataSource;
		var inaSources;
		var i;
		var inaSource;
		var alias;
		this.m_rootElement = jsonParser.parse(strQueryModel);
		oFF.XObjectExt.release(jsonParser);
		inaDataSource = this.m_rootElement.getStructureByKey("DataSource");
		inaSources = inaDataSource.getListByKey("Sources");
		this.m_aliases = oFF.XListOfString.create();
		this.m_queryManagers = oFF.XList.create();
		this.m_sourceCount = inaSources.size();
		this.m_importedSourcesCount = 0;
		for (i = 0; i < this.m_sourceCount; i++) {
			inaSource = inaSources.getStructureAt(i);
			alias = inaSource.getStringByKey("AliasName");
			this.m_aliases.add(alias);
			this.importSourceQueryModel(application, inaSource, alias,
					oFF.XIntegerValue.create(i));
		}
	};
	oFF.XCmdDeserializeBlendingResultBase.prototype.onCommandProcessed = function(
			extResult, commandResult, customIdentifier) {
		this.getMessageManager().addAllMessages(extResult);
		oFF.MessageUtil.checkNoError(extResult);
		this.onQueryManagerImported(commandResult, customIdentifier
				.getInteger());
		this.m_importedSourcesCount++;
		if (this.m_importedSourcesCount === this.m_sourceCount) {
			this.onAllQueryManagersImported();
		}
	};
	oFF.XCmdDeserializeBlendingResultBase.prototype.getDataSourceName = function(
			inaDataSource) {
		var dataSourceName = oFF.XStringBuffer.create();
		dataSourceName.append(inaDataSource.getStringByKey("Type"));
		dataSourceName.append(":[");
		dataSourceName.append(inaDataSource.getStringByKey("SchemaName"));
		dataSourceName.append("][");
		dataSourceName.append(inaDataSource.getStringByKey("PackageName"));
		dataSourceName.append("][");
		dataSourceName.append(inaDataSource.getStringByKey("ObjectName"));
		dataSourceName.append("]");
		return dataSourceName.toString();
	};
	oFF.XCmdDeserializeBlendingResultBase.prototype.getSystemName = function(
			queryAlias) {
		var systems = this
				.getParameter(oFF.CmdDeserializeBlending.PARAM_I_SYSTEMS);
		var system;
		if (oFF.notNull(systems) && systems.containsKey(queryAlias)) {
			return systems.getByKey(queryAlias);
		}
		system = this
				.getParameterString(oFF.CmdDeserializeBlending.PARAM_I_SYSTEM);
		if (oFF.notNull(system)) {
			return system;
		}
		throw oFF.XException
				.createIllegalStateException(oFF.XStringUtils
						.concatenate3("No system found for query ", queryAlias,
								". Either parameter PARAM_I_SYSTEMS or PARAM_I_SYSTEM must be set."));
	};
	oFF.XCmdDeserializeBlendingSources = function() {
	};
	oFF.XCmdDeserializeBlendingSources.prototype = new oFF.XCommand();
	oFF.XCmdDeserializeBlendingSources.CLAZZ = null;
	oFF.XCmdDeserializeBlendingSources.staticSetup = function() {
		oFF.XCmdDeserializeBlendingSources.CLAZZ = oFF.XClass
				.create(oFF.XCmdDeserializeBlendingSources);
	};
	oFF.XCmdDeserializeBlendingSources.prototype.getCommandResultClass = function() {
		return oFF.XCmdDeserializeBlendingSourcesResult.CLAZZ;
	};
	oFF.XCmdDeserializeCalculatedDimension = function() {
	};
	oFF.XCmdDeserializeCalculatedDimension.prototype = new oFF.XCommand();
	oFF.XCmdDeserializeCalculatedDimension.CLAZZ = null;
	oFF.XCmdDeserializeCalculatedDimension.staticSetup = function() {
		oFF.XCmdDeserializeCalculatedDimension.CLAZZ = oFF.XClass
				.create(oFF.XCmdDeserializeCalculatedDimension);
	};
	oFF.XCmdDeserializeCalculatedDimension.prototype.getCommandResultClass = function() {
		return oFF.XCmdDeserializeCalculatedDimensionResult.CLAZZ;
	};
	oFF.XCmdDeserializeCalculatedDimensionResult = function() {
	};
	oFF.XCmdDeserializeCalculatedDimensionResult.prototype = new oFF.XCommandResult();
	oFF.XCmdDeserializeCalculatedDimensionResult.CLAZZ = null;
	oFF.XCmdDeserializeCalculatedDimensionResult.staticSetup = function() {
		oFF.XCmdDeserializeCalculatedDimensionResult.CLAZZ = oFF.XClass
				.create(oFF.XCmdDeserializeCalculatedDimensionResult);
	};
	oFF.XCmdDeserializeCalculatedDimensionResult.getDataSourceName = function(
			inaDataSource) {
		var dataSourceName = oFF.XStringBuffer.create();
		dataSourceName.append(inaDataSource.getStringByKey("Type"));
		dataSourceName.append(":[");
		dataSourceName.append(inaDataSource.getStringByKey("SchemaName"));
		dataSourceName.append("][");
		dataSourceName.append(inaDataSource.getStringByKey("PackageName"));
		dataSourceName.append("][");
		dataSourceName.append(inaDataSource.getStringByKey("ObjectName"));
		dataSourceName.append("]");
		return dataSourceName.toString();
	};
	oFF.XCmdDeserializeCalculatedDimensionResult.prototype.m_inaQueryModels = null;
	oFF.XCmdDeserializeCalculatedDimensionResult.prototype.m_systemName = null;
	oFF.XCmdDeserializeCalculatedDimensionResult.prototype.m_application = null;
	oFF.XCmdDeserializeCalculatedDimensionResult.prototype.releaseObject = function() {
		this.m_inaQueryModels = null;
		this.m_systemName = null;
		this.m_application = null;
		oFF.XCommandResult.prototype.releaseObject.call(this);
	};
	oFF.XCmdDeserializeCalculatedDimensionResult.prototype.process = function() {
		var strQueryModels = this
				.getParameterStringStrict(oFF.CmdDeserializeCalculatedDimension.PARAM_I_QUERY_MODELS_STRING_INA_REPOSITORY);
		var jsonParser = oFF.JsonParserFactory.newInstance();
		var rootElement = jsonParser.parse(strQueryModels);
		var inaMainQuery;
		oFF.XObjectExt.release(jsonParser);
		this.m_inaQueryModels = rootElement.getListByKey("Queries");
		this.m_application = this
				.getParameterStrict(oFF.CmdDeserializeCalculatedDimension.PARAM_I_APPLICATION);
		this.m_systemName = this
				.getParameterStringStrict(oFF.CmdDeserializeCalculatedDimension.PARAM_I_SYSTEM);
		inaMainQuery = this.m_inaQueryModels
				.getStructureAt(this.m_inaQueryModels.size() - 1);
		this.importQueryModel(inaMainQuery, null);
		this.onProcessFinished();
	};
	oFF.XCmdDeserializeCalculatedDimensionResult.prototype.importQueryModel = function(
			inaQueryModel, consumingQuery) {
		var serviceConfig = oFF.QueryServiceConfig.createWithDataSourceName(
				this.m_application, this.m_systemName,
				oFF.XCmdDeserializeCalculatedDimensionResult
						.getDataSourceName(inaQueryModel
								.getStructureByKey("DataSource")));
		serviceConfig.setDefinitionByStructure(oFF.QModelFormat.INA_REPOSITORY,
				inaQueryModel);
		serviceConfig.processQueryManagerCreation(this.getSyncType(), this,
				consumingQuery);
	};
	oFF.XCmdDeserializeCalculatedDimensionResult.prototype.onQueryManagerCreated = function(
			extResult, queryManager, customIdentifier) {
		var queryPair;
		var preQueryNames;
		var sizeNames;
		var sizePreQueries;
		var idxPreQueryName;
		var preQueryName;
		var idxPreQuery;
		var inaPreQuery;
		this.getMessageManager().addAllMessages(extResult);
		if (extResult.isValid()) {
			if (oFF.notNull(customIdentifier)) {
				queryPair = customIdentifier;
				queryPair.getObject().getQueryModel().addPreQueryWithName(
						queryManager.getQueryModel(), queryPair.getName());
			}
			preQueryNames = queryManager.getDefinitionAsStructure()
					.getListByKey("PreQueryNames");
			if (oFF.notNull(preQueryNames)) {
				sizeNames = preQueryNames.size();
				sizePreQueries = this.m_inaQueryModels.size() - 1;
				for (idxPreQueryName = 0; idxPreQueryName < sizeNames; idxPreQueryName++) {
					preQueryName = preQueryNames.getStringAt(idxPreQueryName);
					for (idxPreQuery = 0; idxPreQuery < sizePreQueries; idxPreQuery++) {
						inaPreQuery = this.m_inaQueryModels
								.getStructureAt(idxPreQuery);
						if (oFF.XString.isEqual(preQueryName, inaPreQuery
								.getStringByKey("Name"))) {
							this.importQueryModel(inaPreQuery,
									oFF.XNameWeakGenericPair.create(
											preQueryName, queryManager));
						}
					}
				}
			}
		}
		if (oFF.isNull(customIdentifier)) {
			this.addResultParameter(
					oFF.CmdCreateQueryManager.PARAM_E_QUERY_MANAGER,
					queryManager);
		}
	};
	oFF.XCmdDeserializeExtendedDimension = function() {
	};
	oFF.XCmdDeserializeExtendedDimension.prototype = new oFF.XCommand();
	oFF.XCmdDeserializeExtendedDimension.CLAZZ = null;
	oFF.XCmdDeserializeExtendedDimension.staticSetup = function() {
		oFF.XCmdDeserializeExtendedDimension.CLAZZ = oFF.XClass
				.create(oFF.XCmdDeserializeExtendedDimension);
	};
	oFF.XCmdDeserializeExtendedDimension.prototype.getCommandResultClass = function() {
		return oFF.XCmdDeserializeExtendedDimensionResult.CLAZZ;
	};
	oFF.XCmdDeserializeExtendedDimensionResult = function() {
	};
	oFF.XCmdDeserializeExtendedDimensionResult.prototype = new oFF.XCommandResult();
	oFF.XCmdDeserializeExtendedDimensionResult.CLAZZ = null;
	oFF.XCmdDeserializeExtendedDimensionResult.staticSetup = function() {
		oFF.XCmdDeserializeExtendedDimensionResult.CLAZZ = oFF.XClass
				.create(oFF.XCmdDeserializeExtendedDimensionResult);
	};
	oFF.XCmdDeserializeExtendedDimensionResult.prototype.process = function() {
		var strQueryModel = this
				.getParameterStringStrict(oFF.CmdDeserializeExtendedDimension.PARAM_I_QUERY_MODEL_STRING_INA_REPOSITORY);
		var jsonParser = oFF.JsonParserFactory.newInstance();
		var rootElement = jsonParser.parse(strQueryModel);
		var inaDataSource;
		var queryModel;
		var dataSource;
		var importer;
		var extendedDimensionsInfo;
		var serviceConfig;
		var experimentalFeatures;
		var capabilitiesToSwitch;
		oFF.XObjectExt.release(jsonParser);
		inaDataSource = rootElement.getStructureByKey("DataSource");
		queryModel = this
				.getParameterStrict(oFF.CmdDeserializeExtendedDimension.PARAM_I_QUERY_MODEL);
		dataSource = queryModel.getDataSource().cloneOlapComponent(null, null);
		importer = oFF.QInAImportFactory.createForRepository(queryModel
				.getApplication(), null);
		importer.importDataSourceExternalDimensions(inaDataSource, dataSource);
		extendedDimensionsInfo = this
				.getParameter(oFF.CmdDeserializeExtendedDimension.PARAM_I_EXT_DIMS_INFO);
		oFF.XCommandUtil.updateExtendedDimensionPackages(dataSource
				.getExtendedDimensionsBase(), extendedDimensionsInfo);
		serviceConfig = oFF.QueryServiceConfig.createWithDataSource(queryModel
				.getApplication(), dataSource.getSystemName(), dataSource);
		experimentalFeatures = rootElement.getStringByKeyExt(
				"ExperimentalFeatures", null);
		capabilitiesToSwitch = this
				.getParameter(oFF.CmdDeserializeExtendedDimension.PARAM_I_ENFORCE_INACTIVE_CAPABILITIES);
		oFF.XCommandUtil.handleInactiveCapabilities(serviceConfig,
				experimentalFeatures, capabilitiesToSwitch);
		serviceConfig.processQueryManagerCreation(this.getSyncType(), this,
				null);
	};
	oFF.XCmdDeserializeExtendedDimensionResult.prototype.onQueryManagerCreated = function(
			extResult, queryManager, customIdentifier) {
		var strQueryModel;
		var deserializeExt;
		this.getMessageManager().addAllMessages(extResult);
		if (extResult.isValid()) {
			strQueryModel = this
					.getParameterStringStrict(oFF.CmdDeserializeBlending.PARAM_I_QUERY_MODEL_STRING_INA_REPOSITORY);
			deserializeExt = queryManager.getQueryModel().deserializeExt(
					oFF.QModelFormat.INA_REPOSITORY, strQueryModel);
			this.getMessageManager().addAllMessages(deserializeExt);
			this.addResultParameter(
					oFF.CmdCreateQueryManager.PARAM_E_QUERY_MANAGER,
					queryManager);
		}
		this.onProcessFinished();
	};
	oFF.QCmdBindResultset = function() {
	};
	oFF.QCmdBindResultset.prototype = new oFF.XObjectExt();
	oFF.QCmdBindResultset.create = function(cmds, type, protocol) {
		var newObj = new oFF.QCmdBindResultset();
		newObj.setupBind(cmds, type, protocol);
		return newObj;
	};
	oFF.QCmdBindResultset.prototype.m_dataManifest = null;
	oFF.QCmdBindResultset.prototype.m_cmds = null;
	oFF.QCmdBindResultset.prototype.m_type = null;
	oFF.QCmdBindResultset.prototype.m_protocol = null;
	oFF.QCmdBindResultset.prototype.m_listener = null;
	oFF.QCmdBindResultset.prototype.m_customIdentifier = null;
	oFF.QCmdBindResultset.prototype.m_requestCounter = 0;
	oFF.QCmdBindResultset.prototype.m_isAttachedToServiceConfig = false;
	oFF.QCmdBindResultset.prototype.m_isProcessingServiceConfig = false;
	oFF.QCmdBindResultset.prototype.m_isAttachedToQueryManager = false;
	oFF.QCmdBindResultset.prototype.m_tryProcessingQueryManager = false;
	oFF.QCmdBindResultset.prototype.setupBind = function(cmds, type, protocol) {
		this.m_cmds = cmds;
		this.m_type = type;
		this.m_protocol = protocol;
		this.tryAttachingToServiceConfig();
		this.tryAttachingToQueryExecution();
	};
	oFF.QCmdBindResultset.prototype.releaseObject = function() {
		this.m_cmds = null;
		this.m_listener = null;
		this.m_customIdentifier = null;
		oFF.XObjectExt.prototype.releaseObject.call(this);
	};
	oFF.QCmdBindResultset.prototype.getComponentType = function() {
		return oFF.IoComponentType.BINDING_SENDER;
	};
	oFF.QCmdBindResultset.prototype.getSession = function() {
		if (oFF.notNull(this.m_cmds)) {
			return this.m_cmds.getSession();
		} else {
			return null;
		}
	};
	oFF.QCmdBindResultset.prototype.getLogWriter = function() {
		var session = this.getSession();
		if (oFF.notNull(session)) {
			return session.getLogWriter();
		} else {
			return null;
		}
	};
	oFF.QCmdBindResultset.prototype.processSenderUpdate = function() {
		this.log("processSenderUpdate");
		if (oFF.notNull(this.m_cmds)) {
			this.tryAttachingToServiceConfig();
			this.tryProcessingServiceConfig();
			this.tryAttachingToQueryExecution();
			this.tryProcessingQueryManager();
		}
	};
	oFF.QCmdBindResultset.prototype.tryAttachingToServiceConfig = function() {
		var serviceConfig;
		this.log("tryAttachingToServiceConfig()");
		if (oFF.notNull(this.m_cmds)) {
			if (!this.m_isAttachedToServiceConfig) {
				serviceConfig = this.m_cmds.getQueryServiceConfig();
				if (oFF.notNull(serviceConfig)) {
					this.m_isAttachedToServiceConfig = true;
					serviceConfig.processQueryManagerCreation(
							oFF.SyncType.REGISTER, this, null);
				}
			}
		}
	};
	oFF.QCmdBindResultset.prototype.tryProcessingServiceConfig = function() {
		var serviceConfig;
		this.log("tryProcessingServiceConfig");
		if (oFF.notNull(this.m_cmds)) {
			if (this.m_isAttachedToServiceConfig
					&& !this.m_isProcessingServiceConfig) {
				serviceConfig = this.m_cmds.getQueryServiceConfig();
				if (oFF.notNull(serviceConfig)) {
					this.m_isProcessingServiceConfig = true;
					serviceConfig.processQueryManagerCreation(null, null, null);
				}
			}
		}
	};
	oFF.QCmdBindResultset.prototype.onQueryManagerCreated = function(extResult,
			queryManager, customIdentifier) {
		this.log("onQueryManagerCreated");
		this.m_dataManifest = oFF.DpDataManifestFactory
				.createByMessages(extResult);
		this.tryAttachingToQueryExecution();
	};
	oFF.QCmdBindResultset.prototype.tryAttachingToQueryExecution = function() {
		var queryManager;
		this.log("tryAttachingToQueryManager");
		if (oFF.notNull(this.m_cmds)) {
			if (this.m_isAttachedToServiceConfig
					&& !this.m_isAttachedToQueryManager) {
				queryManager = this.m_cmds.getQueryManager();
				if (oFF.notNull(queryManager)) {
					this.m_isAttachedToQueryManager = true;
					queryManager.processQueryExecution(oFF.SyncType.REGISTER,
							this, null);
					if (this.m_tryProcessingQueryManager) {
						this.tryProcessingQueryManager();
					}
				}
			}
		}
	};
	oFF.QCmdBindResultset.prototype.tryProcessingQueryManager = function() {
		var queryManager;
		this.log("tryProcessingQueryManager");
		this.m_tryProcessingQueryManager = true;
		if (oFF.notNull(this.m_cmds)) {
			if (this.m_isAttachedToServiceConfig
					&& this.m_isAttachedToQueryManager) {
				queryManager = this.m_cmds.getQueryManager();
				if (oFF.notNull(queryManager)) {
					this.m_tryProcessingQueryManager = false;
					this.m_requestCounter++;
					this.log(oFF.XStringBuffer.create().append(
							"Request Counter: ").appendInt(
							this.m_requestCounter).toString());
					queryManager.processQueryExecution(null, null, null);
				}
			}
		}
	};
	oFF.QCmdBindResultset.prototype.onQueryExecuted = function(extResult,
			resultSetContainer, customIdentifier) {
		this.m_dataManifest = oFF.DpDataManifestFactory
				.createByMessages(extResult);
		this.log("onQueryExecuted");
		if (oFF.notNull(this.m_listener)) {
			this.m_listener.onSenderValueChanged(this, this.m_customIdentifier);
		}
	};
	oFF.QCmdBindResultset.prototype.onCmdContextChanged = function() {
		this.log("onCmdContextChanged");
	};
	oFF.QCmdBindResultset.prototype.isSenderValueReady = function() {
		var isSenderValueReady;
		var queryManager;
		var syncState;
		this.log("isSenderValueReady");
		isSenderValueReady = false;
		if (oFF.notNull(this.m_cmds)) {
			queryManager = this.m_cmds.getQueryManager();
			if (oFF.notNull(queryManager)) {
				syncState = queryManager.getResultSetSyncState();
				isSenderValueReady = syncState.isInSync();
			}
		}
		return isSenderValueReady;
	};
	oFF.QCmdBindResultset.prototype.getString = function() {
		var grid;
		var gridValue;
		if (oFF.notNull(this.m_cmds)) {
			grid = this.m_cmds.getReferenceGrid(false);
			if (oFF.notNull(grid)) {
				gridValue = grid.exportToAscii(50);
				this.log(gridValue);
				return gridValue;
			}
		}
		return null;
	};
	oFF.QCmdBindResultset.prototype.getElement = function() {
		return oFF.isNull(this.m_cmds) ? null : this.m_cmds
				.getAbstractRendering(this.m_type, this.m_protocol);
	};
	oFF.QCmdBindResultset.prototype.getDataManifest = function() {
		return this.m_dataManifest;
	};
	oFF.QCmdBindResultset.prototype.registerValueChangedListener = function(
			listener, customIdentifier) {
		this.log("registerValueChangedListener");
		this.m_listener = listener;
		this.m_customIdentifier = customIdentifier;
	};
	oFF.QCmdBindResultset.prototype.unregisterValueChangedListener = function(
			listener) {
		this.log("unregisterValueChangedListener");
		this.m_listener = null;
		this.m_customIdentifier = null;
	};
	oFF.XCmdDeserializeBlendingResult = function() {
	};
	oFF.XCmdDeserializeBlendingResult.prototype = new oFF.XCmdDeserializeBlendingResultBase();
	oFF.XCmdDeserializeBlendingResult.CLAZZ = null;
	oFF.XCmdDeserializeBlendingResult.staticSetup = function() {
		oFF.XCmdDeserializeBlendingResult.CLAZZ = oFF.XClass
				.create(oFF.XCmdDeserializeBlendingResult);
	};
	oFF.XCmdDeserializeBlendingResult.createBlendingDefinition = function(
			queryManagers, aliases, inaMappings) {
		var blendingDefinition = oFF.BlendingDefinition.create();
		var sourceCount = queryManagers.size();
		var i;
		var idx;
		var inaMapping;
		var linkType;
		var dimensionName;
		var dimensionMapping;
		var inaDimensionMappings;
		var dimMapIdx;
		var inaDimensionMapping;
		var queryAliasName;
		var name;
		var value;
		var inaAttributeMappings;
		var attMapIdx;
		var inaAttributeMapping;
		var attributeName;
		var isLinkKey;
		var attributeMapping;
		var inaAttributeDefinitions;
		var attDefIdx;
		var inaAttributeDefinition;
		var nameAtt;
		var queryAliasNameAtt;
		var constantMappingValue;
		for (i = 0; i < sourceCount; i++) {
			blendingDefinition.addNewSource(queryManagers.get(i)
					.getQueryModel(), aliases.get(i));
		}
		for (idx = 0; idx < inaMappings.size(); idx++) {
			inaMapping = inaMappings.getStructureAt(idx);
			linkType = inaMapping.getStringByKey("LinkType");
			dimensionName = inaMapping.getStringByKey("DimensionName");
			dimensionMapping = blendingDefinition.addNewDimensionMapping(
					oFF.BlendingLinkType.lookup(linkType), dimensionName);
			inaDimensionMappings = inaMapping.getListByKey("Mapping");
			if (inaMapping.getBooleanByKeyExt("PreserveMembers", false)) {
				dimensionMapping.setIsPreservingMembers(true);
			}
			if (!inaMapping.getBooleanByKeyExt("ReturnOriginKeys", true)) {
				dimensionMapping.setIsReturningOriginKeys(false);
			}
			for (dimMapIdx = 0; dimMapIdx < inaDimensionMappings.size(); dimMapIdx++) {
				inaDimensionMapping = inaDimensionMappings
						.getStructureAt(dimMapIdx);
				queryAliasName = inaDimensionMapping
						.getStringByKey("AliasName");
				name = oFF.XCmdDeserializeBlendingResult
						.getNameFromMappingDefinition(inaDimensionMapping);
				if (oFF.isNull(name)) {
					value = oFF.XCmdDeserializeBlendingResult
							.getNameFromConstantMappingDefinition(inaDimensionMapping);
					dimensionMapping.addNewConstantMapping(value,
							queryAliasName);
				} else {
					dimensionMapping.addNewDimensionMappingDefinitionByName(
							name, queryAliasName);
				}
			}
			inaAttributeMappings = inaMapping.getListByKey("AttributeMappings");
			if (oFF.notNull(inaAttributeMappings)) {
				for (attMapIdx = 0; attMapIdx < inaAttributeMappings.size(); attMapIdx++) {
					inaAttributeMapping = inaAttributeMappings
							.getStructureAt(attMapIdx);
					attributeName = inaAttributeMapping
							.getStringByKey("AttributeName");
					isLinkKey = inaAttributeMapping
							.getBooleanByKey("IsLinkKey");
					attributeMapping = dimensionMapping
							.addNewAttributeMappingByName(attributeName,
									isLinkKey);
					inaAttributeDefinitions = inaAttributeMapping
							.getListByKey("Mapping");
					for (attDefIdx = 0; attDefIdx < inaAttributeDefinitions
							.size(); attDefIdx++) {
						inaAttributeDefinition = inaAttributeDefinitions
								.getStructureAt(attDefIdx);
						nameAtt = oFF.XCmdDeserializeBlendingResult
								.getNameFromMappingDefinition(inaAttributeDefinition);
						queryAliasNameAtt = inaAttributeDefinition
								.getStringByKey("AliasName");
						if (oFF.isNull(nameAtt)) {
							constantMappingValue = oFF.XCmdDeserializeBlendingResult
									.getNameFromConstantMappingDefinition(inaAttributeDefinition);
							dimensionMapping.addNewConstantMapping(
									constantMappingValue, queryAliasNameAtt);
						} else {
							attributeMapping
									.addAttributeMappingDefinition(oFF.BlendingMappingDefinition
											.createAttributeMapping(nameAtt,
													queryAliasNameAtt));
						}
					}
				}
			}
		}
		return blendingDefinition;
	};
	oFF.XCmdDeserializeBlendingResult.getNameFromMappingDefinition = function(
			inaMapping) {
		var inaMappingDefinition = inaMapping
				.getStructureByKey("MappingDefinition");
		var inaMember;
		if (inaMappingDefinition.containsKey("Member")) {
			inaMember = inaMappingDefinition.getStructureByKey("Member");
			return inaMember.getStringByKey("Name");
		}
		return null;
	};
	oFF.XCmdDeserializeBlendingResult.getNameFromConstantMappingDefinition = function(
			inaMapping) {
		var inaMappingDefinition = inaMapping
				.getStructureByKey("MappingDefinition");
		var inaMember;
		if (inaMappingDefinition.containsKey("Constant")) {
			inaMember = inaMappingDefinition.getStructureByKey("Constant");
			return inaMember.getStringByKey("Value");
		}
		return null;
	};
	oFF.XCmdDeserializeBlendingResult.prototype.importSourceQueryModel = function(
			application, sourceQueryModel, queryAlias, customIdentifier) {
		var inaDefiningContext;
		var inaDefinition;
		var inaDataSource;
		var commandFactory;
		var command;
		this.m_queryManagers.add(null);
		inaDefiningContext = sourceQueryModel
				.getStructureByKey("DefiningContext");
		inaDefinition = inaDefiningContext.getStructureByKey("Definition");
		inaDataSource = inaDefinition.getStructureByKey("DataSource");
		commandFactory = oFF.XCommandFactory.create(application);
		if (inaDataSource.containsKey("Mappings")) {
			command = commandFactory
					.createCommand(oFF.CmdDeserializeBlending.CMD_NAME);
			command
					.addParameter(
							oFF.CmdDeserializeBlending.PARAM_I_APPLICATION,
							this
									.getParameterStrict(oFF.CmdDeserializeBlending.PARAM_I_APPLICATION));
			command
					.addParameter(
							oFF.CmdDeserializeBlending.PARAM_I_SYSTEMS,
							this
									.getParameter(oFF.CmdDeserializeBlending.PARAM_I_SYSTEMS));
			command
					.addParameterString(
							oFF.CmdDeserializeBlending.PARAM_I_SYSTEM,
							this
									.getParameterString(oFF.CmdDeserializeBlending.PARAM_I_SYSTEM));
			command
					.addParameterString(
							oFF.CmdDeserializeBlending.PARAM_I_QUERY_MODEL_STRING_INA_REPOSITORY,
							inaDefinition.toString());
			command
					.addParameter(
							oFF.CmdDeserializeBlending.PARAM_I_ENFORCE_INACTIVE_CAPABILITIES,
							this
									.getParameter(oFF.CmdDeserializeBlending.PARAM_I_ENFORCE_INACTIVE_CAPABILITIES));
			command
					.addParameter(
							oFF.CmdDeserializeBlending.PARAM_I_EXT_DIMS_INFO,
							this
									.getParameter(oFF.CmdDeserializeBlending.PARAM_I_EXT_DIMS_INFO));
		} else {
			command = commandFactory
					.createCommand(oFF.CmdCreateQueryManager.CMD_NAME);
			command
					.addParameter(
							oFF.CmdCreateQueryManager.PARAM_I_QUERY_MODEL_STRUCTURE_INA_REPOSITORY,
							inaDefinition);
			command
					.addParameter(
							oFF.CmdCreateQueryManager.PARAM_I_APPLICATION,
							this
									.getParameterStrict(oFF.CmdDeserializeBlending.PARAM_I_APPLICATION));
			command.addParameterString(
					oFF.CmdCreateQueryManager.PARAM_I_SYSTEM, this
							.getSystemName(queryAlias));
			command.addParameterString(
					oFF.CmdCreateQueryManager.PARAM_I_DATA_SOURCE, this
							.getDataSourceName(inaDataSource));
			command
					.addParameter(
							oFF.CmdCreateQueryManager.PARAM_I_ENFORCE_INACTIVE_CAPABILITIES,
							this
									.getParameter(oFF.CmdCreateQueryManager.PARAM_I_ENFORCE_INACTIVE_CAPABILITIES));
			command
					.addParameter(
							oFF.CmdDeserializeBlending.PARAM_I_EXT_DIMS_INFO,
							this
									.getParameter(oFF.CmdDeserializeBlending.PARAM_I_EXT_DIMS_INFO));
		}
		command.processCommand(this.getSyncType(), this, customIdentifier);
	};
	oFF.XCmdDeserializeBlendingResult.prototype.onQueryManagerImported = function(
			commandResult, index) {
		this.m_queryManagers
				.set(
						index,
						commandResult
								.getResultParameter(oFF.CmdDeserializeBlending.PARAM_E_QUERY_MANAGER));
	};
	oFF.XCmdDeserializeBlendingResult.prototype.onAllQueryManagersImported = function() {
		var inaMappings = this.m_rootElement.getStructureByKey("DataSource")
				.getListByKey("Mappings");
		var blendingDefinition = oFF.XCmdDeserializeBlendingResult
				.createBlendingDefinition(this.m_queryManagers, this.m_aliases,
						inaMappings);
		var application = this
				.getParameterStrict(oFF.CmdDeserializeBlending.PARAM_I_APPLICATION);
		var serviceConfig = oFF.QueryServiceConfig
				.createWithBlendingDefinition(application, blendingDefinition);
		var experimentalFeatures = this.m_rootElement.getStringByKeyExt(
				"ExperimentalFeatures", null);
		var capabilitiesToSwitch = this
				.getParameter(oFF.CmdDeserializeBlending.PARAM_I_ENFORCE_INACTIVE_CAPABILITIES);
		oFF.XCommandUtil.handleInactiveCapabilities(serviceConfig,
				experimentalFeatures, capabilitiesToSwitch);
		serviceConfig.processQueryManagerCreation(this.getSyncType(), this,
				null);
	};
	oFF.XCmdDeserializeBlendingResult.prototype.onQueryManagerCreated = function(
			extResult, queryManager, customIdentifier) {
		var strQueryModel;
		var deserializeExt;
		this.getMessageManager().addAllMessages(extResult);
		if (extResult.isValid()) {
			strQueryModel = this
					.getParameterStringStrict(oFF.CmdDeserializeBlending.PARAM_I_QUERY_MODEL_STRING_INA_REPOSITORY);
			deserializeExt = queryManager.getQueryModel().deserializeExt(
					oFF.QModelFormat.INA_REPOSITORY, strQueryModel);
			this.getMessageManager().addAllMessages(deserializeExt);
			this.addResultParameter(
					oFF.CmdDeserializeBlending.PARAM_E_QUERY_MANAGER,
					queryManager);
		}
		this.onProcessFinished();
	};
	oFF.XCmdDeserializeBlendingSourcesResult = function() {
	};
	oFF.XCmdDeserializeBlendingSourcesResult.prototype = new oFF.XCmdDeserializeBlendingResultBase();
	oFF.XCmdDeserializeBlendingSourcesResult.CLAZZ = null;
	oFF.XCmdDeserializeBlendingSourcesResult.staticSetup = function() {
		oFF.XCmdDeserializeBlendingSourcesResult.CLAZZ = oFF.XClass
				.create(oFF.XCmdDeserializeBlendingSourcesResult);
	};
	oFF.XCmdDeserializeBlendingSourcesResult.prototype.m_results = null;
	oFF.XCmdDeserializeBlendingSourcesResult.prototype.m_currentIndex = 0;
	oFF.XCmdDeserializeBlendingSourcesResult.prototype.releaseObject = function() {
		oFF.XCmdDeserializeBlendingResultBase.prototype.releaseObject
				.call(this);
		this.m_results = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_results);
	};
	oFF.XCmdDeserializeBlendingSourcesResult.prototype.process = function() {
		this.m_results = oFF.XList.create();
		oFF.XCmdDeserializeBlendingResultBase.prototype.process.call(this);
	};
	oFF.XCmdDeserializeBlendingSourcesResult.prototype.importSourceQueryModel = function(
			application, sourceQueryModel, queryAlias, customIdentifier) {
		var inaDefiningContext = sourceQueryModel
				.getStructureByKey("DefiningContext");
		var inaDefinition = inaDefiningContext.getStructureByKey("Definition");
		var inaDataSource = inaDefinition.getStructureByKey("DataSource");
		var commandFactory = oFF.XCommandFactory.create(application);
		var command;
		if (inaDataSource.containsKey("Sources")) {
			command = commandFactory
					.createCommand(oFF.CmdDeserializeBlendingSources.CMD_NAME);
			command
					.addParameter(
							oFF.CmdDeserializeBlendingSources.PARAM_I_APPLICATION,
							this
									.getParameterStrict(oFF.CmdDeserializeBlendingSources.PARAM_I_APPLICATION));
			command
					.addParameter(
							oFF.CmdDeserializeBlendingSources.PARAM_I_SYSTEMS,
							this
									.getParameter(oFF.CmdDeserializeBlendingSources.PARAM_I_SYSTEMS));
			command
					.addParameterString(
							oFF.CmdDeserializeBlendingSources.PARAM_I_SYSTEM,
							this
									.getParameterString(oFF.CmdDeserializeBlendingSources.PARAM_I_SYSTEM));
			command
					.addParameterString(
							oFF.CmdDeserializeBlendingSources.PARAM_I_QUERY_MODEL_STRING_INA_REPOSITORY,
							inaDefinition.toString());
			command
					.addParameter(
							oFF.CmdDeserializeBlending.PARAM_I_ENFORCE_INACTIVE_CAPABILITIES,
							this
									.getParameter(oFF.CmdDeserializeBlendingSources.PARAM_I_ENFORCE_INACTIVE_CAPABILITIES));
			command
					.addParameter(
							oFF.CmdDeserializeBlendingSources.PARAM_I_EXT_DIMS_INFO,
							this
									.getParameter(oFF.CmdDeserializeBlendingSources.PARAM_I_EXT_DIMS_INFO));
		} else {
			command = commandFactory
					.createCommand(oFF.CmdCreateQueryManager.CMD_NAME);
			command
					.addParameter(
							oFF.CmdCreateQueryManager.PARAM_I_QUERY_MODEL_STRUCTURE_INA_REPOSITORY,
							inaDefinition);
			command
					.addParameter(
							oFF.CmdCreateQueryManager.PARAM_I_APPLICATION,
							this
									.getParameterStrict(oFF.CmdDeserializeBlendingSources.PARAM_I_APPLICATION));
			command.addParameterString(
					oFF.CmdCreateQueryManager.PARAM_I_SYSTEM, this
							.getSystemName(queryAlias));
			command.addParameterString(
					oFF.CmdCreateQueryManager.PARAM_I_DATA_SOURCE, this
							.getDataSourceName(inaDataSource));
			command
					.addParameter(
							oFF.CmdCreateQueryManager.PARAM_I_ENFORCE_INACTIVE_CAPABILITIES,
							this
									.getParameter(oFF.CmdDeserializeBlendingSources.PARAM_I_ENFORCE_INACTIVE_CAPABILITIES));
			command
					.addParameter(
							oFF.CmdDeserializeBlendingSources.PARAM_I_EXT_DIMS_INFO,
							this
									.getParameter(oFF.CmdDeserializeBlendingSources.PARAM_I_EXT_DIMS_INFO));
		}
		this.m_results.add(null);
		command.processCommand(this.getSyncType(), this, oFF.XIntegerValue
				.create(this.m_currentIndex));
		this.m_currentIndex++;
	};
	oFF.XCmdDeserializeBlendingSourcesResult.prototype.onQueryManagerImported = function(
			commandResult, index) {
		var queryManager = commandResult
				.getResultParameter(oFF.CmdDeserializeBlendingSources.PARAM_E_QUERY_MANAGER);
		var queryManagers;
		if (oFF.notNull(queryManager)) {
			this.m_results.set(index, oFF.XCollectionUtils
					.singletonList(queryManager));
		} else {
			queryManagers = commandResult
					.getResultParameter(oFF.CmdDeserializeBlendingSources.PARAM_E_QUERY_MANAGERS);
			this.m_results.set(index, queryManagers);
		}
	};
	oFF.XCmdDeserializeBlendingSourcesResult.prototype.onAllQueryManagersImported = function() {
		var i;
		for (i = 0; i < this.m_results.size(); i++) {
			this.m_queryManagers.addAll(this.m_results.get(i));
		}
		this.addResultParameter(
				oFF.CmdDeserializeBlendingSources.PARAM_E_QUERY_MANAGERS,
				this.m_queryManagers.createListCopy());
		this.onProcessFinished();
	};
	oFF.QCmdSignature = function() {
	};
	oFF.QCmdSignature.prototype = new oFF.XConstant();
	oFF.QCmdSignature.ADD_ALL_DIMENSIONS = "addAllDimensions";
	oFF.QCmdSignature.ADD_ALL_FIELDS_OF_DIMENSION_TO_MODEL_AREA = "addAllFieldsOfDimensionToModelArea";
	oFF.QCmdSignature.ADD_ALL_FIELDS_TO_MODEL_AREA = "addAllFieldsToModelArea";
	oFF.QCmdSignature.ADD_ATTRIBUTE_TO_RESULT_SET = "addAttributeToResultSet";
	oFF.QCmdSignature.ADD_CONTAINS_GEOMETRY_FILTER = "addContainsGeometryFilter";
	oFF.QCmdSignature.ADD_COVERS_GEOMETRY_FILTER = "addCoversGeometryFilter";
	oFF.QCmdSignature.ADD_CROSSES_LINESTRING_FILTER = "addCrossesLinestringFilter";
	oFF.QCmdSignature.ADD_DISJOINT_GEOMETRY_FILTER = "addDisjointGeometryFilter";
	oFF.QCmdSignature.ADD_DOUBLE_FILTER_BY_FIELD = "addDoubleFilterByField";
	oFF.QCmdSignature.ADD_DOUBLE_FILTER_BY_FIELD_NAME = "addDoubleFilterByFieldName";
	oFF.QCmdSignature.ADD_FIELD = "addField";
	oFF.QCmdSignature.ADD_FILTER = "addFilter";
	oFF.QCmdSignature.ADD_FILTER_BY_FIELD = "addFilterByField";
	oFF.QCmdSignature.ADD_FILTER_BY_FIELD_AND_VALUE = "addFilterByFieldAndValue";
	oFF.QCmdSignature.ADD_INT_FILTER_BY_FIELD = "addIntFilterByField";
	oFF.QCmdSignature.ADD_INT_FILTER_BY_FIELD_NAME = "addIntFilterByFieldName";
	oFF.QCmdSignature.ADD_INTERSECTS_GEOMETRY_FILTER = "addIntersectsGeometryFilter";
	oFF.QCmdSignature.ADD_INTERSECTS_RECT_FILTER = "addIntersectsRectFilter";
	oFF.QCmdSignature.ADD_INTERVAL_FILTER_BY_VALUES = "addIntervalFilterByValues";
	oFF.QCmdSignature.ADD_LONG_FILTER_BY_FIELD = "addLongFilterByField";
	oFF.QCmdSignature.ADD_LONG_FILTER_BY_FIELD_NAME = "addLongFilterByFieldName";
	oFF.QCmdSignature.ADD_MEASURE = "addMeasure";
	oFF.QCmdSignature.ADD_NEW_RESTRICTED_MEASURE = "addNewRestrictedMeasure";
	oFF.QCmdSignature.ADD_NEW_RESTRICTED_MEASURE_ON_NODE = "addNewRestrictedMeasureOnNode";
	oFF.QCmdSignature.ADD_OVERLAPS_GEOMETRY_FILTER = "addOverlapsGeometryFilter";
	oFF.QCmdSignature.ADD_SINGLE_MEMBER_FILTER = "addSingleMemberFilter";
	oFF.QCmdSignature.ADD_SINGLE_NODE_FILTER = "addSingleNodeFilter";
	oFF.QCmdSignature.ADD_STRING_FILTER_BY_FIELD = "addStringFilterByField";
	oFF.QCmdSignature.ADD_STRING_FILTER_BY_FIELD_NAME_AND_OPERATOR = "addStringFilterByFieldNameAndOperator";
	oFF.QCmdSignature.ADD_STRING_FILTER_BY_NAME = "addStringFilterByName";
	oFF.QCmdSignature.ADD_STRING_FILTER_BY_PRESENTATION = "addStringFilterByPresentation";
	oFF.QCmdSignature.ADD_TOUCHES_GEOMETRY_FILTER = "addTouchesGeometryFilter";
	oFF.QCmdSignature.ADD_WITHIN_DISTANCE_FILTER = "addWithinDistanceFilter";
	oFF.QCmdSignature.ADD_WITHIN_GEOMETRY_FILTER = "addWithinGeometryFilter";
	oFF.QCmdSignature.ALIGN_TOTALS = "alignTotals";
	oFF.QCmdSignature.CLEAR_ALL_FIELDS_FROM_MODEL_AREA = "clearAllFieldsFromModelArea";
	oFF.QCmdSignature.CLEAR_ALL_FILTERS_EXT = "clearAllFiltersExt";
	oFF.QCmdSignature.CLEAR_AXIS = "clearAxis";
	oFF.QCmdSignature.CLEAR_FIELDS = "clearFields";
	oFF.QCmdSignature.CLEAR_FILTER_BY_ID_EXT = "clearFilterByIdExt";
	oFF.QCmdSignature.CLEAR_FILTERS_BY_DIMENSION_EXT = "clearFiltersByDimensionExt";
	oFF.QCmdSignature.CLEAR_SINGLE_MEMBER_FILTER_BY_NAME = "clearSingleMemberFilterByName";
	oFF.QCmdSignature.CLEAR_SORT = "clearSort";
	oFF.QCmdSignature.CONTAINS_FIELD = "containsField";
	oFF.QCmdSignature.CONTAINS_RESULT_SET_FIELD_BY_TYPE = "containsResultSetFieldByType";
	oFF.QCmdSignature.CONTAINS_SELECTOR_FIELD_BY_TYPE = "containsSelectorFieldByType";
	oFF.QCmdSignature.EXECUTE_CODE = "executeCode";
	oFF.QCmdSignature.GET_ABSTRACT_RENDERING = "getAbstractRendering";
	oFF.QCmdSignature.GET_COMPONENT_TYPE = "getComponentType";
	oFF.QCmdSignature.GET_DATA_SOURCE = "getDataSource";
	oFF.QCmdSignature.GET_DIMENSION = "getDimension";
	oFF.QCmdSignature.GET_DIMENSION_ACCESSOR = "getDimensionAccessor";
	oFF.QCmdSignature.GET_DIMENSIONS_CONTAINING_VALUE_TYPE = "getDimensionsContainingValueType";
	oFF.QCmdSignature.GET_DRILL_MANAGER = "getDrillManager";
	oFF.QCmdSignature.GET_EXECUTE_REQUEST_ON_OLD_RESULT_SET = "getExecuteRequestOnOldResultSet";
	oFF.QCmdSignature.GET_FIELD = "getField";
	oFF.QCmdSignature.GET_FIELD_ACCESSOR_SINGLE = "getFieldAccessorSingle";
	oFF.QCmdSignature.GET_FILTER_BY_ID = "getFilterById";
	oFF.QCmdSignature.GET_FIRST_DIMENSION_WITH_TYPE = "getFirstDimensionWithType";
	oFF.QCmdSignature.GET_FIRST_G_I_S_DIMENSION = "getFirstGISDimension";
	oFF.QCmdSignature.GET_G_I_S_ATTRIBUTES_FOR_DIMENSION = "getGISAttributesForDimension";
	oFF.QCmdSignature.GET_MAX_COLUMNS = "getMaxColumns";
	oFF.QCmdSignature.GET_MAX_RESULT_RECORDS = "getMaxResultRecords";
	oFF.QCmdSignature.GET_MAX_ROWS = "getMaxRows";
	oFF.QCmdSignature.GET_MEASURE = "getMeasure";
	oFF.QCmdSignature.GET_MODEL_CAPABILITIES = "getModelCapabilities";
	oFF.QCmdSignature.GET_OFFSET_COLUMNS = "getOffsetColumns";
	oFF.QCmdSignature.GET_OFFSET_ROWS = "getOffsetRows";
	oFF.QCmdSignature.GET_QUERY_MANAGER = "getQueryManager";
	oFF.QCmdSignature.GET_QUERY_MODEL = "getQueryModel";
	oFF.QCmdSignature.GET_QUERY_SERVICE_CONFIG = "getQueryServiceConfig";
	oFF.QCmdSignature.GET_RECEIVER_BINDINGS = "getReceiverBindings";
	oFF.QCmdSignature.GET_REFERENCE_GRID = "getReferenceGrid";
	oFF.QCmdSignature.GET_RESULT_SET_PERSISTENCE_IDENTIFIER = "getResultSetPersistenceIdentifier";
	oFF.QCmdSignature.GET_RESULT_SET_PERSISTENCE_SCHEMA = "getResultSetPersistenceSchema";
	oFF.QCmdSignature.GET_RESULT_SET_PERSISTENCE_TABLE = "getResultSetPersistenceTable";
	oFF.QCmdSignature.GET_SENDER_BINDINGS = "getSenderBindings";
	oFF.QCmdSignature.GET_VARIABLE = "getVariable";
	oFF.QCmdSignature.GET_VARIABLE_CONTAINER = "getVariableContainer";
	oFF.QCmdSignature.GET_VARIABLES_NAME_AND_TEXT = "getVariablesNameAndText";
	oFF.QCmdSignature.GET_VISIBILITY_FILTER_BY_ID = "getVisibilityFilterById";
	oFF.QCmdSignature.HAS_MORE_COLUMN_RECORDS_AVAILABLE = "hasMoreColumnRecordsAvailable";
	oFF.QCmdSignature.HAS_MORE_ROW_RECORDS_AVAILABLE = "hasMoreRowRecordsAvailable";
	oFF.QCmdSignature.IS_RESULT_SET_TRANSPORT_ENABLED = "isResultSetTransportEnabled";
	oFF.QCmdSignature.MOVE_DIMENSION_EXT = "moveDimensionExt";
	oFF.QCmdSignature.NEW_RECEIVER_BINDING = "newReceiverBinding";
	oFF.QCmdSignature.NEW_SENDER_BINDING = "newSenderBinding";
	oFF.QCmdSignature.PROCESS_QUERY_EXECUTION = "processQueryExecution";
	oFF.QCmdSignature.PROCESS_QUERY_MANAGER_CREATION = "processQueryManagerCreation";
	oFF.QCmdSignature.REFRESH = "refresh";
	oFF.QCmdSignature.REGISTER_CHANGED_LISTENER = "registerChangedListener";
	oFF.QCmdSignature.REMOVE_ATTRIBUTE_FROM_RESULT_SET = "removeAttributeFromResultSet";
	oFF.QCmdSignature.REMOVE_FIELD = "removeField";
	oFF.QCmdSignature.RESET = "reset";
	oFF.QCmdSignature.RESET_MAX_RESULT_RECORDS = "resetMaxResultRecords";
	oFF.QCmdSignature.RESET_TO_DEFAULT = "resetToDefault";
	oFF.QCmdSignature.SET_DIMENSION_AND_MEASURE = "setDimensionAndMeasure";
	oFF.QCmdSignature.SET_DIMENSION_HIERARCHY = "setDimensionHierarchy";
	oFF.QCmdSignature.SET_DIMENSIONS_AND_MEASURES = "setDimensionsAndMeasures";
	oFF.QCmdSignature.SET_EXECUTE_REQUEST_ON_OLD_RESULT_SET = "setExecuteRequestOnOldResultSet";
	oFF.QCmdSignature.SET_FIELD = "setField";
	oFF.QCmdSignature.SET_MAX_COLUMNS = "setMaxColumns";
	oFF.QCmdSignature.SET_MAX_RESULT_RECORDS = "setMaxResultRecords";
	oFF.QCmdSignature.SET_MAX_ROWS = "setMaxRows";
	oFF.QCmdSignature.SET_OFFSET_COLUMNS = "setOffsetColumns";
	oFF.QCmdSignature.SET_OFFSET_ROWS = "setOffsetRows";
	oFF.QCmdSignature.SET_RESULT_SET_PERSISTANCE_IDENTIFIER = "setResultSetPersistanceIdentifier";
	oFF.QCmdSignature.SET_RESULT_SET_PERSISTANCE_TARGET_SCHEMA = "setResultSetPersistanceTargetSchema";
	oFF.QCmdSignature.SET_RESULT_SET_PERSISTANCE_TARGET_TABLE = "setResultSetPersistanceTargetTable";
	oFF.QCmdSignature.SET_RESULT_SET_TRANSPORT_ENABLED = "setResultSetTransportEnabled";
	oFF.QCmdSignature.SET_SEARCH_TERM = "setSearchTerm";
	oFF.QCmdSignature.SET_TOTALS_VISIBLE = "setTotalsVisible";
	oFF.QCmdSignature.SET_UNIVERSAL_DISPLAY_HIERARCHY = "setUniversalDisplayHierarchy";
	oFF.QCmdSignature.SET_VARIABLE = "setVariable";
	oFF.QCmdSignature.SORT = "sort";
	oFF.QCmdSignature.SUBMIT_VARIABLES = "submitVariables";
	oFF.QCmdSignature.SWITCH_AXES = "switchAxes";
	oFF.QCmdSignature.UNREGISTER_CHANGED_LISTENER = "unregisterChangedListener";
	oFF.QCmdSignature.s_signature = null;
	oFF.QCmdSignature.staticSetup = function() {
		oFF.QCmdSignature.s_signature = oFF.XHashMapOfStringByString.create();
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_ALL_FIELDS_OF_DIMENSION_TO_MODEL_AREA,
				"String,#QContextType");
		oFF.QCmdSignature.s_signature
				.put(oFF.QCmdSignature.ADD_ALL_FIELDS_TO_MODEL_AREA,
						"#QContextType");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_ATTRIBUTE_TO_RESULT_SET, "String,String");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_CONTAINS_GEOMETRY_FILTER,
				"#IQDimension,String,IXGeometry");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_COVERS_GEOMETRY_FILTER,
				"#IQDimension,String,IXGeometry");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_CROSSES_LINESTRING_FILTER,
				"#IQDimension,String,IXGeometry");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_DISJOINT_GEOMETRY_FILTER,
				"#IQDimension,String,IXGeometry");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_DOUBLE_FILTER_BY_FIELD,
				"#IQField,double,#ComparisonOperator");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_DOUBLE_FILTER_BY_FIELD_NAME,
				"String,String,double,#ComparisonOperator");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.ADD_FIELD,
				"#DimensionType,String,#PresentationType,String,#QContextType");
		oFF.QCmdSignature.s_signature
				.put(
						oFF.QCmdSignature.ADD_FILTER,
						"#FilterLayer,#DimensionType,String,#PresentationType,String,String,String,#ComparisonOperator");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_FILTER_BY_FIELD,
				"#IQField,IXValue,IXValue,IXValue,#ComparisonOperator,boolean");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_FILTER_BY_FIELD_AND_VALUE,
				"#IQField,IXValue,#ComparisonOperator");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_INT_FILTER_BY_FIELD,
				"#IQField,int,#ComparisonOperator");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_INT_FILTER_BY_FIELD_NAME,
				"String,String,int,#ComparisonOperator");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_INTERSECTS_GEOMETRY_FILTER,
				"#IQDimension,String,IXGeometry");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_INTERSECTS_RECT_FILTER,
				"#IQDimension,String,IXPoint,IXPoint");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_INTERVAL_FILTER_BY_VALUES,
				"String,IXValue,IXValue");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_LONG_FILTER_BY_FIELD,
				"#IQField,long,#ComparisonOperator");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_LONG_FILTER_BY_FIELD_NAME,
				"String,String,long,#ComparisonOperator");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.ADD_MEASURE,
				"String");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_NEW_RESTRICTED_MEASURE,
				"#DimensionType,String,String,String,String,String");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_NEW_RESTRICTED_MEASURE_ON_NODE,
				"#DimensionType,String,String,String,String,String,String");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_OVERLAPS_GEOMETRY_FILTER,
				"#IQDimension,String,IXGeometry");
		oFF.QCmdSignature.s_signature
				.put(oFF.QCmdSignature.ADD_SINGLE_MEMBER_FILTER,
						"#FilterLayer,#DimensionType,String,String,#ComparisonOperator");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_SINGLE_NODE_FILTER,
				"#IQNode,#ComparisonOperator");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_STRING_FILTER_BY_FIELD,
				"#IQField,String,#ComparisonOperator");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_STRING_FILTER_BY_FIELD_NAME_AND_OPERATOR,
				"String,String,String,#ComparisonOperator");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_STRING_FILTER_BY_NAME,
				"String,String,String,#ComparisonOperator");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_STRING_FILTER_BY_PRESENTATION,
				"String,#PresentationType,String,#ComparisonOperator");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_TOUCHES_GEOMETRY_FILTER,
				"#IQDimension,String,IXGeometry");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_WITHIN_DISTANCE_FILTER,
				"#IQDimension,String,IXPoint,double,String");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.ADD_WITHIN_GEOMETRY_FILTER,
				"#IQDimension,String,IXGeometry");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.ALIGN_TOTALS,
				"#QModelLevel,String,#ResultAlignment");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.CLEAR_ALL_FIELDS_FROM_MODEL_AREA,
				"#QContextType");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.CLEAR_ALL_FILTERS_EXT,
				"#FilterLayer,#FilterScopeVariables");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.CLEAR_AXIS,
				"#AxisType");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.CLEAR_FIELDS,
				"#DimensionType,String,#QContextType");
		oFF.QCmdSignature.s_signature
				.put(oFF.QCmdSignature.CLEAR_FILTER_BY_ID_EXT,
						"#FilterLayer,String");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.CLEAR_FILTERS_BY_DIMENSION_EXT,
				"#FilterLayer,#DimensionType,String");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.CLEAR_SINGLE_MEMBER_FILTER_BY_NAME,
				"String,String,#ComparisonOperator");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.CLEAR_SORT,
				"#SortType,String");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.CONTAINS_FIELD,
				"String,String,#QContextType");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.CONTAINS_RESULT_SET_FIELD_BY_TYPE,
				"String,#PresentationType");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.CONTAINS_SELECTOR_FIELD_BY_TYPE,
				"String,#PresentationType");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.EXECUTE_CODE,
				"IPrStructure");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.GET_ABSTRACT_RENDERING,
				"#SemanticBindingType");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.GET_DIMENSION,
				"String");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.GET_DIMENSIONS_CONTAINING_VALUE_TYPE,
				"#XValueType");
		oFF.QCmdSignature.s_signature
				.put(oFF.QCmdSignature.GET_FIELD, "String");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.GET_FILTER_BY_ID,
				"String");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.GET_FIRST_DIMENSION_WITH_TYPE,
				"#DimensionType");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.GET_G_I_S_ATTRIBUTES_FOR_DIMENSION,
				"#IQDimension");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.GET_MEASURE,
				"String");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.GET_REFERENCE_GRID,
				"boolean");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.GET_VARIABLE,
				"String");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.GET_VISIBILITY_FILTER_BY_ID, "String");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.MOVE_DIMENSION_EXT,
				"#DimensionType,String,#AxisType,int");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.NEW_RECEIVER_BINDING, "#SemanticBindingType");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.NEW_SENDER_BINDING,
				"#SemanticBindingType");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.PROCESS_QUERY_EXECUTION,
				"#SyncType,IQueryExecutedListener,IXObject");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.PROCESS_QUERY_MANAGER_CREATION,
				"#SyncType,IQueryManagerCreatedListener,IXObject");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.REGISTER_CHANGED_LISTENER,
				"IQChangedListener,IXObject");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.REMOVE_ATTRIBUTE_FROM_RESULT_SET,
				"String,String");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.REMOVE_FIELD,
				"#DimensionType,String,#PresentationType,String,#QContextType");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.SET_DIMENSION_AND_MEASURE, "String,String");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.SET_DIMENSION_HIERARCHY,
				"String,String,boolean,int");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.SET_DIMENSIONS_AND_MEASURES,
				"IXListOfString,IXListOfString");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.SET_EXECUTE_REQUEST_ON_OLD_RESULT_SET,
				"boolean");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.SET_FIELD,
				"#DimensionType,String,#PresentationType,String,#QContextType");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.SET_MAX_COLUMNS,
				"int");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.SET_MAX_RESULT_RECORDS, "long");
		oFF.QCmdSignature.s_signature
				.put(oFF.QCmdSignature.SET_MAX_ROWS, "int");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.SET_OFFSET_COLUMNS,
				"int");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.SET_OFFSET_ROWS,
				"int");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.SET_RESULT_SET_PERSISTANCE_IDENTIFIER,
				"String");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.SET_RESULT_SET_PERSISTANCE_TARGET_SCHEMA,
				"String");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.SET_RESULT_SET_PERSISTANCE_TARGET_TABLE,
				"String");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.SET_RESULT_SET_TRANSPORT_ENABLED, "boolean");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.SET_SEARCH_TERM,
				"String");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.SET_TOTALS_VISIBLE,
				"#QModelLevel,String,#ResultVisibility");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.SET_UNIVERSAL_DISPLAY_HIERARCHY,
				"IXListOfString,int,boolean");
		oFF.QCmdSignature.s_signature.put(oFF.QCmdSignature.SET_VARIABLE,
				"String,String");
		oFF.QCmdSignature.s_signature
				.put(
						oFF.QCmdSignature.SORT,
						"#SortType,#DimensionType,String,#PresentationType,String,String,#XSortDirection");
		oFF.QCmdSignature.s_signature.put(
				oFF.QCmdSignature.UNREGISTER_CHANGED_LISTENER,
				"IQChangedListener");
	};
	oFF.QCmdSignature.lookupSignature = function(name) {
		return oFF.QCmdSignature.s_signature.getByKey(name);
	};
	oFF.QConvenienceCommands = function() {
	};
	oFF.QConvenienceCommands.prototype = new oFF.QCmdAbstract();
	oFF.QConvenienceCommands.create = function(olapApplication, component) {
		var cmds = new oFF.QConvenienceCommands();
		cmds.m_olapEnvironment = olapApplication;
		cmds.m_activeComponent = component;
		return cmds;
	};
	oFF.QConvenienceCommands.prototype.m_activeComponent = null;
	oFF.QConvenienceCommands.prototype.m_olapEnvironment = null;
	oFF.QConvenienceCommands.prototype.releaseObject = function() {
		this.m_activeComponent = null;
		this.m_olapEnvironment = null;
		oFF.QCmdAbstract.prototype.releaseObject.call(this);
	};
	oFF.QConvenienceCommands.prototype.getComponentType = function() {
		return this.getOlapComponentType();
	};
	oFF.QConvenienceCommands.prototype.getOlapComponentType = function() {
		return oFF.OlapComponentType.CONVENIENCE_CMDS;
	};
	oFF.QConvenienceCommands.prototype.getSession = function() {
		return this.getApplication().getSession();
	};
	oFF.QConvenienceCommands.prototype.getApplication = function() {
		return this.getOlapEnv().getApplication();
	};
	oFF.QConvenienceCommands.prototype.getOlapEnv = function() {
		return this.m_olapEnvironment;
	};
	oFF.QConvenienceCommands.prototype.setActiveComponent = function(component) {
		var olapComponentType;
		if (oFF.notNull(component)) {
			olapComponentType = component.getComponentType();
			if (olapComponentType === oFF.OlapComponentType.QUERY_MODEL
					|| olapComponentType === oFF.OlapComponentType.QUERY_MANAGER
					|| olapComponentType === oFF.OlapComponentType.OLAP_DATA_PROVIDER) {
				this.m_activeComponent = component;
				return true;
			}
		}
		this.m_activeComponent = null;
		return false;
	};
	oFF.QConvenienceCommands.prototype.getQueryServiceConfig = function() {
		var olapComponentType;
		var qm;
		if (oFF.notNull(this.m_activeComponent)) {
			olapComponentType = this.m_activeComponent.getOlapComponentType();
			if (olapComponentType === oFF.OlapComponentType.OLAP_DATA_PROVIDER) {
				return this.m_activeComponent;
			} else {
				if (olapComponentType === oFF.OlapComponentType.QUERY_MANAGER) {
					qm = this.m_activeComponent;
					return qm.getQueryServiceConfig();
				}
			}
		}
		return null;
	};
	oFF.QConvenienceCommands.prototype.getQueryManager = function() {
		var olapComponentType;
		var dp;
		if (oFF.notNull(this.m_activeComponent)) {
			olapComponentType = this.m_activeComponent.getOlapComponentType();
			if (olapComponentType === oFF.OlapComponentType.QUERY_MANAGER) {
				return this.m_activeComponent;
			} else {
				if (olapComponentType === oFF.OlapComponentType.OLAP_DATA_PROVIDER) {
					dp = this.m_activeComponent;
					return dp.getQueryManager();
				}
			}
		}
		return null;
	};
	oFF.QConvenienceCommands.prototype.getQueryModel = function() {
		var olapComponentType;
		var queryManager;
		if (oFF.notNull(this.m_activeComponent)) {
			olapComponentType = this.m_activeComponent.getOlapComponentType();
			if (olapComponentType === oFF.OlapComponentType.QUERY_MODEL) {
				return this.m_activeComponent;
			}
			queryManager = this.getQueryManager();
			if (oFF.notNull(queryManager)) {
				return queryManager.getQueryModel();
			}
		}
		return null;
	};
	oFF.QConvenienceCommands.prototype.getDataSource = function() {
		var queryModel = this.getQueryModel();
		if (oFF.isNull(queryModel)) {
			return null;
		}
		return queryModel.getDataSource();
	};
	oFF.QConvenienceCommands.prototype.getModelCapabilities = function() {
		var queryModel = this.getQueryModel();
		if (oFF.isNull(queryModel)) {
			return null;
		}
		return queryModel.getModelCapabilities();
	};
	oFF.QConvenienceCommands.prototype.getDimensionsContainingValueType = function(
			valueType) {
		var dimList = oFF.XList.create();
		var dimensions = this.getQueryModel().getDimensions();
		var count = dimensions.getDimensionCount();
		var idxDim;
		var dim;
		var attributesOfDimList;
		var idxField;
		var attribute;
		for (idxDim = 0; idxDim < count; idxDim++) {
			dim = dimensions.getDimensionAt(idxDim);
			attributesOfDimList = dim.getFields();
			for (idxField = 0; idxField < attributesOfDimList.size(); idxField++) {
				attribute = attributesOfDimList.getFieldAt(idxField);
				if (attribute.getValueType() === valueType) {
					dimList.add(dim);
					break;
				}
			}
		}
		return dimList;
	};
	oFF.QConvenienceCommands.prototype.getFirstDimensionWithType = function(
			dimensionType) {
		return this.getQueryModel().getDimensionByType(dimensionType);
	};
	oFF.QConvenienceCommands.prototype.getDimensionNames = function() {
		var dimensionNames = oFF.XListOfString.create();
		var queryModel = this.getQueryModel();
		var dimensions;
		var namesIndex;
		if (oFF.notNull(queryModel)) {
			dimensions = queryModel.getDimensions();
			for (namesIndex = 0; namesIndex < dimensions.size(); namesIndex++) {
				dimensionNames.add(dimensions.get(namesIndex).getName());
			}
		}
		return dimensionNames;
	};
	oFF.QConvenienceCommands.prototype.getDimension = function(dimName) {
		return this.getQueryModel().getDimensionByName(dimName);
	};
	oFF.QConvenienceCommands.prototype.getDimensionAccessor = function() {
		return this.getQueryManager().getDimensionAccessor();
	};
	oFF.QConvenienceCommands.prototype.select = oFF.noSupport;
	oFF.QConvenienceCommands.prototype.resolveDimension = function(dimType,
			dimName) {
		var resolvedDimName = this.resolveDimName(dimType, dimName);
		return this.getDimensionAccessor().getDimensionByName(resolvedDimName);
	};
	oFF.QConvenienceCommands.prototype.resolveDimName = function(dimType,
			dimName) {
		var dimension;
		if (oFF.isNull(dimName)) {
			if (oFF.isNull(dimType)) {
				return null;
			}
			dimension = this.getDimensionAccessor().getDimensionByType(dimType);
			if (oFF.notNull(dimension)) {
				return dimension.getName();
			}
		}
		return dimName;
	};
	oFF.QConvenienceCommands.prototype.registerChangedListener = oFF.noSupport;
	oFF.QConvenienceCommands.prototype.unregisterChangedListener = oFF.noSupport;
	oFF.QConvenienceCommands.prototype.getSenderBindings = oFF.noSupport;
	oFF.QConvenienceCommands.prototype.getReceiverBindings = oFF.noSupport;
	oFF.QConvenienceCommands.prototype.newSenderBinding = oFF.noSupport;
	oFF.QConvenienceCommands.prototype.getReceiverProtocolBindings = oFF.noSupport;
	oFF.QConvenienceCommands.prototype.getSenderProtocolBindings = oFF.noSupport;
	oFF.QConvenienceCommands.prototype.newReceiverBinding = oFF.noSupport;
	oFF.QConvenienceCommands.prototype.clearFilterExpression = function(filter) {
		if (oFF.notNull(filter) && !filter.isLocked()) {
			if (filter.isCartesianProduct()) {
				filter.getCartesianProduct().clear();
			} else {
				if (filter.isComplexFilter()) {
					filter.setComplexRoot(null);
				}
			}
		}
	};
	oFF.QConvenienceCommands.prototype.reset = function() {
		var queryModel;
		var filter;
		var measureDimension;
		var accountDimension;
		var conditionManager;
		this.clearAxis(oFF.AxisType.ROWS);
		this.clearAxis(oFF.AxisType.COLUMNS);
		queryModel = this.getQueryModel();
		filter = queryModel.getFilter();
		this.clearFilterExpression(filter.getDynamicFilter());
		if (filter.hasTmpFilter()) {
			this.clearFilterExpression(filter.getTmpFilter());
		}
		if (filter.supportsVisibilityFilter()) {
			this.clearFilterExpression(filter.getVisibilityFilter());
		}
		if (filter.hasTmpVisibilityFilter()) {
			this.clearFilterExpression(filter.getTmpVisibilityFilter());
		}
		measureDimension = queryModel.getMeasureDimension();
		if (oFF.notNull(measureDimension)) {
			measureDimension.removeCustomMembers();
		}
		accountDimension = queryModel
				.getDimensionByType(oFF.DimensionType.ACCOUNT);
		if (oFF.notNull(accountDimension)) {
			accountDimension.removeCustomMembers();
		}
		queryModel.clearCalculatedDimensions();
		queryModel.clearPreQueries();
		queryModel.getDrillManager().removeAllContextDrillOperations();
		conditionManager = queryModel.getConditionManager();
		if (oFF.notNull(conditionManager)) {
			conditionManager.clear();
		}
		queryModel.getExceptionManager().clear();
		queryModel.getSortingManager().getSortingOperations().clear();
		this.getQueryManager().enableHierarchyToUDHConversion(false);
		return this;
	};
	oFF.QConvenienceCommands.prototype.resetToDefault = function() {
		var queryModel = this.getQueryModel();
		var importer = oFF.QInAImportFactory.createForData(this
				.getApplication(), queryModel.getProtocolCapabilities()
				.getIntersectCapabilities());
		importer.importQueryModel(queryModel.getServerBaseSerialization(),
				queryModel);
		return this;
	};
	oFF.QConvenienceCommands.prototype.addFilter = function(filterLayer,
			dimType, dimName, presentationType, fieldName, lowValue, highValue,
			comparisonOperator) {
		var dimension = this.resolveDimension(dimType, dimName);
		var field;
		var filterContainer;
		var memberSelection;
		var element;
		var numberOfParameters;
		var valueAccess;
		if (oFF.notNull(dimension)) {
			field = this.resolveField(dimension, presentationType, fieldName);
			if (oFF.notNull(field) && field.isFilterable()) {
				filterContainer = this.getFilterContainer(filterLayer);
				memberSelection = filterContainer
						.getCartesianListByField(field);
				if (oFF.notNull(memberSelection)) {
					if (memberSelection.isEmpty()) {
						memberSelection.setField(field);
					}
					if (memberSelection.getField() === field) {
						memberSelection.queueEventing();
						element = memberSelection.addNewCartesianElement();
						numberOfParameters = comparisonOperator
								.getNumberOfParameters();
						if (numberOfParameters > 0) {
							valueAccess = oFF.XValueAccess.createWithType(field
									.getValueType());
							valueAccess.parseString(lowValue);
							element.configureSingleParameterExpression(
									valueAccess.getValue(), comparisonOperator);
							if (numberOfParameters > 1) {
								valueAccess.parseString(highValue);
								element.getHigh().setValue(
										valueAccess.getValue());
							}
						}
						if (dimension.isHierarchyActive()) {
							memberSelection.setHierarchyName(dimension
									.getHierarchyName());
						}
						memberSelection.resumeEventing();
						return element;
					}
				}
			}
		}
		return null;
	};
	oFF.QConvenienceCommands.prototype.addIntervalFilterByValues = function(
			dimensionName, lowValue, highValue) {
		var dimension = this.getDimension(dimensionName);
		if (oFF.isNull(dimension)) {
			return null;
		}
		return this.addFilterByField(dimension.getKeyField(), lowValue,
				highValue, null, oFF.ComparisonOperator.BETWEEN, false);
	};
	oFF.QConvenienceCommands.prototype.addWithinDistanceFilter = function(
			dimension, fieldName, point, distance, unit) {
		return this.addFilterByField(dimension.getFieldByName(fieldName),
				point, oFF.XDoubleValue.create(distance), oFF.XStringValue
						.create(unit),
				oFF.SpatialComparisonOperator.WITHIN_DISTANCE, false);
	};
	oFF.QConvenienceCommands.prototype.addSingleNodeFilter = function(node,
			comparisonOperator) {
		var dynamicFilter = this.getFilterContainer(oFF.FilterLayer.DYNAMIC);
		return dynamicFilter.addSingleNodeFilter(node, comparisonOperator);
	};
	oFF.QConvenienceCommands.prototype.addSingleMemberFilter = function(
			filterLayer, dimType, dimName, memberName, comparisonOperator) {
		var selectionContainer = this.getFilterContainer(filterLayer);
		return selectionContainer.addSingleMemberFilterByName(this
				.resolveDimName(dimType, dimName), memberName,
				comparisonOperator);
	};
	oFF.QConvenienceCommands.prototype.addDoubleFilterByFieldName = function(
			dimensionName, fieldName, filterValue, comparisonOperator) {
		var field = this.getFieldFromDimension(dimensionName, fieldName);
		return this.addDoubleFilterByField(field, filterValue,
				comparisonOperator);
	};
	oFF.QConvenienceCommands.prototype.addDoubleFilterByField = function(field,
			filterValue, comparisonOperator) {
		return this.addFilterByField(field, oFF.XDoubleValue
				.create(filterValue), null, null, comparisonOperator, false);
	};
	oFF.QConvenienceCommands.prototype.clearSingleMemberFilterByName = function(
			dimName, memberName, comparisonOperator) {
		var selectionStateContainer = this
				.getFilterContainer(oFF.FilterLayer.DYNAMIC);
		selectionStateContainer.removeSingleMemberFilterByName(dimName,
				memberName, comparisonOperator);
		return this;
	};
	oFF.QConvenienceCommands.prototype.addStringFilterByName = function(
			dimensionName, fieldName, filterValue, comparisonOperator) {
		var field = this.getFieldFromDimension(dimensionName, fieldName);
		return this.addStringFilterByField(field, filterValue,
				comparisonOperator);
	};
	oFF.QConvenienceCommands.prototype.addStringFilterByPresentation = function(
			dimensionName, presentationType, filterValue, comparisonOperator) {
		var dimension = this.getDimension(dimensionName);
		var field;
		if (oFF.isNull(dimension)) {
			return null;
		}
		field = dimension.getFirstFieldByType(presentationType);
		return this.addStringFilterByField(field, filterValue,
				comparisonOperator);
	};
	oFF.QConvenienceCommands.prototype.addStringFilterByFieldNameAndOperator = function(
			dimensionName, fieldName, filterValue, comparisonOperator) {
		return this.addStringFilterByName(dimensionName, fieldName,
				filterValue, comparisonOperator);
	};
	oFF.QConvenienceCommands.prototype.addStringFilterByField = function(field,
			filterValue, comparisonOperator) {
		return this.addFilterByField(field, oFF.XStringValue
				.create(filterValue), null, null, comparisonOperator, false);
	};
	oFF.QConvenienceCommands.prototype.addFilterByFieldAndValue = function(
			field, filterValue, comparisonOperator) {
		return this.addFilterByField(field, filterValue, null, null,
				comparisonOperator, false);
	};
	oFF.QConvenienceCommands.prototype.addIntFilterByFieldName = function(
			dimensionName, fieldName, filterValue, comparisonOperator) {
		var field = this.getFieldFromDimension(dimensionName, fieldName);
		return this.addIntFilterByField(field, filterValue, comparisonOperator);
	};
	oFF.QConvenienceCommands.prototype.addIntFilterByField = function(field,
			filterValue, comparisonOperator) {
		return this.addFilterByField(field, oFF.XIntegerValue
				.create(filterValue), null, null, comparisonOperator, false);
	};
	oFF.QConvenienceCommands.prototype.addLongFilterByFieldName = function(
			dimensionName, fieldName, filterValue, comparisonOperator) {
		var field = this.getFieldFromDimension(dimensionName, fieldName);
		return this
				.addLongFilterByField(field, filterValue, comparisonOperator);
	};
	oFF.QConvenienceCommands.prototype.addLongFilterByField = function(field,
			filterValue, comparisonOperator) {
		return this.addFilterByField(field, oFF.XLongValue.create(filterValue),
				null, null, comparisonOperator, false);
	};
	oFF.QConvenienceCommands.prototype.clearVariableSelections = function(
			dynamicFilter, inspectLists) {
		var cartesianProduct = dynamicFilter.getCartesianProduct();
		var filterIdsFromVariables;
		var idxProd;
		var cartesianList;
		var idxList;
		var cartesianElement;
		if (oFF.isNull(cartesianProduct)) {
			return;
		}
		filterIdsFromVariables = dynamicFilter.getFilterIdsFromVariables();
		if (oFF.XCollectionUtils.hasElements(filterIdsFromVariables)) {
			idxProd = 0;
			while (idxProd < cartesianProduct.size()) {
				cartesianList = cartesianProduct.getCartesianChild(idxProd);
				if (filterIdsFromVariables
						.contains(cartesianList.getUniqueId())) {
					if (inspectLists) {
						idxList = 0;
						while (idxList < cartesianList.size()) {
							cartesianElement = cartesianList.getOp(idxList);
							if (filterIdsFromVariables
									.contains(cartesianElement.getUniqueId())) {
								idxList++;
							} else {
								cartesianList.removeAt(idxList);
							}
						}
					}
					idxProd++;
				} else {
					cartesianProduct.removeAt(idxProd);
				}
			}
		} else {
			cartesianProduct.clear();
		}
	};
	oFF.QConvenienceCommands.prototype.clearNonMeasureFilters = function() {
		return this.clearFiltersExceptDimensionType(oFF.FilterLayer.DYNAMIC,
				oFF.DimensionType.MEASURE_STRUCTURE);
	};
	oFF.QConvenienceCommands.prototype.clearNonStructureFilters = function() {
		return this.clearFiltersExceptDimensionType(oFF.FilterLayer.DYNAMIC,
				oFF.DimensionType.ABSTRACT_STRUCTURE);
	};
	oFF.QConvenienceCommands.prototype.clearFiltersExceptDimensionType = function(
			filterContainer, dimType) {
		var filterExpression = this.getFilterContainer(filterContainer);
		var cartesianProduct;
		var i;
		var cartesianList;
		var filterDimension;
		if (filterExpression.isCartesianProduct()) {
			cartesianProduct = filterExpression.getCartesianProduct();
			if (oFF.notNull(cartesianProduct)) {
				i = cartesianProduct.size() - 1;
				while (i >= 0) {
					cartesianList = cartesianProduct.getCartesianChild(i);
					filterDimension = cartesianList.getDimension();
					if (!filterDimension.getDimensionType().isTypeOf(dimType)) {
						cartesianProduct.removeAt(i);
					}
					i--;
				}
			}
		} else {
			this.removeComplexSelection(filterExpression.getComplexRoot(),
					dimType);
		}
		return this;
	};
	oFF.QConvenienceCommands.prototype.clearFiltersByDimensionExt = function(
			filterLayer, dimType, dimName) {
		var theDimName = this.resolveDimName(dimType, dimName);
		var filterExpression;
		if (oFF.notNull(theDimName)) {
			if (oFF.notNull(filterLayer)) {
				filterExpression = this.getFilterContainer(filterLayer);
				this.clearSelectionsInContainerByDimension(theDimName,
						filterExpression);
			}
		}
		return this;
	};
	oFF.QConvenienceCommands.prototype.clearAllFiltersExt = function(
			filterLayer, filterScopeVariables) {
		var selectionContainer;
		if (filterLayer === oFF.FilterLayer.ALL) {
			this.clearAllFiltersExt(oFF.FilterLayer.DYNAMIC,
					filterScopeVariables);
			this.clearAllFiltersExt(oFF.FilterLayer.VISIBILITY,
					filterScopeVariables);
		} else {
			selectionContainer = this.getFilterContainer(filterLayer);
			if (filterScopeVariables === oFF.FilterScopeVariables.IGNORE
					|| oFF.isNull(filterScopeVariables)) {
				this.clearFilterExpression(selectionContainer);
			} else {
				if (filterScopeVariables === oFF.FilterScopeVariables.NOT_AFFECTED_BY_VARIABLES) {
					this.clearVariableSelections(selectionContainer, false);
				} else {
					if (filterScopeVariables === oFF.FilterScopeVariables.NOT_CREATED_BY_VARIABLES) {
						this.clearVariableSelections(selectionContainer, true);
					}
				}
			}
		}
		return this;
	};
	oFF.QConvenienceCommands.prototype.clearSelectionsInContainerByDimension = function(
			dimName, container) {
		var cartesianProduct = container.getCartesianProduct();
		var complexSelectionRoot;
		var componentType;
		var filterOp;
		var complexCartesianList;
		var memberSelection;
		if (oFF.isNull(cartesianProduct)) {
			complexSelectionRoot = container.getComplexRoot();
			if (oFF.notNull(complexSelectionRoot)) {
				componentType = complexSelectionRoot.getComponentType();
				if (componentType === oFF.FilterComponentType.OPERATION) {
					filterOp = complexSelectionRoot;
					if (oFF.XString.isEqual(dimName, filterOp.getDimension()
							.getName())) {
						container.setComplexRoot(null);
					}
				} else {
					if (componentType === oFF.FilterComponentType.AND
							|| componentType === oFF.FilterComponentType.OR) {
						this.removeComplexSelectionByDimensionName(
								complexSelectionRoot, dimName);
					} else {
						if (componentType === oFF.FilterComponentType.CARTESIAN_LIST) {
							complexCartesianList = complexSelectionRoot;
							if (oFF.XString.isEqual(complexCartesianList
									.getDimension().getName(), dimName)) {
								complexCartesianList.clear();
							}
						}
					}
				}
			}
		} else {
			memberSelection = cartesianProduct
					.getCartesianListByDimensionName(dimName);
			if (oFF.notNull(memberSelection)) {
				memberSelection.clear();
				cartesianProduct.removeByDimensionName(dimName);
			}
		}
	};
	oFF.QConvenienceCommands.prototype.removeComplexSelection = function(
			filterElement, dimType) {
		var componentType;
		var filterOp;
		var filterAlgebra;
		var idxFilterOp;
		var iqFilterElement;
		var removeFilter;
		var complexCartesianList;
		if (oFF.notNull(filterElement)) {
			componentType = filterElement.getComponentType();
			if (componentType === oFF.FilterComponentType.OPERATION) {
				filterOp = filterElement;
				return !filterOp.getDimension().getDimensionType().isTypeOf(
						dimType);
			} else {
				if (componentType === oFF.FilterComponentType.AND
						|| componentType === oFF.FilterComponentType.OR) {
					filterAlgebra = filterElement;
					idxFilterOp = 0;
					while (idxFilterOp < filterAlgebra.size()) {
						iqFilterElement = filterAlgebra.get(idxFilterOp);
						removeFilter = this.removeComplexSelection(
								iqFilterElement, dimType);
						if (removeFilter) {
							filterAlgebra.removeAt(idxFilterOp);
						} else {
							idxFilterOp++;
						}
					}
				} else {
					if (componentType === oFF.FilterComponentType.CARTESIAN_LIST) {
						complexCartesianList = filterElement;
						return !complexCartesianList.getDimension()
								.getDimensionType().isTypeOf(dimType);
					}
				}
			}
		}
		return false;
	};
	oFF.QConvenienceCommands.prototype.removeComplexSelectionByDimensionName = function(
			filterElement, dimensionName) {
		var componentType = filterElement.getComponentType();
		var filterOp;
		var filterAlgebra;
		var idxFilterOp;
		var iqFilterElement;
		var removeComplexSelectionByDimensionName;
		var complexCartesianList;
		if (componentType === oFF.FilterComponentType.OPERATION) {
			filterOp = filterElement;
			return oFF.XString.isEqual(dimensionName, filterOp.getDimension()
					.getName());
		} else {
			if (componentType === oFF.FilterComponentType.AND
					|| componentType === oFF.FilterComponentType.OR) {
				filterAlgebra = filterElement;
				idxFilterOp = 0;
				while (idxFilterOp < filterAlgebra.size()) {
					iqFilterElement = filterAlgebra.get(idxFilterOp);
					removeComplexSelectionByDimensionName = this
							.removeComplexSelectionByDimensionName(
									iqFilterElement, dimensionName);
					if (removeComplexSelectionByDimensionName) {
						filterAlgebra.removeAt(idxFilterOp);
					} else {
						idxFilterOp++;
					}
				}
			} else {
				if (componentType === oFF.FilterComponentType.CARTESIAN_LIST) {
					complexCartesianList = filterElement;
					return oFF.XString.isEqual(complexCartesianList
							.getDimension().getName(), dimensionName);
				}
			}
		}
		return false;
	};
	oFF.QConvenienceCommands.prototype.addDisjointGeometryFilter = function(
			dimension, fieldName, geometry) {
		return this.addFilterByField(dimension.getFieldByName(fieldName),
				geometry, null, null, oFF.SpatialComparisonOperator.DISJOINT,
				false);
	};
	oFF.QConvenienceCommands.prototype.addOverlapsGeometryFilter = function(
			dimension, fieldName, geometry) {
		return this.addFilterByField(dimension.getFieldByName(fieldName),
				geometry, null, null, oFF.SpatialComparisonOperator.OVERLAPS,
				false);
	};
	oFF.QConvenienceCommands.prototype.addTouchesGeometryFilter = function(
			dimension, fieldName, geometry) {
		return this.addFilterByField(dimension.getFieldByName(fieldName),
				geometry, null, null, oFF.SpatialComparisonOperator.TOUCHES,
				false);
	};
	oFF.QConvenienceCommands.prototype.addWithinGeometryFilter = function(
			dimension, fieldName, geometry) {
		return this.addFilterByField(dimension.getFieldByName(fieldName),
				geometry, null, null, oFF.SpatialComparisonOperator.WITHIN,
				false);
	};
	oFF.QConvenienceCommands.prototype.addFilterByField = function(field,
			firstValue, secondValue, thirdValue, comparisonOperator,
			isVisibility) {
		var filterLayer;
		var filterContainer;
		var memberSelection;
		var element;
		var numberOfParameters;
		var dimension;
		if (oFF.isNull(field) || !field.isFilterable()) {
			return null;
		}
		if (isVisibility
				&& !this.getQueryModel().getFilter().supportsVisibilityFilter()) {
			return null;
		}
		if (isVisibility) {
			filterLayer = oFF.FilterLayer.VISIBILITY;
		} else {
			filterLayer = oFF.FilterLayer.DYNAMIC;
		}
		filterContainer = this.getFilterContainer(filterLayer);
		memberSelection = filterContainer.getCartesianListByField(field);
		if (oFF.notNull(memberSelection)) {
			if (memberSelection.isEmpty()) {
				memberSelection.setField(field);
			} else {
				if (memberSelection.getField() !== field) {
					return null;
				}
			}
			memberSelection.queueEventing();
			element = memberSelection.addNewCartesianElement();
			numberOfParameters = comparisonOperator.getNumberOfParameters();
			if (numberOfParameters === 3) {
				element.configureTripleParameterExpression(firstValue,
						secondValue, thirdValue, comparisonOperator);
			} else {
				element.configureDoubleParameterExpression(firstValue,
						secondValue, comparisonOperator);
			}
			dimension = field.getDimension();
			if (dimension.isHierarchyActive()) {
				memberSelection.setHierarchyName(dimension.getHierarchyName());
			}
			memberSelection.resumeEventing();
		}
		return memberSelection;
	};
	oFF.QConvenienceCommands.prototype.addIntersectsRectFilter = function(
			dimension, fieldName, lowerLeft, upperRight) {
		return this.addFilterByField(dimension.getFieldByName(fieldName),
				lowerLeft, upperRight, null,
				oFF.SpatialComparisonOperator.INTERSECTS_RECT, false);
	};
	oFF.QConvenienceCommands.prototype.addContainsGeometryFilter = function(
			dimension, fieldName, geometry) {
		return this.addFilterByField(dimension.getFieldByName(fieldName),
				geometry, null, null, oFF.SpatialComparisonOperator.CONTAINS,
				false);
	};
	oFF.QConvenienceCommands.prototype.addIntersectsGeometryFilter = function(
			dimension, fieldName, geometry) {
		return this.addFilterByField(dimension.getFieldByName(fieldName),
				geometry, null, null, oFF.SpatialComparisonOperator.INTERSECTS,
				false);
	};
	oFF.QConvenienceCommands.prototype.addCoversGeometryFilter = function(
			dimension, fieldName, geometry) {
		return this.addFilterByField(dimension.getFieldByName(fieldName),
				geometry, null, null, oFF.SpatialComparisonOperator.COVERS,
				false);
	};
	oFF.QConvenienceCommands.prototype.addCrossesLinestringFilter = function(
			dimension, fieldName, geometry) {
		if (geometry.getValueType() === oFF.XValueType.LINE_STRING
				|| geometry.getValueType() === oFF.XValueType.MULTI_LINE_STRING) {
			return this.addFilterByField(dimension.getFieldByName(fieldName),
					geometry, null, null, oFF.SpatialComparisonOperator.COVERS,
					false);
		}
		return null;
	};
	oFF.QConvenienceCommands.prototype.setSearchTerm = function(searchTerm) {
		var globalLiteralFilter = this.getQueryModel().getFilter()
				.getDynamicFilter().getGlobalLiteralFilter();
		globalLiteralFilter.setFilterValue(searchTerm);
		return this;
	};
	oFF.QConvenienceCommands.prototype.getFilterContainer = function(
			filterLayer) {
		var filter = this.getQueryModel().getFilter();
		if (filterLayer === oFF.FilterLayer.VISIBILITY) {
			return filter.getVisibilityFilter();
		}
		return filter.getDynamicFilter();
	};
	oFF.QConvenienceCommands.prototype.getFilterById = function(uniqueId) {
		return this.getFilterContainer(oFF.FilterLayer.DYNAMIC).getFilterById(
				uniqueId);
	};
	oFF.QConvenienceCommands.prototype.clearFilterByIdExt = function(
			filterLayer, uniqueId) {
		var filterContainer;
		if (filterLayer === oFF.FilterLayer.ALL) {
			this.clearFilterByIdExt(oFF.FilterLayer.DYNAMIC, uniqueId);
			this.clearFilterByIdExt(oFF.FilterLayer.VISIBILITY, uniqueId);
		} else {
			filterContainer = this.getFilterContainer(filterLayer);
			filterContainer.removeFilterById(uniqueId);
		}
		return this;
	};
	oFF.QConvenienceCommands.prototype.getVisibilityFilterById = function(
			uniqueId) {
		return this.getFilterContainer(oFF.FilterLayer.VISIBILITY)
				.getFilterById(uniqueId);
	};
	oFF.QConvenienceCommands.prototype.setVariable = function(name, value) {
		var variable = this.getQueryManager().getVariables().getByKey(name);
		var variableType;
		var hnv;
		var hnodev;
		var dimMember;
		var simpleType;
		if (oFF.notNull(variable) && variable.isInputEnabled()) {
			variableType = variable.getVariableType();
			if (variableType === oFF.VariableType.HIERARCHY_NAME_VARIABLE) {
				hnv = variable;
				hnv.setValueByString(value);
			} else {
				if (variableType === oFF.VariableType.HIERARCHY_NODE_VARIABLE) {
					hnodev = variable;
					hnodev.setValueByString(value);
				} else {
					if (variableType === oFF.VariableType.DIMENSION_MEMBER_VARIABLE) {
						dimMember = variable;
						dimMember.setValueByString(value);
					} else {
						if (variableType === oFF.VariableType.SIMPLE_TYPE_VARIABLE) {
							simpleType = variable;
							simpleType.setValueByString(value);
						}
					}
				}
			}
		}
		return this;
	};
	oFF.QConvenienceCommands.prototype.submitVariables = function() {
		return this.getQueryManager().submitVariables(oFF.SyncType.BLOCKING,
				null, null);
	};
	oFF.QConvenienceCommands.prototype.getVariable = function(name) {
		return this.getQueryManager().getVariables().getByKey(name);
	};
	oFF.QConvenienceCommands.prototype.getVariablesNameAndText = function() {
		var map = oFF.XHashMapOfStringByString.create();
		var variables = this.getQueryManager().getVariables();
		var variableSize = variables.size();
		var i;
		var variable;
		for (i = 0; i < variableSize; i++) {
			variable = variables.get(i);
			map.put(variable.getName(), variable.getText());
		}
		return map;
	};
	oFF.QConvenienceCommands.prototype.getVariableContainer = function() {
		return this.getQueryModel().getVariableContainer();
	};
	oFF.QConvenienceCommands.prototype.switchAxes = function() {
		var queryModel = this.getQueryModel();
		var rowsAxis;
		var rows;
		var colsAxis;
		var cols;
		var hierarchies;
		var i;
		var udh;
		if (oFF.notNull(queryModel)) {
			rowsAxis = queryModel.getRowsAxis();
			rows = rowsAxis.createListCopy();
			colsAxis = queryModel.getColumnsAxis();
			cols = colsAxis.createListCopy();
			colsAxis.addAll(rows);
			rowsAxis.addAll(cols);
			hierarchies = this.getQueryModel().getUniversalDisplayHierarchies()
					.getHierarchies();
			for (i = 0; i < hierarchies.size(); i++) {
				udh = hierarchies.get(i);
				udh
						.setAxis(udh.getHierarchyDedicatedAxis().getType() === oFF.AxisType.ROWS ? queryModel
								.getColumnsAxis()
								: queryModel.getRowsAxis());
			}
		}
		return this;
	};
	oFF.QConvenienceCommands.prototype.moveDimensionExt = function(dimType,
			dimName, targetAxis, index) {
		var dimension = this.resolveDimension(dimType, dimName);
		var queryModel;
		var axis;
		if (oFF.notNull(dimension)) {
			queryModel = this.getQueryModel();
			axis = queryModel.getAxis(targetAxis);
			if (oFF.notNull(axis)) {
				if (index === -1) {
					axis.add(dimension);
				} else {
					axis.insert(index, dimension);
				}
			}
		}
		return dimension;
	};
	oFF.QConvenienceCommands.prototype.getFirstGISDimension = function() {
		var dimList = this
				.getDimensionsContainingValueType(oFF.XValueType.POINT);
		if (dimList.isEmpty()) {
			dimList = this
					.getDimensionsContainingValueType(oFF.XValueType.MULTI_POINT);
		}
		if (dimList.isEmpty()) {
			dimList = this
					.getDimensionsContainingValueType(oFF.XValueType.POLYGON);
		}
		if (dimList.isEmpty()) {
			dimList = this
					.getDimensionsContainingValueType(oFF.XValueType.MULTI_POLYGON);
		}
		if (dimList.isEmpty()) {
			dimList = this
					.getDimensionsContainingValueType(oFF.XValueType.LINE_STRING);
		}
		if (dimList.isEmpty()) {
			dimList = this
					.getDimensionsContainingValueType(oFF.XValueType.MULTI_LINE_STRING);
		}
		if (dimList.hasElements()) {
			return dimList.get(0);
		}
		return null;
	};
	oFF.QConvenienceCommands.prototype.getGISAttributesForDimension = function(
			dim) {
		var gisFields = oFF.XList.create();
		var dimensionFields = dim.getFields();
		var idxField;
		var field;
		for (idxField = 0; idxField < dimensionFields.size(); idxField++) {
			field = dimensionFields.getFieldAt(idxField);
			if (field.getValueType().isSpatial()) {
				gisFields.add(field);
			}
		}
		return gisFields;
	};
	oFF.QConvenienceCommands.prototype.clearAxis = function(targetAxis) {
		var queryModel = this.getQueryModel();
		queryModel.getAxis(targetAxis).clear();
		return this;
	};
	oFF.QConvenienceCommands.prototype.addAllDimensions = function() {
		var queryModel;
		var dimensionNames;
		var i;
		var dimensionName;
		var dimension;
		this.queueEventing();
		this.clearAxis(oFF.AxisType.ROWS);
		this.clearAxis(oFF.AxisType.COLUMNS);
		queryModel = this.getQueryModel();
		dimensionNames = this.getDimensionNames();
		dimensionNames.sortByDirection(oFF.XSortDirection.ASCENDING);
		for (i = 0; i < dimensionNames.size(); i++) {
			dimensionName = dimensionNames.get(i);
			dimension = queryModel.getDimensionByName(dimensionName);
			if (!dimension.isSelectable()) {
				continue;
			}
			if (oFF.XString.isEqual(dimension.getName(), "$$All$$")) {
				continue;
			}
			if (oFF.XString.startsWith(dimension.getName(), "$$")) {
				continue;
			}
			if (dimension.isMeasureStructure()) {
				if (dimension.supportsAxis(oFF.AxisType.COLUMNS)) {
					this.moveDimensionToColumns(dimensionName);
				}
			} else {
				if (dimension.supportsAxis(oFF.AxisType.ROWS)) {
					this.moveDimensionToRows(dimensionName);
				}
			}
		}
		this.resumeEventing();
		return this;
	};
	oFF.QConvenienceCommands.prototype.setDimensionsAndMeasures = function(
			dimNames, measures) {
		var dimIdx;
		var dynamicFilter;
		var measureIdx;
		this.clearAxis(oFF.AxisType.COLUMNS);
		this.clearAxis(oFF.AxisType.ROWS);
		for (dimIdx = 0; dimIdx < dimNames.size(); dimIdx++) {
			this.moveDimensionToRows(dimNames.get(dimIdx));
		}
		dynamicFilter = this.getFilterContainer(oFF.FilterLayer.DYNAMIC);
		if (dynamicFilter.isCartesianProduct()) {
			dynamicFilter.getCartesianProduct().clear();
		}
		for (measureIdx = 0; measureIdx < measures.size(); measureIdx++) {
			this.addMeasure(measures.get(measureIdx));
		}
		return this;
	};
	oFF.QConvenienceCommands.prototype.setDimensionAndMeasure = function(
			dimName, measure) {
		var dimensions = oFF.XListOfString.create();
		var measures;
		dimensions.add(dimName);
		measures = oFF.XListOfString.create();
		measures.add(measure);
		this.setDimensionsAndMeasures(dimensions, measures);
		return this;
	};
	oFF.QConvenienceCommands.prototype.addAttributeToResultSet = function(
			dimName, attributeName) {
		var dimension = this.getDimension(dimName);
		var attributeContainer;
		var attribute;
		var resultSetAttributes;
		if (oFF.notNull(dimension)) {
			attributeContainer = dimension.getAttributeContainer();
			attribute = attributeContainer.getAttributeByName(attributeName);
			if (oFF.notNull(attribute)) {
				resultSetAttributes = attributeContainer
						.getResultSetAttributes();
				resultSetAttributes.add(attribute);
				return attribute;
			}
		}
		return null;
	};
	oFF.QConvenienceCommands.prototype.removeAttributeFromResultSet = function(
			dimName, attributeName) {
		var dimension = this.getDimension(dimName);
		var attributeContainer;
		var attribute;
		var resultSetAttributes;
		if (oFF.notNull(dimension)) {
			attributeContainer = dimension.getAttributeContainer();
			attribute = attributeContainer.getAttributeByName(attributeName);
			if (oFF.notNull(attribute)) {
				resultSetAttributes = attributeContainer
						.getResultSetAttributes();
				resultSetAttributes.removeElement(attribute);
				return attribute;
			}
		}
		return null;
	};
	oFF.QConvenienceCommands.prototype.removeField = function(dimType, dimName,
			presentationType, fieldName, contextType) {
		var dimension = this.resolveDimension(dimType, dimName);
		var field = null;
		var resolvedFieldName;
		var fields;
		if (oFF.notNull(dimension)) {
			resolvedFieldName = this.resolveFieldName(dimension.getName(),
					presentationType, fieldName);
			field = dimension.getFieldByName(resolvedFieldName);
			fields = this.getFieldList(dimension, contextType);
			if (!fields.isFixed() && oFF.notNull(field)) {
				fields.removeElement(field);
			}
		}
		return field;
	};
	oFF.QConvenienceCommands.prototype.addField = function(dimType, dimName,
			presentationType, fieldName, contextType) {
		var dimension = this.resolveDimension(dimType, dimName);
		var field = null;
		var resolvedFieldName;
		var fields;
		if (oFF.notNull(dimension)) {
			resolvedFieldName = this.resolveFieldName(dimension.getName(),
					presentationType, fieldName);
			field = dimension.getFieldByName(resolvedFieldName);
			fields = this.getFieldList(dimension, contextType);
			if (!fields.isFixed() && oFF.notNull(field)) {
				fields.add(field);
			}
		}
		return field;
	};
	oFF.QConvenienceCommands.prototype.setField = function(dimType, dimName,
			presentationType, fieldName, contextType) {
		var dimension = this.resolveDimension(dimType, dimName);
		var field = null;
		var resolvedFieldName;
		var fields;
		if (oFF.notNull(dimension)) {
			resolvedFieldName = this.resolveFieldName(dimension.getName(),
					presentationType, fieldName);
			field = dimension.getFieldByName(resolvedFieldName);
			fields = this.getFieldList(dimension, contextType);
			if (!fields.isFixed() && oFF.notNull(field)) {
				fields.queueEventing();
				fields.clear();
				fields.add(field);
				fields.resumeEventing();
			}
		}
		return field;
	};
	oFF.QConvenienceCommands.prototype.clearFields = function(dimType, dimName,
			contextType) {
		var dimension = this.getDimension(dimName);
		if (oFF.notNull(dimension)) {
			this.getFieldList(dimension, contextType).clear();
		}
		return this;
	};
	oFF.QConvenienceCommands.prototype.getFieldList = function(dimension,
			contextType) {
		if (dimension.getFieldLayoutType() === oFF.FieldLayoutType.ATTRIBUTE_BASED) {
			return dimension.getMainAttribute().getFieldsExt(contextType);
		}
		return dimension.getFieldsExt(contextType);
	};
	oFF.QConvenienceCommands.prototype.containsField = function(dimName,
			fieldName, contextType) {
		var dimension = this.getDimension(dimName);
		var field;
		if (oFF.notNull(dimension)) {
			field = dimension.getFieldByName(fieldName);
			if (oFF.notNull(field)) {
				if (contextType === oFF.QContextType.RESULT_SET) {
					return dimension.getResultSetFields().contains(field);
				}
				return dimension.getSelectorFields().contains(field);
			}
		}
		return false;
	};
	oFF.QConvenienceCommands.prototype.containsResultSetFieldByType = function(
			dimName, presentationType) {
		var dimension = this.getDimension(dimName);
		var field;
		if (oFF.isNull(dimension)) {
			return false;
		}
		field = dimension.getFirstFieldByType(presentationType);
		if (oFF.isNull(field)) {
			return false;
		}
		return this.containsResultSetField(dimName, field.getName());
	};
	oFF.QConvenienceCommands.prototype.containsSelectorFieldByType = function(
			dimName, presentationType) {
		var dimension = this.getDimension(dimName);
		var field;
		if (oFF.isNull(dimension)) {
			return false;
		}
		field = dimension.getFirstFieldByType(presentationType);
		if (oFF.isNull(field)) {
			return false;
		}
		return this.containsSelectorField(dimName, field.getName());
	};
	oFF.QConvenienceCommands.prototype.addAllFieldsOfDimensionToModelArea = function(
			dimName, contextType) {
		if (contextType === oFF.QContextType.RESULT_SET) {
			this.addAllFieldsToResultSetOrToSelector(dimName, true);
		} else {
			if (contextType === oFF.QContextType.SELECTOR) {
				this.addAllFieldsToResultSetOrToSelector(dimName, false);
			}
		}
		return this;
	};
	oFF.QConvenienceCommands.prototype.addAllFieldsToResultSetOrToSelector = function(
			dimensionName, isResultSet) {
		var dimension = this.getDimension(dimensionName);
		var fields;
		var fieldNames;
		var hasHierarchy;
		var i;
		var field;
		var usageType;
		var fieldList;
		if (oFF.isNull(dimension)) {
			return;
		}
		fields = dimension.getFields();
		fieldNames = fields.getKeysAsReadOnlyListOfString();
		hasHierarchy = dimension.isHierarchyAssignedAndActive();
		for (i = 0; i < fieldNames.size(); i++) {
			field = fields.getByKey(fieldNames.get(i));
			usageType = field.getUsageType();
			if (hasHierarchy && usageType === oFF.FieldUsageType.FLAT
					|| usageType === oFF.FieldUsageType.HIERARCHY) {
				continue;
			}
			if (isResultSet) {
				fieldList = dimension.getResultSetFields();
			} else {
				fieldList = dimension.getSelectorFields();
			}
			if (!fieldList.isFixed()) {
				fieldList.add(field);
			}
		}
	};
	oFF.QConvenienceCommands.prototype.getField = function(name) {
		return this.getQueryModel().getFieldByName(name);
	};
	oFF.QConvenienceCommands.prototype.addAllFieldsToModelArea = function(
			contextType) {
		var queryModel = this.getQueryModel();
		var dimensions = queryModel.getDimensions();
		var i;
		var dimension;
		for (i = 0; i < dimensions.size(); i++) {
			dimension = dimensions.get(i);
			if (!dimension.isSelectable()) {
				continue;
			}
			if (oFF.XString.startsWith(dimension.getName(), "$$")) {
				continue;
			}
			if (contextType === oFF.QContextType.SELECTOR) {
				this.addAllFieldsToSelector(dimension.getName());
			} else {
				if (contextType === oFF.QContextType.RESULT_SET) {
					this.addAllFieldsToResultSet(dimension.getName());
				}
			}
		}
		return this;
	};
	oFF.QConvenienceCommands.prototype.clearAllFieldsFromModelArea = function(
			contextType) {
		var dimensionNames = this.getDimensionNames();
		var i;
		for (i = 0; i < dimensionNames.size(); i++) {
			if (contextType === oFF.QContextType.RESULT_SET) {
				this.clearAllResultSetFields(dimensionNames.get(i));
			} else {
				if (contextType === oFF.QContextType.SELECTOR) {
					this.clearAllSelectorFields(dimensionNames.get(i));
				}
			}
		}
		return this;
	};
	oFF.QConvenienceCommands.prototype.resolveField = function(dimension,
			presentationType, fieldName) {
		if (oFF.isNull(fieldName)) {
			if (oFF.notNull(presentationType)) {
				return dimension.getFieldByPresentationType(presentationType);
			}
			return dimension.getKeyField();
		}
		return dimension.getFieldByName(fieldName);
	};
	oFF.QConvenienceCommands.prototype.resolveFieldName = function(dimName,
			presentationType, fieldName) {
		var theFieldName = fieldName;
		var dimension;
		var field;
		if (oFF.isNull(fieldName)) {
			if (oFF.notNull(presentationType) && oFF.notNull(dimName)) {
				dimension = this.getDimension(dimName);
				if (oFF.notNull(dimension)) {
					field = dimension
							.getFieldByPresentationType(presentationType);
					if (oFF.isNull(field)) {
						theFieldName = null;
					} else {
						theFieldName = field.getName();
					}
				}
			}
		}
		return theFieldName;
	};
	oFF.QConvenienceCommands.prototype.getFieldAccessorSingle = function() {
		var queryModel = this.getQueryModel();
		if (oFF.isNull(queryModel)) {
			return null;
		}
		return queryModel.getFieldAccessorSingle();
	};
	oFF.QConvenienceCommands.prototype.getFieldFromDimension = function(
			dimensionName, fieldName) {
		var dimension = this.getDimension(dimensionName);
		if (oFF.isNull(dimension)) {
			return null;
		}
		return dimension.getFieldByName(fieldName);
	};
	oFF.QConvenienceCommands.prototype.getDrillManager = function() {
		return this.getQueryModel().getDrillManager();
	};
	oFF.QConvenienceCommands.prototype.drillNode = function(dimName, nodeName,
			drillState) {
		var dimension = this.getDimension(dimName);
		var drillElement = oFF.QFactory.newDrillPathElement(this, nodeName,
				dimension);
		this.getQueryModel().getDrillManager().setDrillStateElement(
				drillElement, drillState);
		return null;
	};
	oFF.QConvenienceCommands.prototype.setDimensionHierarchy = function(
			dimName, hierarchyName, hierarchyActive, initialDrillLevel) {
		var dimension = this.getDimension(dimName);
		if (oFF.notNull(dimension)
				&& !dimension.isUniversalDisplayHierarchyDimension()) {
			dimension.setHierarchyName(hierarchyName);
			dimension.setHierarchyActive(hierarchyActive);
			dimension.setInitialDrillLevel(initialDrillLevel);
		}
		return this;
	};
	oFF.QConvenienceCommands.prototype.setUniversalDisplayHierarchy = function(
			dimensions, initialDrillLevel, active) {
		var udh = this.getQueryModel().getUniversalDisplayHierarchies();
		return udh.setHierarchy(dimensions, initialDrillLevel, active);
	};
	oFF.QConvenienceCommands.prototype.sort = function(sortType, dimType,
			dimName, presentationType, fieldName, memberName, direction) {
		var sortingManager = this.getQueryModel().getSortingManager();
		var dimension;
		var dimensionSorting;
		var member;
		var resolvedDimName;
		var resolvedFieldName;
		var field;
		sortingManager.queueEventing();
		if (sortType === oFF.SortType.MEMBER_KEY
				|| sortType === oFF.SortType.MEMBER_TEXT
				|| sortType === oFF.SortType.HIERARCHY) {
			dimension = this.resolveDimension(dimType, dimName);
			if (oFF.notNull(dimension)
					&& !dimension.isUniversalDisplayHierarchyDimension()) {
				dimensionSorting = sortingManager.getDimensionSorting(
						dimension, true);
				if (sortType === oFF.SortType.MEMBER_KEY) {
					dimensionSorting
							.setSortingPresentationType(oFF.PresentationType.KEY);
				} else {
					if (sortType === oFF.SortType.MEMBER_TEXT) {
						dimensionSorting
								.setSortingPresentationType(oFF.PresentationType.TEXT);
					} else {
						if (sortType === oFF.SortType.HIERARCHY) {
							dimensionSorting.setSortByHierarchy();
						}
					}
				}
				dimensionSorting.setDirection(direction);
			}
		} else {
			if (sortType === oFF.SortType.MEASURE) {
				member = this.getMeasure(memberName);
				if (oFF.notNull(member)) {
					sortingManager.getMeasureSorting(member, true)
							.setDirection(direction);
				}
			} else {
				if (sortType === oFF.SortType.FIELD) {
					resolvedDimName = this.resolveDimName(dimType, dimName);
					resolvedFieldName = this.resolveFieldName(resolvedDimName,
							presentationType, fieldName);
					field = this.getField(resolvedFieldName);
					if (oFF.notNull(field)) {
						sortingManager.getFieldSorting(field, true)
								.setDirection(direction);
					}
				}
			}
		}
		sortingManager.resumeEventing();
		return this;
	};
	oFF.QConvenienceCommands.prototype.clearSort = function(sortType, name) {
		var sortingManager = this.getQueryModel().getSortingManager();
		var sortingOperations = sortingManager.getSortingOperations();
		var dimension;
		var i;
		var sorting;
		if (oFF.isNull(sortType)) {
			sortingOperations.clear();
		} else {
			if (sortType === oFF.SortType.ABSTRACT_DIMENSION_SORT) {
				dimension = this.getDimension(name);
				if (oFF.notNull(dimension)) {
					sortingManager.removeDimensionSorting(dimension);
				}
			} else {
				sortingOperations.queueEventing();
				for (i = sortingOperations.size() - 1; i >= 0; i--) {
					sorting = sortingOperations.get(i);
					if (sorting.getSortingType() === sortType) {
						if (oFF.isNull(name)
								|| oFF.XString.isEqual(name, sorting.getName())) {
							sortingOperations.removeAt(i);
						}
					}
				}
				sortingOperations.resumeEventing();
			}
		}
		return this;
	};
	oFF.QConvenienceCommands.prototype.setTotalsVisible = function(modelLevel,
			name, visibility) {
		var totalsController = this.getTotalsController(modelLevel, name);
		if (oFF.notNull(totalsController)) {
			totalsController.setResultVisibility(visibility);
		}
		return this;
	};
	oFF.QConvenienceCommands.prototype.alignTotals = function(modelLevel, name,
			alignment) {
		var totalsController = this.getTotalsController(modelLevel, name);
		if (oFF.notNull(totalsController)) {
			if (oFF.isNull(alignment)) {
				totalsController.restoreTotalsAlignment(
						oFF.RestoreAction.DEFAULT_VALUE, false);
			} else {
				totalsController.setResultAlignment(alignment);
			}
		}
		return this;
	};
	oFF.QConvenienceCommands.prototype.getTotalsController = function(
			modelLevel, name) {
		var queryModel = this.getQueryModel();
		var type;
		if (modelLevel === oFF.QModelLevel.QUERY) {
			return queryModel;
		}
		if (modelLevel === oFF.QModelLevel.AXES) {
			type = oFF.AxisType.lookup(name);
			if (oFF.notNull(type)) {
				return queryModel.getAxis(type);
			}
		}
		if (modelLevel === oFF.QModelLevel.DIMENSIONS) {
			return queryModel.getDimensionByName(name);
		}
		return null;
	};
	oFF.QConvenienceCommands.prototype.addMeasure = function(measure) {
		var measureStructure = this
				.moveMeasureDimensionToAxis(oFF.AxisType.COLUMNS);
		measureStructure.setReadMode(oFF.QContextType.RESULT_SET,
				oFF.QMemberReadMode.BOOKED);
		this.addSingleStructureMemberFilterByType(
				oFF.DimensionType.MEASURE_STRUCTURE, measure,
				oFF.ComparisonOperator.EQUAL);
		return measureStructure.getStructureMember(measure);
	};
	oFF.QConvenienceCommands.prototype.getMeasure = function(name) {
		return this.getQueryModel().getMeasureDimension().getStructureMember(
				name);
	};
	oFF.QConvenienceCommands.prototype.addNewRestrictedMeasure = function(
			dimType, name, text, member, targetDim, targetMember) {
		var dim = this.getFirstDimensionWithType(dimType);
		var restrictedMeasure = dim.addNewRestrictedMeasure(name, text);
		var filter = restrictedMeasure.getFilter();
		var targetDimObj;
		filter.addSingleMemberFilterByDimension(dim, member,
				oFF.ComparisonOperator.EQUAL);
		targetDimObj = this.getDimension(targetDim);
		filter.addSingleMemberFilterByDimension(targetDimObj, targetMember,
				oFF.ComparisonOperator.EQUAL);
		return this;
	};
	oFF.QConvenienceCommands.prototype.addNewRestrictedMeasureOnNode = function(
			dimType, name, text, member, targetDim, targetHierarchyName,
			targetNode) {
		var measure = this.getFirstDimensionWithType(dimType);
		var restrictedMeasure = measure.addNewRestrictedMeasure(name, text);
		var filter = restrictedMeasure.getFilter();
		var context = this.getQueryModel();
		var andFilter = oFF.QFactory.newFilterAnd(context);
		var measureOp;
		var restriction;
		filter.setComplexRoot(andFilter);
		measureOp = oFF.QFactory.newFilterOperation(context, measure
				.getKeyField());
		measureOp.setLowString(member);
		andFilter.add(measureOp);
		restriction = oFF.QFactory.newFilterOperation(context, this
				.getDimension(targetDim).getHierarchyKeyField());
		restriction.setHierarchyName(targetHierarchyName);
		restriction.setLowString(targetNode);
		andFilter.add(restriction);
		return this;
	};
	oFF.QConvenienceCommands.prototype.setOffsetColumns = function(offset) {
		this.getQueryManager().setOffsetColumns(offset);
		return this;
	};
	oFF.QConvenienceCommands.prototype.setMaxColumns = function(max) {
		this.getQueryManager().setMaxColumns(max);
		return this;
	};
	oFF.QConvenienceCommands.prototype.setMaxResultRecords = function(
			maxResultRecords) {
		this.getQueryManager().setMaxResultRecords(maxResultRecords);
		return this;
	};
	oFF.QConvenienceCommands.prototype.resetMaxResultRecords = function() {
		this.getQueryManager().resetMaxResultRecords();
		return this;
	};
	oFF.QConvenienceCommands.prototype.getOffsetColumns = function() {
		return this.getQueryManager().getOffsetColumns();
	};
	oFF.QConvenienceCommands.prototype.getMaxColumns = function() {
		return this.getQueryManager().getMaxColumns();
	};
	oFF.QConvenienceCommands.prototype.setSuppressKeyfigureCalculation = function(
			doSupress) {
		this.getQueryManager().setSuppressKeyfigureCalculation(doSupress);
		return this;
	};
	oFF.QConvenienceCommands.prototype.isKeyfigureCalculationSuppressed = function() {
		return this.getQueryManager().isKeyfigureCalculationSuppressed();
	};
	oFF.QConvenienceCommands.prototype.getOffsetRows = function() {
		return this.getQueryManager().getOffsetRows();
	};
	oFF.QConvenienceCommands.prototype.getMaxRows = function() {
		return this.getQueryManager().getMaxRows();
	};
	oFF.QConvenienceCommands.prototype.setOffsetRows = function(offset) {
		this.getQueryManager().setOffsetRows(offset);
		return this;
	};
	oFF.QConvenienceCommands.prototype.setMaxRows = function(max) {
		this.getQueryManager().setMaxRows(max);
		return this;
	};
	oFF.QConvenienceCommands.prototype.getMaxResultRecords = function() {
		return this.getQueryManager().getMaxResultRecords();
	};
	oFF.QConvenienceCommands.prototype.setExecuteRequestOnOldResultSet = function(
			executeRequestOnOldResultSet) {
		this.getQueryManager().setExecuteRequestOnOldResultSet(
				executeRequestOnOldResultSet);
		return this;
	};
	oFF.QConvenienceCommands.prototype.setResultSetPersistanceTargetSchema = function(
			resultSetPersistenceSchema) {
		this.getQueryManager().setResultSetPersistanceTargetSchema(
				resultSetPersistenceSchema);
		return this;
	};
	oFF.QConvenienceCommands.prototype.setResultSetPersistanceTargetTable = function(
			resultSetPersistenceTable) {
		this.getQueryManager().setResultSetPersistanceTargetTable(
				resultSetPersistenceTable);
		return this;
	};
	oFF.QConvenienceCommands.prototype.setResultSetPersistenceIdentifier = function(
			resultSetPersistenceIdentifier) {
		this.getQueryManager().setResultSetPersistenceIdentifier(
				resultSetPersistenceIdentifier);
		return this;
	};
	oFF.QConvenienceCommands.prototype.setResultSetTransportEnabled = function(
			isEnabled) {
		this.getQueryManager().setResultSetTransportEnabled(isEnabled);
		return this;
	};
	oFF.QConvenienceCommands.prototype.hasMoreColumnRecordsAvailable = function() {
		return this.getQueryManager().hasMoreColumnRecordsAvailable();
	};
	oFF.QConvenienceCommands.prototype.getExecuteRequestOnOldResultSet = function() {
		return this.getQueryManager().getExecuteRequestOnOldResultSet();
	};
	oFF.QConvenienceCommands.prototype.getResultSetPersistenceSchema = function() {
		return this.getQueryManager().getResultSetPersistenceSchema();
	};
	oFF.QConvenienceCommands.prototype.getResultSetPersistenceTable = function() {
		return this.getQueryManager().getResultSetPersistenceTable();
	};
	oFF.QConvenienceCommands.prototype.getResultSetPersistenceIdentifier = function() {
		return this.getQueryManager().getResultSetPersistenceIdentifier();
	};
	oFF.QConvenienceCommands.prototype.isResultSetTransportEnabled = function() {
		return this.getQueryManager().isResultSetTransportEnabled();
	};
	oFF.QConvenienceCommands.prototype.hasMoreRowRecordsAvailable = function() {
		return this.getQueryManager().hasMoreRowRecordsAvailable();
	};
	oFF.QConvenienceCommands.prototype.refresh = function() {
		return this
				.processQueryExecution(oFF.SyncType.NON_BLOCKING, null, null);
	};
	oFF.QConvenienceCommands.prototype.processQueryManagerCreation = function(
			syncType, listener, customIdentifier) {
		var queryServiceConfig = this.getQueryServiceConfig();
		if (oFF.notNull(queryServiceConfig)) {
			queryServiceConfig.processQueryManagerCreation(syncType, listener,
					customIdentifier);
		}
		return this;
	};
	oFF.QConvenienceCommands.prototype.processQueryExecution = function(
			syncType, listener, customIdentifier) {
		var queryManager = this.getQueryManager();
		if (oFF.notNull(queryManager)) {
			queryManager.processQueryExecution(syncType, listener,
					customIdentifier);
		}
		return this;
	};
	oFF.QConvenienceCommands.prototype.getReferenceGrid = function(withDetails) {
		var queryManager = this.getQueryManager();
		var rs;
		if (oFF.isNull(queryManager)) {
			return null;
		}
		rs = queryManager.getClassicResultSet();
		return oFF.ReferenceGridFactory.createReferenceGrid(rs, withDetails);
	};
	oFF.QConvenienceCommands.prototype.getAbstractRendering = function(type,
			protocol) {
		var queryManager = this.getQueryManager();
		if (oFF.isNull(queryManager)) {
			return null;
		}
		return queryManager.getAbstractRendering(type, protocol);
	};
	oFF.QConvenienceCommands.prototype.queueEventing = function() {
		this.m_activeComponent.queueEventing();
	};
	oFF.QConvenienceCommands.prototype.stopEventing = function() {
		this.m_activeComponent.stopEventing();
	};
	oFF.QConvenienceCommands.prototype.isEventingStopped = function() {
		return this.m_activeComponent.isEventingStopped();
	};
	oFF.QConvenienceCommands.prototype.resumeEventing = function() {
		this.m_activeComponent.resumeEventing();
	};
	oFF.QConvenienceCommands.prototype.isHana = function() {
		return this.isSystemType(oFF.SystemType.HANA);
	};
	oFF.QConvenienceCommands.prototype.isBw = function() {
		return this.isSystemType(oFF.SystemType.BW);
	};
	oFF.QConvenienceCommands.prototype.isBpcs = function() {
		return this.isSystemType(oFF.SystemType.BPCS);
	};
	oFF.QConvenienceCommands.prototype.isBpce = function() {
		return this.isSystemType(oFF.SystemType.BPCE);
	};
	oFF.QConvenienceCommands.prototype.isUniverse = function() {
		return this.isSystemType(oFF.SystemType.UNV);
	};
	oFF.QConvenienceCommands.prototype.isHybris = function() {
		return this.isSystemType(oFF.SystemType.HYBRIS);
	};
	oFF.QConvenienceCommands.prototype.isUqas = function() {
		return this.isSystemType(oFF.SystemType.UQAS);
	};
	oFF.QConvenienceCommands.prototype.isOdata = function() {
		return this.isSystemType(oFF.SystemType.ODATA);
	};
	oFF.QConvenienceCommands.prototype.isSystemType = function(systemType) {
		var systemDescription = this.getQueryManager().getSystemDescription();
		return oFF.notNull(systemDescription)
				&& systemDescription.getSystemType() === systemType;
	};
	oFF.QConvenienceCommands.prototype.isTypeOfBw = function() {
		var systemDescription = this.getQueryManager().getSystemDescription();
		return oFF.notNull(systemDescription)
				&& systemDescription.getSystemType()
						.isTypeOf(oFF.SystemType.BW);
	};
	oFF.QConvenienceCommands.prototype.updateDynamicVariables = function(
			syncType, listener, customIdentifier) {
		this.getOlapEnv().updateDynamicVariablesForQueryManager(
				this.getQueryManager(), syncType, listener, customIdentifier);
	};
	oFF.QConvenienceCommands.prototype.setFilterForLeaves = function(dimension) {
		var hierarchyCatalogItem;
		var dynamicFilter;
		var singleMemberSelection;
		if (!this.getQueryModel().supportsHierarchyRestNode()
				|| !this.getQueryModel().supportsHierarchyVirtualRootNode()) {
			return;
		}
		hierarchyCatalogItem = this.getHierarchyCatalogItem(dimension);
		if (oFF.isNull(hierarchyCatalogItem)) {
			return;
		}
		this.addSingleMemberFilterByDimensionName(dimension.getName(),
				hierarchyCatalogItem.getVirtualRootNode(),
				oFF.ComparisonOperator.EQUAL);
		dynamicFilter = this.getFilterContainer(oFF.FilterLayer.DYNAMIC);
		singleMemberSelection = dynamicFilter.addSingleMemberFilterByName(
				dimension.getName(), hierarchyCatalogItem.getRestNode(),
				oFF.ComparisonOperator.EQUAL);
		singleMemberSelection.setSetSign(oFF.SetSign.EXCLUDING);
	};
	oFF.QConvenienceCommands.prototype.getHierarchyCatalogItem = function(
			dimension) {
		var hierarchyName = dimension.getHierarchyName();
		var hierarchies = dimension.getHierarchies();
		var hierarchyObjects = hierarchies.getObjects();
		var size = hierarchyObjects.size();
		var i;
		var hierarchyCatalogItem;
		for (i = 0; i < size; i++) {
			hierarchyCatalogItem = hierarchyObjects.get(i);
			if (oFF.XString.isEqual(hierarchyCatalogItem.getHierarchyName(),
					hierarchyName)) {
				return hierarchyCatalogItem;
			}
		}
		return null;
	};
	oFF.QCmdSpace = function() {
	};
	oFF.QCmdSpace.prototype = new oFF.QCmdContext();
	oFF.QCmdSpace.createBySelection = function(application, sigSelExpression) {
		var cmdSpace = new oFF.QCmdSpace();
		cmdSpace.setupCmdsSpace(application);
		cmdSpace.selectOnSpace(sigSelExpression);
		return cmdSpace;
	};
	oFF.QCmdSpace.createWithElement = function(application, modelComponent) {
		var cmdSpace = new oFF.QCmdSpace();
		cmdSpace.setupCmdsSpace(application);
		cmdSpace.addElement(modelComponent);
		return cmdSpace;
	};
	oFF.QCmdSpace.prototype.m_olapEnv = null;
	oFF.QCmdSpace.prototype.m_activeCmdEngine = null;
	oFF.QCmdSpace.prototype.m_cmdEngineList = null;
	oFF.QCmdSpace.prototype.m_dummyCmdEngine = null;
	oFF.QCmdSpace.prototype.m_elements = null;
	oFF.QCmdSpace.prototype.m_activeComponent = null;
	oFF.QCmdSpace.prototype.m_spaceSigSel = null;
	oFF.QCmdSpace.prototype.m_bindings = null;
	oFF.QCmdSpace.prototype.setupCmdsSpace = function(application) {
		this.m_olapEnv = application;
		this.m_elements = oFF.XList.create();
		this.m_bindings = oFF.XList.create();
		this.m_cmdEngineList = oFF.XList.create();
	};
	oFF.QCmdSpace.prototype.releaseObject = function() {
		this.m_olapEnv = null;
		this.m_elements = oFF.XObjectExt.release(this.m_elements);
		this.m_bindings = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_bindings);
		this.m_cmdEngineList = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_cmdEngineList);
	};
	oFF.QCmdSpace.prototype.getComponentType = function() {
		return this.getOlapComponentType();
	};
	oFF.QCmdSpace.prototype.getOlapComponentType = function() {
		return oFF.OlapComponentType.CONVENIENCE_CMDS;
	};
	oFF.QCmdSpace.prototype.addComponent = function(component) {
		var olapComponent = component;
		this.addElement(olapComponent);
	};
	oFF.QCmdSpace.prototype.setActiveComponent = function(component) {
		return false;
	};
	oFF.QCmdSpace.prototype.sizeElements = function() {
		return this.m_elements.size();
	};
	oFF.QCmdSpace.prototype.getDataSource = function() {
		return this.setActive(0).getDataSource();
	};
	oFF.QCmdSpace.prototype.addElement = function(modelComponent) {
		if (oFF.notNull(modelComponent)) {
			this.m_elements.add(oFF.XWeakReferenceUtil
					.getWeakRef(modelComponent));
			this.m_activeComponent = modelComponent;
			if (oFF.isNull(this.m_olapEnv)) {
				this.m_olapEnv = modelComponent.getApplication()
						.getOlapEnvironment();
			}
		}
	};
	oFF.QCmdSpace.prototype.setActive = function(index) {
		var weakRef;
		var ok;
		var size;
		var i;
		var context;
		if (index < this.m_elements.size()) {
			weakRef = this.m_elements.get(index);
			this.m_activeComponent = oFF.XWeakReferenceUtil.getHardRef(weakRef);
			if (oFF.notNull(this.m_activeCmdEngine)) {
				ok = this.m_activeCmdEngine
						.setActiveComponent(this.m_activeComponent);
				if (!ok) {
					this.m_activeCmdEngine = null;
					size = this.m_cmdEngineList.size();
					if (size > 1) {
						for (i = 0; i < size; i++) {
							context = this.m_cmdEngineList.get(i);
							if (context
									.setActiveComponent(this.m_activeComponent)) {
								this.m_activeCmdEngine = context;
								break;
							}
						}
					}
				}
			}
			if (oFF.isNull(this.m_activeCmdEngine)) {
				this.m_activeCmdEngine = oFF.QCmdContextFactory
						.createCmdContext(this.m_olapEnv,
								this.m_activeComponent);
				if (oFF.notNull(this.m_activeCmdEngine)) {
					this.m_cmdEngineList.add(this.m_activeCmdEngine);
				}
			}
		}
		if (oFF.isNull(this.m_activeCmdEngine)) {
			if (oFF.isNull(this.m_dummyCmdEngine)) {
				this.m_dummyCmdEngine = oFF.QCmdContext.createDummyContext();
			}
			this.m_activeCmdEngine = this.m_dummyCmdEngine;
		}
		return this.m_activeCmdEngine;
	};
	oFF.QCmdSpace.prototype.select = function(sigSelExpression) {
		return this.getOlapEnv().select(sigSelExpression);
	};
	oFF.QCmdSpace.prototype.selectOnSpace = function(sigSelExpression) {
		var parser = oFF.SigSelParser.create();
		var result = parser.parse(sigSelExpression);
		if (result.isValid()) {
			this.m_spaceSigSel = result.getData();
			this.selectOnSpaceExpr();
		}
	};
	oFF.QCmdSpace.prototype.selectOnSpaceExpr = function() {
		var selector;
		var i;
		var operation;
		var components;
		var k;
		var component;
		if (oFF.notNull(this.m_spaceSigSel)) {
			selector = this.getSession().getSelector();
			this.clearRegistrations();
			this.m_elements.clear();
			this.m_activeComponent = null;
			for (i = 0; i < this.m_spaceSigSel.size(); i++) {
				operation = this.m_spaceSigSel.get(i);
				components = selector.selectSpecificComponents(operation,
						oFF.SigSelDomain.DATA, null, -1);
				if (oFF.notNull(components)) {
					for (k = 0; k < components.size(); k++) {
						component = components.get(k);
						this.addElement(component);
					}
				}
			}
		}
	};
	oFF.QCmdSpace.prototype.addTrace = function(name, parameter) {
		var cmdStructure = oFF.PrFactory.createStructure();
		var parameterList;
		var signature;
		var signatureList;
		var len;
		var j;
		cmdStructure.putString("Command", name);
		if (oFF.notNull(parameter) && parameter.hasElements()) {
			parameterList = cmdStructure.putNewList("Parameters");
			signature = oFF.QCmdSignature.lookupSignature(name);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(signature)) {
				signatureList = oFF.PrFactory.createList();
				signatureList.addAllStrings(oFF.XStringTokenizer.splitString(
						signature, ","));
				cmdStructure.put("Signature", signatureList);
			}
			len = parameter.size();
			for (j = 0; j < len; j++) {
				parameterList.addString(parameter.getTrace(j));
			}
		}
		this.getOlapEnv().addTraceEntry(cmdStructure);
	};
	oFF.QCmdSpace.prototype.getSession = function() {
		return this.m_olapEnv.getSession();
	};
	oFF.QCmdSpace.prototype.getOlapEnv = function() {
		return this.m_olapEnv;
	};
	oFF.QCmdSpace.prototype.getApplication = function() {
		return this.m_olapEnv.getApplication();
	};
	oFF.QCmdSpace.prototype.getQueryManager = function() {
		return this.setActive(0).getQueryManager();
	};
	oFF.QCmdSpace.prototype.getQueryServiceConfig = function() {
		return this.setActive(0).getQueryServiceConfig();
	};
	oFF.QCmdSpace.prototype.getQueryModel = function() {
		return this.setActive(0).getQueryModel();
	};
	oFF.QCmdSpace.prototype.getDimension = function(dimName) {
		return this.setActive(0).getDimension(dimName);
	};
	oFF.QCmdSpace.prototype.getField = function(name) {
		return this.setActive(0).getField(name);
	};
	oFF.QCmdSpace.prototype.getMeasure = function(name) {
		return this.setActive(0).getMeasure(name);
	};
	oFF.QCmdSpace.prototype.getFieldAccessorSingle = function() {
		return this.setActive(0).getFieldAccessorSingle();
	};
	oFF.QCmdSpace.prototype.getVariableContainer = function() {
		return this.setActive(0).getVariableContainer();
	};
	oFF.QCmdSpace.prototype.getDimensionAccessor = function() {
		return this.setActive(0).getDimensionAccessor();
	};
	oFF.QCmdSpace.prototype.getDrillManager = function() {
		return this.setActive(0).getDrillManager();
	};
	oFF.QCmdSpace.prototype.getDimensionsContainingValueType = function(
			valueType) {
		return this.setActive(0).getDimensionsContainingValueType(valueType);
	};
	oFF.QCmdSpace.prototype.getFirstGISDimension = function() {
		return this.setActive(0).getFirstGISDimension();
	};
	oFF.QCmdSpace.prototype.getFirstDimensionWithType = function(dimensionType) {
		return this.setActive(0).getFirstDimensionWithType(dimensionType);
	};
	oFF.QCmdSpace.prototype.getGISAttributesForDimension = function(dim) {
		return this.setActive(0).getGISAttributesForDimension(dim);
	};
	oFF.QCmdSpace.prototype.getModelCapabilities = function() {
		return this.setActive(0).getModelCapabilities();
	};
	oFF.QCmdSpace.prototype.registerChangedListener = function(listener,
			customIdentifier) {
		var i;
		for (i = 0; i < this.m_elements.size(); i++) {
			this.setActive(i).registerChangedListener(listener,
					customIdentifier);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.unregisterChangedListener = function(listener) {
		var i;
		for (i = 0; i < this.m_elements.size(); i++) {
			this.setActive(i).unregisterChangedListener(listener);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.getSenderBindings = function() {
		var list = oFF.XList.create();
		if (this.m_elements.hasElements()) {
			list.add(oFF.SemanticBindingType.PIE);
			list.add(oFF.SemanticBindingType.LINE);
			list.add(oFF.SemanticBindingType.COLUMN);
			list.add(oFF.SemanticBindingType.BAR);
			list.add(oFF.SemanticBindingType.TIMESERIES);
			list.add(oFF.SemanticBindingType.BOXPLOT);
			list.add(oFF.SemanticBindingType.COMBBCL);
			list.add(oFF.SemanticBindingType.TABLE);
			list.add(oFF.SemanticBindingType.AREA);
			list.add(oFF.SemanticBindingType.SCATTER);
			list.add(oFF.SemanticBindingType.BUBBLE);
			list.add(oFF.SemanticBindingType.SPLINE);
			list.add(oFF.SemanticBindingType.VARIABLEPIE);
			list.add(oFF.SemanticBindingType.HEATMAP);
			list.add(oFF.SemanticBindingType.TREEMAP);
			list.add(oFF.SemanticBindingType.VARIWIDE);
			list.add(oFF.SemanticBindingType.WORDCLOUD);
			list.add(oFF.SemanticBindingType.BELLCURVE);
			list.add(oFF.SemanticBindingType.SCATTER);
			list.add(oFF.SemanticBindingType.BUBBLE);
			list.add(oFF.SemanticBindingType.CHART);
			list.add(oFF.SemanticBindingType.JSON);
			list.add(oFF.SemanticBindingType.STRING);
		}
		return list;
	};
	oFF.QCmdSpace.prototype.getReceiverBindings = function() {
		return oFF.XList.create();
	};
	oFF.QCmdSpace.prototype.getSenderProtocolBindings = function(type) {
		var list = oFF.XList.create();
		if (this.m_elements.hasElements()) {
			list.add(oFF.ProtocolBindingType.GOOGLE_CHART_PROTOCOL);
			list.add(oFF.ProtocolBindingType.HIGH_CHART_PROTOCOL);
			list.add(oFF.ProtocolBindingType.STRING);
		}
		return list;
	};
	oFF.QCmdSpace.prototype.getReceiverProtocolBindings = function(type) {
		return oFF.QCmdContext.prototype.getReceiverProtocolBindings.call(this,
				type);
	};
	oFF.QCmdSpace.prototype.newSenderBinding = function(type, protocol) {
		var i;
		var weakRef;
		var component;
		var binding;
		if (this.m_bindings.isEmpty()) {
			for (i = 0; i < this.m_elements.size(); i++) {
				weakRef = this.m_elements.get(i);
				component = oFF.XWeakReferenceUtil.getHardRef(weakRef);
				component.registerChangedListener(this, null);
			}
		}
		binding = oFF.QCmdBindResultset.create(this, type, protocol);
		this.m_bindings.add(binding);
		return binding;
	};
	oFF.QCmdSpace.prototype.newReceiverBinding = oFF.noSupport;
	oFF.QCmdSpace.prototype.clearRegistrations = function() {
		var i;
		var weakRef;
		var component;
		if (this.m_bindings.size() > 0) {
			for (i = 0; i < this.m_elements.size(); i++) {
				weakRef = this.m_elements.get(i);
				component = oFF.XWeakReferenceUtil.getHardRef(weakRef);
				component.unregisterChangedListener(this);
			}
		}
	};
	oFF.QCmdSpace.prototype.onModelComponentChanged = function(modelComponent,
			customIdentifier) {
		var i;
		this.selectOnSpaceExpr();
		for (i = 0; i < this.m_bindings.size(); i++) {
			this.m_bindings.get(i).onCmdContextChanged();
		}
	};
	oFF.QCmdSpace.prototype.reset = function() {
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			this.addTrace(oFF.QCmdSignature.RESET, null);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).reset();
		}
		return this;
	};
	oFF.QCmdSpace.prototype.resetToDefault = function() {
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			this.addTrace(oFF.QCmdSignature.RESET_TO_DEFAULT, null);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).resetToDefault();
		}
		return this;
	};
	oFF.QCmdSpace.prototype.addSingleMemberFilter = function(filterLayer,
			dimType, dimName, memberName, comparisonOperator) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(filterLayer)
					.addNameObject(dimType).addString(dimName);
			params.addString(memberName).addNameObject(comparisonOperator);
			this.addTrace(oFF.QCmdSignature.ADD_SINGLE_MEMBER_FILTER, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addSingleMemberFilter(filterLayer,
					dimType, dimName, memberName, comparisonOperator);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addSingleNodeFilter = function(node,
			comparisonOperator) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(node).addNameObject(
					comparisonOperator);
			this.addTrace(oFF.QCmdSignature.ADD_SINGLE_NODE_FILTER, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addSingleNodeFilter(node,
					comparisonOperator);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addStringFilterByField = function(field,
			filterValue, comparisonOperator) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(field).addString(
					filterValue).addNameObject(comparisonOperator);
			this.addTrace(oFF.QCmdSignature.ADD_STRING_FILTER_BY_FIELD, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addStringFilterByField(field,
					filterValue, comparisonOperator);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addFilter = function(filterLayer, dimType, dimName,
			presentationType, fieldName, lowValue, highValue,
			comparisonOperator) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(filterLayer)
					.addNameObject(dimType).addString(dimName).addNameObject(
							presentationType).addString(fieldName).addString(
							lowValue).addString(highValue).addNameObject(
							comparisonOperator);
			this.addTrace(oFF.QCmdSignature.ADD_FILTER, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addFilter(filterLayer, dimType, dimName,
					presentationType, fieldName, lowValue, highValue,
					comparisonOperator);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addFilterByFieldAndValue = function(field,
			filterValue, comparisonOperator) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(field).addXValue(
					filterValue).addNameObject(comparisonOperator);
			this.addTrace(oFF.QCmdSignature.ADD_FILTER_BY_FIELD_AND_VALUE,
					params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addFilterByFieldAndValue(field,
					filterValue, comparisonOperator);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addFilterByField = function(field, firstValue,
			secondValue, thirdValue, comparisonOperator, isVisibility) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(field).addXValue(
					firstValue).addXValue(secondValue).addXValue(thirdValue);
			params.addNameObject(comparisonOperator).addBoolean(isVisibility);
			this.addTrace(oFF.QCmdSignature.ADD_FILTER_BY_FIELD, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addFilterByField(field, firstValue,
					secondValue, thirdValue, comparisonOperator, isVisibility);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addStringFilterByFieldNameAndOperator = function(
			dimensionName, fieldName, filterValue, comparisonOperator) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(dimensionName).addString(
					fieldName).addString(filterValue).addNameObject(
					comparisonOperator);
			this
					.addTrace(
							oFF.QCmdSignature.ADD_STRING_FILTER_BY_FIELD_NAME_AND_OPERATOR,
							params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addStringFilterByFieldNameAndOperator(
					dimensionName, fieldName, filterValue, comparisonOperator);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addIntFilterByFieldName = function(dimensionName,
			fieldName, filterValue, comparisonOperator) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(dimensionName).addString(
					fieldName).addInteger(filterValue).addNameObject(
					comparisonOperator);
			this.addTrace(oFF.QCmdSignature.ADD_INT_FILTER_BY_FIELD_NAME,
					params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addIntFilterByFieldName(dimensionName,
					fieldName, filterValue, comparisonOperator);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addIntFilterByField = function(field, filterValue,
			comparisonOperator) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(field).addInteger(
					filterValue).addNameObject(comparisonOperator);
			this.addTrace(oFF.QCmdSignature.ADD_INT_FILTER_BY_FIELD, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addIntFilterByField(field, filterValue,
					comparisonOperator);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addDoubleFilterByFieldName = function(
			dimensionName, fieldName, filterValue, comparisonOperator) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(dimensionName).addString(
					fieldName).addDouble(filterValue).addNameObject(
					comparisonOperator);
			this.addTrace(oFF.QCmdSignature.ADD_DOUBLE_FILTER_BY_FIELD_NAME,
					params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addDoubleFilterByFieldName(
					dimensionName, fieldName, filterValue, comparisonOperator);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addDoubleFilterByField = function(field,
			filterValue, comparisonOperator) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(field).addDouble(
					filterValue).addNameObject(comparisonOperator);
			this.addTrace(oFF.QCmdSignature.ADD_DOUBLE_FILTER_BY_FIELD, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addDoubleFilterByField(field,
					filterValue, comparisonOperator);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addLongFilterByFieldName = function(dimensionName,
			fieldName, filterValue, comparisonOperator) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(dimensionName).addString(
					fieldName).addLong(filterValue).addNameObject(
					comparisonOperator);
			this.addTrace(oFF.QCmdSignature.ADD_LONG_FILTER_BY_FIELD_NAME,
					params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addLongFilterByFieldName(dimensionName,
					fieldName, filterValue, comparisonOperator);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addLongFilterByField = function(field, filterValue,
			comparisonOperator) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(field).addLong(
					filterValue).addNameObject(comparisonOperator);
			this.addTrace(oFF.QCmdSignature.ADD_LONG_FILTER_BY_FIELD, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addLongFilterByField(field, filterValue,
					comparisonOperator);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addStringFilterByName = function(dimensionName,
			fieldName, filterValue, comparisonOperator) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(dimensionName).addString(
					fieldName).addString(filterValue).addNameObject(
					comparisonOperator);
			this.addTrace(oFF.QCmdSignature.ADD_STRING_FILTER_BY_NAME, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addStringFilterByName(dimensionName,
					fieldName, filterValue, comparisonOperator);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addStringFilterByPresentation = function(
			dimensionName, presentationType, filterValue, comparisonOperator) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(dimensionName)
					.addNameObject(presentationType).addString(filterValue)
					.addNameObject(comparisonOperator);
			this.addTrace(oFF.QCmdSignature.ADD_STRING_FILTER_BY_PRESENTATION,
					params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addStringFilterByPresentation(
					dimensionName, presentationType, filterValue,
					comparisonOperator);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addIntervalFilterByValues = function(dimensionName,
			lowValue, highValue) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(dimensionName).addXValue(
					lowValue).addXValue(highValue);
			this.addTrace(oFF.QCmdSignature.ADD_INTERVAL_FILTER_BY_VALUES,
					params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addIntervalFilterByValues(dimensionName,
					lowValue, highValue);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addWithinDistanceFilter = function(dimension,
			fieldName, point, distance, unit) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(dimension).addString(
					fieldName).addXValue(point).addDouble(distance).addString(
					unit);
			this.addTrace(oFF.QCmdSignature.ADD_WITHIN_DISTANCE_FILTER, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addWithinDistanceFilter(dimension,
					fieldName, point, distance, unit);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addIntersectsRectFilter = function(dimension,
			fieldName, lowerLeft, upperRight) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(dimension).addString(
					fieldName).addXValue(lowerLeft).addXValue(upperRight);
			this.addTrace(oFF.QCmdSignature.ADD_INTERSECTS_RECT_FILTER, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addIntersectsRectFilter(dimension,
					fieldName, lowerLeft, upperRight);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addContainsGeometryFilter = function(dimension,
			fieldName, geometry) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(dimension).addString(
					fieldName).addXValue(geometry);
			this.addTrace(oFF.QCmdSignature.ADD_CONTAINS_GEOMETRY_FILTER,
					params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addContainsGeometryFilter(dimension,
					fieldName, geometry);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addIntersectsGeometryFilter = function(dimension,
			fieldName, geometry) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(dimension).addString(
					fieldName).addXValue(geometry);
			this.addTrace(oFF.QCmdSignature.ADD_INTERSECTS_GEOMETRY_FILTER,
					params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addIntersectsGeometryFilter(dimension,
					fieldName, geometry);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addCoversGeometryFilter = function(dimension,
			fieldName, geometry) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(dimension).addString(
					fieldName).addXValue(geometry);
			this.addTrace(oFF.QCmdSignature.ADD_COVERS_GEOMETRY_FILTER, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addCoversGeometryFilter(dimension,
					fieldName, geometry);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addCrossesLinestringFilter = function(dimension,
			fieldName, geometry) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(dimension).addString(
					fieldName).addXValue(geometry);
			this.addTrace(oFF.QCmdSignature.ADD_CROSSES_LINESTRING_FILTER,
					params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addCrossesLinestringFilter(dimension,
					fieldName, geometry);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addDisjointGeometryFilter = function(dimension,
			fieldName, geometry) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(dimension).addString(
					fieldName).addXValue(geometry);
			this.addTrace(oFF.QCmdSignature.ADD_DISJOINT_GEOMETRY_FILTER,
					params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addDisjointGeometryFilter(dimension,
					fieldName, geometry);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addOverlapsGeometryFilter = function(dimension,
			fieldName, geometry) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(dimension).addString(
					fieldName).addXValue(geometry);
			this.addTrace(oFF.QCmdSignature.ADD_OVERLAPS_GEOMETRY_FILTER,
					params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addOverlapsGeometryFilter(dimension,
					fieldName, geometry);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addTouchesGeometryFilter = function(dimension,
			fieldName, geometry) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(dimension).addString(
					fieldName).addXValue(geometry);
			this
					.addTrace(oFF.QCmdSignature.ADD_TOUCHES_GEOMETRY_FILTER,
							params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addTouchesGeometryFilter(dimension,
					fieldName, geometry);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addWithinGeometryFilter = function(dimension,
			fieldName, geometry) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(dimension).addString(
					fieldName).addXValue(geometry);
			this.addTrace(oFF.QCmdSignature.ADD_WITHIN_GEOMETRY_FILTER, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addWithinGeometryFilter(dimension,
					fieldName, geometry);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.setSearchTerm = function(searchTerm) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(searchTerm);
			this.addTrace(oFF.QCmdSignature.SET_SEARCH_TERM, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).setSearchTerm(searchTerm);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.clearNonMeasureFilters = function() {
		var size = this.sizeElements();
		var i;
		for (i = 0; i < size; i++) {
			this.setActive(i).clearNonMeasureFilters();
		}
		return this;
	};
	oFF.QCmdSpace.prototype.clearNonStructureFilters = function() {
		var size = this.sizeElements();
		var i;
		for (i = 0; i < size; i++) {
			this.setActive(i).clearNonStructureFilters();
		}
		return this;
	};
	oFF.QCmdSpace.prototype.clearFiltersByDimensionExt = function(filterLayer,
			dimType, dimName) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(filterLayer)
					.addNameObject(dimType).addString(dimName);
			this.addTrace(oFF.QCmdSignature.CLEAR_FILTERS_BY_DIMENSION_EXT,
					params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).clearFiltersByDimensionExt(filterLayer, dimType,
					dimName);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.clearAllFiltersExt = function(filterLayer,
			filterScopeVariables) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(filterLayer)
					.addNameObject(filterScopeVariables);
			this.addTrace(oFF.QCmdSignature.CLEAR_ALL_FILTERS_EXT, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).clearAllFiltersExt(filterLayer,
					filterScopeVariables);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.clearFilterByIdExt = function(filterLayer, uniqueId) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(filterLayer).addString(
					uniqueId);
			this.addTrace(oFF.QCmdSignature.CLEAR_FILTER_BY_ID_EXT, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).clearFilterByIdExt(filterLayer, uniqueId);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.clearSingleMemberFilterByName = function(dimName,
			memberName, comparisonOperator) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(dimName).addString(
					memberName).addNameObject(comparisonOperator);
			this.addTrace(oFF.QCmdSignature.CLEAR_SINGLE_MEMBER_FILTER_BY_NAME,
					params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).clearSingleMemberFilterByName(dimName,
					memberName, comparisonOperator);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.getFilterById = function(uniqueId) {
		return this.setActive(0).getFilterById(uniqueId);
	};
	oFF.QCmdSpace.prototype.getVisibilityFilterById = function(uniqueId) {
		return this.setActive(0).getVisibilityFilterById(uniqueId);
	};
	oFF.QCmdSpace.prototype.setVariable = function(name, value) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(name).addString(value);
			this.addTrace(oFF.QCmdSignature.SET_VARIABLE, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).setVariable(name, value);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.submitVariables = function() {
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			this.addTrace(oFF.QCmdSignature.SUBMIT_VARIABLES, null);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).submitVariables();
		}
		return result;
	};
	oFF.QCmdSpace.prototype.getVariablesNameAndText = function() {
		return this.setActive(0).getVariablesNameAndText();
	};
	oFF.QCmdSpace.prototype.getVariable = function(name) {
		return this.setActive(0).getVariable(name);
	};
	oFF.QCmdSpace.prototype.switchAxes = function() {
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			this.addTrace(oFF.QCmdSignature.SWITCH_AXES, null);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).switchAxes();
		}
		return this;
	};
	oFF.QCmdSpace.prototype.clearAxis = function(targetAxis) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(targetAxis);
			this.addTrace(oFF.QCmdSignature.CLEAR_AXIS, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).clearAxis(targetAxis);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.setDimensionsAndMeasures = function(dimNames,
			measures) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addStringList(dimNames).addStringList(
					measures);
			this.addTrace(oFF.QCmdSignature.SET_DIMENSION_AND_MEASURE, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).setDimensionsAndMeasures(dimNames, measures);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.setDimensionAndMeasure = function(dimName, measure) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(dimName).addString(measure);
			this.addTrace(oFF.QCmdSignature.SET_DIMENSION_AND_MEASURE, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).setDimensionAndMeasure(dimName, measure);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.moveDimensionExt = function(dimType, dimName,
			targetAxis, index) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(dimType).addString(
					dimName).addNameObject(targetAxis).addInteger(index);
			this.addTrace(oFF.QCmdSignature.MOVE_DIMENSION_EXT, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).moveDimensionExt(dimType, dimName,
					targetAxis, index);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addAllDimensions = function() {
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			this.addTrace(oFF.QCmdSignature.ADD_ALL_DIMENSIONS, null);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).addAllDimensions();
		}
		return this;
	};
	oFF.QCmdSpace.prototype.addAttributeToResultSet = function(dimName,
			attributeName) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(dimName).addString(
					attributeName);
			this
					.addTrace(oFF.QCmdSignature.ADD_ATTRIBUTE_TO_RESULT_SET,
							params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addAttributeToResultSet(dimName,
					attributeName);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.removeAttributeFromResultSet = function(dimName,
			attributeName) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(dimName).addString(
					attributeName);
			this.addTrace(oFF.QCmdSignature.REMOVE_ATTRIBUTE_FROM_RESULT_SET,
					params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).removeAttributeFromResultSet(dimName,
					attributeName);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addField = function(dimType, dimName,
			presentationType, fieldName, contextType) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(dimType).addString(
					dimName).addNameObject(presentationType).addString(
					fieldName).addNameObject(contextType);
			this.addTrace(oFF.QCmdSignature.ADD_FIELD, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addField(dimType, dimName,
					presentationType, fieldName, contextType);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.setField = function(dimType, dimName,
			presentationType, fieldName, contextType) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(dimType).addString(
					dimName).addNameObject(presentationType).addString(
					fieldName).addNameObject(contextType);
			this.addTrace(oFF.QCmdSignature.SET_FIELD, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).setField(dimType, dimName,
					presentationType, fieldName, contextType);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.removeField = function(dimType, dimName,
			presentationType, fieldName, contextType) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(dimType).addString(
					dimName).addNameObject(presentationType).addString(
					fieldName).addNameObject(contextType);
			this.addTrace(oFF.QCmdSignature.REMOVE_FIELD, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).removeField(dimType, dimName,
					presentationType, fieldName, contextType);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addAllFieldsToModelArea = function(contextType) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(contextType);
			this.addTrace(oFF.QCmdSignature.ADD_ALL_FIELDS_TO_MODEL_AREA,
					params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).addAllFieldsToModelArea(contextType);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.addAllFieldsOfDimensionToModelArea = function(
			dimName, contextType) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(dimName).addNameObject(
					contextType);
			this
					.addTrace(
							oFF.QCmdSignature.ADD_ALL_FIELDS_OF_DIMENSION_TO_MODEL_AREA,
							params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).addAllFieldsOfDimensionToModelArea(dimName,
					contextType);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.clearFields = function(dimType, dimName,
			contextType) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(dimType).addString(
					dimName).addNameObject(contextType);
			this.addTrace(oFF.QCmdSignature.CLEAR_FIELDS, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).clearFields(dimType, dimName, contextType);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.clearAllFieldsFromModelArea = function(contextType) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(contextType);
			this.addTrace(oFF.QCmdSignature.CLEAR_ALL_FIELDS_FROM_MODEL_AREA,
					params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).clearAllFieldsFromModelArea(contextType);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.containsField = function(dimName, fieldName,
			contextType) {
		return this.setActive(0).containsField(dimName, fieldName, contextType);
	};
	oFF.QCmdSpace.prototype.containsResultSetFieldByType = function(dimName,
			presentationType) {
		return this.setActive(0).containsResultSetFieldByType(dimName,
				presentationType);
	};
	oFF.QCmdSpace.prototype.containsSelectorFieldByType = function(dimName,
			presentationType) {
		return this.setActive(0).containsSelectorFieldByType(dimName,
				presentationType);
	};
	oFF.QCmdSpace.prototype.setDimensionHierarchy = function(dimName,
			hierarchyName, hierarchyActive, initialDrillLevel) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(dimName).addString(
					hierarchyName).addBoolean(hierarchyActive).addInteger(
					initialDrillLevel);
			this.addTrace(oFF.QCmdSignature.SET_DIMENSION_HIERARCHY, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).setDimensionHierarchy(dimName, hierarchyName,
					hierarchyActive, initialDrillLevel);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.drillNode = function(dimName, nodeName, drillState) {
		var size = this.sizeElements();
		var i;
		for (i = 0; i < size; i++) {
			this.setActive(i).drillNode(dimName, nodeName, drillState);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.setUniversalDisplayHierarchy = function(dimensions,
			initialDrillLevel, active) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addStringList(dimensions).addInteger(
					initialDrillLevel).addBoolean(active);
			this.addTrace(oFF.QCmdSignature.SET_UNIVERSAL_DISPLAY_HIERARCHY,
					params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).setUniversalDisplayHierarchy(dimensions,
					initialDrillLevel, active);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.sort = function(sortType, dimType, dimName,
			presentationType, fieldName, memberName, direction) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(sortType).addNameObject(
					dimType).addString(dimName).addNameObject(presentationType)
					.addString(fieldName).addString(memberName).addNameObject(
							direction);
			this.addTrace(oFF.QCmdSignature.SORT, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).sort(sortType, dimType, dimName,
					presentationType, fieldName, memberName, direction);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.clearSort = function(sortType, name) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(sortType)
					.addString(name);
			this.addTrace(oFF.QCmdSignature.CLEAR_SORT, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).clearSort(sortType, name);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.alignTotals = function(modelLevel, name, alignment) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(modelLevel).addString(
					name).addNameObject(alignment);
			this.addTrace(oFF.QCmdSignature.ALIGN_TOTALS, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).alignTotals(modelLevel, name, alignment);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.setTotalsVisible = function(modelLevel, name,
			visibility) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(modelLevel).addString(
					name).addNameObject(visibility);
			this.addTrace(oFF.QCmdSignature.SET_TOTALS_VISIBLE, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).setTotalsVisible(modelLevel, name, visibility);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.addMeasure = function(measure) {
		var params;
		var result;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(measure);
			this.addTrace(oFF.QCmdSignature.ADD_MEASURE, params);
		}
		result = null;
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			result = this.setActive(i).addMeasure(measure);
		}
		return result;
	};
	oFF.QCmdSpace.prototype.addNewRestrictedMeasure = function(dimType, name,
			text, member, targetDim, targetMember) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(dimType).addString(name)
					.addString(text);
			params.addString(member).addString(targetDim).addString(
					targetMember);
			this.addTrace(oFF.QCmdSignature.ADD_NEW_RESTRICTED_MEASURE, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).addNewRestrictedMeasure(dimType, name, text,
					member, targetDim, targetMember);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.addNewRestrictedMeasureOnNode = function(dimType,
			name, text, member, targetDim, targetHierarchyName, targetNode) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addNameObject(dimType).addString(name)
					.addString(text);
			params.addString(member).addString(targetDim).addString(
					targetHierarchyName).addString(targetNode);
			this.addTrace(oFF.QCmdSignature.ADD_NEW_RESTRICTED_MEASURE_ON_NODE,
					params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).addNewRestrictedMeasureOnNode(dimType, name,
					text, member, targetDim, targetHierarchyName, targetNode);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.setOffsetRows = function(offset) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addInteger(offset);
			this.addTrace(oFF.QCmdSignature.SET_OFFSET_ROWS, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).setOffsetRows(offset);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.setMaxRows = function(max) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addInteger(max);
			this.addTrace(oFF.QCmdSignature.SET_MAX_ROWS, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).setMaxRows(max);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.hasMoreColumnRecordsAvailable = function() {
		return this.setActive(0).hasMoreColumnRecordsAvailable();
	};
	oFF.QCmdSpace.prototype.hasMoreRowRecordsAvailable = function() {
		return this.setActive(0).hasMoreRowRecordsAvailable();
	};
	oFF.QCmdSpace.prototype.getOffsetColumns = function() {
		return this.setActive(0).getOffsetColumns();
	};
	oFF.QCmdSpace.prototype.getMaxColumns = function() {
		return this.setActive(0).getMaxColumns();
	};
	oFF.QCmdSpace.prototype.getOffsetRows = function() {
		return this.setActive(0).getOffsetRows();
	};
	oFF.QCmdSpace.prototype.getMaxRows = function() {
		return this.setActive(0).getMaxRows();
	};
	oFF.QCmdSpace.prototype.setOffsetColumns = function(offset) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addInteger(offset);
			this.addTrace(oFF.QCmdSignature.SET_OFFSET_COLUMNS, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).setOffsetColumns(offset);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.setMaxColumns = function(max) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addInteger(max);
			this.addTrace(oFF.QCmdSignature.SET_MAX_COLUMNS, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).setMaxColumns(max);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.setMaxResultRecords = function(maxResultRecords) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addLong(maxResultRecords);
			this.addTrace(oFF.QCmdSignature.SET_MAX_RESULT_RECORDS, params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).setMaxResultRecords(maxResultRecords);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.resetMaxResultRecords = function() {
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			this.addTrace(oFF.QCmdSignature.RESET_MAX_RESULT_RECORDS, null);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).resetMaxResultRecords();
		}
		return this;
	};
	oFF.QCmdSpace.prototype.getReferenceGrid = function(withDetails) {
		return this.setActive(0).getReferenceGrid(withDetails);
	};
	oFF.QCmdSpace.prototype.getAbstractRendering = function(type, protocol) {
		return this.setActive(0).getAbstractRendering(type, protocol);
	};
	oFF.QCmdSpace.prototype.setResultSetPersistanceTargetSchema = function(
			resultSetPersistenceSchema) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(resultSetPersistenceSchema);
			this.addTrace(
					oFF.QCmdSignature.SET_RESULT_SET_PERSISTANCE_TARGET_SCHEMA,
					params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).setResultSetPersistanceTargetSchema(
					resultSetPersistenceSchema);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.setResultSetPersistanceTargetTable = function(
			resultSetPersistenceTable) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(resultSetPersistenceTable);
			this.addTrace(
					oFF.QCmdSignature.SET_RESULT_SET_PERSISTANCE_TARGET_TABLE,
					params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).setResultSetPersistanceTargetTable(
					resultSetPersistenceTable);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.setResultSetPersistenceIdentifier = function(
			resultSetPersistenceIdentifier) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addString(
					resultSetPersistenceIdentifier);
			this.addTrace(
					oFF.QCmdSignature.SET_RESULT_SET_PERSISTANCE_IDENTIFIER,
					params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).setResultSetPersistenceIdentifier(
					resultSetPersistenceIdentifier);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.setResultSetTransportEnabled = function(isEnabled) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addBoolean(isEnabled);
			this.addTrace(oFF.QCmdSignature.SET_RESULT_SET_TRANSPORT_ENABLED,
					params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).setResultSetTransportEnabled(isEnabled);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.getExecuteRequestOnOldResultSet = function() {
		return this.setActive(0).getExecuteRequestOnOldResultSet();
	};
	oFF.QCmdSpace.prototype.getMaxResultRecords = function() {
		return this.setActive(0).getMaxResultRecords();
	};
	oFF.QCmdSpace.prototype.getResultSetPersistenceSchema = function() {
		return this.setActive(0).getResultSetPersistenceSchema();
	};
	oFF.QCmdSpace.prototype.getResultSetPersistenceTable = function() {
		return this.setActive(0).getResultSetPersistenceTable();
	};
	oFF.QCmdSpace.prototype.getResultSetPersistenceIdentifier = function() {
		return this.setActive(0).getResultSetPersistenceIdentifier();
	};
	oFF.QCmdSpace.prototype.isResultSetTransportEnabled = function() {
		return this.setActive(0).isResultSetTransportEnabled();
	};
	oFF.QCmdSpace.prototype.setExecuteRequestOnOldResultSet = function(
			executeRequestOnOldResultSet) {
		var params;
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			params = oFF.XTrace.create().addBoolean(
					executeRequestOnOldResultSet);
			this.addTrace(
					oFF.QCmdSignature.SET_EXECUTE_REQUEST_ON_OLD_RESULT_SET,
					params);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).setExecuteRequestOnOldResultSet(
					executeRequestOnOldResultSet);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.processQueryManagerCreation = function(syncType,
			listener, customIdentifier) {
		var i;
		for (i = 0; i < this.m_elements.size(); i++) {
			this.setActive(i).processQueryManagerCreation(syncType, listener,
					customIdentifier);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.processQueryExecution = function(syncType,
			listener, customIdentifier) {
		var i;
		for (i = 0; i < this.m_elements.size(); i++) {
			this.setActive(i).processQueryExecution(syncType, listener,
					customIdentifier);
		}
		return this;
	};
	oFF.QCmdSpace.prototype.refresh = function() {
		var size;
		var i;
		if (this.getOlapEnv().isTracing()) {
			this.addTrace(oFF.QCmdSignature.REFRESH, null);
		}
		size = this.sizeElements();
		for (i = 0; i < size; i++) {
			this.setActive(i).refresh();
		}
		return this;
	};
	oFF.QCmdSpace.prototype.isHana = function() {
		return this.setActive(0).isHana();
	};
	oFF.QCmdSpace.prototype.isBw = function() {
		return this.setActive(0).isBw();
	};
	oFF.QCmdSpace.prototype.isBpcs = function() {
		return this.setActive(0).isBpcs();
	};
	oFF.QCmdSpace.prototype.isBpce = function() {
		return this.setActive(0).isBpce();
	};
	oFF.QCmdSpace.prototype.isUniverse = function() {
		return this.setActive(0).isUniverse();
	};
	oFF.QCmdSpace.prototype.isHybris = function() {
		return this.setActive(0).isHybris();
	};
	oFF.QCmdSpace.prototype.isUqas = function() {
		return this.setActive(0).isUqas();
	};
	oFF.QCmdSpace.prototype.isOdata = function() {
		return this.setActive(0).isOdata();
	};
	oFF.QCmdSpace.prototype.isTypeOfBw = function() {
		return this.setActive(0).isTypeOfBw();
	};
	oFF.QCmdSpace.prototype.updateDynamicVariables = function(syncType,
			listener, customIdentifier) {
		this.setActive(0).updateDynamicVariables(syncType, listener,
				customIdentifier);
	};
	oFF.QCmdSpace.prototype.setFilterForLeaves = function(dimension) {
		this.setActive(0).setFilterForLeaves(dimension);
	};
	oFF.OlapCmdImplModule = function() {
	};
	oFF.OlapCmdImplModule.prototype = new oFF.DfModule();
	oFF.OlapCmdImplModule.s_module = null;
	oFF.OlapCmdImplModule.getInstance = function() {
		return oFF.OlapCmdImplModule.initVersion(oFF.XVersion.API_DEFAULT);
	};
	oFF.OlapCmdImplModule.initVersion = function(version) {
		var timestamp;
		var registrationService;
		if (oFF.isNull(oFF.OlapCmdImplModule.s_module)) {
			oFF.DfModule.checkInitialized(oFF.OlapApiModule
					.initVersion(version));
			timestamp = oFF.DfModule.start("OlapCmdImplModule...");
			oFF.OlapCmdImplModule.s_module = new oFF.OlapCmdImplModule();
			registrationService = oFF.RegistrationService.getInstance();
			oFF.XCmdCreateQueryManager.staticSetup();
			oFF.XCmdCreateQueryManagerResult.staticSetup();
			registrationService.addCommand(oFF.CmdCreateQueryManager.CMD_NAME,
					oFF.XCmdCreateQueryManager.CLAZZ);
			oFF.XCmdDeserializeBlending.staticSetup();
			oFF.XCmdDeserializeBlendingResult.staticSetup();
			registrationService.addCommand(oFF.CmdDeserializeBlending.CMD_NAME,
					oFF.XCmdDeserializeBlending.CLAZZ);
			oFF.XCmdDeserializeBlendingSources.staticSetup();
			oFF.XCmdDeserializeBlendingSourcesResult.staticSetup();
			registrationService.addCommand(
					oFF.CmdDeserializeBlendingSources.CMD_NAME,
					oFF.XCmdDeserializeBlendingSources.CLAZZ);
			oFF.XCmdDeserializeCalculatedDimension.staticSetup();
			oFF.XCmdDeserializeCalculatedDimensionResult.staticSetup();
			registrationService.addCommand(
					oFF.CmdDeserializeCalculatedDimension.CMD_NAME,
					oFF.XCmdDeserializeCalculatedDimension.CLAZZ);
			oFF.XCmdDeserializeExtendedDimension.staticSetup();
			oFF.XCmdDeserializeExtendedDimensionResult.staticSetup();
			registrationService.addCommand(
					oFF.CmdDeserializeExtendedDimension.CMD_NAME,
					oFF.XCmdDeserializeExtendedDimension.CLAZZ);
			oFF.CommandSpaceFactory
					.setInstance(new oFF.CommandSpaceFactoryImpl());
			oFF.SigSelManager.registerFactory(oFF.XComponentType._DATASOURCE,
					new oFF.CommandSpaceFactoryImpl());
			oFF.QCmdContextFactory.staticSetup();
			oFF.QCmdContextOlapFactory.staticSetupOlapFactory();
			oFF.DfModule.stop(timestamp);
		}
		return oFF.OlapCmdImplModule.s_module;
	};
	oFF.OlapCmdImplModule.getInstance();
})(sap.firefly);