import React, { Fragment, useState, useEffect } from 'react';
import StepWizard from 'react-step-wizard';

import Nav from './nav';

import styles from './wizard.less';
import transitions from './transitions.less';
import axios from "axios";

const Simulations = () => {
    const [state, updateState] = useState({
        form: {},
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
                            
                            <Last hashKey={'TheEnd!'} form={state.form}/>
                        </StepWizard>
                    </div>
                </div>
            </div>
            {/* { (demo && SW) && <InstanceDemo SW={SW} /> } */}
        </div>
    );
};

export default Simulations;


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
            <h3 className='text-center'>Welcome to the Savings Simulation!</h3>
            <h3> Let's figure how much you should save a month for something you want!</h3>

            <label>How much do you need to save?</label>
            <input type='number' className='form-control' name='saving' placeholder=''
                onChange={update} />

            <label>How much do you have right now?</label>
            <input type='number' className='form-control' name='current' placeholder=''
                onChange={update} />

            <label>How long do you want to keep saving in months?</label>
            <input type='number' className='form-control' name='time' placeholder=''
                onChange={update} />
            
            <label>Annual rate? (0 if not saving at a bank)</label>
            <input type='number' className='form-control' name='rate' placeholder=''
                onChange={update} />

            <Stats step={1} {...props} />
        </div>
    );
};



const Last = (props) => {

  const submit = () => {
    var data = {
      "saving" : props.form.saving,
      "current" : props.form.current,
      "time" : props.form.time,
      "rate" : props.form.rate
    }
    axios.post("http://127.0.0.1:5000/calculateSavings", data)
    .then(res => {
      var val = Math.abs(Math.round(res.data));
      alert('You need to save for ' + parseInt(val) + " months. Good Luck!");
    })

  };


  return (
      <div>
          {/* {getMatch()} */}
          <div className={'text-center'}>
              <h3>Great! Let's see how much you need to save a month!</h3>
              <hr />
          </div>
          <Stats step={2} {...props} nextStep={submit} />
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

