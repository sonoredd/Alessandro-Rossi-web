
import React, { useState, useEffect, useRef } from 'react';
import { PortfolioData, VideoProject } from './types';
import { VideoProjectItem, AddProjectCard } from './components/VideoUploader';
import { enhanceBio } from './services/geminiService';

const STORAGE_KEY = 'portfolio_data_v1';

const INITIAL_DATA: PortfolioData = {
  name: "Alessandro Rossi",
  role: "Filmmaker & Creative Director",
  bio: "Sono un videomaker appassionato e creativo: racconto storie attraverso le immagini, trasmettendo emozioni autentiche. Il mio obiettivo è dare vita a contenuti che lascino il segno.",
  email: "alessandro@redofilm.com",
  linkedin: "instagram.com/alerossidirector",
  github: "vimeo.com/alessandrorossi",
  projects: [],
  profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop", 
  logoUrl: null
};

const App: React.FC = () => {
  const [data, setData] = useState<PortfolioData>(INITIAL_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  
  const profileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Caricamento dati da LocalStorage all'avvio
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Errore nel caricamento dei dati salvati", e);
      }
    }
  }, []);

  // Salvataggio dati su LocalStorage ad ogni modifica
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUpdate = (field: keyof PortfolioData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddProject = (url: string) => {
    const newProject: VideoProject = {
      id: Math.random().toString(36).substr(2, 9),
      url: url,
      title: "Nuovo Progetto"
    };
    handleUpdate('projects', [...data.projects, newProject]);
  };

  const handleRemoveProject = (id: string) => {
    handleUpdate('projects', data.projects.filter(p => p.id !== id));
  };

  const handleUpdateProjectTitle = (id: string, newTitle: string) => {
    const updated = data.projects.map(p => p.id === id ? { ...p, title: newTitle } : p);
    handleUpdate('projects', updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage' | 'logoUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleUpdate(field, url);
    }
  };

  const handleEnhanceBio = async () => {
    setIsEnhancing(true);
    const response = await enhanceBio(data.bio, data.role, data.name);
    handleUpdate('bio', response);
    setIsEnhancing(false);
  };

  const handleSecretTrigger = () => {
    setClickCount(prev => prev + 1);
    if (clickCount >= 4) {
      setIsAdminMode(!isAdminMode);
      setClickCount(0);
    }
    const timeout = setTimeout(() => setClickCount(0), 3000);
    return () => clearTimeout(timeout);
  };

  const firstName = data.name.split(' ')[0].toUpperCase();
  const lastName = data.name.split(' ').slice(1).join(' ').toUpperCase();

  return (
    <div className="bg-[#000000] text-white min-h-screen selection:bg-white selection:text-black">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-[100] px-8 py-6 flex justify-between items-center mix-blend-difference transition-all duration-500 ${scrolled ? 'opacity-0 translate-y-[-100%]' : 'opacity-100 translate-y-0'}`}>
        <div 
          className="cursor-pointer min-w-[40px] h-6 flex items-center"
          onClick={() => isAdminMode && isEditing ? logoInputRef.current?.click() : handleSecretTrigger()}
        >
          {data.logoUrl ? (
            <img src={data.logoUrl} alt="Logo" className="h-6 w-auto grayscale brightness-200" />
          ) : (
            <div className="w-4 h-4 rounded-full border border-white/20"></div>
          )}
          <input type="file" ref={logoInputRef} className="hidden" onChange={(e) => handleFileUpload(e, 'logoUrl')} />
        </div>
        
        <div className="flex items-center space-x-12">
          <div className="hidden md:flex space-x-8 text-[10px] font-bold tracking-[0.3em] uppercase opacity-50">
            <a href="#work" className="hover:text-white transition-colors">Video</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          {isAdminMode && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-[9px] font-bold tracking-[0.3em] uppercase border border-white/20 px-5 py-2.5 rounded-full hover:bg-white hover:text-black transition-all bg-black/40 backdrop-blur-md"
            >
              {isEditing ? 'Esci da Modifica' : 'Admin Mode'}
            </button>
          )}
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-end pb-24 px-8">
          <div className="flex flex-col space-y-4 mb-12 opacity-30">
            <span className="text-[10px] font-bold tracking-[0.5em] uppercase">Visual Storytelling</span>
            <div className="w-12 h-px bg-white"></div>
          </div>
          
          <h1 className="huge-title mb-12">
            {isEditing ? (
              <input 
                value={data.name} 
                onChange={(e) => handleUpdate('name', e.target.value)}
                className="bg-transparent border-none focus:outline-none w-full uppercase"
                placeholder="NOME COGNOME"
              />
            ) : (
              <>
                {firstName}
                <br />
                <span className="text-neutral-800">{lastName || "STUDIO"}</span>
              </>
            )}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-4 text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 leading-relaxed">
              Basato in Italia.<br />
              {isEditing ? (
                <input 
                  value={data.role} 
                  onChange={(e) => handleUpdate('role', e.target.value)}
                  className="bg-transparent border-b border-white/10 focus:outline-none w-full mt-2"
                />
              ) : data.role}
            </div>
            <div className="md:col-span-8 flex justify-end">
              <a href="#work" className="group flex items-center space-x-4">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase group-hover:translate-x-2 transition-transform">Esplora Lavori</span>
                <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Video Portfolio */}
        <section id="work" className="py-24 overflow-hidden border-t border-white/5">
          <div className="px-8 mb-12 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-20 mb-2">Filmmaking</p>
              <h2 className="text-3xl font-light italic serif">I miei lavori</h2>
            </div>
          </div>
          
          <div className="flex space-x-4 md:space-x-8 px-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-12">
            {data.projects.map((project) => (
              <div key={project.id} className="snap-center relative">
                <VideoProjectItem 
                  url={project.url} 
                  title={project.title} 
                  isEditing={isEditing}
                  onRemove={() => handleRemoveProject(project.id)}
                />
                {isEditing && (
                  <input 
                    className="absolute bottom-24 left-8 bg-black/60 backdrop-blur-md border-none text-white text-xl font-light italic serif p-2 focus:ring-0 w-3/4"
                    value={project.title}
                    onChange={(e) => handleUpdateProjectTitle(project.id, e.target.value)}
                  />
                )}
              </div>
            ))}
            {isEditing && (
              <div className="snap-center">
                <AddProjectCard onUpload={handleAddProject} />
              </div>
            )}
            {!isEditing && data.projects.length === 0 && (
              <div className="w-full h-48 flex items-center justify-center opacity-20">
                <span className="text-[10px] uppercase tracking-widest">Nessun video caricato</span>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-48 px-8 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
            <div className="md:col-span-5">
              <div className="sticky top-24 aspect-[4/5] bg-neutral-900 overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 rounded-sm">
                {data.profileImage && (
                  <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000" />
                )}
                {isEditing && (
                  <button 
                    onClick={() => profileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] uppercase font-bold tracking-widest opacity-0 hover:opacity-100 transition-opacity"
                  >
                    Change Image
                  </button>
                )}
                <input type="file" ref={profileInputRef} className="hidden" onChange={(e) => handleFileUpload(e, 'profileImage')} />
              </div>
            </div>
            
            <div className="md:col-span-7 flex flex-col justify-center space-y-16">
              <div className="space-y-8">
                <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-30">Vision</h2>
                {isEditing ? (
                  <div className="space-y-4">
                    <textarea 
                      value={data.bio} 
                      onChange={(e) => handleUpdate('bio', e.target.value)}
                      className="w-full h-64 bg-neutral-900/50 border border-white/10 p-8 text-2xl font-light leading-relaxed focus:outline-none focus:border-white/30 transition-all text-white rounded-sm"
                    />
                    <button 
                      onClick={handleEnhanceBio}
                      disabled={isEnhancing}
                      className="text-[10px] font-bold tracking-[0.3em] uppercase bg-white text-black px-8 py-4 hover:bg-neutral-200 disabled:opacity-50 transition-all"
                    >
                      {isEnhancing ? 'Analisi IA...' : 'Refina con AI'}
                    </button>
                  </div>
                ) : (
                  <p className="text-3xl lg:text-5xl font-light leading-[1.1] tracking-tight serif italic text-neutral-300">
                    "{data.bio}"
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-12 border-t border-white/5">
                <div className="space-y-4">
                  <h4 className="text-[9px] font-bold tracking-[0.4em] uppercase opacity-20">Servizi</h4>
                  <ul className="text-xs space-y-2 opacity-40 font-light">
                    <li>Direzione Creativa</li>
                    <li>Produzione Video</li>
                    <li>Cinematografia</li>
                    <li>Color Grading</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[9px] font-bold tracking-[0.4em] uppercase opacity-20">Connect</h4>
                  <div className="flex flex-col space-y-2 text-xs opacity-40 font-light">
                    <a href={`https://${data.linkedin}`} className="hover:text-white transition-colors">Instagram</a>
                    <a href={`https://${data.github}`} className="hover:text-white transition-colors">Vimeo</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section id="contact" className="py-48 border-t border-white/5 px-8">
          <div className="flex flex-col items-center text-center space-y-12">
            <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-30">Iniziamo un progetto</h2>
            <a 
              href={`mailto:${data.email}`} 
              className="hover:text-neutral-500 transition-colors duration-500 lowercase font-black tracking-tighter"
              style={{ fontSize: 'clamp(1.5rem, 5.5vw, 4rem)' }}
            >
              {data.email.split('@')[0]}<span className="opacity-20">@</span>{data.email.split('@')[1]}
            </a>
            
            <div className="pt-24 flex flex-col md:flex-row justify-between w-full opacity-20 text-[9px] font-bold tracking-[0.3em] uppercase">
              <p>© {new Date().getFullYear()} {data.name} Studio</p>
              <p>Basato a Milano / Available Worldwide</p>
              <p>{data.email}</p>
            </div>
          </div>
        </section>
      </main>

      {/* AI Loader */}
      {isEnhancing && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center">
          <div className="flex flex-col items-center space-y-10">
            <div className="w-16 h-px bg-white/10 relative overflow-hidden">
               <div className="absolute inset-0 bg-white w-full h-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </div>
            <span className="text-[9px] font-bold tracking-[1em] uppercase animate-pulse">Evolvendo il tuo messaggio</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;
