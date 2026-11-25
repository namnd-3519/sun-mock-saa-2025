import Image from "next/image";
import type { HomeMessages } from "@/i18n/home-messages";

const PARAGRAPH = "text-justify text-base leading-6 font-bold text-white md:text-2xl md:leading-8";

/** B4: the "Root Further" theme story with the English proverb in the middle. */
export function RootFurtherStory({ messages }: { messages: HomeMessages }) {
  return (
    <section className="mx-auto flex w-full max-w-[1152px] flex-col items-center gap-8">
      <Image
        src="/images/home/root-further.png"
        alt=""
        width={290}
        height={129}
        style={{ height: "auto" }}
        className="w-[200px] md:w-[290px]"
      />
      <div className="flex flex-col gap-8">
        <div>
          {messages.story.map((text) => (
            <p key={text} className={PARAGRAPH}>
              {text}
            </p>
          ))}
        </div>
        <blockquote className="text-center font-bold text-white">
          <p className="text-lg leading-8 md:text-2xl">{messages.quote}</p>
          <p className="text-base leading-6 md:text-xl md:leading-8">{messages.quoteNote}</p>
        </blockquote>
        <div>
          {messages.storyEnd.map((text) => (
            <p key={text} className={PARAGRAPH}>
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
