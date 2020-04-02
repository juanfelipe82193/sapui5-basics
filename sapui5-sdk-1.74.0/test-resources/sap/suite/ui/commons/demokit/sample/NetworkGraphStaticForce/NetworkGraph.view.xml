<mvc:View
		controllerName="sap.suite.ui.commons.sample.NetworkGraphStaticForce.NetworkGraph"
		xmlns="sap.suite.ui.commons.networkgraph"
		xmlns:layout="sap.suite.ui.commons.networkgraph.layout"
		xmlns:mvc="sap.ui.core.mvc"
		xmlns:m="sap.m"
		xmlns:l="sap.ui.layout"
		height="100%">
	<l:FixFlex vertical="true" fixContentSize="5%">
		<l:fixContent>
			<m:HBox width="100%" renderType="Bare">
				<m:Button text="Free Range Marvel" press="freeRangeMarvel" class="sapUiTinyMargin"/>
				<m:Button text="Fixed Avengers Timeline" press="fixedAvengersTimeline" class="sapUiTinyMargin"/>
				<m:Button text="Thor &amp; Captain Standoff" press="thorCaptainStandoff" class="sapUiTinyMargin"/>
				<m:Button text="Arc of Secondary Heroes" press="arcOfSecondaryHeroes" class="sapUiTinyMargin"/>
			</m:HBox>
			<!--<m:HBox width="100%" renderType="Bare">-->
				<!--<m:Slider width="50%" value="{settings>/optimalDistanceConstant}" min="0.2" max="0.4" step="0.01" enableTickmarks="true"/>-->
			<!--</m:HBox>-->
		</l:fixContent>
		<l:flexContent>
			<l:FixFlex vertical="false" fixContentSize="100%">
				<l:fixContent>
					<Graph  enableWheelZoom="false"
							nodes="{/nodes}"
							lines="{/lines}"
							groups="{/groups}"
							id="graph">
						<layoutData>
							<m:FlexItemData minWidth="75%" maxWidth="75%"/>
						</layoutData>
						<layoutAlgorithm>
							<layout:ForceDirectedLayout
									optimalDistanceConstant="0.26"
									maxIterations="{settings>/maxIterations}"
									maxTime="{settings>/maxTime}"
									initialTemperature="{settings>/initialTemperature}"
									coolDownStep="{settings>/coolDownStep}">
							</layout:ForceDirectedLayout>
						</layoutAlgorithm>
						<nodes>
							<Node
									height="{settings>/height}"
									key="{key}"
									title="{title}"
									icon="{icon}"
									group="{group}"
									attributes="{path:'attributes', templateShareable:true}"
									shape="{shape}"
									status="{status}"
									x="{x}"
									y="{y}">
								<attributes>
									<ElementAttribute
											label="{label}"
											value="{value}"/>
								</attributes>
							</Node>
						</nodes>
						<lines>
							<Line
									from="{from}"
									to="{to}"
									status="{status}"
							>
							</Line>
						</lines>
						<groups>
							<Group
									key="{key}"
									title="{title}">
							</Group>
						</groups>
					</Graph>
				</l:fixContent>
			</l:FixFlex>
		</l:flexContent>
	</l:FixFlex>
</mvc:View>
