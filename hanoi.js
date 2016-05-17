
var $tower = $('.tower');
var towerWidth = $tower.outerWidth(true);
var towerHeight = $tower.height();
var $disk = $('.disk');
var $step = $('#step');
var towers = [
	[],
	[],
	[]
];

var val = 3; //初始盘子数
var step = 0; //初始当前步数
//初始化函数
function init(argument) {
	val = $('#selection').val();
	step = 0;
	$disk.css({
		'top': function(index) {
			if (index < val) {
				return towerHeight - (val - index) * 20;
			} else {
				return -2000;
			}
		},
		'left': function(index) {
			return (towerWidth - (42 + index * 20)) / 2;
		}
	})
	$('#min-step').text(Math.pow(2, val) - 1);
	$step.text(0);
	aniArr = [];
	towers[0] = [];
	towers[1] = [];
	towers[2] = [];
	for (var i = 0; i < val; i++) {
		towers[0][i] = $disk[val - i - 1];
	}
}

// 拖拽函数
var drag = function() {
	var dragging = null;
	var diffX = 0,
		diffY = 0;
	var towerIndex, inIndex, outIndex;

	function handle(event) {
		switch (event.type) {
			case 'mousedown':
				console.log('kaka')
				if (event.target !== towers[towerIndex][towers[towerIndex].length - 1]) {
					return;
				}
				dragging = event.target;
				outIndex = towerIndex;
				towers[outIndex].pop();
				diffX = event.pageX - dragging.offsetLeft;
				diffY = event.pageY - dragging.offsetTop;
				break;
			case 'mousemove':
				if (dragging !== null) {
					dragging.style.left = (event.pageX - diffX) + 'px';
					dragging.style.top = (event.pageY - diffY) + 'px';
				}
				break;
			case 'mouseup':
				if (dragging !== null) {
					if (dragging.offsetLeft < towerWidth) {
						inIndex = 0;
					} else if (dragging.offsetLeft > 2 * towerWidth) {
						inIndex = 2;
					} else {
						inIndex = 1;
					}
					//不允许大盘叠在小盘上面
					var len = towers[inIndex].length
					if (len !== 0 && dragging.style.zIndex > towers[inIndex][len - 1].style.zIndex) {
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
						popup.show('Perfect !!!');
					} else {
						popup.show(step + '步，你还能更快吗？');
					}
				}
				break;
		}

	}
	return {
		enable: function() {
			$(document).on('mousedown mouseup mousemove', handle);
			$(document).on('mouseenter', '.tower', function() {
				towerIndex = $tower.index(this); //记录鼠标进入的是哪个tower
			});
		},
		disable: function() {
			$(document).off('mousedown mouseup  mousemove', handle);
		}
	}
}();


var popup = {
	show: function(t) {
		$('#shade').fadeTo(500, 0.5);
		$('#pop').animate({
			top: '40%'
		}, 500);
		$('#text').html(t);
	},
	hide: function() {
		$('#shade').fadeOut(500);
		$('#pop').animate({
			top: '-500px'
		}, 500);
	}
}
// 演示汉诺塔函数
function demo(n) {
	var aniArr = [];
	function hanoi(n, a, b, c) {
		if (n > 0) {
			hanoi(n - 1, a, c, b);
			var drag = towers[a].pop();
			var left = (towerWidth - $(drag).outerWidth()) / 2 + c * towerWidth;
			var top = towerHeight - (towers[c].length + 1) * 20;
			aniArr.push({
				element: drag,
				left: left,
				top: top
			});
			towers[c].push(drag);
			hanoi(n - 1, b, a, c);
		}
	}
	function animation(i) {
		if (i < aniArr.length) {
			$(aniArr[i].element).animate({
				top: -20
			}, 300).animate({
				left: aniArr[i].left
			}, 300).animate({
				top: aniArr[i].top
			}, 300, function() {
				$step.text(++step);
				animation(++i);
			});
		} else {
			popup.show('看懂了么，自己试一试');
			drag.enable()
			init();
		}
	}
	return function() {
		hanoi(n, 0, 1, 2)
		animation(0)
	}(n)
}

$(document).ready(function() {
	var diskColor = ['#f0c', '#9c0', '#f99', '#cc0', '#f90', '#c9c', '#99f', '#f66']; //disk颜色数组
	$disk.css({
		'width': function(index) {
			return 40 + index * 20;
		},
		'backgroundColor': function(index) {
			return diskColor[index];
		},
		'z-index': function(index) {
			return index + 10
		}
	});
	init()
	drag.enable()
});

$('#selection').change(function() {
	init();
});

$('#reset').click(function() {
	init();
});

$('#introduction').click(function() {
	popup.show('点击拖动圆盘，将A柱子上的圆盘移到C柱子上，每次只能移动最上面的圆盘，且大圆盘不能放在小圆盘上面，点击"演示"查看演示');
});

$('#ok').add('#shade').on('click', function() {
	init();
	popup.hide();
	$(':input').prop('disabled', false);
});

$('#demo').click(function() {
	init();
	drag.disable()
	demo(val)
	$(':input').not('#ok').prop('disabled', true);
});
