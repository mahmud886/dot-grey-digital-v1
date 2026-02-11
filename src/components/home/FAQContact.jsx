import FAQ from "../contact/FAQ";
import ContactCard from "../contact/ContactCard";

export default function FAQContact() {
  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 pb-14 md:pb-20">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <FAQ />
        </div>
        <div className="lg:col-span-5">
          <ContactCard />
        </div>
      </div>
    </section>
  );
}
