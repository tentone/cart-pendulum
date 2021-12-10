class NeuralModelVisualizer
	constructor: (net, htmlParentNode) ->
		@net = net
		@inputLayer = @net.inputLookup
		@outputLayer = @net.outputs
		@sizes = @net.sizes
		@container = htmlParentNode
		@canvas = null
		@context = null
		@colors =
			background: 'white'
			nodeOutline: 'black'
			inputLayerNode: 'blue'
			outputLayerNode: 'green'
			hiddenLayerNode: 'orange'
			forwardArrow: 'black'
			backArrow: 'violet'

	createCanvas = ->
		@canvas = document.createElement('canvas')
		@canvas.width = 400
		@canvas.height = 400
		@canvas.style.background = @colors.background
		if typeof @htmlParentNode == 'object'
			@htmlParentNode.appendChild @canvas
			@context = @canvas.getContext('2d')
			return true
		false

	drawNode = (x, y, nodeRadius) ->
		@context.beginPath()
		@context.strokeStyle = @colors.nodeOutline
		@context.lineWidth = 5
		@context.arc x, y, nodeRadius, 0, 2 * Math.PI
		@context.stroke()
		@context.fillStyle = @colors.hiddenLayerNode
		@context.fill()
		@context.closePath()
		return

	drawArrow = (node1, node2, weight) ->
		x1 = node1.x
		y1 = node1.y
		x2 = node2.x
		y2 = node2.y
		@context.beginPath()
		@context.lineWidth = 1
		@context.fillStyle = 'rgba(0,0,0, ' + weight + ')'
		@context.strokeStyle = 'rgba(0,0,0, ' + weight + ')'
		@context.moveTo x1, y1
		@context.lineTo x2, y2
		@context.stroke()
		@context.closePath()
		return

	getNode = (layerId, nodeId) ->
		maxLayerSize = 0
		i = 0
		while i < @sizes.length
			size = @sizes[i]
			maxLayerSize = if size > maxLayerSize then size else maxLayerSize
			i++
		
		stepX = Math.round(@canvas.width / @sizes.length)
		stepY = Math.round(@canvas.height / (maxLayerSize + 1))
		nodeRadius = 15
		if nodeRadius < stepY
			nodeRadius = stepY * 0.25
		
		#TODO: these two (2 and 1) are some strange heuristics, do something better
		offsetX = stepX - (nodeRadius * 2)
		offsetY = stepY - (nodeRadius * 1)
		
		for layer of @sizes
			# Center vertically
			rowOffsetY = (maxLayerSize - (@sizes[layer])) / 2 * stepY
			node = 0
			while node < @sizes[layer]
				if layer == layerId and node == nodeId
					return {
						x: layer * stepX + offsetX
						y: node * stepY + offsetY + rowOffsetY
						radius: nodeRadius
					}
				node++
		return false

	render = ->
		console.log @net
		console.log @net.weights
		if @canvas == null or @context == null
			@createCanvas()

		
		console.log @canvas
		console.log @context

		#We draw arrows first
		for layerIndex of @sizes
			nodeIndex = 0
			while nodeIndex < @sizes[layerIndex]
				node = @getNode(layerIndex, nodeIndex)
				layerIndex2 = layerIndex * 1 + 1
				nodeIndex2 = 0
				while nodeIndex2 < @sizes[layerIndex2]
					node2 = @getNode(layerIndex2, nodeIndex2)
					@drawArrow node, node2, Math.abs(@net.weights[layerIndex2][nodeIndex2][nodeIndex]) / 2
					nodeIndex2++
				nodeIndex++
			
			if layerIndex >= @sizes.length - 2
				break
			
		#So they are overlapped by nodes (maybe change this behaviour in future)
		for layerIndex of @sizes
			nodeIndex = 0
			while nodeIndex < @sizes[layerIndex]
				node = @getNode(layerIndex, nodeIndex)
				@drawNode node.x, node.y, node.radius
			nodeIndex++

		return

