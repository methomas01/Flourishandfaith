import React, { useState, useEffect } from "react";
import { supabase } from './lib/supabase.js';
import {
  Home, BarChart2, Users, User, Settings, BookOpen, Droplets, ArrowLeft,
  Plus, ChevronRight, Check, X, Eye, EyeOff, CheckCircle, Bell, Award,
  LogOut, Send, Star, Scale, Activity, Utensils, Pencil, Heart, MessageCircle,
  Flame, Target, TrendingUp, Calendar, MoreHorizontal, Trash2
} from "lucide-react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  .ff-app { font-family: 'DM Sans', system-ui, sans-serif; }
  .serif  { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; letter-spacing: -0.3px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes pop { 0%{transform:scale(0.95);opacity:0} 100%{transform:scale(1);opacity:1} }
  .fadeUp { animation: fadeUp 0.45s cubic-bezier(.22,.68,0,1.1) both; }
  .fadeIn { animation: fadeIn 0.3s ease both; }
  .pop { animation: pop 0.35s cubic-bezier(.22,.68,0,1.1) both; }
  .btn { transition: filter 0.12s, transform 0.1s; cursor: pointer; }
  .btn:hover { filter: brightness(0.93); }
  .btn:active { transform: scale(0.97); }
  .card-hover { transition: transform 0.18s, box-shadow 0.18s; cursor: pointer; }
  .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(44,62,42,0.12) !important; }
  .nav-item { transition: background 0.13s, color 0.13s; cursor: pointer; border-radius: 10px; }
  .nav-item:hover:not(.nav-active) { background: #F5F1E8 !important; }
  .ff-input:focus { outline: none; border-color: #5A7B4F !important; box-shadow: 0 0 0 3px rgba(90,123,79,0.14); }
  textarea:focus, select:focus { outline: none; border-color: #5A7B4F !important; box-shadow: 0 0 0 3px rgba(90,123,79,0.14); }
  .scroll::-webkit-scrollbar { width: 3px; }
  .scroll::-webkit-scrollbar-thumb { background: #C9A961; border-radius: 99px; }
  input, textarea, select, button { font-family: 'DM Sans', system-ui, sans-serif; }
  .metrics-grid { grid-template-columns: repeat(4,1fr) !important; }
  .main-grid    { grid-template-columns: 1fr 1fr !important; }
  .programs-grid{ grid-template-columns: repeat(3,1fr) !important; }
  @media (max-width: 900px) {
    .metrics-grid  { grid-template-columns: 1fr 1fr !important; }
    .main-grid     { grid-template-columns: 1fr !important; }
    .programs-grid { grid-template-columns: 1fr 1fr !important; }
  }
  @media (max-width: 540px) {
    .metrics-grid  { grid-template-columns: 1fr 1fr !important; }
    .programs-grid { grid-template-columns: 1fr !important; }
  }
  .tab-item { transition: all 0.18s; cursor: pointer; }
  @keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
`;

const C = {
  primary: '#5A7B4F', accent: '#C9A961', bg: '#FEFDFB', bgAlt: '#F5F1E8',
  text: '#2C3E2A', muted: '#6B7467', success: '#7FA876', alert: '#E8C468',
  border: '#DDD9D0', white: '#FFFFFF', blue: '#A8D8EA',
};

const shadow = { card: '0 2px 14px rgba(44,62,42,0.07)', lg: '0 6px 28px rgba(44,62,42,0.12)' };


const DEVOTIONALS = [
  { id:0, theme:'Your Body is a Temple', ref:'1 Corinthians 6:19-20',
    scripture:'"Do you not know that your body is a temple of the Holy Spirit within you, whom you have from God? You are not your own, for you were bought with a price. So glorify God in your body."',
    reflection:'So often we think of our spiritual life as separate from our physical life — prayer time in one box, meals and movement in another. But Scripture tells us something different. Your body is the very dwelling place of the Holy Spirit. That changes everything.\n\nWhen you choose nourishing food, you\'re not just eating — you\'re stewarding a temple. When you rest instead of pushing through exhaustion, you\'re honoring what God calls holy. When you move with joy, you\'re worshipping with flesh and bone.\n\nThis doesn\'t mean perfection. It means intentionality and grace — always grace.',
    prompt:'How can you honor your body as a temple today — in one small, practical way?' },
  { id:1, theme:'Strength for the Journey', ref:'Isaiah 40:31',
    scripture:'"But those who wait for the LORD shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint."',
    reflection:'Some days the wellness journey feels light and hopeful. Other days, it feels heavy — progress is slow, motivation is gone, and you wonder why you started.\n\nThose are the days Isaiah 40:31 was written for. Not the easy days — the hard ones. The waiting days.\n\nGod promises to renew your strength when you wait on Him. Not if you perform perfectly — but when you bring your weary self to Him and trust that His power works through your weakness.',
    prompt:'Where do you need God\'s strength renewed today? Bring that specific need to Him in prayer.' },
  { id:2, theme:'Nourished and Whole', ref:'3 John 1:2',
    scripture:'"Beloved, I pray that all may go well with you and that you may be in good health, as it goes well with your soul."',
    reflection:'God cares about your whole health — not just your spiritual life, but your physical health too. This verse is a window into God\'s heart: He wants you to flourish completely.\n\nWholeness is the vision. Body, soul, and spirit thriving together — not one at the expense of the others. That\'s why this journey isn\'t just about what you eat or how much you move. It\'s about becoming the whole, flourishing woman God created you to be.',
    prompt:'What does "flourishing completely" look like for you right now — body, soul, and spirit?' },
  { id:3, theme:'Grace Over Guilt', ref:'Romans 8:1',
    scripture:'"There is therefore now no condemnation for those who are in Christ Jesus."',
    reflection:'Guilt is not a wellness tool. It never has been. It might create short-term behavior change, but it destroys the spirit of the person trying to change.\n\nGrace, on the other hand, is transformative. When you miss a day, skip a workout, or eat past your comfort — grace says: you are not condemned. You are loved. You can begin again.\n\nThis is not an excuse to abandon effort. It\'s the foundation that makes sustainable effort possible. You pursue health from a place of love, not fear.',
    prompt:'Is there an area of your wellness journey where you\'ve been hard on yourself? How would grace respond instead?' },
  { id:4, theme:'Moving with Joy', ref:'Psalm 149:3',
    scripture:'"Let them praise his name with dancing, making melody to him with tambourine and lyre!"',
    reflection:'Movement was never meant to be punishment. Long before gym memberships and calorie burns, God\'s people danced — for joy, for worship, for the sheer delight of having bodies that could move.\n\nWhat if you approached today\'s movement as an act of praise? A walk that becomes a prayer. A stretch that becomes gratitude. Even washing dishes with intention can become a sacred act when your heart is oriented toward the One who gave you this body.',
    prompt:'What form of movement brings you joy? How can you make time for that today?' },
  { id:5, theme:'Community and Accountability', ref:'Proverbs 27:17',
    scripture:'"Iron sharpens iron, and one person sharpens another."',
    reflection:'We were never designed to walk this journey alone. The myth of the lone warrior — white-knuckling their way to health through sheer willpower — is exactly that: a myth.\n\nGod designed us for community. For women who speak truth gently, who pray for us when we can\'t pray for ourselves, who celebrate our small victories and sit with us in our hard seasons.\n\nWho is sharpening you right now? Who are you sharpening?',
    prompt:'Is there a woman in your life you could invite to walk this wellness journey with you? What would that look like?' },
  { id:6, theme:'Rest as Worship', ref:'Psalm 23:2-3',
    scripture:'"He makes me lie down in green pastures. He leads me beside still waters. He restores my soul."',
    reflection:'Rest is not laziness. Rest is trust.\n\nWhen God leads you to lie down in green pastures, He is not punishing you with inactivity — He is restoring you. The shepherd knows the sheep need rest before they need more movement.\n\nIn a culture that glorifies busy, choosing rest is countercultural. It is also deeply faithful. When you honor your body\'s need for sleep, recovery, and stillness, you are saying: I trust that God works even while I rest.',
    prompt:'How well are you honoring your body\'s need for rest? What is one way you can build more restoration into your week?' },
];

// Returns today's devotional based on day of year (cycles through the 7)
function getTodayDevotional() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return DEVOTIONALS[dayOfYear % DEVOTIONALS.length];
}

// Today's date key e.g. "2026-03-22" — used for daily reset
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// Week key e.g. "2026-W12"
function getWeekKey() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

// Init weekly tracking — resets each Monday
function initWeeklyTracking() {
  try {
    const wk = JSON.parse(localStorage.getItem('ff_week') || '{}');
    const key = getWeekKey();
    if (!wk[key]) {
      wk[key] = { devs:0, water:0, move:0 };
      localStorage.setItem('ff_week', JSON.stringify(wk));
    }
  } catch(e) {}
}

// Get this week's stats
function getWeeklyStats() {
  try {
    const wk = JSON.parse(localStorage.getItem('ff_week') || '{}');
    return wk[getWeekKey()] || { devs:0, water:0, move:0 };
  } catch(e) { return { devs:0, water:0, move:0 }; }
}

// Load or initialize daily tracking state from localStorage
function loadDailyState() {
  const key = getTodayKey();
  try {
    const saved = localStorage.getItem('ff_daily');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === key) return parsed; // same day → use saved
    }
  } catch(e) {}
  // New day (or first time) → fresh state
  return { date: key, food: [], water: 0, weight: [], movement: [] };
}

function saveDailyState(state) {
  try { localStorage.setItem('ff_daily', JSON.stringify({ ...state, date: getTodayKey() })); } catch(e) {}
}

const MOCK_POSTS = [];

const INIT_FOOD = [];

// ─── SAGE AI ──────────────────────────────────────────────────────────────────
const SAGE_SYSTEM = `You are Sage, a warm and wise AI wellness coach for Flourish & Faith — a faith-integrated wellness app for Christian women. You blend evidence-based wellness guidance with biblical wisdom.

Your personality: Encouraging, grace-centered, wise like an older sister in faith. You never use shame, guilt, or fear as motivators. You celebrate every step forward, no matter how small.

Your approach:
- Weave relevant Scripture naturally into responses (cite the reference)
- Keep responses warm but concise — 2-4 short paragraphs max
- Use grace-centered language — no "cheat days," no "bad foods," no "failing"
- Connect physical wellness to spiritual purpose
- When someone struggles, lead with empathy before advice

Topics you cover: nutrition, movement, hydration, rest, faith, habit-building, body image, community, accountability, and spiritual wellness.`;

// ─── STREAK & ACTIVITY HELPERS ────────────────────────────────────────────────
function calculateStreak() {
  // Count consecutive days where devDone was true by checking ff_journals entries
  try {
    const journals = JSON.parse(localStorage.getItem('ff_journals') || '{}');
    const week = JSON.parse(localStorage.getItem('ff_week') || '{}');
    // Build a set of days with activity (journal entries = devotional done)
    const activeDays = new Set(Object.keys(journals));
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 365; i++) {
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (activeDays.has(key)) { streak++; d.setDate(d.getDate()-1); }
      else break;
    }
    return streak;
  } catch { return 0; }
}

function formatRelativeTime(id) {
  // id is a Date.now() timestamp used as the post id
  try {
    const diff = Date.now() - id;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
    return `${Math.floor(diff/86400000)}d ago`;
  } catch { return 'Recently'; }
}

function getActivityData() {
  // Returns 90-day activity map: { 'YYYY-MM-DD': { food, water, movement, devotion } }
  try {
    const journals  = new Set(Object.keys(JSON.parse(localStorage.getItem('ff_journals') || '{}')));
    const weights   = new Set((JSON.parse(localStorage.getItem('ff_weight')  || '[]')).map(e=>e.date));
    const result = {};
    const today = new Date();
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const hasDevot  = journals.has(key);
      const hasWeight = weights.has(key);
      if (hasDevot || hasWeight || key === getTodayKey()) {
        result[key] = { devotion: hasDevot, weight: hasWeight };
      }
    }
    return result;
  } catch { return {}; }
}
const FREE_SAGE_LIMIT = 10;
function getSageMsgCount() {
  try {
    const d = JSON.parse(localStorage.getItem('ff_sage_daily') || '{}');
    return d.date === getTodayKey() ? (d.count || 0) : 0;
  } catch { return 0; }
}
function incrementSageMsgCount() {
  try {
    const count = getSageMsgCount() + 1;
    localStorage.setItem('ff_sage_daily', JSON.stringify({ date: getTodayKey(), count }));
    return count;
  } catch { return 0; }
}

function SageTab({ user }) {
  const isPremium = user?.plan === 'premium';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(() => getSageMsgCount());
  const bottomRef = React.useRef(null);
  const remaining = FREE_SAGE_LIMIT - msgCount;
  const limitReached = !isPremium && msgCount >= FREE_SAGE_LIMIT;
  const name = user?.name ? `, ${user.name}` : '';

  const QUICK_PROMPTS = [
    "I'm struggling with motivation today",
    'Give me a grace-centered meal idea',
    'I need a Scripture for a hard day',
    'How do I build a morning routine?',
  ];

  useEffect(() => {
    const limitNote = !isPremium ? `\n\nYou have ${FREE_SAGE_LIMIT} free messages per day.` : '';
    setMessages([{ role:'assistant', text: `Hi${name}! I'm Sage, your faith-integrated wellness coach. 🌿\n\nI'm here to help you nourish your body, build grace-centered habits, and connect your wellness journey to your faith.${limitNote}\n\nWhat's on your heart today?` }]);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

  // ── Conversational fallback — reads full history to stay contextual ──
  const getConversationalReply = (userText, history) => {
    const t = userText.toLowerCase();
    const prev = history.filter(m => m.role === 'assistant').map(m => m.content || m.text || '').join(' ').toLowerCase();
    const userHistory = history.filter(m => m.role === 'user').map(m => m.content || m.text || '').join(' ').toLowerCase();
    const turnCount = history.filter(m => m.role === 'user').length;

    // ── Detect topic from CURRENT message ──
    const isAbout = (...keywords) => keywords.some(k => t.includes(k));
    const hadDiscussed = (...keywords) => keywords.some(k => prev.includes(k) || userHistory.includes(k));

    // ── Yes / No / Acknowledgement responses ──
    if (isAbout('yes', 'yeah', 'yep', 'yup', 'sure', 'okay', 'ok', 'alright', 'sounds good')) {
      if (hadDiscussed('water', 'hydrat', 'cups')) {
        return `That's the spirit${name}! 💧 Keep that water bottle close. A little tip: set a reminder on your phone for every 2 hours — just a gentle nudge to take a few sips. It's amazing how quickly it adds up. How are you feeling otherwise today?`;
      }
      if (hadDiscussed('walk', 'movement', 'exercise', 'workout')) {
        return `Yes! Even a short walk is a gift you give your body and your mind${name}. Philippians 4:13 says you can do all things through Christ who gives you strength — and that includes lacing up those shoes. What time of day works best for you to move?`;
      }
      if (hadDiscussed('devotion', 'scripture', 'pray', 'god', 'faith')) {
        return `That willingness is everything${name}. When we invite God into our wellness journey, it stops being about willpower and starts being about grace. Is there a specific area of your health you'd like to bring to Him today?`;
      }
      return `I love that energy${name}! 🌿 Small yeses add up to big transformation. What feels like the most natural next step for you right now?`;
    }

    if (isAbout('no', 'nope', 'not really', "haven't", 'didnt', "didn't", 'forgot')) {
      if (hadDiscussed('water', 'hydrat', 'cups')) {
        return `No worries at all${name} — grace covers it! There's still time today. Start right now: go get a glass of water before your next message. 😊 Even one cup is better than zero. What's getting in the way of remembering to drink?`;
      }
      if (hadDiscussed('walk', 'exercise', 'movement', 'workout')) {
        return `That's completely okay${name}. Rest and rest days are part of the journey too (Psalm 23:2 — He makes you lie down in green pastures!). Is there something small you could do right now, even just stretching for 5 minutes? Or is your body genuinely asking for rest today?`;
      }
      if (hadDiscussed('eat', 'food', 'meal', 'breakfast', 'lunch', 'dinner')) {
        return `Life gets busy${name} — we've all been there. Let's make it simple. What do you have available right now? Even something quick like Greek yogurt, an apple with peanut butter, or eggs can be a nourishing choice. What's in your kitchen?`;
      }
      return `That's okay${name} — this journey isn't about perfection, it's about progress and grace. What's one small thing you *could* do today that would feel like caring for yourself?`;
    }

    if (isAbout('thank', 'thanks', 'helpful', 'that helps', 'appreciate', 'love that')) {
      const followUps = [
        `You're so welcome${name}! 🌿 It's a joy to walk this with you. Is there anything else on your heart today?`,
        `Always here for you${name}. Remember — every small act of care for your body is an act of worship. What else can I help you with?`,
        `That makes my heart so happy${name}! You're doing the work and that matters. Anything else you'd like to explore today?`,
      ];
      return followUps[turnCount % followUps.length];
    }

    // ── Follow-up responses within an ongoing topic ──
    if (hadDiscussed('motivat', 'stuck', 'hard day', 'struggling')) {
      if (isAbout('try', 'will', 'gonna', 'going to', 'start', 'maybe', 'think so')) {
        return `That "maybe" is enough${name} — God meets us in our willingness, not our certainty. Isaiah 40:31 says those who *wait* on the Lord will renew their strength. Starting small is still starting. What one thing will you do in the next hour to take care of yourself?`;
      }
      if (isAbout('why', 'what', 'how', 'help me')) {
        return `Great question${name}. When motivation is low, the problem usually isn't laziness — it's that the goal feels too big or too far away.\n\nTry this: forget the big goal for today. Just ask yourself, *what is the kindest thing I can do for my body in the next 10 minutes?* Maybe it's drinking water. A short walk. Or simply resting without guilt.\n\nWhat feels most doable right now?`;
      }
      if (isAbout('tired', 'exhaust', 'worn out', 'burnt out')) {
        return `Burnout is real${name}, and your body is wise to ask for rest. Even Jesus withdrew to rest and pray (Luke 5:16). \n\nCan I ask — is this physical tiredness, emotional tiredness, or both? That matters because the answer is different for each. Tell me more about what you're carrying right now.`;
      }
    }

    if (hadDiscussed('food', 'eat', 'meal', 'calorie', 'diet', 'hungry')) {
      if (isAbout('breakfast', 'morning', 'wake up')) {
        return `Breakfast is such a powerful way to start the day with intention${name}! 🌅\n\nSome grace-centered options:\n• Overnight oats with berries — prep the night before, grab and go\n• Greek yogurt parfait with granola and fruit\n• 2-3 scrambled eggs with spinach — quick, filling, high protein\n• A banana with almond butter if you're in a rush\n\nWhat does your typical morning look like? That helps me suggest what's actually realistic for you.`;
      }
      if (isAbout('lunch', 'midday', 'noon')) {
        return `Lunch is often the meal people skip or rush${name} — but it's so important for keeping your energy steady!\n\nSome easy ideas:\n• A big salad with grilled chicken or chickpeas\n• Turkey and avocado wrap in a whole wheat tortilla\n• Leftovers from last night's dinner (the most underrated option!)\n• A grain bowl with quinoa, roasted veggies, and tahini dressing\n\nDo you usually eat at home or are you eating out / at work?`;
      }
      if (isAbout('dinner', 'evening', 'night')) {
        return `Dinner is a wonderful time to nourish your body after a full day${name}.\n\nSome ideas that are satisfying without being heavy:\n• Baked salmon with roasted asparagus — done in 20 minutes\n• Chicken stir-fry with vegetables over brown rice\n• Lentil soup — comforting, high protein, easy to batch cook\n• Turkey meatballs with zucchini noodles\n\nHow much time and energy do you usually have for cooking in the evenings?`;
      }
      if (isAbout('snack', 'hungry', 'craving')) {
        return `Cravings are often just your body asking for something${name} — sometimes it's nutrients, sometimes it's rest, sometimes it's just water!\n\nGrace-centered snack ideas:\n• Apple with almond butter\n• Baby carrots and hummus\n• A small handful of mixed nuts\n• Greek yogurt with a drizzle of honey\n• String cheese and a piece of fruit\n\nWhat kind of craving are you having — sweet, salty, or just general hunger?`;
      }
    }

    if (hadDiscussed('water', 'hydrat', 'drink', 'cups')) {
      if (isAbout('how much', 'how many', 'enough', 'goal')) {
        return `Great question${name}! The general guideline is 8 cups (64 oz) of water a day — that's your goal in the app. But honestly, if you're exercising or it's hot outside, you might need more.\n\nA simple check: your urine should be pale yellow. If it's dark, drink more. If it's clear, you're hydrating well!\n\nHave you been hitting your goal lately, or does it feel hard to get there?`;
      }
      if (isAbout("don't like", 'boring', 'taste', 'plain')) {
        return `You're not alone${name} — plain water can feel boring! Here are some ways to make it more enjoyable:\n\n🍋 Add lemon or lime slices\n🫐 Drop in a few fresh berries\n🌿 Try cucumber and mint — surprisingly refreshing\n🍊 Sparkling water counts too!\n\nAlso try drinking a full glass right when you wake up — it's easier to hit your goal when you start early. What sounds most appealing to you?`;
      }
    }

    if (hadDiscussed('sleep', 'rest', 'tired', 'insomnia', 'awake')) {
      if (isAbout('how', 'tips', 'help', 'try', 'what can')) {
        return `Here's what actually helps most${name}:\n\n🌙 **Wind-down routine** — dim lights 45 min before bed, no screens\n📵 **Phone outside the bedroom** — even face-down on the nightstand disrupts sleep\n🌡️ **Cool room** — around 65-68°F is optimal\n📖 **Short prayer or gratitude** — settles your mind and spirit\n☕ **Cut caffeine after 2pm** — it stays in your system longer than you think\n\nGod designed sleep as restoration (Psalm 127:2). Which of these feels most doable to try tonight?`;
      }
      if (isAbout('stress', 'anxious', 'worry', 'mind racing')) {
        return `A racing mind at bedtime is so common${name} — especially for women who carry so much. 💙\n\nTry the **3-3-3 wind down**: in the last 30 minutes before bed, name 3 things you're grateful for, release 3 worries to God in prayer, and take 3 deep slow breaths.\n\nPhilippians 4:6-7 is such a good bedtime verse — "Do not be anxious about anything... and the peace of God will guard your hearts."\n\nIs stress a regular part of your evenings, or is tonight particularly heavy?`;
      }
    }

    if (hadDiscussed('weight', 'scale', 'pounds', 'lbs', 'size', 'body')) {
      if (isAbout('how', 'what', 'advice', 'tips', 'help')) {
        return `I want to share something important before any tips${name}: sustainable progress comes from *consistency over intensity* — and from approaching your body with curiosity, not criticism.\n\nThree things that actually move the needle:\n1. **Protein at every meal** — keeps you full, supports muscle\n2. **Daily movement you enjoy** — not punishment, joy\n3. **Sleep** — seriously, sleep deprivation makes weight loss almost impossible\n\nThe app's food log and weight tracker can help you see patterns without obsessing over daily fluctuations. What feels like the biggest challenge for you right now?`;
      }
      if (isAbout('frustrated', 'stuck', 'plateau', 'not working', 'not losing')) {
        return `Plateaus are genuinely frustrating${name}, and I want to validate that completely. Your effort is real, even when the scale doesn't show it.\n\nA few things to consider:\n• **Are you eating enough?** Under-eating slows your metabolism\n• **Sleep quality** — this has a huge impact on hormones that regulate weight\n• **Stress levels** — cortisol holds on to weight\n• **Muscle gain** — if you're exercising, you may be building muscle while losing fat (same number, different body)\n\nHow long have you been at the same weight, and what's been consistent in your routine?`;
      }
    }

    if (hadDiscussed('faith', 'scripture', 'bible', 'pray', 'god', 'church')) {
      if (isAbout('verse', 'scripture', 'bible', 'passage', 'what does')) {
        return `Here are some of my favorites for the wellness journey${name}:\n\n📖 **For strength:** "I can do all things through Christ who strengthens me." — Philippians 4:13\n\n📖 **For body stewardship:** "Do you not know that your bodies are temples of the Holy Spirit?" — 1 Corinthians 6:19-20\n\n📖 **For hard days:** "His mercies are new every morning; great is your faithfulness." — Lamentations 3:22-23\n\n📖 **For rest:** "He makes me lie down in green pastures. He restores my soul." — Psalm 23:2-3\n\n📖 **For endurance:** "Let us not grow weary of doing good." — Galatians 6:9\n\nIs there a specific season or struggle you'd like Scripture to speak into?`;
      }
      if (isAbout('struggle', 'hard', "can't", 'difficult', 'why')) {
        return `Faith and struggle go hand in hand${name} — even Paul wrote about his "thorn in the flesh" (2 Corinthians 12:7-9). Struggle doesn't mean God isn't there. It sometimes means He's doing His deepest work.\n\nIn wellness, I find that the struggle is often spiritual before it's physical. When we're fighting our bodies instead of stewarding them, something deeper is usually going on.\n\nCan you share a little more about what you're struggling with? I want to meet you right where you are.`;
      }
    }

    if (isAbout('habit', 'routine', 'consistent', 'every day', 'daily', 'morning')) {
      if (hadDiscussed('morning', 'routine', 'habit', 'consistent')) {
        return `Building on what we've been discussing${name} — consistency comes from making the habit *easy* enough that you can do it even on your worst day.\n\nThe trick: **habit stacking**. Attach a new habit to something you already do.\n• After you make coffee → drink a glass of water\n• Before you check your phone → read one verse\n• After you brush your teeth → do 5 minutes of stretching\n\nWhat's one habit you already do consistently every morning? We can stack something new onto that.`;
      }
      return `Morning routines are such a powerful way to set your spirit and your body for the day${name}! ☀️\n\nA simple framework that works:\n1. **Hydrate first** — glass of water before anything\n2. **5 minutes with God** — a verse, a prayer, or just stillness\n3. **Move your body** — even a short stretch or walk\n4. **Nourishing breakfast** — protein helps you stay stable all morning\n\nYou don't need an hour — even 15 intentional minutes changes the whole day. What does your current morning look like?`;
    }

    // ── Generic follow-up that stays relevant to the topic ──
    const lastAssistantMsg = history.filter(m=>m.role==='assistant').slice(-1)[0]?.content || '';
    if (lastAssistantMsg.includes('?')) {
      // They're responding to a question we asked
      return `Thank you for sharing that${name}. 🌿 That gives me a much clearer picture.\n\nHere's what I'd suggest based on what you've told me: start with the smallest version of the change possible. Research shows that tiny habits — ones that take under 2 minutes — have the highest success rate because they remove the resistance of starting.\n\nWhat would the 2-minute version of what we've been talking about look like for you?`;
    }

    // ── New topic responses ──
    if (isAbout('stress', 'anxious', 'anxiety', 'overwhelm', 'worry')) {
      return `Stress and wellness are deeply connected${name} — when we're overwhelmed, everything else becomes harder. Your body notices.\n\nA few immediate things that help:\n🌬️ **Box breathing** — inhale 4 counts, hold 4, exhale 4, hold 4. Repeat 3x. It physically calms your nervous system.\n🙏 **Cast your anxiety** — 1 Peter 5:7: "Cast all your anxiety on him because he cares for you."\n🚶 **Move your body** — even a 10-minute walk significantly reduces cortisol\n\nIs this stress a specific situation, or does it feel more like a constant undercurrent?`;
    }

    if (isAbout('lonely', 'alone', 'isolated', 'no friends', 'community')) {
      return `Oh${name}, I hear you — loneliness is one of the hardest things to carry, and it affects our wellness in ways we often don't recognize.\n\nGod designed us for community — "Iron sharpens iron" (Proverbs 27:17). The Circles feature in the Community tab was built for exactly this — small groups of women walking this journey together.\n\nIs there a specific kind of connection you're longing for? Someone to pray with, someone to be accountable to, or just someone who *gets* it?`;
    }

    if (isAbout('not working', "doesn't work", 'gave up', 'give up', 'quit', 'failed', 'failure')) {
      return `Please hear me clearly${name}: you have not failed. You're still here, still asking, still trying — and that matters more than any streak or number.\n\nLamentations 3:22-23 — "His mercies are new every morning." Every single morning is a fresh start. Not a do-over of failure — a *new beginning*.\n\nCan I ask — what specifically feels like it isn't working? I want to understand what you've tried so I can help you find a different path forward.`;
    }

    // ── Absolute last resort — but stays engaged ──
    const genericResponses = [
      `Tell me more about that${name}. I want to make sure I'm giving you a response that's actually helpful for *your* specific situation, not just generic advice. What's the full picture?`,
      `That's worth exploring deeper${name}. When you say that, what's the feeling underneath it — is it more physical, emotional, or spiritual? Sometimes the root of what we're dealing with tells us everything about the right response.`,
      `I appreciate you being open with me${name}. 🌿 Let me ask a clarifying question: on a scale of 1-10, how are you feeling about your wellness journey overall right now? That helps me understand where to focus.`,
    ];
    return genericResponses[Math.floor(turnCount % genericResponses.length)];
  };

  const send = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading || limitReached) return;
    setInput('');

    // Build history BEFORE adding new message
    const currentHistory = messages
      .filter(m => m.role !== 'typing')
      .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text }));

    setMessages(m => [...m, { role:'user', text: userText }]);
    setLoading(true);
    if (!isPremium) { setMsgCount(incrementSageMsgCount()); }

    const historyWithNew = [...currentHistory, { role:'user', content: userText }];

    try {
      const res = await fetch('/api/sage', {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          system: SAGE_SYSTEM + (user?.covenant ? `\n\nUser's Wellness Covenant: "${user.covenant}"` : ''),
          messages: historyWithNew.slice(-12),
        }),
      });
      if (!res.ok) throw new Error('api');
      const data = await res.json();
      const reply = data.content?.[0]?.text;
      if (!reply) throw new Error('empty');
      setMessages(m => [...m, { role:'assistant', text: reply }]);
    } catch {
      // Use conversational fallback with full history context
      const reply = getConversationalReply(userText, currentHistory);
      setMessages(m => [...m, { role:'assistant', text: reply }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 140px)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14, flexShrink:0 }}>
        <div>
          <div className="serif" style={{ fontSize:26, fontWeight:700 }}>Sage AI</div>
          <div style={{ fontSize:13, color:C.muted }}>Your faith-integrated wellness coach</div>
        </div>
        {!isPremium ? (
          <div style={{ textAlign:'right', flexShrink:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color: remaining <= 3 ? '#E57373' : C.primary }}>{remaining}/{FREE_SAGE_LIMIT}</div>
            <div style={{ fontSize:10, color:C.muted }}>msgs left today</div>
          </div>
        ) : (
          <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:`${C.accent}22`, borderRadius:99, padding:'4px 12px', fontSize:11, fontWeight:700, color:C.accent }}>✨ Unlimited</div>
        )}
      </div>

      <div className="scroll" style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:14, marginBottom:14, paddingRight:4 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', flexDirection: m.role==='user' ? 'row-reverse' : 'row' }}>
            {m.role === 'assistant' && <div style={{ width:32, height:32, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>🌿</div>}
            <div style={{ maxWidth:'78%', background: m.role==='user' ? C.primary : C.bg, color: m.role==='user' ? '#fff' : C.text, borderRadius: m.role==='user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding:'12px 15px', fontSize:14, lineHeight:1.65, boxShadow:shadow.card, whiteSpace:'pre-wrap', border: m.role==='assistant' ? `1px solid ${C.border}` : 'none' }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>🌿</div>
            <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:'18px 18px 18px 4px', padding:'14px 16px', display:'flex', gap:5 }}>
              {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:C.muted, animation:`bounce 1.2s ${i*0.2}s ease-in-out infinite` }}/>)}
            </div>
          </div>
        )}
        {limitReached && (
          <div style={{ background:`linear-gradient(135deg, ${C.primary}10, ${C.accent}10)`, border:`1.5px solid ${C.accent}50`, borderRadius:16, padding:22, textAlign:'center', margin:'8px 0' }}>
            <div style={{ fontSize:28, marginBottom:8 }}>🌿</div>
            <div style={{ fontWeight:700, color:C.text, marginBottom:6 }}>You've used your {FREE_SAGE_LIMIT} daily messages</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.65, marginBottom:16 }}>Upgrade to Premium for unlimited Sage conversations — every day, any time.</div>
            <Btn full style={{ background:C.accent, color:C.text, border:'none', marginBottom:8 }}>Upgrade to Premium ✨</Btn>
            <div style={{ fontSize:11, color:C.muted }}>Messages reset at midnight</div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {messages.length <= 1 && !limitReached && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:12, flexShrink:0 }}>
          {QUICK_PROMPTS.map(p => <div key={p} onClick={() => send(p)} style={{ padding:'7px 13px', borderRadius:99, border:`1.5px solid ${C.primary}`, background:`${C.primary}10`, color:C.primary, fontSize:12, fontWeight:500, cursor:'pointer', whiteSpace:'nowrap' }}>{p}</div>)}
        </div>
      )}

      {!limitReached && (
        <div style={{ display:'flex', gap:9, alignItems:'center', flexShrink:0 }}>
          <input className="ff-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()}
            placeholder={!isPremium && remaining <= 3 ? `${remaining} messages left today` : 'Ask Sage anything...'}
            style={{ flex:1, border:`1.5px solid ${!isPremium && remaining <= 3 ? '#FFCDD2' : C.border}`, borderRadius:99, padding:'12px 18px', fontSize:14, color:C.text, background:C.white }}/>
          <button onClick={() => send()} disabled={!input.trim() || loading} style={{ width:44, height:44, borderRadius:'50%', background:input.trim()&&!loading ? C.primary : C.border, border:'none', cursor:input.trim()&&!loading?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background .15s' }}>
            <Send size={16} color="#fff"/>
          </button>
        </div>
      )}
    </div>
  );
}
// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────

function Btn({ children, onClick, variant='primary', full, small, style={} }) {
  const base = { border:'none', cursor:'pointer', fontWeight:600, borderRadius:10, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, transition:'all 0.13s' };
  const sz = small ? { padding:'8px 16px', fontSize:13 } : { padding:'13px 22px', fontSize:14 };
  const v = {
    primary: { background:C.primary, color:C.white },
    secondary: { background:'transparent', border:`1.5px solid ${C.primary}`, color:C.primary },
    outline: { background:'transparent', border:`1.5px solid ${C.border}`, color:C.text },
    accent: { background:C.accent, color:C.text },
    ghost: { background:'transparent', color:C.muted, border:'none' },
  };
  return <button className="btn" onClick={onClick} style={{ ...base, ...sz, ...v[variant], ...(full?{width:'100%'}:{}), ...style }}>{children}</button>;
}

function Card({ children, style={}, onClick, hover=false, pad=22 }) {
  return <div className={hover ? 'card-hover' : ''} onClick={onClick} style={{ background:C.bg, borderRadius:14, boxShadow:shadow.card, padding:pad, ...style }}>{children}</div>;
}

function Input({ label, type='text', placeholder, value, onChange, style={}, right }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      {label && <label style={{ fontSize:13, fontWeight:600, color:C.text }}>{label}</label>}
      <div style={{ position:'relative' }}>
        <input className="ff-input" type={type} placeholder={placeholder} value={value} onChange={onChange}
          style={{ width:'100%', border:`1.5px solid ${C.border}`, borderRadius:9, padding:'11px 14px', fontSize:14, color:C.text, background:C.white, paddingRight:right?44:14, ...style }} />
        {right && <div style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)' }}>{right}</div>}
      </div>
    </div>
  );
}

function Bar({ val, max, color=C.success, h=8, style={} }) {
  return (
    <div style={{ background:'#E4EAE1', borderRadius:99, height:h, overflow:'hidden', ...style }}>
      <div style={{ height:'100%', width:`${Math.min(100,(val/max)*100)}%`, background:color, borderRadius:99, transition:'width 0.5s ease' }} />
    </div>
  );
}

function Pill({ children, active, onClick, style={} }) {
  return (
    <div className="pill-select" onClick={onClick} style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'8px 14px', borderRadius:99, border:`1.5px solid ${active?C.primary:C.border}`, background:active?C.primary:C.white, color:active?C.white:C.text, fontSize:13, fontWeight:500, ...style }}>
      {active && <Check size={11}/>}{children}
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fadeIn" onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(30,40,28,0.52)', zIndex:999, display:'flex', alignItems:'flex-end', justifyContent:'center', padding:'0' }}>
      <div className="pop" onClick={e=>e.stopPropagation()} style={{ background:C.bg, borderRadius:'20px 20px 0 0', padding:'24px 22px 32px', width:'100%', maxWidth:520, maxHeight:'88vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <span className="serif" style={{ fontSize:22, fontWeight:700, color:C.text }}>{title}</span>
          <button onClick={onClose} className="btn" style={{ background:C.bgAlt, border:'none', borderRadius:8, padding:'6px 8px', cursor:'pointer', color:C.muted }}><X size={18}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function BackBtn({ onClick }) {
  return <button onClick={onClick} className="btn" style={{ background:C.bgAlt, border:'none', borderRadius:10, padding:'8px 10px', cursor:'pointer', color:C.text, display:'flex', alignItems:'center' }}><ArrowLeft size={17}/></button>;
}

// ─── SPLASH ───────────────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{ minHeight:'100vh', background:C.bgAlt, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:18 }}>
      <div className="fadeUp" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
        <div style={{ width:88, height:88, background:C.primary, borderRadius:24, display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, boxShadow:`0 10px 36px rgba(90,123,79,0.35)` }}>🌿</div>
        <div>
          <div className="serif" style={{ fontSize:36, fontWeight:700, color:C.text, textAlign:'center', letterSpacing:'-0.3px' }}>Flourish & Faith</div>
          <div style={{ fontSize:15, color:C.muted, textAlign:'center', marginTop:6, fontStyle:'italic' }}>Flourishing body, faithful heart.</div>
        </div>
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const SLIDES = [
  { emoji:'🌸', headline:'Flourish in Faith.\nThrive in Wellness.', sub:'A grace-centered wellness journey built on biblical principles — for Christian women who want to flourish completely.', btn:'Get Started' },
  { emoji:'📖', headline:'Daily Devotionals', sub:'Start each day with Scripture and reflection designed for your wellness journey. Let God\'s Word lead the way.', btn:'Next' },
  { emoji:'🤝', headline:'Community & Accountability', sub:'Join small groups of women walking the same path. Real support. Real transformation. Real sisterhood.', btn:'Next' },
  { emoji:'💛', headline:'Grace-Centered Tracking', sub:'Log meals, track movement, celebrate progress — without shame or judgment. Progress over perfection, always.', btn:"Let's Begin" },
];

function OnboardingScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const s = SLIDES[step];
  const totalSteps = 4;
  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between', padding:'48px 24px 44px' }}>
      {/* Step progress */}
      <div style={{ width:'100%', maxWidth:400 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          {['Welcome','Wellness','Faith','Community'].map((label, i) => (
            <div key={label} style={{ textAlign:'center', flex:1 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:i<=step?C.primary:C.border, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 4px', transition:'background .3s' }}>
                {i < step
                  ? <Check size={12} color="#fff"/>
                  : <span style={{ fontSize:11, fontWeight:700, color:i<=step?'#fff':C.muted }}>{i+1}</span>}
              </div>
              <div style={{ fontSize:9, color:i<=step?C.primary:C.muted, fontWeight:600, textTransform:'uppercase', letterSpacing:'.04em' }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ height:3, background:C.border, borderRadius:99, marginBottom:0 }}>
          <div style={{ height:'100%', width:`${(step/3)*100}%`, background:C.primary, borderRadius:99, transition:'width .4s ease' }}/>
        </div>
      </div>
      <div key={step} className="fadeUp" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:22, textAlign:'center', maxWidth:380 }}>
        <div style={{ width:106, height:106, background:C.bgAlt, borderRadius:30, display:'flex', alignItems:'center', justifyContent:'center', fontSize:52, boxShadow:`0 4px 22px rgba(90,123,79,0.14)` }}>{s.emoji}</div>
        <div>
          <div className="serif" style={{ fontSize:32, fontWeight:700, color:C.text, lineHeight:1.2, whiteSpace:'pre-line', marginBottom:12 }}>{s.headline}</div>
          <div style={{ fontSize:15, color:C.muted, lineHeight:1.65 }}>{s.sub}</div>
        </div>
      </div>
      <div style={{ width:'100%', maxWidth:400, display:'flex', flexDirection:'column', gap:10 }}>
        <Btn full onClick={()=>step<3?setStep(step+1):onDone()}>{s.btn}</Btn>
        {step===0 && <Btn full variant="ghost" onClick={onDone} style={{ fontSize:13 }}>Already have an account? Sign in</Btn>}
      </div>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthScreen({ onDone }) {
  const [tab, setTab] = useState('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const validate = () => {
    const errs = {};
    if (tab === 'signup' && !name.trim()) errs.name = 'Please enter your name';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!isValidEmail(email)) errs.email = 'Please enter a valid email address';
    if (!password) errs.password = 'Password is required';
    else if (tab === 'signup' && password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (tab === 'signup' && !agreed) errs.agreed = 'Please agree to the Terms & Privacy Policy';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setAuthError('');
    try {
      await onDone({ name: name.trim() || 'Friend', email: email.trim().toLowerCase(), password, isLogin: tab === 'login' });
    } catch (e) {
      setAuthError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (forgotMode) return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', padding:'44px 24px 32px' }}>
      <div style={{ marginBottom:28, textAlign:'center' }}>
        <div style={{ fontSize:32, marginBottom:8 }}>🔑</div>
        <div className="serif" style={{ fontSize:26, fontWeight:700, color:C.text }}>Reset Password</div>
      </div>
      <div style={{ width:'100%', maxWidth:420 }}>
        {forgotSent ? (
          <div style={{ background:`${C.success}16`, border:`1px solid ${C.success}40`, borderRadius:14, padding:22, textAlign:'center' }}>
            <div style={{ fontSize:28, marginBottom:10 }}>📧</div>
            <div style={{ fontWeight:600, color:C.text, marginBottom:6 }}>Check your inbox</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.65, marginBottom:16 }}>
              If an account exists for <strong>{forgotEmail}</strong>, we've sent a password reset link.
            </div>
            <Btn full onClick={()=>{ setForgotMode(false); setForgotSent(false); setTab('login'); }}>
              Back to Sign In
            </Btn>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ fontSize:14, color:C.muted, lineHeight:1.65, marginBottom:4 }}>
              Enter the email address associated with your account and we'll send you a reset link.
            </div>
            <Input label="Email Address" type="email" placeholder="you@example.com" value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)}/>
            <Btn full onClick={async ()=>{
              if (isValidEmail(forgotEmail)) {
                if (supabase) await supabase.auth.resetPasswordForEmail(forgotEmail);
                setForgotSent(true);
              }
            }} style={{ opacity: isValidEmail(forgotEmail)?1:0.6 }}>
              Send Reset Link
            </Btn>
            <Btn full variant="ghost" onClick={()=>setForgotMode(false)}>← Back to Sign In</Btn>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', padding:'44px 24px 32px' }}>
      <div style={{ marginBottom:28, textAlign:'center' }}>
        <div style={{ fontSize:32, marginBottom:8 }}>🌿</div>
        <div className="serif" style={{ fontSize:28, fontWeight:700, color:C.text }}>Welcome to Flourish & Faith</div>
      </div>
      <div style={{ display:'flex', background:C.bgAlt, borderRadius:12, padding:4, marginBottom:26, width:'100%', maxWidth:420 }}>
        {['signup','login'].map(t=>(
          <div key={t} onClick={()=>{ setTab(t); setErrors({}); }} className="tab-item"
            style={{ flex:1, textAlign:'center', padding:'9px 0', borderRadius:9, background:tab===t?C.white:'transparent', fontWeight:600, fontSize:14, color:tab===t?C.text:C.muted, boxShadow:tab===t?'0 1px 6px rgba(0,0,0,0.09)':'none' }}>
            {t==='signup'?'Sign Up':'Sign In'}
          </div>
        ))}
      </div>
      <div className="fadeIn" key={tab} style={{ width:'100%', maxWidth:420, display:'flex', flexDirection:'column', gap:14 }}>
        {tab==='signup' && (
          <div>
            <Input label="First Name" placeholder="Your name" value={name} onChange={e=>{ setName(e.target.value); setErrors(p=>({...p,name:''})); }}/>
            {errors.name && <div style={{ fontSize:12, color:'#E57373', marginTop:4 }}>⚠ {errors.name}</div>}
          </div>
        )}
        <div>
          <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e=>{ setEmail(e.target.value); setErrors(p=>({...p,email:''})); }}/>
          {errors.email && <div style={{ fontSize:12, color:'#E57373', marginTop:4 }}>⚠ {errors.email}</div>}
        </div>
        <div>
          <Input label="Password" type={showPw?'text':'password'} placeholder={tab==='signup'?'Min. 8 characters':'Your password'} value={password} onChange={e=>{ setPassword(e.target.value); setErrors(p=>({...p,password:''})); }}
            right={<button onClick={()=>setShowPw(!showPw)} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, padding:0, display:'flex' }}>{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button>}/>
          {errors.password && <div style={{ fontSize:12, color:'#E57373', marginTop:4 }}>⚠ {errors.password}</div>}
        </div>
        {tab==='signup' && (
          <div>
            <label style={{ display:'flex', gap:10, alignItems:'flex-start', cursor:'pointer' }}>
              <input type="checkbox" checked={agreed} onChange={e=>{ setAgreed(e.target.checked); setErrors(p=>({...p,agreed:''})); }} style={{ marginTop:3, accentColor:C.primary, width:16, height:16 }} />
              <span style={{ fontSize:13, color:C.muted, lineHeight:1.5 }}>I agree to the <span style={{ color:C.primary }}>Terms of Service</span> and <span style={{ color:C.primary }}>Privacy Policy</span></span>
            </label>
            {errors.agreed && <div style={{ fontSize:12, color:'#E57373', marginTop:4 }}>⚠ {errors.agreed}</div>}
          </div>
        )}
        {authError && (
          <div style={{ background:'#FFEBEE', border:'1px solid #FFCDD2', borderRadius:10, padding:'10px 14px', fontSize:13, color:'#C62828' }}>
            ⚠ {authError}
          </div>
        )}
        <Btn full onClick={handleSubmit} style={{ marginTop:4, opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Please wait…' : (tab==='signup' ? 'Create Account' : 'Sign In')}
        </Btn>
        {tab==='login' && (
          <button onClick={()=>{ setForgotMode(true); setForgotEmail(email); }}
            style={{ background:'none', border:'none', cursor:'pointer', color:C.primary, fontSize:13, fontWeight:500, padding:'2px 0' }}>
            Forgot your password?
          </button>
        )}
        <div style={{ display:'flex', alignItems:'center', gap:10, color:C.muted, fontSize:12 }}>
          <div style={{ flex:1, height:1, background:C.border }}/>OR<div style={{ flex:1, height:1, background:C.border }}/>
        </div>
        <button className="btn" style={{ width:'100%', padding:'12px 22px', border:`1.5px solid ${C.border}`, borderRadius:10, background:C.white, display:'flex', alignItems:'center', justifyContent:'center', gap:10, fontSize:14, fontWeight:600, color:C.text, cursor:'pointer' }}>
          <span style={{ fontSize:15 }}>G</span> Continue with Google
        </button>
      </div>
    </div>
  );
}

function GoalSettingScreen({ onNext }) {
  const GOAL_OPTS = [
    'Lose weight gracefully',
    'Eat healthier, whole foods',
    'Build a consistent movement habit',
    'Drink more water daily',
    'Deepen my faith through wellness',
    'Reduce stress and anxiety',
    'Sleep better and rest more',
    'Build accountability with other women',
    'Feel more energized and confident',
    'Honor God with how I care for my body',
  ];
  const [sel, setSel] = useState([]);
  const handleNext = () => {
    if (sel.length > 0) {
      try {
        localStorage.setItem('ff_goals', JSON.stringify(sel));
      } catch(e) {}
    }
    onNext();
  };
  return (
    <div style={{ minHeight:'100vh', background:C.bg, padding:'40px 22px', display:'flex', flexDirection:'column' }}>
      <Bar val={1} max={4} style={{ marginBottom:28 }} />
      <div className="serif" style={{ fontSize:30, fontWeight:700, color:C.text, marginBottom:6 }}>What brings you here today?</div>
      <div style={{ fontSize:14, color:C.muted, marginBottom:22 }}>Select all that apply.</div>
      <div style={{ display:'flex', flexDirection:'column', gap:9, flex:1 }}>
        {GOAL_OPTS.map(g=>{
          const on = sel.includes(g);
          return (
            <div key={g} onClick={()=>setSel(s=>on?s.filter(x=>x!==g):[...s,g])} className="btn" style={{ padding:'14px 18px', borderRadius:12, border:`1.5px solid ${on?C.primary:C.border}`, background:on?`${C.primary}10`:C.white, display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}>
              <span style={{ fontSize:15, fontWeight:500, color:C.text }}>{g}</span>
              {on && <div style={{ width:22, height:22, borderRadius:99, background:C.primary, display:'flex', alignItems:'center', justifyContent:'center' }}><Check size={12} color={C.white}/></div>}
            </div>
          );
        })}
      </div>
      <Btn full onClick={handleNext} style={{ marginTop:24 }}>Next <ChevronRight size={15}/></Btn>
    </div>
  );
}

// ─── PERSONALIZATION ──────────────────────────────────────────────────────────
function PersonalizationScreen({ onNext }) {
  const [unit, setUnit] = useState('lbs');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [activity, setActivity] = useState('');
  const [diet, setDiet] = useState([]);
  return (
    <div style={{ minHeight:'100vh', background:C.bg, padding:'40px 22px', display:'flex', flexDirection:'column', gap:18 }}>
      <Bar val={2} max={4} />
      <div>
        <div className="serif" style={{ fontSize:28, fontWeight:700, color:C.text, marginBottom:4 }}>Let's personalize your experience.</div>
        <div style={{ fontSize:14, color:C.muted }}>All fields are optional — take what serves you.</div>
      </div>
      <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
        <div style={{ flex:1 }}><Input label="Starting Weight (optional)" placeholder="e.g. 165" value={weight} onChange={e=>setWeight(e.target.value)} /></div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:13, fontWeight:600, color:C.text }}>Unit</label>
          <div style={{ display:'flex', borderRadius:9, overflow:'hidden', border:`1.5px solid ${C.border}` }}>
            {['lbs','kg'].map(u=><div key={u} onClick={()=>setUnit(u)} style={{ padding:'11px 14px', fontSize:13, fontWeight:600, cursor:'pointer', background:unit===u?C.primary:C.white, color:unit===u?C.white:C.text, transition:'all 0.15s' }}>{u}</div>)}
          </div>
        </div>
      </div>
      <div style={{ fontSize:12, color:C.muted, marginTop:-10, fontStyle:'italic' }}>You can skip this. You are more than a number. 💛</div>
      <Input label="Goal Weight (optional)" placeholder="e.g. 145" value={goal} onChange={e=>setGoal(e.target.value)} />
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        <label style={{ fontSize:13, fontWeight:600, color:C.text }}>Activity Level</label>
        <select value={activity} onChange={e=>setActivity(e.target.value)} style={{ border:`1.5px solid ${C.border}`, borderRadius:9, padding:'11px 14px', fontSize:14, color:activity?C.text:C.muted, background:C.white }}>
          <option value="">Select activity level</option>
          {['Sedentary','Lightly Active','Moderately Active','Very Active'].map(a=><option key={a}>{a}</option>)}
        </select>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
        <label style={{ fontSize:13, fontWeight:600, color:C.text }}>Dietary Preferences</label>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {['None','Vegetarian','Vegan','Gluten-Free','Dairy-Free'].map(d=>(
            <Pill key={d} active={diet.includes(d)} onClick={()=>setDiet(s=>s.includes(d)?s.filter(x=>x!==d):[...s,d])}>{d}</Pill>
          ))}
        </div>
      </div>
      <Btn full onClick={()=>{
        // Save personalization data
        try {
          const existing = JSON.parse(localStorage.getItem('ff_settings') || '{}');
          const updates = { weightUnit: unit };
          if (goal && !isNaN(parseFloat(goal))) updates.goalWeight = parseFloat(goal);
          if (weight && !isNaN(parseFloat(weight))) updates.startingWeight = parseFloat(weight);
          localStorage.setItem('ff_settings', JSON.stringify({ ...existing, ...updates }));
        } catch(e) {}
        onNext();
      }}>Next <ChevronRight size={15}/></Btn>
    </div>
  );
}

// ─── COVENANT ─────────────────────────────────────────────────────────────────
const COVENANTS = [
  'I commit to stewarding my health with grace and discipline.',
  'I promise to show myself the same compassion God shows me.',
  'I will nourish my body, move with intention, and rest when needed.',
];
function CovenantScreen({ onNext, setUserCovenant }) {
  const [text, setText] = useState('');
  return (
    <div style={{ minHeight:'100vh', background:C.bg, padding:'40px 22px', display:'flex', flexDirection:'column', gap:18 }}>
      <Bar val={3} max={4} />
      <div>
        <div className="serif" style={{ fontSize:28, fontWeight:700, color:C.text, marginBottom:8 }}>Your Wellness Covenant</div>
        <div style={{ fontSize:14, color:C.muted, lineHeight:1.65 }}>Set a personal commitment between you and God. This is your <em>why</em> — your sacred promise to honor the temple He gave you.</div>
      </div>
      <textarea value={text} onChange={e=>setText(e.target.value)} maxLength={500} rows={5} placeholder="I commit to honoring my body by..."
        style={{ border:`1.5px solid ${C.border}`, borderRadius:11, padding:'13px 15px', fontSize:14, color:C.text, resize:'none', lineHeight:1.65, background:C.white }} />
      <div style={{ fontSize:12, color:C.muted, textAlign:'right', marginTop:-10 }}>{text.length}/500</div>
      <div>
        <div style={{ fontSize:13, fontWeight:600, color:C.muted, marginBottom:10 }}>✨ Need inspiration? Tap a prompt:</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {COVENANTS.map(p=>(
            <div key={p} onClick={()=>setText(p)} className="btn" style={{ padding:'12px 14px', background:C.bgAlt, borderRadius:10, fontSize:13, color:C.text, cursor:'pointer', border:`1px solid ${C.border}`, fontStyle:'italic', lineHeight:1.5 }}>"{p}"</div>
          ))}
        </div>
      </div>
      <Btn full onClick={()=>{ setUserCovenant(text||COVENANTS[0]); onNext(); }} style={{ marginTop:'auto' }}>Set My Covenant ✨</Btn>
    </div>
  );
}

// ─── SUBSCRIPTION ─────────────────────────────────────────────────────────────
function SubscriptionScreen({ onDone }) {
  const [plan, setPlan] = useState('premium');
  return (
    <div style={{ minHeight:'100vh', background:C.bg, padding:'40px 22px', display:'flex', flexDirection:'column', gap:18 }}>
      <Bar val={4} max={4} />
      <div className="serif" style={{ fontSize:28, fontWeight:700, color:C.text }}>Choose Your Plan</div>
      {/* Free */}
      <Card style={{ border:`2px solid ${plan==='free'?C.primary:C.border}`, cursor:'pointer' }} onClick={()=>setPlan('free')}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
          <div className="serif" style={{ fontSize:22, fontWeight:700 }}>Free</div>
          <div style={{ fontSize:22, fontWeight:700, color:C.primary }}>$0</div>
        </div>
        {['Daily devotionals','Basic tracking (weight, water)','Community feed','Progress dashboard'].map(f=>(
          <div key={f} style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}><CheckCircle size={14} color={C.success}/><span style={{ fontSize:13 }}>{f}</span></div>
        ))}
        {plan==='free' && <Btn full onClick={()=>onDone('free')} style={{ marginTop:14 }}>Start Free</Btn>}
      </Card>
      {/* Premium */}
      <Card style={{ border:`2px solid ${plan==='premium'?C.accent:'transparent'}`, cursor:'pointer', position:'relative', overflow:'hidden' }} onClick={()=>setPlan('premium')}>
        <div style={{ position:'absolute', top:0, right:0, background:C.accent, color:C.text, fontSize:10, fontWeight:700, padding:'5px 14px', borderBottomLeftRadius:10 }}>MOST POPULAR</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
          <div className="serif" style={{ fontSize:22, fontWeight:700 }}>Premium</div>
          <div><span style={{ fontSize:24, fontWeight:700, color:C.primary }}>$9.99</span><span style={{ fontSize:12, color:C.muted }}>/mo</span></div>
        </div>
        <div style={{ display:'inline-flex', background:C.alert, borderRadius:99, padding:'4px 12px', fontSize:12, fontWeight:600, marginBottom:14 }}>7-Day Free Trial</div>
        {['Everything in Free','Full macro tracking','Meal planner & recipes','Accountability circles','Guided programs','Progress insights'].map(f=>(
          <div key={f} style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}><CheckCircle size={14} color={C.accent}/><span style={{ fontSize:13 }}>{f}</span></div>
        ))}
        {plan==='premium' && <Btn full accent onClick={()=>onDone('premium')} style={{ marginTop:14, background:C.primary, color:C.white }}>Start Free Trial ✨</Btn>}
      </Card>
      <div onClick={()=>onDone('free')} style={{ textAlign:'center', fontSize:13, color:C.muted, cursor:'pointer', textDecoration:'underline' }}>I'll decide later</div>
    </div>
  );
}

// ─── DEVOTIONAL MODAL ─────────────────────────────────────────────────────────
function DevotionalModal({ dev, onClose, onComplete, alreadyDone }) {
  const todayKey = getTodayKey();
  const savedJournal = (() => {
    try { return JSON.parse(localStorage.getItem('ff_journals') || '{}')[todayKey] || ''; } catch { return ''; }
  })();
  const [journal, setJournal] = useState(savedJournal);
  const [journalSaved, setJournalSaved] = useState(!!savedJournal);
  const [done, setDone] = useState(alreadyDone || false);

  const saveJournal = () => {
    if (!journal.trim()) return;
    try {
      const all = JSON.parse(localStorage.getItem('ff_journals') || '{}');
      all[todayKey] = journal;
      // Keep last 90 days only
      const keys = Object.keys(all).sort().reverse().slice(0, 90);
      const trimmed = {};
      keys.forEach(k => { trimmed[k] = all[k]; });
      localStorage.setItem('ff_journals', JSON.stringify(trimmed));
    } catch(e) {}
    setJournalSaved(true);
  };

  if (!dev) return null;
  return (
    <div className="fadeIn" style={{ position:'fixed', inset:0, background:'rgba(30,40,28,0.54)', zIndex:500, overflowY:'auto' }}>
      <div className="fadeUp" style={{ background:C.bg, minHeight:'100vh', padding:'26px 22px 40px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
          <BackBtn onClick={onClose} />
          <div>
            <div style={{ fontSize:12, color:C.muted, fontWeight:500 }}>Today's Devotional · {dev.date || todayKey}</div>
            <div className="serif" style={{ fontSize:20, fontWeight:700, color:C.text }}>{dev.theme}</div>
          </div>
        </div>
        {/* Scripture */}
        <div style={{ background:`linear-gradient(135deg, ${C.primary}14, ${C.accent}10)`, border:`1px solid ${C.primary}28`, borderRadius:14, padding:20, marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.primary, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>📖 {dev.ref}</div>
          <div className="serif" style={{ fontSize:18, fontStyle:'italic', color:C.text, lineHeight:1.75 }}>{dev.scripture}</div>
        </div>
        {/* Reflection */}
        <div style={{ marginBottom:22 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>Reflection</div>
          {dev.reflection.split('\n\n').map((p,i)=><p key={i} style={{ fontSize:15, color:C.text, lineHeight:1.78, marginBottom:14 }}>{p}</p>)}
        </div>
        {/* Journal */}
        <Card style={{ background:C.bgAlt, boxShadow:'none', marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.primary, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>✍️ Journal Prompt</div>
          <div style={{ fontSize:14, color:C.text, fontStyle:'italic', marginBottom:12, lineHeight:1.6 }}>{dev.prompt}</div>
          <textarea value={journal} onChange={e=>{ setJournal(e.target.value); setJournalSaved(false); }} rows={4} placeholder="Write your thoughts here..."
            style={{ width:'100%', border:`1.5px solid ${journalSaved?C.success:C.border}`, borderRadius:9, padding:'11px 13px', fontSize:13, color:C.text, resize:'none', lineHeight:1.6, background:C.white, transition:'border-color .2s' }} />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 }}>
            <div style={{ fontSize:12, color:journalSaved?C.success:C.muted }}>
              {journalSaved ? '✓ Saved' : journal.trim() ? 'Unsaved changes' : ''}
            </div>
            <Btn small onClick={saveJournal} disabled={!journal.trim() || journalSaved}
              style={{ background:journalSaved?C.success:C.primary, color:'#fff', border:'none', opacity:!journal.trim()?0.5:1 }}>
              {journalSaved ? '✓ Saved' : 'Save Journal'}
            </Btn>
          </div>
        </Card>
        {!done
          ? <Btn full onClick={()=>{ saveJournal(); setDone(true); if(onComplete) onComplete(); }}><CheckCircle size={15}/> Mark as Complete</Btn>
          : <div style={{ textAlign:'center', padding:18, background:`${C.success}16`, borderRadius:13, border:`1px solid ${C.success}40` }}>
              <div style={{ fontSize:26, marginBottom:6 }}>🎉</div>
              <div style={{ fontWeight:700, color:C.primary, marginBottom:4 }}>Way to start the day with intention!</div>
              <div style={{ fontSize:13, color:C.muted }}>Keep walking faithfully 🌿</div>
            </div>
        }
      </div>
    </div>
  );
}

// ─── HOME TAB ─────────────────────────────────────────────────────────────────
function MiniBar({ vals, color, height=28 }) {
  const max = Math.max(...vals, 1);
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:3, height }}>
      {vals.map((v,i) => (
        <div key={i} style={{ flex:1, height:`${Math.max(15, (v/max)*100)}%`, background: i === vals.length-1 ? color : `${color}60`, borderRadius:'3px 3px 0 0', transition:'height .4s' }}/>
      ))}
    </div>
  );
}

function HomeTab({ user, onNavigate, foodItems, waterCups, weightEntries, moveItems, posts, devCompletedToday, onComplete, appSettings }) {
  const [devOpen, setDevOpen] = useState(false);
  const dev = getTodayDevotional();
  const today = new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
  const { calorieGoal=1800, waterGoal=8 } = appSettings || {};
  const totalCal = foodItems.reduce((s,i) => s+i.cal, 0);
  const calPct = Math.min(Math.round((totalCal / calorieGoal) * 100), 100);
  const waterPct = Math.min(Math.round((waterCups / waterGoal) * 100), 100);
  const latestWeight = weightEntries.length > 0 ? weightEntries[0].w : null;
  const latestPost = posts && posts.length > 0 ? posts[0] : null;

  const calBars   = [0,0,0,0,0,0, totalCal];
  const weightBars = weightEntries.slice(0,7).reverse().map(e=>e.w);
  if (weightBars.length === 0) for(let i=0;i<7;i++) weightBars.push(0);

  // Brand palette for metric cards — all greens and golds
  const cardStyles = {
    calories: { bg:'linear-gradient(145deg,#EEF5EB,#E0EDDA)', icon:C.primary,  pct:{ color:C.primary,  bg:'rgba(90,123,79,.12)' } },
    water:    { bg:'linear-gradient(145deg,#F5F1E8,#EDE6D6)', icon:'#8B6914',   pct:{ color:'#8B6914',   bg:'rgba(139,105,20,.1)' } },
    weight:   { bg:'linear-gradient(145deg,#EAF0E7,#D8E9D2)', icon:'#3D6B33',   pct:{ color:'#3D6B33',   bg:'rgba(61,107,51,.1)'  } },
    movement: { bg:'linear-gradient(145deg,#F9F5EC,#F2EAD9)', icon:C.accent,    pct:{ color:'#9A7820',   bg:'rgba(154,120,32,.1)' } },
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

      {/* ── GREETING ── */}
      {(() => {
        const streak = calculateStreak();
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
        return (
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:13, color:C.muted }}>{today}</div>
              <div className="serif" style={{ fontSize:26, fontWeight:800, color:C.text, lineHeight:1.15 }}>
                Good {greeting}, {(user?.name||'').split(' ')[0] || user?.email?.split('@')[0] || 'there'} 🌿
              </div>
            </div>
            {streak > 0 && (
              <div style={{ background:`${C.accent}22`, border:`1px solid ${C.accent}40`, borderRadius:12, padding:'6px 12px', textAlign:'center', cursor:'pointer' }} onClick={()=>{}}>
                <div style={{ fontSize:16 }}>🔥</div>
                <div style={{ fontSize:12, fontWeight:800, color:'#8B6914' }}>{streak}</div>
                <div style={{ fontSize:9, color:'#8B6914', fontWeight:600 }}>day{streak!==1?'s':''}</div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── DEVOTIONAL — TOP OF PAGE ── */}
      <div onClick={()=>setDevOpen(true)}
        style={{ background:`linear-gradient(135deg, ${C.primary} 0%, #2D5A24 100%)`, borderRadius:20, padding:'22px 24px', color:C.white, cursor:'pointer', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,.05)' }}/>
        <div style={{ position:'absolute', bottom:-20, left:20, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,.04)' }}/>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10, position:'relative' }}>
          <div style={{ fontSize:11, fontWeight:600, opacity:.7, textTransform:'uppercase', letterSpacing:'.08em' }}>📖 Today's Devotional</div>
          {devCompletedToday
            ? <div style={{ background:C.accent, color:'#4A3800', fontSize:10, fontWeight:800, borderRadius:99, padding:'4px 12px' }}>✓ Completed</div>
            : <div style={{ background:'rgba(255,255,255,.18)', color:'rgba(255,255,255,.9)', fontSize:10, fontWeight:600, borderRadius:99, padding:'4px 12px' }}>Tap to read →</div>
          }
        </div>
        <div className="serif" style={{ fontSize:22, fontWeight:800, lineHeight:1.25, marginBottom:6, position:'relative' }}>{dev.theme}</div>
        <div style={{ fontSize:13, opacity:.75, fontStyle:'italic', lineHeight:1.55, position:'relative' }}>{dev.ref} — "{dev.scripture.slice(1,75)}..."</div>
      </div>

      {/* ── 4 METRIC CARDS — brand colors ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }} className="metrics-grid">

        {/* Calories */}
        <div onClick={()=>onNavigate('track','food')} style={{ background:cardStyles.calories.bg, borderRadius:18, padding:16, cursor:'pointer', minWidth:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:cardStyles.calories.icon, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3C8.93 6.86 9.78 4.95 12 3c.5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
            </div>
            <div style={{ fontSize:10, fontWeight:700, color:cardStyles.calories.pct.color, background:cardStyles.calories.pct.bg, borderRadius:99, padding:'2px 8px', flexShrink:0 }}>{calPct}%</div>
          </div>
          <div style={{ fontSize:11, fontWeight:500, color:C.muted, marginBottom:2 }}>Calories</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:3, marginBottom:8, flexWrap:'wrap' }}>
            <span style={{ fontSize:24, fontWeight:800, color:C.text, lineHeight:1 }}>{totalCal.toLocaleString()}</span>
            <span style={{ fontSize:11, color:C.muted }}>/ {calorieGoal.toLocaleString()}</span>
          </div>
          <MiniBar vals={calBars} color={C.primary}/>
        </div>

        {/* Water */}
        <div onClick={()=>onNavigate('track','water')} style={{ background:cardStyles.water.bg, borderRadius:18, padding:16, cursor:'pointer', minWidth:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:cardStyles.water.icon, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round"><path d="M12 2C6 10 4 14 4 16a8 8 0 0 0 16 0c0-2-2-6-8-14z"/></svg>
            </div>
            <div style={{ fontSize:10, fontWeight:700, color:cardStyles.water.pct.color, background:cardStyles.water.pct.bg, borderRadius:99, padding:'2px 8px', flexShrink:0 }}>{waterPct}%</div>
          </div>
          <div style={{ fontSize:11, fontWeight:500, color:C.muted, marginBottom:2 }}>Hydration</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:3, marginBottom:8 }}>
            <span style={{ fontSize:24, fontWeight:800, color:C.text, lineHeight:1 }}>{waterCups}</span>
            <span style={{ fontSize:11, color:C.muted }}>/ {waterGoal} cups</span>
          </div>
          <div style={{ background:'rgba(139,105,20,.15)', borderRadius:8, overflow:'hidden', height:8 }}>
            <div style={{ height:'100%', width:`${waterPct}%`, background:cardStyles.water.icon, borderRadius:8, transition:'width .5s' }}/>
          </div>
          <div style={{ fontSize:10, color:C.muted, marginTop:5, fontWeight:500 }}>
            {waterCups >= waterGoal ? '🎉 Goal reached!' : `${waterGoal - waterCups} more cups to go`}
          </div>
        </div>

        {/* Weight */}
        <div onClick={()=>onNavigate('track','weight')} style={{ background:cardStyles.weight.bg, borderRadius:18, padding:16, cursor:'pointer', minWidth:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:cardStyles.weight.icon, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round"><path d="M3 3h18l-2 9H5L3 3z"/><circle cx="9" cy="20" r="1"/><circle cx="16" cy="20" r="1"/></svg>
            </div>
          </div>
          <div style={{ fontSize:11, fontWeight:500, color:C.muted, marginBottom:2 }}>Weight</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:3, marginBottom:8 }}>
            <span style={{ fontSize:24, fontWeight:800, color:C.text, lineHeight:1 }}>{latestWeight||'—'}</span>
            <span style={{ fontSize:11, color:C.muted }}>{latestWeight ? 'lbs' : 'tap to log'}</span>
          </div>
          <MiniBar vals={weightBars.length>1?weightBars:[0,0,0,0,0,0,0]} color={cardStyles.weight.icon}/>
        </div>

        {/* Movement */}
        <div onClick={()=>onNavigate('track','movement')} style={{ background:cardStyles.movement.bg, borderRadius:18, padding:16, cursor:'pointer', minWidth:0 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:cardStyles.movement.icon, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
          </div>
          <div style={{ fontSize:11, fontWeight:500, color:C.muted, marginBottom:2 }}>Movement</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:3, marginBottom:8 }}>
            <span style={{ fontSize:24, fontWeight:800, color:C.text, lineHeight:1 }}>{moveItems.length}</span>
            <span style={{ fontSize:11, color:C.muted }}>sessions</span>
          </div>
          <div style={{ display:'flex', gap:4 }}>
            {[0,1,2,3,4].map(i=>(
              <div key={i} style={{ height:8, flex:1, borderRadius:4, background:i<moveItems.length?C.accent:'rgba(201,169,97,.2)', transition:'background .3s' }}/>
            ))}
          </div>
        </div>
      </div>

      {/* ── DESKTOP 2-COL: Meal Plan + Community ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="main-grid">

        {/* Meal Plan */}
        <div style={{ background:C.bg, borderRadius:20, padding:18, boxShadow:shadow.card, border:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ fontWeight:700, fontSize:15, color:C.text }}>Today's Meal Plan</div>
            <div onClick={()=>onNavigate('track','meals')} style={{ fontSize:12, color:C.primary, fontWeight:600, cursor:'pointer' }}>View All →</div>
          </div>
          {user?.plan==='premium' ? (() => {
            const d = new Date().getDay(); // 0=Sun
            const todayIdx = d === 0 ? 6 : d - 1; // maps to MEAL_PLANS[0..6]
            const todayPlan = MEAL_PLANS[todayIdx];
            const mealColors = { breakfast:{bg:`${C.primary}10`,dot:C.primary}, lunch:{bg:`${C.accent}15`,dot:C.accent}, snack:{bg:`${C.primary}06`,dot:'#6B9A5E'}, dinner:{bg:`${C.primary}08`,dot:'#3D6B33'} };
            return (
              <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                {['breakfast','lunch','dinner'].map(mealType => {
                  const m = todayPlan?.meals?.[mealType];
                  if (!m) return null;
                  const mc = mealColors[mealType] || mealColors.dinner;
                  return (
                    <div key={mealType} style={{ display:'flex', alignItems:'center', gap:11, background:mc.bg, borderRadius:13, padding:'10px 13px' }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:mc.dot, flexShrink:0 }}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:10, fontWeight:700, color:C.muted }}>{mealType.charAt(0).toUpperCase()+mealType.slice(1)} · {m.time}</div>
                        <div style={{ fontSize:13, fontWeight:600, color:C.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.name}</div>
                      </div>
                      <div style={{ fontSize:13, fontWeight:800, color:C.text, flexShrink:0 }}>{m.cal}<span style={{ fontSize:10, fontWeight:400, color:C.muted }}> kcal</span></div>
                    </div>
                  );
                })}
              </div>
            );
          })() : (
            <div style={{ textAlign:'center', padding:'18px 0', background:C.bgAlt, borderRadius:14 }}>
              <div style={{ fontSize:22, marginBottom:6 }}>🥗</div>
              <div style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:4 }}>Personalized Meal Plans</div>
              <div style={{ fontSize:12, color:C.muted, marginBottom:12 }}>Upgrade to Premium for daily meal plans with full recipes</div>
              <Btn small style={{ background:C.accent, color:C.text, border:'none' }} onClick={()=>onNavigate('profile')}>Upgrade ✨</Btn>
            </div>
          )}
        </div>

        {/* Community */}
        <div style={{ background:C.bg, borderRadius:20, padding:18, boxShadow:shadow.card, border:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <div style={{ fontWeight:700, fontSize:15, color:C.text }}>Community</div>
            <div onClick={()=>onNavigate('community')} style={{ fontSize:12, color:C.primary, fontWeight:600, cursor:'pointer' }}>See All →</div>
          </div>
          {latestPost ? (
            <div style={{ display:'flex', gap:12, background:C.bgAlt, borderRadius:14, padding:'12px 13px' }}>
              <div style={{ width:38, height:38, borderRadius:'50%', background:latestPost.avatarColor||C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, color:'#fff', flexShrink:0, overflow:'hidden' }}>
                {latestPost.isCurrentUser&&user?.avatarPhoto
                  ?<img src={user.avatarPhoto} alt={latestPost.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                  :(latestPost.initial||(latestPost.name||'?').charAt(0))}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontWeight:600, fontSize:13, color:C.text }}>{latestPost.name}</span>
                  <span style={{ fontSize:11, color:C.muted }}>{formatRelativeTime(latestPost.id)}</span>
                </div>
                <div style={{ fontSize:13, color:C.muted, lineHeight:1.5, marginTop:3, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                  {latestPost.text}
                </div>
                <div style={{ display:'flex', gap:10, marginTop:6 }}>
                  <span style={{ fontSize:11, color:C.muted }}>❤️ {latestPost.likes}</span>
                  <span style={{ fontSize:11, color:C.muted }}>🙏 {latestPost.praying}</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <div style={{ fontSize:28, marginBottom:8 }}>🌿</div>
              <div style={{ fontSize:13, color:C.muted, marginBottom:10 }}>No posts yet — be the first to share!</div>
              <Btn small onClick={()=>onNavigate('community')}><Plus size={12}/> Share Something</Btn>
            </div>
          )}
        </div>
      </div>

      {/* ── PROGRAMS FOR YOU ── */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <div style={{ fontWeight:700, fontSize:15, color:C.text }}>Programs for You</div>
          <div onClick={()=>onNavigate('track','programs')} style={{ fontSize:12, color:C.primary, fontWeight:600, cursor:'pointer' }}>See All →</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }} className="programs-grid">
          {[
            { title:'7-Day Temple Reset',        emoji:'🌿', tag:'Beginners',    tagBg:`${C.primary}15`, tagColor:C.primary, bg:`linear-gradient(145deg,${C.bgAlt},#E8F0E4)`, desc:'Reconnect body & spirit in one week' },
            { title:'Strength & Scripture',       emoji:'💪', tag:'Intermediate', tagBg:`${C.accent}20`,  tagColor:'#8B6914',  bg:`linear-gradient(145deg,#F9F5EC,#F0E9D5)`,   desc:'Build physical & spiritual strength' },
            { title:'Morning Devotional Workout', emoji:'☀️', tag:'Daily',        tagBg:`${C.primary}12`, tagColor:'#3D6B33',  bg:`linear-gradient(145deg,#EFF5EC,#E2EED9)`,   desc:'Start every morning with intention'  },
          ].map(prog=>(
            <div key={prog.title} onClick={()=>onNavigate('track','programs')}
              style={{ borderRadius:18, padding:18, background:prog.bg, cursor:'pointer', position:'relative', overflow:'hidden', minHeight:140, border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:30, marginBottom:10 }}>{prog.emoji}</div>
              <div style={{ display:'inline-flex', background:prog.tagBg, borderRadius:99, padding:'3px 10px', marginBottom:8 }}>
                <span style={{ fontSize:10, fontWeight:700, color:prog.tagColor }}>{prog.tag}</span>
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:C.text, lineHeight:1.3, marginBottom:4 }}>{prog.title}</div>
              <div style={{ fontSize:12, color:C.muted }}>{prog.desc}</div>
              {user?.plan!=='premium' && (
                <div style={{ position:'absolute', top:10, right:10, background:C.accent, borderRadius:99, padding:'2px 7px', fontSize:9, fontWeight:800, color:'#4A3800' }}>✨ PRO</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {devOpen && <DevotionalModal dev={dev} onClose={()=>setDevOpen(false)} onComplete={()=>{ if(!devCompletedToday&&onComplete) onComplete(); }} alreadyDone={devCompletedToday}/>}
    </div>
  );
}

// ─── FOOD DATABASE ────────────────────────────────────────────────────────────
// 200+ foods with calories, protein, carbs, fat per standard serving
const FOOD_DB = [
  // ── Proteins ──────────────────────────────────────────────
  { name:'Chicken Breast (4 oz, grilled)',    cat:'Protein',    cal:185, protein:35, carbs:0,  fat:4  },
  { name:'Salmon Fillet (4 oz, baked)',       cat:'Protein',    cal:234, protein:33, carbs:0,  fat:11 },
  { name:'Ground Turkey (4 oz, lean)',        cat:'Protein',    cal:170, protein:28, carbs:0,  fat:7  },
  { name:'Tilapia (4 oz, baked)',             cat:'Protein',    cal:145, protein:30, carbs:0,  fat:3  },
  { name:'Shrimp (4 oz, cooked)',             cat:'Protein',    cal:112, protein:24, carbs:0,  fat:1  },
  { name:'Tuna (3 oz, canned in water)',      cat:'Protein',    cal:100, protein:22, carbs:0,  fat:1  },
  { name:'Lean Ground Beef (4 oz)',           cat:'Protein',    cal:218, protein:29, carbs:0,  fat:11 },
  { name:'Pork Tenderloin (4 oz)',            cat:'Protein',    cal:161, protein:28, carbs:0,  fat:4  },
  { name:'Cod Fillet (4 oz)',                 cat:'Protein',    cal:120, protein:26, carbs:0,  fat:1  },
  { name:'Eggs (2 large)',                    cat:'Protein',    cal:143, protein:13, carbs:1,  fat:10 },
  { name:'Egg Whites (3 large)',              cat:'Protein',    cal:51,  protein:11, carbs:1,  fat:0  },
  { name:'Greek Yogurt (1 cup, plain 0%)',    cat:'Protein',    cal:100, protein:17, carbs:6,  fat:1  },
  { name:'Cottage Cheese (½ cup)',            cat:'Protein',    cal:90,  protein:13, carbs:4,  fat:2  },
  { name:'Black Beans (½ cup, cooked)',       cat:'Protein',    cal:114, protein:8,  carbs:20, fat:0  },
  { name:'Chickpeas (½ cup, cooked)',         cat:'Protein',    cal:134, protein:7,  carbs:22, fat:2  },
  { name:'Lentils (½ cup, cooked)',           cat:'Protein',    cal:115, protein:9,  carbs:20, fat:0  },
  { name:'Edamame (½ cup, shelled)',          cat:'Protein',    cal:95,  protein:8,  carbs:8,  fat:4  },
  { name:'Tofu (½ cup, firm)',                cat:'Protein',    cal:94,  protein:10, carbs:2,  fat:5  },
  { name:'Tempeh (3 oz)',                     cat:'Protein',    cal:162, protein:15, carbs:8,  fat:9  },
  { name:'Turkey Deli Meat (3 slices)',       cat:'Protein',    cal:75,  protein:12, carbs:2,  fat:1  },

  // ── Dairy ──────────────────────────────────────────────────
  { name:'Whole Milk (1 cup)',                cat:'Dairy',      cal:149, protein:8,  carbs:12, fat:8  },
  { name:'2% Milk (1 cup)',                   cat:'Dairy',      cal:122, protein:8,  carbs:12, fat:5  },
  { name:'Skim Milk (1 cup)',                 cat:'Dairy',      cal:83,  protein:8,  carbs:12, fat:0  },
  { name:'Almond Milk (1 cup, unsweetened)',  cat:'Dairy',      cal:30,  protein:1,  carbs:1,  fat:3  },
  { name:'Oat Milk (1 cup)',                  cat:'Dairy',      cal:120, protein:3,  carbs:16, fat:5  },
  { name:'Cheddar Cheese (1 oz)',             cat:'Dairy',      cal:113, protein:7,  carbs:0,  fat:9  },
  { name:'Mozzarella (1 oz, part-skim)',      cat:'Dairy',      cal:72,  protein:7,  carbs:1,  fat:4  },
  { name:'Feta Cheese (1 oz)',                cat:'Dairy',      cal:75,  protein:4,  carbs:1,  fat:6  },
  { name:'Plain Yogurt (1 cup, whole)',       cat:'Dairy',      cal:149, protein:9,  carbs:11, fat:8  },
  { name:'Butter (1 tbsp)',                   cat:'Dairy',      cal:102, protein:0,  carbs:0,  fat:12 },

  // ── Grains & Starches ──────────────────────────────────────
  { name:'Brown Rice (1 cup, cooked)',        cat:'Grains',     cal:216, protein:5,  carbs:45, fat:2  },
  { name:'White Rice (1 cup, cooked)',        cat:'Grains',     cal:206, protein:4,  carbs:45, fat:0  },
  { name:'Quinoa (1 cup, cooked)',            cat:'Grains',     cal:222, protein:8,  carbs:39, fat:4  },
  { name:'Oatmeal (1 cup, cooked)',           cat:'Grains',     cal:166, protein:6,  carbs:32, fat:4  },
  { name:'Whole Wheat Bread (1 slice)',       cat:'Grains',     cal:81,  protein:4,  carbs:14, fat:1  },
  { name:'White Bread (1 slice)',             cat:'Grains',     cal:79,  protein:3,  carbs:15, fat:1  },
  { name:'Whole Wheat Tortilla (1 medium)',   cat:'Grains',     cal:146, protein:4,  carbs:26, fat:3  },
  { name:'Pasta (1 cup, cooked)',             cat:'Grains',     cal:220, protein:8,  carbs:43, fat:1  },
  { name:'Whole Wheat Pasta (1 cup, cooked)',cat:'Grains',      cal:174, protein:7,  carbs:37, fat:1  },
  { name:'Sweet Potato (1 medium, baked)',    cat:'Grains',     cal:103, protein:2,  carbs:24, fat:0  },
  { name:'Russet Potato (1 medium, baked)',   cat:'Grains',     cal:168, protein:5,  carbs:38, fat:0  },
  { name:'Corn (1 cup, kernels)',             cat:'Grains',     cal:132, protein:5,  carbs:29, fat:2  },
  { name:'Pita Bread (1 small, whole wheat)', cat:'Grains',     cal:74,  protein:3,  carbs:15, fat:1  },
  { name:'Granola (¼ cup)',                   cat:'Grains',     cal:149, protein:4,  carbs:20, fat:7  },
  { name:'Cream of Wheat (1 cup, cooked)',    cat:'Grains',     cal:133, protein:4,  carbs:28, fat:0  },

  // ── Vegetables ────────────────────────────────────────────
  { name:'Broccoli (1 cup, raw)',             cat:'Vegetables', cal:31,  protein:3,  carbs:6,  fat:0  },
  { name:'Spinach (1 cup, raw)',              cat:'Vegetables', cal:7,   protein:1,  carbs:1,  fat:0  },
  { name:'Kale (1 cup, raw)',                 cat:'Vegetables', cal:33,  protein:3,  carbs:6,  fat:1  },
  { name:'Mixed Salad Greens (2 cups)',       cat:'Vegetables', cal:18,  protein:2,  carbs:3,  fat:0  },
  { name:'Cucumber (1 cup, sliced)',          cat:'Vegetables', cal:16,  protein:1,  carbs:4,  fat:0  },
  { name:'Tomatoes (1 cup, chopped)',         cat:'Vegetables', cal:32,  protein:2,  carbs:7,  fat:0  },
  { name:'Bell Pepper (1 medium)',            cat:'Vegetables', cal:31,  protein:1,  carbs:7,  fat:0  },
  { name:'Carrots (1 cup, raw)',              cat:'Vegetables', cal:52,  protein:1,  carbs:12, fat:0  },
  { name:'Celery (1 cup, chopped)',           cat:'Vegetables', cal:16,  protein:1,  carbs:3,  fat:0  },
  { name:'Zucchini (1 cup, sliced)',          cat:'Vegetables', cal:19,  protein:1,  carbs:4,  fat:0  },
  { name:'Cauliflower (1 cup, raw)',          cat:'Vegetables', cal:25,  protein:2,  carbs:5,  fat:0  },
  { name:'Green Beans (1 cup, cooked)',       cat:'Vegetables', cal:44,  protein:2,  carbs:10, fat:0  },
  { name:'Asparagus (1 cup, cooked)',         cat:'Vegetables', cal:40,  protein:4,  carbs:8,  fat:0  },
  { name:'Brussels Sprouts (1 cup, cooked)', cat:'Vegetables', cal:56,  protein:4,  carbs:11, fat:1  },
  { name:'Mushrooms (1 cup, raw)',            cat:'Vegetables', cal:15,  protein:2,  carbs:2,  fat:0  },
  { name:'Onion (1 medium)',                  cat:'Vegetables', cal:44,  protein:1,  carbs:10, fat:0  },
  { name:'Garlic (3 cloves)',                 cat:'Vegetables', cal:13,  protein:1,  carbs:3,  fat:0  },
  { name:'Corn on the Cob (1 ear)',           cat:'Vegetables', cal:77,  protein:3,  carbs:17, fat:1  },
  { name:'Edamame in shell (1 cup)',          cat:'Vegetables', cal:189, protein:17, carbs:16, fat:8  },
  { name:'Beets (1 cup, cooked)',             cat:'Vegetables', cal:75,  protein:3,  carbs:17, fat:0  },

  // ── Fruits ────────────────────────────────────────────────
  { name:'Apple (1 medium)',                  cat:'Fruits',     cal:95,  protein:0,  carbs:25, fat:0  },
  { name:'Banana (1 medium)',                 cat:'Fruits',     cal:105, protein:1,  carbs:27, fat:0  },
  { name:'Orange (1 medium)',                 cat:'Fruits',     cal:62,  protein:1,  carbs:15, fat:0  },
  { name:'Grapes (1 cup)',                    cat:'Fruits',     cal:104, protein:1,  carbs:27, fat:0  },
  { name:'Strawberries (1 cup)',              cat:'Fruits',     cal:49,  protein:1,  carbs:12, fat:0  },
  { name:'Blueberries (1 cup)',               cat:'Fruits',     cal:84,  protein:1,  carbs:21, fat:0  },
  { name:'Mango (1 cup, cubed)',              cat:'Fruits',     cal:107, protein:1,  carbs:28, fat:0  },
  { name:'Pineapple (1 cup, chunks)',         cat:'Fruits',     cal:82,  protein:1,  carbs:22, fat:0  },
  { name:'Watermelon (2 cups, cubed)',        cat:'Fruits',     cal:85,  protein:2,  carbs:21, fat:0  },
  { name:'Peach (1 medium)',                  cat:'Fruits',     cal:58,  protein:1,  carbs:14, fat:0  },
  { name:'Pear (1 medium)',                   cat:'Fruits',     cal:101, protein:1,  carbs:27, fat:0  },
  { name:'Avocado (½ medium)',                cat:'Fruits',     cal:120, protein:2,  carbs:6,  fat:11 },
  { name:'Kiwi (1 medium)',                   cat:'Fruits',     cal:42,  protein:1,  carbs:10, fat:0  },
  { name:'Grapefruit (½ medium)',             cat:'Fruits',     cal:52,  protein:1,  carbs:13, fat:0  },
  { name:'Cherries (1 cup)',                  cat:'Fruits',     cal:97,  protein:2,  carbs:25, fat:0  },
  { name:'Raspberries (1 cup)',               cat:'Fruits',     cal:64,  protein:1,  carbs:15, fat:1  },
  { name:'Blackberries (1 cup)',              cat:'Fruits',     cal:62,  protein:2,  carbs:14, fat:1  },

  // ── Healthy Fats & Nuts ────────────────────────────────────
  { name:'Almonds (1 oz, ~23 nuts)',          cat:'Nuts & Fats',cal:164, protein:6,  carbs:6,  fat:14 },
  { name:'Walnuts (1 oz, ~14 halves)',        cat:'Nuts & Fats',cal:185, protein:4,  carbs:4,  fat:18 },
  { name:'Cashews (1 oz, ~18 nuts)',          cat:'Nuts & Fats',cal:157, protein:5,  carbs:9,  fat:12 },
  { name:'Peanut Butter (2 tbsp)',            cat:'Nuts & Fats',cal:190, protein:8,  carbs:6,  fat:16 },
  { name:'Almond Butter (2 tbsp)',            cat:'Nuts & Fats',cal:196, protein:7,  carbs:6,  fat:18 },
  { name:'Olive Oil (1 tbsp)',                cat:'Nuts & Fats',cal:119, protein:0,  carbs:0,  fat:14 },
  { name:'Coconut Oil (1 tbsp)',              cat:'Nuts & Fats',cal:121, protein:0,  carbs:0,  fat:14 },
  { name:'Sunflower Seeds (¼ cup)',           cat:'Nuts & Fats',cal:186, protein:6,  carbs:8,  fat:16 },
  { name:'Chia Seeds (2 tbsp)',               cat:'Nuts & Fats',cal:138, protein:5,  carbs:12, fat:9  },
  { name:'Flaxseed (2 tbsp)',                 cat:'Nuts & Fats',cal:74,  protein:3,  carbs:4,  fat:6  },
  { name:'Hummus (2 tbsp)',                   cat:'Nuts & Fats',cal:70,  protein:2,  carbs:5,  fat:5  },
  { name:'Guacamole (¼ cup)',                 cat:'Nuts & Fats',cal:90,  protein:1,  carbs:5,  fat:8  },

  // ── Breakfast ─────────────────────────────────────────────
  { name:'Scrambled Eggs (3 eggs)',           cat:'Breakfast',  cal:249, protein:19, carbs:2,  fat:18 },
  { name:'French Toast (2 slices)',           cat:'Breakfast',  cal:280, protein:9,  carbs:38, fat:10 },
  { name:'Pancakes (3 medium)',               cat:'Breakfast',  cal:360, protein:9,  carbs:60, fat:9  },
  { name:'Waffle (1 medium)',                 cat:'Breakfast',  cal:218, protein:6,  carbs:33, fat:8  },
  { name:'Bagel (1 plain)',                   cat:'Breakfast',  cal:270, protein:10, carbs:53, fat:2  },
  { name:'Cream Cheese (2 tbsp)',             cat:'Breakfast',  cal:99,  protein:2,  carbs:1,  fat:10 },
  { name:'Overnight Oats (½ cup oats)',       cat:'Breakfast',  cal:297, protein:11, carbs:46, fat:8  },
  { name:'Smoothie Bowl (base, 1 cup)',       cat:'Breakfast',  cal:220, protein:5,  carbs:44, fat:3  },
  { name:'Acai Bowl (8 oz)',                  cat:'Breakfast',  cal:211, protein:3,  carbs:30, fat:10 },
  { name:'Granola Bar (1 bar)',               cat:'Breakfast',  cal:193, protein:4,  carbs:29, fat:7  },
  { name:'Bran Muffin (1 medium)',            cat:'Breakfast',  cal:200, protein:4,  carbs:35, fat:5  },
  { name:'Black Coffee (8 oz)',               cat:'Breakfast',  cal:5,   protein:0,  carbs:0,  fat:0  },
  { name:'Coffee with Cream & Sugar',         cat:'Breakfast',  cal:70,  protein:1,  carbs:8,  fat:4  },
  { name:'Orange Juice (8 oz)',               cat:'Breakfast',  cal:112, protein:2,  carbs:26, fat:0  },

  // ── Soups & Salads ─────────────────────────────────────────
  { name:'Caesar Salad (2 cups)',             cat:'Salads',     cal:280, protein:6,  carbs:14, fat:23 },
  { name:'Garden Salad (2 cups, no dressing)',cat:'Salads',     cal:50,  protein:3,  carbs:8,  fat:1  },
  { name:'Chicken Caesar Salad',             cat:'Salads',     cal:420, protein:38, carbs:14, fat:24 },
  { name:'Cobb Salad (no dressing)',          cat:'Salads',     cal:380, protein:28, carbs:10, fat:26 },
  { name:'Chicken Noodle Soup (1 cup)',       cat:'Soups',      cal:154, protein:12, carbs:15, fat:5  },
  { name:'Tomato Soup (1 cup)',               cat:'Soups',      cal:160, protein:3,  carbs:20, fat:7  },
  { name:'Minestrone (1 cup)',                cat:'Soups',      cal:120, protein:5,  carbs:18, fat:3  },
  { name:'Black Bean Soup (1 cup)',           cat:'Soups',      cal:218, protein:14, carbs:39, fat:1  },
  { name:'Lentil Soup (1 cup)',               cat:'Soups',      cal:226, protein:16, carbs:40, fat:0  },
  { name:'Vegetable Broth (1 cup)',           cat:'Soups',      cal:12,  protein:1,  carbs:2,  fat:0  },

  // ── Common Meals ──────────────────────────────────────────
  { name:'Grilled Chicken Sandwich',         cat:'Meals',      cal:450, protein:38, carbs:42, fat:12 },
  { name:'Turkey Wrap',                      cat:'Meals',      cal:380, protein:28, carbs:36, fat:11 },
  { name:'Tuna Salad Sandwich',              cat:'Meals',      cal:415, protein:27, carbs:38, fat:15 },
  { name:'Grilled Salmon with Vegetables',   cat:'Meals',      cal:380, protein:42, carbs:15, fat:16 },
  { name:'Chicken Stir-Fry with Rice',       cat:'Meals',      cal:490, protein:35, carbs:58, fat:10 },
  { name:'Spaghetti with Marinara (2 cups)', cat:'Meals',      cal:420, protein:14, carbs:82, fat:4  },
  { name:'Turkey Tacos (2 tacos)',           cat:'Meals',      cal:380, protein:28, carbs:30, fat:14 },
  { name:'Chicken Burrito Bowl',             cat:'Meals',      cal:665, protein:44, carbs:82, fat:16 },
  { name:'Veggie Burger',                    cat:'Meals',      cal:370, protein:18, carbs:44, fat:13 },
  { name:'Salmon Bowl with Quinoa',          cat:'Meals',      cal:520, protein:40, carbs:48, fat:15 },
  { name:'Chicken & Broccoli Stir-Fry',      cat:'Meals',      cal:340, protein:42, carbs:18, fat:9  },
  { name:'Baked Cod with Asparagus',         cat:'Meals',      cal:280, protein:38, carbs:10, fat:6  },
  { name:'Shrimp Tacos (3 tacos)',           cat:'Meals',      cal:420, protein:28, carbs:44, fat:13 },
  { name:'Lentil & Vegetable Curry',         cat:'Meals',      cal:390, protein:18, carbs:62, fat:8  },

  // ── Snacks ────────────────────────────────────────────────
  { name:'Apple with Peanut Butter',         cat:'Snacks',     cal:282, protein:7,  carbs:36, fat:16 },
  { name:'Banana with Almond Butter',        cat:'Snacks',     cal:301, protein:8,  carbs:33, fat:18 },
  { name:'Trail Mix (¼ cup)',                cat:'Snacks',     cal:173, protein:5,  carbs:16, fat:11 },
  { name:'Rice Cakes (2, plain)',            cat:'Snacks',     cal:70,  protein:1,  carbs:15, fat:0  },
  { name:'String Cheese (1 stick)',          cat:'Snacks',     cal:80,  protein:7,  carbs:0,  fat:5  },
  { name:'Baby Carrots (3 oz) + Hummus',     cat:'Snacks',     cal:115, protein:3,  carbs:15, fat:5  },
  { name:'Celery with Peanut Butter',        cat:'Snacks',     cal:160, protein:6,  carbs:8,  fat:14 },
  { name:'Protein Bar (average)',            cat:'Snacks',     cal:200, protein:20, carbs:22, fat:7  },
  { name:'Popcorn (3 cups, air-popped)',     cat:'Snacks',     cal:93,  protein:3,  carbs:19, fat:1  },
  { name:'Dark Chocolate (1 oz)',            cat:'Snacks',     cal:155, protein:2,  carbs:17, fat:9  },
  { name:'Crackers (5, whole wheat)',        cat:'Snacks',     cal:90,  protein:2,  carbs:14, fat:3  },
  { name:'Protein Shake (1 scoop + water)', cat:'Snacks',     cal:130, protein:25, carbs:4,  fat:2  },

  // ── Drinks ────────────────────────────────────────────────
  { name:'Water (8 oz)',                     cat:'Drinks',     cal:0,   protein:0,  carbs:0,  fat:0  },
  { name:'Green Tea (8 oz, unsweetened)',    cat:'Drinks',     cal:2,   protein:0,  carbs:0,  fat:0  },
  { name:'Kombucha (12 oz)',                 cat:'Drinks',     cal:60,  protein:0,  carbs:14, fat:0  },
  { name:'Coconut Water (8 oz)',             cat:'Drinks',     cal:46,  protein:2,  carbs:9,  fat:0  },
  { name:'Smoothie (banana, berries, milk)', cat:'Drinks',     cal:280, protein:9,  carbs:52, fat:5  },
  { name:'Protein Smoothie',                cat:'Drinks',     cal:310, protein:28, carbs:38, fat:6  },
  { name:'Cold Brew Coffee (8 oz)',          cat:'Drinks',     cal:5,   protein:0,  carbs:0,  fat:0  },
  { name:'Latte (12 oz, whole milk)',        cat:'Drinks',     cal:190, protein:10, carbs:18, fat:7  },
  { name:'Latte (12 oz, oat milk)',          cat:'Drinks',     cal:190, protein:7,  carbs:26, fat:7  },
  { name:'Sparkling Water (12 oz)',          cat:'Drinks',     cal:0,   protein:0,  carbs:0,  fat:0  },
];

const FOOD_CATEGORIES = ['All','Protein','Dairy','Grains','Vegetables','Fruits','Nuts & Fats','Breakfast','Salads','Soups','Meals','Snacks','Drinks'];

// ─── CALORIE RING ─────────────────────────────────────────────────────────────
function CalorieRing({ consumed, goal }) {
  const r=52, cx=66, cy=66, circ=2*Math.PI*r;
  const pct=Math.min(consumed/goal,1), dash=circ*pct;
  const color=consumed<=goal?C.success:'#E8A87C';
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
      <svg width={132} height={132}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E4EAE1" strokeWidth={10}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={10} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} style={{ transition:'stroke-dasharray 0.6s ease' }}/>
        <text x={cx} y={cy-8} textAnchor="middle" fill={C.text} fontFamily="Inter" fontSize={20} fontWeight={700}>{consumed}</text>
        <text x={cx} y={cy+8} textAnchor="middle" fill={C.muted} fontFamily="Inter" fontSize={11}>of {goal} cal</text>
        <text x={cx} y={cy+24} textAnchor="middle" fill={color} fontFamily="Inter" fontSize={11} fontWeight={600}>{Math.round(pct*100)}%</text>
      </svg>
      <div style={{ fontSize:13, color:consumed<=goal?C.success:'#D4784A', fontWeight:600, textAlign:'center' }}>
        {consumed<=goal ? 'Nourishing your temple well! 🌿' : 'Every meal is a choice of grace 💛'}
      </div>
    </div>
  );
}

// ─── FOOD LOGGER ─────────────────────────────────────────────────────────────
function FoodLogger({ onBack, items, setItems, calorieGoal=1800 }) {
  const [meal, setMeal] = useState('breakfast');
  const [mode, setMode] = useState('log');      // 'log' | 'search' | 'custom'
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedFood, setSelectedFood] = useState(null);
  const [servings, setServings] = useState('1');
  const [nf, setNf] = useState({ name:'', cal:'', protein:'', carbs:'', fat:'' });
  const searchRef = React.useRef(null);

  const GOAL = calorieGoal;
  const total = items.reduce((s,i) => s+i.cal, 0);
  const mealItems = items.filter(i => i.meal === meal);
  const meals = ['breakfast','lunch','dinner','snack'];

  // Filter food database
  const filtered = FOOD_DB.filter(f => {
    const matchCat = category === 'All' || f.cat === category;
    const matchQ = !query || f.name.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  }).slice(0, 40); // cap at 40 results

  const addFromDB = () => {
    if (!selectedFood) return;
    const sv = parseFloat(servings) || 1;
    setItems(p => [...p, {
      id: Date.now(), meal,
      name: selectedFood.name + (sv !== 1 ? ` (×${sv})` : ''),
      cal:     Math.round(selectedFood.cal     * sv),
      protein: Math.round(selectedFood.protein * sv),
      carbs:   Math.round(selectedFood.carbs   * sv),
      fat:     Math.round(selectedFood.fat     * sv),
    }]);
    setSelectedFood(null); setServings('1'); setQuery(''); setMode('log');
  };

  const addCustom = () => {
    if (!nf.name || !nf.cal) return;
    setItems(p => [...p, { id:Date.now(), meal, name:nf.name, cal:parseInt(nf.cal)||0, protein:parseInt(nf.protein)||0, carbs:parseInt(nf.carbs)||0, fat:parseInt(nf.fat)||0 }]);
    setNf({ name:'', cal:'', protein:'', carbs:'', fat:'' });
    setMode('log');
  };

  // ── SEARCH SCREEN ──
  if (mode === 'search') return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 140px)' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14, flexShrink:0 }}>
        <BackBtn onClick={()=>{ setMode('log'); setSelectedFood(null); setQuery(''); }}/>
        <div className="serif" style={{ fontSize:20, fontWeight:700 }}>Search Foods</div>
        <div style={{ marginLeft:'auto', fontSize:13, color:C.muted, textTransform:'capitalize', fontWeight:500 }}>
          Adding to {meal}
        </div>
      </div>

      {/* Search input */}
      <div style={{ position:'relative', marginBottom:10, flexShrink:0 }}>
        <input ref={searchRef} className="ff-input" autoFocus value={query} onChange={e=>{setQuery(e.target.value);setSelectedFood(null);}}
          placeholder="Search 200+ foods..."
          style={{ width:'100%', border:`1.5px solid ${C.border}`, borderRadius:99, padding:'11px 40px 11px 18px', fontSize:14, color:C.text, background:C.white }}/>
        {query && <button onClick={()=>{setQuery('');setSelectedFood(null);}} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex' }}><X size={15}/></button>}
      </div>

      {/* Category filter */}
      <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:8, flexShrink:0 }}>
        {FOOD_CATEGORIES.map(cat => (
          <div key={cat} onClick={()=>{setCategory(cat);setSelectedFood(null);}}
            style={{ padding:'5px 13px', borderRadius:99, border:`1.5px solid ${category===cat?C.primary:C.border}`, background:category===cat?C.primary:C.white, color:category===cat?C.white:C.muted, fontSize:11, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, transition:'all .15s' }}>
            {cat}
          </div>
        ))}
      </div>

      {/* Selected food detail */}
      {selectedFood && (
        <div style={{ background:`linear-gradient(135deg, ${C.primary}0D, ${C.accent}0A)`, border:`1.5px solid ${C.primary}30`, borderRadius:14, padding:14, marginBottom:10, flexShrink:0 }}>
          <div style={{ fontWeight:600, fontSize:15, color:C.text, marginBottom:4 }}>{selectedFood.name}</div>
          <div style={{ display:'flex', gap:12, marginBottom:12 }}>
            {[['Cal',selectedFood.cal,'#E8A87C'],['Pro',selectedFood.protein+'g','#7FA876'],['Carb',selectedFood.carbs+'g','#C9A961'],['Fat',selectedFood.fat+'g','#A8D8EA']].map(([l,v,col])=>(
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontSize:14, fontWeight:700, color:col }}>{v}</div>
                <div style={{ fontSize:10, color:C.muted }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ fontSize:13, color:C.muted, fontWeight:500 }}>Servings:</div>
            <div style={{ display:'flex', alignItems:'center', gap:6, background:C.white, border:`1.5px solid ${C.border}`, borderRadius:8, overflow:'hidden' }}>
              <button onClick={()=>setServings(s=>String(Math.max(0.5,parseFloat(s)-0.5)))} style={{ padding:'6px 10px', background:'none', border:'none', cursor:'pointer', fontSize:16, color:C.primary, fontWeight:700 }}>−</button>
              <input type="number" value={servings} onChange={e=>setServings(e.target.value)} step="0.5" min="0.5"
                style={{ width:44, textAlign:'center', border:'none', fontSize:14, fontWeight:600, color:C.text, padding:'6px 0', background:'transparent' }}/>
              <button onClick={()=>setServings(s=>String(parseFloat(s)+0.5))} style={{ padding:'6px 10px', background:'none', border:'none', cursor:'pointer', fontSize:16, color:C.primary, fontWeight:700 }}>+</button>
            </div>
            <div style={{ fontSize:12, color:C.muted }}>= {Math.round(selectedFood.cal*(parseFloat(servings)||1))} cal</div>
            <Btn onClick={addFromDB} style={{ marginLeft:'auto', padding:'8px 16px', fontSize:13 }}><Plus size={13}/> Add</Btn>
          </div>
        </div>
      )}

      {/* Results list */}
      <div className="scroll" style={{ flex:1, overflowY:'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'30px 0', color:C.muted, fontSize:13 }}>
            <div style={{ fontSize:28, marginBottom:8 }}>🔍</div>
            No foods found for "{query}"
            <div style={{ marginTop:12 }}>
              <Btn small variant="secondary" onClick={()=>setMode('custom')}>+ Add Custom Food</Btn>
            </div>
          </div>
        ) : (
          filtered.map(food => (
            <div key={food.name} onClick={()=>setSelectedFood(food)}
              style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 4px', borderBottom:`1px solid ${C.border}`, cursor:'pointer', background:selectedFood?.name===food.name?`${C.primary}08`:'transparent', borderRadius:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:500, color:C.text, marginBottom:2 }}>{food.name}</div>
                <div style={{ fontSize:11, color:C.muted }}>{food.cat} · {food.protein}g protein · {food.carbs}g carbs · {food.fat}g fat</div>
              </div>
              <div style={{ fontWeight:700, fontSize:14, color:C.primary, marginLeft:12, flexShrink:0 }}>{food.cal}</div>
            </div>
          ))
        )}
        {!query && (
          <div style={{ textAlign:'center', padding:'16px 0 8px' }}>
            <div onClick={()=>setMode('custom')} style={{ fontSize:13, color:C.primary, fontWeight:600, cursor:'pointer' }}>
              + Can't find it? Add a custom food
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── CUSTOM FOOD SCREEN ──
  if (mode === 'custom') return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
        <BackBtn onClick={()=>setMode('search')}/>
        <div className="serif" style={{ fontSize:20, fontWeight:700 }}>Custom Food</div>
      </div>
      <div style={{ fontSize:13, color:C.muted, marginBottom:18, lineHeight:1.6 }}>
        Can't find what you're looking for? Add it manually.
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
        <Input label="Food Name *" placeholder="e.g. Mom's Black Bean Soup" value={nf.name} onChange={e=>setNf(p=>({...p,name:e.target.value}))}/>
        <Input label="Calories *" type="number" placeholder="e.g. 320" value={nf.cal} onChange={e=>setNf(p=>({...p,cal:e.target.value}))}/>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
          <Input label="Protein (g)" type="number" placeholder="0" value={nf.protein} onChange={e=>setNf(p=>({...p,protein:e.target.value}))}/>
          <Input label="Carbs (g)"   type="number" placeholder="0" value={nf.carbs}   onChange={e=>setNf(p=>({...p,carbs:e.target.value}))}/>
          <Input label="Fat (g)"     type="number" placeholder="0" value={nf.fat}     onChange={e=>setNf(p=>({...p,fat:e.target.value}))}/>
        </div>
        <Btn full onClick={addCustom} style={{ marginTop:4 }}>
          <Plus size={14}/> Add to {meal.charAt(0).toUpperCase()+meal.slice(1)}
        </Btn>
        <Btn full variant="ghost" onClick={()=>setMode('search')}>← Back to Search</Btn>
      </div>
    </div>
  );

  // ── FOOD LOG MAIN ──
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
        <BackBtn onClick={onBack}/><div className="serif" style={{ fontSize:24, fontWeight:700 }}>Food Log</div>
      </div>
      <Card style={{ marginBottom:14, display:'flex', justifyContent:'center' }}>
        <CalorieRing consumed={total} goal={GOAL}/>
      </Card>
      {/* Macro donut + breakdown */}
      <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:20, marginBottom:14, alignItems:'center', background:C.bg, borderRadius:16, padding:16, boxShadow:shadow.card }}>
        {/* Mini donut */}
        {(() => {
          const p = items.reduce((s,i)=>s+i.protein,0)*4;
          const cb = items.reduce((s,i)=>s+i.carbs,0)*4;
          const f = items.reduce((s,i)=>s+i.fat,0)*9;
          const tot = p+cb+f || 1;
          const r=36, cx=42, cy=42, circ=2*Math.PI*r;
          const pPct=p/tot, cPct=cb/tot, fPct=f/tot;
          const segs=[
            { color:C.primary, pct:pPct },
            { color:C.accent,  pct:cPct },
            { color:'#E8A87C', pct:fPct },
          ];
          let offset=0;
          return (
            <svg width={84} height={84} viewBox="0 0 84 84">
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth={10}/>
              {items.length === 0
                ? <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth={10}/>
                : segs.map((seg,i)=>{
                    const dash = circ*seg.pct;
                    const el = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={10}
                      strokeDasharray={`${dash} ${circ}`} strokeDashoffset={-offset*circ} strokeLinecap="butt"
                      transform={`rotate(-90 ${cx} ${cy})`}/>;
                    offset += seg.pct;
                    return el;
                  })
              }
              <text x={cx} y={cy+5} textAnchor="middle" fill={C.text} fontFamily="inherit" fontSize={13} fontWeight={800}>{Math.round(tot/4)}</text>
              <text x={cx} y={cy+16} textAnchor="middle" fill={C.muted} fontFamily="inherit" fontSize={8}>kcal macro</text>
            </svg>
          );
        })()}
        {/* Macro bars */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {[
            { label:'Protein', val:items.reduce((s,i)=>s+i.protein,0), unit:'g', color:C.primary },
            { label:'Carbs',   val:items.reduce((s,i)=>s+i.carbs,0),   unit:'g', color:C.accent },
            { label:'Fat',     val:items.reduce((s,i)=>s+i.fat,0),     unit:'g', color:'#E8A87C' },
          ].map(m=>(
            <div key={m.label}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                <span style={{ fontSize:11, color:C.muted }}>{m.label}</span>
                <span style={{ fontSize:11, fontWeight:700, color:m.color }}>{m.val}g</span>
              </div>
              <div style={{ height:5, background:`${m.color}22`, borderRadius:99 }}>
                <div style={{ height:'100%', width:`${Math.min((m.val/150)*100,100)}%`, background:m.color, borderRadius:99, transition:'width .4s' }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Meal tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:14, background:C.bgAlt, padding:4, borderRadius:12 }}>
        {meals.map(m=>(
          <div key={m} onClick={()=>setMeal(m)} className="tab-item" style={{ flex:1, textAlign:'center', padding:'8px 0', borderRadius:9, background:meal===m?C.white:'transparent', fontWeight:600, fontSize:12, color:meal===m?C.primary:C.muted, boxShadow:meal===m?'0 1px 4px rgba(0,0,0,0.08)':'none', textTransform:'capitalize' }}>
            {m.charAt(0).toUpperCase()+m.slice(1)}
          </div>
        ))}
      </div>
      {/* Logged items */}
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
        {mealItems.length===0 && (
          <div style={{ textAlign:'center', padding:'28px 0', color:C.muted, fontSize:13, fontStyle:'italic' }}>
            Nothing logged yet. Ready to nourish your temple? 🌿
          </div>
        )}
        {mealItems.map(item=>(
          <Card key={item.id} pad={14} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:14, color:C.text }}>{item.name}</div>
              <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>P:{item.protein}g · C:{item.carbs}g · F:{item.fat}g</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontWeight:700, fontSize:14, color:C.primary }}>{item.cal}</span>
              <button onClick={()=>setItems(p=>p.filter(i=>i.id!==item.id))} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, padding:2, display:'flex' }}><X size={13}/></button>
            </div>
          </Card>
        ))}
      </div>
      {/* Add button */}
      <Btn full onClick={()=>setMode('search')}><Plus size={15}/> Add Food</Btn>
    </div>
  );
}

// ─── WATER TRACKER ────────────────────────────────────────────────────────────
function WaterTracker({ onBack, cups, setCups, waterGoal=8 }) {
  const GOAL=waterGoal;
  const pct=Math.min(cups/GOAL,1);
  const fillH=Math.round(pct*155);
  const [ripple, setRipple] = useState(false);
  const msg = cups>=GOAL ? 'Hydration goal complete! Your body thanks you 💧' : cups>=GOAL/2 ? `Just ${GOAL-cups} more cup${GOAL-cups>1?'s':''} to go! Keep going! 💪` : 'Every sip honors your temple. Keep drinking! 💧';

  const addCup = (amount=1) => {
    setCups(c=>Math.min(c+amount,12));
    setRipple(true);
    setTimeout(()=>setRipple(false), 600);
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <BackBtn onClick={onBack}/><div className="serif" style={{ fontSize:24, fontWeight:700 }}>Water Tracker</div>
      </div>
      <Card style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16, padding:28, marginBottom:14 }}>
        {/* Water bottle SVG with ripple */}
        <div style={{ position:'relative', width:100, height:200 }}>
          <svg viewBox="0 0 100 200" width={100} height={200} style={{ position:'absolute', top:0, left:0, overflow:'visible' }}>
            <defs>
              <clipPath id="wc"><path d="M36,14 L29,34 Q14,52 14,72 L14,172 Q14,186 50,186 Q86,186 86,172 L86,72 Q86,52 71,34 L64,14 Z"/></clipPath>
            </defs>
            <path d="M36,14 L29,34 Q14,52 14,72 L14,172 Q14,186 50,186 Q86,186 86,172 L86,72 Q86,52 71,34 L64,14 Z" fill={C.bgAlt} stroke={C.border} strokeWidth={2}/>
            <rect x={14} y={186-fillH} width={72} height={fillH+2} fill="#A8D8EA" opacity={0.72} clipPath="url(#wc)" style={{ transition:'all 0.5s cubic-bezier(.22,.68,0,1.1)' }}/>
            {ripple && <ellipse cx={50} cy={186-fillH} rx={28} ry={6} fill="rgba(255,255,255,0.55)" clipPath="url(#wc)" style={{ animation:'fadeIn 0.6s ease forwards' }}/>}
            {pct>=1 && <rect x={14} y={60} width={72} height={10} fill="rgba(255,255,255,0.3)" clipPath="url(#wc)"/>}
            <rect x={35} y={3} width={30} height={14} rx={4} fill={C.primary}/>
          </svg>
        </div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:52, fontWeight:700, color:C.primary, lineHeight:1, transition:'all .3s' }}>{cups}</div>
          <div style={{ fontSize:16, color:C.muted }}>/ {GOAL} cups</div>
        </div>
        {cups>=GOAL && <div style={{ background:`${C.success}20`, border:`1px solid ${C.success}50`, borderRadius:99, padding:'5px 16px', fontSize:12, fontWeight:600, color:C.success }}>🎉 Daily goal reached!</div>}
        <div style={{ fontSize:14, color:C.muted, textAlign:'center', fontStyle:'italic' }}>{msg}</div>
        <div style={{ display:'flex', gap:9, width:'100%' }}>
          <Btn full onClick={()=>addCup(1)}><Droplets size={14}/> +1 Cup</Btn>
          <Btn variant="secondary" onClick={()=>addCup(0.5)} style={{ padding:'13px 14px', whiteSpace:'nowrap' }}>+½</Btn>
          <Btn variant="ghost" onClick={()=>setCups(c=>Math.max(c-0.5,0))} style={{ padding:'13px 14px' }}>Undo</Btn>
        </div>
      </Card>
      <Card>
        <div style={{ fontWeight:600, fontSize:14, marginBottom:10 }}>Daily Goal Progress</div>
        <Bar val={cups} max={GOAL} color="#6BB8D4" h={12}/>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}><span style={{ fontSize:12, color:C.muted }}>0 cups</span><span style={{ fontSize:12, color:C.muted }}>{GOAL} cups</span></div>
      </Card>
    </div>
  );
}

// ─── WEIGHT LOGGER ────────────────────────────────────────────────────────────
function WeightLogger({ onBack, entries, setEntries, weightUnit='lbs', appSettings }) {
  const [weight, setWeight] = useState('');
  const [goalWeightInput, setGoalWeightInput] = useState('');

  // Load goal weight from settings
  const settings = appSettings || (() => { try { return JSON.parse(localStorage.getItem('ff_settings') || '{}'); } catch { return {}; } })();
  const [goalWeight, setGoalWeight] = useState(settings.goalWeight || '');

  const saveGoalWeight = () => {
    const v = parseFloat(goalWeightInput);
    if (!isNaN(v) && v > 0) {
      setGoalWeight(v);
      try {
        const s = JSON.parse(localStorage.getItem('ff_settings') || '{}');
        localStorage.setItem('ff_settings', JSON.stringify({ ...s, goalWeight: v }));
      } catch(e) {}
      setGoalWeightInput('');
    }
  };

  const logWeight = () => {
    if (!weight || isNaN(parseFloat(weight))) return;
    const today = getTodayKey();
    setEntries(p => {
      const without = p.filter(e => e.date !== today);
      return [{ date: today, w: parseFloat(weight) }, ...without];
    });
    setWeight('');
  };

  const chartData = [...entries].reverse().slice(-14);
  const current = entries[0]?.w;
  const oldest  = entries[entries.length - 1]?.w;
  const change  = current && oldest && entries.length > 1 ? (current - oldest).toFixed(1) : null;
  const toGoal  = goalWeight && current ? (current - parseFloat(goalWeight)).toFixed(1) : null;

  const LineChart = () => {
    if (chartData.length < 2) return (
      <div style={{ height:120, display:'flex', alignItems:'center', justifyContent:'center', color:C.muted, fontSize:13, fontStyle:'italic' }}>
        Log at least 2 entries to see your trend 📈
      </div>
    );
    const W=340, H=110, pad=16;
    const vals = chartData.map(e => e.w);
    const allVals = goalWeight ? [...vals, parseFloat(goalWeight)] : vals;
    const minV = Math.min(...allVals) - 2;
    const maxV = Math.max(...allVals) + 2;
    const xStep = (W - pad*2) / (vals.length - 1);
    const yScale = (v) => H - pad - ((v - minV) / (maxV - minV)) * (H - pad*2);
    const points = vals.map((v,i) => [pad + i*xStep, yScale(v)]);
    const pathD = points.map((p,i) => (i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`)).join(' ');
    const areaD = `${pathD} L${points[points.length-1][0]},${H-pad} L${points[0][0]},${H-pad} Z`;
    const goalY = goalWeight ? yScale(parseFloat(goalWeight)) : null;
    return (
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:'visible' }}>
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.primary} stopOpacity="0.2"/>
            <stop offset="100%" stopColor={C.primary} stopOpacity="0.02"/>
          </linearGradient>
        </defs>
        {[0,0.25,0.5,0.75,1].map(t => (
          <line key={t} x1={pad} y1={pad + t*(H-pad*2)} x2={W-pad} y2={pad + t*(H-pad*2)}
            stroke="#E4EAE1" strokeWidth="1" strokeDasharray="4,4"/>
        ))}
        {/* Goal weight line */}
        {goalY && (
          <>
            <line x1={pad} y1={goalY} x2={W-pad} y2={goalY} stroke={C.accent} strokeWidth="1.5" strokeDasharray="6,4"/>
            <text x={W-pad+4} y={goalY+4} fontSize="9" fill={C.accent} fontWeight="700">Goal</text>
          </>
        )}
        <path d={areaD} fill="url(#wg)"/>
        <path d={pathD} fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {points.map((p,i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="4" fill={C.primary} stroke="#fff" strokeWidth="2"/>
        ))}
        <text x={points[0][0]} y={H} fontSize="9" fill={C.muted} textAnchor="middle">{chartData[0].date?.slice(5)||'Start'}</text>
        <text x={points[points.length-1][0]} y={H} fontSize="9" fill={C.muted} textAnchor="middle">Today</text>
      </svg>
    );
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
        <BackBtn onClick={onBack}/>
        <div className="serif" style={{ fontSize:24, fontWeight:700 }}>Weight Log</div>
      </div>

      {/* Current weight hero */}
      <Card style={{ marginBottom:14, padding:22 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:4 }}>Current Weight</div>
            {current ? (
              <div className="serif" style={{ fontSize:44, fontWeight:700, color:C.primary, lineHeight:1 }}>
                {current} <span style={{ fontSize:18, color:C.muted, fontWeight:400 }}>{weightUnit}</span>
              </div>
            ) : (
              <div style={{ color:C.muted, fontStyle:'italic', fontSize:14 }}>Log your first entry below 🌱</div>
            )}
            {change !== null && (
              <div style={{ fontSize:13, marginTop:6, fontWeight:600, color: parseFloat(change) <= 0 ? C.success : C.muted }}>
                {parseFloat(change) < 0 ? `↓ ${Math.abs(change)} ${weightUnit} since you started 🌱` :
                 parseFloat(change) > 0 ? `↑ ${change} ${weightUnit} since you started` :
                 '✓ Holding steady!'}
              </div>
            )}
          </div>
          {goalWeight && current && (
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:11, color:C.muted, marginBottom:2 }}>Goal</div>
              <div style={{ fontSize:20, fontWeight:700, color:C.accent }}>{goalWeight} <span style={{ fontSize:11, color:C.muted }}>{weightUnit}</span></div>
              {toGoal && (
                <div style={{ fontSize:11, color:parseFloat(toGoal)<=0?C.success:C.primary, fontWeight:600, marginTop:3 }}>
                  {parseFloat(toGoal) <= 0 ? '🎉 Goal reached!' : `${Math.abs(toGoal)} to go`}
                </div>
              )}
            </div>
          )}
        </div>
        {goalWeight && current && (
          <div style={{ marginTop:14 }}>
            <Bar val={Math.max(0, (oldest||current) - current)} max={Math.max(0.1, (oldest||current) - parseFloat(goalWeight))} color={C.accent} h={6}/>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, fontSize:10, color:C.muted }}>
              <span>Start: {oldest||current} {weightUnit}</span>
              <span>Goal: {goalWeight} {weightUnit}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Line graph */}
      <Card style={{ marginBottom:14 }}>
        <div style={{ fontWeight:600, fontSize:14, color:C.text, marginBottom:14 }}>Progress Trend</div>
        <LineChart/>
        {entries.length > 0 && (
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:10 }}>
            {[
              { label:'Entries', val:entries.length },
              { label:'Lowest',  val: entries.length ? Math.min(...entries.map(e=>e.w)) + ' ' + weightUnit : '—' },
              { label:'Highest', val: entries.length ? Math.max(...entries.map(e=>e.w)) + ' ' + weightUnit : '—' },
            ].map(s => (
              <div key={s.label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{s.val}</div>
                <div style={{ fontSize:11, color:C.muted }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Log entry */}
      <Card style={{ marginBottom:14 }}>
        <div style={{ fontWeight:600, fontSize:14, marginBottom:12 }}>Log Today's Weight</div>
        <div style={{ display:'flex', gap:10 }}>
          <Input placeholder={`e.g. 162 ${weightUnit}`} type="number" value={weight} onChange={e=>setWeight(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&logWeight()} style={{ flex:1 }}/>
          <Btn onClick={logWeight} style={{ whiteSpace:'nowrap' }}><Check size={14}/> Log</Btn>
        </div>
        <div style={{ fontSize:12, color:C.muted, marginTop:8, fontStyle:'italic' }}>
          "Honor God with your body." — 1 Corinthians 6:20 💛
        </div>
      </Card>

      {/* Goal weight */}
      <Card style={{ marginBottom:14 }}>
        <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>
          {goalWeight ? `Goal Weight: ${goalWeight} ${weightUnit}` : 'Set a Goal Weight'}
        </div>
        <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>
          {goalWeight ? 'Update your goal anytime.' : 'Optional — this adds a goal line to your progress chart.'}
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <Input placeholder={goalWeight ? `Current: ${goalWeight}` : `e.g. 145 ${weightUnit}`} type="number"
            value={goalWeightInput} onChange={e=>setGoalWeightInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&saveGoalWeight()} style={{ flex:1 }}/>
          <Btn onClick={saveGoalWeight} variant="secondary" style={{ whiteSpace:'nowrap' }}>Set Goal</Btn>
        </div>
      </Card>

      {/* History */}
      {entries.length > 0 && (
        <Card>
          <div style={{ fontWeight:600, fontSize:14, marginBottom:12 }}>History</div>
          {entries.slice(0, 20).map((e, i) => {
            const prev = entries[i+1];
            const diff = prev ? (e.w - prev.w).toFixed(1) : null;
            return (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:i<Math.min(entries.length,20)-1?`1px solid ${C.border}`:'none' }}>
                <div>
                  <div style={{ fontSize:13, color:C.muted }}>{e.date === getTodayKey() ? 'Today' : e.date}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  {diff !== null && (
                    <span style={{ fontSize:11, color: parseFloat(diff) < 0 ? C.success : parseFloat(diff) > 0 ? '#F97316' : C.muted, fontWeight:600 }}>
                      {parseFloat(diff) < 0 ? `↓${Math.abs(diff)}` : parseFloat(diff) > 0 ? `↑${diff}` : '–'}
                    </span>
                  )}
                  <span style={{ fontSize:15, fontWeight:700, color:C.text }}>{e.w} <span style={{ fontSize:11, fontWeight:400, color:C.muted }}>{weightUnit}</span></span>
                  <button onClick={()=>setEntries(p=>p.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, padding:'0 2px', display:'flex' }}>
                    <X size={12}/>
                  </button>
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}

// ─── MOVEMENT LOGGER ─────────────────────────────────────────────────────────
function ActivityHeatmap({ weightEntries=[], moveEntries=[] }) {
  const today = new Date();
  const days = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const moved = moveEntries.some(e => e.date === key);
    const weighed = weightEntries.some(e => e.date === key);
    days.push({ key, moved, weighed, dow: d.getDay() });
  }
  const weeks = [];
  let week = [];
  for (let i = 0; i < days[0].dow; i++) week.push(null);
  days.forEach(d => { week.push(d); if (week.length === 7) { weeks.push(week); week = []; } });
  if (week.length) { while (week.length < 7) week.push(null); weeks.push(week); }
  const totalMoved = days.filter(d => d.moved).length;
  const streak = (() => { let s=0; for(let i=days.length-1;i>=0;i--){if(days[i].moved)s++;else break;} return s; })();
  return (
    <Card style={{ marginBottom:14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <div style={{ fontWeight:600, fontSize:14, color:C.text }}>90-Day Activity</div>
        <div style={{ fontSize:10, color:C.muted, display:'flex', gap:10 }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, borderRadius:2, background:C.primary, display:'inline-block' }}/> Movement</span>
          <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, borderRadius:2, background:C.accent+'99', display:'inline-block' }}/> Weight</span>
        </div>
      </div>
      <div style={{ overflowX:'auto', paddingBottom:4 }}>
        <div style={{ display:'flex', gap:3, minWidth:'fit-content' }}>
          {weeks.map((wk, wi) => (
            <div key={wi} style={{ display:'flex', flexDirection:'column', gap:3 }}>
              {wk.map((d, di) => (
                <div key={di} style={{ width:12, height:12, borderRadius:3, background: !d?'transparent': d.moved&&d.weighed?C.primary: d.moved?C.primary+'CC': d.weighed?C.accent+'88': C.border, flexShrink:0 }}/>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', gap:18, marginTop:12 }}>
        {[{l:'Days active',v:totalMoved,c:C.primary},{l:'Current streak',v:streak,c:C.accent},{l:'Consistency',v:Math.round((totalMoved/90)*100)+'%',c:'#3D6B33'}].map(s=>(
          <div key={s.l} style={{ textAlign:'center' }}>
            <div style={{ fontSize:20, fontWeight:800, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:10, color:C.muted }}>{s.l}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MovementLogger({ onBack, entries, setEntries, weightEntries=[] }) {
  const [open, setOpen] = useState(false);
  const [ne, setNe] = useState({type:'',duration:'',intensity:'moderate'});
  const icons = {Walk:'🚶',Run:'🏃',Yoga:'🧘','Strength Training':'🏋️',Cycling:'🚴',Swimming:'🏊',Dance:'💃',Pilates:'🤸',Hiking:'⛰️',Other:'⚡'};

  const todayKey = getTodayKey();
  const todayEntries = entries.filter(e => e.date === todayKey);
  const totalMinToday = todayEntries.reduce((s,e) => s+(e.duration||0), 0);
  const allTimeMins = entries.reduce((s,e) => s+(e.duration||0), 0);

  const weeklyMins = (() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate()-i);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const mins = entries.filter(e=>e.date===key).reduce((s,e)=>s+(e.duration||0),0);
      days.push({ mins, label:['S','M','T','W','T','F','S'][d.getDay()] });
    }
    return days;
  })();
  const maxMins = Math.max(...weeklyMins.map(d=>d.mins), 30);

  const add = () => {
    if (!ne.type || !ne.duration) return;
    setEntries(p=>[{id:Date.now(), type:ne.type, duration:parseInt(ne.duration), intensity:ne.intensity, date:getTodayKey()}, ...p]);
    setNe({type:'',duration:'',intensity:'moderate'});
    setOpen(false);
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
        <BackBtn onClick={onBack}/>
        <div className="serif" style={{ fontSize:24, fontWeight:700 }}>Movement Log</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:14 }}>
        {[
          {label:'Today',val:totalMinToday,unit:'min',color:C.primary,emoji:'⏱'},
          {label:'Sessions',val:todayEntries.length,unit:'today',color:'#3D6B33',emoji:'✅'},
          {label:'All Time',val:allTimeMins>=60?`${Math.floor(allTimeMins/60)}h`:allTimeMins+'m',unit:'moved',color:C.accent,emoji:'🏆'},
        ].map(s=>(
          <div key={s.label} style={{ background:C.bgAlt, borderRadius:14, padding:'12px 10px', textAlign:'center' }}>
            <div style={{ fontSize:18, marginBottom:4 }}>{s.emoji}</div>
            <div style={{ fontSize:18, fontWeight:800, color:s.color, lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:10, color:C.muted, marginTop:3 }}>{s.unit}</div>
          </div>
        ))}
      </div>

      <Card style={{ marginBottom:14 }}>
        <div style={{ fontWeight:600, fontSize:14, color:C.text, marginBottom:14 }}>This Week</div>
        <div style={{ display:'flex', gap:6, alignItems:'flex-end', height:60 }}>
          {weeklyMins.map((d,i) => (
            <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
              <div style={{ width:'100%', borderRadius:'4px 4px 0 0', background:d.mins>0?C.primary:`${C.primary}20`, height:`${Math.max(4,(d.mins/maxMins)*50)}px`, transition:'height .4s' }}/>
              <div style={{ fontSize:9, color:C.muted, fontWeight:600 }}>{d.label}</div>
              {d.mins>0&&<div style={{ fontSize:8, color:C.primary, fontWeight:700 }}>{d.mins}m</div>}
            </div>
          ))}
        </div>
      </Card>

      <ActivityHeatmap weightEntries={weightEntries} moveEntries={entries}/>

      {todayEntries.length > 0 && (
        <Card style={{ marginBottom:14 }}>
          <div style={{ fontWeight:600, fontSize:14, color:C.text, marginBottom:12 }}>Today</div>
          {todayEntries.map(e=>(
            <div key={e.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ fontSize:24 }}>{icons[e.type]||'⚡'}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14, color:C.text }}>{e.type}</div>
                <div style={{ fontSize:12, color:C.muted }}>{e.duration} min · {e.intensity||'moderate'} intensity</div>
              </div>
              <button onClick={()=>setEntries(p=>p.filter(x=>x.id!==e.id))} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, padding:4, display:'flex' }}><X size={13}/></button>
            </div>
          ))}
        </Card>
      )}

      {todayEntries.length===0 && (
        <div style={{ textAlign:'center', padding:'24px 0 16px', color:C.muted, fontSize:13, fontStyle:'italic' }}>Nothing logged yet. Every step counts! 🏃‍♀️</div>
      )}

      <Btn full onClick={()=>setOpen(true)}><Plus size={15}/> Log Movement</Btn>

      <Modal open={open} onClose={()=>setOpen(false)} title="Log Movement">
        <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:C.text, display:'block', marginBottom:10 }}>Activity Type</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {Object.entries(icons).map(([type,emoji])=>(
                <div key={type} onClick={()=>setNe(p=>({...p,type}))}
                  style={{ padding:'8px 13px', borderRadius:99, border:`1.5px solid ${ne.type===type?C.primary:C.border}`, background:ne.type===type?`${C.primary}10`:C.white, cursor:'pointer', fontSize:13, fontWeight:500, color:ne.type===type?C.primary:C.text, transition:'all .15s', display:'flex', alignItems:'center', gap:5 }}>
                  <span>{emoji}</span><span>{type}</span>
                </div>
              ))}
            </div>
          </div>
          <Input label="Duration (minutes)" type="number" placeholder="e.g. 30" value={ne.duration} onChange={e=>setNe(p=>({...p,duration:e.target.value}))}/>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:C.text, display:'block', marginBottom:8 }}>Intensity</label>
            <div style={{ display:'flex', gap:8 }}>
              {[['Low','😌'],['Moderate','💪'],['High','🔥']].map(([level,emoji])=>(
                <div key={level} onClick={()=>setNe(p=>({...p,intensity:level.toLowerCase()}))}
                  style={{ flex:1, padding:'9px 0', borderRadius:10, border:`1.5px solid ${ne.intensity===level.toLowerCase()?C.primary:C.border}`, background:ne.intensity===level.toLowerCase()?`${C.primary}10`:C.white, textAlign:'center', cursor:'pointer', fontSize:12, fontWeight:600, color:ne.intensity===level.toLowerCase()?C.primary:C.muted, transition:'all .15s' }}>
                  {emoji} {level}
                </div>
              ))}
            </div>
          </div>
          <Btn full onClick={add} style={{ opacity:ne.type&&ne.duration?1:0.6 }}>Log It! 🏃‍♀️</Btn>
        </div>
      </Modal>
    </div>
  );
}
// ─── PREMIUM GATE ─────────────────────────────────────────────────────────────
function PremiumGate({ feature, onUpgrade }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'40px 20px' }}>
      <div style={{ width:64, height:64, borderRadius:18, background:`linear-gradient(135deg, ${C.primary}20, ${C.accent}20)`, border:`1.5px solid ${C.accent}50`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, fontSize:28 }}>✨</div>
      <div className="serif" style={{ fontSize:24, fontWeight:700, color:C.text, marginBottom:8 }}>Premium Feature</div>
      <div style={{ fontSize:14, color:C.muted, lineHeight:1.7, marginBottom:24, maxWidth:300 }}>
        <strong style={{ color:C.text }}>{feature}</strong> is included in Premium. Upgrade to unlock full macro tracking, meal planning, guided programs, accountability circles, and unlimited Sage AI.
      </div>
      <Btn full onClick={onUpgrade} style={{ background:C.accent, color:C.text, border:'none', maxWidth:280, marginBottom:10 }}>
        Start 7-Day Free Trial ✨
      </Btn>
      <div style={{ fontSize:12, color:C.muted }}>$9.99/month · Cancel anytime</div>
    </div>
  );
}

// ─── MEAL PLANNER ─────────────────────────────────────────────────────────────
const MEAL_PLANS = [
  {
    day: 'Monday', meals: {
      breakfast: {
        name:'Overnight Oats with Berries', cal:320, protein:14, carbs:52, fat:8,
        time:'8:00 AM', prep:'5 min + overnight', emoji:'🫐',
        ingredients:['½ cup rolled oats','1 cup unsweetened almond milk','1 tbsp chia seeds','1 tsp honey or maple syrup','½ cup mixed berries (fresh or frozen)','Pinch of cinnamon'],
        steps:['The night before, combine oats, almond milk, chia seeds, and honey in a jar or container.','Stir well until everything is mixed. Add a pinch of cinnamon.','Cover and refrigerate overnight (at least 6 hours).','In the morning, top with mixed berries.','Optional: add a spoonful of nut butter for extra protein.'],
      },
      lunch: {
        name:'Grilled Chicken Power Bowl', cal:490, protein:42, carbs:44, fat:12,
        time:'1:00 PM', prep:'25 min', emoji:'🥗',
        ingredients:['4 oz chicken breast','½ cup quinoa (dry)','1 cup broccoli florets','½ red bell pepper, sliced','2 tbsp tahini','1 lemon, juiced','1 clove garlic, minced','Salt, pepper, olive oil'],
        steps:['Cook quinoa according to package directions (1 cup water per ½ cup quinoa, 15 min).','Season chicken with salt, pepper, and a drizzle of olive oil. Grill or pan-sear 5-6 min per side until cooked through.','Toss broccoli and peppers with olive oil, salt. Roast at 425°F for 15 min, or sauté in a pan.','Make tahini dressing: whisk together tahini, lemon juice, garlic, 2 tbsp water, and a pinch of salt.','Assemble bowl: quinoa base, sliced chicken, roasted veggies, drizzle of dressing.'],
      },
      snack: {
        name:'Apple + Almond Butter', cal:195, protein:4, carbs:26, fat:9,
        time:'3:30 PM', prep:'2 min', emoji:'🍎',
        ingredients:['1 medium apple','1 tbsp almond butter','Optional: pinch of cinnamon'],
        steps:['Slice apple into wedges.','Spread or serve almond butter alongside for dipping.','Sprinkle with cinnamon if desired.'],
      },
      dinner: {
        name:'Baked Salmon & Asparagus', cal:380, protein:42, carbs:12, fat:16,
        time:'6:30 PM', prep:'25 min', emoji:'🐟',
        ingredients:['4 oz salmon fillet','1 cup asparagus, trimmed','2 cloves garlic, minced','1 lemon','2 tsp olive oil','Salt, pepper, fresh dill'],
        steps:['Preheat oven to 400°F. Line a baking sheet with parchment paper.','Place salmon and asparagus on the sheet. Drizzle everything with olive oil.','Top salmon with minced garlic and lemon slices. Season generously with salt, pepper, and dill.','Bake 16-18 minutes until salmon flakes easily with a fork.','Squeeze fresh lemon over everything before serving.'],
      },
    }
  },
  {
    day: 'Tuesday', meals: {
      breakfast: {
        name:'Greek Yogurt Parfait', cal:285, protein:18, carbs:36, fat:7,
        time:'8:00 AM', prep:'5 min', emoji:'🍓',
        ingredients:['1 cup plain Greek yogurt (0%)','½ cup low-sugar granola','½ cup fresh strawberries, sliced','1 tsp honey','Optional: fresh mint'],
        steps:['Spoon yogurt into a bowl or glass.','Layer half the granola over the yogurt.','Add sliced strawberries on top.','Layer remaining granola.','Drizzle with honey and garnish with fresh mint if desired.'],
      },
      lunch: {
        name:'Turkey & Avocado Wrap', cal:420, protein:32, carbs:38, fat:15,
        time:'1:00 PM', prep:'10 min', emoji:'🌯',
        ingredients:['1 large whole wheat tortilla','4 oz sliced turkey deli meat','½ ripe avocado','1 cup fresh spinach','2 slices tomato','1 tsp Dijon mustard','Salt, pepper'],
        steps:['Lay tortilla flat on a clean surface.','Spread Dijon mustard across the center.','Layer spinach leaves, turkey slices, and tomato.','Slice avocado and fan slices over the filling. Season with salt and pepper.','Fold in the sides of the tortilla, then roll tightly from bottom to top.','Slice in half diagonally and serve.'],
      },
      snack: {
        name:'Carrots & Hummus', cal:110, protein:4, carbs:16, fat:4,
        time:'3:30 PM', prep:'2 min', emoji:'🥕',
        ingredients:['1 cup baby carrots','3 tbsp hummus (store-bought or homemade)'],
        steps:['Portion carrots into a bowl.','Serve hummus alongside for dipping.','Tip: Pair with celery or cucumber for extra crunch.'],
      },
      dinner: {
        name:'Lentil Vegetable Soup', cal:340, protein:18, carbs:52, fat:6,
        time:'6:30 PM', prep:'40 min', emoji:'🍲',
        ingredients:['1 cup green lentils, rinsed','2 carrots, diced','2 celery stalks, diced','1 medium onion, diced','3 cloves garlic, minced','1 can (14 oz) diced tomatoes','4 cups vegetable broth','1 tsp cumin','½ tsp smoked paprika','Olive oil, salt, pepper, fresh parsley'],
        steps:['Heat 1 tbsp olive oil in a large pot over medium heat.','Sauté onion, carrots, and celery for 5-6 minutes until softened.','Add garlic, cumin, and paprika. Cook 1 more minute, stirring constantly.','Add lentils, diced tomatoes, and vegetable broth. Bring to a boil.','Reduce heat and simmer for 25-30 minutes until lentils are tender.','Season with salt and pepper. Ladle into bowls and top with fresh parsley.'],
      },
    }
  },
  {
    day: 'Wednesday', meals: {
      breakfast: {
        name:'Veggie Egg Scramble', cal:310, protein:22, carbs:14, fat:18,
        time:'8:00 AM', prep:'15 min', emoji:'🥚',
        ingredients:['3 large eggs','1 cup fresh spinach','½ red bell pepper, diced','¼ yellow onion, diced','½ cup mushrooms, sliced','1 tsp olive oil','Salt, pepper, garlic powder, Italian herbs'],
        steps:['Heat olive oil in a non-stick pan over medium heat.','Sauté onion and bell pepper for 3 minutes until they begin to soften.','Add mushrooms and cook 2 more minutes.','Add spinach and stir until wilted, about 1 minute.','Beat eggs in a bowl with salt, pepper, and garlic powder. Pour over the vegetables.','Gently fold and scramble until eggs are just set. Serve immediately.'],
      },
      lunch: {
        name:'Quinoa Buddha Bowl', cal:460, protein:16, carbs:62, fat:16,
        time:'1:00 PM', prep:'30 min', emoji:'🥙',
        ingredients:['1 cup cooked quinoa','½ sweet potato, cubed','½ cup canned chickpeas, drained','½ cucumber, sliced','½ cup cherry tomatoes','2 tbsp tahini','1 lemon, juiced','1 tsp olive oil','Cumin, salt, pepper'],
        steps:['Preheat oven to 425°F. Toss sweet potato cubes and chickpeas with olive oil, cumin, salt, and pepper.','Spread on a baking sheet and roast 20-25 minutes, flipping halfway through.','Make lemon-herb tahini: whisk tahini, lemon juice, 2 tbsp water, a pinch of salt.','Arrange quinoa in a bowl. Add roasted sweet potato and chickpeas.','Top with cucumber and cherry tomatoes.','Drizzle generously with tahini dressing.'],
      },
      snack: {
        name:'Trail Mix', cal:160, protein:5, carbs:16, fat:9,
        time:'3:30 PM', prep:'2 min', emoji:'🥜',
        ingredients:['2 tbsp raw almonds','2 tbsp walnuts','1 tbsp dark chocolate chips','1 tbsp dried cranberries'],
        steps:['Combine all ingredients in a small bowl or snack bag.','Store in an airtight container — this recipe makes a great batch snack for the week.'],
      },
      dinner: {
        name:'Shrimp Stir-Fry over Brown Rice', cal:380, protein:32, carbs:36, fat:10,
        time:'6:30 PM', prep:'20 min', emoji:'🍤',
        ingredients:['6 oz raw shrimp, peeled and deveined','1 cup broccoli florets','1 cup snap peas','1 carrot, julienned','3 cloves garlic, minced','1 tbsp fresh ginger, grated','2 tbsp low-sodium soy sauce','1 tsp sesame oil','1 tsp cornstarch','1 cup cooked brown rice'],
        steps:['Cook brown rice according to package directions.','Mix soy sauce, sesame oil, and cornstarch in a small bowl to make the sauce. Set aside.','Heat a wok or large skillet over high heat. Add a splash of oil.','Stir-fry garlic and ginger for 30 seconds until fragrant.','Add shrimp and cook 2-3 minutes until pink. Remove from pan.','Add broccoli, snap peas, and carrots. Stir-fry 3-4 minutes until tender-crisp.','Return shrimp to pan, pour sauce over everything. Toss to coat. Cook 1 minute.','Serve over brown rice.'],
      },
    }
  },
  {
    day: 'Thursday', meals: {
      breakfast: {
        name:'Banana Protein Smoothie', cal:340, protein:28, carbs:42, fat:6,
        time:'8:00 AM', prep:'5 min', emoji:'🍌',
        ingredients:['1 ripe banana (frozen works great)','1 scoop vanilla protein powder','1 cup unsweetened almond milk','1 tbsp peanut butter','1 large handful spinach','½ tsp cinnamon','3-4 ice cubes'],
        steps:['Add all ingredients to a blender.','Blend on high for 30-45 seconds until completely smooth.','Taste and adjust — add a drop of honey if you prefer sweeter.','Pour into a glass and drink immediately.','Tip: Freeze banana slices ahead of time for a thicker, colder smoothie.'],
      },
      lunch: {
        name:'Tuna Salad Lettuce Wraps', cal:290, protein:30, carbs:12, fat:12,
        time:'1:00 PM', prep:'10 min', emoji:'🥬',
        ingredients:['2 cans (5 oz each) tuna in water, drained','3 tbsp plain Greek yogurt','2 celery stalks, finely diced','2 tbsp red onion, minced','1 tbsp lemon juice','Salt, pepper, dill','6 large romaine lettuce leaves'],
        steps:['Drain tuna thoroughly and place in a mixing bowl.','Add Greek yogurt, celery, red onion, and lemon juice.','Season generously with salt, pepper, and dried dill. Stir to combine.','Taste and adjust seasoning.','Spoon tuna mixture into romaine lettuce leaves.','Serve immediately, 2-3 lettuce wraps per serving.'],
      },
      snack: {
        name:'Cottage Cheese & Peaches', cal:170, protein:15, carbs:20, fat:2,
        time:'3:30 PM', prep:'3 min', emoji:'🍑',
        ingredients:['½ cup low-fat cottage cheese','1 medium peach, sliced','Pinch of cinnamon'],
        steps:['Scoop cottage cheese into a bowl.','Slice peach and arrange on top.','Sprinkle with cinnamon.'],
      },
      dinner: {
        name:'Chicken Fajita Bowl', cal:480, protein:40, carbs:44, fat:14,
        time:'6:30 PM', prep:'25 min', emoji:'🌶️',
        ingredients:['4 oz chicken breast, sliced into strips','1 red bell pepper, sliced','1 green bell pepper, sliced','½ yellow onion, sliced','1 tbsp fajita seasoning','1 cup cooked brown rice','¼ cup salsa','2 tbsp plain Greek yogurt (as sour cream substitute)','Fresh cilantro, lime'],
        steps:['Toss chicken strips with fajita seasoning. Let sit 5 minutes.','Heat a cast iron or skillet over high heat with a bit of oil.','Cook chicken strips 3-4 minutes per side until cooked through. Remove from pan.','In the same pan, sauté peppers and onions 4-5 minutes until softened and slightly charred.','Assemble bowl: rice, chicken, peppers and onions.','Top with salsa and a dollop of Greek yogurt. Squeeze fresh lime over everything.','Garnish with cilantro.'],
      },
    }
  },
  {
    day: 'Friday', meals: {
      breakfast: {
        name:'Whole Grain Waffles with Greek Yogurt', cal:360, protein:12, carbs:54, fat:10,
        time:'8:00 AM', prep:'20 min', emoji:'🧇',
        ingredients:['2 whole grain waffles (frozen or homemade)','½ cup plain Greek yogurt','½ cup fresh mixed berries','1 tsp honey','1 tsp vanilla extract (stir into yogurt)'],
        steps:['Toast waffles according to package directions, or make fresh if using a waffle maker.','While waffles toast, stir vanilla extract into Greek yogurt.','Place waffles on a plate. Spoon Greek yogurt on top.','Add fresh berries over the yogurt.','Drizzle with honey.','Tip: The yogurt acts as a high-protein whipped cream — much more nourishing!'],
      },
      lunch: {
        name:'Mediterranean Salad', cal:380, protein:14, carbs:32, fat:22,
        time:'1:00 PM', prep:'15 min', emoji:'🫒',
        ingredients:['3 cups mixed greens or romaine','½ cucumber, diced','1 cup cherry tomatoes, halved','¼ red onion, thinly sliced','¼ cup kalamata olives','⅓ cup canned chickpeas, drained','3 tbsp crumbled feta cheese','2 tbsp olive oil','1 lemon, juiced','1 tsp oregano','Salt, pepper'],
        steps:['Combine all salad ingredients in a large bowl: greens, cucumber, tomatoes, onion, olives, chickpeas, and feta.','In a small bowl, whisk together olive oil, lemon juice, oregano, salt, and pepper.','Pour dressing over salad just before serving.','Toss gently to coat everything evenly.','Serve immediately.'],
      },
      snack: {
        name:'Rice Cakes & Avocado', cal:180, protein:3, carbs:22, fat:10,
        time:'3:30 PM', prep:'5 min', emoji:'🥑',
        ingredients:['2 plain rice cakes','¼ ripe avocado','Pinch of sea salt','Red pepper flakes','Optional: squeeze of lemon'],
        steps:['Slice or scoop avocado and place on rice cakes.','Mash slightly with a fork.','Sprinkle with sea salt and red pepper flakes.','Add a squeeze of lemon if desired.'],
      },
      dinner: {
        name:'Turkey Meatballs & Zucchini Noodles', cal:410, protein:38, carbs:24, fat:16,
        time:'6:30 PM', prep:'35 min', emoji:'🍝',
        ingredients:['12 oz ground turkey','1 egg','⅓ cup breadcrumbs (whole wheat)','2 cloves garlic, minced','1 tbsp Italian herbs','Salt, pepper','2 medium zucchini','1½ cups marinara sauce (low sugar)','2 tbsp Parmesan cheese'],
        steps:['Mix ground turkey, egg, breadcrumbs, garlic, herbs, salt, and pepper. Form into 12 meatballs.','Heat oven to 400°F. Place meatballs on a parchment-lined baking sheet.','Bake 18-20 minutes until cooked through and lightly browned.','While meatballs bake, use a spiralizer or vegetable peeler to make zucchini noodles.','Heat marinara in a skillet over medium heat. Add cooked meatballs.','In a separate pan, sauté zucchini noodles with a drizzle of olive oil for 2-3 minutes (they cook quickly!).','Serve meatballs and sauce over zucchini noodles. Top with Parmesan.'],
      },
    }
  },
  {
    day: 'Saturday', meals: {
      breakfast: {
        name:'Saturday Morning Shakshuka', cal:340, protein:22, carbs:24, fat:18,
        time:'9:00 AM', prep:'25 min', emoji:'🍳',
        ingredients:['4 large eggs','1 can (14 oz) crushed tomatoes','1 red bell pepper, diced','1 medium onion, diced','3 cloves garlic, minced','1 tsp cumin','1 tsp paprika','½ tsp chili flakes','2 tbsp olive oil','Salt, pepper','Fresh parsley or cilantro','Optional: crumbled feta'],
        steps:['Heat olive oil in a wide skillet over medium heat.','Sauté onion and bell pepper for 5-6 minutes until softened.','Add garlic, cumin, paprika, and chili flakes. Stir and cook 1 minute.','Pour in crushed tomatoes. Season with salt and pepper. Simmer 8-10 minutes until slightly thickened.','Make 4 small wells in the tomato sauce. Crack one egg into each well.','Cover the skillet and cook 5-7 minutes until whites are set but yolks are still slightly runny.','Garnish with fresh parsley and optional feta. Serve directly from the skillet with whole grain toast.'],
      },
      lunch: {
        name:'Grilled Chicken & Roasted Veggie Bowls', cal:460, protein:40, carbs:38, fat:14,
        time:'12:30 PM', prep:'30 min', emoji:'🥘',
        ingredients:['4 oz chicken breast','1 cup sweet potato, cubed','1 cup broccoli florets','½ red onion, sliced','½ cup cooked farro or barley','2 tbsp olive oil','1 tsp garlic powder','1 tsp smoked paprika','Salt, pepper','Lemon tahini drizzle: 2 tbsp tahini, juice of 1 lemon, 2 tbsp water, pinch of salt'],
        steps:['Preheat oven to 425°F. Toss sweet potato, broccoli, and onion with 1 tbsp olive oil, garlic powder, paprika, salt, and pepper. Roast 22-25 min.','Rub chicken with remaining olive oil, salt, pepper, and paprika. Grill or pan-sear 5-6 min per side.','Whisk together lemon tahini ingredients until smooth.','Build your bowl: farro base, sliced chicken, roasted vegetables.','Drizzle generously with lemon tahini.'],
      },
      snack: {
        name:'Dark Chocolate & Almond Butter Bites', cal:200, protein:5, carbs:18, fat:13,
        time:'3:30 PM', prep:'5 min', emoji:'🍫',
        ingredients:['1 oz dark chocolate (70%+)','1 tbsp almond butter','5 whole almonds','Optional: sprinkle of sea salt'],
        steps:['Break dark chocolate into pieces.','Serve alongside almond butter for dipping.','Add almonds for extra crunch and protein.','A small sprinkle of sea salt brings out the chocolate flavor beautifully.','Tip: This is an intentional, grace-centered treat — enjoy it slowly and mindfully!'],
      },
      dinner: {
        name:'Herb-Roasted Chicken Thighs with Root Vegetables', cal:490, protein:44, carbs:30, fat:20,
        time:'6:30 PM', prep:'45 min', emoji:'🍗',
        ingredients:['4 bone-in, skin-on chicken thighs (or skinless to reduce fat)','3 medium carrots, cut into chunks','2 medium parsnips, cubed','1 large sweet potato, cubed','1 whole head of garlic, halved crosswise','3 tbsp olive oil','1 tbsp fresh rosemary, chopped','1 tbsp fresh thyme','Salt, pepper, lemon zest'],
        steps:['Preheat oven to 425°F. Pat chicken dry — this is key for crispy skin.','Toss vegetables and garlic with 2 tbsp olive oil, rosemary, thyme, salt, and pepper. Spread in a roasting pan.','Rub chicken with remaining oil, lemon zest, salt, and pepper. Place on top of vegetables.','Roast 38-42 minutes until chicken skin is golden and internal temperature reaches 165°F.','Rest 5 minutes before serving. Squeeze the roasted garlic out of its skin over everything — it\'s sweet and incredible.','Tip: This is a wonderful Saturday dinner to make while spending time with family. The aroma alone fills the home with warmth.'],
      },
    }
  },
  {
    day: 'Sunday', meals: {
      breakfast: {
        name:'Sunday Scripture Pancakes', cal:380, protein:14, carbs:60, fat:10,
        time:'9:30 AM', prep:'25 min', emoji:'🥞',
        ingredients:['1 cup whole wheat flour','1 tsp baking powder','½ tsp baking soda','1 tbsp honey','1 egg','1 cup buttermilk (or milk + 1 tsp vinegar, rested 5 min)','1 tbsp coconut oil, melted','½ tsp vanilla extract','Pinch of cinnamon','Toppings: fresh berries, a drizzle of honey, and a dollop of Greek yogurt'],
        steps:['Whisk together flour, baking powder, baking soda, and cinnamon in a bowl.','In a separate bowl, whisk egg, buttermilk, honey, oil, and vanilla.','Pour wet ingredients into dry. Stir gently — lumps are fine! Overmixing makes pancakes tough.','Heat a non-stick pan over medium-low heat. Lightly grease with coconut oil.','Pour ¼ cup batter per pancake. Cook until bubbles form on top (2-3 min), then flip and cook 1-2 min more.','Serve warm with berries, a drizzle of honey, and Greek yogurt.','Sabbath tip: Make these slowly, enjoy the process, eat together as a family. Rest and nourishment go hand in hand.'],
      },
      lunch: {
        name:'Sunday Leftover Grain Bowl', cal:410, protein:18, carbs:58, fat:14,
        time:'12:30 PM', prep:'10 min', emoji:'🥗',
        ingredients:['1 cup any cooked grain (rice, quinoa, farro — use what you have)','1 cup roasted vegetables (use leftovers from the week)','½ cup canned chickpeas or lentils, drained','Handful of fresh greens','2 tbsp hummus or tahini','1 lemon, juiced','1 tbsp olive oil','Salt, pepper, fresh herbs'],
        steps:['This is a grace-based meal — there are no rules, only nourishment!','Layer your grains in a bowl.','Add whatever roasted vegetables you have on hand.','Top with chickpeas or lentils for protein.','Add a handful of fresh greens.','Drizzle with olive oil and lemon juice. Add a generous dollop of hummus.','Season to taste and enjoy the simplicity of using what you already have.','This practice of using what you have is its own spiritual act — gratitude and stewardship together.'],
      },
      snack: {
        name:'Sliced Apple with Cottage Cheese', cal:175, protein:14, carbs:24, fat:2,
        time:'3:00 PM', prep:'3 min', emoji:'🍎',
        ingredients:['1 medium apple, sliced','½ cup low-fat cottage cheese','Pinch of cinnamon','Optional: drizzle of honey'],
        steps:['Slice apple into wedges.','Spoon cottage cheese into a small bowl alongside.','Sprinkle cinnamon over the cottage cheese.','Drizzle with honey if desired.','A perfect Sunday afternoon snack — light enough to not spoil dinner, nourishing enough to hold you.'],
      },
      dinner: {
        name:'Sunday Soul Soup — Lemon Chicken & White Bean', cal:400, protein:36, carbs:38, fat:10,
        time:'5:30 PM', prep:'40 min', emoji:'🍲',
        ingredients:['1 lb chicken breast or thighs, cut into bite-sized pieces','2 cans (15 oz) white beans (cannellini), drained and rinsed','3 cups baby spinach','4 cloves garlic, minced','1 medium onion, diced','2 carrots, diced','2 celery stalks, diced','5 cups low-sodium chicken broth','1 lemon, juiced and zested','1 tsp Italian herbs','2 tbsp olive oil','Salt, pepper','Fresh parsley for serving'],
        steps:['Heat olive oil in a large pot over medium heat.','Sauté onion, carrots, and celery for 5-6 minutes until softened.','Add garlic and herbs. Cook 1 minute, stirring constantly.','Add chicken pieces. Brown lightly for 3-4 minutes.','Pour in broth. Bring to a boil, then reduce to a simmer. Cook 15 minutes until chicken is cooked through.','Add white beans and cook 5 more minutes.','Stir in spinach, lemon juice, and lemon zest. Season generously with salt and pepper.','Ladle into bowls and top with fresh parsley.','Sunday gift: Make a double batch — Monday\'s lunch is already done. That\'s stewarding your time with grace.'],
      },
    }
  },
];

function MealPlanner({ user, onUpgrade, setFoodItems }) {
  const isPremium = user?.plan === 'premium';
  const [selectedDay, setSelectedDay] = useState((() => {
    const d = new Date().getDay(); // 0=Sun,1=Mon,...,6=Sat
    // Map JS day (0=Sun) to MEAL_PLANS index (0=Mon...4=Fri,5=Sat,6=Sun)
    return d === 0 ? 6 : d - 1;
  })());
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [recipeView, setRecipeView] = useState(null);
  const [addedMeals, setAddedMeals] = useState(new Set());
  const [favorites, setFavorites] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('ff_recipe_favs') || '[]')); } catch { return new Set(); }
  });

  const toggleFav = (key) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      try { localStorage.setItem('ff_recipe_favs', JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  if (!isPremium) return <PremiumGate feature="Meal Planner" onUpgrade={onUpgrade}/>;

  const plan = MEAL_PLANS[selectedDay];
  const dayNames = ['Mon','Tue','Wed','Thu','Fri'];
  const totalCal = Object.values(plan.meals).reduce((s,m) => s+m.cal, 0);

  const addToLog = (mealType, meal) => {
    if (!setFoodItems) return;
    const key = `${selectedDay}-${mealType}`;
    if (addedMeals.has(key)) return;
    setFoodItems(prev => [...prev, {
      id: Date.now(),
      meal: mealType,
      name: meal.name,
      cal: meal.cal,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
    }]);
    setAddedMeals(s => new Set([...s, key]));
  };

  // ── Full recipe view ──
  if (recipeView) {
    const { mealType, meal } = recipeView;
    const key = `${selectedDay}-${mealType}`;
    const favKey = meal.name;
    const alreadyAdded = addedMeals.has(key);
    const isFav = favorites.has(favKey);
    return (
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <BackBtn onClick={()=>setRecipeView(null)}/>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.primary, textTransform:'uppercase', letterSpacing:'.06em' }}>{mealType}</div>
            <div className="serif" style={{ fontSize:20, fontWeight:700 }}>{meal.name}</div>
          </div>
          <button onClick={()=>toggleFav(favKey)} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', fontSize:22, padding:'4px 8px' }}>
            {isFav ? '⭐' : '☆'}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:18 }}>
          {[['Calories', meal.cal, '#F97316'],['Protein', meal.protein+'g', C.primary],['Carbs', meal.carbs+'g', C.accent],['Fat', meal.fat+'g', '#8B5CF6']].map(([l,v,col])=>(
            <div key={l} style={{ background:C.bgAlt, borderRadius:12, padding:'10px 8px', textAlign:'center' }}>
              <div style={{ fontSize:16, fontWeight:800, color:col }}>{v}</div>
              <div style={{ fontSize:10, color:C.muted }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Add to Log button */}
        <div style={{ marginBottom:18 }}>
          {alreadyAdded ? (
            <div style={{ background:`${C.success}16`, border:`1px solid ${C.success}40`, borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
              <CheckCircle size={16} color={C.success}/>
              <span style={{ fontSize:14, fontWeight:600, color:C.success }}>Added to your food log for {mealType}</span>
            </div>
          ) : (
            <Btn full onClick={()=>{ addToLog(mealType, meal); }} style={{ background:C.primary, color:'#fff', border:'none' }}>
              <Plus size={15}/> Add to Food Log as {mealType.charAt(0).toUpperCase()+mealType.slice(1)}
            </Btn>
          )}
        </div>

        <div style={{ display:'flex', gap:12, marginBottom:20 }}>
          <div style={{ background:C.bgAlt, borderRadius:10, padding:'8px 14px', fontSize:12, color:C.muted }}>⏱ {meal.prep}</div>
          <div style={{ background:C.bgAlt, borderRadius:10, padding:'8px 14px', fontSize:12, color:C.muted }}>🕗 {meal.time}</div>
        </div>

        {/* Ingredients */}
        <Card style={{ marginBottom:14 }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:12 }}>🛒 Ingredients</div>
          {meal.ingredients.map((ing, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'7px 0', borderBottom:i<meal.ingredients.length-1?`1px solid ${C.border}`:'none' }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:C.primary, flexShrink:0, marginTop:6 }}/>
              <div style={{ fontSize:14, color:C.text, lineHeight:1.5 }}>{ing}</div>
            </div>
          ))}
        </Card>

        {/* Instructions */}
        <Card>
          <div style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:12 }}>👩‍🍳 How to Make It</div>
          {meal.steps.map((step, i) => (
            <div key={i} style={{ display:'flex', gap:13, padding:'10px 0', borderBottom:i<meal.steps.length-1?`1px solid ${C.border}`:'none', alignItems:'flex-start' }}>
              <div style={{ width:26, height:26, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', flexShrink:0, marginTop:1 }}>{i+1}</div>
              <div style={{ fontSize:14, color:C.text, lineHeight:1.65 }}>{step}</div>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  // ── Plan overview ──
  const [showFavsOnly, setShowFavsOnly] = useState(false);

  // If showing favs, find all meals that are favorited across all days
  const favoriteMeals = [];
  if (showFavsOnly) {
    MEAL_PLANS.forEach((dayPlan, di) => {
      Object.entries(dayPlan.meals).forEach(([mealType, meal]) => {
        if (favorites.has(meal.name)) favoriteMeals.push({ day: dayPlan.day, di, mealType, meal });
      });
    });
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
        <div className="serif" style={{ fontSize:24, fontWeight:700 }}>Meal Planner</div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:`${C.accent}22`, borderRadius:99, padding:'3px 10px', fontSize:10, fontWeight:700, color:C.accent, marginLeft:'auto' }}>✨ Premium</div>
      </div>

      {/* Favorites / Week toggle */}
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        <div onClick={()=>setShowFavsOnly(false)}
          style={{ padding:'7px 16px', borderRadius:99, background:!showFavsOnly?C.primary:C.bgAlt, color:!showFavsOnly?C.white:C.muted, fontSize:12, fontWeight:600, cursor:'pointer', transition:'all .15s' }}>
          Weekly Plan
        </div>
        <div onClick={()=>setShowFavsOnly(true)}
          style={{ padding:'7px 16px', borderRadius:99, background:showFavsOnly?C.primary:C.bgAlt, color:showFavsOnly?C.white:C.muted, fontSize:12, fontWeight:600, cursor:'pointer', transition:'all .15s', display:'flex', alignItems:'center', gap:5 }}>
          ⭐ Saved{favorites.size > 0 ? ` (${favorites.size})` : ''}
        </div>
      </div>

      {/* Favorites view */}
      {showFavsOnly && (
        <div>
          {favoriteMeals.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px 20px' }}>
              <div style={{ fontSize:32, marginBottom:10 }}>☆</div>
              <div style={{ fontSize:14, color:C.muted, lineHeight:1.65 }}>No saved recipes yet. Tap the ☆ on any recipe to save it here for quick access.</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {favoriteMeals.map(({ day, di, mealType, meal }) => (
                <Card key={`${di}-${mealType}`} hover pad={14} onClick={()=>setRecipeView({ mealType, meal })}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ fontSize:22 }}>{meal.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:C.primary, textTransform:'uppercase' }}>{day} · {mealType}</div>
                      <div style={{ fontSize:14, fontWeight:600, color:C.text }}>{meal.name}</div>
                      <div style={{ fontSize:11, color:C.muted }}>{meal.cal} cal · {meal.prep}</div>
                    </div>
                    <ChevronRight size={14} color={C.muted}/>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Weekly plan view */}
      {!showFavsOnly && (<>
      {/* Day selector — scrollable row for all 7 days */}
      <div style={{ display:'flex', gap:6, marginBottom:16, overflowX:'auto', paddingBottom:4 }}>
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => (
          <div key={d} onClick={()=>{ setSelectedDay(i); setExpandedMeal(null); }}
            style={{ flexShrink:0, minWidth:44, textAlign:'center', padding:'8px 10px', borderRadius:10, background:selectedDay===i?C.primary:C.bgAlt, color:selectedDay===i?C.white:C.muted, fontSize:12, fontWeight:700, cursor:'pointer', transition:'all .15s' }}>
            {d}
          </div>
        ))}
      </div>

      <Card style={{ marginBottom:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div className="serif" style={{ fontSize:18, fontWeight:700, color:C.text }}>{MEAL_PLANS[selectedDay].day}'s Plan</div>
          <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>Grace-centered, balanced nutrition</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:20, fontWeight:700, color:C.primary }}>{Object.values(MEAL_PLANS[selectedDay].meals).reduce((s,m) => s+m.cal, 0)}</div>
          <div style={{ fontSize:11, color:C.muted }}>total cal</div>
        </div>
      </Card>

      {Object.entries(MEAL_PLANS[selectedDay].meals).map(([mealType, meal]) => {
        const key = `${selectedDay}-${mealType}`;
        const alreadyAdded = addedMeals.has(key);
        const isFav = favorites.has(meal.name);
        return (
          <Card key={mealType} pad={14} style={{ marginBottom:10 }}>
            <div onClick={()=>setExpandedMeal(expandedMeal===mealType?null:mealType)}
              style={{ display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
              <div style={{ fontSize:24, flexShrink:0 }}>{meal.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.primary, textTransform:'uppercase', letterSpacing:'0.06em' }}>{mealType} · {meal.time}</div>
                <div style={{ fontSize:14, fontWeight:600, color:C.text }}>{meal.name}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{meal.cal} cal · P:{meal.protein}g · C:{meal.carbs}g · F:{meal.fat}g</div>
              </div>
              <button onClick={e=>{ e.stopPropagation(); toggleFav(meal.name); }} style={{ background:'none', border:'none', cursor:'pointer', fontSize:16, padding:'4px', flexShrink:0 }}>
                {isFav ? '⭐' : '☆'}
              </button>
              {alreadyAdded && <div style={{ fontSize:11, color:C.success, fontWeight:600, flexShrink:0 }}>✓</div>}
              <div style={{ fontSize:18, color:C.muted, transition:'transform .2s', transform:expandedMeal===mealType?'rotate(90deg)':'none', flexShrink:0 }}>›</div>
            </div>
            {expandedMeal === mealType && (
              <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:10 }}>
                <div style={{ background:C.bgAlt, borderRadius:10, padding:'10px 13px' }}>
                  <div style={{ fontSize:12, fontWeight:700, color:C.primary, marginBottom:6 }}>🛒 Key Ingredients</div>
                  <div style={{ fontSize:12, color:C.muted, lineHeight:1.7 }}>{meal.ingredients.slice(0,4).join(' · ')}{meal.ingredients.length>4?' · ...' :''}</div>
                </div>
                <div style={{ display:'flex', gap:9 }}>
                  <Btn small onClick={()=>setRecipeView({ mealType, meal })} style={{ flex:1, fontSize:13 }}>
                    👩‍🍳 View Full Recipe
                  </Btn>
                  {alreadyAdded ? (
                    <div style={{ flex:1, background:`${C.success}16`, border:`1px solid ${C.success}40`, borderRadius:10, padding:'9px 14px', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                      <CheckCircle size={13} color={C.success}/>
                      <span style={{ fontSize:13, fontWeight:600, color:C.success }}>Added to Log</span>
                    </div>
                  ) : (
                    <Btn small onClick={()=>addToLog(mealType, meal)} style={{ flex:1, fontSize:13, background:C.accent, color:C.text, border:'none' }}>
                      <Plus size={13}/> Add to Log
                    </Btn>
                  )}
                </div>
              </div>
            )}
          </Card>
        );
      })}
      </>)}
    </div>
  );
}


// ─── GUIDED PROGRAMS ──────────────────────────────────────────────────────────
const PROGRAMS = [
  {
    id:1, title:'7-Day Temple Reset', emoji:'🌿', duration:'7 days', level:'Beginner',
    desc:'A week of intentional eating, movement, and Scripture to reconnect body and spirit. Perfect for starting fresh with grace.',
    totalDays: 7,
    dailyActions: [
      { day:1, theme:'Awareness',       movement:'10-min gentle walk',       nutrition:'Drink 8 cups of water',          scripture:'1 Corinthians 6:19-20', reflection:'Today, notice how your body feels. No judgment — just awareness.' },
      { day:2, theme:'Nourishment',     movement:'15-min yoga or stretching', nutrition:'Add one extra vegetable to a meal',scripture:'3 John 1:2',            reflection:'Every meal is an opportunity to nourish your temple with intention.' },
      { day:3, theme:'Rest',            movement:'Rest day — go for a walk if you feel called', nutrition:'Eat slowly, without screens', scripture:'Psalm 23:2-3',    reflection:'Rest is an act of trust. Let your body recover and be restored.' },
      { day:4, theme:'Strength',        movement:'20-min bodyweight workout', nutrition:'Add protein to every meal',       scripture:'Isaiah 40:31',           reflection:'You are stronger than you think. Let God renew your strength today.' },
      { day:5, theme:'Community',       movement:'Walk with a friend or loved one', nutrition:'Cook a meal from scratch',  scripture:'Proverbs 27:17',         reflection:'Invite someone into your journey. We are made for community.' },
      { day:6, theme:'Gratitude',       movement:'Dance, swim, or do what brings you joy', nutrition:'Eat one meal mindfully, savoring each bite', scripture:'Psalm 100:4', reflection:'Your body is a gift. Celebrate it with joy today.' },
      { day:7, theme:'Commitment',      movement:'Reflect on the week — gentle movement of your choice', nutrition:'Plan one healthy meal for next week', scripture:'Galatians 6:9', reflection:'You made it. Every step this week was an act of faithfulness. Keep going.' },
    ],
  },
  {
    id:2, title:'Strength & Scripture', emoji:'💪', duration:'21 days', level:'Intermediate',
    desc:'Build physical and spiritual strength together — daily movement cues paired with devotionals to strengthen body and soul.',
    totalDays: 21,
    dailyActions: [
      { day:1,  theme:'Foundation',   movement:'Bodyweight basics: 3×10 squats, push-ups, lunges', nutrition:'Track your protein today', scripture:'Philippians 4:13', reflection:'You can do all things — including this first step.' },
      { day:2,  theme:'Core',         movement:'Plank holds: 3×20 sec, 15 mountain climbers', nutrition:'Add a protein-rich breakfast', scripture:'Psalm 18:32',   reflection:'God girds you with strength for each day.' },
      { day:3,  theme:'Rest',         movement:'Rest & stretch — 10-min full body stretch', nutrition:'Hydrate well today', scripture:'Isaiah 40:31',  reflection:'Renewal is part of the process.' },
      { day:4,  theme:'Endurance',    movement:'20-min brisk walk or light jog', nutrition:'Eat a balanced lunch', scripture:'Hebrews 12:1',  reflection:'Run with endurance the race set before you.' },
      { day:5,  theme:'Upper Body',   movement:'3×12 push-ups, shoulder press, rows', nutrition:'Prioritize sleep tonight', scripture:'Psalm 46:1',   reflection:'God is your strength and refuge.' },
      { day:6,  theme:'Lower Body',   movement:'3×15 squats, lunges, glute bridges', nutrition:'Try a new vegetable today', scripture:'Isaiah 58:11', reflection:'The Lord will guide you and satisfy your needs.' },
      { day:7,  theme:'Sabbath Rest', movement:'Complete rest or gentle walk', nutrition:'Cook a nourishing meal', scripture:'Exodus 20:8',   reflection:'Rest is holy. You are not defined by your productivity.' },
    ],
  },
  {
    id:3, title:'Grace-Paced 5K', emoji:'🏃‍♀️', duration:'8 weeks', level:'All levels',
    desc:'A faith-filled walk-to-run program that celebrates every step as an act of worship. No race required — just faithful movement.',
    totalDays: 56,
    dailyActions: [
      { day:1, theme:'Week 1 - Day 1', movement:'Walk 20 min at comfortable pace', nutrition:'Drink water before and after', scripture:'Isaiah 40:31', reflection:'Every journey begins with a single step. This one is yours.' },
      { day:2, theme:'Week 1 - Day 2', movement:'Rest or gentle stretching',       nutrition:'Eat a balanced dinner',      scripture:'Psalm 23:1',   reflection:'He makes me lie down in green pastures.' },
      { day:3, theme:'Week 1 - Day 3', movement:'Walk 25 min, slightly faster pace',nutrition:'Try a protein-rich snack', scripture:'Philippians 3:14', reflection:'Press on toward the goal — one step at a time.' },
    ],
  },
  {
    id:4, title:'Nourish & Flourish', emoji:'🥗', duration:'14 days', level:'All levels',
    desc:'Learn intuitive eating through a biblical lens — food as fuel, nourishment, and joy. Not restriction.',
    totalDays: 14,
    dailyActions: [
      { day:1,  theme:'Intention',    movement:'5-min morning stretch',       nutrition:'Eat one meal without distractions', scripture:'3 John 1:2',     reflection:'God wants you to flourish — body and soul.' },
      { day:2,  theme:'Hunger Cues',  movement:'10-min walk after lunch',     nutrition:'Rate your hunger before and after each meal (1-10)', scripture:'Proverbs 25:16', reflection:'Learn to listen to your body\'s wisdom.' },
      { day:3,  theme:'Color',        movement:'Dance to 2 songs',            nutrition:'Eat a meal with 5 different colors', scripture:'Genesis 1:29', reflection:'God gave us variety and abundance. Celebrate it.' },
      { day:4,  theme:'Slow Down',    movement:'Rest day',                    nutrition:'Put your fork down between bites', scripture:'Psalm 46:10',   reflection:'Be still. Even in eating, there is space for grace.' },
      { day:5,  theme:'Protein',      movement:'15-min yoga',                 nutrition:'Add protein to every meal today',  scripture:'1 Cor 6:19',    reflection:'Your body\'s strength begins with how you fuel it.' },
    ],
  },
  {
    id:5, title:'Morning Devotional Workout', emoji:'☀️', duration:'30 days', level:'Beginner',
    desc:'Combine your daily quiet time with gentle movement. Start every morning with intention, Scripture, and a body that\'s awake.',
    totalDays: 30,
    dailyActions: [
      { day:1,  theme:'Dawn',         movement:'10-min morning stretch while listening to worship music', nutrition:'Drink water first thing', scripture:'Psalm 5:3',     reflection:'In the morning, O Lord, you hear my voice.' },
      { day:2,  theme:'Breath',       movement:'5 deep breaths + 10-min walk outside', nutrition:'Eat breakfast within an hour of waking', scripture:'Genesis 2:7', reflection:'God breathed life into you. Breathe with intention today.' },
      { day:3,  theme:'Stillness',    movement:'10-min stretching in silence',  nutrition:'No screens during breakfast', scripture:'Psalm 46:10',   reflection:'Be still and know that He is God.' },
      { day:4,  theme:'Energy',       movement:'15-min brisk walk + 5-min prayer walk', nutrition:'Have a protein-rich breakfast', scripture:'Isaiah 40:29', reflection:'He gives strength to the weary.' },
      { day:5,  theme:'Gratitude',    movement:'Write 3 gratitudes, then 10-min stretch', nutrition:'Notice one thing you\'re grateful for in your meal', scripture:'1 Thess 5:18', reflection:'Give thanks in all circumstances.' },
    ],
  },
  {
    id:6, title:'Rest & Restore', emoji:'😴', duration:'14 days', level:'All levels',
    desc:'A gentle program for women who need permission to rest. Sleep, Sabbath, and the sacred practice of doing less.',
    totalDays: 14,
    dailyActions: [
      { day:1,  theme:'Permission',   movement:'No structured exercise — go on a slow, enjoyable walk if you\'d like', nutrition:'Eat one meal slowly today', scripture:'Matthew 11:28', reflection:'"Come to me, all who are weary, and I will give you rest."' },
      { day:2,  theme:'Sleep',        movement:'In bed by 10pm tonight',       nutrition:'No caffeine after 2pm',         scripture:'Psalm 127:2',   reflection:'He grants sleep to those he loves.' },
      { day:3,  theme:'Breath',       movement:'10-min restorative yoga',      nutrition:'Eat at least 2 nourishing meals', scripture:'Genesis 2:2',  reflection:'Even God rested. You have permission to stop.' },
      { day:4,  theme:'Boundaries',   movement:'Gentle stretching only',       nutrition:'One screen-free meal',           scripture:'Mark 6:31',     reflection:'"Come away by yourselves to a desolate place and rest a while."' },
    ],
  },
];

function GuidedPrograms({ user, onUpgrade }) {
  const isPremium = user?.plan === 'premium';

  // Persist enrollment state
  const [enrollments, setEnrollments] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_programs') || '{}'); } catch { return {}; }
  });
  const [activeProgram, setActiveProgram] = useState(null); // expanded card id
  const [viewingProgram, setViewingProgram] = useState(null); // full program detail view

  const saveEnrollments = (updated) => {
    setEnrollments(updated);
    try { localStorage.setItem('ff_programs', JSON.stringify(updated)); } catch {}
  };

  const enroll = (progId) => {
    saveEnrollments({ ...enrollments, [progId]: { startDate: getTodayKey(), currentDay: 1, completedDays: [] } });
  };

  const unenroll = (progId) => {
    const updated = { ...enrollments };
    delete updated[progId];
    saveEnrollments(updated);
  };

  const completeDay = (progId, day) => {
    const enr = enrollments[progId] || {};
    const completed = enr.completedDays || [];
    if (completed.includes(day)) return;
    const newCompleted = [...completed, day];
    const nextDay = Math.min(day + 1, PROGRAMS.find(p=>p.id===progId)?.totalDays || day);
    saveEnrollments({ ...enrollments, [progId]: { ...enr, completedDays: newCompleted, currentDay: nextDay } });
  };

  if (!isPremium) return <PremiumGate feature="Guided Programs" onUpgrade={onUpgrade}/>;

  // ── Program detail view ──
  if (viewingProgram) {
    const prog = PROGRAMS.find(p => p.id === viewingProgram);
    const enr = enrollments[prog.id];
    const currentDay = enr?.currentDay || 1;
    const completedDays = enr?.completedDays || [];
    const todayAction = prog.dailyActions.find(a => a.day === currentDay) || prog.dailyActions[prog.dailyActions.length - 1];
    const pct = Math.round((completedDays.length / prog.totalDays) * 100);

    return (
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <BackBtn onClick={()=>setViewingProgram(null)}/>
          <div>
            <div className="serif" style={{ fontSize:20, fontWeight:700 }}>{prog.title}</div>
            <div style={{ fontSize:12, color:C.muted }}>Day {currentDay} of {prog.totalDays}</div>
          </div>
          <div style={{ marginLeft:'auto', fontSize:24 }}>{prog.emoji}</div>
        </div>

        {/* Progress bar */}
        <Card style={{ marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ fontSize:13, fontWeight:600, color:C.text }}>Progress</span>
            <span style={{ fontSize:13, fontWeight:700, color:C.primary }}>{pct}%</span>
          </div>
          <Bar val={completedDays.length} max={prog.totalDays} color={C.primary} h={10}/>
          <div style={{ fontSize:11, color:C.muted, marginTop:6 }}>{completedDays.length} of {prog.totalDays} days complete{pct===100?' 🎉':''}</div>
        </Card>

        {/* Today's action */}
        {completedDays.length < prog.totalDays ? (
          <Card style={{ marginBottom:14, background:`linear-gradient(135deg, ${C.primary}08, ${C.accent}06)`, border:`1px solid ${C.primary}20` }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.primary, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:10 }}>
              📅 Day {currentDay} — {todayAction.theme}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
              <div style={{ background:C.bg, borderRadius:10, padding:'11px 13px' }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:4, textTransform:'uppercase' }}>🏃 Movement</div>
                <div style={{ fontSize:13, color:C.text, lineHeight:1.55 }}>{todayAction.movement}</div>
              </div>
              <div style={{ background:C.bg, borderRadius:10, padding:'11px 13px' }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.muted, marginBottom:4, textTransform:'uppercase' }}>🥗 Nutrition</div>
                <div style={{ fontSize:13, color:C.text, lineHeight:1.55 }}>{todayAction.nutrition}</div>
              </div>
              <div style={{ background:`${C.accent}12`, borderRadius:10, padding:'11px 13px', borderLeft:`3px solid ${C.accent}` }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.accent, marginBottom:4, textTransform:'uppercase' }}>📖 {todayAction.scripture}</div>
                <div style={{ fontSize:13, color:C.text, lineHeight:1.6, fontStyle:'italic' }}>{todayAction.reflection}</div>
              </div>
            </div>
            {!completedDays.includes(currentDay) ? (
              <Btn full onClick={()=>completeDay(prog.id, currentDay)}><CheckCircle size={15}/> Mark Day {currentDay} Complete</Btn>
            ) : (
              <div style={{ background:`${C.success}18`, borderRadius:10, padding:'12px', textAlign:'center', border:`1px solid ${C.success}40` }}>
                <div style={{ fontWeight:700, color:C.success, marginBottom:2 }}>✓ Day {currentDay} complete!</div>
                <div style={{ fontSize:12, color:C.muted }}>Come back tomorrow for Day {currentDay + 1}</div>
              </div>
            )}
          </Card>
        ) : (
          <Card style={{ textAlign:'center', padding:28, background:`linear-gradient(135deg, ${C.primary}08, ${C.accent}08)` }}>
            <div style={{ fontSize:40, marginBottom:10 }}>🎉</div>
            <div className="serif" style={{ fontSize:24, fontWeight:700, color:C.text, marginBottom:8 }}>You finished!</div>
            <div style={{ fontSize:14, color:C.muted, lineHeight:1.65, marginBottom:16 }}>You completed {prog.title}. That took faithfulness and grace — celebrate this win.</div>
            <div style={{ fontSize:13, color:C.primary, fontStyle:'italic' }}>"And let us not grow weary of doing good, for in due season we will reap." — Galatians 6:9</div>
          </Card>
        )}

        {/* Day list */}
        {prog.dailyActions.length > 1 && (
          <Card pad={0} style={{ overflow:'hidden' }}>
            <div style={{ padding:'12px 16px', fontWeight:600, fontSize:13, color:C.text, borderBottom:`1px solid ${C.border}` }}>All Days</div>
            {prog.dailyActions.map(a => (
              <div key={a.day} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 16px', borderBottom:`1px solid ${C.border}`, opacity: a.day > currentDay ? 0.45 : 1 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:completedDays.includes(a.day)?C.success:a.day===currentDay?C.primary:C.bgAlt, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:completedDays.includes(a.day)||a.day===currentDay?'#fff':C.muted, flexShrink:0 }}>
                  {completedDays.includes(a.day) ? '✓' : a.day}
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:C.text }}>Day {a.day} — {a.theme}</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:1 }}>{a.movement}</div>
                </div>
              </div>
            ))}
          </Card>
        )}

        <div style={{ marginTop:16 }}>
          <Btn full variant="ghost" onClick={()=>{ if(window.confirm('Leave this program? Your progress will be lost.')) { unenroll(prog.id); setViewingProgram(null); }}}
            style={{ color:'#E57373', fontSize:13 }}>Leave Program</Btn>
        </div>
      </div>
    );
  }

  // ── Program list ──
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
        <div className="serif" style={{ fontSize:24, fontWeight:700 }}>Guided Programs</div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:`${C.accent}22`, borderRadius:99, padding:'3px 10px', fontSize:10, fontWeight:700, color:C.accent, marginLeft:'auto' }}>✨ Premium</div>
      </div>

      {/* Active programs at top */}
      {Object.keys(enrollments).length > 0 && (
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:10 }}>Currently Enrolled</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {PROGRAMS.filter(p => enrollments[p.id]).map(prog => {
              const enr = enrollments[prog.id];
              const pct = Math.round(((enr.completedDays||[]).length / prog.totalDays) * 100);
              return (
                <Card key={prog.id} hover pad={16} onClick={()=>setViewingProgram(prog.id)} style={{ border:`2px solid ${C.primary}30` }}>
                  <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <div style={{ fontSize:26, flexShrink:0 }}>{prog.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, fontSize:14, color:C.text, marginBottom:4 }}>{prog.title}</div>
                      <Bar val={enr.completedDays?.length||0} max={prog.totalDays} color={C.primary} h={5}/>
                      <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>Day {enr.currentDay} of {prog.totalDays} · {pct}% complete</div>
                    </div>
                    <ChevronRight size={15} color={C.primary}/>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* All programs */}
      <div style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:10 }}>All Programs</div>
      <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
        {PROGRAMS.map(prog => {
          const isEnrolled = !!enrollments[prog.id];
          return (
            <Card key={prog.id} hover pad={16} onClick={()=>setActiveProgram(activeProgram===prog.id?null:prog.id)}>
              <div style={{ display:'flex', gap:13, alignItems:'flex-start' }}>
                <div style={{ width:48, height:48, borderRadius:13, background:C.bgAlt, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{prog.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:15, color:C.text, marginBottom:4 }}>{prog.title}</div>
                  <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:activeProgram===prog.id?10:0 }}>
                    <span style={{ fontSize:11, color:C.muted, background:C.bgAlt, borderRadius:99, padding:'2px 8px' }}>{prog.duration}</span>
                    <span style={{ fontSize:11, color:C.muted, background:C.bgAlt, borderRadius:99, padding:'2px 8px' }}>{prog.level}</span>
                    {isEnrolled && <span style={{ fontSize:11, color:C.primary, background:`${C.primary}12`, borderRadius:99, padding:'2px 8px', fontWeight:600 }}>✓ In Progress</span>}
                  </div>
                  {activeProgram === prog.id && (
                    <div>
                      <div style={{ fontSize:13, color:C.muted, lineHeight:1.65, marginBottom:12 }}>{prog.desc}</div>
                      <div style={{ display:'flex', gap:9 }}>
                        {isEnrolled ? (
                          <Btn small onClick={e=>{e.stopPropagation();setViewingProgram(prog.id);}} style={{ background:C.primary, color:C.white, border:'none' }}>
                            Continue Program →
                          </Btn>
                        ) : (
                          <Btn small onClick={e=>{e.stopPropagation();enroll(prog.id);setViewingProgram(prog.id);}} style={{ background:C.primary, color:C.white, border:'none' }}>
                            Start Program
                          </Btn>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── TRACK TAB ────────────────────────────────────────────────────────────────
function TrackTab({ initView='overview', foodItems, setFoodItems, waterCups, setWaterCups, weightEntries, setWeightEntries, moveItems, setMoveItems, appSettings, user, onUpgrade }) {
  const [view, setView] = useState(initView);
  useEffect(()=>{ setView(initView); },[initView]);
  const { calorieGoal=1800, waterGoal=8, weightUnit='lbs' } = appSettings || {};
  if(view==='food')     return <FoodLogger      onBack={()=>setView('overview')} items={foodItems}       setItems={setFoodItems}     calorieGoal={calorieGoal}/>;
  if(view==='water')    return <WaterTracker     onBack={()=>setView('overview')} cups={waterCups}        setCups={setWaterCups}      waterGoal={waterGoal}/>;
  if(view==='weight')   return <WeightLogger     onBack={()=>setView('overview')} entries={weightEntries} setEntries={setWeightEntries} weightUnit={weightUnit} appSettings={appSettings}/>;
  if(view==='movement') return <MovementLogger   onBack={()=>setView('overview')} entries={moveItems}     setEntries={setMoveItems} weightEntries={weightEntries}/>;
  if(view==='meals')    return <div><div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}><BackBtn onClick={()=>setView('overview')}/></div><MealPlanner user={user} onUpgrade={onUpgrade} setFoodItems={setFoodItems}/></div>;
  if(view==='programs') return <div><div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}><BackBtn onClick={()=>setView('overview')}/></div><GuidedPrograms user={user} onUpgrade={onUpgrade}/></div>;

  const isPremium = user?.plan === 'premium';
  const totalCal = foodItems.reduce((s,i)=>s+i.cal,0);
  const coreTiles = [
    {emoji:'🍴', label:'Food Log',      sub:totalCal>0?`${totalCal} / ${calorieGoal} cal`:'Nothing logged yet',                                            view:'food',     bg:'#F2F6F0'},
    {emoji:'💧', label:'Water Tracker', sub:`${waterCups} / ${waterGoal} cups`,                                                                             view:'water',    bg:'#EFF7FC'},
    {emoji:'⚖️', label:'Weight Log',    sub:weightEntries.length>0?`${weightEntries[0].w} ${weightUnit}`:'Not logged today',                               view:'weight',   bg:'#F8F4EC'},
    {emoji:'🏃', label:'Movement',      sub:moveItems.length>0?`${moveItems.length} session${moveItems.length!==1?'s':''} · ${moveItems.reduce((s,i)=>s+(i.duration||0),0)} min today`:'Nothing logged yet',     view:'movement', bg:'#F2F6F0'},
  ];
  const premiumTiles = [
    {emoji:'📅', label:'Meal Planner',    sub: isPremium ? '5-day grace-centered plans' : 'Personalized weekly meals', view:'meals',    bg:'#F5EEF8', premium:true},
    {emoji:'🎯', label:'Guided Programs', sub: isPremium ? '6 programs available'        : 'Structured wellness journeys', view:'programs', bg:'#EEF5F8', premium:true},
  ];

  return (
    <div>
      <div className="serif" style={{ fontSize:26, fontWeight:700, marginBottom:18 }}>Track</div>

      {/* Core tracking tiles */}
      <div style={{ display:'flex', flexDirection:'column', gap:11, marginBottom:18 }}>
        {coreTiles.map(t=>(
          <div key={t.view} onClick={()=>setView(t.view)} className="card-hover" style={{ background:t.bg, borderRadius:14, padding:'16px 18px', display:'flex', alignItems:'center', gap:15, cursor:'pointer', boxShadow:'0 2px 8px rgba(44,62,42,0.06)' }}>
            <div style={{ fontSize:32, width:52, height:52, background:'rgba(255,255,255,0.72)', borderRadius:13, display:'flex', alignItems:'center', justifyContent:'center' }}>{t.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:15, color:C.text }}>{t.label}</div>
              <div style={{ fontSize:13, color:C.muted, marginTop:2 }}>{t.sub}</div>
            </div>
            <ChevronRight size={17} color={C.muted}/>
          </div>
        ))}
      </div>

      {/* Premium features section */}
      <div style={{ fontSize:13, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>
        Premium Features {!isPremium && <span style={{ color:C.accent }}>✨</span>}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
        {premiumTiles.map(t=>(
          <div key={t.view} onClick={()=>setView(t.view)} className="card-hover"
            style={{ background:t.bg, borderRadius:14, padding:'16px 18px', display:'flex', alignItems:'center', gap:15, cursor:'pointer', boxShadow:'0 2px 8px rgba(44,62,42,0.06)', border: !isPremium ? `1.5px dashed ${C.accent}60` : 'none', opacity: !isPremium ? 0.85 : 1 }}>
            <div style={{ fontSize:32, width:52, height:52, background:'rgba(255,255,255,0.72)', borderRadius:13, display:'flex', alignItems:'center', justifyContent:'center' }}>{t.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontWeight:600, fontSize:15, color:C.text }}>{t.label}</span>
                {!isPremium && <span style={{ fontSize:10, fontWeight:700, color:C.accent, background:`${C.accent}22`, borderRadius:99, padding:'1px 7px' }}>✨ Premium</span>}
              </div>
              <div style={{ fontSize:13, color:C.muted, marginTop:2 }}>{t.sub}</div>
            </div>
            <ChevronRight size={17} color={C.muted}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COMMUNITY TAB ────────────────────────────────────────────────────────────
function PostCard({ post, currentUser, currentUserData, onLike, onPray, onDelete }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.commentsList || []);
  const [commentText, setCommentText] = useState('');
  const isOwn = post.name === currentUser || post.isCurrentUser;

  // For own posts use live user avatar; for others use stored color + initial
  const avatarPhoto  = isOwn ? (currentUserData?.avatarPhoto || null) : null;
  const avatarColor  = isOwn ? (currentUserData?.avatarColor || post.avatarColor || C.primary) : (post.avatarColor || C.primary);
  const avatarLetter = isOwn ? (currentUserData?.name || post.name || 'Y').charAt(0).toUpperCase() : (post.initial || post.emoji || '?');

  const addComment = () => {
    if (!commentText.trim()) return;
    const newComment = { id: Date.now(), name: currentUser, text: commentText.trim(), time: 'Just now' };
    setComments(p => [...p, newComment]);
    setCommentText('');
  };

  return (
    <Card pad={17}>
      {/* Header */}
      <div style={{ display:'flex', gap:11, marginBottom:11 }}>
        <div style={{ width:38, height:38, borderRadius:'50%', background:avatarColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:'#fff', flexShrink:0, overflow:'hidden' }}>
          {avatarPhoto
            ? <img src={avatarPhoto} alt={post.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
            : avatarLetter}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
            <span style={{ fontWeight:600, fontSize:14, color:C.text }}>{post.name}</span>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:11, color:C.muted }}>{formatRelativeTime(post.id)}</span>
              {isOwn && (
                <button onClick={()=>onDelete(post.id)} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, padding:'0 2px', display:'flex', fontSize:12, lineHeight:1 }}>
                  <X size={13}/>
                </button>
              )}
            </div>
          </div>
          <p style={{ fontSize:14, color:C.text, lineHeight:1.62, margin:0 }}>{post.text}</p>
        </div>
      </div>
      {post.scripture && (
        <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:C.bgAlt, borderRadius:99, padding:'4px 12px', fontSize:12, color:C.primary, fontWeight:500, marginBottom:10 }}>
          📖 {post.scripture}
        </div>
      )}
      {/* Reactions */}
      <div style={{ display:'flex', gap:8, borderTop:`1px solid ${C.border}`, paddingTop:10, flexWrap:'wrap' }}>
        <button onClick={()=>onLike(post.id)} className="btn" style={{ background:post.liked?'#FEF0F0':'none', border:`1px solid ${post.liked?'#FFCDD2':C.border}`, borderRadius:99, padding:'5px 12px', fontSize:12, color:post.liked?'#E57373':C.muted, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
          ❤️ {post.likes}
        </button>
        <button onClick={()=>onPray(post.id)} className="btn" style={{ background:post.prayed?`${C.primary}10`:'none', border:`1px solid ${post.prayed?C.primary:C.border}`, borderRadius:99, padding:'5px 12px', fontSize:12, color:post.prayed?C.primary:C.muted, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
          🙏 {post.praying}
        </button>
        <button onClick={()=>setShowComments(s=>!s)} className="btn" style={{ background:showComments?`${C.primary}10`:'none', border:`1px solid ${showComments?C.primary:C.border}`, borderRadius:99, padding:'5px 12px', fontSize:12, color:showComments?C.primary:C.muted, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
          <MessageCircle size={12}/> {comments.length > 0 ? comments.length : 'Comment'}
        </button>
      </div>
      {/* Comments section */}
      {showComments && (
        <div style={{ marginTop:12 }}>
          {comments.length === 0 && (
            <div style={{ fontSize:12, color:C.muted, fontStyle:'italic', marginBottom:10, textAlign:'center' }}>No comments yet — be the first to encourage!</div>
          )}
          {comments.map(c => (
            <div key={c.id} style={{ display:'flex', gap:9, marginBottom:10 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff', flexShrink:0 }}>
                {c.name.charAt(0)}
              </div>
              <div style={{ background:C.bgAlt, borderRadius:'0 11px 11px 11px', padding:'8px 12px', flex:1 }}>
                <div style={{ fontSize:11, fontWeight:600, color:C.text, marginBottom:3 }}>{c.name} <span style={{ color:C.muted, fontWeight:400 }}>· {c.time}</span></div>
                <div style={{ fontSize:13, color:C.text, lineHeight:1.5 }}>{c.text}</div>
              </div>
            </div>
          ))}
          {/* Comment input */}
          <div style={{ display:'flex', gap:8, alignItems:'center', marginTop:8 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff', flexShrink:0 }}>
              {currentUser.charAt(0)}
            </div>
            <input
              value={commentText}
              onChange={e=>setCommentText(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&addComment()}
              placeholder="Add a comment..."
              className="ff-input"
              style={{ flex:1, border:`1.5px solid ${C.border}`, borderRadius:99, padding:'7px 14px', fontSize:13, color:C.text, background:C.white }}
            />
            <button onClick={addComment} disabled={!commentText.trim()} style={{ width:32, height:32, borderRadius:'50%', background:commentText.trim()?C.primary:C.border, border:'none', cursor:commentText.trim()?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background .15s' }}>
              <Send size={13} color="#fff"/>
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

function CommunityTab({ user, posts, setPosts }) {
  const [filter, setFilter] = useState('all');
  const [searchQ, setSearchQ] = useState('');
  const [create, setCreate] = useState(false);
  const [np, setNp] = useState({text:'',scripture:''});
  const isPremium = user?.plan === 'premium';
  const userName = user?.name || 'You';

  // ── Circles state (persisted) ──────────────────────────────
  const [myCircles, setMyCircles] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_circles') || '[]'); } catch { return []; }
  });
  const [showCreateCircle, setShowCreateCircle] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');
  const [newCirclePrayer, setNewCirclePrayer] = useState('');
  const [openCircleId, setOpenCircleId] = useState(null);
  const [circlePostText, setCirclePostText] = useState('');

  const saveCircles = (updated) => {
    setMyCircles(updated);
    try { localStorage.setItem('ff_circles', JSON.stringify(updated)); } catch {}
  };

  const createCircle = () => {
    if (!newCircleName.trim()) return;
    const circle = {
      id: Date.now(),
      name: newCircleName.trim(),
      prayer: newCirclePrayer.trim() || 'Lord, help us honor our bodies and deepen our faith together.',
      members: [{ name: userName, initial: userName.charAt(0).toUpperCase(), color: user?.avatarColor || C.primary, isYou: true }],
      posts: [],
      createdAt: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'}),
    };
    saveCircles([...myCircles, circle]);
    setNewCircleName(''); setNewCirclePrayer(''); setShowCreateCircle(false);
  };

  const postToCircle = (circleId) => {
    if (!circlePostText.trim()) return;
    const updated = myCircles.map(c => c.id === circleId
      ? { ...c, posts: [{ id: Date.now(), author: userName, text: circlePostText.trim(), time: 'Just now', praying: 0, prayedBy: [] }, ...c.posts] }
      : c
    );
    saveCircles(updated);
    setCirclePostText('');
  };

  const toggleCirclePray = (circleId, postId) => {
    const updated = myCircles.map(c => c.id === circleId
      ? { ...c, posts: c.posts.map(p => {
          if (p.id !== postId) return p;
          const already = (p.prayedBy||[]).includes(userName);
          return { ...p, praying: p.praying + (already ? -1 : 1), prayedBy: already ? (p.prayedBy||[]).filter(n=>n!==userName) : [...(p.prayedBy||[]), userName] };
        })}
      : c
    );
    saveCircles(updated);
  };

  // ── Post state ──────────────────────────────────────────────
  const toggleLike = id => setPosts(p => p.map(post => post.id===id ? {...post, likes:post.likes+(post.liked?-1:1), liked:!post.liked} : post));
  const togglePray = id => setPosts(p => p.map(post => post.id===id ? {...post, praying:post.praying+(post.prayed?-1:1), prayed:!post.prayed} : post));
  const deletePost = id => setPosts(p => p.filter(post => post.id !== id));
  const submitPost = () => {
    if (!np.text.trim()) return;
    setPosts(p => [{ id:Date.now(), name:userName, initial:userName.charAt(0).toUpperCase(), avatarColor:user?.avatarColor||C.primary, isCurrentUser:true, time:'Just now', text:np.text, scripture:np.scripture, likes:0, praying:0, liked:false, prayed:false, commentsList:[] }, ...p]);
    setNp({text:'', scripture:''}); setCreate(false);
  };

  const filtered = posts
    .filter(p => filter === 'mine' ? p.name === userName : true)
    .filter(p => !searchQ || p.text.toLowerCase().includes(searchQ.toLowerCase()) || (p.name||'').toLowerCase().includes(searchQ.toLowerCase()));

  // ── Filter labels ──────────────────────────────────────────
  const filters = [
    { id:'all',     label:'All Posts' },
    { id:'mine',    label:'My Posts' },
    { id:'circles', label: isPremium ? `Circles${myCircles.length>0?` (${myCircles.length})`:''}` : 'Circles ✨' },
  ];

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <div className="serif" style={{ fontSize:26, fontWeight:700 }}>Community</div>
        {filter !== 'circles' && <Btn small onClick={()=>setCreate(true)}><Plus size={13}/> Share</Btn>}
        {filter === 'circles' && isPremium && <Btn small onClick={()=>setShowCreateCircle(true)}><Plus size={13}/> New Circle</Btn>}
      </div>

      {/* Search bar */}
      {filter !== 'circles' && (
        <div style={{ position:'relative', marginBottom:10 }}>
          <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search posts..."
            style={{ width:'100%', border:`1.5px solid ${C.border}`, borderRadius:99, padding:'9px 36px 9px 16px', fontSize:13, color:C.text, background:C.white, fontFamily:'inherit' }}/>
          {searchQ && (
            <button onClick={()=>setSearchQ('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex', padding:0 }}>
              <X size={14}/>
            </button>
          )}
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:15, overflowX:'auto', paddingBottom:2 }}>
        {filters.map(f=>(
          <div key={f.id} onClick={()=>setFilter(f.id)} style={{ padding:'6px 15px', borderRadius:99, border:`1.5px solid ${filter===f.id?C.primary:C.border}`, background:filter===f.id?C.primary:C.white, color:filter===f.id?C.white:C.muted, fontSize:12, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, transition:'all 0.15s' }}>
            {f.label}
          </div>
        ))}
      </div>

      {/* ── CIRCLES PANEL ── */}
      {filter === 'circles' && !isPremium && (
        <PremiumGate feature="Accountability Circles" onUpgrade={()=>{
          const u = {...user, plan:'premium'};
          // notify parent — handled via onUpgrade if wired, fallback alert
          alert('Upgrade to Premium to unlock Accountability Circles! Visit Profile → Subscription & Plan.');
        }}/>
      )}

      {filter === 'circles' && isPremium && (
        <div>
          {/* Create circle modal */}
          <Modal open={showCreateCircle} onClose={()=>setShowCreateCircle(false)} title="Create a Circle">
            <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
              <Input label="Circle Name" placeholder='e.g. "Morning Warriors" or "Temple Sisters"' value={newCircleName} onChange={e=>setNewCircleName(e.target.value)}/>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={{ fontSize:13, fontWeight:600, color:C.text }}>Opening Prayer Request</label>
                <textarea value={newCirclePrayer} onChange={e=>setNewCirclePrayer(e.target.value)} rows={3} placeholder="Lord, help us honor our bodies and walk faithfully together..."
                  style={{ border:`1.5px solid ${C.border}`, borderRadius:9, padding:'11px 13px', fontSize:14, color:C.text, resize:'none', lineHeight:1.55, background:C.white, width:'100%' }}/>
              </div>
              <Btn full onClick={createCircle}><Plus size={14}/> Create Circle</Btn>
            </div>
          </Modal>

          {myCircles.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px 20px' }}>
              <div style={{ width:64, height:64, borderRadius:18, background:`linear-gradient(135deg,${C.primary}20,${C.accent}20)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:28 }}>🤝</div>
              <div className="serif" style={{ fontSize:22, fontWeight:700, color:C.text, marginBottom:8 }}>No circles yet</div>
              <div style={{ fontSize:13, color:C.muted, lineHeight:1.65, marginBottom:20, maxWidth:280, margin:'0 auto 20px' }}>Create a small group of 5–8 women for intimate accountability, prayer, and shared wellness goals.</div>
              <Btn onClick={()=>setShowCreateCircle(true)}><Plus size={14}/> Create Your First Circle</Btn>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {myCircles.map(circle => (
                <Card key={circle.id} pad={0} style={{ overflow:'hidden' }}>
                  {/* Circle header */}
                  <div onClick={()=>setOpenCircleId(openCircleId===circle.id?null:circle.id)}
                    style={{ display:'flex', alignItems:'center', gap:13, padding:'15px 17px', cursor:'pointer', background:`linear-gradient(135deg,${C.primary}08,${C.accent}06)` }}>
                    <div style={{ width:44, height:44, borderRadius:13, background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🤝</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:15, color:C.text }}>{circle.name}</div>
                      <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{circle.members.length} member{circle.members.length!==1?'s':''} · {circle.posts.length} post{circle.posts.length!==1?'s':''}</div>
                    </div>
                    <div style={{ fontSize:16, color:C.muted, transition:'transform .2s', transform:openCircleId===circle.id?'rotate(90deg)':'none' }}>›</div>
                  </div>

                  {/* Expanded circle content */}
                  {openCircleId === circle.id && (
                    <div style={{ padding:'0 17px 17px' }}>
                      {/* Opening prayer */}
                      <div style={{ background:C.bgAlt, borderRadius:10, padding:'10px 13px', margin:'12px 0', borderLeft:`3px solid ${C.accent}` }}>
                        <div style={{ fontSize:10, fontWeight:700, color:C.accent, marginBottom:4, textTransform:'uppercase', letterSpacing:'.05em' }}>🙏 Circle Prayer</div>
                        <div style={{ fontSize:13, color:C.text, fontStyle:'italic', lineHeight:1.6 }}>"{circle.prayer}"</div>
                      </div>

                      {/* Members */}
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
                        {circle.members.map((m,i) => (
                          <div key={i} style={{ width:30, height:30, borderRadius:'50%', background:m.color||C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff', border:`2px solid ${C.bg}`, marginLeft:i>0?-8:0 }}>
                            {m.initial}
                          </div>
                        ))}
                        <div style={{ fontSize:12, color:C.muted, marginLeft:6 }}>
                          {circle.members.map(m=>m.isYou?'You':m.name).join(', ')}
                        </div>
                      </div>

                      {/* Circle posts */}
                      {circle.posts.length > 0 && (
                        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:12 }}>
                          {circle.posts.map(post => (
                            <div key={post.id} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:11, padding:'11px 13px' }}>
                              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                                <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{post.author}</span>
                                <span style={{ fontSize:11, color:C.muted }}>{formatRelativeTime(post.id)}</span>
                              </div>
                              <div style={{ fontSize:13, color:C.text, lineHeight:1.6, marginBottom:8 }}>{post.text}</div>
                              <button onClick={()=>toggleCirclePray(circle.id, post.id)}
                                style={{ background:(post.prayedBy||[]).includes(userName)?`${C.primary}12`:'none', border:`1px solid ${(post.prayedBy||[]).includes(userName)?C.primary:C.border}`, borderRadius:99, padding:'4px 12px', fontSize:11, color:(post.prayedBy||[]).includes(userName)?C.primary:C.muted, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:4 }}>
                                🙏 Praying ({post.praying})
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Post to circle */}
                      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <input value={circlePostText} onChange={e=>setCirclePostText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&postToCircle(circle.id)}
                          placeholder="Share a prayer request or encouragement..." className="ff-input"
                          style={{ flex:1, border:`1.5px solid ${C.border}`, borderRadius:99, padding:'9px 14px', fontSize:13, color:C.text, background:C.white }}/>
                        <button onClick={()=>postToCircle(circle.id)} disabled={!circlePostText.trim()}
                          style={{ width:36, height:36, borderRadius:'50%', background:circlePostText.trim()?C.primary:C.border, border:'none', cursor:circlePostText.trim()?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <Send size={14} color="#fff"/>
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── FEED PANEL ── */}
      {filter !== 'circles' && (
        <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'40px 20px', color:C.muted }}>
              <div style={{ fontSize:32, marginBottom:12 }}>🌿</div>
              <div style={{ fontWeight:600, fontSize:15, color:C.text, marginBottom:6 }}>
                {filter==='mine' ? "You haven't posted yet" : 'No posts yet'}
              </div>
              <div style={{ fontSize:13, lineHeight:1.6, marginBottom:16 }}>
                {filter==='mine' ? 'Share your journey with the community.' : 'Be the first to share something today!'}
              </div>
              <Btn small onClick={()=>setCreate(true)}><Plus size={13}/> Share Something</Btn>
            </div>
          )}
          {filtered.map(post=>(
            <PostCard key={post.id} post={post} currentUser={userName} currentUserData={user} onLike={toggleLike} onPray={togglePray} onDelete={deletePost}/>
          ))}
        </div>
      )}

      <Modal open={create} onClose={()=>setCreate(false)} title="Share with the Community">
        <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
          <textarea value={np.text} onChange={e=>setNp(p=>({...p,text:e.target.value}))} rows={5} maxLength={500} placeholder="Share your journey, a win, a struggle, or an encouragement... 🌿"
            style={{ width:'100%', border:`1.5px solid ${C.border}`, borderRadius:10, padding:'12px 14px', fontSize:14, color:C.text, resize:'none', lineHeight:1.62, background:C.white }}/>
          <Input label="📖 Add Scripture Tag (optional)" placeholder="e.g. Philippians 4:13" value={np.scripture} onChange={e=>setNp(p=>({...p,scripture:e.target.value}))}/>
          <Btn full onClick={submitPost}><Send size={13}/> Post to Community</Btn>
        </div>
      </Modal>
    </div>
  );
}


// ─── PROFILE TAB ─────────────────────────────────────────────────────────────
// ─── PROFILE PERSISTENCE HELPERS ──────────────────────────────────────────────
function saveUserProfile(data) {
  try { localStorage.setItem('ff_user', JSON.stringify(data)); } catch(e) {}
}
function loadUserProfile() {
  try { return JSON.parse(localStorage.getItem('ff_user') || 'null'); } catch(e) { return null; }
}
function saveUserGoals(goals) {
  try { localStorage.setItem('ff_goals', JSON.stringify(goals)); } catch(e) {}
}
function loadUserGoals() {
  try { return JSON.parse(localStorage.getItem('ff_goals') || '[]'); } catch(e) { return []; }
}
function saveAppSettings(s) {
  try { localStorage.setItem('ff_settings', JSON.stringify(s)); } catch(e) {}
}
function loadAppSettings() {
  try { return JSON.parse(localStorage.getItem('ff_settings') || 'null'); } catch(e) { return null; }
}

// ─── PROFILE TAB ─────────────────────────────────────────────────────────────
function ProfileTab({ user, onSignOut, onUpdateUser, appSettings, onUpdateSettings }) {
  const [activePanel, setActivePanel] = useState(null);

  // Edit profile fields — initialized from persisted user
  const [editName,     setEditName]     = useState(user.name     || '');
  const [editEmail,    setEditEmail]    = useState(user.email    || '');
  const [editCovenant, setEditCovenant] = useState(user.covenant || '');
  const [avatarPhoto,  setAvatarPhoto]  = useState(user.avatarPhoto  || null);
  const [avatarColor,  setAvatarColor]  = useState(user.avatarColor  || C.primary);

  // Notification settings (persisted)
  const [notifs, setNotifs] = useState(
    () => { try { return JSON.parse(localStorage.getItem('ff_notifs') || 'null') || { devotional:true, water:true, community:false, circles:true }; } catch(e) { return { devotional:true, water:true, community:false, circles:true }; } }
  );

  // Goals (persisted)
  const ALL_GOALS = ['Lose weight','Build healthier habits','Strengthen my faith','Find community','Improve my energy','Honor my body as a temple'];
  const [selectedGoals, setSelectedGoals] = useState(() => loadUserGoals());
  const [pendingGoals,  setPendingGoals]  = useState(() => loadUserGoals());

  // App settings (persisted) — local copies for editing
  const [settingsLocal, setSettingsLocal] = useState({ ...appSettings });

  const fileInputRef = React.useRef(null);

  // Keep local state in sync if user prop changes from outside
  React.useEffect(() => {
    setEditName(user.name || '');
    setEditEmail(user.email || '');
    setEditCovenant(user.covenant || '');
    setAvatarPhoto(user.avatarPhoto || null);
    setAvatarColor(user.avatarColor || C.primary);
  }, [user]);

  // ── Save profile ──
  const saveProfile = () => {
    const updated = {
      ...user,
      name: editName.trim() || user.name,
      email: editEmail.trim(),
      covenant: editCovenant.trim(),
      avatarPhoto,
      avatarColor,
    };
    onUpdateUser(updated);
    saveUserProfile(updated);
    setActivePanel(null);
  };

  // ── Save notifications ──
  const saveNotif = (key, val) => {
    const next = { ...notifs, [key]: val };
    setNotifs(next);
    try { localStorage.setItem('ff_notifs', JSON.stringify(next)); } catch(e) {}
  };

  // ── Save goals ──
  const saveGoals = () => {
    setSelectedGoals(pendingGoals);
    saveUserGoals(pendingGoals);
    setActivePanel(null);
  };

  // ── Save app settings ──
  const saveSettings = () => {
    const next = { ...appSettings, ...settingsLocal };
    onUpdateSettings(next);
    saveAppSettings(next);
    setActivePanel(null);
  };

  // ── File upload ──
  const handleFileUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Photo must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = ev => setAvatarPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  // ── Avatar display ──
  const AvatarDisplay = ({ size=72, fontSize=30, photo=avatarPhoto, color=avatarColor, name=user.name }) => (
    <div style={{ width:size, height:size, borderRadius:'50%', overflow:'hidden', background:color, display:'flex', alignItems:'center', justifyContent:'center', fontSize, fontWeight:700, color:'#fff', flexShrink:0, boxShadow:'0 4px 16px rgba(90,123,79,.25)' }}>
      {photo ? <img src={photo} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : (name||'Y').charAt(0).toUpperCase()}
    </div>
  );

  // ─── EDIT PROFILE PANEL ───
  if (activePanel === 'edit') return (
    <div className="fadeIn" style={{ display:'flex', flexDirection:'column', minHeight:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
        <BackBtn onClick={()=>setActivePanel(null)}/><div className="serif" style={{ fontSize:22, fontWeight:700 }}>Edit Profile</div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, marginBottom:24, padding:20, background:C.bgAlt, borderRadius:16, border:`1px solid ${C.border}` }}>
        <div style={{ position:'relative', cursor:'pointer' }} onClick={()=>fileInputRef.current?.click()}>
          <AvatarDisplay size={88} fontSize={36}/>
          <div style={{ position:'absolute', bottom:0, right:0, width:28, height:28, background:C.primary, borderRadius:'50%', border:'2.5px solid #fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx={12} cy={13} r={4}/></svg>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleFileUpload}/>
        <div style={{ fontSize:13, color:C.primary, fontWeight:600, cursor:'pointer' }} onClick={()=>fileInputRef.current?.click()}>Tap to upload a photo</div>
        <div style={{ fontSize:11, color:C.muted }}>JPG, PNG or GIF · Max 5MB</div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <div style={{ fontSize:11, color:C.muted }}>— or pick a color —</div>
          <div style={{ display:'flex', gap:8 }}>
            {['#5A7B4F','#C9A961','#6B3A1F','#8B5E3C','#5899C4','#7B5EA7','#C0575A'].map(col=>(
              <div key={col} onClick={()=>{ setAvatarColor(col); setAvatarPhoto(null); }}
                style={{ width:26, height:26, borderRadius:'50%', background:col, cursor:'pointer', outline:avatarColor===col&&!avatarPhoto?`3px solid ${C.text}`:'none', outlineOffset:2, transition:'transform .15s', transform:avatarColor===col&&!avatarPhoto?'scale(1.2)':'scale(1)' }}/>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:14, flex:1 }}>
        <Input label="First Name" value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Your name"/>
        <Input label="Email Address" type="email" value={editEmail} onChange={e=>setEditEmail(e.target.value)} placeholder="you@example.com"/>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:13, fontWeight:600, color:C.text }}>Wellness Covenant</label>
          <textarea value={editCovenant} onChange={e=>setEditCovenant(e.target.value)} rows={3} placeholder="I commit to honoring my body by..."
            style={{ border:`1.5px solid ${C.border}`, borderRadius:9, padding:'11px 13px', fontSize:14, color:C.text, resize:'none', lineHeight:1.55, background:C.white, width:'100%' }}/>
        </div>
      </div>
      <div style={{ position:'sticky', bottom:0, background:C.bg, paddingTop:16, marginTop:20, borderTop:`1px solid ${C.border}` }}>
        <Btn full onClick={saveProfile} style={{ fontSize:15, padding:15 }}><Check size={15}/> Save Profile</Btn>
        <button onClick={()=>setActivePanel(null)} style={{ width:'100%', padding:11, border:'none', background:'none', fontFamily:'Inter,sans-serif', fontSize:13, color:C.muted, cursor:'pointer', marginTop:6 }}>Cancel</button>
      </div>
    </div>
  );

  // ─── NOTIFICATIONS PANEL ───
  if (activePanel === 'notifications') return (
    <div className="fadeIn">
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
        <BackBtn onClick={()=>setActivePanel(null)}/><div className="serif" style={{ fontSize:22, fontWeight:700 }}>Notifications</div>
      </div>
      <div style={{ fontSize:13, color:C.muted, marginBottom:18, lineHeight:1.6 }}>Choose when Flourish & Faith reaches out to you.</div>
      {[
        { key:'devotional', label:'Daily Devotional',   sub:'Reminded each morning at 7:00 AM' },
        { key:'water',      label:'Water Reminders',    sub:'Gentle nudges throughout the day' },
        { key:'community',  label:'Community Activity', sub:'When someone reacts to your posts' },
        { key:'circles',    label:'Circle Updates',     sub:'Prayer requests & accountability check-ins' },
      ].map(n => (
        <div key={n.key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:`1px solid ${C.border}` }}>
          <div><div style={{ fontSize:14, fontWeight:500, color:C.text, marginBottom:2 }}>{n.label}</div><div style={{ fontSize:11, color:C.muted }}>{n.sub}</div></div>
          <div onClick={()=>saveNotif(n.key, !notifs[n.key])} style={{ width:44, height:24, borderRadius:99, background:notifs[n.key]?C.primary:'#ccc', cursor:'pointer', position:'relative', transition:'background .2s', flexShrink:0 }}>
            <div style={{ width:18, height:18, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:notifs[n.key]?23:3, transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,.2)' }}/>
          </div>
        </div>
      ))}
    </div>
  );

  // ─── SUBSCRIPTION PANEL ───
  if (activePanel === 'subscription') return (
    <div className="fadeIn">
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
        <BackBtn onClick={()=>setActivePanel(null)}/><div className="serif" style={{ fontSize:22, fontWeight:700 }}>Your Plan</div>
      </div>
      <Card style={{ textAlign:'center', padding:28, marginBottom:14 }}>
        <div style={{ fontSize:36, marginBottom:10 }}>{user.plan==='premium'?'✨':'🌱'}</div>
        <div className="serif" style={{ fontSize:28, fontWeight:700, color:C.text, marginBottom:4 }}>{user.plan==='premium'?'Premium':'Free Plan'}</div>
        <div style={{ fontSize:13, color:C.muted, marginBottom:16 }}>{user.plan==='premium'?'$9.99/month · Cancel anytime':'Free forever'}</div>
        <div style={{ display:'inline-flex', background:user.plan==='premium'?`${C.accent}22`:C.bgAlt, borderRadius:99, padding:'5px 18px', fontSize:12, fontWeight:700, color:user.plan==='premium'?C.accent:C.muted }}>
          {user.plan==='premium'?'Active':'Not subscribed to Premium'}
        </div>
      </Card>
      {user.plan!=='premium' && (
        <Card style={{ background:`linear-gradient(135deg, ${C.primary}10, ${C.accent}10)`, border:`1px solid ${C.accent}40` }}>
          <div style={{ fontWeight:600, fontSize:15, color:C.text, marginBottom:4 }}>Upgrade to Premium</div>
          <div style={{ fontSize:13, color:C.muted, marginBottom:14, lineHeight:1.6 }}>Unlock macro tracking, meal planner, accountability circles, and unlimited Sage AI.</div>
          <div className="serif" style={{ fontSize:32, fontWeight:700, color:C.primary, marginBottom:14 }}>$9.99<span style={{ fontSize:14, fontWeight:400, color:C.muted }}>/mo</span></div>
          <Btn full onClick={()=>{ const u={...user,plan:'premium'}; onUpdateUser(u); saveUserProfile(u); }}>Start 7-Day Free Trial ✨</Btn>
        </Card>
      )}
    </div>
  );

  // ─── GOALS PANEL ───
  if (activePanel === 'goals') return (
    <div className="fadeIn">
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
        <BackBtn onClick={()=>setActivePanel(null)}/><div className="serif" style={{ fontSize:22, fontWeight:700 }}>My Goals</div>
      </div>
      <div style={{ fontSize:13, color:C.muted, marginBottom:18, lineHeight:1.6 }}>Tap any goal to select or deselect it, then tap Save.</div>
      <div style={{ display:'flex', flexDirection:'column', gap:9, marginBottom:22 }}>
        {ALL_GOALS.map(g => {
          const sel = pendingGoals.includes(g);
          return (
            <div key={g} onClick={()=>setPendingGoals(p=>sel?p.filter(x=>x!==g):[...p,g])}
              style={{ padding:'13px 16px', borderRadius:12, border:`1.5px solid ${sel?C.primary:C.border}`, background:sel?`${C.primary}0D`:C.white, display:'flex', alignItems:'center', gap:12, cursor:'pointer', transition:'all .15s' }}>
              <div style={{ width:22, height:22, borderRadius:'50%', border:`2px solid ${sel?C.primary:C.border}`, background:sel?C.primary:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .15s' }}>
                {sel && <Check size={12} color="#fff"/>}
              </div>
              <span style={{ fontSize:14, color:C.text, fontWeight:sel?600:500 }}>{g}</span>
            </div>
          );
        })}
      </div>
      <Btn full onClick={saveGoals}><Check size={14}/> Save Goals</Btn>
    </div>
  );

  // ─── APP SETTINGS PANEL ───
  if (activePanel === 'settings') return (
    <div className="fadeIn">
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
        <BackBtn onClick={()=>setActivePanel(null)}/><div className="serif" style={{ fontSize:22, fontWeight:700 }}>App Settings</div>
      </div>

      {/* Weight unit */}
      <div style={{ borderBottom:`1px solid ${C.border}`, paddingBottom:16, marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:500, color:C.text, marginBottom:10 }}>Weight Unit</div>
        <div style={{ display:'flex', borderRadius:10, overflow:'hidden', border:`1.5px solid ${C.border}`, width:'fit-content' }}>
          {['lbs','kg'].map(u => (
            <div key={u} onClick={()=>setSettingsLocal(s=>({...s, weightUnit:u}))}
              style={{ padding:'10px 24px', fontSize:14, fontWeight:600, cursor:'pointer', background:settingsLocal.weightUnit===u?C.primary:C.white, color:settingsLocal.weightUnit===u?C.white:C.text, transition:'all .15s' }}>
              {u}
            </div>
          ))}
        </div>
      </div>

      {/* Daily calorie goal */}
      <div style={{ borderBottom:`1px solid ${C.border}`, paddingBottom:16, marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:500, color:C.text, marginBottom:6 }}>Daily Calorie Goal</div>
        <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>Used to calculate your food log progress ring.</div>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:10 }}>
          {[1400,1600,1800,2000,2200].map(cal => (
            <div key={cal} onClick={()=>setSettingsLocal(s=>({...s,calorieGoal:cal}))}
              style={{ padding:'8px 12px', borderRadius:8, border:`1.5px solid ${settingsLocal.calorieGoal===cal?C.primary:C.border}`, background:settingsLocal.calorieGoal===cal?`${C.primary}0D`:C.white, fontSize:12, fontWeight:600, cursor:'pointer', color:settingsLocal.calorieGoal===cal?C.primary:C.muted, transition:'all .15s' }}>
              {cal}
            </div>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ flex:1, position:'relative' }}>
            <input
              type="number" min="500" max="5000"
              value={settingsLocal.calorieGoal}
              onChange={e => {
                const raw = e.target.value;
                // Allow free typing — only apply when value is valid
                if (raw === '' || raw === '-') { setSettingsLocal(s=>({...s,calorieGoal:raw})); return; }
                const v = parseInt(raw);
                if (!isNaN(v)) setSettingsLocal(s=>({...s,calorieGoal:v}));
              }}
              onBlur={e => {
                // Clamp to valid range on blur
                const v = parseInt(e.target.value);
                if (isNaN(v) || v < 500) setSettingsLocal(s=>({...s,calorieGoal:500}));
                else if (v > 5000) setSettingsLocal(s=>({...s,calorieGoal:5000}));
              }}
              placeholder="Custom (e.g. 1750)"
              style={{ width:'100%', border:`1.5px solid ${C.border}`, borderRadius:9, padding:'10px 14px', fontSize:14, color:C.text, background:C.white, fontFamily:'inherit' }}
            />
          </div>
          <div style={{ fontSize:12, color:C.muted, whiteSpace:'nowrap' }}>kcal / day</div>
        </div>
      </div>

      {/* Daily water goal */}
      <div style={{ borderBottom:`1px solid ${C.border}`, paddingBottom:16, marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:500, color:C.text, marginBottom:6 }}>Daily Water Goal</div>
        <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>Number of cups (8 oz) to aim for each day.</div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {[6,8,10,12].map(n => (
            <div key={n} onClick={()=>setSettingsLocal(s=>({...s,waterGoal:n}))}
              style={{ padding:'8px 16px', borderRadius:8, border:`1.5px solid ${settingsLocal.waterGoal===n?C.primary:C.border}`, background:settingsLocal.waterGoal===n?`${C.primary}0D`:C.white, fontSize:13, fontWeight:600, cursor:'pointer', color:settingsLocal.waterGoal===n?C.primary:C.muted, transition:'all .15s' }}>
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* Version */}
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:C.muted, marginBottom:22 }}>
        <span>App Version</span><span>1.0.0</span>
      </div>

      <Btn full onClick={saveSettings}><Check size={14}/> Save Settings</Btn>
    </div>
  );

  // ─── MAIN PROFILE VIEW ───
  const menuItems = [
    { icon:Pencil,   label:'Edit Profile',          panel:'edit' },
    { icon:Bell,     label:'Notification Settings',  panel:'notifications' },
    { icon:Award,    label:'Subscription & Plan',    panel:'subscription' },
    { icon:Target,   label:'My Goals',               panel:'goals', badge: selectedGoals.length > 0 ? selectedGoals.length : null },
    { icon:Settings, label:'App Settings',           panel:'settings' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:15 }}>
      <Card style={{ textAlign:'center', padding:28 }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:12 }}>
          <AvatarDisplay/>
        </div>
        <div className="serif" style={{ fontSize:24, fontWeight:700, color:C.text, marginBottom:3 }}>{user.name}</div>
        <div style={{ fontSize:13, color:C.muted, marginBottom:12 }}>{user.email || ''}</div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:user.plan==='premium'?`${C.accent}22`:C.bgAlt, borderRadius:99, padding:'5px 16px' }}>
          {user.plan==='premium'
            ? <><Star size={12} color={C.accent}/><span style={{ fontSize:12, fontWeight:700, color:C.accent }}>Premium Member</span></>
            : <span style={{ fontSize:12, fontWeight:600, color:C.muted }}>Free Plan</span>}
        </div>
      </Card>

      {/* Stats row */}
      {(() => {
        const streak = calculateStreak();
        try {
          const journals = JSON.parse(localStorage.getItem('ff_journals') || '{}');
          const journalCount = Object.keys(journals).length;
          const weightHistory = JSON.parse(localStorage.getItem('ff_weight') || '[]');
          return (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
              {[
                { emoji:'🔥', val:streak, label:'Day Streak', color:streak>0?C.accent:'#ccc' },
                { emoji:'✍️', val:journalCount, label:'Journal Entries', color:journalCount>0?C.primary:'#ccc' },
                { emoji:'⚖️', val:weightHistory.length, label:'Weight Logs', color:weightHistory.length>0?'#3D6B33':'#ccc' },
              ].map(s => (
                <div key={s.label} style={{ background:C.bgAlt, borderRadius:14, padding:'14px 10px', textAlign:'center' }}>
                  <div style={{ fontSize:22, marginBottom:4 }}>{s.emoji}</div>
                  <div style={{ fontSize:22, fontWeight:800, color:s.val>0?C.text:C.muted, lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:10, color:C.muted, marginTop:3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          );
        } catch { return null; }
      })()}

      {/* 90-day activity calendar */}
      {(() => {
        const activityData = getActivityData();
        const cells = [];
        const today = new Date();
        for (let i = 89; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
          const a = activityData[key];
          cells.push({ key, active: !!a?.devotion, today: i===0 });
        }
        const totalActive = cells.filter(c=>c.active).length;
        return (
          <Card>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div style={{ fontWeight:700, fontSize:14, color:C.text }}>90-Day Activity</div>
              <div style={{ fontSize:12, color:C.primary, fontWeight:600 }}>{totalActive} days active</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(13, 1fr)', gap:3 }}>
              {cells.map(cell => (
                <div key={cell.key} style={{ aspectRatio:'1', borderRadius:3, background: cell.today ? C.accent : cell.active ? C.primary : `${C.primary}18`, border: cell.today ? `1.5px solid ${C.accent}` : 'none', transition:'background .3s' }}/>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:10, justifyContent:'flex-end' }}>
              <div style={{ width:10, height:10, borderRadius:2, background:`${C.primary}18` }}/>
              <span style={{ fontSize:10, color:C.muted }}>No activity</span>
              <div style={{ width:10, height:10, borderRadius:2, background:C.primary, marginLeft:6 }}/>
              <span style={{ fontSize:10, color:C.muted }}>Active day</span>
              <div style={{ width:10, height:10, borderRadius:2, background:C.accent, marginLeft:6 }}/>
              <span style={{ fontSize:10, color:C.muted }}>Today</span>
            </div>
          </Card>
        );
      })()}

      {/* Goals summary */}
      {selectedGoals.length > 0 && (
        <Card>
          <div style={{ fontSize:11, fontWeight:700, color:C.primary, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>My Wellness Goals</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {selectedGoals.map(g => (
              <div key={g} style={{ background:`${C.primary}12`, borderRadius:99, padding:'4px 12px', fontSize:12, color:C.primary, fontWeight:500 }}>{g}</div>
            ))}
          </div>
        </Card>
      )}

      <Card style={{ borderLeft:`4px solid ${C.accent}`, borderRadius:'0 14px 14px 0' }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.accent, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>My Wellness Covenant</div>
        <div style={{ fontSize:14, color:C.text, fontStyle:'italic', lineHeight:1.65 }}>"{user.covenant || 'I commit to stewarding my health with grace and discipline.'}"</div>
      </Card>

      {user.plan!=='premium' && (
        <div style={{ background:`linear-gradient(135deg, ${C.primary}15, ${C.accent}18)`, border:`1.5px solid ${C.accent}50`, borderRadius:14, padding:18, textAlign:'center' }}>
          <div style={{ fontWeight:600, fontSize:14, color:C.text, marginBottom:4 }}>✨ Upgrade to Premium</div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:12 }}>Unlock meal planning, accountability circles, macro tracking & more.</div>
          <Btn small onClick={()=>setActivePanel('subscription')} style={{ background:C.accent, color:C.text, border:'none' }}>Start 7-Day Free Trial</Btn>
        </div>
      )}

      <Card pad={0} style={{ overflow:'hidden' }}>
        {menuItems.map((item, i) => (
          <div key={item.label} onClick={()=>setActivePanel(item.panel)} className="nav-item"
            style={{ display:'flex', alignItems:'center', gap:13, padding:'13px 17px', borderBottom:i<menuItems.length-1?`1px solid ${C.border}`:'none', cursor:'pointer' }}>
            <item.icon size={16} color={C.primary}/>
            <span style={{ fontSize:14, fontWeight:500, color:C.text, flex:1 }}>{item.label}</span>
            {item.badge && (
              <div style={{ background:C.primary, color:'#fff', borderRadius:99, fontSize:10, fontWeight:700, padding:'2px 8px', marginRight:6 }}>{item.badge}</div>
            )}
            <ChevronRight size={13} color={C.muted}/>
          </div>
        ))}
      </Card>

      <Btn full variant="ghost" onClick={onSignOut} style={{ color:'#B91C1C', display:'flex', alignItems:'center', gap:8, justifyContent:'center', fontWeight:600 }}>
        <LogOut size={14}/> Sign Out
      </Btn>
    </div>
  );
}



// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function MainApp({ user: initialUser, onSignOut }) {
  // Merge saved profile over the auth-provided user (name, email survive re-login)
  const savedProfile = loadUserProfile();
  const mergedUser = savedProfile
    ? { ...initialUser, ...savedProfile, plan: initialUser.plan || savedProfile.plan || 'free' }
    : initialUser;

  const [user, setUser] = useState(mergedUser);

  // App-wide settings (calorie goal, water goal, weight unit) — persisted
  const defaultSettings = { calorieGoal: 1800, waterGoal: 8, weightUnit: 'lbs' };
  const [appSettings, setAppSettings] = useState(() => ({ ...defaultSettings, ...(loadAppSettings() || {}) }));
  const [tab, setTab] = useState('home');
  const [trackView, setTrackView] = useState('overview');
  const [isMobile, setIsMobile] = useState(typeof window!=='undefined' && window.innerWidth < 768);

  // ── Lifted tracking state (daily reset via localStorage) ──
  const [dailyLoaded, setDailyLoaded] = useState(false);
  const [foodItems, setFoodItemsRaw] = useState([]);
  const [waterCups, setWaterCupsRaw] = useState(0);
  const [weightEntries, setWeightEntries] = useState([]);
  const [moveItems, setMoveItemsRaw] = useState([]);
  const [posts, setPosts] = useState([]);
  const [devCompletedToday, setDevCompletedToday] = useState(false);

  // Wrap setters to also persist to localStorage
  const persist = (key, val) => {
    try {
      const saved = JSON.parse(localStorage.getItem('ff_daily') || '{}');
      localStorage.setItem('ff_daily', JSON.stringify({ ...saved, date: getTodayKey(), [key]: val }));
    } catch(e) {}
  };
  const setFoodItems = v => { const next = typeof v === 'function' ? v(foodItems) : v; setFoodItemsRaw(next); persist('food', next); };
  const setWaterCups = v => {
    const next = typeof v === 'function' ? v(waterCups) : v;
    setWaterCupsRaw(next);
    persist('water', next);
    // Track weekly water goal completion (once per day)
    if (next >= 8 && waterCups < 8) {
      try {
        const wk = JSON.parse(localStorage.getItem('ff_week') || '{}');
        const key = getWeekKey();
        const cur = wk[key] || { devs:0, water:0, move:0 };
        if (cur.water < 7) { cur.water = Math.min((cur.water||0)+1, 7); }
        localStorage.setItem('ff_week', JSON.stringify({ ...wk, [key]: cur }));
      } catch(e) {}
    }
  };
  const setMoveItems = v => {
    const next = typeof v === 'function' ? v(moveItems) : v;
    setMoveItemsRaw(next);
    persist('movement', next);
    // Track weekly movement (count sessions, max 5 per week)
    if (next.length > moveItems.length) {
      try {
        const wk = JSON.parse(localStorage.getItem('ff_week') || '{}');
        const key = getWeekKey();
        const cur = wk[key] || { devs:0, water:0, move:0 };
        cur.move = Math.min((cur.move||0)+1, 5);
        localStorage.setItem('ff_week', JSON.stringify({ ...wk, [key]: cur }));
      } catch(e) {}
    }
  };
  const setPostsAndSave = v => {
    const next = typeof v === 'function' ? v(posts) : v;
    setPosts(next);
    try { localStorage.setItem('ff_posts', JSON.stringify(next)); } catch(e) {}
  };
  const completeDevotional = () => {
    setDevCompletedToday(true);
    persist('devDone', true);
    // Increment weekly devotional count
    try {
      const wk = JSON.parse(localStorage.getItem('ff_week') || '{}');
      const wkKey = getWeekKey();
      const cur = wk[wkKey] || { devs:0, water:0, move:0 };
      cur.devs = Math.min((cur.devs||0) + 1, 7);
      localStorage.setItem('ff_week', JSON.stringify({ ...wk, [wkKey]: cur }));
    } catch(e) {}
  };

  // Load daily state on mount — resets automatically if it's a new day
  useEffect(() => {
    const daily = loadDailyState();
    setFoodItemsRaw(daily.food || []);
    setWaterCupsRaw(daily.water || 0);
    setMoveItemsRaw(daily.movement || []);
    setDevCompletedToday(daily.devDone || false);
    // Weight persists across days (not daily)
    try {
      const saved = JSON.parse(localStorage.getItem('ff_weight') || '[]');
      setWeightEntries(saved);
    } catch(e) {}
    // Posts persist until user clears them
    try {
      const savedPosts = JSON.parse(localStorage.getItem('ff_posts') || '[]');
      setPosts(savedPosts);
    } catch(e) {}
    // Init weekly tracking key if new week
    initWeeklyTracking();
    setDailyLoaded(true);
  }, []);

  // Persist weight separately (keeps history across days)
  const setWeightEntriesAndSave = v => {
    const next = typeof v === 'function' ? v(weightEntries) : v;
    setWeightEntries(next);
    try { localStorage.setItem('ff_weight', JSON.stringify(next)); } catch(e) {}
  };

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const handleUpdateUser = updates => {
    const next = { ...user, ...updates };
    setUser(next);
    saveUserProfile(next);
  };

  const handleUpgrade = () => {
    const upgraded = { ...user, plan: 'premium' };
    setUser(upgraded);
    saveUserProfile(upgraded);
  };

  const handleUpdateSettings = updates => {
    const next = { ...appSettings, ...updates };
    setAppSettings(next);
    saveAppSettings(next);
  };

  const navigate = (newTab, view = 'overview') => {
    setTab(newTab);
    if (newTab === 'track') setTrackView(view);
  };

  const navItems = [
    { id:'home', icon:Home, label:'Home' },
    { id:'track', icon:BarChart2, label:'Track' },
    { id:'community', icon:Users, label:'Community' },
    { id:'sage', icon:MessageCircle, label:'Sage' },
    { id:'profile', icon:User, label:'Profile' },
  ];

  if (!dailyLoaded) return (
    <div style={{ minHeight:'100vh', background:C.bgAlt, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontSize:36 }}>🌿</div>
    </div>
  );

  return (
    <div className="ff-app" style={{ display:'flex', height:'100vh', background:C.bgAlt, overflow:'hidden' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div style={{ width:256, flexShrink:0, background:C.bg, borderRight:`1px solid ${C.border}`, height:'100vh', display:'flex', flexDirection:'column', padding:'22px 14px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:34, paddingLeft:8 }}>
            <div style={{ width:34, height:34, background:C.primary, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🌿</div>
            <span className="serif" style={{ fontSize:17, fontWeight:700, color:C.text }}>Flourish & Faith</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:3, flex:1 }}>
            {navItems.map(item => (
              <div key={item.id} onClick={() => navigate(item.id)} className={`nav-item${tab===item.id?' nav-active':''}`}
                style={{ display:'flex', alignItems:'center', gap:11, padding:'11px 13px', borderRadius:10, background:tab===item.id?C.primary:'transparent', color:tab===item.id?C.white:C.text, cursor:'pointer' }}>
                <item.icon size={17}/><span style={{ fontSize:14, fontWeight:600 }}>{item.label}</span>
                {item.id==='sage' && <div style={{ marginLeft:'auto', width:8, height:8, borderRadius:'50%', background:C.accent }}/>}
              </div>
            ))}
          </div>
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14 }}>
            {/* User mini card */}
            <div onClick={()=>navigate('profile')} className="nav-item" style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 13px', cursor:'pointer', borderRadius:10, marginBottom:6 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:user?.avatarColor||C.primary, flexShrink:0, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff' }}>
                {user?.avatarPhoto
                  ? <img src={user.avatarPhoto} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                  : (user?.name||'Y').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name||'My Account'}</div>
                <div style={{ fontSize:10, color:C.muted }}>{user?.plan==='premium'?'✨ Premium':'Free Plan'}</div>
              </div>
            </div>
            <div onClick={onSignOut} className="nav-item" style={{ display:'flex', alignItems:'center', gap:11, padding:'10px 13px', color:'#B91C1C', cursor:'pointer', borderRadius:10 }}>
              <LogOut size={16}/><span style={{ fontSize:13 }}>Sign Out</span>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {isMobile && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 17px', background:C.bg, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:27, height:27, background:C.primary, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>🌿</div>
              <span className="serif" style={{ fontSize:16, fontWeight:700, color:C.text }}>Flourish & Faith</span>
            </div>
            <Bell size={18} color={C.muted}/>
          </div>
        )}

        <div key={tab} className="fadeIn scroll" style={{ flex:1, overflowY:'auto', padding:isMobile?'18px 16px 90px':'26px 30px' }}>
          <div style={{ maxWidth: tab==='home' ? 'none' : 700, margin:'0 auto' }}>
            {tab==='home' && (
              <HomeTab
                user={user}
                onNavigate={navigate}
                foodItems={foodItems}
                waterCups={waterCups}
                weightEntries={weightEntries}
                moveItems={moveItems}
                posts={posts}
                devCompletedToday={devCompletedToday}
                onComplete={completeDevotional}
                appSettings={appSettings}
              />
            )}
            {tab==='track' && (
              <TrackTab
                initView={trackView}
                foodItems={foodItems} setFoodItems={setFoodItems}
                waterCups={waterCups} setWaterCups={setWaterCups}
                weightEntries={weightEntries} setWeightEntries={setWeightEntriesAndSave}
                moveItems={moveItems} setMoveItems={setMoveItems}
                appSettings={appSettings}
                user={user} onUpgrade={handleUpgrade}
              />
            )}
            {tab==='community' && <CommunityTab user={user} posts={posts} setPosts={setPostsAndSave}/>}
            {tab==='sage' && <SageTab user={user}/>}
            {tab==='profile' && <ProfileTab user={user} onSignOut={onSignOut} onUpdateUser={handleUpdateUser} appSettings={appSettings} onUpdateSettings={handleUpdateSettings}/>}
          </div>
        </div>

        {/* Mobile bottom nav */}
        {isMobile && (
          <div style={{ display:'flex', background:C.bg, borderTop:`1px solid ${C.border}`, flexShrink:0, paddingBottom:'env(safe-area-inset-bottom,0px)' }}>
            {navItems.map(item => (
              <div key={item.id} onClick={() => navigate(item.id)}
                style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'9px 0 7px', cursor:'pointer', color:tab===item.id?C.primary:C.muted, transition:'color 0.15s', position:'relative' }}>
                <item.icon size={20}/>
                <span style={{ fontSize:10, fontWeight:600, marginTop:3 }}>{item.label}</span>
                {item.id==='sage' && <div style={{ position:'absolute', top:7, right:'calc(50% - 14px)', width:7, height:7, borderRadius:'50%', background:C.accent }}/>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────

const LP = {
  // Extra landing-specific styles injected once
  css: `
    html { scroll-behavior: smooth; }
    .lp-nav { position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px); background: rgba(254,253,251,0.92); border-bottom: 1px solid #DDD9D0; }
    .lp-btn-hero { transition: all .2s; }
    .lp-btn-hero:hover { background: #3B6331 !important; transform: translateY(-2px); box-shadow: 0 10px 32px rgba(90,123,79,.4) !important; }
    .lp-btn-outline:hover { background: #5A7B4F !important; color: #fff !important; }
    .lp-btn-gold:hover { filter: brightness(1.07); transform: translateY(-2px); }
    .lp-feat-card { transition: transform .22s, box-shadow .22s; }
    .lp-feat-card:hover { transform: translateY(-5px); box-shadow: 0 14px 44px rgba(44,62,42,.14) !important; }
    .lp-test-card { transition: background .2s; }
    .lp-test-card:hover { background: rgba(255,255,255,.08) !important; }
    .lp-price-card { transition: transform .2s; }
    .lp-price-card:hover { transform: translateY(-4px); }
    .lp-faq-trigger:hover .lp-faq-q { color: #5A7B4F; }
    .lp-menu-link:hover { color: #5A7B4F !important; }
    @keyframes lp-float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    @keyframes lp-float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
    @keyframes lp-reveal { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
    .lp-reveal { animation: lp-reveal .6s ease both; }
    .lp-reveal-d1 { animation-delay: .1s; }
    .lp-reveal-d2 { animation-delay: .2s; }
    .lp-reveal-d3 { animation-delay: .3s; }

    /* ══════════════════════════════════════════════════
       MOBILE — screens under 768px
       Fixes: hero text, testimonials, feature cards,
              stats bar 2×2, section spacing
    ══════════════════════════════════════════════════ */
    @media (max-width: 768px) {

      /* ── 1. Hero text — 36px+ h1 on mobile ── */
      .lp-hero-h1 {
        font-size: 40px !important;
        line-height: 1.08 !important;
        letter-spacing: -0.5px !important;
      }
      .lp-hero-sub {
        font-size: 16px !important;
        line-height: 1.7 !important;
        max-width: 100% !important;
      }
      .lp-section-h2 {
        font-size: 30px !important;
        line-height: 1.15 !important;
        margin-bottom: 28px !important;
      }

      /* Hero layout — single column, centered */
      .lp-hero-grid {
        grid-template-columns: 1fr !important;
        gap: 32px !important;
        text-align: center !important;
        padding: 0 20px !important;
      }
      .lp-hero-grid > div:last-child { display: none !important; }
      .lp-hero-actions {
        flex-direction: column !important;
        gap: 12px !important;
        align-items: stretch !important;
      }
      .lp-hero-actions > * {
        width: 100% !important;
        text-align: center !important;
        justify-content: center !important;
      }
      .lp-hero-section {
        padding: 60px 0 50px !important;
      }

      /* ── 2. Testimonials — single column, readable ── */
      .lp-testimonials-grid {
        grid-template-columns: 1fr !important;
        gap: 18px !important;
        padding: 0 4px !important;
      }
      .lp-test-card {
        padding: 26px 22px !important;
        border-radius: 18px !important;
      }
      .lp-test-quote {
        font-size: 15px !important;
        line-height: 1.72 !important;
        margin-bottom: 18px !important;
      }
      .lp-test-card img {
        width: 48px !important;
        height: 48px !important;
      }

      /* ── 3. Feature cards — 24px padding, 2-col then 1-col ── */
      .lp-features-grid {
        grid-template-columns: 1fr 1fr !important;
        gap: 14px !important;
        padding: 0 4px !important;
      }
      .lp-feat-card {
        padding: 24px !important;
        border-radius: 16px !important;
      }
      .lp-feat-card h3 {
        font-size: 15px !important;
      }
      .lp-feat-card p {
        font-size: 13px !important;
        line-height: 1.6 !important;
      }

      /* ── 4. Stats bar — 2×2 grid ── */
      .lp-stats-section {
        padding: 32px 0 !important;
      }
      .lp-stats-grid {
        grid-template-columns: 1fr 1fr !important;
        gap: 28px 16px !important;
        padding: 0 20px !important;
        max-width: 100% !important;
      }
      .lp-stats-grid > div {
        text-align: center !important;
      }
      .lp-stats-grid > div > div:first-child {
        font-size: 32px !important;
      }

      /* ── FAQ accordion grid — single column on mobile ── */
      .lp-faq-accordion-grid {
        grid-template-columns: 1fr !important;
      }
      .lp-section {
        padding: 40px 20px !important;
      }
      .lp-faq-section {
        padding: 40px 20px !important;
      }

      /* Pricing — single column */
      .lp-pricing-grid {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
        max-width: 100% !important;
        padding: 0 4px !important;
      }

      /* Footer — 2-col */
      .lp-footer-grid {
        grid-template-columns: 1fr 1fr !important;
        gap: 28px 20px !important;
      }

      /* Nav — hide desktop links */
      .lp-nav-links { display: none !important; }

      /* Trust row */
      .lp-trust-row {
        justify-content: center !important;
        flex-wrap: wrap !important;
        gap: 10px !important;
      }

      /* Scripture break */
      .lp-scripture-text {
        font-size: 22px !important;
        line-height: 1.55 !important;
        padding: 0 4px !important;
      }

      /* App dashboard grids */
      .programs-grid { grid-template-columns: 1fr !important; }
      .metrics-grid  { grid-template-columns: 1fr 1fr !important; }
      .main-grid     { grid-template-columns: 1fr !important; }
    }

    /* ── Extra small — under 480px ─────────────────────── */
    @media (max-width: 480px) {
      .lp-hero-h1    { font-size: 36px !important; line-height: 1.1 !important; }
      .lp-section-h2 { font-size: 26px !important; }
      .lp-hero-sub   { font-size: 15px !important; }

      /* Feature cards: 1-col on very small screens */
      .lp-features-grid {
        grid-template-columns: 1fr !important;
      }
      .lp-feat-card  { padding: 22px 18px !important; }

      /* Stats still 2×2 */
      .lp-stats-grid {
        grid-template-columns: 1fr 1fr !important;
        gap: 16px 12px !important;
        padding: 0 16px !important;
      }

      /* Footer: single column on very small */
      .lp-footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }

      /* Testimonial cards: reduce padding slightly */
      .lp-test-card  { padding: 20px 18px !important; }
      .lp-test-quote { font-size: 14px !important; }

      /* Section spacing tighter on tiny screens */
      .lp-section        { padding: 36px 16px !important; }
      .lp-hero-section   { padding: 48px 0 40px !important; }
      .lp-hero-grid      { padding: 0 16px !important; }
    }
  `,
};

// SVG avatar for trust row
function TrustAvatar({ fill, skin }) {
  return (
    <svg width={34} height={34} viewBox="0 0 34 34" style={{ borderRadius:'50%', border:'2.5px solid #FEFDFB', marginLeft:-9, flexShrink:0 }}>
      <circle cx={17} cy={17} r={17} fill={fill}/>
      <circle cx={17} cy={13} r={6} fill={skin}/>
      <path d="M5 31c0-7 5-11 12-11s12 4 12 11z" fill={skin}/>
    </svg>
  );
}

// SVG star
function Star5({ size=14, color='#C9A961' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

// Feature SVG icons
const FEAT_ICONS = {
  book: <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#5A7B4F" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  heart: <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#C9A961" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  people: <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#5899C4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx={9} cy={7} r={4}/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  sun: <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={3}/><path d="M12 2v3m0 14v3M4.22 4.22l2.12 2.12m11.32 11.32 2.12 2.12M2 12h3m14 0h3M4.22 19.78l2.12-2.12M18.66 5.34l2.12-2.12"/></svg>,
};

const LP_FEATURES = [
  { icon:'book', bg:'rgba(90,123,79,.12)', title:'Daily Devotionals', desc:'365 faith-wellness devotionals connecting Scripture to your physical journey. Track streaks and journal your reflections.' },
  { icon:'heart', bg:'rgba(201,169,97,.15)', title:'Grace-Centered Tracking', desc:'Log food, water, weight, and movement without shame. Encouraging feedback that celebrates progress, not punishes setbacks.' },
  { icon:'people', bg:'rgba(168,216,234,.25)', title:'Accountability Circles', desc:'Small groups of 5–8 women to share prayer requests, celebrate wins, and walk the journey together.', premium:true },
  { icon:'sun', bg:'rgba(184,134,11,.15)', title:'Sage AI Coach', desc:'Your faith-integrated AI wellness coach. Ask anything — meal ideas, motivation, Scripture for hard days.' },
];

const LP_TESTIMONIALS = [
  {
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    name:'Tamara J.', loc:'Atlanta, Georgia · 21-Day Streak',
    quote:'Flourish & Faith changed how I see my body entirely. I stopped fighting myself and started caring for myself. The devotionals helped me understand that self-care isn\'t selfish — it\'s worship.'
  },
  {
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    name:'Michelle R.', loc:'Charlotte, NC · 3 months strong',
    quote:'I\'ve tried every fitness app. None of them understood why I was struggling. Sage talked me through a hard week like a sister would. I\'m not quitting this time.'
  },
  {
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
    name:'Denise W.', loc:'Houston, TX · Circle Leader',
    quote:'My accountability circle is everything. Five women who pray for each other, celebrate every win, and never judge a hard day. I found my people here.'
  },
];

const LP_FAQ = [
  { q:'Is Flourish & Faith only for weight loss?', a:'Not at all. Many of our members are here to build healthier habits, strengthen their faith, find community, or simply honor their bodies. Weight loss may be one goal for some women, but it\'s never the only focus — and we never use shame-based language.' },
  { q:'What denomination is this app for?', a:'Flourish & Faith is for Christian women of all denominations and backgrounds. Our devotionals draw from Scripture broadly — not any specific denominational tradition. All are welcome here.' },
  { q:'How is Sage different from ChatGPT?', a:'Sage is trained on grace-centered, faith-integrated wellness principles. She literally cannot use shame language, knows your Wellness Covenant and goals, and weaves Scripture naturally into her responses — like a wise, encouraging sister in the faith.' },
  { q:'What happens after my 7-day free trial?', a:'After your trial, you\'ll continue on Premium at $9.99/month. You can cancel anytime before the trial ends and you won\'t be charged. No tricks, no dark patterns.' },
  { q:'Is my data private?', a:'Yes. Your health data, journal entries, and prayer requests are encrypted and completely private. We never sell your data, and you can delete your account at any time.' },
  { q:'Does it work on my phone without downloading?', a:'Yes! Flourish & Faith is a Progressive Web App (PWA). It works in your mobile browser and you can add it to your home screen for a native app experience — no App Store required.' },
];

function LandingPage({ onSignup, onSignIn }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(()=>{
    const el = document.createElement('style');
    el.id = 'lp-extra-styles';
    el.textContent = LP.css;
    document.head.appendChild(el);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => { document.head.removeChild(el); window.removeEventListener('scroll', onScroll); };
  }, []);

  const S = { // shared style helpers
    serif: { fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif" },
    sans: { fontFamily:"'DM Sans', system-ui, sans-serif" },
    container: { maxWidth:1100, margin:'0 auto', padding:'0 24px' },
  };

  return (
    <div style={{ ...S.sans, background:C.bg, color:C.text, overflowX:'hidden' }}>

      {/* ── NAV ── */}
      <nav className="lp-nav" style={{ padding:'14px 0' }}>
        <div style={{ ...S.container, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            <div style={{ width:34, height:34, background:C.primary, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            </div>
            <span style={{ ...S.serif, fontSize:18, fontWeight:700, color:C.text }}>Flourish & Faith</span>
          </div>
          <div className="lp-nav-links" style={{ display:'flex', gap:12 }}>
            <button className="lp-btn-outline" onClick={onSignIn} style={{ padding:'9px 18px', border:`1.5px solid ${C.primary}`, borderRadius:10, background:'transparent', color:C.primary, fontSize:14, fontWeight:600, cursor:'pointer' }}>Sign In</button>
            <button className="lp-btn-hero" onClick={onSignup} style={{ padding:'10px 20px', background:C.primary, border:'none', borderRadius:10, color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', boxShadow:'0 4px 16px rgba(90,123,79,.3)' }}>Start Free ✨</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero-section" style={{ background:`linear-gradient(145deg, ${C.bgAlt} 0%, ${C.bg} 55%, #EDF4E9 100%)`, padding:'80px 0 100px', position:'relative', overflow:'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position:'absolute', top:-120, right:-120, width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(90,123,79,.1) 0%, transparent 70%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-80, left:-80, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(201,169,97,.1) 0%, transparent 70%)', pointerEvents:'none' }}/>

        <div className="lp-hero-grid" style={{ ...S.container, display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center', position:'relative' }}>
          {/* Left */}
          <div>
            <div className="lp-reveal" style={{ display:'inline-flex', alignItems:'center', gap:7, background:C.bgAlt, border:`1px solid ${C.border}`, borderRadius:99, padding:'6px 16px', fontSize:12, fontWeight:500, color:C.muted, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:22 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#7FA876', display:'inline-block' }}/>
              Faith-Integrated Wellness · For Christian Women
            </div>
            <h1 className="lp-reveal lp-reveal-d1 lp-hero-h1" style={{ ...S.serif, fontSize:'clamp(48px, 5.5vw, 80px)', fontWeight:700, lineHeight:1.0, color:C.text, letterSpacing:'-1px', marginBottom:20 }}>
              Honor your body.<br/><em style={{ fontStyle:'italic', color:C.primary }}>Deepen</em> your faith.
            </h1>
            <p className="lp-reveal lp-reveal-d2 lp-hero-sub" style={{ fontSize:17, color:C.muted, lineHeight:1.72, marginBottom:28, maxWidth:480 }}>
              Daily devotionals, grace-centered tracking, and a community of women who understand that caring for your body is an act of worship.
            </p>
            <div className="lp-reveal lp-reveal-d3 lp-hero-actions" style={{ display:'flex', flexWrap:'wrap', gap:12, marginBottom:28 }}>
              <button className="lp-btn-hero" onClick={onSignup} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'16px 30px', background:C.primary, border:'none', borderRadius:12, color:'#fff', fontSize:16, fontWeight:600, cursor:'pointer', boxShadow:'0 6px 24px rgba(90,123,79,.3)' }}>
                Start Free Today ✨
              </button>
              <button className="lp-btn-outline" onClick={onSignIn} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'15px 28px', background:'transparent', border:`1.5px solid ${C.primary}`, borderRadius:12, color:C.primary, fontSize:16, fontWeight:600, cursor:'pointer' }}>
                Sign In
              </button>
            </div>
            {/* Trust row */}
            <div className="lp-reveal lp-trust-row" style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ display:'flex' }}>
                {[['#7B4F2E','#C47A4A'],['#9B6040','#D4915A'],['#5C3317','#A0622A'],['#B07440','#E0A870']].map(([f,s],i)=>(
                  <TrustAvatar key={i} fill={f} skin={s}/>
                ))}
              </div>
              <div style={{ fontSize:13, color:C.muted, lineHeight:1.4 }}>
                <strong style={{ color:C.text, display:'block' }}>Join 50,000+ women flourishing</strong>
                walking this journey in faith & grace
              </div>
            </div>
          </div>

          {/* Right — phone mockup */}
          <div style={{ display:'flex', justifyContent:'center', position:'relative' }}>
            {/* Floating badges */}
            <div style={{ position:'absolute', top:30, left:-44, background:C.bg, borderRadius:16, padding:'10px 14px', boxShadow:'0 8px 28px rgba(44,62,42,.18)', display:'flex', alignItems:'center', gap:10, animation:'lp-float1 3.5s ease-in-out infinite', zIndex:2 }}>
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#E85D04" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
              <div><div style={{ fontSize:13, fontWeight:700, color:C.text }}>21-Day Streak</div><div style={{ fontSize:10, color:C.muted }}>Devotional Streak</div></div>
            </div>

            {/* Phone */}
            <div style={{ width:270, background:'#1A1A1A', borderRadius:42, padding:10, boxShadow:'0 40px 90px rgba(0,0,0,.3)', position:'relative', zIndex:1 }}>
              <div style={{ background:C.bg, borderRadius:34, overflow:'hidden' }}>
                <div style={{ width:100, height:26, background:'#1A1A1A', borderRadius:'0 0 16px 16px', margin:'0 auto' }}/>
                {/* Dev card */}
                <div style={{ background:`linear-gradient(140deg, ${C.primary}, #3B6331)`, margin:10, borderRadius:16, padding:14, color:'#fff' }}>
                  <div style={{ fontSize:9, opacity:.75, marginBottom:4 }}>Today · March 21</div>
                  <div style={{ ...S.serif, fontSize:17, fontWeight:700, marginBottom:4 }}>Your Body is a Temple</div>
                  <div style={{ fontSize:9, opacity:.8, fontStyle:'italic' }}>📖 1 Corinthians 6:19-20</div>
                </div>
                {/* Tiles */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, margin:'0 10px 10px' }}>
                  {[['🍴','Food Log','1,440 cal'],['💧','Water','6/8 cups'],['⚖️','Weight','163 lbs'],['🏃','Movement','3/5 days']].map(([icon,label,val])=>(
                    <div key={label} style={{ background:C.bgAlt, borderRadius:11, padding:9 }}>
                      <div style={{ fontSize:16, marginBottom:4 }}>{icon}</div>
                      <div style={{ fontSize:9, fontWeight:600, color:C.text }}>{label}</div>
                      <div style={{ fontSize:8, color:C.muted, marginTop:1 }}>{val}</div>
                    </div>
                  ))}
                </div>
                {/* Streak bar */}
                <div style={{ background:C.accent, margin:'0 10px 10px', borderRadius:10, padding:'8px 12px', display:'flex', alignItems:'center', gap:6, fontSize:10, fontWeight:700, color:C.text }}>
                  <span>✨</span><span>7-day devotional streak! Keep going!</span>
                </div>
              </div>
            </div>

            <div style={{ position:'absolute', bottom:70, right:-40, background:C.bg, borderRadius:16, padding:'10px 14px', boxShadow:'0 8px 28px rgba(44,62,42,.18)', display:'flex', alignItems:'center', gap:10, animation:'lp-float2 4s ease-in-out infinite', zIndex:2 }}>
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#5A7B4F" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <div><div style={{ fontSize:13, fontWeight:700, color:C.text }}>Sarah is praying for you</div><div style={{ fontSize:10, color:C.muted }}>Circle Accountability</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="lp-stats-section" style={{ background:C.primary, padding:'26px 0' }}>
        <div className="lp-stats-grid" style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, alignItems:'center' }}>
          {[['50K+','Women Flourishing'],['365','Daily Devotionals'],['4.9','Average Rating'],['60%','Daily Completion']].map(([n,l],i)=>(
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ ...S.serif, fontSize:38, fontWeight:700, color:'#fff', lineHeight:1, display:'flex', alignItems:'center', gap:5, justifyContent:'center' }}>
                {n}{l==='Average Rating' && <Star5 size={28} color="#E8C468"/>}
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', marginTop:3, textTransform:'uppercase', letterSpacing:'.04em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="lp-section" style={{ background:C.bgAlt, padding:'90px 0' }}>
        <div style={S.container}>
          <div style={{ fontSize:11, fontWeight:500, color:C.muted, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:14, display:'inline-flex', alignItems:'center', gap:7, background:C.bg, border:`1px solid ${C.border}`, borderRadius:99, padding:'5px 15px' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#7FA876', display:'inline-block' }}/>Everything You Need
          </div>
          <h2 className="lp-section-h2" style={{ ...S.serif, fontSize:'clamp(32px,4vw,52px)', fontWeight:700, lineHeight:1.1, color:C.text, marginBottom:14 }}>
            Wellness designed for the <em style={{ fontStyle:'italic', color:C.primary }}>whole</em> woman
          </h2>
          <p style={{ fontSize:16, color:C.muted, lineHeight:1.7, maxWidth:540, marginBottom:50 }}>
            Faith, nutrition, movement, and community — woven together the way God intended.
          </p>
          <div className="lp-features-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:18 }}>
            {LP_FEATURES.map(f=>(
              <div key={f.title} className="lp-feat-card" style={{ background:C.bg, borderRadius:20, padding:26, boxShadow:'0 2px 16px rgba(44,62,42,.06)', border:'1px solid transparent' }}>
                <div style={{ width:50, height:50, borderRadius:14, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>{FEAT_ICONS[f.icon]}</div>
                <div style={{ ...S.serif, fontSize:20, fontWeight:700, color:C.text, marginBottom:8 }}>{f.title}</div>
                <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, margin:0 }}>{f.desc}</p>
                {f.premium && (
                  <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:'rgba(201,169,97,.18)', borderRadius:99, padding:'3px 10px', fontSize:10, fontWeight:600, color:C.accent, marginTop:12 }}>
                    <Star5 size={11}/> Premium
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="lp-section" style={{ background:C.text, padding:'90px 0' }}>
        <div style={S.container}>
          <div style={{ fontSize:11, fontWeight:500, color:'rgba(255,255,255,.6)', letterSpacing:'.04em', textTransform:'uppercase', marginBottom:14, display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.15)', borderRadius:99, padding:'5px 15px' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:C.accent, display:'inline-block' }}/>Real Women, Real Transformation
          </div>
          <h2 className="lp-section-h2" style={{ ...S.serif, fontSize:'clamp(32px,4vw,52px)', fontWeight:700, lineHeight:1.1, color:'#fff', marginBottom:48 }}>
            What our sisters are <em style={{ fontStyle:'italic', color:C.accent }}>saying</em>
          </h2>
          <div className="lp-testimonials-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20 }}>
            {LP_TESTIMONIALS.map(t=>(
              <div key={t.name} className="lp-test-card" style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:20, padding:28 }}>
                <div style={{ display:'flex', gap:3, marginBottom:14 }}>{[0,0,0,0,0].map((_,i)=><Star5 key={i}/>)}</div>
                <div className="lp-test-quote" style={{ ...S.serif, fontSize:19, fontStyle:'italic', color:'rgba(255,255,255,.9)', lineHeight:1.65, marginBottom:20 }}>
                  <span style={{ color:C.accent, fontSize:28, lineHeight:.8, display:'block', marginBottom:4 }}>"</span>
                  {t.quote}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <img src={t.photo} alt={t.name}
                    style={{ width:54, height:54, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:'3px solid rgba(255,255,255,.2)' }}
                    onError={e=>{ e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                  />
                  <div style={{ width:54, height:54, borderRadius:'50%', background:'rgba(255,255,255,.15)', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:700, color:'#fff', display:'none', flexShrink:0 }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:'#fff' }}>{t.name}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.45)', marginTop:1 }}>{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCRIPTURE BREAK ── */}
      <div style={{ background:`linear-gradient(135deg, ${C.primary}, #3B6331)`, padding:'80px 0', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, left:40, ...S.serif, fontSize:300, color:'rgba(255,255,255,.05)', lineHeight:1, pointerEvents:'none' }}>"</div>
        <div style={S.container}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,.6)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:16 }}>3 John 1:2</div>
          <div className="lp-scripture-text" style={{ ...S.serif, fontSize:'clamp(24px,3.5vw,46px)', fontStyle:'italic', color:'#fff', lineHeight:1.5, maxWidth:840, margin:'0 auto 18px' }}>
            "Beloved, I pray that all may go well with you and that you may be in good health, as it goes well with your soul."
          </div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,.65)' }}>God cares about your whole health — body, soul, and spirit.</div>
        </div>
      </div>

      {/* ── PRICING ── */}
      <section id="pricing" className="lp-section" style={{ background:C.bgAlt, padding:'90px 0' }}>
        <div style={{ ...S.container, textAlign:'center' }}>
          <div style={{ fontSize:11, fontWeight:500, color:C.muted, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:14, display:'inline-flex', alignItems:'center', gap:7, background:C.bg, border:`1px solid ${C.border}`, borderRadius:99, padding:'5px 15px' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#7FA876', display:'inline-block' }}/>Simple Pricing
          </div>
          <h2 className="lp-section-h2" style={{ ...S.serif, fontSize:'clamp(32px,4vw,52px)', fontWeight:700, lineHeight:1.1, color:C.text, marginBottom:50 }}>
            Start free. <em style={{ fontStyle:'italic', color:C.primary }}>Flourish</em> further.
          </h2>
          <div className="lp-pricing-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, maxWidth:760, margin:'0 auto' }}>
            {/* Free */}
            <div className="lp-price-card" style={{ background:C.bg, borderRadius:22, padding:32, border:`2px solid ${C.border}` }}>
              <div style={{ ...S.serif, fontSize:26, fontWeight:700, color:C.text, marginBottom:4 }}>Free</div>
              <div style={{ ...S.serif, fontSize:48, fontWeight:700, color:C.primary, lineHeight:1 }}><sup style={{ fontSize:18, fontWeight:400, color:C.muted, verticalAlign:'top', marginTop:12, display:'inline-block' }}>$</sup>0</div>
              <div style={{ fontSize:12, color:C.muted, marginBottom:20 }}>forever free</div>
              <div style={{ height:1, background:C.border, marginBottom:18 }}/>
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24, textAlign:'left' }}>
                {['Daily devotionals (all 365)','Food, water & weight tracking','Community feed','Sage AI (10 messages/day)'].map(f=>(
                  <div key={f} style={{ display:'flex', alignItems:'center', gap:9, fontSize:13, color:C.text }}>
                    <div style={{ width:18, height:18, borderRadius:'50%', background:'rgba(90,123,79,.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:C.primary, flexShrink:0 }}>✓</div>{f}
                  </div>
                ))}
              </div>
              <button className="lp-btn-outline" onClick={onSignup} style={{ width:'100%', padding:'13px', border:`1.5px solid ${C.primary}`, borderRadius:12, background:'transparent', color:C.primary, fontSize:14, fontWeight:600, cursor:'pointer' }}>Start Free</button>
            </div>
            {/* Premium */}
            <div className="lp-price-card" style={{ background:C.bg, borderRadius:22, padding:32, border:`2px solid ${C.primary}`, boxShadow:'0 12px 50px rgba(90,123,79,.16)', position:'relative' }}>
              <div style={{ position:'absolute', top:-13, left:'50%', transform:'translateX(-50%)', background:C.primary, color:'#fff', fontSize:10, fontWeight:700, borderRadius:99, padding:'4px 16px', whiteSpace:'nowrap', letterSpacing:'.04em' }}>MOST POPULAR</div>
              <div style={{ ...S.serif, fontSize:26, fontWeight:700, color:C.text, marginBottom:4 }}>Premium</div>
              <div style={{ ...S.serif, fontSize:48, fontWeight:700, color:C.primary, lineHeight:1 }}><sup style={{ fontSize:18, fontWeight:400, color:C.muted, verticalAlign:'top', marginTop:12, display:'inline-block' }}>$</sup>9.99</div>
              <div style={{ fontSize:12, color:C.muted, marginBottom:6 }}>per month · or $99/year</div>
              <div style={{ display:'inline-flex', background:'rgba(201,169,97,.18)', borderRadius:99, padding:'3px 12px', fontSize:11, fontWeight:600, color:C.accent, marginBottom:20 }}>✨ 7-Day Free Trial</div>
              <div style={{ height:1, background:C.border, marginBottom:18 }}/>
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24, textAlign:'left' }}>
                {['Everything in Free','Full macro tracking','Meal planner & recipes','Accountability Circles','Sage AI (unlimited)'].map(f=>(
                  <div key={f} style={{ display:'flex', alignItems:'center', gap:9, fontSize:13, color:C.text }}>
                    <div style={{ width:18, height:18, borderRadius:'50%', background:'rgba(201,169,97,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:C.accent, flexShrink:0 }}>✓</div>{f}
                  </div>
                ))}
              </div>
              <button className="lp-btn-hero" onClick={onSignup} style={{ width:'100%', padding:'14px', background:C.primary, border:'none', borderRadius:12, color:'#fff', fontSize:15, fontWeight:600, cursor:'pointer' }}>Start Free Trial ✨</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="lp-section lp-faq-section" style={{ background:C.bg, padding:'90px 0' }}>
        <div style={S.container}>

          {/* Header — centered, full width */}
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div style={{ fontSize:11, fontWeight:500, color:C.muted, letterSpacing:'.04em', textTransform:'uppercase', marginBottom:14, display:'inline-flex', alignItems:'center', gap:7, background:C.bgAlt, border:`1px solid ${C.border}`, borderRadius:99, padding:'5px 15px' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#7FA876', display:'inline-block' }}/>Got Questions?
            </div>
            <h2 className="lp-section-h2" style={{ ...S.serif, fontSize:'clamp(28px,3.5vw,46px)', fontWeight:700, lineHeight:1.1, color:C.text, marginBottom:14 }}>
              Everything you need to <em style={{ fontStyle:'italic', color:C.primary }}>know</em>
            </h2>
            <p style={{ fontSize:15, color:C.muted, lineHeight:1.7, maxWidth:520, margin:'0 auto' }}>
              If your question isn't here, we're always just a message away.
            </p>
          </div>

          {/* FAQ accordion — full width, two-col on desktop */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 60px', maxWidth:960, margin:'0 auto 56px' }} className="lp-faq-accordion-grid">
            {LP_FAQ.map((item, i) => (
              <div key={i} style={{ borderBottom:`1px solid ${C.border}`, ...(i<=1?{borderTop:`1px solid ${C.border}`}:{}) }}>
                <button className="lp-faq-trigger" onClick={()=>setOpenFaq(openFaq===i?null:i)}
                  style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 0', background:'none', border:'none', cursor:'pointer', gap:16, textAlign:'left' }}>
                  <span className="lp-faq-q" style={{ fontSize:15, fontWeight:500, color:C.text, lineHeight:1.4, transition:'color .15s' }}>{item.q}</span>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:openFaq===i?C.primary:C.bgAlt, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .25s', transform:openFaq===i?'rotate(45deg)':'none' }}>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={openFaq===i?'#fff':C.primary} strokeWidth={3} strokeLinecap="round"><line x1={12} y1={5} x2={12} y2={19}/><line x1={5} y1={12} x2={19} y2={12}/></svg>
                  </div>
                </button>
                {openFaq===i && (
                  <div style={{ fontSize:14, color:C.muted, lineHeight:1.78, paddingBottom:18 }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>

          {/* Ready to flourish CTA — centered below FAQs */}
          <div style={{ maxWidth:480, margin:'0 auto', background:`linear-gradient(145deg, ${C.bgAlt}, #EDF4E9)`, borderRadius:22, padding:'36px 32px', border:`1px solid ${C.border}`, textAlign:'center' }}>
            <div style={{ width:52, height:52, borderRadius:14, background:'rgba(90,123,79,.12)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            </div>
            <div style={{ ...S.serif, fontSize:26, fontWeight:700, color:C.text, marginBottom:10 }}>Ready to flourish?</div>
            <p style={{ fontSize:14, color:C.muted, lineHeight:1.65, marginBottom:24 }}>Join thousands of Christian women honoring their bodies, deepening their faith, and transforming their lives.</p>
            <button className="lp-btn-hero" onClick={onSignup} style={{ width:'100%', padding:'14px', background:C.primary, border:'none', borderRadius:12, color:'#fff', fontSize:15, fontWeight:600, cursor:'pointer', marginBottom:10 }}>Start Free Today</button>
            <button className="lp-btn-outline" onClick={onSignup} style={{ width:'100%', padding:'13px', border:`1.5px solid ${C.primary}`, borderRadius:12, background:'transparent', color:C.primary, fontSize:14, fontWeight:600, cursor:'pointer' }}>Try Premium Free — 7 Days</button>
          </div>

        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background:`linear-gradient(145deg, ${C.text}, #1A2B18)`, padding:'120px 0', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-200, left:'50%', transform:'translateX(-50%)', width:800, height:800, borderRadius:'50%', background:'radial-gradient(circle, rgba(90,123,79,.25) 0%, transparent 70%)', pointerEvents:'none' }}/>
        <div style={{ ...S.container, position:'relative' }}>
          <div style={{ fontSize:11, fontWeight:500, color:'rgba(255,255,255,.6)', letterSpacing:'.04em', textTransform:'uppercase', marginBottom:22, display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.15)', borderRadius:99, padding:'5px 15px' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:C.accent, display:'inline-block' }}/>Begin Today
          </div>
          <h2 style={{ ...S.serif, fontSize:'clamp(38px,5.5vw,72px)', fontWeight:700, color:'#fff', lineHeight:1.1, marginBottom:20 }}>
            Your body is a temple.<br/><em style={{ fontStyle:'italic', color:C.accent }}>Start treating it like one.</em>
          </h2>
          <p style={{ fontSize:17, color:'rgba(255,255,255,.62)', lineHeight:1.72, maxWidth:520, margin:'0 auto 38px' }}>
            Every journey begins with one faithful step. Thousands of women are already walking it — and there's room for you.
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:14, justifyContent:'center', marginBottom:24 }}>
            <button className="lp-btn-gold" onClick={onSignup} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'16px 32px', background:C.accent, border:'none', borderRadius:12, color:C.text, fontSize:16, fontWeight:600, cursor:'pointer' }}>
              Start Free — No Card Needed ✨
            </button>
            <button className="lp-btn-outline" onClick={onSignup} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'15px 30px', background:'transparent', border:'1.5px solid rgba(255,255,255,.3)', borderRadius:12, color:'#fff', fontSize:16, fontWeight:600, cursor:'pointer' }}>
              Try Premium Free for 7 Days
            </button>
          </div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,.3)', fontStyle:'italic' }}>
            "And let us not grow weary of doing good, for in due season we will reap, if we do not give up." — Galatians 6:9
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#0f1a0d', padding:'50px 0 28px' }}>
        <div style={S.container}>
          <div className="lp-footer-grid" style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:44, marginBottom:40 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:10 }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#7FA876" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                <span style={{ ...S.serif, fontSize:17, fontWeight:700, color:'#fff' }}>Flourish & Faith</span>
              </div>
              <p style={{ fontSize:12, color:'rgba(255,255,255,.35)', lineHeight:1.65, maxWidth:220 }}>Faith-integrated wellness for Christian women. Flourishing body, faithful heart.</p>
            </div>
            {[
              ['Product', ['Features','Devotionals','Sage AI','Pricing']],
              ['Company', ['About','Contact']],
              ['Legal',   ['Privacy Policy','Terms & Conditions']],
            ].map(([title,links])=>(
              <div key={title}>
                <div style={{ fontSize:10, fontWeight:600, color:'rgba(255,255,255,.3)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:12 }}>{title}</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {links.map(l=>(
                    <a key={l} href="#" className="lp-menu-link"
                      onClick={e=>{ e.preventDefault(); if(l==='Privacy Policy') setShowPrivacy(true); if(l==='Terms & Conditions') setShowTerms(true); }}
                      style={{ fontSize:12, color:'rgba(255,255,255,.4)', textDecoration:'none', transition:'color .15s' }}>{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,.07)', paddingTop:22, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.2)' }}>© 2026 Flourish & Faith. Made with 🌿 and grace.</div>
            <div style={{ display:'flex', gap:20 }}>
              {[['Privacy Policy', ()=>setShowPrivacy(true)],['Terms & Conditions', ()=>setShowTerms(true)]].map(([l,fn])=>(
                <a key={l} href="#" onClick={e=>{e.preventDefault();fn();}} style={{ fontSize:11, color:'rgba(255,255,255,.2)', textDecoration:'none' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── TERMS & CONDITIONS MODAL ── */}
      {showTerms && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:9999, display:'flex', alignItems:'flex-start', justifyContent:'center', overflowY:'auto', padding:'40px 16px' }} onClick={()=>setShowTerms(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:20, maxWidth:700, width:'100%', padding:'36px 40px', position:'relative' }}>
            <button onClick={()=>setShowTerms(false)} style={{ position:'absolute', top:18, right:20, background:'none', border:'none', fontSize:22, cursor:'pointer', color:C.muted }}>×</button>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <div style={{ width:36, height:36, background:C.primary, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>🌿</div>
              <div style={{ fontSize:11, color:C.muted, fontWeight:600, textTransform:'uppercase', letterSpacing:'.05em' }}>Flourish & Faith</div>
            </div>
            <h1 style={{ fontSize:28, fontWeight:800, color:C.text, marginBottom:4 }}>Terms & Conditions</h1>
            <p style={{ fontSize:12, color:C.muted, marginBottom:28 }}>Last updated: January 1, 2026</p>
            {[
              ['1. Acceptance of Terms', 'By accessing or using Flourish & Faith ("the Service"), you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use the Service. These terms apply to all users, including free and premium subscribers.'],
              ['2. Description of Service', 'Flourish & Faith is a faith-integrated wellness platform designed for Christian women. The Service includes daily devotionals, food and activity tracking, AI-powered coaching through "Sage," accountability circles, guided programs, and meal planning features. Some features are available only to Premium subscribers.'],
              ['3. User Accounts', 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access or use of your account. Users must be at least 18 years of age.'],
              ['4. Premium Subscription', 'Premium features are available through a paid monthly subscription ($9.99/month) or annual plan ($99/year). A 7-day free trial is offered to new Premium subscribers. After the trial period, your chosen subscription will automatically renew unless cancelled before the trial ends. You may cancel at any time through your account settings. No refunds are issued for partial subscription periods.'],
              ['5. Health Disclaimer', 'The content provided by Flourish & Faith, including Sage AI coaching, meal plans, workout suggestions, and devotional content, is for informational and motivational purposes only. It does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider before beginning any new diet, exercise, or wellness program. Flourish & Faith is not responsible for any health outcomes resulting from use of the Service.'],
              ['6. User Content', 'By posting content in the community, circles, or any other user-facing area of the Service, you grant Flourish & Faith a non-exclusive, royalty-free license to display and distribute that content within the platform. You retain ownership of your content. You agree not to post content that is harmful, offensive, misleading, or in violation of any applicable law. We reserve the right to remove content that violates these terms.'],
              ['7. Prohibited Uses', 'You agree not to: (a) use the Service for any unlawful purpose; (b) attempt to gain unauthorized access to any part of the Service; (c) use automated systems to scrape or extract data; (d) harass, threaten, or harm other users; (e) impersonate any person or entity; or (f) interfere with the proper functioning of the Service.'],
              ['8. Intellectual Property', 'All content, features, and functionality of the Service, including but not limited to devotionals, Sage AI responses, meal plans, program content, and design elements, are owned by Flourish & Faith and are protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without express written permission.'],
              ['9. Limitation of Liability', 'To the fullest extent permitted by applicable law, Flourish & Faith shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, loss of profits, or personal injury, arising from your use of the Service. Our total liability shall not exceed the amount you paid in subscription fees in the 12 months prior to the claim.'],
              ['10. Modifications to Terms', 'We reserve the right to modify these Terms at any time. We will notify users of material changes via email or in-app notification. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms.'],
              ['11. Governing Law', 'These Terms shall be governed by and construed in accordance with the laws of the State of Georgia, United States, without regard to its conflict of law provisions.'],
              ['12. Contact', 'If you have questions about these Terms, please contact us at legal@flourishandfaith.com.'],
            ].map(([h, body]) => (
              <div key={h} style={{ marginBottom:22 }}>
                <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:6 }}>{h}</div>
                <div style={{ fontSize:13, color:'#555', lineHeight:1.75 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PRIVACY POLICY MODAL ── */}
      {showPrivacy && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:9999, display:'flex', alignItems:'flex-start', justifyContent:'center', overflowY:'auto', padding:'40px 16px' }} onClick={()=>setShowPrivacy(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'#fff', borderRadius:20, maxWidth:700, width:'100%', padding:'36px 40px', position:'relative' }}>
            <button onClick={()=>setShowPrivacy(false)} style={{ position:'absolute', top:18, right:20, background:'none', border:'none', fontSize:22, cursor:'pointer', color:C.muted }}>×</button>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <div style={{ width:36, height:36, background:C.primary, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>🌿</div>
              <div style={{ fontSize:11, color:C.muted, fontWeight:600, textTransform:'uppercase', letterSpacing:'.05em' }}>Flourish & Faith</div>
            </div>
            <h1 style={{ fontSize:28, fontWeight:800, color:C.text, marginBottom:4 }}>Privacy Policy</h1>
            <p style={{ fontSize:12, color:C.muted, marginBottom:28 }}>Last updated: January 1, 2026</p>
            {[
              ['Our Commitment to Your Privacy', 'At Flourish & Faith, your privacy is sacred to us. This policy explains how we collect, use, and protect your personal information. We are committed to being transparent and giving you control over your data. We will never sell your personal information to third parties.'],
              ['1. Information We Collect', 'We collect information you provide directly, including: your name and email address when you create an account; wellness data you log (food, water, weight, movement); journal entries and devotional responses; community posts and circle messages; and payment information processed securely through our payment provider (we do not store full card numbers).\n\nWe also automatically collect: usage data such as features accessed and time spent; device and browser information; and IP address for security purposes.'],
              ['2. How We Use Your Information', 'We use your information to: provide and improve the Service; personalize your experience including Sage AI coaching; send you devotional reminders and account-related emails (you can opt out anytime); analyze usage patterns to improve features; ensure the security of your account; and process payments for Premium subscriptions.'],
              ['3. Your Health Data', 'We treat your health and wellness data with the highest level of care. Your food logs, weight entries, and fitness data are used solely to power your personal dashboard and Sage AI coaching. This data is never shared with advertisers, insurers, employers, or any third party. You can delete your health data at any time from your account settings.'],
              ['4. Community Content', 'Posts you share in the public community feed are visible to other Flourish & Faith users. Content shared within private Circles is visible only to Circle members. We recommend exercising discretion in what personal information you share publicly.'],
              ['5. Data Storage and Security', 'Your data is stored on secure servers with encryption at rest and in transit. We use industry-standard security practices including SSL/TLS encryption, regular security audits, and access controls. While we take every reasonable precaution, no system is 100% immune to security risks.'],
              ['6. Data Retention', 'We retain your account data for as long as your account is active. If you delete your account, your personal data will be permanently deleted within 30 days, except where we are required to retain it for legal or compliance purposes.'],
              ['7. Cookies and Tracking', 'We use essential cookies to keep you logged in and maintain your preferences. We do not use advertising cookies or sell your browsing data. You can control cookie settings through your browser, though disabling essential cookies may affect Service functionality.'],
              ['8. Third-Party Services', 'We use trusted third-party providers for: payment processing (Stripe); email delivery; and cloud hosting. These providers are contractually bound to protect your data and may not use it for their own purposes. We do not integrate with advertising networks.'],
              ['9. Your Rights', 'You have the right to: access a copy of your personal data; correct inaccurate information; request deletion of your account and data; opt out of marketing communications at any time; and data portability (export your data in a machine-readable format). To exercise these rights, contact privacy@flourishandfaith.com.'],
              ['10. Children\'s Privacy', 'Flourish & Faith is intended for users 18 years of age and older. We do not knowingly collect personal information from individuals under 18. If we become aware that a minor has provided us with personal data, we will promptly delete it.'],
              ['11. Changes to This Policy', 'We may update this Privacy Policy periodically. We will notify you of significant changes by email or in-app notification. Continued use of the Service after changes constitutes acceptance of the revised policy.'],
              ['12. Contact Us', 'If you have questions, concerns, or requests regarding your privacy, please contact our Privacy team at privacy@flourishandfaith.com. We will respond within 5 business days.'],
            ].map(([h, body]) => (
              <div key={h} style={{ marginBottom:22 }}>
                <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:6 }}>{h}</div>
                <div style={{ fontSize:13, color:'#555', lineHeight:1.75, whiteSpace:'pre-line' }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function FlourishAndFaith() {
  useEffect(()=>{
    const el=document.createElement('style');
    el.textContent=STYLE;
    document.head.appendChild(el);
    return ()=>document.head.removeChild(el);
  },[]);

  const [screen, setScreen] = useState('landing');
  const [user, setUser] = useState(null);
  const [covenant, setCovenant] = useState('');
  const [pwaPrompt, setPwaPrompt] = useState(null);
  const [showPwaBanner, setShowPwaBanner] = useState(false);
  const isNewSignup = React.useRef(false);

  // Capture the PWA install event (Android Chrome only)
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPwaPrompt(e);
      const installed = localStorage.getItem('ff_pwa_installed');
      const dismissed = localStorage.getItem('ff_pwa_dismissed');
      if (!installed && !dismissed) setShowPwaBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // iOS detection — show manual instructions banner after 3 seconds
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const dismissed = localStorage.getItem('ff_pwa_dismissed');
    if (isIos && !isInStandaloneMode && !dismissed) {
      setTimeout(() => setShowPwaBanner(true), 3000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installPwa = async () => {
    if (!pwaPrompt) return;
    pwaPrompt.prompt();
    const { outcome } = await pwaPrompt.userChoice;
    if (outcome === 'accepted') localStorage.setItem('ff_pwa_installed', '1');
    else localStorage.setItem('ff_pwa_dismissed', '1');
    setShowPwaBanner(false);
    setPwaPrompt(null);
  };

  // Detect iOS for showing manual instructions
  const isIos = /iphone|ipad|ipod/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : '');

  // ── Restore a Supabase-authenticated user into app state ──
  const restoreSupabaseSession = (supaUser, newUser = false) => {
    const profile = {
      name: supaUser.user_metadata?.full_name || supaUser.email?.split('@')[0] || 'Friend',
      email: supaUser.email,
      plan: 'free',
      covenant: '',
      supabaseId: supaUser.id,
    };
    // Preserve local UI preferences (avatar, covenant) if same user
    const local = loadUserProfile();
    const final = local?.email === profile.email
      ? { ...profile, covenant: local.covenant || '', avatarColor: local.avatarColor, avatarPhoto: local.avatarPhoto }
      : profile;
    setUser(final);
    saveUserProfile(final);
    setScreen(newUser ? 'goals' : 'app');
  };

  // ── Supabase auth state listener ──
  useEffect(() => {
    if (!supabase) return;

    // Restore existing session on page load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) restoreSupabaseSession(session.user, false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await restoreSupabaseSession(session.user, isNewSignup.current);
        isNewSignup.current = false;
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setScreen('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Clear all user-specific localStorage keys
  const clearAllUserData = () => {
    ['ff_user','ff_daily','ff_posts','ff_weight','ff_circles','ff_programs',
     'ff_goals','ff_settings','ff_notifs','ff_week','ff_sage_daily','ff_journals'].forEach(k => {
      try { localStorage.removeItem(k); } catch(e) {}
    });
  };

  const handleAuth = async (data) => {
    // ── Supabase auth (when configured) ──
    if (supabase) {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out — please check your connection and try again.')), 10000)
      );
      if (data.isLogin) {
        const { data: authData, error } = await Promise.race([
          supabase.auth.signInWithPassword({ email: data.email, password: data.password }),
          timeout,
        ]);
        if (error) throw new Error(error.message);
        if (authData?.user) restoreSupabaseSession(authData.user, false);
      } else {
        const { data: authData, error } = await Promise.race([
          supabase.auth.signUp({ email: data.email, password: data.password, options: { data: { full_name: data.name } } }),
          timeout,
        ]);
        if (error) throw new Error(error.message);
        if (authData?.session?.user) {
          // Auto-confirmed — restore session directly
          await restoreSupabaseSession(authData.session.user, true);
        } else {
          // Email confirmation required — proceed locally
          clearAllUserData();
          const newUser = { name: data.name || 'Friend', email: data.email, plan: 'free', covenant: '' };
          setUser(newUser);
          saveUserProfile(newUser);
          setScreen('goals');
        }
      }
      return;
    }

    // ── localStorage fallback (Supabase not configured) ──
    if (data.isLogin) {
      const savedProfile = loadUserProfile();
      if (savedProfile && savedProfile.email === data.email) {
        const merged = { ...savedProfile, plan: savedProfile.plan || 'free' };
        setUser(merged);
        setScreen('app');
      } else if (savedProfile && !savedProfile.email) {
        const merged = { ...savedProfile, email: data.email, plan: savedProfile.plan || 'free' };
        setUser(merged);
        saveUserProfile(merged);
        setScreen('app');
      } else {
        const fallback = savedProfile || { name: data.email.split('@')[0], email: data.email, plan: 'free', covenant: '' };
        setUser(fallback);
        saveUserProfile(fallback);
        setScreen('app');
      }
    } else {
      clearAllUserData();
      const newUser = { name: data.name || 'Friend', email: data.email, plan: 'free', covenant: '' };
      setUser(newUser);
      saveUserProfile(newUser);
      setScreen('goals');
    }
  };

  const handleSignOut = async () => {
    try { localStorage.removeItem('ff_sage_daily'); } catch(e) {}
    if (supabase) {
      await supabase.auth.signOut();
      // onAuthStateChange fires SIGNED_OUT → sets user null + screen landing
    } else {
      setUser(null);
      setScreen('landing');
    }
  };
  const handleSub=(plan)=>{
    const fullUser = { ...user, plan, covenant };
    setUser(fullUser);
    saveUserProfile(fullUser);   // persist so Sign In restores it
    setScreen('app');
  };

  const renderScreen = () => {
    if(screen==='landing')      return <LandingPage onSignup={()=>setScreen('onboarding')} onSignIn={()=>setScreen('auth')}/>;
    if(screen==='splash')       return <SplashScreen onDone={()=>setScreen('onboarding')}/>;
    if(screen==='onboarding')   return <OnboardingScreen onDone={()=>setScreen('auth')}/>;
    if(screen==='auth')         return <AuthScreen onDone={handleAuth}/>;
    if(screen==='goals')        return <GoalSettingScreen onNext={()=>setScreen('personalize')}/>;
    if(screen==='personalize')  return <PersonalizationScreen onNext={()=>setScreen('covenant')}/>;
    if(screen==='covenant')     return <CovenantScreen onNext={()=>setScreen('subscription')} setUserCovenant={setCovenant}/>;
    if(screen==='subscription') return <SubscriptionScreen onDone={handleSub}/>;
    if(screen==='app')          return <MainApp user={user} onSignOut={handleSignOut}/>;
    return null;
  };

  return (
    <div style={{ position:'relative' }}>
      {renderScreen()}

      {/* PWA Install Banner */}
      {showPwaBanner && (
        <div style={{ position:'fixed', bottom:80, left:12, right:12, zIndex:9998, background:C.text, borderRadius:18, padding:'14px 16px', display:'flex', alignItems:'flex-start', gap:12, boxShadow:'0 8px 32px rgba(0,0,0,0.4)', animation:'fadeUp 0.4s ease both' }}>
          <div style={{ width:42, height:42, borderRadius:11, background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🌿</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:4 }}>
              {isIos ? 'Add to Your Home Screen' : 'Install Flourish & Faith'}
            </div>
            {isIos ? (
              <div style={{ fontSize:11, color:'rgba(255,255,255,.6)', lineHeight:1.5 }}>
                Tap the <strong style={{ color:'rgba(255,255,255,.85)' }}>Share</strong> button{' '}
                <span style={{ fontSize:13 }}>⎙</span> at the bottom of Safari, then tap{' '}
                <strong style={{ color:'rgba(255,255,255,.85)' }}>"Add to Home Screen"</strong>
              </div>
            ) : (
              <div style={{ fontSize:11, color:'rgba(255,255,255,.6)', lineHeight:1.5 }}>
                Install the app for quick access — works offline too!
              </div>
            )}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:6, flexShrink:0 }}>
            {!isIos && (
              <button onClick={installPwa} style={{ background:C.accent, border:'none', borderRadius:8, padding:'7px 14px', fontSize:12, fontWeight:700, color:C.text, cursor:'pointer', whiteSpace:'nowrap' }}>
                Install
              </button>
            )}
            <button onClick={()=>{ setShowPwaBanner(false); localStorage.setItem('ff_pwa_dismissed','1'); }}
              style={{ background:'none', border:'none', padding:'4px 0', fontSize:11, color:'rgba(255,255,255,.4)', cursor:'pointer', whiteSpace:'nowrap' }}>
              {isIos ? 'Dismiss' : 'Not now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
