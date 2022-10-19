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
  
  var data = httpGet("https://wikipedianavigator-default-rtdb.europe-west1.firebasedatabase.app/.json");
  console.log("Data aquired");
  console.log(data);
  var index = 0;

  for(let key in data){
    if(index > 5){break;}
    console.log(key);
    nodes.add({id: index, label: key["title"]});
    index = index + 1;

  }
  console.log("building Graph " + index);
  buildGraph(nodes, edges);
}