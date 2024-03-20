import Navbar from "@/components/navbar";
import React, { useEffect, useState, useRef } from 'react';
import { Chart } from "chart.js/auto";
import { Select, SelectSection, SelectItem } from "@nextui-org/react";
import { Autocomplete, AutocompleteItem, select } from "@nextui-org/react";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Input } from "@nextui-org/react";
import axios from 'axios';



export default function Home() {
  const [statusData, setStatusData] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [count_all, setCountAll] = useState(0)
  const [count_pos, setCountPos] = useState(0)
  const [count_neu, setCountNeu] = useState(0)
  const [count_neg, setCountNeg] = useState(0)

  const brandName = ["Apple", "Samsung", "OPPO", "vivo", "Huawei", "Xiaomi"]
  const [selectBrand, setSelectBrand] = React.useState(new Set(["Apple", "OPPO", "Samsung", "vivo", "Xiaomi", "Huawei"]));
  // const [brandModel, setBrand] = React.useState(["Apple", "OPPO", "Samsung", "vivo", "Xiaomi", "Huawei"]);

  const [brandsData, setBrandsData] = React.useState({})
  //2ปุ่ม
  const [selectedBrand, setSelectedBrand] = useState('Apple'); //เอามาจากนี้

  // const [models, setModels] = useState([]);  //เอาไว้ทำ key
  const [showModel, setShowModel] = useState([]) //เอาไว้แสดงผล
  const [defaultSelectModel, setDefaultSelectModel] = useState('iPhone 12')
  const [selectedModel, setSelectedModel] = useState(defaultSelectModel); //user selected

  //donut
  const [model_pos, setModelCountpos] = useState(0)
  const [model_neu, setModelCountneu] = useState(0)
  const [model_neg, setModelCountneg] = useState(0)

  const chartRef = useRef(null)
  const donutChartRef = useRef(null)
  const barChartRef = useRef(null)
  const barHorizontalChartRef = useRef(null)

  const [selectAspect, setSelectAspect] = React.useState(new Set(["Camera", "Battery", "Screen", "Performance", "Price"]));
  // const [Modelasp, setAspect] = React.useState(["Camera", "Battery", "Screen", "Performance", "Price"]); //ไว้แสดง

  const [selectedAspectsFilter, setselectedAspectsFilter] = useState('');
  const [selectedSentimentsFilter, setSelectedSentimentsFilter] = useState('');
  const [aspectsData, setAspectsData] = useState({})
  const [reviews, setReviews] = useState([]);

  const handleSelectAspectSentimentchange = (newValue) => {
    setselectedAspectsFilter(newValue ?? ''); // ถ้า newValue เป็น null หรือ undefined ให้กำหนดค่าเป็น ''
  };

  const handleSelectSentimentchange = (newValue) => {
    setSelectedSentimentsFilter(newValue ?? ''); // ถ้า newValue เป็น null หรือ undefined ให้กำหนดค่าเป็น ''
  };

  useEffect(() => {
    setStatusData(false);
    setIsLoaded(false); // Set loading state before fetching data
    const fetchAllDataSentiment = async () => {
      try {
        const response = await fetch("/api/all_sentiments")
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Check if data.overviews exists before accessing its properties
        if (data.overviews) {
          setCountAll(data.overviews.count_all);
          setCountPos(data.overviews.count_pos);
          setCountNeu(data.overviews.count_neu);
          setCountNeg(data.overviews.count_neg);
        }

        if (data.brands) {
          setBrandsData(data.brands);
        }

        setStatusData(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error state if needed
      }
      setIsLoaded(true);
    }
    fetchAllDataSentiment();
  }, []);


  if (chartRef.current) {
    if (chartRef.current.chart) {
      chartRef.current.chart.destroy()
    }
    const context = chartRef.current.getContext("2d")
    let a = []
    let array_pos = []
    let array_neu = []
    let array_neg = []
    selectBrand.forEach(element => {
      if (brandsData[element] && brandsData[element]['count_pos'] !== undefined && brandsData[element]['count_neu'] !== undefined && brandsData[element]['count_neg'] !== undefined) {
        a.push(element);
        let total = brandsData[element]['count_pos'] + brandsData[element]['count_neu'] + brandsData[element]['count_neg'];
        // array_pos.push(brandsData[element]['count_pos'] / total * 100);
        // array_neu.push(brandsData[element]['count_neu'] / total * 100);
        // array_neg.push(brandsData[element]['count_neg'] / total * 100);
        array_pos.push(brandsData[element]['count_pos']);
        array_neu.push(brandsData[element]['count_neu']);
        array_neg.push(brandsData[element]['count_neg']);
      }
    })
    const newChart = new Chart(context, {
      type: "bar",
      plugins: [ChartDataLabels],
      data: {
        labels: a,
        datasets: [{
          label: 'Positive',
          data: array_pos,
          borderWidth: 1,
          backgroundColor: '#70c1b3'
        }, {
          label: 'Neutral',
          data: array_neu,
          borderWidth: 1,
          backgroundColor: '#EFBF38'
        }, {
          label: 'Negative',
          data: array_neg,
          borderWidth: 1,
          backgroundColor: '#dd7373'
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Customer Feelings for Smartphone',
            font: {
              size: 18,
              family: 'Kanit',
            },
            position: 'top'
          },
          datalabels: {
            display: true,
            align: 'end', // Position data labels at the top
            anchor: 'end'
            // color: '#fff' // Color of the data labels
          }
        }
      }
    })
    chartRef.current.chart = newChart
  }

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        let response = await fetch(`/api/brandmodel?brandName=${selectedBrand}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();

        // Inspect the response structure and content
        console.log("Response:", data);

        // Process the data as needed
        // setSelectedModel(data);
        setShowModel(data);
        console.log("fetch Brand Complete");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBrandData();
  }, [selectedBrand]);

  const getBackgroundColor = (sentiment) => {
    switch (sentiment) {
      case 'pos':
        return "#EFFAF5";
      case 'neu':
        return "#FFF7E6";
      case 'neg':
        return "#FEF3F3";
      default:
        return ""; // Default color
    }
  };

  const getTextColor = (sentiment) => {
    switch (sentiment) {
      case 'pos':
        return "#1FBB66";
      case 'neu':
        return "#EEA717";
      case 'neg':
        return "#EA4141";
      default:
        return ""; // Default text color
    }
  };

  const getSentimentText = (sentiment) => {
    switch (sentiment) {
      case 'pos':
        return "Positive";
      case 'neu':
        return "Neutral";
      case 'neg':
        return "Negative";
      default:
        return sentiment; // Return original sentiment if not recognized
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoaded(true);
        const selectedSmartphones = [selectedModel].filter(model => model);

        const promises = selectedSmartphones.map(model =>
          axios.get(`/api/compare_smartphonereview?smartphone=${encodeURIComponent(model)}&selectedAspect=${encodeURIComponent(selectedAspectsFilter)}`));

        const responses = await Promise.all(promises);
        const reviewData = responses.map(response => response.data);

        // Combine review data from all responses
        const combinedReviews = reviewData.flat();

        // Update state with combined reviews
        setReviews(combinedReviews);
      } catch (error) {
        console.error('Error fetching smartphone review data:', error);
      } finally {
        setIsLoaded(false);
      }
    };

    fetchReviews();
  }, [selectedModel, selectedAspectsFilter]);

  const showindividualModel = async (selectedModel) => {
    try {
      // Fetch individual model data
      const individualModelResponse = await axios.get(`/api/individual_Info?smartphone=${encodeURIComponent(selectedModel)}`);
      const individualModelData = individualModelResponse.data;

      // Initialize counts and aspects
      let model_pos = 0,
        model_neu = 0,
        model_neg = 0;
      let aspects = {
        "Camera": { aspect_pos: 0, aspect_neu: 0, aspect_neg: 0 },
        "Battery": { aspect_pos: 0, aspect_neu: 0, aspect_neg: 0 },
        "Screen": { aspect_pos: 0, aspect_neu: 0, aspect_neg: 0 },
        "Performance": { aspect_pos: 0, aspect_neu: 0, aspect_neg: 0 },
        "Price": { aspect_pos: 0, aspect_neu: 0, aspect_neg: 0 }
      };

      // Loop through data to count sentiments and aspects
      individualModelData.forEach(item => {
        switch (item.Sentiment_Label) {
          case "pos":
            model_pos++;
            break;
          case "neu":
            model_neu++;
            break;
          case "neg":
            model_neg++;
            break;
        }

        // Check if Aspects is an array before iterating
        if (Array.isArray(item.Aspects)) {
          item.Aspects.forEach(aspectItem => {
            switch (aspectItem.Aspect_Sentiment_Label) {
              case "pos":
                aspects[aspectItem.aspects].aspect_pos++;
                break;
              case "neu":
                aspects[aspectItem.aspects].aspect_neu++;
                break;
              case "neg":
                aspects[aspectItem.aspects].aspect_neg++;
                break;
            }
          });
        }
      });

      // Construct the result object
      const result = {
        overviews: {
          model_pos: model_pos,
          model_neu: model_neu,
          model_neg: model_neg
        },
        Aspect: aspects
      };

      // Update state with individual model data
      setModelCountpos(result.overviews.model_pos);
      setModelCountneu(result.overviews.model_neu);
      setModelCountneg(result.overviews.model_neg);
      setAspectsData(result.Aspect);

      console.log(result); // or return this result or use it as needed
    } catch (error) {
      console.error("Error fetching individual model data:", error);
    }
  };

  const handleModelChange = (selected) => {
    setSelectedModel(selected);
    showindividualModel(selected);
  };

  useEffect(() => {
    showindividualModel(selectedModel);
  }, [selectedModel]);

  const filterReviews = () => {
    if (selectedAspectsFilter !== '' && selectedSentimentsFilter !== '') {
      return reviews.filter(review => review.aspects === selectedAspectsFilter && review.Aspect_Sentiment_Label === selectedSentimentsFilter);
    } else if (selectedSentimentsFilter !== '') {
      return reviews.filter(review => review.Sentiment_Label === selectedSentimentsFilter);
    } else if (selectedAspectsFilter !== '') {
      return reviews.filter(review => review.aspects === selectedAspectsFilter)
    } else {
      return reviews
    }
  }


  // const fetchDataModel = (e) => {
  //   setSelectedModel(e.target.value);
  //   fetchDataBrand();
  // }

  // const callapi = async (fetchDataModel) => {
  //   console.log("Test fetch data => ", fetchDataModel)


  //   let brandres = await fetch(`http://localhost:3000/api/countsentiment?brand=${selectedBrand}&model=${fetchDataModel}`);

  //   let countmodel = await brandres.json();
  //   setSelectedModel(fetchDataModel);
  //   console.log("yshs", countmodel)
  //   setModelCountpos(countmodel.overviews.model_pos)
  //   setModelCountneu(countmodel.overviews.model_neu)
  //   setModelCountneg(countmodel.overviews.model_neg)
  //   setAspectsData(countmodel.Aspect)

  //   let reviewRes = await fetch(`http://localhost:3000/api/reviewmodel?model=${fetchDataModel}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   let reviews = await reviewRes.json();
  //   setReviews(reviews);

  // };

  // const fetchDataBrand = async () => {
  //   console.log("Test fetch data => ", selectedModel)

  //   let brandres = await fetch(`http://localhost:3000/api/countsentiment?brand=${selectedBrand}&model=${selectedModel}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   let countmodel = await brandres.json();
  //   console.log("yshs", countmodel)
  //   await setModelCountpos(countmodel.overviews.model_pos)
  //   await setModelCountneu(countmodel.overviews.model_neu)
  //   await setModelCountneg(countmodel.overviews.model_neg)
  //   await setAspectsData(countmodel.Aspect)

  //   let reviewRes = await fetch(`http://localhost:3000/api/reviewmodel?model=${selectedModel}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   let reviews = await reviewRes.json();
  //   setReviews(reviews);
  //   console.log('====================================');
  //   console.log('hghg', reviews);
  //   console.log('====================================');
  // };


  if (donutChartRef.current) {
    if (donutChartRef.current.chart) {
      donutChartRef.current.chart.destroy();
    }
    const donutContext = donutChartRef.current.getContext("2d");
    const total = model_pos + model_neu + model_neg;
    const newDonutChart = new Chart(donutContext, {
      type: "doughnut",
      plugins: [ChartDataLabels],
      data: {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
          data: [
            (model_pos / total) * 100,
            (model_neu / total) * 100,
            (model_neg / total) * 100
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(255, 99, 132, 0.8)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(255, 99, 132, 0.8)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Sentiment Analysis Overall',
            font: {
              size: 18,
              family: 'Kanit',
            },
            position: 'top'
          },
          datalabels: {
            display: true,
            align: 'center',
            anchor: 'center',
            formatter: (value, context) => {
              return value.toFixed(2) + '%';
              //return context.chart.data.labels[context.dataIndex] + ': ' + value.toFixed(2) + '%';
            },
            color: '#000',
            font: {
              size: 14,
              family: 'Kanit',
            }
          }
        },
        maintainAspectRatio: false,
        // responsive: true
      }
    });
    donutChartRef.current.chart = newDonutChart;
  }

  useEffect(() => {
    if (barChartRef.current) {
      if (barChartRef.current.chart) {
        barChartRef.current.chart.destroy();
      }

      const barcontext = barChartRef.current.getContext("2d");
      let labels = [];
      let array_pos = [];
      let array_neu = [];
      let array_neg = [];

      selectAspect.forEach(element => {
        if (
          aspectsData[element] &&
          aspectsData[element]["aspect_pos"] !== undefined &&
          aspectsData[element]["aspect_neu"] !== undefined &&
          aspectsData[element]["aspect_neg"] !== undefined
        ) {
          let total =
            aspectsData[element]["aspect_pos"] +
            aspectsData[element]["aspect_neu"] +
            aspectsData[element]["aspect_neg"];

          if (total > 0) {
            labels.push(element);
            array_pos.push((aspectsData[element]["aspect_pos"] / total) * 100);
            array_neu.push((aspectsData[element]["aspect_neu"] / total) * 100);
            array_neg.push((aspectsData[element]["aspect_neg"] / total) * 100);
          }
        }
      });

      const barChart = new Chart(barcontext, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Positive",
              data: array_pos,
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              stack: "Stack 1",
            },
            {
              label: "Neutral",
              data: array_neu,
              backgroundColor: "rgba(255, 206, 86, 0.5)",
              stack: "Stack 1",
            },
            {
              label: "Negative",
              data: array_neg,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              stack: "Stack 1",
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          scales: {
            x: {
              stacked: true,
              max: 100,
              ticks: {
                callback: function (value) {
                  return value + "%";
                },
              },
            },
            y: {
              stacked: true,
              beginAtZero: true,
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Percentage of customer feelings towards each aspect of smartphones",
              font: {
                size: 18,
                family: "Kanit",
              },
              position: "top",
            },
            legend: {
              display: true,
            },
            datalabels: {
              color: "#808080",
              anchor: "center",
              align: "center",
              clamp: true,
              formatter: function (value, context) {
                return value.toFixed(0) + "%";
              },
            },
          },
        },
        plugins: [ChartDataLabels],
      });

      barChartRef.current.chart = barChart;
    }
  }, [selectAspect, aspectsData]);

  useEffect(() => {
    if (barHorizontalChartRef.current) {
      if (barHorizontalChartRef.current.chart) {
        barHorizontalChartRef.current.chart.destroy();
      }

      const barcontext = barHorizontalChartRef.current.getContext("2d");
      let labels = [];
      let array_pos = [];
      let array_neu = [];
      let array_neg = [];

      selectAspect.forEach(element => {
        if (
          aspectsData[element] &&
          aspectsData[element]["aspect_pos"] !== undefined &&
          aspectsData[element]["aspect_neu"] !== undefined &&
          aspectsData[element]["aspect_neg"] !== undefined
        ) {
          let total =
            aspectsData[element]["aspect_pos"] +
            aspectsData[element]["aspect_neu"] +
            aspectsData[element]["aspect_neg"];

          if (total > 0) {
            labels.push(element);
            array_pos.push(aspectsData[element]["aspect_pos"]);
            array_neu.push(aspectsData[element]["aspect_neu"]);
            array_neg.push(aspectsData[element]["aspect_neg"]);
          }
        }
      });

      const barChart = new Chart(barcontext, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Positive",
              data: array_pos,
              backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
            {
              label: "Neutral",
              data: array_neu,
              backgroundColor: "rgba(255, 206, 86, 0.5)",
            },
            {
              label: "Negative",
              data: array_neg,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,

          plugins: {
            title: {
              display: true,
              text: "Count of customer feelings towards each aspect of smartphones",
              font: {
                size: 18,
                family: "Kanit",
              },
              position: "top",
            },
            legend: {
              display: true,
            },
            datalabels: {
              color: "#808080",
              anchor: "end",
              align: "end",
              clamp: true,
              formatter: function (value, context) {
                return value;
              },
            },
          },
        },
        plugins: [ChartDataLabels],
      });

      barHorizontalChartRef.current.chart = barChart;
    }
  }, [selectAspect, aspectsData]);

  return (
    <div className="bg-costom-pbg w-full h-full pb-2">
      <Navbar />
      <div className="container mx-auto mt-8 ">
        <div className="flex flex-wrap -m-3 mb-5">
          <div className="w-full sm:w-1/2 md:w-1/4 p-3">
            {/* <Skeleton isLoaded={statusData} className="  shadow-md rounded-[20px]"> */}
            <div className="bg-custom-blue text-white shadow-md rounded-[20px] p-4 py-6 pb-8 flex justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">{count_all.toLocaleString()}</h3>

                <h6 className="text-lg font-normal text-gray-600">Reviews</h6>
              </div>
              <span className="material-icons text-3xl">mode_comment</span>
            </div>
            {/* </Skeleton> */}
          </div>

          <div className="w-full sm:w-1/2 md:w-1/4 p-3">
            {/* <Skeleton isLoaded={statusData} className="  shadow-md rounded-[20px]"> */}
            <div className="bg-custom-green text-white shadow-md rounded-[20px] p-4 py-6 pb-8 flex justify-between">
              <div>
                <h3 className="text-2xl font-bold">
                  {
                    count_pos.toLocaleString()
                  }
                </h3>
                <h6 className="text-lg font-normal text-gray-600">Positive Reviews</h6>
              </div>
              <span className="material-icons text-3xl">sentiment_satisfied_alt</span>
            </div>
            {/* </Skeleton> */}
          </div>

          <div className="w-full sm:w-1/2 md:w-1/4 p-3">
            {/* <Skeleton isLoaded={statusData} className="  shadow-md rounded-[20px]"> */}
            <div className="bg-custom-yellow text-white shadow-md rounded-[20px] p-4 py-6 pb-8 flex justify-between">
              <div>
                <h3 className="text-2xl font-bold">
                  {

                    count_neu.toLocaleString()
                  }
                </h3>
                <h6 className="text-lg font-normal text-gray-600">Neutral Reviews</h6>
              </div>
              <span className="material-icons text-3xl">sentiment_neutral</span>
            </div>
            {/* </Skeleton> */}
          </div>

          <div className="w-full sm:w-1/2 md:w-1/4 p-3">
            {/* <Skeleton isLoaded={statusData} className="  shadow-md rounded-[20px]"> */}
            <div className="bg-custom-red text-white shadow-md rounded-[20px] p-4 py-6 pb-8 flex justify-between">
              <div>
                <h3 className="text-2xl font-bold">
                  {
                    count_neg.toLocaleString()
                  }
                </h3>
                <h6 className="text-lg font-normal text-gray-600">Negative Reviews</h6>
              </div>
              <span className="material-icons text-3xl">sentiment_very_dissatisfied</span>
            </div>
            {/* </Skeleton> */}
          </div>
        </div>
        <div className="row col-12  mb-5">
          <div className="w-full">
            {/* <Skeleton isLoaded={statusData} className="shadow-md rounded-[20px] h-10%"> */}
            <div className="card border-0  p-4"
              style={{
                boxShadow: "5px 5px 5px 5px rgba(197, 197, 197, 0.2)",
                borderRadius: "20px",
                backgroundColor: "white"
              }}>
              <div className="card-body">
                <div className="flex w-full flex-wrap md:flex-nowrap  mt-1 mb-1 justify-end">
                  <Select
                    label="Brand"
                    selectionMode="multiple"
                    placeholder="Select Brand"
                    selectedKeys={selectBrand}
                    onSelectionChange={setSelectBrand}
                    style={{ width: '250px', height: '50px' }}
                    className="max-w-xs justify-end flex"
                  >
                    {brandName.map((item) => (
                      <SelectItem key={item} value={item} >
                        {item}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div>
                  <canvas ref={chartRef} height="120"></canvas>
                </div>
              </div>
            </div>
            {/* </Skeleton> */}
          </div>
        </div>

        {/* filter */}

        <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mt-5 mb-5 justify-end">
          <div className="rounded-[12px]" style={{ boxShadow: "2px 2px 2px 2px rgba(197, 197, 197, 0.2)", backgroundColor: "white" }}>
            <Autocomplete
              isRequired
              variant="bordered"
              label="Select Brand"
              items={brandName.map(brand => ({ label: brand, value: brand }))}
              selectedKey={selectedBrand}
              onSelectionChange={setSelectedBrand}
              className="max-w-xs"
            >
              {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
            </Autocomplete>
          </div>{/* <Select
            label="Select Brand"
            // value={selectedBrand} 
            selectedKeys={[selectedBrand]}
            onChange={(e) => setSelectedBrand(e.target.value)}
            defaultSelectedKeys={[selectedBrand]}
            className="max-w-xs"
            style={{ boxShadow: "2px 2px 2px 2px rgba(197, 197, 197, 0.2)", backgroundColor: "white" }}
          // onChange={(value) => setSelectedBrand(value)}
          >
            {brandName.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </Select> */}
          <div className="rounded-[12px]" style={{ boxShadow: "2px 2px 2px 2px rgba(197, 197, 197, 0.2)", backgroundColor: "white" }}>
            <Autocomplete
              isRequired
              variant="bordered"
              label="Select Smartphone"
              items={showModel.map(model => ({ label: model, value: model }))}
              selectedKey={selectedModel}
              onSelectionChange={setSelectedModel}
              // disabled={!selectedBrand}
              className="max-w-xs"
            // multiple
            >
              {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
            </Autocomplete>
          </div>


          {/* <Select
            label="Select Model"
            className="max-w-xs "
            style={{ boxShadow: "2px 2px 2px 2px rgba(197, 197, 197, 0.2)", backgroundColor: "white" }}
            color="default"
            selectedKeys={[selectedModel]}
            onChange={handleModelChange}
            // SelectionChange={fetchDataModel}

            defaultSelectedKeys={[defaultSelectModel]}
          >
            {showModel.map((model) =>
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            )}
          </Select> */}
          <div className="rounded-[12px]" style={{ boxShadow: "2px 2px 2px 2px rgba(197, 197, 197, 0.2)", backgroundColor: "white" }}>
            <Autocomplete
              // size="sm"
              // classNames="w-full"
              variant="bordered"
              label="Select Aspect"
              items={
                [
                  { value: 'Camera', label: 'Camera' },
                  { value: 'Battery', label: 'Battery' },
                  { value: 'Screen', label: 'Screen' },
                  { value: 'Performance', label: 'Performance' },
                  { value: 'Price', label: 'Price' },
                ]
              }
              selectedKey={selectedAspectsFilter}
              onSelectionChange={handleSelectAspectSentimentchange}
              className="max-w-xs"

            >
              {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
            </Autocomplete>
          </div>
          <div className="rounded-[12px]" style={{ boxShadow: "2px 2px 2px 2px rgba(197, 197, 197, 0.2)", backgroundColor: "white" }}>
            <Autocomplete
              // size="sm"
              // classNames="w-full"
              variant="bordered"
              label="Select Sentiment"
              items={[
                { value: 'pos', label: 'Positive' },
                { value: 'neg', label: 'Negative' },
                { value: 'neu', label: 'Neutral' }
              ]}
              selectedKey={selectedSentimentsFilter}
              onSelectionChange={handleSelectSentimentchange}
              className="max-w-xs"
            // style={{ boxShadow: "2px 2px 2px 2px rgba(197, 197, 197, 0.2)", backgroundColor: "white" }}
            >
              {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
            </Autocomplete>
          </div>
        </div>

        {/* กราฟด้านล่าง */}
        {/* <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mt-5 mb-5 justify-end">
          <Autocomplete
            size="sm"
            classNames="w-full"
            variant="bordered"
            label="Select Aspect"
            items={
              [
                { value: 'Camera', label: 'Camera' },
                { value: 'Battery', label: 'Battery' },
                { value: 'Screen', label: 'Screen' },
                { value: 'Performance', label: 'Performance' },
                { value: 'Price', label: 'Price' },
              ]
            }
            selectedKey={selectedAspectsFilter}
            onSelectionChange={handleSelectAspectSentimentchange}
            className="max-w-xs justify-end flex"
            style={{ boxShadow: "2px 2px 2px 2px rgba(197, 197, 197, 0.2)", backgroundColor: "white" }}
          >
            {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
          </Autocomplete>
          <Autocomplete
            size="sm"
            classNames="w-full"
            variant="bordered"
            label="Select Sentiment"
            items={[
              { value: 'pos', label: 'Positive' },
              { value: 'neg', label: 'Negative' },
              { value: 'neu', label: 'Neutral' }
            ]}
            selectedKey={selectedSentimentsFilter}
            onSelectionChange={handleSelectSentimentchange}
            className="max-w-xs justify-end flex"
          >
            {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
          </Autocomplete> */}

        {/* </div> */}
        <div className="grid grid-cols-2 gap-2 mt-5">

          <div className="bg-white p-4 shadow-md rounded-[20px]" style={{ boxShadow: "5px 5px 5px 5px rgba(197, 197, 197, 0.2)" }}
          >
            <canvas ref={donutChartRef} className="bg-white p-4 " ></canvas>
          </div>

          <div className="bg-white py-4 px-5 shadow-md rounded-[20px]" style={{
            boxShadow: "5px 5px 5px 5px rgba(197, 197, 197, 0.2)"
          }} >
            <canvas ref={barChartRef} ></canvas>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-5 mb-5">
          <div className=" overflow-y-auto shadow-md  bg-white" style={{ borderRadius: "20px", maxHeight: "50vh", boxShadow: "5px 5px 5px 5px rgba(197, 197, 197, 0.2)" }}>
            <Table className="md:w-full md:h-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
              <TableHeader className="sticky top-0 bg-white" >
                <TableColumn></TableColumn>
                <TableColumn className="text-base font-sans-semibold" >
                  {selectedAspectsFilter ? `${selectedAspectsFilter} Review` : "Overall Review"}
                </TableColumn>
                <TableColumn className="text-base font-sans-semibold" colSpan="3">Model</TableColumn>
                <TableColumn className="text-base font-sans-semibold"  >Sentiment</TableColumn>
              </TableHeader>
              <TableBody className="table-body text-base" >
                {selectedAspectsFilter !== "" ? (
                  filterReviews().map((review, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{review.textDisplay_aspect}</TableCell>
                      <TableCell colSpan="3">{review.smartphoneName}</TableCell>
                      <TableCell className="text-center">
                        <span style={{
                          borderRadius: '1px', padding: '3px', backgroundColor: getBackgroundColor(review.Aspect_Sentiment_Label), color: getTextColor(review.Aspect_Sentiment_Label)
                        }}>{getSentimentText(review.Aspect_Sentiment_Label)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  filterReviews().map((review, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{review.textDisplay}</TableCell>
                      <TableCell colSpan="3">{review.smartphoneName}</TableCell>
                      <TableCell className="text-center">
                        <span style={{
                          borderRadius: '1px', padding: '3px', backgroundColor: getBackgroundColor(review.Sentiment_Label), color: getTextColor(review.Sentiment_Label)
                        }}>{getSentimentText(review.Sentiment_Label)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="bg-white px-5 py-7  shadow-md rounded-[20px]" style={{
            boxShadow: "5px 5px 5px 5px rgba(197, 197, 197, 0.2)"
          }} >
            <canvas ref={barHorizontalChartRef} ></canvas>
          </div>
        </div >
      </div >
    </div>
  )

}

