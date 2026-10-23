/**
 * Four sets of eight photos, one per stage in lifecycle order, so no photo
 * appears twice on the site: the stage pages, the Services hub's process
 * panel, its stacking cards, and the home page's stage tabs. All 3840px wide;
 * next/image serves resized versions. `pos` keeps the subject in frame when
 * the photo is cropped.
 */
export type StagePhoto = { src: string; pos: string; alt: string };

const set = (prefix: string, list: [string, string, string][]): StagePhoto[] =>
  list.map(([slug, pos, alt]) => ({ src: `/assets/photos/v2/${prefix}-${slug}.jpg`, pos, alt }));

/** The stage pages' heroes. */
export const STAGE_PHOTOS = set("a", [
  ["registration", "40% 50%", "Front-desk coordinator checking a patient's insurance card at the reception counter"],
  ["eligibility", "70% 50%", "Verification specialist with a headset confirming coverage, an insurance card in hand"],
  ["prior-authorization", "45% 50%", "Dentist and care coordinator reviewing a treatment plan on a tablet"],
  ["dental-coding", "60% 50%", "Dentist pointing at a panoramic X-ray while a coding specialist takes notes"],
  ["claims-submission", "65% 50%", "Billing specialist checking a printed form at a dual-monitor workstation"],
  ["payment-posting", "35% 50%", "Two colleagues reconciling payment statements against a laptop"],
  ["denial-management", "55% 50%", "Specialist on a payer call while working through a folder of claim documents"],
  ["ar-reporting", "50% 50%", "Practice manager and accounts specialist discussing charts on a wall screen"],
]);

/** The Services hub's process panel. */
export const HUB_RAIL_PHOTOS = set("b", [
  ["registration", "60% 50%", "Receptionist entering a new patient's details on a tablet at check-in"],
  ["eligibility", "60% 50%", "Specialist with a headset comparing coverage details with a printed benefits sheet"],
  ["prior-authorization", "70% 50%", "Care coordinator on a call with a treatment plan on her desk"],
  ["dental-coding", "45% 50%", "Tooth chart and a dental X-ray on a tablet beside a pen"],
  ["claims-submission", "65% 50%", "Billing specialist ticking off a printed checklist beside her keyboard"],
  ["payment-posting", "65% 50%", "Accountant sorting remittance envelopes and deposit slips beside a laptop"],
  ["denial-management", "40% 50%", "Two specialists reviewing a highlighted document together"],
  ["ar-reporting", "45% 50%", "Manager reviewing tabbed reports at a conference table"],
]);

/** The Services hub's stacking cards. */
export const HUB_STACK_PHOTOS = set("c", [
  ["registration", "70% 50%", "Front-desk coordinator welcoming an arriving patient at a dental practice reception"],
  ["eligibility", "35% 50%", "Verification team working calls with headsets at a row of desks"],
  ["prior-authorization", "55% 50%", "Orthodontist explaining a treatment plan on a tablet to a parent and teenager"],
  ["dental-coding", "55% 50%", "Coding specialist comparing a clinical note with an intraoral photo on screen"],
  ["claims-submission", "35% 50%", "Team lead and billing specialist reviewing a claim on a laptop"],
  ["payment-posting", "50% 50%", "Hands matching a remittance statement to a deposit receipt"],
  ["denial-management", "60% 50%", "Specialist drafting a letter at her desk, files beside her"],
  ["ar-reporting", "50% 50%", "Team weekly review meeting with printed charts and laptops"],
]);

/** The home page's stage tabs. */
export const HOME_STAGE_PHOTOS = set("d", [
  ["registration", "50% 50%", "Patient handing her insurance card to a smiling front-desk coordinator"],
  ["eligibility", "75% 50%", "Specialist with a headset taking notes during a call"],
  ["prior-authorization", "45% 50%", "Dental clinician reviewing a patient chart on a tablet in the operatory"],
  ["dental-coding", "55% 50%", "Dental assistant and dentist reviewing bitewing X-rays beside the chair"],
  ["claims-submission", "75% 50%", "Billing specialist sending a claim from her laptop"],
  ["payment-posting", "40% 50%", "Finance coordinator checking an itemised statement with a calculator"],
  ["denial-management", "45% 50%", "Specialist on a call by the window, holding a payer letter"],
  ["ar-reporting", "55% 50%", "Practice owner and manager reviewing charts on a laptop"],
]);
