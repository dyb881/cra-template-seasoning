import React, { useState } from 'react';
import { Upload as UploadSource } from 'antd';
import { UploadProps, DraggerProps } from 'antd/es/upload';
import { PlusOutlined, LoadingOutlined, InboxOutlined } from '@ant-design/icons';

export type TUploadProps = UploadProps & {
  max?: number; // 图片上限，默认为 1，也就是单图片上传
};

/**
 * 文件上传
 */
export const Upload: React.FC<TUploadProps> = ({ max = 1, onChange, fileList = [], ...props }) => {
  const [loading, setLoading] = useState(false);

  return (
    <UploadSource
      listType="picture-card"
      multiple={max > 1}
      onChange={info => {
        setLoading(info.file.status === 'uploading');
        onChange?.(info);
      }}
      fileList={fileList}
      {...props}
    >
      {fileList.length < max && (
        <>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div className="ant-upload-text">上传图片</div>
        </>
      )}
    </UploadSource>
  );
};

/**
 * 拖拽上传
 */
export const UploadDragger: React.FC<DraggerProps> = ({ onChange, ...props }) => {
  return (
    <UploadSource.Dragger multiple height={160} listType="picture" {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖文件到这个区域上传</p>
      <p className="ant-upload-hint">支持多个文件或文件夹上传。</p>
    </UploadSource.Dragger>
  );
};
