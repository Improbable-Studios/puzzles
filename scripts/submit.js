// script run when user submit a coin answer, attached to the petri dish gameobject
/*
	Todo: 
	1. import text message from external files. 
*/
#pragma strict

public var wrong_msgs : String[];
public var success_msg : String;
public var fail_msg : String;
public var attempts : int;
public var coin_drop : AudioClip;

private var master_script: master;
private var coins : GameObject [];

public var coin_in_dish : GameObject;

function Start(){
	master_script = GameObject.Find("puzzle").GetComponent(master);
	coins = GameObject.FindGameObjectsWithTag("coin");
	attempts = 0;
}

function OnCollisionEnter2D(coll:Collision2D){

	if(!Input.GetMouseButton(0)){
		var guess_coin : GameObject = coll.gameObject;
		var boxcol : BoxCollider2D = GetComponent(BoxCollider2D);
			
		audio.PlayOneShot(coin_drop);
		
		// lock input coin to collider
		var target_x : float = boxcol.center.x + transform.position.x;
		var target_y : float = boxcol.center.y + 0.5*boxcol.size.y + transform.position.y;
		guess_coin.GetComponent(Transform).position = Vector2(target_x, target_y);	
		
		coin_in_dish = guess_coin;	
	}
}

function submit_coin(guess_coin : GameObject){	
	Debug.Log("in submit coin!");
	// only work if there's a coin in the dish
	if (guess_coin.GetComponent(BoxCollider2D) == null){
		return;
	}else{
		// set gravity to 0, disable collider
		guess_coin.GetComponent(BoxCollider2D).enabled = false;
		guess_coin.GetComponent(Rigidbody2D).gravityScale = 0;
			
		// display message
		var guess : String = guess_coin.name;
		var answer : String = master_script.answer;
		disable_coins();
		
		if (guess == answer){
			master_script.show_msg = true;
			master_script.msg = success_msg; 
			Debug.Log("correct!");
		}
		else{
			attempts += 1;
			if(attempts < 3){
				master_script.show_dialog = true;
				master_script.dialog_msg = wrong_msgs[attempts-1];
				Debug.Log("wrong!");
			}
			else{
			// failed the puzzle, load QUIT msg
				master_script.show_msg = true;
				master_script.msg = fail_msg;
			}
		}
	}
}

function enable_coins(){

	for (var single_coin in coins){
		single_coin.GetComponent(BoxCollider2D).enabled = true;
		single_coin.GetComponent(Rigidbody2D).gravityScale = 1;
	}
	// enable scale
	master_script.scale_active = true;

}

function disable_coins(){
	// disable collider & gravity in coins after display a msg, so they cannot move
	for (var single_coin in coins){
		single_coin.GetComponent(BoxCollider2D).enabled = false;
		single_coin.GetComponent(Rigidbody2D).gravityScale = 0;
	}
	// disable scale
	master_script.scale_active = false;
}
