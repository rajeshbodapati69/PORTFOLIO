import { ArrowUpRight } from 'lucide-react';

const ProjectCard = ({ project, onOpen }) => {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101827]/80 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-soft">
      <div className="h-52 overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_20%_10%,rgba(66,217,255,0.12),transparent_20%),linear-gradient(180deg,#111827_0%,#0b1220_100%)] p-5">
        <div className="flex h-full items-end justify-between rounded-[1.25rem] border border-white/10 bg-[linear-gradient(135deg,rgba(66,217,255,0.12),rgba(139,124,255,0.10))] p-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted">Product</div>
            <div className="mt-3 text-2xl font-semibold text-white">{project.title}</div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm leading-7 text-muted">{project.problem}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <span key={item} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-muted">{item}</span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button type="button" onClick={onOpen} className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-white">
            View Details
            <ArrowUpRight size={14} />
          </button>
          <div className="flex gap-2">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white">GitHub</a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white">Demo</a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
