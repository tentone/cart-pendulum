# Auxiliar methods for file manipulation, networking, etc
class Utils
	# Write data into a file. Useful to export JSON data.
	# 
	# @param [string | object] data Data to be written to file. 
	# @param [string] fname Name of the file to be written.
	@writeFile: (data, fname) ->
		if typeof data == 'object'
			data = JSON.stringify(data, null, '\t')

		blob = new Blob([data], {type: 'octet/stream'})
		
		download = document.createElement('a')
		download.download = fname
		download.href = window.URL.createObjectURL(blob)
		download.style.display = 'none'

		download.onclick = () ->
			document.body.removeChild(this)
			return
		
		document.body.appendChild(download)
		
		download.click()
		return


	# Choose file and read data from it.
	@readFile: (onLoad) ->
		chooser = document.createElement("input")
		chooser.type = "file"
		chooser.style.display = "none"
		document.body.appendChild(chooser)

		chooser.onchange = () ->
			files = chooser.files
			if files.length == 0
				return

			reader = new FileReader()
			reader.onload = () ->
				text = reader.result
				onLoad(text)
			
			reader.readAsText(files[0])
			document.body.removeChild(chooser)

		chooser.click()

export {Utils}