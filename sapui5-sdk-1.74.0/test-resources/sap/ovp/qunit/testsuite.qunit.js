sap.ui.define(function () {
    "use strict";

    return {
        /*
         * Name of the test suite.
         *
         * This name will be used in the title of the index page / testsuite page.
         */
        name: "Qunit Test suite for OVP",


        /*
         * An Object with default settings for all tests.
         *
         * The defaults and the test configuration will be merged recursively in a way
         * that the merge contains properties from both, defaults and test config;
         * if a property is defined by both config objects, the value from the test config will be used.
         * There's no special handling for other types of values, e.g an array value in the defaults
         * will be replaced by an array value in the test config.
         */
        defaults: {
            qunit: {
                version: 1
            },
            ui5: {
                noConflict: true,
                theme: "sap_belize",
                language: "en",
                libs: ["sap.m", "sap.ui.layout", "sap.ui.commons", "sap.ui.comp", "sap.ui.generic.app", "sap.ui.rta"],
                "xx-waitForTheme": true,
                resourceRoots: {
                    "sap.ovp.test": "../../../../sap/ovp/"
                }
            },
            sinon: {
                version: 1
            },
            loader: {
                paths: {}
            }
            //bootCore: true
        },


        /*
         * A map with the individual test configurations, keyed by a unique test name.
         *
         * There's no technical limitation for the length or the characters of the test names.
         * The name will be used only in the overview page showing all tests of your suite.
         *
         * But by default, the name is also used to derive the ID of the module that contains the test cases.
         * It is therefore suggested to use module ID like names (no blanks, no special chars other than / or dot)
         * If you have multiple tests that execute the same module but with different configurations
         * (e.g. different QUnit versions or different URL parameters), you have to make up unique names
         * and manually configure the module IDs for them.
         */
        tests: {
                "MainControllerJs": {
                    module: "test-resources/sap/ovp/qunit/app/Main.qunit",
                    title: "QUnit: /lib/ExtensionPointTest",
                    group: "qunit @/lib"
                },
                "CommonUtilsJs": {
                    module: "test-resources/sap/ovp/qunit/cards/CommonUtils.qunit",
                    title: "QUnit: /lib/ExtensionPointTest",
                    group: "qunit @/lib"
                },
              "SettingsUtilsJs": {
                  module: "test-resources/sap/ovp/qunit/cards/SettingsUtils.qunit",
                  title: "QUnit: /lib/ExtensionPointTest",
                  group: "qunit @/lib"
              },
              "PersonalizationUtilsJs": {
                  module: "test-resources/sap/ovp/qunit/cards/PersonalizationUtils.qunit",
                  title: "QUnit: /lib/ExtensionPointTest",
                  group: "qunit @/lib"
              },
              "PayLoadUtilsJs": {
                  module: "test-resources/sap/ovp/qunit/cards/PayLoadUtils.qunit",
                  title: "QUnit: /lib/ExtensionPointTest",
                  group: "qunit @/lib"
              },
              "OVPCardAsAPIUtilsJs": {
                  module: "test-resources/sap/ovp/qunit/cards/OVPCardAsAPIUtils.qunit",
                  title: "QUnit: /lib/ExtensionPointTest",
                  group: "qunit @/lib"
              },
              "AnnotationHelperJs": {
                  module: "test-resources/sap/ovp/qunit/cards/AnnotationHelper.qunit",
                  title: "QUnit: /lib/ExtensionPointTest",
                  group: "qunit @/lib"
              },
              "ActionUtilsJs": {
                  module: "test-resources/sap/ovp/qunit/cards/ActionUtils.qunit",
                  title: "QUnit: /lib/ExtensionPointTest",
                  group: "qunit @/lib"
              },
              "UIActionsJs": {
                  module: "test-resources/sap/ovp/qunit/ui/UIActions.qunit",
                  title: "QUnit: /lib/ExtensionPointTest",
                  group: "qunit @/lib"
              },
              "ObjectStreamJs": {
                  module: "test-resources/sap/ovp/qunit/ui/ObjectStream.qunit",
                  title: "QUnit: /lib/ExtensionPointTest",
                  group: "qunit @/lib"
              },
              "EasyScanLayoutJs": {
                  module: "test-resources/sap/ovp/qunit/ui/EasyScanLayout.qunit",
                  title: "QUnit: /lib/ExtensionPointTest",
                  group: "qunit @/lib"
              },
              "DashboardLayoutUtilJs": {
                  module: "test-resources/sap/ovp/qunit/ui/DashboardLayoutUtil.qunit",
                  title: "QUnit: /lib/ExtensionPointTest",
                  group: "qunit @/lib"
              },
              "DashboardLayoutModelJs": {
                  module: "test-resources/sap/ovp/qunit/ui/DashboardLayoutModel.qunit",
                  title: "QUnit: /lib/ExtensionPointTest",
                  group: "qunit @/lib"
              },
              "AnalyticalCardWaterfallJs": {
                 module: "test-resources/sap/ovp/qunit/cards/charts/analytical/analyticalCard.waterfall.qunit",
                 title: "QUnit: /lib/ExtensionPointTest",
                 group: "qunit @/lib"
             },
             "AnalyticalCardVerticleJs": {
                 module: "test-resources/sap/ovp/qunit/cards/charts/analytical/analyticalCard.vertical.qunit",
                 title: "QUnit: /lib/ExtensionPointTest",
                 group: "qunit @/lib"
             },
             "AnalyticalCardStackedColumnJs": {
                 module: "test-resources/sap/ovp/qunit/cards/charts/analytical/analyticalCard.stackedColumn.qunit",
                 title: "QUnit: /lib/ExtensionPointTest",
                 group: "qunit @/lib"
             },
             "AnalyticalCardScatterJs": {
                 module: "test-resources/sap/ovp/qunit/cards/charts/analytical/analyticalCard.scatter.qunit",
                 title: "QUnit: /lib/ExtensionPointTest",
                 group: "qunit @/lib"
             },
             "AnalyticalCardLineJs": {
                 module: "test-resources/sap/ovp/qunit/cards/charts/analytical/analyticalCard.line.qunit",
                 title: "QUnit: /lib/ExtensionPointTest",
                 group: "qunit @/lib"
             },
             "AnalyticalCardDualCombinationJs": {
                 module: "test-resources/sap/ovp/qunit/cards/charts/analytical/analyticalCard.dualCombination.qunit",
                 title: "QUnit: /lib/ExtensionPointTest",
                 group: "qunit @/lib"
             },
             "AnalyticalCardDonutJs": {
                 module: "test-resources/sap/ovp/qunit/cards/charts/analytical/analyticalCard.donut.qunit",
                 title: "QUnit: /lib/ExtensionPointTest",
                 group: "qunit @/lib"
             },
             "AnalyticalCardCombinationJs": {
                 module: "test-resources/sap/ovp/qunit/cards/charts/analytical/analyticalCard.combination.qunit",
                 title: "QUnit: /lib/ExtensionPointTest",
                 group: "qunit @/lib"
             },
             "AnalyticalCardColumnJs": {
                 module: "test-resources/sap/ovp/qunit/cards/charts/analytical/analyticalCard.column.qunit",
                 title: "QUnit: /lib/ExtensionPointTest",
                 group: "qunit @/lib"
             },
             "AnalyticalCardBubbleJs": {
                 module: "test-resources/sap/ovp/qunit/cards/charts/analytical/analyticalCard.bubble.qunit",
                 title: "QUnit: /lib/ExtensionPointTest",
                 group: "qunit @/lib"
             },
             "GenericChartFunctionsJs": {
                 module: "test-resources/sap/ovp/qunit/cards/charts/genericChartFunctions.qunit",
                 title: "QUnit: /lib/ExtensionPointTest",
                 group: "qunit @/lib"
             },
             "StackJs": {
                module: "test-resources/sap/ovp/qunit/cards/stack/Stack.qunit",
                title: "QUnit: /lib/ExtensionPointTest",
                group: "qunit @/lib"
            },
            "QuickViewJs": {
                module: "test-resources/sap/ovp/qunit/cards/quickview/Quickview.qunit",
                title: "QUnit: /lib/ExtensionPointTest",
                group: "qunit @/lib"
            },
            "GenericJs": {
                module: "test-resources/sap/ovp/qunit/cards/generic/Generic.qunit",
                title: "QUnit: /lib/ExtensionPointTest",
                group: "qunit @/lib"
            },
            "ComponentJs": {
                module: "test-resources/sap/ovp/qunit/app/Component.qunit",
                title: "QUnit: /lib/ExtensionPointTest",
                group: "qunit @/lib"
            },
            "ListJs": {
                module: "test-resources/sap/ovp/qunit/cards/list/List.qunit",
                title: "QUnit: /lib/ExtensionPointTest",
                group: "qunit @/lib"
            },
            "TableJs": {
                module: "test-resources/sap/ovp/qunit/cards/table/Table.qunit",
                title: "QUnit: /lib/ExtensionPointTest",
                group: "qunit @/lib"
            },
            "SettingsDialogJs": {
                module: "test-resources/sap/ovp/qunit/cards/rta/SettingsDialog.qunit",
                title: "QUnit: /lib/ExtensionPointTest",
                group: "qunit @/lib"
            }
        }
    };






});