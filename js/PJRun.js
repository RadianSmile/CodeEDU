// JavaScript Document
  


var canvas = document.getElementById('sketch'),
code = document.getElementById('code'),
output = document.getElementById('output'),
instance = null;

 
function createCanvas() {
  // Make a new canvas, in case we're switching from 2D to 3D contexts.
  var container = document.getElementById('sketch-container');
  var sketch = document.getElementById('sketch');
  container.removeChild(sketch);

  sketch = document.createElement('canvas');
  sketch.id = 'sketch';
  container.appendChild(sketch);

  return sketch;
}

function runSketch (callback) {
	try {
    //output.value = '';
    canvas = createCanvas();
		
		var v = editor.getValue() ;
    var sketch = Processing.compile(v);
		
    if (callback) {
      if (!/exit\(\);/.test(code.value)) {
        throw "exit() not found in sketch. Add the exit() command, and re-run the sketch.";
      }
      sketch.onExit = callback;
      instance = new Processing(canvas, sketch);
    } else {
      instance = new Processing(canvas, sketch);
    }
		$(window).trigger('resize');
  } catch (e) {
    //output.value = "Error! Error was:\n" + e.toString();
		alert(e.toString());
  }
};
  
  