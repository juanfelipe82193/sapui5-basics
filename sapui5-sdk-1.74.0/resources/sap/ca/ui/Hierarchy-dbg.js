/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.Hierarchy.
jQuery.sap.declare("sap.ca.ui.Hierarchy");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new Hierarchy.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Display the Hierarchy of an item. Useful to indicates where an object stand in a chain of
 * hierarchical data. The emphasized item shows the one item to display. Optional item can be hidden using the
 * hideOptionalLevels property. Hidden items will stay accessible with an expand button.
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @deprecated Since version 1.24.3. 
 * This control is not required anymore as per central UX requirements.
 * This control will not be supported anymore.
 * @name sap.ca.ui.Hierarchy
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.ui.core.Control.extend("sap.ca.ui.Hierarchy", /** @lends sap.ca.ui.Hierarchy.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	properties : {

		/**
		 * Hide the levels marked optional. An expand button will appear
		 */
		hideOptionalLevels : {type : "boolean", group : "Appearance", defaultValue : true}
	},
	aggregations : {

		/**
		 * The array of HierarchyItem ordered and starting from the root hierarchy
		 */
		items : {type : "sap.ca.ui.HierarchyItem", multiple : true, singularName : "item", bindable : "bindable"}
	}
}});

sap.ca.ui.Hierarchy.prototype._getExpandButton = function () {
    if( isNaN(this._iLink)){
        this._iLink = 0;
    }
    return new sap.m.Link(this.getId()+"-"+(this._iLink++)+"-expandLink",{text:"...", press:jQuery.proxy(this.expand,this)});
};

sap.ca.ui.Hierarchy.prototype.expand = function (e) {
    var oBtn = e.getSource();
    var $expandedLine = oBtn.$().parent();
    var $lineContent = $expandedLine.children(".sapCaUiHierarchyItem");
    oBtn.$().remove();
    jQuery($lineContent).removeClass("sapCaUiHierarchyHidden");
    var aLines = jQuery(".sapCaUiHierarchyItemLine");
    var bShow = false;
    jQuery.each(aLines, function (i, $line) {
        // We found the expanded line so we will start display the hidden lines
        if ($line == $expandedLine[0]) {
            bShow = true;
            return;
        }
        if (bShow) {
            if (jQuery($line).hasClass("sapCaUiHierarchyHidden")) {
                jQuery($line).removeClass("sapCaUiHierarchyHidden");
            } else {
                // No more hidden lines so we stop to not display other lines that are not directly related
                bShow = false;
                return;
            }
        }
    });
    this.indent();
};

sap.ca.ui.Hierarchy.prototype.onAfterRendering = function () {
    this.indent();
    jQuery(window).resize(jQuery.proxy(this.indent, this));
};

sap.ca.ui.Hierarchy.prototype.exit = function () {
    jQuery(window).unbind("resize", jQuery.proxy(this.indent, this));
};

// We handle the indentation here to handle the 50% limit of indentation
sap.ca.ui.Hierarchy.prototype.indent = function () {
    var step = 20;
    var minIndent = 8;
    var minWidth = step;
    var lines = jQuery(".sapCaUiHierarchyItemLine").not(".sapCaUiHierarchyHidden");
    var maxWidth = this.$().width() * 0.5;
    var maxIndent = (step * lines.length) + minIndent;
    if (maxIndent > maxWidth) {
        step = Math.floor(maxWidth / lines.length);
    }
    jQuery.each(lines, function (i, line) {
        // When it's the first line we don't have an icon so we don't bother doing the work
        if (i > 0) {
            var $iconDiv = jQuery(line).children(".sapCaUiHierarchyIconContainer");
            var w = i * step;
            if (w < minWidth) {
                w = minWidth;
            }
            jQuery($iconDiv).width(w + minIndent + "px").css("min-width", w + minIndent + "px");
        }
    });
};



