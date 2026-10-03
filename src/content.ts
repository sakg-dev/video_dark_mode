const vids = document.getElementsByTagName("video");

const sRGBToPerceivedLightness = (sR: number, sG: number, sB: number) => {
    // https://stackoverflow.com/questions/596216/formula-to-determine-perceived-brightness-of-rgb-color

    const sRGBToLin = (colorChannel: number) => {
        if (colorChannel <= 0.04045) {
            return colorChannel / 12.92;
        } else {
            return ((colorChannel + 0.055) / 1.055) ** 2.4
        }
    }

    // normalized
    let vR = sR / 255;
    let vG = sG / 255;
    let vB = sB / 255;

    // linearized
    let lR = sRGBToLin(vR);
    let lG = sRGBToLin(vG);
    let lB = sRGBToLin(vB);

    let y = (lR * 0.2126) + (lG * 0.7152) + (lB * 0.0722); // luminance

    // cnvrting to l star for percived lightness
    if (y <= (216/24389)) {
        return y * (24389/27);
    } else {
        return ((y ** (1/3)) * 116) - 16;
    }
}

// there can be more than one video in a page
for (let vid of vids) {
    const canva = document.createElement("canvas");
    canva.style.height = vid.style.height;
    canva.style.width = vid.style.width;
    canva.style.visibility = "hidden";
    document.body.prepend(canva)

    const ctx = canva.getContext("2d", { willReadFrequently: true });

    let width = canva.width;
    let height = canva.height;

    const updateCanvas: VideoFrameRequestCallback = () => {
        ctx?.drawImage(vid, 0, 0, width, height);

        const imageData = ctx?.getImageData(0, 0, canva.width, canva.height).data;
        if(!imageData) return
        
        let sumOfPL = 0;

        for (let i = 0; i < imageData.length; i+= 4) {
            const [r, g, b] = [imageData[i], imageData[i+1], imageData[i+2]];
            let perceivedLightness = sRGBToPerceivedLightness(r, g, b);
            sumOfPL += perceivedLightness;
        }

        let meanPerceivedLightness = sumOfPL / (imageData.length/4);

        if(meanPerceivedLightness > 50) {
            vid.style.filter = "invert(100%)";
        } else {
            vid.style.filter = "";
        }

        vid.requestVideoFrameCallback(updateCanvas);
    };

    if (!("requestVideoFrameCallback" in HTMLVideoElement.prototype)){
        console.error("Browser doesnot support VideoFrameRequestCallback")
    }

    vid.requestVideoFrameCallback(updateCanvas);

    
}
