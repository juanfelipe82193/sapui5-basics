// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.appfinder.AppBox
 */
(function () {
    "use strict";
    /* module, ok, test, jQuery, sap */

    jQuery.sap.require("sap.ushell.ui.appfinder.AppBox");

    var appBox;

    module("sap.ushell.ui.appfinder.AppBox", {
        /**
         * This method is called before each test
         */

        setup: function () {
            appBox = new sap.ushell.ui.appfinder.AppBox();
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        teardown: function () {
            appBox.destroy();
        }
    });

    test("Test _getNumberOfLines check one line of title", function () {
        var jqTitle = {
            css: function(param) {
                return 18;
            },
            height: function () {
                return 18;
            }
        };
        var result = appBox._getNumberOfLines(jqTitle);
        ok(result === 1);
    });

    test("Test _getNumberOfLines check two lines of title", function () {
        var jqTitle = {
            css: function(param) {
                return 18;
            },
            height: function () {
                return 36;
            }
        };
        var result = appBox._getNumberOfLines(jqTitle);
        ok(result === 2);
    });

    test("Test _getNumberOfLines check one line of subtitle", function () {
        var jqSubtitle = {
            css: function(param) {
                return 16;
            },
            height: function () {
                return 16;
            }
        };
        var result = appBox._getNumberOfLines(jqSubtitle);
        ok(result === 1);
    });

    test("Test _getNumberOfLines check two lines of subtitle", function () {
        var jqSubtitle = {
            css: function(param) {
                return 16;
            },
            height: function () {
                return 32;
            }
        };
        var result = appBox._getNumberOfLines(jqSubtitle);
        ok(result === 2);
    });

    test("Test _adjustHeaderElementsHeight, title 1 line and subtitle 1 line", function () {
        var titleElement = {
            addClass: function (x) {
                return;
            }
        };
        var subtitleElement = {
            addClass: function (x) {
                return;
            }
        };

        var titleAddClassSpy = sinon.spy(titleElement, "addClass");
        var subtitleAddClassSpy = sinon.spy(subtitleElement, "addClass");

        var stub = sinon.stub(appBox,"$",function () {
            return {
                find: function (sClassName) {
                    if (sClassName === ".sapUshellAppBoxTitle") {
                        return titleElement;

                    } else {
                        return subtitleElement;
                    }
                }
            }
        });

        var stub = sinon.stub(appBox,"_getNumberOfLines",function (element) {
            return 1;
        });

        appBox._adjustHeaderElementsHeight();
        ok(titleAddClassSpy.calledWith("sapUshellAppBoxHeaderElementOneLine"));
        ok(subtitleAddClassSpy.calledWith("sapUshellAppBoxHeaderElementTwoLines"));
        appBox._getNumberOfLines.restore();
        appBox.$.restore();
        titleElement.addClass.restore();
        subtitleElement.addClass.restore();
    });

    test("Test _adjustHeaderElementsHeight, title 1 line and subtitle 2 line", function () {
        var titleElement = {
            addClass: function (x) {
                return;
            }
        };
        var subtitleElement = {
            addClass: function (x) {
                return;
            }
        };

        var titleAddClassSpy = sinon.spy(titleElement, "addClass");
        var subtitleAddClassSpy = sinon.spy(subtitleElement, "addClass");

        var stub = sinon.stub(appBox,"$",function () {
            return {
                find: function (sClassName) {
                    if (sClassName === ".sapUshellAppBoxTitle") {
                        return titleElement;

                    } else {
                        return subtitleElement;
                    }
                }
            }
        });

        var stub = sinon.stub(appBox,"_getNumberOfLines",function (element) {
            if (element === titleElement) {
                return 1
            } else {
                return 2;
            }
        });

        appBox._adjustHeaderElementsHeight();
        ok(titleAddClassSpy.calledWith("sapUshellAppBoxHeaderElementOneLine"));
        ok(subtitleAddClassSpy.calledWith("sapUshellAppBoxHeaderElementTwoLines"));
        appBox._getNumberOfLines.restore();
        appBox.$.restore();
        titleElement.addClass.restore();
        subtitleElement.addClass.restore();
    });

    test("Test _adjustHeaderElementsHeight, title 2 line and subtitle 1 line", function () {
        var titleElement = {
            addClass: function (x) {
                return;
            }
        };
        var subtitleElement = {
            addClass: function (x) {
                return;
            }
        };

        var titleAddClassSpy = sinon.spy(titleElement, "addClass");
        var subtitleAddClassSpy = sinon.spy(subtitleElement, "addClass");

        var stub = sinon.stub(appBox,"$",function () {
            return {
                find: function (sClassName) {
                    if (sClassName === ".sapUshellAppBoxTitle") {
                        return titleElement;

                    } else {
                        return subtitleElement;
                    }
                }
            }
        });

        var stub = sinon.stub(appBox,"_getNumberOfLines",function (element) {
            if (element === titleElement) {
                return 2
            } else {
                return 1;
            }
        });

        appBox._adjustHeaderElementsHeight();
        ok(titleAddClassSpy.calledWith("sapUshellAppBoxHeaderElementTwoLines"));
        ok(subtitleAddClassSpy.calledWith("sapUshellAppBoxHeaderElementOneLine"));
        appBox._getNumberOfLines.restore();
        appBox.$.restore();
        titleElement.addClass.restore();
        subtitleElement.addClass.restore();
    });

    test("Test _adjustHeaderElementsHeight, title 2 line and subtitle 2 line", function () {
        var titleElement = {
            addClass: function (x) {
                return;
            }
        };
        var subtitleElement = {
            addClass: function (x) {
                return;
            }
        };

        var titleAddClassSpy = sinon.spy(titleElement, "addClass");
        var subtitleAddClassSpy = sinon.spy(subtitleElement, "addClass");

        var stub = sinon.stub(appBox,"$",function () {
            return {
                find: function (sClassName) {
                    if (sClassName === ".sapUshellAppBoxTitle") {
                        return titleElement;

                    } else {
                        return subtitleElement;
                    }
                }
            }
        });

        var stub = sinon.stub(appBox,"_getNumberOfLines",function (element) {
            if (element === titleElement) {
                return 2
            } else {
                return 2;
            }
        });

        appBox._adjustHeaderElementsHeight();
        ok(titleAddClassSpy.calledWith("sapUshellAppBoxHeaderElementTwoLines"));
        ok(subtitleAddClassSpy.calledWith("sapUshellAppBoxHeaderElementOneLine"));
        appBox._getNumberOfLines.restore();
        appBox.$.restore();
        titleElement.addClass.restore();
        subtitleElement.addClass.restore();
    });

}());
