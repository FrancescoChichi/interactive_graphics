function addMTL(fileOBJ,fileMTL,obj,positions,rotations,scales){
    if(!positions) positions = [0,0,0];
    if(!rotations) rotations = [0,0,0];
    if(!scales) scales = [1,1,1];

    var loader = new THREE.OBJMTLLoader();
    loader.load('models/obj/'+fileOBJ, 'models/mtl/'+fileMTL,  function(mesh) {

        // configure the wings
        
        var wing1 = mesh.children[0];
        //var wing1 = mesh.children[4].children[0];
        //console.log(mesh);

        wing1.material =  new THREE.MeshBasicMaterial({ color: "#2b2e31" });
        //wing1.material.
        /*
        wing2.material.opacity = 0.6;
        wing2.material.depthTest = false;
        wing2.material.transparent = true;
        wing2.material.side = THREE.DoubleSide;*/

        mesh.scale.set(scales[0], scales[1], scales[2]);
        mesh.rotation.set(rotations[0],rotations[1],rotations[2]);
        mesh.position.set(positions[0],positions[1],positions[2]);
        obj.add(mesh);
    });
}
function addOBJ(file,obj,positions,rotations,scales,mat){
    if(!positions) positions = [0,0,0];
    if(!rotations) rotations = [0,0,0];
    if(!scales) scales = [1,1,1];
    if(!mat) mat = new THREE.MeshBasicMaterial({ color: "#2b2e31" });

    var loader = new THREE.OBJLoader();
    loader.load('models/obj/'+file, function(mesh) {

      mesh.traverse( function ( child ) {

        if ( child instanceof THREE.Mesh ) {

            child.material = mat;

        }

      });

      mesh.scale.set(scales[0], scales[1], scales[2]);
      mesh.rotation.set(rotations[0],rotations[1],rotations[2]);
      mesh.position.set(positions[0],positions[1],positions[2]);
      obj.add(mesh);
    });
}
function addJS(file,obj,positions,rotations,scales,mater){
    if(!positions) positions = [0,0,0];
    if(!rotations) rotations = [0,0,0];
    if(!scales) scales = [1,1,1];
    if(!mater) mater = new THREE.MeshBasicMaterial({ color: "#2b2e31" });

    var mesh;
                        
    var loader = new THREE.JSONLoader();
    loader.load("models/js/"+file, function (geometry, mat) {
        //var mat = new THREE.MeshPhongMaterial( {color: "rgb(90,90,100)"} );
        mesh = new THREE.Mesh(geometry, mater);
        mesh.scale.set(scales[0], scales[1], scales[2]);
        mesh.rotation.set(rotations[0],rotations[1],rotations[2]);
        mesh.position.set(positions[0],positions[1],positions[2]);
        obj.add(mesh);
    }, "js");
}