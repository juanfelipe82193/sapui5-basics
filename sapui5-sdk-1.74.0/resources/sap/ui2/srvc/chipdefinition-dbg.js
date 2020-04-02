// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The <code>sap.ui2.srvc.ChipDefinition</code> object, representing an XML document
 * which defines a CHIP.
 */

this.sap = this.sap || {};

(function () {
  "use strict";
  /*global jQuery, sap */

  sap.ui2 = sap.ui2 || {};
  sap.ui2.srvc = sap.ui2.srvc || {};

  var sNAMESPACE = 'http://schemas.sap.com/sapui2/services/Chip/1',
    fnRequire = String; // NOP (String exists and is free of side-effects)

  // Only declare the module if jQuery.sap exists. Otherwise we do not even try to require assuming
  // that the script has been loaded manually (before SAPUI5).
  // Load time branching pattern
  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.chipdefinition");
    // avoid fnRequire = jQuery.sap.require as require cannot be spied on afterwards
    fnRequire = function () {
      jQuery.sap.require.apply(this, arguments);
    };
  }

  // "private" methods (static) without need to access properties -------------

  /**
   * Returns the local name of the given DOM node.
   * @param {object} oDomNode
   *   the DOM node
   * @returns {string}
   *   the local name
   */
  function getLocalName(oDomNode) {
    // Caution: In IE9 the ActiveX XML parser used in utils.js knows localName, however the
    // XMLHttpRequest doesn't and uses baseName instead!
    return oDomNode.localName || oDomNode.baseName; // W3C vs. IE
  }

  /**
   * Returns the value of the given DOM element's attribute with the given name.
   * <p>
   * Note: We currently expect the attribute not to have a namespace.
   *
   * @param {object} oDomElement
   *   the DOM element
   * @param {string} sName
   *   the attribute name
   * @returns {string}
   *   the attribute value or <code>""</code> if the attribute is not defined
   */
  function getAttribute(oDomElement, sName) {
    var oAttribute, aAttributes, i, n;
    if (typeof oDomElement.getAttributeNS === "function") {
      return oDomElement.getAttributeNS(null, sName);
    }
    // ugly workaround for IE's XMLHttpRequest which doesn't know getAttributeNS, but knows the
    // attribute's namespace
    aAttributes = oDomElement.attributes;
    for (i = 0, n = aAttributes.length; i < n; i += 1) {
      oAttribute = aAttributes[i];
      if (!oAttribute.namespaceURI && getLocalName(oAttribute) === sName) {
        return oAttribute.nodeValue;
      }
    }
    return "";
  }

  /**
   * Returns the text content of the given DOM node.
   *
   * @param {object} oDomNode
   *   the DOM node
   * @returns {string}
   *   the text content (might be <code>""</code> but not <code>undefined</code>
   *   or <code>null</code>)
   */
  function getText(oDomNode) {
    // Note: IE returns "" where FF returns undefined for empty nodes; this leads into trouble
    // when cloning an object via JSON later on!
    return oDomNode.textContent || oDomNode.text || ""; // W3C vs. IE
  }

  /**
   * Visits the children of the given DOM node and call the given handler for each child node
   * with the corresponding name.
   * @param {object} oThat
   *  this used for calling the handlers from <code>mChildHandlers</code>
   * @param {object} oDomNode
   *   the DOM node
   * @param {map<string,function(object)>} mChildHandlers
   *   maps the child name to a handler function. The handler function's parameter is the DOM node.
   */
  function visit(oThat, oDomNode, mChildHandlers) {
    var oChild,
      aChildren = oDomNode.childNodes,
      fnHandler,
      i,
      n;

    for (i = 0, n = aChildren.length; i < n; i += 1) {
      oChild = aChildren[i];
      if (oChild.namespaceURI === sNAMESPACE) {
        fnHandler = mChildHandlers[getLocalName(oChild)];
        if (fnHandler) {
          fnHandler.call(oThat, oChild);
        }
      }
    }
  }

  // "public class" -----------------------------------------------------------

  /**
   * Constructs a new representation of a CHIP definition from the given XML document. We expect
   * the XML document to conform to the schema.
   *
   * @param {object} oXml
   *    The DOM representation of the XML document
   *
   * @class
   * @see sap.ui2.srvc.Chip.
   * @since 1.2.0
   */
  sap.ui2.srvc.ChipDefinition = function (oXml) {
    var that = this;

    if (oXml instanceof sap.ui2.srvc.ChipDefinition) {
      // undocumented "copy constructor", performs deep clone and copies existing stuff only!
      oXml = JSON.parse(JSON.stringify(oXml));
      ["appearance", "contracts", "id", "implementation"].forEach(function (sName) {
        if (Object.prototype.hasOwnProperty.call(oXml, sName)) {
          that[sName] = oXml[sName];
        }
      });
      return;
    }

    if (getLocalName(oXml.documentElement) !== 'chip'
        || oXml.documentElement.namespaceURI !== sNAMESPACE) {
      if (!sap.ui2.srvc.Error) {
        fnRequire("sap.ui2.srvc.error");
      }
      throw new sap.ui2.srvc.Error('Missing root <chip>', 'sap.ui2.srvc.ChipDefinition');
    }

    visit(this, oXml.documentElement, {
      appearance: function (oAppearanceNode) {
        this.appearance = {};

        visit(this.appearance, oAppearanceNode, {
          description: function (oDescriptionNode) {
            this.description = getText(oDescriptionNode);
          },

          title: function (oTitleNode) {
            this.title = getText(oTitleNode);
          }
        });
      },

      contracts: function (oContractsNode) {
        this.contracts = {};

        visit(this.contracts, oContractsNode, {
          consume: function (oConsumeNode) {
            var sId = getAttribute(oConsumeNode, 'id');
            this[sId] = {};

            visit(this[sId], oConsumeNode, {
              parameters: function (oParametersNode) {
                this.parameters = {};

                visit(this.parameters, oParametersNode, {
                  parameter: function (oParameterNode) {
                    var sName = getAttribute(oParameterNode, 'name');
                    this[sName] = getText(oParameterNode);
                  }
                });
              }
            });
          }
        });
      },

      id: function (oIdNode) {
        this.id = getText(oIdNode);
      },

      implementation: function (oImplementationNode) {
        this.implementation = {};

        visit(this.implementation, oImplementationNode, {
          sapui5: function (oUi5Node) {
            this.sapui5 = {basePath: '.'};

            visit(this.sapui5, oUi5Node, {
              basePath: function (oBasePathNode) {
                this.basePath = getText(oBasePathNode);
              },
              componentName: function (oComponentNameNode) {
                this.componentName = getText(oComponentNameNode);
              },
              viewName: function (oViewNameNode) {
                this.viewName = getText(oViewNameNode);
              }
            });
          }
        });
      }
    });

    // paranoid mode to avoid memory leaks
    oXml = null;
  };
}());
