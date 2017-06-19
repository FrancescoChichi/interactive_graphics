THREE.animatedLight = function (planeWidth, planeHeight, color, nPunti) {

	
	var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
	var light = new THREE.PointLight( color, 5, 5 );
	light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: color } ) ) );
	

	var position = 0;
	var spline = 0;
	if (nPunti<4)
	{
		nPunti = 4;
	}

	var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
	var punti = [];
	for (var i = nPunti - 1; i >= 0; i--) 
	{
		var x = Math.random()*(planeHeight/2);
		x *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
		var y = Math.random()*8+0.5;
		var z = Math.random()*(planeWidth/2);
		z*= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
		punti.push(new THREE.Vector3(x,y,z));
	}

	curve = new  THREE.CatmullRomCurve3(punti);
	curve.closed = true;
	curve.type = 'catmullrom'

    var pos = curve.getPoint(0);
	light.position.copy(pos);
	gameScene.add( light );


this.render = function()
{
	if (position <=1)
	{
		var pos = curve.getPoint(position);
		light.position.copy(pos);
		position+=0.0001;
	}
	else
	{
		position = 0;
		var pos = curve.getPoint(position);
		light.position.copy(pos);
	}

}
};