//change floor and load map
$(document).ready(function() {
    $("#image").change(function() {
        var src = $(this).val();

        $("#map").html(src ? "<object id=\"svg\" type=\"image/svg+xml\" data=\"svg/" + src + "\" width=\"300\" style=\"background-color:white\"></object>" : "");
		
    });
}); 

//parse the svg file
function returnAttributes(at){
var arr=[];
var mySvg=document.getElementById("svg");
var svg=mySvg.getSVGDocument();
var svgRoom=svg.getElementsByTagName('g'), i=0, e;
while(e=svgRoom[i++]){
e[at]?arr[arr.length]=e[at]:null;
}
return arr;
}

//add option
function addOption(selectbox, text, value){
	var gOption = document.createElement('option');
	gOption.text = text;
	gOption.value = value;
	selectbox.options.add(gOption);
}

//add option list
function addOptionList(selectbox){
var allIds=returnAttributes('id');
for(var i=0; i<allIds.length; i++){
	addOption(document.dropList.RoomList, allIds[i], allIds[i]);
}
}

//changes the color of rooms
var old;
function changeColor(){

var selectRoom=document.getElementById("RoomList").value; 

var mySvg=document.getElementById("svg");
	var svg=mySvg.getSVGDocument();
	if(old != null){
	var oldRoom = svg.getElementById(old).childNodes;
	for(var i=0; i<oldRoom.length; i++){
	if(oldRoom[i].nodeName == 'rect'){
		oldRoom[i].setAttribute("fill","none");
	}
	
	}
	}

	var nodes = svg.getElementById(selectRoom).childNodes;
	for(var i=0; i<nodes.length; i++){
		if(nodes[i].nodeName =='rect'){
		nodes[i].setAttribute("fill", "red");
		}
		old = selectRoom;
	}
	
}

//request
$(document).ready(function() {
    $.ajax({
        type: "GET",
        //url: "http://users.metropolia.fi/~huiwend/mediaproject/server/xmlGen.php",
		url: "xmlcoor.xml",
        dataType: "xml",
        success: function(xml) {          
            var items = parseXml(xml);
            addSpot(items);
        },
        error: function(e){
        	console.log(e);
        }
    });
});

//parse XML
function parseXml(xml) {
    var items = [];
    $(xml).find("spot").each(function() {
        items.push({
            xCoord: $(this).find("r_x").text(), 
            yCoord: $(this).find("r_y").text(),
			image: $(this).find("image_link").text(),
			floor: $(this).find("level").text()
        });
    });
    return items;
}

//add spot on svg with the response
function addSpot(items) {

	for(var i=0; i<items.length; i++){

			var svgNS = "http://www.w3.org/2000/svg";
			var xlinkNS = "http://www.w3.org/1999/xlink";
			var mySvg=document.getElementById("svg");
			var svg=mySvg.getSVGDocument();
			var circle = document.createElementNS(svgNS,"circle");
			var rad= 8;
		

			circle.setAttributeNS(null, "cx",''+ (items[i].xCoord - rad) +'');
			circle.setAttributeNS(null, "cy",''+ items[i].yCoord +'');
			circle.setAttributeNS(null, "r","8");
			circle.setAttributeNS(null, "fill","red");
			
			function addClick() {
            alert("hello!");
			}
			
			circle.setAttributeNS(null, "onclick","addClick()");
			
			svg.getElementsByTagName("svg")[0].appendChild(circle);
			
			
			
			
			
	}


}
