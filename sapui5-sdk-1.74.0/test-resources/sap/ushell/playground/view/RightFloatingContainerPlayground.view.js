// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/ui/shell/RightFloatingContainer"
], function (RightFloatingContainer) {
    "use strict";

    jQuery.sap.initMobile();

    sap.ui.jsview("sap.ushell.playground.view.RightFloatingContainerPlayground", {
        createContent: function (oController) {
            var oPage = this._createPage();
            return oPage;
        },

        _createPage: function () {
            var oData = {
                size: "56px",
                top: "0",
                right: "0",
                textVisible: true,
                hideItemsAfterPresentation: false,
                enableBounceAnimations: false,
                actAsPreviewContainer: false,
                floatingContainerItemCount: 0,
                description: "",
                hideShowMoreButton: false,
                truncate: false,
                authorName: "",
                authorPicture: "",
                datetime: "",
                priority: sap.ui.core.Priority.None,
                showButtons: true,
                showCloseButton: true,
                title: ""
            };

            var oModel = new sap.ui.model.json.JSONModel(oData);

            function addRightFloatingContainerControls (oForm) {
                oForm.addContent(new sap.m.Label({
                    text: "Size"
                }));

                oForm.addContent(new sap.m.Input({
                    placeholder: "Enter size ...",
                    value: {
                        path: "/size",
                        type: new sap.ui.model.type.String()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Top"
                }));

                oForm.addContent(new sap.m.Input({
                    placeholder: "Enter top ...",
                    value: {
                        path: "/top",
                        type: new sap.ui.model.type.String()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Right"
                }));

                oForm.addContent(new sap.m.Input({
                    placeholder: "Enter right ...",
                    value: {
                        path: "/right",
                        type: new sap.ui.model.type.String()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Text visible"
                }));

                oForm.addContent(new sap.m.Switch({
                    state: {
                        path: "/textVisible",
                        type: new sap.ui.model.type.Boolean()
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Hide items after presentation"
                }));

                oForm.addContent(new sap.m.Switch("hideItemsAfterPresentation-switch", {
                    state: {
                        path: "/hideItemsAfterPresentation",
                        type: new sap.ui.model.type.Boolean()
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Enable Bounce Animations"
                }));

                oForm.addContent(new sap.m.Switch("enableBounceAnimations-switch", {
                    state: {
                        path: "/enableBounceAnimations",
                        type: new sap.ui.model.type.Boolean()
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Act as previewcontainer"
                }));

                oForm.addContent(new sap.m.Switch("actAsPreviewContainer-switch", {
                    state: {
                        path: "/actAsPreviewContainer",
                        type: new sap.ui.model.type.Boolean()
                    }
                }));
            }

            function addItemControls (oForm) {
                oForm.addContent(new sap.m.Label({
                    text: "Item Description"
                }));

                oForm.addContent(new sap.m.Input({
                    placeholder: "Enter item description ...",
                    value: {
                        path: "/description",
                        type: new sap.ui.model.type.String()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Item hide 'showmore' button"
                }));

                oForm.addContent(new sap.m.Switch("hideShowMoreButton-switch", {
                    state: {
                        path: "/hideShowMoreButton",
                        type: new sap.ui.model.type.Boolean()
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Item truncate"
                }));

                oForm.addContent(new sap.m.Switch("truncate-switch", {
                    state: {
                        path: "/truncate",
                        type: new sap.ui.model.type.Boolean()
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Item Author name"
                }));

                oForm.addContent(new sap.m.Input({
                    placeholder: "Enter item author name ...",
                    value: {
                        path: "/authorName",
                        type: new sap.ui.model.type.String()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Item set author picture"
                }));

                oForm.addContent(new sap.m.Select("author-picture-select", {
                    items: [
                        new sap.ui.core.Item({
                            key: "",
                            text: "none"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://world",
                            text: "world"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://customer-financial-fact-sheet",
                            text: "customer-financial-fact-sheet"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://delete",
                            text: "delete"
                        }),
                        new sap.ui.core.Item("refresh-item", {
                            key: "sap-icon://refresh",
                            text: "refresh"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://email",
                            text: "email"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://hide",
                            text: "hide"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://home",
                            text: "home"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://documents",
                            text: "documents"
                        }),
                        new sap.ui.core.Item({
                            key: "sap-icon://copy",
                            text: "copy"
                        })
                    ],
                    change: function (oEvt) {
                        oData.authorPicture = oEvt.getParameter("selectedItem").getKey();
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Item set date"
                }));

                oForm.addContent(new sap.m.Input({
                    placeholder: "Enter item date ...",
                    value: {
                        path: "/datetime",
                        type: new sap.ui.model.type.String()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Item set priority"
                }));

                oForm.addContent(new sap.m.Select("priority-select", {
                    items: [
                        new sap.ui.core.Item({
                            key: sap.ui.core.Priority.None,
                            text: "none"
                        }),
                        new sap.ui.core.Item("low-item", {
                            key: sap.ui.core.Priority.Low,
                            text: "low"
                        }),
                        new sap.ui.core.Item({
                            key: sap.ui.core.Priority.Medium,
                            text: "medium"
                        }),
                        new sap.ui.core.Item({
                            key: sap.ui.core.Priority.High,
                            text: "high"
                        })
                    ],
                    change: function (oEvt) {
                        oData.priority = oEvt.getParameter("selectedItem").getKey();
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Item show buttons"
                }));

                oForm.addContent(new sap.m.Switch("showButtons-switch", {
                    state: {
                        path: "/showButtons",
                        type: new sap.ui.model.type.Boolean()
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Item show close button"
                }));

                oForm.addContent(new sap.m.Switch("showCloseButton-switch", {
                    state: {
                        path: "/showCloseButton",
                        type: new sap.ui.model.type.Boolean()
                    }
                }));

                oForm.addContent(new sap.m.Label({
                    text: "Item title"
                }));

                oForm.addContent(new sap.m.Input({
                    placeholder: "Enter item title ...",
                    value: {
                        path: "/title",
                        type: new sap.ui.model.type.String()
                    },
                    liveChange: function (oEvt) {
                        oModel.checkUpdate();
                    }
                }));

                oForm.addContent(new sap.m.Button({
                    text: "Add Item",
                    press: function (oEvt) {
                        oData.floatingContainerItemCount++;
                        oRightFloatingContainer.addFloatingContainerItem(new sap.m.NotificationListItem({
                            description: oData.description,
                            hideShowMoreButton: oData.hideShowMoreButton,
                            truncate: oData.truncate,
                            authorName: oData.authorName,
                            authorPicture: oData.authorPicture,
                            datetime: oData.datetime,
                            priority: oData.priority,
                            showButtons: oData.showButtons,
                            showCloseButton: oData.showCloseButton,
                            title: oData.title
                        }));
                        oModel.checkUpdate();
                    }
                }));
            }

            var oRightFloatingContainer = new RightFloatingContainer({
                size: "{/size}",
                top: "{/top}",
                right: "{/right}",
                textVisible: "{/textVisible}",
                hideItemsAfterPresentation: "{/hideItemsAfterPresentation}",
                enableBounceAnimations: "{/enableBounceAnimations}",
                actAsPreviewContainer: "{/actAsPreviewContainer}",
                visible: true
            });

            var oGrid = new sap.ui.layout.Grid({
                defaultSpan: "XL4 L4 M6 S12",
                content: [oRightFloatingContainer]
            });

            var oForm = new sap.ui.layout.form.SimpleForm({
                layout: "ColumnLayout",
                title:"Modify Right Floating Container",
                editable: true
            });

            addRightFloatingContainerControls(oForm);
            addItemControls(oForm);

            var oControlPanel = new sap.m.Panel({
                backgroundDesign: "Solid",
                content: oGrid,
                height: "400px"
            });

            var oPage = new sap.m.Page("rightFloatingContainerPage", {
                title: "Right Floating Container Demo",
                content: [oControlPanel, oForm]
            }).setModel(oModel);

            return oPage;
        }
    });
});