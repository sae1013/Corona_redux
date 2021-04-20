import React,{useState,useEffect} from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2';
// import axios from 'axios'

function Contents() {
    
    const [completeData,setcompleteData] = useState({})
    const [quarantinedData,setquarantinedData]= useState({})
    const [comparedData , setcomparedData] = useState({})
    useEffect(()=>{
        const fetchData = ()=>{
            fetch("https://api.covid19api.com/total/country/kr?from=2020-01-01T00:00:00Z&to=2021-12-31T00:00:00Z")
            .then((res)=> res.json()) // 동일한 promise가  나오고, .then 자리에 
            .then((data)=> {
                parse(data)

            })
        }
        fetchData();
    },[]);



function parse(arr){
    var cur_year,cur_month,cur_date,cur_Confirmed,cur_Deaths,cur_Recovered,cur_Active;
    var parsing_data= []
    arr.forEach((cur,i)=>{
        
        const currentDate = new Date(cur.Date);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth()+1;
        const date = currentDate.getDate();
        
        if(i==0){
            cur_year = year
            cur_month =month;
            cur_date = date;
            cur_Confirmed=cur.Confirmed;
            cur_Deaths= cur.Deaths;
            cur_Recovered=cur.Recovered;
            cur_Active=cur.Active;
            
        }
        if( (cur_month != month && i !=0)){
            parsing_data.push({year:cur_year,month:cur_month,date:cur_date,Confirmed:cur_Confirmed,Deaths:cur_Deaths,Recovered:cur_Recovered,Active:cur_Active});
        }
        if( i != 0){ //첫째 그외 의 모든 경우
            cur_year = year;
            cur_month =month;
            cur_date = date;
            cur_Confirmed=cur.Confirmed;
            cur_Deaths= cur.Deaths;
            cur_Recovered=cur.Recovered;
            cur_Active=cur.Active;
    
        }    
        if(i == arr.length-1){
            parsing_data.push({year:cur_year,month:cur_month,date:cur_date,Confirmed:cur_Confirmed,Deaths:cur_Deaths,Recovered:cur_Recovered,Active:cur_Active});
        }
        
    });
    
    const labels = parsing_data.map((item)=>{
        return `${item.year}년 ${item.month}월`
    });
    
    const confirmedData = { // parsing 을 하면 -> confirmedData 를 리턴해야함 
        labels:labels,
        datasets:[
            {
                label:'국내 누적 확진자',
                backgroundColor: 'salmon',
                fill: true,
                data:parsing_data.map((item)=> item.Confirmed)
            },
        ]
    }
    setcompleteData(confirmedData);

    const quarantinedData ={ 
        labels:labels,
        datasets:[
            {
                label:'월별 격리자 현황',
                borderColor: 'blue',
                fill: false,
                data:parsing_data.map((item)=> item.Active)
            },
        ]
    }  
    setquarantinedData(quarantinedData);
    
    const lastData = parsing_data[parsing_data.length-1]

    const comparedData ={ 
        labels:["확진자","격리해제","사망"],
        datasets:[
            {
                label:'누적확진, 해제, 사망비율',
                backgroundColor:["#fcba03","#312d96","#f22c05"],
                borderColor:["#fcba03","#312d96","#f22c05"],
                fill: false,
                data: [lastData.Confirmed,lastData.Recovered,lastData.Deaths]
            },
        ]
    }
    setcomparedData(comparedData);
}
    

    return (
        <section className="contents__section">
            <h2>국내 코로나 현황</h2>
            <div className="contents">
                <div>
                    <Bar data ={completeData} options={
                        {title:{display:true, text:"누적 확진자 동향",fontSize:16}},
                        {legend:{display:true,position:"bottom"}}
                        }>
                    </Bar>

                    <Line data ={quarantinedData} options={
                        {title:{display:true, text:"월별 격리동향",fontSize:16}},
                        {legend:{display:true,position:"bottom"}}
                        }>
                    </Line>

                    <Doughnut data ={comparedData} options={
                        {title:{display:true, text:`누적 확진,해제,사망 (${new Date().getMonth()+1}월 기준)`,fontSize:16}},
                        {legend:{display:true,position:"bottom"}}
                        }>
                    </Doughnut>
                </div>
            </div>
        </section>
    )
}

export default Contents
