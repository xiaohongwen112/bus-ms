
var fs = require('fs');

const api = require('./apis.js');
console.log(api);

const arr = [];
Object.keys(api).forEach(d => { 
  arr.push(Object.assign({path: d}, api[d]))
});
// console.log(arr);

fs.writeFile('./newApis.js', JSON.stringify(arr, null, 2), function(err){
	if(err){
		console.log(err);
	}else{
		console.log('ok');
	}
});


// bash $ .\node_modules\.bin\eslint --fix .\config\newApis.js
