import FAQSection from '../../components/about/FAQSection';
import ProjectGallery from '../../components/works/ProjectGallery';
import WorksHero from '../../components/works/WorksHero';

export const metadata = {
  title: 'Our Works — DotGrey',
  description: 'Explore our portfolio of digital product designs and case studies.',
};

export default function WorksPage() {
  return (
    <div className=''>
      <main>
        <WorksHero />
        <ProjectGallery />
        <FAQSection />
      </main>
    </div>
  );
}
