 (function(){
  if (typeof window === 'undefined') return;

  function whenMatterReady(cb){
    if (window.Matter) return cb(window.Matter);
    const id = setInterval(()=>{ if (window.Matter){ clearInterval(id); cb(window.Matter); } }, 50);
    setTimeout(()=>{ if (!window.Matter) console.warn('Matter.js not available'); }, 3000);
  }

  whenMatterReady(function(Matter){
    const { Engine, World, Bodies, Body, Constraint, Composite, Runner } = Matter;

    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let engine = Engine.create();
    engine.world.gravity.y = 0;

    let container, textEl;
    const nodes = [];
    let textBody = null;

    const params = {
      COUNT: 20,
      RADIUS: 36,
      SIZE: 10,
      STIFFNESS: 0.12,
      NEIGHBOR_STIFFNESS: 0.09,
      REPULSION_STRENGTH: 0.0015,
      REPULSION_RADIUS: 120
    };

    function create(){
      textEl = document.getElementById('highlight-text');
      if (!textEl) return;

      container = document.createElement('div');
      container.className = 'text-effect-root';
      document.body.appendChild(container);

      // create physics bodies around text
      const rect = textEl.getBoundingClientRect();
      // static rectangle representing text area to prevent particles passing through
      textBody = Bodies.rectangle(rect.left + rect.width/2, rect.top + rect.height/2, Math.max(100, rect.width), Math.max(30, rect.height), { isStatic: true });
      World.add(engine.world, textBody);

      for (let i = 0; i < params.COUNT; i++){
        const angle = (i / params.COUNT) * Math.PI * 2;
        const px = rect.left + rect.width/2 + Math.cos(angle) * params.RADIUS;
        const py = rect.top + rect.height/2 + Math.sin(angle) * params.RADIUS;

        const el = document.createElement('div');
        el.className = 'text-effect-dot';
        container.appendChild(el);

        const body = Bodies.circle(px, py, params.SIZE/2, { frictionAir: 0.02, mass: 0.03, collisionFilter: { group: 0 } });
        World.add(engine.world, body);

        const c = Constraint.create({ bodyA: body, pointB: { x: rect.left + rect.width/2, y: rect.top + rect.height/2 }, length: params.RADIUS, stiffness: params.STIFFNESS, damping: 0.03 });
        World.add(engine.world, c);

        nodes.push({ el, body, constraint: c });
      }

      // neighbor constraints to form a coherent ring
      for (let i = 0; i < nodes.length; i++){
        const a = nodes[i].body;
        const b = nodes[(i+1)%nodes.length].body;
        const len = Math.hypot(a.position.x - b.position.x, a.position.y - b.position.y);
        const nc = Constraint.create({ bodyA: a, bodyB: b, length: len, stiffness: params.NEIGHBOR_STIFFNESS, damping: 0.02 });
        World.add(engine.world, nc);
      }
    }

    function resizeTextBody(){
      if (!textEl || !textBody) return;
      const r = textEl.getBoundingClientRect();
      Body.setPosition(textBody, { x: r.left + r.width/2, y: r.top + r.height/2 });
      Body.setVertices(textBody, Bodies.rectangle(r.left + r.width/2, r.top + r.height/2, Math.max(100, r.width), Math.max(30, r.height)).vertices);
    }

    let raf = null;
    let textCenter = { x: 0, y: 0 };

    function loop(t){
      Engine.update(engine, 1000/60);
      
      // Update text center
      if (textEl) {
        const rect = textEl.getBoundingClientRect();
        textCenter = { x: rect.left + rect.width/2, y: rect.top + rect.height/2 };
      }
      
      // Apply anti-gravity repulsion force
      for (let i = 0; i < nodes.length; i++){
        const n = nodes[i];
        const dx = n.body.position.x - textCenter.x;
        const dy = n.body.position.y - textCenter.y;
        const dist = Math.hypot(dx, dy);
        
        // Repulsion is stronger when closer to text, creating anti-gravity effect
        if (dist < params.REPULSION_RADIUS && dist > 1) {
          const force = (params.REPULSION_STRENGTH * (params.REPULSION_RADIUS - dist)) / dist;
          Body.applyForce(n.body, n.body.position, { 
            x: (dx / dist) * force, 
            y: (dy / dist) * force 
          });
        }
      }
      
      for (let i = 0; i < nodes.length; i++){
        const n = nodes[i];
        const p = n.body.position;
        n.el.style.transform = `translate3d(${p.x - n.el.offsetWidth/2}px, ${p.y - n.el.offsetHeight/2}px, 0)`;
        n.el.style.width = n.body.circleRadius*2 + 'px';
        n.el.style.height = n.body.circleRadius*2 + 'px';
      }
      raf = requestAnimationFrame(loop);
    }

    function observe(){
      window.addEventListener('resize', resizeTextBody);
      const mo = new MutationObserver(resizeTextBody);
      mo.observe(textEl, { childList: true, subtree: true, characterData: true });
    }

    function start(){
      create();
      if (nodes.length > 0) loop();
      observe();
    }

    // Start when DOM ready
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();

    window.__textEffect = { destroy(){ if (raf) cancelAnimationFrame(raf); nodes.forEach(n=>n.el.remove()); if (container) container.remove(); Composite.clear(engine.world, false); } };
  });
})();
