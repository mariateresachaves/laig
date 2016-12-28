function Theme(scene, dsx_name) {
  CGFobject.call(this, scene);

  var filename = getUrlVars()['file'] || dsx_name;

  scene.graph = new MySceneGraph(filename, scene);
}

Theme.prototype = Object.create(CGFobject.prototype);
Theme.prototype.constructor = Theme;
