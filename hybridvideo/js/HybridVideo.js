// HYBRID VIDEO
// DEPENDENT ON HTML STRUCTURE IN index.html

// PARAGRAPHS
var paragraphsInPoints = [];
var paragraphsIDs = [];
var paragraphNumber = 1;
var previousParagraphNumber = 1;

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

// CONTEXTUAL XML
var contextualHtmlInPoints = [];
var contextualHtml = [];

var contextualHtmlNumber = 1;
var previouscontextualHtmlNumber = 1;

var startingSeconds = getQueryVariable("s");

$(document).ready(function()
{
  $("#transcription").load("html/transcription.html");

  $.ajax({
    type: "GET",
    url: "data/captions.xml",
    dataType: "xml",
    success: parseCaptions
  });

  $.ajax({
    type: "GET",
    url: "data/paragraphs.xml",
    dataType: "xml",
    success: parseParagraphs
  });

});

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function parseParagraphs(document){
    
    var i = 0;

    $(document).find("p").each(function(){

        var timecode = $(this).attr('begin');
        var seconds = convertTimeCodeToSeconds(timecode);

        var id = $(this).attr('id');

        paragraphsInPoints[i] = seconds;
        paragraphsIDs[i] = id;
        i += 1;

    });
}

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


    $.ajax({
      type: "GET",
      url: "data/ContextualHtml.xml",
      dataType: "xml",
      success: parseContextualHtml
    });

}

function parseContextualHtml(document){

    var i = 0;

    $(document).find("xtra").each(function(){

        var timecode = $(this).attr('begin');
        var seconds = convertTimeCodeToSeconds(timecode);
        var name = $(this).text();

        contextualHtmlInPoints[i] = seconds;
        contextualHtml[i] = name;

        i += 1;
    });

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

      addActiveClassToTranscript(captionNumber-1);

      removeActiveClassToTranscript(previousCaptionNumber-1);

      previousCaptionNumber = captionNumber;
    }


    // Check If We Need to Change Contextual Html
    if(timeNow >= contextualHtmlInPoints[contextualHtmlNumber-1])
    {

      document.getElementById("xtra").innerHTML = contextualHtml[contextualHtmlNumber-1];

      contextualHtmlNumber += 1;

      previouscontextualHtmlNumber = contextualHtmlNumber;
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


// FIND THE CORRECT CONTEXTUAL HTML IN TIMELINE
function findContextualHtmlNumber(timeNow)
{
    var notFoundYet = true;
    var i = 0;
    var contextualHtmlNo = 0;
    var contextualHtmlLength = contextualHtmlInPoints.length;
    
    while(notFoundYet && i < contextualHtmlLength)
    {
      if(timeNow < contextualHtmlInPoints[i+1])
      {
        contextualHtmlNo = i+1;
        notFoundYet = false;
      }
      i++;
    }
    
    if(timeNow > contextualHtmlInPoints[contextualHtmlLength-1])
    {
      contextualHtmlNo = contextualHtmlLength-1;
    }

    return contextualHtmlNo;
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
  if(startingSeconds != false)
  {
    goToChapter(startingSeconds);
  }
  else
  {
    event.target.playVideo();
  }
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

  // CONTEXTUAL HTML UPDATE
  contextualHtmlNumber = findContextualHtmlNumber(timeNow);

  document.getElementById("xtra").innerHTML = contextualHtml[contextualHtmlNumber-1];

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
  var text = "http://mcluhan.gibraltarwalk.com/hybridvideo/index.html?s=" + Math.round(player.getCurrentTime());
  window.prompt("Copy to clipboard: PC: Ctrl+C, Enter - OSX Cmd+C, Enter", text);
}

// Change Precis Content

function changePrecisContent(chapterNumber)
{
  switch(chapterNumber)
  {
    case 0:
        document.getElementById("precis").innerHTML = "Section descriptions.";
        break;

    // Intro With Steve Kovats
    case 1:
        document.getElementById("precis").innerHTML = "Stephen Kovats provides the context in which the lecture takes places and introduces Graham";
        break;

    // Finally Getting the Message: McLuhan's Media Practice
    case 2:
        document.getElementById("precis").innerHTML = "Introduction. Graham Larkin&rsquo;s take on McLuhan&rsquo;s media practice concerned with the materiality of communications";
        break;

    // Orality
    case 3:
        document.getElementById("precis").innerHTML = "A glimpse into the archival evidence for the pre-literate stage of McLuhan&rsquo;s life";
        break;

    // Reading Writing
    case 4:
        document.getElementById("precis").innerHTML = "Examines the young Marshall&rsquo;s literacy, and his early collections";
        break;

    // Viewing, Listening/Watching
    case 5:
        document.getElementById("precis").innerHTML = "surveys the very detailed evidence for McLuhan&rsquo;s youthful involvement with radio and cinema";
        break;

    // Being a Character
    case 6:
        document.getElementById("precis").innerHTML = "surveys some fresh evidence for McLuhan&rsquo;s interests in rhetoric, including public speaking";
        break;

    // Research Publishing
    case 7:
        document.getElementById("precis").innerHTML = "examines material aspects of McLuhan&rsquo;s scholarly writing, including manuscripts and typescripts for his major publications";
        break;

    // Blow Up
    case 8:
        document.getElementById("precis").innerHTML = "charts McLuhan’s media image throughout the long 1960s";
        break;

    // Epilogue: The Freewheeling Marshall McLuhan
    case 9:
        document.getElementById("precis").innerHTML = "compares McLuhan&rsquo;s media persona to Bob Dylan and other performers exhibiting an improvisatory, devil-may-care attitude";
        break;

    // PUBLICATIONS
    // Mechanical Bride
    case 10:
        document.getElementById("precis").innerHTML = "Marshall McLuhan&rsquo;s first book and a original study in popular culture, composed of a number of short essays that can be read in any order";
        break;

    // Counterblast
    case 11:
        document.getElementById("precis").innerHTML = "More a manifesto than a book, Counterblast is a typographically explosive compilation of short essays and probes (complex ideas compressed into a few thought-provoking words), all of which focus on the effects of media on the human condition";
        break;

    // Understanding Media & The Medium is the Message
    case 12:
        document.getElementById("precis").innerHTML = "";
        break;

    // The McLuhan DEW-Line
    case 13:
        document.getElementById("precis").innerHTML = "Intended to stimulate problem-solving and thinking, in a manner that is also known as ‘thinking-outside-the-box'";
        break;

    // Explorations
    case 14:
        document.getElementById("precis").innerHTML = "Journal together with Edmund Carpenter throughout the 50s. Studies in Cultural Communications";
        break;

    default:
        break;
  }
}


function synchronizeTranscription()
{
  console.log("synchronizeTranscription");

  // Find paragraph number
  var paragraphNumber;

  if(player.getCurrentTime)
  {
    var timeNow = player.getCurrentTime();                
    
    paragraphNumber = findParagraphNumber(timeNow);

    console.log("paragraphNumber = " + paragraphNumber);
  }

  // Highlight paragraph


  // Scroll Text to id
  var scrollToDestination = "#" + paragraphsIDs[paragraphNumber-1];

  console.log("scrollToDestination = " + scrollToDestination);

  $('#transcription').scrollTo(scrollToDestination);


}

// FIND THE CORRECT SLIDE NUMBER IN TIMELINE
function findParagraphNumber(timeNow)
{
    var notFoundYet = true;
    var i = 0;
    var paragraphNo = 0;
    var paragraphsLength = paragraphsInPoints.length;
    
    while(notFoundYet && i < paragraphsLength)
    {
      if(timeNow < paragraphsInPoints[i+1])
      {
        paragraphNo = i+1;
        notFoundYet = false;
      }
      i++;
    }
    
    if(timeNow > paragraphsInPoints[paragraphsLength-1])
    {
      paragraphNo = paragraphsLength-1;
    }

    return paragraphNo;
}


function changeLanguage(index)
{
  console.log("changeLanguage");

  switch(index)
  {
    case 1:
      console.log("English");
      loadEnglish();
      break;

    case 2:
      console.log("French");
      loadFrench();
      break;

    case 3:
      console.log("German");
      loadGerman();
      break;

    default:
      break;
  }
}

function loadEnglish()
{
  $.ajax({
    type: "GET",
    url: "data/captions.xml",
    dataType: "xml",
    success: parseLanguageCaptions
  });

  $("#transcription").load("html/transcription.html");
}


function loadFrench()
{
  $.ajax({
    type: "GET",
    url: "data/captions-F.xml",
    dataType: "xml",
    success: parseLanguageCaptions
  });
  
  $("#transcription").load("html/transcription-F.html");
}

function loadGerman()
{
  $.ajax({
    type: "GET",
    url: "data/captions-D.xml",
    dataType: "xml",
    success: parseLanguageCaptions
  });

  $("#transcription").load("html/transcription-D.html");
}

function parseLanguageCaptions(document){
    
    var i = 0;

    $(document).find("p").each(function(){

        var timecode = $(this).attr('begin');
        var seconds = convertTimeCodeToSeconds(timecode);
        var name = $(this).text();

        captionsInPoints[i] = seconds;
        captionsText[i] = name;

        i += 1;

    });

    changeCaption();    
  }

  function changeCaption()
  {
    document.getElementById("transcription-line").innerHTML = captionsText[captionNumber-1];
  }
