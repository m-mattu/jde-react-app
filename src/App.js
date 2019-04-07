import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SimpleTable from './components/SimpleTable';
import { Chart } from 'react-google-charts';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
  }
}

componentDidMount(){
  this.getData();
}

createChartData(data){
	var c1 = data.filter(x=> x.class1 === "1").length
	var c2 = data.filter(x=> x.class2 === "1").length
	var c3 = data.filter(x=> x.class3 === "1").length
	var c4 = data.filter(x=> x.class4 === "1").length
	return {
	  class1: c1,
	  class2: c2,
	  class3: c3,
	  class4: c4
	}
}


getData(){
  let currentComponent = this;

  function handleJdeResponse(response){
    let jsonResponse;
    if(typeof response == 'string')
      jsonResponse = JSON.parse(response); //How orchestrator will respond
    else
      jsonResponse = response;
      
    if(jsonResponse.hasOwnProperty('Data Requests')){
      var responseData = jsonResponse['Data Requests'][0]['Data Browser - F54HS01 [Incident Master]'];
      var chartData = currentComponent.createChartData(responseData);
      currentComponent.setState({data: chartData});
    }else{
       alert("error: " + jsonResponse.message);
        console.log(response);
      }
  }
  window.orchestrationService('Get Incident Data C19','',handleJdeResponse);
}



  render() {
    const { data } = this.state;
    return (
      <div className="App">
        <h1>Collaborate 19 - React Demo App</h1>
        {/* <SimpleTable jdeData={this.state.data}/> */}
        <Chart
          width={'500px'}
          height={'300px'}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={[
            ['Classification','Count'],
            ['Class 1',data.class1],
            ['Class 2',data.class2],
            ['Class 3',data.class3],
            ['Class 4',data.class4]
          ]}
          options={{
            title: 'Bar',
            width: 600,
            height: 400,
            bar: { groupWidth: '95%' },
            legend: { position: 'none' },
          }}
          // For tests
          rootProps={{ 'data-testid': '6' }}
        />
      </div>
    );
  }
}

export default App;
