import React, { useEffect, useCallback, useState, FC } from 'react';
import { message } from 'antd';
import { DraggerProps } from 'antd/es/upload';
import { UploadFile } from 'antd/es/upload/interface';
import { TInputNotRequired } from 'seasoning/es/types';
import { fileToBase64, base64ToFile } from 'seasoning/es/file-tool';
import { Upload, TUploadProps, UploadDragger as UploadDraggerSource } from 'common/antd';
import { combine } from 'stores';
import { uploadFile } from 'apis';

/**
 * 上传组件默认 Props 注入
 */
export const UploadProps = combine<{
  children: JSX.Element;
  type?: string; // 上传文件类型
}>(({ children, stores, type }) => {
  const { user, layout } = stores;
  const { Authorization } = user;
  const { preview } = layout;

  const onPreview = useCallback((file: UploadFile) => {
    if (file.originFileObj instanceof File) {
      preview(file.originFileObj, 'image', file.name);
    } else if (file.url) {
      preview(file.url, 'image');
    }
  }, []);

  return React.cloneElement(children, {
    action: uploadFile.getUploadUrl(type),
    headers: { Authorization },
    onPreview,
    transformFile:
      type !== 'image'
        ? undefined
        : async (file: File) => {
            const base64 = await fileToBase64(file, 1024);
            return base64ToFile(base64);
          },
  });
});

/**
 * 拖拽上传
 */
export const UploadDragger: FC<DraggerProps> = ({ onChange, ...props }) => {
  return (
    <UploadProps>
      <UploadDraggerSource
        onChange={(info) => {
          const { status, response } = info.file;
          status === 'error' && message.error(response.message);
          onChange?.(info);
        }}
        onRemove={async (file: UploadFile) => {
          const { code, data } = file.response || {};
          if (code === 201) {
            const res = await uploadFile.del([data.id]);
            return res.ok;
          }
        }}
        {...props}
      />
    </UploadProps>
  );
};

export type TUploadInputProps = Omit<TUploadProps, 'onChange'> & TInputNotRequired;

/**
 * 文件上传表单组件
 */
export const UploadInput: FC<TUploadInputProps> = ({ max = 1, value = [], onChange, ...props }) => {
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    const fileListUrl = getFileListUrl(fileList);
    let values = Array.isArray(value) ? value : value ? [value] : [];
    setFileList(
      values.map((url) => {
        const index = fileListUrl.indexOf(url);
        return fileList[index] || { uid: url, url, name: '图片', status: 'done' };
      })
    );
  }, [value && value.length]);

  return (
    <div style={{ minHeight: 118 }}>
      <UploadProps type="image">
        <Upload
          max={max}
          fileList={fileList}
          onChange={({ fileList }) => {
            // 全部上传完成
            if (fileList.every((i) => i.status === 'done')) {
              const newValue = getFileListUrl(fileList);
              onChange?.(max > 1 ? newValue : newValue[0]);
            }
            setFileList(fileList);
          }}
          onRemove={(file: UploadFile) => {
            let newValue;
            if (Array.isArray(value)) {
              const url = getUploadFileUrl(file);
              newValue = value.filter((i) => i !== url);
            }
            onChange?.(newValue);
          }}
          {...props}
        />
      </UploadProps>
    </div>
  );
};

/**
 * 获取上传对象地址列表
 */
export const getFileListUrl = (fileList: UploadFile[]) => {
  return fileList.map(getUploadFileUrl).filter(Boolean);
};

/**
 * 获取上传对象 URL
 */
export const getUploadFileUrl = (file: UploadFile) => {
  if (file.response) {
    const { code, data } = file.response;
    if (code === 201) return data.url;
  } else if (file.url) {
    return file.url;
  }
};
