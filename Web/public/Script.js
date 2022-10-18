function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function buildGraph(nodes, edges){
  // create a network
  var container = document.getElementById("network");
  var data = {
    nodes: nodes,
    edges: edges,
  };

  var options = {};
  var network = new vis.Network(container, data, options);
}

function start(){
  var nodes = new vis.DataSet();
  var edges = new vis.DataSet();
  
  var data = httpGet("https://wikipedianavigator-default-rtdb.europe-west1.firebasedatabase.app/articles.json");
  console.log("Data aquired");
  var index = 0;

  for(var key in Object.keys(data)){
    nodes.add({id: index, label: key});
    index = index + 1;
  }
  
  buildGraph(nodes, edges);
}