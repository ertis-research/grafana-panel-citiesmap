import _ from 'lodash';

export default class DataFormatter {

  getValues(series, panelDefaultMetrics) {
    if (!series || series.length == 0)
      return {}

    return this.getSeries(series, panelDefaultMetrics)
  }

  getSeries(series, panelDefaultMetrics) {
    let setSeries = {};
    let setSeriesByLayer = {}

    series.forEach((series_elem) => {     
      let [seriesLayer, seriesFieldName] = series_elem.alias.split(': ');
   
      if (!(setSeriesByLayer[seriesLayer])) {
        setSeriesByLayer[seriesLayer] = [];        
      }

      setSeriesByLayer[seriesLayer].push([seriesFieldName, ...series_elem.datapoints.map((elem)=>elem[0])])
    });


    // get one array and transform into a hash
    let hashSeriesByLayerByKey = {}
    Object.keys(setSeriesByLayer).forEach((layerName)=>{
      if (!hashSeriesByLayerByKey[layerName])
        hashSeriesByLayerByKey[layerName] = {};  

      let superArray = setSeriesByLayer[layerName]
      
      for(let column=1; column<superArray[0].length; column++) {
        let result = {}
        for(let line=0; line<superArray.length; line++) {
          result[superArray[line][0]] = superArray[line][column]
        }

        if(!hashSeriesByLayerByKey[layerName][result.id])
          hashSeriesByLayerByKey[layerName][result.id] = []

        hashSeriesByLayerByKey[layerName][result.id].push(result)
      } 
    })

    return hashSeriesByLayerByKey;
  }
}

/*
* Discard elements with value 0 or null
* and hidden elements
*/
function filterEmptyAndZeroValues(data, hideEmpty, hideZero) {
  return _.filter(data, (o) => { return !(hideEmpty && _.isNil(o.value)) && !(hideZero && o.value === 0) });
}

export { filterEmptyAndZeroValues }