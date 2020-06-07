mousex = 0;
mousey = 0;
keyState = {};
keyDown = {};
touchX = null;
touchY = null;

function initializeInput(c) {
	window.addEventListener('keydown', function (e) {
		keyState[e.keyCode] = true;
		keyDown[e.keyCode] = true;
		//console.log(e.keyCode);
	}, true);

	window.addEventListener('keyup', function (e) {
		keyState[e.keyCode] = false;
	}, true);

	window.addEventListener('touchstart', function (e) {
		var x = e.changedTouches[0].screenX;
		var y = e.changedTouches[0].screenY;
		touchX = x;
		touchY = y;
	}, true);

	window.addEventListener('gesturechange', function(e) {
		if (e.scale < 1.0) {
			// User moved fingers closer together
			globalscale = globalscale / 1.05;
		} else if (e.scale > 1.0) {
			// User moved fingers further apart
			globalscale = globalscale * 1.05;
		}
	}, false);

	window.addEventListener("orientationchange", function() {
		setTimeout(updateCanvasSize, 50);
	  }, false);

	window.addEventListener('touchmove', function (e) {
		var x = e.changedTouches[0].screenX;
		var y = e.changedTouches[0].screenY;
		globalxoff -= touchX - x;
		globalyoff -= touchY - y;
		touchY = y;
		touchX = x;
	}, true);

	window.addEventListener('wheel', function (e) {
		if (e.deltaY > 0) {
			globalscale = globalscale / 1.1;
		} else {
			globalscale = globalscale * 1.1;
		}
		console.log(e);
	}, true);

	window.addEventListener('mousemove', function (e) {
		rect = c.getBoundingClientRect();
		mousex = e.clientX - rect.left;
		mousey = e.clientY - rect.top;
	}, true);

	window.addEventListener('mousedown', function (e) {
		if (e.button == 0) {
			keyState['leftMouse'] = true;
			keyDown['leftMouse'] = true;
		}
		if (e.button == 2) {
			keyState['rightMouse'] = true;
			keyDown['rightMouse'] = true;
		}
	}, true);

	window.addEventListener('mouseup', function (e) {
		keyState['leftMouse'] = false;
		keyState['rightMouse'] = false;
	}, true);

	window.addEventListener('contextmenu', function (e) {
		e.preventDefault();
		return false;
	}, false);
}

function keyIsDown(k) {
	if (document.hasFocus()) {
		return keyState[k];
	} else {
		keyState = {};
		return false;
	}
}

function keypressed(k) {
	var ret = keyDown[k];
	keyDown[k] = false;
	return ret;
}

