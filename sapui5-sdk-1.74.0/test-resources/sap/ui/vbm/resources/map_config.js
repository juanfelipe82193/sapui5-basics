var GLOBAL_MAP_CONFIG = {
    "MapProvider": [{
        "name": "OSM",
        "type": "",
        "description": "",
        "tileX": "256",
        "tileY": "256",
        "maxLOD": "20",
        "copyright": "Tiles Courtesy of OpenMapTiles",
        "Source": [
            {
                "id": "s1",
                "url": "https://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
            },
            {
                "id": "s2",
                "url": "https://b.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
            },
 
            {
                "id": "s3",
                "url": "https://c.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
            }
        ]
    }],
    "MapLayerStacks": [{
        "name": "Default",
        "MapLayer": [{
            "name": "OSM",
            "refMapProvider": "OSM"
        }]
    }]
};