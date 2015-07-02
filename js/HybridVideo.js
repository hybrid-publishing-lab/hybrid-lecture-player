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

// Add your base url with 'index.html' for the webpage to display the citations with
var citationUrl = "index.html";

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

  $( ".credits" ).click(function() {
    $( "#footer_slide" ).slideToggle( "slow");
    $('html, body').animate({
        scrollTop: $("#footer_slide").offset().top + $('window').height()
    }, 2000);
    $( this ).toggleClass( "slide_up" );
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

    // If position has advanced beyond the next slide
    if(timeNow >= slideInPoints[slideNumber + 1])
    {
      // console.log("slideNumber = " + slideNumber);
      // console.log("slideInPoints[slideNumber + 1] = " + slideInPoints[slideNumber + 1]);
      // console.log("checkAndChangeSlideAndText()");
      // console.log("timeNow = " + timeNow);

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
    else
    // Check if we have moved to the next slide
    {
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
        console.log("addActiveClassToTranscript(captionNumber-1);");

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

  //$('#foo').addClass('class_two');

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


// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  //console.log('onYouTubeIframeAPIReady');

  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: '9SEC2hWMWG0',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    },
    playerVars: {
         'showinfo' : 0,
         'autohide': 1
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

  console.log("function onPlayerStateChange(event) {");
  console.log("timeNow = " + timeNow);

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
  var text = citationUrl + "?s=" + Math.round(player.getCurrentTime());
  window.prompt("Copy to clipboard: PC: Ctrl+C, Enter - OSX Cmd+C, Enter", text);
}

// Change Precis Content

function changePrecisContent(chapterNumber)
{
  switch(chapterNumber)
  {
    // Default text when the mouse is not on the sections (same as in index.html : short description about the whole lecture/project)
    case 0:
        document.getElementById("precis").innerHTML = "Description: A guided tour in the Hybrid Lecture Player, multi-format publication tool.";
        break;

    // SECTION 1 : BEGINNING
    case 1:
        document.getElementById("precis").innerHTML = "The guided tour of the Hybrid Lecture Player starts here";
        break;

    // SECTION 2: OVERVIEW
    case 2:
        document.getElementById("precis").innerHTML = "Overview of the Hybrid Lecture Player";
        break;

    // SECTION 3: VIDEO, SLIDES AND SUBTITLES
    case 3:
        document.getElementById("precis").innerHTML = "The Hybrid Lecture Player displays a video, subtitles, and associated images (like slides)";
        break;

    // SECTION 4: TRANSCRIPTION TEXT
    case 4:
        document.getElementById("precis").innerHTML = "The Hybrid Lecture Player also allows the user to read a full text transcription of the video";
        break;

    // SECTION 5 ADDITIONAL MATERIALS
    case 5:
        document.getElementById("precis").innerHTML = "… and much more, like aditional materials related to the main story";
        break;

    // SECTION 6: CUSTOM ENTRY POINTS
    case 6:
        document.getElementById("precis").innerHTML = "The Hybrid Lecture Player’s customizable entry points (sections, chapters…)";
        break;

    // SECTION 7: SYNC.
    case 7:
        document.getElementById("precis").innerHTML = "All the elements in the Hybrid Lecture Player are synchronized";
        break;

    // SECTION 8: PRINT + PDF
    case 8:
        document.getElementById("precis").innerHTML = "The Hybrid Lecture Player’s print and pdf option";
        break;

    // SECTION 9: THE END
    case 9:
        document.getElementById("precis").innerHTML = "Now the fun starts!";
        break;

    // CUSTOM SECTIONS
    // CUSTOM SECTION A
    case 10:
        document.getElementById("precis").innerHTML = "Description of CUSTOM SECTION A";
        break;

    // CUSTOM SECTION B
    case 11:
        document.getElementById("precis").innerHTML = "Description of CUSTOM SECTION B";
        break;

    // CUSTOM SECTION C
    case 12:
        document.getElementById("precis").innerHTML = "Description of CUSTOM SECTION C";
        break;

    default:
        break;
  }
}


function synchronizeTranscription()
{
  // Find paragraph number
  var paragraphNumber;

  if(player.getCurrentTime)
  {
    var timeNow = player.getCurrentTime();

    paragraphNumber = findParagraphNumber(timeNow);
  }

  // Highlight paragraph


  // Scroll Text to id
  var scrollToDestination = "#" + paragraphsIDs[paragraphNumber-1];

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
  switch(index)
  {
    case 1:
      loadEnglish();
      break;

    case 2:
      loadSpanish();
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

function loadSpanish()
{
  $.ajax({
    type: "GET",
    url: "data/captions-ES.xml",
    dataType: "xml",
    success: parseLanguageCaptions
  });

  $("#transcription").load("html/transcription-ES.html");
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
