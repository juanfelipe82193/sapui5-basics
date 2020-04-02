var visualItemHashFunction = function (materialId, absoluteMatrix) {
    "use strict";
    return sap.ui.vtm.HashUtilities.combineHashes([
        sap.ui.vtm.HashUtilities.hashMatrix(absoluteMatrix),
        sap.ui.vtm.HashUtilities.hashString(materialId)
    ]);
};
