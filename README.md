## Table of Contents

- [Setup](#setup)
	- [Visual Studio Code Setup](#visual-studio-code-setup)
- [Add e1pagehelper Reference](#add-e1pagehelper-reference)
- [Add Adapter for E1 Page in index.html](#add-adapter-for-e1-page-in-indexhtml)
- [Initialize State](#initialize-state)
- [Create Response Handler](#create-response-handler)
- [Create Call to JDE Orchestration Service](#create-call-to-jde-orchestration-service)
- [Wrapping it up in React](#wrapping-it-up-in-react)
- [Add a Simple Table To Display Data](#add-a-simple-table-to-display-data)
- [Upload to JDE](#upload-to-jde)
- [Add Chart Visualization](#add-chart-visualization)
- [Cloning Repository](#cloning-repository)


### Setup

Prerequisites:
- JD Edwards
	- Tools (Suggested Minimum 9.2.1.7)
	- Apps (Suggested Minimum 9.1.5)
- Node Installed
	- Download Link: https://nodejs.org/en/download/
	- Install how to: https://blog.teamtreehouse.com/install-node-js-npm-windows
- Visual Studio Code 
	- Download: https://code.visualstudio.com/download
	- Setup: https://code.visualstudio.com/docs/nodejs/nodejs-tutorial

We will be using Facebook's template so we don’t have to worry about the configuration for bundling and other web configuration.
Create React App github: https://github.com/facebook/create-react-app

1. Open Command Prompt 
2. Navigate to directory
```
cd MyDev\collaborate19
```
3. Execute create react app script
```
npx create-react-app c19-demo-app
```
Our project is now created.

#### Visual Studio Code Setup

1. Open Visual Studio Code (VSC)
2. Click File -> Open Folder
3. Find the folder for the c19-demo-app
Note: We now have the React App open in VSC
	
We will now make the terminal appear in VSC so we can run everything in VSC
From here on in when I refer to Terminal I am referring to the VSC terminal

4. Click View
5. Select Terminal
  Note: We now have a completely operational terminal in VSC
	
We will now start the scaffolded react app to ensure it runs

6. In the terminal run the start command:
```
npm start
```
  Note: This has launched a local server running the base react-app.
  At this point we can choose to keep the server open and make changes to the source code and the browser will refresh, or we can close   it by entering the following in the terminal
  
7. In the App.js file Lets change the contents of the Render Function to display "Collaborate 19 - React Demo App". Save the file once complete. Notice the app will automatically recompile once it sees a file has changed.
  The render function will now look like this:
  ```js
  render() {
    return (
      <div className="App">
          <h1>Collaborate 19 - React Demo App</h1>
      </div>
    );
  }
}

  ```

8. Close the server via the terminal by entering the following command:
```
Ctrl+c
```
The following message will appear:
		"Terminate batch job (Y/N)?"
```
Y
```

### Add e1pagehelper Reference

We need to reference the JDE e1pagehelper JavaScript file which contains functions to call Orchestrator and AIS with the logged in user.
There are 2 different references we can add.
- Fully qualified
- Relative

The fully qualified reference is good if you just want to see what the page looks like in E1 without actually creating an E1 page. 
Example:
```html
	<script type="text/javascript" src="https://{your_jde_server}/jde/e1pages/e1pagehelper.js"></script>
```

The Relative reference is for when you are ready to create your E1 page.
This reference below says the e1pagehelper.js file is one directory above the current directory in which your app resides. This is how it looks like tools 9.2.1.7 atleast
Example:
```html
	<script type="text/javascript" src="../e1pagehelper.js"></script>
```

Adding the reference into your app:
1. In the public directory open the index.html file
2. Add the reference selected below the last meta tag

### Add Adapter for E1 Page in index.html

The adapter is required so the React App can communicate up to the JDE e1pagehelper functions. The JDE e1pagehelper allows the user who is logged in to call orchestration and other AIS Services.
You may add more adapters. Pretty much any function you want to call in the e1pagehelper file you just need to wrap in a function here

1. Open the index.html file in the following directory:
		Public/index.html
2. Above the <title> node in the index.html file enter the following code:
```html
  <script type="text/javascript">
    ///Adapter to call Orchestration
    function orchestrationService(orchestration,input,callback){
      window.callAISOrchestration(orchestration,input,callback)
    };

  </script>
```

Note: We have successfully added our adapter functions. Now in our app whenever we want to call these functions it would look like this:
```js
  window.orchestrationService(orchestration,input,callback);
```
Where the callback would be the function you want to execute when JDE has given you a response. Callbacks are a large technical topic on their own so I would recommend you using google to understand more of this.
		
We now have our base framework complete. This would be used for any E1 page app you would build. If you wanted to get really fancy you can bundle this all into a script so instead of running the create-react-app script you can run create-jde-react-app and it would scaffold this into your project.

### Initialize State

Now we will setup our app so it has state for data from the Orchestration. Any time the state will change the components that use the state will re-render (Refer to the documentation [here](https://reactjs.org/docs/state-and-lifecycle.html) for more information about React state and lifecycle)
In our App.js File we will add the following:
```js
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
  }
}
```
Note: The data is where we will store the response data for the orchestration. This value will be set in our response handler
	
### Create Response Handler

We will now create a function that handles the response the orchestration will return when called.
Remember that callback variable we mentioned previously? We are building the function that we will pass it.
This will be our simple response handler, you can add more complex error handling or whatever if you like:
```js
function handleJdeResponse(response){
  var jsonResponse = JSON.parse(response)
  if(jsonResponse.hasOwnProperty('Data Requests')){
    var responseData = jsonResponse['Data Requests'][0]['Data Browser - F54HS01 [Incident Master]'];
      this.setState({data: responseData});
  }else{
     alert("error: " + jsonResponse.message);
      console.log(response);
    }
}
```

### Create Call to JDE Orchestration Service

Since we are calling a function in E1 with the adapter we previously built on the index.html page, we have to keep in mind that the context will change when the function is executing in E1. Meaning having a "this" property will be meaningless in our app when the orchestration is executing. (Referring to line 5 in the above code block).
To overcome the context problem we will wrap our response handler by another function called getData.
```js
getData(){
	let currentComponent = this;

	function handleJdeResponse(response){
	  var jsonResponse = JSON.parse(response)
	  if(jsonResponse.hasOwnProperty('Data Requests')){
	    var responseData = jsonResponse['Data Requests'][0]['Data Browser - F54HS01 [Incident Master]'];
	      currentComponent.setState({data: responseData});
	  }else{
	     alert("error: " + jsonResponse.message);
	      console.log(response);
	    }
	}
	window.orchestrationService('Get Incident Data C19','{Your Orchestration Input}',handleJdeResponse);
}
```

Note: we have added a variable called currentComponent to ensure the callback response handler has context of our app, allowing us to set the state of data. If we continued to have "this", when the function is executing in E1 it will have the context of E1 and not our app, so we cannot call the setState function.
	
On line 14 you will see we are actually called the Orchestration service. Notice that that second parameter of the function is the orchestration input. For simplicity we have set a default value for our input so we will pass a blank input.

### Wrapping it up in React

Following the react state and life cycle we will use the componentDidMount function to call our getData function. This will allow our getData function to be called whenever the page is loaded. Refer to the documentation here for more information about React state and lifecycle. [React Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html)

### Add a Simple Table To Display Data

I have put together a very small component that will allow us to view the orchestration data in a html Table.
To add the new component do the following:
1. Create a new file directory called "components" in the src directory.
2. In the components directory create a new file called SimpleTable.js
3. Paste the following code in SimpleTable.js File
```js
import React from 'react';

const SimpleTable = (props) => {
    return(
        <table border="1" id="simpleReactTable">
            <thead>
                <tr>
                    <th>incidentNumber</th>
                    <th>description</th>
                    <th>date</th>
                    <th>status</th>
                    <th>class1</th>
                    <th>class2</th>
                    <th>class3</th>
                    <th>class4</th>
                    <th>branch</th>
                    <th>division</th>
                    <th>project</th>
                </tr>
            </thead>
            <tbody>
                {props.jdeData.map((data) => {
                    return(
                        <tr>
                            <td>{data.incidentNumber}</td>
                            <td>{data.description}</td>
                            <td>{data.date}</td>
                            <td>{data.status}</td>
                            <td>{data.class1}</td>
                            <td>{data.class2}</td>
                            <td>{data.class3}</td>
                            <td>{data.class4}</td>
                            <td>{data.branch}</td>
                            <td>{data.division}</td>
                            <td>{data.project}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default SimpleTable;
```
Note: The component above will take an Array of objects and generate a 11 column table.

In your app.js file do the following to add our new component:
1. At the top of the file below the last import line add the following line:
```js
		import SimpleTable from './components/SimpleTable'
```
This line allows us to use our new SimpleTable component

2. In the render function add the following below the heading:
```js
		<SimpleTable jdeData={this.state.data}/>
```
This line says we will pass the property data from the app's state to a property called jdeData. If you recall in the SimpleTable component we were mapping from a property called jdeData (line 22 in the SimpleTable component)
Note: Whenever the data state is updated the table will re-render and update with the latest values

### Upload to JDE

So now lets bundle the app and upload to JDE:
1. In the terminal run the build command. Wait for the command to complete
```
npm run build
```
   Note: What this command does is bundles all of our files into 1 javascript file so when the page loads only 1 file must be loaded.    This is very useful especially when your app grows to many files.

2. We now have a new directory called build. This directory will contains our bundled app.
3. In the build directory change the name of the index.html file to home.html (This is how E1 wants the files)
4. Open the home.html file and replace all instances of "/static" to "static. The reference files cannot be found when the app loads in JDE when there is a "/" before the directory.
5. Select all the files and compress them into a zip file. It is recommended to use 7-zip as the default windows compression tool is known to have a bug in which E1 sometimes cannot uncompress the file
6. Open JDE E1
7. Navigate to creating a classic page
8. In the Page Type select Upload HTML Content
9. Click the Choose File button
10. Select the folder that we zipped in step 4
11. Click the Upload Button, Wait for the success message
12. Click the View Content button
Note: Our page loaded succesfully

### Add Chart Visualization

There are a lot of open sourced charting libraries that offer great visualizations (Refer to www.npmjs.com). 
We will use Google Visualization since it has a library written for react already. 
1. In the terminal run:
```js
npm install -s react-google-charts 
```
2. Add the following code to the top of the App.js file
```js
import { Chart } from "react-google-charts";
```
		
3. We will create a bar chart. Lets create function that creates the bar chart data
  ```js
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
  ```

4. Now lets add code to handle the orchestration data in our response handler (Change is line 5 & 6:
```js
  1 	    function handleJdeResponse(response){
  2 	      var jsonResponse = JSON.parse(response)
  3 	      if(jsonResponse.hasOwnProperty('Data Requests')){
  4 	        var responseData = jsonResponse['Data Requests'][0]['Data Browser - F54HS01 [Incident Master]'];
  5 	        var chartData = currentComponent.createChartData(responseData);
  6 	          currentComponent.setState({data: chartData});
  7 	      }else{
  8 	         alert("error: " + jsonResponse.message);
  9 	          console.log(response);
 10 	        }
 11 	    }
```

5. Lets add our new Chart Component:
```js
  1 	<Chart
  2 	  width={'500px'}
  3 	  height={'300px'}
  4 	  chartType="BarChart"
  5 	  loader={<div>Loading Chart</div>}
  6 	  data={[
  7 	    ['Classification','Count'],
  8 	    ['Class 1',data.class1],
  9 	    ['Class 2',data.class2],
 10 	    ['Class 3',data.class3],
 11 	    ['Class 4',data.class4]
 12 	  ]}
 13 	  options={{
 14 	    title: 'Bar',
 15 	    width: 600,
 16 	    height: 400,
 17 	    bar: { groupWidth: '95%' },
 18 	    legend: { position: 'none' },
 19 	  }}
 20 	  // For tests
 21 	  rootProps={{ 'data-testid': '6' }}
 22 	/>

```
Note: Line 6-11 is the data we are passing to the google chart

Refer to source for more info

### Cloning Repository

You can go ahead and clone this repo and build an app for your instance. Just remember the following must be performed for it to function:
1. Update the link in the index.html file so your JDE instance is referenced (for e1pagehelper)
2. Create an Orchestration in your instance and define it accordingly in the app
3. Optional You can import the Orchestration file (OrchestrationExport.zip) into your instance, but our instance has modified the app significantly for Health and Safety
