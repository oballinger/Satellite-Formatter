// Aggregate data over a given timeframe (e.g. week/month/year).

exports.time_agg=function(col, timeframe){

col = col.map(function(img) {
  var doy = ee.Date(img.get('system:time_start')).format(timeframe);
  return img.set('doy', doy);
});

var filter = ee.Filter.equals({leftField: 'doy', rightField: 'doy'});

// Define a join.
var join = ee.Join.saveAll('doy_matches');

// Apply the join and convert the resulting FeatureCollection to an
// ImageCollection.
var joinCol = ee.ImageCollection(join.apply(col, col, filter));

// Apply median reduction among matching DOY collections.
var comp = joinCol.map(function(img) {
  var doyCol = ee.ImageCollection.fromImages(
    img.get('doy_matches')
  );
  var date=img.get('system:time_start')
  return doyCol.reduce(ee.Reducer.mean()).set('system:time_start',date);
});
return comp
}
