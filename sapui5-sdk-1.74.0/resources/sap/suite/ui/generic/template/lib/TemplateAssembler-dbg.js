// This class is the central facility assembling Templates that can be used within a Smart Template application.
// Moreover, it serves as a registry for all central objects used in context of Smart Templates.
// In order to achieve this it provides three static methods:
// - getTemplateComponent creates a Template out of an abstract Template definition
// - getRegisterAppComponent is used by class AppComponent to establish a communication between the classes AppComponent and TemplateAssembler.
//   Note that this method cannot be used by any other class.
// - getExtensionAPIPromise provides access to the instance of the extensionAPI suitable for a certain control

sap.ui.define(["sap/ui/core/mvc/ControllerExtension",
		"sap/ui/core/mvc/OverrideExecution",
		"sap/ui/core/mvc/View",
		"sap/ui/model/base/ManagedObjectModel",
		"sap/suite/ui/generic/template/lib/TemplateViewController",
		"sap/suite/ui/generic/template/lib/TemplateComponent",
		"sap/suite/ui/generic/template/lib/CRUDManager",
		"sap/suite/ui/generic/template/lib/CommonUtils",
		"sap/suite/ui/generic/template/lib/ComponentUtils",
		"sap/suite/ui/generic/template/lib/CommonEventHandlers",
		"sap/suite/ui/generic/template/lib/testableHelper",
		"sap/suite/ui/generic/template/support/lib/CommonMethods",
		"sap/base/Log",
		"sap/base/util/deepExtend"
], function(ControllerExtension, OverrideExecution, View, ManagedObjectModel, TemplateViewController, TemplateComponent, CRUDManager, CommonUtils,
			ComponentUtils, CommonEventHandlers, testableHelper, CommonMethods, Log, deepExtend) {
			"use strict";

			var mControllerClasses = Object.create(null); // the controller classes for the supported templates are generated on demand and stored within this cache.

			var mAppRegistry = Object.create(null); // Registry for the AppComponents (mapping the id of the AppComponent onto its registry entry).
			                                        // Note that currently there is no scenario known, in which more than one AppComponent is active at the same time.
			                                        // Therefore, this map will never contain more than one entry.
			                                        // fnRegisterAppComponent (see below) is used to register/deregister an AppComponent into this registry.
			                                        // See also there for information, which properties are contained in a registry entry.

			// This function is handed over to class AppComponent. The variable will be set to null, once this has happened.
			// oAppRegistryEntry is a registry entry for the AppComponent. When it is registered it contains the following properties:
			// - appComponent: the AppComponent to be registered
			// - oTemplateContract: the TemplateContract for this App, as described in AppComponent
			// - application: instance of class Application
			// - oViewDependencyHelper: instance of class ViewDependencyHelper
			// This function returns a function that can be used to deregister the AppComponent from the registry when it is exited.
			var fnRegisterAppComponent = function(oAppRegistryEntry){
				var sAppComponentId = oAppRegistryEntry.appComponent.getId();
				mAppRegistry[sAppComponentId] = oAppRegistryEntry;
				return function(){
					delete mAppRegistry[sAppComponentId];
				};
			};

			// retrieve the registry entry for an AppComponent
			function getAppRegistryEntry(oAppComponent) {
				var sAppComponentId = oAppComponent.getId();
				var oRet = mAppRegistry[sAppComponentId];
				return oRet;
			}

			// retrieve the registry entry of a TemplateComponent. Note that the component registry is stored within the TemplateContract.
			// A component registry entry is instantiated in function fnCreateComponentInstance of NavigationController.
			// At this point in time it contains the following properties:
			// - componentCreateResolve: as soon as the component is created it will be passed to this function and the function will be deleted from the registry entry
			// - route: name of the route leading to the component
			// - routeConfig: configuration of the route leading to the component
			// - viewLevel: the hierarchical level of the component in the pages tree (root has level 0)
			// - routingSpec: routing spec from the routingConfig
			// - oNavigationObserver: a ProcessObserver observing the navigation in the NavContainer hosting the component
			//   Note: For Non-FCL-apps this will be the same instance for all components. For FCL-apps there will be one observer for each column.
			// - oHeaderLoadingObserver: a ProcessObserver observing the loading of the header data of the component
			// - preprocessorsData: data collected via templating and needed during runtime
			// - oAppComponent: the AppComponent hosting the app
			// The following properties will be added in method setContainer (of TemplateComponent, which can be found in this class):
			// - oApplication: Instance of class Application representing the whole app
			// - createViewController: A function that can be used to create the controller of the view realizing the component.
			//   Called in function createXMLView of TemplateComponent.
			// The following properties will be added in method getTemplateComponent:
			// - viewRegistered: A Promise that is resolved as soon as the controller of the view realizing the component is initialized
			// - fnViewRegisteredResolve: A function used to resolve or reject the Promise above. Will delete itself, when the Promise is resolved.
			// - oController: Will actually be added in the constructor of the controller (can be found in this class). This happens exactly when the preceeding Promise is resolved.
			// - oViewRenderedPromise: A Promise that is resolved as soon as the view realizing the component has been rendered the first time
			// - fnViewRenderdResolve: A function used to resolve the Promise above. Will be deleted, when the Promise is resolved.
			// - reuseComponentProxies: A map, mapping the keys of embedded reuse components onto their 'proxies'. Thereby the proxy has the structure as being defined in method mixInto of class ReuseComponentSupport.
			//   function dealWithEmbeddedComponent adds entries to this array
			// - componentName: full path (.-separated) to class realizing the component
			// - oComponent: the component
			// - oTemplateContract: The TemplateContract of the app (see class AppComponent for details on the TemplateContract)
			// - aKeys: An array containg the last used keys for this component
			// - utils: Instance of ComponentUtils attached to the component
			// - mRefreshInfos: A map, that maps names of entity sets onto boolean values. If an entity set is mapped onto a truthy value this
			//   indicates that something has changed with respect to this entity set. Therefore, SmartTables/SmartCharts that contain data from
			//   this entity set should be refreshed, when the component becomes visible next time.
			//   This is handled by method refreshBinding in ComponentUtils.
			//   refering to this entity set, when it becomes visible the next tim
			// - methods: Result of getMethods which was passed to getTemplateComponent
			// - oGenericData: An object containing data for generic functionality.
			// In method fnGetViewControllerCreator (more precisely: within the function created within this method) the following property is added:
			// - oControllerUtils: the full-blown TemplateUtils object which is used within the ControllerImplementation
			// The following property may be set by ComponentUtils
			// - aUnsavedDataCheckFunctions: an array (initialized on demand) containing functions that may know about pending changes
			function getComponentRegistryEntry(oComponent) {
				return getAppRegistryEntry(oComponent.getAppComponent()).oTemplateContract.componentRegistry[oComponent.getId()];
			}

			// Returns the view (instance of sap.ui.core.mvc.View) hosting the given control. Returns a faulty value if oControl is not directly or indirectly
			// hosted within a view.
			function fnFindView(oControl) {
				while (oControl && !(oControl instanceof View)) {
					oControl = oControl.getParent();
				}
				return oControl;
			}

			// Returns the registry entry for the TemplateComponent hosting the given control. Returns a faulty value if oControl is not directly or indirectly
			// hosted within a TemplateComponent.
			function fnGetComponentRegistryEntryForControl(oControl) {
				while (oControl) {
					var oView = fnFindView(oControl);
					var oController = oView && oView.getController();
					var oComponent = oController && oController.getOwnerComponent();
					if (oComponent instanceof TemplateComponent) {
						var oComponentRegistryEntry = getComponentRegistryEntry(oComponent);
						return oComponentRegistryEntry;
					} else {
						oControl = oComponent && oComponent.oContainer;
					}
				}
			}

			// This method assembles (and returns) the controller class of a template view. This class will be a subclass of TemplateViewController. However, the common functionaliy of
			// all template controllers is not ensured by inheritance from a common superclass. It is injected by the assembly process.
			// The parameters describe the behaviour of the controller in detail.
			// More precisely the meaning of the parameters is as follows:
			// - sControllerName: Name of the controller class to be instantiated.
			//   Note that the name of this class must match the names that are used within the manifest to be extended via sap.ui.controllerExtensions.
			//   sControllerName will be used to cache the returned class (in mControllerClasses). Hence, all other parameters of this method will be ignored in case the class has already been created before.
			//   Note that this implies that oControllerDefinition, oControllerExtensionDefinition must not carry any information about the concrete instance of the class to be created.
			// - oControllerDefinition (optional) is an object which is merged into the controller class. This object should only contain extension functions that are intended to
			//   be overwritten by breakout-developers. As a convention the names of these methods should end with suffix "Extension".
			//   The functions contained within this object should be the default implementations of these extensions (normally doing nothing).
			//   Note that the state of oControllerDefinition is not defined after having been passed to this function.
			// - oControllerExtensionDefinition (optional) defines the interface for devlopers of customer extensions.
			//   In principle the structure of this object is given by the structure of an object defining a sap.ui.core.mvc.ControllerExtension.
			//   However, in our case per convention the object should only contain the declaration of the methods intended to be overridden by extension projects.
			//   It is strongly recommended that these functions possess an empty default implementation.
			//   The following metadata should be set for these functions: public: true, final: false, overrideExecution: OverrideExecution.After.
			//   getTemplateViewControllerClass will set the metadata accordingly, if oControllerExtensionDefinition does not provide contradicting information.
			//   Thus, the metadata section of oControllerExtensionDefinition can be skipped in case that only the recommended values should be used.
			//   As a general rule an extension project should access the generic services available for it in the same way it is done by the implementation of a breakout.
			//   Therefore, the base controller extension will possess exactly one service method, named getExtensionAPI.
			//   This method will be added generically by this method. Thus, the individual templates need not to take care for this.
			function getTemplateViewControllerClass(sControllerName, oControllerDefinition, oControllerExtensionDefinition) {
				var oRet = mControllerClasses[sControllerName];
				if (oRet){ // controller class has already been created
					return oRet;
				}
				// controller class does not exist yet. So we create it.
				oControllerDefinition = deepExtend({}, oControllerDefinition);
				oControllerExtensionDefinition = deepExtend({}, oControllerExtensionDefinition);

				// Add service method getExtensionAPI in a generic way
				oControllerExtensionDefinition.metadata = oControllerExtensionDefinition.metadata || {};
				oControllerExtensionDefinition.metadata.methods = oControllerExtensionDefinition.metadata.methods || {};
				for (var sFuncname in oControllerExtensionDefinition){
					if (typeof oControllerExtensionDefinition[sFuncname] === "function"){
						var oFuncMetadata = oControllerExtensionDefinition.metadata.methods[sFuncname];
						if (!oFuncMetadata){
							oFuncMetadata = {};
							oControllerExtensionDefinition.metadata.methods[sFuncname] = oFuncMetadata;
						}
						oFuncMetadata.public = oFuncMetadata.public !== false;
						oFuncMetadata.final = oFuncMetadata.final || false;
						oFuncMetadata.overrideExecution = oFuncMetadata.overrideExecution || OverrideExecution.After;
					}
				}
				oControllerExtensionDefinition.metadata.methods.getExtensionAPI = {"public": true, "final": true};
				oControllerExtensionDefinition.getExtensionAPI = function(){
					var oController = this.getView().getController();
					return oController.extensionAPI;
				};

				oControllerDefinition.templateBaseExtension = ControllerExtension.extend(sControllerName + "BaseExtension", oControllerExtensionDefinition);

				oRet =  TemplateViewController.extend(sControllerName, oControllerDefinition);
				mControllerClasses[sControllerName] = oRet;
				return oRet;
			}

			// This function returns a function that can be used to create a controller instance for a template view.
			// Moreover, the returned function will also instantiate an object oTemplateUtils which is a collection of utils that can be used within the controller implementation.
			// oTemplateUtils will be added as property oControllerUtils to parameter oComponentRegistryEntry (see below).
			// On creation oTemplateUtils contains properties oComponentUtils (see corresponding class in this package) and oServices. Thereby, oServices has the following properties:
			// ~ to be filled by the template: oTemplateCapabilities,
			// ~ fom Denver layer: oApplicationController, oTransactionController, oDraftController,
			// ~ from this package: oApplication, oNavigationController, oViewDependencyHelper
			// Moreover, this method will ensure that the onInit function of the controller will add additional properties to oTemplateUtils, namely oCommonUtils and oCommonEventHandlers.
			// Moreover, onInit will add property oCRRUDManager to oTemplateUtils.oServices.
			// Parameter oComponentRegistryEntry contains the data of the corresponding component (see above).
			// In particular oComponentRegistryEntry.methods.oControllerSpecification is required (see documentation of getTemplateComponent)
			// This object should contain three properties, namely getMethods, oControllerDefinition, and oControllerExtensionDefinition.
			// oControllerDefinition and oControllerExtensionDefinition will be passed to function getTemplateViewControllerClass (see there for details).
			// getMethods is a function that will be called before the controller is instantiated. This method should have two parameters, namely oTemplateUtils and oController.
			// The first parameter is exactly the oTemplateUtils object described above. The second parameter represents the controller to be created. It can be used like 'this'
			// in normal class definitions.
			// The function getMethods must return a complex object possessing the following (optional) properties:
			// ~ onInit: will be called within onInit of the resulting controller
			// ~ handlers: An object containing the event handlers provided by the controller. A member <handler> can be accessed via _templateEventHandlers.<handler>
			// ~ formatters: An object containing the formatters provided by the controller. A member <formatter> can be accessed via _templateFormatters.<formatter>
			// ~ extensionAPI: The extensionAPI provided for breakout developers (and developers of reuse components). It will be available as property extensionAPI of the controller.
			function fnGetViewControllerCreator(oComponentRegistryEntry) {
				var oControllerSpecification = oComponentRegistryEntry.methods.oControllerSpecification;
				return oControllerSpecification ? function(){
					var oAppComponent = oComponentRegistryEntry.oComponent.getAppComponent();
					var oAppRegistryEntry = getAppRegistryEntry(oAppComponent);
					var oTransactionController = oAppComponent.getTransactionController();
					var oNavigationController = oAppComponent.getNavigationController();
					var oTemplateUtils = {
						oComponentUtils: oComponentRegistryEntry.utils,
						oServices: {
							oTemplateCapabilities: {}, // Templates will add their capabilities which are used by the framework into this object
							oApplicationController: oAppComponent.getApplicationController(),
							oTransactionController: oTransactionController,
							oNavigationController: oNavigationController,
							oDraftController: oTransactionController.getDraftController(),
							oApplication: oAppRegistryEntry.application,
							oViewDependencyHelper: oAppRegistryEntry.oViewDependencyHelper
						}
					};
					oComponentRegistryEntry.viewRegistered.catch(function(oError){
						Log.debug(oError.message);
						oNavigationController.navigateToMessagePage({
							viewLevel: oComponentRegistryEntry.viewLevel,
							title: oComponentRegistryEntry.oTemplateContract.getText("ST_ERROR"),
							text:  oComponentRegistryEntry.oTemplateContract.getText("ST_GENERIC_UNKNOWN_NAVIGATION_TARGET"),
							description: oError.message
						});
					});
					oComponentRegistryEntry.oControllerUtils = oTemplateUtils;
					var sControllerName = oComponentRegistryEntry.oComponent.getTemplateName();
					var oClass = getTemplateViewControllerClass(sControllerName, oControllerSpecification.oControllerDefinition, oControllerSpecification.oControllerExtensionDefinition);
					var oRet = new oClass();
					oComponentRegistryEntry.oController = oRet;

					var oMethods = oControllerSpecification.getMethods(oTemplateUtils, oRet);
					oRet._templateEventHandlers = Object.freeze(oMethods.handlers || {});
					oRet._templateFormatters = Object.freeze(oMethods.formatters || {});
					oRet.extensionAPI = Object.freeze(oMethods.extensionAPI || {});
					var sViewId;
					oRet.onInit = function() {
						var oView = oRet.getView();
						sViewId = oView.getId();
						Log.info("Init view " + sViewId + " of template " + sControllerName);
						oTemplateUtils.oServices.oApplicationController.registerView(oView);
						oTemplateUtils.oCommonUtils = new CommonUtils(oRet, oTemplateUtils.oServices, oTemplateUtils.oComponentUtils);
						oTemplateUtils.oServices.oCRUDManager = new CRUDManager(oRet,
							oTemplateUtils.oComponentUtils, oTemplateUtils.oServices, oTemplateUtils.oCommonUtils, oAppRegistryEntry.oTemplateContract.oBusyHelper
						);
						oTemplateUtils.oCommonEventHandlers = new CommonEventHandlers(oRet,
							oTemplateUtils.oComponentUtils, oTemplateUtils.oServices, oTemplateUtils.oCommonUtils);
						var oViewPropertiesModel = new ManagedObjectModel(oView);
						oComponentRegistryEntry.oComponent.setModel(oViewPropertiesModel, "_templPrivView");
						(oMethods.onInit || Function.prototype)();
					};
					oRet.onExit = function(){
						oAppRegistryEntry.oTemplateContract.oApplicationProxy.destroyView(sViewId);
						(oMethods.onExit || Function.prototype)();
						Log.info("View " + sViewId + " of template " + sControllerName + " exited");
					};
					return oRet;
				} : Function.prototype;
			}

			fnRegisterAppComponent = testableHelper.testableStatic(fnRegisterAppComponent, "TemplateComponent_RegisterAppComponent");

			return {
				// This method assembles a Template that can be used in Smart Template applications.
				// Thereby, getMethods, sComponentName, and oComponentDefinition describe the behaviour of the component in detail.
				// More precisely the meaning of the parameters is as follows:
				// - sComponentName is the name of the component that realizes the Template. More precisely it describes the path (.-separated)
				//   to a folder which contains a file Component.js which is built using this function.
				// - oComponentDefinition is an object containing a property metadata which contains the metadata for the TemplateComponent realizing the Template.
				// - getMethods is a function that will be called once for each instance of the Template to be assembled.
				//   The parameters passed to this function are oComponent and oComponentUtils
				//   ~ oComponent is the instance of class TemplateComponent that is created (can be considered as 'this')
				//   ~ oComponentUtils is an instance of class ComponentUtils that provides certain reusable tasks
				//   the return value of getMethods must be an object possessing the following (optional) properties:
				//   ~ init: a function that serves as init for the component. Note that it is not necessary to call init of a superclass
				//   ~ onActivate: a function that is called when the component becomes visible resp. its binding should be adapted.
				//     For non-list Templates parameter sBindingPath is passed to this function.
				//   ~ refreshBinding: a function with parameters bUnconditional and mRefreshInfos which is called when the data displayed by the
				//     Template instance should be refreshed. If bUnconditional is true, all data should be refreshed.
				//     Otherwise mRefreshInfos should be considered. See documentation of getComponentRegistryEntry for the structure of this map.
				//   ~ getUrlParameterInfo a function that allows the instance to pass its current state into url parameters. getUrlParameterInfo must return
				//     a Promise which resolves to a map mapping parameter names onto arrays of their values.
				//     This function gets a parameter sPath which describes the path for this component. So the implementation might decide to deliver the state only if the
				//     path is equal to the last used one. However, if sPath is faulty, the implementation can rely on the fact, that this context has not changed.
				//   ~ presetDisplayMode: a function possessing parameters iDisplayMode and bIsAlreadyDisplayed that may be called before onActivate is called.
				//     iDisplayMode contains information whether the data shown in the instance will be in display, edit, or create mode.
				//     bIsAlreadyDisplayed contains the information whether the Template instance is already inplace or will be navigated to.
				//   ~ showConfirmationOnDraftActivate: a function that indicates whether confirmation popup should appear in case of errors/warnings before activating
				//   ~ updateBindingContext: a function that is called when a new binding context is available for the Template instance.
				//     Note that when switching to change (edit or create) this method will only be called in draft scenarios, since in non-draft scenarios
				//     no binding context from the backend is retrieved.
				//   ~ getTemplateSpecificParameters: a function providing an object containing specific parameters used during the template process when generating
				//     the xml view for this component. The corresponding object can be accessed via path "/templateSpecific" in the named model "parameter".
				//   ~ enhanceExtensionAPI4Reuse: a method that is called for each reuse component placed on the corresponding component. This method receives two parameters.
				//     The first one is the extensionAPI that would be provided for the reuse component according to the framework
				//     The second one is an object representing the meta data of the embedded component (in particular it contains a property key containing the identification of the reuse component).
				//     The function might enhance the extensionAPI by additional features.
				//   ~ getTitle: a function that provides a title for this page. If not available the app title will be used.
				//   ~ beoreRebind/afterRebind: Methods that are called immediately before and after the component is rebound. Currently used for lazy loading.
				//   ~ currentDraftModified: function that is called, when an automated draft saving action is triggered centrally.
				//   ~ getScrollFunction: function(aControlIds) a function that can be called to retrieve a function that scrolls to one of the specified controls.
				//     A faulty value is returned, when the component cannot scroll to any of the given controls. Currently only for detail templates.
				//   ~ getItems: Method for retrieving the items currently available in the list (currently only for list-Templates) <- Note: Check whether paginator infrastructure might be used for this
				//   ~ displayNextObject: Currently also only for list-Templates: A function that can be called to inform the list, that after next list-update it should navigate to
				//     another item. The preferred items are passed in an array of binding pathes. The method should return a Promise that is resolved when it was
				//     possible to perform this movement. Otherwise the Promise must be rejected.
				//   ~ navigateUp: Inform the template that it should perform an up navigation to the next level. Note that this is a workwaround. The framework itself
				//     should be able to perform an up navigation.
				//   ~ oControllerSpecification: an object specifying the controller for the view realizing this Template.
				//     For more details see comments at function fnGetViewControllerCreator
				getTemplateComponent: function(getMethods, sComponentName, oComponentDefinition) {
					var sComponentNameFull = sComponentName + ".Component";
					oComponentDefinition = oComponentDefinition || {};

					oComponentDefinition.init = function() {
						var oComponentData = this.getComponentData();
						var oComponentRegistryEntry = oComponentData.registryEntry;
						oComponentRegistryEntry.viewRegistered = new Promise(function(fnResolve, fnReject) {
							// Note: oError is faulty in regular situations
							oComponentRegistryEntry.fnViewRegisteredResolve = function(oError){
								if (oError){
									oComponentRegistryEntry.fnViewRegisteredResolve = Function.prototype;
									fnReject(oError);
								} else {
									delete oComponentRegistryEntry.fnViewRegisteredResolve;
									fnResolve();
								}
							};
						});
						oComponentRegistryEntry.oViewRenderedPromise = new Promise(function(fnResolve) {
							oComponentRegistryEntry.fnViewRenderdResolve = fnResolve;
						});
						oComponentRegistryEntry.oViewRenderedPromise.then(function () {
							// Application status needs to be handled here to support use cases where Diagnostics Tool gets loaded after the app itself.
							CommonMethods.setApplicationStatus(CommonMethods.mApplicationStatus.RENDERED);
							// When view rendering has finished, publish global event "GetData" at channel "elements".
							CommonMethods.publishEvent("elements", "ViewRendered", {});
						});
						oComponentRegistryEntry.reuseComponentProxies = Object.create(null);
						oComponentRegistryEntry.componentName = sComponentNameFull;
						oComponentRegistryEntry.oComponent = this;
						oComponentRegistryEntry.aKeys = [];
						var oAppRegistryEntry = getAppRegistryEntry(oComponentRegistryEntry.oAppComponent);
						oComponentRegistryEntry.oTemplateContract = oAppRegistryEntry.oTemplateContract;
						(TemplateComponent.prototype.init || Function.prototype).apply(this, arguments);
						oComponentRegistryEntry.utils = new ComponentUtils(this, oComponentRegistryEntry);
						oComponentRegistryEntry.methods = getMethods(this, oComponentRegistryEntry.utils) || {};
						oComponentRegistryEntry.oGenericData = { };
						oComponentRegistryEntry.mRefreshInfos = Object.create(null);
						var sComponentId = this.getId();
						oComponentRegistryEntry.oTemplateContract.componentRegistry[sComponentId] = oComponentRegistryEntry;
						oComponentRegistryEntry.oTemplateContract.oBusyHelper.setBusy(oComponentRegistryEntry.viewRegistered, true);
						oComponentRegistryEntry.oApplication = oAppRegistryEntry.application;
						oComponentRegistryEntry.createViewController = fnGetViewControllerCreator(oComponentRegistryEntry);
						oComponentRegistryEntry.componentCreateResolve(this);
						delete oComponentRegistryEntry.componentCreateResolve;
						delete oComponentData.registryEntry;
						(oComponentRegistryEntry.methods.init || Function.prototype)();
					};

					oComponentDefinition.exit = function() {
						var sComponentId = this.getId();
						var oComponentRegistryEntry = getComponentRegistryEntry(this);
						var oAppRegistryEntry = getAppRegistryEntry(this.getAppComponent());
						var oMethods = oComponentRegistryEntry.methods;
						(oMethods.exit || Function.prototype)();
						delete oAppRegistryEntry.oTemplateContract.componentRegistry[sComponentId];
						(TemplateComponent.prototype.exit || Function.prototype).apply(this, arguments);
					};

					oComponentDefinition.onBeforeRendering = function() {
						var oComponentRegistryEntry = getComponentRegistryEntry(this);
						(TemplateComponent.prototype.onBeforeRendering || Function.prototype).bind(this, oComponentRegistryEntry).apply(this, arguments);
						var oMethods = oComponentRegistryEntry.methods;
						(oMethods.onBeforeRendering || Function.prototype)();
					};

					oComponentDefinition.onAfterRendering = function() {
						var oComponentRegistryEntry = getComponentRegistryEntry(this);
						if (oComponentRegistryEntry.fnViewRenderdResolve && !oComponentRegistryEntry.fnViewRegisteredResolve){
							oComponentRegistryEntry.fnViewRenderdResolve();
							delete oComponentRegistryEntry.fnViewRenderdResolve;
						}
						(TemplateComponent.prototype.onAfterRendering || Function.prototype).bind(this, oComponentRegistryEntry).apply(this, arguments);
						var oMethods = oComponentRegistryEntry.methods;
						(oMethods.onAftereRendering || Function.prototype)();
					};

					oComponentDefinition.onActivate = function(sBindingPath, bIsComponentCurrentlyActive) {
						var oComponentRegistryEntry = getComponentRegistryEntry(this);
						oComponentRegistryEntry.sCurrentBindingPath = sBindingPath;
						var fnActivate = function() {
							oComponentRegistryEntry.utils.bindComponent(oComponentRegistryEntry.sCurrentBindingPath, bIsComponentCurrentlyActive);
							oComponentRegistryEntry.utils.refreshBinding();
							return (oComponentRegistryEntry.methods.onActivate || Function.prototype)(sBindingPath, bIsComponentCurrentlyActive);
						};
						// If view is not registered yet ( == oComponentRegistryEntry.fnViewRegisteredResolve still available) perform fnActivate asyncronously, otherwise synchronosly
						return oComponentRegistryEntry.fnViewRegisteredResolve ? oComponentRegistryEntry.viewRegistered.then(fnActivate) : (fnActivate() || Promise.resolve());
					};

					oComponentDefinition.setIsRefreshRequired = function(bIsRefreshRequired) {
						if (bIsRefreshRequired){ // check whether refresh must be performed immediately
							var oComponentRegistryEntry = getComponentRegistryEntry(this);
							if (oComponentRegistryEntry.utils.isComponentActive() && !oComponentRegistryEntry.oTemplateContract.oNavigationControllerProxy.isNavigating()){
								oComponentRegistryEntry.viewRegistered.then(oComponentRegistryEntry.utils.refreshBinding.bind(null, true, {}));
								bIsRefreshRequired = false;
							}
						}
						this.setProperty("isRefreshRequired", bIsRefreshRequired);
					};

					oComponentDefinition.onDeactivate = Function.prototype;

					return TemplateComponent.extend(sComponentNameFull, oComponentDefinition);
				},

				// This method is called by class AppComponent when it is initialized. It hands over a registration method to this class.
				// This registration method can be used to register an AppComponent in the central AppComponentRegistry handled by this class.
				// See fnRegisterAppComponent for details.
				// Note that getRegisterAppComponent can only be called once.
				getRegisterAppComponent: function(){
					var fnRet = fnRegisterAppComponent;
					fnRegisterAppComponent = null;
					return fnRet;
				},

				getExtensionAPIPromise: function(oControl) {
					var oComponentRegistryEntry = fnGetComponentRegistryEntryForControl(oControl);
					if (!oComponentRegistryEntry) {
						return Promise.reject();
					}
					return oComponentRegistryEntry.viewRegistered.then(function() {
						return oComponentRegistryEntry.oController.extensionAPI;
					});
				},

				// Obsolete. Use getExtensionAPIPromise instead.
				getExtensionAPI: function(oControl) {
					var oComponentRegistryEntry = fnGetComponentRegistryEntryForControl(oControl);
					return oComponentRegistryEntry && oComponentRegistryEntry.oController && oComponentRegistryEntry.oController.extensionAPI;
				}
			};
		});
