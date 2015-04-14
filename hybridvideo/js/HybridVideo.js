// HYBRID VIDEO
// DEPENDENT ON HTML STRUCTURE IN index.html

// SLIDES
var slideInPoints = [];
var slideNames = [];

var slideNumber = 1;
var lastCheckSeconds = 0;

//CAPTIONS
var captionsInPoints = [];
var captionsText = [];

var captionNumber = 1;
var previousCaptionNumber = 1;

$(document).ready(function()
{
  $("#transcription").load("html/transcription.html");

  $.ajax({
    type: "GET",
    url: "data/captions.xml",
    dataType: "xml",
    success: parseCaptions
  });

});

function parseSlides(document){
    
    var i = 0;

    $(document).find("slide").each(function(){

        var timecode = $(this).attr('inpoint');
        var seconds = convertTimeCodeToSeconds(timecode);
        var name = $(this).text();

        slideInPoints[i] = seconds;
        slideNames[i] = name;

        i += 1;
    });

    // console.log("slideInPoints = " + slideInPoints);
    // console.log("slideNames = " + slideNames);

    var timerid = setInterval(checkAndChangeSlideAndText, 50);
}


function parseCaptions(document){
    
    var i = 0;

    $(document).find("p").each(function(){

        var timecode = $(this).attr('begin');
        var seconds = convertTimeCodeToSeconds(timecode);
        var name = $(this).text();

        captionsInPoints[i] = seconds;
        captionsText[i] = name;

        i += 1;

    });

    $.ajax({
      type: "GET",
      url: "data/SlidesInPoints.xml",
      dataType: "xml",
      success: parseSlides
    });
}

// CHANGE SLIDE AND TEXT IF PROGRESSED TO NEXT SLIDE OR TEXT
function checkAndChangeSlideAndText()
{

  // CHANGE SLIDE IF REQUIRED
  if(player.getCurrentTime)
  {
    var timeNow = player.getCurrentTime();                
    
    // Check If We Need to Change Slides
    if(timeNow >= slideInPoints[slideNumber])
    {
      var slideSource = 'images/' + slideNames[slideNumber];
      document.getElementById("img").src = slideSource;

      slideNumber += 1;
    }

    // Check If We Need to Change Captions
    if(timeNow >= captionsInPoints[captionNumber-1])
    {

      document.getElementById("transcription-line").innerHTML = captionsText[captionNumber-1];

      captionNumber += 1;

      console.log("captionNumber = " + captionNumber);
      addActiveClassToTranscript(captionNumber-1);

      removeActiveClassToTranscript(previousCaptionNumber-1);

      previousCaptionNumber = captionNumber;
    }
  }

  
}


function addActiveClassToTranscript(captionNumber)
{
  var captionID;

  if(captionNumber < 10)
  {
    captionID = "#lineID000" + captionNumber;
  }

  if(captionNumber >= 10 && captionNumber < 100)
  {
    captionID = "#lineID00" + captionNumber;
  }

  if(captionNumber >= 100 && captionNumber < 1000)
  {
    captionID = "#lineID0" + captionNumber;
  }

  if(captionNumber >= 1000)
  {
    captionID = "#lineID" + captionNumber;
  }

  $('#foo').addClass('class_two');

  $(captionID).addClass("active");

}

function removeActiveClassToTranscript(captionNumber)
{
  var captionID;

  if(captionNumber < 10)
  {
    captionID = "#lineID000" + captionNumber;
  }

  if(captionNumber >= 10 && captionNumber < 100)
  {
    captionID = "#lineID00" + captionNumber;
  }

  if(captionNumber >= 100 && captionNumber < 1000)
  {
    captionID = "#lineID0" + captionNumber;
  }

  if(captionNumber >= 1000)
  {
    captionID = "#lineID" + captionNumber;
  }

  $('#foo').removeClass('class_two');

  $(captionID).removeClass("active");

}



// FIND THE CORRECT SLIDE NUMBER IN TIMELINE
function findSlideNumber(timeNow)
{
    var notFoundYet = true;
    var i = 0;
    var slideNo = 0;
    var slidesLength = slideInPoints.length;
    
    while(notFoundYet && i < slidesLength)
    {
      if(timeNow < slideInPoints[i+1])
      {
        slideNo = i+1;
        notFoundYet = false;
      }
      i++;
    }
    
    if(timeNow > slideInPoints[slidesLength-1])
    {
      slideNo = slidesLength-1;
    }

    return slideNo;
}


// FIND THE CORRECT CAPTION NUMBER IN TIMELINE
function findCaptionNumber(timeNow)
{
    var notFoundYet = true;
    var i = 0;
    var captionNo = 0;
    var captionsLength = captionsInPoints.length;
    
    while(notFoundYet && i < captionsLength)
    {
      if(timeNow < captionsInPoints[i+1])
      {
        captionNo = i+1;
        notFoundYet = false;
      }
      i++;
    }
    
    if(timeNow > captionsInPoints[captionsLength-1])
    {
      captionNo = captionsLength-1;
    }

    return captionNo;
}

// CONVERT TIMECODE STRING TO SECONDS NUMBER
function convertTimeCodeToSeconds(timeString)
{
  var timeArray = timeString.split(":");
  var hours = Number(timeArray[0]) * 60 * 60;
  var minutes = Number(timeArray[1]) * 60;
  var seconds = Number(timeArray[2]);
  
  var totalTime = hours + minutes + seconds;
  return totalTime;
}

// var xml = $.parseXML('data/captions.xml');
// var $xml = $( xml );
// var $test = $xml.find('captions');

// console.log($test);
  // Output:
  // The Reddest
  // The Hairiest
  // The Tallest
  // The Fattest


// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  console.log('onYouTubeIframeAPIReady');

  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'ySI1OMBhPgQ',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    
    // setTimeout(stopVideo, 6000);
    // done = true;
  }

  var timeNow = player.getCurrentTime();

  // SLIDE UPDATE
  slideNumber = findSlideNumber(timeNow);

  var slideSource = 'images/' + slideNames[slideNumber-1];
  document.getElementById("img").src = slideSource;

  // CAPTION UPDATE
  captionNumber = findCaptionNumber(timeNow);

  document.getElementById("transcription-line").innerHTML = captionsText[captionNumber-1];

}

// STOP VIDEO
function stopVideo() {
  player.stopVideo();
}

function goToChapter(secondsPosition)
{
  // SLIDE UPDATE
  slideNumber = findSlideNumber(secondsPosition);

  var slideSource = 'images/' + slideNames[slideNumber-1];
  document.getElementById("img").src = slideSource;

  // CAPTION UPDATE
  captionNumber = findCaptionNumber(secondsPosition);

  document.getElementById("transcription-line").innerHTML = captionsText[captionNumber-1];

  player.seekTo(secondsPosition);
}

function goToSentence(e)
{
  var secondsPosition = convertTimeCodeToSeconds(e.getAttribute("begin"));

  // SLIDE UPDATE
  slideNumber = findSlideNumber(secondsPosition);

  var slideSource = 'images/' + slideNames[slideNumber-1];
  document.getElementById("img").src = slideSource;

  // CAPTION UPDATE
  captionNumber = findCaptionNumber(secondsPosition);

  document.getElementById("transcription-line").innerHTML = captionsText[captionNumber-1];

  player.seekTo(secondsPosition);
}

// Make Citation
function makeCitation()
{
  var text = "http://mcluhan.gibraltarwalk.com/hybridvideo/index.html?s=" + player.getCurrentTime();
  window.prompt("Copy to clipboard: PC: Ctrl+C, Enter - OSX Cmd+C, Enter", text);
}






