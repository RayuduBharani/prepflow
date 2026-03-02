import { getCarouselsData } from "@/actions/adminActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, PlusCircle, FileText, FolderOpen } from "lucide-react";
import AddSheetsPage from "./AddSheetsPage";

// --- Configuration & Helpers ---

const DIFFICULTY_STYLES = {
  SCHOOL: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  BASIC: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  EASY: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  MEDIUM: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  HARD: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
};

export default async function AdminDSAPage() {
  const data = await getCarouselsData();

  // --- Optimization: Single pass reduction ---
  const { totalCategories, totalProblems } = data?.reduce(
    (acc, sheet) => {
      acc.totalCategories += sheet.categories.length;
      acc.totalProblems += sheet.categories.reduce(
        (pAcc, cat) => pAcc + cat.problems.length,
        0
      );
      return acc;
    },
    { totalCategories: 0, totalProblems: 0 }
  ) || { totalCategories: 0, totalProblems: 0 };

  // --- DRY: Extracted Stats Config ---
  const STATS = [
    {
      label: "Sheets",
      value: data?.length || 0,
      icon: LayoutGrid,
      wrapperClass: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
      iconClass: "bg-blue-500/20 text-blue-500",
    },
    {
      label: "Categories",
      value: totalCategories,
      icon: FolderOpen,
      wrapperClass: "from-purple-500/10 to-purple-600/5 border-purple-500/20",
      iconClass: "bg-purple-500/20 text-purple-500",
    },
    {
      label: "Problems",
      value: totalProblems,
      icon: FileText,
      wrapperClass: "from-green-500/10 to-green-600/5 border-green-500/20",
      iconClass: "bg-green-500/20 text-green-500",
    },
    {
      label: "Auto-saved",
      value: "Draft",
      icon: PlusCircle,
      wrapperClass: "from-orange-500/10 to-orange-600/5 border-orange-500/20",
      iconClass: "bg-orange-500/20 text-orange-500",
    },
  ];

  return (
    <div className="w-full min-h-screen pt-20 px-4 md:px-8 pb-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            DSA Sheets Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage DSA problem sheets
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <Card
              key={stat.label}
              className={`bg-linear-to-br ${stat.wrapperClass}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.iconClass}`}>
                    <stat.icon className="h-5 w-5" color="currentColor" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="view" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="view" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              View Sheets
            </TabsTrigger>
            <TabsTrigger value="add" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Sheet
            </TabsTrigger>
          </TabsList>

          {/* View Tab */}
          <TabsContent value="view" className="mt-0 focus-visible:ring-0">
            {data && data.length > 0 ? (
              <div className="grid gap-6">
                {data.map((sheet) => (
                  <Card key={sheet.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{sheet.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {sheet.categories.length} categories
                        </Badge>
                      </div>
                      <CardDescription>
                        {sheet.categories.reduce((acc, cat) => acc + cat.problems.length, 0)} problems total
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="multiple" className="w-full">
                        {sheet.categories.map((category) => (
                          <AccordionItem
                            key={category.name}
                            value={category.name}
                            className="border rounded-lg mb-2 px-4 last:mb-0"
                          >
                            <AccordionTrigger className="hover:no-underline py-3">
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{category.name}</span>
                                <Badge variant="outline" className="text-xs font-normal">
                                  {category.problems.length} problems
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                              <div className="space-y-2">
                                {category.problems.map((problem, idx) => (
                                  <div
                                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                                    key={problem.slug || idx}
                                  >
                                    <span className="text-xs text-muted-foreground w-6 text-right">
                                      {idx + 1}.
                                    </span>
                                    <p className="flex-1 text-sm font-medium">
                                      {problem.title}
                                    </p>
                                    <Badge
                                      variant="secondary"
                                      className={`text-xs font-medium border-transparent ${
                                        DIFFICULTY_STYLES[problem.difficulty] || DIFFICULTY_STYLES.EASY
                                      }`}
                                    >
                                      {problem.difficulty}
                                    </Badge>
                                  </div>
                                ))}
                                {category.problems.length === 0 && (
                                  <p className="text-sm text-muted-foreground text-center py-2">
                                    No problems added to this category yet.
                                  </p>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed bg-muted/10">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-muted rounded-full mb-4">
                    <LayoutGrid className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No sheets yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Switch to the &ldquo;Create Sheet&rdquo; tab to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Add Tab */}
          <TabsContent value="add" className="mt-0 focus-visible:ring-0">
            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle>Create New Sheet</CardTitle>
                <CardDescription>
                  Add a new DSA problem sheet with categories and problems. Your progress is automatically saved as a draft.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddSheetsPage />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}