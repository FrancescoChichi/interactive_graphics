this.textureMetal = "textures/metal-texture256.jpg";




function Geometry(params){

		this.cylinder = new THREE.CylinderBufferGeometry( params[0], params[1], params[2], params[3]);
}

function Material(shininess,color,specular, reflectivity){
	this.metalTexture = new THREE.TextureLoader().load( "textures/metal-texture512.jpg" );
		this.metalTexture.repeat.set( 1, 1 );
		this.metalTexture.wrapS = this.metalTexture.wrapT = THREE.RepeatWrapping;
		this.metalTexture.magFilter = THREE.NearestFilter;
		this.metalTexture.format = THREE.RGBFormat;

	this.haloTexture = new THREE.TextureLoader().load( "textures/halo/halo.jpg" );
		this.haloTexture.repeat.set( 4, 1 );
		this.haloTexture.wrapS = this.haloTexture.wrapT = THREE.RepeatWrapping;
		this.haloTexture.magFilter = THREE.NearestFilter;
		this.haloTexture.format = THREE.RGBFormat;

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