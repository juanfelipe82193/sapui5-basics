/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ovp/ui/ComponentContainerDesigntimeMetadata", "sap/ovp/app/resources"],
    function (ComponentContainerDesigntimeMetadata, OvpResources) {
        "use strict";
        return {
            actions: {
                /*reveal: {
                    changeType: "unhideControl"
                }*/
            },
            aggregations: {
                content: {
                    domRef: ".sapUiComponentContainer",
                    actions: {
                        /*move: "moveControls",
                        changeOnRelevantContainer: true*/
                    },
                    propagateMetadata: function (oElement) {
                        var sType = oElement.getMetadata().getName();
                        if (sType === "sap.ui.core.ComponentContainer") {
                            return ComponentContainerDesigntimeMetadata;
                        } else {
				return {
                                    actions: "not-adaptable"
                                };
			}
                    },
                    propagateRelevantContainer: false
                }
            },
            name: {
                singular: OvpResources && OvpResources.getText("Card"),
                plural: OvpResources && OvpResources.getText("Cards")
            }
        };
    }, false);
