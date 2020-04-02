//@ui5-bundle sap_ushell_demotiles_abap_customTileDynamic/Component-preload.js
sap.ui.require.preload({
	"sap_ushell_demotiles_abap_customTileDynamic/Component.js":function(){// ${copyright}
(function () {
    "use strict";
    /* global jQuery, sap, window */


    /*************************************
     *
     * THIS COMPONENT IS ONLY NEEDED IN ORDER TO MAKE THE BUILD STEP FOR
     * ZIPPING / COMPONENT-PRELOAD BUILDING WORK!
     * LATER THE GENERATED ZIP WILL BE AUTOMATICALLY UPLOADED TO BSP REPOSITORY
     *
    *************************************/

    jQuery.sap.declare("sap_ushell_demotiles_abap_customTileDynamic.Component");

    sap.ui.define([
        "sap/ui/core/UIComponent"
    ], function (UIComponent) {
        return UIComponent.extend("sap_ushell_demotiles_abap_customTileDynamic.Component", {
            metadata: {
                "manifest": "json"
            },

            // new API
            tileSetVisible: function (bNewVisibility) {
                // forward to controller
                this._controller.visibleHandler(bNewVisibility);
            },

            // new API
            tileRefresh: function () {
                // forward to controller
                this._controller.refreshHandler(this._controller);
            },

            // new API
            tileSetVisualProperties: function (oNewVisualProperties) {
                // forward to controller
                this._controller.setVisualPropertiesHandler(oNewVisualProperties);
            },

            createContent: function () {
                var oTile = sap.ui.view({
                    viewName: "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile",
                    type: sap.ui.core.mvc.ViewType.JS
                });

                this._controller = oTile.getController();

                return oTile;
            }
        });
    });

}());
},
	"sap_ushell_demotiles_abap_customTileDynamic/manifest.json":'{\n    "_version": "1.1.0",\n    "sap.flp": {\n        "type": "tile",\n        "tileSize": "1x1"\n    },\n    "sap.app": {\n        "id": "sap_ushell_demotiles_abap_customTileDynamic",\n        "_version": "1.0.0",\n        "type": "application",\n        "applicationVersion": {\n            "version": "1.0.0"\n        },\n        "title": "Custom Dynamic App Launcher",\n        "description": "Custom Tile",\n        "tags": {\n            "keywords": []\n        },\n        "ach": "CA-UI2-INT-FE"\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n        "icons": {\n            "icon": "sap-icon://favorite"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        }\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "componentName": "sap_ushell_demotiles_abap_customTileDynamic",\n        "dependencies": {\n            "minUI5Version": "1.38",\n            "libs": {\n                "sap.m": {}\n            }\n        },\n        "models": {},\n        "rootView": {\n            "viewName": "sap_ushell_demotiles_abap_customTileDynamic.DynamicTile",\n            "type": "JS"\n        },\n        "handleValidation": false\n    }\n}',
	"sap_ushell_demotiles_abap_customTileDynamic/sap/ushell/demotiles/abap/customTileDynamic/Configuration.controller.js":function(){// ${copyright}
sap.ui.define(['sap/ushell/components/tiles/utils'],
	function(utils) {
	"use strict";

    /*global jQuery, sap */

    sap.ui.controller("sap.ushell.demotiles.abap.customTileDynamic.Configuration", {

        // checks given inputs
        onConfigurationInputChange: function (oControlEvent) {
            utils.checkInput(this.getView(), oControlEvent);
        },
        // default semantic objects for dynamic applauncher: blank
        aDefaultObjects : [{obj: "", name: ""}],
        onInit: function () {
            var oView = this.getView(),
                oSemanticObjectSelector = oView.byId("navigation_semantic_objectInput"),
                oActionSelector = oView.byId("navigation_semantic_actionInput"),
                oResourceModel = utils.getResourceBundleModel();

            oView.setModel(oResourceModel, "i18n");
            var oBundle = oResourceModel.getResourceBundle();
            // set view name for identification in utils
            oView.setViewName("sap.ushell.demotiles.abap.customTileDynamic.Configuration");
            utils.createSemanticObjectModel(this, oSemanticObjectSelector, this.aDefaultObjects);
            utils.createActionModel(this, oActionSelector, this.aDefaultObjects);

            // make sure that the chose object is written back to the configuration
            oSemanticObjectSelector.attachChange(function (oControlEvent) {
                var sValue = oControlEvent.getSource().getValue();
                oView.getModel().setProperty("/config/navigation_semantic_object", sValue);
            });
            oActionSelector.attachChange(function (oControlEvent) {
                var sValue = oControlEvent.getSource().getValue();
                oView.getModel().setProperty("/config/navigation_semantic_action", sValue);
            });
            // toggle editable property of targetURL input field depending on navigation_use_semantic_object
            oView.byId("targetUrl").bindProperty("enabled", {
                formatter: function (bUseLaunchpad) {
                    return !bUseLaunchpad;
                },
                path: "/config/navigation_use_semantic_object"
            });
            //Adding list items URL and Intent to the Target Type in Tile Actions section
            var oItem = new sap.ui.core.ListItem({key: "URL", text:oBundle.getText("configuration.tile_actions.table.target_type.url")});
            oView.byId("targetTypeCB").addItem(oItem);
            oItem = new sap.ui.core.ListItem({key: "INT", text:oBundle.getText("configuration.tile_actions.table.target_type.intent")});
            oView.byId("targetTypeCB").addItem(oItem);

        },

        onAfterRendering: function(){
//            sap.ushell.components.tiles.utils.updateTooltipForDisabledProperties(this.getView());
            utils.updateMessageStripForOriginalLanguage(this.getView());
        },

        // forward semantic object value helper request to utils
        onValueHelpRequest : function (oEvent) {
            //Third parameter is to differentiate whether it's Tile Actions icon field or general icon field. If it's true, then it's tile actions icon field, else general icon field.
            utils.objectSelectOnValueHelpRequest(this, oEvent, false);
        },
        // forward semantic action value helper request to utils
        onActionValueHelpRequest : function (oEvent) {
            //Third parameter is to differentiate whether it's Tile Actions icon field or general icon field. If it's true, then it's tile actions icon field, else general icon field.
            utils.actionSelectOnValueHelpRequest(this, oEvent, false);
        },
        // change handler for check box
        onCheckBoxChange : function (oEvent) {
            var oView = this.getView(),
                oSemanticObjectSelector = oView.byId("navigation_semantic_objectInput"),
                oModel = oSemanticObjectSelector.getModel(),
                value = oEvent.getSource().getSelected();
            oModel.setProperty("/enabled", value);
            utils.checkInput(this.getView(), oEvent);
        },
        // forward icon value help request to utils
        onIconValueHelpRequest : function (oEvent) {
            //Third parameter is to differentiate whether it's Tile Actions icon field or general icon field. If it's true, then it's tile actions icon field, else general icon field.
            utils.iconSelectOnValueHelpRequest(this, oEvent, false);
        },
        // forward icon close request to utils
        onSelectIconClose: function () {
            utils.onSelectIconClose(this.getView());
        },
        // forward icon ok to utils
        onSelectIconOk: function () {
            utils.onSelectIconOk(this.getView());
        },
        //This function applies table logic for the Action according to the Target Type:
        //if Taregt Type is URL, then Action field should be disabled else if it's Intent, then the Action field should be enabled.
        handleTargetTypeChange : function(oTargetTypeComboBox){
            utils.onTargetTypeChange(oTargetTypeComboBox);
        },
        //forward tile actions semantic object value helper request to utils
        onTileActionValueHelp : function (oEvent) {
            //Third parameter is to differentiate whether it's Tile Actions icon field or general icon field. If it's true, then it's tile actions icon field, else general icon field.
            utils.objectSelectOnValueHelpRequest(this, oEvent, true);
        },
        //forward icon value help request to utils
        onTileActionIconValueHelp : function (oEvent) {
            //Third parameter is to differentiate whether it's Tile Actions icon field or general icon field. If it's true, then it's tile actions icon field, else general icon field.
            utils.iconSelectOnValueHelpRequest(this, oEvent, true);
        },
        //adds new row in the tile actions table
        addRow : function(){
            utils.addTileActionsRow(this.getView());
        },
        //delets row in the tile actions table
        deleteRow : function(){
            utils.deleteTileActionsRow(this.getView());
        }
    });


}, /* bExport= */ true);
},
	"sap_ushell_demotiles_abap_customTileDynamic/sap/ushell/demotiles/abap/customTileDynamic/Configuration.view.xml":'<?xml version="1.0" encoding="UTF-8" ?>\r\n<!-- ${copyright} -->\r\n<core:View\r\n  controllerName="sap.ushell.demotiles.abap.customTileDynamic.Configuration"\r\n  xmlns="sap.m"\r\n  xmlns:core="sap.ui.core"\r\n  xmlns:form="sap.ui.layout.form"\r\n  xmlns:layout="sap.ui.layout"\r\n  xmlns:table="sap.ui.table"\r\n  xmlns:clayout="sap.ui.commons.layout"\r\n  xmlns:common="sap.ui.commons"\r\n>\r\n<MessageStrip id="messageStrip" showIcon="true" showCloseButton="false" visible="false"/>\r\n<form:SimpleForm id="configuration" maxContainerCols="8" minWidth="1024" editable="true">\r\n  <form:content>\r\n    <core:Title id="categoryCommon"\r\n      text="{i18n>configuration.category.general}"></core:Title>\r\n    <Label text="{i18n>configuration.display_title_text}"></Label>\r\n    <Input id="titleInput" value="{/config/display_title_text}" width="100%"\r\n      tooltip="{i18n>configuration.display_title_text.tooltip}" enabled="{/config/editable}"\r\n      editable="{/config/isLocaleSuitable}" />\r\n    <Label text="{i18n>configuration.display_subtitle_text}"></Label>\r\n    <Input id="subtitleInput" value="{/config/display_subtitle_text}" enabled="{/config/editable}"\r\n      tooltip="{i18n>configuration.display_subtitle_text.tooltip}"\r\n      editable="{/config/isLocaleSuitable}" />\r\n    <Label text="{i18n>configuration.keywords}"></Label>\r\n    <Input id="keywordsInput" value="{/config/display_search_keywords}" enabled="{/config/editable}" width="100%"\r\n      tooltip="{i18n>configuration.keywords.tooltip}"\r\n      editable="{/config/isLocaleSuitable}" />\r\n    <Label text="{i18n>configuration.display_icon_url}"></Label>\r\n    <Input id="iconInput" value="{/config/display_icon_url}" enabled="{/config/editable}" \r\n      placeholder="sap-icon://inbox" tooltip="{i18n>configuration.display_icon_url.tooltip}"\r\n      liveChange="onConfigurationInputChange" valueHelpRequest="onIconValueHelpRequest" showValueHelp="true" />\r\n\r\n    <Label text="{i18n>configuration.display_info_text}"></Label>\r\n    <Input id="infoInput" value="{/config/display_info_text}" width="100%" enabled="{/config/editable}"\r\n      tooltip="{i18n>configuration.display_info_text.tooltip}"\r\n      editable="{/config/isLocaleSuitable}" />\r\n    <Label text="{i18n>configuration.display_number_unit}"></Label>\r\n    <Input id="number_unitInput" value="{/config/display_number_unit}" width="100%" enabled="{/config/editable}"\r\n      tooltip="{i18n>configuration.display_number_unit.tooltip}"/>\r\n\r\n    <core:Title id="categoryDynamicData"\r\n      text="{i18n>configuration.category.dynamic_data}"></core:Title>\r\n    <Label text="{i18n>configuration.service_url}"></Label>\r\n    <Input id="serviceUrlInput" value="{/config/service_url}" width="100%" enabled="{/config/editable}"\r\n       tooltip="{i18n>configuration.service_url.tooltip}"/>\r\n    <Label text="{i18n>configuration.service_refresh_interval}"></Label>\r\n    <Input id="refreshInput" value="{/config/service_refresh_interval}" type="Number" enabled="{/config/editable}"\r\n      placeholder="{i18n>configuration.seconds}"\r\n      tooltip="{i18n>configuration.seconds.tooltip}"\r\n      />\r\n\r\n    <core:Title id="categoryNavigation"\r\n      text="{i18n>configuration.category.navigation}"></core:Title>\r\n    <Label text="{i18n>configuration.navigation_use_semantic_object}"></Label>\r\n    <CheckBox id="useLpdCheckbox" selected="{/config/navigation_use_semantic_object}" select="onCheckBoxChange"\r\n      tooltip="{i18n>configuration.navigation_use_semantic_object.tooltip}" enabled="{/config/editable}"/> \r\n    <Label text="{i18n>configuration.semantic_object}"></Label>\r\n    <Input id="navigation_semantic_objectInput" width="100%" tooltip="{i18n>configuration.semantic_object.tooltip}" maxLength="30"\r\n        liveChange="onConfigurationInputChange" valueHelpRequest="onValueHelpRequest" showValueHelp="true" showSuggestion="true"\r\n        enabled="{= ${/enabled} &amp;&amp; ${/config/editable}}" value="{/value}" />\r\n    <Label text="{i18n>configuration.navigation_semantic_action}"></Label>\r\n    <Input id="navigation_semantic_actionInput" value="{/config/navigation_semantic_action}" width="100%" maxLength="50"\r\n      enabled="{= ${/config/navigation_use_semantic_object} &amp;&amp; ${/config/editable}}" tooltip="{i18n>configuration.navigation_semantic_action.tooltip}"\r\n      liveChange="onConfigurationInputChange" valueHelpRequest="onActionValueHelpRequest" showValueHelp="true" showSuggestion="true"/>\r\n    <Label text="{i18n>configuration.navigation_semantic_parameters}"></Label>\r\n    <Input id="navigation_semantic_parametersInput" value="{/config/navigation_semantic_parameters}" width="100%"\r\n      enabled="{= ${/config/navigation_use_semantic_object} &amp;&amp; ${/config/editable}}" tooltip="{i18n>configuration.navigation_semantic_parameters.tooltip}"/>\r\n    <Label text="{i18n>configuration.navigation_target_url}"></Label>\r\n    <Input id="targetUrl" value="{/config/navigation_target_url}" type="Url" width="100%"\r\n       tooltip="{i18n>configuration.navigation_target_url.tooltip}"/>\r\n\r\n    <core:Title id="categoryTileActions"\r\n      text="{i18n>configuration.category.tile_actions}"></core:Title>\r\n    <table:Table id="tileActions"\r\n      rows="{/config/tile_actions_rows}"\r\n      selectionBehavior="Row"\r\n      selectionMode="Multi"\r\n      visibleRowCount="3"\r\n      enableColumnReordering="false"\r\n      rowHeight="30px"\r\n      >\r\n      <table:Column id="menuItem" width="80px" tooltip="{i18n>configuration.tile_actions.table.menu_item_tooltip}">\r\n        <Label text="{i18n>configuration.tile_actions.table.menu_item}"/>\r\n        <table:template>\r\n          <common:TextField value="{menu_title}" enabled="{editable}" valueState="{valueState}"></common:TextField>\r\n        </table:template>\r\n      </table:Column>\r\n\r\n      <table:Column id="targetType" width="85px" tooltip="{i18n>configuration.tile_actions.table.target_type_tooltip}">\r\n        <Label text="{i18n>configuration.tile_actions.table.target_type}"/>\r\n        <table:template>\r\n          <common:ComboBox id="targetTypeCB" value="{target_type}" enabled="{editable}" change="handleTargetTypeChange"></common:ComboBox>\r\n        </table:template>\r\n      </table:Column>\r\n\r\n      <table:Column id="navigationTarget" width="162px" tooltip="{i18n>configuration.tile_actions.table.navigation_target_tooltip}">\r\n        <Label text="{i18n>configuration.tile_actions.table.navigation_target}"/>\r\n        <table:template>\r\n          <Input liveChange="onConfigurationInputChange" valueHelpRequest="onTileActionValueHelp" showValueHelp="{isTargetTypeIntent}"\r\n            showSuggestion="{isTargetTypeIntent}" value="{navigation_target}" enabled="{editable}"/>\r\n        </table:template>\r\n      </table:Column>\r\n\r\n      <table:Column id="action" width="85px" tooltip="{i18n>configuration.tile_actions.table.action_tooltip}">\r\n        <Label text="{i18n>configuration.tile_actions.table.action}"/>\r\n        <table:template>\r\n          <common:TextField value="{action}" enabled="{isTargetTypeIntent}"></common:TextField>\r\n        </table:template>\r\n      </table:Column>\r\n\r\n      <table:Column id="icon" width="110px" tooltip="{i18n>configuration.tile_actions.table.icon_tooltip}">\r\n        <Label text="{i18n>configuration.tile_actions.table.icon}"/>\r\n        <table:template>\r\n          <Input value="{icon}" placeholder="sap-icon://inbox" enabled="{/config/editable}" valueState="{iconValueState}" valueStateText="{iconValueStateText}"\r\n            liveChange="onConfigurationInputChange" valueHelpRequest="onTileActionIconValueHelp" showValueHelp="true" />\r\n        </table:template>\r\n      </table:Column>\r\n    </table:Table>\r\n    <Label/>\r\n\r\n    <clayout:MatrixLayout>\r\n      <clayout:MatrixLayoutRow>\r\n        <clayout:MatrixLayoutCell hAlign="End">\r\n          <common:Button id="addRow" text="{i18n>configuration.tile_actions.table.add}" enabled="{/config/editable}" tooltip="{i18n>configuration.tile_actions.table.add_tooltip}" press="addRow" width="100px"/>\r\n          <common:Button id="deleteRow" text="{i18n>configuration.tile_actions.table.remove}" enabled="{/config/editable}" tooltip="{i18n>configuration.tile_actions.table.remove_tooltip}" press="deleteRow" width="100px"/>\r\n        </clayout:MatrixLayoutCell>\r\n      </clayout:MatrixLayoutRow>\r\n    </clayout:MatrixLayout>\r\n\r\n  </form:content>\r\n</form:SimpleForm>\r\n\r\n   <HBox visible="false">\r\n    <Dialog id="selectIconDialog" leftButton="ok" rightButton="cancel" title="{i18n>configuration.select_icon}">\r\n      <content>\r\n        <layout:ResponsiveFlowLayout id="icons" />\r\n        <HBox visible="true">\r\n          <Button id="ok" enabled="{/config/ok.enabled}" text="{i18n>configuration.ok}"/>\r\n          <Button id="cancel" text="{i18n>configuration.cancel}" press="onSelectIconClose"/>\r\n        </HBox>\r\n      </content>\r\n    </Dialog>\r\n   </HBox>\r\n</core:View>',
	"sap_ushell_demotiles_abap_customTileDynamic/sap/ushell/demotiles/abap/customTileDynamic/DynamicTile.controller.js":function(){// ${copyright}
sap.ui.define([
    "sap/ui/thirdparty/datajs",
    "sap/ushell/components/tiles/utils",
    "sap/ushell/components/tiles/utilsRT",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/Config",
    "sap/ushell/services/AppType"
], function (datajs, utils, utilsRT, AppLifeCycle, Config, AppType) {
	"use strict";

	var S_NAMESPACE = "sap.ushell.demotiles.abap.customTileDynamic";

    /*global jQuery, OData, sap, setTimeout, hasher */
    sap.ui.getCore().loadLibrary("sap.m");
    sap.ui.controller(S_NAMESPACE + ".DynamicTile", {
        // handle to control/cancel browser's setTimeout()
        timer : null,
        // handle to control/cancel data.js OData.read()
        oDataRequest : null,
        onInit : function () {
            var oView = this.getView(),
                oViewData = oView.getViewData(),
                oTileApi = oViewData.chip,
                oConfig = utilsRT.getConfiguration(oTileApi, oTileApi.configurationUi.isEnabled(), false),
                oModel,
                sKeywords,
                aKeywords,
                that = this,
                sNavigationTargetUrl = oConfig.navigation_target_url,
                sSystem,
                oUrlParser,
                oHash,
                sizeBehavior = "Responsive",
                sBackgroundImage = jQuery.sap.getModulePath(S_NAMESPACE) + "/custom_tile.png";

            this.bIsRequestCompleted = false;
            this.oShellModel = AppLifeCycle.getElementsModel();
            sSystem = oTileApi.url.getApplicationSystem();
            if (sSystem) { // propagate system to target application
                oUrlParser = sap.ushell.Container.getService("URLParsing");
                // when the navigation url is hash we want to make sure system parameter is in the parameters part
                if (oUrlParser.isIntentUrl(sNavigationTargetUrl)){
                    oHash = oUrlParser.parseShellHash(sNavigationTargetUrl) ;
                    if ( !oHash.params){
                        oHash.params = {};
                    }
                    oHash.params["sap-system"] = sSystem;
                    sNavigationTargetUrl = "#"+ oUrlParser.constructShellHash(oHash);
                } else {
                    sNavigationTargetUrl += ((sNavigationTargetUrl.indexOf("?") < 0) ? "?" : "&")
                        + "sap-system=" + sSystem;
                }
            }
            this.navigationTargetUrl = sNavigationTargetUrl;
            /*
             * Model of the applauncher tile consisting of
             *          config (tile configuration),
             *          data (dyanmic data read from a data source)
             *          nav (target URL set to '' in case of Admin UI), and
             *          search (highlight terms)
             */
              if (this.oShellModel) {
                if (this.oShellModel.getModel()) {
                    sizeBehavior = this.oShellModel.getModel().getProperty("/sizeBehavior") ? this.oShellModel.getModel().getProperty("/sizeBehavior") : "Responsive" ;
                }
              }
            oModel = new sap.ui.model.json.JSONModel({
                sizeBehavior : sizeBehavior,
                mode: oConfig["display_mode"] || sap.m.GenericTileMode.ContentMode,
                backgroundImage: sBackgroundImage,
                config: oConfig,
                data: utilsRT.getDataToDisplay(oConfig, {
                    number: (oTileApi.configurationUi.isEnabled() ? 1234 : "...")
                }),
                nav: {navigation_target_url: (oTileApi.configurationUi && oTileApi.configurationUi.isEnabled() ? "" : sNavigationTargetUrl)},
                search: {
                    display_highlight_terms: []
                }
            });
            oView.setModel(oModel);

            // implement types contact
            // default is Tile
            if (oTileApi.types) {
                oTileApi.types.attachSetType(function (sType) {
                    //preform the change only if this is a different type then already set
                    //that.tileType can be undefiend in the initialization flow
                    if (that.tileType != sType){
                        var oModel = that.getView().getModel();
                        if (sType === 'link') {
                            oModel.setProperty("/mode", sap.m.GenericTileMode.LineMode);
                        } else {
                            oModel.setProperty("/mode", oModel.getProperty("/config/display_mode") || sap.m.GenericTileMode.ContentMode);
                        }
                        that.tileType = sType;
                    }
                });
            }

            //if tileType is not set it means that we did not set any content
            //therefore we are setting the defualt value which is 'tile'
            if (!this.tileType){
                var oTileControl = this.getView().getTileControl();
                this.getView().addContent(oTileControl);
                this.tileType = "tile";
            }

            // implement search contract
            if (oTileApi.search) {
                // split and clean keyword string (may be comma + space delimited)
                sKeywords = oView.getModel().getProperty("/config/display_search_keywords");
                aKeywords = sKeywords
                    .split(/[, ]+/)
                    .filter(function (n, i) { return n && n !== ""; });

                // add title and subtitle (if present) to keywords for better FLP searching
                if (oConfig.display_title_text && oConfig.display_title_text !== "" &&
                    aKeywords.indexOf(oConfig.display_title_text) === -1) {
                    aKeywords.push(oConfig.display_title_text);
                }
                if (oConfig.display_subtitle_text && oConfig.display_subtitle_text !== "" &&
                    aKeywords.indexOf(oConfig.display_subtitle_text) === -1) {
                    aKeywords.push(oConfig.display_subtitle_text);
                }
                if (oConfig.display_info_text && oConfig.display_info_text !== "" &&
                    aKeywords.indexOf(oConfig.display_info_text) === -1) {
                    aKeywords.push(oConfig.display_info_text);
                }

                // defined in search contract:
                oTileApi.search.setKeywords(aKeywords);
                oTileApi.search.attachHighlight(
                    function (aHighlightWords) {
                        // update model for highlighted search term
                        oView.getModel().setProperty("/search/display_highlight_terms", aHighlightWords);
                    }
                );
            }

            // implement bag update handler
            if (oTileApi.bag && oTileApi.bag.attachBagsUpdated) {
                // is only called by the FLP for bookmark tiles which have been updated via bookmark service
                oTileApi.bag.attachBagsUpdated(function (aUpdatedBagIds) {
                    if (aUpdatedBagIds.indexOf("tileProperties") > -1) {
                        utils._updateTilePropertiesTexts(oView, oTileApi.bag.getBag('tileProperties'));
                    }
                });
            }

            // implement configuration update handler
            if (oTileApi.configuration && oTileApi.configuration.attachConfigurationUpdated) {
                // is only called by the FLP for bookmark tiles which have been updated via bookmark service
                oTileApi.configuration.attachConfigurationUpdated(function (aUpdatedConfigKeys) {
                        if (aUpdatedConfigKeys.indexOf("tileConfiguration") > -1) {
                            utils._updateTileConfiguration(oView, oTileApi.configuration.getParameterValueAsString("tileConfiguration"));
                        }
                    });
            }

            // implement preview contract
            if (oTileApi.preview) {
                oTileApi.preview.setTargetUrl(sNavigationTargetUrl);
                oTileApi.preview.setPreviewIcon(oConfig.display_icon_url);
                oTileApi.preview.setPreviewTitle(oConfig.display_title_text);
                if (oTileApi.preview.setPreviewSubtitle && typeof oTileApi.preview.setPreviewSubtitle === 'function'){
                    oTileApi.preview.setPreviewSubtitle(oConfig.display_subtitle_text);
                }
            }

            // implement refresh contract
            if (oTileApi.refresh) {
                oTileApi.refresh.attachRefresh(this.refreshHandler.bind(null, this));
            }

            // attach the refresh handler also for the visible contract, as we would like
            // on setting visible to true, to directly go and call the oData call
            if (oTileApi.visible) {
                oTileApi.visible.attachVisible(this.visibleHandler.bind(this));
            }

            // implement configurationUi contract: setup configuration UI
            if (oTileApi.configurationUi.isEnabled()) {
                oTileApi.configurationUi.setUiProvider(function () {
                    // attach configuration UI provider, which is essentially a components.tiles.dynamicapplauncher.Configuration
                    var oConfigurationUi = utils.getConfigurationUi(oView, "sap.ushell.demotiles.abap.customTileDynamic.Configuration");
                    oTileApi.configurationUi.attachCancel(that.onCancelConfiguration.bind(null, oConfigurationUi));
                    oTileApi.configurationUi.attachSave(that.onSaveConfiguration.bind(null, oConfigurationUi));
                    return oConfigurationUi;
                });

                this.getView().getContent()[0].setTooltip(
                    utils.getResourceBundleModel().getResourceBundle()
                        .getText("edit_configuration.tooltip")
                );
            } else if (!oTileApi.preview || !oTileApi.preview.isEnabled()) {
                    if (!sSystem) {
                        sap.ushell.Container.addRemoteSystemForServiceUrl(oConfig.service_url);
                    } // else registration is skipped because registration has been done already
                      // outside this controller (e.g. remote catalog registration)

                    // start fetching data from backend service if not in preview or admin mode
                    this.onUpdateDynamicData();
                }

            // attach the tile actions provider for the actions contract
            if (oTileApi.actions) {
                //TODO check new property name with designer dudes
                var aActions = oConfig.actions, aExtendedActions;
                if (aActions) {
                    aExtendedActions = aActions.slice();
                } else {
                    aExtendedActions = [];
                }

                var tileSettingsAction = utilsRT.getTileSettingsAction(oModel, this.onSaveRuntimeSettings.bind(this));
                aExtendedActions.push(tileSettingsAction);

                oTileApi.actions.setActionsProvider(function (){
                    return aExtendedActions;
                });
            }
            sap.ui.getCore().getEventBus().subscribe("launchpad", "sessionTimeout", this.stopRequests, this);
        },
        // convenience function to stop browser's timeout and OData calls
        stopRequests: function () {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            if (this.oDataRequest) {
                try {
                    // marking the flow as in-request-abort-flow
                    // reason for it is that the line below (oDataRequest.abort();) invokes the errorHandlerFn method
                    // and inside it we need to know if we reached the errorHandler due to real requst failure OR
                    // request was aborted
                    this.bIsAbortRequestFlow = true;

                    // actual request abort
                    this.oDataRequest.abort();
                } catch (e) {
                    jQuery.sap.log.warning(e.name,e.message);
                }

                // remove the flag
                this.bIsAbortRequestFlow = undefined;
            }
        },
        // destroy handler stops requests
        onExit: function () {
            this.stopRequests();
            sap.ui.getCore().getEventBus().unsubscribe("launchpad", "sessionTimeout", this.stopRequests, this);
        },
        // trigger to show the configuration UI if the tile is pressed in Admin mode
        onPress: function (oEvent) {
            var oView = this.getView(),
                oViewData = oView.getViewData(),
                oModel = oView.getModel(),
                sTargetUrl = oModel.getProperty("/nav/navigation_target_url"),
                oTileApi = oViewData.chip,
                oTileConfig = oModel.getProperty("/config");

            //scope is property of generic tile. It's default value is "Display"
            if (oEvent.getSource().getScope && oEvent.getSource().getScope() === sap.m.GenericTileScope.Display) {
                if (oTileApi.configurationUi.isEnabled()) {

                    oTileApi.configurationUi.display();
                } else if (sTargetUrl) {
                    if (sTargetUrl[0] === "#") {
                        hasher.setHash(sTargetUrl);
                    } else {
                        var bLogRecentActivity = Config.last("/core/shell/enableRecentActivity") && Config.last("/core/shell/enableRecentActivityLogging");
                        if (bLogRecentActivity) {
                            var oRecentEntry = {
                                title: oTileConfig.display_title_text,
                                appType: AppType.URL,
                                url: oTileConfig.navigation_target_url,
                                appId: oTileConfig.navigation_target_url
                            };
                            sap.ushell.Container.getRenderer("fiori2").logRecentActivity(oRecentEntry);
                        }

                        window.open(sTargetUrl, '_blank');
                    }
                }
            }
        },
        // dynamic data updater
        onUpdateDynamicData: function () {
            var oView = this.getView(),
                oConfig = oView.getModel().getProperty("/config"),
                nservice_refresh_interval = oConfig.service_refresh_interval;
            if (!nservice_refresh_interval) {
                nservice_refresh_interval = 0;
            } else if (nservice_refresh_interval < 10) {
                // log in English only
                jQuery.sap.log.warning(
                    "Refresh Interval " + nservice_refresh_interval
                    + " seconds for service URL " + oConfig.service_url
                    + " is less than 10 seconds, which is not supported. "
                    + "Increased to 10 seconds automatically.",
                    null,
                    "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile.controller"
                );
                nservice_refresh_interval = 10;
            }
            if (oConfig.service_url) {
                this.loadData(nservice_refresh_interval);
            }
        },
        extractData : function (oData) {
            var name,
                aKeys = ["results", "icon", "title", "number", "numberUnit", "info", "infoState", "infoStatus", "targetParams", "subtitle", "stateArrow", "numberState", "numberDigits", "numberFactor"];

            if (typeof oData === "object" && Object.keys(oData).length === 1) {
                name = Object.keys(oData)[0];
                if (jQuery.inArray(name, aKeys) === -1) {
                    return oData[name];
                }
            }
            return oData;
        },
        // tile settings action UI save handler
        onSaveRuntimeSettings: function (oSettingsView) {
            var
                oViewModel = oSettingsView.getModel(),
                oTileApi = this.getView().getViewData().chip,
                oConfigToSave = this.getView().getModel().getProperty("/config");

            oConfigToSave.display_title_text = oViewModel.getProperty('/title');
            oConfigToSave.display_subtitle_text = oViewModel.getProperty('/subtitle');
            oConfigToSave.display_info_text = oViewModel.getProperty('/info');
            oConfigToSave.display_search_keywords = oViewModel.getProperty('/keywords');

            // use bag contract in order to store translatable properties
            var tilePropertiesBag = oTileApi.bag.getBag('tileProperties');
            tilePropertiesBag.setText('display_title_text',       oConfigToSave.display_title_text);
            tilePropertiesBag.setText('display_subtitle_text',    oConfigToSave.display_subtitle_text);
            tilePropertiesBag.setText('display_info_text',        oConfigToSave.display_info_text);
            tilePropertiesBag.setText('display_search_keywords',  oConfigToSave.display_search_keywords);

            function logErrorAndReject (oError) {
                jQuery.sap.log.error(oError, null, "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile.controller");
            }

            // saving the relevant properteis
            tilePropertiesBag.save(
                // success handler
                function () {
                    jQuery.sap.log.debug("property bag 'tileProperties' saved successfully");

                    // update the local tile's config - saving changes on the Model
                    this.getView().getModel().setProperty("/config", oConfigToSave);

                    // update tile's model for changes to appear immediately
                    // (and not wait for the refresh handler which happens every 10 seconds)
                    this.getView().getModel().setProperty('/data/display_title_text',     oConfigToSave.display_title_text);
                    this.getView().getModel().setProperty('/data/display_subtitle_text',  oConfigToSave.display_subtitle_text);
                    this.getView().getModel().setProperty('/data/display_info_text',      oConfigToSave.display_info_text);

                    // call to refresh model which (due to the binding) will refresh the tile
                    this.getView().getModel().refresh();
                }.bind(this),
                logErrorAndReject // error handler
            );
        },
        // configuration save handler
        onSaveConfiguration: function (oConfigurationView) {
            var
            // the deferred object required from the configurationUi contract
                oDeferred = jQuery.Deferred(),
                oModel = oConfigurationView.getModel(),
            // tile model placed into configuration model by getConfigurationUi
                oTileModel = oModel.getProperty("/tileModel"),
                oTileApi = oConfigurationView.getViewData().chip,
                aTileNavigationActions = utils.tileActionsRows2TileActionsArray(oModel.getProperty("/config/tile_actions_rows")),
            // get the configuration to save from the model
                configToSave = {
                    display_icon_url : oModel.getProperty("/config/display_icon_url"),
                    display_number_unit : oModel.getProperty("/config/display_number_unit"),
                    service_url: oModel.getProperty("/config/service_url"),
                    service_refresh_interval: oModel.getProperty("/config/service_refresh_interval"),
                    navigation_use_semantic_object : oModel.getProperty("/config/navigation_use_semantic_object"),
                    navigation_target_url : oModel.getProperty("/config/navigation_target_url"),
                    navigation_semantic_object : jQuery.trim(oModel.getProperty("/config/navigation_semantic_object")) || "",
                    navigation_semantic_action : jQuery.trim(oModel.getProperty("/config/navigation_semantic_action")) || "",
                    navigation_semantic_parameters : jQuery.trim(oModel.getProperty("/config/navigation_semantic_parameters")),
                    display_search_keywords: oModel.getProperty("/config/display_search_keywords")
                };
            //If the input fields icon, semantic object and action are failing the input validations, then through an error message requesting the user to enter/correct those fields
            var bReject = utils.checkInputOnSaveConfig(oConfigurationView);
            if (!bReject) {
                bReject = utils.checkTileActions(oConfigurationView);
            }
            if (bReject) {
                oDeferred.reject("mandatory_fields_missing");
                return oDeferred.promise();
            }
            // overwrite target URL in case of semantic object navigation
            if (configToSave.navigation_use_semantic_object) {
                configToSave.navigation_target_url = utilsRT.getSemanticNavigationUrl(configToSave);
                oModel.setProperty("/config/navigation_target_url", configToSave.navigation_target_url);
            }

            // use bag contract in order to store translatable properties
            var tilePropertiesBag = oTileApi.bag.getBag('tileProperties');
            tilePropertiesBag.setText('display_title_text', oModel.getProperty("/config/display_title_text"));
            tilePropertiesBag.setText('display_subtitle_text', oModel.getProperty("/config/display_subtitle_text"));
            tilePropertiesBag.setText('display_info_text', oModel.getProperty("/config/display_info_text"));
            tilePropertiesBag.setText('display_search_keywords', configToSave.display_search_keywords);

            var tileNavigationActionsBag = oTileApi.bag.getBag('tileNavigationActions');
            //forward populating of tile navigation actions array into the bag, to Utils
            utils.populateTileNavigationActionsBag(tileNavigationActionsBag, aTileNavigationActions);

            function logErrorAndReject (oError, oErrorInfo) {
                jQuery.sap.log.error(oError, null, "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile.controller");
                oDeferred.reject(oError, oErrorInfo);
            }

            // use configuration contract to write parameter values
            oTileApi.writeConfiguration.setParameterValues(
                {tileConfiguration : JSON.stringify(configToSave)},
                // success handler
                function () {
                    var oConfigurationConfig = utilsRT.getConfiguration(oTileApi, false, false),
                    // get tile config data in admin mode
                        oTileConfig = utilsRT.getConfiguration(oTileApi, true, false),
                    // switching the model under the tile -> keep the tile model
                        oModel = new sap.ui.model.json.JSONModel({
                            config: oConfigurationConfig,
                            // keep tile model
                            tileModel: oTileModel
                        });
                    oConfigurationView.setModel(oModel);

                    // update tile model
                    oTileModel.setData({data: oTileConfig, nav: {navigation_target_url: ""}}, false);
                    if (oTileApi.preview) {
                        oTileApi.preview.setTargetUrl(oConfigurationConfig.navigation_target_url);
                        oTileApi.preview.setPreviewIcon(oConfigurationConfig.display_icon_url);
                        oTileApi.preview.setPreviewTitle(oConfigurationConfig.display_title_text);
                        if (oTileApi.preview.setPreviewSubtitle && typeof oTileApi.preview.setPreviewSubtitle === 'function'){
                            oTileApi.preview.setPreviewSubtitle(oConfigurationConfig.display_subtitle_text);
                        }
                    }

                    tilePropertiesBag.save(
                        // success handler
                        function () {
                            jQuery.sap.log.debug("property bag 'tileProperties' saved successfully");
                            // update possibly changed values via contracts
                            if (oTileApi.title) {
                                oTileApi.title.setTitle(
                                    oConfigurationConfig.display_title_text,
                                    // success handler
                                    function () {
                                        oDeferred.resolve();
                                    },
                                    logErrorAndReject // error handler
                                );
                            } else {
                                oDeferred.resolve();
                            }
                        },
                        logErrorAndReject // error handler
                    );

                    tileNavigationActionsBag.save(
                        // success handler
                        function () {
                            jQuery.sap.log.debug("property bag 'navigationProperties' saved successfully");
                        },
                        logErrorAndReject // error handler
                    );
                },
                logErrorAndReject // error handler
            );

            return oDeferred.promise();
        },

         successHandleFn: function (oResult) {
            this.bIsRequestCompleted = true;

            var oConfig = this.getView().getModel().getProperty("/config");
            this.oDataRequest = undefined;
            var oData = oResult,
                oDataToDisplay,
                sTileInfo;


            if (typeof oResult === "object") {
                var uriParamInlinecount = jQuery.sap.getUriParameters(oConfig.service_url).get("$inlinecount");
                if (uriParamInlinecount && uriParamInlinecount === "allpages") {
                    oData = {number: oResult.__count};
                } else {
                    oData = this.extractData(oData);
                }
            } else if (typeof oResult === "string") {
                oData = {number: oResult};
            }

             if ((this.getView().getViewData().properties)&&(this.getView().getViewData().properties.info)){
                if (typeof oData == "object") {
                    sTileInfo = this.getView().getViewData().properties.info;
                    oData.info = sTileInfo;
                }
            }

            oDataToDisplay = utilsRT.getDataToDisplay(oConfig, oData);

            // set data to display
            this.getView().getModel().setProperty("/data", oDataToDisplay);

            // Update this.navigationTargetUrl in case that oConfig.navigation_target_url was changed
            this.navigationTargetUrl = oConfig.navigation_target_url;

            // rewrite target URL
            this.getView().getModel().setProperty("/nav/navigation_target_url",
                utilsRT.addParamsToUrl(
                    this.navigationTargetUrl,
                    oDataToDisplay
                ));
        },

        // error handler
        errorHandlerFn: function (oMessage) {

            // only in case the invocation of errorHandlerFn was not due to explicit request abort we mark
            // the request as completed. In case it WAS due to request abort we do not mark the request as
            // completed, in order for the visibleHandler to resend a request when marked visible again
            // according to the respective logic (see visibleHandler method)
            if (!this.bIsAbortRequestFlow) {
                this.bIsRequestCompleted = true;
            }

            var oConfig = this.getView().getModel().getProperty("/config");
            this.oDataRequest = undefined;
            var sMessage = oMessage && oMessage.message ? oMessage.message : oMessage,
                oResourceBundle = utils.getResourceBundleModel()
                    .getResourceBundle();

            if (sMessage === "Request aborted") {
                // Display abort information in English only
                jQuery.sap.log.info(
                    "Data request from service " + oConfig.service_url + " was aborted", null,
                    "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile"
                );
            } else {
                if (oMessage.response) {
                    sMessage += " - " + oMessage.response.statusCode + " "
                      + oMessage.response.statusText;
                }

                // Display error in English only
                jQuery.sap.log.error(
                    "Failed to update data via service "
                    + oConfig.service_url
                    + ": " + sMessage,
                    null,
                    "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile"
                );
            }

            if (!this.bIsAbortRequestFlow) {
                this.getView().getModel().setProperty("/data",
                    utilsRT.getDataToDisplay(oConfig, {
                        number: "???",
                        info: oResourceBundle.getText("dynamic_data.error"),
                        infoState: "Critical"
                    })
                );
            }
        },

        // configuration cancel handler
        onCancelConfiguration: function (oConfigurationView, successHandler, errorHandle) {
            // re-load old configuration and display
            var oViewData = oConfigurationView.getViewData(),
                oModel = oConfigurationView.getModel(),
            // tile model placed into configuration model by getConfigurationUi
                oTileModel = oModel.getProperty("/tileModel"),
                oTileApi = oViewData.chip,
                oCurrentConfig = utilsRT.getConfiguration(oTileApi, false, false);
            oConfigurationView.getModel().setData({config: oCurrentConfig, tileModel: oTileModel}, false);
        },
        // loads data from backend service
        loadData: function (nservice_refresh_interval) {
            var oDynamicTileView = this.getView(),
                oConfig = oDynamicTileView.getModel().getProperty("/config"),
                sUrl = oConfig.service_url,
                that = this;
            var oTileApi = this.getView().getViewData().chip;
            if (!sUrl) {
                return;
            }
            if (/;o=([;\/?]|$)/.test(sUrl)) { // URL has placeholder segment parameter ;o=
                sUrl = oTileApi.url.addSystemToServiceUrl(sUrl);
            }
            //set the timer if required
            if (nservice_refresh_interval > 0) {
                // log in English only
                jQuery.sap.log.info(
                    "Wait " + nservice_refresh_interval + " seconds before calling "
                    + oConfig.service_url + " again",
                    null,
                    "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile.controller"
                );
                // call again later
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(that.loadData.bind(that, nservice_refresh_interval, false), (nservice_refresh_interval * 1000));
            }

            // Verify the the Tile visibility is "true" in order to issue an oData request`
            if (oTileApi.visible.isVisible() && !that.oDataRequest) {
                var sLang = sap.ui.getCore().getConfiguration().getSAPLogonLanguage();
                if ((sLang) && (sUrl.indexOf("sap-language=") == -1)) {
                    sUrl = sUrl + (sUrl.indexOf("?") >= 0 ? "&" : "?") + "sap-language=" + sLang;
                }
                that.oDataRequest = OData.read(
                    {
                        requestUri: sUrl,
                        headers: {
                            "Cache-Control": "no-cache, no-store, must-revalidate",
                            "Pragma": "no-cache",
                            "Expires": "0"
                        }
                    },
                    // sucess handler
                    this.successHandleFn.bind(this),
                    this.errorHandlerFn.bind(this)
                ); // End of oData.read
            }
        },
        refreshHandler: function (oDynamicTileController, iInterval) {
            var oTileApi = oDynamicTileController.getView().getViewData().chip;
            if (!oTileApi.configurationUi.isEnabled()) {
                iInterval = iInterval ? iInterval : 0;
                oDynamicTileController.loadData(iInterval);
            } else {
                oDynamicTileController.stopRequests();
            }
        },

        // load data in place in case setting visibility from false to true
        // with no additional timer registered
        visibleHandler: function (isVisible) {
            var oView = this.getView(),
                oConfig = oView.getModel().getProperty("/config"),
                nservice_refresh_interval = oConfig.service_refresh_interval;
            if (isVisible) {
                if (nservice_refresh_interval > 0) {
                    //tile is visible and the refresh interval isn't set to 0
                    this.refreshHandler(this, Math.max(nservice_refresh_interval, 10));
                } else if (!this.bIsRequestCompleted) {
                        //tile is visible and data should be updated
                        this.refreshHandler(this, 0);
                    }
            } else {
                this.stopRequests();
            }
        }

    });


}, /* bExport= */ false);
},
	"sap_ushell_demotiles_abap_customTileDynamic/sap/ushell/demotiles/abap/customTileDynamic/DynamicTile.view.js":function(){// ${copyright}

sap.ui.define([
    "sap/m/GenericTile",
], function (GenericTile) {
    "use strict";

    sap.ui.jsview("sap.ushell.demotiles.abap.customTileDynamic.DynamicTile", {
        getControllerName: function () {
            return "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile";
        },

        createContent: function (/*oController*/) {
            this.setHeight("100%");
            this.setWidth("100%");

            return this.getTileControl();
        },

        getTileControl: function () {
            var oController = this.getController();

            return new GenericTile({
                mode: "{/mode}",
                header: "{/data/display_title_text}",
                subheader: "{/data/display_subtitle_text}",
                size: "Auto",
                sizeBehavior: "{/sizeBehavior}",
                backgroundImage: "{/backgroundImage}",
                tileContent: [new sap.m.TileContent({
                    size: "Auto",
                    footer: "{/data/display_info_text}",
                    footerColor: {
                        path: "/data/display_info_state",
                        formatter: function (sFootterColor) {
                            if (!sap.m.ValueColor[sFootterColor]) {
                                sFootterColor = sap.m.ValueColor.Neutral;
                            }
                            return sFootterColor;
                        }
                    },
                    unit: "{/data/display_number_unit}",
                    // We'll utilize NumericContent for the "Dynamic" content.
                    content: [new sap.m.NumericContent({
                        scale: "{/data/display_number_factor}",
                        value: "{/data/display_number_value}",
                        truncateValueTo: 5, // Otherwise, The default value is 4.
                        indicator: "{/data/display_state_arrow}",
                        valueColor: {
                            path: "/data/display_number_state",
                            formatter: function (sValueColor) {
                                if (!sap.m.ValueColor[sValueColor]) {
                                    sValueColor = sap.m.ValueColor.Neutral;
                                }
                                return sValueColor;
                            }
                        },
                        icon: "{/data/display_icon_url}",
                        width: "100%"
                    })]
                })],
                press: [oController.onPress, oController]
            });
        },

        /*
        We should change the color of the text in the footer ("info") to be as received in the tile data in the property (infostate).
        We used to have this functionality when we used the BaseTile. (we added a class which change the text color).
        Today The GenericTile doesn't support this feature, and it is impossible to change the text color.
        Since this feature is documented, we should support it - See BCP:1780008386.
        */
        onAfterRendering: function () {
            var oModel = this.getModel(),
                sDisplayInfoState = oModel.getProperty("/data/display_info_state"),
                elDomRef = this.getDomRef(),
                elFooterInfo = elDomRef ? elDomRef.getElementsByClassName("sapMTileCntFtrTxt")[0] : null;

            if (elFooterInfo) {
                switch (sDisplayInfoState) {
                    case "Negative":
                        //add class for Negative.
                        elFooterInfo.classList.add("sapUshellTileFooterInfoNegative");
                        break;
                    case "Neutral":
                        //add class for Neutral.
                        elFooterInfo.classList.add("sapUshellTileFooterInfoNeutral");
                        break;
                    case "Positive":
                        //add class for Positive.
                        elFooterInfo.classList.add("sapUshellTileFooterInfoPositive");
                        break;
                    case "Critical":
                        //add class for Critical.
                        elFooterInfo.classList.add("sapUshellTileFooterInfoCritical");
                        break;
                    default:
                        return;
                }
            }
        }
    });
});
},
	"sap_ushell_demotiles_abap_customTileDynamic/sap/ushell/demotiles/abap/customTileDynamic/manifest.json":'{\n    "_version": "1.1.0",\n    "sap.flp": {\n        "type": "tile",\n        "tileSize": "1x1"\n    },\n    "sap.app": {\n        "id": "sap.ushell.demotiles.abap.customTileDynamic",\n        "_version": "1.0.0",\n        "type": "application",\n        "applicationVersion": {\n            "version": "1.0.0"\n        },\n        "title": "Custom Dynamic App Launcher",\n        "description": "Custom Tile",\n        "tags": {\n            "keywords": []\n        },\n        "ach": "CA-UI2-INT-FE"\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n        "icons": {\n            "icon": "sap-icon://favorite"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        }\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "componentName": "sap.ushell.demotiles.abap.customTileDynamic",\n        "dependencies": {\n            "minUI5Version": "1.38",\n            "libs": {\n                "sap.m": {}\n            }\n        },\n        "models": {},\n        "rootView": {\n            "viewName": "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile",\n            "type": "JS"\n        },\n        "handleValidation": false\n    }\n}'
},"sap_ushell_demotiles_abap_customTileDynamic/Component-preload"
);
