/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */

// Provides control sap.zen.dsh.Dsh.
jQuery.sap.declare("sap.zen.dsh.Dsh");
jQuery.sap.require("sap.zen.dsh.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new Dsh.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Control for embedding a Design Studio application full-screen in an S/4 HANA Fiori application
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @since 1.44
 * @name sap.zen.dsh.Dsh
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.zen.dsh.Dsh", /** @lends sap.zen.dsh.Dsh.prototype */ { metadata : {

	library : "sap.zen.dsh",
	properties : {

		/**
		 * Name of the Design Studio application to be opened.
		 */
		dshAppName : {type : "string", group : "Misc", defaultValue : '0ANALYSIS'},

		/**
		 * Path to application specified by dshAppName
		 */
		repoPath : {type : "string", group : "Misc", defaultValue : null},

		/**
		 * Desired width of the Design Studio Control
		 */
		width : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},

		/**
		 * Desired height of the Design Studio Control
		 */
		height : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},

		/**
		 */
		deployment : {type : "string", group : "Misc", defaultValue : 'bw'},

		/**
		 */
		protocol : {type : "string", group : "Misc", defaultValue : null},

		/**
		 */
		client : {type : "string", group : "Misc", defaultValue : null},

		/**
		 */
		language : {type : "string", group : "Misc", defaultValue : null},

		/**
		 */
		semanticMappings : {type : "object", group : "Misc", defaultValue : null},

		/**
		 */
		appComponent : {type : "object", group : "Misc", defaultValue : null},

		/**
		 */
		deferCreation : {type : "boolean", group : "Misc", defaultValue : false},

		/**
		 */
		systemAlias : {type : "string", group : "Misc", defaultValue : null}
	}
}});


/**
 *
 * @name sap.zen.dsh.Dsh#addParameter
 * @function
 * @param {string} sName
 * @param {string} sValue
 * @type string
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 *
 * @name sap.zen.dsh.Dsh#executeScript
 * @function
 * @param {string} sScript
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 *
 * @name sap.zen.dsh.Dsh#getDataSource
 * @function
 * @param {string} sName
 * @type object
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 *
 * @name sap.zen.dsh.Dsh#getComponent
 * @function
 * @param {string} sName
 * @type object
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 *
 * @name sap.zen.dsh.Dsh#getPage
 * @function
 * @type object
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 *
 * @name sap.zen.dsh.Dsh#createPage
 * @function
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Initialize cross-application navigation state directly with AppStateData. e.g., when calculated by sap.ui.generic.app.navigation.service.NavigationHandler
 *
 * @name sap.zen.dsh.Dsh#initializeAppStateData
 * @function
 * @param {object} oOStateData
 *         The AppStateData to apply
 * @param {object} oONavParams
 *         Simple Javascript object containing name-value pairs of additional navigation state to be mixed in
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */


/**
 * Initialize cross-application navigation state with an AppState object
 *
 * @name sap.zen.dsh.Dsh#initializeAppState
 * @function
 * @param {object} oOStartupAppState
 *         The AppState object from which to retrieve and apply Application State.
 * @param {object} oONavParams
 *         Simple Javascript object containing name-value pairs of additional navigation state to be mixed in
 * @type void
 * @public
 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
 */

sap.ui.getCore().loadLibrary("sap.viz");

//if the global require variable already assigned to the UI5 require, then set back to original
if (require && !require.config) {
	sap.ui.loader.config({noConflict: true});
}

sap.ui.define("sap/zen/dsh/Dsh", [
	"sap/ui/thirdparty/URI", "sap/zen/dsh/rt/all"
	], function(URI) {

	/**
	 * This file defines behavior for the control,
	 */
	window.DSH_deployment = true; 
	var sapbi_ajaxHandler = sapbi_ajaxHandler || {};
	window.sapbi_page = window.sapbi_page || {};
	sapbi_page.getParameter = sapbi_page.getParameter || function(){return "";};
	var sapbi_MIMES_PIXEL = sapbi_MIMES_PIXEL || "";
	sapbi_page.staticMimeUrlPrefix = sap.ui.resource("sap.zen.dsh","rt/");

	if (!window.sap) {
		window.sap = {};
	}

	if (!sap.zen) {
		sap.zen = {};
	}

	sap.zen.doReplaceDots = true;

	/**
	 * Init
	 */
	sap.zen.dsh.Dsh.prototype.init = function() {
		this.initial = true;
		this.rendered = false;
		this.parameters = {};
		this.dshBaseUrl = URI(sap.ui.resource("sap.zen.dsh","rt/")).absoluteTo(window.location.pathname).toString();
		this.dshBaseAppUrlBW = "/sap/bw/Mime";
	};

	/**
	 * Create Page
	 */
	sap.zen.dsh.Dsh.prototype.createPage = function() {
		this.doIt();
	}

	/**
	 * DoInit
	 */
	sap.zen.dsh.Dsh.prototype.doInit = function() {
		//0ANALYSIS will always come from our library for now.  This will be cleaned up later.
		if (this.getDshAppName() === "0ANALYSIS" || this.getDshAppName() === "0ANALYTIC_GRID") {
			this.setRepoPath(URI(sap.ui.resource("sap.zen.dsh","applications/")).absoluteTo(window.location.pathname).toString());
		}
		
		if (this.getRepoPath() !== "") {
			this.repositoryUrl = this.getRepoPath();
		}
		
		if (!this.initial) {
			return;
		}
		this.initial = false;

			/*
			* load modules required in Debug Mode
			* 	- load jszip synchron
			* 	- load xlsx synchron
			*/
		if (jQuery.sap.debug() === "true") {
			jQuery.sap.require("sap.zen.dsh.rt.zen_rt_firefly.js.jszip");
			jQuery.sap.require("sap.zen.dsh.rt.zen_rt_firefly.js.xlsx");
		}
			
		var that = this;
		if (!this.getDeferCreation()) {
			setTimeout(function(){
				that.doIt();
			}, 0);
		}
	};

	/**
	 * DoIt: create the Page Control
	 */
	sap.zen.dsh.Dsh.prototype.doIt = function() {
		this.doInit();
		sap.zen.dsh.scriptLoaded = true; 
		
		var that = this;
		{
			var language = that.getLanguage();
			if(!language){
				var oConfig = sap.ui.getCore().getConfiguration();

				language = oConfig.getLocale().getSAPLogonLanguage();

				if (!language) {
					language = window.navigator.userLanguage || window.navigator.language;
				}
			} 
			
			var client = that.getClient();
			if(!client && document.cookie){
				var match = /(?:sap-usercontext=)*sap-client=(\d{3})/.exec(document.cookie);
				if (match && match[1])
				{
					client = match[1];
				}
			} 

			var deployment = that.getDeployment();
			if(!deployment || deployment.length===0){
				deployment = "bw";
			}

			var app = that.getDshAppName();

			// ensure valid URL parameters are contained within parameters
			var loStartupParameters = this.getStartupParameters();
			if (loStartupParameters) {
				for (var lStartupParameter in loStartupParameters) {
					if (this.isDshParameter(lStartupParameter)) {
						if (!this.doesParameterExist(lStartupParameter)) {
							this.addParameter(lStartupParameter, loStartupParameters[lStartupParameter][0]);
						}
					}
				}
			}
			// add all parameters to urlParams
			var urlParams = sap.firefly.XHashMapOfStringByString.create();		
			for (var key in this.parameters) {
				urlParams.put(key, this.parameters[key]);
			}


			var designStudio = new sap.zen.DesignStudio();
			designStudio.setHost(document.location.hostname);
			designStudio.setPort(document.location.port);
			designStudio.setProtocol(document.location.protocol.split(":")[0]);
			designStudio.setClient(client);
			designStudio.setLanguage(language);
			if (this.repositoryUrl) {
				designStudio.setRepositoryUrl(this.repositoryUrl);
			}
			designStudio.setApplicationPath(this.dshBaseAppUrlBW);
			designStudio.setApplicationName(app);			
			designStudio.setUrlParameter(urlParams);
			designStudio.setSdkLoaderPath("");
			designStudio.setHanaMode(true);
			designStudio.setDshControlId(that.getId());
			designStudio.setStaticMimesRootPath(this.dshBaseUrl);
			designStudio.setSystemAlias(this.getSystemAlias());
			if (deployment === "bw2" || deployment === "bw") {
				designStudio.setNewBW(true);
			}
			designStudio.setRightToLeft(sap.ui.getCore().getConfiguration().getRTL());

			this._page = designStudio.createPage();
			if (this.rendered) {
				this._page.handleAfterRenderingOfRootControl();
			}
			
			window[this._page.getPageIdForScripting()] = this._page;
			
			sapbi_page = sapbi_page || {};
			sapbi_page.staticMimeUrlPrefix = this.dshBaseUrl;
			sapbi_page.getParameter = function(){return "";};
			sapbi_MIMES_PIXEL = "";

			//set appComponent on frontend sapbi_page, in case it is passed in.
			if (this.getAppComponent()) {
				sapbi_page.appComponent = this.getAppComponent();
			}
			
			var customCSS = this._page.getApplicationPropertiesComponent().getCustomCSSName();
			if (customCSS) {
				var fileref = document.createElement('link');
				fileref.setAttribute("type", "text/css");
				fileref.setAttribute("rel", "stylesheet");
				fileref.setAttribute("href", URI(this._page.getRelativePathToApp() + customCSS).normalize().toString());
				document.getElementsByTagName("head")[0].appendChild(fileref);
			}
		}
	};

	/**
	 * OnAfterRendering:
	 * Rendering of the Base Control is complete
	 */
	sap.zen.dsh.Dsh.prototype.onAfterRendering = function(){
		this.doInit();
		if (this._page) {
			this._page.handleAfterRenderingOfRootControl();
		}
		this.rendered = true;
	};

	/**
	 * Log Off
	 */
	sap.zen.dsh.Dsh.prototype.logoff = function(){
		if (this._page && !this.loggedOff){
				this.loggedOff = true;
				window.buddhaHasSendLock++;
				this._page.exec("APPLICATION.logoff();");
		}
	}

	/**
	 * Exit
	 */
	sap.zen.dsh.Dsh.prototype.exit = function(){
		this.logoff();

		var oRootAbsLayout = sap.ui.getCore().byId(this.sId + "ROOT_absolutelayout");	
		if (oRootAbsLayout) {
			oRootAbsLayout.destroy();
		}
		
		// Variable Dialog is not able to remove the Message Component (see zendialog_m_handler: not reflected as child)
		var oVariableMessageDialog = sap.ui.getCore().byId(this.sId + "VARIABLEDIALOG_MESSAGE_messageview1");
		if (oVariableMessageDialog) {
			oVariableMessageDialog.destroy();
		}
	};

	/**
	 * Add Parameter
	 */
	sap.zen.dsh.Dsh.prototype.addParameter = function(name, value) {
		this.parameters[name] = value;
	};

	/**
	 * Check if Parameter exists
	 */
	sap.zen.dsh.Dsh.prototype.doesParameterExist = function(name) {
		if (this.parameters[name]) {
			return true;
		}
		return false;
	};

	/**
	 * Retrieve StartUp Parameters of Application Component we are called by
	 */
	sap.zen.dsh.Dsh.prototype.getStartupParameters = function() {
		if (this.getAppComponent()) {
			if (this.getAppComponent().getComponentData()) {
				return this.getAppComponent().getComponentData().startupParameters;
			}
		}
		return null;
	}

	/**
	 * Check if Parameter belongs to us
	 */
	sap.zen.dsh.Dsh.prototype.isDshParameter = function(name) {
		if (name === "XTITLE" || name === "XQUERY" || name === "XDISPLAY" || name === "XCHART_TYPE" || name === "XPROMPT" || name === "XVISIBLEPROMPTS" || name === "XDATALIMIT_ROWS" || name === "XDATALIMIT_COLS" || name == "XEXCEL_VERSION") {
			return true;
		}
		return false;
	}

	/**
	 * Execure Script Function
	 */
	sap.zen.dsh.Dsh.prototype.executeScript = function(script){
		this.page.exec(script);
	};

	/**
	 * Get DataSource
	 */
	sap.zen.dsh.Dsh.prototype.getDataSource = function(name){
		return this.page.getDataSource(name);
	};

	/**
	 * Get Component
	 */
	sap.zen.dsh.Dsh.prototype.getComponent = function(name){
		return this.page.getComponent(name);
	};

	/**
	 * Get Page
	 */
	sap.zen.dsh.Dsh.prototype.getPage = function(){
		return this.page;
	};

	/**
	 * Get Semantic Mappings
	 */
	sap.zen.dsh.Dsh.prototype.getMapping = function(sName){
		if (this.getSemanticMappings() && this.getSemanticMappings()[sName]) {
			return this.getSemanticMappings()[sName];
		}
		return sName;
	}

	/**
	 * Initialize App State Data
	 */
	sap.zen.dsh.Dsh.prototype.initializeAppStateData = function(oStateData, oNavParams) {
		function addMappedValuesToObject(oMapping, oValueHolder, sValue) {
			if (Array.isArray(oMapping)) {
				for (var entry in oMapping) {
					if (!oValueHolder.hasOwnProperty(oMapping[entry])) {
						oValueHolder[oMapping[entry]] = sValue;
					}
				}
			}
			else {
				if (!oValueHolder.hasOwnProperty(oMapping)) {
					oValueHolder[oMapping] = sValue;
				}
			}
		}

		oNavParams = oNavParams || {};
		
		// cleanup navigation parameters
		for (var i = 0; i < Object.keys(oNavParams).length; ++i) {
			var lKey = Object.keys(oNavParams)[i];
			
			// do not add allowed URL parameters to navigation parameters
			if (this.isDshParameter(lKey)) {
				delete oNavParams[lKey];
			}
		}
		
		
		if (oStateData && oStateData.customData && oStateData.customData.bookmarkedAppState) {
			this.addParameter("NAV_INITIAL_STATE", oStateData.customData.bookmarkedAppState);
		}
		
		if (oStateData && oStateData.selectionVariant) {
			//We either have a real selectionVariant as js object here, or we have 
			//it in string format.  If string format, then there is also an oSelectionVariant, 
			//see sap.ui.generic.app.navigation.service.SelectionVariant
			var oSelectionVariant = oStateData.selectionVariant;
			if (typeof oSelectionVariant !== "object" && typeof oStateData.oSelectionVariant === "object" && oStateData.oSelectionVariant.toJSONObject) {
					oSelectionVariant = oStateData.oSelectionVariant.toJSONObject();
			}
			var aParameters = oSelectionVariant.Parameters;
			var aSelectOptions = oSelectionVariant.SelectOptions;
			
			//Nav Parameters are NOT mapped <--> semantic objects.
			if (aParameters) {
				for (var parameterNum = 0; parameterNum < aParameters.length; parameterNum++) {
					var oParameter = aParameters[parameterNum];

					// do not add allowed URL parameters to navigation parameters
					if (this.isDshParameter(oParameter.PropertyName)) {
						continue;
					}
					
					oNavParams[oParameter.PropertyName] = oParameter.PropertyValue;
				} 
			}

			if (aSelectOptions) {
				for (var i = 0; i < aSelectOptions.length; ++i) {
					var oSelectOption = aSelectOptions[i];
					
					// do not add allowed URL parameters to navigation parameters
					if (this.isDshParameter(oSelectOption.PropertyName)) {
						continue;
					}
					
					var aRanges = oSelectOption.Ranges;
					var aFilters = [];

					for (var j = 0; j < aRanges.length; ++j) {
						var filterValue;
						var oRange = aRanges[j];

						//Skip if this value uses an unsupported operation
						if (["EQ","BT","GE","LE","GT","LT"].indexOf(oRange.Option) == -1) {
							continue;
						}

						//For simple equals inclusions, use string instead of object. 
						if (oRange.Sign === "I" && oRange.Option === "EQ") {
							filterValue = oRange.Low;
						} else {
							filterValue = {
								exclude : oRange.Sign === "E" || undefined,
								operation : oRange.Option,
								from : oRange.Low,
								to : oRange.High
							};
						}
						aFilters.push(filterValue);
					}
					if (aFilters.length > 0) {
						addMappedValuesToObject(this.getMapping(oSelectOption.PropertyName), oNavParams, aFilters);
					}
				}
			}
		}
		if (!jQuery.isEmptyObject(oNavParams)) {
			this.addParameter("NAV_PARAMS", JSON.stringify(oNavParams));
		}
	}

	/**
	 * Initialize App State
	 */
	sap.zen.dsh.Dsh.prototype.initializeAppState = function(oStartupAppState, oNavParams){
		if (oStartupAppState) {
			var oStateData = {};
			//Do stuff with state
			if (oStartupAppState.getData && typeof oStartupAppState.getData === "function" ) {
				oStateData = oStartupAppState.getData();
			}
			this.initializeAppStateData(oStateData, oNavParams);
		}
	};

	return sap.zen.dsh.Dsh;
});
