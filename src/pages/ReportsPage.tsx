import React, { useState } from 'react';
import { Clock, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import FunnelChart from '../components/Charts/FunnelChart';
import { DashboardMetrics, VulnerabilityScore } from '../types/dashboard';

interface ReportsPageProps {
  metrics: DashboardMetrics;
  vulnerabilityData: VulnerabilityScore[];
  loading: boolean;
}

const ReportsPage: React.FC<ReportsPageProps> = ({
  metrics,
  vulnerabilityData,
  loading,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf');
  const [generating, setGenerating] = useState(false);

  const funnelData = [
    { stage: 'Eligible Population', value: 950000000, percentage: 100 },
    { stage: 'Registered', value: 850000000, percentage: 89.5 },
    { stage: 'First Dose', value: 780000000, percentage: 82.1 },
    { stage: 'Second Dose', value: 680000000, percentage: 71.6 },
    { stage: 'Booster', value: 350000000, percentage: 36.8 },
  ];

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const dateStr = new Date().toISOString().split('T')[0];

    if (selectedFormat === 'pdf') {
      generatePDF(dateStr);
    } else if (selectedFormat === 'excel') {
      generateExcel(dateStr);
    } else {
      generateCSV(dateStr);
    }

    setGenerating(false);
  };

  const generatePDF = (dateStr: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Title
    doc.setFontSize(22);
    doc.setTextColor(31, 41, 55);
    doc.text('Health Dashboard - Complete Report', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Key Metrics Section
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.text('Key Metrics Summary', 14, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.setTextColor(55, 65, 81);
    doc.text(`Total Vaccinations: ${metrics.totalVaccinations?.toLocaleString() || 'N/A'}`, 14, yPos);
    yPos += 7;
    doc.text(`Average AQI: ${metrics.averageAqi?.toFixed(1) || 'N/A'}`, 14, yPos);
    yPos += 7;
    doc.text(`Regions Covered: ${metrics.regionsCovered || 'N/A'}`, 14, yPos);
    yPos += 7;
    doc.text(`High Risk Areas: ${metrics.highRiskAreas || 'N/A'}`, 14, yPos);
    yPos += 15;

    // Vaccination Funnel Section
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.text('Vaccination Funnel', 14, yPos);
    yPos += 5;

    autoTable(doc, {
      startY: yPos,
      head: [['Stage', 'Population', 'Percentage']],
      body: funnelData.map((f) => [f.stage, f.value.toLocaleString(), `${f.percentage}%`]),
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129], textColor: 255 },
      styles: { fontSize: 10 },
    });

    yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;

    // Vulnerability Data Table
    if (vulnerabilityData.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text('Vulnerability Assessment Data', 14, yPos);
      yPos += 5;

      autoTable(doc, {
        startY: yPos,
        head: [['Location', 'Vaccination Rate', 'AQI Level', 'Vulnerability Index', 'Risk Category']],
        body: vulnerabilityData.map((v) => [
          v.location,
          `${v.vaccinationRate.toFixed(1)}%`,
          v.aqiLevel.toFixed(0),
          v.vulnerabilityIndex.toString(),
          v.riskCategory,
        ]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246], textColor: 255 },
        styles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });

      yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
    }

    // Risk Summary
    const riskCounts = vulnerabilityData.reduce((acc, v) => {
      acc[v.riskCategory] = (acc[v.riskCategory] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if (Object.keys(riskCounts).length > 0) {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text('Risk Category Summary', 14, yPos);
      yPos += 5;

      autoTable(doc, {
        startY: yPos,
        head: [['Risk Category', 'Number of Regions']],
        body: Object.entries(riskCounts).map(([category, count]) => [category, count.toString()]),
        theme: 'striped',
        headStyles: { fillColor: [239, 68, 68], textColor: 255 },
        styles: { fontSize: 10 },
      });
    }

    doc.save(`health-dashboard-complete-report-${dateStr}.pdf`);
  };

  const generateExcel = (dateStr: string) => {
    const workbook = XLSX.utils.book_new();

    // Key Metrics Sheet
    const metricsData = [
      ['Health Dashboard - Complete Report'],
      [`Generated: ${new Date().toLocaleDateString()}`],
      [''],
      ['Key Metrics'],
      ['Metric', 'Value'],
      ['Total Vaccinations', metrics.totalVaccinations?.toLocaleString() || 'N/A'],
      ['Average AQI', metrics.averageAqi?.toFixed(1) || 'N/A'],
      ['Regions Covered', metrics.regionsCovered?.toString() || 'N/A'],
      ['High Risk Areas', metrics.highRiskAreas?.toString() || 'N/A'],
    ];
    const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData);
    XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Key Metrics');

    // Vaccination Funnel Sheet
    const funnelHeaders = ['Stage', 'Population', 'Percentage'];
    const funnelSheetData = funnelData.map((f) => [f.stage, f.value, `${f.percentage}%`]);
    const funnelSheet = XLSX.utils.aoa_to_sheet([funnelHeaders, ...funnelSheetData]);
    XLSX.utils.book_append_sheet(workbook, funnelSheet, 'Vaccination Funnel');

    // Vulnerability Data Sheet
    if (vulnerabilityData.length > 0) {
      const vulnHeaders = ['Location', 'Vaccination Rate (%)', 'AQI Level', 'Vulnerability Index', 'Risk Category'];
      const vulnData = vulnerabilityData.map((v) => [
        v.location,
        v.vaccinationRate,
        v.aqiLevel,
        v.vulnerabilityIndex,
        v.riskCategory,
      ]);
      const vulnSheet = XLSX.utils.aoa_to_sheet([vulnHeaders, ...vulnData]);
      XLSX.utils.book_append_sheet(workbook, vulnSheet, 'Vulnerability Data');
    }

    // Risk Summary Sheet
    const riskCounts = vulnerabilityData.reduce((acc, v) => {
      acc[v.riskCategory] = (acc[v.riskCategory] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const riskHeaders = ['Risk Category', 'Number of Regions'];
    const riskData = Object.entries(riskCounts).map(([category, count]) => [category, count]);
    const riskSheet = XLSX.utils.aoa_to_sheet([riskHeaders, ...riskData]);
    XLSX.utils.book_append_sheet(workbook, riskSheet, 'Risk Summary');

    XLSX.writeFile(workbook, `health-dashboard-complete-report-${dateStr}.xlsx`);
  };

  const generateCSV = (dateStr: string) => {
    const lines: string[] = [];

    // Key Metrics
    lines.push('Health Dashboard - Complete Report');
    lines.push(`Generated: ${new Date().toLocaleDateString()}`);
    lines.push('');
    lines.push('KEY METRICS');
    lines.push(`Total Vaccinations,${metrics.totalVaccinations?.toLocaleString() || 'N/A'}`);
    lines.push(`Average AQI,${metrics.averageAqi?.toFixed(1) || 'N/A'}`);
    lines.push(`Regions Covered,${metrics.regionsCovered || 'N/A'}`);
    lines.push(`High Risk Areas,${metrics.highRiskAreas || 'N/A'}`);
    lines.push('');

    // Vaccination Funnel
    lines.push('VACCINATION FUNNEL');
    lines.push('Stage,Population,Percentage');
    funnelData.forEach((f) => {
      lines.push(`${f.stage},${f.value},${f.percentage}%`);
    });
    lines.push('');

    // Vulnerability Data
    lines.push('VULNERABILITY ASSESSMENT DATA');
    lines.push('Location,Vaccination Rate,AQI Level,Vulnerability Index,Risk Category');
    vulnerabilityData.forEach((v) => {
      lines.push(`${v.location},${v.vaccinationRate.toFixed(1)}%,${v.aqiLevel.toFixed(0)},${v.vulnerabilityIndex},${v.riskCategory}`);
    });
    lines.push('');

    // Risk Summary
    const riskCounts = vulnerabilityData.reduce((acc, v) => {
      acc[v.riskCategory] = (acc[v.riskCategory] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    lines.push('RISK CATEGORY SUMMARY');
    lines.push('Risk Category,Number of Regions');
    Object.entries(riskCounts).forEach(([category, count]) => {
      lines.push(`${category},${count}`);
    });

    const csvContent = lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-dashboard-complete-report-${dateStr}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Downloads</h2>
        <p className="text-gray-600">
          Generate and download comprehensive reports in multiple formats
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Builder */}
        <div className="chart-container p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Complete Report</h3>
          <p className="text-sm text-gray-500 mb-6">
            Download all dashboard data including key metrics, vaccination funnel, vulnerability assessment, and risk summary in your preferred format.
          </p>

          {/* Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Format</label>
            <div className="flex space-x-4">
              {(['pdf', 'csv', 'excel'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={`px-6 py-3 rounded-lg border transition-colors uppercase text-sm font-medium flex-1 ${
                    selectedFormat === format
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          {/* Format Description */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              {selectedFormat === 'pdf' && '📄 PDF format includes formatted tables and sections, ideal for sharing and printing.'}
              {selectedFormat === 'csv' && '📊 CSV format is a simple text file that can be opened in Excel, Google Sheets, or any spreadsheet application.'}
              {selectedFormat === 'excel' && '📗 Excel format includes multiple sheets with organized data, formulas-ready for further analysis.'}
            </p>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
          >
            {generating ? (
              <>
                <Clock className="h-5 w-5 animate-spin" />
                <span>Generating Report...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Download {selectedFormat.toUpperCase()} Report</span>
              </>
            )}
          </button>

          {/* Data Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Report Contents:</h4>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>✓ Key Metrics Summary</li>
              <li>✓ Vaccination Funnel Data ({funnelData.length} stages)</li>
              <li>✓ Vulnerability Assessment ({vulnerabilityData.length} locations)</li>
              <li>✓ Risk Category Summary</li>
            </ul>
          </div>
        </div>

        {/* Funnel Chart */}
        <FunnelChart data={funnelData} loading={loading} />
      </div>
    </div>
  );
};

export default ReportsPage;
