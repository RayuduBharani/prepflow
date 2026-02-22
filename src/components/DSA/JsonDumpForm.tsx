"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileJson,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  ArrowRight,
} from "lucide-react";
import { fetchProblemsBySlug } from "@/actions/adminActions";
import { toast } from "sonner";

const DRAFT_KEY = "dsa-sheet-draft";

const DIFFICULTY_STYLES: Record<string, string> = {
  SCHOOL: "bg-green-500/10 text-green-500",
  BASIC: "bg-green-500/10 text-green-500",
  EASY: "bg-green-500/10 text-green-500",
  MEDIUM: "bg-orange-500/10 text-orange-500",
  HARD: "bg-red-500/10 text-red-500",
};

interface ProblemInfo {
  slug: string;
  title: string;
  difficulty: string;
}

interface CategoryPreview {
  name: string;
  found: ProblemInfo[];
  missing: string[];
}

interface JsonDumpFormProps {
  onDraftLoaded: () => void;
}

const JsonDumpForm: React.FC<JsonDumpFormProps> = ({ onDraftLoaded }) => {
  const [sheetName, setSheetName] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [preview, setPreview] = useState<CategoryPreview[] | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  // ------------------------------------------------------------------
  // Validation
  // ------------------------------------------------------------------
  const validateJson = (
    raw: string
  ): { ok: true; data: Record<string, string[]> } | { ok: false; error: string } => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { ok: false, error: "Invalid JSON — please check your syntax." };
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { ok: false, error: "JSON must be a plain object { \"Category\": [\"slug\", ...] }" };
    }

    for (const [key, val] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof key !== "string" || !key.trim()) {
        return { ok: false, error: "All category keys must be non-empty strings." };
      }
      if (
        !Array.isArray(val) ||
        (val as unknown[]).some((s) => typeof s !== "string" || !(s as string).trim())
      ) {
        return {
          ok: false,
          error: `Category "${key}" must map to an array of non-empty slug strings.`,
        };
      }
    }

    return { ok: true, data: parsed as Record<string, string[]> };
  };

  // ------------------------------------------------------------------
  // Parse & fetch
  // ------------------------------------------------------------------
  const handleParseAndPreview = async () => {
    setParseError(null);
    setPreview(null);

    const validation = validateJson(jsonText.trim());
    if (!validation.ok) {
      setParseError(validation.error);
      return;
    }

    const categoryMap = validation.data;
    const allSlugs = Array.from(new Set(Object.values(categoryMap).flat()));

    setIsParsing(true);
    try {
      const fetched = await fetchProblemsBySlug(allSlugs);
      const fetchedMap = new Map(fetched.map((p) => [p.slug, p]));

      const previews: CategoryPreview[] = Object.entries(categoryMap).map(
        ([name, slugs]) => {
          const found: ProblemInfo[] = [];
          const missing: string[] = [];
          for (const slug of slugs) {
            const p = fetchedMap.get(slug);
            if (p) {
              found.push({ slug: p.slug, title: p.title, difficulty: p.difficulty });
            } else {
              missing.push(slug);
            }
          }
          return { name, found, missing };
        }
      );

      setPreview(previews);

      const totalFound = previews.reduce((acc, c) => acc + c.found.length, 0);
      const totalMissing = previews.reduce((acc, c) => acc + c.missing.length, 0);

      if (totalMissing > 0) {
        toast.warning(
          `Fetched ${totalFound} problems. ${totalMissing} slug(s) not found in DB.`
        );
      } else {
        toast.success(`All ${totalFound} problems fetched successfully!`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch problems from server.");
    } finally {
      setIsParsing(false);
    }
  };

  // ------------------------------------------------------------------
  // Load into CarouselForm draft
  // ------------------------------------------------------------------
  const handleLoadIntoDraft = () => {
    if (!preview) return;

    const entries = preview
      .filter((c) => c.found.length > 0)
      .map((c) => ({
        id: crypto.randomUUID(),
        category: c.name,
        problems: c.found.map((p) => p.slug),
      }));

    const draft = {
      carouselName: sheetName.trim(),
      entries: entries.length > 0
        ? entries
        : [{ id: crypto.randomUUID(), category: "", problems: [] }],
      lastSaved: new Date().toISOString(),
    };

    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      toast.success("Draft loaded!", {
        description: "Switch to the Manual tab to review and save.",
      });
      onDraftLoaded();
    } catch {
      toast.error("Failed to write draft to localStorage.");
    }
  };

  const totalFound = preview?.reduce((acc, c) => acc + c.found.length, 0) ?? 0;
  const totalMissing = preview?.reduce((acc, c) => acc + c.missing.length, 0) ?? 0;
  const hasValidPreview = preview !== null && totalFound > 0;

  return (
    <div className="space-y-5">
      {/* Sheet Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Sheet Name</label>
        <Input
          placeholder="e.g., Striver's SDE Sheet"
          value={sheetName}
          onChange={(e) => setSheetName(e.target.value)}
          className="text-base"
        />
      </div>

      {/* JSON Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">JSON Input</label>
          <span className="text-xs text-muted-foreground font-mono">
            {"{ \"Category\": [\"slug1\", \"slug2\"] }"}
          </span>
        </div>
        <Textarea
          placeholder={`{\n  "Arrays": ["two-sum", "best-time-to-buy-and-sell-stock"],\n  "Graphs": ["number-of-islands"]\n}`}
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            setParseError(null);
            setPreview(null);
          }}
          rows={9}
          className="font-mono text-sm resize-none"
        />
      </div>

      {/* Parse Error */}
      {parseError && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{parseError}</AlertDescription>
        </Alert>
      )}

      {/* Parse Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        disabled={isParsing || !jsonText.trim() || !sheetName.trim()}
        onClick={handleParseAndPreview}
      >
        {isParsing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileJson className="h-4 w-4" />
        )}
        {isParsing ? "Fetching problems…" : "Parse & Preview"}
      </Button>

      {/* Preview */}
      {preview && (
        <div className="space-y-3">
          {/* Summary badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="gap-1">
              <FolderOpen className="h-3 w-3" />
              {preview.length} categories
            </Badge>
            <Badge
              variant="secondary"
              className="gap-1 bg-green-500/10 text-green-600 hover:bg-green-500/20"
            >
              <CheckCircle2 className="h-3 w-3" />
              {totalFound} found
            </Badge>
            {totalMissing > 0 && (
              <Badge
                variant="secondary"
                className="gap-1 bg-red-500/10 text-red-500 hover:bg-red-500/20"
              >
                <AlertCircle className="h-3 w-3" />
                {totalMissing} missing
              </Badge>
            )}
          </div>

          {/* Category accordion */}
          <Accordion type="multiple" className="border rounded-lg">
            {preview.map((cat) => (
              <AccordionItem key={cat.name} value={cat.name} className="px-4 last:border-0">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">{cat.name}</span>
                    <Badge variant="outline" className="text-xs font-normal">
                      {cat.found.length} found
                    </Badge>
                    {cat.missing.length > 0 && (
                      <Badge
                        variant="outline"
                        className="text-xs font-normal text-red-500 border-red-500/30"
                      >
                        {cat.missing.length} missing
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-3 space-y-1">
                  {cat.found.map((p, idx) => (
                    <div
                      key={p.slug}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50"
                    >
                      <span className="text-xs text-muted-foreground w-6 text-right">
                        {idx + 1}.
                      </span>
                      <p className="flex-1 text-sm font-medium">{p.title}</p>
                      <Badge
                        variant="secondary"
                        className={`text-xs border-transparent ${
                          DIFFICULTY_STYLES[p.difficulty] ?? DIFFICULTY_STYLES.EASY
                        }`}
                      >
                        {p.difficulty}
                      </Badge>
                    </div>
                  ))}
                  {cat.missing.map((slug) => (
                    <div
                      key={slug}
                      className="flex items-center gap-3 p-2 rounded-md bg-red-500/5"
                    >
                      <AlertCircle className="h-3 w-3 text-red-500 shrink-0" />
                      <span className="text-sm text-red-500 font-mono">{slug}</span>
                      <Badge
                        variant="outline"
                        className="text-xs ml-auto border-red-500/30 text-red-500"
                      >
                        not found
                      </Badge>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Load into draft */}
          <Button
            type="button"
            className="w-full gap-2"
            disabled={!hasValidPreview}
            onClick={handleLoadIntoDraft}
          >
            <ArrowRight className="h-4 w-4" />
            Load into Draft
          </Button>
        </div>
      )}
    </div>
  );
};

export default JsonDumpForm;
