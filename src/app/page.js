import FAQSection from '../components/about/FAQSection';
import ProjectForm from '../components/contact/ProjectForm';
import FeatureRows from '../components/home/FeatureRows';
import Hero from '../components/home/Hero';
import InnovativeDesign from '../components/home/InnovativeDesign';
import Services from '../components/home/Services';
import Testimonials from '../components/home/Testimonials';
import Works from '../components/home/Works';

export default function Home() {
  return (
    <div className='text-white'>
      <Hero />
      <FeatureRows />
      <Works />
      <Services />
      <InnovativeDesign />
      <Testimonials />
      <FAQSection />
      <ProjectForm />
    </div>
  );
}
