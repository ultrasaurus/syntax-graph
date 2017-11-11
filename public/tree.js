wordWidth = 60
wordHeight = 20
function levelHeight(level) {
  return 2 + Math.pow(level, 1.8) * 10;
}

function under(edge1, edge2) {
  //[mi, ma] = edge1.id < edge1.parent ? [edge1.id, edge1.parent] : [edge1.parent, edge1.id]
  [edge1left, edge1right] = edge1.id < edge1.parent ? [edge1.id, edge1.parent] : [edge1.parent, edge1.id];
  [edge2left, edge2right] = edge2.id < edge2.parent ? [edge2.id, edge2.parent] : [edge2.parent, edge2.id];
  var result = edge1.id != edge2.id
            && edge2right >= edge1left 
            && edge2left >= edge1left 
            && edge2right <= edge1right 
            && edge2left <= edge1right
  // console.log('[mi, ma] ', mi, ma );  
  console.log(edge1.id, edge2.id);
  return result;
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

    // calculate edge level for height of arc
    data.forEach(function(d, i) { 
      d.level = 1;
      d.id = parseInt(i);     
      d.parent = d.dependencyEdge.headTokenIndex;      
    });
    data.forEach(function(edge, i) { 
      console.log('edge:', edge.text.content, edge.id, edge.text.content, edge.parent)
      var level = data.reduce(function(level, e) { 
        console.log('e.parent:', e.parent);
        console.log('e.id:', e.id);
        if (e.parent != e.id && under(edge, e)) {
          if (level < e.level) level = e.level;
          console.log('yup:', level);          
          return level;
        } else return level;
      },0)
      edge.level = level + 1;
      console.log('----------level:', edge.level)
    });
    // for (var i in data) {
    //   var edge = data[i];
    //   maxLevel = data.reduce(function(result, e) { 
    //     console.log('edge:', edge);
    //     console.log('e:', e);
    //     console.log('e.level:', e.level);
    //     if (e.level) {
    //       console.log('under(edge, e)', under(edge, e));
    //     }
    //     console.log('result < e.level:', result < e.level);
    //     if (e.level && under(edge, e)) return e.level;
    //     else return result;
    //     //return result < e.level ? e.level : result 
    //   }, 0)
    //   console.log('maxLevel', maxLevel)
    //   edge.level = 1 + maxLevel;     
    // }

    // calculate the shape of the arc
    for (var i in data) {
      var item = data[i];
      console.log('item', i, item);
      item.root = item.dependencyEdge.label == 'ROOT';
      item.bottom = treeHeight - 1.8 * wordHeight;
      item.top = item.bottom - levelHeight(item.level)
      item.left = item.id * wordWidth + item.width/2;
      item.right = item.parent * wordWidth + data[item.parent].width / 2;
      item.mid = (item.right+item.left)/2;
      item.diff = (item.right-item.left)/4;
      item.arrow = item.top + (item.bottom-item.top)*.25;
    }

    //compute edge levels
    // levels = data.map(function(item) { return item.dependencyEdge.headTokenIndex });
    // levels = d3.set(levels).values();
    // maxLevel = levels.length;
    
    
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
