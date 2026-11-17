const SectionHeading = ({ eyebrow, title, description }) => (
  <div className="max-w-2xl">
    <div className="text-[10px] uppercase tracking-[0.24em] text-accent">{eyebrow}</div>
    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">{title}</h2>
    <p className="mt-4 text-base leading-8 text-muted">{description}</p>
  </div>
);

export default SectionHeading;
