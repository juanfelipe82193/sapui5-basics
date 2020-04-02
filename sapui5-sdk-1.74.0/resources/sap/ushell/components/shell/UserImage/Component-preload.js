//@ui5-bundle Component-preload.js
sap.ui.require.preload({
	"sap/ushell/components/shell/UserImage/Component.js":function(){/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */
sap.ui.define([
    "sap/ushell/resources",
    "sap/ui/core/UIComponent",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Link",
    "sap/ui/layout/VerticalLayout",
    "sap/m/FlexBox",
    "sap/ui/core/IconPool",
    "sap/ui/Device",
    "sap/base/Log",
    "sap/base/util/isEmptyObject",
    "sap/ui/thirdparty/jquery"],
function (resources, UIComponent, Dialog, Button, Text, Link, VerticalLayout, FlexBox, IconPool, Device, logger, isEmptyObject, jQuery) {

    "use strict";
    var oShellView;

    /**
     * TODO: This entire thing does not need to have a UI COmponent as it has no own UI representation.
     * User Image is part of Shell Header and ME area
     * Should rather be a plain Component
     *
     */
    return UIComponent.extend("sap.ushell.components.shell.UserImage.Component", {

        metadata: {
            version: "1.74.0",
            library: "sap.ushell.components.shell.UserImage",
            dependencies: {
                libs: ["sap.m", "sap.ui.layout"]
            }
        },

        createContent: function () {
            var oShellConfig;

            oShellView = sap.ushell.Container.getRenderer("fiori2")._oShellView;
            oShellConfig = (oShellView.getViewData() ? oShellView.getViewData().config : {}) || {};
            this.loadUserImage();
            var oUser = sap.ushell.Container.getUser();
            if (oShellConfig.enableUserImgConsent === true && oUser.getImageConsent() === undefined) {
                this._showUserConsentPopup();
            }
        },

        _showUserConsentPopup: function () {
            var that = this;
            var sTextAlign = sap.ui.getCore().getConfiguration().getRTL() ? "Right" : "Left";
            var dialog, fboxUserConsentItem1, fboxUserConsentItem2, fboxUserConsentItem3;

            var yesButton = new Button("yesButton", {
                text: resources.i18n.getText("DisplayImg"),
                type: "Emphasized",
                press: function () {
                    that.updateUserImage(true);
                    dialog.close();
                }
            });
            var noButton = new Button("noButton", {
                text: resources.i18n.getText("DontDisplayImg"),
                press: function () {
                    that.updateUserImage(false);
                    dialog.close();
                }
            });
            dialog = new Dialog("userConsentDialog", {
                title: resources.i18n.getText("userImageConsentDialogTitle"),
                modal: true,
                stretch: Device.system.phone,
                buttons: [yesButton, noButton],
                afterClose: function () {
                    dialog.destroy();
                }
            }).addStyleClass("sapUshellUserConsentDialog");

            var useOfTermsText = new Text({
                text: resources.i18n.getText("userImageConsentDialogTermsOfUse")
            }).addStyleClass("sapUshellUserConsentDialogTerms");

            var consentText = new Text({
                text: resources.i18n.getText("userImageConsentText"),
                textAlign: sTextAlign
            }).addStyleClass("sapUshellUserConsentDialogText");

            var useOfTermsLink = new Link({
                text: resources.i18n.getText("userImageConsentDialogShowTermsOfUse"),
                textAlign: sTextAlign,
                press: function () {
                    var isTermsOfUseVisilble = fboxUserConsentItem3.getVisible();
                    if (isTermsOfUseVisilble) {
                        fboxUserConsentItem3.setVisible(false);
                        useOfTermsLink.setText(resources.i18n.getText("userImageConsentDialogShowTermsOfUse"));
                    } else {
                        useOfTermsLink.setText(resources.i18n.getText("userImageConsentDialogHideTermsOfUse"));
                        fboxUserConsentItem3.setVisible(true);
                    }
                }
            }).addAriaLabelledBy(consentText);

            fboxUserConsentItem1 = new FlexBox({
                alignItems: "Center",
                direction: "Row",
                items: [
                    consentText
                ]
            }).addStyleClass("sapUshellUserConsentDialogBox");

            fboxUserConsentItem2 = new FlexBox({
                alignItems: "Center",
                direction: "Row",
                items: [
                    useOfTermsLink
                ]
            }).addStyleClass("sapUshellUserConsentDialogBox").addStyleClass("sapUshellUserConsentDialogLink");

            fboxUserConsentItem3 = new FlexBox({
                alignItems: "Center",
                direction: "Row",
                items: [
                    useOfTermsText
                ]
            }).addStyleClass("ushellUserImgConsentTermsOfUseFlexBox");
            fboxUserConsentItem3.setVisible(false);

            var layout = new VerticalLayout("userConsentDialogLayout", {
                content: [fboxUserConsentItem1, fboxUserConsentItem2, fboxUserConsentItem3]
            });

            dialog.addContent(layout);
            dialog.open();
        },

        loadUserImage: function () {
            var oUser = sap.ushell.Container.getUser(),
                imageURI = oUser.getImage();

            if (imageURI) {
                this._setUserImage(imageURI);
            }
            oUser.attachOnSetImage(this._setUserImage.bind(this));
        },

        /*
        * Changing the property of userImage in the model, which is binded to the meAreaHeaderButton
        * */
        _setUserImage: function (param) {
            var sUrl = typeof param === "string" ? param : param.mParameters,
                isEmptyUrl = true;

            if (sUrl && typeof sUrl === "string") {
                isEmptyUrl = false;
            } else if (!isEmptyObject(sUrl)) {
                isEmptyUrl = false;
            }

            var personPlaceHolder = IconPool.getIconURI("person-placeholder"),
                account = IconPool.getIconURI("account");

            var oHeaders = {
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            };

            if (!isEmptyUrl) {
                //Using jQuery.ajax instead of jQuery.get in-order to be able to control the caching.
                jQuery.ajax({
                    url: sUrl,
                    //"cache: false" didn't work as expected hence, turning off the cache vie explicit headers.
                    headers: oHeaders,
                    success: function () {
                        //if there's a url for the image, set the model's property - userImage to its url
                        oShellView.getModel().setProperty("/userImage/personPlaceHolder", sUrl);
                        oShellView.getModel().setProperty("/userImage/account", sUrl);
                    },
                    error: function () {
                        logger.error("Could not load user image from: " + sUrl, "", "sap.ushell.renderers.fiori2.Shell.view");
                        var oUser = sap.ushell.Container.getUser();
                        oUser.setImage("");
                    }
                });
            } else {
                oShellView.getModel().setProperty("/userImage/personPlaceHolder", personPlaceHolder);
                oShellView.getModel().setProperty("/userImage/account", account);
            }


        },

        updateUserImage: function (isImageConsent) {
            var oUser = sap.ushell.Container.getUser(),
                oDeferred = new jQuery.Deferred(),
                oUserPreferencesPromise;
            this.userInfoService = sap.ushell.Container.getService("UserInfo");

            if (isImageConsent !== undefined) {
                oUser.setImageConsent(isImageConsent);
                oUserPreferencesPromise = this.userInfoService.updateUserPreferences(oUser);
                oUserPreferencesPromise.done(function () {
                    oUser.resetChangedProperty("isImageConsent");
                    //the adapter already called setImage on the user, which in turn called _setUserImage
                    //(we attached _setUserImage to an event that's fired from setImage)
                    oDeferred.resolve();
                });
            } else {
                    oDeferred.reject(isImageConsent + "is undefined");
            }
        },
        /**
         *
         *
         */
        exit: function () {
        }
    });

});
}
},"Component-preload"
);
