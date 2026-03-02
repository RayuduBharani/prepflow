'use client'
import React from 'react'
import CarouselForm from '@/components/DSA/CarouselForm'
import JsonDumpForm from '@/components/DSA/JsonDumpForm'
import Form from 'next/form'
import { extractData } from '@/actions/extractData'
import { Button } from '@/components/ui/button'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Download, FileJson, Loader2, PencilLine } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const AddSheetsPage = () => {
  const [client] = React.useState(() => new QueryClient())
  const [isExtracting, setIsExtracting] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('manual')

  return (
    <QueryClientProvider client={client}>
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-xs grid-cols-2 mb-4">
            <TabsTrigger value="manual" className="gap-2 text-xs">
              <PencilLine className="h-3.5 w-3.5" />
              Manual
            </TabsTrigger>
            <TabsTrigger value="json-dump" className="gap-2 text-xs">
              <FileJson className="h-3.5 w-3.5" />
              JSON Dump
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="mt-0 focus-visible:ring-0">
            <CarouselForm />
          </TabsContent>

          <TabsContent value="json-dump" className="mt-0 focus-visible:ring-0">
            <JsonDumpForm onDraftLoaded={() => setActiveTab('manual')} />
          </TabsContent>
        </Tabs>

        {/* Admin Actions */}
        <Accordion type="single" collapsible className="border rounded-lg">
          <AccordionItem value="admin-actions" className="border-0">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="text-sm font-medium text-muted-foreground">
                Advanced Actions
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="flex flex-wrap gap-3">
                <Form action={extractData}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    type="submit"
                    disabled={isExtracting}
                    onClick={() => setIsExtracting(true)}
                  >
                    {isExtracting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Extract Data
                  </Button>
                </Form>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </QueryClientProvider>
  )
}

export default AddSheetsPage