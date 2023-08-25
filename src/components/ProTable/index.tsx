import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';

export default (props: any) => {
  const { fetchRequest, columns = [], searchParams = {}, setSearchParams, ...restProps } = props;
  const actionRef = useRef<ActionType>();

  return (
    <ProTable
      columns={columns}
      actionRef={actionRef}
      request={async (params = {}) => {
        params.page = params.current - 1;
        const currParams = { ...params, size: params?.pageSize || 10 };
        delete currParams.current;
        delete currParams.pageSize;
        if (searchParams && Object.keys(searchParams).length > 0) {
          const obj = searchParams;
          if (params.hasOwnProperty(obj?.name) && !obj?.type) {
            currParams[obj?.value[0]] = params[obj?.name][0];
            currParams[obj?.value[1]] = params[obj?.name][1];
            delete currParams[obj?.name];
          } else if (params.hasOwnProperty(obj?.name) && obj?.type) {
            delete currParams[obj?.value[0]];
            delete currParams[obj?.value[1]];
            if (obj?.replaceParams) {
              const replaceParams = obj?.replaceParams;
              currParams[replaceParams?.value[0]] = currParams[replaceParams?.name][0];
              currParams[replaceParams?.value[1]] = currParams[replaceParams?.name][1];
              delete currParams[replaceParams?.name];
            }
          }
        }
        if (setSearchParams) {
          setSearchParams(currParams);
        }
        // console.log('params', currParams);
        const res = await fetchRequest(currParams);
        let list = [];
        if (res && res?.content && Array.isArray(res?.content)) {
          list = res?.content;
        } else if (searchParams?.type && !searchParams?.replaceParams) {
          list = res || [];
        } else if (searchParams?.replaceParams) {
          list = res?.dataList || [];
        }
        // console.log('list', list)
        return {
          success: true,
          data: list || [],
          total: res?.totalElements || list.length || 0,
        };
      }}
      rowKey="id"
      pagination={{
        showTotal: (total) => `共${total}条`,
        defaultPageSize: 10,
        showSizeChanger: true,
        // onChange: (page, pageSize) => {
        //   // console.log('page', page, pageSize);
        // },
      }}
      {...restProps}
    />
  );
};
