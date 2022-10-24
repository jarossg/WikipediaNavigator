var batchSize = 50;

const delay = ms => new Promise(res => setTimeout(res, ms));

async function run(data){
    data = JSON.parse(data);

    var articles = [];
    for(var dat in data){
      articles.push(data[dat]);
    }
  
    console.log(articles.length + " Nodes");
    
    await delay(1000);
    var batches = 0;

    while(articles.length > batches * batchSize){
        console.log("Batch: " + batches);
      var nodesToAdd = [];
      var edgesToAdd = [];
  
      for(let i = batches * batchSize; i < (batches + 1) * batchSize; i++){
        if(i > (articles.length - 1)){break;}
  
        nodesToAdd.push({id: articles[i]["url"], label: articles[i]["title"]});
        for(let tag in articles[i]["tags"]){
          edgesToAdd.push({from: articles[i]["url"], to: articles[i]["tags"][tag]["url"]});
        }
        
      }
      self.postMessage({nodes:nodesToAdd, edges: edgesToAdd});
      
      batches++;

      var time = 150 * batchSize * batches;
      await delay(time);
    }
    console.log("Loading finished")
}

self.addEventListener('message', function(e) {
    run(e.data);
  });