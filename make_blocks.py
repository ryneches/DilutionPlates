#!/usr/bin/env python
from numpy import linspace
import subprocess
import sys
"""
Generate n STLs for wells over a 1 cm depth.

Usage :

    $ ./make_blocks.py n

To make wells in 0.1mm increments :

    $ ./make_blocks.py 101

Requires openscad to be available from the command line.
"""

base_dir = 'blocks'

s = open( 'block_template.scad' ).read()

for d in linspace( 0, 10, int( sys.argv[1]) ) :
    base_name = 'block_' + str(d)
    scad_name = base_dir + '/' + base_name + '.scad'
    stl_name  = base_dir + '/' + base_name + '.stl'
    with open( scad_name, 'w' ) as f :
        f.write( 'd = ' + str(d) + ';\n' )
        f.write( s )
    print 'making ' + stl_name
    args = ['openscad', '-o', stl_name, scad_name ]
    subprocess.call( args )
