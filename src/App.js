import React from 'react';
import { Map, Marker, Polyline } from 'react-amap';
import { Button, Card, Select, Progress } from 'antd'

import 'antd/dist/antd.css'
import './App.css'

const VERSION = '1.4.0'
const AMAP_KEY = '2d2ca41e1764489c5ef34c508ce71470'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			lineArr: [
				[116.478935, 39.997761], [116.478939, 39.997825], [116.478912, 39.998549], [116.478912, 39.998549],
				[116.478998, 39.998555], [116.478998, 39.998555], [116.479282, 39.99856], [116.479658, 39.998528],
				[116.480151, 39.998453], [116.480784, 39.998302], [116.480784, 39.998302], [116.481149, 39.998184],
				[116.481573, 39.997997], [116.481863, 39.997846], [116.482072, 39.997718], [116.482362, 39.997718],
				[116.483633, 39.998935], [116.48367, 39.998968], [116.484648, 39.999861], [116.4862501, 40.001342],
				[116.489866, 40.004541]
			],
			flag: true,
			offset: [-26, -13],
			currenttPoint: [116.478935, 39.997761],
			speed: 500,
			percent: 0,
			currentLength: 0,
			totalLength: 0,

		}
		//map的事件
		this.mapEvents = {
			click: map => {
				console.log(map)
			}
		}
		//总polyline轨迹事件
		this.lineEvents_1 = {
			created: polyline => {
				this.totalLength = polyline.getLength()
				this.setState({ totalLength: this.totalLength })
			}
		}
		//走过的polyline轨迹事件
		this.lineEvents = {
			created: polyline => {
				this.curDevicePolyline = polyline
			},
		}
		//marker的轨迹事件
		this.events = {
			created: marker => {
				this.curDeviceMarker = marker;
			},
			moving: polyline => {
				// 获取当前走过路径长度
				this.currentLength = this.curDevicePolyline.getLength()
				
				this.curDevicePolyline.setPath(polyline.passedPath)
			}
		}


		this.startAnimation = this.startAnimation.bind(this)
		this.pauseAnimation = this.pauseAnimation.bind(this)
		this.resumeAnimation = this.resumeAnimation.bind(this)
		this.stopAnimation = this.stopAnimation.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}
	//开始动画方法
	startAnimation() {
		this.setState({
			flag: false
		})
		let timer = setInterval(()=>{
			this.setState({
				currentLength: this.currentLength
			})
		},1000)
		this.curDeviceMarker.moveAlong(this.state.lineArr, this.state.speed)

	}
	//暂停动画方法
	pauseAnimation() {
		this.curDeviceMarker.pauseMove();
	}
	//继续动画方法
	resumeAnimation() {
		this.curDeviceMarker.resumeMove();
	}
	//停止动画方法
	stopAnimation() {
		this.curDeviceMarker.stopMove();
	}

	handleChange(value) {
		switch (value) {
			case 'slow':
				this.setState({
					speed: 20
				})
				console.log(this.state.speed)
				break
			case 'narmal':
				this.setState({
					speed: 100
				})
				break
			default:
				this.setState({
					speed: 1000
				})
				break
		}
	}
	componentDidUpdate() {
		if (!this.state.flag) {
			this.curDeviceMarker.moveAlong(this.state.lineArr, this.state.speed)
		}
	}
	render() {
		let { lineArr, currenttPoint } = this.state;

		return (
			<>
				<div style={{ width: '100vw', height: '100vh' }}>
					<Map
						amapkey={AMAP_KEY}
						version={VERSION}
						center={[116.478935, 39.997761]}
						resizeEnable
						zoom={17}
						events={this.mapEvents}
					>
						<Marker
							position={currenttPoint}
							icon="https://webapi.amap.com/images/car.png"
							autoRotation
							angle='-90'
							offset={this.state.offset}
							events={this.events}
						/>
						<Polyline
							path={lineArr}
							showDir
							events={this.lineEvents_1}
							style={{ strokeColor: "#28F", strokeWeight: '6' }}
						/>
						<Polyline
							events={this.lineEvents}
							style={{ strokeColor: "#AF5", strokeWeight: '6' }}
						/>
					</Map>
					<Card title='轨迹回放控制' style={{ position: 'absolute', top: '30px', left: '30px', width: 300, margin: '0 auto' }}>
						<div>
							<Button id="start" onClick={this.startAnimation} >开始动画</Button>
							<Button id="pause" onClick={this.pauseAnimation}>暂停动画</Button>
						</div>
						<div>
							<Button id="resume" onClick={this.resumeAnimation}>继续动画</Button>
							<Button id="stop" onClick={this.stopAnimation}> 停止动画</Button>
						</div>
						<div>
							<Select defaultValue="narmal" style={{ width: 120 }} onChange={this.handleChange}>
								<Select.Option value='slow'>慢速</Select.Option>
								<Select.Option value='narmal'>正常</Select.Option>
								<Select.Option value='fast'>快速</Select.Option>
							</Select>
						</div>
						<div>
							<Progress percent={this.state.percent} />
						</div>
					</Card>
				</div>
			</>
		)
	}
}


export default App 