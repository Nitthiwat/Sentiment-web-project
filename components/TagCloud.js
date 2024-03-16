import React, { useEffect } from 'react';
import anychart from 'anychart';

const TagCloud = () => {
  useEffect(() => {
    anychart.onDocumentReady(function() {
      // create data
      var data = [
        { x: 'กล้องดีมาก', value: 80 },
        { x: 'แบต', value: 56 },
        { x: 'ห่วยแตก', value: 44 },
        { x: 'แพงมาก', value: 40 },
        { x: 'สวยงาม', value: 36 },
        { x: 'ยอดเยี่ยม', value: 32 },
        { x: 'ดีมาก', value: 28 },
        { x: 'แนะนำ', value: 24 },
        { x: 'ใช้งานได้ดี', value: 20 },
        { x: 'หน้าจอห่วย', value: 12 },
        { x: 'หล้องไม่ชัด', value: 12 },
      ];

      var chart = anychart.tagCloud(data);
      chart.container('wordCloudContainer');
      chart.title('TAG CLOUDS-ALL SENTIMENT');
      chart.normal().fontFamily('Kanit');
      chart.hovered().fontFamily('Kanit');
      chart.draw();
    });
  }, []);

  return <div id="wordCloudContainer"  />;
};

export default TagCloud;
