import { FC, useState, useEffect } from 'react';
import { Image } from 'antd';
import { UploadOutlined, LoadingOutlined, CloseCircleFilled, FileImageOutlined } from '@ant-design/icons';
import { TInputNotRequired } from 'seasoning/es/types';
import { useUploadPicture, useUploadPictureOptions } from './hooks';
import { PreviewColumn } from '../layout';
import style from './style.module.less';

type TUploadButtonProps = React.HTMLProps<HTMLDivElement> & { loading?: boolean; id?: string };

/**
 * 上传按钮
 */
export const UploadButton: FC<TUploadButtonProps> = ({ loading, onClick, id, ...props }) => {
  return loading ? (
    <div className={`column-center ${style.uploadButton}`} {...props}>
      <LoadingOutlined className={style.icon} />
      正在上传
    </div>
  ) : (
    <div className={`pointer column-center ${style.uploadButton}`} onClick={onClick} id={id} {...props}>
      <UploadOutlined className={style.icon} />
      上传文件
    </div>
  );
};

type TUploadPreviewProps = { src?: string; onDel?: () => void; errorIcon?: React.ReactNode };

/**
 * 上传预览
 */
export const UploadPreview: FC<TUploadPreviewProps> = ({ src, onDel, errorIcon }) => {
  const [error, setError] = useState<any>();

  let type: 'video' | '' = '';
  if (src && /mp4$/.test(src)) type = 'video';

  return (
    <div className={style.uploadPreview}>
      {src && type ? (
        <PreviewColumn src={src} type={type} />
      ) : (
        error || (
          <Image
            src={src}
            className={style.image}
            alt="地址失效"
            onError={() => {
              setError(
                <div className={`center ${style.image} ${style.error}`}>{errorIcon || <FileImageOutlined />}</div>
              );
            }}
          />
        )
      )}
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

type TUploadPictureProps = TInputNotRequired<string> &
  Partial<useUploadPictureOptions> & {
    errorIcon?: React.ReactNode;
    id?: string;
  };

/**
 * 上传图片
 */
export const UploadPicture: FC<TUploadPictureProps> = ({ value, onChange, errorIcon, id, ...options }) => {
  const { loading, upload } = useUploadPicture({ ...options, onUpload: (url) => url && onChange?.(url) });
  return value ? (
    <UploadPreview src={value} onDel={() => onChange?.('')} errorIcon={errorIcon} />
  ) : (
    <UploadButton loading={loading} onClick={upload} id={id} />
  );
};

/**
 * 上传图组
 */
export const UploadPictureGroup: FC<TInputNotRequired<string[]> & { max?: number; id?: string }> = ({
  value,
  onChange,
  max,
  id,
}) => {
  const [urls, setUrls] = useState(value || []);
  const { loading, upload } = useUploadPicture({
    onUpload: (url) => {
      setUrls((urls) => [...urls, url]);
    },
  });

  useEffect(() => {
    if (urls.length !== (value || []).length) {
      onChange?.(urls);
    }
  }, [urls.length]);

  return (
    <div className={style.pictureGroup} id={id}>
      <Image.PreviewGroup>
        {urls.map((i, k) => (
          <UploadPreview
            key={k}
            src={i}
            onDel={() => {
              setUrls(([...urls]) => {
                urls.splice(k, 1);
                return urls;
              });
            }}
          />
        ))}
      </Image.PreviewGroup>
      {(!max || urls.length < max) && <UploadButton loading={loading} onClick={upload} />}
    </div>
  );
};
