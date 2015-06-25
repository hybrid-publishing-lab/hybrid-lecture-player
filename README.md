# bubbles
Vanilla instance of the Hybrid Lecture Player


# The Hybrid Lecture Player

The Hybrid Lecture player is a platform that allows you to turn your lecture documentation into a multi-format publication tool with features such as subtitle transcription, transcription in prose form, translations, and embedded lecture material such as images, audio and visual files. Everything is synched and information can be accessed via multiple channels, through custom tables of contents and sections.

Here is a map of the features that the Hybrid Lecture Player proposes:

![The Hybrid Lecture Player](http://hpg.io/img/HLP-white.png)

## This repository contains the following folders and files

    .
    ├── css                                   ==> 
    │   └── app.css                           style of the Hybrid Lecture Player
    ├── data                                  ==> 
    │   ├── captions.xml                      file where the captions are encoded
    │   ├── captions-LanguageCode.xml         captions in various languages
    │   ├── ContextualHtml.xml                file where the additional materials are encoded (bottom-right box)
    │   ├── paragraphs.xml                    synchronization of the paragraphs and the video’s timeline
    │   └── SlidesInPoints.xml                synchronization of the slides and the video’s timeline
    ├── html                                  ==> 
    │   ├── transcription.html                file where the transcription is encoded
    │   └── transcription-LanguageCode.html   transcription in various languages
    ├── images                                ==> slides
    │   └── …
    ├── index.html                            the structure of the Hybrid Lecture Player’s page
    ├── js                                    ==> 
        ├── HybridVideo.js                    the heart of the Player!
        └── scrollTo                          …

# Using the Hybrid Lecture Player

When editing the .xml the structure of the data should be kept the same, all tags should retain their attributes.

1. Exporting subtitles from Amara to create captions 'Captions.xml'
Form Amara export the subtitles as .dxfp
Copy all the <p> tags inside <body region="bottom"><div>
Paste these into 'data/Captions.xml' inside the <div xml:id="captions"></div> tag
Make sure you delete the extra <div></div> s that are added by Amara (for some reason it is dividing the <p> s into sections

2. Adding a new video to a new instance of the player
line starting 408 in HybridVideo.js

<pre>
	player = new YT.Player('player', {
    		height: '390',
    		width: '640',
    		videoId: 'z-WG3biOXto',
    		events: {
      			'onReady': onPlayerReady,
      			'onStateChange': onPlayerStateChange
    		},
    		playerVars: {
         	'showinfo' : 0,
         	'autohide': 1
    		}
  	});
</pre>

	Change
	videoId: 'z-WG3biOXto', 
	to the correct YouTube video id.

3. Slide In Points
Edit the file 'data/SlideInPoints.xml' to change the inpoints of the slides. Make sure the inpoints are sequential and in the correct format e.g. '00:00:00.000', '00:00:05.500' etc... . If they are not then this will cause problems.

	It doesn't matter how many are there and at present the 'id' addtributes are not used and these do not need to be sequential

	The slide images should all be contained in the 'images' folder, these do not need to be named in any particular format.

4. Change Title
In index.html edit lines 48 and 49 to change the title

5. Change Chapter Heading Titles and Chapter Precis Content
In 'index.html' change the <span> content inside the divs with class attribute 'chapter-title' to change the .

Set the inpoint of the chapter in seconds inside the attribute 'onclick' i.e. onclick="goToChapter(764)"

	To change the precis content edit the HybridVideo.js file inside  'function changePrecisContent(chapterNumber)' on line 518. The numbers in the switch statement should correspond to those in the (for example) 'onmouseover="changePrecisContent(2)"' in index.html.

6. Full Transcript
The full transcript can be found in 'html/transcript.html'.

To create this file you need to copy all the <p> tags from 'data/captions.xml', do a find and replace and paste them into this document.

Each span should have the attribute 'onclick="goToSentence(this)"'. Use find and replace to add this to each span.

You will need to add an id attribute to each span in the format 'id="lineID0001"' where there are 4 digits for the lineID number.

So each line should be in this format:
<span id="lineID0001" begin="00:00:03.436" end="00:00:05.748" onclick="goToSentence(this)">So, ladies and gentleman. Let’s take a seat.</span>
<span id="lineID0002" begin="00:00:05.748" end="00:00:07.303" onclick="goToSentence(this)">We will be starting shortly.</span>
etc...

You can add your own html to break it into paragraphs and add headings, the important things is to keep the ids continuous and sequential.

7. Other
Additional linked material
8. Other
