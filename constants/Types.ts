    
    
    export type CategoryType = {
    [key: string]: {
      [key: string]: {
        question: string;
        answer: string;
      }[];
    };
  };

  export type RootStackParamList = {
    Home: undefined;
    Communities: undefined;
    Chat: undefined;
    Scanner: undefined;
    MaintenanceLog: undefined;
    Profile: { userId: string };
    Community: { community: Community };
    MyVouchers: { voucherIds: string[] };
  };

  export interface LeaderboardEntry {
    rank: number;
    username: string;
    monthPoints: number;
    userId: string;
  }
  
  export interface Community {
    name: string;
    rank: number;
    communityId?: string; //replaced with fieldName in public community
    code?: string; //replaced with fieldValue in public community
    owner?: string;
    createdAt?: string;
  }

  export interface Slide {
    id: string;
    image: string;
    text: string;
    points: number;
  }

  export interface User {
    name: string;
    phoneNumber: string;
    totalRecycled: number;
    monthlyRecycled: number;
  }
  
  export interface Badge {
    id: number;
    name: string;
    icon: string;
    notes: string;
    threshold: number;
  }

  export interface Voucher {
    id: string;
    text: string;
    image: string;
    expiry: string | null;
    promoCode: string;
  }

  export interface dobObject {
    day: string;
    month: string;
    year: string;
  }

  export const dummyBadges: Badge[] = [
    {
      id: 1,
      name: "Eco Warrior",
      icon: "leaf",
      notes: "Recycled 5+ items",
      threshold: 5,
    },
    {
      id: 2,
      name: "Recycle Master",
      icon: "star",
      notes: "Recycled 10+ items",
      threshold: 10,
    },
    {
      id: 3,
      name: "Waste Reducer",
      icon: "trash",
      notes: "Recycled 25+ items",
      threshold: 25,
    },
    {
      id: 4,
      name: "Green Innovator",
      icon: "bulb",
      notes: "Recycled 50+ items",
      threshold: 50,
    },
    {
      id: 5,
      name: "Sustainability Champion",
      icon: "trophy",
      notes: "Recycled 100+ items",
      threshold: 100,
    },
  ];