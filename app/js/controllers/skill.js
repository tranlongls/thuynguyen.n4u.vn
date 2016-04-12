module.exports = function($scope) {
	var data = [];
	data.push({name: 'Photoshop', value: 75});
	data.push({name: 'Dreamweaver', value: 20});
	data.push({name: 'Illustrator', value: 80});
	data.push({name: 'Khả năng vẽ tay tốt.', value: 0});
	data.push({name: 'Indesign', value: 27});
	data.push({name: 'Có tinh thần làm việc đồng đội.', value: 0});
	data.push({name: 'Premiere', value: 23});
	data.push({name: 'Có trách nhiệm trong công việc.', value: 0});

	$scope.data = data;
};