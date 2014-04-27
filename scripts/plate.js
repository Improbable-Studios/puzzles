// script for left and right scale plate

#pragma strict

public var move_factor : float;

private var weight: int;
private var coincount: int;
private var in_coins : GameObject[]; // coins currently residing on the plate

private var up: boolean;
private var down: boolean;

function Start(){
	up = false;
	down = false;
}

function count_coins() : int{
	// count coins within the collider and calculates weight
	
	weight = 0;
	coincount = 0;
	var coin_array : Array = new Array();
		
	var coins: GameObject[];
	coins = GameObject.FindGameObjectsWithTag("coin");
	
	// for a coin to be counted: position x within [left, right], position y >= top (due to gravity it will land on plate)
	var plateposition = transform.position;
	var boxcollider = GetComponent(BoxCollider2D);
	var platesize = boxcollider.size;
	var left = plateposition.x - platesize.x;
	var right = plateposition.x + platesize.x;
	var top = plateposition.y + boxcollider.center.y; // conservative
	
	for (var singlecoin in coins){
		var coinposition = singlecoin.GetComponent(Transform).position;
		var coin_collider_size = singlecoin.GetComponent(BoxCollider2D).size;
		var coin_left = coinposition.x - 0.5 * coin_collider_size.x;
		var coin_right = coinposition.x + 0.5 * coin_collider_size.x;
		var coiny = coinposition.y;
		//Debug.Log("name:" + singlecoin.name + "coin_right:" + coin_right + " coin_left:" + coin_left + " left: " + left + " right: " + right + "coiny: " + coiny + "top: " + top);
		if(coin_right >= left && coin_left <= right && coiny >= top){
			weight += singlecoin.GetComponent(coin).weight;
			coincount += 1;
			coin_array.Push(singlecoin);
		}
	}
	
	Debug.Log("coins: " + coincount);
	
	in_coins = coin_array.ToBuiltin(GameObject) as GameObject[];
	
	return weight;
}

// move plates together with coins upon it

function move(vector: Vector3){
	transform.Translate(vector);
	for (var coin in in_coins){
		coin.GetComponent(Transform).Translate(vector);
	}
}

function move_down(){
	var move_length : float = move_factor;
	if(up == true && down == false){ // move 2 factors
		move_length = 2 * move_factor;
	}
	else if(down == true && up == false){ // already down, stay there
		move_length = 0;
	}
	move(Vector3.down * move_length);
	
	up = false;
	down = true;
}

function move_up(){
	var move_length : float = move_factor; 
	if(down == true && up == false){ // move 2 factors
		move_length = 2 * move_factor;
	}
	else if(up == true && down == false){ // already up, stay there
		move_length = 0;
	}
	move(Vector3.up * move_length);
		
	up = true; 
	down = false;
}

function resume_balance(){
	if(down == true && up == false){
		move(Vector3.up * move_factor);
	}
	else if(down == false && up == true){
		move(Vector3.down * move_factor);
	}
	
	up = false;
	down = false;
}
