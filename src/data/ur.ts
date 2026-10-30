/** Urdu translations keyed by the exact English source string. */
import { urPages } from "@/data/urPages";

const urCore: Record<string, string> = {
  // Header
  Home: "ہوم",
  Explore: "دریافت کریں",
  "Group Tickets": "گروپ ٹکٹس",
  "Umrah Calculator": "عمرہ کیلکولیٹر",
  "Manage Booking": "بکنگ مینیج کریں",
  "About Us": "ہمارے بارے میں",
  "Contact Us": "رابطہ کریں",
  "SignUp/Login": "سائن اپ / لاگ اِن",
  "Open 24/7 — every day of the year": "24/7 کھلا — سال کے ہر دن",

  // Hero
  "Pakistan's Trusted Flight Booking Partner": "پاکستان کا قابلِ اعتماد فلائٹ بکنگ پارٹنر",
  "Your next flight to": "آپ کی اگلی پرواز",
  "starts": "کا آغاز",
  "here.": "یہیں سے۔",
  "Compare fares across leading airlines and lock in your seat in minutes — with a real support team behind every booking.":
    "معروف ایئرلائنز کے کرائے موازنہ کریں اور چند منٹ میں اپنی سیٹ پکی کریں — ہر بکنگ کے پیچھے ایک حقیقی سپورٹ ٹیم کے ساتھ۔",
  Dubai: "دبئی",
  London: "لندن",
  Istanbul: "استنبول",
  Jeddah: "جدہ",
  Bangkok: "بینکاک",
  Toronto: "ٹورنٹو",
  Doha: "دوحہ",
  "Kuala Lumpur": "کوالالمپور",

  // Search widget
  "One Way": "ایک طرفہ",
  "Round Trip": "آنے جانے کا",
  "Multi-City": "ملٹی سٹی",
  From: "روانگی",
  To: "منزل",
  Depart: "روانگی کی تاریخ",
  Return: "واپسی",
  "Cabin Class": "کیبن کلاس",
  Economy: "اکانومی",
  Business: "بزنس",
  Adults: "بالغ",
  Children: "بچے",
  Infants: "شیر خوار",
  "12+ years": "12 سال یا زیادہ",
  "2-11 years": "2 تا 11 سال",
  "Under 2 years": "2 سال سے کم",
  Done: "مکمل",
  "Apply airline promo code": "ایئرلائن پرومو کوڈ لگائیں",
  "Search Flights": "فلائٹس تلاش کریں",
  "Add another flight": "ایک اور فلائٹ شامل کریں",
  Recent: "حالیہ",
  Clear: "صاف کریں",
  "Pick a departure date to search flights.": "فلائٹ تلاش کرنے کے لیے روانگی کی تاریخ منتخب کریں۔",

  // Trust strip
  "24/7 Live Support": "24/7 لائیو سپورٹ",
  "Call or WhatsApp anytime": "کسی بھی وقت کال یا واٹس ایپ کریں",
  "Best Fare Guarantee": "بہترین کرائے کی ضمانت",
  "Transparent pricing, no surprises": "شفاف قیمتیں، کوئی چھپی فیس نہیں",
  "Secure Checkout": "محفوظ ادائیگی",
  "Encrypted payment processing": "انکرپٹڈ ادائیگی کا نظام",
  "Flexible Payments": "ادائیگی کے لچکدار طریقے",
  "Cards, bank transfer & COD": "کارڈ، بینک ٹرانسفر اور کیش آن ڈیلیوری",

  // Sections
  "Popular Airlines": "مقبول ایئرلائنز",
  "Your watched fares": "آپ کے زیرِ نگرانی کرائے",
  "Check live fares →": "لائیو کرائے دیکھیں ←",
  "Fare Drops": "کرایوں میں کمی",
  "Deals worth booking now": "ابھی بک کرنے کے قابل آفرز",
  "Routes where our estimated fare is running well below its typical level. Refreshed regularly.":
    "وہ روٹس جہاں ہمارا تخمینہ شدہ کرایہ معمول سے کافی کم ہے۔ باقاعدگی سے اپڈیٹ ہوتا ہے۔",
  "See flights": "فلائٹس دیکھیں",
  "Popular Routes": "مقبول روٹس",
  "Where do you want to fly?": "آپ کہاں جانا چاہتے ہیں؟",
  "A snapshot of our most-booked international routes this month — fares shown are indicative starting prices.":
    "اس ماہ کے سب سے زیادہ بک ہونے والے بین الاقوامی روٹس — دکھائے گئے کرائے ابتدائی اندازے ہیں۔",
  "Explore every destination by budget": "بجٹ کے مطابق ہر منزل دریافت کریں",

  // Budget planner
  "Budget planner": "بجٹ پلانر",
  "Set your return-ticket budget from Karachi and see every place you can fly.":
    "کراچی سے آنے جانے کے ٹکٹ کا بجٹ طے کریں اور دیکھیں آپ کہاں کہاں جا سکتے ہیں۔",
  "Travelling in": "سفر کا مہینہ",
  "See all on the explore map": "ایکسپلور پیج پر سب دیکھیں",
  "Nothing at this budget yet — nudge the slider up a little.":
    "اس بجٹ میں ابھی کچھ نہیں — سلائیڈر تھوڑا بڑھائیں۔",
  "Indicative round-trip economy estimates from Karachi — tap a destination for a live search.":
    "کراچی سے آنے جانے کے اکانومی کرائے کا تخمینہ — لائیو تلاش کے لیے منزل پر ٹیپ کریں۔",

  // Destinations
  "United Arab Emirates": "متحدہ عرب امارات",
  Turkey: "ترکیہ",
  "United Kingdom": "برطانیہ",
  "Saudi Arabia": "سعودی عرب",
  Thailand: "تھائی لینڈ",
  Qatar: "قطر",
  Malaysia: "ملائیشیا",
  Canada: "کینیڈا",
  "Skyline, souks & desert nights": "فلک بوس عمارتیں، بازار اور صحرائی راتیں",
  "Two continents, one unforgettable city": "دو براعظم، ایک یادگار شہر",
  "Royal landmarks & world-class culture": "شاہی مقامات اور عالمی معیار کی ثقافت",
  "Red Sea corniche & gateway to Makkah": "بحیرۂ احمر کا ساحل اور مکہ کا دروازہ",
  "Golden temples & legendary street food": "سنہری مندر اور مشہور سٹریٹ فوڈ",
  "Modern icons on the Arabian Gulf": "خلیج کے کنارے جدید شاہکار",
  "Twin towers, food and easy escapes": "جڑواں ٹاورز، کھانے اور پرسکون سیر",
  "Lakeside skyline & a home away from home": "جھیل کنارے شہر اور اپنوں جیسا ماحول",

  // How it works
  "How It Works": "یہ کیسے کام کرتا ہے",
  "From search to ticket in three steps": "تلاش سے ٹکٹ تک صرف تین قدم",
  "Search Your Route": "اپنا روٹ تلاش کریں",
  "Enter your origin, destination, dates, and number of travelers in the search widget above.":
    "اوپر دیے گئے سرچ باکس میں روانگی، منزل، تاریخیں اور مسافروں کی تعداد درج کریں۔",
  "Pick & Pay": "منتخب کریں اور ادائیگی کریں",
  "Compare fares, choose the flight that fits your budget, and pay by card, bank transfer, or COD.":
    "کرائے موازنہ کریں، اپنے بجٹ کی فلائٹ چنیں اور کارڈ، بینک ٹرانسفر یا کیش آن ڈیلیوری سے ادائیگی کریں۔",
  "Get Your E-Ticket": "اپنا ای ٹکٹ حاصل کریں",
  "Your confirmed ticket lands in your inbox in minutes — ready for check-in with the airline.":
    "آپ کا کنفرم ٹکٹ چند منٹ میں آپ کے ان باکس میں — ایئرلائن کے ساتھ چیک اِن کے لیے تیار۔",

  // Why us
  "Why TripSavor": "ٹرپ سیور ہی کیوں",
  "Built around getting you the fair price": "آپ کو مناسب قیمت دلانے کے لیے بنایا گیا",
  "No hidden fees, no bait-and-switch fares — just a straightforward way to book flights.":
    "کوئی چھپی فیس نہیں، کوئی دھوکہ دہی نہیں — فلائٹ بک کرنے کا سیدھا اور سچا طریقہ۔",
  "Lowest Fare Search": "کم ترین کرائے کی تلاش",
  "We compare dozens of routings across leading airlines so you're never overpaying for the same seat.":
    "ہم معروف ایئرلائنز کے درجنوں روٹس موازنہ کرتے ہیں تاکہ ایک ہی سیٹ کے لیے آپ کبھی زیادہ ادا نہ کریں۔",
  "Real Human Support": "حقیقی انسانی سپورٹ",
  "Talk to an actual travel agent by phone or WhatsApp — no bots, no endless hold music.":
    "فون یا واٹس ایپ پر اصل ٹریول ایجنٹ سے بات کریں — نہ بوٹس، نہ لمبا انتظار۔",
  "Hassle-Free Rebooking": "بغیر جھنجھٹ دوبارہ بکنگ",
  "Flight changed or delayed? We handle the airline back-and-forth so you don't have to.":
    "فلائٹ بدل گئی یا لیٹ ہو گئی؟ ایئرلائن سے رابطہ ہم سنبھالتے ہیں۔",
  "Pay by card, bank transfer, or cash-on-delivery through our rider network in major cities.":
    "کارڈ، بینک ٹرانسفر یا بڑے شہروں میں رائیڈر نیٹ ورک کے ذریعے کیش آن ڈیلیوری سے ادائیگی کریں۔",
  "Instant E-Tickets": "فوری ای ٹکٹس",
  "Confirmed bookings land in your inbox within minutes, ready to check in with the airline.":
    "کنفرم بکنگ چند منٹ میں آپ کے ان باکس میں، ایئرلائن کے ساتھ چیک اِن کے لیے تیار۔",
  "Secure by Design": "حفاظت اولین ترجیح",
  "Encrypted checkout and strict data-handling practices keep your information protected.":
    "انکرپٹڈ ادائیگی اور سخت ڈیٹا پالیسی آپ کی معلومات کو محفوظ رکھتی ہے۔",

  // Reviews / CTA / manage
  Reviews: "تاثرات",
  "What travelers say about us": "مسافر ہمارے بارے میں کیا کہتے ہیں",
  "Ready to book your next flight?": "اپنی اگلی فلائٹ بک کرنے کے لیے تیار ہیں؟",
  "Our travel agents are ready to find you the best fare.":
    "ہمارے ٹریول ایجنٹس آپ کے لیے بہترین کرایہ ڈھونڈنے کو تیار ہیں۔",
  "Chat on WhatsApp": "واٹس ایپ پر بات کریں",
  "Already have a booking? Retrieve your itinerary and manage it online.":
    "پہلے سے بکنگ ہے؟ اپنا شیڈول حاصل کریں اور آن لائن مینیج کریں۔",
  "Manage My Booking": "میری بکنگ مینیج کریں",

  // Footer
  "Pakistan-based flight booking made simple — transparent fares, real human support, and a booking flow that gets you from search to ticket in minutes.":
    "پاکستان میں فلائٹ بکنگ اب آسان — شفاف کرائے، حقیقی انسانی سپورٹ اور چند منٹ میں تلاش سے ٹکٹ تک کا سفر۔",
  Company: "کمپنی",
  Legal: "قانونی",
  "Get in Touch": "رابطہ کریں",
  "We compare fares across leading airlines": "ہم معروف ایئرلائنز کے کرائے موازنہ کرتے ہیں",
  "All rights reserved.": "جملہ حقوق محفوظ ہیں۔",
  "Secure checkout · Cards · Bank Transfer · Cash on Delivery":
    "محفوظ ادائیگی · کارڈ · بینک ٹرانسفر · کیش آن ڈیلیوری",
  "Where can I go for": "میں کہاں جا سکتا ہوں صرف",
  "destinations within budget": "منزلیں آپ کے بجٹ میں",
  from: "سے",
  "Abu Dhabi": "ابوظہبی",
  Madinah: "مدینہ",
  Madina: "مدینہ",
  Medina: "مدینہ",
  Riyadh: "ریاض",
  Muscat: "مسقط",
  Manama: "منامہ",
  Bahrain: "بحرین",
  Kuwait: "کویت",
  "Kuwait City": "کویت سٹی",
  Sharjah: "شارجہ",
  Oman: "عمان",
  Singapore: "سنگاپور",
  Manchester: "مانچسٹر",
  Birmingham: "برمنگھم",
  "New York": "نیویارک",
  Colombo: "کولمبو",
  Baku: "باکو",
  Tashkent: "تاشقند",
  Dammam: "دمام",
  Cairo: "قاہرہ",
  "Vision Statement": "ہمارا وژن",
  "Customer Support": "کسٹمر سپورٹ",
  "Terms & Conditions": "شرائط و ضوابط",
  "Privacy Policy": "پرائیویسی پالیسی",
  FAQs: "اکثر پوچھے گئے سوالات",
  // Page heroes
  "About TripSavor": "ٹرپ سیور کے بارے میں",
  "Making air travel simple, honest, and affordable": "ہوائی سفر کو آسان، سچا اور سستا بنانا",
  "We started TripSavor to fix a frustrating booking experience — confusing fares, unreachable support, and surprise fees.":
    "ہم نے ٹرپ سیور اس لیے شروع کیا کہ بکنگ کا پریشان کن تجربہ بدلا جائے — الجھے ہوئے کرائے، نہ ملنے والی سپورٹ اور اچانک فیسیں۔",
  "We're here to help": "ہم آپ کی مدد کے لیے حاضر ہیں",
  "Reach our support team by phone, WhatsApp, or the form below — most queries are answered within the hour.":
    "فون، واٹس ایپ یا نیچے دیے گئے فارم کے ذریعے ہماری سپورٹ ٹیم سے رابطہ کریں — زیادہ تر سوالات کا جواب ایک گھنٹے میں۔",
  "Where can your budget take you?": "آپ کا بجٹ آپ کو کہاں لے جا سکتا ہے؟",
  "Pick a starting city, a month, and a budget — we'll rank every destination we cover by estimated fare.":
    "روانگی کا شہر، مہینہ اور بجٹ چنیں — ہم ہر منزل کو تخمینہ شدہ کرائے کے مطابق ترتیب دیں گے۔",
  Support: "سپورٹ",
  "Frequently asked questions": "اکثر پوچھے گئے سوالات",
  "Can't find what you're looking for? Reach out on our Contact page and we'll help directly.":
    "جو چاہیے وہ نہیں ملا؟ ہمارے رابطہ صفحے پر پیغام کریں، ہم براہِ راست مدد کریں گے۔",
  "Your Account": "آپ کا اکاؤنٹ",
  "SignUp / Login": "سائن اپ / لاگ اِن",
  "Save your travelers' details and manage all your bookings in one place.":
    "مسافروں کی تفصیلات محفوظ کریں اور تمام بکنگز ایک ہی جگہ سنبھالیں۔",
  "Retrieve your itinerary": "اپنا شیڈول حاصل کریں",
  "Enter your booking reference and last name exactly as they appear on your e-ticket.":
    "اپنا بکنگ ریفرنس اور آخری نام وہی لکھیں جو ای ٹکٹ پر درج ہے۔",
  TripSavor: "ٹرپ سیور",
  "Umrah Package Calculator": "عمرہ پیکج کیلکولیٹر",
  "Build your own Umrah package and see a live cost estimate — visa, flights, hotels, and transport, all in one place.":
    "اپنا عمرہ پیکج خود بنائیں اور لاگت کا تخمینہ دیکھیں — ویزا، فلائٹس، ہوٹل اور ٹرانسپورٹ سب ایک جگہ۔",
  "Search Results": "تلاش کے نتائج",
  Routes: "روٹس",
  "Cheap flights from Pakistan": "پاکستان سے سستی فلائٹس",
  "Pick your departure city and destination to see the cheapest months and compare airlines.":
    "روانگی کا شہر اور منزل چنیں، سستے مہینے دیکھیں اور ایئرلائنز کا موازنہ کریں۔",
  "Quick Answers": "فوری جوابات",
  "Booking flights from Pakistan: common questions": "پاکستان سے فلائٹ بکنگ: عام سوالات",
  "See all FAQs →": "تمام سوالات دیکھیں ←",
  "Cookie preferences": "کوکیز کی ترجیحات",
  "We value your privacy": "ہم آپ کی پرائیویسی کی قدر کرتے ہیں",
  "We use essential storage to remember your language, currency and searches. With your permission we also use analytics to improve the site.":
    "ہم آپ کی زبان، کرنسی اور تلاش یاد رکھنے کے لیے ضروری اسٹوریج استعمال کرتے ہیں۔ آپ کی اجازت سے سائٹ بہتر بنانے کے لیے اینالیٹکس بھی استعمال کرتے ہیں۔",
  "Accept all": "سب قبول کریں",
  "Essential only": "صرف ضروری",
  "Cookie settings": "کوکی سیٹنگز",
};

export const ur: Record<string, string> = { ...urCore, ...urPages };
