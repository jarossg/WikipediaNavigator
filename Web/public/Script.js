var network;
var allNodes;
var highlightActive = false;

var nodesDataset = new vis.DataSet(); // these come from WorldCup2014.js
var edgesDataset = new vis.DataSet(); // these come from WorldCup2014.js

var standardColor = '#039dfc';

var worker = new Worker('Graph.js');

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function buildGraph(){
  // create a network
  var container = document.getElementById("network");
  var data = {
    nodes: nodesDataset,
    edges: edgesDataset,
  };

  var options = {
    layout:{
      improvedLayout: false
    },
    physics: {
      enabled: true,
      
      stabilization: {
        iterations: 1
      },
      barnesHut:{
        springLength: 200,
        springConstant: 0.001,
        centralGravity: 0.000001,
        gravitationalConstant: -500000
      }
    },
    nodes:{
      color: standardColor,
      shapeProperties:{
        interpolation: false
      }
    },
    edges: {
      width: 0.15,
      color: { inherit: "from" },
      smooth: {
        type: "continuous",
      },
    },
    interaction: {
      tooltipDelay: 200,
      hideEdgesOnDrag: true,
      hideEdgesOnZoom: true,
      hideNodesOnDrag: true,
      navigationButtons: true
    },

  };
  
  network = new vis.Network(container, data, options);
  allNodes = nodesDataset.get({ returnType: "Object" });
  network.on("click", neighbourhoodHighlight);
}

async function start(){
  var data = httpGet("https://wikipedianavigator-default-rtdb.europe-west1.firebasedatabase.app/articles.json");
  console.log("Data aquired");
  worker.postMessage(data);

  data = JSON.parse(data);

  var articles = [];
  for(var dat in data){
    articles.push(data[dat]);
  }

  nodesDataset.add({id: articles[0]["url"], label: articles[0]["title"]});
  for(let tag in articles[0]["tags"]){
    edgesDataset.add({from: articles[0]["url"], to: articles[0]["tags"][tag]["url"]});
  }

  buildGraph();
  
}

worker.addEventListener('message', function(e) {
  nodesDataset.update(e.data.nodes);
  edgesDataset.update(e.data.edges);

  allNodes = nodesDataset.get({ returnType: "Object" });
});

function neighbourhoodHighlight(params) {
  // if something is selected:
  if (params.nodes.length > 0) {
    highlightActive = true;
    var i, j;
    var selectedNode = params.nodes[0];
    var degrees = 2;

    // mark all nodes as hard to read.
    for (var nodeId in allNodes) {
      allNodes[nodeId].color = "rgba(200,200,200,0.5)";
      if (allNodes[nodeId].hiddenLabel === undefined) {
        allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
        allNodes[nodeId].label = undefined;
      }
    }
    var connectedNodes = network.getConnectedNodes(selectedNode);
    var allConnectedNodes = [];

    // get the second degree nodes
    for (i = 1; i < degrees; i++) {
      for (j = 0; j < connectedNodes.length; j++) {
        allConnectedNodes = allConnectedNodes.concat(
          network.getConnectedNodes(connectedNodes[j])
        );
      }
    }

    // all second degree nodes get a different color and their label back
    for (i = 0; i < allConnectedNodes.length; i++) {
      allNodes[allConnectedNodes[i]].color = "rgba(150,150,150,0.75)";
      if (allNodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
        allNodes[allConnectedNodes[i]].label =
          allNodes[allConnectedNodes[i]].hiddenLabel;
        allNodes[allConnectedNodes[i]].hiddenLabel = undefined;
      }
    }

    // all first degree nodes get their own color and their label back
    for (i = 0; i < connectedNodes.length; i++) {
      allNodes[connectedNodes[i]].color = undefined;
      if (allNodes[connectedNodes[i]].hiddenLabel !== undefined) {
        allNodes[connectedNodes[i]].label =
          allNodes[connectedNodes[i]].hiddenLabel;
        allNodes[connectedNodes[i]].hiddenLabel = undefined;
      }
    }

    // the main node gets its own color and its label back.
    allNodes[selectedNode].color = undefined;
    if (allNodes[selectedNode].hiddenLabel !== undefined) {
      allNodes[selectedNode].label = allNodes[selectedNode].hiddenLabel;
      allNodes[selectedNode].hiddenLabel = undefined;
    }
  } else if (highlightActive === true) {
    // reset all nodes
    for (var nodeId in allNodes) {
      allNodes[nodeId].color = standardColor;
      if (allNodes[nodeId].hiddenLabel !== undefined) {
        allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
        allNodes[nodeId].hiddenLabel = undefined;
      }
    }
    highlightActive = false;
  }

  // transform the object into an array
  var updateArray = [];
  for (nodeId in allNodes) {
    if (allNodes.hasOwnProperty(nodeId)) {
      updateArray.push(allNodes[nodeId]);
    }
  }
  nodesDataset.update(updateArray);
}

