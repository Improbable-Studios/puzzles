// script run when user submit a coin answer, attached to the petri dish gameobject
/*
	Todo: 
	1. import text message from external files. 
*/
#pragma strict

private var master_script: master;

private var success_msg : String; 
private var fail_msg : String; 

private var coins : GameObject [];

function Start(){
	master_script = GameObject.Find("wallpaper").GetComponent(master);
	success_msg = "Very good, John. You’ve correctly identified the counterfeit coin in just three moves. Most impressive, for someone of your level.";
	fail_msg = "No, nevermind, John. I’ll just finish this myself. ";
	coins = GameObject.FindGameObjectsWithTag("coin");
}

function OnCollisionEnter2D(coll:Collision2D){

	if(!Input.GetMouseButton(0)){
		var guess_coin : GameObject = coll.gameObject;
		var boxcol : BoxCollider2D = GetComponent(BoxCollider2D);
				
		// set gravity to 0, disable collider
		guess_coin.GetComponent(BoxCollider2D).enabled = false;
		guess_coin.GetComponent(Rigidbody2D).gravityScale = 0;
		
		// lock input coin to collider
		var target_x : float = boxcol.center.x + transform.position.x;
		var target_y : float = boxcol.center.y + 0.5*boxcol.size.y + transform.position.y;
		guess_coin.GetComponent(Transform).position = Vector2(target_x, target_y);		
					
		// display message													
		var guess : String = guess_coin.name;
		var answer : String = master_script.answer;
		if (guess == answer){
			master_script.display_msg = true;
			master_script.message = success_msg; 
			disable_coins();
			
			Debug.Log("correct!");
		}
		else{
			master_script.display_msg = true;
			master_script.message = fail_msg;
			disable_coins();
			
			Debug.Log("wrong!");
			// reset game for another attempt
			reset_game();
		}
	}
}

function disable_coins(){
	// disable collider & gravity in coins after display a msg, so they cannot move
	for (var single_coin in coins){
		single_coin.GetComponent(BoxCollider2D).enabled = false;
		single_coin.GetComponent(Rigidbody2D).gravityScale = 0;
	}
}

function reset_game(){
	// disable message
	
	// enable gravity and colliders
	

}