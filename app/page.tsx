'use client';

import Image from "next/image";
import { useState } from "react";
import { PDFDocument } from 'pdf-lib';
import { useMerge } from '@/context/MergeContext';
import { useAuth } from '@clerk/nextjs';

interface FileItem {
  name: string;
  size: number;
  file: File;
}

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const { recordMerge } = useMerge();
  
  const { isSignedIn } = useAuth();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) {
      setError('Please sign in to upload PDF files.');
      return;
    }

    const fileList = event.target.files;
    if (fileList) {
      const newFiles = Array.from(fileList)
        .filter(file => file.type === 'application/pdf')
        .map(file => ({
          name: file.name,
          size: file.size,
          file: file
        }));
      setFiles([...files, ...newFiles]);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    
    if (!isSignedIn) {
      setError('Please sign in to upload PDF files.');
      return;
    }

    const fileList = event.dataTransfer.files;
    const newFiles = Array.from(fileList)
      .filter(file => file.type === 'application/pdf')
      .map(file => ({
        name: file.name,
        size: file.size,
        file: file
      }));
    setFiles([...files, ...newFiles]);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const clearFiles = () => {
    setFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleMerge = async () => {
    if (!isSignedIn) {
      setError('Please sign in to merge PDF files.');
      return;
    }

    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();

      // Load and merge each PDF file
      for (const file of files) {
        const pdfBytes = await file.file.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      // Save the merged PDF
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Record the merge
      await recordMerge(files.length);

      // Clear the file list after successful merge
      clearFiles();
      setError(null);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      setError('An error occurred while merging the PDFs. Please make sure all files are valid PDFs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Merge PDF Files</h2>
            <p className="text-xl text-gray-600">Combine multiple PDF files into one document</p>
            

          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          {/* Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-blue-400 transition-all cursor-pointer mb-8 hover:bg-blue-50/50"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <Image src="/file.svg" alt="Upload icon" width={48} height={48} className="text-gray-400" />
              </div>
              <div className="text-lg text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1 inline">or drag and drop</p>
              </div>
              <p className="text-sm text-gray-500">PDF files only (up to 10MB each)</p>
            </div>
          </div>

          {/* File List */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Files</h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Image src="/file.svg" alt="PDF file" width={24} height={24} />
                    <span className="text-base text-gray-900 truncate max-w-[400px]">{file.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{formatFileSize(file.size)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            {files.length > 0 && (
              <button
                onClick={clearFiles}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear All
              </button>
            )}
            <button
              onClick={handleMerge}
              disabled={files.length < 2 || isLoading}
              className={`px-6 py-2.5 text-sm font-medium text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${files.length < 2 || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:from-blue-700 hover:to-purple-700'}`}
            >
              {isLoading ? 'Merging...' : 'Merge PDFs'}
            </button>
          </div>
        </div>
      </main>
      

    </div>
  );
}
