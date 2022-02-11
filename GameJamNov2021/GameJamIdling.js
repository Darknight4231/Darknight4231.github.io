
let UpdateSpeed=100;

let notiftxt = document.getElementById('popuptxt');

let Enjoyment = 0;
let pr = 0;
let munnys =0;

let Tables=document.querySelectorAll(".Tables");
//VARIABLES FOR DOCUMENT EASE//
//this is stats div element, though it says 'table'
//main table
let Statstable=document.getElementById("Stats");

//sidetables
let GameDevTable=document.getElementById("GameDevTab");
let PRtable=document.getElementById("PRTab");

//This is addEventListeners for clicky -- display, don't display.. upgrades, etc.
let EnjoyStat=document.getElementById("Enjoyment");
let PRStat=document.getElementById("prtxt");
let Munnytxt=document.getElementById("Munnytxt");

let charDiv =document.getElementById("Chim");
charDiv.style.width='0%';
let charimg = document.getElementById("CharImg");

let canvas=document.getElementById("canvas");
//let ctx = canvas.getContext('2d');

let cramw='100%';
let cramh='100%';
let body=document.getElementById("body");

prompt("Hi How are Ya");
//GAME MAKING VARS//
let Engine={
  time: 5,
  Enjoyment: 51,
  Pr: 1,
  progress: 0,
  id: document.getElementById("EngineBar"),
  multiplier: 1,
  auto:false,
  created:0,
};

let Assets={
  time: 100,
  Enjoyment: 500,
  Pr:0,
  progress:0,
  id:document.getElementById("AssetsBar"),
  multiplier: 1,
  auto:false,
  created:0,
};

let BugTest={
  time: 1000,
  Enjoyment: 10,
  Pr: 50,
  progress: 0,
  id: document.getElementById("TestBar"),
  multiplier: 1,
  auto:false,
  created:0,
  unlocked:0,
};

let Mechanics={
  time: 100,
  Enjoyment: 100,
  Pr: 50,
  progress: 0,
  id: document.getElementById("MechanicsBar"),
  multiplier: 1,
  auto:false,
  created:0,
  unlocked:0,
};

let BackgroundProcessess={
  time: 1000,
  Enjoyment: 10,
  Pr: 50,
  progress: 0,
  id: document.getElementById("BPBar"),
  multiplier: 1,
  auto:false,
  created:0,
  unlocked:0,
};

let Story={
  time: 1000,
  Enjoyment: 10,
  Pr: 50,
  progress: 0,
  id: document.getElementById("StoryBar"),
  multiplier: 1,
  auto:false,
  created:0,
  unlocked:0,
};

let Campaigning = {
  time: 1000,
  Enjoyment: 10,
  Pr: 50,
  progress: 0,
  id: document.getElementById("CampaignBar"),
  multiplier: 1,
  auto:false,
  created:0,
  unlocked:0,
};

let SocialMedia ={
  time: 1000,
  Enjoyment: 10,
  Pr: 50,
  progress: 0,
  id: document.getElementById("SocialMediaBar"),
  multiplier: 1,
  auto:false,
  created:0,
  unlocked:0,
};

let Demos = {
  time: 1000,
  Enjoyment: 50,
  Pr: 50,
  progress: 0,
  id: document.getElementById("DemosBar"),
  multiplier: 1,
  auto:false,
  created:0,
  unlocked:0,
};

let devunlock =document.querySelectorAll('.unlockable');

//show/hide stats
document.getElementById('StatsButton').addEventListener("click",()=>{if (Statstable.style.display=='block'){Statstable.style.display='none';}else{Statstable.style.display='block';};});

document.getElementById("GameDevButton").addEventListener("click",()=>{console.log("Showing GameDevTab");for (i = 0; i < Tables.length; i++) {Tables[i].style.display='none';}; GameDevTable.style.display='block';});
document.getElementById("PRButton").addEventListener("click",()=>{console.log("prstuff  "+Tables.length);for (i = 0; i < Tables.length; i++) {Tables[i].style.display='none';}; PRtable.style.display='block';});
document.getElementById("SettingsButton").addEventListener("click",()=>{console.log('settings ON');for (i = 0; i < Tables.length; i++) {Tables[i].style.display='none';}; document.getElementById('Settings').style.display='block';},false);

//GameTable Listeners -- these just send respective objects to the move function.
document.getElementById("MakeAssetsBT").addEventListener("click", ()=> {move(Assets);}, false);
document.getElementById("MakeEngineBT").addEventListener("click", ()=> {move(Engine);}, false);
document.getElementById('TestBT').addEventListener("click",()=>{move(BugTest);},false);
document.getElementById("MechanicsBT").addEventListener("click", ()=>{move(Mechanics);},false);
document.getElementById("BPBT").addEventListener("click", ()=>{move(BackgroundProcessess);},false);
document.getElementById("StoryBT").addEventListener("click", ()=>{move(Story);},false);

document.getElementById("Campaigning").addEventListener("click", ()=>{move(Campaigning);},false);
document.getElementById("SocialMedia").addEventListener("click", ()=>{move(SocialMedia);},false);
document.getElementById("Demos").addEventListener("click", ()=>{move(Demos);},false);

document.getElementById("Save").addEventListener("click", ()=>{save();},false);
document.getElementById("Load").addEventListener("click", ()=>{load();},false);
document.getElementById("Reset").addEventListener("click", ()=>{localStorage.clear();console.log('Save File Deleted.'); location.reload();},false);
document.getElementById("UpdateTick").addEventListener("click", ()=>{document.getElementById("UpdateSpeed").style.display='block';},false);
document.getElementById("UpdateSpeed").addEventListener("change", (e)=>{UpdateSpeed = e.target.value; clearInterval(IntervalID); setInterval(main,UpdateSpeed);console.log("UpdateSpeed changed to  "+e.target.value);});
document.getElementById("PopupButton").addEventListener("click", ()=>{document.getElementById('PopupBox').style.display='none';document.getElementById('PopupBox').style.top = '50%';},false);

/*
document.getElementById("").addEventListener("click", ()=>{move();},false);
*/


//shows everything with the 'unlockable' class -- it's for dev purposes.
document.getElementById("unlockall").addEventListener("click",()=>{console.log('Hello, DevUnlocked '+devunlock.length+' things.'); Assets.auto=true; for (i = 0; i < devunlock.length; i++){devunlock[i].style.display='block';};});

//ShowHideCharacter
document.getElementById("CharButton").addEventListener("click",()=> {
  if (charDiv.style.width=='0%') {
charDiv.style.width='20%';
charDiv.style.height='100%';
charimg.style.width='100%';
charimg.style.height= window.innerheight*0.5;
charDiv.style.display='block';
  }else{
charDiv.style.width='0%';
charDiv.style.height='0%';
charDiv.style.display='none';
body.style.marginLeft='0%';
  }
});

//This accepts whatever object is passed into it and starts an independent frame() function linked to the progressbar. Should be Async
function move(object) {
  console.log("Started move for  "+ object);
  i=0;

  if (object.progress===0) {
    object.progress=1;
    if (i == 0) {
      i = 1;
      let width = 1;
      let id = setInterval(frame, object.time*object.multiplier);
      console.log(object.time+' '+object.multiplier);

      function frame() {
        if (width >= 100) {
          clearInterval(id);
          i = 0;
          Enjoyment+=object.Enjoyment;
          pr+=object.Pr;
          object.id.style.width="0%";
          object.progress=0;
          FinishMove();
          if (object.auto==true) {move(object);};
        } else {
          width++;
          object.id.style.width = width + "%";
        }
      }
    }
  }
};
let loadedfile = [];
let SaveArray = [Enjoyment, pr, munnys, Assets, Engine, BugTest, Mechanics, BackgroundProcessess, Story, Campaigning, Demos, SocialMedia];
//This grabs an array of all the objects (currently manually typed in.. and converts them to a JSON string, which isn't really a string as much as a bucket of data).
function save(){

    //Not yet JSON'ed
    //Get nae nae'd
  SaveArray = [Enjoyment, pr, munnys, Assets, Engine, BugTest, Mechanics, BackgroundProcessess, Story, Campaigning, Demos, SocialMedia];
  let JSONSaveArray= JSON.stringify(SaveArray);
  localStorage.setItem('DarkSaveFile', JSONSaveArray);
  //chrome.storage.local.sync()


  //chrome.storage.local.set doesn't use quotations for key
  //chrome.storage.local.get does use strings for key
  //chrome.storage.local.set({bingbong: 1},function(result) {console.log("HELOO "+result);});
  console.log("Game Saved --  ");
}

//This calls the saved JSON string (bucket of data, not a string, remember?) and parses the data. Currently still manually assigning all of this.
function load(){
  let saveGrabber = localStorage.getItem('DarkSaveFile');
  console.log(JSON.parse(saveGrabber));
 if (saveGrabber) {
   console.log("Saved data Loading...");
   loadedfile = JSON.parse(saveGrabber);
for (var i = 0; i < SaveArray.length; i++) {
  SaveArray[i]=loadedfile[i]
}
 loadedfile.forEach((index, i) => {
   console.log("loadedfile["+i+"] "+ loadedfile[i]+" created "+loadedfile[i].created);
 });

   console.log("Saved data loaded.");
   console.log(loadedfile);
 }else{console.log("No save data exists."); document.getElementById('PopupBox').style.display='block';document.getElementById('PopupBox').style.top='20%';}


}

function NotifBox(txt){
  console.log('NotifBox Called with Str '+txt);
      document.getElementById('PopupBox').style.display='block';
    notiftxt.innerHTML=txt;
//'Congratulations on making an '+txt+'! </br> You&apos;ve unlocked other aspects of your game to work on!!'
}

//Here's where most of the progression is gonna go... for unlocks that is
function FinishMove(){
  if (Enjoyment>=50 && !Assets.unlocked) {
    console.log('unlocked AssetsBT');
    Assets.unlocked = 1;
    document.getElementById('MakeAssetsBT').style.display='block';
    NotifBox('Congratulations on making an Engine! </br> You&apos;ve unlocked other aspects of your game to work on!!');
  }
  if (Enjoyment>55 && document.getElementById("TestBT").style.display=='none') {document.getElementById("TestBT").style.display='block';}
  console.log('FinishMove');
}


function main (){

EnjoyStat.innerHTML=(Enjoyment);
PRStat.innerHTML=pr;
Munnytxt.innerHTML=munnys;
}

let IntervalID = setInterval(main, UpdateSpeed);

load();
