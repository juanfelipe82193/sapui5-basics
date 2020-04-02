/* ============================================================ */
/* Constants                                                    */
/* ============================================================ */
oChartContainerConstants = {
	/**
	 * Table constants.
	 *
	 * @public
	 * @property {Object} table Table property container
	 * @property {String} table.itemBindingPath Table item binding path
	 * @property {String[]} table.columnLabelTexts Table column label texts
	 * @property {String[]} table.templateCellLabelTexts Table template cell label texts
	 */
	table : {
		itemBindingPath : "/businessData",
		columnLabelTexts : ["Sales Month", "Marital Status", "Customer Gender", "Sales Quarter", "Cost", "Unit Price", "Gross Profit", "Sales Revenue"],
		templateCellLabelTexts : ["{Sales_Month}", "{Marital Status}", "{Customer Gender}", "{Sales_Quarter}", "{Cost}", "{Unit Price}", "{Gross Profit}", "{Sales Revenue}"]
	},
	/**
	 * Chart Container constants.
	 *
	 * @public
	 * @property {Object} chartContainer Chart Container property container
	 * @property {String} chartContainer.contentChangeMessage Content change message
	 * @property {String} chartContainer.personalizationPressMessage Personalization button press message
	 * @property {Object} chartContainer.icons Icon constructor properties
	 * @property {Object} chartContainer.dimensionSelectors Dimension selectors
	 * @property {Object[]} chartContainer.selects Select dimension selectors
	 * @property {Object[]} chartContainer.comboBoxes Combo Box dimension selectors
	 * @property {Object} chartContainer.verticalBox Vertical box constants
	 * @property {String} chartContainer.verticalBox.text Text used in the vertical box
	 * @property {Object} chartContainer.visibilityButton Vertical box constants
	 * @property {Object} chartContainer.visibilityButton.text Vertical box text properties
	 * @property {Object} chartContainer.visibilityButton.text.main Main text
	 * @property {Object} chartContainer.visibilityButton.text.reset Rest text
	 * @property {Object} chartContainer.page Page constants
	 * @property {Object} chartContainer.page.title Page title
	 */
	chartContainer : {
		contentChangeMessage: "ContentChange event was fired. Selected Item was changed to:",
		personalizationPressMessage: "Personalization event was fired.",
		icons : [{
			src : "sap-icon://outgoing-call",
			tooltip : "outgoing-call custom icon",
			width : "2em",
			pressMessage : "outgoing-call custom icon pressed: "
		}, {
			src : "sap-icon://accept",
			tooltip : "accept custom icon",
			width : "2em",
			pressMessage :"accept custom icon pressed: "
		}, {
			src : "sap-icon://activity-items",
			tooltip : "activity-items custom icon",
			width : "2em",
			pressMessage : "activity-items custom icon pressed: "
		}],
		dimensionSelectors : {
			selects : [{
				name : "select-name0",
				items : [{
					key : "0",
					text : "item 0"
				}, {
					key : "1",
					text : "item 1"
				}, {
					key : "2",
					text : "item 2 is a little long"
				}, {
					key : "3",
					text : "item 3"
				}]
			}, {
				items : [{
					key : "A",
					text : "item A"
				} ,{
					key : "B",
					text : "item B"
				}]
			}],
			comboBoxes : [{
				selectedKey : 'US',
				items : [{
					key : "US",
					text : "United States"
				}, {
					key : "CA",
					text : "Canada"
				}],
				selectionChangeMessage : "ComboBox 1"
			}]
		},
		verticalBox : {
			text : "Left side content"
		},
		visibilityButton : {
			text : {
				main : "Change Content Visibility",
				reset : "Reset Visibility"
			}
		},
		page : {
			title : "Page title: ChartContainer with full size button"
		}
	},
	/**
	 * Viz Frames' constants.
	 *
	 * @public
	 * @property {Object} vizFrame Viz Frame 1 constants
	 * @property {String} chartContainer.contentChangeMessage Content change message
	 * @property {Object} chartContainer.vizFrameConfig Config
	 * @property {Object} chartContainer.feedItems Feed items
	 * @property {Object[]} chartContainer.analysisObject Analysis object config
	 * @property {Object[]} chartContainer.dataset Dataset
	 * @property {Object} vizFrame Viz Frame 3 constants
	 * @property {String} chartContainer.contentChangeMessage Content change message
	 * @property {Object} chartContainer.vizFrameConfig Config
	 * @property {Object} chartContainer.feedItems Feed items
	 * @property {Object[]} chartContainer.dataset Dataset
	 * @property {Object} vizFrame Viz Frame 5 constants
	 * @property {String} chartContainer.contentChangeMessage Content change message
	 * @property {Object} chartContainer.vizFrameConfig Config
	 * @property {Object} chartContainer.vizProperties Properties
	 * @property {Object} chartContainer.feedItems Feed items
	 * @property {Object[]} chartContainer.dataset Dataset
	 * @property {Object} vizFrame Viz Frame 8 constants
	 * @property {String} chartContainer.contentChangeMessage Content change message
	 * @property {Object} chartContainer.vizFrameConfig Config
	 * @property {Object} chartContainer.feedItems Feed items
	 * @property {Object[]} chartContainer.dataset Dataset
	 */
	vizFrames : {
		bar : {
			vizFrameConfig : {
				width : "600px",
				height : "300px",
				vizType : "bar",
				uiConfig : {
					applicationSet : "fiori"
				},
				vizProperties : {
					plotArea : {
						dataLabel : {
							visible : true,
							formatString : "#,##0.00"
						}
					}
				}
			},
			feedItems : [{
				uid : "primaryValues",
				type : "Measure",
				values : ["Profit"]
			}, {
				uid : "axisLabels",
				type : "Dimension",
				values : []
			}],
			analysisObject : {
				uid : "Full Name of the Country",
				type : "Dimension",
				name : "Full Name of the Country"
			},
			dataset : {
				dimensions : [{
					name : 'Full Name of the Country',
					value : "{Country}"
				}],

				measures : [{
					name : 'Profit',
					value : '{profit}'
				}],
				data : {
					path : "/businessData"
				}
			}
		},
		bubble : {
			vizFrameConfig : {
				width : "600px",
				height : "300px",
				vizType : "bubble",
				uiConfig : {
					applicationSet : "fiori"
				}
			},
			feedItems: [{
				uid : "primaryValues",
				type : "Measure",
				values : ["Cost"]
			}, {
				uid : "secondaryValues",
				type : "Measure",
				values : ["Unit Price"]
			}, {
				uid : "bubbleWidth",
				type : "Measure",
				values : ["Gross Profit"]
			}, {
				uid : "bubbleHeight",
				type : "Measure",
				values : ["Sales Revenue"]
			}, {
				uid : "regionColor",
				type : "Dimension",
				values : ["Sales_Month", "Sales_Quarter", "Customer Gender"]
			}, {
				uid : "regionShape",
				type : "Dimension",
				values : ["Marital Status"]
			}],
			dataset : {
				dimensions : [{
					name : 'Sales_Quarter',
					value : "{Sales_Quarter}"
				}, {
					name : 'Customer Gender',
					value : "{Customer Gender}"
				}, {
					name : 'Sales_Month',
					value : "{Sales_Month}"
				}, {
					name : 'Marital Status',
					value : "{Marital Status}"
				}],
				measures : [{
					name : 'Cost',
					value : '{Cost}'
				}, {
					name : 'Unit Price',
					value : '{Unit Price}'
				}, {
					name : 'Gross Profit',
					value : '{Gross Profit}'
				}, {
					name : 'Sales Revenue',
					value : '{Sales Revenue}'
				}],
				data : {
					path : "/businessData"
				}
			}
		},
		stackedBar : {
			vizFrameConfig: {
				vizType : "stacked_bar",
				uiConfig : {
					applicationSet : "fiori"
				}
			},
			feedItems : [{
				uid : "primaryValues",
				type : "Measure",
				values : ["Profit"]
			}, {
				uid : "axisLabels",
				type : "Dimension",
				values : ["Country"]
			}, {
				uid : "targetValues",
				type : "Measure",
				values : ["Target"]
			}],
			dataset : {
				dimensions : [{
					name : 'Country',
					value : "{Country}"
				}],
				measures : [{
					name : 'Profit',
					value : '{Profit}'
				}, {
					name : 'Target',
					value : '{Target}'
				}],
				data : {
					path : "/"
				}
			}
		},
		bullet : {
			vizFrameConfig : {
				vizType : "bullet",
				uiConfig : {
					applicationSet : "fiori"
				}
			},
			vizProperties : {
				plotArea : {
					showGap : true
				}
			},
			feedItems : [{
				uid : "primaryValues",
				type : "Measure",
				values : ["Profit", "Revenue"]
			}, {
				uid : "axisLabels",
				type : "Dimension",
				values : ["Country"]
			}, {
				uid : "targetValues",
				type : "Measure",
				values : ["Target"]
			}],
			dataset : {
				dimensions : [{
					name : 'Country',
					value : "{Country}"
				}],
				measures : [{
					group : 1,
					name : 'Profit',
					value : '{Revenue2}'
				}, {
					group : 1,
					name : 'Target',
					value : '{Target}'
				}, {
					group : 1,
					name : "Forcast",
					value : "{Forcast}"
				}, {
					group : 1,
					name : "Revenue",
					value : "{Revenue}"
				}, {
					group : 1,
					name : 'Revenue2',
					value : '{Revenue2}'
				}, {
					group : 1,
					name : "Revenue3",
					value : "{Revenue3}"
				}],
				data : {
					path : "/Products"
				}
			}
		}
	}
};
