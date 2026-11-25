import { WAVE_FALLBACK } from "@/components/login/login-hero-background";

// MoMorph holds no image files: CSS fallback first, then the slot for the real key visual.
export function CountdownBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: WAVE_FALLBACK }} />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/countdown/keyvisual.jpg')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(18deg,#00101a_15.48%,rgb(0_18_29/0.46)_52.13%,rgb(0_19_32/0)_63.41%)]" />
    </div>
  );
}
