// This is where game-wide codes go: OnGUI, game state checking, game rest, attached to background image

#pragma strict

/******* PUZZLE SPECIFIC CODE **********/

// normal and special weight must be set to be primary numbers > 12 (total coins)
public var normal_weight: int;
public var special_weight: int;
public var rotate_factor : float; // 1 = 360 degrees 

// coin positions & scale
private var coin_x : float = -6.0;
private var coin_y : float = -3.0;
private var coin_d : float = 1.0;
private var coin_scale : float = 2.5;

// GUI and sound fields
public var show_dialog : boolean;
public var dialog_msg : String;
public var show_msg : boolean;
public var msg : String;
public var coin_jingle : AudioClip;
public var scale_mvmt : AudioClip;
public var scale_btn_style : GUIStyle;
public var label_trial_style : GUIStyle;

// name of answer coin
public var answer : String;

private var left_plate:GameObject;
private var right_plate : GameObject;
private var left_plate_script : plate;
private var right_plate_script : plate;
private var check_counter : GameObject;
private var scale_middle : GameObject;
private var all_coins : GameObject[];

private var sw : float = Screen.width;
private var sh : float = Screen.height;

// 3 check scale attempts
private var scale_checks : int;

function Start(){
	reset_game();
}

function reset_game () {
	// play coin jingle sound
	audio.PlayOneShot(coin_jingle);
	
	
	scale_checks = 0;	
	show_dialog = false;
	show_msg = false;
	
	left_plate = GameObject.Find("plate_left");
	right_plate = GameObject.Find("plate_right");
	left_plate_script = left_plate.GetComponent(plate);
	right_plate_script = right_plate.GetComponent(plate);
	check_counter = GameObject.Find("check_counter");
	scale_middle = GameObject.Find("scale_middle");
	all_coins = GameObject.FindGameObjectsWithTag("coin");
	
	var coin_count : int = all_coins.Length;
	
	var j : int;
	
	// put coins to place, enable gravity
	for(j = 0; j < coin_count; j++){
		var scoin : GameObject = all_coins[j];
		scoin.transform.localPosition.x = coin_x + j*coin_d;
		scoin.transform.localPosition.y = coin_y;
		scoin.transform.localScale.x = coin_scale;
		scoin.transform.localScale.y = coin_scale;
		scoin.GetComponent(BoxCollider2D).enabled = true;
		scoin.GetComponent(Rigidbody2D).gravityScale = 1;
	}
	
	
	// randomly pick & record answer coin
	var i : int = Mathf.FloorToInt(Random.Range(0f, coin_count * 1.0 - 0.01));
	answer = all_coins[i].name;
	
	for(j = 0; j < coin_count; j++){
		all_coins[j].GetComponent(coin).weight = normal_weight;
	}
	all_coins[i].GetComponent(coin).weight = special_weight;
	
	Debug.Log("correct answer is: " + answer);
	
	// set scale counter to 0
	check_counter.GetComponent(GUIText).text = scale_checks.ToString();
}


function OnGUI (){
	// create a CHECK button in scale.
	var check_x : float = 0.42 * sw;
	var check_y : float = 0.625 * sh;
	var check_w : float = 0.05 * sw;
	var check_h : float = 0.05 * sh;
	
	var label_x : float = 0.48 * sw;
	var label_y : float = check_y;
	var label_w : float = 0.03 * sw;
	var label_h : float = label_w;
		
	if(GUI.Button(Rect(check_x,check_y,check_w,check_h),"", scale_btn_style)){
		if(scale_checks < 3){
			click_scale();
		}
	}
	
	GUI.Label(Rect(label_x, label_y, label_w, label_h), scale_checks.ToString(), label_trial_style);
	
}

function click_scale(){
	// play scale mvmt sound
	audio.PlayOneShot(scale_mvmt);
	
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
	
	// add 1 to scale_checks and display
	scale_checks += 1;
	
}

