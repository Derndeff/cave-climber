import { TextureLoader, SpriteMaterial, RepeatWrapping, NearestFilter } from 'three';



// Singleton class where information on a tile type can be found
class TileData {

  constructor() {
    // Tile material data

    // Map functions as a dictionary... materials are stored as key value pairs,
    // where "key" is an integer specifying the tile type
    this.materials = new Map();

    const tileMapSource = "./src/images/dumb_tiles.png";
    this.createMaterialFromTilemap(0, tileMapSource, 0, 0); // tile type 0
    this.createMaterialFromTilemap(1, tileMapSource, 0, 1); // tile type 1
    this.createMaterialFromTilemap(2, tileMapSource, 1, 0); // tile type 2
    this.createMaterialFromTilemap(3, tileMapSource, 1, 1); // tile type 3
  }

  // given a souce tilemap, generate a material of the offsetX, offsetY tile
  createMaterialFromTilemap(key, source, offsetX, offsetY) {

    const tilesHoriz = 8;
    const tilesVert = 8;

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
}

// Singleton pattern in modern JS, freeze prevents changes
const instance = new TileData();
Object.freeze(instance);

export default instance;
