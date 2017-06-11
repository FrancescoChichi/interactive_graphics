THREE.animatedLight = function (planeWidth, planeHeight, color, nPunti) {

	
	var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
	this.light = new THREE.PointLight( color, 5, 5 );
	this.light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: color } ) ) );
	

	this.position = 0;
	this.spline = 0;
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
		var y = Math.random()*4+0.5;
		var z = Math.random()*(planeWidth/2);
		z*= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
		punti.push(new THREE.Vector3(x,y,z));
	}

	this.curve = new  THREE.CatmullRomCurve3(punti);
	this.curve.closed = true;
	this.curve.type = 'catmullrom'

    var pos = this.curve.getPoint(0);
	this.light.position.copy(pos);
	gameScene.add( this.light );


this.render = function()
{
	if (this.position <=1)
	{
		var pos = this.curve.getPoint(this.position);
		this.light.position.copy(pos);
		this.position+=0.001;
	}
	else
	{
		this.position = 0;
		var pos = this.curve.getPoint(this.position);
		this.light.position.copy(pos);
	}

}
};