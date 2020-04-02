// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ushell/renderers/fiori2/search/SearchResultListFormatter',
    "sap/ui/export/Spreadsheet"
], function (Controller, SearchResultListFormatter, Spreadsheet) {
    "use strict";

    return Controller.extend("sap.ui.export.sample.table.Spreadsheet", {

        onExport: function () {
            var that = this;
            that.exportData = {
                columns: [],
                rows: []
            };

            if (that.table === undefined) {
                that.table = sap.ui.getCore().byId('ushell-search-result-table');
                that.model = that.table.getModel();
            }

            sap.ui.getCore().byId('dataExportButton').setEnabled(false); // deactivate download button

            // search query
            var exportQuery = that.model.query.clone();
            exportQuery.setCalculateFacets(false);
            exportQuery.setTop(1000);

            // success handler
            var successHandler = function (searchResultSet) {
                that._parseColumns(searchResultSet.items[0]);

                // get formatted result
                var formatter = new SearchResultListFormatter();
                var formattedResultItems = formatter.format(searchResultSet, exportQuery.filter.searchTerm, {
                    suppressHighlightedValues: true
                });

                // set formatted title and title description
                for (var i = 0; i < formattedResultItems.length; i++) {
                    searchResultSet.items[i].title = formattedResultItems[i].title;
                    searchResultSet.items[i].titleDescription = formattedResultItems[i].titleDescription;
                }

                // title attribute is formatted, concatenated title
                // title description attribute is formatted, concatenated title description 
                // detail attribute is unformatted, having value, related attributes, or attribute group
                that._parseRows(searchResultSet.items);

                that._doExport();
            };

            // error handler
            var errorHandler = function (error) {
                that.model.normalSearchErrorHandling(error);
                sap.ui.getCore().byId('dataExportButton').setEnabled(true); // activate download button, when search fails
                that.model.setProperty("/isBusy", false);
            };

            // fire search
            if (that.model.getProperty("/boCount") > 1000) {
                sap.m.MessageBox.information(sap.ushell.resources.i18n.getText("exportDataInfo"), {
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    onClose: function (oAction) {
                        if (oAction == sap.m.MessageBox.Action.OK) {
                            that.model.setProperty("/isBusy", true);
                            exportQuery.getResultSetAsync().then(successHandler, errorHandler);
                        }
                        if (oAction == sap.m.MessageBox.Action.CANCEL) {
                            sap.ui.getCore().byId('dataExportButton').setEnabled(true); // activate download button, when download is canceled
                            that.model.setProperty("/isBusy", false);
                        }
                    }
                });
            } else {
                that.model.setProperty("/isBusy", true);
                exportQuery.getResultSetAsync().then(successHandler, errorHandler);
            }
        },

        _parseColumns: function (firstSearchResult) {
            var that = this;
            var exportColumns = [];
            var i;

            var titleColumn = {
                label: firstSearchResult.dataSource.labelPlural,
                property: 'title_export_column',
                type: 'string'
            };

            var titleDescriptionLabel = "";
            firstSearchResult.titleDescriptionAttributes.forEach(function (attribute) {
                titleDescriptionLabel = titleDescriptionLabel + attribute.label + " ";
            });
            titleDescriptionLabel = titleDescriptionLabel + "(" + sap.ushell.resources.i18n.getText("titleDescription") + ")";

            var titleDescriptionColumn = {
                label: titleDescriptionLabel,
                property: 'title_description_export_column',
                type: 'string'
            };

            var detailAttributes = [];
            for (i = 0; i < firstSearchResult.detailAttributes.length; i++) {
                // exclude image url
                if (firstSearchResult.detailAttributes[i].metadata.type !== that.model.sinaNext.AttributeType.ImageUrl) {
                    detailAttributes.push(firstSearchResult.detailAttributes[i]);
                }
            }

            if (that.model.getProperty("/resultToDisplay") !== "searchResultTable") {
                // List view and map view -> export title, title description, and first 12 detail attributes and their related attributes

                exportColumns.push(titleColumn);

                if (firstSearchResult.titleDescriptionAttributes.length > 0) {
                    exportColumns.push(titleDescriptionColumn);
                }

                var limit = 0;
                for (i = 0; i < detailAttributes.length && limit < 12; i++) {
                    exportColumns = exportColumns.concat(that._getRelatedColumns(detailAttributes[i]));
                    limit++;
                }

            } else {
                // Table view -> export all visible and sorted title, title descption, and detail attributes and their related attributes

                var visibleColumns = [];

                that.table.getColumns().forEach(function (column) {
                    if (column.getVisible()) {
                        visibleColumns.push(column);
                    }
                });

                visibleColumns.sort(function (a, b) {
                    if (a.getOrder() < b.getOrder()) {
                        return -1;
                    }
                    if (a.getOrder() > b.getOrder()) {
                        return 1;
                    }
                    return 0;
                });

                visibleColumns.forEach(function (column) {
                    var id = column.getBindingContext().getObject().attributeId;
                    if (id === "SEARCH_TABLE_TITLE_COLUMN") {
                        exportColumns.push(titleColumn);
                        return;
                    }

                    if (id === "SEARCH_TABLE_TITLE_DESCRIPTION_COLUMN") {
                        exportColumns.push(titleDescriptionColumn);
                        return;
                    }

                    for (var i = 0; i < detailAttributes.length; i++) {
                        if (id === detailAttributes[i].id) {
                            exportColumns = exportColumns.concat(that._getRelatedColumns(detailAttributes[i]));
                        }
                    }
                });
            }

            that.exportData.columns = exportColumns;
        },

        _getRelatedColumns: function (attribute) {
            var that = this;
            var columns = [];

            // single attribute
            if (attribute.hasOwnProperty("value")) {
                // current attribute
                columns.push(that._getColumn(attribute));

                // unitOfMeasure atribute of current attribute
                if (attribute.unitOfMeasure) {
                    columns.push(that._getColumn(attribute.unitOfMeasure));
                }

                // description attribute of current attribute
                if (attribute.description) {
                    columns.push(that._getColumn(attribute.description));
                }
            }

            // attribute group
            if (attribute.attributes && attribute.attributes.length > 0) {
                for (var i = 0; i < attribute.attributes.length; i++) {
                    var attributeTemp = attribute.attributes[i].attribute;
                    if (attributeTemp && attributeTemp.label && attributeTemp.id) {
                        columns.push(that._getColumn(attributeTemp));
                    }
                }
            }

            return columns;
        },

        _getColumn: function (attribute) {
            var that = this;
            var column = {
                label: attribute.label,
                property: attribute.id
            };

            if (attribute.metadata.type === undefined) {
                column.type = 'string';
                return column;
            }

            switch (attribute.metadata.type) {
                // case that.model.sinaNext.AttributeType.Timestamp:
                //     column.type = 'timestamp';
                //     break;
                // case that.model.sinaNext.AttributeType.Date:
                //     column.type = 'date';
                //     break;
                // case that.model.sinaNext.AttributeType.Time:
                //     column.type = 'time';
                //     break;
            case that.model.sinaNext.AttributeType.Double:
                column.type = 'number';
                column.scale = 2;
                break;
            case that.model.sinaNext.AttributeType.Integer:
                column.type = 'number';
                column.scale = 0;
                break;
            default:
                column.type = 'string';
            }

            return column;
        },

        _parseRows: function (searchResults) {
            var that = this;
            var exportedRows = [];

            searchResults.forEach(function (row) {
                var attributes = row.detailAttributes;
                var exportedRow = {};

                // title value
                exportedRow.title_export_column = row.title;

                // title description value
                if (row.titleDescriptionAttributes.length > 0) {
                    exportedRow.title_description_export_column = row.titleDescription;
                }


                // other attributes' value
                for (var i = 0; i < attributes.length; i++) {
                    exportedRow = that._getRelatedValues(exportedRow, attributes[i]);
                }

                exportedRows.push(exportedRow);
            });

            that.exportData.rows = exportedRows;
        },

        _getRelatedValues: function (row, attribute) {

            // single attribute
            if (attribute.value) {
                // value of current attrinute
                row[attribute.id] = attribute.value;

                // unitOfMeasure value of current attrinute
                if (attribute.unitOfMeasure) {
                    row[attribute.unitOfMeasure.id] = attribute.unitOfMeasure.value;
                }

                // description value of current attrinute
                if (attribute.description) {
                    row[attribute.description.id] = attribute.description.value;
                }
            }

            // attribute group
            if (attribute.attributes) {
                for (var i = 0; i < attribute.attributes.length; i++) {
                    var attributeTemp = attribute.attributes[i].attribute;
                    if (attributeTemp && attributeTemp.id && attributeTemp.valueFormatted) {
                        row[attributeTemp.id] = attributeTemp.valueFormatted;
                    }
                }
            }

            return row;
        },

        _doExport: function () {
            var that = this;
            var oSettings = {
                workbook: {
                    columns: that.exportData.columns
                },
                fileName: sap.ushell.resources.i18n.getText("exportFileName"),
                dataSource: that.exportData.rows
            };

            new Spreadsheet(oSettings).build().then(function () {
                sap.ui.getCore().byId('dataExportButton').setEnabled(true); // activate download button
                that.model.setProperty("/isBusy", false);
            }, function () {
                sap.ui.getCore().byId('dataExportButton').setEnabled(true); // activate download button
                that.model.setProperty("/isBusy", false);
            });
        }
    });
});
