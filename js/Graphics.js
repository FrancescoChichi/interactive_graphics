



function Geometry(params){

		this.cylinder = new THREE.CylinderBufferGeometry( params[0], params[1], params[2], params[3]);
}

function Material(shininess,color, rx, ry){

	var textureMetal = "textures/metal-texture256.jpg";
	
	var metalTexture = new THREE.TextureLoader().load( "textures/metal-texture512.jpg" );
		metalTexture.repeat.set( rx, ry );
		metalTexture.wrapS = metalTexture.wrapT = THREE.RepeatWrapping;
		metalTexture.magFilter = THREE.NearestFilter;
		metalTexture.format = THREE.RGBFormat;

	var haloTexture = new THREE.TextureLoader().load( "textures/halo/halo.jpg" );
		haloTexture.repeat.set( rx, ry );
		haloTexture.wrapS = haloTexture.wrapT = THREE.RepeatWrapping;
		haloTexture.magFilter = THREE.NearestFilter;
		haloTexture.format = THREE.RGBFormat;

	var torusTexture = new THREE.TextureLoader().load( "textures/halo/halo.jpg" );
		torusTexture.repeat.set( rx, ry );
		torusTexture.wrapS = torusTexture.wrapT = THREE.RepeatWrapping;
		torusTexture.magFilter = THREE.NearestFilter;
		torusTexture.format = THREE.RGBFormat;

	var tronTexture = new THREE.TextureLoader().load( "textures/Tron_Background256.jpg" );
	tronTexture.repeat.set( rx, ry );
	tronTexture.wrapS = tronTexture.wrapT = THREE.RepeatWrapping;
	tronTexture.magFilter = THREE.NearestFilter;
	tronTexture.format = THREE.RGBFormat;

	var shipTexture = new THREE.TextureLoader().load( "textures/metal-texture256.jpg" );
		shipTexture.repeat.set( 1, 1 );
		shipTexture.wrapS = shipTexture.wrapT = THREE.RepeatWrapping;
		shipTexture.format = THREE.RGBFormat;

	this.particleTexture = new THREE.TextureLoader().load( "textures/oUBYu.png" );


	this.halo = new THREE.MeshPhongMaterial( {
		shininess: shininess,
		color: color,
		map: haloTexture
	} );

	this.torus = new THREE.MeshPhongMaterial( {
		shininess: shininess,
		color: color,
		map: torusTexture
	} );

	this.metal = new THREE.MeshPhongMaterial( {
		shininess: shininess,
		color: color,
		map: metalTexture
	} );
	this.metalDoubleSide = new THREE.MeshPhongMaterial( {
		shininess: shininess,
		color: color,
		side: THREE.DoubleSide,
		map: metalTexture
	} );

	this.glass = new THREE.MeshToonMaterial( {
		color: color,
			} );

	// GROUND
	this.ground = new THREE.MeshPhongMaterial( {
		shininess: shininess,
		color: color,
		map: tronTexture,
				transparent: true,
		opacity:0.8,
	} );

	this.basicTransparent = new THREE.MeshBasicMaterial( {
		color: color, 
		transparent: true,
	});

	this.particle = new THREE.SpriteMaterial({
      color: color, //0xff4502
      map: this.particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending
  });

  this.ship = new THREE.MeshPhongMaterial( {
		shininess: shininess,
		color: color,
		map: shipTexture
	});

  this.basic = new THREE.MeshBasicMaterial( {
		color: color, 
		transparent: true
	});

}

	function addObject( geometry, material, x, y, z, rx, ry, rz ) {
		var tmpMesh = new THREE.Mesh( geometry, material );

		tmpMesh.position.set( x, y, z );
		tmpMesh.rotation.y = ry;
		tmpMesh.rotation.x = rx;
		tmpMesh.rotation.z = rz;

		tmpMesh.castShadow = true;
		tmpMesh.receiveShadow = true;

		return tmpMesh;
	};