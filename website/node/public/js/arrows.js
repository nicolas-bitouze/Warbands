function intersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
	var denominator, a, b, numerator1, numerator2;
	denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
	if (denominator == 0) {
		return false;
	}
	a = line1StartY - line2StartY;
	b = line1StartX - line2StartX;
	numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
	numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
	a = numerator1 / denominator;
	b = numerator2 / denominator;

	if (a >= 0 && a <= 1 && b >= 0 && b <= 1) {
		return {
			x : line1StartX + (a * (line1EndX - line1StartX)),
			y : line1StartY + (a * (line1EndY - line1StartY))
		};
	} else {
		return false;
	}
};

function sides(rect) {
	return {
		left   : {x1:rect.left , y1:rect.top   , x2:rect.left , y2:rect.bottom},
		bottom : {x1:rect.left , y1:rect.bottom, x2:rect.right, y2:rect.bottom},
		right  : {x1:rect.right, y1:rect.bottom, x2:rect.right, y2:rect.top   },
		top    : {x1:rect.right, y1:rect.top   , x2:rect.left , y2:rect.top   }
	};
}

function drawRect(ctx,rect) {
	ctx.beginPath();
	ctx.moveTo(rect.left ,rect.top   );
	ctx.lineTo(rect.left ,rect.bottom);
	ctx.lineTo(rect.right,rect.bottom);
	ctx.lineTo(rect.right,rect.top   );
	ctx.lineTo(rect.left ,rect.top   );
	ctx.stroke();
}

function scaledRotated(vectX,vectY,theta,length) {
	var x = vectX * Math.cos(theta) - vectY*Math.sin(theta);
	var y = vectX * Math.sin(theta) + vectY*Math.cos(theta);
	var currentLength = Math.sqrt(x*x+y*y);
	return {
		x : x * length / currentLength,
		y : y * length / currentLength
	};
}

function getRelativeBoundingRect(element) {
	var canvas = document.getElementById("canvas");
	var contentboxdiv = document.getElementById("contentbox");
	var ctxoffsetLeft = canvas.offsetLeft - contentboxdiv.offsetLeft;
	var ctxoffsetTop  = canvas.offsetTop  - contentboxdiv.offsetTop;
	return {
		left   : element.offsetLeft - ctxoffsetLeft,
		top    : element.offsetTop  - ctxoffsetTop,
		right  : element.offsetLeft + element.offsetWidth  - ctxoffsetLeft,
		bottom : element.offsetTop  + element.offsetHeight - ctxoffsetTop
	}
}

function drawArrow(ctx,fromElem,toElem) {
	var fromRect = getRelativeBoundingRect(fromElem); //.getBoundingClientRect();
	var toRect   = getRelativeBoundingRect(toElem);   //.getBoundingClientRect();
	var fromCenterX = (fromRect.left   + fromRect.right) / 2;
	var fromCenterY = (fromRect.bottom + fromRect.top  ) / 2;
	var toCenterX   = (toRect.left     + toRect.right  ) / 2;
	var toCenterY   = (toRect.bottom   + toRect.top    ) / 2;

	//drawRect(ctx,fromRect);
	//drawRect(ctx,toRect);
	
	var fromSides = sides(fromRect);
	var toSides   = sides(toRect);
	var fromInter, toInter;
	for(var i in fromSides) {
		fromInter = intersection(
			fromCenterX, fromCenterY, toCenterX, toCenterY,
			fromSides[i].x1, fromSides[i].y1, fromSides[i].x2, fromSides[i].y2
		);
		if(fromInter) break;
	}
	for(var i in toSides) {
		toInter = intersection(
			fromCenterX, fromCenterY, toCenterX, toCenterY,
			toSides[i].x1, toSides[i].y1, toSides[i].x2, toSides[i].y2
		);
		if(toInter) break;
	}
	
	ctx.beginPath();
	ctx.moveTo(fromInter.x,fromInter.y);
	ctx.lineTo(toInter.x,  toInter.y  );
	ctx.stroke();
	
	var theta = 20;
	var arrowLength = 9;
	var ratio = 0.7;
	var vectX, vectY, vect1, vect2, vect3;
	vectX = fromInter.x - toInter.x;
	vectY = fromInter.y - toInter.y;
	vect1 = scaledRotated(vectX, vectY,  Math.PI/180*theta,arrowLength);
	vect2 = scaledRotated(vectX, vectY,  0                ,arrowLength*ratio);
	vect3 = scaledRotated(vectX, vectY, -Math.PI/180*theta,arrowLength);
	ctx.beginPath();
	ctx.moveTo(toInter.x, toInter.y);
	ctx.lineTo(toInter.x+vect1.x, toInter.y+vect1.y);
	ctx.lineTo(toInter.x+vect2.x, toInter.y+vect2.y);
	ctx.lineTo(toInter.x+vect3.x, toInter.y+vect3.y);
	ctx.fill();
	
	vectX = -vectX; vectY = -vectY;
	vect1 = scaledRotated(vectX, vectY,  Math.PI/180*theta,arrowLength);
	vect2 = scaledRotated(vectX, vectY,  0                ,arrowLength*ratio);
	vect3 = scaledRotated(vectX, vectY, -Math.PI/180*theta,arrowLength);
	ctx.beginPath();
	ctx.moveTo(fromInter.x, fromInter.y);
	ctx.lineTo(fromInter.x+vect1.x, fromInter.y+vect1.y);
	ctx.lineTo(fromInter.x+vect2.x, fromInter.y+vect2.y);
	ctx.lineTo(fromInter.x+vect3.x, fromInter.y+vect3.y);
	ctx.fill();
}

function drawAllArrows(arrows) {
	var ctx = document.getElementById("canvas").getContext("2d");
	var j;
	for(var i in arrows) {
		for(j=0; j<arrows[i].length-1; j++) {
			drawArrow(ctx, document.getElementById("layout2_map_" + arrows[i][j]), document.getElementById("layout2_map_" + arrows[i][j+1]));
		}
	}
}