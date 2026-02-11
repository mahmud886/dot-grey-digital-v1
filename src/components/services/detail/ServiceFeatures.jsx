import {
  Bot,
  BrainCircuit,
  CheckCircle,
  Code2,
  Compass,
  Crosshair,
  Database,
  Edit3,
  Eye,
  FileCode,
  Film,
  Fingerprint,
  Gauge,
  Globe,
  Image,
  Laptop,
  Layers,
  Layout,
  Microscope,
  MonitorCheck,
  Palette,
  PenTool,
  ScanEye,
  Search,
  Smartphone,
  Tablet,
  TrendingUp,
  UserCheck,
  Zap,
} from 'lucide-react';

const iconMap = {
  Code2,
  Smartphone,
  Crosshair,
  Edit3,
  Zap,
  Globe,
  Search,
  UserCheck,
  Layout,
  Eye,
  Palette,
  BrainCircuit,
  MonitorCheck,
  FileCode,
  ScanEye,
  Laptop,
  Bot,
  Microscope,
  Tablet,
  Layers,
  CheckCircle,
  Image,
  Database,
  Compass,
  Fingerprint,
  PenTool,
  Film,
  Gauge,
  TrendingUp,
};

export default function ServiceFeatures({ features }) {
  return (
    <section className='py-20'>
      <div className='mx-auto max-w-6xl px-4 text-center'>
        <div className='mb-16'>
          <h2 className='text-3xl font-bold text-white'>
            Our Comprehensive <br />
            <span className='text-brand-orange'>Services</span>
          </h2>
        </div>

        <div className='grid gap-12 sm:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Code2;
            return (
              <div key={index} className='flex flex-col items-center'>
                <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-soft text-brand-orange'>
                  <IconComponent className='h-8 w-8' strokeWidth={1.5} />
                </div>
                <h3 className='mb-3 font-bold text-white'>{feature.title}</h3>
                <p className='text-sm text-white leading-relaxed max-w-xs'>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
