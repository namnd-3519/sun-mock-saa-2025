import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { kudosEn } from "@/i18n/kudos-messages";
import type { PersonSummary } from "@/lib/kudos/kudos-types";
import { KudosPerson } from "./kudos-person";
import { PersonHoverCardContent } from "./person-hover-card-content";

const person: PersonSummary = {
  id: "user-1",
  fullName: "Nguyen Van A",
  avatarUrl: null,
  departmentCode: "CEVC1",
  kudosReceivedCount: 23,
};

function renderContent(isSelf: boolean): string {
  return renderToStaticMarkup(createElement(PersonHoverCardContent, { person, isSelf, messages: kudosEn }));
}

describe("PersonHoverCardContent", () => {
  it("shows name, department, kudos received and stars", () => {
    const html = renderContent(false);
    expect(html).toContain("Nguyen Van A");
    expect(html).toContain("CEVC1");
    expect(html).toContain(kudosEn.hoverCard.received);
    expect(html).toContain(">23<");
    expect(html).toContain(kudosEn.starsHint[2]);
  });

  it("links to /profile only for the signed-in user", () => {
    expect(renderContent(true)).toContain('href="/profile"');
    expect(renderContent(false)).not.toContain("href=");
  });

  it("uses the #FFEA9E hover ring on its avatar", () => {
    expect(renderContent(false)).toContain("border-brand-accent");
  });
});

describe("KudosPerson hover card wiring", () => {
  const render = (props: Partial<Parameters<typeof KudosPerson>[0]>) =>
    renderToStaticMarkup(createElement(KudosPerson, { person, messages: kudosEn, ...props }));

  it("wraps a named person in a closed hover card with the avatar as tap trigger", () => {
    const html = render({});
    expect(html).toContain('data-open="false"');
    expect(html).toContain("data-hover-card-trigger");
    expect(html).not.toContain("person-hover-card");
  });

  it("gives no hover card to the sender of an anonymous kudos", () => {
    const html = render({ withHoverCard: false });
    expect(html).not.toContain("data-open");
    expect(html).not.toContain("data-hover-card-trigger");
  });

  it("gives no hover card to a hidden anonymous sender", () => {
    const html = render({ person: null, anonymousName: "Secret Santa" });
    expect(html).toContain("Secret Santa");
    expect(html).not.toContain("data-open");
  });
});
