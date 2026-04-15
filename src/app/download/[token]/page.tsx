import { Metadata } from "next";
import { DownloadClient } from "./DownloadClient";

const API_URL = process.env.NEXT_PUBLIC_GATEWAY_API_URL || "http://localhost:3002";

interface TokenData {
  tierName: string;
  files: { id: string; filename: string; size: number; content_type: string }[];
  expiresAt: string;
  downloadsUsed: number;
  maxDownloads: number;
  downloadsRemaining: number;
}

async function getTokenData(token: string): Promise<{ data?: TokenData; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/download-tokens/${token}`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (!json.success) {
      return { error: json.error };
    }
    return { data: json.data };
  } catch {
    return { error: "Failed to connect to server" };
  }
}

export const metadata: Metadata = {
  title: "Download Files - LIKQ Music",
  robots: { index: false, follow: false },
};

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const { data, error } = await getTokenData(token);

  return <DownloadClient token={token} initialData={data} initialError={error} />;
}
