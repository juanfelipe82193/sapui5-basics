// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/core/dnd/DragAndDrop",
    "sap/ushell/opa/tests/homepage/pages/i18n/resources",
    "sap/ushell/resources",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/PropertyStrictEquals",
    "sap/ui/test/actions/EnterText"
], function (Opa5, Press, DragAndDrop, resources, ushellResources, Properties, PropertyStrictEquals, EnterText) {
    "use strict";

    var sViewName = "PageDetailEdit";

    // some functions to allow testing drag'n'drop with OPA
    function createNativeDragEventDummy (sEventType) {
        var oEvent = document.createEvent("Event");
        oEvent.initEvent(sEventType, true, true); // bubbles and cancelable both set to true
        oEvent.dataTransfer = {
            types: [],
            dropEffect: "",
            setData: function () { }
        };
        return oEvent;
    }

    function createjQueryDragEventDummy (sEventType, oTargetControl) {
        var oEvent = new jQuery.Event(sEventType);
        oEvent.target = oTargetControl.getDomRef();
        oEvent.originalEvent = createNativeDragEventDummy(sEventType);
        return oEvent;
    }

    function doDrag (sEventType, oTargetControl, sTriggerEventType) {
        // mimics the behavior of focusing the target control when starting a drag (since pressing on an element focuses it)
        if (document.activeElement && (document.activeElement !== oTargetControl.getFocusDomRef()) && (sEventType === "dragstart")) {
            oTargetControl.focus();
        }

        var oEvent = createjQueryDragEventDummy(sEventType, oTargetControl);
        DragAndDrop.preprocessEvent(oEvent);
        oTargetControl.$().trigger((sTriggerEventType || oEvent)); // "sTriggerEventType" is optional
        return oEvent;
    }

    Opa5.createPageObjects({
        onThePageComposerDetailEditPage: {
            actions: {
                iPressTheToggleCatalogsButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "toggleCatalogsButton",
                        actions: new Press()
                    });
                },
                iPressTheLayoutCancelButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "layoutButtonCancel",
                        actions: new Press()
                    });
                },
                iPressTheLayoutSaveButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "layoutButtonSave",
                        actions: new Press()
                    });
                },
                iPressTheEditHeaderButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "buttonEditHeader",
                        actions: new Press()
                    });
                },
                iPressTheRoleContextButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "contextSelectorButton",
                        actions: new Press()
                    });
                },
                iPressThePagePreviewButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "buttonPreview",
                        actions: new Press()
                    });
                },
                iPressTheMessagePopoverButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "layoutButtonMessage",
                        actions: new Press()
                    });
                },
                // Tries to press on the OverflowToolbar's "overflow" button to open the overflow popover,
                // does nothing if the button is not showing.
                iPressTheTileSelectorToolbarOverflowButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "tileSelectorToolbar",
                        actions: function (oToolbar) {
                            var oOverflowButton = oToolbar.getAggregation("_overflowButton");
                            if (oOverflowButton.isActive()) {
                                oOverflowButton.firePress();
                            }
                        }
                    });
                },
                iExpandTheHeaderIfCollapsed: function () { // does nothing if the "sap.f.DynamicPage" header is already expanded
                    return this.waitFor({
                        viewName: sViewName,
                        id: "pageDetailEdit",
                        actions: function (oDynamicPage) {
                            if (!oDynamicPage.getHeaderExpanded()) {
                                oDynamicPage.setHeaderExpanded(true);
                            }
                        }
                    });
                },
                /* WARNING: This index corresponds to the order in which the buttons on the page were found.
                 * In some browsers this does not necessarily correspond to the visible order on the page.
                 * Hence, don't rely on this while creating tests.
                 * TODO: Fix this behaviour by selecting the buttons via ID. However, providing IDs for the
                 * "Add Section" buttons is not trivial but should be done in the future.
                 * Afterwards, rewrite this function e.g. as such:
                    // iPressTheAddSectionButtonWithIndex: function (nButtonIndex) {
                    //     return this.waitFor({
                    //         viewName: sViewName,
                    //         id: "addSectionButton_"+nButtonIndex,
                    //         actions: new Press()
                    //     });
                    // },
                 */
                iPressTheAddSectionButtonWithIndex: function (nButtonIndex) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        viewName: sViewName,
                        matchers: function (oButton) {
                            return oButton.getText() === ushellResources.i18n.getText("Page.Button.AddSection");
                        },
                        check: function (aButtons) {
                            return !!aButtons[nButtonIndex];
                        },
                        success: function (aButtons) {
                            aButtons[nButtonIndex].firePress();
                        }
                    });
                },
                iRenameASection: function (sOldSectionTitle, sNewSectionTitle) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Input",
                        id: /title-edit$/,
                        matchers: new Properties({ value: sOldSectionTitle }),
                        check: function (aInputs) {
                            return aInputs.length === 1;
                        },
                        actions: new EnterText({ text: sNewSectionTitle })
                    });
                },
                iPressTheDeleteSectionButtonWithIndex: function (nButtonIndex) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: new RegExp("page-" + nButtonIndex + "--delete"),
                        actions: new Press()
                    });
                },
                iCloseTheTileSelectorToolbarOverflowPopover: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "tileSelectorToolbar",
                        actions: function (oControl) {
                            oControl.closeOverflow();
                        }
                    });
                },
                iPressATileSelectorTileInfoButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Button",
                        id: /tileSelectorTileButtonInfo/,
                        check: function (aControls) {
                            return !!aControls.length;
                        },
                        success: function (aControls) {
                            aControls[0].firePress();
                        }
                    });
                },
                iPressASectionTile: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.ui.launchpad.VizInstanceLocal",
                        check: function (aControls) {
                            return !!aControls.length;
                        },
                        success: function (aControls) {
                            aControls[0].firePress();
                        }
                    });
                },
                iCloseTheTileInfoPopover: function () {
                    return this.waitFor({
                        controlType: "sap.m.ResponsivePopover",
                        id: "tileInfoPopover",
                        success: function (oControl) {
                            oControl.close();
                        }
                    });
                },

                // Drag and Drop
                /**
                 * @param {string} sTileTitle Title of the tile to drag.
                 * @param {string} sSectionTitle Title of the section to drop the tile to.
                 * @param {number} [nCatalogIndex = 0] In case there are multiple tiles with the same title, specify the catalog index.
                 */
                iDragATileFromTheTileSelectorToASection: function (sTileTitle, sSectionTitle, nCatalogIndex) {
                    if (!nCatalogIndex) {
                        nCatalogIndex = 0;
                    }
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.CustomTreeItem",
                        matchers: function (oTile) {
                            var sBindingContextPath = oTile.getBindingContextPath(),
                                sCurrentTileTitle = oTile.getBindingContext().getObject().title;
                            return sBindingContextPath.indexOf("catalogs/" + nCatalogIndex) > -1 && (sCurrentTileTitle === sTileTitle);
                        },
                        check: function (aTiles) {
                            return aTiles.length === 1;
                        },
                        actions: function (oTile) {
                            doDrag("dragstart", oTile);
                        },
                        success: function (aTiles) {
                            this.waitFor({
                                viewName: sViewName,
                                controlType: "sap.ushell.ui.launchpad.Section",
                                matchers: function (oSection) {
                                    return (oSection.getTitle() === sSectionTitle);
                                },
                                check: function (aSections) {
                                    return aSections.length === 1;
                                },
                                actions: function (oSection) {
                                    doDrag("dragenter", oSection, "drop");
                                }
                            });
                        }
                    });
                },
                iDragATileFromTheTileSelectorToTheTileSelector: function (nTileIndex) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.CustomTreeItem",
                        id: new RegExp("--tileSelectorList-" + nTileIndex + "$"),
                        check: function (aTiles) {
                            return aTiles.length === 1;
                        },
                        success: function (aTiles) {
                            this.waitFor({
                                viewName: sViewName,
                                id: "tileSelectorList",
                                actions: function (oTree) {
                                    doDrag("dragstart", aTiles[0]);
                                    doDrag("dragenter", oTree, "drop");
                                }
                            });
                        }
                    });
                },
                iDragATileFromTheTileSelectorToTheHeader: function (nTileIndex) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.CustomTreeItem",
                        id: new RegExp("--tileSelectorList-" + nTileIndex + "$"),
                        check: function (aTiles) {
                            return aTiles.length === 1;
                        },
                        success: function (aTiles) {
                            this.waitFor({
                                viewName: sViewName,
                                controlType: "sap.f.DynamicPageHeader",
                                check: function (aControls) {
                                    return aControls && aControls.length === 1
                                        // Performing these actions here not best practise. However, it's the most resonable way to do it.
                                        && !!doDrag("dragstart", aTiles[0])
                                        && !!doDrag("dragenter", aControls[0], "drop");
                                }
                            });
                        }
                    });
                },
                // Drags and drops only from/to first sections found with matching titles.
                iDragATileFromSectionToSection: function (sTileTitle, sFromSectionTitle, sToSectionTitle) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: function (oDragSection) {
                            return oDragSection.getTitle() === sFromSectionTitle;
                        },
                        check: function (oDragSection) {
                            var aVisualizations = oDragSection[0].getVisualizations(),
                                oVisualization;
                            for (var i = 0; i < aVisualizations.length; i++) {
                                if (aVisualizations[i].getProperty("title") === sTileTitle) {
                                    oVisualization = aVisualizations[i];
                                    break;
                                }
                            }
                            // Performing this action here is not best practise. However, it's the most resonable way to do it.
                            return !!oVisualization && !!doDrag("dragstart", oVisualization);
                        },
                        success () {
                            this.waitFor({
                                viewName: sViewName,
                                controlType: "sap.ushell.ui.launchpad.Section",
                                matchers: function (oDropSection) {
                                    return oDropSection.getTitle() === sToSectionTitle;
                                },
                                check: function (aDropSections) {
                                    return aDropSections && aDropSections.length > 0
                                        // Performing this action here is not best practise. However, it's the most resonable way to do it.
                                        && !!doDrag("dragenter", aDropSections[0], "drop");
                                }
                            });
                        }
                    });
                },
                iDragASection: function (iSourceIndex, iTargetIndex) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.ui.launchpad.Page",
                        check: function (aControls) {
                            if (iSourceIndex === iTargetIndex - 1) {
                                // in this case, swap source and target, otherwise the move will not affect the order
                                // (because drop position is always considered as BEFORE the target index, not AT the index)
                                var temp = iSourceIndex;
                                iSourceIndex = iTargetIndex;
                                iTargetIndex = temp;
                            }
                            var aSections = aControls[0].getSections(),
                                oDragSection = aSections[iSourceIndex],
                                oDropSection = aSections[iTargetIndex];
                            return aControls.length === 1 && !!oDragSection && !!oDropSection
                                // Performing these actions here is not best practise. However, it's the most resonable way to do it.
                                && !!doDrag("dragstart", oDragSection)
                                && !!doDrag("dragenter", oDropSection, "drop");
                        }
                    });
                },
                iToggleRoleContext: function (bToggle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.VizInstance",
                        viewName: sViewName,
                        success: function (aControls) {
                            var oVisualization = aControls[0];
                            var vizId = oVisualization.getVisualizationId();
                            oVisualization.getModel("roles").setProperty("/availableVisualizations", bToggle ? [vizId] : null);
                        }
                    });
                }
            },
            assertions: {
                iShouldSeeTheLayoutCancelButton: function (bEnabled) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "layoutButtonCancel",
                        enabled: bEnabled,
                        success: function () {
                            Opa5.assert.ok(true, "Layout cancel button is shown and in the correct state.");
                        }
                    });
                },
                iShouldSeeTheToggleCatalogsButton: function (bEnabled) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "toggleCatalogsButton",
                        enabled: bEnabled,
                        success: function () {
                            Opa5.assert.ok(true, "The toggle catalogs button is shown and in the correct state.");
                        }
                    });
                },
                iShouldSeeTheLayoutSaveButton: function (bEnabled) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "layoutButtonSave",
                        enabled: bEnabled,
                        success: function () {
                            Opa5.assert.ok(true, "Layout save button is shown and in the correct state.");
                        }
                    });
                },
                iShouldSeeThePageID: function (sID) {
                    return this.waitFor({
                        controlType: "sap.f.DynamicPageTitle",
                        matchers: function (oTitle) {
                            return oTitle.getHeading().getText() === sID;
                        },
                        check: function (aTitles) {
                            return aTitles.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The page has correct id");
                        }
                    });
                },
                iShouldSeeAPageDescription: function (sDescription) {
                    return this.waitFor({
                        controlType: "sap.m.ObjectAttribute",
                        matchers: function (oObjectAttribute) {
                            return oObjectAttribute.getText() === sDescription;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The page has correct description");
                        }
                    });
                },
                iShouldSeeTheCopyPageButton: function (bEnabled) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "buttonCopy",
                        matchers: [
                            new Properties({
                                enabled: bEnabled
                            })
                        ],
                        success: function () {
                            Opa5.assert.ok(true, "The copy page button is shown and in the correct state.");
                        }
                    });
                },
                iShouldSeeTheDeletePageButton: function (bEnabled) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "buttonDelete",
                        matchers: [
                            new Properties({
                                enabled: bEnabled
                            })
                        ],
                        success: function () {
                            Opa5.assert.ok(true, "The delete page button is shown and in the correct state.");
                        }
                    });
                },
                iShouldSeeATextWithID: function (sId, sText, bFormatted) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Text",
                        id: sId,
                        check: function (oText) {
                            var fnGetText = bFormatted ? oText.getHtmlText.bind(oText) : oText.getText.bind(oText);
                            return fnGetText().indexOf(sText) > -1;
                        },
                        success: function () {
                            Opa5.assert.ok(true,
                                "Text element with id \"" + sId + "\" and text \"" + sText + "\" should exist");
                        }

                    });
                },
                iShouldSeeTheTileSelector: function (bVisible) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "layoutContent",
                        matchers: function (oPageDesigner) {
                            return oPageDesigner.isSideContentVisible() === bVisible;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The TileSelector has the visibility: " + bVisible);
                        }
                    });
                },
                iShouldSeeTheTileSelectorToolbarSearchField: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.SearchField",
                        matchers: function (oControl) {
                            return (oControl.getParent() && /tileSelectorToolbar$/.test(oControl.getParent().getId()));
                        },
                        check: function (aControls) {
                            return aControls.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Found: TileSelector toolbar's \"SearchField\"");
                        }
                    });
                },
                iShouldSeeTheTileSelectorToolbarAddButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Button",
                        enabled: false, // "enabled" is not "false" by default (BCP: 1980370173)
                        matchers: function (oControl) {
                            return (oControl.getParent()
                                && /tileSelectorToolbar$/.test(oControl.getParent().getId())
                                && oControl.getText() === resources.i18n.getText("Button.Add"));
                        },
                        check: function (aControls) {
                            return aControls.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Found: TileSelector toolbar's \"Add\" button");
                        }
                    });
                },
                iShouldSeeTheTileSelectorToolbarSortButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Button",
                        matchers: function (oControl) {
                            return (oControl.getParent()
                                && /tileSelectorToolbar$/.test(oControl.getParent().getId())
                                && oControl.getText() === resources.i18n.getText("Button.SortCatalogs"));
                        },
                        check: function (aControls) {
                            return aControls.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Found: TileSelector toolbar's \"Sort\" button");
                        }
                    });
                },
                iShouldSeeTheTileSelectorToolbarCollapseButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Button",
                        matchers: function (oControl) {
                            return (oControl.getParent()
                                && /tileSelectorToolbar$/.test(oControl.getParent().getId())
                                && oControl.getText() === resources.i18n.getText("Button.CollapseCatalogs"));
                        },
                        check: function (aControls) {
                            return aControls.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Found: TileSelector toolbar's \"Collapse\" button");
                        }
                    });
                },
                iShouldSeeTheTileSelectorToolbarExpandButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Button",
                        matchers: function (oControl) {
                            return (oControl.getParent()
                                && /tileSelectorToolbar$/.test(oControl.getParent().getId())
                                && oControl.getText() === resources.i18n.getText("Button.ExpandCatalogs"));
                        },
                        check: function (aControls) {
                            return aControls.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Found: TileSelector toolbar's \"Expand\" button");
                        }
                    });
                },
                iShouldSeeTileSelectorCatalogTitles: function (iCatalogQuantity) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Title",
                        id: /tileSelectorCatalogTitle/,
                        matchers: function (oControl) {
                            return !!oControl.getText().length;
                        },
                        check: function (aControls) {
                            return aControls.length === iCatalogQuantity;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Found: " + iCatalogQuantity + " TileSelector catalog titles");
                        }
                    });
                },
                iShouldSeeTileSelectorTileTitles: function (iTileQuantity) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Title",
                        id: /tileSelectorTileTitle/,
                        matchers: function (oControl) {
                            return !!oControl.getText().length;
                        },
                        check: function (aControls) {
                            return aControls.length === iTileQuantity;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Found: " + iTileQuantity + " TileSelector tile titles");
                        }
                    });
                },
                iShouldSeeTileSelectorTileSubtitles: function (iTileQuantity) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Text",
                        id: /tileSelectorTileSubtitle/,
                        matchers: function (oControl) {
                            return !!oControl.getText().length;
                        },
                        check: function (aControls) {
                            return aControls.length === iTileQuantity;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Found: " + iTileQuantity + " TileSelector tile subtitles");
                        }
                    });
                },
                iShouldSeeTileSelectorTileInfoButtons: function (iTileQuantity) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Button",
                        id: /tileSelectorTileButtonInfo/,
                        check: function (aControls) {
                            return aControls.length === iTileQuantity;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Found: " + iTileQuantity + " TileSelector tile \"info\" buttons");
                        }
                    });
                },
                iShouldSeeTileSelectorTileAddButtons: function (iTileQuantity) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Button",
                        id: /tileSelectorTileButtonAdd/,
                        check: function (aControls) {
                            return aControls.length === iTileQuantity;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Found: " + iTileQuantity + " TileSelector tile \"add\" buttons");
                        }
                    });
                },
                iShouldSeeTheTileInfoPopover: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Popover",
                        id: /tileInfoPopover/,
                        check: function (aControls) {
                            return aControls.length === 1;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Found: tileInfoPopover");
                        }
                    });
                },
                iShouldSeeATileInASection: function (sVisualizationTitle, sSectionTitle, nNumberOfRequiredFindings) {
                    var nFindingCounter = 0;
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: function (oSection) {
                            if (oSection.getTitle() === sSectionTitle) {
                                var aVisualizationsInSection = oSection.getVisualizations();
                                for (var i = 0; i < aVisualizationsInSection.length; i++) {
                                    if (aVisualizationsInSection[i].getProperty("title") === sVisualizationTitle) {
                                        nFindingCounter++;
                                    }
                                }
                            }
                            return nFindingCounter > 0;
                        },
                        success: function () {
                            Opa5.assert.strictEqual(nNumberOfRequiredFindings, nFindingCounter,
                                "Tile with title \"" + sVisualizationTitle + "\" should exist "
                                + nNumberOfRequiredFindings + " times in the section with title " + sSectionTitle + ".");
                        }
                    });
                },
                iShouldSeeATileInTheTileSelector: function (sTitle, nNumberOfRequiredFindings) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.CustomTreeItem",
                        matchers: function (oItem) {
                            if (oItem.getProperty("type") !== "Active") { // catalogs are active, only tiles are relevant here
                                var title = oItem.getBindingContext().getProperty("title");
                                return title === sTitle;
                            }
                            return false;
                        },
                        check: function (aItems) {
                            return aItems.length === nNumberOfRequiredFindings;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Tile with title \"" + sTitle + "\" should exist "
                                + nNumberOfRequiredFindings + " times in the TileSelector.");
                        }
                    });
                },
                iShouldSeeATileInASectionAtIndex: function (sVisualizationTitle, sSectionTitle, nTileIndex) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: function (oSection) {
                            if (oSection.getTitle() === sSectionTitle) {
                                var aVisualizationsInSection = oSection.getVisualizations();
                                for (var i = 0; i < aVisualizationsInSection.length; i++) {
                                    if (i === nTileIndex && aVisualizationsInSection[i].getProperty("title") === sVisualizationTitle) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                            return false;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Tile with title \"" + sVisualizationTitle
                                + "\" should exist in the section with title " + sSectionTitle + " at index " + nTileIndex + ".");
                        }
                    });
                },
                iShouldNotSeeTileInSection: function (sVisualizationTitle, sSectionTitle) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: function (oSection) {
                            if (oSection.getTitle() === sSectionTitle) {
                                var aVisualizationsInSection = oSection.getVisualizations();
                                for (var i = 0; i < aVisualizationsInSection.length; i++) {
                                    if (aVisualizationsInSection[i].getProperty("title") === sVisualizationTitle) {
                                        return false;
                                    }
                                }
                                return true;
                            }
                            return false;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Tile with title \"" + sVisualizationTitle
                                + "\" should not exist in the section with title " + sSectionTitle + ".");
                        }
                    });
                },
                iShouldNotSeeAdditionalContentInTheHeader: function (nExpectedNumberOfControls) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.f.DynamicPageHeader",
                        success: function (aHeaders) {
                            Opa5.assert.strictEqual(aHeaders[0].getContent().length,
                                nExpectedNumberOfControls, "There should be " + nExpectedNumberOfControls + " controls in the header.");
                        }
                    });
                },
                iShouldSeeTheSectionWithTitle: function (sSectionTitle) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.ui.launchpad.Section",
                        matchers: function (oSection) {
                            return oSection.getTitle() === sSectionTitle;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "At least one section with title \"" + sSectionTitle + "\" should exist.");
                        }
                    });
                },
                iShouldNotSeeTheSectionWithTitle: function (sSectionTitle) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.ui.launchpad.Section",
                        check: function (aSections) {
                            for (var i = 0; i < aSections.length; i++) {
                                if (aSections[i].getTitle() === sSectionTitle) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "No section with title \"" + sSectionTitle + "\" should exist.");
                        }
                    });
                },
                iShouldSeeSectionAtIndex: function (sSectionTitle, iSectionIndex) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.ushell.ui.launchpad.Page",
                        check: function (aControls) {
                            return aControls.length === 1;
                        },
                        success: function (aControls) {
                            var aSections = aControls[0].getSections();
                            for (var i = 0; i < aSections.length; ++i) {
                                if (aSections[i].getTitle() === sSectionTitle) {
                                    Opa5.assert.strictEqual(iSectionIndex, i,
                                        "Section with title \"" + sSectionTitle + "\" should be at index \"" + iSectionIndex + "\"");
                                }
                            }
                        }
                    });
                },
                iShouldSeeTheTileSelectorInfoToolbar: function (bVisible) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "roleContextInfoToolbar",
                        visible: bVisible,
                        matchers: new PropertyStrictEquals({
                            name: "visible",
                            value: bVisible
                        }),
                        success: function () {
                            Opa5.assert.ok(true, "The Toolbar in the TileSelector has the visibility ", bVisible);
                        }
                    });
                },
                iShouldSeeTheMessagePopoverButton: function (bVisible) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "layoutButtonMessage",
                        visible: false,
                        check: function (oButton) {
                            return oButton.getVisible() === bVisible;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "MessagePopover button has visibility ", bVisible);
                        }
                    });
                },
                iShouldSeeTheMessagePopover: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        searchOpenDialogs: true,
                        id: "layoutMessagePopover-messagePopover-popover",
                        success: function () {
                            Opa5.assert.ok(true, "The message popover is shown.");
                        }
                    });
                },
                iShouldSeeTheMessagePopoverTitleText: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        searchOpenDialogs: true,
                        id: "layoutMessagePopover-messageViewMessageTitleText",
                        success: function () {
                            Opa5.assert.ok(true, "The message title is shown in the popover.");
                        }
                    });
                },
                iShouldSeeTheMessagePopoverDescriptionText: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        searchOpenDialogs: true,
                        id: "layoutMessagePopover-messageViewMessageDescriptionText",
                        success: function () {
                            Opa5.assert.ok(true, "The message description is shown in the popover.");
                        }
                    });
                }
            }
        }
    });
});
