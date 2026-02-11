import AboutHero from '../../components/about/AboutHero';
import FAQSection from '../../components/about/FAQSection';
import Mission from '../../components/about/Mission';
import Values from '../../components/about/Values';

export const metadata = {
  title: 'About Us — DotGrey',
  description: 'We are a team of digital problem solvers passionate about creating impact.',
};

export default function AboutPage() {
  return (
    <div className=''>
      <main>
        <AboutHero />
        <Mission />
        <Values />
        <FAQSection />
      </main>
    </div>
  );
}
