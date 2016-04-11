var $container = $('#container'),
	$tower = $('.tower'),
	$disk = $('.disk');
var towerWidth = $tower.outerWidth(true);
var towerHeight = $tower.height();
var val = 3; //初始盘子数
var step = 0; //初始当前步数
var $selection = $('#selection'),
	$minStep = $('#min-step'),
	$step = $('#step'),
	$introduction = $('#introduction'),
	$reset = $('#reset'),
	$demo = $('#demo');
var diskColor = ['#f0c', '#9c0', '#f99', '#cc0', '#f90', '#c9c', '#99f', '#f66']; //disk颜色数组
var dragging = null; //拖拽对象
var towers = [
	[],
	[],
	[]
];
var aniArr = [];
var towerIndex, inIndex, outIndex;
var diffX = 0,
	diffY = 0;
var $shade = $('#shade'),
	$pop = $('#pop'),
	$text = $('#text'),
	$ok = $('#ok');
$shade.height($(document).height());
//初始化函数
function init(argument) {
	val = $selection.val();
	step = 0;
	$disk.css({
		'width': function(index) {
			return 40 + index * 20;
		},
		'left': function(index) {
			return (towerWidth - (42 + index * 20)) / 2;
		},
		'top': function(index) {
			if (index < val) {
				return towerHeight - (val - index) * 20;
			} else {
				return -2000;
			}

		},
		'backgroundColor': function(index) {
			return diskColor[index];
		}

	});
	$minStep.text(Math.pow(2, val) - 1);
	$step.text(0);
	aniArr = [];
	towers[0] = [];
	towers[1] = [];
	towers[2] = [];
	for (var i = 0; i < val; i++) {
		towers[0][i] = $disk[val - i - 1];
	}
}
init();
$selection.change(function() {
	init();
});
$reset.click(function() {
	init();
	stop = true;
});
$container.on('mouseenter', '.tower', function() {
	towerIndex = $tower.index(this); //记录鼠标进入的是哪个tower
});


$(document).mousemove(function(event) {
	if (dragging !== null) {
		$(dragging).offset({
			top: event.pageY - diffY,
			left: event.pageX - diffX
		});
	}
});
//拖拽函数
$container.on('mousedown mouseup', '.disk', function(event) {
	switch (event.type) {
		case 'mousedown':
			if (event.target !== towers[towerIndex][towers[towerIndex].length - 1]) {
				return;
			}
			dragging = event.target;
			outIndex = towerIndex;
			towers[outIndex].pop();
			var offset = $(dragging).offset();
			diffX = event.pageX - offset.left;
			diffY = event.pageY - offset.top;
			break;
		case 'mouseup':
			if (dragging !== null) {
				if (parseInt(dragging.style.left) < towerWidth) {
					inIndex = 0;
				} else if (parseInt(dragging.style.left) > 2 * towerWidth) {
					inIndex = 2;
				} else {
					inIndex = 1;
				}
				//不允许大盘叠在小盘上面
				if (towers[inIndex].length !== 0 && dragging.offsetWidth > towers[inIndex][towers[inIndex].length - 1].offsetWidth) {
					inIndex = outIndex;
				}
				dragging.style.left = ((towerWidth - $(dragging).outerWidth()) / 2 + inIndex * towerWidth) + 'px';
				dragging.style.top = (towerHeight - (towers[inIndex].length + 1) * 20) + 'px';
				towers[inIndex].push(dragging);
				$step.text(++step);
			}
			dragging = null;
			if (towers[2].length == val) {
				if (step == Math.pow(2, val) - 1) {
					popup('Perfect !!!');
				} else {
					popup(step + '步，你还能更快吗？');
				}

			}
	}
});

//弹出框
function popup(t) {
	$shade.fadeTo(500, 0.5);
	$pop.animate({
		top: '40%'
	}, 500);
	$text.html(t);
}
//清除弹出框
function clear() {
	$shade.fadeOut(500);
	$pop.animate({
		top: '-500px'
	}, 500);
}
//演示汉诺塔函数
function hanoi(n,a,b,c) {
	if (n > 0) {
		hanoi(n-1,a,c,b);
		var drag = towers[a].pop();
		var left = (towerWidth - $(drag).outerWidth()) / 2 + c * towerWidth;
		var top = towerHeight - (towers[c].length + 1) * 20;
		aniArr.push(new Animation(drag,left,top));
		towers[c].push(drag);
		hanoi(n-1,b,a,c);
	}
}
function Animation(element,left,top) {
	this.element = element;
	this.left = left;
	this.top = top;
}
var stop = false;
function ani(i) {
	if (stop===false) {
	if (i < aniArr.length) {
		$(aniArr[i].element).animate({
			top: -20
		}, 300).animate({
			left: aniArr[i].left
		}, 300).animate({
			top: aniArr[i].top
		}, 300, function() {
			$step.text(++step);
			ani(++i);
		});
	}else{
		popup('看懂了么，自己试一试');
	}
}
}

$introduction.click(function() {
	popup('点击拖动圆盘，将A柱子上的圆盘移到C柱子上，每次只能移动最上面的圆盘，且大圆盘不能放在小圆盘上面，点击"演示"查看演示');
});

$(document).on('click', '#shade,#ok', function() {
	clear();
	init();
	$(':input').prop('disabled', false);
});

$demo.click(function() {
	stop = false;
	hanoi(val,0,1,2);
	ani(0);
	$(':input').not($ok).prop('disabled', true);
});


