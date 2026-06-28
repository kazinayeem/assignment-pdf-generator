import type { Locale, Messages, Namespace } from "./types";

import enCommon from "@/locales/en/common.json";
import enHome from "@/locales/en/home.json";
import enFooter from "@/locales/en/footer.json";
import enFaq from "@/locales/en/faq.json";
import enAbout from "@/locales/en/about.json";
import enPolicies from "@/locales/en/policies.json";
import enV5 from "@/locales/en/v5.json";
import enUniversities from "@/locales/en/universities.json";
import bnCommon from "@/locales/bn/common.json";
import bnHome from "@/locales/bn/home.json";
import bnFooter from "@/locales/bn/footer.json";
import bnFaq from "@/locales/bn/faq.json";
import bnAbout from "@/locales/bn/about.json";
import bnPolicies from "@/locales/bn/policies.json";
import bnV5 from "@/locales/bn/v5.json";
import bnUniversities from "@/locales/bn/universities.json";

export const messages: Record<Locale, Record<Namespace, Messages>> = {
  en: {
    common: enCommon as Messages,
    home: enHome as Messages,
    footer: enFooter as Messages,
    faq: enFaq as Messages,
    about: enAbout as Messages,
    policies: enPolicies as Messages,
    v5: enV5 as Messages,
    universities: enUniversities as Messages,
  },
  bn: {
    common: bnCommon as Messages,
    home: bnHome as Messages,
    footer: bnFooter as Messages,
    faq: bnFaq as Messages,
    about: bnAbout as Messages,
    policies: bnPolicies as Messages,
    v5: bnV5 as Messages,
    universities: bnUniversities as Messages,
  },
};
