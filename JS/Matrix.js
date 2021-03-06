function Matrix(y,x){
	this.dimX = x;//int (columns)
	this.dimY = y;//int (rows)
	this.val = new Array();//2-dim array
	
	this.construct = function(value){//2-dim array->bool
		var succes = true;
		if(value.length!=this.dimY){//layer 1: check for dimY
			console.error("cannot construct matrix, unexpected amount of rows recieved (expected " + this.dimY + " rows, recieved " + value.length + ")");
			succes = false;
		}else{
			for(var i=0;i<this.dimY;i++){
				if(value[i].length!=this.dimX){//layer 2: check for dimX
					console.error("cannot construct matrix, unexpected length of row (expected " + this.dimX + " elements, recieved " + value[i].length + ")");
					succes = false;
				}
			}
		}
		for(var p in value){
			for(var q in value[p]){
				if(typeof(value[p][q])!="number"){
					console.error("encountered a non number element while attempting to construct a matrix at element " + q + "," + p);
					succes = false;
				}
			}
		}
		if(succes){
			this.val = value;
			return true;
		}else{
			return false;
		}
	}

	this.isMatrix = function(y,x){//int,int->bool
		if(typeof(this)!="object"){
			return false;
		}else if(this.val.length != y){
			return false;
		}else{
			check = true;
			for(var i of this.val){
				if(i.length!=x){
					check = false;
				}else{continue;}
			}
			return check;
		}
	}

	this.clone = function(){//->Matrix
		var t = new Matrix(this.dimY,this.dimX);
		for(var i = 0; i<this.dimX; i++){
			for(var j = 0; j<this.dimY; j++){
				t.altElement(i,j,this.getElement(i,j));
			}
		}
		return t;
	}

	this.addColumns = function(n){//int->void
		for(var i=0;i<this.dimY;i++){
			for(var j=0;j<n;j++){
				this.val[i][this.dimX+j]=0;
			}
		}
		this.dimX += n;
	}

	this.addRows = function(n){//int->void
		for(var i=0;i<n;i++){
			this.val[this.dimY+i] = new Array();
			for(var j=0;j<this.dimX;j++){
				this.val[this.dimY+i][j] = 0;
			}
		}
		this.dimY+=n;
	}

	this.altRow = function(y,arr){//int,array->void TODO: number check
		if(typeof(arr)!="object" || arr.length!=this.dimX){
			console.warn("Warning: faulty array recieved, expected array of length " + this.dimX);
		}else if(y>this.dimY || y<0){
			console.warn("Warning: row does not exist");
		}else{
			this.val[y] = arr;
		}
	}

	this.altColumn = function(x,arr){//int,array->void
		if(typeof(arr)!="object" || arr.length!=this.dimY){
			console.warn("Warning: faulty array recieved, expected array of length " + this.dimY);
		}else if(x>this.dimX || x<0){
			console.warn("Warning: column does not exist");
		}else{
			for(var i=0;i<this.dimY;i++){
				if(typeof arr[i] == "number"){
					this.val[i][x] = arr[i];
				}else{
					console.warn("Warning: one element to be inserted is not a number");
					this.val[i][x] = 0;
				}
			}
		}
	}

	this.altElement = function(y,x,n){//int,int,number->void
		if(typeof n == "number"){
			this.val[y][x] = n;
		}else{
			console.warn("Warning: the element to be inserted is not a number");
		}
	}

	this.dropRow = function(y){//int->void
		this.val.splice(y,1);
		this.dimY--;
	}

	this.dropColumn = function(x){//int->void
		for(row of this.val){
			row.splice(x,1);
		}
		this.dimX--;
	}

	this.getRow = function(y){//int->array
		return this.val[y];
	}

	this.getColumn = function(x){//int->array
		var col = new Array();
		for(var i=0;i<this.dimY;i++){
			col.push(this.val[i][x]);
		}
		return col;
	}

	this.getElement = function(y,x){//int,int->number
		return this.val[y][x];
	}

	this.mAdd = function(m){//Matrix->Matrix
		if(typeof(m)!="object"){
			console.warn("Warning: the matrix you want to add is not a matrix");
		}else if(!m.isMatrix(this.dimX,this.dimY)){
			console.warn("Warning: cannot add matrices of diffrent sizes");
		}else{
			var sum = new Matrix(this.dimX,this.dimY);
			for(var i=0;i<this.dimX;i++){
				for(var j=0;j<this.dimY;j++){
					sum.altElement(j,i,(this.getElement(j,i)+m.getElement(j,i)));
				}
			}
			return sum;
		}
	}

	this.cMultiply = function(c){//number->Matrix
		var cm = new Matrix(this.dimX,this.dimY);
		for(var i=0;i<this.dimY;i++){
			for(var j=0;j<this.dimX;j++){
				cm.altElement(i,j,(this.getElement(i,j)*c));
			}
		}
		return cm;
	}

	this.leftMultiply = function(m){//Matrix->Matrix//The owner matrix is on the right, the guest matrix on the left.
		if(m.dimX!=this.dimY || typeof(m)!="object"){
			console.warn("Warning: These matrices cannot be multiplied");
		}else{
			var mn = new Matrix(m.dimY,this.dimX);
			for(var n=0;n<m.dimY;n++){
				for(var p=0;p<this.dimX;p++){
					var j=0;
					for(var i=0;i<this.dimY;i++){
						j+=(m.getElement(n,i)*this.getElement(i,p));
					}

					mn.altElement(n,p,j);
				}
			}

		}
		return mn;
	}

	this.rightMultiply = function(m){//Matrix->Matrix//The owner matrix is on the left, the guest matrix on the right.
		return m.leftMultiply(this);
	}

	this.transpose = function(){//->Matrix
		var t = new Matrix(this.dimX,this.dimY)
		for(var i=0;i<this.dimY;i++){
			for(var j=0;j<this.dimX;j++){
				t.altElement(j,i,this.getElement(i,j));
			}
		}
		return t;
	}

	this.trace = function(){//->number
		var tr = 0;
		var c = Math.min(this.dimX,this.dimY);
		for(var i=0;i<c;i++){
			tr+=this.getElement(i,i);
		}
		return tr;
	}

	

	this.minor = function(posy,posx){//int,int->Matrix
		var c = this.clone();
		c.dropRow(posy);
		c.dropColumn(posx);
		return c;
	}

	this.det = function(){//->number
		if(this.dimY!=this.dimX){
			console.error("Cannot give a determinant of a non-square matrix");
			return false;
		}else if(this.dimY == 2){
			return ((this.getElement(0,0)*this.getElement(1,1))-(this.getElement(1,0)*this.getElement(0,1)));
		}else{
			var d = 0;
			var minor = undefined;
			for(var i=0;i<this.dimY;i++){
				minor = this.minor(0,i); 
				
				if(i%2==0){
					d+=(minor.det()*this.getElement(0,i));
					
				}else{
					d-=(minor.det()*this.getElement(0,i));
					
				}
			}
			return d;

		}
	}

	this.inverse = function(){//->Matrix
		if(this.dimX!=this.dimY){
			console.error("Cannot return an inverse matrix of a non-square matrix");
			return false;
		}else if(this.det()==0){
			console.warn("Cannot return inverse, matrix is singular");
			return false;
		}else if(this.dimX==2){
			var inv = new Matrix(2,2);
			inv.altElement(0,0,(this.getElement(1,1)/this.det()));
			inv.altElement(0,1,(this.getElement(0,1)/this.det()*-1));
			inv.altElement(1,0,(this.getElement(1,0)/this.det()*-1));
			inv.altElement(1,1,(this.getElement(0,0)/this.det()));
		}else{
			var inv = new Matrix(this.dimX,this.dimY);
			for(var i=0;i<this.dimY;i++){
				for(var j=0;j<this.dimX;j++){
					
					var c = this.minor(j,i);
					
					if((j+i)%2==0){
						c = c.det();
					}else{
						c = c.det()*-1;
					}
						;
					c /= this.det();
					
					inv.altElement(i,j,c);
				}
			}
		}
		return inv;//this.leftMultiply(inv).val -> [I]
	}



	for(var i=0;i<y;i++){//init
		this.val[i] = new Array();
		for(var j=0;j<x;j++){
			this.val[i][j] = 0;
		}
	}
}
function Identity(dim){//int->Matrix
	Matrix.call(this,dim,dim);
	for(var i = 0;i<dim;i++){
		this.altElement(i,i,1);
	}
}




/*TODO
eigenvalues
eigenvectors
stuff
*/
var n = new Matrix(2,2)
n.construct([[1,2],[3,4]]);

var m = new Matrix(3,3);
m.construct([[1,2,3],[2,3,4],[3,4,5]]);

var q = new Identity(3);

//open question: where does "this" refer to?
