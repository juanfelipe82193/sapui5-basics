/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/ui/mdc/field/FieldInfoBase",
    "sap/m/ResponsivePopover",
    "sap/ui/thirdparty/jquery",
    "sap/ui/core/InvisibleText",
    "sap/ui/model/json/JSONModel",
    "sap/ui/mdc/link/Log",
    "sap/base/Log",
    "sap/ui/mdc/link/Panel",
    "sap/ui/mdc/link/PanelItem",
    "sap/ui/layout/form/SimpleForm",
    "sap/ui/core/Title",
    "sap/ui/layout/library",
    "sap/ui/mdc/link/Factory"
], function(FieldInfoBase,
    ResponsivePopover,
    jQuery,
    InvisibleText,
    JSONModel,
    Log,
    SapBaseLog,
    Panel,
    PanelItem,
    SimpleForm,
    CoreTitle,
    layoutLibrary,
    Factory) {
    "use strict";

    // shortcut for sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout
    var ResponsiveGridLayout = layoutLibrary.form.SimpleFormLayout.ResponsiveGridLayout;

    var Link = FieldInfoBase.extend("sap.ui.mdc.Link", /** @lends sap.ui.mdc.Link.prototype */
        {
            metadata: {
                library: "sap.ui.mdc",
                properties: {
                    /**
                     * Could be changed in the future to enable / disable USER / KEYUSER personalization
                     */
                    enablePersonalization: {
                        type: "boolean",
                        defaultValue: true
                    },
                    /**
                     * Path to <code>LinkDelegate</code> module that provides the required APIs to create Link content.<br>
                     * <b>Note:</b> Ensure that the related file can be requested (any required library has to be loaded before that).<br>
                     * Do not bind or modify the module. Once the required module is associated, this property might not be needed any longer.
                     *
                     * @experimental
                     */
                    delegate: {
                        type: "object",
                        defaultValue: { name: "sap/ui/mdc/LinkDelegate", payload: {} }
                    }
                },
                associations: {
                    /**
                     * Mostly the source control is used in order to get the AppComponent which is required for
                     * link personalization. Additionally the source control is used to get the binding context.
                     */
                    sourceControl: {
                        type: "sap.ui.core.Control",
                        multiple: false
                    }
                }
            }
        });

    Link.prototype.applySettings = function(mSettings, oScope) {
        FieldInfoBase.prototype.applySettings.apply(this, arguments);
        // use LinkItems and additionalContent given by the delegate after settings got applied
        this.oUseDelegatePromise = this._useDelegate();
        this.oUseDelegatePromise.then(this._determineContent.bind(this));
    };

    Link.prototype.init = function() {
        var oModel = new JSONModel({
            contentTitle: undefined,
            bHasPotentialContent: undefined,
            linkItems: []
        });
        oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
        oModel.setSizeLimit(1000);
        this.setModel(oModel, "$sapuimdcLink");
        // needed since we don't have these as aggregations anymore
        this._aAdditionalContent = [];
        this._aLinkItems = [];
    };

	/**
	 * Returns an object containing the <code>href</code> and <code>target</code> of the getDirectLink
	 * Returns null if there is no direct link
	 * @returns {Promise} {Object | null}
	 */
    Link.prototype.getDirectLinkHrefAndTarget = function() {
        return this.getDirectLink().then(function(oLink) {
            return oLink ? {
                target: oLink.getTarget(),
                href: oLink.getHref()
            } : null;
        });
    };

    // ----------------------- Implementation of 'IFieldInfo' interface --------------------------------------------

	/**
	 * In the first step we have just to decide whether the FieldInfo is clickable i.e. has to be rendered as a link.
	 * @returns {Promise} <code>true</code> if the FieldInfo is clickable
	 */
    Link.prototype.isTriggerable = function() {
        return this.hasPotentialContent();
    };
	/**
	 * Returns as promise result href of direct link navigation, else null.
	 * @returns {Promise} <code>href</code> of direct link navigation, else null
	 */
    Link.prototype.getTriggerHref = function() {
        return this.getDirectLinkHrefAndTarget().then(function(oLinkItem) {
            return oLinkItem ? oLinkItem.href : null;
        });
    };

    /**
     * Retrieves the relevant metadata for the table and returns property info array
     *
     * @param {sap.ui.mdc.link.Panel} oPanel The instance Panel control
     * @returns {object[]} Array of copied property info
     */
    Link.retrieveAllMetadata = function(oPanel) {
        if (!oPanel.getModel || !oPanel.getModel("$sapuimdcLink")) {
            return [];
        }
        var oModel = oPanel.getModel("$sapuimdcLink");
        return oModel.getProperty("/metadata").map(function(oMLinkItem) {
            return {
                id: oMLinkItem.key,
                text: oMLinkItem.text,
                description: oMLinkItem.description,
                href: oMLinkItem.href,
                target: oMLinkItem.target,
                visible: oMLinkItem.visible
            };
        });
    };

	/**
	 * Retrieves the initial items belonging to the baseline which is used when reset is executed.
	 * @param {sap.ui.mdc.link.Panel} oPanel The instance Panel control
	 * @returns {object[]} Array of copied property info
	 */
    Link.retrieveBaseline = function(oPanel) {
        if (!oPanel.getModel || !oPanel.getModel("$sapuimdcLink")) {
            return [];
        }
        var oModel = oPanel.getModel("$sapuimdcLink");
        return oModel.getProperty("/baseline").map(function(oMLinkItem) {
            return {
                id: oMLinkItem.key,
                visible: true
            };
        });
    };

    /**
     * Returns a promise reslove a Boolean if the Link has any Content (additionalContent or linkItems).
     * This is mainly used to check if the Link is clickable or not
     * @returns {Promise} resolve Boolean
     */
    Link.prototype.hasPotentialContent = function() {
        return this._waitForUseDelegatePromise(function() {
            // Additional content should be shown always
            if (!!this.getAdditionalContent().length) {
                return Promise.resolve(true);
            }
            return Promise.resolve(this.hasPotentialLinks());
        }.bind(this));
    };

	/**
	 * Returns as promise resolve a LinkItem as a direct link navigation if exist, else null.
	 * @returns {Promise} Resolve LinkItem of type sap.ui.mdc.link.LinkItem of direct link navigation, else null
	 */
    Link.prototype.getDirectLink = function() {
        return this._waitForUseDelegatePromise(function() {
            // Additional content should be shown always, no direct navigation possible
            // If additional content exists, return [] as the determination of LinkItems is not needed yet
            var aLinkItems = this.getAdditionalContent().length ? [] : this.getLinkItems();

            // If only one action exists (independent whether it is visible or not), direct navigation is
            // possible. Reason is that the visibility can be personalized. So e.g. if only one action is
            // visible and some actions are not visible the end user should be able to personalize the actions
            // again. This can the end user only do when the direct navigation is not executed.
            var aTriggerableItems = aLinkItems.filter(function(oItem) {
                return !!oItem.getHref();
            });
            if (aTriggerableItems.length !== 1) {
                return null;
            }
            return aTriggerableItems[0];
        }.bind(this));
    };

    // ----------------------- Implementation of 'ICreatePopover' interface --------------------------------------------

    Link.prototype.getContentTitle = function() {
        return new InvisibleText({
            text: this._getContentTitle()
        });
    };

    Link.prototype.getContent = function(fnGetAutoClosedControl) {
        // 1. Wait for DelegatePromise
        return this.oUseDelegatePromise.then(function() {
            // 2. Load sap.ui.fl
            return sap.ui.getCore().loadLibrary('sap.ui.fl', {
                async: true
            }).then(function() {
                // 3. return new Promise
                return new Promise(function(resolve) {
                    sap.ui.require([
                        'sap/ui/fl/Utils',
                        'sap/ui/fl/apply/api/FlexRuntimeInfoAPI'
                    ], function(Utils, FlexRuntimeInfoAPI) {
                        var aLinkItems = this.getLinkItems();
                        var aAdditionalContent = this.getAdditionalContent();

                        this._setConvertedLinkItems(aLinkItems, this._getView(Utils));
                        var aMLinkItems = this._getInternalModel().getProperty("/linkItems");
                        var aMBaselineLinkItems = this._getInternalModel().getProperty("/baselineLinkItems");

                        var oPanel = new Panel(this._createPanelId(Utils, FlexRuntimeInfoAPI), {
                            enablePersonalization: this.getEnablePersonalization(), // brake the binding chain
                            items: aMBaselineLinkItems.map(function(oMLinkItem) {
                                return new PanelItem(oMLinkItem.key, {
                                    text: oMLinkItem.text,
                                    description: oMLinkItem.description,
                                    href: oMLinkItem.href,
                                    target: oMLinkItem.target,
                                    icon: oMLinkItem.icon,
                                    visible: true
                                });
                            }),
                            additionalContent: !aAdditionalContent.length && !aMLinkItems.length ? Link._getNoContent() : aAdditionalContent,
                            beforeSelectionDialogOpen: function() {
                                if (fnGetAutoClosedControl && fnGetAutoClosedControl()) {
                                    fnGetAutoClosedControl().setModal(true);
                                }
                            },
                            afterSelectionDialogClose: function() {
                                if (fnGetAutoClosedControl && fnGetAutoClosedControl()) {
                                    fnGetAutoClosedControl().setModal(false);
                                }
                            },
                            metadataHelperPath: "sap/ui/mdc/Link"
                        });

                        oPanel.setModel(new JSONModel({
                            metadata: jQuery.extend(true, [], this._getInternalModel().getProperty("/linkItems")),
                            baseline: jQuery.extend(true, [], this._getInternalModel().getProperty("/baselineLinkItems"))
                        }), "$sapuimdcLink");
                        return resolve(oPanel);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }.bind(this));
    };

    /**
     * Returns a promise resolve a Boolean if the Link has any potential LinkItems.
     * This is mainly used to check if the Link is clickable or not
     * @returns {Promise} resolve Boolean
     */
    Link.prototype.hasPotentialLinks = function() {
        var oPayload = this.getDelegate().payload;

        if (this.getLinkItems().length) {
            return Promise.resolve(true);
        }
        if (oPayload && oPayload.semanticObjects) {
            return Link.hasDistinctSemanticObject(oPayload.semanticObjects).then(function(bHasDisctinctSemanticObject) {
                return Promise.resolve(!!bHasDisctinctSemanticObject);
            });
        }
        return Promise.resolve(false);
    };

    // TODO: move into sap.ui.mdc.flp.FlpLinkDelegate -> fetchIsTriggerable (?)
    Link.mSemanticObjects = {};
    Link.oPromise = null;
    Link.hasDistinctSemanticObject = function(aSemanticObjects) {
        if (Link._haveBeenRetrievedAllSemanticObjects(aSemanticObjects)) {
            return Promise.resolve(Link._atLeastOneExistsSemanticObject(aSemanticObjects));
        }
        return Link._retrieveDistinctSemanticObjects().then(function() {
            return Link._atLeastOneExistsSemanticObject(aSemanticObjects);
        });
    };
    Link._haveBeenRetrievedAllSemanticObjects = function(aSemanticObjects) {
        return aSemanticObjects.filter(function(sSemanticObject) {
            return !Link.mSemanticObjects[sSemanticObject];
        }).length === 0;
    };
    Link._atLeastOneExistsSemanticObject = function(aSemanticObjects) {
        return aSemanticObjects.some(function(sSemanticObject) {
            return Link.mSemanticObjects[sSemanticObject] && (Link.mSemanticObjects[sSemanticObject].exists === true);
        });
    };
    Link._retrieveDistinctSemanticObjects = function() {
        if (!Link.oPromise) {
            Link.oPromise = new Promise(function(resolve) {
                var oCrossApplicationNavigation = Factory.getService("CrossApplicationNavigation");
                if (!oCrossApplicationNavigation) {
                    SapBaseLog.error("Link: Service 'CrossApplicationNavigation' could not be obtained");
                    return resolve({});
                }
                oCrossApplicationNavigation.getDistinctSemanticObjects().then(function(aDistinctSemanticObjects) {
                    aDistinctSemanticObjects.forEach(function(sSemanticObject) {
                        Link.mSemanticObjects[sSemanticObject] = {
                            exists: true
                        };
                    });
                    Link.oPromise = null;
                    return resolve(Link.mSemanticObjects);
                }, function() {
                    SapBaseLog.error("Link: getDistinctSemanticObjects() of service 'CrossApplicationNavigation' failed");
                    return resolve({});
                });
            });
        }
        return Link.oPromise;
    };
    Link.destroyDistinctSemanticObjects = function() {
        Link.mSemanticObjects = {};
    };
    // end of todo

    /**
     * @returns {Object[]} of type sap.ui.mdc.link.LinkItem
     */
    Link.prototype.getLinkItems = function() {
        return this._aLinkItems;
    };

    /**
     * @returns {Object[]} of type sap.ui.base.Control
     */
    Link.prototype.getAdditionalContent = function() {
        return this._aAdditionalContent;
    };

    /**
     * @returns {String} ID of the SourceControl
     */
    Link.prototype.getSourceControl = function() {
        return this.getAssociation("sourceControl");
    };

    /**
     * Adds a given LinkItem to the private parameter _aLinkItems.
     * @param {sap.ui.mdc.link.LinkItem} oLinkItem LinkItem that shall be added to the Panel
     */
    Link.prototype.addLinkItem = function(oLinkItem) {
        if (oLinkItem && oLinkItem.isA("sap.ui.mdc.link.LinkItem") && this.oUseDelegatePromise) {
            this.oUseDelegatePromise.then(function() {
                this.addDependent(oLinkItem);
                this.getLinkItems().push(oLinkItem);
                this.fireDataUpdate();
                this._determineContent();
            }.bind(this));
        } else {
            SapBaseLog.error("Link: addLinkItem for " + oLinkItem + " failed. Please make sure that it's a 'sap.ui.mdc.link.LinkItem'.");
        }
    };

    /**
     * Adds a given Control to the private parameter _aAdditionalContent.
     * @param {sap.ui.base.Control} oAdditionalContent content that shall be added to the Panel
     */
    Link.prototype.addAdditionalContent = function(oAdditionalContent) {
        if (oAdditionalContent && oAdditionalContent.isA("sap.ui.core.Control") && this.oUseDelegatePromise) {
            this.oUseDelegatePromise.then(function() {
                this.getAdditionalContent().push(oAdditionalContent);
                this._determineContent();
            }.bind(this));
        } else {
            SapBaseLog.error("Link: addAdditionalContent for " + oAdditionalContent + " failed.");
        }
    };

    /**
     * Removes all LinkItems.
     */
    Link.prototype.removeAllLinkItems = function() {
        if (this.oUseDelegatePromise) {
            this.oUseDelegatePromise.then(function() {
                this.getLinkItems().forEach(function(oLinkItem) {
                    oLinkItem.destroy();
                    oLinkItem = undefined;
                });
                this._setLinkItems([]);
                this._determineContent();
            }.bind(this));
        }
    };

    /**
     * @private
     * @returns {String} sContentTitle which is saved in the internal model
     */
    Link.prototype._getContentTitle = function() {
        return this._getInternalModel().getProperty("/contentTitle");
    };

    /**
     * @private
     * @returns {Object | undefined} object of the BindingContext
     */
    Link.prototype._getContextObject = function() {
        var oControl = sap.ui.getCore().byId(this.getSourceControl());
        var oBindingContext = oControl && oControl.getBindingContext() || this.getBindingContext();
        return oBindingContext ? oBindingContext.getObject(oBindingContext.getPath()) : undefined;
    };

    /**
     * Generates a new sap.bas.log if the payload contains SemanticObjects (this log is required for the sap.ui.mdc.flp.FlpLinkDelegate)
     * @private
     * @returns {sap.base.Log | undefined}
     */
    Link.prototype._getInfoLog = function() {
        if (this.getDelegate().payload && this.getDelegate().payload.semanticObjects) {
            if (this._oInfoLog) {
                return this._oInfoLog;
            }
            if (SapBaseLog.getLevel() >= SapBaseLog.Level.INFO) {
                this._oInfoLog = new Log();
                this._oInfoLog.initialize(this.getDelegate().payload.semanticObjects, this._getContextObject());
                return this._oInfoLog;
            }
        }
        return undefined;
    };

    /**
     * @private
     */
    Link.prototype._getInternalModel = function() {
        return this.getModel("$sapuimdcLink");
    };

    /**
     * @private
     */
    Link._getLinkItemByKey = function(sKey, aArray) {
        return aArray.filter(function(oMElement) {
            return oMElement.key === sKey;
        })[0];
    };

    /**
     * @private
     * @returns {Promise} resolving into an array of {@link sap.ui.mdc.link.LinkItem} of the Link.
     */
    Link.prototype._getLinkItemsPromise = function() {
        return Promise.resolve(this.getLinkItems());
    };

    /**
     * @private
     * @returns {String}
     */
    Link.prototype._getLogFormattedText = function() {
        return (this._oInfoLog && !this._oInfoLog.isEmpty()) ? "---------------------------------------------\nsap.ui.mdc.Link:\nBelow you can see detailed information regarding semantic attributes which have been calculated for one or more semantic objects defined in a Link control. Semantic attributes are used to create the URL parameters. Additionally you can see all links containing the URL parameters.\n" + this._oInfoLog.getFormattedText() : "No logging data available";
    };

    /**
     * @private
     * @returns {sap.ui.layout.form.SimpleForm} a form containing a title which notices the user that there is no content for this Link
     */
    Link._getNoContent = function() {
        var oSimpleForm = new SimpleForm({
            layout: ResponsiveGridLayout,
            content: [
                new CoreTitle({
                    text: sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc").getText("info.POPOVER_MSG_NO_CONTENT")
                })
            ]
        });
        oSimpleForm.addStyleClass("mdcbaseinfoPanelDefaultAdditionalContent");
        return oSimpleForm;
    };

    /**
     * @private
     * @param {sap.ui.fl.Utils} Utils flex utility class
     * @returns {Object} view of the sourceControl / sourceControl of the parent
     */
    Link.prototype._getView = function(Utils) {
        var oField;
        if (this.getParent()) {
            oField = this.getParent();
        }
        var oControl = sap.ui.getCore().byId(this.getSourceControl());
        if (!oControl) {
            //SapBaseLog.error("Invalid source control: " + this.getSourceControl() + ". The mandatory 'sourceControl' association should be defined due to personalization reasons, parent: " + oField + " used instead.");
            this.setSourceControl(oField);
        }
        return Utils.getViewForControl(oControl) || Utils.getViewForControl(oField);
    };

    /**
     * @private
     * @param {String} sTitle
     */
    Link.prototype._setContentTitle = function(sTitle) {
        return this._getInternalModel().setProperty("/contentTitle", sTitle);
    };

    /**
     * @private
     * @param {sap.ui.mdc.link.LinkItem[]} aLinkItems
     * @param {Object} oView
     */
    Link.prototype._setConvertedLinkItems = function(aLinkItems, oView) {
        var oModel = this._getInternalModel();
        var aMLinkItems = aLinkItems.map(function(oLinkItem) {
            if (!oLinkItem.getKey()) {
                SapBaseLog.error("sap.ui.mdc.Link: undefined 'key' property of the LinkItem " + oLinkItem.getId() + ". The mandatory 'key' property should be defined due to personalization reasons.");
            }
            return {
                key: oView ? oView.createId(oLinkItem.getKey()) : oLinkItem.getKey(),
                text: oLinkItem.getText(),
                description: oLinkItem.getDescription(),
                href: oLinkItem.getHref(),
                target: oLinkItem.getTarget(),
                icon: oLinkItem.getIcon(),
                isSuperior: oLinkItem.getIsSuperior(),
                visible: false
            };
        });
        oModel.setProperty("/linkItems/", aMLinkItems);

        // As default we do not show any items initially (the baseline is empty)
        var aMBaselineLinkItems = aMLinkItems.filter(function(oMLinkItem) {
            return !oMLinkItem.key;
        });
        oModel.setProperty("/baselineLinkItems/", aMBaselineLinkItems);
    };

    /**
     * @private
     * @param {sap.ui.mdc.link.LinkItem[]} aLinkItems
     */
    Link.prototype._setLinkItems = function(aLinkItems) {
        var aLinkItemsMissingParent = aLinkItems.filter(function(oLinkItem) {
            return oLinkItem.getParent() === null;
        });
        aLinkItemsMissingParent.forEach(function(oLinkItem) {
            this.addDependent(oLinkItem);
        }.bind(this));
        this._aLinkItems = aLinkItems;
    };

    /**
     * Generates a ID for the panel of the Link. The result is depending on the fact that the Link supports Flex or not.
     * @private
     * @param {sap.ui.fl.Utils} Utils Flex utility class
     * @param {sap.ui.fl.apply.api.FlexRuntimeInfoAPI} FlexRuntimeInfoAPI Flex runtime info api
     * @returns {String} generated Id of the panel
     */
    Link.prototype._createPanelId = function(Utils, FlexRuntimeInfoAPI) {
        var oField;
        if (this.getParent()) {
            oField = this.getParent();
        }
        var oControl = sap.ui.getCore().byId(this.getSourceControl());
        if (!oControl) {
            //SapBaseLog.error("Invalid source control: " + this.getSourceControl() + ". The mandatory 'sourceControl' association should be defined due to personalization reasons, parent: " + oField + " used instead.");
            this.setSourceControl(oField);
        }
        if (!FlexRuntimeInfoAPI.isFlexSupported({ element: this })) {
            SapBaseLog.error("Invalid component. The mandatory 'sourceControl' association should be assigned to the app component due to personalization reasons.");
            return this.getId() + "-idInfoPanel";
        }
        var oAppComponent = Utils.getAppComponentForControl(oControl) || Utils.getAppComponentForControl(oField);
        return oAppComponent.createId("idInfoPanel");
    };

    Link.prototype._determineContent = function() {
        this.hasPotentialContent().then(function(bHasPotentialContent) {
            if (this._getInternalModel().getProperty('/bHasPotentialContent') !== bHasPotentialContent) {
                this._getInternalModel().setProperty('/bHasPotentialContent', bHasPotentialContent);
            }
        }.bind(this));
    };

    /**
     * @private
     * @returns {Promise} which is resolved once the LinkItems and AdditionalContent is gathered by the delegate.
     */
    Link.prototype._useDelegate = function() {
        if (!this.oDelegatePromise) {
            this.setDelegate(this.getDelegate());
        }
        return this.oDelegatePromise.then(function() {
            return Promise.all([
                this._useDelegateAdditionalContent(),
                this._useDelegateItems()
            ]);
        }.bind(this));
    };

    /**
     * Determines the AddtionalContent depending on the given LinkDelegate.
     * @private
     * @returns {Promise} which resolves once the AdditionalContents are fetched by the delegate. This also sets this._aAddtionalContent.
     */
    Link.prototype._useDelegateAdditionalContent = function() {
        return new Promise(function(resolve) {
            this.DELEGATE.fetchAdditionalContent(this.getDelegate().payload).then(function(aAdditionalContents) {
                this._aAdditionalContent = aAdditionalContents;
                resolve();
            }.bind(this));
        }.bind(this));
    };

    /**
     * Determines the LinkItems depending on the given LinkDelegate.
     * @private
     * @returns {Promise} which resolves once the LinkItems are fetched by the delegate. This also sets this._aLinkItems.
     */
    Link.prototype._useDelegateItems = function() {
        var oInfoLog = this._getInfoLog();
        var oContextObject = this._getContextObject();
        // Assign new Object so payload.id won't get set for the whole Link class
        var oPayload = Object.assign({}, this.getDelegate().payload);
        oPayload.id = this.getId();
        return new Promise(function(resolve) {
            this.DELEGATE.fetchLinkItems(oContextObject, oPayload, oInfoLog).then(function(aLinkItems) {
                this._setLinkItems(aLinkItems);
                resolve();
            }.bind(this));
        }.bind(this));
    };

    /**
     * Helper function to reduce code redundancy. This will execute a given funtion after useDeleagtePromise is resolved.
     * @private
     * @param {Function} fnFunctionToExecute the function which should be executed after the useDeleagtePromise is resolved.
     * @returns {Promise} which resolves into the execution of the given function
     */
    Link.prototype._waitForUseDelegatePromise = function(fnFunctionToExecute) {
        return this.oUseDelegatePromise.then(function() {
            return fnFunctionToExecute();
        });
    };

    Link.prototype.exit = function() {
        this.oUseDelegatePromise = undefined;
    };

    return Link;
});
