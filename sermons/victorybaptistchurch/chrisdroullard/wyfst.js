let currentMusic = 0;

let songs = [
    {
        name: 'When Your Faith Stands Trail',
        path: 'https://res.cloudinary.com/scripturealone/video/upload/v1648171279/Victory%20Baptist%20Church/3_21_21_sun_am_when_your_fatih_stands_trail_pastor_ph2goe.mp3',
        artist: 'Chris Droullard',
        cover: '/images/audioplayer/chris-ap.jpg'
    }
]

const music = document.querySelector('#audio');

const seekBar = document.querySelector('.seek-bar');
const songName = document.querySelector('.music-name');
const artistName = document.querySelector('.artist-name');
const disk = document.querySelector('.disk');
const currentTime = document.querySelector('.current-time');
const musicDuration = document.querySelector('.song-duration');
const playBtn = document.querySelector('.play-btn');
const forwardBtn = document.querySelector('.forward-btn');
const backwardBtn = document.querySelector('.backward-btn');

// setup music

const setMusic = (i) => {
    seekBar.value = 0; // set range slide value to 0;
    let song = songs[i];
    currentMusic = i;
    music.src = song.path;

    songName.innerHTML = song.name;
    artistName.innerHTML = song.artist;
    disk.style.backgroundImage = `url('${song.cover}')`;

    currentTime.innerHTML = '00:00';
    setTimeout(() => {
        seekBar.max = music.duration;
        musicDuration.innerHTML = formatTime(music.duration);
    }, 300);
}

setMusic(0);

// formatting time in min and seconds format

const formatTime = (time) => {
    let min = Math.floor(time / 60);
    if(min < 10){
        min = `0${min}`;
    }
    let sec = Math.floor(time % 60);
    if(sec < 10){
        sec = `0${sec}`;
    }
    return `${min} : ${sec}`;
}

playBtn.addEventListener('click', () => {
    if(playBtn.className.includes('pause')){
        music.play();
    } else{
        music.pause();
    }
    playBtn.classList.toggle('pause');
    disk.classList.toggle('play');
})

// seek bar
setInterval(() => {
    seekBar.value = music.currentTime;
    currentTime.innerHTML = formatTime(music.currentTime);
}, 500)

seekBar.addEventListener('change', () => {
    music.currentTime = seekBar.value;
})

// forward and backward button
forwardBtn.addEventListener('click', () => {
    if(currentMusic >= songs.length - 1){
        currentMusic = 0;
    } else{
        currentMusic++;
    }
    setMusic(currentMusic);
    playMusic();
})

backwardBtn.addEventListener('click', () => {
    if(currentMusic <= 0){
        currentMusic = songs.length - 1;
    } else{
        currentMusic--;
    }
    setMusic(currentMusic);
    playMusic();
})

const playMusic = () => {
    music.play();
    playBtn.classList.remove('pause');
    disk.classList.add('play');
}

setInterval(() => {
    seekBar.value = music.currentTime;
    currentTime.innerHTML = formatTime(music.currentTime);
    if(Math.floor(music.currentTime) == Math.floor(seekBar.max)){
        forwardBtn.click();
    }
}, 500)

function rewindAudio() {
    // Check for audio element support.
    if (window.HTMLAudioElement) {
    try {
    var oAudio = document.getElementById('audio');
    oAudio.currentTime -= 10.0;
    }
    catch (e) {
    // Fail silently but show in F12 developer tools console
    if(window.console && console.error("Error:" + e));
    }
    }
    }

function forwardAudio() {// Check for audio element support.
    if (window.HTMLAudioElement) {
    try {
    var oAudio = document.getElementById('audio');
    oAudio.currentTime += 10.0;
    }
    catch (e) {
    // Fail silently but show in F12 developer tools console
    if(window.console && console.error("Error:" + e));
    }
    }
    }