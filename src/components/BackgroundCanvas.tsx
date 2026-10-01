"use client";

import React, { useEffect, useRef } from "react";

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
}

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect user motion preference
    if (typeof window === "undefined") return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let animId: number;
    let isVisible = true;
    let resizeTimer: NodeJS.Timeout;

    // Defer particle initialization until browser is idle so first paint and hydration are instant
    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (!canvasRef.current) return;
          width = canvasRef.current.width = window.innerWidth;
          height = canvasRef.current.height = window.innerHeight;
        }, 150);
      };

      window.addEventListener("resize", handleResize, { passive: true });

      const isMobile = width < 768;
      const maxNodes = isMobile ? 16 : 32;
      const nodeCount = Math.min(Math.floor((width * height) / 28000), maxNodes);
      const nodes: NodePoint[] = [];

      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.6 + 0.8,
          baseAlpha: Math.random() * 0.35 + 0.2,
        });
      }

      let mouseX = -1000;
      let mouseY = -1000;
      const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      };
      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      const handleVisibilityChange = () => {
        isVisible = !document.hidden;
        if (isVisible) {
          animId = requestAnimationFrame(render);
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      const connectionDist = isMobile ? 90 : 120;
      const connectionDistSq = connectionDist * connectionDist;
      const mouseDistThresholdSq = 150 * 150;

      function render() {
        if (!isVisible || !ctx) return;
        ctx.clearRect(0, 0, width, height);

        const len = nodes.length;
        for (let i = 0; i < len; i++) {
          const n = nodes[i];
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < 0) n.x = width;
          else if (n.x > width) n.x = 0;
          if (n.y < 0) n.y = height;
          else if (n.y > height) n.y = 0;

          let alpha = n.baseAlpha;
          if (mouseX > 0) {
            const dxm = mouseX - n.x;
            const dym = mouseY - n.y;
            const distSqM = dxm * dxm + dym * dym;
            if (distSqM < mouseDistThresholdSq) {
              alpha += (1 - Math.sqrt(distSqM) / 150) * 0.45;
            }
          }

          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${Math.min(alpha, 0.85)})`;
          ctx.fill();

          for (let j = i + 1; j < len; j++) {
            const o = nodes[j];
            const dx = n.x - o.x;
            const dy = n.y - o.y;
            const distSq = dx * dx + dy * dy;

            // Only compute square root when nodes are within connecting distance (eliminates 90% Math.sqrt calls)
            if (distSq < connectionDistSq) {
              const dist = Math.sqrt(distSq);
              const lineAlpha = (1 - dist / connectionDist) * 0.14;
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(o.x, o.y);
              ctx.strokeStyle = `rgba(29, 130, 235, ${lineAlpha})`;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }
        }

        animId = requestAnimationFrame(render);
      }

      animId = requestAnimationFrame(render);

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    let cleanupFn: (() => void) | undefined;
    if ("requestIdleCallback" in window) {
      const idleId = (window as any).requestIdleCallback(() => {
        cleanupFn = initCanvas();
      });
      return () => {
        if ("cancelIdleCallback" in window) {
          (window as any).cancelIdleCallback(idleId);
        }
        cleanupFn?.();
      };
    } else {
      const timer = setTimeout(() => {
        cleanupFn = initCanvas();
      }, 100);
      return () => {
        clearTimeout(timer);
        cleanupFn?.();
      };
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Deep ambient backdrop glows - pure CSS hardware-accelerated */}
      <div className="absolute -top-40 left-1/4 w-[650px] h-[650px] bg-[#1D82EB]/15 rounded-full blur-[140px] pointer-events-none will-change-transform" />
      <div className="absolute top-1/3 -right-36 w-[550px] h-[550px] bg-[#FF6B00]/10 rounded-full blur-[160px] pointer-events-none will-change-transform" />
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
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
}
