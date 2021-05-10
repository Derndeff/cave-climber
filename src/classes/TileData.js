import { TextureLoader, SpriteMaterial, RepeatWrapping, NearestFilter } from 'three';



// Singleton class where information on a tile type can be found
class TileData {

  constructor() {
    // Tile material data

    // Map functions as a dictionary... materials are stored as key value pairs,
    // where "key" is an integer specifying the tile type
    this.materials = new Map();

    const tileMapSource = "./src/images/cave_tileset.png";
    const oldSource = "./src/images/tile_map.png";
    this.createMaterialFromTilemap(0, tileMapSource, 8, 8, 3, 0); // tile type 0, air
    this.createMaterialFromTilemap(1, tileMapSource, 8, 8, 1, 1); // tile type 1, wall middle
    this.createMaterialFromTilemap(2, tileMapSource, 8, 8, 0, 1); // tile type 2, wall left
    this.createMaterialFromTilemap(3, tileMapSource, 8, 8, 2, 1); // tile type 3, wall right
    this.createMaterialFromTilemap(4, tileMapSource, 8, 8, 0, 3); // tile type 4, vertical spike
    this.createMaterialFromTilemap(5, oldSource, 128, 128, 44, 8); // tile type 5, chest
    this.createMaterialFromTilemap(6, oldSource, 128, 128, 44, 9); // tile type 6, open chest
    this.createMaterialFromTilemap(7, tileMapSource, 8, 8, 1, 0); // tile type 7, wall top
    this.createMaterialFromTilemap(8, tileMapSource, 8, 8, 1, 2); // tile type 8, wall bottom
    this.createMaterialFromTilemap(9, tileMapSource, 8, 8, 0, 0); // tile type 9, wall top left
    this.createMaterialFromTilemap(10, tileMapSource, 8, 8, 2, 0); // tile type 10, wall top right
    this.createMaterialFromTilemap(11, tileMapSource, 8, 8, 0, 2); // tile type 11, wall bottom left
    this.createMaterialFromTilemap(12, tileMapSource, 8, 8, 2, 2); // tile type 12, wall bottom right
    this.createMaterialFromTilemap(13, tileMapSource, 8, 8, 1, 3); // tile type 13, right spike
    this.createMaterialFromTilemap(14, tileMapSource, 8, 8, 2, 3); // tile type 14, down spike
    this.createMaterialFromTilemap(15, tileMapSource, 8, 8, 3, 3); // tile type 15, left spike

    // collision type 0: no collision
    // collision type 1: full collision
    // collision type 2: platform collision
    this.collisionTypes = new Map();
    this.spikeTypes = new Map();
    this.chestTypes = new Map();

    this.collisionTypes.set(-1, 1); // -1 specifies the "tile" type beyond map bounds
    this.collisionTypes.set(0, 0);
    this.collisionTypes.set(1, 1);
    this.collisionTypes.set(2, 1);
    this.collisionTypes.set(3, 1);
    this.collisionTypes.set(4, 0);
    this.collisionTypes.set(5, 0);
    this.collisionTypes.set(6, 0);
    this.collisionTypes.set(7, 1);
    this.collisionTypes.set(8, 1);
    this.collisionTypes.set(9, 1);
    this.collisionTypes.set(10, 1);
    this.collisionTypes.set(11, 1);
    this.collisionTypes.set(12, 1);
    this.collisionTypes.set(13, 0);
    this.collisionTypes.set(14, 0);
    this.collisionTypes.set(15, 0);



    this.spikeTypes.set(-1, 1); // -1 specifies the "tile" type beyond map bounds
    this.spikeTypes.set(0, 0);
    this.spikeTypes.set(1, 0);
    this.spikeTypes.set(2, 0);
    this.spikeTypes.set(3, 0);
    this.spikeTypes.set(4, 1);
    this.spikeTypes.set(5, 0);
    this.spikeTypes.set(6, 0);
    this.spikeTypes.set(7, 0);
    this.spikeTypes.set(8, 0);
    this.spikeTypes.set(9, 0);
    this.spikeTypes.set(10, 0);
    this.spikeTypes.set(11, 0);
    this.spikeTypes.set(12, 0);
    this.spikeTypes.set(13, 1);
    this.spikeTypes.set(14, 1);
    this.spikeTypes.set(15, 1);


    this.chestTypes.set(-1, 0); // -1 specifies the "tile" type beyond map bounds
    this.chestTypes.set(0, 0);
    this.chestTypes.set(1, 0);
    this.chestTypes.set(2, 0);
    this.chestTypes.set(3, 0);
    this.chestTypes.set(4, 0);
    this.chestTypes.set(5, 1);
    this.chestTypes.set(6, 0);
    this.chestTypes.set(7, 0);
    this.chestTypes.set(8, 0);
    this.chestTypes.set(9, 0);
    this.chestTypes.set(10, 0);
    this.chestTypes.set(11, 0);
    this.chestTypes.set(12, 0);
    this.chestTypes.set(13, 0);
    this.chestTypes.set(14, 0);
    this.chestTypes.set(15, 0);


  }

  // given a souce tilemap, generate a material of the offsetX, offsetY tile
  createMaterialFromTilemap(key, source, tilesHoriz, tilesVert, offsetX, offsetY) {

    // This sucks... we have to sample a square slightly smaller than the tile,
    // otherwise visible lines show up from rounding issues. Set eps to 0.0
    // to find out lol. An eps of 0.03 cuts out 3% of the tile's width and height
    const eps = 0.03;

    const texture = new TextureLoader().load(source);
    texture.magFilter = NearestFilter;
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(1/tilesHoriz - (eps/tilesHoriz), 1.0/tilesVert - (eps/tilesVert));

    texture.offset.x = offsetX/tilesHoriz + 0.5*eps/tilesHoriz;
    texture.offset.y = (tilesVert-1 - offsetY)/tilesVert  + 0.5*eps/tilesVert;

    const material = new SpriteMaterial({map: texture});

    // set the material map (it's like a dictionary)
    this.materials.set(key, material);
  }

  // access the material map, return the material for a tile type
  getMaterial(key) {
    return this.materials.get(key);
  }

  // return material type of a tile type
  getCollisionType(key) {
    return this.collisionTypes.get(key);
  }

  getSpikeType(key) {
    return this.spikeTypes.get(key);
  }

  getChestType(key) {
    return this.chestTypes.get(key);
  }
}

// Singleton pattern in modern JS, freeze prevents changes
const instance = new TileData();
Object.freeze(instance);

export default instance;
