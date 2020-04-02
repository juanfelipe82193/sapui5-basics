sap.ui.define([
   "sap/ui/core/mvc/Controller", "sap/ui/vtm/Viewable", "sap/ui/core/Message"
], function (Controller, Viewable, Message) {
   "use strict";
   return Controller.extend("sap.ui.vtm.sample.basicSinglePanel.App", {

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

        onInit: function() {
            var vtm = this.getVtm();
            var scene = vtm.getScene();

            scene.attachLoadCompleted(this.onFileLoaded, this);

            var viewable = new Viewable({
                source: "test-resources/sap/ui/vtm/demokit/sample/basicSinglePanel/cooper.vds"
            });
            scene.loadViewablesAsync([viewable]);
        },

        onFileLoaded: function() {
            var vtm = this.getVtm();
            var scene = vtm.getScene();
            var sourcePanel = this.getSourcePanel();
            var sourceTree = sourcePanel.getTree();

            var treeRoots = new Array();
            var treeItemsBySceneNodeId = new Map();
            var i = 0;

            var loadedViewables = scene.getLoadedViewables();
            loadedViewables.forEach(function(loadedViewable) {
                var rootNodeIds = loadedViewable.getRootNodeIds();
                rootNodeIds.forEach(function(rootNodeId) {
                    scene.traverseBranch(rootNodeId, function(sceneNode, ancestorIds) {
                        var sceneNodeId = sceneNode.getSceneNodeId();
                        var treeItem = {
                            id: jQuery.sap.uid(),
                            name: sceneNode.getName(),
                            absoluteMatrix: sceneNode.getAbsoluteMatrix(),
                            relativeMatrix: sceneNode.getRelativeMatrix(),
                            metadata: sceneNode.getNodeMetadata(),
                            identifiers: sceneNode.getIdentifiers(),
                            sceneNodeIds: [sceneNodeId],
                            visibility: true
                        };

                        if (i++ % 13 === 0) {
                            sap.ui.vtm.TreeItemUtilities.setMessages(treeItem, [
                                new Message({
                                    level: sap.ui.core.MessageType.Warning,
                                    text: "A warning"
                                })
                            ]);
                        }

                        treeItemsBySceneNodeId.set(sceneNodeId, treeItem);

                        var parentSceneNodeId = ancestorIds[ancestorIds.length - 1];
                        if (treeItemsBySceneNodeId.has(parentSceneNodeId)) {
                            var parentTreeItem = treeItemsBySceneNodeId.get(parentSceneNodeId);
                            sap.ui.vtm.TreeItemUtilities.addIncludedChild(parentTreeItem, treeItem);
                        } else {
                            treeRoots.push(treeItem);
                        }
                    });
                });
            });

            sourceTree.setRootItems(treeRoots);
            sourceTree.updateCollections();
            sourceTree.updateModel();
       }
   });
});
