
let songs = [];
let currFolder = "";
  let currentSong = new Audio;
  let play = document.getElementById("play");
  const previous = document.getElementById("previous");
  const next = document.getElementById("next");
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

async function getSongs(folder) {
  const folderName = folder.split("/").pop(); // e.g., "ncs"
  currFolder = folderName;

  const response = await fetch("/songs.json");  // fetch JSON
  const data = await response.json();

  const songs = data[folderName] || [];
  return songs;
}

 
const playMusic = (track, pause = false) => {
  currentSong.src = `/songs/${currFolder}/${track}`;

  if (!pause) {
    currentSong.play()
      .then(() => play.src = "pause.svg")
      .catch(err => console.warn("Autoplay blocked:", err));
  }

  let songName = decodeURIComponent(track)
    .replace(".mp3", "")
    .replace(/[_-]/g, " ");

  document.querySelector(".songinfo").innerHTML = songName;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

function updateSongListUI(songs) {
  const songUL = document.querySelector(".songList ul");
  songUL.innerHTML = ""; // clear old list

  for (const song of songs) {
    songUL.innerHTML += `
      <li data-file="${song}">
        <img class="invert" src="music.svg" alt="">
        <div class="info">${song.replace(".mp3", "")}</div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="play.svg" alt="">
        </div>
      </li>
    `;
  }

  // Add click event for each song
  Array.from(songUL.getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", () => {
      let track = e.getAttribute("data-file");
      playMusic(track);
    });
  });
}


async function main() {
  // Load songs from JSON
  songs = await getSongs("songs/ncs");

  if(songs.length > 0){
    playMusic(songs[0], true); // load first song silently
  }

  // Populate song list UI
  updateSongListUI(songs);

  // Play/Pause button
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });

  // Update song time
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML =
      `${secondsToMinutesSeconds(currentSong.currentTime)}/` +
      `${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Seek bar click
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Previous / Next
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index - 1) >= 0) playMusic(songs[index - 1]);
  });
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index + 1) < songs.length) playMusic(songs[index + 1]);
  });

  // Volume slider
  document.querySelector(".range input").addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
  });

  // Folder cards
  document.querySelectorAll('.cardContainer .card').forEach(card => {
    card.addEventListener('click', async () => {
      const folder = card.dataset.folder;
      if (folder) {
        songs = await getSongs(folder);
        if (songs.length > 0) {
          playMusic(songs[0]);
          updateSongListUI(songs);
        } else {
          console.warn("No songs found in folder:", folder);
        }
      } else {
        console.warn("Card missing data-folder attribute");
      }
    });
  });
}

window.addEventListener("DOMContentLoaded", main);


