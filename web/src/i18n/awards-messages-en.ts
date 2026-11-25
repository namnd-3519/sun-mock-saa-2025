import type { AwardsMessages } from "./awards-messages-vi";

// English copy for the Awards Information screen; amounts keep the design's VND figures.
const EACH = "per award";

export const awardsEn: AwardsMessages = {
  caption: "Sun* Annual Awards 2025",
  title: "SAA 2025 Award System",
  rootFurtherAlt: "Root Further",
  categoriesLabel: "Award categories",
  quantityLabel: "Number of awards:",
  valueLabel: "Award value:",
  or: "Or",
  details: {
    topTalent: {
      description: [
        "The Top Talent award honors all-round outstanding individuals – people who keep proving their solid expertise and exceptional performance, consistently deliver value beyond expectations, and are highly regarded by customers and teammates. Always ready to take on any mission the organization entrusts to them, they are a constant source of inspiration who fuel motivation and have a positive impact on the whole team.",
      ],
      quantity: "10",
      unit: "Individuals",
      prizes: [{ value: "7.000.000 VNĐ", note: EACH }],
    },
    topProject: {
      description: [
        "The Top Project award honors outstanding project teams with business results beyond expectations, optimal operational efficiency and a dedicated work ethic. These are projects of high technical complexity that optimize resources and costs well, propose valuable ideas to customers, deliver exceptional profit and earn positive customer feedback. Their members strictly follow internal development standards, setting an example of excellence and professionalism.",
      ],
      quantity: "02",
      unit: "Teams",
      prizes: [{ value: "15.000.000 VNĐ", note: EACH }],
    },
    topProjectLeader: {
      description: [
        "The Top Project Leader award honors outstanding project managers – people who combine solid management skills, a strong ability to inspire and an “Aim High – Be Agile” mindset in every problem and context. Under their lead, team members not only overcome challenges and reach their goals together, but also keep their passion and Wasshoi spirit alive, and grow into a finer, happier version of themselves.",
      ],
      quantity: "03",
      unit: "Individuals",
      prizes: [{ value: "7.000.000 VNĐ", note: EACH }],
    },
    bestManager: {
      description: [
        "The Best Manager award honors exemplary leaders – people who have led their teams to results beyond expectations, with a remarkable impact on business performance and the sustainable growth of the organization. Under their leadership, the team conquers and masters every goal through versatility, effective collaboration and a flexible, technology-driven mindset in the digital era. They inspire the team to become confident and energized, ready to embrace and even lead revolutionary change.",
      ],
      quantity: "01",
      unit: "Individual",
      prizes: [{ value: "10.000.000 VNĐ" }],
    },
    signatureCreator: {
      description: [
        "The Signature award honors an individual or team that embodies the defining spirit Sun* aims for in each period.",
        "In 2025, the Signature award honors the Creator - an individual or team with a proactive, sharp mindset who always sees opportunity in challenge and leads the way in action. They are quick to spot problems and come up with practical solutions that bring clear value to the project, the customer or the organization. With a constructive mindset and the distinctive “Creator” spirit of Sun*, they not only respond positively to change but also proactively drive improvements, helping shape new standards for how Sun* people create value.",
      ],
      quantity: "01",
      unit: "Individual or team",
      prizes: [
        { value: "5.000.000 VNĐ", note: "for an individual award" },
        { value: "8.000.000 VNĐ", note: "for a team award" },
      ],
    },
    mvp: {
      description: [
        "The MVP award honors the most outstanding individual of the year – the face that represents the whole Sun* team.\nThey have shown exceptional ability, steadfast dedication and far-reaching influence, leaving a strong mark on the Sun* journey throughout the year.",
        "Beyond standing out for their performance and results, they are a source of inspiration that spreads – through their thinking, actions and positive influence on the team.\nThe MVP embodies every quality of an outstanding Sun* person and carries a great responsibility: to be a role model of Sun* people and spirit, helping lead the team to new heights.",
      ],
      quantity: "01",
      unit: "Individual",
      prizes: [{ value: "15.000.000 VNĐ" }],
    },
  },
};
