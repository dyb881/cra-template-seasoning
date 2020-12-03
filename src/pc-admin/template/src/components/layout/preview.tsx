import React, { useEffect } from 'react';
import { Modal, Carousel } from 'antd';
import { VideoCameraOutlined, AudioOutlined, DownloadOutlined } from '@ant-design/icons';
import { useStates } from 'seasoning/es/hooks';
import { combine } from 'stores';
import { Img } from './common';
import style from './style.module.less';

/**
 * 图片预览
 */
export const Preview = combine(({ stores }) => {
  const { previewSrc, previewType, previewName, previewHide } = stores.layout;
  const { states, setStates } = useStates({ visible: false, src: '' });
  const { visible, src } = states;

  useEffect(() => {
    if (previewSrc) {
      setStates({ src: previewSrc, visible: true });
    } else {
      setStates({ visible: false });
    }
  }, [previewSrc]);

  return (
    <Modal
      visible={visible}
      onCancel={previewHide}
      title={previewName}
      footer={null}
      width={700}
      zIndex={1001}
      destroyOnClose
      className={style.preview}
    >
      {(() => {
        switch (previewType) {
          case 'image':
            return <Img src={src} style={{ width: '100%' }} />;
          case 'video':
            return <video src={src} style={{ width: '100%' }} autoPlay controls />;
          case 'audio':
            return <audio src={src} style={{ width: '100%' }} autoPlay controls />;
          case 'imageGroup':
            return (
              <Carousel dotPosition="top" autoplay>
                {[...src].map((i) => (
                  <Img key={i} style={{ width: '100%' }} src={i} />
                ))}
              </Carousel>
            );
        }
      })()}
    </Modal>
  );
});

export type TPreviewColumnProps = {
  src: string;
  type?: 'image' | 'video' | 'audio' | 'other' | 'imageGroup';
  name?: string;
};

/**
 * 预览列
 */
export const PreviewColumn: React.FC<TPreviewColumnProps> = combine(({ stores, src, type = 'image', name = '' }) => {
  if (!src || !src[0]) return null;
  const { preview } = stores.layout;
  const props = { className: `pointer ${style.previewColumn}`, onClick: () => preview(src, type, name) };
  if (type === 'image') return <Img src={src} mode="aspectFill" {...props} />;
  else if (type === 'video') return <VideoCameraOutlined {...props} />;
  else if (type === 'audio') return <AudioOutlined {...props} />;
  else if (type === 'imageGroup') return <Img src={src[0]} mode="aspectFill" {...props} />;

  return (
    <a href={src} download={name} target="_blank" rel="noopener noreferrer">
      <DownloadOutlined className={props.className} />
    </a>
  );
});
