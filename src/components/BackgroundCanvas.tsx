import React from "react";

export default function BackgroundCanvas() {
  const canvasScript = `
    (function() {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var canvas = document.getElementById('medical-network-canvas');
      if (!canvas) return;
      var ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      var width = canvas.width = window.innerWidth;
      var height = canvas.height = window.innerHeight;

      window.addEventListener('resize', function() {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, { passive: true });

      var isMobile = width < 768;
      var maxNodes = isMobile ? 24 : 50;
      var nodeCount = Math.min(Math.floor((width * height) / 22000), maxNodes);
      var nodes = [];

      for (var i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.8 + 1,
          baseAlpha: Math.random() * 0.4 + 0.2
        });
      }

      var mouseX = -1000;
      var mouseY = -1000;
      window.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }, { passive: true });

      var isVisible = true;
      document.addEventListener('visibilitychange', function() {
        isVisible = !document.hidden;
        if (isVisible) requestAnimationFrame(render);
      });

      var connectionDist = isMobile ? 100 : 125;

      function render() {
        if (!isVisible) return;
        ctx.clearRect(0, 0, width, height);

        for (var i = 0; i < nodes.length; i++) {
          var n = nodes[i];
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < 0) n.x = width;
          else if (n.x > width) n.x = 0;
          if (n.y < 0) n.y = height;
          else if (n.y > height) n.y = 0;

          var alpha = n.baseAlpha;
          if (mouseX > 0) {
            var dxm = mouseX - n.x;
            var dym = mouseY - n.y;
            var distM = Math.sqrt(dxm * dxm + dym * dym);
            if (distM < 160) {
              alpha += (1 - distM / 160) * 0.5;
            }
          }

          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(56, 189, 248, ' + Math.min(alpha, 0.9) + ')';
          ctx.fill();

          for (var j = i + 1; j < nodes.length; j++) {
            var o = nodes[j];
            var dx = n.x - o.x;
            var dy = n.y - o.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDist) {
              var lineAlpha = (1 - dist / connectionDist) * 0.15;
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(o.x, o.y);
              ctx.strokeStyle = 'rgba(29, 130, 235, ' + lineAlpha + ')';
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }
        }

        requestAnimationFrame(render);
      }

      requestAnimationFrame(render);
    })();
  `;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep ambient backdrop glows */}
      <div className="absolute -top-40 left-1/4 w-[650px] h-[650px] bg-[#1D82EB]/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 -right-36 w-[550px] h-[550px] bg-[#FF6B00]/10 rounded-full blur-[160px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#00d2ff]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle medical grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#1D82EB 1px, transparent 1px), linear-gradient(90deg, #1D82EB 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Interactive canvas for synaptic/clinical nodes */}
      <canvas id="medical-network-canvas" className="absolute inset-0 block w-full h-full" />

      {/* Inline non-blocking script */}
      <script dangerouslySetInnerHTML={{ __html: canvasScript }} />
    </div>
  );
}
