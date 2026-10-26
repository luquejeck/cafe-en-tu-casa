/* Versiones con voz (ElevenLabs) de reel3.html, reel3a.html y reel3c.html.
   La página se filma con ?voz=<nombre>; sin ese parámetro queda igual que siempre.
   ANCLAS lleva el tiempo de la animación al de la voz: [segundo de la voz, segundo
   de la animación]. Entre anclas se interpola; así cada escena aparece cuando la
   voz la nombra y lo que la voz no nombra pasa rápido. Los tiempos de cada frase
   salen de los silencios del audio (ffmpeg silencedetect). */
(() => {
  const VOCES = {
    // Mauricio: "Este año vas a tomar... 1.460 cafés. ¿Cuántos van a ser buenos? Mirá: el de la oficina...
    // el de cápsula... el soluble... y el del paso, tibio. ¿Buenos de verdad? Casi ninguno. ¿Y si fueran
    // todos así? Grano recién molido, en tu casa. Todos los días. Café de cafetería, en tu casa. Link en la bio."
    original: { archivo: "voz-original-mauricio.mp3", dura: 24.76, anclas: [
      [0, 0], [3.3, 2.2], [4.4, 3.4], [4.6, 3.6], [6.1, 5.5], [6.5, 6.2], [7.1, 7.4], [8.4, 8.6], [9.7, 9.8],
      [11.0, 11.0], [12.9, 11.65], [13.2, 11.7], [14.9, 12.2], [16.0, 13.6], [16.35, 13.8], [17.9, 18.6],
      [18.1, 19.45], [18.3, 19.9], [19.6, 20.6], [20.5, 21.3], [21.5, 23.6], [21.7, 23.9], [23.85, 25.2]] },
    // Valeria: "¡1.460! Son los cafés que vas a tomar este año. ¿Y cuántos van a ser buenos? Casi ninguno.
    // Se te caen... uno por uno. Pero con tu propia cafetera... la historia cambia. 1.460 de 1.460.
    // TODOS buenos. Café de cafetería, en tu casa. Link en la bio."
    particulas: { archivo: "voz-a-valeria.mp3", dura: 21.47, anclas: [
      [0, 0], [1.6, .95], [2.3, 1.3], [4.2, 2.6], [4.5, 2.95], [6.0, 4.6], [6.15, 4.9], [6.3, 9.85],
      [6.45, 9.93], [9.9, 11.9], [10.3, 12.0], [13.4, 15.7], [13.55, 15.85], [16.9, 17.0], [17.2, 17.4],
      [17.9, 18.9], [18.25, 20.2], [20.5, 21.4]] },
    // Valeria: "Este año vas a tomar 1.460 cafés. ¿Cuántos van a ser buenos? A ver... enero... marzo...
    // julio... diciembre... Buenos: cero. Casi ninguno. ¡Rebobinemos! Mismo año... pero con tu cafetera.
    // Enero, marzo, julio, diciembre... Todos buenos. Café de cafetería, en tu casa. Link en la bio."
    calendario: { archivo: "voz-c-valeria.mp3", dura: 25.89, anclas: [
      [0, 0], [2.9, 1.6], [3.2, 1.9], [3.8, 2.75], [4.0, 3.2], [5.3, 4.95], [5.5, 5.4], [8.3, 10.6],
      [11.55, 10.9], [12.3, 12.33], [13.25, 13.05], [14.1, 13.95], [18.1, 14.25], [21.0, 16.2], [21.5, 17.5],
      [22.4, 19.9], [22.65, 20.4], [24.85, 22.0]] },
  };
  const v = VOCES[new URLSearchParams(location.search).get("voz")];
  if (!v) return;
  const DESDE = .25;
  // interpolación por tramos; fuera de las anclas sigue a velocidad normal
  const pasar = (x, de, a) => {
    const A = v.anclas;
    if (x <= A[0][de]) return A[0][a] + x - A[0][de];
    for (let i = 1; i < A.length; i++)
      if (x <= A[i][de]) { const k = (x - A[i - 1][de]) / (A[i][de] - A[i - 1][de]); return A[i - 1][a] + k * (A[i][a] - A[i - 1][a]); }
    const u = A[A.length - 1]; return u[a] + x - u[de];
  };
  const original = window.cuadro;
  window.cuadro = (f) => original(pasar(f / FPS - DESDE, 0, 1) * FPS);
  window.TOTAL = Math.round((DESDE + v.dura + 1.6) * FPS);
  window.SFX = window.SFX.map(([t, x]) => [pasar(t, 1, 0) + DESDE, x]).filter(([t]) => t >= 0 && t < window.TOTAL / FPS)
    .filter(([t], i, l) => i === 0 || t - l[i - 1][0] > .15);   // donde la animación pasa rápido, un solo efecto
  window.VOZ = [v.archivo, DESDE];
  // la voz cierra con "link en la bio": el botón del final dice lo mismo
  const url = document.getElementById("url"); if (url) url.textContent = "Link en la bio ↑";
})();
