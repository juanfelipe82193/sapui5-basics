if (!window.sap) {
	window.sap = {};
}

if (!sap.zen) {
	sap.zen = {};
}

if (!sap.zen.crosstab) {
	sap.zen.crosstab = {};
}

if (!sap.zen.crosstab.testutils) {
	sap.zen.crosstab.testutils = {};
}

if (!sap.zen.crosstab.testutils.TestUtils) {
	sap.zen.crosstab.testutils.TestUtils = {};
}

if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

sap.zen.crosstab.testutils.TestUtils.checkCellbyId = function(oArea, iRow, iCol) {
	var oCell = oArea.getCell(iRow, iCol);
	ok(oCell, "The cell must exist in the model.");

	// get the cell from DOM table in the given position
	var oDomCell = jQuery.sap.byId(oCell.getId());
	ok(oDomCell.length > 0, "Cell must be rendered in DOM");

	var oDomContentDiv = oDomCell.find("#" + $.sap.encodeCSS(oDomCell.attr("id") + "_contentDiv"));
	ok(oDomContentDiv, "A div containing the content must exist.");
	ok(oCell.getText().trim() === sap.zen.crosstab.utils.Utils.prepareStringForRendering(oDomContentDiv.text().trim()).text, "The text must be " + oCell.getText() + ", found: "
			+ oDomContentDiv.text());
};

sap.zen.crosstab.testutils.TestUtils.checkCell = function(oArea, iRow, iCol) {
	var oCell = oArea.getCell(iRow, iCol);
	ok(oCell, "The cell must exist in the model.");

	// get the cell from DOM table in the given position
	var oDomCell = $($($(document.getElementById(oArea.getId())).children("tbody").children("tr")[iRow]).children("td")[iCol]);
	var oDomCellId = oDomCell.attr("id");
	ok(oCell.getId() === oDomCellId, "Cell is not in correct position");

	var oDomContentDiv = oDomCell.find("#" + $.sap.encodeCSS(oDomCellId + "_contentDiv"));
	ok(oDomContentDiv, "A div containing the content must exist.");
	ok(oCell.getText().trim() === sap.zen.crosstab.utils.Utils.prepareStringForRendering(oDomContentDiv.text().trim()).text, "The text must be " + oCell.getText() + ", found: "
			+ oDomContentDiv.text());

};

sap.zen.crosstab.testutils.TestUtils.checkDataModelCellInDom = function(oArea, iRow, iCol, iDomRow, iCellIndexInRow) {
	var oCell = oArea.getCell(iRow, iCol);
	ok(oCell, "The cell (row: " + iRow + "/col: " + iCol + ") must exist in the model.");

	// get the cell from DOM table in the given screen position
	var oDomRows = $(document.getElementById(oArea.getId())).children("tbody").children("tr");
	var iRowIndex = iDomRow;
	if (oDomRows.length > 0 && iDomRow > oDomRows.length - 1) {
		iRowIndex = oDomRows.length - 1;
	}
	var oDomCell = $($(oDomRows[iRowIndex]).children("td")[iCellIndexInRow]);
	var oDomCellId = oDomCell.attr("id");
	ok(oCell.getId() === oDomCellId, "Cell with data model coordinates: (" + iRow + "/" + iCol + ") with text: '"
			+ oCell.getText() + "' in Area: '" + oArea.getAreaType() + "' found at DOM row: " + iDomRow
			+ " cell index: " + iCellIndexInRow);
};

sap.zen.crosstab.testutils.TestUtils.getDomCellFromDataModelCell = function(oArea, iRow, iCol) {
	var oCell = oArea.getCell(iRow, iCol);
	var oDomCell = jQuery.sap.byId(oCell.getId());
	return oDomCell;
};

sap.zen.crosstab.testutils.TestUtils.triggerCrosstabReRendering = function(oCrosstab) {
	oCrosstab.invalidate();
	sap.ui.getCore().applyChanges();
	oCrosstab.doRendering();
};

sap.zen.crosstab.testutils.TestUtils.triggerCrosstabUpdate = function(oCrosstab) {
	oCrosstab.prepareExistingDom();
	oCrosstab.doRendering();
};