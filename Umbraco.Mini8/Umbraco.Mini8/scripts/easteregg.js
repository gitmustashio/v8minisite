var Umbraco = Umbraco || {};
Umbraco.EasterEgg = (function () {
    var easteregg = {};

    var guess = "";
    var attempts = 0;

    easteregg.Init = function () {
        
        $(document).keypress(function (event) {
           
            // Submit on enter
            if (event.which == 13) {
                $.ajax({
                    url: '/umbraco/api/easteregg/givemeaneasteregg',
                    data: { guess: guess },
                    dataType: 'html',
                    accept: 'text/html',
                    method: 'get'
                }).done(function (html) {
                    $('body').append(html);

                    if (!html || 0 === html.length) {
                        attempts++;
                        if (attempts > 2) {
                            (function ($) { $.extend({ playSound: function () { return $('<audio autoplay="autoplay" style="display:none;">' + '<source src="' + arguments[0] + '.mp3" />' + '<source src="' + arguments[0] + '.ogg" />' + '<embed src="' + arguments[0] + '.mp3" hidden="true" autostart="true" loop="false" class="playSound" />' + '</audio>').appendTo('body'); } }); })(jQuery);
                            $.playSound('/images/trombone');
                        }
                    }
                    else {
                        attempts = 0;
                    }
                })
                guess = "";
            }
            else {
                guess += String.fromCharCode(event.which);
            }
        });
    }
    return easteregg;
})();