interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <div className="text-center py-12 bg-gradient-to-r from-muted/30 to-accent/10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 page-transition">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl text-muted-foreground page-transition">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};