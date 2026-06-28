import type {
  Accreditation,
  AdmissionStatistics,
  AlumniProfile,
  InternationalPartner,
  TimelineEvent,
  TrendMetric,
  University,
  VirtualTourSource,
} from "./types";

export function getUniversityTimeline(university: University): TimelineEvent[] {
  if (university.timeline?.length) return university.timeline;

  const events: TimelineEvent[] = [
    {
      year: university.established,
      title: "University Established",
      description: `${university.name} was established in ${university.established}.`,
      category: "founded",
    },
  ];

  if (university.viceChancellor) {
    events.push({
      year: new Date().getFullYear(),
      title: "Current Leadership",
      description: `Vice Chancellor: ${university.viceChancellor}`,
      category: "leadership",
    });
  }

  if (university.rankings.verified && university.rankings.qsWorld) {
    events.push({
      year: 2024,
      title: "QS World Ranking",
      description: `Ranked in QS World University Rankings.`,
      category: "recognition",
    });
  }

  for (const evt of university.events) {
    events.push({
      year: university.established,
      title: evt,
      description: evt,
      category: "milestone",
    });
  }

  return events.sort((a, b) => a.year - b.year);
}

export function getAccreditations(university: University): Accreditation[] {
  if (university.accreditations?.length) return university.accreditations;

  const list: Accreditation[] = [
    {
      name: "UGC Approved",
      type: "ugc",
      status: university.ugcApproved ? "active" : "pending",
      source: "https://www.ugc.gov.bd",
      verified: true,
    },
  ];

  if (university.category === "engineering" && university.rankings.verified) {
    list.push({
      name: "Washington Accord (Member Institution)",
      type: "washington",
      status: "active",
      source: university.website,
      verified: false,
    });
  }

  return list;
}

export function getInternationalPartners(university: University): InternationalPartner[] {
  if (university.partners?.length) return university.partners;

  return university.internationalPartnerships.map((name, i) => ({
    name,
    country: "International",
    countryCode: "UN",
    programs: university.exchangePrograms.slice(0, 2),
    type: i % 2 === 0 ? "exchange" as const : "research" as const,
  }));
}

export function getAdmissionStatistics(university: University): AdmissionStatistics {
  if (university.admissionStats) return university.admissionStats;

  return {
    verified: false,
    applicants: null,
    selected: null,
    acceptanceRate: null,
    availableSeats: null,
    competitionRatio: null,
    avgGpa: university.admission.hscGpaMin,
    byDepartment: university.programs.slice(0, 5).map((p) => ({
      department: p.department,
      applicants: null,
      selected: null,
      seats: null,
    })),
    yearlyTrend: [],
  };
}

export function getTrendMetrics(university: University): TrendMetric[] {
  if (university.trends?.length) return university.trends;

  const baseYear = university.established;
  const years = [baseYear, baseYear + 20, baseYear + 40, baseYear + 60, new Date().getFullYear()].filter(
    (y) => y <= new Date().getFullYear()
  );

  return [
    {
      key: "students",
      label: "Student Growth",
      data: years.map((year) => ({
        year,
        value: university.studentPopulation && year === years[years.length - 1]
          ? university.studentPopulation
          : null,
      })),
    },
    {
      key: "departments",
      label: "Department Growth",
      data: years.map((year) => ({
        year,
        value: university.departmentCount && year === years[years.length - 1]
          ? university.departmentCount
          : null,
      })),
    },
  ];
}

export function getAlumniProfiles(university: University): AlumniProfile[] {
  return university.alumni ?? [];
}

export function getVirtualTourSources(university: University): VirtualTourSource[] {
  if (university.virtualTours?.length) return university.virtualTours;

  const tours: VirtualTourSource[] = [];

  if (university.videoTours?.length) {
    for (const v of university.videoTours) {
      tours.push({
        type: "youtube",
        title: v.title,
        url: `https://www.youtube.com/watch?v=${v.youtubeId}`,
        youtubeId: v.youtubeId,
        category: v.category,
      });
    }
  } else if (university.youtube) {
    tours.push({
      type: "youtube",
      title: "Official YouTube Channel",
      url: university.youtube,
      category: "campus",
    });
  }

  if (university.mapEmbedUrl || university.mapUrl) {
    tours.push({
      type: "streetview",
      title: "Campus Location",
      url: university.mapUrl ?? university.mapEmbedUrl ?? "",
      category: "campus",
    });
  }

  return tours;
}
