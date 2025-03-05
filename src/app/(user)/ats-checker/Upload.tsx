/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SquareChartGantt } from "lucide-react";
import { analyzeResume, ActionState, ApiResponse } from "@/actions/atsActions";
import DisplayResults from "./DisplayResults";


const Upload = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = useCallback((file: File | null) => {
    setResume(file);
  }, []);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!resume || !jobDescription) {
        toast({
          title: "Resume or Description Empty",
          description: "Please upload a resume and enter a job description",
          variant: "destructive",
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
        const initialState: ActionState = { error: undefined, details: undefined, structuredData: undefined };
        const data: ActionState = await analyzeResume(initialState, formData);

        if (data.error) {
          setError(data.error);
          toast({
            title: "Error",
            description: data.error || "Failed to process request",
            variant: "destructive",
          });
        } else if (data.structuredData) {
          console.log(data.structuredData)
          setResult(data.structuredData);
          toast({
            title: "Success",
            description: "ATS analysis completed",
            variant: "default",
          });
        } else {
          setError("No analysis data received");
          toast({
            title: "Error",
            description: "No analysis data received",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        const errorMessage = error.message || "An unexpected error occurred";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [resume, jobDescription, toast]
  );

  return (
    <div className="flex flex-col items-center gap-6 pt-8 pb-16">
      <form className="flex flex-col gap-4 w-full max-w-xl" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <FileUpload onChange={handleFileChange} />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-base text-transparent w-fit bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 font-bold" htmlFor="jobdesc">Job Description</Label>
          <Textarea
            name="jobdesc"
            id="jobdesc"
            rows={10}
            className="w-full text-sm"
            value={jobDescription}
            onChange={handleTextareaChange}
            placeholder="Paste the job description here..."
          />
        </div>

        <Button
          type="submit"
          className="w-fit text-xs self-end"
          icon={SquareChartGantt}
          iconPlacement="left"
          effect="hoverUnderline"
          size="sm"
          variant="secondary"
          disabled={loading}
        >
          {loading ? "Processing..." : "Get Results"}
        </Button>
      </form>

      {/* Display Errors */}
      {error && (
        <div className="w-full max-w-xl rounded-md bg-destructive p-4 text-destructive-foreground">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Display Results */}
      {result && <DisplayResults result={result}  />}
    </div>
  );
};

export default Upload;