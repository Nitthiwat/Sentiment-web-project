// import React from 'react'
import Navbar from "@/components/navbar";
import React, { useEffect, useState } from 'react';
import { Autocomplete, AutocompleteItem, select } from "@nextui-org/react";
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Checkbox } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@nextui-org/react";
import axios from 'axios';

export default function compare() {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const [smartphoneModelsSm1, setSmartphoneModelsSm1] = useState([]);
  const [smartphoneModelsSm2, setSmartphoneModelsSm2] = useState([]);
  const [smartphoneModelsSm3, setSmartphoneModelsSm3] = useState([]);

  const [selectedBrandSm1, setSelectedBrandSm1] = useState('');
  const [selectedModelSm1, setSelectedModelSm1] = useState('');
  const [selectedBrandSm2, setSelectedBrandSm2] = useState('');
  const [selectedModelSm2, setSelectedModelSm2] = useState('');
  const [selectedBrandSm3, setSelectedBrandSm3] = useState('');
  const [selectedModelSm3, setSelectedModelSm3] = useState('');

  const [smartphoneInfoSm1, setsmartphoneInfoSm1] = useState({});
  const [smartphoneInfoSm2, setsmartphoneInfoSm2] = useState({});
  const [smartphoneInfoSm3, setsmartphoneInfoSm3] = useState({});

  const [reviews, setReviews] = useState([]);

  const [showNeutralData, setShowNeutralData] = useState(true);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [selectedSentimentsFilter, setSelectedSentimentsFilter] = useState(''); // Initial value set to "Positive"
  const [selectedAspectsFilter, setselectedAspectsFilter] = useState('');
  const [selectedModelFilter, setselectedModelFilter] = useState('');

  const brandName = ["Apple", "Samsung", "OPPO", "vivo", "Huawei", "Xiaomi"]

  // Helper function to determine background color based on sentiment
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
  // Helper function to determine text color based on sentiment
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
  // Helper function to determine sentiment text
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

  const [overviewSm1, setOverviewSm1] = useState({
    pos: 0,
    neu: 0,
    neg: 0
  });

  const [aspectSm1, setAspectSm1] = useState({
    camera: {
      pos: 0,
      neu: 0,
      neg: 0
    },
    battery: {
      pos: 0,
      neu: 0,
      neg: 0
    },
    screen: {
      pos: 0,
      neu: 0,
      neg: 0
    },
    performance: {
      pos: 0,
      neu: 0,
      neg: 0
    },
    price: {
      pos: 0,
      neu: 0,
      neg: 0
    }
  });

  const [overviewSm2, setOverviewSm2] = useState({
    pos: 0,
    neu: 0,
    neg: 0
  });

  const [aspectSm2, setAspectSm2] = useState({
    camera: {
      pos: 0,
      neu: 0,
      neg: 0
    },
    battery: {
      pos: 0,
      neu: 0,
      neg: 0
    },
    screen: {
      pos: 0,
      neu: 0,
      neg: 0
    },
    performance: {
      pos: 0,
      neu: 0,
      neg: 0
    },
    price: {
      pos: 0,
      neu: 0,
      neg: 0
    }
  });

  const [overviewSm3, setOverviewSm3] = useState({
    pos: 0,
    neu: 0,
    neg: 0
  });

  const [aspectSm3, setAspectSm3] = useState({
    camera: {
      pos: 0,
      neu: 0,
      neg: 0
    },
    battery: {
      pos: 0,
      neu: 0,
      neg: 0
    },
    screen: {
      pos: 0,
      neu: 0,
      neg: 0
    },
    performance: {
      pos: 0,
      neu: 0,
      neg: 0
    },
    price: {
      pos: 0,
      neu: 0,
      neg: 0
    }
  });

  const columnsInfoData = [
    {
      key: "info",
      label: "Information",
    },
    {
      key: "Sm1",
      label: selectedModelSm1,
    },
    {
      key: "Sm2",
      label: selectedModelSm2,
    },
    // Check if selectedModelSm3 is not null or undefined
    selectedModelSm3 && {
      key: "Sm3",
      label: selectedModelSm3,
    },
  ].filter(Boolean);

  const rowsInfoData = [
    {
      info: "Display",
      Sm1: smartphoneInfoSm1?.display,
      Sm2: smartphoneInfoSm2?.display,
      Sm3: smartphoneInfoSm3?.display,
    },
    {
      info: "Camera",
      Sm1: smartphoneInfoSm1?.camera,
      Sm2: smartphoneInfoSm2?.camera,
      Sm3: smartphoneInfoSm3?.camera,
    },
    {
      info: "CPU",
      Sm1: smartphoneInfoSm1?.cpu,
      Sm2: smartphoneInfoSm2?.cpu,
      Sm3: smartphoneInfoSm3?.cpu,
    },
    {
      info: "Operating System",
      Sm1: smartphoneInfoSm1?.os,
      Sm2: smartphoneInfoSm2?.os,
      Sm3: smartphoneInfoSm3?.os,
    },
    {
      info: "Memory",
      Sm1: smartphoneInfoSm1?.memory,
      Sm2: smartphoneInfoSm2?.memory,
      Sm3: smartphoneInfoSm3?.memory,
    },
    {
      info: "Battery",
      Sm1: smartphoneInfoSm1?.battery,
      Sm2: smartphoneInfoSm2?.battery,
      Sm3: smartphoneInfoSm3?.battery,
    },
  ];

  const handleCheckboxChangeNeutralData = () => {
    setShowNeutralData(!showNeutralData); // Toggle the state
  };

  const handleSelectSentimentchange = (newValue) => {
    setSelectedSentimentsFilter(newValue ?? ''); // ถ้า newValue เป็น null หรือ undefined ให้กำหนดค่าเป็น ''
  };

  const handleSelectAspectSentimentchange = (newValue) => {
    setselectedAspectsFilter(newValue ?? ''); // ถ้า newValue เป็น null หรือ undefined ให้กำหนดค่าเป็น ''
  };

  const handleSelectModelSentimentchange = (newValue) => {
    setselectedModelFilter(newValue ?? ''); // ถ้า newValue เป็น null หรือ undefined ให้กำหนดค่าเป็น ''
  };

  const filterReviews = () => {
    if (!showNeutralData && selectedAspectsFilter !== '' && selectedSentimentsFilter !== '' && selectedModelFilter !== '') {
      return reviews.filter(review => review.Aspect_Sentiment_Label !== 'neu' && review.aspects === selectedAspectsFilter && review.Aspect_Sentiment_Label === selectedSentimentsFilter && review.smartphoneName === selectedModelFilter);

    } else if (!showNeutralData && selectedAspectsFilter !== '' && selectedModelFilter !== '') {
      return reviews.filter(review => review.Aspect_Sentiment_Label !== 'neu' && review.aspects === selectedAspectsFilter && review.smartphoneName === selectedModelFilter);

    } else if (selectedAspectsFilter !== '' && selectedSentimentsFilter !== '' && selectedModelFilter !== '') {
      return reviews.filter(review => review.aspects === selectedAspectsFilter && review.Aspect_Sentiment_Label === selectedSentimentsFilter && review.smartphoneName === selectedModelFilter);

    } else if (!showNeutralData && selectedAspectsFilter !== '' && selectedSentimentsFilter !== '') {
      return reviews.filter(review => review.Aspect_Sentiment_Label !== 'neu' && review.aspects === selectedAspectsFilter && review.Aspect_Sentiment_Label === selectedSentimentsFilter);

    } else if (!showNeutralData && selectedSentimentsFilter !== '' && selectedModelFilter !== '') {
      return reviews.filter(review => review.Sentiment_Label !== 'neu' && review.Sentiment_Label === selectedSentimentsFilter && review.smartphoneName === selectedModelFilter);

    } else if (selectedAspectsFilter !== '' && selectedModelFilter !== '') {
      return reviews.filter(review => review.aspects === selectedAspectsFilter && review.smartphoneName === selectedModelFilter);

    } else if (!showNeutralData && selectedAspectsFilter !== '') {
      return reviews.filter(review => review.Aspect_Sentiment_Label !== 'neu' && review.aspects === selectedAspectsFilter);

    } else if (selectedAspectsFilter !== '' && selectedSentimentsFilter !== '') {
      return reviews.filter(review => review.aspects === selectedAspectsFilter && review.Aspect_Sentiment_Label === selectedSentimentsFilter);

    } else if (selectedSentimentsFilter !== '' && selectedModelFilter !== '') {
      return reviews.filter(review => review.Sentiment_Label === selectedSentimentsFilter && review.smartphoneName === selectedModelFilter);
    }

    else if (!showNeutralData && selectedModelFilter !== '') {
      return reviews.filter(review => review.Sentiment_Label !== "neu" && review.smartphoneName === selectedModelFilter);
    }

    else if (!showNeutralData && selectedSentimentsFilter !== '') {
      return reviews.filter(review => review.Sentiment_Label !== 'neu' && review.Sentiment_Label === selectedSentimentsFilter);
    }

    else if (!showNeutralData) {
      return reviews.filter(review => review.Sentiment_Label !== "neu");
    }

    else if (selectedModelFilter !== '') {
      return reviews.filter(review => review.smartphoneName === selectedModelFilter);
    }

    else if (selectedSentimentsFilter !== '') {
      return reviews.filter(review => review.Sentiment_Label === selectedSentimentsFilter);
    }

    else {
      return reviews;
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoaded(true);
        const selectedSmartphones = [selectedModelSm1, selectedModelSm2, selectedModelSm3].filter(model => model);

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
  }, [selectedModelSm1, selectedModelSm2, selectedModelSm3, selectedAspectsFilter]);

  useEffect(() => {
    const fetchSmartphoneName = async (selectedBrand, setSmartphoneModels) => {
      if (selectedBrand) {
        setIsLoaded(true);
        try {
          const response = await axios.get(`/api/compare_smartphoneInfo?brandName=${encodeURIComponent(selectedBrand)}`);
          console.log('Fetched data for', selectedBrand, response.data); // Check fetched data
          setSmartphoneModels(response.data); // Update the state variable with fetched data
          // console.log('State updated for', selectedBrand, response.data); // Check state variable update
        } catch (error) {
          console.error('Error fetching smartphone review data:', error);
        } finally {
          setIsLoaded(false);
        }
      }
    };

    if (selectedBrandSm1) {
      fetchSmartphoneName(selectedBrandSm1, setSmartphoneModelsSm1)
    }

    if (selectedBrandSm2) {
      fetchSmartphoneName(selectedBrandSm2, setSmartphoneModelsSm2)
    }

    if (selectedBrandSm3) {
      fetchSmartphoneName(selectedBrandSm3, setSmartphoneModelsSm3)
    }
  }, [selectedBrandSm1, selectedBrandSm2, selectedBrandSm3]);

  useEffect(() => {
    const fetchSmartphoneInfo = async (smartphoneName) => {
      if (smartphoneName) {
        try {
          setIsLoaded(true);
          const response = await axios.get(`/api/compare_smartphoneInfo?smartphone=${encodeURIComponent(smartphoneName)}`);
          console.log('Fetched data for Information', smartphoneName, response.data); // Check fetched data
          if (smartphoneName === selectedModelSm1) {
            setsmartphoneInfoSm1(response.data[0].spec);
          } else if (smartphoneName === selectedModelSm2) {
            setsmartphoneInfoSm2(response.data[0].spec);
          } else if (smartphoneName === selectedModelSm3) {
            setsmartphoneInfoSm3(response.data[0].spec);
          }
        } catch (error) {
          console.error('Error fetching smartphone review data:', error);
        } finally {
          setIsLoaded(false);
        }
      }
    };

    if (selectedModelSm1 && selectedModelSm2) {
      if (selectedModelSm3) {
        fetchSmartphoneInfo(selectedModelSm3)
      } else {
        fetchSmartphoneInfo(selectedModelSm1)
        fetchSmartphoneInfo(selectedModelSm2)
      }
    }

  }, [selectedModelSm1, selectedModelSm2, selectedModelSm3]);

  useEffect(() => {
    const fetchSmartphoneSentimentData = async (smartphoneName, setOverview, setAspect) => {
      try {
        setIsLoaded(true);
        const response = await axios.get(`/api/compare_smartphoneSentiment?smartphone=${encodeURIComponent(smartphoneName)}`);
        // console.log("Response:", response); // Logging the response for debugging

        const data = response.data; // Assuming the response is already in JSON format

        const overviewData = data[smartphoneName]?.OverallSentiment || {};

        setOverview({
          pos: overviewData.count_pos || 0,
          neu: overviewData.count_neu || 0,
          neg: overviewData.count_neg || 0,
        });

        const aspectData = data[smartphoneName]?.Aspect || {};

        setAspect({
          camera: {
            pos: aspectData.Camera ? aspectData.Camera.count_pos || 0 : 0,
            neu: aspectData.Camera ? aspectData.Camera.count_neu || 0 : 0,
            neg: aspectData.Camera ? aspectData.Camera.count_neg || 0 : 0
          },
          battery: {
            pos: aspectData.Battery ? aspectData.Battery.count_pos || 0 : 0,
            neu: aspectData.Battery ? aspectData.Battery.count_neu || 0 : 0,
            neg: aspectData.Battery ? aspectData.Battery.count_neg || 0 : 0
          },
          screen: {
            pos: aspectData.Screen ? aspectData.Screen.count_pos || 0 : 0,
            neu: aspectData.Screen ? aspectData.Screen.count_neu || 0 : 0,
            neg: aspectData.Screen ? aspectData.Screen.count_neg || 0 : 0
          },
          performance: {
            pos: aspectData.Performance ? aspectData.Performance.count_pos || 0 : 0,
            neu: aspectData.Performance ? aspectData.Performance.count_neu || 0 : 0,
            neg: aspectData.Performance ? aspectData.Performance.count_neg || 0 : 0
          },
          price: {
            pos: aspectData.Price ? aspectData.Price.count_pos || 0 : 0,
            neu: aspectData.Price ? aspectData.Price.count_neu || 0 : 0,
            neg: aspectData.Price ? aspectData.Price.count_neg || 0 : 0
          }
        });
        console.log("Fetch Sentiment data", smartphoneName)
      } catch (error) {
        console.error(`Error fetching smartphones for ${smartphoneName}:`, error);
      } finally {
        setIsLoaded(false);
      }
    };

    if (selectedModelSm1 && selectedModelSm2) {
      if (selectedModelSm3) {
        fetchSmartphoneSentimentData(selectedModelSm3, setOverviewSm3, setAspectSm3);
      } else {
        fetchSmartphoneSentimentData(selectedModelSm1, setOverviewSm1, setAspectSm1);
        fetchSmartphoneSentimentData(selectedModelSm2, setOverviewSm2, setAspectSm2);
      }
    }

  }, [selectedModelSm1, selectedModelSm2, selectedModelSm3]);

  ////////////////////////// Chart ////////////////////////

  useEffect(() => {
    const rdChartElement = document.getElementById('RadarChart');
    if (rdChartElement) {
      rdChartElement.width = rdChartElement.parentElement.offsetWidth;
      rdChartElement.height = rdChartElement.parentElement.offsetHeight;

      const calculateTotalScore = (aspectScores, sentiment) => {
        return Object.values(aspectScores).reduce((total, aspectItem) => {
          if (sentiment === 'neg') {
            return total + aspectItem.neg;
          } else if (sentiment === 'neu') {
            return total + aspectItem.neu;
          } else {
            return total + aspectItem.pos;
          }
        }, 0);
      };

      const totalScoreSm1 = calculateTotalScore(aspectSm1, selectedSentimentsFilter);
      const totalScoreSm2 = calculateTotalScore(aspectSm2, selectedSentimentsFilter);
      const totalScoreSm3 = calculateTotalScore(aspectSm3, selectedSentimentsFilter);
      let datasets = [];

      if (selectedSentimentsFilter === 'neu') {
        datasets = [{
          label: selectedModelSm1,
          data: [
            (aspectSm1.camera.neu / totalScoreSm1) * 100,
            (aspectSm1.battery.neu / totalScoreSm1) * 100,
            (aspectSm1.screen.neu / totalScoreSm1) * 100,
            (aspectSm1.performance.neu / totalScoreSm1) * 100,
            (aspectSm1.price.neu / totalScoreSm1) * 100
          ],
          backgroundColor: 'rgb(116, 105, 182, 0.2)',
          borderColor: 'rgb(116, 105, 182)',
        },
        {
          label: selectedModelSm2,
          data: [
            (aspectSm2.camera.neu / totalScoreSm2) * 100,
            (aspectSm2.battery.neu / totalScoreSm2) * 100,
            (aspectSm2.screen.neu / totalScoreSm2) * 100,
            (aspectSm2.performance.neu / totalScoreSm2) * 100,
            (aspectSm2.price.neu / totalScoreSm2) * 100
          ],
          backgroundColor: 'rgb(211, 118, 118, 0.2)',
          borderColor: 'rgb(211, 118, 118)',
        }];

        if (selectedModelSm3) {
          datasets.push({
            label: selectedModelSm3,
            data: [
              (aspectSm3.camera.neu / totalScoreSm3) * 100,
              (aspectSm3.battery.neu / totalScoreSm3) * 100,
              (aspectSm3.screen.neu / totalScoreSm3) * 100,
              (aspectSm3.performance.neu / totalScoreSm3) * 100,
              (aspectSm3.price.neu / totalScoreSm3) * 100
            ],
            backgroundColor: 'rgb(45, 149, 150, 0.2)',
            borderColor: 'rgb(45, 149, 150)'
          });
        }
      } else if (selectedSentimentsFilter === 'neg') {
        datasets = [{
          label: selectedModelSm1,
          data: [
            (aspectSm1.camera.neg / totalScoreSm1) * 100,
            (aspectSm1.battery.neg / totalScoreSm1) * 100,
            (aspectSm1.screen.neg / totalScoreSm1) * 100,
            (aspectSm1.performance.neg / totalScoreSm1) * 100,
            (aspectSm1.price.neg / totalScoreSm1) * 100
          ],
          backgroundColor: 'rgb(116, 105, 182, 0.2)',
          borderColor: 'rgb(116, 105, 182)'
        },
        {
          label: selectedModelSm2,
          data: [
            (aspectSm2.camera.neg / totalScoreSm2) * 100,
            (aspectSm2.battery.neg / totalScoreSm2) * 100,
            (aspectSm2.screen.neg / totalScoreSm2) * 100,
            (aspectSm2.performance.neg / totalScoreSm2) * 100,
            (aspectSm2.price.neg / totalScoreSm2) * 100
          ],
          backgroundColor: 'rgb(211, 118, 118, 0.2)',
          borderColor: 'rgb(211, 118, 118)'
        }];

        if (selectedModelSm3) {
          datasets.push({
            label: selectedModelSm3,
            data: [
              (aspectSm3.camera.neg / totalScoreSm3) * 100,
              (aspectSm3.battery.neg / totalScoreSm3) * 100,
              (aspectSm3.screen.neg / totalScoreSm3) * 100,
              (aspectSm3.performance.neg / totalScoreSm3) * 100,
              (aspectSm3.price.neg / totalScoreSm3) * 100
            ],
            backgroundColor: 'rgb(45, 149, 150, 0.2)',
            borderColor: 'rgb(45, 149, 150)'
          });
        }
      } else {
        datasets = [{
          label: selectedModelSm1,
          data: [
            (aspectSm1.camera.pos / totalScoreSm1) * 100,
            (aspectSm1.battery.pos / totalScoreSm1) * 100,
            (aspectSm1.screen.pos / totalScoreSm1) * 100,
            (aspectSm1.performance.pos / totalScoreSm1) * 100,
            (aspectSm1.price.pos / totalScoreSm1) * 100
          ],
          backgroundColor: 'rgb(116, 105, 182, 0.2)',
          borderColor: 'rgb(116, 105, 182)'
        },
        {
          label: selectedModelSm2,
          data: [
            (aspectSm2.camera.pos / totalScoreSm2) * 100,
            (aspectSm2.battery.pos / totalScoreSm2) * 100,
            (aspectSm2.screen.pos / totalScoreSm2) * 100,
            (aspectSm2.performance.pos / totalScoreSm2) * 100,
            (aspectSm2.price.pos / totalScoreSm2) * 100
          ],
          backgroundColor: 'rgb(211, 118, 118, 0.2)',
          borderColor: 'rgb(211, 118, 118)'
        }];

        if (selectedModelSm3) {
          datasets.push({
            label: selectedModelSm3,
            data: [
              (aspectSm3.camera.pos / totalScoreSm3) * 100,
              (aspectSm3.battery.pos / totalScoreSm3) * 100,
              (aspectSm3.screen.pos / totalScoreSm3) * 100,
              (aspectSm3.performance.pos / totalScoreSm3) * 100,
              (aspectSm3.price.pos / totalScoreSm3) * 100
            ],
            backgroundColor: 'rgb(45, 149, 150, 0.2)',
            borderColor: 'rgb(45, 149, 150)'
          });
        }
      }

      let rdChartData = {
        labels: ["Camera", "Battery", "Screen", "Performance", "Price"],
        datasets: datasets
      };

      const rdChartContext = rdChartElement.getContext('2d');
      // Create the radar chart
      let RadarChart = new Chart(rdChartContext, {
        type: 'radar',
        data: rdChartData,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: `Score of All Aspect (${selectedSentimentsFilter === 'neu' ? 'Neutral' : selectedSentimentsFilter === 'neg' ? 'Negative' : 'Positive'})`,
              font: {
                size: 12
              }
            }
          },
          elements: {
            point: {
              radius: 0, // Set the radius of the data points
              borderWidth: 2 // Set the border width of the data points
            },
            line: {
              borderWidth: 1
            }
          },
          scales: {
            r: {
              pointLabels: {
                font: {
                  size: 11 // Adjust the font size of the labels
                }
              },
            }
          }
        },
      });

      // Cleanup function to destroy the chart instance
      return () => {
        RadarChart.destroy();
      };
    }
  }, [aspectSm1, selectedModelSm1, aspectSm2, selectedModelSm2, aspectSm3, selectedModelSm3, selectedSentimentsFilter]);


  useEffect(() => {
    let totalOverviewSm1, totalOverviewSm2, totalOverviewSm3;

    if (showNeutralData) {
      totalOverviewSm1 = overviewSm1.pos + overviewSm1.neu + overviewSm1.neg;
      totalOverviewSm2 = overviewSm2.pos + overviewSm2.neu + overviewSm2.neg;
      totalOverviewSm3 = overviewSm3.pos + overviewSm3.neu + overviewSm3.neg;
    } else {
      totalOverviewSm1 = overviewSm1.pos + overviewSm1.neg;
      totalOverviewSm2 = overviewSm2.pos + overviewSm2.neg;
      totalOverviewSm3 = overviewSm3.pos + overviewSm3.neg;
    }

    // Convert counts to percentages
    const positivePercentageSm1 = (overviewSm1.pos / totalOverviewSm1) * 100;
    const neutralPercentageSm1 = (overviewSm1.neu / totalOverviewSm1) * 100;
    const negativePercentageSm1 = (overviewSm1.neg / totalOverviewSm1) * 100;

    const positivePercentageSm2 = (overviewSm2.pos / totalOverviewSm2) * 100;
    const neutralPercentageSm2 = (overviewSm2.neu / totalOverviewSm2) * 100;
    const negativePercentageSm2 = (overviewSm2.neg / totalOverviewSm2) * 100;

    let labels = [selectedModelSm1, selectedModelSm2];
    let positiveData = [positivePercentageSm1, positivePercentageSm2];
    let neutralData = [neutralPercentageSm1, neutralPercentageSm2];
    let negativeData = [negativePercentageSm1, negativePercentageSm2];

    if (selectedModelSm3) {
      labels.push(selectedModelSm3);
      const positivePercentageSm3 = (overviewSm3.pos / totalOverviewSm3) * 100;
      const neutralPercentageSm3 = (overviewSm3.neu / totalOverviewSm3) * 100;
      const negativePercentageSm3 = (overviewSm3.neg / totalOverviewSm3) * 100;

      positiveData.push(positivePercentageSm3);
      neutralData.push(neutralPercentageSm3);
      negativeData.push(negativePercentageSm3);
    }

    let datasets = [{
      label: 'Positive',
      data: positiveData,
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      stack: 'Stack 1'
    }, {
      label: 'Negative',
      data: negativeData,
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      stack: 'Stack 1'
    }];

    if (showNeutralData) {
      datasets.splice(1, 0, { // Insert Neutral data as the second dataset
        label: 'Neutral',
        data: neutralData,
        backgroundColor: 'rgba(255, 205, 86, 0.5)',
        stack: 'Stack 1'
      });
    }

    const stBarChartElement = document.getElementById('fullStackBarChart');
    if (stBarChartElement) {
      stBarChartElement.width = stBarChartElement.parentElement.offsetWidth;
      stBarChartElement.height = stBarChartElement.parentElement.offsetHeight;
      const stBarChartContext = stBarChartElement.getContext('2d');

      let stackBarChart = new Chart(stBarChartContext, {
        type: 'bar',
        plugins: [ChartDataLabels],
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Percentage of Overall Sentiment',
              fontSize: 12
            },
            legend: {
              display: true,
              labels: {
                font: {
                  size: 12
                }
              }
            },
            datalabels: {
              color: '#000000',
              anchor: 'center',
              align: 'center',
              clamp: true,
              formatter: function (value, context) {
                if (value > 0) {
                  return value.toFixed(0) + '%';
                } else {
                  return '';
                }
              }
            }
          },
          indexAxis: 'y',
          responsive: true,
          scales: {
            x: {
              stacked: true,
              ticks: {
                callback: function (value) {
                  return value + '%';
                }
              }
            },
            y: {
              stacked: true,
              max: 100,
              beginAtZero: true,
              ticks: {
                font: {
                  size: 11
                }
              }
            }
          }
        }

      });
      return () => {
        stackBarChart.destroy();
      };
    }
  }, [overviewSm1, overviewSm2, overviewSm3, selectedModelSm1, selectedModelSm2, selectedModelSm3, showNeutralData]);


  useEffect(() => {
    const stBarChartAspectElement = document.getElementById('fullStackBarChartAspect');
    if (stBarChartAspectElement) {
      stBarChartAspectElement.width = stBarChartAspectElement.parentElement.offsetWidth;
      stBarChartAspectElement.height = stBarChartAspectElement.parentElement.offsetHeight;
      const stBarChartAspectContext = stBarChartAspectElement.getContext('2d');

      const sentimentLabels = {
        'pos': 'Positive',
        'neg': 'Negative',
        'neu': 'Neutral'
      };

      let datasets = [];

      if (selectedSentimentsFilter === 'neu') { // Filter positive sentiments
        datasets = [{
          label: selectedModelSm1,
          data: [aspectSm1.camera.neu, aspectSm1.battery.neu, aspectSm1.screen.neu, aspectSm1.performance.neu, aspectSm1.price.neu],
          backgroundColor: '#FF6600'
        }, {
          label: selectedModelSm2,
          data: [aspectSm2.camera.neu, aspectSm2.battery.neu, aspectSm2.screen.neu, aspectSm2.performance.neu, aspectSm2.price.neu],
          backgroundColor: '#FFB669'
        }];

        // Add dataset for selectedModelSm3 if it is selected
        if (selectedModelSm3) {
          datasets.push({
            label: selectedModelSm3,
            data: [aspectSm3.camera.neu, aspectSm3.battery.neu, aspectSm3.screen.neu, aspectSm3.performance.neu, aspectSm3.price.neu],
            backgroundColor: '#FFE3C7'
          });
        }
      } else if (selectedSentimentsFilter === 'neg') { // Filter negative sentiments
        datasets = [{
          label: selectedModelSm1,
          data: [aspectSm1.camera.neg, aspectSm1.battery.neg, aspectSm1.screen.neg, aspectSm1.performance.neg, aspectSm1.price.neg],
          backgroundColor: '#a70000'
        }, {
          label: selectedModelSm2,
          data: [aspectSm2.camera.neg, aspectSm2.battery.neg, aspectSm2.screen.neg, aspectSm2.performance.neg, aspectSm2.price.neg],
          backgroundColor: '#ff5252'
        }];

        // Add dataset for selectedModelSm3 if it is selected
        if (selectedModelSm3) {
          datasets.push({
            label: selectedModelSm3,
            data: [aspectSm3.camera.neg, aspectSm3.battery.neg, aspectSm3.screen.neg, aspectSm3.performance.neg, aspectSm3.price.neg],
            backgroundColor: '#ffbaba'
          });
        }
      } else {
        datasets = [{
          label: selectedModelSm1,
          data: [aspectSm1.camera.pos, aspectSm1.battery.pos, aspectSm1.screen.pos, aspectSm1.performance.pos, aspectSm1.price.pos],
          backgroundColor: '#6ECCAF'
        }, {
          label: selectedModelSm2,
          data: [aspectSm2.camera.pos, aspectSm2.battery.pos, aspectSm2.screen.pos, aspectSm2.performance.pos, aspectSm2.price.pos],
          backgroundColor: '#29ADB2'
        }];

        // Add dataset for selectedModelSm3 if it is selected
        if (selectedModelSm3) {
          datasets.push({
            label: selectedModelSm3,
            data: [aspectSm3.camera.pos, aspectSm3.battery.pos, aspectSm3.screen.pos, aspectSm3.performance.pos, aspectSm3.price.pos],
            backgroundColor: '#1B6B93'
          });
        }
      }

      let stackBarChartAspect = new Chart(stBarChartAspectContext, {
        type: 'bar',
        plugins: [ChartDataLabels],
        data: {
          labels: ["Camera", "Battery", "Screen", "Performance", "Price"],
          datasets: datasets
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: `Count of All Aspect (${sentimentLabels[selectedSentimentsFilter] || 'Positive'})`,
              size: 12
            },
            legend: {
              display: true,
              size: 12
            },
            datalabels: {
              anchor: 'end',
              align: 'end',
              clamp: true,
              font: {
                size: 10
              },
              formatter: (value, context) => {
                return value;
              }
            }
          },
          responsive: true,
          scales: {
            x: {
              ticks: {
                font: {
                  size: 11
                }
              }
            },
            y: {
              beginAtZero: true,
            }
          }
        }
      });

      return () => {
        stackBarChartAspect.destroy();
      };
    }
  }, [aspectSm1, aspectSm2, aspectSm3, selectedModelSm1, selectedModelSm2, selectedModelSm3, selectedSentimentsFilter]);



  useEffect(() => {
    const ovaBarChartElement = document.getElementById('ovaBarChart');
    if (ovaBarChartElement) {
      ovaBarChartElement.width = ovaBarChartElement.parentElement.offsetWidth;
      ovaBarChartElement.height = ovaBarChartElement.parentElement.offsetHeight;
      const ovaBarChartContext = ovaBarChartElement.getContext('2d');

      let labels = [selectedModelSm1, selectedModelSm2];

      let datasets = [{
        label: 'Positive',
        data: [overviewSm1.pos, overviewSm2.pos],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }, {
        label: 'Negative',
        data: [overviewSm1.neg, overviewSm2.neg],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }];

      if (showNeutralData) {
        datasets.splice(1, 0, { // Insert Neutral data as the second dataset
          label: 'Neutral',
          data: [overviewSm1.neu, overviewSm2.neu],
          backgroundColor: 'rgba(255, 205, 86, 0.5)',
        });
      }

      if (selectedModelSm3) {
        labels.push(selectedModelSm3);
        datasets[0].data.push(overviewSm3.pos);
        if (showNeutralData) {
          datasets[1].data.push(overviewSm3.neu);
          datasets[2].data.push(overviewSm3.neg);
        } else {
          datasets[1].data.push(overviewSm3.neg);
        }
      }

      const checkData = (overview, selectedModel) => {
        if (overview.pos === 0 || overview.neg === 0 || overview.neu === 0) {
          setAlertMessage(`${selectedModel}`);
          return true;
        }
        return false;
      };

      if (checkData(overviewSm1, selectedModelSm1) || checkData(overviewSm2, selectedModelSm2) || (selectedModelSm3 && checkData(overviewSm3, selectedModelSm3))) {
        setShowAlert(true);
      } else {
        setShowAlert(false);
      }

      let overallBarChart = new Chart(ovaBarChartContext, {
        type: 'bar',
        plugins: [ChartDataLabels],
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Count of Overall Sentiment',
              size: 12
            },
            legend: {
              display: true,
              label: {
                font: {
                  size: 12
                }
              }
            },
            datalabels: {
              anchor: 'end',
              align: 'end',
              clamp: true,
              font: {
                size: 10
              },
              formatter: (value, context) => {
                return value; // Return the value to display on the chart
              }
            }
          },
          responsive: true,
          scales: {
            x: {
              grid: {
                offset: true
              },
              ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 0
              }
            },
            y: {
              max: 500
            }
          }
        }
      });
      return () => {
        overallBarChart.destroy();
      };
    }
  }, [overviewSm1, overviewSm2, overviewSm3, selectedModelSm3, showNeutralData]);

  return (
    <>
      {/* <style jsx global>{`
        body {
          background-color: #f0f0f0;
        }
      `}</style> */}
      <div className="bg-costom-pbg w-full h-full pb-2">
        <Navbar />
        <div className="md:container md:mx-auto mt-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="grid grid-cols-5 gap-2">
              <div id="SelectBrandElm1" className="col-span-2 bg-white rounded-[12px]">
                <Autocomplete
                  isRequired
                  variant="bordered"
                  label="Select Brand"
                  items={brandName.map(brand => ({ label: brand, value: brand }))}
                  selectedKey={selectedBrandSm1}
                  onSelectionChange={setSelectedBrandSm1}
                  className="max-w-xs"
                >
                  {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                </Autocomplete>
              </div>

              {/* Select Smartphones */}
              <div id="SelectSmartphoneElm1" className="col-span-3 bg-white rounded-[12px]">
                <Autocomplete
                  isRequired
                  variant="bordered"
                  label="Select Smartphone"
                  items={smartphoneModelsSm1
                    .filter(model => model !== selectedModelSm2 && model !== selectedModelSm3) // Filter out selected smartphones from other elements
                    .map(model => ({ label: model, value: model }))}
                  selectedKey={selectedModelSm1}
                  onSelectionChange={setSelectedModelSm1}
                  // disabled={!selectedBrand}
                  className="max-w-xs"
                  multiple
                >
                  {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                </Autocomplete>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              <div id="SelectBrandElm2" className="col-span-2 bg-white rounded-[12px]">
                <Autocomplete
                  isRequired
                  variant="bordered"
                  label="Select Brand"
                  items={brandName.map(brand => ({ label: brand, value: brand }))}
                  selectedKey={selectedBrandSm2}
                  onSelectionChange={setSelectedBrandSm2}
                  className="max-w-xs"
                >
                  {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                </Autocomplete>
              </div>

              {/* Select Smartphones */}
              <div id="SelectSmartphoneElm2" className="col-span-3 bg-white rounded-[12px]">
                <Autocomplete
                  isRequired
                  variant="bordered"
                  label="Select Smartphone"
                  items={smartphoneModelsSm2
                    .filter(model => model !== selectedModelSm1 && model !== selectedModelSm3) // Filter out selected smartphones from other elements
                    .map(model => ({ label: model, value: model }))}
                  selectedKey={selectedModelSm2}
                  onSelectionChange={setSelectedModelSm2}
                  // disabled={!selectedBrand}
                  className="max-w-xs"
                  multiple
                >
                  {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                </Autocomplete>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              <div id="SelectBrandElm3" className="col-span-2 bg-white rounded-[12px]">
                <Autocomplete
                  variant="bordered"
                  label="Select Brand"
                  items={brandName.map(brand => ({ label: brand, value: brand }))}
                  selectedKey={selectedBrandSm3}
                  onSelectionChange={setSelectedBrandSm3}
                  className="max-w-xs"
                >
                  {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                </Autocomplete>
              </div>

              <div id="SelectSmartphoneElm3" className="col-span-3 bg-white rounded-[12px]">
                <Autocomplete
                  variant="bordered"
                  label="Select Smartphone"
                  items={smartphoneModelsSm3
                    .filter(model => model !== selectedModelSm1 && model !== selectedModelSm2) // Filter out selected smartphones from other elements
                    .map(model => ({ label: model, value: model }))}
                  selectedKey={selectedModelSm3}
                  onSelectionChange={setSelectedModelSm3}
                  // disabled={!selectedBrand}
                  className="max-w-xs"
                  multiple
                >
                  {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                </Autocomplete>
              </div>
            </div>

          </div>
        </div>
        <div className="md:container md:mx-auto md:mt-1 md:mb-5 md:w-full md:h-full m-h-screen">
          <div className="flex justify-center items-center gap-1">
            <div className="my-2 flex justify-end bg-white rounded-[12px]">
              <Autocomplete
                size="sm"
                classNames="w-full"
                variant="bordered"
                label="Select Smartphone"
                items={[
                  { value: selectedModelSm1, label: selectedModelSm1 },
                  { value: selectedModelSm2, label: selectedModelSm2 },
                  { value: selectedModelSm3, label: selectedModelSm3 }
                ].filter(item => item.value !== "")}
                selectedKey={selectedModelFilter}
                onSelectionChange={handleSelectModelSentimentchange}
              >
                {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
              </Autocomplete>
            </div>
            <div className="my-2 flex justify-end bg-white rounded-[12px]">
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
              >
                {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
              </Autocomplete>
            </div>
            <div className="my-2 flex justify-end bg-white rounded-[12px]">
              <Autocomplete
                size="sm"
                classNames="w-full"
                variant="bordered"
                label="Select Sentiment"
                items={!showNeutralData ?
                  [
                    { value: 'pos', label: 'Positive' },
                    { value: 'neg', label: 'Negative' }
                  ] :
                  [
                    { value: 'pos', label: 'Positive' },
                    { value: 'neg', label: 'Negative' },
                    { value: 'neu', label: 'Neutral' }
                  ]}
                selectedKey={selectedSentimentsFilter}
                onSelectionChange={handleSelectSentimentchange}
              >
                {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
              </Autocomplete>
            </div>
            <div>
              <Checkbox defaultSelected={!showNeutralData} radius="sm"
                checked={showNeutralData}
                onChange={handleCheckboxChangeNeutralData}>
                Show Positive and Negative
              </Checkbox>
            </div>
          </div>
          <div className="mt-3">
            {showAlert && (
              <div class="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span class="sr-only">Info</span>
                <div>
                  <span class="font-medium">{alertMessage}</span> is not have value. Please select another smartphone.
                </div>
              </div>
            )}
          </div>

          {selectedModelSm1 && selectedModelSm2 && (
            <div className="grid grid-cols-11 gap-3">
              <div className="col-span-5 grid grid-cols-5">
                <div className="col-span-5 overflow-y-auto shadow-md p-2 my-2 bg-white max-h-screen" style={{ borderRadius: "20px", maxHeight: "85vh" }}>
                  <table id="dataTable" className="md:w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 px-5">
                    <colgroup>
                      <col style={{ width: "7%", maxWidth: "7%" }} />
                      <col style={{ width: "50%", maxWidth: "50%" }} />
                      <col style={{ width: "20%", maxWidth: "20%" }} />
                      <col style={{ width: "13%", maxWidth: "13%" }} />
                    </colgroup>
                    <thead className="text-base">
                      <tr>
                        <th scope="col" className="pl-5 pr-1 py-2">
                        </th>
                        <th scope="col" className="px-2 py-2">
                          {selectedAspectsFilter ? `${selectedAspectsFilter} Review` : "Overall Review"}
                        </th>
                        <th scope="col" className="px-3 py-2">
                          Model
                        </th>
                        <th scope="col" className="px-2 py-2">
                          Sentiment
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedAspectsFilter !== "" ? (
                        filterReviews().map((review, index) => (
                          <tr key={`aspect_${index}`}>
                            <th scope="row" className="pl-5 pr-1 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-white">
                              {index + 1}
                            </th>
                            <td className="px-2 py-2">
                              {review.textDisplay_aspect}
                            </td>
                            <td className="px-3 py-2">
                              {review.smartphoneName}
                            </td>
                            <td className="px-2 py-2 text-center">
                              <span style={{
                                padding: "3px",
                                border: "1px solid #DCF4E7",
                                borderRadius: "5px",
                                backgroundColor: getBackgroundColor(review.Aspect_Sentiment_Label),
                                color: getTextColor(review.Aspect_Sentiment_Label),
                                display: 'inline-block',
                              }}>
                                {getSentimentText(review.Aspect_Sentiment_Label)}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        filterReviews().map((review, index) => (
                          <tr key={`sentiment_${index}`}>
                            <th scope="row" className="pl-5 pr-1 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-white">
                              {index + 1}
                            </th>
                            <td className="px-2 py-2">
                              {review.textDisplay}
                            </td>
                            <td className="px-3 py-2">
                              {review.smartphoneName}
                            </td>
                            <td className="px-2 py-2 text-center">
                              <span style={{
                                padding: "3px",
                                border: "1px solid #DCF4E7",
                                borderRadius: "5px",
                                backgroundColor: getBackgroundColor(review.Sentiment_Label),
                                color: getTextColor(review.Sentiment_Label),
                                display: 'inline-block',
                              }}>
                                {getSentimentText(review.Sentiment_Label)}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-span-6">
                <div className="grid grid-cols-2 gap-3">
                  <div style={{ maxHeight: "40vh" }}>
                    <div className="bg-white shadow-md rounded-[20px] md:p-3 w-full h-full">
                      <canvas id="RadarChart" className="mx-auto" src="..."></canvas>
                    </div>
                  </div>
                  <div style={{ maxHeight: "40vh" }}>
                    <div className="bg-white shadow-md rounded-[20px] md:p-3 w-full h-full">
                      <canvas id="ovaBarChart">barchart</canvas>
                    </div>
                  </div>
                  <div className="col-span-2 w-full h-full" style={{ height: "50vh", maxHeight: "45vh" }}>
                    <div className="bg-white shadow-md rounded-[20px] md:p-3 w-full h-full">
                      <canvas id="fullStackBarChartAspect" src="..."></canvas>
                    </div>
                    {/* <div className="bg-white shadow-md rounded-[20px] md:p-3 md:mr-4 md:my-2 w-full h-full" style={{ maxHeight: "40vh" }}>
                      <canvas id="fullStackBarChart" src="..."></canvas>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>


        {selectedModelSm1 && selectedModelSm2 && (
          <div className="md:mb-5">
            <div className="text-center md:my-5">
              <span className="text-3xl font-semibold font-mono md:font-mono">Smartphone Information</span>
            </div>
            <div className="md:mx-auto w-full max-w-5xl">
              <Table aria-label="Example table with dynamic content">
                <TableHeader columns={columnsInfoData}>
                  {(column, index) => (
                    <TableColumn key={column.key} className="text-base"
                      style={{ width: index === 0 ? "5%" : "25%" }}>
                      {column.label}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={rowsInfoData}>
                  {(item) => (
                    <TableRow key={item.info}>
                      {(columnKey) => <TableCell>{item[columnKey]}</TableCell>}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </>
  );

}
