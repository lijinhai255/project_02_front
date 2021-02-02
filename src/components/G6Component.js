import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import G6 from "@antv/g6";
import * as echarts from 'echarts/core';
import {
  TooltipComponent
} from 'echarts/components';
import {
  TreeChart
} from 'echarts/charts';
import {
  SVGRenderer
} from 'echarts/renderers';
echarts.use(
  [TooltipComponent, TreeChart, SVGRenderer]
);
var myChart;
var option;
const G6component = (props) => {
  const ref = React.useRef(null);
  const [data, getData] = useState(null)
  useEffect(() => {
    //   console.log(props.data,"props-data")

    // newData.children = [...props.data]
    //   newData
    getData(
      props.data
    )
    console.log(props.data, "data")
    data && renderFn()

  }, [props])
  function renderFn() {
    if (data) {
      var chartDom = ReactDOM.findDOMNode(ref.current);
      myChart = echarts.init(chartDom);
       if(myChart){
      console.log("kkkkkk",)

        myChart.setOption(
          option = {
            tooltip: {
              trigger: 'item',
              triggerOn: 'mousemove'
            },
            series: [
              {
                type: 'tree',
  
                data: [data],
  
                top: '1%',
                left: '7%',
                bottom: '1%',
                right: '20%',
  
                symbolSize: 7,
  
                label: {
                  position: 'left',
                  verticalAlign: 'middle',
                  align: 'right',
                  fontSize: 9
                },
  
                leaves: {
                  label: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                  }
                },
  
                emphasis: {
                  focus: 'descendant'
                },
  
                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750
              }
            ]
          });
        option && myChart.setOption(option)
       }
    }

  }

  return <div ref={ref} style={{ width: "100%", height: 1000, border: '1px solid #ccc' }}></div>;
};

export default G6component;