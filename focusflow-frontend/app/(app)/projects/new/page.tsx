"use client";

import { useState } from "react";
import PageContainer from "../../_components/page-container";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/apiClient";

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
      <h1>New Project</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-white"
        />
        <textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-white"
        ></textarea>
        <button type="submit">Create Project</button>
      </form>
    </PageContainer>
  );
}
