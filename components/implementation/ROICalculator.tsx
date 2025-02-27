"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GradientHeading } from "@/components/agent/gradient-heading";
import { TextureCard } from "@/components/agent/texture-card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Clock, AlertCircle } from "lucide-react";

// Chart component using canvas for simple visualization
function ROIChart({
  investmentData,
  returnsData,
  breakEvenPoint,
}: {
  investmentData: { x: number; y: number }[];
  returnsData: { x: number; y: number }[];
  breakEvenPoint: { x: number; y: number } | null;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Canvas setup
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = 'rgba(30, 30, 36, 0.5)';
    ctx.fillRect(0, 0, width, height);
    
    // Find max Y value for scaling
    const allYValues = [...investmentData.map(d => d.y), ...returnsData.map(d => d.y)];
    const maxY = Math.max(...allYValues) * 1.1; // Add 10% padding
    
    // X and Y axis
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    
    // Draw X axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw Y axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // X axis labels
    const quarters = 6; // Total number of quarters to show
    const xStep = (width - 2 * padding) / quarters;
    
    ctx.fillStyle = '#aaa';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    
    for (let i = 0; i <= quarters; i++) {
      const x = padding + i * xStep;
      ctx.fillText(`Q${i+1}`, x, height - padding + 15);
      
      // X axis tick
      ctx.beginPath();
      ctx.moveTo(x, height - padding);
      ctx.lineTo(x, height - padding + 5);
      ctx.stroke();
    }
    
    // Y axis labels
    const yStep = (height - 2 * padding) / 4;
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 4; i++) {
      const y = height - padding - i * yStep;
      const value = (maxY * i / 4).toFixed(0);
      ctx.fillText(`${value}k`, padding - 5, y + 3);
      
      // Y axis tick
      ctx.beginPath();
      ctx.moveTo(padding - 5, y);
      ctx.lineTo(padding, y);
      ctx.stroke();
    }
    
    // Function to convert data point to canvas coordinates
    const toCanvasCoords = (point: { x: number; y: number }) => ({
      x: padding + (point.x / quarters) * (width - 2 * padding),
      y: height - padding - (point.y / maxY) * (height - 2 * padding)
    });
    
    // Draw investment line
    ctx.strokeStyle = '#E83B3B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    investmentData.forEach((point, i) => {
      const { x, y } = toCanvasCoords(point);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw investment points
    ctx.fillStyle = '#E83B3B';
    investmentData.forEach(point => {
      const { x, y } = toCanvasCoords(point);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Draw returns line
    ctx.strokeStyle = '#0FB56D';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    returnsData.forEach((point, i) => {
      const { x, y } = toCanvasCoords(point);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw returns points
    ctx.fillStyle = '#0FB56D';
    returnsData.forEach(point => {
      const { x, y } = toCanvasCoords(point);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Draw break-even point if exists
    if (breakEvenPoint) {
      const { x, y } = toCanvasCoords(breakEvenPoint);
      
      // Draw marker
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = 'rgba(30, 30, 36, 1)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Draw label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Break-even', x, y - 10);
    }
    
    // Draw legend
    const legendY = height - 20;
    
    // Investment legend
    ctx.fillStyle = '#E83B3B';
    ctx.beginPath();
    ctx.arc(padding + 10, legendY, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#AAAAAA';
    ctx.textAlign = 'left';
    ctx.fillText('Investment', padding + 20, legendY + 4);
    
    // Returns legend
    ctx.fillStyle = '#0FB56D';
    ctx.beginPath();
    ctx.arc(padding + 100, legendY, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#AAAAAA';
    ctx.textAlign = 'left';
    ctx.fillText('Returns', padding + 110, legendY + 4);
    
  }, [investmentData, returnsData, breakEvenPoint]);
  
  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={300}
      className="w-full h-auto"
    />
  );
}

interface ROICalculatorProps {
  projectName?: string;
  projectType?: string;
}

export function ROICalculator({ projectName = "AI Implementation", projectType = "HR Automation" }: ROICalculatorProps) {
  // Input values
  const [initialInvestment, setInitialInvestment] = useState<number>(50000);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [monthlySavings, setMonthlySavings] = useState<number>(12000);
  const [productivityGain, setProductivityGain] = useState<number>(20);
  const [implementationTime, setImplementationTime] = useState<number>(3);
  
  // Calculated results
  const [oneYearROI, setOneYearROI] = useState<number>(0);
  const [breakEvenMonths, setBreakEvenMonths] = useState<number>(0);
  const [fiveYearROI, setFiveYearROI] = useState<number>(0);
  
  // Chart data
  const [investmentData, setInvestmentData] = useState<{ x: number; y: number }[]>([]);
  const [returnsData, setReturnsData] = useState<{ x: number; y: number }[]>([]);
  const [breakEvenPoint, setBreakEvenPoint] = useState<{ x: number; y: number } | null>(null);
  
  // Calculate ROI when inputs change
  useEffect(() => {
    calculateROI();
  }, [initialInvestment, monthlyInvestment, monthlySavings, productivityGain, implementationTime]);
  
  const calculateROI = () => {
    // Initialize data arrays
    const investmentPoints: { x: number; y: number }[] = [];
    const returnsPoints: { x: number; y: number }[] = [];
    
    // Calculate quarterly data for 18 months (6 quarters)
    const quarters = 6;
    let totalInvestment = initialInvestment;
    let totalReturns = 0;
    let breakEvenFound = false;
    let breakEvenQuarter = null;
    
    for (let i = 0; i <= quarters; i++) {
      const month = i * 3; // Quarter in months
      
      // Skip the first point (month 0) for returns as we start from 0
      if (i === 0) {
        investmentPoints.push({ x: i, y: initialInvestment / 1000 }); // Convert to thousands
        returnsPoints.push({ x: i, y: 0 });
        continue;
      }
      
      // For implementation period, add monthly investment
      if (month <= implementationTime) {
        totalInvestment += monthlyInvestment * 3; // 3 months per quarter
      } else {
        // Add smaller maintenance investment
        totalInvestment += (monthlyInvestment * 0.3) * 3; // 30% of original investment
      }
      
      // Calculate returns - start after implementation period
      if (month > implementationTime) {
        const monthsOfReturns = month - implementationTime;
        // Base monthly returns plus productivity gains that increase over time
        const quarterlyReturns = (monthlySavings * 3) * (1 + (productivityGain / 100) * (monthsOfReturns / 12));
        totalReturns += quarterlyReturns;
      }
      
      // Check for break-even point - only mark it once
      if (!breakEvenFound && totalReturns >= totalInvestment) {
        breakEvenFound = true;
        
        // Approximate the quarter when break-even occurs
        const prevInvestment = investmentPoints[i-1].y * 1000;
        const prevReturns = returnsPoints[i-1].y * 1000;
        
        const prevDiff = prevInvestment - prevReturns;
        const currDiff = totalInvestment - totalReturns;
        
        const prevQuarter = i - 1;
        const fractionToBreakEven = prevDiff / (prevDiff - currDiff);
        breakEvenQuarter = prevQuarter + fractionToBreakEven;
        
        // Calculate break-even in months
        setBreakEvenMonths(breakEvenQuarter * 3);
        
        // Set break-even point for chart
        setBreakEvenPoint({
          x: breakEvenQuarter,
          y: (totalInvestment / 1000) // Same Y value as investment at break-even
        });
      }
      
      investmentPoints.push({ x: i, y: totalInvestment / 1000 });
      returnsPoints.push({ x: i, y: totalReturns / 1000 });
    }
    
    // Calculate 1-year ROI
    const oneYearInvestment = initialInvestment + (monthlyInvestment * implementationTime) + 
                            (monthlyInvestment * 0.3 * (12 - implementationTime));
    const oneYearReturn = totalReturns * (12 / (quarters * 3)); // Scale to 12 months
    const roi = ((oneYearReturn - oneYearInvestment) / oneYearInvestment) * 100;
    setOneYearROI(roi);
    
    // Calculate 5-year ROI (simplified projection)
    const fiveYearInvestment = oneYearInvestment + (monthlyInvestment * 0.3 * 48); // 48 months of maintenance
    const fiveYearReturn = oneYearReturn * 5 * 1.2; // 5 years with 20% additional growth
    const fiveYearRoi = ((fiveYearReturn - fiveYearInvestment) / fiveYearInvestment) * 100;
    setFiveYearROI(fiveYearRoi);
    
    // Update chart data
    setInvestmentData(investmentPoints);
    setReturnsData(returnsPoints);
  };
  
  return (
    <div className="w-full space-y-8">
      <div className="text-center mb-8">
        <GradientHeading level={2} className="mb-2">
          Implementation ROI Calculator
        </GradientHeading>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Measure potential return on investment for your AI implementation project
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Info Card */}
        <Card className="bg-card/50 border-0 shadow-md col-span-1">
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-medium">{projectName}</h3>
                <p className="text-sm text-muted-foreground">{projectType}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="initial-investment">Initial Investment ($)</Label>
                <Input
                  id="initial-investment"
                  type="number"
                  min="0"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className="bg-background/50"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="monthly-investment">Monthly Costs During Implementation ($)</Label>
                <Input
                  id="monthly-investment"
                  type="number"
                  min="0"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="bg-background/50"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="implementation-time">Implementation Time (months)</Label>
                <Input
                  id="implementation-time"
                  type="number"
                  min="1"
                  max="36"
                  value={implementationTime}
                  onChange={(e) => setImplementationTime(Number(e.target.value))}
                  className="bg-background/50"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="monthly-savings">Expected Monthly Savings ($)</Label>
                <Input
                  id="monthly-savings"
                  type="number"
                  min="0"
                  value={monthlySavings}
                  onChange={(e) => setMonthlySavings(Number(e.target.value))}
                  className="bg-background/50"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="productivity-gain">Annual Productivity Gain (%)</Label>
                <Input
                  id="productivity-gain"
                  type="number"
                  min="0"
                  max="100"
                  value={productivityGain}
                  onChange={(e) => setProductivityGain(Number(e.target.value))}
                  className="bg-background/50"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button className="w-full bg-gradient-to-r from-primary to-primary-foreground">
                <TrendingUp className="h-4 w-4 mr-2" />
                Recalculate ROI
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* ROI Results Card */}
        <Card className="bg-card/50 border-0 shadow-md col-span-2">
          <CardHeader>
            <CardTitle>ROI Projection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <TextureCard className="bg-card/20 p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Break-even Point</h3>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-orange-400" />
                  <span className="text-xl font-bold">
                    {breakEvenMonths.toFixed(1)} months
                  </span>
                </div>
              </TextureCard>
              
              <TextureCard className="bg-card/20 p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">1-Year ROI</h3>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
                  <span className="text-xl font-bold">
                    {oneYearROI.toFixed(0)}%
                  </span>
                </div>
              </TextureCard>
              
              <TextureCard className="bg-card/20 p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">5-Year ROI</h3>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
                  <span className="text-xl font-bold">
                    {fiveYearROI.toFixed(0)}%
                  </span>
                </div>
              </TextureCard>
            </div>
            
            {/* ROI Chart */}
            <div className="bg-card/30 p-4 rounded-xl">
              <h3 className="text-lg font-medium mb-4">ROI Projection Over Time</h3>
              <ROIChart 
                investmentData={investmentData}
                returnsData={returnsData}
                breakEvenPoint={breakEvenPoint}
              />
            </div>
            
            {/* Project Insights */}
            <div className="bg-blue-900/10 border border-blue-900/20 p-4 rounded-xl">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-300 mb-1">Implementation Insights</h3>
                  <p className="text-sm text-blue-200/70">
                    Based on your inputs, this {projectType} project shows strong potential with a break-even point of {breakEvenMonths.toFixed(1)} months. 
                    The first-year ROI of {oneYearROI.toFixed(0)}% indicates a sound investment, while the five-year projection demonstrates significant long-term value.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                      Recommended
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                      High Potential
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 