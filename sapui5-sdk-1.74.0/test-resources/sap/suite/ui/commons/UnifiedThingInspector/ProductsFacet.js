/* eslint-disable */
var oProductsContent = new sap.m.HBox("products-box", {
	items: [
		new sap.m.Image({
			src: "images/strawberry1.jpg",
			width: "64px",
			height: "64px"
		}).addStyleClass("sapUtiTileImagePadding"),
		new sap.m.Image({
			src: "images/strawberry2.jpg",
			width: "64px",
			height: "64px"
		}).addStyleClass("sapUtiTileImagePadding"),
		new sap.m.Image({
			src: "images/strawberry3.jpg",
			width: "64px",
			height: "64px"
		}).addStyleClass("sapUtiTileImagePadding")
	]
});

if (!isPhone) {
	oProductsContent.addItem(new sap.m.Image({
		src: "images/strawberry4.jpg",
		width: "64px",
		height: "64px"
	}).addStyleClass("sapUtiTileImagePadding"));

	oProductsContent.addItem(new sap.m.Image({
		src: "images/strawberry5.jpg",
		width: "64px",
		height: "64px"
	}).addStyleClass("sapUtiTileImagePadding"));
}

var oProductsFacet = new sap.suite.ui.commons.FacetOverview("products-facet", {
	title: "Products",
	quantity: 5,
	content: oProductsContent,
	height: isPhone ? "8rem" : "10rem"
	/*
	 press: function() {
	 setFacetContent("productsImages")
	 }
	 */
});
