sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "jquery.sap.global",
    "sap/ovp/cards/CommonUtils",
    "/sap/ovp/ui/DashboardLayoutUtil"
],function (utils, mockservers, jquery, CommonUtils, DashboardLayoutUtil) {
            "use strict";
            /* module, ok, test, jQuery, sap */
            //jQuery.sap.require("sap.ovp.ui.DashboardLayoutUtil");
            //jQuery.sap.require("sap.ovp.ui.DashboardLayoutModel");
            //jQuery.sap.require("sap.ovp.app.Component");
            //jQuery.sap.require("sap.ovp.test.qunit.cards.utils");
            //jQuery.sap.require("sap/ui/Device");
            //jQuery.sap.require("sap/ovp/cards/CommonUtils");

            var utils = utils,
                    Device = sap.ui.Device,
                    CommonUtils = CommonUtils;
            var oComponent, oModel;
            var iDashboardWidth = jQuery(window).width();

            module("sap.ovp.ui.DashboardLayoutUtil", {
                /**
                 * This method is called before each test
                 */
                setup: function () {
                    //jQuery.sap.require("sap.ovp.test.mockservers");
                    mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
                    if (!this.dashboardLayoutUtil) {
                        this.dashboardLayoutUtil = new DashboardLayoutUtil();
                    }
                },
                /**
                 * This method is called after each test. Add every restoration code here
                 *
                 */
                teardown: function () {
                }
            });

            test("Constructor Test", function () {
                ok(this.dashboardLayoutUtil.ROW_HEIGHT_PX === 16, "initial Row height should be 16 px");
                ok(this.dashboardLayoutUtil.MIN_COL_WIDTH_PX === 320, "initial Column height should be 320 px");
                ok(this.dashboardLayoutUtil.CARD_BORDER_PX === 8, "initial Card border should be 8 px");
                ok(this.dashboardLayoutUtil.EXTRA_MARGIN === 8, "initial Extra margin should be 8 px, this is required for dynamicPageHeader");
                ok(this.dashboardLayoutUtil.oLayoutData.layoutWidthPx === 1680, "initial layout width is assumed as 1680 px");
                ok(this.dashboardLayoutUtil.oLayoutData.contentWidthPx === 1600, "initial content width is assumed as 1600 px");
                ok(this.dashboardLayoutUtil.oLayoutData.colCount === 5, "initial number of columns is set as 5");

                //transform based on browser settings
                switch (true) {
                    case Device.browser.webkit:
                        ok(this.dashboardLayoutUtil.cssVendorTransition === "-webkit-transition", "transition settings for webkit");
                        ok(this.dashboardLayoutUtil.cssVendorTransform === "-webkit-transform", "transform settings for webkit");
                        break;
                    case Device.browser.msie:
                        ok(this.dashboardLayoutUtil.cssVendorTransition = "-ms-transition", "transition settings for ie");
                        ok(this.dashboardLayoutUtil.cssVendorTransform = "-ms-transform", "transform settings for ie");
                        break;
                    case Device.browser.mozilla:
                        ok(this.dashboardLayoutUtil.cssVendorTransition = "-moz-transition", "transition settings for mozilla");
                        ok(this.dashboardLayoutUtil.cssVendorTransform = "-moz-transform", "transform settings for mozilla");
                        break;
                    default:
                        ok(this.dashboardLayoutUtil.cssVendorTransition = "transition", "default transition settings");
                        ok(this.dashboardLayoutUtil.cssVendorTransform = "transform", "default transform settings");
                }
            });

            test("Test to update layout data", function () {
                var updateLayoutData = this.dashboardLayoutUtil.updateLayoutData(iDashboardWidth);
                var iDashboardMargin = updateLayoutData.marginPx,
                        iExtraSpaceForDesktop = 0,
                        iSmallScreenWidth = 320,
                        iMiddleScreenWidth = 1024,
                        iCardMargin = this.dashboardLayoutUtil.CARD_BORDER_PX,
                        iMargin = this.dashboardLayoutUtil.EXTRA_MARGIN,
                        iNewScreenWidth = iDashboardWidth + iDashboardMargin,
                        iDashboardMarginLeft,
                        iDashboardMarginRight; //iDashboardWidth is without left margin
                ok(this.dashboardLayoutUtil.oLayoutData.layoutWidthPx === iDashboardWidth, "screen width changes accordingly. Expected: " + iDashboardWidth +
                " Actual: " + this.dashboardLayoutUtil.oLayoutData.layoutWidthPx);

                if (iNewScreenWidth <= iSmallScreenWidth) {
                    ok(iDashboardMargin === (this.dashboardLayoutUtil.convertRemToPx(0.5) - iCardMargin), "case for small screens. Actual: " + iDashboardMargin +
                    " Expected: " + (this.dashboardLayoutUtil.convertRemToPx(0.5) - iCardMargin));
                } else if (iNewScreenWidth <= iMiddleScreenWidth) {
                    ok(iDashboardMargin === (this.dashboardLayoutUtil.convertRemToPx(1) - iCardMargin), "case for mid size screens. Actual: " + iDashboardMargin +
                    " Expected: " + (this.dashboardLayoutUtil.convertRemToPx(1) - iCardMargin));

                } else {
                    ok(iDashboardMargin === (this.dashboardLayoutUtil.convertRemToPx(3) - iCardMargin), "default case: Expected : " +
                    (this.dashboardLayoutUtil.convertRemToPx(3) - iCardMargin) + " Actual: " + iDashboardMargin);
                }
                if (iDashboardMargin !== this.dashboardLayoutUtil.oLayoutData.marginPx) {
                    ok(this.dashboardLayoutUtil.oLayoutData.marginPx === iDashboardMargin, "new margin is set");
                }

                ok(this.dashboardLayoutUtil.oLayoutData.colCount === Math.round(this.dashboardLayoutUtil.oLayoutData.contentWidthPx / this.dashboardLayoutUtil.MIN_COL_WIDTH_PX),
                        "calculate the extra space for vertical scroll bar on the desktop");
                if (this.dashboardLayoutUtil.oLayoutData.colCount === 0) {
                    ok(this.dashboardLayoutUtil.oLayoutData.colCount === 1, "single column layout");
                }
                ok(this.dashboardLayoutUtil.oLayoutData.colWidthPx === this.dashboardLayoutUtil.oLayoutData.contentWidthPx / this.dashboardLayoutUtil.oLayoutData.colCount, "column width calculation correct");
            });

            test("Test to convert Rem to px", function () {
                var iExpected = "4 px";
                var iActual = this.dashboardLayoutUtil.convertRemToPx(iExpected);

                if (typeof iExpected === "string" || iExpected instanceof String) { //take string with a rem unit
                    iExpected = iExpected.length > 0 ? parseInt(iExpected.split("rem")[0], 10) : 0;
                }
                iExpected = iExpected * CommonUtils.getPixelPerRem();
                ok(iActual === iExpected, "");
            });

            test("Test to convert px to Rem", function () {
                var iExpected = "8 rem";
                var iActual = this.dashboardLayoutUtil.convertPxToRem(iExpected);

                if (typeof iExpected === "string" || iExpected instanceof String) { //take string with a rem unit
                    iExpected = iExpected.length > 0 ? parseInt(iExpected.split("rem")[0], 10) : 0;
                }
                iExpected = iExpected / CommonUtils.getPixelPerRem();
                ok(iActual === iExpected, "");
            });

            test("test getDashboardLayoutModel", function () {
                ok(this.dashboardLayoutUtil.getDashboardLayoutModel() === this.dashboardLayoutUtil.dashboardLayoutModel, "should return the dashboardLayoutModel instance");
            });

            test("test getCards with colCount 0", function () {
                this.dashboardLayoutUtil.aCards = [{
                    "id": "card001",
                    "model": "salesOrder",
                    "template": "sap.ovp.cards.list",
                    "dashboardLayout": {
                        "autoSpan": true,
                        "colSpan": 1,
                        "column": 1,
                        "containerLayout": "resizable",
                        "headerHeight": 82,
                        "height": "192px",
                        "iCardBorderPx": 8,
                        "iRowHeightPx": 16,
                        "itemHeight": 64,
                        "left": "0px",
                        "maxColSpan": 1,
                        "noOfItems": 3,
                        "row": 1,
                        "rowSpan": 12,
                        "showOnlyHeader": false,
                        "top": "0px",
                        "visible": true,
                        "width": "380px"
                    },
                    "settings": {
                        "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                        "customParams": "getParameters",
                        "defaultSpan": {rows: 3, cols: 1},
                        "entitySet": "ProductSet",
                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#identify1",
                        "listType": "condensed",
                        "sortBy": "Availability_Status",
                        "sortOrder": "Descending",
                        "subTitle": "Less than 10 in stock",
                        "title": "Reorder Soon"
                    }

                }];
                ok(this.dashboardLayoutUtil.getCards(0) === this.dashboardLayoutUtil.aCards, "should return array of cards");
            });

            test("test getCards with colCount 5", function () {
                this.dashboardLayoutUtil.aCards = [{
                    "id": "card001",
                    "model": "salesOrder",
                    "template": "sap.ovp.cards.list",
                    "dashboardLayout": {
                        "autoSpan": true,
                        "colSpan": 1,
                        "column": 1,
                        "containerLayout": "resizable",
                        "headerHeight": 82,
                        "height": "192px",
                        "iCardBorderPx": 8,
                        "iRowHeightPx": 16,
                        "itemHeight": 64,
                        "left": "0px",
                        "maxColSpan": 1,
                        "noOfItems": 3,
                        "row": 1,
                        "rowSpan": 12,
                        "showOnlyHeader": false,
                        "top": "0px",
                        "visible": true,
                        "width": "380px"
                    },
                    "settings": {
                        "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                        "customParams": "getParameters",
                        "defaultSpan": {rows: 3, cols: 1},
                        "entitySet": "ProductSet",
                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#identify1",
                        "listType": "condensed",
                        "sortBy": "Availability_Status",
                        "sortOrder": "Descending",
                        "subTitle": "Less than 10 in stock",
                        "title": "Reorder Soon"
                    }

                }];
                this.dashboardLayoutUtil.dashboardLayoutModel.getCards = function () {
                    return this.dashboardLayoutUtil.aCards;
                }.bind(this);
                ok(this.dashboardLayoutUtil.getCards(5) === this.dashboardLayoutUtil.aCards, "should return array of cards");
            });

            test("test resizeLayout function", function () {
                this.dashboardLayoutUtil.aCards = [{
                    "id": "card001",
                    "model": "salesOrder",
                    "template": "sap.ovp.cards.list",
                    "dashboardLayout": {
                        "autoSpan": true,
                        "colSpan": 1,
                        "column": 1,
                        "containerLayout": "resizable",
                        "headerHeight": 82,
                        "height": "192px",
                        "iCardBorderPx": 8,
                        "iRowHeightPx": 16,
                        "itemHeight": 64,
                        "left": "0px",
                        "maxColSpan": 1,
                        "noOfItems": 3,
                        "row": 1,
                        "rowSpan": 12,
                        "showOnlyHeader": false,
                        "top": "0px",
                        "visible": true,
                        "width": "380px"
                    },
                    "settings": {
                        "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                        "customParams": "getParameters",
                        "defaultSpan": {rows: 3, cols: 1},
                        "entitySet": "ProductSet",
                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#identify1",
                        "listType": "condensed",
                        "sortBy": "Availability_Status",
                        "sortOrder": "Descending",
                        "subTitle": "Less than 10 in stock",
                        "title": "Reorder Soon"
                    }

                }];
                this.dashboardLayoutUtil.dashboardLayoutModel.getCards = function () {
                    return this.dashboardLayoutUtil.aCards;
                }.bind(this);
                this.dashboardLayoutUtil.dashboardLayoutModel._removeSpaceBeforeCard = function () {

                }.bind(this);
                this.dashboardLayoutUtil.oLayoutCtrl.fireAfterDragEnds = function () {

                }.bind(this);

                ok(this.dashboardLayoutUtil.resizeLayout() === undefined, "by default function returns undefined");
            });

            test("test getCardDomId function", function () {
                this.dashboardLayoutUtil.layoutDomId = "mainView--ovpLayout";
                ok(this.dashboardLayoutUtil.getCardDomId("card00") === "mainView--ovpLayout--card00", "should return the card dom id mainView--ovpLayout--card00");
            });

            test("test getCardId function", function () {
                ok(this.dashboardLayoutUtil.getCardId("mainView--ovpLayout--card00") === "card00", "should return the card id card00");
            });

            test("test getCardIdFromComponent function", function () {
                ok(this.dashboardLayoutUtil.getCardIdFromComponent("mainView--card00") === "card00", "should return the card id card00 from card component id");
            });

            test("test _getCardComponentDomId function", function () {
                this.dashboardLayoutUtil.componentDomId = "mainView";
                ok(this.dashboardLayoutUtil._getCardComponentDomId("card00") === "mainView--card00", "should return the card component dom id mainView--card00 from card id card00");
            });

            test("test getLayoutWidthPx function", function () {
                ok(this.dashboardLayoutUtil.getLayoutWidthPx() === 1600, "should return this.oLayoutData.colCount * this.oLayoutData.colWidthPx = 5 * 320 = 1600");
            });

            test("test getColWidthPx function", function () {
                ok(this.dashboardLayoutUtil.getColWidthPx() === 320, "should return this.oLayoutData.colWidthPx = 320");
            });

            test("test getRowHeightPx function", function () {
                ok(this.dashboardLayoutUtil.getRowHeightPx() === 16, "should return this.oLayoutData.rowHeightPx = 16");
            });

            test("test _setColCount function", function () {
                this.dashboardLayoutUtil._setColCount(4)
                ok(this.dashboardLayoutUtil.oLayoutData.colCount === 4, "should return colCount = 16");
            });

            test("test isCardAutoSpan function", function () {
                this.dashboardLayoutUtil.dashboardLayoutModel.aCards = [{
                    "id": "card001",
                    "model": "salesOrder",
                    "template": "sap.ovp.cards.list",
                    "dashboardLayout": {
                        "autoSpan": true,
                        "colSpan": 1,
                        "column": 1,
                        "containerLayout": "resizable",
                        "headerHeight": 82,
                        "height": "192px",
                        "iCardBorderPx": 8,
                        "iRowHeightPx": 16,
                        "itemHeight": 64,
                        "left": "0px",
                        "maxColSpan": 1,
                        "noOfItems": 3,
                        "row": 1,
                        "rowSpan": 12,
                        "showOnlyHeader": false,
                        "top": "0px",
                        "visible": true,
                        "width": "380px"
                    },
                    "settings": {
                        "annotationPath": "com.sap.vocabularies.UI.v1.LineItem#ReorderSoon",
                        "customParams": "getParameters",
                        "defaultSpan": {rows: 3, cols: 1},
                        "entitySet": "ProductSet",
                        "identificationAnnotationPath": "com.sap.vocabularies.UI.v1.Identification#identify1",
                        "listType": "condensed",
                        "sortBy": "Availability_Status",
                        "sortOrder": "Descending",
                        "subTitle": "Less than 10 in stock",
                        "title": "Reorder Soon"
                    }

                }];
                ok(this.dashboardLayoutUtil.isCardAutoSpan("card00") === true, "should return the autospan of card with id card00");
            });


        });