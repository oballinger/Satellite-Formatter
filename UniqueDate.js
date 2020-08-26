// filter an image collection such that there is only one image per timeframe 

exports.unique_date=function(collection, time_unit){
    collection.sort('system:time_start')
    var list = collection.toList(collection.size())
    
    var dummy = ee.Image(lista.get(0))
    
    //Add in the end of the list a dummy image
    list = list.add(dummy)
    var deduplicate = function(dummy){
      var duplicated = ee.String("")
      var number = lista.indexOf(dummy)
      var image1 = ee.Image(lista.get(numero.add(1)))
      
      //Compare the image(0) in the ImageCollection with the image(1) in the List
      var date1 = dummy.date().format(time_unit)
      var date2 = image1.date().format(time_unit)
      var cond = ee.Algorithms.IsEqual(date1,date2)
      esduplicado = ee.String(ee.Algorithms.If({condition: cond, 
                      trueCase: "duplicate",      
                      falseCase: "not duplicate"}));            
      
      return dummy.set({"duplicate": duplicated}).set('date1',date1).set('date2',date2).set('index',number)
      }
      
    collection = collection.map(deduplicate)
    collection = collection.filter(ee.Filter.eq("duplicate","not duplicate"));
    return collection
}
