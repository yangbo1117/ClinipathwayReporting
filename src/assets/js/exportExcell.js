import FileSaver from 'file-saver'
// import XLSX from "xlsx";
import XLSX from 'xlsx-style';

// 设置表格中cell默认的字体，居中，颜色等

var defaultCellStyle = {
  font: {
    // name: "宋体", sz: 11, color: { auto: 1 },
  },
  border: {
    // color: { auto: 1 },
    // top: { style: 'thin' },
    // bottom: { style: 'thin' },
    // left: { style: 'thin' },
    // right: { style: 'thin' }
  },
  alignment: {
    // /// 自动换行
    // wrapText: 1,
    // // 居中
    // horizontal: "center",
    vertical: "center",
    // indent: 0
  }
};

// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheets, sheetName) {
  // sheetName = sheetName || 'sheet1';
  let workbook = {
    SheetNames: [],
    Sheets: {}
  };
  // workbook.Sheets[sheetName] = sheet
  sheets.forEach((i, index) => {
    let name = `Sheet${index + 1}`;
    let arr = [...workbook.SheetNames];
    arr.push(name);
    workbook.SheetNames = arr;
    workbook.Sheets[name] = i;
  })
  

  // window.console.log(workbook)
  // 生成excel的配置项
  const wopts = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary'
  };

  const wbout = XLSX.write(workbook, wopts, { defaultCellStyle: defaultCellStyle });
  const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  // 字符串转ArrayBuffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  return blob;
}

//定位Excel位置
var num = function (i) {
  var n = parseInt(i + 65)
  if (n > 90) {
    n = String.fromCharCode(65) + String.fromCharCode(i + 39)
    return n
  } else {
    n = String.fromCharCode(n)
    return n
  }
}

function renderSheet(headers, data, merges) {
  var tableTitleFont = {
    font: {
      // name: '宋体',
      // sz: 12,
      bold: false,
      italic: false,
      underline: false,
      color: { rgb: "ffffff" },
    },
    alignment: {
      horizontal: "center",
      vertical: "center"
    },
    fill: {
      fgColor: { rgb: "A5A5A5" }
    },
  };

  // json => sheet
  var _headers = headers
    // 为 _headers 添加对应的单元格位置
    .map((v, i) => Object.assign({}, {
      v: v.title,
      position: num(i) + 1
    }))
    // 转换成 worksheet 需要的结构
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v, s: tableTitleFont } }), {});
  var _data = data
    .map((v, i) => headers.map((k, j) => Object.assign({}, {
      v: v[k.key],
      position: num(j) + (i + 2)
    })))
    // 对刚才的结果进行降维处理（二维数组变成一维数组）
    .reduce((prev, next) => prev.concat(next))
    // 转换成 worksheet 需要的结构
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {})
  // 合并 headers 和 data
  // console.log("测试data",data)
  var output = Object.assign({}, _headers, _data);
  // 获取所有单元格的位置
  var outputPos = Object.keys(output); //增加了footer
  // 计算出范围
  var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
  // 构建 workbook 对象

  var dataInfo = Object.assign({}, output, { '!ref': ref });
  // 这是表头行的样式
 

  let sheetCols = [];
  for (var b in dataInfo) {
    if (b.indexOf("1") > -1) {
      sheetCols.push({ wch: 17 });
    }
  }
  dataInfo['!merges'] = merges;
  dataInfo['!cols'] = sheetCols; //列宽
  return dataInfo;
}

function funtransformF(exportArr, fileName) {
  let result = exportArr.map(i => {
    return renderSheet(i.headers, i.data, i.merges);
  })
  console.log(exportArr, fileName, result)

  const wbBlob = sheet2blob(result);
  // 保存下载
  FileSaver.saveAs(wbBlob, fileName);
}
export {
  funtransformF
}

