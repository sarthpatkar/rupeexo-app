(function(){
  if (typeof window === 'undefined') return;

  // Wait for Matter to be available (loaded from CDN in layout)
  function whenMatterReady(cb){
    if (window.Matter) return cb(window.Matter);
    const id = setInterval(()=>{ if (window.Matter){ clearInterval(id); cb(window.Matter); } }, 50);
    // fallback timeout
    setTimeout(()=>{ if (!window.Matter) console.warn('Matter.js not available'); }, 3000);
  }

  whenMatterReady(function(Matter){
    const { Engine, Composite, Bodies, Body, Constraint, Runner, Vector, World } = Matter;

    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let container, halo;
    const dots = [];

    // physics
    const engine = Engine.create();
    engine.world.gravity.y = 0; // we'll manage forces manually; anti-gravity feel

    const params = {
      DOT_COUNT: 18,
      RADIUS: 34, // larger ring
      DOT_SIZE: 9, // bigger dots
      STIFFNESS: 0.16, // stronger spring to anchor for snappier response
      NEIGHBOR_STIFFNESS: 0.12, // stiffer neighbor links for less laggy cloth
    };

    // anchor is a kinematic body we reposition to cursor
    const anchor = Bodies.circle(window.innerWidth/2, window.innerHeight/2, 2, { isStatic: true, render: { visible: false } });
    World.add(engine.world, anchor);

    function createElements(){
      container = document.createElement('div');
      container.className = 'cursor-effect-root';
      document.body.appendChild(container);

      halo = document.createElement('div');
      halo.className = 'cursor-halo';
      container.appendChild(halo);

      // create dots and matching physics bodies
      for (let i = 0; i < params.DOT_COUNT; i++){
        const el = document.createElement('div');
        el.className = 'cursor-dot';
        container.appendChild(el);

        const angle = (i / params.DOT_COUNT) * Math.PI * 2;
        const px = window.innerWidth/2 + Math.cos(angle) * params.RADIUS;
        const py = window.innerHeight/2 + Math.sin(angle) * params.RADIUS;

        const body = Bodies.circle(px, py, params.DOT_SIZE/2, {
          frictionAir: 0.02,
          mass: 0.02,
          collisionFilter: { group: -1 },
          render: { visible: false }
        });

        World.add(engine.world, body);

        // spring to anchor
        const c = Constraint.create({ bodyA: body, bodyB: anchor, length: params.RADIUS, stiffness: params.STIFFNESS, damping: 0.06 });
        World.add(engine.world, c);

        dots.push({ el, body, constraint: c });
      }

      // connect neighbors to make ring stability (cloth-like surface tension)
      for (let i = 0; i < dots.length; i++){
        const a = dots[i].body;
        const b = dots[(i+1) % dots.length].body;
        const ne = Constraint.create({ bodyA: a, bodyB: b, length: params.RADIUS * 2 * Math.sin(Math.PI/params.DOT_COUNT), stiffness: params.NEIGHBOR_STIFFNESS, damping: 0.03 });
        World.add(engine.world, ne);
      }
    }

    const state = { tx: window.innerWidth/2, ty: window.innerHeight/2, x: window.innerWidth/2, y: window.innerHeight/2, visible: false, hideTimer: null };

    function showRing(){
      if (state.hideTimer){ clearTimeout(state.hideTimer); state.hideTimer = null; }
      if (!state.visible){ state.visible = true; container.classList.add('ring-visible'); }
      state.hideTimer = setTimeout(()=>{ state.visible = false; container.classList.remove('ring-visible'); }, 700);
    }

    function onPointerMove(e){
      state.tx = e.clientX;
      state.ty = e.clientY;
      showRing();
      if (!runner) start();
    }

    function onPointerDown(){ if (halo) halo.classList.add('cursor-active'); }
    function onPointerUp(){ if (halo) halo.classList.remove('cursor-active'); }

    // runner via RAF so we can sync DOM updates
    let runner = null;
    let last = null;
    function start(){ if (!runner) runner = requestAnimationFrame(loop); }
    function stop(){ if (runner){ cancelAnimationFrame(runner); runner = null; } }

    function loop(t){
      if (!last) last = t;
      const dt = Math.min(32, t - last);
      last = t;

      // move anchor more quickly to reduce perceived lag
      const lerpT = 0.55;
      const ax = anchor.position.x + (state.tx - anchor.position.x) * lerpT;
      const ay = anchor.position.y + (state.ty - anchor.position.y) * lerpT;
      Body.setPosition(anchor, { x: ax, y: ay });

      Engine.update(engine, dt);

      // update DOM positions
      for (let i = 0; i < dots.length; i++){
        const d = dots[i];
        const p = d.body.position;
        const s = 1 + Math.sin((t*0.001) + i) * 0.06;
        d.el.style.transform = `translate3d(${p.x - d.el.offsetWidth/2}px, ${p.y - d.el.offsetHeight/2}px, 0) scale(${s})`;
        // ensure size matches body radius
        const size = d.el._size || d.el.offsetWidth || params.DOT_SIZE;
        d.el.style.width = (d.body.circleRadius*2) + 'px';
        d.el.style.height = (d.body.circleRadius*2) + 'px';
      }

      // halo
      if (halo){ halo.style.transform = `translate3d(${anchor.position.x - 22}px, ${anchor.position.y - 22}px, 0)`; }

      // continue loop while visible or engine still active
      if (!state.visible){
        // small threshold to stop
        const dx = Math.abs(state.tx - anchor.position.x);
        const dy = Math.abs(state.ty - anchor.position.y);
        if (dx < 0.5 && dy < 0.5){ stop(); runner = null; last = null; return; }
      }

      runner = requestAnimationFrame(loop);
    }

    function init(){
      createElements();
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointerup', onPointerUp);
      // start paused until first move
    }

    init();

    window.__cursorEffect = { destroy(){ stop(); window.removeEventListener('pointermove', onPointerMove); window.removeEventListener('pointerdown', onPointerDown); window.removeEventListener('pointerup', onPointerUp); dots.forEach(d=>d.el.remove()); if (halo) halo.remove(); if (container) container.remove(); Composite.clear(engine.world, false); } };
  });
})();
