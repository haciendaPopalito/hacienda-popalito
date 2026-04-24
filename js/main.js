/* ============================================
   HACIENDA POPALITO — JavaScript principal
   Lee datos desde config.js (CONFIG)
   ============================================ */

(function () {
  'use strict';

  // === RENDER DINÁMICO DESDE CONFIG ===

  // Testimonios
  var testimoniosContainer = document.getElementById('testimoniosGrid');
  if (testimoniosContainer && CONFIG.testimonios) {
    testimoniosContainer.innerHTML = CONFIG.testimonios.map(function (t) {
      return '<div class="testimonial reveal">' +
        '<img class="testimonial__photo" src="' + t.foto + '" alt="" loading="lazy">' +
        '<div class="testimonial__stars">★★★★★</div>' +
        '<p class="testimonial__text">' + t.texto + '</p>' +
        '<span class="testimonial__author">' + t.autor + '</span>' +
        '</div>';
    }).join('');
  }

  // Proof bar counters
  var counterEls = document.querySelectorAll('.proof-bar__number');
  if (counterEls.length >= 4) {
    counterEls[0].setAttribute('data-target', CONFIG.contadores.arboles);
    counterEls[1].setAttribute('data-target', CONFIG.contadores.visitantes);
    counterEls[2].setAttribute('data-target', CONFIG.contadores.estrellas);
    counterEls[3].setAttribute('data-target', CONFIG.contadores.anos);
  }

  // Teléfono visible
  var phoneEl = document.querySelector('.hero__phone');
  if (phoneEl) phoneEl.textContent = '📲 ' + CONFIG.telefono_visible;

  // Precios
  var precioAnterior = document.getElementById('precioAnterior');
  var precioActual = document.getElementById('precioActual');
  if (precioAnterior) precioAnterior.textContent = '$' + CONFIG.precio_anterior + ' COP';
  if (precioActual) precioActual.textContent = '$' + CONFIG.precio_actual + ' COP';

  // WhatsApp links
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (link) {
    link.href = link.href.replace(/57\d{10}/, CONFIG.whatsapp);
  });

  // === REVEAL: Intersection Observer ===
  var reveals = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(function (el) { revealObserver.observe(el); });

  // === COUNTER: Animación de números ===
  var counters = document.querySelectorAll('.proof-bar__number');
  var counterDone = false;

  function animateCounters() {
    if (counterDone) return;
    counterDone = true;
    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-target'));
      var duration = 2000;
      var startTime = null;
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target + '+';
        }
      }
      requestAnimationFrame(step);
    });
  }

  var proofBar = document.querySelector('.proof-bar');
  if (proofBar) {
    var counterObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        animateCounters();
        counterObserver.unobserve(proofBar);
      }
    }, { threshold: 0.5 });
    counterObserver.observe(proofBar);
  }

  // === NAV ===
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('nav--scrolled', window.scrollY > 20);
  });

  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    menu.classList.toggle('active');
  });
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('active');
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav')) {
      menu.classList.remove('active');
    }
  });

  // === STICKY CTA MÓVIL ===
  var stickyCta = document.getElementById('stickyCta');
  var heroSection = document.getElementById('hero');
  var reservaSection = document.getElementById('reserva');

  function checkStickyCta() {
    if (window.innerWidth > 768) return;
    var heroBottom = heroSection.getBoundingClientRect().bottom;
    var reservaTop = reservaSection.getBoundingClientRect().top;
    stickyCta.classList.toggle('visible', heroBottom < 0 && reservaTop > window.innerHeight);
  }
  window.addEventListener('scroll', checkStickyCta);
  window.addEventListener('resize', checkStickyCta);

  // === TOAST PRUEBA SOCIAL ===
  var toast = document.getElementById('socialToast');
  var toastText = toast.querySelector('.toast__text');
  var toastIndex = 0;

  function showToast() {
    toastText.textContent = CONFIG.toasts[toastIndex];
    toast.classList.add('visible');
    setTimeout(function () { toast.classList.remove('visible'); }, 4000);
    toastIndex = (toastIndex + 1) % CONFIG.toasts.length;
  }
  setTimeout(function () { showToast(); setInterval(showToast, 25000); }, 8000);

  // === PARTICLES ===
  var particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    for (var i = 0; i < 20; i++) {
      var particle = document.createElement('div');
      particle.style.cssText =
        'position:absolute;width:' + (Math.random() * 4 + 2) + 'px;' +
        'height:' + (Math.random() * 4 + 2) + 'px;' +
        'background:rgba(255,255,255,' + (Math.random() * 0.3 + 0.1) + ');' +
        'border-radius:50%;left:' + (Math.random() * 100) + '%;' +
        'top:' + (Math.random() * 100) + '%;' +
        'animation:particleFloat ' + (Math.random() * 8 + 6) + 's ease-in-out infinite;' +
        'animation-delay:' + (Math.random() * 4) + 's;';
      particlesContainer.appendChild(particle);
    }
    var style = document.createElement('style');
    style.textContent = '@keyframes particleFloat{0%,100%{transform:translateY(0) translateX(0);opacity:0.5}50%{transform:translateY(-30px) translateX(10px);opacity:1}}';
    document.head.appendChild(style);
  }

  // === FORM: 2 pasos + WhatsApp ===
  var form = document.getElementById('reservaForm');
  var submitBtn = document.getElementById('submitBtn');
  var step1 = document.getElementById('formStep1');
  var step2 = document.getElementById('formStep2');
  var nextBtn = document.getElementById('nextStepBtn');
  var prevBtn = document.getElementById('prevStepBtn');


  // Paso 1 → 2
  nextBtn.addEventListener('click', function () {
    var nombre = form.nombre.value.trim();
    var fecha = form.fecha.value;
    var personas = form.personas.value;
    if (!nombre || !fecha || !personas) {
      [form.nombre, form.fecha, form.personas].forEach(function (input) {
        if (!input.value.trim()) {
          input.style.borderColor = 'rgba(255,107,107,0.7)';
          input.style.boxShadow = '0 0 0 3px rgba(255,107,107,0.15)';
        }
      });
      return;
    }
    step1.classList.remove('form__step--active');
    step2.classList.add('form__step--active');
  });

  // Validación paso 2 antes de submit
  function validateStep2() {
    var telefono = form.telefono.value.trim();
    var email = form.email.value.trim();
    var errors = [];
    if (!telefono) errors.push(form.telefono);
    if (!email) errors.push(form.email);
    if (errors.length > 0) {
      errors.forEach(function (input) {
        input.style.borderColor = 'rgba(255,107,107,0.7)';
        input.style.boxShadow = '0 0 0 3px rgba(255,107,107,0.15)';
      });
      return false;
    }
    return true;
  }

  // Paso 2 → 1
  prevBtn.addEventListener('click', function () {
    step2.classList.remove('form__step--active');
    step1.classList.add('form__step--active');
  });

  // Validación visual
  form.querySelectorAll('input[required]').forEach(function (input) {
    input.addEventListener('input', function () {
      if (this.value.trim()) {
        this.style.borderColor = 'rgba(127,168,127,0.6)';
        this.style.boxShadow = '0 0 0 3px rgba(127,168,127,0.1)';
      }
    });
    input.addEventListener('focus', function () {
      this.style.borderColor = '';
      this.style.boxShadow = '';
    });
  });

  // Submit → Google Sheets + WhatsApp
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateStep2()) return;
    var btnText = submitBtn.querySelector('.btn__text');
    var btnLoading = submitBtn.querySelector('.btn__loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;

    var reservaData = {
      nombre: form.nombre.value.trim(),
      telefono: form.telefono.value.trim(),
      email: form.email.value.trim(),
      fecha: form.fecha.value,
      personas: form.personas.value,
      ciudad: form.ciudad.value.trim() || 'No indicada',
      plan: form.plan.options[form.plan.selectedIndex].text,
      como_se_entero: form.como_se_entero.options[form.como_se_entero.selectedIndex].text,
      observaciones: form.observaciones.value.trim()
    };

    fetch('https://script.google.com/macros/library/d/1DYr4ljwnQHxLjm_QPk3Eyh1E3uPEz0KwoBIJ7tkKhExq2B192HOnTRs5/2', {
      method: 'POST',
      body: JSON.stringify(reservaData)
    }).catch(function () {});

    var mensaje =
      '🌿 *Nueva reserva — Hacienda Popalito*\n\n' +
      '👤 *Nombre:* ' + reservaData.nombre + '\n' +
      '📱 *WhatsApp:* ' + reservaData.telefono + '\n' +
      '📧 *Email:* ' + reservaData.email + '\n' +
      '📅 *Fecha:* ' + reservaData.fecha + '\n' +
      '👥 *Personas:* ' + reservaData.personas + '\n' +
      '📍 *Ciudad:* ' + reservaData.ciudad + '\n' +
      '🎯 *Plan:* ' + reservaData.plan + '\n' +
      (reservaData.observaciones ? '📝 *Obs:* ' + reservaData.observaciones + '\n' : '') +
      '\n¡Quedo atento a la confirmación! 🙌';

    var url = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(mensaje);
    setTimeout(function () {
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
      window.open(url, '_blank');
    }, 800);
  });

  // === Fecha mínima: hoy + 2 días ===
  var fechaInput = document.getElementById('fecha');
  var hoy = new Date();
  hoy.setDate(hoy.getDate() + 2);
  fechaInput.min = hoy.toISOString().split('T')[0];

  // === CONFIG GLOBAL ===
  window.CONFIG = CONFIG;


  // === SMOOTH SCROLL ===
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
      }
    });
  });

  // === EXIT INTENT POPUP ===
  var exitPopup = document.getElementById('exitPopup');
  var exitShown = false;
  function closeExitPopup() { exitPopup.classList.remove('visible'); }
  document.addEventListener('mouseleave', function (e) {
    if (e.clientY < 5 && !exitShown) { 
      exitShown = true; 
      exitPopup.classList.add('visible');
      setTimeout(function () { closeExitPopup(); }, 8000);
    }
  });
  document.getElementById('exitPopupClose').addEventListener('click', closeExitPopup);
  document.getElementById('exitPopupX').addEventListener('click', closeExitPopup);
  document.getElementById('exitPopupCta').addEventListener('click', closeExitPopup);

  // === LEAD MINI (toggle desde botón) ===
  var leadMini = document.getElementById('leadMini');
  document.getElementById('leadMiniClose').addEventListener('click', function () { leadMini.classList.remove('visible'); });
  var leadToggle = document.getElementById('leadToggle');
  if (leadToggle) {
    leadToggle.addEventListener('click', function () {
      leadMini.classList.toggle('visible');
    });
  }
  document.getElementById('leadMiniForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var phone = document.getElementById('leadWhatsapp').value.trim();
    if (phone) {
      window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent('Hola, quiero que me avisen cuando haya cupos. Mi WhatsApp: ' + phone), '_blank');
      leadMini.classList.remove('visible');
    }
  });

})();
