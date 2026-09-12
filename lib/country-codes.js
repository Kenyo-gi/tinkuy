export const COUNTRY_CODES = [
  { code: "+51", name: "Peru" },
  { code: "+34", name: "Espana" },
  { code: "+52", name: "Mexico" },
  { code: "+54", name: "Argentina" },
  { code: "+56", name: "Chile" },
  { code: "+57", name: "Colombia" },
  { code: "+58", name: "Venezuela" },
  { code: "+593", name: "Ecuador" },
  { code: "+591", name: "Bolivia" },
  { code: "+598", name: "Uruguay" },
  { code: "+595", name: "Paraguay" },
  { code: "+506", name: "Costa Rica" },
  { code: "+507", name: "Panama" },
  { code: "+504", name: "Honduras" },
  { code: "+503", name: "El Salvador" },
  { code: "+502", name: "Guatemala" },
  { code: "+505", name: "Nicaragua" },
  { code: "+1", name: "Estados Unidos / Canada" },
  { code: "+44", name: "Reino Unido" },
  { code: "+33", name: "Francia" },
  { code: "+39", name: "Italia" },
  { code: "+49", name: "Alemania" },
  { code: "+55", name: "Brasil" },
];

const SORTED_CODES = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length);

export function splitPhone(phone) {
  if (!phone) return { code: "+51", rest: "" };
  const compact = phone.replace(/\s+/g, "");
  const match = SORTED_CODES.find((c) => compact.startsWith(c.code));
  if (match) {
    return { code: match.code, rest: compact.slice(match.code.length) };
  }
  return { code: "+51", rest: compact.replace(/\D/g, "") };
}
