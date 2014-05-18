// GUI for puzzle HUD, attached to hud_base game object

#pragma strict

// public variables
public var PUZZLE_NAME : String;

public var title_style: GUIStyle;
public var instrn_style : GUIStyle;
public var btn_styles: GUIStyle[];
public var hp_gray_style: GUIStyle;
public var hp_red_style: GUIStyle;
public var dialog_overlay_style: GUIStyle;
public var dialog_right_style: GUIStyle;
public var final_msg_style : GUIStyle;
public var hint_style: GUIStyle;

// private variables
private var master_script : master;
private var submit_script : submit;

private var sh : float = Screen.height;
private var sw : float = Screen.width;

// title bar
private var title_x : float = 0;
private var title_y : float = 2.67 / 100 * sh;
private var title_w : float = 46.25 / 100 * sw;
private var title_h : float = 10.68 / 100 * sh;

// instructions
private var instrn_w : float = 14.0/100 * sh;
private var instrn_h : float = 14.0/100 * sh;
private var instrn_x : float = sw - instrn_w;
private var instrn_y : float = sh - instrn_h;
private var instrn_on : boolean = false;
public var instrn_text : String;
public var instrn_text_style : GUIStyle;

// right buttons
private var btn_x : float = 90.13 / 100 * sw;
private var btn_y : float = 8.83 / 100 * sh;
private var btn_h : float = (16.67 - 8.83) / 100 * sh;
private var btn_w : float = btn_h;
private var btn_d : float = 1.67 / 100 * sh;
private var btn_clicked : boolean[] = [false,false,false,false,false];

// hp bar
private var hp_x : float = 50.63/100 * sw;
private var hp_y : float = 8.5/100 * sh;
private var hp_w : float = 30.0/100 * sw;
private var hp_h : float = 1.0/100 * sh;

// dialog overlay
private var dialog_overlay_x : float = title_x;
private var dialog_overlay_y : float = title_y + title_h;
private var dialog_overlay_w : float = title_w;
private var dialog_overlay_h : float = 50.0/100 * sh;

// right dialog
private var dialog_right_x : float = 10.0/100 * sw;
private var dialog_right_y : float = 15.5/100 * sh;
private var dialog_right_w : float = 0.75 * dialog_overlay_w;
private var dialog_right_h : float = 20.0/100 * sh;

// memo overlay
private var memo_x : float = dialog_overlay_x;
private var memo_y : float = dialog_overlay_y;
private var memo_w : float = 0.85 * sw;
private var memo_h : float = 0.85 * sh;
private var memo_on : boolean = false;

// hint
private var hint_x : float = 0.50 * sw;
private var hint_y : float = 0.10 * sh;
private var hint_w : float = 0.38 * sw;
private var hint_h : float = 0.50 * sh;
private var hint_on : boolean = false;
private var hint_count : int;

private var hint_msgs : String[] = new String[3];
hint_msgs[0] = "\n\n\n  You might try placing four coins on \n   each side to see if the weight balances \n  or not. If it does, you can be assured \n   that the counterfeit coin is among \n   those not on the scale. ";
hint_msgs[1] = "\n\n\n  Now, same trick as last time. If the \n  scale tips one way when you place the \n  eight coins, remove one set of four and \n  replace them with the four unweighted \n  coins.";
hint_msgs[2] = "\n\n\n  Repeat the first two steps. Now, if \n  the weight stays level, you know the \n  fraudulent coin is within the four coins \n  you removed from the scale. If it tips \n  in the same direction, it is clear the \n   coin is from the original four you \n  weighed. And, if it tips in the other \n  direction from before, you know the \n  fake coin is in the group of four you \n   placed during your second move.";

// button enabled booleans
private var btn_instrn_enabled : boolean = true;
private var btn_right_enabled : boolean[] = [true,true,true,true,true];//hint, memo, reset, quit, submit
private var game_paused : boolean = false;

// for hovering
public var mouseover_styles : GUIStyle[];
private var mouseover_x : float = 0.80 * sw;
private var mouseover_y : float = 9.5 / 100 * sh;
private var mouseover_w : float = 0.1 * sw;
private var mouseover_h : float = 0.06 * sh;
private var tooltip : int = 5;


function Start(){
	master_script = GameObject.Find("puzzle").GetComponent(master);
	submit_script = GameObject.Find("submit_coin").GetComponent(submit);
	
	memo_on = false;
	instrn_on = false;
	hint_on = false;
	
	hint_count = 0;
	tooltip = 5;
	
}

function disable_all_btns(){
	btn_instrn_enabled = false;
	btn_right_enabled = [false,false,false,false,false];
}

function enable_all_btns(){
	btn_instrn_enabled = true;
	btn_right_enabled = [true,true,true,true,true];
}

function OnGUI(){

	// controls go first
	if(memo_on){ // memo on
		master_script.game_pause();
		game_paused = true;
		btn_instrn_enabled = false;
		btn_right_enabled = [false, true, false, false, false];
		
		GUI.Box(Rect(memo_x, memo_y, memo_w, memo_h), "", dialog_overlay_style);
	
	}else if(hint_on){ // hint on, display last hint msg if unlocked all hints
		master_script.game_pause();
		game_paused = true;
		btn_instrn_enabled = false;
		btn_right_enabled = [true, false, false, false, false];
			
		GUI.Box(Rect(hint_x, hint_y, hint_w, hint_h), hint_msgs[Mathf.Min(2, hint_count-1)], hint_style);
	
	}else if (instrn_on){ // instruction on
		master_script.game_pause();
		game_paused = true;
		btn_right_enabled = [false, false, false, false, false];
		
		GUI.Box(Rect(dialog_overlay_x, dialog_overlay_y, dialog_overlay_w, dialog_overlay_h), "", dialog_overlay_style);
		var shrink_factor : float = 0.05 * dialog_overlay_w;
		GUI.Label(Rect(shrink_factor, dialog_overlay_y + shrink_factor, dialog_overlay_w - 2*shrink_factor, dialog_overlay_h - 2*shrink_factor), instrn_text, instrn_text_style);
		
		if(Input.GetKeyUp(KeyCode.Return)){
			instrn_on = false;
		}
	}else if(master_script.show_dialog){ // wrong dialogue
		master_script.game_pause();
		game_paused = true;
		disable_all_btns();
		
		GUI.Box(Rect(dialog_overlay_x, dialog_overlay_y, dialog_overlay_w, dialog_overlay_h), "", dialog_overlay_style);
		GUI.Label(Rect(dialog_right_x, dialog_right_y, dialog_right_w, dialog_right_h), master_script.dialog_msg, dialog_right_style);
		// click enter or screen to trigger reset_game
		if(Input.GetKeyUp(KeyCode.Return) || Input.GetMouseButtonDown(0)){
			master_script.reset_game();
		}
	
	}else if(master_script.show_msg){ // final msg, placeholder for now
		master_script.game_pause();
		game_paused = true;
		disable_all_btns();
		
		GUI.Label(Rect(0.2*sw, 0.3*sh, 0.4*sw, 0.2*sh), master_script.msg, final_msg_style);
	
	}else{
		if(game_paused){
			master_script.game_resume();
			game_paused = false;
			enable_all_btns();
		}
	}
	
	
	// title bar
	GUI.Label(Rect(title_x,title_y,title_w,title_h), PUZZLE_NAME, title_style);
	
	// instructions
	if(GUI.Button(Rect(instrn_x, instrn_y, instrn_w, instrn_h), "", instrn_style) && btn_instrn_enabled){
		instrn_on = !instrn_on;
	}
	
	// right buttons
	for (var i : int = 0; i < btn_styles.Length; i++){
		GUI.enabled = btn_right_enabled[i];
		var rect = new Rect(btn_x, btn_y + i*(btn_d+btn_h), btn_w, btn_h);
		if(rect.Contains(Event.current.mousePosition)){ // activate tooltips, do not clash with button click
			tooltip = i;
		}
		if(GUI.Button(rect, "", btn_styles[i])){
			btn_clicked = [false,false,false,false,false];
			btn_clicked[i] = true;
			if(i == 0){
				// hint button
				if (!hint_on){
					hint_count += 1;
				}
				hint_on = !hint_on;
			}
			else if(i == 4){
				// submit solution
				//master_script.game_pause();
				//disable_all_btns();
				submit_script.submit_coin(submit_script.coin_in_dish);
			}
			else if(i == 2){
				// reset button
				master_script.reset_coins();
			}
			else if(i == 1){ 
				memo_on = !memo_on;
			}
			Debug.Log("pressed: " + i);
		}
	}
	
	// TODO: right now tooltips are shaded, can we make it hidden? 
	if((tooltip == 0 && !hint_on) || (tooltip == 1 && !memo_on)){
		GUI.Label(Rect(mouseover_x, mouseover_y + tooltip*(btn_d+btn_h), mouseover_w, mouseover_h), "", mouseover_styles[tooltip]);	
	}else if(tooltip < 5){
		GUI.Label(Rect(mouseover_x, mouseover_y + tooltip*(btn_d+btn_h), mouseover_w, mouseover_h), "", mouseover_styles[tooltip]);		
	}
	
	
	GUI.enabled = true;
	// grey hp bar
	GUI.Label(Rect(hp_x, hp_y, hp_w, hp_h), "", hp_gray_style);
	
	// red hp bar
	var trials : int = submit_script.attempts;
	GUI.Label(Rect(hp_x + hp_w*trials/3.0, hp_y, hp_w * (1-trials/3.0), hp_h), "", hp_red_style);
		
}