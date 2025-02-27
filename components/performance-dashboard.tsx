import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { API } from '@/lib/api';

interface PerformanceMetric {
  name: string;
  duration: number;
  status: 'good' | 'warning' | 'critical';
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [successRate, setSuccessRate] = useState<number>(100);
  const [successCount, setSuccessCount] = useState<number>(0);
  const [failureCount, setFailureCount] = useState<number>(0);
  const [formattedMetrics, setFormattedMetrics] = useState<PerformanceMetric[]>([]);
  const [activeTab, setActiveTab] = useState<string>('operations');

  // Fetch performance metrics
  const fetchMetrics = () => {
    try {
      const performanceData = API.getPerformanceMetrics();
      setMetrics(performanceData.durations || {});
      setSuccessCount(performanceData.successCount || 0);
      setFailureCount(performanceData.failureCount || 0);
      setSuccessRate(performanceData.successRate || 100);
      
      // Format metrics for display
      const formatted = Object.entries(performanceData.durations || {}).map(([name, duration]) => ({
        name,
        duration: Number(duration),
        status: getPerformanceStatus(Number(duration))
      }));
      
      setFormattedMetrics(formatted.sort((a, b) => b.duration - a.duration));
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
    }
  };

  // Determine performance status based on duration
  const getPerformanceStatus = (duration: number): 'good' | 'warning' | 'critical' => {
    if (duration < 1000) return 'good';
    if (duration < 3000) return 'warning';
    return 'critical';
  };

  // Format duration in milliseconds to a readable format
  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // Get status color for badges
  const getStatusColor = (status: 'good' | 'warning' | 'critical'): string => {
    switch (status) {
      case 'good': return 'bg-green-500/20 text-green-500';
      case 'warning': return 'bg-yellow-500/20 text-yellow-500';
      case 'critical': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  // Get success rate color
  const getSuccessRateColor = (): string => {
    if (successRate > 95) return 'text-green-500';
    if (successRate > 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Fetch metrics on mount and set up interval
  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Performance Dashboard</span>
          <Button variant="outline" size="sm" onClick={fetchMetrics}>
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Monitor application performance metrics and operation success rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center">
                <span className={getSuccessRateColor()}>{successRate.toFixed(1)}%</span>
              </div>
              <p className="text-sm text-center text-muted-foreground mt-2">Success Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center text-green-500">
                {successCount}
              </div>
              <p className="text-sm text-center text-muted-foreground mt-2">Successful Operations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-center text-red-500">
                {failureCount}
              </div>
              <p className="text-sm text-center text-muted-foreground mt-2">Failed Operations</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="summary">Performance Summary</TabsTrigger>
          </TabsList>
          <TabsContent value="operations" className="space-y-4">
            {formattedMetrics.length > 0 ? (
              <div className="space-y-4">
                {formattedMetrics.map((metric) => (
                  <div key={metric.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{metric.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Duration: {formatDuration(metric.duration)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No operations recorded yet
              </div>
            )}
          </TabsContent>
          <TabsContent value="summary">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formattedMetrics.length > 0 
                        ? formatDuration(formattedMetrics.reduce((acc, curr) => acc + curr.duration, 0) / formattedMetrics.length)
                        : '0ms'}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Slowest Operation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formattedMetrics.length > 0 
                        ? formatDuration(Math.max(...formattedMetrics.map(m => m.duration)))
                        : '0ms'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formattedMetrics.length > 0 
                        ? formattedMetrics.sort((a, b) => b.duration - a.duration)[0]?.name
                        : 'None'}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Performance Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">
                        Good: {formattedMetrics.filter(m => m.status === 'good').length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">
                        Warning: {formattedMetrics.filter(m => m.status === 'warning').length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">
                        Critical: {formattedMetrics.filter(m => m.status === 'critical').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 