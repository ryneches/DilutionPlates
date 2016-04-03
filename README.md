# Dilution plate builder

You have a couple of thousand of raw samples that need to be diluted
to a standard concentration. You don't have a liquid handling robot,
but you do have a plate reader, a 3D printer and a multichannel
pipetter.  Measure your sample concentrations on the plate reader, and
put them in a CSV file. Load the CSV file into the web app, and enter
the desired concentration. The app will generate a 3D printable plate
with custom volumes. Print the model (it will print as a single
surface shell, suitable for spiralized printing), and fill all of the
wells with buffer. Remove 100 microliters frm each well with the
multichannel pipetter, and then transfer the specified volume of your
raw samples into the corresponding wells on the dilution plate. The
samples will then be at the desired concentration.

Dilution ratios among the samples must be within about a factor of 100
of one another. 

### Dependencies

* [`jQuery`](https://jquery.com/)
* [`jquery-csv`](https://github.com/evanplaice/jquery-csv)
* [`RequestAnimationFrame.js`](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)
* [`three.js`](http://threejs.org/)
* [`STLLoader.js`](http://threejs.org/examples/webgl_loader_stl.html)
* [`STLExporter.js`](https://gist.github.com/kjlubick/fb6ba9c51df63ba0951f)
* [`FileSaver.js`](https://github.com/eligrey/FileSaver.js/)
