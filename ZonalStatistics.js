exports.zonalstats=function(collection,regions, level, filename, scale){
  
    var rename_band = function(img){
      return img.select([0], [img.id()]);
    };

// stack all the images into a single image for a time-series collection
    var panel= ee.ImageCollection(collection).size()
    var stacked_image=ee.Algorithms.If(panel.gt(1),
                                       collection.map(rename_band).toBands().clip(regions),
                                       collection)

// calculate the timeseries for each feature.
    var mean = ee.Image(stacked_image).reduceRegions({collection: regions, reducer: ee.Reducer.mean(), scale: scale});
    var median = ee.Image(stacked_image).reduceRegions({collection: regions, reducer: ee.Reducer.median(), scale: scale});
    var stddev = ee.Image(stacked_image).reduceRegions({collection: regions, reducer: ee.Reducer.stdDev(),  scale: scale});
    var sum = ee.Image(stacked_image).reduceRegions({collection: regions, reducer: ee.Reducer.sum(), scale: scale});
    
    var mean1 = mean.select(['.*'],null,false);
    var median1 = median.select(['.*'],null,false);
    var stddev1 = stddev.select(['.*'],null,false);
    var sum1 = sum.select(['.*'],null,false);
    
    print(mean1)
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

