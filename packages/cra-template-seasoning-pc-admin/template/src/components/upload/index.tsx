import { FC } from 'react';
import { Image } from 'antd';
import { UploadOutlined, LoadingOutlined, CloseCircleFilled } from '@ant-design/icons';
import { TInputNotRequired } from 'seasoning/es/types';
import { useUploadPicture } from './hooks';
import style from './style.module.less';

type TUploadButtonProps = { multiple?: boolean; onUpload: (url?: string) => void };

/**
 * 上传按钮
 */
export const UploadButton: FC<TUploadButtonProps> = ({ multiple, onUpload }) => {
  const { loading, upload } = useUploadPicture(multiple);

  const onClick = async () => {
    const url = await upload();
    url && onUpload(url);
  };

  return loading ? (
    <div className={`column-center ${style.uploadButton}`}>
      <LoadingOutlined className={style.icon} />
      正在上传
    </div>
  ) : (
    <div className={`pointer column-center ${style.uploadButton}`} onClick={onClick}>
      <UploadOutlined className={style.icon} />
      上传文件
    </div>
  );
};

type TUploadPreviewProps = { src?: string; onDel?: () => void };

/**
 * 上传预览
 */
export const UploadPreview: FC<TUploadPreviewProps> = ({ src, onDel }) => {
  return (
    <div className={style.uploadPreview}>
      <Image src={src} className={style.image} alt="地址失效" />
      <CloseCircleFilled
        className={`delete transition ${style.del}`}
        onClick={(e) => {
          e.stopPropagation();
          onDel?.();
        }}
      />
    </div>
  );
};

/**
 * 上传图片
 */
export const UploadPicture: FC<TInputNotRequired<string>> = ({ value, onChange }) => {
  return value ? (
    <UploadPreview src={value} onDel={() => onChange?.('')} />
  ) : (
    <UploadButton onUpload={(url) => url && onChange?.(url)} />
  );
};

/**
 * 上传图组
 */
export const UploadPictureGroup: FC<TInputNotRequired<string[]>> = ({ value = [], onChange }) => {
  const v = value || [];

  return (
    <div className={style.pictureGroup}>
      <Image.PreviewGroup>
        {v.map((i, k) => {
          return (
            <UploadPreview
              key={i}
              src={i}
              onDel={() => {
                const val = [...v];
                val.splice(k, 1);
                onChange?.(val);
              }}
            />
          );
        })}
      </Image.PreviewGroup>
      <UploadButton
        multiple
        onUpload={(url) => {
          url && onChange?.([...v, url]);
        }}
      />
    </div>
  );
};
