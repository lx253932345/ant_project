import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const intl = useIntl();

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={'京ICP备2020036435号'}
      links={[
        {
          key: 'Ant Design Pro',
          title: '京ICP备2020036435号',
          href: 'https://beian.miit.gov.cn/',
          blankTarget: true,
        }
      ]}
    />
  );
};

export default Footer;
