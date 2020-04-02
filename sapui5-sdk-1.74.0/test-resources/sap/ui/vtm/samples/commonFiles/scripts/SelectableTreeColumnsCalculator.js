"use strict";
var SelectableTreeColumnsCalculator = {};

// Get the set of selectable columns based on what is present in the trees.
// An application might also choose to take into account any columns that have been displayed previously (since the content of the trees can change over time).
// When metadata auto copying is supported, the application might choose to take into account the set of metadata fields and identifiers in the scene.
SelectableTreeColumnsCalculator.getSelectableColumns = function (trees) {
    "use strict";
    var metadataFriendlyNames = new Map([
        [materialIdDescriptor, "Material ID"]
    ]);
    var identifierFriendlyNames = new Map([
        [componentIdDescriptor, "Component ID"]
    ]);
    var appDataFriendlyNames = new Map([
        ["bomId", "Bom ID"],
        ["planningStatus", "Planning Status"],
        ["matchBy", "Match By"]
    ]);
    
    var getAvailableFields = function(trees) {
        var availableMetadata = new Set(),
            availableIdentifiers = new Set(),
            availableAppData = new Set();

        trees.forEach(function(tree) {
            sap.ui.vtm.TreeItemUtilities.traverseTree(tree.getRootItems(), function (treeItem) {
                sap.ui.vtm.TreeItemUtilities.getMetadataDescriptors(treeItem).forEach(function(metadataDescriptor) {
                    availableMetadata.add(metadataDescriptor);
                });
                sap.ui.vtm.TreeItemUtilities.getIdentifierDescriptors(treeItem).forEach(function(identifierDescriptor) {
                    availableIdentifiers.add(identifierDescriptor);
                });
                sap.ui.vtm.TreeItemUtilities.getAppDataDescriptors(treeItem).forEach(function(appDataDescriptor) {
                    availableAppData.add(appDataDescriptor);
                });
            });
        });

        return {
            availableMetadata: sap.ui.vtm.ArrayUtilities.fromSet(availableMetadata),
            availableIdentifiers: sap.ui.vtm.ArrayUtilities.fromSet(availableIdentifiers),
            availableAppData: sap.ui.vtm.ArrayUtilities.fromSet(availableAppData)
        }
    };

    var availableFields = getAvailableFields(trees);

    var metadataColumns = availableFields.availableMetadata.map(function (metadataDescriptorString) {
        return new sap.ui.vtm.Column({
            type: sap.ui.vtm.ColumnType.Metadata,
            descriptor: metadataDescriptorString,
            label: metadataFriendlyNames.get(metadataDescriptorString) || JSON.parse(metadataDescriptorString).field
        });
    });
    var identifierColumns = availableFields.availableIdentifiers.map(function (identifierDescriptorString) {
        return new sap.ui.vtm.Column({
            type: sap.ui.vtm.ColumnType.Identifier,
            descriptor: identifierDescriptorString,
            label: identifierFriendlyNames.get(identifierDescriptorString) || JSON.parse(identifierDescriptorString).type
        });
    });
    var appDataColumns = availableFields.availableAppData.map(function (appDataDescriptorString) {
        return new sap.ui.vtm.Column({
            type: sap.ui.vtm.ColumnType.AppData,
            descriptor: appDataDescriptorString,
            label: appDataFriendlyNames.get(appDataDescriptorString) || appDataDescriptorString
        });
    });

    return metadataColumns.concat(identifierColumns).concat(appDataColumns);
};