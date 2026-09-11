export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "How do I book a flight with TripSavor?",
    answer:
      "Use the search widget on our homepage to enter your route, dates, and number of travelers. Compare the fares shown, select the flight that suits you, and complete the booking through our checkout. You'll receive your e-ticket by email once payment is confirmed.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major debit and credit cards, direct bank transfer, and cash-on-delivery through our rider service in select cities. Your booking is only confirmed once payment has been received.",
  },
  {
    question: "Can I cancel or change my booking?",
    answer:
      "Yes. Cancellation and change policies depend on the airline's fare rules for your specific ticket. Contact our support team with your booking reference and we'll walk you through the options, fees, and refund timeline.",
  },
  {
    question: "How long does it take to get a refund?",
    answer:
      "Once a refund is approved by the airline, it typically takes 7-15 business days to reflect back on your original payment method, depending on your bank.",
  },
  {
    question: "Do you charge any hidden fees?",
    answer:
      "No. The fare shown at checkout includes our service charge — there are no surprise fees added after you've confirmed your booking.",
  },
  {
    question: "Is my personal and payment information safe?",
    answer:
      "Yes. We use encrypted checkout sessions and never store full card details on our servers. Read our Privacy Policy for the full details on how we handle your data.",
  },
  {
    question: "I haven't received my e-ticket. What should I do?",
    answer:
      "First check your spam/junk folder. If it still hasn't arrived within an hour of payment confirmation, contact our support team with your booking reference and we'll resend it immediately.",
  },
  {
    question: "Can I book for someone else?",
    answer:
      "Absolutely. Just make sure the traveler's name and details are entered exactly as they appear on their CNIC or passport, since airlines do not allow name changes after ticketing.",
  },
];
