/**
 * Auxiliar methods.
 */
function Utils() {}

/**
 * Write data into a file. Useful to export JSON data.
 * 
 * @param {string | object} data Data to be written to file. 
 * @param {string} fname Name of the file to be written.
 */
Utils.writeFile = function(data, fname)
{
    if (typeof data === 'object')
    {
        data = JSON.stringify(data, null, '\t');
    }
    
    var blob = new Blob([data], {type: 'octet/stream'});
    
    var download = document.createElement('a');
    download.download = fname;
    download.href = window.URL.createObjectURL(blob);
    download.style.display = 'none';
    download.onclick = function ()
    {
        document.body.removeChild(this);
    };
    document.body.appendChild(download);
    
    download.click();
};

/**
 * Choose file and read data from it.
 */
Utils.readFile = function(onLoad)
{
    var chooser = document.createElement("input");
	chooser.type = "file";
	chooser.style.display = "none";
	document.body.appendChild(chooser);

	chooser.onchange = function()
	{	
		if (onLoad !== undefined)
		{
			onLoad(chooser.files);
		}

		document.body.removeChild(chooser);
	};

	chooser.click();
};
