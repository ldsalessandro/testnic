import React, { Component } from 'react';
import Button from '../button';
import { randomSpeed, average } from '../../helpers';
import './panel.scss';

class Panel extends Component {
  constructor(props){
    super(props);
    this.state = {
      download: [],
      upload: [],
      average: {
        download: null,
        upload: null
      },
      controls: {
        download: false,
        upload: false
      }
    };
  }

  componentDidMount() {
    this.speedTest();
  }

  speedTest = () => {
    this.setState({ 
      download: randomSpeed(),
      upload: randomSpeed()
    }, () => this.runSpeed());
  }

  restartTest = () => {
    this.setState({
      download: [],
      upload: [],
      average: {
        download: null,
        upload: null
      },
      controls: {
        download: false,
        upload: false
      }
    }, () => this.speedTest());
    this.props.updateHistory();
  }

  runSpeed = () => {
    let arraySpeed = this.state.download;

    let speedInterval = setInterval(speedTimer.bind(this), 500);
    let speedIndice = 0;
    let  isPaused = false

    function speedTimer() {
      if(!isPaused) {
        document.getElementById("chart-speed").innerHTML = arraySpeed[speedIndice];
        
        speedIndice++;     

        if(speedIndice > arraySpeed.length - 1) {
          speedIndice = 0;
          isPaused = true;
          
          if(!this.state.controls.download) {
            this.setState({ 
              average: { download: average(arraySpeed) },
              controls: {...this.state.controls, download: true} 
            })
            arraySpeed = this.state.upload;
            setTimeout( () => { isPaused = false }, 1000)
          } else {
            this.setState({ 
              average: { ...this.state.average, upload: average(arraySpeed) },
              controls: {...this.state.controls, upload: true} 
            })
            
            clearInterval(speedInterval)

            let averageObj = {date: new Date(),download: this.state.average.download,upload: this.state.average.upload}
            let history = localStorage.getItem('history');
            let updateHistory = history ? JSON.parse(history) : [];
            updateHistory.unshift(averageObj)
            if(updateHistory.length > 2) { //result history limit
              updateHistory.pop()
            }
            localStorage.setItem('history', JSON.stringify(updateHistory));
          }
        }
      }
    }
  }

    
  render() {
    return (
      <div className="panel">
        <div className="panel__chart">
          <p className="panel__chart--speed animated bounceInUp" id="chart-speed">
            0
          </p> 
          <p className="panel__chart--unit animated bounceInUp">
            Mbps
          </p> 
        </div>
        <div className="panel__result">
          <div className="panel__result__container">
            <div className="panel__result__speed">
              <p className="panel__result__speed--title">
                <img src="./imgs/icon-download.png" width="27" height="27" alt="" /> Download speed
              </p>
              {
                this.state.average.download ?
                  <p className="panel__result__speed--number animated fadeInDown">
                    <span>{ this.state.average.download }</span> Mbps
                  </p>
                : ''
              }
            </div>
            <hr />
            <div className="panel__result__speed">
              <p className="panel__result__speed--title">
                <img src="./imgs/icon-upload.png" width="27" height="27" alt="" /> Upload speed
              </p>
              {
                this.state.average.upload ?
                  <p className="panel__result__speed--number animated fadeInUp">
                    <span>{ this.state.average.upload }</span> Mbps
                  </p>
                : ''
              }
            </div>
          </div>
          {
            this.state.controls.upload ?
              <div className="panel__result__container animated bounceInUp delay-1s">
                <Button 
                  restart={this.restartTest}
                  text="Restart"
                  icon="./imgs/icon-restart.png"
                />
              </div>
            : ''
          }
        </div>

      </div>
    );
  }
}

export default Panel;