# Neural model visualizer can create representations of the neural network in canvas.
#
# Usefull to visualize the structure of the network produced by brain.js 
class NeuralModelVisualizer
	# @param [object] net Neural network to visualize.
	# @param [Element] container DOM element to place a canvas.
	constructor: (net, container) ->
		@net = net
		@inputLayer = @net.inputLookup
		@outputLayer = @net.outputs
		@sizes = @net.sizes
		
		@width = 400
		@height = 400

		@container = container
		@canvas = null
		@context = null
		
		@colors = {
			nodeOutline: 'black'
			inputLayerNode: 'blue'
			outputLayerNode: 'green'
			hiddenLayerNode: 'orange'
			forwardArrow: 'black'
			backArrow: 'violet'
		}

	# Create canvas element and attach it to the container.
	#
	# The container has to be destroyed manually when it is no longer required.
	createCanvas: () ->
		@canvas = document.createElement('canvas')
		@canvas.width = @width
		@canvas.height = @height

		if typeof @container == 'object'
			@container.appendChild @canvas
			@context = @canvas.getContext('2d')
			return true
		
		return false

	# Draw a network node to a position.
	#
	# @param [number] x X coordinate of the node.
	# @param [number] y Y coordinate of the node.
	# @param [number] radius Radius of the circle.
	drawNode: (x, y, nodeRadius) ->
		@context.beginPath()
		@context.strokeStyle = @colors.nodeOutline
		@context.lineWidth = 5
		@context.arc(x, y, nodeRadius, 0, 2 * Math.PI)
		@context.stroke()
		@context.fillStyle = @colors.hiddenLayerNode
		@context.fill()
		@context.closePath()
		return

	# Draw arrow between two nodes
	#
	# @param [object] node1 Origin node
	# @param [object] node2 Destination node.
	# @param [number] weight Weight of the connection between the nodes.
	drawArrow: (node1, node2, weight) ->
		x1 = node1.x
		y1 = node1.y
		x2 = node2.x
		y2 = node2.y

		@context.beginPath()
		@context.lineWidth = 1

		@context.fillStyle = 'rgba(0,0,0, ' + weight + ')'
		@context.strokeStyle = 'rgba(0,0,0, ' + weight + ')'

		@context.moveTo(x1, y1)
		@context.lineTo(x2, y2)
		@context.stroke()
		@context.closePath()
		return

	# Get node from the neural network
	#
	# @param [string] layerId ID of the network layer.
	# @param [string] nodeId ID of the layer node.
	getNode: (layerId, nodeId) ->
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
		
		# These two (2 and 1) are some strange heuristics, do something better
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
		
		return null

	# Render the network to canvas based on its current status.
	#
	# Will iterate over the network structure and draw its layers in collumns
	render: () ->
		if @canvas == null or @context == null
			@createCanvas()

		#We draw arrows first
		for layerIndex of @sizes
			nodeIndex = 0
			while nodeIndex < @sizes[layerIndex]
				node = @getNode(layerIndex, nodeIndex)
				layerIndex2 = layerIndex * 1 + 1
				nodeIndex2 = 0
				while nodeIndex2 < @sizes[layerIndex2]
					node2 = @getNode(layerIndex2, nodeIndex2)
					@drawArrow(node, node2, Math.abs(@net.weights[layerIndex2][nodeIndex2][nodeIndex]) / 2)
					nodeIndex2++
				nodeIndex++
			
			if layerIndex >= @sizes.length - 2
				break
			
		#So they are overlapped by nodes (maybe change this behaviour in future)
		for layerIndex of @sizes
			nodeIndex = 0
			while nodeIndex < @sizes[layerIndex]
				node = @getNode(layerIndex, nodeIndex)
				@drawNode(node.x, node.y, node.radius)
				nodeIndex++

		return


export {NeuralModelVisualizer};