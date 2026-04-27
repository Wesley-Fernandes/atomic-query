import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function FallingStars() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: { enable: false },
        fpsLimit: 120,
        particles: {
          color: {
            value: ["#ffffff", "#4b00ff"],
          },
          move: {
            direction: "bottom-right",
            enable: true,
            outModes: {
              default: "out",
            },
            random: false,
            speed: { min: 6, max: 11 }, // Velocidade bem alta para o rastro "esticar" e sumir rápido
            straight: true,
            trail: {
              enable: true,
              length: 4, // Rastro mais curto para sumir mais rápido conforme a estrela passa
              fill: {
                color: "#000000"
              }
            },
          },
          number: {
            density: {
              enable: true,
              width: 1920,
              height: 1080,
            },
            value: 50,
          },
          opacity: {
            value: { min: 0.4, max: 1 },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 2 },
          },
          shadow: {
            enable: true,
            blur: 4,
          },
        },
        detectRetina: true,
      }}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: "none"
      }}
    />
  );
}
