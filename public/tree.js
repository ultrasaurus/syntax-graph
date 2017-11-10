wordWidth = 60
wordHeight = 20
levelHeight = function(level) {
  return 2 + Math.pow(level, 1.8) * 10;
}

function drawTree(svgElement, data) {
    svg = d3.select(svgElement);
    svg.attr('xmlns', 'http://www.w3.org/2000/svg');

    treeWidth = wordWidth * data.length - wordWidth / 3;
    treeHeight = 200;
    //levelHeight(maximum(edge.level for edge in data)) + 2 * wordHeight
  
    svg.attr('width', treeWidth + 2 * wordWidth / 3)
       .attr('height', treeHeight + wordHeight / 2);
    
   
    words = svg.selectAll('.word').data(data).enter()
    .append('text')
    .text(function(d) { return d.text.content })
    .attr('class', function(d,i) { return  "word w"+i })
    .attr('x', function(d,i) { return wordWidth * i })
    .attr('y', treeHeight - wordHeight)
    .each(function(d) {
      d.width = this.getBBox().width;
    })
    .on('mouseover', function(d) {
      svg.selectAll('.word, .dependency, .edge, .arrow').classed('active', false)
      svg.selectAll('.tag').attr('opacity', 0)
      svg.selectAll(`.w${d.id}`).classed('active', true)
      svg.select(`.tag.w${d.id}`).attr('opacity', 1)
    })
    .on('mouseout', function(d) {
      svg.selectAll('.word, .dependency, .edge, .arrow').classed('active', false)
      svg.selectAll('.tag').attr('opacity', 0)
    })

    // calculate the shape of the arc
    for (var i in data) {
      var item = data[i];
      console.log('item', i, item);
      item.id = parseInt(i);
      item.parent = item.dependencyEdge.headTokenIndex;
      item.root = item.dependencyEdge.label == 'ROOT';
      item.bottom = treeHeight - 1.8 * wordHeight;
      item.top = 100; //item.bottom - levelHeight(item.level)
      item.left = item.id * wordWidth + item.width/2;
      item.right = item.parent * wordWidth + data[item.parent].width / 2;
      item.mid = (item.right+item.left)/2;
      item.diff = (item.right-item.left)/4;
      item.arrow = item.top + (item.bottom-item.top)*.25;
    }
    
    edges = svg.selectAll('.edge').data(data).enter()
    .append('path')
    .filter(function(d) { return !d.root } )
		.attr('class', function(d,i) { return `edge w${i} w${d.parent}`})
    .attr('d', function(d) 
      { return `M${d.left},${d.bottom} `+     // moveto
               `C${d.mid-d.diff},${d.top} `+  // Bezier Curve
               `${d.mid+d.diff},${d.top} `+
               `${d.right},${d.bottom}`
      })
		.attr('fill', 'none')
		.attr('stroke', 'black')
		.attr('stroke-width', '1.5')

}
