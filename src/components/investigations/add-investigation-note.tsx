"use client";

import { FormEvent, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { addInvestigationNote } from "@/lib/investigations/add-investigation-note";

interface AddInvestigationNoteProps {
  investigationId: string;
}

export function AddInvestigationNote({
  investigationId,
}: AddInvestigationNoteProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    startTransition(async () => {
      try {
        await addInvestigationNote({
          investigationId,
          content,
        });

        setContent("");
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to add investigation note.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="investigation-note" className="text-sm font-medium">
          Investigation Note
        </label>

        <textarea
          id="investigation-note"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          disabled={isPending}
          required
          rows={4}
          placeholder="Document your investigation findings..."
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isPending || !content.trim()}>
        {isPending ? "Adding..." : "Add Note"}
      </Button>
    </form>
  );
}
