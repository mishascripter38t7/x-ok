// Автовоспроизведение видео при попадании в видимую область (Intersection Observer)
const videos = document.querySelectorAll('video');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.play().catch(() => {});
    } else {
      entry.target.pause();
    }
  });
}, { threshold: 0.6 });

videos.forEach(video => observer.observe(video));

// Тап по экрану для паузы/запуска
videos.forEach(video => {
  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
});
