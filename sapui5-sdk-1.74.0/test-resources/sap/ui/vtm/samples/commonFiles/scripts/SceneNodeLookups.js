"use strict";
var SceneNodeLookups = {};

SceneNodeLookups.createLookups = function() {
    "use strict";
    var sceneNodeLookups = {
        sceneNodeInfosByHash: new sap.ui.vtm.Lookup(),
        sceneNodeInfosByMaterialId: new sap.ui.vtm.Lookup(),
        sceneNodeChildIdsById: new sap.ui.vtm.Lookup()
    };
    sceneNodeLookups.getDescendantSceneNodeIds = function(sceneNodeId) {
        var descendantSceneNodeIds = [];
        var accumulateDescendantSceneNodeIds = function(sceneNodeId, array) {
            sceneNodeLookups.sceneNodeChildIdsById.getValues(sceneNodeId).forEach(function(childSceneNodeId) {
                array.push(childSceneNodeId);
                accumulateDescendantSceneNodeIds(childSceneNodeId, array);
            });
        };
        accumulateDescendantSceneNodeIds(sceneNodeId, descendantSceneNodeIds);
        return descendantSceneNodeIds;
    };
    return sceneNodeLookups;
};
