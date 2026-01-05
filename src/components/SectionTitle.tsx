interface SectionTitleProps {
  title: string;
}

const SectionTitle = ({ title }: SectionTitleProps) => {
  return (
    <div className="bg-cil-gray py-2 px-4" style={{ borderBottom: '3px solid #b32d00' }}>
      <h1 className="text-sm font-normal" style={{ color: '#b32d00' }}>{title}</h1>
    </div>
  );
};

export default SectionTitle;
