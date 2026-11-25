const WAVE_FALLBACK = [
  "radial-gradient(ellipse 40% 60% at 85% 20%, rgb(255 184 0 / 0.55), transparent 70%)",
  "radial-gradient(ellipse 35% 45% at 70% 40%, rgb(255 106 0 / 0.4), transparent 70%)",
  "radial-gradient(ellipse 30% 40% at 95% 55%, rgb(0 200 120 / 0.35), transparent 70%)",
  "radial-gradient(ellipse 35% 40% at 80% 70%, rgb(40 110 255 / 0.35), transparent 70%)",
  "radial-gradient(ellipse 30% 40% at 60% 85%, rgb(150 60 255 / 0.3), transparent 70%)",
].join(", ");

export function LoginHeroBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: WAVE_FALLBACK }} />
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-[position:75%_0] lg:bg-[length:159.763%_133.371%] lg:bg-[position:-440px_-218px]"
        style={{ backgroundImage: "url('/images/login/keyvisual.jpg')" }}
      />
      <div className="absolute inset-0 bg-brand-bg/50 md:bg-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#00101a_0%,#00101a_25.41%,rgb(0_16_26/0)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,#00101a_22.48%,rgb(0_19_32/0)_51.74%)]" />
    </div>
  );
}
