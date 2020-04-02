(function(oFF) {
	oFF.ApplicationFactory = {
		createDefaultApplication : function() {
			return oFF.ApplicationFactory
					.createDefaultApplicationWithVersion(0);
		},
		createDefaultApplicationWithVersion : function(version) {
			var action = oFF.ApplicationFactory.createApplicationExt(
					oFF.SyncType.BLOCKING, null, null, null, version, null,
					null, null, null, oFF.ApplicationSystemOption.AUTO);
			var data = action.getData();
			oFF.XObjectExt.release(action);
			return data;
		},
		createApplicationWithUri : function(uri) {
			return oFF.ApplicationFactory.createApplicationWithUriAndVersion(
					uri, 0);
		},
		createApplicationWithUriAndVersion : function(uri, version) {
			var sysUri = oFF.XUri.createFromUri(uri);
			var action = oFF.ApplicationFactory.createApplicationExt(
					oFF.SyncType.BLOCKING, null, null, null, version, null,
					null, sysUri, null, oFF.ApplicationSystemOption.AUTO);
			var data = action.getData();
			oFF.XObjectExt.release(action);
			return data;
		},
		createApplication : function(session) {
			var action = oFF.ApplicationFactory.createApplicationExt(
					oFF.SyncType.BLOCKING, null, null, session, 0, null, null,
					null, null, oFF.ApplicationSystemOption.AUTO);
			var data = action.getData();
			oFF.XObjectExt.release(action);
			return data;
		},
		createApplicationWithLandscapeBlocking : function(session,
				systemLandscapeUrl) {
			return oFF.ApplicationFactory
					.createApplicationWithVersionAndLandscape(session, 0,
							systemLandscapeUrl);
		},
		createApplicationWithVersionAndLandscape : function(session, version,
				systemLandscapeUrl) {
			return oFF.ApplicationFactory.createApplicationExt(
					oFF.SyncType.BLOCKING, null, null, session, version, null,
					null, null, systemLandscapeUrl,
					oFF.ApplicationSystemOption.PATH);
		},
		createApplicationWithDefaultSystem : function(session, systemType,
				systemName) {
			return oFF.ApplicationFactory
					.createApplicationWithVersionAndDefaultSystem(session, 0,
							systemType, systemName);
		},
		createApplicationWithVersionAndDefaultSystem : function(session,
				version, systemType, systemName) {
			var action = oFF.ApplicationFactory.createApplicationExt(
					oFF.SyncType.BLOCKING, null, null, session, version,
					systemType, systemName, null, null,
					oFF.ApplicationSystemOption.LOCATION_AND_TYPE);
			var data = action.getData();
			oFF.XObjectExt.release(action);
			return data;
		},
		createApplicationFull : function(session, version, systemType,
				systemName, systemUri, systemLandscapeUrl, syncType, listener) {
			return oFF.ApplicationFactory.createApplicationExt(syncType,
					listener, null, session, version, systemType, systemName,
					systemUri, systemLandscapeUrl,
					oFF.ApplicationSystemOption.AUTO);
		},
		createApplicationExt : function(syncType, listener, customIdentifier,
				session, version, systemType, systemName, systemUri,
				systemLandscapeUrl, systemOption) {
			var mySession = session;
			var application;
			var systemLandscape;
			var systemLandscapePath;
			var location;
			var uri;
			var sequence;
			var landscapeLoadAction;
			var postAction;
			if (oFF.isNull(mySession)) {
				mySession = oFF.DefaultSession.createWithVersion(version);
			}
			application = oFF.Application.create(mySession, mySession
					.getVersion());
			oFF.ApplicationFactory.addDefaultMountingPoints(application);
			systemLandscape = oFF.StandaloneSystemLandscape.create(application);
			application.setSystemLandscape(systemLandscape);
			if (oFF.isNull(systemLandscapeUrl)) {
				systemLandscapePath = mySession.getEnvironment().getVariable(
						oFF.XEnvironmentConstants.SYSTEM_LANDSCAPE_URI);
			} else {
				systemLandscapePath = systemLandscapeUrl;
			}
			location = oFF.NetworkEnv.getLocation();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(systemLandscapePath)) {
				uri = oFF.XFile.convertToUrl(session, systemLandscapePath,
						oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
				sequence = oFF.SyncActionSequence.create(application);
				landscapeLoadAction = oFF.SystemLandscapeLoadAction
						.createAndRun(oFF.SyncType.DELAYED, null, null,
								application, uri);
				sequence.addAction(landscapeLoadAction);
				postAction = oFF.ApplicationPostprocAction.createAndRun(
						oFF.SyncType.DELAYED, null, null, application,
						systemName, systemUri, systemType, location);
				sequence.setMainAction(postAction);
				sequence
						.processSyncAction(syncType, listener, customIdentifier);
				return sequence;
			}
			return oFF.ApplicationPostprocAction.createAndRun(syncType,
					listener, customIdentifier, application, systemName,
					systemUri, systemType, location);
		},
		addDefaultMountingPoints : function(application) {
			var repo = application.getRepositoryManager();
			repo.addMountPointExt(oFF.RepoMountType.FILE, "Queries",
					"$[ff_sdk]$/production/queries/");
		}
	};
	oFF.EnvironmentVariableInit = {
		staticSetup : function() {
			var networkLocation = oFF.XEnvironment.getInstance().getVariable(
					oFF.XEnvironmentConstants.NETWORK_LOCATION);
			var locationUrl;
			var locationDir;
			var networkDir;
			var tempPath;
			var cachePath;
			var resourcesPath;
			var mimesPath;
			if (oFF.isNull(networkLocation)) {
				locationUrl = oFF.NetworkEnv.getLocation();
				if (oFF.notNull(locationUrl)) {
					networkLocation = locationUrl.toString();
					if (oFF.XStringUtils.isNotNullAndNotEmpty(networkLocation)) {
						oFF.XEnvironment.getInstance().setVariable(
								oFF.XEnvironmentConstants.NETWORK_LOCATION,
								networkLocation);
					}
					locationDir = oFF.XUri.createFromUriWithParent("/",
							locationUrl, false);
					networkDir = locationDir.toString();
					if (oFF.XStringUtils.isNotNullAndNotEmpty(networkDir)) {
						oFF.XEnvironment.getInstance().setVariable(
								oFF.XEnvironmentConstants.NETWORK_DIR,
								networkDir);
					}
				}
			}
			tempPath = oFF.XEnvironment.getInstance().getVariable(
					oFF.XEnvironmentConstants.FIREFLY_TMP);
			if (oFF.isNull(tempPath)) {
				tempPath = oFF.XStringUtils.concatenate3("$[",
						oFF.XEnvironmentConstants.FIREFLY_SDK,
						"]$/production/tmp/");
				oFF.XEnvironment.getInstance().setVariable(
						oFF.XEnvironmentConstants.FIREFLY_TMP, tempPath);
			}
			cachePath = oFF.XEnvironment.getInstance().getVariable(
					oFF.XEnvironmentConstants.FIREFLY_CACHE);
			if (oFF.isNull(cachePath)) {
				cachePath = oFF.XStringUtils.concatenate3("$[",
						oFF.XEnvironmentConstants.FIREFLY_TMP, "]$/cache/");
				oFF.XEnvironment.getInstance().setVariable(
						oFF.XEnvironmentConstants.FIREFLY_CACHE, cachePath);
			}
			resourcesPath = oFF.XEnvironment.getInstance().getVariable(
					oFF.XEnvironmentConstants.FIREFLY_RESOURCES);
			if (oFF.isNull(resourcesPath)) {
				resourcesPath = oFF.XStringUtils.concatenate3("$[",
						oFF.XEnvironmentConstants.FIREFLY_SDK,
						"]$/production/resources/");
				oFF.XEnvironment.getInstance().setVariable(
						oFF.XEnvironmentConstants.FIREFLY_RESOURCES,
						resourcesPath);
			}
			mimesPath = oFF.XEnvironment.getInstance().getVariable(
					oFF.XEnvironmentConstants.FIREFLY_MIMES);
			if (oFF.isNull(mimesPath)) {
				mimesPath = oFF.XStringUtils.concatenate3("$[",
						oFF.XEnvironmentConstants.FIREFLY_SDK,
						"]$/production/resources");
				oFF.XEnvironment.getInstance().setVariable(
						oFF.XEnvironmentConstants.FIREFLY_MIMES, mimesPath);
			}
		}
	};
	oFF.QInAClientInfo = {
		exportClientInfo : function(inaStructure, clientInfo,
				supportsClientInfo) {
			var storyId;
			var hasClientContext;
			var clientIdentifier;
			var inaClientInfo;
			var inaClientContext;
			var inaBatch;
			var size;
			var i;
			var inaSubRequest;
			if (oFF.notNull(inaStructure)) {
				storyId = clientInfo.getStoryId();
				hasClientContext = oFF.XStringUtils
						.isNotNullAndNotEmpty(storyId);
				if (!supportsClientInfo && !hasClientContext) {
					return;
				}
				clientIdentifier = clientInfo.getClientIdentifier();
				if (clientInfo.getVersion() >= oFF.XVersion.V112_CLIENT_INFO_METADATA
						&& oFF.XStringUtils.isNullOrEmpty(clientIdentifier)
						&& !hasClientContext) {
					return;
				}
				inaClientInfo = inaStructure
						.putNewStructure(oFF.InAConstantsBios.QY_CLIENT_INFO);
				if (supportsClientInfo) {
					inaClientInfo.putStringNotNull(
							oFF.InAConstantsBios.QY_CLIENT_VERSION, clientInfo
									.getClientVersion());
					inaClientInfo.putStringNotNull(
							oFF.InAConstantsBios.QY_CLIENT_IDENTIFIER,
							clientIdentifier);
					inaClientInfo.putStringNotNull(
							oFF.InAConstantsBios.QY_CLIENT_COMPONENT,
							clientInfo.getClientComponent());
				}
				if (hasClientContext) {
					inaClientContext = inaClientInfo
							.putNewStructure(oFF.InAConstantsBios.QY_CLIENT_CONTEXT);
					inaClientContext.putString(
							oFF.InAConstantsBios.QY_STORY_ID, storyId);
				}
				inaBatch = inaStructure
						.getListByKey(oFF.ConnectionConstants.INA_BATCH);
				if (oFF.notNull(inaBatch)) {
					size = inaBatch.size();
					for (i = 0; i < size; i++) {
						inaSubRequest = inaBatch.getStructureAt(i);
						inaSubRequest
								.remove(oFF.InAConstantsBios.QY_CLIENT_INFO);
					}
				}
			}
		}
	};
	oFF.BatchRequestDecoratorFactory = function() {
	};
	oFF.BatchRequestDecoratorFactory.prototype = new oFF.XObject();
	oFF.BatchRequestDecoratorFactory.BATCH_REQUEST_DECORATOR_PROVIDER = "BATCH_REQUEST_DECORATOR_PROVIDER.IMPLEMENTATION";
	oFF.BatchRequestDecoratorFactory.getBatchRequestDecorator = function(
			session, requestStructure) {
		var sessionSingletons = session.getSessionSingletons();
		var factoryObject = sessionSingletons
				.getByKey(oFF.BatchRequestDecoratorFactory.BATCH_REQUEST_DECORATOR_PROVIDER);
		var factory;
		if (oFF.isNull(factoryObject)) {
			factory = new oFF.BatchRequestDecoratorFactory();
			factory.initProviders();
			sessionSingletons
					.put(
							oFF.BatchRequestDecoratorFactory.BATCH_REQUEST_DECORATOR_PROVIDER,
							factory);
		} else {
			factory = factoryObject;
		}
		return factory.getBatchRequestDecoratorInternal(requestStructure);
	};
	oFF.BatchRequestDecoratorFactory.prototype.m_providers = null;
	oFF.BatchRequestDecoratorFactory.prototype.getBatchRequestDecoratorInternal = function(
			requestStructure) {
		var result = null;
		var i;
		var provider;
		var decorator;
		for (i = 0; i < this.m_providers.size(); i++) {
			provider = this.m_providers.get(i);
			decorator = provider.getBatchRequestDecorator(requestStructure);
			if (oFF.isNull(decorator)) {
				continue;
			}
			if (oFF.notNull(result)) {
				throw oFF.XException
						.createIllegalStateException("duplicate decorator");
			}
			result = decorator;
		}
		return result;
	};
	oFF.BatchRequestDecoratorFactory.prototype.initProviders = function() {
		var registrationService;
		var clazzes;
		var i;
		var clazz;
		var provider;
		if (oFF.notNull(this.m_providers)) {
			return;
		}
		this.m_providers = oFF.XList.create();
		registrationService = oFF.RegistrationService.getInstance();
		if (oFF.notNull(registrationService)) {
			clazzes = registrationService
					.getReferences(oFF.BatchRequestDecoratorFactory.BATCH_REQUEST_DECORATOR_PROVIDER);
			if (oFF.notNull(clazzes)) {
				for (i = 0; i < clazzes.size(); i++) {
					clazz = clazzes.get(i);
					provider = clazz.newInstance(this);
					this.m_providers.add(provider);
				}
			}
		}
	};
	oFF.ConnectionConstants = {
		FAST_PATH : "FastPath",
		SAP_CLIENT : "sap-client",
		SAP_LANGUAGE : "sap-language",
		INA_CAPABILITY_SUPPORTS_BATCH : "SupportsBatch",
		INA_CAPABILITY_SUPPORTS_BATCH_RS_STREAMING : "AsyncBatchRequest",
		INA_BATCH : "Batch",
		INA_BATCH_ID : "BatchId",
		INA_BATCH_ASYNC_RESPONSE_REQUEST : "AsyncResponseRequest",
		INA_BATCH_NEXT_ASYNC_RESPONSE : "GetNextAsyncResponse",
		INA_ANALYTICS : "Analytics",
		INA_ACTIONS : "Actions",
		INA_TYPE : "Type",
		INA_DATA_SOURCE : "DataSource",
		INA_INSTANCE_ID : "InstanceId",
		INA_METADATA : "Metadata",
		INA_CUBE : "Cube",
		INA_DS_VALIDATION : "DataSourceValidation",
		INA_FASTPATH_XXL_WS : "FastPathXXLWebService"
	};
	oFF.NestedBatchRequestDecorator = function() {
	};
	oFF.NestedBatchRequestDecorator.prototype = new oFF.XObject();
	oFF.NestedBatchRequestDecorator.getBatchRequestDecorator = function(
			requestStructure) {
		var batchList;
		var requestItems;
		var i;
		var requestStructureElement;
		var decorator;
		if (oFF.isNull(requestStructure)) {
			return null;
		}
		batchList = oFF.PrUtils.getListProperty(requestStructure,
				oFF.ConnectionConstants.INA_BATCH);
		if (oFF.isNull(batchList)) {
			return null;
		}
		requestItems = oFF.XList.create();
		for (i = 0; i < batchList.size(); i++) {
			requestStructureElement = oFF.PrUtils.getStructureElement(
					batchList, i);
			oFF.XObjectExt.checkNotNull(requestStructureElement,
					"illegal nested batch syntax");
			requestItems.add(requestStructureElement);
		}
		decorator = new oFF.NestedBatchRequestDecorator();
		decorator.m_requestItems = requestItems;
		return decorator;
	};
	oFF.NestedBatchRequestDecorator.prototype.m_requestItems = null;
	oFF.NestedBatchRequestDecorator.prototype.getItemsSize = function() {
		return this.m_requestItems.size();
	};
	oFF.NestedBatchRequestDecorator.prototype.getRequestItems = function() {
		return this.m_requestItems;
	};
	oFF.NestedBatchRequestDecorator.prototype.buildResponse = function(
			responseItems) {
		var result;
		var batchList;
		var i;
		var responseStructure;
		if (responseItems.size() !== this.getItemsSize()) {
			throw oFF.XException
					.createIllegalStateException("illegal planning batch response structure");
		}
		result = oFF.PrFactory.createStructure();
		batchList = result.putNewList(oFF.ConnectionConstants.INA_BATCH);
		for (i = 0; i < responseItems.size(); i++) {
			responseStructure = responseItems.get(i);
			oFF.XObjectExt.checkNotNull(responseStructure,
					"illegal nested batch response structure");
			batchList.add(responseStructure);
		}
		return result;
	};
	oFF.NestedBatchRequestDecoratorProvider = function() {
	};
	oFF.NestedBatchRequestDecoratorProvider.prototype = new oFF.XObject();
	oFF.NestedBatchRequestDecoratorProvider.CLAZZ = null;
	oFF.NestedBatchRequestDecoratorProvider.staticSetup = function() {
		oFF.NestedBatchRequestDecoratorProvider.CLAZZ = oFF.XClass
				.create(oFF.NestedBatchRequestDecoratorProvider);
	};
	oFF.NestedBatchRequestDecoratorProvider.prototype.getBatchRequestDecorator = function(
			requestStructure) {
		return oFF.NestedBatchRequestDecorator
				.getBatchRequestDecorator(requestStructure);
	};
	oFF.ConnectionParameters = {
		ALIAS : "ALIAS",
		AUTHENTICATION_TYPE : "AUTHENTICATION_TYPE",
		AUTHENTICATION_TYPE__BASIC : "BASIC",
		AUTHENTICATION_TYPE__NONE : "NONE",
		AUTHENTICATION_TYPE__BEARER : "BEARER",
		AUTHENTICATION_TYPE__SAML_WITH_PASSWORD : "SAML_WITH_PASSWORD",
		CONTENT_TYPE : "CONTENT_TYPE",
		PROTOCOL : "PROTOCOL",
		PROTOCOL_HTTP : "HTTP",
		PROTOCOL_HTTPS : "HTTPS",
		PROTOCOL_FILE : "FILE",
		APP_PROTOCOL_CIP : "CIP",
		APP_PROTOCOL_INA : "INA",
		APP_PROTOCOL_RSR : "RSR",
		APP_PROTOCOL_INA2 : "INA2",
		APP_PROTOCOL_SQL : "SQL",
		HOST : "HOST",
		SECURE : "SECURE",
		PASSWORD : "PASSWORD",
		TOKEN_VALUE : "TOKEN_VALUE",
		PORT : "PORT",
		PATH : "PATH",
		CLIENT : "CLIENT",
		WEBDISPATCHER_URI : "WEBDISPATCHER_URI",
		PREFLIGHT : "PREFLIGHT",
		PREFIX : "PREFIX",
		PROXY_HOST : "PROXY_HOST",
		PROXY_PORT : "PROXY_PORT",
		PROXY_AUTHORIZATION : "PROXY_AUTHORIZATION",
		USER : "USER",
		SYSTEM_TYPE : "SYSTEM_TYPE",
		SYSTYPE : "SYSTYPE",
		ORIGIN : "ORIGIN",
		NAME : "NAME",
		DESCRIPTION : "DESCRIPTION",
		TIMEOUT : "TIMEOUT",
		LANGUAGE : "LANGUAGE",
		TAGS : "TAGS",
		ENABLE_TESTS : "ENABLE_TESTS",
		ENFORCE_TESTS : "ENFORCE_TESTS",
		X509CERTIFICATE : "X509CERTIFICATE",
		SECURE_LOGIN_PROFILE : "SECURE_LOGIN_PROFILE",
		SQL_DRIVER_JAVA : "SQL_DRIVER_JAVA",
		SQL_CONNECT_JAVA : "SQL_CONNECT_JAVA",
		MAPPING_SYSTEM_NAME : "MAPPING_SYSTEM_NAME",
		MAPPINGS : "MAPPINGS",
		MAPPING_SERIALIZATION_TABLE : "MAPPING_SERIALIZE_TABLE",
		MAPPING_SERIALIZATION_SCHEMA : "MAPPING_SERIALIZE_SCHEMA",
		MAPPING_DESERIALIZATION_TABLE : "MAPPING_DESERIALIZE_TABLE",
		MAPPING_DESERIALIZATION_SCHEMA : "MAPPING_DESERIALIZE_SCHEMA",
		ORGANIZATION : "ORGANIZATION",
		ELEMENT : "ELEMENT"
	};
	oFF.ServerService = {
		ANALYTIC : "Analytics",
		BWMASTERDATA : "BWMasterData",
		MASTERDATA : "Masterdata",
		MODEL_PERSISTENCY : "ModelPersistence",
		PLANNING : "Planning",
		VALUE_HELP : "ValueHelp",
		WORKSPACE : "Workspace",
		HIERARCHY_MEMBER : "HierarchyMember",
		CATALOG : "Catalog",
		INA : "InA",
		LIST_REPORTING : "ListReporting"
	};
	oFF.InAConstantsBios = {
		QY_TEXT : "Text",
		QY_TYPE : "Type",
		VA_TYPE_CLOSE : "Close",
		VA_TYPE_DATA_AREA_CMD : "DataAreaCommand",
		VA_TYPE_PLANNING_FUNCTION : "PlanningFunction",
		VA_TYPE_PLANNING_SEQUENCE : "PlanningSequence",
		VA_TYPE_STRING : "String",
		QY_NUMBER : "Number",
		QY_MESSAGE_CLASS : "MessageClass",
		QY_MESSAGES : "Messages",
		QY_MESSAGE_TYPE : "MessageType",
		VA_SEVERITY_INFO : 0,
		VA_SEVERITY_WARNING : 1,
		VA_SEVERITY_ERROR : 2,
		VA_SEVERITY_SEMANTICAL_ERROR : 3,
		QY_MEASUREMENTS : "Measurements",
		QY_OLAP_MESSAGE_CLASS : "OlapMessageClass",
		QY_GRIDS : "Grids",
		QY_PLANNING : "Planning",
		QY_PERFORMANCE_DATA : "PerformanceData",
		QY_SESSION_ID : "SessionId",
		QY_STEP_ID : "StepId",
		QY_TIMESTAMP : "Timestamp",
		QY_RUNTIME : "Runtime",
		QY_CALLS : "Calls",
		QY_DESCRIPTION : "Description",
		QY_TIME : "Time",
		QY_CLIENT_INFO : "ClientInfo",
		QY_CLIENT_COMPONENT : "Component",
		QY_CLIENT_IDENTIFIER : "Identifier",
		QY_CLIENT_VERSION : "Version",
		QY_CLIENT_CONTEXT : "Context",
		QY_STORY_ID : "StoryId",
		QY_WIDGET_ID : "WidgetId",
		PR_CAPABILITIES : "Capabilities",
		PR_CAPABILITIESDEV : "CapabilitiesDev",
		PR_SERVICES : "Services",
		PR_SERVICE : "Service",
		PR_SERVER_INFO : "ServerInfo",
		PR_SETTINGS : "Settings",
		PR_SI_REENTRANCE_TICKET : "ReentranceTicket",
		PR_SI_SERVER_TYPE : "ServerType",
		PR_SI_SYSTEM_ID : "SystemId",
		PR_SI_CLIENT : "Client",
		PR_SI_TENANT : "TenantId",
		PR_SI_USER_NAME : "userName",
		PR_SI_VERSION : "Version",
		PR_SI_BUILD_TIME : "BuildTime",
		PR_SI_LANGUAGE : "UserLanguageCode",
		PR_VALUE : "Value",
		PR_CAPABILITY : "Capability"
	};
	oFF.InAHelper = {
		importMessages : function(inaElement, messageCollector) {
			var inaStructure;
			var inaMessages;
			var inaGrids;
			var inaGrid;
			var inaPlanningElement;
			var inaPlanningList;
			var i;
			var currentInaPlanning;
			var currentInaPlanningMessages;
			var currentInaPlanningMessages2;
			var hasErrors;
			var inaPerformance;
			if (!inaElement.isStructure()) {
				return false;
			}
			inaStructure = inaElement;
			inaMessages = inaStructure
					.getListByKey(oFF.InAConstantsBios.QY_MESSAGES);
			if (oFF.isNull(inaMessages)) {
				inaGrids = inaStructure
						.getListByKey(oFF.InAConstantsBios.QY_GRIDS);
				if (oFF.notNull(inaGrids)) {
					inaGrid = inaGrids.getStructureAt(0);
					if (oFF.notNull(inaGrid)) {
						inaMessages = inaGrid
								.getListByKey(oFF.InAConstantsBios.QY_MESSAGES);
					}
				}
				if (oFF.isNull(inaMessages)) {
					inaPlanningElement = inaStructure
							.getByKey(oFF.InAConstantsBios.QY_PLANNING);
					if (oFF.notNull(inaPlanningElement)) {
						if (inaPlanningElement.isList()
								&& inaPlanningElement.size() > 0) {
							inaPlanningList = inaPlanningElement;
							for (i = 0; i < inaPlanningList.size(); i++) {
								currentInaPlanning = inaPlanningList
										.getStructureAt(i);
								if (oFF.notNull(currentInaPlanning)) {
									currentInaPlanningMessages = currentInaPlanning
											.getListByKey(oFF.InAConstantsBios.QY_MESSAGES);
									if (oFF.notNull(currentInaPlanningMessages)) {
										if (oFF.isNull(inaMessages)) {
											inaMessages = currentInaPlanningMessages;
										} else {
											inaMessages
													.addAll(currentInaPlanningMessages);
										}
									}
								}
							}
						} else {
							if (inaPlanningElement.isStructure()) {
								currentInaPlanningMessages2 = inaPlanningElement
										.getListByKey(oFF.InAConstantsBios.QY_MESSAGES);
								if (oFF.notNull(currentInaPlanningMessages2)) {
									inaMessages = currentInaPlanningMessages2;
								}
							}
						}
					}
				}
			}
			hasErrors = oFF.InAHelper.importInaMessagesInternal(inaMessages,
					messageCollector);
			inaPerformance = inaStructure
					.getStructureByKey(oFF.InAConstantsBios.QY_PERFORMANCE_DATA);
			oFF.InAHelper.importProfiling(inaPerformance, messageCollector);
			return hasErrors;
		},
		importInaMessagesInternal : function(inaMessages, messageCollector) {
			var hasErrors;
			var messageSize;
			var text;
			var i;
			var inaMessage;
			var type;
			var code;
			var message;
			var context;
			if (oFF.PrUtils.isListEmpty(inaMessages)) {
				return false;
			}
			hasErrors = false;
			messageSize = inaMessages.size();
			text = oFF.XStringBuffer.create();
			for (i = 0; i < messageSize; i++) {
				inaMessage = inaMessages.getStructureAt(i);
				text.append(inaMessage
						.getStringByKey(oFF.InAConstantsBios.QY_TEXT));
				type = inaMessage.getIntegerByKeyExt(
						oFF.InAConstantsBios.QY_TYPE, 0);
				code = inaMessage.getIntegerByKeyExt(
						oFF.InAConstantsBios.QY_NUMBER, 0);
				message = null;
				switch (type) {
				case oFF.InAConstantsBios.VA_SEVERITY_INFO:
					message = messageCollector.addInfoExt(
							oFF.OriginLayer.SERVER, code, text.toString());
					break;
				case oFF.InAConstantsBios.VA_SEVERITY_WARNING:
					message = messageCollector.addWarningExt(
							oFF.OriginLayer.SERVER, code, text.toString());
					break;
				case oFF.InAConstantsBios.VA_SEVERITY_ERROR:
					message = messageCollector
							.addErrorExt(oFF.OriginLayer.SERVER, code, text
									.toString(), null);
					hasErrors = true;
					break;
				case oFF.InAConstantsBios.VA_SEVERITY_SEMANTICAL_ERROR:
					message = messageCollector.addSemanticalError(
							oFF.OriginLayer.SERVER, code, text.toString());
					break;
				default:
					break;
				}
				if (oFF.notNull(message)) {
					message
							.setMessageClass(inaMessage
									.getStringByKey(oFF.InAConstantsBios.QY_MESSAGE_CLASS));
					message.setOlapMessageClass(inaMessage.getIntegerByKeyExt(
							oFF.InAConstantsBios.QY_OLAP_MESSAGE_CLASS, -1));
					context = oFF.PrUtils.getStructureProperty(inaMessage,
							"Context");
					if (oFF.notNull(context)) {
						message.setExtendendInfo(context);
						message
								.setExtendendInfoType(oFF.ExtendedInfoType.CONTEXT_STRUCTURE);
					}
				}
				text.clear();
			}
			oFF.XObjectExt.release(text);
			return hasErrors;
		},
		importProfiling : function(inaPerformance, messageCollector) {
			var buffer;
			var stepId;
			var engineRuntimeInSeconds;
			var engineRuntimeInMs;
			var engineRuntimeInMsLong;
			var engineProfileNode;
			var serverMeasurements;
			var size;
			var j;
			var singleMeasure;
			var calls;
			var measureText;
			var singleMeasureNode;
			if (oFF.notNull(inaPerformance)) {
				buffer = oFF.XStringBuffer.create();
				buffer
						.append("Engine (SessionId=")
						.append(
								inaPerformance
										.getStringByKey(oFF.InAConstantsBios.QY_SESSION_ID));
				stepId = inaPerformance
						.getStringByKey(oFF.InAConstantsBios.QY_STEP_ID);
				if (oFF.XStringUtils.isNotNullAndNotEmpty(stepId)) {
					buffer.append(", StepId=").append(stepId);
				}
				buffer
						.append(", Timestamp=")
						.append(
								inaPerformance
										.getStringByKey(oFF.InAConstantsBios.QY_TIMESTAMP))
						.append(")");
				engineRuntimeInSeconds = inaPerformance.getDoubleByKeyExt(
						oFF.InAConstantsBios.QY_RUNTIME, 0);
				engineRuntimeInMs = engineRuntimeInSeconds * 1000;
				engineRuntimeInMsLong = oFF.XDouble
						.convertToLong(engineRuntimeInMs);
				engineProfileNode = oFF.ProfileNode.createWithDuration(buffer
						.toString(), engineRuntimeInMsLong);
				buffer.clear();
				serverMeasurements = inaPerformance
						.getListByKey(oFF.InAConstantsBios.QY_MEASUREMENTS);
				if (oFF.notNull(serverMeasurements)) {
					size = serverMeasurements.size();
					for (j = 0; j < size; j++) {
						singleMeasure = serverMeasurements.getStructureAt(j);
						calls = singleMeasure.getIntegerByKeyExt(
								oFF.InAConstantsBios.QY_CALLS, 1);
						if (calls > 1) {
							buffer
									.append(
											singleMeasure
													.getStringByKey(oFF.InAConstantsBios.QY_DESCRIPTION))
									.append(" (").appendInt(calls).append("x)");
							measureText = buffer.toString();
							buffer.clear();
						} else {
							measureText = singleMeasure
									.getStringByKey(oFF.InAConstantsBios.QY_DESCRIPTION);
						}
						if (singleMeasure
								.containsKey(oFF.InAConstantsBios.QY_TIME)) {
							engineRuntimeInSeconds = singleMeasure
									.getDoubleByKey(oFF.InAConstantsBios.QY_TIME);
							engineRuntimeInMs = engineRuntimeInSeconds * 1000;
							engineRuntimeInMsLong = oFF.XDouble
									.convertToLong(engineRuntimeInMs);
							singleMeasureNode = oFF.ProfileNode
									.createWithDuration(measureText,
											engineRuntimeInMsLong);
							if (oFF.notNull(engineProfileNode)) {
								engineProfileNode
										.addProfileNode(singleMeasureNode);
							}
						}
					}
				}
				oFF.XObjectExt.release(buffer);
				messageCollector.detailProfileNode("### SERVER ###",
						engineProfileNode, "Network");
			}
		}
	};
	oFF.DsrConstants = {
		eyeCatcher : null,
		recordIdPassport : 567898765,
		fieldTypeByteArray : 3,
		fieldIdPassportBytes : 36,
		lenOfFieldIdField : 1,
		lenOfFieldTypeField : 1,
		lenOfStringLenField : 2,
		lenOfRecordIdField : 4,
		lenOfRecordLenField : 2,
		eyeCatcher1Len : 4,
		versionLen : 1,
		lenLen : 2,
		traceFlagLen : 2,
		systemIdLen : 32,
		serviceLen : 2,
		userIdLen : 32,
		actionLen : 40,
		actionTypeLen : 2,
		prevSystemIdLen : 32,
		transIdLen : 32,
		eyeCatcher2Len : 4,
		clientNumberLen : 3,
		systemTypeLen : 2,
		rootContextLen : 16,
		connectionIdLen : 16,
		connectionCounterLen : 4,
		varPartCountLen : 2,
		varPartOffsetLen : 2,
		netExtPassportLen : 0,
		netExtPassportVer3MinLen : 0,
		currentPassportVersion : 3,
		VARIABLE_PART_HEADER_LENGTH : 12,
		staticSetup : function() {
			oFF.DsrConstants.eyeCatcher = oFF.XByteArray.create(null, 4);
			oFF.DsrConstants.eyeCatcher.setByteAt(0, 42);
			oFF.DsrConstants.eyeCatcher.setByteAt(1, 84);
			oFF.DsrConstants.eyeCatcher.setByteAt(2, 72);
			oFF.DsrConstants.eyeCatcher.setByteAt(3, 42);
			oFF.DsrConstants.netExtPassportLen = oFF.DsrConstants.eyeCatcher1Len
					+ oFF.DsrConstants.versionLen
					+ oFF.DsrConstants.lenLen
					+ oFF.DsrConstants.traceFlagLen
					+ oFF.DsrConstants.systemIdLen
					+ oFF.DsrConstants.serviceLen
					+ oFF.DsrConstants.userIdLen
					+ oFF.DsrConstants.actionLen
					+ oFF.DsrConstants.actionTypeLen
					+ oFF.DsrConstants.prevSystemIdLen
					+ oFF.DsrConstants.transIdLen
					+ oFF.DsrConstants.eyeCatcher2Len;
			oFF.DsrConstants.netExtPassportVer3MinLen = oFF.DsrConstants.netExtPassportLen
					+ oFF.DsrConstants.clientNumberLen
					+ oFF.DsrConstants.systemTypeLen
					+ oFF.DsrConstants.rootContextLen
					+ oFF.DsrConstants.connectionIdLen
					+ oFF.DsrConstants.connectionCounterLen
					+ oFF.DsrConstants.varPartCountLen
					+ oFF.DsrConstants.varPartOffsetLen;
		}
	};
	oFF.DsrConvert = {
		int2OneByte : function(n, b, offset) {
			b.setByteAt(offset, oFF.XInteger.getNthLeastSignificantByte(n, 0));
			return;
		},
		int2TwoByte : function(n, b, offset) {
			b.setByteAt(offset, oFF.XInteger.getNthLeastSignificantByte(n, 1));
			b.setByteAt(offset + 1, oFF.XInteger.getNthLeastSignificantByte(n,
					0));
			return;
		},
		int2FourByte : function(n, b, offset) {
			b.setByteAt(offset, oFF.XInteger.getNthLeastSignificantByte(n, 3));
			b.setByteAt(offset + 1, oFF.XInteger.getNthLeastSignificantByte(n,
					2));
			b.setByteAt(offset + 2, oFF.XInteger.getNthLeastSignificantByte(n,
					1));
			b.setByteAt(offset + 3, oFF.XInteger.getNthLeastSignificantByte(n,
					0));
			return;
		},
		long2EightByte : function(n, b, offset) {
			b.setByteAt(offset, oFF.XLong.getNthLeastSignificantByte(n, 7));
			b.setByteAt(offset + 1, oFF.XLong.getNthLeastSignificantByte(n, 6));
			b.setByteAt(offset + 2, oFF.XLong.getNthLeastSignificantByte(n, 5));
			b.setByteAt(offset + 3, oFF.XLong.getNthLeastSignificantByte(n, 4));
			b.setByteAt(offset + 4, oFF.XLong.getNthLeastSignificantByte(n, 3));
			b.setByteAt(offset + 5, oFF.XLong.getNthLeastSignificantByte(n, 2));
			b.setByteAt(offset + 6, oFF.XLong.getNthLeastSignificantByte(n, 1));
			b.setByteAt(offset + 7, oFF.XLong.getNthLeastSignificantByte(n, 0));
			return;
		},
		oneByte2Int : function(b, offset) {
			var r = b.getByteAt(offset);
			if (0 > r) {
				r = r + 256;
			}
			return r;
		},
		twoByte2IntBigEndian : function(b, offset) {
			var r1 = b.getByteAt(offset + 1);
			var r2 = b.getByteAt(offset);
			if (0 > r1) {
				r1 = r1 + 256;
			}
			if (0 > r2) {
				r2 = r2 + 256;
			}
			return (r1 * 256) + r2;
		},
		twoByte2Int : function(b, offset) {
			var r1 = b.getByteAt(offset);
			var r2 = b.getByteAt(offset + 1);
			if (0 > r1) {
				r1 = r1 + 256;
			}
			if (0 > r2) {
				r2 = r2 + 256;
			}
			return (r1 * 256) + r2;
		},
		fourByte2Int : function(b, offset) {
			var s;
			var r = b.getByteAt(offset);
			var i;
			if (0 > r) {
				r = r + 256;
			}
			for (i = 1; i < 4; i++) {
				s = b.getByteAt(offset + i);
				if (0 > s) {
					s = s + 256;
				}
				r = (r * 256) + s;
			}
			return r;
		},
		eightByte2Long : function(b, offset) {
			var s;
			var r = (b.getByteAt(offset));
			var i;
			if (0 > r) {
				r = r + 256;
			}
			for (i = 1; i < 8; i++) {
				s = b.getByteAt(offset + i);
				if (0 > s) {
					s = s + 256;
				}
				r = (r * 256) + s;
			}
			return r;
		},
		byteArrayToHex : function(byteArray) {
			var hex = oFF.XStringBuffer.create();
			var i;
			var subHex;
			var subHexSize;
			if (oFF.notNull(byteArray)) {
				for (i = 0; i < byteArray.size(); i++) {
					subHex = oFF.XInteger.convertToHexString(byteArray
							.getByteAt(i));
					subHexSize = oFF.XString.size(subHex);
					if (subHexSize === 0) {
						subHex = "00";
					} else {
						if (subHexSize === 1) {
							subHex = oFF.XStringUtils.concatenate2("0", subHex);
						} else {
							if (subHexSize > 2) {
								subHex = oFF.XString.substring(subHex,
										subHexSize - 2, subHexSize);
							}
						}
					}
					hex.append(subHex);
				}
			}
			return hex.toString();
		},
		hexToByteArray : function(_hex) {
			var hex = oFF.XString.toUpperCase(_hex);
			var l = oFF.XString.size(hex);
			var len = l / 2;
			var result = oFF.XByteArray.create(null, len);
			var i;
			for (i = 0; i < len; i++) {
				result.setByteAt(i, oFF.XInteger.convertFromStringWithRadix(
						oFF.XString.substring(hex, i * 2, i * 2 + 2), 16));
			}
			return result;
		}
	};
	oFF.DsrEncodeDecode = {
		encodeBytePassport : function(passport) {
			return oFF.DsrEncodeDecode.encodeBytePassportWithConnection(
					passport, null, null, 0);
		},
		encodeBytePassportWithConnection : function(passport, connId,
				hexConnId, connCounter) {
			var i = 0;
			var position = 0;
			var temp;
			var len = oFF.DsrConstants.netExtPassportVer3MinLen;
			var res;
			var connectionCounter;
			var varPartCount;
			var varPartBytes;
			var varPartOffset;
			len = len + passport.getVarItemsLength();
			res = oFF.XByteArray.create(null, len);
			for (i = 0; i < len; i++) {
				res.setByteAt(i, 0);
			}
			oFF.XByteArray.copy(oFF.DsrConstants.eyeCatcher, 0, res, position,
					oFF.DsrConstants.eyeCatcher1Len);
			position = position + oFF.DsrConstants.eyeCatcher1Len;
			res.setByteAt(position, oFF.DsrConstants.currentPassportVersion);
			position = position + oFF.DsrConstants.versionLen;
			res.setByteAt(position, oFF.XInteger.getNthLeastSignificantByte(
					len, 1));
			res.setByteAt(position + 1, oFF.XInteger
					.getNthLeastSignificantByte(len, 0));
			position = position + oFF.DsrConstants.lenLen;
			res.setByteAt(position + 1, oFF.XInteger
					.getNthLeastSignificantByte(passport.getTraceFlag(), 1));
			res.setByteAt(position, oFF.XInteger.getNthLeastSignificantByte(
					passport.getTraceFlag(), 0));
			position = position + oFF.DsrConstants.traceFlagLen;
			position = oFF.DsrEncodeDecode
					.writeByteFromString(passport.getSystemId(), res, position,
							oFF.DsrConstants.systemIdLen);
			res.setByteAt(position, oFF.XInteger.getNthLeastSignificantByte(
					passport.getService(), 1));
			res.setByteAt(position + 1, oFF.XInteger
					.getNthLeastSignificantByte(passport.getService(), 0));
			position = position + oFF.DsrConstants.serviceLen;
			position = oFF.DsrEncodeDecode.writeByteFromString(passport
					.getUserId(), res, position, oFF.DsrConstants.userIdLen);
			position = oFF.DsrEncodeDecode.writeByteFromString(passport
					.getAction(), res, position, oFF.DsrConstants.actionLen);
			res.setByteAt(position, oFF.XInteger.getNthLeastSignificantByte(
					passport.getActionType(), 1));
			res.setByteAt(position + 1, oFF.XInteger
					.getNthLeastSignificantByte(passport.getActionType(), 0));
			position = position + oFF.DsrConstants.actionTypeLen;
			position = oFF.DsrEncodeDecode.writeByteFromString(passport
					.getPrevSystemId(), res, position,
					oFF.DsrConstants.prevSystemIdLen);
			temp = null;
			if (passport.getTransId() !== null) {
				temp = oFF.DsrConvert.hexToByteArray(passport.getTransId());
			}
			if (oFF.notNull(temp)) {
				oFF.XByteArray.copy(temp, 0, res, position, oFF.XMath.min(temp
						.size(), oFF.DsrConstants.transIdLen));
			}
			position = position + oFF.DsrConstants.transIdLen;
			position = oFF.DsrEncodeDecode.writeByteFromString(passport
					.getClientNumber(), res, position,
					oFF.DsrConstants.clientNumberLen);
			res.setByteAt(position, oFF.XInteger.getNthLeastSignificantByte(
					passport.getSystemType(), 1));
			res.setByteAt(position + 1, oFF.XInteger
					.getNthLeastSignificantByte(passport.getSystemType(), 0));
			position = position + oFF.DsrConstants.systemTypeLen;
			temp = null;
			if (passport.getRootContextId() !== null
					&& oFF.XString.size(passport.getRootContextId()) === oFF.DsrConstants.rootContextLen * 2) {
				temp = oFF.DsrConvert.hexToByteArray(passport
						.getRootContextId());
			}
			if (oFF.notNull(temp)) {
				oFF.XByteArray.copy(temp, 0, res, position, oFF.XMath.min(temp
						.size(), oFF.DsrConstants.rootContextLen));
			}
			position = position + oFF.DsrConstants.rootContextLen;
			temp = null;
			if (oFF.notNull(connId)) {
				temp = connId;
			} else {
				if (oFF.notNull(hexConnId)
						&& oFF.XString.size(hexConnId) === oFF.DsrConstants.connectionIdLen * 2) {
					temp = oFF.DsrConvert.hexToByteArray(hexConnId);
				} else {
					if (passport.getConnectionId() !== null
							&& oFF.XString.size(passport.getConnectionId()) === oFF.DsrConstants.connectionIdLen * 2) {
						temp = oFF.DsrConvert.hexToByteArray(passport
								.getConnectionId());
					}
				}
			}
			if (oFF.notNull(temp)) {
				oFF.XByteArray.copy(temp, 0, res, position, oFF.XMath.min(temp
						.size(), oFF.DsrConstants.connectionIdLen));
			}
			position = position + oFF.DsrConstants.connectionIdLen;
			connectionCounter = 0;
			if (connCounter !== 0) {
				connectionCounter = connCounter;
			} else {
				connectionCounter = passport.getConnectionCounter();
			}
			temp = oFF.XByteArray.create(null, 4);
			oFF.DsrConvert.int2FourByte(connectionCounter, temp, 0);
			if (oFF.notNull(temp)) {
				oFF.XByteArray.copy(temp, 0, res, position, oFF.XMath.min(
						oFF.DsrConstants.connectionCounterLen,
						oFF.DsrConstants.connectionCounterLen));
			}
			position = position + oFF.DsrConstants.connectionCounterLen;
			varPartCount = passport.getVarItemsCount();
			varPartBytes = oFF.DsrEncodeDecode.getBytesVarItems(passport);
			if (varPartCount !== 0 && oFF.notNull(varPartBytes)) {
				res.setByteAt(position, oFF.XInteger
						.getNthLeastSignificantByte(varPartCount, 1));
				res.setByteAt(position + 1, oFF.XInteger
						.getNthLeastSignificantByte(varPartCount, 0));
				position = position + oFF.DsrConstants.varPartCountLen;
				varPartOffset = position + oFF.DsrConstants.varPartOffsetLen;
				res.setByteAt(position, oFF.XInteger
						.getNthLeastSignificantByte(varPartOffset, 1));
				res.setByteAt(position + 1, oFF.XInteger
						.getNthLeastSignificantByte(varPartOffset, 0));
				position = position + oFF.DsrConstants.varPartOffsetLen;
				oFF.XByteArray.copy(varPartBytes, 0, res, position,
						varPartBytes.size());
				position = position + varPartBytes.size();
			} else {
				position = position + 4;
			}
			oFF.XByteArray.copy(oFF.DsrConstants.eyeCatcher, 0, res, position,
					oFF.DsrConstants.eyeCatcher1Len);
			return res;
		},
		writeByteFromString : function(data, res, position, dataLength) {
			var temp = null;
			if (oFF.notNull(data)) {
				temp = oFF.XByteArray.convertFromString(data);
			}
			if (oFF.notNull(temp)) {
				oFF.XByteArray.copy(temp, 0, res, position, oFF.XMath.min(temp
						.size(), dataLength));
			}
			return position + dataLength;
		},
		decodeBytePassport : function(newPassport, netPassport) {
			var position = 0;
			var _varPart = null;
			var _varPartCount = 0;
			var version;
			var len;
			var traceFlag;
			var size;
			var sysId;
			var service;
			var userId;
			var action;
			var actionType;
			var prevSysId;
			var rootContextId;
			var connectionId;
			var transId;
			var connectionCounter;
			var clientNumber;
			var systemType;
			var varPartOffset;
			var varPartLen;
			if (oFF.isNull(netPassport)) {
				return null;
			}
			if (netPassport.size() < 7) {
				return null;
			}
			if (0 !== oFF.DsrEncodeDecode.arrayCmp(netPassport, 0,
					oFF.DsrConstants.eyeCatcher, 0,
					oFF.DsrConstants.eyeCatcher1Len)) {
				return null;
			}
			position = position + oFF.DsrConstants.eyeCatcher1Len;
			version = netPassport.getByteAt(position);
			if (0 > version) {
				version = version + 256;
			}
			position = position + oFF.DsrConstants.versionLen;
			len = oFF.DsrConvert.twoByte2Int(netPassport, position);
			position = position + oFF.DsrConstants.lenLen;
			if (netPassport.size() !== len) {
				return null;
			}
			if (version === 2) {
				if (oFF.DsrConstants.netExtPassportLen !== len) {
					return null;
				}
			} else {
				if (version >= 3) {
					if (len < oFF.DsrConstants.netExtPassportVer3MinLen) {
						return null;
					}
				} else {
					return null;
				}
			}
			if (0 !== oFF.DsrEncodeDecode.arrayCmp(netPassport, len
					- oFF.DsrConstants.eyeCatcher2Len,
					oFF.DsrConstants.eyeCatcher, 0,
					oFF.DsrConstants.eyeCatcher2Len)) {
				return null;
			}
			traceFlag = oFF.DsrConvert.twoByte2IntBigEndian(netPassport,
					position);
			position = position + oFF.DsrConstants.traceFlagLen;
			size = oFF.DsrEncodeDecode.getZeroTerminationIndex(netPassport,
					oFF.DsrConstants.systemIdLen, position);
			sysId = oFF.XByteArray.create(null, size);
			oFF.XByteArray.copy(netPassport, position, sysId, 0, size);
			position = position + oFF.DsrConstants.systemIdLen;
			service = oFF.DsrConvert.twoByte2Int(netPassport, position);
			position = position + oFF.DsrConstants.serviceLen;
			size = oFF.DsrEncodeDecode.getZeroTerminationIndex(netPassport,
					oFF.DsrConstants.userIdLen, position);
			userId = oFF.XByteArray.create(null, size);
			oFF.XByteArray.copy(netPassport, position, userId, 0, size);
			position = position + oFF.DsrConstants.userIdLen;
			size = oFF.DsrEncodeDecode.getZeroTerminationIndex(netPassport,
					oFF.DsrConstants.actionLen, position);
			action = oFF.XByteArray.create(null, size);
			oFF.XByteArray.copy(netPassport, position, action, 0, size);
			position = position + oFF.DsrConstants.actionLen;
			actionType = oFF.DsrConvert.twoByte2Int(netPassport, position);
			position = position + oFF.DsrConstants.actionTypeLen;
			size = oFF.DsrEncodeDecode.getZeroTerminationIndex(netPassport,
					oFF.DsrConstants.prevSystemIdLen, position);
			prevSysId = oFF.XByteArray.create(null, size);
			oFF.XByteArray.copy(netPassport, position, prevSysId, 0, size);
			position = position + oFF.DsrConstants.prevSystemIdLen;
			rootContextId = null;
			connectionId = null;
			transId = null;
			connectionCounter = 0;
			clientNumber = null;
			systemType = 0;
			if (version >= 2) {
				transId = oFF.XByteArray.create(null,
						oFF.DsrConstants.transIdLen);
				oFF.XByteArray.copy(netPassport, position, transId, 0,
						oFF.DsrConstants.transIdLen);
				position = position + oFF.DsrConstants.transIdLen;
			}
			if (version >= 3) {
				clientNumber = oFF.XByteArray.create(null,
						oFF.DsrConstants.clientNumberLen);
				oFF.XByteArray.copy(netPassport, position, clientNumber, 0,
						oFF.DsrConstants.clientNumberLen);
				position = position + oFF.DsrConstants.clientNumberLen;
				systemType = oFF.DsrConvert.twoByte2Int(netPassport, position);
				position = position + oFF.DsrConstants.systemTypeLen;
				rootContextId = oFF.XByteArray.create(null,
						oFF.DsrConstants.rootContextLen);
				oFF.XByteArray.copy(netPassport, position, rootContextId, 0,
						oFF.DsrConstants.rootContextLen);
				position = position + oFF.DsrConstants.rootContextLen;
				connectionId = oFF.XByteArray.create(null,
						oFF.DsrConstants.connectionIdLen);
				oFF.XByteArray.copy(netPassport, position, connectionId, 0,
						oFF.DsrConstants.connectionIdLen);
				position = position + oFF.DsrConstants.connectionIdLen;
				connectionCounter = oFF.DsrConvert.fourByte2Int(netPassport,
						position);
				position = position + oFF.DsrConstants.connectionCounterLen;
				_varPartCount = oFF.DsrConvert.twoByte2Int(netPassport,
						position);
				position = position + oFF.DsrConstants.varPartCountLen;
				if (_varPartCount !== 0) {
					varPartOffset = oFF.DsrConvert.twoByte2Int(netPassport,
							position);
					position = position + oFF.DsrConstants.varPartOffsetLen;
					if (varPartOffset === position) {
						varPartLen = netPassport.size() - position
								- oFF.DsrConstants.eyeCatcher2Len;
						if (varPartLen > 0) {
							_varPart = oFF.XByteArray.create(null, varPartLen);
							oFF.XByteArray.copy(netPassport, position,
									_varPart, 0, varPartLen);
						}
					}
				}
			}
			newPassport.setVersion(version);
			newPassport.setTraceFlag(traceFlag);
			newPassport.setSystemId(oFF.XByteArray.convertToString(sysId));
			newPassport.setServiceType(service);
			newPassport.setUserId(oFF.XByteArray.convertToString(userId));
			newPassport.setAction(oFF.XByteArray.convertToString(action));
			newPassport.setActionType(actionType);
			newPassport.setPrevSystemId(oFF.XByteArray
					.convertToString(prevSysId));
			newPassport.setTransId(oFF.DsrConvert.byteArrayToHex(transId));
			newPassport.setClientNumber(oFF.XByteArray
					.convertToString(clientNumber));
			newPassport.setSystemType(systemType);
			newPassport.setRootContextId(oFF.DsrConvert
					.byteArrayToHex(rootContextId));
			newPassport.setConnectionId(oFF.DsrConvert
					.byteArrayToHex(connectionId));
			newPassport.setConnectionCounter(connectionCounter);
			if (oFF.notNull(_varPart) && _varPartCount !== 0) {
				oFF.DsrEncodeDecode.readVarItems(newPassport, _varPartCount,
						_varPart);
			}
			return newPassport;
		},
		getZeroTerminationIndex : function(myByteArray, dataLength, position) {
			var temp;
			for (temp = dataLength - 1; temp >= 0; temp--) {
				if (0 !== myByteArray.getByteAt(position + temp)) {
					break;
				}
			}
			return temp + 1;
		},
		getBytesVarItems : function(pass) {
			var tempVar;
			var tempArr;
			var position = 0;
			var allBytes = oFF.XByteArray
					.create(null, pass.getVarItemsLength());
			var i;
			if (pass.getSystemVariablePartItems().size() > 0) {
				oFF.XByteArray.copy(oFF.DsrConstants.eyeCatcher, 0, allBytes,
						position, oFF.DsrConstants.eyeCatcher1Len);
				position = position + oFF.DsrConstants.eyeCatcher1Len;
				allBytes.setByteAt(position, 1);
				position = position + oFF.DsrConstants.versionLen;
				oFF.DsrConvert.int2TwoByte(pass.getSysVarItemsLength()
						+ oFF.DsrConstants.VARIABLE_PART_HEADER_LENGTH,
						allBytes, position);
				position = position + oFF.DsrConstants.lenLen;
				if (pass.getApplicationVariablePartItems().size() > 0) {
					allBytes.setByteAt(position, 0);
				} else {
					allBytes.setByteAt(position, 1);
				}
				position = position + 1;
				oFF.DsrConvert.int2TwoByte(1, allBytes, position);
				position = position + oFF.DsrConstants.lenLen;
				oFF.DsrConvert.int2TwoByte(pass.getSystemVariablePartItems()
						.size(), allBytes, position);
				position = position + oFF.DsrConstants.lenLen;
				for (i = 0; i < pass.getSystemVariablePartItems().size(); i++) {
					tempVar = pass.getSystemVariablePartItems().get(i);
					tempArr = tempVar.getByteArray();
					oFF.XByteArray.copy(tempArr, 0, allBytes, position, tempArr
							.size());
					position = position + tempArr.size();
				}
			}
			if (pass.getApplicationVariablePartItems().size() > 0) {
				oFF.XByteArray.copy(oFF.DsrConstants.eyeCatcher, 0, allBytes,
						position, oFF.DsrConstants.eyeCatcher1Len);
				position = position + oFF.DsrConstants.eyeCatcher1Len;
				allBytes.setByteAt(position, 1);
				position = position + oFF.DsrConstants.versionLen;
				oFF.DsrConvert.int2TwoByte(pass.getAppVarItemsLength()
						+ oFF.DsrConstants.VARIABLE_PART_HEADER_LENGTH,
						allBytes, position);
				position = position + oFF.DsrConstants.lenLen;
				allBytes.setByteAt(position, 1);
				position = position + 1;
				oFF.DsrConvert.int2TwoByte(2, allBytes, position);
				position = position + oFF.DsrConstants.lenLen;
				oFF.DsrConvert.int2TwoByte(pass
						.getApplicationVariablePartItems().size(), allBytes,
						position);
				position = position + oFF.DsrConstants.lenLen;
				for (i = 0; i < pass.getApplicationVariablePartItems().size(); i++) {
					tempVar = pass.getApplicationVariablePartItems().get(i);
					tempArr = tempVar.getByteArray();
					oFF.XByteArray.copy(tempArr, 0, allBytes, position, tempArr
							.size());
					position = position + tempArr.size();
				}
			}
			return allBytes;
		},
		readVarItems : function(pass, number, bytes) {
			var position = 0;
			var i;
			var varPartID;
			var itemsCount;
			var j;
			var applId;
			var applKey;
			var type;
			var lengthVar;
			var bValue;
			var iValue;
			for (i = 0; i < number; i++) {
				if (0 !== oFF.DsrEncodeDecode.arrayCmp(bytes, position,
						oFF.DsrConstants.eyeCatcher, 0,
						oFF.DsrConstants.eyeCatcher1Len)) {
					throw oFF.XException
							.createRuntimeException("Parsing variable part of the passport faild. Eyecatcher is not correct!");
				}
				position = position + oFF.DsrConstants.eyeCatcher1Len;
				position = position + oFF.DsrConstants.versionLen;
				position = position + oFF.DsrConstants.lenLen;
				position = position + 1;
				varPartID = oFF.DsrConvert.twoByte2Int(bytes, position);
				position = position + 2;
				itemsCount = oFF.DsrConvert.twoByte2Int(bytes, position);
				position = position + 2;
				for (j = 0; j < itemsCount; j++) {
					applId = oFF.DsrConvert.twoByte2Int(bytes, position);
					position = position + 2;
					applKey = oFF.DsrConvert.twoByte2Int(bytes, position);
					position = position + 2;
					type = oFF.DsrConvert.oneByte2Int(bytes, position);
					position = position + 1;
					lengthVar = oFF.DsrConvert.twoByte2Int(bytes, position);
					position = position + 2;
					bValue = oFF.XByteArray.create(null, lengthVar - 7);
					oFF.XByteArray.copy(bytes, position, bValue, 0,
							lengthVar - 7);
					position = position + (lengthVar - 7);
					if (type === oFF.DsrtApplVarPart.INTEGER_TYPE) {
						iValue = oFF.DsrConvert.fourByte2Int(bValue, 0);
						if (varPartID === oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM) {
							pass.addSystemVarItemInteger(applId, applKey,
									iValue);
						} else {
							pass.addVarItemInteger(applId, applKey, iValue);
						}
					} else {
						if (type === oFF.DsrtApplVarPart.STRING_TYPE) {
							if (varPartID === oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM) {
								pass.addSystemVarItemString(applId, applKey,
										oFF.XByteArray.convertToString(bValue));
							} else {
								pass.addVarItemString(applId, applKey,
										oFF.XByteArray.convertToString(bValue));
							}
						} else {
							if (type === oFF.DsrtApplVarPart.GUID_TYPE) {
								if (varPartID === oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM) {
									pass.addSystemVarItemGUID(applId, applKey,
											bValue);
								} else {
									pass
											.addVarItemGUID(applId, applKey,
													bValue);
								}
							} else {
								if (type === oFF.DsrtApplVarPart.BYTE_TYPE) {
									if (varPartID === oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM) {
										pass.addSystemVarItemBytes(applId,
												applKey, bValue);
									} else {
										pass.addVarItemBytes(applId, applKey,
												bValue);
									}
								}
							}
						}
					}
				}
			}
		},
		arrayCmp : function(a1, startPositionA, a2, startPositionB,
				numberOfBytesToCompare) {
			var i;
			for (i = 0; i < numberOfBytesToCompare; i++) {
				if (a1.getByteAt(startPositionA + i) !== a2
						.getByteAt(startPositionB + i)) {
					return a1.getByteAt(startPositionA + i)
							- a2.getByteAt(startPositionB + i);
				}
			}
			return 0;
		}
	};
	oFF.DsrPassportFactory = {
		createDsrPassport : function() {
			var passport = new oFF.DsrPassport();
			passport.initialize();
			return passport;
		}
	};
	oFF.DsrtApplVarPart = function() {
	};
	oFF.DsrtApplVarPart.prototype = new oFF.XObject();
	oFF.DsrtApplVarPart.BYTE_TYPE = 1;
	oFF.DsrtApplVarPart.INTEGER_TYPE = 2;
	oFF.DsrtApplVarPart.GUID_TYPE = 3;
	oFF.DsrtApplVarPart.STRING_TYPE = 4;
	oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM = 1;
	oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_APPLICATION = 2;
	oFF.DsrtApplVarPart.createByByteArray = function(applId, applKey, bValue) {
		var newInstance = new oFF.DsrtApplVarPart();
		newInstance.m_applId = applId;
		newInstance.m_applKey = applKey;
		newInstance.m_type = oFF.DsrtApplVarPart.BYTE_TYPE;
		newInstance.m_byteValue = bValue;
		newInstance.setByteArrayLength(newInstance.m_byteValue);
		newInstance.m_varPartType = oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_APPLICATION;
		return newInstance;
	};
	oFF.DsrtApplVarPart.createByIntValue = function(applId, applKey, iValue) {
		var newInstance = new oFF.DsrtApplVarPart();
		newInstance.m_applId = applId;
		newInstance.m_applKey = applKey;
		newInstance.m_type = oFF.DsrtApplVarPart.INTEGER_TYPE;
		newInstance.m_intValue = iValue;
		newInstance.setIntegerLength(newInstance.m_intValue);
		newInstance.m_varPartType = oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_APPLICATION;
		return newInstance;
	};
	oFF.DsrtApplVarPart.createByStringValue = function(applId, applKey, sValue) {
		var newInstance = new oFF.DsrtApplVarPart();
		newInstance.m_applId = applId;
		newInstance.m_applKey = applKey;
		newInstance.m_type = oFF.DsrtApplVarPart.STRING_TYPE;
		newInstance.m_strValue = sValue;
		newInstance.setStringLength(newInstance.m_strValue);
		newInstance.m_varPartType = oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_APPLICATION;
		return newInstance;
	};
	oFF.DsrtApplVarPart.prototype.m_applId = 0;
	oFF.DsrtApplVarPart.prototype.m_applKey = 0;
	oFF.DsrtApplVarPart.prototype.m_type = 0;
	oFF.DsrtApplVarPart.prototype.m_length = 0;
	oFF.DsrtApplVarPart.prototype.m_byteValue = null;
	oFF.DsrtApplVarPart.prototype.m_intValue = 0;
	oFF.DsrtApplVarPart.prototype.m_strValue = "";
	oFF.DsrtApplVarPart.prototype.m_varPartType = 0;
	oFF.DsrtApplVarPart.prototype.getByteArray = function() {
		var offset = 0;
		var byteArray = oFF.XByteArray.create(null, this.m_length);
		var strBytes;
		oFF.DsrConvert.int2TwoByte(this.m_applId, byteArray, offset);
		offset = offset + 2;
		oFF.DsrConvert.int2TwoByte(this.m_applKey, byteArray, offset);
		offset = offset + 2;
		oFF.DsrConvert.int2OneByte(this.m_type, byteArray, offset);
		offset = offset + 1;
		oFF.DsrConvert.int2TwoByte(this.m_length, byteArray, offset);
		offset = offset + 2;
		if (this.m_type === oFF.DsrtApplVarPart.BYTE_TYPE
				|| this.m_type === oFF.DsrtApplVarPart.GUID_TYPE) {
			oFF.XByteArray.copy(this.m_byteValue, 0, byteArray, offset,
					this.m_byteValue.size());
		} else {
			if (this.m_type === oFF.DsrtApplVarPart.STRING_TYPE) {
				strBytes = oFF.XByteArray.convertFromString(this.m_strValue);
				oFF.XByteArray.copy(strBytes, 0, byteArray, offset, strBytes
						.size());
			} else {
				if (this.m_type === oFF.DsrtApplVarPart.INTEGER_TYPE) {
					oFF.DsrConvert.int2FourByte(this.m_intValue, byteArray,
							offset);
				}
			}
		}
		return byteArray;
	};
	oFF.DsrtApplVarPart.prototype.getApplId = function() {
		return this.m_applId;
	};
	oFF.DsrtApplVarPart.prototype.getKey = function() {
		return this.m_applKey;
	};
	oFF.DsrtApplVarPart.prototype.getVarPartValueType = function() {
		return this.m_type;
	};
	oFF.DsrtApplVarPart.prototype.getLength = function() {
		return this.m_length;
	};
	oFF.DsrtApplVarPart.prototype.getBytes = function() {
		return this.m_byteValue;
	};
	oFF.DsrtApplVarPart.prototype.getIntValue = function() {
		return this.m_intValue;
	};
	oFF.DsrtApplVarPart.prototype.getStrValue = function() {
		return this.m_strValue;
	};
	oFF.DsrtApplVarPart.prototype.setApplId = function(applId) {
		this.m_applId = applId;
	};
	oFF.DsrtApplVarPart.prototype.setKey = function(applKey) {
		this.m_applKey = applKey;
	};
	oFF.DsrtApplVarPart.prototype.setVarPartValueType = function(type) {
		this.m_type = type;
	};
	oFF.DsrtApplVarPart.prototype.setByteArrayLength = function(bValue) {
		this.m_length = 7 + bValue.size();
	};
	oFF.DsrtApplVarPart.prototype.setIntegerLength = function(iValue) {
		this.m_length = 11;
	};
	oFF.DsrtApplVarPart.prototype.setStringLength = function(strValue) {
		if (oFF.isNull(strValue)) {
			return;
		}
		this.m_length = 7 + oFF.XByteArray.convertFromString(strValue).size();
	};
	oFF.DsrtApplVarPart.prototype.setByteValue = function(bValue) {
		this.m_byteValue = bValue;
	};
	oFF.DsrtApplVarPart.prototype.setIntValue = function(intValue) {
		this.m_intValue = intValue;
	};
	oFF.DsrtApplVarPart.prototype.setStrValue = function(strValue) {
		this.m_strValue = strValue;
	};
	oFF.DsrtApplVarPart.prototype.getVarPartType = function() {
		return this.m_varPartType;
	};
	oFF.DsrtApplVarPart.prototype.setVarPartType = function(varPartType) {
		this.m_varPartType = varPartType;
	};
	oFF.OlapEnvironmentFactory = function() {
	};
	oFF.OlapEnvironmentFactory.prototype = new oFF.XObject();
	oFF.OlapEnvironmentFactory.s_olapEnvironmentFactory = null;
	oFF.OlapEnvironmentFactory.staticSetup = function() {
		var defaultFactory = new oFF.OlapEnvironmentFactory();
		oFF.OlapEnvironmentFactory.registerFactory(defaultFactory);
	};
	oFF.OlapEnvironmentFactory.newInstance = function(application) {
		return oFF.OlapEnvironmentFactory.s_olapEnvironmentFactory
				.newOlapEnvironmentInstance(application);
	};
	oFF.OlapEnvironmentFactory.registerFactory = function(jsonParserFactory) {
		oFF.OlapEnvironmentFactory.s_olapEnvironmentFactory = jsonParserFactory;
	};
	oFF.OlapEnvironmentFactory.prototype.newOlapEnvironmentInstance = function(
			application) {
		return null;
	};
	oFF.CacheProvider = function() {
	};
	oFF.CacheProvider.prototype = new oFF.XObject();
	oFF.CacheProvider.create = function(directory) {
		var newObj = new oFF.CacheProvider();
		newObj.m_directory = directory;
		return newObj;
	};
	oFF.CacheProvider.prototype.m_directory = null;
	oFF.CacheProvider.prototype.writeElementToCache = function(cacheNamespace,
			cacheId, element) {
		var file;
		var cache;
		var ba;
		if (oFF.notNull(element)) {
			file = this.createFile(cacheNamespace, cacheId, ".json", true);
			if (oFF.notNull(file)) {
				cache = element.getStringRepresentation();
				ba = oFF.XByteArray.convertFromString(cache);
				file.save(ba);
			}
		}
	};
	oFF.CacheProvider.prototype.readElementFromCache = function(cacheNamespace,
			cacheId) {
		var file = this.createFile(cacheNamespace, cacheId, ".json", false);
		var content;
		if (oFF.isNull(file) || !file.isExisting() || !file.isFile()) {
			return null;
		}
		content = file.loadExt();
		return content.getJsonContent();
	};
	oFF.CacheProvider.prototype.writeStringToCache = function(cacheNamespace,
			cacheId, strValue) {
		var file;
		var ba;
		if (oFF.notNull(strValue)) {
			file = this.createFile(cacheNamespace, cacheId, ".txt", true);
			if (oFF.notNull(file)) {
				ba = oFF.XByteArray.convertFromString(strValue);
				file.save(ba);
			}
		}
	};
	oFF.CacheProvider.prototype.readStringFromCache = function(cacheNamespace,
			cacheId) {
		var file = this.createFile(cacheNamespace, cacheId, ".txt", false);
		var content;
		if (oFF.isNull(file) || !file.isExisting() || !file.isFile()) {
			return null;
		}
		content = file.loadExt();
		return content.getString();
	};
	oFF.CacheProvider.prototype.clearCache = function(cacheNamespace) {
		var targetFolder;
		if (oFF.notNull(this.m_directory)) {
			if (oFF.isNull(cacheNamespace)) {
				targetFolder = this.m_directory;
			} else {
				targetFolder = this.m_directory.createChild(cacheNamespace);
			}
			targetFolder.deleteRecursive();
		}
	};
	oFF.CacheProvider.prototype.createFile = function(cacheNamespace, cacheId,
			fileExt, prepareForWrite) {
		var parentFolder;
		var fileExtension;
		var file;
		if (oFF.isNull(this.m_directory) || oFF.isNull(cacheId)
				|| this.m_directory.getFileSystemType() === null) {
			return null;
		}
		if (oFF.isNull(cacheNamespace)) {
			parentFolder = this.m_directory;
		} else {
			parentFolder = this.m_directory.createChild(cacheNamespace);
		}
		if (prepareForWrite) {
			parentFolder.mkdirs();
		}
		fileExtension = fileExt;
		if (oFF.isNull(fileExtension)) {
			fileExtension = ".json";
		}
		file = parentFolder.createChild(oFF.XStringUtils.concatenate3("ffc_",
				cacheId, fileExtension));
		if (prepareForWrite && file.isExisting()) {
			file.deleteFile();
		}
		return file;
	};
	oFF.ServiceTypeInfo = function() {
	};
	oFF.ServiceTypeInfo.prototype = new oFF.XObject();
	oFF.ServiceTypeInfo.prototype.createServiceConfigInternal = function(
			application) {
		var serviceConfigReferenceName = this.getServiceConfigReferenceName();
		var regService = oFF.RegistrationService.getInstance();
		var references = regService.getReferences(serviceConfigReferenceName);
		var registeredClass;
		var serviceConfig;
		if (references.size() === 1) {
			registeredClass = references.get(0);
			serviceConfig = registeredClass.newInstance(application);
			serviceConfig.setServiceTypeInfo(this);
			serviceConfig.setupConfig(application);
			return serviceConfig;
		}
		throw oFF.XException
				.createIllegalStateException("more than one reference for service config");
	};
	oFF.CredentialsFactory = function() {
	};
	oFF.CredentialsFactory.prototype = new oFF.XObject();
	oFF.CredentialsFactory.s_factory = null;
	oFF.CredentialsFactory.create = function(runtimeUserManager) {
		if (oFF.notNull(oFF.CredentialsFactory.s_factory)) {
			return oFF.CredentialsFactory.s_factory
					.newCredentialsProvider(runtimeUserManager);
		}
		return null;
	};
	oFF.CredentialsFactory.registerFactory = function(factory) {
		oFF.CredentialsFactory.s_factory = factory;
	};
	oFF.NopUsageTracker = function() {
	};
	oFF.NopUsageTracker.prototype = new oFF.XObject();
	oFF.NopUsageTracker.prototype.trackUsage = function(actionId, parameters,
			session) {
	};
	oFF.NopUsageTracker.prototype.track = function(event) {
	};
	oFF.NopUsageTracker.prototype.isEnabled = function() {
		return false;
	};
	oFF.UsageTrackerProvider = {
		instance : null,
		getUsageTracker : function() {
			if (oFF.isNull(oFF.UsageTrackerProvider.instance)) {
				oFF.UsageTrackerProvider.instance = new oFF.NopUsageTracker();
			}
			return oFF.UsageTrackerProvider.instance;
		},
		setUsageTracker : function(instance) {
			oFF.UsageTrackerProvider.instance = instance;
		}
	};
	oFF.BatchRequestManager = function() {
	};
	oFF.BatchRequestManager.prototype = new oFF.XObject();
	oFF.BatchRequestManager.CONSTANT_ID = null;
	oFF.BatchRequestManager.create = function(session) {
		var batchRequestManager = new oFF.BatchRequestManager();
		batchRequestManager.m_session = session;
		batchRequestManager.m_batchFunctions = oFF.XList.create();
		batchRequestManager.m_microCubeNames = oFF.XHashSetOfString.create();
		return batchRequestManager;
	};
	oFF.BatchRequestManager.prototype.m_session = null;
	oFF.BatchRequestManager.prototype.m_batchFunctions = null;
	oFF.BatchRequestManager.prototype.m_batchFunctionsIdMapping = null;
	oFF.BatchRequestManager.prototype.m_streamingGuid = null;
	oFF.BatchRequestManager.prototype.m_functionFactory = null;
	oFF.BatchRequestManager.prototype.m_batchModePath = null;
	oFF.BatchRequestManager.prototype.m_syncType = null;
	oFF.BatchRequestManager.prototype.m_microCubeNames = null;
	oFF.BatchRequestManager.prototype.releaseObject = function() {
		oFF.XObject.prototype.releaseObject.call(this);
		this.m_session = null;
		this.m_batchFunctions = null;
		this.m_batchFunctionsIdMapping = null;
		this.m_streamingGuid = null;
		this.m_functionFactory = null;
		this.m_batchModePath = null;
		this.m_syncType = null;
		this.m_microCubeNames = oFF.XObjectExt.release(this.m_microCubeNames);
	};
	oFF.BatchRequestManager.prototype.getBatchFunctions = function() {
		return this.m_batchFunctions;
	};
	oFF.BatchRequestManager.prototype.addBatchFunction = function(_function) {
		this.m_batchFunctions.add(_function);
	};
	oFF.BatchRequestManager.prototype.getMicroCubesNames = function() {
		return this.m_microCubeNames;
	};
	oFF.BatchRequestManager.prototype.addMicroCubeName = function(name) {
		this.m_microCubeNames.add(name);
	};
	oFF.BatchRequestManager.prototype.isRsStreamingEnabled = function() {
		return oFF.notNull(this.m_streamingGuid);
	};
	oFF.BatchRequestManager.prototype.executeBatch = function(syncType,
			functionFactory, batchModePath, enableRsStreaming) {
		var batchStructure;
		var requestList;
		var isStreamingFeasible;
		var asyncResponseRequest;
		var _function;
		var request;
		this.removeExecutedFunctions();
		if (!oFF.XCollectionUtils.hasElements(this.m_batchFunctions)) {
			return;
		}
		this.m_syncType = syncType;
		this.m_functionFactory = functionFactory;
		this.m_batchModePath = batchModePath;
		batchStructure = oFF.PrFactory.createStructure();
		requestList = batchStructure
				.putNewList(oFF.ConnectionConstants.INA_BATCH);
		isStreamingFeasible = this.addQueriesToRequestList(requestList);
		oFF.QInAClientInfo
				.exportClientInfo(
						batchStructure,
						this.m_functionFactory.getApplication(),
						functionFactory
								.supportsAnalyticCapability(oFF.InAConstantsBios.QY_CLIENT_INFO));
		if (enableRsStreaming && isStreamingFeasible) {
			this.m_streamingGuid = this.createGuid(null);
			this.ensureUniqueInstanceIds();
			asyncResponseRequest = batchStructure
					.putNewStructure(oFF.ConnectionConstants.INA_BATCH_ASYNC_RESPONSE_REQUEST);
			asyncResponseRequest.putString(
					oFF.ConnectionConstants.INA_BATCH_ID, this.m_streamingGuid);
		}
		_function = functionFactory
				.newRpcFunctionInternal(batchModePath, false);
		request = _function.getRequest();
		request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
		request.setAcceptContentType(oFF.ContentType.APPLICATION_JSON);
		request.setRequestStructure(batchStructure);
		_function.processFunctionExecution(syncType, this, null);
		oFF.XObjectExt.release(batchStructure);
	};
	oFF.BatchRequestManager.prototype.removeExecutedFunctions = function() {
		var i = 0;
		var rpcBatchFunction;
		var requestStructure;
		while (i < this.m_batchFunctions.size()) {
			rpcBatchFunction = this.m_batchFunctions.get(i);
			requestStructure = rpcBatchFunction.getRequest()
					.getRequestStructure();
			if (rpcBatchFunction.getSyncState() !== oFF.SyncState.PROCESSING
					|| requestStructure.isReleased()) {
				this.m_batchFunctions.removeAt(i);
				continue;
			}
			i++;
		}
	};
	oFF.BatchRequestManager.prototype.addQueriesToRequestList = function(
			requestList) {
		var batchSize = this.m_batchFunctions.size();
		var isStreamingFeasible = batchSize > 1;
		var i;
		var rpcBatchFunction;
		var request;
		var requestStructure;
		var decorator;
		var requestStructureFlat;
		var flatIndex;
		for (i = 0; i < batchSize; i++) {
			rpcBatchFunction = this.m_batchFunctions.get(i);
			request = rpcBatchFunction.getRequest();
			requestStructure = request.getRequestStructure();
			decorator = oFF.BatchRequestDecoratorFactory
					.getBatchRequestDecorator(this.m_session, requestStructure);
			if (oFF.isNull(decorator)) {
				requestList.add(requestStructure);
				if (this.getInstanceId(requestStructure) === null) {
					isStreamingFeasible = false;
				}
			} else {
				isStreamingFeasible = false;
				rpcBatchFunction.setDecorator(decorator);
				requestStructureFlat = decorator.getRequestItems();
				if (oFF.notNull(requestStructureFlat)) {
					for (flatIndex = 0; flatIndex < requestStructureFlat.size(); flatIndex++) {
						requestList.add(requestStructureFlat.get(flatIndex));
					}
				}
			}
		}
		return isStreamingFeasible;
	};
	oFF.BatchRequestManager.prototype.executeNextStreamingRequest = function() {
		var batchStructure = oFF.PrFactory.createStructure();
		var analytics = batchStructure
				.putNewStructure(oFF.ConnectionConstants.INA_ANALYTICS);
		var actions = analytics.putNewList(oFF.ConnectionConstants.INA_ACTIONS);
		var structure = actions.addNewStructure();
		var _function;
		var request;
		structure.putString(oFF.ConnectionConstants.INA_TYPE,
				oFF.ConnectionConstants.INA_BATCH_NEXT_ASYNC_RESPONSE);
		structure.putString(oFF.ConnectionConstants.INA_BATCH_ID,
				this.m_streamingGuid);
		_function = this.m_functionFactory.newRpcFunctionInternal(
				this.m_batchModePath, false);
		request = _function.getRequest();
		request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
		request.setAcceptContentType(oFF.ContentType.APPLICATION_JSON);
		request.setRequestStructure(batchStructure);
		_function.processFunctionExecution(this.m_syncType, this, null);
		oFF.XObjectExt.release(batchStructure);
	};
	oFF.BatchRequestManager.prototype.onFunctionExecuted = function(extResult,
			response, customIdentifier) {
		var executedFunctionsResult;
		var executedFunctions;
		oFF.XBooleanUtils.checkFalse(this.m_batchFunctions.isReleased(),
				"Fatal error: Batch functions object is not valid anymore");
		executedFunctionsResult = this
				.updateResponsesInBatchFunctions(extResult);
		executedFunctions = executedFunctionsResult.getData();
		this.endFunctions(executedFunctions, extResult);
		this.removeExecutedFunctions();
		if (this.isRsStreamingEnabled() && this.m_batchFunctions.hasElements()) {
			if (extResult.isValid() && executedFunctionsResult.isValid()) {
				this.executeNextStreamingRequest();
			} else {
				this.endFunctions(this.m_batchFunctions, extResult);
				oFF.XObjectExt.release(this);
			}
		} else {
			oFF.XObjectExt.release(this);
		}
		oFF.XObjectExt.release(executedFunctions);
	};
	oFF.BatchRequestManager.prototype.endFunctions = function(
			executedFunctions, extResult) {
		var size = executedFunctions.size();
		var i;
		var _function;
		for (i = 0; i < size; i++) {
			_function = executedFunctions.get(i);
			_function.addAllMessages(extResult);
			_function.endSync();
		}
	};
	oFF.BatchRequestManager.prototype.updateResponsesInBatchFunctions = function(
			extResult) {
		var response;
		var rootElement;
		var batchList;
		if (extResult.isValid()) {
			response = extResult.getData();
			rootElement = response.getRootElement();
			batchList = rootElement
					.getListByKey(oFF.ConnectionConstants.INA_BATCH);
			if (this.isRsStreamingEnabled()) {
				return this.updateRespondedBatchFunctions(batchList,
						rootElement);
			}
			this.updateAllBatchFunctions(batchList, rootElement);
		}
		return oFF.ExtResult.create(this.m_batchFunctions, null);
	};
	oFF.BatchRequestManager.prototype.updateAllBatchFunctions = function(
			batchList, rootElement) {
		var batchFunctionSize = this.m_batchFunctions.size();
		var flattenOffset;
		var k;
		var batchFunction;
		var batchFunctionResponse;
		var decorator;
		var batchRootElement;
		var flatSize;
		var responseStructureFlat;
		var flatIndex;
		var batchRootElementFlat;
		var responseStructureDeep;
		var i;
		if (oFF.notNull(batchList)) {
			flattenOffset = 0;
			for (k = 0; k < batchFunctionSize; k++) {
				batchFunction = this.m_batchFunctions.get(k);
				batchFunctionResponse = batchFunction.getResponse();
				decorator = batchFunction.getDecorator();
				if (oFF.isNull(decorator)) {
					batchRootElement = batchList.getStructureAt(flattenOffset);
					batchFunctionResponse
							.setRootElement(batchRootElement, null);
					flattenOffset++;
				} else {
					flatSize = decorator.getItemsSize();
					responseStructureFlat = oFF.XList.create();
					for (flatIndex = 0; flatIndex < flatSize; flatIndex++) {
						batchRootElementFlat = batchList
								.getStructureAt(flattenOffset + flatIndex);
						responseStructureFlat.add(batchRootElementFlat);
					}
					responseStructureDeep = decorator
							.buildResponse(responseStructureFlat);
					batchFunctionResponse.setRootElement(responseStructureDeep,
							null);
					flattenOffset = flattenOffset + flatSize;
				}
			}
		} else {
			for (i = 0; i < batchFunctionSize; i++) {
				this.m_batchFunctions.get(i).getResponse().setRootElement(
						rootElement, null);
			}
		}
	};
	oFF.BatchRequestManager.prototype.updateRespondedBatchFunctions = function(
			batchList, rootElement) {
		var messageManager = oFF.MessageManager
				.createMessageManagerExt(this.m_session);
		var executedFunctions = oFF.XList.create();
		var size;
		var i;
		var structure;
		var instanceId;
		var _function;
		if (oFF.notNull(batchList) && batchList.hasElements()) {
			size = batchList.size();
			for (i = 0; i < size; i++) {
				structure = batchList.getStructureAt(i);
				instanceId = this.getInstanceId(structure);
				_function = this.m_batchFunctionsIdMapping.getByKey(instanceId);
				if (oFF.notNull(_function)) {
					_function.getResponse().setRootElement(structure, null);
					executedFunctions.add(_function);
				} else {
					messageManager
							.addError(0, "Request not found for response");
				}
			}
		}
		if (!this.isValidBatchStreamingResponse(rootElement)) {
			messageManager.addError(0,
					"Response does not contain correct batch id");
		}
		return oFF.ExtResult.create(executedFunctions, messageManager);
	};
	oFF.BatchRequestManager.prototype.getInstanceId = function(structure) {
		var dataSource = this.getDataSource(structure);
		if (oFF.notNull(dataSource)) {
			return dataSource
					.getStringByKey(oFF.ConnectionConstants.INA_INSTANCE_ID);
		}
		return null;
	};
	oFF.BatchRequestManager.prototype.getDataSource = function(structure) {
		var analytics;
		if (oFF.isNull(structure)) {
			return null;
		}
		if (structure.containsKey(oFF.ConnectionConstants.INA_ANALYTICS)) {
			analytics = structure
					.getStructureByKey(oFF.ConnectionConstants.INA_ANALYTICS);
			return analytics
					.getStructureByKey(oFF.ConnectionConstants.INA_DATA_SOURCE);
		}
		if (structure.containsKey(oFF.ConnectionConstants.INA_METADATA)) {
			return structure.getStructureByKey(
					oFF.ConnectionConstants.INA_METADATA).getStructureByKey(
					oFF.ConnectionConstants.INA_DATA_SOURCE);
		}
		if (structure.containsKey(oFF.ConnectionConstants.INA_CUBE)) {
			return structure
					.getStructureByKey(oFF.ConnectionConstants.INA_CUBE)
					.getStructureByKey(oFF.ConnectionConstants.INA_DATA_SOURCE);
		}
		if (structure.containsKey(oFF.ConnectionConstants.INA_DS_VALIDATION)) {
			return structure.getStructureByKey(
					oFF.ConnectionConstants.INA_DS_VALIDATION)
					.getStructureByKey(oFF.ConnectionConstants.INA_DATA_SOURCE);
		}
		return structure
				.getStructureByKey(oFF.ConnectionConstants.INA_DATA_SOURCE);
	};
	oFF.BatchRequestManager.prototype.ensureUniqueInstanceIds = function() {
		var size;
		var i;
		var batchFunction;
		var requestStructure;
		var instanceId;
		this.m_batchFunctionsIdMapping = oFF.XHashMapByString.create();
		size = this.m_batchFunctions.size();
		for (i = 0; i < size; i++) {
			batchFunction = this.m_batchFunctions.get(i);
			requestStructure = batchFunction.getRequest().getRequestStructure();
			instanceId = this.getInstanceId(requestStructure);
			if (this.m_batchFunctionsIdMapping.containsKey(instanceId)
					|| oFF.XStringUtils
							.isNotNullAndNotEmpty(oFF.BatchRequestManager.CONSTANT_ID)) {
				instanceId = this.createGuid(oFF.XInteger.convertToString(i));
				this.getDataSource(requestStructure).putString(
						oFF.ConnectionConstants.INA_INSTANCE_ID, instanceId);
			}
			this.m_batchFunctionsIdMapping.put(instanceId, batchFunction);
		}
	};
	oFF.BatchRequestManager.prototype.isValidBatchStreamingResponse = function(
			rootElement) {
		var asyncResponseRequest = rootElement
				.getStructureByKey(oFF.ConnectionConstants.INA_BATCH_ASYNC_RESPONSE_REQUEST);
		var batchId;
		if (oFF.notNull(asyncResponseRequest)) {
			batchId = asyncResponseRequest
					.getStringByKey(oFF.ConnectionConstants.INA_BATCH_ID);
			return oFF.notNull(batchId)
					&& oFF.XString.isEqual(batchId, this.m_streamingGuid);
		}
		return false;
	};
	oFF.BatchRequestManager.prototype.createGuid = function(constantGuidPostfix) {
		if (oFF.XStringUtils
				.isNotNullAndNotEmpty(oFF.BatchRequestManager.CONSTANT_ID)) {
			return oFF.XStringUtils.concatenate2(
					oFF.BatchRequestManager.CONSTANT_ID, constantGuidPostfix);
		}
		return oFF.XGuid.getGuid();
	};
	oFF.RpcHttpFunctionFactory = function() {
	};
	oFF.RpcHttpFunctionFactory.prototype = new oFF.RpcFunctionFactory();
	oFF.RpcHttpFunctionFactory.staticSetup = function() {
		var newFactory = new oFF.RpcHttpFunctionFactory();
		oFF.RpcFunctionFactory.registerFactory(oFF.ProtocolType.HTTP, null,
				newFactory);
		oFF.RpcFunctionFactory.registerFactory(oFF.ProtocolType.HTTPS, null,
				newFactory);
	};
	oFF.RpcHttpFunctionFactory.prototype.newRpcFunction = function(context,
			connectionInfo, name, systemType, protocolType) {
		var relativeUri = oFF.XUri.createFromUri(name);
		var connectionContainer = context;
		return oFF.RpcHttpFunction.create(connectionContainer, relativeUri);
	};
	oFF.DsrPassport = function() {
	};
	oFF.DsrPassport.prototype = new oFF.XObject();
	oFF.DsrPassport.sapTraceLevel_Sql = 1;
	oFF.DsrPassport.sapTraceLevel_Buffer = 2;
	oFF.DsrPassport.sapTraceLevel_Enqueu = 4;
	oFF.DsrPassport.sapTraceLevel_Rfc = 8;
	oFF.DsrPassport.sapTraceLevel_Permission = 16;
	oFF.DsrPassport.sapTraceLevel_Free = 32;
	oFF.DsrPassport.sapTraceLevel_cFunction = 64;
	oFF.DsrPassport.sapTraceLevel_AbapCondens0 = 256;
	oFF.DsrPassport.sapTraceLevel_AbapCondens1 = 512;
	oFF.DsrPassport.l1 = 0;
	oFF.DsrPassport.staticSetup = function() {
		oFF.DsrPassport.l1 = oFF.DsrConstants.lenOfRecordIdField
				+ oFF.DsrConstants.lenOfRecordLenField;
	};
	oFF.DsrPassport.prototype.m_traceFlag = 0;
	oFF.DsrPassport.prototype.m_serviceType = 0;
	oFF.DsrPassport.prototype.m_actionType = 0;
	oFF.DsrPassport.prototype.m_systemId = null;
	oFF.DsrPassport.prototype.m_prevSystemId = null;
	oFF.DsrPassport.prototype.m_action = null;
	oFF.DsrPassport.prototype.m_userId = null;
	oFF.DsrPassport.prototype.m_transId = null;
	oFF.DsrPassport.prototype.m_client = "   ";
	oFF.DsrPassport.prototype.m_connectionId = null;
	oFF.DsrPassport.prototype.m_rootContextId = null;
	oFF.DsrPassport.prototype.m_connectionCounter = 0;
	oFF.DsrPassport.prototype.m_appVarItemsLength = 0;
	oFF.DsrPassport.prototype.m_sysVarItemsLength = 0;
	oFF.DsrPassport.prototype.m_systemType = 2;
	oFF.DsrPassport.prototype.m_version = 0;
	oFF.DsrPassport.prototype.m_systemVariablePartItems = null;
	oFF.DsrPassport.prototype.m_applicationVariablePartItems = null;
	oFF.DsrPassport.prototype.initialize = function() {
		this.m_version = oFF.DsrConstants.currentPassportVersion;
		this.m_systemVariablePartItems = oFF.XList.create();
		this.m_applicationVariablePartItems = oFF.XList.create();
	};
	oFF.DsrPassport.prototype.setRootContextId = function(rootContextId) {
		var _rootContextId;
		if (oFF.isNull(rootContextId)) {
			this.m_rootContextId = null;
			return;
		}
		_rootContextId = oFF.XString.replace(rootContextId, "-", "");
		if (oFF.XString.size(_rootContextId) !== oFF.DsrConstants.rootContextLen * 2) {
			throw oFF.XException
					.createRuntimeException("Invalid Root Context Id. Must be a uuid in hex encoding!");
		}
		this.m_rootContextId = _rootContextId;
	};
	oFF.DsrPassport.prototype.getSystemVariablePartItems = function() {
		return this.m_systemVariablePartItems;
	};
	oFF.DsrPassport.prototype.getApplicationVariablePartItems = function() {
		return this.m_applicationVariablePartItems;
	};
	oFF.DsrPassport.prototype.setSystemType = function(systemType) {
		this.m_systemType = systemType;
	};
	oFF.DsrPassport.prototype.getNetPassport = function() {
		return oFF.DsrEncodeDecode.encodeBytePassport(this);
	};
	oFF.DsrPassport.prototype.setByPassport = function(passport) {
	};
	oFF.DsrPassport.prototype.getNetPassportWithByteConnectionId = function(
			connId, connectionCounter) {
		return oFF.DsrEncodeDecode.encodeBytePassportWithConnection(this,
				connId, null, connectionCounter);
	};
	oFF.DsrPassport.prototype.getNetPassportWithHexConnectionId = function(
			connId, connectionCounter) {
		return oFF.DsrEncodeDecode.encodeBytePassportWithConnection(this, null,
				connId, connectionCounter);
	};
	oFF.DsrPassport.prototype.getTransId = function() {
		return this.m_transId;
	};
	oFF.DsrPassport.prototype.getTraceFlag = function() {
		return this.m_traceFlag;
	};
	oFF.DsrPassport.prototype.setService = function(srv) {
		this.m_serviceType = srv;
	};
	oFF.DsrPassport.prototype.getService = function() {
		return this.m_serviceType;
	};
	oFF.DsrPassport.prototype.getActionType = function() {
		return this.m_actionType;
	};
	oFF.DsrPassport.prototype.getSystemId = function() {
		return this.m_systemId;
	};
	oFF.DsrPassport.prototype.getPrevSystemId = function() {
		return this.m_prevSystemId;
	};
	oFF.DsrPassport.prototype.getAction = function() {
		return this.m_action;
	};
	oFF.DsrPassport.prototype.getUserId = function() {
		return this.m_userId;
	};
	oFF.DsrPassport.prototype.getConnectionCounter = function() {
		return this.m_connectionCounter;
	};
	oFF.DsrPassport.prototype.getClientNumber = function() {
		return this.m_client;
	};
	oFF.DsrPassport.prototype.setClientNumber = function(clientNumber) {
		this.m_client = clientNumber;
	};
	oFF.DsrPassport.prototype.getSystemType = function() {
		return this.m_systemType;
	};
	oFF.DsrPassport.prototype.setByNetPassport = function(netPassport) {
		oFF.DsrEncodeDecode.decodeBytePassport(this, netPassport);
	};
	oFF.DsrPassport.prototype.setVersion = function(version) {
		this.m_version = version;
	};
	oFF.DsrPassport.prototype.setTraceFlag = function(traceFlag) {
		this.m_traceFlag = traceFlag;
	};
	oFF.DsrPassport.prototype.setSystemId = function(systemId) {
		if (oFF.notNull(systemId)) {
			this.m_systemId = systemId;
		}
	};
	oFF.DsrPassport.prototype.setServiceType = function(serviceType) {
		this.m_serviceType = serviceType;
	};
	oFF.DsrPassport.prototype.setUserId = function(userId) {
		if (oFF.notNull(userId)) {
			this.m_userId = userId;
		}
	};
	oFF.DsrPassport.prototype.setAction = function(action) {
		if (oFF.notNull(action)) {
			this.m_action = action;
		}
	};
	oFF.DsrPassport.prototype.setActionType = function(actionType) {
		this.m_actionType = actionType;
	};
	oFF.DsrPassport.prototype.setPrevSystemId = function(prevSystemId) {
		if (oFF.notNull(prevSystemId)) {
			this.m_prevSystemId = prevSystemId;
		}
	};
	oFF.DsrPassport.prototype.setTransId = function(transId) {
		var _transId;
		if (oFF.notNull(transId)) {
			_transId = oFF.XString.replace(transId, "-", "");
			if (oFF.XString.size(_transId) !== oFF.DsrConstants.transIdLen * 2) {
				throw oFF.XException
						.createRuntimeException("Invalid transaction id. Must be a UUID in hex encoding!");
			}
			this.m_transId = _transId;
		}
	};
	oFF.DsrPassport.prototype.setPassport = function(pass) {
		var varParts;
		var i;
		this.setVersion(3);
		this.setTraceFlag(pass.getTraceFlag());
		this.setSystemId(pass.getSystemId());
		this.setServiceType(pass.getService());
		this.setUserId(pass.getUserId());
		this.setAction(pass.getAction());
		this.setActionType(pass.getActionType());
		this.setPrevSystemId(pass.getPrevSystemId());
		this.setTransId(pass.getTransId());
		this.setClientNumber(pass.getClientNumber());
		this.setSystemType(pass.getSystemType());
		this.setRootContextId(pass.getRootContextId());
		this.setConnectionId(null);
		this.setConnectionCounter(0);
		this.m_systemVariablePartItems.clear();
		this.m_applicationVariablePartItems.clear();
		varParts = pass.getVarItems();
		if (varParts.size() > 0) {
			for (i = 0; i < varParts.size(); i++) {
				if (varParts.get(i).getVarPartType() === oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM) {
					this.m_systemVariablePartItems.add(varParts.get(i));
				} else {
					this.m_applicationVariablePartItems.add(varParts.get(i));
				}
			}
			this.m_sysVarItemsLength = pass.getSysVarItemsLength();
			this.m_appVarItemsLength = pass.getAppVarItemsLength();
		}
	};
	oFF.DsrPassport.prototype.getPassportArrayData = function(buf, offset) {
		var pos = offset;
		try {
			oFF.DsrConvert.int2FourByte(oFF.DsrConstants.recordIdPassport, buf,
					pos);
			pos = pos + oFF.DsrPassport.l1;
			var passBytes = oFF.DsrEncodeDecode.encodeBytePassport(this);
			if (oFF.notNull(passBytes)) {
				buf.setByteAt(pos, oFF.DsrConstants.fieldIdPassportBytes);
				pos = pos + oFF.DsrConstants.lenOfFieldIdField;
				buf.setByteAt(pos, oFF.DsrConstants.fieldTypeByteArray);
				pos = pos + oFF.DsrConstants.lenOfFieldTypeField;
				oFF.DsrConvert.int2TwoByte(passBytes.size(), buf, pos);
				pos = pos + oFF.DsrConstants.lenOfStringLenField;
				oFF.XByteArray.copy(passBytes, 0, buf, pos, passBytes.size());
				pos = pos + passBytes.size();
			}
			oFF.DsrConvert.int2TwoByte(pos - offset, buf, offset
					+ oFF.DsrConstants.lenOfRecordIdField);
		} catch (e) {
			return 0;
		}
		return pos - offset;
	};
	oFF.DsrPassport.prototype.getVarItems = function() {
		var temp = oFF.XArray.create(this.m_systemVariablePartItems.size()
				+ this.m_applicationVariablePartItems.size());
		var pos = 0;
		var i;
		var j;
		for (i = 0; i < this.m_systemVariablePartItems.size(); i++) {
			temp.set(pos, this.m_systemVariablePartItems.get(i));
			pos++;
		}
		for (j = 0; j < this.m_applicationVariablePartItems.size(); j++) {
			temp.set(pos, this.m_applicationVariablePartItems.get(j));
			pos++;
		}
		return temp;
	};
	oFF.DsrPassport.prototype.addVarItemBytes = function(applID, applKey,
			bValue) {
		var applVar = oFF.DsrtApplVarPart.createByByteArray(applID, applKey,
				bValue);
		this.m_applicationVariablePartItems.add(applVar);
		this.m_appVarItemsLength = this.m_appVarItemsLength
				+ applVar.getLength();
	};
	oFF.DsrPassport.prototype.addVarItemInteger = function(applID, applKey,
			iValue) {
		var applVar = oFF.DsrtApplVarPart.createByIntValue(applID, applKey,
				iValue);
		this.m_applicationVariablePartItems.add(applVar);
		this.m_appVarItemsLength = this.m_appVarItemsLength
				+ applVar.getLength();
	};
	oFF.DsrPassport.prototype.addVarItemString = function(applID, applKey,
			sValue) {
		var applVar = oFF.DsrtApplVarPart.createByStringValue(applID, applKey,
				sValue);
		this.m_applicationVariablePartItems.add(applVar);
		this.m_appVarItemsLength = this.m_appVarItemsLength
				+ applVar.getLength();
	};
	oFF.DsrPassport.prototype.addVarItemGUID = function(applID, applKey, bValue) {
		var applVar;
		var tempByte;
		if (bValue.size() > 16) {
			tempByte = oFF.XByteArray.create(null, 16);
			oFF.XByteArray.copy(bValue, 0, tempByte, 0, 16);
			applVar = oFF.DsrtApplVarPart.createByByteArray(applID, applKey,
					tempByte);
		} else {
			applVar = oFF.DsrtApplVarPart.createByByteArray(applID, applKey,
					bValue);
		}
		applVar.setVarPartValueType(oFF.DsrtApplVarPart.GUID_TYPE);
		this.m_applicationVariablePartItems.add(applVar);
		this.m_appVarItemsLength = this.m_appVarItemsLength
				+ applVar.getLength();
	};
	oFF.DsrPassport.prototype.addSystemVarItemBytes = function(applID, applKey,
			bValue) {
		var sysVar = oFF.DsrtApplVarPart.createByByteArray(applID, applKey,
				bValue);
		sysVar.setVarPartType(oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM);
		this.m_systemVariablePartItems.add(sysVar);
		this.m_sysVarItemsLength = this.m_sysVarItemsLength
				+ sysVar.getLength();
	};
	oFF.DsrPassport.prototype.addSystemVarItemInteger = function(applID,
			applKey, iValue) {
		var sysVar = oFF.DsrtApplVarPart.createByIntValue(applID, applKey,
				iValue);
		sysVar.setVarPartType(oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM);
		this.m_systemVariablePartItems.add(sysVar);
		this.m_sysVarItemsLength = this.m_sysVarItemsLength
				+ sysVar.getLength();
	};
	oFF.DsrPassport.prototype.addSystemVarItemString = function(applID,
			applKey, sValue) {
		var sysVar = oFF.DsrtApplVarPart.createByStringValue(applID, applKey,
				sValue);
		sysVar.setVarPartType(oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM);
		this.m_systemVariablePartItems.add(sysVar);
		this.m_sysVarItemsLength = this.m_sysVarItemsLength
				+ sysVar.getLength();
	};
	oFF.DsrPassport.prototype.addSystemVarItemGUID = function(applID, applKey,
			bValue) {
		var sysVar;
		var tempByte;
		if (bValue.size() > 16) {
			tempByte = oFF.XByteArray.create(null, 16);
			oFF.XByteArray.copy(bValue, 0, tempByte, 0, 16);
			sysVar = oFF.DsrtApplVarPart.createByByteArray(applID, applKey,
					tempByte);
		} else {
			sysVar = oFF.DsrtApplVarPart.createByByteArray(applID, applKey,
					bValue);
		}
		sysVar.setVarPartValueType(oFF.DsrtApplVarPart.GUID_TYPE);
		sysVar.setVarPartType(oFF.DsrtApplVarPart.VARIABLE_PART_TYPE_SYSTEM);
		this.m_systemVariablePartItems.add(sysVar);
		this.m_sysVarItemsLength = this.m_sysVarItemsLength
				+ sysVar.getLength();
	};
	oFF.DsrPassport.prototype.getItem = function(applID, applKey) {
		var varItem;
		var i;
		var j;
		for (i = 0; i < this.m_systemVariablePartItems.size(); i++) {
			varItem = this.m_systemVariablePartItems.get(i);
			if (varItem.getApplId() === applID && varItem.getKey() === applKey) {
				return varItem;
			}
		}
		for (j = 0; j < this.m_applicationVariablePartItems.size(); j++) {
			varItem = this.m_applicationVariablePartItems.get(j);
			if (varItem.getApplId() === applID && varItem.getKey() === applKey) {
				return varItem;
			}
		}
		return null;
	};
	oFF.DsrPassport.prototype.getVarItemsLength = function() {
		var res = 0;
		if (this.m_systemVariablePartItems.size() > 0) {
			res = res + this.m_sysVarItemsLength;
			res = res + oFF.DsrConstants.VARIABLE_PART_HEADER_LENGTH;
		}
		if (this.m_applicationVariablePartItems.size() > 0) {
			res = res + this.m_appVarItemsLength;
			res = res + oFF.DsrConstants.VARIABLE_PART_HEADER_LENGTH;
		}
		return res;
	};
	oFF.DsrPassport.prototype.getVarItemsCount = function() {
		var res = 0;
		if (this.m_systemVariablePartItems.size() > 0) {
			res++;
		}
		if (this.m_applicationVariablePartItems.size() > 0) {
			res++;
		}
		return res;
	};
	oFF.DsrPassport.prototype.getAppVarItemsLength = function() {
		return this.m_appVarItemsLength;
	};
	oFF.DsrPassport.prototype.getSysVarItemsLength = function() {
		return this.m_sysVarItemsLength;
	};
	oFF.DsrPassport.prototype.getConnectionId = function() {
		return this.m_connectionId;
	};
	oFF.DsrPassport.prototype.setConnectionCounter = function(connectionCounter) {
		this.m_connectionCounter = connectionCounter;
	};
	oFF.DsrPassport.prototype.setConnectionId = function(connectionId) {
		var _connectionId;
		if (oFF.notNull(connectionId)) {
			_connectionId = oFF.XString.replace(connectionId, "-", "");
			if (oFF.XString.size(_connectionId) !== oFF.DsrConstants.connectionIdLen * 2) {
				throw oFF.XException
						.createRuntimeException("Invalid connection id length. Must be a uuid in hex encoding!");
			}
			this.m_connectionId = _connectionId;
		}
	};
	oFF.DsrPassport.prototype.getRootContextId = function() {
		return this.m_rootContextId;
	};
	oFF.DsrPassport.prototype.getVersion = function() {
		return this.m_version;
	};
	oFF.ServiceType = function() {
	};
	oFF.ServiceType.prototype = new oFF.ServiceTypeInfo();
	oFF.ServiceType.createType = function(serviceName) {
		var st = new oFF.ServiceType();
		var serviceSetupReferenceName = oFF.XStringUtils.concatenate3(
				oFF.RegistrationService.SERVICE_CONFIG, ".", serviceName);
		var serviceReferenceName = oFF.XStringUtils.concatenate3(
				oFF.RegistrationService.SERVICE, ".", serviceName);
		st.setupExt(serviceSetupReferenceName, serviceReferenceName);
		return st;
	};
	oFF.ServiceType.prototype.m_srvConfigReferenceName = null;
	oFF.ServiceType.prototype.m_serviceReferenceName = null;
	oFF.ServiceType.prototype.setupExt = function(serviceConfigReferenceName,
			serviceReferenceName) {
		this.m_srvConfigReferenceName = serviceConfigReferenceName;
		this.m_serviceReferenceName = serviceReferenceName;
	};
	oFF.ServiceType.prototype.createServiceConfig = function(application) {
		return this.createServiceConfigInternal(application);
	};
	oFF.ServiceType.prototype.getServiceReferenceName = function() {
		return this.m_serviceReferenceName;
	};
	oFF.ServiceType.prototype.getServiceConfigReferenceName = function() {
		return this.m_srvConfigReferenceName;
	};
	oFF.ServiceType.prototype.toString = function() {
		var sb = oFF.XStringBuffer.create();
		if (oFF.notNull(this.m_srvConfigReferenceName)) {
			sb.appendLine(this.m_srvConfigReferenceName);
		}
		if (oFF.notNull(this.m_serviceReferenceName)) {
			sb.appendLine(this.m_serviceReferenceName);
		}
		return sb.toString();
	};
	oFF.BasicCredentialsProvider = function() {
	};
	oFF.BasicCredentialsProvider.prototype = new oFF.CredentialsFactory();
	oFF.BasicCredentialsProvider.staticSetup = function() {
		oFF.CredentialsFactory
				.registerFactory(new oFF.BasicCredentialsProvider());
	};
	oFF.BasicCredentialsProvider.prototype.m_runtimeUserManager = null;
	oFF.BasicCredentialsProvider.prototype.m_authMap = null;
	oFF.BasicCredentialsProvider.prototype.newCredentialsProvider = function(
			runtimeUserManager) {
		var credentialsProvider = new oFF.BasicCredentialsProvider();
		credentialsProvider.m_runtimeUserManager = runtimeUserManager;
		credentialsProvider.m_authMap = oFF.XHashMapByString.create();
		return credentialsProvider;
	};
	oFF.BasicCredentialsProvider.prototype.processGetCredentials = function(
			syncType, listener, customIdentifier, connection,
			credentialsCallCounter, response, messages, changedType) {
		var sysKey = this.extractUniqueKey(connection.getSystemDescription());
		var authType;
		if (oFF.notNull(changedType)) {
			this.m_authMap.put(sysKey, changedType);
		}
		authType = this.m_authMap.getByKey(sysKey);
		return oFF.BasicCredentialsAction.createAndRun(syncType, listener,
				customIdentifier, this.m_runtimeUserManager, connection,
				messages, authType);
	};
	oFF.BasicCredentialsProvider.prototype.notifyCredentialsSuccess = function(
			connection) {
	};
	oFF.BasicCredentialsProvider.prototype.supportsOnErrorHandling = function() {
		return false;
	};
	oFF.BasicCredentialsProvider.prototype.extractUniqueKey = function(system) {
		var key = system.getUriStringExt(true, false, false, false, true,
				false, false, false);
		return key;
	};
	oFF.DcsUsageTracker = function() {
	};
	oFF.DcsUsageTracker.prototype = new oFF.XObject();
	oFF.DcsUsageTracker.MAX_INTERVAL = 600000;
	oFF.DcsUsageTracker.create = function() {
		var dcsUsageTracker = new oFF.DcsUsageTracker();
		dcsUsageTracker.m_interval = 20000;
		dcsUsageTracker.m_enabled = false;
		dcsUsageTracker.m_failedCount = 0;
		dcsUsageTracker.setup();
		return dcsUsageTracker;
	};
	oFF.DcsUsageTracker.prototype.m_interval = 0;
	oFF.DcsUsageTracker.prototype.m_dcsUrl = null;
	oFF.DcsUsageTracker.prototype.m_session = null;
	oFF.DcsUsageTracker.prototype.m_syncType = null;
	oFF.DcsUsageTracker.prototype.eventQueue = null;
	oFF.DcsUsageTracker.prototype.m_requestRunning = false;
	oFF.DcsUsageTracker.prototype.m_timerHandle = null;
	oFF.DcsUsageTracker.prototype.m_xlang = null;
	oFF.DcsUsageTracker.prototype.m_enabled = false;
	oFF.DcsUsageTracker.prototype.m_tenantId = null;
	oFF.DcsUsageTracker.prototype.m_productVersion = null;
	oFF.DcsUsageTracker.prototype.m_failedCount = 0;
	oFF.DcsUsageTracker.prototype.m_language = null;
	oFF.DcsUsageTracker.prototype.m_dispatcher = null;
	oFF.DcsUsageTracker.prototype.setup = function() {
		this.eventQueue = oFF.XList.create();
		this.m_dispatcher = oFF.Dispatcher.getInstance();
	};
	oFF.DcsUsageTracker.prototype.setDispatcher = function(dispatcher) {
		this.m_dispatcher = dispatcher;
	};
	oFF.DcsUsageTracker.prototype.setInterval = function(interval) {
		this.m_interval = interval;
	};
	oFF.DcsUsageTracker.prototype.setDcsUrl = function(dcsUrl) {
		this.m_dcsUrl = oFF.XUri.createFromUri(dcsUrl);
	};
	oFF.DcsUsageTracker.prototype.trackUsage = function(actionId, parameters,
			session) {
		if (!this.isEnabled()) {
			return;
		}
		this.addEvent(actionId, parameters, session);
		this.checkTimer();
	};
	oFF.DcsUsageTracker.prototype.track = function(event) {
		if (!this.isEnabled()) {
			return;
		}
		if (event.getEventTime() === null) {
			event.setEventTime(oFF.XDateTimeProvider.getInstance()
					.getCurrentDateTimeAtLocalTimezone());
		}
		this.eventQueue.add(event);
		this.checkTimer();
	};
	oFF.DcsUsageTracker.prototype.checkTimer = function() {
		var newInterval;
		if (this.m_requestRunning) {
			return;
		}
		if (oFF.notNull(this.m_timerHandle)) {
			return;
		}
		newInterval = oFF.XDouble.convertToInt(this.m_interval
				* oFF.XMath.pow(2, this.m_failedCount));
		this.m_timerHandle = this.m_dispatcher.registerTimer(oFF.XMath.min(
				newInterval, oFF.DcsUsageTracker.MAX_INTERVAL), this, null);
	};
	oFF.DcsUsageTracker.prototype.addEvent = function(actionId, parameters,
			session) {
		var utEvent = new oFF.UTEvent();
		utEvent.setSession(session);
		utEvent.setEventId(actionId);
		utEvent.setEventTime(oFF.XDateTimeProvider.getInstance()
				.getCurrentDateTimeAtLocalTimezone());
		utEvent.setFeature(parameters.getByKey("feature"));
		utEvent.setParameters(parameters);
		this.eventQueue.add(utEvent);
	};
	oFF.DcsUsageTracker.prototype.isEnabled = function() {
		return this.m_enabled;
	};
	oFF.DcsUsageTracker.prototype.setEnabled = function(enabled) {
		this.m_enabled = enabled;
	};
	oFF.DcsUsageTracker.prototype.process = function() {
		var request;
		var httpClient;
		if (this.eventQueue.isEmpty()) {
			this.cancelTimer();
			return;
		}
		request = this.createHttpRequest();
		httpClient = request.newHttpClient(this.getSession());
		this.m_requestRunning = true;
		httpClient.processHttpRequest(this.getSyncType(), this, null);
	};
	oFF.DcsUsageTracker.prototype.cancelTimer = function() {
		this.m_dispatcher.unregisterInterval(this.m_timerHandle);
		this.m_timerHandle = oFF.XObjectExt.release(this.m_timerHandle);
	};
	oFF.DcsUsageTracker.prototype.getSyncType = function() {
		if (oFF.isNull(this.m_syncType)) {
			this.m_syncType = oFF.SyncType.NON_BLOCKING;
		}
		return this.m_syncType;
	};
	oFF.DcsUsageTracker.prototype.setSyncType = function(syncType) {
		this.m_syncType = syncType;
	};
	oFF.DcsUsageTracker.prototype.getSession = function() {
		if (oFF.isNull(this.m_session)) {
			this.m_session = oFF.DefaultSession.create();
		}
		return this.m_session;
	};
	oFF.DcsUsageTracker.prototype.createHttpRequest = function() {
		var request = oFF.HttpRequest.create();
		request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
		request.setFromUri(this.getDscUri());
		request.setContentType(oFF.ContentType.APPLICATION_JSON);
		request.setString(this.buildContent());
		return request;
	};
	oFF.DcsUsageTracker.prototype.getDscUri = function() {
		var location;
		if (oFF.isNull(this.m_dcsUrl)) {
			location = oFF.NetworkEnv.getLocation();
			if (oFF.isNull(location)) {
				throw oFF.XException
						.createIllegalArgumentException("Data Collection Url must be provided");
			}
			this.m_dcsUrl = oFF.XUri.createFromOther(location);
			this.m_dcsUrl.setPath("/datacollection/api/v2/application/data");
			this.m_dcsUrl.setQuery("");
		}
		return this.m_dcsUrl;
	};
	oFF.DcsUsageTracker.prototype.buildContent = function() {
		var content = oFF.PrFactory.createStructure();
		var actiondata;
		var size;
		var i;
		var actionItem;
		var event;
		var parameters;
		var errorSize;
		var errorBuffer;
		var errors;
		var errorKey;
		var value;
		var options;
		var paramInter;
		var param;
		var option;
		this.addCommonFacts(content);
		actiondata = content.getListByKey("actiondata");
		size = this.eventQueue.size();
		for (i = 0; i < size; i++) {
			actionItem = oFF.PrFactory.createStructure();
			actiondata.add(actionItem);
			event = this.eventQueue.get(i);
			parameters = event.getParameters();
			actionItem.putString("action", event.getEventId());
			actionItem.putString("feature", event.getFeature());
			errorSize = event.getErrorSize();
			actionItem.putInteger("numoferrormessages", errorSize);
			if (errorSize > 0) {
				errorBuffer = oFF.XStringBuffer.create();
				errors = event.getErrors().getKeysAsIteratorOfString();
				while (errors.hasNext()) {
					errorKey = errors.next();
					errorBuffer.append(errorKey).append(":").append(
							event.getErrors().getByKey(errorKey)).append(";");
				}
				actionItem.putString("errormessages", errorBuffer.toString());
			}
			value = event.getEventTime().toIsoFormatWithFractions(3);
			actionItem.putString("actiontimestamp", oFF.XString.replace(value,
					"T", " "));
			actionItem.putString("sessionid", event.getSession()
					.getAppSessionId());
			actionItem.putInteger("actionduration", 0);
			actionItem.putInteger("xversion", this.getSession().getVersion());
			options = actionItem.putNewList("options");
			paramInter = parameters.getKeysAsIteratorOfString();
			while (paramInter.hasNext()) {
				param = paramInter.next();
				if (oFF.XString.compare(param, "actionId") !== 0
						&& oFF.XString.compare(param, "feature") !== 0) {
					option = options.addNewStructure();
					option.putString("param", param);
					option.putString("value", parameters.getByKey(param));
				}
			}
		}
		this.eventQueue.clear();
		return oFF.PrUtils.serialize(content, true, true, 0);
	};
	oFF.DcsUsageTracker.prototype.addCommonFacts = function(content) {
		var location;
		var host;
		content.putString("applicationtype", "service");
		content.putString("applicationname", "firefly");
		content.putString("fireflyversion", oFF.XVersion.getLibVersion(this
				.getSession()));
		content.putString("productversion", this.getProductVersion());
		content.putString("xlang", this.mapXLang());
		content.putString("tenantid", this.getTenantId());
		content.putString("os", oFF.XSystemUtils.getOsName());
		content.putString("language", this.getLanguage());
		content.putString("userid", "");
		location = oFF.NetworkEnv.getLocation();
		host = "N/A";
		if (oFF.notNull(location)
				&& oFF.XStringUtils.isNotNullAndNotEmpty(location.getHost())) {
			host = location.getHost();
		}
		content.putString("publichost", host);
		content.putNewList("actiondata");
	};
	oFF.DcsUsageTracker.prototype.mapXLang = function() {
		var xLang;
		if (oFF.isNull(this.m_xlang)) {
			xLang = oFF.XLanguage.getLanguage();
			if (xLang === oFF.XLanguage.JAVASCRIPT) {
				this.m_xlang = "js";
			} else {
				if (xLang === oFF.XLanguage.TYPESCRIPT) {
					this.m_xlang = "ts";
				} else {
					if (xLang === oFF.XLanguage.JAVA) {
						this.m_xlang = "java";
					} else {
						if (xLang === oFF.XLanguage.CSHARP) {
							this.m_xlang = "csharp";
						} else {
							if (xLang === oFF.XLanguage.CPP) {
								this.m_xlang = "cpp";
							} else {
								if (xLang === oFF.XLanguage.OBJECTIVE_C) {
									this.m_xlang = "objc";
								}
							}
						}
					}
				}
			}
		}
		return this.m_xlang;
	};
	oFF.DcsUsageTracker.prototype.onHttpResponse = function(extResult,
			response, customIdentifier) {
		if (response.getStatusCode() !== 202) {
			this.m_failedCount = this.m_failedCount === 10 ? 10
					: this.m_failedCount + 1;
		} else {
			this.m_failedCount = 0;
		}
		this.m_requestRunning = false;
		this.cancelTimer();
	};
	oFF.DcsUsageTracker.prototype.onTimerEvent = function(timerHandle,
			customIdentifier) {
		this.process();
	};
	oFF.DcsUsageTracker.prototype.getTenantId = function() {
		return this.m_tenantId;
	};
	oFF.DcsUsageTracker.prototype.setTenantId = function(tenantId) {
		this.m_tenantId = tenantId;
	};
	oFF.DcsUsageTracker.prototype.getProductVersion = function() {
		return this.m_productVersion;
	};
	oFF.DcsUsageTracker.prototype.setProductVersion = function(productVersion) {
		this.m_productVersion = productVersion;
	};
	oFF.DcsUsageTracker.prototype.getLanguage = function() {
		return oFF.notNull(this.m_language) ? this.m_language : "N/A";
	};
	oFF.DcsUsageTracker.prototype.setLanguage = function(language) {
		this.m_language = language;
	};
	oFF.UTEvent = function() {
	};
	oFF.UTEvent.prototype = new oFF.XObject();
	oFF.UTEvent.prototype.eventTime = null;
	oFF.UTEvent.prototype.host = null;
	oFF.UTEvent.prototype.tenantId = null;
	oFF.UTEvent.prototype.session = null;
	oFF.UTEvent.prototype.m_eventId = null;
	oFF.UTEvent.prototype.m_parameters = null;
	oFF.UTEvent.prototype.m_feature = null;
	oFF.UTEvent.prototype.errors = null;
	oFF.UTEvent.prototype.getEventTime = function() {
		return this.eventTime;
	};
	oFF.UTEvent.prototype.setEventTime = function(eventTime) {
		this.eventTime = eventTime;
	};
	oFF.UTEvent.prototype.getHost = function() {
		return this.host;
	};
	oFF.UTEvent.prototype.setHost = function(host) {
		this.host = host;
	};
	oFF.UTEvent.prototype.getTenantId = function() {
		return this.tenantId;
	};
	oFF.UTEvent.prototype.setTenantId = function(tenantId) {
		this.tenantId = tenantId;
	};
	oFF.UTEvent.prototype.getSession = function() {
		return this.session;
	};
	oFF.UTEvent.prototype.setSession = function(session) {
		this.session = session;
	};
	oFF.UTEvent.prototype.setEventId = function(eventId) {
		this.m_eventId = eventId;
	};
	oFF.UTEvent.prototype.getEventId = function() {
		return this.m_eventId;
	};
	oFF.UTEvent.prototype.setParameters = function(parameters) {
		this.m_parameters = parameters;
	};
	oFF.UTEvent.prototype.getParameters = function() {
		return this.m_parameters;
	};
	oFF.UTEvent.prototype.getFeature = function() {
		return this.m_feature;
	};
	oFF.UTEvent.prototype.setFeature = function(feature) {
		this.m_feature = feature;
	};
	oFF.UTEvent.prototype.getErrorSize = function() {
		if (oFF.notNull(this.errors)) {
			return this.errors.size();
		}
		return 0;
	};
	oFF.UTEvent.prototype.getErrors = function() {
		return this.errors;
	};
	oFF.UTEvent.prototype.setErrors = function(errors) {
		this.errors = errors;
	};
	oFF.DfApplication = function() {
	};
	oFF.DfApplication.prototype = new oFF.XObjectExt();
	oFF.DfApplication.prototype.m_session = null;
	oFF.DfApplication.prototype.m_releaseSession = false;
	oFF.DfApplication.prototype.m_olapEnvironment = null;
	oFF.DfApplication.prototype.m_serviceRegistry = null;
	oFF.DfApplication.prototype.m_dataProviders = null;
	oFF.DfApplication.prototype.m_subApplications = null;
	oFF.DfApplication.prototype.m_bindingManager = null;
	oFF.DfApplication.prototype.m_version = null;
	oFF.DfApplication.prototype.m_identifier = null;
	oFF.DfApplication.prototype.m_component = null;
	oFF.DfApplication.prototype.m_storyId = null;
	oFF.DfApplication.prototype.setup = function() {
		oFF.XObjectExt.prototype.setup.call(this);
		this.m_dataProviders = oFF.XList.create();
		this.m_subApplications = oFF.XList.create();
		this.m_serviceRegistry = oFF.XHashMapByString.create();
	};
	oFF.DfApplication.prototype.releaseObject = function() {
		this.m_olapEnvironment = oFF.XObjectExt.release(this.m_olapEnvironment);
		this.m_subApplications = oFF.XObjectExt.release(this.m_subApplications);
		this.m_serviceRegistry = oFF.XObjectExt.release(this.m_serviceRegistry);
		this.m_dataProviders = oFF.XObjectExt.release(this.m_dataProviders);
		this.m_bindingManager = oFF.XObjectExt.release(this.m_bindingManager);
		this.m_version = null;
		this.m_identifier = null;
		this.m_component = null;
		this.m_storyId = null;
		if (this.m_releaseSession) {
			this.m_session = oFF.XObjectExt.release(this.m_session);
		}
		oFF.XObjectExt.prototype.releaseObject.call(this);
	};
	oFF.DfApplication.prototype.setClientInfo = function(version, identifier,
			component) {
		this.m_version = version;
		this.m_identifier = identifier;
		this.m_component = component;
	};
	oFF.DfApplication.prototype.getClientComponent = function() {
		return this.m_component;
	};
	oFF.DfApplication.prototype.getClientVersion = function() {
		return this.m_version;
	};
	oFF.DfApplication.prototype.getClientIdentifier = function() {
		return this.m_identifier;
	};
	oFF.DfApplication.prototype.clearClientInfo = function() {
		this.m_version = null;
		this.m_identifier = null;
		this.m_component = null;
	};
	oFF.DfApplication.prototype.releaseManagedObjects = function() {
		this.releaseAllSubApplications();
		this.releaseDataProviders();
		this.releaseServices();
	};
	oFF.DfApplication.prototype.getOlapEnvironment = function() {
		if (oFF.isNull(this.m_olapEnvironment)) {
			this.m_olapEnvironment = oFF.OlapEnvironmentFactory
					.newInstance(this);
		}
		return this.m_olapEnvironment;
	};
	oFF.DfApplication.prototype.releaseDataProviders = function() {
		var count;
		var dataProvider;
		if (oFF.notNull(this.m_dataProviders)) {
			while (this.m_dataProviders.size() > 0) {
				count = this.m_dataProviders.size();
				dataProvider = this.m_dataProviders.get(0);
				oFF.XObjectExt.release(dataProvider);
				if (count === this.m_dataProviders.size()) {
					throw oFF.XException
							.createIllegalStateException("DataProvider was not correctly released from storage");
				}
			}
		}
	};
	oFF.DfApplication.prototype.releaseServices = function() {
		var keys;
		var idxKey;
		var key;
		var services;
		var idxService;
		var service;
		if (oFF.notNull(this.m_serviceRegistry)) {
			keys = this.m_serviceRegistry.getKeysAsReadOnlyListOfString();
			for (idxKey = 0; idxKey < keys.size(); idxKey++) {
				key = keys.get(idxKey);
				services = this.m_serviceRegistry.getByKey(key);
				if (oFF.notNull(services) && !services.isReleased()) {
					for (idxService = 0; idxService < services.size(); idxService++) {
						service = services.get(idxService);
						oFF.XObjectExt.release(service);
					}
					services.clear();
					oFF.XObjectExt.release(services);
				}
			}
			this.m_serviceRegistry.clear();
		}
	};
	oFF.DfApplication.prototype.getDataProviders = function() {
		return this.m_dataProviders;
	};
	oFF.DfApplication.prototype.registerDataProvider = function(dataProvider) {
		if (oFF.notNull(dataProvider)) {
			this.m_dataProviders.add(dataProvider);
		}
	};
	oFF.DfApplication.prototype.unregisterDataProvider = function(dataProvider) {
		if (oFF.notNull(dataProvider)) {
			this.m_dataProviders.removeElement(dataProvider);
		}
	};
	oFF.DfApplication.prototype.getReferenceNameFromService = function(service) {
		var serviceConfig;
		var serviceTypeInfo;
		if (oFF.notNull(service)) {
			serviceConfig = service.getServiceConfig();
			if (oFF.notNull(serviceConfig)) {
				serviceTypeInfo = serviceConfig.getServiceTypeInfo();
				if (oFF.notNull(serviceTypeInfo)) {
					return serviceTypeInfo.getServiceReferenceName();
				}
			}
		}
		return null;
	};
	oFF.DfApplication.prototype.registerService = function(service) {
		var serviceName = this.getReferenceNameFromService(service);
		var services;
		var i;
		var existingService;
		if (oFF.notNull(serviceName)) {
			services = this.m_serviceRegistry.getByKey(serviceName);
			if (oFF.isNull(services)) {
				services = oFF.XList.create();
				this.m_serviceRegistry.put(serviceName, services);
			}
			for (i = 0; i < services.size(); i++) {
				existingService = services.get(i);
				if (service === existingService) {
					return;
				}
			}
			services.add(service);
		}
	};
	oFF.DfApplication.prototype.unregisterService = function(service) {
		var serviceName = this.getReferenceNameFromService(service);
		var services;
		var i;
		var existingService;
		if (oFF.notNull(serviceName)) {
			if (oFF.notNull(this.m_serviceRegistry)) {
				services = this.m_serviceRegistry.getByKey(serviceName);
				if (oFF.notNull(services) && !services.isReleased()) {
					for (i = 0; i < services.size(); i++) {
						existingService = services.get(i);
						if (service === existingService) {
							services.removeAt(i);
							break;
						}
					}
				}
			}
		}
	};
	oFF.DfApplication.prototype.getServices = function(serviceType) {
		var serviceName;
		var services;
		if (oFF.notNull(serviceType)) {
			serviceName = serviceType.getServiceReferenceName();
			if (oFF.notNull(serviceName)) {
				if (oFF.notNull(this.m_serviceRegistry)) {
					services = this.m_serviceRegistry.getByKey(serviceName);
					if (oFF.notNull(services) && services.size() > 0) {
						return services;
					}
				}
			}
		}
		return null;
	};
	oFF.DfApplication.prototype.newSubApplication = function() {
		var subApplication = oFF.SubApplication.create(this);
		this.m_subApplications.add(subApplication);
		return subApplication;
	};
	oFF.DfApplication.prototype.releaseAllSubApplications = function() {
		var count;
		var subApplication;
		if (oFF.notNull(this.m_subApplications)) {
			while (this.m_subApplications.size() > 0) {
				count = this.m_subApplications.size();
				subApplication = this.m_subApplications.get(0);
				oFF.XObjectExt.release(subApplication);
				if (count === this.m_subApplications.size()) {
					throw oFF.XException
							.createIllegalStateException("DataProvider was not correctly released from storage");
				}
			}
		}
	};
	oFF.DfApplication.prototype.unregisterSubApplication = function(
			subApplication) {
		var index = this.m_subApplications.getIndex(subApplication);
		if (index !== -1) {
			this.m_subApplications.removeAt(index);
		}
	};
	oFF.DfApplication.prototype.createNextInstanceId = function() {
		return oFF.XGuid.getGuid();
	};
	oFF.DfApplication.prototype.selectProviderComponents = function(operation,
			defaultDomain, contextObject, maximumCount) {
		var domain = operation.getDomain();
		var components;
		var operationType;
		var dataProviders;
		var name;
		var k;
		var dp;
		var componentType;
		var selectedComponentType;
		var m;
		var dp2;
		var componentType2;
		if (oFF.isNull(domain) || domain === oFF.SigSelDomain.CONTEXT) {
			domain = defaultDomain;
		}
		if (domain === oFF.SigSelDomain.DATA) {
			components = oFF.XList.create();
			operationType = operation.getOperationType();
			dataProviders = this.getDataProviders();
			if (operationType === oFF.SigSelType.MATCH_NAME) {
				name = operation.getName();
				for (k = 0; k < dataProviders.size(); k++) {
					dp = dataProviders.get(k);
					componentType = dp.getComponentType();
					if (oFF.XString.isEqual(name, dp.getDataProviderName())
							&& componentType
									.isTypeOf(oFF.IoComponentType.DATA_PROVIDER)) {
						components.add(dp);
						break;
					}
				}
			} else {
				if (operationType === oFF.SigSelType.MATCH) {
					selectedComponentType = operation
							.getSelectedComponentType();
					if (oFF.notNull(selectedComponentType)) {
						for (m = 0; m < dataProviders.size()
								&& (maximumCount === -1 || components.size() < maximumCount); m++) {
							dp2 = dataProviders.get(m);
							componentType2 = dp2.getComponentType();
							if (componentType2.isTypeOf(selectedComponentType)) {
								components.add(dp2);
							}
						}
					}
				}
			}
			return components;
		}
		return null;
	};
	oFF.DfApplication.prototype.setStoryId = function(storyId) {
		this.m_storyId = storyId;
	};
	oFF.DfApplication.prototype.getStoryId = function() {
		return this.m_storyId;
	};
	oFF.DfApplication.prototype.setDefaultSyncType = function(syncType) {
		this.m_session.setDefaultSyncType(syncType);
	};
	oFF.DfApplication.prototype.setSessionExt = function(session,
			releaseSession) {
		var selector;
		this.m_session = session;
		this.m_releaseSession = releaseSession;
		selector = session.getSelector();
		selector.registerSelector(oFF.SigSelDomain.DATA, this);
		this.m_bindingManager = oFF.DpBindingManager.create(session);
	};
	oFF.DfApplication.prototype.getSession = function() {
		return this.m_session;
	};
	oFF.DfApplication.prototype.getDefaultSyncType = function() {
		return this.m_session.getDefaultSyncType();
	};
	oFF.DfApplication.prototype.getVersion = function() {
		return this.m_session.getVersion();
	};
	oFF.DfApplication.prototype.getBindingManager = function() {
		return this.m_bindingManager;
	};
	oFF.DfApplicationContext = function() {
	};
	oFF.DfApplicationContext.prototype = new oFF.XObjectExt();
	oFF.DfApplicationContext.prototype.m_application = null;
	oFF.DfApplicationContext.prototype.setupApplicationContext = function(
			application) {
		this.setApplication(application);
	};
	oFF.DfApplicationContext.prototype.releaseObject = function() {
		this.m_application = null;
		oFF.XObjectExt.prototype.releaseObject.call(this);
	};
	oFF.DfApplicationContext.prototype.getLogWriter = function() {
		var session = this.getSession();
		if (oFF.notNull(session)) {
			return session.getLogWriter();
		}
		return null;
	};
	oFF.DfApplicationContext.prototype.getSession = function() {
		var application = this.getApplication();
		return oFF.isNull(application) ? null : application.getSession();
	};
	oFF.DfApplicationContext.prototype.getApplication = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_application);
	};
	oFF.DfApplicationContext.prototype.setApplication = function(application) {
		this.m_application = oFF.XWeakReferenceUtil.getWeakRef(application);
	};
	oFF.DfApplicationContext.prototype.toString = function() {
		return oFF.isNull(this.m_application) ? "" : this.m_application
				.toString();
	};
	oFF.DfApplicationContextHard = function() {
	};
	oFF.DfApplicationContextHard.prototype = new oFF.XObjectExt();
	oFF.DfApplicationContextHard.prototype.m_application = null;
	oFF.DfApplicationContextHard.prototype.setupApplicationContext = function(
			application) {
		this.setApplication(application);
	};
	oFF.DfApplicationContextHard.prototype.releaseObject = function() {
		this.m_application = null;
		oFF.XObjectExt.prototype.releaseObject.call(this);
	};
	oFF.DfApplicationContextHard.prototype.getLogWriter = function() {
		var session = this.getSession();
		if (oFF.notNull(session)) {
			return session.getLogWriter();
		}
		return null;
	};
	oFF.DfApplicationContextHard.prototype.getSession = function() {
		var application = this.getApplication();
		return oFF.isNull(application) ? null : application.getSession();
	};
	oFF.DfApplicationContextHard.prototype.getApplication = function() {
		return this.m_application;
	};
	oFF.DfApplicationContextHard.prototype.setApplication = function(
			application) {
		this.m_application = application;
	};
	oFF.DfApplicationContextHard.prototype.toString = function() {
		return oFF.isNull(this.m_application) ? "" : this.m_application
				.toString();
	};
	oFF.ConnectionCache = function() {
	};
	oFF.ConnectionCache.prototype = new oFF.XObject();
	oFF.ConnectionCache.create = function() {
		var obj = new oFF.ConnectionCache();
		obj.m_entries = oFF.XListOfNameObject.create();
		obj.m_isEnabled = false;
		obj.m_hitCount = 0;
		obj.m_maxCount = 1000;
		obj.m_timeout = 10000;
		return obj;
	};
	oFF.ConnectionCache.prototype.m_entries = null;
	oFF.ConnectionCache.prototype.m_isEnabled = false;
	oFF.ConnectionCache.prototype.m_maxCount = 0;
	oFF.ConnectionCache.prototype.m_timeout = 0;
	oFF.ConnectionCache.prototype.m_hitCount = 0;
	oFF.ConnectionCache.prototype.releaseObject = function() {
		if (oFF.notNull(this.m_entries)) {
			this.m_entries.clear();
			oFF.XObjectExt.release(this.m_entries);
			this.m_entries = null;
		}
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.ConnectionCache.prototype.isEnabled = function() {
		return this.m_isEnabled;
	};
	oFF.ConnectionCache.prototype.setEnabled = function(isEnabled) {
		this.m_isEnabled = isEnabled;
	};
	oFF.ConnectionCache.prototype.clear = function() {
		this.m_entries.clear();
	};
	oFF.ConnectionCache.prototype.size = function() {
		return this.m_entries.size();
	};
	oFF.ConnectionCache.prototype.isEmpty = function() {
		return this.m_entries.isEmpty();
	};
	oFF.ConnectionCache.prototype.hasElements = function() {
		return this.m_entries.hasElements();
	};
	oFF.ConnectionCache.prototype.put = function(key, element, debugHint) {
		var hasChanged = false;
		var current;
		var firstItem;
		var point;
		var pair;
		if (this.m_timeout !== -1) {
			current = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
			while (this.m_entries.size() > 0) {
				firstItem = this.m_entries.get(0);
				point = firstItem.getTimestamp() + this.m_timeout;
				if (point < current) {
					this.m_entries.removeAt(0);
					hasChanged = true;
				} else {
					break;
				}
			}
		}
		if (!hasChanged) {
			if (this.m_entries.size() > this.m_maxCount) {
				this.m_entries.removeAt(0);
			}
		}
		pair = oFF.ConnectionCacheItem.create(key, element);
		this.m_entries.add(pair);
	};
	oFF.ConnectionCache.prototype.getByKey = function(key) {
		var pair = this.m_entries.getByKey(key);
		if (oFF.notNull(pair)) {
			this.m_hitCount++;
			return pair.getItem();
		}
		return null;
	};
	oFF.ConnectionCache.prototype.setTimeout = function(timeout) {
		this.m_timeout = timeout;
	};
	oFF.ConnectionCache.prototype.getTimeout = function() {
		return this.m_timeout;
	};
	oFF.ConnectionCache.prototype.setMaxCount = function(maxCount) {
		this.m_maxCount = maxCount;
	};
	oFF.ConnectionCache.prototype.getMaxCount = function() {
		return this.m_maxCount;
	};
	oFF.ConnectionCache.prototype.getHitCount = function() {
		return this.m_hitCount;
	};
	oFF.Application = function() {
	};
	oFF.Application.prototype = new oFF.DfApplication();
	oFF.Application.create = function(session, version) {
		var application = new oFF.Application();
		application.setupApplication(session, version);
		return application;
	};
	oFF.Application.prototype.m_applicationName = null;
	oFF.Application.prototype.m_applicationId = null;
	oFF.Application.prototype.m_messageManager = null;
	oFF.Application.prototype.m_userManager = null;
	oFF.Application.prototype.m_repositoryManager = null;
	oFF.Application.prototype.m_connectionPool = null;
	oFF.Application.prototype.m_systemLandscape = null;
	oFF.Application.prototype.m_uiManager = null;
	oFF.Application.prototype.m_sapStatisticsEnabled = false;
	oFF.Application.prototype.m_sendBottleMessages = 0;
	oFF.Application.prototype.setupApplication = function(session, version) {
		this.setup();
		if (oFF.isNull(session)) {
			this.setSessionExt(oFF.DefaultSession.createWithVersion(version),
					true);
		} else {
			this.setSessionExt(session, false);
		}
		this.setErrorManager(oFF.MessageManager
				.createMessageManagerExt(session));
		this.m_connectionPool = oFF.ConnectionPool.create(this);
		this.m_repositoryManager = oFF.RepositoryManager.create(this);
		this.m_userManager = oFF.RuntimeUserManager.create(this);
		this.m_sapStatisticsEnabled = false;
		this.m_applicationId = oFF.XGuid.getGuid();
	};
	oFF.Application.prototype.releaseObject = function() {
		if (oFF.notNull(this.m_connectionPool)) {
			this.releaseManagedObjects();
			this.m_connectionPool = oFF.XObjectExt
					.release(this.m_connectionPool);
			this.m_messageManager = oFF.XObjectExt
					.release(this.m_messageManager);
			this.m_systemLandscape = oFF.XObjectExt
					.release(this.m_systemLandscape);
			this.m_uiManager = oFF.XObjectExt.release(this.m_uiManager);
			this.m_userManager = oFF.XObjectExt.release(this.m_userManager);
			this.m_repositoryManager = oFF.XObjectExt
					.release(this.m_repositoryManager);
			this.m_applicationName = null;
		}
		oFF.DfApplication.prototype.releaseObject.call(this);
	};
	oFF.Application.prototype.processBooting = oFF.noSupport;
	oFF.Application.prototype.getErrorManager = function() {
		return this.m_messageManager;
	};
	oFF.Application.prototype.setErrorManager = function(errorManager) {
		this.m_messageManager = errorManager;
	};
	oFF.Application.prototype.getSystemLandscape = function() {
		return this.m_systemLandscape;
	};
	oFF.Application.prototype.setSystemLandscape = function(systemLandscape) {
		this.m_systemLandscape = systemLandscape;
	};
	oFF.Application.prototype.getConnectionPool = function() {
		return this.m_connectionPool;
	};
	oFF.Application.prototype.getConnection = function(systemName) {
		return this.m_connectionPool.getConnection(systemName);
	};
	oFF.Application.prototype.getRepositoryManager = function() {
		return this.m_repositoryManager;
	};
	oFF.Application.prototype.getUiManager = function() {
		if (oFF.isNull(this.m_uiManager)) {
			this.m_uiManager = this.getSession().openSubSystem(
					oFF.SubSystemType.UIMANAGER);
			if (oFF.isNull(this.m_uiManager)) {
				this.m_uiManager = oFF.UiManagerFactory.newInstance(this
						.getSession());
			}
		}
		return this.m_uiManager;
	};
	oFF.Application.prototype.setUiManager = function(uiManager) {
		this.m_uiManager = uiManager;
	};
	oFF.Application.prototype.getApplicationName = function() {
		return this.m_applicationName;
	};
	oFF.Application.prototype.setApplicationName = function(name) {
		this.m_applicationName = name;
	};
	oFF.Application.prototype.isSapStatisticsEnabled = function() {
		return this.m_sapStatisticsEnabled;
	};
	oFF.Application.prototype.setSapStatisticsEnabled = function(enabled) {
		this.m_sapStatisticsEnabled = enabled;
	};
	oFF.Application.prototype.getUserManager = function() {
		return this.m_userManager;
	};
	oFF.Application.prototype.getSyncManager = function() {
		return this;
	};
	oFF.Application.prototype.receiveMessage = function(message) {
		var messageElement = oFF.JsonParserFactory.createFromString(message);
		var pool = this.getConnectionPool();
		var connList = messageElement.getListByKey("Connections");
		var i;
		var sys;
		var sysName;
		var sharedConnections;
		var k;
		var sharedConnInfo;
		var name;
		var csrfToken;
		var sessionUrlRewrite;
		for (i = 0; i < connList.size(); i++) {
			sys = connList.getStructureAt(i);
			sysName = sys.getStringByKey("SysName");
			sharedConnections = sys.getListByKey("Shared");
			for (k = 0; k < sharedConnections.size(); k++) {
				sharedConnInfo = sharedConnections.getStructureAt(k);
				name = sharedConnInfo.getStringByKey("Name");
				csrfToken = sharedConnInfo.getStringByKey("CsrfToken");
				sessionUrlRewrite = sharedConnInfo
						.getStringByKey("SessionUrlRewrite");
				pool.setExternalSharedConnection(sysName, name, csrfToken,
						sessionUrlRewrite);
			}
		}
	};
	oFF.Application.prototype.prepareMessage = function() {
		var messageElement = oFF.PrStructure.create();
		var pool;
		var activeSystems;
		var connList;
		var i;
		var sysName;
		var openConnections;
		var openConnCount;
		var sys;
		var shared;
		var k;
		var currentConnection;
		var element;
		var messageInABottle;
		messageElement.putString("AppId", this.m_applicationId);
		messageElement.putString("Time", oFF.XDateTime
				.createCurrentLocalDateTime().toIso8601Format());
		messageElement.putInteger("Number", this.m_sendBottleMessages);
		pool = this.getConnectionPool();
		activeSystems = pool.getActiveSystems();
		connList = messageElement.putNewList("Connections");
		for (i = 0; i < activeSystems.size(); i++) {
			sysName = activeSystems.get(i);
			openConnections = pool.getOpenConnections(sysName);
			openConnCount = openConnections.size();
			sys = connList.addNewStructure();
			sys.putString("SysName", sysName);
			sys.putInteger("OpenConn", openConnCount);
			shared = sys.putNewList("Shared");
			for (k = 0; k < openConnCount; k++) {
				currentConnection = openConnections.get(k);
				if (currentConnection.isShared()
						&& currentConnection.useSessionUrlRewrite()
						&& oFF.XStringUtils
								.isNotNullAndNotEmpty(currentConnection
										.getSessionUrlRewrite())) {
					element = shared.addNewStructure();
					element.putString("Name", currentConnection.getName());
					element.putString("CsrfToken", currentConnection
							.getCsrfToken());
					element.putString("SessionUrlRewrite", currentConnection
							.getSessionUrlRewrite());
				}
			}
		}
		messageInABottle = oFF.PrUtils.serialize(messageElement, false, false,
				0);
		return messageInABottle;
	};
	oFF.Application.prototype.toString = function() {
		var sb = oFF.XStringBuffer.create();
		sb.appendLine("Application");
		if (oFF.notNull(this.m_messageManager)) {
			sb.appendNewLine();
			sb.append(this.m_messageManager.toString());
		}
		return sb.toString();
	};
	oFF.SubApplication = function() {
	};
	oFF.SubApplication.prototype = new oFF.DfApplication();
	oFF.SubApplication.create = function(parentApplication) {
		var application = new oFF.SubApplication();
		application.setupSubApplication(parentApplication);
		return application;
	};
	oFF.SubApplication.prototype.m_parentApplication = null;
	oFF.SubApplication.prototype.m_subUiManager = null;
	oFF.SubApplication.prototype.setupSubApplication = function(
			parentApplication) {
		var parentSession;
		oFF.DfApplication.prototype.setup.call(this);
		parentSession = parentApplication.getSession();
		this.setSessionExt(parentSession.newSubSession(), true);
		this.m_parentApplication = parentApplication;
	};
	oFF.SubApplication.prototype.releaseObject = function() {
		this.releaseManagedObjects();
		this.m_subUiManager = oFF.XObjectExt.release(this.m_subUiManager);
		this.m_parentApplication.unregisterSubApplication(this);
		this.m_parentApplication = null;
		oFF.DfApplication.prototype.releaseObject.call(this);
	};
	oFF.SubApplication.prototype.getUserManager = function() {
		return this.m_parentApplication.getUserManager();
	};
	oFF.SubApplication.prototype.getConnectionPool = function() {
		return this.m_parentApplication.getConnectionPool();
	};
	oFF.SubApplication.prototype.getConnection = function(systemName) {
		return this.m_parentApplication.getConnection(systemName);
	};
	oFF.SubApplication.prototype.getRepositoryManager = function() {
		return this.m_parentApplication.getRepositoryManager();
	};
	oFF.SubApplication.prototype.getUiManager = function() {
		var uiManager;
		if (oFF.isNull(this.m_subUiManager)) {
			uiManager = this.m_parentApplication.getUiManager();
			if (oFF.notNull(uiManager)) {
				this.m_subUiManager = uiManager.newSubUiManager();
			}
		}
		return this.m_subUiManager;
	};
	oFF.SubApplication.prototype.setUiManager = function(uiManager) {
		this.m_subUiManager = uiManager;
	};
	oFF.SubApplication.prototype.setSapStatisticsEnabled = function(enabled) {
		this.m_parentApplication.setSapStatisticsEnabled(enabled);
	};
	oFF.SubApplication.prototype.isSapStatisticsEnabled = function() {
		return this.m_parentApplication.isSapStatisticsEnabled();
	};
	oFF.SubApplication.prototype.setApplicationName = function(name) {
		this.m_parentApplication.setApplicationName(name);
	};
	oFF.SubApplication.prototype.getApplicationName = function() {
		return this.m_parentApplication.getApplicationName();
	};
	oFF.SubApplication.prototype.setErrorManager = function(errorManager) {
		this.m_parentApplication.setErrorManager(errorManager);
	};
	oFF.SubApplication.prototype.getErrorManager = function() {
		return this.m_parentApplication.getErrorManager();
	};
	oFF.SubApplication.prototype.setSystemLandscape = function(systemLandscape) {
		this.m_parentApplication.setSystemLandscape(systemLandscape);
	};
	oFF.SubApplication.prototype.getSystemLandscape = function() {
		return this.m_parentApplication.getSystemLandscape();
	};
	oFF.SubApplication.prototype.getSyncManager = function() {
		return this.m_parentApplication.getSyncManager();
	};
	oFF.SubApplication.prototype.processBooting = oFF.noSupport;
	oFF.CapabilityContainer = function() {
	};
	oFF.CapabilityContainer.prototype = new oFF.XAbstractReadOnlyMap();
	oFF.CapabilityContainer.create = function(name) {
		var object = new oFF.CapabilityContainer();
		object.setupExt(name);
		return object;
	};
	oFF.CapabilityContainer.prototype.m_name = null;
	oFF.CapabilityContainer.prototype.clone = function() {
		var clone = oFF.CapabilityContainer.create(this.getName());
		clone.m_storage = this.m_storage.createMapByStringCopy();
		return clone;
	};
	oFF.CapabilityContainer.prototype.setupExt = function(name) {
		this.m_name = name;
		oFF.XAbstractReadOnlyMap.prototype.setup.call(this);
	};
	oFF.CapabilityContainer.prototype.releaseObject = function() {
		this.m_name = null;
		oFF.XAbstractReadOnlyMap.prototype.releaseObject.call(this);
	};
	oFF.CapabilityContainer.prototype.addCapabilityInfo = function(capability) {
		this.m_storage.put(capability.getName(), capability);
	};
	oFF.CapabilityContainer.prototype.addCapability = function(name) {
		this.m_storage.put(name, oFF.Capability
				.createCapabilityInfo(name, null));
	};
	oFF.CapabilityContainer.prototype.getSortedCapabilityNames = function() {
		var sortedList = oFF.XListOfString.create();
		var iterator = this.m_storage.getKeysAsIteratorOfString();
		while (iterator.hasNext()) {
			sortedList.add(iterator.next());
		}
		sortedList.sortByDirection(oFF.XSortDirection.ASCENDING);
		return sortedList;
	};
	oFF.CapabilityContainer.prototype.intersect = function(
			otherCapabilitySelection) {
		var newContainer = oFF.CapabilityContainer.create(this.getName());
		var iterator;
		var key;
		var capability;
		if (oFF.notNull(otherCapabilitySelection)) {
			iterator = otherCapabilitySelection.getKeysAsIteratorOfString();
			while (iterator.hasNext()) {
				key = iterator.next();
				capability = this.m_storage.getByKey(key);
				if (oFF.notNull(capability)) {
					newContainer.addCapabilityInfo(capability);
				}
			}
		}
		return newContainer;
	};
	oFF.CapabilityContainer.prototype.remove = function(name) {
		this.m_storage.remove(name);
	};
	oFF.CapabilityContainer.prototype.toString = function() {
		var buffer = oFF.XStringBuffer.create();
		var capabilities;
		var size;
		var i;
		buffer.append(this.m_name);
		buffer.appendLine(" Capabilities:");
		buffer.appendLine("{");
		capabilities = oFF.XCollectionUtils.createListCopy(this.m_storage
				.getValuesAsReadOnlyList());
		capabilities.sortByComparator(oFF.XComparatorName.create());
		size = capabilities.size();
		for (i = 0; i < size; i++) {
			if (i > 0) {
				buffer.appendLine(", ");
			}
			buffer.append(capabilities.get(i).toString());
		}
		oFF.XObjectExt.release(capabilities);
		buffer.appendNewLine();
		buffer.append("}");
		return buffer.toString();
	};
	oFF.CapabilityContainer.prototype.getName = function() {
		return this.m_name;
	};
	oFF.ConnectionCacheItem = function() {
	};
	oFF.ConnectionCacheItem.prototype = new oFF.DfNameObject();
	oFF.ConnectionCacheItem.create = function(name, element) {
		var item = new oFF.ConnectionCacheItem();
		item.setName(name);
		item.m_value = element;
		item.m_timestamp = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
		return item;
	};
	oFF.ConnectionCacheItem.prototype.m_value = null;
	oFF.ConnectionCacheItem.prototype.m_timestamp = 0;
	oFF.ConnectionCacheItem.prototype.releaseObject = function() {
		this.m_value = null;
		oFF.DfNameObject.prototype.releaseObject.call(this);
	};
	oFF.ConnectionCacheItem.prototype.getItem = function() {
		return this.m_value;
	};
	oFF.ConnectionCacheItem.prototype.getTimestamp = function() {
		return this.m_timestamp;
	};
	oFF.ConnectionPool = function() {
	};
	oFF.ConnectionPool.prototype = new oFF.DfApplicationContext();
	oFF.ConnectionPool.create = function(application) {
		var pool = new oFF.ConnectionPool();
		pool.setupApplicationContext(application);
		return pool;
	};
	oFF.ConnectionPool.prototype.m_systemConnectSet = null;
	oFF.ConnectionPool.prototype.m_cookiesMasterStore = null;
	oFF.ConnectionPool.prototype.m_batchRsStreamingEnabled = false;
	oFF.ConnectionPool.prototype.setupApplicationContext = function(application) {
		oFF.DfApplicationContext.prototype.setupApplicationContext.call(this,
				application);
		this.m_systemConnectSet = oFF.XSetOfNameObject.create();
		this.m_cookiesMasterStore = oFF.HttpCookiesMasterStore.create();
		this.m_batchRsStreamingEnabled = false;
	};
	oFF.ConnectionPool.prototype.releaseObject = function() {
		this.m_systemConnectSet = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_systemConnectSet);
		oFF.DfApplicationContext.prototype.releaseObject.call(this);
	};
	oFF.ConnectionPool.prototype.clearConnectionsForSystem = function(
			systemName) {
		var systemConnect = this.getSystemConnectIfExisting(systemName);
		if (oFF.notNull(systemConnect)) {
			systemConnect.clearConnections();
		}
	};
	oFF.ConnectionPool.prototype.clearConnections = function() {
		var sci = this.m_systemConnectSet.getIterator();
		while (sci.hasNext()) {
			sci.next().clearConnections();
		}
		oFF.XObjectExt.release(sci);
	};
	oFF.ConnectionPool.prototype.getAllOpenConnections = function() {
		var allOpenConnections = oFF.XList.create();
		var sci = this.m_systemConnectSet.getIterator();
		while (sci.hasNext()) {
			sci.next().getAllOpenConnections(allOpenConnections);
		}
		oFF.XObjectExt.release(sci);
		return allOpenConnections;
	};
	oFF.ConnectionPool.prototype.getOpenConnections = function(systemName) {
		return this.getSystemConnect(systemName).getAllOpenConnections(
				oFF.XList.create());
	};
	oFF.ConnectionPool.prototype.getConnection = function(systemName) {
		return this.getConnectionExt(systemName, false, null);
	};
	oFF.ConnectionPool.prototype.getConnectionExt = function(systemName,
			isPrivate, name) {
		return this.getSystemConnect(systemName).getConnectionExt(isPrivate,
				name);
	};
	oFF.ConnectionPool.prototype.getSystemLandscape = function() {
		return this.getApplication().getSystemLandscape();
	};
	oFF.ConnectionPool.prototype.getSession = function() {
		return this.getApplication().getSession();
	};
	oFF.ConnectionPool.prototype.getTraceInfo = function(systemName) {
		var systemConnect = this.getSystemConnect(systemName);
		var traceInfo = systemConnect.getTraceInfo();
		var session = this.getSession();
		var env = session.getEnvironment();
		var enableTracing = env.getBooleanByKeyExt(
				oFF.XEnvironmentConstants.ENABLE_HTTP_FILE_TRACING, false);
		var tracingFolder;
		var tracingFolderFile;
		if (enableTracing) {
			if (oFF.isNull(traceInfo)
					|| traceInfo.getTraceType() !== oFF.TraceType.FILE) {
				tracingFolder = env
						.getVariable(oFF.XEnvironmentConstants.HTTP_FILE_TRACING_FOLDER);
				if (oFF.notNull(tracingFolder)) {
					tracingFolderFile = oFF.XFile.createByNativePath(session,
							tracingFolder);
					if (tracingFolderFile.isExisting()
							&& tracingFolderFile.isDirectory()) {
						traceInfo = oFF.TraceInfo.create();
						traceInfo.setTraceFolderPath(tracingFolder);
						traceInfo.setTraceType(oFF.TraceType.FILE);
						traceInfo.setTraceName(this.getApplication()
								.getApplicationName());
						systemConnect.setTraceInfo(traceInfo);
						this.log2("Enabling file tracing: ", tracingFolder);
					}
				}
			}
		}
		return traceInfo;
	};
	oFF.ConnectionPool.prototype.getCache = function(systemName) {
		var systemConnect = this.getSystemConnect(systemName);
		var cache = systemConnect.getCache();
		if (oFF.isNull(cache)) {
			cache = oFF.ConnectionCache.create();
			systemConnect.setCache(cache);
		}
		return cache;
	};
	oFF.ConnectionPool.prototype.setTraceInfo = function(systemName, traceInfo) {
		this.getSystemConnect(systemName).setTraceInfo(traceInfo);
	};
	oFF.ConnectionPool.prototype.getAuthenticationToken = function(systemName) {
		var systemConnect = this.getSystemConnect(systemName);
		return systemConnect.getAuthenticationToken();
	};
	oFF.ConnectionPool.prototype.setAuthenticationToken = function(systemName,
			token) {
		var systemConnect = this.getSystemConnect(systemName);
		systemConnect.setAuthenticationToken(token);
	};
	oFF.ConnectionPool.prototype.getAccessToken = function(systemName) {
		var systemConnect = this.getSystemConnect(systemName);
		return systemConnect.getAccessToken();
	};
	oFF.ConnectionPool.prototype.setAccessToken = function(systemName, token) {
		var systemConnect = this.getSystemConnect(systemName);
		systemConnect.setAccessToken(token);
	};
	oFF.ConnectionPool.prototype.getReentranceTicket = function(systemName) {
		return this.getSystemConnect(systemName).getReentranceTicket();
	};
	oFF.ConnectionPool.prototype.setReentranceTicket = function(systemName,
			reentranceTicket) {
		this.getSystemConnect(systemName).setReentranceTicket(reentranceTicket);
	};
	oFF.ConnectionPool.prototype.enableBatchMode = function(systemName) {
		this.setBatchMode(null, systemName, true);
	};
	oFF.ConnectionPool.prototype.executeBatchQueue = function(syncType,
			systemName) {
		if (this.getSystemConnect(systemName).isBatchEnabled()) {
			this.setBatchMode(syncType, systemName, false);
			this.setBatchMode(syncType, systemName, true);
		}
	};
	oFF.ConnectionPool.prototype.getBatchQueueSize = function(systemName) {
		var size = 0;
		var systemConnect = this.getSystemConnect(systemName);
		var sysConnections = systemConnect.getSharedConnections();
		var i;
		if (oFF.notNull(sysConnections)) {
			for (i = 0; i < sysConnections.size(); i++) {
				size = size + sysConnections.get(i).getBatchQueueSize();
			}
		}
		return size;
	};
	oFF.ConnectionPool.prototype.disableBatchMode = function(syncType,
			systemName) {
		this.setBatchMode(syncType, systemName, false);
	};
	oFF.ConnectionPool.prototype.enableBatchStreaming = function() {
		this.m_batchRsStreamingEnabled = true;
	};
	oFF.ConnectionPool.prototype.disableBatchStreaming = function() {
		this.m_batchRsStreamingEnabled = false;
	};
	oFF.ConnectionPool.prototype.setBatchMode = function(syncType, systemName,
			isBatchEnabled) {
		var systemConnect = this.getSystemConnect(systemName);
		var sysConnections = systemConnect.getSharedConnections();
		var connection;
		var i;
		if (isBatchEnabled && sysConnections.isEmpty()) {
			connection = systemConnect.getConnectionExt(false, systemName);
			connection.getServerMetadata();
		}
		for (i = 0; i < sysConnections.size(); i++) {
			if (!isBatchEnabled && this.m_batchRsStreamingEnabled) {
				sysConnections.get(i).disableBatchModeWithRsStreaming(syncType);
			}
			sysConnections.get(i).setBatchModeEnabled(syncType, isBatchEnabled);
		}
		systemConnect.setIsBatchEnabled(isBatchEnabled);
	};
	oFF.ConnectionPool.prototype.isBatchModeEnabled = function(systemName) {
		return this.getSystemConnect(systemName).isBatchEnabled();
	};
	oFF.ConnectionPool.prototype.getMaximumSharedConnections = function(
			systemName) {
		return this.getSystemConnect(systemName).getMaximumSharedConnections();
	};
	oFF.ConnectionPool.prototype.setMaximumSharedConnections = function(
			systemName, maximumSharedConnections) {
		var systemConnect = this.getSystemConnect(systemName);
		if (oFF.notNull(systemConnect)) {
			systemConnect.setMaximumSharedConnections(maximumSharedConnections);
		}
	};
	oFF.ConnectionPool.prototype.getSystemConnectIfExisting = function(
			systemName) {
		return this.m_systemConnectSet.getByKey(this
				.resolveSystemName(systemName));
	};
	oFF.ConnectionPool.prototype.getSystemConnect = function(systemName) {
		var sysName = this.resolveSystemName(systemName);
		var systemConnect = this.m_systemConnectSet.getByKey(sysName);
		var systemDescription;
		if (oFF.isNull(systemConnect)) {
			systemDescription = this.getSystemLandscape().getSystemDescription(
					sysName);
			oFF.XObjectExt.checkNotNull(systemDescription, oFF.XStringUtils
					.concatenate3("System cannot be resolved: '", systemName,
							"'"));
			systemConnect = oFF.SystemConnect.create(this, sysName,
					systemDescription);
			this.m_systemConnectSet.add(systemConnect);
		}
		return systemConnect;
	};
	oFF.ConnectionPool.prototype.resolveSystemName = function(systemName) {
		if (oFF.isNull(systemName)) {
			return this.getSystemLandscape().getMasterSystemName();
		}
		return systemName;
	};
	oFF.ConnectionPool.prototype.getCookiesMasterStore = function() {
		return this.m_cookiesMasterStore;
	};
	oFF.ConnectionPool.prototype.getActiveSystems = function() {
		return this.m_systemConnectSet.getKeysAsReadOnlyListOfString();
	};
	oFF.ConnectionPool.prototype.setExternalActiveConnections = function(
			systemName, activeConnections) {
		var systemConnect = this.m_systemConnectSet.getByKey(systemName);
		if (oFF.notNull(systemConnect)) {
			systemConnect.setExternalActiveConnections(activeConnections);
		}
	};
	oFF.ConnectionPool.prototype.setExternalSharedConnection = function(
			systemName, name, csrfToken, sessionUrlRewrite) {
		var systemConnect = this.m_systemConnectSet.getByKey(systemName);
		if (oFF.notNull(systemConnect)) {
			systemConnect.setExternalSharedConnection(name, csrfToken,
					sessionUrlRewrite);
		}
	};
	oFF.SystemConnect = function() {
	};
	oFF.SystemConnect.prototype = new oFF.DfNameObject();
	oFF.SystemConnect.create = function(connectionPool, systemName,
			systemDescription) {
		var newObj = new oFF.SystemConnect();
		newObj._setupSystemConnect(connectionPool, systemName,
				systemDescription);
		return newObj;
	};
	oFF.SystemConnect._checkList = function(list) {
		var i;
		for (i = 0; i < list.size();) {
			if (list.get(i).isReleased()) {
				list.removeAt(i);
			} else {
				i++;
			}
		}
	};
	oFF.SystemConnect.clearConnectionsFromList = function(connections) {
		if (oFF.notNull(connections)) {
			while (connections.size() > 0) {
				oFF.XObjectExt.release(connections.get(0));
			}
		}
	};
	oFF.SystemConnect.prototype.m_connectionPool = null;
	oFF.SystemConnect.prototype.m_traceInfo = null;
	oFF.SystemConnect.prototype.m_cache = null;
	oFF.SystemConnect.prototype.m_isBatchEnabled = false;
	oFF.SystemConnect.prototype.m_reentranceTicket = null;
	oFF.SystemConnect.prototype.m_dirtyConnections = null;
	oFF.SystemConnect.prototype.m_sharedConnections = null;
	oFF.SystemConnect.prototype.m_privateConnections = null;
	oFF.SystemConnect.prototype.m_systemDescription = null;
	oFF.SystemConnect.prototype.m_maximumSharedConnections = 0;
	oFF.SystemConnect.prototype.m_currentSharedIndex = 0;
	oFF.SystemConnect.prototype.m_internalConnectionCounter = 0;
	oFF.SystemConnect.prototype.m_externalActiveConnections = 0;
	oFF.SystemConnect.prototype.m_isPreflightNeeded = false;
	oFF.SystemConnect.prototype.m_preflightUri = null;
	oFF.SystemConnect.prototype._setupSystemConnect = function(connectionPool,
			systemName, systemDescription) {
		var preflight;
		this.m_connectionPool = oFF.XWeakReferenceUtil
				.getWeakRef(connectionPool);
		this.setName(systemName);
		this.m_sharedConnections = oFF.XList.create();
		this.m_privateConnections = oFF.XList.create();
		this.m_dirtyConnections = oFF.XList.create();
		this.m_systemDescription = systemDescription;
		this.m_maximumSharedConnections = 1;
		preflight = this.m_systemDescription.getPreflightUri();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(preflight)) {
			this.m_preflightUri = oFF.XUri.createFromUri(preflight);
			this.m_isPreflightNeeded = true;
		}
	};
	oFF.SystemConnect.prototype.releaseObject = function() {
		this.clearConnections();
		this.m_cache = oFF.XObjectExt.release(this.m_cache);
		this.m_connectionPool = null;
		this.m_dirtyConnections = oFF.XObjectExt
				.release(this.m_dirtyConnections);
		this.m_privateConnections = oFF.XObjectExt
				.release(this.m_privateConnections);
		this.m_sharedConnections = oFF.XObjectExt
				.release(this.m_sharedConnections);
		this.m_reentranceTicket = null;
		this.m_systemDescription = null;
		this.m_traceInfo = null;
		oFF.DfNameObject.prototype.releaseObject.call(this);
	};
	oFF.SystemConnect.prototype._checkReleasedConnections = function() {
		oFF.SystemConnect._checkList(this.m_sharedConnections);
		oFF.SystemConnect._checkList(this.m_privateConnections);
		oFF.SystemConnect._checkList(this.m_dirtyConnections);
	};
	oFF.SystemConnect.prototype.getConnectionExt = function(isPrivate, name) {
		var sysConnections;
		var connectionContainer = null;
		var env;
		var uriSession;
		if (isPrivate) {
			sysConnections = this.getPrivateConnections();
		} else {
			sysConnections = this.getSharedConnections();
			connectionContainer = this.getNextSharedConnection(name);
		}
		if (oFF.isNull(connectionContainer)) {
			connectionContainer = oFF.ConnectionContainer.create(this, this
					.getSystemName(), isPrivate,
					this.m_internalConnectionCounter);
			this.m_internalConnectionCounter++;
			connectionContainer.setReentranceTicket(this.getReentranceTicket());
			connectionContainer.setName(name);
			if (this.m_systemDescription.getSystemType().isTypeOf(
					oFF.SystemType.BW)) {
				env = this.getConnectionPoolBase().getSession()
						.getEnvironment();
				uriSession = env.getBooleanByKeyExt(
						oFF.XEnvironmentConstants.HTTP_ALLOW_URI_SESSION, true);
				if (uriSession) {
					connectionContainer.setUseUrlSessionId(true);
				}
			}
			sysConnections.add(connectionContainer);
		}
		return connectionContainer;
	};
	oFF.SystemConnect.prototype.getNextSharedConnection = function(name) {
		var connection;
		var i;
		for (i = 0; i < this.m_sharedConnections.size();) {
			connection = this.m_sharedConnections.get(i);
			if (connection.isDirty()) {
				this.m_dirtyConnections.add(connection);
				this.m_sharedConnections.removeAt(i);
			} else {
				i++;
			}
		}
		if (oFF.notNull(name)) {
			connection = oFF.XCollectionUtils.getByName(
					this.m_sharedConnections, name);
			if (oFF.notNull(connection)) {
				return connection;
			}
		}
		if (this.m_isBatchEnabled && !this.m_sharedConnections.isEmpty()) {
			return this.m_sharedConnections.get(0);
		}
		if (this.getTotalUsedConnections() >= this.m_maximumSharedConnections) {
			if (this.m_currentSharedIndex >= this.m_sharedConnections.size()) {
				this.m_currentSharedIndex = 0;
			}
			connection = this.m_sharedConnections
					.get(this.m_currentSharedIndex);
			if (connection.getName() === null && oFF.notNull(name)) {
				connection.setName(name);
			}
			this.m_currentSharedIndex++;
			return connection;
		}
		return null;
	};
	oFF.SystemConnect.prototype.getTraceInfo = function() {
		return this.m_traceInfo;
	};
	oFF.SystemConnect.prototype.setTraceInfo = function(traceInfo) {
		this.m_traceInfo = traceInfo;
	};
	oFF.SystemConnect.prototype.getCache = function() {
		return this.m_cache;
	};
	oFF.SystemConnect.prototype.setCache = function(cache) {
		this.m_cache = cache;
	};
	oFF.SystemConnect.prototype.isBatchEnabled = function() {
		return this.m_isBatchEnabled;
	};
	oFF.SystemConnect.prototype.setIsBatchEnabled = function(isBatchEnabled) {
		this.m_isBatchEnabled = isBatchEnabled;
	};
	oFF.SystemConnect.prototype.getReentranceTicket = function() {
		return this.m_reentranceTicket;
	};
	oFF.SystemConnect.prototype.setReentranceTicket = function(reentranceTicket) {
		this.m_reentranceTicket = reentranceTicket;
	};
	oFF.SystemConnect.prototype.getAllOpenConnections = function(
			allOpenConnections) {
		allOpenConnections.addAll(this.m_sharedConnections);
		allOpenConnections.addAll(this.m_privateConnections);
		return allOpenConnections;
	};
	oFF.SystemConnect.prototype.getSharedConnections = function() {
		return this.m_sharedConnections;
	};
	oFF.SystemConnect.prototype.getPrivateConnections = function() {
		return this.m_privateConnections;
	};
	oFF.SystemConnect.prototype.clearConnections = function() {
		oFF.SystemConnect.clearConnectionsFromList(this.m_sharedConnections);
		oFF.SystemConnect.clearConnectionsFromList(this.m_privateConnections);
	};
	oFF.SystemConnect.prototype.getSystemName = function() {
		return this.getName();
	};
	oFF.SystemConnect.prototype.getSystemDescription = function() {
		return this.m_systemDescription;
	};
	oFF.SystemConnect.prototype.setMaximumSharedConnections = function(
			maximumSharedConnections) {
		this.m_maximumSharedConnections = maximumSharedConnections;
	};
	oFF.SystemConnect.prototype.getMaximumSharedConnections = function() {
		return this.m_maximumSharedConnections;
	};
	oFF.SystemConnect.prototype.setExternalActiveConnections = function(
			activeConnections) {
		this.m_externalActiveConnections = activeConnections;
	};
	oFF.SystemConnect.prototype.setExternalSharedConnection = function(name,
			csrfToken, sessionUrlRewrite) {
		var connection;
		var i;
		if (oFF.isNull(name)) {
			for (i = 0; i < this.m_sharedConnections.size();) {
				connection = this.m_sharedConnections.get(i);
				if (connection.isDirty() === false
						&& connection.useSessionUrlRewrite()
						&& oFF.XString.isEqual(connection
								.getSessionUrlRewrite(), sessionUrlRewrite)) {
					return;
				}
			}
			if (this.getTotalUsedConnections() < this.m_maximumSharedConnections) {
				connection = this.getConnectionExt(false, name);
				if (oFF.notNull(connection)) {
					if (connection.useSessionUrlRewrite()
							&& connection.getSessionUrlRewrite() === null) {
						connection.setSessionUrlRewrite(sessionUrlRewrite);
						connection.setCsrfToken(csrfToken);
					}
				}
			}
		}
	};
	oFF.SystemConnect.prototype.getTotalUsedConnections = function() {
		return this.m_sharedConnections.size()
				+ this.m_externalActiveConnections;
	};
	oFF.SystemConnect.prototype.getConnectionPoolBase = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_connectionPool);
	};
	oFF.SystemConnect.prototype.getAuthenticationToken = function() {
		var userManager = this.getUserManager();
		var systemName = this.getSystemName();
		var authenticationToken = userManager
				.getAuthenticationToken(systemName);
		return authenticationToken;
	};
	oFF.SystemConnect.prototype.setAuthenticationToken = function(token) {
		var userManager = this.getUserManager();
		var systemName = this.getSystemName();
		userManager.setAuthenticationToken(systemName, token);
	};
	oFF.SystemConnect.prototype.getAccessToken = function() {
		var userManager = this.getUserManager();
		var systemName = this.getSystemName();
		var accessToken = userManager.getAccessToken(systemName);
		return accessToken;
	};
	oFF.SystemConnect.prototype.setAccessToken = function(token) {
		var userManager = this.getUserManager();
		var systemName = this.getSystemName();
		userManager.setAccessToken(systemName, token);
	};
	oFF.SystemConnect.prototype.isPreflightNeeded = function() {
		return this.m_isPreflightNeeded;
	};
	oFF.SystemConnect.prototype.setIsPreflightNeeded = function(
			isPrefligthNeeded) {
		this.m_isPreflightNeeded = isPrefligthNeeded;
	};
	oFF.SystemConnect.prototype.getPreflightUri = function() {
		return this.m_preflightUri;
	};
	oFF.SystemConnect.prototype.getUserManager = function() {
		return this.getConnectionPoolBase().getApplication().getUserManager();
	};
	oFF.ServerMetadata = function() {
	};
	oFF.ServerMetadata.prototype = new oFF.XObject();
	oFF.ServerMetadata.create = function(session, rootElement) {
		var object = new oFF.ServerMetadata();
		object.setupExt(session, rootElement);
		return object;
	};
	oFF.ServerMetadata.createBetaCapabilitiesContainer = function(
			currentService) {
		var name = currentService
				.getStringByKey(oFF.InAConstantsBios.PR_SERVICE);
		var container = oFF.CapabilityContainer.create(name);
		var capabilitiesList = currentService
				.getListByKey(oFF.InAConstantsBios.PR_CAPABILITIESDEV);
		var capabilitiesSize;
		var idxCapability;
		var capability;
		var capabilityName;
		var value;
		if (oFF.notNull(capabilitiesList)) {
			capabilitiesSize = capabilitiesList.size();
			for (idxCapability = 0; idxCapability < capabilitiesSize; idxCapability++) {
				capability = capabilitiesList.getStructureAt(idxCapability);
				capabilityName = capability
						.getStringByKey(oFF.InAConstantsBios.PR_CAPABILITY);
				value = capability
						.getStringByKey(oFF.InAConstantsBios.PR_VALUE);
				container.addCapabilityInfo(oFF.Capability
						.createCapabilityInfo(capabilityName, value));
			}
		}
		return container;
	};
	oFF.ServerMetadata.createCapabilitiesContainer = function(session,
			currentService) {
		var serviceName = currentService
				.getStringByKey(oFF.InAConstantsBios.PR_SERVICE);
		var container = oFF.CapabilityContainer.create(serviceName);
		var capabilitiesList = currentService
				.getListByKey(oFF.InAConstantsBios.PR_CAPABILITIES);
		var capabilitiesSize;
		var idxCapability;
		var inaCapability;
		var capabilityName;
		var value;
		if (oFF.notNull(capabilitiesList)) {
			capabilitiesSize = capabilitiesList.size();
			for (idxCapability = 0; idxCapability < capabilitiesSize; idxCapability++) {
				inaCapability = capabilitiesList.getStructureAt(idxCapability);
				capabilityName = inaCapability
						.getStringByKey(oFF.InAConstantsBios.PR_CAPABILITY);
				if (oFF.isNull(capabilityName)) {
					session
							.getLogger()
							.log2(
									"WARNING: found capability with empty (NULL) name. This capability will be ignored. The current service is: ",
									serviceName);
					continue;
				}
				value = inaCapability
						.getStringByKey(oFF.InAConstantsBios.PR_VALUE);
				container.addCapabilityInfo(oFF.Capability
						.createCapabilityInfo(capabilityName, value));
			}
		}
		return container;
	};
	oFF.ServerMetadata.prototype.m_session = null;
	oFF.ServerMetadata.prototype.m_rootStructure = null;
	oFF.ServerMetadata.prototype.m_logonData = null;
	oFF.ServerMetadata.prototype.m_serverServiceMetadata = null;
	oFF.ServerMetadata.prototype.m_serverBetaServiceMetadata = null;
	oFF.ServerMetadata.prototype.m_properties = null;
	oFF.ServerMetadata.prototype.releaseObject = function() {
		this.m_properties = oFF.XObjectExt.release(this.m_properties);
		this.m_serverServiceMetadata = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_serverServiceMetadata);
		this.m_serverBetaServiceMetadata = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_serverBetaServiceMetadata);
		this.m_rootStructure = null;
		this.m_session = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.ServerMetadata.prototype.setupExt = function(session, rootElement) {
		var services;
		var size;
		var i;
		var service;
		var capabilitiesContainer;
		this.m_session = session;
		this.m_properties = oFF.XProperties.create();
		this.m_serverServiceMetadata = oFF.XHashMapByString.create();
		this.m_serverBetaServiceMetadata = oFF.XHashMapByString.create();
		this.m_rootStructure = rootElement;
		if (oFF.notNull(this.m_rootStructure)) {
			if (this.m_rootStructure
					.containsKey(oFF.InAConstantsBios.PR_SERVICES)) {
				services = this.m_rootStructure
						.getListByKey(oFF.InAConstantsBios.PR_SERVICES);
				size = services.size();
				for (i = 0; i < size; i++) {
					service = services.getStructureAt(i);
					capabilitiesContainer = oFF.ServerMetadata
							.createCapabilitiesContainer(session, service);
					this.m_serverServiceMetadata.putIfNotNull(
							capabilitiesContainer.getName(),
							capabilitiesContainer);
					if (oFF.XString.isEqual(capabilitiesContainer.getName(),
							oFF.ServerService.ANALYTIC)) {
						this.m_serverBetaServiceMetadata
								.putIfNotNull(
										oFF.ServerService.ANALYTIC,
										oFF.ServerMetadata
												.createBetaCapabilitiesContainer(service));
					}
				}
			}
			this.readProperties(oFF.InAConstantsBios.PR_SETTINGS);
			this.readProperties(oFF.InAConstantsBios.PR_SERVER_INFO);
		} else {
			this.m_serverBetaServiceMetadata.put(oFF.ServerService.ANALYTIC,
					oFF.CapabilityContainer.create(null));
			this.m_serverServiceMetadata.put(oFF.ServerService.ANALYTIC,
					oFF.CapabilityContainer.create(null));
		}
	};
	oFF.ServerMetadata.prototype.addLogonInfo = function(data) {
		var sessionStructure;
		var tenant;
		var userStructure;
		var userName;
		var userMetadataStructure;
		this.m_logonData = data;
		sessionStructure = this.m_logonData.getStructureByKey("session");
		if (oFF.notNull(sessionStructure)) {
			tenant = sessionStructure.getListByKey("tenant");
			if (oFF.XCollectionUtils.hasElements(tenant)) {
				this.m_properties.put(oFF.InAConstantsBios.PR_SI_TENANT, tenant
						.getStructureAt(0).getStringByKey("id"));
			}
		}
		userStructure = this.m_logonData.getStructureByKey("user");
		if (oFF.notNull(userStructure)) {
			userName = userStructure.getStringByKey("userName");
			if (oFF.isNull(userName)) {
				userMetadataStructure = userStructure
						.getStructureByKey("metadata");
				userName = userMetadataStructure.getStringByKey("userName");
			}
			this.m_properties.put(oFF.InAConstantsBios.PR_SI_USER_NAME,
					userName);
		}
	};
	oFF.ServerMetadata.prototype.readProperties = function(name) {
		var serverInfo;
		var structureElementNames;
		var j;
		var key;
		var value;
		if (this.m_rootStructure.containsKey(name)
				&& this.m_rootStructure.getElementTypeByKey(name) === oFF.PrElementType.STRUCTURE) {
			serverInfo = this.m_rootStructure.getStructureByKey(name);
			structureElementNames = serverInfo.getKeysAsReadOnlyListOfString();
			for (j = 0; j < structureElementNames.size(); j++) {
				key = structureElementNames.get(j);
				if (serverInfo.getElementTypeByKey(key) !== oFF.PrElementType.STRING) {
					continue;
				}
				value = serverInfo.getStringByKey(key);
				this.m_properties.put(key, value);
			}
		}
	};
	oFF.ServerMetadata.prototype.getBetaMetadataForAnalytic = function() {
		return this.m_serverBetaServiceMetadata
				.getByKey(oFF.ServerService.ANALYTIC);
	};
	oFF.ServerMetadata.prototype.getMetadataForService = function(name) {
		return this.m_serverServiceMetadata.getByKey(name);
	};
	oFF.ServerMetadata.prototype.getProperties = function() {
		return this.m_properties;
	};
	oFF.ServerMetadata.prototype.getType = function() {
		return this.m_properties
				.getByKey(oFF.InAConstantsBios.PR_SI_SERVER_TYPE);
	};
	oFF.ServerMetadata.prototype.getVersion = function() {
		return this.m_properties.getByKey(oFF.InAConstantsBios.PR_SI_VERSION);
	};
	oFF.ServerMetadata.prototype.getId = function() {
		return this.m_properties.getByKey(oFF.InAConstantsBios.PR_SI_SYSTEM_ID);
	};
	oFF.ServerMetadata.prototype.getBuildTime = function() {
		return this.m_properties
				.getByKey(oFF.InAConstantsBios.PR_SI_BUILD_TIME);
	};
	oFF.ServerMetadata.prototype.getClient = function() {
		return this.m_properties.getByKey(oFF.InAConstantsBios.PR_SI_CLIENT);
	};
	oFF.ServerMetadata.prototype.getTenantId = function() {
		return this.m_properties.getByKey(oFF.InAConstantsBios.PR_SI_TENANT);
	};
	oFF.ServerMetadata.prototype.getOrcaUserName = function() {
		return this.m_properties.getByKey(oFF.InAConstantsBios.PR_SI_USER_NAME);
	};
	oFF.ServerMetadata.prototype.getUserLanguage = function() {
		return this.m_properties.getByKey(oFF.InAConstantsBios.PR_SI_LANGUAGE);
	};
	oFF.ServerMetadata.prototype.getReentranceTicket = function() {
		return this.m_properties
				.getByKey(oFF.InAConstantsBios.PR_SI_REENTRANCE_TICKET);
	};
	oFF.ServerMetadata.prototype.getServices = function() {
		return this.m_serverServiceMetadata.getKeysAsReadOnlyListOfString();
	};
	oFF.ServerMetadata.prototype.getSession = function() {
		return this.m_session;
	};
	oFF.ServerMetadata.prototype.toString = function() {
		return this.m_rootStructure.toString();
	};
	oFF.ServerMetadata.prototype.supportsAnalyticCapability = function(
			capabilityName) {
		return this.supportsAnalyticCapabilityAsProd(capabilityName)
				|| this.supportsAnalyticCapabilityAsDev(capabilityName);
	};
	oFF.ServerMetadata.prototype.supportsAnalyticCapabilityAsProd = function(
			capabilityName) {
		var analyticMain = this
				.getMetadataForService(oFF.ServerService.ANALYTIC);
		return oFF.isNull(analyticMain) ? false : analyticMain
				.containsKey(capabilityName);
	};
	oFF.ServerMetadata.prototype.supportsAnalyticCapabilityAsDev = function(
			capabilityName) {
		var analyticDev = this.getBetaMetadataForAnalytic();
		return oFF.isNull(analyticDev) ? false : analyticDev
				.containsKey(capabilityName);
	};
	oFF.ServerMetadata.prototype.getApplication = function() {
		return null;
	};
	oFF.DfApplicationProgram = function() {
	};
	oFF.DfApplicationProgram.prototype = new oFF.DfProgram();
	oFF.DfApplicationProgram.PARAM_TRACE_NAME = "TraceName";
	oFF.DfApplicationProgram.PARAM_ENABLE_CACHES = "EnableCaches";
	oFF.DfApplicationProgram.PARAM_SYS_USE_MIRRORS = "UseMirrors";
	oFF.DfApplicationProgram.PARAM_SYS_LANDSCAPE = "SystemLandscape";
	oFF.DfApplicationProgram.prototype.m_releaseApplication = false;
	oFF.DfApplicationProgram.prototype.m_application = null;
	oFF.DfApplicationProgram.prototype.m_traceName = null;
	oFF.DfApplicationProgram.prototype.m_initialSystemType = null;
	oFF.DfApplicationProgram.prototype.m_useMirrors = false;
	oFF.DfApplicationProgram.prototype.m_enableCaches = false;
	oFF.DfApplicationProgram.prototype.m_cachePath = null;
	oFF.DfApplicationProgram.prototype.m_masterSystemName = null;
	oFF.DfApplicationProgram.prototype.m_systemLandscapePath = null;
	oFF.DfApplicationProgram.prototype.m_systemOption = null;
	oFF.DfApplicationProgram.prototype.m_mountPoints = null;
	oFF.DfApplicationProgram.prototype.doSetupProgramMetadata = function(
			metadata) {
		oFF.DfProgram.prototype.doSetupProgramMetadata.call(this, metadata);
		metadata.addOption(oFF.DfApplicationProgram.PARAM_TRACE_NAME,
				"The trace name", "name", oFF.XValueType.STRING);
		metadata.addOption(oFF.DfApplicationProgram.PARAM_ENABLE_CACHES,
				"Enables the cache.", "true|false", oFF.XValueType.BOOLEAN);
		metadata.addOption(oFF.DfApplicationProgram.PARAM_SYS_USE_MIRRORS,
				"Using the system mirrors.", "true|false",
				oFF.XValueType.BOOLEAN);
		metadata.addOption(oFF.DfApplicationProgram.PARAM_SYS_LANDSCAPE,
				"The System landscape.", "true|false", oFF.XValueType.BOOLEAN);
	};
	oFF.DfApplicationProgram.prototype.setup = function() {
		oFF.DfProgram.prototype.setup.call(this);
		this.m_useMirrors = false;
		this.m_enableCaches = false;
		this.m_masterSystemName = "gipsy";
		this.m_mountPoints = oFF.XList.create();
	};
	oFF.DfApplicationProgram.prototype.releaseObject = function() {
		this.m_initialSystemType = null;
		this.m_traceName = null;
		if (this.m_releaseApplication === true) {
			this.m_application = oFF.XObjectExt.release(this.m_application);
		}
		oFF.DfProgram.prototype.releaseObject.call(this);
	};
	oFF.DfApplicationProgram.prototype.getComponentType = function() {
		return oFF.RuntimeComponentType.APPLICATION_PROGRAM;
	};
	oFF.DfApplicationProgram.prototype.initializeProgram = function() {
		var session;
		var extResult;
		var systemOption;
		var systemLandscapePath;
		var initialSystemType;
		var systemLandscape;
		var masterSystemName;
		var application2;
		var connectionPool;
		var systemNames;
		var t;
		var traceInfo;
		var repositoryManager;
		var i;
		var mountPoint;
		var repositoryManager2;
		var cacheDirectory;
		var cacheProvider;
		oFF.DfProgram.prototype.initializeProgram.call(this);
		if (this.isShowHelp() === false) {
			if (this.getApplication() === null) {
				session = this.getSession();
				systemOption = this.getSystemOption();
				systemLandscapePath = this.getSystemLandscapeUrl();
				initialSystemType = this.getInitialSystemType();
				if (systemOption === oFF.ApplicationSystemOption.LOCATION_AND_TYPE
						&& oFF.notNull(initialSystemType)) {
					extResult = oFF.ApplicationFactory.createApplicationFull(
							session, oFF.XVersion.MAX, initialSystemType,
							"master", null, null, oFF.SyncType.BLOCKING, null);
					this.setApplicationExt(extResult.getData(), true);
					oFF.XObjectExt.release(extResult);
				} else {
					if (systemOption === oFF.ApplicationSystemOption.PATH
							&& oFF.notNull(systemLandscapePath)) {
						extResult = oFF.ApplicationFactory
								.createApplicationWithVersionAndLandscape(
										session, oFF.XVersion.MAX,
										systemLandscapePath);
						if (extResult.hasErrors()) {
							this.log("Error during application initialization");
							this.log(extResult.getSummary());
						} else {
							this.setApplicationExt(extResult.getData(), true);
							systemLandscape = this.getApplication()
									.getSystemLandscape();
							masterSystemName = this.getMasterSystemName();
							if (oFF.notNull(masterSystemName)) {
								systemLandscape
										.setDefaultSystemName(
												oFF.SystemRole.MASTER,
												masterSystemName);
							}
							if (this.useMirrors()) {
								systemLandscape.replaceOriginsWithMirror();
							}
						}
						oFF.XObjectExt.release(extResult);
					}
				}
				application2 = this.getApplication();
				if (oFF.isNull(application2)) {
					extResult = oFF.ApplicationFactory.createApplicationFull(
							session, oFF.XVersion.MAX, null, null, null, null,
							oFF.SyncType.BLOCKING, null);
					this.setApplicationExt(extResult.getData(), true);
					oFF.XObjectExt.release(extResult);
				}
				if (oFF.notNull(application2)) {
					if (oFF.notNull(this.m_traceName)) {
						application2.setApplicationName(this.m_traceName);
						connectionPool = application2.getConnectionPool();
						systemNames = application2.getSystemLandscape()
								.getSystemNames();
						for (t = 0; t < systemNames.size(); t++) {
							traceInfo = oFF.TraceInfo.create();
							traceInfo.setTraceType(oFF.TraceType.URL);
							traceInfo.setTraceName(this.m_traceName);
							connectionPool.setTraceInfo(systemNames.get(t),
									traceInfo);
						}
					}
					repositoryManager = this.m_application
							.getRepositoryManager();
					for (i = 0; i < this.m_mountPoints.size(); i++) {
						mountPoint = this.m_mountPoints.get(i);
						repositoryManager.addMountPointExt(
								oFF.RepoMountType.FILE, mountPoint.getName(),
								mountPoint.getValue());
					}
				}
			}
			if (this.enableCaches()) {
				if (oFF.notNull(this.m_cachePath)) {
					repositoryManager2 = this.getApplication()
							.getRepositoryManager();
					cacheDirectory = oFF.XFile.createExt(this.getSession(),
							null, this.m_cachePath, oFF.PathFormat.AUTO_DETECT,
							oFF.VarResolveMode.DOLLAR);
					if (oFF.notNull(cacheDirectory)) {
						cacheProvider = oFF.CacheProvider
								.create(cacheDirectory);
						repositoryManager2.setCache(cacheProvider);
					}
				}
			}
		}
	};
	oFF.DfApplicationProgram.prototype.evalArguments = function() {
		var initArguments;
		var url;
		oFF.DfProgram.prototype.evalArguments.call(this);
		initArguments = this.getArgumentStructure();
		this.m_traceName = initArguments.getStringByKeyExt(
				oFF.DfApplicationProgram.PARAM_TRACE_NAME, this.m_traceName);
		this.m_useMirrors = initArguments.getBooleanByKeyExt(
				oFF.DfApplicationProgram.PARAM_SYS_USE_MIRRORS,
				this.m_useMirrors);
		this.m_enableCaches = initArguments.getBooleanByKeyExt(
				oFF.DfApplicationProgram.PARAM_ENABLE_CACHES,
				this.m_enableCaches);
		this.m_cachePath = oFF.XEnvironment.getInstance().getVariable(
				oFF.XEnvironmentConstants.FIREFLY_CACHE);
		this.m_systemLandscapePath = initArguments.getStringByKeyExt(
				oFF.DfApplicationProgram.PARAM_SYS_LANDSCAPE,
				this.m_systemLandscapePath);
		if (oFF.isNull(this.m_systemLandscapePath)) {
			url = oFF.XFile
					.convertToUrl(
							this.getSession(),
							"$[ff_sdk]$/production/systems/SystemLandscapeAllWithPwds.json",
							oFF.PathFormat.AUTO_DETECT,
							oFF.VarResolveMode.DOLLAR);
			if (oFF.notNull(url)) {
				this.m_systemLandscapePath = url.getUriString();
			}
		}
		if (oFF.isNull(this.m_systemOption)) {
			if (oFF.notNull(this.m_systemLandscapePath)) {
				this.m_systemOption = oFF.ApplicationSystemOption.PATH;
			} else {
				if (oFF.notNull(this.m_initialSystemType)) {
					this.m_systemOption = oFF.ApplicationSystemOption.LOCATION_AND_TYPE;
				} else {
					this.m_systemOption = oFF.ApplicationSystemOption.NONE;
				}
			}
		}
	};
	oFF.DfApplicationProgram.prototype.setApplication = function(application) {
		this.setApplicationExt(application, false);
	};
	oFF.DfApplicationProgram.prototype.setApplicationExt = function(
			application, releaseApplication) {
		if (oFF.notNull(application) && this.getSession() === null) {
			this.setSession(application.getSession());
		}
		this.m_application = application;
		this.m_releaseApplication = releaseApplication;
	};
	oFF.DfApplicationProgram.prototype.getApplication = function() {
		return this.m_application;
	};
	oFF.DfApplicationProgram.prototype.getTraceName = function() {
		return this.m_traceName;
	};
	oFF.DfApplicationProgram.prototype.setTraceName = function(traceName) {
		this.m_traceName = traceName;
	};
	oFF.DfApplicationProgram.prototype.setInitialSystemType = function(
			systemType) {
		this.m_initialSystemType = systemType;
	};
	oFF.DfApplicationProgram.prototype.getInitialSystemType = function() {
		return this.m_initialSystemType;
	};
	oFF.DfApplicationProgram.prototype.useMirrors = function() {
		return this.m_useMirrors;
	};
	oFF.DfApplicationProgram.prototype.setUseMirrors = function(useMirrors) {
		this.m_useMirrors = useMirrors;
	};
	oFF.DfApplicationProgram.prototype.enableCaches = function() {
		return this.m_enableCaches;
	};
	oFF.DfApplicationProgram.prototype.setEnableCaches = function(enableCaches) {
		this.m_enableCaches = enableCaches;
	};
	oFF.DfApplicationProgram.prototype.setCachePath = function(cachePath) {
		this.m_cachePath = cachePath;
	};
	oFF.DfApplicationProgram.prototype.getCachePath = function() {
		return this.m_cachePath;
	};
	oFF.DfApplicationProgram.prototype.getMasterSystemName = function() {
		return this.m_masterSystemName;
	};
	oFF.DfApplicationProgram.prototype.setMasterSystemName = function(
			masterSystemName) {
		this.m_masterSystemName = masterSystemName;
	};
	oFF.DfApplicationProgram.prototype.getSystemLandscapeUrl = function() {
		return this.m_systemLandscapePath;
	};
	oFF.DfApplicationProgram.prototype.setSystemLandscapeUrl = function(url) {
		this.m_systemLandscapePath = url;
	};
	oFF.DfApplicationProgram.prototype.getSystemOption = function() {
		return this.m_systemOption;
	};
	oFF.DfApplicationProgram.prototype.setSystemOption = function(option) {
		this.m_systemOption = option;
	};
	oFF.DfApplicationProgram.prototype.addMountPoint = function(name, path) {
		this.m_mountPoints.add(oFF.XNameValuePair.createWithValues(name, path));
	};
	oFF.RepoMountPoint = function() {
	};
	oFF.RepoMountPoint.prototype = new oFF.DfNameObject();
	oFF.RepoMountPoint.createConditional = function(session, type, name, url) {
		var uri = oFF.XFile.convertToUrl(session, url,
				oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
		if (oFF.notNull(uri)) {
			return oFF.RepoMountPoint.create(type, name, uri);
		} else {
			return null;
		}
	};
	oFF.RepoMountPoint.create = function(type, name, uri) {
		var newObj = new oFF.RepoMountPoint();
		newObj.setupExt(type, name, uri);
		return newObj;
	};
	oFF.RepoMountPoint.prototype.m_uri = null;
	oFF.RepoMountPoint.prototype.m_type = null;
	oFF.RepoMountPoint.prototype.setupExt = function(type, name, uri) {
		this.setName(name);
		this.m_uri = uri;
		this.m_type = type;
	};
	oFF.RepoMountPoint.prototype.getUri = function() {
		return this.m_uri;
	};
	oFF.RepoMountPoint.prototype.getMountType = function() {
		return this.m_type;
	};
	oFF.RepositoryManager = function() {
	};
	oFF.RepositoryManager.prototype = new oFF.DfApplicationContext();
	oFF.RepositoryManager.create = function(application) {
		var rm = new oFF.RepositoryManager();
		rm.setupApplicationContext(application);
		return rm;
	};
	oFF.RepositoryManager.prototype.m_location = null;
	oFF.RepositoryManager.prototype.m_cacheProvider = null;
	oFF.RepositoryManager.prototype.m_mountingPoints = null;
	oFF.RepositoryManager.prototype.setupApplicationContext = function(
			application) {
		var session;
		oFF.DfApplicationContext.prototype.setupApplicationContext.call(this,
				application);
		this.m_mountingPoints = oFF.XList.create();
		session = application.getSession();
		this.m_cacheProvider = session.getCache();
	};
	oFF.RepositoryManager.prototype.getLocation = function() {
		return this.m_location;
	};
	oFF.RepositoryManager.prototype.setLocation = function(location) {
		this.m_location = location;
	};
	oFF.RepositoryManager.prototype.newRpcFunction = function(uri) {
		var application = this.getApplication();
		var repositoryManager = application.getRepositoryManager();
		var repositoryLocation = repositoryManager.getLocation();
		var uriObj;
		var systemUriString;
		var systemUri;
		var rpcUriString;
		var systemLandscape;
		var tempSystemName;
		var connection;
		var rpcFunction;
		var request;
		if (oFF.isNull(repositoryLocation)) {
			uriObj = oFF.XUri.createFromUri(uri);
		} else {
			uriObj = oFF.XUri.createFromUriWithParent(uri, repositoryLocation,
					false);
		}
		systemUriString = uriObj.getUriStringExt(true, true, true, true, true,
				false, false, false);
		systemUri = oFF.XUri.createFromUri(systemUriString);
		rpcUriString = uriObj.getUriStringExt(false, false, false, false,
				false, true, true, true);
		systemLandscape = application.getSystemLandscape();
		tempSystemName = oFF.XStringUtils.concatenate3("##Tmp#", oFF.XGuid
				.getGuid(), "##");
		systemLandscape.setSystemByUri(tempSystemName, systemUri,
				oFF.SystemType.GENERIC);
		connection = application.getConnection(tempSystemName);
		rpcFunction = connection.newRpcFunction(rpcUriString);
		request = rpcFunction.getRequest();
		request.setMethod(oFF.HttpRequestMethod.HTTP_GET);
		return rpcFunction;
	};
	oFF.RepositoryManager.prototype.writeElementToCache = function(
			cacheNamespace, cacheId, element) {
		if (oFF.notNull(this.m_cacheProvider)) {
			this.m_cacheProvider.writeElementToCache(cacheNamespace, cacheId,
					element);
		}
	};
	oFF.RepositoryManager.prototype.readElementFromCache = function(
			cacheNamespace, cacheId) {
		return oFF.isNull(this.m_cacheProvider) ? null : this.m_cacheProvider
				.readElementFromCache(cacheNamespace, cacheId);
	};
	oFF.RepositoryManager.prototype.writeStringToCache = function(
			cacheNamespace, cacheId, strValue) {
		if (oFF.notNull(this.m_cacheProvider)) {
			this.m_cacheProvider.writeStringToCache(cacheNamespace, cacheId,
					strValue);
		}
	};
	oFF.RepositoryManager.prototype.readStringFromCache = function(
			cacheNamespace, cacheId) {
		return oFF.isNull(this.m_cacheProvider) ? null : this.m_cacheProvider
				.readStringFromCache(cacheNamespace, cacheId);
	};
	oFF.RepositoryManager.prototype.clearCache = function(cacheNamespace) {
		if (oFF.notNull(this.m_cacheProvider)) {
			this.m_cacheProvider.clearCache(cacheNamespace);
		}
	};
	oFF.RepositoryManager.prototype.setCache = function(cache) {
		var session;
		this.m_cacheProvider = cache;
		session = this.getApplication().getSession();
		if (session.getCache() === null) {
			session.setCache(cache);
		}
	};
	oFF.RepositoryManager.prototype.getCache = function() {
		return this.m_cacheProvider;
	};
	oFF.RepositoryManager.prototype.getMountPoint = function(type) {
		var mountPoints = this.getMountPoints(type);
		if (mountPoints.size() > 0) {
			return mountPoints.get(0);
		} else {
			return null;
		}
	};
	oFF.RepositoryManager.prototype.getMountPoints = function(type) {
		var list;
		var i;
		var mountPoint;
		if (oFF.isNull(type)) {
			return this.m_mountingPoints;
		} else {
			list = oFF.XList.create();
			for (i = 0; i < this.m_mountingPoints.size(); i++) {
				mountPoint = this.m_mountingPoints.get(i);
				if (mountPoint.getMountType() === type) {
					list.add(mountPoint);
				}
			}
			return list;
		}
	};
	oFF.RepositoryManager.prototype.addMountPointExt = function(type, name, url) {
		var mp = oFF.RepoMountPoint.createConditional(this.getSession(), type,
				name, url);
		if (oFF.notNull(mp)) {
			this.addMountPoint(mp);
		}
	};
	oFF.RepositoryManager.prototype.setMountPointExt = function(type, name, url) {
		var mp = oFF.RepoMountPoint.createConditional(this.getSession(), type,
				name, url);
		if (oFF.notNull(mp)) {
			this.setMountPoint(mp);
		}
	};
	oFF.RepositoryManager.prototype.addMountPoint = function(mp) {
		this.m_mountingPoints.add(mp);
	};
	oFF.RepositoryManager.prototype.setMountPoint = function(mp) {
		var type = mp.getMountType();
		var i;
		var mountPoint;
		for (i = 0; i < this.m_mountingPoints.size();) {
			mountPoint = this.m_mountingPoints.get(i);
			if (mountPoint.getMountType() === type) {
				this.m_mountingPoints.removeAt(i);
			} else {
				i++;
			}
		}
		this.m_mountingPoints.add(mp);
	};
	oFF.DfCredentialsProvider = function() {
	};
	oFF.DfCredentialsProvider.prototype = new oFF.DfApplicationContext();
	oFF.RuntimeUserManager = function() {
	};
	oFF.RuntimeUserManager.prototype = new oFF.DfApplicationContext();
	oFF.RuntimeUserManager.create = function(application) {
		var newObj = new oFF.RuntimeUserManager();
		newObj.setupApplicationContext(application);
		return newObj;
	};
	oFF.RuntimeUserManager.prototype.m_authenticationTokens = null;
	oFF.RuntimeUserManager.prototype.m_credentialsProvider = null;
	oFF.RuntimeUserManager.prototype.m_userSettings = null;
	oFF.RuntimeUserManager.prototype.setupApplicationContext = function(
			application) {
		oFF.DfApplicationContext.prototype.setupApplicationContext.call(this,
				application);
		this.m_authenticationTokens = oFF.XHashMapByString.create();
	};
	oFF.RuntimeUserManager.prototype.releaseObject = function() {
		oFF.XObjectExt.release(this.m_authenticationTokens);
		oFF.XObjectExt.release(this.m_credentialsProvider);
		oFF.DfApplicationContext.prototype.releaseObject.call(this);
	};
	oFF.RuntimeUserManager.prototype.newPersonalization = function(connection) {
		var personalization = null;
		var systemDescription = null;
		var authenticationToken;
		if (oFF.notNull(connection)) {
			systemDescription = connection.getSystemDescription();
		}
		if (oFF.notNull(systemDescription)) {
			personalization = oFF.ConnectionPersonalization
					.createPersonalization();
			personalization.setFromPersonalization(systemDescription);
			if (oFF.notNull(connection)) {
				authenticationToken = connection.getAuthenticationToken();
				if (oFF.notNull(authenticationToken)) {
					personalization.setAuthenticationToken(connection
							.getAuthenticationToken());
				}
			}
		}
		return personalization;
	};
	oFF.RuntimeUserManager.prototype.getCurrentUser = function() {
		return null;
	};
	oFF.RuntimeUserManager.prototype.setAuthenticationToken = function(
			systemName, token) {
		this.m_authenticationTokens.put(systemName, token);
	};
	oFF.RuntimeUserManager.prototype.setAccessToken = function(systemName,
			token) {
		var authToken = oFF.XAuthenticationToken.create(token);
		this.setAuthenticationToken(systemName, authToken);
	};
	oFF.RuntimeUserManager.prototype.getAuthenticationToken = function(
			systemName) {
		return this.m_authenticationTokens.getByKey(systemName);
	};
	oFF.RuntimeUserManager.prototype.getAccessToken = function(systemName) {
		var authToken = this.m_authenticationTokens.getByKey(systemName);
		if (oFF.isNull(authToken)) {
			return null;
		}
		return authToken.getAccessToken();
	};
	oFF.RuntimeUserManager.prototype.processGetCredentials = function(syncType,
			listener, customIdentifier, connection, credentialsCallCounter,
			response, messages, changedType) {
		var credentialsProvider = this.getCredentialsProvider();
		return credentialsProvider.processGetCredentials(syncType, listener,
				customIdentifier, connection, credentialsCallCounter, response,
				messages, changedType);
	};
	oFF.RuntimeUserManager.prototype.getCredentialsProvider = function() {
		if (oFF.isNull(this.m_credentialsProvider)) {
			this.m_credentialsProvider = oFF.CredentialsFactory.create(this);
		}
		return this.m_credentialsProvider;
	};
	oFF.RuntimeUserManager.prototype.supportsOnErrorHandling = function() {
		var credentialsProvider = this.getCredentialsProvider();
		return credentialsProvider.supportsOnErrorHandling();
	};
	oFF.RuntimeUserManager.prototype.notifyCredentialsSuccess = function(
			connection) {
		var credentialsProvider = this.getCredentialsProvider();
		credentialsProvider.notifyCredentialsSuccess(connection);
	};
	oFF.RuntimeUserManager.prototype.getUserSettings = function() {
		if (oFF.isNull(this.m_userSettings)) {
			this.m_userSettings = oFF.XUserSettingsFactory.create(this
					.getSession());
		}
		return this.m_userSettings;
	};
	oFF.ApplicationSystemOption = function() {
	};
	oFF.ApplicationSystemOption.prototype = new oFF.XConstant();
	oFF.ApplicationSystemOption.NONE = null;
	oFF.ApplicationSystemOption.AUTO = null;
	oFF.ApplicationSystemOption.PATH = null;
	oFF.ApplicationSystemOption.LOCATION_AND_TYPE = null;
	oFF.ApplicationSystemOption.staticSetup = function() {
		oFF.ApplicationSystemOption.NONE = oFF.XConstant.setupName(
				new oFF.ApplicationSystemOption(), "None");
		oFF.ApplicationSystemOption.AUTO = oFF.XConstant.setupName(
				new oFF.ApplicationSystemOption(), "Auto");
		oFF.ApplicationSystemOption.PATH = oFF.XConstant.setupName(
				new oFF.ApplicationSystemOption(), "Path");
		oFF.ApplicationSystemOption.LOCATION_AND_TYPE = oFF.XConstant
				.setupName(new oFF.ApplicationSystemOption(), "LocationAndType");
	};
	oFF.Capability = function() {
	};
	oFF.Capability.prototype = new oFF.XNameValuePair();
	oFF.Capability.createCapabilityInfo = function(name, value) {
		var object = new oFF.Capability();
		object.setName(name);
		object.setValue(value);
		return object;
	};
	oFF.ConnectionContainer = function() {
	};
	oFF.ConnectionContainer.prototype = new oFF.MessageManager();
	oFF.ConnectionContainer.create = function(systemConnect, systemName,
			isPrivate, internalCounter) {
		var connectionContainer = new oFF.ConnectionContainer();
		connectionContainer.setupContainer(systemConnect, systemName,
				isPrivate, internalCounter);
		return connectionContainer;
	};
	oFF.ConnectionContainer.createFailedConnectionContainer = function(
			systemConnect, systemName, message) {
		var connectionContainer = new oFF.ConnectionContainer();
		connectionContainer.setupContainer(systemConnect, systemName, true, 0);
		connectionContainer.addError(oFF.ErrorCodes.OTHER_ERROR, message);
		return connectionContainer;
	};
	oFF.ConnectionContainer.checkSecondaryServerMetadata = function(primary,
			secondary) {
		var resultPrimary = primary;
		if (oFF.isNull(resultPrimary)) {
			if (oFF.notNull(secondary) && secondary.getSyncState().isInSync()
					&& secondary.isValid()) {
				resultPrimary = secondary;
			}
		}
		if (oFF.notNull(resultPrimary) && resultPrimary.hasErrors()) {
			resultPrimary = oFF.XObjectExt.release(resultPrimary);
		}
		return resultPrimary;
	};
	oFF.ConnectionContainer.prototype.m_name = null;
	oFF.ConnectionContainer.prototype.m_systemName = null;
	oFF.ConnectionContainer.prototype.m_systemConnect = null;
	oFF.ConnectionContainer.prototype.m_batchModePath = null;
	oFF.ConnectionContainer.prototype.m_batchRequestManager = null;
	oFF.ConnectionContainer.prototype.m_cache = null;
	oFF.ConnectionContainer.prototype.m_systemDescription = null;
	oFF.ConnectionContainer.prototype.m_internalCounter = 0;
	oFF.ConnectionContainer.prototype.m_sysModCounter = 0;
	oFF.ConnectionContainer.prototype.m_isBatchModeEnabled = false;
	oFF.ConnectionContainer.prototype.m_supportsBatchMode = false;
	oFF.ConnectionContainer.prototype.m_supportsBatchRsStreaming = false;
	oFF.ConnectionContainer.prototype.m_isPrivate = false;
	oFF.ConnectionContainer.prototype.m_reentranceTicket = null;
	oFF.ConnectionContainer.prototype.m_useSessionUrlRewrite = false;
	oFF.ConnectionContainer.prototype.m_sessionUrlRewrite = null;
	oFF.ConnectionContainer.prototype.m_logoffSent = false;
	oFF.ConnectionContainer.prototype.m_XXLPath = null;
	oFF.ConnectionContainer.prototype.m_crossSiteForgeryToken = null;
	oFF.ConnectionContainer.prototype.m_csrfRequestCounter = 0;
	oFF.ConnectionContainer.prototype.m_boeSessionToken = null;
	oFF.ConnectionContainer.prototype.m_serverMetadataFetcherBlocking = null;
	oFF.ConnectionContainer.prototype.m_serverMetadataFetcherNonBlocking = null;
	oFF.ConnectionContainer.prototype.m_tenantId = null;
	oFF.ConnectionContainer.prototype.m_orcaUserName = null;
	oFF.ConnectionContainer.prototype.setupContainer = function(systemConnect,
			systemName, isPrivate, internalCounter) {
		var session = null;
		var connectionPool;
		var systemDescription;
		if (oFF.notNull(systemConnect)) {
			session = systemConnect.getConnectionPoolBase().getSession();
		}
		this.setupSessionContext(session);
		this.m_systemConnect = oFF.XWeakReferenceUtil.getWeakRef(systemConnect);
		this.m_systemName = systemName;
		this.m_isPrivate = isPrivate;
		if (oFF.notNull(systemConnect)) {
			connectionPool = systemConnect.getConnectionPoolBase();
			systemDescription = connectionPool.getSystemLandscape()
					.getSystemDescription(this.m_systemName);
			this.m_systemDescription = oFF.XWeakReferenceUtil
					.getWeakRef(systemDescription);
			this.m_sysModCounter = systemDescription.getSysModCounter();
			this.m_internalCounter = internalCounter;
			if (oFF.notNull(systemName)) {
				this.m_cache = connectionPool.getCache(systemName);
			}
		}
	};
	oFF.ConnectionContainer.prototype.supportsAnalyticCapability = function(
			capabilityName) {
		var serverMetadata = this.getServerMetadata();
		return oFF.isNull(serverMetadata) ? false : serverMetadata
				.supportsAnalyticCapability(capabilityName);
	};
	oFF.ConnectionContainer.prototype.supportsPlanningCapability = function(
			capabilityName) {
		var serverMetadata = this.getServerMetadata();
		var capabilityContainer;
		if (oFF.isNull(serverMetadata)) {
			return false;
		}
		capabilityContainer = serverMetadata
				.getMetadataForService(oFF.ServerService.PLANNING);
		return oFF.notNull(capabilityContainer)
				&& capabilityContainer.containsKey(capabilityName);
	};
	oFF.ConnectionContainer.prototype.getDefaultMessageLayer = function() {
		return oFF.OriginLayer.IOLAYER;
	};
	oFF.ConnectionContainer.prototype.releaseObject = function() {
		var systemConnect;
		this.logoff(oFF.SyncType.BLOCKING, null, null);
		this.m_serverMetadataFetcherBlocking = oFF.XObjectExt
				.release(this.m_serverMetadataFetcherBlocking);
		this.m_serverMetadataFetcherNonBlocking = oFF.XObjectExt
				.release(this.m_serverMetadataFetcherNonBlocking);
		systemConnect = oFF.XWeakReferenceUtil.getHardRef(this.m_systemConnect);
		this.m_systemConnect = null;
		this.m_batchRequestManager = oFF.XObjectExt
				.release(this.m_batchRequestManager);
		this.m_batchModePath = null;
		this.m_cache = null;
		this.m_crossSiteForgeryToken = null;
		this.m_name = null;
		this.m_reentranceTicket = null;
		this.m_systemDescription = oFF.XObjectExt
				.release(this.m_systemDescription);
		this.m_systemName = null;
		this.m_sessionUrlRewrite = null;
		this.m_XXLPath = null;
		oFF.MessageManager.prototype.releaseObject.call(this);
		if (oFF.notNull(systemConnect)) {
			systemConnect._checkReleasedConnections();
		}
	};
	oFF.ConnectionContainer.prototype.getComponentName = function() {
		return "ConnectionContainer";
	};
	oFF.ConnectionContainer.prototype.logoff = function(syncType, listener,
			customIdentifier) {
		var systemType;
		var logoffPath;
		var closeFunction;
		var request;
		if (!this.m_logoffSent) {
			systemType = this.getSystemType();
			logoffPath = oFF.isNull(systemType) ? null : systemType
					.getLogoffPath();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(logoffPath)) {
				this.removePendingBatchFunctions();
				closeFunction = this.newRpcFunction(logoffPath);
				request = closeFunction.getRequest();
				request.setIsFireAndForgetCall(true);
				if (systemType.isTypeOf(oFF.SystemType.HANA)) {
					request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
				} else {
					request.setMethod(oFF.HttpRequestMethod.HTTP_GET);
				}
				this.m_logoffSent = true;
				return closeFunction.processFunctionExecution(syncType,
						listener, customIdentifier);
			} else {
				if (oFF.notNull(listener)) {
					listener.onFunctionExecuted(oFF.ExtResult
							.createWithErrorMessage("No logoff path"), null,
							customIdentifier);
				}
			}
		} else {
			if (oFF.notNull(listener)) {
				listener.onFunctionExecuted(oFF.ExtResult
						.createWithInfoMessage("Already logged off"), null,
						customIdentifier);
			}
		}
		return null;
	};
	oFF.ConnectionContainer.prototype.removePendingBatchFunctions = function() {
		if (this.isBatchModeEnabled()) {
			this.m_isBatchModeEnabled = false;
			oFF.XCollectionUtils.releaseEntriesAndCollectionIfNotNull(this
					.getBatchFunctions());
		}
	};
	oFF.ConnectionContainer.prototype.getSystemDescription = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_systemDescription);
	};
	oFF.ConnectionContainer.prototype.getSystemType = function() {
		var systemDescription = this.getSystemDescription();
		return oFF.isNull(systemDescription) ? null : systemDescription
				.getSystemType();
	};
	oFF.ConnectionContainer.prototype.getHost = function() {
		var systemDescription = this.getSystemDescription();
		return oFF.isNull(systemDescription) ? null : systemDescription
				.getHost();
	};
	oFF.ConnectionContainer.prototype.getCookiesForPath = function(path) {
		var domain = this.getHost();
		var connectionPool;
		var cookiesMasterStore;
		if (oFF.isNull(domain)) {
			return null;
		}
		connectionPool = this.getConnectionPool();
		if (oFF.isNull(connectionPool)) {
			return null;
		}
		cookiesMasterStore = connectionPool.getCookiesMasterStore();
		return cookiesMasterStore.getCookies(domain, path);
	};
	oFF.ConnectionContainer.prototype.mergeCookies = function(path,
			responseCookies) {
		var connectionPool = this.getConnectionPool();
		var cookiesMasterStore;
		if (oFF.notNull(connectionPool)) {
			cookiesMasterStore = connectionPool.getCookiesMasterStore();
			cookiesMasterStore.applyCookies(this.getHost(), path,
					responseCookies);
		}
	};
	oFF.ConnectionContainer.prototype.getReentranceTicket = function() {
		var tmp = this.m_reentranceTicket;
		this.m_reentranceTicket = null;
		return tmp;
	};
	oFF.ConnectionContainer.prototype.setReentranceTicket = function(ticket) {
		this.m_reentranceTicket = ticket;
	};
	oFF.ConnectionContainer.prototype.getCsrfToken = function() {
		return this.m_crossSiteForgeryToken;
	};
	oFF.ConnectionContainer.prototype.setCsrfToken = function(csrfToken) {
		this.m_crossSiteForgeryToken = csrfToken;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(csrfToken)) {
			this.m_csrfRequestCounter = 0;
		}
	};
	oFF.ConnectionContainer.prototype.getCsrfRequiredCount = function() {
		return this.m_csrfRequestCounter;
	};
	oFF.ConnectionContainer.prototype.incCsrfRequiredCount = function() {
		this.m_csrfRequestCounter = this.m_csrfRequestCounter + 1;
		this.m_crossSiteForgeryToken = null;
	};
	oFF.ConnectionContainer.prototype.getBoeSessionToken = function() {
		return this.m_boeSessionToken;
	};
	oFF.ConnectionContainer.prototype.setBoeSessionToken = function(
			boeSessionToken) {
		this.m_boeSessionToken = boeSessionToken;
	};
	oFF.ConnectionContainer.prototype.getServerMetadata = function() {
		var extResult = this.getServerMetadataExt(oFF.SyncType.BLOCKING, null,
				null, false);
		return extResult.getData();
	};
	oFF.ConnectionContainer.prototype.getServerMetadataExt = function(syncType,
			listener, customIdentifier, revalidate) {
		var myServerMetadataFetcher;
		var systemType;
		var logonMetadataRequired;
		var sequence;
		var preflightAction;
		var metadataAction;
		var logonAction;
		this.validateMetadataFetcher(revalidate);
		if (syncType === oFF.SyncType.BLOCKING) {
			this.m_serverMetadataFetcherBlocking = oFF.ConnectionContainer
					.checkSecondaryServerMetadata(
							this.m_serverMetadataFetcherBlocking,
							this.m_serverMetadataFetcherNonBlocking);
			myServerMetadataFetcher = this.m_serverMetadataFetcherBlocking;
		} else {
			this.m_serverMetadataFetcherNonBlocking = oFF.ConnectionContainer
					.checkSecondaryServerMetadata(
							this.m_serverMetadataFetcherNonBlocking,
							this.m_serverMetadataFetcherBlocking);
			myServerMetadataFetcher = this.m_serverMetadataFetcherNonBlocking;
		}
		if (oFF.isNull(myServerMetadataFetcher)) {
			systemType = this.getSystemType();
			logonMetadataRequired = oFF.isNull(systemType) ? false : systemType
					.isLogonMetadataRequired();
			if (this.isPreflightNeeded() || logonMetadataRequired) {
				sequence = oFF.SyncActionSequence.create(this);
				if (this.isPreflightNeeded()) {
					preflightAction = oFF.ServerPreflightAction.createAndRun(
							oFF.SyncType.DELAYED, this, null, null);
					sequence.addAction(preflightAction);
				}
				metadataAction = oFF.ServerMetadataAction.createAndRun(
						oFF.SyncType.DELAYED, this, null, null);
				if (logonMetadataRequired) {
					logonAction = oFF.ServerLoginAction.createAndRun(
							oFF.SyncType.DELAYED, this, null, null);
					sequence.addAction(logonAction);
					metadataAction.setLogonAction(logonAction);
				}
				sequence.setMainAction(metadataAction);
				sequence
						.processSyncAction(syncType, listener, customIdentifier);
				myServerMetadataFetcher = sequence;
			} else {
				myServerMetadataFetcher = oFF.ServerMetadataAction
						.createAndRun(syncType, this, listener,
								customIdentifier);
			}
			if (syncType === oFF.SyncType.BLOCKING) {
				this.m_serverMetadataFetcherBlocking = myServerMetadataFetcher;
			} else {
				this.m_serverMetadataFetcherNonBlocking = myServerMetadataFetcher;
			}
		} else {
			myServerMetadataFetcher.attachListener(listener,
					oFF.ListenerType.SPECIFIC, customIdentifier);
		}
		return myServerMetadataFetcher;
	};
	oFF.ConnectionContainer.prototype.validateMetadataFetcher = function(
			forceRevalidate) {
		if (oFF.notNull(this.m_serverMetadataFetcherBlocking)
				&& this.m_serverMetadataFetcherBlocking.isReleased()) {
			this.m_serverMetadataFetcherBlocking = null;
		}
		if (oFF.notNull(this.m_serverMetadataFetcherNonBlocking)
				&& this.m_serverMetadataFetcherNonBlocking.isReleased()) {
			this.m_serverMetadataFetcherNonBlocking = null;
		}
		if (forceRevalidate) {
			if (this.m_serverMetadataFetcherBlocking === this.m_serverMetadataFetcherNonBlocking) {
				if (oFF.notNull(this.m_serverMetadataFetcherBlocking)
						&& this.m_serverMetadataFetcherBlocking.getSyncState()
								.isInSync()) {
					this.m_serverMetadataFetcherBlocking = oFF.XObjectExt
							.release(this.m_serverMetadataFetcherBlocking);
					this.m_serverMetadataFetcherNonBlocking = null;
				}
			} else {
				if (oFF.notNull(this.m_serverMetadataFetcherBlocking)
						&& this.m_serverMetadataFetcherBlocking.getSyncState()
								.isInSync()) {
					this.m_serverMetadataFetcherBlocking = oFF.XObjectExt
							.release(this.m_serverMetadataFetcherBlocking);
				}
				if (oFF.notNull(this.m_serverMetadataFetcherNonBlocking)
						&& this.m_serverMetadataFetcherNonBlocking
								.getSyncState().isInSync()) {
					this.m_serverMetadataFetcherNonBlocking = oFF.XObjectExt
							.release(this.m_serverMetadataFetcherNonBlocking);
				}
			}
		}
	};
	oFF.ConnectionContainer.prototype.newRpcFunction = function(name) {
		var relativeUri = oFF.XUri.createFromUri(name);
		return this.newRpcFunctionByUri(relativeUri);
	};
	oFF.ConnectionContainer.prototype.newRpcFunctionForBLOB = function(name) {
		var xxlPath = this.getWebServicePathForBLOBs();
		var originalPath = xxlPath.getPath();
		var completePath = oFF.XStringUtils.concatenate2(originalPath, name);
		var completeUri = oFF.XUri.createFromUri(completePath);
		return this.newRpcFunctionInternal(completeUri, true);
	};
	oFF.ConnectionContainer.prototype.newRpcFunctionByService = function(
			serviceName) {
		var serverMetadata = this.getServerMetadata();
		var capabilities;
		var fastPath;
		var systemType;
		if (oFF.isNull(serverMetadata)) {
			return null;
		}
		capabilities = serverMetadata.getMetadataForService(serviceName);
		fastPath = capabilities.getByKey(oFF.ConnectionConstants.FAST_PATH);
		if (oFF.isNull(fastPath)) {
			systemType = this.getSystemType();
			return this.newRpcFunction(systemType.getInAPath());
		}
		return this.newRpcFunction(fastPath.getValue());
	};
	oFF.ConnectionContainer.prototype.newRpcFunctionByUri = function(
			relativeUri) {
		var batchFunction;
		if (this.isBatchModeEnabled()) {
			batchFunction = oFF.RpcBatchFunction.create(this, relativeUri);
			this.m_batchRequestManager.addBatchFunction(batchFunction);
			return batchFunction;
		}
		return this.newRpcFunctionInternal(relativeUri, false);
	};
	oFF.ConnectionContainer.prototype.newRpcFunctionInternal = function(
			relativeUri, imageFunction) {
		var systemDescription = this.getSystemDescription();
		var protocolType;
		var systemType;
		var name;
		var rpcFunction;
		if (oFF.isNull(systemDescription) || oFF.isNull(relativeUri)) {
			return null;
		}
		protocolType = systemDescription.getProtocolType();
		systemType = systemDescription.getSystemType();
		name = relativeUri.getPath();
		rpcFunction = oFF.RpcFunctionFactory.create(this, systemDescription,
				name, systemType, protocolType);
		if (oFF.isNull(rpcFunction)) {
			rpcFunction = oFF.RpcHttpFunction.create(this, relativeUri);
			if (imageFunction) {
				rpcFunction.setStaticURL(true);
			}
		}
		rpcFunction.setTraceInfo(this.getTraceInfo());
		return rpcFunction;
	};
	oFF.ConnectionContainer.prototype.getApplication = function() {
		var connectionPool = this.getConnectionPool();
		return oFF.isNull(connectionPool) ? null : connectionPool
				.getApplication();
	};
	oFF.ConnectionContainer.prototype.getTraceInfo = function() {
		var connectionPool = this.getConnectionPool();
		return oFF.isNull(connectionPool) ? null : connectionPool
				.getTraceInfo(this.m_systemName);
	};
	oFF.ConnectionContainer.prototype.isBatchModeEnabled = function() {
		return this.m_isBatchModeEnabled;
	};
	oFF.ConnectionContainer.prototype.getBatchFunctions = function() {
		return oFF.isNull(this.m_batchRequestManager) ? null
				: this.m_batchRequestManager.getBatchFunctions();
	};
	oFF.ConnectionContainer.prototype.getBatchRequestManager = function() {
		return this.m_batchRequestManager;
	};
	oFF.ConnectionContainer.prototype.getBatchQueueSize = function() {
		return oFF.isNull(this.m_batchRequestManager) ? 0
				: this.m_batchRequestManager.getBatchFunctions().size();
	};
	oFF.ConnectionContainer.prototype.setBatchModeEnabled = function(syncType,
			enable) {
		if (this.m_supportsBatchMode && this.m_isBatchModeEnabled !== enable) {
			this.m_isBatchModeEnabled = enable;
			if (enable) {
				this.m_batchRequestManager = oFF.BatchRequestManager
						.create(this.getSession());
			} else {
				this.m_batchRequestManager.executeBatch(syncType, this,
						this.m_batchModePath, false);
				this.m_batchRequestManager = null;
			}
		}
	};
	oFF.ConnectionContainer.prototype.disableBatchModeWithRsStreaming = function(
			syncType) {
		if (this.m_isBatchModeEnabled) {
			this.m_isBatchModeEnabled = false;
			this.m_batchRequestManager.executeBatch(syncType, this,
					this.m_batchModePath, this.m_supportsBatchRsStreaming);
			this.m_batchRequestManager = null;
		}
	};
	oFF.ConnectionContainer.prototype.supportsBatchMode = function() {
		return this.m_supportsBatchMode;
	};
	oFF.ConnectionContainer.prototype.supportsWebServiceForBLOBObjects = function() {
		return this.getWebServicePathForBLOBs() !== null;
	};
	oFF.ConnectionContainer.prototype.getWebServicePathForBLOBs = function() {
		return this.m_XXLPath;
	};
	oFF.ConnectionContainer.prototype.setWebServicePathForBLOBs = function(path) {
		this.m_XXLPath = oFF.XUri.createFromUri(path);
	};
	oFF.ConnectionContainer.prototype.supportsBatchRsStreaming = function() {
		return this.m_supportsBatchRsStreaming;
	};
	oFF.ConnectionContainer.prototype.setSupportsBatchMode = function(
			supportsBatchMode, supportsBatchRsStreaming, path) {
		var systemName;
		this.m_supportsBatchMode = supportsBatchMode;
		this.m_supportsBatchRsStreaming = supportsBatchRsStreaming;
		this.m_batchModePath = oFF.XUri.createFromUri(path);
		if (supportsBatchMode) {
			systemName = this.m_systemName;
			if (this.getConnectionPool().isBatchModeEnabled(systemName)) {
				this.setBatchModeEnabled(oFF.SyncType.BLOCKING, true);
			}
		}
	};
	oFF.ConnectionContainer.prototype.getConnectionPool = function() {
		var systemConnect = this.getSystemConnect();
		return oFF.isNull(systemConnect) ? null : systemConnect
				.getConnectionPoolBase();
	};
	oFF.ConnectionContainer.prototype.getCache = function() {
		return this.m_cache;
	};
	oFF.ConnectionContainer.prototype.isDirty = function() {
		return oFF.isNull(this.m_systemDescription)
				|| this.getSystemDescription().getSysModCounter() !== this.m_sysModCounter;
	};
	oFF.ConnectionContainer.prototype.setName = function(name) {
		this.m_name = name;
	};
	oFF.ConnectionContainer.prototype.getName = function() {
		return this.m_name;
	};
	oFF.ConnectionContainer.prototype.isShared = function() {
		return !this.m_isPrivate;
	};
	oFF.ConnectionContainer.prototype.isPrivate = function() {
		return this.m_isPrivate;
	};
	oFF.ConnectionContainer.prototype.isLogoffSent = function() {
		return this.m_logoffSent;
	};
	oFF.ConnectionContainer.prototype.setLogoffSent = function(logoffSent) {
		this.m_logoffSent = logoffSent;
	};
	oFF.ConnectionContainer.prototype.useSessionUrlRewrite = function() {
		return this.m_useSessionUrlRewrite;
	};
	oFF.ConnectionContainer.prototype.setUseUrlSessionId = function(
			useUrlSessionId) {
		this.m_useSessionUrlRewrite = useUrlSessionId;
	};
	oFF.ConnectionContainer.prototype.getSessionUrlRewrite = function() {
		return this.m_sessionUrlRewrite;
	};
	oFF.ConnectionContainer.prototype.setSessionUrlRewrite = function(
			sessionUrlRewrite) {
		var beginIndex;
		var endIndex;
		if (oFF.notNull(sessionUrlRewrite)) {
			beginIndex = oFF.XString.indexOf(sessionUrlRewrite, "(");
			endIndex = oFF.XString.indexOf(sessionUrlRewrite, ")");
			if (beginIndex !== -1 && endIndex !== -1 && beginIndex < endIndex) {
				this.m_sessionUrlRewrite = oFF.XString.substring(
						sessionUrlRewrite, beginIndex, endIndex + 1);
			}
		}
	};
	oFF.ConnectionContainer.prototype.getSysModCounter = function() {
		return this.m_sysModCounter;
	};
	oFF.ConnectionContainer.prototype.getSystemConnect = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_systemConnect);
	};
	oFF.ConnectionContainer.prototype.getAuthenticationToken = function() {
		var systemConnect = this.getSystemConnect();
		return oFF.isNull(systemConnect) ? null : systemConnect
				.getAuthenticationToken();
	};
	oFF.ConnectionContainer.prototype.getAccessToken = function() {
		var systemConnect = this.getSystemConnect();
		return oFF.isNull(systemConnect) ? null : systemConnect
				.getAccessToken();
	};
	oFF.ConnectionContainer.prototype.isPreflightNeeded = function() {
		var systemConnect = this.getSystemConnect();
		return oFF.isNull(systemConnect) ? false : systemConnect
				.isPreflightNeeded();
	};
	oFF.ConnectionContainer.prototype.getPreflightUri = function() {
		var systemConnect = this.getSystemConnect();
		return oFF.isNull(systemConnect) ? null : systemConnect
				.getPreflightUri();
	};
	oFF.ConnectionContainer.prototype.setIsPreflightNeeded = function(
			isPreflightNeeded) {
		var systemConnect = this.getSystemConnect();
		if (oFF.notNull(systemConnect)) {
			systemConnect.setIsPreflightNeeded(isPreflightNeeded);
		}
	};
	oFF.ConnectionContainer.prototype.setTenantId = function(tenantId) {
		this.m_tenantId = tenantId;
	};
	oFF.ConnectionContainer.prototype.getTenantId = function() {
		return this.m_tenantId;
	};
	oFF.ConnectionContainer.prototype.setOrcaUserName = function(orcaUserName) {
		this.m_orcaUserName = orcaUserName;
	};
	oFF.ConnectionContainer.prototype.getOrcaUserName = function() {
		return this.m_orcaUserName;
	};
	oFF.ConnectionContainer.prototype.toString = function() {
		var buffer = oFF.XStringBuffer.create();
		var systemDescription = this.getSystemDescription();
		buffer.append("#").appendInt(this.m_internalCounter).append(": ")
				.append(
						oFF.isNull(systemDescription) ? null
								: systemDescription.toString());
		return buffer.toString();
	};
	oFF.SystemRole = function() {
	};
	oFF.SystemRole.prototype = new oFF.XConstant();
	oFF.SystemRole.MASTER = null;
	oFF.SystemRole.DATA_PROVIDER = null;
	oFF.SystemRole.REPOSITORY = null;
	oFF.SystemRole.USER_MANAGEMENT = null;
	oFF.SystemRole.SYSTEM_LANDSCAPE = null;
	oFF.SystemRole.s_roles = null;
	oFF.SystemRole.s_lookup = null;
	oFF.SystemRole.staticSetup = function() {
		oFF.SystemRole.s_roles = oFF.XList.create();
		oFF.SystemRole.s_lookup = oFF.XHashMapByString.create();
		oFF.SystemRole.MASTER = oFF.SystemRole.create("Master");
		oFF.SystemRole.DATA_PROVIDER = oFF.SystemRole.create("DataProvider");
		oFF.SystemRole.REPOSITORY = oFF.SystemRole.create("Repository");
		oFF.SystemRole.USER_MANAGEMENT = oFF.SystemRole
				.create("UserManagement");
		oFF.SystemRole.SYSTEM_LANDSCAPE = oFF.SystemRole
				.create("SystemLandscape");
	};
	oFF.SystemRole.create = function(name) {
		var newConstant = new oFF.SystemRole();
		newConstant.setName(name);
		oFF.SystemRole.s_roles.add(newConstant);
		oFF.SystemRole.s_lookup.put(name, newConstant);
		return newConstant;
	};
	oFF.SystemRole.getAllRoles = function() {
		return oFF.SystemRole.s_roles;
	};
	oFF.SystemRole.lookup = function(name) {
		return oFF.SystemRole.s_lookup.getByKey(name);
	};
	oFF.RepoMountType = function() {
	};
	oFF.RepoMountType.prototype = new oFF.XConstant();
	oFF.RepoMountType.FILE = null;
	oFF.RepoMountType.staticSetup = function() {
		oFF.RepoMountType.FILE = oFF.XConstant.setupName(
				new oFF.RepoMountType(), "File");
	};
	oFF.ApplicationPostprocAction = function() {
	};
	oFF.ApplicationPostprocAction.prototype = new oFF.SyncAction();
	oFF.ApplicationPostprocAction.createAndRun = function(syncType, listener,
			customIdentifier, application, masterSystemName, systemUri,
			systemType, location) {
		var object = new oFF.ApplicationPostprocAction();
		object.m_applicationHardPointer = application;
		object.m_masterSystemName = masterSystemName;
		object.m_systemUri = systemUri;
		object.m_systemType = systemType;
		object.m_location = location;
		object.setupActionAndRun(syncType, application, listener,
				customIdentifier);
		return object;
	};
	oFF.ApplicationPostprocAction.prototype.m_masterSystemName = null;
	oFF.ApplicationPostprocAction.prototype.m_systemUri = null;
	oFF.ApplicationPostprocAction.prototype.m_systemType = null;
	oFF.ApplicationPostprocAction.prototype.m_location = null;
	oFF.ApplicationPostprocAction.prototype.m_applicationHardPointer = null;
	oFF.ApplicationPostprocAction.prototype.releaseObject = function() {
		this.m_masterSystemName = null;
		this.m_systemUri = null;
		this.m_systemType = null;
		this.m_location = null;
		this.m_applicationHardPointer = null;
		oFF.SyncAction.prototype.releaseObject.call(this);
	};
	oFF.ApplicationPostprocAction.prototype.processSynchronization = function(
			syncType) {
		var systemLandscape = this.m_applicationHardPointer
				.getSystemLandscape();
		var usingMasterName;
		var system;
		var scheme;
		var systemNames;
		if (systemLandscape.getMasterSystemName() === null) {
			usingMasterName = this.m_masterSystemName;
			if (oFF.isNull(usingMasterName)) {
				usingMasterName = "master";
			}
			if (oFF.notNull(this.m_systemUri)) {
				systemLandscape.setSystemByUri(usingMasterName,
						this.m_systemUri, null);
			} else {
				if (oFF.notNull(this.m_location)
						&& oFF.notNull(this.m_systemType)) {
					system = systemLandscape.createSystem();
					system.setSystemType(this.m_systemType);
					scheme = this.m_location.getScheme();
					if (oFF.notNull(scheme)) {
						if (oFF.XString.startsWith(scheme, "https")) {
							system.setProtocolType(oFF.ProtocolType.HTTPS);
						} else {
							system.setProtocolType(oFF.ProtocolType.HTTP);
						}
					}
					system.setSystemName(usingMasterName);
					system.setSystemText(usingMasterName);
					system.setHost(this.m_location.getHost());
					system.setPort(this.m_location.getPort());
					systemLandscape.setSystemByDescription(system);
				} else {
					systemNames = systemLandscape.getSystemNames();
					if (systemNames.size() === 1) {
						usingMasterName = systemNames.get(0);
					} else {
						usingMasterName = null;
					}
				}
			}
			if (oFF.notNull(usingMasterName)) {
				systemLandscape.setMasterSystemName(usingMasterName);
			}
		}
		this.setData(this.m_applicationHardPointer);
		return false;
	};
	oFF.ApplicationPostprocAction.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		listener.onApplicationReady(extResult, data, customIdentifier);
	};
	oFF.ServerMetadataAction = function() {
	};
	oFF.ServerMetadataAction.prototype = new oFF.SyncAction();
	oFF.ServerMetadataAction.createAndRun = function(syncType,
			connectionContainer, listener, customIdentifier) {
		var object = new oFF.ServerMetadataAction();
		object.setupActionAndRun(syncType, connectionContainer, listener,
				customIdentifier);
		return object;
	};
	oFF.ServerMetadataAction.prototype.m_rpcFunction = null;
	oFF.ServerMetadataAction.prototype.m_serverMetadata = null;
	oFF.ServerMetadataAction.prototype.m_logonAction = null;
	oFF.ServerMetadataAction.prototype.releaseObject = function() {
		this.m_rpcFunction = null;
		this.m_serverMetadata = oFF.XObjectExt.release(this.m_serverMetadata);
		this.m_logonAction = oFF.XObjectExt.release(this.m_logonAction);
		oFF.SyncAction.prototype.releaseObject.call(this);
	};
	oFF.ServerMetadataAction.prototype.getComponentName = function() {
		return "ServerMetadataAction";
	};
	oFF.ServerMetadataAction.prototype.processSynchronization = function(
			syncType) {
		var connection = this.getActionContext();
		var systemDescription;
		var protocolType;
		var path;
		var request;
		if (connection.hasErrors()) {
			return false;
		}
		systemDescription = connection.getSystemDescription();
		protocolType = systemDescription.getProtocolType();
		if (protocolType !== oFF.ProtocolType.FILE) {
			path = systemDescription.getSystemType().getServerInfoPath();
			if (oFF.notNull(path)) {
				this.m_rpcFunction = connection.newRpcFunction(path);
				this.m_rpcFunction.setIsServerMetadataCall(true);
				request = this.m_rpcFunction.getRequest();
				request.setMethod(oFF.HttpRequestMethod.HTTP_GET);
				this.m_rpcFunction.processFunctionExecution(syncType, this,
						null);
				return true;
			}
		}
		this.m_serverMetadata = oFF.ServerMetadata.create(this.getSession(),
				null);
		this.setData(this.m_serverMetadata);
		return false;
	};
	oFF.ServerMetadataAction.prototype.onFunctionExecuted = function(extResult,
			response, customIdentifier) {
		var rootStructure;
		var connection;
		var inaMetadata;
		var batchCapability;
		var analyticsMetadata;
		var batchRsStreaming;
		var xxlWSCapability;
		this.addAllMessages(extResult);
		rootStructure = response.getRootElement();
		connection = this.getActionContext();
		if (extResult.isValid()) {
			if (oFF.isNull(rootStructure)) {
				this.addError(oFF.ErrorCodes.INVALID_SERVER_METADATA_JSON,
						"Server metadata was not a structure json");
			} else {
				oFF.InAHelper.importMessages(rootStructure, this);
				if (this.isValid()) {
					this.m_serverMetadata = oFF.ServerMetadata.create(this
							.getSession(), rootStructure);
					connection.setReentranceTicket(this.m_serverMetadata
							.getReentranceTicket());
					inaMetadata = this.m_serverMetadata
							.getMetadataForService(oFF.ServerService.INA);
					if (oFF.notNull(inaMetadata)) {
						batchCapability = inaMetadata
								.getByKey(oFF.ConnectionConstants.INA_CAPABILITY_SUPPORTS_BATCH);
						if (oFF.notNull(batchCapability)) {
							analyticsMetadata = this.m_serverMetadata
									.getMetadataForService(oFF.ServerService.ANALYTIC);
							batchRsStreaming = oFF.notNull(analyticsMetadata)
									&& analyticsMetadata
											.containsKey(oFF.ConnectionConstants.INA_CAPABILITY_SUPPORTS_BATCH_RS_STREAMING);
							connection.setSupportsBatchMode(true,
									batchRsStreaming, batchCapability
											.getValue());
							xxlWSCapability = oFF.isNull(analyticsMetadata) ? null
									: analyticsMetadata
											.getByKey(oFF.ConnectionConstants.INA_FASTPATH_XXL_WS);
							if (oFF.notNull(xxlWSCapability)) {
								connection
										.setWebServicePathForBLOBs(xxlWSCapability
												.getValue());
							}
						}
					}
					if (oFF.notNull(this.m_logonAction)) {
						this.importLogonMetadata();
						connection.setTenantId(this.m_serverMetadata
								.getTenantId());
						connection.setOrcaUserName(this.m_serverMetadata
								.getOrcaUserName());
					}
					this.setData(this.m_serverMetadata);
				}
			}
			this.endSync();
		} else {
			if (connection.getCsrfRequiredCount() > 0
					&& connection.getCsrfRequiredCount() < 10) {
				this.processSynchronization(this.getActiveSyncType());
			} else {
				if (oFF.notNull(rootStructure)) {
					this.importInaMessages(rootStructure);
				}
				this.endSync();
			}
		}
	};
	oFF.ServerMetadataAction.prototype.importLogonMetadata = function() {
		this.m_serverMetadata.addLogonInfo(this.m_logonAction.getData()
				.getRootElement());
	};
	oFF.ServerMetadataAction.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		listener.onServerMetadataLoaded(extResult, data, customIdentifier);
	};
	oFF.ServerMetadataAction.prototype.importInaMessages = function(
			inaStructure) {
		var inaMessages = inaStructure
				.getListByKey(oFF.InAConstantsBios.QY_MESSAGES);
		var messageSize;
		var message;
		var i;
		var inaMessage;
		var messageClass;
		var code;
		var type;
		if (oFF.notNull(inaMessages)) {
			messageSize = inaMessages.size();
			message = oFF.XStringBuffer.create();
			for (i = 0; i < messageSize; i++) {
				inaMessage = inaMessages.getStructureAt(i);
				message.append(inaMessage
						.getStringByKey(oFF.InAConstantsBios.QY_TEXT));
				messageClass = inaMessage
						.getStringByKey(oFF.InAConstantsBios.QY_MESSAGE_CLASS);
				if (oFF.notNull(messageClass)) {
					message.append("; MsgClass: ").append(messageClass);
				}
				code = inaMessage.getIntegerByKeyExt(
						oFF.InAConstantsBios.QY_NUMBER, 0);
				type = inaMessage.getIntegerByKeyExt(
						oFF.InAConstantsBios.QY_TYPE, 0);
				switch (type) {
				case oFF.InAConstantsBios.VA_SEVERITY_INFO:
					this.addInfoExt(oFF.OriginLayer.SERVER, code, message
							.toString());
					break;
				case oFF.InAConstantsBios.VA_SEVERITY_WARNING:
					this.addWarningExt(oFF.OriginLayer.SERVER, code, message
							.toString());
					break;
				case oFF.InAConstantsBios.VA_SEVERITY_ERROR:
					this.addErrorExt(oFF.OriginLayer.SERVER, code, message
							.toString(), null);
					break;
				case oFF.InAConstantsBios.VA_SEVERITY_SEMANTICAL_ERROR:
					this.addSemanticalError(oFF.OriginLayer.SERVER, code,
							message.toString());
					break;
				default:
					break;
				}
				message.clear();
			}
		}
	};
	oFF.ServerMetadataAction.prototype.setLogonAction = function(logonAction) {
		this.m_logonAction = logonAction;
	};
	oFF.ServerCallAction = function() {
	};
	oFF.ServerCallAction.prototype = new oFF.SyncAction();
	oFF.ServerCallAction.prototype.m_rpcFunction = null;
	oFF.ServerCallAction.prototype.releaseObject = function() {
		oFF.XObjectExt.release(this.m_rpcFunction);
		oFF.SyncAction.prototype.releaseObject.call(this);
	};
	oFF.ServerCallAction.prototype.onFunctionExecuted = function(extResult,
			response, customIdentifier) {
		this.addAllMessages(extResult);
		this.setData(response);
		this.onFunctionExecutedInternal(extResult, response, customIdentifier);
		this.endSync();
	};
	oFF.ServerCallAction.prototype.processSynchronization = function(syncType) {
		var connection = this.getActionContext();
		var uri = this.getUri(connection);
		var request;
		this.m_rpcFunction = connection.newRpcFunctionByUri(uri);
		request = this.m_rpcFunction.getRequest();
		request.setMethod(oFF.HttpRequestMethod.HTTP_GET);
		this.m_rpcFunction.processFunctionExecution(syncType, this, null);
		return true;
	};
	oFF.ServerCallAction.prototype.onFunctionExecutedInternal = function(
			extResult, response, customIdentifier) {
	};
	oFF.StandaloneSystemLandscape = function() {
	};
	oFF.StandaloneSystemLandscape.prototype = new oFF.DfApplicationContext();
	oFF.StandaloneSystemLandscape.s_masterSystemDescription = null;
	oFF.StandaloneSystemLandscape.getStaticMasterSystemDescription = function() {
		return oFF.StandaloneSystemLandscape.s_masterSystemDescription;
	};
	oFF.StandaloneSystemLandscape.setStaticMasterSystemDescription = function(
			masterSystem) {
		oFF.StandaloneSystemLandscape.s_masterSystemDescription = masterSystem;
	};
	oFF.StandaloneSystemLandscape.create = function(application) {
		var landscape = new oFF.StandaloneSystemLandscape();
		landscape.setupLandscape(application);
		return landscape;
	};
	oFF.StandaloneSystemLandscape.prototype.m_roleMap = null;
	oFF.StandaloneSystemLandscape.prototype.m_systemMap = null;
	oFF.StandaloneSystemLandscape.prototype.setupLandscape = function(
			application) {
		var properties;
		var systems;
		var sysDesc;
		this.setApplication(application);
		this.m_systemMap = oFF.XHashMapByString.create();
		this.m_roleMap = oFF.XHashMapOfStringByString.create();
		if (oFF
				.notNull(oFF.StandaloneSystemLandscape.s_masterSystemDescription)) {
			properties = oFF.XProperties
					.createPropertiesCopy(oFF.StandaloneSystemLandscape.s_masterSystemDescription
							.getProperties());
			this.setSystem(
					oFF.StandaloneSystemLandscape.s_masterSystemDescription
							.getSystemName(), properties);
			this
					.setMasterSystemName(oFF.StandaloneSystemLandscape.s_masterSystemDescription
							.getSystemName());
		}
		systems = this.m_systemMap.getIterator();
		while (systems.hasNext()) {
			sysDesc = systems.next();
			sysDesc.setApplication(application);
		}
		oFF.XObjectExt.release(systems);
	};
	oFF.StandaloneSystemLandscape.prototype.releaseObject = function() {
		this.m_systemMap = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_systemMap);
		oFF.DfApplicationContext.prototype.releaseObject.call(this);
	};
	oFF.StandaloneSystemLandscape.prototype.getComponentType = function() {
		return oFF.RuntimeComponentType.SYSTEM_LANDSCAPE;
	};
	oFF.StandaloneSystemLandscape.prototype.getChildElements = function() {
		return oFF.XReadOnlyListWrapper.create(this.m_systemMap
				.getValuesAsReadOnlyList());
	};
	oFF.StandaloneSystemLandscape.prototype.clearSystems = function() {
		this.m_systemMap.clear();
	};
	oFF.StandaloneSystemLandscape.prototype.createSystem = function() {
		return oFF.SystemDescription.createExt(this.getSession(), this, null,
				null);
	};
	oFF.StandaloneSystemLandscape.prototype.existsSystemName = function(name) {
		return this.m_systemMap.containsKey(name);
	};
	oFF.StandaloneSystemLandscape.prototype.getSystemDescription = function(
			name) {
		if (oFF.isNull(name)) {
			return this.getMasterSystem();
		}
		return this.m_systemMap.getByKey(name);
	};
	oFF.StandaloneSystemLandscape.prototype.getAllSystemText = function() {
		var allText = oFF.XListOfString.create();
		var iterator = this.m_systemMap.getIterator();
		var systemText;
		while (iterator.hasNext()) {
			systemText = iterator.next().getSystemText();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(systemText)) {
				allText.add(systemText);
			}
		}
		oFF.XObjectExt.release(iterator);
		allText.sortByDirection(oFF.XSortDirection.ASCENDING);
		return allText;
	};
	oFF.StandaloneSystemLandscape.prototype.getSystemDescriptionByText = function(
			text) {
		var systems;
		var iterator;
		var systemDescription;
		if (oFF.XStringUtils.isNullOrEmpty(text)) {
			return this.m_systemMap.getValuesAsReadOnlyList();
		}
		systems = oFF.XList.create();
		iterator = this.m_systemMap.getIterator();
		while (iterator.hasNext()) {
			systemDescription = iterator.next();
			if (oFF.XString.containsString(systemDescription.getSystemText(),
					text)) {
				systems.add(systemDescription);
			}
		}
		oFF.XObjectExt.release(iterator);
		return systems;
	};
	oFF.StandaloneSystemLandscape.prototype.getSystemNames = function() {
		var systemNames = oFF.XListOfString
				.createFromReadOnlyList(this.m_systemMap
						.getKeysAsReadOnlyListOfString());
		systemNames.sortByDirection(oFF.XSortDirection.ASCENDING);
		return systemNames;
	};
	oFF.StandaloneSystemLandscape.prototype.removeSystem = function(name) {
		this.m_systemMap.remove(name);
	};
	oFF.StandaloneSystemLandscape.prototype.setSystemByUri = function(name,
			uri, systemType) {
		var systemDesc = oFF.SystemDescription.createExt(this.getSession(),
				this, name, null);
		var queryElements;
		var i;
		var queryElement;
		var key;
		var value;
		this.setSystemByDescription(systemDesc);
		systemDesc.setAuthenticationType(uri.getAuthenticationType());
		if (uri.getUser() !== null) {
			systemDesc.setUser(uri.getUser());
			systemDesc.setPassword(uri.getPassword());
		}
		systemDesc.setHost(uri.getHost());
		systemDesc.setPort(uri.getPort());
		systemDesc.setProtocolType(oFF.ProtocolType.lookup(uri.getScheme()));
		systemDesc.setPath(uri.getPath());
		queryElements = uri.getQueryElements();
		if (oFF.notNull(queryElements)) {
			for (i = 0; i < queryElements.size(); i++) {
				queryElement = queryElements.get(i);
				key = oFF.XString.toUpperCase(queryElement.getName());
				value = queryElement.getValue();
				if (oFF.XString.isEqual(oFF.ConnectionParameters.TAGS, key)) {
					systemDesc.setTags(value);
				} else {
					if (oFF.XString.isEqual(
							oFF.ConnectionParameters.SYSTEM_TYPE, key)
							|| oFF.XString.isEqual(
									oFF.ConnectionParameters.SYSTYPE, key)) {
						value = oFF.XString.toUpperCase(value);
						systemDesc.setSystemType(oFF.SystemType.lookup(value));
					} else {
						if (oFF.XString.isEqual(
								oFF.ConnectionParameters.LANGUAGE, key)) {
							value = oFF.XString.toUpperCase(value);
							systemDesc.setLanguage(value);
						}
					}
				}
			}
		}
		if (oFF.notNull(systemType)) {
			systemDesc.setSystemType(systemType);
		}
		return systemDesc;
	};
	oFF.StandaloneSystemLandscape.prototype.setSystem = function(name,
			properties) {
		var systemDesc = oFF.SystemDescription.createExt(this.getSession(),
				this, name, properties);
		this.setSystemByDescription(systemDesc);
		return systemDesc;
	};
	oFF.StandaloneSystemLandscape.prototype.setSystemByDescription = function(
			systemDescription) {
		var systemName = systemDescription.getSystemName();
		if (oFF.isNull(systemName)) {
			systemName = systemDescription.getName();
			if (oFF.isNull(systemName)) {
				throw oFF.XException
						.createIllegalArgumentException("NULL not allowed: systemDescription.getName() or .getSystemName() must not be NULL.");
			}
		}
		systemDescription.setApplication(this.getApplication());
		this.m_systemMap.put(systemName, systemDescription);
	};
	oFF.StandaloneSystemLandscape.prototype.getMasterSystemName = function() {
		return this.getDefaultSystemName(oFF.SystemRole.MASTER);
	};
	oFF.StandaloneSystemLandscape.prototype.setMasterSystemName = function(name) {
		this.setDefaultSystemName(oFF.SystemRole.MASTER, name);
	};
	oFF.StandaloneSystemLandscape.prototype.getMasterSystem = function() {
		var masterSystemName = this.getDefaultSystemName(oFF.SystemRole.MASTER);
		return this.m_systemMap.getByKey(masterSystemName);
	};
	oFF.StandaloneSystemLandscape.prototype.getDefaultSystemName = function(
			systemRole) {
		return this.m_roleMap.getByKey(systemRole.getName());
	};
	oFF.StandaloneSystemLandscape.prototype.setDefaultSystemName = function(
			systemRole, name) {
		this.m_roleMap.put(systemRole.getName(), name);
	};
	oFF.StandaloneSystemLandscape.prototype.getDefaultSystem = function(
			systemRole) {
		var name = this.m_roleMap.getByKey(systemRole.getName());
		return this.getSystemDescription(name);
	};
	oFF.StandaloneSystemLandscape.prototype.getSystemsByRole = function(role) {
		var systems = oFF.XList.create();
		var iterator = this.m_systemMap.getIterator();
		var systemDescription;
		var sysRoles;
		while (iterator.hasNext()) {
			systemDescription = iterator.next();
			if (oFF.isNull(role)) {
				systems.add(systemDescription);
			} else {
				sysRoles = systemDescription.getRoles();
				if (sysRoles.contains(role)) {
					systems.add(systemDescription);
				}
			}
		}
		oFF.XObjectExt.release(iterator);
		return systems;
	};
	oFF.StandaloneSystemLandscape.prototype.hasChildren = function() {
		return this.m_systemMap.size() > 0;
	};
	oFF.StandaloneSystemLandscape.prototype.getChildSetState = function() {
		return oFF.ChildSetState.COMPLETE;
	};
	oFF.StandaloneSystemLandscape.prototype.getName = function() {
		return "SystemLandscape";
	};
	oFF.StandaloneSystemLandscape.prototype.getText = function() {
		return "System Landscape";
	};
	oFF.StandaloneSystemLandscape.prototype.isNode = function() {
		return true;
	};
	oFF.StandaloneSystemLandscape.prototype.isLeaf = function() {
		return false;
	};
	oFF.StandaloneSystemLandscape.prototype.getTagValue = function(tagName) {
		return null;
	};
	oFF.StandaloneSystemLandscape.prototype.processChildFetch = oFF.noSupport;
	oFF.StandaloneSystemLandscape.prototype.getContentElement = function() {
		return this;
	};
	oFF.StandaloneSystemLandscape.prototype.getContentConstant = function() {
		return null;
	};
	oFF.StandaloneSystemLandscape.prototype.replaceOriginsWithMirror = function() {
		var systems = this.m_systemMap.getValuesAsReadOnlyList();
		var mirrors = oFF.XListOfString.create();
		var i;
		var system;
		var origin;
		var k;
		var mirrorName;
		var mirrorSystem;
		var originName;
		var originSystem;
		var mirrorBase;
		for (i = 0; i < systems.size(); i++) {
			system = systems.get(i);
			origin = system.getProperties().getStringByKey(
					oFF.ConnectionParameters.ORIGIN);
			if (oFF.notNull(origin)) {
				mirrors.add(system.getSystemName());
			}
		}
		for (k = 0; k < mirrors.size(); k++) {
			mirrorName = mirrors.get(k);
			mirrorSystem = this.m_systemMap.getByKey(mirrorName);
			originName = mirrorSystem.getProperties().getStringByKey(
					oFF.ConnectionParameters.ORIGIN);
			originSystem = this.m_systemMap.getByKey(originName);
			if (oFF.notNull(originSystem)) {
				this.m_systemMap.remove(mirrorName);
				this.m_systemMap.remove(originName);
				mirrorBase = mirrorSystem;
				mirrorBase.setName(originName);
				this.m_systemMap.put(originName, mirrorBase);
			}
		}
	};
	oFF.StandaloneSystemLandscape.prototype.toString = function() {
		var sb = oFF.XStringBuffer.create();
		var systemNameIterator;
		var systemName;
		var systemDescription;
		sb.appendLine("System landscape");
		if (oFF.XCollectionUtils.hasElements(this.m_systemMap)) {
			systemNameIterator = this.m_systemMap.getKeysAsIteratorOfString();
			while (systemNameIterator.hasNext()) {
				systemName = systemNameIterator.next();
				systemDescription = this.m_systemMap.getByKey(systemName);
				if (oFF.isNull(systemDescription)) {
					continue;
				}
				sb.appendNewLine();
				sb.append(systemDescription.toString());
			}
		}
		return sb.toString();
	};
	oFF.SystemDescription = function() {
	};
	oFF.SystemDescription.prototype = new oFF.DfApplicationContext();
	oFF.SystemDescription.create = function(systemLandscape, name, properties) {
		return oFF.SystemDescription.createExt(null, systemLandscape, name,
				properties);
	};
	oFF.SystemDescription.createExt = function(session, systemLandscape, name,
			properties) {
		var systemDescription = new oFF.SystemDescription();
		systemDescription.setupExt(session, systemLandscape, name, properties);
		return systemDescription;
	};
	oFF.SystemDescription.createByUri = function(systemLandscape, name, uri) {
		return oFF.SystemDescription.createByUriExt(null, systemLandscape,
				name, uri);
	};
	oFF.SystemDescription.createByUriExt = function(session, systemLandscape,
			name, uri) {
		var properties = oFF.XProperties.create();
		var path;
		var authenticationType;
		var queryElements;
		var size;
		var i;
		var nameValuePair;
		var key;
		var systemDescription;
		properties.put(oFF.ConnectionParameters.PROTOCOL, uri.getScheme());
		properties.put(oFF.ConnectionParameters.HOST, uri.getHost());
		properties.putInteger(oFF.ConnectionParameters.PORT, uri.getPort());
		path = uri.getPath();
		if (oFF.notNull(path)) {
			properties.put(oFF.ConnectionParameters.PATH, path);
		}
		authenticationType = uri.getAuthenticationType();
		if (oFF.notNull(authenticationType)) {
			properties.put(oFF.ConnectionParameters.AUTHENTICATION_TYPE,
					authenticationType.getName());
		}
		if (uri.getUser() !== null) {
			properties.put(oFF.ConnectionParameters.USER, uri.getUser());
		}
		if (uri.getPassword() !== null) {
			properties
					.put(oFF.ConnectionParameters.PASSWORD, uri.getPassword());
		}
		queryElements = uri.getQueryElements();
		size = queryElements.size();
		for (i = 0; i < size; i++) {
			nameValuePair = queryElements.get(i);
			key = oFF.XString.toUpperCase(nameValuePair.getName());
			properties.put(key, nameValuePair.getValue());
		}
		systemDescription = new oFF.SystemDescription();
		systemDescription.setupExt(session, systemLandscape, name, properties);
		return systemDescription;
	};
	oFF.SystemDescription.prototype.m_landscape = null;
	oFF.SystemDescription.prototype.m_connectionProperties = null;
	oFF.SystemDescription.prototype.m_systemMappings = null;
	oFF.SystemDescription.prototype.m_sysModCounter = 0;
	oFF.SystemDescription.prototype.m_nativeConnection = null;
	oFF.SystemDescription.prototype.m_capabilitiesWhitelist = null;
	oFF.SystemDescription.prototype.m_capabilitiesBlacklist = null;
	oFF.SystemDescription.prototype.m_hashedTags = null;
	oFF.SystemDescription.prototype.setupExt = function(session,
			systemLandscape, name, properties) {
		var application = null;
		var theSession;
		var propertyIterator;
		var propertyKey;
		var propertyValue;
		var mappingId;
		var serializeTable;
		var serializeSchema;
		var deserializeTable;
		var deserializeSchema;
		var useSecure;
		var secureUrl;
		var uri;
		if (oFF.notNull(systemLandscape)) {
			application = systemLandscape.getApplication();
			this.m_landscape = oFF.XWeakReferenceUtil
					.getWeakRef(systemLandscape);
		}
		this.setApplication(application);
		this.m_connectionProperties = oFF.XProperties.create();
		theSession = session;
		if (oFF.isNull(theSession) && oFF.notNull(application)) {
			theSession = application.getSession();
		}
		this.m_systemMappings = oFF.XHashMapByString.create();
		if (oFF.notNull(properties)) {
			propertyIterator = properties.getKeysAsIteratorOfString();
			while (propertyIterator.hasNext()) {
				propertyKey = propertyIterator.next();
				propertyValue = properties.getByKey(propertyKey);
				if (oFF.XString.startsWith(propertyKey,
						oFF.ConnectionParameters.MAPPING_SYSTEM_NAME)) {
					mappingId = oFF.XString.replace(propertyKey,
							oFF.ConnectionParameters.MAPPING_SYSTEM_NAME, "");
					serializeTable = properties
							.getByKey(oFF.XStringUtils
									.concatenate2(
											oFF.ConnectionParameters.MAPPING_SERIALIZATION_TABLE,
											mappingId));
					serializeSchema = properties
							.getByKey(oFF.XStringUtils
									.concatenate2(
											oFF.ConnectionParameters.MAPPING_SERIALIZATION_SCHEMA,
											mappingId));
					deserializeTable = properties
							.getByKey(oFF.XStringUtils
									.concatenate2(
											oFF.ConnectionParameters.MAPPING_DESERIALIZATION_TABLE,
											mappingId));
					deserializeSchema = properties
							.getByKey(oFF.XStringUtils
									.concatenate2(
											oFF.ConnectionParameters.MAPPING_DESERIALIZATION_SCHEMA,
											mappingId));
					this.m_systemMappings.put(propertyValue, oFF.SystemMapping
							.create(serializeTable, serializeSchema,
									deserializeTable, deserializeSchema));
				}
				this.setProperty(propertyKey, propertyValue);
			}
			if (oFF.notNull(theSession)) {
				useSecure = theSession.getEnvironment().getBooleanByKeyExt(
						oFF.XEnvironmentConstants.FIREFLY_SECURE, false);
				if (useSecure === true) {
					secureUrl = this.getProperties().getStringByKeyExt(
							oFF.ConnectionParameters.SECURE, null);
					if (oFF.notNull(secureUrl)) {
						uri = oFF.XUri.createFromUri(secureUrl);
						this.setHost(uri.getHost());
						this.setPort(uri.getPort());
						this.setProtocolType(uri.getProtocolType());
					}
				}
			}
		}
		if (oFF.notNull(name)) {
			this.setSystemName(name);
		}
		this.m_capabilitiesWhitelist = oFF.XHashMapByString.create();
		this.m_capabilitiesBlacklist = oFF.XHashMapByString.create();
		this.m_nativeConnection = null;
		this.m_sysModCounter = 1;
	};
	oFF.SystemDescription.prototype.releaseObject = function() {
		this.m_sysModCounter = 0;
		this.m_landscape = oFF.XObjectExt.release(this.m_landscape);
		this.m_systemMappings = oFF.XObjectExt.release(this.m_systemMappings);
		this.m_connectionProperties = null;
		this.m_capabilitiesWhitelist = oFF.XObjectExt
				.release(this.m_capabilitiesWhitelist);
		this.m_capabilitiesBlacklist = oFF.XObjectExt
				.release(this.m_capabilitiesBlacklist);
		this.m_nativeConnection = null;
		oFF.DfApplicationContext.prototype.releaseObject.call(this);
	};
	oFF.SystemDescription.prototype.getComponentType = function() {
		return oFF.RuntimeComponentType.SYSTEM_DESCRIPTION;
	};
	oFF.SystemDescription.prototype.setFromPersonalization = function(
			personalization) {
		oFF.XConnectHelper.copyConnectionPersonalization(personalization, this);
	};
	oFF.SystemDescription.prototype.setFromConnectionInfo = function(origin) {
		oFF.XConnectHelper.copyConnectionInfo(origin, this);
	};
	oFF.SystemDescription.prototype.setFromConnection = function(connection) {
		oFF.XConnectHelper.copyConnection(connection, this);
	};
	oFF.SystemDescription.prototype.isNode = function() {
		return false;
	};
	oFF.SystemDescription.prototype.isLeaf = function() {
		return true;
	};
	oFF.SystemDescription.prototype.getHost = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.HOST);
	};
	oFF.SystemDescription.prototype.getLandscape = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_landscape);
	};
	oFF.SystemDescription.prototype.getPassword = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.PASSWORD);
	};
	oFF.SystemDescription.prototype.getUser = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.USER);
	};
	oFF.SystemDescription.prototype.getOrganization = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.ORGANIZATION);
	};
	oFF.SystemDescription.prototype.setOrganization = function(organization) {
		this.setProperty(oFF.ConnectionParameters.ORGANIZATION, organization);
	};
	oFF.SystemDescription.prototype.getElement = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.ELEMENT);
	};
	oFF.SystemDescription.prototype.setElement = function(element) {
		this.setProperty(oFF.ConnectionParameters.ELEMENT, element);
	};
	oFF.SystemDescription.prototype.getX509Certificate = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.X509CERTIFICATE);
	};
	oFF.SystemDescription.prototype.setX509Certificate = function(
			x509Certificate) {
		this.setProperty(oFF.ConnectionParameters.X509CERTIFICATE,
				x509Certificate);
	};
	oFF.SystemDescription.prototype.getSecureLoginProfile = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.SECURE_LOGIN_PROFILE);
	};
	oFF.SystemDescription.prototype.setSecureLoginProfile = function(
			secureLoginProfile) {
		this.setProperty(oFF.ConnectionParameters.SECURE_LOGIN_PROFILE,
				secureLoginProfile);
	};
	oFF.SystemDescription.prototype.getLanguage = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.LANGUAGE);
	};
	oFF.SystemDescription.prototype.setLanguage = function(language) {
		if (oFF.isNull(language)) {
			this.m_connectionProperties
					.remove(oFF.ConnectionParameters.LANGUAGE);
		} else {
			this.m_connectionProperties.put(oFF.ConnectionParameters.LANGUAGE,
					language);
		}
	};
	oFF.SystemDescription.prototype.getAuthenticationType = function() {
		var value = this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.AUTHENTICATION_TYPE);
		if (oFF.isNull(value)) {
			return oFF.AuthenticationType.NONE;
		}
		return oFF.AuthenticationType.lookup(value);
	};
	oFF.SystemDescription.prototype.setAuthenticationType = function(type) {
		this.setProperty(oFF.ConnectionParameters.AUTHENTICATION_TYPE, type
				.getName());
	};
	oFF.SystemDescription.prototype.setHost = function(host) {
		this.setProperty(oFF.ConnectionParameters.HOST, host);
	};
	oFF.SystemDescription.prototype.setPassword = function(password) {
		this.setProperty(oFF.ConnectionParameters.PASSWORD, password);
	};
	oFF.SystemDescription.prototype.setAuthenticationToken = function(token) {
		this.setProperty(oFF.ConnectionParameters.TOKEN_VALUE, token
				.getAccessToken());
	};
	oFF.SystemDescription.prototype.getAuthenticationToken = function() {
		var value = this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.TOKEN_VALUE);
		return oFF.XAuthenticationToken.create(value);
	};
	oFF.SystemDescription.prototype.setAccessToken = function(token) {
		this.setProperty(oFF.ConnectionParameters.TOKEN_VALUE, token);
	};
	oFF.SystemDescription.prototype.getAccessToken = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.TOKEN_VALUE);
	};
	oFF.SystemDescription.prototype.setPort = function(port) {
		var value = oFF.XInteger.convertToString(port);
		this.setProperty(oFF.ConnectionParameters.PORT, value);
	};
	oFF.SystemDescription.prototype.getPort = function() {
		var value = this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.PORT);
		var defaultPort = 0;
		var internetProtocolType = this.getProtocolType();
		if (oFF.ProtocolType.HTTP === internetProtocolType) {
			defaultPort = 80;
		} else {
			if (oFF.ProtocolType.HTTPS === internetProtocolType) {
				defaultPort = 443;
			}
		}
		return oFF.XInteger.convertFromStringWithDefault(value, defaultPort);
	};
	oFF.SystemDescription.prototype.getPath = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.PATH);
	};
	oFF.SystemDescription.prototype.setPath = function(path) {
		this.setProperty(oFF.ConnectionParameters.PATH, path);
	};
	oFF.SystemDescription.prototype.getClient = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.CLIENT);
	};
	oFF.SystemDescription.prototype.setClient = function(client) {
		this.setProperty(oFF.ConnectionParameters.CLIENT, client);
	};
	oFF.SystemDescription.prototype.setUser = function(user) {
		this.setProperty(oFF.ConnectionParameters.USER, user);
	};
	oFF.SystemDescription.prototype.getTimeout = function() {
		return this.m_connectionProperties.getIntegerByKeyExt(
				oFF.ConnectionParameters.TIMEOUT, -1);
	};
	oFF.SystemDescription.prototype.setTimeout = function(milliseconds) {
		var value = oFF.XInteger.convertToString(milliseconds);
		this.setProperty(oFF.ConnectionParameters.TIMEOUT, value);
	};
	oFF.SystemDescription.prototype.getScheme = function() {
		return this.getProtocolType().getName();
	};
	oFF.SystemDescription.prototype.getProtocolType = function() {
		var typeValue = this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.PROTOCOL);
		return oFF.isNull(typeValue) ? oFF.ProtocolType.HTTP : oFF.ProtocolType
				.lookup(typeValue);
	};
	oFF.SystemDescription.prototype.setScheme = function(scheme) {
		this.setProperty(oFF.ConnectionParameters.PROTOCOL, scheme);
	};
	oFF.SystemDescription.prototype.setProtocolType = function(type) {
		this.setProperty(oFF.ConnectionParameters.PROTOCOL,
				oFF.isNull(type) ? null : type.getName());
	};
	oFF.SystemDescription.prototype.isMasterSystem = function() {
		var landscape = this.getLandscape();
		return oFF.notNull(landscape)
				&& oFF.XString.isEqual(landscape.getMasterSystemName(), this
						.getSystemName());
	};
	oFF.SystemDescription.prototype.getPrefix = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.PREFIX);
	};
	oFF.SystemDescription.prototype.setPrefix = function(prefix) {
		this.setProperty(oFF.ConnectionParameters.PREFIX, prefix);
	};
	oFF.SystemDescription.prototype.getWebdispatcherTemplate = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.WEBDISPATCHER_URI);
	};
	oFF.SystemDescription.prototype.setWebdispatcherUri = function(template) {
		this.setWebdispatcherTemplate(template);
	};
	oFF.SystemDescription.prototype.setWebdispatcherTemplate = function(
			template) {
		this.setProperty(oFF.ConnectionParameters.WEBDISPATCHER_URI, template);
	};
	oFF.SystemDescription.prototype.getPreflightUri = function() {
		var uri = this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.PREFLIGHT);
		if (oFF.XStringUtils.isNullOrEmpty(uri)
				&& this.getSystemType().supportsPreflight()) {
			uri = "/";
		}
		return uri;
	};
	oFF.SystemDescription.prototype.setPreflightUri = function(preflightUri) {
		this.setProperty(oFF.ConnectionParameters.PREFLIGHT, preflightUri);
	};
	oFF.SystemDescription.prototype.setTags = function(tags) {
		this.setProperty(oFF.ConnectionParameters.TAGS, tags);
	};
	oFF.SystemDescription.prototype.getTags = function() {
		var tags = this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.TAGS);
		if (oFF.isNull(tags)) {
			return oFF.XHashSetOfString.create();
		}
		return oFF.XStringTokenizer.splitString(tags, ",");
	};
	oFF.SystemDescription.prototype.getHashedTags = function() {
		var tags;
		var iterator;
		if (oFF.isNull(this.m_hashedTags)) {
			tags = this.getTags();
			this.m_hashedTags = oFF.XHashSetOfString.create();
			iterator = tags.getIterator();
			while (iterator.hasNext()) {
				this.m_hashedTags.add(iterator.next());
			}
		}
		return this.m_hashedTags;
	};
	oFF.SystemDescription.prototype.getRoles = function() {
		var roles = oFF.XList.create();
		var rolesList = this.getTags().getIterator();
		var role;
		while (rolesList.hasNext()) {
			role = oFF.SystemRole.lookup(rolesList.next());
			if (oFF.notNull(role)) {
				roles.add(role);
			}
		}
		return roles;
	};
	oFF.SystemDescription.prototype.getSystemMapping = function(systemName) {
		return this.m_systemMappings.getByKey(systemName);
	};
	oFF.SystemDescription.prototype.getSystemMappings = function() {
		return this.m_systemMappings;
	};
	oFF.SystemDescription.prototype.getProperties = function() {
		return this.m_connectionProperties;
	};
	oFF.SystemDescription.prototype.setProperty = function(name, value) {
		if (oFF.isNull(value)) {
			this.m_connectionProperties.remove(name);
		} else {
			this.m_connectionProperties.put(name, value);
		}
		this.m_sysModCounter++;
	};
	oFF.SystemDescription.prototype.getName = function() {
		return this.getSystemName();
	};
	oFF.SystemDescription.prototype.setName = function(name) {
		this.setSystemName(name);
	};
	oFF.SystemDescription.prototype.getSystemName = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.NAME);
	};
	oFF.SystemDescription.prototype.setSystemName = function(systemName) {
		this.setProperty(oFF.ConnectionParameters.NAME, systemName);
	};
	oFF.SystemDescription.prototype.getText = function() {
		return this.getSystemText();
	};
	oFF.SystemDescription.prototype.setText = function(text) {
		this.setSystemText(text);
	};
	oFF.SystemDescription.prototype.getSystemText = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.DESCRIPTION);
	};
	oFF.SystemDescription.prototype.setSystemText = function(systemText) {
		this.setProperty(oFF.ConnectionParameters.DESCRIPTION, systemText);
	};
	oFF.SystemDescription.prototype.getSystemType = function() {
		var sysTypeValue = this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.SYSTEM_TYPE);
		var systemType;
		if (oFF.isNull(sysTypeValue)) {
			sysTypeValue = this.m_connectionProperties
					.getByKey(oFF.ConnectionParameters.SYSTYPE);
		}
		systemType = null;
		if (oFF.notNull(sysTypeValue)) {
			systemType = oFF.SystemType.lookup(sysTypeValue);
		}
		if (oFF.isNull(systemType)) {
			systemType = oFF.SystemType.GENERIC;
		}
		return systemType;
	};
	oFF.SystemDescription.prototype.setSystemType = function(systemType) {
		this.setProperty(oFF.ConnectionParameters.SYSTEM_TYPE, systemType
				.getName());
	};
	oFF.SystemDescription.prototype.getProxyHost = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.PROXY_HOST);
	};
	oFF.SystemDescription.prototype.setProxyHost = function(host) {
		this.setProperty(oFF.ConnectionParameters.PROXY_HOST, host);
	};
	oFF.SystemDescription.prototype.getProxyAuthorization = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.PROXY_AUTHORIZATION);
	};
	oFF.SystemDescription.prototype.setProxyAuthorization = function(
			authorization) {
		this.setProperty(oFF.ConnectionParameters.PROXY_AUTHORIZATION,
				authorization);
	};
	oFF.SystemDescription.prototype.getSccLocationId = function() {
		return null;
	};
	oFF.SystemDescription.prototype.setSccLocationId = function(sccLocationId) {
	};
	oFF.SystemDescription.prototype.getProxyHttpHeaders = function() {
		return null;
	};
	oFF.SystemDescription.prototype.setProxyHttpHeader = function(name, value) {
	};
	oFF.SystemDescription.prototype.getProxyType = function() {
		var template = this.getWebdispatcherTemplate();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(template)) {
			return oFF.ProxyType.WEBDISPATCHER;
		} else {
			return oFF.ProxyType.DEFAULT;
		}
	};
	oFF.SystemDescription.prototype.setProxyType = function(type) {
	};
	oFF.SystemDescription.prototype.getProxyPort = function() {
		return this.m_connectionProperties.getIntegerByKeyExt(
				oFF.ConnectionParameters.PROXY_PORT, -1);
	};
	oFF.SystemDescription.prototype.setProxyPort = function(port) {
		this.setProperty(oFF.ConnectionParameters.PROXY_PORT, oFF.XInteger
				.convertToString(port));
	};
	oFF.SystemDescription.prototype.getSysModCounter = function() {
		return this.m_sysModCounter;
	};
	oFF.SystemDescription.prototype.getUriString = function() {
		return oFF.XUri.getUriStringStatic(this, null, true, true, true, true,
				true, true, true, true);
	};
	oFF.SystemDescription.prototype.getUriStringWithoutAuthentication = function() {
		return oFF.XUri.getUriStringStatic(this, null, true, false, false,
				false, true, true, true, true);
	};
	oFF.SystemDescription.prototype.getUriStringExt = function(withSchema,
			withUser, withPwd, withAuthenticationType, withHostPort, withPath,
			withQuery, withFragment) {
		return oFF.XUri.getUriStringStatic(this, null, withSchema, withUser,
				withPwd, withAuthenticationType, withHostPort, withPath,
				withQuery, withFragment);
	};
	oFF.SystemDescription.prototype.getTagValue = function(tagName) {
		return this.m_connectionProperties.getByKey(tagName);
	};
	oFF.SystemDescription.prototype.getContentElement = function() {
		return this;
	};
	oFF.SystemDescription.prototype.getContentConstant = function() {
		return null;
	};
	oFF.SystemDescription.prototype.getNativeConnection = function() {
		return this.m_nativeConnection;
	};
	oFF.SystemDescription.prototype.setNativeConnection = function(
			nativeConnection) {
		this.m_nativeConnection = nativeConnection;
	};
	oFF.SystemDescription.prototype.setCapabilitiesWhitelist = function(
			serviceName, capabilities) {
		if (oFF.XStringUtils.isNotNullAndNotEmpty(serviceName)
				&& oFF.notNull(capabilities)) {
			this.m_capabilitiesWhitelist.put(serviceName, capabilities);
		}
	};
	oFF.SystemDescription.prototype.setCapabilitiesBlacklist = function(
			serviceName, capabilities) {
		if (oFF.XStringUtils.isNotNullAndNotEmpty(serviceName)
				&& oFF.notNull(capabilities)) {
			this.m_capabilitiesBlacklist.put(serviceName, capabilities);
		}
	};
	oFF.SystemDescription.prototype.getCapabilitiesWhitelist = function(
			serviceName) {
		return this.m_capabilitiesWhitelist.getByKey(serviceName);
	};
	oFF.SystemDescription.prototype.getCapabilitiesBlacklist = function(
			serviceName) {
		return this.m_capabilitiesBlacklist.getByKey(serviceName);
	};
	oFF.SystemDescription.prototype.isSystemMappingValid = function(
			remoteSystemDesription) {
		var mapping = this.getSystemMapping(remoteSystemDesription
				.getSystemName());
		var mappingRemote = remoteSystemDesription.getSystemMapping(this
				.getSystemName());
		return oFF.notNull(mapping) && oFF.notNull(mappingRemote)
				&& mapping.isValid(mappingRemote);
	};
	oFF.SystemDescription.prototype.toString = function() {
		var sb = oFF.XStringBuffer.create();
		var name;
		var text;
		var properties;
		var propertyNames;
		var i;
		var propertyName;
		var propertyValue;
		sb.append("System:");
		name = this.getSystemName();
		if (oFF.notNull(name)) {
			sb.append(" ").append(name);
		}
		text = this.getSystemText();
		if (oFF.notNull(text)) {
			sb.append(" - ").append(text);
		}
		sb.appendNewLine();
		properties = this.getProperties();
		if (oFF.XCollectionUtils.hasElements(properties)) {
			propertyNames = oFF.XListOfString.createFromReadOnlyList(properties
					.getKeysAsReadOnlyListOfString());
			propertyNames.sortByDirection(oFF.XSortDirection.ASCENDING);
			for (i = 0; i < propertyNames.size(); i++) {
				propertyName = propertyNames.get(i);
				if (oFF.isNull(propertyName)) {
					continue;
				}
				sb.append(propertyName).append("=");
				if (oFF.XString.isEqual(propertyName,
						oFF.ConnectionParameters.PASSWORD)) {
					sb.append("**********");
				} else {
					propertyValue = properties.getByKey(propertyName);
					if (oFF.notNull(propertyValue)) {
						sb.append(propertyValue);
					}
				}
				sb.appendNewLine();
			}
		}
		return sb.toString();
	};
	oFF.SystemDescription.prototype.getAlias = function() {
		return this.m_connectionProperties
				.getByKey(oFF.ConnectionParameters.ALIAS);
	};
	oFF.SystemDescription.prototype.setAlias = function(alias) {
		this.setProperty(oFF.ConnectionParameters.ALIAS, alias);
	};
	oFF.SystemLandscapeLoadAction = function() {
	};
	oFF.SystemLandscapeLoadAction.prototype = new oFF.SyncAction();
	oFF.SystemLandscapeLoadAction.createAndRun = function(syncType, listener,
			customIdentifier, application, url) {
		return oFF.SystemLandscapeLoadAction.createAndRunInternal(syncType,
				listener, customIdentifier, application, url, 0,
				oFF.XHashSetOfString.create());
	};
	oFF.SystemLandscapeLoadAction.createAndRunInternal = function(syncType,
			listener, customIdentifier, application, url, level, uriSet) {
		var newObject;
		var location;
		var relative;
		var fullUri;
		oFF.XObjectExt.checkNotNull(url, "No URL given");
		newObject = new oFF.SystemLandscapeLoadAction();
		if (url.isRelativeUri()) {
			location = oFF.NetworkEnv.getLocation();
			relative = url.getUriString();
			newObject.m_url = oFF.XUri.createFromUriWithParent(relative,
					location, false);
		} else {
			newObject.m_url = url;
		}
		newObject.m_parents = oFF.XList.create();
		newObject.m_children = oFF.XList.create();
		newObject.m_all = oFF.XList.create();
		newObject.m_level = level;
		newObject.m_systemLandscape = application.getSystemLandscape();
		newObject.m_uriSet = uriSet;
		fullUri = url.getUriString();
		uriSet.add(fullUri);
		newObject.setupActionAndRun(syncType, application, listener,
				customIdentifier);
		return newObject;
	};
	oFF.SystemLandscapeLoadAction.setSystems = function(systemsStructure,
			systemLandscape) {
		var elementNames = systemsStructure.getKeysAsReadOnlyListOfString();
		var i;
		var systemName;
		var element;
		var systemStructure;
		var prop;
		var systemDescription;
		var keysAsIteratorOfString;
		var key;
		var value;
		var text;
		if (oFF.notNull(elementNames)) {
			for (i = 0; i < elementNames.size(); i++) {
				systemName = elementNames.get(i);
				if (oFF.notNull(systemName)) {
					element = systemsStructure.getByKey(systemName);
					if (oFF.notNull(element)
							&& element.getType() === oFF.PrElementType.STRUCTURE) {
						systemStructure = element;
						prop = oFF.SystemLandscapeLoadAction
								.createProperties(systemStructure);
						systemDescription = systemLandscape
								.getSystemDescription(systemName);
						if (oFF.notNull(systemDescription)) {
							keysAsIteratorOfString = prop
									.getKeysAsIteratorOfString();
							while (keysAsIteratorOfString.hasNext()) {
								key = keysAsIteratorOfString.next();
								value = prop.getStringByKey(key);
								systemDescription.setProperty(key, value);
							}
						} else {
							systemDescription = oFF.SystemDescription
									.createExt(systemLandscape.getSession(),
											systemLandscape, systemName, prop);
							systemLandscape
									.setSystemByDescription(systemDescription);
						}
						text = systemDescription.getSystemText();
						if (oFF.isNull(text)) {
							systemDescription.setSystemText(systemDescription
									.getSystemName());
						}
					}
				}
			}
		}
	};
	oFF.SystemLandscapeLoadAction.getSystemPropertiesFromUri = function(uri) {
		var properties = oFF.XProperties.create();
		var protocolType = uri.getProtocolType();
		var host;
		var port;
		if (oFF.notNull(protocolType)) {
			properties.put(oFF.ConnectionParameters.PROTOCOL, protocolType
					.getName());
		}
		host = uri.getHost();
		if (oFF.notNull(host)) {
			properties.put(oFF.ConnectionParameters.HOST, uri.getHost());
		}
		port = uri.getPort();
		if (port > 0) {
			properties.put(oFF.ConnectionParameters.PORT, oFF.XInteger
					.convertToString(port));
		}
		return oFF.ExtResult.create(properties, null);
	};
	oFF.SystemLandscapeLoadAction.createProperties = function(systemStructure) {
		var properties = oFF.XProperties.create();
		var elementNames = systemStructure.getKeysAsReadOnlyListOfString();
		var size = elementNames.size();
		var i;
		var key;
		var inaMappings;
		var sizeMappings;
		var idxMapping;
		var inaMapping;
		var systemName;
		var saveSchema;
		var saveTable;
		var loadSchema;
		var loadTable;
		var value;
		for (i = 0; i < size; i++) {
			key = elementNames.get(i);
			if (oFF.XString.isEqual(key, oFF.ConnectionParameters.MAPPINGS)) {
				inaMappings = systemStructure.getListByKey(key);
				sizeMappings = inaMappings.size();
				for (idxMapping = 0; idxMapping < sizeMappings; idxMapping++) {
					inaMapping = inaMappings.getStructureAt(idxMapping);
					systemName = inaMapping
							.getStringByKey(oFF.ConnectionParameters.MAPPING_SYSTEM_NAME);
					properties.put(oFF.XStringUtils.concatenate3(
							oFF.ConnectionParameters.MAPPING_SYSTEM_NAME, "$$",
							systemName), systemName);
					saveSchema = inaMapping
							.getStringByKey(oFF.ConnectionParameters.MAPPING_SERIALIZATION_SCHEMA);
					properties
							.put(
									oFF.XStringUtils
											.concatenate3(
													oFF.ConnectionParameters.MAPPING_SERIALIZATION_SCHEMA,
													"$$", systemName),
									saveSchema);
					saveTable = inaMapping
							.getStringByKey(oFF.ConnectionParameters.MAPPING_SERIALIZATION_TABLE);
					properties
							.put(
									oFF.XStringUtils
											.concatenate3(
													oFF.ConnectionParameters.MAPPING_SERIALIZATION_TABLE,
													"$$", systemName),
									saveTable);
					loadSchema = inaMapping
							.getStringByKey(oFF.ConnectionParameters.MAPPING_DESERIALIZATION_SCHEMA);
					properties
							.put(
									oFF.XStringUtils
											.concatenate3(
													oFF.ConnectionParameters.MAPPING_DESERIALIZATION_SCHEMA,
													"$$", systemName),
									loadSchema);
					loadTable = inaMapping
							.getStringByKey(oFF.ConnectionParameters.MAPPING_DESERIALIZATION_TABLE);
					properties
							.put(
									oFF.XStringUtils
											.concatenate3(
													oFF.ConnectionParameters.MAPPING_DESERIALIZATION_TABLE,
													"$$", systemName),
									loadTable);
				}
			} else {
				value = systemStructure.getStringByKey(key);
				properties.putString(key, value);
			}
		}
		return properties;
	};
	oFF.SystemLandscapeLoadAction.prototype.m_systemLandscape = null;
	oFF.SystemLandscapeLoadAction.prototype.m_url = null;
	oFF.SystemLandscapeLoadAction.prototype.m_parents = null;
	oFF.SystemLandscapeLoadAction.prototype.m_children = null;
	oFF.SystemLandscapeLoadAction.prototype.m_all = null;
	oFF.SystemLandscapeLoadAction.prototype.m_structure = null;
	oFF.SystemLandscapeLoadAction.prototype.m_systemName = null;
	oFF.SystemLandscapeLoadAction.prototype.m_finished = 0;
	oFF.SystemLandscapeLoadAction.prototype.m_level = 0;
	oFF.SystemLandscapeLoadAction.prototype.m_uriSet = null;
	oFF.SystemLandscapeLoadAction.prototype.releaseObject = function() {
		this.m_systemLandscape = null;
		this.m_url = null;
		this.m_systemName = null;
		this.m_structure = null;
		this.m_uriSet = null;
		this.m_parents = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_parents);
		this.m_children = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_children);
		this.m_all = null;
		oFF.SyncAction.prototype.releaseObject.call(this);
	};
	oFF.SystemLandscapeLoadAction.prototype.getComponentName = function() {
		return "SystemLandscapeLoadAction";
	};
	oFF.SystemLandscapeLoadAction.prototype.processSynchronization = function(
			syncType) {
		var buffer = oFF.XStringBuffer.create();
		var systemLandscape;
		var propertiesData;
		var system;
		var connection;
		var path;
		var query;
		var rpcFunction;
		var request;
		buffer.append("__landscapeserver__");
		buffer.append(this.m_url.getHost()).append(":").appendInt(
				this.m_url.getPort());
		this.m_systemName = buffer.toString();
		systemLandscape = this.getActionContext().getSystemLandscape();
		if (systemLandscape.getSystemDescription(this.m_systemName) === null) {
			propertiesData = oFF.SystemLandscapeLoadAction
					.getSystemPropertiesFromUri(this.m_url);
			this.addAllMessages(propertiesData);
			if (propertiesData.hasErrors()) {
				this.addError(oFF.ErrorCodes.OTHER_ERROR,
						"Cannot create system");
				return false;
			}
			system = systemLandscape.setSystem(this.m_systemName,
					propertiesData.getData());
			system.setProxyType(oFF.ProxyType.NONE);
		}
		connection = this.getActionContext().getConnection(this.m_systemName);
		path = this.m_url.getPath();
		if (oFF.notNull(path)) {
			query = this.m_url.getQuery();
			if (oFF.notNull(query)) {
				path = oFF.XStringUtils.concatenate3(path, "?", query);
			}
		}
		rpcFunction = connection.newRpcFunction(path);
		if (oFF.isNull(rpcFunction)) {
			this.addError(oFF.ErrorCodes.OTHER_ERROR, "Cannot create function");
			return false;
		}
		request = rpcFunction.getRequest();
		request.setMethod(oFF.HttpRequestMethod.HTTP_GET);
		rpcFunction.processFunctionExecution(syncType, this, null);
		return true;
	};
	oFF.SystemLandscapeLoadAction.prototype.onFunctionExecuted = function(
			extResult, response, customIdentifier) {
		var rootElement;
		var parentReferences;
		var referenceList;
		var furtherProcessing;
		var i;
		var parentRelativeUrlValue;
		var url;
		var urlValue;
		var parentAction;
		var customUrl;
		var landscapeCustomUrl;
		var childAction;
		this.addAllMessages(extResult);
		if (extResult.hasErrors()) {
			this.endSync();
		} else {
			rootElement = response.getRootElement();
			if (oFF.isNull(rootElement)) {
				this.addError(oFF.ErrorCodes.OTHER_ERROR,
						"No json root element in response");
				this.endSync();
			} else {
				this.m_structure = oFF.PrStructure.createDeepCopy(rootElement);
				parentReferences = this.m_structure
						.getListByKey("ParentLandscapeReferences");
				referenceList = oFF.PrUtils.copyStringValues(parentReferences,
						null);
				furtherProcessing = false;
				if (oFF.notNull(referenceList) && referenceList.size() > 0) {
					if (this.m_level > 5) {
						this
								.addError(oFF.ErrorCodes.OTHER_ERROR,
										"System Landscape Network too deep: > 5 levels");
					} else {
						for (i = 0; i < referenceList.size(); i++) {
							parentRelativeUrlValue = referenceList.get(i);
							if (oFF.XStringUtils
									.isNotNullAndNotEmpty(parentRelativeUrlValue)) {
								url = oFF.XUri.createFromUriWithParent(
										parentRelativeUrlValue, this.m_url,
										true);
								urlValue = url.getUriString();
								if (!this.m_uriSet.contains(urlValue)) {
									parentAction = oFF.SystemLandscapeLoadAction
											.createAndRunInternal(
													this.getActiveSyncType(),
													this,
													oFF.XIntegerValue.create(i),
													this.getActionContext(),
													url, this.m_level + 1,
													this.m_uriSet);
									this.m_parents.add(parentAction);
									this.m_all.add(parentAction);
									furtherProcessing = true;
								}
							}
						}
					}
				}
				if (this.m_level === 0) {
					customUrl = oFF.XEnvironment.getInstance().getVariable(
							oFF.XEnvironmentConstants.LANDSCAPE_CUSTOMIZATION);
					if (oFF.notNull(customUrl)) {
						landscapeCustomUrl = oFF.XUri.createFromUri(customUrl);
						childAction = oFF.SystemLandscapeLoadAction
								.createAndRunInternal(this.getActiveSyncType(),
										this, oFF.XIntegerValue.create(-1),
										this.getActionContext(),
										landscapeCustomUrl, this.m_level + 1,
										this.m_uriSet);
						this.m_children.add(childAction);
						this.m_all.add(childAction);
						furtherProcessing = true;
					}
				}
				if (this.getActiveSyncType() === oFF.SyncType.BLOCKING
						|| !furtherProcessing) {
					this.setData(this.m_systemLandscape);
					this.endSync();
				}
			}
		}
	};
	oFF.SystemLandscapeLoadAction.prototype.onLandscapeNodeLoaded = function(
			extResult, landscape, customIdentifier) {
		this.m_finished++;
		if (this.getActiveSyncType() === oFF.SyncType.NON_BLOCKING) {
			if (this.m_finished === this.m_all.size()) {
				this.setData(this.m_systemLandscape);
				this.endSync();
			}
		}
	};
	oFF.SystemLandscapeLoadAction.prototype.endSync = function() {
		if (this.m_level === 0) {
			this.removeTempSystems();
			this.mapSystems();
		}
		oFF.SyncAction.prototype.endSync.call(this);
	};
	oFF.SystemLandscapeLoadAction.prototype.removeTempSystems = function() {
		var i;
		var node;
		for (i = 0; i < this.m_all.size(); i++) {
			node = this.m_all.get(i);
			node.removeTempSystems();
		}
		this.getActionContext().getConnectionPool().clearConnectionsForSystem(
				this.m_systemName);
		this.m_systemLandscape.removeSystem(this.m_systemName);
	};
	oFF.SystemLandscapeLoadAction.prototype.mapSystems = function() {
		var i;
		var parentNode;
		var j;
		var childNode;
		for (i = 0; i < this.m_parents.size(); i++) {
			parentNode = this.m_parents.get(i);
			parentNode.mapSystems();
		}
		this.mapStructureToSystem(this.m_structure);
		for (j = 0; j < this.m_children.size(); j++) {
			childNode = this.m_children.get(j);
			childNode.mapSystems();
		}
	};
	oFF.SystemLandscapeLoadAction.prototype.mapStructureToSystem = function(
			landscapeStructure) {
		var systemLandscape;
		var systemsStructure;
		var includeFilter;
		var survivors;
		var ex;
		var systemNameToIncude;
		var k;
		var excludeFilter;
		var ex1;
		var systemNameToExclude;
		var roles;
		var iterator;
		var currentRole;
		var masterName;
		if (oFF.notNull(landscapeStructure)) {
			systemLandscape = this.getActionContext().getSystemLandscape();
			systemsStructure = landscapeStructure.getStructureByKey("Systems");
			if (oFF.notNull(systemsStructure)) {
				oFF.SystemLandscapeLoadAction.setSystems(systemsStructure,
						systemLandscape);
			}
			includeFilter = landscapeStructure.getListByKey("IncludeFilter");
			if (oFF.notNull(includeFilter)) {
				survivors = oFF.XList.create();
				for (ex = 0; ex < includeFilter.size(); ex++) {
					systemNameToIncude = includeFilter.getStringAt(ex);
					survivors.add(systemLandscape
							.getSystemDescription(systemNameToIncude));
				}
				systemLandscape.clearSystems();
				for (k = 0; k < survivors.size(); k++) {
					systemLandscape.setSystemByDescription(survivors.get(k));
				}
			}
			excludeFilter = landscapeStructure.getListByKey("ExcludeFilter");
			if (oFF.notNull(excludeFilter)) {
				for (ex1 = 0; ex1 < excludeFilter.size(); ex1++) {
					systemNameToExclude = excludeFilter.getStringAt(ex1);
					systemLandscape.removeSystem(systemNameToExclude);
				}
			}
			roles = landscapeStructure.getStructureByKey("Roles");
			if (oFF.notNull(roles)) {
				iterator = oFF.SystemRole.getAllRoles().getIterator();
				while (iterator.hasNext()) {
					currentRole = iterator.next();
					masterName = roles.getStringByKey(currentRole.getName());
					if (oFF.XStringUtils.isNotNullAndNotEmpty(masterName)) {
						systemLandscape.setDefaultSystemName(currentRole,
								masterName);
					}
				}
				oFF.XObjectExt.release(iterator);
			}
		}
	};
	oFF.SystemLandscapeLoadAction.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		listener.onLandscapeNodeLoaded(extResult, data, customIdentifier);
	};
	oFF.DfService = function() {
	};
	oFF.DfService.prototype = new oFF.SyncAction();
	oFF.DfService.prototype.m_connectionContainer = null;
	oFF.DfService.prototype.m_isInRelease = false;
	oFF.DfService.prototype.m_serviceConfig = null;
	oFF.DfService.prototype.m_application = null;
	oFF.DfService.prototype.setupService = function(serviceConfigInfo) {
		this.setupSynchronizingObject(serviceConfigInfo);
		this.m_serviceConfig = serviceConfigInfo;
		this.m_application = serviceConfigInfo.getApplication();
		this.registerServiceAtApplication();
	};
	oFF.DfService.prototype.releaseObject = function() {
		if (!this.m_isInRelease) {
			this.m_isInRelease = true;
			this.unregisterServiceAtApplication();
			this.m_serviceConfig = oFF.XObjectExt.release(this.m_serviceConfig);
			this.m_connectionContainer = null;
			this.m_application = null;
			oFF.SyncAction.prototype.releaseObject.call(this);
		}
	};
	oFF.DfService.prototype.getComponentName = function() {
		return "DfService2";
	};
	oFF.DfService.prototype.processInitialization = function(syncType,
			listener, customIdentifier) {
		return this.processSyncAction(syncType, listener, customIdentifier);
	};
	oFF.DfService.prototype.callListener = function(extResult, listener, data,
			customIdentifier) {
		listener.onServiceInitialized(extResult, data, customIdentifier);
	};
	oFF.DfService.prototype.requiresInitialization = function() {
		return true;
	};
	oFF.DfService.prototype.registerServiceAtApplication = function() {
		var application = this.getApplication();
		if (oFF.isNull(application)) {
			return;
		}
		application.registerService(this);
	};
	oFF.DfService.prototype.unregisterServiceAtApplication = function() {
		var application = this.getApplication();
		if (oFF.notNull(application)) {
			application.unregisterService(this);
		}
	};
	oFF.DfService.prototype.isServiceConfigMatching = function(serviceConfig,
			connection, messages) {
		return true;
	};
	oFF.DfService.prototype.getConnection = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_connectionContainer);
	};
	oFF.DfService.prototype.setConnection = function(connection) {
		this.m_connectionContainer = oFF.XWeakReferenceUtil
				.getWeakRef(connection);
	};
	oFF.DfService.prototype.getServiceConfig = function() {
		return this.m_serviceConfig;
	};
	oFF.DfService.prototype.getApplication = function() {
		return this.m_application;
	};
	oFF.DfServiceConfig = function() {
	};
	oFF.DfServiceConfig.prototype = new oFF.SyncAction();
	oFF.DfServiceConfig.prototype.m_application = null;
	oFF.DfServiceConfig.prototype.m_name = null;
	oFF.DfServiceConfig.prototype.m_connectionContainer = null;
	oFF.DfServiceConfig.prototype.m_usePrivateConnection = false;
	oFF.DfServiceConfig.prototype.m_connectionName = null;
	oFF.DfServiceConfig.prototype.m_syncTypeForInitialization = null;
	oFF.DfServiceConfig.prototype.m_serverMetadata = null;
	oFF.DfServiceConfig.prototype.m_serviceType = null;
	oFF.DfServiceConfig.prototype.m_systemName = null;
	oFF.DfServiceConfig.prototype.m_serviceTemporary = null;
	oFF.DfServiceConfig.prototype.m_isInRelease = false;
	oFF.DfServiceConfig.prototype.m_tagging = null;
	oFF.DfServiceConfig.prototype.m_useAsDataProvider = false;
	oFF.DfServiceConfig.prototype.setupConfig = function(application) {
		this.setupSynchronizingObject(application);
		this.m_application = application;
		this.setAutoConvertDataToWeakRef(true);
		this.m_tagging = oFF.XHashMapOfStringByString.create();
		application.registerDataProvider(this);
	};
	oFF.DfServiceConfig.prototype.releaseObject = function() {
		var data;
		if (!this.m_isInRelease) {
			this.m_isInRelease = true;
			this.m_application.unregisterDataProvider(this);
			if (this.m_useAsDataProvider) {
				data = this.getData();
				data = oFF.XObjectExt.release(data);
				this.setData(data);
			}
			this.m_application = null;
			this.m_tagging = null;
			this.m_connectionContainer = null;
			this.m_connectionName = null;
			this.m_serverMetadata = null;
			this.m_serviceTemporary = oFF.XObjectExt
					.release(this.m_serviceTemporary);
			this.m_serviceType = null;
			this.m_syncTypeForInitialization = null;
			this.m_systemName = null;
			oFF.SyncAction.prototype.releaseObject.call(this);
		}
	};
	oFF.DfServiceConfig.prototype.getComponentType = function() {
		return oFF.RuntimeComponentType.SERVICE_DATA_PROVIDER;
	};
	oFF.DfServiceConfig.prototype.getName = function() {
		return this.m_name;
	};
	oFF.DfServiceConfig.prototype.setName = function(name) {
		this.m_name = name;
	};
	oFF.DfServiceConfig.prototype.getDataProviderName = function() {
		return this.m_name;
	};
	oFF.DfServiceConfig.prototype.setDataProviderName = function(name) {
		this.m_name = name;
	};
	oFF.DfServiceConfig.prototype.getTagging = function() {
		return this.m_tagging;
	};
	oFF.DfServiceConfig.prototype.processSynchronization = function(syncType) {
		var systemDescription;
		var connectionPool;
		var revalidateMetadata;
		var connectionContainer;
		var serverMetadataExt;
		this.m_syncTypeForInitialization = syncType;
		this.prepareDefinition();
		if (this.isSystemBoundService()) {
			systemDescription = this.getSystemDescription();
			if (oFF.isNull(systemDescription)) {
				this.addError(0, oFF.XStringUtils.concatenate2(
						"Cannot find system description: ", this
								.getSystemName()));
				return false;
			}
			if (oFF.isNull(this.m_connectionContainer)
					|| this.getConnectionContainer().isDirty()) {
				connectionPool = this.getActionContext().getConnectionPool();
				this.m_connectionContainer = oFF.XWeakReferenceUtil
						.getWeakRef(connectionPool.getConnectionExt(
								systemDescription.getSystemName(),
								this.m_usePrivateConnection,
								this.m_connectionName));
			}
			revalidateMetadata = false;
			connectionContainer = this.getConnectionContainer();
			if (syncType === oFF.SyncType.BLOCKING) {
				serverMetadataExt = connectionContainer.getServerMetadataExt(
						syncType, null, null, revalidateMetadata);
				this.onServerMetadataLoaded(serverMetadataExt,
						serverMetadataExt.getData(), null);
			} else {
				connectionContainer.getServerMetadataExt(syncType, this, null,
						revalidateMetadata);
			}
		} else {
			this.onServerMetadataLoaded(null, null, null);
		}
		return true;
	};
	oFF.DfServiceConfig.prototype.onServerMetadataLoaded = function(extResult,
			serverMetadata, customIdentifier) {
		var syncType;
		var serviceTypeInfo;
		var serviceReferenceName;
		var syncAction;
		this.addAllMessages(extResult);
		this.m_serverMetadata = extResult;
		if (this.isSystemBoundService() && this.m_serverMetadata.hasErrors()) {
			this.endSync();
			return;
		}
		syncType = this.m_syncTypeForInitialization;
		this.m_syncTypeForInitialization = null;
		serviceTypeInfo = this.getServiceTypeInfo();
		serviceReferenceName = oFF.isNull(serviceTypeInfo) ? null
				: serviceTypeInfo.getServiceReferenceName();
		this.m_serviceTemporary = this
				.getMatchingServiceForServiceName(serviceReferenceName);
		if (oFF.isNull(this.m_serviceTemporary)) {
			this.addError(oFF.ErrorCodes.SERVICE_NOT_FOUND,
					serviceReferenceName);
			this.endSync();
			return;
		}
		if (this.m_serviceTemporary.requiresInitialization()) {
			syncAction = this.m_serviceTemporary.processInitialization(
					syncType, this, null);
			if (oFF.isNull(syncAction)) {
				this.setDataFromService(this.m_serviceTemporary);
				this.endSync();
			}
		} else {
			this.setDataFromService(this.m_serviceTemporary);
			this.endSync();
		}
	};
	oFF.DfServiceConfig.prototype.onServiceInitialized = function(extResult,
			service, customIdentifier) {
		this.addAllMessages(extResult);
		if (extResult.isValid()) {
			this.setDataFromService(this.m_serviceTemporary);
		}
		this.endSync();
	};
	oFF.DfServiceConfig.prototype.endSync = function() {
		this.m_serviceTemporary = null;
		oFF.SyncAction.prototype.endSync.call(this);
	};
	oFF.DfServiceConfig.prototype.getMatchingServiceForServiceName = function(
			serviceReferenceName) {
		var regService = oFF.RegistrationService.getInstance();
		var references = regService.getReferences(serviceReferenceName);
		var i;
		var registeredClass;
		var service;
		for (i = 0; i < references.size(); i++) {
			registeredClass = references.get(i);
			service = registeredClass.newInstance(this);
			if (service.isServiceConfigMatching(this, this
					.getConnectionContainer(), this)) {
				service.setupService(this);
				if (this.isSystemBoundService()) {
					service.setConnection(this.getConnectionContainer());
				}
				return service;
			}
		}
		return null;
	};
	oFF.DfServiceConfig.prototype.hasSystemNameSet = function() {
		return oFF.notNull(this.m_systemName);
	};
	oFF.DfServiceConfig.prototype.getSystemName = function() {
		if (oFF.isNull(this.m_systemName)) {
			this.m_systemName = this.getApplication().getSystemLandscape()
					.getMasterSystemName();
		}
		return this.m_systemName;
	};
	oFF.DfServiceConfig.prototype.getSystemType = function() {
		return this.getSystemDescription().getSystemType();
	};
	oFF.DfServiceConfig.prototype.setSystemName = function(systemName) {
		this.m_systemName = systemName;
	};
	oFF.DfServiceConfig.prototype.isSystemBoundService = function() {
		return true;
	};
	oFF.DfServiceConfig.prototype.getServiceTypeInfo = function() {
		return this.m_serviceType;
	};
	oFF.DfServiceConfig.prototype.getComponentName = function() {
		var serviceTypeInfo = this.getServiceTypeInfo();
		return oFF.isNull(serviceTypeInfo) ? "ServiceConfig" : serviceTypeInfo
				.getServiceReferenceName();
	};
	oFF.DfServiceConfig.prototype.setServiceTypeInfo = function(serviceTypeInfo) {
		this.m_serviceType = serviceTypeInfo;
	};
	oFF.DfServiceConfig.prototype.getApplication = function() {
		return this.m_application;
	};
	oFF.DfServiceConfig.prototype.getSystemDescription = function() {
		var application = this.getActionContext();
		var systemLandscape = application.getSystemLandscape();
		var systemName;
		if (oFF.isNull(systemLandscape)) {
			return null;
		}
		systemName = this.getSystemName();
		if (oFF.isNull(systemName)) {
			return systemLandscape.getMasterSystem();
		}
		return systemLandscape.getSystemDescription(systemName);
	};
	oFF.DfServiceConfig.prototype.processSyncAction = function(syncType,
			listener, customIdentifier) {
		if (oFF.notNull(this.m_connectionContainer)
				&& this.getConnectionContainer().isDirty()) {
			this.m_connectionContainer = null;
			this.clearMessages();
			this.resetSyncState();
		}
		return oFF.SyncAction.prototype.processSyncAction.call(this, syncType,
				listener, customIdentifier);
	};
	oFF.DfServiceConfig.prototype.setConnectionContainer = function(
			connectionContainer) {
		this.m_connectionContainer = oFF.XWeakReferenceUtil
				.getWeakRef(connectionContainer);
	};
	oFF.DfServiceConfig.prototype.getConnectionContainer = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_connectionContainer);
	};
	oFF.DfServiceConfig.prototype.setConnectionName = function(name) {
		this.m_connectionName = name;
	};
	oFF.DfServiceConfig.prototype.getConnectionName = function() {
		return this.m_connectionName;
	};
	oFF.DfServiceConfig.prototype.usePrivateConnection = function(
			usePrivateConnection) {
		this.m_usePrivateConnection = usePrivateConnection;
	};
	oFF.DfServiceConfig.prototype.hasPrivateConnection = function() {
		return this.m_usePrivateConnection;
	};
	oFF.DfServiceConfig.prototype.setUseAsDataProvider = function(
			useAsDataProvider) {
		this.m_useAsDataProvider = useAsDataProvider;
		this.setAutoConvertDataToWeakRef(!useAsDataProvider);
	};
	oFF.DfServiceConfig.prototype.isDataProviderUsage = function() {
		return this.m_useAsDataProvider;
	};
	oFF.DfServiceConfig.prototype.prepareDefinition = function() {
	};
	oFF.BasicCredentialsAction = function() {
	};
	oFF.BasicCredentialsAction.prototype = new oFF.SyncAction();
	oFF.BasicCredentialsAction.createAndRun = function(syncType, listener,
			customIdentifier, context, connection, rpcMessages, authType) {
		var object = new oFF.BasicCredentialsAction();
		object.m_rpcMessages = rpcMessages;
		object.m_connection = connection;
		object.m_authType = authType;
		object.setupActionAndRun(syncType, context, listener, customIdentifier);
		return object;
	};
	oFF.BasicCredentialsAction.prototype.m_connection = null;
	oFF.BasicCredentialsAction.prototype.m_rpcMessages = null;
	oFF.BasicCredentialsAction.prototype.m_authType = null;
	oFF.BasicCredentialsAction.prototype.releaseObject = function() {
		this.m_connection = null;
		this.m_rpcMessages = null;
		oFF.SyncAction.prototype.releaseObject.call(this);
	};
	oFF.BasicCredentialsAction.prototype.processSynchronization = function(
			syncType) {
		var personalization;
		if (oFF.isNull(this.m_rpcMessages)) {
			personalization = this.getActionContext().newPersonalization(
					this.m_connection);
			if (oFF.notNull(this.m_authType)) {
				personalization.setAuthenticationType(this.m_authType);
			}
			this.setData(personalization);
		} else {
			this.addAllMessages(this.m_rpcMessages);
		}
		return false;
	};
	oFF.BasicCredentialsAction.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		listener.onCredentialsReady(extResult, data, customIdentifier);
	};
	oFF.RuntimeComponentType = function() {
	};
	oFF.RuntimeComponentType.prototype = new oFF.XComponentType();
	oFF.RuntimeComponentType.APPLICATION = null;
	oFF.RuntimeComponentType.SUB_APPLICATION = null;
	oFF.RuntimeComponentType.SYSTEM_LANDSCAPE = null;
	oFF.RuntimeComponentType.SYSTEM_DESCRIPTION = null;
	oFF.RuntimeComponentType.SERVICE_DATA_PROVIDER = null;
	oFF.RuntimeComponentType.APPLICATION_PROGRAM = null;
	oFF.RuntimeComponentType.staticSetupRuntimeComponentTypes = function() {
		oFF.RuntimeComponentType.APPLICATION = oFF.RuntimeComponentType
				.createRuntimeType("Application", oFF.XComponentType._ROOT);
		oFF.RuntimeComponentType.SUB_APPLICATION = oFF.RuntimeComponentType
				.createRuntimeType("SubApplication", oFF.XComponentType._ROOT);
		oFF.RuntimeComponentType.SYSTEM_LANDSCAPE = oFF.RuntimeComponentType
				.createRuntimeType("SystemLandscape", oFF.XComponentType._ROOT);
		oFF.RuntimeComponentType.SYSTEM_DESCRIPTION = oFF.RuntimeComponentType
				.createRuntimeType("SystemDescription",
						oFF.XComponentType._ROOT);
		oFF.RuntimeComponentType.SERVICE_DATA_PROVIDER = oFF.RuntimeComponentType
				.createRuntimeType("ServiceDataProvider",
						oFF.IoComponentType.DATA_PROVIDER);
		oFF.RuntimeComponentType.APPLICATION_PROGRAM = oFF.RuntimeComponentType
				.createRuntimeType("ApplicationProgram",
						oFF.XComponentType.PROGRAM);
	};
	oFF.RuntimeComponentType.createRuntimeType = function(constant, parent) {
		var mt = new oFF.RuntimeComponentType();
		if (oFF.isNull(parent)) {
			mt.setupExt(constant, oFF.XComponentType._ROOT);
		} else {
			mt.setupExt(constant, parent);
		}
		return mt;
	};
	oFF.RpcBatchFunction = function() {
	};
	oFF.RpcBatchFunction.prototype = new oFF.DfRpcFunction();
	oFF.RpcBatchFunction.create = function(connection, relativeUri) {
		var ocpFunction = new oFF.RpcBatchFunction();
		ocpFunction.setupFunction(connection,
				connection.getSystemDescription(), relativeUri);
		return ocpFunction;
	};
	oFF.RpcBatchFunction.prototype.m_decorator = null;
	oFF.RpcBatchFunction.prototype.getComponentName = function() {
		return "RpcBatchFunction";
	};
	oFF.RpcBatchFunction.prototype.processSynchronization = function(syncType) {
		return true;
	};
	oFF.RpcBatchFunction.prototype.processFunctionExecution = function(
			syncType, listener, customIdentifier) {
		if (syncType !== oFF.SyncType.NON_BLOCKING) {
			throw oFF.XException
					.createIllegalStateException("batch mode is enabled: function calls must be non-blocking");
		}
		return oFF.DfRpcFunction.prototype.processFunctionExecution.call(this,
				syncType, listener, customIdentifier);
	};
	oFF.RpcBatchFunction.prototype.endSync = function() {
		this.setData(this.m_rpcResponse);
		oFF.DfRpcFunction.prototype.endSync.call(this);
	};
	oFF.RpcBatchFunction.prototype.setDecorator = function(decorator) {
		this.m_decorator = decorator;
	};
	oFF.RpcBatchFunction.prototype.getDecorator = function() {
		return this.m_decorator;
	};
	oFF.RpcHttpFunction = function() {
	};
	oFF.RpcHttpFunction.prototype = new oFF.DfRpcFunction();
	oFF.RpcHttpFunction.REQUEST_PARAM_SERVER_TRACE_FLAG = "trace";
	oFF.RpcHttpFunction.REQUEST_PARAM_SAP_STATISTICS = "sap-statistics";
	oFF.RpcHttpFunction.REQUEST_PARAM_SESSION_VIA_URL = "sap-sessionviaurl";
	oFF.RpcHttpFunction.PRINT_REQUESTS = false;
	oFF.RpcHttpFunction.PRINT_RESPONSES = false;
	oFF.RpcHttpFunction.DEBUG_MODE = false;
	oFF.RpcHttpFunction.TEST_MODE = false;
	oFF.RpcHttpFunction.TEST_MODE_LAST_REQUEST = null;
	oFF.RpcHttpFunction.create = function(connection, relativeUri) {
		var ocpFunction = new oFF.RpcHttpFunction();
		ocpFunction.setupFunction(connection,
				connection.getSystemDescription(), relativeUri);
		return ocpFunction;
	};
	oFF.RpcHttpFunction.prototype.m_httpClient = null;
	oFF.RpcHttpFunction.prototype.m_response = null;
	oFF.RpcHttpFunction.prototype.m_traceResponseFile = null;
	oFF.RpcHttpFunction.prototype.m_fingerprint = null;
	oFF.RpcHttpFunction.prototype.m_credentialsCallCounter = 0;
	oFF.RpcHttpFunction.prototype.m_staticURL = false;
	oFF.RpcHttpFunction.prototype.releaseObject = function() {
		this.m_fingerprint = null;
		this.m_httpClient = oFF.XObjectExt.release(this.m_httpClient);
		this.m_traceResponseFile = oFF.XObjectExt
				.release(this.m_traceResponseFile);
		oFF.DfRpcFunction.prototype.releaseObject.call(this);
	};
	oFF.RpcHttpFunction.prototype.getComponentName = function() {
		return "RpcHttpFunction";
	};
	oFF.RpcHttpFunction.prototype.getDefaultMessageLayer = function() {
		return oFF.OriginLayer.IOLAYER;
	};
	oFF.RpcHttpFunction.prototype.processSynchronization = function(syncType) {
		this.doRpcHttpProcessing();
		return true;
	};
	oFF.RpcHttpFunction.prototype.cancelSynchronization = function() {
		this.addErrorWithMessage("Request was cancelled");
		this.callListeners(false);
		oFF.DfRpcFunction.prototype.cancelSynchronization.call(this);
	};
	oFF.RpcHttpFunction.prototype.doRpcHttpProcessing = function() {
		var connection = this.getActionContext();
		var userManager = connection.getApplication().getUserManager();
		var authenticationType;
		this.m_credentialsCallCounter = this.m_credentialsCallCounter + 1;
		authenticationType = connection.getSystemDescription()
				.getAuthenticationType();
		if (this.getRequest().isFireAndForgetCall()
				|| authenticationType === oFF.AuthenticationType.NONE) {
			this.onCredentialsReady(null, null, null);
		} else {
			userManager.processGetCredentials(oFF.SyncType.BLOCKING, this,
					null, connection, this.m_credentialsCallCounter, null,
					null, null);
		}
	};
	oFF.RpcHttpFunction.prototype.setStaticURL = function(staticURL) {
		this.m_staticURL = staticURL;
	};
	oFF.RpcHttpFunction.prototype.onCredentialsReady = function(extResult,
			personalization, customIdentifier) {
		var connection;
		var systemDescription;
		var httpRequest;
		var relativeUriPath;
		var rpcRequest;
		var method;
		var headerFields;
		var application;
		var reentranceTicket;
		var parameters;
		var keys;
		var key;
		var requestStructure;
		var traceType;
		var traceInfo;
		var protocolTrace;
		var traceName;
		var serializedJsonString;
		var cache;
		var content;
		var response;
		var requestContentType;
		var buffer;
		var hasElement;
		var cookiesMasterStore;
		var normalizedPath;
		var traceFolderPath;
		var tracingFolderFile;
		this.clearMessages();
		if (oFF.notNull(extResult) && extResult.hasErrors()) {
			this.addAllMessages(extResult);
			this.endSync();
		} else {
			this.m_httpClient = oFF.XObjectExt.release(this.m_httpClient);
			connection = this.getActionContext();
			systemDescription = connection.getSystemDescription();
			this.setTraceInfo(connection.getTraceInfo());
			httpRequest = oFF.HttpRequest.create();
			httpRequest.setFromConnectionInfo(systemDescription);
			relativeUriPath = this.getRelativeUriPath(connection);
			httpRequest.setPath(relativeUriPath);
			rpcRequest = this.getRequest();
			method = rpcRequest.getMethod();
			httpRequest.setMethod(method);
			httpRequest.setAcceptContentType(rpcRequest.getAcceptContentType());
			headerFields = httpRequest.getHeaderFieldsBase();
			application = this.getApplication();
			headerFields.put(oFF.HttpConstants.HD_SAP_CLIENT_ID, oFF.XVersion
					.getLibVersion(application));
			reentranceTicket = connection.getReentranceTicket();
			if (oFF.notNull(reentranceTicket)) {
				headerFields.put(oFF.HttpConstants.HD_MYSAPSSO2,
						reentranceTicket);
			}
			if (oFF.notNull(personalization)) {
				this.setTokensIfExist(personalization, rpcRequest);
				httpRequest.setFromConnectionPersonalization(personalization);
			}
			parameters = this.prepareParameters(httpRequest);
			keys = parameters.getKeysAsIteratorOfString();
			while (keys.hasNext()) {
				key = keys.next();
				httpRequest.addQueryElement(key, parameters.getByKey(key));
			}
			requestStructure = rpcRequest.getRequestStructure();
			traceType = this.getTraceType();
			traceInfo = this.getTraceInfo();
			if (connection.useSessionUrlRewrite()) {
				httpRequest.addQueryElement(
						oFF.RpcHttpFunction.REQUEST_PARAM_SESSION_VIA_URL, "X");
			}
			if (traceType === oFF.TraceType.JSON) {
				protocolTrace = requestStructure
						.putNewStructure("ProtocolTrace");
				traceName = traceInfo.getTraceName();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(traceName)) {
					protocolTrace.putString("Name", traceName);
				}
				protocolTrace.putInteger("Index", traceInfo.getTraceIndex());
			} else {
				if (traceType === oFF.TraceType.BW_CATT) {
					httpRequest
							.addQueryElement(
									oFF.RpcHttpFunction.REQUEST_PARAM_SERVER_TRACE_FLAG,
									"C");
				} else {
					if (traceType === oFF.TraceType.BW_STD) {
						httpRequest
								.addQueryElement(
										oFF.RpcHttpFunction.REQUEST_PARAM_SERVER_TRACE_FLAG,
										"X");
					}
				}
			}
			if (application.isSapStatisticsEnabled()) {
				httpRequest.addQueryElement(
						oFF.RpcHttpFunction.REQUEST_PARAM_SAP_STATISTICS,
						"true");
			}
			this.setTokenHeader(connection, headerFields,
					oFF.HttpConstants.HD_CSRF_TOKEN, connection.getCsrfToken());
			if (connection.getTenantId() !== null) {
				httpRequest.addQueryElement("tenant", connection.getTenantId());
			}
			if (systemDescription.getSystemType() === oFF.SystemType.UNV
					|| systemDescription.getSystemType() === oFF.SystemType.UQAS) {
				this.setTokenHeader(connection, headerFields,
						oFF.HttpConstants.HD_BOE_SESSION_TOKEN, connection
								.getBoeSessionToken());
			}
			serializedJsonString = oFF.PrUtils.serialize(requestStructure,
					true, false, 0);
			if (method !== oFF.HttpRequestMethod.HTTP_GET) {
				cache = connection.getCache();
				if (cache.isEnabled()) {
					this.m_fingerprint = oFF.XSha1
							.createSHA1(serializedJsonString);
					content = cache.getByKey(this.m_fingerprint);
					if (oFF.notNull(content)) {
						response = this.getResponse();
						response.setRootElement(content, null);
						this.setData(response);
						this.endSync();
						return;
					}
				}
				requestContentType = rpcRequest.getRequestContentType();
				httpRequest.setContentType(requestContentType);
				if (requestContentType === oFF.ContentType.APPLICATION_JSON) {
					httpRequest.setString(serializedJsonString);
				} else {
					if (requestContentType === oFF.ContentType.APPLICATION_FORM) {
						buffer = oFF.XStringBuffer.create();
						hasElement = false;
						keys = parameters.getKeysAsIteratorOfString();
						while (keys.hasNext()) {
							if (hasElement) {
								buffer.append("&");
							}
							key = keys.next();
							buffer
									.append(
											oFF.XHttpUtils
													.encodeURIComponent(key))
									.append("=")
									.append(
											oFF.XHttpUtils
													.encodeURIComponent(parameters
															.getByKey(key)));
							hasElement = true;
						}
						httpRequest.setString(buffer.toString());
						oFF.XObjectExt.release(buffer);
					} else {
						throw oFF.XException
								.createIllegalStateException("Unsupported request content type");
					}
				}
			}
			cookiesMasterStore = connection.getConnectionPool()
					.getCookiesMasterStore();
			httpRequest.setCookiesMasterStore(cookiesMasterStore);
			if (oFF.RpcHttpFunction.DEBUG_MODE) {
				this.log(httpRequest.toString());
			}
			if (traceType === oFF.TraceType.FILE) {
				if (method === oFF.HttpRequestMethod.HTTP_POST) {
					normalizedPath = traceInfo.getTraceFolderInternal();
					if (oFF.isNull(normalizedPath)) {
						traceFolderPath = traceInfo.getTraceFolderPath();
						tracingFolderFile = oFF.XFile.createByNativePath(this
								.getSession(), traceFolderPath);
						if (tracingFolderFile.isExisting()
								&& tracingFolderFile.isDirectory()) {
							normalizedPath = tracingFolderFile
									.getNormalizedPath();
							traceInfo.setTraceFolderInternal(normalizedPath);
						}
					}
					if (oFF.notNull(normalizedPath)) {
						this.saveTraceFile(normalizedPath, systemDescription,
								parameters, serializedJsonString);
					}
				}
			}
			if (oFF.RpcHttpFunction.PRINT_REQUESTS
					&& method === oFF.HttpRequestMethod.HTTP_POST) {
				this.printExchangeDebugInfo(httpRequest);
			}
			if (oFF.RpcHttpFunction.TEST_MODE) {
				oFF.RpcHttpFunction.TEST_MODE_LAST_REQUEST = httpRequest;
			}
			if (traceType !== oFF.TraceType.NONE) {
				traceInfo.incrementTraceIndex();
			}
			this.m_httpClient = httpRequest.newHttpClient(this.getSession());
			this.setSyncChild(this.m_httpClient);
			this.logBuffer(oFF.OriginLayer.IOLAYER, oFF.Severity.DEBUG, 0)
					.append("doRpcHttpConnect URL: ").append(
							httpRequest.getUriStringExt(true, true, false,
									true, true, true, true, false)).flush();
			this.m_httpClient.processHttpRequest(this.getActiveSyncType(),
					this, httpRequest);
		}
	};
	oFF.RpcHttpFunction.prototype.setTokensIfExist = function(personalization,
			request) {
		if (oFF.XStringUtils.isNotNullAndNotEmpty(request.getUserToken())) {
			personalization.setUser(request.getUserToken());
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(request
				.getOrganizationToken())) {
			personalization.setOrganization(request.getOrganizationToken());
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(request.getElementToken())) {
			personalization.setElement(request.getElementToken());
		}
	};
	oFF.RpcHttpFunction.prototype.setTokenHeader = function(connection,
			headerFields, headerFieldName, token) {
		if (oFF.isNull(token)) {
			if (this.getRequest().getMethod() === oFF.HttpRequestMethod.HTTP_GET) {
				if (!connection.isLogoffSent()) {
					headerFields.put(headerFieldName,
							oFF.HttpConstants.VA_CSRF_FETCH);
				}
			}
		} else {
			headerFields.put(headerFieldName, token);
		}
	};
	oFF.RpcHttpFunction.prototype.saveTraceFile = function(normalizedPath,
			systemDescription, parameters, serializedJsonString) {
		var path = oFF.XStringBuffer.create();
		var appName;
		var tracePath;
		var traceFolder;
		var appReqIndex;
		var sizeReqIndex;
		var temp;
		var traceFilePath;
		var traceFile;
		var traceResponseFilePath;
		var byteArray;
		path.append(normalizedPath);
		path.append("/").append(systemDescription.getHost());
		path.append("/").appendInt(systemDescription.getPort());
		appName = parameters
				.getByKey(oFF.RpcRequestConstants.REQUEST_PARAM_TRACE_NAME);
		if (oFF.notNull(appName)) {
			path.append("/").append(appName);
		}
		tracePath = path.toString();
		traceFolder = oFF.XFile.create(this.getSession(), tracePath);
		if (!traceFolder.isExisting()) {
			traceFolder.mkdirs();
		}
		path.append("/");
		appReqIndex = parameters
				.getByKey(oFF.RpcRequestConstants.REQUEST_PARAM_TRACE_REQ_INDEX);
		if (oFF.notNull(appReqIndex)) {
			sizeReqIndex = oFF.XString.size(appReqIndex);
			if (sizeReqIndex === 1) {
				path.append("00");
			} else {
				if (sizeReqIndex === 2) {
					path.append("0");
				}
			}
			path.append(appReqIndex);
		}
		temp = path.toString();
		path.append("_req.json");
		traceFilePath = path.toString();
		oFF.XObjectExt.release(path);
		traceFile = oFF.XFile.create(this.getSession(), traceFilePath);
		if (traceFile.isExisting()) {
			traceFile.deleteFile();
		}
		traceResponseFilePath = oFF.XStringUtils
				.concatenate2(temp, "_res.json");
		this.m_traceResponseFile = oFF.XFile.create(this.getSession(),
				traceResponseFilePath);
		if (this.m_traceResponseFile.isExisting()) {
			this.m_traceResponseFile.deleteFile();
		}
		if (oFF.notNull(serializedJsonString)) {
			byteArray = oFF.XByteArray.convertFromStringWithCharset(
					serializedJsonString, oFF.XCharset.UTF8);
			traceFile.save(byteArray);
		}
	};
	oFF.RpcHttpFunction.prototype.getRelativeUriPath = function(connection) {
		var relativeUriPath = this.m_relativeUri.getPath();
		var sessionUrlRewrite;
		var index;
		var pathStart;
		var pathEnd;
		if (this.m_staticURL) {
			return relativeUriPath;
		}
		sessionUrlRewrite = connection.getSessionUrlRewrite();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(sessionUrlRewrite)) {
			index = oFF.XString.indexOf(relativeUriPath, "/sap/");
			if (index !== -1) {
				pathStart = oFF.XString
						.substring(relativeUriPath, 0, index + 4);
				pathEnd = oFF.XString.substring(relativeUriPath, index + 4, -1);
				return oFF.XStringUtils.concatenate3(pathStart,
						sessionUrlRewrite, pathEnd);
			}
		}
		return relativeUriPath;
	};
	oFF.RpcHttpFunction.prototype.prepareParameters = function(httpRequest) {
		var parameters = oFF.XProperties.createPropertiesCopy(this.m_rpcRequest
				.getAdditionalParameters());
		var systemDescription = this.getActionContext().getSystemDescription();
		var language = systemDescription.getLanguage();
		var systemType;
		var traceType;
		var traceInfo;
		var traceName;
		var index;
		var tracePath;
		var queryElements;
		var i;
		var nameValuePair;
		httpRequest.setLanguage(language);
		systemType = systemDescription.getSystemType();
		if (systemType.isTypeOf(oFF.SystemType.ABAP)) {
			parameters.putString(oFF.ConnectionConstants.SAP_CLIENT,
					systemDescription.getClient());
			if (oFF.notNull(language) && oFF.XString.size(language) > 0) {
				parameters.putString(oFF.ConnectionConstants.SAP_LANGUAGE,
						language);
			}
		}
		traceType = this.getTraceType();
		if (this.m_rpcRequest.getMethod() === oFF.HttpRequestMethod.HTTP_GET
				&& (!systemType.isTypeOf(oFF.SystemType.VIRTUAL_INA) || traceType !== oFF.TraceType.NONE)) {
			parameters.put(oFF.RpcRequestConstants.REQUEST_PARAM_TIMESTAMP,
					oFF.XLong.convertToString(oFF.XSystemUtils
							.getCurrentTimeInMilliseconds()));
		}
		if (traceType !== oFF.TraceType.NONE) {
			traceInfo = this.getTraceInfo();
			traceName = traceInfo.getTraceName();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(traceName)) {
				traceName = oFF.XString.replace(traceName, ":", ".");
				parameters.put(
						oFF.RpcRequestConstants.REQUEST_PARAM_TRACE_NAME,
						traceName);
				index = oFF.XInteger.convertToString(traceInfo.getTraceIndex());
				parameters.put(
						oFF.RpcRequestConstants.REQUEST_PARAM_TRACE_REQ_INDEX,
						index);
				tracePath = traceInfo.getTraceFolderPath();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(tracePath)) {
					parameters.put(
							oFF.RpcRequestConstants.REQUEST_PARAM_TRACE_PATH,
							tracePath);
				}
			}
		}
		queryElements = this.m_relativeUri.getQueryElements();
		if (oFF.notNull(queryElements)) {
			for (i = 0; i < queryElements.size(); i++) {
				nameValuePair = queryElements.get(i);
				parameters.put(nameValuePair.getName(), nameValuePair
						.getValue());
			}
		}
		return parameters;
	};
	oFF.RpcHttpFunction.prototype.onHttpResponse = function(extResult,
			response, customIdentifier) {
		var request = customIdentifier;
		var continueProcessing;
		var userManager;
		var connection;
		var newAuthenticationType;
		var isValid;
		this.m_response = response;
		this.handleStatusCode(request, response, extResult);
		if (oFF.notNull(response)) {
			this.handleTracing(response);
			this.handleSessionUrlRewrite(response);
			this.handleBoeSessionToken(request, response);
			this.handleJson(response);
		}
		if (this.getRequest().isFireAndForgetCall()) {
			this.setData(this.m_rpcResponse);
			this.endSync();
		} else {
			continueProcessing = true;
			if (oFF.notNull(response)) {
				continueProcessing = this.handleCsrf(request, response);
			}
			if (continueProcessing) {
				userManager = this.getApplication().getUserManager();
				connection = this.getActionContext();
				newAuthenticationType = this.getNewAuthenticationType(request,
						response);
				if (oFF.notNull(newAuthenticationType)) {
					this.m_credentialsCallCounter = this.m_credentialsCallCounter + 1;
					userManager.processGetCredentials(oFF.SyncType.BLOCKING,
							this, null, connection,
							this.m_credentialsCallCounter, null, null,
							newAuthenticationType);
				} else {
					isValid = this.isValid();
					if (isValid === false
							&& userManager.supportsOnErrorHandling()) {
						this.m_credentialsCallCounter = this.m_credentialsCallCounter + 1;
						userManager.processGetCredentials(
								oFF.SyncType.BLOCKING, this, null, connection,
								this.m_credentialsCallCounter, this.m_response,
								this, null);
					} else {
						if (isValid) {
							userManager.notifyCredentialsSuccess(connection);
						}
						this.setData(this.m_rpcResponse);
						this.endSync();
					}
				}
			}
		}
	};
	oFF.RpcHttpFunction.prototype.getNewAuthenticationType = function(request,
			response) {
		var authenticate;
		if (oFF.notNull(request) && oFF.notNull(response)) {
			if (response.getStatusCode() === oFF.HttpStatusCode.SC_UNAUTHORIZED) {
				authenticate = response.getHeaderFields().getStringByKey(
						oFF.HttpConstants.HD_WWW_AUTHENTICATE);
				if (oFF.XStringUtils.isNotNullAndNotEmpty(authenticate)) {
					if (oFF.XString.startsWith(authenticate,
							oFF.HttpConstants.VA_AUTHORIZATION_BASIC)) {
						if (request.getAuthenticationType() !== oFF.AuthenticationType.BASIC) {
							return oFF.AuthenticationType.BASIC;
						}
					}
				}
			}
		}
		return null;
	};
	oFF.RpcHttpFunction.prototype.handleTracing = function(response) {
		var traceType = this.getTraceType();
		var jsonContent;
		var json;
		var byteArray;
		if (traceType === oFF.TraceType.FILE
				&& oFF.notNull(this.m_traceResponseFile)) {
			jsonContent = response.getJsonContent();
			if (oFF.notNull(jsonContent)) {
				json = jsonContent.toString();
				byteArray = oFF.XByteArray.convertFromStringWithCharset(json,
						oFF.XCharset.UTF8);
				this.m_traceResponseFile.save(byteArray);
			}
		}
	};
	oFF.RpcHttpFunction.prototype.handleJson = function(response) {
		var jsonObject = response.getJsonContent();
		var stringContent = response.getStringContentExt(
				oFF.isNull(jsonObject), -1);
		var connection;
		var cache;
		this.getResponse().setRootElement(jsonObject, stringContent);
		if (oFF.notNull(jsonObject)) {
			connection = this.getActionContext();
			cache = connection.getCache();
			if (oFF.notNull(this.m_fingerprint) && cache.isEnabled()) {
				cache.put(this.m_fingerprint, jsonObject, null);
			}
		}
	};
	oFF.RpcHttpFunction.prototype.handleCsrf = function(request, response) {
		var headerFields = response.getHeaderFields();
		var csrfToken = headerFields
				.getStringByKey(oFF.HttpConstants.HD_CSRF_TOKEN);
		var continueProcessing;
		var connection;
		var isGetRequest;
		var serverStatusCode;
		var isCsrfTokenRequired;
		var synchronizationType;
		if (oFF.isNull(csrfToken)) {
			csrfToken = headerFields.getStringByKey(oFF.XString
					.toLowerCase(oFF.HttpConstants.HD_CSRF_TOKEN));
		}
		continueProcessing = true;
		if (oFF.notNull(csrfToken)) {
			connection = this.getActionContext();
			isGetRequest = request.getMethod() === oFF.HttpRequestMethod.HTTP_GET;
			if (isGetRequest) {
				serverStatusCode = this.getServerStatusCode();
				if (serverStatusCode === oFF.HttpStatusCode.SC_OK) {
					connection.setCsrfToken(csrfToken);
				}
			} else {
				isCsrfTokenRequired = oFF.XString.isEqual(
						oFF.HttpConstants.VA_CSRF_REQUIRED, csrfToken);
				if (isCsrfTokenRequired) {
					connection.incCsrfRequiredCount();
					this.addErrorExt(oFF.OriginLayer.PROTOCOL,
							oFF.ErrorCodes.INVALID_STATE,
							"Cannot fetch csrf token from server", null);
					if (this.isServerMetadataCall() === false) {
						continueProcessing = false;
						synchronizationType = this.getActiveSyncType();
						connection.getServerMetadataExt(synchronizationType,
								this, null, true);
					}
				}
			}
		}
		return continueProcessing;
	};
	oFF.RpcHttpFunction.prototype.handleSessionUrlRewrite = function(response) {
		var headerFields = response.getHeaderFields();
		var sessionUrlRewrite = headerFields
				.getStringByKey(oFF.HttpConstants.HD_SAP_URL_SESSION_ID);
		var connection;
		if (oFF.notNull(sessionUrlRewrite)) {
			connection = this.getActionContext();
			connection.setSessionUrlRewrite(sessionUrlRewrite);
		}
	};
	oFF.RpcHttpFunction.prototype.handleBoeSessionToken = function(request,
			response) {
		var connection = this.getActionContext();
		var systemDescription = connection.getSystemDescription();
		var systemType = systemDescription.getSystemType();
		var headerFields;
		var boeSessionToken;
		var serverStatusCode;
		var isGetRequest;
		if (systemType === oFF.SystemType.UNV
				|| systemType === oFF.SystemType.UQAS) {
			headerFields = response.getHeaderFields();
			boeSessionToken = headerFields
					.getStringByKey(oFF.HttpConstants.HD_BOE_SESSION_TOKEN);
			if (oFF.notNull(boeSessionToken)) {
				serverStatusCode = this.getServerStatusCode();
				isGetRequest = request.getMethod() === oFF.HttpRequestMethod.HTTP_GET;
				if (isGetRequest
						&& serverStatusCode === oFF.HttpStatusCode.SC_OK) {
					connection.setBoeSessionToken(boeSessionToken);
				}
			}
		}
	};
	oFF.RpcHttpFunction.prototype.handleStatusCode = function(request,
			response, messages) {
		var severity;
		var statusCode;
		var statusDetails;
		var errorBuffer;
		var errorStringContent;
		var url;
		this.clearMessages();
		this.addAllMessages(messages);
		severity = oFF.Severity.DEBUG;
		statusCode = -1;
		statusDetails = null;
		if (oFF.notNull(response)) {
			statusCode = response.getStatusCode();
			statusDetails = response.getStatusCodeDetails();
			if (oFF.isNull(statusDetails)) {
				statusDetails = oFF.XStringBuffer.create().append(
						"Http Status Code: ").appendInt(
						response.getStatusCode()).toString();
			}
			this.setServerStatusCode(statusCode);
			this.setServerStatusDetails(statusDetails);
		}
		if (messages.hasErrors()
				|| oFF.HttpStatusCode.isOk(statusCode) === false) {
			severity = oFF.Severity.ERROR;
			if (oFF.notNull(response)) {
				this.addErrorExt(oFF.OriginLayer.PROTOCOL,
						oFF.ErrorCodes.SYSTEM_IO_HTTP, statusDetails, null);
				errorBuffer = oFF.XStringBuffer.create();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(statusDetails)) {
					errorBuffer.appendLine(statusDetails);
				}
				if (statusCode === oFF.HttpStatusCode.SC_NOT_FOUND) {
					errorBuffer.append("Path: ").appendLine(
							response.getHttpRequest().getPath());
					errorBuffer.append("Request: ").append(
							response.getHttpRequest().getString());
				}
				if (response.isStringContentSet()) {
					errorStringContent = response.getString();
					if (oFF.XStringUtils
							.isNotNullAndNotEmpty(errorStringContent)) {
						if (oFF.XStringUtils.isNullOrEmpty(statusDetails)
								|| !oFF.XString.containsString(statusDetails,
										errorStringContent)) {
							errorBuffer.appendLine(errorStringContent);
						}
					}
				}
				this.addErrorExt(oFF.OriginLayer.PROTOCOL, statusCode,
						errorBuffer.toString(), null);
				oFF.XObjectExt.release(errorBuffer);
			}
		}
		url = request.getUriStringWithoutAuthentication();
		this.logBuffer(oFF.OriginLayer.IOLAYER, severity, 0).append(
				"onHttpResponse: URL:").append(url).appendNewLine().append(
				"Http Status: ").appendInt(statusCode).append(" ").append(
				statusDetails).append(messages.getSummary()).flush();
		if (oFF.RpcHttpFunction.DEBUG_MODE) {
			this.printResponseDebugInfo(response);
		}
		if (oFF.RpcHttpFunction.PRINT_RESPONSES) {
			this.printExchangeDebugInfo(response);
		}
	};
	oFF.RpcHttpFunction.prototype.onServerMetadataLoaded = function(extResult,
			serverMetadata, customIdentifier) {
		this.clearMessages();
		this.doRpcHttpProcessing();
	};
	oFF.RpcHttpFunction.prototype.getApplication = function() {
		return this.getActionContext().getApplication();
	};
	oFF.RpcHttpFunction.prototype.printResponseDebugInfo = function(response) {
	};
	oFF.RpcHttpFunction.prototype.printExchangeDebugInfo = function(
			httpExchange) {
	};
	oFF.ServerLoginAction = function() {
	};
	oFF.ServerLoginAction.prototype = new oFF.ServerCallAction();
	oFF.ServerLoginAction.createAndRun = function(syncType,
			connectionContainer, listener, customIdentifier) {
		var object = new oFF.ServerLoginAction();
		object.setupActionAndRun(syncType, connectionContainer, listener,
				customIdentifier);
		return object;
	};
	oFF.ServerLoginAction.prototype.getUri = function(connection) {
		return oFF.XUri.createFromUri(connection.getSystemDescription()
				.getSystemType().getLogonPath());
	};
	oFF.ServerPreflightAction = function() {
	};
	oFF.ServerPreflightAction.prototype = new oFF.ServerCallAction();
	oFF.ServerPreflightAction.createAndRun = function(syncType,
			connectionContainer, listener, customIdentifier) {
		var object = new oFF.ServerPreflightAction();
		object.setupActionAndRun(syncType, connectionContainer, listener,
				customIdentifier);
		return object;
	};
	oFF.ServerPreflightAction.prototype.onFunctionExecutedInternal = function(
			extResult, response, customIdentifier) {
		var connectionContainer = this.getActionContext();
		connectionContainer.setIsPreflightNeeded(false);
	};
	oFF.ServerPreflightAction.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		listener.onServerPreflight(extResult, data, customIdentifier);
	};
	oFF.ServerPreflightAction.prototype.getUri = function(connection) {
		return connection.getPreflightUri();
	};
	oFF.DfServiceConfigClassic = function() {
	};
	oFF.DfServiceConfigClassic.prototype = new oFF.DfServiceConfig();
	oFF.DfServiceConfigClassic.prototype.processServiceCreation = function(
			syncType, listener, customIdentifier) {
		return this.processSyncAction(syncType, listener, customIdentifier);
	};
	oFF.DfServiceConfigClassic.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		var myListener = listener;
		myListener.onServiceCreation(extResult, data, customIdentifier);
	};
	oFF.DfServiceConfigClassic.prototype.setDataFromService = function(service) {
		this.setData(service);
	};
	oFF.RuntimeModule = function() {
	};
	oFF.RuntimeModule.prototype = new oFF.DfModule();
	oFF.RuntimeModule.LISTENER_SERVICE_INCUBATOR = null;
	oFF.RuntimeModule.LISTENER_SERVER_METADATA_VALID = null;
	oFF.RuntimeModule.XS_REPOSITORY = "REPOSITORY";
	oFF.RuntimeModule.s_module = null;
	oFF.RuntimeModule.getInstance = function() {
		return oFF.RuntimeModule.initVersion(oFF.XVersion.API_DEFAULT);
	};
	oFF.RuntimeModule.initVersion = function(version) {
		var timestamp;
		var registrationService;
		if (oFF.isNull(oFF.RuntimeModule.s_module)) {
			oFF.DfModule.checkInitialized(oFF.IoExtModule.initVersion(version));
			timestamp = oFF.DfModule.start("RuntimeModule...");
			oFF.RuntimeModule.s_module = new oFF.RuntimeModule();
			registrationService = oFF.RegistrationService.getInstance();
			oFF.RuntimeModule.LISTENER_SERVICE_INCUBATOR = oFF.XStringValue
					.create("IServiceCreationListener");
			oFF.RuntimeModule.LISTENER_SERVER_METADATA_VALID = oFF.XStringValue
					.create("IServerMetadataListener");
			oFF.RuntimeComponentType.staticSetupRuntimeComponentTypes();
			oFF.SystemRole.staticSetup();
			oFF.SignPresentation.staticSetup();
			oFF.OlapEnvironmentFactory.staticSetup();
			oFF.EnvironmentVariableInit.staticSetup();
			oFF.BasicCredentialsProvider.staticSetup();
			oFF.RepoMountType.staticSetup();
			oFF.ApplicationSystemOption.staticSetup();
			oFF.NestedBatchRequestDecoratorProvider.staticSetup();
			registrationService
					.addReference(
							oFF.BatchRequestDecoratorFactory.BATCH_REQUEST_DECORATOR_PROVIDER,
							oFF.NestedBatchRequestDecoratorProvider.CLAZZ);
			oFF.DfModule.stop(timestamp);
			oFF.DsrConstants.staticSetup();
			oFF.DsrPassport.staticSetup();
		}
		return oFF.RuntimeModule.s_module;
	};
	oFF.RuntimeModule.getInstance();
})(sap.firefly);