window.addEventListener("load", init);

function init() {
    // シーン
    var scene = new THREE.Scene();
    
    // カメラ
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.set(0, 20, 20);
    camera.lookAt(new THREE.Vector3(0, 5, 0));
    
    // レンダラー
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    
    // 地面
      var pgeometry = new THREE.PlaneGeometry(50, 50);
      var pmaterial = new THREE.MeshPhongMaterial({
        color: 'lightgreen',
        side: THREE.DoubleSide
      });
      var plane = new THREE.Mesh(pgeometry, pmaterial);
      plane.receiveShadow = true;
      plane.position.set(0, -2, 0);
      plane.rotation.x = 90 * Math.PI / 180;
      scene.add(plane);
    
    
    // 点光源
    var pointLight = new THREE.PointLight (0xff4502, 1.0, 20);
   // scene.add(pointLight);
    
    // パーティクルの数
    var particleCount = 80;
    // パーティクルの格納場所
    var particles = [];
    
    // テクスチャの設定
    var texture = THREE.ImageUtils.loadTexture("textures/oUBYu.png");
    // マテリアルの設定
    var material = new THREE.SpriteMaterial({
        color: 0xff4502,
        map: texture,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    
    
    // パーティクルの位置の設定
    for (var i = 0; i < particleCount; i++) {
        var particle = new THREE.Sprite(material.clone());
        particle.scale.multiplyScalar(Math.random() * 4);
        // パーティクルのべロシティの設定
        particle.velocity = new THREE.Vector3( 0, Math.random(), 0 );
        particles.push(particle);
        scene.add(particle);
    }
    
    
    tick();
    function tick() {
        requestAnimationFrame(tick);
        
        // パーティクルの位置の設定
        for (var i = 0; i < particles.length; i++) {
            var particle = particles[i];
            if(particle.position.y > 10) {
                particle.position.y = 0;
                particle.velocity.y = Math.random() + 1;
                particle.material.opacity = 1;
            }
            particle.material.opacity -= 0.1;
            particle.velocity.y += 0.001;
            particle.position.add(particle.velocity);
        }
        
        renderer.render(scene, camera);
    }
}
