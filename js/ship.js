this.getShip = function(){
	
	this.group = new THREE.Group();

	var points = [];
	for ( var i = 0; i < 10; i ++ ) {
		points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 0.5+0.5 , ( i - 5 ) * 0.1 ) );
	}
	var geometry = new THREE.LatheBufferGeometry( points );

	var materialPhong = new THREE.MeshPhongMaterial( { shininess: 50, color: 0xffffff, specular: 0x999999 } );
	var sphereGeometry = new THREE.SphereBufferGeometry( 4.5, 64, 32 );

	var semiSphereGeometryL = new THREE.SphereBufferGeometry( 4.5, 64, 32 );
	var semiSphereGeometryR = new THREE.SphereBufferGeometry( 4.5, 64, 32 );

	var torusGeometry = new THREE.TorusBufferGeometry( 6, 2, 32, 64 );
	var cubeGeometry = new THREE.BoxBufferGeometry( 2, 2, 4 );
	var cilinderGeometry = new THREE.CylinderBufferGeometry( 1, 1, 3, 64);

	group.add(addObject( torusGeometry, materialPhong, 0, 5, 0, Math.PI/2, 0, 0 ));
	group.add(addObject( cubeGeometry, materialPhong, 4, 9, 0, 0, 0, 0 ));
	group.add(addObject( sphereGeometry, materialPhong, 0, 7, 0, 0, 0, 0 ));
	group.add(addObject( cilinderGeometry, materialPhong, -2, 8, 5.5, Math.PI/2, 0, Math.PI/2));
	group.add(addObject( cilinderGeometry, materialPhong, -2, 8, -5.5, Math.PI/2, 0,Math.PI/2 ));
	group.add(addObject( geometry, materialPhong, -3.8, 8, 5.5, 0, Math.PI, Math.PI/2 ));
	group.add(addObject( geometry, materialPhong, -3.8, 8, -5.5, 0, Math.PI, Math.PI/2 ));

	return group;
}

function addObject( geometry, material, x, y, z, rx, ry, rz ) {
		var tmpMesh = new THREE.Mesh( geometry, material );
		tmpMesh.material.color.offsetHSL( 0.1, -0.1, 0 );
		tmpMesh.position.set( x, y, z );
		tmpMesh.rotation.y = ry;
		tmpMesh.rotation.x = rx;
		tmpMesh.rotation.z = rz;

		tmpMesh.castShadow = true;
		tmpMesh.receiveShadow = true;
		//scene.add( tmpMesh );
		return tmpMesh;
	};