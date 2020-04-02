sap.ui.define(["sap/ui/thirdparty/jquery"], function (jQuery) {
    "use strict";
    /*global jQuery, sap */
    /*

     jQuery.sap.declare("utils");

     utils = {};
     */
    var utils = {};
    utils.testBaseUrl = "test-resources/sap/ovp/";
    utils.odataBaseUrl_salesOrder = utils.testBaseUrl + "data/salesorder/";
    utils.odataRootUrl_salesOrder = "/sap/opu/odata/IWBEP/GWSAMPLE_BASIC/";
    utils.odataBaseUrl_salesShare = utils.testBaseUrl + "data/salesshare/";
    utils.odataRootUrl_salesShare = "/sap/smartbusinessdemo/services/SalesShare.xsodata/";

    /**
     *
     * @param cardData
     * @returns {sap.ui.model.odata.v2.ODataModel}
     */
    utils.createCardModel = function (cardData) {
        var oModel = new sap.ui.model.odata.v2.ODataModel(
            cardData.dataSource.rootUri,
            {
                annotationURI: cardData.dataSource.annoUri,
                json: true,
                loadMetadataAsync: false
            }
        );
        return oModel;
    };

    utils.createCardView = function (cardData, oModel) {
        var oComponent = sap.ui.component({
            name: cardData.card.template,
            componentData: {
                cardId: cardData.card.id,
                getComponentData: function () {
                    return this;
                },
                appComponent: {
                    containerLayout: "",
                    getModel: function (sDummy) {
                        return {
                            getProperty: function () {
                                return [];
                            }
                        };
                    },
                    getOvpConfig: function () {
                        return;
                    },
                    getMetadata: function () {
                        return {
                            getName: function () {
                                return "dummy";
                            }
                        };
                    },
                    getManifest: function () {
                        return;
                    }
                },
                model: oModel,
                settings: cardData.card.settings
            }
        });
        return oComponent.getAggregation("rootControl");
    };

    /**
     * this function get the expected value and actual XML value and returns true if the XML value contains the
     * expected value passed. This check could be replaced with a tighter check, but it is currently enough
     * @param xmlPropertyValue
     * @param expectedPropertyValue
     * @returns {*}
     */
    utils.validateXMLValue = function (xmlPropertyValue, expectedPropertyValue) {
        if (expectedPropertyValue === null || expectedPropertyValue === undefined) {
            return xmlPropertyValue === null || xmlPropertyValue === undefined;
        } else if (typeof expectedPropertyValue === "string") {
            return expectedPropertyValue === xmlPropertyValue;
        } else if (typeof expectedPropertyValue.test === "function") {
            return expectedPropertyValue.test(xmlPropertyValue);
        } else {
            return false;
        }
    };

    /**
     *
     * @param cardTestData - Object containing card mock data + expected result
     * @param cardXml
     * @returns true \ false - validates description structure
     */
    utils.isValidSub = function (cardTestData, cardXml) {
        var subTitle = jQuery(cardXml).find('.sapOvpCardSubtitle');
        var expectedHeaderRes = cardTestData.expectedResult.Header;
        if (!expectedHeaderRes.subTitle) {
            return (subTitle.length === 0);
        } else {
            if (subTitle.length === 1) {
                return utils.validateXMLValue(subTitle[0].getAttribute('text'), expectedHeaderRes.subTitle);
            }
        }
        return false;
    };

    /**
     *
     * @param cardTestData - Object containing card mock data + expected result
     * @param cardXml
     * @returns true \ false - validates title structure
     */
    utils.isValidTitle = function (cardTestData, cardXml) {
        var expectedHeaderRes = cardTestData.expectedResult.Header;
        var title = jQuery(cardXml).find('.sapOvpCardTitle');
        if (!expectedHeaderRes.title) {
            return (title.length === 0);
        } else {
            if (title.length === 1) {
                return utils.validateXMLValue(title[0].getAttribute('text'), expectedHeaderRes.title);
            }
        }
        return false;
    };

    utils.isValidHeaderExtension = function (cardTestData, cardXml) {
        var expectedHeaderRes = cardTestData.expectedResult.Header;
        var headerExtension = jQuery(cardXml).find('.sapOvpHeaderExtension');
        if (!expectedHeaderRes.headerExtension) {
            return (headerExtension.length === 0);
        } else {
            if (headerExtension.length === 1) {
                return utils.validateXMLValue(headerExtension[0].getAttribute('text'), expectedHeaderRes.headerExtension);
            }
        }
        return false;
    };

    /**
     *
     * @param cardTestData - Object containing card mock data + expected result
     * @param cardXml
     * @returns true \ false - validates category structure
     */
    utils.isValidCategory = function (cardTestData, cardXml) {
        var expectedHeaderRes = cardTestData.expectedResult.Header;
        var category = jQuery(cardXml).find('.sapOvpCardCategory');
        if (!expectedHeaderRes.category) {
            return category.length === 0;
        } else {
            if (category.length === 1) {
                return utils.validateXMLValue(category[0].getAttribute('text'), expectedHeaderRes.category);
            }
        }
        return false;
    };

    utils.listNodeExists = function (cardXml) {
        return cardXml.getElementsByTagName('List')[0];

    };

    utils.listItemsNodeExists = function (cardXml, cardCfg) {
        var listXml = utils.getListItemsNode(cardXml);
        if (listXml) {
            var listItemsXml = listXml.getElementsByTagName('items')[0];
            if (listItemsXml) {
                if (cardCfg.listFlavor === 'bar') {
                    return listItemsXml.getElementsByTagName('CustomListItem')[0];
                } else if (cardCfg.listType === 'extended') {
                    return listItemsXml.getElementsByTagName('ObjectListItem')[0];
                } else {
                    return listItemsXml.getElementsByTagName('StandardListItem')[0];
                }
            }
        }
        return false;
    };

    utils.getListItemsNode = function (cardXml) {
        return cardXml.getElementsByTagName('List')[0];
    };


    utils.objectListItemFirstStatusNodeExists = function (cardXml) {
        var listXml = cardXml.getElementsByTagName('List')[0];
        if (listXml) {
            var listItemsXml = listXml.getElementsByTagName('items')[0];
            if (listItemsXml) {
                var oliXML = listItemsXml.getElementsByTagName('ObjectListItem')[0];
                return oliXML.getElementsByTagName('firstStatus')[0];
            }
        }
        return false;
    };

    utils.objectListItemAttributeNodeExists = function (cardXml) {
        var listXml = cardXml.getElementsByTagName('List')[0];
        if (listXml) {
            var listItemsXml = listXml.getElementsByTagName('items')[0];
            if (listItemsXml) {
                var oliXML = listItemsXml.getElementsByTagName('ObjectListItem')[0];
                return oliXML.getElementsByTagName('attributes')[0];
            }
        }
        return false;
    };

    utils.validateListXmlValues = function (cardXml, cardCfg, expectedListRes) {
        if (cardCfg.listType === 'extended') {
            if (cardCfg.listFlavor === 'bar') {
                return utils._validateExtendedBarListItemsXmlValues(cardXml, expectedListRes);
            } else {
                return utils._validateObjectListItemsXmlValues(cardXml, expectedListRes);
            }
        } else {
            if (cardCfg.listFlavor === 'bar') {
                return utils._validateCondensedBarListItemsXmlValues(cardXml, expectedListRes);
            } else {
                // default for listType (in case parameter not passed) is currently 'Condensed' e.g. list of StandardListItem objects
                return utils._validateStandardListItemsXmlValues(cardXml, expectedListRes);
            }
        }
    };

    utils._validateObjectListItemsXmlValues = function (cardXml, expectedListRes) {

        // for object list item we have (besides the attirbutes itself, 2 additional Nodes to check - the FirstStatus and the Attribute Nodes)
        if (!utils.objectListItemFirstStatusNodeExists(cardXml)) {
            return false;
        }
        if (!utils.objectListItemAttributeNodeExists(cardXml)) {
            return false;
        }

        var oliXML = cardXml.getElementsByTagName('ObjectListItem')[0];
        var statusXml = oliXML.getElementsByTagName('ObjectStatus')[0];
        var status1Xml = oliXML.getElementsByTagName('ObjectStatus')[1];
        var objAttrsXML = oliXML.getElementsByTagName('ObjectAttribute')[0];
        var objAttrs1XML = oliXML.getElementsByTagName('ObjectAttribute')[1];

        if (!utils.validateXMLValue(oliXML.getAttribute('title'), expectedListRes.ListItem.title)) {
            return false;
        }
        if (!utils.validateXMLValue(oliXML.getAttribute('number'), expectedListRes.ListItem.number)) {
            return false;
        }
        if (!utils.validateXMLValue(oliXML.getAttribute('numberState'), expectedListRes.ListItem.numberState)) {
            return false;
        }
        if (!utils.validateXMLValue(statusXml.getAttribute('text'), expectedListRes.ListItem.ObjectStatus[0].text)) {
            return false;
        }
        if (!utils.validateXMLValue(statusXml.getAttribute('state'), expectedListRes.ListItem.ObjectStatus[0].state)) {
            return false;
        }
        if (!utils.validateXMLValue(status1Xml.getAttribute('text'), expectedListRes.ListItem.ObjectStatus[1].text)) {
            return false;
        }
        if (!utils.validateXMLValue(status1Xml.getAttribute('state'), expectedListRes.ListItem.ObjectStatus[1].state)) {
            return false;
        }
        if (!utils.validateXMLValue(objAttrsXML.getAttribute('text'), expectedListRes.ListItem.ObjectAttribute[0].text)) {
            return false;
        }
        if (!utils.validateXMLValue(objAttrs1XML.getAttribute('text'), expectedListRes.ListItem.ObjectAttribute[1].text)) {
            return false;
        }

        return true;
    };

    utils._validateStandardListItemsXmlValues = function (cardXml, expectedListRes) {

        var oliXML = cardXml.getElementsByTagName('StandardListItem')[0];

        if (!utils.validateXMLValue(oliXML.getAttribute('title'), expectedListRes.ListItem.title)) {
            return false;
        }

        if (!utils.validateXMLValue(oliXML.getAttribute('description'), expectedListRes.ListItem.description)) {
            return false;
        }

        if (!utils.validateXMLValue(oliXML.getAttribute('info'), expectedListRes.ListItem.info)) {
            return false;
        }

        if (!utils.validateXMLValue(oliXML.getAttribute('infoState'), expectedListRes.ListItem.infoState)) {
            return false;
        }

        return true;
    };

    utils._validateExtendedBarListItemsXmlValues = function (cardXml, expectedListRes) {

        var oliXML = cardXml.getElementsByTagName('CustomListItem')[0];
        var firstDataFiledXml = oliXML.getElementsByTagName('Text')[0];
        var secondDataFiledXml = oliXML.getElementsByTagName('Text')[1];
        var oProgressIndicatorXML = oliXML.getElementsByTagName('ProgressIndicator')[0];
        if (!oliXML.getElementsByTagName('ObjectNumber')[2]) {
            //There is no third data point
            var firstDataPointXml = oliXML.getElementsByTagName('ObjectNumber')[1];
            var secondDataPointXml = oliXML.getElementsByTagName('ObjectNumber')[0];
        } else {
            //There is third data point
            var firstDataPointXml = oliXML.getElementsByTagName('ObjectNumber')[2];
            var secondDataPointXml = oliXML.getElementsByTagName('ObjectNumber')[0];
            var thirdDataPointXml = oliXML.getElementsByTagName('ObjectNumber')[1];
        }

        if (!utils.validateXMLValue(firstDataFiledXml.getAttribute('text'), expectedListRes.CustomListItem.firstDataFiled)) {
            return false;
        }
        if (!utils.validateXMLValue(secondDataFiledXml.getAttribute('text'), expectedListRes.CustomListItem.secondDataFiled)) {
            return false;
        }
        if (!utils.validateXMLValue(oProgressIndicatorXML.getAttribute('percentValue'), expectedListRes.CustomListItem.progressIndicator)) {
            return false;
        }
        if (!utils.validateXMLValue(firstDataPointXml.getAttribute('number'), expectedListRes.CustomListItem.firstDataPoint)) {
            return false;
        }
        if (!utils.validateXMLValue(secondDataPointXml.getAttribute('number'), expectedListRes.CustomListItem.secondDataPoint)) {
            return false;
        }
        if (thirdDataPointXml && !utils.validateXMLValue(thirdDataPointXml.getAttribute('number'), expectedListRes.CustomListItem.thirdDataPoint)) {
            return false;
        }

        return true;
    };

    utils._validateCondensedBarListItemsXmlValues = function (cardXml, expectedListRes) {

        var oliXML = cardXml.getElementsByTagName('CustomListItem')[0],
            oTitleXML = oliXML.getElementsByTagName('Text')[0],
            oProgressIndicatorXML = oliXML.getElementsByTagName('ProgressIndicator')[0],
            oFirstDataPointXML = oliXML.getElementsByTagName('Text')[1],
            oObjNumberXML = oliXML.getElementsByTagName('ObjectNumber')[0];


        if (!utils.validateXMLValue(oTitleXML.getAttribute('text'), expectedListRes.CustomListItem.title)) {
            return false;
        }

        if (!utils.validateXMLValue(oProgressIndicatorXML.getAttribute('percentValue'), expectedListRes.CustomListItem.progressIndicator)) {
            return false;
        }

        if (!utils.validateXMLValue(oFirstDataPointXML.getAttribute('text'), expectedListRes.CustomListItem.firstDataPoint)) {
            return false;
        }

        if (!utils.validateXMLValue(oObjNumberXML.getAttribute('number'), expectedListRes.CustomListItem.SecondDataPoint)) {
            return false;
        }

        return true;
    };

    utils.actionFooterNodeExists = function (cardXml) {
        return cardXml.getElementsByTagName('OverflowToolbar')[0];
    };

    utils.getActionsCount = function (cardXml) {
        var footerXML = cardXml.getElementsByTagName('OverflowToolbar')[0];
        var actions = footerXML.getElementsByTagName('Button');
        return actions.length;
    };

    utils.validateActionFooterXmlValues = function (cardXml, expectedFooterRes) {
        var currentData;
        var footerXML = cardXml.getElementsByTagName('OverflowToolbar')[0];
        if (footerXML) {
            var actions = footerXML.getElementsByTagName("Button");
            if (actions && actions.length > 0) {
                if (actions.length != expectedFooterRes.actions.length) {
                    return false;
                }

                for (var i = 0; i < actions.length; i++) {
                    currentData = utils.getCustomDataObject(actions[i]);
                    if (!utils.validateXMLValue(currentData.type, expectedFooterRes.actions[i].type)) {
                        return false;
                    }
                    if (!utils.validateXMLValue(currentData.action, expectedFooterRes.actions[i].action)) {
                        return false;
                    }
                    if (!utils.validateXMLValue(currentData.label, expectedFooterRes.actions[i].label)) {
                        return false;
                    }
                    if (!utils.validateXMLValue(currentData.semanticObject, expectedFooterRes.actions[i].semanticObj)) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    utils.validateActionFooterButtonVisibility = function (cardXml, oView, expectedFooterRes) {
        var oFooter = oView.byId("ovpActionFooter");
        if (oFooter) {
            var aFooterBtns = oFooter.getContent();
            if (aFooterBtns && aFooterBtns.length) {
                if (aFooterBtns[1].getVisible() !== expectedFooterRes.actions[0].visible) {
                    return false;
                }
            }
        }
        return true;
    };

    utils.getCustomDataObject = function (customDataXML) {
        var res = {};
        var customDataArray = customDataXML.getElementsByTagNameNS("sap.ui.core", "CustomData");
        for (var i = 0; i < customDataArray.length; i++) {
            res [customDataArray[i].getAttribute("key")] = customDataArray[i].getAttribute("value");
        }

        return res;
    };

    utils.quickviewNodeExists = function (cardXml) {
        return cardXml.getElementsByTagName('QuickViewCard')[0];
    };

    utils.quickviewGroupNodeExists = function (cardXml) {
        var quickviewXML = cardXml.getElementsByTagName('QuickViewCard')[0];
        return quickviewXML.getElementsByTagName('QuickViewGroup')[0];
    };

    utils.quickviewGroupElementNodeExists = function (cardXml) {
        var quickviewXML = cardXml.getElementsByTagName('QuickViewCard')[0];
        var groupXML = quickviewXML.getElementsByTagName('QuickViewGroup')[0];
        return groupXML.getElementsByTagName('QuickViewGroupElement');
    };

    utils.validateQuickviewXmlValues = function (cardXml, expectedquickviewRes) {

        var quickviewXML = cardXml.getElementsByTagName('QuickViewPage')[0];
        if (quickviewXML) {
            if (!utils.validateXMLValue(quickviewXML.getAttribute('header'), expectedquickviewRes.QuickViewPage.header)) {
                return false;
            }
            if (!utils.validateXMLValue(quickviewXML.getAttribute('title'), expectedquickviewRes.QuickViewPage.title)) {
                return false;
            }
            var groupsXml = quickviewXML.getElementsByTagName('QuickViewGroup');
            if (groupsXml.length == expectedquickviewRes.QuickViewPage.groups.length) {
                for (var gIndex = 0; gIndex < groupsXml.length; gIndex++) {
                    if (!utils.validateXMLValue(groupsXml[gIndex].getAttribute('heading'), expectedquickviewRes.QuickViewPage.groups[gIndex].header)) {
                        return false;
                    }
                    var propertiesXML = groupsXml[gIndex].getElementsByTagName('QuickViewGroupElement');
                    var propsExpected = expectedquickviewRes.QuickViewPage.groups[gIndex].props;
                    if (propertiesXML) {
                        if (propertiesXML.length != propsExpected.length) {
                            return false;
                        }
                        if (propertiesXML.length == propsExpected.length) {
                            for (var pIndex = 0; pIndex < propertiesXML.length; pIndex++) {

                                if (!utils.validateXMLValue(propertiesXML[pIndex].getAttribute('label'), propsExpected[pIndex].label)) {
                                    return false;
                                }
                                if (!utils.validateXMLValue(propertiesXML[pIndex].getAttribute('value'), propsExpected[pIndex].value)) {
                                    return false;
                                }
                                if (!utils.validateXMLValue(propertiesXML[pIndex].getAttribute('type'), propsExpected[pIndex].type)) {
                                    return false;
                                }
                            }
                        } else {//#of props not as expected
                            return false;
                        }
                    }
                }
            } else { //#of groups not as expected
                return false;
            }
        }
        return true;
    };

    utils.imageNodeExists = function (cardXml) {
        return cardXml.getElementsByTagName('Image')[0];

    };

    utils.validateImageXmlValues = function (cardXml, expectedImageRes) {
        var imageXML = cardXml.getElementsByTagName('Image')[0];

        if (!utils.validateXMLValue(imageXML.getAttribute('src'), expectedImageRes.src)) {
            return false;
        }
        if (!utils.validateXMLValue(imageXML.getAttribute('densityAware'), expectedImageRes.densityAware)) {
            return false;
        }
        if (!utils.validateXMLValue(imageXML.getAttribute('width'), expectedImageRes.width)) {
            return false;
        }

        return true;
    };

    utils.tableNodeExists = function (cardXml) {
        return cardXml.getElementsByTagName('Table')[0];
    };

    utils.tableColumnsNodeExists = function (cardXml, cardCfg) {
        var tableXml = cardXml.getElementsByTagName('Table')[0];
        if (tableXml) {
            return tableXml.getElementsByTagName('columns')[0];
        }
        return false;

    };

    utils.tableItemsNodeExists = function (cardXml) {
        var tableXml = utils.getTableItemsNode(cardXml);
        if (tableXml) {
            return tableXml.getElementsByTagName('items')[0];
        }
        return false;

    };

    utils.getTableItemsNode = function (cardXml) {
        return cardXml.getElementsByTagName('Table')[0];
    };

    utils.getListQuickLinkNode = function (cardXml) {
        var tableXml = cardXml.getElementsByTagName('List')[0];
        if (tableXml) {
            var tableItemsXml = tableXml.getElementsByTagName('items')[0];
            if (tableItemsXml) {
                var columns = tableItemsXml.getElementsByTagName('CustomListItem');
                if (columns) {
                    var Links = tableItemsXml.getElementsByTagName('Link');
                    return Links[0];
                }
            }
        }
        return false;
    };
    utils.getListQuickViewNode = function (cardXml) {
        var tableXml = cardXml.getElementsByTagName('List')[0];
        if (tableXml) {
            var tableItemsXml = tableXml.getElementsByTagName('items')[0];
            if (tableItemsXml) {
                var columns = tableItemsXml.getElementsByTagName('CustomListItem');
                if (columns) {
                    var QuickView = tableItemsXml.getElementsByTagName('QuickView');
                    return QuickView[0];
                }
            }
        }
        return false;
    };
    utils.tableQuickNodeExists = function (cardXml) {
        var tableXml = this.tableCellsNodeExists(cardXml);
        if (tableXml) {
            return tableXml.getElementsByTagName("QuickView");
        }
        return false;
    };

    utils.tableColumnListItemNodeExists = function (cardXml) {
        var tableXml = cardXml.getElementsByTagName('Table')[0];
        if (tableXml) {
            var tableItemsXml = tableXml.getElementsByTagName('items')[0];
            if (tableItemsXml) {
                var columns = tableItemsXml.getElementsByTagName('ColumnListItem');
                return columns[0];
            }
        }
        return false;
    };

    utils.tableCellsNodeExists = function (cardXml) {
        var tableXml = cardXml.getElementsByTagName('Table')[0];
        if (tableXml) {
            var tableItemsXml = tableXml.getElementsByTagName('items')[0];
            if (tableItemsXml) {
                var columns = tableItemsXml.getElementsByTagName('ColumnListItem');
                if (columns[0]) {
                    return (columns[0]).getElementsByTagName('cells')[0];
                }
            }
        }
        return false;
    };


    utils.validateTableXmlValues = function (cardXml, cardCfg, expectedTableRes) {

        // validate column titles values
        if (!this._validateTableColumnsTitle(cardXml, cardCfg, expectedTableRes)) {
            return false;
        }
        // validate column cells
        if (!this._validateTableColumnsCells(cardXml, cardCfg, expectedTableRes)) {
            return false;
        }

        return true;
    };


    utils.validateFlexibleTableXmlValues = function (cardXml, cardCfg, expectedTableRes) {

        // validate column titles values
        if (!this._validateTableColumnsTitle(cardXml, cardCfg, expectedTableRes)) {
            return false;
        }
        // validate column cells
        if (!this._validateFlexibleTableColumnsCells(cardXml, cardCfg, expectedTableRes)) {
            return false;
        }

        return true;
    };

    utils._validateTableColumnsTitle = function (cardXml, cardCfg, expectedTableRes) {

        // validate columns title values

        var actualValueToCheck;
        var firstColumn = (cardXml.getElementsByTagName('Column')[0]);
        var SecondColumn = (cardXml.getElementsByTagName('Column')[1]);
        var thirdColumn = (cardXml.getElementsByTagName('Column')[2]);

        // first column title
        actualValueToCheck = undefined;
        if (expectedTableRes.columns[0].text) {
            actualValueToCheck = (firstColumn.getElementsByTagName('Text')[0]).getAttribute('text');
        }
        if (!utils.validateXMLValue(actualValueToCheck, expectedTableRes.columns[0].text)) {
            return false;
        }

        // second column title
        actualValueToCheck = undefined;
        if (expectedTableRes.columns[1].text) {
            actualValueToCheck = (SecondColumn.getElementsByTagName('Text')[0]).getAttribute('text');
        }
        if (!utils.validateXMLValue(actualValueToCheck, expectedTableRes.columns[1].text)) {
            return true;
        }

        // third column title
        actualValueToCheck = undefined;
        if (expectedTableRes.columns[2].text) {
            actualValueToCheck = (thirdColumn.getElementsByTagName('Text')[0]).getAttribute('text');
        }
        if (!utils.validateXMLValue(actualValueToCheck, expectedTableRes.columns[2].text)) {
            return true;
        }

        return true;
    };

    utils.validateTableSemanticObjectValues = function (cardXml, cardCfg, expectedTableRes) {
        var cellsXml = (cardXml.getElementsByTagName('cells')[0]);

        var actualValueToCheck;
        var firstColumnCell = (cellsXml.getElementsByTagName("SmartLink")[0]);
        var SecondColumnCell = (cellsXml.getElementsByTagName("SmartLink")[1]);
        var thirdColumnCell = (cellsXml.getElementsByTagName("SmartLink")[2]);

        //first column semanticObject check
        actualValueToCheck = (expectedTableRes.items.ColumnListItem.cells[0].semanticObject === undefined) ? undefined : firstColumnCell.getAttribute('semanticObject');
        if (!utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[0].semanticObject)) {
            return false;
        }

        //second column semanticObject check
        actualValueToCheck = (expectedTableRes.items.ColumnListItem.cells[1].semanticObject === undefined) ? undefined : SecondColumnCell.getAttribute('semanticObject');
        if (!utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[1].semanticObject)) {
            return false;
        }

        //third column semanticObject check
        actualValueToCheck = (expectedTableRes.items.ColumnListItem.cells[2].semanticObject === undefined) ? undefined : thirdColumnCell.getAttribute('semanticObject');
        if (!utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[2].semanticObject)) {
            return false;
        }
        return true;
    };

    utils.validateTableContactAnnotationValues = function (cardXml, cardCfg, expectedTableRes) {
        var cellsXml = (cardXml.getElementsByTagName('cells')[0]);
        var actualValueToCheck;
        var actualValueToCheck = cellsXml.getElementsByTagName("QuickView");
        actualValueToCheck = actualValueToCheck ? "true" : "false";
        if (!utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[0].quickViewElement)) {
            return false;
        }
        return true;
    };

    utils.validateBarListSmartLinkValues = function (cardXml, cardCfg, expectedTableRes) {
        var cellsXml = cardXml.getElementsByClassName("sapOvpExtendedBarListHBox")[0];
        var barListVBoxLeft = cellsXml.children[0];
        var barListVBoxRight = cellsXml.children[1];
        var actualFirstSemanticObject = barListVBoxLeft.children[0].getAttribute("semanticObject");
        var actualSecondSemanticObject = barListVBoxLeft.children[1].getAttribute("semanticObject");
        var ActualContactAnnotation = barListVBoxRight.getElementsByTagName("QuickView");
        ActualContactAnnotation = ActualContactAnnotation ? "true" : "false";

        if (!utils.validateXMLValue(actualFirstSemanticObject, expectedTableRes.CustomListItem.firstDataFieldSemanticObject)) {
            return false;
        }

        if (!utils.validateXMLValue(actualSecondSemanticObject, expectedTableRes.CustomListItem.secondDataFieldSemanticObject)) {
            return false;
        }

        if (!utils.validateXMLValue(ActualContactAnnotation, expectedTableRes.CustomListItem.firstContactAnnotationQuickViewElement)) {
            return false;
        }
        return true;
    };

    utils.validateTableCenterAlignment = function (cardXml, cardCfg, expectedTableRes) {
        var cellsXml = (cardXml.getElementsByTagName('cells')[0]);
        var actualValueToCheck;
        var firstColumnCell = (cellsXml.getElementsByTagName("ObjectNumber")[0]);

        //check first column which contain dataFieldForAnnotation
        actualValueToCheck = firstColumnCell.getAttribute("class");
        if (!utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[0].className)) {
            return false;
        }
        return true;
    };

    utils._validateTableColumnsCells = function (cardXml, cardCfg, expectedTableRes) {

        var cellsXml = (cardXml.getElementsByTagName('cells')[0]);

        var actualValueToCheck;
        var firstColumnCell = cellsXml.firstElementChild;
        var SecondColumnCell = firstColumnCell.nextElementSibling;
        var thirdColumnCell = SecondColumnCell.nextElementSibling;
        var thirdColumnCellDataPoint = (cellsXml.getElementsByTagName('ObjectNumber')[0]);


        // first column title
        actualValueToCheck = undefined;
        if (expectedTableRes.items.ColumnListItem.cells[0].text) {
            actualValueToCheck = (firstColumnCell.getAttribute('text'));
        }
        if (!utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[0].text)) {
            return false;
        }

        // second column title
        actualValueToCheck = undefined;
        if (expectedTableRes.items.ColumnListItem.cells[1].text) {
            actualValueToCheck = (SecondColumnCell.getAttribute('text'));
        }
        if (!utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[1].text)) {
            return false;
        }

        // third column title
        actualValueToCheck = undefined;
        if (expectedTableRes.items.ColumnListItem.cells[2].text) {
            actualValueToCheck = (thirdColumnCell.getAttribute('text'));
        }
        if (!utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[2].text)) {
            return false;
        }

        actualValueToCheck = undefined;
        if (expectedTableRes.items.ColumnListItem.cells[2].number) {
            actualValueToCheck = (thirdColumnCellDataPoint.getAttribute('number'));
        }
        if (!utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[2].number)) {
            return false;
        }

        actualValueToCheck = undefined;
        if (expectedTableRes.items.ColumnListItem.cells[2].state) {
            actualValueToCheck = (thirdColumnCellDataPoint.getAttribute('state'));
        }
        if (!utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[2].state)) {
            return true;
        }

        return true;
    };

    utils._validateFlexibleTableColumnsCells = function (cardXml, cardCfg, expectedTableRes) {

        var cellsXml = (cardXml.getElementsByTagName('cells')[0]);

        var actualValueToCheck;
        var firstColumnCell = (cellsXml.getElementsByTagName('SmartLink')[0]);
        var thirdColumnCell = (cellsXml.getElementsByTagName('SmartLink')[1]);
        var secondColumnCellDataPoint = (cellsXml.getElementsByTagName('ObjectNumber')[0]);


        // first column
        actualValueToCheck = undefined;
        if (expectedTableRes.items.ColumnListItem.cells[0].text) {
            actualValueToCheck = (firstColumnCell.getAttribute('text'));
        }
        if (!utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[0].text)) {
            return false;
        }

        // second column
        actualValueToCheck = undefined;
        if (expectedTableRes.items.ColumnListItem.cells[1].number) {
            actualValueToCheck = (secondColumnCellDataPoint.getAttribute('number'));
        }
        if (!utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[1].number)) {
            return false;
        }

        actualValueToCheck = undefined;
        if (expectedTableRes.items.ColumnListItem.cells[1].state) {
            actualValueToCheck = (secondColumnCellDataPoint.getAttribute('state'));
        }
        if (!utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[1].state)) {
            return false;
        }

        // third column
        actualValueToCheck = undefined;
        if (expectedTableRes.items.ColumnListItem.cells[2].text) {
            actualValueToCheck = (thirdColumnCell.getAttribute('text'));
        }
        if (!utils.validateXMLValue(actualValueToCheck, expectedTableRes.items.ColumnListItem.cells[2].text)) {
            return false;
        }

        return true;
    };

    utils.createMetaModel = function (aBindingContextObject, oOdataProperty) {
        return {
            "getODataEntityType": function () {
                var oEntityType = {};
                oEntityType.$path = "somePath";
                return oEntityType;
            },
            "createBindingContext": function () {
                var oBindingContext = {};
                oBindingContext.getObject = function () {
                    return aBindingContextObject;
                };
                return oBindingContext;
            },
            "getODataAssociationEnd": function () {
                return " ";
            },
            "getODataProperty": function () {
                return oOdataProperty;
            }
        };
    };


    /**
     * iContext Mock for AnnotationHelper & ActionUtils formatter functions testing
     */
    utils.ContextMock = function (data) {
        // settings
        this.setting = {};
        this.setting._ovpCache = {};
        this.setting.ovpCardProperties = {};
        this.setting.ovpCardProperties.oData = {};
        this.model = {};

        if (data) {
            if (data.ovpCardProperties) {
                this.setting.ovpCardProperties.oData = data.ovpCardProperties;
            }
            if (data.model) {
                this.model = data.model;
            }
            if (data.object) {
                this.object = data.object;
            }
        }

        this.setting.ovpCardProperties.getProperty = function (sKey) {
            return this.oData[sKey];
        };

        this.setting.ovpCardProperties.getData = function () {
            return this.oData;
        };

        this.model.getProperty = function (sKey) {
            return this[sKey];
        };
    };

    utils.ContextMock.prototype.getSetting = function (settings) {
        return this.setting[settings];
    };
    utils.ContextMock.prototype.getModel = function () {
        return this.model;
    };
    utils.ContextMock.prototype.getPath = function () {
        return "";
    };
    utils.ContextMock.prototype.getObject = function () {
        return this.object;
    };

    utils.validateOvpKPIHeader = function (xml, expectedHeaderResult) {

        var headers = xml.getElementsByClassName("sapOvpCardHeader");
        if (!headers || headers.length == 0) {
            return false;
        }


        var bExpectedNumber = expectedHeaderResult.KPI && expectedHeaderResult.KPI.number ? true : false;
        var bExpectedSort = expectedHeaderResult.KPI && expectedHeaderResult.KPI.sortBy ? true : false;
        var bExpectedFilter = expectedHeaderResult.KPI && expectedHeaderResult.KPI.filterBy ? true : false;
        var bResult;


        var ovp = headers[0];
        var sapOvpKPIHeaderNumberValueStyle = ovp.getElementsByClassName("sapOvpKPIHeaderNumberValueStyle");

        // if data-point is configured - e.g. we should expect to have a number section in the KPI Header
        if (bExpectedNumber) {
            if (!sapOvpKPIHeaderNumberValueStyle || sapOvpKPIHeaderNumberValueStyle.length == 0) {
                return false;
            }


            // first we check the KPI header title
            var oOvpKpiHeaderTitle = ovp.getElementsByClassName("sapOvpKPIHeaderTitleStyle");
            if (oOvpKpiHeaderTitle && oOvpKpiHeaderTitle.length > 0) {

                oOvpKpiHeaderTitle = oOvpKpiHeaderTitle[0];
                var sHeaderTitleValue = oOvpKpiHeaderTitle.getAttribute('text');
                bResult = this.validateXMLValue(sHeaderTitleValue, expectedHeaderResult.KPI.headerTitleContent);
                if (!bResult) {
                    return false;
                }
            }

            // if number should exist - we check first the NumberAggregation Node
            var oNumberAggregateNumberContentNode = ovp.getElementsByClassName('sapOvpKPIHeaderAggregateNumber');
            if (oNumberAggregateNumberContentNode && oNumberAggregateNumberContentNode.length != 0) {

                // check for the filters:[] part of the singleton aggregation value of the NumericContent object
                var expectedAggregateNumber = expectedHeaderResult.KPI.numberAggregateNumberContent;
                // take singleton proeprty value
                var sSingletonValue = oNumberAggregateNumberContentNode[0].getAttribute('singleton');
                var sFiltersRegEx = /(filters: \[.*\])/;
                // extract the 'filters:[]' array part
                var aResults = sFiltersRegEx.exec(sSingletonValue);
                var sResult;

                // if filters are expected - we should be able to find them on the singleton value string
                if (bExpectedFilter) {
                    // check that all filters & all filtrs parts exist
                    sResult = aResults[0];
                    var aCurrFilter;
                    for (var i = 0; i < expectedAggregateNumber.filters.length; i++) {
                        aCurrFilter = expectedAggregateNumber.filters[i];
                        var sCurrFilterPart;

                        for (var j = 0; j < aCurrFilter.length; j++) {
                            sCurrFilterPart = aCurrFilter[j];
                            if (sResult.indexOf(sCurrFilterPart) === -1) {
                                return false;
                            }
                        }
                    }
                } else if (aResults && aResults.length > 0) {
                    // we need to make sure no filters exist on the Singleton value string
                    return false;
                }
            } else {
                return false;
            }

            // now we will check the value property of the NumericContent property value's
            var oNumericContentNode = ovp.getElementsByClassName('sapOvpKPIHeaderNumberValueStyle');
            if (oNumericContentNode && oNumericContentNode.length != 0) {
                oNumericContentNode = oNumericContentNode[0];
                var sValue = oNumericContentNode.getAttribute('value');

                bResult = this.validateXMLValue(sValue, expectedHeaderResult.KPI.numberNumericContentValue);
                if (!bResult) {
                    return false;
                }
            } else {
                return false;
            }

            /*---as per jira item 3595 Unit of Measure removed from Kpi header and added into the subtitle---*/
            // now we will check the value property of unit-of-measure
            /*var oUOMNode = ovp.getElementsByClassName('sapOvpKPIHeaderUnitOfMeasureStyle');
             if (oUOMNode && oUOMNode.length != 0) {
             oUOMNode =  oUOMNode[0];
             var sUOMValue = oUOMNode.getAttribute('text');

             bResult = this.validateXMLValue(sUOMValue, expectedHeaderResult.KPI.numberUOM);
             if (!bResult) {
             return false;
             }

             } else {
             return false;
             }
             */

            // if selectionVariant is configured - e.g. we should expect to have a Filter-By_values section in the KPI Header
            var sapOvpCardFilterStyle = ovp.getElementsByClassName("sapOvpKPIHeaderFilterStyle");
            if (bExpectedFilter && (!sapOvpCardFilterStyle || sapOvpCardFilterStyle.length == 0)) {
                return false;
            } else if (!bExpectedFilter && sapOvpCardFilterStyle && sapOvpCardFilterStyle.length > 0) {
                return false;
            }

            // if presentationVariant is configured - e.g. we should expect to have a SortBy section in the KPI Header
            var sapOvpKPIHeaderDimensionStyle = ovp.getElementsByClassName("sapOvpKPIHeaderDimensionStyle");
            if (bExpectedSort) {

                if (!sapOvpKPIHeaderDimensionStyle || sapOvpKPIHeaderDimensionStyle.length == 0) {
                    return false;
                } else {
                    // check the sort-by String
                    sapOvpKPIHeaderDimensionStyle = sapOvpKPIHeaderDimensionStyle[0];
                    var sSortByValue = sapOvpKPIHeaderDimensionStyle.getAttribute('text');
                    bResult = this.validateXMLValue(sSortByValue, expectedHeaderResult.KPI.sortByContent);
                    if (!bResult) {
                        return false;
                    }
                }
            } else if (!bExpectedSort) {
                if (sapOvpKPIHeaderDimensionStyle && sapOvpKPIHeaderDimensionStyle.length > 0) {
                    return false;
                }
            }
        } else if (sapOvpKPIHeaderNumberValueStyle && sapOvpKPIHeaderNumberValueStyle.length != 0) {
            // else if no data point configured we need to check it was not added
            return false;
        }

        return true;

    };

    utils.validateDropDown = function (xml, expectedResult) {
        if (sap.ui.Device.browser.msie === true || sap.ui.Device.browser.edge === true) {
            return true;
        }
        var ovp = xml.getElementsByClassName("sapOvpDropDown");
        if (expectedResult) {
            return ovp !== null;
        } else {
            return (ovp === undefined || ovp === null || ovp.length == 0 );
        }
    };

    return utils;

}, true);