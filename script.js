let settings;
let max = 20;
function sendApiRequest(){
	document.getElementById('messageNoRecipe').style.display="none";
	document.getElementById('message-div').style.display="block";
	for(let i = 0; i < 20; i++){
		document.getElementById("card"+i).innerHTML ="";
	}
	let search = document.getElementById('name').value;
	 settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&tags=under_30_minutes&q="+search,
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "dabff304b8msh4569fb9bb63cb8fp129fccjsn7057920dad6b",
			"x-rapidapi-host": "tasty.p.rapidapi.com"
		}
	};
	
	$.ajax(settings).done(function (response) {
		console.log(response);
		max = 20;
		document.getElementById('message-div').style.display="none";
		
		
		
		if(response.results.length <= 10){
			max = response.results.length;
			document.getElementById('paging').style.display="none";
		}else{
			document.getElementById('paging').style.display="flex";
		}
		if(max == 0){
			document.getElementById('messageNoRecipe').style.display="block";
			document.getElementById('messageNoRecipe').innerHTML = "<img src='./emoji-frown.svg' id='sad-emoji'><h3 id='heading'>No Result Found...</h3>";
			return;
		}
		document.getElementById('cards').style.display = "flex";
		console.log("max"+ max);
		console.log(response.results.length);
		let score = 0;
		for(let i = 0; i < max; i++){
			
			let scoreHtml = "", description = "";
			console.log(response.results[i].user_ratings);
			if(response.results[i].user_ratings === undefined){
				score = 0;
			}else{
				score = Math.round(response.results[i].user_ratings.score * 5); 
				console.log(score);
			}
			for(let j=0; j < score; j++){
				scoreHtml += '<span class="fa fa-star checked"></span>';
			}
			for(let k=0; k < 5-score; k++){
				scoreHtml += '<span class="fa fa-star "></span>';
			}
			if(response.results[i].description != null){
				description = response.results[i].description;
			}
			document.getElementById("card"+i).innerHTML = 
			'<img src="'+response.results[i].thumbnail_url+'" class="card-img-top" alt="...">'+
		  	'<div class="card-body" >'+
			  '<h5 class="card-title">'+response.results[i].name+'</h5>'+
			  '<p class="card-text">'+description+'</p>'+
			  '<a href="#" onclick="getRecipe('+i+')" class="btn btn-primary">Get Recipe</a>'+
			  '<div id="star">'+scoreHtml+'</div>'+
			'</div>'+
		  '</div>';
		  
		}
		
		console.log("max"+ max);
		console.log(response.results.length);
		firstPage();
		
	});
}


function firstPage(){
	for(let i = 0; i < 10; i++){
		if(document.getElementById('card'+i).innerHTML != ""){
			document.getElementById('card'+i).style.display="block";
		}
		
	}
	for(let i = 10; i < max; i++){
		document.getElementById('card'+i).style.display="none";
	}
}
function secondPage(){
	for(let i = 0; i < 10; i++){
		document.getElementById('card'+i).style.display="none";
	}
	for(let i = 10; i < max; i++){
		document.getElementById('card'+i).style.display="flex";
	}
}
var calories = 0,carbohydrates = 0,fat = 0,fiber = 0,protein = 0,sugar = 0, len = 0;
function getRecipe(i){
	
	document.getElementById('cards').style.display ="none";
	document.getElementById('paging').style.display ="none";
	document.getElementById('message-div').style.display="block";
	
	$.ajax(settings).done(function (response) {
	 console.log(response);
	 len = response.results.length;
	 document.getElementById('message-div').style.display="none";
	 document.getElementById('recipe-div').style.display ="block";
	 if(response.results[i].nutrition != undefined){
		calories = response.results[i].nutrition.calories;
		carbohydrates = response.results[i].nutrition.carbohydrates;
		fat = response.results[i].nutrition.fat;
		fiber = response.results[i].nutrition.fiber;
		protein = response.results[i].nutrition.protein;
		sugar = response.results[i].nutrition.sugar;
	 }
	 
	 
	
	 document.getElementById('recipe-div').innerHTML = '<div id="container"><button id = "x" onclick="closeRecipe()">'+
		 '<img src="./x-lg.svg"></button>'+
	 '<div id="image-div"><img id="image" src="'+response.results[i].thumbnail_url+'">'+
	 '<div id="piechart"></div></div>'+
	 '<div class="recipe-inst">'+
		 
		 '<h3 id="heading-recipe">'+response.results[i].name+'</h3>'+
		 '<ul>'+
		 '<p id="instruction"><ul id="list"></ul></p>'+
	 '</div>'+ 
' </div>';
		getChart();
	for(let i =0; i < response.results[i].instructions.length ; i++){
		var node = document.createElement("LI");
		if(response.results[i].instructions[i].display_text === undefined){
			continue;
		}else{
			var textnode = document.createTextNode(response.results[i].instructions[i].display_text);
			node.appendChild(textnode);
			document.getElementById("list").appendChild(node);
		}
		
	}

	 
	});

	
}
function closeRecipe(){
	console.log('hello');
	document.getElementById('recipe-div').style.display ="none";
	document.getElementById('cards').style.display ="flex";
	if(len <= 10){
		document.getElementById('paging').style.display="none";
	}else{
		document.getElementById('paging').style.display="flex";
	}
}

function drawChart() {
  var data = google.visualization.arrayToDataTable([
  ['Nutrients', 'Value'],
  ['Calories', calories],
  ['Carbohydrates', carbohydrates],
  ['Fat', fat],
  ['Sugar', sugar],
  ['Protein', protein],
  ['Fiber', fiber]
]);

  var options = {'title':'Nutrients', 'width':300, 'height':300};
  var chart = new google.visualization.PieChart(document.getElementById('piechart'));
  chart.draw(data, options);
}

function getChart(){
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);
}

