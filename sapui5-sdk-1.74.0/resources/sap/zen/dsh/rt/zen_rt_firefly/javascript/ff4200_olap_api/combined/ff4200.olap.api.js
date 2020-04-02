(function(oFF) {
	oFF.XCommandCallback = function() {
	};
	oFF.XCommandCallback.prototype = new oFF.XObject();
	oFF.XCommandCallback.create = function(callbackListener) {
		var callback = new oFF.XCommandCallback();
		callback.m_callbackListener = callbackListener;
		return callback;
	};
	oFF.XCommandCallback.prototype.m_callbackListener = null;
	oFF.XCommandCallback.prototype.onCommandProcessed = function(extResult,
			commandResult, customIdentifier) {
		this.m_callbackListener.onXCommandCallbackProcessed(extResult,
				commandResult, customIdentifier);
	};
	oFF.XCommandFactory = function() {
	};
	oFF.XCommandFactory.prototype = new oFF.XObject();
	oFF.XCommandFactory.create = function(application) {
		var commandFactory = new oFF.XCommandFactory();
		commandFactory.m_version = application.getVersion();
		return commandFactory;
	};
	oFF.XCommandFactory.prototype.m_version = 0;
	oFF.XCommandFactory.prototype.createCommand = function(commandName) {
		return this.createWithType(oFF.XCommandType.CUSTOM, commandName);
	};
	oFF.XCommandFactory.prototype.createCommandArray = function(commandType) {
		if (commandType !== oFF.XCommandType.ARRAY_CONCURRENT
				&& commandType !== oFF.XCommandType.ARRAY_BATCH) {
			return null;
		}
		return this.createWithType(commandType, "DEFAULT");
	};
	oFF.XCommandFactory.prototype.createWithType = function(commandType,
			commandName) {
		var registrationService = oFF.RegistrationService.getInstance();
		var fqn = oFF.XStringUtils.concatenate5(
				oFF.RegistrationService.COMMAND, ".", commandType.getName(),
				".", commandName);
		var references = registrationService.getReferences(fqn);
		var commandClass;
		var command;
		if (oFF.isNull(references)) {
			return null;
		}
		if (references.size() !== 1) {
			return null;
		}
		commandClass = references.get(0);
		command = commandClass.newInstance(this);
		command.setupCommand(this);
		return command;
	};
	oFF.XCommandFactory.prototype.getVersion = function() {
		return this.m_version;
	};
	oFF.XPlanningCommandCallback = function() {
	};
	oFF.XPlanningCommandCallback.prototype = new oFF.XObject();
	oFF.XPlanningCommandCallback.create = function(commandListener) {
		var callback = new oFF.XPlanningCommandCallback();
		callback.m_commandListener = commandListener;
		return callback;
	};
	oFF.XPlanningCommandCallback.prototype.m_commandListener = null;
	oFF.XPlanningCommandCallback.prototype.onCommandProcessed = function(
			extPlanningCommandResult) {
		this.m_commandListener
				.onXPlanningCommandProcessed(extPlanningCommandResult);
	};
	oFF.CmdCreateQueryManager = {
		CMD_NAME : "CREATE_QUERY_MANAGER",
		PARAM_I_APPLICATION : "APPLICATION",
		PARAM_I_SYSTEM : "SYSTEM",
		PARAM_I_DATA_SOURCE : "DATA_SOURCE",
		PARAM_I_ENFORCE_INACTIVE_CAPABILITIES : "PARAM_I_ENFORCE_INACTIVE_CAPABILITIES",
		PARAM_I_QUERY_MODEL_STRUCTURE_INA_REPOSITORY : "QUERY_MODEL_STRUCTURE_INA_REPOSITORY",
		PARAM_E_QUERY_MANAGER : "QUERY_MANAGER",
		PARAM_I_EXT_DIMS_INFO : "EXTENDED_DIMENSIONS_INFO"
	};
	oFF.CmdDeserializeBlending = {
		CMD_NAME : "DESERIALIZE_BLENDING",
		PARAM_I_ENFORCE_INACTIVE_CAPABILITIES : "PARAM_I_ENFORCE_INACTIVE_CAPABILITIES",
		PARAM_I_QUERY_MODEL_STRING_INA_REPOSITORY : "QUERY_MODEL_STRING_INA_REPOSITORY",
		PARAM_I_APPLICATION : "APPLICATION",
		PARAM_I_SYSTEM : "SYSTEM",
		PARAM_I_SYSTEMS : "SYSTEMS",
		PARAM_E_QUERY_MANAGER : "QUERY_MANAGER",
		PARAM_I_EXT_DIMS_INFO : "EXTENDED_DIMENSIONS_INFO"
	};
	oFF.CmdDeserializeBlendingSources = {
		CMD_NAME : "DESERIALIZE_BLENDING_SOURCES",
		PARAM_I_ENFORCE_INACTIVE_CAPABILITIES : "PARAM_I_ENFORCE_INACTIVE_CAPABILITIES",
		PARAM_I_QUERY_MODEL_STRING_INA_REPOSITORY : "QUERY_MODEL_STRING_INA_REPOSITORY",
		PARAM_I_APPLICATION : "APPLICATION",
		PARAM_I_SYSTEM : "SYSTEM",
		PARAM_I_SYSTEMS : "SYSTEMS",
		PARAM_E_QUERY_MANAGER : "QUERY_MANAGER",
		PARAM_E_QUERY_MANAGERS : "QUERY_MANAGERS",
		PARAM_I_EXT_DIMS_INFO : "EXTENDED_DIMENSIONS_INFO"
	};
	oFF.CmdDeserializeCalculatedDimension = {
		CMD_NAME : "DESERIALIZE_CALCULATED_DIMENSION",
		PARAM_I_QUERY_MODELS_STRING_INA_REPOSITORY : "QUERY_MODELS_STRING_INA_REPOSITORY",
		PARAM_I_APPLICATION : "APPLICATION",
		PARAM_I_SYSTEM : "SYSTEM"
	};
	oFF.CmdDeserializeExtendedDimension = {
		CMD_NAME : "DESERIALIZE_EXTENDED_DIMENSION",
		PARAM_I_QUERY_MODEL_STRING_INA_REPOSITORY : "QUERY_MODEL_STRING_INA_REPOSITORY",
		PARAM_I_ENFORCE_INACTIVE_CAPABILITIES : "PARAM_I_ENFORCE_INACTIVE_CAPABILITIES",
		PARAM_I_QUERY_MODEL : "QUERYMODEL",
		PARAM_E_QUERY_MANAGER : "QUERY_MANAGER",
		PARAM_I_EXT_DIMS_INFO : "EXTENDED_DIMENSIONS_INFO"
	};
	oFF.PlanningConstants = {
		DATA_AREA : "DATA_AREA",
		ENVIRONMENT : "ENVIRONMENT",
		MODEL : "MODEL",
		CELL_LOCKING : "CELL_LOCKING",
		PLANNING_SCHEMA : "PLANNING_SCHEMA",
		PLANNING_MODEL : "PLANNING_MODEL",
		PLANNING_MODEL_BEHAVIOUR : "PLANNING_MODEL_BEHAVIOUR",
		WITH_SHARED_VERSIONS : "WITH_SHARED_VERSIONS",
		WITH_BACKUP_TIMESTAMP : "WITH_BACKUP_TIMESTAMP",
		WITH_FAST_ACTION_PARAMETERS : "WITH_FAST_ACTION_PARAMETERS",
		WITH_UNDO_REDO_STACK : "WITH_UNDO_REDO_STACK",
		WITH_ACTION_STATE : "WITH_ACTION_STATE",
		WITH_STRICT_ERROR_HANDLING : "WITH_STRICT_ERROR_HANDLING",
		PERSISTENCE_TYPE : "PERSISTENCE_TYPE",
		BACKEND_USER_NAME : "BACKEND_USER_NAME",
		DATA_AREA_DEFAULT : "DEFAULT"
	};
	oFF.DataAreaUtil = {
		getPlanningService : function(application, systemName, dataArea) {
			var planningServices = oFF.DataAreaUtil.getPlanningServices(
					application, systemName, dataArea);
			if (planningServices.size() !== 1) {
				return null;
			}
			return planningServices.get(0);
		},
		isServiceQueryRelated : function(queryManager, systemName, dataAreaName) {
			var systemType = queryManager.getSystemType();
			var datasource;
			var queryDataArea;
			if (!systemType.isTypeOf(oFF.SystemType.BW)) {
				return false;
			}
			if (!oFF.XString.isEqual(systemName, queryManager.getSystemName())) {
				return false;
			}
			datasource = queryManager.getDataSource();
			if (oFF.isNull(datasource)) {
				return false;
			}
			queryDataArea = datasource.getDataArea();
			if (oFF.XStringUtils.isNullOrEmpty(queryDataArea)) {
				queryDataArea = oFF.PlanningConstants.DATA_AREA_DEFAULT;
			}
			return oFF.XString.isEqual(dataAreaName, queryDataArea);
		},
		isServicePlanningRelated : function(service, systemName, dataAreaName) {
			var serviceConfig = service.getPlanningServiceConfig();
			var properties;
			var serviceDataArea;
			if (oFF.isNull(serviceConfig)) {
				return false;
			}
			if (!oFF.XString.isEqual(systemName, serviceConfig.getSystemName())) {
				return false;
			}
			if (!serviceConfig.getSystemType().isTypeOf(oFF.SystemType.BW)) {
				return false;
			}
			properties = serviceConfig.getProperties();
			serviceDataArea = properties.getStringByKeyExt(
					oFF.PlanningConstants.DATA_AREA,
					oFF.PlanningConstants.DATA_AREA_DEFAULT);
			return oFF.XString.isEqual(dataAreaName, serviceDataArea);
		},
		getPlanningServices : function(application, systemName, dataArea) {
			var result = oFF.XList.create();
			var dataAreaName;
			var services;
			var i;
			var service;
			if (oFF.isNull(application)) {
				return result;
			}
			if (oFF.isNull(systemName)) {
				return result;
			}
			dataAreaName = dataArea;
			if (oFF.isNull(dataAreaName)) {
				dataAreaName = oFF.PlanningConstants.DATA_AREA_DEFAULT;
			}
			services = application
					.getServices(oFF.OlapApiModule.SERVICE_TYPE_PLANNING);
			if (oFF.isNull(services)) {
				return result;
			}
			for (i = 0; i < services.size(); i++) {
				service = services.get(i);
				if (!oFF.DataAreaUtil.isServicePlanningRelated(service,
						systemName, dataAreaName)) {
					continue;
				}
				result.add(service);
			}
			return result;
		},
		getQueryConsumerServices : function(dataArea) {
			var planningService;
			var application;
			var dataAreaName;
			var systemName;
			if (oFF.isNull(dataArea)) {
				return null;
			}
			planningService = dataArea.getPlanningService();
			if (oFF.isNull(planningService)) {
				return null;
			}
			application = planningService.getApplication();
			if (oFF.isNull(application)) {
				return null;
			}
			dataAreaName = dataArea.getDataArea();
			if (oFF.isNull(dataAreaName)) {
				dataAreaName = oFF.PlanningConstants.DATA_AREA_DEFAULT;
			}
			systemName = dataArea.getPlanningService()
					.getPlanningServiceConfig().getSystemName();
			return oFF.DataAreaUtil.getQueryConsumerServicesByName(application,
					systemName, dataAreaName);
		},
		getQueryConsumerServicesByName : function(application, systemName,
				dataArea) {
			var services = application
					.getServices(oFF.OlapApiModule.SERVICE_TYPE_QUERY_CONSUMER);
			var dataAreaName;
			var result;
			var i;
			var queryManager;
			if (oFF.isNull(services)) {
				return null;
			}
			dataAreaName = dataArea;
			if (oFF.isNull(dataAreaName)) {
				dataAreaName = oFF.PlanningConstants.DATA_AREA_DEFAULT;
			}
			result = null;
			for (i = 0; i < services.size(); i++) {
				queryManager = services.get(i);
				if (!oFF.DataAreaUtil.isServiceQueryRelated(queryManager,
						systemName, dataAreaName)) {
					continue;
				}
				if (oFF.isNull(result)) {
					result = oFF.XList.create();
				}
				result.add(queryManager);
			}
			return result;
		}
	};
	oFF.PlanningModelUtil = {
		closeActiveVersions : function(versions, doDropVersions) {
			var i;
			var version;
			for (i = 0; i < versions.size(); i++) {
				version = versions.get(i);
				if (!version.isSharedVersion()) {
					if (version.isActive()) {
						oFF.PlanningModelUtil.assertCommandOk(version
								.createRequestCloseVersion().setCloseMode(
										oFF.CloseModeType.KILL_ACTION_SEQUENCE)
								.processCommand(oFF.SyncType.BLOCKING, null,
										null));
					}
					if (doDropVersions) {
						oFF.PlanningModelUtil.assertCommandOk(version
								.createRequestDropVersion().processCommand(
										oFF.SyncType.BLOCKING, null, null));
					}
				}
			}
		},
		initEnforceNoVersion : function(planningModel) {
			if (oFF.isNull(planningModel)) {
				return;
			}
			oFF.PlanningModelUtil.closeActiveVersions(planningModel
					.getVersions(), true);
			oFF.XBooleanUtils.checkTrue(
					planningModel.getVersions().size() === 0,
					"Illegal versions");
		},
		initCreateDefaultVersion : function(planningModel) {
			var version;
			var versions;
			var versionIdentifier;
			var restoreBackupType;
			var initVersion;
			if (oFF.isNull(planningModel)) {
				return;
			}
			versions = planningModel.getVersions();
			if (versions.isEmpty()) {
				versionIdentifier = planningModel
						.getVersionIdentifier(oFF.PlanningModelUtil
								.getNewPlanningVersionId(versions), false, null);
				version = planningModel.getVersionById(versionIdentifier,
						"Planning Version");
			} else {
				oFF.PlanningModelUtil.closeActiveVersions(versions, false);
				version = versions.get(0);
			}
			restoreBackupType = oFF.RestoreBackupType.NONE;
			if (version.getVersionState() === oFF.PlanningVersionState.DIRTY) {
				restoreBackupType = oFF.RestoreBackupType.RESTORE_FALSE;
			}
			initVersion = version
					.createRequestVersion(oFF.PlanningModelRequestType.INIT_VERSION);
			initVersion.setRestoreBackupType(restoreBackupType);
			oFF.PlanningModelUtil.assertCommandOk(initVersion.processCommand(
					oFF.SyncType.BLOCKING, null, null));
		},
		initEnforceSingleVersion : function(planningModel) {
			var versions;
			var versionIdentifier;
			var version;
			var initVersion;
			if (oFF.isNull(planningModel)) {
				return;
			}
			versions = planningModel.getVersions();
			oFF.PlanningModelUtil.closeActiveVersions(versions, true);
			versionIdentifier = planningModel.getVersionIdentifier(
					oFF.PlanningModelUtil.getNewPlanningVersionId(versions),
					false, null);
			version = planningModel.getVersionById(versionIdentifier,
					"Planning Version");
			oFF.XBooleanUtils.checkTrue(version.getVersionId() === 1,
					"Illegal versions");
			initVersion = version
					.createRequestVersion(oFF.PlanningModelRequestType.INIT_VERSION);
			initVersion.setRestoreBackupType(oFF.RestoreBackupType.NONE);
			oFF.PlanningModelUtil.assertCommandOk(initVersion.processCommand(
					oFF.SyncType.BLOCKING, null, null));
			versions = planningModel.getVersions();
			oFF.XBooleanUtils.checkTrue(versions.size() === 1,
					"Illegal versions");
			oFF.XBooleanUtils.checkTrue(versions.get(0) === version,
					"Illegal versions");
		},
		dropAllVersions : function(planningModel) {
			var versions;
			if (oFF.isNull(planningModel)) {
				return;
			}
			versions = planningModel.getVersions();
			oFF.PlanningModelUtil.closeActiveVersions(versions, true);
			oFF.XBooleanUtils.checkTrue(
					planningModel.getVersions().size() === 0,
					"Illegal versions");
		},
		assertCommandOk : function(commandResult) {
			oFF.XObjectExt.checkNotNull(commandResult, "Command result null");
			oFF.MessageUtil.checkNoError(commandResult);
		},
		getNewPlanningVersionId : function(planningVersions) {
			var newVersionId = 1;
			while (oFF.PlanningModelUtil.containsPlanningVersionId(
					planningVersions, newVersionId)) {
				newVersionId++;
			}
			return newVersionId;
		},
		containsPlanningVersionId : function(planningVersions, versionId) {
			var i;
			var planningVersion;
			for (i = 0; i < planningVersions.size(); i++) {
				planningVersion = planningVersions.get(i);
				if (planningVersion.isSharedVersion()) {
					continue;
				}
				if (planningVersion.getVersionId() === versionId) {
					return true;
				}
			}
			return false;
		},
		getPlanningService : function(application, systemName, planningSchema,
				planningModel) {
			var planningServices = oFF.PlanningModelUtil.getPlanningServices(
					application, systemName, planningSchema, planningModel);
			if (planningServices.size() === 1) {
				return planningServices.get(0);
			}
			return null;
		},
		skipServiceConfig : function(serviceConfig, systemName) {
			var systemType;
			if (oFF.isNull(serviceConfig)) {
				return true;
			}
			if (!oFF.XString.isEqual(systemName, serviceConfig.getSystemName())) {
				return true;
			}
			systemType = serviceConfig.getSystemType();
			if (oFF.isNull(systemType)) {
				return true;
			}
			if (!systemType.isTypeOf(oFF.SystemType.HANA)) {
				return true;
			}
			return false;
		},
		getPlanningServices : function(application, systemName, planningSchema,
				planningModel) {
			var result = oFF.XList.create();
			var services;
			var i;
			var service;
			var serviceConfig;
			var properties;
			if (oFF.isNull(application)) {
				return result;
			}
			services = application
					.getServices(oFF.OlapApiModule.SERVICE_TYPE_PLANNING);
			if (oFF.isNull(services)) {
				return result;
			}
			for (i = 0; i < services.size(); i++) {
				service = services.get(i);
				serviceConfig = service.getPlanningServiceConfig();
				if (oFF.PlanningModelUtil.skipServiceConfig(serviceConfig,
						systemName)) {
					continue;
				}
				properties = serviceConfig.getProperties();
				if (!oFF.XString.isEqual(planningSchema, properties
						.getStringByKeyExt(
								oFF.PlanningConstants.PLANNING_SCHEMA, null))) {
					continue;
				}
				if (!oFF.XString.isEqual(planningModel, properties
						.getStringByKeyExt(
								oFF.PlanningConstants.PLANNING_MODEL, null))) {
					continue;
				}
				result.add(service);
			}
			return result;
		},
		getPlanningServiceFromQueryDataSource : function(application,
				systemName, dataSource) {
			var planningServices = oFF.PlanningModelUtil
					.getPlanningServicesFromQueryDataSource(application,
							systemName, dataSource);
			if (planningServices.size() === 1) {
				return planningServices.get(0);
			}
			return null;
		},
		getPlanningServicesFromQueryDataSource : function(application,
				systemName, dataSource) {
			var result = oFF.XList.create();
			var services;
			var fullQualifiedName;
			var i;
			var service;
			var serviceConfig;
			var planningContext;
			var planningModel;
			var dataSources;
			var j;
			var queryDataSource;
			if (oFF.isNull(application) || oFF.isNull(systemName)
					|| oFF.isNull(dataSource)) {
				return result;
			}
			services = application
					.getServices(oFF.OlapApiModule.SERVICE_TYPE_PLANNING);
			if (oFF.isNull(services)) {
				return result;
			}
			fullQualifiedName = dataSource.getFullQualifiedName();
			for (i = 0; i < services.size(); i++) {
				service = services.get(i);
				serviceConfig = service.getPlanningServiceConfig();
				if (oFF.PlanningModelUtil.skipServiceConfig(serviceConfig,
						systemName)) {
					continue;
				}
				planningContext = service.getPlanningContext();
				if (oFF.isNull(planningContext)) {
					continue;
				}
				if (planningContext.getPlanningContextType() !== oFF.PlanningContextType.PLANNING_MODEL) {
					continue;
				}
				planningModel = planningContext;
				dataSources = planningModel.getQueryDataSources();
				if (oFF.isNull(dataSources)) {
					continue;
				}
				for (j = 0; j < dataSources.size(); j++) {
					queryDataSource = dataSources.get(j);
					if (oFF.XString.isEqual(queryDataSource.getDataSource()
							.getFullQualifiedName(), fullQualifiedName)
							&& queryDataSource.isPrimary()) {
						result.add(service);
						break;
					}
				}
			}
			return result;
		},
		getQueryConsumerServices : function(planningModel) {
			var result = oFF.XList.create();
			var application;
			var services;
			var dataSources;
			var dataSourcesMap;
			var i;
			var dataSource;
			var dataSourceName;
			var systemName;
			var j;
			var queryManager;
			var systemType;
			var datasource;
			if (oFF.isNull(planningModel)) {
				return result;
			}
			application = planningModel.getPlanningService().getApplication();
			services = application
					.getServices(oFF.OlapApiModule.SERVICE_TYPE_QUERY_CONSUMER);
			if (oFF.isNull(services)) {
				return result;
			}
			dataSources = planningModel.getQueryDataSources();
			if (oFF.isNull(dataSources)) {
				return result;
			}
			dataSourcesMap = oFF.XHashMapByString.create();
			for (i = 0; i < dataSources.size(); i++) {
				dataSource = dataSources.get(i);
				dataSourceName = dataSource.getDataSource()
						.getFullQualifiedName();
				dataSourcesMap.put(dataSourceName, dataSource);
			}
			if (dataSourcesMap.isEmpty()) {
				return result;
			}
			systemName = planningModel.getPlanningService()
					.getPlanningServiceConfig().getSystemName();
			for (j = 0; j < services.size(); j++) {
				queryManager = services.get(j);
				systemType = queryManager.getSystemType();
				if (systemType !== oFF.SystemType.HANA) {
					continue;
				}
				if (!oFF.XString.isEqual(systemName, queryManager
						.getSystemName())) {
					continue;
				}
				datasource = queryManager.getDataSource();
				if (oFF.isNull(datasource)) {
					continue;
				}
				if (!dataSourcesMap.containsKey(datasource
						.getFullQualifiedName())) {
					continue;
				}
				if (!result.contains(queryManager)) {
					result.add(queryManager);
				}
			}
			return result;
		}
	};
	oFF.BlendingConstants = {
		ERROR_INVALID_QUERY_MODEL : 3001,
		ERROR_INVALID_DIMENSION : 3002,
		ERROR_INVALID_MAPPING : 3003,
		ERROR_INVALID_BLENDING_DATA_SOURCE : 3004,
		ERROR_INVALID_BLENDING_DEFINITION : 3005,
		ERROR_INVALID_FIELD : 3005,
		EXCEPTION_SETTING_BLENDING_DUPLICATE : "BlendingDuplicate",
		EXCEPTION_SETTING_BLENDING_AGGREGATE : "BlendingAggregate",
		REMOTE_BLENDING_USE_REQUEST_ONLY_FOR_ID_CALCULATION : false
	};
	oFF.AbstractBlendingMapping = function() {
	};
	oFF.AbstractBlendingMapping.prototype = new oFF.XObject();
	oFF.AbstractBlendingMapping.prototype.m_blendingDefinition = null;
	oFF.AbstractBlendingMapping.prototype.m_mappingDefinitionType = null;
	oFF.AbstractBlendingMapping.prototype.setupAbstractMapping = function(
			mappingType, blendingDefinition) {
		this.m_mappingDefinitionType = mappingType;
		this.m_blendingDefinition = oFF.XWeakReferenceUtil
				.getWeakRef(blendingDefinition);
	};
	oFF.AbstractBlendingMapping.prototype.getBlendingDefinition = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_blendingDefinition);
	};
	oFF.AbstractBlendingMapping.prototype.getMappingDefinitionType = function() {
		return this.m_mappingDefinitionType;
	};
	oFF.AbstractBlendingMapping.prototype.releaseObject = function() {
		this.m_mappingDefinitionType = null;
		this.m_blendingDefinition = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.BlendingCapabilities = {
		BLENDING_CAPABILITY_LOCAL : "CubeBlending",
		BLENDING_CAPABILITY_REMOTE : "RemoteBlending",
		BLENDING_CAPABILITY_REMOTE_BW : "RemoteBlendingBW",
		isObjectTypeSupportedForBlending : function(type) {
			return type === oFF.MetaObjectType.DBVIEW
					|| type === oFF.MetaObjectType.QUERY
					|| type === oFF.MetaObjectType.PLANNING
					|| type === oFF.MetaObjectType.BLENDING;
		},
		isDimensionTypeSupportedForBlending : function(type) {
			if (oFF.isNull(type)) {
				return false;
			}
			return type.isValidForBlending();
		},
		getMaxNumberOfBlendingQueries : function() {
			return 2;
		},
		isAxisTypeSupportedForBlending : function(type) {
			if (oFF.isNull(type)) {
				return false;
			}
			return type === oFF.AxisType.COLUMNS || type === oFF.AxisType.ROWS;
		},
		getMinCapabilityForBlendingHost : function(sources) {
			var minCapability;
			var primarySystemName;
			var i;
			var source;
			var queryModel;
			var systemType;
			if (!oFF.XCollectionUtils.hasElements(sources)) {
				return null;
			}
			minCapability = oFF.BlendingCapabilities.BLENDING_CAPABILITY_LOCAL;
			primarySystemName = sources.get(0).getQueryModel()
					.getQueryManager().getSystemName();
			for (i = 0; i < sources.size(); i++) {
				source = sources.get(i);
				queryModel = source.getQueryModel();
				systemType = queryModel.getSystemType();
				if (systemType.isTypeOf(oFF.SystemType.BW)
						|| systemType.isTypeOf(oFF.SystemType.VIRTUAL_INA)) {
					minCapability = oFF.BlendingCapabilities.BLENDING_CAPABILITY_REMOTE_BW;
				} else {
					if (!systemType.isTypeOf(oFF.SystemType.HANA)) {
						return null;
					}
				}
				if (oFF.XString.isEqual(minCapability,
						oFF.BlendingCapabilities.BLENDING_CAPABILITY_LOCAL)
						&& !oFF.XString.isEqual(primarySystemName, queryModel
								.getQueryManager().getSystemName())) {
					minCapability = oFF.BlendingCapabilities.BLENDING_CAPABILITY_REMOTE;
				}
			}
			return minCapability;
		},
		sourceSupportsCapability : function(source, minBlendingCapability) {
			if (oFF.XString.isEqual(minBlendingCapability,
					oFF.BlendingCapabilities.BLENDING_CAPABILITY_REMOTE)) {
				return source.getQueryModel().supportsRemoteBlending();
			}
			if (oFF.XString.isEqual(minBlendingCapability,
					oFF.BlendingCapabilities.BLENDING_CAPABILITY_REMOTE_BW)) {
				return source.getQueryModel().supportsRemoteBlendingBW();
			}
			return false;
		},
		blendingHostSupportsCapability : function(blendingHost,
				minBlendingCapability) {
			if (oFF.isNull(blendingHost)) {
				return false;
			}
			if (oFF.XString.isEqual(minBlendingCapability,
					oFF.BlendingCapabilities.BLENDING_CAPABILITY_REMOTE)) {
				return blendingHost.supportsRemoteBlending();
			}
			if (oFF.XString.isEqual(minBlendingCapability,
					oFF.BlendingCapabilities.BLENDING_CAPABILITY_REMOTE_BW)) {
				return blendingHost.supportsRemoteBlendingBW();
			}
			return false;
		}
	};
	oFF.BlendingHost = function() {
	};
	oFF.BlendingHost.prototype = new oFF.XObject();
	oFF.BlendingHost.createWithSource = function(source) {
		var queryModel = source.getQueryModel();
		var blendingHost = new oFF.BlendingHost();
		blendingHost.setupBlendingHost(queryModel.getQueryManager()
				.getSystemDescription(), queryModel.supportsCubeBlending(),
				queryModel.supportsRemoteBlending(), queryModel
						.supportsRemoteBlendingBW());
		blendingHost.m_blendingSource = source;
		return blendingHost;
	};
	oFF.BlendingHost.createWithSystemName = function(systemName, application) {
		var connection = application.getConnection(systemName);
		var serverMetadata = connection.getServerMetadata();
		var supportsCubeBlending = serverMetadata
				.supportsAnalyticCapability(oFF.BlendingCapabilities.BLENDING_CAPABILITY_LOCAL);
		var supportsRemoteBlending = serverMetadata
				.supportsAnalyticCapability(oFF.BlendingCapabilities.BLENDING_CAPABILITY_REMOTE);
		var supportsRemoteBlendingBW = serverMetadata
				.supportsAnalyticCapability(oFF.BlendingCapabilities.BLENDING_CAPABILITY_REMOTE_BW);
		var systemDescription = application.getSystemLandscape()
				.getSystemDescription(systemName);
		var blendingHost = new oFF.BlendingHost();
		blendingHost.setupBlendingHost(systemDescription, supportsCubeBlending,
				supportsRemoteBlending, supportsRemoteBlendingBW);
		return blendingHost;
	};
	oFF.BlendingHost.prototype.m_blendingSource = null;
	oFF.BlendingHost.prototype.m_systemDescription = null;
	oFF.BlendingHost.prototype.m_supportsCubeBlending = false;
	oFF.BlendingHost.prototype.m_supportsRemoteBlending = false;
	oFF.BlendingHost.prototype.m_supportsRemoteBlendingBW = false;
	oFF.BlendingHost.prototype.setupBlendingHost = function(systemDescription,
			supportsCubeBlending, supportsRemoteBlending,
			supportsRemoteBlendingBW) {
		this.m_systemDescription = systemDescription;
		this.m_supportsCubeBlending = supportsCubeBlending;
		this.m_supportsRemoteBlending = supportsRemoteBlending;
		this.m_supportsRemoteBlendingBW = supportsRemoteBlendingBW;
	};
	oFF.BlendingHost.prototype.releaseObject = function() {
		oFF.XObject.prototype.releaseObject.call(this);
		this.m_blendingSource = null;
		this.m_systemDescription = null;
	};
	oFF.BlendingHost.prototype.getSource = function() {
		return this.m_blendingSource;
	};
	oFF.BlendingHost.prototype.getSystemDescription = function() {
		return this.m_systemDescription;
	};
	oFF.BlendingHost.prototype.getSystemName = function() {
		return this.m_systemDescription.getSystemName();
	};
	oFF.BlendingHost.prototype.isSystemMappingValid = function(
			remoteQueryManager) {
		return this.m_systemDescription.isSystemMappingValid(remoteQueryManager
				.getSystemDescription());
	};
	oFF.BlendingHost.prototype.supportsCubeBlending = function() {
		return this.m_supportsCubeBlending;
	};
	oFF.BlendingHost.prototype.supportsRemoteBlending = function() {
		return this.m_supportsRemoteBlending;
	};
	oFF.BlendingHost.prototype.supportsRemoteBlendingBW = function() {
		return this.m_supportsRemoteBlendingBW;
	};
	oFF.BlendingHostManager = function() {
	};
	oFF.BlendingHostManager.prototype = new oFF.XObject();
	oFF.BlendingHostManager.create = function(blendingDefinition) {
		var blendingHostManager = new oFF.BlendingHostManager();
		blendingHostManager.m_blendingDefinition = blendingDefinition;
		return blendingHostManager;
	};
	oFF.BlendingHostManager.prototype.m_blendingDefinition = null;
	oFF.BlendingHostManager.prototype.m_blendingHost = null;
	oFF.BlendingHostManager.prototype.m_application = null;
	oFF.BlendingHostManager.prototype.releaseObject = function() {
		oFF.XObject.prototype.releaseObject.call(this);
		this.m_blendingHost = oFF.XObjectExt.release(this.m_blendingHost);
		this.m_blendingDefinition = null;
		this.m_application = null;
	};
	oFF.BlendingHostManager.prototype.setSourceAsBlendingHost = function(source) {
		this.m_blendingHost = oFF.XObjectExt.release(this.m_blendingHost);
		if (oFF.notNull(source)) {
			this.m_blendingHost = oFF.BlendingHost.createWithSource(source);
		}
	};
	oFF.BlendingHostManager.prototype.setBlendingHost = function(blendingHost) {
		this.m_blendingHost = blendingHost;
	};
	oFF.BlendingHostManager.prototype.getBlendingHost = function() {
		this.updateBlendingHost();
		return this.m_blendingHost;
	};
	oFF.BlendingHostManager.prototype.updateBlendingHost = function() {
		var minBlendingCapability = oFF.BlendingCapabilities
				.getMinCapabilityForBlendingHost(this.m_blendingDefinition
						.getSources());
		if (oFF.isNull(minBlendingCapability)) {
			this.setBlendingHost(null);
		} else {
			if (oFF.XString.isEqual(minBlendingCapability,
					oFF.BlendingCapabilities.BLENDING_CAPABILITY_LOCAL)) {
				if (oFF.isNull(this.m_blendingHost)) {
					this.setSourceAsBlendingHost(this.m_blendingDefinition
							.getSources().get(0));
				}
			} else {
				if (!oFF.BlendingCapabilities.blendingHostSupportsCapability(
						this.m_blendingHost, minBlendingCapability)) {
					this.setBlendingHost(this
							.findBlendingHost(minBlendingCapability));
				}
			}
		}
	};
	oFF.BlendingHostManager.prototype.findBlendingHost = function(
			minBlendingCapability) {
		var masterSystemName = this.getMasterSystemName();
		var primary = this.m_blendingDefinition.getSources().get(0);
		var systemsByMappingCount;
		var mappingCounts;
		var numberOfDifferentMappingsCounts;
		var i;
		var systems;
		var blendingSource;
		var metadata;
		var systemName;
		if (oFF.XString.isEqual(masterSystemName, this.getSystemName(primary))) {
			if (oFF.BlendingCapabilities.sourceSupportsCapability(primary,
					minBlendingCapability)) {
				return oFF.BlendingHost.createWithSource(primary);
			}
			return null;
		}
		systemsByMappingCount = this.getSystemsByMappingCount();
		mappingCounts = oFF.XCollectionUtils.sortListAsIntegers(
				systemsByMappingCount.getKeysAsReadOnlyListOfString(),
				oFF.XSortDirection.DESCENDING);
		numberOfDifferentMappingsCounts = mappingCounts.size();
		for (i = 0; i < numberOfDifferentMappingsCounts; i++) {
			systems = systemsByMappingCount.getByKey(mappingCounts.get(i));
			blendingSource = this.getBlendingSourceFromList(systems,
					minBlendingCapability);
			if (oFF.notNull(blendingSource)) {
				return oFF.BlendingHost.createWithSource(blendingSource);
			}
			if (i === numberOfDifferentMappingsCounts - 1) {
				metadata = this.getServerMetadata(masterSystemName);
				if (oFF.notNull(metadata)
						&& metadata
								.supportsAnalyticCapability(minBlendingCapability)) {
					return oFF.BlendingHost.createWithSystemName(
							masterSystemName, this.getApplication());
				}
			}
			systemName = this.getBestBlendingHostFromList(systems,
					minBlendingCapability);
			if (oFF.notNull(systemName)) {
				return oFF.BlendingHost.createWithSystemName(systemName, this
						.getApplication());
			}
		}
		return null;
	};
	oFF.BlendingHostManager.prototype.getSystemsByMappingCount = function() {
		var map = oFF.XHashMapByString.create();
		var blendingSources = this.m_blendingDefinition.getSources();
		var systemLandscape = this.getApplication().getSystemLandscape();
		var systemNames = systemLandscape.getSystemNames();
		var size = systemNames.size();
		var i;
		var systemName;
		var mappings;
		var systemsWithSameMappingCount;
		var systems;
		for (i = 0; i < size; i++) {
			systemName = systemNames.get(i);
			mappings = oFF.XInteger.convertToString(this.getMappingCount(
					systemName, blendingSources, systemLandscape));
			systemsWithSameMappingCount = map.getByKey(mappings);
			if (oFF.notNull(systemsWithSameMappingCount)) {
				systemsWithSameMappingCount.add(systemName);
			} else {
				systems = oFF.XListOfString.create();
				systems.add(systemName);
				map.put(mappings, systems);
			}
		}
		return map;
	};
	oFF.BlendingHostManager.prototype.getMappingCount = function(systemName,
			blendingSources, systemLandscape) {
		var systemDescription = systemLandscape
				.getSystemDescription(systemName);
		var mappings = 0;
		var size = blendingSources.size();
		var k;
		var blendingSource;
		var blendingSourceQM;
		for (k = 0; k < size; k++) {
			blendingSource = blendingSources.get(k);
			blendingSourceQM = blendingSource.getQueryModel().getQueryManager();
			if (oFF.XString.isEqual(systemName, blendingSourceQM
					.getSystemName())
					|| systemDescription.isSystemMappingValid(blendingSourceQM
							.getSystemDescription())) {
				mappings++;
			}
		}
		return mappings;
	};
	oFF.BlendingHostManager.prototype.getBlendingSourceFromList = function(
			systemNames, minBlendingCapability) {
		var result = null;
		var blendingSources = this.m_blendingDefinition.getSources();
		var size = blendingSources.size();
		var i;
		var source;
		var systemName;
		for (i = 0; i < size; i++) {
			source = blendingSources.get(i);
			systemName = this.getSystemName(source);
			if (systemNames.contains(systemName)
					&& oFF.BlendingCapabilities.sourceSupportsCapability(
							source, minBlendingCapability)) {
				if (oFF.isNull(result)
						|| oFF.ServerVersionComparator.compare(this
								.getVersion(result), this.getVersion(source)) === 1) {
					result = source;
				}
			}
		}
		return result;
	};
	oFF.BlendingHostManager.prototype.getVersion = function(source) {
		var queryManager = source.getQueryModel().getQueryManager();
		var serverMetadata = this.getServerMetadata(queryManager
				.getSystemName());
		if (oFF.notNull(serverMetadata)) {
			return serverMetadata.getVersion();
		}
		return null;
	};
	oFF.BlendingHostManager.prototype.getBestBlendingHostFromList = function(
			systemNames, minBlendingCapability) {
		var name = null;
		var version = null;
		var size = systemNames.size();
		var i;
		var system;
		var serverMetadata;
		var serverVersion;
		for (i = 0; i < size; i++) {
			system = systemNames.get(i);
			serverMetadata = this.getServerMetadata(system);
			if (oFF.notNull(serverMetadata)
					&& serverMetadata
							.supportsAnalyticCapability(minBlendingCapability)) {
				serverVersion = serverMetadata.getVersion();
				if (oFF.isNull(name)
						|| oFF.ServerVersionComparator.compare(version,
								serverVersion) === 1) {
					name = system;
					version = serverVersion;
				}
			}
		}
		return name;
	};
	oFF.BlendingHostManager.prototype.getApplication = function() {
		var sources;
		var queryModel;
		if (oFF.isNull(this.m_application)) {
			sources = this.m_blendingDefinition.getSources();
			queryModel = sources.get(0).getQueryModel();
			this.m_application = queryModel.getApplication();
		}
		return this.m_application;
	};
	oFF.BlendingHostManager.prototype.getMasterSystemName = function() {
		var systemLandscape = this.getApplication().getSystemLandscape();
		return systemLandscape.getMasterSystemName();
	};
	oFF.BlendingHostManager.prototype.getSystemName = function(source) {
		return source.getQueryModel().getQueryManager().getSystemName();
	};
	oFF.BlendingHostManager.prototype.getServerMetadata = function(systemName) {
		var application;
		var connection;
		if (oFF.notNull(systemName)) {
			application = this.getApplication();
			connection = application.getConnection(systemName);
			if (oFF.notNull(connection)) {
				return connection.getServerMetadata();
			}
		}
		return null;
	};
	oFF.BlendingSource = function() {
	};
	oFF.BlendingSource.prototype = new oFF.XObject();
	oFF.BlendingSource.create = function(queryModel, queryAliasName) {
		var source;
		oFF.XObjectExt.checkNotNull(queryModel, "Querymodel null");
		oFF.XStringUtils.checkStringNotEmpty(queryAliasName,
				"Query Alias name null");
		oFF.BlendingValidation.isQueryModelValidForBlending(queryModel, null);
		queryModel.setDefinitionName(queryAliasName);
		source = new oFF.BlendingSource();
		source.m_queryModel = oFF.XWeakReferenceUtil.getWeakRef(queryModel);
		source.m_aliasName = queryAliasName;
		return source;
	};
	oFF.BlendingSource.createPersistenceIdentifier = function(queryManager) {
		var queryModel = queryManager.getQueryModel();
		var baseDataSource = queryModel.getDataSource();
		var instanceId = baseDataSource.getInstanceId();
		var hasProcessingStep;
		var systemDescription;
		var request;
		var persistenceIdentifier;
		var user;
		var host;
		var sid;
		baseDataSource.setInstanceId(null);
		hasProcessingStep = queryModel.hasProcessingStep();
		queryModel.setHasProcessingStep(false);
		systemDescription = queryManager.getSystemDescription();
		request = queryModel.serializeToFormat(oFF.QModelFormat.INA_DATA);
		if (oFF.BlendingConstants.REMOTE_BLENDING_USE_REQUEST_ONLY_FOR_ID_CALCULATION) {
			persistenceIdentifier = oFF.XSha1.createSHA1(request);
		} else {
			user = systemDescription.getUser();
			host = systemDescription.getHost();
			sid = queryManager.getSession().getAppSessionId();
			persistenceIdentifier = oFF.XSha1.createSHA1(oFF.XStringUtils
					.concatenate4(user, request, host, sid));
		}
		baseDataSource.setInstanceId(instanceId);
		queryModel.setHasProcessingStep(hasProcessingStep);
		return persistenceIdentifier;
	};
	oFF.BlendingSource.prototype.m_queryModel = null;
	oFF.BlendingSource.prototype.m_aliasName = null;
	oFF.BlendingSource.prototype.m_isRemote = false;
	oFF.BlendingSource.prototype.cloneBlendingSource = function() {
		var origQueryManager = this.getQueryModel().getQueryManager();
		var cloneQueryManager = origQueryManager
				.cloneQueryManagerExt(oFF.QueryCloneMode.CURRENT_STATE_INA);
		var blendingSource = oFF.BlendingSource.create(cloneQueryManager
				.getQueryModel(), this.getQueryAliasName());
		blendingSource.setIsRemoteSource(this.m_isRemote);
		return blendingSource;
	};
	oFF.BlendingSource.prototype.clone = function() {
		return this.cloneBlendingSource();
	};
	oFF.BlendingSource.prototype.isEqualTo = function(other) {
		var xOther;
		if (oFF.isNull(other)) {
			return false;
		}
		if (this === other) {
			return true;
		}
		xOther = other;
		if (!oFF.XString.isEqual(this.getQueryAliasName(), xOther
				.getQueryAliasName())) {
			return false;
		}
		if (this.isRemoteSource() !== xOther.isRemoteSource()) {
			return false;
		}
		return this.getQueryModel().isEqualTo(xOther.getQueryModel());
	};
	oFF.BlendingSource.prototype.releaseObject = function() {
		this.m_aliasName = null;
		this.m_queryModel = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.BlendingSource.prototype.getQueryModel = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_queryModel);
	};
	oFF.BlendingSource.prototype.getQueryAliasName = function() {
		return this.m_aliasName;
	};
	oFF.BlendingSource.prototype.isRemoteSource = function() {
		return this.m_isRemote;
	};
	oFF.BlendingSource.prototype.setIsRemoteSource = function(isRemoteSource) {
		this.m_isRemote = isRemoteSource;
	};
	oFF.BlendingSource.prototype.updatePersistenceIdentifier = function(
			blendingHost) {
		var queryManager = this.getQueryModel().getQueryManager();
		this.updateResultSetPersistenceTarget(blendingHost, queryManager);
		queryManager.setResultSetPersistenceIdentifier(oFF.BlendingSource
				.createPersistenceIdentifier(queryManager));
	};
	oFF.BlendingSource.prototype.isRemoteQueryPersistenceIdentifierUpToDate = function() {
		var queryManager = this.getQueryModel().getQueryManager();
		var currentIdentifier = queryManager
				.getResultSetPersistenceIdentifier();
		var newIdentifier = oFF.BlendingSource
				.createPersistenceIdentifier(queryManager);
		return oFF.XString.isEqual(currentIdentifier, newIdentifier);
	};
	oFF.BlendingSource.prototype.updateResultSetPersistenceTarget = function(
			blendingHost, remoteQueryManager) {
		var systemMapping;
		if (this.isRemoteSource() && oFF.notNull(blendingHost)) {
			if (blendingHost.isSystemMappingValid(remoteQueryManager)) {
				systemMapping = remoteQueryManager.getSystemDescription()
						.getSystemMapping(blendingHost.getSystemName());
				remoteQueryManager
						.setResultSetPersistanceTargetTable(systemMapping
								.getSerializeTable());
				remoteQueryManager
						.setResultSetPersistanceTargetSchema(systemMapping
								.getSerializeSchema());
			} else {
				remoteQueryManager.setResultSetPersistanceTargetTable(null);
				remoteQueryManager.setResultSetPersistanceTargetSchema(null);
			}
		}
	};
	oFF.BlendingSource.prototype.invalidateCache = function() {
		var queryManager = this.getQueryModel().getQueryManager();
		var persistenceIdentifier = oFF.BlendingSource
				.createPersistenceIdentifier(queryManager);
		var olapEnv = queryManager.getOlapEnv();
		olapEnv.invalidateRemoteBlendingCacheEntry(persistenceIdentifier);
	};
	oFF.BlendingValidation = {
		addError : function(messages, errorCode, message, extendedInfo) {
			var messageSb = oFF.XStringBuffer.create();
			messageSb.append("Blending Validation Error ").appendInt(errorCode)
					.append(": ").append(message);
			oFF.XObjectExt.checkNotNull(messages, messageSb.toString());
			messages.addErrorExt(oFF.OriginLayer.DRIVER, errorCode, messageSb
					.toString(), extendedInfo);
		},
		isQueryModelValidForBlending : function(queryModel, messageManager) {
			var dataSource;
			if (oFF.isNull(queryModel)) {
				oFF.BlendingValidation.addError(messageManager,
						oFF.BlendingConstants.ERROR_INVALID_QUERY_MODEL,
						"The QueryModel is null", null);
				return false;
			}
			if (!queryModel.supportsAnalyticCapabilityActive("CubeBlending")) {
				oFF.BlendingValidation.addError(messageManager,
						oFF.BlendingConstants.ERROR_INVALID_QUERY_MODEL,
						"Currently only HANA and BW support blending",
						queryModel);
				return false;
			}
			dataSource = queryModel.getDataSource();
			if (oFF.isNull(dataSource)) {
				oFF.BlendingValidation.addError(messageManager,
						oFF.BlendingConstants.ERROR_INVALID_QUERY_MODEL,
						"The DataSource is null", queryModel);
				return false;
			}
			if (!oFF.BlendingCapabilities
					.isObjectTypeSupportedForBlending(dataSource.getType())) {
				oFF.BlendingValidation.addError(messageManager,
						oFF.BlendingConstants.ERROR_INVALID_QUERY_MODEL,
						oFF.XStringUtils.concatenate3("The DataSource Type '",
								dataSource.getType().getCamelCaseName(),
								"' is not supported"), queryModel);
				return false;
			}
			return true;
		},
		isFieldImplicitlyRequested : function(field) {
			if (field.isAlwaysRequested()) {
				return true;
			}
			if (field.isKeyField()) {
				return true;
			}
			if (field.getDimension().getKeyField() === field) {
				return true;
			}
			if (field.isDefaultTextField()) {
				return true;
			}
			if (field.getDimension().getTextField() === field) {
				return true;
			}
			if (field.hasSorting()
					&& field.getResultSetSorting().getDirection() !== oFF.XSortDirection.DEFAULT_VALUE) {
				return true;
			}
			return false;
		},
		isFieldValidForBlending : function(field, messageManager, validateAll) {
			var resultSetFields;
			if (oFF.isNull(field)) {
				oFF.BlendingValidation.addError(messageManager,
						oFF.BlendingConstants.ERROR_INVALID_FIELD,
						"The field is null", null);
				return false;
			}
			if (validateAll) {
				if (!oFF.BlendingValidation.isDimensionValidForBlending(field
						.getDimension(), messageManager, validateAll)) {
					return false;
				}
			}
			if (oFF.BlendingValidation.isFieldImplicitlyRequested(field)) {
				return true;
			}
			resultSetFields = field.getDimension().getResultSetFields();
			if (resultSetFields.contains(field)) {
				return true;
			}
			oFF.BlendingValidation.addError(messageManager,
					oFF.BlendingConstants.ERROR_INVALID_FIELD, oFF.XStringUtils
							.concatenate3("The field '", field.getName(),
									"' is not requested"), field);
			return false;
		},
		isDimensionValidForBlending : function(dimension, messageManager,
				validateAll) {
			var isNotAccount;
			var isNotMeasure;
			if (oFF.isNull(dimension)) {
				oFF.BlendingValidation.addError(messageManager,
						oFF.BlendingConstants.ERROR_INVALID_DIMENSION,
						"The Dimension is null", null);
				return false;
			}
			if (validateAll) {
				if (!oFF.BlendingValidation.isQueryModelValidForBlending(
						dimension.getQueryModel(), messageManager)) {
					return false;
				}
			}
			isNotAccount = dimension.getDimensionType() !== oFF.DimensionType.ACCOUNT;
			isNotMeasure = dimension.getDimensionType() !== oFF.DimensionType.MEASURE_STRUCTURE;
			if (!oFF.BlendingCapabilities
					.isAxisTypeSupportedForBlending(dimension.getAxisType())
					&& isNotAccount && isNotMeasure) {
				oFF.BlendingValidation.addError(messageManager,
						oFF.BlendingConstants.ERROR_INVALID_DIMENSION,
						oFF.XStringUtils.concatenate3(
								"The axis of the dimension '", dimension
										.getName(),
								"' is not supported for blending"), dimension);
				return false;
			}
			if (!oFF.BlendingCapabilities
					.isDimensionTypeSupportedForBlending(dimension
							.getDimensionType())) {
				oFF.BlendingValidation.addError(messageManager,
						oFF.BlendingConstants.ERROR_INVALID_DIMENSION,
						oFF.XStringUtils.concatenate3(
								"The type of the dimension '", dimension
										.getName(),
								"' is not supported for blending"), dimension);
				return false;
			}
			return true;
		},
		assertBlendingDefinitionIsValid : function(blendingDefinition) {
			oFF.BlendingValidation.isBlendingDefinitionValid(
					blendingDefinition, null);
		},
		isBlendingDefinitionValid : function(blendingDefinition, messageManager) {
			var mappings;
			var mappingIterator;
			var mapping;
			if (oFF.isNull(blendingDefinition)) {
				oFF.BlendingValidation
						.addError(
								messageManager,
								oFF.BlendingConstants.ERROR_INVALID_BLENDING_DEFINITION,
								"The BlendingDefinition is null", null);
				return false;
			}
			if (blendingDefinition.getSources().size() < 2) {
				oFF.BlendingValidation
						.addError(
								messageManager,
								oFF.BlendingConstants.ERROR_INVALID_BLENDING_DEFINITION,
								"At least 2 sources must be defined for blending",
								blendingDefinition);
				return false;
			}
			if (!oFF.BlendingValidation.assertMandatoryJoinTypes(
					blendingDefinition, messageManager)) {
				return false;
			}
			mappings = blendingDefinition.getMappings();
			mappingIterator = mappings.getIterator();
			while (mappingIterator.hasNext()) {
				mapping = mappingIterator.next();
				if (mapping.getConstantMappings().hasElements()
						&& mapping.getLinkType() !== oFF.BlendingLinkType.ALL_DATA
						&& mapping.getLinkType() !== oFF.BlendingLinkType.NONE) {
					oFF.XObjectExt.release(mappingIterator);
					oFF.BlendingValidation
							.addError(
									messageManager,
									oFF.BlendingConstants.ERROR_INVALID_BLENDING_DEFINITION,
									"Constant Mappings are only allowed for ALL_DATA or NONE links",
									mapping);
					return false;
				}
			}
			oFF.XObjectExt.release(mappingIterator);
			return true;
		},
		assertMandatoryJoinTypes : function(blendingDefinition, messageManager) {
			var containsJoin = false;
			var containsUnion = false;
			var mappings = blendingDefinition.getMappings();
			var mappingIterator = mappings.getIterator();
			var mapping;
			while (mappingIterator.hasNext()) {
				mapping = mappingIterator.next();
				if (mapping.getLinkType() === oFF.BlendingLinkType.ALL_DATA
						|| mapping.getLinkType() === oFF.BlendingLinkType.PRIMARY
						|| mapping.getLinkType() === oFF.BlendingLinkType.INTERSECT) {
					containsJoin = true;
				}
				if (mapping.getLinkType() === oFF.BlendingLinkType.COEXIST) {
					containsUnion = true;
				}
				if (containsJoin && containsUnion) {
					return true;
				}
			}
			oFF.XObjectExt.release(mappingIterator);
			if (!containsJoin) {
				oFF.BlendingValidation
						.addError(
								messageManager,
								oFF.BlendingConstants.ERROR_INVALID_BLENDING_DEFINITION,
								"There has to be at least one mapping with linktype 'ALL_DATA', 'PRIMARY' or 'INTERSECT'",
								blendingDefinition);
			}
			if (!containsUnion) {
				oFF.BlendingValidation
						.addError(
								messageManager,
								oFF.BlendingConstants.ERROR_INVALID_BLENDING_DEFINITION,
								"There has to be at least one mapping with linktype 'CO_EXIST'",
								blendingDefinition);
			}
			return false;
		}
	};
	oFF.ServerVersionComparator = {
		compare : function(version1, version2) {
			var versions1 = oFF.ServerVersionComparator.splitVersion(version1);
			var versions2 = oFF.ServerVersionComparator.splitVersion(version2);
			var size = oFF.XMath.max(versions1.size(), versions2.size());
			var i;
			var v1;
			var v2;
			for (i = 0; i < size; i++) {
				v1 = oFF.ServerVersionComparator.getVersionPart(versions1, i);
				v2 = oFF.ServerVersionComparator.getVersionPart(versions2, i);
				if (v1 > v2) {
					return -1;
				}
				if (v1 < v2) {
					return 1;
				}
			}
			return 0;
		},
		splitVersion : function(version) {
			if (oFF.isNull(version)) {
				return oFF.XListOfString.create();
			}
			return oFF.XStringTokenizer.splitString(version, ".");
		},
		getVersionPart : function(versions, i) {
			if (i < versions.size()) {
				return oFF.XInteger.convertFromStringWithDefault(versions
						.get(i), 0);
			}
			return 0;
		}
	};
	oFF.AbstractSpatialClustering = function() {
	};
	oFF.AbstractSpatialClustering.prototype = new oFF.XObject();
	oFF.AbstractSpatialClustering.ORDER = null;
	oFF.AbstractSpatialClustering.prototype.m_clusterField = null;
	oFF.AbstractSpatialClustering.prototype.m_isActive = false;
	oFF.AbstractSpatialClustering.prototype.m_parameters = null;
	oFF.AbstractSpatialClustering.prototype.setup = function() {
		if (oFF.isNull(oFF.AbstractSpatialClustering.ORDER)) {
			this.createOrder();
		}
		this.m_parameters = oFF.XHashMapByString.create();
		this.m_isActive = true;
	};
	oFF.AbstractSpatialClustering.prototype.createOrder = function() {
		var dbScanParameter;
		var gridParameter;
		var kMeansParameter;
		oFF.AbstractSpatialClustering.ORDER = oFF.XHashMapByString.create();
		dbScanParameter = oFF.XArrayOfString.create(2);
		dbScanParameter.set(0, "EPS");
		dbScanParameter.set(1, "MinPoints");
		oFF.AbstractSpatialClustering.ORDER.put(oFF.ClusterAlgorithm.DB_SCAN
				.getName(), dbScanParameter);
		gridParameter = oFF.XArrayOfString.create(6);
		gridParameter.set(0, "XCells");
		gridParameter.set(1, "YCells");
		gridParameter.set(2, "XLowerBound");
		gridParameter.set(3, "YLowerBound");
		gridParameter.set(4, "XUpperBound");
		gridParameter.set(5, "YUpperBound");
		oFF.AbstractSpatialClustering.ORDER.put(oFF.ClusterAlgorithm.GRID
				.getName(), gridParameter);
		kMeansParameter = oFF.XArrayOfString.create(4);
		kMeansParameter.set(0, "Clusters");
		kMeansParameter.set(1, "MaxIterations");
		kMeansParameter.set(2, "Threshold");
		kMeansParameter.set(3, "Init");
		oFF.AbstractSpatialClustering.ORDER.put(oFF.ClusterAlgorithm.K_MEANS
				.getName(), kMeansParameter);
	};
	oFF.AbstractSpatialClustering.prototype.isEqualTo = function(other) {
		var xOther;
		if (oFF.isNull(other)) {
			return false;
		}
		if (this === other) {
			return true;
		}
		xOther = other;
		if (xOther.getClusterAlgorithm() !== this.getClusterAlgorithm()) {
			return false;
		}
		if (xOther.isActive() !== this.isActive()) {
			return false;
		}
		if (xOther.getClusterField() !== this.getClusterField()) {
			return false;
		}
		return this.areParametersEqual(oFF.AbstractSpatialClustering.ORDER
				.getByKey(xOther.getClusterAlgorithm().getName()), this
				.getParameters(), xOther.getParameters());
	};
	oFF.AbstractSpatialClustering.prototype.areParametersEqual = function(
			order, thisParameter, otherParameter) {
		var i;
		var name;
		var thisValue;
		for (i = 0; i < order.size(); i++) {
			name = order.get(i);
			if (thisParameter.containsKey(name) !== otherParameter
					.containsKey(name)) {
				return false;
			}
			thisValue = thisParameter.getByKey(name);
			if (oFF.notNull(thisValue)) {
				if (!thisValue.isEqualTo(otherParameter.getByKey(name))) {
					return false;
				}
			}
		}
		return true;
	};
	oFF.AbstractSpatialClustering.prototype.releaseObject = function() {
		this.m_parameters = oFF.XObjectExt.release(this.m_parameters);
		this.m_clusterField = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.AbstractSpatialClustering.prototype.getClusterField = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_clusterField);
	};
	oFF.AbstractSpatialClustering.prototype.getParameters = function() {
		return this.m_parameters;
	};
	oFF.AbstractSpatialClustering.prototype.isActive = function() {
		return this.m_isActive;
	};
	oFF.AbstractSpatialClustering.prototype.setActive = function(isActive) {
		this.m_isActive = isActive;
	};
	oFF.AbstractSpatialClustering.prototype.setClusterField = function(field) {
		oFF.XObjectExt.checkNotNull(field,
				"The cluster field must not be null!");
		if (!field.getValueType().isSpatial()) {
			throw oFF.XException
					.createIllegalArgumentException("The cluster field must be spatial!");
		}
		this.m_clusterField = oFF.XWeakReferenceUtil.getWeakRef(field);
	};
	oFF.HierarchyPathUtil = {
		PATH_ELEMENT_NAME : "Name",
		PATH_ELEMENT_DESCRIPTION : "Description",
		PATH_ELEMENT_UNIQUE_NAME : "UniqueName",
		getPathField : function(queryModel, dimensionName) {
			var dimension;
			var pathFieldName;
			if (oFF.isNull(queryModel)) {
				return null;
			}
			if (!queryModel.getQueryManager().supportsHierarchyPath()) {
				return null;
			}
			dimension = queryModel.getDimensionByName(dimensionName);
			if (oFF.isNull(dimension)) {
				return null;
			}
			pathFieldName = oFF.XStringUtils.concatenate3("[", dimension
					.getName(), "].path");
			return dimension.getFieldByName(pathFieldName);
		},
		addPathFieldToResultSet : function(queryModel, dimensionName,
				asHiddenField) {
			var field = oFF.HierarchyPathUtil.getPathField(queryModel,
					dimensionName);
			var convenienceCommands;
			var hiddenField;
			if (oFF.isNull(field)) {
				return null;
			}
			convenienceCommands = queryModel.getConvenienceCommands();
			if (asHiddenField) {
				hiddenField = convenienceCommands.clearFieldFromResultSet(
						dimensionName, field.getName());
				if (oFF.notNull(hiddenField)) {
					hiddenField.setAlwaysRequested(true);
				}
			} else {
				convenienceCommands.addFieldToResultSet(dimensionName, field
						.getName());
			}
			return field;
		},
		getPathStructureFromDimensionMember : function(dimensionMember) {
			var dimension = dimensionMember.getDimension();
			var pathField = oFF.HierarchyPathUtil.getPathField(dimension
					.getQueryModel(), dimension.getName());
			var fieldValue;
			var pathValues;
			if (oFF.isNull(pathField)) {
				return null;
			}
			fieldValue = dimensionMember.getFieldValue(pathField);
			if (oFF.isNull(fieldValue)) {
				return null;
			}
			if (fieldValue.getValueType() !== oFF.XValueType.STRING) {
				throw oFF.XException
						.createIllegalStateException("illegal value type");
			}
			pathValues = fieldValue.getString();
			return oFF.HierarchyPathUtil.parsePathValues(pathValues);
		},
		parsePathValues : function(pathValues) {
			var stringToParse;
			var sb;
			var jsonParser;
			var jsonElement;
			if (oFF.XStringUtils.isNullOrEmpty(pathValues)) {
				return null;
			}
			if (oFF.XString.endsWith(pathValues, '"}')) {
				sb = oFF.XStringBuffer.create();
				sb.append(oFF.XStringUtils.stripRight(pathValues, 2));
				sb.append("}");
				stringToParse = sb.toString();
			} else {
				stringToParse = pathValues;
			}
			jsonParser = oFF.JsonParserFactory.newInstance();
			jsonElement = jsonParser.parse(stringToParse);
			oFF.MessageUtil.checkNoError(jsonParser);
			oFF.XObjectExt.release(jsonParser);
			if (oFF.isNull(jsonElement)) {
				return null;
			}
			oFF.XBooleanUtils.checkTrue(
					jsonElement.getType() === oFF.PrElementType.STRUCTURE,
					"JSON string is not a structure");
			return jsonElement;
		}
	};
	oFF.HierarchyCatalogUtil = {
		supportsHierarchyCatalog : function(systemDescription) {
			var application;
			var connectionPool;
			var connectionContainer;
			var allOpenConnections;
			if (oFF.isNull(systemDescription)) {
				return false;
			}
			application = systemDescription.getApplication();
			if (oFF.isNull(application)) {
				return false;
			}
			connectionPool = application.getConnectionPool();
			if (oFF.isNull(connectionPool)) {
				return false;
			}
			allOpenConnections = connectionPool
					.getOpenConnections(systemDescription.getSystemName());
			if (allOpenConnections.hasElements()) {
				connectionContainer = allOpenConnections.get(0);
			} else {
				connectionContainer = connectionPool
						.getConnection(systemDescription.getSystemName());
			}
			return oFF.isNull(connectionContainer) ? false
					: connectionContainer
							.supportsAnalyticCapability("HierarchyCatalog");
		},
		getHierarchyItems : function(catalogResult) {
			var result = oFF.XList.create();
			var iterator;
			if (oFF.notNull(catalogResult)) {
				iterator = catalogResult.getObjectsIterator();
				while (iterator.hasNext()) {
					result.add(iterator.next().clone());
				}
				oFF.XObjectExt.release(iterator);
			}
			return result;
		},
		getHierarchyNames : function(catalogResult) {
			var result = oFF.XListOfString.create();
			var iterator;
			var key;
			if (oFF.notNull(catalogResult)) {
				iterator = catalogResult.getObjectsIterator();
				while (iterator.hasNext()) {
					key = iterator.next().getHierarchyName();
					if (!result.contains(key)) {
						result.add(key);
					}
				}
				oFF.XObjectExt.release(iterator);
			}
			return result;
		},
		getVersionNames : function(catalogResult) {
			var result = oFF.XListOfString.create();
			var iterator;
			var key;
			if (oFF.notNull(catalogResult)) {
				iterator = catalogResult.getObjectsIterator();
				while (iterator.hasNext()) {
					key = iterator.next().getVersionName();
					if (!result.contains(key)) {
						result.add(key);
					}
				}
				oFF.XObjectExt.release(iterator);
			}
			return result;
		}
	};
	oFF.DimensionUsageAnalyzer = {
		setupHeuristic : function(queryModel, usedDimensions) {
			oFF.DimensionUsageAnalyzer.addDimensionsUsedInExceptions(
					queryModel, usedDimensions);
			oFF.DimensionUsageAnalyzer.addDimensionsUsedByVariables(queryModel,
					usedDimensions);
			oFF.DimensionUsageAnalyzer.addDimensionsUsedBySorting(queryModel,
					usedDimensions);
			oFF.DimensionUsageAnalyzer.addDimensionsUsedByMembers(
					usedDimensions, queryModel.getMeasureDimension());
			oFF.DimensionUsageAnalyzer.addDimensionsUsedByMembers(
					usedDimensions, queryModel.getNonMeasureDimension());
			oFF.DimensionUsageAnalyzer.addDimensionsUsedByMembers(
					usedDimensions, queryModel.getNonMeasureDimension2());
			oFF.DimensionUsageAnalyzer.addDimensionsUsedByMembers(
					usedDimensions, queryModel
							.getDimensionByType(oFF.DimensionType.ACCOUNT));
			oFF.DimensionUsageAnalyzer.addDimensionsUsedInDrillNavigations(
					queryModel, usedDimensions);
			oFF.DimensionUsageAnalyzer.addDimensionsUsedInFilters(queryModel,
					usedDimensions);
			oFF.DimensionUsageAnalyzer
					.addDimensionsUsedInUniversalDisplayHierarchies(queryModel,
							usedDimensions);
		},
		addDimensionsUsedInDrillNavigations : function(queryModel,
				usedDimensions) {
			var drillOperations = queryModel.getDrillManager()
					.getDrillOperations();
			var size = drillOperations.size();
			var i;
			var targetDimension;
			for (i = 0; i < size; i++) {
				targetDimension = drillOperations.get(i).getTargetDimension();
				if (oFF.notNull(targetDimension)) {
					usedDimensions.add(targetDimension.getName());
				}
			}
		},
		addDimensionsUsedInContainer : function(container, usedDimensions) {
			var cartesianProduct;
			var complexSelectionRoot;
			var sizeCp;
			var i;
			if (oFF.isNull(container)) {
				return;
			}
			cartesianProduct = container.getCartesianProduct();
			complexSelectionRoot = container.getComplexRoot();
			if (oFF.notNull(cartesianProduct)) {
				sizeCp = cartesianProduct.size();
				for (i = 0; i < sizeCp; i++) {
					usedDimensions.add(cartesianProduct.getCartesianChild(i)
							.getDimension().getName());
				}
			} else {
				if (oFF.notNull(complexSelectionRoot)) {
					oFF.DimensionUsageAnalyzer
							.addDimensionsUsedInComplexContainer(
									complexSelectionRoot, usedDimensions);
				}
			}
		},
		addDimensionsUsedInComplexContainer : function(complexSelectionRoot,
				usedDimensions) {
			var componentType = complexSelectionRoot.getComponentType();
			var filterOp;
			var dimension;
			var filterAlgebra;
			var filterSize;
			var idxAnd;
			var complexCartesianList;
			if (componentType === oFF.FilterComponentType.OPERATION) {
				filterOp = complexSelectionRoot;
				dimension = filterOp.getDimension();
				if (oFF.notNull(dimension)) {
					usedDimensions.add(dimension.getName());
				}
			} else {
				if (componentType === oFF.FilterComponentType.AND
						|| componentType === oFF.FilterComponentType.OR) {
					filterAlgebra = complexSelectionRoot;
					filterSize = filterAlgebra.size();
					for (idxAnd = 0; idxAnd < filterSize; idxAnd++) {
						oFF.DimensionUsageAnalyzer
								.addDimensionsUsedInComplexContainer(
										filterAlgebra.get(idxAnd),
										usedDimensions);
					}
				} else {
					if (componentType === oFF.FilterComponentType.CARTESIAN_LIST) {
						complexCartesianList = complexSelectionRoot;
						usedDimensions.add(complexCartesianList.getDimension()
								.getName());
					}
				}
			}
		},
		addDimensionsUsedInExceptions : function(queryModel, usedDimensions) {
			var exceptionManager = queryModel.getExceptionManager();
			var sizeEx = exceptionManager.size();
			var idxEx;
			var exception;
			var measure;
			var structure;
			var evaluates;
			var sizeEva;
			var idxEva;
			for (idxEx = 0; idxEx < sizeEx; idxEx++) {
				exception = exceptionManager.get(idxEx);
				measure = exception.getMeasure();
				if (oFF.notNull(measure)) {
					usedDimensions.add(measure.getDimension().getName());
				}
				structure = exception.getStructure();
				if (oFF.notNull(structure)) {
					usedDimensions.add(structure.getDimension().getName());
				}
				evaluates = exception.getEvaluates();
				sizeEva = evaluates.size();
				for (idxEva = 0; idxEva < sizeEva; idxEva++) {
					usedDimensions.add(evaluates.get(idxEva).getDimension()
							.getName());
				}
			}
		},
		addDimensionsUsedByVariables : function(queryModel, usedDimensions) {
			var variables = queryModel.getVariables();
			var sizeVar = variables.size();
			var idxVar;
			var curVar;
			for (idxVar = 0; idxVar < sizeVar; idxVar++) {
				curVar = variables.get(idxVar);
				if (curVar.getVariableType().isTypeOf(
						oFF.VariableType.DIMENSION_MEMBER_VARIABLE)) {
					usedDimensions.add(curVar.getDimension().getName());
				}
			}
		},
		addDimensionsUsedBySorting : function(queryModel, usedDimensions) {
			var sortingManager = queryModel.getSortingManager();
			var sortingOperations = sortingManager.getSortingOperations();
			var size = sortingOperations.size();
			var i;
			var genericSorting;
			var sortingType;
			var dimension;
			for (i = 0; i < size; i++) {
				genericSorting = sortingOperations.get(i);
				sortingType = genericSorting.getSortingType();
				if (sortingType === oFF.SortType.MEASURE
						|| sortingType === oFF.SortType.DATA_CELL_VALUE
						|| genericSorting.getOlapComponentType().isTypeOf(
								oFF.OlapComponentType.DIMENSION_SORTING)) {
					dimension = sortingOperations.get(i).getDimension();
					if (oFF.notNull(dimension)) {
						usedDimensions.add(dimension.getName());
					}
				}
			}
		},
		addDimensionsUsedByMembers : function(usedDimensions, dimension) {
			var allStructureMembers;
			var size;
			var i;
			var member;
			var filter;
			if (oFF.notNull(dimension)) {
				allStructureMembers = dimension.getAllStructureMembers();
				if (oFF.notNull(allStructureMembers)) {
					size = allStructureMembers.size();
					for (i = 0; i < size; i++) {
						member = allStructureMembers.get(i);
						if (member.getMemberType() === oFF.MemberType.RESTRICTED_MEASURE) {
							filter = member.getFilter();
							if (oFF.isNull(filter)) {
								continue;
							}
							if (filter.isComplexFilter()) {
								oFF.DimensionUsageAnalyzer
										.addDimensionsUsedByRestrictedMember(
												filter.getComplexRoot(),
												usedDimensions);
							} else {
								if (filter.isCartesianProduct()) {
									oFF.DimensionUsageAnalyzer
											.addDimensionsUsedByRestrictedMember(
													filter
															.getCartesianProduct(),
													usedDimensions);
								}
							}
						} else {
							if (member.getMemberType() === oFF.MemberType.FORMULA) {
								oFF.DimensionUsageAnalyzer
										.addDimensionsUsedByFormulaMember(
												member.getFormula(),
												usedDimensions, dimension
														.getQueryModel());
							}
						}
					}
				}
			}
		},
		addDimensionsUsedByRestrictedMember : function(complexSelectionRoot,
				usedDimensions) {
			var componentType = complexSelectionRoot.getComponentType();
			var filterOp;
			var filterAlgebra;
			var filterSize;
			var idxAnd;
			var complexCartesianList;
			var cartesianProduct;
			var productSize;
			var idxProduct;
			if (componentType === oFF.FilterComponentType.OPERATION) {
				filterOp = complexSelectionRoot;
				usedDimensions.add(filterOp.getDimension().getName());
			} else {
				if (componentType === oFF.FilterComponentType.OR
						|| componentType === oFF.FilterComponentType.AND) {
					filterAlgebra = complexSelectionRoot;
					filterSize = filterAlgebra.size();
					for (idxAnd = 0; idxAnd < filterSize; idxAnd++) {
						oFF.DimensionUsageAnalyzer
								.addDimensionsUsedByRestrictedMember(
										filterAlgebra.get(idxAnd),
										usedDimensions);
					}
				} else {
					if (componentType === oFF.FilterComponentType.CARTESIAN_LIST) {
						complexCartesianList = complexSelectionRoot;
						usedDimensions.add(complexCartesianList.getDimension()
								.getName());
					} else {
						if (componentType === oFF.FilterComponentType.CARTESIAN_PRODUCT) {
							cartesianProduct = complexSelectionRoot;
							productSize = cartesianProduct.size();
							for (idxProduct = 0; idxProduct < productSize; idxProduct++) {
								oFF.DimensionUsageAnalyzer
										.addDimensionsUsedByRestrictedMember(
												cartesianProduct
														.get(idxProduct),
												usedDimensions);
							}
						}
					}
				}
			}
		},
		addDimensionsUsedByFormulaMember : function(formula, usedDimensions,
				queryModel) {
			var formulaType;
			var fieldName;
			var dimensionName;
			var formulaFunction;
			var size;
			var i;
			var formulaOp;
			if (oFF.isNull(formula)) {
				return;
			}
			formulaType = formula.getOlapComponentType();
			if (formulaType === oFF.OlapComponentType.FORMULA_ITEM_ATTRIBUTE) {
				fieldName = formula.getFieldName();
				usedDimensions.add(queryModel.getFieldByName(fieldName)
						.getDimension().getName());
			} else {
				if (formulaType === oFF.OlapComponentType.FORMULA_ITEM_MEMBER) {
					dimensionName = formula.getDimensionName();
					if (oFF.notNull(dimensionName)) {
						usedDimensions.add(dimensionName);
					}
				} else {
					if (formulaType === oFF.OlapComponentType.FORMULA_FUNCTION) {
						formulaFunction = formula;
						size = formulaFunction.size();
						for (i = 0; i < size; i++) {
							oFF.DimensionUsageAnalyzer
									.addDimensionsUsedByFormulaMember(
											formulaFunction.get(i),
											usedDimensions, queryModel);
						}
					} else {
						if (formulaType === oFF.OlapComponentType.FORMULA_OPERATION) {
							formulaOp = formula;
							if (formulaOp.getRightSide() !== null) {
								oFF.DimensionUsageAnalyzer
										.addDimensionsUsedByFormulaMember(
												formulaOp.getRightSide(),
												usedDimensions, queryModel);
							}
							if (formulaOp.getLeftSide() !== null) {
								oFF.DimensionUsageAnalyzer
										.addDimensionsUsedByFormulaMember(
												formulaOp.getLeftSide(),
												usedDimensions, queryModel);
							}
						}
					}
				}
			}
		},
		addDimensionsUsedInFilters : function(queryModel, usedDimensions) {
			var filter = queryModel.getFilter();
			var layeredFilters;
			var layeredVisibilityFilters;
			if (filter.isFixedFilterInitialized()) {
				oFF.DimensionUsageAnalyzer.addDimensionsUsedInContainer(filter
						.getFixedFilter(), usedDimensions);
			}
			if (filter.isDynamicFilterInitialized()) {
				oFF.DimensionUsageAnalyzer.addDimensionsUsedInContainer(filter
						.getDynamicFilter(), usedDimensions);
			}
			layeredFilters = filter.getLayeredFilters().getIterator();
			while (layeredFilters.hasNext()) {
				oFF.DimensionUsageAnalyzer.addDimensionsUsedInContainer(
						layeredFilters.next(), usedDimensions);
			}
			if (filter.isVisibilityFilterInitialized()) {
				oFF.DimensionUsageAnalyzer.addDimensionsUsedInContainer(filter
						.getVisibilityFilter(), usedDimensions);
			}
			layeredVisibilityFilters = filter.getLayeredVisibilityFilters()
					.getIterator();
			while (layeredVisibilityFilters.hasNext()) {
				oFF.DimensionUsageAnalyzer.addDimensionsUsedInContainer(
						layeredVisibilityFilters.next(), usedDimensions);
			}
		},
		addDimensionsUsedInUniversalDisplayHierarchies : function(queryModel,
				usedDimensions) {
			var universalDisplayHierarchies = queryModel
					.getUniversalDisplayHierarchies();
			var hierarchies = universalDisplayHierarchies.getHierarchies();
			var size = hierarchies.size();
			var i;
			var udh;
			var targetDimension;
			for (i = 0; i < size; i++) {
				udh = hierarchies.get(i);
				targetDimension = queryModel.getDimensionByName(udh.getName());
				if (oFF.notNull(targetDimension)) {
					usedDimensions.add(targetDimension.getName());
					usedDimensions.addAll(udh.getDimensionNames());
				}
			}
		},
		addDimensionsUsedByLeveledHierarchies : function(queryModel,
				usedDimensions) {
			var referenceSet = usedDimensions.createSetCopy();
			var dimensionNames = referenceSet.getValuesAsReadOnlyListOfString();
			var numberOfDims = dimensionNames.size();
			var i;
			var dimName;
			var dimension;
			var leveledHierarchies;
			var numberOfHierarchies;
			var hierarchy;
			var leveledHierarchy;
			var allLevel;
			var numberOfLevels;
			var level;
			var hierarchyLevel;
			for (i = 0; i < numberOfDims; i++) {
				dimName = dimensionNames.get(i);
				dimension = queryModel.getDimensionByName(dimName);
				if (oFF.XCollectionUtils.hasElements(dimension
						.getLeveledHierarchies())) {
					leveledHierarchies = dimension.getLeveledHierarchies();
					numberOfHierarchies = leveledHierarchies.size();
					for (hierarchy = 0; hierarchy < numberOfHierarchies; hierarchy++) {
						leveledHierarchy = leveledHierarchies.get(hierarchy);
						allLevel = leveledHierarchy.getAllLevel();
						numberOfLevels = allLevel.size();
						for (level = 0; level < numberOfLevels; level++) {
							hierarchyLevel = allLevel.get(level);
							usedDimensions.add(hierarchyLevel
									.getLevelDimensionName());
						}
					}
				}
			}
		}
	};
	oFF.QFactory = {
		s_factory : null,
		_getInstance : function() {
			return oFF.QFactory.s_factory;
		},
		setInstance : function(factory) {
			oFF.QFactory.s_factory = factory;
		},
		createMemberNavigation : function(memberFunction) {
			return oFF.QFactory.s_factory
					.createMemberNavigation(memberFunction);
		},
		createNavigationParameterWithStringConstant : function(constantValue) {
			return oFF.QFactory.s_factory
					.createNavigationParameterWithStringConstant(constantValue);
		},
		createNavigationParameterWithIntegerConstant : function(constantValue) {
			return oFF.QFactory.s_factory
					.createNavigationParameterWithIntegerConstant(constantValue);
		},
		createNavigationParameterWithLevelLiteral : function(levelValue) {
			return oFF.QFactory.s_factory
					.createNavigationParameterWithLevelLiteral(levelValue);
		},
		createNavigationParameterWithLevelNumber : function(levelValue) {
			return oFF.QFactory.s_factory
					.createNavigationParameterWithLevelNumber(levelValue);
		},
		createNavigationParameterWithMemberName : function(fqnName) {
			return oFF.QFactory.s_factory
					.createNavigationParameterWithMemberName(fqnName);
		},
		createNavigationParameterWithShift : function(levelValue, constantValue) {
			return oFF.QFactory.s_factory.createNavigationParameterWithShift(
					levelValue, constantValue);
		},
		createNavigationParameterWithRange : function(levelValue, offsetLow,
				offsetHigh) {
			return oFF.QFactory.s_factory.createNavigationParameterWithRange(
					levelValue, offsetLow, offsetHigh);
		},
		createNavigationParameterWithNoValuesAboveLevel : function(
				maxLevelValue) {
			return oFF.QFactory.s_factory
					.createNavigationParameterWithNoValuesAboveLevel(maxLevelValue);
		},
		newFormulaConstant : function(context) {
			return oFF.QFactory.s_factory.newFormulaConstant(context);
		},
		newFormulaConstantWithStringValue : function(context, stringValue) {
			var newStringConstant = oFF.QFactory.newFormulaConstant(context);
			newStringConstant.setString(stringValue);
			return newStringConstant;
		},
		newFormulaConstantWithIntValue : function(context, intValue) {
			var newIntConstant = oFF.QFactory.newFormulaConstant(context);
			newIntConstant.setInteger(intValue);
			return newIntConstant;
		},
		newFormulaConstantWithDoubleValue : function(context, doubleValue) {
			var newDobuleConstant = oFF.QFactory.newFormulaConstant(context);
			newDobuleConstant.setDouble(doubleValue);
			return newDobuleConstant;
		},
		newFormulaOperation : function(context) {
			return oFF.QFactory.s_factory.newFormulaOperationExt(context);
		},
		newFormulaAttributeWithName : function(context, fieldName) {
			var newFormulaAttribute = oFF.QFactory.s_factory
					.newFormulaAttributeExt(context);
			newFormulaAttribute.setFieldByName(fieldName);
			return newFormulaAttribute;
		},
		newFormulaFunction : function(context) {
			return oFF.QFactory.s_factory.newFormulaFunction(context);
		},
		newFieldValue : function(field, valueException, value, formattedValue) {
			return oFF.QFactory.s_factory.newFieldValue(field, valueException,
					value, formattedValue);
		},
		newFieldValueEmpty : function(field, valueException) {
			return oFF.QFactory.s_factory.newFieldValueEmpty(field,
					valueException);
		},
		newField : function(context, fieldName) {
			return oFF.QFactory.s_factory.newField(context, fieldName);
		},
		newFormulaFunctionWithName : function(context, functionName) {
			var newFormulaFunction = oFF.QFactory.newFormulaFunction(context);
			newFormulaFunction.setFunctionName(functionName);
			return newFormulaFunction;
		},
		newFormulaMember : function(context) {
			return oFF.QFactory.s_factory.newFormulaMember(context);
		},
		newFormulaMemberWithName : function(context, memberName) {
			var newFormulaMember = oFF.QFactory.newFormulaMember(context);
			newFormulaMember.setMemberName(memberName);
			return newFormulaMember;
		},
		newFilterAnd : function(context) {
			return oFF.QFactory.s_factory.newFilterAnd(context);
		},
		newFilterTuple : function(context) {
			oFF.XBooleanUtils.checkTrue(context.getQueryModel()
					.supportsTuplesOperand(), "TupleOperand is not supported!");
			return oFF.QFactory.s_factory.newFilterTupleExt(context);
		},
		newFilterOr : function(context) {
			return oFF.QFactory.s_factory.newFilterOr(context);
		},
		newFilterNot : function(context) {
			return oFF.QFactory.s_factory.newFilterNot(context);
		},
		getContextAsFilterExpression : function(context) {
			var componentType;
			if (oFF.notNull(context)) {
				componentType = context.getComponentType();
				if (componentType === oFF.OlapComponentType.FILTER_EXPRESSION) {
					return context;
				}
			}
			return null;
		},
		newFilterOperation : function(context, field) {
			return oFF.QFactory.newFilterOperationWithOperator(context, field,
					oFF.ComparisonOperator.EQUAL);
		},
		newFilterOperationWithOperator : function(context, field, operator) {
			var filterExpression = oFF.QFactory
					.getContextAsFilterExpression(context);
			var filterOperation = oFF.QFactory.s_factory.newFilterOperation(
					context, filterExpression);
			filterOperation.setField(field);
			filterOperation.setComparisonOperator(operator);
			return filterOperation;
		},
		newCellValueOperand : function(context) {
			var filterExpression = oFF.QFactory
					.getContextAsFilterExpression(context);
			var cellValueOperand = oFF.QFactory.s_factory.newCellValueOperand(
					context, filterExpression);
			return cellValueOperand;
		},
		newFilterCartesianElement : function(context) {
			return oFF.QFactory.s_factory.newFilterCartesianElement(context);
		},
		newFilterCartesianProduct : function(context) {
			var filterExpression = oFF.QFactory
					.getContextAsFilterExpression(context);
			return oFF.QFactory.s_factory.newFilterCartesianProduct(context,
					filterExpression);
		},
		newFilterCartesianList : function(context) {
			var filterExpression = oFF.QFactory
					.getContextAsFilterExpression(context);
			return oFF.QFactory.s_factory.newFilterCartesianList(context,
					filterExpression);
		},
		newFilterCartesianListWithField : function(context, field) {
			var filterCartesianList = oFF.QFactory
					.newFilterCartesianList(context);
			filterCartesianList.setField(field);
			return filterCartesianList;
		},
		newDimensionElement : function(selectField, hierarchyName, value) {
			return oFF.QFactory.s_factory.newDimensionElement(selectField,
					hierarchyName, value);
		},
		newDimensionMemberFromTupleElement : function(tupleElement) {
			return oFF.QFactory.s_factory
					.newDimensionMemberFromTupleElement(tupleElement);
		},
		newDrillPathElement : function(context, name, dimension) {
			var drillPathElement = oFF.QFactory.s_factory
					.newDrillPathElementExt(context);
			drillPathElement.setDimension(dimension);
			drillPathElement.setName(name);
			return drillPathElement;
		},
		newFilterDynamicVariables : function(context, dataSource) {
			var virtualDataSource;
			oFF.XBooleanUtils.checkTrue(context.getQueryModel()
					.supportsDynamicVariableRefresh(),
					"Refresh of dynamic variables is not supported.");
			virtualDataSource = oFF.QFactory.s_factory
					.newFilterVirtualDatasource(context);
			virtualDataSource.setDetails(dataSource.getSchemaName(), dataSource
					.getPackageName(), dataSource.getObjectName());
			return virtualDataSource;
		},
		newAggregationLevel : function(context, name) {
			return oFF.QFactory.s_factory.newAggregationLevelExt(context, name);
		},
		newDataSourceExt : function(context) {
			return oFF.QFactory.s_factory.newDataSource(context);
		},
		newDataSource : function() {
			return oFF.QFactory.s_factory.newDataSource(null);
		},
		newDrillManager : function(context) {
			return oFF.QFactory.s_factory.newDrillManager(context);
		},
		newUniversalDisplayHierarchies : function(context) {
			return oFF.QFactory.s_factory
					.newUniversalDisplayHierarchies(context);
		},
		newVizDef : function(context) {
			return oFF.QFactory.s_factory.newVizDef(context);
		}
	};
	oFF.InactiveCapabilityUtil = function() {
	};
	oFF.InactiveCapabilityUtil.prototype = new oFF.XObject();
	oFF.InactiveCapabilityUtil.assertVersionValid = function(
			experimentalFeature, activeVersion) {
		var maxXVersion = experimentalFeature.getMaxXVersion();
		var message;
		if (maxXVersion > -1 && maxXVersion < activeVersion) {
			message = oFF.XStringBuffer.create();
			message.append("The capability '").append(
					experimentalFeature.getName()).append(
					"' is already released in the currently active XVersion!");
			message.append("\nActive XVersion: ").appendInt(activeVersion);
			message.append("\nWas released in XVersion: ").appendInt(
					experimentalFeature.getMaxXVersion());
			throw oFF.XException.createIllegalArgumentException(message
					.toString());
		}
	};
	oFF.InactiveCapabilityUtil.exportInactiveCapabilities = function(
			inactiveCapabilities) {
		var buffer;
		var keysAsIteratorOfString;
		var firstEntry;
		if (oFF.isNull(inactiveCapabilities)) {
			return null;
		}
		buffer = oFF.XStringBuffer.create();
		keysAsIteratorOfString = inactiveCapabilities
				.getKeysAsIteratorOfString();
		firstEntry = true;
		while (keysAsIteratorOfString.hasNext()) {
			if (!firstEntry) {
				buffer.append(",");
			}
			buffer.append(keysAsIteratorOfString.next());
			firstEntry = false;
		}
		return buffer.toString();
	};
	oFF.ChartRendererFactory = {
		s_factory : null,
		setInstance : function(factory) {
			oFF.ChartRendererFactory.s_factory = factory;
		},
		createRenderer : function(protocolType) {
			return oFF.ChartRendererFactory.s_factory
					.createRenderer(protocolType);
		}
	};
	oFF.ChartRendererFactoryDummyImpl = function() {
	};
	oFF.ChartRendererFactoryDummyImpl.prototype = new oFF.XObject();
	oFF.ChartRendererFactoryDummyImpl.create = function() {
		return new oFF.ChartRendererFactoryDummyImpl();
	};
	oFF.ChartRendererFactoryDummyImpl.prototype.createRenderer = function(
			protocolType) {
		return null;
	};
	oFF.ReferenceGridFactory = {
		s_factory : null,
		setInstance : function(factory) {
			oFF.ReferenceGridFactory.s_factory = factory;
		},
		createReferenceGridSimple : function(resultSet) {
			return oFF.ReferenceGridFactory.s_factory
					.createReferenceGridSimple(resultSet);
		},
		createReferenceGridWithDetails : function(resultSet) {
			return oFF.ReferenceGridFactory.s_factory
					.createReferenceGridWithDetails(resultSet);
		},
		createReferenceGrid : function(resultSet, withDetails) {
			return oFF.ReferenceGridFactory.s_factory.createReferenceGrid(
					resultSet, withDetails);
		},
		createReferenceGridWithName : function(name, resultSet) {
			return oFF.ReferenceGridFactory.s_factory
					.createReferenceGridWithName(name, resultSet);
		},
		createReferenceGridWithNameAndDetails : function(name, resultSet) {
			return oFF.ReferenceGridFactory.s_factory
					.createReferenceGridWithNameAndDetails(name, resultSet);
		},
		createForVizGrid : function(resultSet) {
			return oFF.ReferenceGridFactory.s_factory
					.createForVizGrid(resultSet);
		}
	};
	oFF.ReferenceGridFactoryDummyImpl = function() {
	};
	oFF.ReferenceGridFactoryDummyImpl.prototype = new oFF.XObject();
	oFF.ReferenceGridFactoryDummyImpl.create = function() {
		return new oFF.ReferenceGridFactoryDummyImpl();
	};
	oFF.ReferenceGridFactoryDummyImpl.prototype.createReferenceGridSimple = function(
			resultSet) {
		return null;
	};
	oFF.ReferenceGridFactoryDummyImpl.prototype.createReferenceGridWithDetails = function(
			resultSet) {
		return null;
	};
	oFF.ReferenceGridFactoryDummyImpl.prototype.createReferenceGrid = function(
			resultSet, withDetails) {
		return null;
	};
	oFF.ReferenceGridFactoryDummyImpl.prototype.createReferenceGridWithName = function(
			name, resultSet) {
		return null;
	};
	oFF.ReferenceGridFactoryDummyImpl.prototype.createReferenceGridWithNameAndDetails = function(
			name, resultSet) {
		return null;
	};
	oFF.ReferenceGridFactoryDummyImpl.prototype.createForVizGrid = function(
			resultSet) {
		return null;
	};
	oFF.BlendingAttributeMapping = function() {
	};
	oFF.BlendingAttributeMapping.prototype = new oFF.AbstractBlendingMapping();
	oFF.BlendingAttributeMapping.create = function(attributeName, isLinkKey,
			blendingDefinition) {
		var mapping = new oFF.BlendingAttributeMapping();
		mapping.setupExt(attributeName, isLinkKey, blendingDefinition);
		return mapping;
	};
	oFF.BlendingAttributeMapping.prototype.m_attributeMappings = null;
	oFF.BlendingAttributeMapping.prototype.m_attributeName = null;
	oFF.BlendingAttributeMapping.prototype.m_constantMappings = null;
	oFF.BlendingAttributeMapping.prototype.m_isLinkKey = false;
	oFF.BlendingAttributeMapping.prototype.setupExt = function(attributeName,
			isLinkKey, blendingDefinition) {
		oFF.XStringUtils.checkStringNotEmpty(attributeName,
				"The attribute name must not be null!");
		oFF.XObjectExt.checkNotNull(blendingDefinition,
				"Blending definition must not be null!");
		this.m_attributeMappings = oFF.XList.create();
		this.m_constantMappings = oFF.XList.create();
		this.m_attributeName = attributeName;
		this.m_isLinkKey = isLinkKey;
		oFF.AbstractBlendingMapping.prototype.setupAbstractMapping
				.call(this, oFF.BlendingMappingDefinitionType.ATTRIBUTE,
						blendingDefinition);
	};
	oFF.BlendingAttributeMapping.prototype.addAttributeMappingDefinition = function(
			attributeMappingDefinition) {
		this.m_attributeMappings.add(attributeMappingDefinition);
	};
	oFF.BlendingAttributeMapping.prototype.addNewAttributeDimensionMappingDefinition = function(
			field, queryAliasName) {
		var attributeMappingDefinition = this.newAttributeMappingDefinition(
				field, queryAliasName);
		this.addAttributeMappingDefinition(attributeMappingDefinition);
		return attributeMappingDefinition;
	};
	oFF.BlendingAttributeMapping.prototype.addNewAttributeDimensionMappingDefinitionByName = function(
			fieldName, queryAliasName) {
		var attributeMappingDefinitionByName = this
				.newAttributeMappingDefinitionByName(fieldName, queryAliasName);
		this.addAttributeMappingDefinition(attributeMappingDefinitionByName);
		return attributeMappingDefinitionByName;
	};
	oFF.BlendingAttributeMapping.prototype.addNewAttributeDimensionMappingDefinitionByObject = function(
			field) {
		var attributeMappingDefinition = this
				.newAttributeMappingDefinitionByObject(field);
		this.addAttributeMappingDefinition(attributeMappingDefinition);
		return attributeMappingDefinition;
	};
	oFF.BlendingAttributeMapping.prototype.clone = function() {
		return this.cloneMapping();
	};
	oFF.BlendingAttributeMapping.prototype.cloneMapping = function() {
		var clone = oFF.BlendingAttributeMapping.create(
				this.getAttributeName(), this.isLinkKey(), this
						.getBlendingDefinition());
		var iterator = this.getAttributeMappingDefinitions().getIterator();
		var mappingDefinition;
		var constantMappingIterator;
		var constantMapping;
		while (iterator.hasNext()) {
			mappingDefinition = iterator.next();
			clone.addAttributeMappingDefinition(mappingDefinition
					.cloneMappingDefinition());
		}
		oFF.XObjectExt.release(iterator);
		constantMappingIterator = this.getConstantMappings().getIterator();
		while (constantMappingIterator.hasNext()) {
			constantMapping = constantMappingIterator.next();
			clone.addConstantMapping(constantMapping.cloneMappingDefinition());
		}
		oFF.XObjectExt.release(constantMappingIterator);
		return clone;
	};
	oFF.BlendingAttributeMapping.prototype.getAttributeMappingDefinitions = function() {
		return this.m_attributeMappings;
	};
	oFF.BlendingAttributeMapping.prototype.getConstantMappings = function() {
		return this.m_constantMappings;
	};
	oFF.BlendingAttributeMapping.prototype.getAttributeName = function() {
		return this.m_attributeName;
	};
	oFF.BlendingAttributeMapping.prototype.isEqualTo = function(other) {
		var otherGeneral;
		var xOther;
		if (oFF.isNull(other)) {
			return false;
		}
		if (this === other) {
			return true;
		}
		otherGeneral = other;
		if (this.getMappingDefinitionType() !== otherGeneral
				.getMappingDefinitionType()) {
			return false;
		}
		xOther = other;
		if (!oFF.XString.isEqual(this.getAttributeName(), xOther
				.getAttributeName())) {
			return false;
		}
		if (this.isLinkKey() !== xOther.isLinkKey()) {
			return false;
		}
		if (!this.getAttributeMappingDefinitions().isEqualTo(
				xOther.getAttributeMappingDefinitions())) {
			return false;
		}
		return true;
	};
	oFF.BlendingAttributeMapping.prototype.isLinkKey = function() {
		return this.m_isLinkKey;
	};
	oFF.BlendingAttributeMapping.prototype.newAttributeMappingDefinition = function(
			field, queryAliasName) {
		oFF.BlendingValidation.isFieldValidForBlending(field, null, true);
		return oFF.BlendingMappingDefinition.createAttributeMapping(field
				.getName(), queryAliasName);
	};
	oFF.BlendingAttributeMapping.prototype.newAttributeMappingDefinitionByName = function(
			fieldName, queryAliasName) {
		var blendingQueryModel = this.getBlendingDefinition()
				.getBlendingSourceByAlias(queryAliasName);
		var fieldByName;
		oFF.XObjectExt.checkNotNull(blendingQueryModel, oFF.XStringUtils
				.concatenate3("No Blending source found for alias '",
						queryAliasName, "'!"));
		fieldByName = blendingQueryModel.getFieldByName(fieldName);
		return this.newAttributeMappingDefinition(fieldByName, queryAliasName);
	};
	oFF.BlendingAttributeMapping.prototype.newAttributeMappingDefinitionByObject = function(
			field) {
		var queryAliasName = this.getBlendingDefinition()
				.getBlendingAliasByQueryModel(
						field.getContext().getQueryModel());
		return this.newAttributeMappingDefinition(field, queryAliasName);
	};
	oFF.BlendingAttributeMapping.prototype.addConstantMapping = function(
			constantMapping) {
		this.m_constantMappings.add(constantMapping);
	};
	oFF.BlendingAttributeMapping.prototype.addNewConstantMapping = function(
			memberKey, queryAliasName) {
		var blendingQueryModel = this.getBlendingDefinition()
				.getBlendingSourceByAlias(queryAliasName);
		var newConstantMapping;
		oFF.XObjectExt.checkNotNull(blendingQueryModel, oFF.XStringUtils
				.concatenate3("No Blending source found for alias '",
						queryAliasName, "'!"));
		newConstantMapping = oFF.BlendingConstantMapping.createConstantMapping(
				memberKey, queryAliasName);
		this.addConstantMapping(newConstantMapping);
		return newConstantMapping;
	};
	oFF.BlendingAttributeMapping.prototype.releaseObject = function() {
		this.m_attributeMappings = oFF.XObjectExt
				.release(this.m_attributeMappings);
		this.m_constantMappings = oFF.XObjectExt
				.release(this.m_constantMappings);
		this.m_attributeName = null;
		oFF.AbstractBlendingMapping.prototype.releaseObject.call(this);
	};
	oFF.BlendingAttributeMapping.prototype.removeAttributeMappingDefinitionAt = function(
			indexToRemove) {
		this.m_attributeMappings.removeAt(indexToRemove);
	};
	oFF.BlendingAttributeMapping.prototype.setAttributeName = function(
			attributeName) {
		this.m_attributeName = attributeName;
	};
	oFF.BlendingAttributeMapping.prototype.setIsLinkKey = function(isLinkKey) {
		this.m_isLinkKey = isLinkKey;
	};
	oFF.BlendingMappingDefinition = function() {
	};
	oFF.BlendingMappingDefinition.prototype = new oFF.AbstractBlendingMapping();
	oFF.BlendingMappingDefinition.createDimensionMapping = function(
			dimensionName, queryAliasName) {
		var dimensionMappingDefinition = new oFF.BlendingMappingDefinition();
		dimensionMappingDefinition.setupExt(queryAliasName, dimensionName,
				oFF.BlendingMappingDefinitionType.DIMENSION);
		return dimensionMappingDefinition;
	};
	oFF.BlendingMappingDefinition.createAttributeMapping = function(
			attributeName, queryAliasName) {
		var dimensionMappingDefinition = new oFF.BlendingMappingDefinition();
		dimensionMappingDefinition.setupExt(queryAliasName, attributeName,
				oFF.BlendingMappingDefinitionType.ATTRIBUTE);
		return dimensionMappingDefinition;
	};
	oFF.BlendingMappingDefinition.createConstantMapping = function(memberKey,
			queryAliasName) {
		var dimensionMappingDefinition = new oFF.BlendingMappingDefinition();
		dimensionMappingDefinition.setupExt(queryAliasName, memberKey,
				oFF.BlendingMappingDefinitionType.CONSTANT);
		return dimensionMappingDefinition;
	};
	oFF.BlendingMappingDefinition.prototype.m_queryAliasName = null;
	oFF.BlendingMappingDefinition.prototype.m_memberName = null;
	oFF.BlendingMappingDefinition.prototype.cloneMappingDefinition = function() {
		if (this.getMappingDefinitionType() === oFF.BlendingMappingDefinitionType.ATTRIBUTE) {
			return oFF.BlendingMappingDefinition.createAttributeMapping(this
					.getMemberName(), this.getQueryAliasName());
		}
		if (this.getMappingDefinitionType() === oFF.BlendingMappingDefinitionType.CONSTANT) {
			return oFF.BlendingMappingDefinition.createConstantMapping(this
					.getMemberName(), this.getQueryAliasName());
		}
		return oFF.BlendingMappingDefinition.createDimensionMapping(this
				.getMemberName(), this.getQueryAliasName());
	};
	oFF.BlendingMappingDefinition.prototype.clone = function() {
		return this.cloneMappingDefinition();
	};
	oFF.BlendingMappingDefinition.prototype.setupExt = function(queryAliasName,
			memberName, mappingType) {
		oFF.XStringUtils.checkStringNotEmpty(queryAliasName,
				"Query alias name is null");
		oFF.XStringUtils.checkStringNotEmpty(memberName, "Member name is null");
		oFF.AbstractBlendingMapping.prototype.setupAbstractMapping.call(this,
				mappingType, null);
		this.m_queryAliasName = queryAliasName;
		this.m_memberName = memberName;
	};
	oFF.BlendingMappingDefinition.prototype.releaseObject = function() {
		this.m_queryAliasName = null;
		this.m_memberName = null;
		oFF.AbstractBlendingMapping.prototype.releaseObject.call(this);
	};
	oFF.BlendingMappingDefinition.prototype.isEqualTo = function(other) {
		var otherGeneral;
		var xOther;
		if (oFF.isNull(other)) {
			return false;
		}
		if (this === other) {
			return true;
		}
		otherGeneral = other;
		if (this.getMappingDefinitionType() !== otherGeneral
				.getMappingDefinitionType()) {
			return false;
		}
		xOther = other;
		if (!oFF.XString.isEqual(this.getMemberName(), xOther.getMemberName())) {
			return false;
		}
		if (!oFF.XString.isEqual(this.getQueryAliasName(), xOther
				.getQueryAliasName())) {
			return false;
		}
		return true;
	};
	oFF.BlendingMappingDefinition.prototype.getQueryAliasName = function() {
		return this.m_queryAliasName;
	};
	oFF.BlendingMappingDefinition.prototype.getMemberName = function() {
		return this.m_memberName;
	};
	oFF.BlendingMappingDefinition.prototype.toString = function() {
		var sb = oFF.XStringBuffer.create();
		sb.append(this.m_queryAliasName).append(".");
		sb.append(this.m_memberName);
		sb.append("(").append(this.getMappingDefinitionType().getName())
				.append(")");
		return sb.toString();
	};
	oFF.ClusteringDbScan = function() {
	};
	oFF.ClusteringDbScan.prototype = new oFF.AbstractSpatialClustering();
	oFF.ClusteringDbScan.create = function() {
		var dbScan = new oFF.ClusteringDbScan();
		dbScan.setup();
		return dbScan;
	};
	oFF.ClusteringDbScan.prototype.m_eps = null;
	oFF.ClusteringDbScan.prototype.m_minPoints = null;
	oFF.ClusteringDbScan.prototype.setup = function() {
		oFF.AbstractSpatialClustering.prototype.setup.call(this);
		this.m_eps = oFF.XDoubleValue.create(0);
		this.m_minPoints = oFF.XIntegerValue.create(0);
		this.m_parameters.put("EPS", this.m_eps);
		this.m_parameters.put("MinPoints", this.m_minPoints);
	};
	oFF.ClusteringDbScan.prototype.clone = function() {
		var clone = oFF.ClusteringDbScan.create();
		clone.setActive(this.isActive());
		if (this.getClusterField() !== null) {
			clone.setClusterField(this.getClusterField());
		}
		clone.setEps(this.getEps());
		clone.setMinPoints(this.getMinPoints());
		return clone;
	};
	oFF.ClusteringDbScan.prototype.releaseObject = function() {
		this.m_eps = oFF.XObjectExt.release(this.m_eps);
		this.m_minPoints = oFF.XObjectExt.release(this.m_minPoints);
		oFF.AbstractSpatialClustering.prototype.releaseObject.call(this);
	};
	oFF.ClusteringDbScan.prototype.getEps = function() {
		return this.m_eps.getDouble();
	};
	oFF.ClusteringDbScan.prototype.setEps = function(eps) {
		this.m_eps.setDouble(eps);
	};
	oFF.ClusteringDbScan.prototype.getMinPoints = function() {
		return this.m_minPoints.getInteger();
	};
	oFF.ClusteringDbScan.prototype.setMinPoints = function(minPoints) {
		this.m_minPoints.setInteger(minPoints);
	};
	oFF.ClusteringDbScan.prototype.getClusterAlgorithm = function() {
		return oFF.ClusterAlgorithm.DB_SCAN;
	};
	oFF.ClusteringGrid = function() {
	};
	oFF.ClusteringGrid.prototype = new oFF.AbstractSpatialClustering();
	oFF.ClusteringGrid.create = function() {
		var grid = new oFF.ClusteringGrid();
		grid.setup();
		return grid;
	};
	oFF.ClusteringGrid.prototype.m_lowerBoundX = null;
	oFF.ClusteringGrid.prototype.m_upperBoundX = null;
	oFF.ClusteringGrid.prototype.m_lowerBoundY = null;
	oFF.ClusteringGrid.prototype.m_upperBoundY = null;
	oFF.ClusteringGrid.prototype.m_cellsX = null;
	oFF.ClusteringGrid.prototype.m_cellsY = null;
	oFF.ClusteringGrid.prototype.setup = function() {
		oFF.AbstractSpatialClustering.prototype.setup.call(this);
		this.m_cellsX = oFF.XIntegerValue.create(0);
		this.m_cellsY = oFF.XIntegerValue.create(0);
		this.m_parameters.put("XCells", this.m_cellsX);
		this.m_parameters.put("YCells", this.m_cellsY);
	};
	oFF.ClusteringGrid.prototype.clone = function() {
		var clone = oFF.ClusteringGrid.create();
		clone.setActive(this.isActive());
		if (this.getClusterField() !== null) {
			clone.setClusterField(this.getClusterField());
		}
		clone.setCellsX(this.getCellsX());
		clone.setCellsY(this.getCellsY());
		if (oFF.notNull(this.m_lowerBoundX)) {
			clone.setLowerBoundX(this.getLowerBoundX());
		}
		if (oFF.notNull(this.m_upperBoundX)) {
			clone.setUpperBoundX(this.getUpperBoundX());
		}
		if (oFF.notNull(this.m_lowerBoundY)) {
			clone.setLowerBoundY(this.getLowerBoundY());
		}
		if (oFF.notNull(this.m_upperBoundY)) {
			clone.setUpperBoundY(this.getUpperBoundY());
		}
		return clone;
	};
	oFF.ClusteringGrid.prototype.releaseObject = function() {
		this.m_lowerBoundX = oFF.XObjectExt.release(this.m_lowerBoundX);
		this.m_upperBoundX = oFF.XObjectExt.release(this.m_upperBoundX);
		this.m_lowerBoundY = oFF.XObjectExt.release(this.m_lowerBoundY);
		this.m_upperBoundY = oFF.XObjectExt.release(this.m_upperBoundY);
		this.m_cellsX = oFF.XObjectExt.release(this.m_cellsX);
		this.m_cellsY = oFF.XObjectExt.release(this.m_cellsY);
		oFF.AbstractSpatialClustering.prototype.releaseObject.call(this);
	};
	oFF.ClusteringGrid.prototype.getLowerBoundX = function() {
		if (oFF.isNull(this.m_lowerBoundX)) {
			return 0;
		}
		return this.m_lowerBoundX.getDouble();
	};
	oFF.ClusteringGrid.prototype.setLowerBoundX = function(lowerBoundX) {
		if (oFF.isNull(this.m_lowerBoundX)) {
			this.m_lowerBoundX = oFF.XDoubleValue.create(lowerBoundX);
			this.m_parameters.put("XLowerBound", this.m_lowerBoundX);
		} else {
			this.m_lowerBoundX.setDouble(lowerBoundX);
		}
	};
	oFF.ClusteringGrid.prototype.getLowerBoundY = function() {
		if (oFF.isNull(this.m_lowerBoundY)) {
			return 0;
		}
		return this.m_lowerBoundY.getDouble();
	};
	oFF.ClusteringGrid.prototype.setLowerBoundY = function(lowerBoundY) {
		if (oFF.isNull(this.m_lowerBoundY)) {
			this.m_lowerBoundY = oFF.XDoubleValue.create(lowerBoundY);
			this.m_parameters.put("YLowerBound", this.m_lowerBoundY);
		} else {
			this.m_lowerBoundY.setDouble(lowerBoundY);
		}
	};
	oFF.ClusteringGrid.prototype.getUpperBoundX = function() {
		if (oFF.isNull(this.m_upperBoundX)) {
			return 0;
		}
		return this.m_upperBoundX.getDouble();
	};
	oFF.ClusteringGrid.prototype.setUpperBoundX = function(upperBoundX) {
		if (oFF.isNull(this.m_upperBoundX)) {
			this.m_upperBoundX = oFF.XDoubleValue.create(upperBoundX);
			this.m_parameters.put("XUpperBound", this.m_upperBoundX);
		} else {
			this.m_upperBoundX.setDouble(upperBoundX);
		}
	};
	oFF.ClusteringGrid.prototype.getUpperBoundY = function() {
		if (oFF.isNull(this.m_upperBoundY)) {
			return 0;
		}
		return this.m_upperBoundY.getDouble();
	};
	oFF.ClusteringGrid.prototype.setUpperBoundY = function(upperBoundY) {
		if (oFF.isNull(this.m_upperBoundY)) {
			this.m_upperBoundY = oFF.XDoubleValue.create(upperBoundY);
			this.m_parameters.put("YUpperBound", this.m_upperBoundY);
		} else {
			this.m_upperBoundY.setDouble(upperBoundY);
		}
	};
	oFF.ClusteringGrid.prototype.getCellsX = function() {
		return this.m_cellsX.getInteger();
	};
	oFF.ClusteringGrid.prototype.setCellsX = function(cellsX) {
		this.m_cellsX.setInteger(cellsX);
	};
	oFF.ClusteringGrid.prototype.getCellsY = function() {
		return this.m_cellsY.getInteger();
	};
	oFF.ClusteringGrid.prototype.setCellsY = function(cellsY) {
		this.m_cellsY.setInteger(cellsY);
	};
	oFF.ClusteringGrid.prototype.getClusterAlgorithm = function() {
		return oFF.ClusterAlgorithm.GRID;
	};
	oFF.ClusteringKmeans = function() {
	};
	oFF.ClusteringKmeans.prototype = new oFF.AbstractSpatialClustering();
	oFF.ClusteringKmeans.create = function() {
		var kMeans = new oFF.ClusteringKmeans();
		kMeans.setup();
		return kMeans;
	};
	oFF.ClusteringKmeans.prototype.m_clusters = null;
	oFF.ClusteringKmeans.prototype.m_maxIterations = null;
	oFF.ClusteringKmeans.prototype.m_threshold = null;
	oFF.ClusteringKmeans.prototype.m_init = null;
	oFF.ClusteringKmeans.prototype.setup = function() {
		oFF.AbstractSpatialClustering.prototype.setup.call(this);
		this.m_clusters = oFF.XIntegerValue.create(0);
		this.m_parameters.put("Clusters", this.m_clusters);
	};
	oFF.ClusteringKmeans.prototype.clone = function() {
		var clone = oFF.ClusteringKmeans.create();
		clone.setActive(this.isActive());
		if (this.getClusterField() !== null) {
			clone.setClusterField(this.getClusterField());
		}
		clone.setClusters(this.getClusters());
		if (oFF.notNull(this.m_init)) {
			clone.setInit(this.getInit());
		}
		if (oFF.notNull(this.m_maxIterations)) {
			clone.setMaxIterations(this.getMaxIterations());
		}
		if (oFF.notNull(this.m_threshold)) {
			clone.setThreshold(this.getThreshold());
		}
		return clone;
	};
	oFF.ClusteringKmeans.prototype.releaseObject = function() {
		this.m_init = oFF.XObjectExt.release(this.m_init);
		this.m_clusters = oFF.XObjectExt.release(this.m_clusters);
		this.m_maxIterations = oFF.XObjectExt.release(this.m_maxIterations);
		this.m_threshold = oFF.XObjectExt.release(this.m_threshold);
		oFF.AbstractSpatialClustering.prototype.releaseObject.call(this);
	};
	oFF.ClusteringKmeans.prototype.getClusters = function() {
		return this.m_clusters.getInteger();
	};
	oFF.ClusteringKmeans.prototype.setClusters = function(clusters) {
		this.m_clusters.setInteger(clusters);
	};
	oFF.ClusteringKmeans.prototype.getMaxIterations = function() {
		if (oFF.isNull(this.m_maxIterations)) {
			return 0;
		}
		return this.m_maxIterations.getInteger();
	};
	oFF.ClusteringKmeans.prototype.setMaxIterations = function(maxIterations) {
		if (oFF.isNull(this.m_maxIterations)) {
			this.m_maxIterations = oFF.XIntegerValue.create(maxIterations);
			this.m_parameters.put("MaxIterations", this.m_maxIterations);
		} else {
			this.m_maxIterations.setInteger(maxIterations);
		}
	};
	oFF.ClusteringKmeans.prototype.getThreshold = function() {
		if (oFF.isNull(this.m_threshold)) {
			return 0;
		}
		return this.m_threshold.getDouble();
	};
	oFF.ClusteringKmeans.prototype.setThreshold = function(threshold) {
		if (oFF.isNull(this.m_threshold)) {
			this.m_threshold = oFF.XDoubleValue.create(threshold);
			this.m_parameters.put("Threshold", this.m_threshold);
		} else {
			this.m_threshold.setDouble(threshold);
		}
	};
	oFF.ClusteringKmeans.prototype.getInit = function() {
		if (oFF.isNull(this.m_init)) {
			return null;
		}
		return this.m_init.getString();
	};
	oFF.ClusteringKmeans.prototype.setInit = function(setValue) {
		if (oFF.isNull(this.m_init)) {
			this.m_init = oFF.XStringValue.create(setValue);
			this.m_parameters.put("Init", this.m_init);
		} else {
			this.m_init.setString(setValue);
		}
	};
	oFF.ClusteringKmeans.prototype.getClusterAlgorithm = function() {
		return oFF.ClusterAlgorithm.K_MEANS;
	};
	oFF.BlendingConstantMapping = function() {
	};
	oFF.BlendingConstantMapping.prototype = new oFF.AbstractBlendingMapping();
	oFF.BlendingConstantMapping.createConstantMapping = function(memberKey,
			queryAliasName) {
		var constantMappingDefinition = new oFF.BlendingConstantMapping();
		constantMappingDefinition.setupExt(queryAliasName, memberKey,
				oFF.BlendingMappingDefinitionType.CONSTANT);
		return constantMappingDefinition;
	};
	oFF.BlendingConstantMapping.prototype.m_queryAliasName = null;
	oFF.BlendingConstantMapping.prototype.m_valueType = null;
	oFF.BlendingConstantMapping.prototype.m_memberKey = null;
	oFF.BlendingConstantMapping.prototype.cloneMappingDefinition = function() {
		return oFF.BlendingConstantMapping.createConstantMapping(this
				.getMemberName(), this.getQueryAliasName());
	};
	oFF.BlendingConstantMapping.prototype.clone = function() {
		return this.cloneMappingDefinition();
	};
	oFF.BlendingConstantMapping.prototype.isEqualTo = function(other) {
		var otherGeneral;
		var xOther;
		if (oFF.isNull(other)) {
			return false;
		}
		if (this === other) {
			return true;
		}
		otherGeneral = other;
		if (this.getMappingDefinitionType() !== otherGeneral
				.getMappingDefinitionType()) {
			return false;
		}
		xOther = other;
		if (!oFF.XString.isEqual(this.getMemberName(), xOther.getMemberName())) {
			return false;
		}
		if (!oFF.XString.isEqual(this.getQueryAliasName(), xOther
				.getQueryAliasName())) {
			return false;
		}
		if (this.getValueType() !== xOther.getValueType()) {
			return false;
		}
		return true;
	};
	oFF.BlendingConstantMapping.prototype.setupExt = function(queryAliasName,
			memberKey, mappingType) {
		oFF.XStringUtils.checkStringNotEmpty(queryAliasName,
				"Query Alias name is null!");
		oFF.AbstractBlendingMapping.prototype.setupAbstractMapping.call(this,
				mappingType, null);
		this.m_queryAliasName = queryAliasName;
		this.m_memberKey = memberKey;
		this.m_valueType = oFF.XValueType.STRING;
	};
	oFF.BlendingConstantMapping.prototype.releaseObject = function() {
		this.m_queryAliasName = null;
		this.m_valueType = null;
		this.m_memberKey = null;
		oFF.AbstractBlendingMapping.prototype.releaseObject.call(this);
	};
	oFF.BlendingConstantMapping.prototype.getQueryAliasName = function() {
		return this.m_queryAliasName;
	};
	oFF.BlendingConstantMapping.prototype.getMemberName = function() {
		return this.m_memberKey;
	};
	oFF.BlendingConstantMapping.prototype.toString = function() {
		var sb = oFF.XStringBuffer.create();
		sb.append(this.m_queryAliasName).append(".");
		sb.append(this.m_memberKey);
		sb.append("(").append(this.getMappingDefinitionType().getName())
				.append(")");
		return sb.toString();
	};
	oFF.BlendingConstantMapping.prototype.getValueType = function() {
		return this.m_valueType;
	};
	oFF.BlendingDefinition = function() {
	};
	oFF.BlendingDefinition.prototype = new oFF.XObject();
	oFF.BlendingDefinition.create = function() {
		var blending = new oFF.BlendingDefinition();
		blending.m_mappings = oFF.XLinkedHashMapByString.create();
		blending.m_sources = oFF.XLinkedHashMapByString.create();
		blending.m_blendingHostManager = oFF.BlendingHostManager
				.create(blending);
		return blending;
	};
	oFF.BlendingDefinition.prototype.m_mappings = null;
	oFF.BlendingDefinition.prototype.m_sources = null;
	oFF.BlendingDefinition.prototype.m_blendingHostManager = null;
	oFF.BlendingDefinition.prototype.m_queryModel = null;
	oFF.BlendingDefinition.prototype.cloneBlendingDefinition = function() {
		var clone = oFF.BlendingDefinition.create();
		var blendingHost = this.getBlendingHost();
		var sourceIterator = this.m_sources.getIterator();
		var source;
		var sourceClone;
		var mappingIterator;
		var mapping;
		var cloneMapping;
		while (sourceIterator.hasNext()) {
			source = sourceIterator.next();
			sourceClone = source.cloneBlendingSource();
			clone.addSource(sourceClone);
			if (oFF.notNull(blendingHost)
					&& source === blendingHost.getSource()) {
				clone.setSourceAsBlendingHost(sourceClone);
			}
		}
		oFF.XObjectExt.release(sourceIterator);
		mappingIterator = this.m_mappings.getIterator();
		while (mappingIterator.hasNext()) {
			mapping = mappingIterator.next();
			cloneMapping = mapping.cloneMapping();
			cloneMapping.setBlendingDefinition(clone);
			clone.addMapping(cloneMapping);
		}
		oFF.XObjectExt.release(mappingIterator);
		return clone;
	};
	oFF.BlendingDefinition.prototype.setBlendingHost = function(blendingHost) {
		this.m_blendingHostManager.setBlendingHost(blendingHost);
	};
	oFF.BlendingDefinition.prototype.setSourceAsBlendingHost = function(source) {
		this.m_blendingHostManager.setSourceAsBlendingHost(source);
	};
	oFF.BlendingDefinition.prototype.getBlendingHost = function() {
		return this.m_blendingHostManager.getBlendingHost();
	};
	oFF.BlendingDefinition.prototype.addSingleMemberFilterByDimensionNameToSourceQueryByAlias = function(
			sourceQueryAlias, sourceDimensionName, sourceMemberName,
			comparisonOperator) {
		var sourceQuery = this.getBlendingSourceByAlias(sourceQueryAlias);
		var addSingleMemberFilterByDimensionName;
		oFF.XObjectExt.checkNotNull(sourceQuery, oFF.XStringUtils
				.concatenate3("No Source Query for Alias '", sourceQueryAlias,
						"' was found!"));
		addSingleMemberFilterByDimensionName = sourceQuery
				.getConvenienceCommands().addSingleMemberFilterByDimensionName(
						sourceDimensionName, sourceMemberName,
						comparisonOperator);
		this.notifyQueryModel();
		return addSingleMemberFilterByDimensionName;
	};
	oFF.BlendingDefinition.prototype.clone = function() {
		return this.cloneBlendingDefinition();
	};
	oFF.BlendingDefinition.prototype.releaseObject = function() {
		this.m_mappings = oFF.XObjectExt.release(this.m_mappings);
		this.m_sources = oFF.XObjectExt.release(this.m_sources);
		this.m_blendingHostManager = oFF.XObjectExt
				.release(this.m_blendingHostManager);
		this.m_queryModel = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.BlendingDefinition.prototype.addMapping = function(mapping) {
		oFF.XObjectExt.checkNotNull(mapping, "Mapping is null");
		this.m_mappings.put(mapping.getMemberName(), mapping);
		return this;
	};
	oFF.BlendingDefinition.prototype.removeMappingByName = function(
			memberAliasName) {
		this.m_mappings.remove(memberAliasName);
		return this;
	};
	oFF.BlendingDefinition.prototype.getMappings = function() {
		return this.m_mappings.getValuesAsReadOnlyList();
	};
	oFF.BlendingDefinition.prototype.addSource = function(source) {
		var queryModel;
		oFF.XObjectExt.checkNotNull(source, "Source is null");
		queryModel = source.getQueryModel();
		oFF.XBooleanUtils.checkTrue(queryModel.supportsCubeBlending(),
				"The backend is not capable of blending!");
		if (!queryModel.supportsCubeBlendingWithNSubqueries()
				&& this.m_sources.size() >= oFF.BlendingCapabilities
						.getMaxNumberOfBlendingQueries()) {
			throw oFF.XException
					.createRuntimeException("Currently only 2 sources are allowed");
		}
		if (this.m_sources.containsKey(source.getQueryAliasName())) {
			throw oFF.XException
					.createIllegalArgumentException(oFF.XStringUtils
							.concatenate3("The query alias '", source
									.getQueryAliasName(), "' is not unique!"));
		}
		oFF.BlendingValidation.isQueryModelValidForBlending(queryModel, null);
		this.m_sources.put(source.getQueryAliasName(), source);
		return this;
	};
	oFF.BlendingDefinition.prototype.removeSourceByName = function(
			queryAliasName) {
		var source = this.m_sources.getByKey(queryAliasName);
		var blendingHost;
		this.m_sources.remove(queryAliasName);
		blendingHost = this.getBlendingHost();
		if (oFF.notNull(blendingHost) && blendingHost.getSource() === source) {
			this.setBlendingHost(null);
		}
		return this;
	};
	oFF.BlendingDefinition.prototype.getSources = function() {
		return this.m_sources.getValuesAsReadOnlyList();
	};
	oFF.BlendingDefinition.prototype.newSource = function(queryModel,
			queryAliasName) {
		oFF.XStringUtils.checkStringNotEmpty(queryAliasName,
				"The query alias must not be empty or null!");
		oFF.BlendingValidation.isQueryModelValidForBlending(queryModel, null);
		return oFF.BlendingSource.create(queryModel, queryAliasName);
	};
	oFF.BlendingDefinition.prototype.addNewSource = function(queryModel,
			queryAliasName) {
		var newSource = this.newSource(queryModel, queryAliasName);
		this.addSource(newSource);
		return newSource;
	};
	oFF.BlendingDefinition.prototype.newDimensionMapping = function(linkType,
			aliasName) {
		var dimensionMapping;
		oFF.XStringUtils.checkStringNotEmpty(aliasName,
				"The member alias must not be empty or null!");
		dimensionMapping = oFF.BlendingMapping.create(linkType, this);
		dimensionMapping.setMemberName(aliasName);
		return dimensionMapping;
	};
	oFF.BlendingDefinition.prototype.addNewDimensionMapping = function(
			linkType, aliasName) {
		var dimensionMapping = this.newDimensionMapping(linkType, aliasName);
		this.addMapping(dimensionMapping);
		return dimensionMapping;
	};
	oFF.BlendingDefinition.prototype.getBlendingAliasByQueryModel = function(
			queryModel) {
		var sourceIterator;
		var blendingSource;
		if (oFF.isNull(queryModel)) {
			return null;
		}
		sourceIterator = this.getSources().getIterator();
		while (sourceIterator.hasNext()) {
			blendingSource = sourceIterator.next();
			if (blendingSource.getQueryModel() === queryModel) {
				oFF.XObjectExt.release(sourceIterator);
				return blendingSource.getQueryAliasName();
			}
		}
		oFF.XObjectExt.release(sourceIterator);
		return null;
	};
	oFF.BlendingDefinition.prototype.getBlendingSourceByAlias = function(
			queryAliasName) {
		var blendingSource = this.m_sources.getByKey(queryAliasName);
		if (oFF.isNull(blendingSource)) {
			return null;
		}
		return blendingSource.getQueryModel();
	};
	oFF.BlendingDefinition.prototype.isEqualTo = function(other) {
		var xOther;
		if (oFF.isNull(other)) {
			return false;
		}
		if (this === other) {
			return true;
		}
		xOther = other;
		if (!this.getMappings().isEqualTo(xOther.getMappings())) {
			return false;
		}
		if (!this.getSources().isEqualTo(xOther.getSources())) {
			return false;
		}
		if (this.getBlendingHost() !== xOther.getBlendingHost()) {
			return false;
		}
		return true;
	};
	oFF.BlendingDefinition.prototype.notifyQueryModel = function() {
		var queryModel = this.getQueryModel();
		if (oFF.notNull(queryModel)) {
			queryModel.updateCubeBlendingMappings();
		}
	};
	oFF.BlendingDefinition.prototype.getQueryModel = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_queryModel);
	};
	oFF.BlendingDefinition.prototype.setQueryModel = function(queryModel) {
		this.m_queryModel = oFF.XWeakReferenceUtil.getWeakRef(queryModel);
	};
	oFF.BlendingDefinition.prototype.getMappingByAliasName = function(aliasName) {
		return this.m_mappings.getByKey(aliasName);
	};
	oFF.BlendingDefinition.prototype.isRemoteBlending = function() {
		var blendingHost = this.getBlendingHost();
		var blendingHostSystemName = blendingHost.getSystemName();
		var iterator = this.m_sources.getIterator();
		var queryModel;
		var systemName;
		while (iterator.hasNext()) {
			queryModel = iterator.next().getQueryModel();
			systemName = queryModel.getQueryManager().getSystemName();
			if (!oFF.XString.isEqual(blendingHostSystemName, systemName)) {
				return true;
			}
		}
		return false;
	};
	oFF.BlendingMapping = function() {
	};
	oFF.BlendingMapping.prototype = new oFF.AbstractBlendingMapping();
	oFF.BlendingMapping.create = function(linkType, blendingDefinition) {
		var mapping;
		oFF.XObjectExt.checkNotNull(linkType, "Blending link type is null");
		oFF.XObjectExt.checkNotNull(blendingDefinition,
				"Blending definition is null");
		mapping = new oFF.BlendingMapping();
		mapping.setupExt(linkType, blendingDefinition);
		return mapping;
	};
	oFF.BlendingMapping.prototype.m_attributeMappings = null;
	oFF.BlendingMapping.prototype.m_constantMappings = null;
	oFF.BlendingMapping.prototype.m_dimensionMappingDefinitions = null;
	oFF.BlendingMapping.prototype.m_isPreservingMembers = false;
	oFF.BlendingMapping.prototype.m_isReturningOriginKeys = false;
	oFF.BlendingMapping.prototype.m_linkType = null;
	oFF.BlendingMapping.prototype.m_memberName = null;
	oFF.BlendingMapping.prototype.addAttributeMapping = function(
			attributeMapping) {
		this.m_attributeMappings.add(attributeMapping);
		this.getBlendingDefinition().notifyQueryModel();
	};
	oFF.BlendingMapping.prototype.addConstantMapping = function(constantMapping) {
		this.m_constantMappings.add(constantMapping);
		this.getBlendingDefinition().notifyQueryModel();
	};
	oFF.BlendingMapping.prototype.addMappingDefinition = function(
			mappingDefinition) {
		oFF.XObjectExt.checkNotNull(mappingDefinition,
				"Mapping definition is null");
		if (this.m_dimensionMappingDefinitions.size() >= this
				.getBlendingDefinition().getSources().size()) {
			throw oFF.XException
					.createIllegalArgumentException("Cannot add more dimension mappings than blending sources");
		}
		this.m_dimensionMappingDefinitions.add(mappingDefinition);
		this.getBlendingDefinition().notifyQueryModel();
		return this;
	};
	oFF.BlendingMapping.prototype.addNewAttributeMappingByName = function(
			attributeName, isLinkKey) {
		var attributeMapping = this.newAttributeMappingByName(attributeName,
				isLinkKey);
		this.addAttributeMapping(attributeMapping);
		this.getBlendingDefinition().notifyQueryModel();
		return attributeMapping;
	};
	oFF.BlendingMapping.prototype.addNewConstantMapping = function(memberKey,
			queryAliasName) {
		var newConstantMapping = this.newConstantMapping(memberKey,
				queryAliasName);
		this.addConstantMapping(newConstantMapping);
		this.getBlendingDefinition().notifyQueryModel();
		return newConstantMapping;
	};
	oFF.BlendingMapping.prototype.addNewDimensionMappingDefinition = function(
			dimension, queryAliasName) {
		var dimensionBlendingMappingDefinition = this
				.newDimensionMappingDefinition(dimension, queryAliasName);
		this.addMappingDefinition(dimensionBlendingMappingDefinition);
		this.getBlendingDefinition().notifyQueryModel();
		return dimensionBlendingMappingDefinition;
	};
	oFF.BlendingMapping.prototype.addNewDimensionMappingDefinitionByObject = function(
			dimension) {
		var dimensionMappingDefinition = this
				.newDimensionMappingDefinitionByObject(dimension);
		this.addMappingDefinition(dimensionMappingDefinition);
		this.getBlendingDefinition().notifyQueryModel();
		return dimensionMappingDefinition;
	};
	oFF.BlendingMapping.prototype.addNewDimensionMappingDefinitionByName = function(
			dimensionName, queryAliasName) {
		var dimensionMappingDefinition = this
				.newDimensionMappingDefinitionByName(dimensionName,
						queryAliasName);
		this.addMappingDefinition(dimensionMappingDefinition);
		this.getBlendingDefinition().notifyQueryModel();
		return dimensionMappingDefinition;
	};
	oFF.BlendingMapping.prototype.clone = function() {
		return this.cloneMapping();
	};
	oFF.BlendingMapping.prototype.cloneMapping = function() {
		var clone = oFF.BlendingMapping.create(this.getLinkType(), this
				.getBlendingDefinition());
		var definitionIterator = this.getMappingDefinitions().getIterator();
		var definition;
		var attributeMappingIterator;
		var attributeMapping;
		var constantMappingIterator;
		var constantMapping;
		while (definitionIterator.hasNext()) {
			definition = definitionIterator.next();
			clone.addMappingDefinition(definition.cloneMappingDefinition());
		}
		oFF.XObjectExt.release(definitionIterator);
		attributeMappingIterator = this.getAttributeMappings().getIterator();
		while (attributeMappingIterator.hasNext()) {
			attributeMapping = attributeMappingIterator.next();
			clone.addAttributeMapping(attributeMapping.cloneMapping());
		}
		oFF.XObjectExt.release(attributeMappingIterator);
		constantMappingIterator = this.getConstantMappings().getIterator();
		while (constantMappingIterator.hasNext()) {
			constantMapping = constantMappingIterator.next();
			clone.addConstantMapping(constantMapping.cloneMappingDefinition());
		}
		oFF.XObjectExt.release(constantMappingIterator);
		clone.setIsPreservingMembers(this.isPreservingMembers());
		clone.setIsReturningOriginKeys(this.isReturningOriginKeys());
		clone.setMemberName(this.getMemberName());
		return clone;
	};
	oFF.BlendingMapping.prototype.isEqualTo = function(other) {
		var otherGeneral;
		var xOther;
		if (oFF.isNull(other)) {
			return false;
		}
		if (this === other) {
			return true;
		}
		otherGeneral = other;
		if (this.getMappingDefinitionType() !== otherGeneral
				.getMappingDefinitionType()) {
			return false;
		}
		xOther = other;
		if (!oFF.XString.isEqual(this.getMemberName(), xOther.getMemberName())) {
			return false;
		}
		if (!this.getMappingDefinitions().isEqualTo(
				xOther.getMappingDefinitions())) {
			return false;
		}
		if (!this.getConstantMappings().isEqualTo(xOther.getConstantMappings())) {
			return false;
		}
		if (!this.getAttributeMappings().isEqualTo(
				xOther.getAttributeMappings())) {
			return false;
		}
		return true;
	};
	oFF.BlendingMapping.prototype.getAttributeMappings = function() {
		return this.m_attributeMappings;
	};
	oFF.BlendingMapping.prototype.getConstantMappings = function() {
		return this.m_constantMappings;
	};
	oFF.BlendingMapping.prototype.getLinkType = function() {
		return this.m_linkType;
	};
	oFF.BlendingMapping.prototype.getMappingDefinitions = function() {
		return this.m_dimensionMappingDefinitions;
	};
	oFF.BlendingMapping.prototype.getMemberName = function() {
		return this.m_memberName;
	};
	oFF.BlendingMapping.prototype.isPreservingMembers = function() {
		return this.m_isPreservingMembers;
	};
	oFF.BlendingMapping.prototype.newAttributeMappingByName = function(
			attributeName, isLinkKey) {
		oFF.XStringUtils.checkStringNotEmpty(attributeName,
				"The attribute name must not be empty!");
		return oFF.BlendingAttributeMapping.create(attributeName, isLinkKey,
				this.getBlendingDefinition());
	};
	oFF.BlendingMapping.prototype.newConstantMapping = function(memberKey,
			queryAliasName) {
		var blendingQueryModel = this.getBlendingDefinition()
				.getBlendingSourceByAlias(queryAliasName);
		oFF.XObjectExt.checkNotNull(blendingQueryModel, oFF.XStringUtils
				.concatenate3("No Blending source found for alias '",
						queryAliasName, "'!"));
		return oFF.BlendingConstantMapping.createConstantMapping(memberKey,
				queryAliasName);
	};
	oFF.BlendingMapping.prototype.newDimensionMappingDefinitionByObject = function(
			dimension) {
		var queryAliasName;
		oFF.XObjectExt.checkNotNull(dimension,
				"The dimension must not be null!");
		queryAliasName = this.getBlendingDefinition()
				.getBlendingAliasByQueryModel(dimension.getQueryModel());
		return this.newDimensionMappingDefinition(dimension, queryAliasName);
	};
	oFF.BlendingMapping.prototype.newDimensionMappingDefinition = function(
			dimension, queryAliasName) {
		oFF.XObjectExt.checkNotNull(dimension,
				"The dimension must not be null!");
		oFF.XStringUtils.checkStringNotEmpty(queryAliasName,
				"The query alias name must not be null or empty!");
		oFF.BlendingValidation.isDimensionValidForBlending(dimension, null,
				false);
		return oFF.BlendingMappingDefinition.createDimensionMapping(dimension
				.getName(), queryAliasName);
	};
	oFF.BlendingMapping.prototype.newDimensionMappingDefinitionByName = function(
			dimensionName, queryAliasName) {
		var blendingQueryModel = this.getBlendingDefinition()
				.getBlendingSourceByAlias(queryAliasName);
		var dimension;
		oFF.XObjectExt.checkNotNull(blendingQueryModel, oFF.XStringUtils
				.concatenate3("No Blending source found for alias '",
						queryAliasName, "'!"));
		dimension = blendingQueryModel.getDimensionByName(dimensionName);
		return this.newDimensionMappingDefinition(dimension, queryAliasName);
	};
	oFF.BlendingMapping.prototype.removeAttributeMappingAt = function(
			indexToRemove) {
		this.m_attributeMappings.removeAt(indexToRemove);
		this.getBlendingDefinition().notifyQueryModel();
	};
	oFF.BlendingMapping.prototype.removeMappingDefinitionAt = function(
			indexToRemove) {
		this.m_dimensionMappingDefinitions.removeAt(indexToRemove);
		this.getBlendingDefinition().notifyQueryModel();
		return this;
	};
	oFF.BlendingMapping.prototype.setIsPreservingMembers = function(
			isPreserving) {
		if (this.m_isPreservingMembers !== isPreserving) {
			this.m_isPreservingMembers = isPreserving;
			this.getBlendingDefinition().notifyQueryModel();
		}
	};
	oFF.BlendingMapping.prototype.setMemberName = function(memberName) {
		if (!oFF.XString.isEqual(this.m_memberName, memberName)) {
			this.m_memberName = memberName;
			this.getBlendingDefinition().notifyQueryModel();
		}
	};
	oFF.BlendingMapping.prototype.setupExt = function(linkType,
			blendingDefinition) {
		oFF.AbstractBlendingMapping.prototype.setupAbstractMapping
				.call(this, oFF.BlendingMappingDefinitionType.DIMENSION,
						blendingDefinition);
		this.m_linkType = linkType;
		this.m_dimensionMappingDefinitions = oFF.XList.create();
		this.m_attributeMappings = oFF.XList.create();
		this.m_constantMappings = oFF.XList.create();
		this.m_isPreservingMembers = false;
		this.m_isReturningOriginKeys = true;
	};
	oFF.BlendingMapping.prototype.releaseObject = function() {
		this.m_dimensionMappingDefinitions = oFF.XObjectExt
				.release(this.m_dimensionMappingDefinitions);
		this.m_attributeMappings = oFF.XObjectExt
				.release(this.m_attributeMappings);
		this.m_constantMappings = oFF.XObjectExt
				.release(this.m_constantMappings);
		this.m_linkType = null;
		this.m_memberName = null;
		oFF.AbstractBlendingMapping.prototype.releaseObject.call(this);
	};
	oFF.BlendingMapping.prototype.toString = function() {
		var sb = oFF.XStringBuffer.create();
		if (oFF.notNull(this.m_dimensionMappingDefinitions)) {
			sb.append(this.m_dimensionMappingDefinitions.toString());
		}
		sb.append("\n\tLinked with: ").append(this.m_linkType.getName());
		sb.append("\n\tDefinition Type: ").append(
				this.getMappingDefinitionType().getName());
		sb.append("\n\tMember Alias: ").append(this.m_memberName);
		if (this.m_linkType === oFF.BlendingLinkType.NONE) {
			sb.append("\n\tIs Preserving Members: ");
			sb.appendBoolean(this.m_isPreservingMembers);
			sb.append("\n\tIs Returning Folding Keys:");
			sb.appendBoolean(this.m_isReturningOriginKeys);
		}
		return sb.toString();
	};
	oFF.BlendingMapping.prototype.isReturningOriginKeys = function() {
		return this.m_isReturningOriginKeys;
	};
	oFF.BlendingMapping.prototype.setIsReturningOriginKeys = function(
			isReturningOriginKeys) {
		if (this.m_isReturningOriginKeys !== isReturningOriginKeys) {
			this.m_isReturningOriginKeys = isReturningOriginKeys;
			this.getBlendingDefinition().notifyQueryModel();
		}
	};
	oFF.BlendingMapping.prototype.setBlendingDefinition = function(
			blendingDefinition) {
		this.m_blendingDefinition = oFF.XWeakReferenceUtil
				.getWeakRef(blendingDefinition);
	};
	oFF.BlendingMapping.prototype.setLinkType = function(linkType) {
		this.m_linkType = linkType;
	};
	oFF.DfOlapEnvContext = function() {
	};
	oFF.DfOlapEnvContext.prototype = new oFF.XObject();
	oFF.DfOlapEnvContext.prototype.m_olapEnv = null;
	oFF.DfOlapEnvContext.prototype.setupOlapApplicationContext = function(
			application) {
		this.m_olapEnv = oFF.XWeakReferenceUtil.getWeakRef(application);
	};
	oFF.DfOlapEnvContext.prototype.releaseObject = function() {
		this.m_olapEnv = oFF.XObjectExt.release(this.m_olapEnv);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.DfOlapEnvContext.prototype.getSession = function() {
		return this.getOlapEnv().getSession();
	};
	oFF.DfOlapEnvContext.prototype.getApplication = function() {
		return this.getOlapEnv().getApplication();
	};
	oFF.DfOlapEnvContext.prototype.getOlapEnv = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_olapEnv);
	};
	oFF.QueryPreparatorFactory = function() {
	};
	oFF.QueryPreparatorFactory.prototype = new oFF.XObjectExt();
	oFF.QueryPreparatorFactory.s_factoryMap = null;
	oFF.QueryPreparatorFactory.staticSetup = function() {
		oFF.QueryPreparatorFactory.s_factoryMap = oFF.XHashMapByString.create();
	};
	oFF.QueryPreparatorFactory.newInstance = function(modelFormat) {
		var factory = oFF.QueryPreparatorFactory.s_factoryMap
				.getByKey(modelFormat.getName());
		if (oFF.notNull(factory)) {
			return factory.newInstanceFromFactory();
		}
		return null;
	};
	oFF.QueryPreparatorFactory.put = function(modelFormat, factory) {
		oFF.QueryPreparatorFactory.s_factoryMap.put(modelFormat.getName(),
				factory);
	};
	oFF.XCommandFollowUpType = function() {
	};
	oFF.XCommandFollowUpType.prototype = new oFF.XConstant();
	oFF.XCommandFollowUpType.ALWAYS = null;
	oFF.XCommandFollowUpType.SUCCESS = null;
	oFF.XCommandFollowUpType.ERROR = null;
	oFF.XCommandFollowUpType.staticSetup = function() {
		oFF.XCommandFollowUpType.ALWAYS = oFF.XConstant.setupName(
				new oFF.XCommandFollowUpType(), "ALWAYS");
		oFF.XCommandFollowUpType.SUCCESS = oFF.XConstant.setupName(
				new oFF.XCommandFollowUpType(), "SUCCESS");
		oFF.XCommandFollowUpType.ERROR = oFF.XConstant.setupName(
				new oFF.XCommandFollowUpType(), "ERROR");
	};
	oFF.XCommandType = function() {
	};
	oFF.XCommandType.prototype = new oFF.XConstant();
	oFF.XCommandType.CUSTOM = null;
	oFF.XCommandType.ARRAY_CONCURRENT = null;
	oFF.XCommandType.ARRAY_BATCH = null;
	oFF.XCommandType.staticSetup = function() {
		oFF.XCommandType.CUSTOM = oFF.XConstant.setupName(
				new oFF.XCommandType(), "CUSTOM");
		oFF.XCommandType.ARRAY_CONCURRENT = oFF.XConstant.setupName(
				new oFF.XCommandType(), "ARRAY_CONCURRENT");
		oFF.XCommandType.ARRAY_BATCH = oFF.XConstant.setupName(
				new oFF.XCommandType(), "ARRAY_BATCH");
	};
	oFF.PlanningContextType = function() {
	};
	oFF.PlanningContextType.prototype = new oFF.XConstant();
	oFF.PlanningContextType.DATA_AREA = null;
	oFF.PlanningContextType.PLANNING_MODEL = null;
	oFF.PlanningContextType.staticSetup = function() {
		oFF.PlanningContextType.DATA_AREA = oFF.XConstant.setupName(
				new oFF.PlanningContextType(), "DATA_AREA");
		oFF.PlanningContextType.PLANNING_MODEL = oFF.XConstant.setupName(
				new oFF.PlanningContextType(), "PLANNING_MODEL");
	};
	oFF.PlanningMode = function() {
	};
	oFF.PlanningMode.prototype = new oFF.XConstant();
	oFF.PlanningMode.FOR_PRIVATE_VERSIONS_ONLY = null;
	oFF.PlanningMode.DISABLE_PLANNING = null;
	oFF.PlanningMode.FORCE_PLANNING = null;
	oFF.PlanningMode.SERVER_DEFAULT = null;
	oFF.PlanningMode.staticSetup = function() {
		oFF.PlanningMode.FOR_PRIVATE_VERSIONS_ONLY = oFF.XConstant.setupName(
				new oFF.PlanningMode(), "ForPrivateVersionsOnly");
		oFF.PlanningMode.DISABLE_PLANNING = oFF.XConstant.setupName(
				new oFF.PlanningMode(), "DisablePlanning");
		oFF.PlanningMode.FORCE_PLANNING = oFF.XConstant.setupName(
				new oFF.PlanningMode(), "ForcePlanning");
		oFF.PlanningMode.SERVER_DEFAULT = oFF.XConstant.setupName(
				new oFF.PlanningMode(), "ServerDefault");
	};
	oFF.PlanningVersionRestrictionType = function() {
	};
	oFF.PlanningVersionRestrictionType.prototype = new oFF.XConstant();
	oFF.PlanningVersionRestrictionType.NONE = null;
	oFF.PlanningVersionRestrictionType.ONLY_PRIVATE_VERSIONS = null;
	oFF.PlanningVersionRestrictionType.SERVER_DEFAULT = null;
	oFF.PlanningVersionRestrictionType.staticSetup = function() {
		oFF.PlanningVersionRestrictionType.NONE = oFF.XConstant.setupName(
				new oFF.PlanningVersionRestrictionType(), "NONE");
		oFF.PlanningVersionRestrictionType.ONLY_PRIVATE_VERSIONS = oFF.XConstant
				.setupName(new oFF.PlanningVersionRestrictionType(),
						"OnlyPrivateVersion");
		oFF.PlanningVersionRestrictionType.SERVER_DEFAULT = oFF.XConstant
				.setupName(new oFF.PlanningVersionRestrictionType(),
						"ServerDefault");
	};
	oFF.PlanningVersionSettingsMode = function() {
	};
	oFF.PlanningVersionSettingsMode.prototype = new oFF.XConstant();
	oFF.PlanningVersionSettingsMode.SERVER_DEFAULT = null;
	oFF.PlanningVersionSettingsMode.QUERY_SERVICE = null;
	oFF.PlanningVersionSettingsMode.PLANNING_SERVICE = null;
	oFF.PlanningVersionSettingsMode.staticSetup = function() {
		oFF.PlanningVersionSettingsMode.SERVER_DEFAULT = oFF.XConstant
				.setupName(new oFF.PlanningVersionSettingsMode(),
						"ServerDefault");
		oFF.PlanningVersionSettingsMode.QUERY_SERVICE = oFF.XConstant
				.setupName(new oFF.PlanningVersionSettingsMode(),
						"QueryService");
		oFF.PlanningVersionSettingsMode.PLANNING_SERVICE = oFF.XConstant
				.setupName(new oFF.PlanningVersionSettingsMode(),
						"PlanningService");
	};
	oFF.PlanningContextCommandType = function() {
	};
	oFF.PlanningContextCommandType.prototype = new oFF.XConstant();
	oFF.PlanningContextCommandType.PUBLISH = null;
	oFF.PlanningContextCommandType.SAVE = null;
	oFF.PlanningContextCommandType.BACKUP = null;
	oFF.PlanningContextCommandType.RESET = null;
	oFF.PlanningContextCommandType.REFRESH = null;
	oFF.PlanningContextCommandType.CLOSE = null;
	oFF.PlanningContextCommandType.HARD_DELETE = null;
	oFF.PlanningContextCommandType.staticSetup = function() {
		oFF.PlanningContextCommandType.PUBLISH = oFF.PlanningContextCommandType
				.create("PUBLISH", true);
		oFF.PlanningContextCommandType.SAVE = oFF.PlanningContextCommandType
				.create("SAVE", false);
		oFF.PlanningContextCommandType.BACKUP = oFF.PlanningContextCommandType
				.create("BACKUP", true);
		oFF.PlanningContextCommandType.RESET = oFF.PlanningContextCommandType
				.create("RESET", true);
		oFF.PlanningContextCommandType.REFRESH = oFF.PlanningContextCommandType
				.create("REFRESH", true);
		oFF.PlanningContextCommandType.CLOSE = oFF.PlanningContextCommandType
				.create("CLOSE", true);
		oFF.PlanningContextCommandType.HARD_DELETE = oFF.PlanningContextCommandType
				.create("HARD_DELETE", true);
	};
	oFF.PlanningContextCommandType.create = function(name,
			isInvalidatingResultSet) {
		var object = new oFF.PlanningContextCommandType();
		object.setName(name);
		object.setInvalidatingResultSet(isInvalidatingResultSet);
		return object;
	};
	oFF.PlanningContextCommandType.prototype.m_isInvalidatingResultSet = false;
	oFF.PlanningContextCommandType.prototype.isInvalidatingResultSet = function() {
		return this.m_isInvalidatingResultSet;
	};
	oFF.PlanningContextCommandType.prototype.setInvalidatingResultSet = function(
			isInvalidatingResultSet) {
		this.m_isInvalidatingResultSet = isInvalidatingResultSet;
	};
	oFF.CellLockingType = function() {
	};
	oFF.CellLockingType.prototype = new oFF.XConstant();
	oFF.CellLockingType.s_all = null;
	oFF.CellLockingType.ALL_CONTEXTS = null;
	oFF.CellLockingType.LOCAL_CONTEXT = null;
	oFF.CellLockingType.OFF = null;
	oFF.CellLockingType.DEFAULT_SETTING_BACKEND = null;
	oFF.CellLockingType.staticSetup = function() {
		oFF.CellLockingType.s_all = oFF.XSetOfNameObject.create();
		oFF.CellLockingType.ALL_CONTEXTS = oFF.CellLockingType
				.create("ALL_CONTEXTS");
		oFF.CellLockingType.LOCAL_CONTEXT = oFF.CellLockingType
				.create("LOCAL_CONTEXT");
		oFF.CellLockingType.OFF = oFF.CellLockingType.create("OFF");
		oFF.CellLockingType.DEFAULT_SETTING_BACKEND = oFF.CellLockingType
				.create("DEFAULT_SETTING_BACKEND");
	};
	oFF.CellLockingType.create = function(name) {
		var object = oFF.XConstant.setupName(new oFF.CellLockingType(), name);
		oFF.CellLockingType.s_all.add(object);
		return object;
	};
	oFF.CellLockingType.lookup = function(name) {
		return oFF.CellLockingType.s_all.getByKey(name);
	};
	oFF.CellLockingType.lookupByBWName = function(bwName) {
		if (oFF.XStringUtils.isNullOrEmpty(bwName)) {
			return oFF.CellLockingType.DEFAULT_SETTING_BACKEND;
		}
		if (oFF.XString.isEqual("X", bwName)) {
			return oFF.CellLockingType.ALL_CONTEXTS;
		}
		if (oFF.XString.isEqual("L", bwName)) {
			return oFF.CellLockingType.LOCAL_CONTEXT;
		}
		if (oFF.XString.isEqual("#", bwName)) {
			return oFF.CellLockingType.OFF;
		}
		return oFF.CellLockingType.DEFAULT_SETTING_BACKEND;
	};
	oFF.CellLockingType.lookupWithDefault = function(name, defaultValue) {
		var result = oFF.CellLockingType.s_all.getByKey(name);
		if (oFF.isNull(result)) {
			return defaultValue;
		}
		return result;
	};
	oFF.CellLockingType.prototype.toBwName = function() {
		if (this === oFF.CellLockingType.ALL_CONTEXTS) {
			return "X";
		}
		if (this === oFF.CellLockingType.LOCAL_CONTEXT) {
			return "L";
		}
		if (this === oFF.CellLockingType.OFF) {
			return "#";
		}
		if (this === oFF.CellLockingType.DEFAULT_SETTING_BACKEND) {
			return "";
		}
		throw oFF.XException
				.createRuntimeException("illegal cell locking type");
	};
	oFF.PlanningOperationType = function() {
	};
	oFF.PlanningOperationType.prototype = new oFF.XConstant();
	oFF.PlanningOperationType.PLANNING_FUNCTION = null;
	oFF.PlanningOperationType.PLANNING_SEQUENCE = null;
	oFF.PlanningOperationType.T_PLANNING_FUNCTION = "PlanningFunction";
	oFF.PlanningOperationType.T_PLANNING_SEQUENCE = "PlanningSequence";
	oFF.PlanningOperationType.staticSetup = function() {
		oFF.PlanningOperationType.PLANNING_FUNCTION = oFF.XConstant.setupName(
				new oFF.PlanningOperationType(), "PLANNING_FUNCTION");
		oFF.PlanningOperationType.PLANNING_SEQUENCE = oFF.XConstant.setupName(
				new oFF.PlanningOperationType(), "PLANNING_SEQUENCE");
	};
	oFF.PlanningOperationType.lookup = function(planningType) {
		if (oFF.XString.isEqual(planningType,
				oFF.PlanningOperationType.T_PLANNING_FUNCTION)) {
			return oFF.PlanningOperationType.PLANNING_FUNCTION;
		}
		if (oFF.XString.isEqual(planningType,
				oFF.PlanningOperationType.T_PLANNING_SEQUENCE)) {
			return oFF.PlanningOperationType.PLANNING_SEQUENCE;
		}
		return null;
	};
	oFF.PlanningSequenceStepType = function() {
	};
	oFF.PlanningSequenceStepType.prototype = new oFF.XConstant();
	oFF.PlanningSequenceStepType.s_all = null;
	oFF.PlanningSequenceStepType.SERVICE = null;
	oFF.PlanningSequenceStepType.MANUAL_ENTRY = null;
	oFF.PlanningSequenceStepType.staticSetup = function() {
		oFF.PlanningSequenceStepType.s_all = oFF.XSetOfNameObject.create();
		oFF.PlanningSequenceStepType.SERVICE = oFF.PlanningSequenceStepType
				.create("Service");
		oFF.PlanningSequenceStepType.MANUAL_ENTRY = oFF.PlanningSequenceStepType
				.create("ManualEntry");
	};
	oFF.PlanningSequenceStepType.create = function(name) {
		var object = oFF.XConstant.setupName(
				new oFF.PlanningSequenceStepType(), name);
		oFF.PlanningSequenceStepType.s_all.add(object);
		return object;
	};
	oFF.PlanningSequenceStepType.lookup = function(name) {
		return oFF.PlanningSequenceStepType.s_all.getByKey(name);
	};
	oFF.PlanningModelBehaviour = function() {
	};
	oFF.PlanningModelBehaviour.prototype = new oFF.XConstant();
	oFF.PlanningModelBehaviour.s_all = null;
	oFF.PlanningModelBehaviour.STANDARD = null;
	oFF.PlanningModelBehaviour.CREATE_DEFAULT_VERSION = null;
	oFF.PlanningModelBehaviour.ENFORCE_NO_VERSION = null;
	oFF.PlanningModelBehaviour.ENFORCE_SINGLE_VERSION = null;
	oFF.PlanningModelBehaviour.ENFORCE_NO_VERSION_HARD_DELETE = null;
	oFF.PlanningModelBehaviour.staticSetup = function() {
		oFF.PlanningModelBehaviour.s_all = oFF.XSetOfNameObject.create();
		oFF.PlanningModelBehaviour.STANDARD = oFF.PlanningModelBehaviour
				.create("STANDARD");
		oFF.PlanningModelBehaviour.CREATE_DEFAULT_VERSION = oFF.PlanningModelBehaviour
				.create("CREATE_DEFAULT_VERSION");
		oFF.PlanningModelBehaviour.ENFORCE_NO_VERSION = oFF.PlanningModelBehaviour
				.create("ENFORCE_NO_VERSION");
		oFF.PlanningModelBehaviour.ENFORCE_SINGLE_VERSION = oFF.PlanningModelBehaviour
				.create("ENFORCE_SINGLE_VERSION");
		oFF.PlanningModelBehaviour.ENFORCE_NO_VERSION_HARD_DELETE = oFF.PlanningModelBehaviour
				.create("ENFORCE_NO_VERSION_HARD_DELETE");
	};
	oFF.PlanningModelBehaviour.create = function(name) {
		var object = oFF.XConstant.setupName(new oFF.PlanningModelBehaviour(),
				name);
		oFF.PlanningModelBehaviour.s_all.add(object);
		return object;
	};
	oFF.PlanningModelBehaviour.lookup = function(name) {
		return oFF.PlanningModelBehaviour.s_all.getByKey(name);
	};
	oFF.PlanningModelBehaviour.lookupWithDefault = function(name, defaultValue) {
		var result = oFF.PlanningModelBehaviour.s_all.getByKey(name);
		if (oFF.isNull(result)) {
			return defaultValue;
		}
		return result;
	};
	oFF.PlanningPersistenceType = function() {
	};
	oFF.PlanningPersistenceType.prototype = new oFF.XConstant();
	oFF.PlanningPersistenceType.s_all = null;
	oFF.PlanningPersistenceType.DEFAULT = null;
	oFF.PlanningPersistenceType.ALWAYS = null;
	oFF.PlanningPersistenceType.NON_PUBLISH_CONTAINERS = null;
	oFF.PlanningPersistenceType.NEVER = null;
	oFF.PlanningPersistenceType.AUTO = null;
	oFF.PlanningPersistenceType.staticSetup = function() {
		oFF.PlanningPersistenceType.s_all = oFF.XSetOfNameObject.create();
		oFF.PlanningPersistenceType.DEFAULT = oFF.PlanningPersistenceType
				.create("default");
		oFF.PlanningPersistenceType.ALWAYS = oFF.PlanningPersistenceType
				.create("always");
		oFF.PlanningPersistenceType.NON_PUBLISH_CONTAINERS = oFF.PlanningPersistenceType
				.create("non_publish_containers");
		oFF.PlanningPersistenceType.NEVER = oFF.PlanningPersistenceType
				.create("never");
		oFF.PlanningPersistenceType.AUTO = oFF.PlanningPersistenceType
				.create("auto");
	};
	oFF.PlanningPersistenceType.create = function(name) {
		var object = oFF.XConstant.setupName(new oFF.PlanningPersistenceType(),
				name);
		oFF.PlanningPersistenceType.s_all.add(object);
		return object;
	};
	oFF.PlanningPersistenceType.lookup = function(name) {
		return oFF.PlanningPersistenceType.s_all.getByKey(name);
	};
	oFF.PlanningPersistenceType.lookupWithDefault = function(name, defaultValue) {
		var result = oFF.PlanningPersistenceType.s_all.getByKey(name);
		if (oFF.isNull(result)) {
			return defaultValue;
		}
		return result;
	};
	oFF.PlanningPrivilege = function() {
	};
	oFF.PlanningPrivilege.prototype = new oFF.XConstant();
	oFF.PlanningPrivilege.s_all = null;
	oFF.PlanningPrivilege.READ = null;
	oFF.PlanningPrivilege.WRITE = null;
	oFF.PlanningPrivilege.PUBLISH = null;
	oFF.PlanningPrivilege.OWNER = null;
	oFF.PlanningPrivilege.staticSetup = function() {
		oFF.PlanningPrivilege.s_all = oFF.XSetOfNameObject.create();
		oFF.PlanningPrivilege.READ = oFF.PlanningPrivilege.create("read");
		oFF.PlanningPrivilege.WRITE = oFF.PlanningPrivilege.create("write");
		oFF.PlanningPrivilege.PUBLISH = oFF.PlanningPrivilege.create("publish");
		oFF.PlanningPrivilege.OWNER = oFF.PlanningPrivilege.create("owner");
	};
	oFF.PlanningPrivilege.create = function(name) {
		var object = oFF.XConstant.setupName(new oFF.PlanningPrivilege(), name);
		oFF.PlanningPrivilege.s_all.add(object);
		return object;
	};
	oFF.PlanningPrivilege.lookup = function(name) {
		return oFF.PlanningPrivilege.s_all.getByKey(name);
	};
	oFF.PlanningPrivilege.lookupWithDefault = function(name, defaultValue) {
		var result = oFF.PlanningPrivilege.s_all.getByKey(name);
		if (oFF.isNull(result)) {
			return defaultValue;
		}
		return result;
	};
	oFF.PlanningPrivilegeState = function() {
	};
	oFF.PlanningPrivilegeState.prototype = new oFF.XConstant();
	oFF.PlanningPrivilegeState.s_all = null;
	oFF.PlanningPrivilegeState.NEW = null;
	oFF.PlanningPrivilegeState.GRANTED = null;
	oFF.PlanningPrivilegeState.TO_BE_GRANTED = null;
	oFF.PlanningPrivilegeState.TO_BE_REVOKED = null;
	oFF.PlanningPrivilegeState.staticSetup = function() {
		oFF.PlanningPrivilegeState.s_all = oFF.XSetOfNameObject.create();
		oFF.PlanningPrivilegeState.NEW = oFF.PlanningPrivilegeState
				.create("new");
		oFF.PlanningPrivilegeState.GRANTED = oFF.PlanningPrivilegeState
				.create("granted");
		oFF.PlanningPrivilegeState.TO_BE_GRANTED = oFF.PlanningPrivilegeState
				.create("to_be_granted");
		oFF.PlanningPrivilegeState.TO_BE_REVOKED = oFF.PlanningPrivilegeState
				.create("to_be_revoked");
	};
	oFF.PlanningPrivilegeState.create = function(name) {
		var object = oFF.XConstant.setupName(new oFF.PlanningPrivilegeState(),
				name);
		oFF.PlanningPrivilegeState.s_all.add(object);
		return object;
	};
	oFF.PlanningPrivilegeState.lookup = function(name) {
		return oFF.PlanningPrivilegeState.s_all.getByKey(name);
	};
	oFF.PlanningPrivilegeState.lookupWithDefault = function(name, defaultValue) {
		var result = oFF.PlanningPrivilegeState.s_all.getByKey(name);
		if (oFF.isNull(result)) {
			return defaultValue;
		}
		return result;
	};
	oFF.PlanningVersionState = function() {
	};
	oFF.PlanningVersionState.prototype = new oFF.XConstant();
	oFF.PlanningVersionState.s_all = null;
	oFF.PlanningVersionState.CHANGED = null;
	oFF.PlanningVersionState.UNCHANGED = null;
	oFF.PlanningVersionState.CLEAN = null;
	oFF.PlanningVersionState.DIRTY = null;
	oFF.PlanningVersionState.RECOVERED = null;
	oFF.PlanningVersionState.SLEEPING = null;
	oFF.PlanningVersionState.staticSetup = function() {
		oFF.PlanningVersionState.s_all = oFF.XSetOfNameObject.create();
		oFF.PlanningVersionState.CHANGED = oFF.PlanningVersionState.create(
				"changed", true);
		oFF.PlanningVersionState.UNCHANGED = oFF.PlanningVersionState.create(
				"unchanged", true);
		oFF.PlanningVersionState.CLEAN = oFF.PlanningVersionState.create(
				"clean", false);
		oFF.PlanningVersionState.DIRTY = oFF.PlanningVersionState.create(
				"dirty", false);
		oFF.PlanningVersionState.RECOVERED = oFF.PlanningVersionState.create(
				"recovered", false);
		oFF.PlanningVersionState.SLEEPING = oFF.PlanningVersionState.create(
				"sleeping", false);
	};
	oFF.PlanningVersionState.create = function(name, isActive) {
		var object = oFF.XConstant.setupName(new oFF.PlanningVersionState(),
				name);
		object.m_active = isActive;
		oFF.PlanningVersionState.s_all.add(object);
		return object;
	};
	oFF.PlanningVersionState.lookup = function(name) {
		return oFF.PlanningVersionState.s_all.getByKey(name);
	};
	oFF.PlanningVersionState.prototype.m_active = false;
	oFF.PlanningVersionState.prototype.isActive = function() {
		return this.m_active;
	};
	oFF.CloseModeType = function() {
	};
	oFF.CloseModeType.prototype = new oFF.XConstant();
	oFF.CloseModeType.s_all = null;
	oFF.CloseModeType.BACKUP = null;
	oFF.CloseModeType.SAVE = null;
	oFF.CloseModeType.NONE = null;
	oFF.CloseModeType.KILL_ACTION_SEQUENCE = null;
	oFF.CloseModeType.DISCARD = null;
	oFF.CloseModeType.KILL_ACTION_SEQUENCE_AND_DISCARD = null;
	oFF.CloseModeType.staticSetup = function() {
		oFF.CloseModeType.s_all = oFF.XSetOfNameObject.create();
		oFF.CloseModeType.BACKUP = oFF.CloseModeType.create("BACKUP", false,
				false);
		oFF.CloseModeType.SAVE = oFF.CloseModeType.create("SAVE", false, false);
		oFF.CloseModeType.NONE = oFF.CloseModeType.create("NONE", true, false);
		oFF.CloseModeType.KILL_ACTION_SEQUENCE = oFF.CloseModeType.create(
				"KILL_ACTION_SEQUENCE", true, true);
		oFF.CloseModeType.DISCARD = oFF.CloseModeType.create("DISCARD", false,
				false);
		oFF.CloseModeType.KILL_ACTION_SEQUENCE_AND_DISCARD = oFF.CloseModeType
				.create("KILL_ACTION_SEQUENCE_AND_DISCARD", false, true);
	};
	oFF.CloseModeType.create = function(name, onlyClient, killActionSequence) {
		var object = oFF.XConstant.setupName(new oFF.CloseModeType(), name);
		object.m_onlyClient = onlyClient;
		object.m_killActionSequence = killActionSequence;
		oFF.CloseModeType.s_all.add(object);
		return object;
	};
	oFF.CloseModeType.lookup = function(name) {
		return oFF.CloseModeType.s_all.getByKey(name);
	};
	oFF.CloseModeType.lookupWithDefault = function(name, defaultValue) {
		var result = oFF.CloseModeType.s_all.getByKey(name);
		if (oFF.isNull(result)) {
			return defaultValue;
		}
		return result;
	};
	oFF.CloseModeType.prototype.m_onlyClient = false;
	oFF.CloseModeType.prototype.m_killActionSequence = false;
	oFF.CloseModeType.prototype.isOnlyClient = function() {
		return this.m_onlyClient;
	};
	oFF.CloseModeType.prototype.isWithKillActionSequence = function() {
		return this.m_killActionSequence;
	};
	oFF.RestoreBackupType = function() {
	};
	oFF.RestoreBackupType.prototype = new oFF.XConstant();
	oFF.RestoreBackupType.s_all = null;
	oFF.RestoreBackupType.RESTORE_TRUE = null;
	oFF.RestoreBackupType.RESTORE_FALSE = null;
	oFF.RestoreBackupType.NONE = null;
	oFF.RestoreBackupType.staticSetup = function() {
		oFF.RestoreBackupType.s_all = oFF.XSetOfNameObject.create();
		oFF.RestoreBackupType.RESTORE_TRUE = oFF.RestoreBackupType
				.create("TRUE");
		oFF.RestoreBackupType.RESTORE_FALSE = oFF.RestoreBackupType
				.create("FALSE");
		oFF.RestoreBackupType.NONE = oFF.RestoreBackupType.create("NONE");
	};
	oFF.RestoreBackupType.create = function(name) {
		var object = oFF.XConstant.setupName(new oFF.RestoreBackupType(), name);
		oFF.RestoreBackupType.s_all.add(object);
		return object;
	};
	oFF.RestoreBackupType.lookup = function(name) {
		return oFF.RestoreBackupType.s_all.getByKey(name);
	};
	oFF.RestoreBackupType.lookupWithDefault = function(name, defaultValue) {
		var result = oFF.RestoreBackupType.s_all.getByKey(name);
		if (oFF.isNull(result)) {
			return defaultValue;
		}
		return result;
	};
	oFF.BlendingLinkType = function() {
	};
	oFF.BlendingLinkType.prototype = new oFF.XConstant();
	oFF.BlendingLinkType.s_all = null;
	oFF.BlendingLinkType.NONE = null;
	oFF.BlendingLinkType.COEXIST = null;
	oFF.BlendingLinkType.PRIMARY = null;
	oFF.BlendingLinkType.ALL_DATA = null;
	oFF.BlendingLinkType.INTERSECT = null;
	oFF.BlendingLinkType.staticSetup = function() {
		oFF.BlendingLinkType.s_all = oFF.XSetOfNameObject.create();
		oFF.BlendingLinkType.NONE = oFF.BlendingLinkType.create("None");
		oFF.BlendingLinkType.COEXIST = oFF.BlendingLinkType.create("Coexist");
		oFF.BlendingLinkType.PRIMARY = oFF.BlendingLinkType.create("Primary");
		oFF.BlendingLinkType.ALL_DATA = oFF.BlendingLinkType.create("AllData");
		oFF.BlendingLinkType.INTERSECT = oFF.BlendingLinkType
				.create("Intersect");
	};
	oFF.BlendingLinkType.create = function(name) {
		var newConstant = oFF.XConstant.setupName(new oFF.BlendingLinkType(),
				name);
		oFF.BlendingLinkType.s_all.add(newConstant);
		return newConstant;
	};
	oFF.BlendingLinkType.lookup = function(name) {
		return oFF.BlendingLinkType.s_all.getByKey(name);
	};
	oFF.BlendingMappingDefinitionType = function() {
	};
	oFF.BlendingMappingDefinitionType.prototype = new oFF.XConstant();
	oFF.BlendingMappingDefinitionType.s_all = null;
	oFF.BlendingMappingDefinitionType.DIMENSION = null;
	oFF.BlendingMappingDefinitionType.ATTRIBUTE = null;
	oFF.BlendingMappingDefinitionType.CONSTANT = null;
	oFF.BlendingMappingDefinitionType.staticSetup = function() {
		oFF.BlendingMappingDefinitionType.s_all = oFF.XSetOfNameObject.create();
		oFF.BlendingMappingDefinitionType.DIMENSION = oFF.BlendingMappingDefinitionType
				.create("Dimension");
		oFF.BlendingMappingDefinitionType.ATTRIBUTE = oFF.BlendingMappingDefinitionType
				.create("Attribute");
		oFF.BlendingMappingDefinitionType.CONSTANT = oFF.BlendingMappingDefinitionType
				.create("Constant");
	};
	oFF.BlendingMappingDefinitionType.create = function(name) {
		var newConstant = oFF.XConstant.setupName(
				new oFF.BlendingMappingDefinitionType(), name);
		oFF.BlendingMappingDefinitionType.s_all.add(newConstant);
		return newConstant;
	};
	oFF.BlendingMappingDefinitionType.lookup = function(name) {
		return oFF.BlendingMappingDefinitionType.s_all.getByKey(name);
	};
	oFF.BlendingMappingDefinitionType.lookupWithDefault = function(name,
			defaultValue) {
		var mode = oFF.BlendingMappingDefinitionType.lookup(name);
		if (oFF.isNull(mode)) {
			return defaultValue;
		}
		return mode;
	};
	oFF.ActionChoice = function() {
	};
	oFF.ActionChoice.prototype = new oFF.XConstant();
	oFF.ActionChoice.OFF = null;
	oFF.ActionChoice.ONCE = null;
	oFF.ActionChoice.ON = null;
	oFF.ActionChoice.staticSetup = function() {
		oFF.ActionChoice.OFF = oFF.XConstant.setupName(new oFF.ActionChoice(),
				"Off");
		oFF.ActionChoice.ONCE = oFF.XConstant.setupName(new oFF.ActionChoice(),
				"Once");
		oFF.ActionChoice.ON = oFF.XConstant.setupName(new oFF.ActionChoice(),
				"On");
	};
	oFF.AggregationType = function() {
	};
	oFF.AggregationType.prototype = new oFF.XConstant();
	oFF.AggregationType.s_all = null;
	oFF.AggregationType.AVERAGE = null;
	oFF.AggregationType.COUNT = null;
	oFF.AggregationType.COUNT_DISTINCT = null;
	oFF.AggregationType.FIRST = null;
	oFF.AggregationType.LAST = null;
	oFF.AggregationType.MAX = null;
	oFF.AggregationType.MIN = null;
	oFF.AggregationType.RANK = null;
	oFF.AggregationType.RANK_DENSE = null;
	oFF.AggregationType.RANK_OLYMPIC = null;
	oFF.AggregationType.RANK_PERCENTILE = null;
	oFF.AggregationType.RANK_PERCENT = null;
	oFF.AggregationType.SUM = null;
	oFF.AggregationType.STANDARD_DEVIATION = null;
	oFF.AggregationType.VARIANCE = null;
	oFF.AggregationType.NOP_NULL = null;
	oFF.AggregationType.NOP_NULL_ZERO = null;
	oFF.AggregationType.AVERAGE_NULL = null;
	oFF.AggregationType.AVERAGE_NULL_ZERO = null;
	oFF.AggregationType.COUNT_NULL = null;
	oFF.AggregationType.COUNT_NULL_ZERO = null;
	oFF.AggregationType.MEDIAN = null;
	oFF.AggregationType.MEDIAN_NULL = null;
	oFF.AggregationType.MEDIAN_NULL_ZERO = null;
	oFF.AggregationType.FIRST_QUARTILE = null;
	oFF.AggregationType.FIRST_QUARTILE_NULL = null;
	oFF.AggregationType.FIRST_QUARTILE_NULL_ZERO = null;
	oFF.AggregationType.THIRD_QUARTILE = null;
	oFF.AggregationType.THIRD_QUARTILE_NULL = null;
	oFF.AggregationType.THIRD_QUARTILE_NULL_ZERO = null;
	oFF.AggregationType.OUTLIERS = null;
	oFF.AggregationType.OUTLIERS_NULL = null;
	oFF.AggregationType.OUTLIERS_NULL_ZERO = null;
	oFF.AggregationType.staticSetup = function() {
		oFF.AggregationType.s_all = oFF.XSetOfNameObject.create();
		oFF.AggregationType.AVERAGE = oFF.AggregationType.create("AVERAGE");
		oFF.AggregationType.COUNT = oFF.AggregationType.create("COUNT");
		oFF.AggregationType.COUNT_DISTINCT = oFF.AggregationType
				.create("COUNT_DISTINCT");
		oFF.AggregationType.FIRST = oFF.AggregationType.create("FIRST");
		oFF.AggregationType.LAST = oFF.AggregationType.create("LAST");
		oFF.AggregationType.MAX = oFF.AggregationType.create("MAX");
		oFF.AggregationType.MIN = oFF.AggregationType.create("MIN");
		oFF.AggregationType.RANK = oFF.AggregationType.create("RANK");
		oFF.AggregationType.RANK_DENSE = oFF.AggregationType
				.create("RANK_DENSE");
		oFF.AggregationType.RANK_OLYMPIC = oFF.AggregationType
				.create("RANK_OLYMPIC");
		oFF.AggregationType.RANK_PERCENTILE = oFF.AggregationType
				.create("RANK_PERCENTILE");
		oFF.AggregationType.RANK_PERCENT = oFF.AggregationType
				.create("RANK_PERCENT");
		oFF.AggregationType.SUM = oFF.AggregationType.create("SUM");
		oFF.AggregationType.STANDARD_DEVIATION = oFF.AggregationType
				.create("STANDARD_DEVIATION");
		oFF.AggregationType.VARIANCE = oFF.AggregationType.create("VARIANCE");
		oFF.AggregationType.NOP_NULL = oFF.AggregationType.create("NOPNULL");
		oFF.AggregationType.NOP_NULL_ZERO = oFF.AggregationType
				.create("NOPNULLZERO");
		oFF.AggregationType.AVERAGE_NULL = oFF.AggregationType
				.create("AVERAGENULL");
		oFF.AggregationType.AVERAGE_NULL_ZERO = oFF.AggregationType
				.create("AVERAGENULLZERO");
		oFF.AggregationType.COUNT_NULL = oFF.AggregationType
				.create("COUNTNULL");
		oFF.AggregationType.COUNT_NULL_ZERO = oFF.AggregationType
				.create("COUNTNULLZERO");
		oFF.AggregationType.MEDIAN = oFF.AggregationType.create("MEDIAN");
		oFF.AggregationType.MEDIAN_NULL = oFF.AggregationType
				.create("MEDIANNULL");
		oFF.AggregationType.MEDIAN_NULL_ZERO = oFF.AggregationType
				.create("MEDIANNULLZERO");
		oFF.AggregationType.FIRST_QUARTILE = oFF.AggregationType
				.create("1STQUARTILE");
		oFF.AggregationType.FIRST_QUARTILE_NULL = oFF.AggregationType
				.create("1STQUARTILENULL");
		oFF.AggregationType.FIRST_QUARTILE_NULL_ZERO = oFF.AggregationType
				.create("1STQUARTILENULLZERO");
		oFF.AggregationType.THIRD_QUARTILE = oFF.AggregationType
				.create("3RDQUARTILE");
		oFF.AggregationType.THIRD_QUARTILE_NULL = oFF.AggregationType
				.create("3RDQUARTILENULL");
		oFF.AggregationType.THIRD_QUARTILE_NULL_ZERO = oFF.AggregationType
				.create("3RDQUARTILENULLZERO");
		oFF.AggregationType.OUTLIERS = oFF.AggregationType.create("OUTLIERS");
		oFF.AggregationType.OUTLIERS_NULL = oFF.AggregationType
				.create("OUTLIERSNULL");
		oFF.AggregationType.OUTLIERS_NULL_ZERO = oFF.AggregationType
				.create("OUTLIERSNULLZERO");
	};
	oFF.AggregationType.create = function(name) {
		var newConstant = oFF.XConstant.setupName(new oFF.AggregationType(),
				name);
		oFF.AggregationType.s_all.add(newConstant);
		return newConstant;
	};
	oFF.AggregationType.lookupOrCreate = function(name) {
		var aggrType;
		if (oFF.XStringUtils.isNullOrEmpty(name)) {
			return null;
		}
		aggrType = oFF.AggregationType.lookup(name);
		if (oFF.isNull(aggrType)) {
			aggrType = oFF.AggregationType.create(name);
		}
		return aggrType;
	};
	oFF.AggregationType.lookup = function(name) {
		return oFF.AggregationType.s_all.getByKey(name);
	};
	oFF.AggregationType.getAll = function() {
		return oFF.AggregationType.s_all;
	};
	oFF.AlertCategory = function() {
	};
	oFF.AlertCategory.prototype = new oFF.XConstant();
	oFF.AlertCategory.NORMAL = null;
	oFF.AlertCategory.GOOD = null;
	oFF.AlertCategory.CRITICAL = null;
	oFF.AlertCategory.BAD = null;
	oFF.AlertCategory.staticSetup = function() {
		oFF.AlertCategory.NORMAL = oFF.AlertCategory.create("NORMAL", 0);
		oFF.AlertCategory.GOOD = oFF.AlertCategory.create("GOOD", 1);
		oFF.AlertCategory.CRITICAL = oFF.AlertCategory.create("CRITICAL", 2);
		oFF.AlertCategory.BAD = oFF.AlertCategory.create("BAD", 3);
	};
	oFF.AlertCategory.create = function(name, priority) {
		var object = oFF.XConstant.setupName(new oFF.AlertCategory(), name);
		object.m_priority = priority;
		return object;
	};
	oFF.AlertCategory.prototype.m_priority = 0;
	oFF.AlertCategory.prototype.getPriority = function() {
		return this.m_priority;
	};
	oFF.AlertLevel = function() {
	};
	oFF.AlertLevel.prototype = new oFF.XConstant();
	oFF.AlertLevel.NORMAL = null;
	oFF.AlertLevel.GOOD_1 = null;
	oFF.AlertLevel.GOOD_2 = null;
	oFF.AlertLevel.GOOD_3 = null;
	oFF.AlertLevel.CRITICAL_1 = null;
	oFF.AlertLevel.CRITICAL_2 = null;
	oFF.AlertLevel.CRITICAL_3 = null;
	oFF.AlertLevel.BAD_1 = null;
	oFF.AlertLevel.BAD_2 = null;
	oFF.AlertLevel.BAD_3 = null;
	oFF.AlertLevel.staticSetup = function() {
		oFF.AlertLevel.NORMAL = oFF.AlertLevel.create(0,
				oFF.AlertCategory.NORMAL, 1);
		oFF.AlertLevel.GOOD_1 = oFF.AlertLevel.create(1,
				oFF.AlertCategory.GOOD, 1);
		oFF.AlertLevel.GOOD_2 = oFF.AlertLevel.create(2,
				oFF.AlertCategory.GOOD, 2);
		oFF.AlertLevel.GOOD_3 = oFF.AlertLevel.create(3,
				oFF.AlertCategory.GOOD, 3);
		oFF.AlertLevel.CRITICAL_1 = oFF.AlertLevel.create(4,
				oFF.AlertCategory.CRITICAL, 1);
		oFF.AlertLevel.CRITICAL_2 = oFF.AlertLevel.create(5,
				oFF.AlertCategory.CRITICAL, 2);
		oFF.AlertLevel.CRITICAL_3 = oFF.AlertLevel.create(6,
				oFF.AlertCategory.CRITICAL, 3);
		oFF.AlertLevel.BAD_1 = oFF.AlertLevel.create(7, oFF.AlertCategory.BAD,
				1);
		oFF.AlertLevel.BAD_2 = oFF.AlertLevel.create(8, oFF.AlertCategory.BAD,
				2);
		oFF.AlertLevel.BAD_3 = oFF.AlertLevel.create(9, oFF.AlertCategory.BAD,
				3);
	};
	oFF.AlertLevel.create = function(value, category, priority) {
		var object = new oFF.AlertLevel();
		object.setupExt(value, priority, category);
		return object;
	};
	oFF.AlertLevel.prototype.m_priority = 0;
	oFF.AlertLevel.prototype.m_category = null;
	oFF.AlertLevel.prototype.m_level = 0;
	oFF.AlertLevel.prototype.setupExt = function(value, priority, category) {
		this.setName(oFF.XInteger.convertToString(value));
		this.m_priority = priority;
		this.m_level = value;
		this.m_category = category;
	};
	oFF.AlertLevel.prototype.getPriority = function() {
		return this.m_priority;
	};
	oFF.AlertLevel.prototype.getLevel = function() {
		return this.m_level;
	};
	oFF.AlertLevel.prototype.getCategory = function() {
		return this.m_category;
	};
	oFF.Alignment = function() {
	};
	oFF.Alignment.prototype = new oFF.XConstant();
	oFF.Alignment.DEFAULT_VALUE = null;
	oFF.Alignment.CHILDREN_BELOW_PARENT = null;
	oFF.Alignment.CHILDREN_ABOVE_PARENT = null;
	oFF.Alignment.staticSetup = function() {
		oFF.Alignment.DEFAULT_VALUE = oFF.XConstant.setupName(
				new oFF.Alignment(), "Default");
		oFF.Alignment.CHILDREN_BELOW_PARENT = oFF.XConstant.setupName(
				new oFF.Alignment(), "Below");
		oFF.Alignment.CHILDREN_ABOVE_PARENT = oFF.XConstant.setupName(
				new oFF.Alignment(), "Above");
	};
	oFF.ClusterAlgorithm = function() {
	};
	oFF.ClusterAlgorithm.prototype = new oFF.XConstant();
	oFF.ClusterAlgorithm.K_MEANS = null;
	oFF.ClusterAlgorithm.GRID = null;
	oFF.ClusterAlgorithm.DB_SCAN = null;
	oFF.ClusterAlgorithm.staticSetup = function() {
		oFF.ClusterAlgorithm.K_MEANS = oFF.XConstant.setupName(
				new oFF.ClusterAlgorithm(), "K-Means");
		oFF.ClusterAlgorithm.GRID = oFF.XConstant.setupName(
				new oFF.ClusterAlgorithm(), "Grid");
		oFF.ClusterAlgorithm.DB_SCAN = oFF.XConstant.setupName(
				new oFF.ClusterAlgorithm(), "DB-Scan");
	};
	oFF.ConditionDimensionEvaluationType = function() {
	};
	oFF.ConditionDimensionEvaluationType.prototype = new oFF.XConstant();
	oFF.ConditionDimensionEvaluationType.ALL_IN_DRILL_DOWN = null;
	oFF.ConditionDimensionEvaluationType.MOST_DETAILED_ON_ROWS = null;
	oFF.ConditionDimensionEvaluationType.MOST_DETAILED_ON_COLS = null;
	oFF.ConditionDimensionEvaluationType.GIVEN_LIST = null;
	oFF.ConditionDimensionEvaluationType.s_lookupNames = null;
	oFF.ConditionDimensionEvaluationType.staticSetup = function() {
		oFF.ConditionDimensionEvaluationType.s_lookupNames = oFF.XHashMapByString
				.create();
		oFF.ConditionDimensionEvaluationType.ALL_IN_DRILL_DOWN = oFF.ConditionDimensionEvaluationType
				.create("allInDrilldown");
		oFF.ConditionDimensionEvaluationType.MOST_DETAILED_ON_ROWS = oFF.ConditionDimensionEvaluationType
				.create("mostDetailedOnRows");
		oFF.ConditionDimensionEvaluationType.MOST_DETAILED_ON_COLS = oFF.ConditionDimensionEvaluationType
				.create("mostDetailedOnCols");
		oFF.ConditionDimensionEvaluationType.GIVEN_LIST = oFF.ConditionDimensionEvaluationType
				.create("givenList");
	};
	oFF.ConditionDimensionEvaluationType.create = function(name) {
		var newObj = oFF.XConstant.setupName(
				new oFF.ConditionDimensionEvaluationType(), name);
		oFF.ConditionDimensionEvaluationType.s_lookupNames.put(name, newObj);
		return newObj;
	};
	oFF.ConditionDimensionEvaluationType.lookupName = function(name) {
		return oFF.ConditionDimensionEvaluationType.s_lookupNames
				.getByKey(name);
	};
	oFF.CurrencyTranslationOperation = function() {
	};
	oFF.CurrencyTranslationOperation.prototype = new oFF.XConstant();
	oFF.CurrencyTranslationOperation.TARGET = null;
	oFF.CurrencyTranslationOperation.DEFINITION = null;
	oFF.CurrencyTranslationOperation.BOTH = null;
	oFF.CurrencyTranslationOperation.ORIGINAL = null;
	oFF.CurrencyTranslationOperation.s_lookup = null;
	oFF.CurrencyTranslationOperation.staticSetup = function() {
		oFF.CurrencyTranslationOperation.s_lookup = oFF.XHashMapByString
				.create();
		oFF.CurrencyTranslationOperation.TARGET = oFF.CurrencyTranslationOperation
				.createCurrencyTranslationOperation("Target");
		oFF.CurrencyTranslationOperation.DEFINITION = oFF.CurrencyTranslationOperation
				.createCurrencyTranslationOperation("Definition");
		oFF.CurrencyTranslationOperation.BOTH = oFF.CurrencyTranslationOperation
				.createCurrencyTranslationOperation("Both");
		oFF.CurrencyTranslationOperation.ORIGINAL = oFF.CurrencyTranslationOperation
				.createCurrencyTranslationOperation("Original");
	};
	oFF.CurrencyTranslationOperation.createCurrencyTranslationOperation = function(
			name) {
		var newConstant = oFF.XConstant.setupName(
				new oFF.CurrencyTranslationOperation(), name);
		oFF.CurrencyTranslationOperation.s_lookup.put(name, newConstant);
		return newConstant;
	};
	oFF.CurrencyTranslationOperation.lookup = function(name) {
		return oFF.CurrencyTranslationOperation.s_lookup.getByKey(name);
	};
	oFF.CurrentMemberFunction = function() {
	};
	oFF.CurrentMemberFunction.prototype = new oFF.XConstant();
	oFF.CurrentMemberFunction.ASCENDANTS = null;
	oFF.CurrentMemberFunction.CHILDREN = null;
	oFF.CurrentMemberFunction.FIRST_CHILD = null;
	oFF.CurrentMemberFunction.FIRST_SIBLING = null;
	oFF.CurrentMemberFunction.LAST_CHILD = null;
	oFF.CurrentMemberFunction.LAST_SIBLING = null;
	oFF.CurrentMemberFunction.LEAVES = null;
	oFF.CurrentMemberFunction.MTD = null;
	oFF.CurrentMemberFunction.NEXT_MEMBER = null;
	oFF.CurrentMemberFunction.PARENT = null;
	oFF.CurrentMemberFunction.PREV_MEMBER = null;
	oFF.CurrentMemberFunction.QTD = null;
	oFF.CurrentMemberFunction.SIBLINGS = null;
	oFF.CurrentMemberFunction.WTD = null;
	oFF.CurrentMemberFunction.YTD = null;
	oFF.CurrentMemberFunction.DEFAULT_MEMBER = null;
	oFF.CurrentMemberFunction.ANCESTOR = null;
	oFF.CurrentMemberFunction.ANCESTOR_UP_TO_LEVEL = null;
	oFF.CurrentMemberFunction.CLOSING_PERIOD = null;
	oFF.CurrentMemberFunction.COUSIN = null;
	oFF.CurrentMemberFunction.DESCENDANTS = null;
	oFF.CurrentMemberFunction.DISTINCT = null;
	oFF.CurrentMemberFunction.DRILLDOWN_LEVEL = null;
	oFF.CurrentMemberFunction.DRILLDOWN_MEMBER = null;
	oFF.CurrentMemberFunction.DRILLUP_LEVEL = null;
	oFF.CurrentMemberFunction.DRILLUP_MEMBER = null;
	oFF.CurrentMemberFunction.HEAD = null;
	oFF.CurrentMemberFunction.HIERARCHIZE = null;
	oFF.CurrentMemberFunction.LAG = null;
	oFF.CurrentMemberFunction.LAST_PERIODS = null;
	oFF.CurrentMemberFunction.LEAD = null;
	oFF.CurrentMemberFunction.MEMBERS = null;
	oFF.CurrentMemberFunction.MEMBERS_ASCENDANTS_DESCENDANTS = null;
	oFF.CurrentMemberFunction.OPENING_PERIOD = null;
	oFF.CurrentMemberFunction.PARALLEL_PERIOD = null;
	oFF.CurrentMemberFunction.PERIODS_TO_DATE = null;
	oFF.CurrentMemberFunction.RANGE = null;
	oFF.CurrentMemberFunction.SUBSET = null;
	oFF.CurrentMemberFunction.TAIL = null;
	oFF.CurrentMemberFunction.UNION = null;
	oFF.CurrentMemberFunction.INA_PARALLEL_PERIOD = null;
	oFF.CurrentMemberFunction.INA_SHIFT_PERIOD = null;
	oFF.CurrentMemberFunction.INA_TO_DATE = null;
	oFF.CurrentMemberFunction.INA_LAST_PERIODS = null;
	oFF.CurrentMemberFunction.INA_CURRENT = null;
	oFF.CurrentMemberFunction.s_all = null;
	oFF.CurrentMemberFunction.staticSetup = function() {
		oFF.CurrentMemberFunction.s_all = oFF.XSetOfNameObject.create();
		oFF.CurrentMemberFunction.ASCENDANTS = oFF.CurrentMemberFunction
				.create("Ascendants");
		oFF.CurrentMemberFunction.CHILDREN = oFF.CurrentMemberFunction
				.create("Children");
		oFF.CurrentMemberFunction.FIRST_CHILD = oFF.CurrentMemberFunction
				.create("FirstChild");
		oFF.CurrentMemberFunction.FIRST_SIBLING = oFF.CurrentMemberFunction
				.create("FirstSibling");
		oFF.CurrentMemberFunction.LAST_CHILD = oFF.CurrentMemberFunction
				.create("LastChild");
		oFF.CurrentMemberFunction.LAST_SIBLING = oFF.CurrentMemberFunction
				.create("LastSibling");
		oFF.CurrentMemberFunction.LEAVES = oFF.CurrentMemberFunction
				.create("Leaves");
		oFF.CurrentMemberFunction.MTD = oFF.CurrentMemberFunction.create("MTD");
		oFF.CurrentMemberFunction.NEXT_MEMBER = oFF.CurrentMemberFunction
				.create("NextMember");
		oFF.CurrentMemberFunction.PARENT = oFF.CurrentMemberFunction
				.create("Parent");
		oFF.CurrentMemberFunction.PREV_MEMBER = oFF.CurrentMemberFunction
				.create("PrevMember");
		oFF.CurrentMemberFunction.QTD = oFF.CurrentMemberFunction.create("QTD");
		oFF.CurrentMemberFunction.SIBLINGS = oFF.CurrentMemberFunction
				.create("Siblings");
		oFF.CurrentMemberFunction.WTD = oFF.CurrentMemberFunction.create("WTD");
		oFF.CurrentMemberFunction.YTD = oFF.CurrentMemberFunction.create("YTD");
		oFF.CurrentMemberFunction.DEFAULT_MEMBER = oFF.CurrentMemberFunction
				.create("DefaultMember");
		oFF.CurrentMemberFunction.ANCESTOR = oFF.CurrentMemberFunction
				.create("Ancestor");
		oFF.CurrentMemberFunction.ANCESTOR_UP_TO_LEVEL = oFF.CurrentMemberFunction
				.create("AncestorUpToLevel");
		oFF.CurrentMemberFunction.CLOSING_PERIOD = oFF.CurrentMemberFunction
				.create("ClosingPeriod");
		oFF.CurrentMemberFunction.COUSIN = oFF.CurrentMemberFunction
				.create("Cousin");
		oFF.CurrentMemberFunction.DESCENDANTS = oFF.CurrentMemberFunction
				.create("Descendants");
		oFF.CurrentMemberFunction.DISTINCT = oFF.CurrentMemberFunction
				.create("Distinct");
		oFF.CurrentMemberFunction.DRILLDOWN_LEVEL = oFF.CurrentMemberFunction
				.create("DrillDownLevel");
		oFF.CurrentMemberFunction.DRILLDOWN_MEMBER = oFF.CurrentMemberFunction
				.create("DrillDownMember");
		oFF.CurrentMemberFunction.DRILLUP_LEVEL = oFF.CurrentMemberFunction
				.create("DrillUpLevel");
		oFF.CurrentMemberFunction.DRILLUP_MEMBER = oFF.CurrentMemberFunction
				.create("DrillUpMember");
		oFF.CurrentMemberFunction.HEAD = oFF.CurrentMemberFunction
				.create("Head");
		oFF.CurrentMemberFunction.HIERARCHIZE = oFF.CurrentMemberFunction
				.create("Hierarchize");
		oFF.CurrentMemberFunction.LAG = oFF.CurrentMemberFunction.create("Lag");
		oFF.CurrentMemberFunction.LAST_PERIODS = oFF.CurrentMemberFunction
				.create("LastPeriods");
		oFF.CurrentMemberFunction.LEAD = oFF.CurrentMemberFunction
				.create("Lead");
		oFF.CurrentMemberFunction.MEMBERS = oFF.CurrentMemberFunction
				.create("Members");
		oFF.CurrentMemberFunction.MEMBERS_ASCENDANTS_DESCENDANTS = oFF.CurrentMemberFunction
				.create("MembersAscendantsDescendants");
		oFF.CurrentMemberFunction.OPENING_PERIOD = oFF.CurrentMemberFunction
				.create("OpeningPeriod");
		oFF.CurrentMemberFunction.PARALLEL_PERIOD = oFF.CurrentMemberFunction
				.create("ParallelPeriod");
		oFF.CurrentMemberFunction.PERIODS_TO_DATE = oFF.CurrentMemberFunction
				.create("PeriodsToDate");
		oFF.CurrentMemberFunction.RANGE = oFF.CurrentMemberFunction
				.create("Range");
		oFF.CurrentMemberFunction.SUBSET = oFF.CurrentMemberFunction
				.create("SubSet");
		oFF.CurrentMemberFunction.TAIL = oFF.CurrentMemberFunction
				.create("Tail");
		oFF.CurrentMemberFunction.UNION = oFF.CurrentMemberFunction
				.create("Union");
		oFF.CurrentMemberFunction.INA_PARALLEL_PERIOD = oFF.CurrentMemberFunction
				.create("INAParallelPeriod");
		oFF.CurrentMemberFunction.INA_SHIFT_PERIOD = oFF.CurrentMemberFunction
				.create("INAShiftPeriod");
		oFF.CurrentMemberFunction.INA_TO_DATE = oFF.CurrentMemberFunction
				.create("INAToDate");
		oFF.CurrentMemberFunction.INA_LAST_PERIODS = oFF.CurrentMemberFunction
				.create("INALastPeriods");
		oFF.CurrentMemberFunction.INA_CURRENT = oFF.CurrentMemberFunction
				.create("INACurrent");
	};
	oFF.CurrentMemberFunction.create = function(name) {
		var newConstant = oFF.XConstant.setupName(
				new oFF.CurrentMemberFunction(), name);
		oFF.CurrentMemberFunction.s_all.add(newConstant);
		return newConstant;
	};
	oFF.CurrentMemberFunction.lookup = function(name) {
		return oFF.CurrentMemberFunction.s_all.getByKey(name);
	};
	oFF.CustomSortPosition = function() {
	};
	oFF.CustomSortPosition.prototype = new oFF.XConstant();
	oFF.CustomSortPosition.TOP = null;
	oFF.CustomSortPosition.BOTTOM = null;
	oFF.CustomSortPosition.s_lookup = null;
	oFF.CustomSortPosition.staticSetup = function() {
		oFF.CustomSortPosition.s_lookup = oFF.XHashMapByString.create();
		oFF.CustomSortPosition.TOP = oFF.CustomSortPosition
				.createJoinCardinality("Top");
		oFF.CustomSortPosition.BOTTOM = oFF.CustomSortPosition
				.createJoinCardinality("Bottom");
	};
	oFF.CustomSortPosition.createJoinCardinality = function(name) {
		var newConstant = oFF.XConstant.setupName(new oFF.CustomSortPosition(),
				name);
		oFF.CustomSortPosition.s_lookup.put(name, newConstant);
		return newConstant;
	};
	oFF.CustomSortPosition.lookup = function(name) {
		return oFF.CustomSortPosition.s_lookup.getByKey(name);
	};
	oFF.DataEntryProcessingType = function() {
	};
	oFF.DataEntryProcessingType.prototype = new oFF.XConstant();
	oFF.DataEntryProcessingType.FULL = null;
	oFF.DataEntryProcessingType.IGNORE_AGGREGATION_TYPE = null;
	oFF.DataEntryProcessingType.IGNORE_CALCULATIONS = null;
	oFF.DataEntryProcessingType.staticSetup = function() {
		oFF.DataEntryProcessingType.FULL = oFF.XConstant.setupName(
				new oFF.DataEntryProcessingType(), "Full");
		oFF.DataEntryProcessingType.IGNORE_AGGREGATION_TYPE = oFF.XConstant
				.setupName(new oFF.DataEntryProcessingType(),
						"IgnoreAggregationType");
		oFF.DataEntryProcessingType.IGNORE_CALCULATIONS = oFF.XConstant
				.setupName(new oFF.DataEntryProcessingType(),
						"IgnoreCalculations");
	};
	oFF.DimensionVisibility = function() {
	};
	oFF.DimensionVisibility.prototype = new oFF.XConstant();
	oFF.DimensionVisibility.VISIBLE = null;
	oFF.DimensionVisibility.METADATA = null;
	oFF.DimensionVisibility.HIDDEN = null;
	oFF.DimensionVisibility.UNDEFINED = null;
	oFF.DimensionVisibility.s_inaCodeMap = null;
	oFF.DimensionVisibility.staticSetup = function() {
		oFF.DimensionVisibility.s_inaCodeMap = oFF.XHashMapByString.create();
		oFF.DimensionVisibility.VISIBLE = oFF.DimensionVisibility
				._createDimensionVisibility("Visible", 0);
		oFF.DimensionVisibility.METADATA = oFF.DimensionVisibility
				._createDimensionVisibility("Metadata", 1);
		oFF.DimensionVisibility.HIDDEN = oFF.DimensionVisibility
				._createDimensionVisibility("Hidden", 2);
		oFF.DimensionVisibility.UNDEFINED = oFF.DimensionVisibility
				._createDimensionVisibility("Undefined", -1);
	};
	oFF.DimensionVisibility._createDimensionVisibility = function(constant,
			inaCode) {
		var dv = new oFF.DimensionVisibility();
		dv.setName(constant);
		dv.m_inaCode = inaCode;
		oFF.DimensionVisibility.s_inaCodeMap.put(oFF.XInteger
				.convertToString(dv.m_inaCode), dv);
		return dv;
	};
	oFF.DimensionVisibility._getByInaCode = function(inaCode) {
		return oFF.DimensionVisibility.s_inaCodeMap.getByKey(oFF.XInteger
				.convertToString(inaCode));
	};
	oFF.DimensionVisibility.prototype.m_inaCode = 0;
	oFF.DimensionVisibility.prototype._getInaCode = function() {
		return this.m_inaCode;
	};
	oFF.DisaggregationMode = function() {
	};
	oFF.DisaggregationMode.prototype = new oFF.XConstant();
	oFF.DisaggregationMode.ABSOLUTE = null;
	oFF.DisaggregationMode.COPY = null;
	oFF.DisaggregationMode.DELTA = null;
	oFF.DisaggregationMode.NONE = null;
	oFF.DisaggregationMode.s_all = null;
	oFF.DisaggregationMode.staticSetup = function() {
		oFF.DisaggregationMode.s_all = oFF.XSetOfNameObject.create();
		oFF.DisaggregationMode.ABSOLUTE = oFF.DisaggregationMode
				.create("Absolute");
		oFF.DisaggregationMode.COPY = oFF.DisaggregationMode.create("Copy");
		oFF.DisaggregationMode.DELTA = oFF.DisaggregationMode.create("Delta");
		oFF.DisaggregationMode.NONE = oFF.DisaggregationMode.create("None");
	};
	oFF.DisaggregationMode.create = function(name) {
		var newConstant = oFF.XConstant.setupName(new oFF.DisaggregationMode(),
				name);
		oFF.DisaggregationMode.s_all.add(newConstant);
		return newConstant;
	};
	oFF.DisaggregationMode.lookup = function(name) {
		return oFF.DisaggregationMode.s_all.getByKey(name);
	};
	oFF.DisaggregationMode.lookupWithDefault = function(name, defaultValue) {
		var mode = oFF.DisaggregationMode.s_all.getByKey(name);
		if (oFF.isNull(mode)) {
			return defaultValue;
		}
		return mode;
	};
	oFF.DrillState = function() {
	};
	oFF.DrillState.prototype = new oFF.XConstant();
	oFF.DrillState.EXPANDED = null;
	oFF.DrillState.COLLAPSED = null;
	oFF.DrillState.LEAF = null;
	oFF.DrillState.LEAF_DRILLDOWN_ALLOWED = null;
	oFF.DrillState.LEAF_UDH = null;
	oFF.DrillState.LEAF_UDH_EXPAND_ALLOWED = null;
	oFF.DrillState.COLLAPSED_EXPAND_AND_DRILLDOWN_ALLOWED = null;
	oFF.DrillState.DRILL_DOWN = null;
	oFF.DrillState.DRILLED = null;
	oFF.DrillState.staticSetup = function() {
		oFF.DrillState.EXPANDED = oFF.DrillState.create("Expanded", false);
		oFF.DrillState.COLLAPSED = oFF.DrillState.create("Collapsed", false);
		oFF.DrillState.LEAF = oFF.DrillState.create("Leaf", false);
		oFF.DrillState.LEAF_DRILLDOWN_ALLOWED = oFF.DrillState.create(
				"LeafDrilldownAllowed", true);
		oFF.DrillState.LEAF_UDH = oFF.DrillState.create("LeafUDH", true);
		oFF.DrillState.LEAF_UDH_EXPAND_ALLOWED = oFF.DrillState.create(
				"LeafUDHExpandAllowed", true);
		oFF.DrillState.COLLAPSED_EXPAND_AND_DRILLDOWN_ALLOWED = oFF.DrillState
				.create("CollapsedExpandDrilldownAllowed", true);
		oFF.DrillState.DRILL_DOWN = oFF.DrillState.create("DrillDown", true);
		oFF.DrillState.DRILLED = oFF.DrillState.create("Drilled", true);
	};
	oFF.DrillState.create = function(name, isOnlyForUdh) {
		var drillState = oFF.XConstant.setupName(new oFF.DrillState(), name);
		drillState.m_isOnlyForUdh = isOnlyForUdh;
		return drillState;
	};
	oFF.DrillState.prototype.m_isOnlyForUdh = false;
	oFF.DrillState.prototype.isOnlyForUdh = function() {
		return this.m_isOnlyForUdh;
	};
	oFF.ExceptionSetting = function() {
	};
	oFF.ExceptionSetting.prototype = new oFF.XConstant();
	oFF.ExceptionSetting.ALERT_LEVEL = null;
	oFF.ExceptionSetting.NUMERIC_PRECISION = null;
	oFF.ExceptionSetting.NUMERIC_SCALE = null;
	oFF.ExceptionSetting.NUMERIC_SHIFT = null;
	oFF.ExceptionSetting.POSTFIX = null;
	oFF.ExceptionSetting.PREFIX = null;
	oFF.ExceptionSetting.SIGN_INVERSION = null;
	oFF.ExceptionSetting.s_all = null;
	oFF.ExceptionSetting.staticSetup = function() {
		oFF.ExceptionSetting.s_all = oFF.XHashMapByString.create();
		oFF.ExceptionSetting.ALERT_LEVEL = oFF.ExceptionSetting
				.create("$$AlertLevel$$");
		oFF.ExceptionSetting.NUMERIC_PRECISION = oFF.ExceptionSetting
				.create("$$NumericPrecision$$");
		oFF.ExceptionSetting.NUMERIC_SCALE = oFF.ExceptionSetting
				.create("$$NumericScale$$");
		oFF.ExceptionSetting.NUMERIC_SHIFT = oFF.ExceptionSetting
				.create("$$NumericShift$$");
		oFF.ExceptionSetting.POSTFIX = oFF.ExceptionSetting
				.create("$$Postfix$$");
		oFF.ExceptionSetting.PREFIX = oFF.ExceptionSetting.create("$$Prefix$$");
		oFF.ExceptionSetting.SIGN_INVERSION = oFF.ExceptionSetting
				.create("$$SignInversion$$");
	};
	oFF.ExceptionSetting.create = function(name) {
		var setting = oFF.XConstant.setupName(new oFF.ExceptionSetting(), name);
		oFF.ExceptionSetting.s_all.put(name, setting);
		return setting;
	};
	oFF.ExceptionSetting.getByName = function(name) {
		return oFF.ExceptionSetting.s_all.getByKey(name);
	};
	oFF.ExecutionEngine = function() {
	};
	oFF.ExecutionEngine.prototype = new oFF.XConstant();
	oFF.ExecutionEngine.SQL = null;
	oFF.ExecutionEngine.MDS = null;
	oFF.ExecutionEngine.CALC_ENGINE = null;
	oFF.ExecutionEngine.s_lookupNames = null;
	oFF.ExecutionEngine.staticSetup = function() {
		oFF.ExecutionEngine.s_lookupNames = oFF.XHashMapByString.create();
		oFF.ExecutionEngine.SQL = oFF.ExecutionEngine.create("SQL");
		oFF.ExecutionEngine.MDS = oFF.ExecutionEngine.create("MDS");
		oFF.ExecutionEngine.CALC_ENGINE = oFF.ExecutionEngine.create("CE");
	};
	oFF.ExecutionEngine.create = function(name) {
		var newObj = oFF.XConstant.setupName(new oFF.ExecutionEngine(), name);
		oFF.ExecutionEngine.s_lookupNames.put(name, newObj);
		return newObj;
	};
	oFF.ExecutionEngine.lookupName = function(name) {
		return oFF.ExecutionEngine.s_lookupNames.getByKey(name);
	};
	oFF.FieldLayoutType = function() {
	};
	oFF.FieldLayoutType.prototype = new oFF.XConstant();
	oFF.FieldLayoutType.FIELD_BASED = null;
	oFF.FieldLayoutType.ATTRIBUTE_BASED = null;
	oFF.FieldLayoutType.ATTRIBUTES_AND_PRESENTATIONS = null;
	oFF.FieldLayoutType.staticSetup = function() {
		oFF.FieldLayoutType.FIELD_BASED = oFF.XConstant.setupName(
				new oFF.FieldLayoutType(), "FieldBased");
		oFF.FieldLayoutType.ATTRIBUTE_BASED = oFF.XConstant.setupName(
				new oFF.FieldLayoutType(), "AttributeBased");
		oFF.FieldLayoutType.ATTRIBUTES_AND_PRESENTATIONS = oFF.XConstant
				.setupName(new oFF.FieldLayoutType(),
						"AttributesAndPresentations");
	};
	oFF.FieldUsageType = function() {
	};
	oFF.FieldUsageType.prototype = new oFF.XConstant();
	oFF.FieldUsageType.HIERARCHY = null;
	oFF.FieldUsageType.FLAT = null;
	oFF.FieldUsageType.ALL = null;
	oFF.FieldUsageType.s_lookup = null;
	oFF.FieldUsageType.staticSetup = function() {
		oFF.FieldUsageType.s_lookup = oFF.XHashMapByString.create();
		oFF.FieldUsageType.HIERARCHY = oFF.FieldUsageType.create("Hierarchy");
		oFF.FieldUsageType.FLAT = oFF.FieldUsageType.create("Flat");
		oFF.FieldUsageType.ALL = oFF.FieldUsageType.create("All");
	};
	oFF.FieldUsageType.create = function(name) {
		var pt = oFF.XConstant.setupName(new oFF.FieldUsageType(), name);
		oFF.FieldUsageType.s_lookup.put(name, pt);
		return pt;
	};
	oFF.FieldUsageType.lookup = function(name) {
		return oFF.FieldUsageType.s_lookup.getByKey(name);
	};
	oFF.FilterLayer = function() {
	};
	oFF.FilterLayer.prototype = new oFF.XConstant();
	oFF.FilterLayer.ALL = null;
	oFF.FilterLayer.FIXED = null;
	oFF.FilterLayer.DYNAMIC = null;
	oFF.FilterLayer.VISIBILITY = null;
	oFF.FilterLayer.staticSetup = function() {
		oFF.FilterLayer.ALL = oFF.XConstant.setupName(new oFF.FilterLayer(),
				"All");
		oFF.FilterLayer.FIXED = oFF.XConstant.setupName(new oFF.FilterLayer(),
				"Fixed");
		oFF.FilterLayer.DYNAMIC = oFF.XConstant.setupName(
				new oFF.FilterLayer(), "Dynamic");
		oFF.FilterLayer.VISIBILITY = oFF.XConstant.setupName(
				new oFF.FilterLayer(), "Visibility");
	};
	oFF.FilterScopeVariables = function() {
	};
	oFF.FilterScopeVariables.prototype = new oFF.XConstant();
	oFF.FilterScopeVariables.IGNORE = null;
	oFF.FilterScopeVariables.NOT_AFFECTED_BY_VARIABLES = null;
	oFF.FilterScopeVariables.NOT_CREATED_BY_VARIABLES = null;
	oFF.FilterScopeVariables.staticSetup = function() {
		oFF.FilterScopeVariables.IGNORE = oFF.XConstant.setupName(
				new oFF.FilterScopeVariables(), "Fixed");
		oFF.FilterScopeVariables.NOT_AFFECTED_BY_VARIABLES = oFF.XConstant
				.setupName(new oFF.FilterScopeVariables(),
						"NotAffectedByVariables");
		oFF.FilterScopeVariables.NOT_CREATED_BY_VARIABLES = oFF.XConstant
				.setupName(new oFF.FilterScopeVariables(),
						"NotCreatedByVariables");
	};
	oFF.HierarchyLevelType = function() {
	};
	oFF.HierarchyLevelType.prototype = new oFF.XConstant();
	oFF.HierarchyLevelType.REGULAR = null;
	oFF.HierarchyLevelType.ALL = null;
	oFF.HierarchyLevelType.TIME_YEAR = null;
	oFF.HierarchyLevelType.TIME_HALF_YEAR = null;
	oFF.HierarchyLevelType.TIME_QUARTER = null;
	oFF.HierarchyLevelType.TIME_MONTH = null;
	oFF.HierarchyLevelType.TIME_WEEK = null;
	oFF.HierarchyLevelType.TIME_DAY = null;
	oFF.HierarchyLevelType.TIME_HOUR = null;
	oFF.HierarchyLevelType.TIME_MINUTE = null;
	oFF.HierarchyLevelType.TIME_SECOND = null;
	oFF.HierarchyLevelType.staticSetup = function() {
		oFF.HierarchyLevelType.REGULAR = oFF.XConstant.setupName(
				new oFF.HierarchyLevelType(), "Regular");
		oFF.HierarchyLevelType.ALL = oFF.XConstant.setupName(
				new oFF.HierarchyLevelType(), "All");
		oFF.HierarchyLevelType.TIME_YEAR = oFF.XConstant.setupName(
				new oFF.HierarchyLevelType(), "TIME_YEAR");
		oFF.HierarchyLevelType.TIME_HALF_YEAR = oFF.XConstant.setupName(
				new oFF.HierarchyLevelType(), "TIME_HALF_YEAR");
		oFF.HierarchyLevelType.TIME_QUARTER = oFF.XConstant.setupName(
				new oFF.HierarchyLevelType(), "TIME_QUARTAL");
		oFF.HierarchyLevelType.TIME_MONTH = oFF.XConstant.setupName(
				new oFF.HierarchyLevelType(), "TIME_MONTH");
		oFF.HierarchyLevelType.TIME_WEEK = oFF.XConstant.setupName(
				new oFF.HierarchyLevelType(), "TIME_WEEK");
		oFF.HierarchyLevelType.TIME_DAY = oFF.XConstant.setupName(
				new oFF.HierarchyLevelType(), "TIME_DAY");
		oFF.HierarchyLevelType.TIME_HOUR = oFF.XConstant.setupName(
				new oFF.HierarchyLevelType(), "TIME_HOUR");
		oFF.HierarchyLevelType.TIME_MINUTE = oFF.XConstant.setupName(
				new oFF.HierarchyLevelType(), "TIME_MINUTE");
		oFF.HierarchyLevelType.TIME_SECOND = oFF.XConstant.setupName(
				new oFF.HierarchyLevelType(), "TIME_SECOND");
	};
	oFF.InactiveCapabilities = function() {
	};
	oFF.InactiveCapabilities.prototype = new oFF.XConstant();
	oFF.InactiveCapabilities.DYNAMIC_VARIABLES = null;
	oFF.InactiveCapabilities.VIRTUAL_DS_VARIABLE_VALUES = null;
	oFF.InactiveCapabilities.DETAILED_RESPONSE_EXPANSION = null;
	oFF.InactiveCapabilities.EXPAND_QUERY_AXIS = null;
	oFF.InactiveCapabilities.COMPLEX_TUPLE_FILTER = null;
	oFF.InactiveCapabilities.QDATA_CELL_MODEL_DEFAULTS = null;
	oFF.InactiveCapabilities.UDH_ALIGNMENT = null;
	oFF.InactiveCapabilities.OPERATOR_TOTALS = null;
	oFF.InactiveCapabilities.CUSTOM_DIMENSION_2 = null;
	oFF.InactiveCapabilities.LOCALE_SORTING = null;
	oFF.InactiveCapabilities.MEMBER_VISIBILITY = null;
	oFF.InactiveCapabilities.MEMBER_VALUE_EXCEPTIONS = null;
	oFF.InactiveCapabilities.UNIFIED_DATACELLS = null;
	oFF.InactiveCapabilities.RESULT_SET_CELL_FORMAT_TYPE_SPECIFIC = null;
	oFF.InactiveCapabilities.CALCULATED_DIMENSION = null;
	oFF.InactiveCapabilities.PLANNING_ON_CALCULATED_DIMENSION = null;
	oFF.InactiveCapabilities.MDS_CONDITIONS = null;
	oFF.InactiveCapabilities.SORT_NEW_VALUES = null;
	oFF.InactiveCapabilities.CUBE_BLENDING_N_QUERIES = null;
	oFF.InactiveCapabilities.DYNAMIC_FILTER_IN_SUBMIT = null;
	oFF.InactiveCapabilities.DATASOURCE_TYPE_QUERY_METADATA = null;
	oFF.InactiveCapabilities.DATASOURCE_TYPE_QUERY = null;
	oFF.InactiveCapabilities.AV_CAPABILITY_VARIABLE_MASKING = null;
	oFF.InactiveCapabilities.REMOTE_BLENDING_BW = null;
	oFF.InactiveCapabilities.RESULTSET_UNIT_INDEX = null;
	oFF.InactiveCapabilities.TUPLES_OPERAND = null;
	oFF.InactiveCapabilities.SID_PRESENTATION = null;
	oFF.InactiveCapabilities.F4_FILTER_FOR_TEXT_FIELD = null;
	oFF.InactiveCapabilities.INA_MODEL_METADATA = null;
	oFF.InactiveCapabilities.UNASSIGNED_NODE_AS_DEFINED_IN_QUERY = null;
	oFF.InactiveCapabilities.HIERARCHY_LEVEL = null;
	oFF.InactiveCapabilities.CUBE_CACHE = null;
	oFF.InactiveCapabilities.HIERARCHY_REST_NODE = null;
	oFF.InactiveCapabilities.DATA_ENTRY_ON_UNBOOKED = null;
	oFF.InactiveCapabilities.UNIVERSAL_DISPLAY_HIERARCHY_CUSTOM_DIM = null;
	oFF.InactiveCapabilities.DIMENSION_VISIBILITY = null;
	oFF.InactiveCapabilities.DIMENSION_DEFAULT_MEMBER = null;
	oFF.InactiveCapabilities.METADATA_SEMANTIC_TYPE = null;
	oFF.InactiveCapabilities.s_AllInactiveCapabilities = null;
	oFF.InactiveCapabilities.staticSetup = function() {
		oFF.InactiveCapabilities.s_AllInactiveCapabilities = oFF.XSetOfNameObject
				.create();
		oFF.InactiveCapabilities.CUSTOM_DIMENSION_2 = oFF.InactiveCapabilities
				.create("CustomDimension2", -1);
		oFF.InactiveCapabilities.LOCALE_SORTING = oFF.InactiveCapabilities
				.create("LocaleSorting", -1);
		oFF.InactiveCapabilities.MEMBER_VISIBILITY = oFF.InactiveCapabilities
				.create("SupportsMemberVisibility", -1);
		oFF.InactiveCapabilities.MEMBER_VALUE_EXCEPTIONS = oFF.InactiveCapabilities
				.create("SupportsMemberValueExceptions", -1);
		oFF.InactiveCapabilities.UNIFIED_DATACELLS = oFF.InactiveCapabilities
				.create("UnifiedDataCells", -1);
		oFF.InactiveCapabilities.RESULT_SET_CELL_FORMAT_TYPE_SPECIFIC = oFF.InactiveCapabilities
				.create("ResultSetCellFormatTypeSpecific", -1);
		oFF.InactiveCapabilities.CALCULATED_DIMENSION = oFF.InactiveCapabilities
				.create("CalculatedDimension",
						oFF.XVersion.V90_CALCULATED_DIMENSIONS_REL);
		oFF.InactiveCapabilities.PLANNING_ON_CALCULATED_DIMENSION = oFF.InactiveCapabilities
				.create("PlanningOnCalculatedDimension",
						oFF.XVersion.V90_CALCULATED_DIMENSIONS_REL);
		oFF.InactiveCapabilities.MDS_CONDITIONS = oFF.InactiveCapabilities
				.create("Conditions", -1);
		oFF.InactiveCapabilities.SORT_NEW_VALUES = oFF.InactiveCapabilities
				.create("SortNewValues", -1);
		oFF.InactiveCapabilities.CUBE_BLENDING_N_QUERIES = oFF.InactiveCapabilities
				.create("CubeBlendingNSubqueries", -1);
		oFF.InactiveCapabilities.DYNAMIC_FILTER_IN_SUBMIT = oFF.InactiveCapabilities
				.create("SupportsDynamicFilterInSubmit", -1);
		oFF.InactiveCapabilities.AV_CAPABILITY_VARIABLE_MASKING = oFF.InactiveCapabilities
				.create("VariableMasking", -1);
		oFF.InactiveCapabilities.DATASOURCE_TYPE_QUERY_METADATA = oFF.InactiveCapabilities
				.create("DataSourceTypeQueryMetadata", -1);
		oFF.InactiveCapabilities.DATASOURCE_TYPE_QUERY = oFF.InactiveCapabilities
				.create("DataSourceTypeQuery", -1);
		oFF.InactiveCapabilities.REMOTE_BLENDING_BW = oFF.InactiveCapabilities
				.create("RemoteBlendingBW", -1);
		oFF.InactiveCapabilities.RESULTSET_UNIT_INDEX = oFF.InactiveCapabilities
				.create("ResultSetUnitIndex", -1);
		oFF.InactiveCapabilities.TUPLES_OPERAND = oFF.InactiveCapabilities
				.create("TuplesOperand", -1);
		oFF.InactiveCapabilities.COMPLEX_TUPLE_FILTER = oFF.InactiveCapabilities
				.create("ComplexTupleFilter", -1);
		oFF.InactiveCapabilities.QDATA_CELL_MODEL_DEFAULTS = oFF.InactiveCapabilities
				.create("QDataCellModelDefaults",
						oFF.XVersion.V111_QDATA_CELL_MODEL_DEFAULTS);
		oFF.InactiveCapabilities.UDH_ALIGNMENT = oFF.InactiveCapabilities
				.create("UniversalDisplayHierarchyAlignment", -1);
		oFF.InactiveCapabilities.OPERATOR_TOTALS = oFF.InactiveCapabilities
				.create("SupportsOperatorTotals", -1);
		oFF.InactiveCapabilities.SID_PRESENTATION = oFF.InactiveCapabilities
				.create("SupportsSIDPresentation", -1);
		oFF.InactiveCapabilities.F4_FILTER_FOR_TEXT_FIELD = oFF.InactiveCapabilities
				.create("F4FilterForTextField", -1);
		oFF.InactiveCapabilities.INA_MODEL_METADATA = oFF.InactiveCapabilities
				.create("SupportsInAModelMetadata", -1);
		oFF.InactiveCapabilities.UNASSIGNED_NODE_AS_DEFINED_IN_QUERY = oFF.InactiveCapabilities
				.create("RespectUnassignedNodeSetting", -1);
		oFF.InactiveCapabilities.HIERARCHY_LEVEL = oFF.InactiveCapabilities
				.create("ResultSetHierarchyLevel",
						oFF.XVersion.V110_ABSOLUTE_HIERARCHY_LEVEL);
		oFF.InactiveCapabilities.CUBE_CACHE = oFF.InactiveCapabilities.create(
				"CubeCache", oFF.XVersion.V106_CUBE_CACHE);
		oFF.InactiveCapabilities.DETAILED_RESPONSE_EXPANSION = oFF.InactiveCapabilities
				.create("DetailedResponseExpansion", -1);
		oFF.InactiveCapabilities.DYNAMIC_VARIABLES = oFF.InactiveCapabilities
				.create("MetadataDynamicVariable", -1);
		oFF.InactiveCapabilities.VIRTUAL_DS_VARIABLE_VALUES = oFF.InactiveCapabilities
				.create("VirtualDataSourceVariableValues", -1);
		oFF.InactiveCapabilities.EXPAND_QUERY_AXIS = oFF.InactiveCapabilities
				.create("ExpandQueryAxis", -1);
		oFF.InactiveCapabilities.HIERARCHY_REST_NODE = oFF.InactiveCapabilities
				.create("MetadataHierarchyRestNode", -1);
		oFF.InactiveCapabilities.DATA_ENTRY_ON_UNBOOKED = oFF.InactiveCapabilities
				.create("DataEntryOnUnbooked", -1);
		oFF.InactiveCapabilities.UNIVERSAL_DISPLAY_HIERARCHY_CUSTOM_DIM = oFF.InactiveCapabilities
				.create("UniversalDisplayHierarchyCustomDimensions", -1);
		oFF.InactiveCapabilities.DIMENSION_VISIBILITY = oFF.InactiveCapabilities
				.create("MetadataDimensionVisibility", -1);
		oFF.InactiveCapabilities.DIMENSION_DEFAULT_MEMBER = oFF.InactiveCapabilities
				.create("MetadataDimensionDefaultMember", -1);
		oFF.InactiveCapabilities.METADATA_SEMANTIC_TYPE = oFF.InactiveCapabilities
				.create("MetadataSemanticType", -1);
	};
	oFF.InactiveCapabilities.getCapabilityByName = function(capabilityName) {
		return oFF.InactiveCapabilities.s_AllInactiveCapabilities
				.getByKey(capabilityName);
	};
	oFF.InactiveCapabilities.create = function(name, xVersion) {
		var object = oFF.XConstant.setupName(new oFF.InactiveCapabilities(),
				name);
		object.m_xVersion = xVersion;
		oFF.InactiveCapabilities.s_AllInactiveCapabilities.add(object);
		return object;
	};
	oFF.InactiveCapabilities.getAllInactiveCapabilities = function() {
		return oFF.InactiveCapabilities.s_AllInactiveCapabilities;
	};
	oFF.InactiveCapabilities.prototype.m_xVersion = 0;
	oFF.InactiveCapabilities.prototype.getMaxXVersion = function() {
		return this.m_xVersion;
	};
	oFF.InfoObjectType = function() {
	};
	oFF.InfoObjectType.prototype = new oFF.XConstant();
	oFF.InfoObjectType.CHA = null;
	oFF.InfoObjectType.KYF = null;
	oFF.InfoObjectType.TIM = null;
	oFF.InfoObjectType.UNI = null;
	oFF.InfoObjectType.DPA = null;
	oFF.InfoObjectType.ATR = null;
	oFF.InfoObjectType.MTA = null;
	oFF.InfoObjectType.XXL = null;
	oFF.InfoObjectType.ALL = null;
	oFF.InfoObjectType.staticSetupInfoObject = function() {
		oFF.InfoObjectType.CHA = oFF.XConstant.setupName(
				new oFF.InfoObjectType(), "CHA");
		oFF.InfoObjectType.KYF = oFF.XConstant.setupName(
				new oFF.InfoObjectType(), "KYF");
		oFF.InfoObjectType.TIM = oFF.XConstant.setupName(
				new oFF.InfoObjectType(), "TIM");
		oFF.InfoObjectType.UNI = oFF.XConstant.setupName(
				new oFF.InfoObjectType(), "UNI");
		oFF.InfoObjectType.DPA = oFF.XConstant.setupName(
				new oFF.InfoObjectType(), "DPA");
		oFF.InfoObjectType.ATR = oFF.XConstant.setupName(
				new oFF.InfoObjectType(), "ATR");
		oFF.InfoObjectType.MTA = oFF.XConstant.setupName(
				new oFF.InfoObjectType(), "MTA");
		oFF.InfoObjectType.XXL = oFF.XConstant.setupName(
				new oFF.InfoObjectType(), "XXL");
		oFF.InfoObjectType.ALL = oFF.XConstant.setupName(
				new oFF.InfoObjectType(), "ALL");
	};
	oFF.InputReadinessType = function() {
	};
	oFF.InputReadinessType.prototype = new oFF.XConstant();
	oFF.InputReadinessType.INPUT_ENABLED = null;
	oFF.InputReadinessType.PUBLIC_VERSION = null;
	oFF.InputReadinessType.INACTIVE_VERSION = null;
	oFF.InputReadinessType.NON_PLANNABLE_EXCEPTION_AGGREGATION_RESULT = null;
	oFF.InputReadinessType.MISSING_INVERSE_FORMULA = null;
	oFF.InputReadinessType.CURRENT_MEMBER_NAVIGATION = null;
	oFF.InputReadinessType.UNSUPPORTED_POST_AGGREGATION_TYPE = null;
	oFF.InputReadinessType.UNSUPPORTED_AGGREGATION_EXCEPTION_AGGREGATION_COMBINATION = null;
	oFF.InputReadinessType.UNSUPPORTED_EXCEPTION_AGGREGATION_TYPE = null;
	oFF.InputReadinessType.UNSUPPORTED_AGGREGATION_TYPE = null;
	oFF.InputReadinessType.EXCEPTION_AGGREGATION_ON_FORMULA = null;
	oFF.InputReadinessType.CALCULATION_BEFORE_AGGREGATION = null;
	oFF.InputReadinessType.AGGREGATE_OF_DIFFERENT_VERSIONS = null;
	oFF.InputReadinessType.HAS_CHILDREN_WITH_DIFFERENT_FEATURES = null;
	oFF.InputReadinessType.HAS_EPM_EXCEPTION = null;
	oFF.InputReadinessType.NO_ACTION_AVAILABLE = null;
	oFF.InputReadinessType.UNBOOKED = null;
	oFF.InputReadinessType.BLENDING_RESULT = null;
	oFF.InputReadinessType.UNSUPPORTED_VALUE_TYPE = null;
	oFF.InputReadinessType.NO_VERSION = null;
	oFF.InputReadinessType.PLANNING_DISABLED = null;
	oFF.InputReadinessType.UNSUPPORTED_CALCULATION_STEP = null;
	oFF.InputReadinessType.QUERY_HAS_CALCULATED_DIMENSION = null;
	oFF.InputReadinessType.NESTED_FORMULA = null;
	oFF.InputReadinessType.QUERY_HAS_MEASURE_BASED_CALCULATED_DIMENSION = null;
	oFF.InputReadinessType.s_instances = null;
	oFF.InputReadinessType.staticSetup = function() {
		oFF.InputReadinessType.s_instances = oFF.XHashMapByString.create();
		oFF.InputReadinessType.INPUT_ENABLED = oFF.InputReadinessType.create(
				"InputEnabled", "IE");
		oFF.InputReadinessType.PUBLIC_VERSION = oFF.InputReadinessType.create(
				"PublicVersion", "PV");
		oFF.InputReadinessType.INACTIVE_VERSION = oFF.InputReadinessType
				.create("InactiveVersion", "IV");
		oFF.InputReadinessType.NON_PLANNABLE_EXCEPTION_AGGREGATION_RESULT = oFF.InputReadinessType
				.create("NonPlannableExceptionAggregationResult", "NPEAR");
		oFF.InputReadinessType.MISSING_INVERSE_FORMULA = oFF.InputReadinessType
				.create("MissingInverseFormula", "MIF");
		oFF.InputReadinessType.CURRENT_MEMBER_NAVIGATION = oFF.InputReadinessType
				.create("CurrentMemberNavigation", "CMN");
		oFF.InputReadinessType.UNSUPPORTED_POST_AGGREGATION_TYPE = oFF.InputReadinessType
				.create("UnsupportedPostAggregationType", "UPT");
		oFF.InputReadinessType.UNSUPPORTED_AGGREGATION_EXCEPTION_AGGREGATION_COMBINATION = oFF.InputReadinessType
				.create(
						"UnsupportedAggregationExceptionAggregationCombination",
						"UAEAC");
		oFF.InputReadinessType.UNSUPPORTED_EXCEPTION_AGGREGATION_TYPE = oFF.InputReadinessType
				.create("UnsupportedExceptionAggregationType", "UEAT");
		oFF.InputReadinessType.UNSUPPORTED_AGGREGATION_TYPE = oFF.InputReadinessType
				.create("UnsupportedAggregationType", "UAT");
		oFF.InputReadinessType.EXCEPTION_AGGREGATION_ON_FORMULA = oFF.InputReadinessType
				.create("ExceptionAggregationOnFormula", "AEOF");
		oFF.InputReadinessType.CALCULATION_BEFORE_AGGREGATION = oFF.InputReadinessType
				.create("CalculationBeforeAggregation", "CBA");
		oFF.InputReadinessType.AGGREGATE_OF_DIFFERENT_VERSIONS = oFF.InputReadinessType
				.create("AggregateOfDifferentVersions", "ADV");
		oFF.InputReadinessType.HAS_CHILDREN_WITH_DIFFERENT_FEATURES = oFF.InputReadinessType
				.create("HasChildrenWithDifferentFeatures", "HCWDF");
		oFF.InputReadinessType.HAS_EPM_EXCEPTION = oFF.InputReadinessType
				.create("HasEPMException", "HEE");
		oFF.InputReadinessType.NO_ACTION_AVAILABLE = oFF.InputReadinessType
				.create("NoActionAvailable", "NAA");
		oFF.InputReadinessType.UNBOOKED = oFF.InputReadinessType.create(
				"Unbooked", "U");
		oFF.InputReadinessType.BLENDING_RESULT = oFF.InputReadinessType.create(
				"BlendingResult", "BR");
		oFF.InputReadinessType.UNSUPPORTED_VALUE_TYPE = oFF.InputReadinessType
				.create("UnsupportedValueType", "UVT");
		oFF.InputReadinessType.NO_VERSION = oFF.InputReadinessType.create(
				"NoVersion", "NV");
		oFF.InputReadinessType.PLANNING_DISABLED = oFF.InputReadinessType
				.create("PlanningDisabled", "PD");
		oFF.InputReadinessType.UNSUPPORTED_CALCULATION_STEP = oFF.InputReadinessType
				.create("UnsupportedCalculationStep", "UCS");
		oFF.InputReadinessType.QUERY_HAS_CALCULATED_DIMENSION = oFF.InputReadinessType
				.create("QueryHasCalculatedDimension", "QHCD");
		oFF.InputReadinessType.NESTED_FORMULA = oFF.InputReadinessType.create(
				"NestedFormula", "NF");
		oFF.InputReadinessType.QUERY_HAS_MEASURE_BASED_CALCULATED_DIMENSION = oFF.InputReadinessType
				.create("QueryHasMeasureBasedCalculatedDimension", "QHMBCD");
	};
	oFF.InputReadinessType.create = function(name, shortcut) {
		var flag = oFF.XConstant.setupName(new oFF.InputReadinessType(), name);
		flag.m_shortcut = shortcut;
		oFF.InputReadinessType.s_instances.put(name, flag);
		return flag;
	};
	oFF.InputReadinessType.get = function(name) {
		return oFF.InputReadinessType.s_instances.getByKey(name);
	};
	oFF.InputReadinessType.getOrCreate = function(name) {
		var readinessType;
		if (oFF.XStringUtils.isNullOrEmpty(name)) {
			return null;
		}
		readinessType = oFF.InputReadinessType.get(name);
		return oFF.notNull(readinessType) ? readinessType
				: oFF.InputReadinessType.create(name, name);
	};
	oFF.InputReadinessType.prototype.m_shortcut = null;
	oFF.InputReadinessType.prototype.getShortcut = function() {
		return this.m_shortcut;
	};
	oFF.JoinCardinality = function() {
	};
	oFF.JoinCardinality.prototype = new oFF.XConstant();
	oFF.JoinCardinality.ONE_ONE = null;
	oFF.JoinCardinality.N_ONE = null;
	oFF.JoinCardinality.N_N = null;
	oFF.JoinCardinality.ONE_N = null;
	oFF.JoinCardinality.s_lookup = null;
	oFF.JoinCardinality.staticSetup = function() {
		oFF.JoinCardinality.s_lookup = oFF.XHashMapByString.create();
		oFF.JoinCardinality.ONE_ONE = oFF.JoinCardinality
				.createJoinCardinality("1_1");
		oFF.JoinCardinality.N_ONE = oFF.JoinCardinality
				.createJoinCardinality("N_1");
		oFF.JoinCardinality.N_N = oFF.JoinCardinality
				.createJoinCardinality("N_N");
		oFF.JoinCardinality.ONE_N = oFF.JoinCardinality
				.createJoinCardinality("1_N");
	};
	oFF.JoinCardinality.createJoinCardinality = function(name) {
		var newConstant = oFF.XConstant.setupName(new oFF.JoinCardinality(),
				name);
		oFF.JoinCardinality.s_lookup.put(name, newConstant);
		return newConstant;
	};
	oFF.JoinCardinality.lookup = function(name) {
		return oFF.JoinCardinality.s_lookup.getByKey(name);
	};
	oFF.LocalityType = function() {
	};
	oFF.LocalityType.prototype = new oFF.XConstant();
	oFF.LocalityType.CENTRAL = null;
	oFF.LocalityType.LOCAL = null;
	oFF.LocalityType.staticSetupLocality = function() {
		oFF.LocalityType.CENTRAL = oFF.XConstant.setupName(
				new oFF.LocalityType(), "C");
		oFF.LocalityType.LOCAL = oFF.XConstant.setupName(
				new oFF.LocalityType(), "L");
	};
	oFF.LocalityType.getLocalityType = function(type) {
		if (oFF.XString.isEqual(oFF.LocalityType.CENTRAL.getName(), type)) {
			return oFF.LocalityType.CENTRAL;
		} else {
			if (oFF.XString.isEqual(oFF.LocalityType.LOCAL.getName(), type)) {
				return oFF.LocalityType.LOCAL;
			}
		}
		return null;
	};
	oFF.MetaObjectType = function() {
	};
	oFF.MetaObjectType.prototype = new oFF.XConstant();
	oFF.MetaObjectType.QUERY = null;
	oFF.MetaObjectType.QUERY_VALUEHELP = null;
	oFF.MetaObjectType.QUERY_VALUEHELP_DESIGNTIME = null;
	oFF.MetaObjectType.DEFAULT_PLAN_QUERY = null;
	oFF.MetaObjectType.DEFAULT_REPORT_QUERY = null;
	oFF.MetaObjectType.LOCAL_QUERY = null;
	oFF.MetaObjectType.QUERY_VIEW = null;
	oFF.MetaObjectType.INFOPROVIDER = null;
	oFF.MetaObjectType.DBVIEW = null;
	oFF.MetaObjectType.CATEGORY = null;
	oFF.MetaObjectType.CONNECTOR = null;
	oFF.MetaObjectType.CATALOG_VIEW = null;
	oFF.MetaObjectType.CATALOG_VIEW_2 = null;
	oFF.MetaObjectType.WORKSTATUS = null;
	oFF.MetaObjectType.PLANNING = null;
	oFF.MetaObjectType.CUBE = null;
	oFF.MetaObjectType.ALVL = null;
	oFF.MetaObjectType.DIMENSION = null;
	oFF.MetaObjectType.INFO_CUBE = null;
	oFF.MetaObjectType.LOG_PARTITIONED_OBJECT = null;
	oFF.MetaObjectType.HYBRIDPROVIDER = null;
	oFF.MetaObjectType.MULTIPROVIDER = null;
	oFF.MetaObjectType.HCPR = null;
	oFF.MetaObjectType.ADSO = null;
	oFF.MetaObjectType.INFOSET = null;
	oFF.MetaObjectType.AGGREGATION_LEVEL = null;
	oFF.MetaObjectType.VIRTUAL_PROVIDER = null;
	oFF.MetaObjectType.AINX_PROVIDER = null;
	oFF.MetaObjectType.INFOOBJECT = null;
	oFF.MetaObjectType.REPOSITORY = null;
	oFF.MetaObjectType.HIERARCHY = null;
	oFF.MetaObjectType.HIERARCHY_MEMBER = null;
	oFF.MetaObjectType.HIERARCHY_INTERVAL = null;
	oFF.MetaObjectType.MASTERDATA = null;
	oFF.MetaObjectType.USER_MANAGEMENT = null;
	oFF.MetaObjectType.INA_MODEL = null;
	oFF.MetaObjectType.PLANNING_MODEL = null;
	oFF.MetaObjectType.PLANNING_FUNCTION = null;
	oFF.MetaObjectType.PLANNING_SEQUENCE = null;
	oFF.MetaObjectType.FILTER = null;
	oFF.MetaObjectType.MULTI_SOURCE = null;
	oFF.MetaObjectType.BLENDING = null;
	oFF.MetaObjectType.TRANSIENT_QUERY = null;
	oFF.MetaObjectType.MODEL = null;
	oFF.MetaObjectType.MODEL_VALUEHELP = null;
	oFF.MetaObjectType.UNX = null;
	oFF.MetaObjectType.UQAS = null;
	oFF.MetaObjectType.YTABLE = null;
	oFF.MetaObjectType.UQM = null;
	oFF.MetaObjectType.URL = null;
	oFF.MetaObjectType.ODSO = null;
	oFF.MetaObjectType.CURRENCY_TRANSLATION = null;
	oFF.MetaObjectType.CURRENCY = null;
	oFF.MetaObjectType.FORMULA_OPERATORS = null;
	oFF.MetaObjectType.s_instances = null;
	oFF.MetaObjectType.staticSetup = function() {
		oFF.MetaObjectType.s_instances = oFF.XHashMapByString.create();
		oFF.MetaObjectType.QUERY = oFF.MetaObjectType.create("Query");
		oFF.MetaObjectType.QUERY_VALUEHELP = oFF.MetaObjectType
				.create("Query/ValueHelp");
		oFF.MetaObjectType.QUERY_VALUEHELP_DESIGNTIME = oFF.MetaObjectType
				.create("Query/ValueHelp/DesignTime");
		oFF.MetaObjectType.DEFAULT_PLAN_QUERY = oFF.MetaObjectType
				.create("DefaultPlanQuery");
		oFF.MetaObjectType.DEFAULT_REPORT_QUERY = oFF.MetaObjectType
				.create("DefaultReportQuery");
		oFF.MetaObjectType.LOCAL_QUERY = oFF.MetaObjectType
				.create("LocalQuery");
		oFF.MetaObjectType.QUERY_VIEW = oFF.MetaObjectType.create("QueryView");
		oFF.MetaObjectType.INFOPROVIDER = oFF.MetaObjectType
				.create("InfoProvider");
		oFF.MetaObjectType.DBVIEW = oFF.MetaObjectType.create("View");
		oFF.MetaObjectType.CATEGORY = oFF.MetaObjectType.create("Category");
		oFF.MetaObjectType.CONNECTOR = oFF.MetaObjectType.create("Connector");
		oFF.MetaObjectType.CATALOG_VIEW = oFF.MetaObjectType
				.create("CatalogView");
		oFF.MetaObjectType.CATALOG_VIEW_2 = oFF.MetaObjectType
				.create("CatalogView2");
		oFF.MetaObjectType.PLANNING = oFF.MetaObjectType.create("Planning");
		oFF.MetaObjectType.CUBE = oFF.MetaObjectType.create("Cube");
		oFF.MetaObjectType.ALVL = oFF.MetaObjectType.create("ALVL");
		oFF.MetaObjectType.WORKSTATUS = oFF.MetaObjectType.create("WorkStatus");
		oFF.MetaObjectType.DIMENSION = oFF.MetaObjectType.create("Dimension");
		oFF.MetaObjectType.INFO_CUBE = oFF.MetaObjectType.create("InfoCube");
		oFF.MetaObjectType.LOG_PARTITIONED_OBJECT = oFF.MetaObjectType
				.create("LogPartitionedObject");
		oFF.MetaObjectType.HYBRIDPROVIDER = oFF.MetaObjectType
				.create("Hybridprovider");
		oFF.MetaObjectType.MULTIPROVIDER = oFF.MetaObjectType
				.create("MultiProvider");
		oFF.MetaObjectType.HCPR = oFF.MetaObjectType.create("HCPR");
		oFF.MetaObjectType.ADSO = oFF.MetaObjectType.create("ADSO");
		oFF.MetaObjectType.INFOSET = oFF.MetaObjectType.create("InfoSet");
		oFF.MetaObjectType.AGGREGATION_LEVEL = oFF.MetaObjectType
				.create("AggregationLevel");
		oFF.MetaObjectType.VIRTUAL_PROVIDER = oFF.MetaObjectType
				.create("VirtualProvider");
		oFF.MetaObjectType.AINX_PROVIDER = oFF.MetaObjectType
				.create("AINXProvider");
		oFF.MetaObjectType.INFOOBJECT = oFF.MetaObjectType.create("InfoObject");
		oFF.MetaObjectType.REPOSITORY = oFF.MetaObjectType.create("Repository");
		oFF.MetaObjectType.HIERARCHY = oFF.MetaObjectType.create("Hierarchy");
		oFF.MetaObjectType.HIERARCHY_MEMBER = oFF.MetaObjectType
				.create("HierarchyMember");
		oFF.MetaObjectType.HIERARCHY_INTERVAL = oFF.MetaObjectType
				.create("HierarchyInterval");
		oFF.MetaObjectType.MASTERDATA = oFF.MetaObjectType.create("Masterdata");
		oFF.MetaObjectType.USER_MANAGEMENT = oFF.MetaObjectType
				.create("UserManagement");
		oFF.MetaObjectType.INA_MODEL = oFF.MetaObjectType.create("InAModel");
		oFF.MetaObjectType.PLANNING_MODEL = oFF.MetaObjectType
				.create("PlanningModel");
		oFF.MetaObjectType.PLANNING_FUNCTION = oFF.MetaObjectType
				.create("PlanningFunction");
		oFF.MetaObjectType.PLANNING_SEQUENCE = oFF.MetaObjectType
				.create("PlanningSequence");
		oFF.MetaObjectType.FILTER = oFF.MetaObjectType.create("Filter");
		oFF.MetaObjectType.MULTI_SOURCE = oFF.MetaObjectType
				.create("MultiSource");
		oFF.MetaObjectType.BLENDING = oFF.MetaObjectType.create("Blending");
		oFF.MetaObjectType.TRANSIENT_QUERY = oFF.MetaObjectType.create("TRPR");
		oFF.MetaObjectType.MODEL = oFF.MetaObjectType.create("Model");
		oFF.MetaObjectType.MODEL_VALUEHELP = oFF.MetaObjectType
				.create("Model/ValueHelp");
		oFF.MetaObjectType.UNX = oFF.MetaObjectType.create("Unx");
		oFF.MetaObjectType.UQAS = oFF.MetaObjectType.create("Uqas");
		oFF.MetaObjectType.YTABLE = oFF.MetaObjectType.create("YTable");
		oFF.MetaObjectType.UQM = oFF.MetaObjectType.create("Uqm");
		oFF.MetaObjectType.URL = oFF.MetaObjectType.create("Url");
		oFF.MetaObjectType.ODSO = oFF.MetaObjectType.create("ODSO");
		oFF.MetaObjectType.CURRENCY_TRANSLATION = oFF.MetaObjectType
				.create("CurrencyTranslation");
		oFF.MetaObjectType.CURRENCY = oFF.MetaObjectType.create("Currency");
		oFF.MetaObjectType.FORMULA_OPERATORS = oFF.MetaObjectType
				.create("FormulaOperators");
	};
	oFF.MetaObjectType.create = function(camelCaseName) {
		var name = oFF.XString.toLowerCase(camelCaseName);
		var newConstant = oFF.XConstant.setupName(new oFF.MetaObjectType(),
				name);
		newConstant.m_camelCaseName = camelCaseName;
		oFF.MetaObjectType.s_instances.put(name, newConstant);
		return newConstant;
	};
	oFF.MetaObjectType.lookup = function(name) {
		var lowerCase = oFF.XString.toLowerCase(name);
		return oFF.MetaObjectType.s_instances.getByKey(lowerCase);
	};
	oFF.MetaObjectType.lookupAndCreate = function(camelCaseName) {
		var result = oFF.MetaObjectType.lookup(camelCaseName);
		if (oFF.isNull(result)) {
			result = oFF.MetaObjectType.create(camelCaseName);
		}
		return result;
	};
	oFF.MetaObjectType.getAll = function() {
		return oFF.MetaObjectType.s_instances.getIterator();
	};
	oFF.MetaObjectType.prototype.m_camelCaseName = null;
	oFF.MetaObjectType.prototype.getCamelCaseName = function() {
		return this.m_camelCaseName;
	};
	oFF.ObtainabilityType = function() {
	};
	oFF.ObtainabilityType.prototype = new oFF.XConstant();
	oFF.ObtainabilityType.s_all = null;
	oFF.ObtainabilityType.ALWAYS = null;
	oFF.ObtainabilityType.USER_INTERFACE = null;
	oFF.ObtainabilityType.SERVICE = null;
	oFF.ObtainabilityType.SERVER = null;
	oFF.ObtainabilityType.staticSetup = function() {
		oFF.ObtainabilityType.s_all = oFF.XSetOfNameObject.create();
		oFF.ObtainabilityType.ALWAYS = oFF.ObtainabilityType.create("Always");
		oFF.ObtainabilityType.USER_INTERFACE = oFF.ObtainabilityType
				.create("UserInterface");
		oFF.ObtainabilityType.SERVICE = oFF.ObtainabilityType.create("Service");
		oFF.ObtainabilityType.SERVER = oFF.ObtainabilityType.create("Server");
	};
	oFF.ObtainabilityType.create = function(name) {
		var newConstant = oFF.XConstant.setupName(new oFF.ObtainabilityType(),
				name);
		oFF.ObtainabilityType.s_all.add(newConstant);
		return newConstant;
	};
	oFF.ObtainabilityType.lookup = function(name) {
		return oFF.ObtainabilityType.s_all.getByKey(name);
	};
	oFF.PresentationSelect = function() {
	};
	oFF.PresentationSelect.prototype = new oFF.XConstant();
	oFF.PresentationSelect.KEY = null;
	oFF.PresentationSelect.TEXT = null;
	oFF.PresentationSelect.KEY_AND_TEXT = null;
	oFF.PresentationSelect.staticSetup = function() {
		oFF.PresentationSelect.KEY = oFF.XConstant.setupName(
				new oFF.PresentationSelect(), "Key");
		oFF.PresentationSelect.TEXT = oFF.XConstant.setupName(
				new oFF.PresentationSelect(), "Text");
		oFF.PresentationSelect.KEY_AND_TEXT = oFF.XConstant.setupName(
				new oFF.PresentationSelect(), "KeyAndText");
	};
	oFF.ProviderType = function() {
	};
	oFF.ProviderType.prototype = new oFF.XConstant();
	oFF.ProviderType.ANALYTICS = null;
	oFF.ProviderType.ANALYTICS_VALUE_HELP = null;
	oFF.ProviderType.PLANNING = null;
	oFF.ProviderType.CATALOG = null;
	oFF.ProviderType.PLANNING_COMMAND = null;
	oFF.ProviderType.LIST_REPORTING = null;
	oFF.ProviderType.s_instances = null;
	oFF.ProviderType.staticSetup = function() {
		oFF.ProviderType.s_instances = oFF.XHashMapByString.create();
		oFF.ProviderType.ANALYTICS = oFF.ProviderType.create("Analytics");
		oFF.ProviderType.ANALYTICS_VALUE_HELP = oFF.ProviderType
				.create("AnalyticsValueHelp");
		oFF.ProviderType.ANALYTICS.m_associatedValueHelp = oFF.ProviderType.ANALYTICS_VALUE_HELP;
		oFF.ProviderType.LIST_REPORTING = oFF.ProviderType
				.create("ListReporting");
		oFF.ProviderType.PLANNING = oFF.ProviderType.create("Planning");
		oFF.ProviderType.CATALOG = oFF.ProviderType.create("Catalog");
		oFF.ProviderType.PLANNING_COMMAND = oFF.ProviderType
				.create("PlanningCommand");
	};
	oFF.ProviderType.create = function(name) {
		var newConstant = oFF.XConstant.setupName(new oFF.ProviderType(), name);
		oFF.ProviderType.s_instances.put(name, newConstant);
		newConstant.m_associatedValueHelp = newConstant;
		return newConstant;
	};
	oFF.ProviderType.getAll = function() {
		return oFF.ProviderType.s_instances;
	};
	oFF.ProviderType.prototype.m_associatedValueHelp = null;
	oFF.ProviderType.prototype.getAssociatedValueHelp = function() {
		return this.m_associatedValueHelp;
	};
	oFF.QContextType = function() {
	};
	oFF.QContextType.prototype = new oFF.XConstant();
	oFF.QContextType.RESULT_SET = null;
	oFF.QContextType.SELECTOR = null;
	oFF.QContextType.VARIABLE = null;
	oFF.QContextType.s_instances = null;
	oFF.QContextType.staticSetup = function() {
		oFF.QContextType.s_instances = oFF.XSetOfNameObject.create();
		oFF.QContextType.RESULT_SET = oFF.QContextType.create("ResultSet");
		oFF.QContextType.SELECTOR = oFF.QContextType.create("Selector");
		oFF.QContextType.VARIABLE = oFF.QContextType.create("Variable");
	};
	oFF.QContextType.create = function(name) {
		var newConstant = oFF.XConstant.setupName(new oFF.QContextType(), name);
		oFF.QContextType.s_instances.add(newConstant);
		return newConstant;
	};
	oFF.QContextType.lookup = function(name) {
		return oFF.QContextType.s_instances.getByKey(name);
	};
	oFF.QExceptionEvalType = function() {
	};
	oFF.QExceptionEvalType.prototype = new oFF.XConstant();
	oFF.QExceptionEvalType.TOTALS = null;
	oFF.QExceptionEvalType.DATA = null;
	oFF.QExceptionEvalType.ALL = null;
	oFF.QExceptionEvalType.staticSetup = function() {
		oFF.QExceptionEvalType.TOTALS = oFF.XConstant.setupName(
				new oFF.QExceptionEvalType(), "Totals");
		oFF.QExceptionEvalType.DATA = oFF.XConstant.setupName(
				new oFF.QExceptionEvalType(), "Data");
		oFF.QExceptionEvalType.ALL = oFF.XConstant.setupName(
				new oFF.QExceptionEvalType(), "All");
	};
	oFF.QExceptionEvalType.lookupExceptionEvalType = function(name) {
		if (oFF.XString.isEqual(name, oFF.QExceptionEvalType.TOTALS.getName())) {
			return oFF.QExceptionEvalType.TOTALS;
		}
		if (oFF.XString.isEqual(name, oFF.QExceptionEvalType.DATA.getName())) {
			return oFF.QExceptionEvalType.DATA;
		}
		return oFF.QExceptionEvalType.ALL;
	};
	oFF.QExceptionHeaderSettings = function() {
	};
	oFF.QExceptionHeaderSettings.prototype = new oFF.XConstant();
	oFF.QExceptionHeaderSettings.NONE = null;
	oFF.QExceptionHeaderSettings.ROW = null;
	oFF.QExceptionHeaderSettings.COLUMN = null;
	oFF.QExceptionHeaderSettings.ROW_AND_COLUMN = null;
	oFF.QExceptionHeaderSettings.staticSetup = function() {
		oFF.QExceptionHeaderSettings.NONE = oFF.XConstant.setupName(
				new oFF.QExceptionHeaderSettings(), "none");
		oFF.QExceptionHeaderSettings.ROW = oFF.XConstant.setupName(
				new oFF.QExceptionHeaderSettings(), "row");
		oFF.QExceptionHeaderSettings.COLUMN = oFF.XConstant.setupName(
				new oFF.QExceptionHeaderSettings(), "column");
		oFF.QExceptionHeaderSettings.ROW_AND_COLUMN = oFF.XConstant.setupName(
				new oFF.QExceptionHeaderSettings(), "rowAndColumn");
	};
	oFF.QExceptionHeaderSettings.lookupExceptionHeaderSetting = function(name) {
		if (oFF.XString.isEqual(name,
				oFF.QExceptionHeaderSettings.ROW_AND_COLUMN.getName())) {
			return oFF.QExceptionHeaderSettings.ROW_AND_COLUMN;
		}
		if (oFF.XString.isEqual(name, oFF.QExceptionHeaderSettings.COLUMN
				.getName())) {
			return oFF.QExceptionHeaderSettings.COLUMN;
		}
		if (oFF.XString.isEqual(name, oFF.QExceptionHeaderSettings.ROW
				.getName())) {
			return oFF.QExceptionHeaderSettings.ROW;
		}
		return oFF.QExceptionHeaderSettings.NONE;
	};
	oFF.QueryFilterUsage = function() {
	};
	oFF.QueryFilterUsage.prototype = new oFF.XConstant();
	oFF.QueryFilterUsage.QUERY_FILTER_EFFECTIVE = null;
	oFF.QueryFilterUsage.QUERY_FILTER = null;
	oFF.QueryFilterUsage.QUERY_FILTER_EXCLUDING_DIMENSION = null;
	oFF.QueryFilterUsage.SELECTOR_FILTER = null;
	oFF.QueryFilterUsage.staticSetup = function() {
		oFF.QueryFilterUsage.QUERY_FILTER_EFFECTIVE = oFF.XConstant.setupName(
				new oFF.QueryFilterUsage(), "Effective");
		oFF.QueryFilterUsage.QUERY_FILTER = oFF.XConstant.setupName(
				new oFF.QueryFilterUsage(), "Complete");
		oFF.QueryFilterUsage.QUERY_FILTER_EXCLUDING_DIMENSION = oFF.XConstant
				.setupName(new oFF.QueryFilterUsage(), "ExludingDimension");
		oFF.QueryFilterUsage.SELECTOR_FILTER = oFF.XConstant.setupName(
				new oFF.QueryFilterUsage(), "Selector");
	};
	oFF.ReorderingCapability = function() {
	};
	oFF.ReorderingCapability.prototype = new oFF.XConstant();
	oFF.ReorderingCapability.NONE = null;
	oFF.ReorderingCapability.RESTRICTED = null;
	oFF.ReorderingCapability.FULL = null;
	oFF.ReorderingCapability.staticSetup = function() {
		oFF.ReorderingCapability.NONE = oFF.XConstant.setupName(
				new oFF.ReorderingCapability(), "None");
		oFF.ReorderingCapability.RESTRICTED = oFF.XConstant.setupName(
				new oFF.ReorderingCapability(), "Restricted");
		oFF.ReorderingCapability.FULL = oFF.XConstant.setupName(
				new oFF.ReorderingCapability(), "Full");
	};
	oFF.RestoreAction = function() {
	};
	oFF.RestoreAction.prototype = new oFF.XConstant();
	oFF.RestoreAction.COPY = null;
	oFF.RestoreAction.CONDITIONAL_COPY = null;
	oFF.RestoreAction.DEFAULT_VALUE = null;
	oFF.RestoreAction.staticSetup = function() {
		oFF.RestoreAction.COPY = oFF.XConstant.setupName(
				new oFF.RestoreAction(), "Copy");
		oFF.RestoreAction.CONDITIONAL_COPY = oFF.XConstant.setupName(
				new oFF.RestoreAction(), "ConditionalCopy");
		oFF.RestoreAction.DEFAULT_VALUE = oFF.XConstant.setupName(
				new oFF.RestoreAction(), "DefaultValue");
	};
	oFF.ResultAlignment = function() {
	};
	oFF.ResultAlignment.prototype = new oFF.XConstant();
	oFF.ResultAlignment.TOP = null;
	oFF.ResultAlignment.BOTTOM = null;
	oFF.ResultAlignment.TOPBOTTOM = null;
	oFF.ResultAlignment.NONE = null;
	oFF.ResultAlignment.STRUCTURE = null;
	oFF.ResultAlignment.staticSetup = function() {
		oFF.ResultAlignment.TOP = oFF.XConstant.setupName(
				new oFF.ResultAlignment(), "Top");
		oFF.ResultAlignment.BOTTOM = oFF.XConstant.setupName(
				new oFF.ResultAlignment(), "Bottom");
		oFF.ResultAlignment.TOPBOTTOM = oFF.XConstant.setupName(
				new oFF.ResultAlignment(), "TopBottom");
		oFF.ResultAlignment.NONE = oFF.XConstant.setupName(
				new oFF.ResultAlignment(), "None");
		oFF.ResultAlignment.STRUCTURE = oFF.XConstant.setupName(
				new oFF.ResultAlignment(), "Structure");
	};
	oFF.ResultCalculation = function() {
	};
	oFF.ResultCalculation.prototype = new oFF.XConstant();
	oFF.ResultCalculation.NOT_DEFINED = null;
	oFF.ResultCalculation.MINIMUM = null;
	oFF.ResultCalculation.MAXIMUM = null;
	oFF.ResultCalculation.SUM = null;
	oFF.ResultCalculation.SUMMATION_OF_ROUNDED_VALUES = null;
	oFF.ResultCalculation.COUNTER_FOR_ALL_DETAILED_VALUES = null;
	oFF.ResultCalculation.COUNTER_FOR_ALL_DETAILED_VALUES_NZ_NULL_ERROR = null;
	oFF.ResultCalculation.FIRST_VALUE = null;
	oFF.ResultCalculation.FIRST_VALUE_NOT_ZERO_NULL_ERROR = null;
	oFF.ResultCalculation.LAST_VALUE = null;
	oFF.ResultCalculation.LAST_VALUE_NOT_ZERO_NULL_ERROR = null;
	oFF.ResultCalculation.AVERAGE = null;
	oFF.ResultCalculation.AVERAGE_DETAILED_VALUES_NOT_ZERO_NULL_ERROR = null;
	oFF.ResultCalculation.STANDARD_DEVIATION = null;
	oFF.ResultCalculation.MEDIAN = null;
	oFF.ResultCalculation.MEDIAN_DETAILED_VALUES_NOT_ZERO_NULL_ERROR = null;
	oFF.ResultCalculation.VARIANCE = null;
	oFF.ResultCalculation.HIDE = null;
	oFF.ResultCalculation.staticSetup = function() {
		oFF.ResultCalculation.NOT_DEFINED = oFF.XConstant.setupName(
				new oFF.ResultCalculation(), "00");
		oFF.ResultCalculation.SUM = oFF.XConstant.setupName(
				new oFF.ResultCalculation(), "01");
		oFF.ResultCalculation.MAXIMUM = oFF.XConstant.setupName(
				new oFF.ResultCalculation(), "02");
		oFF.ResultCalculation.MINIMUM = oFF.XConstant.setupName(
				new oFF.ResultCalculation(), "03");
		oFF.ResultCalculation.COUNTER_FOR_ALL_DETAILED_VALUES = oFF.XConstant
				.setupName(new oFF.ResultCalculation(), "04");
		oFF.ResultCalculation.COUNTER_FOR_ALL_DETAILED_VALUES_NZ_NULL_ERROR = oFF.XConstant
				.setupName(new oFF.ResultCalculation(), "05");
		oFF.ResultCalculation.AVERAGE = oFF.XConstant.setupName(
				new oFF.ResultCalculation(), "06");
		oFF.ResultCalculation.AVERAGE_DETAILED_VALUES_NOT_ZERO_NULL_ERROR = oFF.XConstant
				.setupName(new oFF.ResultCalculation(), "07");
		oFF.ResultCalculation.STANDARD_DEVIATION = oFF.XConstant.setupName(
				new oFF.ResultCalculation(), "08");
		oFF.ResultCalculation.VARIANCE = oFF.XConstant.setupName(
				new oFF.ResultCalculation(), "09");
		oFF.ResultCalculation.FIRST_VALUE = oFF.XConstant.setupName(
				new oFF.ResultCalculation(), "11");
		oFF.ResultCalculation.LAST_VALUE = oFF.XConstant.setupName(
				new oFF.ResultCalculation(), "12");
		oFF.ResultCalculation.SUMMATION_OF_ROUNDED_VALUES = oFF.XConstant
				.setupName(new oFF.ResultCalculation(), "13");
		oFF.ResultCalculation.HIDE = oFF.XConstant.setupName(
				new oFF.ResultCalculation(), "14");
	};
	oFF.ResultSetEncoding = function() {
	};
	oFF.ResultSetEncoding.prototype = new oFF.XConstant();
	oFF.ResultSetEncoding.NONE = null;
	oFF.ResultSetEncoding.AUTO = null;
	oFF.ResultSetEncoding.DELTA_RUN_LENGTH = null;
	oFF.ResultSetEncoding.staticSetup = function() {
		oFF.ResultSetEncoding.NONE = oFF.XConstant.setupName(
				new oFF.ResultSetEncoding(), "None");
		oFF.ResultSetEncoding.AUTO = oFF.XConstant.setupName(
				new oFF.ResultSetEncoding(), "Auto");
		oFF.ResultSetEncoding.DELTA_RUN_LENGTH = oFF.XConstant.setupName(
				new oFF.ResultSetEncoding(), "DeltaRunLength");
	};
	oFF.ResultStructureElement = function() {
	};
	oFF.ResultStructureElement.prototype = new oFF.XConstant();
	oFF.ResultStructureElement.MEMBERS = null;
	oFF.ResultStructureElement.TOTAL = null;
	oFF.ResultStructureElement.TOTAL_INCLUDED_MEMBERS = null;
	oFF.ResultStructureElement.TOTAL_REMAINING_MEMBERS = null;
	oFF.ResultStructureElement.staticSetup = function() {
		oFF.ResultStructureElement.MEMBERS = oFF.XConstant.setupName(
				new oFF.ResultStructureElement(), "Members");
		oFF.ResultStructureElement.TOTAL = oFF.XConstant.setupName(
				new oFF.ResultStructureElement(), "Total");
		oFF.ResultStructureElement.TOTAL_INCLUDED_MEMBERS = oFF.XConstant
				.setupName(new oFF.ResultStructureElement(),
						"TotalIncludedMembers");
		oFF.ResultStructureElement.TOTAL_REMAINING_MEMBERS = oFF.XConstant
				.setupName(new oFF.ResultStructureElement(),
						"TotalRemainingMembers");
	};
	oFF.ResultStructureElement.getStructureElementByMemberType = function(
			memberType) {
		if (memberType === oFF.MemberType.RESULT) {
			return oFF.ResultStructureElement.TOTAL;
		}
		if (memberType === oFF.MemberType.CONDITION_OTHERS_RESULT) {
			return oFF.ResultStructureElement.TOTAL_REMAINING_MEMBERS;
		}
		if (memberType === oFF.MemberType.CONDITION_RESULT) {
			return oFF.ResultStructureElement.TOTAL_INCLUDED_MEMBERS;
		}
		if (memberType.isTypeOf(oFF.MemberType.MEMBER)) {
			return oFF.ResultStructureElement.MEMBERS;
		}
		return null;
	};
	oFF.ResultVisibility = function() {
	};
	oFF.ResultVisibility.prototype = new oFF.XConstant();
	oFF.ResultVisibility.VISIBLE = null;
	oFF.ResultVisibility.ALWAYS = null;
	oFF.ResultVisibility.HIDDEN = null;
	oFF.ResultVisibility.CONDITIONAL = null;
	oFF.ResultVisibility.staticSetup = function() {
		oFF.ResultVisibility.VISIBLE = oFF.XConstant.setupName(
				new oFF.ResultVisibility(), "Visible");
		oFF.ResultVisibility.ALWAYS = oFF.XConstant.setupName(
				new oFF.ResultVisibility(), "Always");
		oFF.ResultVisibility.HIDDEN = oFF.XConstant.setupName(
				new oFF.ResultVisibility(), "Hidden");
		oFF.ResultVisibility.CONDITIONAL = oFF.XConstant.setupName(
				new oFF.ResultVisibility(), "Conditional");
	};
	oFF.ReturnedDataSelection = function() {
	};
	oFF.ReturnedDataSelection.prototype = new oFF.XConstant();
	oFF.ReturnedDataSelection.s_lookup = null;
	oFF.ReturnedDataSelection.CELL_DATA_TYPE = null;
	oFF.ReturnedDataSelection.ACTIONS = null;
	oFF.ReturnedDataSelection.CELL_FORMAT = null;
	oFF.ReturnedDataSelection.CELL_VALUE_TYPES = null;
	oFF.ReturnedDataSelection.CELL_MEASURE = null;
	oFF.ReturnedDataSelection.EXCEPTION_ALERTLEVEL = null;
	oFF.ReturnedDataSelection.EXCEPTION_NAME = null;
	oFF.ReturnedDataSelection.EXCEPTION_SETTINGS = null;
	oFF.ReturnedDataSelection.EXCEPTIONS = null;
	oFF.ReturnedDataSelection.INPUT_ENABLED = null;
	oFF.ReturnedDataSelection.INPUT_READINESS_STATES = null;
	oFF.ReturnedDataSelection.NUMERIC_ROUNDING = null;
	oFF.ReturnedDataSelection.NUMERIC_SHIFT = null;
	oFF.ReturnedDataSelection.TUPLE_DISPLAY_LEVEL = null;
	oFF.ReturnedDataSelection.TUPLE_DRILL_STATE = null;
	oFF.ReturnedDataSelection.TUPLE_ELEMENT_IDS = null;
	oFF.ReturnedDataSelection.TUPLE_ELEMENT_INDEXES = null;
	oFF.ReturnedDataSelection.TUPLE_LEVEL = null;
	oFF.ReturnedDataSelection.TUPLE_PARENT_INDEXES = null;
	oFF.ReturnedDataSelection.UNIT_DESCRIPTIONS = null;
	oFF.ReturnedDataSelection.UNIT_INDEX = null;
	oFF.ReturnedDataSelection.UNIT_TYPES = null;
	oFF.ReturnedDataSelection.UNITS = null;
	oFF.ReturnedDataSelection.VALUES = null;
	oFF.ReturnedDataSelection.VALUES_FORMATTED = null;
	oFF.ReturnedDataSelection.VALUES_ROUNDED = null;
	oFF.ReturnedDataSelection.staticSetup = function() {
		oFF.ReturnedDataSelection.s_lookup = oFF.XHashMapByString.create();
		oFF.ReturnedDataSelection.ACTIONS = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("Actions");
		oFF.ReturnedDataSelection.CELL_DATA_TYPE = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("CellDataType");
		oFF.ReturnedDataSelection.CELL_FORMAT = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("CellFormat");
		oFF.ReturnedDataSelection.CELL_MEASURE = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("CellMeasure");
		oFF.ReturnedDataSelection.CELL_VALUE_TYPES = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("CellValueTypes");
		oFF.ReturnedDataSelection.EXCEPTION_ALERTLEVEL = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("ExceptionAlertLevel");
		oFF.ReturnedDataSelection.EXCEPTION_NAME = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("ExceptionName");
		oFF.ReturnedDataSelection.EXCEPTION_SETTINGS = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("ExceptionSettings");
		oFF.ReturnedDataSelection.EXCEPTIONS = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("Exceptions");
		oFF.ReturnedDataSelection.INPUT_ENABLED = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("InputEnabled");
		oFF.ReturnedDataSelection.INPUT_READINESS_STATES = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("InputReadinessStates");
		oFF.ReturnedDataSelection.NUMERIC_ROUNDING = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("NumericRounding");
		oFF.ReturnedDataSelection.NUMERIC_SHIFT = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("NumericShift");
		oFF.ReturnedDataSelection.TUPLE_DISPLAY_LEVEL = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("TupleDisplayLevel");
		oFF.ReturnedDataSelection.TUPLE_DRILL_STATE = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("TupleDrillState");
		oFF.ReturnedDataSelection.TUPLE_ELEMENT_IDS = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("TupleElementIds");
		oFF.ReturnedDataSelection.TUPLE_ELEMENT_INDEXES = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("TupleElementIndexes");
		oFF.ReturnedDataSelection.TUPLE_LEVEL = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("TupleLevel");
		oFF.ReturnedDataSelection.TUPLE_PARENT_INDEXES = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("TupleParentIndexes");
		oFF.ReturnedDataSelection.UNIT_DESCRIPTIONS = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("UnitDescriptions");
		oFF.ReturnedDataSelection.UNIT_INDEX = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("UnitIndex");
		oFF.ReturnedDataSelection.UNIT_TYPES = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("UnitTypes");
		oFF.ReturnedDataSelection.UNITS = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("Units");
		oFF.ReturnedDataSelection.VALUES = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("Values");
		oFF.ReturnedDataSelection.VALUES_FORMATTED = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("ValuesFormatted");
		oFF.ReturnedDataSelection.VALUES_ROUNDED = oFF.ReturnedDataSelection
				.createReturnedDataSelectionType("ValuesRounded");
	};
	oFF.ReturnedDataSelection.createReturnedDataSelectionType = function(name) {
		var newConstant = oFF.XConstant.setupName(
				new oFF.ReturnedDataSelection(), name);
		oFF.ReturnedDataSelection.s_lookup.put(name, newConstant);
		return newConstant;
	};
	oFF.ReturnedDataSelection.lookup = function(name) {
		return oFF.ReturnedDataSelection.s_lookup.getByKey(name);
	};
	oFF.ReturnedDataSelection.lookupOrCreate = function(name) {
		var dataSelection;
		if (oFF.XStringUtils.isNullOrEmpty(name)) {
			return null;
		}
		dataSelection = oFF.ReturnedDataSelection.lookup(name);
		if (oFF.isNull(dataSelection)) {
			dataSelection = oFF.ReturnedDataSelection
					.createReturnedDataSelectionType(name);
		}
		return dataSelection;
	};
	oFF.ReturnedDataSelection.getAllReturnedDataSelections = function() {
		return oFF.ReturnedDataSelection.s_lookup.getValuesAsReadOnlyList();
	};
	oFF.Scope = function() {
	};
	oFF.Scope.prototype = new oFF.XConstant();
	oFF.Scope.GLOBAL = null;
	oFF.Scope.USER = null;
	oFF.Scope.s_allScopes = null;
	oFF.Scope.staticSetup = function() {
		oFF.Scope.s_allScopes = oFF.XHashMapByString.create();
		oFF.Scope.GLOBAL = oFF.Scope.create("Global");
		oFF.Scope.USER = oFF.Scope.create("User");
	};
	oFF.Scope.create = function(name) {
		var newVariant = oFF.XConstant.setupName(new oFF.Scope(), name);
		oFF.Scope.s_allScopes.put(name, newVariant);
		return newVariant;
	};
	oFF.Scope.lookupByName = function(name) {
		return oFF.Scope.s_allScopes.getByKey(name);
	};
	oFF.SetSign = function() {
	};
	oFF.SetSign.prototype = new oFF.XConstant();
	oFF.SetSign.INCLUDING = null;
	oFF.SetSign.EXCLUDING = null;
	oFF.SetSign.s_lookup = null;
	oFF.SetSign.staticSetup = function() {
		oFF.SetSign.s_lookup = oFF.XHashMapByString.create();
		oFF.SetSign.INCLUDING = oFF.SetSign.create("INCLUDING");
		oFF.SetSign.EXCLUDING = oFF.SetSign.create("EXCLUDING");
	};
	oFF.SetSign.create = function(name) {
		var newConstant = oFF.XConstant.setupName(new oFF.SetSign(), name);
		oFF.SetSign.s_lookup.put(name, newConstant);
		return newConstant;
	};
	oFF.SetSign.lookup = function(name) {
		return oFF.SetSign.s_lookup.getByKey(name);
	};
	oFF.SingleValueCalculation = function() {
	};
	oFF.SingleValueCalculation.prototype = new oFF.XConstant();
	oFF.SingleValueCalculation.NOT_DEFINED = null;
	oFF.SingleValueCalculation.MINIMUM = null;
	oFF.SingleValueCalculation.MAXIMUM = null;
	oFF.SingleValueCalculation.SUM = null;
	oFF.SingleValueCalculation.MINIMUM_VALUES_NOT_ZERO_NULL_ERROR = null;
	oFF.SingleValueCalculation.COUNTER_FOR_ALL_DETAILED_VALUES = null;
	oFF.SingleValueCalculation.COUNTER_FOR_ALL_DETAILED_VALUES_NZ_NULL_ERROR = null;
	oFF.SingleValueCalculation.AVERAGE = null;
	oFF.SingleValueCalculation.AVERAGE_DETAILED_VALUES_NOT_ZERO_NULL_ERROR = null;
	oFF.SingleValueCalculation.HIDE = null;
	oFF.SingleValueCalculation.MOVING_MAX_VALUE = null;
	oFF.SingleValueCalculation.MOVING_MIN_VALUE = null;
	oFF.SingleValueCalculation.MAX_VALUE_NOT_ZERO_NULL_ERROR = null;
	oFF.SingleValueCalculation.RANK_NUMBER = null;
	oFF.SingleValueCalculation.OLYMPIC_RANK_NUMBER = null;
	oFF.SingleValueCalculation.NORMALIZED_UNRESTRICTED_OVERALL_RESULT = null;
	oFF.SingleValueCalculation.NORMALIZED_OVERALL_RESULT = null;
	oFF.SingleValueCalculation.NORMALIZED_NEXT_GROUP_LEVEL_RESULT = null;
	oFF.SingleValueCalculation.staticSetup = function() {
		oFF.SingleValueCalculation.NOT_DEFINED = oFF.XConstant.setupName(
				new oFF.SingleValueCalculation(), "NotDefined");
		oFF.SingleValueCalculation.SUM = oFF.XConstant.setupName(
				new oFF.SingleValueCalculation(), "1");
		oFF.SingleValueCalculation.MAXIMUM = oFF.XConstant.setupName(
				new oFF.SingleValueCalculation(), "2");
		oFF.SingleValueCalculation.MINIMUM = oFF.XConstant.setupName(
				new oFF.SingleValueCalculation(), "3");
		oFF.SingleValueCalculation.COUNTER_FOR_ALL_DETAILED_VALUES = oFF.XConstant
				.setupName(new oFF.SingleValueCalculation(), "4");
		oFF.SingleValueCalculation.COUNTER_FOR_ALL_DETAILED_VALUES_NZ_NULL_ERROR = oFF.XConstant
				.setupName(new oFF.SingleValueCalculation(), "5");
		oFF.SingleValueCalculation.AVERAGE = oFF.XConstant.setupName(
				new oFF.SingleValueCalculation(), "6");
		oFF.SingleValueCalculation.AVERAGE_DETAILED_VALUES_NOT_ZERO_NULL_ERROR = oFF.XConstant
				.setupName(new oFF.SingleValueCalculation(), "7");
		oFF.SingleValueCalculation.MINIMUM_VALUES_NOT_ZERO_NULL_ERROR = oFF.XConstant
				.setupName(new oFF.SingleValueCalculation(), "E");
		oFF.SingleValueCalculation.MAX_VALUE_NOT_ZERO_NULL_ERROR = oFF.XConstant
				.setupName(new oFF.SingleValueCalculation(), "D");
		oFF.SingleValueCalculation.MOVING_MIN_VALUE = oFF.XConstant.setupName(
				new oFF.SingleValueCalculation(), "B");
		oFF.SingleValueCalculation.NORMALIZED_NEXT_GROUP_LEVEL_RESULT = oFF.XConstant
				.setupName(new oFF.SingleValueCalculation(), "C");
		oFF.SingleValueCalculation.NORMALIZED_OVERALL_RESULT = oFF.XConstant
				.setupName(new oFF.SingleValueCalculation(), "G");
		oFF.SingleValueCalculation.NORMALIZED_UNRESTRICTED_OVERALL_RESULT = oFF.XConstant
				.setupName(new oFF.SingleValueCalculation(), "R");
		oFF.SingleValueCalculation.RANK_NUMBER = oFF.XConstant.setupName(
				new oFF.SingleValueCalculation(), "S");
		oFF.SingleValueCalculation.OLYMPIC_RANK_NUMBER = oFF.XConstant
				.setupName(new oFF.SingleValueCalculation(), "O");
		oFF.SingleValueCalculation.HIDE = oFF.XConstant.setupName(
				new oFF.SingleValueCalculation(), "0");
	};
	oFF.UsageShapeType = function() {
	};
	oFF.UsageShapeType.prototype = new oFF.XConstant();
	oFF.UsageShapeType.NOT_VISIBLE = null;
	oFF.UsageShapeType.DISPLAY_ONLY = null;
	oFF.UsageShapeType.CHANGE_TO_EXISTING = null;
	oFF.UsageShapeType.ADD_NEW = null;
	oFF.UsageShapeType.staticSetupUsageShapey = function() {
		oFF.UsageShapeType.NOT_VISIBLE = oFF.XConstant.setupName(
				new oFF.UsageShapeType(), "I");
		oFF.UsageShapeType.DISPLAY_ONLY = oFF.XConstant.setupName(
				new oFF.UsageShapeType(), "D");
		oFF.UsageShapeType.CHANGE_TO_EXISTING = oFF.XConstant.setupName(
				new oFF.UsageShapeType(), "C");
		oFF.UsageShapeType.ADD_NEW = oFF.XConstant.setupName(
				new oFF.UsageShapeType(), "A");
	};
	oFF.UsageShapeType.getUsageShapeType = function(type) {
		if (oFF.XString.isEqual(oFF.UsageShapeType.NOT_VISIBLE.getName(), type)) {
			return oFF.UsageShapeType.NOT_VISIBLE;
		}
		if (oFF.XString
				.isEqual(oFF.UsageShapeType.DISPLAY_ONLY.getName(), type)) {
			return oFF.UsageShapeType.DISPLAY_ONLY;
		}
		if (oFF.XString.isEqual(
				oFF.UsageShapeType.CHANGE_TO_EXISTING.getName(), type)) {
			return oFF.UsageShapeType.CHANGE_TO_EXISTING;
		}
		if (oFF.XString.isEqual(oFF.UsageShapeType.ADD_NEW.getName(), type)) {
			return oFF.UsageShapeType.ADD_NEW;
		}
		return null;
	};
	oFF.ValueException = function() {
	};
	oFF.ValueException.prototype = new oFF.XConstant();
	oFF.ValueException.NORMAL = null;
	oFF.ValueException.NULL_VALUE = null;
	oFF.ValueException.ZERO = null;
	oFF.ValueException.UNDEFINED = null;
	oFF.ValueException.OVERFLOW = null;
	oFF.ValueException.NO_PRESENTATION = null;
	oFF.ValueException.DIFF0 = null;
	oFF.ValueException.ERROR = null;
	oFF.ValueException.NO_AUTHORITY = null;
	oFF.ValueException.MIXED_CURRENCIES_OR_UNITS = null;
	oFF.ValueException.UNDEFINED_NOP = null;
	oFF.ValueException.s_instances = null;
	oFF.ValueException.staticSetup = function() {
		oFF.ValueException.s_instances = oFF.XHashMapByString.create();
		oFF.ValueException.NORMAL = oFF.ValueException
				.create("Normal", true, 0);
		oFF.ValueException.NULL_VALUE = oFF.ValueException.create("NullValue",
				true, -1);
		oFF.ValueException.ZERO = oFF.ValueException.create("Zero", true, 0);
		oFF.ValueException.UNDEFINED = oFF.ValueException.create("Undefined",
				false, 3);
		oFF.ValueException.OVERFLOW = oFF.ValueException.create("Overflow",
				false, 5);
		oFF.ValueException.NO_PRESENTATION = oFF.ValueException.create(
				"NoPresentation", false, 4);
		oFF.ValueException.DIFF0 = oFF.ValueException.create("Diff0", false, 6);
		oFF.ValueException.ERROR = oFF.ValueException.create("Error", false, 7);
		oFF.ValueException.NO_AUTHORITY = oFF.ValueException.create(
				"NoAuthority", false, 2);
		oFF.ValueException.MIXED_CURRENCIES_OR_UNITS = oFF.ValueException
				.create("MixedCurrenciesOrUnits", false, 2);
		oFF.ValueException.UNDEFINED_NOP = oFF.ValueException.create(
				"UndefinedNop", false, 2);
	};
	oFF.ValueException.create = function(constant, validValue,
			naturalOrderValue) {
		var sp = oFF.XConstant.setupName(new oFF.ValueException(), constant);
		sp.setupExt(validValue, naturalOrderValue);
		oFF.ValueException.s_instances.put(constant, sp);
		return sp;
	};
	oFF.ValueException.get = function(name) {
		return oFF.ValueException.s_instances.getByKey(name);
	};
	oFF.ValueException.prototype.m_valid = false;
	oFF.ValueException.prototype.m_naturalOrderValue = 0;
	oFF.ValueException.prototype.setupExt = function(validValue,
			naturalOrderValue) {
		this.m_valid = validValue;
		this.m_naturalOrderValue = naturalOrderValue;
	};
	oFF.ValueException.prototype.isValidValue = function() {
		return this.m_valid;
	};
	oFF.ValueException.prototype.compareTo = function(objectToCompare) {
		return objectToCompare.m_naturalOrderValue - this.m_naturalOrderValue;
	};
	oFF.VariableMode = function() {
	};
	oFF.VariableMode.prototype = new oFF.XConstant();
	oFF.VariableMode.SUBMIT_AND_REINIT = null;
	oFF.VariableMode.DIRECT_VALUE_TRANSFER = null;
	oFF.VariableMode.staticSetup = function() {
		oFF.VariableMode.SUBMIT_AND_REINIT = oFF.XConstant.setupName(
				new oFF.VariableMode(), "SubmitAndReInit");
		oFF.VariableMode.DIRECT_VALUE_TRANSFER = oFF.XConstant.setupName(
				new oFF.VariableMode(), "DirectValueTransfer");
	};
	oFF.VisibilityType = function() {
	};
	oFF.VisibilityType.prototype = new oFF.XConstant();
	oFF.VisibilityType.CENTRAL = null;
	oFF.VisibilityType.CENTRAL_NOT_VISIBLE = null;
	oFF.VisibilityType.CENTRAL_DISPLAY_ONLY = null;
	oFF.VisibilityType.CENTRAL_CHANGE_TO_EXISTING = null;
	oFF.VisibilityType.CENTRAL_ADD_NEW = null;
	oFF.VisibilityType.LOCAL = null;
	oFF.VisibilityType.LOCAL_NOT_VISIBLE = null;
	oFF.VisibilityType.LOCAL_DISPLAY_ONLY = null;
	oFF.VisibilityType.LOCAL_CHANGE_TO_EXISTING = null;
	oFF.VisibilityType.LOCAL_ADD_NEW = null;
	oFF.VisibilityType.staticSetupVisibility = function() {
		oFF.VisibilityType.CENTRAL = oFF.XConstant.setupName(
				new oFF.VisibilityType(), "C");
		oFF.VisibilityType.CENTRAL_NOT_VISIBLE = oFF.XConstant.setupName(
				new oFF.VisibilityType(), "C/I");
		oFF.VisibilityType.CENTRAL_DISPLAY_ONLY = oFF.XConstant.setupName(
				new oFF.VisibilityType(), "C/D");
		oFF.VisibilityType.CENTRAL_CHANGE_TO_EXISTING = oFF.XConstant
				.setupName(new oFF.VisibilityType(), "C/C");
		oFF.VisibilityType.CENTRAL_ADD_NEW = oFF.XConstant.setupName(
				new oFF.VisibilityType(), "C/A");
		oFF.VisibilityType.LOCAL = oFF.XConstant.setupName(
				new oFF.VisibilityType(), "L");
		oFF.VisibilityType.LOCAL_NOT_VISIBLE = oFF.XConstant.setupName(
				new oFF.VisibilityType(), "L/I");
		oFF.VisibilityType.LOCAL_DISPLAY_ONLY = oFF.XConstant.setupName(
				new oFF.VisibilityType(), "L/D");
		oFF.VisibilityType.LOCAL_CHANGE_TO_EXISTING = oFF.XConstant.setupName(
				new oFF.VisibilityType(), "L/C");
		oFF.VisibilityType.LOCAL_ADD_NEW = oFF.XConstant.setupName(
				new oFF.VisibilityType(), "L/A");
	};
	oFF.VisibilityType.getLocalityType = function(type) {
		if (oFF.isNull(type) || oFF.XString.size(type.getName()) < 1) {
			return null;
		}
		return oFF.LocalityType.getLocalityType(oFF.XString.substring(type
				.getName(), 0, 1));
	};
	oFF.VisibilityType.getUsageShapeType = function(type) {
		if (oFF.isNull(type) || oFF.XString.size(type.getName()) < 3) {
			return null;
		}
		return oFF.UsageShapeType.getUsageShapeType(oFF.XString.substring(type
				.getName(), 2, 3));
	};
	oFF.ZeroSuppressionType = function() {
	};
	oFF.ZeroSuppressionType.prototype = new oFF.XConstant();
	oFF.ZeroSuppressionType.NONE = null;
	oFF.ZeroSuppressionType.TOTAL_IS_ZERO = null;
	oFF.ZeroSuppressionType.ALL_CELLS_ARE_ZERO = null;
	oFF.ZeroSuppressionType.create = function(constant, index) {
		var object = oFF.XConstant.setupName(new oFF.ZeroSuppressionType(),
				constant);
		object.m_index = index;
		return object;
	};
	oFF.ZeroSuppressionType.staticSetup = function() {
		oFF.ZeroSuppressionType.NONE = oFF.ZeroSuppressionType
				.create("NONE", 0);
		oFF.ZeroSuppressionType.TOTAL_IS_ZERO = oFF.ZeroSuppressionType.create(
				"TOTAL_IS_ZERO", 1);
		oFF.ZeroSuppressionType.ALL_CELLS_ARE_ZERO = oFF.ZeroSuppressionType
				.create("ALl_CELLS_ARE_ZERO", 2);
	};
	oFF.ZeroSuppressionType.prototype.m_index = 0;
	oFF.ZeroSuppressionType.prototype.getIndex = function() {
		return this.m_index;
	};
	oFF.DrillOperationType = function() {
	};
	oFF.DrillOperationType.prototype = new oFF.XConstant();
	oFF.DrillOperationType.CONTEXT = null;
	oFF.DrillOperationType.ROOT = null;
	oFF.DrillOperationType.staticSetup = function() {
		oFF.DrillOperationType.CONTEXT = oFF.XConstant.setupName(
				new oFF.DrillOperationType(), "Context");
		oFF.DrillOperationType.ROOT = oFF.XConstant.setupName(
				new oFF.DrillOperationType(), "Root");
	};
	oFF.HierarchyType = function() {
	};
	oFF.HierarchyType.prototype = new oFF.XConstant();
	oFF.HierarchyType.UNKNOWN = null;
	oFF.HierarchyType.FULLY_BALANCED = null;
	oFF.HierarchyType.RAGGED_BALANCED = null;
	oFF.HierarchyType.UNBALANCED = null;
	oFF.HierarchyType.NETWORK = null;
	oFF.HierarchyType.s_instances = null;
	oFF.HierarchyType.staticSetup = function() {
		oFF.HierarchyType.s_instances = oFF.XHashMapByString.create();
		oFF.HierarchyType.UNKNOWN = oFF.HierarchyType.create("Unknown", false);
		oFF.HierarchyType.FULLY_BALANCED = oFF.HierarchyType.create(
				"FullyBalanced", true);
		oFF.HierarchyType.RAGGED_BALANCED = oFF.HierarchyType.create(
				"RaggedBalanced", true);
		oFF.HierarchyType.NETWORK = oFF.HierarchyType.create("Network", false);
		oFF.HierarchyType.UNBALANCED = oFF.HierarchyType.create("Unbalanced",
				false);
	};
	oFF.HierarchyType.create = function(camelCaseName, leveledHierarchy) {
		var newConstant = new oFF.HierarchyType();
		newConstant.setName(camelCaseName);
		newConstant.m_leveledHierarchy = leveledHierarchy;
		oFF.HierarchyType.s_instances.put(camelCaseName, newConstant);
		return newConstant;
	};
	oFF.HierarchyType.lookup = function(name) {
		var result = oFF.HierarchyType.s_instances.getByKey(name);
		if (oFF.isNull(result)) {
			return oFF.HierarchyType.UNKNOWN;
		}
		return result;
	};
	oFF.HierarchyType.prototype.m_leveledHierarchy = false;
	oFF.HierarchyType.prototype.isLeveledHierarchy = function() {
		return this.m_leveledHierarchy;
	};
	oFF.QueryCloneMode = function() {
	};
	oFF.QueryCloneMode.prototype = new oFF.XConstant();
	oFF.QueryCloneMode.CURRENT_STATE_INA = null;
	oFF.QueryCloneMode.CURRENT_STATE = null;
	oFF.QueryCloneMode.BASE_STATE = null;
	oFF.QueryCloneMode.MICRO_CUBE = null;
	oFF.QueryCloneMode.staticSetup = function() {
		oFF.QueryCloneMode.CURRENT_STATE = oFF.XConstant.setupName(
				new oFF.QueryCloneMode(), "CurrentStateCopyCtor");
		oFF.QueryCloneMode.CURRENT_STATE_INA = oFF.XConstant.setupName(
				new oFF.QueryCloneMode(), "CurrentState");
		oFF.QueryCloneMode.BASE_STATE = oFF.XConstant.setupName(
				new oFF.QueryCloneMode(), "BaseState");
		oFF.QueryCloneMode.MICRO_CUBE = oFF.XConstant.setupName(
				new oFF.QueryCloneMode(), "MicroCube");
	};
	oFF.QueryManagerMode = function() {
	};
	oFF.QueryManagerMode.prototype = new oFF.XConstant();
	oFF.QueryManagerMode.DEFAULT = null;
	oFF.QueryManagerMode.RAW_QUERY = null;
	oFF.QueryManagerMode.BLENDING = null;
	oFF.QueryManagerMode.staticSetup = function() {
		oFF.QueryManagerMode.DEFAULT = oFF.XConstant.setupName(
				new oFF.QueryManagerMode(), "Default");
		oFF.QueryManagerMode.RAW_QUERY = oFF.XConstant.setupName(
				new oFF.QueryManagerMode(), "RawQuery");
		oFF.QueryManagerMode.BLENDING = oFF.XConstant.setupName(
				new oFF.QueryManagerMode(), "Blending");
	};
	oFF.QExtendedDimension = function() {
	};
	oFF.QExtendedDimension.prototype = new oFF.DfNameTextObject();
	oFF.QExtendedDimension.create = function(name, joinFieldName,
			joinFieldNameExternal) {
		var extendedDimension = new oFF.QExtendedDimension();
		extendedDimension.setupExt(name, joinFieldName, joinFieldNameExternal);
		return extendedDimension;
	};
	oFF.QExtendedDimension.prototype.m_dataSource = null;
	oFF.QExtendedDimension.prototype.m_joinType = null;
	oFF.QExtendedDimension.prototype.m_joinFieldName = null;
	oFF.QExtendedDimension.prototype.m_joinFieldNameExternal = null;
	oFF.QExtendedDimension.prototype.m_joinParameters = null;
	oFF.QExtendedDimension.prototype.m_dimensionType = null;
	oFF.QExtendedDimension.prototype.m_renamingMode = null;
	oFF.QExtendedDimension.prototype.m_joinCardinality = null;
	oFF.QExtendedDimension.prototype.setupExt = function(name, joinFieldName,
			joinFieldNameExternal) {
		this.setName(name);
		this.m_joinFieldName = joinFieldName;
		this.m_joinFieldNameExternal = joinFieldNameExternal;
		this.m_joinParameters = oFF.XListOfString.create();
	};
	oFF.QExtendedDimension.prototype.setJoinType = function(joinType) {
		this.m_joinType = joinType;
		if (this.m_joinType.isTypeOf(oFF.JoinType._SPATIAL)) {
			this.m_dimensionType = oFF.DimensionType.GIS_DIMENSION;
		} else {
			if (oFF.isNull(this.m_dimensionType)) {
				this.m_dimensionType = oFF.DimensionType.TIME;
			}
		}
	};
	oFF.QExtendedDimension.prototype.setDimensionType = function(dimensionType) {
		oFF.XObjectExt
				.checkNotNull(dimensionType,
						"The dimension type of an extended dimension must not be null!");
		if (dimensionType !== oFF.DimensionType.TIME
				&& dimensionType !== oFF.DimensionType.DATE
				&& dimensionType !== oFF.DimensionType.VERSION
				&& dimensionType !== oFF.DimensionType.GIS_DIMENSION) {
			throw oFF.XException.createRuntimeException(oFF.XStringUtils
					.concatenate3("Dimension type '", dimensionType.getName(),
							"' is not supported for extended dimensions!"));
		}
		this.m_dimensionType = dimensionType;
	};
	oFF.QExtendedDimension.prototype.getJoinType = function() {
		return this.m_joinType;
	};
	oFF.QExtendedDimension.prototype.setDataSource = function(datasource) {
		this.m_dataSource = datasource;
	};
	oFF.QExtendedDimension.prototype.getDataSource = function() {
		return this.m_dataSource;
	};
	oFF.QExtendedDimension.prototype.getJoinField = function() {
		return this.m_joinFieldName;
	};
	oFF.QExtendedDimension.prototype.setJoinFieldNameExternal = function(
			fieldName) {
		this.m_joinFieldNameExternal = fieldName;
	};
	oFF.QExtendedDimension.prototype.isEqualTo = function(other) {
		var otherExtDim;
		if (oFF.isNull(other)) {
			return false;
		}
		if (this === other) {
			return true;
		}
		otherExtDim = other;
		if (!oFF.XString.isEqual(this.getName(), otherExtDim.getName())) {
			return false;
		}
		if (this.getJoinType() !== otherExtDim.getJoinType()) {
			return false;
		}
		if (this.getDimensionType() !== otherExtDim.getDimensionType()) {
			return false;
		}
		if (!oFF.XString.isEqual(this.getJoinFieldNameExternal(), otherExtDim
				.getJoinFieldNameExternal())) {
			return false;
		}
		if (!oFF.XString.isEqual(this.getJoinField(), otherExtDim
				.getJoinField())) {
			return false;
		}
		if (!this.getDataSource().isEqualTo(otherExtDim.getDataSource())) {
			return false;
		}
		return true;
	};
	oFF.QExtendedDimension.prototype.toString = function() {
		var sb = oFF.XStringBuffer.create();
		sb.append(this.getName());
		sb.append(" (");
		if (this.getJoinField() !== null) {
			sb.append(this.m_joinFieldName);
		}
		sb.append(" ");
		if (oFF.notNull(this.m_joinType)) {
			sb.append(this.m_joinType.getName());
		}
		if (this.getJoinFieldNameExternal() !== null) {
			sb.append(this.getJoinFieldNameExternal());
		}
		sb.append(")");
		return sb.toString();
	};
	oFF.QExtendedDimension.prototype.getJoinFieldNameExternal = function() {
		return this.m_joinFieldNameExternal;
	};
	oFF.QExtendedDimension.prototype.getDimensionType = function() {
		return this.m_dimensionType;
	};
	oFF.QExtendedDimension.prototype.getJoinParameters = function() {
		return this.m_joinParameters;
	};
	oFF.QExtendedDimension.prototype.setJoinField = function(fieldName) {
		this.m_joinFieldName = fieldName;
	};
	oFF.QExtendedDimension.prototype.releaseObject = function() {
		this.m_dataSource = null;
		this.m_joinType = null;
		this.m_joinParameters = oFF.XObjectExt.release(this.m_joinParameters);
		this.m_dimensionType = null;
		this.m_renamingMode = null;
		this.m_joinCardinality = null;
		oFF.DfNameTextObject.prototype.releaseObject.call(this);
	};
	oFF.QExtendedDimension.prototype.setRenamingMode = function(mode) {
		this.m_renamingMode = mode;
	};
	oFF.QExtendedDimension.prototype.getRenamingMode = function() {
		return this.m_renamingMode;
	};
	oFF.QExtendedDimension.prototype.setJoinCardinality = function(
			joinCardinality) {
		this.m_joinCardinality = joinCardinality;
	};
	oFF.QExtendedDimension.prototype.getJoinCardinality = function() {
		return this.m_joinCardinality;
	};
	oFF.UnitType = function() {
	};
	oFF.UnitType.prototype = new oFF.XConstant();
	oFF.UnitType.NONE = null;
	oFF.UnitType.UNIT = null;
	oFF.UnitType.CURRENCY = null;
	oFF.UnitType.MIXED = null;
	oFF.UnitType.UNDEFINED = null;
	oFF.UnitType.s_instances = null;
	oFF.UnitType.staticSetup = function() {
		oFF.UnitType.s_instances = oFF.XHashMapByString.create();
		oFF.UnitType.NONE = oFF.UnitType.create("NON");
		oFF.UnitType.UNIT = oFF.UnitType.create("UNI");
		oFF.UnitType.CURRENCY = oFF.UnitType.create("CUR");
		oFF.UnitType.MIXED = oFF.UnitType.create("*");
		oFF.UnitType.UNDEFINED = oFF.UnitType.create("UDF");
	};
	oFF.UnitType.create = function(name) {
		var unitType = new oFF.UnitType();
		unitType.setName(name);
		oFF.UnitType.s_instances.put(name, unitType);
		return unitType;
	};
	oFF.UnitType.lookup = function(name) {
		return oFF.UnitType.s_instances.getByKey(name);
	};
	oFF.QVariableVariant = function() {
	};
	oFF.QVariableVariant.prototype = new oFF.DfNameTextObject();
	oFF.QVariableVariant.createVariantWithTypeAndScope = function(name, text,
			variantType, scope) {
		var newVariableVariant = new oFF.QVariableVariant();
		newVariableVariant.setName(name);
		newVariableVariant.setText(text);
		newVariableVariant.m_variantType = variantType;
		newVariableVariant.m_scope = scope;
		return newVariableVariant;
	};
	oFF.QVariableVariant.prototype.m_variantType = null;
	oFF.QVariableVariant.prototype.m_scope = null;
	oFF.QVariableVariant.prototype.clone = function() {
		return oFF.QVariableVariant.createVariantWithTypeAndScope(this
				.getName(), this.getText(), this.m_variantType, this.m_scope);
	};
	oFF.QVariableVariant.prototype.releaseObject = function() {
		this.m_variantType = null;
		this.m_scope = null;
		oFF.DfNameTextObject.prototype.releaseObject.call(this);
	};
	oFF.QVariableVariant.prototype.getVariableVariantType = function() {
		return this.m_variantType;
	};
	oFF.QVariableVariant.prototype.getScope = function() {
		return this.m_scope;
	};
	oFF.ProviderInitProcedure = function() {
	};
	oFF.ProviderInitProcedure.prototype = new oFF.XConstant();
	oFF.ProviderInitProcedure.REQUEST_BY_MODEL = null;
	oFF.ProviderInitProcedure.REQUEST_BY_STRUCTURE = null;
	oFF.ProviderInitProcedure.SKIP = null;
	oFF.ProviderInitProcedure.staticSetup = function() {
		oFF.ProviderInitProcedure.REQUEST_BY_MODEL = oFF.XConstant.setupName(
				new oFF.ProviderInitProcedure(), "RequestByModel");
		oFF.ProviderInitProcedure.REQUEST_BY_STRUCTURE = oFF.XConstant
				.setupName(new oFF.ProviderInitProcedure(),
						"RequestByStructure");
		oFF.ProviderInitProcedure.SKIP = oFF.XConstant.setupName(
				new oFF.ProviderInitProcedure(), "Skip");
	};
	oFF.ResultSetType = function() {
	};
	oFF.ResultSetType.prototype = new oFF.XConstant();
	oFF.ResultSetType.CLASSIC = null;
	oFF.ResultSetType.CURSOR = null;
	oFF.ResultSetType.s_instances = null;
	oFF.ResultSetType.staticSetup = function() {
		oFF.ResultSetType.s_instances = oFF.XHashMapByString.create();
		oFF.ResultSetType.CLASSIC = oFF.ResultSetType.create("Classic");
		oFF.ResultSetType.CURSOR = oFF.ResultSetType.create("Cursor");
	};
	oFF.ResultSetType.create = function(camelCaseName) {
		var newConstant = oFF.XConstant.setupName(new oFF.ResultSetType(),
				camelCaseName);
		oFF.ResultSetType.s_instances.put(camelCaseName, newConstant);
		return newConstant;
	};
	oFF.ResultSetType.lookup = function(name) {
		return oFF.ResultSetType.s_instances.getByKey(name);
	};
	oFF.PlanningCommandType = function() {
	};
	oFF.PlanningCommandType.prototype = new oFF.XConstantWithParent();
	oFF.PlanningCommandType.PLANNING_CONTEXT_COMMAND = null;
	oFF.PlanningCommandType.DATA_AREA_COMMAND = null;
	oFF.PlanningCommandType.PLANNING_MODEL_COMMAND = null;
	oFF.PlanningCommandType.PLANNING_REQUEST = null;
	oFF.PlanningCommandType.DATA_AREA_REQUEST = null;
	oFF.PlanningCommandType.PLANNING_MODEL_REQUEST = null;
	oFF.PlanningCommandType.PLANNING_COMMAND_WITH_ID = null;
	oFF.PlanningCommandType.PLANNING_OPERATION = null;
	oFF.PlanningCommandType.PLANNING_FUNCTION = null;
	oFF.PlanningCommandType.PLANNING_SEQUENCE = null;
	oFF.PlanningCommandType.PLANNING_ACTION = null;
	oFF.PlanningCommandType.staticSetup = function() {
		oFF.PlanningCommandType.PLANNING_CONTEXT_COMMAND = oFF.PlanningCommandType
				.create("PLANNING_CONTEXT_COMMAND", null);
		oFF.PlanningCommandType.DATA_AREA_COMMAND = oFF.PlanningCommandType
				.create("DATA_AREA_COMMAND",
						oFF.PlanningCommandType.PLANNING_CONTEXT_COMMAND);
		oFF.PlanningCommandType.PLANNING_MODEL_COMMAND = oFF.PlanningCommandType
				.create("PLANNING_MODEL_COMMAND",
						oFF.PlanningCommandType.PLANNING_CONTEXT_COMMAND);
		oFF.PlanningCommandType.PLANNING_REQUEST = oFF.PlanningCommandType
				.create("PLANNING_REQUEST", null);
		oFF.PlanningCommandType.DATA_AREA_REQUEST = oFF.PlanningCommandType
				.create("DATA_AREA_REQUEST",
						oFF.PlanningCommandType.PLANNING_REQUEST);
		oFF.PlanningCommandType.PLANNING_MODEL_REQUEST = oFF.PlanningCommandType
				.create("PLANNING_CONTEXT_COMMAND",
						oFF.PlanningCommandType.PLANNING_REQUEST);
		oFF.PlanningCommandType.PLANNING_COMMAND_WITH_ID = oFF.PlanningCommandType
				.create("PLANNING_COMMAND_WITH_ID", null);
		oFF.PlanningCommandType.PLANNING_OPERATION = oFF.PlanningCommandType
				.create("PLANNING_OPERATION",
						oFF.PlanningCommandType.PLANNING_COMMAND_WITH_ID);
		oFF.PlanningCommandType.PLANNING_FUNCTION = oFF.PlanningCommandType
				.create("PLANNING_FUNCTION",
						oFF.PlanningCommandType.PLANNING_OPERATION);
		oFF.PlanningCommandType.PLANNING_SEQUENCE = oFF.PlanningCommandType
				.create("PLANNING_SEQUENCE",
						oFF.PlanningCommandType.PLANNING_OPERATION);
		oFF.PlanningCommandType.PLANNING_ACTION = oFF.PlanningCommandType
				.create("PLANNING_ACTION",
						oFF.PlanningCommandType.PLANNING_COMMAND_WITH_ID);
	};
	oFF.PlanningCommandType.create = function(name, parent) {
		var object = new oFF.PlanningCommandType();
		object.setupExt(name, parent);
		return object;
	};
	oFF.DataAreaRequestType = function() {
	};
	oFF.DataAreaRequestType.prototype = new oFF.XConstantWithParent();
	oFF.DataAreaRequestType.GET_PLANNING_OPERATION_METADATA = null;
	oFF.DataAreaRequestType.GET_PLANNING_FUNCTION_METADATA = null;
	oFF.DataAreaRequestType.GET_PLANNING_SEQUENCE_METADATA = null;
	oFF.DataAreaRequestType.CREATE_PLANNING_OPERATION = null;
	oFF.DataAreaRequestType.CREATE_PLANNING_FUNCTION = null;
	oFF.DataAreaRequestType.CREATE_PLANNING_SEQUENCE = null;
	oFF.DataAreaRequestType.staticSetup = function() {
		oFF.DataAreaRequestType.GET_PLANNING_OPERATION_METADATA = oFF.DataAreaRequestType
				.create("GET_PLANNING_OPERATION_METADATA", null);
		oFF.DataAreaRequestType.GET_PLANNING_FUNCTION_METADATA = oFF.DataAreaRequestType
				.create("GET_PLANNING_FUNCTION_METADATA",
						oFF.DataAreaRequestType.GET_PLANNING_OPERATION_METADATA);
		oFF.DataAreaRequestType.GET_PLANNING_SEQUENCE_METADATA = oFF.DataAreaRequestType
				.create("GET_PLANNING_SEQUENCE_METADATA",
						oFF.DataAreaRequestType.GET_PLANNING_OPERATION_METADATA);
		oFF.DataAreaRequestType.CREATE_PLANNING_OPERATION = oFF.DataAreaRequestType
				.create("CREATE_PLANNING_OPERATION", null);
		oFF.DataAreaRequestType.CREATE_PLANNING_FUNCTION = oFF.DataAreaRequestType
				.create("CREATE_PLANNING_FUNCTION",
						oFF.DataAreaRequestType.CREATE_PLANNING_OPERATION);
		oFF.DataAreaRequestType.CREATE_PLANNING_SEQUENCE = oFF.DataAreaRequestType
				.create("CREATE_PLANNING_SEQUENCE",
						oFF.DataAreaRequestType.CREATE_PLANNING_OPERATION);
	};
	oFF.DataAreaRequestType.create = function(name, parentType) {
		var object = new oFF.DataAreaRequestType();
		object.setupExt(name, parentType);
		return object;
	};
	oFF.PlanningActionType = function() {
	};
	oFF.PlanningActionType.prototype = new oFF.XConstantWithParent();
	oFF.PlanningActionType.VERSION_ACTION = null;
	oFF.PlanningActionType.QUERY_ACTION = null;
	oFF.PlanningActionType.DATA_ENTRY = null;
	oFF.PlanningActionType.PUBLISH = null;
	oFF.PlanningActionType.INITIAL_POPULATE = null;
	oFF.PlanningActionType.GENERAL = null;
	oFF.PlanningActionType.QUERY_SINGLE = null;
	oFF.PlanningActionType.UNKNOWN = null;
	oFF.PlanningActionType.staticSetup = function() {
		oFF.PlanningActionType.UNKNOWN = oFF.PlanningActionType.create(
				"UNKNOWN", null);
		oFF.PlanningActionType.VERSION_ACTION = oFF.PlanningActionType.create(
				"VERSION_ACTION", null);
		oFF.PlanningActionType.PUBLISH = oFF.PlanningActionType.create(
				"PUBLISH", oFF.PlanningActionType.VERSION_ACTION);
		oFF.PlanningActionType.INITIAL_POPULATE = oFF.PlanningActionType
				.create("INITIAL_POPULATE",
						oFF.PlanningActionType.VERSION_ACTION);
		oFF.PlanningActionType.GENERAL = oFF.PlanningActionType.create(
				"GENERAL", oFF.PlanningActionType.VERSION_ACTION);
		oFF.PlanningActionType.QUERY_ACTION = oFF.PlanningActionType.create(
				"QUERY_ACTION", null);
		oFF.PlanningActionType.DATA_ENTRY = oFF.PlanningActionType.create(
				"DATA_ENTRY", oFF.PlanningActionType.QUERY_ACTION);
		oFF.PlanningActionType.QUERY_SINGLE = oFF.PlanningActionType.create(
				"QUERY_SINGLE", oFF.PlanningActionType.QUERY_ACTION);
	};
	oFF.PlanningActionType.create = function(name, parent) {
		var object = new oFF.PlanningActionType();
		object.setupExt(name, parent);
		return object;
	};
	oFF.PlanningActionType.lookup = function(actionTypeId) {
		if (actionTypeId === 0) {
			return oFF.PlanningActionType.DATA_ENTRY;
		}
		if (actionTypeId === 1) {
			return oFF.PlanningActionType.PUBLISH;
		}
		if (actionTypeId === 2) {
			return oFF.PlanningActionType.INITIAL_POPULATE;
		}
		if (actionTypeId === 3) {
			return oFF.PlanningActionType.GENERAL;
		}
		if (actionTypeId === 4) {
			return oFF.PlanningActionType.QUERY_SINGLE;
		}
		return oFF.PlanningActionType.UNKNOWN;
	};
	oFF.PlanningModelRequestType = function() {
	};
	oFF.PlanningModelRequestType.prototype = new oFF.XConstantWithParent();
	oFF.PlanningModelRequestType.GET_ACTION_PARAMETERS = null;
	oFF.PlanningModelRequestType.CREATE_PLANNING_ACTION = null;
	oFF.PlanningModelRequestType.CREATE_PLANNING_ACTION_BASE = null;
	oFF.PlanningModelRequestType.VERSION_REQUEST = null;
	oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_STATE_UPDATE = null;
	oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_TRY_OPTION = null;
	oFF.PlanningModelRequestType.INIT_VERSION = null;
	oFF.PlanningModelRequestType.SET_PARAMETERS = null;
	oFF.PlanningModelRequestType.SAVE_VERSION = null;
	oFF.PlanningModelRequestType.BACKUP_VERSION = null;
	oFF.PlanningModelRequestType.CLOSE_VERSION = null;
	oFF.PlanningModelRequestType.DROP_VERSION = null;
	oFF.PlanningModelRequestType.SET_TIMEOUT = null;
	oFF.PlanningModelRequestType.RESET_VERSION = null;
	oFF.PlanningModelRequestType.UNDO_VERSION = null;
	oFF.PlanningModelRequestType.REDO_VERSION = null;
	oFF.PlanningModelRequestType.UPDATE_PRIVILEGES = null;
	oFF.PlanningModelRequestType.DELETE_ALL_VERSIONS = null;
	oFF.PlanningModelRequestType.CLEANUP = null;
	oFF.PlanningModelRequestType.UPDATE_PARAMETERS = null;
	oFF.PlanningModelRequestType.REFRESH_VERSIONS = null;
	oFF.PlanningModelRequestType.REFRESH_ACTIONS = null;
	oFF.PlanningModelRequestType.START_ACTION_SEQUENCE = null;
	oFF.PlanningModelRequestType.END_ACTION_SEQUENCE = null;
	oFF.PlanningModelRequestType.KILL_ACTION_SEQUENCE = null;
	oFF.PlanningModelRequestType.SYNCHRONIZE_ACTION_SEQUENCE = null;
	oFF.PlanningModelRequestType.GET_VERSION_STATE_DESCRIPTIONS = null;
	oFF.PlanningModelRequestType.staticSetup = function() {
		oFF.PlanningModelRequestType.GET_ACTION_PARAMETERS = oFF.PlanningModelRequestType
				.create("GET_ACTION_PARAMETERS", false);
		oFF.PlanningModelRequestType.CREATE_PLANNING_ACTION_BASE = oFF.PlanningModelRequestType
				.create("CREATE_PLANNING_ACTION_BASE", true);
		oFF.PlanningModelRequestType.CREATE_PLANNING_ACTION = oFF.PlanningModelRequestType
				.create("CREATE_PLANNING_ACTION", true);
		oFF.PlanningModelRequestType.UPDATE_PRIVILEGES = oFF.PlanningModelRequestType
				.create("UPDATE_VERSION_PRIVILEGES", true);
		oFF.PlanningModelRequestType.DELETE_ALL_VERSIONS = oFF.PlanningModelRequestType
				.create("DELETE_ALL_VERSIONS", true);
		oFF.PlanningModelRequestType.CLEANUP = oFF.PlanningModelRequestType
				.create("CLEANUP", true);
		oFF.PlanningModelRequestType.REFRESH_VERSIONS = oFF.PlanningModelRequestType
				.create("REFRESH_VERSIONS", true);
		oFF.PlanningModelRequestType.REFRESH_ACTIONS = oFF.PlanningModelRequestType
				.create("REFRESH_ACTIONS", true);
		oFF.PlanningModelRequestType.VERSION_REQUEST = oFF.PlanningModelRequestType
				.create("VERSION_REQUEST", true);
		oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_STATE_UPDATE = oFF.PlanningModelRequestType
				.createWithParent("VERSION_REQUEST_WITH_STATE_UPDATE",
						oFF.PlanningModelRequestType.VERSION_REQUEST, true);
		oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_TRY_OPTION = oFF.PlanningModelRequestType
				.createWithParent(
						"VERSION_REQUEST_WITH_TRY_OPTION",
						oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_STATE_UPDATE,
						true);
		oFF.PlanningModelRequestType.INIT_VERSION = oFF.PlanningModelRequestType
				.createWithParent(
						"init",
						oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_STATE_UPDATE,
						true);
		oFF.PlanningModelRequestType.SET_PARAMETERS = oFF.PlanningModelRequestType
				.createWithParent(
						"set_parameters",
						oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_STATE_UPDATE,
						true);
		oFF.PlanningModelRequestType.SAVE_VERSION = oFF.PlanningModelRequestType
				.createWithParent(
						"save",
						oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_STATE_UPDATE,
						false);
		oFF.PlanningModelRequestType.BACKUP_VERSION = oFF.PlanningModelRequestType
				.createWithParent(
						"backup",
						oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_STATE_UPDATE,
						true);
		oFF.PlanningModelRequestType.CLOSE_VERSION = oFF.PlanningModelRequestType
				.createWithParent(
						"close",
						oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_TRY_OPTION,
						true);
		oFF.PlanningModelRequestType.DROP_VERSION = oFF.PlanningModelRequestType
				.createWithParent(
						"drop_version",
						oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_STATE_UPDATE,
						true);
		oFF.PlanningModelRequestType.RESET_VERSION = oFF.PlanningModelRequestType
				.createWithParent(
						"reset_version",
						oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_STATE_UPDATE,
						true);
		oFF.PlanningModelRequestType.UNDO_VERSION = oFF.PlanningModelRequestType
				.createWithParent(
						"undo",
						oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_STATE_UPDATE,
						true);
		oFF.PlanningModelRequestType.REDO_VERSION = oFF.PlanningModelRequestType
				.createWithParent(
						"redo",
						oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_STATE_UPDATE,
						true);
		oFF.PlanningModelRequestType.SET_TIMEOUT = oFF.PlanningModelRequestType
				.createWithParent(
						"set_timeout",
						oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_STATE_UPDATE,
						false);
		oFF.PlanningModelRequestType.UPDATE_PARAMETERS = oFF.PlanningModelRequestType
				.createWithParent(
						"update_parameters",
						oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_STATE_UPDATE,
						true);
		oFF.PlanningModelRequestType.START_ACTION_SEQUENCE = oFF.PlanningModelRequestType
				.createWithParent(
						"start_action_sequence",
						oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_TRY_OPTION,
						false);
		oFF.PlanningModelRequestType.END_ACTION_SEQUENCE = oFF.PlanningModelRequestType
				.createWithParent(
						"end_action_sequence",
						oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_TRY_OPTION,
						true);
		oFF.PlanningModelRequestType.KILL_ACTION_SEQUENCE = oFF.PlanningModelRequestType
				.createWithParent(
						"kill_action_sequence",
						oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_STATE_UPDATE,
						true);
		oFF.PlanningModelRequestType.SYNCHRONIZE_ACTION_SEQUENCE = oFF.PlanningModelRequestType
				.createWithParent(
						"synchronize",
						oFF.PlanningModelRequestType.VERSION_REQUEST_WITH_STATE_UPDATE,
						true);
		oFF.PlanningModelRequestType.GET_VERSION_STATE_DESCRIPTIONS = oFF.PlanningModelRequestType
				.createWithParent("get_version_state_descriptions",
						oFF.PlanningModelRequestType.VERSION_REQUEST, false);
	};
	oFF.PlanningModelRequestType.create = function(name,
			isInvalidatingResultSet) {
		return oFF.PlanningModelRequestType.createWithParent(name, null,
				isInvalidatingResultSet);
	};
	oFF.PlanningModelRequestType.createWithParent = function(name, parentType,
			isInvalidatingResultSet) {
		var object = new oFF.PlanningModelRequestType();
		object.setupExt(name, parentType);
		object.setInvalidatingResultSet(isInvalidatingResultSet);
		return object;
	};
	oFF.PlanningModelRequestType.prototype.m_isInvalidatingResultSet = false;
	oFF.PlanningModelRequestType.prototype.isInvalidatingResultSet = function() {
		return this.m_isInvalidatingResultSet;
	};
	oFF.PlanningModelRequestType.prototype.setInvalidatingResultSet = function(
			isInvalidatingResultSet) {
		this.m_isInvalidatingResultSet = isInvalidatingResultSet;
	};
	oFF.JoinType = function() {
	};
	oFF.JoinType.prototype = new oFF.XConstantWithParent();
	oFF.JoinType._TIME = null;
	oFF.JoinType.INNER = null;
	oFF.JoinType.LEFT_OUTER = null;
	oFF.JoinType.RIGHT_OUTER = null;
	oFF.JoinType._SPATIAL = null;
	oFF.JoinType.EQUALS = null;
	oFF.JoinType.DISJOINT = null;
	oFF.JoinType.INTERSECTS = null;
	oFF.JoinType.TOUCHES = null;
	oFF.JoinType.CROSSES = null;
	oFF.JoinType.WITHIN = null;
	oFF.JoinType.CONTAINS = null;
	oFF.JoinType.OVERLAPS = null;
	oFF.JoinType.COVERS = null;
	oFF.JoinType.COVERED_BY = null;
	oFF.JoinType.WITHIN_DISTANCE = null;
	oFF.JoinType.RELATE = null;
	oFF.JoinType.s_lookup = null;
	oFF.JoinType.staticSetup = function() {
		oFF.JoinType.s_lookup = oFF.XHashMapByString.create();
		oFF.JoinType._TIME = oFF.JoinType.createJoinType("TIME", null);
		oFF.JoinType.INNER = oFF.JoinType.createJoinType("INNER",
				oFF.JoinType._TIME);
		oFF.JoinType.LEFT_OUTER = oFF.JoinType.createJoinType("LEFT_OUTER",
				oFF.JoinType._TIME);
		oFF.JoinType.RIGHT_OUTER = oFF.JoinType.createJoinType("RIGHT_OUTER",
				oFF.JoinType._TIME);
		oFF.JoinType._SPATIAL = oFF.JoinType.createJoinType("SPATIAL", null);
		oFF.JoinType.CONTAINS = oFF.JoinType.createJoinType("CONTAINS",
				oFF.JoinType._SPATIAL);
		oFF.JoinType.COVERED_BY = oFF.JoinType.createJoinType("COVERED_BY",
				oFF.JoinType._SPATIAL);
		oFF.JoinType.COVERS = oFF.JoinType.createJoinType("COVERS",
				oFF.JoinType._SPATIAL);
		oFF.JoinType.CROSSES = oFF.JoinType.createJoinType("CROSSES",
				oFF.JoinType._SPATIAL);
		oFF.JoinType.EQUALS = oFF.JoinType.createJoinType("EQUALS",
				oFF.JoinType._SPATIAL);
		oFF.JoinType.DISJOINT = oFF.JoinType.createJoinType("DISJOINT",
				oFF.JoinType._SPATIAL);
		oFF.JoinType.INTERSECTS = oFF.JoinType.createJoinType("INTERSECTS",
				oFF.JoinType._SPATIAL);
		oFF.JoinType.OVERLAPS = oFF.JoinType.createJoinType("OVERLAPS",
				oFF.JoinType._SPATIAL);
		oFF.JoinType.RELATE = oFF.JoinType.createJoinType("RELATE",
				oFF.JoinType._SPATIAL);
		oFF.JoinType.TOUCHES = oFF.JoinType.createJoinType("TOUCHES",
				oFF.JoinType._SPATIAL);
		oFF.JoinType.WITHIN = oFF.JoinType.createJoinType("WITHIN",
				oFF.JoinType._SPATIAL);
		oFF.JoinType.WITHIN_DISTANCE = oFF.JoinType.createJoinType(
				"WITHIN_DISTANCE", oFF.JoinType._SPATIAL);
	};
	oFF.JoinType.createJoinType = function(name, parent) {
		var newConstant = new oFF.JoinType();
		newConstant.setupExt(name, parent);
		oFF.JoinType.s_lookup.put(name, newConstant);
		return newConstant;
	};
	oFF.JoinType.lookup = function(name) {
		return oFF.JoinType.s_lookup.getByKey(name);
	};
	oFF.Operator = function() {
	};
	oFF.Operator.prototype = new oFF.XConstantWithParent();
	oFF.Operator.GRAVITY_0 = 0;
	oFF.Operator.GRAVITY_1 = 1;
	oFF.Operator.GRAVITY_2 = 2;
	oFF.Operator.GRAVITY_3 = 3;
	oFF.Operator.GRAVITY_4 = 4;
	oFF.Operator.GRAVITY_5 = 5;
	oFF.Operator.GRAVITY_6 = 6;
	oFF.Operator.GRAVITY_7 = 7;
	oFF.Operator.GRAVITY_8 = 8;
	oFF.Operator.GRAVITY_9 = 9;
	oFF.Operator._LOGICAL = null;
	oFF.Operator._COMPARISON = null;
	oFF.Operator._MATH = null;
	oFF.Operator._ASSIGN = null;
	oFF.Operator.staticSetup = function() {
		oFF.Operator._LOGICAL = oFF.Operator.createOperator("Logical");
		oFF.Operator._COMPARISON = oFF.Operator.createOperator("Comparison");
		oFF.Operator._MATH = oFF.Operator.createOperator("Math");
		oFF.Operator._ASSIGN = oFF.Operator.createOperator("Assign");
	};
	oFF.Operator.createOperator = function(name) {
		var operator = new oFF.Operator();
		operator.setupOperator(null, name, name, 0, 0, true);
		return operator;
	};
	oFF.Operator.prototype.m_displayString = null;
	oFF.Operator.prototype.m_hasLeftSideHigherPrioWhenEqual = false;
	oFF.Operator.prototype.m_numberOfParameters = 0;
	oFF.Operator.prototype.m_prio = 0;
	oFF.Operator.prototype.setupOperator = function(parent, name,
			displayString, numberOfParameters, gravity,
			hasLeftSideHigherPrioWhenEqual) {
		this.setupExt(name, parent);
		this.setDisplayString(displayString);
		this.setNumberOfParameters(numberOfParameters);
		this.m_prio = gravity;
		this.m_hasLeftSideHigherPrioWhenEqual = hasLeftSideHigherPrioWhenEqual;
	};
	oFF.Operator.prototype.getDisplayString = function() {
		return this.m_displayString;
	};
	oFF.Operator.prototype.setDisplayString = function(displayString) {
		this.m_displayString = displayString;
	};
	oFF.Operator.prototype.getNumberOfParameters = function() {
		return this.m_numberOfParameters;
	};
	oFF.Operator.prototype.setNumberOfParameters = function(numberOfParameters) {
		this.m_numberOfParameters = numberOfParameters;
	};
	oFF.Operator.prototype.getPrio = function() {
		return this.m_prio;
	};
	oFF.Operator.prototype.hasLeftSideHigherPrioWhenEqual = function() {
		return this.m_hasLeftSideHigherPrioWhenEqual;
	};
	oFF.QMemberReadMode = function() {
	};
	oFF.QMemberReadMode.prototype = new oFF.XConstantWithParent();
	oFF.QMemberReadMode.DEFAULT_VALUE = null;
	oFF.QMemberReadMode.UNDEFINED = null;
	oFF.QMemberReadMode.NONE = null;
	oFF.QMemberReadMode.MASTER = null;
	oFF.QMemberReadMode.MASTER_AND_SPACE = null;
	oFF.QMemberReadMode.MASTER_AND_SPACE_AND_STATE = null;
	oFF.QMemberReadMode.REL_MASTER = null;
	oFF.QMemberReadMode.REL_MASTER_AND_SPACE = null;
	oFF.QMemberReadMode.REL_MASTER_AND_SPACE_AND_STATE = null;
	oFF.QMemberReadMode.BOOKED = null;
	oFF.QMemberReadMode.BOOKED_AND_SPACE = null;
	oFF.QMemberReadMode.BOOKED_AND_SPACE_AND_STATE = null;
	oFF.QMemberReadMode.REL_BOOKED = null;
	oFF.QMemberReadMode.REL_BOOKED_AND_SPACE = null;
	oFF.QMemberReadMode.REL_BOOKED_AND_SPACE_AND_STATE = null;
	oFF.QMemberReadMode.s_lookup = null;
	oFF.QMemberReadMode.s_lookup_c = null;
	oFF.QMemberReadMode.staticSetup = function() {
		oFF.QMemberReadMode.s_lookup = oFF.XHashMapByString.create();
		oFF.QMemberReadMode.s_lookup_c = oFF.XHashMapByString.create();
		oFF.QMemberReadMode.DEFAULT_VALUE = oFF.QMemberReadMode.create(
				"Default", null);
		oFF.QMemberReadMode.UNDEFINED = oFF.QMemberReadMode.create("Undefined",
				null);
		oFF.QMemberReadMode.NONE = oFF.QMemberReadMode.create("None", null);
		oFF.QMemberReadMode.MASTER = oFF.QMemberReadMode.create("Master", null);
		oFF.QMemberReadMode.MASTER_AND_SPACE = oFF.QMemberReadMode.create(
				"MasterAndSpace", oFF.QMemberReadMode.MASTER);
		oFF.QMemberReadMode.MASTER_AND_SPACE_AND_STATE = oFF.QMemberReadMode
				.create("MasterAndSpaceAndState",
						oFF.QMemberReadMode.MASTER_AND_SPACE);
		oFF.QMemberReadMode.REL_MASTER = oFF.QMemberReadMode.create(
				"RelatedMaster", null);
		oFF.QMemberReadMode.REL_MASTER_AND_SPACE = oFF.QMemberReadMode.create(
				"RelatedMasterAndSpace", oFF.QMemberReadMode.MASTER);
		oFF.QMemberReadMode.REL_MASTER_AND_SPACE_AND_STATE = oFF.QMemberReadMode
				.create("RelatedMasterAndSpaceAndState",
						oFF.QMemberReadMode.REL_MASTER_AND_SPACE);
		oFF.QMemberReadMode.BOOKED = oFF.QMemberReadMode.create("Booked", null);
		oFF.QMemberReadMode.BOOKED_AND_SPACE = oFF.QMemberReadMode.create(
				"BookedAndSpace", oFF.QMemberReadMode.BOOKED);
		oFF.QMemberReadMode.BOOKED_AND_SPACE_AND_STATE = oFF.QMemberReadMode
				.create("BookedAndSpaceAndState",
						oFF.QMemberReadMode.BOOKED_AND_SPACE);
		oFF.QMemberReadMode.REL_BOOKED = oFF.QMemberReadMode.create(
				"RelatedBooked", null);
		oFF.QMemberReadMode.REL_BOOKED_AND_SPACE = oFF.QMemberReadMode.create(
				"RelatedBookedAndSpace", oFF.QMemberReadMode.REL_BOOKED);
		oFF.QMemberReadMode.REL_BOOKED_AND_SPACE_AND_STATE = oFF.QMemberReadMode
				.create("RelatedBookedAndSpaceAndState",
						oFF.QMemberReadMode.REL_BOOKED_AND_SPACE);
		oFF.QMemberReadMode.MASTER.setChildAndSibling(
				oFF.QMemberReadMode.MASTER_AND_SPACE,
				oFF.QMemberReadMode.BOOKED, 0);
		oFF.QMemberReadMode.MASTER_AND_SPACE.setChildAndSibling(
				oFF.QMemberReadMode.MASTER_AND_SPACE_AND_STATE,
				oFF.QMemberReadMode.BOOKED_AND_SPACE, 1);
		oFF.QMemberReadMode.MASTER_AND_SPACE_AND_STATE.setChildAndSibling(null,
				oFF.QMemberReadMode.BOOKED_AND_SPACE_AND_STATE, 2);
		oFF.QMemberReadMode.REL_MASTER.setChildAndSibling(
				oFF.QMemberReadMode.REL_MASTER_AND_SPACE,
				oFF.QMemberReadMode.MASTER, 0);
		oFF.QMemberReadMode.REL_MASTER_AND_SPACE.setChildAndSibling(
				oFF.QMemberReadMode.REL_MASTER_AND_SPACE_AND_STATE,
				oFF.QMemberReadMode.MASTER_AND_SPACE, 1);
		oFF.QMemberReadMode.REL_MASTER_AND_SPACE_AND_STATE.setChildAndSibling(
				null, oFF.QMemberReadMode.MASTER_AND_SPACE_AND_STATE, 2);
		oFF.QMemberReadMode.BOOKED.setChildAndSibling(
				oFF.QMemberReadMode.BOOKED_AND_SPACE,
				oFF.QMemberReadMode.MASTER, 0);
		oFF.QMemberReadMode.BOOKED_AND_SPACE.setChildAndSibling(
				oFF.QMemberReadMode.BOOKED_AND_SPACE_AND_STATE,
				oFF.QMemberReadMode.MASTER_AND_SPACE, 1);
		oFF.QMemberReadMode.BOOKED_AND_SPACE_AND_STATE.setChildAndSibling(null,
				oFF.QMemberReadMode.MASTER_AND_SPACE_AND_STATE, 2);
		oFF.QMemberReadMode.REL_BOOKED.setChildAndSibling(
				oFF.QMemberReadMode.REL_BOOKED_AND_SPACE,
				oFF.QMemberReadMode.BOOKED, 0);
		oFF.QMemberReadMode.REL_BOOKED_AND_SPACE.setChildAndSibling(
				oFF.QMemberReadMode.REL_BOOKED_AND_SPACE_AND_STATE,
				oFF.QMemberReadMode.BOOKED_AND_SPACE, 1);
		oFF.QMemberReadMode.REL_BOOKED_AND_SPACE_AND_STATE.setChildAndSibling(
				null, oFF.QMemberReadMode.BOOKED_AND_SPACE_AND_STATE, 2);
	};
	oFF.QMemberReadMode.create = function(name, parent) {
		var newConstant = new oFF.QMemberReadMode();
		newConstant.setupExt(name, parent);
		oFF.QMemberReadMode.addToLookupTable(name, newConstant);
		return newConstant;
	};
	oFF.QMemberReadMode.addToLookupTable = function(name, newConstant) {
		oFF.QMemberReadMode.s_lookup.put(name, newConstant);
		oFF.QMemberReadMode.s_lookup_c.put(oFF.XString.toUpperCase(name),
				newConstant);
	};
	oFF.QMemberReadMode.lookup = function(name) {
		return oFF.QMemberReadMode.s_lookup.getByKey(name);
	};
	oFF.QMemberReadMode.lookupCaseInsensitive = function(name) {
		return oFF.QMemberReadMode.s_lookup_c.getByKey(oFF.XString
				.toUpperCase(name));
	};
	oFF.QMemberReadMode.prototype.m_child = null;
	oFF.QMemberReadMode.prototype.m_sibling = null;
	oFF.QMemberReadMode.prototype.m_order = 0;
	oFF.QMemberReadMode.prototype.setChildAndSibling = function(child, sibling,
			order) {
		this.m_child = child;
		this.m_sibling = sibling;
		this.m_order = order;
	};
	oFF.QMemberReadMode.prototype.getChild = function() {
		return this.m_child;
	};
	oFF.QMemberReadMode.prototype.getSibling = function() {
		return this.m_sibling;
	};
	oFF.QMemberReadMode.prototype.getOrder = function() {
		return this.m_order;
	};
	oFF.QModelFormat = function() {
	};
	oFF.QModelFormat.prototype = new oFF.XConstantWithParent();
	oFF.QModelFormat.INA_ABSTRACT_MODEL = null;
	oFF.QModelFormat.INA_DATA = null;
	oFF.QModelFormat.INA_DATA_BLENDING_SOURCE = null;
	oFF.QModelFormat.INA_DATA_REINIT = null;
	oFF.QModelFormat.INA_REPOSITORY = null;
	oFF.QModelFormat.INA_REPOSITORY_NO_VARS = null;
	oFF.QModelFormat.INA_REPOSITORY_DATA = null;
	oFF.QModelFormat.INA_METADATA_CORE = null;
	oFF.QModelFormat.INA_METADATA = null;
	oFF.QModelFormat.INA_CLONE = null;
	oFF.QModelFormat.INA_METADATA_BLENDING = null;
	oFF.QModelFormat.INA_VALUE_HELP = null;
	oFF.QModelFormat.COMMANDS = null;
	oFF.QModelFormat.EXPRESSION = null;
	oFF.QModelFormat.LAYER = null;
	oFF.QModelFormat.VIZDEF = null;
	oFF.QModelFormat.GRIDDEF = null;
	oFF.QModelFormat.GLOBALDEF = null;
	oFF.QModelFormat.UQM = null;
	oFF.QModelFormat.TMX = null;
	oFF.QModelFormat.CSN_METADATA = null;
	oFF.QModelFormat.s_allFormats = null;
	oFF.QModelFormat.s_lookupByExtension = null;
	oFF.QModelFormat.staticSetup = function(version) {
		oFF.QModelFormat.s_allFormats = oFF.XList.create();
		oFF.QModelFormat.s_lookupByExtension = oFF.XHashMapByString.create();
		oFF.QModelFormat.INA_METADATA_CORE = oFF.QModelFormat.create(
				"InAMetadataCore", null, true, false, null);
		oFF.QModelFormat.INA_METADATA = oFF.QModelFormat.create("InAMetadata",
				null, true, true, null);
		oFF.QModelFormat.INA_METADATA_BLENDING = oFF.QModelFormat.create(
				"InAMetadataBlending", null, true, false, null);
		oFF.QModelFormat.INA_ABSTRACT_MODEL = oFF.QModelFormat.create(
				"InAAbstractModel", null, false, true, null);
		oFF.QModelFormat.INA_REPOSITORY = oFF.QModelFormat.create(
				"InARepository", oFF.QModelFormat.INA_ABSTRACT_MODEL, false,
				true, "ffq");
		oFF.QModelFormat.INA_REPOSITORY_NO_VARS = oFF.QModelFormat.create(
				"InARepositoryNoVars", oFF.QModelFormat.INA_REPOSITORY, false,
				true, null);
		oFF.QModelFormat.INA_REPOSITORY_DATA = oFF.QModelFormat.create(
				"InARepositoryData", oFF.QModelFormat.INA_REPOSITORY, false,
				true, null);
		oFF.QModelFormat.INA_VALUE_HELP = oFF.QModelFormat.create(
				"InAValueHelp", oFF.QModelFormat.INA_ABSTRACT_MODEL, false,
				true, null);
		oFF.QModelFormat.INA_DATA = oFF.QModelFormat.create("InAData",
				oFF.QModelFormat.INA_ABSTRACT_MODEL, false, true, "ina");
		oFF.QModelFormat.INA_DATA_REINIT = oFF.QModelFormat.create(
				"InADataReinit", oFF.QModelFormat.INA_DATA, false, true, null);
		oFF.QModelFormat.INA_DATA_BLENDING_SOURCE = oFF.QModelFormat.create(
				"InADataBlendingSource", oFF.QModelFormat.INA_DATA, false,
				true, null);
		oFF.QModelFormat.INA_METADATA_CORE
				.addUsage(oFF.QModelFormat.INA_METADATA);
		oFF.QModelFormat.INA_DATA.addUsage(oFF.QModelFormat.INA_REPOSITORY);
		oFF.QModelFormat.INA_DATA
				.addUsage(oFF.QModelFormat.INA_REPOSITORY_NO_VARS);
		oFF.QModelFormat.INA_DATA
				.addUsage(oFF.QModelFormat.INA_REPOSITORY_DATA);
		oFF.QModelFormat.INA_DATA.addUsage(oFF.QModelFormat.INA_VALUE_HELP);
		oFF.QModelFormat.INA_DATA.addUsage(oFF.QModelFormat.INA_DATA_REINIT);
		oFF.QModelFormat.INA_DATA
				.addUsage(oFF.QModelFormat.INA_DATA_BLENDING_SOURCE);
		oFF.QModelFormat.INA_REPOSITORY
				.addUsage(oFF.QModelFormat.INA_REPOSITORY_NO_VARS);
		oFF.QModelFormat.INA_REPOSITORY
				.addUsage(oFF.QModelFormat.INA_REPOSITORY_DATA);
		oFF.QModelFormat.INA_CLONE = oFF.QModelFormat.create("InAClone", null,
				true, true, null);
		oFF.QModelFormat.COMMANDS = oFF.QModelFormat.create("Commands", null,
				false, true, null);
		oFF.QModelFormat.EXPRESSION = oFF.QModelFormat.create("Expression",
				null, false, true, null);
		oFF.QModelFormat.LAYER = oFF.QModelFormat.create("Layer", null, false,
				true, null);
		oFF.QModelFormat.GRIDDEF = oFF.QModelFormat.create("GridDef", null,
				false, true, null);
		oFF.QModelFormat.VIZDEF = oFF.QModelFormat.create("VizDef", null,
				false, true, null);
		oFF.QModelFormat.GLOBALDEF = oFF.QModelFormat.create("GlobalDef", null,
				false, true, null);
		oFF.QModelFormat.UQM = oFF.QModelFormat.create("Uqm", null, false,
				true, "uqm");
		oFF.QModelFormat.TMX = oFF.QModelFormat.create("Tmx", null, false,
				false, null);
		oFF.QModelFormat.CSN_METADATA = oFF.QModelFormat.create("CSN_METADATA",
				null, false, false, null);
	};
	oFF.QModelFormat.create = function(name, parent, containsMetadata,
			containsModel, extension) {
		var modelFormat = new oFF.QModelFormat();
		modelFormat.setupExt(name, parent);
		modelFormat.m_fileExtension = extension;
		modelFormat.m_containsMetadata = containsMetadata;
		modelFormat.m_containsModel = containsModel;
		modelFormat.m_allUsages = oFF.XList.create();
		modelFormat.m_allUsages.add(modelFormat);
		oFF.QModelFormat.s_allFormats.add(modelFormat);
		if (oFF.notNull(extension)) {
			oFF.QModelFormat.s_lookupByExtension.put(extension, modelFormat);
		}
		return modelFormat;
	};
	oFF.QModelFormat.getAll = function() {
		return oFF.QModelFormat.s_allFormats;
	};
	oFF.QModelFormat.lookupByExtension = function(extension) {
		return oFF.QModelFormat.s_lookupByExtension.getByKey(extension);
	};
	oFF.QModelFormat.prototype.m_containsMetadata = false;
	oFF.QModelFormat.prototype.m_containsModel = false;
	oFF.QModelFormat.prototype.m_fileExtension = null;
	oFF.QModelFormat.prototype.m_allUsages = null;
	oFF.QModelFormat.prototype.containsMetadata = function() {
		return this.m_containsMetadata;
	};
	oFF.QModelFormat.prototype.containsModel = function() {
		return this.m_containsModel;
	};
	oFF.QModelFormat.prototype.addUsage = function(modelFormat) {
		this.m_allUsages.add(modelFormat);
	};
	oFF.QModelFormat.prototype.removeUsage = function(modelFormat) {
		this.m_allUsages.removeElement(modelFormat);
	};
	oFF.QModelFormat.prototype.getUsages = function() {
		return this.m_allUsages;
	};
	oFF.QModelFormat.prototype.getFileExtension = function() {
		return this.m_fileExtension;
	};
	oFF.QModelLevel = function() {
	};
	oFF.QModelLevel.prototype = new oFF.XConstantWithParent();
	oFF.QModelLevel.NONE = null;
	oFF.QModelLevel.QUERY = null;
	oFF.QModelLevel.AXES = null;
	oFF.QModelLevel.DIMENSIONS = null;
	oFF.QModelLevel.staticSetup = function() {
		oFF.QModelLevel.NONE = oFF.QModelLevel.create("None", null, 0);
		oFF.QModelLevel.QUERY = oFF.QModelLevel.create("Query",
				oFF.QModelLevel.NONE, 1);
		oFF.QModelLevel.AXES = oFF.QModelLevel.create("Axes",
				oFF.QModelLevel.QUERY, 2);
		oFF.QModelLevel.DIMENSIONS = oFF.QModelLevel.create("Dimensions",
				oFF.QModelLevel.AXES, 3);
	};
	oFF.QModelLevel.create = function(name, parent, level) {
		var object = new oFF.QModelLevel();
		object.setupExt(name, parent);
		object.m_level = level;
		return object;
	};
	oFF.QModelLevel.prototype.m_level = 0;
	oFF.QModelLevel.prototype.getLevel = function() {
		return this.m_level;
	};
	oFF.QSetSignComparisonOperatorGroup = function() {
	};
	oFF.QSetSignComparisonOperatorGroup.prototype = new oFF.XConstantWithParent();
	oFF.QSetSignComparisonOperatorGroup.SINGLE_VALUE = null;
	oFF.QSetSignComparisonOperatorGroup.SINGLE_VALUE_INCLUDE_ONLY = null;
	oFF.QSetSignComparisonOperatorGroup.INTERVAL = null;
	oFF.QSetSignComparisonOperatorGroup.INTERVAL_INCLUDE_ONLY = null;
	oFF.QSetSignComparisonOperatorGroup.RANGE = null;
	oFF.QSetSignComparisonOperatorGroup.RANGE_INCLUDE_ONLY = null;
	oFF.QSetSignComparisonOperatorGroup.staticSetup = function() {
		oFF.QSetSignComparisonOperatorGroup.SINGLE_VALUE = oFF.QSetSignComparisonOperatorGroup
				.create("SingleValue", null, true);
		oFF.QSetSignComparisonOperatorGroup.SINGLE_VALUE_INCLUDE_ONLY = oFF.QSetSignComparisonOperatorGroup
				.create("SingleValueIncludeOnly",
						oFF.QSetSignComparisonOperatorGroup.SINGLE_VALUE, false);
		oFF.QSetSignComparisonOperatorGroup.INTERVAL = oFF.QSetSignComparisonOperatorGroup
				.create("Interval", null, true);
		oFF.QSetSignComparisonOperatorGroup.INTERVAL_INCLUDE_ONLY = oFF.QSetSignComparisonOperatorGroup
				.create("IntervalIncludeOnly",
						oFF.QSetSignComparisonOperatorGroup.INTERVAL, false);
		oFF.QSetSignComparisonOperatorGroup.RANGE = oFF.QSetSignComparisonOperatorGroup
				.create("Range", null, true);
		oFF.QSetSignComparisonOperatorGroup.RANGE_INCLUDE_ONLY = oFF.QSetSignComparisonOperatorGroup
				.create("RangeIncludeOnly",
						oFF.QSetSignComparisonOperatorGroup.RANGE, false);
	};
	oFF.QSetSignComparisonOperatorGroup.create = function(name, parent,
			withExcludeSign) {
		var newConstant = new oFF.QSetSignComparisonOperatorGroup();
		newConstant.setupExt(name, parent);
		newConstant.setupOperatorGroup(withExcludeSign);
		return newConstant;
	};
	oFF.QSetSignComparisonOperatorGroup.prototype.m_setSigns = null;
	oFF.QSetSignComparisonOperatorGroup.prototype.m_comparisonOperators = null;
	oFF.QSetSignComparisonOperatorGroup.prototype.setupOperatorGroup = function(
			withExcludeSign) {
		var svOperatorSignIncluding;
		var svOperatorSignExcluding;
		var iOperatorSignIncluding;
		var iOperatorSignExcluding;
		var operatorSignIncluding;
		var operatorSignExcluding;
		this.m_setSigns = oFF.XListOfNameObject.create();
		this.m_comparisonOperators = oFF.XHashMapByString.create();
		if (oFF.XString.startsWith(this.getName(), "SingleValue")) {
			this.m_setSigns.add(oFF.SetSign.INCLUDING);
			svOperatorSignIncluding = oFF.XListOfNameObject.create();
			svOperatorSignIncluding.add(oFF.ComparisonOperator.EQUAL);
			this.m_comparisonOperators.put(oFF.SetSign.INCLUDING.getName(),
					svOperatorSignIncluding);
			if (withExcludeSign) {
				this.m_setSigns.add(oFF.SetSign.EXCLUDING);
				svOperatorSignExcluding = oFF.XListOfNameObject.create();
				svOperatorSignExcluding.add(oFF.ComparisonOperator.EQUAL);
				this.m_comparisonOperators.put(oFF.SetSign.EXCLUDING.getName(),
						svOperatorSignExcluding);
			}
		} else {
			if (oFF.XString.startsWith(this.getName(), "Interval")) {
				this.m_setSigns.add(oFF.SetSign.INCLUDING);
				iOperatorSignIncluding = oFF.XListOfNameObject.create();
				iOperatorSignIncluding.add(oFF.ComparisonOperator.BETWEEN);
				iOperatorSignIncluding.add(oFF.ComparisonOperator.EQUAL);
				this.m_comparisonOperators.put(oFF.SetSign.INCLUDING.getName(),
						iOperatorSignIncluding);
				if (withExcludeSign) {
					this.m_setSigns.add(oFF.SetSign.EXCLUDING);
					iOperatorSignExcluding = oFF.XListOfNameObject.create();
					iOperatorSignExcluding.add(oFF.ComparisonOperator.BETWEEN);
					iOperatorSignExcluding.add(oFF.ComparisonOperator.EQUAL);
					this.m_comparisonOperators.put(oFF.SetSign.EXCLUDING
							.getName(), iOperatorSignExcluding);
				}
			} else {
				if (oFF.XString.startsWith(this.getName(), "Range")) {
					this.m_setSigns.add(oFF.SetSign.INCLUDING);
					operatorSignIncluding = oFF.XListOfNameObject.create();
					operatorSignIncluding.add(oFF.ComparisonOperator.BETWEEN);
					operatorSignIncluding.add(oFF.ComparisonOperator.EQUAL);
					operatorSignIncluding
							.add(oFF.ComparisonOperator.GREATER_EQUAL);
					operatorSignIncluding
							.add(oFF.ComparisonOperator.GREATER_THAN);
					operatorSignIncluding
							.add(oFF.ComparisonOperator.LESS_EQUAL);
					operatorSignIncluding.add(oFF.ComparisonOperator.LESS_THAN);
					operatorSignIncluding.add(oFF.ComparisonOperator.NOT_EQUAL);
					operatorSignIncluding
							.add(oFF.ComparisonOperator.NOT_BETWEEN);
					operatorSignIncluding.add(oFF.ComparisonOperator.LIKE);
					operatorSignIncluding.add(oFF.ComparisonOperator.MATCH);
					this.m_comparisonOperators.put(oFF.SetSign.INCLUDING
							.getName(), operatorSignIncluding);
					if (withExcludeSign) {
						this.m_setSigns.add(oFF.SetSign.EXCLUDING);
						operatorSignExcluding = oFF.XListOfNameObject.create();
						operatorSignExcluding
								.add(oFF.ComparisonOperator.BETWEEN);
						operatorSignExcluding.add(oFF.ComparisonOperator.EQUAL);
						operatorSignExcluding
								.add(oFF.ComparisonOperator.GREATER_EQUAL);
						operatorSignExcluding
								.add(oFF.ComparisonOperator.GREATER_THAN);
						operatorSignExcluding
								.add(oFF.ComparisonOperator.LESS_EQUAL);
						operatorSignExcluding
								.add(oFF.ComparisonOperator.LESS_THAN);
						operatorSignExcluding
								.add(oFF.ComparisonOperator.NOT_EQUAL);
						operatorSignExcluding
								.add(oFF.ComparisonOperator.NOT_BETWEEN);
						operatorSignExcluding.add(oFF.ComparisonOperator.LIKE);
						operatorSignExcluding.add(oFF.ComparisonOperator.MATCH);
						this.m_comparisonOperators.put(oFF.SetSign.EXCLUDING
								.getName(), operatorSignExcluding);
					}
				}
			}
		}
	};
	oFF.QSetSignComparisonOperatorGroup.prototype.getSetSigns = function() {
		return this.m_setSigns;
	};
	oFF.QSetSignComparisonOperatorGroup.prototype.getComparisonOperatorsForSign = function(
			sign) {
		return this.m_comparisonOperators.getByKey(sign.getName());
	};
	oFF.ResultSetState = function() {
	};
	oFF.ResultSetState.prototype = new oFF.XConstantWithParent();
	oFF.ResultSetState.INITIAL = null;
	oFF.ResultSetState.FETCHING = null;
	oFF.ResultSetState.TERMINATED = null;
	oFF.ResultSetState.DATA_AVAILABLE = null;
	oFF.ResultSetState.SIZE_LIMIT_EXCEEDED = null;
	oFF.ResultSetState.SUCCESSFUL_PERSISTED = null;
	oFF.ResultSetState.NO_DATA_AVAILABLE = null;
	oFF.ResultSetState.USER_NOT_AUTHORIZED = null;
	oFF.ResultSetState.ERROR = null;
	oFF.ResultSetState.INVALID_VARIABLE_VALUES = null;
	oFF.ResultSetState.UNSUBMITTED_VARIABLES = null;
	oFF.ResultSetState.DATA_ACCESS_PROBLEMS = null;
	oFF.ResultSetState.INVALID_QUERY_VIEW_STATE = null;
	oFF.ResultSetState.EMPTY_JSON = null;
	oFF.ResultSetState.staticSetup = function() {
		oFF.ResultSetState.INITIAL = oFF.ResultSetState.create("INITIAL", null);
		oFF.ResultSetState.FETCHING = oFF.ResultSetState.create("FETCHING",
				null);
		oFF.ResultSetState.TERMINATED = oFF.ResultSetState.create("TERMINATED",
				null);
		oFF.ResultSetState.DATA_AVAILABLE = oFF.ResultSetState.create(
				"DATA_AVAILABLE", null);
		oFF.ResultSetState.SIZE_LIMIT_EXCEEDED = oFF.ResultSetState.create(
				"SIZE_LIMIT_EXCEEDED", null);
		oFF.ResultSetState.NO_DATA_AVAILABLE = oFF.ResultSetState.create(
				"NO_DATA_AVAILABLE", null);
		oFF.ResultSetState.USER_NOT_AUTHORIZED = oFF.ResultSetState.create(
				"USER_NOT_AUTHORIZED", null);
		oFF.ResultSetState.SUCCESSFUL_PERSISTED = oFF.ResultSetState.create(
				"SUCCESSFUL_PERSISTED", null);
		oFF.ResultSetState.EMPTY_JSON = oFF.ResultSetState.create("EMPTY_JSON",
				null);
		oFF.ResultSetState.ERROR = oFF.ResultSetState.create("ERROR", null);
		oFF.ResultSetState.INVALID_VARIABLE_VALUES = oFF.ResultSetState.create(
				"INVALID_VARIABLE_VALUES", oFF.ResultSetState.ERROR);
		oFF.ResultSetState.UNSUBMITTED_VARIABLES = oFF.ResultSetState.create(
				"UNSUBMITTED_VARIABLES", oFF.ResultSetState.ERROR);
		oFF.ResultSetState.DATA_ACCESS_PROBLEMS = oFF.ResultSetState.create(
				"DATA_ACCESS_PROBLEMS", oFF.ResultSetState.ERROR);
		oFF.ResultSetState.INVALID_QUERY_VIEW_STATE = oFF.ResultSetState
				.create("INVALID_QUERY_VIEW_STATE", oFF.ResultSetState.ERROR);
	};
	oFF.ResultSetState.create = function(name, parent) {
		var state = new oFF.ResultSetState();
		state.setupExt(name, parent);
		return state;
	};
	oFF.ResultSetState.prototype.hasData = function() {
		return this === oFF.ResultSetState.DATA_AVAILABLE;
	};
	oFF.ResultSetState.prototype.isErrorState = function() {
		return this.isTypeOf(oFF.ResultSetState.ERROR);
	};
	oFF.SortType = function() {
	};
	oFF.SortType.prototype = new oFF.XConstantWithParent();
	oFF.SortType.ABSTRACT_DIMENSION_SORT = null;
	oFF.SortType.MEMBER_KEY = null;
	oFF.SortType.MEMBER_TEXT = null;
	oFF.SortType.FILTER = null;
	oFF.SortType.HIERARCHY = null;
	oFF.SortType.DATA_CELL_VALUE = null;
	oFF.SortType.FIELD = null;
	oFF.SortType.MEASURE = null;
	oFF.SortType.COMPLEX = null;
	oFF.SortType.s_all = null;
	oFF.SortType.staticSetup = function() {
		oFF.SortType.s_all = oFF.XList.create();
		oFF.SortType.ABSTRACT_DIMENSION_SORT = oFF.SortType.create(
				"AbstractDimensionSort", null);
		oFF.SortType.MEMBER_KEY = oFF.SortType.create("MemberKey",
				oFF.SortType.ABSTRACT_DIMENSION_SORT);
		oFF.SortType.MEMBER_TEXT = oFF.SortType.create("MemberText",
				oFF.SortType.ABSTRACT_DIMENSION_SORT);
		oFF.SortType.FILTER = oFF.SortType.create("Filter",
				oFF.SortType.ABSTRACT_DIMENSION_SORT);
		oFF.SortType.HIERARCHY = oFF.SortType.create("Hierarchy",
				oFF.SortType.ABSTRACT_DIMENSION_SORT);
		oFF.SortType.FIELD = oFF.SortType.create("Field",
				oFF.SortType.ABSTRACT_DIMENSION_SORT);
		oFF.SortType.DATA_CELL_VALUE = oFF.SortType.create("DataCellValue",
				null);
		oFF.SortType.MEASURE = oFF.SortType.create("Measure", null);
		oFF.SortType.COMPLEX = oFF.SortType.create("Complex", null);
	};
	oFF.SortType.create = function(name, parent) {
		var newConstant = new oFF.SortType();
		newConstant.setupExt(name, parent);
		oFF.SortType.s_all.add(newConstant);
		return newConstant;
	};
	oFF.SortType.getAllSortTypes = function() {
		return oFF.SortType.s_all;
	};
	oFF.TextTransformationType = function() {
	};
	oFF.TextTransformationType.prototype = new oFF.XConstantWithParent();
	oFF.TextTransformationType.STRING_TRANSFORMATION = null;
	oFF.TextTransformationType.SPATIAL_TRANSFORMATION = null;
	oFF.TextTransformationType.UPPERCASE = null;
	oFF.TextTransformationType.LOWERCASE = null;
	oFF.TextTransformationType.CAPITALIZE = null;
	oFF.TextTransformationType.SPATIAL_AS_BINARY = null;
	oFF.TextTransformationType.SPATIAL_AS_EWKB = null;
	oFF.TextTransformationType.SPATIAL_AS_EWKT = null;
	oFF.TextTransformationType.SPATIAL_AS_GEOJSON = null;
	oFF.TextTransformationType.SPATIAL_AS_TEXT = null;
	oFF.TextTransformationType.SPATIAL_AS_WKB = null;
	oFF.TextTransformationType.SPATIAL_AS_WKT = null;
	oFF.TextTransformationType.SPATIAL_AS_SVG = null;
	oFF.TextTransformationType.s_lookupNames = null;
	oFF.TextTransformationType.staticSetup = function() {
		oFF.TextTransformationType.s_lookupNames = oFF.XHashMapByString
				.create();
		oFF.TextTransformationType.STRING_TRANSFORMATION = oFF.TextTransformationType
				.create("StringTransformation", null);
		oFF.TextTransformationType.UPPERCASE = oFF.TextTransformationType
				.create("Uppercase",
						oFF.TextTransformationType.STRING_TRANSFORMATION);
		oFF.TextTransformationType.LOWERCASE = oFF.TextTransformationType
				.create("Lowercase",
						oFF.TextTransformationType.STRING_TRANSFORMATION);
		oFF.TextTransformationType.CAPITALIZE = oFF.TextTransformationType
				.create("Capitalize",
						oFF.TextTransformationType.STRING_TRANSFORMATION);
		oFF.TextTransformationType.SPATIAL_TRANSFORMATION = oFF.TextTransformationType
				.create("SpatialTransformation", null);
		oFF.TextTransformationType.SPATIAL_AS_BINARY = oFF.TextTransformationType
				.create("SpatialAsBinary",
						oFF.TextTransformationType.SPATIAL_TRANSFORMATION);
		oFF.TextTransformationType.SPATIAL_AS_EWKB = oFF.TextTransformationType
				.create("SpatialAsEWKB",
						oFF.TextTransformationType.SPATIAL_TRANSFORMATION);
		oFF.TextTransformationType.SPATIAL_AS_EWKT = oFF.TextTransformationType
				.create("SpatialAsEWKT",
						oFF.TextTransformationType.SPATIAL_TRANSFORMATION);
		oFF.TextTransformationType.SPATIAL_AS_GEOJSON = oFF.TextTransformationType
				.create("SpatialAsGeoJSON",
						oFF.TextTransformationType.SPATIAL_TRANSFORMATION);
		oFF.TextTransformationType.SPATIAL_AS_TEXT = oFF.TextTransformationType
				.create("SpatialAsText",
						oFF.TextTransformationType.SPATIAL_TRANSFORMATION);
		oFF.TextTransformationType.SPATIAL_AS_WKB = oFF.TextTransformationType
				.create("SpatialAsWKB",
						oFF.TextTransformationType.SPATIAL_TRANSFORMATION);
		oFF.TextTransformationType.SPATIAL_AS_WKT = oFF.TextTransformationType
				.create("SpatialAsWKT",
						oFF.TextTransformationType.SPATIAL_TRANSFORMATION);
		oFF.TextTransformationType.SPATIAL_AS_SVG = oFF.TextTransformationType
				.create("SpatialAsSVG",
						oFF.TextTransformationType.SPATIAL_TRANSFORMATION);
	};
	oFF.TextTransformationType.create = function(name, parent) {
		var newObj = new oFF.TextTransformationType();
		newObj.setupExt(name, parent);
		oFF.TextTransformationType.s_lookupNames.put(name, newObj);
		return newObj;
	};
	oFF.TextTransformationType.lookupName = function(name) {
		return oFF.TextTransformationType.s_lookupNames.getByKey(name);
	};
	oFF.DfQueryResourceLoadAction = function() {
	};
	oFF.DfQueryResourceLoadAction.prototype = new oFF.SyncAction();
	oFF.DfQueryResourceLoadAction.prototype.onFunctionExecuted = function(
			extResult, response, customIdentifier) {
		var modelFormat;
		var jsonContent;
		var config;
		this.addAllMessages(extResult);
		if (extResult.isValid()) {
			modelFormat = customIdentifier;
			jsonContent = response.getRootElement();
			if (oFF.isNull(jsonContent)) {
				this
						.addError(oFF.ErrorCodes.SYSTEM_IO_HTTP,
								"Content not json");
			} else {
				config = this.getActionContext();
				config.setDefinitionByStructure(modelFormat, jsonContent);
				config.setDataSource(null);
			}
		}
		this.endSync();
	};
	oFF.DfQueryResourceLoadAction.prototype.hasFileExtension = function(
			location) {
		if (oFF.XString.lastIndexOf(location, ".") === -1) {
			this
					.addError(
							oFF.ErrorCodes.SYSTEM_IO_READ_ACCESS,
							oFF.XStringUtils
									.concatenate2(
											"Path not valid, cannot find file extension to resolve model format: ",
											location));
			return false;
		}
		return true;
	};
	oFF.DfQueryResourceLoadAction.prototype.getDataSource = function() {
		return this.getActionContext().getDataSource();
	};
	oFF.QueryResourceLoadAction = function() {
	};
	oFF.QueryResourceLoadAction.prototype = new oFF.SyncAction();
	oFF.QueryResourceLoadAction.createAndRun = function(syncType,
			queryServiceConfig, customIdentifier) {
		var object = new oFF.QueryResourceLoadAction();
		object.setupActionAndRun(syncType, queryServiceConfig, null,
				customIdentifier);
		return object;
	};
	oFF.QueryResourceLoadAction.getFileExtension = function(path) {
		var dot = oFF.XString.lastIndexOf(path, ".");
		return oFF.XString
				.toLowerCase(oFF.XString.substring(path, dot + 1, -1));
	};
	oFF.QueryResourceLoadAction.prototype.processSynchronization = function(
			syncType) {
		var queryServiceContext = this.getActionContext();
		var dataSource = queryServiceContext.getDataSource();
		var type = dataSource.getType();
		var application;
		var repositoryManager;
		var repositoryLocation;
		var location;
		var uri;
		var path;
		var extension;
		var modelFormat;
		var request;
		var testHttpClient;
		if (type === oFF.MetaObjectType.URL) {
			application = this.getActionContext().getApplication();
			repositoryManager = application.getRepositoryManager();
			repositoryLocation = repositoryManager.getLocation();
			location = dataSource.getObjectName();
			if (oFF.isNull(repositoryLocation)) {
				uri = oFF.XUri.createFromUri(location);
			} else {
				uri = oFF.XUri.createFromUriWithParent(location,
						repositoryLocation, false);
			}
			path = uri.getPath();
			if (oFF.XString.lastIndexOf(path, ".") === -1) {
				this
						.addError(
								oFF.ErrorCodes.SYSTEM_IO_READ_ACCESS,
								oFF.XStringUtils
										.concatenate2(
												"Path not valid, cannot find file extension to resolve model format: ",
												location));
			} else {
				extension = oFF.QueryResourceLoadAction.getFileExtension(path);
				if (oFF.XString.isEqual("gz", extension)) {
					path = oFF.XStringUtils.stripRight(path, 3);
					if (oFF.XString.lastIndexOf(path, ".") === -1) {
						this
								.addError(
										oFF.ErrorCodes.SYSTEM_IO_READ_ACCESS,
										oFF.XStringUtils
												.concatenate2(
														"Path not valid, cannot find file extension to resolve model format: ",
														location));
					} else {
						extension = oFF.QueryResourceLoadAction
								.getFileExtension(path);
					}
				}
				modelFormat = oFF.QModelFormat.lookupByExtension(extension);
				if (oFF.isNull(modelFormat)) {
					this
							.addError(
									oFF.ErrorCodes.SYSTEM_IO_READ_ACCESS,
									oFF.XStringUtils
											.concatenate2(
													"No valid extension to resolve model format: ",
													location));
				} else {
					request = oFF.HttpRequest.createByUri(uri);
					testHttpClient = request.newHttpClient(this.getSession());
					testHttpClient.processHttpRequest(syncType, this,
							modelFormat);
					return false;
				}
			}
		}
		return true;
	};
	oFF.QueryResourceLoadAction.prototype.onHttpResponse = function(extResult,
			response, customIdentifier) {
		var modelFormat;
		var statusCode;
		var jsonContent;
		var config;
		this.addAllMessages(extResult);
		if (extResult.isValid()) {
			modelFormat = customIdentifier;
			statusCode = response.getStatusCode();
			if (statusCode !== oFF.HttpStatusCode.SC_OK) {
				this.addError(oFF.ErrorCodes.SYSTEM_IO_HTTP, "Bad status code");
			} else {
				if (response.getContentType() !== oFF.ContentType.APPLICATION_JSON) {
					this.addError(oFF.ErrorCodes.SYSTEM_IO_HTTP,
							"Content not json");
				} else {
					jsonContent = response.getJsonContent();
					if (oFF.isNull(jsonContent) || !jsonContent.isStructure()) {
						this.addError(oFF.ErrorCodes.SYSTEM_IO_HTTP,
								"Content not json");
					} else {
						config = this.getActionContext();
						config.setDefinitionByStructure(modelFormat,
								jsonContent);
						config.setDataSource(null);
					}
				}
			}
		}
		this.endSync();
	};
	oFF.VariableProcessorState = function() {
	};
	oFF.VariableProcessorState.prototype = new oFF.XConstantWithParent();
	oFF.VariableProcessorState.INITIAL = null;
	oFF.VariableProcessorState.MIXED = null;
	oFF.VariableProcessorState.CHANGEABLE = null;
	oFF.VariableProcessorState.CHANGEABLE_DIRECT_VALUE_TRANSFER = null;
	oFF.VariableProcessorState.CHANGEABLE_STATEFUL = null;
	oFF.VariableProcessorState.CHANGEABLE_STARTUP = null;
	oFF.VariableProcessorState.CHANGEABLE_REINIT = null;
	oFF.VariableProcessorState.SUBMITTED = null;
	oFF.VariableProcessorState.VALUE_HELP = null;
	oFF.VariableProcessorState.PROCESSING = null;
	oFF.VariableProcessorState.PROCESSING_DEFINITION = null;
	oFF.VariableProcessorState.PROCESSING_UPDATE_VALUES = null;
	oFF.VariableProcessorState.PROCESSING_CHECK = null;
	oFF.VariableProcessorState.PROCESSING_SUBMIT = null;
	oFF.VariableProcessorState.PROCESSING_SUBMIT_AFTER_REINIT = null;
	oFF.VariableProcessorState.PROCESSING_CANCEL = null;
	oFF.VariableProcessorState.PROCESSING_REINIT = null;
	oFF.VariableProcessorState.PROCESSING_EMPTY_VARIABLE_DEFINITION = null;
	oFF.VariableProcessorState.staticSetup = function() {
		oFF.VariableProcessorState.INITIAL = oFF.VariableProcessorState.create(
				"Initial", null, null);
		oFF.VariableProcessorState.MIXED = oFF.VariableProcessorState.create(
				"Mixed", null, null);
		oFF.VariableProcessorState.CHANGEABLE = oFF.VariableProcessorState
				.create("Changeable", null, null);
		oFF.VariableProcessorState.CHANGEABLE_DIRECT_VALUE_TRANSFER = oFF.VariableProcessorState
				.create("ChangeableDirectValueTransfer",
						oFF.VariableProcessorState.CHANGEABLE, null);
		oFF.VariableProcessorState.CHANGEABLE_STATEFUL = oFF.VariableProcessorState
				.create("ChangeableStateful",
						oFF.VariableProcessorState.CHANGEABLE, null);
		oFF.VariableProcessorState.CHANGEABLE_STARTUP = oFF.VariableProcessorState
				.create("ChangeableStartup",
						oFF.VariableProcessorState.CHANGEABLE_STATEFUL, null);
		oFF.VariableProcessorState.CHANGEABLE_REINIT = oFF.VariableProcessorState
				.create("ChangeableReinit",
						oFF.VariableProcessorState.CHANGEABLE_STATEFUL, null);
		oFF.VariableProcessorState.SUBMITTED = oFF.VariableProcessorState
				.create("Submitted", null, null);
		oFF.VariableProcessorState.VALUE_HELP = oFF.VariableProcessorState
				.create("ValueHelp", oFF.VariableProcessorState.SUBMITTED, null);
		oFF.VariableProcessorState.PROCESSING = oFF.VariableProcessorState
				.create("Processing", null, null);
		oFF.VariableProcessorState.PROCESSING_DEFINITION = oFF.VariableProcessorState
				.create("ProcessingDefinition",
						oFF.VariableProcessorState.PROCESSING,
						oFF.VariableProcessorState.CHANGEABLE_STARTUP);
		oFF.VariableProcessorState.PROCESSING_SUBMIT = oFF.VariableProcessorState
				.create("ProcessingSubmit",
						oFF.VariableProcessorState.PROCESSING,
						oFF.VariableProcessorState.SUBMITTED);
		oFF.VariableProcessorState.PROCESSING_SUBMIT_AFTER_REINIT = oFF.VariableProcessorState
				.create("ProcessingSubmitAfterReinit",
						oFF.VariableProcessorState.PROCESSING_SUBMIT,
						oFF.VariableProcessorState.SUBMITTED);
		oFF.VariableProcessorState.PROCESSING_CANCEL = oFF.VariableProcessorState
				.create("ProcessingCancel",
						oFF.VariableProcessorState.PROCESSING,
						oFF.VariableProcessorState.SUBMITTED);
		oFF.VariableProcessorState.PROCESSING_REINIT = oFF.VariableProcessorState
				.create("ProcessingReinit",
						oFF.VariableProcessorState.PROCESSING,
						oFF.VariableProcessorState.CHANGEABLE_REINIT);
		oFF.VariableProcessorState.PROCESSING_UPDATE_VALUES = oFF.VariableProcessorState
				.create("ProcessingUpdateValues",
						oFF.VariableProcessorState.PROCESSING, null);
		oFF.VariableProcessorState.PROCESSING_CHECK = oFF.VariableProcessorState
				.create("ProcessingCheck",
						oFF.VariableProcessorState.PROCESSING, null);
		oFF.VariableProcessorState.PROCESSING_EMPTY_VARIABLE_DEFINITION = oFF.VariableProcessorState
				.create("ProcessingEmptyVariableDefinition",
						oFF.VariableProcessorState.PROCESSING, null);
	};
	oFF.VariableProcessorState.create = function(name, parent, nextState) {
		var newConstant = new oFF.VariableProcessorState();
		newConstant.setupExt(name, parent);
		newConstant.m_nextState = nextState;
		return newConstant;
	};
	oFF.VariableProcessorState.prototype.m_nextState = null;
	oFF.VariableProcessorState.prototype.getNextState = function() {
		return this.m_nextState;
	};
	oFF.VariableProcessorState.prototype.isSubmitNeeded = function() {
		return this.isTypeOf(oFF.VariableProcessorState.CHANGEABLE_STATEFUL)
				|| this === oFF.VariableProcessorState.PROCESSING_EMPTY_VARIABLE_DEFINITION;
	};
	oFF.VariableProcessorState.prototype.isReinitNeeded = function() {
		return this === oFF.VariableProcessorState.SUBMITTED;
	};
	oFF.VariableProcessorState.prototype.isCancelNeeded = function() {
		return this === oFF.VariableProcessorState.CHANGEABLE_REINIT;
	};
	oFF.RgCellType = function() {
	};
	oFF.RgCellType.prototype = new oFF.XConstantWithParent();
	oFF.RgCellType.CELL = null;
	oFF.RgCellType.REAL_CELL = null;
	oFF.RgCellType.ANCHOR_CELL = null;
	oFF.RgCellType.CONTENT = null;
	oFF.RgCellType.SELECT = null;
	oFF.RgCellType.HEAD_AREA = null;
	oFF.RgCellType.TITLE = null;
	oFF.RgCellType.TWIN = null;
	oFF.RgCellType.HEADER = null;
	oFF.RgCellType.HIERARCHY = null;
	oFF.RgCellType.SCALING = null;
	oFF.RgCellType.SELECT_ROWS = null;
	oFF.RgCellType.SELECT_COLUMNS = null;
	oFF.RgCellType.DATA = null;
	oFF.RgCellType.staticSetup = function() {
		oFF.RgCellType.CELL = oFF.RgCellType.create("CELL", null);
		oFF.RgCellType.REAL_CELL = oFF.RgCellType.create("REAL_CELL",
				oFF.RgCellType.CELL);
		oFF.RgCellType.ANCHOR_CELL = oFF.RgCellType.create("ANCHOR_CELL",
				oFF.RgCellType.CELL);
		oFF.RgCellType.CONTENT = oFF.RgCellType.create("CONTENT",
				oFF.RgCellType.REAL_CELL);
		oFF.RgCellType.SELECT = oFF.RgCellType.create("SELECT",
				oFF.RgCellType.REAL_CELL);
		oFF.RgCellType.HEAD_AREA = oFF.RgCellType.create("HEAD_AREA",
				oFF.RgCellType.CONTENT);
		oFF.RgCellType.TITLE = oFF.RgCellType.create("TITLE",
				oFF.RgCellType.HEAD_AREA);
		oFF.RgCellType.TWIN = oFF.RgCellType.create("TWIN",
				oFF.RgCellType.TITLE);
		oFF.RgCellType.HEADER = oFF.RgCellType.create("HEADER",
				oFF.RgCellType.HEAD_AREA);
		oFF.RgCellType.HIERARCHY = oFF.RgCellType.create("HIERARCHY",
				oFF.RgCellType.HEADER);
		oFF.RgCellType.SCALING = oFF.RgCellType.create("SCALING",
				oFF.RgCellType.HEADER);
		oFF.RgCellType.SELECT_ROWS = oFF.RgCellType.create("SELECT_ROWS",
				oFF.RgCellType.SELECT);
		oFF.RgCellType.SELECT_COLUMNS = oFF.RgCellType.create("SELECT_COLUMNS",
				oFF.RgCellType.SELECT);
		oFF.RgCellType.DATA = oFF.RgCellType.create("DATA",
				oFF.RgCellType.CONTENT);
	};
	oFF.RgCellType.create = function(name, parent) {
		var object = new oFF.RgCellType();
		object.setupExt(name, parent);
		return object;
	};
	oFF.AssignOperator = function() {
	};
	oFF.AssignOperator.prototype = new oFF.Operator();
	oFF.AssignOperator.ASSIGN = null;
	oFF.AssignOperator.ASSIGN_DEF = null;
	oFF.AssignOperator.ASSIGN_PROP = null;
	oFF.AssignOperator.staticSetupAssignOps = function() {
		oFF.AssignOperator.ASSIGN_PROP = oFF.AssignOperator.createAssign(
				"AssignProp", "=>", oFF.Operator.GRAVITY_3);
		oFF.AssignOperator.ASSIGN_DEF = oFF.AssignOperator.createAssign(
				"AssignDef", "=:", oFF.Operator.GRAVITY_9);
		oFF.AssignOperator.ASSIGN = oFF.AssignOperator.createAssign("Assign",
				"=", oFF.Operator.GRAVITY_9);
	};
	oFF.AssignOperator.createAssign = function(name, displayString, gravity) {
		var newConstant = new oFF.AssignOperator();
		newConstant.setupOperator(oFF.Operator._MATH, name, displayString, 0,
				gravity, true);
		return newConstant;
	};
	oFF.ComparisonOperator = function() {
	};
	oFF.ComparisonOperator.prototype = new oFF.Operator();
	oFF.ComparisonOperator.UNDEFINED = null;
	oFF.ComparisonOperator.IS_NULL = null;
	oFF.ComparisonOperator.LIKE = null;
	oFF.ComparisonOperator.MATCH = null;
	oFF.ComparisonOperator.NOT_MATCH = null;
	oFF.ComparisonOperator.EQUAL = null;
	oFF.ComparisonOperator.NOT_EQUAL = null;
	oFF.ComparisonOperator.GREATER_THAN = null;
	oFF.ComparisonOperator.GREATER_EQUAL = null;
	oFF.ComparisonOperator.LESS_THAN = null;
	oFF.ComparisonOperator.LESS_EQUAL = null;
	oFF.ComparisonOperator.BETWEEN = null;
	oFF.ComparisonOperator.NOT_BETWEEN = null;
	oFF.ComparisonOperator.BETWEEN_EXCLUDING = null;
	oFF.ComparisonOperator.NOT_BETWEEN_EXCLUDING = null;
	oFF.ComparisonOperator.FUZZY = null;
	oFF.ComparisonOperator.SEARCH = null;
	oFF.ComparisonOperator.IN = null;
	oFF.ComparisonOperator.ALL = null;
	oFF.ComparisonOperator.AGGREGATED = null;
	oFF.ComparisonOperator.NON_AGGREGATED = null;
	oFF.ComparisonOperator.s_lookup = null;
	oFF.ComparisonOperator.staticSetupComparisonOps = function() {
		oFF.ComparisonOperator.s_lookup = oFF.XHashMapByString.create();
		oFF.ComparisonOperator.UNDEFINED = oFF.ComparisonOperator
				.createComparison("UNDEFINED", "?", 0);
		oFF.ComparisonOperator.IS_NULL = oFF.ComparisonOperator
				.createComparison("IS_NULL", "IS_NULL", 0);
		oFF.ComparisonOperator.EQUAL = oFF.ComparisonOperator.createComparison(
				"EQUAL", "==", 1);
		oFF.ComparisonOperator.NOT_EQUAL = oFF.ComparisonOperator
				.createComparison("NOT_EQUAL", "!=", 1);
		oFF.ComparisonOperator.GREATER_THAN = oFF.ComparisonOperator
				.createComparison("GREATER_THAN", ">", 1);
		oFF.ComparisonOperator.GREATER_EQUAL = oFF.ComparisonOperator
				.createComparison("GREATER_EQUAL", ">=", 1);
		oFF.ComparisonOperator.LESS_THAN = oFF.ComparisonOperator
				.createComparison("LESS_THAN", "<", 1);
		oFF.ComparisonOperator.LESS_EQUAL = oFF.ComparisonOperator
				.createComparison("LESS_EQUAL", "<=", 1);
		oFF.ComparisonOperator.LIKE = oFF.ComparisonOperator.createComparison(
				"LIKE", "like", 1);
		oFF.ComparisonOperator.MATCH = oFF.ComparisonOperator.createComparison(
				"MATCH", "match", 1);
		oFF.ComparisonOperator.NOT_MATCH = oFF.ComparisonOperator
				.createComparison("NOT_MATCH", "notMatch", 1);
		oFF.ComparisonOperator.BETWEEN = oFF.ComparisonOperator
				.createComparison("BETWEEN", "between", 2);
		oFF.ComparisonOperator.NOT_BETWEEN = oFF.ComparisonOperator
				.createComparison("NOT_BETWEEN", "notBetween", 2);
		oFF.ComparisonOperator.BETWEEN_EXCLUDING = oFF.ComparisonOperator
				.createComparison("BETWEEN_EXCLUDING", "betweenExcluding", 2);
		oFF.ComparisonOperator.NOT_BETWEEN_EXCLUDING = oFF.ComparisonOperator
				.createComparison("NOT_BETWEEN_EXCLUDING",
						"notBetweenExcluding", 2);
		oFF.ComparisonOperator.FUZZY = oFF.ComparisonOperator.createComparison(
				"FUZZY", "fuzzy", 2);
		oFF.ComparisonOperator.SEARCH = oFF.ComparisonOperator
				.createComparison("SEARCH", "search", 1);
		oFF.ComparisonOperator.IN = oFF.ComparisonOperator.createComparison(
				"IN", "in", 1);
		oFF.ComparisonOperator.ALL = oFF.ComparisonOperator.createComparison(
				"ALL", "all", 0);
		oFF.ComparisonOperator.AGGREGATED = oFF.ComparisonOperator
				.createComparison("AGGREGATED", "aggregated", 0);
		oFF.ComparisonOperator.NON_AGGREGATED = oFF.ComparisonOperator
				.createComparison("NON-AGGREGATED", "NON-AGGREGATED", 0);
	};
	oFF.ComparisonOperator.createComparison = function(name, displayString,
			numberOfParameters) {
		var newConstant = new oFF.ComparisonOperator();
		newConstant
				.setupOperator(oFF.Operator._COMPARISON, name, displayString,
						numberOfParameters, oFF.Operator.GRAVITY_3, true);
		oFF.ComparisonOperator.s_lookup.put(name, newConstant);
		return newConstant;
	};
	oFF.ComparisonOperator.lookup = function(name) {
		return oFF.ComparisonOperator.s_lookup.getByKey(name);
	};
	oFF.ConditionComparisonOperator = function() {
	};
	oFF.ConditionComparisonOperator.prototype = new oFF.Operator();
	oFF.ConditionComparisonOperator.EQUAL = null;
	oFF.ConditionComparisonOperator.NOT_EQUAL = null;
	oFF.ConditionComparisonOperator.GREATER_THAN = null;
	oFF.ConditionComparisonOperator.GREATER_EQUAL = null;
	oFF.ConditionComparisonOperator.LESS_THAN = null;
	oFF.ConditionComparisonOperator.LESS_EQUAL = null;
	oFF.ConditionComparisonOperator.BETWEEN = null;
	oFF.ConditionComparisonOperator.NOT_BETWEEN = null;
	oFF.ConditionComparisonOperator.TOP_N = null;
	oFF.ConditionComparisonOperator.BOTTOM_N = null;
	oFF.ConditionComparisonOperator.TOP_PERCENT = null;
	oFF.ConditionComparisonOperator.BOTTOM_PERCENT = null;
	oFF.ConditionComparisonOperator.TOP_SUM = null;
	oFF.ConditionComparisonOperator.BOTTOM_SUM = null;
	oFF.ConditionComparisonOperator.s_lookupNames = null;
	oFF.ConditionComparisonOperator.staticSetupComparisonOps = function() {
		oFF.ConditionComparisonOperator.s_lookupNames = oFF.XHashMapByString
				.create();
		oFF.ConditionComparisonOperator.EQUAL = oFF.ConditionComparisonOperator
				.createComparison("=", "==", 1);
		oFF.ConditionComparisonOperator.NOT_EQUAL = oFF.ConditionComparisonOperator
				.createComparison("<>", "<>", 1);
		oFF.ConditionComparisonOperator.GREATER_THAN = oFF.ConditionComparisonOperator
				.createComparison(">", ">", 1);
		oFF.ConditionComparisonOperator.GREATER_EQUAL = oFF.ConditionComparisonOperator
				.createComparison(">=", ">=", 1);
		oFF.ConditionComparisonOperator.LESS_THAN = oFF.ConditionComparisonOperator
				.createComparison("<", "<", 1);
		oFF.ConditionComparisonOperator.LESS_EQUAL = oFF.ConditionComparisonOperator
				.createComparison("<=", "<=", 1);
		oFF.ConditionComparisonOperator.BETWEEN = oFF.ConditionComparisonOperator
				.createComparison("BETWEEN", "BETWEEN", 2);
		oFF.ConditionComparisonOperator.NOT_BETWEEN = oFF.ConditionComparisonOperator
				.createComparison("NOTBETWEEN", "NOTBETWEEN", 2);
		oFF.ConditionComparisonOperator.TOP_N = oFF.ConditionComparisonOperator
				.createComparison("TOP_N", "TOP_N", 2);
		oFF.ConditionComparisonOperator.BOTTOM_N = oFF.ConditionComparisonOperator
				.createComparison("BOTTOM_N", "BOTTOM_N", 2);
		oFF.ConditionComparisonOperator.TOP_PERCENT = oFF.ConditionComparisonOperator
				.createComparison("TOP_PERCENT", "TOP_PERCENT", 1);
		oFF.ConditionComparisonOperator.BOTTOM_PERCENT = oFF.ConditionComparisonOperator
				.createComparison("BOTTOM_PERCENT", "BOTTOM_PERCENT", 1);
		oFF.ConditionComparisonOperator.TOP_SUM = oFF.ConditionComparisonOperator
				.createComparison("TOP_SUM", "TOP_SUM", 1);
		oFF.ConditionComparisonOperator.BOTTOM_SUM = oFF.ConditionComparisonOperator
				.createComparison("BOTTOM_SUM", "BOTTOM_SUM", 1);
	};
	oFF.ConditionComparisonOperator.createComparison = function(name,
			displayString, numberOfParameters) {
		var newConstant = new oFF.ConditionComparisonOperator();
		newConstant
				.setupOperator(oFF.Operator._COMPARISON, name, displayString,
						numberOfParameters, oFF.Operator.GRAVITY_3, true);
		oFF.ConditionComparisonOperator.s_lookupNames.put(displayString,
				newConstant);
		return newConstant;
	};
	oFF.ConditionComparisonOperator.lookupName = function(name) {
		return oFF.ConditionComparisonOperator.s_lookupNames.getByKey(name);
	};
	oFF.LogicalBoolOperator = function() {
	};
	oFF.LogicalBoolOperator.prototype = new oFF.Operator();
	oFF.LogicalBoolOperator.AND = null;
	oFF.LogicalBoolOperator.OR = null;
	oFF.LogicalBoolOperator.NOT = null;
	oFF.LogicalBoolOperator.staticSetupLogicalOps = function() {
		oFF.LogicalBoolOperator.AND = oFF.LogicalBoolOperator.create("AND",
				"&&", 2, oFF.Operator.GRAVITY_6);
		oFF.LogicalBoolOperator.OR = oFF.LogicalBoolOperator.create("OR", "||",
				2, oFF.Operator.GRAVITY_5);
		oFF.LogicalBoolOperator.NOT = oFF.LogicalBoolOperator.create("NOT",
				"!", 1, oFF.Operator.GRAVITY_5);
	};
	oFF.LogicalBoolOperator.create = function(name, displayString,
			numberOfParameters, gravity) {
		var newConstant = new oFF.LogicalBoolOperator();
		newConstant.setupOperator(oFF.Operator._LOGICAL, name, displayString,
				numberOfParameters, gravity, false);
		return newConstant;
	};
	oFF.MathOperator = function() {
	};
	oFF.MathOperator.prototype = new oFF.Operator();
	oFF.MathOperator.MULT = null;
	oFF.MathOperator.DIV = null;
	oFF.MathOperator.PLUS = null;
	oFF.MathOperator.MINUS = null;
	oFF.MathOperator.MODULO = null;
	oFF.MathOperator.POWER = null;
	oFF.MathOperator.staticSetupMathOps = function() {
		oFF.MathOperator.MULT = oFF.MathOperator.create("Mult", "*",
				oFF.Operator.GRAVITY_1);
		oFF.MathOperator.DIV = oFF.MathOperator.create("Div", "/",
				oFF.Operator.GRAVITY_1);
		oFF.MathOperator.PLUS = oFF.MathOperator.create("Plus", "+",
				oFF.Operator.GRAVITY_2);
		oFF.MathOperator.MINUS = oFF.MathOperator.create("Minus", "-",
				oFF.Operator.GRAVITY_2);
		oFF.MathOperator.POWER = oFF.MathOperator.create("Power", "**",
				oFF.Operator.GRAVITY_1);
	};
	oFF.MathOperator.create = function(name, displayString, gravity) {
		var newConstant = new oFF.MathOperator();
		newConstant.setupOperator(oFF.Operator._MATH, name, displayString, 0,
				gravity, true);
		return newConstant;
	};
	oFF.OlapComponentType = function() {
	};
	oFF.OlapComponentType.prototype = new oFF.XComponentType();
	oFF.OlapComponentType.OLAP_ENVIRONMENT = null;
	oFF.OlapComponentType.OLAP_DATA_PROVIDER = null;
	oFF.OlapComponentType.CHART_DATA_PROVIDER = null;
	oFF.OlapComponentType.CONVENIENCE_CMDS = null;
	oFF.OlapComponentType.OLAP = null;
	oFF.OlapComponentType.QUERY_MANAGER = null;
	oFF.OlapComponentType.DATA_SOURCE = null;
	oFF.OlapComponentType.SELECTOR = null;
	oFF.OlapComponentType.ATTRIBUTE_CONTAINER = null;
	oFF.OlapComponentType.ATTRIBUTE = null;
	oFF.OlapComponentType.FILTER_EXPRESSION = null;
	oFF.OlapComponentType.FILTER_LITERAL = null;
	oFF.OlapComponentType.FILTER_FIXED = null;
	oFF.OlapComponentType.FILTER_DYNAMIC = null;
	oFF.OlapComponentType.FILTER_VISIBILITY = null;
	oFF.OlapComponentType.FILTER_ELEMENT = null;
	oFF.OlapComponentType.FILTER_CELL_VALUE_OPERAND = null;
	oFF.OlapComponentType.QUERY_CONTEXT = null;
	oFF.OlapComponentType.DIMENSION_CONTEXT = null;
	oFF.OlapComponentType.DIMENSIONS = null;
	oFF.OlapComponentType.EXCEPTION_MANAGER = null;
	oFF.OlapComponentType.QUERY_MODEL = null;
	oFF.OlapComponentType.AXES_MANAGER = null;
	oFF.OlapComponentType.QUERY_SETTINGS = null;
	oFF.OlapComponentType.HIERARCHY = null;
	oFF.OlapComponentType.HIERARCHY_MANAGER = null;
	oFF.OlapComponentType.DIMENSION_MANAGER = null;
	oFF.OlapComponentType.DRILL_MANAGER = null;
	oFF.OlapComponentType.DRILL_OPERATION = null;
	oFF.OlapComponentType.SORT_MANAGER = null;
	oFF.OlapComponentType.VIZ_MANAGER = null;
	oFF.OlapComponentType.COMPONENT_LIST = null;
	oFF.OlapComponentType.AXIS = null;
	oFF.OlapComponentType.AXES_SETTINGS = null;
	oFF.OlapComponentType.FIELD_CONTAINER = null;
	oFF.OlapComponentType.FIELD_LIST = null;
	oFF.OlapComponentType.FIELD = null;
	oFF.OlapComponentType.PROPERTY = null;
	oFF.OlapComponentType.VARIABLE_CONTEXT = null;
	oFF.OlapComponentType.VARIABLE_CONTAINER = null;
	oFF.OlapComponentType.VARIABLE_LIST = null;
	oFF.OlapComponentType.FORMULA_CONSTANT = null;
	oFF.OlapComponentType.FORMULA_ITEM_MEMBER = null;
	oFF.OlapComponentType.FORMULA_ITEM_ATTRIBUTE = null;
	oFF.OlapComponentType.FORMULA_OPERATION = null;
	oFF.OlapComponentType.FORMULA_FUNCTION = null;
	oFF.OlapComponentType.PLANNING_COMMAND = null;
	oFF.OlapComponentType.GENERIC_SORTING = null;
	oFF.OlapComponentType.DIMENSION_SORTING = null;
	oFF.OlapComponentType.FIELD_SORTING = null;
	oFF.OlapComponentType.DATA_CELL_SORTING = null;
	oFF.OlapComponentType.COMPLEX_SORTING = null;
	oFF.OlapComponentType.MEASURE_SORTING = null;
	oFF.OlapComponentType.RESULT_STRUCTURE = null;
	oFF.OlapComponentType.VARIABLE_MANAGER = null;
	oFF.OlapComponentType.ABSTRACT_LAYER_MODEL = null;
	oFF.OlapComponentType.LAYER_MODEL = null;
	oFF.OlapComponentType.LAYER = null;
	oFF.OlapComponentType.LAYER_SYNC_DEFINITION = null;
	oFF.OlapComponentType.LAYER_REFERENCE_DEFINITION = null;
	oFF.OlapComponentType.FILTER_CAPABILITY = null;
	oFF.OlapComponentType.FILTER_CAPABILITY_GROUP = null;
	oFF.OlapComponentType.CONDITIONS = null;
	oFF.OlapComponentType.CONDITIONS_THRESHOLD = null;
	oFF.OlapComponentType.CONDITIONS_MANAGER = null;
	oFF.OlapComponentType.CONDITION = null;
	oFF.OlapComponentType.DATA_CELL = null;
	oFF.OlapComponentType.DATA_CELLS = null;
	oFF.OlapComponentType.TOTALS = null;
	oFF.OlapComponentType.MEMBERS = null;
	oFF.OlapComponentType.ABSTRACT_DIMENSION = null;
	oFF.OlapComponentType.ATTRIBUTE_LIST = null;
	oFF.OlapComponentType.CATALOG_SPACE = null;
	oFF.OlapComponentType.GROUP_BY_NODE = null;
	oFF.OlapComponentType.CATALOG_TYPE = null;
	oFF.OlapComponentType.CATALOG_SCHEMA = null;
	oFF.OlapComponentType.CATALOG_PACKAGE = null;
	oFF.OlapComponentType.CATALOG_OBJECT = null;
	oFF.OlapComponentType.RD_DATA_CELL = null;
	oFF.OlapComponentType.OLAP_METADATA_MODEL = null;
	oFF.OlapComponentType.UNIVERSAL_DISPLAY_HIERARCHY = null;
	oFF.OlapComponentType.UNIVERSAL_DISPLAY_HIERARCHIES = null;
	oFF.OlapComponentType.EXCEPTION_AGGREGATION_MANAGER = null;
	oFF.OlapComponentType.staticSetupOlapType = function() {
		oFF.OlapComponentType.OLAP_DATA_PROVIDER = oFF.OlapComponentType
				.createOlapType("OlapDataProvider",
						oFF.IoComponentType.DATA_PROVIDER);
		oFF.OlapComponentType.CHART_DATA_PROVIDER = oFF.OlapComponentType
				.createOlapType("ChartDataProvider",
						oFF.IoComponentType.DATA_PROVIDER);
		oFF.OlapComponentType.CONVENIENCE_CMDS = oFF.OlapComponentType
				.createOlapType("OlapCmds", oFF.XComponentType._ROOT);
		oFF.OlapComponentType.OLAP = oFF.OlapComponentType.createOlapType(
				"Olap", oFF.XComponentType._ROOT);
		oFF.OlapComponentType.OLAP_ENVIRONMENT = oFF.OlapComponentType
				.createOlapType("OlapEnvironment", oFF.OlapComponentType.OLAP);
		oFF.OlapComponentType.QUERY_MANAGER = oFF.OlapComponentType
				.createOlapType("QueryManager", oFF.OlapComponentType.OLAP);
		oFF.OlapComponentType.QUERY_CONTEXT = oFF.OlapComponentType
				.createOlapType("QueryContext", oFF.OlapComponentType.OLAP);
		oFF.OlapComponentType.COMPONENT_LIST = oFF.OlapComponentType
				.createOlapType("ComponentList",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.DATA_SOURCE = oFF.OlapComponentType
				.createOlapType("DataSource", oFF.OlapComponentType.OLAP);
		oFF.OlapComponentType.SELECTOR = oFF.OlapComponentType.createOlapType(
				"Selector", oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.FILTER_EXPRESSION = oFF.OlapComponentType
				.createOlapType("FilterExpression",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.FILTER_LITERAL = oFF.OlapComponentType
				.createOlapType("FilterLiteral",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.FILTER_FIXED = oFF.OlapComponentType
				.createOlapType("FilterFixed",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.FILTER_DYNAMIC = oFF.OlapComponentType
				.createOlapType("FilterDynamic",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.FILTER_VISIBILITY = oFF.OlapComponentType
				.createOlapType("FilterVisibility",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.FILTER_ELEMENT = oFF.OlapComponentType
				.createOlapType("FilterElement",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.QUERY_MODEL = oFF.OlapComponentType
				.createOlapType("QueryModel",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.QUERY_SETTINGS = oFF.OlapComponentType
				.createOlapType("QuerySettings",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.DIMENSION_MANAGER = oFF.OlapComponentType
				.createOlapType("DimensionManager",
						oFF.OlapComponentType.COMPONENT_LIST);
		oFF.OlapComponentType.DRILL_MANAGER = oFF.OlapComponentType
				.createOlapType("DrillManager",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.DRILL_OPERATION = oFF.OlapComponentType
				.createOlapType("DrillOperation",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.AXES_MANAGER = oFF.OlapComponentType
				.createOlapType("AxesManager",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.AXIS = oFF.OlapComponentType.createOlapType(
				"Axis", oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.AXES_SETTINGS = oFF.OlapComponentType
				.createOlapType("AxesSettings",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.ATTRIBUTE_CONTAINER = oFF.OlapComponentType
				.createOlapType("AttributeContainer",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.ATTRIBUTE = oFF.OlapComponentType.createOlapType(
				"Attribute", oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.PLANNING_COMMAND = oFF.OlapComponentType
				.createOlapType("PlanningCommand", oFF.OlapComponentType.OLAP);
		oFF.OlapComponentType.GENERIC_SORTING = oFF.OlapComponentType
				.createOlapType("GenericSorting",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.DIMENSION_SORTING = oFF.OlapComponentType
				.createOlapType("DimensionSorting",
						oFF.OlapComponentType.GENERIC_SORTING);
		oFF.OlapComponentType.FIELD_SORTING = oFF.OlapComponentType
				.createOlapType("FieldSorting",
						oFF.OlapComponentType.GENERIC_SORTING);
		oFF.OlapComponentType.DATA_CELL_SORTING = oFF.OlapComponentType
				.createOlapType("DataCellSorting",
						oFF.OlapComponentType.GENERIC_SORTING);
		oFF.OlapComponentType.COMPLEX_SORTING = oFF.OlapComponentType
				.createOlapType("ComplexSorting",
						oFF.OlapComponentType.GENERIC_SORTING);
		oFF.OlapComponentType.MEASURE_SORTING = oFF.OlapComponentType
				.createOlapType("MeasureSorting",
						oFF.OlapComponentType.GENERIC_SORTING);
		oFF.OlapComponentType.RESULT_STRUCTURE = oFF.OlapComponentType
				.createOlapType("ResultStructure",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.DIMENSION_CONTEXT = oFF.OlapComponentType
				.createOlapType("DimensionContext",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.DIMENSIONS = oFF.OlapComponentType
				.createOlapType("Dimensions",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.FIELD_CONTAINER = oFF.OlapComponentType
				.createOlapType("FieldContainer",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.FIELD_LIST = oFF.OlapComponentType
				.createOlapType("FieldList",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.FIELD = oFF.OlapComponentType.createOlapType(
				"Field", oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.VARIABLE_CONTEXT = oFF.OlapComponentType
				.createOlapType("VariableContext",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.PROPERTY = oFF.OlapComponentType.createOlapType(
				"Property", oFF.XComponentType._VALUE);
		oFF.OlapComponentType.FORMULA_CONSTANT = oFF.OlapComponentType
				.createOlapType("FormulaConstant", oFF.XComponentType._MODEL);
		oFF.OlapComponentType.FORMULA_ITEM_MEMBER = oFF.OlapComponentType
				.createOlapType("FormulaItemMember", oFF.XComponentType._MODEL);
		oFF.OlapComponentType.FORMULA_ITEM_ATTRIBUTE = oFF.OlapComponentType
				.createOlapType("FormulaItemAttribute",
						oFF.XComponentType._MODEL);
		oFF.OlapComponentType.FORMULA_OPERATION = oFF.OlapComponentType
				.createOlapType("FormulaOperation", oFF.XComponentType._MODEL);
		oFF.OlapComponentType.FORMULA_FUNCTION = oFF.OlapComponentType
				.createOlapType("FormulaFunction", oFF.XComponentType._MODEL);
		oFF.OlapComponentType.SORT_MANAGER = oFF.OlapComponentType
				.createOlapType("SortManager",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.VIZ_MANAGER = oFF.OlapComponentType
				.createOlapType("VizManager",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.VARIABLE_CONTAINER = oFF.OlapComponentType
				.createOlapType("VariableContainer",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.VARIABLE_LIST = oFF.OlapComponentType
				.createOlapType("VariableList",
						oFF.OlapComponentType.QUERY_CONTEXT);
		oFF.OlapComponentType.VARIABLE_MANAGER = oFF.OlapComponentType
				.createOlapType("VariableManager",
						oFF.OlapComponentType.VARIABLE_CONTAINER);
		oFF.OlapComponentType.ABSTRACT_LAYER_MODEL = oFF.OlapComponentType
				.createOlapType("AbstractLayerModel",
						oFF.OlapComponentType.OLAP);
		oFF.OlapComponentType.LAYER_MODEL = oFF.OlapComponentType
				.createOlapType("LayerModel",
						oFF.OlapComponentType.ABSTRACT_LAYER_MODEL);
		oFF.OlapComponentType.LAYER = oFF.OlapComponentType.createOlapType(
				"Layer", oFF.OlapComponentType.ABSTRACT_LAYER_MODEL);
		oFF.OlapComponentType.LAYER_SYNC_DEFINITION = oFF.OlapComponentType
				.createOlapType("LayerSyncDefinition",
						oFF.OlapComponentType.ABSTRACT_LAYER_MODEL);
		oFF.OlapComponentType.LAYER_REFERENCE_DEFINITION = oFF.OlapComponentType
				.createOlapType("LayerReferenceDefinition",
						oFF.OlapComponentType.ABSTRACT_LAYER_MODEL);
		oFF.OlapComponentType.FILTER_CAPABILITY = oFF.OlapComponentType
				.createOlapType("FilterCapability", oFF.XComponentType._MODEL);
		oFF.OlapComponentType.FILTER_CAPABILITY_GROUP = oFF.OlapComponentType
				.createOlapType("FilterCapabilityGroup",
						oFF.OlapComponentType.FILTER_CAPABILITY);
		oFF.OlapComponentType.CONDITIONS = oFF.OlapComponentType
				.createOlapType("Conditions", oFF.OlapComponentType.OLAP);
		oFF.OlapComponentType.CONDITIONS_MANAGER = oFF.OlapComponentType
				.createOlapType("ConditionManager",
						oFF.OlapComponentType.CONDITIONS);
		oFF.OlapComponentType.CONDITION = oFF.OlapComponentType.createOlapType(
				"Condition", oFF.OlapComponentType.OLAP);
		oFF.OlapComponentType.CONDITIONS_THRESHOLD = oFF.OlapComponentType
				.createOlapType("ConditionThreshold",
						oFF.OlapComponentType.OLAP);
		oFF.OlapComponentType.DATA_CELL = oFF.OlapComponentType.createOlapType(
				"DataCell", oFF.OlapComponentType.OLAP);
		oFF.OlapComponentType.DATA_CELLS = oFF.OlapComponentType
				.createOlapType("DataCells", oFF.OlapComponentType.OLAP);
		oFF.OlapComponentType.FILTER_CELL_VALUE_OPERAND = oFF.OlapComponentType
				.createOlapType("FilterCellValueOperand",
						oFF.OlapComponentType.OLAP);
		oFF.OlapComponentType.TOTALS = oFF.OlapComponentType.createOlapType(
				"Totals", oFF.OlapComponentType.OLAP);
		oFF.OlapComponentType.MEMBERS = oFF.OlapComponentType.createOlapType(
				"Members", oFF.OlapComponentType.OLAP);
		oFF.OlapComponentType.HIERARCHY = oFF.OlapComponentType.createOlapType(
				"Hierarchy", oFF.OlapComponentType.OLAP);
		oFF.OlapComponentType.HIERARCHY_MANAGER = oFF.OlapComponentType
				.createOlapType("HierarchyManager", oFF.OlapComponentType.OLAP);
		oFF.OlapComponentType.EXCEPTION_MANAGER = oFF.OlapComponentType
				.createOlapType("Exceptions", oFF.OlapComponentType.OLAP);
		oFF.OlapComponentType.ABSTRACT_DIMENSION = oFF.OlapComponentType
				.createOlapType("AbstractDimension", oFF.XComponentType._ROOT);
		oFF.OlapComponentType.ATTRIBUTE_LIST = oFF.OlapComponentType
				.createOlapType("AttributeList",
						oFF.OlapComponentType.COMPONENT_LIST);
		oFF.OlapComponentType.CATALOG_SPACE = oFF.OlapComponentType
				.createOlapType("CatalogSpace", oFF.XComponentType._ROOT);
		oFF.OlapComponentType.GROUP_BY_NODE = oFF.OlapComponentType
				.createOlapType("GroupByNode", oFF.XComponentType._ROOT);
		oFF.OlapComponentType.CATALOG_TYPE = oFF.OlapComponentType
				.createOlapType("CatalogType", oFF.XComponentType._ROOT);
		oFF.OlapComponentType.CATALOG_SCHEMA = oFF.OlapComponentType
				.createOlapType("CatalogSchema", oFF.XComponentType._ROOT);
		oFF.OlapComponentType.CATALOG_PACKAGE = oFF.OlapComponentType
				.createOlapType("CatalogPackage", oFF.XComponentType._ROOT);
		oFF.OlapComponentType.CATALOG_OBJECT = oFF.OlapComponentType
				.createOlapType("CatalogObject", oFF.XComponentType._ROOT);
		oFF.OlapComponentType.RD_DATA_CELL = oFF.OlapComponentType
				.createOlapType("RS_DATA_CELL", oFF.XComponentType._ROOT);
		oFF.OlapComponentType.OLAP_METADATA_MODEL = oFF.OlapComponentType
				.createOlapType("OlapMetadataModel", oFF.XComponentType._ROOT);
		oFF.OlapComponentType.UNIVERSAL_DISPLAY_HIERARCHY = oFF.OlapComponentType
				.createOlapType("UniversalDisplayHierarchy",
						oFF.XComponentType._ROOT);
		oFF.OlapComponentType.UNIVERSAL_DISPLAY_HIERARCHIES = oFF.OlapComponentType
				.createOlapType("UniversalDisplayHierarchies",
						oFF.XComponentType._ROOT);
		oFF.OlapComponentType.EXCEPTION_AGGREGATION_MANAGER = oFF.OlapComponentType
				.createOlapType("ExceptionAggregationManager",
						oFF.OlapComponentType.QUERY_CONTEXT);
	};
	oFF.OlapComponentType.createOlapType = function(constant, parent) {
		var mt = new oFF.OlapComponentType();
		mt.setupExt(constant, parent);
		return mt;
	};
	oFF.PresentationType = function() {
	};
	oFF.PresentationType.prototype = new oFF.XComponentType();
	oFF.PresentationType.UNDEFINED = null;
	oFF.PresentationType.SELF = null;
	oFF.PresentationType.DEFAULT_CONTENT = null;
	oFF.PresentationType.VALUE = null;
	oFF.PresentationType.ABSTRACT_KEY = null;
	oFF.PresentationType.ABSTRACT_TEXT = null;
	oFF.PresentationType.ACTIVE_KEY = null;
	oFF.PresentationType.ACTIVE_DISPLAY_KEY = null;
	oFF.PresentationType.ACTIVE_TEXT = null;
	oFF.PresentationType.KEY = null;
	oFF.PresentationType.ID = null;
	oFF.PresentationType.KEY_NOT_COMPOUND = null;
	oFF.PresentationType.DISPLAY_KEY = null;
	oFF.PresentationType.DISPLAY_KEY_MIXED_COMPOUNDMENT = null;
	oFF.PresentationType.DISPLAY_KEY_NOT_COMPOUND = null;
	oFF.PresentationType.SHORT_TEXT = null;
	oFF.PresentationType.MEDIUM_TEXT = null;
	oFF.PresentationType.LONG_TEXT = null;
	oFF.PresentationType.XL_LONG_TEXT = null;
	oFF.PresentationType.TEXT = null;
	oFF.PresentationType.DOCUMENT_LINK = null;
	oFF.PresentationType.BUSINESS_OBJECT_NODE_IDENTIFIER = null;
	oFF.PresentationType.WHY_FOUND = null;
	oFF.PresentationType.RELATED_ACTIONS = null;
	oFF.PresentationType.HIERARCHY_KEY = null;
	oFF.PresentationType.HIERARCHY_TEXT = null;
	oFF.PresentationType.HIERARCHY_DISPLAY_KEY = null;
	oFF.PresentationType.URL = null;
	oFF.PresentationType.BLOB = null;
	oFF.PresentationType.staticSetupPresentation = function() {
		oFF.PresentationType.SELF = oFF.PresentationType.createPresentation(
				"SELF", null, 0);
		oFF.PresentationType.UNDEFINED = oFF.PresentationType
				.createPresentation("UNDEFINED", null, 1000);
		oFF.PresentationType.DEFAULT_CONTENT = oFF.PresentationType
				.createPresentation("DEFAULT_CONTENT", null, 1005);
		oFF.PresentationType.VALUE = oFF.PresentationType.createPresentation(
				"VALUE", null, 1010);
		oFF.PresentationType.ID = oFF.PresentationType.createPresentation("ID",
				null, 5);
		oFF.PresentationType.ABSTRACT_KEY = oFF.PresentationType
				.createPresentation("ABSTRACT_KEY", null, 0);
		oFF.PresentationType.ABSTRACT_TEXT = oFF.PresentationType
				.createPresentation("ABSTRACT_TEXT", null, 0);
		oFF.PresentationType.ACTIVE_KEY = oFF.PresentationType
				.createPresentation("ACTIVE_KEY",
						oFF.PresentationType.ABSTRACT_KEY, 0);
		oFF.PresentationType.ACTIVE_DISPLAY_KEY = oFF.PresentationType
				.createPresentation("ACTIVE_DISPLAY_KEY",
						oFF.PresentationType.ABSTRACT_KEY, 0);
		oFF.PresentationType.ACTIVE_TEXT = oFF.PresentationType
				.createPresentation("ACTIVE_TEXT",
						oFF.PresentationType.ABSTRACT_TEXT, 0);
		oFF.PresentationType.KEY = oFF.PresentationType.createPresentation(
				"KEY", oFF.PresentationType.ABSTRACT_KEY, 10);
		oFF.PresentationType.KEY_NOT_COMPOUND = oFF.PresentationType
				.createPresentation("KEY_NOT_COMPOUND",
						oFF.PresentationType.ABSTRACT_KEY, 15);
		oFF.PresentationType.DISPLAY_KEY = oFF.PresentationType
				.createPresentation("DISPLAY_KEY",
						oFF.PresentationType.ABSTRACT_KEY, 20);
		oFF.PresentationType.DISPLAY_KEY_MIXED_COMPOUNDMENT = oFF.PresentationType
				.createPresentation("DISPLAY_KEY_MIXED_COMPOUNDMENT",
						oFF.PresentationType.DISPLAY_KEY, 25);
		oFF.PresentationType.DISPLAY_KEY_NOT_COMPOUND = oFF.PresentationType
				.createPresentation("DISPLAY_KEY_NC",
						oFF.PresentationType.DISPLAY_KEY, 30);
		oFF.PresentationType.TEXT = oFF.PresentationType.createPresentation(
				"TEXT", oFF.PresentationType.ABSTRACT_TEXT, 35);
		oFF.PresentationType.SHORT_TEXT = oFF.PresentationType
				.createPresentation("SHORT_TEXT", oFF.PresentationType.TEXT, 40);
		oFF.PresentationType.MEDIUM_TEXT = oFF.PresentationType
				.createPresentation("MIDDLE_TEXT", oFF.PresentationType.TEXT,
						45);
		oFF.PresentationType.LONG_TEXT = oFF.PresentationType
				.createPresentation("LONG_TEXT", oFF.PresentationType.TEXT, 50);
		oFF.PresentationType.XL_LONG_TEXT = oFF.PresentationType
				.createPresentation("XL_LONG_TEXT", oFF.PresentationType.TEXT,
						55);
		oFF.PresentationType.HIERARCHY_KEY = oFF.PresentationType
				.createPresentation("HIERARCHY_KEY",
						oFF.PresentationType.ABSTRACT_KEY, 60);
		oFF.PresentationType.HIERARCHY_DISPLAY_KEY = oFF.PresentationType
				.createPresentation("HIERARCHY_DISPLAY_KEY",
						oFF.PresentationType.ABSTRACT_KEY, 65);
		oFF.PresentationType.HIERARCHY_TEXT = oFF.PresentationType
				.createPresentation("HIERARCHY_TEXT",
						oFF.PresentationType.ABSTRACT_TEXT, 70);
		oFF.PresentationType.DOCUMENT_LINK = oFF.PresentationType
				.createPresentation("DOCUMENT_LINK", null, 80);
		oFF.PresentationType.BUSINESS_OBJECT_NODE_IDENTIFIER = oFF.PresentationType
				.createPresentation("BUSINESS_OBJECT_NODE_IDENTIFIER", null, 75);
		oFF.PresentationType.WHY_FOUND = oFF.PresentationType
				.createPresentation("WHY_FOUND", null, 1030);
		oFF.PresentationType.RELATED_ACTIONS = oFF.PresentationType
				.createPresentation("RELATED_ACTIONS", null, 1040);
		oFF.PresentationType.URL = oFF.PresentationType.createPresentation(
				"URL", null, 1041);
		oFF.PresentationType.BLOB = oFF.PresentationType.createPresentation(
				"XXL", null, 1042);
	};
	oFF.PresentationType.createPresentation = function(name, parent, priority) {
		var type = new oFF.PresentationType();
		type.setupExt(name, parent);
		type.setPriority(priority);
		return type;
	};
	oFF.PresentationType.isTextPresentation = function(presentationType) {
		if (oFF.isNull(presentationType)) {
			return false;
		}
		return presentationType.isTypeOf(oFF.PresentationType.TEXT)
				|| presentationType === oFF.PresentationType.HIERARCHY_TEXT;
	};
	oFF.PresentationType.isKeyPresentation = function(presentationType) {
		if (oFF.isNull(presentationType)) {
			return false;
		}
		return presentationType.isTypeOf(oFF.PresentationType.ABSTRACT_KEY)
				|| presentationType === oFF.PresentationType.HIERARCHY_KEY
				|| presentationType === oFF.PresentationType.HIERARCHY_DISPLAY_KEY;
	};
	oFF.PresentationType.prototype.m_priority = 0;
	oFF.PresentationType.prototype.setPriority = function(prioriry) {
		this.m_priority = prioriry;
	};
	oFF.PresentationType.prototype.getPriority = function() {
		return this.m_priority;
	};
	oFF.VariableVariantType = function() {
	};
	oFF.VariableVariantType.prototype = new oFF.XComponentType();
	oFF.VariableVariantType.AO_VARIABLE_DEFAULTS = null;
	oFF.VariableVariantType.s_allVariants = null;
	oFF.VariableVariantType.staticSetup = function() {
		oFF.VariableVariantType.s_allVariants = oFF.XHashMapByString.create();
		oFF.VariableVariantType.AO_VARIABLE_DEFAULTS = oFF.VariableVariantType
				.create("analysisOfficeVariableDefaults");
	};
	oFF.VariableVariantType.create = function(name) {
		var newVariant = oFF.XConstant.setupName(new oFF.VariableVariantType(),
				name);
		oFF.VariableVariantType.s_allVariants.put(name, newVariant);
		return newVariant;
	};
	oFF.VariableVariantType.lookupByName = function(name) {
		return oFF.VariableVariantType.s_allVariants.getByKey(name);
	};
	oFF.QueryResourceLoadAction2 = function() {
	};
	oFF.QueryResourceLoadAction2.prototype = new oFF.DfQueryResourceLoadAction();
	oFF.QueryResourceLoadAction2.createAndRun = function(syncType,
			queryServiceConfig, customIdentifier) {
		var object = new oFF.QueryResourceLoadAction2();
		object.setupActionAndRun(syncType, queryServiceConfig, null,
				customIdentifier);
		return object;
	};
	oFF.QueryResourceLoadAction2.prototype.processSynchronization = function(
			syncType) {
		var dataSource = this.getDataSource();
		var type = dataSource.getType();
		var location;
		var extension;
		var modelFormat;
		var application;
		var repositoryManager;
		var repositoryLocation;
		var uri;
		var systemUriString;
		var systemUri;
		var systemLandscape;
		var tempSystemName;
		var connection;
		var rpcFunction;
		var request;
		if (type === oFF.MetaObjectType.URL) {
			location = dataSource.getObjectName();
			if (this.hasFileExtension(location)) {
				extension = oFF.QueryResourceLoadAction
						.getFileExtension(location);
				modelFormat = oFF.QModelFormat.lookupByExtension(extension);
				if (oFF.isNull(modelFormat)) {
					this
							.addError(
									oFF.ErrorCodes.SYSTEM_IO_READ_ACCESS,
									oFF.XStringUtils
											.concatenate2(
													"No valid extension to resolve model format: ",
													location));
				} else {
					application = this.getActionContext().getApplication();
					repositoryManager = application.getRepositoryManager();
					repositoryLocation = repositoryManager.getLocation();
					if (oFF.isNull(repositoryLocation)) {
						uri = oFF.XUri.createFromUri(location);
					} else {
						uri = oFF.XUri.createFromUriWithParent(location,
								repositoryLocation, false);
					}
					systemUriString = uri.getUriStringExt(true, true, true,
							true, true, false, false, false);
					systemUri = oFF.XUri.createFromUri(systemUriString);
					systemLandscape = application.getSystemLandscape();
					tempSystemName = oFF.XStringUtils.concatenate3("##Tmp#",
							oFF.XGuid.getGuid(), "##");
					systemLandscape.setSystemByUri(tempSystemName, systemUri,
							oFF.SystemType.GENERIC);
					connection = application.getConnection(tempSystemName);
					rpcFunction = connection.newRpcFunction(uri
							.getUriStringExt(false, false, false, false, false,
									true, true, true));
					request = rpcFunction.getRequest();
					request.setMethod(oFF.HttpRequestMethod.HTTP_GET);
					rpcFunction.processFunctionExecution(syncType, this,
							modelFormat);
					return false;
				}
			}
		}
		return true;
	};
	oFF.QueryResourceLoadAction3 = function() {
	};
	oFF.QueryResourceLoadAction3.prototype = new oFF.DfQueryResourceLoadAction();
	oFF.QueryResourceLoadAction3.createAndRun = function(syncType,
			queryServiceConfig, customIdentifier) {
		var object = new oFF.QueryResourceLoadAction3();
		object.setupActionAndRun(syncType, queryServiceConfig, null,
				customIdentifier);
		return object;
	};
	oFF.QueryResourceLoadAction3.prototype.processSynchronization = function(
			syncType) {
		var dataSource = this.getDataSource();
		var type = dataSource.getType();
		var location;
		var extension;
		var path;
		var modelFormat;
		var application;
		var repositoryManager;
		var rpcFunction;
		if (type === oFF.MetaObjectType.URL) {
			location = dataSource.getObjectName();
			if (this.hasFileExtension(location)) {
				extension = oFF.QueryResourceLoadAction
						.getFileExtension(location);
				if (oFF.XString.isEqual("gz", extension)) {
					path = oFF.XStringUtils.stripRight(location, 3);
					if (this.hasFileExtension(path)) {
						extension = oFF.QueryResourceLoadAction
								.getFileExtension(path);
					}
				}
				modelFormat = oFF.QModelFormat.lookupByExtension(extension);
				if (oFF.isNull(modelFormat)) {
					this
							.addError(
									oFF.ErrorCodes.SYSTEM_IO_READ_ACCESS,
									oFF.XStringUtils
											.concatenate2(
													"No valid extension to resolve model format: ",
													location));
				} else {
					application = this.getActionContext().getApplication();
					repositoryManager = application.getRepositoryManager();
					rpcFunction = repositoryManager.newRpcFunction(location);
					rpcFunction.processFunctionExecution(syncType, this,
							modelFormat);
					return false;
				}
			}
		}
		return true;
	};
	oFF.QueryServiceConfig = function() {
	};
	oFF.QueryServiceConfig.prototype = new oFF.DfServiceConfig();
	oFF.QueryServiceConfig.CLAZZ = null;
	oFF.QueryServiceConfig.staticSetup = function() {
		oFF.QueryServiceConfig.CLAZZ = oFF.XClass
				.create(oFF.QueryServiceConfig);
	};
	oFF.QueryServiceConfig.create = function(application) {
		var object = new oFF.QueryServiceConfig();
		object.setupConfig(application);
		return object;
	};
	oFF.QueryServiceConfig.createWithDataSourceName = function(application,
			systemName, datasource) {
		var object = new oFF.QueryServiceConfig();
		object.setupWithSystemName(application, systemName);
		object.setDataSourceByName(datasource);
		return object;
	};
	oFF.QueryServiceConfig.createWithDataSource = function(application,
			systemName, datasource) {
		var object = new oFF.QueryServiceConfig();
		object.setupWithSystemName(application, systemName);
		object.setDataSource(datasource);
		return object;
	};
	oFF.QueryServiceConfig.createWithDataRequest = function(application,
			systemName, dataRequest) {
		var object = new oFF.QueryServiceConfig();
		object.setupWithSystemName(application, systemName);
		object.setDataRequest(dataRequest);
		object.setMode(oFF.QueryManagerMode.RAW_QUERY);
		return object;
	};
	oFF.QueryServiceConfig.createWithDataRequestString = function(application,
			systemName, dataRequestString) {
		var object = new oFF.QueryServiceConfig();
		object.setupWithSystemName(application, systemName);
		object.setDataRequestAsString(dataRequestString);
		object.setMode(oFF.QueryManagerMode.RAW_QUERY);
		return object;
	};
	oFF.QueryServiceConfig.createWithBlendingDefinition = function(application,
			blendingDefinition) {
		var blendingHost = blendingDefinition.getBlendingHost();
		var object;
		oFF.XObjectExt.checkNotNull(blendingHost,
				"No suitable blending host found!");
		oFF.XBooleanUtils.checkTrue(blendingHost.supportsCubeBlending(),
				"The backend is not capable of blending!");
		oFF.BlendingValidation
				.assertBlendingDefinitionIsValid(blendingDefinition);
		object = new oFF.QueryServiceConfig();
		object.setupWithSystemName(application, blendingHost.getSystemName());
		object.setBlendingDefinition(blendingDefinition);
		return object;
	};
	oFF.QueryServiceConfig.createWithMicroCube = function(application,
			systemName, microCube) {
		var queryServiceConfig = new oFF.QueryServiceConfig();
		queryServiceConfig.setupWithSystemName(application, systemName);
		queryServiceConfig.setDataSourceBasedOnMicroCube(microCube);
		return queryServiceConfig;
	};
	oFF.QueryServiceConfig.prototype.m_providerType = null;
	oFF.QueryServiceConfig.prototype.m_openForEdit = false;
	oFF.QueryServiceConfig.prototype.m_datasource = null;
	oFF.QueryServiceConfig.prototype.m_instanceId = null;
	oFF.QueryServiceConfig.prototype.m_definitionType = null;
	oFF.QueryServiceConfig.prototype.m_definitionContentJson = null;
	oFF.QueryServiceConfig.prototype.m_definitionContentStructure = null;
	oFF.QueryServiceConfig.prototype.m_serverCustomization = null;
	oFF.QueryServiceConfig.prototype.m_mode = null;
	oFF.QueryServiceConfig.prototype.m_blendingDefinition = null;
	oFF.QueryServiceConfig.prototype.m_experimentalFeatues = null;
	oFF.QueryServiceConfig.prototype.m_isLoadingDefaultQuery = false;
	oFF.QueryServiceConfig.prototype.m_request = null;
	oFF.QueryServiceConfig.prototype.m_stateChangedListener = null;
	oFF.QueryServiceConfig.prototype.m_makeEmptyVariableDefinitionInsteadOfMetadata = false;
	oFF.QueryServiceConfig.prototype.m_canUseCache = false;
	oFF.QueryServiceConfig.prototype.m_minimizedMetadata = false;
	oFF.QueryServiceConfig.prototype.m_requiredDimensions = null;
	oFF.QueryServiceConfig.prototype.m_dimensionsOnAxes = null;
	oFF.QueryServiceConfig.prototype.setCanUseCache = function(canUseCache) {
		this.m_canUseCache = canUseCache;
	};
	oFF.QueryServiceConfig.prototype.canUseCache = function() {
		return this.m_canUseCache;
	};
	oFF.QueryServiceConfig.prototype.setupWithSystemName = function(
			application, systemName) {
		this.setupConfig(application);
		this.setSystemName(systemName);
	};
	oFF.QueryServiceConfig.prototype.setDataSourceBasedOnMicroCube = function(
			microCube) {
		var dataSource = oFF.QFactory.newDataSource();
		dataSource.setType(oFF.MetaObjectType.QUERY);
		dataSource.setName(microCube.getNameForMicroCubeUse());
		dataSource.setMicroCube(microCube);
		this.m_datasource = dataSource;
		return dataSource;
	};
	oFF.QueryServiceConfig.prototype.getQueryManagerBasedOnMicroCube = function() {
		var dataSource = this.getDataSourceBase();
		var originalQueryManager;
		if (!dataSource.isBasedOnMicroCube()) {
			return null;
		}
		originalQueryManager = dataSource.getMicroCube().getQueryManager();
		return originalQueryManager.cloneQueryManagerUsingExtDataSource(
				oFF.QueryCloneMode.MICRO_CUBE, dataSource);
	};
	oFF.QueryServiceConfig.prototype.cloneUsingExtDataSource = function(
			dataSource) {
		var serviceConfigClone = this.clone();
		serviceConfigClone.setDataSource(dataSource);
		return serviceConfigClone;
	};
	oFF.QueryServiceConfig.prototype.setupConfig = function(application) {
		oFF.DfServiceConfig.prototype.setupConfig.call(this, application);
		this.m_openForEdit = false;
		this.m_serverCustomization = oFF.XHashSetOfString.create();
		this.m_providerType = oFF.ProviderType.ANALYTICS;
		this.m_mode = oFF.QueryManagerMode.DEFAULT;
		this.setInstanceId(application.createNextInstanceId());
		this.m_isLoadingDefaultQuery = true;
		this.m_stateChangedListener = oFF.XSimpleMap.create();
	};
	oFF.QueryServiceConfig.prototype.getComponentType = function() {
		return this.getOlapComponentType();
	};
	oFF.QueryServiceConfig.prototype.getOlapComponentType = function() {
		return oFF.OlapComponentType.OLAP_DATA_PROVIDER;
	};
	oFF.QueryServiceConfig.prototype.clone = function() {
		var cloneObject = oFF.QueryServiceConfig.create(this.getApplication());
		var myTagging;
		var cloneTagging;
		var iterator;
		var key;
		var value;
		if (oFF.notNull(this.m_datasource)) {
			cloneObject.setDataSource(this.m_datasource.cloneOlapComponent(
					null, null));
		}
		cloneObject.setProviderType(this.m_providerType);
		cloneObject.setIsOpenForEdit(this.m_openForEdit);
		myTagging = this.getTagging();
		cloneTagging = cloneObject.getTagging();
		iterator = myTagging.getKeysAsIteratorOfString();
		while (iterator.hasNext()) {
			key = iterator.next();
			value = myTagging.getByKey(key);
			cloneTagging.put(key, value);
		}
		cloneObject.activateExperimentalFeatureSet(this
				.getExperimentalFeatureSet());
		cloneObject.setMode(this.getMode());
		cloneObject.setMakeEmptyVariableDefinitionInsteadOfMetadata(this
				.getMakeEmptyVariableDefinitionInsteadOfMetadata());
		cloneObject.setCanUseCache(this.canUseCache());
		return cloneObject;
	};
	oFF.QueryServiceConfig.prototype.releaseObject = function() {
		this.m_serverCustomization = oFF.XObjectExt
				.release(this.m_serverCustomization);
		this.m_providerType = null;
		this.m_mode = null;
		this.m_blendingDefinition = null;
		this.m_definitionContentStructure = null;
		this.m_definitionType = null;
		this.m_datasource = null;
		this.m_experimentalFeatues = oFF.XObjectExt
				.release(this.m_experimentalFeatues);
		this.m_dimensionsOnAxes = oFF.XObjectExt
				.release(this.m_dimensionsOnAxes);
		this.m_requiredDimensions = oFF.XObjectExt
				.release(this.m_requiredDimensions);
		oFF.DfServiceConfig.prototype.releaseObject.call(this);
	};
	oFF.QueryServiceConfig.prototype.getServiceTypeInfo = function() {
		return oFF.OlapApiModule.SERVICE_TYPE_QUERY_CONSUMER;
	};
	oFF.QueryServiceConfig.prototype.processQueryManagerCreation = function(
			syncType, listener, customIdentifier) {
		var sequence;
		var loadAction;
		var mainAction;
		if (syncType === oFF.SyncType.REGISTER) {
			this.attachListener(listener, oFF.ListenerType.SPECIFIC,
					customIdentifier);
			return null;
		}
		if (syncType === oFF.SyncType.UNREGISTER) {
			this.detachListener(listener);
			return null;
		}
		if (oFF.notNull(this.m_datasource)
				&& this.m_datasource.getType() === oFF.MetaObjectType.URL) {
			sequence = oFF.SyncActionSequence.create(this);
			loadAction = oFF.QueryResourceLoadAction3.createAndRun(
					oFF.SyncType.DELAYED, this, null);
			sequence.addAction(loadAction);
			mainAction = this.processSyncAction(oFF.SyncType.DELAYED, null,
					null);
			sequence.setMainAction(mainAction);
			return sequence.processSyncAction(syncType, listener,
					customIdentifier);
		}
		return this.processSyncAction(syncType, listener, customIdentifier);
	};
	oFF.QueryServiceConfig.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		listener.onQueryManagerCreated(extResult, data, customIdentifier);
	};
	oFF.QueryServiceConfig.prototype.setDataFromService = function(service) {
		this.setData(service);
	};
	oFF.QueryServiceConfig.prototype.setProviderType = function(type) {
		this.m_providerType = type;
	};
	oFF.QueryServiceConfig.prototype.getProviderType = function() {
		return this.m_providerType;
	};
	oFF.QueryServiceConfig.prototype.getDataSource = function() {
		return this.m_datasource;
	};
	oFF.QueryServiceConfig.prototype.getDataSourceBase = function() {
		return this.m_datasource;
	};
	oFF.QueryServiceConfig.prototype.setDataSource = function(datasource) {
		this.m_datasource = datasource;
	};
	oFF.QueryServiceConfig.prototype.setDataSourceByName = function(name) {
		var identifierBase = oFF.QFactory.newDataSourceExt(this);
		identifierBase.setFullQualifiedName(name);
		this.m_datasource = identifierBase;
		return identifierBase;
	};
	oFF.QueryServiceConfig.prototype.isOpenForEdit = function() {
		return this.m_openForEdit;
	};
	oFF.QueryServiceConfig.prototype.setIsOpenForEdit = function(openForEdit) {
		this.m_openForEdit = openForEdit;
	};
	oFF.QueryServiceConfig.prototype.setDefinitionByJson = function(type,
			definitionContent) {
		this.m_definitionType = type;
		this.m_definitionContentJson = definitionContent;
		this.m_definitionContentStructure = null;
	};
	oFF.QueryServiceConfig.prototype.setDefinitionByStructure = function(type,
			definitionContent) {
		this.m_definitionType = type;
		this.m_definitionContentStructure = definitionContent;
		this.m_definitionContentJson = null;
	};
	oFF.QueryServiceConfig.prototype.getDefinitionType = function() {
		return this.m_definitionType;
	};
	oFF.QueryServiceConfig.prototype.getDefinitionAsJson = function() {
		return this.m_definitionContentJson;
	};
	oFF.QueryServiceConfig.prototype.getDefinitionAsStructure = function() {
		var definition = this.getDefinition();
		return oFF.isNull(definition) || !definition.isStructure() ? null
				: this.m_definitionContentStructure.asStructure();
	};
	oFF.QueryServiceConfig.prototype.getDefinition = function() {
		var parser;
		var rootElement;
		if (oFF.isNull(this.m_definitionContentStructure)) {
			if (oFF.notNull(this.m_definitionContentJson)) {
				parser = oFF.JsonParserFactory.newInstance();
				rootElement = parser.parse(this.m_definitionContentJson);
				oFF.XObjectExt.release(parser);
				if (oFF.notNull(rootElement)) {
					this.m_definitionContentStructure = rootElement;
				}
			}
		}
		return this.m_definitionContentStructure;
	};
	oFF.QueryServiceConfig.prototype.getServerCustomizations = function() {
		return this.m_serverCustomization;
	};
	oFF.QueryServiceConfig.prototype.addServerCustomizations = function(name) {
		this.m_serverCustomization.add(name);
	};
	oFF.QueryServiceConfig.prototype.setInstanceId = function(instanceId) {
		this.m_instanceId = instanceId;
	};
	oFF.QueryServiceConfig.prototype.getInstanceId = function() {
		return this.m_instanceId;
	};
	oFF.QueryServiceConfig.prototype.setMode = function(mode) {
		if (oFF.notNull(mode)) {
			this.m_mode = mode;
		}
	};
	oFF.QueryServiceConfig.prototype.getMode = function() {
		return this.m_mode;
	};
	oFF.QueryServiceConfig.prototype.setBlendingDefinition = function(
			blendingDefinition) {
		this.m_blendingDefinition = blendingDefinition;
		this.setMode(oFF.QueryManagerMode.BLENDING);
	};
	oFF.QueryServiceConfig.prototype.getBlendingDefinition = function() {
		return this.m_blendingDefinition;
	};
	oFF.QueryServiceConfig.prototype.prepareDefinition = function() {
		var parser;
		var element;
		var preparator;
		if (oFF.notNull(this.m_definitionType)) {
			if (oFF.isNull(this.m_definitionContentStructure)
					&& oFF.notNull(this.m_definitionContentJson)) {
				parser = oFF.JsonParserFactory.newInstance();
				element = parser.parse(this.m_definitionContentJson);
				this.copyAllMessages(parser);
				if (parser.isValid() && element.isStructure()) {
					this.m_definitionContentStructure = element;
				}
				oFF.XObjectExt.release(parser);
			}
			if (oFF.notNull(this.m_definitionContentStructure)) {
				preparator = oFF.QueryPreparatorFactory
						.newInstance(this.m_definitionType);
				if (oFF.notNull(preparator)) {
					preparator.prepareBeforeMetadata(this,
							this.m_definitionContentStructure);
				}
			}
		}
	};
	oFF.QueryServiceConfig.prototype.getFieldAccessorSingle = function() {
		return null;
	};
	oFF.QueryServiceConfig.prototype.getQueryModel = function() {
		return null;
	};
	oFF.QueryServiceConfig.prototype.getModelCapabilities = function() {
		return null;
	};
	oFF.QueryServiceConfig.prototype.getVariableContainer = function() {
		return null;
	};
	oFF.QueryServiceConfig.prototype.getDimensionAccessor = function() {
		return null;
	};
	oFF.QueryServiceConfig.prototype.getDrillManager = function() {
		return null;
	};
	oFF.QueryServiceConfig.prototype.setLoadDefaultQuery = function(
			isLoadingDefaultQuery) {
		this.m_isLoadingDefaultQuery = isLoadingDefaultQuery;
	};
	oFF.QueryServiceConfig.prototype.isLoadingDefaultQuery = function() {
		return this.m_isLoadingDefaultQuery;
	};
	oFF.QueryServiceConfig.prototype.activateExperimentalFeature = function(
			experimentalFeature) {
		oFF.InactiveCapabilityUtil.assertVersionValid(experimentalFeature, this
				.getApplication().getVersion());
		if (oFF.isNull(this.m_experimentalFeatues)) {
			this.m_experimentalFeatues = oFF.XSetOfNameObject.create();
		}
		this.m_experimentalFeatues.add(experimentalFeature);
	};
	oFF.QueryServiceConfig.prototype.activateExperimentalFeatureSet = function(
			experimentalFeatures) {
		var iterator;
		if (oFF.notNull(experimentalFeatures)) {
			iterator = experimentalFeatures.getIterator();
			while (iterator.hasNext()) {
				this.activateExperimentalFeature(iterator.next());
			}
		}
	};
	oFF.QueryServiceConfig.prototype.getExperimentalFeatureSet = function() {
		return this.m_experimentalFeatues;
	};
	oFF.QueryServiceConfig.prototype.getExperimentalFeatures = function() {
		return oFF.InactiveCapabilityUtil
				.exportInactiveCapabilities(this.m_experimentalFeatues);
	};
	oFF.QueryServiceConfig.prototype.setDataRequest = function(request) {
		this.m_request = request;
	};
	oFF.QueryServiceConfig.prototype.setDataRequestAsString = function(request) {
		var element = oFF.JsonParserFactory.createFromSafeString(request);
		if (oFF.notNull(element) && element.isStructure()) {
			this.m_request = oFF.PrUtils.deepCopyElement(element);
		}
	};
	oFF.QueryServiceConfig.prototype.getDataRequest = function() {
		return this.m_request;
	};
	oFF.QueryServiceConfig.prototype.getDataRequestAsString = function() {
		return oFF.isNull(this.m_request) ? null : this.m_request.toString();
	};
	oFF.QueryServiceConfig.prototype.getQueryManager = function() {
		return this.getData();
	};
	oFF.QueryServiceConfig.prototype.registerChangedListener = function(
			listener, customIdentifier) {
		this.m_stateChangedListener.put(listener, oFF.XPair.create(listener,
				customIdentifier));
		return null;
	};
	oFF.QueryServiceConfig.prototype.unregisterChangedListener = function(
			listener) {
		this.m_stateChangedListener.remove(listener);
		return null;
	};
	oFF.QueryServiceConfig.prototype.beforeListenerCall = function() {
		var values = this.m_stateChangedListener.getValuesAsReadOnlyList();
		var valuesSize = values.size();
		var i;
		var pair;
		for (i = 0; i < valuesSize; i++) {
			pair = values.get(i);
			this.attachListener(pair.getFirstObject(),
					oFF.ListenerType.OLAP_COMPONENT_CHANGED, pair
							.getSecondObject());
		}
	};
	oFF.QueryServiceConfig.prototype.callTypedListener = function(extResult,
			type, listener, data, customIdentifier) {
		if (type === oFF.ListenerType.OLAP_COMPONENT_CHANGED) {
			listener.onModelComponentChanged(this, customIdentifier);
		} else {
			oFF.DfServiceConfig.prototype.callTypedListener.call(this,
					extResult, type, listener, data, customIdentifier);
		}
	};
	oFF.QueryServiceConfig.prototype.getOlapEnv = function() {
		return this.getApplication().getOlapEnvironment();
	};
	oFF.QueryServiceConfig.prototype.cloneOlapComponent = oFF.noSupport;
	oFF.QueryServiceConfig.prototype.queueEventing = function() {
	};
	oFF.QueryServiceConfig.prototype.stopEventing = function() {
	};
	oFF.QueryServiceConfig.prototype.isEventingStopped = function() {
		return false;
	};
	oFF.QueryServiceConfig.prototype.resumeEventing = function() {
	};
	oFF.QueryServiceConfig.prototype.refreshMetadata = function(syncType,
			listener, customIdentifier) {
		var queryManager = this.getData();
		var queryModel = queryManager.getQueryModel();
		var datasource = null;
		if (oFF.notNull(queryModel)) {
			datasource = queryModel.getDataSource();
		}
		if (oFF.isNull(this.m_datasource) && oFF.notNull(datasource)) {
			this.setDataSourceByName(datasource.getFullQualifiedName());
		}
		this.m_definitionContentStructure = null;
		if (oFF.notNull(datasource)) {
			this.getDataSourceBase().setValidationHash(
					datasource.getValidationHash());
		}
		queryManager.setIsMetadataCached(false);
		queryManager.setDeserializationStructureAsNull();
		return queryManager.processReInitialization(syncType, listener,
				customIdentifier);
	};
	oFF.QueryServiceConfig.prototype.checkModelVersionValidity = function(
			syncType, listener, customIdentifier) {
		var queryManager = this.getData();
		var serviceTypeInfo;
		var serviceReferenceName;
		var systemDescription;
		var application;
		var connectionPool;
		var allOpenConnections;
		if (oFF.isNull(queryManager)) {
			serviceTypeInfo = this.getServiceTypeInfo();
			serviceReferenceName = null;
			if (oFF.notNull(serviceTypeInfo)) {
				serviceReferenceName = serviceTypeInfo
						.getServiceReferenceName();
			}
			systemDescription = this.getSystemDescription();
			if (oFF.isNull(systemDescription)) {
				this.addError(0, oFF.XStringUtils.concatenate2(
						"Cannot find system description: ", this
								.getSystemName()));
				return null;
			}
			application = systemDescription.getApplication();
			if (oFF.isNull(application)) {
				return null;
			}
			connectionPool = application.getConnectionPool();
			if (oFF.isNull(connectionPool)) {
				return null;
			}
			allOpenConnections = connectionPool
					.getOpenConnections(systemDescription.getSystemName());
			if (allOpenConnections.hasElements()) {
				this.setConnectionContainer(allOpenConnections.get(0));
			} else {
				this.setConnectionContainer(connectionPool
						.getConnection(systemDescription.getSystemName()));
			}
			queryManager = this
					.getMatchingServiceForServiceName(serviceReferenceName);
			queryManager.setIsMetadataCached(false);
			queryManager.setDeserializationStructureAsNull();
			this.setDataFromService(queryManager);
			return queryManager.processReInitializationForNewQueryManager(
					syncType, listener, customIdentifier);
		}
		queryManager.setIsMetadataCached(false);
		queryManager.setDeserializationStructureAsNull();
		return queryManager.processReInitialization(syncType, listener,
				customIdentifier);
	};
	oFF.QueryServiceConfig.prototype.linkToQueryManager = function(queryManager) {
		this.setDataFromService(queryManager);
	};
	oFF.QueryServiceConfig.prototype.setMakeEmptyVariableDefinitionInsteadOfMetadata = function(
			makeEmptyVariableDefinitionInsteadOfMetadata) {
		this.m_makeEmptyVariableDefinitionInsteadOfMetadata = makeEmptyVariableDefinitionInsteadOfMetadata;
	};
	oFF.QueryServiceConfig.prototype.getMakeEmptyVariableDefinitionInsteadOfMetadata = function() {
		return this.m_makeEmptyVariableDefinitionInsteadOfMetadata;
	};
	oFF.QueryServiceConfig.prototype.setMinimizedMetadata = function(
			minimizedMetadata) {
		this.m_minimizedMetadata = minimizedMetadata;
	};
	oFF.QueryServiceConfig.prototype.getMinimizedMetadata = function() {
		return this.m_minimizedMetadata;
	};
	oFF.QueryServiceConfig.prototype.setRequiredDimensions = function(
			requiredDimensions) {
		this.m_requiredDimensions = requiredDimensions;
	};
	oFF.QueryServiceConfig.prototype.getRequiredDimensions = function() {
		return this.m_requiredDimensions;
	};
	oFF.QueryServiceConfig.prototype.setDimensionsOnAxes = function(
			dimensionsOnAxes) {
		this.m_dimensionsOnAxes = dimensionsOnAxes;
	};
	oFF.QueryServiceConfig.prototype.getDimensionsOnAxes = function() {
		return this.m_dimensionsOnAxes;
	};
	oFF.QueryServiceConfig.prototype.setGenericServiceDescription = function(
			genericServiceDescription) {
		this.getDataSource().setGenericServiceDescription(
				genericServiceDescription);
	};
	oFF.AxisType = function() {
	};
	oFF.AxisType.prototype = new oFF.OlapComponentType();
	oFF.AxisType.COLUMNS = null;
	oFF.AxisType.ROWS = null;
	oFF.AxisType.FREE = null;
	oFF.AxisType.DYNAMIC = null;
	oFF.AxisType.REPOSITORY = null;
	oFF.AxisType.FILTER = null;
	oFF.AxisType.VIRTUAL = null;
	oFF.AxisType.s_all = null;
	oFF.AxisType.staticSetup = function() {
		oFF.AxisType.s_all = oFF.XSetOfNameObject.create();
		oFF.AxisType.REPOSITORY = oFF.AxisType.create("Repository", 3, null,
				false);
		oFF.AxisType.FREE = oFF.AxisType.create("Free", 2,
				oFF.AxisType.REPOSITORY, false);
		oFF.AxisType.COLUMNS = oFF.AxisType.create("Columns", 0,
				oFF.AxisType.FREE, true);
		oFF.AxisType.ROWS = oFF.AxisType.create("Rows", 1, oFF.AxisType.FREE,
				true);
		oFF.AxisType.DYNAMIC = oFF.AxisType.create("Dynamic", 4,
				oFF.AxisType.FREE, false);
		oFF.AxisType.FILTER = oFF.AxisType.create("Filter", 4,
				oFF.AxisType.REPOSITORY, false);
		oFF.AxisType.VIRTUAL = oFF.AxisType.create("Virtual", 999,
				oFF.AxisType.VIRTUAL, false);
	};
	oFF.AxisType.create = function(name, index, fallback, isVisible) {
		var newConstant = new oFF.AxisType();
		newConstant.setupAxis(name, index, fallback, isVisible);
		oFF.AxisType.s_all.add(newConstant);
		return newConstant;
	};
	oFF.AxisType.getAll = function() {
		return oFF.AxisType.s_all.getValuesAsReadOnlyList();
	};
	oFF.AxisType.lookup = function(name) {
		return oFF.AxisType.s_all.getByKey(name);
	};
	oFF.AxisType.prototype.m_index = 0;
	oFF.AxisType.prototype.m_fallbackAxis = null;
	oFF.AxisType.prototype.m_isVisible = false;
	oFF.AxisType.prototype.setupAxis = function(name, index, fallback,
			isVisible) {
		oFF.OlapComponentType.prototype.setupExt.call(this, name,
				oFF.OlapComponentType.AXIS);
		this.m_index = index;
		this.m_fallbackAxis = fallback;
		this.m_isVisible = isVisible;
	};
	oFF.AxisType.prototype.getIndex = function() {
		return this.m_index;
	};
	oFF.AxisType.prototype.getFallbackAxis = function() {
		return this.m_fallbackAxis;
	};
	oFF.AxisType.prototype.isVisible = function() {
		return this.m_isVisible;
	};
	oFF.DimensionType = function() {
	};
	oFF.DimensionType.prototype = new oFF.OlapComponentType();
	oFF.DimensionType.ATTRIBUTE_DIM = null;
	oFF.DimensionType.PRESENTATION = null;
	oFF.DimensionType.CONTAINER = null;
	oFF.DimensionType.CURRENCY = null;
	oFF.DimensionType.UNIT = null;
	oFF.DimensionType.DIMENSION = null;
	oFF.DimensionType.TIME = null;
	oFF.DimensionType.DATE = null;
	oFF.DimensionType.HIERARCHY_VERSION = null;
	oFF.DimensionType.HIERARCHY_NAME = null;
	oFF.DimensionType.SEARCH_DIMENSION = null;
	oFF.DimensionType.VERSION = null;
	oFF.DimensionType.ACCOUNT = null;
	oFF.DimensionType.GIS_DIMENSION = null;
	oFF.DimensionType.SEARCH_RESULT = null;
	oFF.DimensionType.SUGGEST_TERM = null;
	oFF.DimensionType.SUGGEST_SCOPE = null;
	oFF.DimensionType.SUGGEST_ATTRIBUTE = null;
	oFF.DimensionType.ABSTRACT_STRUCTURE = null;
	oFF.DimensionType.MEASURE_STRUCTURE = null;
	oFF.DimensionType.SECONDARY_STRUCTURE = null;
	oFF.DimensionType.CALCULATED_DIMENSION = null;
	oFF.DimensionType.DIMENSION_INCOMPLETE = null;
	oFF.DimensionType.staticSetupDimensionType = function() {
		oFF.DimensionType.DIMENSION = oFF.DimensionType.createDimensionType(
				"Dimension", oFF.OlapComponentType.ABSTRACT_DIMENSION, true);
		oFF.DimensionType.SEARCH_DIMENSION = oFF.DimensionType
				.createDimensionType("SearchDimension",
						oFF.DimensionType.DIMENSION, false);
		oFF.DimensionType.GIS_DIMENSION = oFF.DimensionType
				.createDimensionType("GisDimension",
						oFF.DimensionType.DIMENSION, false);
		oFF.DimensionType.ABSTRACT_STRUCTURE = oFF.DimensionType
				.createDimensionType("AbstractStructure",
						oFF.OlapComponentType.ABSTRACT_DIMENSION, false);
		oFF.DimensionType.MEASURE_STRUCTURE = oFF.DimensionType
				.createDimensionType("MeasureStructure",
						oFF.DimensionType.ABSTRACT_STRUCTURE, true);
		oFF.DimensionType.SECONDARY_STRUCTURE = oFF.DimensionType
				.createDimensionType("SecondaryStructure",
						oFF.DimensionType.ABSTRACT_STRUCTURE, true);
		oFF.DimensionType.CURRENCY = oFF.DimensionType.createDimensionType(
				"CurrencyDimension", oFF.DimensionType.DIMENSION, true);
		oFF.DimensionType.UNIT = oFF.DimensionType.createDimensionType(
				"UnitDimension", oFF.DimensionType.DIMENSION, true);
		oFF.DimensionType.TIME = oFF.DimensionType.createDimensionType(
				"TimeDimension", oFF.DimensionType.DIMENSION, true);
		oFF.DimensionType.DATE = oFF.DimensionType.createDimensionType(
				"DateDimension", oFF.DimensionType.DIMENSION, true);
		oFF.DimensionType.HIERARCHY_VERSION = oFF.DimensionType
				.createDimensionType("HierarchyVersionDimension",
						oFF.DimensionType.DIMENSION, false);
		oFF.DimensionType.HIERARCHY_NAME = oFF.DimensionType
				.createDimensionType("HierarchyNameDimension",
						oFF.DimensionType.DIMENSION, false);
		oFF.DimensionType.SEARCH_RESULT = oFF.DimensionType
				.createDimensionType("SearchResultDimension",
						oFF.DimensionType.DIMENSION, false);
		oFF.DimensionType.SUGGEST_TERM = oFF.DimensionType.createDimensionType(
				"SuggestTermDimension", oFF.DimensionType.DIMENSION, false);
		oFF.DimensionType.SUGGEST_SCOPE = oFF.DimensionType
				.createDimensionType("SuggestScopeDimension",
						oFF.DimensionType.DIMENSION, false);
		oFF.DimensionType.SUGGEST_ATTRIBUTE = oFF.DimensionType
				.createDimensionType("SuggestAttributeDimension",
						oFF.DimensionType.DIMENSION, false);
		oFF.DimensionType.ACCOUNT = oFF.DimensionType.createDimensionType(
				"AccountDimension", oFF.DimensionType.DIMENSION, true);
		oFF.DimensionType.VERSION = oFF.DimensionType.createDimensionType(
				"VersionDimension", oFF.DimensionType.DIMENSION, true);
		oFF.DimensionType.ATTRIBUTE_DIM = oFF.DimensionType
				.createDimensionType("AttributeDimension",
						oFF.OlapComponentType.ABSTRACT_DIMENSION, false);
		oFF.DimensionType.PRESENTATION = oFF.DimensionType
				.createDimensionType("PresentationDimension",
						oFF.DimensionType.ATTRIBUTE_DIM, false);
		oFF.DimensionType.CONTAINER = oFF.DimensionType.createDimensionType(
				"ContainerDimension", oFF.DimensionType.ATTRIBUTE_DIM, false);
		oFF.DimensionType.CALCULATED_DIMENSION = oFF.DimensionType
				.createDimensionType("CalculatedDimension",
						oFF.DimensionType.DIMENSION, true);
		oFF.DimensionType.DIMENSION_INCOMPLETE = oFF.DimensionType
				.createDimensionType("DimensionIncomplete",
						oFF.DimensionType.DIMENSION, false);
	};
	oFF.DimensionType.createDimensionType = function(name, parent,
			isValidForBlending) {
		var newConstant = new oFF.DimensionType();
		newConstant.setupExt(name, parent);
		newConstant.m_isValidForBlending = isValidForBlending;
		return newConstant;
	};
	oFF.DimensionType.prototype.m_isValidForBlending = false;
	oFF.DimensionType.prototype.isValidForBlending = function() {
		return this.m_isValidForBlending;
	};
	oFF.FilterComponentType = function() {
	};
	oFF.FilterComponentType.prototype = new oFF.OlapComponentType();
	oFF.FilterComponentType.BOOLEAN_ALGEBRA = null;
	oFF.FilterComponentType.AND = null;
	oFF.FilterComponentType.TUPLE = null;
	oFF.FilterComponentType.OR = null;
	oFF.FilterComponentType.NOT = null;
	oFF.FilterComponentType.OPERATION = null;
	oFF.FilterComponentType.CARTESIAN_LIST = null;
	oFF.FilterComponentType.CARTESIAN_SPATIAL_LIST = null;
	oFF.FilterComponentType.CARTESIAN_PRODUCT = null;
	oFF.FilterComponentType.SPATIAL_FILTER = null;
	oFF.FilterComponentType.MEMBER_OPERAND = null;
	oFF.FilterComponentType.VIRTUAL_DATASOURCE = null;
	oFF.FilterComponentType.staticSetup = function() {
		oFF.FilterComponentType.OPERATION = oFF.FilterComponentType.create(
				"Operation", oFF.OlapComponentType.FILTER_ELEMENT);
		oFF.FilterComponentType.BOOLEAN_ALGEBRA = oFF.FilterComponentType
				.create("BooleanAlgebra", oFF.OlapComponentType.FILTER_ELEMENT);
		oFF.FilterComponentType.OR = oFF.FilterComponentType.create("Or",
				oFF.FilterComponentType.BOOLEAN_ALGEBRA);
		oFF.FilterComponentType.AND = oFF.FilterComponentType.create("And",
				oFF.FilterComponentType.BOOLEAN_ALGEBRA);
		oFF.FilterComponentType.NOT = oFF.FilterComponentType.create("Not",
				oFF.FilterComponentType.BOOLEAN_ALGEBRA);
		oFF.FilterComponentType.TUPLE = oFF.FilterComponentType.create("Tuple",
				oFF.OlapComponentType.FILTER_ELEMENT);
		oFF.FilterComponentType.VIRTUAL_DATASOURCE = oFF.FilterComponentType
				.create("VirtualDatasource",
						oFF.OlapComponentType.FILTER_ELEMENT);
		oFF.FilterComponentType.CARTESIAN_PRODUCT = oFF.FilterComponentType
				.create("CartesianProduct", oFF.FilterComponentType.AND);
		oFF.FilterComponentType.CARTESIAN_LIST = oFF.FilterComponentType
				.create("CartesianList", oFF.FilterComponentType.OR);
		oFF.FilterComponentType.CARTESIAN_SPATIAL_LIST = oFF.FilterComponentType
				.create("CartesianSpatialList",
						oFF.FilterComponentType.CARTESIAN_LIST);
		oFF.FilterComponentType.SPATIAL_FILTER = oFF.FilterComponentType
				.create("Spatial", oFF.OlapComponentType.FILTER_ELEMENT);
		oFF.FilterComponentType.MEMBER_OPERAND = oFF.FilterComponentType
				.create("MemberOperand", oFF.OlapComponentType.FILTER_ELEMENT);
	};
	oFF.FilterComponentType.create = function(name, parent) {
		var newConstant = new oFF.FilterComponentType();
		newConstant.setupExt(name, parent);
		return newConstant;
	};
	oFF.FormulaOperator = function() {
	};
	oFF.FormulaOperator.prototype = new oFF.OlapComponentType();
	oFF.FormulaOperator.MULTIPLICATION = null;
	oFF.FormulaOperator.POWER_OF = null;
	oFF.FormulaOperator.ADDITION = null;
	oFF.FormulaOperator.SUBTRACTION = null;
	oFF.FormulaOperator.DIVISION = null;
	oFF.FormulaOperator.ABS = null;
	oFF.FormulaOperator.AND = null;
	oFF.FormulaOperator.CEIL = null;
	oFF.FormulaOperator.EXP = null;
	oFF.FormulaOperator.FLOOR = null;
	oFF.FormulaOperator.LOG = null;
	oFF.FormulaOperator.LOG_10 = null;
	oFF.FormulaOperator.MIN = null;
	oFF.FormulaOperator.MAX = null;
	oFF.FormulaOperator.NOT = null;
	oFF.FormulaOperator.OR = null;
	oFF.FormulaOperator.ROUND = null;
	oFF.FormulaOperator.SQRT = null;
	oFF.FormulaOperator.NE = null;
	oFF.FormulaOperator.LT = null;
	oFF.FormulaOperator.LE = null;
	oFF.FormulaOperator.EQ = null;
	oFF.FormulaOperator.GT = null;
	oFF.FormulaOperator.GE = null;
	oFF.FormulaOperator.IF = null;
	oFF.FormulaOperator.IN = null;
	oFF.FormulaOperator.ISNULL = null;
	oFF.FormulaOperator.MOD_MDS = null;
	oFF.FormulaOperator.CELL_VALUE = null;
	oFF.FormulaOperator.DECFLOAT = null;
	oFF.FormulaOperator.DOUBLE = null;
	oFF.FormulaOperator.FLOAT = null;
	oFF.FormulaOperator.HIERARCHYAGGREGATE = null;
	oFF.FormulaOperator.INT = null;
	oFF.FormulaOperator.MEMBERINDEX = null;
	oFF.FormulaOperator.TRUNCATE = null;
	oFF.FormulaOperator.MOD_BW = null;
	oFF.FormulaOperator.NODIM = null;
	oFF.FormulaOperator.SIN = null;
	oFF.FormulaOperator.COS = null;
	oFF.FormulaOperator.TAN = null;
	oFF.FormulaOperator.ASIN = null;
	oFF.FormulaOperator.ACOS = null;
	oFF.FormulaOperator.ATAN = null;
	oFF.FormulaOperator.SINH = null;
	oFF.FormulaOperator.COSH = null;
	oFF.FormulaOperator.TANH = null;
	oFF.FormulaOperator.DIV = null;
	oFF.FormulaOperator.FRAC = null;
	oFF.FormulaOperator.MAX0 = null;
	oFF.FormulaOperator.MIN0 = null;
	oFF.FormulaOperator.SIGN = null;
	oFF.FormulaOperator.DATE = null;
	oFF.FormulaOperator.TIME = null;
	oFF.FormulaOperator.NOERR = null;
	oFF.FormulaOperator.NDIV0 = null;
	oFF.FormulaOperator.PERCENT = null;
	oFF.FormulaOperator.PERCENT_A = null;
	oFF.FormulaOperator.XOR = null;
	oFF.FormulaOperator.DELTA = null;
	oFF.FormulaOperator.DIFF_NULL = null;
	oFF.FormulaOperator.MDS_OPERATOR = null;
	oFF.FormulaOperator.BW_OPERATOR = null;
	oFF.FormulaOperator.staticSetup = function() {
		oFF.FormulaOperator.MDS_OPERATOR = oFF.XList.create();
		oFF.FormulaOperator.BW_OPERATOR = oFF.XList.create();
		oFF.FormulaOperator.MULTIPLICATION = oFF.FormulaOperator.create("*",
				"Multiplication", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.POWER_OF = oFF.FormulaOperator.create("**",
				"Power of", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.ADDITION = oFF.FormulaOperator.create("+",
				"Addition", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.SUBTRACTION = oFF.FormulaOperator.create("-",
				"Subtraction / Negation", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.DIVISION = oFF.FormulaOperator.create("/",
				"Division", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.ABS = oFF.FormulaOperator.create("ABS",
				"Absolute Value", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.AND = oFF.FormulaOperator.create("AND",
				"Binary AND", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.CEIL = oFF.FormulaOperator.create("CEIL",
				"Round up", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.EXP = oFF.FormulaOperator.create("EXP",
				"Base-E exponential function", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.FLOOR = oFF.FormulaOperator.create("FLOOR",
				"Round down", oFF.TriStateBool._FALSE);
		oFF.FormulaOperator.LOG = oFF.FormulaOperator.create("LOG",
				"Natural Logarithm", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.LOG_10 = oFF.FormulaOperator.create("LOG10",
				"Common Logarithm", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.MIN = oFF.FormulaOperator.create("MIN", "Minimum",
				oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.MAX = oFF.FormulaOperator.create("MAX", "Maximum",
				oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.NOT = oFF.FormulaOperator.create("NOT",
				"Binary Negation", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.OR = oFF.FormulaOperator.create("OR", "Binary OR",
				oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.ROUND = oFF.FormulaOperator.create("ROUND",
				"Round", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.SQRT = oFF.FormulaOperator.create("SQRT",
				"Square root", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.NE = oFF.FormulaOperator.create("!=", "Not equal",
				oFF.TriStateBool._FALSE);
		oFF.FormulaOperator.LT = oFF.FormulaOperator.create("<", "Less than",
				oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.LE = oFF.FormulaOperator.create("<=",
				"Less or equal than", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.EQ = oFF.FormulaOperator.create("==", "Equal to",
				oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.GT = oFF.FormulaOperator.create(">",
				"Greater than", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.GE = oFF.FormulaOperator.create(">=",
				"Greater or equal to", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.IF = oFF.FormulaOperator.create("IF",
				"if-then-else", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.IN = oFF.FormulaOperator.create("IN",
				"Contained in list", oFF.TriStateBool._FALSE);
		oFF.FormulaOperator.ISNULL = oFF.FormulaOperator.create("ISNULL",
				"Checks for NULL value", oFF.TriStateBool._FALSE);
		oFF.FormulaOperator.MOD_MDS = oFF.FormulaOperator.create("%", "Modulo",
				oFF.TriStateBool._FALSE);
		oFF.FormulaOperator.CELL_VALUE = oFF.FormulaOperator.create(
				"CELLVALUE", "Cell value lookup", oFF.TriStateBool._FALSE);
		oFF.FormulaOperator.DECFLOAT = oFF.FormulaOperator.create("DECFLOAT",
				"Conversion to decfloat", oFF.TriStateBool._FALSE);
		oFF.FormulaOperator.DOUBLE = oFF.FormulaOperator.create("DOUBLE",
				"Conversion to double", oFF.TriStateBool._FALSE);
		oFF.FormulaOperator.FLOAT = oFF.FormulaOperator.create("FLOAT",
				"Conversion to float", oFF.TriStateBool._FALSE);
		oFF.FormulaOperator.HIERARCHYAGGREGATE = oFF.FormulaOperator.create(
				"HIERARCHYAGGREGATE", "Member aggregation",
				oFF.TriStateBool._FALSE);
		oFF.FormulaOperator.INT = oFF.FormulaOperator.create("INT",
				"Conversion to int", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.MEMBERINDEX = oFF.FormulaOperator.create(
				"MEMBERINDEX", "Member index", oFF.TriStateBool._FALSE);
		oFF.FormulaOperator.TRUNCATE = oFF.FormulaOperator.create("TRUNCATE",
				"Truncate", oFF.TriStateBool._DEFAULT);
		oFF.FormulaOperator.MOD_BW = oFF.FormulaOperator.create("MOD",
				"Modulo", oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.NODIM = oFF.FormulaOperator.create("NODIM",
				"Values Without Dimensions / Units", oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.SIN = oFF.FormulaOperator.create("SIN", "Sine",
				oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.COS = oFF.FormulaOperator.create("COS", "Cosine",
				oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.TAN = oFF.FormulaOperator.create("TAN", "Tangent",
				oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.ASIN = oFF.FormulaOperator.create("ASIN",
				"Inverse Sine", oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.ACOS = oFF.FormulaOperator.create("ACOS",
				"Inverse Cosine", oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.ATAN = oFF.FormulaOperator.create("ATAN",
				"Inverse Tangent", oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.SINH = oFF.FormulaOperator.create("SINH",
				"Hyperbolic Sine", oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.COSH = oFF.FormulaOperator.create("COSH",
				"Hyperbolic Cosine", oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.TANH = oFF.FormulaOperator.create("TANH",
				"Hyperbolic Tangent", oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.DIV = oFF.FormulaOperator.create("DIV", "Division",
				oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.FRAC = oFF.FormulaOperator.create("FRAC",
				"Keep only decimal places", oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.MAX0 = oFF.FormulaOperator.create("MAX0",
				"Maximum or 0 if negativ", oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.MIN0 = oFF.FormulaOperator.create("MIN1",
				"Minimum or 0 if negativ", oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.SIGN = oFF.FormulaOperator.create("SIGN",
				"Int representation of sign", oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.DATE = oFF.FormulaOperator.create("DATE",
				"Conversion to date", oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.TIME = oFF.FormulaOperator.create("TIME",
				"Conversion to time", oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.NOERR = oFF.FormulaOperator.create("NOERR",
				"Equal to 0 for undefined calculations, otherwise x",
				oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.NDIV0 = oFF.FormulaOperator.create("NDIV0",
				"Equals 0 when divided by 0, otherwise x",
				oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.PERCENT = oFF.FormulaOperator.create("%",
				"Percentage Deviation", oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.PERCENT_A = oFF.FormulaOperator.create("%_A",
				"Percentage Amount with Signed Base Value",
				oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.XOR = oFF.FormulaOperator.create("XOR",
				"Exlusive binary OR", oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.DELTA = oFF.FormulaOperator.create("DELTA",
				"Delta Operator", oFF.TriStateBool._TRUE);
		oFF.FormulaOperator.DIFF_NULL = oFF.FormulaOperator.create("DIFF_NULL",
				"Diff0 Operator", oFF.TriStateBool._TRUE);
	};
	oFF.FormulaOperator.create = function(name, description, supportedOnlyByBw) {
		var newOperator = oFF.XConstant.setupName(new oFF.FormulaOperator(),
				name);
		newOperator.m_description = description;
		if (supportedOnlyByBw === oFF.TriStateBool._TRUE) {
			oFF.FormulaOperator.BW_OPERATOR.add(newOperator);
		} else {
			if (supportedOnlyByBw === oFF.TriStateBool._FALSE) {
				oFF.FormulaOperator.MDS_OPERATOR.add(newOperator);
			} else {
				oFF.FormulaOperator.BW_OPERATOR.add(newOperator);
				oFF.FormulaOperator.MDS_OPERATOR.add(newOperator);
			}
		}
		return newOperator;
	};
	oFF.FormulaOperator.getSupportedFormulaOperator = function(systemType) {
		if (systemType.isTypeOf(oFF.SystemType.BW)) {
			return oFF.FormulaOperator.BW_OPERATOR;
		}
		if (systemType.isTypeOf(oFF.SystemType.HANA)) {
			return oFF.FormulaOperator.MDS_OPERATOR;
		}
		return oFF.XList.create();
	};
	oFF.FormulaOperator.prototype.m_description = null;
	oFF.FormulaOperator.prototype.getDescription = function() {
		return this.m_description;
	};
	oFF.MemberType = function() {
	};
	oFF.MemberType.prototype = new oFF.OlapComponentType();
	oFF.MemberType.ABSTRACT_MEMBER = null;
	oFF.MemberType.MEMBER = null;
	oFF.MemberType.SINGLE_MEMBER_EXIT = null;
	oFF.MemberType.MEMBER_EXITS = null;
	oFF.MemberType.LITERAL_MEMBER = null;
	oFF.MemberType.MEASURE = null;
	oFF.MemberType.BASIC_MEASURE = null;
	oFF.MemberType.FORMULA = null;
	oFF.MemberType.SERVER_BASED_FORMULA = null;
	oFF.MemberType.RESTRICTED_MEASURE = null;
	oFF.MemberType.HIERARCHY_NODE = null;
	oFF.MemberType.RESULT = null;
	oFF.MemberType.CONDITION_RESULT = null;
	oFF.MemberType.CONDITION_OTHERS_RESULT = null;
	oFF.MemberType.DRILL_PATH_ELEMENT = null;
	oFF.MemberType.SELECT_VALUE = null;
	oFF.MemberType.FIELD_VALUE = null;
	oFF.MemberType.VALUE_HELP_ELEMENT = null;
	oFF.MemberType.VALUE_HELP_NODE = null;
	oFF.MemberType.VALUE_HELP_SPLITTER_NODE = null;
	oFF.MemberType.VALUE_HELP_WINDOW_SPLITTER_NODE = null;
	oFF.MemberType.VALUE_HELP_ROOT_NODE = null;
	oFF.MemberType.VALUE_HELP_LEAF = null;
	oFF.MemberType.TUPLE_ELEMENT = null;
	oFF.MemberType.TUPLE_ELEMENT_AS_MEMBER = null;
	oFF.MemberType.TUPLE_ELEMENT_AS_NODE = null;
	oFF.MemberType.s_instances = null;
	oFF.MemberType._IS_NODE = true;
	oFF.MemberType._IS_LEAF = false;
	oFF.MemberType.s_membersCodeMap = null;
	oFF.MemberType.BASIC_MEASURE_CODE = 1;
	oFF.MemberType.RESTRICTED_MEASURE_CODE = 2;
	oFF.MemberType.FORMULA_CODE = 4;
	oFF.MemberType.staticSetupMemberType = function() {
		oFF.MemberType.ABSTRACT_MEMBER = oFF.MemberType.createMemberType(
				"AbstractMember", oFF.OlapComponentType.DIMENSION_CONTEXT,
				false, oFF.MemberType._IS_LEAF, true, 3);
		oFF.MemberType.MEMBER = oFF.MemberType.createMemberType("Member",
				oFF.MemberType.ABSTRACT_MEMBER, false, oFF.MemberType._IS_LEAF,
				true, 3);
		oFF.MemberType.SINGLE_MEMBER_EXIT = oFF.MemberType.createMemberType(
				"SingleMemberExit", oFF.MemberType.ABSTRACT_MEMBER, false,
				oFF.MemberType._IS_LEAF, true, 1);
		oFF.MemberType.MEMBER_EXITS = oFF.MemberType.createMemberType(
				"MembersExit", oFF.MemberType.ABSTRACT_MEMBER, false,
				oFF.MemberType._IS_LEAF, false, 2);
		oFF.MemberType.LITERAL_MEMBER = oFF.MemberType.createMemberType(
				"LiteralMember", oFF.MemberType.ABSTRACT_MEMBER, false,
				oFF.MemberType._IS_LEAF, false, 5);
		oFF.MemberType.MEASURE = oFF.MemberType.createMemberType("Measure",
				oFF.MemberType.ABSTRACT_MEMBER, false, oFF.MemberType._IS_LEAF,
				true, 4);
		oFF.MemberType.BASIC_MEASURE = oFF.MemberType.createMemberType(
				"BasicMeasure", oFF.MemberType.MEASURE, false,
				oFF.MemberType._IS_LEAF, true, 4);
		oFF.MemberType.FORMULA = oFF.MemberType.createMemberType(
				"FormulaMember", oFF.MemberType.MEASURE, false,
				oFF.MemberType._IS_LEAF, true, 4);
		oFF.MemberType.SERVER_BASED_FORMULA = oFF.MemberType.createMemberType(
				"ServerBasedFormula", oFF.MemberType.ABSTRACT_MEMBER, false,
				oFF.MemberType._IS_LEAF, true, 4);
		oFF.MemberType.RESTRICTED_MEASURE = oFF.MemberType.createMemberType(
				"RestrictedMeasure", oFF.MemberType.MEASURE, false,
				oFF.MemberType._IS_LEAF, true, 4);
		oFF.MemberType.HIERARCHY_NODE = oFF.MemberType.createMemberType(
				"HierarchyNode", oFF.MemberType.ABSTRACT_MEMBER, false,
				oFF.MemberType._IS_NODE, false, 6);
		oFF.MemberType.RESULT = oFF.MemberType.createMemberType("ResultMember",
				oFF.MemberType.ABSTRACT_MEMBER, true, oFF.MemberType._IS_LEAF,
				false, 12);
		oFF.MemberType.CONDITION_RESULT = oFF.MemberType.createMemberType(
				"ConditionResult", oFF.MemberType.RESULT, true,
				oFF.MemberType._IS_LEAF, false, 10);
		oFF.MemberType.CONDITION_OTHERS_RESULT = oFF.MemberType
				.createMemberType("ConditionOthersResult",
						oFF.MemberType.RESULT, true, oFF.MemberType._IS_LEAF,
						false, 11);
		oFF.MemberType.DRILL_PATH_ELEMENT = oFF.MemberType.createMemberType(
				"DrillPathElement", oFF.MemberType.ABSTRACT_MEMBER, false,
				oFF.MemberType._IS_LEAF, true, 0);
		oFF.MemberType.SELECT_VALUE = oFF.MemberType.createMemberType(
				"SelectValue", oFF.MemberType.ABSTRACT_MEMBER, false,
				oFF.MemberType._IS_LEAF, false, 0);
		oFF.MemberType.FIELD_VALUE = oFF.MemberType.createMemberType(
				"FieldValue", oFF.MemberType.FIELD_VALUE, false,
				oFF.MemberType._IS_LEAF, false, 0);
		oFF.MemberType.VALUE_HELP_ELEMENT = oFF.MemberType.createMemberType(
				"ValueHelpElement", oFF.MemberType.ABSTRACT_MEMBER, false,
				oFF.MemberType._IS_NODE, true, 0);
		oFF.MemberType.VALUE_HELP_NODE = oFF.MemberType.createMemberType(
				"ValueHelpNode", oFF.MemberType.VALUE_HELP_ELEMENT, false,
				oFF.MemberType._IS_NODE, true, 0);
		oFF.MemberType.VALUE_HELP_SPLITTER_NODE = oFF.MemberType
				.createMemberType("ValueHelpSplitterNode",
						oFF.MemberType.VALUE_HELP_NODE, false,
						oFF.MemberType._IS_NODE, true, 0);
		oFF.MemberType.VALUE_HELP_WINDOW_SPLITTER_NODE = oFF.MemberType
				.createMemberType("ValueHelpWindowSplitterNode",
						oFF.MemberType.VALUE_HELP_SPLITTER_NODE, false,
						oFF.MemberType._IS_NODE, true, 0);
		oFF.MemberType.VALUE_HELP_ROOT_NODE = oFF.MemberType.createMemberType(
				"ValueHelpRootNode", oFF.MemberType.VALUE_HELP_NODE, false,
				oFF.MemberType._IS_NODE, true, 0);
		oFF.MemberType.VALUE_HELP_LEAF = oFF.MemberType.createMemberType(
				"ValueHelpLeaf", oFF.MemberType.VALUE_HELP_ELEMENT, false,
				oFF.MemberType._IS_LEAF, true, 0);
		oFF.MemberType.TUPLE_ELEMENT = oFF.MemberType.createMemberType(
				"TupleElement", oFF.MemberType.ABSTRACT_MEMBER, false,
				oFF.MemberType._IS_LEAF, true, 0);
		oFF.MemberType.TUPLE_ELEMENT_AS_MEMBER = oFF.MemberType
				.createMemberType("TupleElementAsMember",
						oFF.MemberType.TUPLE_ELEMENT, true,
						oFF.MemberType._IS_LEAF, true, 0);
		oFF.MemberType.TUPLE_ELEMENT_AS_NODE = oFF.MemberType.createMemberType(
				"TupleElementAsNode", oFF.MemberType.TUPLE_ELEMENT, true,
				oFF.MemberType._IS_NODE, true, 0);
		oFF.MemberType.s_membersCodeMap = oFF.XHashMapByString.create();
		oFF.MemberType.s_membersCodeMap.put(oFF.XInteger
				.convertToString(oFF.MemberType.BASIC_MEASURE_CODE),
				oFF.MemberType.BASIC_MEASURE);
		oFF.MemberType.s_membersCodeMap.put(oFF.XInteger
				.convertToString(oFF.MemberType.RESTRICTED_MEASURE_CODE),
				oFF.MemberType.RESTRICTED_MEASURE);
		oFF.MemberType.s_membersCodeMap.put(oFF.XInteger
				.convertToString(oFF.MemberType.FORMULA_CODE),
				oFF.MemberType.FORMULA);
	};
	oFF.MemberType.createMemberType = function(constant, parentType, result,
			node, singleMember, sortOrder) {
		var mt = new oFF.MemberType();
		mt.setupExt(constant, parentType);
		mt.m_isNode = node;
		mt.m_isResult = result;
		mt.m_sortOrder = sortOrder;
		mt.m_singleMember = singleMember;
		if (oFF.isNull(oFF.MemberType.s_instances)) {
			oFF.MemberType.s_instances = oFF.XHashMapByString.create();
		}
		oFF.MemberType.s_instances.put(constant, mt);
		return mt;
	};
	oFF.MemberType.get = function(name) {
		return oFF.MemberType.s_instances.getByKey(name);
	};
	oFF.MemberType.getSupportedMembersForCode = function(memberCode) {
		var memSize = oFF.MemberType.s_membersCodeMap.size();
		var supportdMembers = oFF.XList.create();
		var membersList = oFF.MemberType.s_membersCodeMap
				.getKeysAsReadOnlyListOfString();
		var i;
		var keyValue;
		for (i = 0; i < memSize; i++) {
			keyValue = membersList.get(i);
			if (oFF.XMath.binaryAnd(memberCode, oFF.XInteger
					.convertFromString(keyValue)) > 0) {
				supportdMembers.add(oFF.MemberType.s_membersCodeMap
						.getByKey(keyValue));
			}
		}
		return supportdMembers;
	};
	oFF.MemberType.prototype.m_isNode = false;
	oFF.MemberType.prototype.m_singleMember = false;
	oFF.MemberType.prototype.m_isResult = false;
	oFF.MemberType.prototype.m_sortOrder = 0;
	oFF.MemberType.prototype.isNode = function() {
		return this.m_isNode;
	};
	oFF.MemberType.prototype.isLeaf = function() {
		return !this.m_isNode;
	};
	oFF.MemberType.prototype.isSingleMember = function() {
		return this.m_singleMember;
	};
	oFF.MemberType.prototype.isResult = function() {
		return this.m_isResult;
	};
	oFF.MemberType.prototype.isArtificial = function() {
		return !(this.m_isNode || this === oFF.MemberType.MEMBER || this === oFF.MemberType.SERVER_BASED_FORMULA);
	};
	oFF.MemberType.prototype.getSortOrder = function() {
		return this.m_sortOrder;
	};
	oFF.OlapProperty = function() {
	};
	oFF.OlapProperty.prototype = new oFF.OlapComponentType();
	oFF.OlapProperty.NAME = null;
	oFF.OlapProperty.TEXT = null;
	oFF.OlapProperty.DATASOURCE = null;
	oFF.OlapProperty.SIGN_PRESENTATION = null;
	oFF.OlapProperty.RESULT_ALIGNMENT = null;
	oFF.OlapProperty.LOWER_LEVEL_NODE_ALIGNMENT = null;
	oFF.OlapProperty.staticSetup = function() {
		oFF.OlapProperty.NAME = oFF.OlapProperty.create("Name");
		oFF.OlapProperty.TEXT = oFF.OlapProperty.create("Text");
		oFF.OlapProperty.DATASOURCE = oFF.OlapProperty.create("Datasource");
		oFF.OlapProperty.SIGN_PRESENTATION = oFF.OlapProperty
				.create("SignPresentation");
		oFF.OlapProperty.RESULT_ALIGNMENT = oFF.OlapProperty
				.create("ResultAlignment");
		oFF.OlapProperty.LOWER_LEVEL_NODE_ALIGNMENT = oFF.OlapProperty
				.create("LowerLevelNodeAlignment");
	};
	oFF.OlapProperty.create = function(name) {
		var newConstant = new oFF.OlapProperty();
		newConstant.setupExt(name, oFF.OlapComponentType.PROPERTY);
		return newConstant;
	};
	oFF.SpatialComparisonOperator = function() {
	};
	oFF.SpatialComparisonOperator.prototype = new oFF.ComparisonOperator();
	oFF.SpatialComparisonOperator.CONTAINS = null;
	oFF.SpatialComparisonOperator.INTERSECTS = null;
	oFF.SpatialComparisonOperator.INTERSECTS_RECT = null;
	oFF.SpatialComparisonOperator.COVERS = null;
	oFF.SpatialComparisonOperator.CROSSES = null;
	oFF.SpatialComparisonOperator.DISJOINT = null;
	oFF.SpatialComparisonOperator.OVERLAPS = null;
	oFF.SpatialComparisonOperator.TOUCHES = null;
	oFF.SpatialComparisonOperator.WITHIN = null;
	oFF.SpatialComparisonOperator.WITHIN_DISTANCE = null;
	oFF.SpatialComparisonOperator._SPATIAL = null;
	oFF.SpatialComparisonOperator.staticSetupSpatialComparisonOps = function() {
		oFF.SpatialComparisonOperator._SPATIAL = oFF.SpatialComparisonOperator
				.createSpatialComparison("SPATIAL", "SPATIAL", 0);
		oFF.SpatialComparisonOperator.CONTAINS = oFF.SpatialComparisonOperator
				.createSpatialComparison("CONTAINS", "contains", 1);
		oFF.SpatialComparisonOperator.INTERSECTS = oFF.SpatialComparisonOperator
				.createSpatialComparison("INTERSECTS", "intersects", 1);
		oFF.SpatialComparisonOperator.INTERSECTS_RECT = oFF.SpatialComparisonOperator
				.createSpatialComparison("INTERSECTS_RECT", "intersectsRect", 2);
		oFF.SpatialComparisonOperator.COVERS = oFF.SpatialComparisonOperator
				.createSpatialComparison("COVERS", "covers", 1);
		oFF.SpatialComparisonOperator.CROSSES = oFF.SpatialComparisonOperator
				.createSpatialComparison("CROSSES", "crosses", 1);
		oFF.SpatialComparisonOperator.DISJOINT = oFF.SpatialComparisonOperator
				.createSpatialComparison("DISJOINT", "disjoint", 1);
		oFF.SpatialComparisonOperator.OVERLAPS = oFF.SpatialComparisonOperator
				.createSpatialComparison("OVERLAPS", "overlaps", 1);
		oFF.SpatialComparisonOperator.TOUCHES = oFF.SpatialComparisonOperator
				.createSpatialComparison("TOUCHES", "touches", 1);
		oFF.SpatialComparisonOperator.WITHIN = oFF.SpatialComparisonOperator
				.createSpatialComparison("WITHIN", "within", 1);
		oFF.SpatialComparisonOperator.WITHIN_DISTANCE = oFF.SpatialComparisonOperator
				.createSpatialComparison("WITHIN_DISTANCE", "withinDistance", 3);
	};
	oFF.SpatialComparisonOperator.createSpatialComparison = function(name,
			displayString, numberOfParameters) {
		var newConstant = new oFF.SpatialComparisonOperator();
		newConstant
				.setupOperator(oFF.SpatialComparisonOperator._SPATIAL, name,
						displayString, numberOfParameters,
						oFF.Operator.GRAVITY_3, true);
		return newConstant;
	};
	oFF.VariableType = function() {
	};
	oFF.VariableType.prototype = new oFF.OlapComponentType();
	oFF.VariableType.SIMPLE_TYPE_VARIABLE = null;
	oFF.VariableType.TEXT_VARIABLE = null;
	oFF.VariableType.FORMULA_VARIABLE = null;
	oFF.VariableType.DIMENSION_MEMBER_VARIABLE = null;
	oFF.VariableType.HIERARCHY_NODE_VARIABLE = null;
	oFF.VariableType.HIERARCHY_NAME_VARIABLE = null;
	oFF.VariableType.OPTION_LIST_VARIABLE = null;
	oFF.VariableType.HIERARCHY_VARIABLE = null;
	oFF.VariableType.ANY_VARIABLE = null;
	oFF.VariableType.staticSetup = function() {
		oFF.VariableType.ANY_VARIABLE = oFF.VariableType.create("AnyVariable",
				oFF.OlapComponentType.VARIABLE_CONTEXT);
		oFF.VariableType.SIMPLE_TYPE_VARIABLE = oFF.VariableType.create(
				"SimpleTypeVariable", oFF.VariableType.ANY_VARIABLE);
		oFF.VariableType.TEXT_VARIABLE = oFF.VariableType.create(
				"TextVariable", oFF.VariableType.SIMPLE_TYPE_VARIABLE);
		oFF.VariableType.FORMULA_VARIABLE = oFF.VariableType.create(
				"FormulaVariable", oFF.VariableType.SIMPLE_TYPE_VARIABLE);
		oFF.VariableType.DIMENSION_MEMBER_VARIABLE = oFF.VariableType.create(
				"DimensionMemberVariable", oFF.VariableType.ANY_VARIABLE);
		oFF.VariableType.HIERARCHY_NODE_VARIABLE = oFF.VariableType.create(
				"HierarchyNodeVariable",
				oFF.VariableType.DIMENSION_MEMBER_VARIABLE);
		oFF.VariableType.HIERARCHY_NAME_VARIABLE = oFF.VariableType.create(
				"HierarchyNameVariable",
				oFF.VariableType.DIMENSION_MEMBER_VARIABLE);
		oFF.VariableType.OPTION_LIST_VARIABLE = oFF.VariableType.create(
				"OptionListVariable", oFF.VariableType.ANY_VARIABLE);
		oFF.VariableType.HIERARCHY_VARIABLE = oFF.VariableType.create(
				"HierarchyVariable", oFF.VariableType.OPTION_LIST_VARIABLE);
	};
	oFF.VariableType.create = function(name, parentType) {
		var object = new oFF.VariableType();
		object.setupExt(name, parentType);
		return object;
	};
	oFF.OlapApiModule = function() {
	};
	oFF.OlapApiModule.prototype = new oFF.DfModule();
	oFF.OlapApiModule.AGGREGATION_LEVEL_FACTORY = "AGGREGATION_LEVEL_FACTORY";
	oFF.OlapApiModule.XS_QUERY_CONSUMER = "QUERY_CONSUMER";
	oFF.OlapApiModule.SERVICE_TYPE_QUERY_CONSUMER = null;
	oFF.OlapApiModule.XS_HIERARCHY_CATALOG = "HIERARCHY_CATALOG";
	oFF.OlapApiModule.SERVICE_TYPE_HIERARCHY_CATALOG = null;
	oFF.OlapApiModule.XS_PLANNING = "PLANNING";
	oFF.OlapApiModule.SERVICE_TYPE_PLANNING = null;
	oFF.OlapApiModule.s_module = null;
	oFF.OlapApiModule.getInstance = function() {
		return oFF.OlapApiModule.initVersion(oFF.XVersion.API_DEFAULT);
	};
	oFF.OlapApiModule.initVersion = function(version) {
		var timestamp;
		var registrationService;
		if (oFF.isNull(oFF.OlapApiModule.s_module)) {
			oFF.DfModule.checkInitialized(oFF.RuntimeModule
					.initVersion(version));
			timestamp = oFF.DfModule.start("OlapApiModule");
			oFF.OlapApiModule.s_module = new oFF.OlapApiModule();
			registrationService = oFF.RegistrationService.getInstance();
			oFF.OlapComponentType.staticSetupOlapType();
			oFF.ProviderInitProcedure.staticSetup();
			oFF.Operator.staticSetup();
			oFF.FormulaOperator.staticSetup();
			oFF.OlapProperty.staticSetup();
			oFF.AlertCategory.staticSetup();
			oFF.AlertLevel.staticSetup();
			oFF.AxisType.staticSetup();
			oFF.ClusterAlgorithm.staticSetup();
			oFF.JoinType.staticSetup();
			oFF.JoinCardinality.staticSetup();
			oFF.ZeroSuppressionType.staticSetup();
			oFF.DrillState.staticSetup();
			oFF.ResultSetType.staticSetup();
			oFF.DimensionType.staticSetupDimensionType();
			oFF.DimensionVisibility.staticSetup();
			oFF.ExceptionSetting.staticSetup();
			oFF.ExecutionEngine.staticSetup();
			oFF.PresentationType.staticSetupPresentation();
			oFF.PresentationSelect.staticSetup();
			oFF.InfoObjectType.staticSetupInfoObject();
			oFF.VisibilityType.staticSetupVisibility();
			oFF.InactiveCapabilities.staticSetup();
			oFF.LocalityType.staticSetupLocality();
			oFF.UsageShapeType.staticSetupUsageShapey();
			oFF.HierarchyLevelType.staticSetup();
			oFF.CurrentMemberFunction.staticSetup();
			oFF.AggregationType.staticSetup();
			oFF.ObtainabilityType.staticSetup();
			oFF.ActionChoice.staticSetup();
			oFF.TextTransformationType.staticSetup();
			oFF.QExceptionEvalType.staticSetup();
			oFF.QExceptionHeaderSettings.staticSetup();
			oFF.MemberType.staticSetupMemberType();
			oFF.QContextType.staticSetup();
			oFF.ProviderType.staticSetup();
			oFF.MetaObjectType.staticSetup();
			oFF.AssignOperator.staticSetupAssignOps();
			oFF.ComparisonOperator.staticSetupComparisonOps();
			oFF.SpatialComparisonOperator.staticSetupSpatialComparisonOps();
			oFF.LogicalBoolOperator.staticSetupLogicalOps();
			oFF.MathOperator.staticSetupMathOps();
			oFF.SetSign.staticSetup();
			oFF.ResultSetState.staticSetup();
			oFF.SingleValueCalculation.staticSetup();
			oFF.ResultCalculation.staticSetup();
			oFF.QMemberReadMode.staticSetup();
			oFF.FilterComponentType.staticSetup();
			oFF.XSortDirection.staticSetup();
			oFF.ValueException.staticSetup();
			oFF.SortType.staticSetup();
			oFF.ResultSetEncoding.staticSetup();
			oFF.ReorderingCapability.staticSetup();
			oFF.QModelLevel.staticSetup();
			oFF.DrillOperationType.staticSetup();
			oFF.QSetSignComparisonOperatorGroup.staticSetup();
			oFF.FieldLayoutType.staticSetup();
			oFF.Alignment.staticSetup();
			oFF.DisaggregationMode.staticSetup();
			oFF.QModelFormat.staticSetup(version);
			oFF.QueryFilterUsage.staticSetup();
			oFF.FieldUsageType.staticSetup();
			oFF.QueryManagerMode.staticSetup();
			oFF.QueryCloneMode.staticSetup();
			oFF.VariableMode.staticSetup();
			oFF.InputReadinessType.staticSetup();
			oFF.DataEntryProcessingType.staticSetup();
			oFF.FilterLayer.staticSetup();
			oFF.FilterScopeVariables.staticSetup();
			oFF.QueryPreparatorFactory.staticSetup();
			oFF.CustomSortPosition.staticSetup();
			oFF.VariableType.staticSetup();
			oFF.Scope.staticSetup();
			oFF.VariableVariantType.staticSetup();
			oFF.VariableProcessorState.staticSetup();
			oFF.ResultVisibility.staticSetup();
			oFF.ResultAlignment.staticSetup();
			oFF.ResultStructureElement.staticSetup();
			oFF.RestoreAction.staticSetup();
			oFF.OlapApiModule.SERVICE_TYPE_QUERY_CONSUMER = oFF.ServiceType
					.createType(oFF.OlapApiModule.XS_QUERY_CONSUMER);
			oFF.QueryServiceConfig.staticSetup();
			registrationService.addServiceConfig(
					oFF.OlapApiModule.XS_QUERY_CONSUMER,
					oFF.QueryServiceConfig.CLAZZ);
			oFF.OlapApiModule.SERVICE_TYPE_PLANNING = oFF.ServiceType
					.createType(oFF.OlapApiModule.XS_PLANNING);
			oFF.PlanningOperationType.staticSetup();
			oFF.PlanningSequenceStepType.staticSetup();
			oFF.CellLockingType.staticSetup();
			oFF.PlanningMode.staticSetup();
			oFF.PlanningVersionRestrictionType.staticSetup();
			oFF.PlanningVersionSettingsMode.staticSetup();
			oFF.PlanningContextType.staticSetup();
			oFF.PlanningCommandType.staticSetup();
			oFF.PlanningContextCommandType.staticSetup();
			oFF.PlanningModelRequestType.staticSetup();
			oFF.DataAreaRequestType.staticSetup();
			oFF.PlanningModelBehaviour.staticSetup();
			oFF.RestoreBackupType.staticSetup();
			oFF.PlanningActionType.staticSetup();
			oFF.PlanningVersionState.staticSetup();
			oFF.PlanningPrivilege.staticSetup();
			oFF.PlanningPrivilegeState.staticSetup();
			oFF.PlanningPersistenceType.staticSetup();
			oFF.CloseModeType.staticSetup();
			oFF.OlapApiModule.SERVICE_TYPE_HIERARCHY_CATALOG = oFF.ServiceType
					.createType(oFF.OlapApiModule.XS_HIERARCHY_CATALOG);
			oFF.BlendingLinkType.staticSetup();
			oFF.BlendingMappingDefinitionType.staticSetup();
			oFF.HierarchyType.staticSetup();
			oFF.UnitType.staticSetup();
			oFF.XCommandType.staticSetup();
			oFF.XCommandFollowUpType.staticSetup();
			oFF.ConditionDimensionEvaluationType.staticSetup();
			oFF.ConditionComparisonOperator.staticSetupComparisonOps();
			oFF.ReturnedDataSelection.staticSetup();
			oFF.RgCellType.staticSetup();
			oFF.ReferenceGridFactory
					.setInstance(oFF.ReferenceGridFactoryDummyImpl.create());
			oFF.ChartRendererFactory
					.setInstance(oFF.ChartRendererFactoryDummyImpl.create());
			oFF.CurrencyTranslationOperation.staticSetup();
			oFF.DfModule.stop(timestamp);
		}
		return oFF.OlapApiModule.s_module;
	};
	oFF.OlapApiModule.getInstance();
})(sap.firefly);