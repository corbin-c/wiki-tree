import Unit from "./unit.js";

const Edge = class extends Unit {
  constructor(entity,properties) {
    super(entity, properties);
    this.distance = -1;
    this.inputNode = null;
    this.outputNode = null;
    this.duplex = false;
  }
  _linkTo(node, direction) {
    
  }
  link() {
    
  }
  getOppositeNode(node) {
    
  }
  unlink() {
    
  }
};

export default Edge;
