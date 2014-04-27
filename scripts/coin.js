// script for coins, mainly dragdrop, attached to coin GameObjects
// dragdrop referenced from Meepu's script: https://github.com/Improbable-Studios/demo-puzzle-unity/blob/master/DragDrop.js

#pragma strict

public var gravity : float;
public var weight: int;
public var touched: boolean;
public var coin_clip : AudioClip;

private var myRigidBody : Rigidbody2D;
private var myTransform : Transform;
private var myCollider : Collider2D;
private var canMove : boolean;
private var cam : Camera;

function Start () {
	myRigidBody = GetComponent(Rigidbody2D);
	myTransform = GetComponent(Transform);
	myCollider = GetComponent(Collider2D);
	cam = Camera.main;
	canMove = false;
}

function OnCollisionEnter2D(coll:Collision2D){
	// only play sound if mouse is up, in contact with plate or other coins
	var coll_name : String = coll.gameObject.name;
	var coll_tag : String = coll.gameObject.tag;
	if(!Input.GetMouseButton(0) && (coll_name == 'plate_left' || coll_name == 'plate_right' || coll_tag == 'coin')){
		audio.PlayOneShot(coin_clip);
	}
}

function FixedUpdate () {	
	if (!canMove) return;
	
	var mousePos = Input.mousePosition;
	var move = cam.ScreenToWorldPoint(Vector3(mousePos.x,mousePos.y,1)) - myTransform.position;
	
	myRigidBody.transform.Translate(move);
}

function OnMouseDown (){
	canMove = true;
	//disable gravity
	//myRigidBody.gravityScale = 0;
}

function OnMouseUp () {
	canMove = false;
	//enable gravity
	//myRigidBody.gravityScale = gravity;
}

