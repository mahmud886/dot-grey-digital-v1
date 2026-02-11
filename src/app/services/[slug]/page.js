import FAQSection from '../../../components/about/FAQSection';
import ProjectForm from '../../../components/contact/ProjectForm';
import IndustryExpertise from '../../../components/services/detail/IndustryExpertise';
import ServiceBenefits from '../../../components/services/detail/ServiceBenefits';
import ServiceFeatures from '../../../components/services/detail/ServiceFeatures';
import ServiceHero from '../../../components/services/detail/ServiceHero';
import ProjectGallery from '../../../components/works/ProjectGallery';

// Mock data store - In a real app this would come from a CMS or API
const serviceData = {
  'email-templates': {
    title: 'Eye-catching banner',
    subtitle: 'ads that convert',
    description:
      'We design and develop custom email templates that look great on every device and drive higher click-through rates.',
    features: [
      {
        title: 'Custom Coding & Design',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        icon: 'Code2',
      },
      {
        title: 'Mobile-tested responsiveness',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        icon: 'Smartphone',
      },
      {
        title: 'Pixel-perfect rendering',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        icon: 'Crosshair',
      },
      {
        title: 'Editable layouts',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        icon: 'Edit3',
      },
      {
        title: 'Fast load & accessibility',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        icon: 'Zap',
      },
      {
        title: 'Cross-client compatibility',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        icon: 'Globe',
      },
    ],
  },
  'ui-ux-design': {
    title: 'UX Research and',
    subtitle: 'Consulting Services',
    description:
      'Our Global digital product design agency helps brands to make top quality SaaS, MVP, software, mobile apps, and websites. We focus on user-friendly designs that look great and work.',
    features: [
      { title: 'UX Research', description: 'Deep dive into user needs and behaviors.', icon: 'Search' },
      { title: 'Usability Testing', description: 'Validation with real users for better results.', icon: 'UserCheck' },
      {
        title: 'Wireframing and Prototyping',
        description: 'Structural blueprints and interactive mockups.',
        icon: 'Layout',
      },
      { title: 'Visual Audit', description: 'Detailed review of your current design system.', icon: 'Eye' },
      { title: 'Design', description: 'Stunning, accessible, and responsive UI.', icon: 'Palette' },
      { title: 'AI Strategy', description: 'Integrating AI for smarter user experiences.', icon: 'BrainCircuit' },
    ],
  },
  'web-development': {
    title: 'Robust Web',
    subtitle: 'Development Solutions',
    description:
      'We build fast, secure, and scalable websites using the latest technologies to help your business grow online.',
    features: [
      { title: 'UX Research', description: 'Analyzing user journeys for better conversion.', icon: 'Search' },
      { title: 'Usability Testing', description: 'Testing performance across devices.', icon: 'MonitorCheck' },
      { title: 'Wireframing and Prototyping', description: 'Architecture and interaction design.', icon: 'FileCode' },
      { title: 'Visual Audit', description: 'Ensuring pixel-perfect implementation.', icon: 'ScanEye' },
      { title: 'Design', description: 'Modern, responsive, and accessible UI.', icon: 'Laptop' },
      { title: 'AI Strategy', description: 'Smart features and automation integration.', icon: 'Bot' },
    ],
  },
  'veeva-services': {
    title: 'Veeva CLM &',
    subtitle: 'Email Solutions',
    description:
      'We design and develop custom Veeva CLM presentations and Approved Emails that drive engagement and compliance in the life sciences industry.',
    features: [
      { title: 'UX Research', description: 'Understanding HCP needs and behaviors.', icon: 'Microscope' },
      { title: 'Usability Testing', description: 'Ensuring smooth navigation in Veeva CRM.', icon: 'Tablet' },
      {
        title: 'Wireframing and Prototyping',
        description: 'Planning content flow for maximum impact.',
        icon: 'Layers',
      },
      { title: 'Visual Audit', description: 'Reviewing assets for brand consistency.', icon: 'CheckCircle' },
      { title: 'Design', description: 'High-fidelity visuals optimized for iPad.', icon: 'Image' },
      { title: 'AI Strategy', description: 'Leveraging data for personalized content.', icon: 'Database' },
    ],
  },
  'banner-ads': {
    title: 'Eye-catching banner',
    subtitle: 'ads that convert',
    description:
      'We design banner ads that are engaging and drive clicks. We focus on user-friendly designs that look great and work.',
    features: [
      { title: 'Discovery', description: 'Understanding your audience.', icon: 'Compass' },
      { title: 'Brand Identity', description: 'Consistent visual language.', icon: 'Fingerprint' },
      { title: 'Graphic Design', description: 'Compelling visuals.', icon: 'PenTool' },
      { title: 'Animation', description: 'HTML5 or GIF motion.', icon: 'Film' },
      { title: 'Optimization', description: 'Fast loading assets.', icon: 'Gauge' },
      { title: 'Strategy', description: 'Placement and messaging.', icon: 'TrendingUp' },
    ],
  },
  // Add other services as needed, defaulting to generic if not found
};

export async function generateMetadata({ params }) {
  const service = serviceData[params.slug] || serviceData['email-templates'];
  return {
    title: `${service.title} ${service.subtitle} — DotGrey`,
    description: service.description,
  };
}

export default function ServiceDetail({ params }) {
  const slug = params.slug;
  const service = serviceData[slug] || serviceData['email-templates'];

  return (
    <div className=''>
      <main>
        <ServiceHero title={service.title} subtitle={service.subtitle} description={service.description} type={slug} />
        <ServiceFeatures features={service.features} />
        <ProjectGallery /> {/* Reusing Portfolio Grid */}
        <ServiceBenefits />
        <IndustryExpertise />
        <FAQSection />
        <ProjectForm />
      </main>
    </div>
  );
}
