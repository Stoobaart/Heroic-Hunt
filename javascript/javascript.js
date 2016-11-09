var findValue = function(name, spec){
		return $("#"+name).find("#"+spec+" span").text()
	}

var alertMessage = function(message){
	$("#alertMessage").text(message);
}

var alertPlayerTurn = function(message){
	$("#alertPlayerTurn").text(message);
}


$(function() {
var theme = document.getElementById("theme");
var battle = document.getElementById("battle");
var hit = document.getElementById("hit");
var block = document.getElementById("block");
var select = document.getElementById("select");
var draw = document.getElementById("draw");
window.onload = function(){
	theme.play();
}
function playTheme(){
	theme.play();
}
function pauseTheme(){
	theme.pause();
}
function playBattle(){
	battle.play();
}
function pauseBattle(){
	battle.pause();
}
function playHit(){
	hit.play();
}
function playBlock(){
	block.play();
}
function playSelect(){
	select.play();
}
function playDraw(){
	draw.play();
}

	$("#characterSelect, #battle-arena, #start-button").hide();

	//add character objects into the character selection pane
  var charactersSource = $("#displayCharacters").html();
  var charSelectTemplate = Handlebars.compile(charactersSource);
  $("#characterSelectScreen").append(charSelectTemplate({heroicHunters: window.characters}));
  $("#characterPanel").hide();

  $("#fight").on("click", function() {
  	playSelect();
  	$("h1, #startArea, #p2").hide();
		$("#characterPanel, #characterSelect").toggle();
		alertMessage("Player 1 choose your character");
  });

	$("#charList").on("click", ".select-character", function() {
		playSelect();
		var playerNumber = $(this).attr('id');

		specs = ["health", "attack", "defence", "block", "potions"];

		var name = $(this).data("character-name");
		var thumbnail = $(this).closest(".characterPanes").find("img").attr("src")
		//add an img tag to the 
		if(playerNumber == "p1"){
			$("#p1-thumbnail").append('<img src=' +thumbnail+ '>');
		} else if(playerNumber == "p2") {
			$("#p2-thumbnail").append('<img src=' +thumbnail+ '>');
		}
		//using playerNumber and the var thumbnail above, try to insert an image in
		// either p1-thumbnail or p2-thumbnail 


		$("#" + playerNumber + "-name").append(name);


		for(var i =0; i < specs.length; i++){
			var value = findValue(name, specs[i]);
			$("#" + playerNumber + "-" + specs[i]).append(specs[i] + ": " + "<span id='value'>" + value + "</span>");
		}
		if(playerNumber == "p1"){
			message = "Player1 has picked " + name + ", Player 2 choose your character"
		}
		alertMessage(message);
		
		if(playerNumber == "p2"){
			alertMessage("Player2 has picked " + name + ", FIGHT!")
			$("#start-button").toggle();
		}
		$("button#p1").remove();
		$("button#p2").toggle();
  });


$("#start-button").on("click", function() {
	pauseTheme();
	playBattle();
	$("#characterSelect h2").html("Battle");
	$("#charList").slideUp();
	$("#battle-arena").toggle();
	$("#return").hide();
	$("#start-button").remove();
	alertMessage("Start the Fight!");


//Game Engine!

var p1health = ($("#p1-health span").text());
var p2health = ($("#p2-health span").text());
var p1AttackStat = ($("#p1-attack span").text());
var p1DefendStat = ($("#p1-block span").text());
var p1Potions = ($("#p1-potions span").text());
var p2AttackStat = ($("#p2-attack span").text());
var p2DefendStat= ($("#p2-block span").text());
var p2Potions = ($("#p2-potions span").text());
var p1DefVal = 0;
var p2DefVal = 0;
var round = 0;

deathCheck = function(){
		if(($("#p1-health span").text()) <= 0) {
			alertMessage("Player 2 WINS!");
			$("#p1attack, #p1defend, #p2attack, #p2defend, #start-round, #alertPlayerTurn, #p1potion, #p2potion").remove();
			$("#return").toggle();
			} else if(($("#p2-health span").text()) <= 0) {
				alertMessage("Player 1 WINS!");
				$("#p1attack, #p1defend, #p1potion, #p2attack, #p2defend, #p2potion, #start-round, #alertPlayerTurn").remove();
				$("#return").toggle();
				}
	}
buttonsHide = function() {
	$("button#p1attack, button#p1defend, button#p1potion, button#p2attack, button#p2defend, button#p2potion").hide();
}
buttonsToggle = function() {
		$("button#p1attack, button#p1defend, button#p1potion, button#p2attack, button#p2defend, button#p2potion").toggle();
}

buttonsHide();

$("#start-round").on("click", function(){
	playDraw();
	round += 1;
	alertMessage("Round " +round+ "!");

	$("button#p1attack, button#p1defend, button#p1potion").toggle();
	$("#start-round").toggle();
	alertPlayerTurn("Player 1's turn");
})

$("button#p1attack").on("click", function() {
	var p1AttackVal = Math.round((Math.random() * parseInt(p1AttackStat))/(0.05 * (parseInt($("#p2-defence span").text()))));
	var finalP1AttackVal = p1AttackVal - p2DefVal;
	if(finalP1AttackVal < 0) {
		var attack = 0;
		alertMessage("Player 2 blocked your full attack!");
		playBlock();
	} else {
		var attack = finalP1AttackVal;
		alertMessage("Player one attacks for " +attack+ " points of damage (Player 2 blocked " +p2DefVal+ " points)");
	}
	var currentP2Health = parseInt($("#p2-health span").text());
	var changeP2Health = currentP2Health - attack;
	p1DefVal = 0;

	$("#p2-health span").html(changeP2Health).text();
	deathCheck();

	buttonsToggle();
	alertPlayerTurn("Player 2's turn");
	playHit();
})

$("button#p2attack").on("click", function() {
	var p2AttackVal = Math.round((Math.random() * parseInt(p1AttackStat))/(0.05 * (parseInt($("#p1-defence span").text()))));
	var finalP2AttackVal = p2AttackVal - p1DefVal;
	if(finalP2AttackVal < 0) {
		var attackP2 = 0;
		alertMessage("Player 1 blocked your full attack!");
		playBlock();
	} else {
		var attackP2 = finalP2AttackVal;
		alertMessage("Player two attacks for " +attackP2+ " points of damage (Player one blocked " +p1DefVal+ " points)");
	}
	var currentP1Health = parseInt($("#p1-health span").text());
	var changeP1Health = currentP1Health - attackP2;
	p2DefVal = 0;

	$("#p1-health span").html(changeP1Health).text();
	deathCheck();

	buttonsHide();
	$("#start-round").toggle();
	alertPlayerTurn("Player 1's turn");
	playHit();
})




$("button#p2defend").on("click", function() {
	p2DefVal = Math.round(Math.random() * parseInt(p2DefendStat));
	alertMessage("Player two raises defences!");

	buttonsHide();
	$("#start-round").toggle();
	playBlock();
})

$("button#p1defend").on("click", function() {
	p1DefVal = Math.round(Math.random() * parseInt(p1DefendStat));
	alertMessage("Player one raises defences!");

	buttonsToggle();
	alertPlayerTurn("Player 2's turn");
	playBlock();
})

$("button#p1potion").on("click", function() {
	if (p1Potions > 0) {
		var currentP1Health = parseInt($("#p1-health span").text());
		var p1healthAdd = currentP1Health + 30;
		p1health = p1healthAdd;
		$("#p1-health span").html(p1health);
		var newp1Potions = parseInt(p1Potions) - 1;
		p1Potions = newp1Potions;
		$("#p1-potions span").html(p1Potions);
		buttonsToggle();
	}else{
		alertMessage("No potions left, choose another action");
	}
})

$("button#p2potion").on("click", function() {
	if (p2Potions > 0) {
		var currentP2Health = parseInt($("#p2-health span").text());
		var p2healthAdd = currentP2Health + 30;
		p2health = p2healthAdd;
		$("#p2-health span").html(p2health);
		var newp2Potions = parseInt(p2Potions) - 1;
		p2Potions = newp2Potions;
		$("#p2-potions span").html(p2Potions);
		buttonsHide();
		$("#start-round").toggle();
	}else{
		alertMessage("No potions left, choose another action");
	}
})





})




});
















