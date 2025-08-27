console.log("lets write some javascript");
async function getSongs(){
  let a = await fetch("http://127.0.0.1:5500/songs/")
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for(let index = 0; index<as.length; index++){
    const element = as[index];
    if(element.href.endsWith(".mp3")){
      songs.push(element.href.split("/songs/")[1])
    }
  }
  return songs;
}
 
const playMusic = (track) =>{
  let audio = new Audio("/songs/"+track)
  audio.play()
}

async function main() {
  let currentSong;
  let songs = await getSongs();
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
}

main(); 