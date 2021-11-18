import { useState, useRef, useEffect, useMemo } from 'react';
import { Table } from 'antd';
import { TableProps } from 'antd/es/table';
import { VariableSizeGrid } from 'react-window';
import { combine } from 'stores';
import styles from './style.module.less';

export type TVirtualTableProps = TableProps<any> & {
  tableWidth?: number;
  minColumnWidth?: number; // 最小列宽，当 width 未指定时选择
};

/**
 * 虚拟滚动表格
 */
export const VirtualTable = combine<TVirtualTableProps>(
  ({ stores, tableWidth = 0, minColumnWidth = 100, columns = [], ...props }) => {
    const { componentSize = 'large' } = stores.layout.setting;
    const gridRef = useRef<VariableSizeGrid>(null);
    const { x = 0, y = 0 } = props.scroll || {};

    useEffect(() => {
      gridRef.current?.resetAfterIndices({
        rowIndex: 0,
        columnIndex: 0,
        shouldForceUpdate: false,
      });
    }, [tableWidth]);

    // 给剩余的列分配宽度，若分配的宽度小于最小列宽，将启用最小列宽，并过滤 fixed
    const mergedColumns = useMemo(() => {
      const { length } = columns!.filter(({ width }) => !width);
      const tmpWidth = length === 0 ? 0 : Math.floor((tableWidth - +x) / length);
      const width = tmpWidth < minColumnWidth ? minColumnWidth : tmpWidth;
      let mergedColumns = columns.map(({ fixed, ...column }) => (column.width ? column : { ...column, width }));

      // 实际宽度大于滚动宽度时，放大列宽
      const columnsWidth = width * length + +x;
      if (tableWidth > columnsWidth) {
        const scale = tableWidth / columnsWidth;
        mergedColumns = mergedColumns.map(({ width, ...column }) => {
          return { ...column, width: Math.floor(+width! * scale) };
        });
      }

      return mergedColumns;
    }, [x, tableWidth]);

    const [connectObject] = useState(() => {
      const obj = {};
      Object.defineProperty(obj, 'scrollLeft', {
        get: () => null,
        set: (scrollLeft) => {
          if (gridRef.current) {
            gridRef.current!.scrollTo({
              scrollLeft,
            } as any);
          }
        },
      });
      return obj;
    });

    const renderVirtualList = (rawData: any, { ref, onScroll }: any) => {
      ref.current = connectObject;
      return (
        <VariableSizeGrid
          ref={gridRef}
          className="virtual-grid"
          height={+y}
          rowCount={rawData.length}
          columnCount={mergedColumns.length}
          rowHeight={() => rowHeights[componentSize]}
          width={tableWidth}
          onScroll={({ scrollLeft }) => onScroll({ scrollLeft })}
          columnWidth={(index) => +mergedColumns[index].width!}
        >
          {({ columnIndex, rowIndex, style }) => {
            const { dataIndex, render } = mergedColumns[columnIndex] as any;
            const data = rawData[rowIndex];
            const column = data['' + dataIndex];

            return (
              <div style={{ padding: columnPadding[componentSize], ...style }} className={styles.virtualColumn}>
                {render?.(column ?? data, data, rowIndex) || column}
              </div>
            );
          }}
        </VariableSizeGrid>
      );
    };

    return (
      <Table
        {...props}
        rowSelection={undefined}
        columns={mergedColumns}
        components={{
          body: renderVirtualList,
        }}
      />
    );
  }
);

const rowHeights: any = { large: 54, middle: 46, small: 38 };

const columnPadding: any = { large: 16, middle: '12px 8px', small: 8 };
