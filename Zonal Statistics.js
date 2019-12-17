// this is code for Google Earth Engine. Because GEE runs on Google servers, it is advisable to do as much computationally intensive work on earth engine. It can be accessed here: https://code.earthengine.google.com/

// load image collections; in this case, LANDSAT 32-day NDVI composites 

var L7 = ee.ImageCollection('LANDSAT/LE07/C01/T1_32DAY_NDVI')
          .select('NDVI')          

var L8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_32DAY_NDVI')
          .select('NDVI')

var L5 = ee.ImageCollection('LANDSAT/LT05/C01/T1_32DAY_NDVI')
          .select('NDVI')

// load feature collection/shapefile of desired region; this is an example using U.S. counties

var regions= ee.FeatureCollection("TIGER/2016/Counties")

// load color palette

var colorizedVis = {
  min: 0.0,
  max: 1.0,
  palette: [
    'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
    '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',
    '012E01', '011D01', '011301'
  ],
}

// optional topographic layers; these are particularly helpful for identifying arable land

var dataset = ee.Image('USGS/SRTMGL1_003');
var elevation = dataset.select('elevation');
var slope = ee.Terrain.slope(elevation);

// optional vizualisation 
Map.addLayer(L8, colorizedVis, 'L8');
Map.addLayer(L5, colorizedVis, 'L5');
Map.addLayer(L7, colorizedVis, 'L7');

// export data to google drive

var zonalstats = function(collection,regions, level, filename){
  
    var rename_band = function(img){
      return img.select([0], [img.id()]);
    };

    var stacked_image = collection.map(rename_band).toBands().clip(regions);
// determine scale to perform reduceRegions.
    var scale = collection.first().projection().nominalScale();
  
// calculate longitudinal area statistics for each region.
    var mean = ee.Image(stacked_image).reduceRegions({collection: regions, reducer: ee.Reducer.mean()});
    var median = ee.Image(stacked_image).reduceRegions({collection: regions, reducer: ee.Reducer.median()});
    var stddev = ee.Image(stacked_image).reduceRegions({collection: regions, reducer: ee.Reducer.stdDev()});
    var sum = ee.Image(stacked_image).reduceRegions({collection: regions, reducer: ee.Reducer.sum()});
    
    var mean1 = mean.select(['.*'],null,false);
    var median1 = median.select(['.*'],null,false);
    var stddev1 = stddev.select(['.*'],null,false);
    var sum1 = sum.select(['.*'],null,false);
    
// export results.

    var file=filename
    var levels=level
  return [
    Export.table.toDrive({
    collection: mean1, 
    description: level+"_Mean_"+file, 
    fileNamePrefix: level+"_Mean_"+file,
    fileFormat: 'CSV'
    }),
    Export.table.toDrive({
    collection: median1, 
    description: level+"_Median_"+file, 
    fileNamePrefix: level+"_Median_"+file,
    fileFormat: 'CSV'
    }),
    Export.table.toDrive({
    collection: stddev1, 
    description: level+"_StdDev_"+file, 
    fileNamePrefix: level+"_StdDev_"+file,
    fileFormat: 'CSV'
    }),
    Export.table.toDrive({
    collection: sum1, 
    description: level+"_Sum_"+file, 
    fileNamePrefix: level+"_Sum_"+file,
    fileFormat: 'CSV'
    })
  ]
}

//execute the function using Landsat 8 NDVI imagery and U.S. Counties as regions.
zonalstats(L8, regions, "County", "NDVI")

