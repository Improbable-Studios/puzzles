// script for coins, mainly dragdrop, attached to coin GameObjects
// dragdrop referenced from Meepu's script: https://github.com/Improbable-Studios/demo-puzzle-unity/blob/master/DragDrop.js

#pragma strict

public var gravity : float;
public var weight: int;
public var touched: boolean;

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

