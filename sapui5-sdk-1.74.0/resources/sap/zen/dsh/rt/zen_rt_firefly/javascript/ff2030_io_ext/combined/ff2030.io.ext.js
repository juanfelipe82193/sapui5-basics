(function(oFF) {
	oFF.SigSelParser = function() {
	};
	oFF.SigSelParser.prototype = new oFF.XObject();
	oFF.SigSelParser.create = function() {
		var newObj = new oFF.SigSelParser();
		newObj.setup();
		return newObj;
	};
	oFF.SigSelParser.prototype.m_defaultComponentType = null;
	oFF.SigSelParser.prototype.setup = function() {
		this.m_defaultComponentType = null;
	};
	oFF.SigSelParser.prototype.setDefaultComponentType = function(type) {
		this.m_defaultComponentType = type;
	};
	oFF.SigSelParser.prototype.parse = function(sigSelExpression) {
		var segment;
		var splitString;
		var ops = oFF.XList.create();
		var messages = oFF.MessageManager.createMessageManager();
		var hasSchema;
		var k;
		var uri;
		var op2;
		var protocolType;
		var domain;
		var path;
		var type;
		var pos;
		var componentType;
		var fragment;
		var i;
		var folderString;
		var parent;
		var j;
		var op;
		var element;
		var typeSel;
		var end;
		var isId;
		var opType;
		var propIndex;
		var property;
		var arrayStart;
		var arrayEnd;
		var arrayContent;
		var firstChar;
		var number;
		if (oFF.notNull(sigSelExpression)) {
			hasSchema = false;
			if (oFF.XString.startsWith(sigSelExpression, "dp:")
					|| oFF.XString.startsWith(sigSelExpression, "ui:")) {
				hasSchema = true;
			}
			if (hasSchema || oFF.XString.containsString(sigSelExpression, "||")) {
				splitString = oFF.XStringTokenizer.splitString(
						sigSelExpression, "||");
				for (k = 0; k < splitString.size(); k++) {
					segment = splitString.get(k);
					uri = oFF.XUri.createFromUri(segment);
					op2 = oFF.SigSelOperation.create();
					ops.add(op2);
					protocolType = uri.getProtocolType();
					domain = oFF.SigSelDomain.CONTEXT;
					if (protocolType === oFF.ProtocolType.UI) {
						domain = oFF.SigSelDomain.UI;
					} else {
						if (protocolType === oFF.ProtocolType.DATAPROVIDER) {
							domain = oFF.SigSelDomain.DATA;
						}
					}
					op2.setDomain(domain);
					path = uri.getPath();
					if (oFF.notNull(path)) {
						type = null;
						pos = oFF.XString.indexOf(path, ".");
						if (pos !== -1) {
							type = oFF.XString.substring(path, pos + 1, -1);
							path = oFF.XString.substring(path, 0, pos);
						}
						if (oFF.XStringUtils.isNotNullAndNotEmpty(path)) {
							if (oFF.XString.isEqual(path, "*")) {
								op2.setOperationType(oFF.SigSelType.WILDCARD);
							} else {
								if (oFF.XString.startsWith(path, "!")) {
									op2
											.setOperationType(oFF.SigSelType.MATCH_ID);
									op2.setId(oFF.XString
											.substring(path, 1, -1));
								} else {
									op2
											.setOperationType(oFF.SigSelType.MATCH_NAME);
									op2.setName(path);
								}
							}
						} else {
							op2.setOperationType(oFF.SigSelType.MATCH);
						}
						if (oFF.notNull(type)) {
							componentType = oFF.XComponentType
									.lookupComponentType(type);
							op2.setSelectedComponentType(componentType);
						}
					}
					fragment = uri.getFragment();
					op2.setSelectedProperty(fragment);
				}
			} else {
				splitString = oFF.XStringTokenizer.splitString(
						sigSelExpression, ",");
				for (i = 0; i < splitString.size(); i++) {
					segment = splitString.get(i);
					folderString = oFF.XStringTokenizer.splitString(segment,
							"/");
					parent = null;
					for (j = 0; j < folderString.size(); j++) {
						op = oFF.SigSelOperation.create();
						if (j === 0) {
							ops.add(op);
						} else {
							if (oFF.notNull(parent)) {
								parent.setChild(op);
							}
						}
						element = folderString.get(j);
						if (oFF.XString.startsWith(element, "#")) {
							op.setDomain(oFF.SigSelDomain.UI);
							element = oFF.XString.substring(element, 1, -1);
						} else {
							if (oFF.XString.startsWith(element, "%")) {
								op.setDomain(oFF.SigSelDomain.DATA);
								element = oFF.XString.substring(element, 1, -1);
							}
						}
						if (oFF.XString.startsWith(element, "?")) {
							typeSel = null;
							end = oFF.XString.indexOf(element, ":");
							if (end !== -1) {
								typeSel = oFF.XString
										.substring(element, 1, end);
								element = oFF.XString.substring(element,
										end + 1, -1);
							} else {
								typeSel = oFF.XString.substring(element, 1, -1);
								element = null;
							}
							op.setSelectedComponentType(oFF.XComponentType
									.lookupComponentType(typeSel));
						} else {
							op
									.setSelectedComponentType(this.m_defaultComponentType);
						}
						isId = false;
						if (oFF.XStringUtils.isNotNullAndNotEmpty(element)) {
							if (oFF.XString.startsWith(element, "~")) {
								element = oFF.XString.substring(element, 1, -1);
								isId = true;
							}
						}
						opType = oFF.SigSelType.MATCH;
						if (oFF.notNull(element)) {
							propIndex = oFF.XString.indexOf(element, ".");
							if (propIndex !== -1) {
								property = oFF.XString.substring(element,
										propIndex + 1, -1);
								op.setSelectedProperty(property);
								element = oFF.XString.substring(element, 0,
										propIndex);
							}
							arrayStart = oFF.XString.indexOf(element, "[");
							if (arrayStart !== -1) {
								arrayEnd = oFF.XString.indexOfFrom(element,
										"]", arrayStart);
								if (arrayEnd === -1) {
									messages.addError(0, "Array end not found");
								} else {
									arrayContent = oFF.XString.substring(
											element, arrayStart + 1, arrayEnd);
									arrayContent = oFF.XString
											.trim(arrayContent);
									if (oFF.XString.size(arrayContent) > 0) {
										firstChar = oFF.XString.getCharAt(
												arrayContent, 0);
										if (firstChar >= 48 && firstChar <= 57) {
											number = oFF.XInteger
													.convertFromStringWithDefault(
															arrayContent, -1);
											if (number >= 0) {
												op
														.setIndexType(oFF.SigSelIndexType.POSITION);
												op.setIndexPosition(number);
											} else {
												messages.addError(0,
														"Not a valid index");
											}
										} else {
											op
													.setIndexType(oFF.SigSelIndexType.NAME);
											op.setIndexName(arrayContent);
										}
									}
								}
								element = oFF.XString.substring(element, 0,
										arrayStart);
							}
							if (oFF.XString.isEqual(element, "*")) {
								opType = oFF.SigSelType.WILDCARD;
							} else {
								if (isId) {
									op.setId(element);
									opType = oFF.SigSelType.MATCH_ID;
								} else {
									op.setName(element);
									opType = oFF.SigSelType.MATCH_NAME;
								}
							}
						}
						op.setOperationType(opType);
						parent = op;
					}
				}
			}
		}
		return oFF.ExtResult.create(ops, messages);
	};
	oFF.DataManifestConstants = {};
	oFF.DpBindingFactory = function() {
	};
	oFF.DpBindingFactory.prototype = new oFF.XObject();
	oFF.DpBindingFactory.s_factories = null;
	oFF.DpBindingFactory.staticSetup = function() {
		oFF.DpBindingFactory.s_factories = oFF.XHashMapByString.create();
	};
	oFF.DpBindingFactory.registerFactory = function(componentType, factory) {
		oFF.DpBindingFactory.s_factories.put(componentType.getName(), factory);
	};
	oFF.DpBindingFactory.createBindingProvider = function(component, path) {
		var factory = null;
		var componentType = component.getComponentType();
		var name;
		var bindingProvider;
		while (oFF.notNull(componentType)) {
			name = componentType.getName();
			factory = oFF.DpBindingFactory.s_factories.getByKey(name);
			if (oFF.notNull(factory)) {
				break;
			}
			componentType = componentType.getParent();
		}
		bindingProvider = null;
		if (oFF.notNull(factory)) {
			bindingProvider = factory.newBindingProvider(component, path);
		}
		return bindingProvider;
	};
	oFF.DpDataManifestFactory = {
		HAS_ERROR : "HasError",
		ERROR_TEXT : "ErrorText",
		create : function(errorText) {
			var dataManifest = oFF.PrFactory.createStructure();
			dataManifest.putBoolean(oFF.DpDataManifestFactory.HAS_ERROR, true);
			dataManifest.putString(oFF.DpDataManifestFactory.ERROR_TEXT,
					errorText);
			return dataManifest;
		},
		createByMessages : function(messages) {
			var dataManifest = oFF.PrFactory.createStructure();
			if (oFF.notNull(messages) && messages.hasErrors()) {
				dataManifest.putBoolean(oFF.DpDataManifestFactory.HAS_ERROR,
						true);
				dataManifest.putString(oFF.DpDataManifestFactory.ERROR_TEXT,
						messages.getSummary());
			}
			return dataManifest;
		}
	};
	oFF.UiManagerFactory = function() {
	};
	oFF.UiManagerFactory.prototype = new oFF.XObject();
	oFF.UiManagerFactory.s_uiManagerFactory = null;
	oFF.UiManagerFactory.newInstance = function(session) {
		if (oFF.isNull(oFF.UiManagerFactory.s_uiManagerFactory)) {
			return null;
		}
		return oFF.UiManagerFactory.s_uiManagerFactory
				.newUiManagerInstance(session);
	};
	oFF.UiManagerFactory.registerFactory = function(factory) {
		oFF.UiManagerFactory.s_uiManagerFactory = factory;
	};
	oFF.DefaultSession = function() {
	};
	oFF.DefaultSession.prototype = new oFF.XObjectExt();
	oFF.DefaultSession.create = function() {
		return oFF.DefaultSession.createWithVersion(oFF.XVersion.DEFAULT_VALUE);
	};
	oFF.DefaultSession.createWithVersion = function(version) {
		var session = new oFF.DefaultSession();
		session.setupExt(null, version);
		return session;
	};
	oFF.DefaultSession.prototype.m_parentSession = null;
	oFF.DefaultSession.prototype.m_singletons = null;
	oFF.DefaultSession.prototype.m_workingTaskManager = null;
	oFF.DefaultSession.prototype.m_defaultSyncType = null;
	oFF.DefaultSession.prototype.m_notificationProcessor = null;
	oFF.DefaultSession.prototype.m_version = 0;
	oFF.DefaultSession.prototype.m_currentSid = 0;
	oFF.DefaultSession.prototype.m_appSessionId = null;
	oFF.DefaultSession.prototype.m_processId = null;
	oFF.DefaultSession.prototype.m_logWriterMaster = null;
	oFF.DefaultSession.prototype.m_logWriter = null;
	oFF.DefaultSession.prototype.m_proxySettings = null;
	oFF.DefaultSession.prototype.m_fileSystemManager = null;
	oFF.DefaultSession.prototype.m_stdin = null;
	oFF.DefaultSession.prototype.m_stdout = null;
	oFF.DefaultSession.prototype.m_stdlog = null;
	oFF.DefaultSession.prototype.m_args = null;
	oFF.DefaultSession.prototype.m_programExecutor = null;
	oFF.DefaultSession.prototype.m_window = null;
	oFF.DefaultSession.prototype.m_networkLocation = null;
	oFF.DefaultSession.prototype.m_environment = null;
	oFF.DefaultSession.prototype.m_capabilities = null;
	oFF.DefaultSession.prototype.m_cache = null;
	oFF.DefaultSession.prototype.m_currentPath = null;
	oFF.DefaultSession.prototype.m_selector = null;
	oFF.DefaultSession.prototype.setupExt = function(parent, version) {
		var environment;
		var stdio;
		var parentSelector;
		var allDomains;
		var k;
		var currentDomain;
		var currentSelector;
		this.m_parentSession = parent;
		this.m_appSessionId = oFF.XGuid.getGuid();
		this.m_singletons = oFF.XHashMapByString.create();
		this.m_selector = oFF.SigSelManager.create(this);
		if (oFF.isNull(parent)) {
			this.m_proxySettings = oFF.ProxySettings.create(null);
			this.m_proxySettings.loadFromEnvironment();
			this.m_defaultSyncType = oFF.SyncType.BLOCKING;
			this.m_networkLocation = oFF.NetworkEnv.getLocation();
			stdio = oFF.XStdio.getInstance();
			if (oFF.notNull(stdio)) {
				this.m_stdin = stdio.getStdin();
				this.m_stdout = stdio.getStdout();
				this.m_stdlog = stdio.getStdlog();
			}
			environment = oFF.XEnvironment.createCopy(oFF.XEnvironment
					.getInstance());
			this.m_capabilities = oFF.XHashSetOfString.create();
		} else {
			this.m_defaultSyncType = parent.getDefaultSyncType();
			this.m_stdin = parent.getStdin();
			this.m_stdout = parent.getStdout();
			this.m_stdlog = parent.getStdlog();
			this.m_programExecutor = parent.getProgramExecutor();
			this.m_networkLocation = parent.getNetworkLocation();
			this.m_proxySettings = oFF.ProxySettings.create(parent
					.getProxySettings());
			environment = oFF.XEnvironment.createCopy(parent.getEnvironment());
			this.m_cache = parent.getCache();
			parentSelector = parent.getSelector();
			allDomains = parentSelector.getRegisteredDomain();
			for (k = 0; k < allDomains.size(); k++) {
				currentDomain = allDomains.get(k);
				currentSelector = parentSelector.getSelector(currentDomain);
				this.m_selector
						.registerSelector(currentDomain, currentSelector);
			}
		}
		this.m_logWriterMaster = oFF.XLogWriter.create(this.m_stdlog);
		this.m_logWriterMaster.setFilterSeverity(oFF.Severity.ERROR);
		this.m_logWriter = this.m_logWriterMaster;
		environment.setLogWriter(this.m_logWriterMaster);
		this.m_environment = environment;
		this.m_version = this.getValidVersion(version);
	};
	oFF.DefaultSession.prototype.newSubSession = function() {
		var subSession = new oFF.DefaultSession();
		subSession.setupExt(this, this.m_version);
		return subSession;
	};
	oFF.DefaultSession.prototype.releaseObject = function() {
		this.m_parentSession = null;
		this.m_defaultSyncType = null;
		this.m_appSessionId = null;
		this.m_fileSystemManager = null;
		this.m_programExecutor = null;
		this.m_notificationProcessor = null;
		this.m_logWriter = null;
		this.m_logWriterMaster = oFF.XObjectExt.release(this.m_logWriterMaster);
		this.m_singletons = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_singletons);
		this.m_workingTaskManager = oFF.XObjectExt
				.release(this.m_workingTaskManager);
		oFF.XObjectExt.prototype.releaseObject.call(this);
	};
	oFF.DefaultSession.prototype.getSession = function() {
		return this;
	};
	oFF.DefaultSession.prototype.getSessionSingletons = function() {
		return this.m_singletons;
	};
	oFF.DefaultSession.prototype.getWorkingTaskManager = function() {
		if (oFF.notNull(this.m_parentSession)) {
			return this.m_parentSession.getWorkingTaskManager();
		} else {
			this.checkWorkingTaskManager();
			return this.m_workingTaskManager;
		}
	};
	oFF.DefaultSession.prototype.checkWorkingTaskManager = function() {
		if (oFF.isNull(this.m_workingTaskManager)) {
			if (!this
					.newWorkingTaskManager(oFF.WorkingTaskManagerType.UI_DRIVER)) {
				if (!this
						.newWorkingTaskManager(oFF.WorkingTaskManagerType.MULTI_THREADED)) {
					this
							.newWorkingTaskManager(oFF.WorkingTaskManagerType.SINGLE_THREADED);
				}
			}
		}
	};
	oFF.DefaultSession.prototype.newWorkingTaskManager = function(type) {
		var newInstance = oFF.WorkingTaskManagerFactory.create(type, this);
		if (oFF.notNull(newInstance)) {
			newInstance.setupWorkingTaskManager(this);
			this.setWorkingTaskManager(newInstance);
			return true;
		}
		return false;
	};
	oFF.DefaultSession.prototype.setWorkingTaskManager = function(
			workingTaskManager) {
		this.m_workingTaskManager = workingTaskManager;
	};
	oFF.DefaultSession.prototype.getDefaultSyncType = function() {
		return this.m_defaultSyncType;
	};
	oFF.DefaultSession.prototype.setDefaultSyncType = function(syncType) {
		this.m_defaultSyncType = syncType;
	};
	oFF.DefaultSession.prototype.getListenerProcessor = function() {
		return this.m_notificationProcessor;
	};
	oFF.DefaultSession.prototype.setListenerProcessor = function(processor) {
		this.m_notificationProcessor = processor;
	};
	oFF.DefaultSession.prototype.getVersion = function() {
		return this.m_version;
	};
	oFF.DefaultSession.prototype.setVersion = function(version) {
		this.m_version = version;
	};
	oFF.DefaultSession.prototype.getNextSid = function() {
		this.m_currentSid = this.m_currentSid + 1;
		return this.m_currentSid;
	};
	oFF.DefaultSession.prototype.getAppSessionId = function() {
		return this.m_appSessionId;
	};
	oFF.DefaultSession.prototype.setAppSessionId = function(appSessionId) {
		if (oFF.XStringUtils.isNotNullAndNotEmpty(appSessionId)) {
			this.m_appSessionId = appSessionId;
		}
	};
	oFF.DefaultSession.prototype.setLogWriter = function(logWriter) {
		this.m_logWriter = logWriter;
	};
	oFF.DefaultSession.prototype.getLogWriter = function() {
		return this.m_logWriter;
	};
	oFF.DefaultSession.prototype.getLogWriterBase = function() {
		return this.m_logWriter;
	};
	oFF.DefaultSession.prototype.getLogger = function() {
		return this;
	};
	oFF.DefaultSession.prototype.getFileSystemManager = function() {
		if (oFF.notNull(this.m_parentSession)) {
			return this.m_parentSession.getFileSystemManager();
		} else {
			return this.m_fileSystemManager;
		}
	};
	oFF.DefaultSession.prototype.setFileSystemManager = function(
			fileSystemManager) {
		this.m_fileSystemManager = fileSystemManager;
	};
	oFF.DefaultSession.prototype.getStdin = function() {
		return this.m_stdin;
	};
	oFF.DefaultSession.prototype.setStdin = function(stdin) {
		this.m_stdin = stdin;
	};
	oFF.DefaultSession.prototype.getStdout = function() {
		return this.m_stdout;
	};
	oFF.DefaultSession.prototype.setStdout = function(stdout) {
		this.m_stdout = stdout;
	};
	oFF.DefaultSession.prototype.getStdlog = function() {
		return this.m_stdlog;
	};
	oFF.DefaultSession.prototype.setStdlog = function(stdlog) {
		this.m_stdlog = stdlog;
		this.m_logWriterMaster.setLogStream(stdlog);
	};
	oFF.DefaultSession.prototype.getProgramExecutor = function() {
		return this.m_programExecutor;
	};
	oFF.DefaultSession.prototype.setProgramExecutor = function(executor) {
		this.m_programExecutor = executor;
	};
	oFF.DefaultSession.prototype.getWindow = function() {
		return this.m_window;
	};
	oFF.DefaultSession.prototype.setWindow = function(window) {
		this.m_window = window;
	};
	oFF.DefaultSession.prototype.getArguments = function() {
		if (oFF.isNull(this.m_args)) {
			this.m_args = oFF.ProgramArgs.create();
		}
		return this.m_args;
	};
	oFF.DefaultSession.prototype.setArguments = function(args) {
		this.m_args = args;
	};
	oFF.DefaultSession.prototype.getProxySettings = function() {
		return this.m_proxySettings;
	};
	oFF.DefaultSession.prototype.getNetworkLocation = function() {
		return this.m_networkLocation;
	};
	oFF.DefaultSession.prototype.setNetworkLocation = function(networkLocation) {
		this.m_networkLocation = networkLocation;
	};
	oFF.DefaultSession.prototype.getEnvironment = function() {
		return this.m_environment;
	};
	oFF.DefaultSession.prototype.setEnvironment = function(environment) {
		this.m_environment = environment;
	};
	oFF.DefaultSession.prototype.getProcessId = function() {
		return this.m_processId;
	};
	oFF.DefaultSession.prototype.setProcessId = function(processId) {
		this.m_processId = processId;
	};
	oFF.DefaultSession.prototype.openSubSystem = function(type) {
		return null;
	};
	oFF.DefaultSession.prototype.getValidVersion = function(version) {
		var xversionValue;
		if (version <= 0) {
			xversionValue = this.m_environment
					.getVariable(oFF.XEnvironmentConstants.XVERSION);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(xversionValue)) {
				return oFF.XInteger.convertFromStringWithDefault(xversionValue,
						oFF.XVersion.DEFAULT_VALUE);
			}
			return oFF.XVersion.DEFAULT_VALUE;
		}
		return version;
	};
	oFF.DefaultSession.prototype.hasCapability = function(name) {
		return this.m_capabilities.contains(name);
	};
	oFF.DefaultSession.prototype.getCapabilities = function() {
		return this.m_capabilities;
	};
	oFF.DefaultSession.prototype.setCapabilities = function(capabilities) {
		this.m_capabilities = capabilities;
	};
	oFF.DefaultSession.prototype.getCache = function() {
		return this.m_cache;
	};
	oFF.DefaultSession.prototype.setCache = function(cache) {
		this.m_cache = cache;
	};
	oFF.DefaultSession.prototype.getCurrentPath = function() {
		return this.m_currentPath;
	};
	oFF.DefaultSession.prototype.setCurrentPath = function(currentPath) {
		this.m_currentPath = currentPath;
	};
	oFF.DefaultSession.prototype.getSelector = function() {
		return this.m_selector;
	};
	oFF.DefaultSession.prototype.getSelectorBase = function() {
		return this.m_selector;
	};
	oFF.DefaultSession.prototype.toString = function() {
		var buffer = oFF.XStringBuffer.create();
		buffer.append("Session Version: ");
		buffer.appendInt(this.m_version);
		buffer.append(", Application Session Id: ");
		buffer.append(this.m_appSessionId);
		return buffer.toString();
	};
	oFF.SigSelManager = function() {
	};
	oFF.SigSelManager.prototype = new oFF.DfSessionContext();
	oFF.SigSelManager.s_spaceFactories = null;
	oFF.SigSelManager.staticSetup = function() {
		oFF.SigSelManager.s_spaceFactories = oFF.XHashMapByString.create();
	};
	oFF.SigSelManager.registerFactory = function(componentType, factory) {
		oFF.SigSelManager.s_spaceFactories
				.put(componentType.getName(), factory);
	};
	oFF.SigSelManager.create = function(session) {
		var newObj = new oFF.SigSelManager();
		newObj.setupSessionContext(session);
		return newObj;
	};
	oFF.SigSelManager.prototype.m_selectProviders = null;
	oFF.SigSelManager.prototype.setupSessionContext = function(session) {
		oFF.DfSessionContext.prototype.setupSessionContext.call(this, session);
		this.m_selectProviders = oFF.XHashMapByString.create();
	};
	oFF.SigSelManager.prototype.selectMultiByExpression = function(
			sigSelExpression, defaultDomain, contextObject) {
		var resultList = oFF.XList.create();
		var parser;
		var result;
		var ops;
		var i;
		var operation;
		var component;
		if (oFF.notNull(sigSelExpression)) {
			parser = oFF.SigSelParser.create();
			result = parser.parse(sigSelExpression);
			if (result.isValid()) {
				ops = result.getData();
				for (i = 0; i < ops.size(); i++) {
					operation = ops.get(i);
					component = this.selectComponent(operation, defaultDomain,
							contextObject, true);
					if (oFF.notNull(component)) {
						resultList.add(component);
					}
				}
			}
		}
		return resultList;
	};
	oFF.SigSelManager.prototype.selectSpecificComponents = function(operation,
			defaultDomain, contextObject, maximumCount) {
		return null;
	};
	oFF.SigSelManager.prototype.selectComponent = function(operation,
			defaultDomain, contextObject, createSpace) {
		var domain = operation.getDomain();
		var selectProvider;
		var list;
		var component;
		var theFactory;
		var spacer;
		var i;
		if (domain === oFF.SigSelDomain.CONTEXT) {
			domain = defaultDomain;
		}
		selectProvider = this.m_selectProviders.getByKey(domain.getName());
		list = selectProvider.selectProviderComponents(operation, domain,
				contextObject, -1);
		component = null;
		if (oFF.notNull(list) && list.size() > 0) {
			component = list.get(0);
			if (createSpace === true) {
				theFactory = this.getFactory(component);
				if (oFF.notNull(theFactory)) {
					spacer = theFactory.newSpacer(this.getSession());
					for (i = 0; i < list.size(); i++) {
						spacer.addComponent(list.get(i));
					}
					component = spacer;
				}
			}
		}
		return component;
	};
	oFF.SigSelManager.prototype.getFactory = function(component) {
		var theFactory = null;
		var componentType = component.getComponentType();
		var name;
		while (oFF.notNull(componentType) && oFF.isNull(theFactory)) {
			name = componentType.getName();
			theFactory = oFF.SigSelManager.s_spaceFactories.getByKey(name);
			componentType = componentType.getParent();
		}
		return theFactory;
	};
	oFF.SigSelManager.prototype.registerSelector = function(domain, selector) {
		this.m_selectProviders.put(domain.getName(), selector);
	};
	oFF.SigSelManager.prototype.getRegisteredDomain = function() {
		var domains = oFF.XList.create();
		var iterator = this.m_selectProviders.getKeysAsIteratorOfString();
		var domain;
		while (iterator.hasNext()) {
			domain = oFF.SigSelDomain.lookup(iterator.next());
			domains.add(domain);
		}
		return domains;
	};
	oFF.SigSelManager.prototype.getSelector = function(domain) {
		return this.m_selectProviders.getByKey(domain.getName());
	};
	oFF.SigSelOperation = function() {
	};
	oFF.SigSelOperation.prototype = new oFF.DfNameObject();
	oFF.SigSelOperation.create = function() {
		var newObj = new oFF.SigSelOperation();
		newObj.m_arrayAccess = oFF.SigSelIndexType.NONE;
		newObj.m_domain = oFF.SigSelDomain.CONTEXT;
		return newObj;
	};
	oFF.SigSelOperation.prototype.m_domain = null;
	oFF.SigSelOperation.prototype.m_identifier = null;
	oFF.SigSelOperation.prototype.m_selectedComponentType = null;
	oFF.SigSelOperation.prototype.m_property = null;
	oFF.SigSelOperation.prototype.m_operationType = null;
	oFF.SigSelOperation.prototype.m_child = null;
	oFF.SigSelOperation.prototype.m_arrayAccess = null;
	oFF.SigSelOperation.prototype.m_indexName = null;
	oFF.SigSelOperation.prototype.m_indexNumber = 0;
	oFF.SigSelOperation.prototype.setId = function(identifier) {
		this.m_identifier = identifier;
	};
	oFF.SigSelOperation.prototype.getId = function() {
		return this.m_identifier;
	};
	oFF.SigSelOperation.prototype.getDomain = function() {
		return this.m_domain;
	};
	oFF.SigSelOperation.prototype.setDomain = function(domain) {
		this.m_domain = domain;
	};
	oFF.SigSelOperation.prototype.setSelectedComponentType = function(type) {
		this.m_selectedComponentType = type;
	};
	oFF.SigSelOperation.prototype.getSelectedComponentType = function() {
		return this.m_selectedComponentType;
	};
	oFF.SigSelOperation.prototype.getSelectedProperty = function() {
		return this.m_property;
	};
	oFF.SigSelOperation.prototype.setSelectedProperty = function(property) {
		this.m_property = property;
	};
	oFF.SigSelOperation.prototype.getOperationType = function() {
		return this.m_operationType;
	};
	oFF.SigSelOperation.prototype.setOperationType = function(type) {
		this.m_operationType = type;
	};
	oFF.SigSelOperation.prototype.getChild = function() {
		return this.m_child;
	};
	oFF.SigSelOperation.prototype.setChild = function(op) {
		this.m_child = op;
	};
	oFF.SigSelOperation.prototype.getIndexType = function() {
		return this.m_arrayAccess;
	};
	oFF.SigSelOperation.prototype.setIndexType = function(type) {
		this.m_arrayAccess = type;
	};
	oFF.SigSelOperation.prototype.getIndexName = function() {
		return this.m_indexName;
	};
	oFF.SigSelOperation.prototype.setIndexName = function(name) {
		this.m_indexName = name;
	};
	oFF.SigSelOperation.prototype.getIndexPosition = function() {
		return this.m_indexNumber;
	};
	oFF.SigSelOperation.prototype.setIndexPosition = function(position) {
		this.m_indexNumber = position;
	};
	oFF.SigSelOperation.prototype.getUri = function() {
		var uri = oFF.XUri.create();
		var buffer;
		var name;
		var theId;
		var path;
		uri.setSupportsAuthority(false);
		if (this.m_domain === oFF.SigSelDomain.UI) {
			uri.setProtocolType(oFF.ProtocolType.UI);
		} else {
			if (this.m_domain === oFF.SigSelDomain.DATA) {
				uri.setProtocolType(oFF.ProtocolType.DATAPROVIDER);
			}
		}
		buffer = oFF.XStringBuffer.create();
		if (this.m_operationType === oFF.SigSelType.MATCH_NAME) {
			name = this.getName();
			if (oFF.notNull(name)) {
				buffer.append(name);
			}
		} else {
			if (this.m_operationType === oFF.SigSelType.MATCH_ID) {
				theId = this.getId();
				if (oFF.notNull(theId)) {
					buffer.append("!").append(theId);
				}
			} else {
				if (this.m_operationType === oFF.SigSelType.WILDCARD) {
					buffer.append("*");
				}
			}
		}
		if (oFF.notNull(this.m_selectedComponentType)) {
			buffer.append(".").append(this.m_selectedComponentType.getName());
		}
		path = buffer.toString();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(path)) {
			uri.setPath(path);
		}
		if (oFF.notNull(this.m_property)) {
			uri.setFragment(this.m_property);
		}
		return uri;
	};
	oFF.SigSelOperation.prototype.toString = function() {
		var buffer = oFF.XStringBuffer.create();
		if (oFF.notNull(this.m_operationType)) {
			buffer.append("Domain: ").appendLine(this.m_domain.getName());
		}
		if (oFF.notNull(this.m_operationType)) {
			buffer.append("OpType: ")
					.appendLine(this.m_operationType.getName());
		}
		if (this.getName() !== null) {
			buffer.append("Name: ").appendLine(this.getName());
		}
		if (oFF.notNull(this.m_identifier)) {
			buffer.append("Id: ").appendLine(this.m_identifier);
		}
		if (oFF.notNull(this.m_selectedComponentType)) {
			buffer.append("ComponentType: ").appendLine(
					this.m_selectedComponentType.getName());
		}
		if (oFF.notNull(this.m_property)) {
			buffer.append("Property: ").appendLine(this.m_property);
		}
		return buffer.toString();
	};
	oFF.DpBinding = function() {
	};
	oFF.DpBinding.prototype = new oFF.DfSessionContext();
	oFF.DpBinding.prototype.m_sender = null;
	oFF.DpBinding.prototype.m_receiver = null;
	oFF.DpBinding.prototype.m_pullOnReceiverReady = false;
	oFF.DpBinding.prototype.m_cacheId = null;
	oFF.DpBinding.prototype.m_dataError = null;
	oFF.DpBinding.prototype.m_cacheDataManifest = null;
	oFF.DpBinding.prototype.m_dataBinding = null;
	oFF.DpBinding.prototype.m_protocolBinding = null;
	oFF.DpBinding.prototype.setupExt = function(session, dataBinding,
			protocolBinding) {
		this.setupSessionContext(session);
		this.m_dataBinding = dataBinding;
		this.m_protocolBinding = protocolBinding;
	};
	oFF.DpBinding.prototype.releaseObject = function() {
		if (oFF.notNull(this.m_sender)) {
			this.m_sender.unregisterValueChangedListener(this);
		}
		if (oFF.notNull(this.m_receiver)) {
			this.m_receiver.unregisterReceiverReadyListener(this);
		}
		this.m_sender = oFF.XObjectExt.release(this.m_sender);
		this.m_receiver = oFF.XObjectExt.release(this.m_receiver);
		oFF.DfSessionContext.prototype.releaseObject.call(this);
	};
	oFF.DpBinding.prototype.bind = function(sender, receiver,
			pullOnReceiverReady) {
		this.m_sender = sender;
		this.m_receiver = receiver;
		this.m_pullOnReceiverReady = pullOnReceiverReady;
		if (oFF.notNull(this.m_sender)) {
			this.m_sender.registerValueChangedListener(this, null);
		}
		if (oFF.notNull(this.m_receiver) && pullOnReceiverReady) {
			this.m_receiver.registerReceiverReadyListener(this, null);
		}
		this.transport();
	};
	oFF.DpBinding.prototype.onSenderValueChanged = function(sender,
			customIdentifier) {
		this.transport();
	};
	oFF.DpBinding.prototype.onReceiverReadyChanged = function(receiver,
			customIdentifier) {
		this.transport();
	};
	oFF.DpBinding.prototype.transport = function() {
		var isReady;
		if (oFF.notNull(this.m_sender) && oFF.notNull(this.m_receiver)) {
			if (this.m_pullOnReceiverReady === false
					|| this.m_receiver.isReceiverReady()) {
				if (this.m_sender.isSenderValueReady() === false) {
					this.m_sender.processSenderUpdate();
					isReady = this.m_sender.isSenderValueReady();
					if (isReady === false) {
						this.transportDataFromCache();
						this.transferDataManifestFromCache();
					}
				} else {
					this.transportData();
					this.transferDataManifest();
				}
			}
		}
	};
	oFF.DpBinding.prototype.transportDataFromCache = function() {
	};
	oFF.DpBinding.prototype.getSender = function() {
		return this.m_sender;
	};
	oFF.DpBinding.prototype.getReceiver = function() {
		return this.m_receiver;
	};
	oFF.DpBinding.prototype.getCacheId = function() {
		return this.m_cacheId;
	};
	oFF.DpBinding.prototype.setCacheId = function(cacheId) {
		this.m_cacheId = cacheId;
	};
	oFF.DpBinding.prototype.transferDataManifest = function() {
		var dataManifest;
		if (oFF.notNull(this.m_sender)) {
			dataManifest = null;
			if (oFF.notNull(this.m_dataError)) {
				dataManifest = oFF.DpDataManifestFactory
						.create(this.m_dataError);
			} else {
				try {
					dataManifest = this.m_sender.getDataManifest();
				} catch (e) {
					this.m_dataError = oFF.XException.getStackTrace(e, 0);
					this.log(this.m_dataError);
				}
			}
			if (oFF.notNull(this.m_receiver)) {
				if (oFF.notNull(dataManifest)) {
					try {
						this.m_receiver.setDataManifest(dataManifest);
					} catch (f) {
						this.log(oFF.XException.getStackTrace(f, 0));
					}
				}
			}
			this.m_dataError = null;
		}
	};
	oFF.DpBinding.prototype.transferDataManifestFromCache = function() {
		if (oFF.notNull(this.m_sender)) {
			if (oFF.notNull(this.m_receiver)) {
				if (oFF.notNull(this.m_cacheDataManifest)) {
					try {
						this.m_receiver
								.setDataManifest(this.m_cacheDataManifest);
					} catch (f) {
						this.log(oFF.XException.getStackTrace(f, 0));
					}
				}
			}
			this.m_dataError = null;
			this.m_cacheDataManifest = null;
		}
	};
	oFF.DpBindingManager = function() {
	};
	oFF.DpBindingManager.prototype = new oFF.DfSessionContext();
	oFF.DpBindingManager.create = function(session) {
		var newObj = new oFF.DpBindingManager();
		newObj.setupSessionContext(session);
		return newObj;
	};
	oFF.DpBindingManager.doBinding = function(session, senderType,
			receiverType, protocolBinding, senderProvider, receiverProvider,
			cacheIdentifier, pullOnReceiverReady) {
		var binding = null;
		var theProtocolBinding = protocolBinding;
		var sender;
		var receiver;
		if (oFF.isNull(theProtocolBinding)) {
			theProtocolBinding = receiverType.getDefaultProtocol();
		}
		sender = senderProvider
				.newSenderBinding(senderType, theProtocolBinding);
		receiver = receiverProvider.newReceiverBinding(receiverType,
				theProtocolBinding);
		if (oFF.notNull(sender) && oFF.notNull(receiver)) {
			if (theProtocolBinding.isTypeOf(oFF.ProtocolBindingType.JSON)) {
				binding = oFF.DpBindingJson.create(session, receiverType,
						theProtocolBinding, true);
			} else {
				if (theProtocolBinding.isTypeOf(oFF.ProtocolBindingType.STRING)) {
					binding = oFF.DpBindingString.create(session, receiverType,
							theProtocolBinding);
				} else {
					if (theProtocolBinding
							.isTypeOf(oFF.ProtocolBindingType.INTEGER)) {
						binding = oFF.DpBindingInteger.create(session,
								receiverType, theProtocolBinding);
					}
				}
			}
			if (oFF.notNull(binding)) {
				binding.setCacheId(cacheIdentifier);
				binding.bind(sender, receiver, pullOnReceiverReady);
			}
		}
		return binding;
	};
	oFF.DpBindingManager.prototype.selectSpecificBindingProvider = oFF.noSupport;
	oFF.DpBindingManager.prototype.bindTogether = function(senderExpression,
			senderDefaultDomain, senderContextObject, receiverExpression,
			receiverDefaultDomain, receiverContextObject, type,
			cacheIdentifier, pullOnReceiverReady, isNeo) {
		var senderProvider = null;
		var receiverProvider = null;
		if (isNeo === true) {
			senderProvider = this.getBindingProvider2(senderExpression,
					senderDefaultDomain, senderContextObject);
			receiverProvider = this.getBindingProvider2(receiverExpression,
					receiverDefaultDomain, receiverContextObject);
		} else {
			senderProvider = this.getBindingProvider(senderExpression,
					senderDefaultDomain, senderContextObject, true);
			receiverProvider = this.getBindingProvider(receiverExpression,
					receiverDefaultDomain, receiverContextObject, true);
		}
		if (oFF.notNull(senderProvider) && oFF.notNull(receiverProvider)) {
			return this.doBindingWithProviders(senderProvider,
					receiverProvider, type, cacheIdentifier,
					pullOnReceiverReady);
		} else {
			return null;
		}
	};
	oFF.DpBindingManager.prototype.getBindingProvider = function(expression,
			defaultDomain, contextObject, createSpace) {
		var theExpression = expression;
		var parser;
		var result;
		var ops;
		var session;
		var selector;
		var operation;
		var object1;
		if (oFF.isNull(theExpression) && oFF.notNull(defaultDomain)) {
			theExpression = oFF.XStringUtils.concatenate2(defaultDomain
					.getName(), ":");
		}
		if (oFF.notNull(theExpression)) {
			parser = oFF.SigSelParser.create();
			result = parser.parse(theExpression);
			if (result.isValid()) {
				ops = result.getData();
				session = this.getSession();
				selector = session.getSelector();
				if (ops.size() >= 1) {
					operation = ops.get(0);
					object1 = selector.selectComponent(operation,
							defaultDomain, contextObject, createSpace);
					return object1;
				}
			}
		}
		return null;
	};
	oFF.DpBindingManager.prototype.getBindingProvider2 = function(expression,
			defaultDomain, contextObject) {
		var component = null;
		var operation = null;
		var theExpression = expression;
		var parser;
		var result;
		var ops;
		var session;
		var selector;
		var provider;
		if (oFF.isNull(theExpression) && oFF.notNull(defaultDomain)) {
			theExpression = oFF.XStringUtils.concatenate2(defaultDomain
					.getName(), ":");
		}
		if (oFF.notNull(theExpression)) {
			parser = oFF.SigSelParser.create();
			result = parser.parse(theExpression);
			if (result.isValid()) {
				ops = result.getData();
				session = this.getSession();
				selector = session.getSelector();
				if (ops.size() >= 1) {
					operation = ops.get(0);
					component = selector.selectComponent(operation,
							defaultDomain, contextObject, false);
				}
			}
		}
		provider = null;
		if (oFF.notNull(operation) && oFF.notNull(component)) {
			provider = oFF.DpBindingFactory.createBindingProvider(component,
					operation.getSelectedProperty());
		}
		return provider;
	};
	oFF.DpBindingManager.prototype.doBindingWithProviders = function(
			senderProvider, receiverProvider, type, cacheIdentifier,
			pullOnReceiverReady) {
		var session = this.getSession();
		var senderType = null;
		var receiverType = null;
		var senderBindings;
		var receiverBindings;
		var s;
		var r;
		var i;
		var senderProtocols;
		var receiverProtocols;
		var protocol;
		var k;
		var currentProtocol;
		if (oFF.notNull(senderProvider) && oFF.notNull(receiverProvider)) {
			senderBindings = senderProvider.getSenderBindings();
			receiverBindings = receiverProvider.getReceiverBindings();
			if (oFF.notNull(type)) {
				for (s = 0; s < senderBindings.size(); s++) {
					senderType = senderBindings.get(s);
					if (senderType.isTypeOf(type)) {
						break;
					}
					senderType = null;
				}
				for (r = 0; r < receiverBindings.size(); r++) {
					receiverType = receiverBindings.get(r);
					if (type.isTypeOf(receiverType)) {
						break;
					}
					receiverType = null;
				}
			}
			if (oFF.isNull(senderType) || oFF.isNull(receiverType)) {
				for (i = 0; i < receiverBindings.size(); i++) {
					receiverType = receiverBindings.get(i);
					if (senderBindings.contains(receiverType)) {
						senderType = receiverType;
						break;
					}
				}
			}
			if (oFF.notNull(senderType) && oFF.notNull(receiverType)) {
				senderProtocols = senderProvider
						.getSenderProtocolBindings(senderType);
				receiverProtocols = receiverProvider
						.getReceiverProtocolBindings(receiverType);
				protocol = null;
				if (oFF.notNull(receiverProtocols)
						&& oFF.notNull(senderProtocols)) {
					for (k = 0; k < receiverProtocols.size(); k++) {
						currentProtocol = receiverProtocols.get(k);
						if (senderProtocols.contains(currentProtocol)) {
							protocol = currentProtocol;
							break;
						}
					}
				}
				return oFF.DpBindingManager.doBinding(session, senderType,
						receiverType, protocol, senderProvider,
						receiverProvider, cacheIdentifier, pullOnReceiverReady);
			}
		}
		return null;
	};
	oFF.DpBindingManager.prototype.selectMultiByExpression = function(
			sigSelExpression, defaultDomain, contextObject) {
		var selector = this.getSession().getSelector();
		return selector.selectMultiByExpression(sigSelExpression,
				defaultDomain, contextObject);
	};
	oFF.DpBindingManager.prototype.selectSpecificComponents = function(
			operation, defaultDomain, contextObject, maximumCount) {
		var selector = this.getSession().getSelector();
		return selector.selectSpecificComponents(operation, defaultDomain,
				contextObject, maximumCount);
	};
	oFF.DpBindingManager.prototype.selectComponent = function(operation,
			defaultDomain, contextObject, createSpace) {
		var selector = this.getSession().getSelector();
		return selector.selectComponent(operation, defaultDomain,
				contextObject, createSpace);
	};
	oFF.DpSelection = function() {
	};
	oFF.DpSelection.prototype = new oFF.XObjectExt();
	oFF.DpSelection.create = function(list) {
		var newObj = new oFF.DpSelection();
		newObj.m_list = list;
		return newObj;
	};
	oFF.DpSelection.prototype.m_list = null;
	oFF.DpSelection.prototype.getComponentType = function() {
		return oFF.ProcessComponentType.SIGSEL_RESULT_LIST;
	};
	oFF.DpSelection.prototype.getValuesAsReadOnlyList = function() {
		return this.m_list;
	};
	oFF.DpSelection.prototype.getIterator = function() {
		return this.m_list.getIterator();
	};
	oFF.DpSelection.prototype.contains = function(element) {
		return this.m_list.contains(element);
	};
	oFF.DpSelection.prototype.isEmpty = function() {
		return this.m_list.isEmpty();
	};
	oFF.DpSelection.prototype.hasElements = function() {
		return this.m_list.hasElements();
	};
	oFF.DpSelection.prototype.size = function() {
		return this.m_list.size();
	};
	oFF.DpSelection.prototype.get = function(index) {
		return this.m_list.get(index);
	};
	oFF.DpSelection.prototype.getIndex = function(element) {
		return this.m_list.getIndex(element);
	};
	oFF.DpBindingInteger = function() {
	};
	oFF.DpBindingInteger.prototype = new oFF.DpBinding();
	oFF.DpBindingInteger.create = function(session, dataBinding,
			protocolBinding) {
		var newObj = new oFF.DpBindingInteger();
		newObj.setupExt(session, dataBinding, protocolBinding);
		return newObj;
	};
	oFF.DpBindingInteger.prototype.getComponentType = function() {
		return oFF.IoComponentType.BINDING_ADAPTER_INT;
	};
	oFF.DpBindingInteger.prototype.transportData = function() {
		var intValue = this.m_sender.getInteger();
		this.m_receiver.setInteger(intValue);
	};
	oFF.DpBindingJson = function() {
	};
	oFF.DpBindingJson.prototype = new oFF.DpBinding();
	oFF.DpBindingJson.create = function(session, dataBinding, protocolBinding,
			checkForChanges) {
		var newObj = new oFF.DpBindingJson();
		newObj.setupExt(session, dataBinding, protocolBinding);
		newObj.m_checkForChanges = checkForChanges;
		return newObj;
	};
	oFF.DpBindingJson.prototype.m_checkForChanges = false;
	oFF.DpBindingJson.prototype.m_lastChecksum = null;
	oFF.DpBindingJson.prototype.getComponentType = function() {
		return oFF.IoComponentType.BINDING_ADAPTER_JSON;
	};
	oFF.DpBindingJson.prototype.transportData = function() {
		var element;
		if (oFF.notNull(this.m_sender)) {
			try {
				element = this.m_sender.getElement();
				this.putInCache(element);
				this.setAtReceiver(element);
			} catch (e) {
				this.m_dataError = oFF.XException.getStackTrace(e, 0);
				this.log(this.m_dataError);
			}
		}
	};
	oFF.DpBindingJson.prototype.transportDataFromCache = function() {
		try {
			var element = this.pullFromCache();
			this.setAtReceiver(element);
		} catch (e) {
			this.log(oFF.XException.getStackTrace(e, 0));
		}
	};
	oFF.DpBindingJson.prototype.putInCache = function(element) {
		var cacheId = this.getCacheId();
		var cache;
		if (oFF.notNull(cacheId) && oFF.notNull(element)) {
			cache = this.getSession().getCache();
			if (oFF.notNull(cache)) {
				cache.writeElementToCache("dpbinding", cacheId, element);
			}
		}
	};
	oFF.DpBindingJson.prototype.pullFromCache = function() {
		var element = null;
		var cacheId = this.getCacheId();
		var cache;
		if (oFF.notNull(cacheId)) {
			cache = this.getSession().getCache();
			if (oFF.notNull(cache)) {
				element = cache.readElementFromCache("dpbinding", cacheId);
			}
		}
		return element;
	};
	oFF.DpBindingJson.prototype.setAtReceiver = function(element) {
		var performApply;
		var normalized;
		var newChecksum;
		if (oFF.notNull(this.m_receiver) && oFF.notNull(element)) {
			performApply = true;
			if (this.m_checkForChanges) {
				normalized = oFF.PrUtils.serialize(element, true, false, 0);
				newChecksum = oFF.XSha1.createSHA1(normalized);
				if (oFF.notNull(newChecksum)
						&& oFF.notNull(this.m_lastChecksum)) {
					if (oFF.XString.isEqual(newChecksum, this.m_lastChecksum)) {
						performApply = false;
					}
				}
				this.m_lastChecksum = newChecksum;
			}
			if (performApply) {
				this.m_receiver.setElement(element);
			}
		}
	};
	oFF.DpBindingString = function() {
	};
	oFF.DpBindingString.prototype = new oFF.DpBinding();
	oFF.DpBindingString.create = function(session, dataBinding, protocolBinding) {
		var newObj = new oFF.DpBindingString();
		newObj.setupExt(session, dataBinding, protocolBinding);
		return newObj;
	};
	oFF.DpBindingString.prototype.getComponentType = function() {
		return oFF.IoComponentType.BINDING_ADAPTER_STRING;
	};
	oFF.DpBindingString.prototype.transportData = function() {
		var stringValue = this.m_sender.getString();
		this.m_receiver.setString(stringValue);
	};
	oFF.ProtocolBindingType = function() {
	};
	oFF.ProtocolBindingType.prototype = new oFF.XConstantWithParent();
	oFF.ProtocolBindingType.STRING = null;
	oFF.ProtocolBindingType.INTEGER = null;
	oFF.ProtocolBindingType.JSON = null;
	oFF.ProtocolBindingType.ABSTRACT_CHART_PROTOCOL = null;
	oFF.ProtocolBindingType.HIGH_CHART_PROTOCOL = null;
	oFF.ProtocolBindingType.GOOGLE_CHART_PROTOCOL = null;
	oFF.ProtocolBindingType.PLAIN_GRID = null;
	oFF.ProtocolBindingType.s_instances = null;
	oFF.ProtocolBindingType.create = function(name, parent) {
		var newConstant = new oFF.ProtocolBindingType();
		newConstant.setupExt(name, parent);
		oFF.ProtocolBindingType.s_instances.put(name, newConstant);
		return newConstant;
	};
	oFF.ProtocolBindingType.lookup = function(name) {
		return oFF.ProtocolBindingType.s_instances.getByKey(name);
	};
	oFF.ProtocolBindingType.staticSetup = function() {
		oFF.ProtocolBindingType.s_instances = oFF.XHashMapByString.create();
		oFF.ProtocolBindingType.STRING = oFF.ProtocolBindingType.create(
				"String", null);
		oFF.ProtocolBindingType.INTEGER = oFF.ProtocolBindingType.create(
				"Integer", null);
		oFF.ProtocolBindingType.JSON = oFF.ProtocolBindingType.create("Json",
				null);
		oFF.ProtocolBindingType.ABSTRACT_CHART_PROTOCOL = oFF.ProtocolBindingType
				.create("Chart", oFF.ProtocolBindingType.JSON);
		oFF.ProtocolBindingType.HIGH_CHART_PROTOCOL = oFF.ProtocolBindingType
				.create("HighChart",
						oFF.ProtocolBindingType.ABSTRACT_CHART_PROTOCOL);
		oFF.ProtocolBindingType.GOOGLE_CHART_PROTOCOL = oFF.ProtocolBindingType
				.create("GoogleChart",
						oFF.ProtocolBindingType.ABSTRACT_CHART_PROTOCOL);
		oFF.ProtocolBindingType.PLAIN_GRID = oFF.ProtocolBindingType.create(
				"PlainGrid", oFF.ProtocolBindingType.PLAIN_GRID);
	};
	oFF.SemanticBindingType = function() {
	};
	oFF.SemanticBindingType.prototype = new oFF.XConstantWithParent();
	oFF.SemanticBindingType.STRING = null;
	oFF.SemanticBindingType.INTEGER = null;
	oFF.SemanticBindingType.JSON = null;
	oFF.SemanticBindingType.SINGLE = null;
	oFF.SemanticBindingType.MULTI = null;
	oFF.SemanticBindingType.GRID = null;
	oFF.SemanticBindingType.TABLE = null;
	oFF.SemanticBindingType.CHART = null;
	oFF.SemanticBindingType.COLUMN = null;
	oFF.SemanticBindingType.BAR = null;
	oFF.SemanticBindingType.LINE = null;
	oFF.SemanticBindingType.BOXPLOT = null;
	oFF.SemanticBindingType.PIE = null;
	oFF.SemanticBindingType.VARIABLEPIE = null;
	oFF.SemanticBindingType.BELLCURVE = null;
	oFF.SemanticBindingType.AREA = null;
	oFF.SemanticBindingType.SPLINE = null;
	oFF.SemanticBindingType.WORDCLOUD = null;
	oFF.SemanticBindingType.SCATTER = null;
	oFF.SemanticBindingType.VARIWIDE = null;
	oFF.SemanticBindingType.BUBBLE = null;
	oFF.SemanticBindingType.COMBBCL = null;
	oFF.SemanticBindingType.HEATMAP = null;
	oFF.SemanticBindingType.TREEMAP = null;
	oFF.SemanticBindingType.TIMESERIES = null;
	oFF.SemanticBindingType.s_instances = null;
	oFF.SemanticBindingType.create = function(name, parent, protocol) {
		var newConstant = new oFF.SemanticBindingType();
		newConstant.setupExt(name, parent);
		newConstant.m_defaultProtocol = protocol;
		oFF.SemanticBindingType.s_instances.put(name, newConstant);
		return newConstant;
	};
	oFF.SemanticBindingType.lookup = function(name) {
		return oFF.SemanticBindingType.s_instances.getByKey(name);
	};
	oFF.SemanticBindingType.staticSetup = function() {
		oFF.SemanticBindingType.s_instances = oFF.XHashMapByString.create();
		oFF.SemanticBindingType.STRING = oFF.SemanticBindingType.create(
				"String", null, oFF.ProtocolBindingType.STRING);
		oFF.SemanticBindingType.INTEGER = oFF.SemanticBindingType.create(
				"Integer", null, oFF.ProtocolBindingType.INTEGER);
		oFF.SemanticBindingType.JSON = oFF.SemanticBindingType.create("Json",
				null, oFF.ProtocolBindingType.JSON);
		oFF.SemanticBindingType.SINGLE = oFF.SemanticBindingType.create(
				"Single", oFF.SemanticBindingType.JSON, null);
		oFF.SemanticBindingType.MULTI = oFF.SemanticBindingType.create("Multi",
				oFF.SemanticBindingType.JSON, null);
		oFF.SemanticBindingType.TABLE = oFF.SemanticBindingType.create("Table",
				oFF.SemanticBindingType.SINGLE, null);
		oFF.SemanticBindingType.GRID = oFF.SemanticBindingType.create("Grid",
				oFF.SemanticBindingType.SINGLE, null);
		oFF.SemanticBindingType.CHART = oFF.SemanticBindingType.create("Chart",
				oFF.SemanticBindingType.SINGLE,
				oFF.ProtocolBindingType.HIGH_CHART_PROTOCOL);
		oFF.SemanticBindingType.COMBBCL = oFF.SemanticBindingType.create(
				"Combbcl", oFF.SemanticBindingType.CHART, null);
		oFF.SemanticBindingType.TIMESERIES = oFF.SemanticBindingType.create(
				"Timeseries", oFF.SemanticBindingType.CHART, null);
		oFF.SemanticBindingType.COLUMN = oFF.SemanticBindingType.create(
				"Column", oFF.SemanticBindingType.CHART, null);
		oFF.SemanticBindingType.BAR = oFF.SemanticBindingType.create("Bar",
				oFF.SemanticBindingType.CHART, null);
		oFF.SemanticBindingType.LINE = oFF.SemanticBindingType.create("Line",
				oFF.SemanticBindingType.CHART, null);
		oFF.SemanticBindingType.PIE = oFF.SemanticBindingType.create("Pie",
				oFF.SemanticBindingType.CHART, null);
		oFF.SemanticBindingType.WORDCLOUD = oFF.SemanticBindingType.create(
				"WordCloud", oFF.SemanticBindingType.CHART, null);
		oFF.SemanticBindingType.BELLCURVE = oFF.SemanticBindingType.create(
				"BellCurve", oFF.SemanticBindingType.CHART, null);
		oFF.SemanticBindingType.AREA = oFF.SemanticBindingType.create("Area",
				oFF.SemanticBindingType.CHART, null);
		oFF.SemanticBindingType.SCATTER = oFF.SemanticBindingType.create(
				"Scatter", oFF.SemanticBindingType.CHART, null);
		oFF.SemanticBindingType.SPLINE = oFF.SemanticBindingType.create(
				"Spline", oFF.SemanticBindingType.CHART, null);
		oFF.SemanticBindingType.VARIABLEPIE = oFF.SemanticBindingType.create(
				"VariablePie", oFF.SemanticBindingType.CHART, null);
		oFF.SemanticBindingType.VARIWIDE = oFF.SemanticBindingType.create(
				"Variwide", oFF.SemanticBindingType.CHART, null);
		oFF.SemanticBindingType.BOXPLOT = oFF.SemanticBindingType.create(
				"BoxPlot", oFF.SemanticBindingType.CHART, null);
		oFF.SemanticBindingType.BUBBLE = oFF.SemanticBindingType.create(
				"Bubble", oFF.SemanticBindingType.CHART, null);
		oFF.SemanticBindingType.HEATMAP = oFF.SemanticBindingType.create(
				"Heatmap", oFF.SemanticBindingType.CHART, null);
		oFF.SemanticBindingType.TREEMAP = oFF.SemanticBindingType.create(
				"Treemap", oFF.SemanticBindingType.CHART, null);
	};
	oFF.SemanticBindingType.prototype.m_defaultProtocol = null;
	oFF.SemanticBindingType.prototype.getDefaultProtocol = function() {
		var theParent;
		if (oFF.notNull(this.m_defaultProtocol)) {
			return this.m_defaultProtocol;
		}
		theParent = this.getParent();
		if (oFF.isNull(theParent)) {
			return null;
		}
		return theParent.getDefaultProtocol();
	};
	oFF.DjPropertyType = function() {
	};
	oFF.DjPropertyType.prototype = new oFF.XConstantWithParent();
	oFF.DjPropertyType.ROOT = null;
	oFF.DjPropertyType.COMPLEX = null;
	oFF.DjPropertyType.PRIMITIVE = null;
	oFF.DjPropertyType.BOOLEAN = null;
	oFF.DjPropertyType.INTEGER = null;
	oFF.DjPropertyType.DOUBLE = null;
	oFF.DjPropertyType.STRING = null;
	oFF.DjPropertyType.XOBJECT = null;
	oFF.DjPropertyType.CONSTANT = null;
	oFF.DjPropertyType.COMPONENT = null;
	oFF.DjPropertyType.COMPONENT_LIST = null;
	oFF.DjPropertyType.NAMED_COMPONENT_LIST = null;
	oFF.DjPropertyType.NAME = null;
	oFF.DjPropertyType.MAX_LENGTH = null;
	oFF.DjPropertyType.ID = null;
	oFF.DjPropertyType.IS_ENABLED = null;
	oFF.DjPropertyType.ENABLE_LIST_SUGGEST = null;
	oFF.DjPropertyType.IS_OPEN = null;
	oFF.DjPropertyType.IS_FOLDER = null;
	oFF.DjPropertyType.TEXT = null;
	oFF.DjPropertyType.INDEX = null;
	oFF.DjPropertyType.DESCRIPTION = null;
	oFF.DjPropertyType.CUSTOM_OBJECT = null;
	oFF.DjPropertyType.ROW = null;
	oFF.DjPropertyType.COLUMN = null;
	oFF.DjPropertyType.ROW_SPAN = null;
	oFF.DjPropertyType.COLUMN_SPAN = null;
	oFF.DjPropertyType.COLUMN_COUNT = null;
	oFF.DjPropertyType.LENGTH = null;
	oFF.DjPropertyType.SELECT = null;
	oFF.DjPropertyType.CTYPE_TARGET = null;
	oFF.DjPropertyType.SYS_TYPE = null;
	oFF.DjPropertyType.DATAPROVIDERS = null;
	oFF.DjPropertyType.SYNC_STATE = null;
	oFF.DjPropertyType.REGISTER_ACTION = null;
	oFF.DjPropertyType.ON_ATTRIBUTE_CHANGE = null;
	oFF.DjPropertyType.TRIGGER = null;
	oFF.DjPropertyType.SYSTEM_NAME = null;
	oFF.DjPropertyType.DATA_SOURCE_ID = null;
	oFF.DjPropertyType.TOSTRING = null;
	oFF.DjPropertyType.CLIPBOARD_CONTENT = null;
	oFF.DjPropertyType.s_lookup = null;
	oFF.DjPropertyType.create = function(name, parent) {
		var newConstant = new oFF.DjPropertyType();
		newConstant.setupExt(name, parent);
		oFF.DjPropertyType.s_lookup.put(name, newConstant);
		return newConstant;
	};
	oFF.DjPropertyType.staticSetup = function() {
		oFF.DjPropertyType.s_lookup = oFF.XHashMapByString.create();
		oFF.DjPropertyType.ROOT = oFF.DjPropertyType.create("root", null);
		oFF.DjPropertyType.COMPLEX = oFF.DjPropertyType.create("primitive",
				oFF.DjPropertyType.ROOT);
		oFF.DjPropertyType.PRIMITIVE = oFF.DjPropertyType.create("complex",
				null);
		oFF.DjPropertyType.BOOLEAN = oFF.DjPropertyType.create("bool",
				oFF.DjPropertyType.PRIMITIVE);
		oFF.DjPropertyType.INTEGER = oFF.DjPropertyType.create("integer",
				oFF.DjPropertyType.PRIMITIVE);
		oFF.DjPropertyType.DOUBLE = oFF.DjPropertyType.create("double",
				oFF.DjPropertyType.PRIMITIVE);
		oFF.DjPropertyType.STRING = oFF.DjPropertyType.create("string",
				oFF.DjPropertyType.PRIMITIVE);
		oFF.DjPropertyType.XOBJECT = oFF.DjPropertyType.create("xobject",
				oFF.DjPropertyType.PRIMITIVE);
		oFF.DjPropertyType.CONSTANT = oFF.DjPropertyType.create("constant",
				oFF.DjPropertyType.PRIMITIVE);
		oFF.DjPropertyType.COMPONENT = oFF.DjPropertyType.create("component",
				oFF.DjPropertyType.COMPLEX);
		oFF.DjPropertyType.COMPONENT_LIST = oFF.DjPropertyType.create(
				"componentList", oFF.DjPropertyType.COMPLEX);
		oFF.DjPropertyType.NAMED_COMPONENT_LIST = oFF.DjPropertyType.create(
				"namedComponentList", oFF.DjPropertyType.COMPONENT_LIST);
		oFF.DjPropertyType.ID = oFF.DjPropertyType.create("id",
				oFF.DjPropertyType.STRING);
		oFF.DjPropertyType.IS_ENABLED = oFF.DjPropertyType.create("isEnabled",
				oFF.DjPropertyType.BOOLEAN);
		oFF.DjPropertyType.IS_OPEN = oFF.DjPropertyType.create("isOpen",
				oFF.DjPropertyType.BOOLEAN);
		oFF.DjPropertyType.IS_FOLDER = oFF.DjPropertyType.create("isFolder",
				oFF.DjPropertyType.BOOLEAN);
		oFF.DjPropertyType.INDEX = oFF.DjPropertyType.create("index",
				oFF.DjPropertyType.INTEGER);
		oFF.DjPropertyType.NAME = oFF.DjPropertyType.create("name",
				oFF.DjPropertyType.STRING);
		oFF.DjPropertyType.MAX_LENGTH = oFF.DjPropertyType.create("maxLength",
				oFF.DjPropertyType.INTEGER);
		oFF.DjPropertyType.CUSTOM_OBJECT = oFF.DjPropertyType.create(
				"customObject", oFF.DjPropertyType.PRIMITIVE);
		oFF.DjPropertyType.DESCRIPTION = oFF.DjPropertyType.create(
				"description", oFF.DjPropertyType.STRING);
		oFF.DjPropertyType.TEXT = oFF.DjPropertyType.create("text",
				oFF.DjPropertyType.STRING);
		oFF.DjPropertyType.COLUMN = oFF.DjPropertyType.create("column",
				oFF.DjPropertyType.INTEGER);
		oFF.DjPropertyType.COLUMN_SPAN = oFF.DjPropertyType.create(
				"columnSpan", oFF.DjPropertyType.INTEGER);
		oFF.DjPropertyType.COLUMN_COUNT = oFF.DjPropertyType.create(
				"columnCount", oFF.DjPropertyType.INTEGER);
		oFF.DjPropertyType.ROW = oFF.DjPropertyType.create("row",
				oFF.DjPropertyType.INTEGER);
		oFF.DjPropertyType.ROW_SPAN = oFF.DjPropertyType.create("rowSpan",
				oFF.DjPropertyType.INTEGER);
		oFF.DjPropertyType.LENGTH = oFF.DjPropertyType.create("length",
				oFF.DjPropertyType.INTEGER);
		oFF.DjPropertyType.SELECT = oFF.DjPropertyType.create("select",
				oFF.DjPropertyType.STRING);
		oFF.DjPropertyType.CTYPE_TARGET = oFF.DjPropertyType.create(
				"ctypeTarget", oFF.DjPropertyType.STRING);
		oFF.DjPropertyType.SYS_TYPE = oFF.DjPropertyType.create("sysType",
				oFF.DjPropertyType.CONSTANT);
		oFF.DjPropertyType.DATAPROVIDERS = oFF.DjPropertyType.create(
				"dataproviders", oFF.DjPropertyType.NAMED_COMPONENT_LIST);
		oFF.DjPropertyType.SYNC_STATE = oFF.DjPropertyType.create("syncState",
				oFF.DjPropertyType.CONSTANT);
		oFF.DjPropertyType.REGISTER_ACTION = oFF.DjPropertyType.create(
				"registerAction", oFF.DjPropertyType.COMPONENT);
		oFF.DjPropertyType.ON_ATTRIBUTE_CHANGE = oFF.DjPropertyType.create(
				"onAttributeChange", oFF.DjPropertyType.REGISTER_ACTION);
		oFF.DjPropertyType.TRIGGER = oFF.DjPropertyType.create("trigger",
				oFF.DjPropertyType.STRING);
		oFF.DjPropertyType.SYSTEM_NAME = oFF.DjPropertyType.create(
				"systemName", oFF.DjPropertyType.STRING);
		oFF.DjPropertyType.DATA_SOURCE_ID = oFF.DjPropertyType.create(
				"dataSourceId", oFF.DjPropertyType.STRING);
		oFF.DjPropertyType.TOSTRING = oFF.DjPropertyType.create("toString",
				oFF.DjPropertyType.STRING);
		oFF.DjPropertyType.CLIPBOARD_CONTENT = oFF.DjPropertyType.create(
				"clipboardContent", oFF.DjPropertyType.XOBJECT);
	};
	oFF.DjPropertyType.lookup = function(name) {
		return oFF.DjPropertyType.s_lookup.getByKey(name);
	};
	oFF.IoExtModule = function() {
	};
	oFF.IoExtModule.prototype = new oFF.DfModule();
	oFF.IoExtModule.s_module = null;
	oFF.IoExtModule.getInstance = function() {
		return oFF.IoExtModule.initVersion(oFF.XVersion.API_DEFAULT);
	};
	oFF.IoExtModule.initVersion = function(version) {
		var timestamp;
		if (oFF.isNull(oFF.IoExtModule.s_module)) {
			oFF.DfModule.checkInitialized(oFF.IoNativeModule
					.initVersion(version));
			timestamp = oFF.DfModule.start("IoExtModule...");
			oFF.IoExtModule.s_module = new oFF.IoExtModule();
			oFF.DpBindingFactory.staticSetup();
			oFF.ProtocolBindingType.staticSetup();
			oFF.SemanticBindingType.staticSetup();
			oFF.DjPropertyType.staticSetup();
			oFF.SigSelManager.staticSetup();
			oFF.DfModule.stop(timestamp);
		}
		return oFF.IoExtModule.s_module;
	};
	oFF.IoExtModule.getInstance();
})(sap.firefly);