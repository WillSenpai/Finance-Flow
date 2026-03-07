import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import openingLogo from "@/assets/startup/opening-logo.png";
import openingEllipse from "@/assets/startup/opening-ellipse.svg";
import openingDesign from "@/design/opening-loader.design.json";

type OpeningFrame = {
  id: string;
  shadow?: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    borderRadius: number;
  };
  logo?: {
    x: number;
    y: number;
    width: number;
    height: number;
    borderRadius: number;
  };
  text?: {
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    clipWidth?: number;
  };
};

const DESIGN = openingDesign as {
  artboard: { width: number; height: number; background: string };
  animation: {
    phaseTimestampsMs: number[];
    frameFadeMs: number;
    overlayExitMs: number;
    phaseTransitions?: Array<
      | null
      | { kind: "bezier"; delayMs: number; durationMs: number; ease: [number, number, number, number] }
      | { kind: "spring"; delayMs: number; mass: number; stiffness: number; damping: number }
    >;
  };
  textStyle: { fontFamily: string; fontSize: number; lineHeight: number; fontWeight: number; color: string };
  frames: OpeningFrame[];
};

const OpeningLoader = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const img = new Image();
    img.src = openingLogo;
  }, []);

  useEffect(() => {
    const estimateSpringDurationMs = (mass: number, stiffness: number, damping: number) => {
      const w0 = Math.sqrt(stiffness / mass);
      const zeta = damping / (2 * Math.sqrt(stiffness * mass));
      if (!Number.isFinite(w0) || w0 <= 0) return 500;
      const settleSeconds = zeta > 0 && zeta < 1 ? 4 / (zeta * w0) : 4 / w0;
      const ms = Math.round(settleSeconds * 950);
      return Math.min(1800, Math.max(220, ms));
    };

    const transitionDurationMs = (targetPhase: number) => {
      const spec = DESIGN.animation.phaseTransitions?.[targetPhase];
      if (!spec) return DESIGN.animation.frameFadeMs;
      if (spec.kind === "bezier") return spec.durationMs;
      return estimateSpringDurationMs(spec.mass, spec.stiffness, spec.damping);
    };

    const transitionDelayMs = (targetPhase: number) => DESIGN.animation.phaseTransitions?.[targetPhase]?.delayMs ?? 0;

    const timers: number[] = [];
    let cancelled = false;

    const schedulePhase = (currentPhase: number) => {
      const nextPhase = currentPhase + 1;
      if (nextPhase > DESIGN.frames.length - 1 || cancelled) return;

      const delayTimer = window.setTimeout(() => {
        if (cancelled) return;
        setPhase(nextPhase);

        const settleTimer = window.setTimeout(() => {
          if (!cancelled) {
            schedulePhase(nextPhase);
          }
        }, transitionDurationMs(nextPhase));
        timers.push(settleTimer);
      }, transitionDelayMs(nextPhase));

      timers.push(delayTimer);
    };

    setPhase(0);
    schedulePhase(0);

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const phaseFrame = DESIGN.frames[phase] ?? DESIGN.frames[DESIGN.frames.length - 1];
  const shadowFrame = phaseFrame.shadow;
  const logoFrame = phaseFrame.logo;
  const textFrame = DESIGN.frames[Math.max(3, phase)]?.text;
  const showLogo = phase >= 1;
  const showText = phase >= 3;
  const showShadow = Boolean(shadowFrame);
  const textClipWidth = textFrame ? (phase >= 4 ? textFrame.width : textFrame.clipWidth ?? textFrame.width) : 0;
  const phaseTransition = DESIGN.animation.phaseTransitions?.[phase];

  const frameToPercent = (value: number, axis: "x" | "y") => {
    const size = axis === "x" ? DESIGN.artboard.width : DESIGN.artboard.height;
    return `${(value / size) * 100}%`;
  };

  const buildTransition = () => {
    if (!phaseTransition) {
      return { duration: DESIGN.animation.frameFadeMs / 1000, ease: [0.4, 0, 0.2, 1] as const };
    }
    if (phaseTransition.kind === "bezier") {
      return {
        duration: phaseTransition.durationMs / 1000,
        ease: phaseTransition.ease,
      };
    }
    return {
      type: "spring" as const,
      mass: phaseTransition.mass,
      stiffness: phaseTransition.stiffness,
      damping: phaseTransition.damping,
    };
  };

  const elementTransition = buildTransition();
  const finalTextTransition =
    phase === 4
      ? { duration: 2.5, ease: [0.2, 0, 0.1, 1] as const }
      : elementTransition;

  return (
    <motion.div
      className="fixed inset-0 z-[200] overflow-hidden"
      style={{ backgroundColor: DESIGN.artboard.background }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DESIGN.animation.overlayExitMs / 1000, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(100vw, calc(100vh * 393 / 852))",
          height: "min(100vh, calc(100vw * 852 / 393))",
        }}
        data-node-id={phaseFrame.id}
      >
        <motion.img
          src={openingEllipse}
          alt=""
          className="absolute object-fill"
          initial={false}
          animate={{
            opacity: showShadow ? 1 : 0,
            left: frameToPercent(shadowFrame?.x ?? 0, "x"),
            top: frameToPercent(shadowFrame?.y ?? 0, "y"),
            width: frameToPercent(shadowFrame?.width ?? 0, "x"),
            height: frameToPercent(shadowFrame?.height ?? 0, "y"),
            borderRadius: shadowFrame?.borderRadius ?? 0,
          }}
          transition={{
            opacity: { duration: 0.2 },
            left: elementTransition,
            top: elementTransition,
            width: elementTransition,
            height: elementTransition,
            borderRadius: { duration: 0.24 },
          }}
        />

        {logoFrame ? (
          <motion.img
            src={openingLogo}
            alt=""
            className="absolute object-cover"
            initial={false}
            animate={{
              opacity: showLogo ? 1 : 0,
              left: frameToPercent(logoFrame.x, "x"),
              top: frameToPercent(logoFrame.y, "y"),
              width: frameToPercent(logoFrame.width, "x"),
              height: frameToPercent(logoFrame.height, "y"),
              borderRadius: logoFrame.borderRadius,
            }}
            transition={{
              opacity: { duration: 0.2 },
              left: elementTransition,
              top: elementTransition,
              width: elementTransition,
              height: elementTransition,
              borderRadius: { duration: 0.24 },
            }}
          />
        ) : null}

        {textFrame ? (
          <motion.div
            className="absolute"
            initial={false}
            animate={{
              opacity: showText ? 1 : 0,
              left: frameToPercent(textFrame.x, "x"),
              top: frameToPercent(textFrame.y, "y"),
              width: phase >= 4 ? `calc(${frameToPercent(textClipWidth, "x")} + 4px)` : frameToPercent(textClipWidth, "x"),
              height: frameToPercent(textFrame.height, "y"),
            }}
            transition={{
              opacity: { duration: 0.18 },
              width: finalTextTransition,
              left: finalTextTransition,
              top: finalTextTransition,
            }}
            style={{
              overflow: phase >= 4 ? "visible" : "hidden",
              paddingRight: phase >= 4 ? "4px" : 0,
            }}
          >
            <p
              className="m-0 whitespace-nowrap"
              style={{
                width: `${(textFrame.width / textClipWidth) * 100}%`,
                height: "100%",
                paddingRight: phase >= 4 ? "4px" : 0,
                fontFamily: DESIGN.textStyle.fontFamily,
                fontSize: DESIGN.textStyle.fontSize,
                lineHeight: `${DESIGN.textStyle.lineHeight}px`,
                fontWeight: DESIGN.textStyle.fontWeight,
                color: DESIGN.textStyle.color,
              }}
            >
              {textFrame.content}
            </p>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default OpeningLoader;
