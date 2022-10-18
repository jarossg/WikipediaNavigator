function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


//var data = httpGet("https://wikipedianavigator-default-rtdb.europe-west1.firebasedatabase.app/articles.json");
//console.log(data);


function start(){
  var nodes = new vis.DataSet([
    { id: 1, label: "Node 1" },
    { id: 2, label: "Node 2" },
    { id: 3, label: "Node 3" },
    { id: 4, label: "Node 4" },
    { id: 5, label: "Node 5" },
  ]);

  nodes.add({id: 6, label: "Knoten"});

  // create an array with edges
  var edges = new vis.DataSet([
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 3 },
  ]);

  buildGraph(nodes, edges);
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