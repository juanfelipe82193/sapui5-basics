/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[
		"sap/m/Button",
		"sap/m/library",
		"sap/fe/templates/controls/messages/MessagePopover",
		"sap/ui/core/MessageType",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/uxap/ObjectPageLayout"
	],
	function(Button, mLibrary, MessagePopover, MessageType, Filter, FilterOperator, ObjectPageLayout) {
		"use strict";
		var ButtonType = mLibrary.ButtonType;
		var MessageButton = Button.extend("sap.fe.templates.controls.messages.MessageButton", {
			metadata: {
				properties: {},
				events: {
					messageChange: {}
				},
				aggregations: {
					customFilters: {
						type: "sap.fe.templates.controls.messages.MessageFilter",
						multiple: true,
						singularName: "customFilter"
					}
				}
			},
			renderer: {}
		});

		/**
		 * Method to set the button text, count and icon property based upon the message items
		 * ButtonType:  Critical, Negative for Warning and Error respectively
		 *
		 * @private
		 */
		function _setMessageData() {
			var sIcon,
				sButtonType = ButtonType.Default,
				oMessages = this.oMessagePopover.getItems(),
				iMessageLength = oMessages.length,
				oMessageCount = { Error: 0, Warning: 0, Success: 0, Information: 0 };
			if (iMessageLength > 0) {
				for (var i = 0; i < iMessageLength; i++) {
					++oMessageCount[oMessages[i].getType()];
				}
				if (oMessageCount[MessageType.Error] > 0) {
					sIcon = "sap-icon://message-error";
					sButtonType = ButtonType.Negative;
				} else if (oMessageCount[MessageType.Critical] > 0 || oMessageCount[MessageType.Warning] > 0) {
					sIcon = "sap-icon://message-warning";
					sButtonType = ButtonType.Critical;
				} else if (oMessageCount[MessageType.Success] > 0) {
					sIcon = "sap-icon://message-success";
					sButtonType = ButtonType.Accept;
				} else if (oMessageCount[MessageType.Information] > 0) {
					sIcon = "sap-icon://message-information";
				}
				this.setText(iMessageLength);
				this.setIcon(sIcon);
				this.setType(sButtonType);
				this.setVisible(true);
				this._applyGrouping();
			} else {
				this.setVisible(false);
			}
			this.fireMessageChange({
				iMessageLength: iMessageLength
			});
		}

		/**
		 * Method to set the filters based upon the message items
		 * desired filter operation is :
		 * ( filters provided by user && ( validation = true && Control should be present in view ) || messages for the current matching context )
		 *
		 * @private
		 */
		function _applyFilters() {
			var aCustomFilters,
				oValidationFilters,
				oValidationAndContextFilter,
				oFilters,
				oBindingContext,
				sPath,
				sViewId,
				aUserDefinedFilter = [];
			//Filter function to verify if the control is part of the current view or not
			function getCheckControlInViewFilter() {
				var fnTest = function(aControlIds) {
					if (!aControlIds.length) {
						return false;
					}
					var oControl = sap.ui.getCore().byId(aControlIds[0]);
					while (oControl) {
						if (oControl.getId() === sViewId) {
							return true;
						}
						oControl = oControl.getParent();
					}
					return false;
				};
				return new Filter({
					path: "controlIds",
					test: fnTest,
					caseSensitive: true
				});
			}

			if (!this.sViewId) {
				this.sViewId = this._getViewId(this.getId());
			}
			sViewId = this.sViewId;
			//Add the filters provided by the user
			aCustomFilters = this.getAggregation("customFilters");
			if (aCustomFilters) {
				aCustomFilters.forEach(function(filter) {
					aUserDefinedFilter.push(
						new Filter({
							path: filter.getProperty("path"),
							operator: filter.getProperty("operator"),
							value1: filter.getProperty("value1"),
							value2: filter.getProperty("value2")
						})
					);
				});
			}

			oBindingContext = this.getBindingContext();
			if (!oBindingContext) {
				this.setVisible(false);
				return;
			} else {
				sPath = oBindingContext.getPath();
				//Filter for filtering out only validation messages which are currently present in the view
				oValidationFilters = new Filter({
					filters: [
						new Filter({
							path: "validation",
							operator: FilterOperator.EQ,
							value1: true
						}),
						getCheckControlInViewFilter()
					],
					and: true
				});
				//Filter for filtering out the bound messages i.e target starts with the context path
				oValidationAndContextFilter = new Filter({
					filters: [
						oValidationFilters,
						new Filter({
							path: "target",
							operator: FilterOperator.StartsWith,
							value1: sPath
						})
					],
					and: false
				});
			}
			// Do not add empty array as filters
			oFilters = new Filter({
				filters: aUserDefinedFilter.length > 0 ? [aUserDefinedFilter, oValidationAndContextFilter] : [oValidationAndContextFilter],
				and: true
			});
			this.oItemBinding.filter(oFilters);
		}

		/**
		 * Method called when the title of message is clicked
		 * @function
		 * @name _activeTitlePress
		 * @private
		 * @param {Event} oEvent - Event object passed from the handler
		 */
		function _activeTitlePress(oEvent) {
			var oItem = oEvent.getParameter("item"),
				oMessage = oItem.getBindingContext("message").getObject(),
				oControl = sap.ui.getCore().byId(oMessage.getControlId());
			if (oControl && oControl.getDomRef()) {
				oControl.focus();
			}
		}

		MessageButton.prototype.init = function() {
			//press event handler attached to open the message popover
			this.attachPress(this.handleMessagePopoverPress, this);
			this.oMessagePopover = new MessagePopover();
			this.oItemBinding = this.oMessagePopover.getBinding("items");
			this.oItemBinding.attachChange(_setMessageData.bind(this));
			this.attachModelContextChange(_applyFilters.bind(this));
			this.oMessagePopover.attachActiveTitlePress(_activeTitlePress.bind(this));
		};

		/**
		 * Method called upon click of the message-button control
		 * @param {Object} oEvent - Event object
		 */
		MessageButton.prototype.handleMessagePopoverPress = function(oEvent) {
			this.oMessagePopover.toggle(oEvent.getSource());
		};

		/**
		 * Method to group the messages based upon the section, subsection they belong to
		 *
		 * @private
		 */
		MessageButton.prototype._applyGrouping = function() {
			var aMessages, message, aSections, section, aSubSections, subSection, oElement, aElements, aAllElements, i, j, k;
			this.sGeneralGroupText = this.sGeneralGroupText
				? this.sGeneralGroupText
				: sap.ui
						.getCore()
						.getLibraryResourceBundle("sap.fe.core")
						.getText("SAPFE_MESSAGE_GROUP_GENERAL");

			function fnFilterUponId(sControlId, item) {
				return sControlId === item.getId();
			}

			if (!this.oObjectPageLayout) {
				oElement = this.getParent();
				//Iterate over parent till you have not reached the object page layout
				while (oElement && !(oElement instanceof ObjectPageLayout)) {
					oElement = oElement.getParent();
				}
				//If there is no object page layout then do not apply grouping and return
				if (!oElement) {
					return;
				}
				this.oObjectPageLayout = oElement;
			}
			aMessages = this.oMessagePopover.getItems();
			//Get all sections from the object page layout
			aSections = this.oObjectPageLayout.getSections();

			if (aSections) {
				for (i = aMessages.length - 1; i >= 0; --i) {
					// Loop over all messages
					message = aMessages[i];
					//If the group name is already there then skip for that message
					if (message.getGroupName()) {
						continue;
					}
					for (j = aSections.length - 1; j >= 0; --j) {
						// Loop over all sections
						section = aSections[j];
						aSubSections = section.getSubSections();
						for (k = aSubSections.length - 1; k >= 0; --k) {
							// Loop over all sub-sections
							subSection = aSubSections[k];
							aAllElements = subSection.findElements(true); // Get all elements inside a sub-section
							//Try to find the control inside the sub section
							aElements = aAllElements.filter(
								fnFilterUponId.bind(
									this,
									message
										.getBindingContext("message")
										.getObject()
										.getControlId()
								)
							);
							if (aElements.length > 0) {
								message.setGroupName(section.getTitle() + (subSection.getTitle() ? ", " + subSection.getTitle() : ""));
								// Skip the loop of section and sub-section once group name is set
								j = k = -1;
							} else {
								message.setGroupName(this.sGeneralGroupText);
							}
						}
					}
				}
			}
		};

		/**
		 * Method to retrive the view id (HTMLView/XMLView/JSONview/JSView/Templateview) of any control
		 *
		 * @param {String} sControlId - Id of the control for which we need to get the view id
		 * @return {String} sViewId - View id for the control
		 */
		MessageButton.prototype._getViewId = function(sControlId) {
			var sViewId,
				oControl = sap.ui.getCore().byId(sControlId);
			while (oControl) {
				if (oControl instanceof sap.ui.core.mvc.View) {
					sViewId = oControl.getId();
					break;
				}
				oControl = oControl.getParent();
			}
			return sViewId;
		};

		return MessageButton;
	},
	/* bExport= */ true
);
