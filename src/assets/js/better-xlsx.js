import { File } from 'better-xlsx';
import { saveAs } from 'file-saver';
//插件配置 https://d-band.github.io/better-xlsx/class/src/cell.js~Cell.html

function fillColor(cell, type) {
    type = type || 0;
    let colors = ['ffffffff', 'ffa2917d', 'ffe4e2de', 'fffff8df', 'fff1eeec']
    //  0: white ,1: header, 2: first col, 3: second col, 4: gray,
    cell.style.fill.patternType = 'solid';
    cell.style.fill.fgColor = colors[type];
    cell.style.fill.bgColor = 'ffffffff';
}

function InitSheet(column, dataSource, index, file) {
    let newDataSource = dataSource.map(item => {
        let obj = {};
        _.forIn(item, function(value, key) {
            if(value.toString().indexOf('.') === -1){
                obj[key] = value;
            }else{
                if(_.isNumber(value)) {
                    obj[key] = +value.toFixed(2);
                }else {
                    obj[key] = value;
                }
            }
        });
        return obj;
    });
    // 新建表
    let sheet = file.addSheet(`sheet${index}`);
    // 获取表头行数
    let depth = getDepth(column);
    // 获取表头的列数
    let columnNum = getColumns(column);
    // 新建表头行数
    let rowArr = [];
    for (let k = 0; k < depth; k++) {
        rowArr.push(sheet.addRow());
    }

    // 根据列数填充单元格
    rowArr.forEach(ele => {
        for (let j = 0; j < columnNum; j++) {
            let cell = ele.addCell();
            cell.value = j;
        }
    });
    // 初始化表头
    init(column, 0, 0);

    // 按顺序展平column
    let columnLineArr = [];
    columnLine(column);

    // 根据column,将dataSource里面的数据排序，并且转化为二维数组
    let dataSourceArr = [];
    newDataSource.map(ele => {
        let dataTemp = [];
        columnLineArr.map(item => {
            dataTemp.push({
                [item.dataIndex]: ele[item.dataIndex],
                value: ele[item.dataIndex],
            });
        });
        dataSourceArr.push(dataTemp);
    });
    // debugger;
    // 绘画表格数据
    dataSourceArr.forEach((item, index) => {
        //根据数据,创建对应个数的行
        let row = sheet.addRow();
        row.setHeightCM(1);
        //创建对应个数的单元格
        item.map((ele: any) => {
            let cell = row.addCell();
            if (ele.hasOwnProperty('num')) {
                cell.value = index + 1;
            } else {
                cell.value = ele.value;
            }
            cell.style.align.v = 'center';
            cell.style.align.h = 'center';
        });
    });
    //设置每列的宽度
    for (let i = 0; i < columnLineArr.length; i++) {
        sheet.col(i).width = 20;
    }

    // 按顺序展平column
    function columnLine(column) {
        column.map(ele => {
            if (ele.children === undefined || ele.children.length === 0) {
                columnLineArr.push(ele);
            } else {
                columnLine(ele.children);
            }
        });
    }
    // 初始化表头
    function init(column, rowIndex: number, columnIndex: number) {
        column.map((item) => {
            let hCell = sheet.cell(rowIndex, columnIndex);
            // 如果没有子元素, 撑满列
            if (item.title === '操作') {
                hCell.value = '';
                return null;
            } else if (item.children === undefined || item.children.length === 0) {
                // 第一行加一个单元格
                hCell.value = item.title;
                hCell.vMerge = depth - rowIndex - 1;
                hCell.style.align.h = 'center';
                hCell.style.align.v = 'center';
                columnIndex++;
                // rowIndex++
            } else {
                let childrenNum = 0;
                function getColumns(arr) {
                    arr.map(ele => {
                        if (ele.children) {
                            getColumns(ele.children);
                        } else {
                            childrenNum++;
                        }
                    });
                }
                getColumns(item.children);
                hCell.hMerge = childrenNum - 1;
                hCell.value = item.title;
                hCell.style.align.h = 'center';
                hCell.style.align.v = 'center';
                let rowCopy = rowIndex;
                rowCopy++;
                init(item.children, rowCopy, columnIndex);
                // 下次单元格起点
                columnIndex = columnIndex + childrenNum;
            };
            fillColor(hCell, 2)
        });
    }
    // 获取表头rows
    function getDepth(arr) {
        const eleDepths = [];
        arr.forEach(ele => {
            let depth = 0;
            if (Array.isArray(ele.children)) {
                depth = getDepth(ele.children);
            }
            eleDepths.push(depth);
        });
        return 1 + max(eleDepths);
    }

    function max(arr) {
        return arr.reduce((accu, curr) => {
            if (curr > accu) return curr;
            return accu;
        });
    }
    // 计算表头列数
    function getColumns(arr) {
        let columnNum = 0;
        arr.map(ele => {
            if (ele.children) {
                getColumns(ele.children);
            } else {
                columnNum++;
            }
        });
        return columnNum;
    }
}

function ExportExcel(source, fileName = '默认导出'){
    // 新建工作谱
    const file = new File();
    source.forEach((item, index) => {
        InitSheet(item.column,item.dataSource, index + 1, file);
    });
    file.saveAs('blob').then(function (content) {
        saveAs(content, fileName + '.xlsx');
    });
}

export default ExportExcel;
