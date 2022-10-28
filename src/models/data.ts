// chart located in Notebook page as a test
const chart = {
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        name: 'Age',
        nameGap: 35,
        nameLocation: 'middle',
        nameTextStyle: {
            fontSize: 12
        }
    },
    yAxis: {
        type: 'value',
        name: 'Frequency',
        nameGap: 25,
        nameLocation: 'middle',
        nameTextStyle: {
            fontSize: 12
        }
    },

    series: [
        {
            data: [5, 10, 12, 14, 16, 18],
            type: 'line',
            lineStyle: {
                color: '#0099FF'
            },
            areaStyle: { color: '#0099FF' }
        }
    ]
};
export default chart;
