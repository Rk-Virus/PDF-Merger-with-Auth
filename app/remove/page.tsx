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

export default function RemovePages() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const [pageCount, setPageCount] = useState<number>(0);
    const [removedPages, setRemovedPages] = useState<Set<number>>(new Set());

    const { isSignedIn } = useAuth();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isSignedIn) {
            setError('Please sign in to upload PDF files.');
            return;
        }

        const file = event.target.files?.[0];
        if (file) {
            const fileItem = {
                name: file.name,
                size: file.size,
                file: file
            }
            setFiles([fileItem])
            await loadPdfMetadata(fileItem);
        }
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();

        if (!isSignedIn) {
            setError('Please sign in to upload PDF files.');
            return;
        }

        const file = event.dataTransfer.files?.[0];
        if (file) {
            const fileItem = {
                name: file.name,
                size: file.size,
                file: file
            };
            setFiles([fileItem])
            loadPdfMetadata(fileItem)
        }
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

    // pdf remove pages related functions
    const loadPdfMetadata = async (fileItem: FileItem) => {
        const pdfBytes = await fileItem.file.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        setSelectedFile(fileItem);
        setPageCount(pdf.getPageCount());
        setRemovedPages(new Set());
    };

    const togglePageSelection = (pageNumber: number) => {
        setRemovedPages(prev => {
            const next = new Set(prev);
            if (next.has(pageNumber)) next.delete(pageNumber);
            else next.add(pageNumber);
            return next;
        });
    };

    const handleRemovePages = async () => {
        if (!isSignedIn) {
            setError('Please sign in to remove pages.');
            return;
        }
        if (!selectedFile) {
            setError('Please upload a PDF first.');
            return;
        }
        if (removedPages.size === 0) {
            setError('Select at least one page to remove.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const pdfBytes = await selectedFile.file.arrayBuffer();
            const pdf = await PDFDocument.load(pdfBytes);
            const totalPages = pdf.getPageCount();

            const keepIndices = Array.from({ length: totalPages }, (_, index) => index)
                .filter(index => !removedPages.has(index + 1));

            if (keepIndices.length === 0) {
                setError('You cannot remove all pages.');
                return;
            }

            const newPdf = await PDFDocument.create();
            const copiedPages = await newPdf.copyPages(pdf, keepIndices);
            copiedPages.forEach(page => newPdf.addPage(page));

            const outputBytes = await newPdf.save();
            const blob = new Blob([new Uint8Array(outputBytes)], { type: 'application/pdf' });

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = selectedFile.name.replace(/\.pdf$/i, '') + '-trimmed.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setSelectedFile(null);
            setFiles([]);
            setPageCount(0);
            setRemovedPages(new Set());
        } catch (err) {
            console.error('Error removing pages:', err);
            setError('An error occurred while removing pages. Make sure the file is a valid PDF.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-purple-600">Remove Pages</h2>
                        <p className="text-xl text-gray-600">Remove unwanted pages from pdf files</p>


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

                    {selectedFile && pageCount > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Choose pages to remove</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {Array.from({ length: pageCount }, (_, index) => {
                                    const pageNumber = index + 1;
                                    return (
                                        <label key={pageNumber} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                                            <input
                                                type="checkbox"
                                                checked={removedPages.has(pageNumber)}
                                                onChange={() => togglePageSelection(pageNumber)}
                                            />
                                            <span className="text-gray-600">Page {pageNumber}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    )}

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
                            onClick={handleRemovePages}
                            disabled={!selectedFile || removedPages.size === 0 || isLoading}
                            className={`px-6 py-2.5 text-sm font-medium text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${!selectedFile || removedPages.size === 0 || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-pink-600 hover:shadow-lg'}`}
                        >
                            {isLoading ? 'Processing...' : 'Remove Pages'}
                        </button>
                    </div>
                </div>
            </main>


        </div>
    );
}
