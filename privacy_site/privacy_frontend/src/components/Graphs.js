import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import dichotomyData from "./staticData/tagDichotomyGraph.json"
import privacyData from "./staticData/tagLabelGraph.json"
import { domain } from "../index.js";
import { useQuery } from "react-query";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler  
  );

export const DichotomyGraph = () => {
    const graphData = dichotomyData.data

    const visualConfig = {
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: "Compliant vs Non-Compliant Apps",
            },
        },
        responsive: true,
        maintainAspectRatio: false, // Allow the chart to adjust its aspect ratio
    }

    // Create an array of dates starting from a specific date
    const startDate = new Date("2021-07-16");
    const endDate = new Date("2022-11-04");
    const dates = [];
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 7)) {
        dates.push(new Date(date));
    }

    // Formatting the dates as needed for the chart labels
    const labels = dates.map(date => {
        // Example: Format the date as "MM/DD/YYYY"
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    });

    const dataConfig = {
        labels,
        datasets: [
            {
                label: 'Tagged apps',
                data: labels.map((label, index) => graphData[index + 1]?.apps_with || 0),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Untagged apps',
                data: labels.map((label, index) => graphData[index + 1]?.apps_without || 0),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <div className="chart-container" style={{ position: 'relative', height: '70vh', width: '90vw' }}>
            <Bar options={visualConfig} data={dataConfig} />
        </div>
    );
}

export const PrivacyGraph = () => {
    const graphData = privacyData.data
    const alternateGraphData = dichotomyData.data

    const visualConfig = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: "Privacy Apps" }
        },
        responsive: true,
        maintainAspectRatio: false, // Allow the chart to adjust its aspect ratio
    }

    const labels = Array.from({ length: 69 }, (_, i) => (i + 1).toString())

    const dataConfig = {
        labels,
        datasets: [
            {
                label: 'Data Linked To You',
                data: labels.map(index => graphData[index]?.linked || 0),
                backgroundColor: '#ccebc5',
                fill: '+3',
                pointStyle: false
            },
            {
                label: 'Data Not Linked To You',
                data: labels.map(index => graphData[index]?.not_linked || 0),
                backgroundColor: '#7bccc4',
                fill: '+1',
                pointStyle: false
            },
            {
                label: 'Data Not Collected',
                data: labels.map(index => graphData[index]?.not_collected || 0),
                backgroundColor: '#a8ddb5',
                fill: '-2',
                pointStyle: false
            },
            {
                label: 'Data Used to Track You',
                data: labels.map(index => graphData[index]?.track || 0),
                backgroundColor: '#f0f9e8',
                fill: true,
                pointStyle: false
            },
            {
                label: 'Compliant Apps',
                data: labels.map(index => alternateGraphData[index]?.apps_with || 0),
                backgroundColor: '#43a2ca',
                fill: '-4', 
                pointStyle: false
            },
            {
                label: 'Total Apps',
                data: labels.map(index => (alternateGraphData[index]?.apps_with || 0) + (alternateGraphData[index]?.apps_without || 0)),
                backgroundColor: '#0868ac',
                fill: '-1',
                pointStyle: false
            }
        ]
    }

    return (
        <div style={{ position: 'relative', height: '70vh', width: '90vw' }}>
            <Line options={visualConfig} data={dataConfig} />
        </div>
    )
}

export const RunGraph = () => {
    const fetchUrl = domain + "run_numbers"
    console.log(fetchUrl)

    const { isLoading, error, data } = useQuery(['repoData'], {// refetches when cursor changes
        queryFn: () => 
          fetch(fetchUrl).then(res => res.json())
      })
    
      if (isLoading) return <div><span className="loading loading-infinity loading-lg"></span></div> // loading page
    
      if (error) return 'An error has occurred: ' + error.message // handle fetch errors
    
    const appList = Object.keys(data).map(key => ({ run: key, count: data[key] }));
    console.log(appList)

    const visualConfig = {
        responsive: true,
        showLine: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: "Run Totals",
            },
        },
    }

    const labels = []
    for(let i = 0; i <= 68; i++){
        labels.push(i.toString())
    }

    const dataConfig ={
        labels,
        datasets: [
            {
                label: 'Run Number',
                data: labels.map((index) => appList[index].count),
                backgroundColor: '#ccebc5',
                //borderColor: 'rgba(255, 99, 132, 0.5)',
                fill: '+3',

            },
        ],
    }
    console.log(labels)

    return(
        <div style={{position: 'relative', height:'80vh', width:'90vw'}}>
            <Line options={visualConfig} data={dataConfig}/>
        </div>
    )
}

export const PurposeGraph = () => {
    const fetchUrl = domain + "purpose_data"
    console.log(fetchUrl)

    const { isLoading, error, data } = useQuery(['repoData'], {// refetches when cursor changes
        queryFn: () => 
          fetch(fetchUrl).then(res => res.json())
      })
    
      if (isLoading) return <div><span className="loading loading-infinity loading-lg"></span></div> // loading page
    
      if (error) return 'An error has occurred: ' + error.message // handle fetch errors
    
    const appList = Object.keys(data).map(key => ({ run: key, count: data[key] }));
    console.log(appList)

    const visualConfig = {
        responsive: true,
        showLine: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: "Purpose Totals",
            },
        },
    }

    const labels = []
    for(let i = 0; i <= 68; i++){
        labels.push(i.toString())
    }

    const dataConfig ={
        labels,
        datasets: [
            {
                label: 'Analytics',
                data: labels.map((index) => appList[index].count),
                backgroundColor: '#ccebc5',
                //borderColor: 'rgba(255, 99, 132, 0.5)',
                fill: '+3',

            },
        ],
    }
    console.log(labels)

    return(
        <div style={{position: 'relative', height:'80vh', width:'90vw'}}>
            <Line options={visualConfig} data={dataConfig}/>
        </div>
    )
}