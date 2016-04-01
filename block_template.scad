//d ranges from 0 to 10;
$fn     = 20;
fiddle  = 0.01;
spacing = 9.0;

difference() {
    // block
    cube([ spacing+fiddle*2, 15, spacing+fiddle*2 ]);
    // well
    translate( [0,-7,0] ){
        translate( [ spacing/2, 0, spacing/2] ) {
            hull() {
                sphere( 4.8 );
                translate( [ 0, 8+d, 0] ) sphere( 2 );
            }
        }
    }
}