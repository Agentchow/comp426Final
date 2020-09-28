import React, { Fragment, useState, useEffect, Component } from 'react';
import StepWizard from 'react-step-wizard';
import Nav from './nav';

import styles from './wizard.less';
import transitions from './transitions.less';
import axios from "axios";

const Onboarding = () => {
    const [state, updateState] = useState({
        form: {
        },
        transitions: {
            enterRight: `${transitions.animated} ${transitions.enterRight}`,
            enterLeft: `${transitions.animated} ${transitions.enterLeft}`,
            exitRight: `${transitions.animated} ${transitions.exitRight}`,
            exitLeft: `${transitions.animated} ${transitions.exitLeft}`,
            intro: `${transitions.animated} ${transitions.intro}`,
        },

        // demo: true, // uncomment to see more
    });

    const updateForm = (key, value) => {
        const { form } = state;

        form[key] = value;
        updateState({
            ...state,
            form,
        });
    };

    // Do something on step change
    const onStepChange = (stats) => {
        // console.log(stats);
    };

    const setInstance = SW => updateState({
        ...state,
        SW,
    });

    const { SW, demo } = state;

    return (
        <div className='container'>
            <h3>My Path Introduction!</h3>
            <div className={'jumbotron'}>
                <div className='row'>
                    <div className={`col-12 col-sm-6 offset-sm-3 ${styles['rsw-wrapper']}`}>
                        <StepWizard
                            onStepChange={onStepChange}
                            isHashEnabled
                            transitions={state.transitions} // comment out for default transitions
                            instance={setInstance}
                        >
                            <First hashKey={'FirstStep'} update={updateForm} />
                            <Second form={state.form} />
                            <Third update={updateForm} form={state.form} />
                            <Location form={state.form} />
                            {/* <Results form={state.form}/> */}
                            <Fourth form={state.form} />
                            {/* <Progress /> */}
                            {null /* will be ignored */}
                            <Last hashKey={'TheEnd!'} form={state.form} />
                        </StepWizard>
                    </div>
                </div>
            </div>
            {/* { (demo && SW) && <InstanceDemo SW={SW} /> } */}
        </div>
    );
};

export default Onboarding;


/**
 * Stats Component - to illustrate the possible functions
 * Could be used for nav buttons or overview
 */
const Stats = ({
    currentStep,
    firstStep,
    goToStep,
    lastStep,
    nextStep,
    previousStep,
    totalSteps,
    step,
}) => (
        <div>
            <hr />
            { step > 1 &&
                <button className='btn btn-default btn-block' onClick={previousStep}>Go Back</button>
            }
            { step < totalSteps ?
                <button className='btn btn-primary btn-block' onClick={nextStep}>Continue</button>
                :
                <button className='btn btn-success btn-block' onClick={nextStep}>Finish</button>
            }
            <hr />

        </div>
    );

/** Steps */

const First = props => {
    const update = (e) => {
        props.update(e.target.name, e.target.value);
    };

    return (
        <div>
            <h3 className='text-center'>Welcome to My Path! We need some data to get you started!</h3>

            <label>First Name</label>
            <input type='text' className='form-control' name='firstname' placeholder='First Name'
                onChange={update} />

            <label>Last Name</label>
            <input type='text' className='form-control' name='lastname' placeholder='Last Name'
                onChange={update} />

            <label>Age</label>
            <input type="number" className='form-control' name='age' placeholder='Age'
                onChange={update} />

            <Stats step={1} {...props} />
        </div>
    );
};

const Second = props => {
    const validate = () => {
        if (confirm('Are you sure you want to go back?')) { // eslint-disable-line
            props.previousStep();
        }
    };

    return (
        <div>
            { props.form.firstname && <h3>Hi {props.form.firstname} {props.form.lastname}! 👋</h3>}
            <h3> We are going to get some more information about you now!</h3>
            <Stats step={2} {...props} previousStep={validate} />
        </div>
    );
};

const Third = props => {
    const update = (e) => {
        props.update(e.target.name, e.target.value);
    };
    return (
        <div>

            {/* <label>Where do you live? (City, State)</label>
        <input type='text' className='form-control' name='area' placeholder=''
            onChange={update} /> */}

            <label>What grade are you in?</label>
            <input type="number" className='form-control' name='grade' placeholder=''
                onChange={update} />

            <label>Why did you sign up for My Path?</label>
            <input type='text' className='form-control' name='reason' placeholder=''
                onChange={update} />

            <label>Please enter your zipcode</label>
            <input type='text' className='form-control' name='zipcode' placeholder=''
                onChange={update} />

            <label>Please enter your address</label>
            <input type='text' className='form-control' name='addr' placeholder=''
                onChange={update} />


            <Stats step={3} {...props} />
        </div>
    );
};

class Location extends Component {

    constructor(props) {
        super(props);

        this.state = {
            wealthReading: "",
            financeReading: "",
            techReading: ""
        }
    }

    analyze() {
        var data = {
            "zipcode": this.props.form.zipcode,
            "address": this.props.form.addr
        }

        axios.post("http://127.0.0.1:5000/predict", data)
            .then(res => {
                this.setState({ wealthReading: res.data["wealth"] });
                this.setState({ financeReading: res.data["autofinance"] });
                this.setState({ techReading: res.data["tech"] });
            })
    }


    render() {
        return (
            <div>
                <h3> One metric we want to look at is the effect where you live has on your financial possibilites.</h3>
                <h5> We are now going to show you 3 scores.
        <br></br>
        These include:
        <br></br>
                    <br></br>

        1. The Wealth Score which measures the
        wealth percentile individuals in your location have

        <h1>{this.state.wealthReading}</h1>
                    <br></br>
                    <br></br>

        2. The Auto Finance Score which measures how
        likely individuals are to finance a vehicle.
        <h1>{this.state.financeReading}</h1>
                    <br></br>
                    <br></br>

        3. The New Tech Score which measures how likely
        individuals are to purchase new technology.
        <h1>{this.state.techReading}</h1>
                    <br></br>
                    <br></br>

        At My Path we want to financially empower you and help you build wealth no matter where you are from!
      </h5>
                <button onClick={this.analyze.bind(this)}>Analyze</button>


                <Stats step={4} {...this.props} />
            </div>
        );
    }
};

// const Results = props => {
//   const validate = () => {
//       if (confirm('Are you sure you want to go back?')) { // eslint-disable-line
//           props.previousStep();
//       }
//   };

//   return (
//       <div>
//           { <h3>Thanks {props.form.firstname} {props.form.lastname}!</h3> }
//           <h3> Now lets match you with the best mentor!</h3>
//           <Stats step={6} {...props} previousStep={validate} />
//       </div>
//   );
// };




const Fourth = props => {
    const validate = () => {
        if (confirm('Are you sure you want to go back?')) { // eslint-disable-line
            props.previousStep();
        }
    };

    return (
        <div>
            {}
            { <h3>Thanks {props.form.firstname} {props.form.lastname}!</h3>}
            <h3> Now lets match you with the best mentor!</h3>
            <Stats step={5} {...props} previousStep={validate} />
        </div>
    );
};

const Last = (props) => {

    const submit = () => {
        var data = {
            "firstName": props.form.firstname,
            "lastName": props.form.lastname,
            "age": props.form.age
        }
        axios.post("http://127.0.0.1:5000/match", data)
            .then(res => {
                console.log("here");
                console.log(res.data[0][0]);
                var match = res.data[0][0]["firstName"] + " " + res.data[0][0]["lastName"]
                alert('You mentor info is ' + match);
            })

    };


    return (
        <div>
            {/* {getMatch()} */}
            <div className={'text-center'}>
                <h3>We have found the best match! Click Finish to view your mentor's info!</h3>
                <hr />
            </div>
            <Stats step={5} {...props} nextStep={submit} />
        </div>
    );
};

const Progress = (props) => {
    const [state, updateState] = useState({
        isActiveClass: '',
        timeout: null,
    });

    useEffect(() => {
        const { timeout } = state;

        if (props.isActive && !timeout) {
            updateState({
                isActiveClass: styles.loaded,
                timeout: setTimeout(() => {
                    props.nextStep();
                }, 3000),
            });
        } else if (!props.isActive && timeout) {
            clearTimeout(timeout);
            updateState({
                isActiveClass: '',
                timeout: null,
            });
        }
    });

    return (
        <div className={styles['progress-wrapper']}>
            <p className='text-center'>Automated Progress...</p>
            <div className={`${styles.progress} ${state.isActiveClass}`}>
                <div className={`${styles['progress-bar']} progress-bar-striped`} />
            </div>
        </div>
    );
};

