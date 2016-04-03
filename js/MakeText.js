var fontName = "droid_sans";// helvetiker, optimer, gentilis, droid sans, droid serif
var fontWeight ="mono"; //regular bold
var group, textMesh1, textGeo;
var text = "Plate Name",
				height = 5,
				size = 18,
				textY = 73,
				textX = 30,
				textZ = -1,
				curveSegments = 8,
				bevelThickness = .5,
				bevelSize = 1,
				bevelSegments = 3,
				bevelEnabled = true,
				textScale = .3;
var boxgeometry, textBox = new THREE.BoxGeometry( 1, 1, 1 );

function showText(){
	scene.add( group );
	scene.add( textBox );
}

function initText() {
	group = new THREE.Group();
	group.position.y = 0;
	
	boxgeometry= new THREE.BoxGeometry( 108, 10, 15 );
	textBox = new THREE.Mesh( boxgeometry, material );
	textBox.position.y = textY+3;
	textBox.position.z=-7.5;
	//textBox.position.x=plate.position.x;

	loadFont();
}

function loadFont() {
	var loader = new THREE.FontLoader();
	loader.load( 'fonts/' + fontName + '_' + fontWeight + '.typeface.js', function ( response ) {
		font = response;
		refreshText();
	} );
}
function refreshText() {
	//updatePermalink();

	group.remove( textMesh1 );
	if ( !text ) return;
	createText();

}

function createText() {

	textGeo = new THREE.TextGeometry( text, {

		font: font,

		size: size,
		height: height,
		curveSegments: curveSegments,

		bevelThickness: bevelThickness,
		bevelSize: bevelSize,
		bevelEnabled: bevelEnabled,

		material: 0,
		extrudeMaterial: 1

	});

	textGeo.computeBoundingBox();
	textGeo.computeVertexNormals();

	// "fix" side normals by removing z-component of normals for side faces
	// (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

	if ( ! bevelEnabled ) {

		var triangleAreaHeuristics = 0.1 * ( height * size );

		for ( var i = 0; i < textGeo.faces.length; i ++ ) {

			var face = textGeo.faces[ i ];

			if ( face.materialIndex == 1 ) {

				for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

					face.vertexNormals[ j ].z = 0;
					face.vertexNormals[ j ].normalize();

				}

				var va = textGeo.vertices[ face.a ];
				var vb = textGeo.vertices[ face.b ];
				var vc = textGeo.vertices[ face.c ];

				var s = THREE.GeometryUtils.triangleArea( va, vb, vc );

				if ( s > triangleAreaHeuristics ) {

					for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

						face.vertexNormals[ j ].copy( face.normal );

					}

				}

			}

		}

	}

	var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

	textMesh1 = new THREE.Mesh( textGeo, material );
	textMesh1.scale.x=textScale;
	textMesh1.scale.y=textScale;
	textMesh1.scale.z=textScale;

	textMesh1.position.x = centerOffset+textX;
	textMesh1.position.y = textY;
	textMesh1.position.z = textZ;

	textMesh1.rotation.x = 0;
	textMesh1.rotation.y = Math.PI * 2;


	group.add( textMesh1 );


}
