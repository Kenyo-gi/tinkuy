const CALLING_CODES = [
  ["593", "EC"], ["595", "PY"], ["598", "UY"], ["591", "BO"], ["502", "GT"],
  ["503", "SV"], ["504", "HN"], ["505", "NI"], ["506", "CR"], ["507", "PA"],
  ["509", "HT"], ["351", "PT"], ["352", "LU"], ["353", "IE"], ["354", "IS"],
  ["355", "AL"], ["356", "MT"], ["357", "CY"], ["358", "FI"], ["359", "BG"],
  ["370", "LT"], ["371", "LV"], ["372", "EE"], ["373", "MD"], ["374", "AM"],
  ["375", "BY"], ["376", "AD"], ["377", "MC"], ["378", "SM"], ["380", "UA"],
  ["381", "RS"], ["385", "HR"], ["386", "SI"], ["420", "CZ"], ["421", "SK"],
  ["212", "MA"], ["213", "DZ"], ["216", "TN"], ["218", "LY"], ["234", "NG"],
  ["254", "KE"], ["255", "TZ"], ["27", "ZA"], ["20", "EG"], ["30", "GR"],
  ["31", "NL"], ["32", "BE"], ["33", "FR"], ["34", "ES"], ["36", "HU"],
  ["39", "IT"], ["40", "RO"], ["41", "CH"], ["43", "AT"], ["44", "GB"],
  ["45", "DK"], ["46", "SE"], ["47", "NO"], ["48", "PL"], ["49", "DE"],
  ["51", "PE"], ["52", "MX"], ["54", "AR"], ["55", "BR"], ["56", "CL"],
  ["57", "CO"], ["58", "VE"], ["60", "MY"], ["61", "AU"], ["62", "ID"],
  ["63", "PH"], ["64", "NZ"], ["65", "SG"], ["66", "TH"], ["81", "JP"],
  ["82", "KR"], ["84", "VN"], ["86", "CN"], ["91", "IN"], ["92", "PK"],
  ["93", "AF"], ["94", "LK"], ["95", "MM"], ["98", "IR"], ["1", "US"],
];

const SORTED_CODES = [...CALLING_CODES].sort((a, b) => b[0].length - a[0].length);

function isoToFlag(iso) {
  return iso
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

export function getPhoneFlag(phone) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  const match = SORTED_CODES.find(([code]) => digits.startsWith(code));
  return match ? isoToFlag(match[1]) : "";
}
