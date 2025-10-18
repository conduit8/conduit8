interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
}

export const SectionHeader = ({ label, title, description }: SectionHeaderProps) => {
  return (
    <div className="gap-md flex flex-col text-left md:text-center">
      <p className="text-accent text-strong">{label}</p>
      <h2>{title}</h2>
      {description && (
        <p className="text-muted-foreground max-w-2xl text-left md:mx-auto md:text-center">
          {description}
        </p>
      )}
    </div>
  );
};
