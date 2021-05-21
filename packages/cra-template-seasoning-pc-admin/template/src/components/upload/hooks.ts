import { useState } from 'react';
import { message } from 'antd';
import { getFiles } from 'seasoning/es/file-tool';
import { files } from 'apis';
import OSS from 'ali-oss';

let oss: any;
let stsTime: number;

/**
 * 上传文件到OSS
 */
export const uploadOSS = async (file: File, type?: string) => {
  // 14 分钟内刷新一次授权
  if (!oss || +new Date() - stsTime > 1000 * 60 * 14) {
    const res = await files.upload.sts();
    if (!res.ok) return;
    oss = new OSS(res.data);
    stsTime = +new Date();
  }

  if (file instanceof Blob) file = new File([file], file.name);
  const { name, size } = file;

  // 获取上传路径
  const pathRes = await files.upload.path({ name, size, type });
  if (!pathRes.ok) return;
  const { path, url } = pathRes.data;

  // 执行上传
  const ossRes = await oss.put(path, file);
  if (ossRes.res.status !== 200) return;

  return url as string;
};

/**
 * 上传文件到服务器
 */
export const uploadServer = async (file: File, type?: string) => {
  if (file instanceof Blob) file = new File([file], file.name);
  const res = await files.upload.server({ file, type });
  if (res.ok) return res.data;
};

export type useUploadPictureOptions = {
  multiple?: boolean;
  maxSize?: number;
  onUpload: (url: string) => void;
};

/**
 * 上传图片 Hooks
 */
export const useUploadPicture = ({ multiple, onUpload, maxSize = 1024 }: useUploadPictureOptions) => {
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (loading) return;
    try {
      const files = await getFiles({
        multiple,
        maxSize,
        extnames: ['jpg', 'png', 'jpeg'],
        onFile: () => setLoading(true),
      });
      for await (let file of files) {
        const url = await uploadOSS(file);
        url && onUpload(url);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      message.error('仅支持上传后缀名为：jpg、png、jpeg的文件');
    }
  };

  return { loading, upload };
};
