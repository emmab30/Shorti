/* var isLocal = true; */
var isLoading = false;
var intervalProgress = null;

var API_URL = `https://shorti.io/api/v1`
/* if(isLocal)
    API_URL = `http://localhost:3333/api/v1` */

$(document).ready(() => {

    $('.copy-button').click((e) => {
        e.preventDefault();

        // Hide the focus on the text input
        $('input[name=link]').blur()

        if(copyToClipboard(document.getElementById('short_link'))) {
            $('.copy-button').addClass('copied');
            $('.copy-button').text('COPIED');

            iziToast.success({
                title: 'Copied!',
                message: 'The link has been copied to your clipboard',
            });
        }
    })

    $("input[name=link]").on('keyup', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            $('.simplify').click();
            $('input[name=link]').blur()
        }
    });
    
    $('.simplify').click((e) => {
        e.preventDefault();

        setLoading(true);
        showError(null);

        var postBody = {
            long_link: $('input[name=link]').val()
        };
        $.ajax({
            method: 'POST',
            url: `${API_URL}/links/generate`,
            dataType: 'json',
            contentType : 'application/json',
            data: JSON.stringify(postBody)
        }).done((data) => {
            if(data.success) {
                // Good! Append to the table
                setLoading(false, false);
                showLink(data.short_link);
            } else {
                showError(data.message);
                setLoading(false, true);
            }
        }).fail((error) => {
            setLoading(false, true);
        }).always(() => {
            // 
        })

        /* setLoading(true);
        setTimeout(() => {
            setLoading(false);

            $('input[name=link]').text('');
        }, 5000); */
    })

    function showLink(shortLink) {
        $('.got-link-container').fadeIn();
        $('.got-link #short_link').text(shortLink);
        $('.got-link #short_link').attr('href', shortLink);

        setTimeout(() => {
            let offset = 50;
            $('html, body').animate({
                scrollTop: $(".got-link-container").offset().top + 50
            }, 500);
        }, 500);
    }

    function showError(text) {
        if(text == null) {
            $('.error-message').fadeOut();
        } else {
            $('.error-message').text(text);
            $('.error-message').fadeIn();
        }
    }

    function setLoading(loading, isError = false) {
        let widthBar = parseInt($('.input100').width());

        if(loading) {
            isLoading = true;
            // update progress bar every 0.5 second
            let progress = 0;
            $('.progress-conversion').css({ width : 0 });
            $('.progress-conversion').fadeIn();

            function increase() {
                let sumPercent = 15 * widthBar / 100;
                if(progress == 0) {
                    progress = sumPercent;
                } else {
                    progress = progress + sumPercent;
                }

                $('.progress-conversion').animate({
                    width: progress
                }, {
                    duration: "fast"
                });
            }
            
            setTimeout(() => {
                increase();
            }, 50);
            intervalProgress = setInterval(() => {
                increase();

                if(progress >= widthBar) {
                    clearInterval(intervalProgress);
                }
            }, 500);
        } else {
            if(isLoading) {
                $('.progress-conversion').animate({
                    width: (widthBar * 1.05)
                });

                $('.progress-conversion').css({
                    'background-color': isError ? 'rgba(244,109,68,.4)' : 'rgba(3,131,0,.4)'
                });

                setTimeout(() => {
                    $('.progress-conversion').css({
                        'background-color': 'transparent'
                    });
                    
                    setTimeout(() => {
                        $('.progress-conversion').fadeOut();
                    }, 500);
                }, 1000);

                clearInterval(intervalProgress);
                intervalProgress = null;
            }
        }
    }

    function copyToClipboard(elem) {
        // create hidden text element, if it doesn't already exist
        var targetId = "_hiddenCopyText_";
        var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
        var origSelectionStart, origSelectionEnd;
        if (isInput) {
            // can just use the original source element for the selection and copy
            target = elem;
            origSelectionStart = elem.selectionStart;
            origSelectionEnd = elem.selectionEnd;
        } else {
            // must use a temporary form element for the selection and copy
            target = document.getElementById(targetId);
            if (!target) {
                var target = document.createElement("textarea");
                target.style.position = "absolute";
                target.style.left = "-9999px";
                target.style.top = "0";
                target.id = targetId;
                document.body.appendChild(target);
            }
            target.textContent = elem.textContent;
        }
        // select the content
        var currentFocus = document.activeElement;
        target.focus();
        target.setSelectionRange(0, target.value.length);
        
        // copy the selection
        var succeed;
        try {
            succeed = document.execCommand("copy");
            target.blur();
            currentFocus.focus();
        } catch(e) {
            succeed = false;
        }
        
        /* // restore original focus
        if (currentFocus && typeof currentFocus.focus === "function") {
            currentFocus.focus();
        }
        
        if (isInput) {
            // restore prior selection
            elem.setSelectionRange(origSelectionStart, origSelectionEnd);
        } else {
            // clear temporary content
            target.textContent = "";
        } */

        return succeed;
    }
});