import { useState } from 'react';
import { message } from 'antd';
import { getFiles } from 'seasoning/es/file-tool';
import { oss as ossApi, upload } from 'apis';
import OSS from 'ali-oss';

let oss: OSS;
let stsTime: number;

/**
 * 上传文件到OSS
 */
export const uploadOSS = async (file: File) => {
  // 14 分钟内刷新一次授权
  if (!oss || +new Date() - stsTime > 1000 * 60 * 14) {
    const res = await ossApi.sts();
    if (!res.ok) return;
    oss = new OSS(res.data);
    stsTime = +new Date();
  }

  if (file instanceof Blob) file = new File([file], file.name);
  const { name, size } = file;

  // 获取上传路径
  const pathRes = await ossApi.getPutObject({ name, size });
  if (!pathRes.ok) return;

  // 执行上传
  const ossRes = await oss.put(pathRes.data.name, file);
  if (ossRes.res.status !== 200) return;

  return pathRes.data.url as string;
};

/**
 * 上传文件到服务器
 */
export const uploadServer = async (file: File) => {
  if (file instanceof Blob) file = new File([file], file.name);
  const res = await upload({ file });
  if (res.ok) return res.data.url;
};

export type useUploadPictureOptions = {
  multiple?: boolean;
  maxSize?: number;
  extnames?: string[];
  onUpload: (url: string) => void;
};

/**
 * 上传图片 Hooks
 */
export const useUploadPicture = ({
  multiple,
  onUpload,
  maxSize = 1024,
  extnames = ['jpg', 'png', 'jpeg'],
}: useUploadPictureOptions) => {
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (loading) return;
    try {
      const files = await getFiles({
        multiple,
        maxSize,
        extnames,
        onFile: () => setLoading(true),
      });
      for await (let file of files) {
        const url = await uploadServer(file);
        url && onUpload(url);
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
      message.error('仅支持上传后缀名为：jpg、png、jpeg的文件');
    }
  };

  return { loading, upload };
};
