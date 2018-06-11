var dbback = openDatabase('brdb', '1.0', 'Birthday Reminder database', 2 * 1024 * 1024); 
dbback.transaction(function(tx)
{
	tx.executeSql('CREATE TABLE IF NOT EXISTS LIST (id integer primary key autoincrement, personName text, personSurname text, personDate datatime)'); 
	//tx.executeSql('DELETE FROM LIST WHERE id=1');
})
function setCookie(cname,cvalue) {
    var d = new Date();
	d.setHours(0);
	d.setMinutes(0);
	d.setMilliseconds(0);
    d.setTime(d.getTime() + (24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function daysLeft()
{
	let today = new Date();
	let year = today.getFullYear();	
	let daysLeft, date;
	let arr = [];
	var info = "";
	dbback.transaction(function (tx) { 
	tx.executeSql('SELECT * FROM LIST', [], function (tx, results) { 
	let len = results.rows.length, i;
	var alertInfo = getCookie("alert");
    if (alertInfo == "") 	
	{
		for (i = 0; i < len; i++) { 
		date = new Date(results.rows.item(i).personDate);
			
		date.setFullYear(year);
		date.setHours(0);
		daysLeft = Math.floor((date - today)/(1000 * 60 * 60 * 24))+1;
		console.log(daysLeft);
		if(daysLeft === 1)
		{
			info = "Tomorrow is " + results.rows.item(i).personName + " " + results.rows.item(i).personSurname + "'s birthday";
			alert(info);
			setCookie('alert', 'done');
		}
		if(daysLeft === 0)
		{
			info = "Today is " + results.rows.item(i).personName + " " + results.rows.item(i).personSurname + "'s birthday";
			alert(info);
			setCookie('alert', 'done');
		}
		}
	}
	}, null); 
	}); 
}
daysLeft();