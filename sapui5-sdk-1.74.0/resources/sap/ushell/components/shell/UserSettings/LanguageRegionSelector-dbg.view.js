// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/VBox",
    "sap/m/Button",
    "sap/m/SegmentedButton",
    "sap/m/ComboBox",
    "sap/m/Text",
    "sap/m/FlexBox",
    "sap/m/Input",
    "sap/m/Select",
    "sap/m/Label",
    "sap/ui/Device",
    "sap/ushell/resources",
    "sap/ui/core/Item"
], function (
    VBox,
    Button,
    SegmentedButton,
    ComboBox,
    Text,
    FlexBox,
    Input,
    Select,
    Label,
    Device,
    resources,
    Item
) {
    "use strict";

    sap.ui.jsview("sap.ushell.components.shell.UserSettings.LanguageRegionSelector", {
        createContent: function (oController) {
            var itemTemplate = new Item({
                key: "{key}",
                text: "{text}"
            });
            var i18n = resources.i18n;
            var sLanguageLabelFor = "languageSelectionSelect";
            var sDateFormatLabelFor = "dateFormatCombo";
            var sFlexDirection = Device.system.phone ? "Column" : "Row";
            var sFlexAlignItems = Device.system.phone ? "Stretch" : "Center";
            var sTextAlign = Device.system.phone ? "Left" : "Right";
            var sLabelWidth = Device.system.phone ? "auto" : "12rem";
            var sLabelSelectLanguageWidth = Device.system.phone ? "auto" : "16rem";
            var sComboBoxWidth = Device.system.phone ? "100%" : undefined;

            var languageLabel = new Label("languageSelectionLabel", {
                text: {
                    path: "/selectedLanguage",
                    formatter: function (sSelectedLanguage) {
                        sSelectedLanguage = oController._getFormatedLanguage(sSelectedLanguage);
                        // If the language value has region - for example 'en(us)', the label should be 'Language and Region'.
                        // Otherwise, it should be 'Language'.
                        return i18n.getText(sSelectedLanguage.indexOf("(") > -1 ? "languageAndRegionTit" : "languageRegionFld") + ":";
                    }
                },
                width: sLabelWidth,
                textAlign: sTextAlign,
                labelFor: sLanguageLabelFor
            });

            this.selectLanguage = new Select("languageSelectionSelect", {
                visible: false,
                width: sLabelSelectLanguageWidth,
                items: {
                    path: "/languageList",
                    template: itemTemplate
                },
                selectedKey: "{/selectedLanguage}",
                change: function (e) {
                    var sSelectedLanguage = e.getParameters().selectedItem.getKey();
                    oController._handleSelectChange(sSelectedLanguage);
                }
            }).addAriaLabelledBy(languageLabel);

            this.inputLanguage = new Input("languageSelectionInput", {
                visible: true,
                value: "{/selectedLanguageText}",
                editable: false
            }).addAriaLabelledBy(languageLabel);


            var fboxLanguage = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    languageLabel,
                    this.selectLanguage,
                    this.inputLanguage
                ]
            });

            this.helpingTextLabel = new Label({
                visible: false,
                text: "",
                width: sLabelWidth,
                textAlign: sTextAlign
            });

            this.helpingText = new Text({
                visible: false,
                text: i18n.getText("LanguageAndRegionHelpingText"),
                width: sLabelSelectLanguageWidth,
                textAlign: "Begin"
            }).addStyleClass("sapUshellFlpSettingsLanguageRegionDescription");

            var fboxHelpingText = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    this.helpingTextLabel,
                    this.helpingText
                ]
            });

            var dateLabel = new Label({
                text: i18n.getText("dateFormatFld") + ":",
                width: sLabelWidth,
                textAlign: sTextAlign,
                labelFor: sDateFormatLabelFor
            });

            this.comboDate = new ComboBox("dateFormatCombo", {
                width: sComboBoxWidth,
                items: {
                    path: "/datePatternList",
                    template: itemTemplate
                },
                selectedKey: "{/selectedDatePattern}",
                editable: false
            }).addAriaLabelledBy(dateLabel);

            var fboxDate = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    dateLabel,
                    this.comboDate
                ]
            });

            var fboxTimeLabel = new Label({
                text: i18n.getText("timeFormatFld") + ":",
                width: sLabelWidth,
                textAlign: sTextAlign
            });

            this.hourFormatSegmentedButton = new SegmentedButton("hoursSegmentedButton", {
                enabled: false,
                width: "10rem",
                buttons: [
                    new Button({ text: i18n.getText("btn12h") }),
                    new Button({ text: i18n.getText("btn24h") })
                ]
            }).addAriaLabelledBy(fboxTimeLabel);

            var fboxTime = new FlexBox({
                alignItems: sFlexAlignItems,
                direction: sFlexDirection,
                items: [
                    fboxTimeLabel,
                    this.hourFormatSegmentedButton
                ]
            });

            fboxTime.addStyleClass("sapUshellFlpSettingsLanguageRegionHourFormatFBox");
            var vbox = new VBox({
                items: [fboxLanguage, fboxHelpingText, fboxDate, fboxTime]
            });
            vbox.addStyleClass("sapUiSmallMargin");

            return vbox;
        },

        getControllerName: function () {
            return "sap.ushell.components.shell.UserSettings.LanguageRegionSelector";
        }
    });
});
