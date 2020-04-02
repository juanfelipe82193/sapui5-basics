oChartContainerHelpers = {
	/**
	 * Creates a new JSONModel with the specified data.
	 *
	 * @public
	 * @param {Object} data Data for the model
	 * @returns {sap.ui.model.json.JSONModel} JSON model
	 */
	getVizFrameModel : function(data) {
		return new sap.ui.model.json.JSONModel(data);
	},
	/**
	 * Creates a list new sap.ui.core.Item controls with the specified properties.
	 *
	 * @public
	 * @returns {sap.ui.core.Item[]} Array of items
	 * @param {Object} items Item config
	 * @param {sap.ui.core.Item[]} Array of sap.ui.core.Item controls
	 */
	getCoreItems : function(items) {
		var aItems = [];

		for (var i = 0; i < items.length; i++) {
			aItems.push(
				new sap.ui.core.Item(items[i])
			);
		}

		return aItems;
	},
	/**
	 * Adds the passed feed items to the passed Viz Frame.
	 *
	 * @public
	 * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame to add feed items to
	 * @param {Object[]} feedItems Feed items to add
	 */
	addFeedItems : function(vizFrame, feedItems) {
		for (var i = 0; i < feedItems.length; i++) {
			vizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem(feedItems[i]));
		}
	},
	/**
	 * Creates table columns with labels as headers.
	 *
	 * @public
	 * @param {String[]} labels Column labels
	 * @returns {sap.m.Column[]} Array of columns
	 */
	createTableColumns : function(labels) {
		var aLabels = this.createLabels(labels);
		return this._createControls(sap.m.Column, "header", aLabels);
	},
	/**
	 * Creates label control array with the specified texts.
	 *
	 * @public
	 * @param {string[]} labelTexts Label text array
	 * @returns {sap.m.Column[]} Array of columns
	 */
	createLabels : function(labelTexts) {
		return this._createControls(sap.m.Label, "text", labelTexts);
	},
	/**
	 * Creates an array of controls with the specified control type, property name and value.
	 *
	 * @private
	 * @param {sap.ui.core.Control} Control Control type to create
	 * @param {String} prop Property name
	 * @param {Array} propValues Value of the control's property
	 * @returns {sap.ui.core.Control[]} array of the new controls
	 */
	_createControls : function(Control, prop, propValues) {
		var aControls = [];
		var oProps = {};
		for (var i = 0; i < propValues.length; i++) {
			oProps[prop] = propValues[i];
			aControls.push(new Control(oProps));
		}
		return aControls;
	}
};