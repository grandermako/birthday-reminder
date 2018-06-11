var db = openDatabase('brdb', '1.0', 'Birthday Reminder database', 2 * 1024 * 1024); 
var msg = ""; 
db.transaction(function(tx)
{
	tx.executeSql('CREATE TABLE IF NOT EXISTS LIST (id integer primary key autoincrement, personName text, personSurname text, personDate datatime)'); 
	//tx.executeSql('DELETE FROM LIST WHERE id=1');
})
function reloadList()
{
	db.transaction(function (tx) { 
	tx.executeSql('SELECT * FROM LIST', [], function (tx, results) { 
	console.log(results);
	var len = results.rows.length, i, number;
	var msg = "";
	var div, content, contentHTML, p;
	if(len > 0)
	{
		msg = "";
		document.querySelector('#status').innerHTML =  msg;
		div = document.createElement("div");
		div.className = "scrollListY";
		document.getElementById("status").appendChild(div);
	}
	for (i = 0; i < len; i++) {
		number = i+1;
		msg =  number + ". " + 
		results.rows.item(i).personName + " " + 
		results.rows.item(i).personSurname + " " +
		results.rows.item(i).personDate;
		p = document.createElement("p");
		if( number%2 == 0)
			p.className = "diffrentColor";
		content = document.createTextNode(msg);
		p.appendChild(content);
		div.appendChild(p);

	}
	if(len > 0)
	{	
		msg = "<p>The number of people in the database: <b>" + len + "</b></p>"; 
		document.querySelector('#status').innerHTML +=  msg; 
	}
	}, null); 
	}); 
}
//DO ZROBIENIA FUNKCJA OBSLUGUJACA WSTAWIANIE DO LISTY I USUWANIE
function listToDelete()
{
	db.transaction(function (tx) { 
	tx.executeSql('SELECT * FROM LIST', [], function (tx, results) { 
	var len = results.rows.length, i;
	var newOption, newOptionText;
	var constSelect = document.getElementById("listSelect");
	constSelect.options.length = 0;
	if(len > 0)
	{
		msg = "";
		document.querySelector('#status').innerHTML =  msg;
	}
	for (i = 0; i < len; i++) { 
	msg = results.rows.item(i).personName + " " + 
	results.rows.item(i).personSurname + " " +
	results.rows.item(i).personDate;  
	newOption = document.createElement('option');
	newOption.setAttribute("value", results.rows.item(i).id);
	newOptionText = document.createTextNode(msg); 
	newOption.appendChild(newOptionText);  
	constSelect.appendChild(newOption);
	
	} 
	if(len > 0)
	{	
		msg = "<p>The number of people in the database: <b>" + len + "</b></p>"; 
		document.querySelector('#status').innerHTML +=  msg; 
	}
	}, null); 
	}); 
}
function addNewPerson()
{
	let newName = document.forms["addNewPerson"]["name"].value;
	let newSurname = document.forms["addNewPerson"]["surname"].value;
	let newDate = document.forms["addNewPerson"]["bday"].value;
	db.transaction(function (tx) 
	{   
	tx.executeSql('INSERT INTO LIST (personName, personSurname, personDate) VALUES (?,?,?)', [newName, newSurname, newDate]); 
	});
}
function removePerson()
{
	var valToRem = document.getElementById('listSelect').value;
	db.transaction(function (tx) 
	{   
		tx.executeSql('DELETE FROM LIST WHERE id =  ?', [valToRem]); 
	});
}
function daysLeft()
{
	let today = new Date();
	let year = today.getFullYear();	
	let daysLeft, date;
	let msg = "";
	let arr = [];
	document.querySelector('#statusLeft').innerHTML =  msg;
	db.transaction(function (tx) { 
	tx.executeSql('SELECT * FROM LIST', [], function (tx, results) { 
	let len = results.rows.length, i;
	for (i = 0; i < len; i++) { 
	date = new Date(results.rows.item(i).personDate);
	date.setFullYear(year);
	date.setHours(0);
	daysLeft = Math.floor((date - today)/(1000 * 60 * 60 * 24))+1;
	if(daysLeft < 0 )
	{
		date.setFullYear(year+1);
		daysLeft = Math.floor((date - today)/(1000 * 60 * 60 * 24))+1;
	}
	/*msg = "<p>" + results.rows.item(i).personName + " " + 
	results.rows.item(i).personSurname + " " +
	daysLeft + " days</p>";*/
	arr.push({
        key: results.rows.item(i).id,
        name: results.rows.item(i).personName,
        surname: results.rows.item(i).personSurname,
		days: daysLeft
    });
	}
	arr.sort(function(a,b){return (a.days > b.days) ? 1 : ((b.days > a.days) ? -1 : 0);});
	for (i = 0; i < arr.length; i++) {
		msg = "<p>" + arr[i].name + " " + 
		arr[i].surname;
		msg += " <b>";
		if( arr[i].days <= 3 )
			msg += '<span class="danger">' + arr[i].days + '</span>';
		else if ( arr[i].days <= 10)
			msg += '<span class="warning">' + arr[i].days + '</span>';
		else
			msg += arr[i].days 
		if (arr[i].days === 1)
			msg += "</b> day</p>";
		else
			msg += "</b> days</p>";
		document.querySelector('#statusLeft').innerHTML +=  msg; 
		if (i === 10)
			break;
	}
	}, null); 
	}); 
}
function openPage(pageName,element) {
    var i, tabcontent, link;
    tabcontent = document.getElementsByClassName("action");
    link = document.getElementsByClassName("link");
    for (i = 0; i < tabcontent.length; i++) 
	{
        tabcontent[i].style.display = "none";
    }
	for (i = 0; i < tabcontent.length; i++) //without registration
	{
			link[i].classList.remove("active");
	}
	element.classList.add("active");
	document.getElementById(pageName).style.display = "block";
}
// Get the element with id="defaultOpen" and click on it
//document.getElementById("defaultOpen").click();
reloadList();
document.getElementById("show").style.display = "block";
document.getElementById("defaultOpen").classList.add("active");
document.addEventListener('DOMContentLoaded', function() {
    var add = document.getElementById('addLink');
	var del = document.getElementById('delLink');
	var show = document.getElementById('defaultOpen');
	var info = document.getElementById('infoLink');
	var panel = document.getElementById('panelLink');
	var aNP = document.getElementById('addNP');
	var rP = document.getElementById('removeP');
    add.addEventListener('click', function() {
        openPage('add',this);
    });
	del.addEventListener('click', function() {
        openPage('delete', this);
		listToDelete();
    });
	show.addEventListener('click', function() {
        openPage('show', this);
		reloadList();
    });	
	info.addEventListener('click', function() {
        openPage('info', this);
    });	
	panel.addEventListener('click', function() {
		openPage('panel', this);
		daysLeft();
    });
	aNP.addEventListener('click', function() {
		addNewPerson();
    });
	rP.addEventListener('click', function() {
		removePerson();
    });
	
});