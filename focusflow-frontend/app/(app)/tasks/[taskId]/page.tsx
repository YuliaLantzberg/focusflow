type PageProps = {
  params: {
    taskId: string;
  };
};

export default function Page({ params }: PageProps) {
  return <div>Task Details placeholder for ID: {params.taskId}</div>;
}
