const placeholder = document.getElementById('video-placeholder');

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