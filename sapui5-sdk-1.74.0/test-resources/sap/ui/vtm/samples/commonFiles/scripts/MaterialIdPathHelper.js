"use strict";
var MaterialIdPathHelper = {};

/**
 * @summary Calculates a material id parent path for a given tree item.
 * @param {sap.ui.vtm.Tree} tree The tree that the tree item belongs to.
 * @param {object} treeItem The tree item.
 * @returns {string[]} The material id parent path for the tree item.
 */
MaterialIdPathHelper.getMaterialIdParentPath = function (tree, treeItem) {
    "use strict";
    var ancestors = tree.getAncestorItems(treeItem);
    return ancestors.map(function (ti) {
        return sap.ui.vtm.TreeItemUtilities.getMetadataValues(ti, materialIdDescriptor);
    });
};

/**
 * @summary Returns whether two material id path match.
 * @param p1 One material id path to compare.
 * @param p2 Another material id path to compare.
 * @returns {boolean} true if the two material id paths match.
 */
MaterialIdPathHelper.materialIdPathsMatch = function (p1, p2) {
    "use strict";
    if (!p1 || !p2 || p1.length != p2.length)
        return false;

    return p1.every(function(item, i) {
        return (!p1[i].length && !p2[i].length) || sap.ui.vtm.ArrayUtilities.haveIntersection([p1[i], p2[i]]);
    });
};
