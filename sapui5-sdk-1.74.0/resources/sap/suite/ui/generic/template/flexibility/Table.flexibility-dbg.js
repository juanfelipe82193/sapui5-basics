sap.ui.define(["sap/suite/ui/generic/template/changeHandler/RemoveTableColumn",
		"sap/suite/ui/generic/template/changeHandler/RevealTableColumn",
		"sap/suite/ui/generic/template/changeHandler/MoveTableColumns",
		"sap/suite/ui/generic/template/changeHandler/AddTableColumn"],
	function(
		RemoveTableColumn,
		RevealTableColumn,
		MoveTableColumns,
		AddTableColumn
	) {
		"use strict";

		return {
			"removeTableColumn": RemoveTableColumn,
			"revealTableColumn": RevealTableColumn,
			"moveTableColumns": MoveTableColumns,
			"addTableColumn": AddTableColumn
		};
	}, /* bExport= */ true);
