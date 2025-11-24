type PageProps = {
  params: {
    projectId: string;
  };
};

export default function Page({ params }: PageProps) {
  return <div>Project Details placeholder for ID: {params.projectId}</div>;
}
