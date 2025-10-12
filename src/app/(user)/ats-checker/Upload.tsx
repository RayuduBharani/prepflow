/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SquareChartGantt } from "lucide-react";
import { analyzeResume, ActionState, ApiResponse } from "@/actions/atsActions";
import DisplayResults from "./DisplayResults";
import { Switch } from "@/components/ui/switch";

const Upload = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isJobDescOptional, setIsJobDescOptional] = useState(true);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((file: File | null) => {
    setResume(file);
    if (file) setError(null);
  }, []);

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setJobDescription(e.target.value);
      if (e.target.value) setError(null);
    },
    []
  );

  const toggleJobDescOptional = useCallback(() => {
    setIsJobDescOptional((prev) => {
      if (!prev) setJobDescription("");
      return !prev;
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!resume) {
        toast.warning("Resume Missing", {
          description: "Please upload a resume.",
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
          toast.warning("Error", {
            description: data.error || "Failed to process request.",
          });
        } else if (data.structuredData) {
          setResult(data.structuredData);
          toast.success("Success", { description: "ATS analysis completed." });
        } else {
          setError("No analysis data received");
          toast.warning("Error", { description: "No analysis data received." });
        }
      } catch (error: any) {
        const errorMessage = error.message || "Unexpected error occurred";
        setError(errorMessage);
        toast.warning("Error", { description: errorMessage });
      } finally {
        setLoading(false);
      }
    },
    [resume, jobDescription]
  );

  return (
    <div className="flex flex-col items-center gap-6 pt-8 pb-16 px-4 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-xl animate-fade-in"
      >
        {/* File Upload Section */}
        <div className="space-y-3 animate-slide-up">
          <Label htmlFor="file-upload" className="text-base font-bold">
            Upload Resume
          </Label>
          <FileUpload onChange={handleFileChange} />
        </div>

        {/* Job Description Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between animate-slide-up">
            <Label
              htmlFor="jobdesc"
              className="text-base font-bold animate-fade-up text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-pink-500"
            >
              Job Description {' '}
              {isJobDescOptional && "(Optional)"}
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {isJobDescOptional ? "Enable" : "Disable"}
              </span>
              <Switch
                id="jobdesc-switch"
                checked={!isJobDescOptional}
                onCheckedChange={toggleJobDescOptional}
                className="transition-transform duration-200 ease-in-out"
              />
            </div>
          </div>
          {!isJobDescOptional && (
            <Textarea
              name="jobdesc"
              id="jobdesc"
              rows={10}
              disabled={isJobDescOptional}
              className="w-full text-sm rounded-md animate-fade-up"
              value={jobDescription}
              onChange={handleTextareaChange}
              placeholder="Paste the job description here..."
            />
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant={"secondary"}
          className="w-fit text-xs self-end"
          icon={SquareChartGantt}
          iconPlacement="right"
          effect={"expandIcon"}
          size="sm"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2 animate-pulse">
              Processing...
            </span>
          ) : (
            "Get Results"
          )}
        </Button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="w-full max-w-xl rounded-md p-4 border border-primary text-primary-foreground bg-primary/10">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="w-full max-w-xl animate-fade-in-up">
          <DisplayResults result={result} />
        </div>
      )}
    </div>
  );
};

export default Upload;
