/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2018 SAP SE. All rights reserved
*/
/**
  * APF Custom Tree Control
  */

sap.ui.define([
	'sap/apf/modeler/ui/utils/constants',
	'sap/m/Tree',
	'sap/m/TreeRenderer'
], function(constants, Tree, TreeRenderer){
	'use strict';

	/**
	 * @private
	 * @class APF Custom Tree
	 * @description APF Custom Tree which exposes certain API's to perform different operations on the tree
	 * @name sap.apf.modeler.ui.utils.APFTree
	 */
	var APFTree = Tree.extend("sap.apf.modeler.ui.utils.APFTree", {
		metadata : {
			events : {},
			properties : {
				translationFunction : {},
				defaultRepresentationType : {},
				applicationId : {}
			}
		},
		previousSelectedItem : null,
		renderer : function(oControl, oRM) {
			TreeRenderer.render(oControl, oRM);
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#setTranslationFunction
		 * @param {sap.apf.modeler.core.Instance.getText} Function to get translated texts
		 * @description Setter for TranslationFunction property which is used to get the translated texts
		 * */
		setTranslationFunction : function(fnTranslationFunction) {
			this.fnTranslationFunction = fnTranslationFunction;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#setDefaultRepresentationType
		 * @param {String} Default representation type
		 * @description Setter for DefaultRepresentationType property which is used to set the default representation
		 * */
		setDefaultRepresentationType : function(sDefaultRepresentationType) {
			this.defaultRepresentationType = sDefaultRepresentationType;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#setApplicationId
		 * @param {String} Application ID
		 * @description Setter for Application ID which is used in model of each configuration
		 * */
		setApplicationId : function(applicationId) {
			this.applicationId = applicationId;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#getAPFTreeNodeContext
		 * @param {sap.ui.commons.TreeNode} Tree Node - Tree node whose context has to be derived
		 * @description Gets the context of the node
		 * */
		getAPFTreeNodeContext : function(oNode) {
			if (oNode) {
				var oNodeContext = oNode ? oNode._getBindingContext() : undefined;
				var sObjectType = oNodeContext.getObject() ? oNodeContext.getObject().type : undefined;
				var sObjectId;
				if (oNodeContext.getObject() && oNodeContext.getObject().id) {
					sObjectId = oNodeContext.getObject().id;
				} else if (oNodeContext.getObject() && oNodeContext.getObject().AnalyticalConfiguration) {
					sObjectId = oNodeContext.getObject().AnalyticalConfiguration;
				}
				return {
					oNode : oNode,
					nodeContext : oNodeContext.sPath,
					nodeObjectType : sObjectType,
					nodeTitle : oNode.getTitle(),
					nodeAPFId : sObjectId
				};
			}
			return null;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#getItemNodeByContext
		 * @param {sap.m.StandardTreeItem} Tree Item - tree node is derived using the spath
		 * @description Gets the node of tree using the spath passed
		 * */
		 getItemNodeByContext : function(sPath){
		 	var noOfExpandLevel = this.getNumberOfExpandedLevel();
		 	var tree = this;
			var oSpath = sPath.split("/");
			switch(oSpath.length){
				case 3: //Configuration
					tree.expandToLevel(0);
					break;
                case 7: //Category, filters, Navigation Target
                	tree.expandToLevel(2); 
                	break;
                case 9: //Step
                	tree.expandToLevel(3); 
                	break;
                case 11: //representation
                	tree.expandToLevel(4);
                	break;
			    }
            for (var nodeLen = 0; nodeLen < this.getItems().length; nodeLen++) { 
                      var item = this.getItems()[nodeLen];
                      var objectType = item._getBindingContext().getObject().type; 
                      if (item._getBindingContext().sPath === sPath){
                    	 // tree.expandToLevel(noOfExpandLevel);
                           return item;
                }
             }
           return null;
		 },
			/**
			 * @private
			 * @function
			 * @name sap.apf.modeler.ui.utils.APFTree#getItemNodeByContextWithoutExpand 
			 * @param {sap.m.StandardTreeItem} Tree Item - tree node is derived using the spath
			 * @description Gets the node of tree using the spath passed
			 * */
			 getItemNodeByContextWithoutExpand : function(sPath){
	            for (var nodeLen = 0; nodeLen < this.getItems().length; nodeLen++) { 
	                      var item = this.getItems()[nodeLen];
	                      var objectType = item._getBindingContext().getObject().type; 
	                      if (item._getBindingContext().sPath === sPath){
	                           return item;
	                }
	             }
	           return null;
			 },
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#getParentNodeContext
		 * @param {sap.ui.commons.TreeNode} Tree Node - Tree node whose context has to be derived
		 * @description Gets the context of the parent node
		 * */
		getParentNodeContext : function(oSelectedNodeDetails) {
			var oModel = this.getModel();
			if (oSelectedNodeDetails !== null) {
				var configIndexInTree = oSelectedNodeDetails.nodeContext.split('/')[2];
				var configurationId = oModel.getData().aConfigDetails[configIndexInTree] ? oModel.getData().aConfigDetails[configIndexInTree].AnalyticalConfiguration : undefined;
				var oRepresentationNode;
				var categoryIndexInConfig = oSelectedNodeDetails.nodeContext.split('/')[6];
				var filterIndexInConfig = oSelectedNodeDetails.nodeContext.split('/')[6];
				var navTargetIndexInConfig = oSelectedNodeDetails.nodeContext.split('/')[6];
				var stepIndexInCategory = oSelectedNodeDetails.nodeContext.split('/')[8];
				var oSelectedNodeParentDetails = {};
				if (oSelectedNodeDetails !== null) {
					switch (oSelectedNodeDetails.nodeObjectType) { // based on the object type get the parent nodes
						case constants.configurationObjectTypes.FACETFILTER:
							oSelectedNodeParentDetails.facetFilterId = oModel.getData().aConfigDetails[configIndexInTree].configData[0].filters[filterIndexInConfig].id;
							oSelectedNodeParentDetails.configId = configurationId;
							oSelectedNodeParentDetails.configurationName = oModel.getData().aConfigDetails[configIndexInTree].name;
							oSelectedNodeParentDetails.facetFilterName = oModel.getData().aConfigDetails[configIndexInTree].configData[0].filters[filterIndexInConfig].name;
							break;
						case constants.configurationObjectTypes.SMARTFILTERBAR:
							oSelectedNodeParentDetails.smartFilterId = oModel.getData().aConfigDetails[configIndexInTree].configData[0].filters[filterIndexInConfig].id;
							oSelectedNodeParentDetails.configId = configurationId;
							oSelectedNodeParentDetails.configurationName = oModel.getData().aConfigDetails[configIndexInTree].name;
							oSelectedNodeParentDetails.smartFilterName = oModel.getData().aConfigDetails[configIndexInTree].configData[0].filters[filterIndexInConfig].name;
							break;
						case constants.configurationObjectTypes.CATEGORY:
							if (oModel.getData().aConfigDetails[configIndexInTree].configData != undefined){
							oSelectedNodeParentDetails.categoryId = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].id;
							oSelectedNodeParentDetails.configId = configurationId;
							oSelectedNodeParentDetails.configurationName = oModel.getData().aConfigDetails[configIndexInTree].name;
							oSelectedNodeParentDetails.categoryName = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].name;
							}
							break;
						case constants.configurationObjectTypes.STEP:
							oSelectedNodeParentDetails.configId = configurationId;
							oSelectedNodeParentDetails.categoryId = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].id;
							oSelectedNodeParentDetails.stepId = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps[stepIndexInCategory].id;
							oSelectedNodeParentDetails.configurationName = oModel.getData().aConfigDetails[configIndexInTree].name;
							oSelectedNodeParentDetails.categoryName = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].name;
							oSelectedNodeParentDetails.stepName = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps[stepIndexInCategory].name;
							break;
						case constants.configurationObjectTypes.REPRESENTATION:
							oRepresentationNode = oSelectedNodeDetails.oNode;
							oSelectedNodeParentDetails.configId = configurationId;
							oSelectedNodeParentDetails.categoryId = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].id;
							oSelectedNodeParentDetails.stepId = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps[stepIndexInCategory].id;
							oSelectedNodeParentDetails.representationId = oRepresentationNode._getBindingContext().getObject().id;
							oSelectedNodeParentDetails.configurationName = oModel.getData().aConfigDetails[configIndexInTree].name;
							oSelectedNodeParentDetails.categoryName = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].name;
							oSelectedNodeParentDetails.stepName = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps[stepIndexInCategory].name;
							oSelectedNodeParentDetails.representationName = oRepresentationNode._getBindingContext().getObject().name;
							break;
						case constants.configurationObjectTypes.CONFIGURATION:
							oSelectedNodeParentDetails.configId = oSelectedNodeDetails.oNode._getBindingContext().getObject().AnalyticalConfiguration;
							oSelectedNodeParentDetails.configurationName = oSelectedNodeDetails.oNode._getBindingContext().getObject().name;
							break;
						case constants.configurationObjectTypes.NAVIGATIONTARGET:
							oSelectedNodeParentDetails.navTargetId = oModel.getData().aConfigDetails[configIndexInTree].configData[2].navTargets[navTargetIndexInConfig].id;
							oSelectedNodeParentDetails.configId = configurationId;
							oSelectedNodeParentDetails.configurationName = oModel.getData().aConfigDetails[configIndexInTree].name;
							oSelectedNodeParentDetails.navTargetName = oModel.getData().aConfigDetails[configIndexInTree].configData[2].navTargets[navTargetIndexInConfig].name;
							break;
						default:
							break;
					}
					if (oModel.getData().aConfigDetails && oModel.getData().aConfigDetails[configIndexInTree]) {
						oSelectedNodeParentDetails.appId = oModel.getData().aConfigDetails[configIndexInTree].Application;
					}
				}
				return oSelectedNodeParentDetails;
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#isConfigurationSwitched
		 * @param {sap.ui.commons.TreeNode} Tree Node - Previous selected node on the tree
		 * @param {sap.ui.commons.TreeNode} Tree Node - Current selected node on the tree
		 * @description Checks whether a configuration switch has happened
		 * @returns {Boolean} Returns boolean specifying whether configuration switch has happened
		 * */
		isConfigurationSwitched : function(oPreviousSelectedNode, oCurrentSelectedNode) {
			var bIsDifferntConfig = false, oPrevSelectedNodeConfigID, indexOfConfig;
			var oPreviousSelectedNodeParentDetails = this.getParentNodeContext(this.getAPFTreeNodeContext(oPreviousSelectedNode));
			var oCurrentSelectedNodeParentDetails = this.getParentNodeContext(this.getAPFTreeNodeContext(oCurrentSelectedNode));
			oPrevSelectedNodeConfigID = oPreviousSelectedNodeParentDetails ? oPreviousSelectedNodeParentDetails.configId : undefined;
			// Additional checks to get configId of previous selected node in case it was deleted: Deleted tree nodes lose relevant context information and therefore APFTree model used to get configId in that case
			if (oPreviousSelectedNodeParentDetails && !jQuery.isEmptyObject(oPreviousSelectedNodeParentDetails) && oPreviousSelectedNodeParentDetails.configId === undefined) {
				indexOfConfig = this.getAPFTreeNodeContext(oPreviousSelectedNode).nodeContext.split("/")[2];
				oPrevSelectedNodeConfigID = this.getModel().getData().aConfigDetails[indexOfConfig].AnalyticalConfiguration;
			}
			if (oPrevSelectedNodeConfigID !== undefined && oPrevSelectedNodeConfigID !== oCurrentSelectedNodeParentDetails.configId) {
				bIsDifferntConfig = true;
			}
			return bIsDifferntConfig;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#removeSelection
		 * @param {sap.ui.commons.TreeNode} Tree Node - Current selection on the tree
		 * @description Removes all the selection from the tree
		 * */
		removeSelectionOnTree : function(oSelectedNode) {
			var oSelectionOnTree = this.getSelectedItem();
			if (oSelectedNode) {
				oSelectedNode._getBindingContext().getObject().isSelected = false;
				oSelectedNode.setSelected(false);
			} else if (oSelectionOnTree) {
				oSelectionOnTree._getBindingContext().getObject().isSelected = false;
				oSelectionOnTree.setSelected(false);
			}
			this.getModel().updateBindings();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#setSelection
		 * @param {String} Binding context of the node which has to be shown selected on the tree
		 * @description Sets selection on the tree
		 * */
		setSelectionOnTree : function(sBindingContextOfSelectedNode) {
			this.selectedNode = this.getItemNodeByContextWithoutExpand(sBindingContextOfSelectedNode);
			var oSelectionOnTree = this.getSelectedItem();
			if (oSelectionOnTree !== this.selectedNode) {
				if (oSelectionOnTree && oSelectionOnTree._getBindingContext().getObject()) {
					oSelectionOnTree.getBindingContext().getObject().isSelected = false;
					oSelectionOnTree.setSelected(false);
				}
				this.setSelectedItem(this.selectedNode);
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#_scrollTreeToNewNode
		 * @param {sap.ui.commons.TreeNode} New added node in the tree
		 * @description Sets the scroll position to the newly added node
		 * */
		_scrollTreeToNewNode : function(oNewAddedTreeNode) {
			if (oNewAddedTreeNode && oNewAddedTreeNode.$().length !== 0) {
				jQuery(oNewAddedTreeNode.$())[0].scrollIntoView();
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#setSelectedNode
		 * @param {sap.ui.commons.TreeNode} Tree node which has to be selected
		 * @description Sets node as selected in the tree
		 * */
		setSelectedNode : function(oNode) {
			this.setSelectedItem(oNode.getItemNodeContext());
			this.getModel().updateBindings();
			this._scrollTreeToNewNode(oNode);
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#addNodeInTree
		 * @param {String} Selected Object node type
		 * @param {Object} Existing Steps Or Representations in existing steps to be added
		 * @param {String} boolean bIsHierarchicalStep to check if the step is a hierarchy step
		 * @description Adds selected object type node into the tree
		 * */
		addNodeInTree : function(sObjectType, params, bIsHierarchicalStep) {
			var sMethodName;
			var selectedTreeNodeDetails = this.getAPFTreeNodeContext(this.getSelectedItem());
			var configIndexInTree = selectedTreeNodeDetails ? selectedTreeNodeDetails.nodeContext.split('/')[2] : undefined;
			var categoryIndexInConfig = selectedTreeNodeDetails ? selectedTreeNodeDetails.nodeContext.split('/')[6] : undefined;
			var stepIndexInCategory = selectedTreeNodeDetails ? selectedTreeNodeDetails.nodeContext.split('/')[8] : undefined;
			sMethodName = [ "_add", sObjectType ].join("");
			this[sMethodName](configIndexInTree, categoryIndexInConfig, stepIndexInCategory, params, bIsHierarchicalStep);
			var aObjectArray = this._getObjectNodesArray(sObjectType, configIndexInTree, categoryIndexInConfig, stepIndexInCategory);
			var newAddedTreeNode = aObjectArray[aObjectArray.length - 1];
			if(newAddedTreeNode !== undefined){
			if (sObjectType !== constants.configurationObjectTypes.CONFIGURATION) {
				this.onItemExpanderPressed(newAddedTreeNode, true);
			}
			this.setSelectedItem(newAddedTreeNode);
			}
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#_getObjectNodesArray
		 * @param {String} Selected Object node type
		 * @param {Integer} Selected configuration index in tree
		 * @param {Integer} Selected category index in tree
		 * @param {Integer} Selected step index in tree
		 * @description Get array of nodes of selected object type
		 * @returns {Array} Returns an array of nodes of selected object type
		 * */
		_getObjectNodesArray : function(sObjectType, configIndexInTree, categoryIndexInConfig, stepIndexInCategory) {
			var aObjectArray = [];
			switch (sObjectType) {
				case constants.configurationObjectTypes.CONFIGURATION:
					aObjectArray = this.getItems();
					break;
				case constants.configurationObjectTypes.FACETFILTER:
					this.expandToLevel(2);
					var id = this.getSelectedItem().getId();
					var res = id.split("-");
					var size = res.length;
					var index = res[size-1];
		            var filtersLength = this.getItems()[parseInt(index)+1].getItemNodeContext().children.length;
		            if(this.getItems()[parseInt(index)+1].getItemNodeContext().context.sPath === "/aConfigDetails/"+configIndexInTree+"/configData/0"){
		            for(var i = 1; i < filtersLength; i++) {
		               aObjectArray.push(this.getItems()[parseInt(index)+1+i]);
		             }
		            }
		            this.expandToLevel(1);
					break;
				case constants.configurationObjectTypes.CATEGORY:
					this.expandToLevel(2);
					var id = this.getSelectedItem().getId();
					var res = id.split("-");
					var size = res.length;
					var index = res[size-1];
					if(this.getItems()[parseInt(index)+1].getItemNodeContext().context.sPath === "/aConfigDetails/"+configIndexInTree+"/configData/0"){
		            var filtersLength = this.getItems()[parseInt(index)+1].getItemNodeContext().children.length;
		            var categoryIndex = parseInt(index)+2+filtersLength;
		            var categoryLength = this.getItems()[parseInt(categoryIndex)].getItemNodeContext().children.length;
		            for(var i = 1; i < categoryLength; i++) {
		               aObjectArray.push(this.getItems()[parseInt(categoryIndex)+1+i]);
		             }
		            }
					this.expandToLevel(1);
					break;
				case constants.configurationObjectTypes.STEP:
					/*this.expandToLevel(3);
					var id = this.getSelectedItem().getId();
					var res = id.split("-");
					var size = res.length;
					var index = res[size-1];
					if(this.getItems()[parseInt(index)+1].getItemNodeContext().context.sPath === "/aConfigDetails/"+configIndexInTree+"/configData/0"){
		            var filtersLength = this.getItems()[parseInt(index)+1].getItemNodeContext().children.length;
		            var categoryIndex = parseInt(index)+2+filtersLength;
		            var categoryLength = this.getItems()[categoryIndex].getItemNodeContext().children.length;
		            var stepIndex = categoryIndex + categoryIndexInConfig;
		            var stepLength = this.getItems()[stepIndex].getItemNodeContext().children.length;
		            for(var i = 1; i < stepLength; i++){
		               aObjectArray.push(this.getItems()[stepIndex+1+i]);
		             }
		            }
					this.expandToLevel(0);
					*/
					break;
				case constants.configurationObjectTypes.REPRESENTATION:
					//aObjectArray = this.getNodes()[configIndexInTree].getNodes()[1].getNodes()[categoryIndexInConfig].getNodes()[stepIndexInCategory].getNodes();
					break;
				case constants.configurationObjectTypes.NAVIGATIONTARGET:
					this.expandToLevel(2);
					var id = this.getSelectedItem().getId();
					var res = id.split("-");
					var size = res.length;
					var index = res[size-1];
					if(this.getItems()[parseInt(index)+1].getItemNodeContext().context.sPath === "/aConfigDetails/"+configIndexInTree+"/configData/0"){
		            var filtersLength = this.getItems()[parseInt(index)+1].getItemNodeContext().children.length;
		            var categoryIndex = parseInt(index)+2+filtersLength;
		            var categoryLength = this.getItems()[categoryIndex].getItemNodeContext().children.length;
		            var NavigationIndex = categoryIndex+categoryLength+1;
		            var NavigationLength = this.getItems()[NavigationIndex].getItemNodeContext().children.length;
		            for(var i = 1; i < NavigationLength; i++) {
		               aObjectArray.push(this.getItems()[NavigationIndex+1+i]);
		             }
		            }
				    this.expandToLevel(1);
					break;
				default:
					break;
			}
			return aObjectArray;
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#_addconfiguration
		 * @description Adds a configuration node into the tree
		 * */
		_addconfiguration : function() { // adds a new configuration in the tree
			var self = this;
			this.configNewIndex = this.configNewIndex || 1;
			var oModel = this.getModel();
			var idOfConfig;
			//Increment the configuration index each time to traverse to route
			idOfConfig = "I" + this.configNewIndex;
			this.configNewIndex++;
			var allCategoryInConfig = [], aFacetFilter = [], aCategoryWithStepDetails = [], aNavigationTargets = [];
			allCategoryInConfig.push({
				filters : aFacetFilter,
				name : self.fnTranslationFunction("facetFilters"),
				isSelected : false,
				expanded : false,
				selectable : false
			});
			allCategoryInConfig.push({
				categories : aCategoryWithStepDetails,
				name : self.fnTranslationFunction("categories"),
				isSelected : false,
				expanded : false,
				selectable : false
			});
			allCategoryInConfig.push({
				navTargets : aNavigationTargets,
				name : self.fnTranslationFunction("navigationTargets"),
				isSelected : false,
				expanded : false,
				selectable : false
			});
			var oConfigDetails = {};
			oConfigDetails.configData = allCategoryInConfig;
			var newConfigName = this.fnTranslationFunction("newConfiguration");
			var newConfigObject = {
				name : "< " + newConfigName + " >",
				type : constants.configurationObjectTypes.CONFIGURATION,
				AnalyticalConfiguration : "newConfig" + idOfConfig,
				Application : this.applicationId,
				configData : allCategoryInConfig,
				bIsLoaded : true,
				isSelected : false,
				expanded : false,
				selectable : true
			};
			oModel.getData().aConfigDetails.push(newConfigObject); //push the new configuration at the last index
			oModel.updateBindings();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#_addfacetFilter
		 * @description Adds a facet filter node into the tree
		 * */
		_addfacetFilter : function(configIndexInTree) { // adds a new facet filter in the selected configuration
			var oModel = this.getModel();
			var newFacetFilterName = this.fnTranslationFunction("newFacetFilter");
			var idOfFacetFilter = oModel.getData().aConfigDetails[configIndexInTree].configData[0].filters.length;
			var newFacetFilterObject = {
				name : "< " + newFacetFilterName + " >",
				type : constants.configurationObjectTypes.FACETFILTER,
				id : "newFilter" + idOfFacetFilter,
				isSelected : false,
				selectable : true
			};
			oModel.getData().aConfigDetails[configIndexInTree].expanded = true;
			oModel.getData().aConfigDetails[configIndexInTree].configData[0].expanded = true;
			oModel.getData().aConfigDetails[configIndexInTree].configData[0].filters.push(newFacetFilterObject);//push the new facet filter at the last index
			oModel.updateBindings();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#_addnavigationTarget
		 * @description Adds a navigation Target node into the tree
		 * */
		_addnavigationTarget : function(configIndexInTree) { // adds a new navigation Target in the selected configuration
			var oModel = this.getModel();
			var newNavigationTargetName = this.fnTranslationFunction("newNavigationTarget");
			var idOfNavigationTarget = oModel.getData().aConfigDetails[configIndexInTree].configData[2].navTargets.length;
			var newNavigationTargetObject = {
				name : "< " + newNavigationTargetName + " >",
				type : constants.configurationObjectTypes.NAVIGATIONTARGET,
				id : "newNavTarget" + idOfNavigationTarget,
				isSelected : false,
				selectable : true
			};
			oModel.getData().aConfigDetails[configIndexInTree].expanded = true;
			oModel.getData().aConfigDetails[configIndexInTree].configData[2].expanded = true;
			oModel.getData().aConfigDetails[configIndexInTree].configData[2].navTargets.push(newNavigationTargetObject);//push the new navigation Target at the last index
			oModel.updateBindings();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#_addcategory
		 * @description Adds a category node into the tree
		 * */
		_addcategory : function(configIndexInTree) {// adds a new category in the selected configuration
			var oModel = this.getModel();
			var newCategoryName = this.fnTranslationFunction("newCategory");
			var idOfCategory = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories.length;
			var newCategoryObject = {
				name : "< " + newCategoryName + " >",
				type : constants.configurationObjectTypes.CATEGORY,
				id : "newCategory" + idOfCategory,
				isSelected : false,
				expanded : false,
				selectable : true
			};
			oModel.getData().aConfigDetails[configIndexInTree].expanded = true;
			oModel.getData().aConfigDetails[configIndexInTree].configData[1].expanded = true;
			oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories.push(newCategoryObject);//push the new category at the last index
			oModel.updateBindings();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#_addstep
		 * @description Adds a new step or existing step node into the tree
		 * @param Contains the list of existing steps to be added
		 * */
		_addstep : function(configIndexInTree, categoryIndexInConfig, stepIndexInCategory, params, bIsHierarchicalStep) { // adds a new step or existing step with representations in the selected category under a configuration
			var oModel = this.getModel();
			var newStepObject;
			var bIsHierarchicalStep = (bIsHierarchicalStep && bIsHierarchicalStep === true) ? true : false;
			if (oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps === undefined) {
				oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps = [];
			}
			if (!params) {// Incase of a new step
				var idOfStep = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps.length;
				var newStepName = this.fnTranslationFunction("newStep");
				newStepObject = {
					name : "< " + newStepName + " >",
					type : constants.configurationObjectTypes.STEP,
					id : "newStep" + idOfStep,
					isSelected : false,
					expanded : false,
					selectable : true,
					bIsHierarchicalStep : bIsHierarchicalStep
				};
				oModel.getData().aConfigDetails[configIndexInTree].expanded = true;
				oModel.getData().aConfigDetails[configIndexInTree].configData[1].expanded = true;
				oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].expanded = true;
				oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps.push(newStepObject);
			} else {//In case of existing steps(single or multiple)
				var existingStepObject, i, j;
				for(i = 0; i < params.noOfSteps; i++) {
					existingStepObject = {
						name : params.aExistingStepsToBeAdded[i].step.name,
						type : constants.configurationObjectTypes.STEP,
						id : params.aExistingStepsToBeAdded[i].step.id,
						isSelected : false,
						expanded : false,
						selectable : true,
						icon: bIsHierarchicalStep === true ? "sap-icon://drill-down" : "sap-icon://step"
					};
					oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps.push(existingStepObject);
					if (params.aExistingStepsToBeAdded[i].noOfReps !== 0) {
						stepIndexInCategory = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps.length - 1;
						for(j = 0; j < params.aExistingStepsToBeAdded[i].noOfReps; j++) {
							var representationParams = {
								id : params.aExistingStepsToBeAdded[i].representations[j].id,
								name : params.aExistingStepsToBeAdded[i].representations[j].name,
								icon : params.aExistingStepsToBeAdded[i].representations[j].icon
							};
							this._addrepresentation(configIndexInTree, categoryIndexInConfig, stepIndexInCategory, representationParams);//In case the existing step has representations
						}
					}
				}
			}
			oModel.updateBindings();
		},
		/**
		 * @private
		 * @function
		 * @name sap.apf.modeler.ui.utils.APFTree#_addrepresentation
		 * @description Adds a new representation node or existing representations into the tree
		 * @param Contains the representation node to be added under an existing step
		 * */
		_addrepresentation : function(configIndexInTree, categoryIndexInConfig, stepIndexInCategory, params) {// adds a new representation in the selected step in a category under a configuration
			var oModel = this.getModel();
			var self = this;
			var stepId;
			if (params === undefined) {//In case of new representation under a step or existing step
				var selectedTreeNodeDetails = this.getAPFTreeNodeContext(this.getSelectedItem());
				if (selectedTreeNodeDetails.nodeObjectType === constants.configurationObjectTypes.REPRESENTATION) {
					stepId = this.getParentNodeContext(selectedTreeNodeDetails, oModel).stepId;
				} else if (selectedTreeNodeDetails.nodeObjectType === constants.configurationObjectTypes.STEP) {
					stepId = selectedTreeNodeDetails.nodeAPFId;
				}
				var aStepContexts = [];
				oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories.forEach(function(category, categoryIndex) {
					if (oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndex].steps) {
						oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndex].steps.forEach(function(step, stepIndex) {
							var stepContext = {};
							if (step.id === stepId) {
								stepContext.stepIndex = stepIndex;
								stepContext.categoryIndex = categoryIndex;
								aStepContexts.push(stepContext);
							}
						});
					}
				});
				aStepContexts.forEach(function(stepContext) {
					if (oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[stepContext.categoryIndex].steps[stepContext.stepIndex].representations === undefined) {
						oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[stepContext.categoryIndex].steps[stepContext.stepIndex].representations = [];
					}
					var idOfRep = oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[stepContext.categoryIndex].steps[stepContext.stepIndex].representations.length;
					var newRepresentationObject = {
						name : self.fnTranslationFunction(self.defaultRepresentationType),
						type : constants.configurationObjectTypes.REPRESENTATION,
						id : "newRepresentation" + idOfRep,
						isSelected : false,
						selectable : true
					};
					oModel.getData().aConfigDetails[configIndexInTree].expanded = true;
					oModel.getData().aConfigDetails[configIndexInTree].configData[1].expanded = true;
					oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[stepContext.categoryIndex].expanded = true;
					oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[stepContext.categoryIndex].steps[stepContext.stepIndex].expanded = true;
					oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[stepContext.categoryIndex].steps[stepContext.stepIndex].representations.push(newRepresentationObject);//push the new representation at the last index
				});
			} else {//In case of adding existing step with representations
				if (oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps[stepIndexInCategory].representations === undefined) {
					oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps[stepIndexInCategory].representations = [];
				}
				var representationObject = {
					name : params.name,
					type : constants.configurationObjectTypes.REPRESENTATION,
					id : params.id,
					isSelected : false,
					selectable : true,
					icon : params.icon
				};
				oModel.getData().aConfigDetails[configIndexInTree].configData[1].categories[categoryIndexInConfig].steps[stepIndexInCategory].representations.push(representationObject);//push the existing representation at the last index
			}
			oModel.updateBindings();
		}
	});

	/* BEGIN COMPABILITY */
	sap.apf.modeler.ui.utils.APFTree = APFTree;
	/* END COMPABILITY */
	return APFTree;
}, true /* GLOBAL_EXPORT */);