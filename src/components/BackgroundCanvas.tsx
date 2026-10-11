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
    if (typeof window === "undefined") return;

    // Respect user motion preference
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let animId: number | null = null;
    let isVisible = true;
    let cleanupAnim: (() => void) | null = null;
    let resizeTimer: NodeJS.Timeout;

    const startAnimation = () => {
      // Strictly disabled on mobile viewports (< 768px)
      if (window.innerWidth < 768) {
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      const maxNodes = 32;
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
        if (isVisible && !animId) {
          animId = requestAnimationFrame(render);
        } else if (!isVisible && animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      const connectionDist = 120;
      const connectionDistSq = connectionDist * connectionDist;
      const mouseDistThresholdSq = 150 * 150;

      function render() {
        if (!isVisible || !ctx || window.innerWidth < 768) return;
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

      cleanupAnim = () => {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        if (canvasRef.current && ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      };
    };

    const stopAnimation = () => {
      if (cleanupAnim) {
        cleanupAnim();
        cleanupAnim = null;
      }
    };

    const handleWindowResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth < 768) {
          stopAnimation();
        } else {
          if (!cleanupAnim) {
            startAnimation();
          } else if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
          }
        }
      }, 150);
    };

    window.addEventListener("resize", handleWindowResize, { passive: true });

    // Only initiate on desktop viewports (>= 768px)
    if (window.innerWidth >= 768) {
      if ("requestIdleCallback" in window) {
        const idleId = (window as any).requestIdleCallback(() => {
          startAnimation();
        });
        return () => {
          if ("cancelIdleCallback" in window) {
            (window as any).cancelIdleCallback(idleId);
          }
          stopAnimation();
          window.removeEventListener("resize", handleWindowResize);
        };
      } else {
        const timer = setTimeout(() => {
          startAnimation();
        }, 100);
        return () => {
          clearTimeout(timer);
          stopAnimation();
          window.removeEventListener("resize", handleWindowResize);
        };
      }
    }

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      stopAnimation();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Mobile-only static high-performance CSS gradient background (viewport < 768px) */}
      <div
        className="md:hidden absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 15%, rgba(29, 130, 235, 0.16) 0%, transparent 60%), radial-gradient(circle at 85% 45%, rgba(255, 107, 0, 0.10) 0%, transparent 50%), radial-gradient(circle at 15% 80%, rgba(0, 210, 255, 0.08) 0%, transparent 50%), #030d17",
        }}
      />

      {/* Desktop-only deep ambient backdrop glows (viewport >= 768px) */}
      <div className="hidden md:block absolute -top-40 left-1/4 w-[650px] h-[650px] bg-[#1D82EB]/15 rounded-full blur-[140px] pointer-events-none will-change-transform" />
      <div className="hidden md:block absolute top-1/3 -right-36 w-[550px] h-[550px] bg-[#FF6B00]/10 rounded-full blur-[160px] pointer-events-none will-change-transform" />
      <div className="hidden md:block absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#00d2ff]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle medical grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#1D82EB 1px, transparent 1px), linear-gradient(90deg, #1D82EB 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Interactive canvas for synaptic/clinical nodes (strictly desktop only >= 768px) */}
      <canvas ref={canvasRef} className="hidden md:block absolute inset-0 w-full h-full" />
    </div>
  );
}
