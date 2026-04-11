"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_GATEWAY_API_URL || "http://localhost:3002";

interface FileInfo {
  id: string;
  filename: string;
  size: number;
  content_type: string;
}

interface TokenData {
  tierName: string;
  files: FileInfo[];
  expiresAt: string;
  downloadsUsed: number;
  maxDownloads: number;
  downloadsRemaining: number;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(contentType: string): string {
  if (contentType.startsWith("audio/")) return "🎵";
  if (contentType.startsWith("image/")) return "🖼️";
  if (contentType.startsWith("video/")) return "🎬";
  if (contentType === "application/pdf") return "📕";
  return "📄";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function DownloadClient({
  token,
  initialData,
  initialError,
}: {
  token: string;
  initialData?: TokenData;
  initialError?: string;
}) {
  const [data, setData] = useState(initialData);
  const [downloading, setDownloading] = useState<string | null>(null);

  async function handleDownload(file: FileInfo) {
    setDownloading(file.id);
    try {
      const res = await fetch(`${API_URL}/download-tokens/${token}/files/${file.id}`);
      const json = await res.json();
      if (!json.success) {
        alert(json.error || "Download failed");
        return;
      }
      window.open(json.data.url, "_blank");

      // Update remaining count
      if (data) {
        setData({
          ...data,
          downloadsUsed: data.downloadsUsed + 1,
          downloadsRemaining: data.downloadsRemaining - 1,
        });
      }
    } catch {
      alert("Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  }

  // Error states
  if (initialError) {
    const isExpired = initialError.includes("expired");
    const isRevoked = initialError.includes("revoked");
    const isMaxDownloads = initialError.includes("limit");

    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-5xl">
            {isExpired ? "⏰" : isRevoked ? "🚫" : isMaxDownloads ? "📊" : "❌"}
          </div>
          <h1 className="text-xl font-bold text-white">
            {isExpired
              ? "ลิงก์หมดอายุแล้ว"
              : isRevoked
                ? "ลิงก์ถูกยกเลิก"
                : isMaxDownloads
                  ? "ครบจำนวนดาวน์โหลดแล้ว"
                  : "ลิงก์ไม่ถูกต้อง"}
          </h1>
          <p className="text-gray-400">
            {isExpired
              ? "ลิงก์ดาวน์โหลดของคุณหมดอายุแล้ว (ลิงก์ใช้ได้ 7 วันนับจากวันที่ซื้อ)"
              : isRevoked
                ? "ลิงก์นี้ถูกยกเลิกการเข้าถึงแล้ว"
                : isMaxDownloads
                  ? "คุณดาวน์โหลดครบ 5 ครั้งที่กำหนดแล้ว"
                  : "ลิงก์ดาวน์โหลดไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง"}
          </p>
          {(isExpired || isRevoked || isMaxDownloads) && (
            <p className="text-gray-500 text-sm">
              หากต้องการลิงก์ดาวน์โหลดใหม่ กรุณาแจ้งอีเมลที่ใช้ซื้อมาที่
            </p>
          )}
          <a
            href="mailto:contact@likqmusic.com?subject=ขอลิงก์ดาวน์โหลดใหม่"
            className="inline-block mt-4 px-6 py-2 bg-[#153051] text-white rounded-lg hover:bg-[#1d4272] transition-colors"
          >
            ขอลิงก์ดาวน์โหลดใหม่
          </a>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-sm font-medium text-[#BEADC4] tracking-widest uppercase mb-2">
            LIKQ Music
          </h2>
          <h1 className="text-2xl font-bold text-white">{data.tierName}</h1>
        </div>

        {/* Info Card */}
        <div className="bg-[#111d33] border border-[#1e3050] rounded-xl p-4 mb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">หมดอายุ</span>
            <span className="text-white font-medium">{formatDate(data.expiresAt)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">จำนวนดาวน์โหลด</span>
            <span className="text-white font-medium">
              ใช้ไป {data.downloadsUsed} / {data.maxDownloads} ครั้ง
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#1e3050] rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                data.downloadsRemaining <= 1 ? "bg-amber-500" : "bg-[#BEADC4]"
              }`}
              style={{ width: `${(data.downloadsUsed / data.maxDownloads) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            ลิงก์นี้ใช้ได้ 7 วันนับจากวันที่ซื้อ และดาวน์โหลดได้สูงสุด {data.maxDownloads} ครั้ง
            {" "}หากลิงก์หมดอายุหรือต้องการดาวน์โหลดเพิ่ม กรุณาติดต่อ{" "}
            <a href="mailto:contact@likqmusic.com" className="text-[#BEADC4] hover:underline">
              contact@likqmusic.com
            </a>{" "}
            เพื่อขอลิงก์ใหม่
          </p>
        </div>

        {/* File List */}
        <div className="space-y-3">
          {data.files.map((file) => (
            <div
              key={file.id}
              className="bg-[#111d33] border border-[#1e3050] rounded-xl p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl flex-shrink-0">
                  {getFileIcon(file.content_type)}
                </span>
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{file.filename}</p>
                  <p className="text-gray-500 text-sm">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => handleDownload(file)}
                disabled={downloading === file.id || data.downloadsRemaining <= 0}
                className="flex-shrink-0 px-4 py-2 bg-[#153051] text-white text-sm font-medium rounded-lg hover:bg-[#1d4272] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {downloading === file.id ? "กำลังโหลด..." : "ดาวน์โหลด"}
              </button>
            </div>
          ))}
        </div>

        {data.files.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            ยังไม่มีไฟล์สำหรับดาวน์โหลด
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-8">
          หากมีปัญหา กรุณาติดต่อ{" "}
          <a href="mailto:contact@likqmusic.com" className="text-[#BEADC4] hover:underline">
            contact@likqmusic.com
          </a>
        </p>
      </div>
    </div>
  );
}
