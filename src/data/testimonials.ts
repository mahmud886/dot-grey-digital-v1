import data from "@/content/testimonials.json";

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  rating: number;
};

export const testimonials: Testimonial[] = data.testimonials;
