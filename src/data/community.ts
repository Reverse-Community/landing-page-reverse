export const siteConfig = {
  name: "Reverse Community",
  domain: "reverse.my.id",
  guildId: "1065486356513554522",
  inviteUrl: process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "#top",
  tagline: {
    id: "Tempat ngobrol, mabar, belajar, dan tumbuh bareng.",
    en: "A place to connect, play, learn, and grow together."
  },
  socials: {
    discord: process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "",
    instagram: "",
    youtube: "",
    tiktok: ""
  },
  statsFallback: {
    members: 1200,
    online: 128,
    events: 24
  },
  nav: [
    { href: "#about", label: "Tentang", labelEn: "About" },
    { href: "#pillars", label: "Ruang", labelEn: "Spaces" },
    { href: "#events", label: "Events", labelEn: "Events" },
    { href: "#team", label: "Team", labelEn: "Team" },
    { href: "#members", label: "Members", labelEn: "Members" },
    { href: "#store", label: "Store", labelEn: "Merch" },
    { href: "#faq", label: "FAQ", labelEn: "FAQ" },
    { href: "/bots", label: "Bots", labelEn: "Docs" },
    { href: "/projects", label: "Projects", labelEn: "Map" }
  ]
};

export const aboutContent = {
  title: "Komunitas yang terasa seperti rumah kedua.",
  body: "Reverse Community dibangun sebagai ruang digital untuk orang-orang yang ingin punya koneksi sehat: bisa mabar, ngobrol random, belajar hal baru, dan ikut membentuk culture komunitas dari awal. Kami menjaga vibe yang welcoming, rapi, dan tetap punya energi gaming yang kuat."
};

export const marqueeItems = [
  "general chat",
  "gaming lobby",
  "music room",
  "learning circle",
  "creative lab",
  "podcast night",
  "community events",
  "member showcase"
];

export const pillars = [
  {
    icon: "MessageCircle",
    title: "General Chat",
    titleEn: "Daily Hangout",
    description: "Ruang santai buat ngobrol, curhat, kenalan, dan nyambung sama orang baru tanpa ribet."
  },
  {
    icon: "Gamepad2",
    title: "Gaming",
    titleEn: "Play Together",
    description: "Cari party, bikin squad, diskusi meta, atau ikutan event mabar dari game casual sampai kompetitif."
  },
  {
    icon: "Music2",
    title: "Music",
    titleEn: "Shared Sound",
    description: "Share playlist, discovery lagu baru, karaoke santai, dan night session bareng member."
  },
  {
    icon: "BookOpen",
    title: "Learning",
    titleEn: "Grow Together",
    description: "Belajar bareng soal coding, bahasa, desain, karier, dan hal-hal produktif lainnya."
  },
  {
    icon: "Radio",
    title: "Podcast & Creative",
    titleEn: "Creator Space",
    description: "Tempat ide, konten, podcast, live session, dan showcase karya member Reverse."
  },
  {
    icon: "CalendarDays",
    title: "Events",
    titleEn: "Moments",
    description: "Game night, sharing session, meetup, tournament kecil, dan activity yang bikin komunitas hidup."
  }
] as const;

export type TeamMemberLink = { label: string; url: string };

export type TeamMember = {
  name: string;
  role: string;
  city: string;
  accent: "red" | "blue";
  imageUrl?: string | null;
  links?: TeamMemberLink[];
};

export const teamMembers: TeamMember[] = [
  { name: "Squeezy", role: "Founder", city: "Indonesia", accent: "red" },
  { name: "Aksa", role: "Community Lead", city: "Jakarta", accent: "blue" },
  { name: "Naya", role: "Event Curator", city: "Bandung", accent: "red" },
  { name: "Raka", role: "Tech & Ops", city: "Surabaya", accent: "blue" }
];

export type LandingEvent = {
  date: string;
  title: string;
  tag: string;
  description: string;
  location?: string | null;
  imageUrl?: string | null;
};

export const events: { upcoming: LandingEvent[]; past: LandingEvent[] } = {
  upcoming: [
    {
      date: "18 Jun 2026",
      title: "Reverse Game Night",
      tag: "Gaming",
      description: "Mabar lintas game dengan format mini challenge dan party random buat member baru."
    },
    {
      date: "25 Jun 2026",
      title: "Creator Showcase Vol. 01",
      tag: "Creative",
      description: "Sesi showcase karya: desain, video, stream highlight, music cover, dan project kecil member."
    },
    {
      date: "02 Jul 2026",
      title: "Tech Talk: Build Your First Web Brand",
      tag: "Learning",
      description: "Sharing santai soal cara bikin identitas komunitas dan web landing yang terlihat serius."
    }
  ],
  past: [
    {
      date: "08 May 2026",
      title: "Reverse Chill Opening",
      tag: "Community",
      description: "Opening night buat kenalan, ngobrol, dan mapping minat member awal."
    },
    {
      date: "15 May 2026",
      title: "Music Sharing Session",
      tag: "Music",
      description: "Member saling lempar playlist dari lo-fi, J-pop, metal, sampai lagu galau jam 2 pagi."
    }
  ]
};

export type GalleryItem = { title: string; caption: string; imageUrl?: string | null };

export const gallery: GalleryItem[] = [
  { title: "Game Night", caption: "Lobby penuh, suara rame, momen menang bareng." },
  { title: "Study Circle", caption: "Belajar bareng tanpa gaya sok paling pintar." },
  { title: "Music Room", caption: "Playlist member jadi soundtrack malam komunitas." },
  { title: "Creator Wall", caption: "Karya member tampil dan diapresiasi." },
  { title: "Voice Hangout", caption: "Obrolan random yang sering jadi cerita panjang." },
  { title: "Mini Event", caption: "Challenge kecil, hadiah kecil, vibes besar." }
];

export const faqs = [
  {
    question: "Reverse Community itu komunitas apa?",
    answer: "Reverse adalah komunitas campuran untuk ngobrol, mabar, belajar, dan bikin koneksi baru. Fokusnya bukan satu game saja, tapi ekosistem digital yang nyaman buat banyak minat."
  },
  {
    question: "Apakah wajib aktif setiap hari?",
    answer: "Tidak. Kamu bisa aktif sesuai ritme sendiri. Komunitas yang sehat bukan soal spam chat, tapi soal tempat yang tetap welcoming saat kamu kembali."
  },
  {
    question: "Bisa ikut event kalau member baru?",
    answer: "Bisa. Event Reverse dirancang supaya member baru mudah masuk tanpa harus punya circle duluan."
  },
  {
    question: "Apakah website ini akan punya login member?",
    answer: "Belum di MVP. Untuk fase awal, website ini fokus sebagai landing page dan showcase brand. Fitur member showcase, game stats, dan merch/store disiapkan untuk roadmap berikutnya."
  },
  {
    question: "Bahasa komunitasnya apa?",
    answer: "Utamanya Bahasa Indonesia, tapi beberapa copy dan label dibuat bilingual supaya tetap ramah untuk audiens lebih luas."
  }
];

export const roadmap = ["Member showcase", "Game stats hub", "Merch/store", "Blog komunitas", "Public event RSVP"];

export type ShowcaseMember = {
  name: string;
  role: string;
  game: string;
  quote: string;
  imageUrl?: string | null;
};

export const memberShowcase: ShowcaseMember[] = [
  { name: "Rin", role: "Mabar Captain", game: "Valorant", quote: "Datang buat mabar, pulang bawa circle." },
  { name: "Fai", role: "Creative Member", game: "Design", quote: "Reverse jadi tempat lempar karya tanpa takut di-judge." },
  { name: "Zen", role: "Learning Buddy", game: "Web Dev", quote: "Kalau stuck, selalu ada yang bantu debug bareng." }
];

export const gameStats = [
  { label: "Weekly Mabar", value: "12+", description: "Sesi mabar lintas game yang bisa diikuti member baru." },
  { label: "Active Games", value: "8", description: "Game rotasi komunitas: FPS, sandbox, co-op, MOBA, dan casual." },
  { label: "Mini Tournaments", value: "4", description: "Format kecil, fun-first, tetap kompetitif secukupnya." }
];

export type MerchProduct = {
  name: string;
  price: string;
  status: string;
  imageUrl?: string | null;
};

export const merchProducts: MerchProduct[] = [
  { name: "Reverse Tee — Signal Black", price: "Coming soon", status: "Concept" },
  { name: "Reverse Sticker Pack", price: "Coming soon", status: "Concept" },
  { name: "Community Lanyard", price: "Coming soon", status: "Concept" }
];

export const legalPages = {
  terms: {
    title: "Syarat & Ketentuan",
    description: "Aturan penggunaan website dan partisipasi dasar di ekosistem Reverse Community."
  },
  privacy: {
    title: "Kebijakan Privasi",
    description: "Ringkasan data yang dipakai website Reverse dan bagaimana data tersebut dilindungi."
  },
  guidelines: {
    title: "Community Guidelines",
    description: "Standar perilaku supaya Reverse tetap aman, welcoming, dan nyaman untuk semua member."
  }
};
