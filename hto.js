const placeholder = document.getElementById('video-placeholder');
const placeholder2 = document.getElementById('video-placeholder2');

  placeholder.addEventListener('click', () => {
    // 1. Create the <video> element
    const vid = document.createElement('video');
    vid.src = 'hto/VID-20250428-WA0020.mp4';
    vid.controls = true;
    vid.autoplay = true;
    vid.width = placeholder.clientWidth;
    vid.height = placeholder.clientHeight;

    // 2. Swap out the placeholder
    placeholder.innerHTML = '';
    placeholder.appendChild(vid);
  });

  placeholder2.addEventListener('click', () => {
    // 1. Create the <video> element
    const vid = document.createElement('video');
    vid.src = 'hto/VID-20250428-WA0020.mp4';
    vid.controls = true;
    vid.autoplay = true;
    vid.width = placeholder2.clientWidth;
    vid.height = placeholder2.clientHeight;

    // 2. Swap out the placeholder
    placeholder2.innerHTML = '';
    placeholder2.appendChild(vid);
  })