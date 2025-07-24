import { apiRequest } from "./useApi";

 type PresignedResponse = {
      urls: Array<{
        filename: string;
        key: string;
        url: string;
      }>;
  };

export const uploadImages = async (files: File[]) => {
  if (!files.length) return [];

  const filesMeta = files.map((file) => ({
    filename: file.name,
    contentType: file.type,
  }));

  const res = await apiRequest<{ success: boolean; data: PresignedResponse }>("api/web/get-presigned-urls", {
    method: "POST",
    body: JSON.stringify({ files: filesMeta }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.success) throw new Error("Failed to get pre-signed URLs");

  for (let i = 0; i < files.length; i++) {
    const uploadUrl = res.data.urls[i].url;
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      body: files[i],
      headers: {
        "Content-Type": files[i].type,
        "x-amz-acl": "public-read",
      },
    });

    if (!uploadRes.ok) throw new Error(`Upload failed for ${files[i].name}`);
  }

  return res.data.urls.map((entry) => entry.key);
};
