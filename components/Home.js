import React, { Component } from "react";
import { ComplexDonut } from "./complex";
import "./Home.css";

const RED_COLOR = "#ff5050";
const GREEN_COLOR = "#33cc33";
const GRAY_COLOR = "#999999";
export class Home extends Component {
  static displayName = Home.name;
  constructor(props) {
    super(props);
    this.state = {
      Loaded:false,
      items: [],
      donutItems: [],
    };
  }

  componentDidMount() {
    function Sum(data) {
      var total = 0;
      for (var i = 0; i < data.length; i++) {
        total += data[i].ScoreCounts;
      }

      return total;
    }

    fetch(
      "https://azureblobsastest1.blob.core.windows.net/sentimentoutput/12-04-2020/0_25166aa3781c4e82b86d8b26d657efb1_1.json"
    )
      .then((res) => res.text())
      .then(
        (result) => {
          if (result.endsWith("]") === false) {
            result = result + "]";
          }
          // console.log(result);

          var data = JSON.parse(result);
          //console.log(data);

          var positiveItems = data.filter((item) => item.SentimentScore === 4);
          var negetiveItems = data.filter((item) => item.SentimentScore === 0);
          var neutralItems = data.filter((item) => item.SentimentScore === 2);

          var donutDataItems = [
            {
              color: GREEN_COLOR,
              value: Sum(positiveItems),
            },
            {
              color: RED_COLOR,
              value: Sum(negetiveItems),
            },
            {
              color: GRAY_COLOR,
              value: Sum(neutralItems),
            },
          ];
          console.log("donutDataItems", donutDataItems);
          this.setState({
            items: data,
            donutItems: donutDataItems,
            Loaded:true
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log("error", error);
          // this.setState({
          //   isLoaded: true,
          //   error,
          // });
        }
      );
  }

  render() {
    return (
      <div>
        <div id="donutdiv">
          {this.state.Loaded ?<ComplexDonut
            size={200}
            radius={80}
            segments={this.state.donutItems}
            thickness={40}
            startAngle={-90}
          />:null}          
        </div>
        <h1>Hello, world!</h1>
        <p>Welcome to your new single-page application, built with:</p>
        <ul>
          <li>
            <a href="https://get.asp.net/">ASP.NET Core</a> and{" "}
            <a href="https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx">
              C#
            </a>{" "}
            for cross-platform server-side code
          </li>
          <li>
            <a href="https://facebook.github.io/react/">React</a> for
            client-side code
          </li>
          <li>
            <a href="http://getbootstrap.com/">Bootstrap</a> for layout and
            styling
          </li>
        </ul>
        <p>To help you get started, we have also set up:</p>
        <ul>
          <li>
            <strong>Client-side navigation</strong>. For example, click{" "}
            <em>Counter</em> then <em>Back</em> to return here.
          </li>
          <li>
            <strong>Development server integration</strong>. In development
            mode, the development server from <code>create-react-app</code> runs
            in the background automatically, so your client-side resources are
            dynamically built on demand and the page refreshes when you modify
            any file.
          </li>
          <li>
            <strong>Efficient production builds</strong>. In production mode,
            development-time features are disabled, and your{" "}
            <code>dotnet publish</code> configuration produces minified,
            efficiently bundled JavaScript files.
          </li>
        </ul>
        <p>
          The <code>ClientApp</code> subdirectory is a standard React
          application based on the <code>create-react-app</code> template. If
          you open a command prompt in that directory, you can run{" "}
          <code>npm</code> commands such as <code>npm test</code> or{" "}
          <code>npm install</code>.
        </p>
      </div>
    );
  }
}
