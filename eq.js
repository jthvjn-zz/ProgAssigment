const fs = require("fs");
class Node{
	constructor(lhs, rhs, op = ''){
		this.op = op;
		this.lhs = lhs;
		this.rhs = rhs;
	}

};


function sign(op){
	var s = '';
	switch(op){
		case 'add'     : s = '+'; break;
		case 'subtract': s = '-'; break;
		case 'divide'  : s = '/'; break;
		case 'multiply': s = '*'; break;
	}
	return s;
}

/*
---------------------------------------------
Expression to be included in equation exp = x
---------------------------------------------
*/

function generateExp(node){
	ans = '';
	if(node === undefined){
		return ans;
	}
	
	if(node.lhs && node.lhs.op){
		ans += '(' + generateExp(node.lhs) + ')';
	} else {
		ans += generateExp(node.lhs);
	}

	ans += (node.op)? sign(node.op) : node;

	if(node.rhs && node.rhs.op){
		ans += '('+ generateExp(node.rhs) +')';
	} else {
		ans += generateExp(node.rhs);
	}

	return ans;
}

/*
---------------------------------------------------------------
All subtrees containing x
---------------------------------------------------------------
*/

function preProcessor(node)
{
	if(node === undefined){
		return false;
	}
	if(node == 'x' || preProcessor(node.lhs) || preProcessor(node.rhs)){
		node.x_present = true;
		return true;
	} else {
		node.x_present = false;
		return false;
	}
	
}

/*
--------------------------------------------------------------
Build the complete exp. tree for Q1 and Q2 with the initialized 
tree and parsed JSON.
--------------------------------------------------------------
*/


function processTree(node, tree_){
	if(node === undefined || node == 'x'){
		return;
	}
	
	let r, l , sign;
	if( node.op && (node.rhs.x_present === false || typeof node.rhs == 'number')){
		
		sign = getSign(node.op, lhs = false);
		l = tree_, r = node.rhs;
		tree_ = new Node(l, r, sign);

		processTree(node.lhs, tree_);
	} else if(node.op && (node.lhs.x_present === false || typeof node.lhs == 'number')){
		
		sign = getSign(node.op, lhs = true);				
		[l, r] = (node.op === 'divide') ? [node.lhs, tree_] : [tree_, node.lhs];
		tree_ = new Node(l, r, sign);
		
		processTree(node.rhs, tree_);
	}
	return tree_;
}

/*
------------------------------------------------------
Get the inverse operation. Special Case A/x = const.
------------------------------------------------------
*/

function getSign(sign, lhs)
{
		let sign_ = '';
		switch(sign){
			case 'add'		: sign_ = 'subtract'; break;
			case 'subtract' : sign_ = 'add'; break;
			case 'divide'	: sign_ = (lhs)? 'divide': 'multiply'; break;
			case 'multiply' : sign_ = 'divide'; break;
		}
		return sign_;
}

/*
-------------------------------------------------------
Initiallize tree to build the exp.tree for Q2. Constant 
on RHS is added to the root node with an sub exp. from
LHS not contain ing x
-------------------------------------------------------
*/

function initializeTree(t){
		let l, r, sign, root;
		if(t.op && t.op === 'equal'){
			
			l = t.rhs;
			t = t.lhs;
			if(t == 'x') return 'x';
			if(t.rhs.x_present || typeof t.rhs == 'number'){
				sign = getSign(t.op, lhs = true);
				if(t.op === 'divide'){
					 r = l; l = t.lhs;
				}else{
					r = t.lhs;
				}
				t = t.rhs;
			
			} else {
				r = t.rhs;
				sign = getSign(t.op, lhs=false);
				t = t.lhs;
			}
			root = new Node(l,r,sign);
		}
		return [root, t];	
}

/*
-------------------------------------------------
Solve final expression Tree
-------------------------------------------------
*/

function solve(root)
{
	if(typeof root == 'number'){
		return root;
	}

	let l = solve(root.lhs);
	let r = solve(root.rhs);
	
	let ans = 0.0;
	switch(root.op)
	{
		case 'add'		: ans = l + r; break;
		case 'subtract'	: ans = l - r; break;
		case 'multiply' : ans = l * r; break;
		case 'divide'	: ans = (r != 0)? l / r: 0; break;
	}
	return ans;
}

/*-----------------Q1-------------------------------
Inorder Traversal of the parsed content to generate 
the required expression.
----------------------------------------------------
*/

function solveQ1(eq){
	let s = generateExp(eq.lhs) +'='+eq.rhs;
	console.log(s);
}

/* 
---------------------Q2------------------------------
An expression tree is buit from the parse JSON object 
as root which contains only constants (not x). The exp. 
tree is printed using the logic in Q1.
---------------------Q3------------------------------
The expression tree built for Q2 is solved. Division 
by zero not handled. Expecting valid expression.
-----------------------------------------------------
*/

function solveQ2Q3(eq){
	var root;
	preProcessor(eq);
	if(eq.lhs === 'x'){
		console.log('x=',eq.rhs);
		console.log('x=',eq.rhs);	
	}else{
	
	[root, tree] = initializeTree(tree);
	root = processTree(tree, root);
	let s = 'x=' + generateExp(root);
	console.log(s);
	let val = solve(root);
	console.log('x=',val);
	}
}



const file = process.argv[2];
const r = fs.readFileSync(file);
var tree = JSON.parse(r);
solveQ1(tree);
solveQ2Q3(tree);

