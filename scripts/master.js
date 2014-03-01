// This is where game-wide codes go: OnGUI, game state checking, attached to background image

/* Todo & bugfix: 
	1. Coin will disappear if dragged below Terrain
	2. Resolution of the submit coin box too low? 

*/
#pragma strict

// normal and special weight must be set to be primary numbers > 12 (total coins)
public var normal_weight: int;
public var special_weight: int;
public var rotate_factor : float; // 1 = 360 degrees 

// message box state
public var display_msg : boolean;
public var message : String;
public var msg_style: GUIStyle;

// name of answer coin
public var answer : String;

private var left_plate:GameObject;
private var right_plate : GameObject;
private var left_plate_script : plate;
private var right_plate_script : plate;
private var check_counter : GameObject;
private var scale_middle : GameObject;
private var all_coins : GameObject[];

// 3 attempts, each attemp can move scale 3 times
private var check_trials : int;
private var submit_trials : int;

function Start () {
	check_trials = 0;
	submit_trials = 0;
	
	display_msg = false;
	
	left_plate = GameObject.Find("plate_left");
	right_plate = GameObject.Find("plate_right");
	left_plate_script = left_plate.GetComponent(plate);
	right_plate_script = right_plate.GetComponent(plate);
	check_counter = GameObject.Find("check_counter");
	scale_middle = GameObject.Find("scale_middle");
	all_coins = GameObject.FindGameObjectsWithTag("coin");
	
	// randomly pick & record answer coin
	var coin_count : int = all_coins.Length;
	var i : int = Mathf.FloorToInt(Random.Range(0f, coin_count * 1.0 - 0.01));
	answer = all_coins[i].name;
	
	for(var j : int = 0; j < coin_count; j++){
		all_coins[j].GetComponent(coin).weight = normal_weight;
	}
	all_coins[i].GetComponent(coin).weight = special_weight;
	
	Debug.Log("correct answer is: " + answer);
	
	// set scale counter to 0
	check_counter.GetComponent(GUIText).text = check_trials.ToString();
}


function OnGUI (){
	// create a CHECK button in scale.
	var check_width : int = 60;
	var check_height : int = 50;
	var check_x = Screen.width/2 - check_width/2;
	var check_y = Screen.height*0.63 - check_height/2;
	
	// message box
	var dbox_width : int = 400;
	var dbox_height : int = 100; 
	var dbox_x : int = Screen.width/2 - dbox_width/2;
	var dbox_y : int = Screen.height/2 - dbox_height/2;
	
	GUI.enabled = true;
	
	// disable check scale weight after 3 attempts. 
	if(check_trials >= 3){
		GUI.enabled = false;
	}
	
	if(GUI.Button(Rect(check_x,check_y,check_width,check_height),"CHECK")){
		// get weight on left and right plate
		
		var left_weight: float = left_plate_script.count_coins();
		var right_weight: float = right_plate_script.count_coins();
		
		Debug.Log("left weight: " + left_weight.ToString() + " right weight: " + right_weight.ToString());
		
		// animate plates and rotate middle	
		if(left_weight < right_weight){
			left_plate_script.move_up();
			right_plate_script.move_down();
			scale_middle.GetComponent(Transform).rotation.z = -1 * rotate_factor;
		}
		else if(left_weight > right_weight){
			left_plate_script.move_down();
			right_plate_script.move_up();
			scale_middle.GetComponent(Transform).rotation.z = rotate_factor;
		}
		else if(left_weight == right_weight){//resume balance position
			left_plate_script.resume_balance();
			right_plate_script.resume_balance();
			scale_middle.GetComponent(Transform).rotation.z = 0;
		}
		
		// add 1 to check_trials and display
		check_trials += 1;
		check_counter.GetComponent(GUIText).text = check_trials.ToString();
	}
	
	GUI.enabled = true;
	
	// message box
	if (display_msg){
		GUI.Box(Rect(dbox_x,dbox_y,dbox_width, dbox_height), message, msg_style);
	}	
}

