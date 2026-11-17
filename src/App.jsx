import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Building2,
  Check,
  ChevronRight,
  Cpu,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MoveRight,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import emailjs from '@emailjs/browser';
import { portfolio } from './data/portfolio';
import SectionHeading from './components/SectionHeading';
import ProjectCard from './components/ProjectCard';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeCertFilter, setActiveCertFilter] = useState('All');
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitState, setSubmitState] = useState('idle');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = portfolio.navLinks.map((link) => link.target);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { threshold: [0.25, 0.5, 0.75] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const filteredCertificates = useMemo(() => {
    if (activeCertFilter === 'All') return portfolio.certificates;
    return portfolio.certificates.filter((cert) => cert.category === activeCertFilter);
  }, [activeCertFilter]);

  const handleNavClick = (target) => {
    setMobileOpen(false);
    const anchor = document.getElementById(target);
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formState.name.trim()) nextErrors.name = 'Please enter your name.';
    if (!formState.email.trim()) nextErrors.email = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) nextErrors.email = 'Please use a valid email address.';
    if (!formState.subject.trim()) nextErrors.subject = 'Please add a subject.';
    if (!formState.message.trim()) nextErrors.message = 'Please leave a short message.';
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      setSubmitState('loading');
      try {
        await emailjs.send(serviceId, templateId, {
          from_name: formState.name,
          from_email: formState.email,
          subject: formState.subject,
          message: formState.message,
        }, publicKey);

        setSubmitState('success');
        setFormState({ name: '', email: '', subject: '', message: '' });
        setFormErrors({});
      } catch (error) {
        console.error(error);
        setSubmitState('error');
      }
      return;
    }

    setSubmitState('fallback');
  };

  return (
    <div className="min-h-screen bg-midnight text-text antialiased selection:bg-accent/30">
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-white/10 bg-[#080d19]/75 backdrop-blur-xl' : 'bg-transparent'}`}>
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            className="flex items-center gap-3 text-left"
            onClick={() => handleNavClick('home')}
            aria-label="Go to home section"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-mono text-sm font-semibold text-accent shadow-soft">
              ER
            </div>
            <div className="hidden sm:block">
              <div className="text-xs uppercase tracking-[0.26em] text-muted">Ambati</div>
              <div className="font-medium text-white">Eswar Reddy</div>
            </div>
          </button>

          <div className="hidden items-center gap-8 lg:flex">
            {portfolio.navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavClick(link.target)}
                className={`relative text-sm font-medium transition duration-200 ${activeSection === link.target ? 'text-white' : 'text-muted hover:text-white'}`}
              >
                {link.label}
                <span className={`absolute -bottom-2 left-0 h-px w-full origin-left transition-transform duration-300 ${activeSection === link.target ? 'scale-x-100 bg-accent' : 'scale-x-0 bg-accent'} `} />
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <a href={portfolio.resumeLink} className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition hover:border-accent hover:bg-accent/15">
              View Resume
              <ArrowRight size={16} />
            </a>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="border-t border-white/10 bg-[#080d19]/95 px-4 pb-4 pt-3 lg:hidden"
            >
              <div className="flex flex-col gap-2">
                {portfolio.navLinks.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => handleNavClick(link.target)}
                    className={`rounded-xl px-3 py-2 text-left text-sm font-medium ${activeSection === link.target ? 'bg-white/5 text-white' : 'text-muted'}`}
                  >
                    {link.label}
                  </button>
                ))}
                <a href={portfolio.resumeLink} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-4 py-2.5 text-sm font-medium text-accent">
                  View Resume
                  <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section id="home" className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(66,217,255,0.15),transparent_30%),radial-gradient(circle_at_right,_rgba(139,124,255,0.12),transparent_35%),linear-gradient(180deg,#080D19_0%,#0A1222_100%)]" />
          <div className="absolute inset-0 -z-10 bg-grid bg-[size:36px_36px] opacity-40" />
          <div className="mx-auto grid min-h-[calc(100svh-72px)] max-w-7xl items-center gap-10 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-10 lg:pt-12">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/8 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-accent sm:text-[11px]">
                <Sparkles size={12} />
                Software Engineer in the making | Cloud • Backend • AI
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.06em] text-white sm:text-5xl md:text-6xl lg:text-[4.15rem]">
                Building Intelligent Products. Engineering for Scale.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-8 text-muted sm:text-lg">
                I&apos;m Ambati Eswar Reddy, an IT undergraduate and developer building backend systems, cloud-deployed applications, and AI-powered solutions that solve real-world problems.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button type="button" onClick={() => handleNavClick('projects')} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-[#07131E] transition hover:brightness-110">
                  Explore My Work
                  <MoveRight size={18} />
                </button>
                <a href={portfolio.resumeLink} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10">
                  Download Resume
                  <ArrowRight size={18} />
                </a>
              </div>

              <div className="mt-8 flex items-center gap-5 text-sm text-muted">
                <a href={portfolio.socials.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:border-accent/40 hover:text-white" aria-label="GitHub profile">
                  <Github size={16} />
                  GitHub
                </a>
                <a href={portfolio.socials.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:border-accent/40 hover:text-white" aria-label="LinkedIn profile">
                  <Linkedin size={16} />
                  LinkedIn
                </a>
              </div>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-3 sm:gap-4">
                {portfolio.heroStats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
                    <div className="text-sm font-semibold text-white">{item.value}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.12 }}
              className="relative mx-auto w-full max-w-[560px]"
            >
              <div className="absolute left-10 top-8 h-28 w-28 rounded-full bg-accent/20 blur-3xl" />
              <div className="absolute right-10 top-16 h-36 w-36 rounded-full bg-violet/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c162a]/80 p-3 shadow-soft">
                <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,24,39,0.9),rgba(9,16,29,0.95))] px-3 pb-2 pt-4">
                  <div className="mb-4 flex items-center justify-between px-3 text-[10px] uppercase tracking-[0.2em] text-muted">
                    <span>workspace</span>
                    <span>Build • Deploy • Learn</span>
                  </div>

                  <div className="relative h-[430px] overflow-hidden rounded-[1.25rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(66,217,255,0.15),transparent_30%),linear-gradient(180deg,#111827_0%,#0b1221_100%)]">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:26px_26px]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(66,217,255,0.22),transparent_18%),radial-gradient(circle_at_70%_10%,rgba(139,124,255,0.22),transparent_26%)]" />

                    <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0a101b] to-transparent" />

                    <div className="absolute left-7 top-8 rounded-full border border-white/10 bg-[#121b2d]/80 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-md">
                      Python • Django • AWS
                    </div>
                    <div className="absolute right-8 top-16 rounded-full border border-white/10 bg-[#121b2d]/80 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-md">
                      React • AI/ML
                    </div>

                    <div className="absolute left-6 right-6 bottom-8 rounded-[1.5rem] border border-white/10 bg-[#0f1829]/90 p-4 shadow-soft backdrop-blur-md">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted">
                          <Cpu size={12} className="text-accent" />
                          product stack
                        </div>
                        <div className="rounded-full border border-emerald/40 px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-emerald-300">
                          online
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {['Django', 'AWS', 'LLMs', 'AI/ML'].map((label) => (
                          <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-muted">
                            {label}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="absolute left-1/2 top-[72px] h-[280px] w-[250px] -translate-x-1/2 overflow-hidden rounded-[28%_72%_55%_45%/34%_39%_61%_66%] border border-white/10 bg-[linear-gradient(135deg,#d3d7e0_0%,#65728d_25%,#2d3747_55%,#101827_100%)] shadow-[0_30px_60px_rgba(7,17,31,0.7)]">
                      <div className="absolute inset-x-0 bottom-0 h-[52%] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.3),transparent_24%),linear-gradient(180deg,#121a2b_0%,#0b1120_100%)]" />
                      <div className="absolute left-[30%] top-[14%] h-20 w-20 rounded-full border border-white/30 bg-[radial-gradient(circle_at_35%_35%,#f0f0f0,#d2d8e0_30%,#a9b1c4_60%,#6f7d95_100%)]" />
                      <div className="absolute left-[36%] top-[30%] h-16 w-12 rounded-[20px] border border-white/20 bg-[linear-gradient(180deg,_#e9ecf3,_#bdc6d8_45%,_#717d91_100%)]" />
                      <div className="absolute left-[44%] top-[40%] h-24 w-12 rounded-full border border-white/20 bg-[linear-gradient(180deg,_#1a2437,_#0d1420_100%)]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-center pb-8">
            <button type="button" onClick={() => handleNavClick('about')} className="inline-flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted transition hover:text-white" aria-label="Scroll to about section">
              <span>Scroll</span>
              <span className="flex h-10 w-6 items-start justify-center rounded-full border border-white/10 bg-white/5">
                <span className="mt-2 h-2.5 w-1 rounded-full bg-accent animate-bounce" />
              </span>
            </button>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="About" title="Backend-first systems, cloud-scale thinking, and applied AI." description="I design and build practical software with clean architecture, production-minded deployment, and measurable impact." />

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45 }}>
              <p className="text-lg leading-9 text-muted">
                I&apos;m Ambati Eswar Reddy, a final-year B.Tech Information Technology student at Bapatla Engineering College. I build end-to-end applications spanning backend engineering, AWS cloud deployment, and AI/ML. My experience includes developing authenticated web applications, deploying production-oriented systems, building AI-powered platforms, and exploring on-device machine learning. I enjoy turning complex ideas into reliable, useful software.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {portfolio.aboutCards.map((card) => (
                  <div key={card.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-muted">{card.label}</div>
                    <div className="mt-2 text-base font-medium text-white">{card.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <div className="mb-5 text-[10px] uppercase tracking-[0.22em] text-accent">What I Bring</div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {portfolio.aboutFocus.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                        <Check size={14} />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: 0.08 }} className="rounded-[2rem] border border-white/10 bg-[#101827]/80 p-5 shadow-soft">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(66,217,255,0.18),transparent_20%),linear-gradient(180deg,#111827_0%,#0b1220_100%)] px-5 py-6">
                <div className="mb-5 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted">
                  <span>Profile</span>
                  <span className="rounded-full border border-emerald/40 px-2 py-1 text-emerald-300">Available</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full border border-white/15 bg-[linear-gradient(135deg,#d7dfe9,#71829c)]">
                    <div className="absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.3),transparent_30%),linear-gradient(180deg,#121a2b_0%,#07111c_100%)]" />
                    <div className="absolute left-1/2 top-[28%] h-8 w-8 -translate-x-1/2 rounded-full bg-[#f2d8c7]" />
                    <div className="absolute left-[28%] top-[42%] h-10 w-12 rounded-[20px] bg-[#1c2431]" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">Ambati Eswar Reddy</div>
                    <div className="mt-1 text-sm text-muted">Backend & Cloud Engineer</div>
                  </div>
                </div>

                <div className="mt-8 space-y-4 text-sm text-muted">
                  <div className="flex items-center gap-3"><MapPin size={16} className="text-accent" /> Andhra Pradesh, India</div>
                  <div className="flex items-center gap-3"><GraduationCap size={16} className="text-accent" /> B.Tech Information Technology</div>
                  <div className="flex items-center gap-3"><Building2 size={16} className="text-accent" /> Bapatla Engineering College</div>
                  <div className="flex items-center gap-3"><Star size={16} className="text-accent" /> CGPA 9.7 / 10</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="skills" className="border-y border-white/10 bg-[#0b1220]/60 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Skills" title="Engineering depth across backend, cloud, and AI." description="A practical stack shaped by building production-ready systems, cloud deployments, and applied research prototypes." />

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {portfolio.skillGroups.map((group) => (
                <motion.div key={group.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35 }} className="rounded-[1.75rem] border border-white/10 bg-[#101827]/80 p-5">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                      {group.icon}
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-muted">{group.label}</div>
                      <h3 className="mt-1 text-xl font-semibold text-white">{group.title}</h3>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span key={skill} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted">{skill}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Experience" title="Hands-on internships building backend systems and cloud products." description="From Django services to AWS deployment and AI-enabled platforms, my work is centered on product impact and engineering discipline." />

          <div className="mt-12 space-y-8">
            {portfolio.experience.map((role, index) => (
              <motion.article key={role.role} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.06 }} className="relative rounded-[2rem] border border-white/10 bg-[#101827]/70 p-6 md:p-8">
                <div className="absolute left-6 top-7 h-3 w-3 rounded-full bg-accent shadow-[0_0_0_6px_rgba(66,217,255,0.15)]" />
                <div className="ml-8">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-accent">{role.type}</div>
                      <h3 className="mt-2 text-2xl font-semibold text-white">{role.role}</h3>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted">
                      {role.duration}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
                    <span>{role.organization}</span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span>{role.mode}</span>
                  </div>

                  <ul className="mt-6 space-y-3 text-base leading-7 text-muted">
                    {role.highlights.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="projects" className="border-y border-white/10 bg-[#0b1220]/60 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Projects" title="Research-driven products and real-world engineering solutions." description="Selected work combining AI, cloud deployment, full-stack backend systems, and user-focused product thinking." />

            <div className="mt-12 grid gap-6 xl:grid-cols-3">
              {portfolio.projects.map((project) => (
                <ProjectCard key={project.title} project={project} onOpen={() => setSelectedProject(project)} />
              ))}
            </div>
          </div>
        </section>

        <section id="certificates" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Certificates" title="Structured learning across cloud, AI, and secure systems." description="A mix of completed credentials and active learning tracks that reflect continued technical depth." />

          <div className="mt-8 flex flex-wrap gap-3">
            {['All', 'AWS & Cloud', 'AI/ML', 'Other'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveCertFilter(filter)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeCertFilter === filter ? 'bg-accent text-[#07131E]' : 'border border-white/10 bg-white/5 text-muted hover:border-white/20 hover:text-white'}`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCertificates.map((certificate) => (
              <motion.article key={certificate.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.35 }} className="rounded-[1.75rem] border border-white/10 bg-[#101827]/80 p-5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-muted">
                    {certificate.category}
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${certificate.completed ? 'border border-emerald/30 bg-emerald/10 text-emerald-300' : 'border border-amber-400/30 bg-amber-500/10 text-amber-300'}`}>
                    {certificate.completed ? 'Completed' : 'In progress'}
                  </span>
                </div>
                <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-[radial-gradient(circle_at_10%_20%,rgba(66,217,255,0.10),transparent_20%),linear-gradient(180deg,#0f1727,#0b1220)] p-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted">{certificate.issuer}</div>
                  <div className="mt-3 text-lg font-semibold text-white">{certificate.name}</div>
                  <div className="mt-2 text-sm text-muted">{certificate.year}</div>
                </div>
                {certificate.link && (
                  <a href={certificate.link} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-white">
                    Verify credential
                    <ChevronRight size={16} />
                  </a>
                )}
              </motion.article>
            ))}
          </div>
        </section>

        <section id="websites" className="border-y border-white/10 bg-[#0b1220]/60 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Websites" title="Live applications and working demos." description="Deployed tools, product prototypes, and cloud-hosted work that demonstrate practical implementation and product thinking." />

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {portfolio.websites.map((website) => (
                <motion.article key={website.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35 }} className="rounded-[1.75rem] border border-white/10 bg-[#101827]/80 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-xl font-semibold text-white">{website.name}</div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-muted">{website.status}</div>
                  </div>
                  <p className="text-sm leading-7 text-muted">{website.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                    {website.tech.map((tech) => (
                      <span key={tech} className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{tech}</span>
                    ))}
                  </div>
                  <div className="mt-5 flex gap-3">
                    {website.url ? (
                      <a href={website.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-[#07131E]">
                        Visit Website
                        <ArrowRight size={16} />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-white/15 px-4 py-2 text-sm text-muted">Live URL pending</span>
                    )}
                    {website.source && (
                      <a href={website.source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
                        View Source
                      </a>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="achievements" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Achievements" title="Recognition for impactful innovation and academic excellence." description="From competitive innovation wins to research and disciplined academic performance, the work reflects a consistent record of execution." />

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              {portfolio.achievements.map((achievement, index) => (
                <motion.div key={achievement.title} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.4, delay: index * 0.04 }} className="flex gap-4 rounded-[1.5rem] border border-white/10 bg-[#101827]/80 p-5">
                  <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                    {achievement.icon}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-accent">{achievement.badge}</div>
                    <h3 className="mt-2 text-xl font-semibold text-white">{achievement.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted">{achievement.description}</p>
                    {achievement.link && (
                      <a href={achievement.link} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-white">
                        Read Publication
                        <ArrowRight size={16} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4 }} className="rounded-[2rem] border border-white/10 bg-[#101827]/75 p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet/30 bg-violet/10 text-violet"><Award size={20} /></div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted">Research</div>
                  <h3 className="mt-1 text-xl font-semibold text-white">Publication Spotlight</h3>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(139,124,255,0.12),transparent_20%),linear-gradient(180deg,#111827_0%,#091321_100%)] p-5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-violet">ICSIE 2026</div>
                <h4 className="mt-3 text-2xl font-semibold text-white">Placement Intelligence Platform Using AI</h4>
                <div className="mt-3 text-sm text-muted">Paper ID: ICSIE2601549</div>
                <p className="mt-4 text-sm leading-7 text-muted">
                  Accepted research paper focused on AI-driven placement intelligence and predictive decision support for student performance and academic readiness.
                </p>
                {portfolio.publicationLink && (
                  <a href={portfolio.publicationLink} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-violet hover:text-white">
                    Read Publication
                    <ArrowRight size={16} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="education" className="border-y border-white/10 bg-[#0b1220]/60 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Education" title="Academic excellence with a strong systems and innovation focus." description="Three consecutive years as department topper and a strong academic foundation in Information Technology." />

            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4 }} className="mt-10 rounded-[2rem] border border-white/10 bg-[#101827]/80 p-6 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-accent">Institution</div>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Bapatla Engineering College (Autonomous)</h3>
                  <p className="mt-2 text-lg text-muted">B.Tech in Information Technology</p>
                </div>
                <div className="rounded-full border border-accent/30 bg-accent/10 px-3 py-2 text-sm font-medium text-accent">
                  CGPA 9.7 / 10
                </div>
              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted">Academic period</div>
                  <div className="mt-2 text-lg text-white">2023 – 2027</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted">Academic excellence</div>
                  <div className="mt-2 text-lg text-white">Department topper</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted">Recognition</div>
                  <div className="mt-2 text-lg text-white">3 consecutive years</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Contact" title="Have an idea worth building?" description="I’m interested in opportunities across backend engineering, cloud infrastructure, and applied AI. Let’s connect and build something meaningful." />

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.45 }} className="rounded-[2rem] border border-white/10 bg-[#101827]/80 p-6">
              <div className="space-y-5 text-sm text-muted">
                <div className="flex items-center gap-3"><Mail size={16} className="text-accent" /> ambatieswarreddy25@gmail.com</div>
                <div className="flex items-center gap-3"><Linkedin size={16} className="text-accent" /> <a href={portfolio.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-white">linkedin.com/in/ambatieswar</a></div>
                <div className="flex items-center gap-3"><Github size={16} className="text-accent" /> <a href={portfolio.socials.github} target="_blank" rel="noreferrer" className="hover:text-white">github.com/ambatieswar</a></div>
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_25%_20%,rgba(66,217,255,0.10),transparent_25%),linear-gradient(180deg,#0f1727,#0b1220)] p-5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-accent">Setup note</div>
                <p className="mt-3 text-sm leading-7 text-muted">
                  The contact form uses EmailJS when <span className="font-mono text-white">VITE_EMAILJS_SERVICE_ID</span>, <span className="font-mono text-white">VITE_EMAILJS_TEMPLATE_ID</span>, and <span className="font-mono text-white">VITE_EMAILJS_PUBLIC_KEY</span> are configured. Otherwise, it falls back to a mailto action and prompts for configuration.
                </p>
                <a href="mailto:ambatieswarreddy25@gmail.com?subject=Portfolio%20Inquiry" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-accent">
                  Send mail directly
                  <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>

            <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.45, delay: 0.08 }} onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-[#101827]/80 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm text-muted">Full name</label>
                  <input id="name" value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-accent/60" placeholder="Your name" aria-invalid={Boolean(formErrors.name)} />
                  {formErrors.name && <p className="mt-2 text-xs text-red-300">{formErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm text-muted">Email</label>
                  <input id="email" type="email" value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-accent/60" placeholder="you@example.com" aria-invalid={Boolean(formErrors.email)} />
                  {formErrors.email && <p className="mt-2 text-xs text-red-300">{formErrors.email}</p>}
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="subject" className="mb-2 block text-sm text-muted">Subject</label>
                <input id="subject" value={formState.subject} onChange={(e) => setFormState({ ...formState, subject: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-accent/60" placeholder="Project collaboration" aria-invalid={Boolean(formErrors.subject)} />
                {formErrors.subject && <p className="mt-2 text-xs text-red-300">{formErrors.subject}</p>}
              </div>

              <div className="mt-5">
                <label htmlFor="message" className="mb-2 block text-sm text-muted">Message</label>
                <textarea id="message" rows="6" value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-accent/60" placeholder="Tell me about your idea, team, or opportunity..." aria-invalid={Boolean(formErrors.message)} />
                {formErrors.message && <p className="mt-2 text-xs text-red-300">{formErrors.message}</p>}
              </div>

              {submitState === 'success' && (
                <p className="mt-5 rounded-2xl border border-emerald/30 bg-emerald/10 px-4 py-3 text-sm text-emerald-200">Message sent successfully. I&apos;ll get back to you soon.</p>
              )}
              {submitState === 'error' && (
                <p className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">The message could not be sent. Please email me directly or verify your EmailJS configuration.</p>
              )}
              {submitState === 'fallback' && (
                <p className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">Email service is not configured yet. Please send your message directly via email at ambatieswarreddy25@gmail.com.</p>
              )}

              <button type="submit" className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-[#07131E] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60" disabled={submitState === 'loading'}>
                {submitState === 'loading' ? 'Sending...' : 'Send Message'}
                <ArrowRight size={16} />
              </button>
            </motion.form>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#070d18]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-mono text-sm font-semibold text-accent">ER</div>
            <div>
              <div className="text-sm text-white">Designed and built by Ambati Eswar Reddy.</div>
              <div className="text-xs text-muted">© {new Date().getFullYear()} All rights reserved.</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
            {portfolio.navLinks.map((link) => (
              <button key={link.label} type="button" onClick={() => handleNavClick(link.target)} className="transition hover:text-white">{link.label}</button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-muted">
            <a href={portfolio.socials.github} target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:text-white" aria-label="GitHub">
              <Github size={16} />
            </a>
            <a href={portfolio.socials.linkedin} target="_blank" rel="noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:text-white" aria-label="LinkedIn">
              <Linkedin size={16} />
            </a>
            <button type="button" onClick={() => handleNavClick('home')} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:border-accent/40 hover:text-accent" aria-label="Back to top">
              <ChevronRight size={16} className="rotate-[-90deg]" />
            </button>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050b13]/80 p-4 backdrop-blur-sm">
            <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }} transition={{ duration: 0.25 }} className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-[2rem] border border-white/10 bg-[#101827] p-6 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-accent">Featured project</div>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{selectedProject.title}</h3>
                </div>
                <button type="button" onClick={() => setSelectedProject(null)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white" aria-label="Close project details">
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_20%_10%,rgba(66,217,255,0.12),transparent_20%),linear-gradient(180deg,#111827_0%,#0b1220_100%)] p-5">
                <div className="text-sm leading-7 text-muted">{selectedProject.problem}</div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {selectedProject.stack.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted">{item}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted">Key features</div>
                  <ul className="mt-3 space-y-2 text-sm leading-7 text-muted">
                    {selectedProject.features.map((feature) => (
                      <li key={feature} className="flex gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-accent" /> {feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted">Impact</div>
                  <p className="mt-3 text-sm leading-7 text-muted">{selectedProject.result}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {selectedProject.github && (
                  <a href={selectedProject.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">View Source</a>
                )}
                {selectedProject.demo && (
                  <a href={selectedProject.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-[#07131E]">Visit Demo</a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
