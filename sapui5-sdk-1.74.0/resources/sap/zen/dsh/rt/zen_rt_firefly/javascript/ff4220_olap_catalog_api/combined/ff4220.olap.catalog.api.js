(function(oFF) {
	oFF.OlapCatalogServiceConfig = function() {
	};
	oFF.OlapCatalogServiceConfig.prototype = new oFF.DfServiceConfig();
	oFF.OlapCatalogServiceConfig.CLAZZ = null;
	oFF.OlapCatalogServiceConfig.staticSetup = function() {
		oFF.OlapCatalogServiceConfig.CLAZZ = oFF.XClass
				.create(oFF.OlapCatalogServiceConfig);
	};
	oFF.OlapCatalogServiceConfig.prototype.m_experimentalFeatues = null;
	oFF.OlapCatalogServiceConfig.prototype.metaObjectType = null;
	oFF.OlapCatalogServiceConfig.prototype.releaseObject = function() {
		this.m_experimentalFeatues = oFF.XObjectExt
				.release(this.m_experimentalFeatues);
		this.metaObjectType = null;
		oFF.DfServiceConfig.prototype.releaseObject.call(this);
	};
	oFF.OlapCatalogServiceConfig.prototype.activateExperimentalFeature = function(
			experimentalFeature) {
		oFF.InactiveCapabilityUtil.assertVersionValid(experimentalFeature, this
				.getApplication().getVersion());
		if (oFF.isNull(this.m_experimentalFeatues)) {
			this.m_experimentalFeatues = oFF.XSetOfNameObject.create();
		}
		this.m_experimentalFeatues.add(experimentalFeature);
	};
	oFF.OlapCatalogServiceConfig.prototype.activateExperimentalFeatureSet = function(
			experimentalFeatures) {
		var iterator;
		if (oFF.notNull(experimentalFeatures)) {
			iterator = experimentalFeatures.getIterator();
			while (iterator.hasNext()) {
				this.activateExperimentalFeature(iterator.next());
			}
		}
	};
	oFF.OlapCatalogServiceConfig.prototype.getExperimentalFeatureSet = function() {
		return this.m_experimentalFeatues;
	};
	oFF.OlapCatalogServiceConfig.prototype.getExperimentalFeatures = function() {
		return oFF.InactiveCapabilityUtil
				.exportInactiveCapabilities(this.m_experimentalFeatues);
	};
	oFF.OlapCatalogServiceConfig.prototype.processOlapCatalogManagerCreation = function(
			syncType, listener, customIdentifier) {
		this.metaObjectType = oFF.MetaObjectType.CATALOG_VIEW;
		return this.processSyncAction(syncType, listener, customIdentifier);
	};
	oFF.OlapCatalogServiceConfig.prototype.processLightweightOlapCatalogManagerCreation = function(
			syncType, listener, customIdentifier) {
		this.metaObjectType = oFF.MetaObjectType.CATALOG_VIEW_2;
		return this.processSyncAction(syncType, listener, customIdentifier);
	};
	oFF.OlapCatalogServiceConfig.prototype.processCurrencyTranslationCatalogManagerCreation = function(
			syncType, listener, customIdentifier) {
		this.metaObjectType = oFF.MetaObjectType.CURRENCY_TRANSLATION;
		return this.processSyncAction(syncType, listener, customIdentifier);
	};
	oFF.OlapCatalogServiceConfig.prototype.processCurrencyCatalogManagerCreation = function(
			syncType, listener, customIdentifier) {
		this.metaObjectType = oFF.MetaObjectType.CURRENCY;
		return this.processSyncAction(syncType, listener, customIdentifier);
	};
	oFF.OlapCatalogServiceConfig.prototype.processFormulaOperatorsCatalogManagerCreation = function(
			syncType, listener, customIdentifier) {
		this.metaObjectType = oFF.MetaObjectType.FORMULA_OPERATORS;
		return this.processSyncAction(syncType, listener, customIdentifier);
	};
	oFF.OlapCatalogServiceConfig.prototype.getMetaObjectType = function() {
		return this.metaObjectType;
	};
	oFF.OlapCatalogServiceConfig.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		listener.onOlapCatalogManagerCreated(extResult, data, customIdentifier);
	};
	oFF.OlapCatalogServiceConfig.prototype.setDataFromService = function(
			service) {
		this.setData(service.getCatalogManager());
	};
	oFF.OlapCatalogApiModule = function() {
	};
	oFF.OlapCatalogApiModule.prototype = new oFF.DfModule();
	oFF.OlapCatalogApiModule.XS_OLAP_CATALOG = "OLAP_CATALOG";
	oFF.OlapCatalogApiModule.SERVICE_TYPE_OLAP_CATALOG = null;
	oFF.OlapCatalogApiModule.XS_PLANNING_MODEL_CATALOG = "PLANNING_MODEL_CATALOG";
	oFF.OlapCatalogApiModule.SERVICE_TYPE_PLANNING_MODEL_CATALOG = null;
	oFF.OlapCatalogApiModule.XS_PLANNING_CATALOG = "PLANNING_CATALOG";
	oFF.OlapCatalogApiModule.SERVICE_TYPE_PLANNING_CATALOG = null;
	oFF.OlapCatalogApiModule.s_module = null;
	oFF.OlapCatalogApiModule.getInstance = function() {
		return oFF.OlapCatalogApiModule.initVersion(oFF.XVersion.API_DEFAULT);
	};
	oFF.OlapCatalogApiModule.initVersion = function(version) {
		var timestamp;
		var registrationService;
		if (oFF.isNull(oFF.OlapCatalogApiModule.s_module)) {
			oFF.DfModule.checkInitialized(oFF.RuntimeModule
					.initVersion(version));
			timestamp = oFF.DfModule.start("OlapCatalogApiModule...");
			oFF.OlapCatalogApiModule.s_module = new oFF.OlapCatalogApiModule();
			oFF.OlapCatalogApiModule.SERVICE_TYPE_PLANNING_CATALOG = oFF.ServiceType
					.createType(oFF.OlapCatalogApiModule.XS_PLANNING_CATALOG);
			oFF.OlapCatalogApiModule.SERVICE_TYPE_PLANNING_MODEL_CATALOG = oFF.ServiceType
					.createType(oFF.OlapCatalogApiModule.XS_PLANNING_MODEL_CATALOG);
			oFF.OlapCatalogApiModule.SERVICE_TYPE_OLAP_CATALOG = oFF.ServiceType
					.createType(oFF.OlapCatalogApiModule.XS_OLAP_CATALOG);
			oFF.OlapCatalogServiceConfig.staticSetup();
			registrationService = oFF.RegistrationService.getInstance();
			registrationService.addServiceConfig(
					oFF.OlapCatalogApiModule.XS_OLAP_CATALOG,
					oFF.OlapCatalogServiceConfig.CLAZZ);
			oFF.DfModule.stop(timestamp);
		}
		return oFF.OlapCatalogApiModule.s_module;
	};
	oFF.OlapCatalogApiModule.getInstance();
})(sap.firefly);