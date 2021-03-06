import React, { Component } from "react"
import "./App.css"
import { getGitHubUserData } from "./services/github"
import logo from "./glimpse-logo.png"
// Disable eslint max-len for imports from react-vis
// eslint-disable-next-line max-len
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, VerticalBarSeries } from "react-vis"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: 0,
      height: 0,
      message: "",
      inputValue: "",
      formattedData: [],
      legend: []
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentDidMount = async () => {
    this.updateWindowDimensions()
    window.addEventListener("resize", this.updateWindowDimensions)
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateWindowDimensions)
  }

  updateWindowDimensions = () => {
    this.setState({ width: .8 * (window.innerWidth), height: .55 * (window.innerHeight - 20) })
  }

  updateInputValue = (event) => {
    this.setState({
      inputValue: event.target.value,
      formattedData: [],
      message: ""
    })
  }

  handleClick = async () => {
    if (this.state.inputValue !== "") {
      this.setState({
        formattedData: [],
        legend: [],
        message: `Searching ${this.state.inputValue}'s GitHub contributions...`
      })
      const contributions = await getGitHubUserData(this.state.inputValue)

      if (contributions.length === 0) {
        this.setState({
          message: `No GitHub contributions found for ${this.state.inputValue}`
        })
      } else {
        const legend = []
        legend[0] = contributions[0].x
        legend[contributions.length] = contributions[contributions.length - 1].x

        this.setState({
          formattedData: contributions,
          legend,
          message: `A glimpse at ${this.state.inputValue}'s GitHub contributions`
        })
      }
    } else {
      this.setState({
        formattedData: [],
        legend: [],
        message: "You searched for an empty username  ¯\\_(ツ)_/¯"
      })
    }
  }

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.handleClick()
    }
  }

  render = () => {
    const BarSeries = VerticalBarSeries

    return (
      <div className="App">
        <div className="GitHub-link">
          <a href="https://github.com/matt-jarrett/glimpse">
            View on GitHub <i className="fa fa-github"/>
          </a>
        </div>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <div>
          <input
            className="Input"
            autoFocus
            value={this.state.inputValue}
            onChange={(event) => this.updateInputValue(event)}
            onKeyPress={this.handleKeyPress}
          />
          <button
            className="Square-button"
            onClick={(event) => this.handleClick(event)}>
              Search
          </button>
        </div>
        { this.state.formattedData.length > 0 &&
          <div className="Content">
            <XYPlot
              xType="ordinal"
              width={this.state.width}
              height={this.state.height}
            >
              <VerticalGridLines/>
              <HorizontalGridLines style={{ stroke: "#B4B4B4" }}/>
              <YAxis
                title="contributions"
                position="middle"
                tickFormat={(value) => {
                  if (value < 1) {
                    return value.toString().substring(1)
                  }
                  return value
                }}/>
              <XAxis
                hideLine
                left={33}
                tickFormat={(value) => value.substring(0, 4)}
                tickValues={this.state.legend}/>
              <BarSeries
                color="#601D9A"
                className="vertical-bar-series-example"
                data={ this.state.formattedData }/>
            </XYPlot>
          </div>
        }
        <h3>{this.state.message}</h3>
        <div className="Footer">
          <h4>
            Made with <i className="fa fa-heart"/>, JavaScript, and <i className="fa fa-github"/>
          </h4>
        </div>
      </div>
    )
  }
}

export default App
