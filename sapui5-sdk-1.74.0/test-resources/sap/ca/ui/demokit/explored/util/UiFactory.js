jQuery.sap.declare("util.UiFactory");
jQuery.sap.require("sap.m.Text");

util.UiFactory = {

    createDescription: function (text) {
        var result = new sap.m.Text({text: text});
        result.addStyleClass('description');
        return result;
    },

    /**
     * Fills the page header.
     *
     * @param {object} page The page
     * @param {object} view The view
     * @param {string} title Page title
     * @param {string} className Optional parameter. If available, the documentation of the
     * class will be parsed, and the deprecation information, if any, will be displayed.
     */
    fillPageHeader: function (page, view, title, className) {

        var handlePress = jQuery.proxy(function (evt) {
            var code = this._convertCodeToHtml(view._xContent);
            if (jQuery.device.is.phone) {
                sap.ui.getCore().getEventBus().publish("nav", "to", {
                    id: util.Id.CODE,
                    data: {
                        title: title,
                        code: code
                    }
                });
            } else {
                var popover = new sap.m.Popover({
                    title: "Code",
                    placement: sap.m.PlacementType.Bottom,
                    content: [
                        new sap.ui.core.HTML({ content: code })
                    ]
                });
                popover.openBy(evt.getSource());
            }
        }, this);

        var sDeprecation = this._getDeprecationInfo(className);
        var bIsDeprecated = (sDeprecation && sDeprecation.length > 0);
        var titleSuffix = bIsDeprecated ? " - DEPRECATED" : "";

        page.setTitle(title + titleSuffix)
            .setIcon("images/144_iPad_Retina_Web_Clip.png")
            .setShowNavButton(jQuery.device.is.phone)
            .attachNavButtonPress(function () {
                sap.ui.getCore().getEventBus().publish("nav", "back");
            })
            .addHeaderContent(new sap.m.Button({
                icon: "sap-icon://zoom-in",
                press: handlePress
            })
            );

        if (bIsDeprecated) {
            var oText = new sap.m.Text({
                text: sDeprecation,
                width: "100%"
            });
            oText.addStyleClass("sapCaUiDeprecated");
            jQuery.sap.log.warning("DEPRECATION - Adding deprecation information in the page, in first place.");
            page.insertContent(oText, 0);
        }

        return page;
    },

    _loadDocumentation: function (className) {
        try {
            if ( this._deprecations == null ) {
            	// the old sap.ui.demokit-based implementation retrieved an extract from the *.control files 
            	// (called EntityDoc). As this no longer exists in the sap.ui.documentation library,
            	// the api.json is loaded instead and the necessary deprecation info is extracted from it 
                var deprecations = this._deprecations = {};
                var sRootUrl = sap.ui.require.toUrl("") + "../";
                jQuery.ajax({
                    url: sRootUrl + "test-resources/sap/ca/ui/designtime/api.json",
                    dataType: "json",
                    success: function(data) {
                        if ( data && Array.isArray(data.symbols) ) {
                            data.symbols.forEach(function(symbol){
                                if ( symbol.deprecated ) {
                                	// only remember the deprecation part 
                                    deprecations[symbol.name] = {
                                        deprecation: symbol.deprecated.text
                                    };
                                }
                            });
                        }
                    },
                    async: false
                });
            }
            return this._deprecations[className];
        } catch (err) {
            return null;
        }
    },

    _getDeprecationInfo: function (className) {
        var sDeprecation = "";
        var oNotesMeta = null;
        if (className && className.length > 0) {
            oNotesMeta = this._loadDocumentation(className);

            if (typeof oNotesMeta !== "undefined" && oNotesMeta !== null) {
                sDeprecation = oNotesMeta.deprecation;
            }
        }

        return sDeprecation;
    },

    _convertCodeToHtml: function (code) {

        jQuery.sap.require("jquery.sap.encoder");

        code = (new XMLSerializer()).serializeToString(code);

        // Get rid of function around code
        code = code.replace(/^function.+{/, "");
        //code = code.replace(/return \[[\s\S]*/, "");
        code = code.replace(/}[!}]*$/, "");

        // Get rid of unwanted code if CODESNIP tags are used
        code = code.replace(/^[\n\s\S]*\/\/\s*CODESNIP_START/, "");
        code = code.replace(/\/\/\s*CODESNIP_END[\n\s\S]*$/, "");

        // Improve indentation for display
        code = code.replace(/\n\t\t/g, "\n");
        code = code.replace(/\t/g, "  ");

        return '<pre><code>' + jQuery.sap.encodeHTML(code) + '</code></pre>';
    }
};