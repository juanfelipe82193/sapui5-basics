// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/Opa5",
    "./arrangement/Common",
    "./ShellHeaderJourney",
    "./ShellAppTitleJourney",
    "./TileBaseJourney",
    "./ToolAreaJourney",
    "./ToolAreaItemJourney",
    "./NavigationMenuJourney",
    "./NavigationMiniTileJourney",
    "./RightFloatingContainerJourney",
    "./TileJourney",
    "./NotificationListGroupJourney",
    "./NotificationListItemJourney"
], function (Opa5, Common) {
    "use strict";
    Opa5.extendConfig({
        arrangements: new Common(),
        viewNamespace: "ControlPlaygrounds.view.",
        autoWait: true
    });
});