mousex=0;
mousey=0;
keyState={};
keyDown={};

function initializeInput(c) {
	window.addEventListener('keydown',function(e){
			keyState[e.keyCode] = true;
			keyDown[e.keyCode] = true;
			console.log(e.keyCode);
	},true);    

	window.addEventListener('keyup',function(e){
			keyState[e.keyCode] = false;
	},true);

	window.addEventListener('mousemove', function(e) {
		rect = c.getBoundingClientRect();  	
		mousex = e.clientX - rect.left;
		mousey = e.clientY - rect.top;
	}, true);

	window.addEventListener('mousedown', function(e) {
		keyState['mouse'] = true;
	}, true);

	window.addEventListener('mouseup', function(e) {
		keyState['mouse'] = false;
	}, true);
}

function keypressed(k) {
	var ret = keyDown[k];
	keyDown[k] = false;
	return ret;
}

