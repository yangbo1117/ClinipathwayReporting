import React, { Component } from 'react'; 
import { Table, Radio, Tabs, Space } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import _ from "lodash";

const { TabPane } = Tabs;

class ManageMentCpt extends Component {
    selectForm = React.createRef();
    state = {
        pagination: {
            current: 1,
            pageSize: 10,
        },
        isSimple: false, //全简
        sortedInfo: null,
        sorterVal: null, //排序
        filteredInfo: null,
        filterVal: null, // 筛选
    }

    // 表格Onchange
    handleTableChange = (pagination, filters, sorter) => {
        const { isSimple } = this.state;
        //排序
        let Sorting = null;
        if( sorter.order === "ascend") {
            Sorting = `${sorter.columnKey} asc`;
        }
        if( sorter.order === "descend" ) {
            Sorting = `${sorter.columnKey} desc`;
        }
        //筛选
        let hospNameId = null;
        if(filters.hospName){
            hospNameId = filters.hospName[0];
        }else {
            hospNameId = null;
        }
        this.setState({ 
            pagination: pagination, 
            sortedInfo: sorter,
            sorterVal: Sorting,
            filteredInfo: filters,
            filterVal: hospNameId,
        });
        this.props.handleTableChange({
            "SkipCount": (pagination.current - 1) * pagination.pageSize,
            "MaxResultCount": pagination.pageSize,
            "Sorting": Sorting,
            "simplifiedName": isSimple,
            "OrganizationId": hospNameId,
        })
    }

    //名称全简切换
    ChangeName = (e) => {
        const { pagination, sorterVal, filterVal } = this.state;
        const value = e.target.value;
        this.setState({ isSimple: value });
        this.props.handleTableChange({
            "SkipCount": (pagination.current - 1) * pagination.pageSize,
            "MaxResultCount": pagination.pageSize,
            "Sorting": sorterVal,
            "simplifiedName": value,
            "OrganizationId": filterVal,
        });
    }

    //增加columns排序
    AddColumnRules = (columns, rules, opcolumn, sortedInfo) => {
        let result = columns.map(i => {
            let item = _.filter(rules, function(n) {
                return _.toLower(n.name) === _.toLower(i.key);
            });
            if(!_.isEmpty(item) && item[0].canSort){
                return {
                    ...i,
                    sorter: true,
                    sortOrder: sortedInfo.columnKey === i.key && sortedInfo.order
                }
            }else {
                return i;
            }
        });
        return _.concat(result, opcolumn);
    }

    //Tabs切换的时候Tabs状态发生改变
    onTabsChange = (value) => {
        this.props.onTabsChange(value);
        this.setState({
            pagination: {
                current: 1,
                pageSize: 10,
            },
            isSimple: false, //全简
            sortedInfo: null,
            sorterVal: null, //排序
            filteredInfo: null,
            filterVal: null, // 筛选
        });
    }

    render() {
        let { pagination, sortedInfo, filteredInfo, isSimple } = this.state;
        const { tabsdata, showCreate, showFillter, pathwayReports, loading, columns, opcolumn, columnrules, total, institutions } = this.props;
        sortedInfo = sortedInfo || {};
        filteredInfo = filteredInfo || {};
        let filltersData = institutions.map(i => ({
            "text": isSimple ? i.simplifiedName : i.name,
            "value": i.id,
        }));
        let newcolmuns = [
            {
                title: '医院名称',
                dataIndex: 'hospName',
                key: 'hospName',
                // width: 350,
                filteredValue: filteredInfo.hospName || null,
                filters: showFillter && filltersData,
                filterMultiple: false,
            }
        ]
        let concatColumns = this.AddColumnRules(_.concat(newcolmuns, columns), columnrules, opcolumn, sortedInfo);
        return (
            <div>
                <Tabs 
                    tabPosition='top' 
                    onChange = { this.onTabsChange }
                    tabBarExtraContent= {
                        <div>
                            {
                                showCreate ? <Link to='/Layout/PathwayReport/Create'>
                                    <div className="create-btn-s">
                                        <Space>
                                            <PlusOutlined />
                                            <span>新建</span>
                                        </Space>
                                    </div>
                                </Link> : null
                            }
                        </div>
                    } 
                >
                    {
                        tabsdata.map((t, index) => {
                            return (
                                <TabPane key={t.status} tab={t.name} >
                                    <Table
                                        title= {()=>(
                                            <div className="flex-space-between">
                                                <span className="title-b">{t.name}列表</span>
                                                <div className="flex-space-between">
                                                    <Radio.Group
                                                        className="space-margin4"
                                                        value = { isSimple }
                                                        onChange={ this.ChangeName }
                                                        buttonStyle="solid"
                                                    >
                                                        <Radio.Button style={{ borderRadius: "15px 0 0 15px" }} value={false}>机构全称</Radio.Button>
                                                        <Radio.Button style={{ borderRadius: "0 15px 15px 0" }} value={true}>机构简称</Radio.Button>
                                                    </Radio.Group>
                                                </div>
                                            </div>
                                        )}
                                        loading={loading}
                                        pagination={{
                                            ...pagination,
                                            total: total,
                                            responsive: true,
                                            showSizeChanger: true,
                                            showTotal: (total, range) => (`展示第 ${range[0]} 项至第 ${range[1]} 项结果   总共 ${total} 项`),
                                        }}
                                        overlayClassName= "customFillterDropdown"
                                        onChange={this.handleTableChange}
                                        bordered={true}
                                        columns={concatColumns}
                                        dataSource={pathwayReports}
                                        scroll={{ x: "max-content" }}
                                    ></Table>
                                </TabPane>
                            )
                        })
                    }
                </Tabs>
            </div>
        )
    }
}
export default ManageMentCpt;