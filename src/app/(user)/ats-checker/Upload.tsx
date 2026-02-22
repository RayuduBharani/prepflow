"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AlertCircle, SquareChartGantt } from "lucide-react";
import { analyzeResume, ActionState, ApiResponse } from "@/actions/atsActions";
import { Switch } from "@/components/ui/switch";

const DisplayResults = dynamic(() => import("./DisplayResults"), { ssr: false });

const Upload = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobDescEnabled, setJobDescEnabled] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((file: File | null) => {
    setResume(file);
    if (file) setError(null);
  }, []);

  const toggleJobDesc = useCallback(() => {
    setJobDescEnabled((prev) => {
      if (prev) setJobDescription("");
      return !prev;
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.SubmitEvent) => {
      e.preventDefault();
      if (!resume) {
        toast.warning("Resume Missing", {
          description: "Please upload a resume before submitting.",
        });
        return;
      }

      setLoading(true);
      setError(null);
      setResult(null);

      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobdesc", jobDescription);

      try {
        const initialState: ActionState = {
          error: undefined,
          details: undefined,
          structuredData: undefined,
        };
        const data: ActionState = await analyzeResume(initialState, formData);

        if (data.error) {
          setError(data.error);
          toast.error("Analysis failed", { description: data.error });
        } else if (data.structuredData) {
          setResult(data.structuredData);
          toast.success("Analysis complete", {
            description: "Your ATS results are ready.",
          });
        } else {
          setError("No analysis data received.");
          toast.error("Something went wrong", {
            description: "No data returned from analysis.",
          });
        }
      } catch (err: any) {
        const msg = err.message || "An unexpected error occurred.";
        setError(msg);
        toast.error("Error", { description: msg });
      } finally {
        setLoading(false);
      }
    },
    [resume, jobDescription]
  );

  return (
    <div className="flex flex-col items-center gap-8 pb-20 px-4 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-xl"
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-1">
          <div>
            <h1 className="text-lg font-bold leading-tight">ATS Resume Checker</h1>
            <p className="text-sm text-muted-foreground">
              Upload your resume and get an instant ATS score
            </p>
          </div>
        </div>

        {/* ── File Upload ── */}
        <div className="flex flex-col gap-2 rounded-2xl border border-border/60 p-4">
          <FileUpload onChange={handleFileChange} />
          {resume && (
            <p className="text-xs text-emerald-600 font-medium mt-1">
              ✓ {resume.name}
            </p>
          )}
        </div>

        {/* ── Job Description ── */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="jobdesc" className="text-base font-semibold">
                Job Description
              </Label>
              {!jobDescEnabled && (
                <span className="text-xs text-muted-foreground font-normal">
                  (optional)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {jobDescEnabled ? "On" : "Off"}
              </span>
              <Switch
                id="jobdesc-switch"
                checked={jobDescEnabled}
                onCheckedChange={toggleJobDesc}
              />
            </div>
          </div>

          {jobDescEnabled ? (
            <Textarea
              name="jobdesc"
              id="jobdesc"
              rows={8}
              className="w-full text-sm rounded-xl resize-none"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to get a tailored ATS analysis…"
            />
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enable to compare your resume against a specific job description
              for a more accurate score and targeted suggestions.
            </p>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900/50 p-4 text-red-700 dark:text-red-400">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="text-sm font-medium leading-snug">{error}</p>
          </div>
        )}

        {/* ── Submit ── */}
        <Button
          type="submit"
          className="w-full h-11 text-base font-semibold rounded-xl gap-2"
          disabled={loading || !resume}
        >
          {loading ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Analysing…
            </>
          ) : (
            <>
              <SquareChartGantt className="h-4 w-4" />
              Analyse Resume
            </>
          )}
        </Button>
      </form>

      {/* ── Results ── */}
      {result && (
        <div className="w-full max-w-xl">
          <DisplayResults result={result} />
        </div>
      )}
    </div>
  );
};

export default Upload;