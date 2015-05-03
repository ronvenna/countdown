var TIMING = {
	WORK_INTERVAL: 25,
	BREAK_INTERVAL: 5
}


var NavBar = React.createClass({

	showSettings: function(){
		React.unmountComponentAtNode(document.getElementById("message"));
		React.render(<Settings/>, document.getElementById("message"));
	},

	showAbout: function(){
		React.unmountComponentAtNode(document.getElementById("message"));
		React.render(<Intro/>, document.getElementById("message"));
	},

	render: function(){
		return(
			<div className="header">
				<h1 id="title">Countdown.me</h1>
				<h2 onClick={this.showSettings} className="rightNavBarItem"> Settings </h2>
				<h2 onClick={this.showAbout} className="rightNavBarItem"> About </h2>				
			</div>
		)
	}
});

var Settings = React.createClass({

	componentDidMount: function(){
		$("#settings-header").animate({
			height: "75px"
		}, 400);
	},

	dismount: function(){
		$("#settings-header").animate({
			height: "0px"
		}, 400, this.unMount);
	},

	unMount: function(){
		React.unmountComponentAtNode(document.getElementById("message"));
	},

	setTimes: function(){
		var workTime = parseInt(this.refs.workTime.getDOMNode().value);
		var breakTime = parseInt(this.refs.breakTime.getDOMNode().value);
		TIMING.BREAK_INTERVAL = breakTime;
		TIMING.WORK_INTERVAL = workTime;
		this.dismount();
	},

	render: function(){
		return(
			<div className="settings" id="settings-header">
			<h3> Work Interval </h3>
				<select className="settings-dropdown form-control" ref="workTime">
					<option value="25">25 min  (Default)</option>     
					<option value="30">30 min</option>
	    			<option value="20">20 min</option>
	    			<option value="10">10 min</option>
	    			<option value="5">5 min</option> 
	    		</select>
			<h3> Break Interval </h3>
				<select className="settings-dropdown form-control" ref="breakTime">
					<option value="5">5 min  (Default)</option>     
					<option value="15">15 min</option>
	   				<option value="10">10 min</option>
	    			<option value="1">1 min</option>
	    		</select>

	    	<span className="setting-cancel" onClick={this.dismount}>X</span>
	    	<button className="setting-submit-btn btn" onClick={this.setTimes}> SET </button>
			</div> 
		)
	}

});

var Message = React.createClass({

	componentDidMount: function(){
		$("#message-header").animate({
			height: "75px"
		}, 400);

		setTimeout(this.dismount, 2000);
	},

	dismount: function(){
		$("#message-header").animate({
			height: "0px"
		}, 400, this.unMount);
	},

	unMount: function(){
		React.unmountComponentAtNode(document.getElementById("message"));
	},

	render: function(){
		return(
			<div className={this.props.color} id="message-header">
				<h1> {this.props.message} </h1>
			</div> 
		)
	}
});

var Intro = React.createClass({

	componentDidMount: function(){
		$("#intro-header").animate({
			height: "300px"
		}, 400);

		setTimeout(this.dismount, 6000);
	},

	dismount: function(){
		$("#intro-header").animate({
			height: "0px"
		}, 400, this.unMount);
	},

	unMount: function(){
		React.unmountComponentAtNode(document.getElementById("message"));
	},

	render: function(){
		var bigMessage = "Countdown.Me is a tool that simplifies time managment! Inspired by the Pomodoro Technique, Countdown.Me is a timmer that splits work into 25 minuite intervals followed by 5 minuite breaks!";
		var smallMessage = "Click on Settings to modify your increments, or click start to begin working. Countdown.Me will notify you when its time for a break!";

		return(
			<div className="start" id="intro-header">
				<div className="container">
					<div className="exit-circle">
						<span onClick={this.dismount}>X</span>
					</div>
					<h1 style={{color: "#000"}}> {bigMessage} </h1>
					<h2> {smallMessage} </h2>
				</div>
			</div> 
		)
	}
});

var Timer = React.createClass({

	getInitialState: function(){
		return {started: 0, miliseconds: "000", seconds: "00", minuites: "00", hours: "00", loading: "0px", timeouts: []}
	},

	start: function(){
		//Reset the timer
		this.reset();
		//Render the message component with a color and message
		React.render(<Message message={"Lets Get to Work!"} color={"start"}/>, document.getElementById("message"));
		//Set when we clicked the submit
		this.setState({
			started: new Date().getTime()
		});
		//Iterate and when we are done lets got give it the break function
		this.iterate(function(){this.go(TIMING.WORK_INTERVAL, this.break)}.bind(this));
	},

	break: function(){
		//Reset the timer
		this.reset();
		//Play a notification sound
		var audio = new Audio('/assets/audio/notification.mp3');
		audio.play();
		//Render the message component with a color and message
		React.render(<Message message={"Break Time!"} color={"done"}/>, document.getElementById("message"));
		//Set when we clicked the submit
		this.setState({
			started: new Date().getTime()
		});
		//Iterate and when we are done lets got back to work
		this.iterate(function(){this.go(TIMING.BREAK_INTERVAL, this.start)}.bind(this));
	},

	stop: function(){
		//Reset our state
		this.reset()

		//Clear all of our pending timeouts
		for (var i = 0; i < this.state.timeouts.length; i++) {
   		 clearTimeout(this.state.timeouts[i]);
		}

		//Give a fresh array to the timeout so we are back to were we started
		var timeouts = [];
		this.setState({
			timeouts: timeouts
		})	

	},

	iterate: function(state){
		//Call the set timeout to every milisecond so we get the exact time
		timeouts = this.state.timeouts;
		timeouts.push(setTimeout(state, 1));
		this.setState({
			timeouts: timeouts
		})
	},

	go: function(time, callback){
		//Get the elapsed time
		var elapsed =  new Date().getTime() - this.state.started;
		//Create a date of the elapsed time 
		var mydate = new Date(elapsed);

		//Pull out the millisecons,seconds,min, and hours from the date
		var miliseconds = parseInt(elapsed.toString().replace(/.(?=.{3})/g, ''));
		miliseconds = (miliseconds < 100 ? ("00" + miliseconds) : miliseconds);
		var seconds = mydate.getUTCSeconds();
		seconds = (seconds < 10 ? ("0" + seconds) : seconds);
		var minuites = mydate.getUTCMinutes();
		minuites = (minuites < 10 ? ("0" + minuites) : minuites);
		var hours = mydate.getUTCHours();
		hours = (hours < 10 ? ("0" + hours) : hours);

		//Figuire out the loading time, to render the loading bar
		loading = ((elapsed/(time * 60000)) * 500) 

		//If we are below the threshhold then keep itterating, else throw the callback
		if(loading < 500){
			this.setState({
				miliseconds: miliseconds, 
				seconds: seconds, 
				minuites: minuites,
				hours: hours,
				loading: loading.toString() + "px"
			});

			this.iterate(function(){this.go(time, callback)}.bind(this));
		}
		else{
			callback();
		}
	},

	reset: function(){
		//Reset our state back to when we started
		this.setState({
			started: 0, miliseconds: "000", seconds: "00", minuites: "00", hours: "00", loading: "0px"
		})
	},

	render: function(){
		return(
			<div>
				<div className="loading1" style={{height: this.state.loading}}>
				</div>
				<div className="vertical-center">
					<h1>{this.state.hours + ":" + this.state.minuites + ":" + this.state.seconds}</h1>
					<p> {this.state.miliseconds} </p>
				</div>
			</div>
		)
	}
});

var TimerContainer = React.createClass({

	start: function(){
		this.refs.timer.start();
	},

	reset: function(){
		this.refs.timer.stop();
	},

	render: function(){
		return(
			<div>
				<div className="row">
				    	<div id="timer" className="center-item">
				    		<Timer ref="timer"/>
				    	</div>
				</div>
				<div className="row">
				    	 <div className="center-item" id="buttons">
				    		<button className="btn" onClick={this.start}> Start </button>
				    		<button className="btn" onClick={this.reset}> Reset </button>
				    	</div>
				</div>
			</div>
		)
	}

});


var Countdown = React.createClass({

	componentDidMount: function(){
		React.render(<Intro/>, document.getElementById("message"));
	},

	render: function(){
		return(
			<div>
				<div id="message">
				</div>

				<div className="container">
					<NavBar/>
					<TimerContainer/>
				</div>
			</div>
		)
	}
});


var Main = function(){
	React.render(<Countdown/>, document.getElementById("countdown"));
};