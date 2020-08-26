// Perform a spatial join wherein each feature in "left" is matched with the nearest feature in "right". 

exports.distance_to=function(left, right){
    var spatialFilter = ee.Filter.withinDistance({
      distance: 100000000,
      leftField: '.geo',
      rightField: '.geo',
      maxError: 10
    })
    
    var joined = ee.Join.saveFirst({
      matchKey: 'neighbors', 
      measureKey: 'distance',
      ordering: 'distance'
    }).apply({
      primary: left, 
      secondary: right, 
      condition: spatialFilter
    });
    
    var joined_final = joined.map(function(f) {
      var nearestDist = ee.Feature(f.get('neighbors')).get('distance')
      return f.set('distance', nearestDist)
});
  return joined_final
}
