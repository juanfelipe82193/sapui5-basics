sap.ui.define([
   "sap/ui/core/mvc/Controller",
], function (Controller) {
   "use strict";

    var contentResourcesBike = [
        new sap.ui.vtm.Viewable({
            source: "models/_moto_x_missing_parts.vds",
            name: "moto_asm"})
    ];

	var contentResourcesParts = [
        new sap.ui.vtm.Viewable({
            source: "models/spoke_03.vds",
            name: "spoke_03"}),
        new sap.ui.vtm.Viewable({
            source: "models/spoke_04.vds",
            name: "spoke_04"}),
        new sap.ui.vtm.Viewable({
            source: "models/spoke_nipple.vds",
            name: "spoke_nipple"})
    ];

    return Controller.extend("sap.ui.vtm.samples.clone.controller.App", {
        
        getVtm: function() {
            if (!this._vtm) {
                this._vtm = this.getView().byId("vtm");
            }
            return this._vtm;
        },

        getSourcePanel: function() {
            if (!this._sourcePanel) {
                this._sourcePanel = this.getView().byId("source");
            }
            return this._sourcePanel;
        },
        
        updateIcons: function(tree) {
            tree.traverseTree(function(treeItem) {
                var hasChildren = sap.ui.vtm.TreeItemUtilities.hasIncludedChildren(treeItem);
                treeItem.type = hasChildren ? "Group/Assembly" : "Item";
                treeItem.typeIcon = hasChildren ? "sap-icon://tree" : "sap-icon://product";
            });
        },

        handleTreeUpdates: function() {
            var sourcePanel = this.getSourcePanel();
            var sourceTree = sourcePanel.getTree();
            var sourceViewport = sourcePanel.getViewport();
            var scene = this.getVtm().getScene();

            sourceTree.validateTree();
            sourceTree.updateCollections();
            this.updateIcons(sourceTree);
            sourceTree.updateModel();

            GeometryMatchCalculator.performGeometryMatching(
                sourceTree,
                scene,
                this._sceneNodeLookups);

            sourceViewport.refresh();
        },
        
        handleSceneUpdates: function() {
            var sourcePanel = this.getSourcePanel();
            var sourceTree = sourcePanel.getTree();
            var sourceViewport = sourcePanel.getViewport();
            var scene = this.getVtm().getScene();

            GeometryMatchCalculator.performGeometryMatching(
                sourceTree,
                scene,
                this._sceneNodeLookups);

            sourceViewport.refresh();
        },

        updateView: function() {
            var that = this;
            that.getSourcePanel().getViewport().zoomToVisible(0);
            setTimeout(function() {
                that.getSourcePanel().getViewport().setPredefinedView(sap.ui.vtm.PredefinedView.Top);
            }, 0);
        },

        onLoadTree: function() {
            var that = this;
            jQuery.getJSON("models/tree.json", function (data) {
                that.getSourcePanel().getTree().setRootItems(data);
                that.handleTreeUpdates();
                that.updateView();
            });
        },

        onLoadBike: function() {
            var vtm = this.getVtm();
            var scene = vtm.getScene();
            scene.loadViewablesAsync(contentResourcesBike);
        },

        onLoadParts: function() {
            var vtm = this.getVtm();
            var scene = vtm.getScene();
            scene.loadViewablesAsync(contentResourcesParts);
        },

        onLoadBikeAndParts: function() {
            var vtm = this.getVtm();
            var scene = vtm.getScene();
            scene.loadViewablesAsync(contentResourcesBike.concat(contentResourcesParts));
        },

        onInit: function() {
            var vtm = this.getVtm();
            var scene = vtm.getScene();
            var sourcePanel = this.getSourcePanel();
            var sourceTree = sourcePanel.getTree();
            sourceTree.setDataColumns([
                sap.ui.vtm.InternalColumns.createSceneNodeIdsColumn(),
                new sap.ui.vtm.Column({
                    type: sap.ui.vtm.ColumnType.Metadata,
                    descriptor: materialIdDescriptor,
                    label:"Material ID"
                })
            ]);

            this._sceneNodeLookups = SceneNodeLookups.createLookups();

            scene.attachLoadCompleted(function (event) {
                var loadedViewables = scene.getLoadedViewables();
                loadedViewables.forEach(function(loadedViewable) {
                    var rootNodeIds = loadedViewable.getRootNodeIds();
                    rootNodeIds.forEach(function(rootNodeId) {
                        scene.traverseBranch(rootNodeId, function(sceneNode, ancestorIds) {
                            var absoluteMatrix = sceneNode.getAbsoluteMatrix();
                            var metadata = sceneNode.getNodeMetadata();
                            var parentSceneNodeId = ancestorIds[ancestorIds.length - 1];
                            var materialIds = sap.ui.vtm.ArrayUtilities.wrap(metadata[materialIdDescriptor]);
                            var sceneNodeId = sceneNode.getSceneNodeId();
                            if (materialIds.length && absoluteMatrix) {
                                GeometryMatchCalculator.addSceneNodeToLookup(
                                    sceneNodeId,
                                    parentSceneNodeId,
                                    absoluteMatrix,
                                    materialIds,
                                    null,
                                    this._sceneNodeLookups);
                            }
                        }.bind(this));
                    }.bind(this));
                }.bind(this));

                this.handleSceneUpdates();
                this.updateView();
            }.bind(this));
        }
    });
});
