function createPKMaster(){  
    $("body").append("<div id='player' class='player_d_s'/>");
    g_PKMasterPrimitive = [150,-26];
    setKeyMove();
    movePKMaster(150,-26,150,-26);
}

function setKeyMove(){
  window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    var oLng = g_PKMasterPrimitive[0];
    var oLat = g_PKMasterPrimitive[1];
    var step = 0.002;

    var stepDirection;
    if (key == 38) {
      movePKMaster(oLng,oLat,oLng,oLat+step);
      stepDirection = "u";
    }else if (key == 40) {
      movePKMaster(oLng,oLat,oLng,oLat-step);
      stepDirection = "d";
    }else if (key == 39) {
      movePKMaster(oLng,oLat,oLng+step,oLat);
      stepDirection = "r";
    }else if (key == 37) {
      movePKMaster(oLng,oLat,oLng-step,oLat);
      stepDirection = "l";
    }
    
    $("#player").attr("class",'player_'+stepDirection+'_m');
  }
  
  window.onkeyup = function(e){
    var key = e.keyCode ? e.keyCode : e.which;
    var stepDirection;
    if (key == 38) {
      stepDirection = "u";
    }else if (key == 40) {
      stepDirection = "d";
    }else if (key == 39) {
      stepDirection = "r";
    }else if (key == 37) {
      stepDirection = "l";
    }
    
    $("#player").attr("class",'player_'+stepDirection+'_s');
  }
}

function movePKMaster(oLng,oLat,nLng,nLat){
  var cartesianPosition = g_ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(nLng, nLat));
  var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(cartesianPosition); 
  g_PKMasterPrimitive[0] = nLng;
  g_PKMasterPrimitive[1] = nLat;
  cameraFocus(cartesianPosition);
  var animalList = [];
  animalList = identifyAnimalInArea(nLng,nLat,0.05)
    .sort(function(a,b){ 
      if(a.name < b.name) return -1;
      if(a.name > b.name) return 1;
      return 0;
    });
  var data = [];
  if(animalList.length!=0){
    var prevSpecies = animalList[0].name;
    var prevColor = animalList[0].color;
    var frequency = 0;
    var al = animalList.length; console.log(animalList);
    $.each(animalList,function(i, d){
      if(d.name==prevSpecies){
        frequency++;
      }else if(d.name!=prevSpecies){
        data.push({"animal":prevSpecies,"frequency":frequency,"color": prevColor});
        frequency = 1;
        prevSpecies = d.name;
        prevColor = d.color;
      }
      
      if(i === al - 1){;
        data.push({"animal":d.name,"frequency":frequency,"color": d.color});
      }
    });
  }else{
    data = [];
  }
  
  $("#chartArea").html("");
  createBarChart(data);
}

function cameraFocus(cartesian){
  if (g_viewer.scene.mode == Cesium.SceneMode.SCENE3D) {
    var flight = Cesium.CameraFlightPath.createAnimation(g_scene, {
      destination : Cesium.Cartesian3.subtract(
        cartesian, 
        Cesium.Cartesian3.multiplyByScalar(g_cam_direction, 30000, new Cesium.Cartesian3),
        new Cesium.Cartesian3
      ),
      direction : g_cam_direction,
      up : g_cam_up,
      duration: 0
    });
    g_scene.animations.add(flight);
  }
}
