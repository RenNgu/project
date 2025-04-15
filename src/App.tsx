import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Search, Users, Briefcase, Globe } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from './lib/supabase';

// Mock data to simulate database response
const mockServices = [
  {
    id: 1,
    type: 'offer',
    description: 'Full-stack developer with 5 years of experience in React, Node.js, and AWS. Specialized in building scalable web applications and e-commerce solutions.',
    skills: ['Web Development', 'React', 'Node.js', 'AWS'],
    profiles: {
      name: 'Alex Chen',
      gender: 'Male'
    }
  },
  {
    id: 2,
    type: 'service',
    description: 'Looking for an experienced graphic designer to create a brand identity package including logo, business cards, and social media templates.',
    skills: ['Graphic Design', 'Logo Design', 'Branding'],
    profiles: {
      name: 'Sarah Johnson',
      gender: 'Female'
    }
  },
  {
    id: 3,
    type: 'offer',
    description: 'Digital marketing specialist offering SEO optimization, content strategy, and social media management. Proven track record of increasing organic traffic by 200%.',
    skills: ['Digital Marketing', 'SEO Optimization', 'Content Writing'],
    profiles: {
      name: 'Maria Garcia',
      gender: 'Female'
    }
  },
  {
    id: 4,
    type: 'service',
    description: 'Need a professional video editor for our YouTube channel. Looking for someone who can create engaging content with motion graphics and sound design.',
    skills: ['Video Editing', 'Motion Graphics'],
    profiles: {
      name: 'James Wilson',
      gender: 'Male'
    }
  },
  {
    id: 5,
    type: 'offer',
    description: 'Cybersecurity expert specializing in penetration testing and security audits. Certified ethical hacker with experience in financial sector.',
    skills: ['Cyber Security', 'Penetration Testing'],
    profiles: {
      name: 'David Kim',
      gender: 'Male'
    }
  },
  {
    id: 6,
    type: 'offer',
    description: '3D artist and animator with expertise in Blender and Maya. Created character models and animations for indie game studios.',
    skills: ['3D Modeling', 'Animation'],
    profiles: {
      name: 'Emma Thompson',
      gender: 'Female'
    }
  }
];

const skills = [
  "Web Development", "Graphic Design", "Digital Marketing", "Content Writing",
  "SEO Optimization", "App Development", "Video Editing", "Cyber Security",
  "3D Modeling", "Voice Over", "Data Analytics", "Project Management"
];

function App() {
  const [activeTab, setActiveTab] = useState('service');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [randomSkill, setRandomSkill] = useState(skills[0]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * skills.length);
      setRandomSkill(skills[randomIndex]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // Simulate API call delay
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data instead of actual API call
      setServices(mockServices);
    } catch (error) {
      toast.error('Error fetching services');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const handleServiceSubmit = async (formData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.success('Your service request will be posted after admin reviews it');
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          gender: formData.gender
        });

      if (profileError) throw profileError;

      const { error: serviceError } = await supabase
        .from('services')
        .insert({
          user_id: user.id,
          title: 'Service Request',
          description: formData.serviceDetails,
          skills: formData.skills.split(',').map(s => s.trim()),
          type: 'service'
        });

      if (serviceError) throw serviceError;

      toast.success('Service request submitted successfully!');
      fetchServices();
    } catch (error) {
      toast.error('Error submitting service request');
      console.error('Error:', error);
    }
  };

  const handleSkillSubmit = async (formData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.success('Your skill offer will be posted after admin reviews it');
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          gender: formData.gender
        });

      if (profileError) throw profileError;

      const { error: serviceError } = await supabase
        .from('services')
        .insert({
          user_id: user.id,
          title: 'Skill Offer',
          description: formData.skillDetails,
          skills: formData.skills.split(',').map(s => s.trim()),
          type: 'offer'
        });

      if (serviceError) throw serviceError;

      toast.success('Skill offer submitted successfully!');
      fetchServices();
    } catch (error) {
      toast.error('Error submitting skill offer');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" />
      
      <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 z-50">
        <nav className="bg-black/70 backdrop-blur-md rounded-2xl">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-white tracking-wider">SkillSync</h1>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <a href="#faq" className="text-gray-300 hover:text-white transition">FAQ</a>
                <a href="#contact" className="text-gray-300 hover:text-white transition">Contact</a>
                <button 
                  onClick={() => setModalOpen(true)}
                  className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
                >
                  Book a Call
                </button>
              </div>

              <button 
                className="md:hidden text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden py-4 mt-4 border-t border-gray-700">
                <div className="flex flex-col space-y-4">
                  <a href="#faq" className="text-gray-300 hover:text-white transition">FAQ</a>
                  <a href="#contact" className="text-gray-300 hover:text-white transition">Contact</a>
                  <button 
                    onClick={() => setModalOpen(true)}
                    className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition w-full"
                  >
                    Book a Call
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      <section className="relative py-32 bg-gradient-to-b from-black via-gray-900 to-white text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Minimalist Connection Platform</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Instantly connect with skilled professionals or find work without the noise. No signups, no hassle.
          </p>
        </div>
        
        <div 
          ref={gridRef}
          onMouseMove={handleMouseMove}
          className="absolute inset-0 z-0 transition-transform duration-300"
          style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
            opacity: '0.1'
          }}
        >
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 50%, white)',
              pointerEvents: 'none'
            }}
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-50 border-l-4 border-black p-4 rounded-r-lg">
          <p className="text-xl font-medium">Skill Tip: {randomSkill}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-8 mb-12">
          <TabButton 
            active={activeTab === 'service'} 
            onClick={() => setActiveTab('service')}
            icon={<Users className="w-5 h-5" />}
          >
            I Need A Service
          </TabButton>
          <TabButton 
            active={activeTab === 'offer'} 
            onClick={() => setActiveTab('offer')}
            icon={<Briefcase className="w-5 h-5" />}
          >
            I Offer Skills
          </TabButton>
          <TabButton 
            active={activeTab === 'browse'} 
            onClick={() => setActiveTab('browse')}
            icon={<Globe className="w-5 h-5" />}
          >
            Browse Listings
          </TabButton>
        </div>

        <div className="mb-20">
          {activeTab === 'service' && <ServiceSection onSubmit={handleServiceSubmit} />}
          {activeTab === 'offer' && <OfferSection onSubmit={handleSkillSubmit} services={services} />}
          {activeTab === 'browse' && <BrowseSection services={services} loading={loading} />}
        </div>
      </div>

      <footer className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 SkillSync. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#faq" className="text-gray-300 hover:text-white transition">FAQ</a>
            <span className="text-gray-600">|</span>
            <a href="#contact" className="text-gray-300 hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Contact Information</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <p>Please contact us at:</p>
              <p>Email: <a href="mailto:contact@skillsync.com" className="text-blue-600 hover:underline">contact@skillsync.com</a></p>
              <p>Phone: +1-234-567-890</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const TabButton = ({ children, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
      active 
        ? 'bg-black text-white' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {icon}
    <span>{children}</span>
  </button>
);

const ServiceSection = ({ onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      gender: e.target.gender.value,
      serviceDetails: e.target.serviceDetails.value,
      skills: e.target.skills.value
    };
    onSubmit(formData);
    e.target.reset();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Request a Service</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormField label="Your Name" name="name" type="text" placeholder="John Doe" />
        <FormField label="Your Email" name="email" type="email" placeholder="john@example.com" />
        <FormField label="Your Phone Number" name="phone" type="tel" placeholder="+1 234-567-890" />
        <FormField 
          label="Gender" 
          name="gender"
          type="select" 
          options={["Male", "Female", "Other"]} 
        />
        <FormField 
          label="Service Details" 
          name="serviceDetails"
          type="textarea" 
          placeholder="Describe the service you need" 
        />
        <FormField 
          label="Relevant Skills" 
          name="skills"
          type="text" 
          placeholder="e.g. Plumbing, Electrical" 
        />
        <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
          Submit Request
        </button>
      </form>
    </div>
  );
};

const OfferSection = ({ onSubmit, services }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      gender: e.target.gender.value,
      skillDetails: e.target.skillDetails.value,
      skills: e.target.skills.value
    };
    onSubmit(formData);
    e.target.reset();
  };

  return (
    <div className="space-y-12">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">I Offer Skills</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormField label="Your Name" name="name" type="text" placeholder="Jane Doe" />
          <FormField label="Your Email" name="email" type="email" placeholder="jane@example.com" />
          <FormField label="Your Phone Number" name="phone" type="tel" placeholder="+1 234-567-890" />
          <FormField 
            label="Gender" 
            name="gender"
            type="select" 
            options={["Male", "Female", "Other"]} 
          />
          <FormField 
            label="Skill Details" 
            name="skillDetails"
            type="textarea" 
            placeholder="Describe your skills and experience" 
          />
          <FormField 
            label="Skills" 
            name="skills"
            type="text" 
            placeholder="e.g. Web Dev, Graphic Design" 
          />
          <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
            Submit Offer
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-8">Available Professionals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services
            .filter(service => service.type === 'offer')
            .map(service => (
              <SkillCard 
                key={service.id}
                name={service.profiles.name}
                gender={service.profiles.gender}
                description={service.description}
                skills={service.skills}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

const BrowseSection = ({ services, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !category || service.skills.includes(category);
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search listings..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="py-2 px-4 border rounded-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {skills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <ListingCard 
              key={service.id}
              name={service.profiles.name}
              type={service.type}
              description={service.description}
              tags={service.skills}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FormField = ({ label, type, placeholder, options, name }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {type === 'textarea' ? (
      <textarea 
        name={name}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        placeholder={placeholder}
        rows={4}
        required
      />
    ) : type === 'select' ? (
      <select 
        name={name}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        required
      >
        <option value="">-- Please Select --</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    ) : (
      <input 
        type={type}
        name={name}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        placeholder={placeholder}
        required
      />
    )}
  </div>
);

const SkillCard = ({ name, gender, skills, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition">
    <h3 className="text-xl font-bold mb-2">{name}</h3>
    <p className="text-gray-600 mb-2">{gender}</p>
    <p className="text-gray-800 mb-4">{description}</p>
    <div className="flex flex-wrap gap-2 mb-4">
      {skills.map(skill => (
        <span key={skill} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
          {skill}
        </span>
      ))}
    </div>
    <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
      Connect
    </button>
  </div>
);

const ListingCard = ({ name, type, description, tags }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold">{name}</h3>
      <span className={`px-3 py-1 rounded-full text-sm ${
        type === 'service' 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-green-100 text-green-800'
      }`}>
        {type}
      </span>
    </div>
    <p className="text-gray-800 mb-4">{description}</p>
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map(tag => (
        <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
          {tag}
        </span>
      ))}
    </div>
    <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
      Connect
    </button>
  </div>
);

export default App;
