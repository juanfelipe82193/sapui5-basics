(function(oFF, sap_zen) {
	sap.zen.DesignStudio = function() {
	};
	sap.zen.DesignStudio.prototype = new oFF.XObject();
	sap.zen.DesignStudio.prototype.oWindow = null;
	sap.zen.DesignStudio.prototype.language = null;
	sap.zen.DesignStudio.prototype.sdkLoaderPath = null;
	sap.zen.DesignStudio.prototype.applicationName = null;
	sap.zen.DesignStudio.prototype.biappPath = null;
	sap.zen.DesignStudio.prototype.repositoryUrl = null;
	sap.zen.DesignStudio.prototype.tUrlParameters = null;
	sap.zen.DesignStudio.prototype.designMode = false;
	sap.zen.DesignStudio.prototype.dshControlId = null;
	sap.zen.DesignStudio.prototype.pageId = null;
	sap.zen.DesignStudio.prototype.oLandscapeUtils = null;
	sap.zen.DesignStudio.prototype.host = null;
	sap.zen.DesignStudio.prototype.port = 0;
	sap.zen.DesignStudio.prototype.protocol = null;
	sap.zen.DesignStudio.prototype.hanaMode = false;
	sap.zen.DesignStudio.prototype.client = null;
	sap.zen.DesignStudio.prototype.oTemplateLoader = null;
	sap.zen.DesignStudio.prototype.localeString = null;
	sap.zen.DesignStudio.prototype.oSdkLoader = null;
	sap.zen.DesignStudio.prototype.oBookmarkService = null;
	sap.zen.DesignStudio.prototype.oBookmarkRequestHandler = null;
	sap.zen.DesignStudio.prototype.user = null;
	sap.zen.DesignStudio.prototype.password = null;
	sap.zen.DesignStudio.prototype.userAgent = null;
	sap.zen.DesignStudio.prototype.optimizeDSRequests = false;
	sap.zen.DesignStudio.prototype.staticMimesRootPath = null;
	sap.zen.DesignStudio.prototype.oLogging = null;
	sap.zen.DesignStudio.prototype.systemAlias = null;
	sap.zen.DesignStudio.prototype.oLocalization = null;
	sap.zen.DesignStudio.prototype.newBW = false;
	sap.zen.DesignStudio.prototype.rightToLeft = false;
	sap.zen.DesignStudio.prototype.setLogging = function(xLogging) {
		this.oLogging = xLogging;
	};
	sap.zen.DesignStudio.prototype.setLocalization = function(oLocalization) {
		this.oLocalization = oLocalization;
	};
	sap.zen.DesignStudio.prototype.setSdkLoader = function(oSdkLoader) {
		this.oSdkLoader = oSdkLoader;
	};
	sap.zen.DesignStudio.prototype.setXWindow = function(oWindow) {
		this.oWindow = oWindow;
	};
	sap.zen.DesignStudio.prototype.setLanguage = function(language) {
		this.language = language;
	};
	sap.zen.DesignStudio.prototype.setSdkLoaderPath = function(sdkLoaderPath) {
		this.sdkLoaderPath = sdkLoaderPath;
	};
	sap.zen.DesignStudio.prototype.setApplicationName = function(
			applicationName) {
		this.applicationName = applicationName;
	};
	sap.zen.DesignStudio.prototype.setApplicationPath = function(biappPath) {
		this.biappPath = biappPath;
	};
	sap.zen.DesignStudio.prototype.setRepositoryUrl = function(url) {
		this.repositoryUrl = url;
	};
	sap.zen.DesignStudio.prototype.setUrlParameter = function(tUrlParameters) {
		this.tUrlParameters = tUrlParameters;
	};
	sap.zen.DesignStudio.prototype.setDesignMode = function(designMode) {
		this.designMode = designMode;
	};
	sap.zen.DesignStudio.prototype.setDshControlId = function(dshControlId) {
		this.dshControlId = dshControlId;
	};
	sap.zen.DesignStudio.prototype.setPageId = function(pageId) {
		this.pageId = pageId;
	};
	sap.zen.DesignStudio.prototype.setLandscapeUtils = function(oLandscapeUtils) {
		this.oLandscapeUtils = oLandscapeUtils;
	};
	sap.zen.DesignStudio.prototype.setHost = function(host) {
		this.host = host;
	};
	sap.zen.DesignStudio.prototype.setPort = function(port) {
		this.port = port;
	};
	sap.zen.DesignStudio.prototype.setProtocol = function(protocol) {
		this.protocol = protocol;
	};
	sap.zen.DesignStudio.prototype.setHanaMode = function(hanaMode) {
		this.hanaMode = hanaMode;
	};
	sap.zen.DesignStudio.prototype.setClient = function(client) {
		this.client = client;
	};
	sap.zen.DesignStudio.prototype.setTemplateLoader = function(oTemplateLoader) {
		this.oTemplateLoader = oTemplateLoader;
	};
	sap.zen.DesignStudio.prototype.setBookmarkRequestHandler = function(
			oBookmarkRequestHandler) {
		this.oBookmarkRequestHandler = oBookmarkRequestHandler;
	};
	sap.zen.DesignStudio.prototype.setUser = function(name) {
		this.user = name;
	};
	sap.zen.DesignStudio.prototype.setPassword = function(password) {
		this.password = password;
	};
	sap.zen.DesignStudio.prototype.setUserAgent = function(userAgent) {
		this.userAgent = userAgent;
	};
	sap.zen.DesignStudio.prototype.setOptimizeDSRequests = function(
			optimizeDSRequests) {
		this.optimizeDSRequests = optimizeDSRequests;
	};
	sap.zen.DesignStudio.prototype.setStaticMimesRootPath = function(path) {
		this.staticMimesRootPath = path;
	};
	sap.zen.DesignStudio.prototype.setSystemAlias = function(alias) {
		this.systemAlias = alias;
	};
	sap.zen.DesignStudio.prototype.setNewBW = function(newBW) {
		this.newBW = newBW;
	};
	sap.zen.DesignStudio.prototype.setRightToLeft = function(rightToLeft) {
		this.rightToLeft = rightToLeft;
	};
	sap.zen.DesignStudio.prototype.createPage = function() {
		var loSelfSystem;
		var lSystemType;
		var s;
		var ix;
		var ix2;
		var loTemplateService;
		var loPage;
		if (oFF.isNull(this.oSdkLoader)) {
			this.oSdkLoader = new sap.zen.SDKLoader();
		}
		if (oFF.isNull(this.oLogging)) {
			this.oLogging = sap.buddha.XLogging.create();
		}
		if (oFF.isNull(this.oLocalization)) {
			this.oLocalization = sap.buddha.XLocalization.create();
		}
		this.oSdkLoader.setRelativePath(this.sdkLoaderPath);
		this.oSdkLoader.setRuntimePath(this.staticMimesRootPath);
		if (oFF.isNull(this.oLandscapeUtils)) {
			this.oLandscapeUtils = new sap.zen.LandscapeUtils();
		}
		if ((oFF.isNull(this.language))
				|| (oFF.XString.size(this.language) === 0)) {
			this.language = "EN";
		}
		this.oLandscapeUtils.doInit(this.language);
		if (oFF.isNull(this.oWindow)) {
			this.oWindow = sap.buddha.XWindow.create();
		}
		if ((oFF.isNull(this.host)) || (oFF.XString.size(this.host) === 0)) {
			this.host = "localhost";
		}
		if (!oFF.XString.endsWith(this.biappPath, "/")) {
			this.biappPath = oFF.XStringUtils.concatenate2(this.biappPath, "/");
		}
		this.oWindow.setLocale(this.localeString);
		loSelfSystem = this.oLandscapeUtils.getSelf();
		if (oFF.isNull(loSelfSystem)) {
			if (this.newBW
					|| oFF.XStringUtils.isNotNullAndNotEmpty(this.client)) {
				loSelfSystem = this.oLandscapeUtils.addSelfBW(this.host,
						this.port, this.protocol, this.client,
						this.systemAlias, this.newBW);
			} else {
				loSelfSystem = this.oLandscapeUtils.addSelf(this.host,
						this.port, this.protocol);
			}
			if ((oFF.notNull(this.user)) && (oFF.XString.size(this.user) > 0)) {
				loSelfSystem.setUser(this.user);
			}
			if ((oFF.notNull(this.password))
					&& (oFF.XString.size(this.password) > 0)) {
				loSelfSystem.setPassword(this.password);
			}
			if (oFF.isNull(this.oTemplateLoader)
					&& oFF.isNull(this.oBookmarkRequestHandler)) {
				this.oTemplateLoader = new sap.zen.TemplateLoader();
				this.oBookmarkRequestHandler = new sap.zen.BookmarkRequestHandler();
				lSystemType = loSelfSystem.getSystemType();
				if (lSystemType.isTypeOf(oFF.SystemType.ABAP)) {
					this.adaptFFForWebDispatcher(loSelfSystem);
					this.oTemplateLoader.initBaseBW(loSelfSystem,
							this.applicationName, this.repositoryUrl);
					this.oBookmarkRequestHandler.initBaseBW(loSelfSystem);
				} else {
					s = this.biappPath;
					if (oFF.XString.startsWith(s, "http://")) {
						s = oFF.XString.substring(s, 7, -1);
						ix = oFF.XString.indexOf(s, "/");
						s = oFF.XString.substring(s, ix, -1);
					} else {
						if (oFF.XString.startsWith(s, "https://")) {
							s = oFF.XString.substring(s, 8, -1);
							ix2 = oFF.XString.indexOf(s, "/");
							s = oFF.XString.substring(s, ix2, -1);
						}
					}
					s = oFF.XStringUtils.concatenate2(s, "content.biapp");
					this.oTemplateLoader.initBase(loSelfSystem, s);
					this.oBookmarkRequestHandler.initBase(loSelfSystem, s);
				}
			}
		}
		if (oFF.isNull(this.oBookmarkService)) {
			this.oBookmarkService = new sap.zen.BookmarkService();
			this.oBookmarkService.setup();
		}
		if (oFF.isNull(this.dshControlId)) {
			this.dshControlId = "";
		}
		loTemplateService = new sap.zen.ZenTemplateService();
		loPage = loTemplateService.createPage(this.oLandscapeUtils
				.getApplication(), this.oWindow, this.applicationName,
				this.biappPath, this.hanaMode, this.tUrlParameters,
				this.designMode, this.dshControlId, this.oSdkLoader,
				this.pageId, this.oTemplateLoader, this.userAgent,
				this.oBookmarkService, this.oBookmarkRequestHandler,
				this.optimizeDSRequests, this.oLogging, this.oLocalization,
				this.rightToLeft);
		loPage.setLocalPort(this.port);
		return loPage;
	};
	sap.zen.DesignStudio.prototype.setLocaleString = function(localeString) {
		this.localeString = localeString;
	};
	sap.zen.DesignStudio.prototype.setBookmarkService = function(
			oBookmarkService) {
		this.oBookmarkService = oBookmarkService;
	};
	sap.zen.DesignStudio.prototype.adaptFFForWebDispatcher = function(
			oLocalHost) {
		var lCapabilitiesPath = null;
		var loUri;
		var loHttpClient;
		var loRequest;
		var loResponse;
		var loJsonContent;
		var loRootStructure;
		var loJsonServerInfo;
		var lClient;
		if (oLocalHost.getSystemType().isTypeOf(oFF.SystemType.BW)) {
			lCapabilitiesPath = oFF.SystemType.BW.getServerInfoPath();
		} else {
			loUri = oFF.XUri.create();
			loUri.setProtocolType(oLocalHost.getProtocolType());
			loHttpClient = oFF.HttpClientFactory.newInstanceByConnection(
					oLocalHost.getApplication().getSession(), loUri);
			loRequest = loHttpClient.getRequest();
			loRequest.setFromConnectionInfo(oLocalHost);
			loRequest.setPath(oFF.SystemType.BW.getServerInfoPath());
			loRequest.setMethod(oFF.HttpRequestMethod.HTTP_GET);
			loRequest.setAcceptContentType(oFF.ContentType.APPLICATION_JSON);
			loResponse = loHttpClient.processHttpRequest(oFF.SyncType.BLOCKING,
					null, null);
			if (!loResponse.hasErrors() && loResponse.getData() !== null
					&& loResponse.getData().getStatusCode() < 400) {
				lCapabilitiesPath = oFF.SystemType.BW.getServerInfoPath();
				loJsonContent = loResponse.getData().getJsonContent();
				if (oFF.notNull(loJsonContent) && loJsonContent.isStructure()) {
					loRootStructure = loJsonContent.asStructure();
					loJsonServerInfo = loRootStructure
							.getStructureByKey("ServerInfo");
					if (oFF.notNull(loJsonServerInfo)) {
						lClient = loJsonServerInfo.getStringByKey("Client");
						if (oFF.notNull(lClient)) {
							this.client = lClient;
							oLocalHost.setClient(lClient);
						}
					}
				}
			} else {
				lCapabilitiesPath = oFF.SystemType.ABAP.getServerInfoPath();
			}
		}
	};
	sap.zen.LandscapeUtils = function() {
	};
	sap.zen.LandscapeUtils.prototype = new oFF.XObject();
	sap.zen.LandscapeUtils.BW_WD_INA_SERVICE_BASEPATH = "/sap/bw/ina/GetResponse";
	sap.zen.LandscapeUtils.registerComponentFactory = function(componentName,
			oPageFactory) {
		sap.zen.ZenTemplateService.factory.registerFactory(componentName,
				oPageFactory);
	};
	sap.zen.LandscapeUtils.prototype.initialized = false;
	sap.zen.LandscapeUtils.prototype.oApplication = null;
	sap.zen.LandscapeUtils.prototype.oLandscape = null;
	sap.zen.LandscapeUtils.prototype.hanaMode = false;
	sap.zen.LandscapeUtils.prototype.language = null;
	sap.zen.LandscapeUtils.prototype.doInit = function(language) {
		var oRegService;
		var oCoreModule;
		var oPlatformModule;
		var oRuntimeModule;
		var oOlapModule;
		var oOlapExtModule;
		var oOlapImplModule;
		var oProviderModule;
		var oBhuddaModule;
		if (this.initialized) {
			return;
		}
		this.initialized = true;
		oRegService = oFF.RegistrationService.getInstance();
		oCoreModule = oFF.CoreModule.getInstance();
		oPlatformModule = oFF.PlatformModule.getInstance();
		oRuntimeModule = oFF.RuntimeModule.getInstance();
		oOlapModule = oFF.OlapApiModule.getInstance();
		oOlapExtModule = oFF.OlapExtModule.getInstance();
		oOlapImplModule = oFF.OlapImplModule.getInstance();
		oProviderModule = oFF.ProviderModule.getInstance();
		oBhuddaModule = sap.zen.BuddhaModule.getInstance();
		this.oApplication = oFF.ApplicationFactory
				.createDefaultApplicationWithVersion(oFF.XVersion.V92_REPO_RS_EXPORT);
		this.oLandscape = oFF.StandaloneSystemLandscape.create(this
				.getApplication());
		this.language = language;
		this.getApplication().setSystemLandscape(this.oLandscape);
		this.hanaMode = false;
	};
	sap.zen.LandscapeUtils.prototype.addSelf = function(host, port, protocol) {
		var loSystem = this.oLandscape.createSystem();
		loSystem.setLanguage(this.language);
		loSystem.setSystemType(oFF.SystemType.HANA);
		loSystem.setName("self");
		loSystem.setText("self");
		loSystem.setHost(host);
		loSystem.setPort(port);
		loSystem.setAuthenticationType(oFF.AuthenticationType.BASIC);
		if (oFF.XString.isEqual("https", protocol)) {
			loSystem.setProtocolType(oFF.ProtocolType.HTTPS);
		} else {
			loSystem.setProtocolType(oFF.ProtocolType.HTTP);
		}
		this.oLandscape.setSystemByDescription(loSystem);
		return loSystem;
	};
	sap.zen.LandscapeUtils.prototype.addSelfBW = function(host, port, protocol,
			client, systemAlias, newBW) {
		var loSystem = this.oLandscape.createSystem();
		loSystem.setLanguage(this.language);
		if (newBW) {
			loSystem.setSystemType(oFF.SystemType.BW);
		} else {
			loSystem.setSystemType(oFF.SystemType.ABAP);
		}
		loSystem.setName("self");
		loSystem.setText("self");
		loSystem.setHost(host);
		loSystem.setPort(port);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(client)) {
			loSystem.setClient(client);
		}
		loSystem.setTimeout(60000);
		loSystem.setAuthenticationType(oFF.AuthenticationType.BASIC);
		if (oFF.XString.isEqual("https", protocol)) {
			loSystem.setProtocolType(oFF.ProtocolType.HTTPS);
		} else {
			loSystem.setProtocolType(oFF.ProtocolType.HTTP);
		}
		loSystem.setAlias(systemAlias);
		this.oLandscape.setSystemByDescription(loSystem);
		return loSystem;
	};
	sap.zen.LandscapeUtils.prototype.setHanaMode = function(hanaMode) {
		this.hanaMode = hanaMode;
	};
	sap.zen.LandscapeUtils.prototype.getApplication = function() {
		return this.oApplication;
	};
	sap.zen.LandscapeUtils.prototype.getSelf = function() {
		return this.oLandscape.getSystemDescription("self");
	};
	sap.zen.LandscapeUtils.prototype.getSystem = function(name) {
		return this.oLandscape.getSystemDescription(name);
	};
})(sap.firefly, sap.zen);