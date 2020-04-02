sap.ui.define(["sap/ovp/cards/generic/Card.controller", "sap/ui/thirdparty/jquery", "sap/m/Button"],
    function (CardController, jQuery, Button) {
        "use strict";

        return CardController.extend("sap.ovp.cards.quickview.Quickview", {
            onInit: function () {
                //The base controller lifecycle methods are not called by default, so they have to be called
                //Take reference from function mixinControllerDefinition in sap/ui/core/mvc/Controller.js
                CardController.prototype.onInit.apply(this, arguments);
                this.bCustomActionFlag = true;
            },

            //In the quickview card header, if either one of the texts is not present, the colon is removed
            onBeforeRendering: function () {
                var oHeaders = this.byId('ovpQuickviewCardHeader');
                if (oHeaders) {
                    var sText = oHeaders.getText();
                    var sSub = sText.substring(0);
                    if (sText[0] === ':') {
                        sSub = sText.substring(2);
                    } else if (sText[sText.length - 2] === ':') {
                        sSub = sText.substring(0, sText.length - 2);
                    }
                    oHeaders.setText(sSub);
                    var oCustomData = oHeaders.getCustomData();
                    if (oCustomData) {
                        for (var i = 0; i < oCustomData.length; ++i) {
                            if (oCustomData[i].getProperty('key') === 'aria-label') {
                                oCustomData[i].setValue(sSub);
                            }
                        }
                    }
                }
                /**
                 * The shotFirstActionInFooter flag is set in manifest.json. This is to avoid redundant navigation from Stack and Quickview cards.
                 * If true, the first action in the footer of Quickview cards will be visible.
                 * By default, it is false.
                 */
                var oCardPropertiesModel = this.getCardPropertiesModel();
                var bShowFirstActionInFooter = oCardPropertiesModel.getProperty("/showFirstActionInFooter") ? oCardPropertiesModel.getProperty("/showFirstActionInFooter") : false;
                var oFooter = this.byId("ovpActionFooter");
                if (!bShowFirstActionInFooter) {
                    if (oFooter) {
                        var aFooterBtns = oFooter.getContent();
                        if (aFooterBtns && aFooterBtns.length) {
                            for (var i = 0, iFooterBtnsLength = aFooterBtns.length; i < iFooterBtnsLength; i++) {
                                if (aFooterBtns[i] instanceof Button) {
                                    aFooterBtns[i].setVisible(false);
                                    break;
                                }
                            }
                        }
                    }
                }
            },
            onAfterRendering: function () {
                CardController.prototype.onAfterRendering.apply(this, arguments);
                jQuery(".sapMQuickViewPage").attr('tabindex', '0');
                var oCardPropertiesModel = this.getCardPropertiesModel();
                var oFooter = this.byId("ovpActionFooter");
                /*
                 This is for Custom Actions
                 */
                if (!!this.bCustomActionFlag) {
                    var aCustomActions = oCardPropertiesModel.getProperty("/customActions");
                    if (!!oFooter && !!aCustomActions && !!aCustomActions.length) {
                        for (var j = 0; j < aCustomActions.length; j++) {
                            var text = aCustomActions[j].text;
                            var oMainComponent = null,
                            pressEvent;
                            if (this.getOwnerComponent() && this.getOwnerComponent().getComponentData()) {
                                oMainComponent = this.getOwnerComponent().getComponentData().mainComponent;
                            }
                            if (!!oMainComponent && !!text && !!aCustomActions[j].press) {
                                pressEvent = oMainComponent.templateBaseExtension.provideCustomActionPress(aCustomActions[j].press) ? oMainComponent.templateBaseExtension.provideCustomActionPress(aCustomActions[j].press) : oMainComponent.onCustomActionPress(aCustomActions[j].press);
                                if (typeof pressEvent === "function") {
                                    var button = new Button({
                                        text: text,
                                        press: pressEvent.bind(this),
                                        type: "Transparent"
                                    });
                                    var bFirstActionFlag = oCardPropertiesModel.getProperty("/showFirstActionInFooter");
                                    var iShift = (bFirstActionFlag) ? 0 : 1;
                                    var iPosition = aCustomActions[j].position + iShift;
                                    var iLength = oFooter.getContent().length;
                                    if (iPosition < (1 + iShift) && iPosition > (iLength - 1)) {
                                        oFooter.addContent(button);
                                    } else {
                                        oFooter.insertContent(button, iPosition);
                                    }
                                }
                            }
                        }
                    }
                    this.bCustomActionFlag = false;
                }
            }

        });
    });
