import data from "@/content/faq.json";

export type FaqCategory = string;
export type FaqItem = { id: string; category: FaqCategory; question: string; answer: string };

export const faqCategories: FaqCategory[] = data.categories;
export const faqs: FaqItem[] = data.faqs;

export const faqsByCategory = (category: FaqCategory) => faqs.filter((f) => f.category === category);
