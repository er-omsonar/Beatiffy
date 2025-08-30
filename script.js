console.log("lets write some javascript");
let songs;
let currFolder;
  let currentSong = new Audio;
  let play = document.getElementById("play");
  function secondsToMinutesSeconds(seconds) {
    if(isNaN(seconds) || seconds < 0 ){
      return "00:00"
    }
  const minutes = Math.floor(seconds / 60);   // get minutes
  const secs = Math.floor(seconds % 60);      // get remaining seconds

  // pad with 0 if less than 10
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(secs).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for(let index = 0; index<as.length; index++){
    const element = as[index];
    if(element.href.endsWith(".mp3")){
      songs.push(element.href.split(`/${folder}/`)[1])
    }
  }
  return songs;
}
 
const playMusic = (track,pause=false) =>{
  //let audio = new Audio("/songs/"+track)
 // audio.play()
 currentSong.src = `/${currFolder}/`+track
 if(!pause){
  currentSong.play()
  play.src = "pause.svg"
 }

  let songName = decodeURIComponent(track)  
                    .replace(".mp3", "")
                    .replace("Golden Palms"," ")
 document.querySelector(".songinfo").innerHTML = songName 
 document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {

   songs = await getSongs("songs/ncs");
  playMusic(songs[0],true)
  console.log(songs);
  let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
  for (song of songs) {
    songUL.innerHTML = songUL.innerHTML +
    
    
    `<li data-file="${song}">
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                  <div>${song.replaceAll("%20"," ")
      .replaceAll("The Grey Room "," ")
      .replaceAll(".mp3"," ")
      .replaceAll("%26"," ")
    }</div>
                  <div>harry</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img class="invert" src="play.svg" alt="">
                </div>
              </li>`
    } 
  
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach( e =>{
      e.addEventListener("click", element =>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
       let track = e.getAttribute("data-file");
       playMusic(track);
      })

    })

    play.addEventListener("click", ()=>{
      if(currentSong.paused){
        currentSong.play()
        play.src = "pause.svg"
      }
      else{
        currentSong.pause()
        play.src = "play.svg"
      }
    })
    currentSong.addEventListener("timeupdate",()=>{
      console.log(currentSong.currentTime, currentSong.duration)
      document.querySelector(".songtime").innerHTML = `
      ${secondsToMinutesSeconds(currentSong.currentTime)}/
        ${secondsToMinutesSeconds(currentSong.duration)}
      `
      document.querySelector(".circle").style.left =
      (currentSong.currentTime/currentSong.duration) * 100 + "%";
    })
  
    document.querySelector(".seekbar").addEventListener("click",e=>{
      let percent = (e.offsetX/e.target.getBoundingClientRect().width) *100
      document.querySelector(".circle").style.left = percent + "%"
      currentSong.currentTime = ((currentSong.duration) * percent)/100
      
    })

    document.querySelector(".hamburger").addEventListener("click",()=>{
      document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click",()=>{
      document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click",()=>{
      let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
      if((index-1) >= 0){
        playMusic(songs[index-1])
      }
    })

    next.addEventListener("click",()=>{
         let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
      if((index+1) < songs.length){
        playMusic(songs[index+1])
      }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].
    addEventListener("change",(e)=>{
      currentSong.volume = parseInt(e.target.value)/100
    })
}

main(); 
