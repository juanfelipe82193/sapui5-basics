module.exports = function(testId) {
 
return `<mvc:View class="test-view" controllerName="vbm-regression.bcp_tests.${testId}.controller.App" xmlns:l="sap.ui.layout" xmlns="sap.m" xmlns:vbm="sap.ui.vbm" xmlns:mvc="sap.ui.core.mvc">

	<FlexBox direction="Row" width="100%" height="100%">
		<items>

			<Panel width="100%" height="100%">
				<layoutData>
					<FlexItemData baseSize="35%"></FlexItemData>
				</layoutData>
				<content>

					<l:VerticalLayout width="100%">
						<Label text="The aim: " design="Bold"></Label>
						<Text text="To check that ..."></Text>
						<Label class="voffset-25" text="To test:" design="Bold"></Label>
						<Text text="1. Do something..."></Text>
					</l:VerticalLayout>

				</content>
			</Panel>


			<vbm:GeoMap id="vbi" height="100%" width="100%" class="position-absolute">
				<vbm:layoutData>
					<FlexItemData baseSize="65%"></FlexItemData>
				</vbm:layoutData>
			</vbm:GeoMap>

		</items>
	</FlexBox>

</mvc:View>
`
};