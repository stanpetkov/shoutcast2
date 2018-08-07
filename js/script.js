/*
 *
 *  Works only with Shoutcast v.2 !!!
 *
 */

var obj = {

  // common properties from user input

  props: () => {
    ip,
    width,
    height,
    songSize,
    bandNameSize,
    borderRound
  },

  // play/pause radio
  play: () => {

    $('#play-button').on('click', function() {
      var radio = $('audio');

      if (radio[0].paused == false) {
        radio[0].pause();
        $('#play-button').attr("src", "images/play.png");

      } else {
        radio[0].play();
        $('#play-button').attr("src", "images/pause.png");
      }
    });

    $('audio').attr('src', obj.props.ip + '/;');

  },

   /*
   *  @param elem - element
   *  @param prop - css property
   *  @param value - set the value
   *
   */
  setCSS: (elem, prop, value) => {
    elem.css(prop, value);
  },

  // basic functionality
  options: () => {

    var artistImage = $('#artist-image'),
        controls = $('.controls'),
        radioName = $('.radio-name'),
        controlsSong = $('.controls .song'),
        controlsBand = $('.controls .band'),
        radio = $('audio'),
        imageLink = "",
        artistNameAndSong = "";

    // get shoutcast info
    $.get("https://api.codetabs.com/cors-proxy/" + obj.props.ip + "", function(data) {

    var result = $(data).find("a[href^='current']").text(),
        artistName = artistNameAndSong.slice(0, artistNameAndSong.indexOf("-")),
        songName = result.substr(result.indexOf("-") + 2),
        streamName = data.substr(data.indexOf("Name:") + 104),
        streamNameResult = streamName.substr(0, streamName.indexOf('</a>')),
        songSize = $('.song'),
        bandNameSize = $('.band'),
        containerFluid = $('.container-fluid');

    artistNameAndSong = result.substr(result.indexOf("g:") + 1);
    artistName = result.substr(0, result.indexOf(' -')).trim();
    artistName.trim();

    // get lastfm API info
    $.ajax({

        url: "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + artistName + "&api_key=f2fdf80e5371efdc89a3ab2cbc670d77&format=json",

        success: function(data) {

          // set default image, if artist image not found
          if (typeof data.artist === 'undefined' || data.artist.image[4]["#text"] == '') {
            imageLink = 'images/noImage.jpg';
          } else {
            imageLink = data.artist.image[4]["#text"];
          }

          //set css styles to elements
          obj.setCSS(artistImage, 'background-image', 'url(' + imageLink + ')');
          obj.setCSS(bandNameSize, 'font-size', obj.props.bandNameSize + 'px');
          obj.setCSS(songSize, 'font-size', obj.props.songSize + 'px');
          obj.setCSS(containerFluid, 'border-radius', obj.props.borderRound + 'px');

          // set data to html element
          controlsSong.text('**' + songName + '**');
          controlsBand.text(artistName);
          radioName.text(streamNameResult);

        }
        });
    });
  }
}

// repeat every 5 seconds

setInterval(function() {
  obj.options();
}, 5000);
