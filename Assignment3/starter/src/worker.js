importScripts(
    'math.js',
    'core.js');


onmessage = function(e) {

    const testName = e.data;

    importScripts(testName);
    configureTest(function(test) {

        const buffer = new PixelBuffer(test.width, test.height);

        test.renderer.render(buffer, 1000, function() {
            postMessage(["update", buffer.imgdata]);
        });

        postMessage(["finished", buffer.imgdata]);
    });
}