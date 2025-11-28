"use client";

import { useState } from "react";
import PageContainer from "../../_components/page-container";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/apiClient";
import { PageTitle } from "../../_components/page-title";
import PageSection from "../../_components/page-section";
import FormCard from "../../_components/forms/form-card";
import { FormField } from "../../_components/forms/form-field";
import SubmitButton from "../../_components/buttons/submit-button";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Name is required");
      return;
    }
    try {
      const res = await apiFetch("http://localhost:3000/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (res.ok) router.push("/projects");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PageContainer>
      <PageTitle>New Project</PageTitle>
      <PageSection>
        <FormCard handleSubmit={handleSubmit}>
          <FormField label="Project name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Website redesign for client X"
              className="w-full p-4 rounded-xl bg-slate-800 text-white border border-slate-700"
            />
          </FormField>
          <FormField label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary of the project..."
              className="w-full p-4 rounded-xl bg-slate-800 text-white border border-slate-700 min-h-32 resize-none"
            />
          </FormField>
          <SubmitButton>Create Project</SubmitButton>
        </FormCard>
      </PageSection>
    </PageContainer>
  );
}
