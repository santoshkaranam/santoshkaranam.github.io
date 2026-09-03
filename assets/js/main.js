(function($) {
  "use strict";

  /* ==========================================================================
     PARTICLES CANVAS
     ========================================================================== */
  function initParticles() {
    var canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 80;
    var mouse = { x: null, y: null };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', function(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    for (var i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function drawParticle(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,212,255,' + p.opacity + ')';
      ctx.fill();
    }

    function connectParticles() {
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            var opacity = (1 - dist / 150) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(0,212,255,' + opacity + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function(p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        drawParticle(p);
      });
      connectParticles();
      requestAnimationFrame(update);
    }
    update();
  }

  /* ==========================================================================
     TYPING EFFECT
     ========================================================================== */
  function initTyping() {
    var el = document.getElementById('typed-text');
    if (!el) return;
    var phrases = [
      'Full Stack Developer',
      '.NET & React Specialist',
      'Cloud Architect',
      'GIS & Mapping Expert',
      'DevOps Engineer',
      'Citizen Science Researcher',
      'C# Corner MVP'
    ];
    var phraseIdx = 0;
    var charIdx = 0;
    var deleting = false;

    function type() {
      var current = phrases[phraseIdx];
      if (deleting) {
        el.textContent = current.substring(0, charIdx - 1);
        charIdx--;
      } else {
        el.textContent = current.substring(0, charIdx + 1);
        charIdx++;
      }

      var speed = deleting ? 40 : 80;

      if (!deleting && charIdx === current.length) {
        speed = 2000;
        deleting = true;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed = 400;
      }

      setTimeout(type, speed);
    }
    type();
  }

  /* ==========================================================================
     SCROLL REVEAL
     ========================================================================== */
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-reveal');
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(function(el) { observer.observe(el); });
  }

  /* ==========================================================================
     NAVBAR SCROLL
     ========================================================================== */
  function initNavbar() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    /* Mobile Toggle */
    var toggle = document.querySelector('.mobile-toggle');
    var navLinks = document.querySelector('.nav-links');
    if (toggle && navLinks) {
      toggle.addEventListener('click', function() {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
      });
      navLinks.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          toggle.classList.remove('active');
          navLinks.classList.remove('active');
        });
      });
    }

    /* Active nav link on scroll */
    var sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
      var scrollY = window.scrollY + 100;
      sections.forEach(function(section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');
        var link = document.querySelector('.nav-links a[href="#' + id + '"]');
        if (link) {
          if (scrollY >= top && scrollY < top + height) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      });
    });
  }

  /* ==========================================================================
     COUNTER ANIMATION
     ========================================================================== */
  function initCounters() {
    var counters = document.querySelectorAll('.counter-number[data-count]');
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'));
          var current = 0;
          var increment = Math.ceil(target / 60);
          var timer = setInterval(function() {
            current += increment;
            if (current >= target) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = current;
            }
          }, 30);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(c) { observer.observe(c); });
  }

  /* ==========================================================================
     SKILL BARS
     ========================================================================== */
  function initSkillBars() {
    var bars = document.querySelectorAll('.skill-bar-fill');
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          var width = bar.getAttribute('data-width');
          setTimeout(function() {
            bar.style.width = width + '%';
          }, 200);
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });

    bars.forEach(function(b) { observer.observe(b); });
  }

  /* ==========================================================================
     BACK TO TOP
     ========================================================================== */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function() {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     SMOOTH SCROLL
     ========================================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href*="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var offset = 80;
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ==========================================================================
     RIPPLE BUTTON EFFECT
     ========================================================================== */
  function initRipple() {
    document.querySelectorAll('.ripple-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        this.appendChild(ripple);
        setTimeout(function() { ripple.remove(); }, 600);
      });
    });
  }

  /* ==========================================================================
     PROJECT FILTER
     ========================================================================== */
  function initProjectFilter() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');

        projectCards.forEach(function(card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
            setTimeout(function() { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(function() { card.style.display = 'none'; }, 400);
          }
        });
      });
    });
  }

  /* ==========================================================================
     MAGNETIC HOVER
     ========================================================================== */
  function initMagneticHover() {
    document.querySelectorAll('.magnetic-hover').forEach(function(el) {
      el.addEventListener('mousemove', function(e) {
        var rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        this.style.transform = 'translate(' + (x * 0.1) + 'px,' + (y * 0.1) + 'px)';
      });
      el.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ==========================================================================
     TILT CARD EFFECT
     ========================================================================== */
  function initTiltCards() {
    document.querySelectorAll('.tilt-card').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = this.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        this.style.transform = 'perspective(1000px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateY(0)';
      });
    });
  }

  /* ==========================================================================
     PRELOADER
     ========================================================================== */
  function initPreloader() {
    var preloader = document.getElementById('preloader');
    if (preloader) {
      window.addEventListener('load', function() {
        setTimeout(function() {
          preloader.style.opacity = '0';
          setTimeout(function() { preloader.style.display = 'none'; }, 500);
        }, 800);
      });
    }
  }

  /* ==========================================================================
     INITIALIZE ALL
     ========================================================================== */
  $(document).ready(function() {
    initPreloader();
    initParticles();
    initTyping();
    initNavbar();
    initScrollReveal();
    initCounters();
    initSkillBars();
    initBackToTop();
    initSmoothScroll();
    initRipple();
    initProjectFilter();
    initMagneticHover();
    initTiltCards();
  });

}(jQuery));
