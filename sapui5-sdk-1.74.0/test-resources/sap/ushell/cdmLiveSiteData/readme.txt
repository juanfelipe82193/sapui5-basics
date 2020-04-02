This folder holds sites that represent personalized liveSites.

Parent file for all these files would be the CommonDataModelAdapterDataTest.json file
in the same folder. This servers as the original site for all cases

Naming pattern:
* sites start with CMDLiveSite{$} where {$} stands for the personalization action that was performed
* each site has a respective personalization file called CDMPersonaliation{$}
* Both files can be used to:
** Verify that the personalization extracted is correct --> result should be the respective personalization json file
** Verify that mixin the personalization into the parent site --> result should be the respective CDMLiveSite.

Sample Description:

* GroupAdded:
	Added a group with the ID "TWO"
* GroupOrderChanged:
	Put group named with ID "ONE" second in the array
* TileAdded:
	Added a new Tile with ID #My-tileAdded" into group with ID "ONE"
* GroupRemove:
	Remove the group with ID "ONE"
* GroupRenamed
	Rename Group with ID "ONE" to new name: "Group name changed"
* TileMoveWithinGroup
	Move Tile with ID "idCustomTile" in Group with ID "ONE" from first to second position
* TileMoveAcrossGroups
	Move Tile with ID "idCustomTile" from Group with ID "ONE" to Group with ID "SAP_UI2_TEST" and place it into position 2 in there
* TileRemove
	Remove Tile with ID "idCustomTile" from Group with ID "ONE"
* LinkAdded
	Added Tile with ID "linkAdded" to Group with ID "ONE"
* LinkMoveWithinGroup
	Moved Link with ID "00O2TR8035SI47IF8RZST4OS8" within Group with ID "ONE" from position one to two
* LinkMoveAcrossGroups
	Move Link with ID "00O2TR8035SI47IF8RZST4OS8" from Group with ID "ONE" to Group with ID "SAP_UI2_TEST"
