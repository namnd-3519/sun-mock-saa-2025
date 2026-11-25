import Image from "next/image";

/** 3 key visual band under the header (1440×547, mirrored in the export) with the "Cover" fade. */
export function AwardsKeyVisual() {
  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[627px] overflow-hidden">
      <div className="absolute inset-x-0 top-20 bottom-0">
        <Image
          src="/images/awards/keyvisual.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(0deg,#00101a_-4.23%,rgb(0_19_32/0)_52.79%)]" />
    </div>
  );
}
