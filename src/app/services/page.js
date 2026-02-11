import ProjectForm from '../../components/contact/ProjectForm';
import Expertise from '../../components/services/Expertise';
import ServicesHero from '../../components/services/ServicesHero';
import ServicesList from '../../components/services/ServicesList';
import WhyPartner from '../../components/services/WhyPartner';

export const metadata = {
  title: 'Our Services — DotGrey',
  description: 'Explore our digital product design and consulting services.',
};

export default function ServicesPage() {
  return (
    <div className=''>
      <main>
        <ServicesHero />
        <ServicesList />
        <Expertise />
        <WhyPartner />
        <ProjectForm />
      </main>
    </div>
  );
}
