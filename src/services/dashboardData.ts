
export interface SearchTerm {
  term: string;
  count: number;
}

export interface ChatMetric {
  day: string;
  conversations: number;
}

export interface ActivityHour {
  hour: string;
  users: number;
}

export interface PropertyFeature {
  feature: string;
  requestCount: number;
}

export interface ConversionRate {
  date: string;
  rate: number;
}

export interface DashboardData {
  totalChats: number;
  totalSearches: number;
  conversionRate: number;
  averageSessionTime: string;
  popularSearchTerms: SearchTerm[];
  chatMetrics: ChatMetric[];
  activityByHour: ActivityHour[];
  popularFeatures: PropertyFeature[];
  conversionTrend: ConversionRate[];
}

// Mock data for different agencies
const agencyData: Record<string, DashboardData> = {
  "1": {
    totalChats: 427,
    totalSearches: 1893,
    conversionRate: 0.27,
    averageSessionTime: "4:12",
    popularSearchTerms: [
      { term: "тристаен под наем в Лозенец", count: 124 },
      { term: "двустаен апартамент център", count: 98 },
      { term: "къща с двор Бояна", count: 76 },
      { term: "луксозен апартамент", count: 64 },
      { term: "мезонет Изток", count: 49 }
    ],
    chatMetrics: [
      { day: "Пон", conversations: 58 },
      { day: "Вт", conversations: 64 },
      { day: "Ср", conversations: 71 },
      { day: "Чет", conversations: 68 },
      { day: "Пет", conversations: 82 },
      { day: "Съб", conversations: 52 },
      { day: "Нед", conversations: 32 }
    ],
    activityByHour: [
      { hour: "6", users: 5 },
      { hour: "8", users: 18 },
      { hour: "10", users: 32 },
      { hour: "12", users: 45 },
      { hour: "14", users: 50 },
      { hour: "16", users: 62 },
      { hour: "18", users: 78 },
      { hour: "20", users: 42 },
      { hour: "22", users: 28 },
    ],
    popularFeatures: [
      { feature: "Гараж", requestCount: 142 },
      { feature: "Сауна", requestCount: 78 },
      { feature: "Басейн", requestCount: 64 },
      { feature: "Охрана", requestCount: 58 },
      { feature: "Тераса", requestCount: 127 }
    ],
    conversionTrend: [
      { date: "Яну", rate: 0.22 },
      { date: "Фев", rate: 0.23 },
      { date: "Мар", rate: 0.21 },
      { date: "Апр", rate: 0.25 },
      { date: "Май", rate: 0.26 },
      { date: "Юни", rate: 0.27 }
    ]
  },
  "2": {
    totalChats: 312,
    totalSearches: 1452,
    conversionRate: 0.22,
    averageSessionTime: "3:48",
    popularSearchTerms: [
      { term: "двустаен под наем Младост", count: 107 },
      { term: "тристаен апартамент продава", count: 84 },
      { term: "нова сграда Витоша", count: 65 },
      { term: "паркомясто включено", count: 48 },
      { term: "студио център", count: 41 }
    ],
    chatMetrics: [
      { day: "Пон", conversations: 48 },
      { day: "Вт", conversations: 52 },
      { day: "Ср", conversations: 55 },
      { day: "Чет", conversations: 51 },
      { day: "Пет", conversations: 61 },
      { day: "Съб", conversations: 34 },
      { day: "Нед", conversations: 21 }
    ],
    activityByHour: [
      { hour: "6", users: 3 },
      { hour: "8", users: 12 },
      { hour: "10", users: 28 },
      { hour: "12", users: 34 },
      { hour: "14", users: 37 },
      { hour: "16", users: 45 },
      { hour: "18", users: 51 },
      { hour: "20", users: 32 },
      { hour: "22", users: 19 },
    ],
    popularFeatures: [
      { feature: "Паркомясто", requestCount: 118 },
      { feature: "Южно изложение", requestCount: 87 },
      { feature: "Обзаведен", requestCount: 105 },
      { feature: "Асансьор", requestCount: 74 },
      { feature: "Климатик", requestCount: 83 }
    ],
    conversionTrend: [
      { date: "Яну", rate: 0.18 },
      { date: "Фев", rate: 0.19 },
      { date: "Мар", rate: 0.20 },
      { date: "Апр", rate: 0.21 },
      { date: "Май", rate: 0.22 },
      { date: "Юни", rate: 0.22 }
    ]
  },
  "3": {
    totalChats: 256,
    totalSearches: 1145,
    conversionRate: 0.31,
    averageSessionTime: "5:23",
    popularSearchTerms: [
      { term: "апартамент с морска гледка", count: 132 },
      { term: "къща близо до плаж", count: 97 },
      { term: "луксозен имот във Варна", count: 81 },
      { term: "студио за отдаване", count: 58 },
      { term: "апартамент нова сграда", count: 46 }
    ],
    chatMetrics: [
      { day: "Пон", conversations: 32 },
      { day: "Вт", conversations: 38 },
      { day: "Ср", conversations: 41 },
      { day: "Чет", conversations: 39 },
      { day: "Пет", conversations: 47 },
      { day: "Съб", conversations: 34 },
      { day: "Нед", conversations: 25 }
    ],
    activityByHour: [
      { hour: "6", users: 4 },
      { hour: "8", users: 14 },
      { hour: "10", users: 25 },
      { hour: "12", users: 31 },
      { hour: "14", users: 34 },
      { hour: "16", users: 42 },
      { hour: "18", users: 49 },
      { hour: "20", users: 37 },
      { hour: "22", users: 21 },
    ],
    popularFeatures: [
      { feature: "Морска гледка", requestCount: 154 },
      { feature: "Басейн", requestCount: 112 },
      { feature: "Обзаведен", requestCount: 89 },
      { feature: "Балкон", requestCount: 72 },
      { feature: "Паркинг", requestCount: 68 }
    ],
    conversionTrend: [
      { date: "Яну", rate: 0.25 },
      { date: "Фев", rate: 0.28 },
      { date: "Мар", rate: 0.29 },
      { date: "Апр", rate: 0.27 },
      { date: "Май", rate: 0.30 },
      { date: "Юни", rate: 0.31 }
    ]
  }
};

export const getDashboardData = (userId: string): DashboardData => {
  // Default to first user if not found
  return agencyData[userId] || agencyData["1"];
};
