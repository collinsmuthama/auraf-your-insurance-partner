import GA from "@/assets/ga.jpg";
import JB from "@/assets/jubi.jpg";

export interface Partner {
  name: string;
  initials: string;
  logo: string;
}

// List of insurer partners. Keep in sync with the homepage Partners component and
// anything else that needs to be aware of the companies we're working with.
export const partnerList: Partner[] = [
  { name: "Jubilee", initials: "JI", logo: JB },
  { name: "GA", initials: "GA", logo: GA },
];

export const partnerNames: string[] = partnerList.map((p) => p.name);
