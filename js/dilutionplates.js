var camera, scene, renderer, material, plate, exportScene, exportPlate;
var blockcount =0;
Dropzone.autoDiscover = false;

$(document).ready(function() {
    if(isAPIAvailable()) {
        $('#files').bind('change', handleFileSelect);
    }
    init();
    initText();
    animate();

    var myDropzone = new Dropzone("#dropzone", {
      acceptedFiles: '.csv',
      dictDefaultMessage: "Import CSV File"
      });
    myDropzone.on("addedfile", function(file) {
      /* Maybe display some more file information on your page */
      $(".dz-success-mark").hide();
      loadWells(file);
    });
});

function loadCalibration() {
    $("#loading").show();
    $.get("calibration.csv", function(data) {
        var matrix = $.csv.toArrays( data );
        y = 0;
        blockcount = 0;
        for(var row in matrix) {
            x = 0;
            for(var item in matrix[row]) {
                file_name = 'blocks/block_' + matrix[row][item] + '.stl';
                addBlock( file_name, x, y );
                x++;
            }
            y++;
        }
    });
    $("#loading").hide();
}

function isAPIAvailable() {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
        return true;
    } else {
        // source: File API availability - http://caniuse.com/#feat=fileapi
        // source: <output> availability - http://html5doctor.com/the-output-element/
        document.writeln('The HTML5 APIs used in this form are only available in the following browsers:<br />');
        // 6.0 File API & 13.0 <output>
        document.writeln(' - Google Chrome: 13.0 or later<br />');
        // 3.6 File API & 6.0 <output>
        document.writeln(' - Mozilla Firefox: 6.0 or later<br />');
        // 10.0 File API & 10.0 <output>
        document.writeln(' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
        // ? File API & 5.1 <output>
        document.writeln(' - Safari: Not supported<br />');
        // ? File API & 9.2 <output>
        document.writeln(' - Opera: Not supported');
        return false;
    }
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];
    loadWells(file);
}

function loadWells(file) {
    $("#loading").show();
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
        var csv = event.target.result;
        var data = $.csv.toArrays(csv);
        var html = '';
        y = 0;
        for(var row in data) {
            x = 0;
            for(var item in data[row]) {
                file_name = 'blocks/block_' + (10*parseFloat(data[row][item])).toFixed(1) + '.stl';
                addBlock( file_name, x, y );
                x++;
            }
            y++;
        }
    };
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
    if(blockcount==96){
        $("#loading").hide();
        showText();
    }

}

function init() {
    scene = new THREE.Scene();
    plate = new THREE.Object3D();
    scene.add( new THREE.AmbientLight( 0x999999 ) );
    camera = new THREE.PerspectiveCamera( 35, 8 / 6, 1, 500 );
    // Z is up for objects intended to be 3D printed.
    //camera.up.set( 0, 0, 1 );
    camera.position.set( 0, 150, 300 );
    camera.add( new THREE.PointLight( 0xffffff, 0.8 ) );
    scene.add( camera );
    var grid = new THREE.GridHelper( 100, 10.0 );
    grid.setColors( 0xffffff, 0x555555 );
    //grid.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), 90 * ( Math.PI/180 ) );
    scene.add( grid );

    material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );

    plate.position.x = -54;
    plate.rotation.x = -Math.PI/2;
    scene.add(plate);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0x999999 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( 800, 600 );
    $('#viewport').append( renderer.domElement );
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render );
    controls.target.set( 0, 1.2, 2 );
    controls.update();
    window.addEventListener( 'resize', onWindowResize, false );
    render();
}

function addBlock( file_name, x, y ) {
    // ASCII file
    var loader = new THREE.STLLoader();
    loader.load( file_name, function ( geometry ) {
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set( 9 * x, 0, 9 * y );
        mesh.rotation.set( 0, 0, 0 );
        mesh.scale.set( 1, 1, 1 );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        plate.add(mesh);
        //scene.add( mesh );
    } );
}

function onWindowResize() {
    camera.aspect = 8 / 6;
    camera.updateProjectionMatrix();
    renderer.setSize( 800, 600 );
    render();
}

function render() {
    renderer.render( scene, camera );
}
function animate() {
  requestAnimationFrame( animate );
  render();
}

function saveModel() {
    exportPlate = plate.clone();
    exportPlate.rotation.x=0;
    saveSTL( scene, "dilution_plate" );
}
