const fs = require("fs");


const file = process.argv[2];
const r = fs.readFileSync(file);
var list = JSON.parse(r);
//console.log(list);
solve(list, "");

function solve(list, parent){
	
	if(list.length == 0)
		return;
	for(let i = 0; i < list.length; i++){
		if(list[i].children)
			solve(list[i].children, list[i].name);
			if(parent)
			console.log(list[i].name, list[i].age, parent);
	}
}


