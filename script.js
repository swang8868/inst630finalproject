import * as THREE from 'three';

async function loadDataExample(url) {
  console.log("fired loadDataExample");
  const results = await fetch(url);
  // This changes the response from the GET into data we can use - an "object"
  const storedList = await results.json();
  console.table(storedList);
  
  return storedList;
}

function setup(){
  const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    alpha: true,
  });
  
  //these two lines from https://ngocbdinh.github.io/the-dancing-dog/
  // renderer.setClearColor( 0x000000, 0 ); (makes things invisible?)
  renderer.setSize(innerWidth, innerHeight * 0.6);
  


	const fov = 75;
	const aspect = 1.2; // the canvas default
	const near = 0.1;
	const far = 1000;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 8;
  
  
  	const scene = new THREE.Scene();
  
   {
  const color = 0xFFFFFF;
  const intensity = 2;
  const lightLeft = new THREE.DirectionalLight(color, intensity);
  lightLeft.position.set(-1, 2, 4);
  scene.add(lightLeft);
     
  const lightRight = new THREE.DirectionalLight(color, intensity);
  lightRight.position.set(1, 2, 4);
  scene.add(lightRight);
  }
  
  return{
    canvas,
    renderer,
    camera,
    scene
  }
  
}

function makeInstance(geometry, color, x, y, scene) {
  const material = new THREE.MeshPhongMaterial({color});

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.x = x;
  cube.position.y = y; //tries to center it, we want the bottom at same level
  //current below-yzero is half height
  //want lowest = say -3 on y
  //then do half height - 3, plus that?

  return cube;
}

function makeGeometry(width, height, depth) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  return geometry;
}

function injectStatWords() {
  console.log('fired injectStatWords');
  
  let target;
  const words = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];
  let counter = 0;
  words.forEach((item) => {
    //target is hp,atk,etc text
    //target innerhtml is nothing
    //and then str is 
    //and then update innerhtml
    console.log('target is');
    console.log("#" + words[counter].toLowerCase() + "Text");
    target = document.querySelector("#" + words[counter].toLowerCase() + "Text");
    
    console.log(target.id)
  
    target.innerHTML = '';
    if(target.id === "hpText"){
      //console.log("target is hp")
      target.innerHTML = words[counter];
      
      //whitespace character from https://en.wikipedia.org/wiki/Whitespace_character
      target.innerHTML += "&numsp;"
      console.log(target.innerHTML)
    } else {
      target.innerHTML = words[counter];
    }
    
    
    counter+=1;
  });
  
  
}

function injectStatValues(statsList) {
  console.log('fired injectStatValues');
  
  let target;
  const words = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];
  let counter = 0;
  let str;
  
  const slicedValues = [];
  
  statsList.forEach((item) => {
    target = document.querySelector("#" + words[counter].toLowerCase() + "Value");
    target.innerHTML = '';
    
    if(item >= 100){
      str = `${item.toString().slice(0,3)}`;
      slicedValues.push(str);
    } else {
       str = `${item.toString().slice(0,2)}`;
      slicedValues.push(str);
    }
    
    if(target.id === "hpValue"){
      target.innerHTML = str + "&numsp;";
    } else{
      target.innerHTML = str;
    }
    
    
    counter +=1;
  });
  
  counter = 0;
  let rating;
  slicedValues.forEach((val) => {
    target = document.querySelector("#" + words[counter].toLowerCase() + "Rating");
    target.innerHTML = '';
    //50 up to 110
    //then, 60 / 5 = 12
    //50, 75, 90, 110
    //50, 62, 74, 86, 98, 110
    if(val < 62){
      rating = "Poor";
    } else if (val < 74) {
      rating = "Fair";
    } else if (val < 86) {
      rating = "Good";
    } else if (val < 98) {
      rating = "Very Good";
    } else {
      rating = "Excellent";
    }
    
    if(target.id === "hpText"){
      //console.log("target is hp")
      target.innerHTML = words[counter];
      
      //whitespace character from https://en.wikipedia.org/wiki/Whitespace_character
      target.innerHTML += "&numsp;"
      console.log(target.innerHTML)
    } else {
      target.innerHTML = words[counter];
    }
    
    target.innerHTML = rating;
    counter +=1;
  })
}


function injectType(typeString) {
  console.log('fired injectStatValues');
  
  const target = document.querySelector(".type");
  target.innerHTML = `Current Type: ${typeString}`;
  
}

async function loadData() {
  console.log("fired loadData");
  const results = await fetch('./pokemons.json');
  
  let storedList = [];
  
  
  // // This changes the response from the GET into data we can use - an "object"
  storedList = await results.json();
//   console.log(storedList);
  
//   console.log(Array.isArray(storedList));
  
  return storedList;
}


function processType(data, type) {
  
    const avgStats = [0,0,0,0,0,0];
    let counter = 0;
  
    data.forEach((item) => {

      if(item.type1 === type || item.type2 === type){
        // console.log(item);
        avgStats[0] += item.hp;
        avgStats[1] += item.atk;
        avgStats[2] += item.def;
        avgStats[3] += item.spatk;
        avgStats[4] += item.spdef;
        avgStats[5] += item.speed;
       counter +=1;  
      }
    }, {})
    
    // console.log(avgStats);
    // console.log(counter);
  
    avgStats[0] = (avgStats[0]/counter).toString();
    avgStats[1] = (avgStats[1]/counter).toString();
    avgStats[2] = (avgStats[2]/counter).toString();
    avgStats[3] = (avgStats[3]/counter).toString();
    avgStats[4] = (avgStats[4]/counter).toString();
    avgStats[5] = (avgStats[5]/counter).toString();
  
    // console.log(avgStats);

    // return {
    //   avgStats
    // } //array w two values, now have key dataset, key labels
  
    return avgStats;
  }


function getHeights(data) {
  let heights = [0,0,0,0,0,0];
  let counter = 0;
  data.forEach((item)=>{
    heights[counter] = (item/10).toString().slice(0,8);
    counter +=1;
  })
  // console.log(heights);
  return heights;
}

function getYPos(heights) {
  let positions = [0,0,0,0,0,0];
  let counter = 0;
  heights.forEach((item)=>{
    positions[counter] = ((item/2)-5.5).toString().slice(0,8);
    counter +=1;
  })
  
  //console.log(positions);
  return positions;
}

function getCubes(width, heights, depth, reds, blues, scene){
  // console.log('doesbluesexist');
  // console.log(blues);
  const geometries = [
    makeGeometry(width, heights[0], depth),
    makeGeometry(width, heights[1], depth),
    makeGeometry(width, heights[2], depth),
    makeGeometry(width, heights[3], depth),
    makeGeometry(width, heights[4], depth),
    makeGeometry(width, heights[5], depth),
  ];
  
  const yPositions = getYPos(heights);
  
  const cubeGroup = new THREE.Group();
  //have geometries, need to get materials
  
  const HpMaterial = new THREE.MeshPhongMaterial({color: "rgb("+ reds[0] + ",30," + blues[0] + ")"});
  const AtkMaterial = new THREE.MeshPhongMaterial({color: "rgb("+ reds[1] + ",30," + blues[1] + ")"});
  const DefMaterial = new THREE.MeshPhongMaterial({color: "rgb("+ reds[2] + ",30," + blues[2] + ")"});
  const SpatkMaterial = new THREE.MeshPhongMaterial({color: "rgb("+ reds[3] + ",30," + blues[3] + ")"});
  const SpdefMaterial = new THREE.MeshPhongMaterial({color: "rgb("+ reds[4] + ",30," + blues[4] + ")"});
  const SpeedMaterial = new THREE.MeshPhongMaterial({color: "rgb("+ reds[5] + ",30," + blues[5] + ")"});
  
  const HpBox = new THREE.Mesh(geometries[0], HpMaterial)
  HpBox.position.set(-3.75, yPositions[0], 0);
  cubeGroup.add(HpBox);
  
  const AtkBox = new THREE.Mesh(geometries[1], AtkMaterial)
  AtkBox.position.set(-2.25, yPositions[1], 0);
  cubeGroup.add(AtkBox);
  
  const DefBox = new THREE.Mesh(geometries[2], DefMaterial)
  DefBox.position.set(-0.75, yPositions[2], 0);
  cubeGroup.add(DefBox);
  
  const SpatkBox = new THREE.Mesh(geometries[3], SpatkMaterial)
  SpatkBox.position.set(0.75, yPositions[3], 0);
  cubeGroup.add(SpatkBox);
  
  const SpdefBox = new THREE.Mesh(geometries[4], SpdefMaterial)
  SpdefBox.position.set(2.25, yPositions[4], 0);
  cubeGroup.add(SpdefBox);
  
  const SpeedBox = new THREE.Mesh(geometries[5], SpeedMaterial)
  SpeedBox.position.set(3.75, yPositions[5], 0);
  cubeGroup.add(SpeedBox);
  
  
  //console.log(cubeGroup);

  return cubeGroup;
  
}


function makeTypeVisible(allArray, typeNum) {
  //typeNum must be zero indexed!
  console.log('maketypevisible');
  
  let counter = 0;
  
  allArray.forEach((group) => {
    // console.log('for loop');
    // console.log(group);
    // console.log(counter);
    if(counter === typeNum){
      // console.log('true');
      group.visible = true;
    } else {
      group.visible = false;
    }
    counter+=1;
  })
  
}

function pickColors(statsArray){ 
  let redArray = [];
  let blueArray = [];
  let red;
  let blue;
  
  statsArray.forEach((stat) =>{
    red = (255- (35*((stat-45)/10)) );
    if(red >= 100){
      red = red.toString().slice(0,3);
    } else{
      red = red.toString().slice(0,2);
    }
    redArray.push(red);
    
    blue = (35*((stat-45)/10));
    if(blue >= 100){
      blue = blue.toString().slice(0,3);
    } else{
      blue = blue.toString().slice(0,2);
    }
    blueArray.push(blue);
  })
  
  return{
    redArray,
    blueArray
  }
}




async function mainEvent() {
  
  const data = await loadDataExample("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0")

  const {canvas, renderer, camera, scene} = setup();
  

  function render(time) {
		time *= 0.001; // convert time to seconds, larger is faster
    
    //looking down from the z axis, left-right is x axis, up-down is y axis?

		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}
  
  const boxWidth = 1;
	const boxDepth = 1;
  
  const pokemon = await loadData(); 
  
  let allGroup = new THREE.Group();
  
  

  ////////////////////NORMAL0//////////////////////
  const normalStats = processType(pokemon, "normal");
  console.log('normalStats');
  console.log(normalStats);
  const normalHeights = getHeights(normalStats);
  const normalColors = pickColors(normalStats);
  //got the below way of doing it from here: https://stackoverflow.com/questions/2917175/return-multiple-values-in-javascript
  //can't really use the returned names because i think i want them to be distinct per type?
  const normalRed = normalColors.redArray;
  const normalBlue = normalColors.blueArray;

  const normalGroup = getCubes(boxWidth, normalHeights, boxDepth, normalRed, normalBlue, scene);
  // scene.add(normalGroup);
  allGroup.add(normalGroup);
  
  
  const normalButton = document.querySelector('#normalButton');

  normalButton.addEventListener('click', async (clickEvent) => {
    // console.log('normal click allgroup children')
    // console.log(allGroup.children);
    makeTypeVisible(allGroup.children, 0);
    requestAnimationFrame(render); //draws on button click
    injectType("Normal");
    injectStatValues(normalStats);
  });
  
  ////////////////////Fighting1//////////////////////
  const fightingStats = processType(pokemon, "fighting");
  const fightingHeights = getHeights(fightingStats);
  const fightingColors = pickColors(fightingStats);
  const fightingRed = fightingColors.redArray;
  const fightingBlue = fightingColors.blueArray;
  //console.log(fightingRed)
  const fightingGroup = getCubes(boxWidth, fightingHeights, boxDepth, fightingRed, fightingBlue, scene);
  allGroup.add(fightingGroup);
  
  const fightingButton = document.querySelector('#fightingButton');

  fightingButton.addEventListener('click', async (clickEvent) => {
    
    makeTypeVisible(allGroup.children, 1);

    requestAnimationFrame(render); //draws on button click
    injectType("Fighting");
    injectStatValues(fightingStats);
  });
  
  ////////////////////Flying2//////////////////////
  const flyingStats = processType(pokemon, "flying");
  // console.log('flyingStats');
  // console.log(flyingStats);
  const flyingHeights = getHeights(flyingStats);
  const flyingColors = pickColors(flyingStats);
  const flyingRed = flyingColors.redArray;
  const flyingBlue = flyingColors.blueArray;
  const flyingGroup = getCubes(boxWidth, flyingHeights, boxDepth, flyingRed, flyingBlue, scene);
  // scene.add(flyingGroup);
  allGroup.add(flyingGroup);
  
  const flyingButton = document.querySelector('#flyingButton');

  flyingButton.addEventListener('click', async (clickEvent) => {
    makeTypeVisible(allGroup.children, 2);

    requestAnimationFrame(render); //draws on button click
    injectType("Flying");
    injectStatValues(flyingStats);
  });
  
  ////////////////////Poison3//////////////////////
  const poisonStats = processType(pokemon, "poison");
  // console.log('poisonStats');
  // console.log(poisonStats);
  const poisonHeights = getHeights(poisonStats);
  const poisonColors = pickColors(poisonStats);
  const poisonRed = poisonColors.redArray;
  const poisonBlue = poisonColors.blueArray;
  const poisonGroup = getCubes(boxWidth, poisonHeights, boxDepth, poisonRed, poisonBlue, scene);
  // scene.add(poisonGroup);
  allGroup.add(poisonGroup);
  
  const poisonButton = document.querySelector('#poisonButton');

  poisonButton.addEventListener('click', async (clickEvent) => {
    makeTypeVisible(allGroup.children, 3);
    
    requestAnimationFrame(render); //draws on button click
    injectType("Poison");
    injectStatValues(poisonStats);
  });
  
  ////////////////////Ground4//////////////////////
  const groundStats = processType(pokemon, "ground");
  // console.log('groundStats');
  // console.log(groundStats);
  const groundHeights = getHeights(groundStats);
  const groundColors = pickColors(groundStats);
  const groundRed = groundColors.redArray;
  const groundBlue = groundColors.blueArray;
  const groundGroup = getCubes(boxWidth, groundHeights, boxDepth, groundRed, groundBlue, scene);
  // scene.add(groundGroup);
  allGroup.add(groundGroup);
  
  const groundButton = document.querySelector('#groundButton');

  groundButton.addEventListener('click', async (clickEvent) => {
    makeTypeVisible(allGroup.children, 4);
    
    requestAnimationFrame(render); //draws on button click
    injectType("Ground");
    injectStatValues(groundStats);
  });
  
  ////////////////////Rock5//////////////////////
  const rockStats = processType(pokemon, "rock");
  // console.log('rockStats');
  // console.log(rockStats);
  const rockHeights = getHeights(rockStats);
  const rockColors = pickColors(rockStats);
  const rockRed = rockColors.redArray;
  const rockBlue = rockColors.blueArray;
  const rockGroup = getCubes(boxWidth, rockHeights, boxDepth, rockRed, rockBlue, scene);
  // scene.add(rockGroup);
  allGroup.add(rockGroup);
  
  const rockButton = document.querySelector('#rockButton');

  rockButton.addEventListener('click', async (clickEvent) => {
    makeTypeVisible(allGroup.children, 5);
    
    requestAnimationFrame(render); //draws on button click
    injectType("Rock");
    injectStatValues(rockStats);
  });
  
  ////////////////////Bug6//////////////////////
  const bugStats = processType(pokemon, "bug");
  // console.log('bugStats');
  // console.log(bugStats);
  const bugHeights = getHeights(bugStats);
  const bugColors = pickColors(bugStats);
  const bugRed = bugColors.redArray;
  const bugBlue = bugColors.blueArray;
  const bugGroup = getCubes(boxWidth, bugHeights, boxDepth, bugRed, bugBlue, scene);
  allGroup.add(bugGroup);
  
  const bugButton = document.querySelector('#bugButton');

  bugButton.addEventListener('click', async (clickEvent) => {
    makeTypeVisible(allGroup.children, 6);
    
    requestAnimationFrame(render); //draws on button click
    injectType("Bug");
    injectStatValues(bugStats);
  });
  
  ////////////////////Ghost7//////////////////////
  const ghostStats = processType(pokemon, "ghost");
  // console.log('ghostStats');
  // console.log(ghostStats);
  const ghostHeights = getHeights(ghostStats);
  const ghostColors = pickColors(ghostStats);
  const ghostRed = ghostColors.redArray;
  const ghostBlue = ghostColors.blueArray;
  const ghostGroup = getCubes(boxWidth, ghostHeights, boxDepth, ghostRed, ghostBlue, scene);
  allGroup.add(ghostGroup);
  
  const ghostButton = document.querySelector('#ghostButton');

  ghostButton.addEventListener('click', async (clickEvent) => {
    makeTypeVisible(allGroup.children, 7);
    
    requestAnimationFrame(render); //draws on button click
    injectType("Ghost");
    injectStatValues(ghostStats);
  });
  
  ////////////////////Steel8//////////////////////
  const steelStats = processType(pokemon, "steel");

  const steelHeights = getHeights(steelStats);
  const steelColors = pickColors(steelStats);
  const steelRed = steelColors.redArray;
  const steelBlue = steelColors.blueArray;

  const steelGroup = getCubes(boxWidth, steelHeights, boxDepth, steelRed, steelBlue, scene);
  allGroup.add(steelGroup);
  
  const steelButton = document.querySelector('#steelButton');

  steelButton.addEventListener('click', async (clickEvent) => {
    makeTypeVisible(allGroup.children, 8);
    
    requestAnimationFrame(render); //draws on button click
    injectType("Steel");
    injectStatValues(steelStats);
  });
  
  ////////////////////Fire9//////////////////////
  const fireStats = processType(pokemon, "fire");
  const fireHeights = getHeights(fireStats);
  const fireColors = pickColors(fireStats);
  const fireRed = fireColors.redArray;
  const fireBlue = fireColors.blueArray;
  const fireGroup = getCubes(boxWidth, fireHeights, boxDepth, fireRed, fireBlue, scene);
  allGroup.add(fireGroup);

  const fireButton = document.querySelector('#fireButton');

  fireButton.addEventListener('click', async (clickEvent) => {
    makeTypeVisible(allGroup.children, 9);
    
    requestAnimationFrame(render); //draws on button click
    injectType("Fire");
    injectStatValues(fireStats);
  }); //injectHTML takes an array of names, not an array of objects
  
  ////////////////////Water10//////////////////////
  const waterStats = processType(pokemon, "water");
  // console.log('waterStats');
  // console.log(waterStats);
  const waterHeights = getHeights(waterStats);
  const waterColors = pickColors(waterStats);
  const waterRed = waterColors.redArray;
  const waterBlue = waterColors.blueArray;
  const waterGroup = getCubes(boxWidth, waterHeights, boxDepth, waterRed, waterBlue, scene);
  allGroup.add(waterGroup);
  
  const waterButton = document.querySelector('#waterButton');

  waterButton.addEventListener('click', async (clickEvent) => {
    makeTypeVisible(allGroup.children, 10);
    
    requestAnimationFrame(render); //draws on button click
    injectType("Water");
    injectStatValues(waterStats);
  });
  
  ////////////////////Grass11//////////////////////
  const grassStats = processType(pokemon, "grass");
  // console.log('grassStats');
  // console.log(grassStats);
  const grassHeights = getHeights(grassStats);
  const grassColors = pickColors(grassStats);
  const grassRed = grassColors.redArray;
  const grassBlue = grassColors.blueArray;
  const grassGroup = getCubes(boxWidth, grassHeights, boxDepth, grassRed, grassBlue, scene);
  allGroup.add(grassGroup);
  
  const grassButton = document.querySelector('#grassButton');

  grassButton.addEventListener('click', async (clickEvent) => {
    makeTypeVisible(allGroup.children, 11);
    
    requestAnimationFrame(render); //draws on button click
    injectType("Grass");
    injectStatValues(grassStats);
  });
  
  ////////////////////Electric12//////////////////////
  const electricStats = processType(pokemon, "electric");
  // console.log('electricStats');
  // console.log(electricStats);
  const electricHeights = getHeights(electricStats);
  const electricColors = pickColors(electricStats);
  const electricRed = electricColors.redArray;
  const electricBlue = electricColors.blueArray;
  const electricGroup = getCubes(boxWidth, electricHeights, boxDepth, electricRed, electricBlue, scene);
  allGroup.add(electricGroup);
  
  const electricButton = document.querySelector('#electricButton');

  electricButton.addEventListener('click', async (clickEvent) => {
    makeTypeVisible(allGroup.children, 12);
    
    requestAnimationFrame(render); //draws on button click
    injectType("Electric");
    injectStatValues(electricStats);
  });
  
  ////////////////////Psychic13//////////////////////
  const psychicStats = processType(pokemon, "psychic");
  // console.log('psychicStats');
  // console.log(psychicStats);
  const psychicHeights = getHeights(psychicStats);
  const psychicColors = pickColors(psychicStats);
  const psychicRed = psychicColors.redArray;
  const psychicBlue = psychicColors.blueArray;
  const psychicGroup = getCubes(boxWidth, psychicHeights, boxDepth, psychicRed, psychicBlue, scene);
  allGroup.add(psychicGroup);
  
  const psychicButton = document.querySelector('#psychicButton');

  psychicButton.addEventListener('click', async (clickEvent) => {
    makeTypeVisible(allGroup.children, 13);
    
    requestAnimationFrame(render); //draws on button click
    injectType("Psychic");
    injectStatValues(psychicStats);
  });
  
  ////////////////////Ice14//////////////////////
  const iceStats = processType(pokemon, "ice");
  // console.log('iceStats');
  // console.log(iceStats);
  const iceHeights = getHeights(iceStats);
  const iceColors = pickColors(iceStats);
  const iceRed = iceColors.redArray;
  const iceBlue = iceColors.blueArray;
  const iceGroup = getCubes(boxWidth, iceHeights, boxDepth, iceRed, iceBlue, scene);
  allGroup.add(iceGroup);
  
  const iceButton = document.querySelector('#iceButton');

  iceButton.addEventListener('click', async (clickEvent) => {
    makeTypeVisible(allGroup.children, 14);
    
    requestAnimationFrame(render); //draws on button click
    injectType("Ice");
    injectStatValues(iceStats);
  });
  
  ////////////////////Dragon15//////////////////////
  const dragonStats = processType(pokemon, "dragon");
  // console.log('dragonStats');
  // console.log(dragonStats);
  const dragonHeights = getHeights(dragonStats);
  const dragonColors = pickColors(dragonStats);
  const dragonRed = dragonColors.redArray;
  const dragonBlue = dragonColors.blueArray;
  const dragonGroup = getCubes(boxWidth, dragonHeights, boxDepth, dragonRed, dragonBlue, scene);
  allGroup.add(dragonGroup);
  
  const dragonButton = document.querySelector('#dragonButton');

  dragonButton.addEventListener('click', async (clickEvent) => {
    makeTypeVisible(allGroup.children, 15);
    
    requestAnimationFrame(render); //draws on button click
    injectType("Dragon");
    injectStatValues(dragonStats);
  });
  
  ////////////////////dark16//////////////////////
  const darkStats = processType(pokemon, "dark");
  // console.log('darkStats');
  // console.log(darkStats);
  const darkHeights = getHeights(darkStats);
  const darkColors = pickColors(darkStats);
  const darkRed = darkColors.redArray;
  const darkBlue = darkColors.blueArray;
  const darkGroup = getCubes(boxWidth, darkHeights, boxDepth, darkRed, darkBlue, scene);
  allGroup.add(darkGroup);
  
  const darkButton = document.querySelector('#darkButton');

  darkButton.addEventListener('click', async (clickEvent) => {
    makeTypeVisible(allGroup.children, 16);

    requestAnimationFrame(render); //draws on button click
    injectType("Dark");
    injectStatValues(darkStats);
  });
  
  ////////////////////fairy17//////////////////////
  const fairyStats = processType(pokemon, "fairy");
  // console.log('fairyStats');
  // console.log(fairyStats);
  const fairyHeights = getHeights(fairyStats);
  const fairyColors = pickColors(fairyStats);
  const fairyRed = fairyColors.redArray;
  const fairyBlue = fairyColors.blueArray;
  const fairyGroup = getCubes(boxWidth, fairyHeights, boxDepth, fairyRed, fairyBlue, scene);
  allGroup.add(fairyGroup);
  
  const fairyButton = document.querySelector('#fairyButton');

  fairyButton.addEventListener('click', async (clickEvent) => {
    makeTypeVisible(allGroup.children, 17);
    
    requestAnimationFrame(render); //draws on button click
    injectType("Fairy");
    injectStatValues(fairyStats);
  });
  
  
  /////TYPES DONE//////////
  scene.add(allGroup);
  
  //listen for any button click 
  
  const anyButton = document.querySelector("button");
  
  anyButton.addEventListener('click', (event) => {
    injectStatWords();
  })

}






document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests



