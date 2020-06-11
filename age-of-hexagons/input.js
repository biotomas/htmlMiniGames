mousex = 0;
mousey = 0;
keyState = {};
keyDown = {};
touchX = null;
touchY = null;
touchX2 = null;
touchY2 = null;

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
		touchX = e.changedTouches[0].screenX;
		touchY = e.changedTouches[0].screenY;
		if (e.changedTouches.length > 1) {
			touchX2 = e.changedTouches[1].screenX;
			touchY2 = e.changedTouches[1].screenY;
		}
	}, true);

	window.addEventListener("orientationchange", function () {
		setTimeout(updateCanvasSize, 1000);
	}, false);

	window.addEventListener('touchmove', function (e) {
		var x = e.changedTouches[0].screenX;
		var y = e.changedTouches[0].screenY;
		if (e.changedTouches.length > 1) {
			var x2 = e.changedTouches[1].screenX;
			var y2 = e.changedTouches[1].screenY;
			//zooming
			if (touchX2 != null) {
				var dist = Math.abs(x - x2) + Math.abs(y - y2);
				var prevDist = Math.abs(touchX - touchX2) + Math.abs(touchY - touchY2);
				console.log(dist - prevDist);
				//globalscale += (dist - prevDist) * 0.01;
				if (dist - prevDist < 0) {
					globalscale = globalscale - 0.05;
				} else {
					globalscale = globalscale + 0.05;
				}
			}
			touchY2 = y2;
			touchX2 = x2;
		} else {
			// scrolling
			globalxoff -= touchX - x;
			globalyoff -= touchY - y;
			touchY2 = null;
			touchX2 = null;
		}
		touchY = y;
		touchX = x;
	}, true);

	window.addEventListener('wheel', function (e) {
		var oldCenterx = c.width / 2 / globalscale - globalxoff;
		var oldCentery = c.height / 2 / globalscale - globalyoff;
		var oldScale = globalscale;
		if (e.deltaY > 0) {
			globalscale = globalscale / 1.1;
		} else {
			globalscale = globalscale * 1.1;
		}
		if (globalscale < 0.5) {
			globalscale = 0.5;
		}
		var diff = globalscale / oldScale;
		globalxoff /= diff;
		globalyoff /= diff;
		var newCenterx = c.width / 2 / globalscale - globalxoff;
		var newCentery = c.height / 2 / globalscale - globalyoff;
		globalxoff += newCenterx - oldCenterx;
		globalyoff += newCentery - oldCentery;
	}, true);

	window.addEventListener('mousemove', function (e) {
		rect = c.getBoundingClientRect();
		mousex = e.clientX - rect.left;
		mousey = e.clientY - rect.top;
	}, true);
	
	window.addEventListener('mousedown', function (e) {
		music.play();
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

