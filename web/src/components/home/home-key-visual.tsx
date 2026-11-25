import Image from "next/image";

/** 3.5 key visual behind the header and hero, with the "Cover" fade into the page background. */
export function HomeKeyVisual() {
  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[1480px] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[1392px]">
        <Image
          src="/images/home/keyvisual.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(12deg,#00101a_23.7%,rgb(0_18_29/0.46)_38.34%,rgb(0_19_32/0)_48.92%)]" />
    </div>
  );
}
