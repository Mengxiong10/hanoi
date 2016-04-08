var $container = $('#container'),
	$tower = $('.tower'),
	$disk = $('.disk');
var towerWidth = $tower.outerWidth(true);
var towerHeight = $tower.height();
var containerLeft = $container.offset().left;
var containerTop = $container.offset().top;
var val = 3; //初始盘子数
var $selection = $('#selection');
var diskColor = ['#f0c', '#9c0', '#f99', '#cc0', '#f90', '#c9c', '#99f', '#f66']; //disk颜色数组
var dragging = null; //拖拽对象
var towers = [
	[],
	[],
	[]
];
var towerIndex, inIndex, outIndex;
var diffX = 0,
	diffY = 0;


//初始化函数
function init(argument) {
	val = $selection.val();
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
				return 2000;
			}

		},
		'backgroundColor': function(index) {
			return diskColor[index];
		}

	});
	for (var i = 0; i < val; i++) {
		towers[0].push($disk[i]);
	}
	towers[1] = [];
	towers[2] = [];
}
init();
$selection.change(function(event) {
	init();
});
$container.on('mouseenter', '.tower', function(event) {
	towerIndex = $tower.index(this); //记录鼠标进入的是哪个tower
});

$(document).mousemove(function(event) {
	if (dragging !== null) {
		dragging.style.left = (event.pageX - diffX - containerLeft) + 'px';
		dragging.style.top = (event.pageY - diffY - containerTop) + 'px';
	}
});
//拖拽函数
$container.on('mousedown mouseup','.disk', function(event) {
	switch (event.type) {
		case 'mousedown':
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
				dragging.style.left = ((towerWidth - $(dragging).outerWidth()) / 2 +inIndex*towerWidth) + 'px';
				dragging.style.top = (towerHeight - (towers[inIndex].length+1)* 20) +'px';
				towers[inIndex].push(dragging);
			}
				dragging = null;
	}
});