const vids = document.getElementsByTagName("video");

// there can be more than one video in a page
for (let vid of vids) {
    const canva = document.createElement("canvas");
    canva.style.height = vid.style.height;
    canva.style.width = vid.style.width;
    canva.style.visibility = "hidden";
    document.body.prepend(canva)

    const ctx = canva.getContext("2d");

    let width = canva.width;
    let height = canva.height;

    let shouldInvert = false;

    const updateCanvas: VideoFrameRequestCallback = () => {
        ctx?.drawImage(vid, 0, 0, width, height);
        // let imgURL = canva.toDataURL();
        // here do the checking of color and based on that either do invert or not

        const imageData = ctx?.getImageData(0, 0, canva.width, canva.height).data;
        if(!imageData) return
        const clrMap = new Map();

        for (let i = 0; i < imageData.length; i+= 4) {
            const [r, g, b] = [imageData[i], imageData[i+1], imageData[i+2]];
            const rgb = `rgb(${r}, ${g}, ${b})`;
            clrMap.set(rgb, (clrMap.get(rgb) || 0) + 1);
            // here get the intensity of the rgb, is it bright or not.
        }
        console.log(clrMap);

        vid.requestVideoFrameCallback(updateCanvas);
    };

    if (!("requestVideoFrameCallback" in HTMLVideoElement.prototype)){
        console.error("Browser doesnot support VideoFrameRequestCallback")
    }

    vid.requestVideoFrameCallback(updateCanvas);

    if(shouldInvert) vid.style.filter = "invert(100%)";
    else vid.style.filter = "";
}
