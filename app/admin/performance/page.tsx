'use client';

import { PerformanceDashboard } from '@/components/performance-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComponentErrorBoundary } from '@/components/error-boundary';

export default function PerformancePage() {
  return (
    <ComponentErrorBoundary>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Application Performance</h1>
        
        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <PerformanceDashboard />
          </TabsContent>
          
          <TabsContent value="network">
            <Card>
              <CardHeader>
                <CardTitle>Network Monitoring</CardTitle>
                <CardDescription>
                  Monitor network requests and responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Network monitoring features will be implemented in a future update.
                </p>
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">Current Issues</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>HTTP 500 errors detected on port 3000 (server running on port 3002)</li>
                    <li>Port mismatch detection has been implemented</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Performance Settings</CardTitle>
                <CardDescription>
                  Configure performance monitoring settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Performance settings will be implemented in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ComponentErrorBoundary>
  );
} 