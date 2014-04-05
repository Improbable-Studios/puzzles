// GUI for puzzle HUD, attached to hud_base game object

#pragma strict

public var PUZZLE_NAME : String;

public var title_style: GUIStyle;
public var btn_styles: GUIStyle[];
public var hp_gray_style: GUIStyle;
public var hp_red_style: GUIStyle;
public var dialog_overlay_style: GUIStyle;
public var dialog_right_style: GUIStyle;
public var final_msg_style : GUIStyle;

// private variables start here
private var master_script : master;
private var submit_script : submit;

private var sh : float = Screen.height;
private var sw : float = Screen.width;

// title bar
private var title_x : float = 0;
private var title_y : float = 2.67 / 100 * sh;
private var title_w : float = 46.25 / 100 * sw;
private var title_h : float = 10.68 / 100 * sh;

// right buttons
private var btn_x : float = 90.13 / 100 * sw;
private var btn_y : float = 8.83 / 100 * sh;
private var btn_h : float = (16.67 - 8.83) / 100 * sh;
private var btn_w : float = btn_h;
private var btn_d : float = 1.67 / 100 * sh;

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

function Start(){
	master_script = GameObject.Find("puzzle").GetComponent(master);
	submit_script = GameObject.Find("submit_coin").GetComponent(submit);
}

function OnGUI(){
	
	// title bar
	GUI.Label(Rect(title_x,title_y,title_w,title_h), PUZZLE_NAME, title_style);
	
	// right buttons
	for (var i : int = 0; i < btn_styles.Length; i++){
		if(GUI.Button(Rect(btn_x, btn_y + i*(btn_d+btn_h), btn_w, btn_h), "", btn_styles[i])){
			Debug.Log("pressed: " + i);
		}
	}
	
	// grey hp bar
	GUI.Label(Rect(hp_x, hp_y, hp_w, hp_h), "", hp_gray_style);
	
	// red hp bar
	var trials : int = submit_script.attempts;
	GUI.Label(Rect(hp_x + hp_w*trials/3.0, hp_y, hp_w * (1-trials/3.0), hp_h), "", hp_red_style);
	
	// dialog
	if (master_script.show_dialog){
		GUI.Box(Rect(dialog_overlay_x, dialog_overlay_y, dialog_overlay_w, dialog_overlay_h), "", dialog_overlay_style);
		GUI.Label(Rect(dialog_right_x, dialog_right_y, dialog_right_w, dialog_right_h), master_script.dialog_msg, dialog_right_style);
		// ok button
		if(GUI.Button(Rect(dialog_overlay_x, dialog_overlay_y + 0.8*dialog_overlay_h, 0.4*dialog_overlay_w, 0.2*dialog_overlay_h), "Try again")){
			master_script.reset_game();
		}
	}
	
	// final msg, placeholder for now
	if (master_script.show_msg){
		GUI.Label(Rect(0.2*sw, 0.3*sh, 0.4*sw, 0.2*sh), master_script.msg, final_msg_style);
	}
	
}