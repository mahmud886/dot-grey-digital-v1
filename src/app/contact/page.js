import FAQSection from '../../components/about/FAQSection';
import ContactHero from '../../components/contact/ContactHero';
import ProjectForm from '../../components/contact/ProjectForm';

export const metadata = {
  title: 'Contact Us — DotGrey',
  description: 'Get in touch with us to start your next digital project.',
};

export default function ContactPage() {
  return (
    <div className=''>
      <main>
        <ContactHero />
        <ProjectForm />
        <FAQSection />
      </main>
    </div>
  );
}
