this.textureMetal = "textures/metal-texture256.jpg";




function Geometry(params){

		this.cylinder = new THREE.CylinderBufferGeometry( params[0], params[1], params[2], params[3]);
}

function Material(shininess,color,specular, rx, ry){
	this.metalTexture = new THREE.TextureLoader().load( "textures/metal-texture512.jpg" );
		this.metalTexture.repeat.set( rx, ry );
		this.metalTexture.wrapS = this.metalTexture.wrapT = THREE.RepeatWrapping;
		this.metalTexture.magFilter = THREE.NearestFilter;
		this.metalTexture.format = THREE.RGBFormat;

	this.haloTexture = new THREE.TextureLoader().load( "textures/halo/halo.jpg" );
		this.haloTexture.repeat.set( rx, ry );
		this.haloTexture.wrapS = this.haloTexture.wrapT = THREE.RepeatWrapping;
		this.haloTexture.magFilter = THREE.NearestFilter;
		this.haloTexture.format = THREE.RGBFormat;

	this.tronTexture = new THREE.TextureLoader().load( "textures/Tron_Background256.jpg" );
	//var texture = new THREE.TextureLoader().load( "textures/patterns/bright_squares256.png" );
	this.tronTexture.repeat.set( rx, ry );
	this.tronTexture.wrapS = this.tronTexture.wrapT = THREE.RepeatWrapping;
	this.tronTexture.magFilter = THREE.NearestFilter;
	this.tronTexture.format = THREE.RGBFormat;

	this.particleTexture = new THREE.TextureLoader().load( "textures/oUBYu.png" );


	this.halo = new THREE.MeshPhongMaterial( {
		shininess: shininess,
		color: color,
		specular: specular,
		map: this.haloTexture
	} );

	this.metal = new THREE.MeshPhongMaterial( {
		shininess: shininess,
		color: color,
		specular: specular,
		map: this.metalTexture
	} );
	this.metalDoubleSide = new THREE.MeshPhongMaterial( {
		shininess: shininess,
		color: color,
		specular: specular,
		side: THREE.DoubleSide,
		map: this.metalTexture
	} );

	this.glass = new THREE.MeshToonMaterial( {
		color: color,
		specular: color
			} );

	// GROUND
	this.ground = new THREE.MeshPhongMaterial( {
		shininess: shininess,
		color: color,
		map: this.tronTexture
	} );

	this.basicTransparent = new THREE.MeshBasicMaterial( {
		color: color, 
		transparent: true,
	} 
	);

	this.particle = new THREE.SpriteMaterial({
      color: color, //0xff4502
      map: this.particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending
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