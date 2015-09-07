var iframeElement;

// Add event listener to reveal.js slide changes
Reveal.addEventListener('slidechanged', function(event) {
    // event.previousSlide, event.currentSlide, event.indexh, event.indexv

    if (iframeElement) {
        iframeElement.remove();
        iframeElement = null;
    }
    
    var photoCredits = $(event.currentSlide).attr('data-photo-credits');
    if (photoCredits) {
        $('.photo-credits').html('Photo credits: ' + photoCredits);
    }
});

// Add event listener to reveal.js fragments
Reveal.addEventListener('fragmentshown', function(event) {
    // event.fragment = the fragment DOM element

    var iframeSrc = $(event.fragment).attr('data-add-iframe');
    if (iframeSrc) {
        iframeElement = $('<iframe />', {
            name: 'iframe',
            class: 'iframe-container',
            frameborder: 0,
            src: iframeSrc
        });
        iframeElement.appendTo('.reveal');
    }
});

function runCode(element) {
    var container = $(element).closest('section');
    var codeToExecute = $(container.find('.code').get(0)).text();
    var outputContainer = $(container.find('.output').get(0));
    
    outputContainer.text('');
    
    console.log('runCode', codeToExecute);
    
    try {
        eval(codeToExecute);
    } catch (error) {
        print('Error: ' + error);
    }
    
    function print(value) {
        console.log('print', value);
        outputContainer.append(value + "\n");
    }
}
