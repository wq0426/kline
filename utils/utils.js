function dateFormat(fmt, date) {
	let ret;
	const opt = {
		"Y+": date.getFullYear().toString(), // 年
		"m+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"H+": date.getHours().toString(), // 时
		"M+": date.getMinutes().toString(), // 分
		"S+": date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		};
	};
	return fmt;
}

function time_comment(time_str) {

	var time = new Date(time_str)

	return dateFormat('mm-dd HH:MM', time)

}

function timeSep(time2) {

	let now = new Date().getTime()
	let time = new Date(time2).getTime()

	var sep = (now - time) / 1000

	if (sep < 3600) {
		return String(sep / 60) + '分钟前'

	} else if (sep > 3600 && sep < 86400) {

		var hour = String(sep / 3600)

		var sec = sep - parseInt(hour) * 3600

		var min = String(sec / 60)

		return hour + '时' + min + '分'

	} else if (sep > 86400 && sep < 2592000) {

		var day = String(sep / 86400)

		var sec = sep - (parseInt(day) * 86400)

		var hour = String(sec / 3600)

		return day + '天' + hour + '时前'

	} else {

		var month = String(sep / 2592000)

		sep = sep - (parseInt(month) * 2592000)

		var day = String(sep / 86400)

		var sec = sep % 86400

		return month + '个月' + day + '天前'
	}

	return time
}

function timeCountdown(second) {

	if (second < 60) {
		return second

	} else if (second < 3600) {

		var min = parseInt(second / 60)

		return min + ':' + (second - min * 60)

	} else if (second > 3600 && second < 86400) {

		var hour = parseInt(second / 3600)

		second = second = second - hour * 3600

		var min = parseInt(second / 60)

		second = second = second - min * 60

		return hour + ':' + min + ':' + second

	} else {

		var day = parseInt(second / 86400)

		second = second = second - day * 86400

		var hour = parseInt(second / 3600)

		second = second = second - hour * 3600

		var min = parseInt(second / 60)

		second = second = second - min * 60

		return day + ':' + hour + ':' + min + ':' + second

	}

}

function haversineDistance(lat1, lon1, lat2, lon2) {
	const R = 6371 * 1000; // 地球平均半径，单位为公里
	const phi1 = lat1 * (Math.PI / 180); // 转换纬度为弧度
	const phi2 = lat2 * (Math.PI / 180);
	const deltaPhi = (lat2 - lat1) * (Math.PI / 180);
	const deltaLambda = (lon2 - lon1) * (Math.PI / 180);

	const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
		Math.cos(phi1) * Math.cos(phi2) *
		Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const distance = R * c; // 两点之间的距离，单位为公里
	return distance;
}

function getArrayIds(arr, key = 'id') {

	var ids = []

	for (var i in arr) {

		if (arr[i][key] && arr[i][key] != 0 && arr[i][key] != null) {
			ids.push(arr[i][key])
		}

	}

	ids = Array.from(new Set(ids));

	return ids
}

function getArrayItem(arr, id, key = 'id') {

	for (var i in arr) {
		if (arr[i][key] == id) {
			return arr[i]
		}
	}

	return {}
}

function array2object(arr, key = 'id') {

	var obj = {}

	for (var i in arr) {
		obj['a' + arr[i][key]] = arr[i]
	}

	return obj
}

function getArrayCommomCount(arr1, arr2) {
	const duplicates = arr1.filter(item => arr2.includes(item));
	return duplicates.length;
}

function getFileExtension(str) {
	return str.substring(str.lastIndexOf('.') + 1);
}

function getFileName(url) {
	return url.match(/[^\/]+$/)[0]; // 'image.png'
}

function getDictProvince() {

	return [{
			label: '北京',
			value: 11
		},
		{
			label: '天津',
			value: 12
		},
		{
			label: '河北',
			value: 13
		},
		{
			label: '山西',
			value: 14
		},
		{
			label: '内蒙古',
			value: 15
		},
		{
			label: '辽宁',
			value: 21
		},
		{
			label: '吉林',
			value: 22
		},
		{
			label: '黑龙江',
			value: 23
		},
		{
			label: '上海',
			value: 31
		},
		{
			label: '江苏',
			value: 32
		},
		{
			label: '浙江',
			value: 33
		},
		{
			label: '安徽',
			value: 34
		},
		{
			label: '福建',
			value: 35
		},
		{
			label: '江西',
			value: 36
		},
		{
			label: '山东',
			value: 37
		},
		{
			label: '河南',
			value: 41
		},
		{
			label: '湖北',
			value: 42
		},
		{
			label: '湖南',
			value: 43
		},
		{
			label: '广东',
			value: 44
		},
		{
			label: '广西',
			value: 45
		},
		{
			label: '海南',
			value: 46
		},
		{
			label: '重庆',
			value: 50
		},
		{
			label: '四川',
			value: 51
		},
		{
			label: '贵州',
			value: 52
		},
		{
			label: '云南',
			value: 53
		},
		{
			label: '西藏',
			value: 54
		},
		{
			label: '陕西',
			value: 61
		},
		{
			label: '甘肃',
			value: 62
		},
		{
			label: '青海',
			value: 63
		},
		{
			label: '宁夏',
			value: 64
		},
		{
			label: '新疆',
			value: 65
		},
		{
			label: '香港',
			value: 81,
			disabled: true
		},
		{
			label: '澳门',
			value: 82,
			disabled: true
		},
		{
			label: '台湾',
			value: 71,
			disabled: true
		}
	]
}

function provinceId2name(id) {

	if (id == 11) {
		return '北京'
	} else if (id == 12) {
		return '天津'
	} else if (id == 13) {
		return '河北'
	} else if (id == 14) {
		return '山西'
	} else if (id == 15) {
		return '内蒙古'
	} else if (id == 21) {
		return '辽宁'
	} else if (id == 22) {
		return '吉林'
	} else if (id == 23) {
		return '黑龙江'
	} else if (id == 31) {
		return '上海'
	} else if (id == 32) {
		return '江苏'
	} else if (id == 33) {
		return '浙江'
	} else if (id == 34) {
		return '安徽'
	} else if (id == 35) {
		return '福建'
	} else if (id == 36) {
		return '江西'
	} else if (id == 37) {
		return '山东'
	} else if (id == 41) {
		return '河南'
	} else if (id == 42) {
		return '湖北'
	} else if (id == 43) {
		return '湖南'
	} else if (id == 44) {
		return '广东'
	} else if (id == 45) {
		return '广西'
	} else if (id == 46) {
		return '海南'
	} else if (id == 50) {
		return '重庆'
	} else if (id == 51) {
		return '四川'
	} else if (id == 52) {
		return '贵州'
	} else if (id == 53) {
		return '云南'
	} else if (id == 54) {
		return '西藏'
	} else if (id == 61) {
		return '陕西'
	} else if (id == 62) {
		return '甘肃'
	} else if (id == 63) {
		return '青海'
	} else if (id == 64) {
		return '宁夏'
	} else if (id == 65) {
		return '新疆'
	} else if (id == 81) {
		return '香港'
	} else if (id == 82) {
		return '澳门'
	} else if (id == 71) {
		return '台湾'
	} else {
		return '未知'
	}

}

function getDictYear() {

	var now = new Date().getTime()

	var n = 86400000 * 365

	var res = []

	for (var i = 0; i < 5; i++) {

		var timestamp = now - n * i

		var year = new Date(timestamp).getFullYear()

		res.push({
			label: year.toString(),
			value: year
		})

	}

	return res
}

function array2group(array, key) {

	return array.reduce((acc, item) => {
		// 获取当前项的key值
		const keyValue = item[key];

		// 如果acc中没有对应的key值，创建一个新的数组
		if (!acc[keyValue]) {
			acc[keyValue] = [];
		}

		// 将当前项推入对应的数组
		acc[keyValue].push(item);

		return acc;
	}, {});
}

function array2groupArray(obj) {

	var arr = []

	for (var i in obj) {

		arr.push({
			name: i,
			foods: obj[i]
		})

	}

	return arr
}

function array2tree(array, key = 'parent_id') {
	const map = new Map();
	const tree = [];

	// 将数组转换为map存储，方便查找
	array.forEach(item => {
		map.set(item.id, item);
	});

	array.forEach(item => {
		const parent = map.get(item[key]);

		// 如果没有父节点，则认为是根节点
		if (!parent) {
			tree.push(item);
		} else {
			// 否则添加到父节点的children数组中
			if (!parent.children) {
				parent.children = [];
			}
			parent.children.push(item);
		}
	});

	return tree;
}

function countOverlap(arr1, arr2) {
	const set1 = new Set(arr1);
	const set2 = new Set(arr2);
	let count = 0;
	for (let item of set1) {
		if (set2.has(item)) {
			count++;
		}
	}
	return count;
}

function getArrayObjectCols(array) {

	const ids = [];

	array.forEach(item => {
		ids.push(item.id);
	});

	return ids
}

function changeArrayItem(arr, index1, index2) {

	var a = arr[index1]
	var b = arr[index2]

	arr[index1] = b
	arr[index2] = a

}

function hexToRgb(hex) {
	// Remove the leading '#' if it exists
	hex = hex.replace(/^#/, '');
	// Convert 3-digit hex to 6-digit hex
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	return [r, g, b];
}

function rgbToHex(rgb) {
	const [r, g, b] = rgb;
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * @param {Object} hex  颜色值，如：#007AFF
 * @param {Object} amount  表示淡化的程度，范围是 0 到 1，如：0.3
 */
function lightenColor(hex, amount) {
	const [r, g, b] = hexToRgb(hex);
	const newR = Math.min(255, r + (255 - r) * amount);
	const newG = Math.min(255, g + (255 - g) * amount);
	const newB = Math.min(255, b + (255 - b) * amount);
	return rgbToHex([newR, newG, newB]);
}


function calculateBrightness(rgb) {
	const [r, g, b] = rgb;
	return 0.299 * r + 0.587 * g + 0.114 * b;
}

function isLightColor(hex) {
	const rgb = hexToRgb(hex);
	const brightness = calculateBrightness(rgb);
	return brightness > 127;
}

function arrayUniqe(array) {
	return [...new Set(array)];
}

function str_split2array(str){
	
	// 字符串文本替换
	str=str.replace(' ',',')
	str=str.replace('，',',')
	str=str.replace('、',',')
	
	// 将字符串按逗号分割成数组
	var arr=str.split(',')
	
	return arr;
	
}


export default {
	dateFormat: dateFormat,
	time_comment: time_comment,
	haversineDistance: haversineDistance,
	timeCountdown: timeCountdown,
	getArrayIds: getArrayIds,
	getArrayItem: getArrayItem,
	getFileExtension: getFileExtension,
	getFileName: getFileName,
	getDictProvince: getDictProvince,
	getDictYear: getDictYear,
	provinceId2name: provinceId2name,
	array2group: array2group,
	array2groupArray: array2groupArray,
	array2tree: array2tree,
	countOverlap: countOverlap,
	getArrayObjectCols: getArrayObjectCols,
	changeArrayItem: changeArrayItem,
	getArrayCommomCount: getArrayCommomCount,
	lightenColor: lightenColor,
	isLightColor: isLightColor,
	arrayUniqe: arrayUniqe,
	str_split2array:str_split2array
}