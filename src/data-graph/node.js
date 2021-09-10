import Unit from "./unit.js";

const Node = class extends Unit {
  constructor(entity, properties) {
    super(entity, properties);
    this.loaded = 0; //0 means not loaded, 1 is loaded, -1 is loading
  }
  unlink() {
    
  }
};

export default Node;
