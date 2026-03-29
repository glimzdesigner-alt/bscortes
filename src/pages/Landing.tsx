import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Scissors, Ruler, Layers, Package, CheckCircle, MessageCircle, Phone, MapPin } from 'lucide-react';
import * as Icons from 'lucide-react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const IconRenderer = ({ name, className }: { name: string, className: string }) => {
  // @ts-ignore
  const Icon = Icons[name] || Icons.HelpCircle;
  return <Icon className={className} />;
};

const defaultServices = [
  {
    iconName: "Scissors",
    title: "Corte em Larga Escala",
    description: "Corte preciso e rápido para grandes volumes de produção, garantindo padronização e qualidade."
  },
  {
    iconName: "Ruler",
    title: "Encaixe e Risco",
    description: "Otimização do aproveitamento do tecido através de encaixes computadorizados ou manuais eficientes."
  },
  {
    iconName: "Layers",
    title: "Enfestos",
    description: "Preparação cuidadosa das camadas de tecido (enfesto) para um corte uniforme e sem distorções."
  },
  {
    iconName: "Package",
    title: "Separação e Embalagem",
    description: "Organização das peças cortadas por tamanho e cor, prontas para a costura."
  }
];

const defaultFabrics = [
  { name: "Malhas", desc: "Algodão, Viscolycra, Piquet, Moletom" },
  { name: "Tecidos Planos", desc: "Tricoline, Viscose, Linho, Crepe" },
  { name: "Jeans e Sarja", desc: "Cortes pesados com precisão" },
  { name: "Tecidos Delicados", desc: "Seda, Chiffon, Cetim (com manuseio especial)" },
  { name: "Sintéticos", desc: "Nylon, Poliéster, Tactel" },
  { name: "Tecidos Técnicos", desc: "Uniformes, Hospitalares, Impermeáveis" }
];

export default function Landing() {
  const [services, setServices] = useState<any[]>(defaultServices);
  const [fabrics, setFabrics] = useState<any[]>(defaultFabrics);
  const [settings, setSettings] = useState({
    address: 'São Paulo, SP (Brás/Bom Retiro)',
    phone: '(11) 99999-9999',
    whatsapp: '5511999999999',
    hours: 'Segunda a Sexta: 08:00 às 18:00\nSábado: 08:00 às 12:00',
    logoUrl: 'BS Cortes',
    yearsOfExperience: '10',
    email: '',
    instagram: ''
  });

  const whatsappNumber = settings.whatsapp.replace(/\D/g, '');
  const whatsappMessage = "Olá! Gostaria de fazer um orçamento para corte de tecidos.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'services'));
        if (!snapshot.empty) {
          setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        console.error("Error fetching services, using defaults.", error);
      }
    };

    const fetchFabrics = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'fabrics'));
        if (!snapshot.empty) {
          setFabrics(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        console.error("Error fetching fabrics, using defaults.", error);
      }
    };

    fetchServices();
    fetchFabrics();

    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'general'));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSettings(prev => {
            const newSettings = { ...prev };
            Object.keys(data).forEach(key => {
              if (data[key]) newSettings[key as keyof typeof prev] = data[key];
            });
            return newSettings;
          });
        }
      } catch (error) {
        console.error("Error fetching settings", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-orange-200">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              {settings.logoUrl.startsWith('http') ? (
                <img src={settings.logoUrl} alt="Logo" className="h-12 object-contain" />
              ) : (
                <span className="font-bold text-2xl tracking-tight text-blue-900">{settings.logoUrl}</span>
              )}
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#servicos" className="text-slate-600 hover:text-orange-500 transition-colors font-medium">Serviços</a>
              <a href="#tecidos" className="text-slate-600 hover:text-orange-500 transition-colors font-medium">Tecidos</a>
              <a href="#sobre" className="text-slate-600 hover:text-orange-500 transition-colors font-medium">Sobre</a>
              <a href="/admin" className="text-slate-400 hover:text-blue-600 transition-colors font-medium flex items-center gap-1">
                Admin
              </a>
            </div>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Orçamento via WhatsApp</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2072&auto=format&fit=crop" 
            alt="Tecidos empilhados" 
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-slate-50"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold tracking-wide mb-6">
                Especialistas em Corte de Tecidos
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                Precisão e Qualidade para a sua <span className="text-orange-500">Confecção</span>.
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
                Oferecemos serviços profissionais de risco, enfesto e corte para todos os tipos de tecidos. Otimizamos seu material e garantimos o padrão perfeito para a costura.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <MessageCircle className="w-5 h-5" />
                  Falar no WhatsApp
                </a>
                <a 
                  href="#servicos"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-700 px-8 py-4 rounded-full font-bold text-lg transition-all"
                >
                  Ver Serviços
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Nossos Serviços</h2>
            <p className="text-lg text-slate-600">
              Processo completo desde o recebimento do rolo até a entrega das peças prontas para a facção.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div 
                key={service.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all"
              >
                <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm mb-6">
                  <IconRenderer name={service.iconName} className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fabrics Section */}
      <section id="tecidos" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Tecidos que Trabalhamos</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Temos experiência e maquinário adequado para lidar com uma vasta gama de materiais, desde os mais pesados até os mais delicados, garantindo um corte limpo e sem desfiados.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fabrics.map((fabric, index) => (
                  <motion.div 
                    key={fabric.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                        <CheckCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-100">{fabric.name}</h4>
                      <p className="text-sm text-slate-400">{fabric.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-10 pt-8 border-t border-slate-800">
                <p className="text-slate-300 italic">
                  "O segredo de uma boa peça de roupa começa com um corte perfeito."
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1584227365313-094e09f4b52b?q=80&w=1974&auto=format&fit=crop" 
                  alt="Trabalho com tecidos" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-blue-700 text-white p-8 rounded-2xl shadow-xl max-w-xs hidden md:block">
                <p className="font-bold text-2xl mb-2">+{settings.yearsOfExperience} Anos</p>
                <p className="text-blue-100">De experiência no mercado de confecção.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Pronto para otimizar sua produção?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Entre em contato agora mesmo para fazer um orçamento sem compromisso. Atendemos pequenas, médias e grandes confecções.
          </p>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white hover:bg-orange-600 px-8 py-4 rounded-full font-bold text-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <MessageCircle className="w-6 h-6" />
            Solicitar Orçamento
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer id="sobre" className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                {settings.logoUrl.startsWith('http') ? (
                  <img src={settings.logoUrl} alt="Logo" className="h-12 object-contain" />
                ) : (
                  <span className="font-bold text-2xl tracking-tight text-blue-900">{settings.logoUrl}</span>
                )}
              </div>
              <p className="text-slate-600">
                Especialistas em corte de tecidos para a indústria da moda e confecção.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Contato</h4>
              <ul className="space-y-3 text-slate-600">
                {settings.phone && (
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-700" />
                    {settings.phone}
                  </li>
                )}
                {settings.whatsapp && (
                  <li className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                    WhatsApp: {settings.whatsapp}
                  </li>
                )}
                {settings.email && (
                  <li className="flex items-center gap-2">
                    <Icons.Mail className="w-4 h-4 text-blue-700" />
                    <a href={`mailto:${settings.email}`} className="hover:text-blue-600 transition-colors">{settings.email}</a>
                  </li>
                )}
                {settings.instagram && (
                  <li className="flex items-center gap-2">
                    <Icons.Instagram className="w-4 h-4 text-pink-600" />
                    <a href={settings.instagram.startsWith('http') ? settings.instagram : `https://instagram.com/${settings.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors">
                      {settings.instagram}
                    </a>
                  </li>
                )}
                {settings.address && (
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-700 shrink-0 mt-1" />
                    <span>{settings.address}</span>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Horário de Atendimento</h4>
              <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                {settings.hours}
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} {settings.logoUrl.startsWith('http') ? 'BS Cortes' : settings.logoUrl}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all flex items-center justify-center group"
        aria-label="Contato via WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute right-full mr-4 bg-white text-slate-800 px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
          Fale com a gente!
        </span>
      </a>
    </div>
  );
}
