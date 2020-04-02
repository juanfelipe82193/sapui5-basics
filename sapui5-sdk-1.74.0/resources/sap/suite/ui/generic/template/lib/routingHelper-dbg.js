/* Static helper class of NavigationController used to initialize the routing of the app during startup
 * More precisely the following tasks are performed:
 * - Create routes from the pages-section of the manifest
 * - Process startup parameters
 * - Finally, initialize router
 * Note that all methods of this class use a parameter oNavigationControllerProxy. This is a copy of the public NavigationController
 * enhanced by attributes oAppComponent, oRouter, oTemplateContract, and oHashChanger and a method fnInitializationResolve (which is to be called, when everything is done).
 */

sap.ui.define(["sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/generic/app/util/ModelUtil",
	"sap/suite/ui/generic/template/lib/CRUDHelper",
	"sap/suite/ui/generic/template/lib/FlexibleColumnLayoutHandler",
	"sap/suite/ui/generic/template/lib/testableHelper",
	"sap/suite/ui/generic/template/js/StableIdHelper",
	"sap/m/MessageBox",
	"sap/base/Log",
	"sap/ui/model/analytics/odata4analytics",
	"sap/base/util/extend",
	"sap/base/util/isEmptyObject",
	"sap/base/util/each"
], function(Filter, FilterOperator, ModelUtil, CRUDHelper, FlexibleColumnLayoutHandler,
		testableHelper, StableIdHelper, MessageBox, Log, odata4analytics, extend, isEmptyObject, each) {
		"use strict";

		var sPatternDelimiter = "---";

		function createTarget(oRouter, sControlId, sViewName, sTargetName, sControlAggregation) {
			var oTarget = {};
			oTarget = {
				viewName: sViewName,
				controlId: sControlId,
				controlAggregation: sControlAggregation
			};

			var oTargets = oRouter.getTargets();
			oTargets.addTarget(sTargetName, oTarget);
		}

		function createMessagePageTargets(oNavigationControllerProxy, sTargetControlId) {
			if (oNavigationControllerProxy.oTemplateContract.oFlexibleColumnLayoutHandler) {
				oNavigationControllerProxy.oTemplateContract.oFlexibleColumnLayoutHandler.createMessagePageTargets(createTarget.bind(null,
					oNavigationControllerProxy.oRouter, sTargetControlId, "sap.suite.ui.generic.template.fragments.MessagePage"));
			} else {
				createTarget(oNavigationControllerProxy.oRouter, sTargetControlId, "sap.suite.ui.generic.template.fragments.MessagePage",
					"messagePage", "pages");
			}
		}

		function fnEnhanceEntityNode(mEntityTree, sEntitySet, oDraftController) {
			var oEntityNode = mEntityTree[sEntitySet];
			if (!oEntityNode) {
				oEntityNode = {
					draftSpec: "OData",
					level: 0,
					children: []
				};
				for (var sChildCandidate in mEntityTree) {
					var oChildCandidate = mEntityTree[sChildCandidate];
					if (oChildCandidate.level === 1) {
						oEntityNode.children.push(sChildCandidate);
						break;
					}
				}
				mEntityTree[sEntitySet] = oEntityNode;
			}
			if (oEntityNode.hasOwnProperty("isDraft")) {
				return;
			}
			if (oEntityNode.draftSpec === "parent") {
				if (oEntityNode.parent) {
					fnEnhanceEntityNode(mEntityTree, oEntityNode.parent, oDraftController);
					var oParent = mEntityTree[oEntityNode.parent];
					oEntityNode.isDraft = oParent.isDraft;
				} else if (oEntityNode.level === 1) {
					for (var sEntitySetCandidate in mEntityTree) {
						var oParentCandidate = mEntityTree[sEntitySetCandidate];
						if (oParentCandidate.level === 0) {
							oEntityNode.isDraft = oParentCandidate.isDraft;
							return;
						}
					}
				}
				return;
			}
			if (oEntityNode.draftSpec === "OData") {
				var oDraftContext = oDraftController.getDraftContext();
				oEntityNode.isDraft = oDraftContext.isDraftEnabled(sEntitySet);
				return;
			}
			oEntityNode.isDraft = oEntityNode.draftSpec;
		}

		function fnEnhanceEntityTree(oNavigationControllerProxy, oTopRoute) {
			var oModel = oNavigationControllerProxy.oAppComponent.getModel();
			var oMetaModel = oModel.getMetaModel();
			oMetaModel.loaded().then(function() {
				var mEntityTree = oNavigationControllerProxy.oTemplateContract.mEntityTree;
				var oDraftController = oNavigationControllerProxy.oAppComponent.getTransactionController().getDraftController();
				fnEnhanceEntityNode(mEntityTree, oTopRoute.entitySet, oDraftController);
				for (var sEntitySet in mEntityTree) {
					fnEnhanceEntityNode(mEntityTree, sEntitySet, oDraftController);
				}
			});
		}

		/**
		 * Creates necessary routing metadata from configuration and adds it to the Router
		 *
		 * @public
		 * @param {String} sNavigationTargetId - the navigation target ID
		 * @returns {String} sEntitySet - the root EntitySet
		 */
		function generateRoutingMetadataAndGetRootEntitySet(oNavigationControllerProxy) {
			var sTargetControlId = oNavigationControllerProxy.oTemplateContract.oNavigationHost.getId();
			var oConfig = oNavigationControllerProxy.oAppComponent.getConfig();
			if (!oConfig.pages || !oConfig.pages.length) {
				throw new Error("Route Configuration missing");
			}
			if (oConfig.pages.length > 1) {
				throw new Error("Currently only one Top route supported");
			}

			// create Top-Route
			// currently only one top route supported
			var oTopPage = oConfig.pages[0];

			oNavigationControllerProxy.oTemplateContract.mEntityTree = Object.create(null);
			oNavigationControllerProxy.oTemplateContract.mRoutingTree = Object.create(null);

			var oTopTreeNode = {
				sRouteName: "root",
				page: oTopPage,
				pattern: "",
				contextPath: "",
				level: 0,
				fCLLevel: 0,
				children: [],
				headerTitle: oNavigationControllerProxy.oAppComponent.getManifestEntry("sap.app").title,
				text: ""
			};

			var oTopRoute = createRoute([], oTopPage, "root", oTopTreeNode, null, oNavigationControllerProxy, sTargetControlId);
			oNavigationControllerProxy.oRouter.addRoute(oTopRoute);

			oNavigationControllerProxy.oTemplateContract.mRoutingTree.root = oTopTreeNode;

			createQueryRoute(oTopRoute, oNavigationControllerProxy);

			createChildRoutes("root", oTopPage, 0, null, oTopTreeNode, oNavigationControllerProxy, sTargetControlId, oTopTreeNode.children);

			createMessagePageTargets(oNavigationControllerProxy, sTargetControlId);

			fnEnhanceEntityTree(oNavigationControllerProxy, oTopRoute);

			return oTopPage.entitySet;
		}

		/**
		 * Creates child route from the specified route configuration
		 *
		 * @private
		 * @param {Object} oRoute - the route configuration
		 * @param {Number} iLevel - the level
		 * @param {Object} oParent - the parent route (if any)
		 * @param {Object} oParentNode - the parent TreeNode (if any)
		 * @param {Array} aNodes - optional: Add the names of entity sets for the created roots to this array
		 */
		function createChildRoutes(vPredecessorTargets, oPage, iLevel, oParent, oParentNode, oNavigationControllerProxy, sTargetControlId, aNodes,
			oCommunicationObject, iParentFCLDistanceToRoot) {
			var i, iLen;
			if (oPage.pages) {
				iLen = oPage.pages.length;
				for (i = 0; i < iLen; i++) {
					createRoutes(vPredecessorTargets, oPage.pages[i], (iLevel + 1), oParent, oParentNode, oNavigationControllerProxy, sTargetControlId, aNodes,
						oCommunicationObject, iParentFCLDistanceToRoot || 0);
				}
			}
		}

		function fnHandleEmbeddedComponentPages(sEmbeddedComponentKey, oEmbeddedComponent, iLevel, oParent, oNavigationControllerProxy, sTargetControlId, aNodes,
			oCommunicationObject, iParentFCLDistanceToRoot) {
			var vPredecessorTargets = oParent.target;
			var oPseudoRoot = {
				pages: oEmbeddedComponent.pages
			};
			var oPseudoParent = {
				pattern: oParent.pattern + "/" + sEmbeddedComponentKey,
				entitySet: oParent.entitySet,
				name: oParent.name,
				contextPath: oParent.contextPath,
				patternDelimiter: sPatternDelimiter,
				embeddedComponent: sEmbeddedComponentKey
			};
			var oPseudoParentNode = {
				pattern: oParent.pattern + "/" + sEmbeddedComponentKey,
				patternDelimiter: sPatternDelimiter,
				contextPath: oParent.contextPath
			};
			createChildRoutes(vPredecessorTargets, oPseudoRoot, iLevel, oPseudoParent, oPseudoParentNode, oNavigationControllerProxy, sTargetControlId, aNodes,
				oCommunicationObject, iParentFCLDistanceToRoot);
		}

		function fnHandleEmbeddedComponent(oTreeNode, iLevel, oParent, oNavigationControllerProxy, sTargetControlId, iParentFCLDistanceToRoot,
			sEmbeddedComponentKey, oEmbeddedComponent, sContainerId, sSectionId, sSubSectionId) {
			var oCommunicationObject = {};
			var oEmbeddedComponentInfo = {
				key: sEmbeddedComponentKey,
				definition: oEmbeddedComponent,
				componentName: oEmbeddedComponent.componentName,
				componentUsage: oEmbeddedComponent.componentUsage,
				hiddenByDefault: oEmbeddedComponent.hiddenByDefault,
				containerId: sContainerId,
				sectionId: sSectionId,
				subSectionId: sSubSectionId,
				pages: oEmbeddedComponent.pages || [],
				children: [],
				communicationObject: oCommunicationObject
			};
			oTreeNode.embeddedComponents[sEmbeddedComponentKey] = oEmbeddedComponentInfo;
			if (oEmbeddedComponent.pages) {
				fnHandleEmbeddedComponentPages(sEmbeddedComponentKey, oEmbeddedComponent, iLevel, oParent, oNavigationControllerProxy, sTargetControlId, oEmbeddedComponentInfo.children, oCommunicationObject, iParentFCLDistanceToRoot);
			}
		}

		function fnHandleEmbeddedComponents(oTreeNode, oRoute, iLevel, oParent, oNavigationControllerProxy, sTargetControlId, iParentFCLDistanceToRoot) {
			oTreeNode.embeddedComponents = Object.create(null);
			oTreeNode.leadingComponents = Object.create(null);
			oTreeNode.facetsWithEmbeddedComponents = Object.create(null);
			if (oRoute.implementingComponent) {
				fnHandleEmbeddedComponent(oTreeNode, iLevel, oParent, oNavigationControllerProxy, sTargetControlId, iParentFCLDistanceToRoot, "implementation", oRoute.implementingComponent, "template::ImplementingComponent");
			} else if (oRoute.embeddedComponents) {
				// first we analyze the grouping structure of the embedded components.
				// Note that there are three kinds of reuse components: 1. "leading" -> defining an own group of reuse components 2. "following" -> added to a group of another leading component 3. "facet" -> added to an already existing facet
				var mLeadingComponents = Object.create(null);
				var mFollowingComponents = Object.create(null);
				var sEmbeddedComponentKey;
				var oEmbeddedComponent;
				var aSiblings;
				for (sEmbeddedComponentKey in oRoute.embeddedComponents) {
					oEmbeddedComponent = oRoute.embeddedComponents[sEmbeddedComponentKey];
					if (!oEmbeddedComponent.leadingSectionIdOrPath || oEmbeddedComponent.leadingSectionIdOrPath === sEmbeddedComponentKey){ // this is considered as a well-defined leading component
						mLeadingComponents[sEmbeddedComponentKey] = [sEmbeddedComponentKey];
					} else if (oRoute.embeddedComponents[oEmbeddedComponent.leadingSectionIdOrPath]){ // this seems to be a following component
						mFollowingComponents[sEmbeddedComponentKey] = oEmbeddedComponent.leadingSectionIdOrPath;
					} else { // a facet component
						aSiblings = oTreeNode.facetsWithEmbeddedComponents[oEmbeddedComponent.leadingSectionIdOrPath];
						if (aSiblings){
							aSiblings.push(sEmbeddedComponentKey);
						} else {
							oTreeNode.facetsWithEmbeddedComponents[oEmbeddedComponent.leadingSectionIdOrPath] = [sEmbeddedComponentKey];
						}
					}
				}
				var aInconsitencies = [];
				for (sEmbeddedComponentKey in mFollowingComponents) {
					var sLeadingComponentKey = mFollowingComponents[sEmbeddedComponentKey];
					aSiblings = mLeadingComponents[sLeadingComponentKey]; // list of reuse components belonging to the same leading component already identified (should at least contain the leading component itself)
					if (aSiblings){ // expected result
						aSiblings.push(sEmbeddedComponentKey); // add this reuse component to the list of following components of the leading component
					} else { // sEmbeddedComponentKey is a following component which points to another component which is not leading either. For robustness we consider such an inconsitent component as a group of its own.
						aInconsitencies.push(sEmbeddedComponentKey);
						delete mFollowingComponents[sEmbeddedComponentKey];
					}
				}
				for (var i = 0; i < aInconsitencies.length; i++){ // transfer all inconsistent components to the set of leading components
					mLeadingComponents[aInconsitencies[i]] = [aInconsitencies[i]];
				}
				for (sEmbeddedComponentKey in oRoute.embeddedComponents) {
					oEmbeddedComponent = oRoute.embeddedComponents[sEmbeddedComponentKey];
					var sSectionId = mLeadingComponents[sEmbeddedComponentKey] && StableIdHelper.getStableId({
						type: "ObjectPageSection",
						subType: "ReuseComponentSection",
						sReuseComponentName: oEmbeddedComponent.componentName,
						sReuseComponentUsage: oEmbeddedComponent.componentUsage,
						sReuseComponentId: sEmbeddedComponentKey
					});
					var sSubSectionId = StableIdHelper.getStableId({
						type: "ObjectPageSection",
						subType: "ReuseComponentSubSection",
						sReuseComponentName: oEmbeddedComponent.componentName,
						sReuseComponentUsage: oEmbeddedComponent.componentUsage,
						sReuseComponentId: sEmbeddedComponentKey
					});
					var sContainerId = StableIdHelper.getStableId({
						type: "ObjectPageSection",
						subType: "ReuseComponentContainer",
						sReuseComponentName: oEmbeddedComponent.componentName,
						sReuseComponentUsage: oEmbeddedComponent.componentUsage,
						sReuseComponentId: sEmbeddedComponentKey
					});
					fnHandleEmbeddedComponent(oTreeNode, iLevel, oParent, oNavigationControllerProxy, sTargetControlId, iParentFCLDistanceToRoot, sEmbeddedComponentKey,
						oEmbeddedComponent, sContainerId, sSectionId, sSubSectionId);
				}
				// Transfer information from mLeadingComponents to oTreeNode.leadingComponents.
				Object.keys(mLeadingComponents).forEach(function(sLeadingComponentKey){
					var oLeadingComponentMeta = oTreeNode.embeddedComponents[sLeadingComponentKey];
					oTreeNode.leadingComponents[sLeadingComponentKey] = {
						sectionId: oLeadingComponentMeta.sectionId,
						title: oLeadingComponentMeta.definition.groupTitle || oLeadingComponentMeta.definition.title,
						followingComponents: mLeadingComponents[sLeadingComponentKey].map(function(sFollowingKey){
							var oFollowingComponentMeta = oTreeNode.embeddedComponents[sFollowingKey];
							oFollowingComponentMeta.sectionId = oLeadingComponentMeta.sectionId;
							return oFollowingComponentMeta;
						})
					};
				});
			}
		}

		/**
		 * Creates all necessary route(s) metadata from configuration and adds it to the Router instance
		 *
		 * @private
		 * @param {Object} oRoute - the route configuration
		 * @param {Number} iLevel - the level
		 * @param {Object} oParent - the parent route (if any)
		 * @param {Object} oParentNode - the parent TreeNode (if any)
		 * @param {Array} aNodes - optional: Add the names of entity sets for the created roots to this array
		 */
		function createRoutes(vPredecessorTargets, oPage, iLevel, oParent, oParentNode, oNavigationControllerProxy, sTargetControlId, aNodes,
			oCommunicationObject, iParentFCLDistanceToRoot) {
			if (oPage.component) { //in case of intent there is no internal route to be created
				var iMaxColumnCountInFCL = oNavigationControllerProxy.oTemplateContract.oFlexibleColumnLayoutHandler ? oNavigationControllerProxy.oTemplateContract.oFlexibleColumnLayoutHandler.getMaxColumnCountInFCL() : 1;
				var iFCLDistanceToRoot = (iMaxColumnCountInFCL === 1) || (oPage.defaultLayoutType === "OneColumn") ? 0 : iParentFCLDistanceToRoot + 1;
				var oTreeNode = {
					parent: oParent && oParent.entitySet,
					parentRoute: oParent ? oParent.name : "root",
					parentEmbeddedComponent: oParent && oParent.embeddedComponent,
					entitySet: oPage.entitySet,
					navigationProperty: oPage.navigationProperty,
					level: iLevel,
					fCLLevel: iFCLDistanceToRoot >= iMaxColumnCountInFCL ?  3 : iFCLDistanceToRoot,
					children: [],
					communicationObject: oCommunicationObject,
					page: oPage,
					defaultLayoutType: oPage.defaultLayoutType,
					noKey: oPage.routingSpec && oPage.routingSpec.noKey,
					noOData: oPage.routingSpec && oPage.routingSpec.noOData,
					draftSpec: oPage.routingSpec ? oPage.routingSpec.draftSpec || "parent" : "OData",
					text: ""
				};
				fnSetPatternForTreeNode(oTreeNode, oParentNode);
				if (oTreeNode.noOData){
					fnSetContextPathForNonOData(oTreeNode, oParentNode);
				} else {
					fnSetContextPath(oTreeNode, oNavigationControllerProxy);
				}
				var oNewRoute = createRoute(vPredecessorTargets, oPage, oPage.component.list ? "aggregation" : "detail", oTreeNode, oParent,
					oNavigationControllerProxy, sTargetControlId);
				oTreeNode.sRouteName = oNewRoute.name;
				if (aNodes) {
					aNodes.push(oNewRoute.entitySet);
				}
				oNavigationControllerProxy.oTemplateContract.mRoutingTree[oNewRoute.name] = oTreeNode;
				var oExistingTreeNode = oNavigationControllerProxy.oTemplateContract.mEntityTree[oNewRoute.entitySet];
				// Expected: oExistingTreeNode is faulty. However, there are scenarios with circular page structures.
				if (!oExistingTreeNode || oExistingTreeNode.level > oTreeNode.level) {
					oNavigationControllerProxy.oTemplateContract.mEntityTree[oNewRoute.entitySet] = oTreeNode;
				}
				oNavigationControllerProxy.oRouter.addRoute(oNewRoute);
				createQueryRoute(oNewRoute, oNavigationControllerProxy);
				addTitleInfoToTreeNode(oNavigationControllerProxy, oTreeNode, oPage);
				createChildRoutes(oNewRoute.target, oPage, iLevel, oNewRoute, oTreeNode, oNavigationControllerProxy, sTargetControlId, oTreeNode.children, oCommunicationObject, iFCLDistanceToRoot);
				fnHandleEmbeddedComponents(oTreeNode, oPage, iLevel, oNewRoute, oNavigationControllerProxy, sTargetControlId, iFCLDistanceToRoot);
			}
		}

		/**
		 * Creates a Query route from the specified route and adds it to the router
		 *
		 * @private
		 * @param {Object} oRoute - the route configuration
		 */
		function createQueryRoute(oRoute, oNavigationControllerProxy) {
			var oQueryRoute = extend({}, oRoute);
			oQueryRoute.name = oRoute.name + "query";
			oQueryRoute.pattern = oRoute.pattern + "{?query}";
			oNavigationControllerProxy.oRouter.addRoute(oQueryRoute);
		}

		function addTitleInfoToTreeNode(oNavigationControllerProxy, oTreeNode, oPage) {
			if (oTreeNode.noOData) {
				oTreeNode.headerTitle = oPage.routingSpec.headerTitle;
				oTreeNode.titleIconUrl = oPage.routingSpec.titleIconUrl;
			} else {
				var oModel = oNavigationControllerProxy.oAppComponent.getModel();
				var oMetaModel = oModel.getMetaModel();
				oMetaModel.loaded().then(function() {
					var oModelEntitySet = oMetaModel.getODataEntitySet(oTreeNode.entitySet);
					var oDataEntityType = oMetaModel.getODataEntityType(oModelEntitySet.entityType);
					var oHeaderInfo = oDataEntityType["com.sap.vocabularies.UI.v1.HeaderInfo"];
					var sHeaderTitle = (oHeaderInfo && oHeaderInfo.TypeName && oHeaderInfo.TypeName.String) || "";
					if (sHeaderTitle.substr(0, 7) === "{@i18n>") {
						var sSubstr = sHeaderTitle.substring(1, sHeaderTitle.length - 1);
						var aString = sSubstr.split(">");
						sHeaderTitle = oNavigationControllerProxy.oAppComponent.getModel(aString[0]).getResourceBundle().getText(aString[1]);
					}
					oTreeNode.headerTitle = sHeaderTitle;
					var sTitleIconUrl = (oHeaderInfo && oHeaderInfo.Title && oHeaderInfo.Title.IconUrl && oHeaderInfo.Title.IconUrl.String) || "";
					oTreeNode.titleIconUrl = sTitleIconUrl;
				});
			}
		}

		function fnSetPatternForTreeNode(oTreeNode, oParentNode){
			if (oTreeNode.level === 0){
				oTreeNode.pattern = "";
				return;
			}
			var sPathPattern = (oTreeNode.level === 1) ? oTreeNode.page.entitySet : oTreeNode.page.navigationProperty;
			var sKeySpec = oTreeNode.noKey ? "" : "({keys" + oTreeNode.level + "})";
			oTreeNode.pattern = sPathPattern + sKeySpec;
			if (oParentNode && oParentNode.pattern){
				oTreeNode.pattern = oParentNode.pattern + (oParentNode.patternDelimiter || "/") + oTreeNode.pattern;
			}
		}

		/*
		 * get the context path from navigation path/pattern
		 * @param {Object} oRouteConfig - the route configuration
		 * @returns {String} the context path
		 */
		function fnSetContextPath(oTreeNode, oNavigationControllerProxy) {
			if (oNavigationControllerProxy.oTemplateContract.bCreateRequestsCanonical){
				oTreeNode.contextPath =  "/" + oTreeNode.entitySet + "({keys" + oTreeNode.level + "})";
			} else {
				oTreeNode.contextPath =  "/" + oTreeNode.pattern;
			}
		}

		function fnSetContextPathForNonOData(oTreeNode, oParentNode){
			oTreeNode.contextPath = oParentNode.contextPath + (oTreeNode.page.routingSpec.binding ? ("/" + oTreeNode.page.routingSpec.binding) : "");
		}

		/**
		 * Creates and returns a route metadata from configuration
		 *
		 * @private
		 * @param {Object} oRoute - the route configuration
		 * @param {string} sOperation - the operation for which the route has to be created
		 * @param {Object} oTreeNode- the tree node representing the route
		 * @param {Object} oParentRoute - the parent route (if any)
		 * @returns {Object} the created route metadata
		 */
		function createRoute(vPredecessorTargets, oPage, sOperation, oTreeNode, oParentRoute, oNavigationControllerProxy, sTargetControlId) {
			var iLevel = oTreeNode.level;
			var aPredecessorTargets = Array.isArray(vPredecessorTargets) ? vPredecessorTargets : [vPredecessorTargets];
			var sPathPattern, oNewRoute;
			sPathPattern = (iLevel === 1) ? oPage.entitySet : oPage.navigationProperty;

			oNewRoute = extend({}, oPage);
			oNewRoute.path = "/" + oPage.entitySet;
			oNewRoute.operation = sOperation;
			oNewRoute.viewLevel = iLevel;
			// TODO: use only component name here?
			oNewRoute.template = oPage.component ? (oPage.component.name || oPage.component) : oPage.template;

			switch (sOperation) {
				case "root":
					oNewRoute.name = "root";
					break;
				case "aggregation":
					oNewRoute.name = sPathPattern + "~aggregation";
					break;
				default:
					oNewRoute.name = sPathPattern;
					break;
			}

			if (oParentRoute) {
				oNewRoute.name = oParentRoute.name + "/" + (oParentRoute.embeddedComponent ? oParentRoute.embeddedComponent + "/" : "") + oNewRoute.name;
				oNewRoute.parentEntitySet = oParentRoute.entitySet;
			}
			var sControlAggregation;
			var sTargetName = oNewRoute.name;
			if (oNavigationControllerProxy.oTemplateContract.oFlexibleColumnLayoutHandler) { // In this case the view is hosted by the FCL
				sControlAggregation = oNavigationControllerProxy.oTemplateContract.oFlexibleColumnLayoutHandler.adaptRoutingInfo(oNewRoute,
					sTargetName, aPredecessorTargets, oTreeNode);
			} else { // In this case the view is hosted by the NavContainer
				sControlAggregation = "pages";
				oNewRoute.target = sTargetName;
			}
			createTarget(oNavigationControllerProxy.oRouter, sTargetControlId, oNewRoute.name, sTargetName, sControlAggregation);

			var oPromise = new Promise(function(fnResolve) {
				oNavigationControllerProxy.mRouteToComponentResolve[oNewRoute.name] = fnResolve;
			});
			oNavigationControllerProxy.oTemplateContract.mRouteToTemplateComponentPromise[oNewRoute.name] = oPromise;
			oNewRoute.pattern = oTreeNode.pattern;
			oNewRoute.contextPath = oTreeNode.contextPath;
			return oNewRoute;
		}

		// - End methods for creating the routes

		/*
		 * Creates necessary routing info and initialises the Router
		 */
		function fnInitialiseRouting(oNavigationControllerProxy, oStartupParameters) {
			var sHash;
			if (!oNavigationControllerProxy.oHashChanger.getHash()) {
				sHash = "";
				// no route is set yet, check if start entity was passed via parameter
				if (oStartupParameters && oStartupParameters.route && oStartupParameters.route.length === 1) {
					sHash = oStartupParameters.route[0];
					oNavigationControllerProxy.navigate(sHash, true);
				}
			}
			oNavigationControllerProxy.oRouter.initialize();
			oNavigationControllerProxy.fnInitializationResolve();
		}

		// - Start methods for processing the startup parameters

		function fnBuildFilters(oNavigationControllerProxy, sEntitySet, aKeys, oStartupParameters) {
			var i, iLen, sProperty, sValue, aFilters = [],
				oCompleteFilter;
			iLen = aKeys.length;
			for (i = 0; i < iLen; i++) {
				// get property from property path
				sProperty = aKeys[i].PropertyPath;
				// get value from parameter array (should have only 1)
				sValue = oStartupParameters[sProperty][0];
				aFilters.push(new Filter(sProperty, FilterOperator.EQ, sValue));
			}
			if (oNavigationControllerProxy.oAppComponent.getTransactionController().getDraftController()
				.getDraftContext().isDraftEnabled(sEntitySet)) {
				var oDraftFilter = new Filter({
					filters: [new Filter("IsActiveEntity", "EQ", false),
						new Filter("SiblingEntity/IsActiveEntity", "EQ", null)
					],
					and: false
				});
				aFilters.push(oDraftFilter);
			}
			oCompleteFilter = new Filter(aFilters, true);
			return oCompleteFilter;
		}
		/**
		 * Creates and returns path with parametrization added
		 * @private
		 * @param {Object} oDataModel for entityset
		 * @param {string} EntitySet name
		 * @param {Object} oStartupParameters - URL Parameters
		 * @returns {string} path with parametrization added
		 */
		function fnResolveParameterizedEntitySet(oDataModel, oEntitySet, oStartupParameters) {
			var path = "/" + oEntitySet;
			try {
				var o4a = new odata4analytics.Model(odata4analytics.Model.ReferenceByModel(oDataModel));
				var queryResult = o4a.findQueryResultByName(oEntitySet);
				var queryResultRequest = new odata4analytics.QueryResultRequest(queryResult);
				var parameterization = queryResult && queryResult.getParameterization();
				var bIsParamPresent = false;
				if (parameterization) {
					queryResultRequest.setParameterizationRequest(new odata4analytics.ParameterizationRequest(parameterization));
					var aParametricSet = parameterization.getAllParameterNames();
					each(aParametricSet, function() {
						if (oStartupParameters.hasOwnProperty(this)) {
							bIsParamPresent = true;
							queryResultRequest.getParameterizationRequest().setParameterValue(
								this,
								oStartupParameters[this][0]
							);
						}
					});
					// To handle Mandatory Parameter which starts without "P_" in parameter list
					for (var i = 0; i < aParametricSet.length; i++) {
						if (aParametricSet[i].startsWith("P_")) {
							var sMandatoryParameter = aParametricSet[i].substr(2);
							if (oStartupParameters.hasOwnProperty(sMandatoryParameter)) {
								bIsParamPresent = true;
								queryResultRequest.getParameterizationRequest().setParameterValue(
									aParametricSet[i],
									oStartupParameters[sMandatoryParameter][0]);
							}
						}
					}
					if (bIsParamPresent) {
						path = queryResultRequest.getURIToQueryResultEntitySet();
					}
				}
			} catch (error) {
				// Not logging an error because it will fail qunit and is not required as fall back is default
				Log.info(error.name + ":" + error.message );
			}
			return path;
		}

		function fnCreateReadPromise(sEntitySet, oFilters, oModel, oStartupParameters, iLevel) {

			return new Promise(function(fnResolve, fnReject) {
				// Directly reading using the entitySet as currently, Gateway cannot handle filters in case of 1..n navigation properties
				var EntitySetPath = fnResolveParameterizedEntitySet(oModel, sEntitySet, oStartupParameters);
				oModel.read(EntitySetPath, {
					filters: [oFilters],
					success: function(oResult) {
						var oRowResult = fnReadObjectProcessResults(oResult, oModel, oStartupParameters);
						// if no results returned, then return a fnResolve with status:noData.
						// if oRowResult, then return fnResolve with status:success
						// If status is not "success" then navigate to the preceding level
						if (oRowResult) {
							var sKey = oModel.getKey(oRowResult);
							if (sKey) {
								fnResolve({
									"status": "success",
									"value": sKey,
									"iLevel": iLevel
								});
							}
						}
						fnResolve({
							"status": "noData"
						});
					},
					error: function() {
						fnResolve({
							"status": "error"
						});
					}
				});
			});
		}

		/*
		 * perform a read with the specified data and trigger further initialisation of router
		 *
		 * @param {Array} aKeys - the keys used to create the filter
		 * @param {Object} oStartupParameters - object containing parameters
		 * @param {Object} oModel- the odata model instance
		 * @param {Object} oNavigationPossible - Semantic Keys and navigation property for Object pages used to check if navigation is possible
		 * @param {String} sHash - key for root Object page
		 */
		function fnReadObject(oNavigationControllerProxy, sEntitySet, aKeys, oStartupParameters, oModel, oNavigationPossible, sHash) {
			var aPromises = [],
				oPage, oPageFilter, oPagePromise;
			var oRootPagePromiseForTK = new Promise(function(fnResolve) { //Since nav via Semantic Key is not possible for Root Object Page, nav would be done via TK
				fnResolve({
					"status": "success",
					"value": sHash,
					"iLevel": 0
				});
			});
			if (aKeys && oStartupParameters && oModel) {
				if (oNavigationPossible.aNavigablePages) {
					for (var i = 0; i < oNavigationPossible.aNavigablePages.length; i++) {
						if (oNavigationPossible.aNavigablePages && oNavigationPossible.aNavigablePages[i] && oNavigationPossible.aNavigablePages[i].bNavigationWithTechnicalKeyPossible) {
							//Since nav via Semantic Key is not possible for Root Object Page, nav would be done via TK
							aPromises.push(oRootPagePromiseForTK);
							continue;
						}
						oPage = oNavigationPossible.aNavigablePages[i];
						oPageFilter = fnBuildFilters(oNavigationControllerProxy, oPage.sEntitySet, oPage.aSemanticKey, oStartupParameters);
						oPagePromise = fnCreateReadPromise(oPage.sEntitySet, oPageFilter, oModel, oStartupParameters, oPage.iLevel);
						aPromises.push(oPagePromise);
					}
				}
				return Promise.all(aPromises).then(function(aResults) {
					if (aResults[0] && aResults[0].status && aResults[0].status === "success") {
						var i, sKey = "",
							sPageKey;
						for (i = 0; i < aResults.length; i++) {

							if (aResults[i] && aResults[i].status && aResults[i].status === "success") {
								sPageKey = aResults[i].value;
								if (i > 0) { //For all subObject pages entitySet needs to be replaced with navigation Property.
									sPageKey = sPageKey.replace(oNavigationPossible.aNavigablePages[i].sEntitySet, oNavigationPossible.aNavigablePages[i].sNavigationProperty);
									sPageKey = '/' + sPageKey;
								}
								sKey = sKey.concat(sPageKey);
								continue;
							} else { //if Promise does not return status:success for any of the sub pages then break and nav to preceding level
								break;
							}
						}
						// Once the final key is ready then navigate
						oNavigationControllerProxy.navigate(sKey, true);
					}
					fnInitialiseRouting(oNavigationControllerProxy, oStartupParameters);
				});
			}
		}

		function fnReadObjectProcessResults(oResult, oModel, oStartupParameters) {
			var oRow, i, iLength, oRowResult;
			if (oResult && oResult.results) {
				iLength = oResult.results.length;
				if (iLength === 0) {
					oRowResult = null;
				} else if (iLength === 1) {
					oRowResult = oResult.results[0];
				} else if (iLength >= 1) {
					var aDrafts = [];
					var aActive = [];
					for (i = 0; i < iLength; i++) {
						oRow = oResult.results[i];
						if (oRow && oRow.IsActiveEntity) {
							aActive.push(oRow);
						} else if (oRow && oRow.IsActiveEntity === false) {
							aDrafts.push(oRow);
						}
					}
					if (aActive.length === 0 && aDrafts.length >= 2) {
						//DraftUUID match?
						var oDraftRow;
						for (var j = 0; j < aDrafts.length; j++) {
							oDraftRow = aDrafts[j];
							if (oDraftRow.DraftUUID === (oStartupParameters.DraftUUID && oStartupParameters.DraftUUID[0])) {
								//show corresponding object
								oRowResult = oDraftRow;
								break;
							}
						}
						if (!oRowResult) {
							oRowResult = aDrafts[0];
						}
					} else if (aActive.length === 1 && aDrafts.length >= 1) {
						//no DraftUUID check
						oRowResult = aActive[0];
					}
				}
			}
			return oRowResult;
		}

		function fnCombineMode(sPreferredMode, sMode) {
			// in case of not allowed combinations of mode navigate to the List Report
			if ((sPreferredMode && sMode) || (sMode === "display")) {
				return {
					mode: "unsupported"
				};
			}

			var oResult = {
				mode: "display",
				force: "false"
			}; // historic default behavior

			oResult.mode = sMode || sPreferredMode || oResult.mode;
			oResult.force = !!sMode;

			return oResult;
		}

		function fnDefaultNavigationProcessing(oModel, oNavigationControllerProxy, sEntitySet, oStartupParameters, oMode) {
			var oStartupParametersWithEditableFor = extend({}, oStartupParameters);
			fnProcessEditableFieldFor(oModel.getMetaModel(), sEntitySet, oStartupParametersWithEditableFor);
			var oNavigationPossible = fnCheckNavigation(oModel, oNavigationControllerProxy, sEntitySet, oStartupParametersWithEditableFor, oMode);
			if (oNavigationPossible.aNavigablePages && oNavigationPossible.aNavigablePages[0] && oNavigationPossible.aNavigablePages[0].aSemanticKey &&
				oNavigationPossible.aNavigablePages[0].iLevel === 0) { // check: if navigation to Root ObjectPage is possible via SemanticKey. iLevel=0 makes sure that the page in reference is the rootObjectPage
				fnReadObject(oNavigationControllerProxy, sEntitySet, oNavigationPossible.aNavigablePages[0].aSemanticKey, oStartupParametersWithEditableFor, oModel,
					oNavigationPossible);
				// read will trigger the initialisation as needed
				return;
			} else if (oNavigationPossible.aNavigablePages && oNavigationPossible.aNavigablePages[0] && oNavigationPossible.aNavigablePages[0].bNavigationWithTechnicalKeyPossible) {
				if (oStartupParameters.IsActiveEntity && oStartupParameters.IsActiveEntity[0] === "false" &&
					oStartupParameters.DraftUUID && oStartupParameters.DraftUUID[0] !== "") {
					//3	Fiori parameter with TK call on existing draftobject but active also exists
					var aKeys = [];
					for (var i = 0; i < oNavigationPossible.aNavigablePages[0].aTechnicalKey.length; i++) {
						var sTechnicalKeyProp = oNavigationPossible.aNavigablePages[0].aTechnicalKey[i] && oNavigationPossible.aNavigablePages[0].aTechnicalKey[
							i].name;
						if (sTechnicalKeyProp === "DraftUUID" ||
							sTechnicalKeyProp === "IsActiveEntity") {
							continue;
						}
						if (oStartupParametersWithEditableFor.hasOwnProperty(sTechnicalKeyProp)) {
							aKeys.push({
								PropertyPath: sTechnicalKeyProp
							});
						}
					}
					var sHash = oModel.createKey(sEntitySet, oStartupParametersWithEditableFor);
					fnReadObject(oNavigationControllerProxy, sEntitySet, aKeys, oStartupParametersWithEditableFor, oModel, oNavigationPossible, sHash);
					// read will trigger the initialisation as needed
					return;
				}
				// Navigation via Technical Key
				var sHash = oModel.createKey(sEntitySet, oStartupParametersWithEditableFor);
				if (sHash) {
					if (oNavigationPossible) {
						var aKeys = [];
						for (var i = 0; i < oNavigationPossible.aNavigablePages[0].aTechnicalKey.length; i++) {
							var sTechnicalKeyProp = oNavigationPossible.aNavigablePages[0].aTechnicalKey[i] && oNavigationPossible.aNavigablePages[0].aTechnicalKey[
								i].name;
							if (sTechnicalKeyProp === "DraftUUID" ||
								sTechnicalKeyProp === "IsActiveEntity") {
								continue;
							}
							if (oStartupParametersWithEditableFor.hasOwnProperty(sTechnicalKeyProp)) {
								aKeys.push({
									PropertyPath: sTechnicalKeyProp
								});
							}
						}
						// sHash is passed in case navigation to Root Object Page is not possible via Semantic Key
						fnReadObject(oNavigationControllerProxy, sEntitySet, aKeys, oStartupParametersWithEditableFor, oModel, oNavigationPossible, sHash);
						return;
					}
					oNavigationControllerProxy.navigate(sHash, true);
				}
			}
			fnInitialiseRouting(oNavigationControllerProxy, oStartupParameters);
		}

		function fnCheckKeys(aKeys, mParams) {
			var i, iLength, bSuccess = false,
				oKey, sKeyProperty;
			if (mParams && aKeys) {
				iLength = aKeys.length;
				for (i = 0; i < iLength; i++) {
					// assume key handling shall be successful
					bSuccess = true;
					oKey = aKeys[i];
					// Keys are located either at name (resource/entity key) or PropertyPath (SemanticKey annotation)
					sKeyProperty = oKey.name || oKey.PropertyPath;
					if (!mParams[sKeyProperty] || mParams[sKeyProperty].length > 1) {
						// if no key params or multiple key params are present set unsuccessful and break
						bSuccess = false;
						break;
					}
				}
			}
			return bSuccess;
		}

		// Recursive function to get the semantic keys for Object Pages and TK only in case of root Object Page
		function fnGetNavigablePages(oModel, oStartupParameters, oMode, aPages, iLevel, aNavigablePages) {
			var oNavigablePageWithSemanticKey, oEntitySet, bAllowDeepLinking, oEntityType, aSemanticKey, oPage, oNavToRootPageWithTechnicalKey;

			for (var i = 0; i < aPages.length; i++) {
				oPage = aPages[i];

				// if page exists, but for the current mode is replaced by external navigation, internal navigation is not allowed
				if (oPage && oPage.navigation && oPage.navigation[oMode.mode]) {
					continue;
				}
				oEntitySet = oModel.getMetaModel().getODataEntitySet(oPage.entitySet);

				// if the setting:allowDeepLinking is not true, then navigation is not possible
				bAllowDeepLinking = oPage.component && oPage.component.settings && oPage.component.settings.allowDeepLinking;

				if (!oEntitySet || !(iLevel === 0 || bAllowDeepLinking)) { // iLevel = 0 is used to identify if the current page is Root Object Page. allowDeepLinking is always true for root Object Page
					continue;
				}
				oEntityType = oModel.getMetaModel().getODataEntityType(oEntitySet.entityType);

				aSemanticKey = oEntityType["com.sap.vocabularies.Common.v1.SemanticKey"];
				oNavigablePageWithSemanticKey = {};
				oNavToRootPageWithTechnicalKey = {};
				if (aSemanticKey && fnCheckKeys(aSemanticKey, oStartupParameters)) {
					oNavigablePageWithSemanticKey["sEntitySet"] = oPage.entitySet;
					oNavigablePageWithSemanticKey["aSemanticKey"] = aSemanticKey;
					oNavigablePageWithSemanticKey["sNavigationProperty"] = oPage.navigationProperty;
					oNavigablePageWithSemanticKey["iLevel"] = iLevel; // iLevel is used to identify the Object page level in the manifest
					aNavigablePages.push(oNavigablePageWithSemanticKey);
				} else { // TK is used for compatibility reasons only for Root Object Page
					if (oEntityType.key.propertyRef && (iLevel === 0) && fnCheckKeys(oEntityType.key.propertyRef, oStartupParameters)) {
						oNavToRootPageWithTechnicalKey.bNavigationWithTechnicalKeyPossible = fnCheckKeys(oEntityType.key.propertyRef, oStartupParameters);
						oNavToRootPageWithTechnicalKey.aTechnicalKey = oEntityType.key.propertyRef;
						aNavigablePages.push(oNavToRootPageWithTechnicalKey);
					}
				}
				if (oPage.pages) { // if pages exist, recurse till deepest level is found
					fnGetNavigablePages(oModel, oStartupParameters, oMode, oPage.pages, ++iLevel, aNavigablePages);
				} else { // if the current ObjectPage does not have nested pages then we break and navigate to the page stored in current iteration. We do not check for other pages.
					break;
				}
			}
			return aNavigablePages;
		}

		function fnCheckNavigation(oModel, oNavigationControllerProxy, sEntitySet, oStartupParameters, oMode) {
			var result = {},
				aPages = [],
				aNavigablePages = [];
			// if page exists, but for the current mode is replaced by external navigation, internal navigation is not allowed
			var oConfig = oNavigationControllerProxy.oAppComponent.getConfig();
			aPages = oConfig.pages && oConfig.pages[0] && oConfig.pages[0].pages; //aPages stores all object pages at the first level i.e. level below LR
			if (!aPages) {
				return {};
			}
			aNavigablePages = fnGetNavigablePages(oModel, oStartupParameters, oMode, aPages, 0, aNavigablePages);
			result.aNavigablePages = aNavigablePages;
			return result;
		}

		function fnPrepareCreate(oNavigationControllerProxy) {
			var oGlobalModel = oNavigationControllerProxy.oAppComponent.getModel("_templPrivGlobal");
			oGlobalModel.setProperty("/generic/forceFullscreenCreate", true);
		}

		function fnTransformEdmGuidParams(oModel, sEntitySet, oStartupParameters) {
			var oDataMetaModel, oEntitySet, sEntityType, oEntityType, aEntityTypeProperties, aPropertiesOfTypeGuid, i, oProperty, j, sGuid,
				iEntityTypeLength;
			if (isEmptyObject(oStartupParameters)) {
				return;
			}
			oDataMetaModel = oModel && oModel.getMetaModel();
			oEntitySet = oDataMetaModel && oDataMetaModel.getODataEntitySet(sEntitySet);
			sEntityType = oEntitySet && oEntitySet.entityType;
			oEntityType = oDataMetaModel && oDataMetaModel.getODataEntityType(sEntityType);
			aEntityTypeProperties = oEntityType && oEntityType.property;
			aPropertiesOfTypeGuid = [];
			iEntityTypeLength = aEntityTypeProperties && aEntityTypeProperties.length;
			for (i = 0; i < iEntityTypeLength; i++) {
				oProperty = aEntityTypeProperties[i];
				if (oProperty["type"] === "Edm.Guid") {
					aPropertiesOfTypeGuid.push(oProperty["name"]);
				}
			}
			//transform the Edm.Guid parameter
			for (j = 0; j < aPropertiesOfTypeGuid.length; j++) {
				if (!oStartupParameters[aPropertiesOfTypeGuid[j]]) {
					continue;
				}
				sGuid = oStartupParameters[aPropertiesOfTypeGuid[j]][0];
				sGuid = sGuid.toLowerCase().replace(/(guid')([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(')/, "$2");
				if (!sGuid.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)) {
					// assume legacy guid
					sGuid = sGuid.replace(/([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})/, "$1-$2-$3-$4-$5");
				}
				oStartupParameters[aPropertiesOfTypeGuid[j]][0] = sGuid;
			}
		}

		function getCreateParameters(oNavigationControllerProxy){
			var oInbounds = oNavigationControllerProxy.oAppComponent.getInboundParameters();
			return oInbounds ? Object.keys(oInbounds).filter(function(sParameter){
				return oInbounds[sParameter].useForCreate;
			}) : [];
		}

		function fnStartupParameters2PredefinedValuesForCreate(oNavigationControllerProxy, oStartupParameters){
			var oRet;
			var aCreateParameters = getCreateParameters(oNavigationControllerProxy);
			for (var i = 0; i < aCreateParameters.length; i++){
				var sCreateParameter = aCreateParameters[i];
				var aValues = oStartupParameters[sCreateParameter];
				if (aValues && aValues.length === 1){
					oRet = oRet || Object.create(null);
					oRet[sCreateParameter] = aValues[0];
				}
			}
			return oRet;
		}

		function fnProcessEditableFieldFor(oMetaModel, sEntitySet, oStartupParameters){
			// easiest solution to handle different possible usage of forEdit fields: provide a given value always in both fields
			// alternative solution: only check the other property at the places of usage, i.e.
			// - when checking navigable pages, check for values in the field, that is not part of semantic key
			// - when providing vlaues for SFB, check for values in the field, that is no selection field
			// todo: clarify, which solution would be better
			var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
			oEntityType.property.forEach(function(oProperty){
				if (oProperty["com.sap.vocabularies.Common.v1.EditableFieldFor"]){
					var sKeyProperty = oProperty["com.sap.vocabularies.Common.v1.EditableFieldFor"].String;
					var sForEditProperty = oProperty.name;
					// map key fields to corresponding for edit properties to provide values in SFB (without mapping in FLP)
					if (oStartupParameters[sKeyProperty] && !oStartupParameters[sForEditProperty]){
						oStartupParameters[sForEditProperty] = oStartupParameters[sKeyProperty];
					}
					// and vice versa to support navigation to object page if field is mapped in FLP (formerly recommend)
					if (oStartupParameters[sForEditProperty] && !oStartupParameters[sKeyProperty] ){
						oStartupParameters[sKeyProperty] = oStartupParameters[sForEditProperty];
					}
				}
			});
		}

		/* checks the startup parameters for triggering navigation
		 * Note: this function is only called when sEntitySet and oStartupParameters are truthy
		 */
		function fnProcessStartupParameters(oNavigationControllerProxy, sEntitySet, oStartupParameters) {
			var oManifestEntryGenricApp = oNavigationControllerProxy.oAppComponent.getConfig();
			var oModel;
			// wait for the ODataMetaModel to be loaded
			oModel = oNavigationControllerProxy.oAppComponent.getModel();
			oModel.attachMetadataFailed(oNavigationControllerProxy.fnInitializationResolve);
			oModel.getMetaModel().loaded().then(function() {
				var oEntitySet;
				// get all properties of type Edm.guid from the entityType and transform the strings if needed
				fnTransformEdmGuidParams(oModel, sEntitySet, oStartupParameters);

				// map EditableFieldFor to support navigation szenarios to LR (fill filters) and OP (provide semantic key)
//				fnProcessEditableFieldFor(oModel.getMetaModel(), sEntitySet, oStartupParameters);

				var sPreferredMode = oStartupParameters.preferredMode && oStartupParameters.preferredMode[0];
				var sMode = oStartupParameters.mode && oStartupParameters.mode[0];
				var oMode = fnCombineMode(sPreferredMode, sMode);

				switch (oMode.mode) {
					case "create":
						fnPrepareCreate(oNavigationControllerProxy);
						//Added to perform intentbased navigation from 1 app to another app's creationEntitySet's create page.
						var sCreationEntitySet = (oManifestEntryGenricApp.pages[0] &&
											oManifestEntryGenricApp.pages[0].component &&
													oManifestEntryGenricApp.pages[0].component.settings &&
														oManifestEntryGenricApp.pages[0].component.settings.creationEntitySet);
							sEntitySet = sCreationEntitySet || sEntitySet;
						var oPredefinedValues = fnStartupParameters2PredefinedValuesForCreate(oNavigationControllerProxy, oStartupParameters);
						var oCreatePromise = CRUDHelper.create(oNavigationControllerProxy.oAppComponent
							.getTransactionController().getDraftController(), sEntitySet, "/" + sEntitySet, oModel, oNavigationControllerProxy.oTemplateContract
							.oApplicationProxy, oPredefinedValues);

						oCreatePromise.then(function(oContext) {
							oNavigationControllerProxy.navigateToContext(oContext, "", true, 4).then(fnInitialiseRouting.bind(null,
								oNavigationControllerProxy, oStartupParameters));
						}, function(oError) {
							fnInitialiseRouting(oNavigationControllerProxy, oStartupParameters);
							oNavigationControllerProxy.navigateToMessagePage({
								title: oNavigationControllerProxy.oTemplateContract.getText("ST_GENERIC_ERROR_TITLE"),
								text: oError.messageText,
								description: "",
								icon: "sap-icon://message-error"
							});
						});
						oNavigationControllerProxy.oTemplateContract.oBusyHelper.setBusy(oCreatePromise, true);
						break;

						//Create with context
					case "createWithContext":
						fnPrepareCreate(oNavigationControllerProxy);
						var oCreateWithContextPromise = new Promise(function(fnResolve, fnReject){
							var fnHandleError = function(oError){
								fnReject();
								fnInitialiseRouting(oNavigationControllerProxy, oStartupParameters);
								oNavigationControllerProxy.navigateToMessagePage({
									title: oNavigationControllerProxy.oTemplateContract.getText("ST_ERROR"),
									text: (oError && oError.messageText) || oNavigationControllerProxy.oTemplateContract.getText("ST_GENERIC_UNKNOWN_NAVIGATION_TARGET"),
									icon: "sap-icon://message-error",
									description: ""
								});
							};
							oEntitySet = oModel.getMetaModel().getODataEntitySet(sEntitySet);
							var oDraftRoot = oEntitySet["com.sap.vocabularies.Common.v1.DraftRoot"];
							if (oDraftRoot && oDraftRoot.NewAction) {
								var oFunctionImport = oModel.getMetaModel().getODataFunctionImport(oDraftRoot.NewAction.String.split("/")[1]);
								var oUrlParameters = {};
								if (oFunctionImport) {
									var iLength = oFunctionImport.parameter ? oFunctionImport.parameter.length : 0;
									for (var i = 0; i < iLength; i++) {
										var oParameter = oFunctionImport.parameter[i];
										if (oParameter.mode === "In" && oStartupParameters[oParameter.name] && oStartupParameters[oParameter.name][0]) {
											oUrlParameters[oParameter.name] = oStartupParameters[oParameter.name][0];
										}
									}
									oModel.callFunction("/" + oFunctionImport.name, {
										success: function(oData, oResponse) {
											var oModelUtil = new ModelUtil(oModel);
											var oContext = oModelUtil.getContextFromResponse(oData);
											if (oContext) {
												fnResolve();
												oNavigationControllerProxy.navigateToContext(oContext, null, true, 4).then(fnInitialiseRouting.bind(null,
													oNavigationControllerProxy, oStartupParameters));
											} else {
												fnHandleError();
											}
										},
										error: fnHandleError,
										method: "POST",
										urlParameters: oUrlParameters
									});
								} else {
									fnHandleError();
								}
							} else {
								fnHandleError();
							}
						});
						oNavigationControllerProxy.oTemplateContract.oBusyHelper.setBusy(oCreateWithContextPromise, true);
						break;

					case "edit":
						// App opens with an edit view, if there is a draft...if not, creates a draft
						var oStartupParametersWithEditableFor = extend({}, oStartupParameters);
						fnProcessEditableFieldFor(oModel.getMetaModel(), sEntitySet, oStartupParametersWithEditableFor);
						var oNavigationPossible = fnCheckNavigation(oModel, oNavigationControllerProxy, sEntitySet,
								oStartupParametersWithEditableFor, oMode);
						if (oNavigationPossible.aNavigablePages && oNavigationPossible.aNavigablePages[0] &&
							(oNavigationPossible.aNavigablePages[0].bNavigationWithTechnicalKeyPossible ||
								(oNavigationPossible.aNavigablePages[0].aSemanticKey && oNavigationPossible.aNavigablePages[0].iLevel === 0))) {
							var sBindingPath = "";
							var oEditPromise;
							if (oNavigationPossible.aNavigablePages[0].bNavigationWithTechnicalKeyPossible) {
								sBindingPath = oModel.createKey(sEntitySet, oStartupParametersWithEditableFor);
								oEditPromise = CRUDHelper.edit(
									oNavigationControllerProxy.oAppComponent.getTransactionController(), sEntitySet,
									"/" + sBindingPath, oModel,
									oNavigationControllerProxy.oTemplateContract,
									oNavigationControllerProxy.fnInitializationResolve);
							} else if (oNavigationPossible.aNavigablePages && oNavigationPossible.aNavigablePages[0] && oNavigationPossible.aNavigablePages[0]
								.aSemanticKey && oNavigationPossible.aNavigablePages[0].iLevel === 0) {
								sBindingPath = "";
								oEditPromise = CRUDHelper.edit(
									oNavigationControllerProxy.oAppComponent.getTransactionController(),
									sEntitySet,
									sBindingPath, oModel,
									oNavigationControllerProxy.oTemplateContract,
									oNavigationControllerProxy.fnInitializationResolve,
									oNavigationPossible.aNavigablePages[0].aSemanticKey, oStartupParametersWithEditableFor);
							}

							oEditPromise.then(function(oResult) {
								oNavigationControllerProxy.navigate(oResult.context.getPath(), true);
								fnInitialiseRouting(oNavigationControllerProxy);
							}, function(oError) {
								if (oError.lockedByUser) {
									if (!oMode.force) {
										fnDefaultNavigationProcessing(oModel, oNavigationControllerProxy, sEntitySet,
											oStartupParameters, oMode);
									} else {
										oNavigationControllerProxy.fnInitializationResolve(); // to finish busyIndicator
										// before
										oNavigationControllerProxy.navigateToMessagePage({
											title: oNavigationControllerProxy.oTemplateContract
												.getText("LOCKED_OBJECT_POPOVER_TITLE"),
											text: oNavigationControllerProxy.oTemplateContract
												.getText("LOCKED_OBJECT_POPOVER_TITLE"),
											description: oNavigationControllerProxy.oTemplateContract.getText(
												"ST_GENERIC_LOCKED_OBJECT_POPOVER_TEXT", [oError.lockedByUser]),
											icon: "sap-icon://message-error",
											replaceURL: true
										});
									}
								} else if (oError.draftAdminReadResponse) {
									fnInitialiseRouting(oNavigationControllerProxy, oStartupParameters);
									/*
									oNavigationControllerProxy.fnInitializationResolve(); // to finish busyIndicator before
									oNavigationControllerProxy
									.navigateToMessagePage({
										title: oNavigationControllerProxy.oTemplateContract
										.getText("ST_GENERIC_ERROR_TITLE"),
										text: oNavigationControllerProxy.oTemplateContract
										.getText("ST_GENERIC_ERROR_SYSTEM_UNAVAILABLE"),
										description: oNavigationControllerProxy.oTemplateContract
										.getText("ST_GENERIC_ERROR_SYSTEM_UNAVAILABLE_DESC"),
										icon: "sap-icon://message-error",
										replaceURL: true
									});*/
								} else {
									// in case user is not authorized to edit object HTTP400. Show popup and navigate to active object
									var oPopupText = oNavigationControllerProxy.oTemplateContract.getText("ST_GENERIC_ERROR_NOT_AUTORIZED_EDIT");
									MessageBox.warning(
										oPopupText, {
											onClose: function(sAction) {
												fnDefaultNavigationProcessing(
													oModel,
													oNavigationControllerProxy,
													sEntitySet,
													oStartupParameters, {
														mode: "display",
														force: false
													});
											}
										});
								}
							});
						} else {
							fnInitialiseRouting(oNavigationControllerProxy, oStartupParameters);
						}
						break;

					case "display":
						fnDefaultNavigationProcessing(oModel, oNavigationControllerProxy, sEntitySet, oStartupParameters, oMode);
						break;

					default: // including case "unsupported"
						oNavigationControllerProxy.fnInitializationResolve(); // to finish busyIndicator before showing error page
						oNavigationControllerProxy.navigateToMessagePage({
							title: oNavigationControllerProxy.oTemplateContract.getText("ST_GENERIC_ERROR_TITLE"),
							text: oNavigationControllerProxy.oTemplateContract.getText("ST_GENERIC_ERROR_TITLE"),
							description: oNavigationControllerProxy.oTemplateContract.getText("PARAMETER_COMBINATION_NOT_SUPPORTED", [sMode, sPreferredMode]),
							icon: "sap-icon://message-error",
							replaceURL: true
						});
				}
			});
		}
		// - End methods for processing the startup parameters

		// The function exposed by this class: Startup the router
		function fnStartupRouter(oNavigationControllerProxy) {

			// check the manifest.json for the flexibleColumnLayout
			var oFCLSettings = oNavigationControllerProxy.oAppComponent.getFlexibleColumnLayout();
			if (oFCLSettings) {
				oNavigationControllerProxy.oTemplateContract.oFlexibleColumnLayoutHandler = new FlexibleColumnLayoutHandler(
					oNavigationControllerProxy.oTemplateContract.oNavigationHost, oNavigationControllerProxy
				);
			}
			var sEntitySet = generateRoutingMetadataAndGetRootEntitySet(oNavigationControllerProxy);
			var oData = oNavigationControllerProxy.oAppComponent.getComponentData();
			var oStartupParameters = oData && oData.startupParameters;
			// check if there entitySet and startup parameters are present and no hash exists!
			if (sEntitySet && oStartupParameters && !oNavigationControllerProxy.oHashChanger.getHash()) {
				fnProcessStartupParameters(oNavigationControllerProxy, sEntitySet, oStartupParameters);
			} else {
				fnInitialiseRouting(oNavigationControllerProxy);
			}
		}

		/*
		 * get the navigation path from binding context
		 * @param {Object} oTargetContext - the binding context
		 * @param {string} sNavigationProperty - the navigation property that should replace the entity
		 * @returns {string} the resolved path
		 */
		function fnDetermineNavigationPath(oTargetContext, sNavigationProperty) {
			var sPath, aPath, sEntitySet;
			// Get the path from binding context without "/"
			sPath = oTargetContext.getPath().substring(1);
			// Get the entityset from path
			aPath = sPath.split("(");
			sEntitySet = aPath[0];
			var sKey = aPath[1].substring(0, aPath[1].length - 1); // remove the closing )

			// Replace the entitySet with navigationProperty in the path, if it is specified
			if (sNavigationProperty) {
				sPath = sPath.replace(sEntitySet, sNavigationProperty);
				if (sPath.indexOf("/") === 0) {
					sPath = sPath.substring(1);
				}
			}
			return {
				entitySet: sEntitySet,
				path: sPath,
				key: sKey
			};
		}

		// Expose selected private functions to unit tests
		//
		/* eslint-disable */
		var generateRoutingMetadataAndGetRootEntitySet = testableHelper.testableStatic(generateRoutingMetadataAndGetRootEntitySet,
			"routingHelpergenerateRoutingMetadataAndGetRootEntitySet");
		var fnInitialiseRouting = testableHelper.testableStatic(fnInitialiseRouting, "routingHelper_initialiseRouting");
		var fnReadObject = testableHelper.testableStatic(fnReadObject, "routingHelper_readObject");
		var fnProcessStartupParameters = testableHelper.testableStatic(fnProcessStartupParameters, "routingHelper_processStartupParameters");
		var fnTransformEdmGuidParams = testableHelper.testableStatic(fnTransformEdmGuidParams, "routingHelper_transformStartupGuidParameters");
		/* eslint-enable */

		return {
			startupRouter: fnStartupRouter,
			determineNavigationPath: fnDetermineNavigationPath,
			readObjectProcessResults: fnReadObjectProcessResults
		};
	});
