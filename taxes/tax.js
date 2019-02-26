/*  code used calculate taxes including Social Security Benefits. */

// reset HTML 
// Would be nice if all interaction with the HTMl was by way of the sswsHTML
// class - but there would be no way to call this directly from the HTML
function init() {
	document.getElementById('warn').innerHTML='';
	document.getElementById('taxableSSN').innerHTML='';
	document.getElementById('fedTaxes').innerHTML='';

	document.getElementById('ssws2').value='';

	document.getElementById('ssws4').value='';
	document.getElementById('ssws5').value='';
	document.getElementById('ssws6').value='';
	document.getElementById('ssws7').value='';
	document.getElementById('ssws8').value='';

	document.getElementById('ssws10').value='';

	document.getElementById('ssws12').value='';
	document.getElementById('ssws13').value='';
	document.getElementById('ssws14').value='';
	document.getElementById('ssws15').value='';
	document.getElementById('ssws16').value='';
	document.getElementById('ssws17').value='';
	document.getElementById('ssws18').value='';
	document.getElementById('ssws19').value='';
}

/*
	interact with Social Security Workseet HTML - with the exception of 
    init function all SSWS HTML interations are done isolated here
*/
class sswsHTML {

	constructor() {
	}

	// gather all 19 input elements from HTML
	getData () {

		return [
			// a dummy cell so real data starts at index 1 - thereby
			// matching line numbers in the workbook
			'ignore this cell',
			this.validNum('ssws1'),
			this.validNum('ssws2'),
			this.validNum('ssws3'),
			this.validNum('ssws4'),
			this.validNum('ssws5'),
			this.validNum('ssws6'),
			this.validNum('ssws7'),
			this.validNum('ssws8'),
			this.validNum('ssws9'),
			this.validNum('ssws10'),
			this.validNum('ssws11'),
			this.validNum('ssws12'),
			this.validNum('ssws13'),
			this.validNum('ssws14'),
			this.validNum('ssws15'),
			this.validNum('ssws16'),
			this.validNum('ssws17'),
			this.validNum('ssws18'),
			this.validNum('ssws19')
		];
	}

	// fill in all 19 input elements in the HTML
	setData( indata ) {
		document.getElementById('ssws1').value=indata[1];
		document.getElementById('ssws2').value=indata[2];
		document.getElementById('ssws3').value=indata[3];
		document.getElementById('ssws4').value=indata[4];
		document.getElementById('ssws5').value=indata[5];
		document.getElementById('ssws6').value=indata[6];
		document.getElementById('ssws7').value=indata[7];
		document.getElementById('ssws8').value=indata[8];
		document.getElementById('ssws9').value=indata[9];
		document.getElementById('ssws10').value=indata[10];
		document.getElementById('ssws11').value=indata[11];
		document.getElementById('ssws12').value=indata[12];
		document.getElementById('ssws13').value=indata[13];
		document.getElementById('ssws14').value=indata[14];
		document.getElementById('ssws15').value=indata[15];
		document.getElementById('ssws16').value=indata[16];
		document.getElementById('ssws17').value=indata[17];
		document.getElementById('ssws18').value=indata[18];
		document.getElementById('ssws19').value=indata[19];
	}
	
	warn(msg) {
		document.getElementById('warn').innerHTML=msg;
		alert(msg);
	}

	validNum(elId) {
		let elem = Number(document.getElementById(elId).value);
		if (elem==NaN || elem < 0) {
			warn(elId + ' must be a postive number');
			return false;
		}
		return elem;
	}
	
}


/*  calculate federal taxes - very crude should be another eleborate
	web page and functions for this Form 1040
*/
function fedTaxes(ssnTaxable, otherTaxable, deductions) {
	let brackets = {
		year: 2019,
		cutoff: [9700, 39475, 84200, 160725, 204100, 510300,
		100000000 ],
		rate:	[0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37]
	};

	let fedtax=0;   // the tax will be put here
	// the taxable income not yet accounted for 
	let remainder=ssnTaxable + otherTaxable - deductions;
	let botoff=0; // the bottom $ amount of the tax bracket
	let topoff=0; // the top $ amount of the tax bracket
	let range=0;  // the $ amount in this tax bracketi
	let j = 0;
	for ( ; remainder>0; j++) {
		topoff=brackets.cutoff[j];
		range = topoff-botoff;
		fedtax = fedtax + Math.min(range, remainder) *
						brackets.rate[j];
		remainder = remainder - range;
		botoff = topoff;
	}
	document.getElementById('fedTaxes').innerHTML= 
		"total federal taxes: " + fedtax;
	return fedtax;


}


/*
	this function, intented be called from HTML, runs the Social
	Security Workbook calculations and then the Federal Tax calculation
	and updates the HTML with the results
*/
function swssCalc() {
	init();
	
	let ssws = new sswsHTML;

	let data=ssws.getData();
	data =  swssCalc2( data );
	ssws.setData( data );

	//function fedTaxes(ssnTaxable, otherTaxable, dedutions) {
	fedTaxes(data[19], data[3], 13600);
}

/* 
	calculate the taxable part of Social Security Benefits. 
   
   	@params data  an array with elements at indexes 1 thru 19 that
	correspond one to one with lines 1 thru 19 of the
   	2018 Social Security Worksheet - IRS publication 915
		
	@returns
		an array like the input parameter with calculated values according
		to the rules of publication 915. 

	this is a pure function (no side effects or external dependancies)
*/
function swssCalc2(data) {

	data[2] = data[1] * 0.5;
	
	data[6] = data[2] + data[3] + data[4] + data[5];

	data[8] = data[6] + data[7];

	if (data[9] > data[8]) return data;  // nothing taxable

	data[10] = data[8] - data[9];

	data[12] = Math.max(data[10] - data[11], 0);

	data[13] = Math.min(data[10], data[11]);

	data[14] = data[13] * 0.5;

	data[15]=Math.min(data[2], data[14]);

	data[16] = data[12] * 0.85;

	data[17] = data[15] + data[16];

	data[18] = data[1] * 0.85;  

	data[19] = Math.min(data[17], data[18]);
	
	return data;
}


