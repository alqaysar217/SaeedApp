export type Reminder = {
  id: string;
  title: string;
  time: string; // HH:mm
  days: string[]; // 'everyday', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'
  enabled: boolean;
};

export const defaultReminders: Reminder[] = [
  { 
    id: 'surah-kahf', 
    title: 'قراءة سورة الكهف', 
    time: '10:00', 
    days: ['fri'],
    enabled: true,
  },
  { 
    id: 'morning-athkar', 
    title: 'أذكار الصباح', 
    time: '05:30',
    days: ['everyday'],
    enabled: true,
  },
  { 
    id: 'evening-athkar', 
    title: 'أذكار المساء', 
    time: '16:00',
    days: ['everyday'],
    enabled: true,
  },
  { 
    id: 'fasting-monday-thursday', 
    title: 'صيام الاثنين والخميس', 
    time: '20:00', // Reminder the night before
    days: ['sun', 'wed'],
    enabled: false,
  },
];
