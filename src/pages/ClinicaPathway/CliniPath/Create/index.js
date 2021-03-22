import React from "react";
import { Form, TreeSelect, Input, } from "antd";
// import _ from "lodash";

const ClinipathCreate = (props) => {

    // const [searchval, setsearchval] = useState("");

    // const onSearch = value => {
    //     const deepDate = _.flattenDeep(data);
    //     let keyword = _.filter(deepDate, function(o) {
    //         var reg = new RegExp( o.name );
    //         if(reg.test(value)) {
    //             return o
    //         }else {
    //             return
    //         }
    //     })
    //     setsearchval(value)
    // }

    return(
        <div>
            <Form.Item label= "临床路径专业名称" name= "subjectId" rules={[{ required: true }]}>
                <TreeSelect 
                    dropdownStyle = {{ padding: "0.5rem" }}
                    // showSearch= {true}
                    treeIcon= {true}
                    treeData= { props.subjects }
                    // searchValue= { searchval }
                    // onSearch= { onSearch }
                />
            </Form.Item>
            <Form.Item label="临床路径病种名称" name="diseaseName" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
        </div>
    )
} 

export default ClinipathCreate;