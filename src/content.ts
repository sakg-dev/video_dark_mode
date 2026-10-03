const vids = document.getElementsByTagName("video");
// console.log(vids);

for (let vid of vids) {
    // filter:invert(100%);
    vid.style.filter = "invert(100%)";
}
