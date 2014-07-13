$(document).ready(function() {
  g_globe.depthTestAgainstTerrain = false;
  viewAustraliaEast();
  /*
  g_scene.screenSpaceCameraController.enableRotate = false;
  g_scene.screenSpaceCameraController.enableTranslate = false;
  g_scene.screenSpaceCameraController.enableZoom = false;
  g_scene.screenSpaceCameraController.enableTilt = false;
  g_scene.screenSpaceCameraController.enableLook = false;
  */
  getAnimalData();
  picking();
  createPKMaster();

  console.log(g_viewer.scene.camera.position);  
    lat = parseFloat($('#latdata').attr("data-lat"));
    lon = parseFloat($('#latdata').attr("data-lon"));
    console.log(lat);
    console.log(lon);
    // note lat & lon are reversed sorry
    movePKMaster(150,-26,lat,lon);

});

function viewAustraliaEast(){
  g_viewer.scene.camera.lookAt(g_cam_eye, new Cesium.Cartesian3.add(g_cam_eye, g_cam_direction,new Cesium.Cartesian3), g_cam_up);
}

function getAnimalData(){
  $.getJSON('data/out_100_pretty.json', function(data) {
    $.each(data._Class,function(i, aClass){
       $.each(aClass._FamilyNames,function(i, aFamilyName){
          $.each(aFamilyName._Species,function(i, aSpecies){
            g_json.push(aSpecies);
            var posArray = aSpecies._SpeciesSightings.features
            var posArrayLength = posArray.length;
            var color = new Cesium.Color.fromCssColorString(hashColor(aSpecies.ScientificName));
            var list = [];
            for(var i=0;i<posArrayLength;i++){
              var coord = posArray[i].geometry.coordinates;
              list.push({
                name: aSpecies.ScientificName,
                lng: coord[0],
                lat: coord[1],
                color: color
              });
            }
            createAnimalBillboard(list);
          });
        });
     });
  });
}

function createAnimalBillboard(list){
  var image = new Image();
  image.src = 'images/froggy_bw.png';
  image.onload = function() {
    var billboards = new Cesium.BillboardCollection();
    var textureAtlas = new Cesium.TextureAtlas({
      scene: g_scene,
      image: image
    });
    billboards.textureAtlas = textureAtlas;
    $.each(list, function(i, animal){
      billboards.add({
        position : g_ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(animal.lng, animal.lat)),
        imageIndex : 0,
        scaleByDistance : new Cesium.NearFarScalar(0.1, 1.5, 0.5e6, 0.0),
        translucencyByDistance : new Cesium.NearFarScalar(5e4, 1.0, 5e5, 0.0),
        id : animal,
        color : animal.color
      });
    })

    g_scene.primitives.add(billboards);
  }
}

function generateModelMatrix(lng, lat, height) {
  var cartographic = Cesium.Cartographic.fromDegrees(lng, lat);
  var cartesian = g_ellipsoid.cartographicToCartesian(cartographic);
  return Cesium.Matrix4.multiplyByTranslation(
    Cesium.Transforms.eastNorthUpToFixedFrame(cartesian),
    new Cesium.Cartesian3(0.0, 0.0, height)
  );
}

function hashColor(str){
  if (str == null) {
    str = "null"
  };

  var hash = 0;
  for (var i = 0; i < str.length; i++) {
     hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  function padDigits(n) {
    return (n.length == 1) ? '0' + n : n;
  }

  var rgb = padDigits(((hash >> 16) & 0xFF).toString(16)) + 
            padDigits(((hash >> 8) & 0xFF).toString(16)) + 
            padDigits((hash & 0xFF).toString(16));

  return '#' + rgb;
}

function picking(){
  var scene = g_scene;
  var ellipsoid = g_ellipsoid;
  g_handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  g_handler.setInputAction(
    function (movement) {
      var pickedObj = scene.pick(movement.position);
      if(pickedObj.primitive.id.length!=0){
        var pickedAttr = pickedObj.primitive.id;
        var cartographic = Cesium.Cartographic.fromDegrees(
          pickedAttr.lng,
          pickedAttr.lat,
          0
        );
        var cartesian = g_ellipsoid.cartographicToCartesian(cartographic); 
        initBubble(cartesian);
        selectAnimal(pickedAttr.name)
      }
    },
    Cesium.ScreenSpaceEventType.LEFT_CLICK
  );
}

function selectAnimal(name){
  $.each(g_json,function(i, aSpecies){
    if(aSpecies.ScientificName == name){
      var h = "";
      
      $("#bubble_title").html(aSpecies.AcceptedCommonName);
      $("#bubble_subtitle").html(
        "Scientific Name: "+aSpecies.ScientificName+"<br />"+
        "Type of: "+aSpecies.FamilyCommonName+" ("+aSpecies.FamilyName+")"
      );
      
      h += "<div><img id='animalImage' src='"+aSpecies._SpeciesProfile.Image[0].URL+"'></div>"
      $("#bubble_body").html(h);
      
      $("#animalImage").load(function() {
        var spos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(g_scene, g_infoBubblePos);
        updateBubblePos(spos.x,spos.y);
      });
    }
  });
}

function identifyAnimalInArea(lng,lat,size){
  var list = [];
  $.each(g_json,function(i, aSpecies){
    var posArray = aSpecies._SpeciesSightings.features;
    var posArrayLength = posArray.length;
    var color = hashColor(aSpecies.ScientificName);
    for(var i=0;i<posArrayLength;i++){
      var coord = posArray[i].geometry.coordinates;
      if(
        coord[0]<lng+size &&
        coord[0]>lng-size &&
        coord[1]<lat+size &&
        coord[1]>lat-size
      ){
        list.push({name:aSpecies.AcceptedCommonName,lng:coord[0],lat:coord[1],imgURL: aSpecies._SpeciesProfile.Image[0].URL,color:color});
      }
    }
  });
 return list;
}

function initBubble(cartesian) {
  g_infoBubblePos = cartesian;
  $('#bubble').remove();
  $('#cesiumContainer').append(layoutBubble());
  initBubblePostTabsCreation(g_infoBubblePos);
}

function initBubblePostTabsCreation(d) {
  var spos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(g_scene, g_infoBubblePos);
  updateBubblePos(spos.x,spos.y);
  
  var camera = g_scene.camera;
  var lastCamera = camera.clone();
  
  g_viewer.clock.onTick.addEventListener(function() {
    if (!camera.position.equals(lastCamera.position) ||
      !camera.direction.equals(lastCamera.direction) ||
      !camera.up.equals(lastCamera.up) ||
      !camera.right.equals(lastCamera.right) ||
      !camera.transform.equals(lastCamera.transform) ||
      !camera.frustum.equals(lastCamera.frustum)) {
      
      var spos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(g_scene, g_infoBubblePos);
      updateBubblePos(spos.x,spos.y);
      
      lastCamera = camera.clone();
    }
  });
}

function layoutBubble(){
  var h='';
  h+='<div id="bubble">';
  h+='  <button onclick="$(this).parent().remove();" style="float: right;">x</button>';
  h+='  <h1 id="bubble_title"></h1>';
  h+='  <h3 id="bubble_subtitle"></h3>';
  h+='  <div id="bubble_body">';
  h+='  </div>';
  h+='</div>';
  return h;
}

function updateBubblePos(x,y){
  var b = $("#bubble");
  return $('#bubble').css({'left':x - (b.width()/2) - 32 ,'top':$(document).height() - y - b.outerHeight(true)});
}
