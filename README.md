# bubbles
Vanilla instance of the Hybrid Lecture Player


# The Hybrid Lecture Player

The Hybrid Lecture player is a platform that allows you to turn your lecture documentation into a multi-format publication tool with features such as subtitle transcription, transcription in prose form, translations, and embedded lecture material such as images, audio and visual files. Everything is synched and information can be accessed via multiple channels, through custom tables of contents and sections.

Here is a map of the features that the Hybrid Lecture Player proposes:

![The Hybrid Lecture Player](http://hpg.io/img/HLP-white.png)

## This repository contains the following folders and files

    
    ├── css                                   ==> style folder
    │   └── app.css                           style of the Hybrid Lecture Player
    ├── data                                  ==> captions, slides and synchronization folder
    │   ├── captions.xml                      file where the captions are encoded
    │   ├── captions-LanguageCode.xml         captions in various languages
    │   ├── ContextualHtml.xml                file where the additional materials are encoded 
    │   │                                     (bottom-right box)
    │   ├── paragraphs.xml                    synchronization of the paragraphs and the video’s timeline
    │   └── SlidesInPoints.xml                synchronization of the slides and the video’s timeline
    ├── html                                  ==> transcriptions folder
    │   ├── transcription.html                file where the transcription is encoded
    │   └── transcription-LanguageCode.html   transcription in various languages
    ├── images                                ==> slides folder
    │   └── …
    ├── index.html                            the structure of the Hybrid Lecture Player’s page
    └── js                                    ==> javascript folder
        ├── HybridVideo.js                    the heart of the Player: synchronization scripts
        └── scrollTo                          automatic scrolling in the transcription


You can download this repository and start using it on your computer, opening the file index.html in your favorite browser to see a local preview of the Hybrid Lecture Player. We recommend the use of Firefox, as the preview doesn’t work well in all browsers.

To produce the subtitles, we use the open source subtitle editor Amara http://www.amara.org/fr/.

The rest is simply html and javascript!

For the moment, we use Youtube for the video part of the Hybrid Lecture Player. If you want to serve your video on your own server, you can also use Pandora, which is our next step for the Hybrid Lecture Player. But things still need to be set for Pandora.


# Using the Hybrid Lecture Player

## embedding a video

In the folder `js`, find the `HybridVideo.js` file and open it in your favourite text editor.

In the part starting on line 408 in `HybridVideo.js`, line 411 indicates the id of the Youtube video. The id of a youtube video is visible at the end of its url. For instance: https://www.youtube.com/watch?v=z-WG3biOXto

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

Change `videoId: 'z-WG3biOXto',` to the correct YouTube video id.

## adding subtitles

Exporting subtitles from Amara to create captions in 'Captions.xml'
From Amara export the subtitles as .dxfp, save it somewhere on your computer, and open it in a text editor.
Select all the <p> tags that are inside <body region="bottom"><div> (without the <div> around) and copy them.

In the folder `data`, find the `captions.xml` file and open it in a text editor.
Paste the selection from the .dxfp file into the `captions.xml` file, inside the <div xml:id="captions"></div> tag. When editing the .xml file, the structure of the data should be kept the same, all tags should retain their attributes.

When the captions don’t start immediately at the beginning, the first caption displayed will be an error message.
(whenever there is nothing during a time period, it displays the message)
You can manually add an information that replaces the error message 
For instance:
    <p begin="00:00:00.000" end="00:00:37.563">Subtitles will start at 00:37</p>
    <p begin="00:00:37.564" end="00:00:37.946">(The content starts here!)</p>

## adding slides

Edit the file `SlideInPoints.xml` in the folder `data` to change the inpoints of the slides. Make sure the inpoints are sequential and in the correct format e.g. `00:00:00.000`, `00:00:05.500` etc. If they are not then this will cause problems.

It doesn't matter how many are there and at present the `id` addtributes are not used and these do not need to be sequential (for the moment).

The slide images should all be contained in the `images` folder, these do not need to be named in any particular format.
Their resolution must be of 1000px x 750px 72 dpi

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
