/**
 * 下载excel
 * @param data 二进制数据流
 * @param name 文件名称
 */
const downloadExcel = (data: any, name: string) => {
  let url = window.URL.createObjectURL(
    new Blob([data], { type: 'application/vnd.ms-excel;charset=utf-8' }),
  );
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
};

export default downloadExcel;
