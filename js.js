function parseXML(){

	var xml = new XMLHttpRequest();
	xml.open( 'GET', 'input.xml' , false );
	xml.send();
  	var parser = new DOMParser();
  	var data = parser.parseFromString( xml.responseText, 'text/xml' );
  	var paramsList = data.getElementsByTagName( 'Parameter' );
	var row = '';
	for( var i = 0; i < paramsList.length; i++ ){

		var value = paramsList[i].getElementsByTagName( 'Value' )[0].textContent;
		var type = paramsList[i].getElementsByTagName( 'Type' )[0].textContent;
		row += '<tr>';
		row += '<td>' + paramsList[i].getElementsByTagName( 'Имя' )[0].textContent; + '</td>';
		row += '<td>' + paramsList[i].getElementsByTagName( 'Описание' )[0].textContent; + '</td>';
		row += '<td>' + makeValueField( type, value ) + '</td>';		
		row += '<td><input type=\'button\' value=\'delete!\' onclick=\'deleteRow(this)\'></td>';
		row += '</tr>';
	}		
	document.getElementById( 'Data' ).innerHTML += row;
}

function createOutputText()
{
	var data = document.getElementById( 'Data' );
	var rowsList = data.getElementsByTagName("tr");
	var outputXML = '<?xml version=\"1.0\"?>\n';
	outputXML += "<Parameters>\n";
	for( var i = 1; i < rowsList.length; i++ )
	{
		var fieldsList = rowsList[i].getElementsByTagName("td");
		outputXML += "<Parameter>\n\r";
		outputXML += "<Name>" + fieldsList[0].textContent + "</Name>\n";
		outputXML += "<Description>" + fieldsList[1].textContent + "</Description>\n";
		outputXML += "<Type>" + getOutputValueType(fieldsList[2].childNodes[0].getAttribute("type")) + "</Type>\n";
		outputXML += "<Value>" + getOutputValue(fieldsList[2]) + "</Value>\n";
		outputXML += "</Parameter>\n";
	}
	outputXML += "</Parameters>";
	return outputXML;
}

function generateXML( name, type ) {
  var text = createOutputText();
  var link = document.getElementById("download_link");
  var file = new Blob([text], {type: type});
  link.href = URL.createObjectURL(file);
  link.download = name;
  link.style.display = '';
}

function getOutputValueType( type ) {
	switch ( type ) {
		case 'text':
			return 'System.String';
		case 'number':
			return 'System.Int32';
		case 'checkbox':
			return 'System.Boolean';
	}
}

function getOutputValue( field ){

	switch ( field.childNodes[0].getAttribute("type") ) {
		case 'text':
			return field.childNodes[0].value;
		case 'number':
			return field.childNodes[0].value;
		case 'checkbox':
			if ( field.childNodes[0].checked ) 
				return 'True';
			else 
				return 'False';
	}
}


function makeValueField( type, value ){
	switch ( type ) {
		case 'System.String':
			return '<input type=\'text\'  onchange="changeValueInField(this)" value=' + value + '>';
		case 'System.Int32':
			return '<input type=\'number\' onchange="checkFieldForNumber(this);changeValueInField(this)" value=' + value + '>';
		case 'System.Boolean':
			if ( value === 'True' )
				return '<input type=\'checkbox\' onchange="changeValueInField(this)" checked>';
			else
				return '<input type=\'checkbox\' onchange="changeValueInField(this)" >';
	}
}

function addRow(){

	var sel = document.getElementById('newType');
	var type = sel.options[sel.selectedIndex].value;
	var row = '';
	row += '<tr>';
	row += '<td>' + document.getElementById( 'newName' ).value + '</td>';
	row += '<td>' + document.getElementById( 'newDescription' ).value + '</td>';
	row += '<td>' + makeValueField( type, '' ) + '</td>';	
	row += '<td><input type=\'button\' value=\'Удалить\' onclick=\'deleteRow(this)\'></td>';
	row += '</tr>';
	document.getElementById( 'Data' ).innerHTML += row;
}

function deleteRow(t){

	var row = t.parentNode.parentNode;
	document.getElementById('Data').deleteRow(row.rowIndex);
}

function changeValueInField( field ){
	if ( field.getAttribute("type") === 'checkbox')
	{
		if( field.checked == true )
			field.setAttribute('checked', true);
		if( field.checked == false )
			field.removeAttribute('checked');
	}
	else
		field.setAttribute("value", field.value); 
}

function checkFieldForNumber( field ){	
	var regular = new RegExp("(^([+-]?)([1-9]+?)[0-9]*$)|^0$");
    if (!regular.test(field.value)) 
	{
		alert('It\'s not a number!');
		field.value = field.getAttribute('value');
	}
}