import Image from "next/image";

/**
 * Keyvisual (1440×512) with its "Cover" fade (25deg, #00101A 14.74% → transparent 47.8%).
 * MoMorph has no Kudos KV file: the homepage key visual stands in until the real art is added.
 */
export function KudosKeyVisual() {
  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[957px] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[512px]">
        <Image src="/images/home/keyvisual.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(25deg,#00101a_14.74%,rgb(0_19_32/0)_47.8%)]" />
      <div className="absolute inset-x-0 top-[312px] h-[200px] bg-[linear-gradient(180deg,rgb(0_16_26/0)_0%,#00101a_100%)]" />
    </div>
  );
}
