document.addEventListener('DOMContentLoaded', () => {



    // === Three.js: Светодинамический фон ===
    const canvas = document.getElementById('bg');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Светодиодная нить
    const geometry = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x95bb1b,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    camera.position.z = 5;

    // Анимация мерцания
    function animate() {
      requestAnimationFrame(animate);
      points.rotation.x += 0.001;
      points.rotation.y += 0.002;
      renderer.render(scene, camera);
    }
    animate();

    // GSAP: Плавное появление
    gsap.from("h1", { opacity: 0, y: 50, duration: 1.5, ease: "power3.out" });
    gsap.from("p", { opacity: 0, y: 30, delay: 0.5, duration: 1, ease: "power2.out" });

    // Адаптация
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });



    const tl = gsap
      .timeline({ repeat: 100, repeatDelay: 1 })
      .from(".mask div", {
        xPercent: gsap.utils.wrap([100, -100]),
        stagger: 0.4,
        opacity: 0,
        ease: "circ.inOut"
      })
      .to(
        ".mask div",
        {
          opacity: 0,
          yPercent: gsap.utils.wrap([-100, 100]),
          duration: 1,
          ease:"none"
        },
        ">3"
      );

    gsap.fromTo(".bar", {x:-200}, {x:200, duration:20, ease:"none", repeat:3, yoyo:true})

  

 
/*
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.fromTo(entry.target, 
            { opacity: 0, y: 80 }, 
            { opacity: 1, y: 0, duration: 2, delay: 0.2, ease: "power2.out" }
          );
        } else {
          gsap.to(entry.target, { opacity: 0, y: 80, duration: 1, ease: "power2.in" });
        }
      });
    }, options);

    sections.forEach(section => {
      gsap.set(section, { opacity: 0, y: 80 }); // стартовое положение: ниже и прозрачное
      observer.observe(section);
    });
  };
*/



  // Подсветка активного пункта меню при скролле
  document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav a[href^='#']");
    const sections = Array.from(document.querySelectorAll(".section, .hero"));

    const sectionIdMap = {};
    sections.forEach(section => {
      sectionIdMap[section.id] = section;
    });

    const highlightMenu = (activeId) => {
      navLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + activeId);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          highlightMenu(entry.target.id);
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(section => {
      observer.observe(section);
    });
  });




 
  const themeButtons = document.querySelectorAll('#theme-switcher button, #theme-options button');
  const rootEl = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeOptions = document.getElementById('theme-options');
  
  function applyTheme(theme) {
    rootEl.setAttribute('data-theme', theme);
    localStorage.setItem('chatTheme', theme);
  }
  
  function initTheme() {
    const savedTheme = localStorage.getItem('chatTheme');
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  }
  
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      applyTheme(theme);
      if (themeOptions) themeOptions.classList.add('hidden'); 
    });
  });
  
  if (themeToggleBtn && themeOptions) {
    themeToggleBtn.addEventListener('click', () => {
      themeOptions.classList.toggle('hidden');
    });
  }
  
  initTheme();
});